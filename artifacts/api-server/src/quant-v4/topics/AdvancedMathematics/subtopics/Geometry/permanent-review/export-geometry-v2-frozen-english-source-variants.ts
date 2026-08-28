import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1,
} from "./geometry-permanent-english-runtime-v1";
import { generateGeometryPermanentEnglishFrozenV1 } from "./geometry-permanent-english-freeze-v1";
import {
  GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2,
  GEO_LOCALIZATION_EDITORIAL_VARIANTS_V2,
  GEO_LOCALIZATION_OPTION_TRANSLATIONS_V2,
} from "./geometry-localization-editorial-v2";

function maskNumbers(value: string): string {
  let index = 0;
  return value.replace(/-?\d+(?:\.\d+)?/g, () => `{{${index++}}}`);
}

const seedSuffixes = Array.from({ length: 96 }, (_, index) => `source-${String(index + 1).padStart(3, "0")}`);
const prototypes = GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1.flatMap((definition) =>
  definition.prototypeIds.map((prototypeId, variantIndex) => {
    const questions = new Set<string>();
    const explanationLines: Array<Set<string>> = [];
    for (const suffix of seedSuffixes) {
      const item = generateGeometryPermanentEnglishFrozenV1(
        definition.qlId,
        `geo-v2-source-authority-${definition.qlId.toLowerCase()}-${variantIndex}-${suffix}`,
        variantIndex,
      );
      questions.add(maskNumbers(item.question));
      item.explanationLines.forEach((line, lineIndex) => {
        explanationLines[lineIndex] ??= new Set<string>();
        explanationLines[lineIndex]!.add(maskNumbers(line));
      });
    }
    return {
      qlId: definition.qlId,
      prototypeId,
      variantIndex,
      questionPatterns: [...questions],
      explanationPatternsByLine: explanationLines.map((set) => [...set]),
    };
  }),
);

const outputDirectory = resolve(process.cwd(), "dist/quant-v4/geometry-v2-frozen-english-source-variants");
mkdirSync(outputDirectory, { recursive: true });
writeFileSync(resolve(outputDirectory, "geometry-v2-frozen-english-source-variants.json"), JSON.stringify({
  status: "GEOMETRY_V2_FROZEN_ENGLISH_SOURCE_VARIANTS_EXPORTED",
  seedsPerPrototype: seedSuffixes.length,
  prototypeCount: prototypes.length,
  prototypes,
  authoredCanonicalTemplates: GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2,
  authoredSourceVariants: GEO_LOCALIZATION_EDITORIAL_VARIANTS_V2,
  authoredOptionTranslations: GEO_LOCALIZATION_OPTION_TRANSLATIONS_V2,
}, null, 2) + "\n");

console.log(JSON.stringify({
  status: "EXPORTED_GEOMETRY_V2_FROZEN_ENGLISH_SOURCE_VARIANTS",
  seedsPerPrototype: seedSuffixes.length,
  prototypeCount: prototypes.length,
  prototypesWithQuestionVariation: prototypes.filter((entry) => entry.questionPatterns.length > 1).length,
  prototypesWithExplanationVariation: prototypes.filter((entry) => entry.explanationPatternsByLine.some((line) => line.length > 1)).length,
  canonicalTemplateCount: Object.keys(GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2).length,
  sourceVariantPrototypeCount: Object.keys(GEO_LOCALIZATION_EDITORIAL_VARIANTS_V2).length,
  outputDirectory,
}, null, 2));
