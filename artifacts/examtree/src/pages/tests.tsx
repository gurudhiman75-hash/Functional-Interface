import { useExamCatalog } from "@/providers/ExamCatalogProvider";
import { useQuery } from "@tanstack/react-query";
import { getPublishedTests } from "@/lib/published-tests";
import { getStudentTestSeries } from "@/lib/test-series";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ExamNavigator } from "@/components/ExamNavigator";
import { CalendarClock, Layers3, Target } from "lucide-react";

function progressionLabel(mode: "open" | "sequential" | "score_gated") {
  if (mode === "open") return "Open access";
  if (mode === "sequential") return "Complete in order";
  return "Score gated";
}

export default function Tests() {
  const { categories, subcategories, tests, isLoading, error } = useExamCatalog();
  const [, setLocation] = useLocation();
  const publishedTestsQuery = useQuery({ queryKey: ["published-tests"], queryFn: getPublishedTests, staleTime: 30_000 });
  const seriesQuery = useQuery({ queryKey: ["student-test-series"], queryFn: getStudentTestSeries, staleTime: 30_000 });

  if (error) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <h1 className="text-xl font-semibold text-slate-950">Could not load tests and exams</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          The test catalog is temporarily unavailable. Your saved attempts are not affected.
        </p>
        <Button className="mt-5" variant="outline" onClick={() => window.location.reload()}>
          Try again
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="skeleton-shimmer h-36 rounded-2xl" />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <div className="skeleton-shimmer h-64 rounded-2xl" />
          <div className="skeleton-shimmer h-64 rounded-2xl" />
          <div className="skeleton-shimmer h-64 rounded-2xl" />
        </div>
        <div className="skeleton-shimmer h-96 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {seriesQuery.data?.series.length ? (
        <section className="mx-auto max-w-7xl rounded-2xl border bg-card p-5 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Structured preparation</p>
              <h2 className="mt-1 text-2xl font-semibold">Test series</h2>
              <p className="mt-1 text-sm text-muted-foreground">Follow ordered mock-test plans with release dates and server-verified progression.</p>
            </div>
            <Layers3 className="hidden h-7 w-7 text-primary sm:block" />
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {seriesQuery.data.series.map((series) => {
              const upcoming = Boolean(series.availabilityStartAt && new Date(series.availabilityStartAt).getTime() > Date.now());
              return (
                <article key={series.id} className="rounded-xl border bg-background p-4 transition hover:border-primary/35 hover:shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div><p className="text-xs font-medium text-muted-foreground">{series.examName}</p><h3 className="mt-1 font-semibold">{series.name}</h3></div>
                    <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${upcoming ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>{upcoming ? "Upcoming" : "Open"}</span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{series.description || "An ExamTree mock-test sequence."}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Layers3 className="h-3.5 w-3.5" />{series.testCount} tests</span>
                    <span className="inline-flex items-center gap-1"><Target className="h-3.5 w-3.5" />{progressionLabel(series.progressionMode)}</span>
                    <span>{series.questionCount} questions</span>
                    <span>{Math.max(1, Math.ceil(series.durationSeconds / 60))} minutes total</span>
                  </div>
                  {series.availabilityStartAt && <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground"><CalendarClock className="h-3.5 w-3.5" />{upcoming ? "Opens" : "Opened"} {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(series.availabilityStartAt))}</p>}
                  <Button className="mt-4 w-full" size="sm" variant={upcoming ? "outline" : "default"} onClick={() => setLocation(`/test-series/${series.id}`)}>{upcoming ? "View schedule" : "View progress"}</Button>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      {publishedTestsQuery.data?.tests.length ? (
        <section className="mx-auto max-w-7xl rounded-2xl border border-primary/20 bg-primary/5 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Standalone tests</p>
          <h2 className="mt-1 text-2xl font-semibold">Live mock tests</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {publishedTestsQuery.data.tests.map((test) => (
              <article key={test.id} className="rounded-xl border bg-card p-4">
                <p className="text-xs font-medium text-muted-foreground">{test.examName}</p>
                <h3 className="mt-1 font-semibold">{test.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{test.questionCount} questions · {Math.max(1, Math.ceil(test.durationSeconds / 60))} minutes</p>
                <Button className="mt-4" size="sm" onClick={() => setLocation(`/test/${test.id}`)}>Start test</Button>
              </article>
            ))}
          </div>
        </section>
      ) : null}
      <ExamNavigator categories={categories} subcategories={subcategories} tests={tests} />
    </div>
  );
}
