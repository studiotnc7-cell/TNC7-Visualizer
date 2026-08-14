// Ganti angka versi ini (misal: v3, v4, dst) SETIAP KALI Anda mengupdate index.html
const CACHE_NAME = 'tnc7-visualizer-v15'; 

const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// Tahap Install: Menyimpan file utama ke dalam Cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache berhasil dibuka');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting(); // Memaksa service worker baru untuk langsung aktif
});

// Tahap Activate: Menghapus Cache versi lama agar pengunjung mendapat update terbaru
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Menghapus cache lama:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Langsung mengontrol semua halaman yang terbuka
});

// Tahap Fetch: Mengambil data dari Cache jika offline, atau dari internet jika online
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Jika ada di cache, kembalikan response cache
        if (response) {
          return response;
        }
        // Jika tidak ada di cache, ambil dari internet
        return fetch(event.request);
      })
  );
});
