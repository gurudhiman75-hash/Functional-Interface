import type {
  Men001AnswerDimension,
  Men001CanonicalAnswer,
  Men001Parameters,
  Men001SolverResult,
  Men001UnitPolicy,
} from "./types";

type Values = Men001Parameters["values"];
type Definition = {
  reasoningDescription: string;
  generateValues: (seed: string) => Values;
  solve: (parameters: Men001Parameters) => Men001SolverResult;
  explain: (parameters: Men001Parameters, solver: Men001SolverResult) => string[];
};

const PI_NUMERATOR = 22;
const PI_DENOMINATOR = 7;
const PI_POLICY = "22/7";

function hash(value: string) {
  let result = 2166136261;
  for (const character of value) {
    result ^= character.charCodeAt(0);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function pick<T>(items: readonly T[], seed: string, salt: string): T {
  if (items.length === 0) throw new Error(`MEN-001 CP-004 cannot pick from an empty ${salt} list.`);
  return items[hash(`${seed}:${salt}`) % items.length]!;
}

function required(parameters: Men001Parameters, key: keyof Values) {
  const candidate = parameters.values[key];
  if (typeof candidate !== "number" || !Number.isFinite(candidate) || candidate <= 0) {
    throw new Error(`MEN-001 CP-004 requires positive ${String(key)}.`);
  }
  return candidate;
}

function unitFor(policy: Men001UnitPolicy): Men001SolverResult["unit"] {
  return {
    CENTIMETRES: "cm",
    METRES: "m",
    SQUARE_CENTIMETRES: "cm²",
    SQUARE_METRES: "m²",
    RUPEES: "₹",
    DEGREES: "°",
    TILES: "tiles",
  }[policy];
}

function exactInteger(
  value: number,
  unit: Men001SolverResult["unit"],
  answerDimension: Men001AnswerDimension,
  metadata: Record<string, unknown> = {},
): Pick<Men001SolverResult, "exactAnswer" | "canonicalAnswer" | "answer"> {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`MEN-001 CP-004 expected a positive integer ${answerDimension} answer; received ${value}.`);
  }
  const canonicalAnswer: Men001CanonicalAnswer = unit === "₹"
    ? {
        kind: "currency",
        value,
        currency: "₹",
        precision: 0,
        display: `₹${value}`,
        rounding: "exact",
        metadata: { answerDimension, exactKind: "INTEGER", ...metadata },
      }
    : {
        kind: "unit",
        value,
        unit,
        precision: 0,
        display: unit === "°" ? `${value}°` : `${value} ${unit}`,
        rounding: "exact",
        metadata: { answerDimension, exactKind: "INTEGER", ...metadata },
      };
  return {
    exactAnswer: { kind: "INTEGER", value },
    canonicalAnswer,
    answer: canonicalAnswer.display,
  };
}

function result(
  parameters: Men001Parameters,
  answerValue: number,
  answerDimension: Men001AnswerDimension,
  equation: string,
  workingValues: Record<string, string | number>,
  metadata: Record<string, unknown> = {},
): Men001SolverResult {
  const unit = unitFor(parameters.unitPolicy);
  return {
    ...exactInteger(answerValue, unit, answerDimension, metadata),
    answerDimension,
    unit,
    equation,
    workingValues,
  };
}

function piTimes(value: number) {
  const calculated = (PI_NUMERATOR * value) / PI_DENOMINATOR;
  if (!Number.isInteger(calculated)) {
    throw new Error(`MEN-001 CP-004 circular state violates π = ${PI_POLICY}.`);
  }
  return calculated;
}

const OUTER_RECTANGLE_STATES = [
  [20, 12, 2],
  [24, 16, 2],
  [30, 20, 3],
  [32, 18, 3],
  [40, 24, 4],
] as const;

const INNER_RECTANGLE_STATES = [
  [24, 18, 2],
  [30, 20, 2],
  [36, 24, 3],
  [40, 30, 4],
  [50, 32, 4],
] as const;

const OUTER_SQUARE_STATES = [
  [12, 2],
  [16, 2],
  [20, 3],
  [24, 4],
  [30, 5],
] as const;

const INNER_SQUARE_STATES = [
  [20, 2],
  [24, 3],
  [30, 4],
  [36, 5],
  [40, 6],
] as const;

const OUTER_CIRCLE_STATES = [
  [7, 7],
  [14, 7],
  [21, 7],
  [28, 7],
  [14, 14],
] as const;

const INNER_CIRCLE_STATES = [
  [14, 7],
  [21, 7],
  [28, 7],
  [35, 7],
  [28, 14],
] as const;

const RECTANGULAR_TILE_STATES = [
  [600, 400, 30, 20],
  [720, 480, 40, 30],
  [900, 600, 50, 30],
  [840, 560, 40, 28],
  [1000, 600, 50, 25],
] as const;

const SQUARE_TILE_STATES = [
  [600, 400, 20],
  [720, 480, 30],
  [900, 600, 30],
  [840, 560, 40],
  [1000, 600, 50],
] as const;

const FLOORING_COST_STATES = [
  [12, 8, 75],
  [15, 10, 80],
  [18, 12, 90],
  [20, 14, 100],
  [24, 16, 125],
] as const;

const FENCING_STATES = [
  [30, 20, 25, 4],
  [40, 25, 30, 5],
  [50, 30, 35, 6],
  [60, 40, 40, 8],
  [75, 45, 50, 10],
] as const;

const BORDER_TILE_STATES = [
  [600, 400, 50, 25, 20],
  [720, 480, 60, 30, 20],
  [900, 600, 75, 30, 25],
  [840, 560, 70, 35, 20],
  [1000, 600, 100, 50, 25],
] as const;

function outerRectangleState(seed: string, salt: string) {
  const [innerLength, innerBreadth, pathWidth] = pick(OUTER_RECTANGLE_STATES, seed, salt);
  const outerLength = innerLength + 2 * pathWidth;
  const outerBreadth = innerBreadth + 2 * pathWidth;
  const innerArea = innerLength * innerBreadth;
  const outerArea = outerLength * outerBreadth;
  return {
    innerLength,
    innerBreadth,
    pathWidth,
    outerLength,
    outerBreadth,
    innerArea,
    outerArea,
    area: outerArea - innerArea,
  };
}

function innerRectangleState(seed: string, salt: string) {
  const [outerLength, outerBreadth, pathWidth] = pick(INNER_RECTANGLE_STATES, seed, salt);
  const innerLength = outerLength - 2 * pathWidth;
  const innerBreadth = outerBreadth - 2 * pathWidth;
  const outerArea = outerLength * outerBreadth;
  const innerArea = innerLength * innerBreadth;
  return {
    outerLength,
    outerBreadth,
    pathWidth,
    innerLength,
    innerBreadth,
    outerArea,
    innerArea,
    area: outerArea - innerArea,
  };
}

function outerSquareState(seed: string, salt: string) {
  const [innerSide, pathWidth] = pick(OUTER_SQUARE_STATES, seed, salt);
  const outerSide = innerSide + 2 * pathWidth;
  const innerArea = innerSide ** 2;
  const outerArea = outerSide ** 2;
  return { innerSide, outerSide, pathWidth, innerArea, outerArea, area: outerArea - innerArea };
}

function innerSquareState(seed: string, salt: string) {
  const [outerSide, pathWidth] = pick(INNER_SQUARE_STATES, seed, salt);
  const innerSide = outerSide - 2 * pathWidth;
  const outerArea = outerSide ** 2;
  const innerArea = innerSide ** 2;
  return { outerSide, innerSide, pathWidth, outerArea, innerArea, area: outerArea - innerArea };
}

function outerCircleState(seed: string, salt: string) {
  const [innerRadius, pathWidth] = pick(OUTER_CIRCLE_STATES, seed, salt);
  const outerRadius = innerRadius + pathWidth;
  const innerArea = piTimes(innerRadius ** 2);
  const outerArea = piTimes(outerRadius ** 2);
  return {
    innerRadius,
    outerRadius,
    pathWidth,
    innerArea,
    outerArea,
    area: outerArea - innerArea,
    piPolicy: PI_POLICY,
  };
}

function innerCircleState(seed: string, salt: string) {
  const [outerRadius, pathWidth] = pick(INNER_CIRCLE_STATES, seed, salt);
  const innerRadius = outerRadius - pathWidth;
  const outerArea = piTimes(outerRadius ** 2);
  const innerArea = piTimes(innerRadius ** 2);
  return {
    outerRadius,
    innerRadius,
    pathWidth,
    outerArea,
    innerArea,
    area: outerArea - innerArea,
    piPolicy: PI_POLICY,
  };
}

function rectangularTileState(seed: string, salt: string) {
  const [floorLength, floorBreadth, tileLength, tileBreadth] = pick(RECTANGULAR_TILE_STATES, seed, salt);
  const floorArea = floorLength * floorBreadth;
  const tileArea = tileLength * tileBreadth;
  const tileCount = floorArea / tileArea;
  if (!Number.isInteger(tileCount)) throw new Error("MEN-001 CP-004 tile state must divide exactly.");
  return { floorLength, floorBreadth, tileLength, tileBreadth, floorArea, tileArea, tileCount };
}

function squareTileState(seed: string) {
  const [floorLength, floorBreadth, tileLength] = pick(SQUARE_TILE_STATES, seed, "square-tile-state");
  const tileBreadth = tileLength;
  const floorArea = floorLength * floorBreadth;
  const tileArea = tileLength ** 2;
  const tileCount = floorArea / tileArea;
  if (!Number.isInteger(tileCount)) throw new Error("MEN-001 CP-004 square-tile state must divide exactly.");
  return { floorLength, floorBreadth, tileLength, tileBreadth, floorArea, tileArea, tileCount };
}

function fencingState(seed: string, salt: string) {
  const [length, breadth, ratePerMetre, gateWidth] = pick(FENCING_STATES, seed, salt);
  const perimeter = 2 * (length + breadth);
  const fenceLength = perimeter - gateWidth;
  return { length, breadth, ratePerMetre, gateWidth, perimeter, fenceLength };
}

function rectangleAreaSolver(parameters: Men001Parameters, outside: boolean) {
  const innerLength = required(parameters, "innerLength");
  const innerBreadth = required(parameters, "innerBreadth");
  const outerLength = required(parameters, "outerLength");
  const outerBreadth = required(parameters, "outerBreadth");
  const pathWidth = required(parameters, "pathWidth");
  const innerArea = innerLength * innerBreadth;
  const outerArea = outerLength * outerBreadth;
  const area = outerArea - innerArea;
  return result(
    parameters,
    area,
    "AREA",
    `A_{path}=A_{outer}-A_{inner}`,
    { innerLength, innerBreadth, outerLength, outerBreadth, pathWidth, innerArea, outerArea, area, pathPosition: outside ? "OUTSIDE" : "INSIDE" },
  );
}

function rectangleAreaExplanation(_parameters: Men001Parameters, solver: Men001SolverResult) {
  const v = solver.workingValues;
  return [
    `The path is the region between the outer rectangle and the inner rectangle.`,
    `Outer area = ${v.outerLength} × ${v.outerBreadth} = ${v.outerArea}.`,
    `Inner area = ${v.innerLength} × ${v.innerBreadth} = ${v.innerArea}.`,
    `Path area = ${v.outerArea} − ${v.innerArea} = ${v.area}.`,
    `Therefore, the required path area is ${solver.answer}.`,
  ];
}

function squareAreaSolver(parameters: Men001Parameters, outside: boolean) {
  const innerSide = required(parameters, "innerSide");
  const outerSide = required(parameters, "outerSide");
  const pathWidth = required(parameters, "pathWidth");
  const innerArea = innerSide ** 2;
  const outerArea = outerSide ** 2;
  const area = outerArea - innerArea;
  return result(
    parameters,
    area,
    "AREA",
    `A_{path}=a_{outer}^2-a_{inner}^2`,
    { innerSide, outerSide, pathWidth, innerArea, outerArea, area, pathPosition: outside ? "OUTSIDE" : "INSIDE" },
  );
}

function squareAreaExplanation(_parameters: Men001Parameters, solver: Men001SolverResult) {
  const v = solver.workingValues;
  return [
    `The border area is the difference between the outer and inner squares.`,
    `Outer area = ${v.outerSide}² = ${v.outerArea}.`,
    `Inner area = ${v.innerSide}² = ${v.innerArea}.`,
    `Border area = ${v.outerArea} − ${v.innerArea} = ${v.area}.`,
    `Therefore, the required area is ${solver.answer}.`,
  ];
}

function circleAreaSolver(parameters: Men001Parameters, outside: boolean) {
  const innerRadius = required(parameters, "innerRadius");
  const outerRadius = required(parameters, "outerRadius");
  const pathWidth = required(parameters, "pathWidth");
  const innerArea = piTimes(innerRadius ** 2);
  const outerArea = piTimes(outerRadius ** 2);
  const area = outerArea - innerArea;
  return result(
    parameters,
    area,
    "AREA",
    `A_{path}=π(R^2-r^2),\\quad π=${PI_POLICY}`,
    { innerRadius, outerRadius, pathWidth, innerArea, outerArea, area, piPolicy: PI_POLICY, pathPosition: outside ? "OUTSIDE" : "INSIDE" },
    { piPolicy: PI_POLICY },
  );
}

function circleAreaExplanation(_parameters: Men001Parameters, solver: Men001SolverResult) {
  const v = solver.workingValues;
  return [
    `The circular path is an annular region, so subtract the smaller circle from the larger circle.`,
    `Using π = ${PI_POLICY}, outer area = π × ${v.outerRadius}² = ${v.outerArea}.`,
    `Inner area = π × ${v.innerRadius}² = ${v.innerArea}.`,
    `Path area = ${v.outerArea} − ${v.innerArea} = ${v.area}.`,
    `Therefore, the required path area is ${solver.answer}.`,
  ];
}

export const MEN_001_CP004_SOLVE_MODE_REGISTRY = {
  findOuterRectangularPathArea: {
    reasoningDescription: "Expand both dimensions by twice the path width, then subtract the original rectangular area.",
    generateValues: (seed) => outerRectangleState(seed, "outer-rectangle-area"),
    solve: (parameters) => rectangleAreaSolver(parameters, true),
    explain: rectangleAreaExplanation,
  },
  findInnerRectangularPathArea: {
    reasoningDescription: "Reduce both outer dimensions by twice the path width, then subtract the remaining inner area.",
    generateValues: (seed) => innerRectangleState(seed, "inner-rectangle-area"),
    solve: (parameters) => rectangleAreaSolver(parameters, false),
    explain: rectangleAreaExplanation,
  },
  findOuterSquarePathArea: {
    reasoningDescription: "Expand the square side by twice the width and subtract the original square area.",
    generateValues: (seed) => outerSquareState(seed, "outer-square-area"),
    solve: (parameters) => squareAreaSolver(parameters, true),
    explain: squareAreaExplanation,
  },
  findInnerSquarePathArea: {
    reasoningDescription: "Reduce the square side by twice the width and subtract the inner square area.",
    generateValues: (seed) => innerSquareState(seed, "inner-square-area"),
    solve: (parameters) => squareAreaSolver(parameters, false),
    explain: squareAreaExplanation,
  },
  findOuterCircularPathArea: {
    reasoningDescription: "Add the path width to the radius and subtract the two circle areas.",
    generateValues: (seed) => outerCircleState(seed, "outer-circle-area"),
    solve: (parameters) => circleAreaSolver(parameters, true),
    explain: circleAreaExplanation,
  },
  findInnerCircularPathArea: {
    reasoningDescription: "Subtract the path width from the outer radius and subtract the two circle areas.",
    generateValues: (seed) => innerCircleState(seed, "inner-circle-area"),
    solve: (parameters) => circleAreaSolver(parameters, false),
    explain: circleAreaExplanation,
  },
  findRectangularPathCost: {
    reasoningDescription: "Find the outside rectangular path area and multiply it by the rate per square metre.",
    generateValues: (seed) => {
      const state = outerRectangleState(seed, "rectangle-path-cost");
      const ratePerSquareMetre = pick([12, 15, 18, 20, 25] as const, seed, "rectangle-path-rate");
      return { ...state, ratePerSquareMetre, cost: state.area * ratePerSquareMetre };
    },
    solve: (parameters) => {
      const base = rectangleAreaSolver({ ...parameters, unitPolicy: "SQUARE_METRES" }, true);
      const ratePerSquareMetre = required(parameters, "ratePerSquareMetre");
      const area = Number(base.workingValues.area);
      const cost = area * ratePerSquareMetre;
      return result(parameters, cost, "COST", `Cost=A_{path}×rate`, { ...base.workingValues, ratePerSquareMetre, cost });
    },
    explain: (_parameters, solver) => {
      const v = solver.workingValues;
      return [
        `First find the outside path area by subtracting the garden area from the enlarged outer rectangle.`,
        `Outer area = ${v.outerArea} and inner area = ${v.innerArea}.`,
        `Path area = ${v.outerArea} − ${v.innerArea} = ${v.area} m².`,
        `Cost = ${v.area} × ₹${v.ratePerSquareMetre} = ₹${v.cost}.`,
        `Therefore, the total paving cost is ${solver.answer}.`,
      ];
    },
  },
  findCircularPathCost: {
    reasoningDescription: "Find the annular path area using π = 22/7, then multiply by the area rate.",
    generateValues: (seed) => {
      const state = outerCircleState(seed, "circle-path-cost");
      const ratePerSquareMetre = pick([10, 12, 15, 18, 20] as const, seed, "circle-path-rate");
      return { ...state, ratePerSquareMetre, cost: state.area * ratePerSquareMetre };
    },
    solve: (parameters) => {
      const base = circleAreaSolver({ ...parameters, unitPolicy: "SQUARE_METRES" }, true);
      const ratePerSquareMetre = required(parameters, "ratePerSquareMetre");
      const area = Number(base.workingValues.area);
      const cost = area * ratePerSquareMetre;
      return result(parameters, cost, "COST", `Cost=π(R^2-r^2)×rate`, { ...base.workingValues, ratePerSquareMetre, cost }, { piPolicy: PI_POLICY });
    },
    explain: (_parameters, solver) => {
      const v = solver.workingValues;
      return [
        `The circular path is the outer circle minus the inner circle.`,
        `Using π = ${PI_POLICY}, path area = ${v.outerArea} − ${v.innerArea} = ${v.area} m².`,
        `The paving rate is ₹${v.ratePerSquareMetre} per m².`,
        `Total cost = ${v.area} × ${v.ratePerSquareMetre} = ₹${v.cost}.`,
        `Therefore, the paving cost is ${solver.answer}.`,
      ];
    },
  },
  findOuterSquarePathWidthFromArea: {
    reasoningDescription: "Add path area to the inner square area, take the outer side square root, then halve the side increase.",
    generateValues: (seed) => outerSquareState(seed, "outer-square-width"),
    solve: (parameters) => {
      const innerSide = required(parameters, "innerSide");
      const area = required(parameters, "area");
      const innerArea = innerSide ** 2;
      const outerArea = innerArea + area;
      const outerSide = Math.sqrt(outerArea);
      const pathWidth = (outerSide - innerSide) / 2;
      return result(parameters, pathWidth, "LENGTH", `w=(√(a^2+A)-a)/2`, { innerSide, innerArea, area, outerArea, outerSide, pathWidth, pathPosition: "OUTSIDE" });
    },
    explain: (_parameters, solver) => {
      const v = solver.workingValues;
      return [
        `Add the path area to the inner square area to obtain the outer square area.`,
        `Outer area = ${v.innerSide}² + ${v.area} = ${v.outerArea}.`,
        `Outer side = √${v.outerArea} = ${v.outerSide}.`,
        `The side increased by ${v.outerSide} − ${v.innerSide}; the path occupies half of this increase on each side.`,
        `Therefore, path width = (${v.outerSide} − ${v.innerSide})/2 = ${solver.answer}.`,
      ];
    },
  },
  findRectangularTilesRequiredForFloor: {
    reasoningDescription: "Divide the rectangular floor area by one rectangular tile's area.",
    generateValues: (seed) => rectangularTileState(seed, "rectangular-tile-count"),
    solve: (parameters) => {
      const floorLength = required(parameters, "floorLength");
      const floorBreadth = required(parameters, "floorBreadth");
      const tileLength = required(parameters, "tileLength");
      const tileBreadth = required(parameters, "tileBreadth");
      const floorArea = floorLength * floorBreadth;
      const tileArea = tileLength * tileBreadth;
      const tileCount = floorArea / tileArea;
      return result(parameters, tileCount, "COUNT", `N=(L×B)/(l×b)`, { floorLength, floorBreadth, tileLength, tileBreadth, floorArea, tileArea, tileCount });
    },
    explain: (_parameters, solver) => {
      const v = solver.workingValues;
      return [
        `Floor area = ${v.floorLength} × ${v.floorBreadth} = ${v.floorArea} cm².`,
        `Area of one tile = ${v.tileLength} × ${v.tileBreadth} = ${v.tileArea} cm².`,
        `Number of tiles = floor area ÷ tile area.`,
        `Tiles required = ${v.floorArea} ÷ ${v.tileArea} = ${v.tileCount}.`,
        `Therefore, ${solver.answer} are required.`,
      ];
    },
  },
  findSquareTilesRequiredForFloor: {
    reasoningDescription: "Divide the floor area by the square of one tile's side.",
    generateValues: squareTileState,
    solve: (parameters) => {
      const floorLength = required(parameters, "floorLength");
      const floorBreadth = required(parameters, "floorBreadth");
      const tileLength = required(parameters, "tileLength");
      const floorArea = floorLength * floorBreadth;
      const tileArea = tileLength ** 2;
      const tileCount = floorArea / tileArea;
      return result(parameters, tileCount, "COUNT", `N=(L×B)/a^2`, { floorLength, floorBreadth, tileLength, tileBreadth: tileLength, floorArea, tileArea, tileCount });
    },
    explain: (_parameters, solver) => {
      const v = solver.workingValues;
      return [
        `Floor area = ${v.floorLength} × ${v.floorBreadth} = ${v.floorArea} cm².`,
        `Each square tile has area ${v.tileLength}² = ${v.tileArea} cm².`,
        `Number of tiles = floor area ÷ one-tile area.`,
        `Tiles required = ${v.floorArea} ÷ ${v.tileArea} = ${v.tileCount}.`,
        `Therefore, ${solver.answer} are required.`,
      ];
    },
  },
  findTilePurchaseCostForFloor: {
    reasoningDescription: "Calculate the exact tile count and multiply by the price of one tile.",
    generateValues: (seed) => {
      const state = rectangularTileState(seed, "tile-purchase-count");
      const costPerTile = pick([8, 10, 12, 15, 20] as const, seed, "tile-price");
      return { ...state, costPerTile, cost: state.tileCount * costPerTile };
    },
    solve: (parameters) => {
      const floorLength = required(parameters, "floorLength");
      const floorBreadth = required(parameters, "floorBreadth");
      const tileLength = required(parameters, "tileLength");
      const tileBreadth = required(parameters, "tileBreadth");
      const costPerTile = required(parameters, "costPerTile");
      const floorArea = floorLength * floorBreadth;
      const tileArea = tileLength * tileBreadth;
      const tileCount = floorArea / tileArea;
      const cost = tileCount * costPerTile;
      return result(parameters, cost, "COST", `Cost=((L×B)/(l×b))×price`, { floorLength, floorBreadth, tileLength, tileBreadth, floorArea, tileArea, tileCount, costPerTile, cost });
    },
    explain: (_parameters, solver) => {
      const v = solver.workingValues;
      return [
        `Floor area = ${v.floorArea} cm² and one tile covers ${v.tileArea} cm².`,
        `Tiles required = ${v.floorArea} ÷ ${v.tileArea} = ${v.tileCount}.`,
        `Each tile costs ₹${v.costPerTile}.`,
        `Total cost = ${v.tileCount} × ${v.costPerTile} = ₹${v.cost}.`,
        `Therefore, the tile purchase cost is ${solver.answer}.`,
      ];
    },
  },
  findFlooringCostByAreaRate: {
    reasoningDescription: "Multiply the rectangular floor area by the flooring rate per square metre.",
    generateValues: (seed) => {
      const [length, breadth, ratePerSquareMetre] = pick(FLOORING_COST_STATES, seed, "flooring-cost");
      const area = length * breadth;
      return { length, breadth, ratePerSquareMetre, area, cost: area * ratePerSquareMetre };
    },
    solve: (parameters) => {
      const length = required(parameters, "length");
      const breadth = required(parameters, "breadth");
      const ratePerSquareMetre = required(parameters, "ratePerSquareMetre");
      const area = length * breadth;
      const cost = area * ratePerSquareMetre;
      return result(parameters, cost, "COST", `Cost=L×B×rate`, { length, breadth, area, ratePerSquareMetre, cost });
    },
    explain: (_parameters, solver) => {
      const v = solver.workingValues;
      return [
        `Floor area = length × breadth.`,
        `Area = ${v.length} × ${v.breadth} = ${v.area} m².`,
        `The flooring rate is ₹${v.ratePerSquareMetre} per m².`,
        `Cost = ${v.area} × ${v.ratePerSquareMetre} = ₹${v.cost}.`,
        `Therefore, the flooring cost is ${solver.answer}.`,
      ];
    },
  },
  findRectangularFencingCost: {
    reasoningDescription: "Find the rectangle perimeter and multiply by the fencing rate per metre.",
    generateValues: (seed) => {
      const state = fencingState(seed, "rectangle-fencing-cost");
      return { ...state, cost: state.perimeter * state.ratePerMetre };
    },
    solve: (parameters) => {
      const length = required(parameters, "length");
      const breadth = required(parameters, "breadth");
      const ratePerMetre = required(parameters, "ratePerMetre");
      const perimeter = 2 * (length + breadth);
      const cost = perimeter * ratePerMetre;
      return result(parameters, cost, "COST", `Cost=2(L+B)×rate`, { length, breadth, perimeter, ratePerMetre, cost });
    },
    explain: (_parameters, solver) => {
      const v = solver.workingValues;
      return [
        `The entire boundary must be fenced.`,
        `Perimeter = 2(${v.length} + ${v.breadth}) = ${v.perimeter} m.`,
        `The fencing rate is ₹${v.ratePerMetre} per metre.`,
        `Cost = ${v.perimeter} × ${v.ratePerMetre} = ₹${v.cost}.`,
        `Therefore, the fencing cost is ${solver.answer}.`,
      ];
    },
  },
  findRectangularFencingCostWithGate: {
    reasoningDescription: "Subtract the unfenced gate width from the perimeter before applying the fencing rate.",
    generateValues: (seed) => {
      const state = fencingState(seed, "fencing-cost-gate");
      return { ...state, cost: state.fenceLength * state.ratePerMetre };
    },
    solve: (parameters) => {
      const length = required(parameters, "length");
      const breadth = required(parameters, "breadth");
      const gateWidth = required(parameters, "gateWidth");
      const ratePerMetre = required(parameters, "ratePerMetre");
      const perimeter = 2 * (length + breadth);
      const fenceLength = perimeter - gateWidth;
      const cost = fenceLength * ratePerMetre;
      return result(parameters, cost, "COST", `Cost=[2(L+B)-g]×rate`, { length, breadth, gateWidth, perimeter, fenceLength, ratePerMetre, cost });
    },
    explain: (_parameters, solver) => {
      const v = solver.workingValues;
      return [
        `Rectangle perimeter = 2(${v.length} + ${v.breadth}) = ${v.perimeter} m.`,
        `The ${v.gateWidth} m gate is not fenced.`,
        `Actual fencing length = ${v.perimeter} − ${v.gateWidth} = ${v.fenceLength} m.`,
        `Cost = ${v.fenceLength} × ₹${v.ratePerMetre} = ₹${v.cost}.`,
        `Therefore, the fencing cost is ${solver.answer}.`,
      ];
    },
  },
  findWireLengthForMultipleRounds: {
    reasoningDescription: "Multiply the rectangle perimeter by the number of complete wire rounds.",
    generateValues: (seed) => {
      const state = fencingState(seed, "multiple-wire-rounds");
      const rounds = pick([2, 3, 4, 5] as const, seed, "wire-rounds");
      return { ...state, rounds, wireLength: state.perimeter * rounds };
    },
    solve: (parameters) => {
      const length = required(parameters, "length");
      const breadth = required(parameters, "breadth");
      const rounds = required(parameters, "rounds");
      const perimeter = 2 * (length + breadth);
      const wireLength = perimeter * rounds;
      return result(parameters, wireLength, "LENGTH", `Wire=2(L+B)×rounds`, { length, breadth, perimeter, rounds, wireLength });
    },
    explain: (_parameters, solver) => {
      const v = solver.workingValues;
      return [
        `One complete round uses the rectangular perimeter.`,
        `Perimeter = 2(${v.length} + ${v.breadth}) = ${v.perimeter} m.`,
        `The wire makes ${v.rounds} complete rounds.`,
        `Total wire = ${v.perimeter} × ${v.rounds} = ${v.wireLength} m.`,
        `Therefore, the required wire length is ${solver.answer}.`,
      ];
    },
  },
  findCircularFencingCost: {
    reasoningDescription: "Find the circular circumference using π = 22/7 and multiply by the rate per metre.",
    generateValues: (seed) => {
      const radius = pick([7, 14, 21, 28, 35] as const, seed, "circular-fence-radius");
      const ratePerMetre = pick([20, 25, 30, 35, 40] as const, seed, "circular-fence-rate");
      const circumference = piTimes(2 * radius);
      return { radius, circumference, ratePerMetre, cost: circumference * ratePerMetre, piPolicy: PI_POLICY };
    },
    solve: (parameters) => {
      const radius = required(parameters, "radius");
      const ratePerMetre = required(parameters, "ratePerMetre");
      const circumference = piTimes(2 * radius);
      const cost = circumference * ratePerMetre;
      return result(parameters, cost, "COST", `Cost=2πr×rate,\\quad π=${PI_POLICY}`, { radius, circumference, ratePerMetre, cost, piPolicy: PI_POLICY }, { piPolicy: PI_POLICY });
    },
    explain: (_parameters, solver) => {
      const v = solver.workingValues;
      return [
        `The fencing length is the circle's circumference.`,
        `Using π = ${PI_POLICY}, circumference = 2 × π × ${v.radius} = ${v.circumference} m.`,
        `The fencing rate is ₹${v.ratePerMetre} per metre.`,
        `Cost = ${v.circumference} × ${v.ratePerMetre} = ₹${v.cost}.`,
        `Therefore, the fencing cost is ${solver.answer}.`,
      ];
    },
  },
  findGateWidthFromUsedWire: {
    reasoningDescription: "Subtract the used fencing length from the full rectangular perimeter.",
    generateValues: (seed) => {
      const state = fencingState(seed, "gate-width-recovery");
      return { ...state, wireLength: state.fenceLength };
    },
    solve: (parameters) => {
      const length = required(parameters, "length");
      const breadth = required(parameters, "breadth");
      const wireLength = required(parameters, "wireLength");
      const perimeter = 2 * (length + breadth);
      const gateWidth = perimeter - wireLength;
      return result(parameters, gateWidth, "LENGTH", `g=2(L+B)-wire`, { length, breadth, perimeter, wireLength, gateWidth });
    },
    explain: (_parameters, solver) => {
      const v = solver.workingValues;
      return [
        `The complete rectangular boundary is ${v.perimeter} m.`,
        `Only ${v.wireLength} m of boundary was fenced.`,
        `The unfenced part is the gate opening.`,
        `Gate width = ${v.perimeter} − ${v.wireLength} = ${v.gateWidth} m.`,
        `Therefore, the gate width is ${solver.answer}.`,
      ];
    },
  },
  findRectangularBorderTilesRequired: {
    reasoningDescription: "Find the inside border area and divide by one rectangular tile's area.",
    generateValues: (seed) => {
      const [outerLength, outerBreadth, pathWidth, tileLength, tileBreadth] = pick(BORDER_TILE_STATES, seed, "border-tile-state");
      const innerLength = outerLength - 2 * pathWidth;
      const innerBreadth = outerBreadth - 2 * pathWidth;
      const outerArea = outerLength * outerBreadth;
      const innerArea = innerLength * innerBreadth;
      const area = outerArea - innerArea;
      const tileArea = tileLength * tileBreadth;
      const tileCount = area / tileArea;
      if (!Number.isInteger(tileCount)) throw new Error("MEN-001 CP-004 border-tile state must divide exactly.");
      return { outerLength, outerBreadth, pathWidth, innerLength, innerBreadth, outerArea, innerArea, area, tileLength, tileBreadth, tileArea, tileCount };
    },
    solve: (parameters) => {
      const outerLength = required(parameters, "outerLength");
      const outerBreadth = required(parameters, "outerBreadth");
      const pathWidth = required(parameters, "pathWidth");
      const tileLength = required(parameters, "tileLength");
      const tileBreadth = required(parameters, "tileBreadth");
      const innerLength = outerLength - 2 * pathWidth;
      const innerBreadth = outerBreadth - 2 * pathWidth;
      const outerArea = outerLength * outerBreadth;
      const innerArea = innerLength * innerBreadth;
      const area = outerArea - innerArea;
      const tileArea = tileLength * tileBreadth;
      const tileCount = area / tileArea;
      return result(parameters, tileCount, "COUNT", `N=[LB-(L-2w)(B-2w)]/(l×b)`, { outerLength, outerBreadth, pathWidth, innerLength, innerBreadth, outerArea, innerArea, area, tileLength, tileBreadth, tileArea, tileCount, pathPosition: "INSIDE" });
    },
    explain: (_parameters, solver) => {
      const v = solver.workingValues;
      return [
        `The border is the outer floor area minus the unbordered inner rectangle.`,
        `Border area = ${v.outerArea} − ${v.innerArea} = ${v.area} cm².`,
        `One tile covers ${v.tileLength} × ${v.tileBreadth} = ${v.tileArea} cm².`,
        `Tiles required = ${v.area} ÷ ${v.tileArea} = ${v.tileCount}.`,
        `Therefore, ${solver.answer} are required for the border.`,
      ];
    },
  },
} as const satisfies Record<string, Definition>;

export type Men001Cp004SolveMode = keyof typeof MEN_001_CP004_SOLVE_MODE_REGISTRY;
