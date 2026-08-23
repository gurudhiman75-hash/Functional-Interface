import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { generateNumCp011Wave01 } from "../wave01/runtime.ts";
import { NUM_CP011_WAVE01_PROTOTYPE_IDS } from "../wave01/types.ts";
import { generateNumCp011Wave02 } from "../wave02/runtime.ts";
import { NUM_CP011_WAVE02_PROTOTYPE_IDS } from "../wave02/types.ts";
import { generateNumCp011Wave03 } from "../wave03/runtime.ts";
import { NUM_CP011_WAVE03_PROTOTYPE_IDS } from "../wave03/types.ts";

const allIds = [
  ...NUM_CP011_WAVE01_PROTOTYPE_IDS,
  ...NUM_CP011_WAVE02_PROTOTYPE_IDS,
  ...NUM_CP011_WAVE03_PROTOTYPE_IDS,
];

assert.equal(allIds.length, 13, `Expected 13 retained temporary authorities, received ${allIds.length}`);
assert.equal(new Set(allIds).size, 13, "Temporary authority IDs are not unique");
assert.deepEqual(
  allIds,
  Array.from({ length: 13 }, (_, index) => `NUM-CP011-PROT-${String(index + 1).padStart(3, "0")}`),
  "CP011 temporary authority sequence drift",
);

const generated = [
  ...NUM_CP011_WAVE01_PROTOTYPE_IDS.map((id, index) => generateNumCp011Wave01(id, 91 + index)),
  ...NUM_CP011_WAVE02_PROTOTYPE_IDS.map((id, index) => generateNumCp011Wave02(id, 121 + index)),
  ...NUM_CP011_WAVE03_PROTOTYPE_IDS.map((id, index) => generateNumCp011Wave03(id, 151 + index)),
];

for (const question of generated) {
  assert.equal(question.checkpointId, "NUM-CP-011", `${question.temporaryPrototypeId}: checkpoint drift`);
  assert.equal(question.packageId, "NUM-002", `${question.temporaryPrototypeId}: package drift`);
  assert.equal(question.canonicalAnswer, question.verifierAnswer, `${question.temporaryPrototypeId}: verifier disagreement`);
  assert.equal(question.lifecycle.active, false, `${question.temporaryPrototypeId}: active gate opened`);
  assert.equal(question.lifecycle.questionStudioDiscoverable, false, `${question.temporaryPrototypeId}: Question Studio gate opened`);
  assert.equal(question.lifecycle.questionBankWritable, false, `${question.temporaryPrototypeId}: Question Bank gate opened`);
  assert.equal(question.lifecycle.testEligible, false, `${question.temporaryPrototypeId}: test gate opened`);
  assert.equal(question.lifecycle.publiclyPublishable, false, `${question.temporaryPrototypeId}: public gate opened`);
  assert.ok(!("permanentQlId" in question), `${question.temporaryPrototypeId}: permanent QL leaked into discovery runtime`);
}

const recordPath = resolve(
  process.cwd(),
  "src/quant-v4/topics/Arithmetic/subtopics/NumberSystem/NUM-002/NUM-CP-011/NUM-CP-011-WAVE04-SATURATION-MERGE-SPLIT.md",
);
const record = readFileSync(recordPath, "utf8");

const requiredMarkers = [
  "13 retained solve authorities",
  "NUM-QL-213 .. NUM-QL-225",
  "proposed only",
  "Data sufficiency is a cross-topic reasoning/composition layer",
  "REASSIGN to CP008",
  "REASSIGN to CP005",
  "REASSIGN/HOLD under CP009 or CP014",
  "HOLD OUTSIDE CURRENT CP011 PERMANENT SCOPE",
  "Factorial as arrangement count",
  "No unresolved source-backed gap requires another CP011 solve engine",
];
for (const marker of requiredMarkers) {
  assert.ok(record.includes(marker), `Saturation record missing marker: ${marker}`);
}

assert.ok(!/Permanent QL allocation:\s*NUM-QL-/u.test(record), "Wave 04 must not allocate a permanent QL");

console.log(JSON.stringify({
  status: "PASS_NUM_CP011_WAVE04_SATURATION",
  retainedAuthorities: allIds.length,
  executableSamples: generated.length,
  proposedPermanentRange: "NUM-QL-213..NUM-QL-225",
  permanentQlAllocations: 0,
  representationQlInflation: false,
  dataSufficiencyReassignedToCompositionLayer: true,
  factorialRemainderOwner: "NUM-CP-008",
  factorialFactorCountOwner: "NUM-CP-005",
  lastNonZeroDigitOwner: "NUM-CP-009_OR_NUM-CP-014",
  binomialValuationStatus: "SOURCE_HOLD",
}, null, 2));
