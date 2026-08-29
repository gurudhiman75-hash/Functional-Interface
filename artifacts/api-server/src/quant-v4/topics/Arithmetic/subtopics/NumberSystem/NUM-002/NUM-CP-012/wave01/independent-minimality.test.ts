import assert from "node:assert/strict";

import { generateNumCp012Wave01 } from "./runtime.ts";

function powBig(base: bigint, exponent: number) {
  return base ** BigInt(exponent);
}

function floorKthRootBySearch(value: bigint, k: number) {
  assert.ok(value >= 0n, "independent root search expects non-negative integers");
  if (value <= 1n) return value;

  let low = 0n;
  let high = 1n;
  while (powBig(high, k) <= value) high *= 2n;

  while (low + 1n < high) {
    const mid = (low + high) / 2n;
    if (powBig(mid, k) <= value) low = mid;
    else high = mid;
  }
  return low;
}

function isExactPositiveKthPowerBySearch(value: bigint, k: number) {
  if (value < 0n) return false;
  const root = floorKthRootBySearch(value, k);
  return powBig(root, k) === value;
}

function leastMultiplierByEnumeration(value: bigint, k: number, upperBound: bigint) {
  for (let multiplier = 1n; multiplier <= upperBound; multiplier += 1n) {
    if (isExactPositiveKthPowerBySearch(value * multiplier, k)) return multiplier;
  }
  throw new Error(`No multiplier found through declared upper bound ${upperBound}`);
}

function leastDivisorByEnumeration(value: bigint, k: number, upperBound: bigint) {
  for (let divisor = 1n; divisor <= upperBound; divisor += 1n) {
    if (value % divisor !== 0n) continue;
    if (isExactPositiveKthPowerBySearch(value / divisor, k)) return divisor;
  }
  throw new Error(`No divisor found through declared upper bound ${upperBound}`);
}

let multiplierChecks = 0;
let divisorChecks = 0;
let missingExponentChecks = 0;

// A bounded but diverse second-algorithm audit. The production Wave01 audit
// already covers 100 seeds per prototype; this file specifically closes the
// minimality/uniqueness gap using exhaustive enumeration and direct integer
// root construction rather than prime-exponent residue completion.
for (let seed = 1; seed <= 36; seed += 1) {
  {
    const q = generateNumCp012Wave01("NUM-CP012-PROT-003", seed);
    const value = BigInt(String(q.hiddenState.value));
    const k = Number(q.hiddenState.k);
    const canonical = BigInt(q.canonicalAnswer);
    const independent = leastMultiplierByEnumeration(value, k, canonical);
    assert.equal(independent.toString(), q.canonicalAnswer,
      `P003/${seed}: least multiplier is not independently minimal`);
    multiplierChecks += 1;
  }

  {
    const q = generateNumCp012Wave01("NUM-CP012-PROT-004", seed);
    const value = BigInt(String(q.hiddenState.value));
    const k = Number(q.hiddenState.k);
    const canonical = BigInt(q.canonicalAnswer);
    const independent = leastDivisorByEnumeration(value, k, canonical);
    assert.equal(independent.toString(), q.canonicalAnswer,
      `P004/${seed}: least divisor is not independently minimal`);
    divisorChecks += 1;
  }

  {
    const q = generateNumCp012Wave01("NUM-CP012-PROT-005", seed);
    const k = Number(q.hiddenState.k);
    const prime = BigInt(String(q.hiddenState.prime));
    const fixedPrime = BigInt(String(q.hiddenState.fixedPrime));
    const fixedExponent = Number(q.hiddenState.fixedExponent);
    const low = Number(q.hiddenState.low);
    const high = Number(q.hiddenState.high);

    const valid: number[] = [];
    for (let x = low; x <= high; x += 1) {
      const value = powBig(fixedPrime, fixedExponent) * powBig(prime, x);
      if (isExactPositiveKthPowerBySearch(value, k)) valid.push(x);
    }

    assert.equal(valid.length, 1, `P005/${seed}: independent bounded search is not unique`);
    assert.equal(String(valid[0]), q.canonicalAnswer,
      `P005/${seed}: independent bounded solution differs from canonical answer`);
    missingExponentChecks += 1;
  }
}

console.log(JSON.stringify({
  status: "PASS_NUM_CP012_WAVE01_INDEPENDENT_MINIMALITY",
  algorithm: "EXHAUSTIVE_INTEGER_ENUMERATION_PLUS_DIRECT_KTH_ROOT_SEARCH",
  multiplierChecks,
  divisorChecks,
  missingExponentChecks,
  permanentQlAllocations: 0,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
}, null, 2));
