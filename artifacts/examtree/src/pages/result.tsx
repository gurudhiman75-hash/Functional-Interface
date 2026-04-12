import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import {
  Award,
  CheckCircle,
  Clock,
  Flag,
  MinusCircle,
  RotateCcw,
  Target,
  TimerReset,
  Trophy,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { getAttempts } from "@/lib/storage";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ReviewFilter = "all" | "wrong" | "flagged" | "unanswered";
type ReviewItem = {
  questionId: number;
  section: string;
  text: string;
  options: string[];
  selected: number | null;
  correct: number;
  flagged: boolean;
  explanation: string;
};

function getGrade(score: number) {
  if (score >= 90) return { label: "Outstanding", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" };
  if (score >= 80) return { label: "Excellent", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" };
  if (score >= 70) return { label: "Good", color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-900/20" };
  if (score >= 60) return { label: "Average", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" };
  return { label: "Needs Work", color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" };
}

function getAnswerLabel(index: number) {
  return String.fromCharCode(65 + index);
}

function getReviewState(item: ReviewItem) {
  if (item.selected === null) return "unanswered";
  if (item.selected === item.correct) return "correct";
  return "wrong";
}

export default function Result() {
  const [, setLocation] = useLocation();
  const attempts = getAttempts();
  const query = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const requestedTestId = query?.get("testId");
  const requestedTab = query?.get("tab") === "review" ? "review" : "summary";
  const relevantAttempts = requestedTestId
    ? attempts.filter((attempt) => attempt.testId === requestedTestId)
    : attempts;
  const latest = relevantAttempts[0] ?? null;
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>("all");
  const questionReview = latest?.questionReview ?? [];

  const reviewCounts = useMemo(() => {
    const counts = { all: questionReview.length, wrong: 0, flagged: 0, unanswered: 0 };
    for (const item of questionReview) {
      const state = getReviewState(item);
      if (state === "wrong") counts.wrong += 1;
      if (state === "unanswered") counts.unanswered += 1;
      if (item.flagged) counts.flagged += 1;
    }
    return counts;
  }, [questionReview]);

  const filteredReview = useMemo(() => {
    switch (reviewFilter) {
      case "wrong":
        return questionReview.filter((item) => getReviewState(item) === "wrong");
      case "flagged":
        return questionReview.filter((item) => item.flagged);
      case "unanswered":
        return questionReview.filter((item) => getReviewState(item) === "unanswered");
      default:
        return questionReview;
    }
  }, [questionReview, reviewFilter]);

  if (!latest) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="rounded-[2rem] border border-border bg-card/85 p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Target className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {requestedTestId ? "No completed attempt found" : "No result available yet"}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              {requestedTestId
                ? "You can retry this test now and come back here for the solution review."
                : "Complete a test first and this page will show your real score breakdown, section analysis, timing data, and solution review."}
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button onClick={() => setLocation(requestedTestId ? `/test/${requestedTestId}` : "/exams")} className="gap-2">
                <RotateCcw className="w-4 h-4" />
                {requestedTestId ? "Retry Test" : "Start a Test"}
              </Button>
              {requestedTestId && (
                <Button variant="outline" onClick={() => setLocation("/result")}>
                  View Latest Result
                </Button>
              )}
              <Button variant="outline" onClick={() => setLocation("/dashboard")}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const grade = getGrade(latest.score);
  const accuracy = Math.round((latest.correct / (latest.correct + latest.wrong)) * 100) || 0;
  const averageScore =
    attempts.length > 0 ? attempts.reduce((sum, attempt) => sum + attempt.score, 0) / attempts.length : latest.score;
  const bestScore = attempts.length > 0 ? Math.max(...attempts.map((attempt) => attempt.score)) : latest.score;
  const totalAttempts = attempts.length;

  const sectionStats = latest.sectionStats ?? [];
  const sectionTimeSpent = latest.sectionTimeSpent ?? [];
  const sorted = [...sectionStats].sort((a, b) => b.accuracy - a.accuracy);
  const strong = sorted.slice(0, 3);
  const weak = sorted.slice(-3).reverse();
  const recommendations = weak.map((section) => ({
    name: section.name,
    advice:
      section.accuracy < 40
        ? "Rebuild fundamentals and retry untimed practice for this section."
        : "Practice a short revision set and review wrong attempts before the next mock.",
  }));

  const reviewChips: { key: ReviewFilter; label: string; count: number }[] = [
    { key: "all", label: "All", count: reviewCounts.all },
    { key: "wrong", label: "Wrong", count: reviewCounts.wrong },
    { key: "flagged", label: "Flagged", count: reviewCounts.flagged },
    { key: "unanswered", label: "Unanswered", count: reviewCounts.unanswered },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="hero-panel rounded-[2.5rem] p-8 text-white text-center mb-8 animate-fadeInUp shadow-xl" data-testid="result-hero">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold mb-4 ${grade.bg} ${grade.color}`}>
            <Award className="w-4 h-4" />
            {grade.label}
          </div>
          <p className="text-blue-100 text-sm mb-1">Your Score</p>
          <h1 className="text-6xl sm:text-7xl font-bold mb-2" data-testid="result-score">{latest.score}%</h1>
          <p className="text-blue-100">{latest.testName}</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-sm font-semibold text-blue-100">
            <span>{latest.category}</span>
            <span className="text-white/60">•</span>
            <span>{totalAttempts} completed {totalAttempts === 1 ? "attempt" : "attempts"} on this device</span>
          </div>
        </div>

        <Tabs defaultValue={requestedTab} className="space-y-8">
          <TabsList className="grid h-auto w-full grid-cols-2 rounded-2xl bg-card/85 p-1 shadow-sm">
            <TabsTrigger value="summary" className="rounded-xl py-2.5 text-sm font-semibold">
              Summary
            </TabsTrigger>
            <TabsTrigger value="review" className="rounded-xl py-2.5 text-sm font-semibold">
              Review
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: <CheckCircle className="w-5 h-5" />, label: "Correct", value: latest.correct, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
                { icon: <XCircle className="w-5 h-5" />, label: "Wrong", value: latest.wrong, color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" },
                { icon: <MinusCircle className="w-5 h-5" />, label: "Skipped", value: latest.unanswered, color: "text-muted-foreground", bg: "bg-muted" },
                { icon: <Clock className="w-5 h-5" />, label: "Time Spent", value: `${latest.timeSpent}m`, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-900/20" },
              ].map((item) => (
                <div key={item.label} className="bg-card/85 border border-border/70 rounded-2xl p-5 shadow-sm text-center surface-hover" data-testid={`stat-${item.label.toLowerCase()}`}>
                  <div className={`w-10 h-10 ${item.bg} rounded-lg flex items-center justify-center ${item.color} mx-auto mb-2`}>
                    {item.icon}
                  </div>
                  <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card/85 border border-border/70 rounded-2xl p-6 shadow-sm">
                <h2 className="font-bold text-foreground flex items-center gap-2 mb-5">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Strong & Weak Areas
                </h2>

                {sectionStats.length === 0 ? (
                  <p className="empty-state text-sm">
                    Take a test to see strong/weak analysis for each section.
                  </p>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-3">
                        Strong Areas
                      </h3>
                      <div className="space-y-3">
                        {strong.map((s) => (
                          <div key={s.name}>
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="text-sm font-medium text-foreground">{s.name}</span>
                              <span className="text-sm font-bold text-emerald-600">{s.accuracy}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2.5">
                              <div className="h-2.5 rounded-full transition-all duration-700" style={{ width: `${s.accuracy}%`, backgroundColor: "#10b981" }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-red-700 dark:text-red-300 mb-3">
                        Weak Areas
                      </h3>
                      <div className="space-y-3">
                        {weak.map((s) => (
                          <div key={s.name}>
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="text-sm font-medium text-foreground">{s.name}</span>
                              <span className="text-sm font-bold text-red-600">{s.accuracy}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2.5">
                              <div className="h-2.5 rounded-full transition-all duration-700" style={{ width: `${s.accuracy}%`, backgroundColor: "#ef4444" }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Overall Accuracy</span>
                        <span className="font-bold text-primary">{accuracy}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="bg-card/85 border border-border/70 rounded-2xl p-6 shadow-sm">
                  <h2 className="font-bold text-foreground flex items-center gap-2 mb-5">
                    <Trophy className="w-4 h-4 text-primary" />
                    Attempt Summary
                  </h2>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-border/70 bg-muted/40 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Latest Score</p>
                      <p className="mt-2 text-2xl font-bold text-foreground">{latest.score}%</p>
                    </div>
                    <div className="rounded-xl border border-border/70 bg-muted/40 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Average Score</p>
                      <p className="mt-2 text-2xl font-bold text-foreground">{averageScore.toFixed(1)}%</p>
                    </div>
                    <div className="rounded-xl border border-border/70 bg-muted/40 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Best Score</p>
                      <p className="mt-2 text-2xl font-bold text-foreground">{bestScore.toFixed(1)}%</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    These values come from the completed attempts currently stored on this device. No global percentile or cross-user rank is shown because the app does not have a real ranking backend yet.
                  </p>
                </div>

                <div className="bg-card/85 border border-border/70 rounded-2xl p-6 shadow-sm">
                  <h2 className="font-bold text-foreground flex items-center gap-2 mb-5">
                    <TimerReset className="w-4 h-4 text-primary" />
                    Section Timing
                  </h2>
                  {sectionTimeSpent.length === 0 ? (
                    <p className="empty-state text-sm">No sectional timing data was recorded for this attempt.</p>
                  ) : (
                    <div className="space-y-3">
                      {sectionTimeSpent.map((section) => (
                        <div key={section.name} className="rounded-xl border border-border/70 bg-muted/40 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="font-medium text-foreground">{section.name}</p>
                              <p className="text-xs text-muted-foreground">Time invested in this section</p>
                            </div>
                            <span className="text-sm font-bold text-primary">{section.minutesSpent} min</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-card/85 border border-border/70 rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-foreground flex items-center gap-2 mb-5">
                <Target className="w-4 h-4 text-primary" />
                Next Focus
              </h2>
              {recommendations.length === 0 ? (
                <p className="empty-state text-sm">Complete more tests to unlock section-specific recommendations.</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {recommendations.map((section) => (
                    <div key={section.name} className="rounded-xl border border-border/70 bg-muted/40 p-4">
                      <p className="font-medium text-foreground">{section.name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{section.advice}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="review" className="space-y-6">
            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground">Solution Review</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Review every question with your answer, the correct answer, and the explanation.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {reviewChips.map((chip) => (
                    <button
                      key={chip.key}
                      type="button"
                      onClick={() => setReviewFilter(chip.key)}
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                        reviewFilter === chip.key
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-foreground hover:bg-muted"
                      }`}
                    >
                      {chip.label}
                      <span className={`rounded-full px-1.5 py-0.5 text-xs ${reviewFilter === chip.key ? "bg-white/20" : "bg-muted"}`}>
                        {chip.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {questionReview.length === 0 ? (
              <div className="rounded-2xl border border-border/70 bg-card/85 p-8 text-center shadow-sm">
                <p className="text-sm text-muted-foreground">
                  This attempt does not include per-question review data yet. Take a new test to unlock the full solution view.
                </p>
              </div>
            ) : filteredReview.length === 0 ? (
              <div className="rounded-2xl border border-border/70 bg-card/85 p-8 text-center shadow-sm">
                <p className="text-sm text-muted-foreground">No questions match this filter.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReview.map((item) => {
                  const state = getReviewState(item);
                  const stateLabel =
                    state === "correct" ? "Correct" : state === "wrong" ? "Wrong" : "Unanswered";
                  const stateStyle =
                    state === "correct"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300"
                      : state === "wrong"
                        ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300"
                        : "border-muted bg-muted/40 text-muted-foreground";
                  const yourAnswer =
                    item.selected === null ? "Not answered" : `${getAnswerLabel(item.selected)}. ${item.options[item.selected]}`;
                  const correctAnswer = `${getAnswerLabel(item.correct)}. ${item.options[item.correct]}`;

                  return (
                    <article key={item.questionId} className="rounded-2xl border border-border/70 bg-card/85 p-6 shadow-sm">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-xl bg-primary/10 px-3 text-sm font-bold text-primary">
                              Q{item.questionId}
                            </span>
                            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${stateStyle}`}>
                              {stateLabel}
                            </span>
                            {item.flagged && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700 dark:border-yellow-900/40 dark:bg-yellow-950/30 dark:text-yellow-300">
                                <Flag className="h-3.5 w-3.5" />
                                Flagged
                              </span>
                            )}
                          </div>
                          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            {item.section}
                          </p>
                        </div>
                      </div>

                      <h3 className="mt-4 text-lg font-semibold leading-relaxed text-foreground">{item.text}</h3>

                      <div className="mt-5 space-y-3">
                        {item.options.map((option, index) => {
                          const isSelected = item.selected === index;
                          const isCorrect = item.correct === index;
                          const optionStyle = isCorrect
                            ? "border-emerald-300 bg-emerald-50/80 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-100"
                            : isSelected
                              ? "border-red-300 bg-red-50/80 text-red-900 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-100"
                              : "border-border bg-background text-foreground";

                          return (
                            <div key={`${item.questionId}-${index}`} className={`flex items-start gap-3 rounded-xl border p-4 ${optionStyle}`}>
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-current/20 text-sm font-bold">
                                {getAnswerLabel(index)}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm leading-relaxed">{option}</p>
                                {isCorrect && (
                                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em]">Correct answer</p>
                                )}
                                {isSelected && !isCorrect && (
                                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em]">Your selected answer</p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-5 grid gap-3 md:grid-cols-2">
                        <div className="rounded-xl border border-border/70 bg-muted/40 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Your Answer</p>
                          <p className="mt-2 text-sm font-medium text-foreground">{yourAnswer}</p>
                        </div>
                        <div className="rounded-xl border border-border/70 bg-muted/40 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Correct Answer</p>
                          <p className="mt-2 text-sm font-medium text-foreground">{correctAnswer}</p>
                        </div>
                      </div>

                      <div className="mt-5 rounded-xl border border-border/70 bg-muted/30 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Solution</p>
                        <p className="mt-2 text-sm leading-relaxed text-foreground">
                          {item.explanation?.trim()
                            ? item.explanation
                            : "No explanation was provided for this question."}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="lg" onClick={() => setLocation("/exams")} className="gap-2" data-testid="btn-take-another">
            <RotateCcw className="w-4 h-4" />
            Take Another Test
          </Button>
          <Button size="lg" variant="outline" onClick={() => setLocation("/leaderboard")} className="gap-2" data-testid="btn-view-leaderboard">
            <Trophy className="w-4 h-4" />
            View Leaderboard
          </Button>
          <Button size="lg" variant="outline" onClick={() => setLocation("/dashboard")} data-testid="btn-dashboard">
            Back to Dashboard
          </Button>
        </div>
      </main>
    </div>
  );
}
