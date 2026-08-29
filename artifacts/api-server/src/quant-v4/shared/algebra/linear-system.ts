import {
  addRational,
  divideRational,
  equalsRational,
  multiplyRational,
  negateRational,
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

export interface LinearSystem3V {
  a1: Rational;
  b1: Rational;
  c1: Rational;
  d1: Rational;
  a2: Rational;
  b2: Rational;
  c2: Rational;
  d2: Rational;
  a3: Rational;
  b3: Rational;
  c3: Rational;
  d3: Rational;
}

export type LinearSystem3VSolution =
  | { kind: "UNIQUE"; x: Rational; y: Rational; z: Rational }
  | { kind: "SINGULAR" };

function determinant3(
  a11: Rational, a12: Rational, a13: Rational,
  a21: Rational, a22: Rational, a23: Rational,
  a31: Rational, a32: Rational, a33: Rational,
): Rational {
  const firstMinor = subtractRational(multiplyRational(a22, a33), multiplyRational(a23, a32));
  const secondMinor = subtractRational(multiplyRational(a21, a33), multiplyRational(a23, a31));
  const thirdMinor = subtractRational(multiplyRational(a21, a32), multiplyRational(a22, a31));
  return addRational(
    addRational(multiplyRational(a11, firstMinor), negateRational(multiplyRational(a12, secondMinor))),
    multiplyRational(a13, thirdMinor),
  );
}

export function linearSystem3VDeterminant(system: LinearSystem3V): Rational {
  return determinant3(
    system.a1, system.b1, system.c1,
    system.a2, system.b2, system.c2,
    system.a3, system.b3, system.c3,
  );
}

export function solveLinearSystem3V(system: LinearSystem3V): LinearSystem3VSolution {
  const determinant = linearSystem3VDeterminant(system);
  if (determinant.numerator === 0n) return { kind: "SINGULAR" };

  const dx = determinant3(
    system.d1, system.b1, system.c1,
    system.d2, system.b2, system.c2,
    system.d3, system.b3, system.c3,
  );
  const dy = determinant3(
    system.a1, system.d1, system.c1,
    system.a2, system.d2, system.c2,
    system.a3, system.d3, system.c3,
  );
  const dz = determinant3(
    system.a1, system.b1, system.d1,
    system.a2, system.b2, system.d2,
    system.a3, system.b3, system.d3,
  );

  return {
    kind: "UNIQUE",
    x: divideRational(dx, determinant),
    y: divideRational(dy, determinant),
    z: divideRational(dz, determinant),
  };
}

export function verifyLinearSystem3VSolution(system: LinearSystem3V, x: Rational, y: Rational, z: Rational): boolean {
  const row = (a: Rational, b: Rational, c: Rational) => addRational(
    addRational(multiplyRational(a, x), multiplyRational(b, y)),
    multiplyRational(c, z),
  );
  return equalsRational(row(system.a1, system.b1, system.c1), system.d1)
    && equalsRational(row(system.a2, system.b2, system.c2), system.d2)
    && equalsRational(row(system.a3, system.b3, system.c3), system.d3);
}
