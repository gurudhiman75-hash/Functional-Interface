import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Flame,
  Languages,
  Newspaper,
  Search,
  Sparkles,
  Target,
} from "lucide-react";
import { Link, useLocation } from "wouter";

import { Button } from "@/components/ui/button";
import {
  getCurrentAffairsDashboard,
  getCurrentAffairsHub,
  type CurrentAffairsHubPack,
  type CurrentAffairsLanguage,
} from "@/lib/current-affairs";
import { getUser } from "@/lib/storage";

type ResourceFilter = "all" | "current-affairs" | "notes" | "papers" | "quizzes" | "vocabulary" | "updates";

type Shortcut = {
  key: ResourceFilter;
  title: string;
  subtitle: string;
  icon: typeof Newspaper;
  iconClass: string;
  iconSurface: string;
};

const shortcuts: Shortcut[] = [
  { key: "current-affairs", title: "Current Affairs", subtitle: "Verified daily, weekly & monthly", icon: Newspaper, iconClass: "text-[#6755e8]", iconSurface: "bg-[#eeeaff]" },
  { key: "notes", title: "Study Notes", subtitle: "Exam-ready concepts", icon: BookOpen, iconClass: "text-emerald-700", iconSurface: "bg-emerald-100" },
  { key: "papers", title: "Previous Papers", subtitle: "Exam-wise PYQ hub", icon: FileText, iconClass: "text-orange-700", iconSurface: "bg-orange-100" },
  { key: "quizzes", title: "Daily Quizzes", subtitle: "Quick current-affairs practice", icon: Target, iconClass: "text-sky-700", iconSurface: "bg-sky-100" },
  { key: "vocabulary", title: "Vocabulary", subtitle: "Word resources", icon: Languages, iconClass: "text-rose-700", iconSurface: "bg-rose-100" },
  { key: "updates", title: "Exam Updates", subtitle: "Notifications & important dates", icon: CalendarDays, iconClass: "text-teal-700", iconSurface: "bg-teal-100" },
];

const filterLabels: Array<{ key: ResourceFilter; label: string }> = [
  { key: "all", label: "All" },
  { key: "current-affairs", label: "Current Affairs" },
  { key: "notes", label: "Notes" },
  { key: "papers", label: "Papers" },
  { key: "quizzes", label: "Quizzes" },
  { key: "vocabulary", label: "Vocabulary" },
  { key: "updates", label: "Updates" },
];

function familyLabel(family: CurrentAffairsHubPack["examFamily"]) {
  if (family === "ssc") return "SSC";
  if (family === "banking") return "Banking";
  if (family === "punjab") return "Punjab";
  if (family === "railways") return "Railways";
  return "General";
}

function periodLabel(period: CurrentAffairsHubPack["periodType"]) {
  return period.charAt(0).toUpperCase() + period.slice(1);
}

function formatDate(value: string) {
  const date = new Date(`${value}T12:00:00+05:30`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

function ResourceArtwork({ pack, quiz }: { pack: CurrentAffairsHubPack; quiz?: boolean }) {
  const Icon = quiz ? Target : pack.periodType === "daily" ? Newspaper : pack.periodType === "weekly" ? CalendarDays : BookOpen;
  const badge = quiz ? "QUIZ" : pack.periodType.toUpperCase();
  return (
    <div className="relative h-40 overflow-hidden border-b border-[#e7e4ef] bg-[radial-gradient(circle_at_78%_18%,rgba(102,87,232,0.24),transparent_8rem),linear-gradient(135deg,#f8f7ff_0%,#ece9ff_48%,#f8fbff_100%)] dark:border-border dark:bg-none dark:bg-muted/50">
      <div className="absolute -bottom-10 -right-8 h-36 w-36 rounded-full border-[18px] border-white/50" aria-hidden="true" />
      <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/75 bg-white/75 px-2.5 py-1 text-[9px] font-black tracking-[0.14em] text-[#6755e8] shadow-sm backdrop-blur dark:border-border dark:bg-card/80 dark:text-violet-300">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> {badge}
      </div>
      <div className="absolute bottom-5 left-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#6657e8] shadow-[0_10px_28px_rgba(64,52,140,0.12)] dark:bg-card dark:text-violet-300">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <p className="absolute bottom-5 right-5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-muted-foreground">{familyLabel(pack.examFamily)}</p>
    </div>
  );
}

function CurrentAffairsCard({ pack, language, quizOnly = false }: { pack: CurrentAffairsHubPack; language: CurrentAffairsLanguage; quizOnly?: boolean }) {
  const resource = pack.resources[language];
  const quiz = pack.quiz;
  const href = quizOnly && quiz
    ? `/current-affairs/quiz/${encodeURIComponent(quiz.publicCode)}?language=${language}`
    : resource
      ? `/current-affairs/notes/${encodeURIComponent(resource.publicCode)}`
      : "/current-affairs";
  const title = quizOnly
    ? `${familyLabel(pack.examFamily)} ${periodLabel(pack.periodType)} Current Affairs Quiz`
    : resource?.title || `${familyLabel(pack.examFamily)} ${periodLabel(pack.periodType)} Current Affairs`;
  const description = quizOnly
    ? `${quiz?.itemCount ?? 0} published questions from this verified release.`
    : resource?.summary || `${formatDate(pack.periodStart)} – ${formatDate(pack.periodEnd)} verified revision pack.`;

  return (
    <article className="group overflow-hidden rounded-[22px] border border-[#dfe1eb] bg-white shadow-[0_7px_22px_rgba(35,40,65,0.035)] transition hover:-translate-y-0.5 hover:border-[#cec8ee] hover:shadow-[0_14px_34px_rgba(52,45,111,0.08)] dark:border-border dark:bg-card" data-testid={`resource-card-${quizOnly ? "quiz" : "notes"}-${pack.releaseCode}`}>
      <ResourceArtwork pack={pack} quiz={quizOnly} />
      <div className="flex min-h-[250px] flex-col p-5">
        <div className="flex items-center justify-between gap-3 text-[10px] font-semibold text-slate-400 dark:text-muted-foreground">
          <span>{pack.periodStart === pack.periodEnd ? formatDate(pack.periodEnd) : `${formatDate(pack.periodStart)} – ${formatDate(pack.periodEnd)}`}</span>
          <span>{quizOnly && quiz ? `${quiz.itemCount} questions` : language.toUpperCase()}</span>
        </div>
        <h3 className="mt-4 line-clamp-2 text-[18px] font-black leading-6 tracking-[-0.025em] text-slate-950 dark:text-foreground">{title}</h3>
        <p className="mt-2 line-clamp-3 text-[13px] leading-6 text-slate-600 dark:text-muted-foreground">{description}</p>
        <Link href={href} className="et-interactive mt-auto inline-flex min-h-11 items-center gap-2 pt-5 text-[13px] font-black text-[#6657e8] hover:text-[#5546d5] dark:text-violet-300">
          {quizOnly ? "Start quiz" : "Read now"} <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

function PortalCard({ type }: { type: "papers" | "vocabulary" | "updates" }) {
  if (type === "papers") {
    return (
      <article className="flex min-h-[410px] flex-col overflow-hidden rounded-[22px] border border-[#dfe1eb] bg-white shadow-[0_7px_22px_rgba(35,40,65,0.035)] dark:border-border dark:bg-card">
        <div className="relative h-40 border-b border-[#e7e4ef] bg-[radial-gradient(circle_at_80%_20%,rgba(249,115,22,0.18),transparent_8rem),linear-gradient(135deg,#fffaf5,#fff2e4)] dark:border-border dark:bg-none dark:bg-muted/50">
          <span className="absolute bottom-5 left-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-orange-700 shadow-sm dark:bg-card dark:text-orange-300"><FileText className="h-6 w-6" /></span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.12em] text-orange-600">Previous papers</p>
          <h3 className="mt-3 text-[18px] font-black leading-6 tracking-[-0.025em] text-slate-950 dark:text-foreground">Exam-wise PYQ library</h3>
          <p className="mt-2 text-[13px] leading-6 text-slate-600 dark:text-muted-foreground">Open the dedicated Previous Year Questions hub. Individual papers are shown only when they are published there.</p>
          <Link href="/pyqs" className="et-interactive mt-auto inline-flex min-h-11 items-center gap-2 pt-5 text-[13px] font-black text-[#6657e8] dark:text-violet-300">Explore papers <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </article>
    );
  }

  const title = type === "vocabulary" ? "Vocabulary resources" : "Exam updates";
  const copy = type === "vocabulary"
    ? "No canonical vocabulary collection is published yet. This section will populate when reviewed resources are available."
    : "No canonical exam-update feed is published yet. Dates and notifications will appear only from verified data.";
  const Icon = type === "vocabulary" ? Languages : CalendarDays;
  return (
    <article className="flex min-h-[410px] flex-col items-start rounded-[22px] border border-dashed border-[#d8d7e3] bg-white p-6 dark:border-border dark:bg-card">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f3f1fb] text-slate-500 dark:bg-muted dark:text-muted-foreground"><Icon className="h-5 w-5" /></span>
      <p className="mt-5 text-[10px] font-black uppercase tracking-[0.13em] text-slate-400">Not published yet</p>
      <h3 className="mt-2 text-lg font-black tracking-[-0.02em] text-slate-950 dark:text-foreground">{title}</h3>
      <p className="mt-2 text-[13px] leading-6 text-slate-600 dark:text-muted-foreground">{copy}</p>
    </article>
  );
}

export default function ResourcesPage() {
  const [, setLocation] = useLocation();
  const user = getUser();
  const [filter, setFilter] = useState<ResourceFilter>("all");
  const [language] = useState<CurrentAffairsLanguage>("en");
  const [search, setSearch] = useState("");

  const hubQuery = useQuery({
    queryKey: ["resources-current-affairs-hub"],
    queryFn: () => getCurrentAffairsHub({ limit: 80 }),
    staleTime: 60_000,
  });
  const dashboardQuery = useQuery({
    queryKey: ["resources-current-affairs-dashboard", user?.id],
    queryFn: getCurrentAffairsDashboard,
    enabled: Boolean(user),
    retry: false,
    staleTime: 30_000,
  });

  const packs = hubQuery.data?.packs ?? [];
  const latestDaily = useMemo(() => packs.find((pack) => pack.periodType === "daily") ?? null, [packs]);
  const latestDailyResource = latestDaily?.resources[language] ?? null;
  const normalizedSearch = search.trim().toLowerCase();
  const matchingPacks = useMemo(() => {
    if (!normalizedSearch) return packs;
    return packs.filter((pack) => {
      const resource = pack.resources[language];
      const haystack = `${resource?.title ?? ""} ${resource?.summary ?? ""} ${pack.examFamily} ${pack.periodType}`.toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [language, normalizedSearch, packs]);

  const notesPacks = matchingPacks.filter((pack) => Boolean(pack.resources[language]));
  const quizPacks = matchingPacks.filter((pack) => Boolean(pack.quiz));
  const dashboard = dashboardQuery.data;

  const selectShortcut = (key: ResourceFilter) => {
    setFilter(key);
    requestAnimationFrame(() => document.getElementById("resource-explorer")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    document.getElementById("resource-explorer")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-[#f4f6fb] text-slate-950 dark:bg-background dark:text-foreground" data-testid="resources-page">
      <div className="mx-auto max-w-[1120px] px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pt-11">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start">
          <div className="pt-2 lg:pt-4">
            <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.08em] text-slate-700 dark:text-muted-foreground"><Sparkles className="h-3.5 w-3.5" /> Free resources · reviewed content only</p>
            <h1 className="mt-6 max-w-[650px] text-[38px] font-black leading-[1.02] tracking-[-0.05em] text-[#11172b] dark:text-foreground sm:text-[48px] lg:text-[51px]">
              Learn something useful.<br /><span className="text-[#6554e8]">Every single day.</span>
            </h1>
            <p className="mt-5 max-w-[650px] text-[14px] leading-7 text-slate-600 dark:text-muted-foreground sm:text-[15px]">Current affairs, exam notes, previous papers and quizzes—organised around what ExamTree has actually published.</p>

            <form onSubmit={submitSearch} className="mt-7 flex min-h-[52px] max-w-[650px] items-center gap-2 rounded-2xl border border-[#d7dae5] bg-white p-1.5 shadow-[0_8px_24px_rgba(38,43,74,0.05)] dark:border-border dark:bg-card">
              <Search className="ml-2 h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
              <label className="sr-only" htmlFor="resource-search">Search resources</label>
              <input id="resource-search" value={search} onChange={(event) => setSearch(event.target.value)} className="min-h-11 min-w-0 flex-1 bg-transparent px-1 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-foreground" placeholder="Search current affairs, notes, papers..." data-testid="resource-search" />
              <Button type="submit" className="min-h-11 shrink-0 rounded-xl bg-[#6554e8] px-4 text-xs font-bold text-white hover:bg-[#5747d7] sm:px-5">Find resources</Button>
            </form>
            <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-slate-500 dark:text-muted-foreground">
              <span className="font-black text-slate-700 dark:text-foreground">Popular:</span>
              <button type="button" onClick={() => selectShortcut("current-affairs")} className="min-h-8 rounded-md px-1.5 text-[#6657e8] hover:bg-[#ece9ff]">Current Affairs</button>
              <button type="button" onClick={() => selectShortcut("notes")} className="min-h-8 rounded-md px-1.5 text-[#6657e8] hover:bg-[#ece9ff]">Study Notes</button>
              <button type="button" onClick={() => setLocation("/pyqs")} className="min-h-8 rounded-md px-1.5 text-[#6657e8] hover:bg-[#ece9ff]">Previous Papers</button>
            </div>
          </div>

          <aside className="overflow-hidden rounded-[24px] bg-[radial-gradient(circle_at_100%_0%,#37327f_0%,transparent_45%),linear-gradient(145deg,#111529_0%,#15162b_70%,#111426_100%)] p-6 text-white shadow-[0_24px_46px_rgba(31,30,72,0.16)] sm:p-7" aria-label="Today’s Current Affairs brief" data-testid="daily-brief-card">
            {latestDaily ? (
              <>
                <div className="flex items-center justify-between gap-4">
                  <p className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.14em] text-violet-300"><span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.08)]" /> Daily brief · {formatDate(latestDaily.periodEnd)}</p>
                  <Flame className="h-4 w-4 text-orange-400" aria-hidden="true" />
                </div>
                <h2 className="mt-8 text-[25px] font-black tracking-[-0.04em]">Today in a focused sitting</h2>
                <p className="mt-2 text-[12px] leading-5 text-white/58">Open the latest verified daily release and continue with its quiz when one is published.</p>
                <div className="mt-6 grid grid-cols-3 border-y border-white/10 py-4">
                  <div className="border-r border-white/10 pr-3"><p className="text-xl font-black">{latestDaily.languages.length}</p><p className="mt-1 text-[8px] text-white/48">Languages</p></div>
                  <div className="border-r border-white/10 px-3"><p className="text-xl font-black">{latestDaily.quiz?.itemCount ?? "—"}</p><p className="mt-1 text-[8px] text-white/48">Quiz questions</p></div>
                  <div className="pl-3"><p className="text-xl font-black">{familyLabel(latestDaily.examFamily)}</p><p className="mt-1 text-[8px] text-white/48">Exam family</p></div>
                </div>
                {latestDailyResource ? (
                  <Link href={`/current-affairs/notes/${encodeURIComponent(latestDailyResource.publicCode)}`} className="et-interactive mt-5 flex min-h-11 items-center justify-center gap-2 rounded-lg bg-white px-4 text-[12px] font-black text-[#5f4fe1] hover:bg-violet-50">Start today’s brief <ArrowRight className="h-4 w-4" /></Link>
                ) : (
                  <div className="mt-5 flex min-h-11 items-center justify-center rounded-lg border border-white/15 bg-white/5 px-4 text-center text-[11px] font-semibold text-white/60">Today’s selected-language notes are not published.</div>
                )}
                {user && dashboard ? <p className="mt-4 flex items-center gap-2 text-[9px] font-bold text-white/76"><Flame className="h-3.5 w-3.5 text-orange-400" /> {dashboard.summary.streak > 0 ? `${dashboard.summary.streak}-day Current Affairs study streak` : "Start your Current Affairs study streak today"}</p> : <p className="mt-4 text-[9px] leading-4 text-white/48">Sign in to track Current Affairs study and spaced revision.</p>}
              </>
            ) : hubQuery.isLoading ? (
              <div className="space-y-4" role="status"><div className="h-3 w-36 animate-pulse rounded bg-white/10" /><div className="mt-8 h-8 w-56 animate-pulse rounded bg-white/10" /><div className="h-4 w-full animate-pulse rounded bg-white/10" /><div className="mt-6 h-24 animate-pulse rounded-xl bg-white/10" /></div>
            ) : (
              <>
                <p className="text-[9px] font-black uppercase tracking-[0.14em] text-violet-300">Daily brief</p>
                <h2 className="mt-8 text-2xl font-black tracking-[-0.04em]">No daily brief is published yet.</h2>
                <p className="mt-3 text-[12px] leading-6 text-white/58">ExamTree will show a daily brief here only after a verified Current Affairs release is active.</p>
                <Link href="/current-affairs" className="et-interactive mt-7 flex min-h-11 items-center justify-center rounded-lg border border-white/15 bg-white/5 px-4 text-xs font-bold text-white hover:bg-white/10">Open Current Affairs</Link>
              </>
            )}
          </aside>
        </section>

        <section className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label="Resource categories">
          {shortcuts.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.key} type="button" onClick={() => item.key === "papers" ? setLocation("/pyqs") : selectShortcut(item.key)} className="et-interactive group flex min-h-[92px] items-center gap-4 rounded-[18px] border border-[#dfe1ea] bg-white p-4 text-left shadow-[0_5px_17px_rgba(39,43,68,0.025)] transition hover:-translate-y-0.5 hover:border-[#cbc6ea] hover:shadow-[0_9px_26px_rgba(49,43,105,0.06)] dark:border-border dark:bg-card" data-testid={`resource-shortcut-${item.key}`}>
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.iconSurface} ${item.iconClass}`}><Icon className="h-5 w-5" aria-hidden="true" /></span>
                <span className="min-w-0 flex-1"><span className="block text-[13px] font-black text-slate-950 dark:text-foreground">{item.title}</span><span className="mt-1 block text-[10px] text-slate-500 dark:text-muted-foreground">{item.subtitle}</span></span>
                <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-[#6657e8]" aria-hidden="true" />
              </button>
            );
          })}
        </section>

        <section id="resource-explorer" className="scroll-mt-24 pt-20" aria-labelledby="resource-explorer-heading">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#6657e8]">Explore resources</p>
              <h2 id="resource-explorer-heading" className="mt-3 text-[30px] font-black tracking-[-0.04em] text-[#11172b] dark:text-foreground sm:text-[34px]">Fresh, focused and exam-ready.</h2>
              <p className="mt-2 text-[13px] text-slate-500 dark:text-muted-foreground">Only reviewed or clearly labelled hub content is surfaced here.</p>
            </div>
            <div className="flex max-w-full gap-1 overflow-x-auto rounded-xl bg-[#e9ebf5] p-1.5 dark:bg-muted" aria-label="Resource filters">
              {filterLabels.map((item) => <button key={item.key} type="button" onClick={() => setFilter(item.key)} aria-pressed={filter === item.key} className={`min-h-9 shrink-0 rounded-lg px-3 text-[10px] font-bold transition ${filter === item.key ? "bg-white text-[#6657e8] shadow-sm dark:bg-card dark:text-violet-300" : "text-slate-600 hover:text-slate-950 dark:text-muted-foreground dark:hover:text-foreground"}`}>{item.label}</button>)}
            </div>
          </div>

          {hubQuery.isError && (filter === "all" || filter === "current-affairs" || filter === "notes" || filter === "quizzes") ? (
            <div className="mt-6 rounded-[22px] border border-rose-200 bg-white p-7 text-center dark:border-rose-900 dark:bg-card"><p className="font-black text-slate-950 dark:text-foreground">Current Affairs resources could not be loaded.</p><p className="mt-2 text-sm text-slate-500 dark:text-muted-foreground">No cached or sample Current Affairs content is being substituted.</p></div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3" data-testid="resource-grid">
              {(filter === "all" || filter === "current-affairs" || filter === "notes") && notesPacks.slice(0, filter === "all" ? 4 : 12).map((pack) => <CurrentAffairsCard key={`note-${pack.releaseCode}`} pack={pack} language={language} />)}
              {(filter === "all" || filter === "quizzes") && quizPacks.slice(0, filter === "all" ? 2 : 12).map((pack) => <CurrentAffairsCard key={`quiz-${pack.releaseCode}`} pack={pack} language={language} quizOnly />)}
              {(filter === "all" || filter === "papers") ? <PortalCard type="papers" /> : null}
              {filter === "vocabulary" ? <PortalCard type="vocabulary" /> : null}
              {filter === "updates" ? <PortalCard type="updates" /> : null}
            </div>
          )}

          {!hubQuery.isLoading && !hubQuery.isError && normalizedSearch && notesPacks.length === 0 && quizPacks.length === 0 && !["papers", "vocabulary", "updates"].includes(filter) ? (
            <div className="mt-6 rounded-[22px] border border-dashed border-[#d8d7e3] bg-white p-8 text-center dark:border-border dark:bg-card"><Search className="mx-auto h-6 w-6 text-slate-400" /><p className="mt-3 font-black text-slate-900 dark:text-foreground">No published resources match “{search.trim()}”.</p><button type="button" onClick={() => setSearch("")} className="mt-3 min-h-11 rounded-xl px-4 text-sm font-bold text-[#6657e8] hover:bg-[#f1efff]">Clear search</button></div>
          ) : null}
        </section>

        <section className="mt-12 grid gap-3 border-t border-[#dde0e9] pt-8 sm:grid-cols-3 dark:border-border" aria-label="Resource publishing standards">
          <div className="rounded-2xl bg-white p-5 dark:bg-card"><CheckCircle2 className="h-5 w-5 text-emerald-600" /><h3 className="mt-3 text-sm font-black">Reviewed releases</h3><p className="mt-1 text-xs leading-5 text-slate-500 dark:text-muted-foreground">Current Affairs cards are returned only from active approved learner releases.</p></div>
          <div className="rounded-2xl bg-white p-5 dark:bg-card"><ClipboardCheck className="h-5 w-5 text-[#6657e8]" /><h3 className="mt-3 text-sm font-black">Real quiz counts</h3><p className="mt-1 text-xs leading-5 text-slate-500 dark:text-muted-foreground">Quiz question counts come from the published delivery manifest.</p></div>
          <div className="rounded-2xl bg-white p-5 dark:bg-card"><BookOpen className="h-5 w-5 text-sky-600" /><h3 className="mt-3 text-sm font-black">No filler resources</h3><p className="mt-1 text-xs leading-5 text-slate-500 dark:text-muted-foreground">Unavailable categories stay empty rather than showing invented notes, dates or downloads.</p></div>
        </section>
      </div>
    </div>
  );
}