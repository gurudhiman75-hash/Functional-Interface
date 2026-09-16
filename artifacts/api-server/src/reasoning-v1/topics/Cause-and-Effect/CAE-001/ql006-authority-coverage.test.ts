import assert from "node:assert/strict";
import { generateCp006CausalDistanceQuestion } from "./cp006-causal-distance.ts";
import { generateCp006BridgeDistanceQuestion } from "./cp006-bridge-distance.ts";
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

const causalDistance = new Set<string>();
const bridgeDistance = new Set<string>();
for (let seed = 0; seed < AUTHORITY_SWEEP; seed += 1) {
  causalDistance.add(structuralForm(generateCp006CausalDistanceQuestion({ locale: "en-IN", seed })));
  bridgeDistance.add(structuralForm(generateCp006BridgeDistanceQuestion({ locale: "en-IN", seed })));
}

const expected = new Set([...causalDistance, ...bridgeDistance]);
const reviewed = new Set<string>();
let completeSeed: number | null = null;
for (let seed = 0; seed < REVIEWED_SWEEP; seed += 1) {
  reviewed.add(structuralForm(generateReviewedCaeQuestion({ qlId: "CAE-QL-006", locale: "en-IN", seed })));
  if (completeSeed === null && [...expected].every((key) => reviewed.has(key))) completeSeed = seed;
}

const missing = [...expected].filter((key) => !reviewed.has(key));
const unexpected = [...reviewed].filter((key) => !expected.has(key));
assert.deepEqual(missing, [], `QL006 reviewed routing misses ${missing.length} intended structural forms:\n${missing.join("\n")}`);
assert.deepEqual(unexpected, [], `QL006 reviewed routing exposed ${unexpected.length} forms outside the intended authority union:\n${unexpected.join("\n")}`);
assert.ok(completeSeed !== null, "QL006 reviewed routing did not complete its intended authority union within the sweep.");

const answerKinds = new Set([...reviewed].map((key) => key.match(/answer:([^|]+)/u)?.[1] ?? "UNKNOWN"));
for (const expectedAnswer of [
  "FIRST_EFFECT_SECOND_IMMEDIATE",
  "SECOND_EFFECT_FIRST_IMMEDIATE",
  "FIRST_EFFECT_SECOND_REMOTE",
  "SECOND_EFFECT_FIRST_REMOTE",
  "FIRST_BRIDGE",
  "FINAL_BRIDGE",
]) {
  assert.ok(answerKinds.has(expectedAnswer), `QL006 is missing learner operation/answer ${expectedAnswer}.`);
}

console.log("PASS_CAE_QL006_AUTHORITY_COVERAGE", {
  causalDistanceForms: causalDistance.size,
  bridgeDistanceForms: bridgeDistance.size,
  expectedUnion: expected.size,
  reviewedForms: reviewed.size,
  completeSeed,
  answerKinds: [...answerKinds].sort(),
});
