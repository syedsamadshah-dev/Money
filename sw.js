const cacheName = 'expense-tracker-v1';
const assets = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

self.addEventListener('install', e=>{
  e.waitUntil(
    caches.open(cacheName).then(cache=>{
      return cache.addAll(assets);
    })
  );
});

self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys().then(keys=>{
      return Promise.all(
        keys.filter(key=>key!==cacheName).map(key=>caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', e=>{
  e.respondWith(
    caches.match(e.request).then(response=>{
      return response || fetch(e.request);
    })
  );
});
