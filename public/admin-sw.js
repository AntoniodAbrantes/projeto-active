const CACHE_NAME = "active-admin-v1";

// Assets to pre-cache for offline use
const PRECACHE_ASSETS = [
  "/admin",
  "/LogoJPEG/favicon-512.png",
];

// Install: pre-cache key assets
self.addEventListener("install", (event) => {
  console.log("[Admin SW] Installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => {
      console.log("[Admin SW] Pre-cache complete.");
      return self.skipWaiting();
    })
  );
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
  console.log("[Admin SW] Activating...");
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log("[Admin SW] Deleting old cache:", name);
            return caches.delete(name);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: Network-first strategy for API/Firebase, Cache-first for static assets
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Only handle requests within the /admin scope and same origin static assets
  const isAdminRoute = url.pathname.startsWith("/admin");
  const isStaticAsset = url.pathname.match(/\.(png|jpg|jpeg|svg|ico|css|js|woff2?)$/);
  const isFirebaseRequest = url.hostname.includes("firebaseapp.com") || url.hostname.includes("googleapis.com") || url.hostname.includes("firestore.googleapis.com");

  // Always bypass Firebase and external API requests — let them go to the network
  if (isFirebaseRequest) {
    return;
  }

  if (isAdminRoute || isStaticAsset) {
    event.respondWith(
      // Network-first, fallback to cache
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse.ok && event.request.method === "GET") {
            const cloned = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            // Last resort: return offline shell
            if (isAdminRoute) return caches.match("/admin");
          });
        })
    );
  }
});
