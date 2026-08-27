import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  FileClock,
  FileText,
  Languages,
  LayoutDashboard,
  LogIn,
  Newspaper,
  Quote,
  ShieldCheck,
  Sigma,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";

import { CategoryIcon } from "@/components/CategoryIcon";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";
import { signInWithGoogle } from "@/lib/auth";
import { buildExamTreeNodes } from "@/lib/exam-tree";
import { getFirebaseAuth } from "@/lib/firebase";
import {
  SAMPLE_HOME_CATEGORIES,
  SAMPLE_HOME_SERIES,
  SAMPLE_HOME_SUBCATEGORIES,
  SAMPLE_HOME_TESTS,
} from "@/lib/home-sample-data";
import { getSessionUser } from "@/lib/session-user";
import { getStudentTestSeries, type StudentSeriesSummary } from "@/lib/test-series";
import { useExamCatalog } from "@/providers/ExamCatalogProvider";
import "@/styles/home-section-rhythm.css";

type LearningResourceCategory = "current_affairs" | "notes" | "formula_sheet";
type LearningResourceFormat = "article" | "pdf";

type LearningResource = {
  id: string;
  publicCode: string;
  category: LearningResourceCategory;
  format: LearningResourceFormat;
  title: string;
  summary: string | null;
  languageCode: string;
  contentDate: string | null;
  contentUrl: string | null;
  hasInlineContent?: boolean;
  publishedAt: string;
  isGeneral: boolean;
  exams: Array<{ id: string; code: string; name: string }>;
};

type LearningResourcesResponse = {
  resources: LearningResource[];
  generatedAt: string;
};

type MemberHeroSlide = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  meta: string[];
};

const ACQUISITION_HERO_IMAGE =
  "https://images.pexels.com/photos/4308096/pexels-photo-4308096.jpeg?auto=compress&cs=tinysrgb&w=1400";

const SAMPLE_RESOURCES: LearningResource[] = [
  {
    id: "sample-current-affairs",
    publicCode: "SAMPLE_CA_AUG_2026",
    category: "current_affairs",
    format: "article",
    title: "Current Affairs — August 2026 Weekly Digest",
    summary: "Preview example showing how published current-affairs resources will appear on the homepage.",
    languageCode: "en",
    contentDate: "2026-08-24",
    contentUrl: null,
    hasInlineContent: true,
    publishedAt: "2026-08-24T00:00:00.000Z",
    isGeneral: true,
    exams: [],
  },
  {
    id: "sample-notes",
    publicCode: "SAMPLE_NOTES_QUANT",
    category: "notes",
    format: "pdf",
    title: "Quantitative Aptitude Revision Notes",
    summary: "Preview PDF-style resource for fast revision before practice sessions.",
    languageCode: "en",
    contentDate: "2026-08-20",
    contentUrl: null,
    publishedAt: "2026-08-20T00:00:00.000Z",
    isGeneral: true,
    exams: [],
  },
  {
    id: "sample-formula-sheet",
    publicCode: "SAMPLE_FORMULA_ARITHMETIC",
    category: "formula_sheet",
    format: "pdf",
    title: "Arithmetic Formula Sheet",
    summary: "Preview formula-sheet resource for percentages, ratio, averages and related topics.",
    languageCode: "en",
    contentDate: "2026-08-18",
    contentUrl: null,
    publishedAt: "2026-08-18T00:00:00.000Z",
    isGeneral: true,
    exams: [],
  },
];

const SAMPLE_TESTIMONIALS = [
  {
    quote: "I can find the exam path quickly without scrolling through a wall of test cards.",
    name: "Sample learner 01",
    exam: "SSC aspirant",
  },
  {
    quote: "The separation between exam discovery, resources and practice makes the starting point much clearer.",
    name: "Sample learner 02",
    exam: "Banking aspirant",
  },
  {
    quote: "Free notes and current-affairs resources beside the exam catalog would make daily preparation easier to organise.",
    name: "Sample learner 03",
    exam: "State exam aspirant",
  },
] as const;

const RESOURCE_KINDS = [
  {
    key: "current_affairs" as const,
    title: "Current affairs",
    description: "Daily, weekly and monthly updates as they are published.",
    icon: Newspaper,
    tone: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
  },
  {
    key: "notes" as const,
    title: "PDF notes",
    description: "Downloadable revision notes and focused study material.",
    icon: FileText,
    tone: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  },
  {
    key: "formula_sheet" as const,
    title: "Formula sheets",
    description: "Compact revision sheets for formulas and quick recall.",
    icon: Sigma,
    tone: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  },
  {
    key: "pyq" as const,
    title: "Previous-year questions",
    description: "Go directly to the dedicated PYQ discovery experience.",
    icon: FileClock,
    tone: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
] as const;

const FAQS = [
  {
    question: "Where are mock tests and test series now?",
    answer: "The homepage stays focused on discovery, trust and free study resources. The complete live test catalog remains in Exams and Mock Tests.",
  },
  {
    question: "Are the PDFs and current-affairs resources really free?",
    answer: "The homepage resource feed only surfaces learning resources that are published through ExamTree's public learning-resource system. Availability depends on what is currently published.",
  },
  {
    question: "Does ExamTree support Hindi and Punjabi?",
    answer: "Language availability is shown only where the underlying published content supports that language. It can differ between exams and resources.",
  },
  {
    question: "Why are there no made-up learner reviews?",
    answer: "Production testimonials are reserved for feedback that can be attributed and verified. Sample testimonial copy is visible only in the explicit sample-preview mode.",
  },
] as const;

function formatCount(value: number) {
  return new Intl.NumberFormat("en-IN").format(Math.max(0, Number(value) || 0));
}

function initials(value: string) {
  const words = value.trim().split(/\s+/).filter(Boolean);
  return words.length ? words.slice(0, 2).map((word) => word[0]?.toUpperCase()).join("") : "ET";
}

function categoryLabel(category: LearningResourceCategory) {
  if (category === "current_affairs") return "Current affairs";
  if (category === "formula_sheet") return "Formula sheet";
  return "Study notes";
}

function languageLabel(languageCode: string) {
  const normalized = languageCode.trim().toLowerCase();
  if (normalized === "en" || normalized === "english") return "English";
  if (normalized === "hi" || normalized === "hindi") return "Hindi";
  if (normalized === "pa" || normalized === "punjabi") return "Punjabi";
  return languageCode.toUpperCase();
}

function formatResourceDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

async function getLearningResources() {
  return apiRequest<LearningResourcesResponse>("/learning-resources?limit=12");
}

function ExamMark({ name, icon }: { name: string; icon?: string }) {
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border bg-background text-xs font-black text-muted-foreground shadow-sm">
      {icon ? <CategoryIcon icon={icon} className="h-5 w-5 text-primary" /> : initials(name)}
    </span>
  );
}

function seriesToHeroSlide(series: StudentSeriesSummary): MemberHeroSlide {
  return {
    id: `series-${series.id}`,
    eyebrow: `${series.examFamilyName} · ${series.examName}`,
    title: series.name,
    description: series.description || `A published ${series.examName} preparation series ready to continue from your ExamTree workspace.`,
    primaryLabel: "View test series",
    primaryHref: `/test-series/${series.id}`,
    secondaryLabel: "My dashboard",
    secondaryHref: "/dashboard",
    meta: [
      `${formatCount(series.testCount)} tests`,
      `${formatCount(series.questionCount)} questions`,
      ...(Number(series.attemptCount ?? 0) > 0 ? [`${formatCount(Number(series.attemptCount))} attempts`] : []),
    ],
  };
}

export default function Home() {
  const [, setLocation] = useLocation();
  const catalog = useExamCatalog();
  const sampleMode = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("preview") === "sample";
  const [sessionUser, setSessionUser] = useState(() => getSessionUser());
  const [resourceCategory, setResourceCategory] = useState<LearningResourceCategory | null>(null);
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);

  const categories = sampleMode ? SAMPLE_HOME_CATEGORIES : catalog.categories;
  const subcategories = sampleMode ? SAMPLE_HOME_SUBCATEGORIES : catalog.subcategories;
  const tests = sampleMode ? SAMPLE_HOME_TESTS : catalog.tests;

  const resourceQuery = useQuery({
    queryKey: ["public-learning-resources", "home"],
    queryFn: getLearningResources,
    enabled: !sampleMode,
    retry: 1,
    staleTime: 60_000,
  });

  const seriesQuery = useQuery({
    queryKey: ["student-test-series", "home-hero"],
    queryFn: getStudentTestSeries,
    enabled: Boolean(sessionUser) && !sampleMode,
    retry: 1,
    staleTime: 60_000,
  });

  const resources = sampleMode ? SAMPLE_RESOURCES : (resourceQuery.data?.resources ?? []);
  const examGroups = useMemo(() => buildExamTreeNodes(categories, subcategories, tests), [categories, subcategories, tests]);
  const featuredExamGroups = examGroups.slice(0, 8);
  const catalogQuestionCount = tests.reduce((sum, test) => sum + Math.max(0, Number(test.totalQuestions) || 0), 0);
  const publishedLanguageCount = useMemo(() => {
    const languages = new Set<string>();
    for (const test of tests) for (const language of test.languages ?? []) if (language) languages.add(language.toLowerCase());
    return languages.size;
  }, [tests]);
  const visibleResources = useMemo(
    () => resources.filter((resource) => !resourceCategory || resource.category === resourceCategory).slice(0, 6),
    [resourceCategory, resources],
  );

  const memberSeries = sampleMode ? SAMPLE_HOME_SERIES : (seriesQuery.data?.series ?? []);
  const memberHeroSlides = useMemo<MemberHeroSlide[]>(() => {
    const publishedSeriesSlides = [...memberSeries]
      .sort((left, right) => Number(right.attemptCount ?? 0) - Number(left.attemptCount ?? 0))
      .slice(0, 4)
      .map(seriesToHeroSlide);
    if (publishedSeriesSlides.length > 0) return publishedSeriesSlides;

    const fallbackSlides: MemberHeroSlide[] = [
      {
        id: "dashboard",
        eyebrow: "Your ExamTree workspace",
        title: "Pick up your preparation from one focused dashboard.",
        description: "Open your learner workspace for saved activity, recent attempts and the preparation paths already connected to your account.",
        primaryLabel: "Open dashboard",
        primaryHref: "/dashboard",
        secondaryLabel: "Explore exams",
        secondaryHref: "/exams",
        meta: [`${formatCount(examGroups.length)} exam families`, `${formatCount(catalogQuestionCount)} catalog questions`],
      },
      {
        id: "resources",
        eyebrow: "Free resources",
        title: "Use notes, current affairs and formula sheets between mocks.",
        description: "Published learning resources stay separate from the test runner so revision material remains easy to find.",
        primaryLabel: "Browse free resources",
        primaryHref: "#home-free-resources",
        secondaryLabel: "Browse PYQs",
        secondaryHref: "/pyqs",
        meta: [`${formatCount(resources.length)} published resources`, "Current affairs", "PDF notes"],
      },
    ];
    return fallbackSlides;
  }, [catalogQuestionCount, examGroups.length, memberSeries, resources.length]);

  useEffect(() => {
    setHeroSlideIndex(0);
  }, [sessionUser?.id, memberHeroSlides.length]);

  useEffect(() => {
    if (!sessionUser || memberHeroSlides.length <= 1) return;
    const timer = window.setInterval(() => {
      setHeroSlideIndex((current) => (current + 1) % memberHeroSlides.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [memberHeroSlides.length, sessionUser]);

  const goMarketplace = () => setLocation(sampleMode ? "/exams?preview=sample" : "/exams");
  const goCategory = (id: string) => setLocation(sampleMode ? "/exams?preview=sample" : `/category/${id}`);
  const scrollToResources = () => document.getElementById("home-free-resources")?.scrollIntoView({ behavior: "smooth", block: "start" });
  const chooseResourceCategory = (category: LearningResourceCategory) => {
    setResourceCategory(category);
    window.requestAnimationFrame(scrollToResources);
  };
  const navigateHero = (href: string) => {
    if (href === "#home-free-resources") {
      scrollToResources();
      return;
    }
    setLocation(href);
  };

  const handleGoogleLogin = async () => {
    setGoogleError(null);
    if (!getFirebaseAuth()) {
      setLocation("/login/student");
      return;
    }
    setGoogleLoading(true);
    try {
      const user = await signInWithGoogle();
      setSessionUser(user);
      setLocation("/dashboard");
    } catch (error) {
      const code = typeof error === "object" && error !== null && "code" in error ? String((error as { code?: unknown }).code ?? "") : "";
      if (code === "auth/popup-closed-by-user") {
        setGoogleError("Google sign-in was cancelled.");
      } else if (code === "auth/popup-blocked") {
        setGoogleError("Your browser blocked the Google sign-in window. Use Login instead.");
      } else {
        setGoogleError("Google sign-in could not be completed. You can still use the regular login.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  if (!sampleMode && catalog.error) {
    return (
      <div className="mx-auto my-16 max-w-lg rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
        <h1 className="text-xl font-black text-foreground">Could not load ExamTree</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">The published exam catalog is temporarily unavailable.</p>
        <Button className="mt-5 min-h-11" variant="outline" onClick={() => window.location.reload()}>Try again</Button>
      </div>
    );
  }

  if (!sampleMode && catalog.isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-5 px-4 py-8 sm:px-6 lg:px-8" role="status" aria-label="Loading ExamTree home">
        <div className="skeleton-shimmer h-[520px] rounded-[32px]" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div key={index} className="skeleton-shimmer h-24 rounded-2xl" />)}</div>
        <span className="sr-only">Loading published exam pathways…</span>
      </div>
    );
  }

  const activeHeroSlide = memberHeroSlides[heroSlideIndex % memberHeroSlides.length];
  const firstName = sessionUser?.name?.trim().split(/\s+/)[0] || "Learner";

  return (
    <div className="overflow-x-clip bg-background">
      {sampleMode ? (
        <div className="border-b border-amber-200 bg-amber-50 text-amber-950" data-testid="home-sample-preview-badge">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <span><strong>Sample data preview.</strong> Exam, resource and testimonial examples on this page are visual-only and do not alter production data.</span>
            <button type="button" className="min-h-11 self-start rounded-lg px-3 text-xs font-black hover:bg-amber-100 sm:self-auto" onClick={() => setLocation("/")}>Exit preview</button>
          </div>
        </div>
      ) : null}

      <section className="py-7 sm:py-9 lg:py-11" data-testid="home-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {!sessionUser ? (
            <div className="overflow-hidden rounded-[32px] border border-border bg-card shadow-[0_28px_90px_-45px_rgba(15,23,42,0.45)]" data-testid="home-acquisition-hero">
              <div className="grid lg:min-h-[555px] lg:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
                <div className="relative min-h-[390px] overflow-hidden sm:min-h-[460px] lg:min-h-full">
                  <img
                    src={ACQUISITION_HERO_IMAGE}
                    alt="Students preparing together with a laptop and study notes"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                    loading="eager"
                    fetchPriority="high"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/48 to-slate-950/10" />
                  <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-slate-950/80 to-transparent" />
                  <div className="relative flex h-full min-h-[390px] max-w-2xl flex-col justify-end p-6 text-white sm:min-h-[460px] sm:p-9 lg:min-h-[555px] lg:p-12">
                    <div className="mb-auto inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs font-black backdrop-blur-md">
                      <Sparkles className="h-4 w-4" />
                      Built for serious exam preparation
                    </div>
                    <h1 className="max-w-2xl text-4xl font-black tracking-[-0.045em] sm:text-5xl lg:text-[58px] lg:leading-[1.02]">
                      Your next score starts with better practice.
                    </h1>
                    <p className="mt-4 max-w-xl text-sm leading-7 text-white/78 sm:text-base">
                      Prepare for government and competitive exams with focused mock tests, PYQs, exam pathways and free study resources in one modern workspace.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold text-white/88">
                      {["Exam-real mocks", "Free resources", "English · हिन्दी · ਪੰਜਾਬੀ where published"].map((label) => (
                        <span key={label} className="rounded-full border border-white/15 bg-black/20 px-3 py-2 backdrop-blur-sm">{label}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center bg-gradient-to-b from-background to-muted/40 p-5 sm:p-7 lg:p-9" data-testid="home-hero-auth-card">
                  <div className="w-full rounded-[26px] border border-border bg-background p-6 shadow-xl shadow-black/5 sm:p-7">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><LogIn className="h-5 w-5" /></span>
                    <p className="mt-5 text-[11px] font-black uppercase tracking-[0.16em] text-primary">Welcome to ExamTree</p>
                    <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-foreground">Sign in and make every practice session count.</h2>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">Access your test history, saved progress and personalized preparation workspace.</p>

                    <Button className="mt-6 min-h-12 w-full rounded-xl text-sm font-black" onClick={() => setLocation("/login/student") }>
                      Login / Sign up <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    <div className="my-4 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                      <span className="h-px flex-1 bg-border" />
                      or
                      <span className="h-px flex-1 bg-border" />
                    </div>

                    <Button
                      className="min-h-12 w-full rounded-xl bg-background text-sm font-black shadow-sm"
                      variant="outline"
                      onClick={handleGoogleLogin}
                      disabled={googleLoading}
                      data-testid="home-google-login"
                    >
                      <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-white text-xs font-black text-slate-700">G</span>
                      {googleLoading ? "Opening Google…" : "Continue with Google"}
                    </Button>

                    {googleError ? <p className="mt-3 text-xs font-semibold leading-5 text-destructive" role="alert">{googleError}</p> : null}

                    <button type="button" className="et-interactive mt-5 flex min-h-11 w-full items-center justify-center rounded-xl text-sm font-bold text-muted-foreground hover:bg-muted hover:text-foreground" onClick={goMarketplace}>
                      Explore exams without signing in
                    </button>

                    <div className="mt-5 border-t border-border pt-5">
                      <p className="text-xs font-semibold leading-5 text-muted-foreground">Free resources and exam discovery remain available before login. Sign in when you want your progress tied to your workspace.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-[32px] bg-slate-950 text-white shadow-[0_30px_100px_-52px_rgba(15,23,42,0.9)]" data-testid="home-member-hero">
              <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-primary/35 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
              <div className="relative grid min-h-[440px] gap-7 p-6 sm:p-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(330px,0.88fr)] lg:items-center lg:p-11">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-black backdrop-blur">Welcome back, {firstName}</span>
                    <span className="text-xs font-bold text-white/55">{heroSlideIndex + 1} / {memberHeroSlides.length}</span>
                  </div>
                  <p className="mt-7 text-[11px] font-black uppercase tracking-[0.18em] text-indigo-300">{activeHeroSlide.eyebrow}</p>
                  <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-[-0.045em] sm:text-5xl lg:text-[58px] lg:leading-[1.02]">{activeHeroSlide.title}</h1>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-white/68 sm:text-base">{activeHeroSlide.description}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {activeHeroSlide.meta.map((item) => <span key={item} className="rounded-full border border-white/12 bg-white/8 px-3 py-2 text-xs font-bold text-white/78">{item}</span>)}
                  </div>
                  <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <Button className="min-h-12 rounded-xl bg-white px-6 font-black text-slate-950 hover:bg-white/90" onClick={() => navigateHero(activeHeroSlide.primaryHref)}>
                      {activeHeroSlide.primaryLabel} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    {activeHeroSlide.secondaryHref && activeHeroSlide.secondaryLabel ? (
                      <Button className="min-h-12 rounded-xl border-white/20 bg-white/5 px-6 font-black text-white hover:bg-white/10" variant="outline" onClick={() => navigateHero(activeHeroSlide.secondaryHref!)}>
                        {activeHeroSlide.secondaryLabel}
                      </Button>
                    ) : null}
                  </div>
                </div>

                <div className="rounded-[28px] border border-white/12 bg-white/[0.07] p-5 backdrop-blur-xl sm:p-6">
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-indigo-200"><Trophy className="h-5 w-5" /></span>
                    <span className="rounded-full border border-white/10 bg-black/15 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-white/60">For you</span>
                  </div>
                  <p className="mt-6 text-sm font-black text-white/60">Featured preparation</p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight">{activeHeroSlide.title}</h2>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    {activeHeroSlide.meta.slice(0, 4).map((item) => (
                      <div key={item} className="rounded-2xl border border-white/10 bg-black/15 p-4">
                        <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                        <p className="mt-3 text-sm font-black text-white/88">{item}</p>
                      </div>
                    ))}
                  </div>
                  <Button className="mt-6 min-h-11 w-full rounded-xl border-white/15 bg-white/10 text-white hover:bg-white/15" variant="outline" onClick={() => setLocation("/dashboard") }>
                    <LayoutDashboard className="mr-2 h-4 w-4" /> My dashboard
                  </Button>
                </div>
              </div>

              <div className="relative flex items-center justify-between border-t border-white/10 px-6 py-4 sm:px-8 lg:px-11">
                <div className="flex items-center gap-2" aria-label="Hero slides">
                  {memberHeroSlides.map((slide, index) => (
                    <button
                      key={slide.id}
                      type="button"
                      aria-label={`Show slide ${index + 1}`}
                      aria-current={index === heroSlideIndex ? "true" : undefined}
                      className={`h-2.5 rounded-full transition-all ${index === heroSlideIndex ? "w-8 bg-white" : "w-2.5 bg-white/30 hover:bg-white/55"}`}
                      onClick={() => setHeroSlideIndex(index)}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button type="button" className="et-interactive flex h-11 w-11 items-center justify-center rounded-xl border border-white/12 bg-white/5 text-white hover:bg-white/10" aria-label="Previous promotion" onClick={() => setHeroSlideIndex((current) => (current - 1 + memberHeroSlides.length) % memberHeroSlides.length)}><ChevronLeft className="h-4 w-4" /></button>
                  <button type="button" className="et-interactive flex h-11 w-11 items-center justify-center rounded-xl border border-white/12 bg-white/5 text-white hover:bg-white/10" aria-label="Next promotion" onClick={() => setHeroSlideIndex((current) => (current + 1) % memberHeroSlides.length)}><ChevronRight className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="border-b border-border bg-card/40" aria-label="ExamTree catalog totals" data-testid="home-proof-strip">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-border px-4 sm:grid-cols-4 sm:divide-y-0 sm:px-6 lg:px-8">
          {[
            [formatCount(examGroups.length), "Exam families"],
            [formatCount(catalogQuestionCount), "Catalog questions"],
            [formatCount(publishedLanguageCount), "Published languages"],
            [formatCount(resources.length), "Free resources"],
          ].map(([value, label]) => (
            <div key={label} className="px-4 py-6 text-center">
              <p className="text-2xl font-black tracking-tight text-foreground">{value}</p>
              <p className="mt-1 text-xs font-semibold text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8" data-testid="home-exam-families">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">Choose your exam</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-foreground sm:text-3xl">Popular exam families</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Start from the exam you care about. The deeper catalog handles mocks, series and practice formats after you choose a path.</p>
          </div>
          <Button className="min-h-11 self-start sm:self-auto" variant="ghost" onClick={goMarketplace}>See all exams <ArrowRight className="ml-2 h-4 w-4" /></Button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {featuredExamGroups.map((group) => (
            <button key={group.id} type="button" onClick={() => goCategory(group.id)} className="et-interactive group min-h-[132px] rounded-3xl border border-border bg-card p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <ExamMark name={group.name} icon={group.icon} />
                <ChevronRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden="true" />
              </div>
              <h3 className="mt-4 truncate text-sm font-black text-foreground">{group.name}</h3>
              <p className="mt-1 text-xs font-semibold text-muted-foreground">{formatCount(group.subcategories.length)} exam paths</p>
            </button>
          ))}
          {featuredExamGroups.length === 0 ? <div className="sm:col-span-2 lg:col-span-4 rounded-3xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">Published exam families will appear here when catalog data is available.</div> : null}
        </div>
      </section>

      <section className="border-y border-border bg-card/50 py-14 sm:py-16" data-testid="home-why-examtree">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <div className="max-w-xl">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">Why ExamTree</p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.035em] text-foreground sm:text-4xl">A preparation platform should reduce noise, not add more of it.</h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">ExamTree separates discovery, practice and free study material so each screen has one clear job. Home helps you choose where to go next instead of becoming another giant test catalog.</p>
              <Button className="mt-6 min-h-11" variant="outline" onClick={goMarketplace}>Explore the exam catalog</Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Target, title: "Exam-first discovery", copy: "Start from a real exam family and move into the corresponding preparation path instead of searching an undifferentiated wall of content." },
                { icon: BookOpenCheck, title: "Review that teaches", copy: "Attempt and result experiences are designed around understanding the solving path, not just seeing a final score." },
                { icon: Languages, title: "Multilingual where published", copy: "English, Hindi and Punjabi signals appear only when that underlying content is actually available." },
                { icon: ShieldCheck, title: "Truthful product signals", copy: "Catalog counts, language availability and resource listings come from real published data rather than invented marketing numbers." },
              ].map(({ icon: Icon, title, copy }) => (
                <article key={title} className="rounded-3xl border border-border bg-background p-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span>
                  <h3 className="mt-5 text-base font-black text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16" data-testid="home-testimonials">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">Learner stories</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-foreground sm:text-3xl">Testimonials belong here only when they are real.</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">The area is ready for permissioned learner feedback. We will not ship invented names, scores or selection claims as production social proof.</p>
          </div>

          {sampleMode ? (
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {SAMPLE_TESTIMONIALS.map((testimonial) => (
                <article key={testimonial.name} className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Quote className="h-5 w-5" /></span>
                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-amber-800">Preview testimonial</span>
                  </div>
                  <blockquote className="mt-5 text-base font-semibold leading-7 text-foreground">“{testimonial.quote}”</blockquote>
                  <div className="mt-6 border-t border-border pt-4">
                    <p className="text-sm font-black text-foreground">{testimonial.name}</p>
                    <p className="mt-1 text-xs font-semibold text-muted-foreground">{testimonial.exam}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mx-auto mt-8 max-w-3xl rounded-[28px] border border-dashed border-primary/25 bg-primary/[0.045] p-7 text-center sm:p-9">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Quote className="h-5 w-5" /></span>
              <h3 className="mt-4 text-lg font-black text-foreground">Verified learner feedback will appear here.</h3>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">This keeps the section production-ready without presenting sample copy as authentic student testimony.</p>
            </div>
          )}
        </div>
      </section>

      <section id="home-free-resources" className="border-y border-border py-14 sm:py-16" data-testid="home-free-resources">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">Free resources</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-foreground sm:text-3xl">Useful study material outside the test runner.</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Current affairs, PDF notes and formula sheets come from ExamTree's published learning-resource library. PYQs keep their own dedicated discovery path.</p>
            </div>
            {resourceCategory ? <Button className="min-h-11 self-start" variant="ghost" onClick={() => setResourceCategory(null)}>Show all resources</Button> : null}
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {RESOURCE_KINDS.map((item) => {
              const Icon = item.icon;
              const active = item.key !== "pyq" && resourceCategory === item.key;
              return (
                <button key={item.key} type="button" onClick={() => item.key === "pyq" ? setLocation("/pyqs") : chooseResourceCategory(item.key)} className={`et-interactive group min-h-[172px] rounded-3xl border p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md ${active ? "border-primary/35 bg-primary/[0.06]" : "border-border bg-card"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.tone}`}><Icon className="h-5 w-5" /></span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
                  </div>
                  <h3 className="mt-5 text-base font-black text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                </button>
              );
            })}
          </div>

          <div id="home-resource-feed" className="mt-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black text-foreground">{resourceCategory ? categoryLabel(resourceCategory) : "Latest published resources"}</p>
                <p className="mt-1 text-xs font-semibold text-muted-foreground">Only currently published public resources are listed.</p>
              </div>
              {sampleMode ? <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-amber-800">Preview data</span> : null}
            </div>

            {!sampleMode && resourceQuery.isLoading ? (
              <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 3 }, (_, index) => <div key={index} className="skeleton-shimmer h-52 rounded-3xl" />)}</div>
            ) : visibleResources.length > 0 ? (
              <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {visibleResources.map((resource) => {
                  const date = formatResourceDate(resource.contentDate);
                  return (
                    <article key={resource.id} className="flex min-h-[230px] flex-col rounded-3xl border border-border bg-card p-5 shadow-sm">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-primary">{categoryLabel(resource.category)}</span>
                        <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-muted-foreground">{resource.format}</span>
                      </div>
                      <h3 className="mt-4 line-clamp-2 text-base font-black leading-6 text-foreground">{resource.title}</h3>
                      {resource.summary ? <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{resource.summary}</p> : null}
                      <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold text-muted-foreground">
                        <span>{languageLabel(resource.languageCode)}</span>
                        {date ? <span>· {date}</span> : null}
                        {resource.exams[0]?.name ? <span>· {resource.exams[0].name}</span> : null}
                      </div>
                      <div className="mt-auto pt-5">
                        {resource.contentUrl ? (
                          <a href={resource.contentUrl} target="_blank" rel="noreferrer" className="et-interactive inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-black text-primary-foreground shadow-sm hover:opacity-90">
                            {resource.format === "pdf" ? <Download className="h-4 w-4" /> : <BookOpenCheck className="h-4 w-4" />}
                            {resource.format === "pdf" ? "Open PDF" : "Read resource"}
                          </a>
                        ) : (
                          <span className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-muted/40 px-4 py-2 text-sm font-semibold text-muted-foreground">
                            <BookOpenCheck className="h-4 w-4" />
                            {sampleMode ? "Preview only" : resource.hasInlineContent ? "Published article" : "Resource published"}
                          </span>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="mt-4 rounded-3xl border border-dashed border-border bg-card p-7 text-center">
                <FileText className="mx-auto h-7 w-7 text-muted-foreground" />
                <h3 className="mt-3 text-sm font-black text-foreground">No published resources in this view yet.</h3>
                <p className="mt-1 text-sm text-muted-foreground">The section stays truthful and will populate automatically as current affairs, notes and formula sheets are published.</p>
              </div>
            )}

            {!sampleMode && resourceQuery.isError ? <p className="mt-4 text-xs font-semibold text-muted-foreground">The public resource feed could not be loaded right now. Exam and PYQ discovery remain available.</p> : null}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted/25 py-14 sm:py-16" data-testid="home-faq">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.75fr_1.25fr] lg:px-8">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">Questions before you start?</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-foreground sm:text-3xl">A few quick answers.</h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">Home handles discovery, trust and free study material. Full test discovery stays deeper in the product where it belongs.</p>
            <Button className="mt-5 min-h-11" variant="outline" onClick={() => setLocation("/faq")}>Open full FAQ</Button>
          </div>
          <div className="space-y-3">
            {FAQS.map((item) => (
              <details key={item.question} className="group rounded-2xl border border-border bg-card p-5">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-sm font-black text-foreground marker:hidden">
                  {item.question}
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-open:rotate-90" aria-hidden="true" />
                </summary>
                <p className="pt-2 text-sm leading-6 text-muted-foreground">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8" data-testid="home-explore-gateway">
        <div className="rounded-[32px] border border-border bg-card p-7 text-center shadow-sm sm:p-10">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Zap className="h-6 w-6" /></span>
          <h2 className="mx-auto mt-5 max-w-2xl text-2xl font-black tracking-tight text-foreground sm:text-3xl">Choose your exam, then go as deep as you need.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Use Home for discovery and free study material. Use the Exams marketplace when you want the complete mock-test and practice catalog.</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button className="min-h-12 rounded-xl px-6 font-black" onClick={goMarketplace}>Explore exams <ArrowRight className="ml-2 h-4 w-4" /></Button>
            <Button className="min-h-12 rounded-xl px-6 font-black" variant="outline" onClick={scrollToResources}>Browse free resources</Button>
          </div>
          <div className="mx-auto mt-7 flex max-w-xl flex-wrap justify-center gap-3 text-xs font-semibold text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-primary" />Published data only</span>
            <span className="inline-flex items-center gap-1.5"><FileText className="h-4 w-4 text-primary" />Free learning resources</span>
            <span className="inline-flex items-center gap-1.5"><Languages className="h-4 w-4 text-primary" />Language-aware content</span>
          </div>
        </div>
      </section>
    </div>
  );
}
