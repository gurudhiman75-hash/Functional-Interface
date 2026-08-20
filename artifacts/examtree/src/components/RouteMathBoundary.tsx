import { lazy, Suspense, type ReactNode } from "react";
import { useLocation } from "wouter";

const MathJaxRouteProvider = lazy(() => import("@/providers/MathJaxRouteProvider"));

function routeNeedsMath(location: string) {
  return location.startsWith("/test/") || location === "/result";
}

export function RouteMathBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  if (!routeNeedsMath(location)) return children;

  return (
    <Suspense fallback={children}>
      <MathJaxRouteProvider>{children}</MathJaxRouteProvider>
    </Suspense>
  );
}
