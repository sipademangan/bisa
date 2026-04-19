const CACHE_NAME = 'sipade-v2';
const urlsToCache = [
  './',
  'index.html',
  'icon-192.png',
  'icon-512.png',
  '2.webp',
  'maps.webp',
  'sipade.webp'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .catch(err => console.warn('Cache gagal:', err))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});