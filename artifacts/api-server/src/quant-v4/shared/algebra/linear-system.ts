import {
  addRational,
  divideRational,
  equalsRational,
  multiplyRational,
  rational,
  subtractRational,
  type Rational,
} from "./rational";

export interface LinearSystem2V {
  a1: Rational;
  b1: Rational;
  c1: Rational;
  a2: Rational;
  b2: Rational;
  c2: Rational;
}

export type LinearSystem2VSolution =
  | { kind: "UNIQUE"; x: Rational; y: Rational }
  | { kind: "NO_SOLUTION" }
  | { kind: "INFINITE_SOLUTIONS" };

export function linearSystemDeterminant(system: LinearSystem2V): Rational {
  return subtractRational(multiplyRational(system.a1, system.b2), multiplyRational(system.a2, system.b1));
}

export function solveLinearSystem2V(system: LinearSystem2V): LinearSystem2VSolution {
  const determinant = linearSystemDeterminant(system);
  if (determinant.numerator !== 0n) {
    const xNumerator = subtractRational(multiplyRational(system.c1, system.b2), multiplyRational(system.c2, system.b1));
    const yNumerator = subtractRational(multiplyRational(system.a1, system.c2), multiplyRational(system.a2, system.c1));
    return {
      kind: "UNIQUE",
      x: divideRational(xNumerator, determinant),
      y: divideRational(yNumerator, determinant),
    };
  }

  const ac = subtractRational(multiplyRational(system.a1, system.c2), multiplyRational(system.a2, system.c1));
  const bc = subtractRational(multiplyRational(system.b1, system.c2), multiplyRational(system.b2, system.c1));
  return ac.numerator === 0n && bc.numerator === 0n
    ? { kind: "INFINITE_SOLUTIONS" }
    : { kind: "NO_SOLUTION" };
}

export function verifyLinearSystemSolution(system: LinearSystem2V, x: Rational, y: Rational): boolean {
  const left1 = addRational(multiplyRational(system.a1, x), multiplyRational(system.b1, y));
  const left2 = addRational(multiplyRational(system.a2, x), multiplyRational(system.b2, y));
  return equalsRational(left1, system.c1) && equalsRational(left2, system.c2);
}

export function scaleLinearSystemRow(a: Rational, b: Rational, c: Rational, factor: Rational): [Rational, Rational, Rational] {
  if (equalsRational(factor, rational(0n))) throw new Error("Row scale factor cannot be zero");
  return [multiplyRational(a, factor), multiplyRational(b, factor), multiplyRational(c, factor)];
}
