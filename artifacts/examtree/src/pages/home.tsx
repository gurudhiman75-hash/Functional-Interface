import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
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
  Newspaper,
  Target,
} from "lucide-react";

import { ExamCollectionBanner } from "@/components/ExamCollectionBanner";
import { EXAM_COLLECTIONS } from "@/lib/exam-collections";
import { CategoryIcon } from "@/components/CategoryIcon";
import { ExamIdentityIcon } from "@/components/ExamIdentityIcon";
import { buildExamTreeNodes } from "@/lib/exam-tree";
import {
  SAMPLE_HOME_CATEGORIES,
  SAMPLE_HOME_SUBCATEGORIES,
  SAMPLE_HOME_TESTS,
} from "@/lib/home-sample-data";
import { useExamCatalog } from "@/providers/ExamCatalogProvider";
import { signInWithGoogle } from "@/lib/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { getPreparationPreferences } from "@/lib/preparation";
import { getStudentTestSeries } from "@/lib/test-series";
import { getUser, type User } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { examHubHrefForCatalogExam } from "@/lib/seo-practice";
import "@/styles/home-section-rhythm.css";


const formatCount = (count: number) => new Intl.NumberFormat("en-IN").format(Math.max(0, count || 0));

const KNOWN_EXAM_HUB_ROUTES: Record<string, string> = {
  "ssc cgl": "/ssc-cgl",
  "ssc chsl": "/ssc-chsl",
  "ssc mts": "/ssc-mts",
  "ssc cpo": "/ssc-cpo",
  "ssc gd": "/ssc-gd",
  "ssc stenographer": "/ssc-stenographer",
  "ssc selection post": "/ssc-selection-post",
  "ssc je": "/ssc-je",
  "ibps po": "/ibps-po",
  "ibps clerk": "/ibps-clerk",
  "ibps rrb po": "/ibps-rrb-po",
  "ibps rrb clerk": "/ibps-rrb-office-assistant",
  "ibps rrb office assistant": "/ibps-rrb-office-assistant",
  "sbi po": "/sbi-po",
  "sbi clerk": "/sbi-clerk",
  "rbi assistant": "/rbi-assistant",
  "rbi grade b": "/rbi-grade-b",
  "punjab patwari": "/punjab-patwari",
  "punjab pcs": "/punjab-pcs",
  "psssb clerk": "/psssb-clerk",
  "psssb senior assistant": "/psssb-senior-assistant",
  "psssb vdo": "/psssb-vdo",
  "punjab police constable": "/punjab-police-constable",
  "punjab police si": "/punjab-police-si",
};

function normalizeExamRouteName(value: string) {
  return value
    .toLowerCase()
    .replace(/\b20\d{2}\b/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function resolveHomepageExamHref(id: string | undefined, name: string, fallback: string) {
  return examHubHrefForCatalogExam(id)
    ?? examHubHrefForCatalogExam(name)
    ?? KNOWN_EXAM_HUB_ROUTES[normalizeExamRouteName(name)]
    ?? fallback;
}

const EXAM_TAB_DEFINITIONS = [
  { key: "ssc", label: "SSC", aliases: ["ssc"], fallback: ["SSC CGL", "SSC CHSL", "SSC MTS", "SSC CPO", "SSC GD", "SSC Stenographer", "SSC Selection Post", "SSC JE"] },
  { key: "banking", label: "Banking", aliases: ["banking", "bank"], fallback: ["IBPS PO", "IBPS Clerk", "SBI PO", "SBI Clerk", "RBI Assistant", "RBI Grade B", "IBPS RRB PO", "IBPS RRB Clerk"] },
  { key: "punjab", label: "Punjab Govt.", aliases: ["punjab"], fallback: ["PSSSB", "Punjab Patwari", "Punjab Police", "Punjab PCS", "PSPCL", "Punjab Teaching", "Cooperative Bank", "PPSC"] },
  { key: "railway", label: "Railway", aliases: ["railway", "railways", "rrb"], fallback: ["RRB NTPC", "RRB Group D", "RRB ALP", "RRB JE", "RPF Constable", "RPF SI", "RRB Technician", "Railway Apprentice"] },
  { key: "state", label: "State Exams", aliases: ["state"], fallback: ["State PSC", "State Police", "State Clerk", "State Patwari", "State JE", "State Teaching", "State Group C", "State Group D"] },
  { key: "teaching", label: "Teaching", aliases: ["teaching", "teacher"], fallback: ["CTET", "Punjab TET", "REET", "DSSSB Teaching", "KVS", "NVS", "UGC NET", "Teaching Aptitude"] },
  { key: "defence", label: "Defence", aliases: ["defence", "defense"], fallback: ["NDA", "CDS", "AFCAT", "Agniveer", "Army GD", "Navy SSR", "Airforce Group Y", "CAPF"] },
  { key: "insurance", label: "Insurance", aliases: ["insurance"], fallback: ["LIC AAO", "LIC ADO", "NIACL AO", "NIACL Assistant", "UIIC AO", "UIIC Assistant", "NICL AO", "Insurance Assistant"] },
] as const;

const FREE_PRACTICE = [
  { title: "Question Practice", copy: "Browse available mock tests", icon: Target, href: "/mock-tests", className: "blue" },
  { title: "Current Affairs", copy: "Stay updated with latest news", icon: Newspaper, href: "/current-affairs", className: "orange" },
  { title: "Previous Year Questions", copy: "Real exam questions", icon: BookOpen, href: "/pyqs", className: "mint" },
  { title: "Topic Practice", copy: "Practice by topic and subtopic", icon: Target, href: "/mock-tests", className: "rose" },
  { title: "Free Mock Tests", copy: "Full-length tests", icon: CheckCircle2, href: "/mock-tests", className: "violet" },
] as const;

export default function Home() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const catalog = useExamCatalog();
  const sampleMode = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("preview") === "sample";
  const [query, setQuery] = useState("");
  const heroPreviewRef = useRef<HTMLDivElement>(null);
  const [sessionUser, setSessionUser] = useState<User | null>(() => (typeof window === "undefined" ? null : getUser()));
  const [googleSignInPending, setGoogleSignInPending] = useState(false);
  const [activeExamTab, setActiveExamTab] = useState("all");
  const categories = sampleMode ? SAMPLE_HOME_CATEGORIES : catalog.categories;
  const subcategories = sampleMode ? SAMPLE_HOME_SUBCATEGORIES : catalog.subcategories;
  const tests = sampleMode ? SAMPLE_HOME_TESTS : catalog.tests;
  const examGroups = useMemo(() => buildExamTreeNodes(categories, subcategories, tests), [categories, subcategories, tests]);
  const seriesQuery = useQuery({ queryKey: ["student-test-series"], queryFn: getStudentTestSeries, enabled: !sampleMode, staleTime: 30_000, retry: 1 });
  const featuredSeries = (seriesQuery.data?.series ?? [])
    .filter((series) => series.learnerVisibility === "live" && series.liveTestCount > 0)
    .sort((left, right) => right.attemptCount - left.attemptCount || right.liveTestCount - left.liveTestCount)
    .slice(0, 6);
  const featuredGroups = examGroups.slice(0, 12);
  const filteredGroups = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return featuredGroups;
    return featuredGroups.filter((group) => `${group.name} ${group.subcategories.map((item) => item.name).join(" ")}`.toLowerCase().includes(needle));
  }, [featuredGroups, query]);
  const activeExamDefinition = EXAM_TAB_DEFINITIONS.find((tab) => tab.key === activeExamTab) ?? EXAM_TAB_DEFINITIONS[0];
  const matchingExamGroups = activeExamTab === "all"
    ? examGroups
    : examGroups.filter((group) => activeExamDefinition.aliases.some((alias) => group.name.toLowerCase().includes(alias)));
  const activeExamItems = matchingExamGroups.length > 0
    ? matchingExamGroups.flatMap((group) => {
        const definition = EXAM_TAB_DEFINITIONS.find((tab) => tab.aliases.some((alias) => group.name.toLowerCase().includes(alias)));
        return group.subcategories.length > 0 ? group.subcategories.map((item) => ({
          id: item.id, name: item.name, category: group.name, testCount: item.tests.length,
          definition: definition ?? activeExamDefinition,
          href: resolveHomepageExamHref(item.id, item.name, `/subcategory/${item.id}?category=${encodeURIComponent(group.id)}`),
        })) : [{ id: `category-${group.id}`, name: group.name, category: group.name, testCount: group.tests.length,
          definition: definition ?? activeExamDefinition, href: `/category/${encodeURIComponent(group.id)}` }];
      })
    : (sampleMode ? (activeExamTab === "all" ? EXAM_TAB_DEFINITIONS : [activeExamDefinition]) : []).flatMap((definition) =>
        definition.fallback.map((name, index) => ({
          id: `fallback-${definition.key}-${index}`, name, category: definition.label, testCount: 0,
          definition, href: resolveHomepageExamHref(undefined, name, "/exams"),
        }))
      );
  const visibleExamItems = activeExamItems.filter((item) =>
    `${item.name} ${item.category}`.toLowerCase().includes(query.trim().toLowerCase())
  );
  useEffect(() => {
    const preview = heroPreviewRef.current;
    if (!preview) return;
    const fitPreview = () => {
      preview.style.setProperty("--hero-preview-scale", String(Math.min(1, preview.clientWidth / 430)));
    };
    fitPreview();
    const observer = new ResizeObserver(fitPreview);
    observer.observe(preview);
    return () => observer.disconnect();
  }, [sessionUser]);

  useEffect(() => {
    if (sessionUser) {
      let active = true;
      const routeSignedInUser = async () => {
        let destination = sessionUser.role === "admin" ? "/admin/" : "/dashboard";
        if (sessionUser.role === "student" && getFirebaseAuth()) {
          try {
            const preferences = await getPreparationPreferences();
            if (!preferences.onboardingCompleted) destination = "/preparation?next=%2Fdashboard";
          } catch {
            // The preparation page offers a retry and safe skip path during an API outage.
            destination = "/preparation?next=%2Fdashboard";
          }
        }
        if (active) setLocation(destination);
      };
      void routeSignedInUser();
      return () => { active = false; };
    }
    const refresh = () => setSessionUser(getUser());
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, [sessionUser, setLocation]);
  if (sessionUser) return null;

  const handleGoogleSignIn = async () => {
    if (googleSignInPending) return;
    setGoogleSignInPending(true);
    try { const user = await signInWithGoogle(); setSessionUser(user); }
    catch (error) { toast({ title: "Google sign-in failed", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" }); }
    finally { setGoogleSignInPending(false); }
  };

  return (
    <div className="home-page" data-testid="home-reference">
      {sampleMode ? <div className="border-b border-amber-200 bg-amber-50 text-amber-950" data-testid="home-sample-preview-badge"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 text-xs sm:px-6 lg:px-8"><span><strong>Sample data preview.</strong> Visual-only catalog data.</span><button type="button" className="min-h-10 rounded-lg px-3 font-bold hover:bg-amber-100" onClick={() => setLocation("/")}>Exit preview</button></div></div> : null}

      <section className="home-hero home-hero-guest hero-layout-v2" data-testid="home-hero">
        <div className="hero-glow one" /><div className="hero-glow two" />
        <div className="hero-primary">
          <div className="hero-copy">
            <span className="hero-badge"><Users size={14} /> Exam-focused practice at your fingertips</span>
            <h1>Practice Today<br />for a <span>Brighter Tomorrow</span></h1>
            <p>Take exam-like tests, learn from detailed explanations and review your results and keep improving.</p>
          </div>

          <div ref={heroPreviewRef} className="hero-visual" aria-label="Illustrative mock test interface preview">
            <div className="dashboard-card mock-device"><span className="sr-only">Illustrative example: scores and ranks shown here are not real user data.</span>
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
              <button className="mock-next" type="button" onClick={() => setLocation("/mock-tests")}>Next <ArrowRight /></button>
            </div>
          </div>

          <div className="hero-search-zone">
            <form className="search-box" onSubmit={(event) => { event.preventDefault(); document.getElementById("exams")?.scrollIntoView({ behavior: "smooth" }); }} role="search">
              <Search aria-hidden="true" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search SSC, Banking, Railways, Punjab Govt..." aria-label="Search exams" />
              <button type="submit">Find Tests</button>
            </form>
            {query ? <div className="search-results">{filteredGroups.length ? filteredGroups.slice(0, 4).map((group) => <button key={group.id} type="button" onClick={() => setLocation(sampleMode ? "/exams?preview=sample" : `/category/${group.id}`)}><CategoryIcon icon={group.icon} /><span><b>{group.name}</b><small>{`${formatCount(group.tests.length)} tests · ${group.subcategories.slice(0, 3).map((item) => item.name).join(" · ") || "Explore category"}`}</small></span><ChevronRight /></button>) : <p>No exams found. Try “SSC” or “Banking”.</p>}</div> : null}
            <div className="hero-benefits"><span><BookOpen /> Exam-like Mock Tests</span><span><BarChart3 /> Review saved results</span><span><Sparkles /> Topic-wise Practice</span><span><CheckCircle2 /> Exam preparation guides</span></div>
          </div>
        </div>

        <aside className="hero-auth-panel dark-auth-panel" data-testid="home-hero-auth-card">
          <div className="hero-auth-card dark-auth-card">
            <span className="dark-auth-eyebrow">START FREE</span>
            <h2>Get started with Examtree</h2>
            <p>Access free tests, study material and personalised learning.</p>
            <button type="button" className="hero-google-login dark-google-login" data-testid="home-google-login" onClick={() => void handleGoogleSignIn()} disabled={googleSignInPending}>
              <span className="google-g" aria-hidden="true">G</span>
              <span>{googleSignInPending ? "Connecting…" : "Continue with Google"}</span>
              <ArrowRight className="google-arrow" aria-hidden="true" />
            </button>
            <div className="hero-auth-divider"><span>or</span></div>
            <button type="button" className="hero-email-login dark-email-login" onClick={() => setLocation("/login")}>Continue with email</button>
            <p className="hero-login-copy">Already have an account? <button type="button" onClick={() => setLocation("/login")}>Login</button></p>
            <div className="hero-auth-perks"><span><CheckCircle2 /> Free tests</span><span><BookOpen /> Study material</span><span><Sparkles /> Personalised learning</span></div>
          </div>
        </aside>
      </section>

      <section className="warm-featured-band" id="test-series" data-testid="home-popular-series">
        <div className="warm-section-head">
          <div><span className="warm-kicker"><Trophy /> Featured</span><h2>Featured Test Series</h2><p>Published test series with available practice.</p></div>
          <button type="button" onClick={() => setLocation("/exams")}>View All <ArrowRight /></button>
        </div>
        {seriesQuery.isPending && !sampleMode ? <div role="status" className="exam-empty-state">Loading published test series…</div>
          : seriesQuery.isError ? <div className="exam-empty-state" role="alert">Test series are temporarily unavailable. <button type="button" onClick={() => void seriesQuery.refetch()}>Try again</button></div>
          : featuredSeries.length ? <div className="featured-marquee" aria-label="Published featured test series">
          <div className="featured-marquee-track">
            {[...featuredSeries, ...featuredSeries].map((series, index) => (
              <button key={`${series.id}-${index}`} type="button" className="featured-strip-card" onClick={() => setLocation(`/test-series/${encodeURIComponent(series.id)}`)}>
                <span className="featured-strip-logo"><ExamIdentityIcon name={series.examName} icon={series.iconUrl} examCode={series.examCode} familyCode={series.examFamilyCode} /></span>
                <span className="featured-strip-copy"><b>{series.name}</b><small>{series.examName}</small><em>{formatCount(series.attemptCount)} attempts</em></span>
                <span className="featured-strip-price"><strong>{formatCount(series.liveTestCount)} live tests</strong></span>
                <ChevronRight />
              </button>
            ))}
          </div>
        </div> : <div className="exam-empty-state">No published test series are available yet. <button type="button" onClick={() => setLocation("/exams")}>Browse exams</button></div>}

      </section>

      <section className="warm-exam-catalog" id="exams" data-testid="home-exam-categories">
        <div className="warm-section-head">
          <div><span className="warm-kicker"><BookOpen /> Discover</span><h2>Explore Exams</h2><p>Choose a category and jump directly to the exam you are preparing for.</p></div>
          <button type="button" onClick={() => setLocation("/exams")}>View All Exams <ArrowRight /></button>
        </div>
        <div className="exam-switcher" role="tablist" aria-label="Exam categories">
          <button type="button" role="tab" aria-selected={activeExamTab === "all"} className={activeExamTab === "all" ? "active" : ""} onClick={() => setActiveExamTab("all")}>All</button>
          {EXAM_TAB_DEFINITIONS.map((tab) => (
            <button key={tab.key} type="button" role="tab" aria-selected={activeExamTab === tab.key} className={activeExamTab === tab.key ? "active" : ""} onClick={() => setActiveExamTab(tab.key)}>{tab.label}</button>
          ))}
        </div>
        <div className="direct-exam-grid" data-testid="home-direct-exam-grid">
          {visibleExamItems.map((item) => (
            <button key={item.id} type="button" className="direct-exam-card" onClick={() => setLocation(item.href)} title={item.name}>
              <span className="direct-exam-logo">
                <ExamIdentityIcon
                  name={item.name}
                  examCode={item.id.startsWith("fallback-") ? undefined : item.id}
                  familyCode={item.definition.key}
                />
              </span>
              <span className="direct-exam-copy"><b>{item.name}</b><small>{item.category}{item.testCount > 0 ? ` · ${formatCount(item.testCount)} ${item.testCount === 1 ? "test" : "tests"}` : ""}</small></span>
              <span className="direct-exam-go"><ChevronRight /></span>
            </button>
          ))}
        </div>
        {visibleExamItems.length === 0 ? <p className="exam-empty-state">No exams found. Try another search or category.</p> : null}
      </section>

      <section className="warm-collections-band" id="collections" data-testid="home-exam-collections">
        <div className="warm-section-head">
          <div><span className="warm-kicker"><Sparkles /> Find your direction</span><h2>Explore Exam Collections</h2><p>Choose by your qualification, career goals or the preparation you already share.</p></div>
        </div>
        <div className="exam-collection-banners">
          {EXAM_COLLECTIONS.map((collection) => <ExamCollectionBanner key={collection.slug} collection={collection} />)}
        </div>
      </section>

      <section className="warm-free-practice">
        <div className="warm-section-head">
          <div><span className="warm-kicker"><Target /> Free practice</span><h2>Start Practising for Free</h2><p>Useful practice entry points without the clutter.</p></div>
        </div>
        <div className="free-practice-grid">
          {FREE_PRACTICE.map((item) => (
            <button key={item.title} type="button" className={`free-practice-card ${item.className}`} onClick={() => setLocation(item.href)}>
              <span className="free-practice-icon"><item.icon /></span>
              <span><b>{item.title}</b><small>{item.copy}</small></span>
              <ChevronRight />
            </button>
          ))}
        </div>
      </section>

      <section className="feature-wrap" id="features" data-testid="home-examtree-edge"><div className="feature-copy"><h2>Why Choose Examtree</h2><div className="feature-list"><div><Monitor /><span><b>Real exam-like interface</b><small>Clean test experience built to feel familiar on exam day</small></span></div><div><BarChart3 /><span><b>Saved attempt history</b><small>Review scores and mistakes from completed attempts</small></span></div><div><Sparkles /><span><b>Personalised recommendations</b><small>Explore mock tests and revise your weaker topics</small></span></div><div><BookOpen /><span><b>Clear detailed explanations</b><small>Understand mistakes quickly with simple, useful solutions</small></span></div></div></div><div className="insight-card"><div className="insight-head"><div><span>Illustrative example</span><b>How progress can look</b></div><span className="growth">Example</span></div><div className="chart"><span className="axis a">100</span><span className="axis b">75</span><span className="axis c">50</span><svg viewBox="0 0 520 190" role="img" aria-label="Score improving through the week"><defs><linearGradient id="site-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3156d9" stopOpacity=".25" /><stop offset="1" stopColor="#3156d9" stopOpacity="0" /></linearGradient></defs><path className="area" d="M20 160 C85 148 90 120 155 127 S240 95 295 105 S370 77 405 83 S465 38 505 31 L505 190 L20 190Z" /><path className="line" d="M20 160 C85 148 90 120 155 127 S240 95 295 105 S370 77 405 83 S465 38 505 31" /><circle cx="505" cy="31" r="6" /></svg><div className="days"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div></div><div className="insight-note"><Sparkles /><span><b>Review and improve</b><small>Your practice stays visible across every attempt.</small></span><ChevronRight /></div></div></section>

      <section className="cta" data-testid="home-final-cta"><div><span><Trophy /> Your next best score starts here</span><h2>Ready to move ahead<br />of the competition?</h2><p>Start with a free mock test. No payment required.</p><button type="button" onClick={() => setLocation("/mock-tests")}>Start practising free <ArrowRight /></button></div><div className="cta-score"><div><small>YOUR NEXT MILESTONE</small><b>Keep climbing</b><p><CheckCircle2 /> Choose your exam</p><p><CheckCircle2 /> Published mock tests</p><p><CheckCircle2 /> Detailed solutions</p></div></div></section>
    </div>
  );
}
