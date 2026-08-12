import assert from "node:assert/strict";
import "./full-review-authority.test";
import "./authority-v2.test";
import {
  SAP_CP008_PROTOTYPE_IDS,
  generateSapCp008ReviewRecords,
  reviewCountForPrototype,
} from "./full-review-v2";

const records = generateSapCp008ReviewRecords();
assert.equal(records.length, 300);
assert.equal(new Set(records.map((record) => record.questionId)).size, 300);
assert.equal(new Set(records.map((record) => record.canonicalPayloadKey)).size, 300);

const counts = new Map<string, number>();
const positions = [0, 0, 0, 0];
const relations = new Set<string>();
const overUnder = new Set<string>();
const openings = new Set<string>();
const unitsByPrototype = new Map<string, Set<number>>();
let decimalCount = 0;
let compatibleCount = 0;
let inverseCount = 0;
let boundCount = 0;

for (let index = 0; index < records.length; index += 1) {
  const record = records[index]!;
  const d = record.oracle.data;
  assert.equal(record.validation.ok, true, `${record.questionId}: ${record.validation.errors.join("; ")}`);
  assert.equal(record.options.length, 4);
  assert.equal(new Set(record.options.map((option) => option.value)).size, 4);
  assert.equal(record.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(record.options[record.correctIndex]?.value, record.canonicalAnswer);
  assert.ok(/round/i.test(record.stem) && /(first|before|when rounded)/i.test(record.stem), `${record.questionId}: policy stage is not explicit.`);
  assert.doesNotMatch(record.stem, /significant figure/i);
  assert.equal(record.lifecycle.permanentQlId, null);
  assert.equal(record.lifecycle.active, false);
  assert.equal(record.lifecycle.questionStudioDiscoverable, false);
  assert.equal(record.lifecycle.questionBankWritable, false);
  assert.equal(record.lifecycle.testEligible, false);
  assert.equal(record.lifecycle.publiclyPublishable, false);

  counts.set(record.prototypeId, (counts.get(record.prototypeId) ?? 0) + 1);
  positions[record.correctIndex]! += 1;
  if (index >= 2) assert.ok(!(records[index - 2]!.correctIndex === records[index - 1]!.correctIndex && records[index - 1]!.correctIndex === record.correctIndex), `three-position streak at ${index}`);

  if (record.prototypeId === "SAP-CP008-PROT-COMPARE-ADDITIVE-ESTIMATES") relations.add(record.canonicalAnswer);
  if (record.prototypeId === "SAP-CP008-PROT-OVER-UNDER-CLASS") overUnder.add(record.canonicalAnswer);
  if (typeof d.unit === "number") {
    const set = unitsByPrototype.get(record.prototypeId) ?? new Set<number>();
    set.add(Number(d.unit));
    unitsByPrototype.set(record.prototypeId, set);
  }

  if (record.prototypeId === "SAP-CP008-PROT-APPROX-INTEGER-SUM") openings.add(record.stem.split(". ")[0]!);
  if (record.prototypeId === "SAP-CP008-PROT-DECIMAL-SUM" || record.prototypeId === "SAP-CP008-PROT-DECIMAL-DIFFERENCE") {
    decimalCount += 1;
    assert.doesNotMatch(record.canonicalAnswer, /\.0$/);
    for (const option of record.options) assert.doesNotMatch(option.value, /\.0$/);
  }
  if (record.prototypeId === "SAP-CP008-PROT-COMPATIBLE-ADDENDS") {
    compatibleCount += 1;
    assert.equal(record.canonicalAnswer, `${d.targetA} and ${d.targetB}`);
    assert.doesNotMatch(record.canonicalAnswer, /=/);
    assert.match(record.stem, /Which pair should replace the two numbers/i);
  }
  if (record.prototypeId === "SAP-CP008-PROT-MISSING-ADDEND-APPROX-EQUALITY" || record.prototypeId === "SAP-CP008-PROT-MISSING-SUBTRAHEND-APPROX-EQUALITY") {
    inverseCount += 1;
    assert.match(record.stem, /what is the rounded value of □/i);
    assert.doesNotMatch(record.stem, /must □ contribute/i);
  }
  if (record.prototypeId === "SAP-CP008-PROT-SUM-ROUNDING-BOUNDS" || record.prototypeId === "SAP-CP008-PROT-DIFFERENCE-ROUNDING-BOUNDS") {
    boundCount += 1;
    assert.match(record.stem, /^Two positive numbers, when rounded/i);
  }
  if (record.prototypeId === "SAP-CP008-PROT-DIVIDE-ADD-ADDITIVE-DOMINANT") {
    assert.match(record.stem, /nearest multiple of (20|50)/i);
  }
}

for (const prototypeId of SAP_CP008_PROTOTYPE_IDS) assert.equal(counts.get(prototypeId), reviewCountForPrototype(prototypeId), `${prototypeId}: wrong editorial review quota.`);
assert.deepEqual(positions, [75, 75, 75, 75]);
assert.deepEqual([...relations].sort(), ["A < B", "A = B", "A > B"]);
assert.deepEqual([...overUnder].sort(), ["Overestimate", "Underestimate"]);
assert.ok(openings.size >= 4, `Selected review still has repetitive direct-policy wording: ${openings.size} openings.`);
assert.equal(decimalCount, 34);
assert.equal(compatibleCount, 17);
assert.equal(inverseCount, 34);
assert.equal(boundCount, 32);
for (const prototypeId of [
  "SAP-CP008-PROT-APPROX-INTEGER-SUM",
  "SAP-CP008-PROT-APPROX-INTEGER-DIFFERENCE",
  "SAP-CP008-PROT-SUM-ROUNDING-BOUNDS",
  "SAP-CP008-PROT-DIFFERENCE-ROUNDING-BOUNDS",
]) assert.deepEqual([...(unitsByPrototype.get(prototypeId) ?? new Set())].sort((a,b)=>a-b), [10, 100]);

console.log("SAP-CP-008 editorial full-review authority passed: inherited independent mathematics plus 300 remediated unique questions, 18 quotas, 75 A/B/C/D, no streak, varied explicit policy wording, natural integer decimal answers, cleaner compatible/inverse/bound surfaces, full relation/over-under coverage and inactive lifecycle.");
