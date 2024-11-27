use base64::{engine::general_purpose::STANDARD as base64, Engine};
use serde_json::{json, Value};
use tokio::net::TcpStream;
use std::sync::Arc;
use tauri::{command, AppHandle, Manager, State, Emitter};
use tokio::sync::{mpsc, Mutex};
use tokio::time::{sleep, Duration};
use tokio_tungstenite::{connect_async, tungstenite::protocol::Message};
use futures_util::{SinkExt, StreamExt};
use native_tls::{self, TlsConnector};
use tokio_tungstenite::{Connector, MaybeTlsStream, WebSocketStream};
use tokio_tungstenite::connect_async_tls_with_config;
use http::Uri;
use http::header::{HeaderName, HeaderValue};


const RECONNECT_DELAY: Duration = Duration::from_secs(5);
const WEBSOCKET_CHANNEL_SIZE: usize = 16;

#[derive(Default)]
struct LeagueClientState {
    tx: Arc<Mutex<Option<mpsc::Sender<String>>>>,
    is_connected: Arc<Mutex<bool>>,
}

#[derive(Debug, thiserror::Error)]
enum WebsocketError {
    #[error("Websocket not initialized")]
    NotInitialized,
    #[error("League Client Error: {0}")]
    LeagueClient(String),
    #[error("Serialization Error: {0}")]
    Serialization(#[from] serde_json::Error),
    #[error("Channel error: {0}")]
    Channel(#[from] tokio::sync::mpsc::error::SendError<String>),
    #[error("IO Error: {0}")]
    Io(#[from] std::io::Error),
    #[error("URL Parse Error: {0}")]
    UrlParse(#[from] url::ParseError),
    #[error("WebSocket Error: {0}")]
    WebSocket(#[from] tokio_tungstenite::tungstenite::Error),
}

type Result<T> = std::result::Result<T, WebsocketError>;

#[command]
async fn create_league_client_websocket(
    app: AppHandle,
    state: State<'_, LeagueClientState>,
) -> std::result::Result<(), String> {
    loop {
        match attempt_connection(&app, &state).await {
            Ok(_) => break,
            Err(e) => {
                eprintln!("Connection attempt failed: {}", e);
                sleep(RECONNECT_DELAY).await;
            }
        }
    }
    Ok(())
}

async fn attempt_connection(app: &AppHandle, state: &State<'_, LeagueClientState>) -> Result<()> {
    let (port, password) = get_client_credentials()?;
    let ws_stream = connect_to_client(port, &password).await?;
    let (tx, rx) = mpsc::channel(WEBSOCKET_CHANNEL_SIZE);
    setup_connection_state(state, tx).await;
    
    spawn_message_handlers(app.clone(), state.is_connected.clone(), rx, ws_stream);
    Ok(())
}

fn get_client_credentials() -> Result<(String, String)> {
    let lockfile = get_lockfile()?;
    parse_lockfile(&lockfile)
}

fn get_lockfile() -> Result<String> {
    let lockfile_path = if cfg!(windows) {
        r"C:\Riot Games\League of Legends\lockfile"
    } else {
        "/Applications/League of Legends.app/Contents/LoL/lockfile"
    };

    std::fs::read_to_string(lockfile_path)
        .map_err(|e| e.into())
}

fn parse_lockfile(content: &str) -> Result<(String, String)> {
    let parts: Vec<&str> = content.split(':').collect();
    if parts.len() < 5 {
        return Err(WebsocketError::LeagueClient("Invalid lockfile format".into()));
    }
    Ok((parts[2].to_string(), parts[3].to_string()))
}



async fn connect_to_client(
    port: String,
    password: &str,
) -> std::result::Result<WebSocketStream<MaybeTlsStream<TcpStream>>, WebsocketError> {
    let ws_url = format!("wss://127.0.0.1:{}", port);

    
    let uri: Uri = ws_url.parse().expect("error parsing url");

  
    let auth = format!("riot:{}", password);
    let auth_header = format!("Basic {}", base64.encode(auth));

    let mut request = tokio_tungstenite::tungstenite::handshake::client::Request::builder()
        .method("GET")
        .uri(&ws_url)
        .header("Host", uri.host().unwrap())
        .header("Authorization", auth_header)
        .header("Sec-WebSocket-Key", generate_key())
        .header("Sec-WebSocket-Version", "13")
        .header("Connection", "Upgrade")
        .header("Upgrade", "websocket")
        .body(())
        .map_err(|e| WebsocketError::WebSocket(e.into()))?;

    let tls_connector = native_tls::TlsConnector::builder()
        .danger_accept_invalid_certs(true)
        .danger_accept_invalid_hostnames(true)
        .build()
        .map_err(|e| WebsocketError::LeagueClient(e.to_string()))?;

    let connector = Connector::NativeTls(tls_connector);

    let  ( mut ws_stream, _) = connect_async_tls_with_config(
        request,
        None,      
        false,         
        Some(connector) 
    ).await.map_err(WebsocketError::WebSocket)?;

    let subscription_message = json!([5, "OnJsonApiEvent"]).to_string();
    ws_stream
    .send(Message::Text(subscription_message))
    .await
    .map_err(WebsocketError::WebSocket)?;

    Ok(ws_stream)
}
fn generate_key() -> String {
    let mut key = [0u8; 16];
    getrandom::getrandom(&mut key).unwrap();
    base64::encode(&key)
}
async fn setup_connection_state(state: &LeagueClientState, tx: mpsc::Sender<String>) {
    *state.tx.lock().await = Some(tx);
    *state.is_connected.lock().await = true;
}
fn spawn_message_handlers(
    app: AppHandle,
    is_connected: Arc<Mutex<bool>>,
    mut rx: mpsc::Receiver<String>,
    mut ws_stream: tokio_tungstenite::WebSocketStream<tokio_tungstenite::MaybeTlsStream<tokio::net::TcpStream>>,
) {
    tokio::spawn(async move {
        while *is_connected.lock().await {
            tokio::select! {
                Some(msg) = rx.recv() => {
                    if let Err(e) = ws_stream.send(Message::Text(msg)).await {
                        eprintln!("Failed to send message: {}", e);
                    }
                }
                msg = ws_stream.next() => {
                    match msg {
                        Some(Ok(Message::Text(text))) => {
                            println!("New message: {}", text);
                            if let Err(e) = app.emit("league-client-websocket-message", text) {
                                eprintln!("Failed to emit WebSocket message: {}", e);
                            }
                        }
                        Some(Ok(Message::Close(_))) => {
                            *is_connected.lock().await = false;
                            break;
                        }
                        Some(Err(e)) => {
                            eprintln!("WebSocket error: {}", e);
                            *is_connected.lock().await = false;
                            break;
                        }
                        _ => {}
                    }
                }
            }
        }
    });
}
#[command]
async fn send_message_to_client(
    message: String,
    state: State<'_, LeagueClientState>,
) -> std::result::Result<(), String> {
    match &*state.tx.lock().await {
        Some(tx) => tx.send(message).await.map_err(|e| e.to_string()),
        None => Err("Websocket not initialized".to_string()),
    }
}

#[command]
async fn destroy_league_client_connection(
    state: State<'_, LeagueClientState>,
) -> std::result::Result<(), String> {
    *state.tx.lock().await = None;
    *state.is_connected.lock().await = false;
    Ok(())
}

#[command]
async fn is_websocket_connected(
    state: State<'_, LeagueClientState>,
) -> std::result::Result<bool, String> {
    Ok(*state.is_connected.lock().await)
}

pub fn run() {
    tauri::Builder::default()
        .manage(LeagueClientState::default())
        .invoke_handler(tauri::generate_handler![
            create_league_client_websocket,
            send_message_to_client,
            destroy_league_client_connection,
            is_websocket_connected
        ])
        .setup(|app| {
            let app_handle = Arc::new(app.handle().clone());
            let app_handle_clone = Arc::clone(&app_handle);

            tauri::async_runtime::spawn(async move {
                let state = app_handle_clone.state::<LeagueClientState>();
                if let Err(e) = create_league_client_websocket((*app_handle_clone).clone(), state).await
                {
                    eprintln!("Failed to create initial WebSocket connection: {}", e);
                }
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}