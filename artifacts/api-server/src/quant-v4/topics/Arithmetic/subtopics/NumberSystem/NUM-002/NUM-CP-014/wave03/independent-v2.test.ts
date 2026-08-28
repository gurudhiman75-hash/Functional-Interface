import assert from "node:assert/strict";
import { generateNumCp014Wave03V2 } from "./runtime-v2.ts";

function gcd(a: number, b: number) {
  let x = Math.abs(a), y = Math.abs(b);
  while (y) [x, y] = [y, x % y];
  return x;
}
function isSquare(n: number) {
  const root = Math.floor(Math.sqrt(n));
  return root * root === n;
}
function ints(lo: number, hi: number) {
  return Array.from({ length: hi - lo + 1 }, (_, index) => lo + index);
}
function strings(values: readonly number[]) {
  return values.map(String);
}
function setAnswer(values: readonly number[]) {
  return `{${values.join(", ")}}`;
}

let independentChecks = 0;

for (let seed = 1; seed <= 100; seed += 1) {
  const q = generateNumCp014Wave03V2("NUM-CP014-PROT-019", seed);
  const s = q.hiddenState as any;
  const domain = ints(2, s.maxDivisor);
  const divisorSet = domain.filter((d) => s.number % d === 0);
  const hcfSet = domain.filter((d) => gcd(d, s.anchor) === s.hcf);
  const full = divisorSet.filter((d) => hcfSet.includes(d));
  assert.equal(full.length, 1);
  assert.equal(String(full[0]), q.canonicalAnswer);
  assert.deepEqual(strings(full), q.ablation.fullCandidates);
  assert.deepEqual(strings(hcfSet), q.ablation.componentRemovedCandidates.DIVISOR_FUNCTION);
  assert.deepEqual(strings(divisorSet), q.ablation.componentRemovedCandidates.HCF_LCM);
  assert.ok(hcfSet.length > 1 && divisorSet.length > 1);
  independentChecks += 1;
}

for (let seed = 1; seed <= 100; seed += 1) {
  const q = generateNumCp014Wave03V2("NUM-CP014-PROT-020", seed);
  const s = q.hiddenState as any;
  const domain = ints(s.lo, s.hi);
  const squareSet = domain.filter(isSquare);
  const remainderSet = domain.filter((n) => n % s.modulus === s.remainder);
  const full = squareSet.filter((n) => remainderSet.includes(n));
  assert.ok(full.length >= 2 && full.length <= 4);
  assert.equal(setAnswer(full), q.canonicalAnswer);
  assert.deepEqual(strings(full), q.ablation.fullCandidates);
  assert.deepEqual(strings(remainderSet), q.ablation.componentRemovedCandidates.PERFECT_POWER);
  assert.deepEqual(strings(squareSet), q.ablation.componentRemovedCandidates.REMAINDER);
  assert.equal(q.ablation.componentRemovedAnswers.PERFECT_POWER, setAnswer(remainderSet));
  assert.equal(q.ablation.componentRemovedAnswers.REMAINDER, setAnswer(squareSet));
  assert.notEqual(setAnswer(remainderSet), q.canonicalAnswer);
  assert.notEqual(setAnswer(squareSet), q.canonicalAnswer);
  independentChecks += 1;
}

console.log(JSON.stringify({
  status: "PASS_NUM_CP014_WAVE03_V2_INDEPENDENT",
  independentChecks,
  hiddenDivisorReconstructed: true,
  completeSetReconstructed: true,
  ql248Allocated: false,
}, null, 2));
