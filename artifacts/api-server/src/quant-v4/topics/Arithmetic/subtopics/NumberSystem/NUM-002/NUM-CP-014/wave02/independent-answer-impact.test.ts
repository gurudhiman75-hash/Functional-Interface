import assert from "node:assert/strict";
import { NUM_CP014_WAVE02_PROTOTYPE_IDS, generateNumCp014Wave02 } from "./runtime.ts";

function ints(lo: number, hi: number) { return Array.from({ length: hi - lo + 1 }, (_, i) => lo + i); }
function gcd(a: number, b: number) { let x = Math.abs(a), y = Math.abs(b); while (y) [x, y] = [y, x % y]; return x; }
function prime(n: number) { if (n < 2) return false; for (let d = 2; d * d <= n; d += 1) if (n % d === 0) return false; return true; }
function square(n: number) { const r = Math.floor(Math.sqrt(n)); return r * r === n; }
function cube(n: number) { for (let r = 1; r * r * r <= n; r += 1) if (r * r * r === n) return true; return false; }
function cls(length: number) { return length === 0 ? "NO_SOLUTION" : length === 1 ? "ONE_SOLUTION" : "MULTIPLE_SOLUTIONS"; }

let checks = 0;
for (const prototypeId of NUM_CP014_WAVE02_PROTOTYPE_IDS) {
  for (let seed = 1; seed <= 60; seed += 1) {
    const q = generateNumCp014Wave02(prototypeId, seed);
    const s = q.hiddenState as any;

    if (prototypeId === "NUM-CP014-PROT-007") {
      const domain = ints(s.lo, s.hi);
      const a = domain.filter(square), b = domain.filter((n) => n % s.modulus === s.remainder), full = a.filter((n) => b.includes(n));
      assert.equal(q.canonicalAnswer, String(Math.min(...full)));
      assert.equal(q.ablation.componentRemovedAnswers.PERFECT_POWER, String(Math.min(...b)));
      assert.equal(q.ablation.componentRemovedAnswers.REMAINDER, String(Math.min(...a)));
      assert.deepEqual(full.map(String), q.ablation.fullCandidates);
    } else if (prototypeId === "NUM-CP014-PROT-008") {
      const domain = ints(s.lo, s.hi);
      const a = domain.filter((n) => gcd(n, s.anchor) === s.hcf), b = domain.filter((n) => prime(n + s.shift)), full = a.filter((n) => b.includes(n));
      assert.equal(q.canonicalAnswer, String(Math.max(...full)));
      assert.equal(q.ablation.componentRemovedAnswers.HCF_LCM, String(Math.max(...b)));
      assert.equal(q.ablation.componentRemovedAnswers.PRIME_STRUCTURE, String(Math.max(...a)));
    } else if (prototypeId === "NUM-CP014-PROT-009") {
      const domain = ints(2, s.hi);
      const a = domain.filter((base) => s.digit < base), b = domain.filter((base) => (base + s.digit) % s.divisor === 0), full = a.filter((base) => b.includes(base));
      assert.equal(q.canonicalAnswer, String(full.length));
      assert.equal(q.ablation.componentRemovedAnswers.POSITIONAL_BASE, String(b.length));
      assert.equal(q.ablation.componentRemovedAnswers.DIVISIBILITY, String(a.length));
    } else if (prototypeId === "NUM-CP014-PROT-010") {
      const domain = ints(s.lo, s.hi);
      const a = domain.filter(cube), b = domain.filter((n) => n % s.modulus === s.remainder), full = a.filter((n) => b.includes(n));
      assert.equal(q.canonicalAnswer, cls(full.length));
      assert.equal(q.ablation.componentRemovedAnswers.PERFECT_POWER, cls(b.length));
      assert.equal(q.ablation.componentRemovedAnswers.REMAINDER, cls(a.length));
      assert.notEqual(cls(full.length), cls(a.length));
      assert.notEqual(cls(full.length), cls(b.length));
    } else if (prototypeId === "NUM-CP014-PROT-011") {
      const domain = ints(s.lo, s.hi);
      const a = domain.filter((n) => gcd(n, s.anchor) === s.hcf);
      const b = domain.filter((n) => prime(n + s.shift));
      const c = domain.filter((n) => n % s.modulus === s.remainder);
      const full = domain.filter((n) => a.includes(n) && b.includes(n) && c.includes(n));
      const noA = domain.filter((n) => b.includes(n) && c.includes(n));
      const noB = domain.filter((n) => a.includes(n) && c.includes(n));
      const noC = domain.filter((n) => a.includes(n) && b.includes(n));
      assert.deepEqual(full.map(String), [q.canonicalAnswer]);
      assert.ok(noA.length > 1 && noB.length > 1 && noC.length > 1);
      assert.deepEqual(noA.map(String), q.ablation.componentRemovedCandidates.HCF_LCM);
      assert.deepEqual(noB.map(String), q.ablation.componentRemovedCandidates.PRIME_STRUCTURE);
      assert.deepEqual(noC.map(String), q.ablation.componentRemovedCandidates.REMAINDER);
    } else {
      const divisor = s.divisor, modulus = s.modulus, remainder = s.remainder;
      const pairs = Array.from({ length: 100 }, (_, code) => ({ code: String(code).padStart(2, "0"), n: 500 + code }));
      const a = pairs.filter((p) => p.n % divisor === 0), b = pairs.filter((p) => p.n % modulus === remainder);
      const full = a.filter((p) => b.some((q2) => q2.n === p.n));
      assert.equal(q.canonicalAnswer, String(full.length));
      assert.equal(q.ablation.componentRemovedAnswers.DIVISIBILITY, String(b.length));
      assert.equal(q.ablation.componentRemovedAnswers.REMAINDER, String(a.length));
    }

    for (const component of q.ablation.components) assert.notEqual(q.ablation.componentRemovedAnswers[component], q.canonicalAnswer);
    checks += 1;
  }
}

console.log(JSON.stringify({
  status: "PASS_NUM_CP014_WAVE02_INDEPENDENT_ANSWER_IMPACT",
  prototypes: NUM_CP014_WAVE02_PROTOTYPE_IDS.length,
  seedsPerPrototype: 60,
  checks,
  everyComponentChangesRequestedAnswer: true,
  ql248Allocated: false,
}, null, 2));
