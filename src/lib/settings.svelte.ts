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

/** First supported language from the browser/system preferences, falling back to Arabic ('ar') by default. */
export function detectLang(): Lang {
  const prefs = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const p of prefs) {
    const base = p?.toLowerCase().split('-')[0];
    if (LANGS.some((l) => l.code === base)) return base as Lang;
  }
  return 'ar';
}

/**
 * Dirhams by default for Morocco or when no foreign euro signal is detected;
 * switches to EUR if the user's browser timezone is in Europe (outside Morocco).
 */
export function detectCurrency(): Currency {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
    if (tz === 'Africa/Casablanca' || tz === 'Africa/El_Aaiun') return 'MAD';
    if (tz.startsWith('Europe/')) return 'EUR';
  } catch {}
  return 'MAD';
}

export function detectDark(): boolean {
  const saved = read(KEY.theme);
  if (saved === 'dark' || saved === 'light') return saved === 'dark';
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    return false;
  }
}

class Settings {
  lang = $state<Lang>((read(KEY.lang) as Lang) || detectLang());
  currency = $state<Currency>((read(KEY.cur) as Currency) || detectCurrency());
  currencyIsAuto = $state(!read(KEY.cur));
  dark = $state(detectDark());

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

  /** "600 DH", "600 د.م", "60 €", "€60" depending on language + currency. */
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
