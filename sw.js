const CACHE_NAME = 'votewise-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './style.css',
  './js/config.example.js',
  './js/eligibility.js',
  './js/timeline.js',
  './js/chat.js',
  './js/quiz.js',
  './js/translate.js',
  './js/maps.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
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
