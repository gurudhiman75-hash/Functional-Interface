import assert from "node:assert/strict";
import test from "node:test";

import { TestSeriesError, normalizeTestSeriesInput } from "./admin-test-series";

const EXAM_VERSION_ID = "11111111-1111-4111-8111-111111111111";
const TEST_A = "22222222-2222-4222-8222-222222222222";
const TEST_B = "33333333-3333-4333-8333-333333333333";

function validInput() {
  return {
    examVersionId: EXAM_VERSION_ID,
    code: "SSC-CGL-FULL",
    name: "SSC CGL Full Test Series",
    status: "draft",
    description: "Progressive full-length tests.",
    validityDays: 365,
    progressionRules: { requireSequentialCompletion: true, minimumScorePercent: 40 },
    settings: {},
    changeReason: "Create canonical series",
    items: [
      { testId: TEST_A, accessMode: "free", availability: { unlockAfterPrevious: false } },
      { testId: TEST_B, accessMode: "included", availability: { unlockAfterPrevious: true } },
    ],
  };
}

test("normalizes ordered Test Series membership", () => {
  const input = normalizeTestSeriesInput(validInput());
  assert.equal(input.items.length, 2);
  assert.equal(input.items[0]?.accessMode, "free");
  assert.equal(input.validityDays, 365);
});

test("rejects duplicate test membership", () => {
  const input = validInput();
  input.items[1].testId = TEST_A;
  assert.throws(
    () => normalizeTestSeriesInput(input),
    (error: unknown) => error instanceof TestSeriesError && error.code === "DUPLICATE_SERIES_TEST",
  );
});

test("rejects active empty series", () => {
  const input = validInput();
  input.status = "active";
  input.items = [];
  assert.throws(
    () => normalizeTestSeriesInput(input),
    (error: unknown) => error instanceof TestSeriesError && error.code === "ACTIVE_SERIES_EMPTY",
  );
});

test("rejects invalid validity window", () => {
  const input = validInput();
  input.validityDays = 0;
  assert.throws(
    () => normalizeTestSeriesInput(input),
    (error: unknown) => error instanceof TestSeriesError && error.code === "INVALID_SERIES_VALIDITY",
  );
});
