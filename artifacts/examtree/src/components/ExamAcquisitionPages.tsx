import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight, BookOpenCheck, CheckCircle2, ChevronDown, FileText, Loader2, Sparkles, Target } from "lucide-react";

import MathText from "@/components/MathText";
import { CategoryIcon } from "@/components/CategoryIcon";
import { CheckList, PublicCard, PublicPage, usePageMeta } from "@/components/PublicPage";
import { apiRequest } from "@/lib/api";
import type { Test } from "@/lib/data";
import { getStudentTestSeries, type StudentSeriesSummary } from "@/lib/test-series";
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
  href: string;
  badge: string;
  meta: string;
  iconUrl?: string | null;
  comingSoon?: boolean;
};

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

function seriesItem(series: StudentSeriesSummary): ExamHubCatalogItem {
  const comingSoon = series.learnerVisibility === "coming_soon";
  const countLabel = series.testCount === 1 ? "1 test" : series.testCount + " tests";
  const duration = series.durationSeconds > 0 ? " · " + Math.max(1, Math.ceil(series.durationSeconds / 60)) + " min" : "";
  return {
    id: "series-" + series.id,
    title: series.name,
    description: compact(series.description) || (comingSoon ? series.learnerMessage : "ExamTree test series"),
    href: "/test-series/" + encodeURIComponent(series.id),
    badge: comingSoon ? "Coming Soon" : "Test Series",
    meta: countLabel + duration,
    iconUrl: series.iconUrl,
    comingSoon,
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

function ExamHubCatalogSection({
  id,
  title,
  description,
  items,
  emptyMessage,
}: {
  id: string;
  title: string;
  description: string;
  items: ExamHubCatalogItem[];
  emptyMessage: string;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-slate-200 pt-8">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{title}</h2>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">{description}</p>
        </div>
        {items.length > 0 ? <span className="text-xs font-semibold text-slate-400">{items.length} available</span> : null}
      </div>
      {items.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-7">
          <p className="text-sm font-semibold text-slate-700">{emptyMessage}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">This section will appear automatically when matching catalogue content is published.</p>
        </div>
      ) : (
        <div className="-mx-1 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-3 [scrollbar-width:thin]">
          {items.map((item) => (
            <Link key={item.id} href={item.href} className="group flex min-h-[164px] w-[84vw] max-w-[340px] shrink-0 snap-start flex-col rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-sm sm:w-[310px]">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  {item.iconUrl ? <img src={item.iconUrl} alt="" className="h-full w-full object-contain p-1" /> : <FileText className="h-5 w-5 text-indigo-600" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={"rounded-full px-2 py-0.5 text-[10px] font-bold " + (item.comingSoon ? "bg-amber-50 text-amber-700" : "bg-indigo-50 text-indigo-700")}>{item.badge}</span>
                  </div>
                  <h3 className="mt-2 line-clamp-2 font-semibold leading-5 text-slate-950">{item.title}</h3>
                </div>
              </div>
              <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-500">{item.description}</p>
              <div className="mt-auto flex items-center justify-between gap-3 pt-3 text-xs">
                <span className="text-slate-500">{item.meta}</span>
                <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-indigo-600" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export function ExamHubPage({ examSlug }: { examSlug: string }) {
  const config = requireConfig(examSlug);
  const catalog = useExamCatalog();
  const examCodes = useMemo(() => catalogExamCodesForSlug(examSlug).map((code) => code.toUpperCase()), [examSlug]);
  const seriesQuery = useQuery({
    queryKey: ["exam-hub-series", examSlug],
    queryFn: getStudentTestSeries,
    staleTime: 60_000,
    retry: 1,
  });

  usePageMeta(config.meta.hubTitle, config.meta.hubDescription, { canonicalPath: examHubHref(examSlug) });

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
      const text = testSearchText(test);
      if (isPyqText(text)) return { title: "Previous Year Papers (PYQs)", description: "Previous-year and memory-based papers published for this exam.", order: 30 };
      if (test.kind === "sectional") return { title: "Sectional Tests", description: "Focused tests for individual exam sections.", order: 40 };
      if (test.kind === "topic-wise") return { title: "Topic-wise Tests", description: "Short tests focused on specific topics from this exam syllabus.", order: 50 };
      const stage = stageFromText(text);
      if (stage === "prelims") return { title: "Prelims Test Series", description: "Full-length " + config.name + " preliminary-stage mock tests and series.", order: 10 };
      if (stage === "mains") return { title: "Mains Test Series", description: "Full-length " + config.name + " main-stage mock tests and series.", order: 20 };
      return { title: "More Tests", description: "Additional published tests for this exam.", order: 60 };
    };

    examSeries.forEach((series) => {
      const fallback = fallbackSeriesSection(series);
      const title = compact(series.hubSectionTitle) || fallback.title;
      const description = compact(series.hubSectionDescription) || fallback.description;
      addItem(
        title,
        description,
        asOrder(series.hubSectionOrder, fallback.order),
        asOrder(series.hubSeriesOrder, 100),
        seriesItem(series),
      );
    });

    examTests.forEach((test, index) => {
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

  const totalPublished = examTests.length + examSeries.filter((series) => series.learnerVisibility === "live").length;
  const comingSoonCount = examSeries.filter((series) => series.learnerVisibility === "coming_soon").length;
  const freeCount = examTests.filter((test) => (test.access ?? "free") === "free").length;

  return (
    <PublicPage eyebrow={config.name + " · " + config.yearLabel} title={config.hub.title} description={config.hub.description}>
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_12px_34px_rgba(15,23,42,0.05)]">
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
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-600">Complete exam hub</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">{config.name} {config.yearLabel}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Syllabus, exam pattern, preparation strategy, full mocks, PYQs, sectional tests and topic-wise practice in one place.</p>
              </div>
            </div>
            <nav className="mt-6 flex max-w-full gap-2 overflow-x-auto pb-1" aria-label={config.name + " page sections"}>
              {[
                ...landingSections.map((section) => ["#" + section.id, section.title]),
                ["#syllabus", "Syllabus"],
                ["#preparation", "Preparation"],
              ].map(([href, label]) => (
                <a key={href} href={href} title={label} className="max-w-[190px] truncate whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-indigo-300 hover:bg-white hover:text-indigo-700">{label}</a>
              ))}
            </nav>
          </div>
          <div className="border-t border-slate-200 bg-[#17182c] p-5 text-white lg:border-l lg:border-t-0 sm:p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-indigo-300">Live catalogue</p>
            <div className="mt-4 grid grid-cols-3 gap-3 lg:grid-cols-1">
              <div><div className="text-2xl font-semibold">{totalPublished}</div><div className="text-xs text-white/55">published</div></div>
              <div><div className="text-2xl font-semibold">{freeCount}</div><div className="text-xs text-white/55">free tests</div></div>
              <div><div className="text-2xl font-semibold">{comingSoonCount}</div><div className="text-xs text-white/55">coming soon</div></div>
            </div>
          </div>
        </div>
      </section>

      {(catalog.error || seriesQuery.error) ? (
        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          Some live test catalogue information is temporarily unavailable. Syllabus, preparation and free practice remain available below.
        </div>
      ) : null}

      <div className="mt-8 space-y-10">
        {landingSections.length > 0 ? landingSections.map((section) => (
          <ExamHubCatalogSection
            key={section.id}
            id={section.id}
            title={section.title}
            description={section.description}
            items={section.items}
            emptyMessage="This series row is being prepared."
          />
        )) : (
          <section className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8">
            <h2 className="text-lg font-semibold text-slate-900">Test series are being prepared</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">Prelims, mains, sectional, topic-wise, PYQ, or any custom series row will appear here as soon as it is configured for this exam.</p>
          </section>
        )}
      </div>

      <section className="mt-12 border-t border-slate-200 pt-9" aria-labelledby="exam-information-heading">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-600">Exam information</p>
          <h2 id="exam-information-heading" className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">About {config.name} {config.yearLabel}</h2>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <PublicCard title="Preparation guide">
            {config.hub.preparationSummary}
            <Link href={examPreparationHref(examSlug)} className="mt-3 block font-semibold text-indigo-700 hover:underline">Detailed preparation strategy</Link>
          </PublicCard>
          <PublicCard title="Syllabus & pattern">
            {config.hub.syllabusSummary}
            <Link href={examSyllabusHref(examSlug)} className="mt-3 block font-semibold text-indigo-700 hover:underline">Full {config.name} syllabus</Link>
          </PublicCard>
          <PublicCard title="Official information">
            Verify dates, eligibility, vacancies and current notices on the official exam authority website.
            <a href={config.officialUrl} target="_blank" rel="noreferrer" className="mt-3 block font-semibold text-indigo-700 hover:underline">Open {config.officialLabel}</a>
          </PublicCard>
        </div>
      </section>

      <section id="syllabus" className="mt-12 scroll-mt-24 border-t border-slate-200 pt-9">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-600">Exam structure</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">{config.name} syllabus & exam pattern</h2>
          </div>
          <Link href={examSyllabusHref(examSlug)} className="text-sm font-semibold text-indigo-700 hover:underline">Open full syllabus page</Link>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {config.syllabus.sections.map((section) => (
            <div key={section.title} className="rounded-2xl border border-slate-200 bg-white p-4">
              <h3 className="font-semibold text-slate-950">{section.title}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">{section.summary}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {config.syllabus.patternCards.map((card) => (
            <div key={card.title} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <h3 className="font-semibold text-slate-950">{card.title}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="preparation" className="mt-12 scroll-mt-24 border-t border-slate-200 pt-9">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-600">Study plan</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">How to prepare for {config.name} {config.yearLabel}</h2>
        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          {config.preparation.cards.map((card) => (
            <div key={card.title} className="rounded-2xl border border-slate-200 bg-white p-4">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              <h3 className="mt-3 font-semibold text-slate-950">{card.title}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">{card.text}</p>
            </div>
          ))}
        </div>
        <Link href={examPreparationHref(examSlug)} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:underline">Open complete preparation guide <ArrowRight className="h-4 w-4" /></Link>
      </section>

      <section className="mt-12 border-t border-slate-200 pt-9">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-indigo-600" />
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Free {config.name} topic practice</h2>
        </div>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Solve sample questions continuously without starting a timed mock. Each page includes answers and explanations.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {config.topics.map((topic) => (
            <Link key={topic.slug} href={practiceTopicHref(topic.slug, examSlug)} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-indigo-600">{topic.subject}</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-950">{topic.name} Questions</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{topic.summary}</p>
            </Link>
          ))}
        </div>
      </section>
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
