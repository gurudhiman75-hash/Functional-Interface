import assert from "node:assert/strict";
import test from "node:test";

import {
  TestSeriesError,
  normalizeTestSeriesInput,
  seriesReadiness,
} from "./admin-test-series";

const examVersionId = "11111111-1111-4111-8111-111111111111";
const firstTestId = "22222222-2222-4222-8222-222222222222";
const secondTestId = "33333333-3333-4333-8333-333333333333";

function validInput() {
  return {
    examVersionId,
    code: "ssc-cgl-foundation",
    name: "SSC CGL Foundation Series",
    description: "A structured sequence of full-length mocks.",
    availabilityStartAt: "2026-08-01T00:00:00.000Z",
    availabilityEndAt: "2026-12-31T23:59:59.000Z",
    progressionMode: "score_gated",
    completionThreshold: 40,
    configuration: { allowRetakes: true },
    changeReason: "Create the canonical launch series",
    items: [
      { testId: firstTestId, isRequired: true, minimumScore: 40 },
      { testId: secondTestId, isRequired: true, unlockAt: "2026-08-08T00:00:00.000Z" },
    ],
  };
}

test("normalizes an immutable score-gated series version", () => {
  const result = normalizeTestSeriesInput(validInput());
  assert.equal(result.code, "SSC-CGL-FOUNDATION");
  assert.equal(result.progressionMode, "score_gated");
  assert.equal(result.completionThreshold, 40);
  assert.equal(result.items.length, 2);
  assert.equal(result.items[0]?.minimumScore, 40);
});

test("rejects duplicate test membership", () => {
  const input = validInput();
  input.items[1]!.testId = firstTestId;
  assert.throws(
    () => normalizeTestSeriesInput(input),
    (error: unknown) => error instanceof TestSeriesError && error.code === "TEST_SERIES_TEST_DUPLICATE",
  );
});

test("requires a threshold for score-gated progression", () => {
  const input = validInput();
  input.completionThreshold = null as unknown as number;
  assert.throws(
    () => normalizeTestSeriesInput(input),
    (error: unknown) => error instanceof TestSeriesError && error.code === "TEST_SERIES_THRESHOLD_REQUIRED",
  );
});

test("rejects an invalid availability window", () => {
  const input = validInput();
  input.availabilityEndAt = "2026-07-01T00:00:00.000Z";
  assert.throws(
    () => normalizeTestSeriesInput(input),
    (error: unknown) => error instanceof TestSeriesError && error.code === "TEST_SERIES_WINDOW_INVALID",
  );
});

test("reports release blockers for non-approved member tests", () => {
  const readiness = seriesReadiness({
    itemCount: 2,
    availabilityStartAt: "2026-08-01T00:00:00.000Z",
    availabilityEndAt: "2030-12-31T23:59:59.000Z",
    memberStatuses: ["qa_approved", "needs_fix"],
  });
  assert.equal(readiness.ready, false);
  assert.match(readiness.blockers.join(" "), /not QA approved/i);
});

test("marks a released composition ready", () => {
  const readiness = seriesReadiness({
    itemCount: 2,
    availabilityStartAt: "2026-08-01T00:00:00.000Z",
    availabilityEndAt: "2030-12-31T23:59:59.000Z",
    memberStatuses: ["qa_approved", "live"],
  });
  assert.equal(readiness.ready, true);
  assert.deepEqual(readiness.blockers, []);
});
