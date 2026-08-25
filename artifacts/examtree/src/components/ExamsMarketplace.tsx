import { useMemo, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  CalendarDays,
  ChevronRight,
  FileClock,
  Flame,
  Globe2,
  Monitor,
  Search,
  Sigma,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";

import { CategoryIcon } from "@/components/CategoryIcon";
import { CatalogTestBrowser } from "@/components/CatalogTestBrowser";
import { Button } from "@/components/ui/button";
import { getDailyChallenge, type Test } from "@/lib/data";
import { buildExamTreeNodes } from "@/lib/exam-tree";
import {
  SAMPLE_HOME_CATEGORIES,
  SAMPLE_HOME_DAILY_CHALLENGE,
  SAMPLE_HOME_SERIES,
  SAMPLE_HOME_SUBCATEGORIES,
  SAMPLE_HOME_TESTS,
} from "@/lib/home-sample-data";
import { getStudentTestSeries } from "@/lib/test-series";
import { useExamCatalog } from "@/providers/ExamCatalogProvider";

type FreePracticeTab = "sectional" | "topic-wise" | "all";

const FEATURE_TONES = [
  "from-slate-950 via-slate-900 to-blue-950 border-slate-800 text-white",
  "from-blue-700 via-blue-600 to-indigo-700 border-blue-500 text-white",
  "from-violet-700 via-indigo-700 to-slate-900 border-violet-500 text-white",
  "from-emerald-700 via-teal-700 to-slate-900 border-emerald-500 text-white",
] as const;

const EXAM_LOGOS = [
  { match: /\bssc\b/i, src: "https://ssc.gov.in/favicon.ico" },
  { match: /\bibps\b|bank/i, src: "https://www.ibps.in/favicon.ico" },
  { match: /\brrb\b|railway/i, src: "https://indianrailways.gov.in/favicon.ico" },
  { match: /punjab police/i, src: "https://punjabpolice.gov.in/favicon.ico" },
] as const;

const SUBJECT_RULES = [
  { label: "Quantitative Aptitude", short: "Quant", icon: Sigma, keywords: ["quant", "math", "arithmetic", "numerical"] },
  { label: "Reasoning Ability", short: "Reasoning", icon: BrainCircuit, keywords: ["reasoning", "logical", "aptitude"] },
  { label: "English Language", short: "English", icon: BookOpen, keywords: ["english", "grammar", "vocabulary"] },
  { label: "General Awareness", short: "GK / GA", icon: Globe2, keywords: ["general awareness", "general knowledge", "gk", "current affairs"] },
  { label: "Computer Awareness", short: "Computer", icon: Monitor, keywords: ["computer", "digital", "information technology"] },
] as const;

function formatCount(value: number) {
  return new Intl.NumberFormat("en-IN").format(Math.max(0, Number(value) || 0));
}

function normalize(value: string | null | undefined) {
  return String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
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

function initials(value: string) {
  const words = value.trim().split(/\s+/).filter(Boolean);
  return words.length ? words.slice(0, 2).map((word) => word[0]?.toUpperCase()).join("") : "ET";
}

function ExamLogo({ name, icon, size = "md" }: { name: string; icon?: string; size?: "sm" | "md" | "lg" }) {
  const src = EXAM_LOGOS.find((item) => item.match.test(name))?.src ?? null;
  const sizeClass = size === "lg" ? "h-14 w-14" : size === "sm" ? "h-9 w-9" : "h-11 w-11";
  const iconClass = size === "lg" ? "h-7 w-7" : size === "sm" ? "h-4 w-4" : "h-5 w-5";
  return (
    <span className={`relative flex ${sizeClass} shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white text-xs font-black text-slate-600 shadow-sm`}>
      {icon ? <CategoryIcon icon={icon} className={iconClass} /> : <span>{initials(name)}</span>}
      {src ? <img src={src} alt={`${name} logo`} className="absolute inset-1 h-[calc(100%-0.5rem)] w-[calc(100%-0.5rem)] object-contain" loading="lazy" referrerPolicy="no-referrer" onError={(event) => { event.currentTarget.hidden = true; }} /> : null}
    </span>
  );
}

function SectionHeader({ eyebrow, title, description, trailing }: { eyebrow?: string; title: string; description?: string; trailing?: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow ? <p className="text-[11px] font-black uppercase tracking-[0.14em] text-blue-600">{eyebrow}</p> : null}
        <h2 className={`${eyebrow ? "mt-1" : ""} text-xl font-black tracking-tight text-slate-950`}>{title}</h2>
        {description ? <p className="mt-1 text-sm text-slate-600">{description}</p> : null}
      </div>
      {trailing ? <div className="shrink-0">{trailing}</div> : null}
    </div>
  );
}

export default function ExamsMarketplace() {
  const catalog = useExamCatalog();
  const [, setLocation] = useLocation();
  const sampleMode = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("preview") === "sample";
  const [categoryQuery, setCategoryQuery] = useState("");
  const [freePracticeTab, setFreePracticeTab] = useState<FreePracticeTab>("sectional");

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

  const categoryNodes = useMemo(
    () => buildExamTreeNodes(categories, subcategories, tests),
    [categories, subcategories, tests],
  );
  const normalizedQuery = normalize(categoryQuery);
  const filteredCategories = useMemo(
    () => categoryNodes.filter((category) => !normalizedQuery || normalize(`${category.name} ${category.description} ${category.subcategories.map((sub) => sub.name).join(" ")}`).includes(normalizedQuery)),
    [categoryNodes, normalizedQuery],
  );

  const series = useMemo(
    () => [...(sampleMode ? SAMPLE_HOME_SERIES : (seriesQuery.data?.series ?? []))].sort((left, right) => {
      const attemptDelta = Number(right.attemptCount ?? 0) - Number(left.attemptCount ?? 0);
      if (attemptDelta !== 0) return attemptDelta;
      const liveDelta = right.liveTestCount - left.liveTestCount;
      if (liveDelta !== 0) return liveDelta;
      return left.name.localeCompare(right.name);
    }),
    [sampleMode, seriesQuery.data?.series],
  );

  const freeTests = useMemo(() => tests.filter((test) => (test.access ?? "free") === "free"), [tests]);
  const fullLengthTests = useMemo(() => tests.filter((test) => test.kind === "full-length"), [tests]);
  const fullLengthSeries = useMemo(() => series.filter((seriesItem) => Number(seriesItem.fullLengthTestCount ?? 0) > 0).slice(0, 4), [series]);
  const featuredSeries = series.slice(0, 4);

  const freePracticeTests = useMemo(() => {
    const source = freePracticeTab === "all"
      ? freeTests.filter((test) => test.kind === "sectional" || test.kind === "topic-wise")
      : freeTests.filter((test) => test.kind === freePracticeTab);
    return [...source].sort((left, right) => right.attempts - left.attempts).slice(0, 6);
  }, [freePracticeTab, freeTests]);

  const pyqTests = useMemo(
    () => [...tests].filter((test) => /\bpyq\b|previous year|previous-year/i.test(test.name)).sort((left, right) => right.attempts - left.attempts).slice(0, 6),
    [tests],
  );

  const dailyChallenge = sampleMode ? SAMPLE_HOME_DAILY_CHALLENGE : dailyChallengeQuery.data;
  const dailyNamedTests = useMemo(
    () => [...freeTests]
      .filter((test) => /daily|current affairs|challenge|booster/i.test(test.name))
      .sort((left, right) => right.attempts - left.attempts)
      .filter((test) => test.id !== dailyChallenge?.testId)
      .slice(0, 2),
    [dailyChallenge?.testId, freeTests],
  );

  const subjectSummaries = useMemo(
    () => SUBJECT_RULES.map((subject) => {
      const matching = tests.filter((test) => subject.keywords.some((keyword) => testSearchText(test).includes(keyword)));
      return { ...subject, count: matching.length, firstTestId: matching[0]?.id ?? null };
    }).filter((subject) => subject.count > 0),
    [tests],
  );

  const popularTests = useMemo(
    () => [...tests].filter((test) => test.attempts > 0).sort((left, right) => right.attempts - left.attempts).slice(0, 5),
    [tests],
  );

  const goCategory = (id: string) => sampleMode ? setLocation("/exams?preview=sample") : setLocation(`/category/${id}`);
  const goSeries = (id: string) => sampleMode ? setLocation("/exams?preview=sample") : setLocation(`/test-series/${id}`);
  const goTest = (id: string) => sampleMode ? setLocation("/exams?preview=sample") : setLocation(`/test/${id}`);

  if (!sampleMode && catalog.error) {
    return (
      <div className="mx-auto my-10 max-w-lg rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-black text-slate-950">Could not load tests and exams</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">The test catalog is temporarily unavailable. Your saved attempts are not affected.</p>
        <Button className="mt-5 min-h-11" variant="outline" onClick={() => window.location.reload()}>Try again</Button>
      </div>
    );
  }

  if (!sampleMode && catalog.isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-5 px-4 py-6 sm:px-6 lg:px-8" role="status" aria-label="Loading exams">
        <div className="skeleton-shimmer h-48 rounded-2xl" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 8 }, (_, index) => <div key={index} className="skeleton-shimmer h-28 rounded-xl" />)}</div>
        <span className="sr-only">Loading exam series and practice tests…</span>
      </div>
    );
  }

  return (
    <div className="min-w-0 overflow-x-hidden bg-[#f8fafc] py-5 sm:py-7">
      <div className="mx-auto min-w-0 w-full max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
        {sampleMode ? (
          <div className="flex min-w-0 flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between" data-testid="exams-sample-preview-badge">
            <span className="min-w-0 break-words"><strong>Sample data preview</strong> · 7 exam families, 98 tests and 4 test series are loaded only to review this marketplace layout.</span>
            <div className="flex shrink-0 flex-wrap gap-2"><button type="button" className="min-h-11 rounded-lg px-3 text-xs font-black hover:bg-amber-100" onClick={() => setLocation("/?preview=sample")}>Compare Home</button><button type="button" className="min-h-11 rounded-lg px-3 text-xs font-black hover:bg-amber-100" onClick={() => setLocation("/exams")}>Exit preview</button></div>
          </div>
        ) : null}

        <section className="min-w-0 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 p-5 text-white shadow-lg shadow-blue-950/10 sm:p-7" aria-labelledby="explore-exams-heading" data-testid="exam-discovery-command-center">
          <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.72fr)] lg:items-end">
            <div className="min-w-0">
              <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-blue-100"><Sparkles className="h-4 w-4" />Complete exam marketplace</p>
              <h1 id="explore-exams-heading" className="mt-2 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl lg:text-[44px]">Explore Exams</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">Compare complete series, full-length mocks, free practice, daily challenges, PYQs and every published test in one place.</p>
              <div className="mt-4 flex min-w-0 flex-wrap gap-2 text-[11px] font-black text-blue-50"><span className="rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/15">{formatCount(categoryNodes.length)} exam families</span><span className="rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/15">{formatCount(tests.length)} published tests</span><span className="rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/15">{formatCount(freeTests.length)} free tests</span></div>
            </div>
            <div className="min-w-0">
              <label htmlFor="exam-category-search" className="sr-only">Search exam categories</label>
              <div className="relative min-w-0"><Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" /><input id="exam-category-search" type="search" value={categoryQuery} onChange={(event) => setCategoryQuery(event.target.value)} placeholder="Search SSC, Banking, Railways, Punjab exams…" className="min-h-[52px] min-w-0 w-full rounded-xl border border-white/80 bg-white pl-12 pr-4 text-sm font-semibold text-slate-950 shadow-xl outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-white/30" /></div>
            </div>
          </div>

          <div className="mt-6 flex max-w-full gap-3 overflow-x-auto pb-1" data-testid="exam-category-logo-row">
            {filteredCategories.map((category) => (
              <button key={category.id} type="button" onClick={() => goCategory(category.id)} className="et-interactive flex min-h-[74px] min-w-[150px] max-w-[210px] items-center gap-3 rounded-xl border border-white/75 bg-white px-3.5 py-3 text-left text-slate-950 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                <ExamLogo name={category.name} icon={category.icon} size="sm" /><span className="min-w-0"><span className="block truncate text-sm font-black">{category.name}</span><span className="mt-0.5 block text-[11px] font-semibold text-slate-500">{formatCount(category.tests.length)} tests</span></span>
              </button>
            ))}
            {filteredCategories.length === 0 ? <div className="w-full rounded-xl border border-dashed border-white/50 bg-white/10 p-5 text-center text-sm text-blue-50">No exam category matches “{categoryQuery.trim()}”.</div> : null}
          </div>
        </section>

        <section className="min-w-0" data-testid="featured-series-section" aria-labelledby="featured-series-heading">
          <div id="featured-series-heading"><SectionHeader eyebrow="Premium shelf" title="Featured Test Series" description="The strongest preparation paths get the richest visual treatment." trailing={<span className="text-xs font-black text-slate-500">{series.length} live series</span>} /></div>
          {!sampleMode && seriesQuery.isError ? <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Featured series could not be loaded. <button className="ml-2 font-black underline" onClick={() => void seriesQuery.refetch()}>Retry</button></div> : null}
          {featuredSeries.length > 0 ? (
            <div className="mt-4 grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {featuredSeries.map((seriesItem, index) => (
                <article key={seriesItem.id} className={`min-w-0 overflow-hidden rounded-2xl border bg-gradient-to-br p-5 shadow-lg shadow-slate-900/10 ${FEATURE_TONES[index % FEATURE_TONES.length]}`}>
                  <div className="flex min-w-0 items-start justify-between gap-3"><ExamLogo name={`${seriesItem.examFamilyName} ${seriesItem.examName}`} size="lg" /><span className="shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-black text-white ring-1 ring-white/15">{index === 0 && seriesItem.attemptCount > 0 ? "MOST ATTEMPTED" : "LIVE"}</span></div>
                  <p className="mt-5 truncate text-[11px] font-black uppercase tracking-wide text-blue-200">{seriesItem.examName}</p><h3 className="mt-1 line-clamp-2 min-h-11 text-base font-black leading-5 text-white">{seriesItem.name}</h3>
                  <div className="mt-4 flex min-w-0 flex-wrap gap-x-3 gap-y-1 text-xs font-semibold text-slate-200"><span>{formatCount(seriesItem.testCount)} tests</span><span>{formatCount(seriesItem.questionCount)} questions</span>{seriesItem.attemptCount > 0 ? <span className="inline-flex items-center gap-1"><Flame className="h-3.5 w-3.5 text-orange-300" />{formatCount(seriesItem.attemptCount)} attempts</span> : null}</div>
                  <Button className="mt-5 min-h-11 w-full bg-white text-slate-950 hover:bg-slate-100" onClick={() => goSeries(seriesItem.id)}>View Series</Button>
                </article>
              ))}
            </div>
          ) : <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">No canonical test series are live yet.</div>}
        </section>

        <section className="min-w-0 overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50/60" data-testid="full-length-series-section" aria-labelledby="full-length-series-heading">
          <div className="border-b border-emerald-200 px-5 py-4 sm:px-6"><div id="full-length-series-heading"><SectionHeader eyebrow="Complete exam simulation" title="Full-Length Test Series" description="A structured lane view instead of another card grid." trailing={<Trophy className="h-5 w-5 text-amber-500" />} /></div></div>
          {fullLengthSeries.length > 0 ? (
            <div className="min-w-0 divide-y divide-emerald-200/70">
              {fullLengthSeries.map((seriesItem, index) => (
                <div key={seriesItem.id} className="grid min-w-0 gap-4 bg-white/65 px-5 py-4 transition hover:bg-white sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:px-6">
                  <div className="flex min-w-0 items-center gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-xs font-black text-white">{index + 1}</span><ExamLogo name={`${seriesItem.examFamilyName} ${seriesItem.examName}`} /></div>
                  <div className="min-w-0"><p className="truncate text-sm font-black text-slate-950">{seriesItem.name}</p><p className="mt-1 truncate text-xs font-semibold text-slate-500">{seriesItem.examName} · {formatCount(seriesItem.fullLengthTestCount)} full-length tests · {formatCount(seriesItem.questionCount)} questions</p><div className="mt-2 h-1.5 max-w-md overflow-hidden rounded-full bg-emerald-100"><div className="h-full rounded-full bg-emerald-600" style={{ width: `${Math.min(100, 35 + index * 15)}%` }} /></div></div>
                  <Button className="min-h-11 w-full shrink-0 sm:w-auto" variant="outline" onClick={() => goSeries(seriesItem.id)}>Open series <ArrowRight className="ml-1.5 h-4 w-4" /></Button>
                </div>
              ))}
            </div>
          ) : fullLengthTests.length > 0 ? <div className="p-5 text-sm text-slate-600">Standalone full-length mocks are available. <Button className="ml-2 min-h-11" variant="outline" onClick={() => goTest(fullLengthTests[0].id)}>Open a full-length mock</Button></div> : <p className="p-6 text-center text-sm text-slate-500">Full-length series will appear here when matching mocks are published.</p>}
        </section>

        <section className="min-w-0" data-testid="free-practice-section" aria-labelledby="free-practice-heading">
          <div id="free-practice-heading"><SectionHeader eyebrow="No paywall" title="Free Practice" description="A compact tabbed list for sectional and topic practice, deliberately lighter than Featured Series." trailing={<span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">{formatCount(freeTests.length)} free tests</span>} /></div>
          <div className="mt-4 max-w-full overflow-x-auto pb-1"><div role="tablist" aria-label="Free practice type" className="inline-flex min-w-max rounded-xl border border-slate-200 bg-white p-1 shadow-sm">{([["sectional", "Sectional Tests"], ["topic-wise", "Topic Tests"], ["all", "All Free"]] as const).map(([value, label]) => <button key={value} type="button" role="tab" aria-selected={freePracticeTab === value} onClick={() => setFreePracticeTab(value)} className={`et-interactive min-h-11 rounded-lg px-3.5 text-sm font-black transition ${freePracticeTab === value ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}>{label}</button>)}</div></div>
          {freePracticeTests.length > 0 ? (
            <div className="mt-4 min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="hidden min-w-0 grid-cols-[minmax(0,1.4fr)_140px_110px_110px] gap-3 border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-[10px] font-black uppercase tracking-wide text-slate-500 md:grid"><span>Test</span><span>Exam</span><span>Questions</span><span>Action</span></div>
              <div className="min-w-0 divide-y divide-slate-100">{freePracticeTests.map((test) => (
                <div key={test.id} className="grid min-w-0 gap-3 px-4 py-3 md:grid-cols-[minmax(0,1.4fr)_140px_110px_110px] md:items-center"><div className="min-w-0"><p className="truncate text-sm font-black text-slate-950">{test.name}</p><p className="mt-0.5 truncate text-xs text-slate-500">{test.duration} min · {test.kind?.replace("-", " ")}</p></div><p className="min-w-0 truncate text-xs font-semibold text-slate-600">{test.subcategoryName || test.category}</p><p className="text-xs font-black text-slate-700">{test.totalQuestions} Q</p><Button className="min-h-11" size="sm" onClick={() => goTest(test.id)}>Start Free</Button></div>
              ))}</div>
            </div>
          ) : <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white p-7 text-center text-sm text-slate-500">No free tests are published in this practice type yet.</div>}
        </section>

        <section className="min-w-0" data-testid="daily-practice-section" aria-labelledby="daily-practice-heading">
          <div id="daily-practice-heading"><SectionHeader eyebrow="Fresh every day" title="Daily Practice" description="Short challenges get a distinct action-ribbon treatment." /></div>
          <div className="mt-4 grid min-w-0 gap-3 md:grid-cols-3">
            {dailyChallenge ? <button type="button" onClick={() => goTest(dailyChallenge.testId)} className="et-interactive min-w-0 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 p-5 text-left text-white shadow-sm"><div className="flex min-w-0 items-center justify-between gap-2"><span className="truncate rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-black">DAILY CHALLENGE</span><Target className="h-5 w-5 shrink-0 text-blue-100" /></div><h3 className="mt-4 line-clamp-2 text-base font-black">{dailyChallenge.testName}</h3><p className="mt-2 truncate text-xs font-semibold text-blue-100">{dailyChallenge.date}{dailyChallenge.totalParticipants > 0 ? ` · ${formatCount(dailyChallenge.totalParticipants)} participants` : ""}</p></button> : null}
            {dailyNamedTests.map((test, index) => <button key={test.id} type="button" onClick={() => goTest(test.id)} className={`et-interactive min-w-0 overflow-hidden rounded-2xl p-5 text-left shadow-sm ${index === 0 ? "bg-amber-100 text-amber-950" : "bg-emerald-100 text-emerald-950"}`}><div className="flex min-w-0 items-center justify-between gap-2"><span className="truncate rounded-full bg-white/50 px-2.5 py-1 text-[10px] font-black">DAILY PRACTICE</span><CalendarDays className="h-5 w-5 shrink-0" /></div><h3 className="mt-4 line-clamp-2 text-base font-black">{test.name}</h3><p className="mt-2 truncate text-xs font-semibold opacity-70">{test.totalQuestions} questions · {test.duration} min</p></button>)}
            {!dailyChallenge && dailyNamedTests.length === 0 ? <div className="md:col-span-3 rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">No daily challenge is live right now.</div> : null}
          </div>
        </section>

        {(pyqTests.length > 0 || subjectSummaries.length > 0) ? (
          <section className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <div className="min-w-0 overflow-hidden rounded-2xl border border-amber-200 bg-amber-50/70 p-5 sm:p-6" data-testid="pyq-section">
              <SectionHeader eyebrow="Paper archive" title="Previous Year Questions" description="Paper-like rows make PYQs feel different from live mocks." trailing={<FileClock className="h-5 w-5 text-amber-700" />} />
              <div className="mt-4 grid min-w-0 gap-2 sm:grid-cols-2">{pyqTests.map((test) => <button key={test.id} type="button" onClick={() => goTest(test.id)} className="et-interactive flex min-h-[78px] min-w-0 items-center gap-3 overflow-hidden rounded-xl border border-amber-200 bg-white p-3 text-left hover:shadow-sm"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-800"><FileClock className="h-5 w-5" /></span><span className="min-w-0 flex-1"><span className="block line-clamp-2 text-sm font-black text-slate-950">{test.name}</span><span className="mt-1 block truncate text-xs text-slate-500">{test.totalQuestions} questions</span></span><ChevronRight className="h-4 w-4 shrink-0 text-amber-700" /></button>)}</div>
            </div>

            <div className="min-w-0 overflow-hidden rounded-2xl bg-slate-950 p-5 text-white sm:p-6" data-testid="subject-practice-section">
              <p className="text-[11px] font-black uppercase tracking-[0.14em] text-blue-300">Subject navigator</p><h2 className="mt-1 text-xl font-black">Practice by Subject</h2><p className="mt-1 text-sm text-slate-300">Jump directly into the subject represented in the live catalog.</p>
              <div className="mt-4 grid min-w-0 grid-cols-2 gap-2">{subjectSummaries.slice(0, 6).map((subject) => { const Icon = subject.icon; return <button key={subject.label} type="button" onClick={() => subject.firstTestId ? goTest(subject.firstTestId) : setLocation("/exams")} className="et-interactive min-h-[90px] min-w-0 overflow-hidden rounded-xl border border-white/10 bg-white/5 p-3 text-left hover:bg-white/10"><Icon className="h-5 w-5 text-blue-300" /><span className="mt-2 block truncate text-sm font-black">{subject.short}</span><span className="mt-0.5 block truncate text-[11px] font-semibold text-slate-400">{formatCount(subject.count)} tests</span></button>; })}</div>
            </div>
          </section>
        ) : null}

        {popularTests.length > 0 ? (
          <section className="min-w-0 overflow-hidden rounded-2xl bg-gradient-to-r from-rose-50 via-white to-orange-50 ring-1 ring-rose-100" data-testid="popular-tests-section" aria-labelledby="popular-tests-heading">
            <div className="border-b border-rose-100 px-5 py-4 sm:px-6" id="popular-tests-heading"><SectionHeader eyebrow="Real attempt activity" title="Popular Tests" description="A ranked ribbon using actual attempt counts only." trailing={<Flame className="h-5 w-5 text-orange-500" />} /></div>
            <div className="grid min-w-0 divide-y divide-rose-100 md:grid-cols-5 md:divide-x md:divide-y-0">{popularTests.map((test, index) => <button key={test.id} type="button" onClick={() => goTest(test.id)} className="et-interactive min-h-[126px] min-w-0 overflow-hidden p-4 text-left hover:bg-white"><div className="flex min-w-0 items-center justify-between gap-2"><span className="shrink-0 text-lg font-black text-rose-500">#{index + 1}</span><span className="min-w-0 truncate text-[10px] font-black text-slate-500">{formatCount(test.attempts)} attempts</span></div><h3 className="mt-3 line-clamp-2 text-sm font-black leading-5 text-slate-950">{test.name}</h3><p className="mt-2 truncate text-xs font-semibold text-slate-500">{test.subcategoryName || test.category}</p></button>)}</div>
          </section>
        ) : null}

        <section className="min-w-0 overflow-hidden" data-testid="all-tests-section">
          <SectionHeader eyebrow="Complete inventory" title="All Tests" description="Search, filter, sort and page through the full catalog only when you need exhaustive discovery." />
          <div className="mt-4 min-w-0"><CatalogTestBrowser tests={tests} /></div>
        </section>
      </div>
    </div>
  );
}
