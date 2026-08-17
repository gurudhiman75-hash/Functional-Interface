import assert from "node:assert/strict";
import {
  SAP_CP006_FULL_REVIEW_CATALOGUE,
  SAP_CP006_FULL_REVIEW_COUNT_PER_PROTOTYPE,
  SAP_CP006_FULL_REVIEW_PROTOTYPE_IDS,
  generateSapCp006FullReviewRecords,
} from "./full-review-export";
import { SAP_CP006_PROTOTYPE_IDS } from "./runtime";
import { SAP_CP006_WAVE2_PROTOTYPE_IDS, type SapCp006Wave2Package } from "./runtime-wave2";

function gcdNumber(a: number, b: number): number {
  let x = Math.abs(a), y = Math.abs(b);
  while (y !== 0) [x, y] = [y, x % y];
  return x || 1;
}

function assertLowestTermFraction(value: string, context: string): void {
  const match = value.match(/^(\d+)\/(\d+)$/);
  if (!match) return;
  assert.equal(gcdNumber(Number(match[1]), Number(match[2])), 1, `${context}: ${value} is not in lowest terms.`);
}

function factorial(n: number): number {
  let value = 1;
  for (let i = 2; i <= n; i += 1) value *= i;
  return value;
}

function wave2SubstitutionHolds(pkg: SapCp006Wave2Package, candidate: number): boolean {
  const d = pkg.oracle.data;
  switch (pkg.prototypeId) {
    case "SAP-CP006-PROT-MISSING-MIXED-MINUEND": return candidate - d.value! - d.percentValue! === d.target!;
    case "SAP-CP006-PROT-MISSING-MIXED-SUBTRAHEND": return d.value! + d.percentValue! - candidate === d.target!;
    case "SAP-CP006-PROT-MISSING-MIXED-DIVIDEND": return candidate / d.divisor! + d.value! + d.percentValue! === d.target!;
    case "SAP-CP006-PROT-MISSING-FRACTION-DENOMINATOR-CROSS": return (d.numerator! / candidate) * d.fractionBase! + d.percentValue! === d.target!;
    case "SAP-CP006-PROT-COMPOSED-RADICAND-MISSING": {
      const root = Math.sqrt(candidate);
      return Number.isInteger(root) && root + d.value! + d.percentValue! === d.target!;
    }
    case "SAP-CP006-PROT-COMPOSED-FACTORIAL-MISSING": return candidate >= 1 && candidate <= 8 && factorial(candidate) + d.value! + d.percentValue! === d.target!;
    case "SAP-CP006-PROT-TWO-SIDED-EXACT-EQUALITY": {
      const left = d.usePlus === 1 ? candidate + d.value! : candidate - d.value!;
      return left === d.percentValue! + d.squareValue!;
    }
    case "SAP-CP006-PROT-FIXED-MIXED-OPERAND-MISSING": return (d.value! + candidate) / d.divisor! + d.percentValue! === d.target!;
  }
}

const foundationModes = new Set<string>(SAP_CP006_PROTOTYPE_IDS);
const wave2Modes = new Set<string>(SAP_CP006_WAVE2_PROTOTYPE_IDS);
const integerFoundationModes = new Set([
  "SAP-CP006-PROT-MISSING-MIXED-ADDEND",
  "SAP-CP006-PROT-MISSING-MIXED-FACTOR",
  "SAP-CP006-PROT-MISSING-MIXED-DIVISOR",
  "SAP-CP006-PROT-MISSING-BRACKET-VALUE",
  "SAP-CP006-PROT-COMPOSED-POWER-MISSING",
  "SAP-CP006-PROT-CANDIDATE-SUBSTITUTION",
]);
const examOfFoundationModes = new Set([
  "SAP-CP006-PROT-MISSING-MIXED-ADDEND",
  "SAP-CP006-PROT-MISSING-MIXED-FACTOR",
  "SAP-CP006-PROT-MISSING-MIXED-DIVISOR",
  "SAP-CP006-PROT-MISSING-DECIMAL-MIXED",
  "SAP-CP006-PROT-COMPOSED-POWER-MISSING",
  "SAP-CP006-PROT-CANDIDATE-SUBSTITUTION",
]);

const records = generateSapCp006FullReviewRecords();
assert.equal(records.length, 300);
assert.equal(SAP_CP006_FULL_REVIEW_PROTOTYPE_IDS.length, 20);
assert.equal(SAP_CP006_FULL_REVIEW_CATALOGUE.length, 20);
assert.equal(SAP_CP006_FULL_REVIEW_COUNT_PER_PROTOTYPE, 15);

const ids = new Set<string>();
const payloads = new Set<string>();
const identities = new Set<string>();
const counts = new Map<string, number>();
const answerPositions = [0, 0, 0, 0];
const qlIds = new Set<string>();
const coreConcepts = new Map<string, string>();
const answersByPrototype = new Map<string, Set<string>>();
const directions = new Set<string>();
const difficulties = new Set<string>();

for (const [index, record] of records.entries()) {
  assert.equal(record.questionId, `SAP-CP006-FULL-REV-${String(index + 1).padStart(3, "0")}`);
  assert.ok(!ids.has(record.questionId), `${record.questionId}: duplicate review ID.`);
  ids.add(record.questionId);

  assert.equal(record.validation.ok, true, `${record.questionId}: ${record.validation.errors.join("; ")}`);
  assert.equal(record.options.length, 4, `${record.questionId}: expected four options.`);
  assert.equal(new Set(record.options.map((option) => option.value)).size, 4, `${record.questionId}: duplicate options.`);
  assert.equal(record.options.filter((option) => option.isCorrect).length, 1, `${record.questionId}: expected one correct option.`);
  assert.equal(record.options[record.correctIndex]?.value, record.canonicalAnswer, `${record.questionId}: answer binding mismatch.`);
  answerPositions[record.correctIndex]! += 1;

  assert.ok(!payloads.has(record.canonicalPayloadKey), `${record.questionId}: duplicate payload.`);
  payloads.add(record.canonicalPayloadKey);
  assert.ok(!identities.has(record.generationIdentity), `${record.questionId}: duplicate generation identity.`);
  identities.add(record.generationIdentity);

  assert.ok(record.stem.length >= 20 && record.stem.length <= 185, `${record.questionId}: stem outside review length boundary.`);
  assert.ok(record.explanation.coreConcept.length >= 100, `${record.questionId}: thin core concept.`);
  assert.ok(record.explanation.steps.length >= 2, `${record.questionId}: thin solution.`);
  assert.ok(record.explanation.verification.length >= 2, `${record.questionId}: thin verification.`);
  assert.ok(record.explanation.finalAnswer.includes(record.canonicalAnswer), `${record.questionId}: final answer missing canonical answer.`);
  assert.ok(record.options.filter((option) => !option.isCorrect).every((option) => Boolean(option.misconceptionId) && option.analysis.length >= 45), `${record.questionId}: weak distractor provenance.`);
  assert.ok(!record.explanation.steps.some((step) => /^\s*(\d+)\s*=\s*\1[.!]?\s*$/.test(step)), `${record.questionId}: bare tautological step found.`);

  assert.equal(record.lifecycle.permanentQlId, null);
  assert.equal(record.lifecycle.contentStatus, "ENGLISH_REVIEW_CANDIDATE");
  assert.equal(record.lifecycle.active, false);
  assert.equal(record.lifecycle.questionStudioDiscoverable, false);
  assert.equal(record.lifecycle.questionBankWritable, false);
  assert.equal(record.lifecycle.testEligible, false);
  assert.equal(record.lifecycle.publiclyPublishable, false);

  if (foundationModes.has(record.prototypeId)) {
    if (examOfFoundationModes.has(record.prototypeId)) {
      assert.match(record.stem, /\bof\b/, `${record.questionId}: expected concrete quantity-based arithmetic.`);
      assert.equal(record.oracle.data.editorialMode, 1, `${record.questionId}: foundation editorial metadata missing.`);
    }
    if (record.prototypeId === "SAP-CP006-PROT-MISSING-BRACKET-VALUE") {
      assert.equal(record.oracle.data.editorialMode, 1);
      assert.match(record.stem, /% of \d+/);
    }
    if (integerFoundationModes.has(record.prototypeId)) {
      for (const option of record.options) assert.match(option.value, /^\d+$/, `${record.questionId}: expected integer option.`);
    }
    if (record.prototypeId === "SAP-CP006-PROT-EQUIVALENT-EXPRESSION") {
      assert.match(record.stem, /lowest terms/i);
      for (const option of record.options) assertLowestTermFraction(option.value, record.questionId);
      assert.equal(record.oracle.data.editorialMode, 1);
    }
    if (record.prototypeId === "SAP-CP006-PROT-CORRECT-SIMPLIFICATION-STATEMENT") {
      assert.match(record.stem, /lowest terms/i);
      for (const option of record.options) {
        const rhs = option.value.split(" = ")[1];
        assert.ok(rhs, `${record.questionId}: statement option lacks RHS.`);
        assertLowestTermFraction(rhs!, record.questionId);
      }
      assert.equal(record.oracle.data.editorialMode, 1);
    }
  }

  if (wave2Modes.has(record.prototypeId)) {
    assert.match(record.stem, /\bof\b/, `${record.questionId}: expected concrete mixed-arithmetic quantity.`);
    for (const option of record.options) assert.match(option.value, /^\d+$/, `${record.questionId}: wave-two option must be a positive integer.`);
    const pkg = record as SapCp006Wave2Package;
    assert.equal(pkg.options.filter((option) => wave2SubstitutionHolds(pkg, Number(option.value))).length, 1, `${record.questionId}: independent substitution did not isolate one option.`);
  }

  counts.set(record.prototypeId, (counts.get(record.prototypeId) ?? 0) + 1);
  qlIds.add(record.proposedPermanentQlId);
  coreConcepts.set(record.prototypeId, record.explanation.coreConcept);
  const answers = answersByPrototype.get(record.prototypeId) ?? new Set<string>();
  answers.add(record.canonicalAnswer);
  answersByPrototype.set(record.prototypeId, answers);
  directions.add(record.taskDirection);
  difficulties.add(record.difficulty);

  if (index >= 2) {
    assert.ok(!(records[index]!.correctIndex === records[index - 1]!.correctIndex && records[index]!.correctIndex === records[index - 2]!.correctIndex), `Three-position answer run ends at ${record.questionId}.`);
  }
}

assert.equal(ids.size, 300);
assert.equal(payloads.size, 300);
assert.equal(identities.size, 300);
assert.deepEqual(answerPositions, [75, 75, 75, 75]);
assert.equal(coreConcepts.size, 20);
assert.equal(qlIds.size, 20);
assert.deepEqual([...qlIds].sort(), Array.from({ length: 20 }, (_, index) => `SAP-QL-${String(92 + index).padStart(3, "0")}`));

for (const prototypeId of SAP_CP006_FULL_REVIEW_PROTOTYPE_IDS) {
  assert.equal(counts.get(prototypeId), 15, `${prototypeId}: expected 15 review questions.`);
  const minimumAnswers = prototypeId === "SAP-CP006-PROT-COMPOSED-POWER-MISSING" ? 3 : 4;
  assert.ok((answersByPrototype.get(prototypeId)?.size ?? 0) >= minimumAnswers, `${prototypeId}: answer surface is too repetitive for its declared domain.`);
}

assert.deepEqual([...answersByPrototype.get("SAP-CP006-PROT-COMPARE-EXACT-EXPRESSIONS")!].sort(), ["A < B", "A = B", "A > B"]);
assert.ok((answersByPrototype.get("SAP-CP006-PROT-STATEMENT-COMBINATION")?.size ?? 0) >= 4);
assert.deepEqual([...directions].sort(), ["COMPARISON", "INVERSE", "ORDERING", "SYNTHESIS", "VERIFICATION"]);
assert.deepEqual([...difficulties].sort(), ["HARD", "MEDIUM"]);

console.log("SAP-CP-006 full review authority v2 passed: 300 unique questions across 20 modes, family-aware answer diversity, 75 A/B/C/D each, independent wave-two substitution proof, strict exam-style editorial guards.");
