import assert from "node:assert/strict";
import test from "node:test";

import { analyzeGeneratedQuestionPayload } from "./question-studio-quality";

test("accepts a complete generated MCQ payload", () => {
  const report = analyzeGeneratedQuestionPayload({
    stem: "A number is increased by 20% and becomes 360. What was the original number?",
    options: ["280", "300", "320", "340"],
    correctIndex: 1,
    explanation: "Let the original number be x. Then 120% of x is 360, so x = 360 × 100 / 120 = 300.",
  });

  assert.equal(report.readyForApproval, true);
  assert.equal(report.blockerCount, 0);
  assert.equal(report.score, 100);
});

test("blocks missing explanations and invalid correct answers", () => {
  const report = analyzeGeneratedQuestionPayload({
    stem: "Find the required percentage value from the information given in the question.",
    options: ["10", "20", "30", "40"],
    correctIndex: 8,
    explanation: "",
  });

  assert.equal(report.readyForApproval, false);
  assert.ok(report.issues.some((issue) => issue.code === "CORRECT_INDEX_INVALID"));
  assert.ok(report.issues.some((issue) => issue.code === "EXPLANATION_MISSING"));
});

test("blocks duplicate options and unresolved placeholders", () => {
  const report = analyzeGeneratedQuestionPayload({
    stem: "If {{value}} percent of a number is 45, determine the number.",
    options: ["90", "90", "120", "150"],
    correctIndex: 0,
    explanation: "Use [FORMULA] to calculate the original number.",
  });

  assert.equal(report.readyForApproval, false);
  assert.ok(report.issues.some((issue) => issue.code === "STEM_PLACEHOLDER"));
  assert.ok(report.issues.some((issue) => issue.code === "OPTION_DUPLICATE"));
  assert.ok(report.issues.some((issue) => issue.code === "EXPLANATION_PLACEHOLDER"));
});
