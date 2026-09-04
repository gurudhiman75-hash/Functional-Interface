import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BarChart3,
  Bookmark,
  CheckCircle2,
  Clock3,
  FileQuestion,
  History,
  Lightbulb,
  ListChecks,
  Target,
  TrendingDown,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { Link } from "wouter";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getTests, getUserAttempts, type TestAttempt } from "@/lib/data";
import { getUser } from "@/lib/storage";

type SectionRollup = {
  name: string;
  correct: number;
  wrong: number;
  unanswered: number;
  attempts: number;
  accuracy: number;
};

type CategoryRollup = {
  name: string;
  attempts: number;
  averageScore: number;
  accuracy: number;
};

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, Math.round(Number.isFinite(value) ? value : 0)));
}

function attemptAccuracy(attempt: TestAttempt) {
  const answered = attempt.correct + attempt.wrong;
  return answered > 0 ? clampPercent((attempt.correct / answered) * 100) : 0;
}

function formatDate(value: string | Date) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

function formatDurationFromSeconds(seconds: number) {
  const safe = Math.max(0, Math.round(Number(seconds) || 0));
  const minutes = Math.round(safe / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder ? `${hours}h ${remainder}m` : `${hours}h`;
}

function resultHref(attempt: TestAttempt) {
  return `/result?${new URLSearchParams({ attemptId: attempt.id, testId: attempt.testId }).toString()}`;
}

function MetricCard({ icon: Icon, label, value, helper }: { icon: typeof Target; label: string; value: string; helper: string }) {
  return (
    <div className="rounded-2xl border border-[#e7e4f2] bg-white p-4 shadow-[0_8px_24px_rgba(37,42,68,0.03)] dark:border-border dark:bg-card sm:p-5">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f2efff] text-[#6657e8] dark:bg-violet-950/40 dark:text-violet-300"><Icon className="h-[18px] w-[18px]" /></span>
      <p className="mt-4 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400 dark:text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-black tracking-[-0.035em] text-slate-950 dark:text-foreground">{value}</p>
      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-muted-foreground">{helper}</p>
    </div>
  );
}

function TrendChart({ attempts }: { attempts: TestAttempt[] }) {
  if (attempts.length < 2) {
    return <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-8 text-center text-sm text-slate-500 dark:border-border dark:bg-muted/30 dark:text-muted-foreground">Complete at least two tests to see a performance trend.</div>;
  }

  const width = 720;
  const height = 220;
  const padX = 30;
  const padY = 24;
  const usableW = width - padX * 2;
  const usableH = height - padY * 2;
  const xFor = (index: number) => padX + (index / (attempts.length - 1)) * usableW;
  const yFor = (value: number) => padY + usableH - (clampPercent(value) / 100) * usableH;
  const scorePoints = attempts.map((attempt, index) => `${xFor(index)},${yFor(attempt.score)}`).join(" ");
  const accuracyPoints = attempts.map((attempt, index) => `${xFor(index)},${yFor(attemptAccuracy(attempt))}`).join(" ");

  return (
    <div className="overflow-x-auto" data-testid="performance-trend-chart">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-[220px] min-w-[620px] w-full" role="img" aria-label="Recent score and accuracy trend">
        {[0, 25, 50, 75, 100].map((value) => (
          <g key={value}>
            <line x1={padX} x2={width - padX} y1={yFor(value)} y2={yFor(value)} stroke="currentColor" className="text-slate-100 dark:text-border" strokeWidth="1" />
            <text x="2" y={yFor(value) + 4} fontSize="10" fill="currentColor" className="text-slate-400 dark:text-muted-foreground">{value}</text>
          </g>
        ))}
        <polyline points={scorePoints} fill="none" stroke="#6657e8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points={accuracyPoints} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="7 6" />
        {attempts.map((attempt, index) => (
          <g key={attempt.id}>
            <circle cx={xFor(index)} cy={yFor(attempt.score)} r="5" fill="#6657e8" />
            <circle cx={xFor(index)} cy={yFor(attemptAccuracy(attempt))} r="4" fill="#10b981" />
          </g>
        ))}
      </svg>
      <div className="mt-2 flex flex-wrap gap-4 text-xs font-semibold text-slate-500 dark:text-muted-foreground">
        <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#6657e8]" />Score</span>
        <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />Accuracy</span>
      </div>
      <div className="sr-only">{attempts.map((attempt) => `${attempt.testName}: score ${attempt.score}%, accuracy ${attemptAccuracy(attempt)}%. `)}</div>
    </div>
  );
}

export default function PerformancePage() {
  const user = getUser();
  const attemptsQuery = useQuery({
    queryKey: ["canonical-performance-attempts", user?.id],
    queryFn: () => getUserAttempts(user?.id),
    enabled: Boolean(user),
    retry: false,
    staleTime: 30_000,
  });
  const testsQuery = useQuery({ queryKey: ["tests"], queryFn: getTests, staleTime: 60_000 });

  const attempts = useMemo(
    () => [...(attemptsQuery.data ?? [])]
      .filter((attempt) => !attempt.attemptType || attempt.attemptType === "REAL")
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
    [attemptsQuery.data],
  );

  const summary = useMemo(() => {
    const totalAnswered = attempts.reduce((sum, attempt) => sum + attempt.correct + attempt.wrong, 0);
    const totalCorrect = attempts.reduce((sum, attempt) => sum + attempt.correct, 0);
    const totalSeconds = attempts.reduce((sum, attempt) => sum + (Number(attempt.timeSpent) || 0), 0);
    const averageScore = attempts.length ? attempts.reduce((sum, attempt) => sum + attempt.score, 0) / attempts.length : 0;
    const bestScore = attempts.length ? Math.max(...attempts.map((attempt) => attempt.score)) : 0;
    const flagged = attempts.reduce((sum, attempt) => sum + (attempt.questionReview ?? []).filter((question) => question.flagged).length, 0);
    return {
      attempts: attempts.length,
      averageScore: clampPercent(averageScore),
      bestScore: clampPercent(bestScore),
      accuracy: totalAnswered > 0 ? clampPercent((totalCorrect / totalAnswered) * 100) : 0,
      totalSeconds,
      flagged,
    };
  }, [attempts]);

  const sections = useMemo<SectionRollup[]>(() => {
    const map = new Map<string, Omit<SectionRollup, "accuracy">>();
    for (const attempt of attempts) {
      for (const section of attempt.sectionStats ?? []) {
        const current = map.get(section.name) ?? { name: section.name, correct: 0, wrong: 0, unanswered: 0, attempts: 0 };
        current.correct += section.correct;
        current.wrong += section.wrong;
        current.unanswered += section.unanswered;
        current.attempts += 1;
        map.set(section.name, current);
      }
    }
    return Array.from(map.values()).map((section) => {
      const answered = section.correct + section.wrong;
      return { ...section, accuracy: answered > 0 ? clampPercent((section.correct / answered) * 100) : 0 };
    }).sort((a, b) => b.accuracy - a.accuracy || b.attempts - a.attempts);
  }, [attempts]);

  const categories = useMemo<CategoryRollup[]>(() => {
    const map = new Map<string, { attempts: number; score: number; correct: number; answered: number }>();
    for (const attempt of attempts) {
      const name = attempt.category || "Other";
      const current = map.get(name) ?? { attempts: 0, score: 0, correct: 0, answered: 0 };
      current.attempts += 1;
      current.score += attempt.score;
      current.correct += attempt.correct;
      current.answered += attempt.correct + attempt.wrong;
      map.set(name, current);
    }
    return Array.from(map.entries()).map(([name, value]) => ({
      name,
      attempts: value.attempts,
      averageScore: clampPercent(value.score / value.attempts),
      accuracy: value.answered > 0 ? clampPercent((value.correct / value.answered) * 100) : 0,
    })).sort((a, b) => b.attempts - a.attempts || b.averageScore - a.averageScore);
  }, [attempts]);

  const improvement = useMemo(() => {
    if (attempts.length < 4) return null;
    const recent = attempts.slice(-Math.min(3, Math.floor(attempts.length / 2)));
    const earlier = attempts.slice(Math.max(0, attempts.length - recent.length * 2), attempts.length - recent.length);
    if (!earlier.length || !recent.length) return null;
    const avg = (items: TestAttempt[]) => items.reduce((sum, item) => sum + item.score, 0) / items.length;
    return { delta: Math.round(avg(recent) - avg(earlier)), recentCount: recent.length, earlierCount: earlier.length };
  }, [attempts]);

  const weakestSection = sections.length > 1 ? [...sections].sort((a, b) => a.accuracy - b.accuracy || b.attempts - a.attempts)[0] : null;
  const strongestSection = sections[0] ?? null;
  const weakestCategory = categories.length > 1 ? [...categories].sort((a, b) => a.averageScore - b.averageScore)[0] : categories[0] ?? null;
  const attemptedIds = useMemo(() => new Set(attempts.map((attempt) => attempt.testId)), [attempts]);
  const suggestedTest = useMemo(() => {
    const tests = testsQuery.data ?? [];
    const matching = weakestCategory ? tests.filter((test) => (test.categoryName ?? test.category) === weakestCategory.name) : [];
    return [...matching, ...tests].find((test, index, list) => !attemptedIds.has(test.id) && list.findIndex((candidate) => candidate.id === test.id) === index) ?? null;
  }, [attemptedIds, testsQuery.data, weakestCategory]);
  const trendAttempts = attempts.slice(-8);
  const latestAttempts = [...attempts].reverse().slice(0, 6);

  if (!user) return null;

  if (attemptsQuery.isLoading) {
    return <div className="mx-auto max-w-7xl space-y-5" role="status" aria-label="Loading performance analytics"><div className="skeleton-shimmer h-64 rounded-3xl" /><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div key={index} className="skeleton-shimmer h-40 rounded-2xl" />)}</div><div className="skeleton-shimmer h-80 rounded-3xl" /></div>;
  }

  if (attemptsQuery.isError) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-rose-200 bg-white p-8 text-center dark:border-rose-900 dark:bg-card">
        <BarChart3 className="mx-auto h-7 w-7 text-rose-500" />
        <h1 className="mt-4 text-xl font-black text-slate-950 dark:text-foreground">Performance data could not be loaded</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-muted-foreground">ExamTree will not substitute cached or estimated performance for your canonical attempt history.</p>
        <Button variant="outline" className="mt-5 min-h-11 rounded-xl" onClick={() => attemptsQuery.refetch()}>Try again</Button>
      </div>
    );
  }

  if (!attempts.length) {
    return (
      <div className="mx-auto max-w-3xl rounded-3xl border border-[#e4e1f3] bg-white p-8 text-center shadow-sm dark:border-border dark:bg-card sm:p-10" data-testid="performance-empty">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f1eeff] text-[#6657e8] dark:bg-violet-950/40 dark:text-violet-300"><BarChart3 className="h-6 w-6" /></span>
        <h1 className="mt-5 text-2xl font-black tracking-[-0.035em] text-slate-950 dark:text-foreground">Your performance story starts with a completed test.</h1>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600 dark:text-muted-foreground">Scores, accuracy, section strengths and trends will be calculated only from your saved real attempts.</p>
        <Button asChild className="mt-6 min-h-11 rounded-xl bg-[#6657e8] px-5 text-white hover:bg-[#594bd9]"><Link href="/exams">Browse tests <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl pb-10" data-testid="performance-page">
      <section className="overflow-hidden rounded-3xl border border-[#e4e0f5] bg-[radial-gradient(circle_at_88%_10%,rgba(102,87,232,0.14),transparent_26rem),linear-gradient(120deg,#ffffff_0%,#f7f5ff_100%)] shadow-[0_14px_42px_rgba(37,42,68,0.045)] dark:border-border dark:bg-none dark:bg-card">
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-center lg:p-10">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6657e8] dark:text-violet-300">Performance analytics</p>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.045em] text-slate-950 dark:text-foreground sm:text-4xl">See what your completed tests are actually telling you.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-muted-foreground">This page uses only your canonical real-attempt history. No rank, percentile, peer average or predicted score is invented.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button asChild className="min-h-11 rounded-xl bg-[#6657e8] px-5 font-bold text-white hover:bg-[#594bd9]"><Link href="/exams">Take another test <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
              <Button asChild variant="outline" className="min-h-11 rounded-xl bg-white dark:bg-card"><Link href="/bookmarks"><Bookmark className="mr-2 h-4 w-4" />Review bookmarks</Link></Button>
            </div>
          </div>
          <div className="rounded-2xl border border-white/90 bg-white/80 p-5 shadow-[0_10px_32px_rgba(70,60,140,0.06)] backdrop-blur dark:border-border dark:bg-muted/30">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400 dark:text-muted-foreground">Current signal</p>
            {improvement ? (
              <div className="mt-3 flex items-start gap-3">
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${improvement.delta >= 0 ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300" : "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300"}`}>{improvement.delta >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}</span>
                <div><p className="text-2xl font-black text-slate-950 dark:text-foreground">{improvement.delta > 0 ? "+" : ""}{improvement.delta} pts</p><p className="mt-1 text-xs leading-5 text-slate-500 dark:text-muted-foreground">Recent {improvement.recentCount}-test average versus the preceding {improvement.earlierCount} attempts.</p></div>
              </div>
            ) : <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-muted-foreground">Complete at least four tests before ExamTree compares your recent performance with your own earlier attempts.</p>}
          </div>
        </div>
      </section>

      <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5" aria-label="Performance summary">
        <MetricCard icon={History} label="Real attempts" value={String(summary.attempts)} helper="Canonical completed tests" />
        <MetricCard icon={BarChart3} label="Average score" value={`${summary.averageScore}%`} helper={`Best ${summary.bestScore}%`} />
        <MetricCard icon={CheckCircle2} label="Answer accuracy" value={`${summary.accuracy}%`} helper="Correct among answered questions" />
        <MetricCard icon={Clock3} label="Test time" value={formatDurationFromSeconds(summary.totalSeconds)} helper="Across completed attempts" />
        <MetricCard icon={Bookmark} label="Marked review" value={String(summary.flagged)} helper="Flagged in saved attempts" />
      </section>

      <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.7fr)]">
        <section className="rounded-3xl border border-[#e5e2f2] bg-white p-5 shadow-[0_8px_28px_rgba(37,42,68,0.035)] dark:border-border dark:bg-card sm:p-6" aria-labelledby="trend-heading">
          <div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#6657e8] dark:text-violet-300">Recent attempts</p><h2 id="trend-heading" className="mt-1 text-xl font-black tracking-[-0.025em] text-slate-950 dark:text-foreground">Score & accuracy trend</h2></div><span className="text-xs font-semibold text-slate-400 dark:text-muted-foreground">Last {trendAttempts.length}</span></div>
          <div className="mt-5"><TrendChart attempts={trendAttempts} /></div>
        </section>

        <section className="rounded-3xl border border-[#e5e2f2] bg-white p-5 shadow-[0_8px_28px_rgba(37,42,68,0.035)] dark:border-border dark:bg-card sm:p-6" aria-labelledby="focus-heading">
          <div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f2efff] text-[#6657e8] dark:bg-violet-950/40 dark:text-violet-300"><Lightbulb className="h-5 w-5" /></span><div><h2 id="focus-heading" className="text-lg font-black text-slate-950 dark:text-foreground">What to focus on</h2><p className="mt-1 text-xs leading-5 text-slate-500 dark:text-muted-foreground">Derived from your own saved attempts.</p></div></div>
          <div className="mt-5 space-y-3">
            {weakestSection ? <div className="rounded-2xl border border-amber-100 bg-amber-50/55 p-4 dark:border-amber-900 dark:bg-amber-950/20"><p className="text-[10px] font-black uppercase tracking-[0.12em] text-amber-700 dark:text-amber-300">Lowest section accuracy</p><p className="mt-1 font-black text-slate-950 dark:text-foreground">{weakestSection.name}</p><p className="mt-1 text-xs text-slate-600 dark:text-muted-foreground">{weakestSection.accuracy}% across {weakestSection.attempts} saved {weakestSection.attempts === 1 ? "attempt" : "attempts"}.</p></div> : null}
            {strongestSection ? <div className="rounded-2xl border border-emerald-100 bg-emerald-50/55 p-4 dark:border-emerald-900 dark:bg-emerald-950/20"><p className="text-[10px] font-black uppercase tracking-[0.12em] text-emerald-700 dark:text-emerald-300">Strongest section</p><p className="mt-1 font-black text-slate-950 dark:text-foreground">{strongestSection.name}</p><p className="mt-1 text-xs text-slate-600 dark:text-muted-foreground">{strongestSection.accuracy}% answer accuracy.</p></div> : null}
            {summary.flagged > 0 ? <Button asChild variant="outline" className="min-h-11 w-full rounded-xl"><Link href="/bookmarks">Review {summary.flagged} marked {summary.flagged === 1 ? "question" : "questions"}<ArrowRight className="ml-2 h-4 w-4" /></Link></Button> : null}
          </div>
        </section>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="rounded-3xl border border-[#e5e2f2] bg-white p-5 dark:border-border dark:bg-card sm:p-6" aria-labelledby="section-heading" data-testid="performance-section-analysis">
          <div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f2efff] text-[#6657e8] dark:bg-violet-950/40 dark:text-violet-300"><ListChecks className="h-5 w-5" /></span><div><h2 id="section-heading" className="text-lg font-black text-slate-950 dark:text-foreground">Section analysis</h2><p className="mt-1 text-xs leading-5 text-slate-500 dark:text-muted-foreground">Weighted from committed section result counts.</p></div></div>
          {sections.length ? <div className="mt-5 space-y-4">{sections.map((section) => <div key={section.name}><div className="flex items-center justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-bold text-slate-900 dark:text-foreground">{section.name}</p><p className="mt-0.5 text-[11px] text-slate-400 dark:text-muted-foreground">{section.correct} correct · {section.wrong} wrong · {section.unanswered} skipped</p></div><span className="shrink-0 text-sm font-black text-[#6657e8] dark:text-violet-300">{section.accuracy}%</span></div><Progress value={section.accuracy} className="mt-2 h-2" /></div>)}</div> : <div className="mt-5 rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500 dark:border-border dark:text-muted-foreground">Section analysis will appear when saved attempts include section statistics.</div>}
        </section>

        <section className="rounded-3xl border border-[#e5e2f2] bg-white p-5 dark:border-border dark:bg-card sm:p-6" aria-labelledby="exam-heading">
          <div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f2efff] text-[#6657e8] dark:bg-violet-950/40 dark:text-violet-300"><Target className="h-5 w-5" /></span><div><h2 id="exam-heading" className="text-lg font-black text-slate-950 dark:text-foreground">Exam-wise performance</h2><p className="mt-1 text-xs leading-5 text-slate-500 dark:text-muted-foreground">Grouped by the category stored with each attempt.</p></div></div>
          <div className="mt-5 space-y-3">{categories.map((category) => <div key={category.name} className="rounded-2xl border border-[#ece9f5] bg-[#fbfaff] p-4 dark:border-border dark:bg-muted/25"><div className="flex items-center justify-between gap-3"><div><p className="text-sm font-black text-slate-950 dark:text-foreground">{category.name}</p><p className="mt-0.5 text-[11px] text-slate-500 dark:text-muted-foreground">{category.attempts} {category.attempts === 1 ? "attempt" : "attempts"} · {category.accuracy}% accuracy</p></div><span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#6657e8] ring-1 ring-[#ded9fa] dark:bg-card dark:ring-border">{category.averageScore}% avg</span></div></div>)}</div>
        </section>
      </div>

      <section className="mt-5 rounded-3xl border border-[#e5e2f2] bg-white p-5 dark:border-border dark:bg-card sm:p-6" aria-labelledby="history-heading">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#6657e8] dark:text-violet-300">Saved results</p><h2 id="history-heading" className="mt-1 text-xl font-black tracking-[-0.025em] text-slate-950 dark:text-foreground">Recent performance history</h2></div><Button asChild variant="outline" className="min-h-11 rounded-xl"><Link href="/dashboard">Open full activity <ArrowRight className="ml-2 h-4 w-4" /></Link></Button></div>
        <div className="mt-5 divide-y divide-slate-100 dark:divide-border">{latestAttempts.map((attempt) => <div key={attempt.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><p className="truncate text-sm font-black text-slate-950 dark:text-foreground">{attempt.testName}</p><p className="mt-1 text-xs text-slate-500 dark:text-muted-foreground">{attempt.category} · {formatDate(attempt.createdAt)} · {attemptAccuracy(attempt)}% accuracy</p></div><div className="flex items-center justify-between gap-3 sm:justify-end"><span className="text-lg font-black text-slate-950 dark:text-foreground">{attempt.score}%</span><Button asChild variant="ghost" className="min-h-11 rounded-xl px-3 text-[#6657e8] hover:bg-[#f5f3ff] hover:text-[#594bd9] dark:text-violet-300 dark:hover:bg-violet-950/30"><Link href={resultHref(attempt)}>View result <ArrowRight className="ml-1.5 h-4 w-4" /></Link></Button></div></div>)}</div>
      </section>

      <section className="mt-5 rounded-3xl border border-[#ded9f6] bg-[#f6f3ff] p-5 dark:border-violet-900 dark:bg-violet-950/20 sm:p-6" aria-labelledby="next-heading">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl"><p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#6657e8] dark:text-violet-300">Suggested next action</p><h2 id="next-heading" className="mt-1 text-xl font-black text-slate-950 dark:text-foreground">{weakestCategory ? `Strengthen ${weakestCategory.name}` : "Keep building your test history"}</h2><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-muted-foreground">{suggestedTest ? `A not-yet-attempted test is available in the current catalog: ${suggestedTest.name}.` : weakestSection ? `Use your next practice session to revisit ${weakestSection.name}, currently your lowest measured section by answer accuracy.` : "Choose another published test to add more evidence to your performance profile."}</p></div>
          <div className="flex flex-col gap-2 sm:flex-row lg:shrink-0"><Button asChild className="min-h-11 rounded-xl bg-[#6657e8] px-5 font-bold text-white hover:bg-[#594bd9]"><Link href="/exams">Browse next tests <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>{summary.flagged > 0 ? <Button asChild variant="outline" className="min-h-11 rounded-xl bg-white dark:bg-card"><Link href="/bookmarks"><Bookmark className="mr-2 h-4 w-4" />Review weak questions</Link></Button> : null}</div>
        </div>
      </section>

      <div className="mt-4 grid gap-3 sm:grid-cols-3" aria-label="Analytics boundaries">
        <div className="rounded-2xl border border-[#e8e5f1] bg-white p-4 dark:border-border dark:bg-card"><CheckCircle2 className="h-4 w-4 text-emerald-600" /><p className="mt-2 text-xs font-black text-slate-900 dark:text-foreground">Canonical attempts only</p></div>
        <div className="rounded-2xl border border-[#e8e5f1] bg-white p-4 dark:border-border dark:bg-card"><XCircle className="h-4 w-4 text-rose-600" /><p className="mt-2 text-xs font-black text-slate-900 dark:text-foreground">No fabricated rank or percentile</p></div>
        <div className="rounded-2xl border border-[#e8e5f1] bg-white p-4 dark:border-border dark:bg-card"><FileQuestion className="h-4 w-4 text-[#6657e8]" /><p className="mt-2 text-xs font-black text-slate-900 dark:text-foreground">Missing section data stays missing</p></div>
      </div>
    </div>
  );
}
