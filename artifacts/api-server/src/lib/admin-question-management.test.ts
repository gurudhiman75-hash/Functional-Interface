import assert from "node:assert/strict";
import test from "node:test";

import {
  QuestionManagementError,
  getQuestionLifecycleConfig,
  normalizeLifecycleInput,
  normalizeQuestionVersionInput,
} from "./admin-question-management";
import {
  normalizeGeneratedQuestionPayload,
  questionPublicCode,
} from "./admin-question-conversion";

test("normalizes an immutable question version with one correct option", () => {
  const result = normalizeQuestionVersionInput({
    expectedLockVersion: 2,
    stem: "  What is 2 + 2?  ",
    explanation: "  Add the two integers.  ",
    difficulty: "Easy",
    questionType: "mcq_single",
    changeReason: "  Improve wording  ",
    options: [
      { text: "3", isCorrect: false },
      { text: "4", isCorrect: true },
      { text: "5", isCorrect: false },
    ],
  });

  assert.equal(result.expectedLockVersion, 2);
  assert.equal(result.stem, "What is 2 + 2?");
  assert.equal(result.changeReason, "Improve wording");
  assert.equal(result.correctIndex, 1);
});

test("rejects a version without exactly one correct option", () => {
  assert.throws(
    () => normalizeQuestionVersionInput({
      expectedLockVersion: 0,
      stem: "Question",
      explanation: "Explanation",
      changeReason: "Edit",
      options: [
        { text: "A", isCorrect: true },
        { text: "B", isCorrect: true },
      ],
    }),
    (error: unknown) => error instanceof QuestionManagementError
      && error.code === "SINGLE_CORRECT_OPTION_REQUIRED",
  );
});

test("requires an editorial change reason", () => {
  assert.throws(
    () => normalizeQuestionVersionInput({
      expectedLockVersion: 0,
      stem: "Question",
      explanation: "Explanation",
      options: [
        { text: "A", isCorrect: true },
        { text: "B", isCorrect: false },
      ],
    }),
    (error: unknown) => error instanceof QuestionManagementError
      && error.code === "CHANGE_REASON_REQUIRED",
  );
});

test("maps lifecycle actions to server permissions and statuses", () => {
  assert.deepEqual(getQuestionLifecycleConfig("approve"), {
    status: "approved",
    permission: "content.questions.approve",
    requiresReason: false,
    actionKey: "content.question.approved",
  });
  assert.equal(normalizeLifecycleInput("archive", {
    expectedLockVersion: 3,
    reason: "Retired syllabus",
  }).config.status, "archived");
});

test("requires a reason when sending a question back for fixes", () => {
  assert.throws(
    () => normalizeLifecycleInput("needs-fix", { expectedLockVersion: 1 }),
    (error: unknown) => error instanceof QuestionManagementError
      && error.code === "ACTION_REASON_REQUIRED",
  );
});

test("normalizes generated questions before canonical conversion", () => {
  const normalized = normalizeGeneratedQuestionPayload({
    text: "Sample stem",
    explanation: "Sample explanation",
    difficulty: "Medium",
    options: ["One", "Two", "Three"],
    correctIndex: 1,
    topic: "Arithmetic",
  }, { itemId: "item-1", generationRunCode: "GEN-1" });

  assert.equal(normalized.correctIndex, 1);
  assert.equal(normalized.answerModel.correctOptionKey, "B");
  assert.equal(normalized.options.length, 3);
});

test("creates stable-format public question codes", () => {
  const code = questionPublicCode(
    new Date("2026-07-16T00:00:00.000Z"),
    "12345678-90ab-cdef-1234-567890abcdef",
  );
  assert.equal(code, "Q-20260716-1234567890");
});
