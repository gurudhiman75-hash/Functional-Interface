import { useState } from "react";
import { useExamCatalog } from "@/providers/ExamCatalogProvider";
import { useQuery } from "@tanstack/react-query";
import { getPublishedTests } from "@/lib/published-tests";
import { getStudentTestSeries } from "@/lib/test-series";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ExamNavigator } from "@/components/ExamNavigator";
import { CatalogTestBrowser } from "@/components/CatalogTestBrowser";
import { CalendarClock, ChevronRight, Layers3, Target } from "lucide-react";

const PROMO_PAGE_SIZE = 6;
const HIERARCHY_RENDER_LIMIT = 300;

function progressionLabel(mode: "open" | "sequential" | "score_gated") {
  if (mode === "open") return "Open access";
  if (mode === "sequential") return "Complete in order";
  return "Score gated";
}

function Pager({ page, totalPages, onPageChange, label }: { page: number; totalPages: number; onPageChange: (page: number) => void; label: string }) {
  if (totalPages <= 1) return null;
  return (
    <nav className="mt-5 flex items-center justify-between gap-3 border-t border-border/70 pt-5" aria-label={`${label} pagination`}>
      <p className="text-sm font-medium text-muted-foreground">Page {page} of {totalPages}</p>
      <div className="flex gap-2">
        <Button className="min-h-11 rounded-xl" size="sm" variant="outline" disabled={page <= 1} onClick={() => onPageChange(Math.max(1, page - 1))}>Previous</Button>
        <Button className="min-h-11 rounded-xl" size="sm" variant="outline" disabled={page >= totalPages} onClick={() => onPageChange(Math.min(totalPages, page + 1))}>Next</Button>
      </div>
    </nav>
  );
}

export default function Tests() {
  const { categories, subcategories, tests, isLoading, error } = useExamCatalog();
  const [, setLocation] = useLocation();
  const [seriesPage, setSeriesPage] = useState(1);
  const [publishedPage, setPublishedPage] = useState(1);
  const publishedTestsQuery = useQuery({ queryKey: ["published-tests"], queryFn: getPublishedTests, staleTime: 30_000 });
  const seriesQuery = useQuery({ queryKey: ["student-test-series"], queryFn: getStudentTestSeries, staleTime: 30_000 });

  if (error) {
    return (
      <div className="et-panel-raised mx-auto w-full max-w-lg rounded-3xl border border-rose-200/80 p-8 text-center">
        <h1 className="text-xl font-semibold text-foreground">Could not load tests and exams</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">The test catalog is temporarily unavailable. Your saved attempts are not affected.</p>
        <Button className="mt-5 min-h-11 rounded-xl" variant="outline" onClick={() => window.location.reload()}>Try again</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-5" role="status" aria-label="Loading tests and exams">
        <div className="skeleton-shimmer h-36 rounded-3xl" />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <div className="skeleton-shimmer h-64 rounded-2xl" /><div className="skeleton-shimmer h-64 rounded-2xl" /><div className="skeleton-shimmer h-64 rounded-2xl" />
        </div>
        <div className="skeleton-shimmer h-96 rounded-3xl" />
        <span className="sr-only">Loading test catalog…</span>
      </div>
    );
  }

  const series = seriesQuery.data?.series ?? [];
  const seriesPages = Math.max(1, Math.ceil(series.length / PROMO_PAGE_SIZE));
  const activeSeriesPage = Math.min(seriesPage, seriesPages);
  const visibleSeries = series.slice((activeSeriesPage - 1) * PROMO_PAGE_SIZE, activeSeriesPage * PROMO_PAGE_SIZE);

  const publishedTests = publishedTestsQuery.data?.tests ?? [];
  const publishedPages = Math.max(1, Math.ceil(publishedTests.length / PROMO_PAGE_SIZE));
  const activePublishedPage = Math.min(publishedPage, publishedPages);
  const visiblePublishedTests = publishedTests.slice((activePublishedPage - 1) * PROMO_PAGE_SIZE, activePublishedPage * PROMO_PAGE_SIZE);
  const useCompactHierarchy = tests.length > HIERARCHY_RENDER_LIMIT;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">
      {seriesQuery.isError && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50/90 p-4 text-sm text-amber-900 shadow-sm" role="status">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p>Test series could not be loaded. The standalone catalog below is still available.</p><Button className="min-h-11 rounded-xl" size="sm" variant="outline" onClick={() => void seriesQuery.refetch()}>Retry series</Button></div>
        </section>
      )}

      {series.length > 0 ? (
        <section className="et-panel-raised rounded-3xl border border-border/80 p-5 sm:p-6" data-testid="series-section">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Structured preparation</p><h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Test series</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Follow ordered mock-test plans with release dates and server-verified progression.</p></div>
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-border/80 bg-muted/40 px-3 py-1.5 text-sm font-medium text-muted-foreground sm:self-auto"><Layers3 className="h-4 w-4 text-primary" /><span>{series.length} series</span></div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleSeries.map((seriesItem) => {
              const upcoming = Boolean(seriesItem.availabilityStartAt && new Date(seriesItem.availabilityStartAt).getTime() > Date.now());
              return (
                <article key={seriesItem.id} className="rounded-2xl border border-border/80 bg-card/80 p-5 shadow-sm transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
                  <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-xs font-medium text-muted-foreground">{seriesItem.examName}</p><h3 className="mt-1 text-lg font-semibold tracking-tight text-foreground">{seriesItem.name}</h3></div><span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${upcoming ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>{upcoming ? "Upcoming" : "Open"}</span></div>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{seriesItem.description || "An ExamTree mock-test sequence."}</p>
                  <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 rounded-xl bg-muted/35 p-3 text-xs text-muted-foreground"><span className="inline-flex items-center gap-1.5"><Layers3 className="h-3.5 w-3.5 text-primary" />{seriesItem.testCount} tests</span><span className="inline-flex items-center gap-1.5"><Target className="h-3.5 w-3.5 text-primary" />{progressionLabel(seriesItem.progressionMode)}</span><span>{seriesItem.questionCount} questions</span><span>{Math.max(1, Math.ceil(seriesItem.durationSeconds / 60))} minutes total</span></div>
                  {seriesItem.availabilityStartAt && <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground"><CalendarClock className="h-3.5 w-3.5" />{upcoming ? "Opens" : "Opened"} {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(seriesItem.availabilityStartAt))}</p>}
                  <Button className="mt-4 min-h-11 w-full rounded-xl" size="sm" variant={upcoming ? "outline" : "default"} onClick={() => setLocation(`/test-series/${seriesItem.id}`)}>{upcoming ? "View schedule" : "View progress"}</Button>
                </article>
              );
            })}
          </div>
          <Pager page={activeSeriesPage} totalPages={seriesPages} onPageChange={setSeriesPage} label="Test series" />
        </section>
      ) : null}

      {publishedTestsQuery.isError && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50/90 p-4 text-sm text-amber-900 shadow-sm" role="status">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p>Live standalone tests could not be loaded. Browse the full catalog below while you retry.</p><Button className="min-h-11 rounded-xl" size="sm" variant="outline" onClick={() => void publishedTestsQuery.refetch()}>Retry live tests</Button></div>
        </section>
      )}

      {publishedTests.length > 0 ? (
        <section className="et-panel-raised rounded-3xl border border-primary/20 bg-primary/[0.035] p-5 sm:p-6" data-testid="published-tests-section">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Standalone tests</p><h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Live mock tests</h2><p className="mt-2 text-sm text-muted-foreground">Jump directly into a published test without a series requirement.</p></div><p className="rounded-full border border-primary/15 bg-background/80 px-3 py-1.5 text-sm font-medium text-muted-foreground">{publishedTests.length} published</p></div>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visiblePublishedTests.map((test) => <article key={test.id} className="rounded-2xl border border-border/80 bg-card/90 p-5 shadow-sm transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"><p className="text-xs font-medium text-muted-foreground">{test.examName}</p><h3 className="mt-1 line-clamp-2 text-lg font-semibold tracking-tight text-foreground">{test.title}</h3><p className="mt-2 text-sm text-muted-foreground">{test.questionCount} questions · {Math.max(1, Math.ceil(test.durationSeconds / 60))} minutes</p><Button className="mt-4 min-h-11 rounded-xl px-5" size="sm" onClick={() => setLocation(`/test/${test.id}`)}>Start test</Button></article>)}
          </div>
          <Pager page={activePublishedPage} totalPages={publishedPages} onPageChange={setPublishedPage} label="Live mock tests" />
        </section>
      ) : null}

      <CatalogTestBrowser tests={tests} />

      {useCompactHierarchy ? (
        <section className="et-panel-raised rounded-3xl border border-border/80 p-5 sm:p-6" data-testid="catalog-large-mode">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Browse by exam family</p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div><h2 className="text-2xl font-bold tracking-tight text-foreground">Compact category view for a large catalog</h2><p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">The full test list stays paginated above. Open a category for its dedicated exam path instead of rendering hundreds of nested test cards at once.</p></div>
            <p className="text-sm font-semibold text-muted-foreground">{tests.length.toLocaleString()} tests</p>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => (
              <button key={category.id} type="button" onClick={() => setLocation(`/category/${category.id}`)} className="et-interactive flex min-h-11 items-center justify-between rounded-xl border border-border/80 bg-muted/30 px-4 py-3 text-left font-semibold text-foreground hover:border-primary/30 hover:bg-card">
                <span className="truncate">{category.name}</span><ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              </button>
            ))}
          </div>
        </section>
      ) : (
        <section aria-labelledby="catalog-path-heading">
          <div className="mb-4"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Browse by exam path</p><h2 id="catalog-path-heading" className="mt-1 text-2xl font-bold tracking-tight text-foreground">Explore the catalog hierarchy</h2></div>
          <ExamNavigator categories={categories} subcategories={subcategories} tests={tests} />
        </section>
      )}
    </div>
  );
}
