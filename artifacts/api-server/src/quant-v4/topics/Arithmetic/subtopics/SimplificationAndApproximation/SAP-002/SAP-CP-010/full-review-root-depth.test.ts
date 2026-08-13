import assert from "node:assert/strict";
import "./authority-root-depth.test";
import { SAP_CP010_PROTOTYPE_IDS } from "./root-depth-final-runtime";
import { generateSapCp010RootDepthReviewRecords } from "./full-review-root-depth-v2";

const records = generateSapCp010RootDepthReviewRecords();
assert.equal(records.length, 300);
assert.equal(new Set(records.map((r) => r.canonicalPayloadKey)).size, 300);
assert.equal(new Set(records.map((r) => r.generationIdentity)).size, 300);
assert.equal(new Set(records.map((r) => r.prototypeId)).size, 17);
const positions = [0, 0, 0, 0];
const bands = new Map<number, Set<number>>();
let rawRadicals = 0;
let typesetRoots = 0;
for (const r of records) {
  const mode = SAP_CP010_PROTOTYPE_IDS.indexOf(r.prototypeId);
  positions[r.correctIndex]! += 1;
  assert.equal(r.validation.ok, true);
  const visible = `${r.stem} ${r.canonicalAnswer} ${r.options.map((o) => o.value).join(" ")} ${r.explanation.steps.join(" ")}`;
  if (/[√∛∜]/.test(visible)) rawRadicals += 1;
  if (/\\sqrt/.test(visible)) typesetRoots += 1;
  if (typeof r.oracle.data.band === "number") {
    bands.set(mode, bands.get(mode) ?? new Set<number>());
    bands.get(mode)!.add(Number(r.oracle.data.band));
  }
}
assert.deepEqual(positions, [75, 75, 75, 75]);
assert.equal(rawRadicals, 0);
for (const mode of [0, 1, 2, 16]) assert.deepEqual([...(bands.get(mode) ?? new Set())].sort(), [0, 1, 2, 3, 4]);
for (const mode of [3, 4]) assert.deepEqual([...(bands.get(mode) ?? new Set())].sort(), [0, 1, 2, 3]);
assert.ok(typesetRoots >= 150);
console.log("SAP-CP-010 root-depth 300 review passed.");
