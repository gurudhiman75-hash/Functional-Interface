import assert from "node:assert/strict";
import { SAP_CP012_E2_STRUCTURES, generateSapCp012E2 } from "./SAP-002/SAP-CP-012/runtime-release";

const stems = new Set<string>();
let missingAddend = 0;
let maxAbsoluteDrift = 0;
for (const id of SAP_CP012_E2_STRUCTURES) {
  const local = new Set<string>();
  for (let seed = 1; seed <= 100; seed += 1) {
    const q = generateSapCp012E2(id, seed);
    assert.equal(q.validation.ok, true, `${id}/${seed}: ${q.validation.errors.join("; ")}`);
    assert.equal(q.checkpointId, "SAP-CP-012");
    assert.equal(q.profile, "BANK");
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options.map(o => o.value)).size, 4);
    assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer);
    assert.equal(q.lifecycle.permanentQlId, null);
    assert.equal(q.lifecycle.active, false);
    assert.equal(q.lifecycle.questionStudioDiscoverable, false);
    assert.equal(q.lifecycle.questionBankWritable, false);
    assert.equal(q.lifecycle.testEligible, false);
    assert.equal(q.lifecycle.publiclyPublishable, false);
    assert.doesNotMatch(q.stem, /[√∛∜]/);
    assert.ok(!local.has(q.stem), `${id}/${seed}: duplicate release stem within family`);
    assert.ok(!stems.has(q.stem), `${id}/${seed}: duplicate release stem across CP012`);
    local.add(q.stem); stems.add(q.stem);

    if (id === "CP012-E2-MISSING-ADDEND-MIXED") {
      missingAddend += 1;
      const d = q.oracle.data;
      const exact = Number(d.x100) / 100 * (Number(d.y100) / 100) + Number(d.z100) / 100 - Number(d.w100) / 100;
      const answer = Number(q.canonicalAnswer);
      const drift = Math.abs(exact - answer);
      maxAbsoluteDrift = Math.max(maxAbsoluteDrift, drift);
      assert.ok(drift < 1.5, `${id}/${seed}: displayed equation drifts too far from intended answer (${drift})`);
      const distances = q.options.map(o => Math.abs(Number(o.value) - exact));
      const best = Math.min(...distances);
      assert.equal(distances.filter(x => Math.abs(x - best) < 1e-10).length, 1, `${id}/${seed}: displayed equation has tied nearest option`);
      assert.equal(distances[q.correctIndex], best, `${id}/${seed}: intended answer is not nearest to displayed equation`);
    }
  }
  assert.equal(local.size, 100);
}
assert.equal(stems.size, 1200);
assert.equal(missingAddend, 100);
console.log(JSON.stringify({ authority: "SAP-E2-CP012-RELEASE-REALISM-V2", states: 1200, missingAddendStates: missingAddend, maxMissingAddendAbsoluteDrift: maxAbsoluteDrift, lifecycle: "INACTIVE" }));
