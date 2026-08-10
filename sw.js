const CACHE_NAME = 'tnc7-visualizer-v2.0-super-stable';

const URLS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    // Kita juga bisa meng-cache library dari luar agar bisa dibuka tanpa internet
    'https://unpkg.com/mp4-muxer/build/mp4-muxer.js',
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache v2.0');
                // Gunakan try-catch atau abaikan jika ada file CDN yang gagal di-cache
                return cache.addAll(URLS_TO_CACHE).catch(err => console.warn('Beberapa asset luar mungkin gagal di-cache', err));
            })
    );
    // Memaksa service worker baru untuk langsung aktif (tidak menunggu tab ditutup)
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Menghapus cache versi lama:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // Langsung mengambil kendali atas semua halaman terbuka
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    // Abaikan request dari ekstensi Chrome atau file blob
    if (event.request.url.startsWith('chrome-extension') || event.request.url.includes('extension') || event.request.url.startsWith('blob:')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                // Jika sukses ambil dari internet, simpan ke cache untuk backup offline
                if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                // Jika internet mati (offline), ambil dari Cache
                return caches.match(event.request);
            })
    );
});
