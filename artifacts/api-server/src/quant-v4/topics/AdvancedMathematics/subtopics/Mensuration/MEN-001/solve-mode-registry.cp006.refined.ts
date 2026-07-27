import type {
  Men001CanonicalAnswer,
  Men001Parameters,
  Men001SolverResult,
} from "./types";

type Values = Men001Parameters["values"];
type Definition = {
  reasoningDescription: string;
  generateValues: (seed: string) => Values;
  solve: (parameters: Men001Parameters) => Men001SolverResult;
  explain: (parameters: Men001Parameters, solver: Men001SolverResult) => string[];
};

function hash(value: string) {
  let result = 2166136261;
  for (const character of value) {
    result ^= character.charCodeAt(0);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function pick<T>(items: readonly T[], seed: string, salt: string): T {
  return items[hash(`${seed}:${salt}`) % items.length]!;
}

function positive(parameters: Men001Parameters, key: keyof Values) {
  const candidate = Number(parameters.values[key]);
  if (!Number.isFinite(candidate) || candidate <= 0) {
    throw new Error(`MEN-001 CP-006 refined mode requires positive ${String(key)}.`);
  }
  return candidate;
}

function result(
  parameters: Men001Parameters,
  answerDimension: "AREA" | "SCALAR",
  value: number,
  equation: string,
  workingValues: Record<string, string | number>,
): Men001SolverResult {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`MEN-001 CP-006 refined mode expected a positive integer answer.`);
  }
  const unit = answerDimension === "SCALAR" ? "times" : "m²";
  const display = `${value} ${unit}`;
  const canonicalAnswer: Men001CanonicalAnswer = {
    kind: "unit",
    value,
    unit,
    precision: 0,
    display,
    rounding: "exact",
    metadata: { answerDimension, exactKind: "INTEGER" },
  };
  return {
    exactAnswer: { kind: "INTEGER", value },
    canonicalAnswer,
    answer: display,
    answerDimension,
    unit,
    equation,
    workingValues,
  };
}

const STATES = [
  [40, 12, 2],
  [60, 20, 3],
  [80, 25, 4],
  [100, 32, 2],
] as const;

function perimeterPair(seed: string): Values {
  const [perimeter, _area, scale] = pick(STATES, seed, "cp006-perimeter-pair");
  return { perimeter, compositePerimeter: perimeter * scale };
}

function areaPair(seed: string): Values {
  const [_perimeter, area, scale] = pick(STATES, seed, "cp006-area-pair");
  return { area, outerArea: area * scale * scale };
}

function originalAreaState(seed: string): Values {
  const [_perimeter, area, scale] = pick(STATES, seed, "cp006-original-area");
  return { outerArea: area * scale * scale, scale };
}

export const MEN_001_CP006_REFINED_SOLVE_MODE_REGISTRY = {
  findLinearScaleFactorFromPerimeters: {
    reasoningDescription: "For similar figures, the perimeter ratio equals the linear scale factor.",
    generateValues: perimeterPair,
    solve: (parameters: Men001Parameters) => {
      const perimeter = positive(parameters, "perimeter");
      const scaledPerimeter = positive(parameters, "compositePerimeter");
      const scaleFactor = scaledPerimeter / perimeter;
      return result(parameters, "SCALAR", scaleFactor, "k=P₂/P₁", {
        perimeter,
        scaledPerimeter,
        scaleFactor,
      });
    },
    explain: (_parameters: Men001Parameters, solver: Men001SolverResult) => [
      "The two figures are similar, so all corresponding lengths share one ratio.",
      "Their perimeters follow that same linear ratio.",
      "Divide the larger perimeter by the smaller perimeter.",
      `k = ${solver.workingValues.scaledPerimeter} / ${solver.workingValues.perimeter}.`,
      `k = ${solver.workingValues.scaleFactor}.`,
      `The linear scale factor is ${solver.answer}.`,
    ],
  },
  findLinearScaleFactorFromAreas: {
    reasoningDescription: "For similar figures, the positive square root of the area ratio gives the linear scale factor.",
    generateValues: areaPair,
    solve: (parameters: Men001Parameters) => {
      const area = positive(parameters, "area");
      const scaledArea = positive(parameters, "outerArea");
      const areaRatio = scaledArea / area;
      const scaleFactor = Math.sqrt(areaRatio);
      return result(parameters, "SCALAR", scaleFactor, "k=√(A₂/A₁)", {
        area,
        scaledArea,
        areaRatio,
        scaleFactor,
      });
    },
    explain: (_parameters: Men001Parameters, solver: Men001SolverResult) => [
      "The area ratio contains the square of the linear scale factor.",
      "Form the ratio of the larger area to the smaller area.",
      `Area ratio = ${solver.workingValues.scaledArea} / ${solver.workingValues.area} = ${solver.workingValues.areaRatio}.`,
      "Take the positive square root of this ratio.",
      `k = √${solver.workingValues.areaRatio} = ${solver.workingValues.scaleFactor}.`,
      `The linear scale factor is ${solver.answer}.`,
    ],
  },
  findOriginalAreaFromScaledArea: {
    reasoningDescription: "Undo the square-law area multiplier to recover the original area.",
    generateValues: originalAreaState,
    solve: (parameters: Men001Parameters) => {
      const scaledArea = positive(parameters, "outerArea");
      const scale = positive(parameters, "scale");
      const areaFactor = scale * scale;
      const originalArea = scaledArea / areaFactor;
      return result(parameters, "AREA", originalArea, "A₁=A₂/k²", {
        scaledArea,
        scale,
        areaFactor,
        originalArea,
      });
    },
    explain: (_parameters: Men001Parameters, solver: Men001SolverResult) => [
      "The stated area belongs to the enlarged figure.",
      `Its area multiplier is ${solver.workingValues.scale}² = ${solver.workingValues.areaFactor}.`,
      "Divide by this multiplier to reverse the enlargement.",
      `A₁ = ${solver.workingValues.scaledArea} / ${solver.workingValues.areaFactor}.`,
      `A₁ = ${solver.workingValues.originalArea} m².`,
      `The original area is ${solver.answer}.`,
    ],
  },
} as const satisfies Record<string, Definition>;
