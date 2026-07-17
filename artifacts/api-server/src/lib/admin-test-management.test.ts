import assert from "node:assert/strict";
import test from "node:test";

import {
  TestManagementError,
  getTestLifecycleConfig,
  normalizeTestDraftInput,
  normalizeTestLifecycleInput,
  testPublicCode,
  validateTestDraftShape,
} from "./admin-test-management";

const q1 = "11111111-1111-4111-8111-111111111111";
const q2 = "22222222-2222-4222-8222-222222222222";
const examVersionId = "33333333-3333-4333-8333-333333333333";
const draftVersionId = "44444444-4444-4444-8444-444444444444";

function validDraft() {
  return {
    expectedCurrentDraftVersionId: draftVersionId,
    examVersionId,
    title: "SSC Full Mock 1",
    description: "Production mock test",
    durationMinutes: 60,
    totalMarks: 4,
    changeReason: "Initial production draft",
    instructions: { text: "Read every question carefully." },
    settings: { languageCode: "en", testType: "full_mock" },
    sections: [
      {
        clientKey: "quant",
        name: "Quantitative Aptitude",
        durationMinutes: 60,
        questions: [
          { questionVersionId: q1, marks: 2, negativeMarks: 0.5 },
          { questionVersionId: q2, marks: 2, negativeMarks: 0.5 },
        ],
      },
    ],
  };
}

test("normalizes a canonical test draft", () => {
  const result = normalizeTestDraftInput(validDraft());
  assert.equal(result.title, "SSC Full Mock 1");
  assert.equal(result.sections[0].questions.length, 2);
  assert.equal(result.sections[0].questions[0].negativeMarks, 0.5);
});

test("rejects duplicate question versions", () => {
  const input = validDraft();
  input.sections[0].questions[1].questionVersionId = q1;
  assert.throws(
    () => normalizeTestDraftInput(input),
    (error: unknown) => error instanceof TestManagementError
      && error.code === "DUPLICATE_TEST_QUESTION",
  );
});

test("reports marks mismatch", () => {
  const normalized = normalizeTestDraftInput(validDraft());
  normalized.totalMarks = 10;
  assert.equal(
    validateTestDraftShape(normalized).some((issue) => issue.code === "STRUCTURE_MARKS_MISMATCH"),
    true,
  );
});

test("maps lifecycle actions to permissions and statuses", () => {
  assert.deepEqual(getTestLifecycleConfig("approve"), {
    status: "qa_approved",
    permission: "tests.approve",
    requiresReason: false,
    actionKey: "assessment.test.qa_approved",
  });
  assert.equal(getTestLifecycleConfig("publish").permission, "tests.publish");
});

test("requires a future schedule", () => {
  assert.throws(
    () => normalizeTestLifecycleInput("schedule", {
      expectedCurrentDraftVersionId: draftVersionId,
      scheduledAt: "2020-01-01T00:00:00.000Z",
    }),
    (error: unknown) => error instanceof TestManagementError
      && error.code === "INVALID_TEST_SCHEDULE",
  );
});

test("creates stable-format public test codes", () => {
  assert.equal(
    testPublicCode(new Date("2026-07-17T00:00:00.000Z"), q1),
    "T-20260717-1111111111",
  );
});
