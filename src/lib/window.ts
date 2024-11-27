import { getCurrentWindow, Effect, type WindowOptions } from '@tauri-apps/api/window';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import type { WebviewOptions } from '@tauri-apps/api/webview';
import type { DialogData } from '../routes/dialogs/delete';
import { emit } from '@tauri-apps/api/event';
import type { FormDialog, FormType } from './form';

export function createWindow(label: string, blurredBackground: boolean, options: Omit<WebviewOptions, "x" | "y" | "width" | "height"> & WindowOptions): Promise<WebviewWindow> {
      return new Promise((resolve, reject) => {
            const appWindow = new WebviewWindow(label, {
                  ...options,
                  transparent: blurredBackground,
                  windowEffects: {
                        effects: blurredBackground ? [Effect.Mica, Effect.Acrylic, Effect.Blur, Effect.WindowBackground] : [],
                        ...options.windowEffects
                  },
            });
            appWindow.once('tauri://created', function () {
                  // window successfully created
                  console.warn('window created');
                  resolve(appWindow);
            });
            appWindow.once('tauri://error', function (e) {
                  // an error happened creating the window
                  reject(e);
            });
      });
}

export async function createDeleteDialog(data: DialogData): Promise<boolean> {
      const appWindow = await createWindow("dialog", true, {
            url: '/dialogs',
            title: data.title,
            parent: getCurrentWindow(),
            width: 512,
            height: 176,
            center: true,
            resizable: false,
            skipTaskbar: true,
            minimizable: false,
            maximizable: false,
            fullscreen: false,
      });
      appWindow.once('ready', () => {
            emit('data', data);
      });
      return new Promise((resolve) => {
            appWindow.once<boolean>('dialog', (response) => {
                  resolve(response.payload);
            });
      });
}

export async function createFormDialog<T>(type: FormType, pathname: string, title: string, data: T): Promise<T> {
      const appWindow = await createWindow("dialog", true, {
            url: '/dialogs' + pathname,
            title: title,
            parent: getCurrentWindow(),
            width: 512,
            height: 512,
            center: true,
            resizable: false,
            skipTaskbar: true,
            minimizable: false,
            maximizable: false,
            fullscreen: false,
      });
      appWindow.once('ready', () => {
            emit('data', {
                  type,
                  title,
                  data
            } satisfies FormDialog<T>);
      });
      return new Promise((resolve) => {
            appWindow.once<T>('dialog', (response) => {
                  resolve(response.payload);
            });
      });
}