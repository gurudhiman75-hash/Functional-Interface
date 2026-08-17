import assert from "node:assert/strict";
import {
  SAP_CP007_FULL_REVIEW_PROTOTYPE_IDS,
  SAP_CP007_FULL_REVIEW_TOTAL,
  generateSapCp007FullReviewRecords,
  sapCp007FullReviewCountForPrototype,
  type SapCp007FullReviewRecord,
} from "./full-review-export";

function pow10(dp: number): bigint { return 10n ** BigInt(dp); }
function roundScaled(value: bigint, inputDp: number, targetDp: number): bigint {
  const factor = pow10(inputDp - targetDp);
  const sign = value < 0n ? -1n : 1n;
  const absolute = value < 0n ? -value : value;
  let quotient = absolute / factor;
  if (2n * (absolute % factor) >= factor) quotient += 1n;
  return sign * quotient;
}
function roundInteger(value: bigint, unit: bigint): bigint {
  const sign = value < 0n ? -1n : 1n;
  const absolute = value < 0n ? -value : value;
  let quotient = absolute / unit;
  if (2n * (absolute % unit) >= unit) quotient += 1n;
  return sign * quotient * unit;
}
function gcd(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a, y = b < 0n ? -b : b;
  while (y !== 0n) [x, y] = [y, x % y];
  return x || 1n;
}
function reduced(numerator: bigint, denominator: bigint): string {
  const divisor = gcd(numerator, denominator);
  return `${numerator / divisor}/${denominator / divisor}`;
}
function formatScaled(value: bigint, dp: number): string {
  const negative = value < 0n;
  const absolute = negative ? -value : value;
  if (dp === 0) return `${negative ? "-" : ""}${absolute}`;
  const scale = pow10(dp);
  return `${negative ? "-" : ""}${absolute / scale}.${String(absolute % scale).padStart(dp, "0")}`;
}

function verifyMathematics(record: SapCp007FullReviewRecord): void {
  const d = record.oracle.data;
  switch (record.prototypeId) {
    case "SAP-CP007-PROT-ROUND-INTEGER-DECLARED-PLACE":
      assert.equal(record.canonicalAnswer, String(roundInteger(BigInt(d.value as number), BigInt(d.unit as number))));
      break;
    case "SAP-CP007-PROT-ROUND-DECIMAL-NEAREST-INTEGER":
    case "SAP-CP007-PROT-ROUND-DECIMAL-PLACES":
    case "SAP-CP007-PROT-NEGATIVE-HALFWAY-EXPLICIT-RULE": {
      const expected = roundScaled(BigInt(d.scaled as number), d.inputDp as number, d.targetDp as number);
      assert.equal(record.canonicalAnswer, formatScaled(expected, d.targetDp as number));
      if (record.prototypeId === "SAP-CP007-PROT-NEGATIVE-HALFWAY-EXPLICIT-RULE") {
        const factor = pow10((d.inputDp as number) - (d.targetDp as number));
        const raw = BigInt(d.scaled as number);
        const absolute = raw < 0n ? -raw : raw;
        assert.equal(2n * (absolute % factor), factor);
      }
      break;
    }
    case "SAP-CP007-PROT-IDENTIFY-DECIDING-DIGIT": {
      const expectedDigit = Math.floor((d.value as number) / (d.decidingPlace as number)) % 10;
      assert.equal(d.decidingDigit, expectedDigit);
      assert.ok(record.canonicalAnswer.endsWith(`(${expectedDigit})`));
      break;
    }
    case "SAP-CP007-PROT-CORRECT-PRECISION-REPRESENTATION": {
      const expected = roundScaled(BigInt(d.scaled as number), 3, 2);
      assert.equal(record.canonicalAnswer, formatScaled(expected, 2));
      assert.match(record.canonicalAnswer, /^\d+\.\d{2}$/);
      assert.ok(record.canonicalAnswer.endsWith("0"));
      break;
    }
    case "SAP-CP007-PROT-REVERSE-INTEGER-ROUNDING-INTERVAL": {
      const target = BigInt(d.target as number), unit = BigInt(d.unit as number), low = BigInt(d.low as number), high = BigInt(d.high as number);
      assert.equal(roundInteger(low, unit), target);
      assert.equal(roundInteger(high, unit), target);
      assert.notEqual(roundInteger(low - 1n, unit), target);
      assert.notEqual(roundInteger(high + 1n, unit), target);
      break;
    }
    case "SAP-CP007-PROT-REVERSE-DECIMAL-ROUNDING-INTERVAL": {
      const target = BigInt(d.targetTenths as number), low = BigInt(d.lowHundredths as number), high = BigInt(d.highHundredths as number);
      assert.equal(roundScaled(low, 2, 1), target);
      assert.equal(roundScaled(high - 1n, 2, 1), target);
      assert.notEqual(roundScaled(high, 2, 1), target);
      break;
    }
    case "SAP-CP007-PROT-LEAST-INTEGER-FOR-ROUNDED-TARGET": {
      const target = BigInt(d.target as number), unit = BigInt(d.unit as number), answer = BigInt(d.answer as number);
      assert.equal(roundInteger(answer, unit), target);
      assert.notEqual(roundInteger(answer - 1n, unit), target);
      break;
    }
    case "SAP-CP007-PROT-GREATEST-INTEGER-FOR-ROUNDED-TARGET": {
      const target = BigInt(d.target as number), unit = BigInt(d.unit as number), answer = BigInt(d.answer as number);
      assert.equal(roundInteger(answer, unit), target);
      assert.notEqual(roundInteger(answer + 1n, unit), target);
      break;
    }
    case "SAP-CP007-PROT-MISSING-DIGIT-FOR-ROUNDING": {
      const thousands = d.thousands as number, hundreds = d.hundreds as number, units = d.units as number, target = BigInt(d.target as number);
      const valid = record.options.filter((option) => {
        const digit = Number(option.value);
        const value = BigInt(thousands * 1000 + hundreds * 100 + digit * 10 + units);
        return roundInteger(value, 100n) === target;
      });
      assert.equal(valid.length, 1);
      assert.equal(valid[0]?.value, record.canonicalAnswer);
      break;
    }
    case "SAP-CP007-PROT-ABSOLUTE-ROUNDING-ERROR": {
      const original = BigInt(d.scaled as number), rounded = BigInt(d.roundedTenths as number) * 10n;
      const error = rounded >= original ? rounded - original : original - rounded;
      assert.equal(record.canonicalAnswer, formatScaled(error, 2));
      break;
    }
    case "SAP-CP007-PROT-COMPARE-ROUNDED-PRECISIONS": {
      const scaled = BigInt(d.scaled as number);
      const one = roundScaled(scaled, 3, 1) * 10n;
      const two = roundScaled(scaled, 3, 2);
      const relation = one < two ? "A < B" : one > two ? "A > B" : "A = B";
      assert.equal(record.canonicalAnswer, relation);
      break;
    }
    case "SAP-CP007-PROT-MAXIMUM-POSSIBLE-ROUNDING-ERROR":
      assert.equal(record.canonicalAnswer, ["5", "50", "0.05", "0.005"][d.caseIndex as number]);
      break;
    case "SAP-CP007-PROT-RELATIVE-ROUNDING-ERROR": {
      const unit = BigInt(d.unit as number), original = BigInt(d.original as number);
      const rounded = roundInteger(original, unit);
      const error = rounded >= original ? rounded - original : original - rounded;
      assert.equal(record.canonicalAnswer, reduced(error, original));
      assert.equal(2n * (original % unit), unit);
      break;
    }
    case "SAP-CP007-PROT-PREMATURE-ROUNDING-DIAGNOSIS": {
      const a = BigInt(d.aScaled as number), b = BigInt(d.bScaled as number);
      const exact = roundScaled(a + b, 2, 0);
      const premature = roundScaled(a, 2, 0) + roundScaled(b, 2, 0);
      assert.notEqual(exact, premature);
      assert.equal(record.canonicalAnswer, `Premature rounding changed the result; the correct final answer is ${exact}`);
      break;
    }
  }
}

const records = generateSapCp007FullReviewRecords();
assert.equal(records.length, SAP_CP007_FULL_REVIEW_TOTAL);
assert.equal(records.length, 300);
assert.equal(SAP_CP007_FULL_REVIEW_PROTOTYPE_IDS.length, 16);

const ids = new Set<string>();
const payloads = new Set<string>();
const stemsByPrototype = new Map<string, Set<string>>();
const counts = new Map<string, number>();
const qls = new Set<string>();
const positions = [0, 0, 0, 0];
const answers = new Map<string, Set<string>>();
const units = new Map<string, Set<number>>();
const targetDps = new Map<string, Set<number>>();
const roundUpStates = new Set<number>();
const maxErrorCases = new Set<number>();
const prematureHundredths = new Set<number>();
const directions = new Set<string>();
const difficulties = new Set<string>();

for (const [index, record] of records.entries()) {
  assert.equal(record.questionId, `SAP-CP007-REV-${String(index + 1).padStart(3, "0")}`);
  assert.ok(!ids.has(record.questionId));
  ids.add(record.questionId);
  assert.equal(record.validation.ok, true, `${record.questionId}: ${record.validation.errors.join("; ")}`);
  assert.ok(record.stem.length >= 20 && record.stem.length <= 430, `${record.questionId}: stem length ${record.stem.length}.`);
  assert.equal(record.options.length, 4);
  assert.equal(new Set(record.options.map((option) => option.value)).size, 4);
  assert.equal(record.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(record.options[record.correctIndex]?.value, record.canonicalAnswer);
  assert.ok(record.options.filter((option) => !option.isCorrect).every((option) => Boolean(option.misconceptionId) && option.analysis.length >= 45));
  assert.ok(record.explanation.coreConcept.length >= 100);
  assert.ok(record.explanation.steps.length >= 2);
  assert.ok(record.explanation.verification.length >= 2);
  assert.ok(record.explanation.finalAnswer.includes(record.canonicalAnswer));
  assert.equal(record.tieRule, "HALF_AWAY_FROM_ZERO");
  assert.doesNotMatch(record.stem, /significant figure/i);
  assert.doesNotMatch(`${record.explanation.coreConcept} ${record.explanation.steps.join(" ")}`, /significant figure/i);
  assert.equal(record.lifecycle.permanentQlId, null);
  assert.equal(record.lifecycle.contentStatus, "ENGLISH_REVIEW_CANDIDATE");
  assert.equal(record.lifecycle.active, false);
  assert.equal(record.lifecycle.questionStudioDiscoverable, false);
  assert.equal(record.lifecycle.questionBankWritable, false);
  assert.equal(record.lifecycle.testEligible, false);
  assert.equal(record.lifecycle.publiclyPublishable, false);
  verifyMathematics(record);

  assert.ok(!payloads.has(record.canonicalPayloadKey), `${record.questionId}: duplicate payload.`);
  payloads.add(record.canonicalPayloadKey);
  const localStems = stemsByPrototype.get(record.prototypeId) ?? new Set<string>();
  assert.ok(!localStems.has(record.stem), `${record.questionId}: duplicate visible stem within QL.`);
  localStems.add(record.stem);
  stemsByPrototype.set(record.prototypeId, localStems);
  positions[record.correctIndex]! += 1;
  counts.set(record.prototypeId, (counts.get(record.prototypeId) ?? 0) + 1);
  qls.add(record.proposedPermanentQlId);
  const answerSet = answers.get(record.prototypeId) ?? new Set<string>();
  answerSet.add(record.canonicalAnswer);
  answers.set(record.prototypeId, answerSet);
  directions.add(record.taskDirection);
  difficulties.add(record.difficulty);

  const d = record.oracle.data;
  if (typeof d.unit === "number") {
    const set = units.get(record.prototypeId) ?? new Set<number>();
    set.add(d.unit);
    units.set(record.prototypeId, set);
  }
  if (typeof d.targetDp === "number") {
    const set = targetDps.get(record.prototypeId) ?? new Set<number>();
    set.add(d.targetDp);
    targetDps.set(record.prototypeId, set);
  }
  if (record.prototypeId === "SAP-CP007-PROT-MISSING-DIGIT-FOR-ROUNDING") roundUpStates.add(Number(d.roundUp));
  if (record.prototypeId === "SAP-CP007-PROT-MAXIMUM-POSSIBLE-ROUNDING-ERROR") maxErrorCases.add(Number(d.caseIndex));
  if (record.prototypeId === "SAP-CP007-PROT-PREMATURE-ROUNDING-DIAGNOSIS") prematureHundredths.add(Number(d.aScaled) % 100);

  if (index >= 2) {
    assert.ok(!(records[index]!.correctIndex === records[index - 1]!.correctIndex && records[index]!.correctIndex === records[index - 2]!.correctIndex), `Three-position run ends at ${record.questionId}.`);
  }
}

assert.equal(ids.size, 300);
assert.equal(payloads.size, 300);
assert.deepEqual(positions, [75, 75, 75, 75]);
assert.deepEqual([...qls].sort(), Array.from({ length: 16 }, (_, index) => `SAP-QL-${String(113 + index).padStart(3, "0")}`));
for (const prototypeId of SAP_CP007_FULL_REVIEW_PROTOTYPE_IDS) {
  assert.equal(counts.get(prototypeId), sapCp007FullReviewCountForPrototype(prototypeId));
  assert.equal(stemsByPrototype.get(prototypeId)?.size, sapCp007FullReviewCountForPrototype(prototypeId));
}

for (const prototypeId of [
  "SAP-CP007-PROT-ROUND-INTEGER-DECLARED-PLACE",
  "SAP-CP007-PROT-IDENTIFY-DECIDING-DIGIT",
  "SAP-CP007-PROT-REVERSE-INTEGER-ROUNDING-INTERVAL",
  "SAP-CP007-PROT-LEAST-INTEGER-FOR-ROUNDED-TARGET",
  "SAP-CP007-PROT-GREATEST-INTEGER-FOR-ROUNDED-TARGET",
  "SAP-CP007-PROT-RELATIVE-ROUNDING-ERROR",
]) assert.deepEqual(units.get(prototypeId), new Set([10, 100, 1000]), `${prototypeId}: missing rounding-unit coverage.`);

assert.deepEqual(targetDps.get("SAP-CP007-PROT-ROUND-DECIMAL-PLACES"), new Set([1, 2, 3]));
assert.deepEqual(targetDps.get("SAP-CP007-PROT-NEGATIVE-HALFWAY-EXPLICIT-RULE"), new Set([0, 1]));
assert.deepEqual(roundUpStates, new Set([0, 1]));
assert.deepEqual(answers.get("SAP-CP007-PROT-ABSOLUTE-ROUNDING-ERROR"), new Set(["0.01", "0.02", "0.03", "0.04", "0.05"]));
assert.deepEqual(answers.get("SAP-CP007-PROT-COMPARE-ROUNDED-PRECISIONS"), new Set(["A < B", "A = B", "A > B"]));
assert.deepEqual(maxErrorCases, new Set([0, 1, 2, 3]));
assert.equal(answers.get("SAP-CP007-PROT-MAXIMUM-POSSIBLE-ROUNDING-ERROR")?.size, 4);
assert.equal(answers.get("SAP-CP007-PROT-RELATIVE-ROUNDING-ERROR")?.size, 18);
assert.equal(answers.get("SAP-CP007-PROT-PREMATURE-ROUNDING-DIAGNOSIS")?.size, 18);
assert.deepEqual(prematureHundredths, new Set([49, 51]));
assert.deepEqual([...directions].sort(), ["COMPARISON", "DIAGNOSIS", "ERROR", "FORWARD", "INVERSE", "PLACE_VALUE"]);
assert.deepEqual([...difficulties].sort(), ["EASY", "HARD", "MEDIUM"]);

console.log("SAP-CP-007 final review authority passed: 300 unique questions across 16 candidate QLs, exact 75 A/B/C/D balance, bounded-family diversity, independent rounding/error proofs, and no significant-figure leakage.");
