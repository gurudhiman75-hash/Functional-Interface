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
  return items[hash(`${seed}:${salt}`) % items.length]!;
}

function positive(parameters: Men001Parameters, key: keyof Values) {
  const candidate = Number(parameters.values[key]);
  if (!Number.isFinite(candidate) || candidate <= 0) {
    throw new Error(`MEN-001 CP-006 requires positive ${String(key)}.`);
  }
  return candidate;
}

function answerUnit(parameters: Men001Parameters) {
  switch (parameters.unitPolicy) {
    case "CENTIMETRES": return "cm" as const;
    case "METRES": return "m" as const;
    case "SQUARE_CENTIMETRES": return "cm²" as const;
    case "SQUARE_METRES": return "m²" as const;
    case "PERCENT": return "%" as const;
    case "TIMES": return "times" as const;
    default:
      throw new Error(`MEN-001 CP-006 does not support unit policy ${parameters.unitPolicy}.`);
  }
}

function integerResult(
  parameters: Men001Parameters,
  answerDimension: "LENGTH" | "AREA" | "PERCENT" | "SCALAR",
  answerValue: number,
  equation: string,
  workingValues: Record<string, string | number>,
  usesPi = false,
): Men001SolverResult {
  if (!Number.isInteger(answerValue) || answerValue <= 0) {
    throw new Error(`MEN-001 CP-006 expected a positive integer answer; received ${answerValue}.`);
  }
  const unit = answerUnit(parameters);
  const display = unit === "%" ? `${answerValue}%` : `${answerValue} ${unit}`;
  const canonicalAnswer: Men001CanonicalAnswer = {
    kind: "unit",
    value: answerValue,
    unit,
    precision: 0,
    display,
    rounding: "exact",
    metadata: {
      answerDimension,
      exactKind: "INTEGER",
      ...(usesPi ? { piPolicy: PI_POLICY } : {}),
    },
  };
  return {
    exactAnswer: { kind: "INTEGER", value: answerValue },
    canonicalAnswer,
    answer: display,
    answerDimension,
    unit,
    equation,
    workingValues: {
      ...workingValues,
      ...(usesPi ? { piPolicy: PI_POLICY } : {}),
    },
  };
}

const CM_LENGTHS = [300, 500, 800, 1200, 2500] as const;
const M_LENGTHS = [3, 5, 8, 12, 25] as const;
const CM_AREAS = [20000, 50000, 80000, 120000, 250000] as const;
const M_AREAS = [2, 5, 8, 12, 25] as const;
const MIXED_RECTANGLES = [
  [12, 500],
  [15, 800],
  [18, 600],
  [24, 900],
  [30, 1200],
] as const;
const MIXED_REVERSE = [
  [96, 800],
  [120, 500],
  [216, 900],
  [360, 1200],
] as const;
const SCALE_STATES = [
  [40, 12, 2],
  [60, 20, 3],
  [80, 25, 4],
  [100, 32, 2],
] as const;
const UNIFORM_INCREASES = [10, 20, 50] as const;
const UNIFORM_DECREASES = [10, 20, 40] as const;
const INDEPENDENT_CHANGES = [
  [50, 20],
  [40, 20],
  [60, 25],
] as const;
const NEW_AREA_CHANGE_STATES = [
  [200, 50, 20],
  [500, 40, 20],
  [400, 50, 10],
] as const;
const MAP_LENGTH_STATES = [
  [3, 200],
  [5, 500],
  [8, 1000],
  [12, 250],
] as const;
const MAP_AREA_STATES = [
  [4, 100],
  [9, 200],
  [16, 500],
  [25, 1000],
] as const;
const PLAN_STATES = [
  [3, 4, 100],
  [2, 5, 200],
  [4, 6, 250],
  [5, 8, 500],
] as const;
const SQUARE_RECTANGLE_WIRE_STATES = [
  [12, 8],
  [15, 10],
  [18, 12],
  [24, 16],
] as const;
const RECTANGLE_WIRE_STATES = [
  [14, 10],
  [18, 14],
  [20, 12],
  [24, 16],
  [30, 18],
] as const;
const SQUARE_CIRCLE_SIDES = [11, 22, 33, 44] as const;
const CIRCLE_SQUARE_RADII = [7, 14, 21, 28] as const;
const RECTANGLE_CIRCLE_STATES = [
  [14, 8],
  [30, 14],
  [36, 8],
  [40, 26],
] as const;
const SQUARE_POLYGON_SIDES = [12, 18, 24, 30] as const;
const FIXED_PERIMETERS = [40, 48, 60, 80] as const;
const CIRCLE_SQUARE_PERIMETERS = [88, 176, 264] as const;
const CIRCLE_RECTANGLE_REVERSE = [
  [14, 30],
  [21, 40],
  [28, 50],
] as const;

function cmLengthState(seed: string): Values {
  return { length: pick(CM_LENGTHS, seed, "cm-length") };
}
function mLengthState(seed: string): Values {
  return { length: pick(M_LENGTHS, seed, "m-length") };
}
function cmAreaState(seed: string): Values {
  return { area: pick(CM_AREAS, seed, "cm-area") };
}
function mAreaState(seed: string): Values {
  return { area: pick(M_AREAS, seed, "m-area") };
}
function mixedRectangleState(seed: string): Values {
  const [length, breadth] = pick(MIXED_RECTANGLES, seed, "mixed-rectangle");
  return { length, breadth };
}
function mixedReverseState(seed: string): Values {
  const [area, breadth] = pick(MIXED_REVERSE, seed, "mixed-reverse");
  return { area, breadth };
}
function squareConvertedState(seed: string): Values {
  return { side: pick(CM_LENGTHS, seed, "square-side-conversion") };
}
function scaleState(seed: string, salt: string): Values {
  const [perimeter, area, scale] = pick(SCALE_STATES, seed, salt);
  return { perimeter, area, scale };
}
function uniformIncreaseState(seed: string): Values {
  return { scale: pick(UNIFORM_INCREASES, seed, "uniform-increase") };
}
function uniformDecreaseState(seed: string): Values {
  return { scale: pick(UNIFORM_DECREASES, seed, "uniform-decrease") };
}
function independentChangeState(seed: string): Values {
  const [ratePerMetre, ratePerSquareMetre] = pick(INDEPENDENT_CHANGES, seed, "independent-change");
  return { ratePerMetre, ratePerSquareMetre };
}
function changedAreaState(seed: string): Values {
  const [area, ratePerMetre, ratePerSquareMetre] = pick(NEW_AREA_CHANGE_STATES, seed, "changed-area");
  return { area, ratePerMetre, ratePerSquareMetre };
}
function mapLengthState(seed: string): Values {
  const [length, scale] = pick(MAP_LENGTH_STATES, seed, "map-length");
  return { length, scale };
}
function mapLengthReverseState(seed: string): Values {
  const [length, scale] = pick(MAP_LENGTH_STATES, seed, "map-length-reverse");
  return { distance: length * scale, scale };
}
function mapAreaState(seed: string): Values {
  const [area, scale] = pick(MAP_AREA_STATES, seed, "map-area");
  return { area, scale };
}
function mapAreaReverseState(seed: string): Values {
  const [area, scale] = pick(MAP_AREA_STATES, seed, "map-area-reverse");
  return { outerArea: area * scale * scale, scale };
}
function planState(seed: string): Values {
  const [length, breadth, scale] = pick(PLAN_STATES, seed, "plan-area");
  return { length, breadth, scale };
}
function squareToRectangleState(seed: string): Values {
  const [side, breadth] = pick(SQUARE_RECTANGLE_WIRE_STATES, seed, "square-to-rectangle");
  return { side, breadth };
}
function rectangleWireState(seed: string, salt: string): Values {
  const [length, breadth] = pick(RECTANGLE_WIRE_STATES, seed, salt);
  return { length, breadth };
}
function squareCircleState(seed: string, salt: string): Values {
  return { side: pick(SQUARE_CIRCLE_SIDES, seed, salt) };
}
function circleSquareState(seed: string, salt: string): Values {
  return { radius: pick(CIRCLE_SQUARE_RADII, seed, salt) };
}
function rectangleCircleState(seed: string): Values {
  const [length, breadth] = pick(RECTANGLE_CIRCLE_STATES, seed, "rectangle-to-circle");
  return { length, breadth };
}
function squarePolygonState(seed: string, salt: string): Values {
  return { side: pick(SQUARE_POLYGON_SIDES, seed, salt) };
}
function fixedPerimeterState(seed: string): Values {
  return { perimeter: pick(FIXED_PERIMETERS, seed, "fixed-perimeter") };
}
function circleSquarePerimeterState(seed: string): Values {
  return { perimeter: pick(CIRCLE_SQUARE_PERIMETERS, seed, "circle-square-perimeter") };
}
function circleRectangleReverseState(seed: string): Values {
  const [radius, length] = pick(CIRCLE_RECTANGLE_REVERSE, seed, "circle-to-rectangle-reverse");
  return { radius, length };
}

export const MEN_001_CP006_SOLVE_MODE_REGISTRY = {
  convertCentimetresToMetres: {
    reasoningDescription: "Convert a linear measure from centimetres to metres by dividing by 100.",
    generateValues: cmLengthState,
    solve: (parameters: Men001Parameters) => {
      const length = positive(parameters, "length");
      const convertedLength = length / 100;
      return integerResult(parameters, "LENGTH", convertedLength, "m=cm/100", { length, convertedLength });
    },
    explain: (_parameters: Men001Parameters, solver: Men001SolverResult) => [
      "Centimetres and metres are linear units, so the conversion factor is 100.",
      "Every 100 centimetres make 1 metre.",
      "The metre value is found by dividing the centimetre value by 100.",
      `Length = ${solver.workingValues.length} / 100 = ${solver.workingValues.convertedLength}.`,
      `The converted length is ${solver.workingValues.convertedLength} metres.`,
      `Thus the required measure is ${solver.answer}.`,
    ],
  },
  convertMetresToCentimetres: {
    reasoningDescription: "Convert a linear measure from metres to centimetres by multiplying by 100.",
    generateValues: mLengthState,
    solve: (parameters: Men001Parameters) => {
      const length = positive(parameters, "length");
      const convertedLength = length * 100;
      return integerResult(parameters, "LENGTH", convertedLength, "cm=m×100", { length, convertedLength });
    },
    explain: (_parameters: Men001Parameters, solver: Men001SolverResult) => [
      "A metre contains 100 centimetres.",
      "Moving from the larger linear unit to the smaller one increases the numerical value.",
      "Multiply the metre value by 100.",
      `Length = ${solver.workingValues.length} × 100 = ${solver.workingValues.convertedLength}.`,
      `This is ${solver.workingValues.convertedLength} centimetres.`,
      `The converted length is ${solver.answer}.`,
    ],
  },
  convertSquareCentimetresToSquareMetres: {
    reasoningDescription: "Convert square centimetres to square metres using 1 m² = 10,000 cm².",
    generateValues: cmAreaState,
    solve: (parameters: Men001Parameters) => {
      const area = positive(parameters, "area");
      const convertedArea = area / 10000;
      return integerResult(parameters, "AREA", convertedArea, "m²=cm²/10000", { area, convertedArea });
    },
    explain: (_parameters: Men001Parameters, solver: Men001SolverResult) => [
      "Area units square the underlying linear conversion.",
      "Since 1 metre is 100 centimetres, 1 m² equals 100 × 100 = 10,000 cm².",
      "Divide the square-centimetre value by 10,000.",
      `Area = ${solver.workingValues.area} / 10000 = ${solver.workingValues.convertedArea}.`,
      `The same region covers ${solver.workingValues.convertedArea} square metres.`,
      `The converted area is ${solver.answer}.`,
    ],
  },
  convertSquareMetresToSquareCentimetres: {
    reasoningDescription: "Convert square metres to square centimetres using the squared factor 10,000.",
    generateValues: mAreaState,
    solve: (parameters: Men001Parameters) => {
      const area = positive(parameters, "area");
      const convertedArea = area * 10000;
      return integerResult(parameters, "AREA", convertedArea, "cm²=m²×10000", { area, convertedArea });
    },
    explain: (_parameters: Men001Parameters, solver: Men001SolverResult) => [
      "The conversion is for area rather than length.",
      "One square metre contains 10,000 square centimetres.",
      "Multiply the square-metre value by 10,000.",
      `Area = ${solver.workingValues.area} × 10000 = ${solver.workingValues.convertedArea}.`,
      `This gives ${solver.workingValues.convertedArea} square centimetres.`,
      `The converted area is ${solver.answer}.`,
    ],
  },
  findRectangleAreaWithMixedLengthUnits: {
    reasoningDescription: "Convert the centimetre dimension to metres before multiplying the rectangle dimensions.",
    generateValues: mixedRectangleState,
    solve: (parameters: Men001Parameters) => {
      const length = positive(parameters, "length");
      const breadth = positive(parameters, "breadth");
      const breadthMetres = breadth / 100;
      const area = length * breadthMetres;
      return integerResult(parameters, "AREA", area, "A=l×(b/100)", { length, breadth, breadthMetres, area });
    },
    explain: (_parameters: Men001Parameters, solver: Men001SolverResult) => [
      "The two rectangle dimensions must use the same linear unit before they are multiplied.",
      "Keep the length in metres and convert the breadth from centimetres to metres.",
      `Breadth = ${solver.workingValues.breadth} / 100 = ${solver.workingValues.breadthMetres} m.`,
      `Area = ${solver.workingValues.length} × ${solver.workingValues.breadthMetres}.`,
      `Area = ${solver.workingValues.area} m².`,
      `The rectangle covers ${solver.answer}.`,
    ],
  },
  findRectanglePerimeterWithMixedLengthUnits: {
    reasoningDescription: "Convert both dimensions to metres, then apply the rectangle perimeter formula.",
    generateValues: mixedRectangleState,
    solve: (parameters: Men001Parameters) => {
      const length = positive(parameters, "length");
      const breadth = positive(parameters, "breadth");
      const breadthMetres = breadth / 100;
      const perimeter = 2 * (length + breadthMetres);
      return integerResult(parameters, "LENGTH", perimeter, "P=2(l+b/100)", { length, breadth, breadthMetres, perimeter });
    },
    explain: (_parameters: Men001Parameters, solver: Men001SolverResult) => [
      "A perimeter cannot combine metres and centimetres directly.",
      "Convert the breadth to metres so both dimensions share one unit.",
      `Breadth = ${solver.workingValues.breadth} / 100 = ${solver.workingValues.breadthMetres} m.`,
      `P = 2(${solver.workingValues.length} + ${solver.workingValues.breadthMetres}).`,
      `P = ${solver.workingValues.perimeter} m.`,
      `The boundary length is ${solver.answer}.`,
    ],
  },
  findMissingRectangleLengthWithMixedUnits: {
    reasoningDescription: "Convert the known breadth to metres and divide the area by that breadth to recover the length.",
    generateValues: mixedReverseState,
    solve: (parameters: Men001Parameters) => {
      const area = positive(parameters, "area");
      const breadth = positive(parameters, "breadth");
      const breadthMetres = breadth / 100;
      const length = area / breadthMetres;
      return integerResult(parameters, "LENGTH", length, "l=A/(b/100)", { area, breadth, breadthMetres, length });
    },
    explain: (_parameters: Men001Parameters, solver: Men001SolverResult) => [
      "The area is stated in square metres, so the known breadth must first be expressed in metres.",
      `Breadth = ${solver.workingValues.breadth} / 100 = ${solver.workingValues.breadthMetres} m.`,
      "For a rectangle, length equals area divided by breadth.",
      `Length = ${solver.workingValues.area} / ${solver.workingValues.breadthMetres}.`,
      `Length = ${solver.workingValues.length} m.`,
      `The missing dimension is ${solver.answer}.`,
    ],
  },
  findSquareAreaAfterSideUnitConversion: {
    reasoningDescription: "Convert the square side from centimetres to metres before squaring it.",
    generateValues: squareConvertedState,
    solve: (parameters: Men001Parameters) => {
      const side = positive(parameters, "side");
      const sideMetres = side / 100;
      const area = sideMetres * sideMetres;
      return integerResult(parameters, "AREA", area, "A=(s/100)²", { side, sideMetres, area });
    },
    explain: (_parameters: Men001Parameters, solver: Men001SolverResult) => [
      "The requested area is in square metres, so convert the side before squaring it.",
      `Side = ${solver.workingValues.side} / 100 = ${solver.workingValues.sideMetres} m.`,
      "A square's area is the side multiplied by itself.",
      `A = ${solver.workingValues.sideMetres} × ${solver.workingValues.sideMetres}.`,
      `A = ${solver.workingValues.area} m².`,
      `The square covers ${solver.answer}.`,
    ],
  },
  findPerimeterAfterLinearScaling: {
    reasoningDescription: "A uniform linear scale multiplies every boundary length and therefore the perimeter by the same factor.",
    generateValues: (seed: string) => scaleState(seed, "perimeter-after-scale"),
    solve: (parameters: Men001Parameters) => {
      const perimeter = positive(parameters, "perimeter");
      const scale = positive(parameters, "scale");
      const scaledPerimeter = perimeter * scale;
      return integerResult(parameters, "LENGTH", scaledPerimeter, "P₂=kP₁", { perimeter, scale, scaledPerimeter });
    },
    explain: (_parameters: Men001Parameters, solver: Men001SolverResult) => [
      "Every side is enlarged by the same linear factor.",
      "Perimeter is a one-dimensional measure, so it follows the factor directly.",
      "Use P₂ = kP₁.",
      `P₂ = ${solver.workingValues.scale} × ${solver.workingValues.perimeter}.`,
      `P₂ = ${solver.workingValues.scaledPerimeter}.`,
      `The enlarged perimeter is ${solver.answer}.`,
    ],
  },
  findAreaAfterLinearScaling: {
    reasoningDescription: "A uniform linear scale factor k multiplies area by k².",
    generateValues: (seed: string) => scaleState(seed, "area-after-scale"),
    solve: (parameters: Men001Parameters) => {
      const area = positive(parameters, "area");
      const scale = positive(parameters, "scale");
      const areaFactor = scale * scale;
      const scaledArea = area * areaFactor;
      return integerResult(parameters, "AREA", scaledArea, "A₂=k²A₁", { area, scale, areaFactor, scaledArea });
    },
    explain: (_parameters: Men001Parameters, solver: Men001SolverResult) => [
      "Both independent dimensions are multiplied by the linear scale factor.",
      "Their product, the area, is therefore multiplied by the square of that factor.",
      `Area factor = ${solver.workingValues.scale}² = ${solver.workingValues.areaFactor}.`,
      `A₂ = ${solver.workingValues.area} × ${solver.workingValues.areaFactor}.`,
      `A₂ = ${solver.workingValues.scaledArea}.`,
      `The scaled figure has area ${solver.answer}.`,
    ],
  },
  findLinearScaleFactorFromPerimeters: {
    reasoningDescription: "For similar figures, the perimeter ratio equals the linear scale factor.",
    generateValues: (seed: string) => scaleState(seed, "factor-from-perimeters"),
    solve: (parameters: Men001Parameters) => {
      const perimeter = positive(parameters, "perimeter");
      const scale = positive(parameters, "scale");
      const scaledPerimeter = perimeter * scale;
      const scaleFactor = scaledPerimeter / perimeter;
      return integerResult(parameters, "SCALAR", scaleFactor, "k=P₂/P₁", { perimeter, scaledPerimeter, scaleFactor });
    },
    explain: (_parameters: Men001Parameters, solver: Men001SolverResult) => [
      "Similar figures have corresponding boundary lengths in one constant ratio.",
      "The same ratio appears in their perimeters.",
      "Divide the new perimeter by the original perimeter.",
      `k = ${solver.workingValues.scaledPerimeter} / ${solver.workingValues.perimeter}.`,
      `k = ${solver.workingValues.scaleFactor}.`,
      `The linear scale factor is ${solver.answer}.`,
    ],
  },
  findLinearScaleFactorFromAreas: {
    reasoningDescription: "For similar figures, take the positive square root of the area ratio to recover the linear scale factor.",
    generateValues: (seed: string) => scaleState(seed, "factor-from-areas"),
    solve: (parameters: Men001Parameters) => {
      const area = positive(parameters, "area");
      const scale = positive(parameters, "scale");
      const scaledArea = area * scale * scale;
      const areaRatio = scaledArea / area;
      const scaleFactor = Math.sqrt(areaRatio);
      return integerResult(parameters, "SCALAR", scaleFactor, "k=√(A₂/A₁)", { area, scaledArea, areaRatio, scaleFactor });
    },
    explain: (_parameters: Men001Parameters, solver: Men001SolverResult) => [
      "Area changes with the square of the linear scale factor.",
      "First form the ratio of the new area to the original area.",
      `Area ratio = ${solver.workingValues.scaledArea} / ${solver.workingValues.area} = ${solver.workingValues.areaRatio}.`,
      "Take the positive square root because a physical scale factor is positive.",
      `k = √${solver.workingValues.areaRatio} = ${solver.workingValues.scaleFactor}.`,
      `The linear scale factor is ${solver.answer}.`,
    ],
  },
  findOriginalAreaFromScaledArea: {
    reasoningDescription: "Reverse the square-law area scaling by dividing the scaled area by k².",
    generateValues: (seed: string) => scaleState(seed, "original-area-from-scaled"),
    solve: (parameters: Men001Parameters) => {
      const area = positive(parameters, "area");
      const scale = positive(parameters, "scale");
      const areaFactor = scale * scale;
      const scaledArea = area * areaFactor;
      const originalArea = scaledArea / areaFactor;
      return integerResult(parameters, "AREA", originalArea, "A₁=A₂/k²", { scaledArea, scale, areaFactor, originalArea });
    },
    explain: (_parameters: Men001Parameters, solver: Men001SolverResult) => [
      "The enlarged area contains the square of the linear factor.",
      `The area multiplier is ${solver.workingValues.scale}² = ${solver.workingValues.areaFactor}.`,
      "Undo that multiplier to recover the original figure.",
      `A₁ = ${solver.workingValues.scaledArea} / ${solver.workingValues.areaFactor}.`,
      `A₁ = ${solver.workingValues.originalArea}.`,
      `The original area is ${solver.answer}.`,
    ],
  },
  findAreaPercentIncreaseAfterUniformScaling: {
    reasoningDescription: "If every dimension increases by p%, area increases by (1+p/100)²-1 of the original area.",
    generateValues: uniformIncreaseState,
    solve: (parameters: Men001Parameters) => {
      const scale = positive(parameters, "scale");
      const linearPercent = 100 + scale;
      const areaPercent = ((linearPercent * linearPercent) / 100) - 100;
      return integerResult(parameters, "PERCENT", areaPercent, "ΔA%=(1+p/100)²×100-100", { scale, linearPercent, areaPercent });
    },
    explain: (_parameters: Men001Parameters, solver: Men001SolverResult) => [
      "Both dimensions receive the stated percentage increase.",
      `Each dimension becomes ${solver.workingValues.linearPercent}% of its original value.`,
      "Area uses the product of the two changed dimensions.",
      `New area percentage = ${solver.workingValues.linearPercent}² / 100 = ${Number(solver.workingValues.areaPercent) + 100}%.`,
      `Increase = ${Number(solver.workingValues.areaPercent) + 100}% - 100% = ${solver.workingValues.areaPercent}%.`,
      `The area increases by ${solver.answer}.`,
    ],
  },
  findAreaPercentDecreaseAfterUniformScaling: {
    reasoningDescription: "If every dimension decreases by p%, square the remaining linear percentage and compare it with 100%.",
    generateValues: uniformDecreaseState,
    solve: (parameters: Men001Parameters) => {
      const scale = positive(parameters, "scale");
      const linearPercent = 100 - scale;
      const remainingAreaPercent = (linearPercent * linearPercent) / 100;
      const areaPercent = 100 - remainingAreaPercent;
      return integerResult(parameters, "PERCENT", areaPercent, "ΔA%=100-(1-p/100)²×100", { scale, linearPercent, remainingAreaPercent, areaPercent });
    },
    explain: (_parameters: Men001Parameters, solver: Men001SolverResult) => [
      "The same reduction applies independently to both dimensions.",
      `Each dimension remains ${solver.workingValues.linearPercent}% of its original value.`,
      "Square that remaining percentage to obtain the new area percentage.",
      `New area = ${solver.workingValues.linearPercent}² / 100 = ${solver.workingValues.remainingAreaPercent}% of the original.`,
      `Decrease = 100% - ${solver.workingValues.remainingAreaPercent}% = ${solver.workingValues.areaPercent}%.`,
      `The area decreases by ${solver.answer}.`,
    ],
  },
  findAreaPercentIncreaseAfterIndependentDimensionChanges: {
    reasoningDescription: "Multiply the independent length-increase and breadth-decrease factors, then compare the resulting area factor with 1.",
    generateValues: independentChangeState,
    solve: (parameters: Men001Parameters) => {
      const increasePercent = positive(parameters, "ratePerMetre");
      const decreasePercent = positive(parameters, "ratePerSquareMetre");
      const newAreaPercent = ((100 + increasePercent) * (100 - decreasePercent)) / 100;
      const areaPercent = newAreaPercent - 100;
      return integerResult(parameters, "PERCENT", areaPercent, "ΔA%=(1+i/100)(1-d/100)×100-100", { increasePercent, decreasePercent, newAreaPercent, areaPercent });
    },
    explain: (_parameters: Men001Parameters, solver: Men001SolverResult) => [
      "Length and breadth change by different percentages, so their effects must be multiplied rather than simply added.",
      `The length factor is ${100 + Number(solver.workingValues.increasePercent)}% and the breadth factor is ${100 - Number(solver.workingValues.decreasePercent)}%.`,
      `New area percentage = ${100 + Number(solver.workingValues.increasePercent)} × ${100 - Number(solver.workingValues.decreasePercent)} / 100.`,
      `New area percentage = ${solver.workingValues.newAreaPercent}%.`,
      `Increase = ${solver.workingValues.newAreaPercent}% - 100% = ${solver.workingValues.areaPercent}%.`,
      `The net area increase is ${solver.answer}.`,
    ],
  },
  findNewAreaAfterPercentageDimensionChanges: {
    reasoningDescription: "Apply the independent percentage factors to the original rectangle area.",
    generateValues: changedAreaState,
    solve: (parameters: Men001Parameters) => {
      const area = positive(parameters, "area");
      const increasePercent = positive(parameters, "ratePerMetre");
      const decreasePercent = positive(parameters, "ratePerSquareMetre");
      const areaFactorNumerator = (100 + increasePercent) * (100 - decreasePercent);
      const scaledArea = (area * areaFactorNumerator) / 10000;
      return integerResult(parameters, "AREA", scaledArea, "A₂=A₁(1+i/100)(1-d/100)", { area, increasePercent, decreasePercent, areaFactorNumerator, scaledArea });
    },
    explain: (_parameters: Men001Parameters, solver: Men001SolverResult) => [
      "The original area already represents length multiplied by breadth.",
      "Apply the length increase factor and breadth decrease factor to that product.",
      `A₂ = ${solver.workingValues.area} × ${100 + Number(solver.workingValues.increasePercent)} / 100 × ${100 - Number(solver.workingValues.decreasePercent)} / 100.`,
      `The combined numerator is ${solver.workingValues.areaFactorNumerator}.`,
      `A₂ = ${solver.workingValues.scaledArea} m².`,
      `The changed rectangle has area ${solver.answer}.`,
    ],
  },
  findActualLengthFromMapScale: {
    reasoningDescription: "Multiply the map length by the metres represented by each map centimetre.",
    generateValues: mapLengthState,
    solve: (parameters: Men001Parameters) => {
      const length = positive(parameters, "length");
      const scale = positive(parameters, "scale");
      const actualLength = length * scale;
      return integerResult(parameters, "LENGTH", actualLength, "L_actual=L_map×scale", { length, scale, actualLength });
    },
    explain: (_parameters: Men001Parameters, solver: Men001SolverResult) => [
      "The map scale states how many actual metres are represented by one centimetre.",
      "Each map centimetre contributes the same real distance.",
      "Multiply map length by metres per centimetre.",
      `Actual length = ${solver.workingValues.length} × ${solver.workingValues.scale}.`,
      `Actual length = ${solver.workingValues.actualLength} m.`,
      `The real distance is ${solver.answer}.`,
    ],
  },
  findMapLengthFromActualScale: {
    reasoningDescription: "Divide the actual length by the metres represented by one map centimetre.",
    generateValues: mapLengthReverseState,
    solve: (parameters: Men001Parameters) => {
      const distance = positive(parameters, "distance");
      const scale = positive(parameters, "scale");
      const mapLength = distance / scale;
      return integerResult(parameters, "LENGTH", mapLength, "L_map=L_actual/scale", { distance, scale, mapLength });
    },
    explain: (_parameters: Men001Parameters, solver: Men001SolverResult) => [
      "One centimetre on the map accounts for the stated number of actual metres.",
      "The number of map centimetres is therefore the number of scale-length groups in the real distance.",
      "Divide actual distance by metres per map centimetre.",
      `Map length = ${solver.workingValues.distance} / ${solver.workingValues.scale}.`,
      `Map length = ${solver.workingValues.mapLength} cm.`,
      `The line on the map should be ${solver.answer}.`,
    ],
  },
  findActualAreaFromMapAreaScale: {
    reasoningDescription: "Square the map's linear scale before applying it to map area.",
    generateValues: mapAreaState,
    solve: (parameters: Men001Parameters) => {
      const area = positive(parameters, "area");
      const scale = positive(parameters, "scale");
      const areaScale = scale * scale;
      const actualArea = area * areaScale;
      return integerResult(parameters, "AREA", actualArea, "A_actual=A_map×scale²", { area, scale, areaScale, actualArea });
    },
    explain: (_parameters: Men001Parameters, solver: Men001SolverResult) => [
      "A map area contains two independent linear directions.",
      "The linear scale must therefore be squared for area.",
      `Area scale = ${solver.workingValues.scale}² = ${solver.workingValues.areaScale}.`,
      `Actual area = ${solver.workingValues.area} × ${solver.workingValues.areaScale}.`,
      `Actual area = ${solver.workingValues.actualArea} m².`,
      `The represented land area is ${solver.answer}.`,
    ],
  },
  findMapAreaFromActualAreaScale: {
    reasoningDescription: "Divide actual area by the square of the linear map scale.",
    generateValues: mapAreaReverseState,
    solve: (parameters: Men001Parameters) => {
      const outerArea = positive(parameters, "outerArea");
      const scale = positive(parameters, "scale");
      const areaScale = scale * scale;
      const mapArea = outerArea / areaScale;
      return integerResult(parameters, "AREA", mapArea, "A_map=A_actual/scale²", { outerArea, scale, areaScale, mapArea });
    },
    explain: (_parameters: Men001Parameters, solver: Men001SolverResult) => [
      "Actual area is larger than map area by the square of the linear scale.",
      `The area scale is ${solver.workingValues.scale}² = ${solver.workingValues.areaScale}.`,
      "Reverse that enlargement to obtain the drawing area.",
      `Map area = ${solver.workingValues.outerArea} / ${solver.workingValues.areaScale}.`,
      `Map area = ${solver.workingValues.mapArea} cm².`,
      `The plot occupies ${solver.answer} on the map.`,
    ],
  },
  findActualPlotAreaFromPlanDimensions: {
    reasoningDescription: "Convert each plan dimension by the linear scale, then multiply the two actual dimensions.",
    generateValues: planState,
    solve: (parameters: Men001Parameters) => {
      const length = positive(parameters, "length");
      const breadth = positive(parameters, "breadth");
      const scale = positive(parameters, "scale");
      const actualLength = length * scale;
      const actualBreadth = breadth * scale;
      const actualArea = actualLength * actualBreadth;
      return integerResult(parameters, "AREA", actualArea, "A=(l_map×scale)(b_map×scale)", { length, breadth, scale, actualLength, actualBreadth, actualArea });
    },
    explain: (_parameters: Men001Parameters, solver: Men001SolverResult) => [
      "Both plan dimensions must be converted to their actual lengths.",
      `Actual length = ${solver.workingValues.length} × ${solver.workingValues.scale} = ${solver.workingValues.actualLength} m.`,
      `Actual breadth = ${solver.workingValues.breadth} × ${solver.workingValues.scale} = ${solver.workingValues.actualBreadth} m.`,
      "Multiply the two actual dimensions for the land area.",
      `Area = ${solver.workingValues.actualLength} × ${solver.workingValues.actualBreadth} = ${solver.workingValues.actualArea} m².`,
      `The plot represents ${solver.answer}.`,
    ],
  },
  findRectangleLengthFromSquareWire: {
    reasoningDescription: "Conserve the square wire's perimeter and solve the rectangle perimeter equation for its unknown length.",
    generateValues: squareToRectangleState,
    solve: (parameters: Men001Parameters) => {
      const side = positive(parameters, "side");
      const breadth = positive(parameters, "breadth");
      const wireLength = 4 * side;
      const semiperimeter = wireLength / 2;
      const length = semiperimeter - breadth;
      return integerResult(parameters, "LENGTH", length, "4s=2(l+b)", { side, breadth, wireLength, semiperimeter, length });
    },
    explain: (_parameters: Men001Parameters, solver: Men001SolverResult) => [
      "Reshaping the wire changes the figure but not the total boundary length.",
      `The square supplies 4 × ${solver.workingValues.side} = ${solver.workingValues.wireLength} m of wire.`,
      `For the rectangle, l + b = ${solver.workingValues.wireLength} / 2 = ${solver.workingValues.semiperimeter}.`,
      `l = ${solver.workingValues.semiperimeter} - ${solver.workingValues.breadth}.`,
      `l = ${solver.workingValues.length} m.`,
      `The rectangle's length is ${solver.answer}.`,
    ],
  },
  findSquareSideFromRectangleWire: {
    reasoningDescription: "Conserve the rectangle perimeter and divide the wire equally among four square sides.",
    generateValues: (seed: string) => rectangleWireState(seed, "rectangle-to-square"),
    solve: (parameters: Men001Parameters) => {
      const length = positive(parameters, "length");
      const breadth = positive(parameters, "breadth");
      const wireLength = 2 * (length + breadth);
      const side = wireLength / 4;
      return integerResult(parameters, "LENGTH", side, "2(l+b)=4s", { length, breadth, wireLength, side });
    },
    explain: (_parameters: Men001Parameters, solver: Men001SolverResult) => [
      "The same wire forms both complete boundaries.",
      `Rectangle wire = 2(${solver.workingValues.length} + ${solver.workingValues.breadth}) = ${solver.workingValues.wireLength} m.`,
      "A square divides that wire equally among four sides.",
      `Side = ${solver.workingValues.wireLength} / 4.`,
      `Side = ${solver.workingValues.side} m.`,
      `Each square side measures ${solver.answer}.`,
    ],
  },
  findCircleRadiusFromSquareWire: {
    reasoningDescription: "Equate the square perimeter to the circle circumference and solve for radius.",
    generateValues: (seed: string) => squareCircleState(seed, "square-to-circle-radius"),
    solve: (parameters: Men001Parameters) => {
      const side = positive(parameters, "side");
      const wireLength = 4 * side;
      const radius = (wireLength * PI_DENOMINATOR) / (2 * PI_NUMERATOR);
      return integerResult(parameters, "LENGTH", radius, "4s=2πr", { side, wireLength, radius }, true);
    },
    explain: (_parameters: Men001Parameters, solver: Men001SolverResult) => [
      "The wire length remains unchanged when the square is bent into a circle.",
      `Wire length = 4 × ${solver.workingValues.side} = ${solver.workingValues.wireLength} m.`,
      "Set this equal to 2πr.",
      `r = ${solver.workingValues.wireLength} × 7 / 44.`,
      `r = ${solver.workingValues.radius} m.`,
      `The circular ring has radius ${solver.answer}.`,
    ],
  },
  findSquareSideFromCircularWire: {
    reasoningDescription: "Equate the circle circumference to four equal square sides.",
    generateValues: (seed: string) => circleSquareState(seed, "circle-to-square-side"),
    solve: (parameters: Men001Parameters) => {
      const radius = positive(parameters, "radius");
      const wireLength = (2 * PI_NUMERATOR * radius) / PI_DENOMINATOR;
      const side = wireLength / 4;
      return integerResult(parameters, "LENGTH", side, "2πr=4s", { radius, wireLength, side }, true);
    },
    explain: (_parameters: Men001Parameters, solver: Men001SolverResult) => [
      "Opening the circle and forming a square preserves the complete wire length.",
      `Circle circumference = 2 × 22/7 × ${solver.workingValues.radius} = ${solver.workingValues.wireLength} m.`,
      "The square uses one fourth of that wire on each side.",
      `Side = ${solver.workingValues.wireLength} / 4.`,
      `Side = ${solver.workingValues.side} m.`,
      `The square side is ${solver.answer}.`,
    ],
  },
  findCircleRadiusFromRectangleWire: {
    reasoningDescription: "Use the rectangle perimeter as the circle circumference and solve for radius.",
    generateValues: rectangleCircleState,
    solve: (parameters: Men001Parameters) => {
      const length = positive(parameters, "length");
      const breadth = positive(parameters, "breadth");
      const wireLength = 2 * (length + breadth);
      const radius = (wireLength * PI_DENOMINATOR) / (2 * PI_NUMERATOR);
      return integerResult(parameters, "LENGTH", radius, "2(l+b)=2πr", { length, breadth, wireLength, radius }, true);
    },
    explain: (_parameters: Men001Parameters, solver: Men001SolverResult) => [
      "The rectangle perimeter becomes the complete circumference of the circle.",
      `Wire length = 2(${solver.workingValues.length} + ${solver.workingValues.breadth}) = ${solver.workingValues.wireLength} m.`,
      "Set 2πr equal to this conserved boundary.",
      `r = ${solver.workingValues.wireLength} × 7 / 44.`,
      `r = ${solver.workingValues.radius} m.`,
      `The circle's radius is ${solver.answer}.`,
    ],
  },
  findEquilateralTriangleSideFromSquareWire: {
    reasoningDescription: "Conserve the square perimeter and divide it equally among three equilateral-triangle sides.",
    generateValues: (seed: string) => squarePolygonState(seed, "square-to-equilateral"),
    solve: (parameters: Men001Parameters) => {
      const side = positive(parameters, "side");
      const wireLength = 4 * side;
      const triangleSide = wireLength / 3;
      return integerResult(parameters, "LENGTH", triangleSide, "4s=3a", { side, wireLength, triangleSide });
    },
    explain: (_parameters: Men001Parameters, solver: Men001SolverResult) => [
      "The square and equilateral triangle use the same piece of wire.",
      `The square provides 4 × ${solver.workingValues.side} = ${solver.workingValues.wireLength} m.`,
      "An equilateral triangle shares this equally among three sides.",
      `Triangle side = ${solver.workingValues.wireLength} / 3.`,
      `Triangle side = ${solver.workingValues.triangleSide} m.`,
      `Each triangle side measures ${solver.answer}.`,
    ],
  },
  findRegularHexagonSideFromSquareWire: {
    reasoningDescription: "Conserve the square perimeter and divide it equally among six regular-hexagon sides.",
    generateValues: (seed: string) => squarePolygonState(seed, "square-to-hexagon"),
    solve: (parameters: Men001Parameters) => {
      const side = positive(parameters, "side");
      const wireLength = 4 * side;
      const hexagonSide = wireLength / 6;
      return integerResult(parameters, "LENGTH", hexagonSide, "4s=6a", { side, wireLength, hexagonSide });
    },
    explain: (_parameters: Men001Parameters, solver: Men001SolverResult) => [
      "Reshaping does not change the total wire available.",
      `The square boundary is 4 × ${solver.workingValues.side} = ${solver.workingValues.wireLength} m.`,
      "A regular hexagon has six equal sides.",
      `Hexagon side = ${solver.workingValues.wireLength} / 6.`,
      `Hexagon side = ${solver.workingValues.hexagonSide} m.`,
      `Each hexagon side is ${solver.answer}.`,
    ],
  },
  findSquareAreaFromRectangleWire: {
    reasoningDescription: "Recover the square side from the conserved rectangle perimeter, then square that side.",
    generateValues: (seed: string) => rectangleWireState(seed, "square-area-from-rectangle-wire"),
    solve: (parameters: Men001Parameters) => {
      const length = positive(parameters, "length");
      const breadth = positive(parameters, "breadth");
      const wireLength = 2 * (length + breadth);
      const side = wireLength / 4;
      const squareArea = side * side;
      return integerResult(parameters, "AREA", squareArea, "2(l+b)=4s; A=s²", { length, breadth, wireLength, side, squareArea });
    },
    explain: (_parameters: Men001Parameters, solver: Men001SolverResult) => [
      "The rectangle's boundary fixes the side of the new square.",
      `Wire length = 2(${solver.workingValues.length} + ${solver.workingValues.breadth}) = ${solver.workingValues.wireLength} m.`,
      `Square side = ${solver.workingValues.wireLength} / 4 = ${solver.workingValues.side} m.`,
      "Now square that side to find the enclosed area.",
      `Area = ${solver.workingValues.side}² = ${solver.workingValues.squareArea} m².`,
      `The square encloses ${solver.answer}.`,
    ],
  },
  findAreaDifferenceSquareRectangleSamePerimeter: {
    reasoningDescription: "At the same perimeter, calculate the square area and rectangle area separately and subtract.",
    generateValues: (seed: string) => rectangleWireState(seed, "area-difference-square-rectangle"),
    solve: (parameters: Men001Parameters) => {
      const length = positive(parameters, "length");
      const breadth = positive(parameters, "breadth");
      const wireLength = 2 * (length + breadth);
      const side = wireLength / 4;
      const squareArea = side * side;
      const rectangleArea = length * breadth;
      const areaDifference = squareArea - rectangleArea;
      return integerResult(parameters, "AREA", areaDifference, "ΔA=(P/4)²-lb", { length, breadth, wireLength, side, squareArea, rectangleArea, areaDifference });
    },
    explain: (_parameters: Men001Parameters, solver: Men001SolverResult) => [
      "Both figures use the same boundary length, but they enclose different areas.",
      `The wire is ${solver.workingValues.wireLength} m, so the square side is ${solver.workingValues.side} m.`,
      `Square area = ${solver.workingValues.squareArea} m².`,
      `Rectangle area = ${solver.workingValues.length} × ${solver.workingValues.breadth} = ${solver.workingValues.rectangleArea} m².`,
      `Difference = ${solver.workingValues.squareArea} - ${solver.workingValues.rectangleArea} = ${solver.workingValues.areaDifference} m².`,
      `The square encloses ${solver.answer} more area.`,
    ],
  },
  findMaximumRectangleAreaForFixedPerimeter: {
    reasoningDescription: "Among rectangles with a fixed perimeter, the square gives the maximum area.",
    generateValues: fixedPerimeterState,
    solve: (parameters: Men001Parameters) => {
      const perimeter = positive(parameters, "perimeter");
      const side = perimeter / 4;
      const maximumArea = side * side;
      return integerResult(parameters, "AREA", maximumArea, "A_max=(P/4)²", { perimeter, side, maximumArea });
    },
    explain: (_parameters: Men001Parameters, solver: Men001SolverResult) => [
      "For a fixed rectangular boundary, area is greatest when length and breadth are equal.",
      "The maximizing rectangle is therefore a square.",
      `Square side = ${solver.workingValues.perimeter} / 4 = ${solver.workingValues.side} m.`,
      "Square the side to obtain the maximum enclosed area.",
      `Maximum area = ${solver.workingValues.side}² = ${solver.workingValues.maximumArea} m².`,
      `The greatest possible area is ${solver.answer}.`,
    ],
  },
  findAreaDifferenceCircleSquareSamePerimeter: {
    reasoningDescription: "Use the common perimeter to recover the circle radius and square side, then compare their areas.",
    generateValues: circleSquarePerimeterState,
    solve: (parameters: Men001Parameters) => {
      const perimeter = positive(parameters, "perimeter");
      const radius = (perimeter * PI_DENOMINATOR) / (2 * PI_NUMERATOR);
      const side = perimeter / 4;
      const circleArea = (PI_NUMERATOR * radius * radius) / PI_DENOMINATOR;
      const squareArea = side * side;
      const areaDifference = circleArea - squareArea;
      return integerResult(parameters, "AREA", areaDifference, "ΔA=π(P/2π)²-(P/4)²", { perimeter, radius, side, circleArea, squareArea, areaDifference }, true);
    },
    explain: (_parameters: Men001Parameters, solver: Men001SolverResult) => [
      "The circle and square have the same complete boundary length.",
      `Circle radius = ${solver.workingValues.perimeter} × 7 / 44 = ${solver.workingValues.radius} m.`,
      `Square side = ${solver.workingValues.perimeter} / 4 = ${solver.workingValues.side} m.`,
      `Their areas are ${solver.workingValues.circleArea} m² and ${solver.workingValues.squareArea} m².`,
      `Difference = ${solver.workingValues.circleArea} - ${solver.workingValues.squareArea} = ${solver.workingValues.areaDifference} m².`,
      `The circle encloses ${solver.answer} more area.`,
    ],
  },
  findRectangleBreadthFromCircularWireAndLength: {
    reasoningDescription: "Use the circle circumference as the rectangle perimeter and solve the semiperimeter equation for breadth.",
    generateValues: circleRectangleReverseState,
    solve: (parameters: Men001Parameters) => {
      const radius = positive(parameters, "radius");
      const length = positive(parameters, "length");
      const wireLength = (2 * PI_NUMERATOR * radius) / PI_DENOMINATOR;
      const semiperimeter = wireLength / 2;
      const breadth = semiperimeter - length;
      return integerResult(parameters, "LENGTH", breadth, "2πr=2(l+b)", { radius, length, wireLength, semiperimeter, breadth }, true);
    },
    explain: (_parameters: Men001Parameters, solver: Men001SolverResult) => [
      "The circular wire becomes the whole boundary of the rectangle.",
      `Wire length = 2 × 22/7 × ${solver.workingValues.radius} = ${solver.workingValues.wireLength} m.`,
      `So l + b = ${solver.workingValues.wireLength} / 2 = ${solver.workingValues.semiperimeter}.`,
      `b = ${solver.workingValues.semiperimeter} - ${solver.workingValues.length}.`,
      `b = ${solver.workingValues.breadth} m.`,
      `The rectangle's breadth is ${solver.answer}.`,
    ],
  },
  findCircleAreaFromSquareWire: {
    reasoningDescription: "Use the square perimeter as the circle circumference, recover radius, then calculate circle area.",
    generateValues: (seed: string) => squareCircleState(seed, "circle-area-from-square-wire"),
    solve: (parameters: Men001Parameters) => {
      const side = positive(parameters, "side");
      const wireLength = 4 * side;
      const radius = (wireLength * PI_DENOMINATOR) / (2 * PI_NUMERATOR);
      const circleArea = (PI_NUMERATOR * radius * radius) / PI_DENOMINATOR;
      return integerResult(parameters, "AREA", circleArea, "4s=2πr; A=πr²", { side, wireLength, radius, circleArea }, true);
    },
    explain: (_parameters: Men001Parameters, solver: Men001SolverResult) => [
      "The square boundary becomes the circumference of the new circle.",
      `Wire length = 4 × ${solver.workingValues.side} = ${solver.workingValues.wireLength} m.`,
      `Radius = ${solver.workingValues.wireLength} × 7 / 44 = ${solver.workingValues.radius} m.`,
      "Use πr² for the area enclosed by that circle.",
      `Area = 22/7 × ${solver.workingValues.radius}² = ${solver.workingValues.circleArea} m².`,
      `The circle encloses ${solver.answer}.`,
    ],
  },
  findSquareAreaFromCircularWire: {
    reasoningDescription: "Use the circle circumference as the square perimeter, recover side, then calculate square area.",
    generateValues: (seed: string) => circleSquareState(seed, "square-area-from-circle-wire"),
    solve: (parameters: Men001Parameters) => {
      const radius = positive(parameters, "radius");
      const wireLength = (2 * PI_NUMERATOR * radius) / PI_DENOMINATOR;
      const side = wireLength / 4;
      const squareArea = side * side;
      return integerResult(parameters, "AREA", squareArea, "2πr=4s; A=s²", { radius, wireLength, side, squareArea }, true);
    },
    explain: (_parameters: Men001Parameters, solver: Men001SolverResult) => [
      "The circular boundary supplies exactly the wire used by the square.",
      `Wire length = 2 × 22/7 × ${solver.workingValues.radius} = ${solver.workingValues.wireLength} m.`,
      `Square side = ${solver.workingValues.wireLength} / 4 = ${solver.workingValues.side} m.`,
      "Square this recovered side to find the enclosed area.",
      `Area = ${solver.workingValues.side}² = ${solver.workingValues.squareArea} m².`,
      `The square encloses ${solver.answer}.`,
    ],
  },
} as const satisfies Record<string, Definition>;
