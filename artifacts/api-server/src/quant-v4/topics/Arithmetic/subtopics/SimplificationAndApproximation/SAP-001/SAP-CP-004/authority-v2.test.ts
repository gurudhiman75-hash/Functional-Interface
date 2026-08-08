import assert from "node:assert/strict";
import {
  SAP_CP004_CATALOGUE,
  SAP_CP004_PROPOSED_QL_BY_PROTOTYPE,
  SAP_CP004_PROTOTYPE_IDS,
  generateSapCp004Sweep,
  type SapCp004Oracle,
} from "./runtime-v2";
import { generateSapCp004ReviewRecords } from "./review-export";

function power(base: bigint, exponent: number): bigint {
  assert.ok(Number.isInteger(exponent) && exponent >= 0);
  let result = 1n;
  for (let index = 0; index < exponent; index += 1) result *= base;
  return result;
}

function factorial(n: number): bigint {
  assert.ok(Number.isInteger(n) && n >= 0 && n <= 12);
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
  assert.notEqual(denominator, 0n);
  let n = numerator;
  let d = denominator;
  if (d < 0n) { n = -n; d = -d; }
  const divisor = gcd(n, d);
  n /= divisor;
  d /= divisor;
  return d === 1n ? n.toString() : `${n}/${d}`;
}

function exactRoot(radicand: bigint, index: number): bigint {
  assert.ok(radicand >= 0n && index >= 2 && index <= 6);
  for (let candidate = 0n; candidate <= radicand; candidate += 1n) {
    const value = power(candidate, index);
    if (value === radicand) return candidate;
    if (value > radicand) break;
  }
  throw new Error(`${radicand} is not a perfect ${index}th power.`);
}

function solveOracle(oracle: SapCp004Oracle): string {
  const d = oracle.data;
  switch (oracle.kind) {
    case "POWER_EXPRESSION": return (power(BigInt(d.base!), d.exponent!) + BigInt(d.add!)).toString();
    case "ZERO_ONE_EXPONENT": return (1n + BigInt(d.other!)).toString();
    case "NEGATIVE_BASE": return (power(BigInt(-d.base!), d.exponent!) + BigInt(d.add!)).toString();
    case "FRACTION_POWER": return fraction(power(BigInt(d.numerator!), d.exponent!), power(BigInt(d.denominator!), d.exponent!));
    case "SQUARE_ROOT": return exactRoot(BigInt(d.radicand!), 2).toString();
    case "CUBE_ROOT": return exactRoot(BigInt(d.radicand!), 3).toString();
    case "NTH_ROOT": return exactRoot(BigInt(d.radicand!), d.index!).toString();
    case "FRACTION_ROOT": {
      const numeratorPower = power(BigInt(d.numeratorRoot!), d.index!);
      const denominatorPower = power(BigInt(d.denominatorRoot!), d.index!);
      return fraction(exactRoot(numeratorPower, d.index!), exactRoot(denominatorPower, d.index!));
    }
    case "ROOT_ARITHMETIC": {
      const radicand = power(BigInt(d.root!), d.index!);
      return (BigInt(d.multiplier!) * exactRoot(radicand, d.index!) + BigInt(d.add!)).toString();
    }
    case "POWER_ROOT_CANCELLATION": {
      const index = d.index ?? 2;
      return (exactRoot(power(BigInt(d.base!), index), index) + BigInt(d.add!)).toString();
    }
    case "NESTED_ROOT": {
      const inner = exactRoot(BigInt(d.radicand!), d.innerIndex!);
      return exactRoot(inner, d.outerIndex!).toString();
    }
    case "FACTORIAL": return factorial(d.n!).toString();
    case "FACTORIAL_RATIO": return (factorial(d.n!) / factorial(d.n! - d.k!)).toString();
    case "FACTORIAL_MIXED": return (BigInt(d.n!) + power(BigInt(d.base!), 2)).toString();
    case "MISSING_EXPONENT": {
      assert.equal(power(BigInt(d.base!), d.exponent!), BigInt(d.target!));
      return String(d.exponent!);
    }
    case "MISSING_RADICAND": return power(BigInt(d.root!), d.index!).toString();
    case "COMPARISON": {
      const a = power(BigInt(d.aBase!), d.aExponent!);
      const bRadicand = power(BigInt(d.bRoot!), d.bIndex!);
      const b = exactRoot(bRadicand, d.bIndex!);
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

function positionDistribution(sequence: readonly number[]): readonly number[] {
  return [0, 1, 2, 3].map((position) => sequence.filter((value) => value === position).length);
}

function forwardTransitions(sequence: readonly number[]): number {
  let count = 0;
  for (let index = 1; index < sequence.length; index += 1) {
    if (sequence[index] === ((sequence[index - 1]! + 1) % 4)) count += 1;
  }
  return count;
}

function samePositionTransitions(sequence: readonly number[]): number {
  let count = 0;
  for (let index = 1; index < sequence.length; index += 1) if (sequence[index] === sequence[index - 1]) count += 1;
  return count;
}

function cyclicFourWindows(sequence: readonly number[]): number {
  let count = 0;
  for (let index = 0; index <= sequence.length - 4; index += 1) {
    const start = sequence[index]!;
    if (
      sequence[index + 1] === (start + 1) % 4
      && sequence[index + 2] === (start + 2) % 4
      && sequence[index + 3] === (start + 3) % 4
    ) count += 1;
  }
  return count;
}

function fourGramFrequencies(sequence: readonly number[]): ReadonlyMap<string, number> {
  const result = new Map<string, number>();
  for (let index = 0; index <= sequence.length - 4; index += 1) {
    const key = sequence.slice(index, index + 4).join("");
    result.set(key, (result.get(key) ?? 0) + 1);
  }
  return result;
}

const BANNED = /\b(?:AST|RPN|canonical payload|canonical evaluator|generation identity|prototype id|runtime seed|fingerprint)\b/i;

assert.equal(SAP_CP004_PROTOTYPE_IDS.length, 19);
assert.equal(SAP_CP004_CATALOGUE.length, 19);
assert.equal(new Set(SAP_CP004_CATALOGUE.map((item) => item.proposedPermanentQlId)).size, 19);
assert.deepEqual(
  SAP_CP004_CATALOGUE.map((item) => item.proposedPermanentQlId),
  Array.from({ length: 19 }, (_, index) => `SAP-QL-${String(53 + index).padStart(3, "0")}`),
);

const sweep = generateSapCp004Sweep(100);
assert.equal(sweep.length, 1_900);
const identities = new Set<string>();
const payloadCounts = new Map<string, Set<string>>();
const prototypeCounts = new Map<string, number>();
const difficultyBands = new Set<string>();
const taskDirections = new Set<string>();
const comparisonAnswers = new Set<string>();
const comparisonDifficulties = new Set<string>();
const powerDiagnosisAnswers = new Set<string>();
const powerDiagnosisDifficulties = new Set<string>();
const factorialDiagnosisAnswers = new Set<string>();
const factorialDiagnosisDifficulties = new Set<string>();

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
    ...pkg.options.map((option) => `${option.value} ${option.analysis}`),
  ].join("\n"), BANNED);
  assert.ok(!identities.has(pkg.generationIdentity));
  identities.add(pkg.generationIdentity);
  const payloads = payloadCounts.get(pkg.prototypeId) ?? new Set<string>();
  payloads.add(pkg.canonicalPayloadKey);
  payloadCounts.set(pkg.prototypeId, payloads);
  prototypeCounts.set(pkg.prototypeId, (prototypeCounts.get(pkg.prototypeId) ?? 0) + 1);
  difficultyBands.add(pkg.difficulty);
  taskDirections.add(pkg.taskDirection);

  if (pkg.prototypeId === "SAP-CP004-PROT-BOUNDED-NTH-ROOT" && pkg.oracle.data.index === 4) {
    assert.match(pkg.stem, /principal|positive|non-negative/i);
  }
  if (pkg.prototypeId === "SAP-CP004-PROT-POWER-ROOT-CANCELLATION") {
    assert.match(pkg.stem, /\^2|\^3|×/);
    assert.doesNotMatch(pkg.stem, /^.*√\d+ \+ \d+\.$/);
  }
  if (pkg.prototypeId === "SAP-CP004-PROT-MISSING-EXPONENT") assert.match(pkg.stem, /non-negative integer/i);
  if (pkg.prototypeId === "SAP-CP004-PROT-COMPARE-POWER-ROOT-EXPRESSIONS") {
    comparisonAnswers.add(pkg.canonicalAnswer);
    comparisonDifficulties.add(pkg.difficulty);
    assert.notEqual(pkg.difficulty, "HARD");
  }
  if (pkg.prototypeId === "SAP-CP004-PROT-FIRST-INCORRECT-POWER-ROOT-STEP") {
    powerDiagnosisAnswers.add(pkg.canonicalAnswer);
    powerDiagnosisDifficulties.add(pkg.difficulty);
  }
  if (pkg.prototypeId === "SAP-CP004-PROT-FIRST-INCORRECT-FACTORIAL-STEP") {
    factorialDiagnosisAnswers.add(pkg.canonicalAnswer);
    factorialDiagnosisDifficulties.add(pkg.difficulty);
  }
}

assert.equal(identities.size, 1_900);
assert.equal(prototypeCounts.size, 19);
for (const prototypeId of SAP_CP004_PROTOTYPE_IDS) {
  assert.equal(prototypeCounts.get(prototypeId), 100);
  assert.ok((payloadCounts.get(prototypeId)?.size ?? 0) >= 15, `${prototypeId} lacks payload diversity.`);
}
assert.deepEqual([...difficultyBands].sort(), ["EASY", "HARD", "MEDIUM"]);
assert.deepEqual([...taskDirections].sort(), ["COMPARISON", "DIAGNOSIS", "FORWARD", "INVERSE"]);
assert.deepEqual([...comparisonAnswers].sort(), ["A < B", "A = B", "A > B"]);
assert.deepEqual([...comparisonDifficulties].sort(), ["EASY", "MEDIUM"]);
assert.deepEqual([...powerDiagnosisAnswers].sort(), ["No error", "Step 1", "Step 2", "Step 3"]);
assert.deepEqual([...powerDiagnosisDifficulties].sort(), ["HARD", "MEDIUM"]);
assert.deepEqual([...factorialDiagnosisAnswers].sort(), ["No error", "Step 1", "Step 2", "Step 3"]);
assert.deepEqual([...factorialDiagnosisDifficulties].sort(), ["HARD", "MEDIUM"]);

const review = generateSapCp004ReviewRecords();
assert.equal(review.length, 300);
assert.equal(new Set(review.map((record) => record.canonicalPayloadKey)).size, 300);
assert.equal(new Set(review.map((record) => record.stem)).size, 300);
assert.equal(new Set(review.map((record) => record.questionId)).size, 300);
assert.equal(new Set(review.map((record) => record.prototypeId)).size, 19);
for (const record of review) assert.equal(solveOracle(record.oracle), record.canonicalAnswer);

const sequence = review.map((record) => record.correctIndex);
const distribution = positionDistribution(sequence);
const grams = fourGramFrequencies(sequence);
const maximumGramFrequency = Math.max(...grams.values());
const repeatedTransitions = samePositionTransitions(sequence);
assert.deepEqual(distribution, [75, 75, 75, 75]);
assert.equal(maximumRun(sequence), 2);
assert.ok(repeatedTransitions >= 35 && repeatedTransitions <= 90);
assert.ok(forwardTransitions(sequence) <= 110);
assert.ok(cyclicFourWindows(sequence) <= 20);
assert.ok(grams.size >= 130);
assert.ok(maximumGramFrequency <= 7);

console.log(JSON.stringify({
  status: "PASS_SAP_CP004_CALIBRATED_ENGLISH_CANDIDATE_AUTHORITY",
  packagesTested: sweep.length,
  uniqueGenerationIdentities: identities.size,
  prototypeCount: prototypeCounts.size,
  reviewQuestions: review.length,
  uniqueReviewPayloads: new Set(review.map((record) => record.canonicalPayloadKey)).size,
  uniqueReviewStems: new Set(review.map((record) => record.stem)).size,
  proposedQlRange: "SAP-QL-053..SAP-QL-071",
  answerPositionCounts: { A: distribution[0], B: distribution[1], C: distribution[2], D: distribution[3] },
  maximumSamePositionRun: maximumRun(sequence),
  samePositionTransitions: repeatedTransitions,
  forwardCycleTransitions: forwardTransitions(sequence),
  cyclicFourAnswerWindows: cyclicFourWindows(sequence),
  distinctFourAnswerPatterns: grams.size,
  maximumFourAnswerPatternFrequency: maximumGramFrequency,
  difficultyCounts: {
    EASY: review.filter((record) => record.difficulty === "EASY").length,
    MEDIUM: review.filter((record) => record.difficulty === "MEDIUM").length,
    HARD: review.filter((record) => record.difficulty === "HARD").length,
  },
  lifecycle: "INACTIVE_REVIEW_CANDIDATE_PERMANENT_IDS_NOT_ALLOCATED",
}, null, 2));
