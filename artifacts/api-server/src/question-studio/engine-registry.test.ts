import { strict as assert } from "node:assert";

import {
  generateQuestionStudioQuestions,
  getQuestionStudioEngine,
  listQuestionStudioEngines,
  listQuestionStudioPackages,
  resolveQuestionStudioEngine,
} from "./engine-registry";
import {
  QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1,
  QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1,
} from "./standard-lifecycle";

const engines = listQuestionStudioEngines();
assert.deepEqual(engines, ["quant-v4", "knowledge-v1"]);

const packages = listQuestionStudioPackages();
assert.equal(packages.length > 0, true);
assert.equal(packages.every((pkg) => pkg.packageId.length > 0), true);
assert.equal(packages.every((pkg) => pkg.supportedLanguages.length > 0), true);

const quantPackage = packages.find((pkg) => pkg.engineId === "quant-v4");
assert.ok(quantPackage);
assert.equal(resolveQuestionStudioEngine({ packageId: quantPackage.packageId }).engineId, "quant-v4");
assert.equal(resolveQuestionStudioEngine({ topic: "Arithmetic", subtopic: "Percentage" }).engineId, "quant-v4");
assert.equal(getQuestionStudioEngine("quant-v4").engineId, "quant-v4");

const com001 = packages.find((pkg) => pkg.packageId === "COM-001");
const bankLifecycle = QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1;
assert.ok(com001);
assert.equal(com001.engineId, "knowledge-v1");
assert.equal(com001.enabled, true);
assert.deepEqual(com001.cpIds, ["COM-001-CP-001"]);
assert.deepEqual(com001.supportedLanguages, ["en", "hi", "pa"]);
assert.equal(com001.runtimeMode, "review-only");
assert.equal(com001.questionBankStatus, bankLifecycle.questionBankStatus);
assert.equal(com001.testEligibility, bankLifecycle.testEligibility);
assert.equal(com001.publiclyPublishable, false);
assert.equal(com001.metadata?.lifecycleId, bankLifecycle.lifecycleId);
assert.equal(com001.metadata?.stage, "BANK_ONLY");
assert.equal(com001.metadata?.questionBankWritable, true);
assert.equal(com001.metadata?.testEligible, false);
assert.equal(com001.metadata?.mockTestEligible, false);
assert.equal(com001.metadata?.productionReleaseAuthorized, false);
assert.equal(resolveQuestionStudioEngine({ packageId: "COM-001" }).engineId, "knowledge-v1");

const com002 = packages.find((pkg) => pkg.packageId === "COM-002");
const reviewLifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
assert.ok(com002);
assert.equal(com002.engineId, "knowledge-v1");
assert.equal(com002.enabled, true);
assert.deepEqual(com002.cpIds, ["COM-002-CP-001", "COM-002-CP-002"]);
assert.deepEqual(com002.supportedLanguages, ["en", "hi", "pa"]);
assert.equal(com002.runtimeMode, "review-only");
assert.equal(com002.lifecycleId, reviewLifecycle.lifecycleId);
assert.equal(com002.lifecycleStage, "REVIEW_ONLY");
assert.equal(com002.questionBankStatus, "NOT_STORED");
assert.equal(com002.questionBankWritable, false);
assert.equal(com002.testEligible, false);
assert.equal(com002.mockTestEligible, false);
assert.equal(com002.publiclyPublishable, false);
assert.equal(com002.metadata?.humanReviewApproved, true);
assert.equal(resolveQuestionStudioEngine({ packageId: "COM-002" }).engineId, "knowledge-v1");
assert.equal(getQuestionStudioEngine("knowledge-v1").engineId, "knowledge-v1");

const com002Result = await generateQuestionStudioQuestions({
  packageId: "COM-002",
  language: "pa",
  runtimeMode: "review-only",
  count: 2,
  seed: "engine-registry-com002-smoke",
});
assert.equal(com002Result.engineId, "knowledge-v1");
assert.equal(com002Result.questions.length, 2);
assert.equal(com002Result.generationContext.packageId, "COM-002");
assert.equal(com002Result.generationContext.stage, "REVIEW_ONLY");
assert.equal(com002Result.generationContext.reviewRunPersistenceAllowed, true);
assert.equal(com002Result.generationContext.canonicalQuestionPersistenceAllowed, false);
assert.equal(com002Result.generationContext.questionBankWritable, false);

assert.throws(() => getQuestionStudioEngine("language-v1"), /not registered/);

console.log("[QUESTION-STUDIO-ENGINE-REGISTRY] PASS COM-001=bank-only COM-002=review-only knowledge-v1-composite=true");
