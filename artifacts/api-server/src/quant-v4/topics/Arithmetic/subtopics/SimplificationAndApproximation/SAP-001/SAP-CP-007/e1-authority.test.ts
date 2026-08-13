import assert from "node:assert/strict";
import { generateSapCp007E1SignificantFigures } from "./e1-runtime";

function fmt(v: number, scale: number): string {
  const s = String(v).padStart(scale + 1, "0");
  return scale === 0 ? s : `${s.slice(0, -scale)}.${s.slice(-scale)}`;
}

function solve(coef: number, scale: number, sf: number): string {
  const drop = String(coef).length - sf;
  const div = 10 ** drop;
  let q = Math.floor(coef / div);
  const rem = coef % div;
  if (2 * rem >= div) q += 1;
  const places = scale - drop;
  return places >= 0 ? fmt(q, places) : String(q * 10 ** -places);
}

const stems = new Set<string>();
const payloads = new Set<string>();
const positions = [0, 0, 0, 0];
const sfSeen = new Set<number>();
let ups = 0, downs = 0;

for (let seed = 1; seed <= 100; seed += 1) {
  const q = generateSapCp007E1SignificantFigures(seed);
  const d = q.oracle.data;
  const coef = Number(d.coefficient), scale = Number(d.scale), sf = Number(d.significantFigures);
  assert.equal(q.validation.ok, true, `${seed}: ${q.validation.errors.join("; ")}`);
  assert.equal(q.canonicalAnswer, solve(coef, scale, sf));
  assert.equal(new Set(q.options.map((o) => o.value)).size, 4);
  assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer);
  assert.ok(!stems.has(q.stem));
  assert.ok(!payloads.has(q.canonicalPayloadKey));
  stems.add(q.stem); payloads.add(q.canonicalPayloadKey);
  positions[q.correctIndex]! += 1;
  sfSeen.add(sf);
  if (2 * Number(d.remainder) >= Number(d.divisor)) ups += 1; else downs += 1;
  assert.ok(Number(d.resultPlaces) >= 1);
  assert.equal(q.lifecycle.active, false);
  assert.equal(q.lifecycle.testEligible, false);
}

assert.equal(stems.size, 100);
assert.deepEqual(positions, [25, 25, 25, 25]);
assert.deepEqual([...sfSeen].sort(), [2, 3, 4]);
assert.ok(ups > 20 && downs > 20);
console.log("SAP CP007 E1 authority passed: 100 significant-figure rounding states independently reconstructed.");
