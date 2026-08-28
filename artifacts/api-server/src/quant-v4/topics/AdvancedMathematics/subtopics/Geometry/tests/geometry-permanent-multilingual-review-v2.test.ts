import assert from "node:assert/strict";
import {
  GEO_EXECUTABLE_TEMPORARY_PROTOTYPES_V1,
  GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1,
} from "../permanent-review/geometry-permanent-english-runtime-v1";
import { generateGeometryPermanentEnglishFrozenV1 } from "../permanent-review/geometry-permanent-english-freeze-v1";
import {
  GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2,
} from "../permanent-review/geometry-localization-editorial-v2";
import {
  GEO_PERMANENT_MULTILINGUAL_REVIEW_AUTHORITY_V2,
  findGeometryLocalizationEnglishLeaksV2,
  generateGeometryPermanentMultilingualReviewV2,
  getGeometryLocalizationAuthoredPatternsV2,
} from "../permanent-review/geometry-permanent-multilingual-review-v2";

assert.equal(GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1.length, 75);
assert.equal(GEO_EXECUTABLE_TEMPORARY_PROTOTYPES_V1.length, 81);
assert.equal(Object.keys(GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2).length, 81);
assert.equal(GEO_PERMANENT_MULTILINGUAL_REVIEW_AUTHORITY_V2.additionalSourceVariantTemplateCount, 91);
assert.deepEqual(GEO_PERMANENT_MULTILINGUAL_REVIEW_AUTHORITY_V2.locales, ["hi-IN", "pa-IN"]);

function maskNumbers(value: string): string {
  let index = 0;
  return value.replace(/-?\d+(?:\.\d+)?/g, () => `{{${index++}}}`);
}

const sourceSuffixes = Array.from({ length: 96 }, (_, index) => `source-${String(index + 1).padStart(3, "0")}`);
let prototypesWithQuestionVariation = 0;
let prototypesWithExplanationVariation = 0;
let observedQuestionPatternCount = 0;
let observedExplanationPatternCount = 0;

for (const definition of GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1) {
  for (let variantIndex = 0; variantIndex < definition.prototypeIds.length; variantIndex += 1) {
    const prototypeId = definition.prototypeIds[variantIndex]!;
    const questions = new Set<string>();
    const explanationByLine: Array<Set<string>> = [];
    let expectedLineCount: number | null = null;

    for (const suffix of sourceSuffixes) {
      const item = generateGeometryPermanentEnglishFrozenV1(
        definition.qlId,
        `geo-v2-source-authority-${definition.qlId.toLowerCase()}-${variantIndex}-${suffix}`,
        variantIndex,
      );
      questions.add(maskNumbers(item.question));
      if (expectedLineCount === null) expectedLineCount = item.explanationLines.length;
      assert.equal(item.explanationLines.length, expectedLineCount, `${prototypeId}: frozen English explanation line count varies`);
      item.explanationLines.forEach((line, lineIndex) => {
        explanationByLine[lineIndex] ??= new Set<string>();
        explanationByLine[lineIndex]!.add(maskNumbers(line));
      });
    }

    const discoveredQuestions = [...questions].sort();
    const discoveredExplanations = explanationByLine.map((set) => [...set].sort());
    const authored = getGeometryLocalizationAuthoredPatternsV2(prototypeId);
    assert.deepEqual(
      discoveredQuestions,
      [...authored.questionPatterns].sort(),
      `${prototypeId}: authored V2 question-source authority is not exhaustive/exact`,
    );
    assert.equal(discoveredExplanations.length, authored.explanationPatternsByLine.length, `${prototypeId}: explanation source-line count drifted`);
    discoveredExplanations.forEach((patterns, lineIndex) => {
      assert.deepEqual(
        patterns,
        [...authored.explanationPatternsByLine[lineIndex]!].sort(),
        `${prototypeId}: authored V2 explanation source authority is not exhaustive/exact at line ${lineIndex + 1}`,
      );
    });

    if (discoveredQuestions.length > 1) prototypesWithQuestionVariation += 1;
    if (discoveredExplanations.some((patterns) => patterns.length > 1)) prototypesWithExplanationVariation += 1;
    observedQuestionPatternCount += discoveredQuestions.length;
    observedExplanationPatternCount += discoveredExplanations.reduce((sum, patterns) => sum + patterns.length, 0);
  }
}
assert.equal(prototypesWithQuestionVariation, 33);
assert.equal(prototypesWithExplanationVariation, 8);

function auditLocalized(item: ReturnType<typeof generateGeometryPermanentMultilingualReviewV2>) {
  assert.ok(item.question.trim().length >= 4);
  assert.equal(item.options.length, 4);
  assert.equal(new Set(item.options).size, 4);
  assert.ok(item.correctIndex >= 0 && item.correctIndex < 4);
  assert.equal(item.canonicalAnswer, item.options[item.correctIndex]);
  assert.ok(item.explanationLines.length >= 1);
  assert.ok(item.explanation.trim().length >= 4);
  assert.equal(item.englishImplementationFrozen, true);
  assert.equal(item.multilingualImplementationFrozen, false);
  assert.equal(item.active, false);
  assert.equal(item.questionStudioDiscoverable, false);
  assert.equal(item.questionBankWritable, false);
  assert.equal(item.testEligible, false);
  assert.equal(item.publiclyPublishable, false);
  assert.equal(item.stemSvg, item.rawPrototypeQuestion.stemSvg ?? null);
  assert.equal(item.canonicalGeometryFingerprint, item.rawPrototypeQuestion.canonicalGeometryFingerprint ?? null);
  assert.equal(item.diagramFingerprint, item.rawPrototypeQuestion.diagramFingerprint ?? null);
  const visible = `${item.question}\n${item.options.join("\n")}\n${item.explanation}`;
  assert.deepEqual(findGeometryLocalizationEnglishLeaksV2(visible), [], `${item.qlId}/${item.prototypeId}/${item.locale}: English prose leaked`);
  for (const leak of ["undefined", "[object Object]", "NaN", "{{"]) {
    assert.equal(visible.includes(leak), false, `${item.qlId}/${item.prototypeId}/${item.locale}: rendered ${leak}`);
  }
  if (item.locale === "hi-IN") {
    assert.equal(item.language, "hi");
    assert.match(`${item.question}\n${item.explanation}`, /[\u0900-\u097F]/, `${item.qlId}/${item.prototypeId}: Hindi script missing`);
  } else {
    assert.equal(item.language, "pa");
    assert.match(`${item.question}\n${item.explanation}`, /[\u0A00-\u0A7F]/, `${item.qlId}/${item.prototypeId}: Punjabi script missing`);
  }
}

let deterministicReviewSampleCount = 0;
for (const definition of GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1) {
  for (let variantIndex = 0; variantIndex < definition.prototypeIds.length; variantIndex += 1) {
    for (const locale of GEO_PERMANENT_MULTILINGUAL_REVIEW_AUTHORITY_V2.locales) {
      auditLocalized(generateGeometryPermanentMultilingualReviewV2(
        definition.qlId,
        `geo-ml-v2-review-${definition.qlId.toLowerCase()}-${variantIndex}-${locale}`,
        locale,
        variantIndex,
      ));
      deterministicReviewSampleCount += 1;
    }
  }
}
assert.equal(deterministicReviewSampleCount, 162);

const stressSuffixes = ["a", "b", "c", "d", "e", "f"] as const;
let stressSampleCount = 0;
for (const definition of GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1) {
  for (let variantIndex = 0; variantIndex < definition.prototypeIds.length; variantIndex += 1) {
    for (const locale of GEO_PERMANENT_MULTILINGUAL_REVIEW_AUTHORITY_V2.locales) {
      for (const suffix of stressSuffixes) {
        auditLocalized(generateGeometryPermanentMultilingualReviewV2(
          definition.qlId,
          `geo-ml-v2-stress-${definition.qlId.toLowerCase()}-${variantIndex}-${locale}-${suffix}`,
          locale,
          variantIndex,
        ));
        stressSampleCount += 1;
      }
    }
  }
}
assert.equal(stressSampleCount, 972);

const lifecycle = GEO_PERMANENT_MULTILINGUAL_REVIEW_AUTHORITY_V2.lifecycle;
assert.equal(lifecycle.englishFreezeProven, true);
assert.equal(lifecycle.localizationV1EditoriallyRejected, true);
assert.equal(lifecycle.localizationV2Implemented, true);
assert.equal(lifecycle.localizationV2SourceVariantCoverageImplemented, true);
assert.equal(lifecycle.localizationV2Proven, false);
assert.equal(lifecycle.multilingualImplementationFrozen, false);
assert.equal(lifecycle.multilingualFreezeAllowed, false);
assert.equal(lifecycle.questionStudioActivationAllowed, false);
assert.equal(lifecycle.questionBankWriteAllowed, false);
assert.equal(lifecycle.testEligibilityAllowed, false);
assert.equal(lifecycle.publicPublicationAllowed, false);
assert.equal(lifecycle.prMergeAuthorized, false);

console.log(JSON.stringify({
  status: "PASS_GEOMETRY_HINDI_PUNJABI_LOCALIZATION_REVIEW_V2_SOURCE_VARIANTS_EXHAUSTIVE",
  permanentQlCount: 75,
  mappedPrototypeVariantCount: 81,
  sourceSeedsPerPrototype: sourceSuffixes.length,
  prototypesWithQuestionVariation,
  prototypesWithExplanationVariation,
  observedQuestionPatternCount,
  observedExplanationPatternCount,
  additionalSourceVariantTemplateCount: GEO_PERMANENT_MULTILINGUAL_REVIEW_AUTHORITY_V2.additionalSourceVariantTemplateCount,
  locales: GEO_PERMANENT_MULTILINGUAL_REVIEW_AUTHORITY_V2.locales,
  deterministicReviewSampleCount,
  stressSampleCount,
  englishProseLeakCount: 0,
  postProofNextGate: GEO_PERMANENT_MULTILINGUAL_REVIEW_AUTHORITY_V2.postProofNextGate,
}, null, 2));
