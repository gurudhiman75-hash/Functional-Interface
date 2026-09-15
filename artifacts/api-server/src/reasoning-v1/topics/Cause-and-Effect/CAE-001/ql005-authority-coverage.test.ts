import assert from "node:assert/strict";
import { generateCaeQuestion } from "./chapter-generator.ts";
import { generateCp005CompetingQuestion, CP005_COMPETING_SCENARIOS } from "./cp005-competing-explanations.ts";
import { generateCp005EvidenceFitQuestion, CP005_EVIDENCE_FIT_SCENARIOS } from "./cp005-evidence-fit.ts";
import { withCae001SaturationWave2 } from "./causal-world-saturation-wave2.ts";
import { CAE_001_SATURATION_CANDIDATE_READY_FAMILY_IDS } from "./saturation-candidate-authorities.ts";
import { generateReviewedCaeQuestion } from "./reviewed-generator.ts";

const AUTHORITY_SWEEP = 50_000;
const REVIEWED_SWEEP = 50_000;
const CANDIDATE_READY = new Set<string>(CAE_001_SATURATION_CANDIDATE_READY_FAMILY_IDS);

function normalizeState(id: string): string {
  return id.replace(/\|reviewed-saturation-remap:\d+->\d+$/u, "");
}

const legacyStates = new Set<string>();
const evidenceFitStates = new Set<string>();
for (let seed = 0; seed < 5_000; seed += 1) {
  legacyStates.add(normalizeState(generateCp005CompetingQuestion({ locale: "en-IN", seed }).causalStateId));
  evidenceFitStates.add(normalizeState(generateCp005EvidenceFitQuestion({ locale: "en-IN", seed }).causalStateId));
}
assert.equal(legacyStates.size, CP005_COMPETING_SCENARIOS.length, "QL005 curated competing authority did not expose one state per scenario");
assert.equal(evidenceFitStates.size, CP005_EVIDENCE_FIT_SCENARIOS.length, "QL005 evidence-fit authority did not expose one state per scenario");
assert.equal(legacyStates.size, 11, "QL005 curated scenario count drifted");
assert.equal(evidenceFitStates.size, 12, "QL005 evidence-fit scenario count drifted");

const candidateStates = withCae001SaturationWave2(() => {
  const states = new Set<string>();
  for (let seed = 0; seed < AUTHORITY_SWEEP; seed += 1) {
    const q = generateCaeQuestion({ qlId: "CAE-QL-005", locale: "en-IN", seed });
    if (CANDIDATE_READY.has(q.scenarioFamilyId)) states.add(normalizeState(q.causalStateId));
  }
  return states;
});
assert.ok(candidateStates.size > 0, "QL005 candidate-heavy graph authority is empty");

const expected = new Set<string>([...legacyStates, ...evidenceFitStates, ...candidateStates]);
const reviewed = new Set<string>();
const reviewedFamilies = new Set<string>();
const reviewedOperations = new Set<string>();
let completeSeed: number | null = null;

for (let seed = 0; seed < REVIEWED_SWEEP; seed += 1) {
  const q = generateReviewedCaeQuestion({ qlId: "CAE-QL-005", locale: "en-IN", seed });
  const state = normalizeState(q.causalStateId);
  reviewed.add(state);
  reviewedFamilies.add(q.scenarioFamilyId);
  reviewedOperations.add(q.causalStructure.split(":")[1] ?? q.causalStructure);
  if (completeSeed === null && [...expected].every((key) => reviewed.has(key))) completeSeed = seed;
}

const missing = [...expected].filter((key) => !reviewed.has(key));
const unexpected = [...reviewed].filter((key) => !expected.has(key));
assert.deepEqual(missing, [], `QL005 reviewed routing misses ${missing.length} intended authority states:\n${missing.join("\n")}`);
assert.deepEqual(unexpected, [], `QL005 reviewed routing exposed ${unexpected.length} states outside the intended authority union:\n${unexpected.join("\n")}`);
assert.ok(completeSeed !== null, "QL005 reviewed routing did not complete its intended authority union within the sweep");

for (const familyId of [
  "CAE-FAM-REVIEWED-COMPETING",
  "CAE-FAM-COMPETING-TIMING-EVIDENCE",
  "CAE-FAM-COMPETING-SCOPE-EVIDENCE",
  "CAE-FAM-COMPETING-MECHANISM-EVIDENCE",
]) assert.ok(reviewedFamilies.has(familyId), `QL005 reviewed routing lost ${familyId}`);
for (const operation of ["TIMING_FIT", "SCOPE_FIT", "MECHANISM_FIT"]) assert.ok(reviewedOperations.has(operation), `QL005 reviewed routing lost ${operation}`);

console.log("PASS_CAE_QL005_AUTHORITY_COVERAGE", {
  curatedCompetingStates: legacyStates.size,
  evidenceFitStates: evidenceFitStates.size,
  candidateHeavyStates: candidateStates.size,
  expectedUnion: expected.size,
  reviewedStates: reviewed.size,
  completeSeed,
  evidenceFitOperations: [...reviewedOperations].filter((entry) => entry.endsWith("_FIT")).sort(),
});
