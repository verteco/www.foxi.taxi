/* FOXI TAXI prototype — minimal service worker.
   Network-first for same-origin app files (no staleness during iteration),
   cache fallback so the app shell still opens offline. */
const CACHE = 'foxi-app-v2';
const SHELL = [
  '/app/', '/app/index.html', '/app/style.css', '/app/app.js', '/app/data.js', '/app/map.js',
  '/app/screens/shared.js', '/app/screens/rider.js', '/app/screens/rider-extra.js',
  '/app/screens/driver.js', '/app/screens/driver-extra.js', '/app/manifest.webmanifest',
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL).catch(() => {})));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Only handle our own origin; let MapLibre/CARTO/fonts go straight to network.
  if (url.origin !== location.origin) return;

  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req).then((r) => r || caches.match('/app/index.html')))
  );
});
