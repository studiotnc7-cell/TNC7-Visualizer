const CACHE_NAME = 'tnc7-visualizer-v2';

// Daftar file yang akan disimpan di cache agar bisa dibuka offline
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache berhasil dibuka');
        return cache.addAll(urlsToCache);
      })
  );
  // Memaksa service worker baru untuk langsung aktif (skip waiting)
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  // Hanya proses request GET
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Jika file ada di cache, gunakan itu
        if (response) {
          return response;
        }
        // Jika tidak, ambil dari internet
        return fetch(event.request).catch(() => {
            console.log('Fetch gagal, mungkin sedang offline.');
        });
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Hapus cache lama (versi sebelumnya) agar browser mengunduh index.html baru
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Mengambil alih kontrol klien (browser) yang sedang berjalan
  self.clients.claim();
});
