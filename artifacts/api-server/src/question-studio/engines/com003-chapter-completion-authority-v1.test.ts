import { strict as assert } from "node:assert";
import { COM003_DIFFICULTY_AUTHORITY_VERSION_V1 } from "../../knowledge-v1/computer-awareness/com003-difficulty-authority-v1";
import { COM003_ENGLISH_FREEZE_AUTHORITY_V2 } from "../../knowledge-v1/computer-awareness/com003-english-freeze-v2";
import { COM003_LOCALIZATION_V2_CHAPTER_FREEZE_AUTHORITY_V1 } from "../../knowledge-v1/computer-awareness/com003-localization-v2-chapter-freeze-v1";
import { COM003_CHAPTER_COMPLETION_AUTHORITY_V1 } from "./com003-chapter-completion-authority-v1";
import { knowledgeV1QuestionStudioAdapter } from "./knowledge-v1-adapter";

const authority = COM003_CHAPTER_COMPLETION_AUTHORITY_V1;
assert.equal(authority.status, "COMPLETE_STANDARD_REVIEW_ONLY");
assert.equal(authority.contentAuthority.englishFreezeAuthorityId, COM003_ENGLISH_FREEZE_AUTHORITY_V2.authorityId);
assert.equal(
  authority.contentAuthority.localizationFreezeAuthorityId,
  COM003_LOCALIZATION_V2_CHAPTER_FREEZE_AUTHORITY_V1.authorityId,
);
assert.equal(authority.contentAuthority.difficultyAuthorityVersion, COM003_DIFFICULTY_AUTHORITY_VERSION_V1);
assert.equal(authority.contentAuthority.qlCount, 19);
assert.equal(authority.contentAuthority.cpCount, 4);
assert.equal(authority.contentAuthority.englishQuestionCount, 228);
assert.equal(authority.contentAuthority.hindiQuestionCount, 228);
assert.equal(authority.contentAuthority.punjabiQuestionCount, 228);
assert.equal(authority.contentAuthority.questionLanguageArtifactCount, 684);
assert.deepEqual(authority.contentAuthority.languages, ["en", "hi", "pa"]);
assert.equal(authority.difficultyAuthorization.filterAuthorizedInReviewOnly, true);
assert.deepEqual(authority.difficultyAuthorization.supportedDifficulties, ["Easy", "Medium"]);
assert.equal(authority.difficultyAuthorization.hardDifficultyAuthorized, false);
assert.equal(authority.difficultyAuthorization.productionDifficultyClaimAuthorized, false);

for (const [label, value] of Object.entries(authority.remainingLocks)) {
  assert.equal(value, false, `COM-003 completion must keep ${label}=false`);
}

const packages = knowledgeV1QuestionStudioAdapter.listPackages();
const pkg = packages.find((candidate) => candidate.packageId === "COM-003");
assert.ok(pkg, "COM-003 must be registered in knowledge-v1 Question Studio");
assert.equal(pkg.runtimeMode, "review-only");
assert.equal(pkg.enabled, true);
assert.equal(pkg.lifecycleStage, "BANK_ONLY");
assert.equal(pkg.difficultyFilterSupported, true);
assert.deepEqual(pkg.supportedDifficulties, ["Easy", "Medium"]);
assert.equal(pkg.questionBankStatus, "READY_FOR_STORAGE");
assert.equal(pkg.questionBankWritable, true);
assert.equal(pkg.questionBankAcceptanceMode, "BANK_ONLY");
assert.equal(pkg.metadata?.englishFreezeAuthorityId, authority.contentAuthority.englishFreezeAuthorityId);
assert.equal(pkg.metadata?.localizationFreezeAuthorityId, authority.contentAuthority.localizationFreezeAuthorityId);
assert.equal(pkg.metadata?.difficultyClassifierVersion, authority.contentAuthority.difficultyAuthorityVersion);
assert.equal(pkg.metadata?.productionDifficultyClaimsAuthorized, false);
assert.equal(pkg.metadata?.reviewOnly, false);
assert.equal(pkg.metadata?.humanReviewApproved, true);

for (const [label, value] of [
  ["testEligible", pkg.testEligible],
  ["mockTestEligible", pkg.mockTestEligible],
  ["publiclyPublishable", pkg.publiclyPublishable],
  ["automaticStudentPublication", pkg.automaticStudentPublication],
  ["productionReleaseAuthorized", pkg.productionReleaseAuthorized],
] as const) {
  assert.equal(value, false, `completed COM-003 REVIEW_ONLY must keep ${label}=false`);
}

for (const language of ["en", "hi", "pa"] as const) {
  const generated = await knowledgeV1QuestionStudioAdapter.generate({
    packageId: "COM-003",
    runtimeMode: "review-only",
    language,
    difficulty: "Mixed",
    seed: `com003-completion-v1-${language}`,
    count: 12,
  });
  assert.equal(generated.questions.length, 12);
  assert.equal(generated.generationContext?.englishFreezeAuthorityId, authority.contentAuthority.englishFreezeAuthorityId);
  assert.equal(generated.generationContext?.localizationFreezeAuthorityId, authority.contentAuthority.localizationFreezeAuthorityId);
  assert.equal(generated.generationContext?.difficultyClassifierVersion, authority.contentAuthority.difficultyAuthorityVersion);
  assert.equal(generated.generationContext?.stage, "BANK_ONLY");
  assert.equal(generated.generationContext?.questionBankWritable, true);
  assert.equal(generated.generationContext?.questionBankAcceptanceMode, "BANK_ONLY");
  assert.equal(generated.generationContext?.testEligible, false);
  assert.equal(generated.generationContext?.mockTestEligible, false);
  assert.equal(generated.generationContext?.publiclyPublishable, false);
  assert.equal(generated.generationContext?.productionReleaseAuthorized, false);
  assert.ok(generated.questions.every((question: any) => question.registrationStatus === "REGISTERED_BANK_ONLY_INTERNAL"));
  assert.ok(generated.questions.every((question: any) => question.readOnly === true));
  assert.ok(generated.questions.every((question: any) => question.questionBankWritable === true));
}

for (const difficulty of ["Easy", "Medium"] as const) {
  const generated = await knowledgeV1QuestionStudioAdapter.generate({
    packageId: "COM-003",
    runtimeMode: "review-only",
    language: "en",
    difficulty,
    seed: `com003-completion-v1-${difficulty.toLowerCase()}`,
    count: 12,
  });
  assert.equal(generated.questions.length, 12);
  assert.ok(generated.questions.every((question: any) => question.difficulty === difficulty));
  assert.equal(generated.generationContext?.difficultyFilterApplied, true);
}

await assert.rejects(
  knowledgeV1QuestionStudioAdapter.generate({
    packageId: "COM-003",
    runtimeMode: "review-only",
    language: "en",
    difficulty: "Hard",
    seed: "com003-completion-v1-hard",
    count: 1,
  }),
  /Hard difficulty is not authorized/,
);

console.log("[COM003-CHAPTER-COMPLETION-V1]", {
  authorityId: authority.authorityId,
  status: authority.status,
  questionLanguageArtifactCount: authority.contentAuthority.questionLanguageArtifactCount,
  supportedDifficulties: authority.difficultyAuthorization.supportedDifficulties,
  hardDifficultyAuthorized: authority.difficultyAuthorization.hardDifficultyAuthorized,
  lifecycle: authority.operationalLifecycle.lifecycleId,
  nextLifecycleGate: authority.nextLifecycleGate,
});
