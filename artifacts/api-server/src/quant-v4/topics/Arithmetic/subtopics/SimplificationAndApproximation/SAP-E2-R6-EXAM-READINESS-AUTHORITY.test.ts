import assert from "node:assert/strict";
import { generateSapCp011E2 } from "./SAP-002/SAP-CP-011/runtime-release-r6";
import { generateSapCp012E2 } from "./SAP-002/SAP-CP-012/runtime-release-r6";

let estimate1 = 0, estimate2 = 0;
const classes = new Set<string>();
for (let seed = 1; seed <= 100; seed += 1) {
  const accuracy = generateSapCp011E2("CP011-E2-COMPARE-ESTIMATE-ACCURACY", seed);
  assert.equal(accuracy.validation.ok, true);
  const d1 = Number(accuracy.oracle.data.d1), d2 = Number(accuracy.oracle.data.d2);
  const expected = d1 < d2 ? "Estimate 1" : "Estimate 2";
  assert.ok(accuracy.canonicalAnswer.startsWith(expected), `accuracy/${seed}: wrong better estimate`);
  expected === "Estimate 1" ? estimate1++ : estimate2++;

  const rounded = generateSapCp012E2("CP012-E2-ROUNDED-OPERAND-SYNTHESIS", seed);
  assert.equal(rounded.validation.ok, true);
  assert.equal(rounded.difficulty, "MEDIUM");
  assert.match(rounded.stem, /exact interval of possible values/i);
  assert.doesNotMatch(rounded.stem, /Which interval can contain/i);
  assert.equal(rounded.explanation.finalAnswer, `Therefore, ${rounded.canonicalAnswer}.`);
  const roundedPayload = JSON.parse(rounded.canonicalPayloadKey);
  assert.equal(roundedPayload.stem, rounded.stem, `rounded/${seed}: canonical payload retained stale stem`);

  const count = generateSapCp012E2("CP012-E2-COUNT-ADMISSIBLE-INTEGERS", seed);
  assert.equal(count.difficulty, "MEDIUM");
  const outcome = generateSapCp012E2("CP012-E2-OUTCOME-CLASSIFICATION", seed);
  assert.equal(outcome.difficulty, "MEDIUM");
  classes.add(outcome.canonicalAnswer);
}
assert.equal(estimate1, 50);
assert.equal(estimate2, 50);
assert.deepEqual([...classes].sort(), ["Impossible", "Multiple", "Unique"]);
console.log(JSON.stringify({authority:"SAP-E2-R6-EXAM-READINESS",states:400,estimateAccuracy:{estimate1,estimate2},outcomeClasses:[...classes].sort(),difficultyCalibration:{count:"MEDIUM",outcome:"MEDIUM",roundedOperand:"MEDIUM"},roundedOperandStem:"UNAMBIGUOUS_EXACT_INTERVAL",canonicalPayloadStemBinding:true,lifecycle:"INACTIVE"}));
