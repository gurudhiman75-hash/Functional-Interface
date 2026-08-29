import { strict as assert } from "node:assert";
import {
  equivalentPowerForms,
  multiplyPowerNormalForms,
  normalizeRationalPower,
  rational,
  rationalExponent,
} from "../../../../../shared/surds-indices";

const twoCubed = normalizeRationalPower(rational(2), rationalExponent(3));
const twoFourth = normalizeRationalPower(rational(2), rationalExponent(4));
const twoSeventh = normalizeRationalPower(rational(2), rationalExponent(7));
assert.equal(equivalentPowerForms(multiplyPowerNormalForms(twoCubed, twoFourth), twoSeventh), true);

const powerOfPower = normalizeRationalPower(rational(8), rationalExponent(2));
const commonBase = normalizeRationalPower(rational(2), rationalExponent(6));
assert.equal(equivalentPowerForms(powerOfPower, commonBase), true);
