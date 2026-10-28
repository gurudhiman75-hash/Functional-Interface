import { strict as assert } from "node:assert";

import {
  generateQuestionStudioQuestions,
  getQuestionStudioEngine,
  listQuestionStudioEngines,
  listQuestionStudioPackages,
  resolveQuestionStudioEngine,
  validateQuestionStudioPackage,
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
assert.ok(packages.find((pkg) => pkg.packageId === "PCT-001")?.cpIds.length,
  "Legacy canonicalProblems must retain executable Percentage CP selectors.");
assert.equal(packages.some((pkg) => pkg.packageId === "PCT-ALL"), false,
  "The mixed Percentage selector must not be registered as an executable package.");
assert.equal(packages.find((pkg) => pkg.packageId === "CAL-001")?.engineId, "reasoning-v1",
  "Calendar must retain its native reasoning engine owner.");
for (const packageId of [
  ...Array.from({length: 7}, (_, index) =>
    `REASONING_V1_BLR_001_CP_${String(index + 1).padStart(3, "0")}`),
  "IOP-001",
]) {
  const pkg = packages.find((entry) => entry.packageId === packageId);
  assert.ok(pkg, `${packageId}: native reasoning source package must remain registered`);
  assert.equal(pkg.engineId, "reasoning-v1", `${packageId}: must not appear under Quant`);
  assert.equal(pkg.subject, "Reasoning Ability", `${packageId}: must use canonical Reasoning subject`);
  assert.equal(pkg.enabled, true);
  assert.equal(pkg.questionBankWritable, false);
  assert.equal(pkg.testEligible, false);
  assert.equal(pkg.publiclyPublishable, false);
}

for (const packageId of ["PRB-001", "PRB-002", "TRG-001", "TRG-002"]) {
  const pkg = packages.find((entry) => entry.packageId === packageId);
  assert.ok(pkg);
  assert.equal(pkg.lifecycleStage, undefined, `${packageId}: incompatible standard stage`);
  assert.equal(pkg.questionBankAcceptanceMode, "FULL_RELEASE");
  assert.equal(pkg.publiclyPublishable, false);
}
// These packages have established Question Bank or item-release contracts.
// Production chapter-review admission must use a distinct executable surface,
// rather than changing the canonical package into a REVIEW_ONLY card.
for (const packageId of ["PNL-001", "MEN-002", "SAP"]) {
  const pkg = packages.find((entry) => entry.packageId === packageId);
  assert.ok(pkg, packageId + ": canonical executable package missing");
  assert.notEqual(pkg.lifecycleStage, "REVIEW_ONLY",
    packageId + ": canonical acceptance authority must not be overwritten");
  assert.ok(pkg.cpIds.length > 0, packageId + ": canonical CP selection missing");
}
assert.deepEqual(packages.find((pkg) => pkg.packageId === "TRG-002")?.supportedDifficulties,
  ["Easy", "Medium", "Hard"], "Legacy lowercase Trigonometry difficulties must survive normalization.");
for (const packageId of ["BLR-001", "CAE-001"]) {
  const pkg = packages.find((entry) => entry.packageId === packageId);
  assert.ok(pkg);
  assert.equal(pkg.lifecycleStage, "REVIEW_ONLY");
  assert.equal(pkg.questionBankWritable, false);
  assert.equal(pkg.testEligible, false);
  assert.equal(pkg.publiclyPublishable, false);
}
for (const packageId of ["PGK-001", "PGK-001-MTF-V1", "COA-001"]) {
  const pkg = packages.find((entry) => entry.packageId === packageId);
  assert.ok(pkg);
  assert.equal(pkg.lifecycleStage, undefined, `${packageId}: conflicting inherited stage`);
  assert.equal(pkg.testEligible, true, `${packageId}: existing approval gate changed`);
  assert.equal(pkg.mockTestEligible, true, `${packageId}: existing approval gate changed`);
}

const legacyLifecycleCard = {
  engineId: "quant-v4" as const,
  packageId: "LEGACY-REVIEW",
  topic: "Arithmetic",
  subtopic: "Legacy review",
  label: "Legacy review",
  enabled: true,
  cpIds: ["LEGACY-CP-001"],
  supportedLanguages: ["en" as const],
  supportedDifficulties: ["Easy" as const],
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
  productionReleaseAuthorized: false,
};
assert.equal(validateQuestionStudioPackage(legacyLifecycleCard), legacyLifecycleCard);
// Older released cards also keep their declared gates without an invented
// REVIEW_ONLY or BANK_ONLY stage.
const legacyReleasedCard = {
  ...legacyLifecycleCard,
  packageId: "LEGACY-RELEASED",
  questionBankWritable: true,
  testEligible: true,
  publiclyPublishable: true,
};
assert.equal(validateQuestionStudioPackage(legacyReleasedCard), legacyReleasedCard);
assert.throws(
  () => validateQuestionStudioPackage({
    ...legacyLifecycleCard,
    lifecycleId: QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1.lifecycleId,
  }),
  /declare a lifecycle authority must declare lifecycleStage/,
);
assert.equal(
  new Set(packages.map((pkg) => pkg.packageId)).size,
  packages.length,
  "Question Studio package IDs must be globally unique across all registered engines.",
);

assert.throws(
  () => validateQuestionStudioPackage({
    engineId: "knowledge-v1",
    packageId: "BROKEN-NO-CP",
    topic: "Broken",
    subtopic: "Broken",
    label: "Broken",
    enabled: true,
    cpIds: [],
    supportedLanguages: ["en"],
    supportedDifficulties: ["Easy"],
  }),
  /at least one CP or dynamic candidate CP is required/,
);

assert.throws(
  () => validateQuestionStudioPackage({
    engineId: "knowledge-v1",
    packageId: "BROKEN-DIFFICULTY",
    topic: "Broken",
    subtopic: "Broken",
    label: "Broken",
    enabled: true,
    cpIds: ["BROKEN-CP-001"],
    supportedLanguages: ["en"],
    supportedDifficulties: [],
  }),
  /difficulty filtering is enabled but supportedDifficulties is empty/,
);

assert.throws(
  () => validateQuestionStudioPackage({
    engineId: "knowledge-v1",
    packageId: "BROKEN-LIFECYCLE",
    topic: "Broken",
    subtopic: "Broken",
    label: "Broken",
    enabled: true,
    cpIds: ["BROKEN-CP-001"],
    supportedLanguages: ["en"],
    supportedDifficulties: ["Easy"],
    runtimeMode: "review-only",
    lifecycleStage: "REVIEW_ONLY",
    questionBankWritable: true,
  }),
  /REVIEW_ONLY cannot be Question Bank writable/,
);

assert.doesNotThrow(() => validateQuestionStudioPackage({
  engineId: "knowledge-v1",
  packageId: "VALID-REVIEW",
  topic: "Valid",
  subtopic: "Valid",
  label: "Valid",
  enabled: true,
  cpIds: ["VALID-CP-001"],
  supportedLanguages: ["en", "hi", "pa"],
  supportedDifficulties: ["Easy", "Medium", "Hard"],
  runtimeMode: "review-only",
  supportedRuntimeModes: ["review-only"],
  lifecycleStage: "REVIEW_ONLY",
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
  productionReleaseAuthorized: false,
}));

const quantPackage = packages.find((pkg) => pkg.engineId === "quant-v4");
assert.ok(quantPackage);
assert.equal(resolveQuestionStudioEngine({ packageId: quantPackage.packageId }).engineId, "quant-v4");
assert.equal(resolveQuestionStudioEngine({ topic: "Arithmetic", subtopic: "Percentage" }).engineId, "quant-v4");
assert.equal(getQuestionStudioEngine("quant-v4").engineId, "quant-v4");
assert.equal(getQuestionStudioEngine("reasoning-v1").engineId, "reasoning-v1");
assert.throws(
  () => resolveQuestionStudioEngine({ packageId: "DOES-NOT-EXIST" }),
  /package DOES-NOT-EXIST is not registered/,
);
assert.throws(
  () => resolveQuestionStudioEngine({ packageId: "COM-001", engineId: "quant-v4" }),
  /package COM-001 belongs to knowledge-v1, not quant-v4/,
);

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
assert.deepEqual(com001.supportedDifficulties, ["Easy", "Medium"]);
assert.equal(com001.difficultyFilterSupported, true);
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

// Executable smoke: the PNL dynamic review package must be distinct from
// canonical PNL-001 and must never inherit release authority.
const pnlCanonical = packages.find((pkg) => pkg.packageId === "PNL-001");
const pnlReview = packages.find((pkg) => pkg.packageId === "PNL-001-REVIEW");
assert.ok(pnlCanonical && pnlReview, "PNL canonical and review packages must coexist");
assert.notEqual(pnlCanonical.lifecycleStage, "REVIEW_ONLY");
assert.equal(pnlReview.lifecycleStage, "REVIEW_ONLY");
assert.equal(pnlReview.reviewSurfaceRequired, true);
assert.equal(pnlReview.manualApprovalRequired, true);
assert.equal(pnlReview.questionBankWritable, false);
assert.equal(pnlReview.productionReleaseAuthorized, false);
assert.equal(pnlReview.publiclyPublishable, false);
assert.ok(pnlReview.cpIds.length > 0);
const pnlResult = await generateQuestionStudioQuestions({
  packageId: "PNL-001-REVIEW",
  canonicalProblemId: pnlReview.cpIds[0],
  language: pnlReview.supportedLanguages[0],
  count: 1,
  seed: "engine-registry-pnl-dynamic-review-smoke",
});
assert.equal(pnlResult.questions.length, 1);
assert.equal(pnlResult.generationContext.runtimeMode, "DYNAMIC_CANDIDATE");
assert.equal(pnlResult.generationContext.questionBankWritable, false);
assert.equal(pnlResult.generationContext.publiclyPublishable, false);
assert.equal(pnlResult.generationContext.productionReleaseAuthorized, false);

const probabilityNativeReview = packages.find((pkg) => pkg.packageId === "PRB-NATIVE-REVIEW");
assert.ok(probabilityNativeReview?.cpIds.length, "Probability native review must expose executable CPs");
assert.deepEqual(probabilityNativeReview.supportedLanguages, ["hi", "pa"]);
assert.equal(probabilityNativeReview.lifecycleStage, "REVIEW_ONLY");
assert.equal(probabilityNativeReview.productionReleaseAuthorized, false);
assert.equal(probabilityNativeReview.publiclyPublishable, false);
assert.equal(probabilityNativeReview.questionBankWritable, false);
const probabilityNativeResult = await generateQuestionStudioQuestions({
  packageId: "PRB-NATIVE-REVIEW",
  canonicalProblemId: probabilityNativeReview.cpIds[0],
  language: "pa",
  count: 1,
  seed: "engine-registry-probability-native-review-smoke",
});
assert.equal(probabilityNativeResult.questions.length, 1);
assert.equal(probabilityNativeResult.questions[0].packageId, "PRB-NATIVE-REVIEW");
assert.equal(probabilityNativeResult.generationContext.questionBankWritable, false);
assert.equal(probabilityNativeResult.generationContext.productionReleaseAuthorized, false);

const menReview = packages.find((pkg) => pkg.packageId === "MEN-002-REVIEW");
assert.ok(menReview);
assert.deepEqual(menReview.cpIds, ["MEN-CP-009"]);
assert.equal(menReview.lifecycleStage, "REVIEW_ONLY");
assert.equal(menReview.questionBankWritable, false);
assert.equal(menReview.productionReleaseAuthorized, false);
const menReviewResult = await generateQuestionStudioQuestions({
  packageId: "MEN-002-REVIEW",
  canonicalProblemId: "MEN-CP-009",
  language: "pa",
  seed: "men-002-separated-native-review-smoke",
  count: 1,
});
assert.equal(menReviewResult.questions.length, 1);
assert.equal(menReviewResult.questions[0].packageId, "MEN-002-REVIEW");
assert.equal(menReviewResult.generationContext.questionBankWritable, false);

const sapOriginal = packages.find((pkg) => pkg.packageId === "SAP");
const sapReview = packages.find((pkg) => pkg.packageId === "SAP-REVIEW");
assert.ok(sapOriginal && sapReview);
assert.notEqual(sapOriginal.lifecycleStage, "REVIEW_ONLY");
assert.equal(sapReview.lifecycleStage, "REVIEW_ONLY");
assert.equal(sapReview.questionBankWritable, false);
assert.equal(sapReview.productionReleaseAuthorized, false);
assert.deepEqual(sapReview.cpIds, sapOriginal.cpIds);
const sapReviewResult = await generateQuestionStudioQuestions({
  packageId: "SAP-REVIEW",
  canonicalProblemId: sapReview.cpIds[0],
  language: sapReview.supportedLanguages[0],
  count: 1,
  seed: "sap-separate-question-studio-review-smoke",
});
assert.equal(sapReviewResult.questions.length, 1);
assert.equal(sapReviewResult.questions[0].packageId, "SAP-REVIEW");
assert.equal(sapReviewResult.generationContext.questionBankWritable, false);
assert.equal(sapReviewResult.generationContext.publiclyPublishable, false);

// All separately registered admin-review surfaces must deny publication,
// independently of their canonical bank-capable source packages.
for (const packageId of ["PNL-001-REVIEW", "PRB-NATIVE-REVIEW", "MEN-002-REVIEW", "SAP-REVIEW"]) {
  const pkg = packages.find((entry) => entry.packageId === packageId);
  assert.ok(pkg, packageId + ": missing executable review registration");
  assert.equal(pkg.enabled, true, packageId);
  assert.ok(pkg.cpIds.length > 0, packageId + ": no selectable CPs");
  assert.equal(pkg.reviewSurfaceRequired, true, packageId);
  assert.equal(pkg.manualApprovalRequired, true, packageId);
  assert.equal(pkg.questionBankWritable, false, packageId);
  assert.equal(pkg.testEligible, false, packageId);
  assert.equal(pkg.publiclyPublishable, false, packageId);
  assert.equal(pkg.automaticStudentPublication, false, packageId);
  assert.equal(pkg.productionReleaseAuthorized, false, packageId);
}

// Diagnostic-only production chapter-admission recount. This must not
// alter package authority or call the generation/publication pathways.
const admissionReasons = (pkg: (typeof packages)[number]) => {
  const reasons: string[] = [];
  if (pkg.enabled !== true) reasons.push("NOT_ENABLED");
  if (pkg.reviewSurfaceRequired !== true) reasons.push("NO_REVIEW_SURFACE_AUTHORITY");
  if (pkg.manualApprovalRequired !== true) reasons.push("NO_MANUAL_APPROVAL_REQUIREMENT");
  if (pkg.productionReleaseAuthorized !== false) reasons.push("PRODUCTION_RELEASE_LOCK_UNDECLARED");
  if (pkg.automaticStudentPublication !== false) reasons.push("AUTO_PUBLICATION_LOCK_UNDECLARED");
  if (pkg.publiclyPublishable !== false) reasons.push("PUBLICATION_LOCK_UNDECLARED");
  if (!Array.isArray(pkg.cpIds) || !pkg.cpIds.length) reasons.push("NO_CANONICAL_CHECKPOINTS");
  else {
    if (new Set(pkg.cpIds).size !== pkg.cpIds.length) reasons.push("DUPLICATE_CHECKPOINTS");
    if (pkg.cpIds.some((id) => !/^[A-Z][A-Z0-9-]{1,80}$/.test(id))) reasons.push("INVALID_CHECKPOINT_ID");
  }
  return reasons;
};
const chapterAdmissionExcluded = packages.map((pkg) => ({
  engineId: pkg.engineId,
  packageId: pkg.packageId,
  reasons: admissionReasons(pkg),
})).filter((entry) => entry.reasons.length > 0);
console.log("QS_CHAPTER_ADMISSION_RECOUNT", JSON.stringify({
  registered: packages.length,
  eligible: packages.length - chapterAdmissionExcluded.length,
  excluded: chapterAdmissionExcluded.length,
  byEngine: Object.fromEntries(engines.map((engineId) => ({
    engineId,
    registered: packages.filter((p) => p.engineId === engineId).length,
    eligible: packages.filter((p) => p.engineId === engineId && admissionReasons(p).length === 0).length,
    excluded: chapterAdmissionExcluded.filter((p) => p.engineId === engineId).length,
  })).map((row) => [row.engineId, row])),
}));
for (const entry of chapterAdmissionExcluded) {
  console.log("QS_CHAPTER_ADMISSION_EXCLUDED", JSON.stringify(entry));
}

// Catalog-wide, declaration-only multilingual coverage inventory.
// A declared language is NOT proof that every CP generates localized content.
const auditLanguages = ["en", "hi", "pa"] as const;
const eligibleForAdmission = packages.filter((pkg) => admissionReasons(pkg).length === 0);
const languageRows = packages.map((pkg) => {
  const declared = auditLanguages.filter((lang) => pkg.supportedLanguages.includes(lang));
  const missing = auditLanguages.filter((lang) => !pkg.supportedLanguages.includes(lang));
  return {
    engineId: pkg.engineId,
    packageId: pkg.packageId,
    admissionEligible: admissionReasons(pkg).length === 0,
    cpCount: pkg.cpIds.length,
    declared,
    missing,
    fullTrilingualDeclared: missing.length === 0,
    runtimeVerifiedLanguages: [] as string[],
    runtimeVerificationStatus: "NOT_AUDITED",
  };
});
const eligibleLanguageRows = languageRows.filter((row) => row.admissionEligible);
console.log("QS_MULTILINGUAL_DECLARATION_SUMMARY", JSON.stringify({
  registered: packages.length,
  eligible: eligibleForAdmission.length,
  allThreeDeclared: languageRows.filter((row) => row.fullTrilingualDeclared).length,
  eligibleAllThreeDeclared: eligibleLanguageRows.filter((row) => row.fullTrilingualDeclared).length,
  eligibleMissingAtLeastOne: eligibleLanguageRows.filter((row) => !row.fullTrilingualDeclared).length,
  byEngine: Object.fromEntries(engines.map((engineId) => {
    const group = eligibleLanguageRows.filter((row) => row.engineId === engineId);
    return [engineId, {
      eligible: group.length,
      fullTrilingualDeclared: group.filter((row) => row.fullTrilingualDeclared).length,
      missingAny: group.filter((row) => !row.fullTrilingualDeclared).length,
      declaredByLanguage: Object.fromEntries(auditLanguages.map((lang) => [
        lang, group.filter((row) => row.declared.includes(lang)).length,
      ])),
    }];
  })),
  limitation: "Declarations only; actual per-CP localized generation unverified",
}));
for (const row of languageRows) {
  console.log("QS_MULTILINGUAL_PACKAGE", JSON.stringify(row));
}

assert.deepEqual(packages.find((pkg) => pkg.packageId === "RNK-001")?.supportedLanguages, ["en"], "RNK-001 localization candidates are not approved runtime languages");
// Offline, bounded multilingual generation probes across the four engines.
// Declaration coverage is reported separately; these probes do not certify
// every checkpoint or editorial quality.
const multilingualProbeIds = ["TRG-002", "OPS-001", "COM-001"];
for (const packageId of multilingualProbeIds) {
  const pkg = packages.find((entry) => entry.packageId === packageId);
  assert.ok(pkg, "Missing probe package: " + packageId);
  assert.deepEqual(["en", "hi", "pa"].filter((lang) =>
    !pkg.supportedLanguages.includes(lang)), [], packageId + " missing declaration");
  for (const language of ["en", "hi", "pa"] as const) {
    const request = {
      packageId,
      canonicalProblemId: pkg.cpIds[0],
      language,
      count: 1,
      seed: "qs-multilingual-smoke-" + packageId + "-" + language,
    };
    const result = await generateQuestionStudioQuestions(request);
    assert.equal(result.questions.length, 1, packageId + "/" + language);
    const question = result.questions[0];
    assert.ok(question, packageId + "/" + language + " missing question");
    console.log("QS_MULTILINGUAL_RUNTIME_PROBE", JSON.stringify({
      packageId, cpId: pkg.cpIds[0], language,
      generated: true, editorialLanguageParityVerified: false,
    }));
  }
}

// Extend successful single-checkpoint smoke probes to three distinct CPs
// per representative engine. These remain offline generation checks only.
for (const packageId of ["TRG-002", "OPS-001", "COM-001"]) {
  const pkg = packages.find((entry) => entry.packageId === packageId);
  assert.ok(pkg, packageId + " missing from the canonical catalog");
  const cpIds = pkg.cpIds.slice(0, 3);
  assert.equal(cpIds.length, 3, packageId + " has fewer than three checkpoints");
  for (const cpId of cpIds) {
    for (const language of ["en", "hi", "pa"] as const) {
      const result = await generateQuestionStudioQuestions({
        packageId, canonicalProblemId: cpId, language, count: 1,
        seed: "qs-multilingual-checkpoint-" + packageId + "-" + cpId + "-" + language,
      });
      assert.equal(result.questions.length, 1,
        packageId + "/" + cpId + "/" + language + " did not generate exactly one question");
      console.log("QS_MULTILINGUAL_CHECKPOINT_PROBE", JSON.stringify({
        packageId, cpId, language, generated: true,
        editorialLanguageParityVerified: false,
      }));
    }
  }
}

console.log("[QUESTION-STUDIO-ENGINE-REGISTRY] PASS quant-v4 knowledge-v1 language-v1 reasoning-v1 ENG-001 CP001+CP002+CP003+CP004+CP005+CP006+CP007+CP008+CP009+CP010+CP011+CP012+CP013=review-only");
