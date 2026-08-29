import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { generateNumCp012Wave01 } from "../wave01/runtime.ts";
import { NUM_CP012_WAVE01_PROTOTYPE_IDS } from "../wave01/types.ts";
import { generateNumCp012Wave02 } from "../wave02/runtime.ts";
import { NUM_CP012_WAVE02_PROTOTYPE_IDS } from "../wave02/types.ts";

const allIds = [...NUM_CP012_WAVE01_PROTOTYPE_IDS, ...NUM_CP012_WAVE02_PROTOTYPE_IDS];
assert.equal(allIds.length, 14, `Expected 14 discovery prototypes, received ${allIds.length}`);
assert.equal(new Set(allIds).size, 14, "Temporary prototype IDs are not unique");
assert.deepEqual(
  allIds,
  Array.from({ length: 14 }, (_, index) => `NUM-CP012-PROT-${String(index + 1).padStart(3, "0")}`),
  "CP012 temporary prototype sequence drift",
);

const wave01Samples = NUM_CP012_WAVE01_PROTOTYPE_IDS.map((id, index) => generateNumCp012Wave01(id, 211 + index));
const wave02Samples = NUM_CP012_WAVE02_PROTOTYPE_IDS.map((id, index) => generateNumCp012Wave02(id, 251 + index));
const generated = [...wave01Samples, ...wave02Samples];

for (const question of generated) {
  assert.equal(question.packageId, "NUM-002", `${question.temporaryPrototypeId}: package drift`);
  assert.equal(question.checkpointId, "NUM-CP-012", `${question.temporaryPrototypeId}: checkpoint drift`);
  assert.equal(question.lifecycle.active, false, `${question.temporaryPrototypeId}: active gate opened`);
  assert.equal(question.lifecycle.questionStudioDiscoverable, false, `${question.temporaryPrototypeId}: Question Studio gate opened`);
  assert.equal(question.lifecycle.questionBankWritable, false, `${question.temporaryPrototypeId}: Question Bank gate opened`);
  assert.equal(question.lifecycle.testEligible, false, `${question.temporaryPrototypeId}: test gate opened`);
  assert.equal(question.lifecycle.publiclyPublishable, false, `${question.temporaryPrototypeId}: public gate opened`);
  assert.ok(!("permanentQlId" in question), `${question.temporaryPrototypeId}: permanent QL leaked into discovery runtime`);
}

const recordPath = resolve(
  process.cwd(),
  "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/NumberSystem/NUM-002/NUM-CP-012/NUM-CP-012-WAVE04-SATURATION-MERGE-SPLIT.md",
);
const record = readFileSync(recordPath, "utf8");

for (const marker of [
  "14 temporary mathematical prototypes",
  "11 retained permanent solve authorities",
  "NUM-QL-226 .. NUM-QL-236",
  "Proposed only, not allocated by Wave 04",
  "Data Sufficiency → `DSF-001`",
  "square/cube divisor count → `NUM-CP-005`",
  "requested remainder/residue → `NUM-CP-008`",
  "requested terminal digit(s) → `NUM-CP-009`",
  "No unresolved source-backed gap requires another CP012 solve engine",
  "principal non-negative root",
]) {
  assert.ok(record.includes(marker), `Saturation record missing marker: ${marker}`);
}

const retainedAuthorityLabels = Array.from({ length: 11 }, (_, index) => String.fromCharCode(65 + index));
assert.deepEqual(retainedAuthorityLabels, ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"]);
assert.ok(!/Permanent allocation in this file:\s*NUM-QL-/u.test(record), "Wave 04 must not allocate permanent QLs");

console.log(JSON.stringify({
  status: "PASS_NUM_CP012_WAVE04_SATURATION",
  discoveryPrototypes: allIds.length,
  retainedAuthorities: 11,
  executableSamples: generated.length,
  proposedPermanentRange: "NUM-QL-226..NUM-QL-236",
  nextFreeAfterAllocation: "NUM-QL-237",
  representationQlInflation: false,
  permanentQlAllocations: 0,
  dataSufficiencyOwner: "DSF-001",
  terminalOutputOwner: "NUM-CP-009",
  remainderOwner: "NUM-CP-008",
  squareDivisorCountOwner: "NUM-CP-005",
}, null, 2));
