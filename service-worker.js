const CACHE_NAME = 'sw-cache-5';

const CRITICAL_ASSETS = [
    '/',
    '/index.js',
    '/render.js',
    '/register-service-worker.js',
    '/offline.html'
];

function onInstall(installEvent) {
    installEvent.waitUntil(precache());
    self.skipWaiting();
    console.log('SW installed');
}

async function precache() {
    const cache = await caches.open(CACHE_NAME);
    return cache.addAll(CRITICAL_ASSETS);
}

function onFetch(fetchEvent) {
    fetchEvent.respondWith(getResponseFromCacheOrNetwork(fetchEvent).catch(respondWithFallback));
}

async function getResponseFromCacheOrNetwork(fetchEvent) {
    const response = await caches.match(fetchEvent.request);
    if (response) {
        console.log('Serving from cache', fetchEvent.request.url);
        return response;
    }
    console.log('Fetching from server', fetchEvent.request.url);
    return fetchAndCache(fetchEvent.request);
}

async function fetchAndCache(request) {
    const requestClone = request.clone();
    const response = await fetch(requestClone);
    const mustNotCache = !response || response.status !== 200 || response.type !== 'basic';
    if (mustNotCache) {
        return response;
    }
    const responseClone = response.clone();
    cacheResponse(request, responseClone);
    return response;
}

async function respondWithFallback() {
    const cache = await caches.open(CACHE_NAME);
    const fallbackResponse = await cache.match('/offline.html');
    return fallbackResponse;
}

async function cacheResponse(request, response) {
    const cache = await caches.open(CACHE_NAME);
    return cache.put(request, response);
}

function onActivate(activateEvent) {
    activateEvent.waitUntil(clearOldCaches());
    console.log('Activated');
}

async function clearOldCaches() {
    const cacheKeys = await caches.keys();
    const deletes = cacheKeys.map((key) => {
        if (key !== CACHE_NAME) {
            return caches.delete(key);
        }
    });
    return Promise.all(deletes);
}

function onPush(pushEvent) {
    pushEvent.waitUntil(
        self.registration.showNotification('ServiceWorker Cookbook', {
            body: 'Alea iacta est',
        })
    );
}


self.addEventListener('install', onInstall);
self.addEventListener('activate', onActivate);
self.addEventListener('fetch', onFetch);
self.addEventListener('push', onPush);