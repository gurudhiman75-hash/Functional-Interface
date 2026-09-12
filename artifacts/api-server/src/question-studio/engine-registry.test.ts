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
assert.deepEqual(engines, ["quant-v4", "knowledge-v1", "language-v1"]);

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
assert.deepEqual(com001.cpIds, [
  "COM-001-CP-001",
  "COM-001-CP-002",
  "COM-001-CP-003",
  "COM-001-CP-004",
  "COM-001-CP-005",
  "COM-001-CP-006",
  "COM-001-CP-007",
]);
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
const com002Lifecycle = QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1;
assert.ok(com002);
assert.equal(com002.engineId, "knowledge-v1");
assert.equal(com002.enabled, true);
assert.deepEqual(com002.cpIds, ["COM-002-CP-001", "COM-002-CP-002"]);
assert.deepEqual(com002.supportedLanguages, ["en", "hi", "pa"]);
assert.equal(com002.runtimeMode, "review-only");
assert.equal(com002.lifecycleId, com002Lifecycle.lifecycleId);
assert.equal(com002.lifecycleStage, "BANK_ONLY");
assert.equal(com002.questionBankStatus, "READY_FOR_STORAGE");
assert.equal(com002.questionBankWritable, true);
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
assert.equal(com002Result.generationContext.stage, "BANK_ONLY");
assert.equal(com002Result.generationContext.reviewRunPersistenceAllowed, true);
assert.equal(com002Result.generationContext.canonicalQuestionPersistenceAllowed, true);
assert.equal(com002Result.generationContext.questionBankWritable, true);

const eng001 = packages.find((pkg) => pkg.packageId === "ENG-001");
const reviewLifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
assert.ok(eng001);
assert.equal(eng001.engineId, "language-v1");
assert.equal(eng001.enabled, true);
assert.deepEqual(eng001.cpIds, ["ENG-001-CP001", "ENG-001-CP002", "ENG-001-CP003"]);
assert.deepEqual(eng001.supportedLanguages, ["en"]);
assert.deepEqual(eng001.supportedDifficulties, ["Easy", "Medium", "Hard"]);
assert.equal(eng001.runtimeMode, "review-only");
assert.equal(eng001.lifecycleStage, "REVIEW_ONLY");
assert.equal(eng001.questionBankStatus, reviewLifecycle.questionBankStatus);
assert.equal(eng001.questionBankWritable, false);
assert.equal(eng001.testEligible, false);
assert.equal(eng001.mockTestEligible, false);
assert.equal(eng001.publiclyPublishable, false);
assert.equal(eng001.metadata?.humanReviewApproved, true);
assert.equal(resolveQuestionStudioEngine({ packageId: "ENG-001" }).engineId, "language-v1");
assert.equal(getQuestionStudioEngine("language-v1").engineId, "language-v1");

// Package-only generation remains CP001 for backwards compatibility.
const eng001Result = await generateQuestionStudioQuestions({
  packageId: "ENG-001",
  language: "en",
  difficulty: "Easy",
  runtimeMode: "review-only",
  count: 2,
  seed: "engine-registry-eng001-smoke",
});
assert.equal(eng001Result.engineId, "language-v1");
assert.equal(eng001Result.questions.length, 2);
assert.equal(eng001Result.generationContext.packageId, "ENG-001");
assert.equal(eng001Result.generationContext.cpId, "ENG-001-CP001");
assert.equal(eng001Result.generationContext.stage, "REVIEW_ONLY");
assert.equal(eng001Result.generationContext.questionBankStatus, "NOT_STORED");
assert.equal(eng001Result.generationContext.questionBankWritable, false);
assert.equal(eng001Result.generationContext.productionReleaseAuthorized, false);

const eng001Cp002Result = await generateQuestionStudioQuestions({
  packageId: "ENG-001",
  canonicalProblemId: "ENG-001-CP002",
  subtopic: "Tenses and Sequence of Tenses",
  language: "en",
  difficulty: "Hard",
  runtimeMode: "review-only",
  count: 2,
  seed: "engine-registry-eng001-cp002-smoke",
});
assert.equal(eng001Cp002Result.questions.length, 2);
assert.equal(eng001Cp002Result.generationContext.cpId, "ENG-001-CP002");
assert.equal(eng001Cp002Result.generationContext.questionBankWritable, false);
assert.equal(eng001Cp002Result.questions.every((question) => question.cpId === "ENG-001-CP002"), true);
assert.equal(eng001Cp002Result.questions.every((question) => String(question.ruleId).startsWith("GR-TNS-")), true);
assert.equal(eng001Cp002Result.questions.every((question) => question.reviewOnly === true), true);

const eng001Cp003Result = await generateQuestionStudioQuestions({
  packageId: "ENG-001",
  canonicalProblemId: "ENG-001-CP003",
  subtopic: "Articles and Determiners",
  language: "en",
  difficulty: "Hard",
  runtimeMode: "review-only",
  count: 2,
  seed: "engine-registry-eng001-cp003-smoke",
});
assert.equal(eng001Cp003Result.questions.length, 2);
assert.equal(eng001Cp003Result.generationContext.cpId, "ENG-001-CP003");
assert.equal(eng001Cp003Result.generationContext.questionBankWritable, false);
assert.equal(eng001Cp003Result.questions.every((question) => question.cpId === "ENG-001-CP003"), true);
assert.equal(eng001Cp003Result.questions.every((question) => String(question.ruleId).startsWith("GR-ART-")), true);
assert.equal(eng001Cp003Result.questions.every((question) => question.reviewOnly === true), true);

console.log("[QUESTION-STUDIO-ENGINE-REGISTRY] PASS quant-v4 knowledge-v1 language-v1 ENG-001 CP001+CP002+CP003=review-only");
