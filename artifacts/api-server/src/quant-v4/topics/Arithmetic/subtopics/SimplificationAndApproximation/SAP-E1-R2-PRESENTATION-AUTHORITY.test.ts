import assert from "node:assert/strict";
import { SAP_CP010_E1_R2_STRUCTURES, generateSapCp010E1R2 } from "./SAP-002/SAP-CP-010/e1-r2-exam-runtime-release-v4";

const stems = new Set<string>();
const offsetSignatures = new Set<string>();
let unguided = 0;
let supplied = 0;
let mediumSuppliedQuotients = 0;

for (const id of SAP_CP010_E1_R2_STRUCTURES) {
  const local = new Set<string>();
  for (let seed = 1; seed <= 100; seed += 1) {
    const q = generateSapCp010E1R2(id, seed);
    assert.equal(q.validation.ok, true, `${id}:${seed}: ${q.validation.errors.join("; ")}`);
    assert.equal(q.profile, "BANK");
    assert.ok(q.decisionCount >= 2);
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options.map(o => o.value)).size, 4);
    assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer);
    assert.doesNotMatch(q.stem, /\bround\b|For estimation, take|Using cancellation|using suitable approximation|nearest whole number/i);
    assert.doesNotMatch(q.stem, /[√∛∜]/);
    assert.doesNotMatch(q.options.map(o => o.value).join(" "), /Alternative\s+\d+/i);
    assert.equal(q.lifecycle.permanentQlId, null);
    assert.equal(q.lifecycle.active, false);
    assert.equal(q.lifecycle.questionStudioDiscoverable, false);
    assert.equal(q.lifecycle.questionBankWritable, false);
    assert.equal(q.lifecycle.testEligible, false);
    assert.equal(q.lifecycle.publiclyPublishable, false);
    assert.ok(!local.has(q.stem), `${id}:${seed}: duplicate release stem.`);
    assert.ok(!stems.has(q.stem), `${id}:${seed}: duplicate release stem across structures.`);
    local.add(q.stem);
    stems.add(q.stem);
    if (id.includes("APPROX-")) {
      unguided += 1;
      const d = q.oracle.data;
      const signature = [d.x, d.y, d.z, d.w, d.displayRoot, d.displayMultiplier, d.displayOffset, d.displayCube, d.displayBase, d.displayDivisor, d.displaySquare]
        .filter(v => v !== undefined)
        .join("|");
      offsetSignatures.add(signature);
    } else {
      supplied += 1;
    }
    if (id === "CP010-R2-SUPPLIED-ROOT-QUOTIENT") {
      assert.equal(q.difficulty, "MEDIUM");
      mediumSuppliedQuotients += 1;
    }
  }
  assert.equal(local.size, 100);
}

assert.equal(stems.size, 1200);
assert.equal(unguided, 600);
assert.equal(supplied, 600);
assert.equal(mediumSuppliedQuotients, 100);
assert.ok(offsetSignatures.size >= 300, `Bank display variation is too narrow: ${offsetSignatures.size} signatures.`);
console.log(JSON.stringify({
  authority: "SAP-E1-R2-BANK-PRESENTATION-V4",
  states: 1200,
  unguided,
  supplied,
  mediumSuppliedQuotients,
  offsetSignatures: offsetSignatures.size,
}));
