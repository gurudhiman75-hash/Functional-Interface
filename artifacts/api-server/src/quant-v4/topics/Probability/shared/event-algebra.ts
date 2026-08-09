import type { ExactRational } from "./types";
import { addRational, complementRational, multiplyRational, subtractRational } from "./rational";
export function unionProbability(a: ExactRational, b: ExactRational, intersection: ExactRational): ExactRational { return subtractRational(addRational(a, b), intersection); }
export function independentIntersectionProbability(a: ExactRational, b: ExactRational): ExactRational { return multiplyRational(a, b); }
export function exactlyOneProbability(a: ExactRational, b: ExactRational, intersection: ExactRational): ExactRational { return subtractRational(addRational(a, b), multiplyRational({ numerator: 2n, denominator: 1n }, intersection)); }
export function neitherProbability(a: ExactRational, b: ExactRational, intersection: ExactRational): ExactRational { return complementRational(unionProbability(a, b, intersection)); }
