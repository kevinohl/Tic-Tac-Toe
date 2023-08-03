// Change this to your repository name
const GHPATH = '/Tic-Tac-Toe';

// Choose a different app prefix name
const APP_PREFIX = 'ttt';

// The version of the cache. Every time you change any of the files
// you need to change this version (version_01, version_02…). 
// If you don't change the version, the service worker will give your
// users the old files!
const VERSION = 'version_00';

// The files to make available for offline use. make sure to add 
// others to this list
const APP_STATIC_RESOURCES = [    
  `${GHPATH}/`,
  `${GHPATH}/index.html`,
  `${GHPATH}/styles/styles.css`,
  `${GHPATH}/js/js-file.js`,
  `${GHPATH}/src/my-icon.png`
]

const CACHE_NAME = `tic-tac-toe-${VERSION}`;

/* const APP_STATIC_RESOURCES = [
    "/",
    "/index.html",
    "styles/styles.css",
    "js/js-file.js",
    "src/my-icon.png"
  ];
 */

  // On install, cache the static resources
  self.addEventListener("install", (event) => {
    event.waitUntil(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        cache.addAll(APP_STATIC_RESOURCES);
      })()
    );
  });
  
  // delete old caches on activate
  self.addEventListener("activate", (event) => {
    event.waitUntil(
      (async () => {
        const names = await caches.keys();
        await Promise.all(
          names.map((name) => {
            if (name !== CACHE_NAME) {
              return caches.delete(name);
            }
          })
        );
        await clients.claim();
      })()
    );
  });
  
  // On fetch, intercept server requests
  // and respond with cached responses instead of going to network
  self.addEventListener("fetch", (event) => {
    // As a single page app, direct app to always go to cached home page.
    if (event.request.mode === "navigate") {
      event.respondWith(caches.match("/"));
      return;
    }
  
    // For all other requests, go to the cache first, and then the network.
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
          // Return the cached response if it's available.
          return cachedResponse;
        } 
          // If resource isn't in the cache, return a 404.
          return new Response(null, { status: 404 });
        
      })()
    );
  });