import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Flame,
  Languages,
  Newspaper,
  Search,
  Sparkles,
} from "lucide-react";
import { Link } from "wouter";

import { Button } from "@/components/ui/button";
import {
  getCurrentAffairsDashboard,
  getCurrentAffairsHub,
  type CurrentAffairsExamFamily,
  type CurrentAffairsLanguage,
  type CurrentAffairsPeriod,
} from "@/lib/current-affairs";
import { getUser } from "@/lib/storage";

const PERIODS: Array<{ value: CurrentAffairsPeriod | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

const FAMILIES: Array<{ value: CurrentAffairsExamFamily | "all"; label: string }> = [
  { value: "all", label: "All exams" },
  { value: "ssc", label: "SSC" },
  { value: "banking", label: "Banking" },
  { value: "punjab", label: "Punjab" },
  { value: "railways", label: "Railways" },
  { value: "general", label: "General" },
];

const LANGUAGES: Array<{ value: CurrentAffairsLanguage; label: string }> = [
  { value: "en", label: "English" },
  { value: "hi", label: "हिन्दी" },
  { value: "pa", label: "ਪੰਜਾਬੀ" },
];

function formatDate(value: string) {
  const date = new Date(`${value}T12:00:00+05:30`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

function periodLabel(period: CurrentAffairsPeriod) {
  return period.charAt(0).toUpperCase() + period.slice(1);
}

function familyLabel(family: CurrentAffairsExamFamily) {
  if (family === "ssc") return "SSC";
  if (family === "banking") return "Banking";
  if (family === "punjab") return "Punjab";
  if (family === "railways") return "Railways";
  return "General";
}

export default function CurrentAffairsPage() {
  const user = getUser();
  const [period, setPeriod] = useState<CurrentAffairsPeriod | "all">("all");
  const [family, setFamily] = useState<CurrentAffairsExamFamily | "all">("all");
  const [language, setLanguage] = useState<CurrentAffairsLanguage>("en");
  const [search, setSearch] = useState("");

  const hubQuery = useQuery({
    queryKey: ["current-affairs-hub", period, family],
    queryFn: () => getCurrentAffairsHub({
      periodType: period === "all" ? null : period,
      examFamily: family === "all" ? null : family,
      limit: 80,
    }),
    staleTime: 60_000,
  });
  const dashboardQuery = useQuery({
    queryKey: ["current-affairs-learner-dashboard", user?.id],
    queryFn: getCurrentAffairsDashboard,
    enabled: Boolean(user),
    retry: false,
    staleTime: 30_000,
  });

  const packs = hubQuery.data?.packs ?? [];
  const latestDaily = useMemo(() => packs.find((pack) => pack.periodType === "daily") ?? null, [packs]);
  const latestResource = latestDaily?.resources[language] ?? null;
  const dashboard = dashboardQuery.data;
  const visiblePacks = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) return packs;
    return packs.filter((pack) => {
      const resource = pack.resources[language];
      return `${resource?.title ?? ""} ${resource?.summary ?? ""} ${pack.examFamily} ${pack.periodType}`.toLowerCase().includes(needle);
    });
  }, [language, packs, search]);

  return (
    <div className="min-h-screen bg-[#f4f6fb] dark:bg-background" data-testid="current-affairs-hub">
      <div className="mx-auto max-w-[1120px] px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pt-11">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start">
          <div className="pt-2 lg:pt-4">
            <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.1em] text-slate-700 dark:text-muted-foreground"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Verified current affairs · EN / HI / PA</p>
            <h1 className="mt-6 max-w-[650px] text-[38px] font-black leading-[1.02] tracking-[-0.05em] text-[#11172b] dark:text-foreground sm:text-[48px] lg:text-[51px]">Know what matters.<br /><span className="text-[#6554e8]">Remember it for the exam.</span></h1>
            <p className="mt-5 max-w-[650px] text-[14px] leading-7 text-slate-600 dark:text-muted-foreground sm:text-[15px]">Daily, weekly and monthly releases built from the verified ExamTree Current Affairs pipeline, with multilingual notes, quizzes and spaced revision.</p>

            <div className="mt-7 flex max-w-[650px] items-center gap-2 rounded-2xl border border-[#d7dae5] bg-white p-1.5 shadow-[0_8px_24px_rgba(38,43,74,0.05)] dark:border-border dark:bg-card">
              <Search className="ml-2 h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
              <label htmlFor="current-affairs-search" className="sr-only">Search Current Affairs</label>
              <input id="current-affairs-search" value={search} onChange={(event) => setSearch(event.target.value)} className="min-h-11 min-w-0 flex-1 bg-transparent px-1 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-foreground" placeholder="Search releases, exam families..." data-testid="current-affairs-search" />
              <Button type="button" onClick={() => document.getElementById("ca-library")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="min-h-11 rounded-xl bg-[#6554e8] px-4 text-xs font-bold text-white hover:bg-[#5747d7] sm:px-5">Find resources</Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {PERIODS.slice(1).map((item) => <button key={item.value} type="button" onClick={() => setPeriod(item.value)} className="min-h-9 rounded-lg px-2 text-[10px] font-bold text-[#6657e8] hover:bg-[#ece9ff]">{item.label}</button>)}
              <Link href="/resources" className="et-interactive inline-flex min-h-9 items-center rounded-lg px-2 text-[10px] font-bold text-slate-500 hover:bg-white hover:text-[#6657e8]">All free resources <ArrowRight className="ml-1 h-3 w-3" /></Link>
            </div>
          </div>

          <aside className="overflow-hidden rounded-[24px] bg-[radial-gradient(circle_at_100%_0%,#38327f_0%,transparent_45%),linear-gradient(145deg,#111529_0%,#15162b_70%,#111426_100%)] p-6 text-white shadow-[0_24px_46px_rgba(31,30,72,0.16)] sm:p-7" aria-label="Latest daily Current Affairs">
            {latestDaily ? (
              <>
                <div className="flex items-center justify-between"><p className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.14em] text-violet-300"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Daily brief · {formatDate(latestDaily.periodEnd)}</p><Flame className="h-4 w-4 text-orange-400" /></div>
                <h2 className="mt-8 text-[25px] font-black tracking-[-0.04em]">Today in a focused sitting</h2>
                <p className="mt-2 text-[12px] leading-5 text-white/58">Read the latest verified daily notes, then test recall with the published quiz.</p>
                <div className="mt-6 grid grid-cols-3 border-y border-white/10 py-4">
                  <div className="border-r border-white/10 pr-3"><p className="text-xl font-black">{latestDaily.languages.length}</p><p className="mt-1 text-[8px] text-white/48">Languages</p></div>
                  <div className="border-r border-white/10 px-3"><p className="text-xl font-black">{latestDaily.quiz?.itemCount ?? "—"}</p><p className="mt-1 text-[8px] text-white/48">Quiz questions</p></div>
                  <div className="pl-3"><p className="truncate text-base font-black">{familyLabel(latestDaily.examFamily)}</p><p className="mt-1 text-[8px] text-white/48">Exam family</p></div>
                </div>
                {latestResource ? <Link href={`/current-affairs/notes/${encodeURIComponent(latestResource.publicCode)}`} className="et-interactive mt-5 flex min-h-11 items-center justify-center gap-2 rounded-lg bg-white px-4 text-[12px] font-black text-[#5f4fe1] hover:bg-violet-50">Start today’s brief <ArrowRight className="h-4 w-4" /></Link> : <div className="mt-5 flex min-h-11 items-center justify-center rounded-lg border border-white/15 bg-white/5 px-4 text-center text-[11px] font-semibold text-white/60">Selected-language notes are not published.</div>}
                {user && dashboard ? <p className="mt-4 flex items-center gap-2 text-[9px] font-bold text-white/76"><Flame className="h-3.5 w-3.5 text-orange-400" /> {dashboard.summary.streak > 0 ? `${dashboard.summary.streak}-day study streak` : "Start your Current Affairs study streak today"}</p> : <p className="mt-4 text-[9px] text-white/48">Sign in to track spaced revision and progress.</p>}
              </>
            ) : hubQuery.isLoading ? (
              <div className="space-y-4" role="status"><div className="h-3 w-36 animate-pulse rounded bg-white/10" /><div className="mt-8 h-8 w-56 animate-pulse rounded bg-white/10" /><div className="h-4 w-full animate-pulse rounded bg-white/10" /><div className="mt-6 h-24 animate-pulse rounded-xl bg-white/10" /></div>
            ) : (
              <><p className="text-[9px] font-black uppercase tracking-[0.14em] text-violet-300">Daily brief</p><h2 className="mt-8 text-2xl font-black tracking-[-0.04em]">No daily release is published yet.</h2><p className="mt-3 text-[12px] leading-6 text-white/58">This card activates only when an approved daily release is available.</p></>
            )}
          </aside>
        </section>

        <section className="mt-10 grid gap-3 md:grid-cols-3" aria-label="Current Affairs study modes">
          <div className="flex min-h-[92px] items-center gap-4 rounded-[18px] border border-[#dfe1ea] bg-white p-4 dark:border-border dark:bg-card"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eeeaff] text-[#6755e8]"><BookOpen className="h-5 w-5" /></span><div><p className="text-[13px] font-black text-slate-950 dark:text-foreground">Exam-ready notes</p><p className="mt-1 text-[10px] text-slate-500">English, Hindi and Punjabi</p></div></div>
          <div className="flex min-h-[92px] items-center gap-4 rounded-[18px] border border-[#dfe1ea] bg-white p-4 dark:border-border dark:bg-card"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-700"><ClipboardCheck className="h-5 w-5" /></span><div><p className="text-[13px] font-black text-slate-950 dark:text-foreground">Daily quizzes</p><p className="mt-1 text-[10px] text-slate-500">Server-graded published questions</p></div></div>
          {user ? <Link href="/current-affairs/revision" className="et-interactive flex min-h-[92px] items-center gap-4 rounded-[18px] border border-[#dfe1ea] bg-white p-4 dark:border-border dark:bg-card"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-700"><BrainCircuit className="h-5 w-5" /></span><div className="min-w-0 flex-1"><p className="text-[13px] font-black text-slate-950 dark:text-foreground">Spaced revision</p><p className="mt-1 text-[10px] text-slate-500">D3–D60 due queue</p></div><ArrowRight className="h-4 w-4 text-slate-400" /></Link> : <Link href="/login/student?next=%2Fcurrent-affairs%2Frevision" className="et-interactive flex min-h-[92px] items-center gap-4 rounded-[18px] border border-[#dfe1ea] bg-white p-4 dark:border-border dark:bg-card"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-700"><BrainCircuit className="h-5 w-5" /></span><div><p className="text-[13px] font-black text-slate-950 dark:text-foreground">Spaced revision</p><p className="mt-1 text-[10px] text-slate-500">Sign in to build your due queue</p></div></Link>}
        </section>

        <section id="ca-library" className="scroll-mt-24 pt-20" aria-labelledby="ca-library-heading">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#6657e8]">Current Affairs library</p><h2 id="ca-library-heading" className="mt-3 text-[30px] font-black tracking-[-0.04em] text-[#11172b] dark:text-foreground sm:text-[34px]">Fresh, verified and exam-ready.</h2><p className="mt-2 text-[13px] text-slate-500 dark:text-muted-foreground">Filter the active learner releases by period, exam and language.</p></div>
            <div className="flex max-w-full gap-1 overflow-x-auto rounded-xl bg-[#e9ebf5] p-1.5 dark:bg-muted">{PERIODS.map((item) => <button key={item.value} type="button" onClick={() => setPeriod(item.value)} aria-pressed={period === item.value} className={`min-h-9 shrink-0 rounded-lg px-3 text-[10px] font-bold ${period === item.value ? "bg-white text-[#6657e8] shadow-sm dark:bg-card dark:text-violet-300" : "text-slate-600 dark:text-muted-foreground"}`}>{item.label}</button>)}</div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <select value={family} onChange={(event) => setFamily(event.target.value as CurrentAffairsExamFamily | "all")} className="min-h-11 rounded-xl border border-[#dfe1ea] bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-[#9b91ee] dark:border-border dark:bg-card dark:text-foreground" aria-label="Filter Current Affairs by exam">{FAMILIES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select>
            <div className="flex items-center gap-1 rounded-xl border border-[#dfe1ea] bg-white p-1 dark:border-border dark:bg-card" aria-label="Current Affairs language"><Languages className="ml-1 h-4 w-4 text-slate-400" />{LANGUAGES.map((item) => <button key={item.value} type="button" onClick={() => setLanguage(item.value)} className={`min-h-9 rounded-lg px-2.5 text-xs font-semibold ${language === item.value ? "bg-[#f1efff] text-[#6657e8]" : "text-slate-500"}`}>{item.label}</button>)}</div>
          </div>

          {hubQuery.isLoading ? <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <div key={index} className="skeleton-shimmer h-[390px] rounded-[22px]" />)}</div> : hubQuery.isError ? <div className="mt-6 rounded-[22px] border border-rose-200 bg-white p-7 text-center text-sm text-rose-700 dark:border-rose-900 dark:bg-card">Current Affairs releases could not be loaded. No sample content is being substituted.</div> : visiblePacks.length === 0 ? <div className="mt-6 rounded-[22px] border border-dashed border-[#d8d7e3] bg-white p-9 text-center dark:border-border dark:bg-card"><CheckCircle2 className="mx-auto h-7 w-7 text-slate-300" /><p className="mt-3 font-black text-slate-900 dark:text-foreground">No published release matches these filters.</p><p className="mt-1 text-sm text-slate-500">Try another period, exam family or search term.</p></div> : (
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {visiblePacks.map((pack) => {
                const resource = pack.resources[language];
                return (
                  <article key={pack.releaseCode} className="group overflow-hidden rounded-[22px] border border-[#dfe1eb] bg-white shadow-[0_7px_22px_rgba(35,40,65,0.035)] transition hover:-translate-y-0.5 hover:border-[#cec8ee] hover:shadow-[0_14px_34px_rgba(52,45,111,0.08)] dark:border-border dark:bg-card">
                    <div className="relative h-40 overflow-hidden border-b border-[#e7e4ef] bg-[radial-gradient(circle_at_80%_20%,rgba(102,87,232,0.24),transparent_8rem),linear-gradient(135deg,#f8f7ff_0%,#ece9ff_48%,#f8fbff_100%)] dark:border-border dark:bg-none dark:bg-muted/50"><span className="absolute left-5 top-5 rounded-full border border-white/80 bg-white/80 px-2.5 py-1 text-[9px] font-black tracking-[0.13em] text-[#6657e8] shadow-sm">{periodLabel(pack.periodType).toUpperCase()}</span><span className="absolute bottom-5 left-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#6657e8] shadow-[0_10px_28px_rgba(64,52,140,0.12)] dark:bg-card"><Newspaper className="h-6 w-6" /></span><p className="absolute bottom-5 right-5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">{familyLabel(pack.examFamily)}</p></div>
                    <div className="flex min-h-[250px] flex-col p-5"><div className="flex items-center justify-between gap-3 text-[10px] font-semibold text-slate-400"><span>{pack.periodStart === pack.periodEnd ? formatDate(pack.periodEnd) : `${formatDate(pack.periodStart)} – ${formatDate(pack.periodEnd)}`}</span><span>{language.toUpperCase()}</span></div><h3 className="mt-4 line-clamp-2 text-[18px] font-black leading-6 tracking-[-0.025em] text-slate-950 dark:text-foreground">{resource?.title ?? `${familyLabel(pack.examFamily)} Current Affairs`}</h3><p className="mt-2 line-clamp-3 text-[13px] leading-6 text-slate-600 dark:text-muted-foreground">{resource?.summary || "This language resource is not published for the selected release."}</p><div className="mt-auto flex flex-wrap gap-2 pt-5">{resource ? <Link href={`/current-affairs/notes/${encodeURIComponent(resource.publicCode)}`} className="et-interactive inline-flex min-h-11 items-center gap-2 text-[13px] font-black text-[#6657e8] dark:text-violet-300">Read notes <ArrowRight className="h-4 w-4" /></Link> : null}{pack.quiz ? <Link href={`/current-affairs/quiz/${encodeURIComponent(pack.quiz.publicCode)}?language=${language}`} className="et-interactive ml-auto inline-flex min-h-11 items-center gap-1 rounded-xl bg-[#f3f1ff] px-3 text-[11px] font-black text-[#6657e8] hover:bg-[#e9e5ff]">{pack.quiz.itemCount} Q quiz <ArrowRight className="h-3.5 w-3.5" /></Link> : null}</div></div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="mt-12 flex flex-col gap-4 rounded-[22px] border border-[#ddd9f2] bg-white p-6 dark:border-border dark:bg-card sm:flex-row sm:items-center sm:justify-between"><div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#6657e8]">More free preparation</p><h2 className="mt-2 text-xl font-black tracking-[-0.03em] text-slate-950 dark:text-foreground">Current Affairs is one part of the resource library.</h2><p className="mt-1 text-sm text-slate-500">Open the full hub for papers and future reviewed resource categories.</p></div><Button asChild className="min-h-11 shrink-0 rounded-xl bg-[#6657e8] px-5 text-white hover:bg-[#5747d7]"><Link href="/resources"><Sparkles className="mr-2 h-4 w-4" />Explore all resources</Link></Button></section>
      </div>
    </div>
  );
}