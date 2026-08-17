import assert from "node:assert/strict";
import "./authority.test";
import { SAP_CP010_PROTOTYPE_IDS } from "./exam-runtime";
import { generateSapCp010ReviewRecords } from "./full-review";

const records = generateSapCp010ReviewRecords();
assert.equal(records.length, 300);
assert.equal(new Set(records.map((r) => r.questionId)).size, 300);
assert.equal(new Set(records.map((r) => r.canonicalPayloadKey)).size, 300);
assert.equal(new Set(records.map((r) => r.generationIdentity)).size, 300);
assert.equal(new Set(records.map((r) => r.prototypeId)).size, 17);

const positions = [0, 0, 0, 0];
const counts = new Map<string, number>();
const nearestKinds = new Set<string>();
const compareRelations = new Set<string>();
let sameRun = 1;
let maxRun = 1;

for (let i = 0; i < records.length; i += 1) {
  const r = records[i]!;
  counts.set(r.prototypeId, (counts.get(r.prototypeId) ?? 0) + 1);
  positions[r.correctIndex]! += 1;
  assert.equal(r.validation.ok, true, `${r.questionId}: ${r.validation.errors.join("; ")}`);
  assert.equal(r.options.length, 4);
  assert.equal(new Set(r.options.map((o) => o.value)).size, 4);
  assert.ok(r.stem.length <= 220);
  assert.ok(r.explanation.steps.length >= 2 && r.explanation.steps.length <= 3);
  const studentText = `${r.stem} ${r.canonicalAnswer} ${r.options.map((o) => o.value).join(" ")} ${r.explanation.coreConcept} ${r.explanation.steps.join(" ")} ${r.explanation.verification.join(" ")}`;
  assert.doesNotMatch(studentText, /oracle|runtime|prototype|canonical|internal|guard|machine policy|newton|taylor|logarithmic interpolation|binomial series/i);
  assert.doesNotMatch(studentText, /-?\d+\.\d{6,}/);
  assert.equal(r.lifecycle.active, false);
  assert.equal(r.lifecycle.questionStudioDiscoverable, false);
  assert.equal(r.lifecycle.questionBankWritable, false);
  assert.equal(r.lifecycle.testEligible, false);
  assert.equal(r.lifecycle.publiclyPublishable, false);
  if (r.prototypeId === SAP_CP010_PROTOTYPE_IDS[14]) nearestKinds.add(String(r.oracle.data.kind));
  if (r.prototypeId === SAP_CP010_PROTOTYPE_IDS[15]) compareRelations.add(r.canonicalAnswer);
  if (i > 0 && records[i - 1]!.correctIndex === r.correctIndex) {
    sameRun += 1;
    maxRun = Math.max(maxRun, sameRun);
  } else sameRun = 1;
}

SAP_CP010_PROTOTYPE_IDS.forEach((id, index) => assert.equal(counts.get(id), index < 11 ? 18 : 17));
assert.deepEqual(positions, [75, 75, 75, 75]);
assert.ok(maxRun < 3);
assert.deepEqual([...nearestKinds].sort(), ["POWER", "ROOT"]);
assert.deepEqual([...compareRelations].sort(), ["A < B", "A = B", "A > B"].sort());

console.log("SAP-CP-010 300-review passed: 17 identities, exact 75/75/75/75 answer balance, both nearest-option kinds, all comparison relations and no 3-position streak.");
