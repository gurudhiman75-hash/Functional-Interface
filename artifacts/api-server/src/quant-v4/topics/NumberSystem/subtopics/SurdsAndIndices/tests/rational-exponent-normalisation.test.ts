import { strict as assert } from "node:assert";
import { addRationalExponent, rationalExponent } from "../../../../../shared/surds-indices";

assert.deepEqual(rationalExponent(6, 8), { numerator: 3n, denominator: 4n });
assert.deepEqual(rationalExponent(3, -6), { numerator: -1n, denominator: 2n });
assert.deepEqual(addRationalExponent(rationalExponent(1, 2), rationalExponent(1, 3)), { numerator: 5n, denominator: 6n });
