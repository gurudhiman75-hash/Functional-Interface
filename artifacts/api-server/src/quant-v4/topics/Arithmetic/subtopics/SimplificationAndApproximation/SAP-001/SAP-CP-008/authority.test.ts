import assert from "node:assert/strict";
import {
  SAP_CP008_CATALOGUE,
  SAP_CP008_POLICY,
  SAP_CP008_PROTOTYPE_IDS,
  generateSapCp008,
  type SapCp008Package,
} from "./runtime-v2";

function roundIndependent(value: number, unit: number): number {
  assert.ok(Number.isInteger(value) && Number.isInteger(unit) && unit > 0);
  const sign = value < 0 ? -1 : 1;
  const absolute = Math.abs(value);
  const lower = Math.floor(absolute / unit) * unit;
  const upper = lower + unit;
  return sign * (absolute - lower < upper - absolute ? lower : upper);
}

function formatScaled(value: number, dp: number): string {
  const sign = value < 0 ? "-" : "";
  const absolute = Math.abs(value);
  if (dp === 0) return `${value}`;
  const factor = 10 ** dp;
  return `${sign}${Math.floor(absolute / factor)}.${String(absolute % factor).padStart(dp, "0")}`;
}

function basics(pkg: SapCp008Package): void {
  assert.equal(pkg.validation.ok, true, `${pkg.prototypeId}:${pkg.seed}: ${pkg.validation.errors.join("; ")}`);
  assert.equal(pkg.policy, SAP_CP008_POLICY);
  assert.match(pkg.stem, /Round each indicated term/i);
  assert.doesNotMatch(pkg.stem, /significant figure/i);
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
}

function verify(pkg: SapCp008Package): void {
  const d = pkg.oracle.data;
  switch (pkg.prototypeId) {
    case "SAP-CP008-PROT-APPROX-INTEGER-SUM": {
      const ra = roundIndependent(Number(d.a), Number(d.unit));
      const rb = roundIndependent(Number(d.b), Number(d.unit));
      const rc = roundIndependent(Number(d.c), Number(d.unit));
      assert.equal(pkg.canonicalAnswer, String(ra + rb + rc));
      break;
    }
    case "SAP-CP008-PROT-APPROX-INTEGER-DIFFERENCE": {
      const ra = roundIndependent(Number(d.a), Number(d.unit));
      const rb = roundIndependent(Number(d.b), Number(d.unit));
      assert.equal(pkg.canonicalAnswer, String(ra - rb));
      assert.ok(ra - rb > 0);
      break;
    }
    case "SAP-CP008-PROT-SIGNED-ADDITIVE-CHAIN": {
      const unit = Number(d.unit);
      assert.equal(pkg.canonicalAnswer, String(roundIndependent(Number(d.a), unit) - roundIndependent(Number(d.b), unit) + roundIndependent(Number(d.c), unit)));
      break;
    }
    case "SAP-CP008-PROT-BRACKETED-ADDITIVE-CHAIN": {
      const unit = Number(d.unit);
      assert.equal(pkg.canonicalAnswer, String(roundIndependent(Number(d.a), unit) + (roundIndependent(Number(d.b), unit) - roundIndependent(Number(d.c), unit))));
      break;
    }
    case "SAP-CP008-PROT-DECIMAL-SUM": {
      const answerScaled = roundIndependent(Number(d.a), 10) + roundIndependent(Number(d.b), 10) + roundIndependent(Number(d.c), 10);
      assert.equal(pkg.canonicalAnswer, formatScaled(answerScaled, 1));
      break;
    }
    case "SAP-CP008-PROT-DECIMAL-DIFFERENCE": {
      const answerScaled = roundIndependent(Number(d.a), 10) - roundIndependent(Number(d.b), 10);
      assert.equal(pkg.canonicalAnswer, formatScaled(answerScaled, 1));
      assert.ok(answerScaled > 0);
      break;
    }
    case "SAP-CP008-PROT-COMPATIBLE-ADDENDS": {
      assert.equal(roundIndependent(Number(d.a), Number(d.unit)), Number(d.targetA));
      assert.equal(roundIndependent(Number(d.b), Number(d.unit)), Number(d.targetB));
      assert.equal(pkg.canonicalAnswer, `${d.targetA} + ${d.targetB} = ${d.answer}`);
      break;
    }
    case "SAP-CP008-PROT-ADD-MULTIPLY-ADDITIVE-DOMINANT": {
      const ra = roundIndependent(Number(d.a), 10), rb = roundIndependent(Number(d.b), 10);
      assert.equal(pkg.canonicalAnswer, String(ra + Number(d.multiplier) * rb));
      break;
    }
    case "SAP-CP008-PROT-DIVIDE-ADD-ADDITIVE-DOMINANT": {
      const divisor = Number(d.divisor);
      assert.notEqual(Number(d.roundedA) % divisor, 1);
      assert.equal(Number(d.roundedA) % divisor, 0);
      assert.equal(pkg.canonicalAnswer, String(Number(d.roundedA) / divisor + Number(d.roundedB)));
      assert.ok(Number(d.roundedA) > 0 && divisor > 0);
      break;
    }
    case "SAP-CP008-PROT-BOUNDED-BODMAS-ADDITIVE": {
      const ra = roundIndependent(Number(d.a), 10), rb = roundIndependent(Number(d.b), 10), rc = roundIndependent(Number(d.c), 10);
      assert.equal(pkg.canonicalAnswer, String((ra - rb) + 2 * rc));
      break;
    }
    case "SAP-CP008-PROT-MISSING-ADDEND-APPROX-EQUALITY": {
      assert.equal(Number(d.roundedKnown) + Number(d.roundedMissing), Number(d.target));
      assert.equal(pkg.canonicalAnswer, String(d.roundedMissing));
      break;
    }
    case "SAP-CP008-PROT-MISSING-SUBTRAHEND-APPROX-EQUALITY": {
      assert.equal(Number(d.roundedKnown) - Number(d.roundedMissing), Number(d.target));
      assert.equal(pkg.canonicalAnswer, String(d.roundedMissing));
      break;
    }
    case "SAP-CP008-PROT-NEAREST-OPTION-ADDITIVE": {
      const unit = Number(d.unit);
      const estimate = roundIndependent(Number(d.a), unit) + roundIndependent(Number(d.b), unit) - roundIndependent(Number(d.c), unit);
      assert.equal(pkg.canonicalAnswer, String(estimate));
      for (const option of pkg.options.filter((option) => !option.isCorrect)) assert.ok(Math.abs(Number(option.value) - estimate) >= unit);
      break;
    }
    case "SAP-CP008-PROT-SUM-ROUNDING-BOUNDS": {
      const unit = Number(d.unit), half = unit / 2;
      assert.equal(Number(d.low), Number(d.x) + Number(d.y) - 2 * half);
      assert.equal(Number(d.highExclusive), Number(d.x) + Number(d.y) + 2 * half);
      assert.equal(pkg.canonicalAnswer, `${d.low} ≤ exact value < ${d.highExclusive}`);
      break;
    }
    case "SAP-CP008-PROT-DIFFERENCE-ROUNDING-BOUNDS": {
      const unit = Number(d.unit), half = unit / 2;
      const low = Number(d.x) - half - (Number(d.y) + half);
      const high = Number(d.x) + half - (Number(d.y) - half);
      assert.equal(Number(d.low), low);
      assert.equal(Number(d.highExclusive), high);
      assert.equal(pkg.canonicalAnswer, `${low} < exact value < ${high}`);
      assert.ok(low > 0, `${pkg.seed}: uncontrolled near-cancellation entered difference bounds.`);
      break;
    }
    case "SAP-CP008-PROT-OVER-UNDER-CLASS": {
      const estimate = roundIndependent(Number(d.a), 10) + roundIndependent(Number(d.b), 10);
      const exact = Number(d.a) + Number(d.b);
      const expected = estimate > exact ? "Overestimate" : estimate < exact ? "Underestimate" : "Exact after rounding";
      assert.equal(pkg.canonicalAnswer, expected);
      assert.equal(Number(d.estimate), estimate);
      assert.equal(Number(d.exact), exact);
      break;
    }
    case "SAP-CP008-PROT-COMPARE-ADDITIVE-ESTIMATES": {
      const a = roundIndependent(Number(d.a), 10) + roundIndependent(Number(d.b), 10);
      const b = roundIndependent(Number(d.c), 10) + roundIndependent(Number(d.d), 10);
      const relation = a < b ? "A < B" : a > b ? "A > B" : "A = B";
      assert.equal(pkg.canonicalAnswer, relation);
      break;
    }
    case "SAP-CP008-PROT-DIAGNOSE-INVALID-ROUNDING-DIRECTION": {
      const ra = roundIndependent(Number(d.a), 10), rb = roundIndependent(Number(d.b), 10);
      assert.notEqual(Number(d.wrongA), ra);
      assert.equal(Number(d.wrongEstimate), Number(d.wrongA) + rb);
      assert.equal(Number(d.actual), ra + rb);
      assert.ok(pkg.canonicalAnswer.includes(String(ra + rb)));
      break;
    }
  }
}

const payloads = new Set<string>();
const identities = new Set<string>();
const allStems = new Set<string>();
const qls = new Set<string>();
const positions = [0, 0, 0, 0];
const relationClasses = new Set<string>();
const overUnderClasses = new Set<string>();
let total = 0;

for (const prototypeId of SAP_CP008_PROTOTYPE_IDS) {
  const localStems = new Set<string>();
  for (let seed = 1; seed <= 100; seed += 1) {
    const pkg = generateSapCp008(prototypeId, seed);
    basics(pkg);
    verify(pkg);
    assert.ok(!payloads.has(pkg.canonicalPayloadKey), `${prototypeId}:${seed}: duplicate payload.`);
    assert.ok(!identities.has(pkg.generationIdentity), `${prototypeId}:${seed}: duplicate identity.`);
    assert.ok(!localStems.has(pkg.stem), `${prototypeId}:${seed}: duplicate visible stem.`);
    payloads.add(pkg.canonicalPayloadKey);
    identities.add(pkg.generationIdentity);
    localStems.add(pkg.stem);
    allStems.add(`${prototypeId}|${pkg.stem}`);
    qls.add(pkg.proposedPermanentQlId);
    positions[pkg.correctIndex]! += 1;
    if (prototypeId === "SAP-CP008-PROT-COMPARE-ADDITIVE-ESTIMATES") relationClasses.add(pkg.canonicalAnswer);
    if (prototypeId === "SAP-CP008-PROT-OVER-UNDER-CLASS") overUnderClasses.add(pkg.canonicalAnswer);
    total += 1;
  }
  assert.equal(localStems.size, 100, `${prototypeId}: expected 100 distinct student-facing stems.`);
}

assert.equal(total, 1800);
assert.equal(payloads.size, 1800);
assert.equal(identities.size, 1800);
assert.equal(allStems.size, 1800);
assert.equal(SAP_CP008_CATALOGUE.length, 18);
assert.deepEqual([...qls].sort(), Array.from({ length: 18 }, (_, index) => `SAP-QL-${String(129 + index).padStart(3, "0")}`));
assert.deepEqual(positions, [450, 450, 450, 450]);
assert.ok(relationClasses.size >= 2, `Comparison family collapsed to ${[...relationClasses].join(", ")}.`);
assert.ok(overUnderClasses.has("Overestimate"));
assert.ok(overUnderClasses.has("Underestimate"));

console.log("SAP-CP-008 authority passed: 1,800 independently verified unique cases across SAP-QL-129..146, exact terms-first policy, additive bounds, inverse substitution, comparison/diagnosis coverage, 450 A/B/C/D positions each, and inactive lifecycle.");
