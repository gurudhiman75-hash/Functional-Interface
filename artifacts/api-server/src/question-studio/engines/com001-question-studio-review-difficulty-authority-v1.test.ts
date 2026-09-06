import { strict as assert } from "node:assert";

import { COM001_DIFFICULTY_CLASSIFIER_VERSION_V2 } from "../../knowledge-v1/computer-awareness/com001-difficulty-routing-v2";
import { listQuestionStudioPackages } from "../engine-registry";
import { QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";
import { COM001_QUESTION_STUDIO_REVIEW_DIFFICULTY_AUTHORITY_V1 } from "./com001-question-studio-review-difficulty-authority-v1";
import { knowledgeV1Com001QuestionStudioAdapter } from "./knowledge-v1-com001-adapter";

const authority = COM001_QUESTION_STUDIO_REVIEW_DIFFICULTY_AUTHORITY_V1;
const lifecycle = QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1;

assert.equal(authority.status, "REVIEW_ONLY_DIFFICULTY_ROUTING_APPROVED");
assert.equal(authority.engineId, "knowledge-v1");
assert.equal(authority.packageId, "COM-001");
assert.equal(authority.runtimeMode, "review-only");
assert.equal(authority.contentAuthorityVersion, "V2");
assert.equal(authority.contentAuthorities.learnerFacingContentChangedForDifficultyRouting, false);
assert.equal(authority.classifier.version, COM001_DIFFICULTY_CLASSIFIER_VERSION_V2);
assert.deepEqual(authority.classifier.supportedDifficulties, ["Easy", "Medium", "Hard"]);
assert.equal(authority.classifier.mixedModeSupported, true);
assert.equal(authority.classifier.reviewOnlyDifficultyFilterAuthorized, true);
assert.equal(authority.classifier.productionDifficultyClaimsAuthorized, false);
assert.equal(authority.classifier.unsupportedQlDifficultyCombinationMustFail, true);
assert.deepEqual(authority.classifierAudit.distribution, { Easy: 146, Medium: 134, Hard: 80 });
assert.equal(authority.classifierAudit.auditedEnglishV2Questions, 360);
assert.equal(authority.exactActivationProof.contentEngineRunNumber, 168);
assert.equal(authority.exactActivationProof.integratedAdminRunNumber, 8970);
assert.equal(authority.reviewerSurface.difficultySelectorVisible, true);
assert.equal(authority.reviewerSurface.qlAwareDifficultyChoices, true);
assert.equal(authority.reviewerSurface.topologyVisiblePerItem, true);
assert.equal(authority.reviewerSurface.rationaleVisiblePerItem, true);

// Historical difficulty authority remains pinned to the review-only checkpoint.
assert.equal(authority.editorSafety.approvalDisposition, "REVIEW_ONLY");
assert.equal(authority.editorSafety.questionBankWritable, false);
assert.equal(authority.editorSafety.testEligible, false);
assert.equal(authority.editorSafety.mockTestEligible, false);
assert.equal(authority.editorSafety.publiclyPublishable, false);
assert.equal(authority.editorSafety.productionDifficultyClaimsAuthorized, false);
assert.equal(authority.editorSafety.productionReleaseAuthorized, false);

// Current live package uses the standard lifecycle; difficulty remains a review classifier only.
const pkg = listQuestionStudioPackages().find((entry) => entry.packageId === "COM-001");
assert.ok(pkg);
assert.equal(pkg.runtimeMode, "review-only");
assert.equal(pkg.metadata?.difficultyFilterSupported, true);
assert.equal(pkg.metadata?.difficultyClassifierVersion, COM001_DIFFICULTY_CLASSIFIER_VERSION_V2);
assert.equal(pkg.metadata?.productionDifficultyClaimsAuthorized, false);
assert.equal(pkg.metadata?.lifecycleId, lifecycle.lifecycleId);
assert.equal(pkg.metadata?.stage, "BANK_ONLY");
assert.equal(pkg.questionBankStatus, lifecycle.questionBankStatus);
assert.equal(pkg.metadata?.questionBankWritable, true);
assert.equal(pkg.metadata?.questionBankAcceptanceMode, "BANK_ONLY");
assert.equal(pkg.metadata?.questionBankAcceptanceAuthority, lifecycle.lifecycleId);
assert.equal(pkg.metadata?.testEligible, false);
assert.equal(pkg.metadata?.mockTestEligible, false);
assert.equal(pkg.publiclyPublishable, false);
assert.equal(pkg.metadata?.productionReleaseAuthorized, false);

const base = {
  engineId: "knowledge-v1" as const,
  packageId: "COM-001",
  runtimeMode: "review-only",
  language: "en" as const,
  count: 12,
};

const mixedRequest = { ...base, difficulty: "Mixed" as const, seed: "difficulty-authority:mixed" };
const mixed = await knowledgeV1Com001QuestionStudioAdapter.generate(mixedRequest);
const mixedReplay = await knowledgeV1Com001QuestionStudioAdapter.generate(mixedRequest);
assert.deepEqual(mixed, mixedReplay);
assert.equal(mixed.questions.length, 12);
assert.equal(mixed.generationContext?.difficultyFilterApplied, false);
assert.equal(mixed.generationContext?.requestedDifficulty, "Mixed");
assert.equal(mixed.generationContext?.productionDifficultyClaimAuthorized, false);
assert.equal(mixed.generationContext?.lifecycleId, lifecycle.lifecycleId);
assert.equal(mixed.generationContext?.questionBankWritable, true);
assert.equal(mixed.generationContext?.questionBankAcceptanceMode, "BANK_ONLY");
assert.equal(mixed.generationContext?.testEligible, false);
assert.equal(mixed.generationContext?.publiclyPublishable, false);
assert.equal(
  new Set(mixed.questions.map((question) => String(question.difficulty))).size >= 2,
  true,
  "Mixed authority sample should expose more than one topology difficulty",
);

for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
  const request = { ...base, difficulty, seed: `difficulty-authority:${difficulty}` };
  const first = await knowledgeV1Com001QuestionStudioAdapter.generate(request);
  const replay = await knowledgeV1Com001QuestionStudioAdapter.generate(request);
  assert.deepEqual(first, replay, `${difficulty}: deterministic review filter changed`);
  assert.equal(first.questions.length, 12);
  assert.equal(first.generationContext?.difficultyFilterApplied, true);
  assert.equal(first.generationContext?.requestedDifficulty, difficulty);
  assert.equal(first.generationContext?.productionDifficultyClaimAuthorized, false);
  for (const rawQuestion of first.questions) {
    const question = rawQuestion as Record<string, any>;
    assert.equal(question.difficulty, difficulty);
    assert.equal(question.difficultyDecisionV2?.difficulty, difficulty);
    assert.equal(question.difficultyDecisionV2?.classifierVersion, COM001_DIFFICULTY_CLASSIFIER_VERSION_V2);
    assert.equal(question.difficultyDecisionV2?.productionClaimAuthorized, false);
    assert.equal(question.questionStudioReview?.difficultyFilterApplied, true);
    assert.equal(question.questionStudioReview?.requestedDifficulty, difficulty);
    assert.equal(question.questionStudioReview?.classifiedDifficulty, difficulty);
    assert.equal(question.questionStudioReview?.productionDifficultyClaimAuthorized, false);
    assert.equal(question.lifecycleId, lifecycle.lifecycleId);
    assert.equal(question.questionBankStatus, lifecycle.questionBankStatus);
    assert.equal(question.questionBankWritable, true);
    assert.equal(question.questionBankAcceptanceMode, "BANK_ONLY");
    assert.equal(question.questionBankAcceptanceAuthority, lifecycle.lifecycleId);
    assert.equal(question.testEligible, false);
    assert.equal(question.mockTestEligible, false);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.automaticStudentPublication, false);
    assert.equal(question.productionReleaseAuthorized, false);
  }
}

await assert.rejects(
  () => knowledgeV1Com001QuestionStudioAdapter.generate({
    ...base,
    patternId: "COM-001-QL-007",
    difficulty: "Easy",
    count: 1,
    seed: "difficulty-authority:unsupported",
  }),
  /does not produce Easy questions/,
);
await assert.rejects(
  () => knowledgeV1Com001QuestionStudioAdapter.generate({
    ...base,
    runtimeMode: "production",
    difficulty: "Easy",
    count: 1,
    seed: "difficulty-authority:production-block",
  }),
  /only supports review-only runtime/,
);
