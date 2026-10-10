import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  CalendarDays,
  FileQuestion,
  FileText,
  Flame,
  Languages,
  Newspaper,
  Search,
  Sparkles,
  Target,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  formatLearningResourceDate,
  getLearningResources,
  learningResourceCategoryLabel,
  learningResourceHref,
  type LearningResourceSummary,
} from "@/lib/learning-resources";

const RESOURCE_TYPES = [
  { id: "current-affairs", label: "Current Affairs", short: "Daily news & analysis", icon: Newspaper, accent: "bg-violet-100 text-violet-700 dark:bg-violet-950/45 dark:text-violet-300" },
  { id: "notes", label: "Study Notes", short: "Exam-ready concepts", icon: BookOpen, accent: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/45 dark:text-emerald-300" },
  { id: "papers", label: "Previous Papers", short: "Real exam questions", icon: FileQuestion, accent: "bg-orange-100 text-orange-700 dark:bg-orange-950/45 dark:text-orange-300" },
  { id: "quizzes", label: "Daily Quizzes", short: "Quick practice", icon: Target, accent: "bg-sky-100 text-sky-700 dark:bg-sky-950/45 dark:text-sky-300" },
  { id: "vocabulary", label: "Vocabulary", short: "Words that score", icon: Languages, accent: "bg-rose-100 text-rose-700 dark:bg-rose-950/45 dark:text-rose-300" },
  { id: "updates", label: "Exam Updates", short: "Dates & notifications", icon: CalendarDays, accent: "bg-teal-100 text-teal-700 dark:bg-teal-950/45 dark:text-teal-300" },
] as const;

type ResourceTypeId = (typeof RESOURCE_TYPES)[number]["id"];

function routeType(location: string): ResourceTypeId | "all" {
  if (location === "/current-affairs") return "current-affairs";
  const match = RESOURCE_TYPES.find((item) => location === `/resources/${item.id}`);
  return match?.id ?? "all";
}

function resourceTitle(type: ResourceTypeId | "all") {
  if (type === "current-affairs") return "Current affairs, without the noise.";
  if (type === "notes") return "Revision notes built for exam day.";
  if (type === "papers") return "Previous papers, organised properly.";
  if (type === "quizzes") return "Short practice. Daily momentum.";
  if (type === "vocabulary") return "Build the vocabulary that actually scores.";
  if (type === "updates") return "Important exam updates in one place.";
  return "Learn something useful. Every single day.";
}

function resourceSubtitle(type: ResourceTypeId | "all") {
  if (type === "current-affairs") return "Published exam-focused current affairs and revision briefs, pulled directly from ExamTree's canonical learning-resource catalog.";
  if (type === "notes") return "Published Study Notes and formula sheets from the governed Notes Studio and learning-resource workflow, organised by exam where targeting is available.";
  if (type === "papers") return "Previous-year paper discovery stays connected to the dedicated PYQ workflow while this page keeps the same Resources visual system.";
  if (type === "quizzes") return "Quick-practice discovery stays connected to the published mock-test catalog until a dedicated daily-quiz publishing source is available.";
  if (type === "vocabulary") return "This space is ready for vocabulary resources, but ExamTree does not yet expose a canonical vocabulary publishing category.";
  if (type === "updates") return "This space is ready for verified exam updates, but ExamTree does not yet expose a canonical exam-update publishing category.";
  return "Current affairs and exam notes now come directly from published ExamTree learning resources. Other resource types stay linked only to established canonical surfaces.";
}

function matchesActiveType(resource: LearningResourceSummary, activeType: ResourceTypeId | "all") {
  if (activeType === "all") return true;
  if (activeType === "current-affairs") return resource.category === "current_affairs";
  if (activeType === "notes") return resource.category === "notes" || resource.category === "formula_sheet";
  return false;
}

function matchesQuery(resource: LearningResourceSummary, query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  const haystack = [
    resource.title,
    resource.summary ?? "",
    resource.publicCode,
    resource.languageCode,
    learningResourceCategoryLabel(resource.category),
    ...resource.exams.flatMap((exam) => [exam.name, exam.code, exam.familyName ?? "", exam.familyCode ?? ""]),
  ].join(" ").toLowerCase();
  return haystack.includes(needle);
}

function resourceVisual(resource: LearningResourceSummary) {
  if (resource.category === "current_affairs") return { Icon: Newspaper, className: "bg-[radial-gradient(circle_at_82%_20%,rgba(102,87,232,0.24),transparent_7rem),linear-gradient(135deg,#f1efff,#e5e0ff)] text-[#6657e8] dark:bg-none dark:bg-violet-950/35 dark:text-violet-300" };
  if (resource.category === "formula_sheet") return { Icon: FileText, className: "bg-[radial-gradient(circle_at_82%_20%,rgba(249,115,22,0.20),transparent_7rem),linear-gradient(135deg,#fff5e8,#ffead3)] text-orange-700 dark:bg-none dark:bg-orange-950/35 dark:text-orange-300" };
  return { Icon: BookOpen, className: "bg-[radial-gradient(circle_at_82%_20%,rgba(16,185,129,0.20),transparent_7rem),linear-gradient(135deg,#ecfdf5,#dff8ed)] text-emerald-700 dark:bg-none dark:bg-emerald-950/35 dark:text-emerald-300" };
}

function ResourceCard({ resource }: { resource: LearningResourceSummary }) {
  const visual = resourceVisual(resource);
  const examLabel = resource.isGeneral ? "General preparation" : resource.exams.length === 1 ? resource.exams[0]?.name ?? "1 targeted exam" : `${resource.exams.length} targeted exams`;

  return (
    <article className="group flex min-h-[390px] flex-col overflow-hidden rounded-[22px] border border-[#dfe2ec] bg-white shadow-[0_8px_24px_rgba(42,45,80,0.035)] transition hover:-translate-y-0.5 hover:border-[#cec8ef] hover:shadow-[0_16px_36px_rgba(42,45,80,0.075)] dark:border-border dark:bg-card" data-testid={`learning-resource-card-${resource.id}`}>
      <div className={`flex h-40 items-center justify-center ${visual.className}`}>
        <span className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-white/75 shadow-sm ring-1 ring-white/70 backdrop-blur dark:bg-black/15 dark:ring-white/10"><visual.Icon className="h-7 w-7" aria-hidden="true" /></span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-[0.09em] text-slate-400 dark:text-muted-foreground"><span>{learningResourceCategoryLabel(resource.category)}</span><span>{resource.format}</span></div>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-semibold text-slate-500 dark:text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" /> {formatLearningResourceDate(resource)}</span>
          <span className="inline-flex min-w-0 items-center gap-1.5"><Target className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">{examLabel}</span></span>
        </div>
        <h3 className="mt-4 text-lg font-black leading-6 tracking-[-0.025em] text-slate-950 dark:text-foreground">{resource.title}</h3>
        {resource.summary ? <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-muted-foreground">{resource.summary}</p> : <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-muted-foreground">Published ExamTree learning resource.</p>}
        <div className="mt-auto pt-5"><Link href={learningResourceHref(resource)} className="et-interactive inline-flex min-h-11 items-center gap-2 rounded-xl pr-3 text-sm font-black text-[#6657e8] hover:text-[#5546d7] dark:text-violet-300" data-testid={`open-learning-resource-${resource.id}`}>{resource.format === "pdf" && !resource.hasInlineContent ? "Open resource" : "Read now"} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" /></Link></div>
      </div>
    </article>
  );
}

function UnsupportedFeedState({ activeType }: { activeType: Exclude<ResourceTypeId, "current-affairs" | "notes"> }) {
  const config = activeType === "papers"
    ? { title: "Previous papers use the dedicated PYQ catalog.", copy: "This Resources page does not duplicate or fabricate PYQ records. Open the established PYQ surface for currently available paper discovery.", href: "/pyqs", cta: "Open PYQ hub" }
    : activeType === "quizzes"
      ? { title: "Daily quizzes do not have a separate publishing feed yet.", copy: "Use the published mock-test catalog for live quick practice. A dedicated quiz feed will appear here only when a canonical quiz source exists.", href: "/mock-tests", cta: "Browse practice" }
      : activeType === "vocabulary"
        ? { title: "No canonical vocabulary feed is exposed yet.", copy: "The page is designed and ready, but ExamTree will not invent word lists or counts before a governed vocabulary publishing source is connected.", href: "/resources", cta: "Browse live resources" }
        : { title: "No canonical exam-updates feed is exposed yet.", copy: "Verified exam notices will appear only after they have a governed publishing source. No dates or notifications are fabricated here.", href: "/resources", cta: "Browse live resources" };

  return (
    <div className="rounded-[24px] border border-dashed border-[#d4d7e4] bg-white px-6 py-10 text-center dark:border-border dark:bg-card">
      <FileText className="mx-auto h-7 w-7 text-[#6657e8]" />
      <h3 className="mt-4 text-lg font-black tracking-[-0.025em] text-slate-950 dark:text-foreground">{config.title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600 dark:text-muted-foreground">{config.copy}</p>
      <Button asChild className="mt-5 min-h-11 rounded-xl bg-[#6657e8] text-white hover:bg-[#594bd9]"><Link href={config.href}>{config.cta} <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
    </div>
  );
}

export default function ResourcesPage() {
  const [location] = useLocation();
  const [query, setQuery] = useState("");
  const activeType = routeType(location);
  const resourcesQuery = useQuery({ queryKey: ["published-learning-resources"], queryFn: () => getLearningResources({ limit: 100 }), staleTime: 60_000, retry: 1 });
  const resources = resourcesQuery.data?.resources ?? [];
  const currentAffairs = useMemo(() => resources.filter((resource) => resource.category === "current_affairs"), [resources]);
  const latestCurrentAffairs = currentAffairs[0] ?? null;
  const visibleResources = useMemo(() => resources.filter((resource) => matchesActiveType(resource, activeType) && matchesQuery(resource, query)), [activeType, query, resources]);
  const activeHasCanonicalFeed = activeType === "all" || activeType === "current-affairs" || activeType === "notes";

  return (
    <div className="sites-page-shell resources-page min-h-screen bg-[#f5f6fb] text-slate-950 dark:bg-background dark:text-foreground" data-testid="resources-page">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pt-12">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start">
          <div className="pt-2 lg:pt-4">
            <div className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.12em] text-slate-600 dark:text-muted-foreground"><Sparkles className="h-3.5 w-3.5 text-[#6657e8]" aria-hidden="true" /> Free learning · published by ExamTree</div>
            <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[1.05] tracking-[-0.055em] text-slate-950 dark:text-foreground sm:text-5xl lg:text-[56px]">{activeType === "all" ? <>Learn something useful. <span className="text-[#6657e8]">Every single day.</span></> : resourceTitle(activeType)}</h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600 dark:text-muted-foreground sm:text-[15px]">{resourceSubtitle(activeType)}</p>
            <form className="mt-7 flex max-w-2xl flex-col gap-2 rounded-2xl border border-[#dcdfea] bg-white p-2 shadow-[0_12px_34px_rgba(37,40,75,0.07)] dark:border-border dark:bg-card sm:flex-row" onSubmit={(event) => event.preventDefault()} role="search">
              <label className="relative min-w-0 flex-1"><span className="sr-only">Search resources</span><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search current affairs, notes, exams..." className="min-h-11 w-full rounded-xl border-0 bg-transparent pl-10 pr-3 text-sm outline-none placeholder:text-slate-400" data-testid="resources-search" /></label>
              <button type="submit" className="et-interactive min-h-11 rounded-xl bg-[#6657e8] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#594bd9]">Find resources</button>
            </form>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] text-slate-500 dark:text-muted-foreground"><span className="font-black text-slate-700 dark:text-foreground">Popular:</span><Link href="/resources/current-affairs" className="font-semibold text-[#6657e8] hover:underline">Current Affairs</Link><Link href="/resources/notes" className="font-semibold text-[#6657e8] hover:underline">Study Notes</Link><Link href="/resources/papers" className="font-semibold text-[#6657e8] hover:underline">Previous Papers</Link></div>
          </div>

          <aside className="overflow-hidden rounded-[24px] bg-[radial-gradient(circle_at_90%_0%,rgba(111,87,232,0.28),transparent_15rem),linear-gradient(145deg,#17192a,#111422)] p-6 text-white shadow-[0_24px_55px_rgba(21,23,43,0.16)] sm:p-7" aria-label="Latest current affairs brief" data-testid="latest-resource-brief">
            <div className="flex items-center justify-between gap-3"><span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-violet-200"><span className={`h-2 w-2 rounded-full ${latestCurrentAffairs ? "bg-emerald-400" : "bg-white/35"}`} /> Latest brief</span><Flame className="h-5 w-5 text-orange-400" aria-hidden="true" /></div>
            {resourcesQuery.isLoading ? (
              <div className="mt-8 space-y-4" role="status" aria-label="Loading latest current affairs"><div className="h-7 w-4/5 animate-pulse rounded-lg bg-white/10" /><div className="h-4 w-full animate-pulse rounded bg-white/10" /><div className="h-4 w-2/3 animate-pulse rounded bg-white/10" /><div className="mt-7 h-11 animate-pulse rounded-xl bg-white/10" /></div>
            ) : latestCurrentAffairs ? (
              <><p className="mt-7 text-[10px] font-bold uppercase tracking-[0.12em] text-white/45">{formatLearningResourceDate(latestCurrentAffairs)}</p><h2 className="mt-2 text-2xl font-black leading-8 tracking-[-0.04em]">{latestCurrentAffairs.title}</h2>{latestCurrentAffairs.summary ? <p className="mt-2 line-clamp-3 text-xs leading-5 text-white/65">{latestCurrentAffairs.summary}</p> : null}<div className="mt-6 grid grid-cols-3 gap-0 border-y border-white/10 py-5 text-center"><div className="pr-3"><p className="text-sm font-black capitalize">{latestCurrentAffairs.format}</p><p className="mt-1 text-[9px] text-white/45">Format</p></div><div className="border-x border-white/10 px-3"><p className="text-sm font-black uppercase">{latestCurrentAffairs.languageCode}</p><p className="mt-1 text-[9px] text-white/45">Language</p></div><div className="pl-3"><p className="text-sm font-black">{latestCurrentAffairs.isGeneral ? "General" : latestCurrentAffairs.exams.length}</p><p className="mt-1 text-[9px] text-white/45">{latestCurrentAffairs.isGeneral ? "Coverage" : "Exams"}</p></div></div><Link href={learningResourceHref(latestCurrentAffairs)} className="et-interactive mt-5 flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-bold text-[#6657e8] transition hover:bg-violet-50">Read latest brief <ArrowRight className="h-4 w-4" /></Link></>
            ) : (
              <><h2 className="mt-8 text-2xl font-black tracking-[-0.04em]">No current-affairs brief is published right now.</h2><p className="mt-2 text-xs leading-5 text-white/65">The card will populate automatically when a current-affairs resource is published in the canonical learner catalog.</p><Link href="/resources/notes" className="et-interactive mt-7 flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-bold text-[#6657e8] transition hover:bg-violet-50">Browse Study Notes <ArrowRight className="h-4 w-4" /></Link></>
            )}
          </aside>
        </section>

        <section className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-label="Resource categories">
          {RESOURCE_TYPES.map((item) => { const Icon = item.icon; const active = activeType === item.id; return <Link key={item.id} href={`/resources/${item.id}`} aria-current={active ? "page" : undefined} className={`et-interactive group flex min-h-[92px] items-center gap-4 rounded-2xl border bg-white p-4 shadow-[0_8px_24px_rgba(42,45,80,0.035)] transition hover:-translate-y-0.5 hover:border-[#cfc9f4] hover:shadow-[0_14px_30px_rgba(42,45,80,0.07)] dark:bg-card ${active ? "border-[#bdb4f3] ring-2 ring-[#6657e8]/10 dark:border-violet-700" : "border-[#dfe2ec] dark:border-border"}`}><span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${item.accent}`}><Icon className="h-5 w-5" aria-hidden="true" /></span><div className="min-w-0 flex-1"><h2 className="text-sm font-black tracking-[-0.02em] text-slate-950 dark:text-foreground">{item.label}</h2><p className="mt-1 text-xs text-slate-500 dark:text-muted-foreground">{item.short}</p></div><ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-[#6657e8]" aria-hidden="true" /></Link>; })}
        </section>

        <section className="mt-16" aria-labelledby="resource-library-heading">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div><p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#6657e8]">Explore resources</p><h2 id="resource-library-heading" className="mt-3 text-3xl font-black tracking-[-0.045em] text-slate-950 dark:text-foreground">Fresh, focused and exam-ready.</h2><p className="mt-2 text-sm text-slate-600 dark:text-muted-foreground">Only currently published, non-expired canonical learner resources appear in this library.</p></div>
            <nav className="flex max-w-full gap-1 overflow-x-auto rounded-2xl bg-[#eceef6] p-1.5 dark:bg-muted" aria-label="Resource filters"><Link href="/resources" className={`et-interactive shrink-0 rounded-xl px-3 py-2 text-xs font-bold ${activeType === "all" ? "bg-white text-[#6657e8] shadow-sm dark:bg-card" : "text-slate-600 hover:bg-white/70 dark:text-muted-foreground"}`}>All</Link>{RESOURCE_TYPES.map((item) => <Link key={item.id} href={`/resources/${item.id}`} className={`et-interactive shrink-0 rounded-xl px-3 py-2 text-xs font-bold ${activeType === item.id ? "bg-white text-[#6657e8] shadow-sm dark:bg-card" : "text-slate-600 hover:bg-white/70 dark:text-muted-foreground"}`}>{item.label.replace("Study ", "").replace("Daily ", "")}</Link>)}<button type="button" disabled className="shrink-0 rounded-xl px-3 py-2 text-xs font-bold text-slate-400" title="Saved learning resources are not available yet"><Bookmark className="mr-1 inline h-3.5 w-3.5" /> Saved</button></nav>
          </div>

          {!activeHasCanonicalFeed ? (
            <div className="mt-6"><UnsupportedFeedState activeType={activeType} /></div>
          ) : resourcesQuery.isLoading ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3" role="status" aria-label="Loading published resources">{Array.from({ length: 6 }, (_, index) => <div key={index} className="skeleton-shimmer h-[390px] rounded-[22px]" />)}</div>
          ) : resourcesQuery.isError ? (
            <div className="mt-6 rounded-[24px] border border-rose-200 bg-white px-6 py-10 text-center dark:border-rose-900 dark:bg-card"><FileText className="mx-auto h-7 w-7 text-rose-500" /><h3 className="mt-4 text-lg font-black text-slate-950 dark:text-foreground">Published resources could not be loaded</h3><p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600 dark:text-muted-foreground">No cached or sample content is being substituted. Try the canonical learner feed again.</p><Button variant="outline" className="mt-5 min-h-11 rounded-xl" onClick={() => resourcesQuery.refetch()}>Try again</Button></div>
          ) : visibleResources.length > 0 ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3" data-testid="resource-library-grid">{visibleResources.map((resource) => <ResourceCard key={resource.id} resource={resource} />)}</div>
          ) : query.trim() ? (
            <div className="mt-6 rounded-[24px] border border-dashed border-[#d4d7e4] bg-white px-6 py-10 text-center dark:border-border dark:bg-card"><Search className="mx-auto h-7 w-7 text-slate-400" /><h3 className="mt-4 text-lg font-black">No published resources match “{query.trim()}”</h3><button type="button" onClick={() => setQuery("")} className="et-interactive mt-3 min-h-11 rounded-xl px-4 text-sm font-black text-[#6657e8] hover:bg-[#f1edff]">Clear search</button></div>
          ) : (
            <div className="mt-6 rounded-[24px] border border-dashed border-[#d4d7e4] bg-white px-6 py-10 text-center dark:border-border dark:bg-card" data-testid="resource-library-empty"><FileText className="mx-auto h-7 w-7 text-[#6657e8]" /><h3 className="mt-4 text-lg font-black text-slate-950 dark:text-foreground">No published {activeType === "current-affairs" ? "current affairs" : activeType === "notes" ? "Study Notes" : "learning resources"} are available yet.</h3><p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600 dark:text-muted-foreground">This library reads directly from the learner publishing catalog. Newly published content will appear here automatically.</p></div>
          )}
        </section>
      </div>
    </div>
  );
}
