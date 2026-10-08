import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight, BarChart3, CheckCircle2, Clock3, FileText, RefreshCw, Target } from "lucide-react";

import { getUserAttempts } from "@/lib/data";
import { getUser } from "@/lib/storage";

function formatDate(value: string | Date) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : new Intl.DateTimeFormat("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  }).format(date);
}

export default function PerformanceOverview() {
  const user = getUser();
  const attemptsQuery = useQuery({
    queryKey: ["canonical-attempt-history", user?.id],
    queryFn: () => getUserAttempts(user?.id),
    enabled: Boolean(user),
    staleTime: 30_000,
    retry: false,
  });
  const attempts = useMemo(() => (attemptsQuery.data ?? [])
    .filter((attempt) => !attempt.attemptType || attempt.attemptType === "REAL")
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()), [attemptsQuery.data]);
  const statistics = useMemo(() => {
    const questions = attempts.reduce((total, attempt) => total + attempt.totalQuestions, 0);
    const correct = attempts.reduce((total, attempt) => total + attempt.correct, 0);
    const seconds = attempts.reduce((total, attempt) => total + Math.max(0, attempt.timeSpent ?? 0), 0);
    return {
      count: attempts.length,
      averageScore: attempts.length ? Math.round(attempts.reduce((total, attempt) => total + attempt.score, 0) / attempts.length) : null,
      accuracy: questions ? Math.round(correct / questions * 100) : null,
      recordedMinutes: Math.round(seconds / 60),
    };
  }, [attempts]);
  const recent = attempts.slice(0, 8).reverse();

  return (
    <main className="mx-auto w-full max-w-6xl space-y-7 px-4 py-8 sm:px-6" id="main-content" data-testid="canonical-performance">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">Your saved attempts</span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">Performance overview</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Scores and accuracy below are calculated from your saved test attempts. Rankings, predicted cutoffs and percentile estimates are not shown without verified data.</p>
        </div>
        <Link href="/dashboard" className="inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 text-sm font-semibold">My activity <ArrowRight size={16} /></Link>
      </header>

      {attemptsQuery.isLoading ? <div role="status" className="rounded-2xl border bg-card p-8 text-muted-foreground">Loading saved performance…</div>
        : attemptsQuery.isError ? (
          <div role="alert" className="rounded-2xl border bg-card p-8">
            <h2 className="font-semibold">Your performance is temporarily unavailable</h2>
            <p className="mt-2 text-sm text-muted-foreground">We could not load confirmed attempts. Nothing has been estimated from local data.</p>
            <button type="button" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground" onClick={() => void attemptsQuery.refetch()}><RefreshCw size={16} /> Try again</button>
          </div>
        ) : attempts.length === 0 ? (
          <div className="rounded-2xl border bg-card p-8 text-center">
            <BarChart3 className="mx-auto mb-3 text-primary" size={36} />
            <h2 className="text-xl font-bold">Your results will appear here</h2>
            <p className="mt-2 text-sm text-muted-foreground">Complete a published test to start building your performance history.</p>
            <Link href="/mock-tests" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground">Explore tests <ArrowRight size={16} /></Link>
          </div>
        ) : (
          <>
            <section className="grid grid-cols-2 gap-3 md:grid-cols-4" aria-label="Confirmed attempt statistics">
              {[
                { name: "Tests completed", value: String(statistics.count), icon: FileText },
                { name: "Average score", value: statistics.averageScore === null ? "—" : `${statistics.averageScore}%`, icon: BarChart3 },
                { name: "Answer accuracy", value: statistics.accuracy === null ? "—" : `${statistics.accuracy}%`, icon: CheckCircle2 },
                { name: "Recorded test time", value: `${statistics.recordedMinutes} min`, icon: Clock3 },
              ].map(({ name, value, icon: Icon }) => <article key={name} className="rounded-2xl border bg-card p-5 shadow-sm">
                <Icon className="mb-3 text-indigo-600" size={20} aria-hidden="true" />
                <p className="text-2xl font-bold tabular-nums">{value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{name}</p>
              </article>)}
            </section>
            <section className="rounded-2xl border bg-card p-5 sm:p-6" aria-labelledby="performance-trend">
              <h2 id="performance-trend" className="text-lg font-bold">Recent score trend</h2>
              <p className="mt-1 text-xs text-muted-foreground">Up to eight most recent completed attempts, oldest to newest. Each bar shows the recorded score.</p>
              <div className="mt-6 flex h-44 items-end gap-3" role="img" aria-label={`Recent attempt scores in chronological order: ${recent.map(a => a.score + "%").join(", ")}`}>
                {recent.map((attempt) => <div key={attempt.id} className="flex h-full min-w-0 flex-1 flex-col justify-end gap-1">
                  <span className="text-center text-[11px] font-semibold tabular-nums">{Math.round(attempt.score)}%</span>
                  <div className="min-h-1 rounded-t-lg bg-indigo-600" style={{ height: `${Math.max(2, Math.min(100, attempt.score))}%` }} />
                </div>)}
              </div>
            </section>
            <section className="rounded-2xl border bg-card p-5 sm:p-6" aria-labelledby="recent-performance">
              <h2 id="recent-performance" className="text-lg font-bold">Review your attempts</h2>
              <div className="mt-4 divide-y">
                {attempts.slice(0, 15).map((attempt) => <article key={attempt.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <div className="min-w-0"><h3 className="font-semibold">{attempt.testName || "Test attempt"}</h3><p className="mt-1 text-xs text-muted-foreground">{formatDate(attempt.createdAt)} · Score: {Math.round(attempt.score)}% · {attempt.correct}/{attempt.totalQuestions} correct</p></div>
                  <Link href={`/result?attemptId=${encodeURIComponent(attempt.id)}`} className="inline-flex min-h-11 items-center gap-2 rounded-xl border px-3 text-sm font-semibold">Review result <ArrowRight size={15} /></Link>
                </article>)}
              </div>
            </section>
            <p className="inline-flex items-center gap-2 text-xs text-muted-foreground"><Target size={15} /> For detailed explanations, open a saved attempt above.</p>
          </>
        )}
    </main>
  );
}
