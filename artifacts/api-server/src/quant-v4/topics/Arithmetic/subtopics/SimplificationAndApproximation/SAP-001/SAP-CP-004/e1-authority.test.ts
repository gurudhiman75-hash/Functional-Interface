import assert from "node:assert/strict";
import {
  SAP_CP004_PROTOTYPE_IDS,
  generateSapCp004E1Existing,
  generateSapCp004E1NestedAdditive,
} from "./e1-runtime";

const payloads = new Set<string>();
const identities = new Set<string>();
let decimalSquareRootStates = 0;
let decimalRootArithmeticStates = 0;

for (const id of SAP_CP004_PROTOTYPE_IDS) {
  const stems = new Set<string>();
  for (let seed = 1; seed <= 100; seed += 1) {
    const q = generateSapCp004E1Existing(id, seed);
    const visible = `${q.stem} ${q.canonicalAnswer} ${q.options.map((o) => o.value).join(" ")} ${q.explanation.coreConcept} ${q.explanation.steps.join(" ")} ${q.explanation.finalAnswer}`;
    assert.equal(q.validation.ok, true, `${id}:${seed}: ${q.validation.errors.join("; ")}`);
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options.map((o) => o.value)).size, 4);
    assert.equal(q.options.filter((o) => o.isCorrect).length, 1);
    assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer);
    assert.doesNotMatch(visible, /[√∛∜]/, `${id}:${seed}: raw radical leaked.`);
    assert.equal(q.lifecycle.active, false);
    assert.equal(q.lifecycle.questionStudioDiscoverable, false);
    assert.equal(q.lifecycle.questionBankWritable, false);
    assert.equal(q.lifecycle.testEligible, false);
    assert.equal(q.lifecycle.publiclyPublishable, false);
    assert.ok(!stems.has(q.stem), `${id}:${seed}: duplicate visible stem.`);
    assert.ok(!payloads.has(q.canonicalPayloadKey), `${id}:${seed}: duplicate payload.`);
    assert.ok(!identities.has(q.generationIdentity), `${id}:${seed}: duplicate identity.`);
    stems.add(q.stem);
    payloads.add(q.canonicalPayloadKey);
    identities.add(q.generationIdentity);
    if (id === "SAP-CP004-PROT-PERFECT-SQUARE-ROOT" && typeof q.oracle.data.decimalRootScaled === "number") {
      decimalSquareRootStates += 1;
      const r = Number(q.oracle.data.decimalRootScaled);
      assert.equal(Number(q.oracle.data.radicandScaled), r * r);
      assert.match(q.stem, /\\sqrt\{/);
    }
    if (id === "SAP-CP004-PROT-ROOT-MIXED-ARITHMETIC" && typeof q.oracle.data.decimalRootScaled === "number") {
      decimalRootArithmeticStates += 1;
      const r = Number(q.oracle.data.decimalRootScaled);
      assert.equal(Number(q.oracle.data.radicandScaled), r * r);
      assert.match(q.stem, /\\sqrt\{/);
    }
  }
  assert.equal(stems.size, 100, `${id}: expected 100 unique stems.`);
}

assert.equal(payloads.size, SAP_CP004_PROTOTYPE_IDS.length * 100);
assert.equal(identities.size, SAP_CP004_PROTOTYPE_IDS.length * 100);
assert.equal(decimalSquareRootStates, 25);
assert.equal(decimalRootArithmeticStates, 25);

const addendumStems = new Set<string>();
const addendumPayloads = new Set<string>();
const positions = [0, 0, 0, 0];
for (let seed = 1; seed <= 100; seed += 1) {
  const q = generateSapCp004E1NestedAdditive(seed);
  const d = q.oracle.data;
  const inner = Number(d.inner), middle = Number(d.middle), outer = Number(d.outer);
  const a = Number(d.a), b = Number(d.b), c = Number(d.c);
  assert.equal(q.validation.ok, true, `${seed}: ${q.validation.errors.join("; ")}`);
  assert.equal(inner * inner, c);
  assert.equal(middle * middle, b + inner);
  assert.equal(outer * outer, a + middle);
  assert.equal(Number(q.canonicalAnswer), outer);
  assert.match(q.stem, /\\sqrt\{.*\\sqrt\{.*\\sqrt\{/);
  assert.doesNotMatch(q.stem, /[√∛∜]/);
  assert.ok(!addendumStems.has(q.stem));
  assert.ok(!addendumPayloads.has(q.canonicalPayloadKey));
  addendumStems.add(q.stem);
  addendumPayloads.add(q.canonicalPayloadKey);
  positions[q.correctIndex]! += 1;
  assert.equal(q.lifecycle.active, false);
  assert.equal(q.lifecycle.questionStudioDiscoverable, false);
}
assert.equal(addendumStems.size, 100);
assert.deepEqual(positions, [25, 25, 25, 25]);
console.log("SAP CP004 E1 authority passed: 1,900 existing states remediated, 50 decimal-root expansion states and 100 nested-additive exact-radical states proven.");
