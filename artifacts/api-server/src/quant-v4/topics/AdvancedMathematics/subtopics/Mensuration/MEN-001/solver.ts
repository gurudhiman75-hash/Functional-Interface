import type {
  Men001AnswerDimension,
  Men001CanonicalAnswer,
  Men001Parameters,
  Men001SolverResult,
  Men001UnitPolicy,
} from "./types";

function requireValue(parameters: Men001Parameters, key: keyof Men001Parameters["values"]) {
  const value = parameters.values[key];
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    throw new Error(`MEN-001 requires a positive finite ${String(key)}.`);
  }
  return value;
}

function unitForPolicy(policy: Men001UnitPolicy): Men001SolverResult["unit"] {
  switch (policy) {
    case "CENTIMETRES": return "cm";
    case "METRES": return "m";
    case "SQUARE_CENTIMETRES": return "cm²";
    case "SQUARE_METRES": return "m²";
    case "RUPEES": return "₹";
  }
}

function integerMeasure(value: number, unit: Exclude<Men001SolverResult["unit"], "₹">, dimension: Exclude<Men001AnswerDimension, "COST">): Pick<Men001SolverResult, "exactAnswer" | "canonicalAnswer" | "answer"> {
  if (!Number.isInteger(value)) throw new Error(`MEN-001 expected an integer ${dimension} answer; received ${value}.`);
  const canonicalAnswer: Men001CanonicalAnswer = { kind: "unit", value, unit, precision: 0, display: `${value} ${unit}`, rounding: "exact", metadata: { dimension, exactKind: "INTEGER" } };
  return { exactAnswer: { kind: "INTEGER", value }, canonicalAnswer, answer: canonicalAnswer.display };
}

function currencyAnswer(value: number): Pick<Men001SolverResult, "exactAnswer" | "canonicalAnswer" | "answer"> {
  if (!Number.isInteger(value)) throw new Error(`MEN-001 expected an integer cost answer; received ${value}.`);
  const canonicalAnswer: Men001CanonicalAnswer = { kind: "currency", value, currency: "₹", precision: 0, display: `₹${value}`, rounding: "exact", metadata: { dimension: "COST", exactKind: "INTEGER" } };
  return { exactAnswer: { kind: "INTEGER", value }, canonicalAnswer, answer: canonicalAnswer.display };
}

function latexUnit(unit: "cm²" | "m²") {
  return unit === "cm²" ? "\\text{cm}^{2}" : "\\text{m}^{2}";
}

function surdAreaAnswer(coefficient: number, radicand: number, unit: "cm²" | "m²"): Pick<Men001SolverResult, "exactAnswer" | "canonicalAnswer" | "answer"> {
  if (!Number.isInteger(coefficient) || coefficient <= 0 || !Number.isInteger(radicand)) throw new Error("MEN-001 requires a positive integral exact surd state.");
  const latexValue = `${coefficient}\\sqrt{${radicand}}\\,${latexUnit(unit)}`;
  const canonicalAnswer: Men001CanonicalAnswer = { kind: "symbolic", value: latexValue, rendered: `$$${latexValue}$$`, display: `${coefficient}√${radicand} ${unit}`, rounding: "exact", metadata: { dimension: "AREA", exactKind: "SURD", radicand, unit } };
  return { exactAnswer: { kind: "SURD", coefficientNumerator: coefficient, coefficientDenominator: 1, radicand }, canonicalAnswer, answer: canonicalAnswer.rendered };
}

function heronValues(sideA: number, sideB: number, sideC: number) {
  if (sideA + sideB <= sideC || sideA + sideC <= sideB || sideB + sideC <= sideA) throw new Error("MEN-001 Heron state violates triangle inequality.");
  const semiperimeter = (sideA + sideB + sideC) / 2;
  const radicand = semiperimeter * (semiperimeter - sideA) * (semiperimeter - sideB) * (semiperimeter - sideC);
  const area = Math.sqrt(radicand);
  if (!Number.isInteger(area)) throw new Error(`MEN-001 expected an exact integral Heron area; received √${radicand}.`);
  return { semiperimeter, radicand, area };
}

function lengthUnit(parameters: Men001Parameters): "cm" | "m" {
  const unit = unitForPolicy(parameters.unitPolicy);
  if (unit !== "cm" && unit !== "m") throw new Error(`MEN-001 expected a length unit policy; received ${parameters.unitPolicy}.`);
  return unit;
}

function areaUnit(parameters: Men001Parameters): "cm²" | "m²" {
  const unit = unitForPolicy(parameters.unitPolicy);
  if (unit !== "cm²" && unit !== "m²") throw new Error(`MEN-001 expected an area unit policy; received ${parameters.unitPolicy}.`);
  return unit;
}

export function solveMen001(parameters: Men001Parameters): Men001SolverResult {
  switch (parameters.solveMode) {
    case "findTriangleAreaBaseHeight": {
      const base = requireValue(parameters, "base"); const height = requireValue(parameters, "height"); const area = (base * height) / 2; const unit = areaUnit(parameters);
      return { ...integerMeasure(area, unit, "AREA"), answerDimension: "AREA", unit, equation: `A = \\frac{1}{2}bh = \\frac{1}{2}\\times ${base}\\times ${height}`, workingValues: { base, height, area } };
    }
    case "findMissingHeightFromAreaAndBase": {
      const area = requireValue(parameters, "area"); const base = requireValue(parameters, "base"); const height = (2 * area) / base; const unit = lengthUnit(parameters);
      return { ...integerMeasure(height, unit, "LENGTH"), answerDimension: "LENGTH", unit, equation: `h = \\frac{2A}{b} = \\frac{2\\times ${area}}{${base}}`, workingValues: { area, base, height } };
    }
    case "findMissingBaseFromAreaAndHeight": {
      const area = requireValue(parameters, "area"); const height = requireValue(parameters, "height"); const base = (2 * area) / height; const unit = lengthUnit(parameters);
      return { ...integerMeasure(base, unit, "LENGTH"), answerDimension: "LENGTH", unit, equation: `b = \\frac{2A}{h} = \\frac{2\\times ${area}}{${height}}`, workingValues: { area, height, base } };
    }
    case "findTriangleAreaHeron": {
      const sideA = requireValue(parameters, "sideA"); const sideB = requireValue(parameters, "sideB"); const sideC = requireValue(parameters, "sideC"); const { semiperimeter, radicand, area } = heronValues(sideA, sideB, sideC); const unit = areaUnit(parameters);
      return { ...integerMeasure(area, unit, "AREA"), answerDimension: "AREA", unit, equation: `A = \\sqrt{s(s-a)(s-b)(s-c)}`, workingValues: { sideA, sideB, sideC, semiperimeter, radicand, area } };
    }
    case "findRightTriangleAreaFromLegs": {
      const legA = requireValue(parameters, "legA"); const legB = requireValue(parameters, "legB"); const area = (legA * legB) / 2; const unit = areaUnit(parameters);
      return { ...integerMeasure(area, unit, "AREA"), answerDimension: "AREA", unit, equation: `A = \\frac{1}{2}\\times ${legA}\\times ${legB}`, workingValues: { legA, legB, area } };
    }
    case "findEquilateralTriangleArea": {
      const side = requireValue(parameters, "side"); const coefficient = (side * side) / 4; const unit = areaUnit(parameters);
      return { ...surdAreaAnswer(coefficient, 3, unit), answerDimension: "AREA", unit, equation: `A = \\frac{\\sqrt{3}}{4}a^2 = \\frac{\\sqrt{3}}{4}\\times ${side}^2`, workingValues: { side, coefficient, radicand: 3 } };
    }
    case "findEquilateralPerimeterFromArea": {
      const areaCoefficient = requireValue(parameters, "areaCoefficient"); const side = 2 * Math.sqrt(areaCoefficient); const perimeter = 3 * side; const unit = lengthUnit(parameters);
      return { ...integerMeasure(perimeter, unit, "LENGTH"), answerDimension: "LENGTH", unit, equation: `${areaCoefficient}\\sqrt{3} = \\frac{\\sqrt{3}}{4}a^2`, workingValues: { areaCoefficient, side, perimeter } };
    }
    case "findEquilateralSideFromPerimeter": {
      const perimeter = requireValue(parameters, "perimeter"); const side = perimeter / 3; const unit = lengthUnit(parameters);
      return { ...integerMeasure(side, unit, "LENGTH"), answerDimension: "LENGTH", unit, equation: `a = \\frac{P}{3} = \\frac{${perimeter}}{3}`, workingValues: { perimeter, side } };
    }
    case "findIsoscelesTriangleArea": {
      const equalSide = requireValue(parameters, "equalSide"); const base = requireValue(parameters, "base"); const halfBase = base / 2; const height = Math.sqrt(equalSide * equalSide - halfBase * halfBase); const area = (base * height) / 2; const unit = areaUnit(parameters);
      return { ...integerMeasure(area, unit, "AREA"), answerDimension: "AREA", unit, equation: `h = \\sqrt{${equalSide}^2-(${base}/2)^2},\\quad A=\\frac12 bh`, workingValues: { equalSide, base, halfBase, height, area } };
    }
    case "findIsoscelesHeight": {
      const equalSide = requireValue(parameters, "equalSide"); const base = requireValue(parameters, "base"); const halfBase = base / 2; const height = Math.sqrt(equalSide * equalSide - halfBase * halfBase); const unit = lengthUnit(parameters);
      return { ...integerMeasure(height, unit, "LENGTH"), answerDimension: "LENGTH", unit, equation: `h = \\sqrt{${equalSide}^2-(${base}/2)^2}`, workingValues: { equalSide, base, halfBase, height } };
    }
    case "findTriangleAreaFromSideRatioAndPerimeter": {
      const ratioA = requireValue(parameters, "ratioA"); const ratioB = requireValue(parameters, "ratioB"); const ratioC = requireValue(parameters, "ratioC"); const perimeter = requireValue(parameters, "perimeter"); const scale = perimeter / (ratioA + ratioB + ratioC); const sideA = ratioA * scale; const sideB = ratioB * scale; const sideC = ratioC * scale; const { semiperimeter, radicand, area } = heronValues(sideA, sideB, sideC); const unit = areaUnit(parameters);
      return { ...integerMeasure(area, unit, "AREA"), answerDimension: "AREA", unit, equation: `k = \\frac{${perimeter}}{${ratioA}+${ratioB}+${ratioC}},\\quad A=\\sqrt{s(s-a)(s-b)(s-c)}`, workingValues: { ratioA, ratioB, ratioC, perimeter, scale, sideA, sideB, sideC, semiperimeter, radicand, area } };
    }
    case "findLargestTriangleSideFromRatioAndPerimeter":
    case "findSmallestTriangleSideFromRatioAndPerimeter": {
      const ratioA = requireValue(parameters, "ratioA"); const ratioB = requireValue(parameters, "ratioB"); const ratioC = requireValue(parameters, "ratioC"); const perimeter = requireValue(parameters, "perimeter"); const scale = perimeter / (ratioA + ratioB + ratioC); const sides = [ratioA * scale, ratioB * scale, ratioC * scale]; const targetSide = parameters.solveMode === "findLargestTriangleSideFromRatioAndPerimeter" ? Math.max(...sides) : Math.min(...sides); const unit = lengthUnit(parameters);
      return { ...integerMeasure(targetSide, unit, "LENGTH"), answerDimension: "LENGTH", unit, equation: `k = \\frac{${perimeter}}{${ratioA}+${ratioB}+${ratioC}} = ${scale}`, workingValues: { ratioA, ratioB, ratioC, perimeter, scale, sideA: sides[0]!, sideB: sides[1]!, sideC: sides[2]!, targetSide } };
    }
    case "findTriangularPlotCost": {
      const base = requireValue(parameters, "base"); const height = requireValue(parameters, "height"); const ratePerSquareMetre = requireValue(parameters, "ratePerSquareMetre"); const area = (base * height) / 2; const cost = area * ratePerSquareMetre;
      return { ...currencyAnswer(cost), answerDimension: "COST", unit: "₹", equation: `\\text{Cost}=\\left(\\frac12\\times ${base}\\times ${height}\\right)\\times ${ratePerSquareMetre}`, workingValues: { base, height, area, ratePerSquareMetre, cost } };
    }
  }
}
