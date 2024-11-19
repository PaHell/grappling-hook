import moment from 'moment';
import { derived } from 'svelte/store';
import 'moment/dist/locale/en-gb';
import 'moment/dist/locale/de';
import { locale } from '$i18n/i18n-svelte';

moment.defaultFormatUtc = 'LLLL';

locale.subscribe((value) => {
      if (!value) return;
      const avail = moment.locales().find((l) => l.includes(value));
      if (!avail) throw new Error(`No matching locale for iso ${value} is available`);
      moment.locale(avail);
});

export default derived([locale], () => (utc: string) => {
      return moment.utc(utc);
});