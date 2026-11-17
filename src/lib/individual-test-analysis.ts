import type { TestAttempt } from "@workspace/api-zod";

type SavedQuestion = NonNullable<TestAttempt["questionReview"]>[number];

export type DifficultyRow = {
  difficulty: "Easy" | "Medium" | "Hard";
  total: number;
  correct: number;
  wrong: number;
  unanswered: number;
  answered: number;
  accuracy: number | null;
  attemptRate: number | null;
};

export type SectionResultRow = {
  name: string;
  correct: number;
  wrong: number;
  unanswered: number;
  total: number;
  answered: number;
  accuracy: number | null;
  attemptRate: number | null;
  seconds: number | null;
  netMarks: number | null;
};

export type MarkingBreakdown = {
  marksGained: number;
  marksLost: number;
  calculatedNet: number;
  reportedNet: number | null;
};

const nonnegative = (n: number | null | undefined) => Number.isFinite(n) ? Math.max(0, Number(n)) : 0;
const percent = (num: number, den: number) => den > 0 ? Math.round(1000 * num / den) / 10 : null;
const round = (n: number) => Math.round(n * 100) / 100;

export function analyzeDifficulty(review: SavedQuestion[]) {
  const tagged = review.filter((q) => q.difficulty === "Easy" || q.difficulty === "Medium" || q.difficulty === "Hard");
  const rows: DifficultyRow[] = (["Easy", "Medium", "Hard"] as const).map((difficulty) => {
    const items = tagged.filter((q) => q.difficulty === difficulty);
    const correct = items.filter((q) => q.selected != null && q.selected === q.correct).length;
    const wrong = items.filter((q) => q.selected != null && q.selected !== q.correct).length;
    const unanswered = items.length - correct - wrong;
    const answered = correct + wrong;
    return {
      difficulty, total: items.length, correct, wrong, unanswered, answered,
      accuracy: percent(correct, answered), attemptRate: percent(answered, items.length),
    };
  }).filter((row) => row.total > 0);
  return { rows, taggedQuestions: tagged.length, reviewQuestions: review.length };
}

export function analyzeMarking(attempt: TestAttempt): MarkingBreakdown | null {
  const positive = attempt.marksPerQuestion;
  const negative = attempt.negativeMarks;
  if (!Number.isFinite(positive) || !Number.isFinite(negative) ||
      positive == null || negative == null || positive <= 0 || negative < 0) return null;
  const marksGained = round(nonnegative(attempt.correct) * positive);
  const marksLost = round(nonnegative(attempt.wrong) * negative);
  return {
    marksGained,
    marksLost,
    calculatedNet: round(marksGained - marksLost),
    reportedNet: attempt.actualScore != null && Number.isFinite(attempt.actualScore) ? attempt.actualScore : null,
  };
}

export function analyzeResultSections(attempt: TestAttempt): SectionResultRow[] {
  const marking = analyzeMarking(attempt);
  const times = new Map(
    (attempt.sectionTimeSpent ?? [])
      .filter((item) => item.name?.trim() && Number.isFinite(item.minutesSpent) && item.minutesSpent >= 0)
      .map((item) => [item.name.trim().toLowerCase(), Math.round(item.minutesSpent * 60)] as const),
  );
  return (attempt.sectionStats ?? []).filter((section) => section.name?.trim()).map((section) => {
    const correct = nonnegative(section.correct);
    const wrong = nonnegative(section.wrong);
    const answered = correct + wrong;
    const total = Math.max(nonnegative(section.totalQuestions), answered + nonnegative(section.unanswered));
    const seconds = times.get(section.name.trim().toLowerCase()) ?? null;
    return {
      name: section.name,
      correct, wrong, answered, unanswered: Math.max(0, total - answered), total,
      accuracy: percent(correct, answered),
      attemptRate: percent(answered, total),
      seconds,
      netMarks: marking ? round(correct * attempt.marksPerQuestion! - wrong * attempt.negativeMarks!) : null,
    };
  });
}

export function previousSavedAttempt(current: TestAttempt, all: TestAttempt[]): TestAttempt | null {
  if (current.attemptType === "PRACTICE") return null;
  const when = new Date(current.createdAt).getTime();
  if (!Number.isFinite(when)) return null;
  const previous = all.filter((item) =>
    item.id !== current.id &&
    item.testId === current.testId &&
    item.userId === current.userId &&
    (!item.attemptType || item.attemptType === "REAL") &&
    Number.isFinite(item.score) &&
    Number.isFinite(new Date(item.createdAt).getTime()) &&
    new Date(item.createdAt).getTime() < when,
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return previous[0] ?? null;
}

export function attemptComparison(current: TestAttempt, prior: TestAttempt | null) {
  if (!prior) return null;
  const currentAnswered = nonnegative(current.correct) + nonnegative(current.wrong);
  const priorAnswered = nonnegative(prior.correct) + nonnegative(prior.wrong);
  const currentAccuracy = percent(nonnegative(current.correct), currentAnswered);
  const priorAccuracy = percent(nonnegative(prior.correct), priorAnswered);
  return {
    previousId: prior.id,
    previousScore: prior.score,
    scoreDelta: round(current.score - prior.score),
    accuracyDelta: currentAccuracy != null && priorAccuracy != null ? round(currentAccuracy - priorAccuracy) : null,
    answeredDelta: currentAnswered - priorAnswered,
  };
}
