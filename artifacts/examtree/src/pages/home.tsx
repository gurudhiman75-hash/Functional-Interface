import { useMemo, useState } from "react";
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
  Layers3,
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
import { getDailyChallenge } from "@/lib/data";
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

const EXAM_LOGOS = [
  { match: /\bssc\b/i, src: "https://ssc.gov.in/favicon.ico" },
  { match: /\bibps\b|bank/i, src: "https://www.ibps.in/favicon.ico" },
  { match: /\brrb\b|railway/i, src: "https://indianrailways.gov.in/favicon.ico" },
  { match: /punjab police/i, src: "https://punjabpolice.gov.in/favicon.ico" },
] as const;

const QUICK_START = [
  { label: "Full mocks", icon: Trophy, kind: "full-length" as const, tone: "bg-amber-50 text-amber-700" },
  { label: "Sectionals", icon: ListChecks, kind: "sectional" as const, tone: "bg-blue-50 text-blue-700" },
  { label: "Topic practice", icon: Layers3, kind: "topic-wise" as const, tone: "bg-violet-50 text-violet-700" },
  { label: "PYQs", icon: FileClock, kind: "pyq" as const, tone: "bg-emerald-50 text-emerald-700" },
] as const;

const SUBJECT_ICONS = [Sigma, BrainCircuit, BookOpen, Globe2, Monitor] as const;

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

function ExamMark({ name, icon }: { name: string; icon?: string }) {
  const src = EXAM_LOGOS.find((item) => item.match.test(name))?.src ?? null;
  return (
    <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white text-xs font-black text-slate-600 shadow-sm">
      {icon ? <CategoryIcon icon={icon} className="h-5 w-5" /> : <span>{initials(name)}</span>}
      {src ? <img src={src} alt={`${name} logo`} className="absolute inset-1 h-[calc(100%-0.5rem)] w-[calc(100%-0.5rem)] object-contain" loading="lazy" referrerPolicy="no-referrer" onError={(event) => { event.currentTarget.hidden = true; }} /> : null}
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
  const dailyChallengeQuery = useQuery({
    queryKey: ["daily-challenge"],
    queryFn: getDailyChallenge,
    enabled: !sampleMode,
    retry: 1,
    staleTime: 60_000,
  });

  const attempts = getAttempts();
  const activeSessions = Object.values(getActiveTestSessions());
  const latestAttempt = attempts[0] ?? null;
  const activeSession = activeSessions[0] ?? null;

  const examGroups = useMemo(() => buildExamTreeNodes(categories, subcategories, tests), [categories, subcategories, tests]);
  const normalizedQuery = normalize(examQuery);
  const visibleExamGroups = useMemo(
    () => examGroups.filter((group) => !normalizedQuery || normalize(`${group.name} ${group.description} ${group.subcategories.map((item) => item.name).join(" ")}`).includes(normalizedQuery)).slice(0, 8),
    [examGroups, normalizedQuery],
  );

  const series = useMemo(
    () => [...(sampleMode ? SAMPLE_HOME_SERIES : (seriesQuery.data?.series ?? []))].sort((left, right) => Number(right.attemptCount ?? 0) - Number(left.attemptCount ?? 0)),
    [sampleMode, seriesQuery.data?.series],
  );
  const featuredSeries = series.slice(0, 3);
  const dailyChallenge = sampleMode ? SAMPLE_HOME_DAILY_CHALLENGE : dailyChallengeQuery.data;
  const freeTests = useMemo(() => tests.filter((test) => (test.access ?? "free") === "free"), [tests]);
  const topFreeTest = useMemo(() => [...freeTests].sort((left, right) => Number(right.attempts ?? 0) - Number(left.attempts ?? 0))[0] ?? null, [freeTests]);
  const catalogQuestionCount = tests.reduce((sum, test) => sum + Math.max(0, Number(test.totalQuestions) || 0), 0);

  const quickCounts = useMemo(() => QUICK_START.map((item) => ({
    ...item,
    count: item.kind === "pyq"
      ? tests.filter((test) => /\bpyq\b|previous year|previous-year/i.test(test.name)).length
      : tests.filter((test) => test.kind === item.kind).length,
  })), [tests]);

  const subjectNames = useMemo(() => {
    const names = new Set<string>();
    for (const test of tests) for (const section of test.sections ?? []) if (section.name) names.add(section.name);
    return Array.from(names).slice(0, 5);
  }, [tests]);

  const goMarketplace = () => sampleMode ? setLocation("/exams?preview=sample") : setLocation("/exams");
  const goCategory = (id: string) => sampleMode ? setLocation("/exams?preview=sample") : setLocation(`/category/${id}`);
  const goSeries = (id: string) => sampleMode ? setLocation("/exams?preview=sample") : setLocation(`/test-series/${id}`);
  const goTest = (id: string) => sampleMode ? setLocation("/exams?preview=sample") : setLocation(`/test/${id}`);

  if (!sampleMode && catalog.error) {
    return (
      <div className="mx-auto my-10 max-w-lg rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-black text-slate-950">Could not load preparation home</h1>
        <p className="mt-2 text-sm text-slate-600">The test catalog is temporarily unavailable. Your saved attempts are not affected.</p>
        <Button className="mt-5 min-h-11" variant="outline" onClick={() => window.location.reload()}>Try again</Button>
      </div>
    );
  }

  if (!sampleMode && catalog.isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-4 px-4 py-6 sm:px-6 lg:px-8" role="status" aria-label="Loading ExamTree home">
        <div className="skeleton-shimmer h-52 rounded-2xl" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div key={index} className="skeleton-shimmer h-24 rounded-xl" />)}</div>
        <span className="sr-only">Loading published tests and exam pathways…</span>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] py-5 sm:py-7">
      <div className="mx-auto max-w-7xl space-y-7 px-4 sm:px-6 lg:px-8">
        {sampleMode ? (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900" data-testid="home-sample-preview-badge">
            <span><strong>Sample data preview</strong> · This view is visual-only and does not alter production data.</span>
            <button type="button" className="min-h-11 rounded-lg px-3 text-xs font-black hover:bg-amber-100" onClick={() => setLocation("/")}>Exit preview</button>
          </div>
        ) : null}

        <section className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[1.2fr_0.8fr]" data-testid="home-command-center" aria-labelledby="home-heading">
          <div className="p-5 sm:p-7 lg:p-8">
            <p className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.14em] text-blue-600"><Sparkles className="h-4 w-4" aria-hidden="true" />Your preparation home</p>
            <h1 id="home-heading" className="mt-2 max-w-2xl text-3xl font-black tracking-[-0.045em] text-slate-950 sm:text-4xl lg:text-[44px]">What are you preparing for?</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">Start quickly, resume your work, or jump into the complete Exams marketplace when you need deeper discovery.</p>

            <div className="relative mt-5 max-w-2xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                type="search"
                value={examQuery}
                onChange={(event) => setExamQuery(event.target.value)}
                onKeyDown={(event) => { if (event.key === "Enter") goMarketplace(); }}
                placeholder="Search SSC CGL, Banking, Railways, Punjab exams…"
                aria-label="Search exams"
                className="min-h-[52px] w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-semibold text-slate-950 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-bold text-slate-500" aria-label="Live catalog summary">
              <span>{formatCount(tests.length)} published tests</span><span>•</span><span>{formatCount(catalogQuestionCount)} live questions</span><span>•</span><span>{formatCount(examGroups.length)} exam families</span>
            </div>
          </div>

          <div className="flex flex-col justify-between border-t border-slate-200 bg-slate-950 p-5 text-white lg:border-l lg:border-t-0 sm:p-7">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.14em] text-blue-300">One place to begin</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight">Start with the next useful action.</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">Home stays intentionally short. The full test inventory, filters, series and practice shelves live in Exams.</p>
            </div>
            <Button className="mt-6 min-h-11 w-fit rounded-xl bg-white text-slate-950 hover:bg-slate-100" onClick={() => sampleMode ? setLocation("/exams?preview=sample") : setLocation("/exams")}>Open Exams marketplace <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        </section>

        <section className="flex gap-3 overflow-x-auto pb-1" data-testid="home-exam-logo-row" aria-label="Exam families">
          {visibleExamGroups.map((group) => (
            <button key={group.id} type="button" onClick={() => goCategory(group.id)} className="et-interactive flex min-h-[68px] min-w-[150px] items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
              <ExamMark name={group.name} icon={group.icon} />
              <span className="min-w-0"><span className="block truncate text-sm font-black text-slate-950">{group.name}</span><span className="mt-0.5 block text-[11px] font-semibold text-slate-500">{formatCount(group.tests.length)} tests</span></span>
            </button>
          ))}
          {visibleExamGroups.length === 0 ? <div className="w-full rounded-xl border border-dashed border-slate-300 bg-white p-4 text-center text-sm text-slate-500">No matching exam family. Open the full marketplace to search every test.</div> : null}
        </section>

        {(activeSession || latestAttempt) ? (
          <section className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4" data-testid="home-continue-strip">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white"><RotateCcw className="h-5 w-5" /></span><div><h2 className="font-black text-slate-950">Continue where you left off</h2><p className="mt-0.5 text-sm text-slate-600">Resume a saved test or review your latest result.</p></div></div>
              <div className="flex flex-col gap-2 sm:flex-row">
                {activeSession ? <Button className="min-h-11" variant="outline" onClick={() => setLocation(`/test/${activeSession.testId}`)}>Resume test</Button> : null}
                {latestAttempt ? <Button className="min-h-11" onClick={() => setLocation(`/result?attemptId=${encodeURIComponent(latestAttempt.id)}&testId=${encodeURIComponent(latestAttempt.testId)}&tab=review`)}><BarChart3 className="mr-2 h-4 w-4" />Review result</Button> : null}
              </div>
            </div>
          </section>
        ) : null}

        <section data-testid="home-quick-start" aria-labelledby="home-quick-start-heading">
          <div className="flex items-end justify-between gap-4"><div><p className="text-[11px] font-black uppercase tracking-[0.14em] text-blue-600">Quick start</p><h2 id="home-quick-start-heading" className="mt-1 text-xl font-black tracking-tight text-slate-950">Choose how you want to practice</h2></div><button type="button" onClick={goMarketplace} className="min-h-11 text-sm font-black text-blue-600">See everything <ArrowRight className="ml-1 inline h-4 w-4" /></button></div>
          <div className="mt-3 grid overflow-hidden rounded-2xl border border-slate-200 bg-white sm:grid-cols-2 xl:grid-cols-4">
            {quickCounts.map((item, index) => {
              const Icon = item.icon;
              return (
                <button key={item.label} type="button" onClick={goMarketplace} className={`et-interactive flex min-h-[92px] items-center gap-3 p-4 text-left transition hover:bg-slate-50 ${index > 0 ? "border-t border-slate-200 sm:border-l sm:border-t-0" : ""}`}>
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.tone}`}><Icon className="h-5 w-5" /></span>
                  <span><span className="block text-sm font-black text-slate-950">{item.label}</span><span className="mt-1 block text-xs font-semibold text-slate-500">{formatCount(item.count)} available</span></span>
                </button>
              );
            })}
          </div>
        </section>

        {(featuredSeries.length > 0 || topFreeTest || dailyChallenge) ? (
          <section className="grid gap-4 xl:grid-cols-[1.45fr_0.55fr]" data-testid="home-focus-area">
            <div>
              <div className="flex items-end justify-between gap-4"><div><p className="text-[11px] font-black uppercase tracking-[0.14em] text-violet-600">Recommended paths</p><h2 className="mt-1 text-xl font-black tracking-tight text-slate-950">Featured preparation</h2></div><button type="button" className="min-h-11 text-sm font-black text-blue-600" onClick={goMarketplace}>Browse series <ArrowRight className="ml-1 inline h-4 w-4" /></button></div>
              <div className="mt-3 grid gap-3 md:grid-cols-3" data-testid="home-featured-series">
                {featuredSeries.map((seriesItem, index) => (
                  <article key={seriesItem.id} className={`rounded-2xl border p-4 shadow-sm ${index === 0 ? "border-slate-800 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-950"}`}>
                    <div className="flex items-center justify-between gap-3"><ExamMark name={`${seriesItem.examFamilyName} ${seriesItem.examName}`} /><span className={`rounded-full px-2 py-1 text-[10px] font-black ${index === 0 ? "bg-white/10 text-blue-200" : "bg-slate-100 text-slate-600"}`}>{formatCount(seriesItem.testCount)} TESTS</span></div>
                    <p className={`mt-4 text-[11px] font-black uppercase tracking-wide ${index === 0 ? "text-blue-300" : "text-slate-500"}`}>{seriesItem.examName}</p>
                    <h3 className="mt-1 line-clamp-2 min-h-10 text-sm font-black leading-5">{seriesItem.name}</h3>
                    <p className={`mt-3 text-xs font-semibold ${index === 0 ? "text-slate-300" : "text-slate-500"}`}>{formatCount(seriesItem.questionCount)} questions{seriesItem.attemptCount > 0 ? ` · ${formatCount(seriesItem.attemptCount)} attempts` : ""}</p>
                    <Button className={`mt-4 min-h-11 w-full ${index === 0 ? "bg-white text-slate-950 hover:bg-slate-100" : ""}`} variant={index === 0 ? "default" : "outline"} onClick={() => goSeries(seriesItem.id)}>View Series</Button>
                  </article>
                ))}
                {featuredSeries.length === 0 ? <div className="md:col-span-3 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">No live series yet. Use the marketplace to start with individual tests.</div> : null}
              </div>
            </div>

            <div className="space-y-3">
              {dailyChallenge ? (
                <button type="button" onClick={() => goTest(dailyChallenge.testId)} className="et-interactive w-full rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 p-5 text-left text-white shadow-sm" data-testid="home-daily-practice">
                  <div className="flex items-center justify-between"><span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-black">TODAY</span><CalendarDays className="h-5 w-5 text-blue-100" /></div>
                  <h3 className="mt-4 text-lg font-black">{dailyChallenge.testName}</h3>
                  <p className="mt-2 text-xs font-semibold text-blue-100">{dailyChallenge.date}{dailyChallenge.totalParticipants > 0 ? ` · ${formatCount(dailyChallenge.totalParticipants)} participants` : ""}</p>
                  <span className="mt-5 inline-flex items-center text-sm font-black">Start daily practice <ArrowRight className="ml-1.5 h-4 w-4" /></span>
                </button>
              ) : null}
              {topFreeTest ? (
                <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5" data-testid="home-free-start">
                  <div className="flex items-center justify-between"><span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-black text-emerald-700">FREE START</span><Target className="h-5 w-5 text-emerald-700" /></div>
                  <h3 className="mt-3 line-clamp-2 text-sm font-black leading-5 text-slate-950">{topFreeTest.name}</h3>
                  <p className="mt-2 text-xs font-semibold text-slate-600"><Clock3 className="mr-1 inline h-3.5 w-3.5" />{topFreeTest.duration} min · {topFreeTest.totalQuestions} questions</p>
                  <Button className="mt-4 min-h-11 w-full bg-emerald-700 text-white hover:bg-emerald-800" onClick={() => goTest(topFreeTest.id)}>Start Free</Button>
                </article>
              ) : null}
            </div>
          </section>
        ) : null}

        {subjectNames.length > 0 ? (
          <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between" data-testid="home-subject-shortcuts">
            <div><p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">Fast subject access</p><h2 className="mt-1 text-base font-black text-slate-950">Practice by subject</h2></div>
            <div className="flex flex-wrap gap-2">{subjectNames.map((name, index) => { const Icon = SUBJECT_ICONS[index % SUBJECT_ICONS.length]; return <button key={name} type="button" onClick={goMarketplace} className="et-interactive inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-black text-slate-700 hover:border-blue-200 hover:bg-blue-50"><Icon className="h-4 w-4 text-blue-600" />{name}</button>; })}</div>
          </section>
        ) : null}

        <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 px-5 py-6 text-white sm:px-7" data-testid="home-explore-gateway">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-[11px] font-black uppercase tracking-[0.14em] text-blue-200">Need more choices?</p><h2 className="mt-1 text-xl font-black">The complete catalog lives in Exams.</h2><p className="mt-1 max-w-2xl text-sm text-blue-100">Compare series, full-length mocks, free practice, PYQs, subjects and every published test with filters.</p></div><Button className="min-h-11 w-fit rounded-xl bg-white text-blue-700 hover:bg-blue-50" onClick={goMarketplace}>Explore all exams <ArrowRight className="ml-2 h-4 w-4" /></Button></div>
        </section>
      </div>
    </div>
  );
}
