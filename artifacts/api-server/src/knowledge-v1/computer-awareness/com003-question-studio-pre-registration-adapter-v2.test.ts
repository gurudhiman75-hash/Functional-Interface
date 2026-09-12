import { strict as assert } from "node:assert";
import { COM003_DIFFICULTY_AUTHORITY_VERSION_V1 } from "./com003-difficulty-authority-v1";
import { COM003_ENGLISH_REVIEW_CORPUS_V16_2 } from "./com003-review-synthesis-v16-2";
import {
  COM003_QUESTION_STUDIO_PRE_REGISTRATION_CAPABILITY_V2,
  runCom003QuestionStudioPreRegistrationV2,
} from "./com003-question-studio-pre-registration-adapter-v2";

const capability = COM003_QUESTION_STUDIO_PRE_REGISTRATION_CAPABILITY_V2;
assert.equal(capability.corpus.authorityId, "COM-003-LOCALIZATION-V2-CHAPTER-FREEZE-V1");
assert.equal(capability.corpus.englishAuthorityId, "COM-003-ENGLISH-FREEZE-V2");
assert.equal(capability.corpus.englishQuestionCount, 228);
assert.equal(capability.corpus.hindiQuestionCount, 228);
assert.equal(capability.corpus.punjabiQuestionCount, 228);
assert.equal(capability.corpus.qlCount, 19);
assert.equal(capability.difficultySelection.supported, true);
assert.deepEqual(capability.difficultySelection.supportedDifficulties, ["Easy", "Medium"]);
assert.equal(capability.difficultySelection.hardAuthorized, false);
assert.equal(capability.difficultySelection.classifierVersion, COM003_DIFFICULTY_AUTHORITY_VERSION_V1);
assert.equal(capability.difficultySelection.productionDifficultyClaimsAuthorized, false);

const seed = "com003-v2-cross-language-parity";
const english = runCom003QuestionStudioPreRegistrationV2({
  packageId: "COM-003",
  qlId: "COM-003-QL-017",
  language: "en",
  difficulty: "Mixed",
  seed,
  count: 12,
});
const hindi = runCom003QuestionStudioPreRegistrationV2({
  packageId: "COM-003",
  qlId: "COM-003-QL-017",
  language: "hi",
  difficulty: "Mixed",
  seed,
  count: 12,
});
const punjabi = runCom003QuestionStudioPreRegistrationV2({
  packageId: "COM-003",
  qlId: "COM-003-QL-017",
  language: "pa",
  difficulty: "Mixed",
  seed,
  count: 12,
});

assert.deepEqual(
  english.questions.map((question) => question.sourceQuestionId),
  hindi.questions.map((question) => question.sourceQuestionId),
);
assert.deepEqual(
  english.questions.map((question) => question.sourceQuestionId),
  punjabi.questions.map((question) => question.sourceQuestionId),
);
assert.deepEqual(
  english.questions.map((question) => question.correctIndex),
  hindi.questions.map((question) => question.correctIndex),
);
assert.deepEqual(
  english.questions.map((question) => question.correctIndex),
  punjabi.questions.map((question) => question.correctIndex),
);
assert.ok(hindi.questions.every((question) => /[ऀ-ॿ]/.test(question.stem)));
assert.ok(punjabi.questions.every((question) => /[਀-੿]/.test(question.stem)));
assert.ok(english.questions.every((question) => question.corpusStatus === "FROZEN_V2"));
assert.ok(english.questions.every((question) => question.questionBankStatus === "NOT_STORED"));
assert.ok(english.questions.every((question) => question.testEligibility === "INELIGIBLE"));
assert.equal(english.generationContext.corpusAuthorityId, "COM-003-LOCALIZATION-V2-CHAPTER-FREEZE-V1");
assert.equal(english.generationContext.englishFreezeAuthorityId, "COM-003-ENGLISH-FREEZE-V2");
assert.equal(english.generationContext.difficultyClassifierVersion, COM003_DIFFICULTY_AUTHORITY_VERSION_V1);
assert.equal(english.generationContext.productionDifficultyClaimAuthorized, false);

const easy = runCom003QuestionStudioPreRegistrationV2({
  packageId: "COM-003",
  language: "en",
  difficulty: "Easy",
  seed: "com003-v2-easy",
  count: 40,
});
assert.equal(easy.questions.length, 40);
assert.ok(easy.questions.every((question) => question.difficulty === "Easy"));
assert.equal(easy.generationContext.difficultyFilterApplied, true);

const medium = runCom003QuestionStudioPreRegistrationV2({
  packageId: "COM-003",
  language: "en",
  difficulty: "Medium",
  seed: "com003-v2-medium",
  count: 40,
});
assert.equal(medium.questions.length, 40);
assert.ok(medium.questions.every((question) => question.difficulty === "Medium"));
assert.equal(medium.generationContext.difficultyFilterApplied, true);

assert.throws(
  () =>
    runCom003QuestionStudioPreRegistrationV2({
      packageId: "COM-003",
      language: "en",
      difficulty: "Hard",
      seed: "com003-v2-hard",
      count: 1,
    }),
  /Hard difficulty is not authorized/,
);

const sourceById = new Map(COM003_ENGLISH_REVIEW_CORPUS_V16_2.map((question) => [question.questionId, question]));
for (const question of english.questions) {
  const source = sourceById.get(question.sourceQuestionId);
  assert.ok(source, `${question.sourceQuestionId}:missing-V16.2-source`);
  assert.equal(question.stem, source.stem, `${question.sourceQuestionId}:runtime-not-V16.2`);
  assert.equal(question.explanation, source.explanation, `${question.sourceQuestionId}:explanation-not-V16.2`);
}

console.log("[COM003-QUESTION-STUDIO-PRE-REGISTRATION-V2]", {
  corpusAuthority: capability.corpus.authorityId,
  englishAuthority: capability.corpus.englishAuthorityId,
  questionLanguageArtifacts:
    capability.corpus.englishQuestionCount +
    capability.corpus.hindiQuestionCount +
    capability.corpus.punjabiQuestionCount,
  qlCount: capability.corpus.qlCount,
  supportedDifficulties: capability.difficultySelection.supportedDifficulties,
  crossLanguageParityQuestions: english.questions.length,
  easySample: easy.questions.length,
  mediumSample: medium.questions.length,
  hardAuthorized: capability.difficultySelection.hardAuthorized,
});
