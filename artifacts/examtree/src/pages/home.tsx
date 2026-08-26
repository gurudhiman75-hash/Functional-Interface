import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileClock,
  Languages,
  Layers3,
  ListChecks,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";

import { CategoryIcon } from "@/components/CategoryIcon";
import { Button } from "@/components/ui/button";
import { buildExamTreeNodes } from "@/lib/exam-tree";
import {
  SAMPLE_HOME_CATEGORIES,
  SAMPLE_HOME_SERIES,
  SAMPLE_HOME_SUBCATEGORIES,
  SAMPLE_HOME_TESTS,
} from "@/lib/home-sample-data";
import { getActiveTestSessions, getAttempts } from "@/lib/storage";
import { getStudentTestSeries } from "@/lib/test-series";
import { useExamCatalog } from "@/providers/ExamCatalogProvider";

const PRACTICE_MODES = [
  {
    label: "Full mock tests",
    description: "Train through the complete published exam format in one sitting.",
    icon: Trophy,
    kind: "full-length" as const,
    href: "/mock-tests",
  },
  {
    label: "Sectional tests",
    description: "Focus on one exam section at a time and build speed deliberately.",
    icon: ListChecks,
    kind: "sectional" as const,
    href: "/exams",
  },
  {
    label: "Topic practice",
    description: "Work on narrower skills before moving back into timed mocks.",
    icon: Layers3,
    kind: "topic-wise" as const,
    href: "/exams",
  },
  {
    label: "Previous-year questions",
    description: "Use published PYQ sets to understand the shape of earlier papers.",
    icon: FileClock,
    kind: "pyq" as const,
    href: "/pyqs",
  },
] as const;

const FAQS = [
  {
    question: "Where should I start if I am new to ExamTree?",
    answer: "Choose your exam from the search or exam-family cards, then begin with a free published test when one is available.",
  },
  {
    question: "Can I practise without taking a full mock?",
    answer: "Yes. Published sectional, topic-wise and PYQ formats appear separately from full-length mocks so you can choose the depth you need.",
  },
  {
    question: "Does ExamTree support Hindi and Punjabi?",
    answer: "Multilingual options are shown only on tests where those languages are actually published. Availability can differ by test.",
  },
  {
    question: "Can I resume an unfinished test?",
    answer: "If a saved active session exists on this device, the homepage shows a continue card that takes you back into that test.",
  },
] as const;

function formatCount(value: number) {
  return new Intl.NumberFormat("en-IN").format(Math.max(0, Number(value) || 0));
}

function normalize(value: string | null | undefined) {
  return String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function initials(value: string) {
  const words = value.trim().split(/\s+/).filter(Boolean);
  return words.length ? words.slice(0, 2).map((word) => word[0]?.toUpperCase()).join("") : "ET";
}

function languageLabel(languages: string[] | undefined) {
  if (!languages?.length) return null;
  const labels = languages.map((language) => {
    const normalized = language.toLowerCase();
    if (normalized === "en" || normalized === "english") return "EN";
    if (normalized === "hi" || normalized === "hindi") return "HI";
    if (normalized === "pa" || normalized === "punjabi") return "PA";
    return language.toUpperCase();
  });
  return Array.from(new Set(labels)).join(" · ");
}

function ExamMark({ name, icon }: { name: string; icon?: string }) {
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border bg-background text-xs font-black text-muted-foreground shadow-sm">
      {icon ? <CategoryIcon icon={icon} className="h-5 w-5 text-primary" /> : initials(name)}
    </span>
  );
}

export default function Home() {
  const [, setLocation] = useLocation();
  const catalog = useExamCatalog();
  const sampleMode = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("preview") === "sample";
  const [examQuery, setExamQuery] = useState("");

  const categories = sampleMode ? SAMPLE_HOME_CATEGORIES : catalog.categories;
  const subcategories = sampleMode ? SAMPLE_HOME_SUBCATEGORIES : catalog.subcategories;
  const tests = sampleMode ? SAMPLE_HOME_TESTS : catalog.tests;

  const seriesQuery = useQuery({
    queryKey: ["student-test-series"],
    queryFn: getStudentTestSeries,
    enabled: !sampleMode,
    staleTime: 30_000,
  });

  const attempts = getAttempts();
  const activeSessions = Object.values(getActiveTestSessions());
  const latestAttempt = attempts[0] ?? null;
  const activeSession = activeSessions[0] ?? null;

  const examGroups = useMemo(() => buildExamTreeNodes(categories, subcategories, tests), [categories, subcategories, tests]);
  const series = useMemo(
    () => [...(sampleMode ? SAMPLE_HOME_SERIES : (seriesQuery.data?.series ?? []))]
      .sort((left, right) => Number(right.attemptCount ?? 0) - Number(left.attemptCount ?? 0)),
    [sampleMode, seriesQuery.data?.series],
  );

  const normalizedQuery = normalize(examQuery);
  const searchResults = useMemo(
    () => examGroups.filter((group) => !normalizedQuery || normalize(`${group.name} ${group.description} ${group.subcategories.map((item) => item.name).join(" ")}`).includes(normalizedQuery)).slice(0, 5),
    [examGroups, normalizedQuery],
  );

  const popularTests = useMemo(
    () => [...tests]
      .sort((left, right) => Number(right.attempts ?? 0) - Number(left.attempts ?? 0))
      .slice(0, 8),
    [tests],
  );
  const freeTests = useMemo(() => tests.filter((test) => (test.access ?? "free") === "free"), [tests]);
  const topFreeTest = useMemo(
    () => [...freeTests].sort((left, right) => Number(right.attempts ?? 0) - Number(left.attempts ?? 0))[0] ?? null,
    [freeTests],
  );
  const catalogQuestionCount = tests.reduce((sum, test) => sum + Math.max(0, Number(test.totalQuestions) || 0), 0);
  const featuredSeries = series.slice(0, 4);
  const featuredExamGroups = examGroups.slice(0, 8);

  const modeCounts = useMemo(() => PRACTICE_MODES.map((mode) => ({
    ...mode,
    count: mode.kind === "pyq"
      ? tests.filter((test) => /\bpyq\b|previous year|previous-year/i.test(test.name)).length
      : tests.filter((test) => test.kind === mode.kind).length,
  })), [tests]);

  const goMarketplace = () => setLocation(sampleMode ? "/exams?preview=sample" : "/exams");
  const goCategory = (id: string) => setLocation(sampleMode ? "/exams?preview=sample" : `/category/${id}`);
  const goSeries = (id: string) => setLocation(sampleMode ? "/exams?preview=sample" : `/test-series/${id}`);
  const goTest = (id: string) => setLocation(sampleMode ? "/exams?preview=sample" : `/test/${id}`);
  const goMode = (href: string) => setLocation(sampleMode ? "/exams?preview=sample" : href);

  if (!sampleMode && catalog.error) {
    return (
      <div className="mx-auto my-16 max-w-lg rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
        <h1 className="text-xl font-black text-foreground">Could not load ExamTree</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">The published test catalog is temporarily unavailable. Saved attempts are not affected.</p>
        <Button className="mt-5 min-h-11" variant="outline" onClick={() => window.location.reload()}>Try again</Button>
      </div>
    );
  }

  if (!sampleMode && catalog.isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-5 px-4 py-8 sm:px-6 lg:px-8" role="status" aria-label="Loading ExamTree home">
        <div className="skeleton-shimmer h-[430px] rounded-[32px]" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div key={index} className="skeleton-shimmer h-24 rounded-2xl" />)}</div>
        <span className="sr-only">Loading published exams and tests…</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-clip bg-background">
      {sampleMode ? (
        <div className="border-b border-amber-200 bg-amber-50 text-amber-950" data-testid="home-sample-preview-badge">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <span><strong>Sample data preview.</strong> Catalog examples on this page are visual-only and do not alter production data.</span>
            <button type="button" className="min-h-11 self-start rounded-lg px-3 text-xs font-black hover:bg-amber-100 sm:self-auto" onClick={() => setLocation("/")}>Exit preview</button>
          </div>
        </div>
      ) : null}

      <section className="border-b border-border bg-gradient-to-b from-primary/[0.07] via-background to-background" data-testid="home-hero">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] lg:items-center lg:px-8 lg:py-20">
          <div className="min-w-0">
            <div className="inline-flex min-h-9 items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 text-xs font-black text-primary">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Serious practice, without the clutter
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-[-0.055em] text-foreground sm:text-5xl lg:text-[64px] lg:leading-[0.98]">
              Practice like the real exam. Improve with every mock.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Find your exam, start a published mock or free practice set, and move from full-length tests to sectionals, topic practice and PYQs from one focused preparation platform.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button className="min-h-12 rounded-xl px-6 text-sm font-black" onClick={goMarketplace}>
                Explore mock tests <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
              {topFreeTest ? (
                <Button className="min-h-12 rounded-xl px-6 text-sm font-black" variant="outline" onClick={() => goTest(topFreeTest.id)}>
                  Start a free test
                </Button>
              ) : (
                <Button className="min-h-12 rounded-xl px-6 text-sm font-black" variant="outline" onClick={goMarketplace}>
                  Browse free practice
                </Button>
              )}
            </div>

            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-muted-foreground" aria-label="Available preparation formats">
              {["Full mocks", "Sectionals", "Topic practice", "PYQs"].map((label) => (
                <span key={label} className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />{label}</span>
              ))}
            </div>
          </div>

          <div className="relative min-w-0" data-testid="home-exam-finder">
            <div className="pointer-events-none absolute -inset-5 rounded-[36px] bg-primary/10 blur-3xl" />
            <div className="relative rounded-[28px] border border-border bg-card p-4 shadow-xl shadow-black/5 sm:p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">Find your exam</p>
                  <h2 className="mt-1 text-xl font-black tracking-tight text-foreground">What are you preparing for?</h2>
                </div>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Target className="h-5 w-5" aria-hidden="true" /></span>
              </div>

              <label className="relative mt-5 block">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <span className="sr-only">Search exams</span>
                <input
                  value={examQuery}
                  onChange={(event) => setExamQuery(event.target.value)}
                  placeholder="Search SSC, Banking, Railways…"
                  className="min-h-12 w-full rounded-xl border border-border bg-background pl-11 pr-4 text-sm font-semibold text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </label>

              <div className="mt-4 space-y-2" aria-live="polite">
                {searchResults.map((group) => (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => goCategory(group.id)}
                    className="et-interactive flex min-h-[64px] w-full items-center gap-3 rounded-2xl border border-transparent px-3 text-left transition hover:border-border hover:bg-muted/60"
                  >
                    <ExamMark name={group.name} icon={group.icon} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-black text-foreground">{group.name}</span>
                      <span className="mt-0.5 block text-xs font-semibold text-muted-foreground">{formatCount(group.tests.length)} published tests</span>
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  </button>
                ))}
                {searchResults.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border px-4 py-5 text-center text-sm text-muted-foreground">No matching exam family. Use the complete exam catalog instead.</div>
                ) : null}
              </div>

              <Button className="mt-4 min-h-11 w-full rounded-xl" variant="outline" onClick={goMarketplace}>View all exams</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-card/40" aria-label="ExamTree catalog totals" data-testid="home-proof-strip">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-border px-4 sm:grid-cols-4 sm:divide-y-0 sm:px-6 lg:px-8">
          {[
            [formatCount(tests.length), "Published tests"],
            [formatCount(catalogQuestionCount), "Catalog questions"],
            [formatCount(examGroups.length), "Exam families"],
            [formatCount(freeTests.length), "Free starts"],
          ].map(([value, label]) => (
            <div key={label} className="px-4 py-6 text-center">
              <p className="text-2xl font-black tracking-tight text-foreground">{value}</p>
              <p className="mt-1 text-xs font-semibold text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {(activeSession || latestAttempt) ? (
        <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8" data-testid="home-continue-strip">
          <div className="flex flex-col gap-4 rounded-3xl border border-primary/20 bg-primary/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground"><RotateCcw className="h-5 w-5" aria-hidden="true" /></span>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.14em] text-primary">Welcome back</p>
                <h2 className="mt-1 text-lg font-black text-foreground">Continue your preparation</h2>
                <p className="mt-1 text-sm text-muted-foreground">Resume a saved test or return to the review from your latest attempt.</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              {activeSession ? <Button className="min-h-11" variant="outline" onClick={() => setLocation(`/test/${activeSession.testId}`)}>Resume test</Button> : null}
              {latestAttempt ? <Button className="min-h-11" onClick={() => setLocation(`/result?attemptId=${encodeURIComponent(latestAttempt.id)}&testId=${encodeURIComponent(latestAttempt.testId)}&tab=review`)}><BarChart3 className="mr-2 h-4 w-4" />Review result</Button> : null}
            </div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8" data-testid="home-exam-families">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">Choose your exam</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-foreground sm:text-3xl">Popular exam families</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Start from the exam you care about, then move into the live mocks, series and practice formats attached to it.</p>
          </div>
          <Button className="min-h-11 self-start sm:self-auto" variant="ghost" onClick={goMarketplace}>See all exams <ArrowRight className="ml-2 h-4 w-4" /></Button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {featuredExamGroups.map((group) => (
            <button
              key={group.id}
              type="button"
              onClick={() => goCategory(group.id)}
              className="et-interactive group min-h-[132px] rounded-3xl border border-border bg-card p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <ExamMark name={group.name} icon={group.icon} />
                <ChevronRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden="true" />
              </div>
              <h3 className="mt-4 truncate text-sm font-black text-foreground">{group.name}</h3>
              <p className="mt-1 text-xs font-semibold text-muted-foreground">{formatCount(group.tests.length)} published tests</p>
            </button>
          ))}
          {featuredExamGroups.length === 0 ? <div className="sm:col-span-2 lg:col-span-4 rounded-3xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">Published exam families will appear here when catalog data is available.</div> : null}
        </div>
      </section>

      {popularTests.length > 0 ? (
        <section className="border-y border-border bg-muted/25 py-14 sm:py-16" data-testid="home-popular-tests">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">Start practising</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-foreground sm:text-3xl">Popular mock tests</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Ordered by real catalog attempt activity when that signal exists—never by fabricated popularity.</p>
              </div>
              <Button className="min-h-11 self-start sm:self-auto" variant="ghost" onClick={goMarketplace}>Browse all tests <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {popularTests.slice(0, 4).map((test) => {
                const languages = languageLabel(test.languages);
                return (
                  <article key={test.id} className="flex min-h-[280px] flex-col rounded-3xl border border-border bg-card p-5 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${(test.access ?? "free") === "free" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-primary/10 text-primary"}`}>
                        {(test.access ?? "free") === "free" ? "Free" : "Published"}
                      </span>
                      {Number(test.attempts ?? 0) > 0 ? <span className="text-[11px] font-semibold text-muted-foreground">{formatCount(Number(test.attempts))} attempts</span> : null}
                    </div>
                    <p className="mt-4 text-[11px] font-black uppercase tracking-[0.12em] text-muted-foreground">{test.subcategoryName || test.category}</p>
                    <h3 className="mt-1 line-clamp-2 text-base font-black leading-6 text-foreground">{test.name}</h3>
                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />{test.duration} min</span>
                      <span className="inline-flex items-center gap-1.5"><ListChecks className="h-3.5 w-3.5" />{test.totalQuestions} questions</span>
                      {languages ? <span className="inline-flex items-center gap-1.5"><Languages className="h-3.5 w-3.5" />{languages}</span> : null}
                    </div>
                    <Button className="mt-auto min-h-11 w-full rounded-xl" onClick={() => goTest(test.id)}>Start test</Button>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {topFreeTest ? (
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8" data-testid="home-free-test-cta">
          <div className="relative overflow-hidden rounded-[32px] bg-foreground px-6 py-8 text-background sm:px-8 lg:grid lg:grid-cols-[1fr_auto] lg:items-center lg:gap-8 lg:px-10 lg:py-10">
            <div className="pointer-events-none absolute right-0 top-0 h-56 w-56 translate-x-1/3 -translate-y-1/3 rounded-full bg-primary/30 blur-3xl" />
            <div className="relative max-w-2xl">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-background/65">Try ExamTree before you commit</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">Start preparing for free.</h2>
              <p className="mt-3 text-sm leading-6 text-background/70">{topFreeTest.name} is currently published as a free starting point with {topFreeTest.totalQuestions} questions in {topFreeTest.duration} minutes.</p>
            </div>
            <Button className="relative mt-6 min-h-12 rounded-xl bg-background px-6 font-black text-foreground hover:bg-background/90 lg:mt-0" onClick={() => goTest(topFreeTest.id)}>
              Take this free test <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>
      ) : null}

      {featuredSeries.length > 0 ? (
        <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8" data-testid="home-featured-series">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">Build a preparation path</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-foreground sm:text-3xl">Featured test series</h2>
            </div>
            <Button className="min-h-11 self-start sm:self-auto" variant="ghost" onClick={goMarketplace}>Explore the catalog <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {featuredSeries.map((seriesItem) => (
              <article key={seriesItem.id} className="rounded-3xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3"><ExamMark name={`${seriesItem.examFamilyName} ${seriesItem.examName}`} /><span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-black text-muted-foreground">{formatCount(seriesItem.testCount)} TESTS</span></div>
                <p className="mt-4 text-[11px] font-black uppercase tracking-wide text-primary">{seriesItem.examName}</p>
                <h3 className="mt-1 line-clamp-2 min-h-12 text-base font-black leading-6 text-foreground">{seriesItem.name}</h3>
                <p className="mt-3 text-xs font-semibold text-muted-foreground">{formatCount(seriesItem.questionCount)} questions{Number(seriesItem.attemptCount ?? 0) > 0 ? ` · ${formatCount(Number(seriesItem.attemptCount))} attempts` : ""}</p>
                <Button className="mt-5 min-h-11 w-full rounded-xl" variant="outline" onClick={() => goSeries(seriesItem.id)}>View series</Button>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="border-y border-border bg-card/50 py-14 sm:py-16" data-testid="home-why-examtree">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">Why ExamTree</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-foreground sm:text-3xl">A cleaner path from discovery to review.</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">The homepage keeps the next action obvious while deeper catalog, test-runner and review experiences handle the detail.</p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { icon: Target, title: "Exam-first discovery", copy: "Start from a published exam family instead of hunting through an undifferentiated list of tests." },
              { icon: BookOpenCheck, title: "Clear practice formats", copy: "Full mocks, sectionals, topic practice and PYQs stay visibly distinct so you know what you are starting." },
              { icon: Languages, title: "Multilingual where published", copy: "Language support is surfaced only when that test actually includes the corresponding published content." },
            ].map(({ icon: Icon, title, copy }) => (
              <article key={title} className="rounded-3xl border border-border bg-background p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span>
                <h3 className="mt-5 text-base font-black text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8" data-testid="home-practice-modes">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">Practice your way</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-foreground sm:text-3xl">Choose the right depth for today.</h2>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {modeCounts.map((mode) => {
            const Icon = mode.icon;
            return (
              <button key={mode.label} type="button" onClick={() => goMode(mode.href)} className="et-interactive group min-h-[190px] rounded-3xl border border-border bg-card p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md">
                <div className="flex items-start justify-between gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span><ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" /></div>
                <h3 className="mt-5 text-base font-black text-foreground">{mode.label}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{mode.description}</p>
                <p className="mt-4 text-xs font-black text-primary">{formatCount(mode.count)} available</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="border-y border-border bg-muted/25 py-14 sm:py-16" data-testid="home-faq">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.75fr_1.25fr] lg:px-8">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">Questions before you start?</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-foreground sm:text-3xl">A few quick answers.</h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">For anything else, the complete FAQ and support routes remain available from the public navigation.</p>
            <Button className="mt-5 min-h-11" variant="outline" onClick={() => setLocation("/faq")}>Open full FAQ</Button>
          </div>
          <div className="space-y-3">
            {FAQS.map((item) => (
              <details key={item.question} className="group rounded-2xl border border-border bg-card p-5">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-sm font-black text-foreground marker:hidden">
                  {item.question}
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-open:rotate-90" aria-hidden="true" />
                </summary>
                <p className="pt-2 text-sm leading-6 text-muted-foreground">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8" data-testid="home-explore-gateway">
        <div className="rounded-[32px] border border-border bg-card p-7 text-center shadow-sm sm:p-10">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Zap className="h-6 w-6" /></span>
          <h2 className="mx-auto mt-5 max-w-2xl text-2xl font-black tracking-tight text-foreground sm:text-3xl">Find the exam. Pick the format. Start practising.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Use the complete Exams marketplace when you want deeper filters, every published series and the full live catalog.</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button className="min-h-12 rounded-xl px-6 font-black" onClick={goMarketplace}>Open Exams marketplace <ArrowRight className="ml-2 h-4 w-4" /></Button>
            <Button className="min-h-12 rounded-xl px-6 font-black" variant="outline" onClick={() => setLocation(sampleMode ? "/exams?preview=sample" : "/mock-tests")}>Browse mock tests</Button>
          </div>
          <div className="mx-auto mt-7 flex max-w-xl flex-wrap justify-center gap-3 text-xs font-semibold text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-primary" />Published catalog only</span>
            <span className="inline-flex items-center gap-1.5"><Clock3 className="h-4 w-4 text-primary" />Timed test formats</span>
            <span className="inline-flex items-center gap-1.5"><BarChart3 className="h-4 w-4 text-primary" />Result review after attempts</span>
          </div>
        </div>
      </section>
    </div>
  );
}
