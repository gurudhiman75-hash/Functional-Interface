import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  ArrowRight,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Play,
  Search,
  Sparkles,
  Star,
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
const CATEGORY_TONES = ["indigo", "emerald", "orange", "sky", "rose", "violet"] as const;
const SERIES_BADGES = ["POPULAR", "NEW", "TRENDING"] as const;

function formatCount(value: number) {
  const safe = Math.max(0, Number(value) || 0);
  if (safe >= 1000000) return `${(safe / 1000000).toFixed(1)}M`;
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
  const [query, setQuery] = useState("");
  const categories = sampleMode ? SAMPLE_HOME_CATEGORIES : catalog.categories;
  const subcategories = sampleMode ? SAMPLE_HOME_SUBCATEGORIES : catalog.subcategories;
  const tests = sampleMode ? SAMPLE_HOME_TESTS : catalog.tests;
  const seriesQuery = useQuery({ queryKey: ["student-test-series", "reference-home"], queryFn: getStudentTestSeries, enabled: !sampleMode, retry: 1, staleTime: 60_000 });
  const examGroups = useMemo(() => buildExamTreeNodes(categories, subcategories, tests), [categories, subcategories, tests]);
  const featuredGroups = examGroups.slice(0, 6);
  const filteredGroups = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return featuredGroups;
    return featuredGroups.filter((group) => `${group.name} ${group.subcategories.map((item) => item.name).join(" ")}`.toLowerCase().includes(needle));
  }, [featuredGroups, query]);
  const allSeries = sampleMode ? SAMPLE_HOME_SERIES : (seriesQuery.data?.series ?? []);
  const popularSeries = useMemo(() => [...allSeries].filter((series) => seriesMatchesFilter(series, seriesFilter)).sort((left, right) => Number(right.attemptCount ?? 0) - Number(left.attemptCount ?? 0)).slice(0, 3), [allSeries, seriesFilter]);
  const totalTests = tests.length;
  const totalCategories = categories.length;

  if (!sampleMode && catalog.error) {
    return <div className="home-state-card"><h1>Could not load ExamTree</h1><p>The published exam catalog is temporarily unavailable.</p><button type="button" onClick={() => window.location.reload()}>Try again</button></div>;
  }

  if (!sampleMode && catalog.isLoading) {
    return <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8" role="status" aria-label="Loading ExamTree home"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <div key={index} className="skeleton-shimmer h-36 rounded-2xl" />)}</div><span className="sr-only">Loading published exam pathways…</span></div>;
  }

  return (
    <div className="home-page" data-testid="home-reference">
      {sampleMode ? <div className="border-b border-amber-200 bg-amber-50 text-amber-950" data-testid="home-sample-preview-badge"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 text-xs sm:px-6 lg:px-8"><span><strong>Sample data preview.</strong> Visual-only catalog data.</span><button type="button" className="min-h-10 rounded-lg px-3 font-bold hover:bg-amber-100" onClick={() => setLocation("/")}>Exit preview</button></div></div> : null}

      <section className="home-hero" data-testid="home-hero">
        <div className="hero-glow one" /><div className="hero-glow two" />
        <div className="hero-copy">
          <span className="hero-badge"><Sparkles size={14} /> {formatCount(totalTests)}+ published tests for 2026</span>
          <h1>Crack your exam.<br /><span>Own your future.</span></h1>
          <p>Practice exam-like mock tests, understand every mistake, and improve your rank with insights built around you.</p>
          <form className="search-box" onSubmit={(event) => { event.preventDefault(); document.getElementById("exams")?.scrollIntoView({ behavior: "smooth" }); }} role="search">
            <Search aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search SSC, Banking, Railways..." aria-label="Search exams" /><button type="submit">Find tests</button>
          </form>
          {query ? <div className="search-results">{filteredGroups.length ? filteredGroups.slice(0, 4).map((group) => <button key={group.id} type="button" onClick={() => setLocation(sampleMode ? "/exams?preview=sample" : `/category/${group.id}`)}><CategoryIcon icon={group.icon} /><span><b>{group.name}</b><small>{group.subcategories.slice(0, 3).map((item) => item.name).join(" · ") || "Mock tests and practice"}</small></span><ChevronRight /></button>) : <p>No exams found. Try “SSC” or “Banking”.</p>}</div> : null}
          <div className="hero-trust"><div className="avatars"><i>RK</i><i>AS</i><i>MG</i><i>+</i></div><div><span><Star size={14} fill="#ffb020" color="#ffb020" /> 4.8/5</span><p>Loved by serious aspirants</p></div></div>
        </div>
        <div className="hero-visual" aria-label="Performance dashboard preview"><div className="dashboard-card"><div className="dash-top"><span><span className="tiny-mark">E</span> Test analysis</span><Bell size={17} /></div><div className="score-panel"><div className="rank-ring"><span><b>92</b>/100</span></div><div><small>Your score</small><h3>Excellent work!</h3><p><Trophy size={14} /> You&apos;re in the top 3%</p></div></div><div className="dash-stats"><div><span>Accuracy</span><b>91.4%</b><em className="up">+8.2%</em></div><div><span>Percentile</span><b>97.1</b><em className="up">+4.5</em></div><div><span>Time saved</span><b>08:42</b><em>minutes</em></div></div><div className="progress-title"><span>Subject performance</span><b>View report</b></div>{[["Reasoning", 92, "#3156d9"], ["Quantitative Aptitude", 78, "#ed7a2f"], ["English", 86, "#0ea875"]].map(([name, value, color]) => <div className="subject" key={String(name)}><span>{name}</span><div><i style={{ width: `${value}%`, background: String(color) }} /></div><b>{value}%</b></div>)}</div><div className="float-card live"><i /><span><b>Live test</b><small>Taking place now</small></span><Play size={18} fill="currentColor" /></div><div className="float-card streak"><Award size={24} /><span><b>7 day streak!</b><small>Keep it going</small></span></div></div>
      </section>

      <section className="proof-bar"><div><b>{formatCount(Math.max(totalTests * 18, 1000))}</b><span>Questions in catalog</span></div><div><b>{formatCount(totalTests)}</b><span>Published tests</span></div><div><b>{formatCount(totalCategories)}</b><span>Exam categories</span></div><div><b>12</b><span>Languages supported</span></div></section>

      <section className="section" id="exams" data-testid="home-exam-categories"><div className="section-head"><div><span className="eyebrow">EXPLORE EXAMS</span><h2>What are you preparing for?</h2><p>Pick your goal and start practising with the latest exam pattern.</p></div><button type="button" onClick={() => setLocation("/exams")}>View all exams <ArrowRight size={16} /></button></div><div className="exam-grid">{featuredGroups.map((group, index) => <button key={group.id} type="button" onClick={() => setLocation(sampleMode ? "/exams?preview=sample" : `/category/${group.id}`)} className={`exam-card ${CATEGORY_TONES[index % CATEGORY_TONES.length]}`}><div className="exam-icon"><CategoryIcon icon={group.icon} /></div><div><h3>{group.name}</h3><p>{group.subcategories.slice(0, 4).map((item) => item.name).join(" · ") || "Mock tests and practice"}</p><span>{formatCount(group.tests.length)}+ tests</span></div><ChevronRight className="chev" /></button>)}</div></section>

      <section className="section series-section" id="test-series" data-testid="home-popular-series"><div className="section-head"><div><span className="eyebrow">MOST ATTEMPTED</span><h2>Popular test series</h2><p>Built by subject experts. Updated to the latest pattern.</p></div><div className="pills" aria-label="Test series filters">{SERIES_FILTERS.map((filter) => <button key={filter} type="button" className={seriesFilter === filter ? "active" : ""} aria-pressed={seriesFilter === filter} onClick={() => setSeriesFilter(filter)}>{filter}</button>)}</div></div>{popularSeries.length ? <div className="series-grid">{popularSeries.map((series, index) => <article className="series-card" key={series.id}><div className="series-top"><div className={`series-icon tone-${index}`}><BookOpen /></div><span className="badge">{SERIES_BADGES[index]}</span></div><h3>{series.name}</h3><div className="series-meta"><span><BookOpen />{formatCount(series.testCount)} total tests</span><span><Users />{formatCount(series.attemptCount)} users</span></div><div className="series-bottom"><span><CheckCircle2 /> {formatCount(series.liveTestCount)} free tests</span><button type="button" onClick={() => setLocation(`/test-series/${series.id}`)}>View series <ArrowRight /></button></div></article>)}</div> : <div className="home-empty-card">No published test series match this filter yet.</div>}</section>

      <section className="feature-wrap" id="features" data-testid="home-examtree-edge"><div className="feature-copy"><span className="eyebrow">THE EXAMTREE EDGE</span><h2>Don&apos;t just take tests.<br />Learn from every attempt.</h2><p>See exactly where you stand and what to improve next—with analysis that feels like a personal mentor.</p><div className="feature-list"><div><BarChart3 /><span><b>Smart performance analysis</b><small>Find weak topics, time traps, and accuracy gaps.</small></span></div><div><Trophy /><span><b>Progress that stays visible</b><small>Use saved attempts and results to keep preparation measurable.</small></span></div><div><Clock3 /><span><b>Real exam experience</b><small>Latest patterns, interface, marking, and time limits.</small></span></div></div><button type="button" onClick={() => setLocation("/mock-tests")}>Take a free mock test <ArrowRight /></button></div><div className="insight-card"><div className="insight-head"><div><span>Weekly insight</span><b>Your learning curve</b></div><span className="growth">↗ 18.6%</span></div><div className="chart"><span className="axis a">100</span><span className="axis b">75</span><span className="axis c">50</span><svg viewBox="0 0 520 190" role="img" aria-label="Score improving through the week"><defs><linearGradient id="site-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3156d9" stopOpacity=".25" /><stop offset="1" stopColor="#3156d9" stopOpacity="0" /></linearGradient></defs><path className="area" d="M20 160 C85 148 90 120 155 127 S240 95 295 105 S370 77 405 83 S465 38 505 31 L505 190 L20 190Z" /><path className="line" d="M20 160 C85 148 90 120 155 127 S240 95 295 105 S370 77 405 83 S465 38 505 31" /><circle cx="505" cy="31" r="6" /></svg><div className="days"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div></div><div className="insight-note"><Sparkles /><span><b>You&apos;re improving faster</b><small>Your practice stays visible across every attempt.</small></span><ChevronRight /></div></div></section>

      <section className="cta" data-testid="home-final-cta"><div><span><Trophy /> Your next best score starts here</span><h2>Ready to move ahead<br />of the competition?</h2><p>Start with a free mock test. No payment required.</p><button type="button" onClick={() => setLocation("/mock-tests")}>Start practising free <ArrowRight /></button></div><div className="cta-score"><div><small>YOUR NEXT MILESTONE</small><b>Keep climbing</b><p><CheckCircle2 /> Personalised study plan</p><p><CheckCircle2 /> Published mock tests</p><p><CheckCircle2 /> Detailed solutions</p></div></div></section>
    </div>
  );
}
