import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";

import { CategoryIcon } from "@/components/CategoryIcon";
import { buildExamTreeNodes } from "@/lib/exam-tree";
import {
  SAMPLE_HOME_CATEGORIES,
  SAMPLE_HOME_SERIES,
  SAMPLE_HOME_SUBCATEGORIES,
  SAMPLE_HOME_TESTS,
} from "@/lib/home-sample-data";
import { getStudentTestSeries, type StudentSeriesSummary } from "@/lib/test-series";
import { useExamCatalog } from "@/providers/ExamCatalogProvider";
import "@/styles/home-section-rhythm.css";

const SERIES_FILTERS = ["All", "SSC", "Banking", "Railways"] as const;

const CATEGORY_TONES = [
  "et-category-violet",
  "et-category-mint",
  "et-category-orange",
  "et-category-cyan",
  "et-category-rose",
  "et-category-purple",
] as const;

const SERIES_BADGES = ["POPULAR", "NEW", "TRENDING"] as const;

function formatCount(value: number) {
  const safe = Math.max(0, Number(value) || 0);
  if (safe >= 1000000) return `${(safe / 1000000).toFixed(safe >= 10000000 ? 0 : 1)}M`;
  if (safe >= 1000) return `${(safe / 1000).toFixed(safe >= 10000 ? 0 : 1)}k`;
  return new Intl.NumberFormat("en-IN").format(safe);
}

function seriesMatchesFilter(series: StudentSeriesSummary, filter: (typeof SERIES_FILTERS)[number]) {
  if (filter === "All") return true;
  const haystack = `${series.examFamilyName} ${series.examName} ${series.name}`.toLowerCase();
  if (filter === "SSC") return haystack.includes("ssc");
  if (filter === "Banking") return /bank|ibps|sbi|rrb officer/.test(haystack);
  return /rail|rrb|ntpc|group d/.test(haystack);
}

export default function Home() {
  const [, setLocation] = useLocation();
  const catalog = useExamCatalog();
  const sampleMode = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("preview") === "sample";
  const [seriesFilter, setSeriesFilter] = useState<(typeof SERIES_FILTERS)[number]>("All");

  const categories = sampleMode ? SAMPLE_HOME_CATEGORIES : catalog.categories;
  const subcategories = sampleMode ? SAMPLE_HOME_SUBCATEGORIES : catalog.subcategories;
  const tests = sampleMode ? SAMPLE_HOME_TESTS : catalog.tests;

  const seriesQuery = useQuery({
    queryKey: ["student-test-series", "reference-home"],
    queryFn: getStudentTestSeries,
    enabled: !sampleMode,
    retry: 1,
    staleTime: 60_000,
  });

  const examGroups = useMemo(
    () => buildExamTreeNodes(categories, subcategories, tests),
    [categories, subcategories, tests],
  );
  const featuredGroups = examGroups.slice(0, 6);
  const allSeries = sampleMode ? SAMPLE_HOME_SERIES : (seriesQuery.data?.series ?? []);
  const popularSeries = useMemo(
    () => [...allSeries]
      .filter((series) => seriesMatchesFilter(series, seriesFilter))
      .sort((left, right) => Number(right.attemptCount ?? 0) - Number(left.attemptCount ?? 0))
      .slice(0, 3),
    [allSeries, seriesFilter],
  );

  if (!sampleMode && catalog.error) {
    return (
      <div className="mx-auto my-16 max-w-lg rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-bold text-slate-950">Could not load ExamTree</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">The published exam catalog is temporarily unavailable.</p>
        <button type="button" className="mt-5 min-h-11 rounded-lg border border-slate-200 px-5 text-sm font-semibold text-slate-900" onClick={() => window.location.reload()}>Try again</button>
      </div>
    );
  }

  if (!sampleMode && catalog.isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8" role="status" aria-label="Loading ExamTree home">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => <div key={index} className="skeleton-shimmer h-36 rounded-2xl" />)}
        </div>
        <span className="sr-only">Loading published exam pathways…</span>
      </div>
    );
  }

  return (
    <div className="et-home-reference" data-testid="home-reference">
      {sampleMode ? (
        <div className="border-b border-amber-200 bg-amber-50 text-amber-950" data-testid="home-sample-preview-badge">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 text-xs sm:px-6 lg:px-8">
            <span><strong>Sample data preview.</strong> Visual-only catalog data.</span>
            <button type="button" className="min-h-10 rounded-lg px-3 font-bold hover:bg-amber-100" onClick={() => setLocation("/")}>Exit preview</button>
          </div>
        </div>
      ) : null}

      <section className="mx-auto max-w-7xl px-4 pt-7 sm:px-6 sm:pt-8 lg:px-8" data-testid="home-exam-categories">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="home-category-grid">
          {featuredGroups.map((group, index) => (
            <button
              key={group.id}
              type="button"
              onClick={() => setLocation(sampleMode ? "/exams?preview=sample" : `/category/${group.id}`)}
              className="et-home-category-card group text-left"
            >
              <span className={`et-home-category-icon ${CATEGORY_TONES[index % CATEGORY_TONES.length]}`}>
                <CategoryIcon icon={group.icon} className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-semibold text-slate-900">{group.name}</span>
                <span className="mt-1 block truncate text-[10px] font-medium uppercase tracking-[0.02em] text-slate-400">
                  {group.subcategories.slice(0, 4).map((item) => item.name).join(" · ") || "Mock tests and practice"}
                </span>
                <span className="mt-3 block text-[10px] font-bold text-indigo-600">{formatCount(group.tests.length)}+ tests</span>
              </span>
              <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-indigo-600" />
            </button>
          ))}
          {featuredGroups.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">Published exam families will appear here when catalog data is available.</div>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28 lg:px-8 lg:pb-24" data-testid="home-popular-series">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-indigo-600">Most attempted</p>
            <h1 className="mt-3 text-[28px] font-medium tracking-[-0.045em] text-slate-950 sm:text-[34px]">Popular test series</h1>
            <p className="mt-2 text-xs leading-5 text-slate-500">Built by subject experts. Updated to the latest pattern.</p>
          </div>
          <div className="flex flex-wrap gap-2" aria-label="Test series filters">
            {SERIES_FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                aria-pressed={seriesFilter === filter}
                onClick={() => setSeriesFilter(filter)}
                className={`min-h-9 rounded-lg border px-4 text-[10px] font-bold transition ${seriesFilter === filter ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:text-indigo-700"}`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {seriesQuery.isLoading && !sampleMode ? (
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }, (_, index) => <div key={index} className="skeleton-shimmer h-52 rounded-2xl" />)}
          </div>
        ) : popularSeries.length > 0 ? (
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {popularSeries.map((series, index) => (
              <article key={series.id} className="et-series-card">
                <div className="flex items-start justify-between gap-4">
                  <span className={`et-home-category-icon ${CATEGORY_TONES[index % CATEGORY_TONES.length]}`}>
                    <CategoryIcon icon={featuredGroups[index % Math.max(featuredGroups.length, 1)]?.icon || "Landmark"} className="h-5 w-5" />
                  </span>
                  <span className={`et-series-badge et-series-badge-${index + 1}`}>{SERIES_BADGES[index]}</span>
                </div>
                <h2 className="mt-5 min-h-[44px] text-[14px] font-medium leading-5 text-slate-900">{series.name}</h2>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] text-slate-500">
                  <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />{formatCount(series.testCount)} total tests</span>
                  <span className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{formatCount(series.attemptCount)} attempts</span>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600"><CheckCircle2 className="h-3.5 w-3.5" />{formatCount(series.liveTestCount)} live tests</span>
                  <button type="button" onClick={() => setLocation(`/test-series/${series.id}`)} className="inline-flex min-h-9 items-center gap-2 rounded-lg bg-[#6857f5] px-4 text-[10px] font-bold text-white shadow-sm transition hover:bg-[#5946ef]">
                    View series <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-7 rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
            No published test series match this filter yet.
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" data-testid="home-examtree-edge">
        <div className="et-edge-panel">
          <div className="et-edge-copy">
            <p className="text-[9px] font-extrabold uppercase tracking-[0.24em] text-[#8174ff]">The ExamTree edge</p>
            <h2 className="mt-4 max-w-lg text-[34px] font-light leading-[1.08] tracking-[-0.05em] text-white sm:text-[42px]">Don&apos;t just take tests.<br />Learn from every attempt.</h2>
            <p className="mt-5 max-w-md text-xs leading-6 text-slate-400">See exactly where you stand and what to improve next — with analysis that feels like a personal mentor.</p>

            <div className="mt-7 space-y-5">
              {[
                [BarChart3, "Smart performance analysis", "Find weak topics, time traps, and accuracy gaps."],
                [Trophy, "Progress that stays visible", "Use saved attempts and results to keep preparation measurable."],
                [Clock3, "Real exam experience", "Practice with structured tests, navigation, marking, and time limits."],
              ].map(([Icon, title, copy]) => {
                const FeatureIcon = Icon as typeof BarChart3;
                return (
                  <div key={String(title)} className="flex gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-[#8a7dff]"><FeatureIcon className="h-4 w-4" /></span>
                    <span>
                      <span className="block text-[11px] font-semibold text-white">{String(title)}</span>
                      <span className="mt-1 block text-[9px] leading-4 text-slate-500">{String(copy)}</span>
                    </span>
                  </div>
                );
              })}
            </div>

            <button type="button" onClick={() => setLocation("/mock-tests")} className="mt-8 inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#6b5af6] px-4 text-[10px] font-bold text-white transition hover:bg-[#5e4bf0]">
              Take a free mock test <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="et-learning-card" aria-label="Learning curve illustration">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[9px] text-slate-400">Weekly insight</p>
                <h3 className="mt-1 text-[13px] font-semibold text-slate-900">Your learning curve</h3>
              </div>
              <span className="rounded-md bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-600">Progress trend</span>
            </div>
            <div className="mt-5 h-[220px] w-full overflow-hidden rounded-xl bg-white">
              <svg viewBox="0 0 420 220" className="h-full w-full" role="img" aria-label="Illustrative upward learning curve">
                <defs>
                  <linearGradient id="learningArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7667f7" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#7667f7" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[38, 82, 126, 170].map((y) => <line key={y} x1="42" y1={y} x2="398" y2={y} stroke="#eef0f5" strokeWidth="1" />)}
                <path d="M48 177 C82 166, 105 148, 137 151 C169 154, 194 141, 222 138 C250 135, 268 144, 298 125 C326 108, 339 115, 360 94 C373 82, 385 70, 397 62 L397 188 L48 188 Z" fill="url(#learningArea)" />
                <path d="M48 177 C82 166, 105 148, 137 151 C169 154, 194 141, 222 138 C250 135, 268 144, 298 125 C326 108, 339 115, 360 94 C373 82, 385 70, 397 62" fill="none" stroke="#6b5af6" strokeWidth="2.4" strokeLinecap="round" />
                <circle cx="397" cy="62" r="5" fill="white" stroke="#6b5af6" strokeWidth="2.5" />
                <text x="46" y="210" fontSize="9" fill="#a4a9b5">Mon</text>
                <text x="116" y="210" fontSize="9" fill="#a4a9b5">Tue</text>
                <text x="187" y="210" fontSize="9" fill="#a4a9b5">Wed</text>
                <text x="259" y="210" fontSize="9" fill="#a4a9b5">Thu</text>
                <text x="330" y="210" fontSize="9" fill="#a4a9b5">Fri</text>
              </svg>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl bg-[#f7f6ff] px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#6b5af6] shadow-sm"><Sparkles className="h-4 w-4" /></span>
                <div>
                  <p className="text-[9px] font-semibold text-slate-800">Every attempt can teach you something.</p>
                  <p className="mt-1 text-[8px] text-slate-400">Review results and keep your progress visible.</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pb-24 sm:pt-24 lg:px-8" data-testid="home-final-cta">
        <div className="et-final-cta-panel">
          <div>
            <p className="inline-flex items-center gap-2 text-[9px] font-semibold text-white/85"><Trophy className="h-3.5 w-3.5" /> Your next best score starts here</p>
            <h2 className="mt-5 max-w-xl text-[32px] font-light leading-[1.08] tracking-[-0.05em] text-white sm:text-[40px]">Ready to move ahead<br />of the competition?</h2>
            <p className="mt-4 text-[10px] text-white/70">Start with a free mock test. No payment required.</p>
            <button type="button" onClick={() => setLocation("/mock-tests")} className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg bg-white px-4 text-[10px] font-bold text-[#5b4be4] shadow-sm transition hover:bg-slate-50">
              Start practising free <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="et-milestone-card">
            <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-white/45">Your next milestone</p>
            <p className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-white">Keep climbing</p>
            <div className="mt-5 space-y-3 text-[9px] text-white/72">
              <p className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5" /> Focused practice</p>
              <p className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5" /> Published mock tests</p>
              <p className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5" /> Detailed review</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
