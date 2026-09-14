import assert from "node:assert/strict";
import { generateReviewedCp009Question } from "./cp009-final-quality-guard.ts";
import { generateCp009SaturationQuestion } from "./cp009-saturation-adapter.ts";
import { generateCp009ExpandedCommonCauseQuestion } from "./cp009-expanded-common-cause.ts";
import { generateReviewedCaeQuestion } from "./reviewed-generator.ts";
import type { GeneratedCaeQuestion } from "./types.ts";

const AUTHORITY_SWEEP = 20_000;
const REVIEWED_SWEEP = 50_000;

function mode(question: GeneratedCaeQuestion): string {
  return question.causalStructure.split(":")[1] ?? "UNKNOWN";
}

function structuralForm(question: GeneratedCaeQuestion): string {
  return [
    question.projectionId,
    mode(question),
    question.scenarioFamilyId,
    question.scenarioVariantId,
    question.answerId,
    question.difficulty,
  ].join("|");
}

const legacy = new Set<string>();
const saturation = new Set<string>();
const expanded = new Set<string>();

for (let seed = 0; seed < AUTHORITY_SWEEP; seed += 1) {
  const legacyQuestion = generateReviewedCp009Question({ locale: "en-IN", seed });
  // The reviewed chapter router deliberately replaces this small frozen legacy
  // common-cause authority with the expanded common-cause authority. Preserve
  // the raw authority underneath, but do not require learner delivery to expose it.
  if (mode(legacyQuestion) !== "COMMON_CAUSE_RECONSTRUCTION") {
    legacy.add(structuralForm(legacyQuestion));
  }
  saturation.add(structuralForm(generateCp009SaturationQuestion({ locale: "en-IN", seed })));
  expanded.add(structuralForm(generateCp009ExpandedCommonCauseQuestion({ locale: "en-IN", seed })));
}

const expected = new Set([...legacy, ...saturation, ...expanded]);
const reviewed = new Set<string>();
let completeSeed: number | null = null;
for (let seed = 0; seed < REVIEWED_SWEEP; seed += 1) {
  reviewed.add(structuralForm(generateReviewedCaeQuestion({ qlId: "CAE-QL-009", locale: "en-IN", seed })));
  if (completeSeed === null && [...expected].every((key) => reviewed.has(key))) completeSeed = seed;
}

const missing = [...expected].filter((key) => !reviewed.has(key));
const unexpected = [...reviewed].filter((key) => !expected.has(key));
assert.deepEqual(missing, [], `QL009 reviewed routing misses ${missing.length} intended authority forms:\n${missing.join("\n")}`);
assert.deepEqual(unexpected, [], `QL009 reviewed routing exposed ${unexpected.length} forms outside the intended authority union:\n${unexpected.join("\n")}`);
assert.ok(completeSeed !== null, "QL009 reviewed routing did not complete its authority union within the sweep.");

const reviewedModes = new Set([...reviewed].map((key) => key.split("|")[1]!));
assert.deepEqual(
  reviewedModes,
  new Set(["MISSING_SINGLE", "MISSING_PAIR", "RELATION_TYPE", "CONNECTOR_PAIR", "NEXT_OUTCOME", "COMMON_CAUSE_RECONSTRUCTION", "COMMON_CAUSE_RECONSTRUCTION_EXPANDED"]),
  "QL009 reviewed authority coverage must retain every intended integrated operation.",
);

console.log("PASS_CAE_QL009_AUTHORITY_COVERAGE", {
  legacyForms: legacy.size,
  saturationForms: saturation.size,
  expandedCommonCauseForms: expanded.size,
  expectedUnion: expected.size,
  reviewedForms: reviewed.size,
  completeSeed,
});
