import assert from "node:assert/strict";
import {
  SAP_CP006_REVIEW_CATALOGUE,
  SAP_CP006_REVIEW_COUNT_PER_PROTOTYPE,
  generateSapCp006ReviewRecords,
} from "./review-export";
import { SAP_CP006_PROTOTYPE_IDS } from "./runtime";

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
}

assert.deepEqual(answerPositions, [30, 30, 30, 30]);
assert.equal(payloads.size, 120);
assert.equal(ids.size, 120);
assert.equal(coreConcepts.size, 12, "Each CP-006 foundation mode must have its own learner-facing core concept.");
for (const prototypeId of SAP_CP006_PROTOTYPE_IDS) {
  assert.equal(counts.get(prototypeId), 10, `${prototypeId}: expected ten review questions.`);
  assert.ok((answersByPrototype.get(prototypeId)?.size ?? 0) >= 3, `${prototypeId}: answer surface is too repetitive.`);
}
assert.deepEqual([...directions].sort(), ["COMPARISON", "INVERSE", "ORDERING", "SYNTHESIS", "VERIFICATION"]);

console.log("SAP-CP-006 foundation review authority passed: 120 unique questions, 10 per mode, balanced A/B/C/D positions, distinct core concepts.");
