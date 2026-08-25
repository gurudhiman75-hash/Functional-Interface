import {
  addRational,
  negateRational,
  rational,
  rationalKey,
  type Rational,
} from "./rational";
import { multiplySquareSurds, squareSurd, type SquareSurd } from "./square-surd";

export interface SurdTerm {
  readonly coefficient: Rational;
  readonly radicand: bigint;
}

export interface SurdSum {
  readonly terms: readonly SurdTerm[];
}

export function surdSum(terms: readonly SurdTerm[]): SurdSum {
  const collected = new Map<bigint, Rational>();
  for (const term of terms) {
    const normalized = squareSurd(term.coefficient, term.radicand);
    collected.set(normalized.radicand, addRational(collected.get(normalized.radicand) ?? rational(0n), normalized.coefficient));
  }
  return {
    terms: [...collected.entries()]
      .filter(([, coefficient]) => coefficient.numerator !== 0n)
      .sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0)
      .map(([radicand, coefficient]) => ({ coefficient, radicand })),
  };
}

export function surdSumFromSquareSurd(value: SquareSurd): SurdSum {
  return surdSum([{ coefficient: value.coefficient, radicand: value.radicand }]);
}

export function addSurdSums(a: SurdSum, b: SurdSum): SurdSum {
  return surdSum([...a.terms, ...b.terms]);
}

export function negateSurdSum(value: SurdSum): SurdSum {
  return surdSum(value.terms.map((term) => ({ coefficient: negateRational(term.coefficient), radicand: term.radicand })));
}

export function subtractSurdSums(a: SurdSum, b: SurdSum): SurdSum {
  return addSurdSums(a, negateSurdSum(b));
}

export function multiplySurdSums(a: SurdSum, b: SurdSum): SurdSum {
  const products: SurdTerm[] = [];
  for (const left of a.terms) {
    for (const right of b.terms) {
      const product = multiplySquareSurds(
        { coefficient: left.coefficient, radicand: left.radicand },
        { coefficient: right.coefficient, radicand: right.radicand },
      );
      products.push(product);
    }
  }
  return surdSum(products);
}

export function surdSumKey(value: SurdSum): string {
  return value.terms.map((term) => `${rationalKey(term.coefficient)}@${term.radicand}`).join("+") || "0";
}
