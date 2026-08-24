import { strict as assert } from "node:assert";
import { conjugateNorm, quadraticSurd, rational } from "../../../../../shared/surds-indices";

const value = quadraticSurd(rational(5), rational(1), 10n);
assert.deepEqual(conjugateNorm(value), rational(15));

const coefficientBearing = quadraticSurd(rational(0), rational(3), 11n);
assert.deepEqual(conjugateNorm(coefficientBearing), rational(-99));
