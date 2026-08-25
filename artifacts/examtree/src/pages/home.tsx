import { useMemo, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  BrainCircuit,
  CalendarDays,
  ChevronRight,
  Clock3,
  FileClock,
  Flame,
  Globe2,
  Languages,
  Layers3,
  LayoutGrid,
  ListChecks,
  Monitor,
  RotateCcw,
  Search,
  Sigma,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";

import { CategoryIcon } from "@/components/CategoryIcon";
import { Button } from "@/components/ui/button";
import { getDailyChallenge, type Category, type Subcategory, type Test } from "@/lib/data";
import { buildExamTreeNodes } from "@/lib/exam-tree";
import {
  SAMPLE_HOME_CATEGORIES,
  SAMPLE_HOME_DAILY_CHALLENGE,
  SAMPLE_HOME_SERIES,
  SAMPLE_HOME_SUBCATEGORIES,
  SAMPLE_HOME_TESTS,
} from "@/lib/home-sample-data";
import { getActiveTestSessions, getAttempts } from "@/lib/storage";
import { getStudentTestSeries } from "@/lib/test-series";
import { useExamCatalog } from "@/providers/ExamCatalogProvider";

type ExamGroup = {
  id: string;
  name: string;
  description: string;
  icon: string;
  tests: Test[];
  subExams: { id: string; name: string }[];
};

type FreePracticeTab = "sectional" | "topic-wise" | "all";

type SectionTone = "default" | "inverse";

const FEATURE_TONES = [
  "from-amber-50 via-white to-orange-50/70 border-amber-100",
  "from-blue-50 via-white to-sky-50/70 border-blue-100",
  "from-rose-50 via-white to-pink-50/70 border-rose-100",
  "from-violet-50 via-white to-indigo-50/70 border-violet-100",
] as const;

const EXAM_LOGOS = [
  { match: /\bssc\b/i, src: "https://ssc.gov.in/favicon.ico" },
  { match: /\bibps\b|bank/i, src: "https://www.ibps.in/favicon.ico" },
  { match: /\brrb\b|railway/i, src: "https://indianrailways.gov.in/favicon.ico" },
  { match: /punjab police/i, src: "https://punjabpolice.gov.in/favicon.ico" },
] as const;

const SUBJECT_RULES = [
  { label: "Quantitative Aptitude", shortLabel: "Quant", icon: Sigma, keywords: ["quant", "math", "arithmetic", "numerical"] },
  { label: "Reasoning Ability", shortLabel: "Reasoning", icon: BrainCircuit, keywords: ["reasoning", "logical", "aptitude"] },
  { label: "English Language", shortLabel: "English", icon: BookOpen, keywords: ["english", "grammar", "vocabulary"] },
  { label: "General Awareness", shortLabel: "GK / GA", icon: Globe2, keywords: ["general awareness", "general knowledge", "gk", "current affairs"] },
  { label: "Computer Awareness", shortLabel: "Computer", icon: Monitor, keywords: ["computer", "digital", "information technology"] },
] as const;

function buildExamGroups(categories: Category[], subcategories: Subcategory[], tests: Test[]): ExamGroup[] {
  return buildExamTreeNodes(categories, subcategories, tests).map((category) => ({
    id: category.id,
    name: category.name,
    description: category.description,
    icon: category.icon || "LayoutGrid",
    tests: category.tests,
    subExams: category.subcategories.map((subExam) => ({ id: subExam.id, name: subExam.name })),
  }));
}

function formatCount(value: number) {
  return new Intl.NumberFormat("en-IN").format(Math.max(0, Number(value) || 0));
}

function normalize(value: string | null | undefined) {
  return String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function initials(value: string) {
  const words = value.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "ET";
  return words.slice(0, 2).map((word) => word[0]?.toUpperCase()).join("");
}

function logoSource(name: string) {
  return EXAM_LOGOS.find((item) => item.match.test(name))?.src ?? null;
}

function ExamLogo({ name, icon, size = "md" }: { name: string; icon?: string; size?: "sm" | "md" | "lg" }) {
  const src = logoSource(name);
  const sizeClass = size === "lg" ? "h-14 w-14" : size === "sm" ? "h-9 w-9" : "h-11 w-11";
  const iconClass = size === "lg" ? "h-7 w-7" : size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <span className={`relative flex ${sizeClass} shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white text-xs font-black text-slate-600 shadow-sm`}>
      {icon ? <CategoryIcon icon={icon} className={iconClass} /> : <span>{initials(name)}</span>}
      {src ? (
        <img
          src={src}
          alt={`${name} logo`}
          className="absolute inset-1 h-[calc(100%-0.5rem)] w-[calc(100%-0.5rem)] object-contain"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(event) => { event.currentTarget.hidden = true; }}
        />
      ) : null}
    </span>
  );
}

function SectionHeader({ eyebrow, title, description, trailing, tone = "default" }: { eyebrow?: string; title: string; description?: string; trailing?: ReactNode; tone?: SectionTone }) {
  const inverse = tone === "inverse";
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? <p className={`text-[11px] font-black uppercase tracking-[0.14em] ${inverse ? "text-blue-200" : "text-primary"}`}>{eyebrow}</p> : null}
        <h2 className={`${eyebrow ? "mt-1" : ""} text-xl font-black tracking-tight ${inverse ? "text-white" : "text-foreground"}`}>{title}</h2>
        {description ? <p className={`mt-1 text-sm ${inverse ? "text-blue-100" : "text-muted-foreground"}`}>{description}</p> : null}
      </div>
      {trailing ? <div className="shrink-0">{trailing}</div> : null}
    </div>
  );
}

function TestMeta({ test }: { test: Test }) {
  const languageCount = test.languages?.length ? test.languages.length : 1;
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-semibold text-muted-foreground">
      <span className="inline-flex items-center gap-1.5"><LayoutGrid className="h-3.5 w-3.5" aria-hidden="true" />{formatCount(test.totalQuestions)} Qs</span>
      <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" aria-hidden="true" />{test.duration} min</span>
      <span className="inline-flex items-center gap-1.5"><Languages className="h-3.5 w-3.5" aria-hidden="true" />{languageCount} {languageCount === 1 ? "lang" : "langs"}</span>
    </div>
  );
}

function testSearchText(test: Test) {
  return normalize([
    test.name,
    test.category,
    test.categoryName,
    test.subcategoryName,
    ...(test.sections ?? []).map((section) => section.name),
  ].filter(Boolean).join(" "));
}

export default function Home() {
  const [, setLocation] = useLocation();
  const samplePreview = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("preview") === "sample";
  const attempts = getAttempts();
  const activeSessions = getActiveTestSessions();
  const catalog = useExamCatalog();
  const tests = samplePreview ? SAMPLE_HOME_TESTS : catalog.tests;
  const categories = samplePreview ? SAMPLE_HOME_CATEGORIES : catalog.categories;
  const subcategories = samplePreview ? SAMPLE_HOME_SUBCATEGORIES : catalog.subcategories;
  const [examQuery, setExamQuery] = useState("");
  const [freePracticeTab, setFreePracticeTab] = useState<FreePracticeTab>("sectional");

  const seriesQuery = useQuery({
    queryKey: ["student-test-series"],
    queryFn: getStudentTestSeries,
    enabled: !samplePreview,
    staleTime: 30_000,
  });
  const dailyChallengeQuery = useQuery({
    queryKey: ["daily-challenge"],
    queryFn: getDailyChallenge,
    enabled: !samplePreview,
    retry: 1,
    staleTime: 60_000,
  });

  const latestAttempt = samplePreview ? null : attempts[0] ?? null;
  const activeSessionEntries = samplePreview ? [] : Object.values(activeSessions).slice(0, 2);
  const examGroups = useMemo(
    () => buildExamGroups(categories, subcategories, tests),
    [categories, subcategories, tests],
  );
  const normalizedExamQuery = normalize(examQuery);
  const filteredGroups = useMemo(
    () => examGroups.filter((group) => {
      if (!normalizedExamQuery) return true;
      return normalize(`${group.name} ${group.description} ${group.subExams.map((exam) => exam.name).join(" ")}`).includes(normalizedExamQuery);
    }),
    [examGroups, normalizedExamQuery],
  );

  const series = useMemo(
    () => [...(samplePreview ? SAMPLE_HOME_SERIES : seriesQuery.data?.series ?? [])].sort((left, right) => {
      const attemptDelta = Number(right.attemptCount ?? 0) - Number(left.attemptCount ?? 0);
      if (attemptDelta !== 0) return attemptDelta;
      const liveDelta = right.liveTestCount - left.liveTestCount;
      if (liveDelta !== 0) return liveDelta;
      return left.name.localeCompare(right.name);
    }),
    [samplePreview, seriesQuery.data?.series],
  );
  const featuredSeries = series.slice(0, 4);

  const freeTests = useMemo(() => tests.filter((test) => (test.access ?? "free") === "free"), [tests]);
  const fullLengthTests = useMemo(() => tests.filter((test) => test.kind === "full-length"), [tests]);
  const sectionalTests = useMemo(() => tests.filter((test) => test.kind === "sectional"), [tests]);
  const topicTests = useMemo(() => tests.filter((test) => test.kind === "topic-wise"), [tests]);
  const pyqTests = useMemo(
    () => [...tests].filter((test) => /\bpyq\b|previous year|previous-year|memory based/i.test(test.name)).sort((left, right) => Number(right.attempts ?? 0) - Number(left.attempts ?? 0)).slice(0, 4),
    [tests],
  );
  const freePracticeTests = useMemo(() => {
    const source = freePracticeTab === "all" ? freeTests : freeTests.filter((test) => test.kind === freePracticeTab);
    return [...source].sort((left, right) => Number(right.attempts ?? 0) - Number(left.attempts ?? 0)).slice(0, 4);
  }, [freePracticeTab, freeTests]);
  const dailyChallenge = samplePreview ? SAMPLE_HOME_DAILY_CHALLENGE : dailyChallengeQuery.data?.testId ? dailyChallengeQuery.data : null;
  const dailyNamedTests = useMemo(
    () => [...freeTests]
      .filter((test) => /daily|current affairs|challenge|booster|speed drill/i.test(test.name))
      .sort((left, right) => Number(right.attempts ?? 0) - Number(left.attempts ?? 0))
      .filter((test) => test.id !== dailyChallenge?.testId)
      .slice(0, 2),
    [freeTests, dailyChallenge?.testId],
  );
  const subjectSummaries = useMemo(
    () => SUBJECT_RULES.map((subject) => {
      const matching = tests.filter((test) => subject.keywords.some((keyword) => testSearchText(test).includes(keyword)));
      return { ...subject, count: matching.length, firstTestId: matching[0]?.id ?? null };
    }).filter((subject) => subject.count > 0),
    [tests],
  );
  const popularTests = useMemo(
    () => [...tests]
      .filter((test) => Number(test.attempts ?? 0) > 0)
      .sort((left, right) => Number(right.attempts ?? 0) - Number(left.attempts ?? 0))
      .slice(0, 4),
    [tests],
  );
  const catalogQuestionCount = tests.reduce((sum, test) => sum + Math.max(0, Number(test.totalQuestions) || 0), 0);

  const practiceTiles = [
    { title: "Full-Length Mocks", description: "Simulate the complete exam", count: fullLengthTests.length, icon: Trophy, tone: "bg-amber-50 text-amber-700 ring-amber-100", route: "/mock-tests" },
    { title: "Sectional Tests", description: "Work on one section at a time", count: sectionalTests.length, icon: ListChecks, tone: "bg-blue-50 text-blue-700 ring-blue-100", route: "/exams" },
    { title: "Topic Practice", description: "Target individual concepts", count: topicTests.length, icon: Layers3, tone: "bg-violet-50 text-violet-700 ring-violet-100", route: "/exams" },
    { title: "Previous Year Questions", description: "Practice real exam patterns", count: pyqTests.length, icon: FileClock, tone: "bg-emerald-50 text-emerald-700 ring-emerald-100", route: "/pyqs" },
  ] as const;

  const openCategory = (id: string) => setLocation(samplePreview ? "/exams" : `/category/${id}`);
  const openTest = (id: string) => setLocation(samplePreview ? "/exams" : `/test/${id}`);
  const openSeries = (id: string) => setLocation(samplePreview ? "/exams" : `/test-series/${id}`);

  if (!samplePreview && catalog.isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-5 px-4 py-6 sm:px-6 lg:px-8" role="status" aria-label="Loading ExamTree home">
        <div className="skeleton-shimmer h-56 rounded-2xl" />
        <div className="flex gap-3 overflow-hidden">{Array.from({ length: 6 }, (_, index) => <div key={index} className="skeleton-shimmer h-20 min-w-36 rounded-xl" />)}</div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div key={index} className="skeleton-shimmer h-52 rounded-2xl" />)}</div>
        <span className="sr-only">Loading published tests and exam pathways…</span>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] py-5 sm:py-7">
      <div className="mx-auto max-w-7xl space-y-11 px-4 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-blue-800 via-blue-700 to-indigo-800 p-5 text-white shadow-[0_20px_55px_-32px_rgba(30,64,175,0.85)] sm:p-7" data-testid="home-command-center" aria-labelledby="home-heading">
          <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-40 left-1/3 h-72 w-72 rounded-full bg-violet-300/15 blur-3xl" aria-hidden="true" />
          <div className="relative">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-blue-100"><Sparkles className="h-4 w-4" aria-hidden="true" />ExamTree preparation</p>
              {samplePreview ? (
                <div className="flex items-center gap-2" data-testid="home-sample-preview-badge">
                  <span className="rounded-full border border-amber-200/40 bg-amber-300/15 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-amber-100">Sample data preview</span>
                  <button type="button" className="min-h-11 rounded-lg px-3 text-xs font-bold text-blue-100 hover:bg-white/10 hover:text-white" onClick={() => setLocation("/")}>Exit preview</button>
                </div>
              ) : null}
            </div>

            <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div>
                <h1 id="home-heading" className="text-3xl font-black tracking-[-0.045em] text-white sm:text-4xl lg:text-[44px]">What are you preparing for?</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">Find your exam, start the right practice, and continue every saved attempt from one focused preparation home.</p>
              </div>
              <Button variant="outline" className="min-h-11 w-fit rounded-xl border-white/25 bg-white/10 text-white hover:bg-white hover:text-blue-800" onClick={() => setLocation("/exams")}>Explore all exams <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Button>
            </div>

            <div className="relative mt-6 max-w-3xl">
              <label htmlFor="home-exam-search" className="sr-only">Search exams</label>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                id="home-exam-search"
                type="search"
                value={examQuery}
                onChange={(event) => setExamQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key !== "Enter") return;
                  if (filteredGroups.length === 1) openCategory(filteredGroups[0]!.id);
                  else setLocation("/exams");
                }}
                placeholder="Search SSC CGL, Banking, Railways, Punjab exams…"
                className="min-h-[54px] w-full rounded-xl border border-white/20 bg-white pl-12 pr-4 text-sm font-semibold text-slate-950 shadow-xl shadow-blue-950/10 outline-none placeholder:text-slate-400 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/15"
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-bold text-blue-50" aria-label="Live catalog summary">
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5">{formatCount(examGroups.length)} exam families</span>
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5">{formatCount(tests.length)} published tests</span>
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5">{formatCount(catalogQuestionCount)} live questions</span>
            </div>

            <div className="mt-5 flex gap-3 overflow-x-auto pb-1" data-testid="home-exam-logo-row">
              {filteredGroups.slice(0, 10).map((group) => (
                <button key={group.id} type="button" onClick={() => openCategory(group.id)} className="et-interactive group flex min-h-[74px] min-w-[150px] items-center gap-3 rounded-xl border border-white/20 bg-white px-3.5 py-3 text-left text-slate-900 shadow-lg shadow-blue-950/10 transition hover:-translate-y-0.5 hover:shadow-xl">
                  <ExamLogo name={group.name} icon={group.icon} size="sm" />
                  <span className="min-w-0"><span className="block truncate text-sm font-black">{group.name}</span><span className="mt-0.5 block text-[11px] font-semibold text-slate-500">{formatCount(group.tests.length)} tests</span></span>
                </button>
              ))}
              {filteredGroups.length === 0 ? <div className="w-full rounded-xl border border-dashed border-white/25 bg-white/10 px-5 py-4 text-center text-sm text-blue-100">No exam family matches “{examQuery.trim()}”. Try the full exam catalog.</div> : null}
            </div>
          </div>
        </section>

        {(samplePreview || latestAttempt || activeSessionEntries.length > 0) ? (
          <section className="overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm" data-testid="home-continue-strip" aria-labelledby="continue-heading">
            <div className="h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-violet-500" aria-hidden="true" />
            <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><RotateCcw className="h-5 w-5" aria-hidden="true" /></span>
                <div>
                  <div className="flex flex-wrap items-center gap-2"><h2 id="continue-heading" className="font-black text-slate-950">Continue your preparation</h2>{samplePreview ? <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-black uppercase text-amber-700">Sample state</span> : null}</div>
                  <p className="mt-0.5 text-sm text-slate-600">{samplePreview ? "SSC CGL Full Mock 04 · 38 of 100 questions answered" : "Pick up your saved test or review the latest result."}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                {samplePreview ? <Button variant="outline" className="min-h-11 rounded-xl bg-white" onClick={() => setLocation("/exams")}>Explore this pathway</Button> : null}
                {activeSessionEntries[0] ? <Button variant="outline" className="min-h-11 rounded-xl bg-white" onClick={() => setLocation(`/test/${activeSessionEntries[0]!.testId}`)}>Resume test</Button> : null}
                {latestAttempt ? <Button className="min-h-11 rounded-xl bg-blue-600 text-white hover:bg-blue-700" onClick={() => setLocation(`/result?attemptId=${encodeURIComponent(latestAttempt.id)}&testId=${encodeURIComponent(latestAttempt.testId)}&tab=review`)}><BarChart3 className="mr-2 h-4 w-4" aria-hidden="true" />Review last result</Button> : null}
              </div>
            </div>
          </section>
        ) : null}

        {featuredSeries.length > 0 ? (
          <section data-testid="home-featured-series" aria-labelledby="home-featured-series-heading">
            <div id="home-featured-series-heading"><SectionHeader eyebrow="Start with a complete path" title="Featured Test Series" description={samplePreview ? "Sample series are shown only to demonstrate the finished visual hierarchy." : "Live series from the current catalog, ordered by real evaluated attempts when that signal exists."} trailing={<Button variant="ghost" className="min-h-11" onClick={() => setLocation("/exams")}>View all <ArrowRight className="ml-1.5 h-4 w-4" /></Button>} /></div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {featuredSeries.map((seriesItem, index) => (
                <article key={seriesItem.id} className={`group overflow-hidden rounded-2xl border bg-gradient-to-br p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg ${FEATURE_TONES[index % FEATURE_TONES.length]}`}>
                  <div className="flex items-start justify-between gap-3">
                    <ExamLogo name={`${seriesItem.examFamilyName} ${seriesItem.examName}`} size="lg" />
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${index === 0 && seriesItem.attemptCount > 0 ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-700"}`}>{index === 0 && seriesItem.attemptCount > 0 ? "MOST ATTEMPTED" : "OPEN"}</span>
                  </div>
                  <p className="mt-4 text-[11px] font-black uppercase tracking-wide text-slate-500">{seriesItem.examName}</p>
                  <h3 className="mt-1 line-clamp-2 min-h-10 text-base font-black leading-5 text-slate-950">{seriesItem.name}</h3>
                  <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold text-slate-600"><span>{formatCount(seriesItem.testCount)} tests</span><span>{formatCount(seriesItem.questionCount)} questions</span>{seriesItem.attemptCount > 0 ? <span className="inline-flex items-center gap-1"><Flame className="h-3.5 w-3.5 text-orange-500" />{formatCount(seriesItem.attemptCount)} attempts</span> : null}</div>
                  <Button className="mt-4 min-h-11 w-full" size="sm" variant="outline" onClick={() => openSeries(seriesItem.id)}>View Series</Button>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section data-testid="home-practice-paths" aria-labelledby="practice-paths-heading">
          <div id="practice-paths-heading"><SectionHeader eyebrow="Choose your practice mode" title="Practice your way" description="Move from complete exam simulation to focused concept practice." /></div>
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:grid sm:grid-cols-2 xl:grid-cols-4">
            {practiceTiles.map((tile, index) => {
              const Icon = tile.icon;
              return (
                <button key={tile.title} type="button" onClick={() => setLocation(tile.route)} className={`et-interactive group flex min-h-[104px] w-full items-center gap-4 p-4 text-left transition hover:bg-slate-50 ${index > 0 ? "border-t border-slate-100 sm:border-t-0 sm:border-l" : ""} ${index === 2 ? "sm:border-l-0 xl:border-l" : ""}`}>
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ${tile.tone}`}><Icon className="h-5 w-5" aria-hidden="true" /></span>
                  <span className="min-w-0 flex-1"><span className="block text-sm font-black text-slate-950">{tile.title}</span><span className="mt-1 block text-xs leading-5 text-slate-500">{tile.description}</span><span className="mt-1 block text-[11px] font-black text-blue-600">{formatCount(tile.count)} available</span></span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-blue-600" aria-hidden="true" />
                </button>
              );
            })}
          </div>
        </section>

        <section data-testid="home-free-practice" aria-labelledby="home-free-practice-heading">
          <div id="home-free-practice-heading"><SectionHeader eyebrow="No paywall" title="Free Practice" description="Start a published free test directly from the live catalog." trailing={<span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">{formatCount(freeTests.length)} free tests</span>} /></div>
          <div role="tablist" aria-label="Homepage free practice type" className="mt-4 inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            {([["sectional", "Sectional"], ["topic-wise", "Topic-wise"], ["all", "All Free"]] as const).map(([value, label]) => (
              <button key={value} type="button" role="tab" aria-selected={freePracticeTab === value} onClick={() => setFreePracticeTab(value)} className={`et-interactive min-h-11 rounded-lg px-3.5 text-xs font-black transition ${freePracticeTab === value ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"}`}>{label}</button>
            ))}
          </div>
          {freePracticeTests.length > 0 ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {freePracticeTests.map((test, index) => (
                <article key={test.id} className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className={`absolute inset-x-0 top-0 h-0.5 ${["bg-blue-500", "bg-violet-500", "bg-emerald-500", "bg-orange-500"][index % 4]}`} aria-hidden="true" />
                  <div className="flex items-center justify-between gap-3"><span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-700">FREE</span><span className="truncate text-[11px] font-semibold text-slate-500">{test.subcategoryName ?? test.category}</span></div>
                  <h3 className="mt-2.5 line-clamp-2 min-h-10 text-sm font-black leading-5 text-slate-950">{test.name}</h3>
                  <div className="mt-3"><TestMeta test={test} /></div>
                  <Button className="mt-4 min-h-11 w-full" size="sm" onClick={() => openTest(test.id)}>Start Free <ArrowRight className="ml-1.5 h-4 w-4" /></Button>
                </article>
              ))}
            </div>
          ) : <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white px-5 py-6 text-center text-sm text-slate-500">No free {freePracticeTab === "sectional" ? "sectional" : freePracticeTab === "topic-wise" ? "topic-wise" : "practice"} tests are published right now.</div>}
          <div className="mt-3 text-right"><Button variant="ghost" className="min-h-11" onClick={() => setLocation("/exams")}>View all free practice <ArrowRight className="ml-1.5 h-4 w-4" /></Button></div>
        </section>

        {(dailyChallenge || dailyNamedTests.length > 0) ? (
          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-800 via-blue-700 to-cyan-600 p-5 text-white shadow-[0_18px_50px_-30px_rgba(30,64,175,0.9)] sm:p-6" data-testid="home-daily-practice" aria-labelledby="home-daily-heading">
            <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
            <div className="relative" id="home-daily-heading"><SectionHeader tone="inverse" eyebrow="Build a daily habit" title="Today on ExamTree" description={samplePreview ? "Sample daily activities demonstrate how this live shelf looks when fully populated." : "Fresh practice appears here only when a real daily or scheduled test is available."} trailing={<CalendarDays className="h-5 w-5 text-blue-100" />} /></div>
            <div className="relative mt-4 grid gap-3 md:grid-cols-3">
              {dailyChallenge ? (
                <button type="button" onClick={() => openTest(dailyChallenge.testId)} className="et-interactive min-h-[122px] rounded-xl border border-white/15 bg-white/10 p-4 text-left backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/15">
                  <div className="flex items-center justify-between gap-3"><span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-black">DAILY CHALLENGE</span><Target className="h-5 w-5 text-cyan-100" /></div>
                  <h3 className="mt-3 line-clamp-2 text-base font-black text-white">{dailyChallenge.testName}</h3>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold text-blue-100"><span>{dailyChallenge.date}</span>{dailyChallenge.totalParticipants > 0 ? <span>{formatCount(dailyChallenge.totalParticipants)} participants</span> : null}</div>
                </button>
              ) : null}
              {dailyNamedTests.map((test) => (
                <button key={test.id} type="button" onClick={() => openTest(test.id)} className="et-interactive min-h-[122px] rounded-xl border border-white/15 bg-white/10 p-4 text-left backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/15">
                  <div className="flex items-center justify-between gap-3"><span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-black">DAILY PRACTICE</span><Sparkles className="h-5 w-5 text-cyan-100" /></div>
                  <h3 className="mt-3 line-clamp-2 text-base font-black text-white">{test.name}</h3>
                  <p className="mt-2 text-xs font-semibold text-blue-100">{formatCount(test.totalQuestions)} questions · {test.duration} min</p>
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {(pyqTests.length > 0 || subjectSummaries.length > 0) ? (
          <section className="grid gap-4 lg:grid-cols-[1.12fr_0.88fr]" data-testid="home-pyq-subjects">
            <div className="overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50/70 via-white to-white p-5 shadow-sm sm:p-6">
              <SectionHeader eyebrow="Exam pattern" title="Previous Year Questions" description="Use published PYQ-labelled tests to understand the paper pattern." trailing={<Button variant="ghost" className="min-h-11" onClick={() => setLocation("/pyqs")}>PYQ hub <ArrowRight className="ml-1.5 h-4 w-4" /></Button>} />
              {pyqTests.length > 0 ? <div className="mt-4 divide-y divide-amber-100/70">{pyqTests.map((test, index) => (
                <button key={test.id} type="button" onClick={() => openTest(test.id)} className="et-interactive group flex min-h-[72px] w-full items-center gap-3 py-3 text-left"><span className="text-lg font-black tabular-nums text-amber-300">{String(index + 1).padStart(2, "0")}</span><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-700 shadow-sm ring-1 ring-amber-100"><FileClock className="h-5 w-5" /></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-black text-slate-950">{test.name}</span><span className="mt-0.5 block text-xs text-slate-500">{test.subcategoryName ?? test.category} · {formatCount(test.totalQuestions)} questions</span></span><ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-emerald-600" /></button>
              ))}</div> : <p className="mt-4 rounded-xl border border-dashed border-slate-200 p-5 text-center text-sm text-slate-500">No PYQ-labelled test is live in the catalog right now.</p>}
            </div>

            <div className="rounded-2xl bg-slate-950 p-5 text-white shadow-lg shadow-slate-950/10 sm:p-6">
              <p className="text-[11px] font-black uppercase tracking-[0.14em] text-blue-300">Focus by subject</p>
              <h2 className="mt-1 text-xl font-black tracking-tight">Practice by Subject</h2>
              <p className="mt-1 text-sm text-slate-300">Jump into the subjects represented by your current live tests.</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {subjectSummaries.slice(0, 6).map((subject, index) => {
                  const Icon = subject.icon;
                  const accents = ["text-cyan-300", "text-violet-300", "text-emerald-300", "text-amber-300", "text-sky-300"];
                  return <button key={subject.label} type="button" onClick={() => subject.firstTestId ? openTest(subject.firstTestId) : setLocation("/exams")} className="et-interactive min-h-[90px] rounded-xl border border-white/10 bg-white/5 p-3 text-left transition hover:-translate-y-0.5 hover:bg-white/10"><Icon className={`h-5 w-5 ${accents[index % accents.length]}`} /><span className="mt-2 block text-sm font-black">{subject.shortLabel}</span><span className="mt-0.5 block text-[11px] font-semibold text-slate-400">{formatCount(subject.count)} tests</span></button>;
                })}
              </div>
            </div>
          </section>
        ) : null}

        {popularTests.length > 0 ? (
          <section data-testid="home-popular-tests" aria-labelledby="home-popular-heading">
            <div id="home-popular-heading"><SectionHeader eyebrow="Real attempt activity" title="Popular Tests" description={samplePreview ? "Sample attempt counts are used only inside this labeled preview." : "Ranked only by actual catalog attempt counts."} trailing={<Flame className="h-5 w-5 text-orange-500" />} /></div>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {popularTests.map((test, index) => (
                <button key={test.id} type="button" onClick={() => openTest(test.id)} className="et-interactive group flex min-h-[116px] items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50 text-sm font-black text-orange-600">{index + 1}</span>
                  <span className="min-w-0 flex-1"><span className="block text-[11px] font-black uppercase tracking-wide text-orange-600">{formatCount(test.attempts)} attempts</span><span className="mt-2 line-clamp-2 block text-sm font-black leading-5 text-slate-950">{test.name}</span><span className="mt-2 block truncate text-xs font-semibold text-slate-500">{test.subcategoryName ?? test.category}</span></span>
                </button>
              ))}
            </div>
          </section>
        ) : null}

        <section className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50/70 p-5 sm:p-6" data-testid="home-explore-gateway">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="text-[11px] font-black uppercase tracking-[0.14em] text-blue-600">Deeper discovery</p><h2 className="mt-1 text-xl font-black text-slate-950">Looking for a specific exam or test?</h2><p className="mt-1 text-sm text-slate-600">Use the full Exams marketplace for every live series, practice type, PYQ and filtered test.</p></div>
            <Button className="min-h-11 w-fit rounded-xl bg-blue-600 text-white hover:bg-blue-700" onClick={() => setLocation("/exams")}>Browse all exams <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        </section>
      </div>
    </div>
  );
}
