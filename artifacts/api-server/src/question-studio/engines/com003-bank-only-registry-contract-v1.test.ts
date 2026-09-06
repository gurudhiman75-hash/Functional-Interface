import { strict as assert } from "node:assert";
import { COM003_DIFFICULTY_AUTHORITY_VERSION_V1 } from "../../knowledge-v1/computer-awareness/com003-difficulty-authority-v1";
import {
  getGeneratedQuestionBankAcceptanceMode,
  getGeneratedQuestionBankEligibilityIssue,
} from "../../lib/admin-question-conversion";
import { COM003_BANK_ONLY_ACTIVATION_AUTHORITY_V1 } from "./com003-bank-only-activation-authority-v1";
import { knowledgeV1QuestionStudioAdapter } from "./knowledge-v1-adapter";

const packages = knowledgeV1QuestionStudioAdapter.listPackages();
const com003Packages = packages.filter((pkg) => pkg.packageId === "COM-003");
assert.equal(com003Packages.length, 1, "knowledge-v1 must expose exactly one COM-003 package");

const pkg = com003Packages[0]!;
assert.equal(pkg.runtimeMode, "review-only");
assert.deepEqual(pkg.supportedRuntimeModes, ["review-only"]);
assert.equal(pkg.lifecycleStage, "BANK_ONLY");
assert.equal(pkg.questionBankStatus, "READY_FOR_STORAGE");
assert.equal(pkg.questionBankWritable, true);
assert.equal(pkg.questionBankAcceptanceMode, "BANK_ONLY");
assert.equal(pkg.questionBankAcceptanceAuthority, COM003_BANK_ONLY_ACTIVATION_AUTHORITY_V1.authorityId);
assert.equal(pkg.manualApprovalRequired, true);
assert.equal(pkg.difficultyFilterSupported, true);
assert.deepEqual(pkg.supportedDifficulties, ["Easy", "Medium"]);
assert.equal(pkg.metadata?.corpusAuthorityId, "COM-003-LOCALIZATION-V2-CHAPTER-FREEZE-V1");
assert.equal(pkg.metadata?.englishFreezeAuthorityId, "COM-003-ENGLISH-FREEZE-V2");
assert.equal(pkg.metadata?.localizationFreezeAuthorityId, "COM-003-LOCALIZATION-V2-CHAPTER-FREEZE-V1");
assert.equal(pkg.metadata?.difficultyClassifierVersion, COM003_DIFFICULTY_AUTHORITY_VERSION_V1);
assert.equal(pkg.metadata?.productionDifficultyClaimsAuthorized, false);
assert.equal(pkg.testEligible, false);
assert.equal(pkg.mockTestEligible, false);
assert.equal(pkg.publiclyPublishable, false);
assert.equal(pkg.automaticStudentPublication, false);
assert.equal(pkg.productionReleaseAuthorized, false);

const easy = await knowledgeV1QuestionStudioAdapter.generate({
  packageId: "COM-003",
  runtimeMode: "review-only",
  language: "en",
  difficulty: "Easy",
  seed: "com003-bank-registry-v1-easy",
  count: 24,
});
assert.equal(easy.questions.length, 24);
assert.ok(easy.questions.every((question: any) => question.difficulty === "Easy"));

const medium = await knowledgeV1QuestionStudioAdapter.generate({
  packageId: "COM-003",
  runtimeMode: "review-only",
  language: "en",
  difficulty: "Medium",
  seed: "com003-bank-registry-v1-medium",
  count: 24,
});
assert.equal(medium.questions.length, 24);
assert.ok(medium.questions.every((question: any) => question.difficulty === "Medium"));

await assert.rejects(
  knowledgeV1QuestionStudioAdapter.generate({
    packageId: "COM-003",
    runtimeMode: "review-only",
    language: "en",
    difficulty: "Hard",
    seed: "com003-bank-registry-v1-hard",
    count: 1,
  }),
  /Hard difficulty is not authorized/,
);

const paritySeed = "com003-bank-registry-v1-cross-language";
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
  assert.equal(result.generationContext?.stage, "BANK_ONLY");
  assert.equal(result.generationContext?.questionBankStatus, "READY_FOR_STORAGE");
  assert.equal(result.generationContext?.questionBankWritable, true);
  assert.equal(result.generationContext?.questionBankAcceptanceMode, "BANK_ONLY");
  assert.equal(
    result.generationContext?.questionBankAcceptanceAuthority,
    COM003_BANK_ONLY_ACTIVATION_AUTHORITY_V1.authorityId,
  );
  assert.equal(result.generationContext?.testEligible, false);
  assert.equal(result.generationContext?.mockTestEligible, false);
  assert.equal(result.generationContext?.publiclyPublishable, false);
  assert.equal(result.generationContext?.productionReleaseAuthorized, false);

  for (const question of result.questions as any[]) {
    assert.equal(question.registrationStatus, "REGISTERED_BANK_ONLY_INTERNAL");
    assert.equal(question.readOnly, true);
    assert.equal(question.revisionPolicy, "SOURCE_GENERATOR_ONLY");
    assert.equal(question.questionBankWritable, true);
    assert.equal(question.testEligible, false);
    assert.equal(question.mockTestEligible, false);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.productionReleaseAuthorized, false);
    assert.equal(getGeneratedQuestionBankAcceptanceMode(question), "BANK_ONLY");
    assert.equal(getGeneratedQuestionBankEligibilityIssue(question), null);
  }
}

console.log("[COM003-BANK-ONLY-REGISTRY-CONTRACT-V1]", {
  packageId: pkg.packageId,
  authorityId: COM003_BANK_ONLY_ACTIVATION_AUTHORITY_V1.authorityId,
  lifecycleStage: pkg.lifecycleStage,
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
