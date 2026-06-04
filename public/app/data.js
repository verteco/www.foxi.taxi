/* ============================================================
   FOXI TAXI — Prototype sample data (ONE canonical demo trip)
   Real Trebišov coordinates. Active operator: RS Dolina.
   Rider app and Driver app show the SAME ride, same driver,
   same plate, same money — so flipping persona is consistent.
   Demo only — no backend.
   ============================================================ */
window.FOXI = window.FOXI || {};

/* The ONE canonical trip — used identically by both apps.
   Money is internally consistent:
     rider pays (final)  = €10,90  (quoted cap €10,40–11,10)
     FOXI fee 12%        = €1,30
     driver net          = €9,60   (10,90 − 1,30)
*/
FOXI.data = {
  city: 'Trebišov',
  currency: '€',

  // Map center — Trebišov
  center: { lat: 48.6306, lng: 21.7186 },

  // Canonical pickup + destination
  pickup:  { label: 'Aktuálna poloha', address: 'M. R. Štefánika 12, Trebišov', lat: 48.6285, lng: 21.7165 },
  dropoff: { label: 'Nemocnica Trebišov', address: 'SNP 1079, Trebišov', lat: 48.6361, lng: 21.7044 },

  trip: {
    distanceKm: 6.4,
    durationMin: 14,
    quoteLow: 10.40,
    quoteHigh: 11.10,
    finalFare: 10.90,   // rider actually pays (under the cap → delight)
    foxiFee: 1.30,      // 12%
    driverNet: 9.60,    // 10.90 − 1.30
    payment: 'cash',
  },

  // Itemized fare (sums to the capped total)
  fareLines: [
    { label: 'Základná sadzba', amount: 1.50 },
    { label: 'Vzdialenosť (6,4 km × 0,90 €)', amount: 5.76 },
    { label: 'Čas (14 min × 0,18 €)', amount: 2.52 },
    { label: 'Vyťažená oblasť (centrum)', amount: 1.82, note: 'busy' },
    { label: 'Zľava FOXI10', amount: -0.70, note: 'promo' },
  ],

  // The canonical driver (shown in BOTH apps)
  driver: {
    name: 'Marek H.',
    first: 'Marek',
    rating: 4.92,
    trips: 1284,
    car: 'Škoda Octavia',
    color: 'sivá',
    colorEn: 'Grey',
    plate: 'TV-457BX',
    operator: 'RS Dolina',
    phone: '+421950706000',
    pin: '4827',
    // starts ~0.8 km from pickup (SE)
    start: { lat: 48.6248, lng: 21.7252 },
  },

  // The canonical rider (shown in BOTH apps)
  rider: {
    name: 'Jana K.',
    first: 'Jana',
    rating: 4.88,
    phone: '+421900111222',
    pickupNote: 'Pri vchode, modrá bunda',
  },

  // Ride categories (capped ranges, transparent — no surge)
  categories: [
    { id: 'standard', name: 'FOXI Standard', desc: 'Každodenné jazdy',      seats: 4, eta: 3, low: 10.40, high: 11.10, icon: 'car' },
    { id: 'comfort',  name: 'FOXI Comfort',  desc: 'Novšie autá, top hodn.', seats: 4, eta: 5, low: 12.80, high: 13.60, icon: 'car' },
    { id: 'van',      name: 'FOXI Van',      desc: 'Až 6 miest, batožina',   seats: 6, eta: 7, low: 15.00, high: 16.20, icon: 'van' },
    { id: 'pet',      name: 'FOXI Pet',      desc: 'So psíkom vítaný',       seats: 3, eta: 6, low: 11.50, high: 12.30, icon: 'pet' },
    { id: 'eco',      name: 'FOXI Eco',      desc: 'Nižšie emisie, hybrid',  seats: 4, eta: 4, low: 10.60, high: 11.30, icon: 'eco' },
  ],

  // Saved + recent places
  places: {
    home: { label: 'Domov', address: 'Družstevná 5, Trebišov', lat: 48.6342, lng: 21.7212 },
    work: { label: 'Práca', address: 'Nemocnica Trebišov, SNP 1079', lat: 48.6361, lng: 21.7044 },
    recent: [
      { label: 'Železničná stanica', address: 'Staničná, Trebišov', lat: 48.6248, lng: 21.7290, icon: 'clock' },
      { label: 'Kaufland Trebišov', address: 'Kpt. Nálepku 9', lat: 48.6402, lng: 21.7251, icon: 'clock' },
      { label: 'Nemocnica Trebišov', address: 'SNP 1079', lat: 48.6361, lng: 21.7044, icon: 'clock' },
      { label: 'Autobusová stanica', address: 'Komenského', lat: 48.6270, lng: 21.7218, icon: 'clock' },
    ],
  },

  // Payment methods (cash first-class + default)
  payments: [
    { id: 'cash', label: 'Hotovosť', sub: 'Zaplaťte vodičovi priamo', icon: 'cash', default: true },
    { id: 'card', label: 'Karta •• 4242', sub: 'Visa', icon: 'card' },
    { id: 'applepay', label: 'Apple Pay', sub: '', icon: 'apple' },
  ],

  // Driver earnings dashboard (week)
  earnings: {
    todayTotal: 87.40, todayTrips: 12, todayHours: '6 h 20 m', todayGoal: 100,
    weekTotal: 430.60, weekTrips: 48, weekHours: 31,
    available: 118.20, instantFree: 2, instantTotal: 4,
    commissionRate: 12,
    breakdown: { fares: 372.10, tips: 18.50, bonuses: 40.00, waiting: 4.80, commission: 52.80 },
    recent: [
      { time: '14:32', from: 'M. R. Štefánika', to: 'Nemocnica', net: 9.60, pay: 'cash' },
      { time: '13:48', from: 'Kaufland', to: 'Sečovce', net: 7.57, pay: 'card' },
      { time: '13:05', from: 'Stanica', to: 'Družstevná', net: 3.23, pay: 'cash' },
      { time: '12:30', from: 'Centrum', to: 'Nemocnica', net: 4.10, pay: 'cash' },
    ],
  },

  langs: [
    { code: 'sk', flag: '🇸🇰', label: 'Slovenčina' },
    { code: 'cs', flag: '🇨🇿', label: 'Čeština' },
    { code: 'en', flag: '🇬🇧', label: 'English' },
    { code: 'de', flag: '🇦🇹', label: 'Deutsch' },
    { code: 'hu', flag: '🇭🇺', label: 'Magyar' },
    { code: 'pl', flag: '🇵🇱', label: 'Polski' },
    { code: 'ro', flag: '🇷🇴', label: 'Română' },
  ],

  dispatcher: {
    operator: 'RS Dolina',
    area: 'Trebišov a okolie',
    numbers: [
      { display: '0950 706 000', tel: '+421950706000' },
      { display: '0950 795 150', tel: '+421950795150' },
    ],
  },

  // ---- Route geometry (lng,lat) — hand-traced Trebišov streets ----
  // Štefánika 12 → Nemocnica Trebišov (the on-trip route)
  route: [
    [21.7165, 48.6285], [21.7158, 48.6294], [21.7150, 48.6301],
    [21.7132, 48.6308], [21.7112, 48.6316], [21.7090, 48.6326],
    [21.7072, 48.6337], [21.7058, 48.6347], [21.7050, 48.6355],
    [21.7044, 48.6361],
  ],

  // Driver approach (driver start → pickup)
  approach: [
    [21.7252, 48.6248], [21.7236, 48.6255], [21.7218, 48.6262],
    [21.7200, 48.6270], [21.7184, 48.6277], [21.7165, 48.6285],
  ],

  // Idle nearby cars for rider-home (lng,lat)
  nearby: [
    [21.7205, 48.6322], [21.7150, 48.6280], [21.7240, 48.6300],
    [21.7120, 48.6335], [21.7195, 48.6260],
  ],
};
