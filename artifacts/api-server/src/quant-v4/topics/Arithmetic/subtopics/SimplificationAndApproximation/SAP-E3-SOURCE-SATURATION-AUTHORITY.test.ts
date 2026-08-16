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
      assert.equal(Number(q.canonicalAnswer), n(d.sixth,"sixth") + n(d.fourth,"fourth") + n(d.cube,"cube") + n(d.square,"square"));
      assert.equal(n(d.sixthRad,"sixthRad"), n(d.sixth,"sixth") ** 6);
      assert.equal(n(d.fourthRad,"fourthRad"), n(d.fourth,"fourth") ** 4);
      heterogeneous += 1;
    } else if (id === SAP_CP004_E3_DECIMAL_ROOT_QUOTIENT) {
      const d = q.oracle.data;
      assert.equal(n(d.numeratorRootMilli,"numRoot"), n(d.denominatorRootMilli,"denRoot") * n(d.ratio,"ratio"));
      assert.equal(Number(q.canonicalAnswer), n(d.ratio,"ratio"));
      decimalQuotient += 1;
    }
  }
  assert.equal(local.size, 100);
}
assert.equal(heterogeneous, 100);
assert.equal(decimalQuotient, 100);
assert.equal(cp004Stems.size, 200);

let powerChain = 0, powerRootChain = 0;
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
  q.oracle.data.mode === "POWER_CHAIN" ? powerChain++ : powerRootChain++;
  assert.equal(q.oracle.data.e3Disposition, "EXPAND_EXISTING_CP012_MIXED_SYNTHESIS_NO_NEW_QL");
}
assert.equal(cp012Stems.size, 100);
assert.equal(powerChain, 50); assert.equal(powerRootChain, 50);
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
  cp004: { heterogeneousExactRootStates: heterogeneous, decimalRootQuotientStates: decimalQuotient },
  cp012: { explicitPowerReverseStates: 100, powerChain, powerRootChain, answerPositions, maxDisplayedDrift },
  editorialPolish: { uniqueIntegerExactConclusionStates: 100 },
  qlDisposition: "NO_NEW_PERMANENT_QL; EXPAND_EXISTING_CP004_CP012_IDENTITIES",
  lifecycle: "INACTIVE",
}));
