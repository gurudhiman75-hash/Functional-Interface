import {
  divideRational,
  multiplyRational,
  rational,
  subtractRational,
  type Rational,
} from "./rational";
import { squareSurd, type SquareSurd } from "./square-surd";
import { surdSum, type SurdSum } from "./surd-sum";

export interface QuadraticSurd {
  readonly rationalPart: Rational;
  readonly surdPart: SquareSurd;
}

export function quadraticSurd(rationalPart: Rational, surdCoefficient: Rational, radicand: bigint): QuadraticSurd {
  return { rationalPart, surdPart: squareSurd(surdCoefficient, radicand) };
}

export function conjugate(value: QuadraticSurd): QuadraticSurd {
  return {
    rationalPart: value.rationalPart,
    surdPart: squareSurd(rational(-value.surdPart.coefficient.numerator, value.surdPart.coefficient.denominator), value.surdPart.radicand),
  };
}

export function conjugateNorm(value: QuadraticSurd): Rational {
  const rationalSquare = multiplyRational(value.rationalPart, value.rationalPart);
  const surdSquare = multiplyRational(
    multiplyRational(value.surdPart.coefficient, value.surdPart.coefficient),
    rational(value.surdPart.radicand),
  );
  return subtractRational(rationalSquare, surdSquare);
}

export function rationalizeMonomialDenominator(numerator: Rational, denominator: SquareSurd): SquareSurd {
  if (denominator.coefficient.numerator === 0n) throw new Error("Denominator cannot be zero");
  const denominatorRational = multiplyRational(denominator.coefficient, rational(denominator.radicand));
  return squareSurd(divideRational(numerator, denominatorRational), denominator.radicand);
}

export function rationalizeQuadraticDenominator(numerator: Rational, denominator: QuadraticSurd): SurdSum {
  const norm = conjugateNorm(denominator);
  if (norm.numerator === 0n) throw new Error("Quadratic-surd denominator has zero norm");
  const factor = divideRational(numerator, norm);
  const partner = conjugate(denominator);
  return surdSum([
    { coefficient: multiplyRational(factor, partner.rationalPart), radicand: 1n },
    { coefficient: multiplyRational(factor, partner.surdPart.coefficient), radicand: partner.surdPart.radicand },
  ]);
}
