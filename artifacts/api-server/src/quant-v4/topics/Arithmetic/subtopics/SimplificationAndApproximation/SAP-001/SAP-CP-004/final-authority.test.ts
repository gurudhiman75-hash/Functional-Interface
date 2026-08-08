import assert from "node:assert/strict";
import {
  SAP_CP004_CATALOGUE,
  SAP_CP004_PROPOSED_QL_BY_PROTOTYPE,
  SAP_CP004_PROTOTYPE_IDS,
  generateSapCp004Sweep,
  type SapCp004Oracle,
} from "./final-runtime";
import { generateSapCp004ReviewRecords } from "./review-export";

function power(base: bigint, exponent: number): bigint {
  let result = 1n;
  for (let index = 0; index < exponent; index += 1) result *= base;
  return result;
}

function factorial(n: number): bigint {
  let result = 1n;
  for (let value = 2; value <= n; value += 1) result *= BigInt(value);
  return result;
}

function gcd(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) [x, y] = [y, x % y];
  return x || 1n;
}

function fraction(numerator: bigint, denominator: bigint): string {
  let n = numerator;
  let d = denominator;
  if (d < 0n) { n = -n; d = -d; }
  const divisor = gcd(n, d);
  n /= divisor;
  d /= divisor;
  return d === 1n ? n.toString() : `${n}/${d}`;
}

function exactRoot(radicand: bigint, index: number): bigint {
  for (let candidate = 0n; candidate <= radicand; candidate += 1n) {
    const value = power(candidate, index);
    if (value === radicand) return candidate;
    if (value > radicand) break;
  }
  throw new Error(`${radicand} is not a perfect ${index}th power.`);
}

function solveOracle(oracle: SapCp004Oracle): string {
  const d = oracle.data;
  const mode = d.mode ?? 0;
  switch (oracle.kind) {
    case "POWER_EXPRESSION": {
      const powered = power(BigInt(d.base!), d.exponent!);
      if (mode === 1) return (powered - BigInt(d.add!)).toString();
      if (mode === 2) return (BigInt(d.multiplier!) * powered + BigInt(d.add!)).toString();
      if (mode === 3) return ((powered + BigInt(d.adjustment!)) / BigInt(d.divisor!)).toString();
      return (powered + BigInt(d.add!)).toString();
    }
    case "ZERO_ONE_EXPONENT": {
      if (mode === 1) return String(d.other! - 1);
      if (mode === 2) return String(d.multiplier! + d.other!);
      if (mode === 3) return String(2 * d.multiplier!);
      return String(1 + d.other!);
    }
    case "NEGATIVE_BASE": {
      const signed = power(BigInt(-d.base!), d.exponent!);
      if (mode === 1) return (BigInt(d.add!) - signed).toString();
      if (mode === 2) return (BigInt(d.multiplier!) * signed + BigInt(d.add!)).toString();
      if (mode === 3) return (signed - BigInt(d.add!)).toString();
      return (signed + BigInt(d.add!)).toString();
    }
    case "FRACTION_POWER": return fraction(power(BigInt(d.numerator!), d.exponent!), power(BigInt(d.denominator!), d.exponent!));
    case "SQUARE_ROOT": return exactRoot(BigInt(d.radicand!), 2).toString();
    case "CUBE_ROOT": return exactRoot(BigInt(d.radicand!), 3).toString();
    case "NTH_ROOT": return exactRoot(BigInt(d.radicand!), d.index!).toString();
    case "FRACTION_ROOT": return fraction(BigInt(d.numeratorRoot!), BigInt(d.denominatorRoot!));
    case "ROOT_ARITHMETIC": {
      const root = exactRoot(power(BigInt(d.root!), d.index!), d.index!);
      if (mode === 1) return (root * BigInt(d.multiplier!) - BigInt(d.add!)).toString();
      if (mode === 2) return ((root + BigInt(d.add!)) * BigInt(d.multiplier!)).toString();
      if (mode === 3) return (root + power(BigInt(d.multiplier!), 2)).toString();
      return (root * BigInt(d.multiplier!) + BigInt(d.add!)).toString();
    }
    case "POWER_ROOT_CANCELLATION": {
      const index = d.index ?? 2;
      return (exactRoot(power(BigInt(d.base!), index), index) + BigInt(d.add!)).toString();
    }
    case "NESTED_ROOT": return exactRoot(exactRoot(BigInt(d.radicand!), d.innerIndex!), d.outerIndex!).toString();
    case "FACTORIAL": return factorial(d.n!).toString();
    case "FACTORIAL_RATIO": return (factorial(d.n!) / factorial(d.n! - d.k!)).toString();
    case "FACTORIAL_MIXED": {
      if (mode === 1) return String(d.n! * d.multiplier! - d.add!);
      if (mode === 2) return String(d.n! * (d.n! - 1) - d.base! * d.base!);
      if (mode === 3) return String(d.n! + d.base!);
      return String(d.n! + d.base! * d.base!);
    }
    case "MISSING_EXPONENT": {
      assert.equal(power(BigInt(d.base!), d.exponent!), BigInt(d.target!));
      return String(d.exponent!);
    }
    case "MISSING_RADICAND": return power(BigInt(d.root!), d.index!).toString();
    case "COMPARISON": {
      const a = power(BigInt(d.aBase!), d.aExponent!);
      const b = exactRoot(power(BigInt(d.bRoot!), d.bIndex!), d.bIndex!);
      return a === b ? "A = B" : a > b ? "A > B" : "A < B";
    }
    case "DIAGNOSIS_POWER_ROOT":
    case "DIAGNOSIS_FACTORIAL": return d.errorStep === 0 ? "No error" : `Step ${d.errorStep}`;
  }
}

function maximumRun(sequence: readonly number[]): number {
  let maximum = 0;
  let current = 0;
  let previous = -1;
  for (const value of sequence) {
    current = value === previous ? current + 1 : 1;
    maximum = Math.max(maximum, current);
    previous = value;
  }
  return maximum;
}

function transitionCount(sequence: readonly number[], predicate: (previous: number, current: number) => boolean): number {
  let count = 0;
  for (let index = 1; index < sequence.length; index += 1) {
    if (predicate(sequence[index - 1]!, sequence[index]!)) count += 1;
  }
  return count;
}

function cyclicFourWindows(sequence: readonly number[]): number {
  let count = 0;
  for (let index = 0; index <= sequence.length - 4; index += 1) {
    const start = sequence[index]!;
    if (sequence[index + 1] === (start + 1) % 4 && sequence[index + 2] === (start + 2) % 4 && sequence[index + 3] === (start + 3) % 4) count += 1;
  }
  return count;
}

function fourGramFrequencies(sequence: readonly number[]): ReadonlyMap<string, number> {
  const counts = new Map<string, number>();
  for (let index = 0; index <= sequence.length - 4; index += 1) {
    const key = sequence.slice(index, index + 4).join("");
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

const BANNED_STUDENT_TERMS = /\b(?:AST|RPN|canonical payload|canonical evaluator|generation identity|prototype id|runtime seed|fingerprint)\b/i;
const DIVERSIFIED_PROTOTYPES = new Set([
  "SAP-CP004-PROT-POWER-MIXED-EXPRESSION",
  "SAP-CP004-PROT-ZERO-ONE-EXPONENT",
  "SAP-CP004-PROT-NEGATIVE-BASE-PARITY",
  "SAP-CP004-PROT-ROOT-MIXED-ARITHMETIC",
  "SAP-CP004-PROT-FACTORIAL-MIXED-EXPRESSION",
]);

assert.equal(SAP_CP004_PROTOTYPE_IDS.length, 19);
assert.equal(SAP_CP004_CATALOGUE.length, 19);
assert.deepEqual(
  SAP_CP004_CATALOGUE.map((item) => item.proposedPermanentQlId),
  Array.from({ length: 19 }, (_, index) => `SAP-QL-${String(53 + index).padStart(3, "0")}`),
);

const sweep = generateSapCp004Sweep(100);
assert.equal(sweep.length, 1_900);
const identities = new Set<string>();
const payloadsByPrototype = new Map<string, Set<string>>();
const framesByPrototype = new Map<string, Set<string>>();
const countsByPrototype = new Map<string, number>();
const comparisonAnswers = new Set<string>();
const diagnosisAnswers = new Map<string, Set<string>>();

for (const pkg of sweep) {
  assert.equal(pkg.validation.ok, true, `${pkg.prototypeId}/${pkg.seed}: ${pkg.validation.errors.join("; ")}`);
  assert.equal(solveOracle(pkg.oracle), pkg.canonicalAnswer, `${pkg.prototypeId}/${pkg.seed}: independent oracle mismatch.`);
  assert.equal(pkg.options.length, 4);
  assert.equal(new Set(pkg.options.map((option) => option.value)).size, 4);
  assert.equal(pkg.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(pkg.options[pkg.correctIndex]?.value, pkg.canonicalAnswer);
  assert.ok(pkg.options.filter((option) => !option.isCorrect).every((option) => Boolean(option.misconceptionId) && option.analysis.length >= 30));
  assert.ok(pkg.explanation.coreConcept.length >= 35);
  assert.ok(pkg.explanation.steps.length >= 2);
  assert.ok(pkg.explanation.finalAnswer.includes(pkg.canonicalAnswer));
  assert.equal(pkg.proposedPermanentQlId, SAP_CP004_PROPOSED_QL_BY_PROTOTYPE[pkg.prototypeId]);
  assert.equal(pkg.lifecycle.permanentQlId, null);
  assert.equal(pkg.lifecycle.contentStatus, "ENGLISH_REVIEW_CANDIDATE");
  assert.equal(pkg.lifecycle.active, false);
  assert.equal(pkg.lifecycle.questionStudioDiscoverable, false);
  assert.equal(pkg.lifecycle.questionBankWritable, false);
  assert.equal(pkg.lifecycle.testEligible, false);
  assert.equal(pkg.lifecycle.publiclyPublishable, false);
  assert.doesNotMatch([
    pkg.stem,
    pkg.explanation.coreConcept,
    ...pkg.explanation.steps,
    pkg.explanation.finalAnswer,
    ...pkg.options.map((option) => option.analysis),
  ].join("\n"), BANNED_STUDENT_TERMS);
  assert.ok(!identities.has(pkg.generationIdentity), `Duplicate generation identity ${pkg.generationIdentity}.`);
  identities.add(pkg.generationIdentity);

  const payloads = payloadsByPrototype.get(pkg.prototypeId) ?? new Set<string>();
  payloads.add(pkg.canonicalPayloadKey);
  payloadsByPrototype.set(pkg.prototypeId, payloads);
  const frames = framesByPrototype.get(pkg.prototypeId) ?? new Set<string>();
  frames.add(pkg.frameId);
  framesByPrototype.set(pkg.prototypeId, frames);
  countsByPrototype.set(pkg.prototypeId, (countsByPrototype.get(pkg.prototypeId) ?? 0) + 1);

  if (pkg.prototypeId === "SAP-CP004-PROT-FACTORIAL-RATIO") {
    const ids = new Set(pkg.options.filter((option) => !option.isCorrect).map((option) => option.misconceptionId));
    assert.ok(ids.has("FACTORIAL_RATIO_OMITS_LAST_FACTOR"));
    assert.ok(ids.has("FACTORIAL_RATIO_INCLUDES_EXTRA_FACTOR"));
  }
  if (pkg.prototypeId === "SAP-CP004-PROT-NEGATIVE-BASE-PARITY") {
    assert.ok(pkg.options.some((option) => option.misconceptionId === "NEGATIVE_BASE_PARITY_REVERSED"));
  }
  if (pkg.prototypeId === "SAP-CP004-PROT-BOUNDED-NTH-ROOT" && pkg.oracle.data.index === 4) {
    assert.match(pkg.stem, /principal|positive|non-negative/i);
  }
  if (pkg.prototypeId === "SAP-CP004-PROT-MISSING-EXPONENT") assert.match(pkg.stem, /non-negative integer/i);
  if (pkg.prototypeId === "SAP-CP004-PROT-COMPARE-POWER-ROOT-EXPRESSIONS") {
    comparisonAnswers.add(pkg.canonicalAnswer);
    assert.notEqual(pkg.difficulty, "HARD");
  }
  if (pkg.taskDirection === "DIAGNOSIS") {
    const values = diagnosisAnswers.get(pkg.prototypeId) ?? new Set<string>();
    values.add(pkg.canonicalAnswer);
    diagnosisAnswers.set(pkg.prototypeId, values);
  }
}

assert.equal(identities.size, 1_900);
assert.equal(countsByPrototype.size, 19);
for (const prototypeId of SAP_CP004_PROTOTYPE_IDS) {
  assert.equal(countsByPrototype.get(prototypeId), 100);
  assert.ok((payloadsByPrototype.get(prototypeId)?.size ?? 0) >= 15, `${prototypeId} lacks payload diversity.`);
  if (DIVERSIFIED_PROTOTYPES.has(prototypeId)) {
    assert.equal(framesByPrototype.get(prototypeId)?.size, 4, `${prototypeId} must expose four genuine structures.`);
  }
}
assert.deepEqual([...comparisonAnswers].sort(), ["A < B", "A = B", "A > B"]);
for (const values of diagnosisAnswers.values()) assert.deepEqual([...values].sort(), ["No error", "Step 1", "Step 2", "Step 3"]);

const review = generateSapCp004ReviewRecords();
assert.equal(review.length, 300);
assert.equal(new Set(review.map((record) => record.canonicalPayloadKey)).size, 300);
assert.equal(new Set(review.map((record) => record.stem)).size, 300);
assert.equal(new Set(review.map((record) => record.questionId)).size, 300);
assert.equal(new Set(review.map((record) => record.prototypeId)).size, 19);
for (const record of review) assert.equal(solveOracle(record.oracle), record.canonicalAnswer);

const sequence = review.map((record) => record.correctIndex);
const distribution = [0, 1, 2, 3].map((position) => sequence.filter((value) => value === position).length);
const samePositionTransitions = transitionCount(sequence, (previous, current) => previous === current);
const forwardCycleTransitions = transitionCount(sequence, (previous, current) => current === (previous + 1) % 4);
const fourGrams = fourGramFrequencies(sequence);
const maximumFourGramFrequency = Math.max(...fourGrams.values());
assert.deepEqual(distribution, [75, 75, 75, 75]);
assert.equal(maximumRun(sequence), 2);
assert.ok(samePositionTransitions >= 35 && samePositionTransitions <= 90);
assert.ok(forwardCycleTransitions <= 110);
assert.ok(cyclicFourWindows(sequence) <= 20);
assert.ok(fourGrams.size >= 130);
assert.ok(maximumFourGramFrequency <= 7);

console.log(JSON.stringify({
  status: "PASS_SAP_CP004_FINAL_DIVERSIFIED_ENGLISH_AUTHORITY",
  packagesTested: sweep.length,
  uniqueGenerationIdentities: identities.size,
  prototypeCount: countsByPrototype.size,
  diversifiedPrototypeCount: DIVERSIFIED_PROTOTYPES.size,
  reviewQuestions: review.length,
  uniqueReviewPayloads: new Set(review.map((record) => record.canonicalPayloadKey)).size,
  uniqueReviewStems: new Set(review.map((record) => record.stem)).size,
  proposedQlRange: "SAP-QL-053..SAP-QL-071",
  answerPositionCounts: { A: distribution[0], B: distribution[1], C: distribution[2], D: distribution[3] },
  maximumSamePositionRun: maximumRun(sequence),
  samePositionTransitions,
  forwardCycleTransitions,
  cyclicFourAnswerWindows: cyclicFourWindows(sequence),
  distinctFourAnswerPatterns: fourGrams.size,
  maximumFourAnswerPatternFrequency: maximumFourGramFrequency,
  difficultyCounts: {
    EASY: review.filter((record) => record.difficulty === "EASY").length,
    MEDIUM: review.filter((record) => record.difficulty === "MEDIUM").length,
    HARD: review.filter((record) => record.difficulty === "HARD").length,
  },
  lifecycle: "INACTIVE_REVIEW_CANDIDATE_PERMANENT_IDS_NOT_ALLOCATED",
}, null, 2));
