import type { TestAttempt } from "@workspace/api-zod";

export type SectionMetric = {
  name: string;
  correct: number;
  wrong: number;
  unanswered: number;
  questions: number;
  answered: number;
  accuracy: number | null;
  attemptRate: number | null;
};

export type TopicMetric = {
  section: string;
  topic: string;
  correct: number;
  wrong: number;
  answered: number;
  accuracy: number;
};

export type PerformanceSummary = {
  completed: number;
  averageScore: number | null;
  bestScore: number | null;
  scoreChangePoints: number | null;
  accuracy: number | null;
  attemptRate: number | null;
  correct: number;
  wrong: number;
  unanswered: number;
  questions: number;
  recordedSeconds: number;
  secondsPerAnswered: number | null;
};

function count(value: number | null | undefined): number {
  return Number.isFinite(value) ? Math.max(0, Number(value)) : 0;
}

function percent(numerator: number, denominator: number): number | null {
  return denominator > 0 ? Math.round((1000 * numerator) / denominator) / 10 : null;
}

export function confirmedRealAttempts(attempts: TestAttempt[]): TestAttempt[] {
  return attempts
    .filter((attempt) =>
      (!attempt.attemptType || attempt.attemptType === "REAL") &&
      Number.isFinite(attempt.score) &&
      Boolean(attempt.id),
    )
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export function summarizePerformance(attempts: TestAttempt[]): PerformanceSummary {
  const correct = attempts.reduce((sum, a) => sum + count(a.correct), 0);
  const wrong = attempts.reduce((sum, a) => sum + count(a.wrong), 0);
  const questions = attempts.reduce((sum, a) => sum + count(a.totalQuestions), 0);
  const answered = correct + wrong;
  const recordedSeconds = attempts.reduce((sum, a) => sum + count(a.timeSpent), 0);
  // Divide only by questions from attempts with recorded duration.
  const timedAnswered = attempts.reduce((sum, a) => sum + (count(a.timeSpent) > 0 ? count(a.correct) + count(a.wrong) : 0), 0);
  const previous = attempts.length > 1 ? attempts[attempts.length - 2] : null;
  const latest = attempts.length > 0 ? attempts[attempts.length - 1] : null;
  return {
    completed: attempts.length,
    averageScore: attempts.length
      ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length * 10) / 10
      : null,
    bestScore: attempts.length ? Math.max(...attempts.map((a) => a.score)) : null,
    scoreChangePoints: latest && previous
      ? Math.round((latest.score - previous.score) * 10) / 10 : null,
    accuracy: percent(correct, answered),
    attemptRate: percent(answered, questions),
    correct,
    wrong,
    unanswered: Math.max(0, questions - answered),
    questions,
    recordedSeconds,
    secondsPerAnswered: timedAnswered > 0 ? Math.round(recordedSeconds / timedAnswered) : null,
  };
}

export function aggregateSections(attempts: TestAttempt[]): SectionMetric[] {
  const map = new Map<string, Omit<SectionMetric, "answered" | "accuracy" | "attemptRate">>();
  for (const attempt of attempts) {
    for (const s of attempt.sectionStats ?? []) {
      const name = (s.name ?? "").trim();
      if (!name) continue;
      const existing = map.get(name) ?? { name, correct: 0, wrong: 0, unanswered: 0, questions: 0 };
      const correct = count(s.correct);
      const wrong = count(s.wrong);
      const questions = count(s.totalQuestions);
      existing.correct += correct;
      existing.wrong += wrong;
      existing.questions += questions;
      existing.unanswered += Math.max(0, questions - correct - wrong);
      map.set(name, existing);
    }
  }
  return Array.from(map.values()).map((s) => ({
    ...s,
    answered: s.correct + s.wrong,
    accuracy: percent(s.correct, s.correct + s.wrong),
    attemptRate: percent(s.correct + s.wrong, s.questions),
  })).sort((a, b) => (b.accuracy ?? -1) - (a.accuracy ?? -1));
}

/** Topic data comes only from server-confirmed answer reviews carrying a topic tag. */
export function aggregateTopics(attempts: TestAttempt[]): TopicMetric[] {
  const map = new Map<string, Omit<TopicMetric, "accuracy">>();
  for (const attempt of attempts) {
    for (const question of attempt.questionReview ?? []) {
      const topic = (question.topic ?? "").trim();
      if (!topic || question.selected == null) continue;
      const section = (question.section ?? "").trim() || "Other";
      const key = JSON.stringify([section.toLowerCase(), topic.toLowerCase()]);
      const item = map.get(key) ?? { section, topic, correct: 0, wrong: 0, answered: 0 };
      if (question.selected === question.correct) item.correct += 1;
      else item.wrong += 1;
      item.answered += 1;
      map.set(key, item);
    }
  }
  return Array.from(map.values()).map((t) => ({
    ...t, accuracy: percent(t.correct, t.answered) ?? 0,
  })).sort((a, b) => a.accuracy - b.accuracy || b.answered - a.answered);
}

/** Trend points preserve only recorded scores; unanswered attempts have no accuracy reading. */
export function scoreTrend(attempts: TestAttempt[]) {
  return attempts.slice(-12).map((a, i) => ({
    index: i + 1,
    name: a.testName || "Test attempt",
    date: a.createdAt,
    score: Math.round(a.score * 10) / 10,
    accuracy: percent(count(a.correct), count(a.correct) + count(a.wrong)),
    pace: count(a.timeSpent) > 0 && count(a.correct) + count(a.wrong) > 0
      ? Math.round(count(a.timeSpent) / (count(a.correct) + count(a.wrong)))
      : null,
  }));
}
