import assert from "node:assert/strict";
import {
  SAP_CP007_WAVE2_CATALOGUE,
  SAP_CP007_WAVE2_PROTOTYPE_IDS,
  generateSapCp007Wave2,
  type SapCp007Wave2Package,
} from "./runtime-wave2-v4";

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

function basics(pkg: SapCp007Wave2Package): void {
  assert.equal(pkg.validation.ok, true, `${pkg.prototypeId}:${pkg.seed}: ${pkg.validation.errors.join("; ")}`);
  assert.equal(pkg.options.length, 4);
  assert.equal(new Set(pkg.options.map((option) => option.value)).size, 4, `${pkg.prototypeId}:${pkg.seed}: duplicate option.`);
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

function verify(pkg: SapCp007Wave2Package): void {
  const d = pkg.oracle.data;
  switch (pkg.prototypeId) {
    case "SAP-CP007-PROT-COMPARE-ROUNDED-PRECISIONS": {
      const scaled = BigInt(d.scaled as number);
      const oneDp = roundScaled(scaled, 3, 1);
      const twoDp = roundScaled(scaled, 3, 2);
      const oneDpHundredths = oneDp * 10n;
      const relation = oneDpHundredths < twoDp ? "A < B" : oneDpHundredths > twoDp ? "A > B" : "A = B";
      assert.equal(pkg.canonicalAnswer, relation);
      assert.equal(BigInt(d.oneDpScaled as number), oneDp);
      assert.equal(BigInt(d.twoDpScaled as number), twoDp);
      break;
    }
    case "SAP-CP007-PROT-MAXIMUM-POSSIBLE-ROUNDING-ERROR": {
      const expected = ["5", "50", "0.05", "0.005"][d.caseIndex as number]!;
      assert.equal(pkg.canonicalAnswer, expected);
      assert.match(pkg.stem, new RegExp(String(d.reported).replace(".", "\\.")));
      break;
    }
    case "SAP-CP007-PROT-RELATIVE-ROUNDING-ERROR": {
      const unit = BigInt(d.unit as number);
      const original = BigInt(d.original as number);
      const rounded = roundInteger(original, unit);
      const error = rounded >= original ? rounded - original : original - rounded;
      assert.equal(rounded, BigInt(d.rounded as number));
      assert.equal(error, BigInt(d.error as number));
      assert.equal(2n * (original % unit), unit, `${pkg.seed}: relative-error original is not an exact midpoint.`);
      assert.equal(pkg.canonicalAnswer, reduced(error, original));
      assert.equal(pkg.canonicalAnswer, `1/${d.denominator}`);
      break;
    }
    case "SAP-CP007-PROT-PREMATURE-ROUNDING-DIAGNOSIS": {
      const a = BigInt(d.aScaled as number), b = BigInt(d.bScaled as number);
      const exactSum = a + b;
      const correct = roundScaled(exactSum, 2, 0);
      const aEarly = roundScaled(a, 2, 0);
      const bEarly = roundScaled(b, 2, 0);
      const premature = aEarly + bEarly;
      assert.equal(exactSum, BigInt(d.exactSum as number));
      assert.equal(correct, BigInt(d.correctRounded as number));
      assert.equal(premature, BigInt(d.premature as number));
      assert.notEqual(correct, premature, `${pkg.seed}: premature rounding did not alter the final result.`);
      assert.equal(pkg.canonicalAnswer, `Premature rounding changed the result; the correct final answer is ${correct}`);
      break;
    }
  }
}

const payloads = new Set<string>();
const identities = new Set<string>();
const stems = new Set<string>();
const qls = new Set<string>();
const positions = [0, 0, 0, 0];
const answers = new Map<string, Set<string>>();
const relationCounts = new Map<string, number>();
let total = 0;

for (const prototypeId of SAP_CP007_WAVE2_PROTOTYPE_IDS) {
  const localStems = new Set<string>();
  for (let seed = 1; seed <= 100; seed += 1) {
    const pkg = generateSapCp007Wave2(prototypeId, seed);
    basics(pkg);
    verify(pkg);
    assert.ok(!payloads.has(pkg.canonicalPayloadKey), `${prototypeId}:${seed}: duplicate payload.`);
    assert.ok(!identities.has(pkg.generationIdentity), `${prototypeId}:${seed}: duplicate generation identity.`);
    assert.ok(!localStems.has(pkg.stem), `${prototypeId}:${seed}: duplicate student-facing stem.`);
    payloads.add(pkg.canonicalPayloadKey);
    identities.add(pkg.generationIdentity);
    localStems.add(pkg.stem);
    stems.add(`${prototypeId}|${pkg.stem}`);
    qls.add(pkg.proposedPermanentQlId);
    positions[pkg.correctIndex]! += 1;
    const set = answers.get(prototypeId) ?? new Set<string>();
    set.add(pkg.canonicalAnswer);
    answers.set(prototypeId, set);
    if (prototypeId === "SAP-CP007-PROT-COMPARE-ROUNDED-PRECISIONS") {
      relationCounts.set(pkg.canonicalAnswer, (relationCounts.get(pkg.canonicalAnswer) ?? 0) + 1);
    }
    total += 1;
  }
  assert.equal(localStems.size, 100, `${prototypeId}: expected 100 distinct visible stems.`);
}

assert.equal(total, 400);
assert.equal(payloads.size, 400);
assert.equal(identities.size, 400);
assert.equal(stems.size, 400);
assert.equal(SAP_CP007_WAVE2_CATALOGUE.length, 4);
assert.deepEqual([...qls].sort(), ["SAP-QL-125", "SAP-QL-126", "SAP-QL-127", "SAP-QL-128"]);
assert.deepEqual(positions, [100, 100, 100, 100]);
assert.deepEqual([...relationCounts.keys()].sort(), ["A < B", "A = B", "A > B"]);
assert.ok((relationCounts.get("A = B") ?? 0) >= 30);
assert.ok((relationCounts.get("A < B") ?? 0) >= 30);
assert.ok((relationCounts.get("A > B") ?? 0) >= 30);
assert.equal(answers.get("SAP-CP007-PROT-MAXIMUM-POSSIBLE-ROUNDING-ERROR")?.size, 4);
assert.equal(answers.get("SAP-CP007-PROT-RELATIVE-ROUNDING-ERROR")?.size, 100);
assert.ok((answers.get("SAP-CP007-PROT-PREMATURE-ROUNDING-DIAGNOSIS")?.size ?? 0) >= 20);

console.log("SAP-CP-007 wave-two authority passed: 400 unique student-facing cases across QL-125..128, all three precision-comparison relations, exact half-unit/relative-error proofs, premature-rounding diagnosis, 100 A/B/C/D positions each, and inactive lifecycle.");
