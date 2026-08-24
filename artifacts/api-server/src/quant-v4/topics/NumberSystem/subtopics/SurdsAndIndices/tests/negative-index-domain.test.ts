import { strict as assert } from "node:assert";
import {
  evaluateExactRationalPower,
  rational,
  rationalExponent,
  validateRationalPowerDomain,
} from "../../../../../shared/surds-indices";

assert.deepEqual(evaluateExactRationalPower(rational(2), rationalExponent(-3)), rational(1, 8));
assert.equal(validateRationalPowerDomain(rational(0), rationalExponent(-1)).valid, false);
assert.equal(validateRationalPowerDomain(rational(0), rationalExponent(0)).valid, false);
assert.equal(validateRationalPowerDomain(rational(-8), rationalExponent(1, 3)).valid, true);
assert.equal(validateRationalPowerDomain(rational(-8), rationalExponent(1, 2)).valid, false);
