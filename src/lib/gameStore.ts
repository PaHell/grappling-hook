import { browser } from '$app/environment';
import { onMount } from 'svelte';
import { writable } from 'svelte/store';

const COOKIE_CONFIG = 'config';
const COOKIE_CHAMPIONS = 'champions';
export const teams = {
      RED: "redTeam",
      BLUE: "blueTeam"
};

export const globalState = writable<GlobalState | {}>({});
export const error = writable<string>('');
export const config = writable<GlobalStateConfig | {}>({});

export const cookieConfig = function () {
      let init: CookieConfig = {
            redTeam: null,
            blueTeam: null,
            bestOf: 1,
            teams: []
      };
      if (browser) {
            const stored = localStorage.getItem(COOKIE_CONFIG);
            if (stored != null) init = JSON.parse(stored);
      }
      const { subscribe, set } = writable<CookieConfig>(init);
      return {
            subscribe,
            set: (val: CookieConfig) => {
                  if (browser) localStorage.setItem(
                        COOKIE_CONFIG,
                        JSON.stringify(val, null, 2)
                  );
                  set(val);
            }
      };
}();