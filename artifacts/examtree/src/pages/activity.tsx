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
    <Button asChild variant="ghost" size="sm">
      <Link href={`/result?${params.toString()}`}>View result <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
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

  if (!user) {
    return (
      <Card className="mx-auto max-w-xl">
        <CardContent className="flex min-h-80 flex-col items-center justify-center p-8 text-center">
          <History className="h-10 w-10 text-indigo-600" />
          <h1 className="mt-4 text-2xl font-bold">Your activity follows you across devices</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Sign in to load canonical attempt history, scores, accuracy, and saved results.</p>
          <Button asChild className="mt-5"><Link href="/login/student?next=%2Fdashboard">Sign in</Link></Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">Canonical activity</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950">Welcome back, {user.name}</h1>
          <p className="mt-2 text-sm text-slate-600">Attempt history below is loaded from ExamTree's canonical database.</p>
        </div>
        <Button asChild><Link href="/tests">Browse live tests <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card><CardContent className="p-5"><Target className="h-5 w-5 text-indigo-600" /><p className="mt-4 text-2xl font-bold">{stats.count}</p><p className="text-sm text-muted-foreground">Real attempts</p></CardContent></Card>
        <Card><CardContent className="p-5"><BarChart3 className="h-5 w-5 text-indigo-600" /><p className="mt-4 text-2xl font-bold">{stats.averageScore}%</p><p className="text-sm text-muted-foreground">Average score</p></CardContent></Card>
        <Card><CardContent className="p-5"><CheckCircle2 className="h-5 w-5 text-emerald-600" /><p className="mt-4 text-2xl font-bold">{stats.accuracy}%</p><p className="text-sm text-muted-foreground">Overall accuracy</p></CardContent></Card>
        <Card><CardContent className="p-5"><Clock3 className="h-5 w-5 text-amber-600" /><p className="mt-4 text-2xl font-bold">{stats.minutes}m</p><p className="text-sm text-muted-foreground">Test time</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div><CardTitle>Recent attempts</CardTitle><p className="mt-1 text-sm text-muted-foreground">Saved evaluated attempts from the server.</p></div>
          <Badge variant="outline">{attempts.length} saved</Badge>
        </CardHeader>
        <CardContent>
          {attemptsQuery.isLoading ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Loading attempt history…</div>
          ) : attemptsQuery.error ? (
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">Attempt history could not be loaded. Your live tests remain available.</div>
          ) : attempts.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center"><BookOpen className="h-9 w-9 text-slate-400" /><p className="mt-3 font-medium">No completed attempts yet</p><p className="mt-1 text-sm text-muted-foreground">Take a published test to create your first saved result.</p><Button asChild className="mt-4"><Link href="/tests">Start a test</Link></Button></div>
          ) : (
            <div className="divide-y">
              {attempts.slice(0, 10).map((attempt) => (
                <div key={attempt.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-950">{attempt.testName}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{attempt.category} · {formatDate(attempt.createdAt)} · {attempt.correct} correct, {attempt.wrong} wrong</p>
                  </div>
                  <div className="flex items-center gap-2"><Badge className={scoreClass(attempt.score)}>{attempt.score}%</Badge><ResultLink attempt={attempt} /></div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-dashed"><CardContent className="flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center"><div><p className="font-semibold">{testsQuery.data?.length ?? 0} published tests available</p><p className="text-sm text-muted-foreground">Browse the current published catalog and continue from your saved attempt history.</p></div><Button asChild variant="outline"><Link href="/tests">Open test explorer</Link></Button></CardContent></Card>
    </div>
  );
}
