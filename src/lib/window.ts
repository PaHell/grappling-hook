import { Effect, Window, type WindowOptions } from '@tauri-apps/api/window';

export function createWindow(label: string, blur: boolean, windowOptions: WindowOptions): Promise<Window> {
      return new Promise((resolve, reject) => {
            const appWindow = new Window(label, {
                  ...windowOptions,
                  transparent: blur,
                  windowEffects: {
                        effects: blur ? [Effect.Mica, Effect.Acrylic, Effect.Blur, Effect.WindowBackground] : [],
                        ...windowOptions.windowEffects
                  },
            });
            appWindow.once('tauri://created', function () {
                  // window successfully created
                  resolve(appWindow);
            });
            appWindow.once('tauri://error', function (e) {
                  // an error happened creating the window
                  reject(e);
            });
      });
}