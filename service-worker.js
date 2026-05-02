const CACHE_NAME = 'soorim-reservation-v13';

const FILES_TO_CACHE = [
  '/soorim/',
  '/soorim/index.html',
  '/soorim/manifest.json',
  '/soorim/manifest-tv.json',
  '/soorim/icon-192.png',
  '/soorim/icon-512.png',
  '/soorim/icon-tv-192.png',
  '/soorim/icon-tv-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
