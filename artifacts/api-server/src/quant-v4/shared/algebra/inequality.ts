import {
  ZERO,
  addRational,
  compareRational,
  divideRational,
  equalsRational,
  formatRational,
  multiplyRational,
  negateRational,
  rational,
  subtractRational,
  type Rational,
} from "./rational";
import { solveQuadraticEquation, type QuadraticEquation } from "./quadratic";

export type InequalityOperator = "LT" | "LE" | "GT" | "GE";

export interface RationalInterval {
  lower: Rational | null;
  lowerClosed: boolean;
  upper: Rational | null;
  upperClosed: boolean;
}

export type RationalIntervalSet = RationalInterval[];

export interface QuadraticExtremum {
  kind: "MINIMUM" | "MAXIMUM";
  x: Rational;
  value: Rational;
}

export type GlobalQuadraticSign = "POSITIVE" | "NONNEGATIVE" | "NEGATIVE" | "NONPOSITIVE";

export interface ParameterRange {
  operator: "LT" | "LE" | "GT" | "GE";
  bound: Rational;
}

function comparisonHolds(sign: -1 | 0 | 1, operator: InequalityOperator): boolean {
  switch (operator) {
    case "LT": return sign < 0;
    case "LE": return sign <= 0;
    case "GT": return sign > 0;
    case "GE": return sign >= 0;
  }
}

export function satisfiesZeroComparison(value: Rational, operator: InequalityOperator): boolean {
  return comparisonHolds(compareRational(value, ZERO), operator);
}

function leftRay(boundary: Rational, closed: boolean): RationalIntervalSet {
  return [{ lower: null, lowerClosed: false, upper: boundary, upperClosed: closed }];
}

function rightRay(boundary: Rational, closed: boolean): RationalIntervalSet {
  return [{ lower: boundary, lowerClosed: closed, upper: null, upperClosed: false }];
}

export function allRealIntervals(): RationalIntervalSet {
  return [{ lower: null, lowerClosed: false, upper: null, upperClosed: false }];
}

export function solveLinearInequality(a: Rational, b: Rational, operator: InequalityOperator): RationalIntervalSet {
  if (a.numerator === 0n) return satisfiesZeroComparison(b, operator) ? allRealIntervals() : [];
  const boundary = divideRational(negateRational(b), a);
  const coefficientSign = compareRational(a, ZERO);
  const includesEquality = operator === "LE" || operator === "GE";
  const wantsGreater = operator === "GT" || operator === "GE";
  const goesRight = coefficientSign > 0 ? wantsGreater : !wantsGreater;
  return goesRight ? rightRay(boundary, includesEquality) : leftRay(boundary, includesEquality);
}

function maxLower(a: RationalInterval, b: RationalInterval): { value: Rational | null; closed: boolean } {
  if (a.lower === null) return { value: b.lower, closed: b.lowerClosed };
  if (b.lower === null) return { value: a.lower, closed: a.lowerClosed };
  const cmp = compareRational(a.lower, b.lower);
  if (cmp > 0) return { value: a.lower, closed: a.lowerClosed };
  if (cmp < 0) return { value: b.lower, closed: b.lowerClosed };
  return { value: a.lower, closed: a.lowerClosed && b.lowerClosed };
}

function minUpper(a: RationalInterval, b: RationalInterval): { value: Rational | null; closed: boolean } {
  if (a.upper === null) return { value: b.upper, closed: b.upperClosed };
  if (b.upper === null) return { value: a.upper, closed: a.upperClosed };
  const cmp = compareRational(a.upper, b.upper);
  if (cmp < 0) return { value: a.upper, closed: a.upperClosed };
  if (cmp > 0) return { value: b.upper, closed: b.upperClosed };
  return { value: a.upper, closed: a.upperClosed && b.upperClosed };
}

function validInterval(interval: RationalInterval): boolean {
  if (interval.lower === null || interval.upper === null) return true;
  const cmp = compareRational(interval.lower, interval.upper);
  if (cmp < 0) return true;
  return cmp === 0 && interval.lowerClosed && interval.upperClosed;
}

export function intersectIntervalSets(a: RationalIntervalSet, b: RationalIntervalSet): RationalIntervalSet {
  const result: RationalIntervalSet = [];
  for (const left of a) {
    for (const right of b) {
      const lower = maxLower(left, right);
      const upper = minUpper(left, right);
      const interval: RationalInterval = {
        lower: lower.value,
        lowerClosed: lower.value === null ? false : lower.closed,
        upper: upper.value,
        upperClosed: upper.value === null ? false : upper.closed,
      };
      if (validInterval(interval)) result.push(interval);
    }
  }
  return result;
}

export function intervalContains(set: RationalIntervalSet, value: Rational): boolean {
  return set.some((interval) => {
    if (interval.lower !== null) {
      const cmp = compareRational(value, interval.lower);
      if (cmp < 0 || (cmp === 0 && !interval.lowerClosed)) return false;
    }
    if (interval.upper !== null) {
      const cmp = compareRational(value, interval.upper);
      if (cmp > 0 || (cmp === 0 && !interval.upperClosed)) return false;
    }
    return true;
  });
}

function pointInterval(value: Rational): RationalIntervalSet {
  return [{ lower: value, lowerClosed: true, upper: value, upperClosed: true }];
}

export function solveQuadraticInequality(equation: QuadraticEquation, operator: InequalityOperator): RationalIntervalSet {
  const rootState = solveQuadraticEquation(equation);
  const aPositive = compareRational(equation.a, ZERO) > 0;
  const wantsPositive = operator === "GT" || operator === "GE";
  const includesEquality = operator === "GE" || operator === "LE";

  if (rootState.kind === "NO_REAL_ROOTS") {
    const signMatches = wantsPositive === aPositive;
    return signMatches ? allRealIntervals() : [];
  }

  if (rootState.kind === "TWO_IRRATIONAL_ROOTS") {
    throw new Error("Rational interval solver does not approximate irrational quadratic boundaries");
  }

  if (rootState.kind === "REPEATED_ROOT") {
    const signAwayFromRootMatches = wantsPositive === aPositive;
    if (signAwayFromRootMatches) {
      if (includesEquality) return allRealIntervals();
      return [
        { lower: null, lowerClosed: false, upper: rootState.root, upperClosed: false },
        { lower: rootState.root, lowerClosed: false, upper: null, upperClosed: false },
      ];
    }
    return includesEquality ? pointInterval(rootState.root) : [];
  }

  let [r1, r2] = rootState.roots;
  if (compareRational(r1, r2) > 0) [r1, r2] = [r2, r1];
  const outsideMatches = wantsPositive === aPositive;
  if (outsideMatches) {
    return [
      { lower: null, lowerClosed: false, upper: r1, upperClosed: includesEquality },
      { lower: r2, lowerClosed: includesEquality, upper: null, upperClosed: false },
    ];
  }
  return [{ lower: r1, lowerClosed: includesEquality, upper: r2, upperClosed: includesEquality }];
}

export function quadraticExtremum(equation: QuadraticEquation): QuadraticExtremum {
  if (equation.a.numerator === 0n) throw new Error("Quadratic extremum requires nonzero a");
  const x = divideRational(negateRational(equation.b), multiplyRational(rational(2n), equation.a));
  const value = addRational(
    addRational(multiplyRational(equation.a, multiplyRational(x, x)), multiplyRational(equation.b, x)),
    equation.c,
  );
  return { kind: compareRational(equation.a, ZERO) > 0 ? "MINIMUM" : "MAXIMUM", x, value };
}

export function constantParameterRangeForGlobalQuadraticSign(
  a: Rational,
  b: Rational,
  target: GlobalQuadraticSign,
): ParameterRange {
  if (a.numerator === 0n) throw new Error("Global quadratic sign requires nonzero a");
  const aPositive = compareRational(a, ZERO) > 0;
  const targetPositive = target === "POSITIVE" || target === "NONNEGATIVE";
  if (aPositive !== targetPositive) throw new Error("Requested global sign is incompatible with the leading coefficient");
  const strict = target === "POSITIVE" || target === "NEGATIVE";
  const bound = divideRational(multiplyRational(b, b), multiplyRational(rational(4n), a));
  if (aPositive) return { operator: strict ? "GT" : "GE", bound };
  return { operator: strict ? "LT" : "LE", bound };
}

function floorRational(value: Rational): bigint {
  const { numerator: n, denominator: d } = value;
  if (n >= 0n) return n / d;
  return -((-n + d - 1n) / d);
}

function ceilRational(value: Rational): bigint {
  return -floorRational(negateRational(value));
}

export function countIntegersInIntervalSet(set: RationalIntervalSet): bigint {
  let total = 0n;
  for (const interval of set) {
    if (interval.lower === null || interval.upper === null) throw new Error("Cannot count integers in an unbounded interval");
    let first = ceilRational(interval.lower);
    if (!interval.lowerClosed && equalsRational(rational(first), interval.lower)) first += 1n;
    let last = floorRational(interval.upper);
    if (!interval.upperClosed && equalsRational(rational(last), interval.upper)) last -= 1n;
    if (last >= first) total += last - first + 1n;
  }
  return total;
}

export function formatIntervalSet(set: RationalIntervalSet): string {
  if (set.length === 0) return "∅";
  if (set.length === 1 && set[0]!.lower === null && set[0]!.upper === null) return "all real numbers";
  return set.map((interval) => {
    if (interval.lower !== null && interval.upper !== null && equalsRational(interval.lower, interval.upper) && interval.lowerClosed && interval.upperClosed) {
      return `{${formatRational(interval.lower)}}`;
    }
    const left = interval.lowerClosed ? "[" : "(";
    const right = interval.upperClosed ? "]" : ")";
    return `${left}${interval.lower === null ? "-∞" : formatRational(interval.lower)}, ${interval.upper === null ? "∞" : formatRational(interval.upper)}${right}`;
  }).join(" ∪ ");
}

export function evaluateQuadratic(equation: QuadraticEquation, x: Rational): Rational {
  return addRational(
    addRational(multiplyRational(equation.a, multiplyRational(x, x)), multiplyRational(equation.b, x)),
    equation.c,
  );
}

export function evaluateLinear(a: Rational, b: Rational, x: Rational): Rational {
  return addRational(multiplyRational(a, x), b);
}

export function intervalSetEquals(a: RationalIntervalSet, b: RationalIntervalSet): boolean {
  if (a.length !== b.length) return false;
  return a.every((left, index) => {
    const right = b[index]!;
    return left.lowerClosed === right.lowerClosed
      && left.upperClosed === right.upperClosed
      && (left.lower === null ? right.lower === null : right.lower !== null && equalsRational(left.lower, right.lower))
      && (left.upper === null ? right.upper === null : right.upper !== null && equalsRational(left.upper, right.upper));
  });
}

export function parameterRangeContains(range: ParameterRange, value: Rational): boolean {
  return comparisonHolds(compareRational(value, range.bound), range.operator);
}

export function formatParameterRange(variable: string, range: ParameterRange): string {
  const symbol = range.operator === "GT" ? ">" : range.operator === "GE" ? "≥" : range.operator === "LT" ? "<" : "≤";
  return `${variable} ${symbol} ${formatRational(range.bound)}`;
}

export function subtractFromEachSide(value: Rational, amount: Rational): Rational {
  return subtractRational(value, amount);
}
