import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Hook that conditionally enables PWA features (manifest + service worker)
 * only when the user is on the /admin route.
 * This ensures regular visitors of the landing page are NOT prompted to install the app.
 */
export function useAdminPWA() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    const MANIFEST_ID = "admin-pwa-manifest";
    let manifestLink = document.getElementById(MANIFEST_ID) as HTMLLinkElement | null;

    if (isAdminRoute) {
      // 1) Inject the admin manifest link tag if not already present
      if (!manifestLink) {
        manifestLink = document.createElement("link");
        manifestLink.id = MANIFEST_ID;
        manifestLink.rel = "manifest";
        manifestLink.href = "/admin-manifest.json";
        document.head.appendChild(manifestLink);
      }

      // 2) Register the service worker
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker
          .register("/admin-sw.js", { scope: "/admin" })
          .then((reg) => {
            console.log("[Admin PWA] Service Worker registered:", reg.scope);
          })
          .catch((err) => {
            console.error("[Admin PWA] Service Worker registration failed:", err);
          });
      }
    } else {
      // Remove manifest when leaving /admin to avoid install prompts elsewhere
      if (manifestLink) {
        document.head.removeChild(manifestLink);
      }

      // Unregister any active admin service worker when leaving admin area
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((reg) => {
            if (reg.scope.includes("/admin")) {
              reg.unregister();
            }
          });
        });
      }
    }
  }, [isAdminRoute]);
}
