import { lazy, Suspense, type ReactNode } from "react";

const ExamCatalogProvider = lazy(() =>
  import("@/providers/ExamCatalogProvider").then((module) => ({ default: module.ExamCatalogProvider })),
);

function CatalogRouteSkeleton() {
  return (
    <div className="examtree-shell min-h-screen bg-background">
      <div className="mx-auto max-w-6xl space-y-5 px-4 py-10 sm:px-6 lg:px-8">
        <div className="skeleton-shimmer h-12 w-48 rounded-md" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="skeleton-shimmer h-40 rounded-md" />
          <div className="skeleton-shimmer h-40 rounded-md" />
          <div className="skeleton-shimmer h-40 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function RouteCatalogBoundary({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<CatalogRouteSkeleton />}>
      <ExamCatalogProvider>{children}</ExamCatalogProvider>
    </Suspense>
  );
}
