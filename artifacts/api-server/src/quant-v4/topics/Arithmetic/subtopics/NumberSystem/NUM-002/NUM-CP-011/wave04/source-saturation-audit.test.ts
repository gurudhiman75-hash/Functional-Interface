import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { NUM_CP011_WAVE01_PROTOTYPE_IDS } from "../wave01/types.ts";
import { NUM_CP011_WAVE02_PROTOTYPE_IDS } from "../wave02/types.ts";
import { NUM_CP011_WAVE03_PROTOTYPE_IDS } from "../wave03/types.ts";
import { NUM_CP011_WAVE04_PROTOTYPE_IDS } from "./types.ts";

function valuationFactorial(n: number, prime: number) {
  let exponent = 0;
  let power = prime;
  while (power <= n) {
    exponent += Math.floor(n / power);
    if (power > Math.floor(n / prime)) break;
    power *= prime;
  }
  return exponent;
}

function trailingZeroesInBase(n: number, base: number) {
  let remaining = base;
  const factors: Array<readonly [number, number]> = [];
  for (let prime = 2; prime * prime <= remaining; prime += 1) {
    if (remaining % prime !== 0) continue;
    let required = 0;
    while (remaining % prime === 0) {
      required += 1;
      remaining /= prime;
    }
    factors.push([prime, required] as const);
  }
  if (remaining > 1) factors.push([remaining, 1] as const);
  return Math.min(...factors.map(([prime, required]) =>
    Math.floor(valuationFactorial(n, prime) / required)));
}

const allPrototypeIds = [
  ...NUM_CP011_WAVE01_PROTOTYPE_IDS,
  ...NUM_CP011_WAVE02_PROTOTYPE_IDS,
  ...NUM_CP011_WAVE03_PROTOTYPE_IDS,
  ...NUM_CP011_WAVE04_PROTOTYPE_IDS,
];

assert.equal(allPrototypeIds.length, 15, "Expected exactly 15 executable discovery prototypes before final merge/split");
assert.equal(new Set(allPrototypeIds).size, 15, "Duplicate CP011 temporary prototype identity found");
assert.deepEqual(
  allPrototypeIds,
  Array.from({ length: 15 }, (_, index) => `NUM-CP011-PROT-${String(index + 1).padStart(3, "0")}`),
  "CP011 temporary prototype identities are not contiguous NUM-CP011-PROT-001..015",
);

const saturationPath = resolve(
  process.cwd(),
  "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/NumberSystem/NUM-002/NUM-CP-011/NUM-CP-011-WAVE04-SOURCE-SATURATION-MERGE-SPLIT.md",
);
const saturationRecord = readFileSync(saturationPath, "utf8");

const authorityLabels = new Set(saturationRecord.match(/CP011-AUTH-\d{2}/gu) ?? []);
assert.equal(authorityLabels.size, 14, `Expected 14 proposed authority labels, found ${authorityLabels.size}`);
for (let index = 1; index <= 14; index += 1) {
  assert.ok(authorityLabels.has(`CP011-AUTH-${String(index).padStart(2, "0")}`),
    `Missing proposed authority CP011-AUTH-${String(index).padStart(2, "0")}`);
}

const requiredMarkers = [
  "Merge M01 — `PROT-005` into `PROT-006`",
  "ns_trailing_zeroes",
  "ns_highest_power_dividing",
  "ns_factorial_divisibility",
  "ns_factorial_remainder",
  "Disposition: REASSIGN_CP008",
  "ns_factorial_factor_count",
  "Disposition: SPLIT_BY_GIVENS",
  "Last non-zero digit of a factorial",
  "Disposition: REASSIGN_CP014",
  "Binomial-coefficient valuation",
  "Disposition: DEFER_NO_DIRECT_SOURCE",
  "Highest composite power dividing a structured product",
  "Disposition: MERGE_INTO_AUTH-12",
  "Highest-power exponent vs highest-power value",
  "Disposition: ANSWER_FORMAT_ONLY",
  "Statement/claim",
  "Data sufficiency",
  "No permanent QL is allocated in this wave",
];
for (const marker of requiredMarkers) {
  assert.ok(saturationRecord.includes(marker), `Saturation record missing required disposition marker: ${marker}`);
}

for (let n = 1; n <= 200; n += 1) {
  const base10General = trailingZeroesInBase(n, 10);
  const decimalShortcut = valuationFactorial(n, 5);
  assert.equal(base10General, decimalShortcut,
    `Decimal/general-base merge proof failed at n=${n}: ${base10General} != ${decimalShortcut}`);
}

const productFixture = Object.freeze({
  twos: 11,
  threes: 7,
  base: 12,
});
const valuationCapacity = Math.min(
  Math.floor(productFixture.twos / 2),
  productFixture.threes,
);
let exactProduct = (2n ** BigInt(productFixture.twos)) * (3n ** BigInt(productFixture.threes));
let repeatedBaseDivisions = 0;
while (exactProduct % BigInt(productFixture.base) === 0n) {
  repeatedBaseDivisions += 1;
  exactProduct /= BigInt(productFixture.base);
}
assert.equal(valuationCapacity, repeatedBaseDivisions,
  "Structured-product highest-power and base-trailing-zero representations are not equivalent");
assert.equal(valuationCapacity, 5, "Structured-product equivalence fixture drift");

const wave0GapMarkers = [
  "Prime valuation in explicit product",
  "Prime valuation in factorial",
  "Prime valuation in exact factorial ratio",
  "Highest composite power dividing product/factorial",
  "Least factorial containing declared factor",
  "Base-ten trailing zeroes",
  "Non-decimal-base trailing zeroes",
  "Factorial-ratio trailing zeroes",
  "At-least inverse valuation/zeroes",
  "Exact inverse valuation/zeroes",
  "Possible/impossible exact targets",
  "Missing product exponent",
  "Statement/claim",
  "Data sufficiency",
];
for (const marker of wave0GapMarkers) {
  assert.ok(saturationRecord.includes(marker), `Wave 0 gap lacks final closure entry: ${marker}`);
}

console.log(JSON.stringify({
  status: "PASS_NUM_CP011_WAVE04_SOURCE_SATURATION_MERGE_SPLIT",
  discoveryPrototypeCount: allPrototypeIds.length,
  proposedAuthorityCount: authorityLabels.size,
  mergeCount: 1,
  mergedPrototypePair: ["NUM-CP011-PROT-005", "NUM-CP011-PROT-006"],
  decimalGeneralBaseEquivalenceChecks: 200,
  structuredProductPowerZeroEquivalence: {
    valuationCapacity,
    repeatedBaseDivisions,
  },
  permanentQlAllocations: 0,
  nextFreeQlMentionedOnly: "NUM-QL-213",
  sourceSaturatedCandidate: true,
}, null, 2));
