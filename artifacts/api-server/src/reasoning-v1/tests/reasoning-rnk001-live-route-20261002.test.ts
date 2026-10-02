import assert from "node:assert/strict";

import { reasoningV1QuestionStudioAdapter } from "../../question-studio/engines/reasoning-v1-adapter";
import {
  RNK001_STANDARD_QUESTION_STUDIO_PACKAGE_V1,
} from "../topics/Ranking-and-Order/RNK-001/question-studio-integration";
import {
  REASONING_V1_NOVELTY_RUNTIME_ACTIVATION_V1,
} from "../shared/reasoning-novelty-runtime-activation-v1";
import {
  reasoningNoveltyProviderByIdV1,
} from "../shared/reasoning-novelty-provider-registry-v1";

assert.equal(RNK001_STANDARD_QUESTION_STUDIO_PACKAGE_V1.packageId, "RNK-001");
assert.equal(RNK001_STANDARD_QUESTION_STUDIO_PACKAGE_V1.qlIds?.length, 42);
assert.equal(RNK001_STANDARD_QUESTION_STUDIO_PACKAGE_V1.cpIds?.length, 7);
assert.deepEqual(RNK001_STANDARD_QUESTION_STUDIO_PACKAGE_V1.supportedLanguages, ["en"]);
assert.equal(RNK001_STANDARD_QUESTION_STUDIO_PACKAGE_V1.questionBankWritable, false);
assert.equal(RNK001_STANDARD_QUESTION_STUDIO_PACKAGE_V1.testEligible, false);
assert.equal(RNK001_STANDARD_QUESTION_STUDIO_PACKAGE_V1.mockTestEligible, false);
assert.equal(RNK001_STANDARD_QUESTION_STUDIO_PACKAGE_V1.publiclyPublishable, false);

const provider = reasoningNoveltyProviderByIdV1("RNK-001-CROSS-FAMILY-CASELET");
assert.equal(provider.status, "APPROVED_RUNTIME");
assert.equal(provider.questionStudioNoveltyMixActivated, true);
assert.equal(provider.humanReviewRequired, false);
assert.equal(provider.countsTowardAssemblyNoveltyNow, true);

assert.ok(
  REASONING_V1_NOVELTY_RUNTIME_ACTIVATION_V1.liveQuestionStudioProviders.includes(
    "RNK-001-CROSS-FAMILY-CASELET",
  ),
);
assert.equal(
  REASONING_V1_NOVELTY_RUNTIME_ACTIVATION_V1.contentApprovedAwaitingQuestionStudioRoute.length,
  0,
);

const mixed = await reasoningV1QuestionStudioAdapter.generate({
  engineId: "reasoning-v1",
  packageId: "RNK-001",
  language: "en",
  difficulty: "Medium",
  count: 10,
  seed: "rnk001-live-route-proof",
});

assert.equal(mixed.questions.length, 10);
const novel = mixed.questions.filter(
  (question) => question.provenance === "CONTROLLED_NOVEL",
);
assert.equal(novel.length, 2);
assert.equal((mixed.generationContext?.noveltyMix as any)?.controlledNovelShare, 0.2);
assert.equal(
  (mixed.generationContext?.noveltyMix as any)?.providerId,
  "RNK-001-CROSS-FAMILY-CASELET",
);

for (const question of novel) {
  assert.equal(question.difficulty, "Medium");
  assert.equal(question.questionStudioNoveltyMixActivated, true);
  assert.equal(question.humanReviewCompleted, true);
  assert.equal(question.reviewOnly, true);
  assert.equal(question.productionReleased, false);
  assert.equal(question.questionBankWritable, false);
  assert.equal(question.testEligible, false);
  assert.equal(question.mockTestEligible, false);
  assert.equal(question.publiclyPublishable, false);
  assert.equal(Array.isArray(question.options), true);
  assert.equal((question.options as unknown[]).length, 4);
}

const scoped = await reasoningV1QuestionStudioAdapter.generate({
  engineId: "reasoning-v1",
  packageId: "RNK-001",
  patternId: "RNK-QL-027",
  language: "en",
  count: 4,
  seed: "rnk001-explicit-ql-proof",
});

assert.equal(
  scoped.questions.some((question) => question.provenance === "CONTROLLED_NOVEL"),
  false,
);
assert.equal(
  (scoped.generationContext?.noveltyMix as any)?.blockedReason,
  "EXPLICIT_QL_OR_CP_SCOPE_PRESERVED",
);
assert.ok(scoped.questions.every((question) => question.qlId === "RNK-QL-027"));

await assert.rejects(
  () => reasoningV1QuestionStudioAdapter.generate({
    engineId: "reasoning-v1",
    packageId: "RNK-001",
    language: "hi",
    difficulty: "Medium",
    count: 2,
    seed: "rnk001-hi-block-proof",
  }),
  /English-only until Hindi\/Punjabi human review is approved/u,
);

console.log(JSON.stringify({
  status: "PASS_RNK_001_LIVE_ROUTE_20261002",
  permanentQlCount: 42,
  checkpointCount: 7,
  controlledNovelShare: 0.2,
  explicitQlScopeProtected: true,
  englishOnlyActivation: true,
  downstreamReleaseLocked: true,
}, null, 2));
