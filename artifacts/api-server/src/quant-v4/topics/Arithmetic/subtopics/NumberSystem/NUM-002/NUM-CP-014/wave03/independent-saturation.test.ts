import assert from "node:assert/strict";
import { NUM_CP014_WAVE03_PROTOTYPE_IDS, generateNumCp014Wave03 } from "./runtime.ts";

function ints(lo: number, hi: number) {
  return Array.from({ length: hi - lo + 1 }, (_, index) => lo + index);
}
function gcd(a: number, b: number) {
  let x = Math.abs(a), y = Math.abs(b);
  while (y) [x, y] = [y, x % y];
  return x;
}
function tau(n: number) {
  let count = 0;
  for (let divisor = 1; divisor <= n; divisor += 1) if (n % divisor === 0) count += 1;
  return count;
}
function isSquare(n: number) {
  const root = Math.floor(Math.sqrt(n));
  return root * root === n;
}
function isCube(n: number) {
  for (let root = 1; root * root * root <= n; root += 1) if (root * root * root === n) return true;
  return false;
}
function unitDigitOfPower(base: number, exponent: number) {
  let value = 1;
  for (let index = 0; index < exponent; index += 1) value = (value * base) % 10;
  return value;
}
function strings(values: readonly number[]) {
  return values.map(String);
}

let independentChecks = 0;
let removedSetChecks = 0;

for (const prototypeId of NUM_CP014_WAVE03_PROTOTYPE_IDS) {
  for (let seed = 1; seed <= 80; seed += 1) {
    const q = generateNumCp014Wave03(prototypeId, seed);
    const s = q.hiddenState as any;
    let full: number[] = [];
    let removed: Record<string, number[]> = {};

    switch (prototypeId) {
      case "NUM-CP014-PROT-013": {
        const domain = ints(0, 9);
        const valueOf = (digit: number) => s.thousands * 1000 + digit * 100 + s.tens * 10 + s.units;
        const squareDigits = domain.filter((digit) => isSquare(valueOf(digit)));
        const divisibleDigits = domain.filter((digit) => valueOf(digit) % s.divisor === 0);
        full = squareDigits.filter((digit) => divisibleDigits.includes(digit));
        removed = { DIVISIBILITY: squareDigits, PERFECT_POWER: divisibleDigits };
        break;
      }
      case "NUM-CP014-PROT-014": {
        const domain = ints(s.lo, s.hi);
        const divisorCountSet = domain.filter((n) => tau(n) === s.divisorCount);
        const hcfSet = domain.filter((n) => gcd(n, s.anchor) === s.hcf);
        full = divisorCountSet.filter((n) => hcfSet.includes(n));
        removed = { DIVISOR_FUNCTION: hcfSet, HCF_LCM: divisorCountSet };
        break;
      }
      case "NUM-CP014-PROT-015": {
        const domain = ints(s.lo, s.hi);
        const divisorCountSet = domain.filter((n) => tau(n) === s.divisorCount);
        const remainderSet = domain.filter((n) => n % s.modulus === s.remainder);
        full = divisorCountSet.filter((n) => remainderSet.includes(n));
        removed = { DIVISOR_FUNCTION: remainderSet, REMAINDER: divisorCountSet };
        break;
      }
      case "NUM-CP014-PROT-016": {
        const domain = ints(s.lo, s.hi);
        const powerSet = domain.filter(s.powerKind === "SQUARE" ? isSquare : isCube);
        const hcfSet = domain.filter((n) => gcd(n, s.anchor) === s.hcf);
        full = powerSet.filter((n) => hcfSet.includes(n));
        removed = { PERFECT_POWER: hcfSet, HCF_LCM: powerSet };
        break;
      }
      case "NUM-CP014-PROT-017": {
        const domain = ints(2, s.maxBase);
        const validBases = domain.filter((base) => base > s.digit);
        const hcfBases = domain.filter((base) => gcd(base + s.digit, s.anchor) === s.hcf);
        full = validBases.filter((base) => hcfBases.includes(base));
        removed = { POSITIONAL_BASE: hcfBases, HCF_LCM: validBases };
        break;
      }
      case "NUM-CP014-PROT-018": {
        const domain = ints(s.lo, s.hi);
        const terminalSet = domain.filter((n) => unitDigitOfPower(s.powerBase, n) === s.terminalDigit);
        const remainderSet = domain.filter((n) => n % s.modulus === s.remainder);
        full = terminalSet.filter((n) => remainderSet.includes(n));
        removed = { TERMINAL_CYCLE: remainderSet, REMAINDER: terminalSet };
        break;
      }
    }

    assert.equal(full.length, 1, `${prototypeId}/${seed}: independent full solution is not unique`);
    assert.equal(String(full[0]), q.canonicalAnswer, `${prototypeId}/${seed}: independent canonical answer mismatch`);
    assert.deepEqual(strings(full), q.ablation.fullCandidates, `${prototypeId}/${seed}: full candidate set drift`);

    for (const component of q.componentEngines) {
      const independentlyRemoved = removed[component]!;
      assert.ok(independentlyRemoved.length > 1, `${prototypeId}/${seed}/${component}: independent ablation did not restore ambiguity`);
      assert.ok(independentlyRemoved.includes(full[0]!));
      assert.deepEqual(strings(independentlyRemoved), q.ablation.componentRemovedCandidates[component], `${prototypeId}/${seed}/${component}: removed candidate set drift`);
      removedSetChecks += 1;
    }
    independentChecks += 1;
  }
}

console.log(JSON.stringify({
  status: "PASS_NUM_CP014_WAVE03_INDEPENDENT_SATURATION",
  prototypes: NUM_CP014_WAVE03_PROTOTYPE_IDS.length,
  seedsPerPrototype: 80,
  independentChecks,
  removedSetChecks,
  bothComponentsIndependentlyNecessary: true,
  ql248Allocated: false,
}, null, 2));
