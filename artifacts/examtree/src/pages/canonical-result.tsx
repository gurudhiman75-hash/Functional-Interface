import { useMemo, useState } from "react";
import { useLocation } from "wouter";
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

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { QuestionRichText } from "@/components/QuestionRichText";
import { getAttemptById } from "@/lib/data";
import { getAttempts, type TestAttempt } from "@/lib/storage";

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

export default function CanonicalResult() {
  const [, setLocation] = useLocation();
  const params = typeof window === "undefined" ? null : new URLSearchParams(window.location.search);
  const attemptId = params?.get("attemptId") ?? null;
  const requestedTestId = params?.get("testId") ?? null;
  const [filter, setFilter] = useState<ReviewFilter>("all");

  // Older internal links sometimes carry only testId. Browser history may help us
  // recover the committed attempt identifier, but never supplies score content.
  const cachedAttemptId = useMemo(() => {
    if (!requestedTestId) return null;
    const candidate = getAttempts().find(
      (attempt) => attempt.testId === requestedTestId && typeof attempt.id === "string" && attempt.id.length > 0,
    );
    return candidate?.id ?? null;
  }, [requestedTestId]);
  const resolvedAttemptId = attemptId ?? cachedAttemptId;

  const resultQuery = useQuery({
    queryKey: ["canonical-attempt-result", resolvedAttemptId],
    queryFn: () => getAttemptById(resolvedAttemptId!),
    enabled: Boolean(resolvedAttemptId),
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

  if (!resolvedAttemptId) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-xl items-center px-4">
        <div className="w-full rounded-2xl border border-amber-200 bg-card p-8 text-center shadow-sm">
          <Clock3 className="mx-auto h-10 w-10 text-amber-600" />
          <h1 className="mt-4 text-xl font-semibold">Submission is not confirmed yet</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            ExamTree only shows a score after the server has committed your attempt. If your connection dropped during submission, your saved attempt remains recoverable and no local estimate is presented as an official result.
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
    return <div className="flex min-h-[70vh] items-center justify-center text-muted-foreground">Loading your saved result…</div>;
  }

  if (!result || resultQuery.isError) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-xl items-center px-4">
        <div className="w-full rounded-2xl border bg-card p-8 text-center shadow-sm">
          <FileQuestion className="mx-auto h-10 w-10 text-muted-foreground" />
          <h1 className="mt-4 text-xl font-semibold">Result is not available</h1>
          <p className="mt-2 text-sm text-muted-foreground">
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
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={() => setLocation(seriesUrl ?? "/dashboard")}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {seriesUrl ? "Back to Test Series" : "Back to My Activity"}
      </button>

      <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="bg-gradient-to-br from-primary/15 via-background to-background p-6 text-center sm:p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Canonical saved result</p>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{result.testName}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{result.category}</p>
          <div className="mt-6 text-6xl font-bold tabular-nums">{result.score}%</div>
          {result.actualScore != null && <p className="mt-2 text-sm font-semibold text-muted-foreground">Marks scored: {result.actualScore}</p>}
          <div className="mx-auto mt-6 max-w-md">
            <div className="flex justify-between text-xs text-muted-foreground"><span>Accuracy</span><strong>{accuracy}%</strong></div>
            <Progress value={accuracy} className="mt-2 h-2" />
          </div>
        </div>
        <div className="grid gap-px border-t bg-border sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-card p-4"><p className="text-xs text-muted-foreground">Correct</p><p className="mt-1 text-2xl font-semibold text-emerald-600">{result.correct}</p></div>
          <div className="bg-card p-4"><p className="text-xs text-muted-foreground">Wrong</p><p className="mt-1 text-2xl font-semibold text-red-600">{result.wrong}</p></div>
          <div className="bg-card p-4"><p className="text-xs text-muted-foreground">Unanswered</p><p className="mt-1 text-2xl font-semibold">{result.unanswered}</p></div>
          <div className="bg-card p-4"><p className="text-xs text-muted-foreground">Time spent</p><p className="mt-1 text-2xl font-semibold">{formatDuration(result.timeSpent)}</p></div>
        </div>
      </section>

      {result.sectionStats && result.sectionStats.length > 0 && (
        <section className="rounded-2xl border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Section performance</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {result.sectionStats.map((section) => (
              <div key={section.name} className="rounded-xl border p-4">
                <div className="flex items-center justify-between"><strong>{section.name}</strong><span className="text-sm font-semibold">{section.accuracy}%</span></div>
                <Progress value={section.accuracy} className="mt-3 h-2" />
                <p className="mt-2 text-xs text-muted-foreground">{section.correct} correct · {section.wrong} wrong · {section.unanswered} unanswered</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-4 rounded-2xl border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Solution review</h2>
            <p className="text-sm text-muted-foreground">Answers and explanations come from the immutable submitted test version.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(["all", "wrong", "flagged", "unanswered"] as ReviewFilter[]).map((item) => (
              <Button key={item} size="sm" variant={filter === item ? "default" : "outline"} onClick={() => setFilter(item)}>
                {item[0]!.toUpperCase() + item.slice(1)} ({counts[item]})
              </Button>
            ))}
          </div>
        </div>

        {filteredReview.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">No questions match this filter.</div>
        ) : filteredReview.map((item, index) => {
          const state = reviewState(item);
          return (
            <article key={item.questionId} className="rounded-xl border p-5">
              <div className="flex items-start justify-between gap-3">
                <div><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Question {index + 1} · {item.section}</p><div className="mt-2 font-medium"><QuestionRichText content={item.text} lang="en" /></div></div>
                {state === "correct" ? <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" /> : state === "wrong" ? <XCircle className="h-5 w-5 shrink-0 text-red-600" /> : <Clock3 className="h-5 w-5 shrink-0 text-amber-600" />}
              </div>
              <div className="mt-4 space-y-2">
                {item.options.map((option, optionIndex) => {
                  const correct = optionIndex === item.correct;
                  const selected = optionIndex === item.selected;
                  return <div key={optionIndex} className={`rounded-lg border px-3 py-2 text-sm ${correct ? "border-emerald-300 bg-emerald-50" : selected ? "border-red-300 bg-red-50" : ""}`}><strong className="mr-2">{String.fromCharCode(65 + optionIndex)}.</strong><QuestionRichText content={option} lang="en" /></div>;
                })}
              </div>
              {item.flagged && <p className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-violet-700"><Flag className="h-3.5 w-3.5" />Marked for review</p>}
              {item.explanation && <div className="mt-4 rounded-lg bg-muted/40 p-4 text-sm"><p className="mb-2 font-semibold">Explanation</p><QuestionRichText content={item.explanation} lang="en" /></div>}
            </article>
          );
        })}
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        {seriesUrl && <Button variant="outline" onClick={() => setLocation(seriesUrl)}><Target className="mr-2 h-4 w-4" />Continue Test Series</Button>}
        <Button onClick={() => setLocation(retryUrl)}><RotateCcw className="mr-2 h-4 w-4" />Retake test</Button>
      </div>
    </div>
  );
}