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
  if (items.length === 0) throw new Error(`MEN-001 exhaustiveness registry cannot pick from empty ${salt}.`);
  return items[hash(`${seed}:${salt}`) % items.length]!;
}

function required(parameters: Men001Parameters, key: string) {
  const candidate = (parameters.values as Record<string, number | undefined>)[key];
  if (typeof candidate !== "number" || !Number.isFinite(candidate) || candidate <= 0) {
    throw new Error(`MEN-001 exhaustiveness mode requires positive ${key}.`);
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

function exactResult(
  parameters: Men001Parameters,
  value: number,
  answerDimension: Men001AnswerDimension,
  equation: string,
  workingValues: Record<string, string | number>,
): Men001SolverResult {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`MEN-001 exhaustiveness mode expected a positive integer ${answerDimension}; received ${value}.`);
  }
  const unit = unitFor(parameters.unitPolicy);
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

function exactSqrt3Length(
  parameters: Men001Parameters,
  coefficient: number,
  workingValues: Record<string, string | number>,
): Men001SolverResult {
  if (!Number.isInteger(coefficient) || coefficient <= 0) {
    throw new Error(`MEN-001 equilateral height requires a positive integral √3 coefficient.`);
  }
  const unit = unitFor(parameters.unitPolicy);
  if (unit !== "cm" && unit !== "m") {
    throw new Error(`MEN-001 equilateral height requires a linear unit.`);
  }
  const latexUnit = unit === "cm" ? "\\text{cm}" : "\\text{m}";
  const latexValue = `${coefficient}\\sqrt{3}\\,${latexUnit}`;
  const canonicalAnswer: Men001CanonicalAnswer = {
    kind: "symbolic",
    value: latexValue,
    rendered: `$$${latexValue}$$`,
    display: `${coefficient}√3 ${unit}`,
    rounding: "exact",
    metadata: { answerDimension: "LENGTH", exactKind: "SURD", radicand: 3, unit },
  };
  return {
    exactAnswer: {
      kind: "SURD",
      coefficientNumerator: coefficient,
      coefficientDenominator: 1,
      radicand: 3,
    },
    canonicalAnswer,
    answer: canonicalAnswer.rendered,
    answerDimension: "LENGTH",
    unit,
    equation: `h=(\\sqrt3/2)a`,
    workingValues,
  };
}

function piTimes(value: number) {
  const result = (PI_NUMERATOR * value) / PI_DENOMINATOR;
  if (!Number.isInteger(result)) {
    throw new Error(`MEN-001 exhaustiveness circular state must remain exact under π = ${PI_POLICY}.`);
  }
  return result;
}

const TRIANGLE_SIDE_STATES = [
  [5, 12, 13], [13, 14, 15], [10, 10, 12], [15, 20, 25], [17, 17, 16],
] as const;
const RIGHT_TRIANGLE_STATES = [
  [6, 8, 10], [9, 12, 15], [12, 16, 20], [15, 20, 25], [20, 21, 29],
] as const;
const EQUILATERAL_SIDES = [6, 8, 10, 12, 14, 16, 18, 20] as const;
const RHOMBUS_BASE_HEIGHT_STATES = [
  [12, 8], [15, 12], [18, 10], [20, 14], [24, 15],
] as const;
const KITE_SIDE_STATES = [
  [7, 11], [9, 14], [12, 17], [15, 22], [18, 25],
] as const;
const TRAPEZIUM_SIDE_STATES = [
  [12, 20, 7, 9], [15, 25, 10, 12], [18, 30, 13, 15], [20, 34, 15, 17], [24, 40, 18, 22],
] as const;
const CIRCLE_RADII = [7, 14, 21, 28, 35] as const;
const ARC_RADIUS_STATES = [
  [7, 90], [14, 45], [21, 60], [28, 135], [35, 72], [14, 180],
] as const;
const SECTOR_RADIUS_STATES = [
  [14, 90], [21, 120], [28, 45], [14, 180], [35, 72], [28, 135],
] as const;
const ANNULUS_STATES = [
  [14, 7], [21, 14], [28, 21], [35, 14], [42, 28],
] as const;
const WHEEL_STATES = [
  [7, 5], [14, 8], [21, 6], [28, 10], [35, 12],
] as const;
const OUTER_RECTANGULAR_WIDTH_STATES = [
  [20, 12, 2], [24, 16, 2], [30, 20, 3], [32, 18, 3], [40, 24, 4],
] as const;
const INNER_RECTANGULAR_WIDTH_STATES = [
  [24, 18, 2], [30, 20, 2], [36, 24, 3], [40, 30, 4], [50, 32, 4],
] as const;
const OUTER_CIRCULAR_WIDTH_STATES = [
  [14, 7], [21, 7], [28, 7], [35, 7], [28, 14],
] as const;
const INNER_CIRCULAR_WIDTH_STATES = [
  [21, 7], [28, 7], [35, 7], [42, 14], [56, 14],
] as const;
const CROSS_ROAD_STATES = [
  [60, 40, 4, 3], [75, 50, 5, 4], [80, 60, 6, 5], [90, 70, 7, 6], [100, 80, 8, 5],
] as const;
const PARTIAL_TILE_STATES = [
  [600, 400, 30, 20, 300],
  [720, 480, 40, 30, 240],
  [900, 600, 50, 30, 300],
  [840, 560, 40, 28, 300],
  [1000, 600, 50, 25, 400],
] as const;
const AREA_RATE_STATES = [
  [96, 7200], [150, 12000], [216, 19440], [280, 28000], [384, 48000],
] as const;
const FENCE_RATE_STATES = [
  [30, 20, 5000], [40, 25, 7800], [50, 30, 11200], [60, 40, 16000], [75, 45, 24000],
] as const;
const INNER_PATH_TILE_STATES = [
  [24, 18, 2, 2, 2],
  [30, 20, 2, 2, 2],
  [36, 24, 3, 3, 3],
  [40, 30, 4, 4, 2],
  [50, 32, 4, 4, 2],
] as const;

function circleState(seed: string, salt: string) {
  const radius = pick(CIRCLE_RADII, seed, salt);
  return {
    radius,
    diameter: 2 * radius,
    circumference: piTimes(2 * radius),
    area: piTimes(radius * radius),
    piPolicy: PI_POLICY,
  };
}

function arcState(seed: string, salt: string) {
  const [radius, angleDegrees] = pick(ARC_RADIUS_STATES, seed, salt);
  const circumference = piTimes(2 * radius);
  const arcLength = (circumference * angleDegrees) / 360;
  if (!Number.isInteger(arcLength)) throw new Error(`MEN-001 reverse arc state must be integral.`);
  return { radius, angleDegrees, circumference, arcLength, piPolicy: PI_POLICY };
}

function sectorState(seed: string, salt: string) {
  const [radius, angleDegrees] = pick(SECTOR_RADIUS_STATES, seed, salt);
  const fullArea = piTimes(radius * radius);
  const sectorArea = (fullArea * angleDegrees) / 360;
  if (!Number.isInteger(sectorArea)) throw new Error(`MEN-001 reverse sector state must be integral.`);
  return { radius, angleDegrees, fullArea, sectorArea, piPolicy: PI_POLICY };
}

function annulusState(seed: string, salt: string) {
  const [outerRadius, innerRadius] = pick(ANNULUS_STATES, seed, salt);
  const outerArea = piTimes(outerRadius * outerRadius);
  const innerArea = piTimes(innerRadius * innerRadius);
  return {
    outerRadius,
    innerRadius,
    outerArea,
    innerArea,
    area: outerArea - innerArea,
    radiusSquareDifference: outerRadius ** 2 - innerRadius ** 2,
    piPolicy: PI_POLICY,
  };
}

function wheelState(seed: string, salt: string) {
  const [radius, revolutions] = pick(WHEEL_STATES, seed, salt);
  const circumference = piTimes(2 * radius);
  return {
    radius,
    diameter: 2 * radius,
    revolutions,
    circumference,
    distance: circumference * revolutions,
    piPolicy: PI_POLICY,
  };
}

function outerRectangularWidthState(seed: string) {
  const [innerLength, innerBreadth, pathWidth] = pick(
    OUTER_RECTANGULAR_WIDTH_STATES,
    seed,
    "outer-rectangular-width",
  );
  const outerLength = innerLength + 2 * pathWidth;
  const outerBreadth = innerBreadth + 2 * pathWidth;
  const innerArea = innerLength * innerBreadth;
  const outerArea = outerLength * outerBreadth;
  return { innerLength, innerBreadth, outerLength, outerBreadth, pathWidth, innerArea, outerArea, area: outerArea - innerArea };
}

function innerRectangularWidthState(seed: string) {
  const [outerLength, outerBreadth, pathWidth] = pick(
    INNER_RECTANGULAR_WIDTH_STATES,
    seed,
    "inner-rectangular-width",
  );
  const innerLength = outerLength - 2 * pathWidth;
  const innerBreadth = outerBreadth - 2 * pathWidth;
  const outerArea = outerLength * outerBreadth;
  const innerArea = innerLength * innerBreadth;
  return { outerLength, outerBreadth, innerLength, innerBreadth, pathWidth, outerArea, innerArea, area: outerArea - innerArea };
}

function outerCircularWidthState(seed: string) {
  const [innerRadius, pathWidth] = pick(OUTER_CIRCULAR_WIDTH_STATES, seed, "outer-circular-width");
  const outerRadius = innerRadius + pathWidth;
  const innerArea = piTimes(innerRadius ** 2);
  const outerArea = piTimes(outerRadius ** 2);
  return { innerRadius, outerRadius, pathWidth, innerArea, outerArea, area: outerArea - innerArea, piPolicy: PI_POLICY };
}

function innerCircularWidthState(seed: string) {
  const [outerRadius, pathWidth] = pick(INNER_CIRCULAR_WIDTH_STATES, seed, "inner-circular-width");
  const innerRadius = outerRadius - pathWidth;
  const outerArea = piTimes(outerRadius ** 2);
  const innerArea = piTimes(innerRadius ** 2);
  return { innerRadius, outerRadius, pathWidth, innerArea, outerArea, area: outerArea - innerArea, piPolicy: PI_POLICY };
}

function crossRoadState(seed: string) {
  const [length, breadth, roadWidthA, roadWidthB] = pick(CROSS_ROAD_STATES, seed, "cross-road-state");
  const roadAreaA = length * roadWidthA;
  const roadAreaB = breadth * roadWidthB;
  const overlapArea = roadWidthA * roadWidthB;
  const roadArea = roadAreaA + roadAreaB - overlapArea;
  const fieldArea = length * breadth;
  return {
    length,
    breadth,
    pathWidth: roadWidthA,
    gateWidth: roadWidthB,
    roadWidthA,
    roadWidthB,
    roadAreaA,
    roadAreaB,
    overlapArea,
    roadArea,
    fieldArea,
    area: fieldArea - roadArea,
  };
}

export const MEN_001_EXHAUSTIVENESS_SOLVE_MODE_REGISTRY = {
  findTrianglePerimeterFromSides: {
    reasoningDescription: "Add the three side lengths of the triangle.",
    generateValues: (seed) => {
      const [sideA, sideB, sideC] = pick(TRIANGLE_SIDE_STATES, seed, "triangle-perimeter");
      return { sideA, sideB, sideC, perimeter: sideA + sideB + sideC };
    },
    solve: (p) => {
      const sideA = required(p, "sideA");
      const sideB = required(p, "sideB");
      const sideC = required(p, "sideC");
      const perimeter = sideA + sideB + sideC;
      return exactResult(p, perimeter, "LENGTH", `P=a+b+c`, { sideA, sideB, sideC, perimeter });
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        "The perimeter is the total length of all three sides.",
        "Use P = a + b + c.",
        `P = ${v.sideA} + ${v.sideB} + ${v.sideC}.`,
        `Thus P = ${v.perimeter}.`,
        `Therefore, the triangle's perimeter is ${s.answer}.`,
      ];
    },
  },
  findRightTriangleHypotenuseFromLegs: {
    reasoningDescription: "Use Pythagoras to recover the hypotenuse from the perpendicular legs.",
    generateValues: (seed) => {
      const [legA, legB, sideC] = pick(RIGHT_TRIANGLE_STATES, seed, "right-hypotenuse");
      return { legA, legB, sideC };
    },
    solve: (p) => {
      const legA = required(p, "legA");
      const legB = required(p, "legB");
      const sideC = Math.sqrt(legA ** 2 + legB ** 2);
      return exactResult(p, sideC, "LENGTH", `c=\\sqrt{a^2+b^2}`, { legA, legB, sideC });
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        "The two stated sides are perpendicular, so the third side is the hypotenuse.",
        "By Pythagoras, c² = a² + b².",
        `c = √(${v.legA}² + ${v.legB}²).`,
        `Thus c = ${v.sideC}.`,
        `Therefore, the hypotenuse is ${s.answer}.`,
      ];
    },
  },
  findRightTriangleMissingLeg: {
    reasoningDescription: "Subtract the square of the known leg from the hypotenuse square.",
    generateValues: (seed) => {
      const [legA, legB, sideC] = pick(RIGHT_TRIANGLE_STATES, seed, "right-missing-leg");
      return { legA, legB, sideC };
    },
    solve: (p) => {
      const legA = required(p, "legA");
      const sideC = required(p, "sideC");
      const legB = Math.sqrt(sideC ** 2 - legA ** 2);
      return exactResult(p, legB, "LENGTH", `b=\\sqrt{c^2-a^2}`, { legA, legB, sideC });
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        "The hypotenuse and one perpendicular side are known.",
        "From c² = a² + b², isolate b: b = √(c² − a²).",
        `b = √(${v.sideC}² − ${v.legA}²).`,
        `Thus b = ${v.legB}.`,
        `Therefore, the missing perpendicular side is ${s.answer}.`,
      ];
    },
  },
  findEquilateralHeightFromSide: {
    reasoningDescription: "Use h = (√3/2)a and preserve the exact surd.",
    generateValues: (seed) => {
      const side = pick(EQUILATERAL_SIDES, seed, "equilateral-height");
      return { side, height: side / 2 };
    },
    solve: (p) => {
      const side = required(p, "side");
      const heightCoefficient = side / 2;
      return exactSqrt3Length(p, heightCoefficient, { side, heightCoefficient, radicand: 3 });
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        "The altitude of an equilateral triangle forms a 30°–60°–90° triangle.",
        "Use h = (√3/2)a.",
        `h = (√3/2) × ${v.side}.`,
        `Thus h = ${v.heightCoefficient}√3.`,
        `Therefore, the exact height is ${s.answer}.`,
      ];
    },
  },
  findEquilateralSideFromArea: {
    reasoningDescription: "Compare the exact area coefficient with a²/4 and recover the side.",
    generateValues: (seed) => {
      const side = pick(EQUILATERAL_SIDES, seed, "equilateral-side-area");
      return { side, areaCoefficient: side ** 2 / 4 };
    },
    solve: (p) => {
      const areaCoefficient = required(p, "areaCoefficient");
      const side = 2 * Math.sqrt(areaCoefficient);
      return exactResult(p, side, "LENGTH", `a=2\\sqrt{k}`, { areaCoefficient, side, radicand: 3 });
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        "For an equilateral triangle, A = (√3/4)a².",
        `The stated area is ${v.areaCoefficient}√3, so a²/4 = ${v.areaCoefficient}.`,
        `Hence a = 2√${v.areaCoefficient}.`,
        `Thus a = ${v.side}.`,
        `Therefore, each side is ${s.answer}.`,
      ];
    },
  },
  findSquareSideFromPerimeter: {
    reasoningDescription: "Divide the square perimeter equally among four sides.",
    generateValues: (seed) => {
      const side = pick([6, 8, 10, 12, 14, 16, 18, 20] as const, seed, "square-side-perimeter");
      return { side, perimeter: 4 * side };
    },
    solve: (p) => {
      const perimeter = required(p, "perimeter");
      const side = perimeter / 4;
      return exactResult(p, side, "LENGTH", `a=P/4`, { perimeter, side });
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        "A square has four equal sides.",
        "Therefore, side = perimeter ÷ 4.",
        `Side = ${v.perimeter} ÷ 4.`,
        `Thus side = ${v.side}.`,
        `Therefore, the side length is ${s.answer}.`,
      ];
    },
  },
  findRhombusAreaFromBaseHeight: {
    reasoningDescription: "Multiply a rhombus base by its perpendicular height.",
    generateValues: (seed) => {
      const [base, height] = pick(RHOMBUS_BASE_HEIGHT_STATES, seed, "rhombus-base-height");
      return { base, height, area: base * height };
    },
    solve: (p) => {
      const base = required(p, "base");
      const height = required(p, "height");
      const area = base * height;
      return exactResult(p, area, "AREA", `A=bh`, { base, height, area });
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        "A rhombus is a parallelogram, so its area is base × perpendicular height.",
        "Use A = bh.",
        `A = ${v.base} × ${v.height}.`,
        `Thus A = ${v.area}.`,
        `Therefore, the rhombus area is ${s.answer}.`,
      ];
    },
  },
  findKitePerimeterFromAdjacentPairs: {
    reasoningDescription: "Double the sum of the two distinct adjacent side lengths.",
    generateValues: (seed) => {
      const [sideA, sideB] = pick(KITE_SIDE_STATES, seed, "kite-perimeter");
      return { sideA, sideB, perimeter: 2 * (sideA + sideB) };
    },
    solve: (p) => {
      const sideA = required(p, "sideA");
      const sideB = required(p, "sideB");
      const perimeter = 2 * (sideA + sideB);
      return exactResult(p, perimeter, "LENGTH", `P=2(a+b)`, { sideA, sideB, perimeter });
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        "A kite has two pairs of equal adjacent sides.",
        "Hence P = 2(a + b).",
        `P = 2(${v.sideA} + ${v.sideB}).`,
        `Thus P = ${v.perimeter}.`,
        `Therefore, the kite's perimeter is ${s.answer}.`,
      ];
    },
  },
  findTrapeziumPerimeterFromSides: {
    reasoningDescription: "Add both parallel sides and both non-parallel sides.",
    generateValues: (seed) => {
      const [parallelSideA, parallelSideB, sideA, sideB] = pick(TRAPEZIUM_SIDE_STATES, seed, "trapezium-perimeter");
      return { parallelSideA, parallelSideB, sideA, sideB, perimeter: parallelSideA + parallelSideB + sideA + sideB };
    },
    solve: (p) => {
      const parallelSideA = required(p, "parallelSideA");
      const parallelSideB = required(p, "parallelSideB");
      const sideA = required(p, "sideA");
      const sideB = required(p, "sideB");
      const perimeter = parallelSideA + parallelSideB + sideA + sideB;
      return exactResult(p, perimeter, "LENGTH", `P=a+b+c+d`, { parallelSideA, parallelSideB, sideA, sideB, perimeter });
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        "The perimeter includes all four sides of the trapezium.",
        "Add the two parallel and two non-parallel sides.",
        `P = ${v.parallelSideA} + ${v.parallelSideB} + ${v.sideA} + ${v.sideB}.`,
        `Thus P = ${v.perimeter}.`,
        `Therefore, the perimeter is ${s.answer}.`,
      ];
    },
  },
  findCircleDiameterFromCircumference: {
    reasoningDescription: "Rearrange C = πd to recover the diameter.",
    generateValues: (seed) => circleState(seed, "diameter-circumference"),
    solve: (p) => {
      const circumference = required(p, "circumference");
      const diameter = (circumference * PI_DENOMINATOR) / PI_NUMERATOR;
      return exactResult(p, diameter, "LENGTH", `d=C/π`, { circumference, diameter, radius: diameter / 2, piPolicy: PI_POLICY });
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        "Use the circle relation C = πd.",
        "Rearrange to d = C/π.",
        `d = ${v.circumference} ÷ (22/7).`,
        `Thus d = ${v.diameter}.`,
        `Therefore, the diameter is ${s.answer}.`,
      ];
    },
  },
  findCircleDiameterFromArea: {
    reasoningDescription: "Recover the radius from A = πr², then double it.",
    generateValues: (seed) => circleState(seed, "diameter-area"),
    solve: (p) => {
      const area = required(p, "area");
      const radiusSquare = (area * PI_DENOMINATOR) / PI_NUMERATOR;
      const radius = Math.sqrt(radiusSquare);
      const diameter = 2 * radius;
      return exactResult(p, diameter, "LENGTH", `d=2\\sqrt{A/π}`, { area, radiusSquare, radius, diameter, piPolicy: PI_POLICY });
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        "First recover the radius from A = πr².",
        "Then diameter = 2r.",
        `r² = ${v.area} ÷ (22/7) = ${v.radiusSquare}; hence r = ${v.radius}.`,
        `d = 2 × ${v.radius} = ${v.diameter}.`,
        `Therefore, the diameter is ${s.answer}.`,
      ];
    },
  },
  findRadiusFromArcLengthAndAngle: {
    reasoningDescription: "Rearrange L = (θ/360)2πr to isolate the radius.",
    generateValues: (seed) => arcState(seed, "radius-arc-angle"),
    solve: (p) => {
      const arcLength = required(p, "arcLength");
      const angleDegrees = required(p, "angleDegrees");
      const radius = (arcLength * 360 * PI_DENOMINATOR) / (angleDegrees * 2 * PI_NUMERATOR);
      const circumference = piTimes(2 * radius);
      return exactResult(p, radius, "LENGTH", `r=360L/(2πθ)`, { arcLength, angleDegrees, radius, circumference, piPolicy: PI_POLICY });
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        "Arc length is the central-angle fraction of the full circumference.",
        "From L = (θ/360)2πr, isolate r.",
        `r = 360 × ${v.arcLength} ÷ [2 × (22/7) × ${v.angleDegrees}].`,
        `Thus r = ${v.radius}.`,
        `Therefore, the radius is ${s.answer}.`,
      ];
    },
  },
  findRadiusFromSectorAreaAndAngle: {
    reasoningDescription: "Rearrange A = (θ/360)πr² and take the positive square root.",
    generateValues: (seed) => sectorState(seed, "radius-sector-angle"),
    solve: (p) => {
      const sectorArea = required(p, "sectorArea");
      const angleDegrees = required(p, "angleDegrees");
      const radiusSquare = (sectorArea * 360 * PI_DENOMINATOR) / (angleDegrees * PI_NUMERATOR);
      const radius = Math.sqrt(radiusSquare);
      const fullArea = piTimes(radius ** 2);
      return exactResult(p, radius, "LENGTH", `r=\\sqrt{360A/(πθ)}`, { sectorArea, angleDegrees, radiusSquare, radius, fullArea, piPolicy: PI_POLICY });
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        "Sector area is the central-angle fraction of the full circle area.",
        "From A = (θ/360)πr², isolate r².",
        `r² = 360 × ${v.sectorArea} ÷ [(22/7) × ${v.angleDegrees}] = ${v.radiusSquare}.`,
        `Thus r = ${v.radius}.`,
        `Therefore, the radius is ${s.answer}.`,
      ];
    },
  },
  findInnerRadiusFromAnnulusArea: {
    reasoningDescription: "Use r² = R² − A/π to recover the inner radius.",
    generateValues: (seed) => annulusState(seed, "inner-radius-annulus"),
    solve: (p) => {
      const area = required(p, "area");
      const outerRadius = required(p, "outerRadius");
      const radiusSquareDifference = (area * PI_DENOMINATOR) / PI_NUMERATOR;
      const innerRadiusSquare = outerRadius ** 2 - radiusSquareDifference;
      const innerRadius = Math.sqrt(innerRadiusSquare);
      return exactResult(p, innerRadius, "LENGTH", `r=\\sqrt{R^2-A/π}`, { area, outerRadius, radiusSquareDifference, innerRadiusSquare, innerRadius, piPolicy: PI_POLICY });
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        "For an annulus, A = π(R² − r²).",
        "Rearrange to r² = R² − A/π.",
        `R² − r² = ${v.radiusSquareDifference}.`,
        `r² = ${v.innerRadiusSquare}; therefore r = ${v.innerRadius}.`,
        `Hence, the inner radius is ${s.answer}.`,
      ];
    },
  },
  findWheelRevolutionsFromDistance: {
    reasoningDescription: "Divide the travelled distance by one wheel circumference.",
    generateValues: (seed) => wheelState(seed, "wheel-revolutions"),
    solve: (p) => {
      const radius = required(p, "radius");
      const distance = required(p, "distance");
      const circumference = piTimes(2 * radius);
      const revolutions = distance / circumference;
      return exactResult(p, revolutions, "COUNT", `n=D/(2πr)`, { radius, distance, circumference, revolutions, piPolicy: PI_POLICY });
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        "One complete revolution covers one circumference.",
        `Circumference = 2 × (22/7) × ${v.radius} = ${v.circumference}.`,
        "Revolutions = distance ÷ circumference.",
        `n = ${v.distance} ÷ ${v.circumference} = ${v.revolutions}.`,
        `Therefore, the wheel makes ${s.answer}.`,
      ];
    },
  },
  findWheelRadiusFromDistanceAndRevolutions: {
    reasoningDescription: "Use D = 2πrn and isolate the wheel radius.",
    generateValues: (seed) => wheelState(seed, "wheel-radius"),
    solve: (p) => {
      const distance = required(p, "distance");
      const revolutions = required(p, "revolutions");
      const radius = (distance * PI_DENOMINATOR) / (2 * PI_NUMERATOR * revolutions);
      const circumference = piTimes(2 * radius);
      return exactResult(p, radius, "LENGTH", `r=D/(2πn)`, { distance, revolutions, radius, circumference, piPolicy: PI_POLICY });
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        "Distance equals one circumference multiplied by the revolution count.",
        "Use D = 2πrn and isolate r.",
        `r = ${v.distance} ÷ [2 × (22/7) × ${v.revolutions}].`,
        `Thus r = ${v.radius}.`,
        `Therefore, the wheel radius is ${s.answer}.`,
      ];
    },
  },
  findOuterRectangularPathWidthFromArea: {
    reasoningDescription: "Solve the outside-border area equation for the uniform width.",
    generateValues: outerRectangularWidthState,
    solve: (p) => {
      const innerLength = required(p, "innerLength");
      const innerBreadth = required(p, "innerBreadth");
      const area = required(p, "area");
      const discriminant = (innerLength + innerBreadth) ** 2 + 4 * area;
      const pathWidth = (Math.sqrt(discriminant) - (innerLength + innerBreadth)) / 4;
      const outerLength = innerLength + 2 * pathWidth;
      const outerBreadth = innerBreadth + 2 * pathWidth;
      const innerArea = innerLength * innerBreadth;
      const outerArea = outerLength * outerBreadth;
      return exactResult(p, pathWidth, "LENGTH", `w=[√((L+B)^2+4A)-(L+B)]/4`, { innerLength, innerBreadth, area, discriminant, pathWidth, outerLength, outerBreadth, innerArea, outerArea, pathPosition: "OUTSIDE" });
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        "An outside path increases both dimensions by 2w.",
        "Use A = (L + 2w)(B + 2w) − LB.",
        `Substitution gives ${v.area} = (${v.innerLength} + 2w)(${v.innerBreadth} + 2w) − ${v.innerArea}.`,
        `Solving the resulting quadratic gives w = ${v.pathWidth}.`,
        `Therefore, the path width is ${s.answer}.`,
      ];
    },
  },
  findInnerRectangularPathWidthFromArea: {
    reasoningDescription: "Solve the inside-border area equation for the smaller positive width.",
    generateValues: innerRectangularWidthState,
    solve: (p) => {
      const outerLength = required(p, "outerLength");
      const outerBreadth = required(p, "outerBreadth");
      const area = required(p, "area");
      const discriminant = (outerLength + outerBreadth) ** 2 - 4 * area;
      const pathWidth = ((outerLength + outerBreadth) - Math.sqrt(discriminant)) / 4;
      const innerLength = outerLength - 2 * pathWidth;
      const innerBreadth = outerBreadth - 2 * pathWidth;
      const outerArea = outerLength * outerBreadth;
      const innerArea = innerLength * innerBreadth;
      return exactResult(p, pathWidth, "LENGTH", `w=[(L+B)-√((L+B)^2-4A)]/4`, { outerLength, outerBreadth, area, discriminant, pathWidth, innerLength, innerBreadth, outerArea, innerArea, pathPosition: "INSIDE" });
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        "An inside border leaves an inner rectangle of dimensions L − 2w and B − 2w.",
        "Use A = LB − (L − 2w)(B − 2w).",
        `Substitution gives ${v.area} = ${v.outerArea} − (${v.outerLength} − 2w)(${v.outerBreadth} − 2w).`,
        `The smaller positive root gives w = ${v.pathWidth}.`,
        `Therefore, the border width is ${s.answer}.`,
      ];
    },
  },
  findOuterCircularPathWidthFromArea: {
    reasoningDescription: "Recover the outer radius from the annular area and subtract the inner radius.",
    generateValues: outerCircularWidthState,
    solve: (p) => {
      const innerRadius = required(p, "innerRadius");
      const area = required(p, "area");
      const radiusSquareDifference = (area * PI_DENOMINATOR) / PI_NUMERATOR;
      const outerRadius = Math.sqrt(innerRadius ** 2 + radiusSquareDifference);
      const pathWidth = outerRadius - innerRadius;
      const innerArea = piTimes(innerRadius ** 2);
      const outerArea = piTimes(outerRadius ** 2);
      return exactResult(p, pathWidth, "LENGTH", `w=√(r²+A/π)-r`, { innerRadius, outerRadius, area, radiusSquareDifference, pathWidth, innerArea, outerArea, piPolicy: PI_POLICY, pathPosition: "OUTSIDE" });
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        "The outside path is an annulus with outer radius R = r + w.",
        "From A = π(R² − r²), recover R² = r² + A/π.",
        `R = √(${v.innerRadius}² + ${v.radiusSquareDifference}) = ${v.outerRadius}.`,
        `Width = R − r = ${v.outerRadius} − ${v.innerRadius} = ${v.pathWidth}.`,
        `Therefore, the path width is ${s.answer}.`,
      ];
    },
  },
  findInnerCircularPathWidthFromArea: {
    reasoningDescription: "Recover the inner radius from the annular area and subtract it from the outer radius.",
    generateValues: innerCircularWidthState,
    solve: (p) => {
      const outerRadius = required(p, "outerRadius");
      const area = required(p, "area");
      const radiusSquareDifference = (area * PI_DENOMINATOR) / PI_NUMERATOR;
      const innerRadius = Math.sqrt(outerRadius ** 2 - radiusSquareDifference);
      const pathWidth = outerRadius - innerRadius;
      const innerArea = piTimes(innerRadius ** 2);
      const outerArea = piTimes(outerRadius ** 2);
      return exactResult(p, pathWidth, "LENGTH", `w=R-√(R²-A/π)`, { innerRadius, outerRadius, area, radiusSquareDifference, pathWidth, innerArea, outerArea, piPolicy: PI_POLICY, pathPosition: "INSIDE" });
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        "The inside path is the ring between outer radius R and inner radius r.",
        "From A = π(R² − r²), recover r² = R² − A/π.",
        `r = √(${v.outerRadius}² − ${v.radiusSquareDifference}) = ${v.innerRadius}.`,
        `Width = R − r = ${v.outerRadius} − ${v.innerRadius} = ${v.pathWidth}.`,
        `Therefore, the path width is ${s.answer}.`,
      ];
    },
  },
  findCrossRoadArea: {
    reasoningDescription: "Add the two road strips and subtract their overlap once.",
    generateValues: crossRoadState,
    solve: (p) => {
      const length = required(p, "length");
      const breadth = required(p, "breadth");
      const roadWidthA = required(p, "pathWidth");
      const roadWidthB = required(p, "gateWidth");
      const roadAreaA = length * roadWidthA;
      const roadAreaB = breadth * roadWidthB;
      const overlapArea = roadWidthA * roadWidthB;
      const roadArea = roadAreaA + roadAreaB - overlapArea;
      const fieldArea = length * breadth;
      return exactResult(p, roadArea, "AREA", `A=Lw₁+Bw₂-w₁w₂`, { length, breadth, roadWidthA, roadWidthB, roadAreaA, roadAreaB, overlapArea, roadArea, fieldArea });
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        "Treat each road as a rectangular strip.",
        `Road areas are ${v.length} × ${v.roadWidthA} = ${v.roadAreaA} and ${v.breadth} × ${v.roadWidthB} = ${v.roadAreaB}.`,
        `Their crossing overlap ${v.roadWidthA} × ${v.roadWidthB} = ${v.overlapArea} was counted twice, so subtract it once.`,
        `Road area = ${v.roadAreaA} + ${v.roadAreaB} − ${v.overlapArea} = ${v.roadArea}.`,
        `Therefore, the area occupied by the roads is ${s.answer}.`,
      ];
    },
  },
  findRemainingFieldAreaAfterCrossRoads: {
    reasoningDescription: "Subtract the inclusion-exclusion road area from the whole field area.",
    generateValues: crossRoadState,
    solve: (p) => {
      const length = required(p, "length");
      const breadth = required(p, "breadth");
      const roadWidthA = required(p, "pathWidth");
      const roadWidthB = required(p, "gateWidth");
      const roadAreaA = length * roadWidthA;
      const roadAreaB = breadth * roadWidthB;
      const overlapArea = roadWidthA * roadWidthB;
      const roadArea = roadAreaA + roadAreaB - overlapArea;
      const fieldArea = length * breadth;
      const area = fieldArea - roadArea;
      return exactResult(p, area, "AREA", `A_{left}=LB-(Lw₁+Bw₂-w₁w₂)`, { length, breadth, roadWidthA, roadWidthB, roadAreaA, roadAreaB, overlapArea, roadArea, fieldArea, area });
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        `Whole field area = ${v.length} × ${v.breadth} = ${v.fieldArea}.`,
        "The two road strips overlap, so their union uses inclusion-exclusion.",
        `Road area = ${v.roadAreaA} + ${v.roadAreaB} − ${v.overlapArea} = ${v.roadArea}.`,
        `Remaining area = ${v.fieldArea} − ${v.roadArea} = ${v.area}.`,
        `Therefore, the uncovered field area is ${s.answer}.`,
      ];
    },
  },
  findUncoveredFloorAreaAfterTiles: {
    reasoningDescription: "Subtract the total area covered by the laid tiles from the floor area.",
    generateValues: (seed) => {
      const [floorLength, floorBreadth, tileLength, tileBreadth, tileCount] = pick(PARTIAL_TILE_STATES, seed, "partial-tiles");
      const floorArea = floorLength * floorBreadth;
      const tileArea = tileLength * tileBreadth;
      const coveredArea = tileArea * tileCount;
      return { floorLength, floorBreadth, tileLength, tileBreadth, tileCount, floorArea, tileArea, coveredArea, area: floorArea - coveredArea };
    },
    solve: (p) => {
      const floorLength = required(p, "floorLength");
      const floorBreadth = required(p, "floorBreadth");
      const tileLength = required(p, "tileLength");
      const tileBreadth = required(p, "tileBreadth");
      const tileCount = required(p, "tileCount");
      const floorArea = floorLength * floorBreadth;
      const tileArea = tileLength * tileBreadth;
      const coveredArea = tileArea * tileCount;
      const area = floorArea - coveredArea;
      return exactResult(p, area, "AREA", `A_{left}=LB-n(lb)`, { floorLength, floorBreadth, tileLength, tileBreadth, tileCount, floorArea, tileArea, coveredArea, area });
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        `Floor area = ${v.floorLength} × ${v.floorBreadth} = ${v.floorArea}.`,
        `One tile covers ${v.tileLength} × ${v.tileBreadth} = ${v.tileArea}.`,
        `${v.tileCount} tiles cover ${v.tileCount} × ${v.tileArea} = ${v.coveredArea}.`,
        `Uncovered area = ${v.floorArea} − ${v.coveredArea} = ${v.area}.`,
        `Therefore, the uncovered area is ${s.answer}.`,
      ];
    },
  },
  findAreaRateFromTotalCost: {
    reasoningDescription: "Divide the total cost by the measured area.",
    generateValues: (seed) => {
      const [area, cost] = pick(AREA_RATE_STATES, seed, "area-rate");
      return { area, cost, ratePerSquareMetre: cost / area };
    },
    solve: (p) => {
      const area = required(p, "area");
      const cost = required(p, "cost");
      const ratePerSquareMetre = cost / area;
      return exactResult(p, ratePerSquareMetre, "COST", `rate=cost/area`, { area, cost, ratePerSquareMetre, rateUnit: "₹ per m²" });
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        "Rate per square metre equals total cost divided by total area.",
        "Use rate = cost ÷ area.",
        `Rate = ₹${v.cost} ÷ ${v.area}.`,
        `Thus the rate is ₹${v.ratePerSquareMetre} per m².`,
        `Therefore, the numerical rate is ${s.answer}.`,
      ];
    },
  },
  findFencingRateFromTotalCost: {
    reasoningDescription: "Divide the total fencing cost by the full boundary length.",
    generateValues: (seed) => {
      const [length, breadth, cost] = pick(FENCE_RATE_STATES, seed, "fence-rate");
      const perimeter = 2 * (length + breadth);
      return { length, breadth, perimeter, cost, ratePerMetre: cost / perimeter };
    },
    solve: (p) => {
      const length = required(p, "length");
      const breadth = required(p, "breadth");
      const cost = required(p, "cost");
      const perimeter = 2 * (length + breadth);
      const ratePerMetre = cost / perimeter;
      return exactResult(p, ratePerMetre, "COST", `rate=cost/[2(L+B)]`, { length, breadth, perimeter, cost, ratePerMetre, rateUnit: "₹ per m" });
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        `Boundary length = 2(${v.length} + ${v.breadth}) = ${v.perimeter}.`,
        "Rate per metre equals total cost divided by fencing length.",
        `Rate = ₹${v.cost} ÷ ${v.perimeter}.`,
        `Thus the rate is ₹${v.ratePerMetre} per metre.`,
        `Therefore, the numerical rate is ${s.answer}.`,
      ];
    },
  },
  findInnerRectangularPathTilesRequired: {
    reasoningDescription: "Find the inside border area and divide it by one paving tile's area.",
    generateValues: (seed) => {
      const [outerLength, outerBreadth, pathWidth, tileLength, tileBreadth] = pick(INNER_PATH_TILE_STATES, seed, "inner-path-tiles");
      const innerLength = outerLength - 2 * pathWidth;
      const innerBreadth = outerBreadth - 2 * pathWidth;
      const outerArea = outerLength * outerBreadth;
      const innerArea = innerLength * innerBreadth;
      const area = outerArea - innerArea;
      const tileArea = tileLength * tileBreadth;
      const tileCount = area / tileArea;
      if (!Number.isInteger(tileCount)) throw new Error(`MEN-001 inner-path tile count must be integral.`);
      return { outerLength, outerBreadth, pathWidth, innerLength, innerBreadth, outerArea, innerArea, area, tileLength, tileBreadth, tileArea, tileCount };
    },
    solve: (p) => {
      const outerLength = required(p, "outerLength");
      const outerBreadth = required(p, "outerBreadth");
      const pathWidth = required(p, "pathWidth");
      const tileLength = required(p, "tileLength");
      const tileBreadth = required(p, "tileBreadth");
      const innerLength = outerLength - 2 * pathWidth;
      const innerBreadth = outerBreadth - 2 * pathWidth;
      const outerArea = outerLength * outerBreadth;
      const innerArea = innerLength * innerBreadth;
      const area = outerArea - innerArea;
      const tileArea = tileLength * tileBreadth;
      const tileCount = area / tileArea;
      return exactResult(p, tileCount, "COUNT", `N=[LB-(L-2w)(B-2w)]/(lb)`, { outerLength, outerBreadth, pathWidth, innerLength, innerBreadth, outerArea, innerArea, area, tileLength, tileBreadth, tileArea, tileCount, pathPosition: "INSIDE" });
    },
    explain: (_p, s) => {
      const v = s.workingValues;
      return [
        "The paving tiles cover only the inside border.",
        `Border area = ${v.outerArea} − ${v.innerArea} = ${v.area}.`,
        `One tile covers ${v.tileLength} × ${v.tileBreadth} = ${v.tileArea}.`,
        `Tiles required = ${v.area} ÷ ${v.tileArea} = ${v.tileCount}.`,
        `Therefore, ${s.answer} are required.`,
      ];
    },
  },
} as const satisfies Record<string, Definition>;

export type Men001ExhaustivenessSolveMode = keyof typeof MEN_001_EXHAUSTIVENESS_SOLVE_MODE_REGISTRY;
