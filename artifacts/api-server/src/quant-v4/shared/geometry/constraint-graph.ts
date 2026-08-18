import { isZero, rational, type Rational } from "./exact";
import type { TheoremId } from "./theorem-registry";

export interface LinearTerm {
  readonly variable: string;
  readonly coefficient: Rational;
}

export interface GeometryEquation {
  readonly terms: readonly LinearTerm[];
  readonly constant: Rational;
  readonly reason: TheoremId;
}

export class ConstraintGraph {
  readonly #variables = new Set<string>();
  readonly #equations: GeometryEquation[] = [];

  addEquation(
    terms: readonly LinearTerm[],
    constant: Rational,
    reason: TheoremId,
  ): this {
    const combined = new Map<string, Rational>();
    for (const term of terms) {
      const previous = combined.get(term.variable) ?? rational(0);
      const next = rational(
        previous.numerator * term.coefficient.denominator + term.coefficient.numerator * previous.denominator,
        previous.denominator * term.coefficient.denominator,
      );
      combined.set(term.variable, next);
    }
    const normalized = [...combined.entries()]
      .filter(([, coefficient]) => !isZero(coefficient))
      .map(([variable, coefficient]) => Object.freeze({ variable, coefficient }));
    if (normalized.length === 0) throw new Error("Geometry equation must contain a non-zero term");
    normalized.forEach((term) => this.#variables.add(term.variable));
    this.#equations.push(Object.freeze({
      terms: Object.freeze(normalized),
      constant,
      reason,
    }));
    return this;
  }

  get variables(): readonly string[] {
    return Object.freeze([...this.#variables]);
  }

  get equations(): readonly GeometryEquation[] {
    return Object.freeze([...this.#equations]);
  }
}
