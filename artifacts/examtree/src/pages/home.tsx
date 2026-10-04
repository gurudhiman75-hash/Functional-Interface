import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  ArrowRight,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  CheckCircle2,
  Chrome,
  ChevronRight,
  Clock3,
  Play,
  Search,
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
import { signInWithGoogle } from "@/lib/auth";
import { getActiveTestSessions, getUser, type User } from "@/lib/storage";
import { getUserAttempts } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import "@/styles/home-section-rhythm.css";

const SERIES_FILTERS = ["All", "SSC", "Banking", "Railways"] as const;
const CATEGORY_TONES = ["indigo", "emerald", "orange", "sky", "rose", "violet"] as const;
const SERIES_BADGES = ["POPULAR", "NEW", "TRENDING"] as const;

const REFERENCE_EXAMS = [
  { name: "SSC", detail: "CGL | CHSL | MTS" },
  { name: "Banking", detail: "IBPS | SBI | RBI" },
  { name: "Punjab Govt.", detail: "PSSSB | PSPCL" },
  { name: "State Govt.", detail: "All State Exams" },
  { name: "Railways", detail: "RRB NTPC | Group D" },
  { name: "Defence", detail: "NDA | CDS | Agniveer" },
  { name: "Insurance", detail: "LIC | UIIC | NIACL" },
] as const;

const REFERENCE_SERIES = [
  { name: "SBI PO 2025", badge: "Pre + Mains", tests: "120+ Tests", price: "₹499", oldPrice: "₹999" },
  { name: "SSC CGL 2025", badge: "Tier 1 + Tier 2", tests: "100+ Tests", price: "₹399", oldPrice: "₹799" },
  { name: "PSSSB Exams", badge: "All Posts", tests: "80+ Tests", price: "₹299", oldPrice: "₹599" },
  { name: "IBPS PO 2025", badge: "Pre + Mains", tests: "100+ Tests", price: "₹399", oldPrice: "₹799" },
] as const;

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
  const { toast } = useToast();
  const catalog = useExamCatalog();
  const sampleMode = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("preview") === "sample";
  const [seriesFilter, setSeriesFilter] = useState<(typeof SERIES_FILTERS)[number]>("All");
  const [query, setQuery] = useState("");
  const [sessionUser, setSessionUser] = useState<User | null>(() => (typeof window === "undefined" ? null : getUser()));
  const [googleSignInPending, setGoogleSignInPending] = useState(false);
  const categories = sampleMode ? SAMPLE_HOME_CATEGORIES : catalog.categories;
  const subcategories = sampleMode ? SAMPLE_HOME_SUBCATEGORIES : catalog.subcategories;
  const tests = sampleMode ? SAMPLE_HOME_TESTS : catalog.tests;
  const seriesQuery = useQuery({ queryKey: ["student-test-series", "reference-home"], queryFn: getStudentTestSeries, enabled: !sampleMode, retry: 1, staleTime: 60_000 });
  const attemptsQuery = useQuery({
    queryKey: ["canonical-attempt-history", sessionUser?.id],
    queryFn: () => getUserAttempts(sessionUser?.id),
    enabled: Boolean(sessionUser) && !sampleMode,
    retry: false,
    staleTime: 30_000,
  });
  const examGroups = useMemo(() => buildExamTreeNodes(categories, subcategories, tests), [categories, subcategories, tests]);
  const featuredGroups = examGroups.slice(0, 7);
  const filteredGroups = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return featuredGroups;
    return featuredGroups.filter((group) => `${group.name} ${group.subcategories.map((item) => item.name).join(" ")}`.toLowerCase().includes(needle));
  }, [featuredGroups, query]);
  const allSeries = sampleMode ? SAMPLE_HOME_SERIES : (seriesQuery.data?.series ?? []);
  const popularSeries = useMemo(() => [...allSeries].filter((series) => seriesMatchesFilter(series, seriesFilter)).sort((left, right) => Number(right.attemptCount ?? 0) - Number(left.attemptCount ?? 0)).slice(0, 4), [allSeries, seriesFilter]);
  const activeSession = useMemo(
    () => Object.values(getActiveTestSessions()).sort((left, right) => right.updatedAt - left.updatedAt)[0] ?? null,
    [sessionUser],
  );
  const latestAttempt = useMemo(
    () => [...(attemptsQuery.data ?? [])].sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())[0] ?? null,
    [attemptsQuery.data],
  );
  const loggedInHero = useMemo(() => {
    const firstName = sessionUser?.name?.trim().split(/\s+/)[0] || "there";
    const recommendedSeries = popularSeries[0] ?? null;
    const action = activeSession
      ? { label: "Resume test", href: `/test/${activeSession.testId}`, detail: activeSession.testName }
      : { label: "Continue preparation", href: "/dashboard", detail: latestAttempt ? `Review your latest ${latestAttempt.category || "test"} attempt` : "Choose your next test and keep moving" };
    return { firstName, recommendedSeries, action };
  }, [activeSession, latestAttempt, popularSeries, sessionUser?.name]);
  const totalTests = tests.length;
  const totalCategories = categories.length;
  useEffect(() => {
    const refresh = () => setSessionUser(getUser());
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, []);
  const handleGoogleSignIn = async () => {
    if (googleSignInPending) return;
    setGoogleSignInPending(true);
    try { const user = await signInWithGoogle(); setSessionUser(user); setLocation("/dashboard"); }
    catch (error) { toast({ title: "Google sign-in failed", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" }); }
    finally { setGoogleSignInPending(false); }
  };

  if (!sampleMode && catalog.error) {
    return <div className="home-state-card"><h1>Could not load ExamTree</h1><p>The published exam catalog is temporarily unavailable.</p><button type="button" onClick={() => window.location.reload()}>Try again</button></div>;
  }

  if (!sampleMode && catalog.isLoading) {
    return <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8" role="status" aria-label="Loading ExamTree home"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <div key={index} className="skeleton-shimmer h-36 rounded-2xl" />)}</div><span className="sr-only">Loading published exam pathways…</span></div>;
  }

  return (
    <div className="home-page" data-testid="home-reference">
      {sampleMode ? <div className="border-b border-amber-200 bg-amber-50 text-amber-950" data-testid="home-sample-preview-badge"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 text-xs sm:px-6 lg:px-8"><span><strong>Sample data preview.</strong> Visual-only catalog data.</span><button type="button" className="min-h-10 rounded-lg px-3 font-bold hover:bg-amber-100" onClick={() => setLocation("/")}>Exit preview</button></div></div> : null}

      <section className={sessionUser ? "home-hero home-hero-member" : "home-hero home-hero-guest"} data-testid="home-hero">
        <div className="hero-glow one" /><div className="hero-glow two" />
        <div className="hero-copy">
          {sessionUser ? <>
            <span className="hero-badge"><Sparkles size={14} /> YOUR PREPARATION</span>
            <h1>Welcome back, {loggedInHero.firstName}.<br /><span>Keep moving forward.</span></h1>
            <p>{loggedInHero.action.detail}. Your saved progress and next steps are ready when you are.</p>
            <div className="home-member-actions">
              <button type="button" className="home-member-primary" onClick={() => setLocation(loggedInHero.action.href)}>{loggedInHero.action.label} <ArrowRight /></button>
              <button type="button" className="home-member-secondary" onClick={() => setLocation("/dashboard")}>View dashboard</button>
            </div>
            <div className="home-member-summary" aria-label="Your preparation summary">
              <div><span>Current focus</span><b>{activeSession?.category || loggedInHero.recommendedSeries?.examName || "Choose an exam"}</b></div>
              <div><span>Next recommended</span><b>{activeSession?.testName || loggedInHero.recommendedSeries?.name || "Browse a test"}</b></div>
              <div><span>Latest score</span><b>{latestAttempt ? `${Math.round(latestAttempt.score)}%` : "Start a test"}</b></div>
            </div>
          </> : <>
            <span className="hero-badge"><Users size={14} /> 5,00,000+ aspirants trust Examtree</span>
            <h1>Practice Today<br />for a <span>Brighter Tomorrow</span></h1>
            <p>Take exam-like tests, learn from detailed explanations and improve your rank with personalised insights.</p>
            <form className="search-box" onSubmit={(event) => { event.preventDefault(); document.getElementById("exams")?.scrollIntoView({ behavior: "smooth" }); }} role="search">
              <Search aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search SSC, Banking, Railways, Punjab Govt..." aria-label="Search exams" /><button type="submit">Find tests</button>
            </form>
            {query ? <div className="search-results">{filteredGroups.length ? filteredGroups.slice(0, 4).map((group) => <button key={group.id} type="button" onClick={() => setLocation(sampleMode ? "/exams?preview=sample" : `/category/${group.id}`)}><CategoryIcon icon={group.icon} /><span><b>{group.name}</b><small>{group.subcategories.slice(0, 3).map((item) => item.name).join(" · ") || "Mock tests and practice"}</small></span><ChevronRight /></button>) : <p>No exams found. Try “SSC” or “Banking”.</p>}</div> : null}
            
            <div className="hero-benefits"><span><BookOpen /> Exam-like Mock Tests</span><span><BarChart3 /> Detailed Performance Analysis</span><span><Sparkles /> Topic-wise Practice</span><span><CheckCircle2 /> Updated Syllabus &amp; Pattern</span></div>
          </>}
        </div>
        <div className="hero-visual" aria-label="Performance dashboard preview"><div className="dashboard-card"><div className="dash-top"><span><span className="tiny-mark">E</span> Test analysis</span><Bell size={17} /></div><div className="score-panel"><div className="rank-ring"><span><b>92</b>/100</span></div><div><small>Your score</small><h3>Excellent work!</h3><p><Trophy size={14} /> You&apos;re in the top 3%</p></div></div><div className="dash-stats"><div><span>Accuracy</span><b>91.4%</b><em className="up">+8.2%</em></div><div><span>Percentile</span><b>97.1</b><em className="up">+4.5</em></div><div><span>Time saved</span><b>08:42</b><em>minutes</em></div></div><div className="progress-title"><span>Subject performance</span><b>View report</b></div>{[["Reasoning", 92, "#3156d9"], ["Quantitative Aptitude", 78, "#ed7a2f"], ["English", 86, "#0ea875"]].map(([name, value, color]) => <div className="subject" key={String(name)}><span>{name}</span><div><i style={{ width: `${value}%`, background: String(color) }} /></div><b>{value}%</b></div>)}</div><div className="float-card live"><i /><span><b>Live test</b><small>Taking place now</small></span><Play size={18} fill="currentColor" /></div><div className="float-card streak"><Award size={24} /><span><b>7 day streak!</b><small>Keep it going</small></span></div></div>{!sessionUser ? <aside className="hero-auth-panel" data-testid="home-hero-auth-card"><div className="hero-auth-card"><h2>Get started with Examtree</h2><p>Access free tests, study material and personalised learning.</p><button type="button" className="hero-google-login" data-testid="home-google-login" onClick={() => void handleGoogleSignIn()} disabled={googleSignInPending}><Chrome aria-hidden="true" />{googleSignInPending ? "Connecting…" : "Continue with Google"}</button><div className="hero-auth-divider"><span>or</span></div><button type="button" className="hero-email-login" onClick={() => setLocation("/login")}>Continue with email</button><p className="hero-login-copy">Already have an account? <button type="button" onClick={() => setLocation("/login")}>Login</button></p><div className="hero-auth-perks"><span><CheckCircle2 /> Free tests</span><span><BookOpen /> Study material</span><span><Sparkles /> Personalised learning</span></div></div></aside> : null}
      </section>

      <section className="proof-bar"><div><b>{formatCount(Math.max(totalTests * 18, 1000))}</b><span>Questions in catalog</span></div><div><b>{formatCount(totalTests)}</b><span>Published tests</span></div><div><b>{formatCount(totalCategories)}</b><span>Exam categories</span></div><div><b>12</b><span>Languages supported</span></div></section>

      <section className="section series-section" id="test-series" data-testid="home-popular-series"><div className="section-head"><div><span className="eyebrow">SELECTED FOR YOUR PREPARATION</span><h2>Featured Test Series</h2><p>Structured mock-test series built around the latest exam pattern.</p></div><div className="pills" aria-label="Test series filters">{SERIES_FILTERS.map((filter) => <button key={filter} type="button" className={seriesFilter === filter ? "active" : ""} aria-pressed={seriesFilter === filter} onClick={() => setSeriesFilter(filter)}>{filter}</button>)}</div></div>{popularSeries.length ? <div className="series-grid">{popularSeries.map((series, index) => { const comingSoon = series.learnerVisibility === "coming_soon"; return <article className="series-card" key={series.id}><div className="series-top"><div className={`series-icon tone-${index}`}>{series.iconUrl ? <CategoryIcon icon={series.iconUrl} /> : <BookOpen />}</div><span className="badge">{comingSoon ? "COMING SOON" : SERIES_BADGES[index]}</span></div><h3>{series.name}</h3><div className="series-meta">{comingSoon ? <span><Clock3 />Content in preparation</span> : <span><BookOpen />{formatCount(series.testCount)} total tests</span>}<span><Users />{formatCount(series.attemptCount)} users</span></div>{comingSoon && <p className="mt-3 text-sm text-slate-500">{series.learnerMessage || "Tests are being prepared. No questions are available yet."}</p>}<div className="series-bottom"><span>{comingSoon ? <><Clock3 /> No questions yet</> : <><CheckCircle2 /> {formatCount(series.liveTestCount)} free tests</>}</span><button type="button" onClick={() => setLocation(`/test-series/${series.id}`)}>{comingSoon ? "View details" : "View series"} <ArrowRight /></button></div></article>; })}</div> : <div className="home-empty-card">No published test series match this filter yet.</div>}</section>

      <section className="section compact-exams" id="exams" data-testid="home-exam-categories"><div className="section-head compact-exams-head reference-section-head"><div><h2>Explore by Exam</h2></div><button type="button" onClick={() => setLocation("/exams")}>View All Exams <ArrowRight size={16} /></button></div><div className="exam-grid compact-exam-grid reference-exam-grid">{REFERENCE_EXAMS.map((item, index) => { const group = featuredGroups[index]; return <button key={item.name} type="button" onClick={() => group ? setLocation(sampleMode ? "/exams?preview=sample" : `/category/${group.id}`) : setLocation("/exams")} className={`exam-card compact-exam-card ${CATEGORY_TONES[index % CATEGORY_TONES.length]}`}><div className="exam-icon">{group ? <CategoryIcon icon={group.icon} /> : <BookOpen />}</div><div><h3>{item.name}</h3><p>{item.detail}</p></div>{index === 0 ? <span className="reference-exam-arrow"><ChevronRight /></span> : null}</button>; })}</div></section>

      <section className="feature-wrap" id="features" data-testid="home-examtree-edge"><div className="feature-copy"><h2>Why Choose Examtree</h2><div className="feature-list"><div><Award /><span><b>Exam-oriented content</b><small>Designed as per latest pattern</small></span></div><div><BookOpen /><span><b>Detailed explanations</b><small>Learn concepts with every test</small></span></div><div><Users /><span><b>Bilingual support</b><small>English, Hindi &amp; Punjabi</small></span></div><div><Sparkles /><span><b>Personalised learning</b><small>Practice that adapts to your progress</small></span></div></div></div><div className="insight-card"><div className="insight-head"><div><span>Weekly insight</span><b>Your learning curve</b></div><span className="growth">↗ 18.6%</span></div><div className="chart"><span className="axis a">100</span><span className="axis b">75</span><span className="axis c">50</span><svg viewBox="0 0 520 190" role="img" aria-label="Score improving through the week"><defs><linearGradient id="site-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3156d9" stopOpacity=".25" /><stop offset="1" stopColor="#3156d9" stopOpacity="0" /></linearGradient></defs><path className="area" d="M20 160 C85 148 90 120 155 127 S240 95 295 105 S370 77 405 83 S465 38 505 31 L505 190 L20 190Z" /><path className="line" d="M20 160 C85 148 90 120 155 127 S240 95 295 105 S370 77 405 83 S465 38 505 31" /><circle cx="505" cy="31" r="6" /></svg><div className="days"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div></div><div className="insight-note"><Sparkles /><span><b>You&apos;re improving faster</b><small>Your practice stays visible across every attempt.</small></span><ChevronRight /></div></div></section>

      <section className="cta" data-testid="home-final-cta"><div><span><Trophy /> Your next best score starts here</span><h2>Ready to move ahead<br />of the competition?</h2><p>Start with a free mock test. No payment required.</p><button type="button" onClick={() => setLocation("/mock-tests")}>Start practising free <ArrowRight /></button></div><div className="cta-score"><div><small>YOUR NEXT MILESTONE</small><b>Keep climbing</b><p><CheckCircle2 /> Personalised study plan</p><p><CheckCircle2 /> Published mock tests</p><p><CheckCircle2 /> Detailed solutions</p></div></div></section>
    </div>
  );
}
