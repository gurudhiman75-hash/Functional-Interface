import type { NsExp001CanonicalProblemId, NsExp001VariableMap } from "./types";

export interface NsExp001ReferenceInput {
  cpId: NsExp001CanonicalProblemId;
  operationType: string;
  comparisonMode?: string;
  variables: NsExp001VariableMap;
}

function value(v: NsExp001VariableMap, key: string): number {
  const result = v[key];
  if (!Number.isFinite(result)) throw new Error(`Missing/invalid NS-EXP-001 variable: ${key}`);
  return result;
}

function powerForm(base: number, exponent: number): string {
  if (exponent === 0) return "1";
  if (exponent > 0) return `${base}^${exponent}`;
  return `1/${base}^${-exponent}`;
}

function integerPower(base: number, exponent: number): bigint {
  if (!Number.isInteger(exponent) || exponent < 0) throw new Error("integerPower requires a non-negative integer exponent");
  return BigInt(base) ** BigInt(exponent);
}

function rationalPowerValue(base: number, numerator: number, denominator: number): string {
  const approximateRoot = Math.round(base ** (1 / denominator));
  if (approximateRoot ** denominator !== base) {
    throw new Error(`Reference verifier received non-perfect ${denominator}-th power base ${base}`);
  }
  return integerPower(approximateRoot, numerator).toString();
}

function primePowerValue(prime: number, exponent: number): string {
  if (exponent >= 0) return integerPower(prime, exponent).toString();
  return `1/${integerPower(prime, -exponent).toString()}`;
}

function renderedTerm(base: number, exponent: number): string {
  return `${base}^${exponent}`;
}

function compareTerms(
  leftBase: number,
  leftExponent: number,
  leftWeight: number,
  rightBase: number,
  rightExponent: number,
  rightWeight: number,
  mode: string,
): string {
  const left = renderedTerm(leftBase, leftExponent);
  const right = renderedTerm(rightBase, rightExponent);
  if (leftWeight === rightWeight) return "equal";
  if (mode === "smaller" || mode === "smallest") return leftWeight < rightWeight ? left : right;
  if (mode === "relation") return leftWeight > rightWeight ? `${left} > ${right}` : `${left} < ${right}`;
  return leftWeight > rightWeight ? left : right;
}

export function referenceAnswerFor(input: NsExp001ReferenceInput): string {
  const { cpId, operationType, comparisonMode = "greater", variables: v } = input;

  if (cpId === "CP01") {
    const base = value(v, "base");
    if (operationType === "powerOfPower") {
      return powerForm(base, value(v, "innerExponent") * value(v, "outerExponent") - value(v, "resultExponent"));
    }
    if (operationType === "denominatorProduct") {
      return powerForm(base, value(v, "firstExponent") - value(v, "secondExponent") - value(v, "thirdExponent"));
    }
    if (operationType === "divideThenMultiply") {
      return powerForm(base, value(v, "firstExponent") - value(v, "secondExponent") + value(v, "thirdExponent"));
    }
    if (operationType === "multiplyThenDivide") {
      return powerForm(base, value(v, "firstExponent") + value(v, "secondExponent") - value(v, "thirdExponent"));
    }
    if (operationType === "multiplyByBaseThenDivide") {
      return powerForm(base, value(v, "firstExponent") + 1 - value(v, "secondExponent"));
    }
    if (operationType === "multiplication") return powerForm(base, value(v, "firstExponent") + value(v, "secondExponent"));
    return powerForm(base, value(v, "firstExponent") - value(v, "secondExponent"));
  }

  if (cpId === "CP02") {
    const target = value(v, "targetExponent");
    if (operationType === "directEquality") return String(target);
    if (operationType === "plusConstant") return String(target - value(v, "constant"));
    if (operationType === "minusConstant") return String(target + value(v, "constant"));
    if (operationType === "coefficientMinusConstant") return String((target + value(v, "constant")) / value(v, "coefficient"));
    if (operationType === "coefficientPlusConstant") return String((target - value(v, "constant")) / value(v, "coefficient"));
    if (operationType === "divisorEquation") return String(target * value(v, "divisor"));
    return String(target / value(v, "coefficient"));
  }

  if (cpId === "CP03") {
    const commonBase = value(v, "commonBase");
    const p1 = value(v, "transformationPower1");
    const p2 = value(v, "transformationPower2");
    const e1 = value(v, "firstExponent");
    const e2 = value(v, "secondExponent");
    if (operationType === "simplification") return powerForm(commonBase, p1 * e1 - p2 * e2);
    if (operationType === "equationDirect") return String((p2 * value(v, "targetExponent")) / p1);
    if (operationType === "equationShift") return String((p2 * value(v, "targetExponent")) / p1 - value(v, "shift"));
    if (operationType === "equationCoefficient") return String((p2 * value(v, "targetExponent")) / (p1 * value(v, "coefficient")));
    if (operationType === "equationRightX") return String((p1 * e1) / p2);
    if (operationType === "ordering") {
      const p3 = value(v, "transformationPower3");
      const e3 = value(v, "thirdExponent");
      const items = [
        { text: renderedTerm(value(v, "visibleBase1"), e1), weight: p1 * e1 },
        { text: renderedTerm(value(v, "visibleBase2"), e2), weight: p2 * e2 },
        { text: renderedTerm(value(v, "visibleBase3"), e3), weight: p3 * e3 },
      ].sort((a, b) => a.weight - b.weight);
      if (comparisonMode === "descending") items.reverse();
      return items.map((item) => item.text).join(", ");
    }
    if (operationType === "greatest" || operationType === "smallest") {
      const p3 = value(v, "transformationPower3");
      const e3 = value(v, "thirdExponent");
      const items = [
        { text: renderedTerm(value(v, "visibleBase1"), e1), weight: p1 * e1 },
        { text: renderedTerm(value(v, "visibleBase2"), e2), weight: p2 * e2 },
        { text: renderedTerm(value(v, "visibleBase3"), e3), weight: p3 * e3 },
      ].sort((a, b) => a.weight - b.weight);
      return operationType === "greatest" ? items[items.length - 1]!.text : items[0]!.text;
    }
    return compareTerms(value(v, "visibleBase1"), e1, p1 * e1, value(v, "visibleBase2"), e2, p2 * e2, comparisonMode);
  }

  if (cpId === "CP04") {
    const base = value(v, "base");
    if (operationType === "negativeOnly") return powerForm(base, value(v, "negativeExponent"));
    if (operationType === "negativeFraction") return powerForm(base, value(v, "firstNegativeExponent") - value(v, "secondNegativeExponent"));
    if (operationType === "positiveOverNegative") return powerForm(base, value(v, "positiveExponent") - value(v, "negativeExponent"));
    return powerForm(base, value(v, "positiveExponent") + value(v, "negativeExponent"));
  }

  if (cpId === "CP05") {
    const base = value(v, "base");
    if (operationType === "threeHalves") return rationalPowerValue(base, 3, 2);
    if (operationType === "rootOnly") return rationalPowerValue(base, 1, value(v, "rootDegree"));
    return rationalPowerValue(base, value(v, "fractionalExponentNumerator"), value(v, "fractionalExponentDenominator"));
  }

  if (cpId === "CP06") {
    const prime = value(v, "commonPrime");
    const basePower = value(v, "basePower");
    const numerator = value(v, "fractionalExponentNumerator");
    const denominator = value(v, "fractionalExponentDenominator");
    const positive = value(v, "positiveExponent");
    const negative = value(v, "negativeExponent");
    const divisorPower = value(v, "divisorPower");
    const rootDegree = value(v, "rootDegree");
    if (denominator !== basePower) throw new Error("CP06 reference state requires denominator = basePower");
    let exponent: number;
    switch (operationType) {
      case "mixedIntegerNegativeDivisor": exponent = basePower * (positive + negative) - divisorPower; break;
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

  if (cpId === "CP07") {
    const p1 = value(v, "transformationPower1");
    const p2 = value(v, "transformationPower2");
    const p3 = value(v, "transformationPower3");
    const e1 = value(v, "firstExponent");
    const e2 = value(v, "secondExponent");
    const e3 = value(v, "thirdExponent");
    if (operationType === "ordering") {
      const items = [
        { text: renderedTerm(value(v, "visibleBase1"), e1), weight: p1 * e1 },
        { text: renderedTerm(value(v, "visibleBase2"), e2), weight: p2 * e2 },
        { text: renderedTerm(value(v, "visibleBase3"), e3), weight: p3 * e3 },
      ].sort((a, b) => a.weight - b.weight);
      if (comparisonMode === "descending") items.reverse();
      return items.map((item) => item.text).join(", ");
    }
    if (operationType === "greatest" || operationType === "smallest") {
      const items = [
        { text: renderedTerm(value(v, "visibleBase1"), e1), weight: p1 * e1 },
        { text: renderedTerm(value(v, "visibleBase2"), e2), weight: p2 * e2 },
        { text: renderedTerm(value(v, "visibleBase3"), e3), weight: p3 * e3 },
      ].sort((a, b) => a.weight - b.weight);
      return operationType === "greatest" ? items[items.length - 1]!.text : items[0]!.text;
    }
    return compareTerms(value(v, "visibleBase1"), e1, p1 * e1, value(v, "visibleBase2"), e2, p2 * e2, comparisonMode);
  }

  const base = value(v, "base");
  const knownValue = BigInt(value(v, "knownValue"));
  if (operationType === "increase") return (knownValue * integerPower(base, value(v, "increment"))).toString();
  if (operationType === "decrease") return (knownValue / integerPower(base, value(v, "decrement"))).toString();
  const multiplier = value(v, "multiplier");
  return (knownValue ** BigInt(multiplier)).toString();
}
