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
const spatialRegistry = readFileSync(resolve(repoRoot, "artifacts/api-server/src/routes/admin-question-studio-registry.ts"), "utf8");
const spatialWorkflow = readFileSync(resolve(repoRoot, "artifacts/api-server/src/routes/admin-question-studio-spatial-workflow.ts"), "utf8");
const spatialV5Route = readFileSync(resolve(repoRoot, "artifacts/api-server/src/routes/admin-question-studio-spatial-v5.ts"), "utf8");
const spatialPanel = readFileSync(resolve(repoRoot, "artifacts/admin-app/src/pages/content/QuestionStudioSpatialReviewPanel.tsx"), "utf8");
const spatialApi = readFileSync(resolve(repoRoot, "artifacts/admin-app/src/features/question-studio/spatial-review-api.ts"), "utf8");

// The 34-QL runtime remains byte-addressable for compatibility, while the live registry is
// intentionally superseded by the approved 48-QL package. The V5-named route is the stable
// mounted adapter and now delegates to integration/production V6 for FFM-001.
assert(spatialRegistry.indexOf("adminQuestionStudioSpatialV5Router") >= 0, "Current Spatial adapter is missing from the route registry.");
assert(spatialRegistry.indexOf("router.use(adminQuestionStudioSpatialV5Router)") < spatialRegistry.indexOf("router.use(adminQuestionStudioSpatialRouter)"), "Current Spatial adapter must precede the legacy fallback.");
assert(spatialWorkflow.includes("spatial-question-studio-integration-v6"), "Shared SPA-001 /runs workflow is not using the approved 48-QL package.");
assert(spatialWorkflow.includes("SPATIAL_QUESTION_STUDIO_PACKAGE_V6"), "Shared SPA-001 workflow does not recognize FFM QLs.");
assert(spatialV5Route.includes("spatial-question-studio-integration-v6"), "Mounted Spatial adapter is not using 48-QL integration V6.");
assert(spatialV5Route.includes("spatial-question-studio-production-v6"), "Mounted Spatial adapter is not using 48-QL production V6.");
assert(!spatialV5Route.includes("INSERT INTO content.questions"), "Spatial route directly writes Question Bank instead of shared approval.");
assert(spatialPanel.includes("'FGC-001': 'Figure Completion'"), "Spatial panel lost Figure Completion.");
assert(spatialPanel.includes("'PFC-001': 'Paper Folding & Cutting'"), "Spatial panel lost Paper Folding & Cutting.");
assert(spatialPanel.includes("'TPF-001': 'Transparent Pattern Folding'"), "Spatial panel lost Transparent Pattern Folding.");
assert(spatialPanel.includes("'FFM-001': 'Figure Formation'"), "Spatial panel does not expose Figure Formation.");
assert(spatialPanel.includes("pkg?.permanentQlCount ?? 48"), "Spatial panel does not advertise the approved 48-QL package fallback.");
assert(spatialPanel.includes("explanationIllustrationSvg"), "Spatial panel does not render the approved FFM assembly explanation.");
assert(spatialPanel.includes("क्या देखें") && spatialPanel.includes("ਕੀ ਵੇਖਣਾ"), "Spatial panel lost approved simple HI/PA explanation labels.");
assert(spatialApi.includes("'FFM-001'"), "Spatial admin API type is missing Figure Formation.");

const evidence = {
  status: "PASS_SPA_FGC_001_LEGACY_34_QL_COMPAT_UNDER_48_QL_FFM_INTEGRATION",
  packageId: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.packageId,
  frozenIntegrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.integrationAuthority,
  frozenPermanentQlCount: 34,
  livePermanentQlCount: 48,
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
    liveRegistrySupersededTo48Qls: true,
    sharedSpaRunsRecognizeFfmQls: true,
    ffmChapterFilterPresent: true,
    ffmAssemblyExplanationVisible: true,
  },
  nextGate: "FFM_001_FREEZE_INTEGRATION_EXACT_HEAD_CI",
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-fgc-question-studio-integration-v1-evidence.json",
  JSON.stringify(evidence, null, 2),
);
console.log(JSON.stringify(evidence, null, 2));