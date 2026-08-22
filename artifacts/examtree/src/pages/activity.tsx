import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock3,
  History,
  Target,
} from "lucide-react";
import { Link } from "wouter";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getTests, getUserAttempts, type TestAttempt } from "@/lib/data";
import { getUser } from "@/lib/storage";

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

function scoreClass(score: number) {
  if (score >= 75) return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (score >= 50) return "border-amber-200 bg-amber-50 text-amber-800";
  return "border-rose-200 bg-rose-50 text-rose-800";
}

function resultHref(attempt: TestAttempt) {
  const params = new URLSearchParams({ attemptId: attempt.id, testId: attempt.testId });
  return `/result?${params.toString()}`;
}

function ResultLink({ attempt }: { attempt: TestAttempt }) {
  return (
    <Button asChild variant="ghost" size="sm" className="min-h-11 px-3 text-indigo-800 hover:bg-indigo-50 hover:text-indigo-950">
      <Link href={resultHref(attempt)}>
        View result
        <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
      </Link>
    </Button>
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
    () => attempts.filter((attempt) => !attempt.attemptType || attempt.attemptType === "REAL"),
    [attempts],
  );
  const stats = useMemo(() => {
    const totalQuestions = realAttempts.reduce((sum, attempt) => sum + attempt.totalQuestions, 0);
    const correct = realAttempts.reduce((sum, attempt) => sum + attempt.correct, 0);
    const totalSeconds = realAttempts.reduce((sum, attempt) => sum + attempt.timeSpent, 0);
    const averageScore = realAttempts.length
      ? Math.round(realAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / realAttempts.length)
      : 0;
    return {
      count: realAttempts.length,
      averageScore,
      accuracy: totalQuestions ? Math.round((correct / totalQuestions) * 100) : 0,
      minutes: Math.round(totalSeconds / 60),
    };
  }, [realAttempts]);

  const latestAttempt = realAttempts[0] ?? attempts[0] ?? null;

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-3xl py-6 sm:py-10">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 sm:px-8">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-800">
              <History className="h-5 w-5" aria-hidden="true" />
            </span>
          </div>
          <div className="px-6 py-8 sm:px-8 sm:py-10">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Your activity follows you across devices</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
              Sign in to load canonical attempt history, scores, accuracy, and saved results.
            </p>
            <Button asChild className="mt-6 min-h-11 bg-indigo-700 px-5 text-white hover:bg-indigo-800">
              <Link href="/login/student?next=%2Fdashboard">Sign in</Link>
            </Button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8" data-testid="preparation-workspace">
      <header className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-medium text-teal-700">Preparation workspace</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Welcome back, {user.name}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Pick up from your latest result, understand your recent pattern, or start another published mock.
          </p>
        </div>
        <Button asChild className="min-h-11 shrink-0 bg-indigo-700 px-5 text-white hover:bg-indigo-800">
          <Link href="/tests">
            Browse live tests
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </header>

      <section className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white lg:grid-cols-[1.45fr_0.55fr]" data-testid="preparation-next-step">
        <div className="p-5 sm:p-7 lg:p-8">
          <p className="text-sm font-medium text-slate-500">Next step</p>
          {attemptsQuery.isLoading ? (
            <div className="mt-4 space-y-3" aria-label="Loading preparation activity">
              <div className="skeleton-shimmer h-8 max-w-md rounded-lg" />
              <div className="skeleton-shimmer h-5 max-w-xl rounded-lg" />
              <div className="skeleton-shimmer h-11 w-40 rounded-lg" />
            </div>
          ) : latestAttempt ? (
            <div className="mt-3">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Review your latest result</h2>
                <Badge variant="outline" className={scoreClass(latestAttempt.score)}>{latestAttempt.score}%</Badge>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {latestAttempt.testName} · {latestAttempt.category} · {formatDate(latestAttempt.createdAt)}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button asChild className="min-h-11 bg-indigo-700 px-5 text-white hover:bg-indigo-800">
                  <Link href={resultHref(latestAttempt)}>
                    Review result
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="min-h-11 border-slate-300 bg-white px-5 text-slate-800">
                  <Link href="/tests">Choose next test</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-3">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Build your first benchmark</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                Take a published mock to create your first saved score, accuracy reading, and review history.
              </p>
              <Button asChild className="mt-5 min-h-11 bg-indigo-700 px-5 text-white hover:bg-indigo-800">
                <Link href="/tests">Start a test <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link>
              </Button>
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 bg-slate-50 p-5 sm:p-7 lg:border-l lg:border-t-0 lg:p-8">
          <p className="text-sm font-semibold text-slate-950">Preparation snapshot</p>
          <dl className="mt-5 space-y-4">
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <dt className="text-sm text-slate-600">Attempts</dt>
              <dd className="text-lg font-semibold tabular-nums text-slate-950">{stats.count}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <dt className="text-sm text-slate-600">Average score</dt>
              <dd className="text-lg font-semibold tabular-nums text-slate-950">{stats.averageScore}%</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-sm text-slate-600">Published tests</dt>
              <dd className="text-lg font-semibold tabular-nums text-slate-950">{testsQuery.data?.length ?? 0}</dd>
            </div>
          </dl>
        </div>
      </section>

      <dl className="grid border-y border-slate-200 bg-white sm:grid-cols-2 lg:grid-cols-4" data-testid="preparation-metrics">
        <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-5 sm:border-r lg:border-b-0">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-800"><Target className="h-4 w-4" aria-hidden="true" /></span>
          <div><dt className="text-xs font-medium text-slate-500">Real attempts</dt><dd className="mt-0.5 text-xl font-semibold tabular-nums text-slate-950">{stats.count}</dd></div>
        </div>
        <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-5 lg:border-b-0 lg:border-r">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-800"><BarChart3 className="h-4 w-4" aria-hidden="true" /></span>
          <div><dt className="text-xs font-medium text-slate-500">Average score</dt><dd className="mt-0.5 text-xl font-semibold tabular-nums text-slate-950">{stats.averageScore}%</dd></div>
        </div>
        <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-5 sm:border-b-0 sm:border-r">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800"><CheckCircle2 className="h-4 w-4" aria-hidden="true" /></span>
          <div><dt className="text-xs font-medium text-slate-500">Overall accuracy</dt><dd className="mt-0.5 text-xl font-semibold tabular-nums text-slate-950">{stats.accuracy}%</dd></div>
        </div>
        <div className="flex items-center gap-3 px-4 py-5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-800"><Clock3 className="h-4 w-4" aria-hidden="true" /></span>
          <div><dt className="text-xs font-medium text-slate-500">Test time</dt><dd className="mt-0.5 text-xl font-semibold tabular-nums text-slate-950">{stats.minutes}m</dd></div>
        </div>
      </dl>

      <section aria-labelledby="recent-attempts-heading">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 id="recent-attempts-heading" className="text-2xl font-semibold tracking-tight text-slate-950">Recent attempts</h2>
            <p className="mt-1 text-sm text-slate-600">Saved evaluated attempts from your account.</p>
          </div>
          <span className="text-sm font-medium text-slate-500">{attempts.length} saved</span>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {attemptsQuery.isLoading ? (
            <div className="p-8 text-sm text-slate-600">Loading attempt history…</div>
          ) : attemptsQuery.error ? (
            <div className="m-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
              Attempt history could not be loaded. Your live tests remain available.
            </div>
          ) : attempts.length === 0 ? (
            <div className="flex flex-col items-start p-6 sm:p-8">
              <BookOpen className="h-7 w-7 text-slate-400" aria-hidden="true" />
              <p className="mt-3 font-semibold text-slate-950">No completed attempts yet</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">Take a published test to create your first saved result.</p>
              <Button asChild variant="outline" className="mt-4 min-h-11 border-slate-300"><Link href="/tests">Start a test</Link></Button>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {attempts.slice(0, 10).map((attempt) => (
                <div key={attempt.id} className="grid gap-3 px-4 py-4 sm:grid-cols-[1fr_auto] sm:items-center sm:px-5">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-semibold text-slate-950">{attempt.testName}</p>
                      <Badge variant="outline" className={scoreClass(attempt.score)}>{attempt.score}%</Badge>
                    </div>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {attempt.category} · {formatDate(attempt.createdAt)} · {attempt.correct} correct · {attempt.wrong} wrong
                    </p>
                  </div>
                  <ResultLink attempt={attempt} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="flex flex-col justify-between gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center">
        <div>
          <p className="font-semibold text-slate-950">{testsQuery.data?.length ?? 0} published tests available</p>
          <p className="mt-1 text-sm text-slate-600">Choose from the current catalog when you are ready for the next attempt.</p>
        </div>
        <Button asChild variant="outline" className="min-h-11 shrink-0 border-slate-300 bg-white">
          <Link href="/tests">Open test explorer <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link>
        </Button>
      </section>
    </div>
  );
}
