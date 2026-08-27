import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  ChevronRight,
  Download,
  FileClock,
  FileText,
  Languages,
  Newspaper,
  Quote,
  Search,
  ShieldCheck,
  Sigma,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

import { CategoryIcon } from "@/components/CategoryIcon";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";
import { buildExamTreeNodes } from "@/lib/exam-tree";
import {
  SAMPLE_HOME_CATEGORIES,
  SAMPLE_HOME_SUBCATEGORIES,
  SAMPLE_HOME_TESTS,
} from "@/lib/home-sample-data";
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

function normalize(value: string | null | undefined) {
  return String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
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

export default function Home() {
  const [, setLocation] = useLocation();
  const catalog = useExamCatalog();
  const sampleMode = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("preview") === "sample";
  const [examQuery, setExamQuery] = useState("");
  const [resourceCategory, setResourceCategory] = useState<LearningResourceCategory | null>(null);

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

  const resources = sampleMode ? SAMPLE_RESOURCES : (resourceQuery.data?.resources ?? []);
  const examGroups = useMemo(() => buildExamTreeNodes(categories, subcategories, tests), [categories, subcategories, tests]);
  const normalizedQuery = normalize(examQuery);
  const searchResults = useMemo(
    () => examGroups.filter((group) => !normalizedQuery || normalize(`${group.name} ${group.description} ${group.subcategories.map((item) => item.name).join(" ")}`).includes(normalizedQuery)).slice(0, 5),
    [examGroups, normalizedQuery],
  );
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

  const goMarketplace = () => setLocation(sampleMode ? "/exams?preview=sample" : "/exams");
  const goCategory = (id: string) => setLocation(sampleMode ? "/exams?preview=sample" : `/category/${id}`);
  const scrollToResources = () => document.getElementById("home-free-resources")?.scrollIntoView({ behavior: "smooth", block: "start" });
  const chooseResourceCategory = (category: LearningResourceCategory) => {
    setResourceCategory(category);
    window.requestAnimationFrame(scrollToResources);
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
        <div className="skeleton-shimmer h-[430px] rounded-[32px]" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div key={index} className="skeleton-shimmer h-24 rounded-2xl" />)}</div>
        <span className="sr-only">Loading published exam pathways…</span>
      </div>
    );
  }

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

      <section className="border-b border-border bg-gradient-to-b from-primary/[0.07] via-background to-background" data-testid="home-hero">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] lg:items-center lg:px-8 lg:py-20">
          <div className="min-w-0">
            <div className="inline-flex min-h-9 items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 text-xs font-black text-primary">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Exam preparation, organised better
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-[-0.055em] text-foreground sm:text-5xl lg:text-[64px] lg:leading-[0.98]">
              Find your exam. Build a sharper preparation routine.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Explore exam pathways, move into the complete mock-test catalog when you are ready, and use free current affairs, notes, formula sheets and PYQs to support daily preparation.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button className="min-h-12 rounded-xl px-6 text-sm font-black" onClick={goMarketplace}>
                Explore exams <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
              <Button className="min-h-12 rounded-xl px-6 text-sm font-black" variant="outline" onClick={scrollToResources}>
                Free resources
              </Button>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-muted-foreground" aria-label="ExamTree preparation benefits">
              {["Exam-first discovery", "Free study resources", "Multilingual content where published"].map((label) => (
                <span key={label} className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />{label}</span>
              ))}
            </div>
          </div>

          <div className="relative min-w-0" data-testid="home-exam-finder">
            <div className="pointer-events-none absolute -inset-5 rounded-[36px] bg-primary/10 blur-3xl" />
            <div className="relative rounded-[28px] border border-border bg-card p-4 shadow-xl shadow-black/5 sm:p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">Find your exam</p>
                  <h2 className="mt-1 text-xl font-black tracking-tight text-foreground">What are you preparing for?</h2>
                </div>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Target className="h-5 w-5" aria-hidden="true" /></span>
              </div>

              <label className="relative mt-5 block">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <span className="sr-only">Search exams</span>
                <input
                  value={examQuery}
                  onChange={(event) => setExamQuery(event.target.value)}
                  placeholder="Search SSC, Banking, Railways…"
                  className="min-h-12 w-full rounded-xl border border-border bg-background pl-11 pr-4 text-sm font-semibold text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </label>

              <div className="mt-4 space-y-2" aria-live="polite">
                {searchResults.map((group) => (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => goCategory(group.id)}
                    className="et-interactive flex min-h-[64px] w-full items-center gap-3 rounded-2xl border border-transparent px-3 text-left transition hover:border-border hover:bg-muted/60"
                  >
                    <ExamMark name={group.name} icon={group.icon} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-black text-foreground">{group.name}</span>
                      <span className="mt-0.5 block text-xs font-semibold text-muted-foreground">{formatCount(group.subcategories.length)} exam paths</span>
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  </button>
                ))}
                {searchResults.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border px-4 py-5 text-center text-sm text-muted-foreground">No matching exam family. Use the complete exam catalog instead.</div>
                ) : null}
              </div>

              <Button className="mt-4 min-h-11 w-full rounded-xl" variant="outline" onClick={goMarketplace}>View all exams</Button>
            </div>
          </div>
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
            <button
              key={group.id}
              type="button"
              onClick={() => goCategory(group.id)}
              className="et-interactive group min-h-[132px] rounded-3xl border border-border bg-card p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md"
            >
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
                <button
                  key={item.key}
                  type="button"
                  onClick={() => item.key === "pyq" ? setLocation("/pyqs") : chooseResourceCategory(item.key)}
                  className={`et-interactive group min-h-[172px] rounded-3xl border p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md ${active ? "border-primary/35 bg-primary/[0.06]" : "border-border bg-card"}`}
                >
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
              <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }, (_, index) => <div key={index} className="skeleton-shimmer h-52 rounded-3xl" />)}
              </div>
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

            {!sampleMode && resourceQuery.isError ? (
              <p className="mt-4 text-xs font-semibold text-muted-foreground">The public resource feed could not be loaded right now. Exam and PYQ discovery remain available.</p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted/25 py-14 sm:py-16" data-testid="home-faq">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.75fr_1.25fr] lg:px-8">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">Questions before you start?</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-foreground sm:text-3xl">A few quick answers.</h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">The homepage is intentionally lighter now. Full test discovery lives deeper in the product instead of competing with every other section here.</p>
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
