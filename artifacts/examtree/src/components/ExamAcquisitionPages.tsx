import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight, BookOpenCheck, CheckCircle2, ChevronDown, FileText, Loader2, Sparkles, Target } from "lucide-react";

import MathText from "@/components/MathText";
import { CategoryIcon } from "@/components/CategoryIcon";
import { CheckList, PublicCard, PublicPage, usePageMeta } from "@/components/PublicPage";
import { apiRequest } from "@/lib/api";
import type { Test } from "@/lib/data";
import { getStudentTestSeries, type StudentSeriesCatalogTest, type StudentSeriesSummary } from "@/lib/test-series";
import { DEFAULT_WEB_EXAM_PAGE_CONFIGURATION, getWebExamPageConfiguration, type WebExamCardStyle, type WebExamPageSection, type WebExamSectionLayout } from "@/lib/web-exam-page";
import { useExamCatalog } from "@/providers/ExamCatalogProvider";
import {
  catalogExamCodesForSlug,
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

type ExamHubCatalogItem = {
  id: string;
  title: string;
  description: string;
  href?: string;
  badge: string;
  meta: string;
  iconUrl?: string | null;
  comingSoon?: boolean;
  seriesId?: string;
  progressionMode?: "open" | "sequential" | "score_gated";
  seriesTests?: StudentSeriesCatalogTest[];
};

type ExamHubFlatTest = {
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
};

function flatTestType(test: Test): ExamHubFlatTest["type"] {
  const text = testSearchText(test);
  if (isPyqText(text)) return "pyq";
  if (test.kind === "sectional") return "sectional";
  if (test.kind === "topic-wise") return "topic-wise";
  return "full-length";
}

function preferredStage(stage: "prelims" | "mains" | "general", searchText: string): "prelims" | "mains" | "general" {
  if (stage !== "general") return stage;
  const inferred = stageFromText(searchText);
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

function stageFromText(value: string): "prelims" | "mains" | "general" {
  const prelims = /\bprelims?\b|\bpreliminary\b|\bpre\b/.test(value);
  const mains = /\bmains?\b|\bmain examination\b|\bmain\b/.test(value);
  if (prelims && !mains) return "prelims";
  if (mains && !prelims) return "mains";
  return "general";
}

function progressionLabel(mode: ExamHubCatalogItem["progressionMode"]) {
  if (mode === "sequential") return "Complete in order";
  if (mode === "score_gated") return "Score-gated";
  return "Open access";
}

function tabLabelForSection(title: string, labels: Record<string, string> = {}) {
  const value = title.toLowerCase();
  if (/prelims?|preliminary/.test(value)) return labels.prelims || "Prelims";
  if (/mains?|main exam/.test(value)) return labels.mains || "Mains";
  if (/\bpyq\b|previous[ -]?year/.test(value)) return labels.pyq || "PYQ";
  if (/sectional/.test(value)) return labels.sectional || "Sectional";
  if (/topic[ -]?wise/.test(value)) return labels.topicWise || "Topic-wise";
  if (/more test/.test(value)) return labels.more || "More";
  return title;
}

function seriesItem(series: StudentSeriesSummary): ExamHubCatalogItem {
  const comingSoon = series.learnerVisibility === "coming_soon";
  const liveCount = series.tests?.length ?? series.liveTestCount ?? 0;
  return {
    id: "series-" + series.id,
    title: series.name,
    description: compact(series.description) || (comingSoon ? series.learnerMessage : "ExamTree test series"),
    badge: comingSoon ? "Coming Soon" : "Test Series",
    meta: liveCount === 1 ? "1 live test" : liveCount + " live tests",
    iconUrl: series.iconUrl,
    comingSoon,
    seriesId: series.id,
    progressionMode: series.progressionMode,
    seriesTests: series.tests ?? [],
  };
}

function testItem(test: Test): ExamHubCatalogItem {
  const kind = test.kind === "sectional" ? "Sectional" : test.kind === "topic-wise" ? "Topic-wise" : "Full Length";
  const access = (test.access ?? "free") === "free" ? "Free" : "Premium";
  return {
    id: "test-" + test.id,
    title: test.name,
    description: compact(test.subcategoryName) ? compact(test.subcategoryName) + " · " + kind : kind + " test",
    href: "/test/" + encodeURIComponent(test.id),
    badge: access,
    meta: test.totalQuestions + " questions · " + test.duration + " min",
    iconUrl: test.iconUrl,
  };
}

function SeriesTestRow({ test, seriesId, ctaLabel }: { test: StudentSeriesCatalogTest; seriesId: string; ctaLabel?: string }) {
  const durationMinutes = Math.max(1, Math.ceil(Number(test.durationSeconds || 0) / 60));
  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 first:border-t-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
          {test.iconUrl ? <img src={test.iconUrl} alt="" className="h-full w-full object-contain p-1" /> : <FileText className="h-4 w-4 text-indigo-600" />}
        </div>
        <div className="min-w-0">
          <h4 className="font-semibold leading-5 text-slate-950">{test.title}</h4>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {test.questionCount} questions · {durationMinutes} min{Number(test.totalMarks) > 0 ? " · " + test.totalMarks + " marks" : ""}
          </p>
          {test.description ? <p className="mt-1 line-clamp-1 text-xs text-slate-400">{test.description}</p> : null}
        </div>
      </div>
      <Link
        href={"/test/" + encodeURIComponent(test.testId) + "?seriesId=" + encodeURIComponent(seriesId)}
        className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-xl bg-[#6657e8] px-4 text-sm font-semibold text-white transition hover:bg-[#594bd9]"
      >
        {ctaLabel || "Start test"}
      </Link>
    </div>
  );
}

function ExamHubCatalogSection({
  id,
  title,
  description,
  items,
  emptyMessage,
  layout = "list",
  columns = 1,
  cardStyle = "default",
  ctaLabel,
}: {
  id: string;
  title: string;
  description: string;
  items: ExamHubCatalogItem[];
  emptyMessage: string;
  layout?: WebExamSectionLayout;
  columns?: number;
  cardStyle?: WebExamCardStyle;
  ctaLabel?: string;
}) {
  const containerClass =
    layout === "horizontal"
      ? "flex snap-x gap-4 overflow-x-auto pb-2"
      : layout === "grid" || layout === "cards"
        ? "grid gap-4"
        : "space-y-4";
  const gridColumnsClass =
    columns >= 4 ? "lg:grid-cols-4" : columns === 3 ? "lg:grid-cols-3" : columns === 2 ? "md:grid-cols-2" : "grid-cols-1";
  const cardClass =
    cardStyle === "minimal" ? "border-transparent shadow-none" :
    cardStyle === "featured" ? "border-indigo-200 shadow-[0_10px_28px_rgba(79,70,229,0.08)]" :
    cardStyle === "compact" ? "border-slate-200 shadow-none" :
    "border-slate-200 shadow-[0_5px_18px_rgba(15,23,42,0.035)]";

  return (
    <section id={id} role="tabpanel" className="rounded-2xl border border-slate-200 bg-slate-50/60 p-3 sm:p-4">
      <div className="px-1 pb-3">
        <h3 className="text-xl font-semibold tracking-tight text-slate-950">{title}</h3>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">{description}</p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-7">
          <p className="text-sm font-semibold text-slate-700">{emptyMessage}</p>
        </div>
      ) : (
        <div className={containerClass + ((layout === "grid" || layout === "cards") ? " " + gridColumnsClass : "")}>
          {items.map((item) => item.seriesId ? (
            <article key={item.id} className={"overflow-hidden rounded-2xl border bg-white " + cardClass + (layout === "horizontal" ? " w-[86vw] max-w-[430px] shrink-0 snap-start" : "")}>
              <div className="p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                    {item.iconUrl ? <img src={item.iconUrl} alt="" className="h-full w-full object-contain p-1" /> : <FileText className="h-5 w-5 text-indigo-600" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={"rounded-full px-2 py-0.5 text-[10px] font-bold " + (item.comingSoon ? "bg-amber-50 text-amber-700" : "bg-indigo-50 text-indigo-700")}>{item.badge}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">{progressionLabel(item.progressionMode)}</span>
                      <span className="text-[11px] font-semibold text-slate-400">{item.meta}</span>
                    </div>
                    <h4 className="mt-2 text-base font-semibold text-slate-950">{item.title}</h4>
                    <p className="mt-1 text-sm leading-5 text-slate-500">{item.description}</p>
                  </div>
                </div>
              </div>

              {item.seriesTests?.length ? (
                <div className="border-t border-slate-200 bg-white">
                  {item.seriesTests.map((test) => <SeriesTestRow key={test.id} test={test} seriesId={item.seriesId!} ctaLabel={ctaLabel} />)}
                </div>
              ) : (
                <div className="border-t border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-500">
                  {item.comingSoon ? item.description : "No live tests are published in this series yet."}
                </div>
              )}
            </article>
          ) : (
            <article key={item.id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  {item.iconUrl ? <img src={item.iconUrl} alt="" className="h-full w-full object-contain p-1" /> : <FileText className="h-5 w-5 text-indigo-600" />}
                </div>
                <div className="min-w-0">
                  <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700">{item.badge}</span>
                  <h4 className="mt-2 font-semibold text-slate-950">{item.title}</h4>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{item.meta}</p>
                </div>
              </div>
              {item.href ? <Link href={item.href} className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-xl border border-indigo-200 bg-indigo-50 px-4 text-sm font-semibold text-indigo-700 hover:bg-indigo-100">{ctaLabel || "Start test"}</Link> : null}
            </article>
          ))}
        </div>
      )}
    </section>
  );
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

export function ExamHubPage({ examSlug }: { examSlug: string }) {
  const config = requireConfig(examSlug);
  const catalog = useExamCatalog();
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
    { canonicalPath: examHubHref(examSlug) },
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
    const fromSeries = examSeries.flatMap((series) => {
      const rawStage = seriesHubStage(series);
      const stage = preferredStage(rawStage, seriesSearchText(series));
      const type = seriesHubType(series);
      return (series.tests ?? []).map((test) => {
        seriesBoundIds.add(String(test.testId).toLowerCase());
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
        } satisfies ExamHubFlatTest;
      });
    });

    const standalone = examTests
      .filter((test) => !seriesBoundIds.has(String(test.id).toLowerCase()))
      .map((test) => {
        const stage = preferredStage(stageFromText(testSearchText(test)), testSearchText(test));
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
          iconUrl: test.iconUrl,
        } satisfies ExamHubFlatTest;
      });

    return [...fromSeries, ...standalone];
  }, [examSeries, examTests]);

  const landingSections = useMemo(() => {
    type SectionEntry = { order: number; item: ExamHubCatalogItem };
    type SectionDraft = { title: string; description: string; order: number; entries: SectionEntry[] };
    const sections = new Map<string, SectionDraft>();

    const asOrder = (value: unknown, fallback: number) => {
      const number = Number(value);
      return Number.isFinite(number) && number >= 0 ? number : fallback;
    };
    const addItem = (title: string, description: string, sectionOrder: number, itemOrder: number, item: ExamHubCatalogItem) => {
      const key = title.trim().toLowerCase();
      const existing = sections.get(key);
      if (existing) {
        existing.order = Math.min(existing.order, sectionOrder);
        if (!existing.description && description) existing.description = description;
        existing.entries.push({ order: itemOrder, item });
        return;
      }
      sections.set(key, { title, description, order: sectionOrder, entries: [{ order: itemOrder, item }] });
    };
    const fallbackSeriesSection = (series: StudentSeriesSummary) => {
      const type = seriesHubType(series);
      const stage = seriesHubStage(series);
      if (type === "pyq") return { title: "Previous Year Papers (PYQs)", description: "Previous-year and memory-based papers published for this exam.", order: 30 };
      if (type === "sectional") return { title: "Sectional Tests", description: "Section-level series for focused timed practice.", order: 40 };
      if (type === "topic-wise") return { title: "Topic-wise Tests", description: "Topic-focused practice series from the exam syllabus.", order: 50 };
      if (stage === "prelims") return { title: "Prelims Test Series", description: "Full-length " + config.name + " preliminary-stage mock series.", order: 10 };
      if (stage === "mains") return { title: "Mains Test Series", description: "Full-length " + config.name + " main-stage mock series.", order: 20 };
      return { title: "More Test Series", description: "Additional test series published for this exam.", order: 60 };
    };
    const fallbackTestSection = (test: Test) => {
      const value = testSearchText(test);
      if (isPyqText(value)) return { title: "Previous Year Papers (PYQs)", description: "Previous-year and memory-based papers published for this exam.", order: 30 };
      if (test.kind === "sectional") return { title: "Sectional Tests", description: "Focused tests for individual exam sections.", order: 40 };
      if (test.kind === "topic-wise") return { title: "Topic-wise Tests", description: "Short tests focused on specific topics from this exam syllabus.", order: 50 };
      const stage = stageFromText(value);
      if (stage === "prelims") return { title: "Prelims Test Series", description: "Full-length " + config.name + " preliminary-stage mock tests and series.", order: 10 };
      if (stage === "mains") return { title: "Mains Test Series", description: "Full-length " + config.name + " main-stage mock tests and series.", order: 20 };
      return { title: "More Tests", description: "Additional published tests for this exam.", order: 60 };
    };

    examSeries.forEach((series) => {
      const fallback = fallbackSeriesSection(series);
      addItem(
        compact(series.hubSectionTitle) || fallback.title,
        compact(series.hubSectionDescription) || fallback.description,
        asOrder(series.hubSectionOrder, fallback.order),
        asOrder(series.hubSeriesOrder, 100),
        seriesItem(series),
      );
    });

    const seriesTestIds = new Set(
      examSeries.flatMap((series) => (series.tests ?? []).map((test) => String(test.testId).toLowerCase())),
    );

    examTests.forEach((test, index) => {
      if (seriesTestIds.has(String(test.id).toLowerCase())) return;
      const fallback = fallbackTestSection(test);
      addItem(fallback.title, fallback.description, fallback.order, 1000 + index, testItem(test));
    });

    return Array.from(sections.values())
      .sort((left, right) => left.order - right.order || left.title.localeCompare(right.title))
      .map((section, index) => ({
        id: "series-" + String(index + 1) + "-" + (section.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48) || "row"),
        title: section.title,
        description: section.description,
        order: section.order,
        items: section.entries
          .sort((left, right) => left.order - right.order || left.item.title.localeCompare(right.item.title))
          .map((entry) => entry.item),
      }));
  }, [examSeries, examTests, config.name]);

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
        activeExamStage === "prelims" ? (section.labels.prelims || "Prelims") :
        activeExamStage === "mains" ? (section.labels.mains || "Mains") :
        (section.labels.pyq || "Previous Year Papers");
      const typeLabel =
        activeTestType === "sectional" ? (section.labels.sectional || "Sectional Tests") :
        activeTestType === "topic-wise" ? (section.labels.topicWise || "Topic-wise Tests") :
        (section.labels.fullTests || "Full Tests");
      const heading = activeExamStage === "pyq"
        ? config.name + " " + config.yearLabel + " Previous Year Papers"
        : config.name + " " + config.yearLabel + " " + stageLabel + " " + typeLabel;

      const softNav = [
        { label: section.labels.navOverview || "Overview", href: "#overview" },
        { label: section.labels.navTests || "Test Series", href: "#test-catalog", active: true },
        { label: section.labels.navSyllabus || "Syllabus", href: "#syllabus" },
        { label: section.labels.navPattern || "Exam Pattern", href: "#syllabus" },
        { label: section.labels.navPreparation || "Preparation Resources", href: "#preparation" },
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
            <div role="tablist" aria-label={config.name + " exam stage"} className="grid min-w-[560px] grid-cols-3">
              {([
                ["prelims", section.labels.prelims || "Prelims", stageCounts.prelims],
                ["mains", section.labels.mains || "Mains", stageCounts.mains],
                ["pyq", section.labels.pyq || "Previous Year Papers", stageCounts.pyq],
              ] as const).map(([stage, label, count]) => {
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
    <PublicPage
      eyebrow={pageConfiguration.pageEyebrow || (config.name + " · " + config.yearLabel)}
      title={pageConfiguration.pageTitle || config.hub.title}
      description={pageConfiguration.pageDescription || config.hub.description}
    >
      {(catalog.error || seriesQuery.error || pageConfigQuery.error) ? (
        <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          Some live page information is temporarily unavailable. Available exam content is shown below.
        </div>
      ) : null}
      {orderedPageSections.map(renderSection)}
    </PublicPage>
  );
}

export function ExamPreparationPage({ examSlug }: { examSlug: string }) {
  const config = requireConfig(examSlug);
  usePageMeta(config.meta.preparationTitle, config.meta.preparationDescription, { canonicalPath: examPreparationHref(examSlug) });

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
  usePageMeta(config.meta.syllabusTitle, config.meta.syllabusDescription, { canonicalPath: examSyllabusHref(examSlug) });

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
