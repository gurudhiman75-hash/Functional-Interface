import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileQuestion,
  Flag,
  RotateCcw,
  Target,
  XCircle,
} from "lucide-react";
import { useLocation } from "wouter";

import { QuestionRichText } from "@/components/QuestionRichText";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getAttemptById } from "@/lib/data";
import type { TestAttempt } from "@/lib/storage";

type ReviewFilter = "all" | "wrong" | "flagged" | "unanswered";
type CanonicalResult = TestAttempt & {
  attemptNumber?: number;
  submittedAt?: string;
  seriesId?: string | null;
};

function formatDuration(minutes: number): string {
  const safe = Math.max(0, Math.round(minutes));
  if (safe < 60) return `${safe} min`;
  const hours = Math.floor(safe / 60);
  const remaining = safe % 60;
  return remaining ? `${hours} hr ${remaining} min` : `${hours} hr`;
}

function reviewState(item: NonNullable<TestAttempt["questionReview"]>[number]) {
  if (item.selected == null) return "unanswered";
  return item.selected === item.correct ? "correct" : "wrong";
}

function stateLabel(state: "correct" | "wrong" | "unanswered") {
  if (state === "correct") return "Correct";
  if (state === "wrong") return "Incorrect";
  return "Unanswered";
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
      <div className="mx-auto flex min-h-[70vh] max-w-xl items-center px-4">
        <div className="w-full rounded-2xl border border-amber-200 bg-white p-8 text-center">
          <Clock3 className="mx-auto h-10 w-10 text-amber-700" aria-hidden="true" />
          <h1 className="mt-4 text-xl font-semibold text-slate-950">Submission is not confirmed yet</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            ExamTree only shows a score after the server has committed your attempt. If your connection dropped during submission, your saved attempt remains recoverable and no earlier or local score is presented as this attempt&apos;s official result.
          </p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
            {requestedTestId && (
              <Button onClick={() => setLocation(`/test/${encodeURIComponent(requestedTestId)}`)}>
                Return to saved test
              </Button>
            )}
            <Button variant="outline" onClick={() => setLocation("/dashboard")}>Open My Activity</Button>
          </div>
        </div>
      </div>
    );
  }

  if (resultQuery.isLoading) {
    return <div className="flex min-h-[70vh] items-center justify-center text-slate-600">Loading your saved result…</div>;
  }

  if (!result || resultQuery.isError) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-xl items-center px-4">
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <FileQuestion className="mx-auto h-10 w-10 text-slate-500" aria-hidden="true" />
          <h1 className="mt-4 text-xl font-semibold text-slate-950">Result is not available</h1>
          <p className="mt-2 text-sm text-slate-600">
            The attempt may still be syncing, or this link does not belong to your account.
          </p>
          <Button className="mt-5" onClick={() => setLocation("/dashboard")}>Open My Activity</Button>
        </div>
      </div>
    );
  }

  const accuracy = result.correct + result.wrong > 0
    ? Math.round((result.correct / (result.correct + result.wrong)) * 100)
    : 0;
  const seriesUrl = result.seriesId ? `/test-series/${encodeURIComponent(result.seriesId)}` : null;
  const retryUrl = `/test/${encodeURIComponent(result.testId)}${result.seriesId ? `?seriesId=${encodeURIComponent(result.seriesId)}` : ""}`;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8" data-testid="canonical-result-report">
      <button
        type="button"
        onClick={() => setLocation(seriesUrl ?? "/dashboard")}
        className="inline-flex min-h-11 items-center gap-2 rounded-lg px-1 text-sm font-medium text-foreground/90 hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {seriesUrl ? "Back to Test Series" : "Back to My Activity"}
      </button>

      <section className="overflow-hidden border-y border-slate-200 bg-white" data-testid="canonical-result-summary">
        <div className="grid gap-8 px-5 py-7 sm:px-7 sm:py-8 lg:grid-cols-[1fr_280px] lg:items-center">
          <div className="min-w-0">
            <p className="text-sm font-medium text-teal-700">Canonical saved result</p>
            <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{result.testName}</h1>
            <p className="mt-2 text-sm text-slate-600">{result.category}</p>
            <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-600">
              Use the section breakdown and submitted-version solution review below to decide what to revise before your next attempt.
            </p>
          </div>

          <div className="border-t border-slate-200 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <p className="text-xs font-medium text-slate-500">Score</p>
            <div className="mt-1 text-5xl font-semibold tracking-tight tabular-nums text-slate-950">{result.score}%</div>
            {result.actualScore != null && <p className="mt-1 text-sm font-medium text-slate-600">Marks scored: {result.actualScore}</p>}
            <div className="mt-5">
              <div className="flex items-center justify-between gap-4 text-xs text-slate-600">
                <span>Accuracy</span>
                <strong className="text-slate-950">{accuracy}%</strong>
              </div>
              <Progress value={accuracy} className="mt-2 h-2" />
            </div>
          </div>
        </div>

        <dl className="grid border-t border-slate-200 sm:grid-cols-2 lg:grid-cols-4" data-testid="canonical-result-metrics">
          <div className="border-b border-slate-200 px-5 py-4 sm:border-r lg:border-b-0">
            <dt className="text-xs font-medium text-slate-500">Correct</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums text-emerald-700">{result.correct}</dd>
          </div>
          <div className="border-b border-slate-200 px-5 py-4 lg:border-b-0 lg:border-r">
            <dt className="text-xs font-medium text-slate-500">Wrong</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums text-rose-700">{result.wrong}</dd>
          </div>
          <div className="border-b border-slate-200 px-5 py-4 sm:border-b-0 sm:border-r">
            <dt className="text-xs font-medium text-slate-500">Unanswered</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums text-slate-950">{result.unanswered}</dd>
          </div>
          <div className="px-5 py-4">
            <dt className="text-xs font-medium text-slate-500">Time spent</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums text-slate-950">{formatDuration(result.timeSpent)}</dd>
          </div>
        </dl>
      </section>

      {result.sectionStats && result.sectionStats.length > 0 && (
        <section aria-labelledby="section-performance-heading">
          <div>
            <h2 id="section-performance-heading" className="text-2xl font-semibold tracking-tight text-slate-950">Section performance</h2>
            <p className="mt-1 text-sm text-slate-600">Compare accuracy across the sections saved with this attempt.</p>
          </div>
          <div className="mt-4 divide-y divide-slate-200 border-y border-slate-200 bg-white">
            {result.sectionStats.map((section) => (
              <div key={section.name} className="grid gap-3 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_minmax(180px,280px)] sm:items-center sm:px-5">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <strong className="text-sm font-semibold text-slate-950">{section.name}</strong>
                    <span className="text-sm font-semibold tabular-nums text-slate-950 sm:hidden">{section.accuracy}%</span>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{section.correct} correct · {section.wrong} wrong · {section.unanswered} unanswered</p>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={section.accuracy} className="h-2 flex-1" />
                  <span className="hidden w-10 text-right text-sm font-semibold tabular-nums text-slate-950 sm:block">{section.accuracy}%</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="solution-review-heading" data-testid="canonical-solution-review">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 id="solution-review-heading" className="text-2xl font-semibold tracking-tight text-slate-950">Solution review</h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">Answers and explanations come from the immutable submitted test version.</p>
          </div>
          <div className="flex flex-wrap gap-2" aria-label="Filter solution review">
            {(["all", "wrong", "flagged", "unanswered"] as ReviewFilter[]).map((item) => (
              <Button
                key={item}
                size="sm"
                variant={filter === item ? "default" : "outline"}
                className={filter === item ? "bg-indigo-700 text-white hover:bg-indigo-800" : "border-slate-300 bg-white text-slate-800"}
                aria-pressed={filter === item}
                onClick={() => setFilter(item)}
              >
                {item[0]!.toUpperCase() + item.slice(1)} ({counts[item]})
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          {filteredReview.length === 0 ? (
            <div className="border-y border-dashed border-slate-300 px-5 py-10 text-center text-sm text-slate-600">No questions match this filter.</div>
          ) : (
            <div className="divide-y divide-slate-200 border-y border-slate-200 bg-white">
              {filteredReview.map((item, index) => {
                const state = reviewState(item);
                return (
                  <article key={item.questionId} className="px-4 py-6 sm:px-6" data-review-state={state}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-500">Question {index + 1} · {item.section}</p>
                        <div className="mt-2 font-medium leading-7 text-slate-950"><QuestionRichText content={item.text} lang="en" /></div>
                      </div>
                      <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold ${
                        state === "correct"
                          ? "bg-emerald-50 text-emerald-800"
                          : state === "wrong"
                            ? "bg-rose-50 text-rose-800"
                            : "bg-amber-50 text-amber-800"
                      }`}>
                        {state === "correct" ? <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> : state === "wrong" ? <XCircle className="h-3.5 w-3.5" aria-hidden="true" /> : <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />}
                        {stateLabel(state)}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-2">
                      {item.options.map((option, optionIndex) => {
                        const correct = optionIndex === item.correct;
                        const selected = optionIndex === item.selected;
                        return (
                          <div
                            key={optionIndex}
                            className={`grid grid-cols-[28px_1fr] gap-2 rounded-lg border px-3 py-3 text-sm leading-6 ${
                              correct
                                ? "border-emerald-300 bg-emerald-50/70 text-slate-950"
                                : selected
                                  ? "border-rose-300 bg-rose-50/70 text-slate-950"
                                  : "border-slate-200 bg-white text-slate-700"
                            }`}
                          >
                            <strong>{String.fromCharCode(65 + optionIndex)}.</strong>
                            <QuestionRichText content={option} lang="en" />
                          </div>
                        );
                      })}
                    </div>

                    {item.flagged && <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-violet-800"><Flag className="h-3.5 w-3.5" aria-hidden="true" />Marked for review</p>}
                    {item.explanation && (
                      <div className="mt-5 border-l-2 border-indigo-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
                        <p className="mb-1 font-semibold text-slate-950">Explanation</p>
                        <QuestionRichText content={item.explanation} lang="en" />
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
        {seriesUrl && <Button variant="outline" onClick={() => setLocation(seriesUrl)}><Target className="mr-2 h-4 w-4" aria-hidden="true" />Continue Test Series</Button>}
        <Button className="bg-indigo-700 text-white hover:bg-indigo-800" onClick={() => setLocation(retryUrl)}><RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />Retake test</Button>
      </div>
    </div>
  );
}
