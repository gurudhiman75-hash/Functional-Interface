import { useMemo, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight, BarChart3, BookOpen, BookOpenCheck, CalendarDays, CheckCircle2, ChevronDown, Chrome, FileText, Globe2, Landmark, Languages, Loader2, ShieldCheck, Smartphone, Sparkles, Target, Trophy, Users } from "lucide-react";

import SSCExamWorkspace from "@/components/SSCExamWorkspace";
import MathText from "@/components/MathText";
import { CategoryIcon } from "@/components/CategoryIcon";
import { CheckList, PublicCard, PublicPage, usePageMeta } from "@/components/PublicPage";
import { apiRequest } from "@/lib/api";
import type { Test } from "@/lib/data";
import { getStudentTestSeries, type StudentSeriesSummary } from "@/lib/test-series";
import { DEFAULT_WEB_EXAM_PAGE_CONFIGURATION, getWebExamPageConfiguration, withDefaultExamDetailsSections, type WebExamCardStyle, type WebExamPageSection } from "@/lib/web-exam-page";
import { useExamCatalog } from "@/providers/ExamCatalogProvider";
import { getSessionUser } from "@/lib/session-user";
import { signInWithGoogle } from "@/lib/auth";
import {
  catalogExamCodesForSlug,
  examDetailsHref,
  examHubHref,
  examPreparationHref,
  examSyllabusHref,
  findPracticeTopic,
  getExamAcquisitionConfig,
  practiceTopicHref,
} from "@/lib/seo-practice";

type PublicPracticeQuestion = {
  id: string;
  topicSlug: string;
  language: string;
  difficulty: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
};

type PublicPracticeResponse = {
  examSlug: string;
  topicSlug: string;
  language: string;
  count: number;
  questions: PublicPracticeQuestion[];
};

function requireConfig(examSlug: string) {
  const config = getExamAcquisitionConfig(examSlug);
  if (!config) throw new Error("Unknown exam acquisition config: " + examSlug);
  return config;
}

export type ExamHubFlatTest = {
  id: string;
  title: string;
  description: string;
  href: string;
  stage: "prelims" | "mains" | "general";
  type: "full-length" | "sectional" | "topic-wise" | "pyq";
  questionCount: number;
  durationMinutes: number;
  totalMarks: number;
  difficulty?: string;
  access?: "free" | "paid";
  iconUrl?: string | null;
  seriesName?: string;
  languages?: string[];
};

function flatTestType(test: Test): ExamHubFlatTest["type"] {
  const text = testSearchText(test);
  if (isPyqText(text)) return "pyq";
  if (test.kind === "sectional") return "sectional";
  if (test.kind === "topic-wise") return "topic-wise";
  return "full-length";
}

function preferredStage(
  stage: "prelims" | "mains" | "general",
  searchText: string,
  testHub?: ReturnType<typeof requireConfig>["testHub"],
): "prelims" | "mains" | "general" {
  if (stage !== "general") return stage;
  if (testHub?.mode === "single") return "prelims";
  const inferred = stageFromText(searchText, testHub);
  return inferred === "general" ? "prelims" : inferred;
}

function ExamHubFlatTestRow({ test, ctaLabel }: { test: ExamHubFlatTest; ctaLabel?: string }) {
  const typeLabel =
    test.type === "sectional" ? "Sectional Test" :
    test.type === "topic-wise" ? "Topic-wise Test" :
    test.type === "pyq" ? "Previous Year" :
    "Full Test";

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-[0_3px_14px_rgba(15,23,42,0.025)] sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-blue-50 text-sm font-bold text-blue-700">
          {test.iconUrl ? <img src={test.iconUrl} alt="" className="h-full w-full object-contain p-1.5" /> : <FileText className="h-5 w-5" />}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-slate-950">{test.title}</h3>
            {test.access === "free" ? <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">Free</span> : null}
          </div>
          {test.description ? <p className="mt-1 line-clamp-1 text-sm text-slate-500">{test.description}</p> : null}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
            <span className="rounded-md bg-blue-50 px-2 py-1 font-semibold text-blue-700">{typeLabel}</span>
            {test.difficulty ? <span className="rounded-md bg-amber-50 px-2 py-1 font-semibold text-amber-700">{test.difficulty}</span> : null}
            <span>{test.questionCount} questions</span>
            <span>{test.durationMinutes} min</span>
            {test.totalMarks > 0 ? <span>{test.totalMarks} marks</span> : null}
          </div>
        </div>
      </div>
      <Link href={test.href} className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-xl bg-[#1375ea] px-5 text-sm font-semibold text-white transition hover:bg-[#0d67d0]">
        {ctaLabel || "Start Test"} <ArrowRight className="ml-1.5 h-4 w-4" />
      </Link>
    </article>
  );
}

function compact(value: string | null | undefined) {
  return String(value ?? "").trim();
}

function seriesSearchText(series: StudentSeriesSummary) {
  return (series.name + " " + series.description + " " + series.code).toLowerCase();
}

function seriesHubType(series: StudentSeriesSummary) {
  const value = series.hubType;
  return value === "pyq" || value === "sectional" || value === "topic-wise" || value === "full-length"
    ? value
    : isPyqText(seriesSearchText(series)) ? "pyq" : "full-length";
}

function seriesHubStage(series: StudentSeriesSummary) {
  const value = series.hubStage;
  return value === "prelims" || value === "mains" || value === "general"
    ? value
    : stageFromText(seriesSearchText(series));
}

function testSearchText(test: Test) {
  return (test.name + " " + (test.subcategoryName ?? "")).toLowerCase();
}

function isPyqText(value: string) {
  return /\bpyq\b|previous[ -]?year|memory[ -]?based/.test(value);
}

function stageFromText(
  value: string,
  testHub?: ReturnType<typeof requireConfig>["testHub"],
): "prelims" | "mains" | "general" {
  const text = value.toLowerCase();
  const stage2Keywords = testHub?.stage2Keywords ?? [];
  const stage1Keywords = testHub?.stage1Keywords ?? [];
  if (stage2Keywords.some((keyword) => text.includes(keyword.toLowerCase()))) return "mains";
  if (stage1Keywords.some((keyword) => text.includes(keyword.toLowerCase()))) return "prelims";

  const mains = /\bmains?\b|\bmain examination\b|\btier[\s-]?(?:ii|2)\b|\bpaper[\s-]?(?:ii|2)\b/.test(text);
  const prelims = /\bprelims?\b|\bpreliminary\b|\bpre\b|\btier[\s-]?(?:i|1)\b|\bpaper[\s-]?(?:i|1)\b/.test(text);
  if (mains && !prelims) return "mains";
  if (prelims && !mains) return "prelims";
  return "general";
}

function gridColumnsClass(columns: number) {
  if (columns >= 4) return "lg:grid-cols-4";
  if (columns === 3) return "lg:grid-cols-3";
  if (columns === 2) return "md:grid-cols-2";
  return "grid-cols-1";
}

function configuredCardClass(style: WebExamCardStyle) {
  if (style === "minimal") return "border-transparent bg-transparent shadow-none";
  if (style === "featured") return "border-indigo-200 bg-indigo-50/40 shadow-[0_10px_28px_rgba(79,70,229,0.08)]";
  if (style === "compact") return "border-slate-200 bg-white py-3 shadow-none";
  if (style === "bordered") return "border-slate-300 bg-white shadow-none";
  return "border-slate-200 bg-white shadow-[0_6px_20px_rgba(15,23,42,0.035)]";
}

function ConfiguredManualCards({ section }: { section: WebExamPageSection }) {
  const cards = (section.cards ?? []).filter((card) => card.isVisible).sort((a, b) => a.sortOrder - b.sortOrder);
  if (cards.length === 0) return null;
  const layoutClass =
    section.layout === "horizontal"
      ? "flex snap-x gap-4 overflow-x-auto pb-2"
      : section.layout === "list"
        ? "space-y-3"
        : "grid gap-4 " + gridColumnsClass(section.columns);

  return (
    <div className={layoutClass}>
      {cards.map((card) => {
        const content = (
          <div className={"h-full rounded-2xl border p-4 " + configuredCardClass(section.cardStyle) + (section.layout === "horizontal" ? " w-[82vw] max-w-[360px] shrink-0 snap-start" : "")}>
            {card.badge ? <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-indigo-600">{card.badge}</p> : null}
            {card.title ? <h3 className="mt-1 font-semibold text-slate-950">{card.title}</h3> : null}
            {card.text ? <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">{card.text}</p> : null}
            {card.ctaLabel && card.href ? <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-indigo-700">{card.ctaLabel}<ArrowRight className="h-4 w-4" /></span> : null}
          </div>
        );
        if (!card.href) return <div key={card.id}>{content}</div>;
        if (/^https?:\/\//i.test(card.href)) return <a key={card.id} href={card.href} target="_blank" rel="noreferrer">{content}</a>;
        return <Link key={card.id} href={card.href}>{content}</Link>;
      })}
    </div>
  );
}


function countLabel(count: number) {
  return count > 0 ? String(count) : "Coming soon";
}

function marketingCategoryLabel(examName: string) {
  if (/^IBPS\b|^SBI\b|^RBI\b|bank/i.test(examName)) return "Banking exams";
  if (/^SSC\b/i.test(examName)) return "SSC exams";
  return "Exam preparation";
}

function LoggedOutExamHubPage({
  examSlug,
  config,
  examIcon,
  flatTests,
  dataUnavailable,
}: {
  examSlug: string;
  config: ReturnType<typeof requireConfig>;
  examIcon?: string | null;
  flatTests: ExamHubFlatTest[];
  dataUnavailable: boolean;
}) {
  const returnPath = examHubHref(examSlug);
  const [googlePending, setGooglePending] = useState(false);
  const loginHref = "/login/student?next=" + encodeURIComponent(returnPath);
  const signupHref = "/login/student?mode=signup&next=" + encodeURIComponent(returnPath);

  const prelimsFull = flatTests.filter((test) => test.stage === "prelims" && test.type === "full-length").length;
  const mainsFull = flatTests.filter((test) => test.stage === "mains" && test.type === "full-length").length;
  const sectional = flatTests.filter((test) => test.type === "sectional").length;
  const topicWise = flatTests.filter((test) => test.type === "topic-wise").length;
  const pyq = flatTests.filter((test) => test.type === "pyq").length;
  const fullMocks = flatTests.filter((test) => test.type === "full-length").length;
  const hasMains = config.testHub?.mode === "dual" || mainsFull > 0;
  const stage1Label = config.testHub?.stage1Label || "Prelims";
  const stage2Label = config.testHub?.stage2Label || "Mains";

  const offeringCards = hasMains
    ? [
        { value: countLabel(prelimsFull), title: stage1Label + " Mock Tests", text: "Full-length practice for the " + stage1Label + " stage.", tone: "blue" },
        { value: countLabel(mainsFull), title: stage2Label + " Mock Tests", text: "Full-length practice for the " + stage2Label + " stage.", tone: "green" },
        { value: countLabel(sectional), title: "Sectional Tests", text: "Focused practice for individual exam sections.", tone: "orange" },
        { value: countLabel(topicWise), title: "Topic-wise Tests", text: "Target individual topics before full mocks.", tone: "violet" },
      ]
    : [
        { value: countLabel(fullMocks), title: "Full Mock Tests", text: "Exam-pattern full-length practice.", tone: "blue" },
        { value: countLabel(sectional), title: "Sectional Tests", text: "Focused practice for individual exam sections.", tone: "green" },
        { value: countLabel(topicWise), title: "Topic-wise Tests", text: "Target individual topics before full mocks.", tone: "orange" },
        { value: countLabel(pyq), title: "Previous Year Papers", text: "Practise published previous-year and memory-based papers.", tone: "violet" },
      ];

  const toneClass: Record<string, string> = {
    blue: "border-blue-100 bg-gradient-to-br from-blue-50 to-white text-blue-700",
    green: "border-emerald-100 bg-gradient-to-br from-emerald-50 to-white text-emerald-700",
    orange: "border-orange-100 bg-gradient-to-br from-orange-50 to-white text-orange-700",
    violet: "border-violet-100 bg-gradient-to-br from-violet-50 to-white text-violet-700",
  };

  const features = [
    { icon: Target, title: "Exam-focused mock tests", text: "Practise with published full-length, sectional and topic-wise tests mapped to this exam." },
    { icon: BookOpenCheck, title: "Detailed solutions", text: "Review answers with clear explanations after your attempts." },
    { icon: BarChart3, title: "Focused practice", text: "Move between full mocks, sections and individual topics as your preparation develops." },
    { icon: BookOpen, title: "Previous year practice", text: "Use available previous-year and memory-based papers to understand the question style." },
    { icon: Languages, title: "Language support", text: "Use the language options available for each published test and learning resource." },
    { icon: Smartphone, title: "Study on any screen", text: "Use the responsive web experience across desktop, tablet and mobile." },
    { icon: CalendarDays, title: "Preparation resources", text: "Keep syllabus, pattern and preparation guidance together with your test practice." },
    { icon: ShieldCheck, title: "Saved preparation", text: "Sign in to keep attempts, results and preparation activity connected to your account." },
  ];

  const infoLinks = [
    { icon: BookOpenCheck, label: "Overview", href: "#about-exam" },
    { icon: BookOpen, label: "Syllabus", href: examSyllabusHref(examSlug) },
    { icon: FileText, label: "Exam Pattern", href: examSyllabusHref(examSlug) },
    { icon: Sparkles, label: "Preparation Strategy", href: examPreparationHref(examSlug) },
    ...(config.topics[0] ? [{ icon: Target, label: "Free Practice", href: practiceTopicHref(config.topics[0].slug, examSlug) }] : []),
    { icon: Globe2, label: "Official Notices", href: config.officialUrl, external: true },
  ];

  return (
    <div className="bg-white pb-14">
      <div className="mx-auto w-full max-w-[1480px] px-4 pt-5 sm:px-6 lg:px-8">
        <section className="relative min-h-[470px] overflow-hidden rounded-[30px] border border-blue-100 bg-[linear-gradient(115deg,#f8fbff_0%,#edf6ff_48%,#dbeafe_100%)] shadow-[0_18px_55px_rgba(37,99,235,0.10)]">
          <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-white/80 blur-3xl" />
          <div className="absolute bottom-[-150px] left-[38%] h-[380px] w-[380px] rounded-full bg-blue-300/20 blur-3xl" />
          <div className="absolute right-[270px] top-14 hidden h-[340px] w-[340px] items-center justify-center rounded-full border border-white/70 bg-white/25 text-blue-900/10 lg:flex">
            <Landmark className="h-56 w-56" strokeWidth={1.1} />
          </div>
          <div className="absolute bottom-9 right-[335px] hidden rounded-2xl border border-white/80 bg-white/70 px-4 py-3 text-xs font-semibold leading-5 text-slate-600 shadow-sm backdrop-blur lg:block">
            Prepare smarter.<br />Build confidence.<br />Perform better.
          </div>

          <div className="relative grid min-h-[470px] lg:grid-cols-[minmax(0,1fr)_350px]">
            <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-14 lg:py-12">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-white/75 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-blue-700 shadow-sm">
                <ShieldCheck className="h-3.5 w-3.5" />
                {marketingCategoryLabel(config.name)}
              </div>

              <div className="mt-5 flex items-start gap-4">
                {examIcon ? (
                  <div className="hidden h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/90 bg-white/80 p-3 shadow-sm sm:flex">
                    <CategoryIcon icon={examIcon} className="h-12 w-12" />
                  </div>
                ) : null}
                <div>
                  <h1 className="text-4xl font-black tracking-[-0.045em] text-[#111b4d] sm:text-5xl lg:text-[58px] lg:leading-[1.02]">
                    {config.name} <span className="text-blue-600">{config.yearLabel}</span>
                  </h1>
                  <p className="mt-2 text-xl font-bold tracking-tight text-slate-800">{config.hub.title}</p>
                </div>
              </div>

              <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-600 sm:text-base">
                {config.hub.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                {[
                  "Exam-pattern practice",
                  "Sectional & topic-wise",
                  "Previous year papers",
                  "Detailed solutions",
                ].map((label) => (
                  <span key={label} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/90 bg-white/75 px-3 py-2 text-xs font-bold text-slate-700 shadow-sm backdrop-blur">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    {label}
                  </span>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link href={signupHref} className="inline-flex min-h-12 items-center justify-center rounded-xl bg-blue-600 px-6 text-sm font-bold text-white shadow-[0_10px_24px_rgba(37,99,235,0.22)] transition hover:bg-blue-700">
                  Start preparing <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <a href="#whats-included" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-blue-200 bg-white/75 px-6 text-sm font-bold text-blue-700 transition hover:bg-white">
                  See what&apos;s included
                </a>
              </div>
            </div>

            <div className="m-5 self-center rounded-[24px] border border-white/90 bg-white/92 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.12)] backdrop-blur sm:m-7 lg:ml-0 lg:p-6">
              <div className="text-center">
                <h2 className="text-xl font-black tracking-tight text-slate-950">Get started with ExamTree</h2>
                <p className="mt-2 text-sm leading-5 text-slate-500">Sign in to access tests, save attempts and keep your preparation connected.</p>
              </div>

              <button
                type="button"
                disabled={googlePending}
                onClick={() => {
                  setGooglePending(true);
                  void signInWithGoogle()
                    .then(() => window.location.assign(returnPath))
                    .catch(() => window.location.assign(loginHref))
                    .finally(() => setGooglePending(false));
                }}
                className="mt-5 flex min-h-12 w-full items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-wait disabled:opacity-70"
              >
                <Chrome className="mr-2 h-4 w-4" /> {googlePending ? "Connecting…" : "Continue with Google"}
              </button>
              <div className="my-4 flex items-center gap-3"><span className="h-px flex-1 bg-slate-200" /><span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">or</span><span className="h-px flex-1 bg-slate-200" /></div>
              <div className="grid grid-cols-2 gap-2">
                <Link href={signupHref} className="flex min-h-11 items-center justify-center rounded-xl border border-blue-200 bg-white px-3 text-xs font-bold text-blue-700 hover:bg-blue-50">Sign up</Link>
                <Link href={loginHref} className="flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 hover:bg-slate-50">Login</Link>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
                <div className="text-center"><ShieldCheck className="mx-auto h-5 w-5 text-blue-600" /><p className="mt-1 text-[10px] font-bold text-slate-700">Secure account</p></div>
                <div className="text-center"><BarChart3 className="mx-auto h-5 w-5 text-emerald-600" /><p className="mt-1 text-[10px] font-bold text-slate-700">Save progress</p></div>
                <div className="text-center"><Smartphone className="mx-auto h-5 w-5 text-violet-600" /><p className="mt-1 text-[10px] font-bold text-slate-700">Responsive access</p></div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-14 grid gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-3 rounded-xl bg-white/70 p-3"><CalendarDays className="h-8 w-8 text-blue-600" /><div><p className="text-[11px] font-semibold text-slate-500">Exam cycle</p><p className="font-bold text-slate-900">{config.yearLabel}</p></div></div>
          <div className="flex items-center gap-3 rounded-xl bg-white/70 p-3"><FileText className="h-8 w-8 text-cyan-600" /><div><p className="text-[11px] font-semibold text-slate-500">Published practice</p><p className="font-bold text-slate-900">{flatTests.length > 0 ? flatTests.length + " tests" : "Being prepared"}</p></div></div>
          <div className="flex items-center gap-3 rounded-xl bg-white/70 p-3"><BookOpen className="h-8 w-8 text-violet-600" /><div><p className="text-[11px] font-semibold text-slate-500">Preparation</p><p className="font-bold text-slate-900">Syllabus + strategy</p></div></div>
          <div className="flex items-center gap-3 rounded-xl bg-white/70 p-3"><Landmark className="h-8 w-8 text-amber-600" /><div><p className="text-[11px] font-semibold text-slate-500">Official source</p><p className="font-bold text-slate-900">{config.officialLabel}</p></div></div>
        </div>

        {dataUnavailable ? (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
            Live catalogue counts are temporarily unavailable. Public exam information remains available below.
          </div>
        ) : null}

        <section id="whats-included" className="mt-12 scroll-mt-24">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-[#111b4d]">{config.name} {config.yearLabel} Test Series</h2>
              <p className="mt-1 text-sm text-slate-500">See what is available after you sign in. Individual test names remain inside your preparation workspace.</p>
            </div>
            <Link href={signupHref} className="text-sm font-bold text-blue-700 hover:underline">Sign in to access tests <ArrowRight className="ml-1 inline h-4 w-4" /></Link>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {offeringCards.map((card) => (
              <div key={card.title} className={"rounded-2xl border p-5 " + toneClass[card.tone]}>
                <p className="text-3xl font-black tracking-tight">{card.value}</p>
                <h3 className="mt-1 font-bold text-slate-950">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{card.text}</p>
                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-slate-600"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Available in your test workspace</div>
              </div>
            ))}
          </div>
        </section>

        <section id="why-examtree" className="mt-12 overflow-hidden rounded-[26px] border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-indigo-50 p-6 sm:p-8">
          <div className="grid gap-7 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-600">Why ExamTree</p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.035em] text-[#111b4d]">Everything you need to prepare in one place.</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">Use the same exam page for discovery, guidance and—after sign in—your actual test practice.</p>
              <Link href={signupHref} className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-700">Create free account <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {features.map(({ icon: Icon, title, text }) => (
                <article key={title} className="rounded-2xl border border-white bg-white/85 p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Icon className="h-5 w-5" /></span>
                  <h3 className="mt-3 text-sm font-bold text-slate-950">{title}</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="about-exam" className="mt-12 scroll-mt-24">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-600">Know the exam</p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-[#111b4d]">Everything about {config.name} {config.yearLabel}</h2>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">Plan your preparation with public exam guidance before you create an account.</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {infoLinks.map(({ icon: Icon, label, href, external }) => {
              const content = <><Icon className="h-6 w-6 text-blue-600" /><span className="mt-3 text-sm font-bold text-slate-900">{label}</span><ArrowRight className="mt-3 h-4 w-4 text-slate-400" /></>;
              return external
                ? <a key={label} href={href} target="_blank" rel="noreferrer" className="flex min-h-[145px] flex-col rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-sm">{content}</a>
                : <Link key={label} href={href} className="flex min-h-[145px] flex-col rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-sm">{content}</Link>;
            })}
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
              <h3 className="text-lg font-bold text-slate-950">About {config.name}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">{config.hub.description}</p>
              <Link href={examSyllabusHref(examSlug)} className="mt-4 inline-flex items-center text-sm font-bold text-blue-700 hover:underline">View syllabus & exam pattern <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
              <h3 className="text-lg font-bold text-slate-950">Prepare with a clear plan</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">{config.hub.preparationSummary}</p>
              <Link href={examPreparationHref(examSlug)} className="mt-4 inline-flex items-center text-sm font-bold text-blue-700 hover:underline">Open preparation guide <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-[#111b4d]">Preparation resources</h2>
              <p className="mt-1 text-sm text-slate-500">Public guidance you can use before starting your tests.</p>
            </div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {config.preparation.cards.slice(0, 3).map((card, index) => {
              const Icon = index === 0 ? Target : index === 1 ? BookOpen : CalendarDays;
              return <Link key={card.title} href={examPreparationHref(examSlug)} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-sm"><Icon className="h-6 w-6 text-blue-600" /><h3 className="mt-3 font-bold text-slate-950">{card.title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{card.text}</p></Link>;
            })}
          </div>
        </section>

        <section className="mt-12 overflow-hidden rounded-[26px] bg-[#0f2f66] px-6 py-7 text-white sm:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-200">Ready when you are</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight">Turn preparation into consistent practice.</h2>
              <p className="mt-2 text-sm text-blue-100">Create an account to unlock the actual {config.name} test workspace and save your progress.</p>
            </div>
            <Link href={signupHref} className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-amber-400 px-6 text-sm font-black text-slate-950 hover:bg-amber-300">Sign up now <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export function ExamHubPage({ examSlug }: { examSlug: string }) {
  const config = requireConfig(examSlug);
  const catalog = useExamCatalog();
  const sessionUser = getSessionUser();
  const [activeExamStage, setActiveExamStage] = useState<"prelims" | "mains" | "pyq">("prelims");
  const [activeTestType, setActiveTestType] = useState<"full-length" | "sectional" | "topic-wise">("full-length");
  const examCodes = useMemo(() => catalogExamCodesForSlug(examSlug).map((code) => code.toUpperCase()), [examSlug]);

  const seriesQuery = useQuery({
    queryKey: ["exam-hub-series", examSlug],
    queryFn: getStudentTestSeries,
    staleTime: 60_000,
    retry: 1,
  });
  const pageConfigQuery = useQuery({
    queryKey: ["web-exam-page", examSlug],
    queryFn: () => getWebExamPageConfiguration(examSlug),
    staleTime: 60_000,
    retry: 1,
  });

  const pageConfiguration = pageConfigQuery.data?.configuration ?? DEFAULT_WEB_EXAM_PAGE_CONFIGURATION;
  const orderedPageSections = useMemo(
    () => [...pageConfiguration.sections].filter((section) => section.isVisible).sort((a, b) => a.sortOrder - b.sortOrder),
    [pageConfiguration.sections],
  );

  usePageMeta(
    pageConfiguration.pageTitle || config.meta.hubTitle,
    pageConfiguration.pageDescription || config.meta.hubDescription,
    { canonicalPath: examHubHref(examSlug), robots: config.isShell ? "noindex,follow" : "index,follow" },
  );

  const catalogExam = useMemo(
    () => catalog.subcategories.find((exam) => examCodes.includes(exam.id.toUpperCase())),
    [catalog.subcategories, examCodes],
  );
  const examTests = useMemo(
    () => catalog.tests.filter((test) => test.subcategoryId && examCodes.includes(test.subcategoryId.toUpperCase())),
    [catalog.tests, examCodes],
  );
  const examSeries = useMemo(
    () => (seriesQuery.data?.series ?? []).filter((series) =>
      series.learnerVisibility !== "hidden" && examCodes.includes(series.examCode.toUpperCase()),
    ),
    [seriesQuery.data, examCodes],
  );

  const flatTests = useMemo<ExamHubFlatTest[]>(() => {
    const seriesBoundIds = new Set<string>();
    const fromSeries = examSeries.filter(series => examSlug !== "ssc-cgl" || series.learnerVisibility === "live").flatMap((series) => {
      const rawStage = seriesHubStage(series);
      const stage = preferredStage(rawStage, seriesSearchText(series), config.testHub);
      const type = seriesHubType(series);
      return (series.tests ?? []).map((test) => {
        seriesBoundIds.add(String(test.testId).toLowerCase());
        const catalogTest = examTests.find(item => String(item.id).toLowerCase() === String(test.testId).toLowerCase());
        return {
          id: "series-test-" + series.id + "-" + test.testId,
          title: test.title,
          description: compact(test.description) || series.name,
          href: "/test/" + encodeURIComponent(test.testId) + "?seriesId=" + encodeURIComponent(series.id),
          stage,
          type,
          questionCount: Number(test.questionCount || 0),
          durationMinutes: Math.max(1, Math.ceil(Number(test.durationSeconds || 0) / 60)),
          totalMarks: Number(test.totalMarks || 0),
          iconUrl: test.iconUrl ?? series.iconUrl,
          seriesName: series.name,
          access: catalogTest?.access,
          languages: catalogTest?.languages,
        } satisfies ExamHubFlatTest;
      });
    });

    const standalone = examTests
      .filter((test) => !seriesBoundIds.has(String(test.id).toLowerCase()))
      .map((test) => {
        const stage = preferredStage(stageFromText(testSearchText(test), config.testHub), testSearchText(test), config.testHub);
        const totalMarks = Math.max(0, Math.round(test.totalQuestions * Number(test.marksPerQuestion ?? 1)));
        return {
          id: "test-" + test.id,
          title: test.name,
          description: compact(test.subcategoryName) || (test.kind === "sectional" ? "Focused sectional practice" : test.kind === "topic-wise" ? "Focused topic practice" : "Full-length mock test"),
          href: "/test/" + encodeURIComponent(test.id),
          stage,
          type: flatTestType(test),
          questionCount: Number(test.totalQuestions || 0),
          durationMinutes: Number(test.duration || 0),
          totalMarks,
          difficulty: test.difficulty,
          access: test.access ?? "free",
          languages: test.languages,
          iconUrl: test.iconUrl,
        } satisfies ExamHubFlatTest;
      });

    return [...fromSeries, ...standalone];
  }, [examSeries, examTests, config.testHub, examSlug]);

  const activeTests = flatTests.filter((test) =>
    activeExamStage === "pyq"
      ? test.type === "pyq"
      : test.stage === activeExamStage && test.type === activeTestType,
  );
  const stageCounts = {
    prelims: flatTests.filter((test) => test.stage === "prelims" && test.type !== "pyq").length,
    mains: flatTests.filter((test) => test.stage === "mains" && test.type !== "pyq").length,
    pyq: flatTests.filter((test) => test.type === "pyq").length,
  };
  const totalPublished = examTests.length + examSeries.filter((series) => series.learnerVisibility === "live").length;
  const comingSoonCount = examSeries.filter((series) => series.learnerVisibility === "coming_soon").length;
  const freeCount = examTests.filter((test) => (test.access ?? "free") === "free").length;

  if (examSlug === "ssc-cgl") {
    return <SSCExamWorkspace
      tests={flatTests}
      series={examSeries}
      examDate={pageConfiguration.sections.find(section => section.type === "hero")?.labels.examDate}
      icon={catalogExam?.icon}
      signedIn={Boolean(sessionUser)}
      loading={catalog.isLoading || seriesQuery.isLoading}
      unavailable={Boolean(catalog.error || seriesQuery.error)}
      onRetry={() => { window.location.reload(); }}
    />;
  }

  if (!sessionUser) {
    return (
      <LoggedOutExamHubPage
        examSlug={examSlug}
        config={config}
        examIcon={catalogExam?.icon}
        flatTests={flatTests}
        dataUnavailable={Boolean(catalog.error || seriesQuery.error)}
      />
    );
  }


  const hasMainsStage = config.testHub?.mode === "dual" || stageCounts.mains > 0;
  const hubStage1Label = config.testHub?.stage1Label || "Prelims";
  const hubStage2Label = config.testHub?.stage2Label || "Mains";
  const scrollToTests = () => {
    window.requestAnimationFrame(() => {
      document.getElementById("test-catalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };
  const openTestView = (
    stage: "prelims" | "mains" | "pyq",
    type: "full-length" | "sectional" | "topic-wise" = "full-length",
  ) => {
    setActiveExamStage(stage);
    setActiveTestType(type);
    scrollToTests();
  };

  const workspaceActions = hasMainsStage
    ? [
        { key: "prelims", title: hubStage1Label + " Tests", text: stageCounts.prelims + " available", icon: FileText, action: () => openTestView("prelims", "full-length"), tone: "blue" },
        { key: "mains", title: hubStage2Label + " Tests", text: stageCounts.mains + " available", icon: BookOpenCheck, action: () => openTestView("mains", "full-length"), tone: "indigo" },
        { key: "sectional", title: "Sectional Tests", text: flatTests.filter((test) => test.type === "sectional").length + " available", icon: BarChart3, action: () => openTestView(activeExamStage === "mains" ? "mains" : "prelims", "sectional"), tone: "emerald" },
        { key: "topic", title: "Topic-wise Tests", text: flatTests.filter((test) => test.type === "topic-wise").length + " available", icon: Target, action: () => openTestView(activeExamStage === "mains" ? "mains" : "prelims", "topic-wise"), tone: "orange" },
        { key: "pyq", title: "Previous Year Papers", text: stageCounts.pyq + " available", icon: BookOpen, action: () => openTestView("pyq"), tone: "violet" },
      ]
    : [
        { key: "tests", title: (config.testHub?.stage1Label ? config.testHub.stage1Label + " Test Series" : "Test Series"), text: stageCounts.prelims + " available", icon: FileText, action: () => openTestView("prelims", "full-length"), tone: "blue" },
        { key: "sectional", title: "Sectional Tests", text: flatTests.filter((test) => test.type === "sectional").length + " available", icon: BarChart3, action: () => openTestView("prelims", "sectional"), tone: "emerald" },
        { key: "topic", title: "Topic-wise Tests", text: flatTests.filter((test) => test.type === "topic-wise").length + " available", icon: Target, action: () => openTestView("prelims", "topic-wise"), tone: "orange" },
        { key: "pyq", title: "Previous Year Papers", text: stageCounts.pyq + " available", icon: BookOpen, action: () => openTestView("pyq"), tone: "violet" },
      ];

  const workspaceTone: Record<string, string> = {
    blue: "border-blue-100 bg-blue-50/70 text-blue-700",
    indigo: "border-indigo-100 bg-indigo-50/70 text-indigo-700",
    emerald: "border-emerald-100 bg-emerald-50/70 text-emerald-700",
    orange: "border-orange-100 bg-orange-50/70 text-orange-700",
    violet: "border-violet-100 bg-violet-50/70 text-violet-700",
  };

  const renderSection = (section: WebExamPageSection) => {
    const manualCards = (section.cards ?? []).filter((card) => card.isVisible);
    const sectionGridClass = "grid gap-4 " + gridColumnsClass(section.columns);
    const sectionCardClass = configuredCardClass(section.cardStyle);

    if (section.type === "hero") {
      return (
        <section key={section.id} id="overview" className="scroll-mt-24 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_12px_34px_rgba(15,23,42,0.05)]">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="p-5 sm:p-7">
              <div className="flex items-start gap-4">
                {catalogExam?.icon ? (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-2">
                    <CategoryIcon icon={catalogExam.icon} className="h-10 w-10" />
                  </div>
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700"><BookOpenCheck className="h-8 w-8" /></div>
                )}
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-600">{section.eyebrow || "Complete exam hub"}</p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">{section.title || (config.name + " " + config.yearLabel)}</h2>
                  <p className="mt-2 max-w-2xl whitespace-pre-line text-sm leading-6 text-slate-600">{section.description || "Syllabus, exam pattern, preparation strategy, full mocks, PYQs, sectional tests and topic-wise practice in one place."}</p>
                </div>
              </div>
              {section.body ? <p className="mt-4 whitespace-pre-line text-sm leading-6 text-slate-600">{section.body}</p> : null}

              {section.ctaLabel && section.ctaHref ? (/^https?:\/\//i.test(section.ctaHref) ? <a href={section.ctaHref} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white">{section.ctaLabel}<ArrowRight className="h-4 w-4" /></a> : <Link href={section.ctaHref} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white">{section.ctaLabel}<ArrowRight className="h-4 w-4" /></Link>) : null}
            </div>
            <div className="border-t border-slate-200 bg-[#17182c] p-5 text-white lg:border-l lg:border-t-0 sm:p-6">
              {manualCards.length > 0 ? (
                <div className="space-y-3">
                  {manualCards.sort((a, b) => a.sortOrder - b.sortOrder).map((card) => (
                    <div key={card.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
                      {card.badge ? <p className="text-[10px] font-black uppercase tracking-[0.16em] text-indigo-300">{card.badge}</p> : null}
                      {card.title ? <p className="mt-1 font-semibold text-white">{card.title}</p> : null}
                      {card.text ? <p className="mt-1 whitespace-pre-line text-xs leading-5 text-white/65">{card.text}</p> : null}
                      {card.ctaLabel && card.href ? (/^https?:\/\//i.test(card.href) ? <a href={card.href} target="_blank" rel="noreferrer" className="mt-2 inline-flex text-xs font-semibold text-indigo-200">{card.ctaLabel}</a> : <Link href={card.href} className="mt-2 inline-flex text-xs font-semibold text-indigo-200">{card.ctaLabel}</Link>) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-indigo-300">{section.labels.catalogue || "Live catalogue"}</p>
                  <div className="mt-4 grid grid-cols-3 gap-3 lg:grid-cols-1">
                    <div><div className="text-2xl font-semibold">{totalPublished}</div><div className="text-xs text-white/55">{section.labels.published || "published"}</div></div>
                    <div><div className="text-2xl font-semibold">{freeCount}</div><div className="text-xs text-white/55">{section.labels.freeTests || "free tests"}</div></div>
                    <div><div className="text-2xl font-semibold">{comingSoonCount}</div><div className="text-xs text-white/55">{section.labels.comingSoon || "coming soon"}</div></div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      );
    }

    if (section.type === "test_catalog") {
      const stageLabel =
        activeExamStage === "prelims" ? (section.labels.prelims || hubStage1Label) :
        activeExamStage === "mains" ? (section.labels.mains || hubStage2Label) :
        (section.labels.pyq || "Previous Year Papers");
      const typeLabel =
        activeTestType === "sectional" ? (section.labels.sectional || "Sectional Tests") :
        activeTestType === "topic-wise" ? (section.labels.topicWise || "Topic-wise Tests") :
        (section.labels.fullTests || "Full Tests");
      const heading = activeExamStage === "pyq"
        ? config.name + " " + config.yearLabel + " Previous Year Papers"
        : config.name + " " + config.yearLabel + " " + stageLabel + " " + typeLabel;

      const softNav = [
        { label: "Hub", href: "#workspace-hub" },
        { label: section.labels.navTests || "Test Series", href: "#test-catalog", active: true },
        { label: section.labels.navSyllabus || "Syllabus", href: examDetailsHref(examSlug, "syllabus") },
        { label: section.labels.navPattern || "Exam Pattern", href: examDetailsHref(examSlug, "pattern") },
        { label: section.labels.navPreparation || "Preparation Resources", href: examDetailsHref(examSlug, "preparation") },
      ];

      return (
        <section key={section.id} id="test-catalog" className="mt-5 scroll-mt-24" aria-labelledby="test-catalog-heading">
          <nav className="max-w-full overflow-x-auto pb-2" aria-label={config.name + " exam navigation"}>
            <div className="inline-flex min-w-full items-center justify-center gap-1 rounded-2xl border border-blue-100 bg-blue-50/55 p-1.5 shadow-[0_4px_18px_rgba(37,99,235,0.04)]">
              {softNav.map((item) => (
                <a key={item.label} href={item.href} className={"inline-flex min-h-10 min-w-max items-center justify-center rounded-xl px-4 text-sm font-semibold transition " + (item.active ? "border border-blue-100 bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:bg-white/70 hover:text-slate-950")}>
                  {item.label}
                </a>
              ))}
              <button
                type="button"
                onClick={() => setActiveExamStage("pyq")}
                className={"inline-flex min-h-10 min-w-max items-center justify-center rounded-xl px-4 text-sm font-semibold transition " + (activeExamStage === "pyq" ? "border border-blue-100 bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:bg-white/70 hover:text-slate-950")}
              >
                {section.labels.navPyq || "Previous Year Papers"}
              </button>
              <a href={config.officialUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-10 min-w-max items-center justify-center rounded-xl px-4 text-sm font-semibold text-slate-600 transition hover:bg-white/70 hover:text-slate-950">
                {section.labels.navNotifications || "Notifications"}
              </a>
            </div>
          </nav>

          <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div role="tablist" aria-label={config.name + " exam stage"} className={"grid min-w-[560px] " + (hasMainsStage ? "grid-cols-3" : "grid-cols-2")}>
              {(hasMainsStage ? ([
                ["prelims", section.labels.prelims || hubStage1Label, stageCounts.prelims],
                ["mains", section.labels.mains || hubStage2Label, stageCounts.mains],
                ["pyq", section.labels.pyq || "Previous Year Papers", stageCounts.pyq],
              ] as const) : ([
                ["prelims", section.labels.prelims || hubStage1Label, stageCounts.prelims],
                ["pyq", section.labels.pyq || "Previous Year Papers", stageCounts.pyq],
              ] as const)).map(([stage, label, count]) => {
                const selected = activeExamStage === stage;
                return (
                  <button
                    key={stage}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setActiveExamStage(stage)}
                    className={"min-h-12 border-r border-slate-200 px-5 text-sm font-semibold last:border-r-0 " + (selected ? "bg-[#1375ea] text-white" : "bg-white text-slate-700 hover:bg-slate-50")}
                  >
                    {label}{section.showCounts && count > 0 ? <span className={"ml-2 text-xs " + (selected ? "text-white/70" : "text-slate-400")}>{count}</span> : null}
                  </button>
                );
              })}
            </div>
          </div>

          {activeExamStage !== "pyq" ? (
            <div className="mt-3 overflow-x-auto">
              <div role="tablist" aria-label={stageLabel + " test type"} className="grid min-w-[560px] grid-cols-3 border-b border-slate-200">
                {([
                  ["full-length", section.labels.fullTests || "Full Tests"],
                  ["sectional", section.labels.sectional || "Sectional Tests"],
                  ["topic-wise", section.labels.topicWise || "Topic-wise Tests"],
                ] as const).map(([type, label]) => {
                  const selected = activeTestType === type;
                  const count = flatTests.filter((test) => test.stage === activeExamStage && test.type === type).length;
                  return (
                    <button
                      key={type}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setActiveTestType(type)}
                      className={"min-h-11 border-b-2 px-4 text-sm font-semibold transition " + (selected ? "border-blue-600 bg-blue-50/50 text-blue-700" : "border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900")}
                    >
                      {label}{section.showCounts && count > 0 ? <span className="ml-2 text-xs text-slate-400">{count}</span> : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="test-catalog-heading" className="text-2xl font-semibold tracking-tight text-slate-950">{section.title || heading}</h2>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
                {section.description || (activeExamStage === "pyq"
                  ? "Practice actual and memory-based papers for this exam."
                  : "Attempt focused " + stageLabel.toLowerCase() + " " + typeLabel.toLowerCase() + " based on the latest exam pattern.")}
              </p>
              {section.body ? <p className="mt-2 max-w-3xl whitespace-pre-line text-sm leading-6 text-slate-600">{section.body}</p> : null}
            </div>
            {activeTests.length > 0 ? <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">{activeTests.length} Tests</span> : null}
          </div>

          <div className="mt-4 space-y-3">
            {activeTests.length > 0 ? activeTests.map((test) => <ExamHubFlatTestRow key={test.id} test={test} ctaLabel={section.ctaLabel} />) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8">
                <h3 className="font-semibold text-slate-900">Tests are being prepared</h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">This {stageLabel.toLowerCase()} category will appear here as soon as tests are published.</p>
              </div>
            )}
          </div>
        </section>
      );
    }

    if (section.type === "exam_information") {
      return (
        <section key={section.id} id="exam-information" className="mt-12 scroll-mt-24 border-t border-slate-200 pt-9" aria-labelledby={"exam-information-" + section.id}>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-600">{section.eyebrow || "Exam information"}</p>
          <h2 id={"exam-information-" + section.id} className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">{section.title || ("About " + config.name + " " + config.yearLabel)}</h2>
          {section.description ? <p className="mt-2 max-w-3xl whitespace-pre-line text-sm leading-6 text-slate-600">{section.description}</p> : null}
          {section.body ? <p className="mt-3 max-w-4xl whitespace-pre-line text-sm leading-7 text-slate-700">{section.body}</p> : null}
          <div className="mt-5">
            {manualCards.length > 0 ? <ConfiguredManualCards section={section} /> : <div className={sectionGridClass}>
              <div className={"rounded-2xl border p-5 " + sectionCardClass}><h3 className="font-semibold text-slate-950">Preparation guide</h3><p className="mt-2 text-sm leading-6 text-slate-600">{config.hub.preparationSummary}</p><Link href={examPreparationHref(examSlug)} className="mt-3 block font-semibold text-indigo-700 hover:underline">{section.ctaLabel || "Detailed preparation strategy"}</Link></div>
              <div className={"rounded-2xl border p-5 " + sectionCardClass}><h3 className="font-semibold text-slate-950">Syllabus & pattern</h3><p className="mt-2 text-sm leading-6 text-slate-600">{config.hub.syllabusSummary}</p><Link href={examSyllabusHref(examSlug)} className="mt-3 block font-semibold text-indigo-700 hover:underline">Full {config.name} syllabus</Link></div>
              <div className={"rounded-2xl border p-5 " + sectionCardClass}><h3 className="font-semibold text-slate-950">Official information</h3><p className="mt-2 text-sm leading-6 text-slate-600">Verify dates, eligibility, vacancies and current notices on the official exam authority website.</p><a href={config.officialUrl} target="_blank" rel="noreferrer" className="mt-3 block font-semibold text-indigo-700 hover:underline">Open {config.officialLabel}</a></div>
            </div>}
          </div>
        </section>
      );
    }

    if (section.type === "syllabus") {
      return (
        <section key={section.id} id="syllabus" className="mt-12 scroll-mt-24 border-t border-slate-200 pt-9">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-600">{section.eyebrow || "Exam structure"}</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">{section.title || (config.name + " syllabus & exam pattern")}</h2>
          {section.description ? <p className="mt-2 max-w-3xl whitespace-pre-line text-sm leading-6 text-slate-600">{section.description}</p> : null}
          {section.body ? <p className="mt-3 max-w-4xl whitespace-pre-line text-sm leading-7 text-slate-700">{section.body}</p> : null}
          <div className="mt-5">
            {manualCards.length > 0 ? <ConfiguredManualCards section={section} /> : <>
              <div className={sectionGridClass}>
                {config.syllabus.sections.map((item) => <div key={item.title} className={"rounded-2xl border p-4 " + sectionCardClass}><h3 className="font-semibold text-slate-950">{item.title}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{item.summary}</p></div>)}
              </div>
              <div className={"mt-4 grid gap-3 " + gridColumnsClass(Math.min(3, section.columns || 3))}>
                {config.syllabus.patternCards.map((card) => <div key={card.title} className={"rounded-2xl border p-4 " + sectionCardClass}><h3 className="font-semibold text-slate-950">{card.title}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{card.text}</p></div>)}
              </div>
            </>}
          </div>
          <Link href={section.ctaHref || examSyllabusHref(examSlug)} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:underline">{section.ctaLabel || "Open full syllabus page"}<ArrowRight className="h-4 w-4" /></Link>
        </section>
      );
    }

    if (section.type === "preparation") {
      return (
        <section key={section.id} id="preparation" className="mt-12 scroll-mt-24 border-t border-slate-200 pt-9">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-600">{section.eyebrow || "Study plan"}</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">{section.title || ("How to prepare for " + config.name + " " + config.yearLabel)}</h2>
          {section.description ? <p className="mt-2 max-w-3xl whitespace-pre-line text-sm leading-6 text-slate-600">{section.description}</p> : null}
          {section.body ? <p className="mt-3 max-w-4xl whitespace-pre-line text-sm leading-7 text-slate-700">{section.body}</p> : null}
          <div className="mt-5">
            {manualCards.length > 0 ? <ConfiguredManualCards section={section} /> : <div className={sectionGridClass}>{config.preparation.cards.map((card) => <div key={card.title} className={"rounded-2xl border p-4 " + sectionCardClass}><Sparkles className="h-5 w-5 text-indigo-600" /><h3 className="mt-3 font-semibold text-slate-950">{card.title}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{card.text}</p></div>)}</div>}
          </div>
          <Link href={section.ctaHref || examPreparationHref(examSlug)} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:underline">{section.ctaLabel || "Open complete preparation guide"}<ArrowRight className="h-4 w-4" /></Link>
        </section>
      );
    }

    if (section.type === "topic_practice") {
      return (
        <section key={section.id} className="mt-12 border-t border-slate-200 pt-9">
          <div className="flex items-center gap-2"><Target className="h-5 w-5 text-indigo-600" /><p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-600">{section.eyebrow || "Free practice"}</p></div>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">{section.title || ("Free " + config.name + " topic practice")}</h2>
          <p className="mt-2 max-w-3xl whitespace-pre-line text-sm leading-6 text-slate-600">{section.description || "Solve sample questions continuously without starting a timed mock. Each page includes answers and explanations."}</p>
          {section.body ? <p className="mt-3 max-w-4xl whitespace-pre-line text-sm leading-7 text-slate-700">{section.body}</p> : null}
          <div className="mt-5">
            {manualCards.length > 0 ? <ConfiguredManualCards section={section} /> : <div className={sectionGridClass}>{config.topics.map((topic) => <Link key={topic.slug} href={practiceTopicHref(topic.slug, examSlug)} className={"rounded-2xl border p-5 transition hover:-translate-y-0.5 hover:border-indigo-300 " + sectionCardClass}><p className="text-xs font-semibold uppercase tracking-[0.12em] text-indigo-600">{topic.subject}</p><h3 className="mt-2 text-lg font-semibold text-slate-950">{topic.name} Questions</h3><p className="mt-2 text-sm leading-6 text-slate-600">{topic.summary}</p></Link>)}</div>}
          </div>
        </section>
      );
    }

    return (
      <section key={section.id} className="mt-12 border-t border-slate-200 pt-9">
        {section.eyebrow ? <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-600">{section.eyebrow}</p> : null}
        {section.title ? <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">{section.title}</h2> : null}
        {section.description ? <p className="mt-2 max-w-3xl whitespace-pre-line text-sm leading-6 text-slate-600">{section.description}</p> : null}
        {section.body ? <div className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-700">{section.body}</div> : null}
        <div className="mt-5"><ConfiguredManualCards section={section} /></div>
        {section.ctaLabel && section.ctaHref ? (/^https?:\/\//i.test(section.ctaHref) ? <a href={section.ctaHref} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-indigo-700">{section.ctaLabel}<ArrowRight className="h-4 w-4" /></a> : <Link href={section.ctaHref} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-indigo-700">{section.ctaLabel}<ArrowRight className="h-4 w-4" /></Link>) : null}
      </section>
    );
  };

  return (
    <div className="bg-slate-50/45 pb-14">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
        <section id="workspace-hub" className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_8px_28px_rgba(15,23,42,0.04)] sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              {catalogExam?.icon ? (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
                  <CategoryIcon icon={catalogExam.icon} className="h-9 w-9" />
                </div>
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700"><BookOpenCheck className="h-7 w-7" /></div>
              )}
              <div className="min-w-0">
                <p className="text-[11px] font-black uppercase tracking-[0.14em] text-blue-600">Exam workspace</p>
                <h1 className="mt-1 text-2xl font-black tracking-[-0.03em] text-slate-950 sm:text-3xl">{config.name} {config.yearLabel}</h1>
                <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">Tests, previous papers, syllabus, exam pattern, preparation resources and official updates—all from one hub.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-bold">
              <span className="rounded-full bg-blue-50 px-3 py-1.5 text-blue-700">{flatTests.length} tests</span>
              <span className="rounded-full bg-violet-50 px-3 py-1.5 text-violet-700">{config.topics.length} practice topics</span>
            </div>
          </div>

          <div className={"mt-5 grid gap-3 sm:grid-cols-2 " + (hasMainsStage ? "lg:grid-cols-5" : "lg:grid-cols-4")}>
            {workspaceActions.map(({ key, title, text, icon: Icon, action, tone }) => (
              <button key={key} type="button" onClick={action} className={"group min-h-[112px] rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-sm " + workspaceTone[tone]}>
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/80"><Icon className="h-5 w-5" /></span>
                  <ArrowRight className="h-4 w-4 opacity-45 transition group-hover:translate-x-0.5 group-hover:opacity-80" />
                </div>
                <h2 className="mt-3 text-sm font-black text-slate-950">{title}</h2>
                <p className="mt-1 text-xs font-semibold text-slate-500">{text}</p>
              </button>
            ))}
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link href={examDetailsHref(examSlug, "syllabus")} className="flex min-h-16 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 text-sm font-bold text-slate-800 transition hover:border-blue-200 hover:bg-white">
              <BookOpen className="h-5 w-5 text-blue-600" /> Syllabus
            </Link>
            <Link href={examDetailsHref(examSlug, "pattern")} className="flex min-h-16 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 text-sm font-bold text-slate-800 transition hover:border-blue-200 hover:bg-white">
              <FileText className="h-5 w-5 text-cyan-600" /> Exam Pattern
            </Link>
            <Link href={examDetailsHref(examSlug, "preparation")} className="flex min-h-16 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 text-sm font-bold text-slate-800 transition hover:border-blue-200 hover:bg-white">
              <Sparkles className="h-5 w-5 text-violet-600" /> Preparation
            </Link>
            <Link href={examDetailsHref(examSlug, "updates")} className="flex min-h-16 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 text-sm font-bold text-slate-800 transition hover:border-blue-200 hover:bg-white">
              <Globe2 className="h-5 w-5 text-emerald-600" /> Official Updates
            </Link>
          </div>
        </section>

        {(catalog.error || seriesQuery.error || pageConfigQuery.error) ? (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
            Some live page information is temporarily unavailable. Available exam content is shown below.
          </div>
        ) : null}

        {orderedPageSections.filter((section) => !["hero", "exam_information", "syllabus", "preparation", "topic_practice"].includes(section.type) && !section.type.startsWith("details_")).map(renderSection)}
      </div>
    </div>
  );
}


export function ExamDetailsPage({ examSlug }: { examSlug: string }) {
  const config = requireConfig(examSlug);
  const catalog = useExamCatalog();
  const sessionUser = getSessionUser();
  const examCodes = useMemo(() => catalogExamCodesForSlug(examSlug).map((code) => code.toUpperCase()), [examSlug]);
  const catalogExam = useMemo(
    () => catalog.subcategories.find((exam) => examCodes.includes(exam.id.toUpperCase())),
    [catalog.subcategories, examCodes],
  );
  const pageConfigQuery = useQuery({
    queryKey: ["web-exam-page", examSlug],
    queryFn: () => getWebExamPageConfiguration(examSlug),
    staleTime: 60_000,
    retry: 1,
  });
  const rawPageConfiguration = pageConfigQuery.data?.configuration ?? null;
  const pageConfiguration = withDefaultExamDetailsSections(
    rawPageConfiguration ?? DEFAULT_WEB_EXAM_PAGE_CONFIGURATION,
  );
  const adminOwnsDetailsVisibility = Boolean(
    pageConfigQuery.data?.configured && rawPageConfiguration?.detailsBuilderInitialized,
  );
  const canonicalCustomSection = (section: WebExamPageSection) => {
    if (section.id === "details-eligibility") return config.details?.eligibility;
    if (section.id === "details-dates") return config.details?.dates;
    if (section.id === "details-salary") return config.details?.salary;
    if (section.id === "details-faq") return config.details?.faq;
    if (section.type === "details_updates") return config.details?.updates;
    return undefined;
  };
  const detailSections = useMemo(
    () => pageConfiguration.sections
      .filter((section) =>
        section.type.startsWith("details_") &&
        (section.isVisible || (!adminOwnsDetailsVisibility && Boolean(canonicalCustomSection(section)))),
      )
      .sort((a, b) => a.sortOrder - b.sortOrder),
    [adminOwnsDetailsVisibility, pageConfiguration.sections, config.details],
  );

  usePageMeta(
    config.name + " " + config.yearLabel + " Exam Details, Syllabus & Preparation",
    config.meta.syllabusDescription,
    { canonicalPath: examDetailsHref(examSlug), robots: config.isShell ? "noindex,follow" : "index,follow" },
  );

  const sectionAnchor = (section: WebExamPageSection) => {
    if (section.type === "details_overview") return "overview";
    if (section.type === "details_syllabus") return "syllabus";
    if (section.type === "details_pattern") return "pattern";
    if (section.type === "details_preparation") return "preparation";
    if (section.type === "details_practice") return "practice";
    if (section.type === "details_updates") return "updates";
    if (section.id === "details-eligibility") return "eligibility";
    if (section.id === "details-dates") return "dates";
    if (section.id === "details-salary") return "salary";
    if (section.id === "details-faq") return "faq";
    return "details-" + section.id.replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase();
  };
  const sectionDefaultLabel = (section: WebExamPageSection) => {
    if (section.type === "details_overview") return "Overview";
    if (section.type === "details_syllabus") return "Syllabus";
    if (section.type === "details_pattern") return "Exam Pattern";
    if (section.type === "details_preparation") return "Preparation";
    if (section.type === "details_practice") return "Practice Topics";
    if (section.type === "details_updates") return "Updates";
    return section.title || "More Details";
  };

  const findDetailCard = (section: "eligibility" | "dates" | "salary" | "updates", titleIncludes: string) =>
    config.details?.[section]?.cards.find((card) => card.title.toLowerCase().includes(titleIncludes.toLowerCase()));

  const vacancyCard = findDetailCard("dates", "vacanc");
  const selectionCard = findDetailCard("eligibility", "selection stages");
  const salaryCard = findDetailCard("salary", "starting basic pay");
  const vacancyMatch = vacancyCard?.text.match(/[\d,]+/);
  const summaryFacts = [
    { label: "Official source", value: config.officialLabel, icon: Landmark },
    ...(config.yearLabel && config.yearLabel !== "Exam" ? [{ label: "Current cycle", value: config.yearLabel, icon: CalendarDays }] : []),
    ...(vacancyMatch ? [{ label: "Vacancies", value: vacancyMatch[0], icon: Users }] : []),
    ...(salaryCard ? [{ label: "Starting basic pay", value: salaryCard.text.split(".")[0], icon: FileText }] : []),
  ].slice(0, 4);

  const patternRows = config.syllabus.sections
    .map((item) => {
      const stageMatch = item.title.match(/^(Prelims|Mains|Main)\s*·\s*(.+)$/i);
      if (!stageMatch) return null;
      const bits = item.summary.split("·").map((part) => part.trim()).filter(Boolean);
      return {
        stage: /^prelims/i.test(stageMatch[1]) ? "Preliminary Exam" : "Main Exam",
        section: stageMatch[2],
        questions: bits[0] ?? "—",
        marks: bits[1] ?? "—",
        duration: bits[2] ?? "—",
        medium: bits.slice(3).join(" · "),
      };
    })
    .filter((row): row is NonNullable<typeof row> => Boolean(row));

  const patternStages = Array.from(new Set(patternRows.map((row) => row.stage)));
  const showPatternTable = patternRows.length >= 3 && patternStages.length >= 1;

  const detailsRow = (
    key: string,
    title: string,
    text: string,
    badge?: string,
    ctaLabel?: string,
    href?: string,
  ) => {
    const inner = (
      <div className="grid gap-2 px-0 py-5 sm:grid-cols-[210px_minmax(0,1fr)] sm:gap-7">
        <div>
          {badge ? <span className="mb-2 inline-flex rounded-md bg-blue-50 px-2 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-blue-700">{badge}</span> : null}
          <h3 className="text-sm font-bold leading-6 text-slate-950">{title}</h3>
        </div>
        <div>
          <p className="whitespace-pre-line text-sm leading-7 text-slate-600">{text}</p>
          {ctaLabel && href ? <span className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-blue-700">{ctaLabel}<ArrowRight className="h-4 w-4" /></span> : null}
        </div>
      </div>
    );
    if (!href) return <div key={key}>{inner}</div>;
    return /^https?:\/\//i.test(href)
      ? <a key={key} href={href} target="_blank" rel="noreferrer" className="block hover:bg-slate-50/70">{inner}</a>
      : <Link key={key} href={href} className="block hover:bg-slate-50/70">{inner}</Link>;
  };

  const renderDetailsSection = (section: WebExamPageSection) => {
    const anchor = sectionAnchor(section);
    const manualCards = (section.cards ?? []).filter((card) => card.isVisible).sort((a, b) => a.sortOrder - b.sortOrder);
    const canonicalCustom = canonicalCustomSection(section);
    const title =
      section.title ||
      canonicalCustom?.title ||
      (section.type === "details_overview" ? "About " + config.name + " " + config.yearLabel :
      section.type === "details_syllabus" ? config.syllabus.title :
      section.type === "details_pattern" ? config.name + " " + config.yearLabel + " exam pattern" :
      section.type === "details_preparation" ? config.preparation.title :
      section.type === "details_practice" ? "Topic-wise preparation areas" :
      section.type === "details_updates" ? config.name + " official information" :
      "More about " + config.name);
    const eyebrow =
      section.eyebrow ||
      canonicalCustom?.eyebrow ||
      (section.type === "details_overview" ? "Overview" :
      section.type === "details_syllabus" ? config.syllabus.eyebrow :
      section.type === "details_pattern" ? "Exam pattern" :
      section.type === "details_preparation" ? config.preparation.eyebrow :
      section.type === "details_practice" ? "Practice topics" :
      section.type === "details_updates" ? "Updates & official notices" :
      "Exam details");
    const description =
      section.description ||
      canonicalCustom?.description ||
      (section.type === "details_overview" ? config.hub.description :
      section.type === "details_syllabus" ? config.syllabus.description :
      section.type === "details_preparation" ? config.preparation.description :
      section.type === "details_practice" ? "Use focused topic practice before moving back to sectional and full-length tests." :
      section.type === "details_updates" ? config.syllabus.verificationNote :
      "");

    let content: ReactNode = null;

    if (manualCards.length > 0) {
      content = (
        <div className="divide-y divide-slate-200 border-y border-slate-200">
          {manualCards.map((card) => detailsRow(card.id, card.title, card.text, card.badge, card.ctaLabel, card.href))}
        </div>
      );
    } else if (canonicalCustom?.cards.length) {
      content = (
        <div className="divide-y divide-slate-200 border-y border-slate-200">
          {canonicalCustom.cards.map((card, index) => detailsRow(String(index), card.title, card.text, card.badge, card.ctaLabel, card.href))}
        </div>
      );
    } else if (section.type === "details_overview") {
      const rows = [
        ["Preparation focus", config.hub.preparationSummary],
        ["Syllabus focus", config.hub.syllabusSummary],
        ["Practice focus", config.hub.mockSummary],
      ];
      content = <div className="divide-y divide-slate-200 border-y border-slate-200">{rows.map(([rowTitle, text], index) => detailsRow(String(index), rowTitle, text))}</div>;
    } else if (section.type === "details_syllabus") {
      content = <div className="divide-y divide-slate-200 border-y border-slate-200">{config.syllabus.sections.map((item) => detailsRow(item.title, item.title, item.summary))}</div>;
    } else if (section.type === "details_pattern") {
      content = showPatternTable ? (
        <div className="grid gap-5 xl:grid-cols-2">
          {patternStages.map((stage) => {
            const rows = patternRows.filter((row) => row.stage === stage);
            return (
              <div key={stage} className="overflow-hidden rounded-xl border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
                  <h3 className="font-black text-slate-950">{stage}</h3>
                  <span className="rounded-md bg-blue-50 px-2 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-blue-700">{stage === "Preliminary Exam" ? "Stage 1" : "Stage 2"}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] border-collapse text-left text-xs">
                    <thead className="bg-white text-slate-500">
                      <tr>
                        <th className="border-b border-slate-200 px-4 py-3 font-bold">Section</th>
                        <th className="border-b border-slate-200 px-3 py-3 font-bold">Questions</th>
                        <th className="border-b border-slate-200 px-3 py-3 font-bold">Marks</th>
                        <th className="border-b border-slate-200 px-3 py-3 font-bold">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row) => (
                        <tr key={row.section} className="align-top">
                          <td className="border-b border-slate-100 px-4 py-3 font-semibold text-slate-800">{row.section}</td>
                          <td className="border-b border-slate-100 px-3 py-3 text-slate-600">{row.questions.replace(/\s*questions?/i, "")}</td>
                          <td className="border-b border-slate-100 px-3 py-3 text-slate-600">{row.marks.replace(/\s*marks?/i, "")}</td>
                          <td className="border-b border-slate-100 px-3 py-3 text-slate-600">{row.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
          <div className="xl:col-span-2 divide-y divide-slate-200 border-y border-slate-200">
            {config.syllabus.patternCards.map((card) => detailsRow(card.title, card.title, card.text))}
          </div>
        </div>
      ) : (
        <div className="divide-y divide-slate-200 border-y border-slate-200">{config.syllabus.patternCards.map((card) => detailsRow(card.title, card.title, card.text))}</div>
      );
    } else if (section.type === "details_preparation") {
      content = (
        <div className="space-y-7">
          <ol className="space-y-5">
            {config.preparation.cards.map((card, index) => (
              <li key={card.title} className="grid gap-3 sm:grid-cols-[42px_minmax(0,1fr)]">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-white">{index + 1}</span>
                <div><h3 className="font-bold text-slate-950">{card.title.replace(/^\d+\.\s*/, "")}</h3><p className="mt-1 text-sm leading-7 text-slate-600">{card.text}</p></div>
              </li>
            ))}
          </ol>
          {config.preparation.weeklyCycle.length ? (
            <div className="border-l-4 border-blue-600 bg-slate-50 px-5 py-5">
              <h3 className="font-bold text-slate-950">Weekly preparation cycle</h3>
              <div className="mt-3 text-sm leading-7 text-slate-600"><CheckList items={config.preparation.weeklyCycle} /></div>
            </div>
          ) : null}
        </div>
      );
    } else if (section.type === "details_practice") {
      content = config.topics.length > 0 ? (
        <div className="grid gap-x-8 gap-y-0 sm:grid-cols-2">
          {config.topics.map((topic) => (
            <Link key={topic.slug} href={practiceTopicHref(topic.slug, examSlug)} className="group border-b border-slate-200 py-5">
              <p className="text-[10px] font-black uppercase tracking-[0.12em] text-blue-600">{topic.subject}</p>
              <div className="mt-1 flex items-start justify-between gap-4"><h3 className="font-bold text-slate-950 group-hover:text-blue-700">{topic.name}</h3><ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-400 group-hover:text-blue-700" /></div>
              <p className="mt-1 text-sm leading-6 text-slate-600">{topic.summary}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="border-l-4 border-slate-300 bg-slate-50 px-5 py-4 text-sm leading-6 text-slate-600">Topic-wise practice has not been published for this exam yet. It will appear here automatically once verified practice content is mapped to the exam.</div>
      );
    } else if (section.type === "details_updates") {
      content = (
        <div className="divide-y divide-slate-200 border-y border-slate-200">
          {detailsRow("cycle", "Current preparation cycle", config.yearLabel)}
          {detailsRow("notice", "Verification note", "Dates, vacancies, eligibility and detailed rules can change. Use the official authority notice as the final source for time-sensitive information.", "Important")}
        </div>
      );
    }

    return (
      <section key={section.id} id={anchor} className="scroll-mt-28 border-b border-slate-200 py-9 first:pt-0 last:border-b-0">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-3xl">
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-blue-700">{eyebrow}</p>
            <h2 className="mt-1 text-2xl font-black tracking-[-0.025em] text-slate-950 sm:text-[28px]">{title}</h2>
            {description ? <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-600">{description}</p> : null}
            {(section.body || canonicalCustom?.body) ? <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">{section.body || canonicalCustom?.body}</p> : null}
          </div>
          {section.type === "details_updates" ? (
            <a href={section.ctaHref || config.officialUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-10 shrink-0 items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800">
              {section.ctaLabel || "Open " + config.officialLabel} <ArrowRight className="h-4 w-4" />
            </a>
          ) : section.ctaLabel && section.ctaHref ? (
            /^https?:\/\//i.test(section.ctaHref)
              ? <a href={section.ctaHref} target="_blank" rel="noreferrer" className="inline-flex min-h-10 shrink-0 items-center gap-2 text-sm font-bold text-blue-700">{section.ctaLabel}<ArrowRight className="h-4 w-4" /></a>
              : <Link href={section.ctaHref} className="inline-flex min-h-10 shrink-0 items-center gap-2 text-sm font-bold text-blue-700">{section.ctaLabel}<ArrowRight className="h-4 w-4" /></Link>
          ) : null}
        </div>
        {content}
      </section>
    );
  };

  const detailsPath = examDetailsHref(examSlug);
  const loginHref = "/login/student?next=" + encodeURIComponent(detailsPath);
  const signupHref = "/login/student?mode=signup&next=" + encodeURIComponent(detailsPath);

  return (
    <div className="bg-white pb-16">
      <div className="mx-auto w-full max-w-[1320px] px-4 py-5 sm:px-6 lg:px-8">
        <header className="border-b border-slate-200 pb-6">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
            <Link href={config.categoryHref} className="hover:text-blue-700">{marketingCategoryLabel(config.name)}</Link>
            <span>/</span>
            <span>{config.name}</span>
            <span>/</span>
            <span className="text-slate-800">Exam Details</span>
          </div>

          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              {catalogExam?.icon ? (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white p-2.5">
                  <CategoryIcon icon={catalogExam.icon} className="h-10 w-10" />
                </div>
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700"><BookOpenCheck className="h-8 w-8" /></div>
              )}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl font-black tracking-[-0.035em] text-slate-950 sm:text-4xl">{config.name}</h1>
                  {config.yearLabel && config.yearLabel !== "Exam" ? <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-700">{config.yearLabel}</span> : null}
                </div>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">{config.meta.syllabusDescription}</p>
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-slate-500">
                  <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-600" /> Exam information</span>
                  <a href={config.officialUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-blue-700"><Globe2 className="h-4 w-4" /> Official source: {config.officialLabel}</a>
                </div>
              </div>
            </div>

            {sessionUser ? (
              <Link href={examHubHref(examSlug)} className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-bold text-white hover:bg-slate-800">
                Open Test Workspace <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            ) : (
              <div className="flex shrink-0 items-center gap-2">
                <Link href={loginHref} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-bold text-slate-800 hover:bg-slate-50">Login</Link>
                <Link href={signupHref} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-700">Sign up</Link>
              </div>
            )}
          </div>

          {summaryFacts.length ? (
            <div className="mt-6 grid gap-0 overflow-hidden rounded-xl border border-slate-200 sm:grid-cols-2 lg:grid-cols-4">
              {summaryFacts.map((fact, index) => {
                const Icon = fact.icon;
                return (
                  <div key={fact.label} className={"flex items-center gap-3 px-4 py-4 " + (index ? "border-t border-slate-200 sm:border-t-0 sm:border-l" : "")}>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700"><Icon className="h-4 w-4" /></span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">{fact.label}</p>
                      <p className="mt-0.5 truncate text-sm font-bold text-slate-900">{fact.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}

          <div className="mt-6 flex items-center gap-1 overflow-x-auto border-y border-slate-200 py-2">
            <Link href={sessionUser ? examHubHref(examSlug) : loginHref} className="mr-2 inline-flex min-h-9 shrink-0 items-center rounded-lg bg-slate-950 px-3.5 text-xs font-bold text-white">
              {sessionUser ? "Test Workspace" : "Login for Tests"}
            </Link>
            {detailSections.map((section) => (
              <a key={section.id} href={"#" + sectionAnchor(section)} className="inline-flex min-h-9 shrink-0 items-center rounded-lg px-3.5 text-xs font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-950">
                {sectionDefaultLabel(section)}
              </a>
            ))}
          </div>
        </header>

        {pageConfigQuery.error ? <div className="mt-5 border-l-4 border-amber-400 bg-amber-50 px-4 py-3 text-sm text-amber-950">Custom details configuration is temporarily unavailable. Canonical exam information is shown below.</div> : null}

        <div className="mt-8 grid gap-8 lg:grid-cols-[190px_minmax(0,1fr)] xl:grid-cols-[190px_minmax(0,1fr)_290px] xl:gap-10">
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">On this page</p>
              <nav className="border-l border-slate-200" aria-label={config.name + " detail sections"}>
                {detailSections.map((section) => (
                  <a key={section.id} href={"#" + sectionAnchor(section)} className="block border-l-2 border-transparent px-4 py-2.5 text-sm font-semibold text-slate-600 hover:border-blue-600 hover:bg-blue-50/60 hover:text-blue-700">
                    {sectionDefaultLabel(section)}
                  </a>
                ))}
              </nav>
              <div className="mt-6 border-t border-slate-200 pt-5">
                <a href={config.officialUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-700"><Globe2 className="h-4 w-4" /> Official website</a>
              </div>
            </div>
          </aside>

          <main className="min-w-0">
            {detailSections.map(renderDetailsSection)}
          </main>

          <aside className="hidden xl:block">
            <div className="sticky top-24 space-y-5">
              {config.details?.updates?.cards.length ? (
                <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                    <h2 className="text-sm font-black text-slate-950">Latest Updates</h2>
                    <a href="#updates" className="text-xs font-bold text-blue-700 hover:underline">View all</a>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {config.details.updates.cards.slice(0, 3).map((card) => (
                      <div key={card.title} className="px-4 py-4">
                        {card.badge ? <p className="text-[10px] font-black uppercase tracking-[0.08em] text-emerald-700">{card.badge}</p> : null}
                        <h3 className="mt-1 text-sm font-bold leading-5 text-slate-900">{card.title}</h3>
                        <p className="mt-1 line-clamp-3 text-xs leading-5 text-slate-500">{card.text}</p>
                        {card.href && card.ctaLabel ? (
                          /^https?:\/\//i.test(card.href)
                            ? <a href={card.href} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-blue-700">{card.ctaLabel}<ArrowRight className="h-3.5 w-3.5" /></a>
                            : <Link href={card.href} className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-blue-700">{card.ctaLabel}<ArrowRight className="h-3.5 w-3.5" /></Link>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">Official information</p>
                <p className="mt-2 text-xs leading-5 text-slate-600">Always verify time-sensitive dates, vacancies and eligibility against the responsible authority.</p>
                <a href={config.officialUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-blue-700"><Globe2 className="h-3.5 w-3.5" /> {config.officialLabel}</a>
              </section>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export function ExamPreparationPage({ examSlug }: { examSlug: string }) {
  const config = requireConfig(examSlug);
  usePageMeta(config.meta.preparationTitle, config.meta.preparationDescription, { canonicalPath: examPreparationHref(examSlug), robots: config.isShell ? "noindex,follow" : "index,follow" });

  return (
    <PublicPage eyebrow={config.preparation.eyebrow} title={config.preparation.title} description={config.preparation.description}>
      <div className="grid gap-4 lg:grid-cols-3">
        {config.preparation.cards.map((card) => <PublicCard key={card.title} title={card.title}>{card.text}</PublicCard>)}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold text-slate-950">A workable weekly cycle</h2>
        <div className="mt-4 text-sm leading-7 text-slate-600"><CheckList items={config.preparation.weeklyCycle} /></div>
      </div>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-slate-950">Start with free topic practice</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {config.topics.map((topic) => (
            <Link key={topic.slug} href={practiceTopicHref(topic.slug, examSlug)} className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-800 hover:border-indigo-300 hover:bg-white">
              {topic.name} questions
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href={examSyllabusHref(examSlug)} className="rounded-xl bg-[#1e1b4b] px-4 py-3 text-sm font-semibold text-white">View {config.name} syllabus</Link>
        <Link href={config.categoryHref} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800">Browse {config.name} mock tests</Link>
      </div>
    </PublicPage>
  );
}

export function ExamSyllabusPage({ examSlug }: { examSlug: string }) {
  const config = requireConfig(examSlug);
  usePageMeta(config.meta.syllabusTitle, config.meta.syllabusDescription, { canonicalPath: examSyllabusHref(examSlug), robots: config.isShell ? "noindex,follow" : "index,follow" });

  return (
    <PublicPage eyebrow={config.syllabus.eyebrow} title={config.syllabus.title} description={config.syllabus.description}>
      <div className="grid gap-4 md:grid-cols-2">
        {config.syllabus.sections.map((section) => <PublicCard key={section.title} title={section.title}>{section.summary}</PublicCard>)}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {config.syllabus.patternCards.map((card) => <PublicCard key={card.title} title={card.title}>{card.text}</PublicCard>)}
      </div>

      <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
        {config.syllabus.verificationNote} <a href={config.officialUrl} target="_blank" rel="noreferrer" className="font-semibold underline">{config.officialLabel}</a>.
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={examPreparationHref(examSlug)} className="rounded-xl bg-[#1e1b4b] px-4 py-3 text-sm font-semibold text-white">How to prepare</Link>
        <Link href={examHubHref(examSlug)} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800">{config.name} hub</Link>
      </div>
    </PublicPage>
  );
}

function QuestionCard({ question, index }: { question: PublicPracticeQuestion; index: number }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-indigo-600">Question {index + 1}</p>
        {question.difficulty ? <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{question.difficulty}</span> : null}
      </div>
      <MathText content={question.text} className="mt-4 text-base font-semibold leading-7 text-slate-950" />
      <div className="mt-5 grid gap-2.5">
        {question.options.map((option, optionIndex) => {
          const isCorrect = revealed && optionIndex === question.correctOptionIndex;
          return (
            <div key={question.id + "-" + optionIndex} className={"rounded-xl border px-4 py-3 text-sm leading-6 " + (isCorrect ? "border-emerald-300 bg-emerald-50 text-emerald-950" : "border-slate-200 bg-slate-50 text-slate-700")}>
              <div className="flex gap-3">
                <span className="font-bold text-slate-500">{String.fromCharCode(65 + optionIndex)}.</span>
                <MathText content={option} className="min-w-0 flex-1" />
                {isCorrect ? <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" aria-label="Correct answer" /> : null}
              </div>
            </div>
          );
        })}
      </div>

      <button type="button" onClick={() => setRevealed((value) => !value)} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-800 hover:bg-indigo-100" aria-expanded={revealed}>
        {revealed ? "Hide answer" : "Show answer & explanation"}
        <ChevronDown className={"h-4 w-4 transition " + (revealed ? "rotate-180" : "")} />
      </button>

      {revealed ? (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-bold text-emerald-950">Correct answer: {String.fromCharCode(65 + question.correctOptionIndex)}</p>
          {question.explanation ? <MathText content={question.explanation} className="mt-2 text-sm leading-7 text-emerald-950/85" /> : <p className="mt-2 text-sm text-emerald-900/80">The approved answer is shown above.</p>}
        </div>
      ) : null}
    </article>
  );
}

export function ExamTopicQuestionsPage({ examSlug, topicSlug }: { examSlug: string; topicSlug: string | undefined }) {
  const config = requireConfig(examSlug);
  const topic = findPracticeTopic(examSlug, topicSlug);

  usePageMeta(
    topic ? topic.name + " Questions for " + config.name + " – Free Practice" : config.name + " Free Practice Questions",
    topic ? "Solve free " + topic.name + " questions for " + config.name + " with answers and explanations. Practice continuously before moving to timed mock tests." : "Free " + config.name + " topic-wise practice questions with answers and explanations.",
    topic ? { canonicalPath: practiceTopicHref(topic.slug, examSlug) } : { robots: "noindex,follow" },
  );

  const query = useQuery({
    queryKey: ["public-practice", examSlug, topic?.slug],
    queryFn: () => apiRequest<PublicPracticeResponse>("/public/practice/" + encodeURIComponent(examSlug) + "/" + encodeURIComponent(topic!.slug) + "?limit=10"),
    enabled: Boolean(topic),
    retry: 1,
    staleTime: 5 * 60_000,
  });

  if (!topic) {
    return (
      <PublicPage eyebrow={config.name + " practice"} title="Practice topic not found" description={"Choose one of the published " + config.name + " practice topics."}>
        <Link href={examHubHref(examSlug)} className="font-semibold text-indigo-700 hover:underline">Return to {config.name} preparation</Link>
      </PublicPage>
    );
  }

  const otherTopics = config.topics.filter((item) => item.slug !== topic.slug).slice(0, 5);

  return (
    <PublicPage eyebrow={topic.subject + " · Free practice"} title={topic.name + " Questions for " + config.name} description={topic.summary + " Reveal each answer only after attempting the question, and use the explanation to review mistakes."}>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section>
          <div className="mb-5 rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
            <h2 className="font-semibold text-indigo-950">How to use this page</h2>
            <p className="mt-2 text-sm leading-6 text-indigo-900/80">{topic.preparationTip} These are free sample questions from ExamTree&apos;s published practice content; use full mock tests when you are ready for timed exam simulation.</p>
          </div>

          {query.isLoading ? (
            <div className="flex min-h-56 items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm text-slate-600"><Loader2 className="mr-2 h-5 w-5 animate-spin" />Loading published questions…</div>
          ) : query.error ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">This topic&apos;s public sample set is temporarily unavailable. You can still continue with mock tests or another free topic.</div>
          ) : query.data?.questions.length ? (
            <div className="space-y-5">{query.data.questions.map((question, index) => <QuestionCard key={question.id} question={question} index={index} />)}</div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-700">No public sample questions are published for this topic yet. The page will begin serving questions automatically when matching approved questions are published.</div>
          )}

          <div className="mt-6 rounded-2xl bg-[#1e1b4b] p-6 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-200">Next step</p>
            <h2 className="mt-2 text-xl font-semibold">Move from free practice to timed {config.name} mocks</h2>
            <p className="mt-2 text-sm leading-6 text-indigo-100">Use topic practice to fix concepts, then test speed and accuracy under exam-like timing.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href={config.categoryHref} className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#1e1b4b]">Browse {config.name} tests</Link>
              <Link href={examPreparationHref(examSlug)} className="rounded-xl border border-white/25 px-4 py-2.5 text-sm font-semibold text-white">Preparation guide</Link>
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold text-slate-950">More {config.name} topics</h2>
            <div className="mt-3 space-y-2">
              {otherTopics.map((item) => <Link key={item.slug} href={practiceTopicHref(item.slug, examSlug)} className="block rounded-lg bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-800">{item.name} questions</Link>)}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
            <h2 className="font-semibold text-slate-950">Related pages</h2>
            <Link href={examSyllabusHref(examSlug)} className="mt-3 block font-semibold text-indigo-700 hover:underline">{config.name} syllabus</Link>
            <Link href={examPreparationHref(examSlug)} className="mt-2 block font-semibold text-indigo-700 hover:underline">How to prepare for {config.name}</Link>
            <Link href={examHubHref(examSlug)} className="mt-2 block font-semibold text-indigo-700 hover:underline">{config.name} preparation hub</Link>
          </div>
        </aside>
      </div>
    </PublicPage>
  );
}

