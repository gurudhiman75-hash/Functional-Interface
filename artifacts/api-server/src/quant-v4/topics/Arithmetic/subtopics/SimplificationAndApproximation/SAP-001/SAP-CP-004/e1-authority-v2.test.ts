import assert from "node:assert/strict";
import { SAP_CP004_PROTOTYPE_IDS } from "./final-runtime";
import { generateSapCp004E1Existing, generateSapCp004E1NestedAdditive } from "./e1-runtime";
import { generateSapCp004E1SquareRoot, generateSapCp004E1RootArithmetic } from "./e1-root-wrapper";

let checkedExisting = 0;
for (const id of SAP_CP004_PROTOTYPE_IDS) {
  if (id === "SAP-CP004-PROT-PERFECT-SQUARE-ROOT" || id === "SAP-CP004-PROT-ROOT-MIXED-ARITHMETIC") continue;
  for (let seed = 1; seed <= 100; seed += 1) {
    const q = generateSapCp004E1Existing(id, seed);
    const visible = `${q.stem} ${q.options.map(o => o.value).join(" ")} ${q.explanation.steps.join(" ")}`;
    assert.equal(q.validation.ok, true, `${id}:${seed}: ${q.validation.errors.join("; ")}`);
    assert.doesNotMatch(visible, /[√∛∜]/);
    assert.equal(q.lifecycle.active, false);
    checkedExisting += 1;
  }
}
assert.equal(checkedExisting, 1700);

for (const generator of [generateSapCp004E1SquareRoot, generateSapCp004E1RootArithmetic]) {
  const stems = new Set<string>();
  let decimals = 0;
  for (let seed = 1; seed <= 100; seed += 1) {
    const q = generator(seed, (seed - 1) % 4);
    assert.equal(q.validation.ok, true);
    assert.equal(new Set(q.options.map(o => o.value)).size, 4);
    assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer);
    assert.ok(!stems.has(q.stem), `${q.prototypeId}:${seed}: duplicate E1 root stem`);
    stems.add(q.stem);
    if (typeof q.oracle.data.decimalRootScaled === "number") {
      const r = Number(q.oracle.data.decimalRootScaled);
      assert.equal(Number(q.oracle.data.radicandScaled), r * r);
      decimals += 1;
    }
    assert.equal(q.lifecycle.active, false);
  }
  assert.equal(stems.size, 100);
  assert.equal(decimals, 25);
}

const nested = new Set<string>();
const positions = [0, 0, 0, 0];
for (let seed = 1; seed <= 100; seed += 1) {
  const q = generateSapCp004E1NestedAdditive(seed);
  const d = q.oracle.data;
  assert.equal(Number(d.inner) ** 2, Number(d.c));
  assert.equal(Number(d.middle) ** 2, Number(d.b) + Number(d.inner));
  assert.equal(Number(d.outer) ** 2, Number(d.a) + Number(d.middle));
  assert.ok(!nested.has(q.stem));
  nested.add(q.stem);
  positions[q.correctIndex] += 1;
}
assert.equal(nested.size, 100);
assert.deepEqual(positions, [25, 25, 25, 25]);
console.log("SAP CP004 E1 V2 passed: frozen baseline isolated, 200 material root states and 100 nested-additive states proven.");
