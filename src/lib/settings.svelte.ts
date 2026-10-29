import { dict, LANGS, type Currency, type Lang, type SpotId } from './i18n';
import { PRICES } from './config';

// Dedicated keys for explicit user choices, so default is always Arabic + Light + MAD on first visit
const KEY = {
  lang: 'botato:user_lang',
  cur: 'botato:user_currency',
  theme: 'botato:user_theme',
};

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

function initialLang(): Lang {
  const saved = read(KEY.lang);
  if (saved && LANGS.some((l) => l.code === saved)) return saved as Lang;
  return 'ar';
}

function initialCurrency(): Currency {
  const saved = read(KEY.cur);
  if (saved === 'MAD' || saved === 'EUR') return saved;
  return 'MAD';
}

function initialDark(): boolean {
  const saved = read(KEY.theme);
  if (saved === 'dark' || saved === 'light') return saved === 'dark';
  return false;
}

class Settings {
  lang = $state<Lang>(initialLang());
  currency = $state<Currency>(initialCurrency());
  currencyIsAuto = $state(!read(KEY.cur));
  dark = $state(initialDark());

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
