import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  ChevronRight,
  Layers3,
  Search,
  Target,
} from "lucide-react";

import { CategoryIcon } from "@/components/CategoryIcon";
import { CatalogTestBrowser } from "@/components/CatalogTestBrowser";
import { ExamNavigator } from "@/components/ExamNavigator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buildExamTreeNodes } from "@/lib/exam-tree";
import { getPublishedTests } from "@/lib/published-tests";
import { getStudentTestSeries } from "@/lib/test-series";
import { useExamCatalog } from "@/providers/ExamCatalogProvider";

const PROMO_PAGE_SIZE = 6;
const HIERARCHY_RENDER_LIMIT = 300;

const CATEGORY_TONES = [
  { card: "border-blue-100 bg-blue-50/70", icon: "bg-blue-100 text-blue-700", accent: "text-blue-700" },
  { card: "border-emerald-100 bg-emerald-50/70", icon: "bg-emerald-100 text-emerald-700", accent: "text-emerald-700" },
  { card: "border-orange-100 bg-orange-50/70", icon: "bg-orange-100 text-orange-700", accent: "text-orange-700" },
  { card: "border-violet-100 bg-violet-50/70", icon: "bg-violet-100 text-violet-700", accent: "text-violet-700" },
  { card: "border-rose-100 bg-rose-50/70", icon: "bg-rose-100 text-rose-700", accent: "text-rose-700" },
  { card: "border-cyan-100 bg-cyan-50/70", icon: "bg-cyan-100 text-cyan-700", accent: "text-cyan-700" },
] as const;

function progressionLabel(mode: "open" | "sequential" | "score_gated") {
  if (mode === "open") return "Open access";
  if (mode === "sequential") return "Complete in order";
  return "Score gated";
}

function formatCount(value: number) {
  return new Intl.NumberFormat("en-IN").format(Math.max(0, value));
}

function Pager({ page, totalPages, onPageChange, label }: { page: number; totalPages: number; onPageChange: (page: number) => void; label: string }) {
  if (totalPages <= 1) return null;
  return (
    <nav className="mt-4 flex items-center justify-between gap-3 border-t border-border/80 pt-4" aria-label={`${label} pagination`}>
      <p className="text-sm text-muted-foreground">Page {page} of {totalPages}</p>
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
  const [categorySearch, setCategorySearch] = useState("");
  const publishedTestsQuery = useQuery({ queryKey: ["published-tests"], queryFn: getPublishedTests, staleTime: 30_000 });
  const seriesQuery = useQuery({ queryKey: ["student-test-series"], queryFn: getStudentTestSeries, staleTime: 30_000 });

  const categoryNodes = useMemo(
    () => buildExamTreeNodes(categories, subcategories, tests),
    [categories, subcategories, tests],
  );
  const filteredCategoryNodes = useMemo(() => {
    const normalized = categorySearch.trim().toLowerCase();
    if (!normalized) return categoryNodes;
    return categoryNodes.filter((category) => [
      category.name,
      category.description,
      ...category.subcategories.map((subcategory) => subcategory.name),
    ].some((value) => value.toLowerCase().includes(normalized)));
  }, [categoryNodes, categorySearch]);

  if (error) {
    return (
      <div className="bg-muted/20 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg rounded-2xl border border-rose-200 bg-card p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-foreground">Could not load tests and exams</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">The test catalog is temporarily unavailable. Your saved attempts are not affected.</p>
          <Button className="mt-5 min-h-11 rounded-xl" variant="outline" onClick={() => window.location.reload()}>Try again</Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-muted/20 px-4 py-6 sm:px-6 lg:px-8" role="status" aria-label="Loading exam categories">
        <div className="mx-auto max-w-7xl space-y-5">
          <div className="skeleton-shimmer h-52 rounded-2xl" />
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => <div key={index} className="skeleton-shimmer h-36 rounded-2xl" />)}
          </div>
          <span className="sr-only">Loading published exam categories and tests…</span>
        </div>
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
  const freeTestCount = tests.filter((test) => (test.access ?? "free") === "free").length;
  const useCompactHierarchy = tests.length > HIERARCHY_RENDER_LIMIT;

  return (
    <div className="bg-muted/20 py-5 sm:py-7">
      <div className="mx-auto max-w-7xl space-y-5 px-4 sm:px-6 lg:px-8">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6" aria-labelledby="exam-library-heading">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Exam library</p>
              <h1 id="exam-library-heading" className="mt-2 text-3xl font-black tracking-[-0.035em] text-foreground sm:text-4xl">Choose your exam</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Start with an exam family, then move into its sub-exams, mock tests and focused practice without digging through one oversized list.
              </p>

              <label className="relative mt-5 block max-w-2xl">
                <span className="sr-only">Search exam categories</span>
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <Input
                  value={categorySearch}
                  onChange={(event) => setCategorySearch(event.target.value)}
                  placeholder="Search SSC, Banking, Punjab exams..."
                  className="h-12 rounded-xl border-border bg-background pl-10 shadow-sm"
                  data-testid="exam-category-search"
                />
              </label>
            </div>

            <div className="grid grid-cols-3 gap-2" aria-label="Published exam catalog summary">
              <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-3">
                <p className="text-xl font-black tabular-nums text-blue-700">{formatCount(categoryNodes.length)}</p>
                <p className="mt-0.5 text-[11px] font-semibold text-slate-600">Exam families</p>
              </div>
              <div className="rounded-xl border border-violet-100 bg-violet-50/70 p-3">
                <p className="text-xl font-black tabular-nums text-violet-700">{formatCount(tests.length)}</p>
                <p className="mt-0.5 text-[11px] font-semibold text-slate-600">Published tests</p>
              </div>
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-3">
                <p className="text-xl font-black tabular-nums text-emerald-700">{formatCount(freeTestCount)}</p>
                <p className="mt-0.5 text-[11px] font-semibold text-slate-600">Free tests</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6" aria-labelledby="exam-categories-heading">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="exam-categories-heading" className="text-xl font-black tracking-tight text-foreground">Exam categories</h2>
              <p className="mt-1 text-sm text-muted-foreground">Open a category to see its sub-exams and available test paths.</p>
            </div>
            <p className="text-sm font-semibold text-muted-foreground" aria-live="polite">
              {categorySearch.trim() ? `${filteredCategoryNodes.length} of ${categoryNodes.length}` : `${categoryNodes.length} categories`}
            </p>
          </div>

          {filteredCategoryNodes.length > 0 ? (
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3" data-testid="exam-category-grid">
              {filteredCategoryNodes.map((category, index) => {
                const tone = CATEGORY_TONES[index % CATEGORY_TONES.length];
                const freeCount = category.tests.filter((test) => (test.access ?? "free") === "free").length;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setLocation(`/category/${category.id}`)}
                    className={`et-interactive group min-h-[138px] rounded-2xl border p-4 text-left transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:shadow-md ${tone.card}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone.icon}`}>
                        <CategoryIcon icon={category.icon} className="h-5 w-5" />
                      </span>
                      <ChevronRight className={`mt-1 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${tone.accent}`} aria-hidden="true" />
                    </div>
                    <h3 className="mt-3 line-clamp-1 text-sm font-black text-foreground">{category.name}</h3>
                    <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{category.description}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold text-muted-foreground">
                      <span>{formatCount(category.tests.length)} tests</span>
                      <span>{formatCount(category.subcategories.length)} exam paths</span>
                      {freeCount > 0 ? <span className="text-emerald-700">{formatCount(freeCount)} free</span> : null}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="mt-5 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-8 text-center">
              <p className="font-semibold text-foreground">No exam category matches “{categorySearch.trim()}”.</p>
              <p className="mt-1 text-sm text-muted-foreground">Try a broader exam name or clear the search.</p>
              <Button className="mt-4 min-h-11 rounded-xl" variant="outline" onClick={() => setCategorySearch("")}>Clear search</Button>
            </div>
          )}
        </section>

        {seriesQuery.isError && (
          <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900" role="status">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p>Test series could not be loaded. The standalone catalog below is still available.</p><Button className="min-h-11 rounded-xl" size="sm" variant="outline" onClick={() => void seriesQuery.refetch()}>Retry series</Button></div>
          </section>
        )}

        {series.length > 0 ? (
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6" data-testid="series-section" aria-labelledby="test-series-heading">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Structured preparation</p>
                <h2 id="test-series-heading" className="mt-1 text-xl font-black tracking-tight text-foreground">Test series</h2>
                <p className="mt-1 text-sm text-muted-foreground">Follow ordered mock-test plans with release dates and server-verified progression.</p>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground"><Layers3 className="h-4 w-4 text-primary" aria-hidden="true" /><span>{series.length} series</span></div>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {visibleSeries.map((seriesItem) => {
                const upcoming = Boolean(seriesItem.availabilityStartAt && new Date(seriesItem.availabilityStartAt).getTime() > Date.now());
                return (
                  <article key={seriesItem.id} className="rounded-xl border border-border bg-background p-4 transition hover:border-primary/30 hover:shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0"><p className="truncate text-xs font-medium text-muted-foreground">{seriesItem.examName}</p><h3 className="mt-1 line-clamp-2 text-sm font-bold leading-5 text-foreground">{seriesItem.name}</h3></div>
                      <span className={`shrink-0 rounded-lg px-2 py-1 text-[10px] font-bold ${upcoming ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>{upcoming ? "Upcoming" : "Open"}</span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">{seriesItem.description || "An ExamTree mock-test sequence."}</p>
                    <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] font-semibold text-muted-foreground">
                      <span>{seriesItem.testCount} tests</span><span>{seriesItem.questionCount} questions</span><span>{Math.max(1, Math.ceil(seriesItem.durationSeconds / 60))} min</span><span>{progressionLabel(seriesItem.progressionMode)}</span>
                    </div>
                    <div className="mt-4 flex items-end justify-between gap-3">
                      <p className="min-w-0 text-[11px] leading-4 text-muted-foreground">
                        {seriesItem.availabilityStartAt ? <span className="inline-flex items-center gap-1"><CalendarClock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />{upcoming ? "Opens" : "Opened"} {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(seriesItem.availabilityStartAt))}</span> : "Available now"}
                      </p>
                      <Button className="min-h-11 shrink-0 rounded-xl" size="sm" variant={upcoming ? "outline" : "default"} onClick={() => setLocation(`/test-series/${seriesItem.id}`)}>{upcoming ? "View schedule" : "View progress"}</Button>
                    </div>
                  </article>
                );
              })}
            </div>
            <Pager page={activeSeriesPage} totalPages={seriesPages} onPageChange={setSeriesPage} label="Test series" />
          </section>
        ) : null}

        {publishedTestsQuery.isError && (
          <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900" role="status">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p>Live standalone tests could not be loaded. Browse the full catalog below while you retry.</p><Button className="min-h-11 rounded-xl" size="sm" variant="outline" onClick={() => void publishedTestsQuery.refetch()}>Retry live tests</Button></div>
          </section>
        )}

        {publishedTests.length > 0 ? (
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6" data-testid="published-tests-section" aria-labelledby="live-mocks-heading">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Ready now</p><h2 id="live-mocks-heading" className="mt-1 text-xl font-black tracking-tight text-foreground">Live mock tests</h2><p className="mt-1 text-sm text-muted-foreground">Start a standalone published test without entering a series.</p></div>
              <p className="text-sm font-semibold text-muted-foreground">{publishedTests.length} published</p>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {visiblePublishedTests.map((test) => (
                <article key={test.id} className="rounded-xl border border-border bg-background p-4 transition hover:border-primary/30 hover:shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0"><p className="truncate text-xs font-medium text-muted-foreground">{test.examName}</p><h3 className="mt-1 line-clamp-2 text-sm font-bold leading-5 text-foreground">{test.title}</h3></div>
                    <span className="shrink-0 rounded-lg bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-700">LIVE</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-semibold text-muted-foreground"><span>{test.questionCount} questions</span><span>{Math.max(1, Math.ceil(test.durationSeconds / 60))} min</span></div>
                  <div className="mt-4 flex justify-end"><Button className="min-h-11 rounded-xl" size="sm" onClick={() => setLocation(`/test/${test.id}`)}>Start test<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Button></div>
                </article>
              ))}
            </div>
            <Pager page={activePublishedPage} totalPages={publishedPages} onPageChange={setPublishedPage} label="Live mock tests" />
          </section>
        ) : null}

        <CatalogTestBrowser tests={tests} />

        {useCompactHierarchy ? (
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6" data-testid="catalog-large-mode">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Detailed exam paths</p><h2 className="mt-1 text-xl font-black tracking-tight text-foreground">Compact hierarchy for a large catalog</h2><p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">Open an exam family for its dedicated path instead of rendering hundreds of nested test cards at once.</p></div>
              <p className="text-sm font-semibold text-muted-foreground">{tests.length.toLocaleString()} tests</p>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categoryNodes.map((category) => (
                <button key={category.id} type="button" onClick={() => setLocation(`/category/${category.id}`)} className="et-interactive flex min-h-11 items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-3 text-left text-sm font-bold text-foreground transition hover:border-primary/30 hover:bg-background">
                  <span className="truncate">{category.name}</span><ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                </button>
              ))}
            </div>
          </section>
        ) : (
          <section aria-labelledby="catalog-path-heading">
            <div className="mb-4 flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><BookOpen className="h-5 w-5" aria-hidden="true" /></span>
              <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Detailed exam paths</p><h2 id="catalog-path-heading" className="mt-1 text-xl font-black tracking-tight text-foreground">Explore the catalog hierarchy</h2></div>
            </div>
            <ExamNavigator categories={categories} subcategories={subcategories} tests={tests} />
          </section>
        )}
      </div>
    </div>
  );
}
