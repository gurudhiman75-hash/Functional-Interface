import { strict as assert } from "node:assert";

import { COM002_LOCALIZATION_VERSION_V5 } from "../../knowledge-v1/computer-awareness/com002-localization-v5";
import { COM002_ENGLISH_GENERATOR_VERSION_V6, listCom002ReviewV6QlIds } from "../../knowledge-v1/computer-awareness/com002-review-synthesis-v6";
import { COM002_V6_V5_OPERATIONAL_FREEZE } from "../../knowledge-v1/computer-awareness/com002-v6-v5-operational-freeze";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";
import {
  COM002_STANDARD_REVIEW_ONLY_PACKAGE_V3,
  generateCom002QuestionStudioQuestionV3,
  knowledgeV1Com002QuestionStudioAdapterV3,
} from "./knowledge-v1-com002-adapter-v3";

const qlIds = listCom002ReviewV6QlIds();
const languages = ["en", "hi", "pa"] as const;
const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
let audited = 0;

assert.equal(qlIds.length, 13);
assert.equal(COM002_STANDARD_REVIEW_ONLY_PACKAGE_V3.enabled, true);
assert.deepEqual(COM002_STANDARD_REVIEW_ONLY_PACKAGE_V3.supportedLanguages, ["en", "hi", "pa"]);
assert.equal(COM002_STANDARD_REVIEW_ONLY_PACKAGE_V3.lifecycleStage, "REVIEW_ONLY");
assert.equal(COM002_STANDARD_REVIEW_ONLY_PACKAGE_V3.questionBankWritable, false);
assert.equal(COM002_STANDARD_REVIEW_ONLY_PACKAGE_V3.testEligible, false);
assert.equal(COM002_STANDARD_REVIEW_ONLY_PACKAGE_V3.mockTestEligible, false);
assert.equal(COM002_STANDARD_REVIEW_ONLY_PACKAGE_V3.publiclyPublishable, false);
assert.equal(COM002_STANDARD_REVIEW_ONLY_PACKAGE_V3.metadata?.operationalFreezeAuthorityId, COM002_V6_V5_OPERATIONAL_FREEZE.authorityId);

for (const qlId of qlIds) {
  for (const language of languages) {
    for (let index = 0; index < 10; index += 1) {
      const seed = `com002-v6-v5-adapter-audit:${qlId}:${language}:${index}`;
      const question = generateCom002QuestionStudioQuestionV3({ qlId, seed, language });
      const replay = generateCom002QuestionStudioQuestionV3({ qlId, seed, language });
      assert.deepEqual(question, replay, `${qlId}/${language}/${index} must replay deterministically`);
      assert.equal(question.packageId, "COM-002");
      assert.equal(question.patternId, qlId);
      assert.equal(question.qlId, qlId);
      assert.equal(question.language, language);
      assert.equal(question.text, question.stem);
      assert.equal(question.correct, question.correctIndex);
      assert.equal(question.options.length, 4);
      assert.equal(new Set(question.options).size, 4);
      assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
      assert.equal(question.lifecycleId, lifecycle.lifecycleId);
      assert.equal(question.stage, lifecycle.stage);
      assert.equal(question.reviewRunPersistenceAllowed, true);
      assert.equal(question.canonicalQuestionPersistenceAllowed, false);
      assert.equal(question.questionBankWritable, false);
      assert.equal(question.testEligible, false);
      assert.equal(question.mockTestEligible, false);
      assert.equal(question.publiclyPublishable, false);
      assert.equal(question.productionReleaseAuthorized, false);
      assert.equal(question.questionStudioReview.englishGeneratorVersion, COM002_ENGLISH_GENERATOR_VERSION_V6);
      assert.equal(question.questionStudioReview.localizationVersion, COM002_LOCALIZATION_VERSION_V5);
      assert.equal(question.questionStudioReview.operationalFreezeAuthorityId, COM002_V6_V5_OPERATIONAL_FREEZE.authorityId);
      assert.equal(question.questionStudioReview.englishCombinedFingerprint, COM002_V6_V5_OPERATIONAL_FREEZE.fingerprints.englishV6CombinedFingerprint);
      assert.equal(question.questionStudioReview.localizationCombinedFingerprint, COM002_V6_V5_OPERATIONAL_FREEZE.fingerprints.localizationV5CombinedFingerprint);
      assert.equal(question.questionStudioReview.productionDifficultyClaimAuthorized, false);
      assert.equal("lifecycleV5" in question, false, "stale candidate lifecycle must not leak into Question Studio runtime");
      audited += 1;
    }
  }
}

assert.equal(audited, 390);

for (const language of languages) {
  const batch = await knowledgeV1Com002QuestionStudioAdapterV3.generate({
    packageId: "COM-002",
    runtimeMode: "review-only",
    language,
    difficulty: "Mixed",
    count: 13,
    seed: `com002-v6-v5-adapter-batch:${language}`,
  });
  assert.equal(batch.questions.length, 13);
  assert.equal(batch.generationContext.packageId, "COM-002");
  assert.equal(batch.generationContext.stage, "REVIEW_ONLY");
  assert.equal(batch.generationContext.reviewRunPersistenceAllowed, true);
  assert.equal(batch.generationContext.canonicalQuestionPersistenceAllowed, false);
  assert.equal(batch.generationContext.questionBankWritable, false);
  assert.equal(batch.generationContext.testEligible, false);
  assert.equal(batch.generationContext.mockTestEligible, false);
  assert.equal(batch.generationContext.publiclyPublishable, false);
}

const hard = await knowledgeV1Com002QuestionStudioAdapterV3.generate({
  packageId: "COM-002",
  runtimeMode: "review-only",
  language: "en",
  patternId: "COM-002-QL-013",
  difficulty: "Hard",
  count: 3,
  seed: "com002-v6-v5-hard-audit",
});
assert.equal(hard.questions.length, 3);
assert.equal(hard.questions.every((question) => question.difficulty === "Hard"), true);

assert.throws(() => generateCom002QuestionStudioQuestionV3({ qlId: "COM-002-QL-999", seed: "bad", language: "en" }), /Unknown COM-002 QL/);

console.log(`[COM002-V6-V5-QUESTION-STUDIO-ADAPTER-V3] PASS audited=${audited} lifecycle=REVIEW_ONLY persistence=true bank=false downstream=false`);
