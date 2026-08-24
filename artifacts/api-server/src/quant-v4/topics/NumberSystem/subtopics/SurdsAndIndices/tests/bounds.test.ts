import { strict as assert } from "node:assert";
import { liesStrictlyBetweenConsecutiveIntegers, squareRootBounds } from "../../../../../shared/surds-indices";

assert.deepEqual(squareRootBounds(43n), { radicand: 43n, lower: 6n, upper: 7n, exact: false });
assert.deepEqual(squareRootBounds(49n), { radicand: 49n, lower: 7n, upper: 7n, exact: true });
assert.equal(liesStrictlyBetweenConsecutiveIntegers(43n, 6n), true);
assert.equal(liesStrictlyBetweenConsecutiveIntegers(49n, 7n), false);
