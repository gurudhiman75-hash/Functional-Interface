import { strict as assert } from "node:assert";

import {
  listReasoningV1QuestionStudioReviewPackages,
  persistReasoningV1QuestionStudioReview,
  previewReasoningV1QuestionStudioReview,
} from "../../../../../question-studio-review-registry";
import {
  BLR_CP007_QUESTION_STUDIO_PACKAGE_ID,
  BLR_CP007_QUESTION_STUDIO_QL_IDS,
} from "./question-studio-review-adapter";
import {
  generateBlr001StandardQuestionStudioBatch,
  listBlr001StandardQuestionStudioPackages,
} from "../question-studio-standard-integration";

const sourcePackages = listReasoningV1QuestionStudioReviewPackages();
assert.equal(sourcePackages.length, 1);
assert.equal(sourcePackages[0]?.packageId, BLR_CP007_QUESTION_STUDIO_PACKAGE_ID);
assert.equal(sourcePackages[0]?.enabled, false);
assert.equal(sourcePackages[0]?.persistenceAllowed, false);
assert.equal(sourcePackages[0]?.questionStudioVisible, false);
assert.equal(sourcePackages[0]?.questionBankEligible, false);
assert.equal(sourcePackages[0]?.mockTestEligible, false);
assert.equal(sourcePackages[0]?.publiclyPublishable, false);

const standardPackage = listBlr001StandardQuestionStudioPackages().find(
  (entry) => entry.packageId === BLR_CP007_QUESTION_STUDIO_PACKAGE_ID,
);
assert.ok(standardPackage);
assert.equal(standardPackage?.enabled, true);
assert.equal(standardPackage?.manualApprovalRequired, true);
assert.equal(standardPackage?.automaticStudentPublication, false);

const languages = ["en", "hi", "pa"] as const;
const difficulties = ["Easy", "Medium", "Hard"] as const;
let validatedPreviewCount = 0;

for (const language of languages) {
  const sourceSample = previewReasoningV1QuestionStudioReview({
    packageId: BLR_CP007_QUESTION_STUDIO_PACKAGE_ID,
    language,
    count: 3,
    seed: `source-lock:${language}`,
  });
  assert.equal(sourceSample.generationContext.persistenceAllowed, false);
  assert.equal(sourceSample.generationContext.publiclyPublishable, false);
  assert.equal(sourceSample.questions.every((entry) => entry.safety.persistenceAllowed === false), true);

  const standardSample = generateBlr001StandardQuestionStudioBatch({
    packageId: BLR_CP007_QUESTION_STUDIO_PACKAGE_ID,
    language,
    count: 3,
    seed: `standard-staging:${language}`,
  });
  assert.equal(standardSample.generationContext.persistenceAllowed, true);
  assert.equal(standardSample.generationContext.manualApprovalRequired, true);
  assert.equal(standardSample.generationContext.automaticStudentPublication, false);

  for (const question of standardSample.questions) {
    assert.equal(question.language, language);
    assert.equal(question.validation.valid, true);
    assert.equal(question.manualApprovalRequired, true);
    assert.equal(question.automaticStudentPublication, false);
    assert.equal(question.sourceSafety.persistenceAllowed, false);
    assert.equal(question.sourceSafety.publiclyPublishable, false);
    validatedPreviewCount += 1;
  }

  for (const qlId of BLR_CP007_QUESTION_STUDIO_QL_IDS) {
    const qlSample = generateBlr001StandardQuestionStudioBatch({
      packageId: BLR_CP007_QUESTION_STUDIO_PACKAGE_ID,
      language,
      canonicalProblemId: qlId,
      count: 1,
      seed: `standard-staging:${language}:${qlId}`,
    });
    assert.equal(qlSample.questions[0]?.qlId, qlId);
  }

  for (const difficulty of difficulties) {
    const difficultySample = generateBlr001StandardQuestionStudioBatch({
      packageId: BLR_CP007_QUESTION_STUDIO_PACKAGE_ID,
      language,
      difficulty,
      count: 1,
      seed: `standard-staging:${language}:${difficulty}`,
    });
    assert.equal(difficultySample.questions[0]?.difficulty, difficulty);
  }
}

assert.throws(
  () => persistReasoningV1QuestionStudioReview({
    packageId: BLR_CP007_QUESTION_STUDIO_PACKAGE_ID,
    language: "en",
    count: 1,
  }),
  /review-only|persistence|activation/i,
);

console.log(JSON.stringify({
  verdict: "BLR_CP007_FROZEN_SOURCE_LOCKS_PRESERVED_UNDER_STANDARD_STAGING",
  sourceAdapterPersistenceAllowed: false,
  standardQuestionStudioStagingAllowed: true,
  manualApprovalRequired: true,
  automaticStudentPublication: false,
  validatedPreviewCount,
  languages,
  qlCount: BLR_CP007_QUESTION_STUDIO_QL_IDS.length,
}, null, 2));
