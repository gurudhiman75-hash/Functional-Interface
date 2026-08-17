import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  getGeneratedQuestionBankEligibilityIssue,
  normalizeGeneratedQuestionPayload,
} from "../../lib/admin-question-conversion";
import { getGeneratedItemApprovalDisposition } from "../../lib/admin-question-studio-approval-policy";
import { FGC_001_ENGLISH_FREEZE_AUTHORITY_V1 } from "../foundation/spatial/figure-completion-english-freeze-v1";
import { FGC_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1 } from "../foundation/spatial/figure-completion-hi-pa-localization-freeze-v1";
import {
  SPATIAL_PERMANENT_QL_ALLOCATIONS_V1,
  SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V1,
} from "../foundation/spatial/spatial-permanent-ql-allocation-v1";
import {
  SPATIAL_FGC_PERMANENT_QL_ALLOCATIONS_V2,
  SPATIAL_PERMANENT_QL_ALLOCATIONS_V2,
  SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V2,
} from "../foundation/spatial/spatial-permanent-ql-allocation-v2";
import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V1,
  SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1,
} from "../foundation/spatial/spatial-question-studio-integration-v1";
import {
  SPATIAL_HI_PA_LOCALIZATION_AUTHORITY_V1,
  SPATIAL_QUESTION_STUDIO_LANGUAGES_V1,
  type SpatialQuestionStudioLanguageV1,
} from "../foundation/spatial/spatial-question-studio-localization-v1";
import {
  generateSpatialProductionStudioBatchV1,
  generateSpatialProductionStudioQuestionV1,
  type SpatialProductionStudioQuestionV1,
} from "../foundation/spatial/spatial-question-studio-production-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function visualProjection(question: SpatialProductionStudioQuestionV1) {
  return {
    qlId: question.qlId,
    proposalId: question.proposalId,
    chapterCode: question.chapterCode,
    difficultyBand: question.difficultyBand,
    seed: question.seed,
    generationSeed: question.generationSeed,
    mode: question.mode,
    stimulusSvgs: question.stimulusSvgs,
    optionSvgs: question.optionSvgs,
    optionLabels: question.optionLabels,
    correctIndex: question.correctIndex,
    answer: question.answer,
    canonicalItemId: question.canonicalItemId,
    contentFingerprint: question.contentFingerprint,
    renderer: question.renderer,
    validation: question.validation,
  };
}

function learnerText(question: SpatialProductionStudioQuestionV1): string {
  return [
    question.qlName,
    question.stem,
    question.explanation.observation,
    question.explanation.rule,
    question.explanation.application,
    question.explanation.check,
  ].join("\n");
}

function assertTargetScript(question: SpatialProductionStudioQuestionV1) {
  const text = learnerText(question);
  if (question.language === "hi") {
    assert(/[\u0900-\u097f]/u.test(text), `${question.qlId}: Hindi learner text has no Devanagari.`);
    assert(!/[\u0a00-\u0a7f]/u.test(text), `${question.qlId}: Hindi learner text leaked Gurmukhi.`);
    assert(!/\b(choose|select|figure|mirror|water|series|rule|apply|check|option)\b/i.test(text), `${question.qlId}: Hindi learner text leaked core English instruction wording.`);
  }
  if (question.language === "pa") {
    assert(/[\u0a00-\u0a7f]/u.test(text), `${question.qlId}: Punjabi learner text has no Gurmukhi.`);
    assert(!/[\u0900-\u097f]/u.test(text), `${question.qlId}: Punjabi learner text leaked Devanagari.`);
    assert(!/\b(choose|select|figure|mirror|water|series|rule|apply|check|option)\b/i.test(text), `${question.qlId}: Punjabi learner text leaked core English instruction wording.`);
  }
}

function conversionPayload(question: SpatialProductionStudioQuestionV1) {
  return {
    ...question,
    text: question.stem,
    options: [...question.optionLabels],
    correct: question.correctIndex,
    correctIndex: question.correctIndex,
    answer: question.answer,
    canonicalAnswer: question.answer,
    explanation: [
      question.explanation.observation,
      question.explanation.rule,
      question.explanation.application,
      question.explanation.check,
    ].join("\n\n"),
    runtimeMode: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.runtimeMode,
    reviewStatus: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.reviewStatus,
    questionBankStatus: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.questionBankStatus,
    testEligibility: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.testEligibility,
    publiclyPublishable: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.publiclyPublishable,
    mockTestEligible: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.mockTestEligible,
    manualApprovalRequired: true,
    automaticStudentPublication: false,
    integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.integrationAuthority,
    localizationAuthority: question.localization.authority,
    releaseAuthority: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.authority,
  };
}

assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.packageId === "SPA-001", "Spatial package ID changed.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.permanentQlCount === 34, "Spatial must expose exactly 34 permanent QLs after FGC integration.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.frozenBasePermanentQlCount === 30, "Frozen P0 count changed.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.fgcPermanentQlCount === 4, "FGC allocation count is not four.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.chapters.includes("FGC-001"), "FGC is not registered as a Spatial chapter.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.questionStudioDiscoverable, "Spatial is not discoverable.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.registrationStatus === "REGISTERED", "Spatial is not registered.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.questionBankStatus === "READY_FOR_STORAGE", "Spatial is not storage-ready after approval.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.testEligibility === "ELIGIBLE", "Spatial test lifecycle is not standard.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.manualApprovalRequired, "Spatial must require manual approval.");
assert(!SPATIAL_QUESTION_STUDIO_PACKAGE_V1.automaticStudentPublication, "Spatial must never auto-publish generated questions.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.sourceAllocationAuthority === SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V2.authorityId, "Spatial package is not pinned to allocation V2.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.frozenBaseAllocationAuthority === SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.authorityId, "Frozen P0 authority was not retained.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.fgcEnglishFreezeAuthority === FGC_001_ENGLISH_FREEZE_AUTHORITY_V1.authorityId, "FGC English freeze authority mismatch.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.fgcLocalizationAuthority === FGC_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId, "FGC localization freeze authority mismatch.");

const baseIds = SPATIAL_PERMANENT_QL_ALLOCATIONS_V1.map((entry) => entry.permanentQlId);
const combinedIds = SPATIAL_PERMANENT_QL_ALLOCATIONS_V2.map((entry) => entry.permanentQlId);
assert(JSON.stringify(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.qlIds) === JSON.stringify(combinedIds), "Question Studio order differs from allocation V2.");
assert(JSON.stringify(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.qlIds.slice(0, 30)) === JSON.stringify(baseIds), "Frozen P0 QL order changed.");
assert(new Set(combinedIds).size === 34, "Combined Spatial QL IDs are not unique.");

const fgcCounts: Record<string, number> = { en: 0, hi: 0, pa: 0 };
let fgcConversionChecks = 0;
let fgcParityChecks = 0;
let fgcRenderedStimuli = 0;
let fgcRenderedOptions = 0;

for (const allocation of SPATIAL_FGC_PERMANENT_QL_ALLOCATIONS_V2) {
  for (let sample = 0; sample < 2; sample += 1) {
    const seed = `SPA-FGC-QS:${allocation.permanentQlId}:S${sample}`;
    const byLanguage = new Map<SpatialQuestionStudioLanguageV1, SpatialProductionStudioQuestionV1>();
    for (const language of SPATIAL_QUESTION_STUDIO_LANGUAGES_V1) {
      const question = generateSpatialProductionStudioQuestionV1({
        qlId: allocation.permanentQlId,
        seed,
        language,
      });
      const replay = generateSpatialProductionStudioQuestionV1({
        qlId: allocation.permanentQlId,
        seed,
        language,
      });
      assert(JSON.stringify(question) === JSON.stringify(replay), `${allocation.permanentQlId}/${language}: deterministic replay mismatch.`);
      assert(question.chapterCode === "FGC-001", `${allocation.permanentQlId}/${language}: FGC chapter trace lost.`);
      assert(question.language === language, `${allocation.permanentQlId}/${language}: language mismatch.`);
      assert(question.optionSvgs.length === 4, `${allocation.permanentQlId}/${language}: expected four options.`);
      assert(question.optionSvgs.every((svg) => svg.includes("<svg") && svg.includes("</svg>")), `${allocation.permanentQlId}/${language}: invalid option SVG.`);
      assert(question.stimulusSvgs.length === 1 && question.stimulusSvgs[0]!.includes("<svg"), `${allocation.permanentQlId}/${language}: FGC stimulus missing.`);
      assert(question.renderer.recommendedStimulusPixels === 384, `${allocation.permanentQlId}/${language}: FGC stimulus review size was reduced.`);
      assert(question.renderer.mobileMinimumOptionPixels === 104, `${allocation.permanentQlId}/${language}: mobile option floor changed.`);
      assert(question.answer === question.optionLabels[question.correctIndex], `${allocation.permanentQlId}/${language}: answer/index mismatch.`);
      assert(question.validation.valid && question.validation.semanticOptionUniqueness && question.validation.perceptualOptionUniqueness && question.validation.learnerExplanationSafe, `${allocation.permanentQlId}/${language}: source validation contract failed.`);
      assert(question.lifecycle.questionBankStatus === "READY_FOR_STORAGE", `${allocation.permanentQlId}/${language}: Question Bank lifecycle mismatch.`);
      assert(question.lifecycle.testEligibility === "ELIGIBLE" && question.lifecycle.testEligible, `${allocation.permanentQlId}/${language}: test lifecycle mismatch.`);
      assert(question.lifecycle.publiclyPublishable && question.lifecycle.mockTestEligible, `${allocation.permanentQlId}/${language}: normal downstream eligibility missing.`);
      assert(question.lifecycle.manualApprovalRequired && !question.lifecycle.automaticStudentPublication, `${allocation.permanentQlId}/${language}: approval safety mismatch.`);
      assert(question.localization.authority === FGC_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId, `${allocation.permanentQlId}/${language}: FGC localization freeze authority lost.`);
      assertTargetScript(question);

      const payload = conversionPayload(question);
      assert(getGeneratedQuestionBankEligibilityIssue(payload) === null, `${allocation.permanentQlId}/${language}: standard Question Bank eligibility blocked.`);
      assert(getGeneratedItemApprovalDisposition(payload).mode === "question_bank", `${allocation.permanentQlId}/${language}: approval bypasses normal Question Bank conversion.`);
      const normalized = normalizeGeneratedQuestionPayload(payload, {
        itemId: `${allocation.permanentQlId}-${language}-${sample}`,
        generationRunCode: "SPA-FGC-STANDARD-INTEGRATION",
      });
      assert(normalized.options.length === 4, `${allocation.permanentQlId}/${language}: canonical options missing.`);
      assert(normalized.options.every((option) => option.startsWith('<img src="data:image/svg+xml;base64,')), `${allocation.permanentQlId}/${language}: canonical conversion lost SVG options.`);
      assert((normalized.stem.match(/<img src="data:image\/svg\+xml;base64,/g) ?? []).length === 1, `${allocation.permanentQlId}/${language}: canonical conversion lost FGC stimulus.`);

      byLanguage.set(language, question);
      fgcCounts[language] += 1;
      fgcConversionChecks += 1;
      fgcRenderedStimuli += question.stimulusSvgs.length;
      fgcRenderedOptions += question.optionSvgs.length;
    }

    const en = byLanguage.get("en")!;
    const hi = byLanguage.get("hi")!;
    const pa = byLanguage.get("pa")!;
    assert(JSON.stringify(visualProjection(en)) === JSON.stringify(visualProjection(hi)), `${allocation.permanentQlId}: English/Hindi FGC visual parity failed.`);
    assert(JSON.stringify(visualProjection(en)) === JSON.stringify(visualProjection(pa)), `${allocation.permanentQlId}: English/Punjabi FGC visual parity failed.`);
    assert(en.canonicalItemId === hi.canonicalItemId && en.canonicalItemId === pa.canonicalItemId, `${allocation.permanentQlId}: frozen canonical ID changed by language.`);
    assert(en.questionLanguageId === hi.questionLanguageId && en.questionLanguageId === pa.questionLanguageId, `${allocation.permanentQlId}: frozen FGC language ID invariant changed.`);
    assert(en.contentFingerprint === hi.contentFingerprint && en.contentFingerprint === pa.contentFingerprint, `${allocation.permanentQlId}: frozen content fingerprint changed by language.`);
    fgcParityChecks += 2;
  }
}

assert(JSON.stringify(fgcCounts) === JSON.stringify({ en: 8, hi: 8, pa: 8 }), `FGC multilingual coverage mismatch: ${JSON.stringify(fgcCounts)}.`);
assert(fgcConversionChecks === 24, `Expected 24 FGC conversion checks, got ${fgcConversionChecks}.`);
assert(fgcParityChecks === 16, `Expected 16 FGC direct parity checks, got ${fgcParityChecks}.`);
assert(fgcRenderedStimuli === 24, `Expected 24 rendered FGC stimuli, got ${fgcRenderedStimuli}.`);
assert(fgcRenderedOptions === 96, `Expected 96 rendered FGC options, got ${fgcRenderedOptions}.`);

for (const language of SPATIAL_QUESTION_STUDIO_LANGUAGES_V1) {
  const fgcBatch = generateSpatialProductionStudioBatchV1({
    seed: `SPA-FGC-BATCH:${language}`,
    count: 12,
    chapterCode: "FGC-001",
    language,
  });
  assert(fgcBatch.questions.length === 12, `${language}: FGC batch count mismatch.`);
  assert(fgcBatch.questions.every((question) => question.chapterCode === "FGC-001"), `${language}: FGC chapter filter leaked another chapter.`);
  assert(new Set(fgcBatch.questions.map((question) => question.contentFingerprint)).size === 12, `${language}: FGC batch contains duplicate semantic content.`);

  const fullBatch = generateSpatialProductionStudioBatchV1({
    seed: `SPA-FULL-34:${language}`,
    count: 34,
    language,
  });
  assert(fullBatch.questions.length === 34, `${language}: full Spatial 34 batch count mismatch.`);
  assert(new Set(fullBatch.questions.map((question) => question.qlId)).size === 34, `${language}: full 34 batch did not exercise every permanent QL once.`);
  assert(fullBatch.questions.some((question) => question.chapterCode === "FGC-001"), `${language}: full batch omitted FGC.`);
}

const p0Smoke = generateSpatialProductionStudioQuestionV1({ qlId: "SPA-QL-001", seed: "SPA-P0-NONREGRESSION", language: "hi" });
assert(p0Smoke.chapterCode === "MIR-001", "P0 dispatch was replaced by FGC integration.");
assert(p0Smoke.localization.authority === SPATIAL_HI_PA_LOCALIZATION_AUTHORITY_V1, "P0 localization authority changed.");
assert(p0Smoke.lifecycle.questionBankStatus === "READY_FOR_STORAGE", "P0 standard lifecycle regressed.");

const repoRoot = resolve(import.meta.dirname, "../../../../..");
const spatialRoute = readFileSync(resolve(repoRoot, "artifacts/api-server/src/routes/admin-question-studio-spatial.ts"), "utf8");
const spatialPanel = readFileSync(resolve(repoRoot, "artifacts/admin-app/src/pages/content/QuestionStudioSpatialReviewPanel.tsx"), "utf8");
const spatialApi = readFileSync(resolve(repoRoot, "artifacts/admin-app/src/features/question-studio/spatial-review-api.ts"), "utf8");
assert(spatialRoute.includes("generateSpatialProductionStudioBatchV1"), "Spatial route bypasses shared production adapter.");
assert(!spatialRoute.includes("INSERT INTO content.questions"), "Spatial route directly writes Question Bank instead of shared approval.");
assert(spatialPanel.includes("'FGC-001': 'Figure Completion'"), "Spatial panel has no Figure Completion label.");
assert(spatialPanel.includes("34 permanent QLs"), "Spatial panel still advertises 30 QLs.");
assert(spatialPanel.includes("max-w-[384px]"), "Spatial panel does not preserve the larger FGC stimulus review surface.");
assert(spatialPanel.includes("क्या देखें") && spatialPanel.includes("ਕੀ ਵੇਖਣਾ"), "Spatial panel does not use approved simple HI/PA explanation labels.");
assert(spatialApi.includes("'FGC-001'"), "Spatial admin API type does not expose FGC.");

const evidence = {
  status: "PASS_SPA_FGC_001_STANDARD_QUESTION_STUDIO_INTEGRATION_V1",
  packageId: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.packageId,
  integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.integrationAuthority,
  allocationAuthority: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V2.authorityId,
  frozenBaseAllocationAuthority: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.authorityId,
  fgcEnglishFreezeAuthority: FGC_001_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
  fgcLocalizationFreezeAuthority: FGC_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
  permanentQlCount: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.permanentQlCount,
  frozenBaseQlCount: 30,
  fgcQlCount: 4,
  fgcCounts,
  fgcConversionChecks,
  fgcParityChecks,
  fgcRenderedStimuli,
  fgcRenderedOptions,
  checks: {
    p0AllocationPreserved: true,
    fgcUsesFrozenGenerator: true,
    deterministicReplay: true,
    englishHindiPunjabiParity: true,
    frozenCanonicalIdsPreserved: true,
    frozenFingerprintsPreserved: true,
    semanticAndPerceptualUniqueness: true,
    uniqueAnswerAuthorityRetained: true,
    standardApprovalDisposition: true,
    svgCanonicalConversion: true,
    fgcChapterAndQlFiltering: true,
    full34QlBatchCoverage: true,
    largerFgcReviewSurface: true,
    simpleLocalizationLabels: true,
    automaticStudentPublicationDisabled: true,
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
  nextGate: "EXACT_HEAD_CI_AND_HUMAN_QUESTION_STUDIO_REVIEW",
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-fgc-question-studio-integration-v1-evidence.json",
  JSON.stringify(evidence, null, 2),
);
console.log(JSON.stringify(evidence, null, 2));
