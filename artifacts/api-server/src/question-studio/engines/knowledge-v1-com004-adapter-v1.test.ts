import { strict as assert } from "node:assert";
import { auditCom004DifficultyAuthorityV3, COM004_DIFFICULTY_AUTHORITY_VERSION_V3 } from "../../knowledge-v1/computer-awareness/com004-difficulty-authority-v3";
import { auditCom004LocalizationFreezeV4, COM004_LOCALIZATION_FREEZE_AUTHORITY_V4 } from "../../knowledge-v1/computer-awareness/com004-localization-freeze-v4";
import {
  getGeneratedQuestionBankAcceptanceMode,
  getGeneratedQuestionBankEligibilityIssue,
} from "../../lib/admin-question-conversion";
import { COM004_BANK_ONLY_ACTIVATION_AUTHORITY_V3 } from "./com004-bank-only-activation-authority-v3";
import {
  COM004_STANDARD_BANK_ONLY_PACKAGE_V1,
  knowledgeV1Com004QuestionStudioAdapterV1,
} from "./knowledge-v1-com004-adapter-v1";
import { knowledgeV1QuestionStudioAdapter } from "./knowledge-v1-adapter";

const pkg = COM004_STANDARD_BANK_ONLY_PACKAGE_V1;
assert.equal(pkg.packageId, "COM-004");
assert.equal(pkg.runtimeMode, "review-only");
assert.equal(pkg.lifecycleStage, "BANK_ONLY");
assert.equal(pkg.questionBankStatus, "READY_FOR_STORAGE");
assert.equal(pkg.questionBankWritable, true);
assert.equal(pkg.questionBankAcceptanceMode, "BANK_ONLY");
assert.equal(pkg.questionBankAcceptanceAuthority, COM004_BANK_ONLY_ACTIVATION_AUTHORITY_V3.authorityId);
assert.equal(pkg.manualApprovalRequired, true);
assert.deepEqual(pkg.supportedLanguages, ["en", "hi", "pa"]);
assert.deepEqual(pkg.supportedDifficulties, ["Easy", "Medium"]);
assert.equal(pkg.difficultyFilterSupported, true);
assert.equal(pkg.testEligible, false);
assert.equal(pkg.mockTestEligible, false);
assert.equal(pkg.publiclyPublishable, false);
assert.equal(pkg.automaticStudentPublication, false);
assert.equal(pkg.productionReleaseAuthorized, false);
assert.equal(pkg.metadata?.corpusAuthorityId, COM004_LOCALIZATION_FREEZE_AUTHORITY_V4.authorityId);
assert.equal(pkg.metadata?.englishFreezeAuthorityId, "COM-004-ENGLISH-FREEZE-V4");
assert.equal(pkg.metadata?.localizationFreezeAuthorityId, COM004_LOCALIZATION_FREEZE_AUTHORITY_V4.authorityId);
assert.equal(pkg.metadata?.difficultyClassifierVersion, COM004_DIFFICULTY_AUTHORITY_VERSION_V3);
assert.equal(pkg.metadata?.productionDifficultyClaimsAuthorized, false);
assert.equal(pkg.metadata?.immutableCorpus, true);

assert.equal(auditCom004LocalizationFreezeV4().valid, true);
assert.equal(auditCom004DifficultyAuthorityV3().valid, true);

const request = {
  packageId: "COM-004" as const,
  runtimeMode: "review-only" as const,
  patternId: "COM-004-QL-017",
  difficulty: "Mixed" as const,
  seed: "com004-question-studio-cross-language-v1",
  count: 12,
};
const english = await knowledgeV1Com004QuestionStudioAdapterV1.generate({ ...request, language: "en" });
const hindi = await knowledgeV1Com004QuestionStudioAdapterV1.generate({ ...request, language: "hi" });
const punjabi = await knowledgeV1Com004QuestionStudioAdapterV1.generate({ ...request, language: "pa" });

assert.equal(english.questions.length, 12);
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
assert.equal(new Set(english.questions.map((question: any) => question.questionId)).size, 12);
assert.ok(hindi.questions.every((question: any) => /[\u0900-\u097f]/.test(question.text)));
assert.ok(punjabi.questions.every((question: any) => /[\u0a00-\u0a7f]/.test(question.text)));

for (const result of [english, hindi, punjabi]) {
  assert.equal(result.generationContext?.stage, "BANK_ONLY");
  assert.equal(result.generationContext?.questionBankStatus, "READY_FOR_STORAGE");
  assert.equal(result.generationContext?.questionBankWritable, true);
  assert.equal(result.generationContext?.questionBankAcceptanceMode, "BANK_ONLY");
  assert.equal(result.generationContext?.questionBankAcceptanceAuthority, COM004_BANK_ONLY_ACTIVATION_AUTHORITY_V3.authorityId);
  assert.equal(result.generationContext?.testEligible, false);
  assert.equal(result.generationContext?.mockTestEligible, false);
  assert.equal(result.generationContext?.publiclyPublishable, false);
  assert.equal(result.generationContext?.productionReleaseAuthorized, false);
  assert.equal(result.generationContext?.corpusAuthorityId, COM004_LOCALIZATION_FREEZE_AUTHORITY_V4.authorityId);
  assert.equal(result.generationContext?.difficultyClassifierVersion, COM004_DIFFICULTY_AUTHORITY_VERSION_V3);
  assert.equal(result.generationContext?.productionDifficultyClaimAuthorized, false);
  assert.ok(result.questions.every((question: any) => question.registrationStatus === "REGISTERED_BANK_ONLY_INTERNAL"));
  assert.ok(result.questions.every((question: any) => question.readOnly === true));
  assert.ok(result.questions.every((question: any) => question.revisionPolicy === "SOURCE_GENERATOR_ONLY"));
  assert.ok(result.questions.every((question: any) => question.questionBankAcceptanceAuthority === COM004_BANK_ONLY_ACTIVATION_AUTHORITY_V3.authorityId));
  assert.ok(result.questions.every((question: any) => question.registrationAuthorityId === COM004_BANK_ONLY_ACTIVATION_AUTHORITY_V3.authorityId));
  assert.ok(result.questions.every((question: any) => question.questionBankWritable === true));
  assert.ok(result.questions.every((question: any) => question.testEligible === false));
  assert.ok(result.questions.every((question: any) => question.mockTestEligible === false));
  assert.ok(result.questions.every((question: any) => question.publiclyPublishable === false));
  assert.equal(getGeneratedQuestionBankAcceptanceMode(result.questions[0]), "BANK_ONLY");
  assert.equal(getGeneratedQuestionBankEligibilityIssue(result.questions[0]), null);
}

const repeated = await knowledgeV1Com004QuestionStudioAdapterV1.generate({ ...request, language: "en" });
assert.deepEqual(repeated.questions, english.questions, "same seed must produce the same frozen batch");

const easy = await knowledgeV1Com004QuestionStudioAdapterV1.generate({
  packageId: "COM-004",
  language: "en",
  difficulty: "Easy",
  seed: "com004-easy-v1",
  count: 24,
});
assert.equal(easy.questions.length, 24);
assert.ok(easy.questions.every((question: any) => question.difficulty === "Easy"));

const medium = await knowledgeV1Com004QuestionStudioAdapterV1.generate({
  packageId: "COM-004",
  language: "en",
  difficulty: "Medium",
  seed: "com004-medium-v1",
  count: 24,
});
assert.equal(medium.questions.length, 24);
assert.ok(medium.questions.every((question: any) => question.difficulty === "Medium"));

await assert.rejects(
  knowledgeV1Com004QuestionStudioAdapterV1.generate({ packageId: "COM-004", language: "en", difficulty: "Hard", count: 1 }),
  /Hard difficulty is not authorized/,
);
await assert.rejects(
  knowledgeV1Com004QuestionStudioAdapterV1.generate({ packageId: "COM-004", language: "en", patternId: "COM-004-QL-017", difficulty: "Easy", count: 2 }),
  /without repeats/,
);
await assert.rejects(
  knowledgeV1Com004QuestionStudioAdapterV1.generate({ packageId: "COM-004", language: "en", patternId: "COM-004-QL-999", count: 1 }),
  /Unknown COM-004 selector/,
);

const packages = knowledgeV1QuestionStudioAdapter.listPackages();
assert.equal(packages.filter((candidate) => candidate.packageId === "COM-004").length, 1);
const routed = await knowledgeV1QuestionStudioAdapter.generate({
  packageId: "COM-004",
  subject: "Computer Awareness",
  subtopic: "Internet, Web, E-mail & Digital Services",
  language: "en",
  seed: "com004-routed-v1",
  count: 3,
});
assert.equal(routed.questions.length, 3);
assert.equal(routed.generationContext?.packageId, "COM-004");

console.log("[KNOWLEDGE-V1-COM004-ADAPTER-V1-BANK-ONLY]", {
  packageId: pkg.packageId,
  lifecycleStage: pkg.lifecycleStage,
  questionBankWritable: pkg.questionBankWritable,
  crossLanguageParityQuestions: english.questions.length,
  easyQuestions: easy.questions.length,
  mediumQuestions: medium.questions.length,
  testEligible: pkg.testEligible,
  productionReleaseAuthorized: pkg.productionReleaseAuthorized,
});
