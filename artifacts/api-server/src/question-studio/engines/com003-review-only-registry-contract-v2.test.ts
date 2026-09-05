import { strict as assert } from "node:assert";
import { COM003_DIFFICULTY_AUTHORITY_VERSION_V1 } from "../../knowledge-v1/computer-awareness/com003-difficulty-authority-v1";
import { knowledgeV1QuestionStudioAdapter } from "./knowledge-v1-adapter";

const packages = knowledgeV1QuestionStudioAdapter.listPackages();
const com003Packages = packages.filter((pkg) => pkg.packageId === "COM-003");
assert.equal(com003Packages.length, 1, "knowledge-v1 must expose exactly one COM-003 package");

const pkg = com003Packages[0]!;
assert.equal(pkg.runtimeMode, "review-only");
assert.deepEqual(pkg.supportedRuntimeModes, ["review-only"]);
assert.equal(pkg.difficultyFilterSupported, true);
assert.deepEqual(pkg.supportedDifficulties, ["Easy", "Medium"]);
assert.equal(pkg.metadata?.corpusAuthorityId, "COM-003-LOCALIZATION-V2-CHAPTER-FREEZE-V1");
assert.equal(pkg.metadata?.englishFreezeAuthorityId, "COM-003-ENGLISH-FREEZE-V2");
assert.equal(pkg.metadata?.localizationFreezeAuthorityId, "COM-003-LOCALIZATION-V2-CHAPTER-FREEZE-V1");
assert.equal(pkg.metadata?.difficultyClassifierVersion, COM003_DIFFICULTY_AUTHORITY_VERSION_V1);
assert.equal(pkg.metadata?.productionDifficultyClaimsAuthorized, false);

for (const [label, value] of [
  ["questionBankWritable", pkg.questionBankWritable],
  ["testEligible", pkg.testEligible],
  ["mockTestEligible", pkg.mockTestEligible],
  ["publiclyPublishable", pkg.publiclyPublishable],
  ["automaticStudentPublication", pkg.automaticStudentPublication],
  ["productionReleaseAuthorized", pkg.productionReleaseAuthorized],
] as const) {
  assert.equal(value, false, `COM-003 REVIEW_ONLY must keep ${label}=false`);
}

const easy = await knowledgeV1QuestionStudioAdapter.generate({
  packageId: "COM-003",
  runtimeMode: "review-only",
  language: "en",
  difficulty: "Easy",
  seed: "com003-registry-v2-easy",
  count: 24,
});
assert.equal(easy.questions.length, 24);
assert.ok(easy.questions.every((question: any) => question.difficulty === "Easy"));
assert.equal(easy.generationContext?.difficultyFilterApplied, true);
assert.equal(easy.generationContext?.difficultyClassifierVersion, COM003_DIFFICULTY_AUTHORITY_VERSION_V1);
assert.equal(easy.generationContext?.productionDifficultyClaimAuthorized, false);

const medium = await knowledgeV1QuestionStudioAdapter.generate({
  packageId: "COM-003",
  runtimeMode: "review-only",
  language: "en",
  difficulty: "Medium",
  seed: "com003-registry-v2-medium",
  count: 24,
});
assert.equal(medium.questions.length, 24);
assert.ok(medium.questions.every((question: any) => question.difficulty === "Medium"));
assert.equal(medium.generationContext?.difficultyFilterApplied, true);

await assert.rejects(
  knowledgeV1QuestionStudioAdapter.generate({
    packageId: "COM-003",
    runtimeMode: "review-only",
    language: "en",
    difficulty: "Hard",
    seed: "com003-registry-v2-hard",
    count: 1,
  }),
  /Hard difficulty is not authorized/,
);

const paritySeed = "com003-registry-v2-cross-language";
const parityRequest = {
  packageId: "COM-003",
  runtimeMode: "review-only" as const,
  patternId: "COM-003-QL-017",
  difficulty: "Mixed" as const,
  seed: paritySeed,
  count: 12,
};
const english = await knowledgeV1QuestionStudioAdapter.generate({ ...parityRequest, language: "en" });
const hindi = await knowledgeV1QuestionStudioAdapter.generate({ ...parityRequest, language: "hi" });
const punjabi = await knowledgeV1QuestionStudioAdapter.generate({ ...parityRequest, language: "pa" });

assert.deepEqual(
  english.questions.map((question: any) => question.sourceQuestionId),
  hindi.questions.map((question: any) => question.sourceQuestionId),
);
assert.deepEqual(
  english.questions.map((question: any) => question.sourceQuestionId),
  punjabi.questions.map((question: any) => question.sourceQuestionId),
);
assert.deepEqual(
  english.questions.map((question: any) => question.correctIndex),
  hindi.questions.map((question: any) => question.correctIndex),
);
assert.deepEqual(
  english.questions.map((question: any) => question.correctIndex),
  punjabi.questions.map((question: any) => question.correctIndex),
);

for (const result of [easy, medium, english, hindi, punjabi]) {
  assert.equal(result.generationContext?.corpusAuthorityId, "COM-003-LOCALIZATION-V2-CHAPTER-FREEZE-V1");
  assert.equal(result.generationContext?.englishFreezeAuthorityId, "COM-003-ENGLISH-FREEZE-V2");
  assert.equal(result.generationContext?.localizationFreezeAuthorityId, "COM-003-LOCALIZATION-V2-CHAPTER-FREEZE-V1");
  assert.equal(result.generationContext?.questionBankWritable, false);
  assert.equal(result.generationContext?.testEligible, false);
  assert.equal(result.generationContext?.mockTestEligible, false);
  assert.equal(result.generationContext?.publiclyPublishable, false);
  assert.equal(result.generationContext?.productionReleaseAuthorized, false);

  for (const question of result.questions as any[]) {
    assert.equal(question.registrationStatus, "REGISTERED_REVIEW_ONLY");
    assert.equal(question.readOnly, true);
    assert.equal(question.revisionPolicy, "SOURCE_GENERATOR_ONLY");
    assert.equal(question.questionBankWritable, false);
    assert.equal(question.testEligible, false);
    assert.equal(question.mockTestEligible, false);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.productionReleaseAuthorized, false);
    assert.equal(question.questionStudioReview?.productionDifficultyClaimAuthorized, false);
  }
}

console.log("[COM003-REVIEW-ONLY-REGISTRY-CONTRACT-V2]", {
  packageId: pkg.packageId,
  corpusAuthorityId: pkg.metadata?.corpusAuthorityId,
  supportedDifficulties: pkg.supportedDifficulties,
  easyQuestions: easy.questions.length,
  mediumQuestions: medium.questions.length,
  parityQuestionsPerLanguage: english.questions.length,
  questionBankWritable: pkg.questionBankWritable,
  testEligible: pkg.testEligible,
  mockTestEligible: pkg.mockTestEligible,
  publiclyPublishable: pkg.publiclyPublishable,
  productionReleaseAuthorized: pkg.productionReleaseAuthorized,
});
