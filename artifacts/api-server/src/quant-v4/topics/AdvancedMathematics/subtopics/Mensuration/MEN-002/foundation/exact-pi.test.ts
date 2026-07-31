import assert from "node:assert/strict";
import {
  exactEquals,
  exactKey,
  formatExactMath,
  formatExactPlain,
  formatWithUnit,
  isPositive,
  pi,
  piSurd,
  rational,
  surd,
} from "./exact";

const onePi = pi();
assert.equal(exactKey(onePi), "P:1/1");
assert.equal(formatExactMath(onePi), "\\pi");
assert.equal(formatExactPlain(onePi), "π");
assert.equal(formatWithUnit(onePi, "cm²"), "$\\pi\\text{ cm}^{2}$");
assert.equal(isPositive(onePi), true);

const fractionalPi = pi(14, 6);
assert.equal(exactKey(fractionalPi), "P:7/3");
assert.equal(formatExactMath(fractionalPi), "\\frac{7}{3}\\pi");
assert.equal(formatExactPlain(fractionalPi), "7/3π");
assert.equal(exactEquals(fractionalPi, pi(7, 3)), true);

const simplifiedPiSurd = piSurd(5, 52);
assert.equal(exactKey(simplifiedPiSurd), "PS:10/1:sqrt(13)");
assert.equal(formatExactMath(simplifiedPiSurd), "10\\pi\\sqrt{13}");
assert.equal(formatExactPlain(simplifiedPiSurd), "10π√13");
assert.equal(formatWithUnit(simplifiedPiSurd, "cm²"), "$10\\pi\\sqrt{13}\\text{ cm}^{2}$");
assert.equal(isPositive(simplifiedPiSurd), true);

const piSurdReducedToPi = piSurd(3, 36, 2);
assert.equal(exactKey(piSurdReducedToPi), "P:9/1");
assert.equal(formatExactMath(piSurdReducedToPi), "9\\pi");

const negativePi = pi(-1);
assert.equal(formatExactMath(negativePi), "-\\pi");
assert.equal(isPositive(negativePi), false);

assert.equal(exactKey(rational(7, 3)), "R:7/3");
assert.equal(exactKey(surd(5, 52)), "S:10/1:sqrt(13)");
assert.equal(exactEquals(rational(7, 3), fractionalPi), false);
assert.equal(exactEquals(surd(10, 13), simplifiedPiSurd), false);

console.log("MEN-002 exact π arithmetic proof passed for rational, surd, π and π-surd values.");
