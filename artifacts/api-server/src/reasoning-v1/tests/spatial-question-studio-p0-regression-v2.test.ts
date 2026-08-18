import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  getGeneratedQuestionBankEligibilityIssue,
  normalizeGeneratedQuestionPayload,
} from "../../lib/admin-question-conversion";
import { getGeneratedItemApprovalDisposition } from "../../lib/admin-question-studio-approval-policy";
import { SPATIAL_PERMANENT_QL_ALLOCATIONS_V1 } from "../foundation/spatial/spatial-permanent-ql-allocation-v1";
import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V1,
  SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1,
} from "../foundation/spatial/spatial-question-studio-integration-v1";
import {
  SPATIAL_HI_PA_LOCALIZATION_AUTHORITY_V1,
  SPATIAL_QUESTION_STUDIO_LANGUAGES_V1,
} from "../foundation/spatial/spatial-question-studio-localization-v1";
import {
  generateSpatialProductionStudioBatchV1,
  generateSpatialProductionStudioQuestionV1,
  type SpatialProductionStudioQuestionV1,
} from "../foundation/spatial/spatial-question-studio-production-v1";

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

let generated = 0;
let conversionChecks = 0;
const languageCounts: Record<string, number> = { en: 0, hi: 0, pa: 0 };

for (const allocation of SPATIAL_PERMANENT_QL_ALLOCATIONS_V1) {
  for (const language of SPATIAL_QUESTION_STUDIO_LANGUAGES_V1) {
    const seed = `SPA-P0-REGRESSION:${allocation.permanentQlId}:${language}`;
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

    assert(JSON.stringify(question) === JSON.stringify(replay), `${allocation.permanentQlId}/${language}: deterministic replay changed.`);
    assert(question.qlId === allocation.permanentQlId, `${allocation.permanentQlId}/${language}: QL identity changed.`);
    assert(question.chapterCode === allocation.chapterCode, `${allocation.permanentQlId}/${language}: chapter identity changed.`);
    assert(question.localization.authority === SPATIAL_HI_PA_LOCALIZATION_AUTHORITY_V1, `${allocation.permanentQlId}/${language}: frozen P0 localization authority changed.`);
    assert(question.optionSvgs.length === 4, `${allocation.permanentQlId}/${language}: P0 option count changed.`);
    assert(question.optionSvgs.every((svg) => svg.includes("<svg") && svg.includes("</svg>")), `${allocation.permanentQlId}/${language}: invalid P0 option SVG.`);
    assert(question.stimulusSvgs.every((svg) => svg.includes("<svg") && svg.includes("</svg>")), `${allocation.permanentQlId}/${language}: invalid P0 stimulus SVG.`);
    assert(question.answer === question.optionLabels[question.correctIndex], `${allocation.permanentQlId}/${language}: answer/index changed.`);
    assert(question.validation.valid, `${allocation.permanentQlId}/${language}: P0 runtime validation failed.`);
    assert(question.validation.semanticOptionUniqueness, `${allocation.permanentQlId}/${language}: P0 semantic uniqueness failed.`);
    assert(question.validation.perceptualOptionUniqueness, `${allocation.permanentQlId}/${language}: P0 perceptual uniqueness failed.`);
    assert(question.validation.learnerExplanationSafe, `${allocation.permanentQlId}/${language}: P0 explanation safety failed.`);
    assert(question.lifecycle.questionBankStatus === "READY_FOR_STORAGE", `${allocation.permanentQlId}/${language}: P0 Question Bank lifecycle changed.`);
    assert(question.lifecycle.testEligibility === "ELIGIBLE" && question.lifecycle.testEligible, `${allocation.permanentQlId}/${language}: P0 test lifecycle changed.`);
    assert(question.lifecycle.manualApprovalRequired && !question.lifecycle.automaticStudentPublication, `${allocation.permanentQlId}/${language}: P0 approval safety changed.`);
    assertTargetScript(question);

    const payload = conversionPayload(question);
    assert(getGeneratedQuestionBankEligibilityIssue(payload) === null, `${allocation.permanentQlId}/${language}: P0 Question Bank eligibility regressed.`);
    assert(getGeneratedItemApprovalDisposition(payload).mode === "question_bank", `${allocation.permanentQlId}/${language}: P0 approval disposition regressed.`);
    const normalized = normalizeGeneratedQuestionPayload(payload, {
      itemId: `P0-${allocation.permanentQlId}-${language}`,
      generationRunCode: "SPA-P0-REGRESSION-V2",
    });
    assert(normalized.options.length === 4, `${allocation.permanentQlId}/${language}: P0 canonical option count changed.`);
    assert(normalized.options.every((option) => option.startsWith('<img src="data:image/svg+xml;base64,')), `${allocation.permanentQlId}/${language}: P0 canonical conversion lost SVG options.`);
    assert((normalized.stem.match(/<img src="data:image\/svg\+xml;base64,/g) ?? []).length === question.stimulusSvgs.length, `${allocation.permanentQlId}/${language}: P0 stimulus conversion changed.`);

    generated += 1;
    conversionChecks += 1;
    languageCounts[language] += 1;
  }
}

assert(generated === 90, `Expected 90 P0 multilingual regression questions, got ${generated}.`);
assert(JSON.stringify(languageCounts) === JSON.stringify({ en: 30, hi: 30, pa: 30 }), `P0 language coverage mismatch: ${JSON.stringify(languageCounts)}.`);
assert(conversionChecks === 90, `Expected 90 P0 conversion checks, got ${conversionChecks}.`);

for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
  const filtered = generateSpatialProductionStudioBatchV1({
    seed: `SPA-P0-DIFFICULTY:${difficulty}`,
    count: 8,
    difficulty,
    language: "hi",
  });
  assert(filtered.questions.length === 8, `${difficulty}: P0-compatible difficulty batch count changed.`);
  assert(filtered.questions.every((question) => question.difficultyBand === difficulty), `${difficulty}: difficulty filter leaked another band.`);
}

for (const chapterCode of ["MIR-001", "WAT-001", "FAN-001", "FCL-001", "FSR-001"] as const) {
  const filtered = generateSpatialProductionStudioBatchV1({
    seed: `SPA-P0-CHAPTER:${chapterCode}`,
    count: 5,
    chapterCode,
    language: "pa",
  });
  assert(filtered.questions.length === 5, `${chapterCode}: P0 chapter batch count changed.`);
  assert(filtered.questions.every((question) => question.chapterCode === chapterCode), `${chapterCode}: chapter filter leaked another chapter.`);
}

const malformedQuestion = generateSpatialProductionStudioQuestionV1({
  qlId: "SPA-QL-001",
  seed: "SPA-P0-MALFORMED-VISUAL",
  language: "hi",
});
const malformed = conversionPayload(malformedQuestion);
malformed.optionSvgs = malformed.optionSvgs.slice(0, 3);
let malformedRejected = false;
try {
  normalizeGeneratedQuestionPayload(malformed, {
    itemId: "SPA-P0-MALFORMED",
    generationRunCode: "SPA-P0-REGRESSION-V2",
  });
} catch {
  malformedRejected = true;
}
assert(malformedRejected, "P0 canonical conversion no longer fails closed when an SVG option is missing.");

const repoRoot = resolve(import.meta.dirname, "../../../../..");
const productionAdapter = readFileSync(resolve(repoRoot, "artifacts/api-server/src/reasoning-v1/foundation/spatial/spatial-question-studio-production-v1.ts"), "utf8");
const spatialRoute = readFileSync(resolve(repoRoot, "artifacts/api-server/src/routes/admin-question-studio-spatial.ts"), "utf8");
const dashboardRoute = readFileSync(resolve(repoRoot, "artifacts/api-server/src/routes/admin-question-studio.ts"), "utf8");
const cockpit = readFileSync(resolve(repoRoot, "artifacts/admin-app/src/pages/content/QuestionStudioCockpitPage.tsx"), "utf8");
const studentRichText = readFileSync(resolve(repoRoot, "artifacts/examtree/src/components/QuestionRichText.tsx"), "utf8");

assert(productionAdapter.includes('"FAN-GAP-04": "जो हिस्सा अंदर से बाहर या बाहर से अंदर गया है, C में भी वैसा ही करें"'), "Frozen P0 Hindi FAN-GAP-04 wording drifted during FGC integration.");
assert(!productionAdapter.includes("अंदर से बाहर, बाहर से अंदर, बड़ा या छोटा"), "Superseded P0 Hindi wording leaked into the integration adapter.");
assert(spatialRoute.includes("localizationAuthority: question.localization.authority"), "Spatial persisted item metadata does not preserve the source localization authority.");
assert(spatialRoute.includes("localizationAuthorities"), "Spatial run audit metadata does not record mixed localization authorities.");
assert(!spatialRoute.includes("INSERT INTO content.questions"), "Spatial route directly writes Question Bank instead of shared approval.");
assert(dashboardRoute.includes("'stimulusSvgs', v.payload -> 'stimulusSvgs'"), "Shared dashboard drops Spatial stimulus SVGs.");
assert(dashboardRoute.includes("'optionSvgs', v.payload -> 'optionSvgs'"), "Shared dashboard drops Spatial option SVGs.");
assert(cockpit.includes("itemStimulusSvgs"), "Shared cockpit does not read Spatial stimulus SVGs.");
assert(cockpit.includes("itemOptionSvgs"), "Shared cockpit does not read Spatial option SVGs.");
assert(cockpit.includes("SpatialSvgFigure"), "Shared cockpit does not render Spatial SVGs.");
assert(studentRichText.includes('"img"') && studentRichText.includes('"src"'), "Student rich-text renderer no longer permits SVG image content.");
assert(getGeneratedItemApprovalDisposition({ packageId: "LEGACY" }).mode === "question_bank", "FGC integration changed legacy Question Studio approval behavior.");

const evidence = {
  status: "PASS_SPA_P0_QUESTION_STUDIO_REGRESSION_UNDER_FGC_V2",
  frozenQlCount: 30,
  languages: [...SPATIAL_QUESTION_STUDIO_LANGUAGES_V1],
  generated,
  conversionChecks,
  languageCounts,
  checks: {
    deterministicReplay: true,
    frozenQlAndChapterIdentity: true,
    frozenLocalizationAuthority: true,
    frozenHindiApplicationWording: true,
    semanticAndPerceptualUniqueness: true,
    learnerExplanationSafety: true,
    standardApprovalAndConversion: true,
    chapterAndDifficultyFilters: true,
    malformedVisualFailClosed: true,
    perItemLocalizationAuthorityPersistence: true,
    sharedCockpitVisualContract: true,
    sharedStudentRichContentContract: true,
    legacyApprovalUnaffected: true,
  },
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-p0-question-studio-regression-v2-evidence.json",
  JSON.stringify(evidence, null, 2),
);
console.log(JSON.stringify(evidence, null, 2));
