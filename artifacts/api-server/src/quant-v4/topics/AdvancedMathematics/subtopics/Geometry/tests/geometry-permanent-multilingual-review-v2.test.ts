import assert from "node:assert/strict";
import {
  GEO_EXECUTABLE_TEMPORARY_PROTOTYPES_V1,
  GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1,
} from "../permanent-review/geometry-permanent-english-runtime-v1";
import { generateGeometryPermanentEnglishFrozenV1 } from "../permanent-review/geometry-permanent-english-freeze-v1";
import { GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2 } from "../permanent-review/geometry-localization-editorial-v2";

assert.equal(GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1.length, 75);
assert.equal(GEO_EXECUTABLE_TEMPORARY_PROTOTYPES_V1.length, 81);
assert.equal(Object.keys(GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2).length, 81);

function maskNumbers(value: string): string {
  let index = 0;
  return value.replace(/-?\d+(?:\.\d+)?/g, () => `{{${index++}}}`);
}

const suffixes = Array.from({ length: 48 }, (_, index) => `s${String(index + 1).padStart(2, "0")}`);
const discoveries: Array<{
  qlId: string;
  prototypeId: string;
  questionPatterns: string[];
  explanationPatternsByLine: string[][];
  authoredQuestionPattern: string;
  authoredExplanationPatterns: string[];
  missingQuestionPatterns: string[];
  missingExplanationPatternsByLine: string[][];
}> = [];

for (const definition of GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1) {
  for (let variantIndex = 0; variantIndex < definition.prototypeIds.length; variantIndex += 1) {
    const prototypeId = definition.prototypeIds[variantIndex]!;
    const template = GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2[prototypeId as keyof typeof GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2];
    if (!template) throw new Error(`${prototypeId}: missing authored V2 template`);

    const questions = new Set<string>();
    const explanationByLine: Array<Set<string>> = [];
    let expectedLineCount: number | null = null;

    for (const suffix of suffixes) {
      const item = generateGeometryPermanentEnglishFrozenV1(
        definition.qlId,
        `geo-ml-v2-source-discovery-${definition.qlId.toLowerCase()}-${variantIndex}-${suffix}`,
        variantIndex,
      );
      questions.add(maskNumbers(item.question));
      if (expectedLineCount === null) expectedLineCount = item.explanationLines.length;
      assert.equal(item.explanationLines.length, expectedLineCount, `${prototypeId}: explanation line count varies across frozen English seeds`);
      item.explanationLines.forEach((line, lineIndex) => {
        explanationByLine[lineIndex] ??= new Set<string>();
        explanationByLine[lineIndex]!.add(maskNumbers(line));
      });
    }

    const questionPatterns = [...questions];
    const explanationPatternsByLine = explanationByLine.map((set) => [...set]);
    const authoredQuestionPattern = template.question.sourceMasked;
    const authoredExplanationPatterns = template.explanations.map((candidate) => candidate.sourceMasked);
    const missingQuestionPatterns = questionPatterns.filter((pattern) => pattern !== authoredQuestionPattern);
    const missingExplanationPatternsByLine = explanationPatternsByLine.map((patterns, lineIndex) =>
      patterns.filter((pattern) => pattern !== authoredExplanationPatterns[lineIndex]),
    );

    const hasVariation = questionPatterns.length > 1 || explanationPatternsByLine.some((patterns) => patterns.length > 1);
    const hasMissing = missingQuestionPatterns.length > 0 || missingExplanationPatternsByLine.some((patterns) => patterns.length > 0);
    if (hasVariation || hasMissing) {
      discoveries.push({
        qlId: definition.qlId,
        prototypeId,
        questionPatterns,
        explanationPatternsByLine,
        authoredQuestionPattern,
        authoredExplanationPatterns,
        missingQuestionPatterns,
        missingExplanationPatternsByLine,
      });
    }
  }
}

console.error(JSON.stringify({
  status: "GEOMETRY_V2_FROZEN_ENGLISH_SOURCE_VARIANT_DISCOVERY",
  seedsPerPrototype: suffixes.length,
  prototypeCount: 81,
  prototypesWithVariationOrMissingAuthority: discoveries.length,
  discoveries,
}, null, 2));

if (discoveries.some((entry) => entry.missingQuestionPatterns.length > 0 || entry.missingExplanationPatternsByLine.some((patterns) => patterns.length > 0))) {
  throw new Error("Geometry V2 source-variant discovery found frozen-English patterns not represented by the current human-editorial authority.");
}
