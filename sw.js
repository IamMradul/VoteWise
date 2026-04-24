const CACHE_NAME = 'votewise-cache-v2';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './js/eligibility.js',
  './js/timeline.js',
  './js/chat.js',
  './js/quiz.js',
  './js/translate.js',
  './js/maps.js'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // Force the waiting service worker to become the active service worker.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Bypass Service Worker for cross-origin requests (APIs) and non-GET requests
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Always fetch config files from the network to avoid API key caching issues
  if (event.request.url.includes('config.')) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Return from cache
        }
        return fetch(event.request); // Fallback to network
      })
  );
});
