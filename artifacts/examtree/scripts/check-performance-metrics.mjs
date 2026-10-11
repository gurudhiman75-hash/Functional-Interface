import assert from "node:assert/strict";
import {
  aggregateSections, aggregateTopics, confirmedRealAttempts,
  scoreTrend, summarizePerformance,
} from "../src/lib/performance-metrics.ts";

const base = {
  id: "one", testId: "test-1", userId: "learner-1", testName: "Test one",
  category: "SSC", score: 60, createdAt: "2026-08-01T10:00:00Z",
  correct: 3, wrong: 2, unanswered: 5, totalQuestions: 10, timeSpent: 60,
  attemptType: "REAL",
  sectionStats: [{ name: "Reasoning", correct: 3, wrong: 2, unanswered: 5, totalQuestions: 10, accuracy: 60 }],
  questionReview: [
    { topic: "Coding", section: "Reasoning", selected: 0, correct: 0 },
    { topic: "Coding", section: "Reasoning", selected: 1, correct: 0 },
    { topic: "Coding", section: "Reasoning", selected: null, correct: 0 },
  ],
};
const latest = {
  ...base, id: "two", testId: "test-2", testName: "Test two", score: 80,
  createdAt: "2026-08-02T10:00:00Z", correct: 4, wrong: 1, timeSpent: 120,
  sectionStats: [{ name: "Reasoning", correct: 4, wrong: 1, unanswered: 5, totalQuestions: 10, accuracy: 80 }],
};
const ignored = { ...base, id: "practice", attemptType: "PRACTICE", score: 100 };
const attempts = confirmedRealAttempts([latest, ignored, base]);
assert.deepEqual(attempts.map((a) => a.id), ["one", "two"], "exclude practice and retain chronological order");

const stats = summarizePerformance(attempts);
assert.equal(stats.completed, 2);
assert.equal(stats.averageScore, 70);
assert.equal(stats.bestScore, 80);
assert.equal(stats.scoreChangePoints, 20);
assert.equal(stats.accuracy, 70, "accuracy must exclude unanswered");
assert.equal(stats.attemptRate, 50, "attempt rate includes unanswered questions in denominator");
assert.equal(stats.unanswered, 10);
assert.equal(stats.recordedSeconds, 180);
assert.equal(stats.secondsPerAnswered, 18);

const section = aggregateSections(attempts)[0];
assert.equal(section.accuracy, 70);
assert.equal(section.attemptRate, 50);
assert.equal(section.answered, 10);
const topic = aggregateTopics([base])[0];
assert.equal(topic.topic, "Coding");
assert.equal(topic.answered, 2, "unanswered question must not count as a wrong answer");
assert.equal(topic.accuracy, 50);
assert.equal(scoreTrend(attempts)[0].score, 60);
assert.equal(scoreTrend(attempts)[1].accuracy, 80);

const empty = summarizePerformance([]);
assert.equal(empty.averageScore, null);
assert.equal(empty.accuracy, null);
assert.equal(empty.secondsPerAnswered, null);
assert.equal(empty.scoreChangePoints, null);

const noTiming = summarizePerformance([{ ...base, timeSpent: 0 }]);
assert.equal(noTiming.secondsPerAnswered, null, "missing time must never be presented as a speed measurement");
const mixedTiming = summarizePerformance([base, { ...latest, timeSpent: 0 }]);
assert.equal(mixedTiming.secondsPerAnswered, 12, "exclude answers from untimed attempts when calculating seconds per answer");

console.log("Student performance metrics tests passed");
