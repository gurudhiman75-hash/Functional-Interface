import { useEffect } from "react";
import { useLocation } from "wouter";

function routeNeedsAuthSync(location: string) {
  return location === "/dashboard"
    || location.startsWith("/test-series/")
    || location.startsWith("/test/")
    || location === "/result"
    || location === "/performance"
    || location === "/profile"
    || location === "/report-question";
}

export function RouteAuthSessionSync() {
  const [location] = useLocation();

  useEffect(() => {
    if (!routeNeedsAuthSync(location)) return;

    let active = true;
    let unsubscribe = () => {};

    void import("@/lib/auth")
      .then(({ syncAuthSession }) => {
        if (!active) return;
        try {
          unsubscribe = syncAuthSession();
        } catch (error) {
          console.warn("Auth sync failed, continuing without auth:", error);
        }
      })
      .catch((error) => {
        console.warn("Auth sync module failed to load:", error);
      });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [location]);

  return null;
}
