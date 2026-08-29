import {
  absRational,
  addRational,
  compareRational,
  divideRational,
  equalsRational,
  formatRational,
  multiplyRational,
  negateRational,
  rational,
  type Rational,
} from "./rational";
import {
  allRealIntervals,
  intersectIntervalSets,
  solveLinearInequality,
  type InequalityOperator,
  type RationalInterval,
  type RationalIntervalSet,
} from "./inequality";

export type AbsoluteEquationSolution =
  | { kind: "NO_SOLUTION" }
  | { kind: "ALL_REAL" }
  | { kind: "FINITE"; values: Rational[] };

function equationTruth(constant: Rational, rhs: Rational): boolean {
  return equalsRational(absRational(constant), rhs);
}

function sortRationals(values: Rational[]): Rational[] {
  return [...values].sort((a, b) => compareRational(a, b));
}

function sortIntervals(intervals: RationalIntervalSet): RationalIntervalSet {
  return [...intervals].sort((a: RationalInterval, b: RationalInterval) => {
    if (a.lower === null) return b.lower === null ? 0 : -1;
    if (b.lower === null) return 1;
    return compareRational(a.lower, b.lower);
  });
}

export function solveAbsoluteLinearEquation(a: Rational, b: Rational, rhs: Rational): AbsoluteEquationSolution {
  if (rhs.numerator < 0n) return { kind: "NO_SOLUTION" };
  if (a.numerator === 0n) return equationTruth(b, rhs) ? { kind: "ALL_REAL" } : { kind: "NO_SOLUTION" };
  if (rhs.numerator === 0n) {
    return { kind: "FINITE", values: [divideRational(negateRational(b), a)] };
  }
  const positiveBranch = divideRational(addRational(rhs, negateRational(b)), a);
  const negativeBranch = divideRational(addRational(negateRational(rhs), negateRational(b)), a);
  return { kind: "FINITE", values: sortRationals([positiveBranch, negativeBranch]) };
}

export function solveEqualAbsoluteDistances(leftCenter: Rational, rightCenter: Rational): AbsoluteEquationSolution {
  if (equalsRational(leftCenter, rightCenter)) return { kind: "ALL_REAL" };
  return {
    kind: "FINITE",
    values: [divideRational(addRational(leftCenter, rightCenter), rational(2n))],
  };
}

export function solveAbsoluteLinearInequality(
  a: Rational,
  b: Rational,
  rhs: Rational,
  operator: InequalityOperator,
): RationalIntervalSet {
  if (a.numerator === 0n) {
    const sign = compareRational(absRational(b), rhs);
    const truth = operator === "GT" ? sign > 0 : operator === "GE" ? sign >= 0 : operator === "LT" ? sign < 0 : sign <= 0;
    return truth ? allRealIntervals() : [];
  }

  if (rhs.numerator < 0n) {
    return operator === "GT" || operator === "GE" ? allRealIntervals() : [];
  }

  if (rhs.numerator === 0n) {
    const root = divideRational(negateRational(b), a);
    if (operator === "LT") return [];
    if (operator === "LE") return [{ lower: root, lowerClosed: true, upper: root, upperClosed: true }];
    if (operator === "GE") return allRealIntervals();
    return [
      { lower: null, lowerClosed: false, upper: root, upperClosed: false },
      { lower: root, lowerClosed: false, upper: null, upperClosed: false },
    ];
  }

  const lowerConstant = addRational(b, rhs);
  const upperConstant = addRational(b, negateRational(rhs));

  if (operator === "LT" || operator === "LE") {
    const lowerOperator: InequalityOperator = operator === "LT" ? "GT" : "GE";
    const upperOperator: InequalityOperator = operator === "LT" ? "LT" : "LE";
    return intersectIntervalSets(
      solveLinearInequality(a, lowerConstant, lowerOperator),
      solveLinearInequality(a, upperConstant, upperOperator),
    );
  }

  const leftOperator: InequalityOperator = operator === "GT" ? "LT" : "LE";
  const rightOperator: InequalityOperator = operator === "GT" ? "GT" : "GE";
  return sortIntervals([
    ...solveLinearInequality(a, lowerConstant, leftOperator),
    ...solveLinearInequality(a, upperConstant, rightOperator),
  ]);
}

export function formatAbsoluteEquationSolution(solution: AbsoluteEquationSolution): string {
  if (solution.kind === "NO_SOLUTION") return "no real solution";
  if (solution.kind === "ALL_REAL") return "all real numbers";
  return solution.values.length === 1
    ? `x = ${formatRational(solution.values[0]!)}`
    : `x = ${solution.values.map(formatRational).join(" or ")}`;
}

export function absoluteLinearValue(a: Rational, b: Rational, x: Rational): Rational {
  return absRational(addRational(multiplyRational(a, x), b));
}

export function isAbsoluteInequalitySatisfied(value: Rational, rhs: Rational, operator: InequalityOperator): boolean {
  const sign = compareRational(value, rhs);
  return operator === "GT" ? sign > 0 : operator === "GE" ? sign >= 0 : operator === "LT" ? sign < 0 : sign <= 0;
}

export function absoluteDistance(center: Rational, x: Rational): Rational {
  return absRational(addRational(x, negateRational(center)));
}
