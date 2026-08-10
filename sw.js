// Ganti angka versi ini menjadi v3.1 untuk memaksa update di browser pengguna
const CACHE_NAME = 'tnc7-viz-v3.1'; 

const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json'
];

// Proses Install: Menyimpan file-file penting ke dalam Cache browser
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching files for v3.0');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => self.skipWaiting())
    );
});

// Proses Activate: Menghapus memori/cache versi lama agar tidak menumpuk dan mencegah error
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Menghapus cache lama:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Proses Fetch: Mengatur bagaimana aplikasi mengambil data
// Strategi "Network First, falling back to cache" khusus untuk aplikasi yang sering diupdate
self.addEventListener('fetch', (event) => {
    // Jangan cache permintaan dari ekstensi browser atau permintaan yang bukan GET
    if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                // Jika online dan berhasil ambil data baru, simpan yang baru ke cache
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            })
            .catch(() => {
                // Jika offline atau gagal, ambil dari cache
                return caches.match(event.request);
            })
    );
});
