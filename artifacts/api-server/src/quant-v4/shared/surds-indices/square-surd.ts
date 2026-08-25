import { extractPerfectPower } from "./perfect-power";
import {
  divideRational,
  multiplyRational,
  rational,
  rationalKey,
  type Rational,
} from "./rational";

export interface SquareSurd {
  readonly coefficient: Rational;
  /** Positive square-free radicand. radicand=1 represents a rational term. */
  readonly radicand: bigint;
}

export function squareSurd(coefficient: Rational, radicand: bigint): SquareSurd {
  if (radicand < 0n) throw new Error("Square surd radicand must be non-negative in the real domain");
  if (coefficient.numerator === 0n || radicand === 0n) return { coefficient: rational(0n), radicand: 1n };
  const decomposition = extractPerfectPower(radicand, 2);
  return {
    coefficient: multiplyRational(coefficient, rational(decomposition.outside)),
    radicand: decomposition.residual,
  };
}

export function squareRootSurd(radicand: bigint): SquareSurd {
  return squareSurd(rational(1n), radicand);
}

export function multiplySquareSurds(a: SquareSurd, b: SquareSurd): SquareSurd {
  return squareSurd(multiplyRational(a.coefficient, b.coefficient), a.radicand * b.radicand);
}

export function divideSquareSurds(a: SquareSurd, b: SquareSurd): SquareSurd {
  if (b.coefficient.numerator === 0n) throw new Error("Cannot divide by zero surd");
  // (a√m)/(b√n) = (a/(b n))√(m n)
  const coefficient = divideRational(a.coefficient, multiplyRational(b.coefficient, rational(b.radicand)));
  return squareSurd(coefficient, a.radicand * b.radicand);
}

export function squareSquareSurd(value: SquareSurd): Rational {
  return multiplyRational(
    multiplyRational(value.coefficient, value.coefficient),
    rational(value.radicand),
  );
}

export function negateSquareSurd(value: SquareSurd): SquareSurd {
  return { coefficient: rational(-value.coefficient.numerator, value.coefficient.denominator), radicand: value.radicand };
}

export function squareSurdKey(value: SquareSurd): string {
  return `${rationalKey(value.coefficient)}*sqrt(${value.radicand})`;
}
