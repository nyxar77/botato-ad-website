export type Lang = 'ar' | 'fr' | 'en';
export type Currency = 'MAD' | 'EUR';
export type SpotId = 'tv' | 'gs';

export const LANGS: { code: Lang; label: string; short: string }[] = [
  { code: 'ar', label: 'العربية', short: 'AR' },
  { code: 'fr', label: 'Français', short: 'FR' },
  { code: 'en', label: 'English', short: 'EN' },
];

type Dict = {
  tagline: string;
  navSpots: string;
  navHow: string;
  navPay: string;
  kicker: string;
  title: string;
  lead: string;
  perVideo: (n: number) => string;
  spotsLabel: string;
  spotsHint: string;
  spots: Record<SpotId, { name: string; desc: string }>;
  both: string;
  bundle: string;
  qtyLabel: string;
  minus: string;
  plus: string;
  bullets: string[];
  previewTitle: string;
  previewHint: string;
  clickToSelect: string;
  selected: string;
  upload: string;
  replace: string;
  remove: string;
  fit: string;
  fill: string;
  textLabel: string;
  textPlaceholder: string;
  adHere: string;
  available: string;
  howTitle: string;
  steps: { t: string; d: string }[];
  payTitle: string;
  holder: string;
  copy: string;
  copied: string;
  payNote: string;
  eurNote: string;
  orderTitle: string;
  email: string;
  orderText: string;
  orderNote: string;
  cta: string;
  total: string;
  currency: string;
  currencyAuto: string;
  language: string;
  themeDark: string;
  themeLight: string;
  footer: string;
  msg: (spot: string, qty: number, total: string) => string;
  subject: (spot: string) => string;
  attach: string;
};

export const dict: Record<Lang, Dict> = {
  ar: {
    tagline: 'إعلانك في فيديوهاتي',
    navSpots: 'الأماكن',
    navHow: 'كيف تعمل',
    navPay: 'الدفع',
    kicker: 'مساحة إعلانية',
    title: 'إعلان في خلفية الفيديو',
    lead: 'صورتك أو حسابك يظهر على الشاشات اللي ورايا طوال الفيديو.',
    perVideo: (n) => (n === 1 ? '/ فيديو واحد' : `/ ${n} فيديوهات`),
    spotsLabel: 'المكان',
    spotsHint: 'تقدر تختار شاشة وحدة أو الاثنين.',
    spots: {
      tv: { name: 'شاشة التلفاز', desc: 'الشاشة الصغيرة على الحائط' },
      gs: { name: 'الشاشة الخضراء', desc: 'الشاشة الكبيرة اللي ورايا' },
    },
    both: 'الاثنين معاً',
    bundle: 'الشاشتين',
    qtyLabel: 'عدد الفيديوهات',
    minus: 'ناقص',
    plus: 'زائد',
    bullets: [
      'صفحات، متاجر صغيرة، تهنئة عيد ميلاد، أو رسالة لصديق.',
      'لا أقبل إعلانات الرهان أو النصب أو المحتوى المسيء.',
    ],
    previewTitle: 'جرّب إعلانك على الشاشة',
    previewHint: 'ارفع صورة إعلانك أو اكتب نص، وشوف كيف غادي يبان.',
    clickToSelect: 'اضغط على شاشة لاختيارها',
    selected: 'مختار',
    upload: 'ارفع صورة',
    replace: 'بدّل الصورة',
    remove: 'حذف',
    fit: 'احتواء',
    fill: 'ملء',
    textLabel: 'أو اكتب نص',
    textPlaceholder: '@صفحتك',
    adHere: 'إعلانك هنا',
    available: 'متاح',
    howTitle: 'كيف تعمل',
    steps: [
      { t: 'اختار المكان', d: 'شاشة التلفاز، الشاشة الخضراء، أو الاثنين.' },
      { t: 'حوّل المبلغ', d: 'تحويل بنكي لحساب CIH.' },
      { t: 'صيفط الطلب', d: 'صورة الإعلان + صورة وصل التحويل بالإيميل.' },
      { t: 'التأكيد', d: 'نأكد لك الطلب وموعد الفيديو بعد التحقق.' },
    ],
    payTitle: 'الدفع عبر تحويل بنكي',
    holder: 'صاحب الحساب',
    copy: 'نسخ',
    copied: 'تم النسخ',
    payNote: 'بعد التحويل، أرسل صورة الوصل وصورة إعلانك عبر البريد الإلكتروني.',
    eurNote: 'من خارج المغرب: تحويل دولي عبر SWIFT، والمصاريف البنكية على المرسل.',
    orderTitle: 'أرسل طلبك وصورة إعلانك',
    email: 'البريد الإلكتروني',
    orderText: 'نص الطلب (انسخه في رسالتك)',
    orderNote: 'أرفق في الرسالة: صورة إعلانك + صورة وصل التحويل. أؤكد لك الطلب وموعد الفيديو بعد التحقق.',
    cta: 'افتح البريد وأرسل الطلب',
    total: 'المجموع',
    currency: 'العملة',
    currencyAuto: 'تم اختيارها تلقائياً حسب موقعك',
    language: 'اللغة',
    themeDark: 'الوضع الداكن',
    themeLight: 'الوضع الفاتح',
    footer: 'جميع الحقوق محفوظة',
    msg: (s, q, t) => `السلام عليكم، بغيت نحجز إعلان:\nالمكان: ${s}\nعدد الفيديوهات: ${q}\nالمجموع: ${t}`,
    subject: (s) => `طلب إعلان - ${s}`,
    attach: '(أرفق صورة الإعلان وصورة الوصل)',
  },
  fr: {
    tagline: 'Ta pub dans mes vidéos',
    navSpots: 'Emplacements',
    navHow: 'Comment ça marche',
    navPay: 'Paiement',
    kicker: 'Espace publicitaire',
    title: 'Ta pub en arrière-plan de mes vidéos',
    lead: 'Ton image ou ton compte s’affiche sur les écrans derrière moi pendant toute la vidéo.',
    perVideo: (n) => (n === 1 ? '/ 1 vidéo' : `/ ${n} vidéos`),
    spotsLabel: 'Emplacement',
    spotsHint: 'Choisis un écran, ou les deux.',
    spots: {
      tv: { name: 'Écran TV', desc: 'Le petit écran au mur' },
      gs: { name: 'Écran vert', desc: 'Le grand écran derrière moi' },
    },
    both: 'Les deux',
    bundle: 'Les deux écrans',
    qtyLabel: 'Nombre de vidéos',
    minus: 'Moins',
    plus: 'Plus',
    bullets: [
      'Pages, petites boutiques, anniversaire ou message à un ami.',
      'Pas de paris, d’arnaques ni de contenu offensant.',
    ],
    previewTitle: 'Essaie ta pub sur l’écran',
    previewHint: 'Importe ton visuel ou tape un texte pour voir le rendu.',
    clickToSelect: 'Clique sur un écran pour le choisir',
    selected: 'Choisi',
    upload: 'Importer une image',
    replace: 'Changer l’image',
    remove: 'Retirer',
    fit: 'Ajuster',
    fill: 'Remplir',
    textLabel: 'Ou tape un texte',
    textPlaceholder: '@ta.page',
    adHere: 'Ta pub ici',
    available: 'Libre',
    howTitle: 'Comment ça marche',
    steps: [
      { t: 'Choisis l’emplacement', d: 'Écran TV, écran vert, ou les deux.' },
      { t: 'Fais le virement', d: 'Virement bancaire sur le compte CIH.' },
      { t: 'Envoie ta commande', d: 'Ton visuel + le reçu du virement par e-mail.' },
      { t: 'Confirmation', d: 'Je confirme la commande et la date de la vidéo.' },
    ],
    payTitle: 'Paiement par virement bancaire',
    holder: 'Titulaire du compte',
    copy: 'Copier',
    copied: 'Copié',
    payNote: 'Après le virement, envoie le reçu et ton visuel par e-mail.',
    eurNote: 'Depuis l’étranger : virement international SWIFT, frais bancaires à la charge de l’émetteur.',
    orderTitle: 'Envoie ta commande et ton visuel',
    email: 'E-mail',
    orderText: 'Texte de la commande (à coller dans ton message)',
    orderNote: 'Joins à ton message : ton visuel + le reçu du virement. Je confirme la commande et la date de la vidéo après vérification.',
    cta: 'Ouvrir l’e-mail et commander',
    total: 'Total',
    currency: 'Devise',
    currencyAuto: 'Choisie automatiquement selon ta région',
    language: 'Langue',
    themeDark: 'Thème sombre',
    themeLight: 'Thème clair',
    footer: 'Tous droits réservés',
    msg: (s, q, t) => `Bonjour, je souhaite réserver une pub :\nEmplacement : ${s}\nNombre de vidéos : ${q}\nTotal : ${t}`,
    subject: (s) => `Commande pub - ${s}`,
    attach: '(Visuel et reçu du virement en pièce jointe)',
  },
  en: {
    tagline: 'Your ad in my videos',
    navSpots: 'Spots',
    navHow: 'How it works',
    navPay: 'Payment',
    kicker: 'Ad space',
    title: 'Your ad in the background of my videos',
    lead: 'Your picture or handle shows up on the screens behind me for the whole video.',
    perVideo: (n) => (n === 1 ? '/ 1 video' : `/ ${n} videos`),
    spotsLabel: 'Spot',
    spotsHint: 'Pick one screen, or both.',
    spots: {
      tv: { name: 'TV screen', desc: 'The small screen on the wall' },
      gs: { name: 'Green screen', desc: 'The big screen right behind me' },
    },
    both: 'Both',
    bundle: 'Both screens',
    qtyLabel: 'Number of videos',
    minus: 'Less',
    plus: 'More',
    bullets: [
      'Pages, small shops, birthday shout-outs or a message to a friend.',
      'No betting, scams or offensive content.',
    ],
    previewTitle: 'Try your ad on the screen',
    previewHint: 'Upload your image or type some text to see how it looks.',
    clickToSelect: 'Click a screen to pick it',
    selected: 'Picked',
    upload: 'Upload image',
    replace: 'Replace image',
    remove: 'Remove',
    fit: 'Fit',
    fill: 'Fill',
    textLabel: 'Or type some text',
    textPlaceholder: '@your.page',
    adHere: 'Your ad here',
    available: 'Free',
    howTitle: 'How it works',
    steps: [
      { t: 'Pick a spot', d: 'TV screen, green screen, or both.' },
      { t: 'Send the payment', d: 'Bank transfer to the CIH account.' },
      { t: 'Email your order', d: 'Your ad image + the transfer receipt.' },
      { t: 'Confirmation', d: 'I confirm the order and the video date.' },
    ],
    payTitle: 'Pay by bank transfer',
    holder: 'Account holder',
    copy: 'Copy',
    copied: 'Copied',
    payNote: 'After the transfer, email the receipt and your ad image.',
    eurNote: 'From abroad: international SWIFT transfer, bank fees paid by the sender.',
    orderTitle: 'Send your order and ad image',
    email: 'Email',
    orderText: 'Order text (paste it in your email)',
    orderNote: 'Attach your ad image + the transfer receipt. I’ll confirm the order and the video date once verified.',
    cta: 'Open email and send order',
    total: 'Total',
    currency: 'Currency',
    currencyAuto: 'Picked automatically from your region',
    language: 'Language',
    themeDark: 'Dark theme',
    themeLight: 'Light theme',
    footer: 'All rights reserved',
    msg: (s, q, t) => `Hi, I'd like to book an ad:\nSpot: ${s}\nNumber of videos: ${q}\nTotal: ${t}`,
    subject: (s) => `Ad order - ${s}`,
    attach: '(Ad image and transfer receipt attached)',
  },
};
