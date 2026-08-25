import { primeFactorisation } from "./integer-factorisation";
import { rational, type Rational } from "./rational";
import {
  addRationalExponent,
  multiplyRationalExponent,
  negateRationalExponent,
  rationalExponent,
  rationalExponentKey,
  type RationalExponent,
} from "./rational-exponent";
import { requireDomain, validateRationalPowerDomain } from "./real-domain";

export interface PrimePower {
  readonly prime: bigint;
  readonly exponent: RationalExponent;
}

export interface PowerNormalForm {
  readonly zero: boolean;
  readonly sign: 1 | -1;
  readonly factors: readonly PrimePower[];
}

function exponentTimesInteger(exponent: RationalExponent, multiplier: number): RationalExponent {
  return multiplyRationalExponent(exponent, rationalExponent(multiplier));
}

export function normalizeRationalPower(base: Rational, exponent: RationalExponent): PowerNormalForm {
  requireDomain(validateRationalPowerDomain(base, exponent));
  const e = rationalExponent(exponent.numerator, exponent.denominator);
  if (base.numerator === 0n) return { zero: true, sign: 1, factors: [] };
  if (e.numerator === 0n) return { zero: false, sign: 1, factors: [] };

  const negativeBase = base.numerator < 0n;
  const absoluteBase = rational(base.numerator < 0n ? -base.numerator : base.numerator, base.denominator);
  const factors = new Map<bigint, RationalExponent>();

  for (const factor of primeFactorisation(absoluteBase.numerator)) {
    factors.set(factor.prime, exponentTimesInteger(e, factor.exponent));
  }
  for (const factor of primeFactorisation(absoluteBase.denominator)) {
    const contribution = negateRationalExponent(exponentTimesInteger(e, factor.exponent));
    factors.set(factor.prime, addRationalExponent(factors.get(factor.prime) ?? rationalExponent(0), contribution));
  }

  const sign: 1 | -1 = negativeBase && (e.numerator < 0n ? -e.numerator : e.numerator) % 2n === 1n ? -1 : 1;
  return {
    zero: false,
    sign,
    factors: [...factors.entries()]
      .filter(([, factorExponent]) => factorExponent.numerator !== 0n)
      .sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0)
      .map(([prime, factorExponent]) => ({ prime, exponent: factorExponent })),
  };
}

export function multiplyPowerNormalForms(a: PowerNormalForm, b: PowerNormalForm): PowerNormalForm {
  if (a.zero || b.zero) return { zero: true, sign: 1, factors: [] };
  const factors = new Map<bigint, RationalExponent>();
  for (const factor of [...a.factors, ...b.factors]) {
    factors.set(factor.prime, addRationalExponent(factors.get(factor.prime) ?? rationalExponent(0), factor.exponent));
  }
  return {
    zero: false,
    sign: a.sign === b.sign ? 1 : -1,
    factors: [...factors.entries()]
      .filter(([, exponent]) => exponent.numerator !== 0n)
      .sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0)
      .map(([prime, exponent]) => ({ prime, exponent })),
  };
}

export function dividePowerNormalForms(a: PowerNormalForm, b: PowerNormalForm): PowerNormalForm {
  if (b.zero) throw new Error("Cannot divide by zero power form");
  const inverse: PowerNormalForm = {
    zero: false,
    sign: b.sign,
    factors: b.factors.map((factor) => ({ prime: factor.prime, exponent: negateRationalExponent(factor.exponent) })),
  };
  return multiplyPowerNormalForms(a, inverse);
}

export function powerNormalFormKey(value: PowerNormalForm): string {
  if (value.zero) return "0";
  const factors = value.factors.map((factor) => `${factor.prime}^(${rationalExponentKey(factor.exponent)})`).join("*");
  return `${value.sign < 0 ? "-" : "+"}${factors || "1"}`;
}
