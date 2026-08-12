import assert from "node:assert/strict";
import {
  SAP_CP007_CATALOGUE,
  SAP_CP007_PROTOTYPE_IDS,
  SAP_CP007_TIE_RULE,
  formatScaled,
  generateSapCp007,
  type SapCp007Package,
} from "./runtime-v2";

function pow10(dp: number): bigint {
  return 10n ** BigInt(dp);
}

function independentRoundScaled(value: bigint, inputDp: number, targetDp: number): bigint {
  const factor = pow10(inputDp - targetDp);
  const sign = value < 0n ? -1n : 1n;
  const absolute = value < 0n ? -value : value;
  const quotient = absolute / factor;
  const remainder = absolute % factor;
  const adjusted = quotient + (2n * remainder >= factor ? 1n : 0n);
  return sign * adjusted;
}

function independentRoundInteger(value: bigint, unit: bigint): bigint {
  const sign = value < 0n ? -1n : 1n;
  const absolute = value < 0n ? -value : value;
  const quotient = absolute / unit;
  const remainder = absolute % unit;
  const adjusted = quotient + (2n * remainder >= unit ? 1n : 0n);
  return sign * adjusted * unit;
}

function assertPackageBasics(pkg: SapCp007Package): void {
  assert.equal(pkg.validation.ok, true, `${pkg.prototypeId}:${pkg.seed}: ${pkg.validation.errors.join("; ")}`);
  assert.equal(pkg.tieRule, SAP_CP007_TIE_RULE);
  assert.equal(pkg.options.length, 4);
  assert.equal(new Set(pkg.options.map((option) => option.value)).size, 4);
  assert.equal(pkg.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(pkg.options[pkg.correctIndex]?.value, pkg.canonicalAnswer);
  assert.ok(pkg.explanation.coreConcept.length >= 100);
  assert.ok(pkg.explanation.steps.length >= 2);
  assert.ok(pkg.explanation.verification.length >= 2);
  assert.ok(pkg.explanation.finalAnswer.includes(pkg.canonicalAnswer));
  assert.equal(pkg.lifecycle.permanentQlId, null);
  assert.equal(pkg.lifecycle.contentStatus, "ENGLISH_REVIEW_CANDIDATE");
  assert.equal(pkg.lifecycle.active, false);
  assert.equal(pkg.lifecycle.questionStudioDiscoverable, false);
  assert.equal(pkg.lifecycle.questionBankWritable, false);
  assert.equal(pkg.lifecycle.testEligible, false);
  assert.equal(pkg.lifecycle.publiclyPublishable, false);
  assert.doesNotMatch(pkg.stem, /significant figure/i);
}

function verifyMode(pkg: SapCp007Package): void {
  const d = pkg.oracle.data;
  switch (pkg.prototypeId) {
    case "SAP-CP007-PROT-ROUND-INTEGER-DECLARED-PLACE": {
      const expected = independentRoundInteger(BigInt(d.value as number), BigInt(d.unit as number));
      assert.equal(pkg.canonicalAnswer, String(expected));
      break;
    }
    case "SAP-CP007-PROT-ROUND-DECIMAL-NEAREST-INTEGER":
    case "SAP-CP007-PROT-ROUND-DECIMAL-PLACES":
    case "SAP-CP007-PROT-NEGATIVE-HALFWAY-EXPLICIT-RULE": {
      const expected = independentRoundScaled(BigInt(d.scaled as number), d.inputDp as number, d.targetDp as number);
      assert.equal(pkg.canonicalAnswer, formatScaled(expected, d.targetDp as number));
      if (pkg.prototypeId === "SAP-CP007-PROT-NEGATIVE-HALFWAY-EXPLICIT-RULE") {
        const factor = pow10((d.inputDp as number) - (d.targetDp as number));
        const raw = BigInt(d.scaled as number);
        const absolute = raw < 0n ? -raw : raw;
        assert.equal(2n * (absolute % factor), factor, `${pkg.seed}: negative tie state is not exactly halfway.`);
        assert.match(pkg.stem, /away from zero/i);
      }
      break;
    }
    case "SAP-CP007-PROT-IDENTIFY-DECIDING-DIGIT": {
      const value = d.value as number;
      const place = d.decidingPlace as number;
      const expectedDigit = Math.floor(value / place) % 10;
      assert.equal(expectedDigit, d.decidingDigit);
      assert.ok(pkg.canonicalAnswer.endsWith(`(${expectedDigit})`));
      break;
    }
    case "SAP-CP007-PROT-CORRECT-PRECISION-REPRESENTATION": {
      const expected = independentRoundScaled(BigInt(d.scaled as number), 3, 2);
      assert.equal(pkg.canonicalAnswer, formatScaled(expected, 2));
      assert.match(pkg.canonicalAnswer, /^-?\d+\.\d{2}$/);
      assert.ok(pkg.canonicalAnswer.endsWith("0"), `${pkg.seed}: precision QL must exercise a required trailing zero.`);
      assert.equal(d.trailingZeroRequired, 1);
      break;
    }
    case "SAP-CP007-PROT-REVERSE-INTEGER-ROUNDING-INTERVAL": {
      const target = BigInt(d.target as number);
      const unit = BigInt(d.unit as number);
      const low = BigInt(d.low as number);
      const high = BigInt(d.high as number);
      assert.equal(independentRoundInteger(low, unit), target);
      assert.equal(independentRoundInteger(high, unit), target);
      assert.notEqual(independentRoundInteger(low - 1n, unit), target);
      assert.notEqual(independentRoundInteger(high + 1n, unit), target);
      assert.equal(pkg.canonicalAnswer, `${low} to ${high} (inclusive)`);
      break;
    }
    case "SAP-CP007-PROT-REVERSE-DECIMAL-ROUNDING-INTERVAL": {
      const targetTenths = BigInt(d.targetTenths as number);
      const low = BigInt(d.lowHundredths as number);
      const high = BigInt(d.highHundredths as number);
      assert.equal(independentRoundScaled(low, 2, 1), targetTenths);
      assert.equal(independentRoundScaled(high - 1n, 2, 1), targetTenths);
      assert.notEqual(independentRoundScaled(high, 2, 1), targetTenths);
      assert.equal(pkg.canonicalAnswer, `${formatScaled(low, 2)} ≤ x < ${formatScaled(high, 2)}`);
      break;
    }
    case "SAP-CP007-PROT-LEAST-INTEGER-FOR-ROUNDED-TARGET": {
      const target = BigInt(d.target as number), unit = BigInt(d.unit as number), answer = BigInt(d.answer as number);
      assert.equal(independentRoundInteger(answer, unit), target);
      assert.notEqual(independentRoundInteger(answer - 1n, unit), target);
      assert.equal(pkg.canonicalAnswer, String(answer));
      break;
    }
    case "SAP-CP007-PROT-GREATEST-INTEGER-FOR-ROUNDED-TARGET": {
      const target = BigInt(d.target as number), unit = BigInt(d.unit as number), answer = BigInt(d.answer as number);
      assert.equal(independentRoundInteger(answer, unit), target);
      assert.notEqual(independentRoundInteger(answer + 1n, unit), target);
      assert.equal(pkg.canonicalAnswer, String(answer));
      break;
    }
    case "SAP-CP007-PROT-MISSING-DIGIT-FOR-ROUNDING": {
      const thousands = d.thousands as number, hundreds = d.hundreds as number, units = d.units as number;
      const target = BigInt(d.target as number);
      const optionValidity = pkg.options.map((option) => {
        const digit = Number(option.value);
        const value = BigInt(thousands * 1000 + hundreds * 100 + digit * 10 + units);
        return independentRoundInteger(value, 100n) === target;
      });
      assert.equal(optionValidity.filter(Boolean).length, 1, `${pkg.seed}: displayed digit options are not uniquely answerable.`);
      assert.equal(optionValidity[pkg.correctIndex], true);
      break;
    }
    case "SAP-CP007-PROT-ABSOLUTE-ROUNDING-ERROR": {
      const original = BigInt(d.scaled as number);
      const roundedTenths = BigInt(d.roundedTenths as number);
      const roundedHundredths = roundedTenths * 10n;
      const expectedError = roundedHundredths >= original ? roundedHundredths - original : original - roundedHundredths;
      assert.equal(expectedError, BigInt(d.errorHundredths as number));
      assert.equal(pkg.canonicalAnswer, formatScaled(expectedError, 2));
      assert.ok(expectedError >= 1n && expectedError <= 5n);
      break;
    }
  }
}

const payloads = new Set<string>();
const identities = new Set<string>();
const qls = new Set<string>();
const positionCounts = [0, 0, 0, 0];
const answerSets = new Map<string, Set<string>>();
const directions = new Set<string>();
const difficulties = new Set<string>();
let cases = 0;

for (const prototypeId of SAP_CP007_PROTOTYPE_IDS) {
  for (let seed = 1; seed <= 100; seed += 1) {
    const pkg = generateSapCp007(prototypeId, seed);
    assertPackageBasics(pkg);
    verifyMode(pkg);
    assert.ok(!payloads.has(pkg.canonicalPayloadKey), `${prototypeId}:${seed}: duplicate payload.`);
    payloads.add(pkg.canonicalPayloadKey);
    assert.ok(!identities.has(pkg.generationIdentity), `${prototypeId}:${seed}: duplicate generation identity.`);
    identities.add(pkg.generationIdentity);
    qls.add(pkg.proposedPermanentQlId);
    positionCounts[pkg.correctIndex]! += 1;
    const answers = answerSets.get(prototypeId) ?? new Set<string>();
    answers.add(pkg.canonicalAnswer);
    answerSets.set(prototypeId, answers);
    directions.add(pkg.taskDirection);
    difficulties.add(pkg.difficulty);
    cases += 1;
  }
}

assert.equal(cases, 1200);
assert.equal(payloads.size, 1200);
assert.equal(identities.size, 1200);
assert.equal(SAP_CP007_CATALOGUE.length, 12);
assert.deepEqual([...qls].sort(), Array.from({ length: 12 }, (_, index) => `SAP-QL-${String(113 + index).padStart(3, "0")}`));
assert.deepEqual(positionCounts, [300, 300, 300, 300]);
for (const prototypeId of SAP_CP007_PROTOTYPE_IDS) {
  const minimum = prototypeId === "SAP-CP007-PROT-MISSING-DIGIT-FOR-ROUNDING" ? 4 : 5;
  assert.ok((answerSets.get(prototypeId)?.size ?? 0) >= minimum, `${prototypeId}: insufficient answer diversity.`);
}
assert.deepEqual([...directions].sort(), ["ERROR", "FORWARD", "INVERSE", "PLACE_VALUE"]);
assert.deepEqual([...difficulties].sort(), ["EASY", "HARD", "MEDIUM"]);

console.log("SAP-CP-007 foundation v2 authority passed: 1,200 deterministic cases across 12 rounding identities with exact fixed-point proof, reverse-interval reconstruction, 300 A/B/C/D positions each, and inactive candidate lifecycle.");
