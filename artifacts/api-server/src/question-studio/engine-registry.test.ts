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
assert.deepEqual(engines, ["quant-v4", "knowledge-v1", "language-v1", "reasoning-v1"]);

const packages = listQuestionStudioPackages();
assert.equal(packages.length > 0, true);
assert.equal(packages.every((pkg) => pkg.packageId.length > 0), true);
assert.equal(packages.every((pkg) => pkg.supportedLanguages.length > 0), true);

const quantPackage = packages.find((pkg) => pkg.engineId === "quant-v4");
assert.ok(quantPackage);
assert.equal(resolveQuestionStudioEngine({ packageId: quantPackage.packageId }).engineId, "quant-v4");
assert.equal(resolveQuestionStudioEngine({ topic: "Arithmetic", subtopic: "Percentage" }).engineId, "quant-v4");
assert.equal(getQuestionStudioEngine("quant-v4").engineId, "quant-v4");
assert.equal(getQuestionStudioEngine("reasoning-v1").engineId, "reasoning-v1");

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

const com002Result = await generateQuestionStudioQuestions({ packageId: "COM-002", language: "pa", runtimeMode: "review-only", count: 2, seed: "engine-registry-com002-smoke" });
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
assert.deepEqual(eng001.cpIds, ["ENG-001-CP001", "ENG-001-CP002", "ENG-001-CP003", "ENG-001-CP004", "ENG-001-CP005", "ENG-001-CP006", "ENG-001-CP007", "ENG-001-CP008", "ENG-001-CP009", "ENG-001-CP010", "ENG-001-CP011", "ENG-001-CP012", "ENG-001-CP013"]);
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

const eng001Result = await generateQuestionStudioQuestions({ packageId: "ENG-001", language: "en", difficulty: "Easy", runtimeMode: "review-only", count: 2, seed: "engine-registry-eng001-smoke" });
assert.equal(eng001Result.engineId, "language-v1");
assert.equal(eng001Result.questions.length, 2);
assert.equal(eng001Result.generationContext.packageId, "ENG-001");
assert.equal(eng001Result.generationContext.cpId, "ENG-001-CP001");
assert.equal(eng001Result.generationContext.stage, "REVIEW_ONLY");
assert.equal(eng001Result.generationContext.questionBankStatus, "NOT_STORED");
assert.equal(eng001Result.generationContext.questionBankWritable, false);
assert.equal(eng001Result.generationContext.productionReleaseAuthorized, false);

for (const [cpId, subtopic, rulePrefix, difficulty] of [
  ["ENG-001-CP002", "Tenses and Sequence of Tenses", "GR-TNS-", "Hard"],
  ["ENG-001-CP003", "Articles and Determiners", "GR-ART-", "Hard"],
  ["ENG-001-CP004", "Pronouns", "GR-PRN-", "Hard"],
  ["ENG-001-CP005", "Prepositions", "GR-PRP-", "Hard"],
  ["ENG-001-CP006", "Adjectives, Adverbs and Comparison", "GR-CMP-", "Hard"],
  ["ENG-001-CP007", "Conjunctions & Parallelism", "GR-CON-", "Hard"],
  ["ENG-001-CP008", "Nouns & Quantifiers", "GR-NQN-", "Hard"],
  ["ENG-001-CP009", "Gerunds, Infinitives & Participles", "GR-GIP-", "Hard"],
  ["ENG-001-CP010", "Modifiers", "GR-MOD-", "Hard"],
  ["ENG-001-CP011", "Conditionals", "GR-CND-", "Hard"],
  ["ENG-001-CP012", "Voice & Narration", "GR-VNR-", "Hard"],
  ["ENG-001-CP013", "Common Usage / Idiomatic Grammar", "GR-USG-", "Hard"],
] as const) {
  const result = await generateQuestionStudioQuestions({ packageId: "ENG-001", canonicalProblemId: cpId, subtopic, language: "en", difficulty, runtimeMode: "review-only", count: 2, seed: `engine-registry-${cpId.toLowerCase()}-smoke` });
  assert.equal(result.questions.length, 2);
  assert.equal(result.generationContext.cpId, cpId);
  assert.equal(result.generationContext.questionBankWritable, false);
  assert.equal(result.questions.every((question) => question.cpId === cpId), true);
  assert.equal(result.questions.every((question) => String(question.ruleId).startsWith(rulePrefix)), true);
  assert.equal(result.questions.every((question) => question.reviewOnly === true), true);
}

const env001 = packages.find((pkg) => pkg.packageId === "ENV-001");
assert.ok(env001);
assert.equal(env001.engineId, "knowledge-v1");
assert.equal(env001.enabled, true);
assert.equal(env001.cpIds.length, 20);
assert.deepEqual(env001.supportedLanguages, ["en", "hi", "pa"]);
assert.deepEqual(env001.supportedDifficulties, ["Easy", "Medium", "Hard"]);
assert.equal(env001.runtimeMode, "review-only");
assert.equal(env001.lifecycleStage, "REVIEW_ONLY");
assert.equal(env001.questionBankStatus, "NOT_STORED");
assert.equal(env001.questionBankWritable, false);
assert.equal(env001.testEligible, false);
assert.equal(env001.mockTestEligible, false);
assert.equal(env001.publiclyPublishable, false);
assert.equal(env001.productionReleaseAuthorized, false);
assert.equal(env001.metadata?.qlCount, 255);
assert.equal(env001.metadata?.questionsPerLanguage, 1020);
assert.equal(resolveQuestionStudioEngine({ packageId: "ENV-001" }).engineId, "knowledge-v1");

const env001Result = await generateQuestionStudioQuestions({
  packageId: "ENV-001",
  canonicalProblemId: "ENV-CP-018",
  language: "pa",
  difficulty: "Mixed",
  runtimeMode: "review-only",
  count: 2,
  seed: "engine-registry-env001-smoke",
});
assert.equal(env001Result.engineId, "knowledge-v1");
assert.equal(env001Result.questions.length, 2);
assert.equal(env001Result.questions.every((question) => question.packageId === "ENV-001"), true);
assert.equal(env001Result.questions.every((question) => question.cpId === "ENV-CP-018"), true);
assert.equal(env001Result.questions.every((question) => question.language === "pa"), true);
assert.equal(env001Result.questions.every((question) => question.reviewOnly === true), true);
assert.equal(env001Result.questions.every((question) => question.questionBankWritable === false), true);

console.log("[QUESTION-STUDIO-ENGINE-REGISTRY] PASS quant-v4 knowledge-v1 language-v1 reasoning-v1 ENG-001 CP001+CP002+CP003+CP004+CP005+CP006+CP007+CP008+CP009+CP010+CP011+CP012+CP013=review-only");
