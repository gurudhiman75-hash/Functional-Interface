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

const STATES = [
  [20, 12, 14, 8, 6, 4],
  [24, 14, 16, 10, 8, 6],
  [30, 18, 20, 12, 10, 8],
  [28, 16, 18, 10, 8, 6],
] as const;

function hash(value: string) {
  let result = 2166136261;
  for (const character of value) {
    result ^= character.charCodeAt(0);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function state(seed: string): Values {
  const [length, breadth, componentLength, componentBreadth, overlapLength, overlapBreadth] =
    STATES[hash(`${seed}:overlapping-rectangles`) % STATES.length]!;
  const rectangleArea = length * breadth;
  const componentArea = componentLength * componentBreadth;
  const overlapArea = overlapLength * overlapBreadth;
  return {
    length,
    breadth,
    componentLength,
    componentBreadth,
    overlapLength,
    overlapBreadth,
    rectangleArea,
    componentArea,
    overlapArea,
    area: rectangleArea + componentArea - overlapArea,
  };
}

function positive(parameters: Men001Parameters, key: keyof Values) {
  const candidate = Number(parameters.values[key]);
  if (!Number.isFinite(candidate) || candidate <= 0) {
    throw new Error(`MEN-001 CP-005 overlap mode requires positive ${String(key)}.`);
  }
  return candidate;
}

export const MEN_001_CP005_OVERLAP_SOLVE_MODE_REGISTRY = {
  findOverlappingRectanglesUnionArea: {
    reasoningDescription:
      "Add the two rectangle areas and subtract their common rectangular overlap once because it was counted twice.",
    generateValues: state,
    solve: (parameters: Men001Parameters) => {
      if (parameters.unitPolicy !== "SQUARE_METRES") {
        throw new Error("MEN-001 CP-005 overlap mode requires square metres.");
      }
      const length = positive(parameters, "length");
      const breadth = positive(parameters, "breadth");
      const componentLength = positive(parameters, "componentLength");
      const componentBreadth = positive(parameters, "componentBreadth");
      const overlapLength = positive(parameters, "overlapLength");
      const overlapBreadth = positive(parameters, "overlapBreadth");
      const rectangleArea = length * breadth;
      const componentArea = componentLength * componentBreadth;
      const overlapArea = overlapLength * overlapBreadth;
      const area = rectangleArea + componentArea - overlapArea;
      const canonicalAnswer: Men001CanonicalAnswer = {
        kind: "unit",
        value: area,
        unit: "m²",
        precision: 0,
        display: `${area} m²`,
        rounding: "exact",
        metadata: { answerDimension: "AREA", exactKind: "INTEGER" },
      };
      return {
        exactAnswer: { kind: "INTEGER", value: area },
        canonicalAnswer,
        answer: canonicalAnswer.display,
        answerDimension: "AREA",
        unit: "m²",
        equation: "A=A₁+A₂-Aoverlap",
        workingValues: {
          length,
          breadth,
          componentLength,
          componentBreadth,
          overlapLength,
          overlapBreadth,
          rectangleArea,
          componentArea,
          overlapArea,
          area,
        },
      };
    },
    explain: (_parameters: Men001Parameters, solver: Men001SolverResult) => [
      "The common rectangular part belongs to both component rectangles.",
      "Add the two complete rectangle areas, then subtract the overlap once.",
      `A = ${solver.workingValues.rectangleArea} + ${solver.workingValues.componentArea} - ${solver.workingValues.overlapArea}.`,
      `A = ${solver.workingValues.area}.`,
      `The combined figure has area ${solver.answer}.`,
    ],
  },
} as const satisfies Record<string, Definition>;
