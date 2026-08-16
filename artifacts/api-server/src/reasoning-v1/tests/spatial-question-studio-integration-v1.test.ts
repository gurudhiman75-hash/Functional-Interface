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

assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.packageId === "SPA-001", "Spatial package ID changed.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.runtimeMode === "CANONICAL_REVIEW", "Spatial must use canonical review runtime.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.reviewStatus === "APPROVED_EDITORIAL_CANONICAL", "Spatial editorial authority is not release-approved.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.questionStudioDiscoverable, "Spatial must be discoverable in Question Studio.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.registrationStatus === "REGISTERED", "Spatial must be registered in Question Studio.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.permanentQlCount === 30, "Spatial must expose exactly 30 permanent QLs.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.questionBankStatus === "READY_FOR_STORAGE", "Spatial must be Question Bank-ready after approval.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.testEligibility === "ELIGIBLE", "Spatial must hand test eligibility to Question Studio.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.publiclyPublishable, "Spatial must hand publication eligibility to global controls.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.mockTestEligible, "Spatial must be mock-test eligible after normal approval.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.manualApprovalRequired, "Spatial must require manual approval.");
assert(!SPATIAL_QUESTION_STUDIO_PACKAGE_V1.automaticStudentPublication, "Spatial must not auto-publish to students.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.supportedLanguages.join(",") === "en", "Spatial generator capability must remain English-only for now.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.sourceScope.BANKING === "NOT_ESTABLISHED", "Banking source scope was overclaimed.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.sourceScope.PUNJAB_STATE === "NOT_ESTABLISHED", "Punjab source scope was overclaimed.");

const permanentIds = SPATIAL_PERMANENT_QL_ALLOCATIONS_V1.map((entry) => entry.permanentQlId);
assert(JSON.stringify(permanentIds) === JSON.stringify(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.qlIds), "Question Studio QL order does not match permanent allocation.");
assert(
  SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.holdsUnallocated.every(
    (hold) => !SPATIAL_QUESTION_STUDIO_PACKAGE_V1.qlIds.includes(hold as never),
  ),
  "A held Spatial pattern leaked into Question Studio.",
);

const generatedPerQl = 2;
let totalGenerated = 0;
let totalStimulusSvgs = 0;
let totalOptionSvgs = 0;
let conversionChecks = 0;
const chapterCounts: Record<string, number> = {};

for (const allocation of SPATIAL_PERMANENT_QL_ALLOCATIONS_V1) {
  const fingerprints = new Set<string>();
  for (let sample = 0; sample < generatedPerQl; sample += 1) {
    const seed = `SPA-QS-INTEGRATION:${allocation.permanentQlId}:S${sample}`;
    const question = generateSpatialProductionStudioQuestionV1({
      qlId: allocation.permanentQlId,
      seed,
    });
    const replay = generateSpatialProductionStudioQuestionV1({
      qlId: allocation.permanentQlId,
      seed,
    });

    assert(JSON.stringify(question) === JSON.stringify(replay), `${allocation.permanentQlId}: deterministic replay mismatch.`);
    assert(question.qlId === allocation.permanentQlId, `${allocation.permanentQlId}: permanent QL trace mismatch.`);
    assert(question.chapterCode === allocation.chapterCode, `${allocation.permanentQlId}: chapter trace mismatch.`);
    assert(question.optionSvgs.length === 4, `${allocation.permanentQlId}: expected four SVG options.`);
    assert(question.optionSvgs.every((svg) => svg.includes("<svg") && svg.includes("</svg>")), `${allocation.permanentQlId}: invalid option SVG.`);
    assert(question.stimulusSvgs.every((svg) => svg.includes("<svg") && svg.includes("</svg>")), `${allocation.permanentQlId}: invalid stimulus SVG.`);
    assert(question.answer === question.optionLabels[question.correctIndex], `${allocation.permanentQlId}: answer mismatch.`);
    assert(question.validation.valid, `${allocation.permanentQlId}: runtime validation failed.`);
    assert(question.validation.semanticOptionUniqueness, `${allocation.permanentQlId}: semantic uniqueness failed.`);
    assert(question.validation.perceptualOptionUniqueness, `${allocation.permanentQlId}: perceptual uniqueness failed.`);
    assert(question.validation.learnerExplanationSafe, `${allocation.permanentQlId}: explanation safety failed.`);
    assert(question.lifecycle.questionBankStatus === "READY_FOR_STORAGE", `${allocation.permanentQlId}: Question Bank lifecycle mismatch.`);
    assert(question.lifecycle.testEligibility === "ELIGIBLE" && question.lifecycle.testEligible, `${allocation.permanentQlId}: test lifecycle mismatch.`);
    assert(question.lifecycle.publiclyPublishable && question.lifecycle.mockTestEligible, `${allocation.permanentQlId}: publication lifecycle mismatch.`);
    assert(question.lifecycle.manualApprovalRequired && !question.lifecycle.automaticStudentPublication, `${allocation.permanentQlId}: approval safety mismatch.`);

    const payload = productionPayload(question);
    assert(getGeneratedQuestionBankEligibilityIssue(payload) === null, `${allocation.permanentQlId}: standard Question Bank eligibility was blocked.`);
    assert(getGeneratedItemApprovalDisposition(payload).mode === "question_bank", `${allocation.permanentQlId}: approval would bypass normal Question Bank conversion.`);

    const normalized = normalizeGeneratedQuestionPayload(payload, {
      itemId: `${allocation.permanentQlId}-${sample}`,
      generationRunCode: "SPA-PRODUCTION-INTEGRATION",
    });
    assert(normalized.options.length === 4, `${allocation.permanentQlId}: canonical visual options missing.`);
    assert(
      normalized.options.every((option) => option.startsWith('<img src="data:image/svg+xml;base64,')),
      `${allocation.permanentQlId}: canonical options lost SVG content.`,
    );
    assert(
      normalized.options.every((option) => !/^\s*[ABCD]\s*$/.test(option)),
      `${allocation.permanentQlId}: canonical options collapsed to letter labels.`,
    );
    const stemImages = normalized.stem.match(/<img src="data:image\/svg\+xml;base64,/g) ?? [];
    assert(stemImages.length === question.stimulusSvgs.length, `${allocation.permanentQlId}: stimulus count changed during conversion.`);

    fingerprints.add(question.contentFingerprint);
    totalGenerated += 1;
    totalStimulusSvgs += question.stimulusSvgs.length;
    totalOptionSvgs += question.optionSvgs.length;
    conversionChecks += 1;
    chapterCounts[question.chapterCode] = (chapterCounts[question.chapterCode] ?? 0) + 1;
  }
  assert(fingerprints.size === generatedPerQl, `${allocation.permanentQlId}: deterministic seeds collapsed to one visible question.`);
}

assert(totalGenerated === 60, `Expected 60 per-QL runtime questions, got ${totalGenerated}.`);
assert(totalOptionSvgs === 240, `Expected 240 rendered option SVGs, got ${totalOptionSvgs}.`);
assert(conversionChecks === 60, `Expected 60 canonical conversion checks, got ${conversionChecks}.`);

const batch = generateSpatialProductionStudioBatchV1({ seed: "SPA-QS-BATCH-50", count: 50 });
assert(batch.questions.length === 50, "Question Studio batch must generate 50 questions.");
assert(new Set(batch.questions.map((question) => question.contentFingerprint)).size === 50, "Question Studio batch contains duplicate visible questions.");
assert(batch.generationContext.questionBankStatus === "READY_FOR_STORAGE", "Batch Question Bank lifecycle mismatch.");
assert(batch.generationContext.testEligibility === "ELIGIBLE" && batch.generationContext.testEligible, "Batch test lifecycle mismatch.");
assert(batch.generationContext.publiclyPublishable && batch.generationContext.mockTestEligible, "Batch publication lifecycle mismatch.");
assert(batch.generationContext.manualApprovalRequired && !batch.generationContext.automaticStudentPublication, "Batch approval safety mismatch.");

for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
  const filtered = generateSpatialProductionStudioBatchV1({
    seed: `SPA-QS-DIFFICULTY:${difficulty}`,
    count: 8,
    difficulty,
  });
  assert(filtered.questions.length === 8, `${difficulty}: filtered batch count mismatch.`);
  assert(filtered.questions.every((question) => question.difficultyBand === difficulty), `${difficulty}: filter leaked another difficulty.`);
}

for (const chapterCode of SPATIAL_QUESTION_STUDIO_PACKAGE_V1.chapters) {
  const filtered = generateSpatialProductionStudioBatchV1({
    seed: `SPA-QS-CHAPTER:${chapterCode}`,
    count: 5,
    chapterCode,
  });
  assert(filtered.questions.every((question) => question.chapterCode === chapterCode), `${chapterCode}: filter leaked another chapter.`);
}

const malformed = productionPayload(
  generateSpatialProductionStudioQuestionV1({
    qlId: "SPA-QL-001",
    seed: "SPA-QS-MALFORMED-VISUAL",
  }),
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
assert(malformedRejected, "Spatial conversion must fail closed when visual options are missing.");

const repoRoot = resolve(import.meta.dirname, "../../../../..");
const spatialRoute = readFileSync(resolve(repoRoot, "artifacts/api-server/src/routes/admin-question-studio-spatial.ts"), "utf8");
const dashboardRoute = readFileSync(resolve(repoRoot, "artifacts/api-server/src/routes/admin-question-studio.ts"), "utf8");
const cockpit = readFileSync(resolve(repoRoot, "artifacts/admin-app/src/pages/content/QuestionStudioCockpitPage.tsx"), "utf8");
const studentRichText = readFileSync(resolve(repoRoot, "artifacts/examtree/src/components/QuestionRichText.tsx"), "utf8");

assert(spatialRoute.includes("PRODUCTION_REVIEW"), "Spatial route still advertises review-only activation.");
assert(spatialRoute.includes("generateSpatialProductionStudioBatchV1"), "Spatial route bypasses the production adapter.");
assert(!spatialRoute.includes("INSERT INTO content.questions"), "Spatial route directly writes Question Bank instead of shared approval.");
assert(dashboardRoute.includes("'stimulusSvgs', v.payload -> 'stimulusSvgs'"), "Shared dashboard drops Spatial stimulus SVGs.");
assert(dashboardRoute.includes("'optionSvgs', v.payload -> 'optionSvgs'"), "Shared dashboard drops Spatial option SVGs.");
assert(cockpit.includes("itemStimulusSvgs"), "Shared cockpit does not read Spatial stimulus SVGs.");
assert(cockpit.includes("itemOptionSvgs"), "Shared cockpit does not read Spatial option SVGs.");
assert(cockpit.includes("SpatialSvgFigure"), "Shared cockpit does not render Spatial figures.");
assert(studentRichText.includes('"img"'), "Student rich-text renderer does not allow image content.");
assert(studentRichText.includes('"src"'), "Student rich-text renderer does not allow image sources.");

assert(
  getGeneratedItemApprovalDisposition({ packageId: "LEGACY" }).mode === "question_bank",
  "Standard approval policy accidentally changed legacy behavior.",
);

const evidence = {
  status: "PASS_SPA_FND_001_STANDARD_QUESTION_STUDIO_LIFECYCLE_V1",
  packageId: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.packageId,
  integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.integrationAuthority,
  releaseAuthority: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.authority,
  permanentQlCount: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.permanentQlCount,
  generatedPerQl,
  totalPerQlRuntimeQuestions: totalGenerated,
  batchQuestions: batch.questions.length,
  conversionChecks,
  totalStimulusSvgs,
  totalOptionSvgs,
  chapterCounts,
  checks: {
    allThirtyQlsGenerate: true,
    deterministicReplay: true,
    semanticOptionUniqueness: true,
    perceptualOptionUniqueness: true,
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
