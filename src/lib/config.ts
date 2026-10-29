import type { Currency, SpotId } from './i18n';

export const EMAIL = 'business.botato@gmail.com';

export const BANK = {
  holder: 'SALAHEDDINE BOUKHANOU',
  rib: '230 780 3944446211014100 16',
  iban: 'MA64 2307 8039 4444 6211 0141 0016',
  swift: 'CIHMMAMC',
};

export const MAX_VIDEOS = 10;

/** Price per video, per spot (300 DH each, total 600 DH for both). */
export const PRICES: Record<Currency, Record<SpotId, number>> = {
  MAD: { tv: 300, gs: 300 },
  EUR: { tv: 30, gs: 30 },
};

type Pt = [number, number];

export type Spot = {
  id: SpotId;
  /** Visible outline of the screen in the 1200x678 studio photo. */
  outline: Pt[];
  /** Exact visible polygon of the screen (excluding foreground chair/plushie) in 1200x678 coordinates. */
  clip: Pt[];
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
    outline: [[35, 0], [92, 0], [94, 6], [245, 48], [246, 176], [37, 157]],
    clip: [[35, 0], [92, 0], [94, 6], [245, 48], [246, 176], [37, 157]],
    quad: [[36, 2], [245, 48], [246, 176], [37, 157]],
    box: [320, 200],
    label: [140, 200],
  },
  {
    id: 'gs',
    outline: [[638, 64], [986, 51], [950, 350], [626, 350]],
    clip: [
      [638, 64],
      [986, 51],
      [950, 345],
      [940, 350],
      [910, 350],
      [905, 340],
      [900, 332],
      [890, 326],
      [885, 325],
      [875, 328],
      [865, 335],
      [860, 350],
      [740, 350],
      [735, 342],
      [725, 326],
      [715, 301],
      [705, 280],
      [695, 264],
      [685, 258],
      [675, 254],
      [665, 250],
      [650, 248],
      [635, 247],
      [627, 245],
    ],
    quad: [[638, 64], [986, 51], [950, 350], [626, 350]],
    box: [400, 320],
    label: [810, 30],
  },
];
