import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import {
  getGeneratedQuestionBankEligibilityIssue,
  normalizeGeneratedQuestionPayload,
} from "../../lib/admin-question-conversion";
import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V4,
  SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1,
} from "../foundation/spatial/spatial-question-studio-integration-v4";
import { SPATIAL_QUESTION_STUDIO_PACKAGE_V3 } from "../foundation/spatial/spatial-question-studio-integration-v3";
import { SPATIAL_QUESTION_STUDIO_PACKAGE_V2 } from "../foundation/spatial/spatial-question-studio-integration-v2";
import {
  generateSpatialProductionStudioQuestionV4,
  type SpatialProductionStudioQuestionV4,
} from "../foundation/spatial/spatial-question-studio-production-v4";

const FCT_QL = "SPA-QL-042" as const;
const EMB_QL = "SPA-QL-041" as const;
const LANGUAGES = ["en", "hi", "pa"] as const;

function isNumericOptionQuestion(
  question: SpatialProductionStudioQuestionV4,
): question is SpatialProductionStudioQuestionV4 & {
  renderer: { kind: "SVG_WITH_NUMERIC_OPTIONS" };
  options: readonly [number, number, number, number];
} {
  return (
    question.renderer.kind === "SVG_WITH_NUMERIC_OPTIONS" &&
    "options" in question &&
    Array.isArray(question.options)
  );
}

function persistedPayload(question: SpatialProductionStudioQuestionV4) {
  const numeric = isNumericOptionQuestion(question);
  const optionSvgs = "optionSvgs" in question && Array.isArray(question.optionSvgs)
    ? question.optionSvgs
    : undefined;
  const options = numeric ? [...question.options] : [...question.optionLabels];
  const canonicalAnswer = numeric ? question.options[question.correctIndex] : question.answer;
  return {
    text: question.stem,
    stem: question.stem,
    stimulusSvgs: question.stimulusSvgs,
    ...(optionSvgs ? { optionSvgs } : {}),
    optionLabels: question.optionLabels,
    options,
    correct: question.correctIndex,
    correctIndex: question.correctIndex,
    answer: question.answer,
    canonicalAnswer,
    explanation: [
      question.explanation.observation,
      question.explanation.rule,
      question.explanation.application,
      question.explanation.check,
    ].join("\n\n"),
    renderer: question.renderer,
    difficulty: question.difficultyBand,
    difficultyLabel: question.difficultyBand,
    patternId: question.qlId,
    qlId: question.qlId,
    packageId: question.packageId,
    language: question.language,
    locale: question.locale,
    questionId: question.questionId,
    runtimeMode: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.runtimeMode,
    reviewStatus: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.reviewStatus,
    questionBankStatus: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.questionBankStatus,
    questionBankWritable: true,
    testEligibility: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.testEligibility,
    testEligible: true,
    publiclyPublishable: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.publiclyPublishable,
    mockTestEligible: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.mockTestEligible,
    manualApprovalRequired: true,
    automaticStudentPublication: false,
    integrationAuthority: question.integrationAuthority,
    releaseAuthority: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.authority,
    generationContext: {
      packageId: question.packageId,
      qlId: question.qlId,
      chapterCode: question.chapterCode,
      language: question.language,
      locale: question.locale,
      runtimeMode: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.runtimeMode,
      reviewStatus: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.reviewStatus,
      integrationAuthority: question.integrationAuthority,
      questionStudioDiscoverable: true,
      registrationStatus: "REGISTERED",
      persistenceAllowed: true,
      questionBankStatus: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.questionBankStatus,
      questionBankWritable: true,
      testEligibility: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.testEligibility,
      testEligible: true,
      publiclyPublishable: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.publiclyPublishable,
      mockTestEligible: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.mockTestEligible,
      manualApprovalRequired: true,
      automaticStudentPublication: false,
    },
  };
}

const routeSource = readFileSync("src/routes/admin-question-studio-spatial.ts", "utf8");
assert.match(routeSource, /spatial-question-studio-integration-v4/);
assert.match(routeSource, /spatial-question-studio-production-v4/);
assert.match(routeSource, /SPATIAL_QUESTION_STUDIO_PACKAGE_V3 as PRE_FCT_SPATIAL_QUESTION_STUDIO_PACKAGE_V3/);
assert.match(routeSource, /countingFiguresLocalizationAuthority/);
assert.match(routeSource, /preCountingFiguresIntegrationAuthority/);
assert.match(routeSource, /SVG_WITH_NUMERIC_OPTIONS/);
assert.match(routeSource, /options: persistedOptions/);
assert.match(routeSource, /canonicalAnswer/);

assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V4.permanentQlCount, 42);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V4.qlIds.at(-1), FCT_QL);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V4.supersedesIntegrationAuthority, SPATIAL_QUESTION_STUDIO_PACKAGE_V3.integrationAuthority);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V3.supersedesIntegrationAuthority, SPATIAL_QUESTION_STUDIO_PACKAGE_V2.integrationAuthority);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V4.automaticStudentPublication, false);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V4.manualApprovalRequired, true);

let fctNormalizationCount = 0;
let fctLanguageParityChecks = 0;
const fctCanonicalIds = new Set<string>();
const fctContentFingerprints = new Set<string>();

for (let index = 0; index < 18; index += 1) {
  const seed = `FCT-ROUTE-ACTIVATION-${index}`;
  const byLanguage = LANGUAGES.map((language) =>
    generateSpatialProductionStudioQuestionV4({ qlId: FCT_QL, seed, language }),
  );
  const en = byLanguage[0]!;
  assert.equal(isNumericOptionQuestion(en), true);
  const enNumeric = en as Extract<typeof en, { qlId: "SPA-QL-042" }> & { options: readonly [number, number, number, number] };

  for (const question of byLanguage) {
    assert.equal(question.qlId, FCT_QL);
    assert.equal(question.chapterCode, "FCT-001");
    assert.equal(question.integrationAuthority, SPATIAL_QUESTION_STUDIO_PACKAGE_V4.integrationAuthority);
    assert.equal(question.lifecycle.manualApprovalRequired, true);
    assert.equal(question.lifecycle.automaticStudentPublication, false);
    assert.equal(isNumericOptionQuestion(question), true);

    const numeric = question as typeof enNumeric;
    const payload = persistedPayload(question);
    assert.equal("optionSvgs" in payload, false, `${seed}/${question.language}: FCT payload unexpectedly persisted SVG options.`);
    assert.equal(getGeneratedQuestionBankEligibilityIssue(payload), null);
    const normalized = normalizeGeneratedQuestionPayload(payload, {
      itemId: `${seed}-${question.language}`,
      generationRunCode: "FCT-ROUTE-ACTIVATION-GATE",
    });
    assert.ok(normalized.stem.includes('<img src="data:image/svg+xml;base64,'));
    assert.deepEqual(normalized.options, numeric.options.map(String));
    assert.ok(normalized.options.every((option) => !option.includes("<img")));
    assert.equal(normalized.correctIndex, numeric.correctIndex);
    assert.equal(normalized.options[numeric.correctIndex], String(numeric.options[numeric.correctIndex]));
    assert.equal(normalized.answerModel.canonicalAnswer, numeric.options[numeric.correctIndex]);
    const generation = normalized.answerModel.generation as Record<string, unknown>;
    assert.equal(generation.visualContent, "spatial_svg_stimulus_numeric_options_v1");
    assert.equal(generation.integrationAuthority, SPATIAL_QUESTION_STUDIO_PACKAGE_V4.integrationAuthority);
    assert.equal(generation.automaticStudentPublication, false);
    fctNormalizationCount += 1;
  }

  for (const localized of byLanguage.slice(1)) {
    const localizedNumeric = localized as typeof enNumeric;
    assert.deepEqual(localizedNumeric.stimulusSvgs, enNumeric.stimulusSvgs);
    assert.deepEqual(localizedNumeric.options, enNumeric.options);
    assert.equal(localizedNumeric.correctIndex, enNumeric.correctIndex);
    assert.equal(localizedNumeric.contentFingerprint, enNumeric.contentFingerprint);
    fctLanguageParityChecks += 4;
  }
  fctCanonicalIds.add(enNumeric.canonicalItemId);
  fctContentFingerprints.add(enNumeric.contentFingerprint);
}

assert.equal(fctNormalizationCount, 54);
assert.equal(fctLanguageParityChecks, 144);
assert.equal(fctCanonicalIds.size, 18);
assert.equal(fctContentFingerprints.size, 18);

const emb = generateSpatialProductionStudioQuestionV4({
  qlId: EMB_QL,
  seed: "FCT-ROUTE-LEGACY-EMB",
  language: "pa",
});
assert.equal(emb.qlId, EMB_QL);
assert.ok("optionSvgs" in emb && Array.isArray(emb.optionSvgs));
const embPayload = persistedPayload(emb);
assert.equal(getGeneratedQuestionBankEligibilityIssue(embPayload), null);
const normalizedEmb = normalizeGeneratedQuestionPayload(embPayload, {
  itemId: "FCT-ROUTE-LEGACY-EMB-pa",
  generationRunCode: "FCT-ROUTE-ACTIVATION-GATE",
});
assert.ok(normalizedEmb.stem.includes('<img src="data:image/svg+xml;base64,'));
assert.equal(normalizedEmb.options.length, 4);
assert.ok(normalizedEmb.options.every((option) => option.startsWith('<img src="data:image/svg+xml;base64,')));
const embGeneration = normalizedEmb.answerModel.generation as Record<string, unknown>;
assert.equal(embGeneration.visualContent, "spatial_svg_data_image_v1");
assert.equal(embGeneration.integrationAuthority, SPATIAL_QUESTION_STUDIO_PACKAGE_V4.integrationAuthority);

const fctProbe = generateSpatialProductionStudioQuestionV4({
  qlId: FCT_QL,
  seed: "FCT-ROUTE-INVALID-PROBE",
  language: "en",
});
assert.equal(isNumericOptionQuestion(fctProbe), true);
const validProbePayload = persistedPayload(fctProbe);
const duplicateNumericPayload = {
  ...validProbePayload,
  options: [11, 11, 12, 13],
};
assert.throws(
  () => normalizeGeneratedQuestionPayload(duplicateNumericPayload, {
    itemId: "duplicate-numeric",
    generationRunCode: "FCT-ROUTE-ACTIVATION-GATE",
  }),
  /four unique numeric options/,
);
const missingNumericRendererPayload = {
  ...validProbePayload,
  renderer: { kind: "SVG" },
};
assert.throws(
  () => normalizeGeneratedQuestionPayload(missingNumericRendererPayload, {
    itemId: "missing-numeric-renderer",
    generationRunCode: "FCT-ROUTE-ACTIVATION-GATE",
  }),
  /exactly four rendered SVG options/,
);

const result = {
  status: "PASS_FCT_001_ADMIN_QUESTION_STUDIO_ROUTE_AND_NUMERIC_CONVERSION_ACTIVATION_V1",
  integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V4.integrationAuthority,
  previousIntegrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V3.integrationAuthority,
  permanentQlCount: SPATIAL_QUESTION_STUDIO_PACKAGE_V4.permanentQlCount,
  activatedPermanentQlId: FCT_QL,
  fctNormalizationCount,
  fctLanguageParityChecks,
  fctCanonicalUniqueCount: fctCanonicalIds.size,
  fctContentFingerprintUniqueCount: fctContentFingerprints.size,
  numericOptionPersistence: {
    stimulusStoredAsSafeSvgImage: true,
    optionsStoredAsPlainNumericStrings: true,
    canonicalAnswerStoredAsNumericCount: true,
    malformedNumericPayloadRejected: true,
  },
  legacySpatialPersistence: {
    embeddedFigureSvgOptionsPreserved: true,
    visualContentAuthority: "spatial_svg_data_image_v1",
  },
  route: {
    integrationV4Active: true,
    productionV4Active: true,
    historicalV3V2AuthoritiesRetained: true,
    countingFiguresLocalizationAuthorityExposed: true,
  },
  governance: {
    manualApprovalRequired: true,
    automaticStudentPublication: false,
    deploymentAuthorized: false,
  },
  nextGate: "FCT_001_REFRESH_ON_LATEST_NEW_MAIN_AND_FINAL_INTEGRATION_CI",
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-fct-001-admin-question-studio-route-activation-v1-evidence.json",
  `${JSON.stringify(result, null, 2)}\n`,
  "utf8",
);
console.log(JSON.stringify(result, null, 2));
