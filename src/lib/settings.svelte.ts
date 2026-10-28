import { dict, LANGS, type Currency, type Lang, type SpotId } from './i18n';
import { PRICES } from './config';

const KEY = { lang: 'botato:lang', cur: 'botato:currency', theme: 'botato:theme' };

const read = (k: string) => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};
const write = (k: string, v: string) => {
  try {
    localStorage.setItem(k, v);
  } catch {}
};

/** First supported language from the browser/system preferences, else English. */
export function detectLang(): Lang {
  const prefs = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const p of prefs) {
    const base = p?.toLowerCase().split('-')[0];
    if (LANGS.some((l) => l.code === base)) return base as Lang;
  }
  return 'en';
}

/**
 * Dirhams for visitors in Morocco, euros for everyone else.
 * Signals: system time zone, then any browser locale with an MA region (e.g. ar-MA, fr-MA).
 */
export function detectCurrency(): Currency {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
    if (tz === 'Africa/Casablanca' || tz === 'Africa/El_Aaiun') return 'MAD';
  } catch {}
  const prefs = navigator.languages?.length ? navigator.languages : [navigator.language];
  if (prefs.some((p) => /-ma\b/i.test(p ?? ''))) return 'MAD';
  return 'EUR';
}

class Settings {
  lang = $state<Lang>((read(KEY.lang) as Lang) || detectLang());
  currency = $state<Currency>((read(KEY.cur) as Currency) || detectCurrency());
  currencyIsAuto = $state(!read(KEY.cur));
  dark = $state(document.documentElement.classList.contains('dark'));

  t = $derived(dict[this.lang]);

  setLang(l: Lang) {
    this.lang = l;
    write(KEY.lang, l);
  }
  setCurrency(c: Currency) {
    this.currency = c;
    this.currencyIsAuto = false;
    write(KEY.cur, c);
  }
  toggleTheme() {
    this.dark = !this.dark;
    write(KEY.theme, this.dark ? 'dark' : 'light');
  }

  /** "300 DH", "300 د.م", "30 €", "€30" depending on language + currency. */
  money(n: number) {
    const num = new Intl.NumberFormat(this.lang === 'fr' ? 'fr-FR' : 'en-US').format(n);
    if (this.currency === 'MAD') return this.lang === 'ar' ? `${num} د.م` : `${num} DH`;
    return this.lang === 'en' ? `€${num}` : `${num} €`;
  }

  price(spots: SpotId[]) {
    return spots.reduce((s, id) => s + PRICES[this.currency][id], 0);
  }
}

export const settings = new Settings();
