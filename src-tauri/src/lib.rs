use league_client::client;
use serde_json;
use std::sync::Arc;
use tauri::{command, AppHandle, Emitter, Manager, State};
use tauri_plugin_fs::FsExt;
use tauri_plugin_sql::{Migration, MigrationKind};
use tokio::sync::{mpsc, Mutex};

// Shared state to store the sender for the WebSocket
#[derive(Default)]
struct WebSocketState {
    tx: Arc<Mutex<Option<mpsc::Sender<String>>>>,
    is_active: Arc<Mutex<bool>>, // Tracks whether the connection is active
}

#[command]
async fn create_league_client_websocket(
    app: AppHandle,
    state: State<'_, WebSocketState>,
) -> Result<(), String> {
    let builder = client::Client::builder().map_err(|e| e.to_string())?;
    let lc = builder.insecure(true).build().map_err(|e| e.to_string())?;

    let connected = lc.connect_to_socket().await.map_err(|e| e.to_string())?;

    let speaker = league_client::subscribe(connected).await;

    let msg = (5, "OnJsonApiEvent");
    let msg = serde_json::to_string(&msg).map_err(|e| e.to_string())?;
    speaker.send(msg).await.map_err(|e| e.to_string())?;

    let (tx, rx) = tokio::sync::mpsc::channel::<String>(32);

    let reader = speaker.reader.clone();
    let sender = speaker;

    {
        let mut shared_tx = state.tx.lock().await;
        *shared_tx = Some(tx);
    }

    {
        let mut is_active = state.is_active.lock().await;
        *is_active = true;
    }

    tokio::spawn({
        let app = app.clone();
        let is_active = state.is_active.clone();
        async move {
            while *is_active.lock().await {
                if let Ok(msg) = reader.recv_async().await {
                    match serde_json::to_string(&msg.into_message()) {
                        Ok(json_message) => {
                            if let Err(e) =
                                app.emit("league-client-websocket-message", json_message)
                            {
                                eprintln!("Failed to emit WebSocket message: {}", e);
                            }
                        }
                        Err(e) => eprintln!("Failed to serialize WebSocket message: {}", e),
                    }
                }
            }
        }
    });

    tokio::spawn(async move {
        let mut rx = rx;
        while let Some(msg) = rx.recv().await {
            if let Err(e) = sender.send(msg).await {
                eprintln!("Failed to send message: {}", e);
            }
        }
    });

    Ok(())
}

#[command]
async fn send_message_to_websocket(
    message: String,
    state: State<'_, WebSocketState>,
) -> Result<(), String> {
    let shared_tx = state.tx.lock().await;

    if let Some(tx) = &*shared_tx {
        tx.send(message).await.map_err(|e| e.to_string())?;
        Ok(())
    } else {
        Err("WebSocket is not initialized.".to_string())
    }
}

#[command]
async fn destroy_league_client_websocket(state: State<'_, WebSocketState>) -> Result<(), String> {
    {
        let mut is_active = state.is_active.lock().await;
        *is_active = false; // Signal tasks to stop
    }

    {
        let mut shared_tx = state.tx.lock().await;
        *shared_tx = None; // Clear the sender
    }

    Ok(())
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![
        // Define your migrations here
        Migration {
            version: 1,
            description: "create_initial_tables",
            sql: "CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT);",
            kind: MigrationKind::Up,
        },
    ];
    tauri::Builder::default()
        .manage(WebSocketState::default())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_websocket::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_log::Builder::new().build())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:app.sqlite", migrations)
                .build(),
        )
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            create_league_client_websocket,
            destroy_league_client_websocket,
            send_message_to_websocket
        ])
        .setup(|app| {
            let _window = app.get_webview_window("main").unwrap();
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
