import { MEN_001_EXHAUSTIVENESS_SOLVE_MODE_REGISTRY } from "./solve-mode-registry.exhaustiveness";
import type {
  Men001AnswerDimension,
  Men001CanonicalAnswer,
  Men001Parameters,
  Men001SolverResult,
} from "./types";

function required(parameters: Men001Parameters, key: string) {
  const value = (parameters.values as Record<string, number | undefined>)[key];
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    throw new Error(`MEN-001 extended-unit solver requires positive ${key}.`);
  }
  return value;
}

function unitResult(
  value: number,
  unit: "₹/m²" | "₹/m" | "revolutions",
  answerDimension: Men001AnswerDimension,
  equation: string,
  workingValues: Record<string, string | number>,
): Men001SolverResult {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`MEN-001 extended-unit solver expected a positive integer answer; received ${value}.`);
  }
  const canonicalAnswer: Men001CanonicalAnswer = {
    kind: "unit",
    value,
    unit,
    precision: 0,
    display:
      unit === "₹/m²"
        ? `₹${value}/m²`
        : unit === "₹/m"
          ? `₹${value}/m`
          : `${value} revolutions`,
    rounding: "exact",
    metadata: { answerDimension, exactKind: "INTEGER", unit },
  };
  return {
    exactAnswer: { kind: "INTEGER", value },
    canonicalAnswer,
    answer: canonicalAnswer.display,
    answerDimension,
    unit,
    equation,
    workingValues,
  };
}

const wheelRevolutions =
  MEN_001_EXHAUSTIVENESS_SOLVE_MODE_REGISTRY.findWheelRevolutionsFromDistance;
const areaRate = MEN_001_EXHAUSTIVENESS_SOLVE_MODE_REGISTRY.findAreaRateFromTotalCost;
const fencingRate = MEN_001_EXHAUSTIVENESS_SOLVE_MODE_REGISTRY.findFencingRateFromTotalCost;

export const MEN_001_EXHAUSTIVENESS_RUNTIME_SOLVE_MODE_REGISTRY = {
  ...MEN_001_EXHAUSTIVENESS_SOLVE_MODE_REGISTRY,
  findWheelRevolutionsFromDistance: {
    ...wheelRevolutions,
    solve: (parameters: Men001Parameters) => {
      const radius = required(parameters, "radius");
      const distance = required(parameters, "distance");
      const circumference = (44 * radius) / 7;
      const revolutions = distance / circumference;
      return unitResult(
        revolutions,
        "revolutions",
        "COUNT",
        `n=D/(2πr)`,
        { radius, distance, circumference, revolutions, piPolicy: "22/7" },
      );
    },
  },
  findAreaRateFromTotalCost: {
    ...areaRate,
    solve: (parameters: Men001Parameters) => {
      const area = required(parameters, "area");
      const cost = required(parameters, "cost");
      const ratePerSquareMetre = cost / area;
      return unitResult(
        ratePerSquareMetre,
        "₹/m²",
        "RATE",
        `rate=cost/area`,
        { area, cost, ratePerSquareMetre, rateUnit: "₹ per m²" },
      );
    },
  },
  findFencingRateFromTotalCost: {
    ...fencingRate,
    solve: (parameters: Men001Parameters) => {
      const length = required(parameters, "length");
      const breadth = required(parameters, "breadth");
      const cost = required(parameters, "cost");
      const perimeter = 2 * (length + breadth);
      const ratePerMetre = cost / perimeter;
      return unitResult(
        ratePerMetre,
        "₹/m",
        "RATE",
        `rate=cost/[2(L+B)]`,
        { length, breadth, perimeter, cost, ratePerMetre, rateUnit: "₹ per m" },
      );
    },
  },
} as const;
