// ... existing code ...
const CACHE_NAME = 'tnc7-viz-v2';
const urlsToCache = [
  './',
// ... existing code ...
```

```html:TNC7 Visualizer:index.html
<!-- ... existing code ... -->
</head>
<body>
    <!-- Garis kuning dekoratif di atas (dipertebal menjadi h-1.5 dan diberi sedikit efek glow) -->
    <div class="w-full h-1.5 bg-yellow-400 flex-shrink-0 relative z-50 shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>
    
    <div id="notification-modal">Pesan Notifikasi</div>

    <div class="top-bar">
        <div class="flex items-center gap-4">
<!-- ... existing code ... -->
```

### 💡 Langkah Penting Setelah Update di GitHub:
Setelah Anda menyimpan (commit) perubahan `sw.js` dan `index.html` ini ke GitHub, lakukan **Hard Refresh** di browser Anda untuk memaksa browser mengambil versi terbaru:
*   **Windows/Linux:** Tekan `Ctrl` + `F5` atau `Ctrl` + `Shift` + `R`
*   **Mac:** Tekan `Cmd` + `Shift` + `R`
*   **HP (Android/iOS):** Buka pengaturan browser, pilih "Clear Browsing Data" (khususnya *Cached images and files*), lalu muat ulang halamannya.
