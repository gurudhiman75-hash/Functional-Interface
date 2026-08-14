import assert from "node:assert/strict";
import {
  SAP_CP010_PROTOTYPE_IDS,
  generateSapCp010E1Existing,
  generateSapCp010E1SuppliedRootScaling,
} from "./e1-runtime";

function fmt(v: number, scale: number): string {
  const s = String(v).padStart(scale + 1, "0");
  return scale === 0 ? s : `${s.slice(0, -scale)}.${s.slice(-scale)}`;
}

const payloads = new Set<string>();
const identities = new Set<string>();
let powerOnlyStates = 0;
for (const id of SAP_CP010_PROTOTYPE_IDS) {
  const stems = new Set<string>();
  for (let seed = 1; seed <= 100; seed += 1) {
    const q = generateSapCp010E1Existing(id, seed);
    assert.equal(q.validation.ok, true, `${id}:${seed}: ${q.validation.errors.join("; ")}`);
    assert.equal(new Set(q.options.map((o) => o.value)).size, 4);
    assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer);
    assert.equal(q.lifecycle.active, false);
    assert.equal(q.lifecycle.questionStudioDiscoverable, false);
    assert.ok(!stems.has(q.stem), `${id}:${seed}: duplicate stem`);
    assert.ok(!payloads.has(q.canonicalPayloadKey), `${id}:${seed}: duplicate payload`);
    assert.ok(!identities.has(q.generationIdentity), `${id}:${seed}: duplicate identity`);
    stems.add(q.stem); payloads.add(q.canonicalPayloadKey); identities.add(q.generationIdentity);
    if (id === SAP_CP010_PROTOTYPE_IDS[14]) {
      powerOnlyStates += 1;
      assert.equal(String(q.oracle.data.e1NearestMerge), "POWER_ONLY");
      assert.notEqual(String(q.oracle.data.kind), "ROOT");
      assert.equal(q.correctIndex, (seed - 1) % 4);
    }
  }
  assert.equal(stems.size, 100, `${id}: expected 100 unique stems`);
}
assert.equal(payloads.size, 1700);
assert.equal(identities.size, 1700);
assert.equal(powerOnlyStates, 100);

const suppliedStems = new Set<string>();
const suppliedPayloads = new Set<string>();
const positions = [0, 0, 0, 0];
let integerScale = 0, tenthScale = 0;
for (let seed = 1; seed <= 100; seed += 1) {
  const q = generateSapCp010E1SuppliedRootScaling(seed);
  const d = q.oracle.data;
  const n = Number(d.n), h = Number(d.suppliedHundredths), factor = Number(d.factor);
  const mode = String(d.scaleMode);
  let expected: string;
  if (mode === "INTEGER_FACTOR") {
    expected = fmt(h * factor, 2);
    assert.equal(String(d.target), String(n * factor * factor));
    integerScale += 1;
  } else {
    const thousandths = h * factor;
    const hundredths = Math.floor(thousandths / 10) + (thousandths % 10 >= 5 ? 1 : 0);
    expected = fmt(hundredths, 2);
    assert.equal(String(d.target), fmt(n * factor * factor, 2));
    tenthScale += 1;
  }
  assert.equal(q.validation.ok, true, `${seed}: ${q.validation.errors.join("; ")}`);
  assert.equal(q.canonicalAnswer, expected);
  assert.equal(q.options[q.correctIndex]?.value, expected);
  assert.equal(new Set(q.options.map((o) => o.value)).size, 4);
  assert.ok(!suppliedStems.has(q.stem));
  assert.ok(!suppliedPayloads.has(q.canonicalPayloadKey));
  suppliedStems.add(q.stem); suppliedPayloads.add(q.canonicalPayloadKey);
  positions[q.correctIndex]! += 1;
  assert.equal(q.lifecycle.active, false);
  assert.equal(q.lifecycle.publiclyPublishable, false);
}
assert.equal(suppliedStems.size, 100);
assert.deepEqual(positions, [25, 25, 25, 25]);
assert.equal(integerScale, 50);
assert.equal(tenthScale, 50);
console.log("SAP CP010 E1 authority passed: 1,700 merged existing states plus 100 supplied-root scaling states proven.");
