import assert from "node:assert/strict";
import {
  SAP_CP006_REVIEW_CATALOGUE,
  SAP_CP006_REVIEW_COUNT_PER_PROTOTYPE,
  generateSapCp006ReviewRecords,
} from "./review-export";
import { SAP_CP006_PROTOTYPE_IDS } from "./runtime";

function gcdNumber(a: number, b: number): number {
  let x = Math.abs(a), y = Math.abs(b);
  while (y !== 0) [x, y] = [y, x % y];
  return x || 1;
}

function assertLowestTermFraction(value: string, context: string): void {
  const match = value.match(/^(\d+)\/(\d+)$/);
  if (!match) return;
  assert.equal(gcdNumber(Number(match[1]), Number(match[2])), 1, `${context}: fraction ${value} is not in lowest terms.`);
}

const records = generateSapCp006ReviewRecords();
assert.equal(records.length, 120);
assert.equal(SAP_CP006_REVIEW_CATALOGUE.length, 12);
assert.equal(SAP_CP006_REVIEW_COUNT_PER_PROTOTYPE, 10);

const counts = new Map<string, number>();
const payloads = new Set<string>();
const ids = new Set<string>();
const answerPositions = [0, 0, 0, 0];
const directions = new Set<string>();
const coreConcepts = new Set<string>();
const answersByPrototype = new Map<string, Set<string>>();
const examOfModes = new Set([
  "SAP-CP006-PROT-MISSING-MIXED-ADDEND",
  "SAP-CP006-PROT-MISSING-MIXED-FACTOR",
  "SAP-CP006-PROT-MISSING-MIXED-DIVISOR",
  "SAP-CP006-PROT-MISSING-DECIMAL-MIXED",
  "SAP-CP006-PROT-COMPOSED-POWER-MISSING",
  "SAP-CP006-PROT-CANDIDATE-SUBSTITUTION",
]);
const integerOptionModes = new Set([
  "SAP-CP006-PROT-MISSING-MIXED-ADDEND",
  "SAP-CP006-PROT-MISSING-MIXED-FACTOR",
  "SAP-CP006-PROT-MISSING-MIXED-DIVISOR",
  "SAP-CP006-PROT-MISSING-BRACKET-VALUE",
  "SAP-CP006-PROT-COMPOSED-POWER-MISSING",
  "SAP-CP006-PROT-CANDIDATE-SUBSTITUTION",
]);

for (const [index, record] of records.entries()) {
  assert.equal(record.questionId, `SAP-CP006-REV-${String(index + 1).padStart(3, "0")}`);
  assert.ok(!ids.has(record.questionId), `${record.questionId}: duplicate review ID.`);
  ids.add(record.questionId);
  assert.equal(record.validation.ok, true, `${record.questionId}: ${record.validation.errors.join("; ")}`);
  assert.equal(record.options.length, 4);
  assert.equal(new Set(record.options.map((option) => option.value)).size, 4, `${record.questionId}: duplicate option values.`);
  assert.equal(record.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(record.options[record.correctIndex]?.value, record.canonicalAnswer);
  assert.ok(record.stem.length >= 20, `${record.questionId}: stem too short for review.`);
  assert.ok(record.stem.length <= 180, `${record.questionId}: stem too long for foundation review.`);
  assert.doesNotMatch(record.stem, /2437\/200|109\/25|923\/5/, `${record.questionId}: legacy textbook-style target leaked into editorial review.`);
  assert.doesNotMatch(record.explanation.steps.join(" "), /\b(\d+)\s*=\s*\1\b/, `${record.questionId}: tautological duplicate equality in explanation.`);
  assert.ok(record.explanation.coreConcept.length >= 100);
  assert.ok(record.explanation.steps.length >= 2);
  assert.ok(record.explanation.verification.length >= 2);
  assert.ok(record.explanation.finalAnswer.includes(record.canonicalAnswer));
  assert.ok(record.options.filter((option) => !option.isCorrect).every((option) => Boolean(option.misconceptionId) && option.analysis.length >= 45));
  assert.equal(record.lifecycle.permanentQlId, null);
  assert.equal(record.lifecycle.active, false);
  assert.equal(record.lifecycle.questionStudioDiscoverable, false);
  assert.equal(record.lifecycle.questionBankWritable, false);
  assert.equal(record.lifecycle.testEligible, false);
  assert.equal(record.lifecycle.publiclyPublishable, false);
  assert.ok(!payloads.has(record.canonicalPayloadKey), `${record.questionId}: duplicate payload.`);
  payloads.add(record.canonicalPayloadKey);
  answerPositions[record.correctIndex]! += 1;
  counts.set(record.prototypeId, (counts.get(record.prototypeId) ?? 0) + 1);
  directions.add(record.taskDirection);
  coreConcepts.add(record.explanation.coreConcept);
  const answers = answersByPrototype.get(record.prototypeId) ?? new Set<string>();
  answers.add(record.canonicalAnswer);
  answersByPrototype.set(record.prototypeId, answers);

  if (examOfModes.has(record.prototypeId)) {
    assert.match(record.stem, /\bof\b/, `${record.questionId}: remediated exam-arithmetic mode must use a quantity-based 'of' construction.`);
    assert.equal(record.oracle.data.editorialMode, 1, `${record.questionId}: editorial fixture metadata missing.`);
  }

  if (record.prototypeId === "SAP-CP006-PROT-MISSING-BRACKET-VALUE") {
    assert.equal(record.oracle.data.editorialMode, 1, `${record.questionId}: bracket editorial fixture metadata missing.`);
    assert.match(record.stem, /% of \d+/, `${record.questionId}: bracket problem should use a percentage of a concrete quantity.`);
  }

  if (integerOptionModes.has(record.prototypeId)) {
    for (const option of record.options) assert.match(option.value, /^\d+$/, `${record.questionId}: expected integer candidate option, received ${option.value}.`);
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

assert.deepEqual(answerPositions, [30, 30, 30, 30]);
assert.equal(payloads.size, 120);
assert.equal(ids.size, 120);
assert.equal(coreConcepts.size, 12, "Each CP-006 foundation mode must have its own learner-facing core concept.");
for (const prototypeId of SAP_CP006_PROTOTYPE_IDS) {
  assert.equal(counts.get(prototypeId), 10, `${prototypeId}: expected ten review questions.`);
  assert.ok((answersByPrototype.get(prototypeId)?.size ?? 0) >= 3, `${prototypeId}: answer surface is too repetitive.`);
}
assert.deepEqual([...answersByPrototype.get("SAP-CP006-PROT-COMPARE-EXACT-EXPRESSIONS")!].sort(), ["A < B", "A = B", "A > B"]);
assert.deepEqual([...directions].sort(), ["COMPARISON", "INVERSE", "ORDERING", "SYNTHESIS", "VERIFICATION"]);

console.log("SAP-CP-006 editorial review authority passed: 120 unique exam-style questions, 10 per mode, clean inverse options, lowest-term simplifications, balanced A/B/C/D positions.");
