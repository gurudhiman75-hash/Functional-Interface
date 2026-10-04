import assert from "node:assert/strict";
import test from "node:test";

import {
  QuestionManagementError,
  assertQuestionPublishable,
  getPublicationIssues,
  getQuestionLifecycleConfig,
  normalizeLifecycleInput,
  normalizeQuestionTaxonomyInput,
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

test("normalizes taxonomy and includes the primary node", () => {
  const result = normalizeQuestionTaxonomyInput({
    expectedLockVersion: 4,
    examVersionId: "11111111-1111-4111-8111-111111111111",
    primaryTaxonomyNodeId: "22222222-2222-4222-8222-222222222222",
    taxonomyNodeIds: [
      "33333333-3333-4333-8333-333333333333",
      "22222222-2222-4222-8222-222222222222",
    ],
  });

  assert.equal(result.expectedLockVersion, 4);
  assert.equal(result.taxonomyNodeIds.length, 2);
  assert.ok(result.taxonomyNodeIds.includes(result.primaryTaxonomyNodeId));
});

test("maps lifecycle actions to permissions and statuses", () => {
  assert.deepEqual(getQuestionLifecycleConfig("approve"), {
    status: "approved",
    permission: "content.questions.approve",
    requiresReason: false,
    actionKey: "content.question.approved",
  });
  assert.equal(getQuestionLifecycleConfig("publish").status, "published");
  assert.equal(normalizeLifecycleInput("archive", {
    expectedLockVersion: 3,
    reason: "Retired syllabus",
  }).config.status, "archived");
});

test("requires a reason when unpublishing", () => {
  assert.throws(
    () => normalizeLifecycleInput("unpublish", { expectedLockVersion: 1 }),
    (error: unknown) => error instanceof QuestionManagementError
      && error.code === "ACTION_REASON_REQUIRED",
  );
});

test("reports all publication blockers", () => {
  const issues = getPublicationIssues({
    status: "draft",
    approvedVersionId: null,
    examVersionId: null,
    primaryTaxonomyNodeId: null,
    taxonomyNodeIds: [],
    stem: "",
    explanation: "",
    optionCount: 1,
    correctOptionCount: 0,
  });

  assert.ok(issues.length >= 8);
  assert.throws(
    () => assertQuestionPublishable({
      status: "draft",
      approvedVersionId: null,
      examVersionId: null,
      primaryTaxonomyNodeId: null,
      taxonomyNodeIds: [],
      stem: "",
      explanation: "",
      optionCount: 1,
      correctOptionCount: 0,
    }),
    (error: unknown) => error instanceof QuestionManagementError
      && error.code === "QUESTION_NOT_PUBLISHABLE",
  );
});

test("accepts a complete approved question for publication", () => {
  assert.doesNotThrow(() => assertQuestionPublishable({
    status: "approved",
    approvedVersionId: "11111111-1111-4111-8111-111111111111",
    examVersionId: "22222222-2222-4222-8222-222222222222",
    primaryTaxonomyNodeId: "33333333-3333-4333-8333-333333333333",
    taxonomyNodeIds: ["33333333-3333-4333-8333-333333333333"],
    stem: "Question",
    explanation: "Explanation",
    optionCount: 4,
    correctOptionCount: 1,
  }));
});

test("normalizes generated questions before canonical conversion", () => {
  const normalized = normalizeGeneratedQuestionPayload({
    text: "Sample stem",
    explanation: "Sample explanation",
    difficulty: "Medium",
    options: ["One", "Two", "Three"],
    correctIndex: 1,
    topic: "Arithmetic",
    questionBankStatus: "STORED",
    questionBankWritable: true,
    questionBankAcceptanceMode: "FULL_RELEASE",
    testEligibility: "ELIGIBLE",
    publiclyPublishable: true,
  }, { itemId: "item-1", generationRunCode: "GEN-1" });

  assert.equal(normalized.correctIndex, 1);
  assert.equal(normalized.answerModel.correctOptionKey, "B");
  assert.equal(normalized.options.length, 3);
});

test("preserves linked passage stimulus during Question Bank conversion", () => {
  const normalized = normalizeGeneratedQuestionPayload({
    text: "What is the author's main conclusion?",
    explanation: "The final paragraph states the conclusion.",
    difficulty: "Hard",
    options: ["A", "B", "C", "D"],
    correctIndex: 2,
    topic: "Reading Comprehension",
    passageId: "BANK-MAINS-RC-017",
    passageTitle: "Credit growth and risk",
    passage: "Banks can expand credit responsibly only when underwriting discipline keeps pace with balance-sheet growth.",
    questionBankStatus: "STORED",
    questionBankWritable: true,
    questionBankAcceptanceMode: "FULL_RELEASE",
    testEligibility: "ELIGIBLE",
    publiclyPublishable: true,
  }, { itemId: "item-rc-1", generationRunCode: "GEN-RC-1" });

  const generation = normalized.answerModel.generation as Record<string, unknown>;
  assert.deepEqual(generation.sharedStimulus, {
    id: "BANK-MAINS-RC-017",
    kind: "passage",
    title: "Credit growth and risk",
    text: "Banks can expand credit responsibly only when underwriting discipline keeps pace with balance-sheet growth.",
    imageUrl: null,
  });
  assert.equal(generation.passageId, "BANK-MAINS-RC-017");
});

test("creates stable-format public question codes", () => {
  const code = questionPublicCode(
    new Date("2026-07-16T00:00:00.000Z"),
    "12345678-90ab-cdef-1234-567890abcdef",
  );
  assert.equal(code, "Q-20260716-1234567890");
});
