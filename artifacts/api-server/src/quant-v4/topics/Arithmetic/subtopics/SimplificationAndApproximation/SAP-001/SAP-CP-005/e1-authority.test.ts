import assert from "node:assert/strict";
import { generateSapCp005E1Telescoping } from "./e1-runtime";

function gcd(a: number, b: number): number {
  let x = Math.abs(a), y = Math.abs(b);
  while (y !== 0) [x, y] = [y, x % y];
  return x || 1;
}

function exactFraction(n: number, d: number): string {
  const g = gcd(n, d);
  const nn = n / g, dd = d / g;
  return dd === 1 ? String(nn) : `${nn}/${dd}`;
}

const stems = new Set<string>();
const payloads = new Set<string>();
const positions = [0, 0, 0, 0];
const counts = new Set<number>();

for (let seed = 1; seed <= 100; seed += 1) {
  const q = generateSapCp005E1Telescoping(seed);
  const start = Number(q.oracle.data.start);
  const count = Number(q.oracle.data.termCount);
  const end = Number(q.oracle.data.endPlusOne);
  const expected = exactFraction(count, start * end);
  assert.equal(q.validation.ok, true, `${seed}: ${q.validation.errors.join("; ")}`);
  assert.equal(end, start + count);
  assert.equal(q.canonicalAnswer, expected);
  assert.equal(new Set(q.options.map((o) => o.value)).size, 4);
  assert.equal(q.options[q.correctIndex]?.value, expected);
  assert.ok(!stems.has(q.stem), `${seed}: duplicate stem`);
  assert.ok(!payloads.has(q.canonicalPayloadKey), `${seed}: duplicate payload`);
  assert.ok(!q.stem.includes("..."));
  stems.add(q.stem);
  payloads.add(q.canonicalPayloadKey);
  positions[q.correctIndex]! += 1;
  counts.add(count);
  assert.equal(q.lifecycle.active, false);
  assert.equal(q.lifecycle.questionBankWritable, false);
  assert.equal(q.lifecycle.publiclyPublishable, false);
}

assert.equal(stems.size, 100);
assert.deepEqual(positions, [25, 25, 25, 25]);
assert.deepEqual([...counts].sort((a, b) => a - b), [4, 5, 6, 7, 8]);
console.log("SAP CP005 E1 authority passed: 100 unique finite telescoping states with exact endpoint proof.");
