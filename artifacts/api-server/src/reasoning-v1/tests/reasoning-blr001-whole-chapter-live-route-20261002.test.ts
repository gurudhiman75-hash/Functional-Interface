import assert from "node:assert/strict";

import { reasoningV1QuestionStudioAdapter } from "../../question-studio/engines/reasoning-v1-adapter";
import {
  BLR_001_STANDARD_QUESTION_STUDIO_PACKAGE,
} from "../topics/Blood-Relations/BLR-001/question-studio-whole-chapter-integration";
import {
  REASONING_V1_NOVELTY_RUNTIME_ACTIVATION_V1,
} from "../shared/reasoning-novelty-runtime-activation-v1";
import {
  reasoningNoveltyProviderByIdV1,
} from "../shared/reasoning-novelty-provider-registry-v1";

assert.equal(BLR_001_STANDARD_QUESTION_STUDIO_PACKAGE.packageId, "BLR-001");
assert.equal(BLR_001_STANDARD_QUESTION_STUDIO_PACKAGE.qlIds?.length, 35);
assert.equal(BLR_001_STANDARD_QUESTION_STUDIO_PACKAGE.cpIds?.length, 7);
assert.deepEqual(
  BLR_001_STANDARD_QUESTION_STUDIO_PACKAGE.supportedLanguages,
  ["en", "hi", "pa"],
);

const provider = reasoningNoveltyProviderByIdV1("BLR-001-CODED-FILTERED-COUNT");
assert.equal(provider.status, "APPROVED_RUNTIME");
assert.equal(provider.questionStudioNoveltyMixActivated, true);
assert.equal(provider.humanReviewRequired, false);
assert.equal(provider.countsTowardAssemblyNoveltyNow, true);

assert.ok(
  REASONING_V1_NOVELTY_RUNTIME_ACTIVATION_V1.liveQuestionStudioProviders.includes(
    "BLR-001-CODED-FILTERED-COUNT",
  ),
);
assert.equal(
  REASONING_V1_NOVELTY_RUNTIME_ACTIVATION_V1.contentApprovedAwaitingQuestionStudioRoute.includes(
    "BLR-001-CODED-FILTERED-COUNT",
  ),
  false,
);

const result = await reasoningV1QuestionStudioAdapter.generate({
  engineId: "reasoning-v1",
  packageId: "BLR-001",
  language: "en",
  difficulty: "Medium",
  count: 10,
  seed: "blr001-live-route-proof",
});

assert.equal(result.questions.length, 10);
const novel = result.questions.filter(
  (question) => question.provenance === "CONTROLLED_NOVEL",
);
assert.equal(novel.length, 2);
assert.equal((result.generationContext?.noveltyMix as any)?.controlledNovelShare, 0.2);
assert.equal(
  (result.generationContext?.noveltyMix as any)?.providerId,
  "BLR-001-CODED-FILTERED-COUNT",
);

for (const question of novel) {
  assert.equal(question.difficulty, "Medium");
  assert.equal(question.questionStudioNoveltyMixActivated, true);
  assert.equal(question.reviewOnly, true);
  assert.equal(question.productionReleased, false);
  assert.equal(question.questionBankWritable, false);
  assert.equal(question.testEligible, false);
  assert.equal(question.mockTestEligible, false);
  assert.equal(question.publiclyPublishable, false);
}

const qlScoped = await reasoningV1QuestionStudioAdapter.generate({
  engineId: "reasoning-v1",
  packageId: "BLR-001",
  patternId: "BLR-QL-026",
  language: "en",
  difficulty: "Medium",
  count: 6,
  seed: "blr001-explicit-ql-proof",
});
assert.equal(
  qlScoped.questions.some(
    (question) => question.provenance === "CONTROLLED_NOVEL",
  ),
  false,
);
assert.equal(
  (qlScoped.generationContext?.noveltyMix as any)?.blockedReason,
  "EXPLICIT_QL_OR_CP_SCOPE_PRESERVED",
);
assert.ok(qlScoped.questions.every((question) => question.qlId === "BLR-QL-026"));

const localized = await reasoningV1QuestionStudioAdapter.generate({
  engineId: "reasoning-v1",
  packageId: "BLR-001",
  language: "pa",
  difficulty: "Medium",
  count: 6,
  seed: "blr001-pa-route-proof",
});
assert.equal(
  localized.questions.some(
    (question) => question.provenance === "CONTROLLED_NOVEL",
  ),
  false,
);
assert.equal(
  (localized.generationContext?.noveltyMix as any)?.blockedReason,
  "SUPPORTED_LANGUAGE_NOT_REVIEWED_FOR_NOVELTY",
);

console.log(JSON.stringify({
  status: "PASS_BLR_001_WHOLE_CHAPTER_LIVE_ROUTE_20261002",
  permanentQlCount: 35,
  checkpointCount: 7,
  controlledNovelShare: 0.2,
  explicitQlScopeProtected: true,
  PunjabiNoveltyBlockedUntilReviewed: true,
}, null, 2));
