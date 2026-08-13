import assert from "node:assert/strict";
import "./authority-release.test";
import { SAP_CP010_PROTOTYPE_IDS } from "./release-runtime";
import { generateSapCp010ReviewRecords } from "./full-review-release";

const records = generateSapCp010ReviewRecords();
assert.equal(records.length, 300);
assert.equal(new Set(records.map((r) => r.questionId)).size, 300);
assert.equal(new Set(records.map((r) => r.canonicalPayloadKey)).size, 300);
assert.equal(new Set(records.map((r) => r.generationIdentity)).size, 300);
assert.equal(new Set(records.map((r) => r.prototypeId)).size, 17);

const positions = [0, 0, 0, 0];
const counts = new Map<string, number>();
const kinds = new Set<string>();
const relations = new Set<string>();
const percentPowerExponents = new Set<number>();
const missingRadicandSides = new Set<string>();
const inversePowerBranches = new Set<string>();
let run = 1;
let maxRun = 1;

records.forEach((r, i) => {
  counts.set(r.prototypeId, (counts.get(r.prototypeId) ?? 0) + 1);
  positions[r.correctIndex]! += 1;
  assert.equal(r.validation.ok, true, `${r.questionId}: ${r.validation.errors.join("; ")}`);
  assert.equal(r.options.length, 4);
  assert.equal(new Set(r.options.map((o) => o.value)).size, 4);
  assert.ok(r.stem.length <= 220);
  assert.ok(r.explanation.steps.length >= 2 && r.explanation.steps.length <= 3);
  const visible = `${r.stem} ${r.canonicalAnswer} ${r.options.map((o) => o.value).join(" ")} ${r.explanation.coreConcept} ${r.explanation.steps.join(" ")}`;
  assert.doesNotMatch(visible, /-?\d+\.\d{6,}/);
  assert.doesNotMatch(r.stem, /the original number was (?:above|below) its rounded value/i);
  assert.equal(r.lifecycle.active, false);
  assert.equal(r.lifecycle.questionStudioDiscoverable, false);
  assert.equal(r.lifecycle.questionBankWritable, false);
  assert.equal(r.lifecycle.testEligible, false);
  assert.equal(r.lifecycle.publiclyPublishable, false);

  if (r.prototypeId === SAP_CP010_PROTOTYPE_IDS[7]) {
    percentPowerExponents.add(Number(r.oracle.data.exponent));
  }
  if (r.prototypeId === SAP_CP010_PROTOTYPE_IDS[12]) {
    missingRadicandSides.add(String(r.oracle.data.side));
  }
  if (r.prototypeId === SAP_CP010_PROTOTYPE_IDS[13]) {
    inversePowerBranches.add(`${r.oracle.data.exponent}:${r.oracle.data.side}`);
  }
  if (r.prototypeId === SAP_CP010_PROTOTYPE_IDS[14]) kinds.add(String(r.oracle.data.kind));
  if (r.prototypeId === SAP_CP010_PROTOTYPE_IDS[15]) relations.add(r.canonicalAnswer);

  if (i > 0 && records[i - 1]!.correctIndex === r.correctIndex) {
    run += 1;
    maxRun = Math.max(maxRun, run);
  } else run = 1;
});

SAP_CP010_PROTOTYPE_IDS.forEach((id, index) => assert.equal(counts.get(id), index < 11 ? 18 : 17));
assert.deepEqual(positions, [75, 75, 75, 75]);
assert.ok(maxRun < 3);
assert.deepEqual([...percentPowerExponents].sort(), [2, 3]);
assert.deepEqual([...missingRadicandSides].sort(), ["ABOVE", "BELOW"]);
assert.deepEqual([...inversePowerBranches].sort(), ["2:ABOVE", "2:BELOW", "3:ABOVE", "3:BELOW"]);
assert.deepEqual([...kinds].sort(), ["POWER", "ROOT"]);
assert.deepEqual([...relations].sort(), ["A < B", "A = B", "A > B"].sort());

console.log("SAP-CP-010 release 300-review passed: 17 identities, exact 75/75/75/75 answers, stratified hidden-submode coverage, exam-ready presentation, both special-form kinds, all comparison relations and no 3-position streak.");
