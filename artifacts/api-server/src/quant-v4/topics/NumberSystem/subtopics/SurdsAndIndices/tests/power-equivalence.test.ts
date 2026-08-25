import { strict as assert } from "node:assert";
import { equivalentRationalPowers, rational, rationalExponent } from "../../../../../shared/surds-indices";

assert.equal(equivalentRationalPowers(rational(4), rationalExponent(3), rational(8), rationalExponent(2)), true);
assert.equal(equivalentRationalPowers(rational(9), rationalExponent(2), rational(3), rationalExponent(4)), true);
assert.equal(equivalentRationalPowers(rational(4), rationalExponent(3), rational(2), rationalExponent(5)), false);
