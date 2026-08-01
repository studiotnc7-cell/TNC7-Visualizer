/* STREAMING_CHUNK:Configuring Service Worker Cache... */
const CACHE_NAME = 'tnc7-visualizer-v1';
const urlsToCache = [
'./',
'./index.html',
'./manifest.json',
// Cache the CDNs used in the app for offline support
'https://cdn.tailwindcss.com',
'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&family=Montserrat:wght@400;700&family=Oswald:wght@400;700&family=Poppins:wght@400;700&family=Righteous&display=swap',
'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js'
];

/* STREAMING_CHUNK:Install Event - Caching App Shell */
self.addEventListener('install', event => {
event.waitUntil(
caches.open(CACHE_NAME)
.then(cache => {
console.log('Opened cache');
return cache.addAll(urlsToCache);
})
);
// Force the waiting service worker to become the active service worker.
self.skipWaiting();
});

/* STREAMING_CHUNK:Activate Event - Cleaning up old caches */
self.addEventListener('activate', event => {
const cacheWhitelist = [CACHE_NAME];
event.waitUntil(
caches.keys().then(cacheNames => {
return Promise.all(
cacheNames.map(cacheName => {
if (cacheWhitelist.indexOf(cacheName) === -1) {
return caches.delete(cacheName);
}
})
);
})
);
// Claim the clients so the new service worker takes over immediately
self.clients.claim();
});

/* STREAMING_CHUNK:Fetch Event - Network First Strategy for CDNs, Cache First for local */
self.addEventListener('fetch', event => {
event.respondWith(
caches.match(event.request)
.then(response => {
// Cache hit - return response
if (response) {
return response;
}

    // Clone the request because it's a stream and can only be consumed once
    const fetchRequest = event.request.clone();

    return fetch(fetchRequest).then(
      response => {
        // Check if we received a valid response
        if(!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response because it's a stream
        const responseToCache = response.clone();

        // Only cache requests from our origin (optional: adjust if you want to aggressively cache CDNs)
        if (event.request.url.startsWith(self.location.origin)) {
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
        }

        return response;
      }
    );
  })


);
});
