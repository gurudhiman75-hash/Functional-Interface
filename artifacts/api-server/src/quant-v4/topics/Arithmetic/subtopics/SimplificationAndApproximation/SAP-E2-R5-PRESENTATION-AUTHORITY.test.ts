import assert from "node:assert/strict";
import { generateSapCp011E2 } from "./SAP-002/SAP-CP-011/runtime-release";
import { generateSapCp012E2 } from "./SAP-002/SAP-CP-012/runtime-release-r5";

function num(value: number | string | undefined, label: string): number {
  const n = Number(value);
  if (!Number.isFinite(n)) throw new Error(`Missing numeric oracle value: ${label}`);
  return n;
}

let boundStates = 0;
let fractionStates = 0;
let roundedSynthesisStates = 0;

for (let seed = 1; seed <= 100; seed += 1) {
  const bound = generateSapCp011E2("CP011-E2-COMPOSED-ROUNDING-BOUND", seed);
  assert.equal(bound.validation.ok, true, `bound/${seed}: ${bound.validation.errors.join("; ")}`);
  assert.match(bound.stem, /tightest interval/i);
  const lower = num(bound.oracle.data.lower, "lower");
  const upper = num(bound.oracle.data.upper, "upper");
  const anchor = num(bound.oracle.data.anchor, "anchor");
  const b = num(bound.oracle.data.b, "b");
  assert.equal(bound.oracle.data.lowerInclusive, "true");
  assert.equal(bound.oracle.data.upperInclusive, "false");
  assert.equal(bound.canonicalAnswer, `${lower} ≤ x + y < ${upper}`);
  assert.equal((anchor - 0.5) + (b - 0.5), lower, `bound/${seed}: lower endpoint must be attainable`);
  assert.equal(bound.options[bound.correctIndex]?.value, bound.canonicalAnswer);
  assert.equal(bound.options.filter(o => o.isCorrect).length, 1);
  assert.ok(bound.options.some(o => o.misconceptionId === "EXCLUDE_ATTAINABLE_LOWER_ENDPOINT"));
  assert.ok(bound.options.some(o => o.misconceptionId === "NOT_TIGHTEST"));
  assert.match(bound.explanation.steps.join(" "), /≤/);
  boundStates += 1;

  const fraction = generateSapCp011E2("CP011-E2-CLOSEST-FRACTION-PRODUCT", seed);
  assert.equal(fraction.validation.ok, true, `fraction/${seed}: ${fraction.validation.errors.join("; ")}`);
  assert.ok(!fraction.options.some(o => o.misconceptionId === "NO_CANCELLATION"), `fraction/${seed}: false no-cancellation distractor survived`);
  const early = fraction.options.find(o => o.misconceptionId === "EARLY_ROUND_LOW");
  assert.ok(early, `fraction/${seed}: missing early-rounding distractor`);
  assert.doesNotMatch(early.analysis, /without.*cancell/i);
  fractionStates += 1;

  const rounded = generateSapCp012E2("CP012-E2-ROUNDED-OPERAND-SYNTHESIS", seed);
  assert.equal(rounded.validation.ok, true, `rounded/${seed}: ${rounded.validation.errors.join("; ")}`);
  assert.equal(rounded.explanation.finalAnswer, `Therefore, ${rounded.canonicalAnswer}.`);
  assert.doesNotMatch(rounded.explanation.finalAnswer, /\?\s*≈/);
  assert.match(rounded.canonicalAnswer, /x/);
  roundedSynthesisStates += 1;
}

assert.equal(boundStates, 100);
assert.equal(fractionStates, 100);
assert.equal(roundedSynthesisStates, 100);
console.log(JSON.stringify({
  authority: "SAP-E2-R5-PRESENTATION-SEMANTICS",
  boundStates,
  fractionStates,
  roundedSynthesisStates,
  halfOpenRoundingBounds: true,
  tightestIntervalContract: true,
  misconceptionRationaleGuard: true,
  intervalFinalAnswerGuard: true,
  lifecycle: "INACTIVE",
}));
