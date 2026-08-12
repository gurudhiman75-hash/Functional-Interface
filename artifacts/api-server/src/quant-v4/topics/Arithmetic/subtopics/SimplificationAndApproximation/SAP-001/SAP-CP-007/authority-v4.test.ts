import assert from "node:assert/strict";
import {
  SAP_CP007_CATALOGUE,
  SAP_CP007_PROTOTYPE_IDS,
  SAP_CP007_TIE_RULE,
  formatScaled,
  generateSapCp007,
  type SapCp007Package,
} from "./runtime-v4";

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

function basics(pkg: SapCp007Package): void {
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

function verify(pkg: SapCp007Package): void {
  const d = pkg.oracle.data;
  switch (pkg.prototypeId) {
    case "SAP-CP007-PROT-ROUND-INTEGER-DECLARED-PLACE": {
      assert.equal(pkg.canonicalAnswer, String(roundInteger(BigInt(d.value as number), BigInt(d.unit as number))));
      assert.ok((d.value as number) % (d.unit as number) > 0, `${pkg.seed}: direct integer state should require a rounding decision.`);
      break;
    }
    case "SAP-CP007-PROT-ROUND-DECIMAL-NEAREST-INTEGER":
    case "SAP-CP007-PROT-ROUND-DECIMAL-PLACES":
    case "SAP-CP007-PROT-NEGATIVE-HALFWAY-EXPLICIT-RULE": {
      const raw = BigInt(d.scaled as number);
      const expected = roundScaled(raw, d.inputDp as number, d.targetDp as number);
      assert.equal(pkg.canonicalAnswer, formatScaled(expected, d.targetDp as number));
      if (pkg.prototypeId === "SAP-CP007-PROT-NEGATIVE-HALFWAY-EXPLICIT-RULE") {
        const factor = pow10((d.inputDp as number) - (d.targetDp as number));
        const absolute = raw < 0n ? -raw : raw;
        assert.equal(2n * (absolute % factor), factor, `${pkg.seed}: state is not an exact midpoint.`);
        assert.equal(d.exactHalfway, 1);
        assert.match(pkg.stem, /away from zero/i);
      }
      break;
    }
    case "SAP-CP007-PROT-IDENTIFY-DECIDING-DIGIT": {
      const expectedDigit = Math.floor((d.value as number) / (d.decidingPlace as number)) % 10;
      assert.equal(expectedDigit, d.decidingDigit);
      assert.ok(pkg.canonicalAnswer.endsWith(`(${expectedDigit})`));
      break;
    }
    case "SAP-CP007-PROT-CORRECT-PRECISION-REPRESENTATION": {
      const expected = roundScaled(BigInt(d.scaled as number), 3, 2);
      assert.equal(pkg.canonicalAnswer, formatScaled(expected, 2));
      assert.match(pkg.canonicalAnswer, /^-?\d+\.\d{2}$/);
      assert.ok(pkg.canonicalAnswer.endsWith("0"), `${pkg.seed}: required trailing-zero state collapsed.`);
      assert.equal(d.trailingZeroRequired, 1);
      break;
    }
    case "SAP-CP007-PROT-REVERSE-INTEGER-ROUNDING-INTERVAL": {
      const target = BigInt(d.target as number), unit = BigInt(d.unit as number), low = BigInt(d.low as number), high = BigInt(d.high as number);
      assert.equal(roundInteger(low, unit), target);
      assert.equal(roundInteger(high, unit), target);
      assert.notEqual(roundInteger(low - 1n, unit), target);
      assert.notEqual(roundInteger(high + 1n, unit), target);
      assert.equal(pkg.canonicalAnswer, `${low} to ${high} (inclusive)`);
      break;
    }
    case "SAP-CP007-PROT-REVERSE-DECIMAL-ROUNDING-INTERVAL": {
      const target = BigInt(d.targetTenths as number), low = BigInt(d.lowHundredths as number), high = BigInt(d.highHundredths as number);
      assert.equal(roundScaled(low, 2, 1), target);
      assert.equal(roundScaled(high - 1n, 2, 1), target);
      assert.notEqual(roundScaled(high, 2, 1), target);
      assert.equal(pkg.canonicalAnswer, `${formatScaled(low, 2)} ≤ x < ${formatScaled(high, 2)}`);
      break;
    }
    case "SAP-CP007-PROT-LEAST-INTEGER-FOR-ROUNDED-TARGET": {
      const target = BigInt(d.target as number), unit = BigInt(d.unit as number), answer = BigInt(d.answer as number);
      assert.equal(roundInteger(answer, unit), target);
      assert.notEqual(roundInteger(answer - 1n, unit), target);
      assert.equal(pkg.canonicalAnswer, String(answer));
      break;
    }
    case "SAP-CP007-PROT-GREATEST-INTEGER-FOR-ROUNDED-TARGET": {
      const target = BigInt(d.target as number), unit = BigInt(d.unit as number), answer = BigInt(d.answer as number);
      assert.equal(roundInteger(answer, unit), target);
      assert.notEqual(roundInteger(answer + 1n, unit), target);
      assert.equal(pkg.canonicalAnswer, String(answer));
      break;
    }
    case "SAP-CP007-PROT-MISSING-DIGIT-FOR-ROUNDING": {
      const thousands = d.thousands as number, hundreds = d.hundreds as number, units = d.units as number, target = BigInt(d.target as number);
      const validity = pkg.options.map((option) => {
        const digit = Number(option.value);
        return roundInteger(BigInt(thousands * 1000 + hundreds * 100 + digit * 10 + units), 100n) === target;
      });
      assert.equal(validity.filter(Boolean).length, 1, `${pkg.seed}: more than one displayed digit works.`);
      assert.equal(validity[pkg.correctIndex], true);
      break;
    }
    case "SAP-CP007-PROT-ABSOLUTE-ROUNDING-ERROR": {
      const original = BigInt(d.scaled as number), roundedHundredths = BigInt(d.roundedTenths as number) * 10n;
      const error = roundedHundredths >= original ? roundedHundredths - original : original - roundedHundredths;
      assert.equal(error, BigInt(d.errorHundredths as number));
      assert.equal(pkg.canonicalAnswer, formatScaled(error, 2));
      assert.ok(error >= 1n && error <= 5n);
      break;
    }
  }
}

const payloads = new Set<string>();
const identities = new Set<string>();
const qls = new Set<string>();
const positions = [0, 0, 0, 0];
const answers = new Map<string, Set<string>>();
const directions = new Set<string>();
const difficulties = new Set<string>();
let total = 0;

for (const prototypeId of SAP_CP007_PROTOTYPE_IDS) {
  for (let seed = 1; seed <= 100; seed += 1) {
    const pkg = generateSapCp007(prototypeId, seed);
    basics(pkg);
    verify(pkg);
    assert.ok(!payloads.has(pkg.canonicalPayloadKey), `${prototypeId}:${seed}: duplicate payload.`);
    assert.ok(!identities.has(pkg.generationIdentity), `${prototypeId}:${seed}: duplicate generation identity.`);
    payloads.add(pkg.canonicalPayloadKey);
    identities.add(pkg.generationIdentity);
    qls.add(pkg.proposedPermanentQlId);
    positions[pkg.correctIndex]! += 1;
    const set = answers.get(prototypeId) ?? new Set<string>();
    set.add(pkg.canonicalAnswer);
    answers.set(prototypeId, set);
    directions.add(pkg.taskDirection);
    difficulties.add(pkg.difficulty);
    total += 1;
  }
}

assert.equal(total, 1200);
assert.equal(payloads.size, 1200);
assert.equal(identities.size, 1200);
assert.equal(SAP_CP007_CATALOGUE.length, 12);
assert.deepEqual([...qls].sort(), Array.from({ length: 12 }, (_, index) => `SAP-QL-${String(113 + index).padStart(3, "0")}`));
assert.deepEqual(positions, [300, 300, 300, 300]);
for (const prototypeId of SAP_CP007_PROTOTYPE_IDS) {
  const minimum = prototypeId === "SAP-CP007-PROT-MISSING-DIGIT-FOR-ROUNDING" ? 4 : 5;
  assert.ok((answers.get(prototypeId)?.size ?? 0) >= minimum, `${prototypeId}: insufficient answer diversity.`);
}
assert.deepEqual([...directions].sort(), ["ERROR", "FORWARD", "INVERSE", "PLACE_VALUE"]);
assert.deepEqual([...difficulties].sort(), ["EASY", "HARD", "MEDIUM"]);

console.log("SAP-CP-007 foundation v4 authority passed: 1,200 unique deterministic cases across 12 rounding identities with exact fixed-point proof, non-collapsing inverse/error pools, balanced A/B/C/D positions, and inactive lifecycle.");
