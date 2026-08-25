import { strict as assert } from "node:assert";
import { normalizeRationalPower, powerNormalFormKey, rational, rationalExponent } from "../../../../../shared/surds-indices";

assert.equal(
  powerNormalFormKey(normalizeRationalPower(rational(8), rationalExponent(2))),
  powerNormalFormKey(normalizeRationalPower(rational(2), rationalExponent(6))),
);
assert.equal(
  powerNormalFormKey(normalizeRationalPower(rational(1, 8), rationalExponent(-2, 3))),
  powerNormalFormKey(normalizeRationalPower(rational(2), rationalExponent(2))),
);
