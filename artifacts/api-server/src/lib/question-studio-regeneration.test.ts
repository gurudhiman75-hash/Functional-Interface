import assert from "node:assert/strict";
import test from "node:test";

import {
  buildRegenerationPayload,
  buildRegenerationRequest,
  getRegenerationEligibility,
  type RegenerationSource,
} from "./question-studio-regeneration";

const source: RegenerationSource = {
  itemId: "11111111-1111-4111-8111-111111111111",
  status: "needs_fix",
  acceptedQuestionId: null,
  currentVersionNumber: 2,
  runCode: "GEN-TEST",
  requestSnapshot: {
    packageId: "PCT-003",
    topic: "Arithmetic",
    subtopic: "Percentage",
    difficulty: "Hard",
    language: "en",
  },
  payload: {
    packageId: "PCT-003",
    patternId: "PCT-003",
    canonicalProblemId: "PCT-003-CP-04",
    questionLanguageId: "PCT-003-QL-009",
    difficultyLabel: "Hard",
    language: "en",
  },
};

test("allows reviewable items but protects converted items", () => {
  assert.deepEqual(getRegenerationEligibility("needs_fix", null), { eligible: true });
  assert.equal(getRegenerationEligibility("approved", null).eligible, false);
  assert.equal(
    getRegenerationEligibility("needs_fix", "22222222-2222-4222-8222-222222222222").eligible,
    false,
  );
});

test("rebuilds the original generation scope with a fresh seed", () => {
  const request = buildRegenerationRequest(source, "fresh-seed");
  assert.equal(request.packageId, "PCT-003");
  assert.equal(request.canonicalProblemId, "PCT-003-CP-04");
  assert.equal(request.questionLanguageId, "PCT-003-QL-009");
  assert.equal(request.difficulty, "Hard");
  assert.equal(request.language, "en");
  assert.equal(request.seed, "fresh-seed");
  assert.equal(request.count, 1);
});

test("records regeneration provenance in the replacement payload", () => {
  const payload = buildRegenerationPayload(
    { stem: "Replacement question", options: ["1", "2"], correctIndex: 1 },
    { seed: "fresh-seed" },
    source,
    "Incorrect wording",
    "2026-07-19T10:00:00.000Z",
  );

  assert.equal(payload.validationResult, "pending");
  assert.deepEqual(payload.regeneration, {
    sourceVersionNumber: 2,
    sourceRunCode: "GEN-TEST",
    reason: "Incorrect wording",
    regeneratedAt: "2026-07-19T10:00:00.000Z",
  });
});
