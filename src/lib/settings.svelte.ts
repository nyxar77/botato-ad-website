import { dict, type Currency, type Lang, type SpotId } from './i18n';
import { PRICES } from './config';

class Settings {
  // Always default to Arabic, MAD (Dirhams), and Light Mode
  lang = $state<Lang>('ar');
  currency = $state<Currency>('MAD');
  currencyIsAuto = $state(false);
  dark = $state(false);

  t = $derived(dict[this.lang]);

  setLang(l: Lang) {
    this.lang = l;
  }
  setCurrency(c: Currency) {
    this.currency = c;
    this.currencyIsAuto = false;
  }
  toggleTheme() {
    this.dark = !this.dark;
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
