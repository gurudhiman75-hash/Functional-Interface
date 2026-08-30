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
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Link } from "wouter";

import { Badge } from "@/components/ui/badge";
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
  const dashboard = dashboardQuery.data;

  return (
    <div className="mx-auto w-full max-w-7xl pb-12" data-testid="current-affairs-hub">
      <section className="overflow-hidden rounded-3xl border border-[#e3dff6] bg-[radial-gradient(circle_at_88%_10%,rgba(102,87,232,0.18),transparent_25rem),linear-gradient(125deg,#ffffff_0%,#f8f7ff_100%)] shadow-[0_14px_46px_rgba(37,42,68,0.055)]">
        <div className="grid gap-7 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center lg:p-10">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="rounded-full bg-[#efeaff] px-3 py-1 text-[#6657e8] hover:bg-[#efeaff]">Current Affairs</Badge>
              <Badge variant="outline" className="rounded-full border-[#ddd8f2] bg-white/70 text-slate-600">Verified · EN/HI/PA</Badge>
            </div>
            <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.045em] text-slate-950 sm:text-4xl lg:text-5xl">
              Read today. Test yourself. Remember it for the exam.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-[15px]">
              Daily, weekly and monthly Current Affairs built from verified Examtree releases, with multilingual notes, quizzes and D3–D60 revision.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {latestDaily?.resources[language] ? (
                <Button asChild className="min-h-11 rounded-xl bg-[#6657e8] px-5 font-semibold hover:bg-[#594bd9]">
                  <Link href={`/current-affairs/notes/${encodeURIComponent(latestDaily.resources[language]!.publicCode)}`}>
                    Read latest daily <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : null}
              {user ? (
                <Button asChild variant="outline" className="min-h-11 rounded-xl border-[#dcd7ef] bg-white px-5 font-semibold text-slate-700 hover:bg-[#faf9ff]">
                  <Link href="/current-affairs/revision">
                    <BrainCircuit className="mr-2 h-4 w-4 text-[#6657e8]" />
                    Revise due items
                  </Link>
                </Button>
              ) : (
                <Button asChild variant="outline" className="min-h-11 rounded-xl border-[#dcd7ef] bg-white px-5 font-semibold text-slate-700 hover:bg-[#faf9ff]">
                  <Link href="/login/student?next=%2Fcurrent-affairs">Sign in to track progress</Link>
                </Button>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-white/90 bg-white/80 p-5 shadow-[0_10px_32px_rgba(37,42,68,0.05)] backdrop-blur-sm">
            {user && dashboard ? (
              <>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#6657e8]">Your CA pulse</p>
                    <p className="mt-1 text-lg font-semibold text-slate-950">Keep today’s memory loop moving</p>
                  </div>
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-500"><Flame className="h-5 w-5" /></span>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-2">
                  <div className="rounded-2xl bg-[#f8f7ff] p-3 text-center"><p className="text-xl font-semibold text-slate-950">{dashboard.summary.streak}</p><p className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide text-slate-400">day streak</p></div>
                  <div className="rounded-2xl bg-[#f8f7ff] p-3 text-center"><p className="text-xl font-semibold text-slate-950">{dashboard.revision.dueNow}</p><p className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide text-slate-400">due now</p></div>
                  <div className="rounded-2xl bg-[#f8f7ff] p-3 text-center"><p className="text-xl font-semibold text-slate-950">{Math.round(dashboard.summary.accuracy)}%</p><p className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide text-slate-400">accuracy</p></div>
                </div>
                <Button asChild variant="ghost" className="mt-4 w-full justify-between rounded-xl text-[#6657e8] hover:bg-[#f5f3ff] hover:text-[#594bd9]">
                  <Link href="/dashboard">Open learning dashboard <ArrowRight className="h-4 w-4" /></Link>
                </Button>
              </>
            ) : (
              <>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#efeaff] text-[#6657e8]"><Sparkles className="h-5 w-5" /></span>
                <h2 className="mt-4 text-xl font-semibold tracking-[-0.025em] text-slate-950">One verified package, three study modes</h2>
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <div className="flex gap-3"><BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-[#6657e8]" /><span>Exam-ready notes in English, Hindi and Punjabi.</span></div>
                  <div className="flex gap-3"><ClipboardCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#6657e8]" /><span>Question sets with server-side answers and explanations.</span></div>
                  <div className="flex gap-3"><RotateCcw className="mt-0.5 h-4 w-4 shrink-0 text-[#6657e8]" /><span>Signed-in learners get spaced revision automatically.</span></div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_8px_28px_rgba(37,42,68,0.035)] sm:p-5" aria-label="Current Affairs filters">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {PERIODS.map((item) => (
              <button key={item.value} type="button" onClick={() => setPeriod(item.value)} className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${period === item.value ? "bg-[#6657e8] text-white" : "bg-slate-50 text-slate-600 hover:bg-[#f4f2ff] hover:text-[#6657e8]"}`}>
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <CalendarDays className="h-4 w-4 text-slate-400" />
              <select value={family} onChange={(event) => setFamily(event.target.value as CurrentAffairsExamFamily | "all")} className="min-h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#9b91ee]">
                {FAMILIES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
            </label>
            <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1" aria-label="Current Affairs language">
              <Languages className="ml-1 h-4 w-4 text-slate-400" />
              {LANGUAGES.map((item) => (
                <button key={item.value} type="button" onClick={() => setLanguage(item.value)} className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold ${language === item.value ? "bg-white text-[#6657e8] shadow-sm" : "text-slate-500"}`}>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6" aria-labelledby="current-affairs-packs-heading">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#6657e8]">Study library</p>
            <h2 id="current-affairs-packs-heading" className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Current Affairs packs</h2>
          </div>
          <p className="text-xs text-slate-400">{packs.length} available</p>
        </div>

        {hubQuery.isLoading ? (
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => <div key={index} className="skeleton-shimmer h-64 rounded-3xl" />)}
          </div>
        ) : hubQuery.isError ? (
          <div className="mt-4 rounded-3xl border border-rose-100 bg-rose-50 p-6 text-sm text-rose-700">Current Affairs packs could not be loaded right now.</div>
        ) : packs.length === 0 ? (
          <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-8 text-center">
            <CheckCircle2 className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-3 font-semibold text-slate-800">No published pack matches these filters.</p>
            <p className="mt-1 text-sm text-slate-500">Try another period or exam family.</p>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {packs.map((pack) => {
              const resource = pack.resources[language];
              return (
                <article key={pack.releaseCode} className="flex min-h-64 flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_7px_26px_rgba(37,42,68,0.035)] transition hover:-translate-y-0.5 hover:border-[#d8d2f2] hover:shadow-[0_14px_36px_rgba(57,50,120,0.08)]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge className="rounded-full bg-[#f1efff] text-[#6657e8] hover:bg-[#f1efff]">{periodLabel(pack.periodType)}</Badge>
                      <Badge variant="outline" className="rounded-full border-slate-200 text-slate-500">{familyLabel(pack.examFamily)}</Badge>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400">V{pack.releaseVersion}</span>
                  </div>
                  <h3 className="mt-4 line-clamp-2 text-lg font-semibold tracking-[-0.02em] text-slate-950">{resource?.title ?? `${familyLabel(pack.examFamily)} Current Affairs`}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">{resource?.summary || `${formatDate(pack.periodStart)} – ${formatDate(pack.periodEnd)} verified revision pack.`}</p>
                  <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-400">
                    <CalendarDays className="h-3.5 w-3.5" />
                    <span>{pack.periodStart === pack.periodEnd ? formatDate(pack.periodEnd) : `${formatDate(pack.periodStart)} – ${formatDate(pack.periodEnd)}`}</span>
                  </div>
                  <div className="mt-auto flex flex-wrap gap-2 pt-5">
                    {resource ? (
                      <Button asChild size="sm" className="min-h-10 rounded-xl bg-[#6657e8] px-4 hover:bg-[#594bd9]">
                        <Link href={`/current-affairs/notes/${encodeURIComponent(resource.publicCode)}`}><BookOpen className="mr-1.5 h-4 w-4" />Read notes</Link>
                      </Button>
                    ) : null}
                    {pack.quiz ? (
                      <Button asChild size="sm" variant="outline" className="min-h-10 rounded-xl border-[#dcd7ef] px-4 text-[#6657e8] hover:bg-[#f7f5ff]">
                        <Link href={`/current-affairs/quiz/${encodeURIComponent(pack.quiz.publicCode)}?language=${language}`}><ClipboardCheck className="mr-1.5 h-4 w-4" />{pack.quiz.itemCount} Q quiz</Link>
                      </Button>
                    ) : (
                      <span className="flex items-center rounded-xl bg-slate-50 px-3 py-2 text-[10px] font-semibold text-slate-400">Notes only</span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
