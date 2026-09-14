import assert from "node:assert/strict";
import { generateCp007CommonFactorQuestion } from "./cp007-common-factor.ts";
import { generateReviewedCp007SaturationCommonFactorQuestion } from "./cp007-saturation-adapter.ts";
import { generateReviewedCp007Wave4ParallelQuestion } from "./cp007-wave4-parallel-adapter.ts";
import { generateCp007ExpandedFalseCausationQuestion } from "./cp007-expanded-false-causation.ts";
import { generateReviewedCp007FalseCausationQuestion } from "./cp007-reviewed-visible-evidence.ts";
import { generateReviewedCaeQuestion } from "./reviewed-generator.ts";
import type { GeneratedCaeQuestion } from "./types.ts";

const AUTHORITY_SWEEP = 20_000;
const REVIEWED_SWEEP = 50_000;

function structuralForm(question: GeneratedCaeQuestion): string {
  return [
    question.causalStateId,
    `answer:${question.answerId}`,
    `difficulty:${question.difficulty}`,
  ].join("|");
}

const legacyCommon = new Set<string>();
const expandedCommon = new Set<string>();
const parallel = new Set<string>();
const expandedFalse = new Set<string>();
const legacyFalse = new Set<string>();

for (let seed = 0; seed < AUTHORITY_SWEEP; seed += 1) {
  legacyCommon.add(structuralForm(generateCp007CommonFactorQuestion({ locale: "en-IN", seed })));
  expandedCommon.add(structuralForm(generateReviewedCp007SaturationCommonFactorQuestion({ locale: "en-IN", seed })));
  parallel.add(structuralForm(generateReviewedCp007Wave4ParallelQuestion({ locale: "en-IN", seed })));
  expandedFalse.add(structuralForm(generateCp007ExpandedFalseCausationQuestion({ locale: "en-IN", seed })));
  legacyFalse.add(structuralForm(generateReviewedCp007FalseCausationQuestion({ locale: "en-IN", seed })));
}

const expected = new Set([
  ...legacyCommon,
  ...expandedCommon,
  ...parallel,
  ...expandedFalse,
  ...legacyFalse,
]);
const reviewed = new Set<string>();
let completeSeed: number | null = null;
for (let seed = 0; seed < REVIEWED_SWEEP; seed += 1) {
  reviewed.add(structuralForm(generateReviewedCaeQuestion({ qlId: "CAE-QL-007", locale: "en-IN", seed })));
  if (completeSeed === null && [...expected].every((key) => reviewed.has(key))) completeSeed = seed;
}

const missing = [...expected].filter((key) => !reviewed.has(key));
const unexpected = [...reviewed].filter((key) => !expected.has(key));
assert.deepEqual(missing, [], `QL007 reviewed routing misses ${missing.length} intended structural forms:\n${missing.join("\n")}`);
assert.deepEqual(unexpected, [], `QL007 reviewed routing exposed ${unexpected.length} forms outside the intended authority union:\n${unexpected.join("\n")}`);
assert.ok(completeSeed !== null, "QL007 reviewed routing did not complete its intended authority union within the sweep.");

const answers = new Set([...reviewed].map((key) => key.match(/answer:([^|]+)/u)?.[1] ?? "UNKNOWN"));
assert.ok(answers.has("COMMON_CAUSE"), "QL007 must preserve common-cause identification.");
assert.ok(answers.has("CORRELATION_ONLY"), "QL007 must preserve false-causation/correlation rejection.");

const modes = new Set<string>();
for (let seed = 0; seed < 2_000; seed += 1) {
  const q = generateReviewedCaeQuestion({ qlId: "CAE-QL-007", locale: "en-IN", seed });
  modes.add(q.causalStructure.split(":")[1] ?? q.causalStructure);
  assert.notEqual(q.difficulty, "EASY", `${seed}: QL007 reviewed delivery must not leak EASY content.`);
}
assert.ok(modes.has("CO_MOVEMENT"), "QL007 must retain co-movement false-causation reasoning.");
assert.ok(modes.has("POST_HOC"), "QL007 must retain post-hoc false-causation reasoning.");

console.log("PASS_CAE_QL007_AUTHORITY_COVERAGE", {
  legacyCommonForms: legacyCommon.size,
  expandedCommonForms: expandedCommon.size,
  parallelForms: parallel.size,
  expandedFalseForms: expandedFalse.size,
  legacyFalseForms: legacyFalse.size,
  expectedUnion: expected.size,
  reviewedForms: reviewed.size,
  completeSeed,
  answers: [...answers].sort(),
  modes: [...modes].sort(),
});
