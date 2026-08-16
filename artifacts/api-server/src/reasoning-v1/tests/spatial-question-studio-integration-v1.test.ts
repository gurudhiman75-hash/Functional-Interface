import { mkdirSync, writeFileSync } from "node:fs";

import { getGeneratedItemApprovalDisposition } from "../../lib/admin-question-studio-approval-policy";
import {
  SPATIAL_PERMANENT_QL_ALLOCATIONS_V1,
  SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V1,
} from "../foundation/spatial/spatial-permanent-ql-allocation-v1";
import { SPATIAL_QUESTION_STUDIO_PACKAGE_V1 } from "../foundation/spatial/spatial-question-studio-integration-v1";
import {
  generateSpatialStudioBatchV1,
  generateSpatialStudioQuestionV1,
} from "../foundation/spatial/spatial-question-studio-runtime-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.packageId === "SPA-001", "Spatial Question Studio package ID changed.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.enabled, "Spatial Question Studio package must be enabled.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.active, "Spatial Question Studio integration must be active.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.reviewOnly, "Spatial Question Studio must remain review-only.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.questionStudioVisible, "Spatial package must be visible in Question Studio.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.questionStudioDiscoverable, "Spatial package must be discoverable in Question Studio.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.registrationStatus === "REGISTERED", "Spatial package must be registered.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.permanentQlCount === 30, "Spatial Question Studio must expose exactly 30 permanent QLs.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.qlIds.length === 30, "Spatial Question Studio QL list must contain exactly 30 IDs.");
assert(new Set(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.qlIds).size === 30, "Spatial Question Studio contains duplicate permanent QLs.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.supportedLanguages.length === 1 && SPATIAL_QUESTION_STUDIO_PACKAGE_V1.supportedLanguages[0] === "en", "Spatial Question Studio must be English-only at this checkpoint.");
assert(!SPATIAL_QUESTION_STUDIO_PACKAGE_V1.questionBankWritable, "Spatial Question Bank writes must remain disabled.");
assert(!SPATIAL_QUESTION_STUDIO_PACKAGE_V1.testEligible, "Spatial Question Studio items must remain test-ineligible.");
assert(!SPATIAL_QUESTION_STUDIO_PACKAGE_V1.publiclyPublishable, "Spatial Question Studio items must remain non-public.");
assert(!SPATIAL_QUESTION_STUDIO_PACKAGE_V1.hindiPunjabiGeneration, "Hindi/Punjabi must remain locked.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.sourceScope.BANKING === "NOT_ESTABLISHED", "Banking source scope must not be overclaimed.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.sourceScope.PUNJAB_STATE === "NOT_ESTABLISHED", "Punjab-state source scope must not be overclaimed.");

const permanentIds = SPATIAL_PERMANENT_QL_ALLOCATIONS_V1.map((entry) => entry.permanentQlId);
assert(JSON.stringify(permanentIds) === JSON.stringify(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.qlIds), "Question Studio QL order must exactly preserve permanent allocation order.");
assert(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.holdsUnallocated.every((hold) => !SPATIAL_QUESTION_STUDIO_PACKAGE_V1.qlIds.includes(hold as never)), "A held Spatial pattern leaked into Question Studio.");

const generatedPerQl = 2;
let totalGenerated = 0;
let totalStimulusSvgs = 0;
let totalOptionSvgs = 0;
const chapterCounts: Record<string, number> = {};
const qlFingerprintCounts: Record<string, number> = {};

for (const allocation of SPATIAL_PERMANENT_QL_ALLOCATIONS_V1) {
  const fingerprints = new Set<string>();
  for (let sample = 0; sample < generatedPerQl; sample += 1) {
    const seed = `SPA-QS-INTEGRATION:${allocation.permanentQlId}:S${sample}`;
    const question = generateSpatialStudioQuestionV1({ qlId: allocation.permanentQlId, seed });
    const replay = generateSpatialStudioQuestionV1({ qlId: allocation.permanentQlId, seed });

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
    assert(question.lifecycle.reviewOnly, `${allocation.permanentQlId}/${seed}: review-only flag missing.`);
    assert(question.lifecycle.questionStudioDiscoverable, `${allocation.permanentQlId}/${seed}: Question Studio discoverability missing.`);
    assert(question.lifecycle.registrationStatus === "REGISTERED", `${allocation.permanentQlId}/${seed}: registration status mismatch.`);
    assert(question.lifecycle.questionBankStatus === "NOT_STORED" && !question.lifecycle.questionBankWritable, `${allocation.permanentQlId}/${seed}: Question Bank lock missing.`);
    assert(!question.lifecycle.testEligible && !question.lifecycle.publiclyPublishable, `${allocation.permanentQlId}/${seed}: downstream delivery lock missing.`);

    fingerprints.add(question.contentFingerprint);
    totalGenerated += 1;
    totalStimulusSvgs += question.stimulusSvgs.length;
    totalOptionSvgs += question.optionSvgs.length;
    chapterCounts[question.chapterCode] = (chapterCounts[question.chapterCode] ?? 0) + 1;
  }
  assert(fingerprints.size === generatedPerQl, `${allocation.permanentQlId}: two deterministic seeds collapsed to the same visible question.`);
  qlFingerprintCounts[allocation.permanentQlId] = fingerprints.size;
}

assert(totalGenerated === 60, `Expected 60 per-QL runtime questions, got ${totalGenerated}.`);
assert(totalOptionSvgs === 240, `Expected 240 rendered option SVGs, got ${totalOptionSvgs}.`);

const batch = generateSpatialStudioBatchV1({ seed: "SPA-QS-BATCH-50", count: 50 });
assert(batch.questions.length === 50, "Question Studio batch must generate 50 questions.");
assert(new Set(batch.questions.map((question) => question.contentFingerprint)).size === 50, "Question Studio batch contains duplicate visible questions.");
assert(batch.generationContext.questionStudioDiscoverable, "Batch context is not Question Studio discoverable.");
assert(batch.generationContext.registrationStatus === "REGISTERED", "Batch context is not registered.");
assert(batch.generationContext.questionBankStatus === "NOT_STORED" && !batch.generationContext.questionBankWritable, "Batch Question Bank lock missing.");
assert(!batch.generationContext.testEligible && !batch.generationContext.publiclyPublishable, "Batch downstream delivery lock missing.");

for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
  const filtered = generateSpatialStudioBatchV1({
    seed: `SPA-QS-DIFFICULTY:${difficulty}`,
    count: 8,
    difficulty,
  });
  assert(filtered.questions.length === 8, `${difficulty}: filtered batch count mismatch.`);
  assert(filtered.questions.every((question) => question.difficultyBand === difficulty), `${difficulty}: difficulty filter leaked another band.`);
}

for (const chapterCode of SPATIAL_QUESTION_STUDIO_PACKAGE_V1.chapters) {
  const filtered = generateSpatialStudioBatchV1({
    seed: `SPA-QS-CHAPTER:${chapterCode}`,
    count: 5,
    chapterCode,
  });
  assert(filtered.questions.every((question) => question.chapterCode === chapterCode), `${chapterCode}: chapter filter leaked another chapter.`);
}

const reviewOnlyDisposition = getGeneratedItemApprovalDisposition({
  packageId: "SPA-001",
  questionBankStatus: "NOT_STORED",
  questionBankWritable: false,
  generationContext: {
    reviewOnly: true,
    questionBankStatus: "NOT_STORED",
    questionBankWritable: false,
  },
});
assert(reviewOnlyDisposition.mode === "review_only", "Spatial review approval would incorrectly convert to Question Bank.");

const legacyDisposition = getGeneratedItemApprovalDisposition({ packageId: "LEGACY" });
assert(legacyDisposition.mode === "question_bank", "Review-only policy accidentally changed legacy approval behavior.");

const evidence = {
  status: "PASS_SPA_FND_001_QUESTION_STUDIO_INTEGRATION_V1",
  packageId: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.packageId,
  integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.integrationAuthority,
  permanentQlCount: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.permanentQlCount,
  generatedPerQl,
  totalPerQlRuntimeQuestions: totalGenerated,
  batchQuestions: batch.questions.length,
  totalRuntimeQuestionsAudited: totalGenerated + batch.questions.length + 24 + 25,
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
    reviewOnlyApprovalSkipsQuestionBank: true,
    legacyApprovalBehaviorPreserved: true,
    englishOnly: true,
    holdsExcluded: true,
    questionBankLocked: true,
    testsLocked: true,
    publicationLocked: true,
    hindiPunjabiLocked: true,
  },
  lifecycle: {
    questionStudioDiscoverable: true,
    registrationStatus: "REGISTERED",
    persistenceAllowed: true,
    questionBankStatus: "NOT_STORED",
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
  },
  nextGate: "SPATIAL_QUESTION_STUDIO_REVIEW_USAGE_AND_LOCALIZATION_V1",
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-question-studio-integration-v1-evidence.json",
  JSON.stringify(evidence, null, 2),
);
console.log(JSON.stringify(evidence, null, 2));
