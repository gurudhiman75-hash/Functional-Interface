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
import {
  generateSpatialProductionStudioQuestionV4,
  type SpatialProductionStudioQuestionV4,
} from "../foundation/spatial/spatial-question-studio-production-v4";

const CND_TEXT_QLS = ["SPA-QL-043", "SPA-QL-044"] as const;
const CND_NUMERIC_QL = "SPA-QL-045" as const;
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
assert.match(routeSource, /SVG_WITH_NUMERIC_OPTIONS/);
assert.match(routeSource, /options: persistedOptions/);
assert.match(routeSource, /canonicalAnswer/);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V4.permanentQlCount, 45);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V4.automaticStudentPublication, false);

let textNormalizationCount = 0;
let numericNormalizationCount = 0;
let languageParityChecks = 0;

for (const qlId of CND_TEXT_QLS) {
  for (let index = 0; index < 12; index += 1) {
    const seed = `CND-ADMIN-TEXT:${qlId}:${index}`;
    const english = generateSpatialProductionStudioQuestionV4({ qlId, seed, language: "en" });
    assert.equal(english.renderer.kind, "SVG_WITH_SCALAR_OPTIONS");
    assert.ok(english.options.every((option) => typeof option === "string"));

    for (const language of LANGUAGES) {
      const question = generateSpatialProductionStudioQuestionV4({ qlId, seed, language });
      assert.equal(question.renderer.kind, "SVG_WITH_SCALAR_OPTIONS");
      const payload = persistedPayload(question);
      assert.equal(getGeneratedQuestionBankEligibilityIssue(payload), null);
      assert.deepEqual(payload.options, [...question.options]);
      const normalized = normalizeGeneratedQuestionPayload(payload, {
        itemId: `${seed}-${language}`,
        generationRunCode: "CND-ADMIN-CONVERSION-GATE",
      });
      assert.ok(normalized.stem.includes('<img src="data:image/svg+xml;base64,'));
      assert.deepEqual(normalized.options, question.options.map(String));
      assert.equal(normalized.correctIndex, question.correctIndex);
      assert.equal(normalized.options[question.correctIndex], String(question.canonicalAnswer));
      assert.equal(normalized.answerModel.canonicalAnswer, question.canonicalAnswer);
      const generation = normalized.answerModel.generation as Record<string, unknown>;
      assert.equal(generation.visualContent, "spatial_svg_stimulus_scalar_options_v1");
      assert.equal(generation.integrationAuthority, SPATIAL_QUESTION_STUDIO_PACKAGE_V4.integrationAuthority);
      assert.equal(generation.automaticStudentPublication, false);
      textNormalizationCount += 1;

      if (language !== "en") {
        assert.deepEqual(question.stimulusSvgs, english.stimulusSvgs);
        assert.deepEqual(question.options, english.options);
        assert.equal(question.correctIndex, english.correctIndex);
        assert.equal(question.canonicalAnswer, english.canonicalAnswer);
        assert.equal(question.contentFingerprint, english.contentFingerprint);
        languageParityChecks += 5;
      }
    }
  }
}

for (let index = 0; index < 12; index += 1) {
  const seed = `CND-ADMIN-NUMERIC:${index}`;
  const english = generateSpatialProductionStudioQuestionV4({ qlId: CND_NUMERIC_QL, seed, language: "en" });
  assert.equal(isNumericOptionQuestion(english), true);

  for (const language of LANGUAGES) {
    const question = generateSpatialProductionStudioQuestionV4({ qlId: CND_NUMERIC_QL, seed, language });
    assert.equal(isNumericOptionQuestion(question), true);
    const numeric = question as typeof english & { options: readonly [number, number, number, number] };
    const payload = persistedPayload(question);
    assert.equal(getGeneratedQuestionBankEligibilityIssue(payload), null);
    const normalized = normalizeGeneratedQuestionPayload(payload, {
      itemId: `${seed}-${language}`,
      generationRunCode: "CND-ADMIN-CONVERSION-GATE",
    });
    assert.ok(normalized.stem.includes('<img src="data:image/svg+xml;base64,'));
    assert.deepEqual(normalized.options, numeric.options.map(String));
    assert.equal(normalized.correctIndex, numeric.correctIndex);
    assert.equal(normalized.answerModel.canonicalAnswer, numeric.options[numeric.correctIndex]);
    const generation = normalized.answerModel.generation as Record<string, unknown>;
    assert.equal(generation.visualContent, "spatial_svg_stimulus_numeric_options_v1");
    assert.equal(generation.automaticStudentPublication, false);
    numericNormalizationCount += 1;
  }
}

assert.equal(textNormalizationCount, 72);
assert.equal(numericNormalizationCount, 36);
assert.equal(languageParityChecks, 240);

const scalarProbe = generateSpatialProductionStudioQuestionV4({
  qlId: "SPA-QL-043",
  seed: "CND-ADMIN-SCALAR-INVALID",
  language: "en",
});
const validScalarPayload = persistedPayload(scalarProbe);
assert.throws(
  () => normalizeGeneratedQuestionPayload({
    ...validScalarPayload,
    options: ["A", "A", "B", "C"],
  }, {
    itemId: "duplicate-scalar",
    generationRunCode: "CND-ADMIN-CONVERSION-GATE",
  }),
  /four unique text options/,
);
assert.throws(
  () => normalizeGeneratedQuestionPayload({
    ...validScalarPayload,
    options: ["A", "", "B", "C"],
  }, {
    itemId: "blank-scalar",
    generationRunCode: "CND-ADMIN-CONVERSION-GATE",
  }),
  /bounded non-empty text options/,
);
assert.throws(
  () => normalizeGeneratedQuestionPayload({
    ...validScalarPayload,
    stimulusSvgs: ['<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>'],
  }, {
    itemId: "active-svg",
    generationRunCode: "CND-ADMIN-CONVERSION-GATE",
  }),
  /disallowed active SVG content/,
);

const numericProbe = generateSpatialProductionStudioQuestionV4({
  qlId: CND_NUMERIC_QL,
  seed: "CND-ADMIN-NUMERIC-INVALID",
  language: "en",
});
const validNumericPayload = persistedPayload(numericProbe);
assert.throws(
  () => normalizeGeneratedQuestionPayload({
    ...validNumericPayload,
    options: [1, 2, "3", 4],
  }, {
    itemId: "mixed-numeric",
    generationRunCode: "CND-ADMIN-CONVERSION-GATE",
  }),
  /four finite numeric options/,
);

const result = {
  status: "PASS_CND_001_ADMIN_SCALAR_OPTION_CONVERSION_V1",
  integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V4.integrationAuthority,
  permanentQlCount: SPATIAL_QUESTION_STUDIO_PACKAGE_V4.permanentQlCount,
  textNormalizationCount,
  numericNormalizationCount,
  languageParityChecks,
  scalarOptionPersistence: {
    nativeTextChoicesPreserved: true,
    stimulusStoredAsSafeSvgImage: true,
    duplicateTextChoicesRejected: true,
    blankTextChoicesRejected: true,
  },
  numericOptionPersistence: {
    nativeNumericChoicesPreserved: true,
    mixedNumericPayloadRejected: true,
  },
  svgSecurity: {
    activeContentRejected: true,
  },
  governance: {
    manualApprovalRequired: true,
    automaticStudentPublication: false,
  },
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-cnd-001-admin-scalar-option-conversion-v1-evidence.json",
  `${JSON.stringify(result, null, 2)}\n`,
  "utf8",
);
console.log(JSON.stringify(result, null, 2));
