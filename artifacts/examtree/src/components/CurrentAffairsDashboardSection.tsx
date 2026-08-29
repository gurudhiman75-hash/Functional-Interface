import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  BookOpenCheck,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  Flame,
  RotateCcw,
  Sparkles,
  Target,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getCurrentAffairsDashboard } from "@/lib/current-affairs";
import { getUser } from "@/lib/storage";

function compactDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(date);
}

function MetricCard({
  icon: Icon,
  label,
  value,
  helper,
}: {
  icon: typeof Target;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e8e5f6] bg-white p-4 shadow-[0_6px_22px_rgba(37,42,68,0.035)]">
      <div className="flex items-center gap-2 text-slate-500">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f1efff] text-[#6657e8]">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em]">{label}</span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-slate-950">{value}</p>
      <p className="mt-1 text-[11px] leading-5 text-slate-400">{helper}</p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <section className="mt-6 rounded-3xl border border-[#e7e4f4] bg-white p-5 sm:p-6" aria-label="Loading Current Affairs dashboard">
      <div className="skeleton-shimmer h-6 w-48 rounded-lg" />
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => <div key={index} className="skeleton-shimmer h-28 rounded-2xl" />)}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="skeleton-shimmer h-52 rounded-2xl" />
        <div className="skeleton-shimmer h-52 rounded-2xl" />
      </div>
    </section>
  );
}

export default function CurrentAffairsDashboardSection() {
  const user = getUser();
  const query = useQuery({
    queryKey: ["current-affairs-learner-dashboard", user?.id],
    queryFn: getCurrentAffairsDashboard,
    enabled: Boolean(user),
    retry: false,
    staleTime: 30_000,
  });

  const data = query.data;
  const activityMax = useMemo(
    () => Math.max(1, ...(data?.sevenDayActivity.map((day) => day.questions) ?? [1])),
    [data?.sevenDayActivity],
  );

  if (!user) return null;
  if (query.isLoading) return <DashboardSkeleton />;
  if (!data) {
    return (
      <section className="mt-6 rounded-3xl border border-[#e7e4f4] bg-[linear-gradient(135deg,#ffffff,#faf9ff)] p-6 shadow-[0_8px_28px_rgba(37,42,68,0.035)]">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#6657e8]">Current Affairs</p>
        <h2 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-slate-950">Your CA learning dashboard will appear here</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Tracked Current Affairs quiz and revision activity will populate streak, mastery, weak areas and daily revision priorities automatically.
        </p>
      </section>
    );
  }

  const studied = data.summary.attemptCount > 0;
  const dueLabel = data.revision.dueNow > 0 ? `${data.revision.dueNow} due` : "All clear";

  return (
    <section className="mt-6 overflow-hidden rounded-3xl border border-[#e5e1f5] bg-[radial-gradient(circle_at_90%_0%,rgba(102,87,232,0.12),transparent_22rem),linear-gradient(135deg,#ffffff_0%,#faf9ff_100%)] shadow-[0_10px_34px_rgba(38,42,68,0.045)]" data-testid="current-affairs-dashboard">
      <div className="border-b border-[#ece9f7] p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6657e8]">Current Affairs</p>
              <Badge className="rounded-full bg-[#f0edff] px-2.5 py-0.5 text-[10px] font-semibold text-[#6657e8] hover:bg-[#f0edff]">D3 · D7 · D15 · D30 · D60</Badge>
            </div>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-slate-950">Daily learning pulse</h2>
            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
              See what is due now, what you have mastered, and which current-affairs categories need more attention.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-[#e7e3f5] bg-white/80 px-4 py-3 shadow-sm">
            <Flame className="h-5 w-5 text-orange-500" aria-hidden="true" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">CA streak</p>
              <p className="text-lg font-semibold text-slate-950">{data.summary.streak} day{data.summary.streak === 1 ? "" : "s"}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard icon={Clock3} label="Revision" value={dueLabel} helper={data.revision.overdue ? `${data.revision.overdue} overdue` : data.revision.nextReviewAt ? `Next ${compactDate(data.revision.nextReviewAt)}` : "No pending revision"} />
          <MetricCard icon={BookOpenCheck} label="Mastered" value={String(data.revision.mastered)} helper={`${data.revision.activeItems} active revision items`} />
          <MetricCard icon={Target} label="Accuracy" value={`${Math.round(data.summary.accuracy)}%`} helper={studied ? `${data.summary.correctCount} correct of ${data.summary.questionCount}` : "Starts after your first tracked quiz"} />
          <MetricCard icon={RotateCcw} label="Recovery" value={String(data.revision.recovery)} helper="Wrong or unanswered items due sooner" />
        </div>
      </div>

      <div className="grid gap-5 p-5 sm:p-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Last 7 days</p>
                <h3 className="mt-1 text-base font-semibold text-slate-950">Study consistency</h3>
              </div>
              <BarChart3 className="h-5 w-5 text-[#6657e8]" aria-hidden="true" />
            </div>
            <div className="mt-5 flex h-28 items-end gap-2" aria-label="Seven-day Current Affairs study activity">
              {data.sevenDayActivity.map((day) => {
                const height = day.questions ? Math.max(14, Math.round((day.questions / activityMax) * 88)) : 4;
                return (
                  <div key={day.day} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-2">
                    <div className="relative flex h-24 w-full items-end justify-center rounded-xl bg-[#f7f6fc] px-1">
                      <div className="w-full max-w-8 rounded-lg bg-[#7869ec]" style={{ height: `${height}%` }} title={`${day.questions} questions · ${day.accuracy}% accuracy`} />
                    </div>
                    <span className="text-[9px] font-semibold text-slate-400">{new Intl.DateTimeFormat("en-IN", { weekday: "short", timeZone: "Asia/Kolkata" }).format(new Date(`${day.day}T12:00:00+05:30`)).slice(0, 2)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-[#6657e8]" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Revision ladder</p>
                <h3 className="mt-0.5 text-base font-semibold text-slate-950">Where your memory stands</h3>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {data.revision.stages.map((stage) => (
                <div key={stage.stage} className="rounded-xl border border-[#ece9f6] bg-[#fbfaff] p-3 text-center">
                  <p className="text-[10px] font-bold text-[#6657e8]">{stage.label}</p>
                  <p className="mt-1 text-xl font-semibold text-slate-950">{stage.count}</p>
                  <p className="mt-0.5 text-[9px] text-slate-400">{stage.due ? `${stage.due} due` : "on track"}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Today focus</p>
                <h3 className="mt-1 text-base font-semibold text-slate-950">What to revise first</h3>
              </div>
              <Sparkles className="h-5 w-5 text-amber-500" aria-hidden="true" />
            </div>
            {data.todayFocus.length ? (
              <div className="mt-4 space-y-2">
                {data.todayFocus.map((item) => (
                  <div key={item.category} className="flex items-center justify-between gap-3 rounded-xl bg-[#faf9ff] px-3.5 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">{item.label}</p>
                      <p className="mt-0.5 text-[10px] text-slate-400">{item.recovery ? `${item.recovery} recovery · ` : ""}{item.due} due</p>
                    </div>
                    <span className="flex h-8 min-w-8 items-center justify-center rounded-full bg-[#edeaff] px-2 text-xs font-bold text-[#6657e8]">{item.due}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-4 text-sm text-emerald-700">
                <div className="flex items-center gap-2 font-semibold"><CheckCircle2 className="h-4 w-4" />No Current Affairs revision is due right now.</div>
                <p className="mt-1 text-xs leading-5 text-emerald-600">Your next scheduled items will appear here automatically.</p>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Weak areas</p>
            <h3 className="mt-1 text-base font-semibold text-slate-950">Categories needing attention</h3>
            {data.weakAreas.length ? (
              <div className="mt-4 space-y-3">
                {data.weakAreas.map((item) => (
                  <div key={item.category}>
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="truncate font-semibold text-slate-700">{item.label}</span>
                      <span className="font-bold text-slate-900">{item.accuracy}%</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-[#7869ec]" style={{ width: `${Math.max(4, Math.min(100, item.accuracy))}%` }} />
                    </div>
                    <p className="mt-1 text-[9px] text-slate-400">{item.total} answers · {item.due} due · {item.recovery} recovery</p>
                  </div>
                ))}
              </div>
            ) : <p className="mt-4 text-sm leading-6 text-slate-500">Complete tracked Current Affairs questions to build category-level accuracy and weak-area signals.</p>}
          </div>
        </div>
      </div>

      <div className="grid gap-5 border-t border-[#ece9f7] bg-white/55 p-5 sm:p-6 lg:grid-cols-2">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Latest daily packs</p>
          <div className="mt-3 space-y-2">
            {data.latestDailyQuizzes.length ? data.latestDailyQuizzes.slice(0, 3).map((quiz) => (
              <div key={quiz.quizCode} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">{quiz.examFamily.toUpperCase()} · {compactDate(quiz.periodEnd)}</p>
                  <p className="mt-0.5 text-[10px] text-slate-400">{quiz.itemCount} questions · {quiz.quizCode}</p>
                </div>
                <Badge className={quiz.attempted ? "rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-50" : "rounded-full bg-[#f1efff] text-[#6657e8] hover:bg-[#f1efff]"}>
                  {quiz.attempted ? `${Math.round(quiz.bestScore ?? 0)}%` : "New"}
                </Badge>
              </div>
            )) : <p className="text-sm text-slate-500">No learner Current Affairs quiz pack has been published yet.</p>}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Recent CA activity</p>
          <div className="mt-3 space-y-2">
            {data.recentAttempts.length ? data.recentAttempts.slice(0, 4).map((attempt) => (
              <div key={attempt.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold capitalize text-slate-800">{attempt.attemptType} · {attempt.languageCode.toUpperCase()}</p>
                  <p className="mt-0.5 truncate text-[10px] text-slate-400">{compactDate(attempt.submittedAt)} · {attempt.correct}/{attempt.total} correct</p>
                </div>
                <span className="text-sm font-bold text-slate-900">{Math.round(attempt.scorePercent)}%</span>
              </div>
            )) : <p className="text-sm text-slate-500">Your tracked Current Affairs attempt history will appear here.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
