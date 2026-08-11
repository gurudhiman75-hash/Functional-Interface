import assert from "node:assert/strict";
import {
  SAP_CP005_REVIEW_CATALOGUE,
  SAP_CP005_REVIEW_COUNT_PER_PROTOTYPE,
  SAP_CP005_REVIEW_PROTOTYPE_IDS,
  generateSapCp005ReviewRecords,
  sapCp005ReviewStemLimit,
} from "./review-export";

interface Rational { n: bigint; d: bigint; }

function gcd(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) [x, y] = [y, x % y];
  return x || 1n;
}

function rat(n: bigint | number, d: bigint | number = 1n): Rational {
  let numerator = BigInt(n), denominator = BigInt(d);
  assert.notEqual(denominator, 0n);
  if (denominator < 0n) { numerator = -numerator; denominator = -denominator; }
  const divisor = gcd(numerator, denominator);
  return { n: numerator / divisor, d: denominator / divisor };
}

function parseNumeric(value: string): Rational | null {
  if (!/^-?\d+(?:\/\d+)?$/.test(value)) return null;
  if (value.includes("/")) {
    const [n, d] = value.split("/");
    return rat(BigInt(n!), BigInt(d!));
  }
  return rat(BigInt(value));
}

function format(value: Rational): string {
  return value.d === 1n ? value.n.toString() : `${value.n}/${value.d}`;
}

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
const coreConcepts = new Map<string, string>();
const answersByPrototype = new Map<string, Set<string>>();
const METHOD_GIVING = /\b(?:by extracting the common factor|using the structural shortcut|without multiplying large numbers first|by compressing the repeated block first)\b/i;
const categorical = new Set([
  "SAP-CP005-PROT-ILLEGAL-CANCELLATION-DIAGNOSIS",
  "SAP-CP005-PROT-BEST-FIRST-CANCELLATION",
  "SAP-CP005-PROT-RAW-VS-STRUCTURAL-ROUTE",
]);

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
  assert.ok(record.stem.length <= sapCp005ReviewStemLimit(record.prototypeId), `${record.questionId}: expression is too long for the CP-005 human-review surface.`);
  assert.doesNotMatch(record.stem, METHOD_GIVING, `${record.questionId}: stem gives away the intended method.`);
  assert.ok(record.explanation.coreConcept.length >= 70, `${record.questionId}: core concept is too thin.`);
  assert.ok(record.explanation.steps.length >= 2, `${record.questionId}: explanation needs at least two steps.`);
  assert.ok(record.explanation.cancellationMap.length >= 2, `${record.questionId}: cancellation map missing.`);
  assert.ok(record.explanation.finalAnswer.includes(record.canonicalAnswer), `${record.questionId}: final answer does not state canonical answer.`);
  assert.ok(record.options.filter((option) => !option.isCorrect).every((option) => Boolean(option.misconceptionId) && option.analysis.length >= 40), `${record.questionId}: weak distractor provenance.`);

  if (!categorical.has(record.prototypeId)) {
    const answer = parseNumeric(record.canonicalAnswer);
    assert.ok(answer && answer.n > 0n, `${record.questionId}: expected a positive numeric canonical answer.`);
    for (const option of record.options) {
      const numeric = parseNumeric(option.value);
      assert.ok(numeric, `${record.questionId}: numeric QL contains a non-numeric option '${option.value}'.`);
      assert.ok(numeric.n > 0n, `${record.questionId}: positive-expression QL contains a zero/negative distractor '${option.value}'.`);
    }
  }

  if (record.prototypeId === "SAP-CP005-PROT-FACTOR-EXTRACTION-CANCEL") {
    const d = record.oracle.data;
    assert.equal(d.editorialMode, 1, `${record.questionId}: hidden-factor editorial fixture missing.`);
    const direct = rat(d.left! * d.s!, d.right! * d.r!);
    assert.equal(format(direct), record.canonicalAnswer, `${record.questionId}: hidden-factor displayed expression changed value.`);
    assert.ok(d.left! !== d.p! && d.right! !== d.q!, `${record.questionId}: factor extraction was not actually hidden inside composite numbers.`);
  }

  if (record.prototypeId === "SAP-CP005-PROT-PRODUCT-OF-RECIPROCALS") {
    const d = record.oracle.data;
    assert.equal(d.editorialMode, 2, `${record.questionId}: bounded reciprocal-chain editorial fixture missing.`);
    assert.ok(d.start! >= 1 && d.start! <= 9, `${record.questionId}: reciprocal-chain start is outside the bounded pool.`);
    assert.ok(d.span! >= 4 && d.span! <= 7, `${record.questionId}: reciprocal-chain span is outside the exam-sized pool.`);
    assert.equal(d.terminal, d.start! + d.span!, `${record.questionId}: reciprocal-chain terminal does not match start + span.`);
    let direct = rat(1);
    for (let value = d.start!; value < d.terminal!; value += 1) {
      direct = rat(direct.n * BigInt(value), direct.d * BigInt(value + 1));
    }
    assert.equal(format(direct), record.canonicalAnswer, `${record.questionId}: bounded reciprocal-chain displayed expression changed value.`);
  }

  if (record.prototypeId === "SAP-CP005-PROT-SYMMETRIC-FRACTION-PAIR") {
    const d = record.oracle.data;
    assert.equal(d.editorialMode, 1, `${record.questionId}: symmetric-pair editorial fixture missing.`);
    assert.ok(d.c! >= 2 && d.c! <= 7, `${record.questionId}: symmetric scale factor is outside the bounded pool.`);
    const pair = rat(d.a! * d.a! + d.b! * d.b!, d.a! * d.b!);
    const divisor = rat(d.a! * d.a! + d.b! * d.b!, d.a! * d.b! * d.c!);
    const direct = rat(pair.n * divisor.d, pair.d * divisor.n);
    assert.equal(format(direct), record.canonicalAnswer, `${record.questionId}: symmetric-pair displayed expression changed value.`);
  }

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
  coreConcepts.set(record.prototypeId, record.explanation.coreConcept);
  const answers = answersByPrototype.get(record.prototypeId) ?? new Set<string>();
  answers.add(record.canonicalAnswer);
  answersByPrototype.set(record.prototypeId, answers);

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
assert.equal(new Set(coreConcepts.values()).size, 20, "Each admitted mode must have its own learner-facing core concept.");

for (const prototypeId of SAP_CP005_REVIEW_PROTOTYPE_IDS) {
  assert.equal(counts.get(prototypeId), 15, `${prototypeId}: expected 15 review records.`);
  if (!categorical.has(prototypeId)) {
    assert.ok((answersByPrototype.get(prototypeId)?.size ?? 0) >= 5, `${prototypeId}: numeric answer pool is too repetitive for human review.`);
  }
}

assert.ok((answersByPrototype.get("SAP-CP005-PROT-SYMMETRIC-FRACTION-PAIR")?.size ?? 0) >= 4, "Symmetric fraction-pair QL must not collapse to a constant answer.");
assert.equal(qlIds.size, 20);
assert.deepEqual([...qlIds].sort(), Array.from({ length: 20 }, (_, index) => `SAP-QL-${String(72 + index).padStart(3, "0")}`));
assert.deepEqual([...directions].sort(), ["DIAGNOSIS", "FORWARD", "INVERSE", "STRATEGY"]);
assert.deepEqual([...difficulties].sort(), ["EASY", "HARD", "MEDIUM"]);

console.log("SAP-CP-005 editorial review authority passed: 300 unique records, 20 modes, bounded exam-sized stems, independently verified reciprocal chains, no impossible negative distractors, distinct core concepts, balanced A/B/C/D positions.");
