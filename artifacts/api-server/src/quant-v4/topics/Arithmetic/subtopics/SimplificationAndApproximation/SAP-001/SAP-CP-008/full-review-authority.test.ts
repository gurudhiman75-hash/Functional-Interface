import assert from "node:assert/strict";
import {
  SAP_CP008_PROTOTYPE_IDS,
  generateSapCp008ReviewRecords,
  reviewCountForPrototype,
} from "./full-review";

function roundIndependent(value: number, unit: number): number {
  const absolute = Math.abs(value);
  const lower = Math.floor(absolute / unit) * unit;
  const upper = lower + unit;
  const rounded = absolute - lower < upper - absolute ? lower : upper;
  return value < 0 ? -rounded : rounded;
}

function verifyMath(record: ReturnType<typeof generateSapCp008ReviewRecords>[number]): void {
  const d = record.oracle.data;
  switch (record.prototypeId) {
    case "SAP-CP008-PROT-APPROX-INTEGER-SUM":
      assert.equal(record.canonicalAnswer, String(roundIndependent(Number(d.a), Number(d.unit)) + roundIndependent(Number(d.b), Number(d.unit)) + roundIndependent(Number(d.c), Number(d.unit))));
      break;
    case "SAP-CP008-PROT-APPROX-INTEGER-DIFFERENCE":
      assert.equal(record.canonicalAnswer, String(roundIndependent(Number(d.a), Number(d.unit)) - roundIndependent(Number(d.b), Number(d.unit))));
      break;
    case "SAP-CP008-PROT-SIGNED-ADDITIVE-CHAIN":
      assert.equal(record.canonicalAnswer, String(roundIndependent(Number(d.a), Number(d.unit)) - roundIndependent(Number(d.b), Number(d.unit)) + roundIndependent(Number(d.c), Number(d.unit))));
      break;
    case "SAP-CP008-PROT-BRACKETED-ADDITIVE-CHAIN":
      assert.equal(record.canonicalAnswer, String(roundIndependent(Number(d.a), Number(d.unit)) + roundIndependent(Number(d.b), Number(d.unit)) - roundIndependent(Number(d.c), Number(d.unit))));
      break;
    case "SAP-CP008-PROT-ADD-MULTIPLY-ADDITIVE-DOMINANT":
      assert.equal(record.canonicalAnswer, String(roundIndependent(Number(d.a), 10) + Number(d.multiplier) * roundIndependent(Number(d.b), 10)));
      break;
    case "SAP-CP008-PROT-DIVIDE-ADD-ADDITIVE-DOMINANT":
      assert.equal(record.canonicalAnswer, String(Number(d.roundedA) / Number(d.divisor) + Number(d.roundedB)));
      assert.equal(Number(d.roundedA) % Number(d.divisor), 0);
      break;
    case "SAP-CP008-PROT-BOUNDED-BODMAS-ADDITIVE":
      assert.equal(record.canonicalAnswer, String(roundIndependent(Number(d.a), 10) - roundIndependent(Number(d.b), 10) + 2 * roundIndependent(Number(d.c), 10)));
      break;
    case "SAP-CP008-PROT-MISSING-ADDEND-APPROX-EQUALITY":
      assert.equal(Number(d.roundedKnown) + Number(record.canonicalAnswer), Number(d.target));
      break;
    case "SAP-CP008-PROT-MISSING-SUBTRAHEND-APPROX-EQUALITY":
      assert.equal(Number(d.roundedKnown) - Number(record.canonicalAnswer), Number(d.target));
      break;
    case "SAP-CP008-PROT-NEAREST-OPTION-ADDITIVE": {
      const unit = Number(d.unit);
      const estimate = roundIndependent(Number(d.a), unit) + roundIndependent(Number(d.b), unit) - roundIndependent(Number(d.c), unit);
      assert.equal(record.canonicalAnswer, String(estimate));
      break;
    }
    case "SAP-CP008-PROT-SUM-ROUNDING-BOUNDS": {
      const half = Number(d.unit) / 2;
      assert.equal(Number(d.low), Number(d.x) + Number(d.y) - 2 * half);
      assert.equal(Number(d.highExclusive), Number(d.x) + Number(d.y) + 2 * half);
      assert.equal(record.canonicalAnswer, `${d.low} ≤ exact value < ${d.highExclusive}`);
      break;
    }
    case "SAP-CP008-PROT-DIFFERENCE-ROUNDING-BOUNDS": {
      const half = Number(d.unit) / 2;
      const low = Number(d.x) - half - (Number(d.y) + half);
      const high = Number(d.x) + half - (Number(d.y) - half);
      assert.ok(low > 0);
      assert.equal(record.canonicalAnswer, `${low} < exact value < ${high}`);
      break;
    }
    case "SAP-CP008-PROT-OVER-UNDER-CLASS": {
      const estimate = roundIndependent(Number(d.a), 10) + roundIndependent(Number(d.b), 10);
      const exact = Number(d.a) + Number(d.b);
      assert.equal(record.canonicalAnswer, estimate > exact ? "Overestimate" : estimate < exact ? "Underestimate" : "Exact after rounding");
      break;
    }
    case "SAP-CP008-PROT-COMPARE-ADDITIVE-ESTIMATES": {
      const a = roundIndependent(Number(d.a), 10) + roundIndependent(Number(d.b), 10);
      const b = roundIndependent(Number(d.c), 10) + roundIndependent(Number(d.d), 10);
      assert.equal(record.canonicalAnswer, a < b ? "A < B" : a > b ? "A > B" : "A = B");
      break;
    }
    case "SAP-CP008-PROT-DIAGNOSE-INVALID-ROUNDING-DIRECTION":
      assert.notEqual(Number(d.wrongA), roundIndependent(Number(d.a), 10));
      assert.equal(Number(d.actual), roundIndependent(Number(d.a), 10) + roundIndependent(Number(d.b), 10));
      break;
    case "SAP-CP008-PROT-COMPATIBLE-ADDENDS":
      assert.equal(roundIndependent(Number(d.a), Number(d.unit)), Number(d.targetA));
      assert.equal(roundIndependent(Number(d.b), Number(d.unit)), Number(d.targetB));
      break;
    case "SAP-CP008-PROT-DECIMAL-SUM":
    case "SAP-CP008-PROT-DECIMAL-DIFFERENCE":
      assert.ok(Number.isInteger(Number(d.answerScaled)));
      break;
  }
}

const records = generateSapCp008ReviewRecords();
assert.equal(records.length, 300);
assert.equal(new Set(records.map((record) => record.questionId)).size, 300);
assert.equal(new Set(records.map((record) => record.canonicalPayloadKey)).size, 300);

const counts = new Map<string, number>();
const positions = [0, 0, 0, 0];
const relations = new Set<string>();
const overUnder = new Set<string>();
const unitsByPrototype = new Map<string, Set<number>>();

for (let index = 0; index < records.length; index += 1) {
  const record = records[index]!;
  assert.equal(record.validation.ok, true);
  assert.equal(record.lifecycle.permanentQlId, null);
  assert.equal(record.lifecycle.active, false);
  assert.equal(record.lifecycle.questionStudioDiscoverable, false);
  assert.equal(record.lifecycle.questionBankWritable, false);
  assert.equal(record.lifecycle.testEligible, false);
  assert.equal(record.lifecycle.publiclyPublishable, false);
  assert.equal(record.options.length, 4);
  assert.equal(new Set(record.options.map((option) => option.value)).size, 4);
  assert.equal(record.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(record.options[record.correctIndex]?.value, record.canonicalAnswer);
  assert.match(record.stem, /Round each indicated term/i);
  assert.doesNotMatch(record.stem, /significant figure/i);
  verifyMath(record);
  counts.set(record.prototypeId, (counts.get(record.prototypeId) ?? 0) + 1);
  positions[record.correctIndex]! += 1;
  if (index >= 2) assert.ok(!(records[index - 2]!.correctIndex === records[index - 1]!.correctIndex && records[index - 1]!.correctIndex === record.correctIndex), `three-position streak at ${index}`);
  if (record.prototypeId === "SAP-CP008-PROT-COMPARE-ADDITIVE-ESTIMATES") relations.add(record.canonicalAnswer);
  if (record.prototypeId === "SAP-CP008-PROT-OVER-UNDER-CLASS") overUnder.add(record.canonicalAnswer);
  if (typeof record.oracle.data.unit === "number") {
    const set = unitsByPrototype.get(record.prototypeId) ?? new Set<number>();
    set.add(Number(record.oracle.data.unit));
    unitsByPrototype.set(record.prototypeId, set);
  }
}

for (const prototypeId of SAP_CP008_PROTOTYPE_IDS) assert.equal(counts.get(prototypeId), reviewCountForPrototype(prototypeId), `${prototypeId}: wrong review quota.`);
assert.deepEqual(positions, [75, 75, 75, 75]);
assert.deepEqual([...relations].sort(), ["A < B", "A = B", "A > B"]);
assert.deepEqual([...overUnder].sort(), ["Overestimate", "Underestimate"]);
for (const prototypeId of [
  "SAP-CP008-PROT-APPROX-INTEGER-SUM",
  "SAP-CP008-PROT-APPROX-INTEGER-DIFFERENCE",
  "SAP-CP008-PROT-SUM-ROUNDING-BOUNDS",
  "SAP-CP008-PROT-DIFFERENCE-ROUNDING-BOUNDS",
]) assert.deepEqual([...(unitsByPrototype.get(prototypeId) ?? new Set())].sort((a,b)=>a-b), [10, 100]);

console.log("SAP-CP-008 full-review authority passed: 300 unique questions across 18 identities, exact 75 A/B/C/D, no three-position streak, all comparison and over/under classes, both rounding units in key families, independent arithmetic/bound checks, and inactive lifecycle.");
