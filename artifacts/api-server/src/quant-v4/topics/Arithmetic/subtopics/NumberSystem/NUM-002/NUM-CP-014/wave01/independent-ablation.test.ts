import assert from "node:assert/strict";
import { NUM_CP014_WAVE01_PROTOTYPE_IDS, generateNumCp014Wave01 } from "./runtime-v2.ts";

function gcd(a: number, b: number) {
  let x = Math.abs(a), y = Math.abs(b);
  while (y) [x, y] = [y, x % y];
  return x;
}
function prime(n: number) {
  if (n < 2 || !Number.isInteger(n)) return false;
  for (let d = 2; d * d <= n; d += 1) if (n % d === 0) return false;
  return true;
}
function tau(n: number) {
  let count = 0;
  for (let d = 1; d <= n; d += 1) if (n % d === 0) count += 1;
  return count;
}
function square(n: number) {
  const r = Math.floor(Math.sqrt(n));
  return r * r === n;
}
function cube(n: number) {
  for (let r = 1; r * r * r <= n; r += 1) if (r * r * r === n) return true;
  return false;
}
function vpFactorial(n: number, p: number) {
  let count = 0;
  for (let value = 2; value <= n; value += 1) {
    let x = value;
    while (x % p === 0) { count += 1; x /= p; }
  }
  return count;
}
function unitsPower(base: number, exponent: number) {
  let value = 1;
  for (let i = 0; i < exponent; i += 1) value = (value * base) % 10;
  return value;
}
function ints(lo: number, hi: number) {
  return Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
}

let independentChecks = 0;
for (const prototypeId of NUM_CP014_WAVE01_PROTOTYPE_IDS) {
  for (let seed = 1; seed <= 80; seed += 1) {
    const q = generateNumCp014Wave01(prototypeId, seed);
    const s = q.hiddenState as any;
    let domain: number[] = [];
    let a: number[] = [];
    let b: number[] = [];

    switch (prototypeId) {
      case "NUM-CP014-PROT-001":
        domain = ints(0, 9);
        a = domain.filter((digit) => (4720 + digit) % s.divisor === 0);
        b = domain.filter((digit) => (4720 + digit) % s.remainderModulus === s.requiredRemainder);
        break;
      case "NUM-CP014-PROT-002":
        domain = ints(s.lo, s.hi);
        a = domain.filter((n) => gcd(n, s.anchor) === s.hcf);
        b = domain.filter((n) => prime(n + s.shift));
        break;
      case "NUM-CP014-PROT-003":
        domain = ints(s.lo, s.hi);
        a = domain.filter((n) => tau(n) === s.tau);
        b = domain.filter(cube);
        break;
      case "NUM-CP014-PROT-004":
        domain = ints(s.lo, s.hi);
        a = domain.filter((n) => vpFactorial(n, s.valuationPrime) === s.valuation);
        b = domain.filter((n) => unitsPower(s.cycleBase, n) === s.terminalDigit);
        break;
      case "NUM-CP014-PROT-005":
        domain = ints(s.lo, s.hi);
        a = domain.filter((base) => s.digit < base);
        b = domain.filter((base) => (base + s.digit) % s.divisor === 0);
        break;
      case "NUM-CP014-PROT-006":
        domain = ints(s.lo, s.hi);
        a = domain.filter(square);
        b = domain.filter((n) => n % s.modulus === s.remainder);
        break;
    }

    const full = a.filter((value) => b.includes(value));
    assert.deepEqual(full.map(String), q.ablation.fullCandidates, `${prototypeId}/${seed}: independent full-set reconstruction failed`);
    assert.deepEqual(a.map(String), q.ablation.withoutB, `${prototypeId}/${seed}: component-A candidate set drift`);
    assert.deepEqual(b.map(String), q.ablation.withoutA, `${prototypeId}/${seed}: component-B candidate set drift`);
    assert.equal(full.length, 1);
    assert.ok(a.length > 1 && b.length > 1);
    assert.equal(String(full[0]), q.canonicalAnswer);
    independentChecks += 1;
  }
}

console.log(JSON.stringify({
  status: "PASS_NUM_CP014_WAVE01_INDEPENDENT_ABLATION",
  canonicalRuntime: "runtime-v2.ts",
  prototypes: NUM_CP014_WAVE01_PROTOTYPE_IDS.length,
  seedsPerPrototype: 80,
  independentChecks,
  bothComponentsNecessary: true,
  rejectedRedundantPrototype: "DIVISOR_COUNT_PLUS_PERFECT_SQUARE",
  replacementPrototype: "DIVISOR_COUNT_PLUS_PERFECT_CUBE",
  boundedExactConstraintSearch: true,
  ql248Allocated: false,
}, null, 2));
