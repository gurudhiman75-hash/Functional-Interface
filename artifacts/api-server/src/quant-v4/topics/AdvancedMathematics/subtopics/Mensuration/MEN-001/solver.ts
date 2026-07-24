import type {
  ExactSpatialNumber,
  Men001CanonicalAnswer,
  Men001Parameters,
  Men001SolverResult,
} from "./types";

function requireValue(
  parameters: Men001Parameters,
  key: keyof Men001Parameters["values"],
) {
  const value = parameters.values[key];
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    throw new Error(`MEN-001 requires a positive finite ${String(key)}.`);
  }
  return value;
}

function integerAnswer(value: number, unit: "cm" | "cm²", dimension: "LENGTH" | "AREA") {
  if (!Number.isInteger(value)) {
    throw new Error(`MEN-001 runtime proof expected an integer ${dimension} answer; received ${value}.`);
  }
  const canonicalAnswer: Men001CanonicalAnswer = {
    kind: "unit",
    value,
    unit,
    precision: 0,
    display: `${value} ${unit}`,
    rounding: "exact",
    metadata: { dimension, exactKind: "INTEGER" },
  };
  return {
    exactAnswer: { kind: "INTEGER", value } as ExactSpatialNumber,
    canonicalAnswer,
    answer: canonicalAnswer.display,
  };
}

function surdAnswer(
  coefficient: number,
  radicand: number,
  unit: "cm²",
): Pick<Men001SolverResult, "exactAnswer" | "canonicalAnswer" | "answer"> {
  if (!Number.isInteger(coefficient) || coefficient <= 0 || !Number.isInteger(radicand)) {
    throw new Error("MEN-001 requires a positive integral exact surd state.");
  }
  const latexValue = `${coefficient}\\sqrt{${radicand}}\\,\\text{cm}^{2}`;
  const canonicalAnswer: Men001CanonicalAnswer = {
    kind: "symbolic",
    value: latexValue,
    rendered: `$$${latexValue}$$`,
    display: `${coefficient}√${radicand} ${unit}`,
    rounding: "exact",
    metadata: { dimension: "AREA", exactKind: "SURD", radicand },
  };
  return {
    exactAnswer: {
      kind: "SURD",
      coefficientNumerator: coefficient,
      coefficientDenominator: 1,
      radicand,
    },
    canonicalAnswer,
    answer: canonicalAnswer.rendered,
  };
}

export function solveMen001(parameters: Men001Parameters): Men001SolverResult {
  switch (parameters.solveMode) {
    case "findTriangleAreaBaseHeight": {
      const base = requireValue(parameters, "base");
      const height = requireValue(parameters, "height");
      const area = (base * height) / 2;
      return {
        ...integerAnswer(area, "cm²", "AREA"),
        answerDimension: "AREA",
        unit: "cm²",
        equation: `A = \\frac{1}{2}bh = \\frac{1}{2}\\times ${base}\\times ${height}`,
        workingValues: { base, height, area },
      };
    }
    case "findMissingHeightFromAreaAndBase": {
      const area = requireValue(parameters, "area");
      const base = requireValue(parameters, "base");
      const height = (2 * area) / base;
      return {
        ...integerAnswer(height, "cm", "LENGTH"),
        answerDimension: "LENGTH",
        unit: "cm",
        equation: `h = \\frac{2A}{b} = \\frac{2\\times ${area}}{${base}}`,
        workingValues: { area, base, height },
      };
    }
    case "findTriangleAreaHeron": {
      const sideA = requireValue(parameters, "sideA");
      const sideB = requireValue(parameters, "sideB");
      const sideC = requireValue(parameters, "sideC");
      if (
        sideA + sideB <= sideC ||
        sideA + sideC <= sideB ||
        sideB + sideC <= sideA
      ) {
        throw new Error("MEN-001 Heron state violates triangle inequality.");
      }
      const semiperimeter = (sideA + sideB + sideC) / 2;
      const radicand =
        semiperimeter *
        (semiperimeter - sideA) *
        (semiperimeter - sideB) *
        (semiperimeter - sideC);
      const area = Math.sqrt(radicand);
      return {
        ...integerAnswer(area, "cm²", "AREA"),
        answerDimension: "AREA",
        unit: "cm²",
        equation: "A = \\sqrt{s(s-a)(s-b)(s-c)}",
        workingValues: { sideA, sideB, sideC, semiperimeter, radicand, area },
      };
    }
    case "findRightTriangleAreaFromLegs": {
      const legA = requireValue(parameters, "legA");
      const legB = requireValue(parameters, "legB");
      const area = (legA * legB) / 2;
      return {
        ...integerAnswer(area, "cm²", "AREA"),
        answerDimension: "AREA",
        unit: "cm²",
        equation: `A = \\frac{1}{2}\\times ${legA}\\times ${legB}`,
        workingValues: { legA, legB, area },
      };
    }
    case "findEquilateralTriangleArea": {
      const side = requireValue(parameters, "side");
      const coefficient = (side * side) / 4;
      return {
        ...surdAnswer(coefficient, 3, "cm²"),
        answerDimension: "AREA",
        unit: "cm²",
        equation: `A = \\frac{\\sqrt{3}}{4}a^2 = \\frac{\\sqrt{3}}{4}\\times ${side}^2`,
        workingValues: { side, coefficient, radicand: 3 },
      };
    }
    default:
      throw new Error(`Unsupported MEN-001 solve mode: ${String(parameters.solveMode)}`);
  }
}
