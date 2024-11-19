import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export enum Theme {
      Light,
      Dark,
      Vibrant,
      OperatingSystem
}

const classMap = {
      [Theme.Light]: 'light',
      [Theme.Dark]: 'dark',
      [Theme.Vibrant]: 'vibrant',
      [Theme.OperatingSystem]: ''
} satisfies Record<Theme, string | undefined>;

const localStorageName = {
      [Theme.Light]: 'light',
      [Theme.Dark]: 'dark',
      [Theme.Vibrant]: 'vibrant',
      [Theme.OperatingSystem]: 'os'
} satisfies Record<Theme, string | undefined>;

export default (function () {
      const { set, subscribe } = writable<Theme | undefined>();
      if (browser) {
            if ('theme' in localStorage) {
                  // user set theme
                  const theme = Object
                        .values(localStorageName)
                        .findIndex((t) => t == localStorage.theme);
                  if (theme != -1) setTheme(theme as Theme);
                  else setTheme(Theme.OperatingSystem);
            } else setTheme(Theme.OperatingSystem);
      }
      function setTheme(theme: Theme) {
            console.log('setTheme', theme, classMap[theme]);
            // update store
            set(theme);
            // clear all other theme classes
            document.documentElement.classList.remove(
                  ...Object
                        .values(classMap)
                        .map(s => s.split(" "))
                        .flat()
                        .filter((t) => t.length)
            );
            // save & apply
            if (theme != Theme.OperatingSystem) {
                  // user set theme
                  document.documentElement.classList.add(...classMap[theme].split(" "));
            } else {
                  // os pref
                  document.documentElement.classList.add(
                        window.matchMedia('(prefers-color-scheme: dark)').matches
                              ? classMap[Theme.Dark]
                              : classMap[Theme.Light]
                  );
            }
            localStorage.setItem('theme', localStorageName[theme]);
      }
      return {
            set: setTheme,
            subscribe
      };
})();