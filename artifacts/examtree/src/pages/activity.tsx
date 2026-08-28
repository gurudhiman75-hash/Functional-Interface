import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Flame,
  History,
  ListChecks,
  Play,
  Target,
  Trophy,
} from "lucide-react";
import { Link } from "wouter";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getTests, getUserAttempts, type Test, type TestAttempt } from "@/lib/data";
import { getActiveTestSessions, getUser } from "@/lib/storage";

function formatDate(value: string | Date) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatShortDate(value: string | Date) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(date);
}

function formatMinutes(minutes: number) {
  const safe = Math.max(0, Math.round(minutes));
  if (safe < 60) return `${safe}m`;
  const hours = Math.floor(safe / 60);
  const remainder = safe % 60;
  return remainder ? `${hours}h ${remainder}m` : `${hours}h`;
}

function scoreClass(score: number) {
  if (score >= 75) return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  if (score >= 50) return "bg-amber-50 text-amber-700 ring-amber-100";
  return "bg-rose-50 text-rose-700 ring-rose-100";
}

function localDayNumber(value: string | Date) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
}

function getCurrentStreak(attempts: TestAttempt[]) {
  const uniqueDays = Array.from(
    new Set(attempts.map((attempt) => localDayNumber(attempt.createdAt)).filter((value): value is number => value !== null)),
  ).sort((a, b) => b - a);

  if (!uniqueDays.length) return 0;
  const today = localDayNumber(new Date());
  if (today === null) return 0;
  if (uniqueDays[0] !== today && uniqueDays[0] !== today - 1) return 0;

  let streak = 1;
  for (let index = 1; index < uniqueDays.length; index += 1) {
    if (uniqueDays[index] === uniqueDays[index - 1] - 1) streak += 1;
    else break;
  }
  return streak;
}

function ResultLink({ attempt }: { attempt: TestAttempt }) {
  const params = new URLSearchParams({ attemptId: attempt.id, testId: attempt.testId });
  return (
    <Button asChild variant="ghost" size="sm" className="min-h-11 rounded-xl px-3 text-[#6657e8] hover:bg-[#f5f3ff] hover:text-[#594bd9]">
      <Link href={`/result?${params.toString()}`}>
        View result
        <ArrowRight className="ml-1.5 h-4 w-4" />
      </Link>
    </Button>
  );
}

function AttemptHistorySkeleton() {
  return (
    <div className="space-y-1" aria-label="Loading attempt history" role="status">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between gap-4 border-b border-slate-100 py-4 last:border-b-0">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="skeleton-shimmer h-4 w-[min(18rem,72%)] rounded-lg" />
            <div className="skeleton-shimmer h-3 w-[min(26rem,88%)] rounded-lg" />
          </div>
          <div className="skeleton-shimmer h-9 w-24 shrink-0 rounded-xl" />
        </div>
      ))}
      <span className="sr-only">Loading attempt history…</span>
    </div>
  );
}

export default function ActivityPage() {
  const user = getUser();
  const attemptsQuery = useQuery({
    queryKey: ["canonical-attempt-history", user?.id],
    queryFn: () => getUserAttempts(user?.id),
    enabled: Boolean(user),
    retry: false,
    staleTime: 30_000,
  });
  const testsQuery = useQuery({
    queryKey: ["tests"],
    queryFn: getTests,
    staleTime: 60_000,
  });

  const attempts = attemptsQuery.data ?? [];
  const realAttempts = useMemo(
    () => attempts
      .filter((attempt) => !attempt.attemptType || attempt.attemptType === "REAL")
      .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()),
    [attempts],
  );
  const activeSessions = useMemo(
    () => Object.values(getActiveTestSessions()).sort((left, right) => right.updatedAt - left.updatedAt),
    [],
  );

  const stats = useMemo(() => {
    const totalQuestions = realAttempts.reduce((sum, attempt) => sum + attempt.totalQuestions, 0);
    const correct = realAttempts.reduce((sum, attempt) => sum + attempt.correct, 0);
    const totalSeconds = realAttempts.reduce((sum, attempt) => sum + attempt.timeSpent, 0);
    const averageScore = realAttempts.length
      ? Math.round(realAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / realAttempts.length)
      : 0;
    const bestScore = realAttempts.length ? Math.max(...realAttempts.map((attempt) => attempt.score)) : 0;
    const sevenDaysAgo = Date.now() - 7 * 86_400_000;
    const recentCount = realAttempts.filter((attempt) => new Date(attempt.createdAt).getTime() >= sevenDaysAgo).length;

    return {
      count: realAttempts.length,
      averageScore,
      bestScore,
      accuracy: totalQuestions ? Math.round((correct / totalQuestions) * 100) : 0,
      minutes: Math.round(totalSeconds / 60),
      streak: getCurrentStreak(realAttempts),
      recentCount,
    };
  }, [realAttempts]);

  const attemptedTestIds = useMemo(() => new Set(realAttempts.map((attempt) => attempt.testId)), [realAttempts]);
  const availableTests = useMemo(() => {
    const activeIds = new Set(activeSessions.map((session) => session.testId));
    return [...(testsQuery.data ?? [])]
      .filter((test) => !attemptedTestIds.has(test.id) && !activeIds.has(test.id))
      .sort((left, right) => {
        const leftFree = (left.access ?? "free") === "free" ? 1 : 0;
        const rightFree = (right.access ?? "free") === "free" ? 1 : 0;
        if (leftFree !== rightFree) return rightFree - leftFree;
        return (right.attempts ?? 0) - (left.attempts ?? 0);
      })
      .slice(0, 3);
  }, [activeSessions, attemptedTestIds, testsQuery.data]);

  const trendAttempts = useMemo(() => realAttempts.slice(0, 7).reverse(), [realAttempts]);
  const lowestAverageCategory = useMemo(() => {
    const groups = new Map<string, { total: number; count: number }>();
    for (const attempt of realAttempts) {
      const key = attempt.category || "Other";
      const current = groups.get(key) ?? { total: 0, count: 0 };
      current.total += attempt.score;
      current.count += 1;
      groups.set(key, current);
    }
    const values = Array.from(groups.entries()).map(([name, value]) => ({
      name,
      average: Math.round(value.total / value.count),
      count: value.count,
    }));
    if (values.length < 2) return null;
    return values.sort((left, right) => left.average - right.average)[0];
  }, [realAttempts]);

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-[0_14px_44px_rgba(37,42,68,0.06)] sm:p-10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f1efff] text-[#6657e8]">
          <History className="h-7 w-7" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-950">Your activity follows you across devices</h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          Sign in to load saved attempt history, scores, accuracy, and results.
        </p>
        <Button asChild className="mt-6 min-h-11 rounded-xl bg-[#6657e8] px-5 hover:bg-[#594bd9]">
          <Link href="/login/student?next=%2Fdashboard">Sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl pb-8" data-testid="student-dashboard">
      <section
        className="overflow-hidden rounded-3xl border border-[#e6e3f7] bg-[radial-gradient(circle_at_88%_15%,rgba(108,92,241,0.12),transparent_25rem),linear-gradient(115deg,#ffffff_0%,#f8f7ff_100%)] shadow-[0_12px_38px_rgba(40,43,72,0.045)]"
        aria-labelledby="dashboard-title"
      >
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center lg:p-10">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6657e8]">Your dashboard</p>
            <h1 id="dashboard-title" className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-slate-950 sm:text-4xl">
              Welcome back, {user.name}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[15px]">
              Continue your tests, review saved results, and keep your preparation moving from one place.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="min-h-11 rounded-xl bg-[#6657e8] px-5 font-semibold hover:bg-[#594bd9]">
                <Link href="/tests">Browse tests<ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" className="min-h-11 rounded-xl border-[#dedbea] bg-white px-5 font-semibold text-slate-700 hover:bg-[#faf9ff]">
                <Link href="/profile">View profile</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 rounded-2xl border border-white/80 bg-white/75 p-3 shadow-[0_8px_26px_rgba(39,43,72,0.04)] backdrop-blur-sm sm:gap-3 sm:p-4">
            <HeroMetric icon={Flame} label="Streak" value={`${stats.streak}d`} tone="orange" />
            <HeroMetric icon={Trophy} label="Best" value={`${Math.round(stats.bestScore)}%`} tone="purple" />
            <HeroMetric icon={ListChecks} label="7 days" value={String(stats.recentCount)} tone="green" />
          </div>
        </div>
      </section>

      <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Attempt summary" data-testid="dashboard-summary">
        <SummaryCard icon={Target} label="Tests completed" value={String(stats.count)} helper="Saved real attempts" tone="purple" />
        <SummaryCard icon={BarChart3} label="Average score" value={`${stats.averageScore}%`} helper={stats.count ? `Best ${Math.round(stats.bestScore)}%` : "Complete a test to begin"} tone="blue" />
        <SummaryCard icon={CheckCircle2} label="Overall accuracy" value={`${stats.accuracy}%`} helper="Across answered questions" tone="green" />
        <SummaryCard icon={Clock3} label="Test time" value={formatMinutes(stats.minutes)} helper="Across completed tests" tone="orange" />
      </section>

      <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.72fr)]">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_8px_28px_rgba(37,42,68,0.035)] sm:p-6" aria-labelledby="continue-heading">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#6657e8]">Continue learning</p>
              <h2 id="continue-heading" className="mt-2 text-xl font-semibold tracking-[-0.025em] text-slate-950 sm:text-2xl">Pick up where you left off</h2>
            </div>
            {activeSessions.length > 0 ? <Badge className="rounded-full bg-[#fff4e9] px-3 py-1 text-[#b96624] hover:bg-[#fff4e9]">{activeSessions.length} in progress</Badge> : null}
          </div>

          {activeSessions.length > 0 ? (
            <div className="mt-5 space-y-3">
              {activeSessions.slice(0, 2).map((session) => {
                const test = testsQuery.data?.find((item) => item.id === session.testId);
                const answered = Object.values(session.answers).filter((answer) => answer !== null).length;
                const totalQuestions = test?.totalQuestions ?? 0;
                const progress = totalQuestions ? Math.min(100, Math.round((answered / totalQuestions) * 100)) : 0;
                return (
                  <div key={session.testId} className="rounded-2xl border border-[#e9e7f3] bg-[#fbfaff] p-4 sm:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#edeaff] text-[#6657e8]"><Play className="h-4 w-4" /></span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900 sm:text-[15px]">{session.testName}</p>
                            <p className="mt-0.5 text-[11px] text-slate-500">{session.category} · Saved on this device</p>
                          </div>
                        </div>
                        {totalQuestions ? (
                          <div className="mt-4 sm:max-w-md">
                            <div className="mb-1.5 flex items-center justify-between text-[10px] font-semibold text-slate-400">
                              <span>{answered} of {totalQuestions} answered</span>
                              <span className="text-slate-600">{progress}%</span>
                            </div>
                            <div className="h-1.5 overflow-hidden rounded-full bg-[#ebe9f4]" role="progressbar" aria-label={`${session.testName} answered progress`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
                              <span className="block h-full rounded-full bg-[#6657e8]" style={{ width: `${progress}%` }} />
                            </div>
                          </div>
                        ) : null}
                      </div>
                      <Button asChild className="min-h-11 shrink-0 rounded-xl bg-[#6657e8] px-5 font-semibold hover:bg-[#594bd9]">
                        <Link href={`/test/${session.testId}`}>Resume test<ChevronRight className="ml-1.5 h-4 w-4" /></Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-5 flex flex-col items-start justify-between gap-5 rounded-2xl border border-dashed border-[#ddd9ef] bg-[#fbfaff] p-5 sm:flex-row sm:items-center">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#efedff] text-[#6657e8]"><BookOpen className="h-5 w-5" /></span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">No test is currently paused</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">Start any published test and a resumable session will appear here when one is saved.</p>
                </div>
              </div>
              <Button asChild variant="outline" className="min-h-11 shrink-0 rounded-xl border-[#dcd8ee] bg-white font-semibold text-[#6657e8] hover:bg-[#f6f4ff]">
                <Link href="/tests">Find a test</Link>
              </Button>
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_8px_28px_rgba(37,42,68,0.035)] sm:p-6" aria-labelledby="trend-heading">
          <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#6657e8]">Score trend</p>
          <h2 id="trend-heading" className="mt-2 text-xl font-semibold tracking-[-0.025em] text-slate-950">Recent performance</h2>
          <p className="mt-1 text-xs leading-5 text-slate-500">Your latest completed real tests.</p>

          {trendAttempts.length > 0 ? (
            <div className="mt-6">
              <div className="flex h-36 items-end gap-2" aria-label="Recent score chart">
                {trendAttempts.map((attempt) => {
                  const height = Math.max(12, Math.min(100, attempt.score));
                  return (
                    <div key={attempt.id} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-2">
                      <span className="text-[9px] font-bold tabular-nums text-slate-500">{Math.round(attempt.score)}%</span>
                      <div className="flex h-24 w-full max-w-10 items-end overflow-hidden rounded-t-lg bg-[#f1eff8]">
                        <span className="block w-full rounded-t-lg bg-[#7668ec]" style={{ height: `${height}%` }} />
                      </div>
                      <span className="max-w-full truncate text-[9px] text-slate-400">{formatShortDate(attempt.createdAt)}</span>
                    </div>
                  );
                })}
              </div>
              {lowestAverageCategory ? (
                <div className="mt-5 rounded-xl bg-[#faf9ff] px-3 py-3 text-xs leading-5 text-slate-500">
                  <span className="font-semibold text-slate-800">Needs more attention:</span> {lowestAverageCategory.name} currently has your lowest category average at {lowestAverageCategory.average}% across {lowestAverageCategory.count} test{lowestAverageCategory.count !== 1 ? "s" : ""}.
                </div>
              ) : null}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-10 text-center">
              <BarChart3 className="mx-auto h-7 w-7 text-slate-300" />
              <p className="mt-3 text-sm font-semibold text-slate-700">Your score trend will appear here</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">Complete a published test to create your first data point.</p>
            </div>
          )}
        </section>
      </div>

      <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_8px_28px_rgba(37,42,68,0.035)]" aria-labelledby="recent-attempts-heading">
        <div className="flex flex-col gap-3 border-b border-slate-100 bg-[#fcfcff] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#6657e8]">Attempt history</p>
            <h2 id="recent-attempts-heading" className="mt-1.5 text-xl font-semibold tracking-[-0.025em] text-slate-950">Recent attempts</h2>
            <p className="mt-1 text-xs text-slate-500">Saved evaluated attempts from your account.</p>
          </div>
          <Badge variant="outline" className="w-fit shrink-0 rounded-full border-slate-200 bg-white px-3 py-1 text-slate-500">{attempts.length} saved</Badge>
        </div>

        <div className="p-5 sm:p-6">
          {attemptsQuery.isLoading ? (
            <AttemptHistorySkeleton />
          ) : attemptsQuery.error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-700">
              Attempt history could not be loaded. Your live tests remain available.
            </div>
          ) : attempts.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-center sm:py-12">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f0efff] text-[#6657e8]">
                <BookOpen className="h-6 w-6" aria-hidden="true" />
              </span>
              <p className="mt-4 font-semibold text-slate-900">No completed attempts yet</p>
              <p className="mt-1 text-sm text-slate-500">Take a published test to create your first saved result.</p>
              <Button asChild className="mt-5 min-h-11 rounded-xl bg-[#6657e8] hover:bg-[#594bd9]"><Link href="/tests">Start a test</Link></Button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {attempts.slice(0, 8).map((attempt) => (
                <div key={attempt.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f3f1ff] text-[#6657e8]">
                      <CheckCircle2 className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">{attempt.testName}</p>
                      <p className="mt-1 text-[11px] leading-5 text-slate-500">
                        {attempt.category} · {formatDate(attempt.createdAt)} · {attempt.correct} correct, {attempt.wrong} wrong
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 pl-12 sm:pl-0">
                    <span className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-bold tabular-nums ring-1 ${scoreClass(attempt.score)}`}>{Math.round(attempt.score)}%</span>
                    <ResultLink attempt={attempt} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mt-6" aria-labelledby="explore-next-heading">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#6657e8]">Keep practising</p>
            <h2 id="explore-next-heading" className="mt-2 text-xl font-semibold tracking-[-0.025em] text-slate-950 sm:text-2xl">Explore your next test</h2>
            <p className="mt-1 text-xs text-slate-500">Published tests you have not completed yet.</p>
          </div>
          <Button asChild variant="ghost" className="min-h-11 w-fit rounded-xl px-3 font-semibold text-[#6657e8] hover:bg-[#f4f2ff] hover:text-[#594bd9]">
            <Link href="/tests">View all tests<ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>

        {testsQuery.isLoading ? (
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => <div key={index} className="skeleton-shimmer h-44 rounded-2xl" />)}
          </div>
        ) : testsQuery.error ? (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500">The published test list is temporarily unavailable.</div>
        ) : availableTests.length > 0 ? (
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {availableTests.map((test) => <NextTestCard key={test.id} test={test} />)}
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-dashed border-[#ddd9ef] bg-[#fbfaff] p-5 text-sm text-slate-500">
            You have completed the currently available tests shown for this account. Open the test explorer to check the full published catalog.
          </div>
        )}
      </section>
    </div>
  );
}

function HeroMetric({ icon: Icon, label, value, tone }: { icon: typeof Flame; label: string; value: string; tone: "orange" | "purple" | "green" }) {
  const toneClasses = {
    orange: "bg-[#fff3e9] text-[#c66e2f]",
    purple: "bg-[#f0edff] text-[#6657e8]",
    green: "bg-[#eaf8f2] text-[#2d8d6a]",
  }[tone];
  return (
    <div className="min-w-0 rounded-xl px-1 py-2 text-center">
      <span className={`mx-auto flex h-8 w-8 items-center justify-center rounded-xl ${toneClasses}`}><Icon className="h-4 w-4" /></span>
      <div className="mt-2 text-lg font-semibold tracking-tight text-slate-950 sm:text-xl">{value}</div>
      <div className="mt-0.5 truncate text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400">{label}</div>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, helper, tone }: { icon: typeof Target; label: string; value: string; helper: string; tone: "purple" | "blue" | "green" | "orange" }) {
  const toneClasses = {
    purple: "bg-[#f0edff] text-[#6657e8]",
    blue: "bg-[#edf5ff] text-[#4781bd]",
    green: "bg-[#eaf8f2] text-[#2d8d6a]",
    orange: "bg-[#fff3e9] text-[#c66e2f]",
  }[tone];
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_6px_22px_rgba(37,42,68,0.03)] sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums tracking-[-0.035em] text-slate-950 sm:text-3xl">{value}</p>
        </div>
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${toneClasses}`}><Icon className="h-5 w-5" /></span>
      </div>
      <p className="mt-3 text-[10px] leading-4 text-slate-400">{helper}</p>
    </article>
  );
}

function NextTestCard({ test }: { test: Test }) {
  const isFree = (test.access ?? "free") === "free";
  return (
    <article className="flex min-h-44 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_7px_24px_rgba(37,42,68,0.03)] transition hover:-translate-y-0.5 hover:border-[#ddd9ef] hover:shadow-[0_12px_30px_rgba(37,42,68,0.055)]">
      <div className="flex items-start justify-between gap-3">
        <span className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.08em] ${isFree ? "bg-[#eaf8f2] text-[#238a68]" : "bg-[#fff4e9] text-[#a66d29]"}`}>
          {isFree ? "Free" : "Paid"}
        </span>
        <span className="text-[10px] font-semibold text-slate-400">{test.difficulty}</span>
      </div>
      <h3 className="mt-3 line-clamp-2 text-[15px] font-semibold leading-5 text-slate-900">{test.name}</h3>
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-medium text-slate-500">
        <span>{test.duration} min</span>
        <span>·</span>
        <span>{test.totalQuestions} questions</span>
      </div>
      <div className="mt-auto pt-4">
        <Button asChild variant="outline" className="min-h-11 w-full rounded-xl border-[#ddd9ef] bg-white font-semibold text-[#6657e8] hover:bg-[#f6f4ff]">
          <Link href={`/test/${test.id}`}>{isFree ? "Start test" : "View access"}<ChevronRight className="ml-1.5 h-4 w-4" /></Link>
        </Button>
      </div>
    </article>
  );
}
