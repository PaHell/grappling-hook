import type { LayoutLoad } from './$types';
import { browser } from "$app/environment";
import { setLocale } from "$i18n/i18n-svelte";
import { locales } from "$i18n/i18n-util";
import { loadLocaleAsync } from "$i18n/i18n-util.async";
import { QueryClient } from '@tanstack/svelte-query';

// Tauri doesn't have a Node.js server to do proper SSR
// so we will use adapter-static to prerender the app (SSG)
// See: https://v2.tauri.app/start/frontend/sveltekit/ for more info
export const prerender = true;
export const ssr = false;
export const trailingSlash = 'always';


export const load: LayoutLoad = async () => {
      // locale
      let userLocale: string | undefined;
      if (browser) userLocale = localStorage.getItem("locale") ?? navigator.language;
      const locale = locales.find((l) => userLocale?.includes(l)) ?? locales[0];
      await loadLocaleAsync(locale);
      setLocale(locale);
      // queries
      const queryClient = new QueryClient({
            defaultOptions: {
                  queries: {
                        enabled: browser
                  }
            }
      });
      return {
            queryClient
      };
};