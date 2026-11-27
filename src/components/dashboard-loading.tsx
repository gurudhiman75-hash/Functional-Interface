import { Skeleton } from "@/components/ui/skeleton";

type DashboardLoadingProps = {
  label: string;
  variant: "series" | "activity" | "results" | "subjects";
};

/** Loading stays local to each panel; cached data remains visible during refetches. */
export function DashboardLoading({ label, variant }: DashboardLoadingProps) {
  return (
    <div role="status" aria-label={label}>
      <div className={`dashboard-loading loading-placeholder dashboard-loading-${variant}`} aria-hidden="true">
        {variant === "series" ? (
          <div className="series-cards">
            {[0, 1].map(index => (
              <div className="series-course" key={index}>
                <Skeleton className="dashboard-loading-cover" />
                <div className="series-course-body">
                  <Skeleton className="h-3 w-3/4 mb-4" />
                  <Skeleton className="h-2 w-full mb-4" />
                  <Skeleton className="h-11 w-32" />
                </div>
              </div>
            ))}
          </div>
        ) : variant === "activity" ? (
          <div className="space-y-5">
            {[0, 1, 2].map(index => <Skeleton key={index} className="h-6 w-full" />)}
            <Skeleton className="h-24 w-full" />
          </div>
        ) : variant === "subjects" ? (
          <div className="series-subject-grid">
            {[0, 1, 2, 3].map(index => <Skeleton key={index} className="h-16 w-full" />)}
          </div>
        ) : (
          <div className="space-y-4">
            {[0, 1, 2].map(index => <Skeleton key={index} className="h-14 w-full" />)}
          </div>
        )}
      </div>
    </div>
  );
}
