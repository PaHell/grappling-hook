import { migrate } from '$lib/database/migrate';
import type { LayoutLoad } from './$types';

// Tauri doesn't have a Node.js server to do proper SSR
// so we will use adapter-static to prerender the app (SSG)
// See: https://v2.tauri.app/start/frontend/sveltekit/ for more info
export const prerender = true;
export const ssr = false;


export const load: LayoutLoad = async () => {
      await migrate();
      return {};
};