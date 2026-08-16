import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  getGeneratedQuestionBankEligibilityIssue,
  normalizeGeneratedQuestionPayload,
} from "../../lib/admin-question-conversion";
import { getGeneratedItemApprovalDisposition } from "../../lib/admin-question-studio-approval-policy";
import {
  SPATIAL_PERMANENT_QL_ALLOCATIONS_V1,
  SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V1,
} from "../foundation/spatial/spatial-permanent-ql-allocation-v1";
import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V1,
  SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1,
} from "../foundation/spatial/spatial-question-studio-integration-v1";
import {
  generateSpatialProductionStudioBatchV1,
  generateSpatialProductionStudioQuestionV1,
  type SpatialProductionStudioQuestionV1,
} from "../foundation/spatial/spatial-question-studio-production-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function productionPayload(question: SpatialProductionStudioQuestionV1) {
  return {
    ...question,
    text: question.stem,
    options: [...question.optionLabels],
    correct: question.correctIndex,
    correctIndex: question.correctIndex,
    answer: question.answer,
    canonicalAnswer: question.answer,
    explanation: [
      `Observe: ${question.explanation.observation}`,
      `Rule: ${question.explanation.rule}`,
      `Apply: ${question.explanation.application}`,
      `Check: ${question.explanation.check}`,
    ].join("\n\n"),
    runtimeMode: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.runtimeMode,
    reviewStatus: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.reviewStatus,
    questionBankStatus: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.questionBankStatus,
    testEligibility: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.testEligibility,
    publiclyPublishable: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.publiclyPublishable,
    mockTestEligible: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.mockTestEligible,
    manualApprovalRequired: true,
    automaticStudentPublication: false,
    releaseAuthority: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.authority,
  };
}

assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.packageId === "SPA-001", "Spatial Question Studio package ID changed.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.enabled, "Spatial Question Studio package must be enabled.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.active, "Spatial Question Studio integration must be active.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.runtimeMode === "CANONICAL_REVIEW", "Spatial must use the standard canonical review runtime.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.reviewStatus === "APPROVED_EDITORIAL_CANONICAL", "Spatial editorial authority must be release-approved.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.questionStudioVisible, "Spatial package must be visible in Question Studio.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.questionStudioDiscoverable, "Spatial package must be discoverable in Question Studio.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.registrationStatus === "REGISTERED", "Spatial package must be registered.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.permanentQlCount === 30, "Spatial Question Studio must expose exactly 30 permanent QLs.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.qlIds.length === 30, "Spatial Question Studio QL list must contain exactly 30 IDs.");
assert(new Set(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.qlIds).size === 30, "Spatial Question Studio contains duplicate permanent QLs.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.supportedLanguages.length === 1 && SPATIAL_QUESTION_STUDIO_PACKAGE_V1.supportedLanguages[0] === "en", "Spatial Question Studio must remain English-only until localization exists.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.questionBankStatus === "READY_FOR_STORAGE", "Spatial must be eligible for standard Question Bank conversion after approval.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.testEligibility === "ELIGIBLE", "Spatial must hand test eligibility to the standard lifecycle.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.publiclyPublishable, "Spatial must hand publication eligibility to standard controls.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.mockTestEligible, "Spatial must be mock-test eligible after normal approval.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.manualApprovalRequired, "Spatial must still require manual Question Studio approval.");
assert(!SPATIAL_QUESTION_STUDIO_PACKAGE_V1.automaticStudentPublication, "Spatial must never auto-publish to students on generation or approval.");
assert(!SPATIAL_QUESTION_STUDIO_PACKAGE_V1.hindiPunjabiGeneration, "Hindi/Punjabi generation must remain unavailable until content exists.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.sourceScope.BANKING === "NOT_ESTABLISHED", "Banking source scope must not be overclaimed.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.sourceScope.PUNJAB_STATE === "NOT_ESTABLISHED", "Punjab-state source scope must not be overclaimed.");

const permanentIds = SPATIAL_PERMANENT_QL_ALLOCATIONS_V1.map((entry) => entry.permanentQlId);
assert(JSON.stringify(permanentIds) === JSON.stringify(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.qlIds), "Question Studio QL order must exactly preserve permanent allocation order.");
assert(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.holdsUnallocated.every((hold) => !SPATIAL_QUESTION_STUDIO_PACKAGE_V1.qlIds.includes(hold as never)), "A held Spatial pattern leaked into Question Studio.");

const generatedPerQl = 2;
let totalGenerated = 0;
let totalStimulusSvgs = 0;
let totalOptionSvgs = 0;
let conversionChecks = 0;
const chapterCounts: Record<string, number> = {};
const qlFingerprintCounts: Record<string, number> = {};

for (const allocation of SPATIAL_PERMANENT_QL_ALLOCATIONS_V1) {
  const fingerprints = new Set<string>();
  for (let sample = 0; sample < generatedPerQl; sample += 1) {
    const seed = `SPA-QS-INTEGRATION:${allocation.permanentQlId}:S${sample}`;
    const question = generateSpatialProductionStudioQuestionV1({ qlId: allocation.permanentQlId, seed });
    const replay = generateSpatialProductionStudioQuestionV1({ qlId: allocation.permanentQlId, seed });

    assert(JSON.stringify(question) === JSON.stringify(replay), `${allocation.permanentQlId}/${seed}: deterministic replay mismatch.`);
    assert(question.qlId === allocation.permanentQlId, `${allocation.permanentQlId}/${seed}: permanent QL trace mismatch.`);
    assert(question.proposalId === allocation.proposalId, `${allocation.permanentQlId}/${seed}: proposal trace mismatch.`);
    assert(question.chapterCode === allocation.chapterCode, `${allocation.permanentQlId}/${seed}: chapter trace mismatch.`);
    assert(question.optionSvgs.length === 4, `${allocation.permanentQlId}/${seed}: expected four SVG options.`);
    assert(question.optionLabels.join("") === "ABCD", `${allocation.permanentQlId}/${seed}: option labels must be A/B/C/D.`);
    assert(question.optionSvgs.every((svg) => svg.includes("<svg") && svg.includes("</svg>")), `${allocation.permanentQlId}/${seed}: invalid rendered option SVG.`);
    assert(question.stimulusSvgs.every((svg) => svg.includes("<svg") && svg.includes("</svg>")), `${allocation.permanentQlId}/${seed}: invalid rendered stimulus SVG.`);
    assert(question.correctIndex >= 0 && question.correctIndex <= 3, `${allocation.permanentQlId}/${seed}: correct index out of range.`);
    assert(question.answer === question.optionLabels[question.correctIndex], `${allocation.permanentQlId}/${seed}: answer letter mismatch.`);
    assert(question.explanation.observation.length > 10, `${allocation.permanentQlId}/${seed}: observation too short.`);
    assert(question.explanation.rule.length > 10, `${allocation.permanentQlId}/${seed}: rule too short.`);
    assert(question.explanation.application.length > 10, `${allocation.permanentQlId}/${seed}: application too short.`);
    assert(question.explanation.check.length > 10, `${allocation.permanentQlId}/${seed}: check too short.`);
    assert(question.validation.valid, `${allocation.permanentQlId}/${seed}: runtime validation not true.`);
    assert(question.validation.semanticOptionUniqueness, `${allocation.permanentQlId}/${seed}: semantic uniqueness missing.`);
    assert(question.validation.perceptualOptionUniqueness, `${allocation.permanentQlId}/${seed}: perceptual uniqueness missing.`);
    assert(question.validation.learnerExplanationSafe, `${allocation.permanentQlId}/${seed}: explanation safety missing.`);
    assert(question.lifecycle.questionBankStatus === "READY_FOR_STORAGE", `${allocation.permanentQlId}/${seed}: production Question Bank status missing.`);
    assert(question.lifecycle.testEligibility === "ELIGIBLE" && question.lifecycle.testEligible, `${allocation.permanentQlId}/${seed}: production test eligibility missing.`);
    assert(question.lifecycle.publiclyPublishable && question.lifecycle.mockTestEligible, `${allocation.permanentQlId}/${seed}: downstream lifecycle handoff missing.`);
    assert(question.lifecycle.manualApprovalRequired && !question.lifecycle.automaticStudentPublication, `${allocation.permanentQlId}/${seed}: approval/publication safety mismatch.`);

    const payload = productionPayload(question);
    assert(getGeneratedQuestionBankEligibilityIssue(payload) === null, `${allocation.permanentQlId}/${seed}: standard Question Bank eligibility unexpectedly blocked.`);
    assert(getGeneratedItemApprovalDisposition(payload).mode === "question_bank", `${allocation.permanentQlId}/${seed}: approval would not use the normal Question Bank lifecycle.`);
    const normalized = normalizeGeneratedQuestionPayload(payload, {
      itemId: `${allocation.permanentQlId}-${sample}`,
      generationRunCode: "SPA-PRODUCTION-INTEGRATION",
    });
    assert(normalized.options.length === 4, `${allocation.permanentQlId}/${seed}: normalized Spatial options missing.`);
    assert(normalized.options.every((option) => option.startsWith('<img src="data:image/svg+xml;base64,')), `${allocation.permanentQlId}/${seed}: canonical options lost SVG visual content.`);
    assert(normalized.options.every((option) => !/^\s*[ABCD]\s*$/.test(option)), `${allocation.permanentQlId}/${seed}: canonical options collapsed to letter labels.`);
    const stemImageCount = (normalized.stem.match(/<img src="data:image\/svg\+xml;base64,/g) ?? []).length;
    assert(stemImageCount === question.stimulusSvgs.length, `${allocation.permanentQlId}/${seed}: stimulus SVG count changed during canonical conversion.`);

    fingerprints.add(question.contentFingerprint);
    totalGenerated += 1;
    totalStimulusSvgs += question.stimulusSvgs.length;
    totalOptionSvgs += question.optionSvgs.length;
    conversionChecks += 1;
    chapterCounts[question.chapterCode] = (chapterCounts[question.chapterCode] ?? 0) + 1;
  }
  assert(fingerprints.size === generatedPerQl, `${allocation.permanentQlId}: two deterministic seeds collapsed to the same visible question.`);
  qlFingerprintCounts[allocation.permanentQlId] = fingerprints.size;
}

assert(totalGenerated === 60, `Expected 60 per-QL runtime questions, got ${totalGenerated}.`);
assert(totalOptionSvgs === 240, `Expected 240 rendered option SVGs, got ${totalOptionSvgs}.`);
assert(conversionChecks === 60, `Expected 60 canonical conversion checks, got ${conversionChecks}.`);

const batch = generateSpatialProductionStudioBatchV1({ seed: "SPA-QS-BATCH-50", count: 50 });
assert(batch.questions.length === 50, "Question Studio batch must generate 50 questions.");
assert(new Set(batch.questions.map((question) => question.contentFingerprint)).size === 50, "Question Studio batch contains duplicate visible questions.");
assert(batch.generationContext.questionStudioDiscoverable, "Batch context is not Question Studio discoverable.");
assert(batch.generationContext.registrationStatus === "REGISTERED", "Batch context is not registered.");
assert(batch.generationContext.questionBankStatus === "READY_FOR_STORAGE", "Batch is not Question Bank-ready after approval.");
assert(batch.generationContext.testEligibility === "ELIGIBLE" && batch.generationContext.testEligible, "Batch test eligibility did not hand off to Question Studio.");
assert(batch.generationContext.publiclyPublishable && batch.generationContext.mockTestEligible, "Batch publication/mock eligibility missing.");
assert(batch.generationContext.manualApprovalRequired && !batch.generationContext.automaticStudentPublication, "Batch approval/publication safety mismatch.");

for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
  const filtered = generateSpatialProductionStudioBatchV1({
    seed: `SPA-QS-DIFFICULTY:${difficulty}`,
    count: 8,
    difficulty,
  });
  assert(filtered.questions.length === 8, `${difficulty}: filtered batch count mismatch.`);
  assert(filtered.questions.every((question) => question.difficultyBand === difficulty), `${difficulty}: difficulty filter leaked another band.`);
}

for (const chapterCode of SPATIAL_QUESTION_STUDIO_PACKAGE_V1.chapters) {
  const filtered = generateSpatialProductionStudioBatchV1({
    seed: `SPA-QS-CHAPTER:${chapterCode}`,
    count: 5,
    chapterCode,
  });
  assert(filtered.questions.every((question) => question.chapterCode === chapterCode), `${chapterCode}: chapter filter leaked another chapter.`);
}

const malformed = productionPayload(
  generateSpatialProductionStudioQuestionV1({ qlId: "SPA-QL-001", seed: "SPA-QS-MALFORMED-VISUAL" }),
);
malformed.optionSvgs = malformed.optionSvgs.slice(0, 3);
let malformedRejected = false;
try {
  normalizeGeneratedQuestionPayload(malformed, {
    itemId: "SPA-MALFORMED",
    generationRunCode: "SPA-PRODUCTION-INTEGRATION",
  });
} catch {
  malformedRejected = true;
}
assert(malformedRejected, "Spatial canonical conversion must fail closed when visual options are missing.");

const repoRoot = resolve(import.meta.dirname, "../../../../..");
const spatialRoute = readFileSync(resolve(repoRoot, "artifacts/api-server/src/routes/admin-question-studio-spatial.ts"), "utf8");
const dashboardRoute = readFileSync(resolve(repoRoot, "artifacts/api-server/src/routes/admin-question-studio.ts"), "utf8");
const cockpit = readFileSync(resolve(repoRoot, "artifacts/admin-app/src/pages/content/QuestionStudioCockpitPage.tsx"), "utf8");
const studentRichText = readFileSync(resolve(repoRoot, "artifacts/examtree/src/components/QuestionRichText.tsx"), "utf8");

assert(spatialRoute.includes("PRODUCTION_REVIEW"), "Spatial route still advertises review-only activation.");
assert(spatialRoute.includes("generateSpatialProductionStudioBatchV1"), "Spatial route bypasses the production lifecycle adapter.");
assert(!spatialRoute.includes("INSERT INTO content.questions"), "Spatial route must not directly write Question Bank; shared approval owns conversion.");
assert(dashboardRoute.includes("'stimulusSvgs', v.payload -> 'stimulusSvgs'"), "Shared Question Studio dashboard drops Spatial stimulus SVGs.");
assert(dashboardRoute.includes("'optionSvgs', v.payload -> 'optionSvgs'"), "Shared Question Studio dashboard drops Spatial option SVGs.");
assert(cockpit.includes("itemStimulusSvgs"), "Shared Question Studio cockpit does not read Spatial stimulus SVGs.");
assert(cockpit.includes("itemOptionSvgs"), "Shared Question Studio cockpit does not read Spatial option SVGs.");
assert(cockpit.includes("SpatialSvgFigure"), "Shared Question Studio cockpit does not render Spatial figures.");
assert(studentRichText.includes("'img'"), "Student rich-text renderer does not allow image content.");
assert(studentRichText.includes("'src'"), "Student rich-text renderer does not allow image sources.");

const legacyDisposition = getGeneratedItemApprovalDisposition({ packageId: "LEGACY" });
assert(legacyDisposition.mode === "question_bank", "Standard approval policy accidentally changed legacy behavior.");

const evidence = {
  status: "PASS_SPA_FND_001_STANDARD_QUESTION_STUDIO_LIFECYCLE_V1",
  packageId: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.packageId,
  integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.integrationAuthority,
  releaseAuthority: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.authority,
  permanentQlCount: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.permanentQlCount,
  generatedPerQl,
  totalPerQlRuntimeQuestions: totalGenerated,
  batchQuestions: batch.questions.length,
  totalRuntimeQuestionsAudited: totalGenerated + batch.questions.length + 24 + 25,
  conversionChecks,
  totalStimulusSvgs,
  totalOptionSvgs,
  chapterCounts,
  qlFingerprintCounts,
  checks: {
    exactPermanentQlMapping: true,
    allThirtyQlsGenerate: true,
    deterministicReplay: true,
    svgRendering: true,
    semanticOptionUniqueness: true,
    perceptualOptionUniqueness: true,
    learnerExplanationSafety: true,
    fiftyQuestionUniqueBatch: true,
    chapterFilters: true,
    difficultyFilters: true,
    standardApprovalDisposition: true,
    questionBankEligibilityAfterApproval: true,
    spatialSvgCanonicalConversion: true,
    malformedVisualFailClosed: true,
    sharedCockpitVisualReview: true,
    sharedStudentRichContentContract: true,
    automaticStudentPublicationDisabled: true,
    englishOnlyGeneratorCapability: true,
    holdsExcluded: true,
  },
  lifecycle: {
    questionStudioDiscoverable: true,
    registrationStatus: "REGISTERED",
    persistenceAllowed: true,
    questionBankStatus: "READY_FOR_STORAGE",
    testEligibility: "ELIGIBLE",
    publiclyPublishable: true,
    mockTestEligible: true,
    manualApprovalRequired: true,
    automaticStudentPublication: false,
  },
  nextGate: "NORMAL_QUESTION_STUDIO_OPERATION",
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-question-studio-integration-v1-evidence.json",
  JSON.stringify(evidence, null, 2),
);
console.log(JSON.stringify(evidence, null, 2));
