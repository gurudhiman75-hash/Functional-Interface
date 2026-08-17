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
  localizeSpatialStudioQuestionV1,
  spatialLocalizationParityProjectionV1,
  SPATIAL_HI_PA_LOCALIZATION_AUTHORITY_V1,
  SPATIAL_QUESTION_STUDIO_LANGUAGES_V1,
  type SpatialQuestionStudioLanguageV1,
} from "../foundation/spatial/spatial-question-studio-localization-v1";
import {
  generateSpatialProductionStudioBatchV1,
  generateSpatialProductionStudioQuestionV1,
  type SpatialProductionStudioQuestionV1,
} from "../foundation/spatial/spatial-question-studio-production-v1";
import { generateSpatialStudioQuestionV1 } from "../foundation/spatial/spatial-question-studio-runtime-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
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

function productionPayload(question: SpatialProductionStudioQuestionV1) {
  const labels = question.language === "hi"
    ? ["अवलोकन", "नियम", "प्रयोग", "जाँच"]
    : question.language === "pa"
      ? ["ਨਿਰੀਖਣ", "ਨਿਯਮ", "ਲਾਗੂ ਕਰੋ", "ਜਾਂਚ"]
      : ["Observe", "Rule", "Apply", "Check"];
  return {
    ...question,
    text: question.stem,
    options: [...question.optionLabels],
    correct: question.correctIndex,
    correctIndex: question.correctIndex,
    answer: question.answer,
    canonicalAnswer: question.answer,
    explanation: [
      `${labels[0]}: ${question.explanation.observation}`,
      `${labels[1]}: ${question.explanation.rule}`,
      `${labels[2]}: ${question.explanation.application}`,
      `${labels[3]}: ${question.explanation.check}`,
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
    localizationAuthority: SPATIAL_HI_PA_LOCALIZATION_AUTHORITY_V1,
    releaseAuthority: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.authority,
  };
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

function assertTargetScript(question: SpatialProductionStudioQuestionV1) {
  const text = learnerText(question);
  if (question.language === "hi") {
    assert(/[\u0900-\u097f]/u.test(text), `${question.qlId}: Hindi learner text has no Devanagari.`);
    assert(!/[\u0a00-\u0a7f]/u.test(text), `${question.qlId}: Hindi learner text leaked Gurmukhi.`);
    assert(!/\b(choose|select|figure|mirror|water|series|rule|apply|check|option)\b/i.test(text), `${question.qlId}: Hindi learner text leaked an English instruction token.`);
  }
  if (question.language === "pa") {
    assert(/[\u0a00-\u0a7f]/u.test(text), `${question.qlId}: Punjabi learner text has no Gurmukhi.`);
    assert(!/[\u0900-\u097f]/u.test(text), `${question.qlId}: Punjabi learner text leaked Devanagari.`);
    assert(!/\b(choose|select|figure|mirror|water|series|rule|apply|check|option)\b/i.test(text), `${question.qlId}: Punjabi learner text leaked an English instruction token.`);
  }
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
assert(JSON.stringify(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.supportedLanguages) === JSON.stringify(SPATIAL_QUESTION_STUDIO_LANGUAGES_V1), "Spatial multilingual capability is not en/hi/pa.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.hindiPunjabiGeneration, "Spatial Hindi/Punjabi capability is still disabled.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.localizationAuthority === SPATIAL_HI_PA_LOCALIZATION_AUTHORITY_V1, "Spatial localization authority mismatch.");
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

const generatedPerQlPerLanguage = 2;
let totalGenerated = 0;
let totalStimulusSvgs = 0;
let totalOptionSvgs = 0;
let conversionChecks = 0;
let parityChecks = 0;
const languageCounts: Record<string, number> = { en: 0, hi: 0, pa: 0 };
const chapterCounts: Record<string, number> = {};

for (const allocation of SPATIAL_PERMANENT_QL_ALLOCATIONS_V1) {
  for (let sample = 0; sample < generatedPerQlPerLanguage; sample += 1) {
    const seed = `SPA-QS-MULTILINGUAL:${allocation.permanentQlId}:S${sample}`;
    const source = generateSpatialStudioQuestionV1({ qlId: allocation.permanentQlId, seed });
    const localizedHi = localizeSpatialStudioQuestionV1(source, "hi");
    const localizedPa = localizeSpatialStudioQuestionV1(source, "pa");
    assert(
      JSON.stringify(spatialLocalizationParityProjectionV1(source)) === JSON.stringify(spatialLocalizationParityProjectionV1(localizedHi)),
      `${allocation.permanentQlId}: Hindi localization changed canonical visual semantics.`,
    );
    assert(
      JSON.stringify(spatialLocalizationParityProjectionV1(source)) === JSON.stringify(spatialLocalizationParityProjectionV1(localizedPa)),
      `${allocation.permanentQlId}: Punjabi localization changed canonical visual semantics.`,
    );
    parityChecks += 2;

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
      assert(question.language === language, `${allocation.permanentQlId}/${language}: language mismatch.`);
      assert(question.locale === (language === "hi" ? "hi-IN" : language === "pa" ? "pa-IN" : "en-IN"), `${allocation.permanentQlId}/${language}: locale mismatch.`);
      assert(question.qlId === allocation.permanentQlId, `${allocation.permanentQlId}/${language}: permanent QL trace mismatch.`);
      assert(question.chapterCode === allocation.chapterCode, `${allocation.permanentQlId}/${language}: chapter trace mismatch.`);
      assert(question.optionSvgs.length === 4, `${allocation.permanentQlId}/${language}: expected four SVG options.`);
      assert(question.optionSvgs.every((svg) => svg.includes("<svg") && svg.includes("</svg>")), `${allocation.permanentQlId}/${language}: invalid option SVG.`);
      assert(question.stimulusSvgs.every((svg) => svg.includes("<svg") && svg.includes("</svg>")), `${allocation.permanentQlId}/${language}: invalid stimulus SVG.`);
      assert(question.answer === question.optionLabels[question.correctIndex], `${allocation.permanentQlId}/${language}: answer mismatch.`);
      assert(question.validation.valid, `${allocation.permanentQlId}/${language}: runtime validation failed.`);
      assert(question.validation.semanticOptionUniqueness, `${allocation.permanentQlId}/${language}: semantic uniqueness failed.`);
      assert(question.validation.perceptualOptionUniqueness, `${allocation.permanentQlId}/${language}: perceptual uniqueness failed.`);
      assert(question.validation.learnerExplanationSafe, `${allocation.permanentQlId}/${language}: explanation safety failed.`);
      assert(question.lifecycle.questionBankStatus === "READY_FOR_STORAGE", `${allocation.permanentQlId}/${language}: Question Bank lifecycle mismatch.`);
      assert(question.lifecycle.testEligibility === "ELIGIBLE" && question.lifecycle.testEligible, `${allocation.permanentQlId}/${language}: test lifecycle mismatch.`);
      assert(question.lifecycle.publiclyPublishable && question.lifecycle.mockTestEligible, `${allocation.permanentQlId}/${language}: publication lifecycle mismatch.`);
      assert(question.lifecycle.manualApprovalRequired && !question.lifecycle.automaticStudentPublication, `${allocation.permanentQlId}/${language}: approval safety mismatch.`);
      assert(question.localization.authority === SPATIAL_HI_PA_LOCALIZATION_AUTHORITY_V1, `${allocation.permanentQlId}/${language}: localization authority mismatch.`);
      assert(question.localization.semanticParity === "GEOMETRY_AND_ANSWER_EXACT", `${allocation.permanentQlId}/${language}: semantic parity marker missing.`);
      assertTargetScript(question);

      const payload = productionPayload(question);
      assert(getGeneratedQuestionBankEligibilityIssue(payload) === null, `${allocation.permanentQlId}/${language}: standard Question Bank eligibility was blocked.`);
      assert(getGeneratedItemApprovalDisposition(payload).mode === "question_bank", `${allocation.permanentQlId}/${language}: approval would bypass normal Question Bank conversion.`);

      const normalized = normalizeGeneratedQuestionPayload(payload, {
        itemId: `${allocation.permanentQlId}-${language}-${sample}`,
        generationRunCode: "SPA-MULTILINGUAL-INTEGRATION",
      });
      assert(normalized.options.length === 4, `${allocation.permanentQlId}/${language}: canonical visual options missing.`);
      assert(
        normalized.options.every((option) => option.startsWith('<img src="data:image/svg+xml;base64,')),
        `${allocation.permanentQlId}/${language}: canonical options lost SVG content.`,
      );
      assert(
        normalized.options.every((option) => !/^\s*[ABCD]\s*$/.test(option)),
        `${allocation.permanentQlId}/${language}: canonical options collapsed to letter labels.`,
      );
      const stemImages = normalized.stem.match(/<img src="data:image\/svg\+xml;base64,/g) ?? [];
      assert(stemImages.length === question.stimulusSvgs.length, `${allocation.permanentQlId}/${language}: stimulus count changed during conversion.`);

      byLanguage.set(language, question);
      totalGenerated += 1;
      totalStimulusSvgs += question.stimulusSvgs.length;
      totalOptionSvgs += question.optionSvgs.length;
      conversionChecks += 1;
      languageCounts[language] += 1;
      chapterCounts[question.chapterCode] = (chapterCounts[question.chapterCode] ?? 0) + 1;
    }

    const english = byLanguage.get("en")!;
    const hindi = byLanguage.get("hi")!;
    const punjabi = byLanguage.get("pa")!;
    assert(JSON.stringify(visualProjection(english)) === JSON.stringify(visualProjection(hindi)), `${allocation.permanentQlId}: English/Hindi visual parity failed.`);
    assert(JSON.stringify(visualProjection(english)) === JSON.stringify(visualProjection(punjabi)), `${allocation.permanentQlId}: English/Punjabi visual parity failed.`);
    assert(english.canonicalItemId === hindi.canonicalItemId && english.canonicalItemId === punjabi.canonicalItemId, `${allocation.permanentQlId}: canonical item linkage differs by language.`);
    assert(new Set([english.questionLanguageId, hindi.questionLanguageId, punjabi.questionLanguageId]).size === 3, `${allocation.permanentQlId}: language identities are not distinct.`);
    assert(english.stem !== hindi.stem && english.stem !== punjabi.stem && hindi.stem !== punjabi.stem, `${allocation.permanentQlId}: learner stems are not distinctly localized.`);
  }
}

assert(totalGenerated === 180, `Expected 180 multilingual per-QL questions, got ${totalGenerated}.`);
assert(languageCounts.en === 60 && languageCounts.hi === 60 && languageCounts.pa === 60, `Language coverage mismatch: ${JSON.stringify(languageCounts)}.`);
assert(totalOptionSvgs === 720, `Expected 720 rendered option SVGs, got ${totalOptionSvgs}.`);
assert(conversionChecks === 180, `Expected 180 canonical conversion checks, got ${conversionChecks}.`);
assert(parityChecks === 120, `Expected 120 direct localization parity checks, got ${parityChecks}.`);

for (const language of SPATIAL_QUESTION_STUDIO_LANGUAGES_V1) {
  const batch = generateSpatialProductionStudioBatchV1({
    seed: `SPA-QS-BATCH-30:${language}`,
    count: 30,
    language,
  });
  assert(batch.questions.length === 30, `${language}: Question Studio batch must generate 30 questions.`);
  assert(new Set(batch.questions.map((question) => question.contentFingerprint)).size === 30, `${language}: Question Studio batch contains duplicate visible questions.`);
  assert(batch.generationContext.language === language, `${language}: batch language mismatch.`);
  assert(batch.generationContext.questionBankStatus === "READY_FOR_STORAGE", `${language}: batch Question Bank lifecycle mismatch.`);
  assert(batch.generationContext.testEligibility === "ELIGIBLE" && batch.generationContext.testEligible, `${language}: batch test lifecycle mismatch.`);
  assert(batch.generationContext.publiclyPublishable && batch.generationContext.mockTestEligible, `${language}: batch publication lifecycle mismatch.`);
  assert(batch.generationContext.manualApprovalRequired && !batch.generationContext.automaticStudentPublication, `${language}: batch approval safety mismatch.`);
}

for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
  const filtered = generateSpatialProductionStudioBatchV1({
    seed: `SPA-QS-DIFFICULTY:${difficulty}`,
    count: 8,
    difficulty,
    language: "hi",
  });
  assert(filtered.questions.length === 8, `${difficulty}: filtered batch count mismatch.`);
  assert(filtered.questions.every((question) => question.difficultyBand === difficulty), `${difficulty}: filter leaked another difficulty.`);
}

for (const chapterCode of SPATIAL_QUESTION_STUDIO_PACKAGE_V1.chapters) {
  const filtered = generateSpatialProductionStudioBatchV1({
    seed: `SPA-QS-CHAPTER:${chapterCode}`,
    count: 5,
    chapterCode,
    language: "pa",
  });
  assert(filtered.questions.every((question) => question.chapterCode === chapterCode), `${chapterCode}: filter leaked another chapter.`);
  assert(filtered.questions.every((question) => question.language === "pa"), `${chapterCode}: Punjabi chapter filter lost language.`);
}

const malformed = productionPayload(
  generateSpatialProductionStudioQuestionV1({
    qlId: "SPA-QL-001",
    seed: "SPA-QS-MALFORMED-VISUAL",
    language: "hi",
  }),
);
malformed.optionSvgs = malformed.optionSvgs.slice(0, 3);
let malformedRejected = false;
try {
  normalizeGeneratedQuestionPayload(malformed, {
    itemId: "SPA-MALFORMED",
    generationRunCode: "SPA-MULTILINGUAL-INTEGRATION",
  });
} catch {
  malformedRejected = true;
}
assert(malformedRejected, "Spatial conversion must fail closed when visual options are missing.");

const repoRoot = resolve(import.meta.dirname, "../../../../..");
const spatialRoute = readFileSync(resolve(repoRoot, "artifacts/api-server/src/routes/admin-question-studio-spatial.ts"), "utf8");
const dashboardRoute = readFileSync(resolve(repoRoot, "artifacts/api-server/src/routes/admin-question-studio.ts"), "utf8");
const cockpit = readFileSync(resolve(repoRoot, "artifacts/admin-app/src/pages/content/QuestionStudioCockpitPage.tsx"), "utf8");
const spatialPanel = readFileSync(resolve(repoRoot, "artifacts/admin-app/src/pages/content/QuestionStudioSpatialReviewPanel.tsx"), "utf8");
const spatialApi = readFileSync(resolve(repoRoot, "artifacts/admin-app/src/features/question-studio/spatial-review-api.ts"), "utf8");
const studentRichText = readFileSync(resolve(repoRoot, "artifacts/examtree/src/components/QuestionRichText.tsx"), "utf8");

assert(spatialRoute.includes("SPATIAL_QUESTION_STUDIO_LANGUAGES_V1"), "Spatial route does not accept multilingual requests.");
assert(spatialRoute.includes("localizationAuthority"), "Spatial route drops localization authority.");
assert(spatialRoute.includes("filters.language"), "Spatial run snapshot does not preserve selected language.");
assert(spatialRoute.includes("generateSpatialProductionStudioBatchV1"), "Spatial route bypasses the production adapter.");
assert(!spatialRoute.includes("INSERT INTO content.questions"), "Spatial route directly writes Question Bank instead of shared approval.");
assert(dashboardRoute.includes("'stimulusSvgs', v.payload -> 'stimulusSvgs'"), "Shared dashboard drops Spatial stimulus SVGs.");
assert(dashboardRoute.includes("'optionSvgs', v.payload -> 'optionSvgs'"), "Shared dashboard drops Spatial option SVGs.");
assert(cockpit.includes("itemStimulusSvgs"), "Shared cockpit does not read Spatial stimulus SVGs.");
assert(cockpit.includes("itemOptionSvgs"), "Shared cockpit does not read Spatial option SVGs.");
assert(cockpit.includes("SpatialSvgFigure"), "Shared cockpit does not render Spatial figures.");
assert(spatialPanel.includes("English · हिन्दी · ਪੰਜਾਬੀ"), "Spatial panel does not advertise multilingual availability.");
assert(spatialPanel.includes('Field label="Language"'), "Spatial panel has no language selector.");
assert(spatialApi.includes("SpatialReviewLanguage = 'en' | 'hi' | 'pa'"), "Spatial admin API is not multilingual.");
assert(studentRichText.includes('"img"'), "Student rich-text renderer does not allow image content.");
assert(studentRichText.includes('"src"'), "Student rich-text renderer does not allow image sources.");

assert(
  getGeneratedItemApprovalDisposition({ packageId: "LEGACY" }).mode === "question_bank",
  "Standard approval policy accidentally changed legacy behavior.",
);

const evidence = {
  status: "PASS_SPA_001_HI_PA_LOCALIZATION_AND_STANDARD_LIFECYCLE_V1",
  packageId: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.packageId,
  integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.integrationAuthority,
  localizationAuthority: SPATIAL_HI_PA_LOCALIZATION_AUTHORITY_V1,
  releaseAuthority: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.authority,
  permanentQlCount: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.permanentQlCount,
  languages: [...SPATIAL_QUESTION_STUDIO_LANGUAGES_V1],
  generatedPerQlPerLanguage,
  totalPerQlRuntimeQuestions: totalGenerated,
  languageCounts,
  conversionChecks,
  parityChecks,
  totalStimulusSvgs,
  totalOptionSvgs,
  chapterCounts,
  checks: {
    allThirtyQlsGenerateInThreeLanguages: true,
    deterministicReplay: true,
    hindiDevanagariGate: true,
    punjabiGurmukhiGate: true,
    noCrossScriptLeakage: true,
    noCoreEnglishInstructionLeakage: true,
    canonicalItemSharedAcrossLanguages: true,
    distinctQuestionLanguageIds: true,
    geometryByteParity: true,
    answerParity: true,
    semanticFingerprintParity: true,
    semanticOptionUniqueness: true,
    perceptualOptionUniqueness: true,
    standardApprovalDisposition: true,
    questionBankEligibilityAfterApproval: true,
    spatialSvgCanonicalConversion: true,
    malformedVisualFailClosed: true,
    sharedCockpitVisualReview: true,
    spatialPanelLanguageSelection: true,
    sharedStudentRichContentContract: true,
    automaticStudentPublicationDisabled: true,
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
  nextGate: "NORMAL_MULTILINGUAL_QUESTION_STUDIO_OPERATION",
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-question-studio-integration-v1-evidence.json",
  JSON.stringify(evidence, null, 2),
);
console.log(JSON.stringify(evidence, null, 2));
