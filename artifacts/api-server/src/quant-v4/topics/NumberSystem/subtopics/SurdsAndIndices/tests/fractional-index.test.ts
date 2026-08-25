import { strict as assert } from "node:assert";
import { evaluateExactRationalPower, rational, rationalExponent } from "../../../../../shared/surds-indices";

assert.deepEqual(evaluateExactRationalPower(rational(16), rationalExponent(1, 2)), rational(4));
assert.deepEqual(evaluateExactRationalPower(rational(27), rationalExponent(2, 3)), rational(9));
assert.deepEqual(evaluateExactRationalPower(rational(1, 64), rationalExponent(-2, 3)), rational(16));
assert.deepEqual(evaluateExactRationalPower(rational(-8), rationalExponent(2, 3)), rational(4));
