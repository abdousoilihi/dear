const CACHE_NAME = 'digipharma-cache-v1';
const OFFLINE_URLS = [
    'Digipharma.html',
    'manifest.json',
    'icons/icon-152x152.png',
    'lib/tailwindcss.js',
    'lib/chart.js',
    'lib/xlsx.full.min.js',
    'lib/all.min.css',
    'webfonts/fa-brands-400.woff2',
    'webfonts/fa-brands-400.ttf',
    'webfonts/fa-regular-400.woff2',
    'webfonts/fa-regular-400.ttf',
    'webfonts/fa-solid-900.woff2',
    'webfonts/fa-solid-900.ttf',
    'webfonts/fa-v4compatibility.woff2',
    'webfonts/fa-v4compatibility.ttf'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(OFFLINE_URLS);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).then(fetchRes => {
                // Optionnel : mettre en cache les nouvelles requêtes
                return caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, fetchRes.clone());
                    return fetchRes;
                });
            }).catch(() => {
                // Optionnel : page offline personnalisée
                if (event.request.mode === 'navigate') {
                    return caches.match('Digipharma.html');
                }
            });
        })
    );
}); 