// ... existing code ...
// UBAH CACHE_NAME menjadi v3
const CACHE_NAME = 'tnc7-viz-v3';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', event => {
  // TAMBAHKAN BARIS INI: Memaksa service worker baru untuk langsung aktif
  self.skipWaiting(); 
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  // TAMBAHKAN BARIS INI: Mengambil alih kontrol halaman dengan segera
  event.waitUntil(clients.claim());
  
  const cacheWhitelist = [CACHE_NAME];
// ... existing code ...
```

```html:TNC7 Visualizer:index.html
<!-- ... existing code ... -->
</head>
<body>
    <!-- Garis kuning dekoratif di atas (Dibuat absolut dan z-index maksimal agar pasti muncul) -->
    <div style="width: 100%; height: 6px; background-color: #facc15; box-shadow: 0 0 15px rgba(250,204,21,0.8); z-index: 999999; position: relative; flex-shrink: 0;"></div>
    
    <div id="notification-modal">Pesan Notifikasi</div>

    <div class="top-bar">
<!-- ... existing code ... -->
        canvas.addEventListener('touchstart', handleDragStart, { passive: true });
        window.addEventListener('touchmove', handleDragMove, { passive: false });
        window.addEventListener('touchend', handleDragEnd);

        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./sw.js').then(registration => {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                    // TAMBAHAN: Paksa browser mengecek update di background
                    registration.update();
                }).catch(error => {
                    console.log('ServiceWorker registration failed: ', error);
                });
            });
            
            // TAMBAHAN: Jika ada update SW baru, otomatis reload halaman agar tampil yang terbaru
            let refreshing = false;
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (!refreshing) {
                    window.location.reload();
                    refreshing = true;
                }
            });
        }

    </script>
</body>
</html>
