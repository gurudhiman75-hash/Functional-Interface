import assert from "node:assert/strict";
import "./authority-final.test";
import {
  SAP_CP010_PROTOTYPE_IDS,
  generateSapCp010,
} from "./certified-runtime";

function nearestSqrt(n: number): number {
  let k = 0;
  while ((k + 1) * (k + 1) <= n) k += 1;
  if (k * k === n) return k;
  return 4 * n < (2 * k + 1) ** 2 ? k : k + 1;
}

const payloads = new Set<string>();
const identities = new Set<string>();
const positions = [0, 0, 0, 0];

for (const prototypeId of SAP_CP010_PROTOTYPE_IDS) {
  const stems = new Set<string>();
  for (let seed = 1; seed <= 100; seed += 1) {
    const q = generateSapCp010(prototypeId, seed);
    assert.equal(q.validation.ok, true, `${prototypeId}:${seed}: ${q.validation.errors.join("; ")}`);
    assert.ok(!stems.has(q.stem), `${prototypeId}:${seed}: duplicate visible stem`);
    assert.ok(!payloads.has(q.canonicalPayloadKey), `${prototypeId}:${seed}: duplicate payload`);
    assert.ok(!identities.has(q.generationIdentity), `${prototypeId}:${seed}: duplicate identity`);
    stems.add(q.stem);
    payloads.add(q.canonicalPayloadKey);
    identities.add(q.generationIdentity);
    positions[q.correctIndex]! += 1;
    if (prototypeId === SAP_CP010_PROTOTYPE_IDS[10]) {
      const d = q.oracle.data;
      assert.equal(nearestSqrt(Number(d.n)), Number(d.numeratorRoot));
      assert.equal(nearestSqrt(Number(d.d)), Number(d.divisorRoot));
      assert.notEqual(Number(d.divisorRoot), 0);
      assert.equal(Number(q.canonicalAnswer), Number(d.numeratorRoot) / Number(d.divisorRoot));
    }
    if (prototypeId === SAP_CP010_PROTOTYPE_IDS[14] && q.oracle.data.kind === "ROOT") {
      assert.equal(Number(q.canonicalAnswer), nearestSqrt(Number(q.oracle.data.n)));
    }
  }
  assert.equal(stems.size, 100, `${prototypeId}: expected 100 unique visible stems`);
}

assert.equal(payloads.size, 1700);
assert.equal(identities.size, 1700);
assert.deepEqual(positions, [425, 425, 425, 425]);

console.log("SAP-CP-010 certified authority passed: the final 1,700-state surface preserves mathematical proof and removes late-seed root-quotient/nearest-option repetition.");
