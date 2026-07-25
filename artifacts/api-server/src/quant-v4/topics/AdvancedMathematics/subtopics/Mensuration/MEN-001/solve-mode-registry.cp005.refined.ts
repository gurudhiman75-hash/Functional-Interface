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
  [20, 14],
  [24, 16],
  [30, 18],
  [28, 20],
  [36, 14],
] as const;

function hash(value: string) {
  let result = 2166136261;
  for (const character of value) {
    result ^= character.charCodeAt(0);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function unitFor(parameters: Men001Parameters): "cm" | "m" {
  if (parameters.unitPolicy === "CENTIMETRES") return "cm";
  if (parameters.unitPolicy === "METRES") return "m";
  throw new Error(`MEN-001 CP-005 fit mode requires a linear unit.`);
}

export const MEN_001_CP005_REFINED_SOLVE_MODE_REGISTRY = {
  findLargestCircleRadiusInRectangle: {
    reasoningDescription:
      "The largest circle is limited by the rectangle's smaller side, which becomes the circle diameter.",
    generateValues: (seed: string) => {
      const [length, breadth] = STATES[hash(`${seed}:largest-circle`) % STATES.length]!;
      const smallerSide = Math.min(length, breadth);
      return {
        length,
        breadth,
        smallerSide,
        diameter: smallerSide,
        radius: smallerSide / 2,
      };
    },
    solve: (parameters: Men001Parameters) => {
      const length = Number(parameters.values.length);
      const breadth = Number(parameters.values.breadth);
      if (![length, breadth].every((value) => Number.isFinite(value) && value > 0)) {
        throw new Error(`MEN-001 CP-005 largest-circle mode requires positive rectangle dimensions.`);
      }
      const smallerSide = Math.min(length, breadth);
      const radius = smallerSide / 2;
      const unit = unitFor(parameters);
      const canonicalAnswer: Men001CanonicalAnswer = {
        kind: "unit",
        value: radius,
        unit,
        precision: 0,
        display: `${radius} ${unit}`,
        rounding: "exact",
        metadata: { answerDimension: "LENGTH", exactKind: "INTEGER" },
      };
      return {
        exactAnswer: { kind: "INTEGER", value: radius },
        canonicalAnswer,
        answer: canonicalAnswer.display,
        answerDimension: "LENGTH",
        unit,
        equation: "r=min(l,b)/2",
        workingValues: {
          length,
          breadth,
          smallerSide,
          diameter: smallerSide,
          radius,
        },
      };
    },
    explain: (_parameters: Men001Parameters, solver: Men001SolverResult) => [
      "A circle must fit across the rectangle's narrower dimension.",
      "That smaller side is the diameter of the largest possible circle.",
      `r = ${solver.workingValues.smallerSide} / 2.`,
      `r = ${solver.workingValues.radius}.`,
      `The largest possible radius is ${solver.answer}.`,
    ],
  },
} as const satisfies Record<string, Definition>;
