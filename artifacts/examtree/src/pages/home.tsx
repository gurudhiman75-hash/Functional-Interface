import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Search,
  Sparkles,
  Monitor,
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
import { getUser, type User } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import "@/styles/home-section-rhythm.css";

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

const HOME_CATEGORY_ICONS: Record<string, string> = {
  "SSC": "/category-icons/ssc-official.svg",
  "Banking": "/category-icons/rbi-official.svg",
  "Punjab Govt.": "/category-icons/punjab-official.svg",
  "State Govt.": "/category-icons/punjab-official.svg",
  "Railways": "/category-icons/railways-official.svg",
};

const HOME_SERIES_ICONS = [
  "/category-icons/sbi-official.svg",
  "/category-icons/ssc-official.svg",
  "/category-icons/punjab-official.svg",
  "/category-icons/ibps-official.svg",
] as const;

function formatCount(value: number) {
  const safe = Math.max(0, Number(value) || 0);
  if (safe >= 1000000) return `${(safe / 1000000).toFixed(1)}M`;
  if (safe >= 1000) return `${(safe / 1000).toFixed(safe >= 10000 ? 0 : 1)}k`;
  return new Intl.NumberFormat("en-IN").format(safe);
}

export default function Home() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const catalog = useExamCatalog();
  const sampleMode = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("preview") === "sample";
  const [query, setQuery] = useState("");
  const [sessionUser, setSessionUser] = useState<User | null>(() => (typeof window === "undefined" ? null : getUser()));
  const [googleSignInPending, setGoogleSignInPending] = useState(false);
  const categories = sampleMode ? SAMPLE_HOME_CATEGORIES : catalog.categories;
  const subcategories = sampleMode ? SAMPLE_HOME_SUBCATEGORIES : catalog.subcategories;
  const tests = sampleMode ? SAMPLE_HOME_TESTS : catalog.tests;
  const seriesQuery = useQuery({ queryKey: ["student-test-series", "reference-home"], queryFn: getStudentTestSeries, enabled: !sampleMode, retry: 1, staleTime: 60_000 });
  const examGroups = useMemo(() => buildExamTreeNodes(categories, subcategories, tests), [categories, subcategories, tests]);
  const featuredGroups = examGroups.slice(0, 12);
  const filteredGroups = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return featuredGroups;
    return featuredGroups.filter((group) => `${group.name} ${group.subcategories.map((item) => item.name).join(" ")}`.toLowerCase().includes(needle));
  }, [featuredGroups, query]);
  const allSeries = sampleMode ? SAMPLE_HOME_SERIES : (seriesQuery.data?.series ?? []);
  const popularSeries = useMemo(() => [...allSeries].sort((left, right) => Number(right.attemptCount ?? 0) - Number(left.attemptCount ?? 0)).slice(0, 4), [allSeries]);
  const totalTests = tests.length;
  const totalCategories = categories.length;
  useEffect(() => {
    if (sessionUser) {
      setLocation("/dashboard");
      return;
    }
    const refresh = () => setSessionUser(getUser());
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, [sessionUser, setLocation]);
  if (sessionUser) return null;

  const handleGoogleSignIn = async () => {
    if (googleSignInPending) return;
    setGoogleSignInPending(true);
    try { const user = await signInWithGoogle(); setSessionUser(user); setLocation("/dashboard"); }
    catch (error) { toast({ title: "Google sign-in failed", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" }); }
    finally { setGoogleSignInPending(false); }
  };

  return (
    <div className="home-page" data-testid="home-reference">
      {sampleMode ? <div className="border-b border-amber-200 bg-amber-50 text-amber-950" data-testid="home-sample-preview-badge"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 text-xs sm:px-6 lg:px-8"><span><strong>Sample data preview.</strong> Visual-only catalog data.</span><button type="button" className="min-h-10 rounded-lg px-3 font-bold hover:bg-amber-100" onClick={() => setLocation("/")}>Exit preview</button></div></div> : null}

      <section className="home-hero home-hero-guest" data-testid="home-hero">
        <div className="hero-glow one" /><div className="hero-glow two" />
        <div className="hero-copy">
          <span className="hero-badge"><Users size={14} /> 5,00,000+ aspirants trust Examtree</span>
          <h1>Practice Today<br />for a <span>Brighter Tomorrow</span></h1>
          <p>Take exam-like tests, learn from detailed explanations and improve your rank with personalised insights.</p>
          <form className="search-box" onSubmit={(event) => { event.preventDefault(); document.getElementById("exams")?.scrollIntoView({ behavior: "smooth" }); }} role="search">
            <Search aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search SSC, Banking, Railways, Punjab Govt..." aria-label="Search exams" /><button type="submit">Find Tests</button>
          </form>
          {query ? <div className="search-results">{filteredGroups.length ? filteredGroups.slice(0, 4).map((group) => <button key={group.id} type="button" onClick={() => setLocation(sampleMode ? "/exams?preview=sample" : `/category/${group.id}`)}><CategoryIcon icon={group.icon} /><span><b>{group.name}</b><small>{group.subcategories.slice(0, 3).map((item) => item.name).join(" · ") || "Mock tests and practice"}</small></span><ChevronRight /></button>) : <p>No exams found. Try “SSC” or “Banking”.</p>}</div> : null}
          <div className="hero-benefits"><span><BookOpen /> Exam-like Mock Tests</span><span><BarChart3 /> Detailed Performance Analysis</span><span><Sparkles /> Topic-wise Practice</span><span><CheckCircle2 /> Updated Syllabus &amp; Pattern</span></div>
        </div>
        <div className="hero-visual" aria-label="Mock test interface preview">
          <div className="dashboard-card mock-device">
            <div className="mock-device-top"><span><span className="tiny-mark">E</span> English Language</span><b>◷ 00:24:17</b></div>
            <div className="mock-device-body">
              <div className="mock-question">
                <small>Q. 12 / 20</small>
                <h3>Find the correctly spelt word.</h3>
                {["Accommodate","Accomodate","Acommodate","Accomoddate"].map((option,index)=><div className={`mock-option ${index===0?"selected":""}`} key={option}><span>{String.fromCharCode(65+index)}</span>{option}</div>)}
              </div>
              <div className="mock-palette">
                <h4>Question Palette</h4>
                <div className="mock-legend"><span>Answered</span><span>Current</span><span>Not Visited</span></div>
                <div className="mock-numbers">{Array.from({length:20},(_,i)=><i className={i===11?"current":i<10?"done":""} key={i}>{i+1}</i>)}</div>
                <div className="mock-progress"><span>Your Progress <b>60%</b></span><div><i /></div></div>
                <div className="mock-score"><span>Attempted<b>12/20</b></span><span>Live Rank<b>#248</b></span></div>
              </div>
            </div>
            <button className="mock-next" type="button">Next <ArrowRight /></button>
          </div>
        </div><aside className="hero-auth-panel" data-testid="home-hero-auth-card"><div className="hero-auth-card"><h2>Get started with Examtree</h2><p>Access free tests, study material and personalised learning.</p><button type="button" className="hero-google-login" data-testid="home-google-login" onClick={() => void handleGoogleSignIn()} disabled={googleSignInPending}><span className="google-g" aria-hidden="true">G</span><span>{googleSignInPending ? "Connecting…" : "Continue with Google"}</span><ArrowRight className="google-arrow" aria-hidden="true" /></button><div className="hero-auth-divider"><span>or</span></div><button type="button" className="hero-email-login" onClick={() => setLocation("/login")}>Continue with email</button><p className="hero-login-copy">Already have an account? <button type="button" onClick={() => setLocation("/login")}>Login</button></p><div className="hero-auth-perks"><span><CheckCircle2 /> Free tests</span><span><BookOpen /> Study material</span><span><Sparkles /> Personalised learning</span></div></div></aside>
      </section>

      <section className="proof-bar"><div><b>{formatCount(Math.max(totalTests * 18, 1000))}</b><span>Questions in catalog</span></div><div><b>{formatCount(totalTests)}</b><span>Published tests</span></div><div><b>{formatCount(totalCategories)}</b><span>Exam categories</span></div><div><b>12</b><span>Languages supported</span></div></section>

      <section className="section series-section" id="test-series" data-testid="home-popular-series"><div className="section-head reference-section-head"><div><h2>Featured Test Series</h2><p>Most popular and exam-focused test series designed by experts.</p></div><button type="button" onClick={() => setLocation("/exams")}>View All <ArrowRight size={16} /></button></div><div className="series-grid reference-series-grid">{REFERENCE_SERIES.map((item, index) => <article className="series-card reference-series-card clean-series-card" key={item.name}><div className="series-top"><div className={`series-icon reference-series-icon clean-series-icon reference-series-icon-${index}`}><img src={HOME_SERIES_ICONS[index]} alt="" /></div></div><div className="clean-series-content"><h3>{item.name}</h3><span className="reference-series-badge">{item.badge}</span><div className="series-meta"><span><BookOpen />{item.tests}</span><span><CheckCircle2 />Bilingual</span></div><div className="reference-price"><strong>{item.price}</strong><del>{item.oldPrice}</del></div></div><button className="reference-series-go" type="button" aria-label={`View ${item.name}`} onClick={() => setLocation("/exams")}><ChevronRight /></button></article>)}</div></section>

      <section className="section compact-exams" id="exams" data-testid="home-exam-categories"><div className="section-head compact-exams-head reference-section-head"><div><h2>Explore by Exam</h2></div><button type="button" onClick={() => setLocation("/exams")}>View All Exams <ArrowRight size={16} /></button></div><div className="clean-exam-shortcuts">{(featuredGroups.length ? featuredGroups : REFERENCE_EXAMS).map((item) => { const group = "id" in item ? item : undefined; const name = group?.name ?? item.name; return <button key={group?.id ?? name} type="button" onClick={() => group ? setLocation(sampleMode ? "/exams?preview=sample" : `/category/${group.id}`) : setLocation("/exams")} className="clean-exam-shortcut"><span className="clean-exam-circle">{HOME_CATEGORY_ICONS[name] ? <img src={HOME_CATEGORY_ICONS[name]} alt="" /> : group ? <CategoryIcon icon={group.icon} /> : <BookOpen />}</span><span className="clean-exam-name" title={name}>{name}</span></button>; })}</div></section>

      <section className="feature-wrap" id="features" data-testid="home-examtree-edge"><div className="feature-copy"><h2>Why Choose Examtree</h2><div className="feature-list"><div><Monitor /><span><b>Real exam-like interface</b><small>Clean test experience built to feel familiar on exam day</small></span></div><div><BarChart3 /><span><b>Smart performance analytics</b><small>See accuracy, speed, weak areas and progress after every test</small></span></div><div><Sparkles /><span><b>Personalised recommendations</b><small>Know what to practise next based on your actual performance</small></span></div><div><BookOpen /><span><b>Clear detailed explanations</b><small>Understand mistakes quickly with simple, useful solutions</small></span></div></div></div><div className="insight-card"><div className="insight-head"><div><span>Weekly insight</span><b>Your learning curve</b></div><span className="growth">↗ 18.6%</span></div><div className="chart"><span className="axis a">100</span><span className="axis b">75</span><span className="axis c">50</span><svg viewBox="0 0 520 190" role="img" aria-label="Score improving through the week"><defs><linearGradient id="site-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3156d9" stopOpacity=".25" /><stop offset="1" stopColor="#3156d9" stopOpacity="0" /></linearGradient></defs><path className="area" d="M20 160 C85 148 90 120 155 127 S240 95 295 105 S370 77 405 83 S465 38 505 31 L505 190 L20 190Z" /><path className="line" d="M20 160 C85 148 90 120 155 127 S240 95 295 105 S370 77 405 83 S465 38 505 31" /><circle cx="505" cy="31" r="6" /></svg><div className="days"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div></div><div className="insight-note"><Sparkles /><span><b>You&apos;re improving faster</b><small>Your practice stays visible across every attempt.</small></span><ChevronRight /></div></div></section>

      <section className="cta" data-testid="home-final-cta"><div><span><Trophy /> Your next best score starts here</span><h2>Ready to move ahead<br />of the competition?</h2><p>Start with a free mock test. No payment required.</p><button type="button" onClick={() => setLocation("/mock-tests")}>Start practising free <ArrowRight /></button></div><div className="cta-score"><div><small>YOUR NEXT MILESTONE</small><b>Keep climbing</b><p><CheckCircle2 /> Personalised study plan</p><p><CheckCircle2 /> Published mock tests</p><p><CheckCircle2 /> Detailed solutions</p></div></div></section>
    </div>
  );
}
