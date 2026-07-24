import type {
  Men001AnswerDimension,
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

function required(parameters: Men001Parameters, key: keyof Values) {
  const candidate = parameters.values[key];
  if (typeof candidate !== "number" || !Number.isFinite(candidate) || candidate <= 0) {
    throw new Error(`MEN-001 CP-004 additional mode requires positive ${String(key)}.`);
  }
  return candidate;
}

function exactResult(
  parameters: Men001Parameters,
  value: number,
  answerDimension: Men001AnswerDimension,
  unit: Men001SolverResult["unit"],
  equation: string,
  workingValues: Record<string, string | number>,
): Men001SolverResult {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`MEN-001 CP-004 additional mode expected a positive integer answer; received ${value}.`);
  }
  const canonicalAnswer: Men001CanonicalAnswer = unit === "₹"
    ? {
        kind: "currency",
        value,
        currency: "₹",
        precision: 0,
        display: `₹${value}`,
        rounding: "exact",
        metadata: { answerDimension, exactKind: "INTEGER" },
      }
    : {
        kind: "unit",
        value,
        unit,
        precision: 0,
        display: `${value} ${unit}`,
        rounding: "exact",
        metadata: { answerDimension, exactKind: "INTEGER" },
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

const UNCOVERED_STATES = [
  [12, 8, 6, 4],
  [15, 10, 9, 6],
  [18, 12, 10, 6],
  [20, 14, 12, 8],
  [24, 16, 15, 10],
] as const;

const PAINTING_STATES = [
  [12, 8, 3, 2, 40],
  [15, 10, 3, 2, 50],
  [18, 12, 4, 3, 60],
  [20, 14, 4, 3, 75],
  [24, 16, 5, 4, 80],
] as const;

const PATH_TILE_STATES = [
  [20, 12, 2, 2, 1],
  [24, 16, 2, 2, 2],
  [30, 20, 3, 3, 2],
  [32, 18, 3, 2, 2],
  [40, 24, 4, 4, 2],
] as const;

const MULTI_FENCE_STATES = [
  [30, 20, 2, 25],
  [40, 25, 3, 30],
  [50, 30, 4, 35],
  [60, 40, 3, 40],
  [75, 45, 5, 50],
] as const;

export const MEN_001_CP004_ADDITIONAL_SOLVE_MODE_REGISTRY = {
  findUncoveredFloorAreaAfterRectangularMat: {
    reasoningDescription: "Subtract the rectangular mat area from the rectangular floor area.",
    generateValues: (seed) => {
      const [outerLength, outerBreadth, innerLength, innerBreadth] = pick(
        UNCOVERED_STATES,
        seed,
        "uncovered-floor",
      );
      const outerArea = outerLength * outerBreadth;
      const innerArea = innerLength * innerBreadth;
      return { outerLength, outerBreadth, innerLength, innerBreadth, outerArea, innerArea, area: outerArea - innerArea };
    },
    solve: (parameters) => {
      const outerLength = required(parameters, "outerLength");
      const outerBreadth = required(parameters, "outerBreadth");
      const innerLength = required(parameters, "innerLength");
      const innerBreadth = required(parameters, "innerBreadth");
      const outerArea = outerLength * outerBreadth;
      const innerArea = innerLength * innerBreadth;
      const area = outerArea - innerArea;
      return exactResult(
        parameters,
        area,
        "AREA",
        "m²",
        `A_{uncovered}=LB-lb`,
        { outerLength, outerBreadth, innerLength, innerBreadth, outerArea, innerArea, area, regionType: "FLOOR_MINUS_MAT" },
      );
    },
    explain: (_parameters, solver) => {
      const v = solver.workingValues;
      return [
        `The uncovered portion equals the whole floor area minus the mat area.`,
        `Floor area = ${v.outerLength} × ${v.outerBreadth} = ${v.outerArea} m².`,
        `Mat area = ${v.innerLength} × ${v.innerBreadth} = ${v.innerArea} m².`,
        `Uncovered area = ${v.outerArea} − ${v.innerArea} = ${v.area} m².`,
        `Therefore, the uncovered floor area is ${solver.answer}.`,
      ];
    },
  },

  findPaintingCostExcludingRectangularDoor: {
    reasoningDescription: "Subtract the door area from the wall area, then apply the painting rate per square metre.",
    generateValues: (seed) => {
      const [outerLength, outerBreadth, innerLength, innerBreadth, ratePerSquareMetre] = pick(
        PAINTING_STATES,
        seed,
        "painting-door",
      );
      const outerArea = outerLength * outerBreadth;
      const innerArea = innerLength * innerBreadth;
      const area = outerArea - innerArea;
      return { outerLength, outerBreadth, innerLength, innerBreadth, outerArea, innerArea, area, ratePerSquareMetre, cost: area * ratePerSquareMetre };
    },
    solve: (parameters) => {
      const outerLength = required(parameters, "outerLength");
      const outerBreadth = required(parameters, "outerBreadth");
      const innerLength = required(parameters, "innerLength");
      const innerBreadth = required(parameters, "innerBreadth");
      const ratePerSquareMetre = required(parameters, "ratePerSquareMetre");
      const outerArea = outerLength * outerBreadth;
      const innerArea = innerLength * innerBreadth;
      const area = outerArea - innerArea;
      const cost = area * ratePerSquareMetre;
      return exactResult(
        parameters,
        cost,
        "COST",
        "₹",
        `Cost=(LB-lb)×rate`,
        { outerLength, outerBreadth, innerLength, innerBreadth, outerArea, innerArea, area, ratePerSquareMetre, cost, regionType: "WALL_MINUS_DOOR" },
      );
    },
    explain: (_parameters, solver) => {
      const v = solver.workingValues;
      return [
        `Only the wall surface excluding the door is painted.`,
        `Wall area = ${v.outerLength} × ${v.outerBreadth} = ${v.outerArea} m².`,
        `Door area = ${v.innerLength} × ${v.innerBreadth} = ${v.innerArea} m²; paintable area = ${v.area} m².`,
        `Painting cost = ${v.area} × ₹${v.ratePerSquareMetre} = ₹${v.cost}.`,
        `Therefore, the required painting cost is ${solver.answer}.`,
      ];
    },
  },

  findOuterRectangularPathTilesRequired: {
    reasoningDescription: "Find the outside path area and divide by one paving tile's area.",
    generateValues: (seed) => {
      const [innerLength, innerBreadth, pathWidth, tileLength, tileBreadth] = pick(
        PATH_TILE_STATES,
        seed,
        "outside-path-tiles",
      );
      const outerLength = innerLength + 2 * pathWidth;
      const outerBreadth = innerBreadth + 2 * pathWidth;
      const outerArea = outerLength * outerBreadth;
      const innerArea = innerLength * innerBreadth;
      const area = outerArea - innerArea;
      const tileArea = tileLength * tileBreadth;
      const tileCount = area / tileArea;
      if (!Number.isInteger(tileCount)) throw new Error("MEN-001 CP-004 path-tile state must divide exactly.");
      return { innerLength, innerBreadth, pathWidth, outerLength, outerBreadth, outerArea, innerArea, area, tileLength, tileBreadth, tileArea, tileCount };
    },
    solve: (parameters) => {
      const innerLength = required(parameters, "innerLength");
      const innerBreadth = required(parameters, "innerBreadth");
      const pathWidth = required(parameters, "pathWidth");
      const tileLength = required(parameters, "tileLength");
      const tileBreadth = required(parameters, "tileBreadth");
      const outerLength = innerLength + 2 * pathWidth;
      const outerBreadth = innerBreadth + 2 * pathWidth;
      const outerArea = outerLength * outerBreadth;
      const innerArea = innerLength * innerBreadth;
      const area = outerArea - innerArea;
      const tileArea = tileLength * tileBreadth;
      const tileCount = area / tileArea;
      return exactResult(
        parameters,
        tileCount,
        "COUNT",
        "tiles",
        `N=[(L+2w)(B+2w)-LB]/(l×b)`,
        { innerLength, innerBreadth, pathWidth, outerLength, outerBreadth, outerArea, innerArea, area, tileLength, tileBreadth, tileArea, tileCount, pathPosition: "OUTSIDE" },
      );
    },
    explain: (_parameters, solver) => {
      const v = solver.workingValues;
      return [
        `The paving tiles cover only the outside path.`,
        `Path area = outer area − inner area = ${v.outerArea} − ${v.innerArea} = ${v.area} m².`,
        `One paving tile covers ${v.tileLength} × ${v.tileBreadth} = ${v.tileArea} m².`,
        `Tiles required = ${v.area} ÷ ${v.tileArea} = ${v.tileCount}.`,
        `Therefore, ${solver.answer} are required.`,
      ];
    },
  },

  findMultipleRoundRectangularFencingCost: {
    reasoningDescription: "Multiply the rectangular perimeter by the number of rounds and the rate per metre.",
    generateValues: (seed) => {
      const [length, breadth, rounds, ratePerMetre] = pick(
        MULTI_FENCE_STATES,
        seed,
        "multiple-round-fence-cost",
      );
      const perimeter = 2 * (length + breadth);
      const wireLength = perimeter * rounds;
      return { length, breadth, rounds, ratePerMetre, perimeter, wireLength, cost: wireLength * ratePerMetre };
    },
    solve: (parameters) => {
      const length = required(parameters, "length");
      const breadth = required(parameters, "breadth");
      const rounds = required(parameters, "rounds");
      const ratePerMetre = required(parameters, "ratePerMetre");
      const perimeter = 2 * (length + breadth);
      const wireLength = perimeter * rounds;
      const cost = wireLength * ratePerMetre;
      return exactResult(
        parameters,
        cost,
        "COST",
        "₹",
        `Cost=2(L+B)×rounds×rate`,
        { length, breadth, rounds, ratePerMetre, perimeter, wireLength, cost },
      );
    },
    explain: (_parameters, solver) => {
      const v = solver.workingValues;
      return [
        `One fencing round uses the rectangular perimeter.`,
        `Perimeter = 2(${v.length} + ${v.breadth}) = ${v.perimeter} m.`,
        `${v.rounds} rounds require ${v.perimeter} × ${v.rounds} = ${v.wireLength} m of fencing.`,
        `Cost = ${v.wireLength} × ₹${v.ratePerMetre} = ₹${v.cost}.`,
        `Therefore, the fencing cost is ${solver.answer}.`,
      ];
    },
  },
} as const satisfies Record<string, Definition>;
