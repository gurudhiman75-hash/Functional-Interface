import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  listEnabledReasoningV1QuestionStudioPackages,
  listReasoningV1QuestionStudioReviewPackages,
  persistReasoningV1QuestionStudioReview,
  previewReasoningV1QuestionStudioReview,
} from "../../../../../question-studio-review-registry";
import {
  BLR_CP007_QUESTION_STUDIO_PACKAGE_ID,
  BLR_CP007_QUESTION_STUDIO_QL_IDS,
} from "./question-studio-review-adapter";

const packages = listReasoningV1QuestionStudioReviewPackages();
const enabledPackages = listEnabledReasoningV1QuestionStudioPackages();

assert.equal(packages.length, 1);
assert.equal(packages[0]?.packageId, BLR_CP007_QUESTION_STUDIO_PACKAGE_ID);
assert.equal(packages[0]?.reviewPreviewAvailable, true);
assert.equal(packages[0]?.enabled, false);
assert.equal(packages[0]?.persistenceAllowed, false);
assert.equal(packages[0]?.questionStudioVisible, false);
assert.equal(packages[0]?.questionBankEligible, false);
assert.equal(packages[0]?.mockTestEligible, false);
assert.equal(packages[0]?.publiclyPublishable, false);
assert.equal(enabledPackages.length, 0);

const languages = ["en", "hi", "pa"] as const;
const difficulties = ["Easy", "Medium", "Hard"] as const;
let validatedPreviewCount = 0;

for (const language of languages) {
  const sample = previewReasoningV1QuestionStudioReview({
    packageId: BLR_CP007_QUESTION_STUDIO_PACKAGE_ID,
    language,
    count: 5,
    seed: `read-only-activation:${language}`,
  });
  assert.equal(sample.questions.length, 5);
  assert.equal(sample.generationContext.persistenceAllowed, false);
  assert.equal(sample.generationContext.publiclyPublishable, false);

  for (const question of sample.questions) {
    assert.equal(question.language, language);
    assert.equal(question.validation.valid, true);
    assert.equal(question.options.length, 4);
    assert.equal(question.safety.reviewOnly, true);
    assert.equal(question.safety.questionStudioVisible, false);
    assert.equal(question.safety.persistenceAllowed, false);
    assert.equal(question.safety.questionBankEligible, false);
    assert.equal(question.safety.mockTestEligible, false);
    assert.equal(question.safety.publiclyPublishable, false);
    validatedPreviewCount += 1;
  }

  for (const qlId of BLR_CP007_QUESTION_STUDIO_QL_IDS) {
    const qlSample = previewReasoningV1QuestionStudioReview({
      packageId: BLR_CP007_QUESTION_STUDIO_PACKAGE_ID,
      language,
      qlId,
      count: 1,
      seed: `read-only-activation:${language}:${qlId}`,
    });
    assert.equal(qlSample.questions[0]?.qlId, qlId);
  }

  for (const difficulty of difficulties) {
    const difficultySample = previewReasoningV1QuestionStudioReview({
      packageId: BLR_CP007_QUESTION_STUDIO_PACKAGE_ID,
      language,
      difficulty,
      count: 1,
      seed: `read-only-activation:${language}:${difficulty}`,
    });
    assert.equal(difficultySample.questions[0]?.difficultyBand, difficulty);
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

const repoRoot = resolve(import.meta.dirname, "../../../../../../../../..");
const routeSource = readFileSync(
  resolve(repoRoot, "artifacts/api-server/src/routes/admin-question-studio-reasoning-review.ts"),
  "utf8",
);
const routeIndexSource = readFileSync(
  resolve(repoRoot, "artifacts/api-server/src/routes/index.ts"),
  "utf8",
);
const operationsPageSource = readFileSync(
  resolve(repoRoot, "artifacts/admin-app/src/pages/content/QuestionStudioOperationsPage.tsx"),
  "utf8",
);
const clientSource = readFileSync(
  resolve(repoRoot, "artifacts/admin-app/src/features/question-studio/reasoning-review-api.ts"),
  "utf8",
);

assert.match(routeSource, /content\.generation\.read/);
assert.match(routeSource, /ADMIN_READ_ONLY/);
assert.match(routeSource, /databaseWriteEnabled:\s*false/);
assert.match(routeSource, /persistenceAllowed:\s*false/);
assert.match(routeSource, /QUESTION_STUDIO_PERSISTENCE_LOCKED/);
assert.doesNotMatch(routeSource, /sqlClient|INSERT INTO|generation_runs/);
assert.match(routeIndexSource, /adminQuestionStudioReasoningReviewRouter/);
assert.match(operationsPageSource, /QuestionStudioReasoningReviewPanel/);
assert.match(clientSource, /reasoning-review\/packages/);
assert.match(clientSource, /reasoning-review\/preview/);
assert.doesNotMatch(clientSource, /method:\s*['"]POST['"]/);

console.log(JSON.stringify({
  verdict: "BLR_CP007_ADMIN_READ_ONLY_ACTIVATION_PROVED",
  reviewPackageCount: packages.length,
  enabledGenerationPackageCount: enabledPackages.length,
  validatedPreviewCount,
  languages,
  qlCount: BLR_CP007_QUESTION_STUDIO_QL_IDS.length,
  databaseWriteEnabled: false,
  persistenceAllowed: false,
  questionBankEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
}, null, 2));
