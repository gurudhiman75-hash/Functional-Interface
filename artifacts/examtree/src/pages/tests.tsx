import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  ArrowRight,
  CalendarClock,
  ChevronRight,
  Clock3,
  Layers3,
  LayoutGrid,
  Search,
  Sparkles,
  Target,
} from "lucide-react";

import { CategoryIcon } from "@/components/CategoryIcon";
import { CatalogTestBrowser } from "@/components/CatalogTestBrowser";
import { Button } from "@/components/ui/button";
import { buildExamTreeNodes } from "@/lib/exam-tree";
import { getPublishedTests } from "@/lib/published-tests";
import { getStudentTestSeries } from "@/lib/test-series";
import { useExamCatalog } from "@/providers/ExamCatalogProvider";

const PROMO_PAGE_SIZE = 6;

const CATEGORY_TONES = [
  { card: "border-blue-100 bg-blue-50/65", icon: "bg-blue-100 text-blue-700" },
  { card: "border-emerald-100 bg-emerald-50/65", icon: "bg-emerald-100 text-emerald-700" },
  { card: "border-orange-100 bg-orange-50/65", icon: "bg-orange-100 text-orange-700" },
  { card: "border-violet-100 bg-violet-50/65", icon: "bg-violet-100 text-violet-700" },
  { card: "border-rose-100 bg-rose-50/65", icon: "bg-rose-100 text-rose-700" },
  { card: "border-cyan-100 bg-cyan-50/65", icon: "bg-cyan-100 text-cyan-700" },
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
        <Button className="min-h-11" size="sm" variant="outline" disabled={page <= 1} onClick={() => onPageChange(Math.max(1, page - 1))}>Previous</Button>
        <Button className="min-h-11" size="sm" variant="outline" disabled={page >= totalPages} onClick={() => onPageChange(Math.min(totalPages, page + 1))}>Next</Button>
      </div>
    </nav>
  );
}

export default function Tests() {
  const { categories, subcategories, tests, isLoading, error } = useExamCatalog();
  const [, setLocation] = useLocation();
  const [categoryQuery, setCategoryQuery] = useState("");
  const [seriesPage, setSeriesPage] = useState(1);
  const [publishedPage, setPublishedPage] = useState(1);
  const publishedTestsQuery = useQuery({ queryKey: ["published-tests"], queryFn: getPublishedTests, staleTime: 30_000 });
  const seriesQuery = useQuery({ queryKey: ["student-test-series"], queryFn: getStudentTestSeries, staleTime: 30_000 });

  const categoryNodes = useMemo(
    () => buildExamTreeNodes(categories, subcategories, tests),
    [categories, subcategories, tests],
  );
  const normalizedQuery = categoryQuery.trim().toLowerCase();
  const filteredCategories = useMemo(
    () => categoryNodes.filter((category) => {
      if (!normalizedQuery) return true;
      return category.name.toLowerCase().includes(normalizedQuery)
        || category.description.toLowerCase().includes(normalizedQuery)
        || category.subcategories.some((sub) => sub.name.toLowerCase().includes(normalizedQuery));
    }),
    [categoryNodes, normalizedQuery],
  );
  const catalogQuestionCount = tests.reduce((sum, test) => sum + Math.max(0, test.totalQuestions), 0);

  if (error) {
    return (
      <div className="mx-auto my-10 max-w-lg rounded-2xl border border-rose-200 bg-card p-8 text-center shadow-sm">
        <h1 className="text-xl font-bold text-foreground">Could not load tests and exams</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">The test catalog is temporarily unavailable. Your saved attempts are not affected.</p>
        <Button className="mt-5 min-h-11" variant="outline" onClick={() => window.location.reload()}>Try again</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-5 px-4 py-6 sm:px-6 lg:px-8" role="status" aria-label="Loading exam categories">
        <div className="skeleton-shimmer h-44 rounded-2xl" />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => <div key={index} className="skeleton-shimmer h-36 rounded-2xl" />)}
        </div>
        <span className="sr-only">Loading published tests and exam categories…</span>
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

  return (
    <div className="bg-muted/20 py-5 sm:py-7">
      <div className="mx-auto w-full max-w-7xl space-y-5 px-4 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-card to-card shadow-sm" aria-labelledby="exam-categories-heading">
          <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_380px] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100/80 px-3 py-1.5 text-xs font-bold text-blue-700">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                Exam discovery
              </div>
              <h1 id="exam-categories-heading" className="mt-4 text-3xl font-black tracking-[-0.035em] text-foreground sm:text-4xl">Choose your exam category</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Start with the exam family you are preparing for, then narrow into sub-exams, mock tests, and published practice.
              </p>
            </div>
            <div>
              <label htmlFor="exam-category-search" className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Find an exam</label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <input
                  id="exam-category-search"
                  type="search"
                  value={categoryQuery}
                  onChange={(event) => setCategoryQuery(event.target.value)}
                  placeholder="Search SSC, Banking, Punjab exams…"
                  className="min-h-[48px] w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm font-semibold text-foreground shadow-sm outline-none placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
                />
              </div>
            </div>
          </div>

          <div className="grid border-t border-blue-100 sm:grid-cols-3">
            <div className="flex items-center gap-3 border-b border-blue-100 px-5 py-3.5 sm:border-b-0 sm:border-r">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700"><LayoutGrid className="h-4 w-4" aria-hidden="true" /></span>
              <div><p className="text-lg font-black leading-none text-foreground">{formatCount(categoryNodes.length)}</p><p className="mt-1 text-xs font-semibold text-muted-foreground">Exam families</p></div>
            </div>
            <div className="flex items-center gap-3 border-b border-blue-100 px-5 py-3.5 sm:border-b-0 sm:border-r">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-violet-700"><Layers3 className="h-4 w-4" aria-hidden="true" /></span>
              <div><p className="text-lg font-black leading-none text-foreground">{formatCount(tests.length)}</p><p className="mt-1 text-xs font-semibold text-muted-foreground">Published tests</p></div>
            </div>
            <div className="flex items-center gap-3 px-5 py-3.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700"><Target className="h-4 w-4" aria-hidden="true" /></span>
              <div><p className="text-lg font-black leading-none text-foreground">{formatCount(catalogQuestionCount)}</p><p className="mt-1 text-xs font-semibold text-muted-foreground">Live questions</p></div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6" aria-labelledby="all-exam-categories-heading">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="all-exam-categories-heading" className="text-xl font-black tracking-tight text-foreground">Exam categories</h2>
              <p className="mt-1 text-sm text-muted-foreground">Open a category to see its sub-exams and available tests.</p>
            </div>
            <p className="text-sm font-semibold text-muted-foreground">{filteredCategories.length} {filteredCategories.length === 1 ? "category" : "categories"}</p>
          </div>

          {filteredCategories.length > 0 ? (
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filteredCategories.map((category, index) => {
                const tone = CATEGORY_TONES[index % CATEGORY_TONES.length];
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setLocation(`/category/${category.id}`)}
                    className={`et-interactive group min-h-[132px] rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md ${tone.card}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone.icon}`}>
                        <CategoryIcon icon={category.icon} className="h-5 w-5" />
                      </span>
                      <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden="true" />
                    </div>
                    <h3 className="mt-3 truncate text-sm font-black text-foreground">{category.name}</h3>
                    <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold text-muted-foreground">
                      <span>{formatCount(category.tests.length)} tests</span>
                      <span>{formatCount(category.subcategories.length)} sub-exams</span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="mt-5 rounded-xl border border-dashed border-border bg-muted/30 px-5 py-8 text-center">
              <p className="font-bold text-foreground">No exam category matches “{categoryQuery.trim()}”</p>
              <p className="mt-1 text-sm text-muted-foreground">Try a broader exam name or clear the search.</p>
              <Button className="mt-4 min-h-11" variant="outline" onClick={() => setCategoryQuery("")}>Clear search</Button>
            </div>
          )}
        </section>

        {publishedTestsQuery.isError ? (
          <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900" role="status">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p>Live standalone tests could not be loaded. The full catalog remains available below.</p><Button className="min-h-11" size="sm" variant="outline" onClick={() => void publishedTestsQuery.refetch()}>Retry live tests</Button></div>
          </section>
        ) : null}

        {publishedTests.length > 0 ? (
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6" data-testid="published-tests-section" aria-labelledby="live-mocks-heading">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600">Quick practice</p><h2 id="live-mocks-heading" className="mt-1 text-xl font-black tracking-tight text-foreground">Live mock tests</h2><p className="mt-1 text-sm text-muted-foreground">Start a published standalone mock without opening the full catalog.</p></div>
              <p className="text-sm font-semibold text-muted-foreground">{publishedTests.length} published</p>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {visiblePublishedTests.map((test) => (
                <article key={test.id} className="rounded-xl border border-border bg-background p-4 transition hover:border-primary/25 hover:shadow-sm">
                  <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate text-xs font-bold text-blue-600">{test.examName}</p><h3 className="mt-1 line-clamp-2 text-sm font-black leading-5 text-foreground">{test.title}</h3></div><span className="shrink-0 rounded-md bg-emerald-100 px-2 py-1 text-[10px] font-black text-emerald-700">LIVE</span></div>
                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-muted-foreground">
                    <span>{test.questionCount} questions</span>
                    <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" aria-hidden="true" />{Math.max(1, Math.ceil(test.durationSeconds / 60))} min</span>
                  </div>
                  <div className="mt-4 flex justify-end"><Button className="min-h-11" size="sm" onClick={() => setLocation(`/test/${test.id}`)}>Start test <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" /></Button></div>
                </article>
              ))}
            </div>
            <Pager page={activePublishedPage} totalPages={publishedPages} onPageChange={setPublishedPage} label="Live mock tests" />
          </section>
        ) : null}

        {seriesQuery.isError ? (
          <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900" role="status">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p>Test series could not be loaded. Standalone tests and the catalog remain available.</p><Button className="min-h-11" size="sm" variant="outline" onClick={() => void seriesQuery.refetch()}>Retry series</Button></div>
          </section>
        ) : null}

        {series.length > 0 ? (
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6" data-testid="series-section" aria-labelledby="test-series-heading">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-600">Structured preparation</p><h2 id="test-series-heading" className="mt-1 text-xl font-black tracking-tight text-foreground">Test series</h2><p className="mt-1 text-sm text-muted-foreground">Follow ordered mock-test plans with release dates and server-verified progression.</p></div>
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground"><Layers3 className="h-4 w-4 text-violet-600" aria-hidden="true" /><span>{series.length} series</span></div>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {visibleSeries.map((seriesItem) => {
                const upcoming = Boolean(seriesItem.availabilityStartAt && new Date(seriesItem.availabilityStartAt).getTime() > Date.now());
                return (
                  <article key={seriesItem.id} className="rounded-xl border border-border bg-background p-4 transition hover:border-primary/25 hover:shadow-sm">
                    <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate text-xs font-bold text-violet-600">{seriesItem.examName}</p><h3 className="mt-1 line-clamp-2 text-sm font-black leading-5 text-foreground">{seriesItem.name}</h3></div><span className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-black ${upcoming ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>{upcoming ? "UPCOMING" : "OPEN"}</span></div>
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">{seriesItem.description || "An ExamTree mock-test sequence."}</p>
                    <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold text-muted-foreground"><span>{seriesItem.testCount} tests</span><span>{seriesItem.questionCount} questions</span><span>{progressionLabel(seriesItem.progressionMode)}</span></div>
                    {seriesItem.availabilityStartAt ? <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground"><CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />{upcoming ? "Opens" : "Opened"} {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(seriesItem.availabilityStartAt))}</p> : null}
                    <div className="mt-4 flex justify-end"><Button className="min-h-11" size="sm" variant={upcoming ? "outline" : "default"} onClick={() => setLocation(`/test-series/${seriesItem.id}`)}>{upcoming ? "View schedule" : "View progress"}</Button></div>
                  </article>
                );
              })}
            </div>
            <Pager page={activeSeriesPage} totalPages={seriesPages} onPageChange={setSeriesPage} label="Test series" />
          </section>
        ) : null}

        <section aria-labelledby="full-catalog-heading">
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal-700">All published practice</p>
            <h2 id="full-catalog-heading" className="mt-1 text-xl font-black tracking-tight text-foreground">Browse the full test catalog</h2>
            <p className="mt-1 text-sm text-muted-foreground">Filter individual tests when you already know exactly what you want to practise.</p>
          </div>
          <CatalogTestBrowser tests={tests} />
        </section>
      </div>
    </div>
  );
}
