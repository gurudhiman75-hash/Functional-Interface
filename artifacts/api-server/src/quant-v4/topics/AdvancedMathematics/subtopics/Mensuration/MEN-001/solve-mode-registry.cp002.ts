import type {
  Men001AnswerDimension,
  Men001CanonicalAnswer,
  Men001Parameters,
  Men001SolverResult,
  Men001UnitPolicy,
} from "./types";

type Values = Men001Parameters["values"];

interface Men001Cp002SolveModeDefinition {
  reasoningDescription: string;
  generateValues: (seed: string) => Values;
  solve: (parameters: Men001Parameters) => Men001SolverResult;
  explain: (parameters: Men001Parameters, solver: Men001SolverResult) => string[];
}

function seedHash(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function pick<T>(values: readonly T[], seed: string, salt: string) {
  if (values.length === 0) throw new Error(`MEN-001 CP-002 cannot pick from an empty list: ${salt}`);
  return values[seedHash(`${seed}:${salt}`) % values.length]!;
}

function requireValue(parameters: Men001Parameters, key: keyof Values) {
  const value = parameters.values[key];
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    throw new Error(`MEN-001 CP-002 requires a positive finite ${String(key)}.`);
  }
  return value;
}

function unitForPolicy(policy: Men001UnitPolicy): Men001SolverResult["unit"] {
  const units: Record<Men001UnitPolicy, Men001SolverResult["unit"]> = {
    CENTIMETRES: "cm",
    METRES: "m",
    SQUARE_CENTIMETRES: "cm²",
    SQUARE_METRES: "m²",
    RUPEES: "₹",
  };
  return units[policy];
}

function integerMeasure(
  value: number,
  unit: Exclude<Men001SolverResult["unit"], "₹">,
  dimension: Exclude<Men001AnswerDimension, "COST">,
): Pick<Men001SolverResult, "exactAnswer" | "canonicalAnswer" | "answer"> {
  if (!Number.isInteger(value)) {
    throw new Error(`MEN-001 CP-002 expected an integer ${dimension} answer; received ${value}.`);
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
    exactAnswer: { kind: "INTEGER", value },
    canonicalAnswer,
    answer: canonicalAnswer.display,
  };
}

function lengthUnit(parameters: Men001Parameters): "cm" | "m" {
  const unit = unitForPolicy(parameters.unitPolicy);
  if (unit !== "cm" && unit !== "m") {
    throw new Error(`MEN-001 CP-002 expected a length unit policy; received ${parameters.unitPolicy}.`);
  }
  return unit;
}

function areaUnit(parameters: Men001Parameters): "cm²" | "m²" {
  const unit = unitForPolicy(parameters.unitPolicy);
  if (unit !== "cm²" && unit !== "m²") {
    throw new Error(`MEN-001 CP-002 expected an area unit policy; received ${parameters.unitPolicy}.`);
  }
  return unit;
}

const RECTANGLE_STATES = [
  [12, 8], [15, 9], [18, 12], [20, 14], [24, 16], [30, 18], [32, 20],
] as const;

const RECTANGLE_DIAGONAL_STATES = [
  [12, 9, 15], [15, 8, 17], [20, 15, 25], [24, 18, 30], [35, 12, 37],
] as const;

const PARALLELOGRAM_STATES = [
  [12, 8, 10], [15, 12, 13], [18, 10, 14], [20, 14, 16], [24, 15, 17],
] as const;

const RHOMBUS_STATES = [
  [10, 24, 13], [16, 30, 17], [18, 24, 15], [14, 48, 25], [24, 32, 20],
] as const;

const TRAPEZIUM_STATES = [
  [12, 20, 8], [15, 25, 10], [18, 30, 12], [20, 34, 14], [24, 40, 16],
] as const;

const KITE_STATES = [
  [12, 18], [14, 24], [16, 30], [18, 32], [20, 36],
] as const;

const GENERAL_QUADRILATERAL_STATES = [
  [16, 7, 9], [18, 8, 12], [20, 9, 13], [24, 10, 14], [30, 12, 18],
] as const;

function rectangleState(seed: string, salt: string) {
  const [length, breadth] = pick(RECTANGLE_STATES, seed, salt);
  return { length, breadth, area: length * breadth, perimeter: 2 * (length + breadth) };
}

function squareState(seed: string, salt: string) {
  const side = pick([6, 8, 10, 12, 14, 16, 18, 20] as const, seed, salt);
  return { side, area: side * side, perimeter: 4 * side, diagonalCoefficient: side };
}

function parallelogramState(seed: string, salt: string) {
  const [base, height, adjacentSide] = pick(PARALLELOGRAM_STATES, seed, salt);
  return { base, height, adjacentSide, area: base * height, perimeter: 2 * (base + adjacentSide) };
}

function rhombusState(seed: string, salt: string) {
  const [diagonalA, diagonalB, side] = pick(RHOMBUS_STATES, seed, salt);
  return {
    diagonalA,
    diagonalB,
    halfDiagonalA: diagonalA / 2,
    halfDiagonalB: diagonalB / 2,
    side,
    area: (diagonalA * diagonalB) / 2,
    perimeter: 4 * side,
  };
}

function trapeziumState(seed: string, salt: string) {
  const [parallelSideA, parallelSideB, height] = pick(TRAPEZIUM_STATES, seed, salt);
  return {
    parallelSideA,
    parallelSideB,
    height,
    area: ((parallelSideA + parallelSideB) * height) / 2,
  };
}

function kiteState(seed: string, salt: string) {
  const [diagonalA, diagonalB] = pick(KITE_STATES, seed, salt);
  return { diagonalA, diagonalB, area: (diagonalA * diagonalB) / 2 };
}

function generalQuadrilateralState(seed: string) {
  const [diagonal, perpendicularA, perpendicularB] = pick(
    GENERAL_QUADRILATERAL_STATES,
    seed,
    "general-quadrilateral",
  );
  return {
    diagonal,
    perpendicularA,
    perpendicularB,
    area: (diagonal * (perpendicularA + perpendicularB)) / 2,
  };
}

export const MEN_001_CP002_SOLVE_MODE_REGISTRY = {
  findRectangleArea: {
    reasoningDescription: "Multiply the rectangle's length by its breadth.",
    generateValues: (seed) => rectangleState(seed, "rectangle-area"),
    solve: (p) => {
      const length = requireValue(p, "length");
      const breadth = requireValue(p, "breadth");
      const area = length * breadth;
      const unit = areaUnit(p);
      return {
        ...integerMeasure(area, unit, "AREA"),
        answerDimension: "AREA",
        unit,
        equation: `A = l\\times b = ${length}\\times ${breadth}`,
        workingValues: { length, breadth, area },
      };
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        "A rectangle's area is the product of its perpendicular dimensions.",
        "Use A = length × breadth.",
        `Substitution: A = ${v.length} × ${v.breadth}.`,
        `Thus A = ${v.area}.`,
        `Therefore, the required area is ${s.answer}.`,
      ];
    },
  },
  findRectanglePerimeter: {
    reasoningDescription: "Add one length and one breadth, then double the sum.",
    generateValues: (seed) => rectangleState(seed, "rectangle-perimeter"),
    solve: (p) => {
      const length = requireValue(p, "length");
      const breadth = requireValue(p, "breadth");
      const perimeter = 2 * (length + breadth);
      const unit = lengthUnit(p);
      return {
        ...integerMeasure(perimeter, unit, "LENGTH"),
        answerDimension: "LENGTH",
        unit,
        equation: `P = 2(l+b) = 2(${length}+${breadth})`,
        workingValues: { length, breadth, perimeter },
      };
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        "Opposite sides of a rectangle are equal.",
        "Therefore, P = 2(length + breadth).",
        `Substitution: P = 2(${v.length} + ${v.breadth}).`,
        `Thus P = ${v.perimeter}.`,
        `Therefore, the perimeter is ${s.answer}.`,
      ];
    },
  },
  findRectangleLengthFromArea: {
    reasoningDescription: "Divide the area by the known breadth.",
    generateValues: (seed) => rectangleState(seed, "rectangle-length-area"),
    solve: (p) => {
      const area = requireValue(p, "area");
      const breadth = requireValue(p, "breadth");
      const length = area / breadth;
      const unit = lengthUnit(p);
      return {
        ...integerMeasure(length, unit, "LENGTH"),
        answerDimension: "LENGTH",
        unit,
        equation: `l = A/b = ${area}/${breadth}`,
        workingValues: { area, breadth, length },
      };
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        "Start with A = length × breadth.",
        "Isolate the length: length = area ÷ breadth.",
        `Substitution: length = ${v.area} ÷ ${v.breadth}.`,
        `Thus length = ${v.length}.`,
        `Therefore, the required length is ${s.answer}.`,
      ];
    },
  },
  findRectangleBreadthFromPerimeter: {
    reasoningDescription: "Halve the perimeter and subtract the known length.",
    generateValues: (seed) => rectangleState(seed, "rectangle-breadth-perimeter"),
    solve: (p) => {
      const perimeter = requireValue(p, "perimeter");
      const length = requireValue(p, "length");
      const breadth = perimeter / 2 - length;
      const unit = lengthUnit(p);
      return {
        ...integerMeasure(breadth, unit, "LENGTH"),
        answerDimension: "LENGTH",
        unit,
        equation: `b = P/2-l = ${perimeter}/2-${length}`,
        workingValues: { perimeter, length, breadth },
      };
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        "For a rectangle, P = 2(length + breadth).",
        "Hence length + breadth = P/2.",
        `So breadth = ${v.perimeter}/2 − ${v.length}.`,
        `Thus breadth = ${v.breadth}.`,
        `Therefore, the required breadth is ${s.answer}.`,
      ];
    },
  },
  findRectangleAreaFromPerimeterAndLength: {
    reasoningDescription: "Recover the breadth from the perimeter, then calculate area.",
    generateValues: (seed) => rectangleState(seed, "rectangle-area-perimeter-length"),
    solve: (p) => {
      const perimeter = requireValue(p, "perimeter");
      const length = requireValue(p, "length");
      const breadth = perimeter / 2 - length;
      const area = length * breadth;
      const unit = areaUnit(p);
      return {
        ...integerMeasure(area, unit, "AREA"),
        answerDimension: "AREA",
        unit,
        equation: `b=P/2-l,\\quad A=lb`,
        workingValues: { perimeter, length, breadth, area },
      };
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        "The breadth must be recovered before finding the area.",
        `Breadth = ${v.perimeter}/2 − ${v.length} = ${v.breadth}.`,
        "Now use A = length × breadth.",
        `A = ${v.length} × ${v.breadth} = ${v.area}.`,
        `Therefore, the required area is ${s.answer}.`,
      ];
    },
  },
  findRectangleOtherSideFromDiagonal: {
    reasoningDescription: "Use the rectangle's diagonal as the hypotenuse of a right triangle.",
    generateValues: (seed) => {
      const [length, breadth, diagonal] = pick(RECTANGLE_DIAGONAL_STATES, seed, "rectangle-diagonal");
      return { length, breadth, diagonal };
    },
    solve: (p) => {
      const diagonal = requireValue(p, "diagonal");
      const length = requireValue(p, "length");
      const breadth = Math.sqrt(diagonal ** 2 - length ** 2);
      const unit = lengthUnit(p);
      return {
        ...integerMeasure(breadth, unit, "LENGTH"),
        answerDimension: "LENGTH",
        unit,
        equation: `b=\\sqrt{d^2-l^2}=\\sqrt{${diagonal}^2-${length}^2}`,
        workingValues: { diagonal, length, breadth },
      };
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        "A rectangle's diagonal, length and breadth form a right triangle.",
        "By Pythagoras, d² = l² + b².",
        `Therefore, b = √(${v.diagonal}² − ${v.length}²).`,
        `This gives b = ${v.breadth}.`,
        `Hence, the other side is ${s.answer}.`,
      ];
    },
  },
  findSquareAreaFromSide: {
    reasoningDescription: "Square the side length.",
    generateValues: (seed) => squareState(seed, "square-area"),
    solve: (p) => {
      const side = requireValue(p, "side");
      const area = side ** 2;
      const unit = areaUnit(p);
      return {
        ...integerMeasure(area, unit, "AREA"),
        answerDimension: "AREA",
        unit,
        equation: `A=a^2=${side}^2`,
        workingValues: { side, area },
      };
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        "All four sides of a square are equal.",
        "Use A = side².",
        `Substitution: A = ${v.side}².`,
        `Thus A = ${v.area}.`,
        `Therefore, the area is ${s.answer}.`,
      ];
    },
  },
  findSquarePerimeterFromSide: {
    reasoningDescription: "Multiply the side by four.",
    generateValues: (seed) => squareState(seed, "square-perimeter"),
    solve: (p) => {
      const side = requireValue(p, "side");
      const perimeter = 4 * side;
      const unit = lengthUnit(p);
      return {
        ...integerMeasure(perimeter, unit, "LENGTH"),
        answerDimension: "LENGTH",
        unit,
        equation: `P=4a=4\\times ${side}`,
        workingValues: { side, perimeter },
      };
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        "A square has four equal sides.",
        "Therefore, P = 4 × side.",
        `P = 4 × ${v.side}.`,
        `Thus P = ${v.perimeter}.`,
        `Hence, the perimeter is ${s.answer}.`,
      ];
    },
  },
  findSquareSideFromArea: {
    reasoningDescription: "Take the positive square root of the area.",
    generateValues: (seed) => squareState(seed, "square-side-area"),
    solve: (p) => {
      const area = requireValue(p, "area");
      const side = Math.sqrt(area);
      const unit = lengthUnit(p);
      return {
        ...integerMeasure(side, unit, "LENGTH"),
        answerDimension: "LENGTH",
        unit,
        equation: `a=\\sqrt{A}=\\sqrt{${area}}`,
        workingValues: { area, side },
      };
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        "For a square, A = side².",
        "So the side is the positive square root of the area.",
        `Side = √${v.area}.`,
        `Thus side = ${v.side}.`,
        `Therefore, the side length is ${s.answer}.`,
      ];
    },
  },
  findSquareAreaFromDiagonal: {
    reasoningDescription: "Use A = d²/2 for a square.",
    generateValues: (seed) => squareState(seed, "square-area-diagonal"),
    solve: (p) => {
      const diagonalCoefficient = requireValue(p, "diagonalCoefficient");
      const area = diagonalCoefficient ** 2;
      const unit = areaUnit(p);
      return {
        ...integerMeasure(area, unit, "AREA"),
        answerDimension: "AREA",
        unit,
        equation: `d=${diagonalCoefficient}\\sqrt2,\\quad A=d^2/2`,
        workingValues: { diagonalCoefficient, side: diagonalCoefficient, area },
      };
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        "For a square, diagonal d = side√2.",
        `Since d = ${v.diagonalCoefficient}√2, the side is ${v.diagonalCoefficient}.`,
        "Area = side².",
        `Thus A = ${v.diagonalCoefficient}² = ${v.area}.`,
        `Therefore, the area is ${s.answer}.`,
      ];
    },
  },
  findSquarePerimeterFromDiagonal: {
    reasoningDescription: "Recover the side from d = a√2, then multiply by four.",
    generateValues: (seed) => squareState(seed, "square-perimeter-diagonal"),
    solve: (p) => {
      const diagonalCoefficient = requireValue(p, "diagonalCoefficient");
      const side = diagonalCoefficient;
      const perimeter = 4 * side;
      const unit = lengthUnit(p);
      return {
        ...integerMeasure(perimeter, unit, "LENGTH"),
        answerDimension: "LENGTH",
        unit,
        equation: `d=a\\sqrt2,\\quad P=4a`,
        workingValues: { diagonalCoefficient, side, perimeter },
      };
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        "For a square, d = side√2.",
        `The given diagonal ${v.diagonalCoefficient}√2 gives side = ${v.side}.`,
        "Now use P = 4 × side.",
        `P = 4 × ${v.side} = ${v.perimeter}.`,
        `Therefore, the perimeter is ${s.answer}.`,
      ];
    },
  },
  findParallelogramArea: {
    reasoningDescription: "Multiply the base by its perpendicular height.",
    generateValues: (seed) => parallelogramState(seed, "parallelogram-area"),
    solve: (p) => {
      const base = requireValue(p, "base");
      const height = requireValue(p, "height");
      const area = base * height;
      const unit = areaUnit(p);
      return {
        ...integerMeasure(area, unit, "AREA"),
        answerDimension: "AREA",
        unit,
        equation: `A=bh=${base}\\times ${height}`,
        workingValues: { base, height, area },
      };
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        "A parallelogram uses the perpendicular height, not the sloping side.",
        "Use A = base × perpendicular height.",
        `A = ${v.base} × ${v.height}.`,
        `Thus A = ${v.area}.`,
        `Therefore, the area is ${s.answer}.`,
      ];
    },
  },
  findParallelogramHeightFromArea: {
    reasoningDescription: "Divide the area by the base.",
    generateValues: (seed) => parallelogramState(seed, "parallelogram-height"),
    solve: (p) => {
      const area = requireValue(p, "area");
      const base = requireValue(p, "base");
      const height = area / base;
      const unit = lengthUnit(p);
      return {
        ...integerMeasure(height, unit, "LENGTH"),
        answerDimension: "LENGTH",
        unit,
        equation: `h=A/b=${area}/${base}`,
        workingValues: { area, base, height },
      };
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        "For a parallelogram, A = base × height.",
        "Isolate the height: h = A/b.",
        `h = ${v.area}/${v.base}.`,
        `Thus h = ${v.height}.`,
        `Therefore, the perpendicular height is ${s.answer}.`,
      ];
    },
  },
  findParallelogramBaseFromArea: {
    reasoningDescription: "Divide the area by the perpendicular height.",
    generateValues: (seed) => parallelogramState(seed, "parallelogram-base"),
    solve: (p) => {
      const area = requireValue(p, "area");
      const height = requireValue(p, "height");
      const base = area / height;
      const unit = lengthUnit(p);
      return {
        ...integerMeasure(base, unit, "LENGTH"),
        answerDimension: "LENGTH",
        unit,
        equation: `b=A/h=${area}/${height}`,
        workingValues: { area, height, base },
      };
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        "For a parallelogram, A = base × height.",
        "Isolate the base: b = A/h.",
        `b = ${v.area}/${v.height}.`,
        `Thus b = ${v.base}.`,
        `Therefore, the base is ${s.answer}.`,
      ];
    },
  },
  findParallelogramPerimeter: {
    reasoningDescription: "Double the sum of two adjacent sides.",
    generateValues: (seed) => parallelogramState(seed, "parallelogram-perimeter"),
    solve: (p) => {
      const base = requireValue(p, "base");
      const adjacentSide = requireValue(p, "adjacentSide");
      const perimeter = 2 * (base + adjacentSide);
      const unit = lengthUnit(p);
      return {
        ...integerMeasure(perimeter, unit, "LENGTH"),
        answerDimension: "LENGTH",
        unit,
        equation: `P=2(a+b)=2(${base}+${adjacentSide})`,
        workingValues: { base, adjacentSide, perimeter },
      };
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        "Opposite sides of a parallelogram are equal.",
        "Hence P = 2(sum of adjacent sides).",
        `P = 2(${v.base} + ${v.adjacentSide}).`,
        `Thus P = ${v.perimeter}.`,
        `Therefore, the perimeter is ${s.answer}.`,
      ];
    },
  },
  findRhombusAreaFromDiagonals: {
    reasoningDescription: "Take one-half of the product of the perpendicular diagonals.",
    generateValues: (seed) => rhombusState(seed, "rhombus-area"),
    solve: (p) => {
      const diagonalA = requireValue(p, "diagonalA");
      const diagonalB = requireValue(p, "diagonalB");
      const area = (diagonalA * diagonalB) / 2;
      const unit = areaUnit(p);
      return {
        ...integerMeasure(area, unit, "AREA"),
        answerDimension: "AREA",
        unit,
        equation: `A=\\frac12 d_1d_2`,
        workingValues: { diagonalA, diagonalB, area },
      };
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        "The diagonals of a rhombus intersect at right angles.",
        "Use A = 1/2 × d₁ × d₂.",
        `A = 1/2 × ${v.diagonalA} × ${v.diagonalB}.`,
        `Thus A = ${v.area}.`,
        `Therefore, the area is ${s.answer}.`,
      ];
    },
  },
  findRhombusMissingDiagonal: {
    reasoningDescription: "Rearrange A = d₁d₂/2 to recover the missing diagonal.",
    generateValues: (seed) => rhombusState(seed, "rhombus-missing-diagonal"),
    solve: (p) => {
      const area = requireValue(p, "area");
      const diagonalA = requireValue(p, "diagonalA");
      const diagonalB = (2 * area) / diagonalA;
      const unit = lengthUnit(p);
      return {
        ...integerMeasure(diagonalB, unit, "LENGTH"),
        answerDimension: "LENGTH",
        unit,
        equation: `d_2=2A/d_1`,
        workingValues: { area, diagonalA, diagonalB },
      };
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        "For a rhombus, A = d₁d₂/2.",
        "Rearrange to d₂ = 2A/d₁.",
        `d₂ = 2 × ${v.area}/${v.diagonalA}.`,
        `Thus d₂ = ${v.diagonalB}.`,
        `Therefore, the missing diagonal is ${s.answer}.`,
      ];
    },
  },
  findRhombusSideFromDiagonals: {
    reasoningDescription: "Use the half-diagonals as perpendicular legs of a right triangle.",
    generateValues: (seed) => rhombusState(seed, "rhombus-side"),
    solve: (p) => {
      const diagonalA = requireValue(p, "diagonalA");
      const diagonalB = requireValue(p, "diagonalB");
      const halfDiagonalA = diagonalA / 2;
      const halfDiagonalB = diagonalB / 2;
      const side = Math.sqrt(halfDiagonalA ** 2 + halfDiagonalB ** 2);
      const unit = lengthUnit(p);
      return {
        ...integerMeasure(side, unit, "LENGTH"),
        answerDimension: "LENGTH",
        unit,
        equation: `a=\\sqrt{(d_1/2)^2+(d_2/2)^2}`,
        workingValues: { diagonalA, diagonalB, halfDiagonalA, halfDiagonalB, side },
      };
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        "The diagonals of a rhombus bisect each other at right angles.",
        `Their half-lengths are ${v.halfDiagonalA} and ${v.halfDiagonalB}.`,
        "A side of the rhombus is the hypotenuse of the resulting right triangle.",
        `Side = √(${v.halfDiagonalA}² + ${v.halfDiagonalB}²) = ${v.side}.`,
        `Therefore, the side length is ${s.answer}.`,
      ];
    },
  },
  findRhombusPerimeterFromDiagonals: {
    reasoningDescription: "Recover a side from the half-diagonals, then multiply it by four.",
    generateValues: (seed) => rhombusState(seed, "rhombus-perimeter"),
    solve: (p) => {
      const diagonalA = requireValue(p, "diagonalA");
      const diagonalB = requireValue(p, "diagonalB");
      const halfDiagonalA = diagonalA / 2;
      const halfDiagonalB = diagonalB / 2;
      const side = Math.sqrt(halfDiagonalA ** 2 + halfDiagonalB ** 2);
      const perimeter = 4 * side;
      const unit = lengthUnit(p);
      return {
        ...integerMeasure(perimeter, unit, "LENGTH"),
        answerDimension: "LENGTH",
        unit,
        equation: `a=\\sqrt{(d_1/2)^2+(d_2/2)^2},\\quad P=4a`,
        workingValues: { diagonalA, diagonalB, halfDiagonalA, halfDiagonalB, side, perimeter },
      };
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        "The half-diagonals form the perpendicular legs of a right triangle.",
        `Side = √(${v.halfDiagonalA}² + ${v.halfDiagonalB}²) = ${v.side}.`,
        "A rhombus has four equal sides.",
        `Perimeter = 4 × ${v.side} = ${v.perimeter}.`,
        `Therefore, the perimeter is ${s.answer}.`,
      ];
    },
  },
  findTrapeziumArea: {
    reasoningDescription: "Multiply the height by half the sum of the parallel sides.",
    generateValues: (seed) => trapeziumState(seed, "trapezium-area"),
    solve: (p) => {
      const parallelSideA = requireValue(p, "parallelSideA");
      const parallelSideB = requireValue(p, "parallelSideB");
      const height = requireValue(p, "height");
      const area = ((parallelSideA + parallelSideB) * height) / 2;
      const unit = areaUnit(p);
      return {
        ...integerMeasure(area, unit, "AREA"),
        answerDimension: "AREA",
        unit,
        equation: `A=\\frac12(a+b)h`,
        workingValues: { parallelSideA, parallelSideB, height, area },
      };
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        "A trapezium's area depends on its two parallel sides and perpendicular height.",
        "Use A = 1/2 × (sum of parallel sides) × height.",
        `A = 1/2 × (${v.parallelSideA} + ${v.parallelSideB}) × ${v.height}.`,
        `Thus A = ${v.area}.`,
        `Therefore, the area is ${s.answer}.`,
      ];
    },
  },
  findTrapeziumHeight: {
    reasoningDescription: "Double the area and divide by the sum of the parallel sides.",
    generateValues: (seed) => trapeziumState(seed, "trapezium-height"),
    solve: (p) => {
      const area = requireValue(p, "area");
      const parallelSideA = requireValue(p, "parallelSideA");
      const parallelSideB = requireValue(p, "parallelSideB");
      const height = (2 * area) / (parallelSideA + parallelSideB);
      const unit = lengthUnit(p);
      return {
        ...integerMeasure(height, unit, "LENGTH"),
        answerDimension: "LENGTH",
        unit,
        equation: `h=2A/(a+b)`,
        workingValues: { area, parallelSideA, parallelSideB, height },
      };
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        "Use A = 1/2(a + b)h for a trapezium.",
        "Rearrange to h = 2A/(a + b).",
        `h = 2 × ${v.area}/(${v.parallelSideA} + ${v.parallelSideB}).`,
        `Thus h = ${v.height}.`,
        `Therefore, the perpendicular height is ${s.answer}.`,
      ];
    },
  },
  findTrapeziumMissingParallelSide: {
    reasoningDescription: "Recover the sum of parallel sides, then subtract the known side.",
    generateValues: (seed) => trapeziumState(seed, "trapezium-missing-side"),
    solve: (p) => {
      const area = requireValue(p, "area");
      const height = requireValue(p, "height");
      const parallelSideA = requireValue(p, "parallelSideA");
      const parallelSideB = (2 * area) / height - parallelSideA;
      const unit = lengthUnit(p);
      return {
        ...integerMeasure(parallelSideB, unit, "LENGTH"),
        answerDimension: "LENGTH",
        unit,
        equation: `b=2A/h-a`,
        workingValues: { area, height, parallelSideA, parallelSideB },
      };
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        "From A = 1/2(a + b)h, the sum of parallel sides is 2A/h.",
        `a + b = 2 × ${v.area}/${v.height}.`,
        `Therefore, b = 2 × ${v.area}/${v.height} − ${v.parallelSideA}.`,
        `Thus b = ${v.parallelSideB}.`,
        `Hence, the missing parallel side is ${s.answer}.`,
      ];
    },
  },
  findKiteAreaFromDiagonals: {
    reasoningDescription: "Take one-half of the product of the perpendicular diagonals.",
    generateValues: (seed) => kiteState(seed, "kite-area"),
    solve: (p) => {
      const diagonalA = requireValue(p, "diagonalA");
      const diagonalB = requireValue(p, "diagonalB");
      const area = (diagonalA * diagonalB) / 2;
      const unit = areaUnit(p);
      return {
        ...integerMeasure(area, unit, "AREA"),
        answerDimension: "AREA",
        unit,
        equation: `A=\\frac12 d_1d_2`,
        workingValues: { diagonalA, diagonalB, area },
      };
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        "The diagonals used for the kite are perpendicular.",
        "Use A = 1/2 × d₁ × d₂.",
        `A = 1/2 × ${v.diagonalA} × ${v.diagonalB}.`,
        `Thus A = ${v.area}.`,
        `Therefore, the area is ${s.answer}.`,
      ];
    },
  },
  findKiteMissingDiagonal: {
    reasoningDescription: "Rearrange A = d₁d₂/2 to recover the missing diagonal.",
    generateValues: (seed) => kiteState(seed, "kite-missing-diagonal"),
    solve: (p) => {
      const area = requireValue(p, "area");
      const diagonalA = requireValue(p, "diagonalA");
      const diagonalB = (2 * area) / diagonalA;
      const unit = lengthUnit(p);
      return {
        ...integerMeasure(diagonalB, unit, "LENGTH"),
        answerDimension: "LENGTH",
        unit,
        equation: `d_2=2A/d_1`,
        workingValues: { area, diagonalA, diagonalB },
      };
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        "For a kite with perpendicular diagonals, A = d₁d₂/2.",
        "Rearrange to d₂ = 2A/d₁.",
        `d₂ = 2 × ${v.area}/${v.diagonalA}.`,
        `Thus d₂ = ${v.diagonalB}.`,
        `Therefore, the missing diagonal is ${s.answer}.`,
      ];
    },
  },
  findQuadrilateralAreaFromDiagonalPerpendiculars: {
    reasoningDescription: "Split the quadrilateral along a diagonal and add the two triangle areas.",
    generateValues: generalQuadrilateralState,
    solve: (p) => {
      const diagonal = requireValue(p, "diagonal");
      const perpendicularA = requireValue(p, "perpendicularA");
      const perpendicularB = requireValue(p, "perpendicularB");
      const area = (diagonal * (perpendicularA + perpendicularB)) / 2;
      const unit = areaUnit(p);
      return {
        ...integerMeasure(area, unit, "AREA"),
        answerDimension: "AREA",
        unit,
        equation: `A=\\frac12 d(h_1+h_2)`,
        workingValues: { diagonal, perpendicularA, perpendicularB, area },
      };
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        "The diagonal divides the quadrilateral into two triangles.",
        "Both triangles have the same base—the diagonal—but different perpendicular heights.",
        "Adding their areas gives A = 1/2 × d × (h₁ + h₂).",
        `A = 1/2 × ${v.diagonal} × (${v.perpendicularA} + ${v.perpendicularB}) = ${v.area}.`,
        `Therefore, the quadrilateral's area is ${s.answer}.`,
      ];
    },
  },
} as const satisfies Record<string, Men001Cp002SolveModeDefinition>;

export type Men001Cp002SolveMode = keyof typeof MEN_001_CP002_SOLVE_MODE_REGISTRY;
