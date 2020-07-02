/*
Copyright 2016 Google Inc. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
  http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

// Names of the two caches used in this version of the service worker.
// Change to v2, etc. when you update any of the local resources, which will
// in turn trigger the install event again.
const PRECACHE = 'precache-v0.0.35';
const RUNTIME = 'runtime';

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
  './',
  'favicon.ico',
  'favicon-192x192.png',
  'favicon-512x512.png',
  'icons.svg',
  'index.html',
  'manifest.json',
  'js/main.js',
  'js/solver-worker.js',
  'css/style.css',
  'css/dialog.css',
  'css/button.css',
];

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
  const currentCaches = [PRECACHE];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        console.debug("SW: Delete cache " + cacheToDelete)
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener('fetch', event => {
  // Skip cross-origin requests, like those for Google Analytics.
  if (!event.request.url.startsWith(self.location.origin)) return
  return event.respondWith(getFromCacheOrFetch(event.request))
})

async function getFromCacheOrFetch(request) {
  const cachedResponse = await caches.match(request)
  if (cachedResponse) {
    console.debug("SW: Get file from cache", request.url)
    return cachedResponse
  }

  console.debug("SW: Fetch file from server", request.url)
  const runtimeCache = await caches.open(RUNTIME)
  const response = await fetch(request)
  // Put a copy of the response in the runtime cache.
  await runtimeCache.put(request, response.clone())
  return response
}