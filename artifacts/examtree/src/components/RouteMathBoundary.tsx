import { lazy, Suspense, type ReactNode } from "react";
import { useLocation } from "wouter";

const MathJaxRouteProvider = lazy(() => import("@/providers/MathJaxRouteProvider"));

function routeNeedsMath(location: string) {
  return location.startsWith("/test/") || location === "/result";
}

function MathRouteSkeleton() {
  return (
    <div className="examtree-shell min-h-screen bg-background">
      <div className="mx-auto max-w-6xl space-y-5 px-4 py-10 sm:px-6 lg:px-8">
        <div className="skeleton-shimmer h-12 w-48 rounded-md" />
        <div className="skeleton-shimmer h-72 rounded-md" />
      </div>
    </div>
  );
}

export function RouteMathBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  if (!routeNeedsMath(location)) return children;

  return (
    <Suspense fallback={<MathRouteSkeleton />}>
      <MathJaxRouteProvider>{children}</MathJaxRouteProvider>
    </Suspense>
  );
}
