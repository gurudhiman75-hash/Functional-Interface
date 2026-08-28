import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Award,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock3,
  FileQuestion,
  Flag,
  ListChecks,
  RotateCcw,
  Target,
  Timer,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { QuestionRichText } from "@/components/QuestionRichText";
import { getAttemptById } from "@/lib/data";
import type { TestAttempt } from "@/lib/storage";

type ReviewFilter = "all" | "wrong" | "flagged" | "unanswered";
type CanonicalResult = TestAttempt & {
  attemptNumber?: number;
  submittedAt?: string;
  createdAt?: string;
  seriesId?: string | null;
};

function formatDuration(minutes: number): string {
  const safe = Math.max(0, Math.round(minutes));
  if (safe < 60) return `${safe} min`;
  const hours = Math.floor(safe / 60);
  const remaining = safe % 60;
  return remaining ? `${hours} hr ${remaining} min` : `${hours} hr`;
}

function formatSubmittedAt(value: string | undefined): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsed);
}

function reviewState(item: NonNullable<TestAttempt["questionReview"]>[number]) {
  if (item.selected == null) return "unanswered";
  return item.selected === item.correct ? "correct" : "wrong";
}

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export default function CanonicalResult() {
  const [, setLocation] = useLocation();
  const params = typeof window === "undefined" ? null : new URLSearchParams(window.location.search);
  const attemptId = params?.get("attemptId") ?? null;
  const requestedTestId = params?.get("testId") ?? null;
  const [filter, setFilter] = useState<ReviewFilter>("all");

  const resultQuery = useQuery({
    queryKey: ["canonical-attempt-result", attemptId],
    queryFn: () => getAttemptById(attemptId!),
    enabled: Boolean(attemptId),
    staleTime: Infinity,
    retry: false,
  });

  const result = resultQuery.data as CanonicalResult | undefined;
  const review = result?.questionReview ?? [];
  const counts = useMemo(() => ({
    all: review.length,
    wrong: review.filter((item) => reviewState(item) === "wrong").length,
    flagged: review.filter((item) => item.flagged).length,
    unanswered: review.filter((item) => reviewState(item) === "unanswered").length,
  }), [review]);
  const filteredReview = useMemo(() => review.filter((item) => {
    if (filter === "all") return true;
    if (filter === "flagged") return item.flagged;
    return reviewState(item) === filter;
  }), [filter, review]);

  if (!attemptId) {
    return (
      <div className="min-h-[70vh] bg-[#f7f8fc] px-4 py-12">
        <div className="mx-auto flex min-h-[58vh] max-w-xl items-center">
          <div className="w-full rounded-3xl border border-amber-200 bg-white p-8 text-center shadow-[0_16px_44px_rgba(37,42,68,0.05)]">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600"><Clock3 className="h-7 w-7" /></span>
            <h1 className="mt-5 text-xl font-bold tracking-tight text-slate-950">Submission is not confirmed yet</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              ExamTree only shows a score after the server has committed your attempt. If your connection dropped during submission, your saved attempt remains recoverable and no earlier or local score is presented as this attempt&apos;s official result.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              {requestedTestId && (
                <Button className="min-h-11 rounded-xl bg-[#6657e8] hover:bg-[#594bd9]" onClick={() => setLocation(`/test/${encodeURIComponent(requestedTestId)}`)}>
                  Return to saved test
                </Button>
              )}
              <Button className="min-h-11 rounded-xl" variant="outline" onClick={() => setLocation("/dashboard")}>Open My Activity</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (resultQuery.isLoading) {
    return (
      <div className="min-h-[70vh] bg-[#f7f8fc] px-4 py-8">
        <div className="mx-auto max-w-6xl space-y-5">
          <div className="skeleton-shimmer h-72 rounded-3xl" />
          <div className="grid gap-4 md:grid-cols-2"><div className="skeleton-shimmer h-48 rounded-3xl" /><div className="skeleton-shimmer h-48 rounded-3xl" /></div>
          <div className="skeleton-shimmer h-72 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!result || resultQuery.isError) {
    return (
      <div className="min-h-[70vh] bg-[#f7f8fc] px-4 py-12">
        <div className="mx-auto flex min-h-[58vh] max-w-xl items-center">
          <div className="w-full rounded-3xl border border-[#e5e2f4] bg-white p-8 text-center shadow-[0_16px_44px_rgba(37,42,68,0.05)]">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f3f0ff] text-[#6657e8]"><FileQuestion className="h-7 w-7" /></span>
            <h1 className="mt-5 text-xl font-bold tracking-tight text-slate-950">Result is not available</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              The attempt may still be syncing, or this link does not belong to your account.
            </p>
            <Button className="mt-6 min-h-11 rounded-xl bg-[#6657e8] hover:bg-[#594bd9]" onClick={() => setLocation("/dashboard")}>Open My Activity</Button>
          </div>
        </div>
      </div>
    );
  }

  const accuracy = result.correct + result.wrong > 0
    ? Math.round((result.correct / (result.correct + result.wrong)) * 100)
    : 0;
  const boundedScore = clampPercent(result.score);
  const totalQuestions = Math.max(0, result.totalQuestions || result.correct + result.wrong + result.unanswered);
  const correctShare = totalQuestions > 0 ? (result.correct / totalQuestions) * 100 : 0;
  const wrongShare = totalQuestions > 0 ? (result.wrong / totalQuestions) * 100 : 0;
  const unansweredShare = totalQuestions > 0 ? (result.unanswered / totalQuestions) * 100 : 0;
  const submittedAt = formatSubmittedAt(result.submittedAt ?? result.createdAt);
  const seriesUrl = result.seriesId ? `/test-series/${encodeURIComponent(result.seriesId)}` : null;
  const retryUrl = `/test/${encodeURIComponent(result.testId)}${result.seriesId ? `?seriesId=${encodeURIComponent(result.seriesId)}` : ""}`;
  const sections = result.sectionStats ?? [];
  const strongestSection = sections.length > 0
    ? [...sections].sort((left, right) => right.accuracy - left.accuracy)[0]
    : null;
  const focusSection = sections.length > 1
    ? [...sections].sort((left, right) => left.accuracy - right.accuracy)[0]
    : null;

  return (
    <div className="min-w-0 bg-[#f7f8fc] py-5 sm:py-7">
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => setLocation(seriesUrl ?? "/dashboard")}
          className="et-interactive inline-flex min-h-11 items-center gap-2 rounded-xl px-1 text-sm font-semibold text-foreground/90 transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {seriesUrl ? "Back to Test Series" : "Back to My Activity"}
        </button>

        <section className="overflow-hidden rounded-3xl border border-[#e3dff5] bg-[radial-gradient(circle_at_90%_8%,rgba(108,92,241,0.14),transparent_25rem),linear-gradient(120deg,#ffffff_0%,#f8f6ff_100%)] shadow-[0_16px_44px_rgba(37,42,68,0.05)]" data-testid="result-summary">
          <div className="grid gap-7 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_310px] lg:items-center lg:p-8">
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6657e8]">Canonical saved result</p>
              <h1 className="mt-2 text-2xl font-bold tracking-[-0.035em] text-slate-950 sm:text-3xl">{result.testName}</h1>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-bold text-slate-600">
                <span className="rounded-full border border-[#e2def5] bg-white/85 px-3 py-1.5">{result.category}</span>
                {result.attemptNumber != null && <span className="rounded-full border border-[#e2def5] bg-white/85 px-3 py-1.5">Attempt {result.attemptNumber}</span>}
                {submittedAt && <span className="rounded-full border border-[#e2def5] bg-white/85 px-3 py-1.5">Submitted {submittedAt}</span>}
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4"><div className="flex items-center gap-2 text-xs font-bold text-emerald-700"><CheckCircle2 className="h-4 w-4" />Correct</div><p className="mt-2 text-2xl font-black tracking-tight text-slate-950">{result.correct}</p></div>
                <div className="rounded-2xl border border-rose-100 bg-rose-50/70 p-4"><div className="flex items-center gap-2 text-xs font-bold text-rose-700"><XCircle className="h-4 w-4" />Wrong</div><p className="mt-2 text-2xl font-black tracking-tight text-slate-950">{result.wrong}</p></div>
                <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4"><div className="flex items-center gap-2 text-xs font-bold text-amber-700"><FileQuestion className="h-4 w-4" />Unanswered</div><p className="mt-2 text-2xl font-black tracking-tight text-slate-950">{result.unanswered}</p></div>
                <div className="rounded-2xl border border-[#e6e1f8] bg-white/75 p-4"><div className="flex items-center gap-2 text-xs font-bold text-slate-600"><Timer className="h-4 w-4 text-[#6657e8]" />Time spent</div><p className="mt-2 text-2xl font-black tracking-tight text-slate-950">{formatDuration(result.timeSpent)}</p></div>
              </div>
            </div>

            <div className="rounded-3xl border border-white bg-white/90 p-5 shadow-[0_12px_36px_rgba(71,61,145,0.08)]">
              <div className="mx-auto flex h-44 w-44 items-center justify-center rounded-full p-[12px]" style={{ background: `conic-gradient(#6657e8 ${boundedScore * 3.6}deg,#ece9fb 0deg)` }}>
                <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-white text-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Score</span>
                  <span className="mt-1 text-4xl font-black tracking-[-0.04em] text-slate-950">{result.score}%</span>
                  {result.actualScore != null && <span className="mt-1 text-xs font-bold text-slate-500">{result.actualScore} marks</span>}
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between text-xs"><span className="font-semibold text-slate-500">Accuracy</span><strong className="text-slate-950">{accuracy}%</strong></div>
              <Progress value={accuracy} className="mt-2 h-2" />
              <div className="mt-5 grid gap-2">
                {seriesUrl && <Button className="min-h-11 rounded-xl bg-[#6657e8] hover:bg-[#594bd9]" onClick={() => setLocation(seriesUrl)}><Target className="mr-2 h-4 w-4" />Continue Test Series</Button>}
                <Button className="min-h-11 rounded-xl border-[#dcd8ec] bg-white text-slate-700 hover:bg-[#f7f5ff]" variant="outline" onClick={() => setLocation(retryUrl)}><RotateCcw className="mr-2 h-4 w-4" />Retake test</Button>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]" aria-label="Attempt analysis">
          <div className="rounded-3xl border border-[#e5e2f4] bg-white p-5 shadow-[0_10px_34px_rgba(37,42,68,0.04)] sm:p-6">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f2efff] text-[#6657e8]"><BarChart3 className="h-5 w-5" /></span>
              <div><h2 className="text-lg font-bold tracking-tight text-slate-950">Answer distribution</h2><p className="mt-1 text-sm text-slate-500">A simple view of how this saved attempt was answered.</p></div>
            </div>
            <div className="mt-6 flex h-3 overflow-hidden rounded-full bg-slate-100" aria-label="Answer distribution bar">
              {correctShare > 0 && <div className="bg-emerald-500" style={{ width: `${correctShare}%` }} />}
              {wrongShare > 0 && <div className="bg-rose-500" style={{ width: `${wrongShare}%` }} />}
              {unansweredShare > 0 && <div className="bg-amber-400" style={{ width: `${unansweredShare}%` }} />}
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <div><p className="text-xs font-bold text-emerald-700">Correct</p><p className="mt-1 text-lg font-black text-slate-950">{totalQuestions > 0 ? Math.round(correctShare) : 0}%</p></div>
              <div><p className="text-xs font-bold text-rose-700">Wrong</p><p className="mt-1 text-lg font-black text-slate-950">{totalQuestions > 0 ? Math.round(wrongShare) : 0}%</p></div>
              <div><p className="text-xs font-bold text-amber-700">Unanswered</p><p className="mt-1 text-lg font-black text-slate-950">{totalQuestions > 0 ? Math.round(unansweredShare) : 0}%</p></div>
            </div>
          </div>

          <div className="rounded-3xl border border-[#e5e2f4] bg-white p-5 shadow-[0_10px_34px_rgba(37,42,68,0.04)] sm:p-6">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f2efff] text-[#6657e8]"><Award className="h-5 w-5" /></span>
              <div><h2 className="text-lg font-bold tracking-tight text-slate-950">Performance insights</h2><p className="mt-1 text-sm text-slate-500">Derived only from your section results in this attempt.</p></div>
            </div>
            {strongestSection ? (
              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4"><p className="text-[10px] font-black uppercase tracking-[0.14em] text-emerald-700">Strongest section</p><div className="mt-1 flex items-end justify-between gap-3"><strong className="text-sm text-slate-950">{strongestSection.name}</strong><span className="text-xl font-black text-emerald-700">{strongestSection.accuracy}%</span></div></div>
                {focusSection && focusSection.name !== strongestSection.name && <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4"><p className="text-[10px] font-black uppercase tracking-[0.14em] text-amber-700">Focus next</p><div className="mt-1 flex items-end justify-between gap-3"><strong className="text-sm text-slate-950">{focusSection.name}</strong><span className="text-xl font-black text-amber-700">{focusSection.accuracy}%</span></div></div>}
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-5 text-sm leading-6 text-slate-500">Section-level insights will appear when the saved attempt contains section statistics.</div>
            )}
          </div>
        </section>

        {sections.length > 0 && (
          <section className="rounded-3xl border border-[#e5e2f4] bg-white p-5 shadow-[0_10px_34px_rgba(37,42,68,0.04)] sm:p-6" data-testid="section-performance">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f2efff] text-[#6657e8]"><ListChecks className="h-5 w-5" /></span>
              <div><h2 className="text-lg font-bold tracking-tight text-slate-950">Section performance</h2><p className="mt-1 text-sm text-slate-500">Accuracy and answer mix from the committed attempt.</p></div>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {sections.map((section) => (
                <div key={section.name} className="rounded-2xl border border-[#ece9f5] bg-[#fbfaff] p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-3"><strong className="truncate text-sm text-slate-950">{section.name}</strong><span className="rounded-full border border-[#ded9fa] bg-white px-2.5 py-1 text-xs font-black text-[#6657e8]">{section.accuracy}%</span></div>
                  <Progress value={section.accuracy} className="mt-4 h-2" />
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-xl border border-emerald-100 bg-white px-2 py-2"><p className="text-sm font-black text-emerald-700">{section.correct}</p><p className="mt-0.5 text-[10px] font-bold text-slate-500">Correct</p></div>
                    <div className="rounded-xl border border-rose-100 bg-white px-2 py-2"><p className="text-sm font-black text-rose-700">{section.wrong}</p><p className="mt-0.5 text-[10px] font-bold text-slate-500">Wrong</p></div>
                    <div className="rounded-xl border border-amber-100 bg-white px-2 py-2"><p className="text-sm font-black text-amber-700">{section.unanswered}</p><p className="mt-0.5 text-[10px] font-bold text-slate-500">Skipped</p></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="rounded-3xl border border-[#e5e2f4] bg-white p-5 shadow-[0_10px_34px_rgba(37,42,68,0.04)] sm:p-6" data-testid="solution-review">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f2efff] text-[#6657e8]"><BookOpen className="h-5 w-5" /></span>
              <div><h2 className="text-lg font-bold tracking-tight text-slate-950">Solution review</h2><p className="mt-1 text-sm leading-6 text-slate-500">Answers and explanations come from the immutable submitted test version.</p></div>
            </div>
            <div className="flex flex-wrap gap-2">
              {(["all", "wrong", "flagged", "unanswered"] as ReviewFilter[]).map((item) => (
                <Button key={item} className={`min-h-11 rounded-xl ${filter === item ? "bg-[#6657e8] text-white hover:bg-[#594bd9]" : "border-[#dedbea] bg-white text-slate-600 hover:bg-[#f7f5ff]"}`} size="sm" variant={filter === item ? "default" : "outline"} onClick={() => setFilter(item)}>
                  {item[0]!.toUpperCase() + item.slice(1)} ({counts[item]})
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {filteredReview.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-8 text-center text-sm text-slate-500">No questions match this filter.</div>
            ) : filteredReview.map((item, index) => {
              const state = reviewState(item);
              return (
                <article key={item.questionId} className="overflow-hidden rounded-2xl border border-[#e9e7f1] bg-white">
                  <div className="flex items-start justify-between gap-4 border-b border-[#efedf5] bg-[#fbfaff] px-4 py-4 sm:px-5">
                    <div className="min-w-0"><p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Question {index + 1} · {item.section}</p><div className="mt-2 font-semibold leading-6 text-slate-950"><QuestionRichText content={item.text} lang="en" /></div></div>
                    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-black ${state === "correct" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : state === "wrong" ? "border-rose-200 bg-rose-50 text-rose-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}>
                      {state === "correct" ? <CheckCircle2 className="h-3.5 w-3.5" /> : state === "wrong" ? <XCircle className="h-3.5 w-3.5" /> : <Clock3 className="h-3.5 w-3.5" />}
                      {state === "correct" ? "Correct" : state === "wrong" ? "Wrong" : "Unanswered"}
                    </span>
                  </div>
                  <div className="p-4 sm:p-5">
                    <div className="grid gap-2 sm:grid-cols-2">
                      {item.options.map((option, optionIndex) => {
                        const correct = optionIndex === item.correct;
                        const selected = optionIndex === item.selected;
                        return (
                          <div key={optionIndex} className={`rounded-xl border px-3 py-3 text-sm leading-6 ${correct ? "border-emerald-200 bg-emerald-50/70" : selected ? "border-rose-200 bg-rose-50/70" : "border-[#eceaf2] bg-white"}`}>
                            <div className="flex items-start gap-2"><strong className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[11px] ${correct ? "bg-emerald-100 text-emerald-700" : selected ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-500"}`}>{String.fromCharCode(65 + optionIndex)}</strong><div className="min-w-0 text-slate-700"><QuestionRichText content={option} lang="en" /></div></div>
                          </div>
                        );
                      })}
                    </div>
                    {item.flagged && <p className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700"><Flag className="h-3.5 w-3.5" />Marked for review</p>}
                    {item.explanation && <div className="mt-4 rounded-2xl border border-[#e4e0f5] bg-[#f8f6ff] p-4 text-sm leading-6 text-slate-700"><p className="mb-2 text-xs font-black uppercase tracking-[0.12em] text-[#6657e8]">Explanation</p><QuestionRichText content={item.explanation} lang="en" /></div>}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
