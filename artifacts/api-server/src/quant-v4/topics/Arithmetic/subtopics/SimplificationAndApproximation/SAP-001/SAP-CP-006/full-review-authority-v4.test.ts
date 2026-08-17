import assert from "node:assert/strict";
import {
  SAP_CP006_FULL_REVIEW_CATALOGUE,
  SAP_CP006_FULL_REVIEW_PROTOTYPE_IDS,
  SAP_CP006_FULL_REVIEW_TOTAL,
  generateSapCp006FullReviewRecords,
  sapCp006FullReviewCountForPrototype,
} from "./full-review-export";
import { SAP_CP006_PROTOTYPE_IDS } from "./runtime";
import { SAP_CP006_WAVE2_PROTOTYPE_IDS, type SapCp006Wave2Package } from "./runtime-wave2";
import {
  SAP_CP006_DATA_SUFFICIENCY_CLASSES,
  type SapCp006DataSufficiencyClass,
  type SapCp006Wave3Package,
} from "./runtime-wave3";

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

function independentDsClass(pkg: SapCp006Wave3Package): {
  answer: SapCp006DataSufficiencyClass;
  first: number[];
  second: number[];
  combined: number[];
} {
  const d = pkg.oracle.data;
  const domain = [1, 2, 3, 4, 5, 6];
  const expression = (x: number) => d.coefficient! * x + d.percentValue!;
  const exact = (x: number) => expression(x) === d.exactE!;
  const parity = d.hiddenX! % 2 === 0
    ? (x: number) => (expression(x) - d.percentValue!) % (2 * d.coefficient!) === 0
    : (x: number) => (expression(x) - d.percentValue!) % (2 * d.coefficient!) !== 0;
  const residue = (x: number) => (expression(x) - d.percentValue!) % (3 * d.coefficient!) === d.coefficient! * d.residue!;
  const universal = (x: number) => (expression(x) - d.percentValue!) % d.coefficient! === 0;

  let firstTest: (x: number) => boolean;
  let secondTest: (x: number) => boolean;
  if (d.scenario === 0) { firstTest = exact; secondTest = parity; }
  else if (d.scenario === 1) { firstTest = parity; secondTest = exact; }
  else if (d.scenario === 2) { firstTest = parity; secondTest = residue; }
  else { firstTest = parity; secondTest = universal; }

  const first = domain.filter(firstTest);
  const second = domain.filter(secondTest);
  const combined = domain.filter((x) => firstTest(x) && secondTest(x));
  let answer: SapCp006DataSufficiencyClass;
  if (first.length === 1 && second.length !== 1) answer = "I alone is sufficient";
  else if (first.length !== 1 && second.length === 1) answer = "II alone is sufficient";
  else if (first.length !== 1 && second.length !== 1 && combined.length === 1) answer = "Both together are sufficient";
  else answer = "Even together are insufficient";
  return { answer, first, second, combined };
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
assert.equal(records.length, SAP_CP006_FULL_REVIEW_TOTAL);
assert.equal(records.length, 300);
assert.equal(SAP_CP006_FULL_REVIEW_PROTOTYPE_IDS.length, 21);
assert.equal(SAP_CP006_FULL_REVIEW_CATALOGUE.length, 21);
assert.equal(SAP_CP006_FULL_REVIEW_PROTOTYPE_IDS.reduce((sum, prototypeId) => sum + sapCp006FullReviewCountForPrototype(prototypeId), 0), 300);

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
let tableWrapperCount = 0;

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

  const maxStemLength = record.prototypeId === "SAP-CP006-PROT-EXACT-ARITHMETIC-DATA-SUFFICIENCY" ? 450 : 220;
  assert.ok(record.stem.length >= 20 && record.stem.length <= maxStemLength, `${record.questionId}: stem outside review length boundary.`);
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
    if (record.prototypeId === "SAP-CP006-PROT-ORDER-MIXED-REPRESENTATIONS" && record.oracle.data.tableWrapper === 1) {
      tableWrapperCount += 1;
      assert.match(record.stem, /small table/i);
      assert.match(record.stem, /A \|/);
      assert.match(record.stem, /D \|/);
    }
  }

  if (wave2Modes.has(record.prototypeId)) {
    assert.match(record.stem, /\bof\b/, `${record.questionId}: expected concrete mixed-arithmetic quantity.`);
    for (const option of record.options) assert.match(option.value, /^\d+$/, `${record.questionId}: wave-two option must be a positive integer.`);
    const pkg = record as SapCp006Wave2Package;
    assert.equal(pkg.options.filter((option) => wave2SubstitutionHolds(pkg, Number(option.value))).length, 1, `${record.questionId}: independent substitution did not isolate one option.`);
  }

  if (record.prototypeId === "SAP-CP006-PROT-EXACT-ARITHMETIC-DATA-SUFFICIENCY") {
    const pkg = record as SapCp006Wave3Package;
    assert.equal(pkg.proposedPermanentQlId, "SAP-QL-112");
    assert.equal(pkg.taskDirection, "DATA_SUFFICIENCY");
    assert.equal(pkg.answerSemantic, "DATA_SUFFICIENCY_CLASS");
    assert.equal(pkg.representation, "DATA_SUFFICIENCY");
    assert.deepEqual(new Set(pkg.options.map((option) => option.value)), new Set(SAP_CP006_DATA_SUFFICIENCY_CLASSES));
    assert.match(pkg.stem, /Statement I:/);
    assert.match(pkg.stem, /Statement II:/);
    const independent = independentDsClass(pkg);
    assert.equal(independent.answer, pkg.canonicalAnswer, `${record.questionId}: independent DS class mismatch.`);
    assert.deepEqual(independent.first, [...pkg.oracle.firstCandidates]);
    assert.deepEqual(independent.second, [...pkg.oracle.secondCandidates]);
    assert.deepEqual(independent.combined, [...pkg.oracle.combinedCandidates]);
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
assert.equal(coreConcepts.size, 21);
assert.equal(qlIds.size, 21);
assert.deepEqual([...qlIds].sort(), Array.from({ length: 21 }, (_, index) => `SAP-QL-${String(92 + index).padStart(3, "0")}`));
assert.ok(tableWrapperCount >= 3, `Expected multiple small-table QL-099 review variants; found ${tableWrapperCount}.`);

const minimumAnswerDiversity: Readonly<Record<string, number>> = {
  "SAP-CP006-PROT-COMPOSED-POWER-MISSING": 3,
  "SAP-CP006-PROT-COMPARE-EXACT-EXPRESSIONS": 3,
  "SAP-CP006-PROT-EXACT-ARITHMETIC-DATA-SUFFICIENCY": 4,
};
for (const prototypeId of SAP_CP006_FULL_REVIEW_PROTOTYPE_IDS) {
  assert.equal(counts.get(prototypeId), sapCp006FullReviewCountForPrototype(prototypeId), `${prototypeId}: incorrect full-review count.`);
  const minimumAnswers = minimumAnswerDiversity[prototypeId] ?? 4;
  assert.ok((answersByPrototype.get(prototypeId)?.size ?? 0) >= minimumAnswers, `${prototypeId}: answer surface is too repetitive for its declared domain.`);
}

assert.deepEqual([...answersByPrototype.get("SAP-CP006-PROT-COMPARE-EXACT-EXPRESSIONS")!].sort(), ["A < B", "A = B", "A > B"]);
assert.deepEqual([...answersByPrototype.get("SAP-CP006-PROT-EXACT-ARITHMETIC-DATA-SUFFICIENCY")!].sort(), [...SAP_CP006_DATA_SUFFICIENCY_CLASSES].sort());
assert.ok((answersByPrototype.get("SAP-CP006-PROT-STATEMENT-COMBINATION")?.size ?? 0) >= 4);
assert.deepEqual([...directions].sort(), ["COMPARISON", "DATA_SUFFICIENCY", "INVERSE", "ORDERING", "SYNTHESIS", "VERIFICATION"]);
assert.deepEqual([...difficulties].sort(), ["HARD", "MEDIUM"]);

console.log("SAP-CP-006 full review authority v4 passed: 300 unique questions across 21 modes including QL-112 data sufficiency, table-wrapper coverage, 75 A/B/C/D each, independent substitution/candidate-set proofs, strict exam-style editorial guards.");
