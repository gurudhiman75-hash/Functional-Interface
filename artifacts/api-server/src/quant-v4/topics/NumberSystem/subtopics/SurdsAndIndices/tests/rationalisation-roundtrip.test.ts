import { strict as assert } from "node:assert";
import {
  equivalentSquareSurd,
  equivalentSurdSum,
  multiplySurdSums,
  quadraticSurd,
  rational,
  rationalizeMonomialDenominator,
  rationalizeQuadraticDenominator,
  squareRootSurd,
  squareSurd,
  surdSum,
} from "../../../../../shared/surds-indices";

const oneOverRoot2 = rationalizeMonomialDenominator(rational(1), squareRootSurd(2n));
assert.equal(equivalentSquareSurd(oneOverRoot2, squareSurd(rational(1, 2), 2n)), true);

const denominator = quadraticSurd(rational(5), rational(1), 10n);
const rationalized = rationalizeQuadraticDenominator(rational(33), denominator);
const expected = surdSum([
  { coefficient: rational(11), radicand: 1n },
  { coefficient: rational(-11, 5), radicand: 10n },
]);
assert.equal(equivalentSurdSum(rationalized, expected), true);

const denominatorAsSum = surdSum([
  { coefficient: denominator.rationalPart, radicand: 1n },
  { coefficient: denominator.surdPart.coefficient, radicand: denominator.surdPart.radicand },
]);
assert.equal(
  equivalentSurdSum(multiplySurdSums(denominatorAsSum, rationalized), surdSum([{ coefficient: rational(33), radicand: 1n }])),
  true,
);
