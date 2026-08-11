import { exactEquals, exactInteger, exactRational } from "./exact";
import { radianPi } from "./angle";
import { evaluateTrigExact } from "./standard-values";
import { verifyStandardTrigValue } from "./independent-verifier";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const sinPiOverSix = evaluateTrigExact("SIN", radianPi(1, 6));
assert(exactEquals(sinPiOverSix, exactRational(1, 2)), "sin(pi/6) must equal 1/2 exactly.");

const tanThreePiOverFour = evaluateTrigExact("TAN", radianPi(3, 4));
assert(exactEquals(tanThreePiOverFour, exactInteger(-1)), "tan(3pi/4) must equal -1 exactly.");

const cosNegativePiOverThree = evaluateTrigExact("COS", radianPi(-1, 3));
assert(exactEquals(cosNegativePiOverThree, exactRational(1, 2)), "cos(-pi/3) must equal 1/2 exactly.");

assert(
  verifyStandardTrigValue("SIN", radianPi(1, 6), sinPiOverSix).valid,
  "Independent verifier must agree for radian input.",
);

console.log("Trigonometry radian-input foundation tests passed.");
