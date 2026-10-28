import type { Currency, SpotId } from './i18n';

export const EMAIL = 'business.botato@gmail.com';

export const BANK = {
  holder: 'SALAHEDDINE BOUKHANOU',
  rib: '230 780 3944446211014100 16',
  iban: 'MA64 2307 8039 4444 6211 0141 0016',
  swift: 'CIHMMAMC',
};

export const MAX_VIDEOS = 10;

/** Price per video, per spot. "Both" = sum of the two. EUR prices are rounded, not live-converted. */
export const PRICES: Record<Currency, Record<SpotId, number>> = {
  MAD: { tv: 200, gs: 300 },
  EUR: { tv: 20, gs: 30 },
};

type Pt = [number, number];

export type Spot = {
  id: SpotId;
  /** Visible outline of the screen in the 1200x678 studio photo. */
  outline: Pt[];
  /** Corners (TL, TR, BR, BL) where ad content gets projected. */
  quad: [Pt, Pt, Pt, Pt];
  /** Size of the flat content box before projection (sets its aspect ratio). */
  box: [number, number];
  /** Where the floating label sits, in photo pixels. */
  label: Pt;
};

export const STAGE = { w: 1200, h: 678 };

export const SPOTS: Spot[] = [
  {
    id: 'tv',
    outline: [[34, 0], [90, 0], [92, 6], [248, 50], [248, 178], [39, 157]],
    quad: [[40, 4], [244, 56], [244, 174], [43, 154]],
    box: [300, 190],
    label: [140, 200],
  },
  {
    id: 'gs',
    outline: [[633, 61], [990, 50], [985, 345], [630, 350]],
    quad: [[640, 68], [982, 58], [978, 338], [637, 342]],
    box: [360, 290],
    label: [810, 30],
  },
];
