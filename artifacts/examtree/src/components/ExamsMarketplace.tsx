import { useMemo, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  CalendarDays,
  ChevronRight,
  Flame,
  Globe2,
  LayoutGrid,
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
import { getStudentTestSeries, type StudentSeriesSummary } from "@/lib/test-series";
import { useExamCatalog } from "@/providers/ExamCatalogProvider";

type FreePracticeTab = "sectional" | "topic-wise" | "all";

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
  { label: "Quantitative Aptitude", icon: Sigma, keywords: ["quant", "math", "arithmetic", "numerical"] },
  { label: "Reasoning Ability", icon: BrainCircuit, keywords: ["reasoning", "logical", "aptitude"] },
  { label: "English Language", icon: BookOpen, keywords: ["english", "grammar", "vocabulary"] },
  { label: "General Awareness", icon: Globe2, keywords: ["general awareness", "general knowledge", "gk", "current affairs"] },
  { label: "Computer Awareness", icon: Monitor, keywords: ["computer", "digital", "information technology"] },
] as const;

function formatCount(value: number) {
  return new Intl.NumberFormat("en-IN").format(Math.max(0, value));
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

function SectionHeader({ eyebrow, title, description, trailing }: { eyebrow?: string; title: string; description?: string; trailing?: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? <p className="text-[11px] font-black uppercase tracking-[0.14em] text-primary">{eyebrow}</p> : null}
        <h2 className={`${eyebrow ? "mt-1" : ""} text-xl font-black tracking-tight text-foreground`}>{title}</h2>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {trailing ? <div className="shrink-0">{trailing}</div> : null}
    </div>
  );
}

function seriesMatchesFullLength(seriesItem: StudentSeriesSummary, fullLengthTests: Test[]) {
  const seriesNames = [seriesItem.examName, seriesItem.examFamilyName].map(normalize).filter(Boolean);
  return fullLengthTests.some((test) => {
    const testNames = [test.subcategoryName, test.categoryName, test.category].map(normalize).filter(Boolean);
    return seriesNames.some((seriesName) => testNames.some((testName) => seriesName === testName || seriesName.includes(testName) || testName.includes(seriesName)));
  });
}

export default function ExamsMarketplace() {
  const { categories, subcategories, tests, isLoading, error } = useExamCatalog();
  const [, setLocation] = useLocation();
  const [categoryQuery, setCategoryQuery] = useState("");
  const [freePracticeTab, setFreePracticeTab] = useState<FreePracticeTab>("sectional");

  const seriesQuery = useQuery({
    queryKey: ["student-test-series"],
    queryFn: getStudentTestSeries,
    staleTime: 30_000,
  });
  const dailyChallengeQuery = useQuery({
    queryKey: ["daily-challenge"],
    queryFn: getDailyChallenge,
    retry: 1,
    staleTime: 60_000,
  });

  const categoryNodes = useMemo(
    () => buildExamTreeNodes(categories, subcategories, tests),
    [categories, subcategories, tests],
  );
  const normalizedQuery = normalize(categoryQuery);
  const filteredCategories = useMemo(
    () => categoryNodes.filter((category) => {
      if (!normalizedQuery) return true;
      return normalize(`${category.name} ${category.description} ${category.subcategories.map((sub) => sub.name).join(" ")}`).includes(normalizedQuery);
    }),
    [categoryNodes, normalizedQuery],
  );

  const series = useMemo(
    () => [...(seriesQuery.data?.series ?? [])].sort((left, right) => {
      const attemptDelta = Number(right.attemptCount ?? 0) - Number(left.attemptCount ?? 0);
      if (attemptDelta !== 0) return attemptDelta;
      const liveDelta = right.liveTestCount - left.liveTestCount;
      if (liveDelta !== 0) return liveDelta;
      return left.name.localeCompare(right.name);
    }),
    [seriesQuery.data?.series],
  );

  const freeTests = useMemo(() => tests.filter((test) => (test.access ?? "free") === "free"), [tests]);
  const fullLengthTests = useMemo(() => tests.filter((test) => test.kind === "full-length"), [tests]);
  const fullLengthSeries = useMemo(() => series.filter((seriesItem) => seriesMatchesFullLength(seriesItem, fullLengthTests)).slice(0, 4), [series, fullLengthTests]);
  const featuredSeries = series.slice(0, 4);

  const freePracticeTests = useMemo(() => {
    const source = freePracticeTab === "all"
      ? freeTests.filter((test) => test.kind === "sectional" || test.kind === "topic-wise")
      : freeTests.filter((test) => test.kind === freePracticeTab);
    return [...source].sort((left, right) => right.attempts - left.attempts).slice(0, 4);
  }, [freePracticeTab, freeTests]);

  const pyqTests = useMemo(
    () => [...tests].filter((test) => /\bpyq\b|previous year|previous-year/i.test(test.name)).sort((left, right) => right.attempts - left.attempts).slice(0, 4),
    [tests],
  );

  const dailyNamedTests = useMemo(
    () => [...freeTests]
      .filter((test) => /daily|current affairs|challenge|booster/i.test(test.name))
      .sort((left, right) => right.attempts - left.attempts)
      .filter((test) => test.id !== dailyChallengeQuery.data?.testId)
      .slice(0, 3),
    [freeTests, dailyChallengeQuery.data?.testId],
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
      <div className="mx-auto w-full max-w-7xl space-y-5 px-4 py-6 sm:px-6 lg:px-8" role="status" aria-label="Loading exams">
        <div className="skeleton-shimmer h-28 rounded-2xl" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => <div key={index} className="skeleton-shimmer h-28 rounded-xl" />)}
        </div>
        <span className="sr-only">Loading exam series and practice tests…</span>
      </div>
    );
  }

  const dailyChallenge = dailyChallengeQuery.data;

  return (
    <div className="bg-[#f8fafc] py-5 sm:py-7">
      <div className="mx-auto w-full max-w-7xl space-y-9 px-4 sm:px-6 lg:px-8">
        <section aria-labelledby="explore-exams-heading">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-600">Exam discovery</p>
              <h1 id="explore-exams-heading" className="mt-1 text-3xl font-black tracking-[-0.035em] text-foreground sm:text-4xl">Explore Exams</h1>
              <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground">Find test series, full-length mocks, free practice and exam-wise preparation from the live ExamTree catalog.</p>
            </div>
            <div className="w-full lg:max-w-xl">
              <label htmlFor="exam-category-search" className="sr-only">Search exam categories</label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <input
                  id="exam-category-search"
                  type="search"
                  value={categoryQuery}
                  onChange={(event) => setCategoryQuery(event.target.value)}
                  placeholder="Search SSC, Banking, Railways, Punjab exams…"
                  className="min-h-[50px] w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm font-semibold text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>
          </div>

          <div className="mt-5 flex gap-3 overflow-x-auto pb-2" data-testid="exam-category-logo-row">
            {filteredCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setLocation(`/category/${category.id}`)}
                className="et-interactive group flex min-h-[72px] min-w-[142px] items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
              >
                <ExamLogo name={category.name} icon={category.icon} size="sm" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-black text-slate-900">{category.name}</span>
                  <span className="mt-0.5 block text-[11px] font-semibold text-slate-500">{formatCount(category.tests.length)} tests</span>
                </span>
              </button>
            ))}
            {filteredCategories.length === 0 ? (
              <div className="w-full rounded-xl border border-dashed border-slate-300 bg-white px-5 py-5 text-center text-sm text-muted-foreground">No exam category matches “{categoryQuery.trim()}”.</div>
            ) : null}
          </div>
        </section>

        <section data-testid="featured-series-section" aria-labelledby="featured-series-heading">
          <div id="featured-series-heading"><SectionHeader eyebrow="Featured preparation" title="Featured Test Series" description="Start with the strongest live series in the current catalog. Popularity uses real evaluated attempts when available." trailing={<span className="text-xs font-bold text-muted-foreground">{series.length} live series</span>} /></div>
          {seriesQuery.isError ? (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><span>Featured series could not be loaded.</span><Button className="min-h-11" size="sm" variant="outline" onClick={() => void seriesQuery.refetch()}>Retry series</Button></div></div>
          ) : featuredSeries.length > 0 ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {featuredSeries.map((seriesItem, index) => {
                const upcoming = Boolean(seriesItem.availabilityStartAt && new Date(seriesItem.availabilityStartAt).getTime() > Date.now());
                return (
                  <article key={seriesItem.id} className={`overflow-hidden rounded-2xl border bg-gradient-to-br p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${FEATURE_TONES[index % FEATURE_TONES.length]}`}>
                    <div className="flex items-start justify-between gap-3">
                      <ExamLogo name={`${seriesItem.examFamilyName} ${seriesItem.examName}`} size="lg" />
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${index === 0 && seriesItem.attemptCount > 0 ? "bg-amber-100 text-amber-800" : upcoming ? "bg-violet-100 text-violet-700" : "bg-emerald-100 text-emerald-700"}`}>{index === 0 && seriesItem.attemptCount > 0 ? "MOST ATTEMPTED" : upcoming ? "UPCOMING" : "OPEN"}</span>
                    </div>
                    <p className="mt-4 text-[11px] font-black uppercase tracking-wide text-slate-500">{seriesItem.examName}</p>
                    <h3 className="mt-1 line-clamp-2 min-h-10 text-base font-black leading-5 text-slate-950">{seriesItem.name}</h3>
                    <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold text-slate-600"><span>{seriesItem.testCount} tests</span><span>{formatCount(seriesItem.questionCount)} questions</span>{seriesItem.attemptCount > 0 ? <span className="inline-flex items-center gap-1"><Flame className="h-3.5 w-3.5 text-orange-500" />{formatCount(seriesItem.attemptCount)} attempts</span> : null}</div>
                    <Button className="mt-4 min-h-11 w-full" size="sm" variant="outline" onClick={() => setLocation(`/test-series/${seriesItem.id}`)}>View Series</Button>
                  </article>
                );
              })}
            </div>
          ) : <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white px-5 py-8 text-center text-sm text-muted-foreground">No canonical test series are live yet.</div>}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm sm:p-6" data-testid="full-length-series-section" aria-labelledby="full-length-series-heading">
          <div id="full-length-series-heading"><SectionHeader eyebrow="Exam simulation" title="Full-Length Test Series" description="Complete mock sequences for exams that already have full-length tests in the live catalog." trailing={<Trophy className="h-5 w-5 text-amber-500" />} /></div>
          {fullLengthSeries.length > 0 ? (
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {fullLengthSeries.map((seriesItem, index) => (
                <article key={seriesItem.id} className="group rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-200 hover:shadow-sm">
                  <div className="flex items-center gap-3"><ExamLogo name={`${seriesItem.examFamilyName} ${seriesItem.examName}`} /><div className="min-w-0"><p className="truncate text-sm font-black text-slate-950">{seriesItem.examName}</p><p className="truncate text-xs font-semibold text-slate-500">Full-length series</p></div></div>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs"><div className="rounded-lg bg-slate-50 px-2.5 py-2"><span className="block font-black text-slate-900">{seriesItem.testCount}</span><span className="text-slate-500">Tests</span></div><div className="rounded-lg bg-slate-50 px-2.5 py-2"><span className="block font-black text-slate-900">{formatCount(seriesItem.questionCount)}</span><span className="text-slate-500">Questions</span></div></div>
                  <div className={`mt-4 h-1 rounded-full ${["bg-amber-400", "bg-blue-500", "bg-rose-500", "bg-violet-500"][index % 4]}`} aria-hidden="true" />
                  <Button className="mt-3 min-h-11 w-full" size="sm" variant="ghost" onClick={() => setLocation(`/test-series/${seriesItem.id}`)}>View Series <ArrowRight className="ml-1.5 h-4 w-4" /></Button>
                </article>
              ))}
            </div>
          ) : fullLengthTests.length > 0 ? (
            <div className="mt-4 flex flex-col gap-3 rounded-xl bg-blue-50/70 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-black text-slate-900">Full-length mocks are live</p><p className="mt-1 text-sm text-slate-600">A canonical full-length series has not been published for these mocks yet.</p></div><Button className="min-h-11" variant="outline" onClick={() => setLocation(`/test/${fullLengthTests[0].id}`)}>Open a full-length mock</Button></div>
          ) : <p className="mt-4 rounded-xl border border-dashed border-slate-300 px-5 py-6 text-center text-sm text-muted-foreground">Full-length series will appear here when matching mocks are published.</p>}
        </section>

        <section className="rounded-2xl bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/70 p-5 ring-1 ring-blue-100 sm:p-6" data-testid="free-practice-section" aria-labelledby="free-practice-heading">
          <div id="free-practice-heading"><SectionHeader eyebrow="Practice without a paywall" title="Free Practice" description="Jump into published sectional or topic-wise practice." trailing={<span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">{formatCount(freeTests.length)} free tests</span>} /></div>
          <div role="tablist" aria-label="Free practice type" className="mt-4 inline-flex rounded-xl border border-blue-100 bg-white p-1 shadow-sm">
            {([["sectional", "Sectional Tests"], ["topic-wise", "Topic Tests"], ["all", "All Free"]] as const).map(([value, label]) => (
              <button key={value} type="button" role="tab" aria-selected={freePracticeTab === value} onClick={() => setFreePracticeTab(value)} className={`et-interactive min-h-11 rounded-lg px-3.5 text-sm font-bold transition ${freePracticeTab === value ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"}`}>{label}</button>
            ))}
          </div>
          {freePracticeTests.length > 0 ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {freePracticeTests.map((test) => (
                <article key={test.id} className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Target className="h-5 w-5" /></span><span className="rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-black uppercase text-emerald-700">Free</span></div>
                  <p className="mt-3 truncate text-[11px] font-black uppercase tracking-wide text-blue-600">{test.subcategoryName || test.categoryName || test.category}</p><h3 className="mt-1 line-clamp-2 min-h-10 text-sm font-black leading-5 text-slate-950">{test.name}</h3><div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold text-slate-500"><span>{test.totalQuestions} questions</span><span>{test.duration} min</span></div>
                  <Button className="mt-3 min-h-11 w-full" size="sm" onClick={() => setLocation(`/test/${test.id}`)}>Start Free</Button>
                </article>
              ))}
            </div>
          ) : <div className="mt-4 rounded-xl border border-dashed border-blue-200 bg-white/70 px-5 py-7 text-center text-sm text-muted-foreground">No free tests are published in this practice type yet.</div>}
        </section>

        <section data-testid="daily-practice-section" aria-labelledby="daily-practice-heading">
          <div id="daily-practice-heading"><SectionHeader eyebrow="Build a habit" title="Daily Practice" description="Short, current practice surfaced from real daily or challenge content." /></div>
          <div className="mt-4 rounded-2xl bg-gradient-to-r from-indigo-50 via-emerald-50 to-orange-50 p-3 ring-1 ring-slate-200/70">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {dailyChallenge ? <button type="button" onClick={() => setLocation(`/test/${dailyChallenge.testId}`)} className="et-interactive min-h-[104px] rounded-xl border border-indigo-100 bg-white/90 p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><div className="flex items-start gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700"><CalendarDays className="h-5 w-5" /></span><div className="min-w-0"><p className="text-[10px] font-black uppercase tracking-wide text-indigo-600">Today</p><h3 className="mt-1 truncate text-sm font-black text-slate-950">{dailyChallenge.testName}</h3><p className="mt-1 text-xs text-slate-500">{dailyChallenge.totalParticipants > 0 ? `${formatCount(dailyChallenge.totalParticipants)} participants` : "Daily challenge"}</p></div></div></button> : null}
              {dailyNamedTests.map((test, index) => {
                const accents = ["bg-emerald-100 text-emerald-700", "bg-orange-100 text-orange-700", "bg-violet-100 text-violet-700"];
                return <button key={test.id} type="button" onClick={() => setLocation(`/test/${test.id}`)} className="et-interactive min-h-[104px] rounded-xl border border-slate-200 bg-white/90 p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><div className="flex items-start gap-3"><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${accents[index % accents.length]}`}><Sparkles className="h-5 w-5" /></span><div className="min-w-0"><p className="text-[10px] font-black uppercase tracking-wide text-slate-500">Quick practice</p><h3 className="mt-1 line-clamp-2 text-sm font-black text-slate-950">{test.name}</h3><p className="mt-1 text-xs text-slate-500">{test.totalQuestions} questions</p></div></div></button>;
              })}
              {!dailyChallenge && dailyNamedTests.length === 0 ? <div className="col-span-full rounded-xl border border-dashed border-slate-300 bg-white/70 px-5 py-6 text-center text-sm text-muted-foreground">No daily challenge is published right now. This shelf activates automatically when one is live.</div> : null}
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)]" data-testid="pyq-section" aria-label="Previous Year Questions">
          <div>
            <SectionHeader eyebrow="Exam memory" title="Previous Year Questions" description="Exam-wise PYQ tests from the published catalog." />
            {pyqTests.length > 0 ? <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">{pyqTests.map((test, index) => <button key={test.id} type="button" onClick={() => setLocation(`/test/${test.id}`)} className={`et-interactive flex min-h-[68px] w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50 ${index > 0 ? "border-t border-slate-100" : ""}`}><ExamLogo name={`${test.categoryName || test.category} ${test.name}`} size="sm" /><span className="min-w-0 flex-1"><span className="block truncate text-sm font-black text-slate-950">{test.name}</span><span className="mt-0.5 block text-xs text-slate-500">{test.totalQuestions} questions · {test.duration} min</span></span><ChevronRight className="h-4 w-4 text-slate-400" /></button>)}</div> : <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white px-5 py-7 text-sm text-muted-foreground">No catalog tests are currently tagged as PYQs.</div>}
          </div>
          <div className="flex min-h-full flex-col justify-between rounded-2xl bg-slate-950 p-5 text-white shadow-sm"><div><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10"><BookOpen className="h-5 w-5" /></span><p className="mt-5 text-xs font-black uppercase tracking-[0.14em] text-blue-200">Dedicated PYQ Hub</p><h3 className="mt-1 text-xl font-black">Revise by exam, year and paper type</h3><p className="mt-2 text-sm leading-6 text-slate-300">Open the dedicated PYQ workspace for exam-wise previous-paper discovery as collections are published.</p></div><Button className="mt-5 min-h-11 bg-white text-slate-950 hover:bg-slate-100" onClick={() => setLocation("/pyqs")}>Open PYQ Hub <ArrowRight className="ml-2 h-4 w-4" /></Button></div>
        </section>

        {subjectSummaries.length > 0 ? <section data-testid="subject-practice-section" aria-label="Subject-wise Practice"><SectionHeader eyebrow="Drill by skill" title="Subject-wise Practice" description="Subjects are surfaced only when matching published tests exist." /><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{subjectSummaries.map((subject, index) => { const Icon = subject.icon; const tones = ["bg-blue-50 text-blue-700", "bg-violet-50 text-violet-700", "bg-emerald-50 text-emerald-700", "bg-orange-50 text-orange-700", "bg-cyan-50 text-cyan-700"]; return <button key={subject.label} type="button" disabled={!subject.firstTestId} onClick={() => subject.firstTestId && setLocation(`/test/${subject.firstTestId}`)} className="et-interactive rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><span className={`mx-auto flex h-11 w-11 items-center justify-center rounded-xl ${tones[index % tones.length]}`}><Icon className="h-5 w-5" /></span><h3 className="mt-3 text-sm font-black text-slate-950">{subject.label}</h3><p className="mt-1 text-xs font-semibold text-slate-500">{formatCount(subject.count)} matching tests</p></button>; })}</div></section> : null}

        {popularTests.length > 0 ? <section className="rounded-2xl bg-gradient-to-r from-orange-50 via-rose-50 to-violet-50 p-5 ring-1 ring-orange-100 sm:p-6" data-testid="popular-tests-section" aria-label="Popular and trending tests"><SectionHeader eyebrow="Real activity" title="Popular / Trending Tests" description="Ranked by attempt counts already present in the live catalog." trailing={<Flame className="h-5 w-5 text-orange-500" />} /><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{popularTests.map((test) => <button key={test.id} type="button" onClick={() => setLocation(`/test/${test.id}`)} className="et-interactive rounded-xl border border-white/80 bg-white/80 p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><div className="flex items-center gap-2.5"><ExamLogo name={`${test.categoryName || test.category} ${test.name}`} size="sm" /><div className="min-w-0"><p className="truncate text-xs font-bold text-orange-700">{test.subcategoryName || test.categoryName || test.category}</p><h3 className="mt-0.5 line-clamp-2 text-sm font-black text-slate-950">{test.name}</h3></div></div><div className="mt-3 flex items-center justify-between gap-2 text-[11px] font-semibold text-slate-500"><span>{test.totalQuestions} Qs</span><span className="inline-flex items-center gap-1 text-orange-700"><Flame className="h-3 w-3" />{formatCount(test.attempts)} attempts</span></div></button>)}</div></section> : null}

        <section className="border-t border-slate-200 pt-8" aria-label="All tests"><SectionHeader eyebrow="Everything published" title="All Tests" description="Use the full filterable catalog when you know exactly what you want to practise." trailing={<LayoutGrid className="h-5 w-5 text-teal-600" />} /><div className="mt-4"><CatalogTestBrowser tests={tests} /></div></section>
      </div>
    </div>
  );
}
