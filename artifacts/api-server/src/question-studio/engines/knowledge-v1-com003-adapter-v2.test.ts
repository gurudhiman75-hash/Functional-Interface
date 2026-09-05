import { strict as assert } from "node:assert";
import { COM003_DIFFICULTY_AUTHORITY_VERSION_V1 } from "../../knowledge-v1/computer-awareness/com003-difficulty-authority-v1";
import {
  COM003_STANDARD_REVIEW_ONLY_PACKAGE_V2,
  knowledgeV1Com003QuestionStudioAdapterV2,
} from "./knowledge-v1-com003-adapter-v2";

const pkg = COM003_STANDARD_REVIEW_ONLY_PACKAGE_V2;
assert.equal(pkg.packageId, "COM-003");
assert.equal(pkg.runtimeMode, "review-only");
assert.equal(pkg.questionBankWritable, false);
assert.equal(pkg.testEligible, false);
assert.equal(pkg.mockTestEligible, false);
assert.equal(pkg.publiclyPublishable, false);
assert.equal(pkg.productionReleaseAuthorized, false);
assert.equal(pkg.difficultyFilterSupported, true);
assert.deepEqual(pkg.supportedDifficulties, ["Easy", "Medium"]);
assert.equal(pkg.metadata?.englishFreezeAuthorityId, "COM-003-ENGLISH-FREEZE-V2");
assert.equal(pkg.metadata?.localizationFreezeAuthorityId, "COM-003-LOCALIZATION-V2-CHAPTER-FREEZE-V1");
assert.equal(pkg.metadata?.difficultyClassifierVersion, COM003_DIFFICULTY_AUTHORITY_VERSION_V1);
assert.equal(pkg.metadata?.productionDifficultyClaimsAuthorized, false);

const seed = "com003-question-studio-v2-adapter-parity";
const english = await knowledgeV1Com003QuestionStudioAdapterV2.generate({
  packageId: "COM-003",
  runtimeMode: "review-only",
  patternId: "COM-003-QL-017",
  language: "en",
  difficulty: "Mixed",
  seed,
  count: 12,
});
const hindi = await knowledgeV1Com003QuestionStudioAdapterV2.generate({
  packageId: "COM-003",
  runtimeMode: "review-only",
  patternId: "COM-003-QL-017",
  language: "hi",
  difficulty: "Mixed",
  seed,
  count: 12,
});
const punjabi = await knowledgeV1Com003QuestionStudioAdapterV2.generate({
  packageId: "COM-003",
  runtimeMode: "review-only",
  patternId: "COM-003-QL-017",
  language: "pa",
  difficulty: "Mixed",
  seed,
  count: 12,
});

assert.equal(english.questions.length, 12);
assert.deepEqual(
  english.questions.map((question: any) => question.sourceQuestionId),
  hindi.questions.map((question: any) => question.sourceQuestionId),
);
assert.deepEqual(
  english.questions.map((question: any) => question.sourceQuestionId),
  punjabi.questions.map((question: any) => question.sourceQuestionId),
);
for (const result of [english, hindi, punjabi]) {
  assert.equal(result.generationContext?.corpusAuthorityId, "COM-003-LOCALIZATION-V2-CHAPTER-FREEZE-V1");
  assert.equal(result.generationContext?.englishFreezeAuthorityId, "COM-003-ENGLISH-FREEZE-V2");
  assert.equal(result.generationContext?.difficultyClassifierVersion, COM003_DIFFICULTY_AUTHORITY_VERSION_V1);
  assert.equal(result.generationContext?.productionDifficultyClaimAuthorized, false);
  assert.equal(result.generationContext?.questionBankWritable, false);
  assert.equal(result.generationContext?.testEligible, false);
  assert.equal(result.generationContext?.mockTestEligible, false);
  assert.equal(result.generationContext?.publiclyPublishable, false);
  assert.equal(result.generationContext?.productionReleaseAuthorized, false);
  assert.ok(result.questions.every((question: any) => question.registrationStatus === "REGISTERED_REVIEW_ONLY"));
  assert.ok(result.questions.every((question: any) => question.readOnly === true));
  assert.ok(result.questions.every((question: any) => question.revisionPolicy === "SOURCE_GENERATOR_ONLY"));
  assert.ok(result.questions.every((question: any) => question.questionBankWritable === false));
  assert.ok(result.questions.every((question: any) => question.testEligible === false));
  assert.ok(result.questions.every((question: any) => question.publiclyPublishable === false));
}

const easy = await knowledgeV1Com003QuestionStudioAdapterV2.generate({
  packageId: "COM-003",
  language: "en",
  difficulty: "Easy",
  seed: "com003-v2-runtime-easy",
  count: 25,
});
assert.equal(easy.questions.length, 25);
assert.ok(easy.questions.every((question: any) => question.difficulty === "Easy"));
assert.equal(easy.generationContext?.difficultyFilterApplied, true);

const medium = await knowledgeV1Com003QuestionStudioAdapterV2.generate({
  packageId: "COM-003",
  language: "en",
  difficulty: "Medium",
  seed: "com003-v2-runtime-medium",
  count: 25,
});
assert.equal(medium.questions.length, 25);
assert.ok(medium.questions.every((question: any) => question.difficulty === "Medium"));
assert.equal(medium.generationContext?.difficultyFilterApplied, true);

await assert.rejects(
  knowledgeV1Com003QuestionStudioAdapterV2.generate({
    packageId: "COM-003",
    language: "en",
    difficulty: "Hard",
    seed: "com003-v2-runtime-hard",
    count: 1,
  }),
  /Hard difficulty is not authorized/,
);

console.log("[KNOWLEDGE-V1-COM003-ADAPTER-V2]", {
  packageId: pkg.packageId,
  corpusAuthority: pkg.metadata?.corpusAuthorityId,
  supportedDifficulties: pkg.supportedDifficulties,
  crossLanguageParityQuestions: english.questions.length,
  easySample: easy.questions.length,
  mediumSample: medium.questions.length,
  questionBankWritable: pkg.questionBankWritable,
  testEligible: pkg.testEligible,
  productionReleaseAuthorized: pkg.productionReleaseAuthorized,
});
