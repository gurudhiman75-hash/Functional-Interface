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
  "border-[#dfdafb] bg-[#f7f5ff]",
  "border-[#dce9fb] bg-[#f5f9ff]",
  "border-[#dcefe7] bg-[#f3fbf7]",
  "border-[#f4e1d5] bg-[#fff8f3]",
] as const;

const FEATURE_ICON_TONES = [
  "bg-[#ece8ff] text-[#6657e8]",
  "bg-[#e8f2ff] text-[#3577c8]",
  "bg-[#e5f6ee] text-[#18875c]",
  "bg-[#fff0e7] text-[#c86a2f]",
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
    <span className={`relative flex ${sizeClass} shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#e4e5ec] bg-white text-xs font-black text-slate-600 shadow-[0_4px_14px_rgba(31,41,55,0.05)]`}>
      {icon ? <CategoryIcon icon={icon} className={iconClass} /> : <span>{initials(name)}</span>}
      {src ? <img src={src} alt={`${name} logo`} className="absolute inset-1 h-[calc(100%-0.5rem)] w-[calc(100%-0.5rem)] object-contain" loading="lazy" referrerPolicy="no-referrer" onError={(event) => { event.currentTarget.hidden = true; }} /> : null}
    </span>
  );
}

function SectionHeader({ eyebrow, title, description, trailing }: { eyebrow?: string; title: string; description?: string; trailing?: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow ? <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#6657e8]">{eyebrow}</p> : null}
        <h2 className={`${eyebrow ? "mt-1.5" : ""} text-xl font-bold tracking-[-0.025em] text-slate-950 sm:text-[22px]`}>{title}</h2>
        {description ? <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">{description}</p> : null}
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
      <div className="mx-auto my-10 max-w-lg rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-[0_12px_38px_rgba(40,43,72,0.05)]">
        <h1 className="text-xl font-bold text-slate-950">Could not load tests and exams</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">The test catalog is temporarily unavailable. Your saved attempts are not affected.</p>
        <Button className="mt-5 min-h-11 rounded-xl" variant="outline" onClick={() => window.location.reload()}>Try again</Button>
      </div>
    );
  }

  if (!sampleMode && catalog.isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-5 px-4 py-6 sm:px-6 lg:px-8" role="status" aria-label="Loading exams">
        <div className="skeleton-shimmer h-48 rounded-3xl" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 8 }, (_, index) => <div key={index} className="skeleton-shimmer h-28 rounded-2xl" />)}</div>
        <span className="sr-only">Loading exam series and practice tests…</span>
      </div>
    );
  }

  return (
    <div className="min-w-0 overflow-x-hidden bg-[#f7f8fc] py-5 sm:py-7">
      <div className="mx-auto min-w-0 w-full max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
        {sampleMode ? (
          <div className="flex min-w-0 flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between" data-testid="exams-sample-preview-badge">
            <span className="min-w-0 break-words"><strong>Sample data preview</strong> · 7 exam families, 98 tests and 4 test series are loaded only to review this marketplace layout.</span>
            <div className="flex shrink-0 flex-wrap gap-2"><button type="button" className="min-h-11 rounded-xl px-3 text-xs font-black hover:bg-amber-100" onClick={() => setLocation("/?preview=sample")}>Compare Home</button><button type="button" className="min-h-11 rounded-xl px-3 text-xs font-black hover:bg-amber-100" onClick={() => setLocation("/exams")}>Exit preview</button></div>
          </div>
        ) : null}

        <section className="min-w-0 overflow-hidden rounded-3xl border border-[#e5e2f4] bg-[radial-gradient(circle_at_90%_8%,rgba(108,92,241,0.13),transparent_25rem),linear-gradient(115deg,#ffffff_0%,#f7f5ff_100%)] shadow-[0_14px_44px_rgba(37,42,68,0.05)]" aria-labelledby="explore-exams-heading" data-testid="exam-discovery-command-center">
          <div className="grid min-w-0 gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(330px,0.72fr)] lg:items-center lg:p-9">
            <div className="min-w-0">
              <p className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#6657e8]"><Sparkles className="h-4 w-4" />Exam discovery</p>
              <h1 id="explore-exams-heading" className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-slate-950 sm:text-4xl lg:text-[44px]">Find your exam. Start practising.</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[15px]">Browse exam families, test series, full-length mocks, sectional practice, PYQs and every published test from one clear workspace.</p>
              <div className="mt-5 flex min-w-0 flex-wrap gap-2 text-[11px] font-black text-slate-600"><span className="rounded-full border border-[#e3dff8] bg-white px-3 py-1.5">{formatCount(categoryNodes.length)} exam families</span><span className="rounded-full border border-[#e3dff8] bg-white px-3 py-1.5">{formatCount(tests.length)} published tests</span><span className="rounded-full border border-[#d8eee4] bg-[#f4fbf7] px-3 py-1.5 text-[#247453]">{formatCount(freeTests.length)} free tests</span></div>
            </div>
            <div className="min-w-0 rounded-2xl border border-white bg-white/85 p-3 shadow-[0_10px_28px_rgba(43,47,72,0.05)] backdrop-blur-sm sm:p-4">
              <label htmlFor="exam-category-search" className="mb-2 block text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Search exam families</label>
              <div className="relative min-w-0"><Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6657e8]" /><input id="exam-category-search" type="search" value={categoryQuery} onChange={(event) => setCategoryQuery(event.target.value)} placeholder="SSC, Banking, Railways, Punjab exams…" className="min-h-[52px] min-w-0 w-full rounded-xl border border-[#dedbea] bg-white pl-12 pr-4 text-sm font-semibold text-slate-950 outline-none placeholder:text-slate-400 focus:border-[#aa9ff4] focus:ring-2 focus:ring-[#ece8ff]" /></div>
              <p className="mt-2 px-1 text-xs leading-5 text-slate-400">Search by category or exam name and open the matching family below.</p>
            </div>
          </div>

          <div className="border-t border-[#ece9f5] bg-white/60 px-5 py-4 sm:px-7 lg:px-9">
            <div className="flex max-w-full gap-3 overflow-x-auto pb-1" data-testid="exam-category-logo-row">
              {filteredCategories.map((category) => (
                <button key={category.id} type="button" onClick={() => goCategory(category.id)} className="et-interactive flex min-h-[78px] min-w-[158px] max-w-[218px] items-center gap-3 rounded-2xl border border-[#e5e5ee] bg-white px-3.5 py-3 text-left text-slate-950 shadow-[0_4px_15px_rgba(31,41,55,0.035)] transition hover:-translate-y-0.5 hover:border-[#cfc8f5] hover:shadow-[0_8px_22px_rgba(57,50,120,0.08)]">
                  <ExamLogo name={category.name} icon={category.icon} size="sm" /><span className="min-w-0"><span className="block truncate text-sm font-bold">{category.name}</span><span className="mt-0.5 block text-[11px] font-semibold text-slate-500">{formatCount(category.tests.length)} tests</span></span>
                </button>
              ))}
              {filteredCategories.length === 0 ? <div className="w-full rounded-2xl border border-dashed border-[#d7d2ef] bg-[#faf9ff] p-5 text-center text-sm text-slate-500">No exam category matches “{categoryQuery.trim()}”.</div> : null}
            </div>
          </div>
        </section>

        <section className="min-w-0" data-testid="featured-series-section" aria-labelledby="featured-series-heading">
          <div id="featured-series-heading"><SectionHeader eyebrow="Popular preparation paths" title="Featured Test Series" description="Structured series from the live catalogue, ordered by real attempt activity and available tests." trailing={<span className="rounded-full border border-[#e3dff8] bg-white px-3 py-1 text-xs font-black text-slate-500">{series.length} live series</span>} /></div>
          {!sampleMode && seriesQuery.isError ? <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Featured series could not be loaded. <button className="ml-2 font-black underline" onClick={() => void seriesQuery.refetch()}>Retry</button></div> : null}
          {featuredSeries.length > 0 ? (
            <div className="mt-4 grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {featuredSeries.map((seriesItem, index) => (
                <article key={seriesItem.id} className={`min-w-0 overflow-hidden rounded-2xl border p-5 shadow-[0_8px_28px_rgba(37,42,68,0.045)] ${FEATURE_TONES[index % FEATURE_TONES.length]}`}>
                  <div className="flex min-w-0 items-start justify-between gap-3"><span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${FEATURE_ICON_TONES[index % FEATURE_ICON_TONES.length]}`}><ExamLogo name={`${seriesItem.examFamilyName} ${seriesItem.examName}`} size="md" /></span><span className="shrink-0 rounded-full border border-white bg-white/80 px-2.5 py-1 text-[10px] font-black text-slate-600">{index === 0 && seriesItem.attemptCount > 0 ? "MOST ATTEMPTED" : "LIVE"}</span></div>
                  <p className="mt-5 truncate text-[10px] font-black uppercase tracking-[0.14em] text-[#6657e8]">{seriesItem.examName}</p><h3 className="mt-1.5 line-clamp-2 min-h-11 text-base font-bold leading-5 text-slate-950">{seriesItem.name}</h3>
                  <div className="mt-4 flex min-w-0 flex-wrap gap-x-3 gap-y-1 text-xs font-semibold text-slate-500"><span>{formatCount(seriesItem.testCount)} tests</span><span>{formatCount(seriesItem.questionCount)} questions</span>{seriesItem.attemptCount > 0 ? <span className="inline-flex items-center gap-1"><Flame className="h-3.5 w-3.5 text-orange-500" />{formatCount(seriesItem.attemptCount)} attempts</span> : null}</div>
                  <Button className="mt-5 min-h-11 w-full rounded-xl bg-[#6657e8] text-white hover:bg-[#594bd9]" onClick={() => goSeries(seriesItem.id)}>View Series</Button>
                </article>
              ))}
            </div>
          ) : <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">No canonical test series are live yet.</div>}
        </section>

        <section className="min-w-0" data-testid="full-length-series-section" aria-labelledby="full-length-series-heading">
          <div id="full-length-series-heading"><SectionHeader eyebrow="Complete mock experience" title="Full-Length Test Series" description="Full-exam practice paths shown as larger cards so the exam identity, mock inventory and action are easier to scan." trailing={<Trophy className="h-5 w-5 text-[#6657e8]" />} /></div>
          {fullLengthSeries.length > 0 ? (
            <div className="mt-4 grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {fullLengthSeries.map((seriesItem, index) => (
                <article key={seriesItem.id} className={`group flex min-h-[290px] min-w-0 flex-col overflow-hidden rounded-3xl border p-5 shadow-[0_10px_30px_rgba(37,42,68,0.045)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(54,47,112,0.08)] ${FEATURE_TONES[(index + 1) % FEATURE_TONES.length]}`}>
                  <div className="flex min-w-0 items-start justify-between gap-3">
                    <span className={`flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-2xl border border-white/80 ${FEATURE_ICON_TONES[(index + 1) % FEATURE_ICON_TONES.length]}`}><ExamLogo name={`${seriesItem.examFamilyName} ${seriesItem.examName}`} size="lg" /></span>
                    <span className="shrink-0 rounded-full border border-white bg-white/85 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-slate-600">Full mocks</span>
                  </div>
                  <p className="mt-5 truncate text-[10px] font-black uppercase tracking-[0.15em] text-[#6657e8]">{seriesItem.examName}</p>
                  <h3 className="mt-1.5 line-clamp-2 min-h-[48px] text-[17px] font-bold leading-6 tracking-[-0.02em] text-slate-950">{seriesItem.name}</h3>
                  <span className="sr-only">{formatCount(seriesItem.fullLengthTestCount)} full-length tests</span>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="rounded-xl border border-white bg-white/75 px-3 py-2.5"><p className="text-lg font-black tracking-tight text-slate-950">{formatCount(seriesItem.fullLengthTestCount)}</p><p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">Full tests</p></div>
                    <div className="rounded-xl border border-white bg-white/75 px-3 py-2.5"><p className="text-lg font-black tracking-tight text-slate-950">{formatCount(seriesItem.questionCount)}</p><p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">Questions</p></div>
                  </div>
                  {seriesItem.attemptCount > 0 ? <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500"><Flame className="h-3.5 w-3.5 text-orange-500" />{formatCount(seriesItem.attemptCount)} attempts</p> : <div className="mt-3" />}
                  <Button className="mt-auto min-h-11 w-full rounded-xl bg-[#6657e8] text-white hover:bg-[#594bd9]" onClick={() => goSeries(seriesItem.id)}>Open series <ArrowRight className="ml-1.5 h-4 w-4" /></Button>
                </article>
              ))}
            </div>
          ) : fullLengthTests.length > 0 ? <div className="mt-4 rounded-3xl border border-[#e5e2f4] bg-white p-6 text-sm text-slate-600 shadow-[0_8px_24px_rgba(37,42,68,0.035)]">Standalone full-length mocks are available. <Button className="ml-2 min-h-11 rounded-xl" variant="outline" onClick={() => goTest(fullLengthTests[0].id)}>Open a full-length mock</Button></div> : <p className="mt-4 rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">Full-length series will appear here when matching mocks are published.</p>}
        </section>

        <section className="min-w-0" data-testid="free-practice-section" aria-labelledby="free-practice-heading">
          <div id="free-practice-heading"><SectionHeader eyebrow="Start without payment" title="Free Practice" description="Use sectional and topic-wise tests to practise quickly before committing to a full mock." trailing={<span className="rounded-full border border-[#d8eee4] bg-[#f3fbf7] px-3 py-1 text-xs font-black text-[#247453]">{formatCount(freeTests.length)} free tests</span>} /></div>
          <div className="mt-4 max-w-full overflow-x-auto pb-1"><div role="tablist" aria-label="Free practice type" className="inline-flex min-w-max rounded-xl border border-[#e4e3ec] bg-white p-1 shadow-[0_4px_14px_rgba(31,41,55,0.035)]">{([["sectional", "Sectional Tests"], ["topic-wise", "Topic Tests"], ["all", "All Free"]] as const).map(([value, label]) => <button key={value} type="button" role="tab" aria-selected={freePracticeTab === value} onClick={() => setFreePracticeTab(value)} className={`et-interactive min-h-11 rounded-lg px-3.5 text-sm font-bold transition ${freePracticeTab === value ? "bg-[#6657e8] text-white" : "text-slate-600 hover:bg-[#f7f5ff]"}`}>{label}</button>)}</div></div>
          {freePracticeTests.length > 0 ? (
            <div className="mt-4 min-w-0 overflow-hidden rounded-2xl border border-[#e6e6ed] bg-white shadow-[0_8px_24px_rgba(37,42,68,0.035)]">
              <div className="hidden min-w-0 grid-cols-[minmax(0,1.4fr)_140px_110px_110px] gap-3 border-b border-[#eeeef4] bg-[#fafafa] px-4 py-2.5 text-[10px] font-black uppercase tracking-wide text-slate-500 md:grid"><span>Test</span><span>Exam</span><span>Questions</span><span>Action</span></div>
              <div className="min-w-0 divide-y divide-[#f0f0f4]">{freePracticeTests.map((test) => (
                <div key={test.id} className="grid min-w-0 gap-3 px-4 py-3 md:grid-cols-[minmax(0,1.4fr)_140px_110px_110px] md:items-center"><div className="min-w-0"><p className="truncate text-sm font-bold text-slate-950">{test.name}</p><p className="mt-0.5 truncate text-xs text-slate-500">{test.duration} min · {test.kind?.replace("-", " ")}</p></div><p className="min-w-0 truncate text-xs font-semibold text-slate-600">{test.subcategoryName || test.category}</p><p className="text-xs font-black text-slate-700">{test.totalQuestions} Q</p><Button className="min-h-11 rounded-xl bg-[#6657e8] hover:bg-[#594bd9]" size="sm" onClick={() => goTest(test.id)}>Start Free</Button></div>
              ))}</div>
            </div>
          ) : <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-7 text-center text-sm text-slate-500">No free tests are published in this practice type yet.</div>}
        </section>

        <section className="min-w-0" data-testid="daily-practice-section" aria-labelledby="daily-practice-heading">
          <div id="daily-practice-heading"><SectionHeader eyebrow="Quick practice" title="Daily Practice" description="Short challenges and free drills from the current published catalogue." /></div>
          <div className="mt-4 grid min-w-0 gap-3 md:grid-cols-3">
            {dailyChallenge ? <button type="button" onClick={() => goTest(dailyChallenge.testId)} className="et-interactive min-w-0 overflow-hidden rounded-2xl border border-[#ddd7ff] bg-[#f3f0ff] p-5 text-left text-slate-950 shadow-[0_6px_20px_rgba(71,61,145,0.045)]"><div className="flex min-w-0 items-center justify-between gap-2"><span className="truncate rounded-full bg-white px-2.5 py-1 text-[10px] font-black text-[#6657e8]">DAILY CHALLENGE</span><Target className="h-5 w-5 shrink-0 text-[#6657e8]" /></div><h3 className="mt-4 line-clamp-2 text-base font-bold">{dailyChallenge.testName}</h3><p className="mt-2 truncate text-xs font-semibold text-slate-500">{dailyChallenge.date}{dailyChallenge.totalParticipants > 0 ? ` · ${formatCount(dailyChallenge.totalParticipants)} participants` : ""}</p></button> : null}
            {dailyNamedTests.map((test, index) => <button key={test.id} type="button" onClick={() => goTest(test.id)} className={`et-interactive min-w-0 overflow-hidden rounded-2xl border p-5 text-left text-slate-950 shadow-[0_6px_20px_rgba(37,42,68,0.035)] ${index === 0 ? "border-[#f0dfc8] bg-[#fff9f1]" : "border-[#d9eee4] bg-[#f4fbf7]"}`}><div className="flex min-w-0 items-center justify-between gap-2"><span className="truncate rounded-full bg-white px-2.5 py-1 text-[10px] font-black text-slate-600">DAILY PRACTICE</span><CalendarDays className={`h-5 w-5 shrink-0 ${index === 0 ? "text-[#b87928]" : "text-[#247453]"}`} /></div><h3 className="mt-4 line-clamp-2 text-base font-bold">{test.name}</h3><p className="mt-2 truncate text-xs font-semibold text-slate-500">{test.totalQuestions} questions · {test.duration} min</p></button>)}
            {!dailyChallenge && dailyNamedTests.length === 0 ? <div className="md:col-span-3 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">No daily challenge is live right now.</div> : null}
          </div>
        </section>

        {(pyqTests.length > 0 || subjectSummaries.length > 0) ? (
          <section className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <div className="min-w-0 overflow-hidden rounded-3xl border border-[#f0dfc8] bg-[#fffaf4] p-5 shadow-[0_8px_26px_rgba(37,42,68,0.03)] sm:p-6" data-testid="pyq-section">
              <SectionHeader eyebrow="Paper archive" title="Previous Year Questions" description="Open published PYQ-labelled tests directly from the current catalogue." trailing={<FileClock className="h-5 w-5 text-[#b87928]" />} />
              <div className="mt-4 grid min-w-0 gap-2 sm:grid-cols-2">{pyqTests.map((test) => <button key={test.id} type="button" onClick={() => goTest(test.id)} className="et-interactive flex min-h-[78px] min-w-0 items-center gap-3 overflow-hidden rounded-xl border border-[#eee1d2] bg-white p-3 text-left hover:border-[#dfccb5] hover:shadow-sm"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#fff0dc] text-[#ad6d20]"><FileClock className="h-5 w-5" /></span><span className="min-w-0 flex-1"><span className="block line-clamp-2 text-sm font-bold text-slate-950">{test.name}</span><span className="mt-1 block truncate text-xs text-slate-500">{test.totalQuestions} questions</span></span><ChevronRight className="h-4 w-4 shrink-0 text-[#ad6d20]" /></button>)}</div>
            </div>

            <div className="min-w-0 overflow-hidden rounded-3xl border border-[#e3dff8] bg-[#f8f7ff] p-5 shadow-[0_8px_26px_rgba(37,42,68,0.03)] sm:p-6" data-testid="subject-practice-section">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#6657e8]">Subject navigator</p><h2 className="mt-1.5 text-xl font-bold tracking-[-0.025em] text-slate-950">Practice by Subject</h2><p className="mt-1.5 text-sm leading-6 text-slate-500">Jump into subjects represented in the live test catalogue.</p>
              <div className="mt-4 grid min-w-0 grid-cols-2 gap-2">{subjectSummaries.slice(0, 6).map((subject) => { const Icon = subject.icon; return <button key={subject.label} type="button" onClick={() => subject.firstTestId ? goTest(subject.firstTestId) : setLocation("/exams")} className="et-interactive min-h-[90px] min-w-0 overflow-hidden rounded-xl border border-[#e4e0f4] bg-white p-3 text-left hover:border-[#cfc8f5] hover:bg-[#fdfcff]"><Icon className="h-5 w-5 text-[#6657e8]" /><span className="mt-2 block truncate text-sm font-bold text-slate-950">{subject.short}</span><span className="mt-0.5 block truncate text-[11px] font-semibold text-slate-500">{formatCount(subject.count)} tests</span></button>; })}</div>
            </div>
          </section>
        ) : null}

        {popularTests.length > 0 ? (
          <section className="min-w-0 overflow-hidden rounded-3xl border border-[#eee5e4] bg-white shadow-[0_8px_26px_rgba(37,42,68,0.03)]" data-testid="popular-tests-section" aria-labelledby="popular-tests-heading">
            <div className="border-b border-[#f0eceb] bg-[linear-gradient(90deg,#fff8f6_0%,#ffffff_55%,#faf9ff_100%)] px-5 py-4 sm:px-6" id="popular-tests-heading"><SectionHeader eyebrow="Real attempt activity" title="Popular Tests" description="Ranked only by actual attempt counts reported in the published catalogue." trailing={<Flame className="h-5 w-5 text-orange-500" />} /></div>
            <div className="grid min-w-0 divide-y divide-[#f0f0f4] md:grid-cols-5 md:divide-x md:divide-y-0">{popularTests.map((test, index) => <button key={test.id} type="button" onClick={() => goTest(test.id)} className="et-interactive min-h-[126px] min-w-0 overflow-hidden p-4 text-left hover:bg-[#fcfbff]"><div className="flex min-w-0 items-center justify-between gap-2"><span className="shrink-0 text-lg font-black text-[#6657e8]">#{index + 1}</span><span className="min-w-0 truncate text-[10px] font-black text-slate-500">{formatCount(test.attempts)} attempts</span></div><h3 className="mt-3 line-clamp-2 text-sm font-bold leading-5 text-slate-950">{test.name}</h3><p className="mt-2 truncate text-xs font-semibold text-slate-500">{test.subcategoryName || test.category}</p></button>)}</div>
          </section>
        ) : null}

        <section className="min-w-0 overflow-hidden" data-testid="all-tests-section">
          <SectionHeader eyebrow="Complete inventory" title="All Tests" description="Search, filter, sort and page through the full published catalogue when you need exhaustive discovery." />
          <div className="mt-4 min-w-0"><CatalogTestBrowser tests={tests} /></div>
        </section>
      </div>
    </div>
  );
}
