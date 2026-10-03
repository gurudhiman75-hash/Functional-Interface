import assert from "node:assert/strict";

import { reasoningV1QuestionStudioAdapter } from "../../question-studio/engines/reasoning-v1-adapter";

const packages = reasoningV1QuestionStudioAdapter.listPackages();
const rnk = packages.find((entry) => entry.packageId === "RNK-001");

assert.ok(rnk, "RNK-001 must be registered in the multi-engine Reasoning Question Studio adapter.");
assert.equal(rnk.enabled, true);
assert.deepEqual(rnk.supportedLanguages, ["en"]);
assert.deepEqual(rnk.supportedDifficulties, ["Easy", "Medium", "Hard"]);
assert.deepEqual(rnk.cpIds, [
  "RNK-CP-001",
  "RNK-CP-002",
  "RNK-CP-003",
  "RNK-CP-004",
  "RNK-CP-005",
  "RNK-CP-006",
  "RNK-CP-007",
]);
assert.equal(rnk.lifecycleStage, "REVIEW_ONLY");
assert.equal(rnk.questionBankWritable, false);
assert.equal(rnk.testEligible, false);
assert.equal(rnk.publiclyPublishable, false);
assert.equal(rnk.metadata?.permanentQlCount, 42);
assert.equal(rnk.metadata?.permanentQlRange, "RNK-QL-001..042");
assert.equal(rnk.metadata?.nextAvailablePermanentQl, "RNK-QL-043");

const mixed = await reasoningV1QuestionStudioAdapter.generate({
  engineId: "reasoning-v1",
  packageId: "RNK-001",
  language: "en",
  difficulty: "Medium",
  count: 10,
  seed: "rnk-live-activation-proof",
});

assert.equal(mixed.questions.length, 10);
const novel = mixed.questions.filter(
  (question) => question.provenance === "CONTROLLED_NOVEL",
);
assert.equal(novel.length, 2, "RNK chapter-wide Medium batch must use the governed 80/20 mix.");
assert.equal((mixed.generationContext?.noveltyMix as any)?.providerId, "RNK-001-CROSS-FAMILY-CASELET");
assert.equal((mixed.generationContext?.noveltyMix as any)?.controlledNovelShare, 0.2);
assert.equal((mixed.generationContext?.noveltyMix as any)?.withinOperatingBand, true);

for (const question of novel) {
  assert.equal(question.qlId, null);
  assert.equal(question.permanentQlAllocated, false);
  assert.equal(question.difficulty, "Medium");
  assert.equal(question.questionStudioNoveltyMixActivated, true);
  assert.equal(question.humanReviewCompleted, true);
  assert.equal(question.countsTowardAssemblyNoveltyNow, true);
  assert.equal(question.reviewOnly, true);
  assert.equal(question.productionReleased, false);
}

const sourceBacked = mixed.questions.filter(
  (question) => question.provenance !== "CONTROLLED_NOVEL",
);
assert.equal(sourceBacked.length, 8);
for (const question of sourceBacked) {
  assert.match(String(question.qlId), /^RNK-QL-\d{3}$/u);
  assert.match(String(question.cpId), /^RNK-CP-00[1-7]$/u);
  assert.equal(question.reviewOnly, true);
  assert.equal(question.questionBankWritable, false);
  assert.equal(question.testEligible, false);
  assert.equal(question.publiclyPublishable, false);
}

const scoped = await reasoningV1QuestionStudioAdapter.generate({
  engineId: "reasoning-v1",
  packageId: "RNK-001",
  patternId: "RNK-CP-004",
  language: "en",
  difficulty: "Medium",
  count: 4,
  seed: "rnk-explicit-cp-scope-proof",
});

assert.equal(scoped.questions.length, 4);
assert.equal(
  scoped.questions.some((question) => question.provenance === "CONTROLLED_NOVEL"),
  false,
);
assert.equal(
  (scoped.generationContext?.noveltyMix as any)?.blockedReason,
  "EXPLICIT_QL_OR_CP_SCOPE_PRESERVED",
);
assert.ok(scoped.questions.every((question) => question.cpId === "RNK-CP-004"));

await assert.rejects(
  () => reasoningV1QuestionStudioAdapter.generate({
    engineId: "reasoning-v1",
    packageId: "RNK-001",
    language: "hi",
    difficulty: "Medium",
    count: 1,
  }),
  /English-only/u,
);

console.log(JSON.stringify({
  status: "PASS_RNK_001_QUESTION_STUDIO_NOVELTY_ACTIVATION_20261002",
  permanentQlCount: rnk.metadata?.permanentQlCount,
  liveProvider: (mixed.generationContext?.noveltyMix as any)?.providerId,
  controlledNovelCount: novel.length,
  sourceBackedCount: sourceBacked.length,
  explicitCpScopeProtected: true,
  englishOnlyActivation: true,
}, null, 2));
