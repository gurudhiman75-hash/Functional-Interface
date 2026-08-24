import { strict as assert } from "node:assert";
import { denestNestedSquareRoot, equivalentSurdSum, multiplySurdSums, rational, surdSum } from "../../../../../shared/surds-indices";

const plus = denestNestedSquareRoot(8n, 15n, 1);
assert.ok(plus);
assert.deepEqual([plus.firstRadicand, plus.secondRadicand], [5n, 3n]);
assert.equal(
  equivalentSurdSum(
    multiplySurdSums(plus.value, plus.value),
    surdSum([{ coefficient: rational(8), radicand: 1n }, { coefficient: rational(2), radicand: 15n }]),
  ),
  true,
);

const minus = denestNestedSquareRoot(8n, 15n, -1);
assert.ok(minus);
assert.equal(
  equivalentSurdSum(
    multiplySurdSums(minus.value, minus.value),
    surdSum([{ coefficient: rational(8), radicand: 1n }, { coefficient: rational(-2), radicand: 15n }]),
  ),
  true,
);
assert.equal(denestNestedSquareRoot(7n, 11n, 1), null);
