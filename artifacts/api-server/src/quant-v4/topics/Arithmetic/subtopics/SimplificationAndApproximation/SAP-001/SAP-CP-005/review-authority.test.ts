import assert from "node:assert/strict";
import {
  SAP_CP005_REVIEW_CATALOGUE,
  SAP_CP005_REVIEW_COUNT_PER_PROTOTYPE,
  SAP_CP005_REVIEW_PROTOTYPE_IDS,
  generateSapCp005ReviewRecords,
} from "./review-export";

const records = generateSapCp005ReviewRecords();
assert.equal(records.length, 300);
assert.equal(SAP_CP005_REVIEW_PROTOTYPE_IDS.length, 20);
assert.equal(SAP_CP005_REVIEW_CATALOGUE.length, 20);
assert.equal(SAP_CP005_REVIEW_COUNT_PER_PROTOTYPE, 15);

const payloads = new Set<string>();
const identities = new Set<string>();
const questionIds = new Set<string>();
const counts = new Map<string, number>();
const answerPositionCounts = [0, 0, 0, 0];
const qlIds = new Set<string>();
const directions = new Set<string>();
const difficulties = new Set<string>();

for (const [index, record] of records.entries()) {
  assert.equal(record.questionId, `SAP-CP005-REV-${String(index + 1).padStart(3, "0")}`);
  assert.ok(!questionIds.has(record.questionId), `${record.questionId}: duplicate review ID.`);
  questionIds.add(record.questionId);

  assert.equal(record.validation.ok, true, `${record.questionId}: ${record.validation.errors.join("; ")}`);
  assert.equal(record.options.length, 4, `${record.questionId}: expected four options.`);
  assert.equal(new Set(record.options.map((option) => option.value)).size, 4, `${record.questionId}: duplicate option value.`);
  assert.equal(record.options.filter((option) => option.isCorrect).length, 1, `${record.questionId}: expected exactly one correct option.`);
  assert.equal(record.options[record.correctIndex]?.value, record.canonicalAnswer, `${record.questionId}: answer binding mismatch.`);
  assert.ok(record.correctIndex >= 0 && record.correctIndex <= 3, `${record.questionId}: invalid correct index.`);
  answerPositionCounts[record.correctIndex]! += 1;

  assert.ok(!payloads.has(record.canonicalPayloadKey), `${record.questionId}: duplicate mathematical payload.`);
  payloads.add(record.canonicalPayloadKey);
  assert.ok(!identities.has(record.generationIdentity), `${record.questionId}: duplicate generation identity.`);
  identities.add(record.generationIdentity);

  assert.ok(record.stem.length >= 20, `${record.questionId}: stem is too short for review.`);
  assert.ok(record.explanation.coreConcept.length >= 70, `${record.questionId}: core concept is too thin.`);
  assert.ok(record.explanation.steps.length >= 2, `${record.questionId}: explanation needs at least two steps.`);
  assert.ok(record.explanation.cancellationMap.length >= 2, `${record.questionId}: cancellation map missing.`);
  assert.ok(record.explanation.finalAnswer.includes(record.canonicalAnswer), `${record.questionId}: final answer does not state canonical answer.`);
  assert.ok(record.options.filter((option) => !option.isCorrect).every((option) => Boolean(option.misconceptionId) && option.analysis.length >= 35), `${record.questionId}: weak distractor provenance.`);

  assert.equal(record.lifecycle.permanentQlId, null);
  assert.equal(record.lifecycle.contentStatus, "ENGLISH_REVIEW_CANDIDATE");
  assert.equal(record.lifecycle.active, false);
  assert.equal(record.lifecycle.questionStudioDiscoverable, false);
  assert.equal(record.lifecycle.questionBankWritable, false);
  assert.equal(record.lifecycle.testEligible, false);
  assert.equal(record.lifecycle.publiclyPublishable, false);

  counts.set(record.prototypeId, (counts.get(record.prototypeId) ?? 0) + 1);
  qlIds.add(record.proposedPermanentQlId);
  directions.add(record.taskDirection);
  difficulties.add(record.difficulty);

  if (index >= 2) {
    assert.ok(
      !(records[index]!.correctIndex === records[index - 1]!.correctIndex && records[index]!.correctIndex === records[index - 2]!.correctIndex),
      `Three-answer-position run detected ending at ${record.questionId}.`,
    );
  }
}

assert.equal(payloads.size, 300);
assert.equal(identities.size, 300);
assert.equal(questionIds.size, 300);
assert.deepEqual(answerPositionCounts, [75, 75, 75, 75]);

for (const prototypeId of SAP_CP005_REVIEW_PROTOTYPE_IDS) {
  assert.equal(counts.get(prototypeId), 15, `${prototypeId}: expected 15 review records.`);
}

assert.equal(qlIds.size, 20);
assert.deepEqual([...qlIds].sort(), Array.from({ length: 20 }, (_, index) => `SAP-QL-${String(72 + index).padStart(3, "0")}`));
assert.deepEqual([...directions].sort(), ["DIAGNOSIS", "FORWARD", "INVERSE", "STRATEGY"]);
assert.deepEqual([...difficulties].sort(), ["EASY", "HARD", "MEDIUM"]);

console.log("SAP-CP-005 review authority passed: 300 unique records, 20 admitted modes, 15 per mode, perfectly balanced answer positions.");
