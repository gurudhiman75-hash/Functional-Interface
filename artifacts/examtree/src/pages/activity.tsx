import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BarChart3, BookOpen, CheckCircle2, Clock3, History, Target } from "lucide-react";
import { Link } from "wouter";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  if (score >= 75) return "bg-emerald-100 text-emerald-700";
  if (score >= 50) return "bg-amber-100 text-amber-700";
  return "bg-rose-100 text-rose-700";
}

function ResultLink({ attempt }: { attempt: TestAttempt }) {
  const params = new URLSearchParams({ attemptId: attempt.id, testId: attempt.testId });
  return (
    <Button asChild variant="ghost" size="sm" className="rounded-xl">
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
        <div key={index} className="flex items-center justify-between gap-4 border-b border-border/70 py-4 last:border-b-0">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="skeleton-shimmer h-4 w-[min(18rem,72%)] rounded-lg" />
            <div className="skeleton-shimmer h-3 w-[min(26rem,88%)] rounded-lg" />
          </div>
          <div className="skeleton-shimmer h-8 w-24 shrink-0 rounded-xl" />
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

  if (!user) {
    return (
      <Card className="et-panel-raised mx-auto w-full max-w-xl rounded-2xl">
        <CardContent className="flex min-h-80 flex-col items-center justify-center p-8 text-center sm:p-10">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <History className="h-7 w-7" aria-hidden="true" />
          </span>
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-foreground">Your activity follows you across devices</h1>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Sign in to load canonical attempt history, scores, accuracy, and saved results.
          </p>
          <Button asChild className="mt-6 rounded-xl px-5">
            <Link href="/login/student?next=%2Fdashboard">Sign in</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Canonical activity</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Welcome back, {user.name}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Your saved scores and attempt history are loaded from ExamTree&apos;s canonical database.
          </p>
        </div>
        <Button asChild className="shrink-0 rounded-xl">
          <Link href="/tests">
            Browse live tests
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Attempt summary">
        <Card className="et-panel rounded-2xl">
          <CardContent className="p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
              <Target className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="mt-5 text-3xl font-bold tabular-nums tracking-tight text-foreground">{stats.count}</p>
            <p className="mt-1 text-sm text-muted-foreground">Real attempts</p>
          </CardContent>
        </Card>
        <Card className="et-panel rounded-2xl">
          <CardContent className="p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
              <BarChart3 className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="mt-5 text-3xl font-bold tabular-nums tracking-tight text-foreground">{stats.averageScore}%</p>
            <p className="mt-1 text-sm text-muted-foreground">Average score</p>
          </CardContent>
        </Card>
        <Card className="et-panel rounded-2xl">
          <CardContent className="p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="mt-5 text-3xl font-bold tabular-nums tracking-tight text-foreground">{stats.accuracy}%</p>
            <p className="mt-1 text-sm text-muted-foreground">Overall accuracy</p>
          </CardContent>
        </Card>
        <Card className="et-panel rounded-2xl">
          <CardContent className="p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
              <Clock3 className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="mt-5 text-3xl font-bold tabular-nums tracking-tight text-foreground">{stats.minutes}m</p>
            <p className="mt-1 text-sm text-muted-foreground">Test time</p>
          </CardContent>
        </Card>
      </section>

      <Card className="et-panel-raised overflow-hidden rounded-2xl">
        <CardHeader className="flex flex-row items-start justify-between gap-3 border-b border-border/70 bg-muted/20">
          <div className="min-w-0">
            <CardTitle className="text-xl">Recent attempts</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">Saved evaluated attempts from the server.</p>
          </div>
          <Badge variant="outline" className="shrink-0 rounded-lg bg-background/80">{attempts.length} saved</Badge>
        </CardHeader>
        <CardContent className="p-5 sm:p-6">
          {attemptsQuery.isLoading ? (
            <AttemptHistorySkeleton />
          ) : attemptsQuery.error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-700">
              Attempt history could not be loaded. Your live tests remain available.
            </div>
          ) : attempts.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-center sm:py-12">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <BookOpen className="h-6 w-6" aria-hidden="true" />
              </span>
              <p className="mt-4 font-semibold text-foreground">No completed attempts yet</p>
              <p className="mt-1 text-sm text-muted-foreground">Take a published test to create your first saved result.</p>
              <Button asChild className="mt-5 rounded-xl"><Link href="/tests">Start a test</Link></Button>
            </div>
          ) : (
            <div className="divide-y divide-border/70">
              {attempts.slice(0, 10).map((attempt) => (
                <div key={attempt.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-foreground">{attempt.testName}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {attempt.category} · {formatDate(attempt.createdAt)} · {attempt.correct} correct, {attempt.wrong} wrong
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge className={`${scoreClass(attempt.score)} rounded-lg tabular-nums`}>{attempt.score}%</Badge>
                    <ResultLink attempt={attempt} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="et-panel rounded-2xl border-dashed">
        <CardContent className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
          <div>
            <p className="font-semibold text-foreground">{testsQuery.data?.length ?? 0} published tests available</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">Browse the current published catalog and continue from your saved attempt history.</p>
          </div>
          <Button asChild variant="outline" className="shrink-0 rounded-xl"><Link href="/tests">Open test explorer</Link></Button>
        </CardContent>
      </Card>
    </div>
  );
}
