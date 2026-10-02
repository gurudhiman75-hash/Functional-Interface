import assert from "node:assert/strict";

import {
  applyReasoningControlledNovelMixV1,
  REASONING_V1_LIVE_NOVELTY_ACTIVATIONS,
} from "../shared/reasoning-novelty-live-mix-v1";
import {
  REASONING_V1_NOVELTY_RUNTIME_ACTIVATION_V1,
} from "../shared/reasoning-novelty-runtime-activation-v1";
import {
  reasoningNoveltyProviderSummaryV1,
} from "../shared/reasoning-novelty-provider-registry-v1";

function sourceBatch(packageId: string, count: number, difficulty: string) {
  return {
    questions: Array.from({ length: count }, (_, index) => ({
      id: packageId + ":SOURCE:" + index,
      questionId: packageId + ":SOURCE:" + index,
      packageId,
      patternId: packageId + "-SOURCE-QL-" + index,
      qlId: packageId + "-SOURCE-QL-" + index,
      cpId: packageId + "-SOURCE-CP",
      checkpointId: packageId + "-SOURCE-CP",
      stem: "Source-backed question " + index,
      text: "Source-backed question " + index,
      options: ["A", "B", "C", "D"],
      correctIndex: 0,
      correct: 0,
      answer: "A",
      explanation: "Source-backed explanation.",
      difficulty,
      difficultyLabel: difficulty,
      reviewOnly: true,
      readOnly: true,
      traceability: { source: true },
    })),
    generationContext: {
      engineId: "reasoning-v1",
      packageId,
      language: "en",
      requestedDifficulty: difficulty,
      seed: "live-mix-test",
      count,
    },
  };
}

for (const activation of REASONING_V1_LIVE_NOVELTY_ACTIVATIONS) {
  const request = {
    engineId: "reasoning-v1" as const,
    packageId: activation.packageId,
    count: 10,
    language: "en" as const,
    difficulty: activation.calibratedDifficulty,
    seed: "activation-test-" + activation.providerId,
  };
  const mixed = await applyReasoningControlledNovelMixV1(
    request,
    sourceBatch(activation.packageId, 10, activation.calibratedDifficulty),
  );
  const novel = mixed.questions.filter((question) => question.provenance === "CONTROLLED_NOVEL");
  assert.equal(novel.length, 2, activation.providerId + ": 10-question batch must contain exactly 2 novel questions");
  assert.equal(mixed.questions.length, 10);
  assert.equal((mixed.generationContext?.noveltyMix as any)?.controlledNovelShare, 0.2);
  assert.equal((mixed.generationContext?.noveltyMix as any)?.providerId, activation.providerId);
  for (const question of novel) {
    assert.equal(question.questionStudioNoveltyMixActivated, true);
    assert.equal(question.humanReviewCompleted, true);
    assert.equal(question.countsTowardAssemblyNoveltyNow, true);
    assert.equal(question.permanentQlAllocated, false);
    assert.equal(question.difficulty, activation.calibratedDifficulty);
    assert.equal(question.reviewOnly, true);
    assert.equal(question.productionReleased, false);
    assert.equal(Array.isArray(question.options), true);
    assert.equal((question.options as unknown[]).length, 4);
  }

  const scoped = await applyReasoningControlledNovelMixV1(
    { ...request, patternId: activation.packageId + "-QL-001" },
    sourceBatch(activation.packageId, 10, activation.calibratedDifficulty),
  );
  assert.equal(scoped.questions.some((question) => question.provenance === "CONTROLLED_NOVEL"), false);
  assert.equal((scoped.generationContext?.noveltyMix as any)?.blockedReason, "EXPLICIT_QL_OR_CP_SCOPE_PRESERVED");

  const localized = await applyReasoningControlledNovelMixV1(
    { ...request, language: "hi" },
    sourceBatch(activation.packageId, 10, activation.calibratedDifficulty),
  );
  assert.equal(localized.questions.some((question) => question.provenance === "CONTROLLED_NOVEL"), false);
  assert.equal((localized.generationContext?.noveltyMix as any)?.blockedReason, "SUPPORTED_LANGUAGE_NOT_REVIEWED_FOR_NOVELTY");

  const mismatchedDifficulty = activation.calibratedDifficulty === "Hard" ? "Medium" : "Hard";
  const difficultyBlocked = await applyReasoningControlledNovelMixV1(
    { ...request, difficulty: mismatchedDifficulty },
    sourceBatch(activation.packageId, 10, mismatchedDifficulty),
  );
  assert.equal(difficultyBlocked.questions.some((question) => question.provenance === "CONTROLLED_NOVEL"), false);
  assert.equal(
    (difficultyBlocked.generationContext?.noveltyMix as any)?.blockedReason,
    "REQUESTED_DIFFICULTY_DOES_NOT_MATCH_NOVELTY_FAMILY_CALIBRATION",
  );
}

const summary = reasoningNoveltyProviderSummaryV1();
assert.deepEqual(
  summary.approvedProviderIds,
  [
    "PFC-001-CONTROLLED-NOVEL",
    "ALP-001-TRANSFORMED-GAP",
    "OPS-001-INFER-THEN-FILL",
    "CLK-001-FAULTY-TIME-ANGLE",
    "CAE-001-EDGE-FAMILIES",
    "DIR-001-GRAPH-RELATIVE-PATH",
    "CAL-001-IMPLICIT-RANGE-FREQUENCY",
    "BLR-001-CODED-FILTERED-COUNT",
  ],
);
assert.equal(summary.awaitingRouteProviderIds.length, 1);
assert.deepEqual(
  summary.assemblyCreditedProviderIds,
  [
    "PFC-001-CONTROLLED-NOVEL",
    "ALP-001-TRANSFORMED-GAP",
    "OPS-001-INFER-THEN-FILL",
    "CLK-001-FAULTY-TIME-ANGLE",
    "DIR-001-GRAPH-RELATIVE-PATH",
    "CAL-001-IMPLICIT-RANGE-FREQUENCY",
  ],
);
assert.equal(REASONING_V1_NOVELTY_RUNTIME_ACTIVATION_V1.safeguards.questionBankReleaseChanged, false);
assert.equal(REASONING_V1_NOVELTY_RUNTIME_ACTIVATION_V1.safeguards.automaticStudentPublicationChanged, false);

console.log(JSON.stringify({
  status: "PASS_REASONING_NOVELTY_LIVE_MIX_20261002",
  liveProviders: REASONING_V1_NOVELTY_RUNTIME_ACTIVATION_V1.liveQuestionStudioProviders,
  awaitingRoute: REASONING_V1_NOVELTY_RUNTIME_ACTIVATION_V1.contentApprovedAwaitingQuestionStudioRoute,
  targetShare: REASONING_V1_NOVELTY_RUNTIME_ACTIVATION_V1.operatingTarget,
}, null, 2));
