import {
  addExact,
  assertDefined,
  classifyExactNumber,
  divideExact,
  exactEquals,
  exactFromTerms,
  exactInteger,
  exactKey,
  exactRational,
  exactRationalSurd,
  exactSurd,
  formatExactMath,
  formatExactPlain,
  multiplyExact,
  rational,
  reciprocalExact,
} from "./exact";
import {
  degree,
  normalizedDegreeValue,
  quadrant,
  quadrantSign,
  radianPi,
  referenceAngleDegrees,
  toDegrees,
  toRadianPiCoefficient,
} from "./angle";
import { evaluateTrigExact } from "./standard-values";
import { evaluateTrigExpression, expr } from "./expression";
import { verifyExpressionNumerically, verifyStandardTrigValue } from "./independent-verifier";
import type { TrigFunction } from "./types";

function assert(condition: unknown, message = "Assertion failed"): asserts condition {
  if (!condition) throw new Error(message);
}

function assertEqual(actual: unknown, expected: unknown, message = "Values differ") {
  if (actual !== expected) throw new Error(`${message}: ${String(actual)} !== ${String(expected)}`);
}

function assertRational(
  actual: { numerator: bigint; denominator: bigint },
  numerator: bigint | number,
  denominator: bigint | number = 1,
) {
  assertEqual(actual.numerator, BigInt(numerator), "Rational numerator differs");
  assertEqual(actual.denominator, BigInt(denominator), "Rational denominator differs");
}

function expectExact(
  actual: ReturnType<typeof evaluateTrigExact>,
  expected: ReturnType<typeof exactInteger>,
  message: string,
) {
  assertEqual(actual.kind, "RADICAL_SUM", `${message}: expected a defined exact result.`);
  assert(exactEquals(actual, expected), `${message}: ${exactKey(actual)} !== ${exactKey(expected)}`);
}

assertRational(rational(-2, -4), 1, 2);
assert(exactEquals(exactSurd(1, 12), exactSurd(2, 3)), "sqrt(12) must reduce to 2sqrt(3)");
assertEqual(classifyExactNumber(exactInteger(4)), "RATIONAL");
assertEqual(classifyExactNumber(exactSurd(3, 5, 2)), "SURD");
assertEqual(classifyExactNumber(exactRationalSurd(1, 2, 1, 3, 2)), "RATIONAL_SURD");

assert(
  exactEquals(multiplyExact(exactSurd(1, 2), exactSurd(1, 3)), exactSurd(1, 6)),
  "sqrt(2)*sqrt(3) must equal sqrt(6)",
);
assert(
  exactEquals(assertDefined(reciprocalExact(exactSurd(1, 3))), exactSurd(1, 3, 3)),
  "1/sqrt(3) must normalize to sqrt(3)/3",
);
const inverseOnePlusRootThree = assertDefined(reciprocalExact(addExact(exactInteger(1), exactSurd(1, 3))));
assert(
  exactEquals(inverseOnePlusRootThree, exactRationalSurd(-1, 2, 1, 3, 2)),
  "1/(1+sqrt(3)) must rationalize to (sqrt(3)-1)/2",
);
assert(
  exactEquals(
    assertDefined(divideExact(exactInteger(1), exactSurd(2, 5))),
    exactSurd(1, 5, 10),
  ),
  "1/(2sqrt(5)) must rationalize to sqrt(5)/10",
);

let rngState = 0x5eeda11;
function nextRandom() {
  rngState = (Math.imul(rngState, 1664525) + 1013904223) >>> 0;
  return rngState;
}
const stressRadicands = [1, 2, 3, 5, 6, 10, 15, 30];
let reciprocalStressCount = 0;
for (let sample = 0; sample < 150; sample += 1) {
  const terms = stressRadicands.flatMap((radicand) => {
    if (nextRandom() % 4 !== 0) return [];
    const numerator = Number(nextRandom() % 7) - 3;
    if (numerator === 0) return [];
    const denominator = nextRandom() % 2 === 0 ? 1 : 2;
    return [{ radicand: BigInt(radicand), coefficient: rational(numerator, denominator) }];
  });
  const value = exactFromTerms(terms);
  if (value.terms.length === 0) continue;
  const inverse = assertDefined(reciprocalExact(value));
  assert(
    exactEquals(multiplyExact(value, inverse), exactInteger(1)),
    `Exact reciprocal stress failed for ${exactKey(value)}`,
  );
  reciprocalStressCount += 1;
}
assert(reciprocalStressCount >= 100, "Reciprocal stress did not exercise enough non-zero values.");

assertEqual(formatExactPlain(exactSurd(1, 3, 3)), "√3/3");
assertEqual(formatExactMath(exactSurd(1, 2, 2)), "\\frac{\\sqrt{2}}{2}");

assertRational(toRadianPiCoefficient(degree(30)), 1, 6);
assertRational(toDegrees(radianPi(3, 4)), 135);
assertRational(normalizedDegreeValue(degree(-30)), 330);
assertRational(normalizedDegreeValue(degree(390)), 30);
assertRational(referenceAngleDegrees(degree(150)), 30);
assertRational(referenceAngleDegrees(degree(225)), 45);
assertRational(referenceAngleDegrees(degree(300)), 60);
assertEqual(quadrant(degree(135)), "II");
assertEqual(quadrantSign("SIN", degree(135)), 1);
assertEqual(quadrantSign("COS", degree(135)), -1);
assertEqual(quadrantSign("TAN", degree(225)), 1);
assertEqual(quadrantSign("SIN", degree(90)), null);

expectExact(evaluateTrigExact("SIN", degree(30)), exactRational(1, 2), "sin 30");
expectExact(evaluateTrigExact("COS", degree(45)), exactSurd(1, 2, 2), "cos 45");
expectExact(evaluateTrigExact("TAN", degree(60)), exactSurd(1, 3), "tan 60");
expectExact(evaluateTrigExact("SIN", degree(150)), exactRational(1, 2), "sin 150");
expectExact(evaluateTrigExact("COS", degree(150)), exactSurd(-1, 3, 2), "cos 150");
expectExact(evaluateTrigExact("TAN", degree(135)), exactInteger(-1), "tan 135");
expectExact(evaluateTrigExact("SEC", degree(60)), exactInteger(2), "sec 60");
expectExact(evaluateTrigExact("COSEC", degree(270)), exactInteger(-1), "cosec 270");
assertEqual(evaluateTrigExact("TAN", degree(90)).kind, "UNDEFINED");
assertEqual(evaluateTrigExact("COT", degree(180)).kind, "UNDEFINED");
assertEqual(evaluateTrigExact("SIN", degree(20)).kind, "UNDEFINED");

const identityExpression = expr.add(
  expr.power(expr.trig("SIN", degree(30)), 2),
  expr.power(expr.trig("COS", degree(30)), 2),
);
expectExact(evaluateTrigExpression(identityExpression), exactInteger(1), "sin^2 30 + cos^2 30");

const productExpression = expr.multiply(
  expr.constant(exactInteger(2)),
  expr.trig("SIN", degree(45)),
  expr.trig("COS", degree(45)),
);
expectExact(evaluateTrigExpression(productExpression), exactInteger(1), "2 sin45 cos45");

const mixedExpression = expr.power(
  expr.add(expr.trig("SIN", degree(30)), expr.trig("COS", degree(30))),
  2,
);
const mixedValue = evaluateTrigExpression(mixedExpression);
assertEqual(mixedValue.kind, "RADICAL_SUM");
if (mixedValue.kind === "RADICAL_SUM") {
  assertEqual(classifyExactNumber(mixedValue), "RATIONAL_SURD");
  assert(exactEquals(mixedValue, exactRationalSurd(1, 1, 1, 3, 2)));
}

const functions: TrigFunction[] = ["SIN", "COS", "TAN", "COT", "SEC", "COSEC"];
const angles = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360];
let verified = 0;
for (const fn of functions) {
  for (const angle of angles) {
    const expected = evaluateTrigExact(fn, degree(angle));
    const verification = verifyStandardTrigValue(fn, degree(angle), expected);
    assert(
      verification.valid,
      `${fn} ${angle}: ${verification.expectedKey} != ${verification.reconstructedKey}`,
    );
    verified += 1;
  }
}
assertEqual(verified, 102);

const expressionVerification = verifyExpressionNumerically(mixedExpression, mixedValue);
assert(expressionVerification.valid);
assert((expressionVerification.numericDelta ?? 1) < 1e-10);

console.log(
  `Trigonometry Phase 1 foundation tests passed (${verified} standard-value verifier cases; ${reciprocalStressCount} exact reciprocal stress cases).`,
);
