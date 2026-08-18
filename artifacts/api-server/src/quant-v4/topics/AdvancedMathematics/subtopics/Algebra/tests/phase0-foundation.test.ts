function assertEqual<T>(actual: T, expected: T, message?: string): void {
  if (actual !== expected) throw new Error(message ?? `Expected ${String(expected)}, got ${String(actual)}`);
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, entry) => typeof entry === "bigint" ? `${entry}n` : entry);
}

function assertDeepEqual(actual: unknown, expected: unknown, message?: string): void {
  if (stable(actual) !== stable(expected)) throw new Error(message ?? `Expected ${stable(expected)}, got ${stable(actual)}`);
}

import {
  addRational,
  evaluateExpression,
  equalsPolynomial,
  equalsRational,
  evaluatePolynomial,
  multiplyPolynomials,
  polynomial,
  powerSumOfQuadraticRoots,
  quadraticSurd,
  rational,
  reciprocalPlusPowerSum,
  solveLinearEquation,
  solveQuadraticEquation,
  verifyLinearSolution,
} from "../../../../../shared/algebra";

function testRationalCore(): void {
  assertDeepEqual(rational(6n, -8n), rational(-3n, 4n));
  assertDeepEqual(addRational(rational(1n, 3n), rational(1n, 6n)), rational(1n, 2n));
}

function testExpressionAst(): void {
  const expression = {
    kind: "ADD" as const,
    terms: [
      { kind: "MUL" as const, factors: [{ kind: "CONST" as const, value: rational(3n) }, { kind: "VAR" as const, name: "x" }] },
      { kind: "CONST" as const, value: rational(7n) },
    ],
  };
  assertDeepEqual(evaluateExpression(expression, { x: rational(6n) }), rational(25n));
}

function testLinearEquation(): void {
  const equation = {
    leftCoefficient: rational(3n),
    leftConstant: rational(7n),
    rightCoefficient: rational(0n),
    rightConstant: rational(25n),
  };
  const solution = solveLinearEquation(equation);
  assertEqual(solution.kind, "UNIQUE");
  if (solution.kind !== "UNIQUE") throw new Error("Expected unique solution");
  assertDeepEqual(solution.value, rational(6n));
  assertEqual(verifyLinearSolution(equation, solution.value), true);

  assertEqual(solveLinearEquation({
    leftCoefficient: rational(2n), leftConstant: rational(3n),
    rightCoefficient: rational(2n), rightConstant: rational(9n),
  }).kind, "NO_SOLUTION");

  assertEqual(solveLinearEquation({
    leftCoefficient: rational(2n), leftConstant: rational(3n),
    rightCoefficient: rational(2n), rightConstant: rational(3n),
  }).kind, "INFINITE_SOLUTIONS");
}

function testPolynomialCore(): void {
  const xMinus2 = polynomial("x", [rational(-2n), rational(1n)]);
  const xMinus3 = polynomial("x", [rational(-3n), rational(1n)]);
  const product = multiplyPolynomials(xMinus2, xMinus3);
  assertEqual(equalsPolynomial(product, polynomial("x", [rational(6n), rational(-5n), rational(1n)])), true);
  assertDeepEqual(evaluatePolynomial(product, rational(2n)), rational(0n));
}

function testSharedPowerSum(): void {
  assertDeepEqual(reciprocalPlusPowerSum(rational(5n), 2), rational(23n));
  assertDeepEqual(reciprocalPlusPowerSum(rational(5n), 3), rational(110n));
  assertDeepEqual(powerSumOfQuadraticRoots(rational(5n), rational(6n), 3), rational(35n));
}

function testQuadraticSurdAndSolver(): void {
  assertDeepEqual(quadraticSurd(rational(0n), rational(1n), 12n), quadraticSurd(rational(0n), rational(2n), 3n));

  const rationalRoots = solveQuadraticEquation({ a: rational(1n), b: rational(-5n), c: rational(6n) });
  assertEqual(rationalRoots.kind, "TWO_RATIONAL_ROOTS");
  if (rationalRoots.kind === "TWO_RATIONAL_ROOTS") {
    const roots = rationalRoots.roots;
    assertEqual(roots.some((root) => equalsRational(root, rational(2n))), true);
    assertEqual(roots.some((root) => equalsRational(root, rational(3n))), true);
  }

  assertEqual(solveQuadraticEquation({ a: rational(1n), b: rational(-4n), c: rational(4n) }).kind, "REPEATED_ROOT");
  assertEqual(solveQuadraticEquation({ a: rational(1n), b: rational(0n), c: rational(-2n) }).kind, "TWO_IRRATIONAL_ROOTS");
  assertEqual(solveQuadraticEquation({ a: rational(1n), b: rational(0n), c: rational(1n) }).kind, "NO_REAL_ROOTS");
}

function run(): void {
  testRationalCore();
  testExpressionAst();
  testLinearEquation();
  testPolynomialCore();
  testSharedPowerSum();
  testQuadraticSurdAndSolver();
  console.log("ALG-001 Phase 0 foundation tests passed");
}

run();
