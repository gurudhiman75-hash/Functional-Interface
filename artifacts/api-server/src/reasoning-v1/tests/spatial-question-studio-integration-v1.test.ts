import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  getGeneratedQuestionBankEligibilityIssue,
  normalizeGeneratedQuestionPayload,
} from "../../lib/admin-question-conversion";
import { getGeneratedItemApprovalDisposition } from "../../lib/admin-question-studio-approval-policy";
import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V1,
  SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1,
} from "../foundation/spatial/spatial-question-studio-integration-v1";
import {
  SPATIAL_QUESTION_STUDIO_LANGUAGES_V1,
  type SpatialQuestionStudioLanguageV1,
} from "../foundation/spatial/spatial-question-studio-localization-v1";
import {
  generateSpatialProductionStudioQuestionV1,
  type SpatialProductionStudioQuestionV1,
} from "../foundation/spatial/spatial-question-studio-production-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
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

assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.packageId === "SPA-001", "Legacy Spatial package ID changed.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.permanentQlCount === 34, "Frozen 34-QL Spatial package changed.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.frozenBasePermanentQlCount === 30, "Frozen P0 count changed.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.fgcPermanentQlCount === 4, "Frozen FGC count changed.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.qlIds.length === 34, "Frozen 34-QL order length changed.");
assert(new Set(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.qlIds).size === 34, "Frozen 34-QL package contains duplicate IDs.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.qlIds[0] === "SPA-QL-001", "Frozen Spatial range no longer starts at SPA-QL-001.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.qlIds[33] === "SPA-QL-034", "Frozen Spatial range no longer ends at SPA-QL-034.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.chapters.includes("FGC-001"), "Frozen FGC chapter registration disappeared.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.registrationStatus === "REGISTERED", "Frozen 34-QL package lost registration.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.persistenceAllowed, "Frozen 34-QL package lost persistence eligibility.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.manualApprovalRequired, "Frozen 34-QL package must still require manual approval.");
assert(!SPATIAL_QUESTION_STUDIO_PACKAGE_V1.automaticStudentPublication, "Frozen 34-QL package must never auto-publish.");

let generated = 0;
let conversionChecks = 0;
const languageCounts: Record<SpatialQuestionStudioLanguageV1, number> = { en: 0, hi: 0, pa: 0 };

for (const qlId of SPATIAL_QUESTION_STUDIO_PACKAGE_V1.qlIds) {
  for (const language of SPATIAL_QUESTION_STUDIO_LANGUAGES_V1) {
    const seed = `SPA-LEGACY-34-COMPAT:${qlId}:${language}`;
    const question = generateSpatialProductionStudioQuestionV1({ qlId, seed, language });
    const replay = generateSpatialProductionStudioQuestionV1({ qlId, seed, language });
    assert(JSON.stringify(question) === JSON.stringify(replay), `${qlId}/${language}: frozen deterministic replay changed.`);
    assert(question.qlId === qlId, `${qlId}/${language}: frozen QL dispatch changed.`);
    assert(question.language === language, `${qlId}/${language}: frozen language dispatch changed.`);
    assert(question.optionSvgs.length === 4, `${qlId}/${language}: frozen four-option contract changed.`);
    assert(question.answer === question.optionLabels[question.correctIndex], `${qlId}/${language}: answer/index mismatch.`);
    assert(question.lifecycle.registrationStatus === "REGISTERED", `${qlId}/${language}: frozen registration lifecycle changed.`);
    assert(question.lifecycle.persistenceAllowed, `${qlId}/${language}: frozen persistence lifecycle changed.`);
    assert(question.lifecycle.manualApprovalRequired, `${qlId}/${language}: manual approval requirement changed.`);
    assert(!question.lifecycle.automaticStudentPublication, `${qlId}/${language}: automatic publication was enabled.`);
    generated += 1;
    languageCounts[language] += 1;

    if (language === "en") {
      const payload = conversionPayload(question);
      assert(getGeneratedQuestionBankEligibilityIssue(payload) === null, `${qlId}: frozen Question Bank eligibility regressed.`);
      assert(getGeneratedItemApprovalDisposition(payload).mode === "question_bank", `${qlId}: frozen approval disposition regressed.`);
      const normalized = normalizeGeneratedQuestionPayload(payload, {
        itemId: `legacy-${qlId}`,
        generationRunCode: "SPA-LEGACY-34-COMPAT",
      });
      assert(normalized.options.length === 4, `${qlId}: frozen canonical conversion lost options.`);
      conversionChecks += 1;
    }
  }
}

assert(generated === 102, `Expected 102 frozen 34-QL multilingual checks, got ${generated}.`);
assert(conversionChecks === 34, `Expected 34 frozen conversion checks, got ${conversionChecks}.`);
assert(JSON.stringify(languageCounts) === JSON.stringify({ en: 34, hi: 34, pa: 34 }), "Frozen multilingual coverage changed.");

const repoRoot = resolve(import.meta.dirname, "../../../../..");
const spatialRoute = readFileSync(resolve(repoRoot, "artifacts/api-server/src/routes/admin-question-studio-spatial.ts"), "utf8");
const spatialPanel = readFileSync(resolve(repoRoot, "artifacts/admin-app/src/pages/content/QuestionStudioSpatialReviewPanel.tsx"), "utf8");
const spatialApi = readFileSync(resolve(repoRoot, "artifacts/admin-app/src/features/question-studio/spatial-review-api.ts"), "utf8");

// The frozen 34-QL runtime remains byte-addressable above, while the shared admin surface is
// intentionally superseded by the approved 40-QL PFC/TPF integration. Do not force obsolete
// 34-QL UI copy or the former 384px review width to remain in the live panel.
assert(spatialRoute.includes("spatial-question-studio-integration-v2"), "Shared Spatial route has not moved to the approved 40-QL integration module.");
assert(spatialRoute.includes("spatial-question-studio-production-v2"), "Shared Spatial route has not moved to the approved 40-QL production adapter.");
assert(!spatialRoute.includes("INSERT INTO content.questions"), "Spatial route directly writes Question Bank instead of shared approval.");
assert(spatialPanel.includes("'FGC-001': 'Figure Completion'"), "Spatial panel lost Figure Completion.");
assert(spatialPanel.includes("'PFC-001': 'Paper Folding & Cutting'"), "Spatial panel does not expose Paper Folding & Cutting.");
assert(spatialPanel.includes("'TPF-001': 'Transparent Pattern Folding'"), "Spatial panel does not expose Transparent Pattern Folding.");
assert(spatialPanel.includes("pkg?.permanentQlCount ?? 40"), "Spatial panel does not advertise the approved 40-QL package fallback.");
assert(spatialPanel.includes("max-w-[560px]"), "Spatial panel does not retain the approved wide folding review surface.");
assert(spatialPanel.includes("क्या देखें") && spatialPanel.includes("ਕੀ ਵੇਖਣਾ"), "Spatial panel lost approved simple HI/PA explanation labels.");
assert(spatialApi.includes("'FGC-001'") && spatialApi.includes("'PFC-001'") && spatialApi.includes("'TPF-001'"), "Spatial admin API type is missing an approved Spatial chapter.");

const evidence = {
  status: "PASS_SPA_FGC_001_LEGACY_34_QL_COMPAT_UNDER_40_QL_INTEGRATION",
  packageId: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.packageId,
  frozenIntegrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.integrationAuthority,
  frozenPermanentQlCount: 34,
  generated,
  conversionChecks,
  languageCounts,
  checks: {
    frozen34QlRuntimePreserved: true,
    deterministicReplayPreserved: true,
    multilingualRuntimePreserved: true,
    questionBankConversionPreserved: true,
    manualApprovalStillRequired: true,
    automaticStudentPublicationDisabled: true,
    liveAdminSurfaceSupersededTo40Qls: true,
    pfcTpfChapterFiltersPresent: true,
    approvedWideReviewSurfacePresent: true,
  },
  nextGate: "PFC_TPF_STANDARD_QUESTION_STUDIO_INTEGRATION_EXACT_HEAD_CI",
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-fgc-question-studio-integration-v1-evidence.json",
  JSON.stringify(evidence, null, 2),
);
console.log(JSON.stringify(evidence, null, 2));
