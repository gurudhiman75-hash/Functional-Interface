import { mathJaxFor } from "./math";
import type { NsExp001Parameters, NsExp001SolverResult, NsExp001VariableMap } from "./types";

function v(values: NsExp001VariableMap, key: string): number {
  const result = values[key];
  if (!Number.isFinite(result)) throw new Error(`Missing/invalid NS-EXP-001 variable: ${key}`);
  return result;
}

function powerForm(base: number, exponent: number): string {
  if (!Number.isInteger(exponent)) throw new Error(`Non-integer exponent in canonical power result: ${exponent}`);
  if (exponent === 0) return "1";
  if (exponent > 0) return `${base}^${exponent}`;
  return `1/${base}^${-exponent}`;
}

function bigintPower(base: number, exponent: number): bigint {
  if (!Number.isInteger(exponent) || exponent < 0) throw new Error("bigintPower requires a non-negative integer exponent");
  return BigInt(base) ** BigInt(exponent);
}

function exactNthRoot(value: number, degree: number): number {
  if (!Number.isInteger(value) || value <= 0 || !Number.isInteger(degree) || degree < 2) {
    throw new Error("Invalid exact root input");
  }
  let low = 1;
  let high = value;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const power = mid ** degree;
    if (power === value) return mid;
    if (power < value) low = mid + 1;
    else high = mid - 1;
  }
  throw new Error(`${value} is not a perfect ${degree}-th power`);
}

function primePowerValue(prime: number, exponent: number): string {
  if (exponent >= 0) return bigintPower(prime, exponent).toString();
  return `1/${bigintPower(prime, -exponent).toString()}`;
}

function term(base: number, exponent: number) {
  return `${base}^${exponent}`;
}

function solveCp01(p: NsExp001Parameters): string {
  const x = p.variables;
  const base = v(x, "base");
  switch (p.operationType) {
    case "powerOfPower": return powerForm(base, v(x, "innerExponent") * v(x, "outerExponent") - v(x, "resultExponent"));
    case "denominatorProduct": return powerForm(base, v(x, "firstExponent") - (v(x, "secondExponent") + v(x, "thirdExponent")));
    case "divideThenMultiply": return powerForm(base, (v(x, "firstExponent") - v(x, "secondExponent")) + v(x, "thirdExponent"));
    case "multiplyThenDivide": return powerForm(base, (v(x, "firstExponent") + v(x, "secondExponent")) - v(x, "thirdExponent"));
    case "multiplyByBaseThenDivide": return powerForm(base, v(x, "firstExponent") + 1 - v(x, "secondExponent"));
    case "multiplication": return powerForm(base, v(x, "firstExponent") + v(x, "secondExponent"));
    default: return powerForm(base, v(x, "firstExponent") - v(x, "secondExponent"));
  }
}

function solveCp02(p: NsExp001Parameters): string {
  const x = p.variables;
  const target = v(x, "targetExponent");
  switch (p.operationType) {
    case "directEquality": return `${target}`;
    case "plusConstant": return `${target - v(x, "constant")}`;
    case "minusConstant": return `${target + v(x, "constant")}`;
    case "coefficientMinusConstant": return `${(target + v(x, "constant")) / v(x, "coefficient")}`;
    case "coefficientPlusConstant": return `${(target - v(x, "constant")) / v(x, "coefficient")}`;
    case "divisorEquation": return `${target * v(x, "divisor")}`;
    default: return `${target / v(x, "coefficient")}`;
  }
}

function solveComparison(p: NsExp001Parameters, includeThird: boolean): string {
  const x = p.variables;
  const p1 = v(x, "transformationPower1");
  const p2 = v(x, "transformationPower2");
  const e1 = v(x, "firstExponent");
  const e2 = v(x, "secondExponent");
  const items = [
    { text: term(v(x, "visibleBase1"), e1), weight: p1 * e1 },
    { text: term(v(x, "visibleBase2"), e2), weight: p2 * e2 },
  ];
  if (includeThird) {
    const p3 = v(x, "transformationPower3");
    const e3 = v(x, "thirdExponent");
    items.push({ text: term(v(x, "visibleBase3"), e3), weight: p3 * e3 });
  }
  if (p.operationType === "ordering") {
    items.sort((a, b) => a.weight - b.weight);
    if (p.comparisonMode === "descending") items.reverse();
    return items.map((item) => item.text).join(", ");
  }
  if (p.operationType === "greatest" || p.operationType === "smallest") {
    items.sort((a, b) => a.weight - b.weight);
    return p.operationType === "greatest" ? items[items.length - 1]!.text : items[0]!.text;
  }
  if (items[0]!.weight === items[1]!.weight) return "equal";
  if (p.comparisonMode === "relation") return items[0]!.weight > items[1]!.weight ? `${items[0]!.text} > ${items[1]!.text}` : `${items[0]!.text} < ${items[1]!.text}`;
  if (p.comparisonMode === "smaller") return items[0]!.weight < items[1]!.weight ? items[0]!.text : items[1]!.text;
  return items[0]!.weight > items[1]!.weight ? items[0]!.text : items[1]!.text;
}

function solveCp03(p: NsExp001Parameters): string {
  const x = p.variables;
  const p1 = v(x, "transformationPower1");
  const p2 = v(x, "transformationPower2");
  if (p.operationType === "simplification") return powerForm(v(x, "commonBase"), p1 * v(x, "firstExponent") - p2 * v(x, "secondExponent"));
  if (p.operationType === "equationDirect") return `${p2 * v(x, "targetExponent") / p1}`;
  if (p.operationType === "equationShift") return `${p2 * v(x, "targetExponent") / p1 - v(x, "shift")}`;
  if (p.operationType === "equationCoefficient") return `${p2 * v(x, "targetExponent") / (p1 * v(x, "coefficient"))}`;
  if (p.operationType === "equationRightX") return `${p1 * v(x, "firstExponent") / p2}`;
  return solveComparison(p, p.operationType === "ordering" || p.operationType === "greatest" || p.operationType === "smallest");
}

function solveCp04(p: NsExp001Parameters): string {
  const x = p.variables;
  const base = v(x, "base");
  if (p.operationType === "negativeOnly") return powerForm(base, v(x, "negativeExponent"));
  if (p.operationType === "negativeFraction") return powerForm(base, v(x, "firstNegativeExponent") - v(x, "secondNegativeExponent"));
  if (p.operationType === "positiveOverNegative") return powerForm(base, v(x, "positiveExponent") - v(x, "negativeExponent"));
  return powerForm(base, v(x, "positiveExponent") + v(x, "negativeExponent"));
}

function solveCp05(p: NsExp001Parameters): string {
  const x = p.variables;
  const base = v(x, "base");
  const denominator = p.operationType === "threeHalves" ? 2 : p.operationType === "rootOnly" ? v(x, "rootDegree") : v(x, "fractionalExponentDenominator");
  const numerator = p.operationType === "threeHalves" ? 3 : p.operationType === "rootOnly" ? 1 : v(x, "fractionalExponentNumerator");
  const root = exactNthRoot(base, denominator);
  return bigintPower(root, numerator).toString();
}

function solveCp06(p: NsExp001Parameters): string {
  const x = p.variables;
  const prime = v(x, "commonPrime");
  const basePower = v(x, "basePower");
  const numerator = v(x, "fractionalExponentNumerator");
  const positive = v(x, "positiveExponent");
  const negative = v(x, "negativeExponent");
  const divisorPower = v(x, "divisorPower");
  const rootDegree = v(x, "rootDegree");
  let exponent: number;
  switch (p.operationType) {
    case "fractionalPowerThenDividePowered": exponent = numerator * positive - divisorPower * rootDegree; break;
    case "fractionalOverNegative": exponent = numerator - basePower * negative; break;
    case "fractionalPlusIntegerDivisor": exponent = numerator + basePower * positive - divisorPower; break;
    case "rootTimesNegative": exponent = 1 + basePower * negative; break;
    case "rootPowerDivisor": exponent = positive - divisorPower; break;
    case "rootOverPower": exponent = 1 - basePower * rootDegree; break;
    case "rootIntegerOverNegative": exponent = 1 + basePower * positive - basePower * negative; break;
    case "rootIntegerOverPower": exponent = 1 + basePower * positive - basePower * rootDegree; break;
    case "fractionalTimesNegative": exponent = numerator + basePower * negative; break;
    default: exponent = basePower * (positive + negative) - divisorPower;
  }
  return primePowerValue(prime, exponent);
}

function solveCp09(p: NsExp001Parameters): string {
  const x = p.variables;
  const base = v(x, "base");
  const known = BigInt(v(x, "knownValue"));
  if (p.operationType === "increase") return (known * bigintPower(base, v(x, "increment"))).toString();
  if (p.operationType === "decrease") return (known / bigintPower(base, v(x, "decrement"))).toString();
  return (known ** BigInt(v(x, "multiplier"))).toString();
}

function recompute(p: NsExp001Parameters): string {
  switch (p.canonicalProblemId) {
    case "CP01": return solveCp01(p);
    case "CP02": return solveCp02(p);
    case "CP03": return solveCp03(p);
    case "CP04": return solveCp04(p);
    case "CP05": return solveCp05(p);
    case "CP06": return solveCp06(p);
    case "CP07": return solveComparison(p, p.operationType === "ordering" || p.operationType === "greatest" || p.operationType === "smallest");
    case "CP09": return solveCp09(p);
  }
}

export function solveNsExp001(parameters: NsExp001Parameters): NsExp001SolverResult {
  const answer = recompute(parameters);
  const mathJax = mathJaxFor(parameters.canonicalProblemId, parameters.expression, answer);
  const independentlyVerified = answer === parameters.expectedAnswer;
  return {
    answer,
    ...mathJax,
    verification: {
      inputValid: parameters.expression.length > 0 && Object.keys(parameters.variables).length > 0,
      answerRecomputed: true,
      independentlyVerified,
      referenceAnswer: parameters.expectedAnswer,
      mathJaxValid: Object.values(mathJax).some((value) => value.length > 0),
    },
  };
}
