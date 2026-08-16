import assert from "node:assert/strict";
import {
  SAP_CP004_E3_CANDIDATE_IDS,
  SAP_CP004_E3_DECIMAL_ROOT_QUOTIENT,
  SAP_CP004_E3_HETEROGENEOUS_ROOT_CHAIN,
  generateSapCp004E3,
} from "./SAP-001/SAP-CP-004/e3-source-expansion";
import { generateSapCp012E3 } from "./SAP-002/SAP-CP-012/e3-source-expansion";
import { generateSapCp012E2 } from "./SAP-002/SAP-CP-012/runtime-release-e3";

function n(value: number | string | undefined, label: string): number {
  const x = Number(value);
  if (!Number.isFinite(x)) throw new Error(`Missing numeric value: ${label}`);
  return x;
}
function assertLifecycleOff(q: { lifecycle: { permanentQlId: null; active: false; questionStudioDiscoverable: false; questionBankWritable: false; testEligible: false; publiclyPublishable: false } }): void {
  assert.equal(q.lifecycle.permanentQlId, null);
  assert.equal(q.lifecycle.active, false);
  assert.equal(q.lifecycle.questionStudioDiscoverable, false);
  assert.equal(q.lifecycle.questionBankWritable, false);
  assert.equal(q.lifecycle.testEligible, false);
  assert.equal(q.lifecycle.publiclyPublishable, false);
}

const cp004Stems = new Set<string>();
let heterogeneous = 0, decimalQuotient = 0;
for (const id of SAP_CP004_E3_CANDIDATE_IDS) {
  const local = new Set<string>();
  for (let seed = 1; seed <= 100; seed += 1) {
    const q = generateSapCp004E3(id, seed);
    assert.equal(q.validation.ok, true, `${id}/${seed}: ${q.validation.errors.join("; ")}`);
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options.map(o => o.value)).size, 4);
    assert.equal(q.options.filter(o => o.isCorrect).length, 1);
    assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer);
    assert.doesNotMatch(`${q.stem} ${q.explanation.steps.join(" ")}`, /[√∛∜]/);
    assertLifecycleOff(q);
    assert.ok(!local.has(q.stem), `${id}/${seed}: duplicate local stem`);
    assert.ok(!cp004Stems.has(q.stem), `${id}/${seed}: duplicate E3 CP004 stem`);
    local.add(q.stem); cp004Stems.add(q.stem);
    if (id === SAP_CP004_E3_HETEROGENEOUS_ROOT_CHAIN) {
      const d = q.oracle.data;
      const sixth = n(d.sixth,"sixth"), fourth = n(d.fourth,"fourth"), cube = n(d.cube,"cube"), square = n(d.square,"square");
      const answer = sixth + fourth + cube + square;
      assert.equal(Number(q.canonicalAnswer), answer);
      assert.equal(n(d.sixthRad,"sixthRad"), sixth ** 6);
      assert.equal(n(d.fourthRad,"fourthRad"), fourth ** 4);
      const sixthAsCube = q.options.find(o => o.misconceptionId === "SIXTH_ROOT_AS_CUBE_ROOT");
      const fourthAsSquare = q.options.find(o => o.misconceptionId === "FOURTH_ROOT_AS_SQUARE_ROOT");
      const cubeDropped = q.options.find(o => o.misconceptionId === "CUBE_ROOT_TERM_DROPPED");
      assert.equal(Number(sixthAsCube?.value), answer - sixth + sixth ** 2, `${id}/${seed}: sixth-root misconception value mismatch`);
      assert.equal(Number(fourthAsSquare?.value), answer - fourth + fourth ** 2, `${id}/${seed}: fourth-root misconception value mismatch`);
      assert.equal(Number(cubeDropped?.value), answer - cube, `${id}/${seed}: cube-drop misconception value mismatch`);
      heterogeneous += 1;
    } else if (id === SAP_CP004_E3_DECIMAL_ROOT_QUOTIENT) {
      const d = q.oracle.data;
      const ratio = n(d.ratio,"ratio");
      assert.equal(n(d.numeratorRootMilli,"numRoot"), n(d.denominatorRootMilli,"denRoot") * ratio);
      assert.equal(Number(q.canonicalAnswer), ratio);
      const rawRatio = q.options.find(o => o.misconceptionId === "RADICAND_RATIO_NOT_ROOTED");
      assert.equal(Number(rawRatio?.value), ratio ** 2, `${id}/${seed}: radicand-ratio misconception value mismatch`);
      decimalQuotient += 1;
    }
  }
  assert.equal(local.size, 100);
}
assert.equal(heterogeneous, 100);
assert.equal(decimalQuotient, 100);
assert.equal(cp004Stems.size, 200);

let powerChain = 0, powerRootChain = 0, missingExponent = 0;
const cp012Stems = new Set<string>();
const answerPositions = [0,0,0,0];
let maxDisplayedDrift = 0;
for (let seed = 1; seed <= 100; seed += 1) {
  const q = generateSapCp012E3(seed);
  assert.equal(q.validation.ok, true, `CP012-E3/${seed}: ${q.validation.errors.join("; ")}`);
  assert.equal(q.options.length, 4);
  assert.equal(new Set(q.options.map(o => o.value)).size, 4);
  assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer);
  assert.doesNotMatch(q.stem, /[√∛∜]/);
  assertLifecycleOff(q);
  assert.ok(!cp012Stems.has(q.stem), `CP012-E3/${seed}: duplicate stem`); cp012Stems.add(q.stem);
  const actual = n(q.oracle.data.actualMissing_100000,"actualMissing") / 100000;
  const values = q.options.map(o => Number(o.value));
  const distances = values.map(v => Math.abs(v - actual));
  const best = Math.min(...distances);
  assert.equal(distances.filter(x => Math.abs(x - best) < 1e-9).length, 1, `CP012-E3/${seed}: tied nearest option`);
  assert.equal(distances[q.correctIndex], best, `CP012-E3/${seed}: keyed option is not nearest to displayed equation`);
  maxDisplayedDrift = Math.max(maxDisplayedDrift, Math.abs(Number(q.canonicalAnswer) - actual));
  answerPositions[q.correctIndex]! += 1;
  const mode = String(q.oracle.data.mode);
  if (mode === "POWER_CHAIN") {
    powerChain += 1;
    const exponent = n(q.oracle.data.missingExponent,"missingExponent");
    const reportExponent = q.options.find(o => o.misconceptionId === "REPORT_EXPONENT_NOT_POWER");
    assert.equal(Number(reportExponent?.value), exponent, `CP012-E3/${seed}: exponent-report distractor mismatch`);
  } else if (mode === "POWER_ROOT_CHAIN") {
    powerRootChain += 1;
    const exponent = n(q.oracle.data.missingExponent,"missingExponent");
    const reportExponent = q.options.find(o => o.misconceptionId === "REPORT_EXPONENT_NOT_POWER");
    assert.equal(Number(reportExponent?.value), exponent, `CP012-E3/${seed}: exponent-report distractor mismatch`);
  } else if (mode === "MISSING_EXPONENT") {
    missingExponent += 1;
    const answerExponent = n(q.oracle.data.answerExponent,"answerExponent");
    const c = n(q.oracle.data.c,"c");
    assert.equal(Number(q.canonicalAnswer), answerExponent);
    const ignoreOuter = q.options.find(o => o.misconceptionId === "IGNORE_OUTER_DENOMINATOR_POWER");
    assert.equal(Number(ignoreOuter?.value), answerExponent + c + 1, `CP012-E3/${seed}: outer-power distractor mismatch`);
  } else throw new Error(`CP012-E3/${seed}: unknown mode ${mode}`);
  assert.equal(q.oracle.data.e3Disposition, "EXPAND_EXISTING_CP012_MIXED_SYNTHESIS_NO_NEW_QL");
}
assert.equal(cp012Stems.size, 100);
assert.equal(powerChain, 33); assert.equal(powerRootChain, 34); assert.equal(missingExponent, 33);
assert.deepEqual(answerPositions, [25,25,25,25]);

for (let seed = 1; seed <= 100; seed += 1) {
  const q = generateSapCp012E2("CP012-E2-UNIQUE-INTEGER-WITHIN-TOLERANCE", seed);
  assert.equal(q.validation.ok, true);
  assert.equal(q.explanation.finalAnswer, `Therefore, ? = ${q.canonicalAnswer}.`);
  assert.doesNotMatch(q.explanation.finalAnswer, /≈/);
  const payload = JSON.parse(q.canonicalPayloadKey);
  assert.equal(payload.stem, q.stem);
  assertLifecycleOff(q);
}

console.log(JSON.stringify({
  authority: "SAP-E3-SOURCE-SATURATION",
  cp004: { heterogeneousExactRootStates: heterogeneous, decimalRootQuotientStates: decimalQuotient, misconceptionSemanticProof: true },
  cp012: { explicitPowerReverseStates: 100, powerChain, powerRootChain, missingExponent, answerPositions, maxDisplayedDrift, misconceptionSemanticProof: true },
  editorialPolish: { uniqueIntegerExactConclusionStates: 100 },
  qlDisposition: "NO_NEW_PERMANENT_QL; EXPAND_EXISTING_CP004_CP012_IDENTITIES",
  lifecycle: "INACTIVE",
}));
