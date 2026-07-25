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

const PN = 22;
const PD = 7;
const P = "22/7";

function hash(value: string) {
  let h = 2166136261;
  for (const character of value) {
    h ^= character.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pick<T>(items: readonly T[], seed: string, salt: string): T {
  return items[hash(`${seed}:${salt}`) % items.length]!;
}

function positive(parameters: Men001Parameters, key: keyof Values) {
  const candidate = parameters.values[key];
  if (typeof candidate !== "number" || !Number.isFinite(candidate) || candidate <= 0) {
    throw new Error(`MEN-001 CP-005 requires positive ${String(key)}.`);
  }
  return candidate;
}

function piArea(radius: number) {
  const result = (PN * radius * radius) / PD;
  if (!Number.isInteger(result)) {
    throw new Error(`MEN-001 CP-005 circle area must remain exact under π = ${P}.`);
  }
  return result;
}

function piCircumference(radius: number) {
  const result = (2 * PN * radius) / PD;
  if (!Number.isInteger(result)) {
    throw new Error(`MEN-001 CP-005 circumference must remain exact under π = ${P}.`);
  }
  return result;
}

function unitFor(policy: Men001UnitPolicy): Men001SolverResult["unit"] {
  const units: Partial<Record<Men001UnitPolicy, Men001SolverResult["unit"]>> = {
    CENTIMETRES: "cm",
    METRES: "m",
    SQUARE_CENTIMETRES: "cm²",
    SQUARE_METRES: "m²",
  };
  const unit = units[policy];
  if (!unit) throw new Error(`MEN-001 CP-005 does not support unit policy ${policy}.`);
  return unit;
}

function integerResult(
  parameters: Men001Parameters,
  answerDimension: Extract<Men001AnswerDimension, "AREA" | "LENGTH">,
  answerValue: number,
  equation: string,
  workingValues: Record<string, string | number>,
  usesPi = false,
): Men001SolverResult {
  if (!Number.isInteger(answerValue) || answerValue <= 0) {
    throw new Error(`MEN-001 CP-005 expected a positive integer answer; received ${answerValue}.`);
  }
  const unit = unitFor(parameters.unitPolicy);
  const expectedUnits = answerDimension === "AREA" ? ["cm²", "m²"] : ["cm", "m"];
  if (!expectedUnits.includes(unit)) {
    throw new Error(`MEN-001 CP-005 ${answerDimension} answer has incompatible unit ${unit}.`);
  }
  const canonicalAnswer: Men001CanonicalAnswer = {
    kind: "unit",
    value: answerValue,
    unit,
    precision: 0,
    display: `${answerValue} ${unit}`,
    rounding: "exact",
    metadata: { answerDimension, exactKind: "INTEGER", ...(usesPi ? { piPolicy: P } : {}) },
  };
  return {
    exactAnswer: { kind: "INTEGER", value: answerValue },
    canonicalAnswer,
    answer: canonicalAnswer.display,
    answerDimension,
    unit,
    equation,
    workingValues: { ...workingValues, ...(usesPi ? { piPolicy: P } : {}) },
  };
}

function surdAreaResult(
  parameters: Men001Parameters,
  coefficient: number,
  equation: string,
  workingValues: Record<string, string | number>,
): Men001SolverResult {
  if (!Number.isInteger(coefficient) || coefficient <= 0) {
    throw new Error(`MEN-001 CP-005 requires a positive integral √3 coefficient.`);
  }
  const unit = unitFor(parameters.unitPolicy);
  if (unit !== "cm²" && unit !== "m²") {
    throw new Error(`MEN-001 CP-005 regular-hexagon area requires a square unit.`);
  }
  const latexUnit = unit === "cm²" ? "\\text{cm}^{2}" : "\\text{m}^{2}";
  const latexValue = `${coefficient}\\sqrt{3}\\,${latexUnit}`;
  const canonicalAnswer: Men001CanonicalAnswer = {
    kind: "symbolic",
    value: latexValue,
    rendered: `$$${latexValue}$$`,
    display: `${coefficient}√3 ${unit}`,
    rounding: "exact",
    metadata: { answerDimension: "AREA", exactKind: "SURD", radicand: 3, unit },
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
    answerDimension: "AREA",
    unit,
    equation,
    workingValues,
  };
}

function explain(
  identification: string,
  relation: string,
  substitution: string,
  evaluation: string,
  answer: string,
) {
  return [identification, relation, substitution, evaluation, answer];
}

const RECT_SEMICIRCLE_STATES = [
  [20, 14], [24, 14], [30, 28], [36, 28], [42, 14],
] as const;
const RECT_TRIANGLE_STATES = [
  [20, 12, 8], [24, 14, 10], [30, 16, 12], [18, 12, 6], [28, 18, 10],
] as const;
const TWO_RECTANGLE_STATES = [
  [20, 10, 8, 6], [24, 12, 10, 6], [30, 14, 12, 8], [18, 9, 6, 5],
] as const;
const L_SHAPE_STATES = [
  [20, 16, 8, 6], [24, 18, 10, 8], [30, 20, 12, 10], [28, 18, 8, 6],
] as const;
const SQUARE_CIRCLE_SIDES = [14, 28, 42, 56] as const;
const CIRCLE_SQUARE_RADII = [7, 14, 21, 28] as const;
const RECT_TWO_SEMICIRCLES = [[28, 14], [42, 14], [56, 28], [70, 28]] as const;
const HEXAGON_SIDES = [6, 8, 10, 12, 14] as const;
const RECTANGLE_FIT_STATES = [[20, 14], [24, 16], [30, 18], [28, 20], [36, 14]] as const;

function rectangleSemicircleState(seed: string, salt: string) {
  const [length, breadth] = pick(RECT_SEMICIRCLE_STATES, seed, salt);
  const radius = breadth / 2;
  const rectangleArea = length * breadth;
  const semicircleArea = piArea(radius) / 2;
  const semicircleArc = piCircumference(radius) / 2;
  const area = rectangleArea + semicircleArea;
  const compositePerimeter = 2 * length + breadth + semicircleArc;
  return {
    length, breadth, diameter: breadth, radius, rectangleArea, semicircleArea,
    semicircleArc, area, compositePerimeter, perimeter: compositePerimeter,
  };
}

function stadiumState(seed: string, salt: string) {
  const [straightLength, breadth] = pick(RECT_SEMICIRCLE_STATES, seed, salt);
  const radius = breadth / 2;
  const rectangleArea = straightLength * breadth;
  const circleArea = piArea(radius);
  const circumference = piCircumference(radius);
  const area = rectangleArea + circleArea;
  const compositePerimeter = 2 * straightLength + circumference;
  return {
    straightLength, length: straightLength, breadth, diameter: breadth, radius,
    rectangleArea, circleArea, circumference, area, compositePerimeter,
    perimeter: compositePerimeter,
  };
}

function rectangleTriangleState(seed: string, salt: string) {
  const [length, breadth, height] = pick(RECT_TRIANGLE_STATES, seed, salt);
  const rectangleArea = length * breadth;
  const triangleArea = (breadth * height) / 2;
  return { length, breadth, base: breadth, height, rectangleArea, triangleArea, area: rectangleArea + triangleArea };
}

function twoRectangleState(seed: string) {
  const [length, breadth, componentLength, componentBreadth] = pick(TWO_RECTANGLE_STATES, seed, "two-rectangles");
  const rectangleArea = length * breadth;
  const componentArea = componentLength * componentBreadth;
  return { length, breadth, componentLength, componentBreadth, rectangleArea, componentArea, area: rectangleArea + componentArea };
}

function lShapeState(seed: string, salt: string) {
  const [outerLength, outerBreadth, cutoutLength, cutoutBreadth] = pick(L_SHAPE_STATES, seed, salt);
  const outerArea = outerLength * outerBreadth;
  const cutoutArea = cutoutLength * cutoutBreadth;
  const area = outerArea - cutoutArea;
  const compositePerimeter = 2 * (outerLength + outerBreadth);
  return { outerLength, outerBreadth, cutoutLength, cutoutBreadth, outerArea, cutoutArea, area, compositePerimeter, perimeter: compositePerimeter };
}

function squareCircleState(seed: string, salt: string) {
  const side = pick(SQUARE_CIRCLE_SIDES, seed, salt);
  const radius = side / 2;
  const squareArea = side * side;
  const circleArea = piArea(radius);
  return { side, diameter: side, radius, squareArea, circleArea, area: squareArea - circleArea };
}

function circleSquareState(seed: string, salt: string) {
  const radius = pick(CIRCLE_SQUARE_RADII, seed, salt);
  const diameter = 2 * radius;
  const circleArea = piArea(radius);
  const squareArea = (diameter * diameter) / 2;
  return { radius, diameter, circleArea, squareArea, area: circleArea - squareArea };
}

function rectangleMinusTwoSemicirclesState(seed: string) {
  const [length, breadth] = pick(RECT_TWO_SEMICIRCLES, seed, "rectangle-two-semicircles");
  const radius = breadth / 2;
  const rectangleArea = length * breadth;
  const circleArea = piArea(radius);
  return { length, breadth, diameter: breadth, radius, rectangleArea, circleArea, area: rectangleArea - circleArea };
}

function hexagonState(seed: string, salt: string) {
  const side = pick(HEXAGON_SIDES, seed, salt);
  const hexagonAreaCoefficient = (3 * side * side) / 2;
  return { side, hexagonAreaCoefficient, perimeter: 6 * side };
}

function largestCircleInRectangleState(seed: string, salt: string) {
  const [length, breadth] = pick(RECTANGLE_FIT_STATES, seed, salt);
  const smallerSide = Math.min(length, breadth);
  const diameter = smallerSide;
  const radius = smallerSide / 2;
  return { length, breadth, smallerSide, diameter, radius, circleArea: piArea(radius) };
}

function circularWorking(values: Record<string, string | number>) {
  return { ...values, piPolicy: P };
}

export const MEN_001_CP005_SOLVE_MODE_REGISTRY = {
  findRectangleSemicircleCompositeArea: {
    reasoningDescription: "Add the rectangle area and the externally attached semicircle area; the shared diameter is internal.",
    generateValues: (seed) => rectangleSemicircleState(seed, "rectangle-semicircle-area"),
    solve: (p) => {
      const length = positive(p, "length");
      const breadth = positive(p, "breadth");
      const radius = breadth / 2;
      const rectangleArea = length * breadth;
      const semicircleArea = piArea(radius) / 2;
      const area = rectangleArea + semicircleArea;
      return integerResult(p, "AREA", area, "A=lb+(1/2)πr²", circularWorking({ length, breadth, radius, rectangleArea, semicircleArea, area }), true);
    },
    explain: (_p, s) => explain("The figure contains a rectangle and one externally attached semicircle.", "Add Arectangle = lb and Asemicircle = 1/2 πr².", `A = ${s.workingValues.rectangleArea} + ${s.workingValues.semicircleArea}.`, `A = ${s.workingValues.area}.`, `The complete figure has area ${s.answer}.`),
  },
  findStadiumCompositeArea: {
    reasoningDescription: "Treat the two semicircular ends as one full circle and add that area to the central rectangle.",
    generateValues: (seed) => stadiumState(seed, "stadium-area"),
    solve: (p) => {
      const straightLength = positive(p, "straightLength");
      const breadth = positive(p, "breadth");
      const radius = breadth / 2;
      const rectangleArea = straightLength * breadth;
      const circleArea = piArea(radius);
      const area = rectangleArea + circleArea;
      return integerResult(p, "AREA", area, "A=lb+πr²", circularWorking({ straightLength, breadth, radius, rectangleArea, circleArea, area }), true);
    },
    explain: (_p, s) => explain("The two semicircular ends together form one complete circle.", "Add the central rectangle and that circle.", `A = ${s.workingValues.rectangleArea} + ${s.workingValues.circleArea}.`, `A = ${s.workingValues.area}.`, `The stadium-shaped figure covers ${s.answer}.`),
  },
  findRectangleTriangleCompositeArea: {
    reasoningDescription: "Add the rectangle area and the triangle area sharing the same base width.",
    generateValues: (seed) => rectangleTriangleState(seed, "rectangle-triangle-area"),
    solve: (p) => {
      const length = positive(p, "length");
      const breadth = positive(p, "breadth");
      const height = positive(p, "height");
      const rectangleArea = length * breadth;
      const triangleArea = (breadth * height) / 2;
      const area = rectangleArea + triangleArea;
      return integerResult(p, "AREA", area, "A=lb+(1/2)bh", { length, breadth, height, rectangleArea, triangleArea, area });
    },
    explain: (_p, s) => explain("The roof-like triangle is attached to the rectangle without overlap.", "Add lb and 1/2 bh.", `A = ${s.workingValues.rectangleArea} + ${s.workingValues.triangleArea}.`, `A = ${s.workingValues.area}.`, `The composite figure has area ${s.answer}.`),
  },
  findTwoRectangleCompositeArea: {
    reasoningDescription: "Add the areas of two non-overlapping rectangular components.",
    generateValues: twoRectangleState,
    solve: (p) => {
      const length = positive(p, "length");
      const breadth = positive(p, "breadth");
      const componentLength = positive(p, "componentLength");
      const componentBreadth = positive(p, "componentBreadth");
      const rectangleArea = length * breadth;
      const componentArea = componentLength * componentBreadth;
      const area = rectangleArea + componentArea;
      return integerResult(p, "AREA", area, "A=l₁b₁+l₂b₂", { length, breadth, componentLength, componentBreadth, rectangleArea, componentArea, area });
    },
    explain: (_p, s) => explain("The two rectangular parts do not overlap.", "Find each rectangular area and add them.", `A = ${s.workingValues.rectangleArea} + ${s.workingValues.componentArea}.`, `A = ${s.workingValues.area}.`, `Together they cover ${s.answer}.`),
  },
  findLShapeAreaBySubtraction: {
    reasoningDescription: "Subtract the rectangular corner cut-out from the enclosing rectangle.",
    generateValues: (seed) => lShapeState(seed, "l-area"),
    solve: (p) => {
      const outerLength = positive(p, "outerLength");
      const outerBreadth = positive(p, "outerBreadth");
      const cutoutLength = positive(p, "cutoutLength");
      const cutoutBreadth = positive(p, "cutoutBreadth");
      const outerArea = outerLength * outerBreadth;
      const cutoutArea = cutoutLength * cutoutBreadth;
      const area = outerArea - cutoutArea;
      return integerResult(p, "AREA", area, "A=L B-l b", { outerLength, outerBreadth, cutoutLength, cutoutBreadth, outerArea, cutoutArea, area });
    },
    explain: (_p, s) => explain("Complete the L-shape to an outer rectangle and identify the missing corner.", "Subtract the cut-out rectangle from the outer rectangle.", `A = ${s.workingValues.outerArea} - ${s.workingValues.cutoutArea}.`, `A = ${s.workingValues.area}.`, `The L-shaped region covers ${s.answer}.`),
  },
  findSquareMinusCircleShadedArea: {
    reasoningDescription: "Subtract the inscribed circle from the surrounding square.",
    generateValues: (seed) => squareCircleState(seed, "square-minus-circle"),
    solve: (p) => {
      const side = positive(p, "side");
      const radius = side / 2;
      const squareArea = side * side;
      const circleArea = piArea(radius);
      const area = squareArea - circleArea;
      return integerResult(p, "AREA", area, "A=s²-π(s/2)²", circularWorking({ side, radius, squareArea, circleArea, area }), true);
    },
    explain: (_p, s) => explain("The shaded portion lies inside the square but outside its inscribed circle.", "Subtract the circle area from the square area.", `A = ${s.workingValues.squareArea} - ${s.workingValues.circleArea}.`, `A = ${s.workingValues.area}.`, `The shaded area is ${s.answer}.`),
  },
  findCircleMinusSquareShadedArea: {
    reasoningDescription: "Subtract the area of the inscribed square from the surrounding circle.",
    generateValues: (seed) => circleSquareState(seed, "circle-minus-square"),
    solve: (p) => {
      const radius = positive(p, "radius");
      const diameter = 2 * radius;
      const circleArea = piArea(radius);
      const squareArea = (diameter * diameter) / 2;
      const area = circleArea - squareArea;
      return integerResult(p, "AREA", area, "A=πr²-d²/2", circularWorking({ radius, diameter, circleArea, squareArea, area }), true);
    },
    explain: (_p, s) => explain("For a square inscribed in a circle, the square diagonal equals the circle diameter.", "Find the circle area and subtract d²/2 for the square.", `A = ${s.workingValues.circleArea} - ${s.workingValues.squareArea}.`, `A = ${s.workingValues.area}.`, `The region outside the square has area ${s.answer}.`),
  },
  findRectangleMinusTwoSemicirclesArea: {
    reasoningDescription: "Combine the two equal semicircular cut-outs into one circle and subtract it from the rectangle.",
    generateValues: rectangleMinusTwoSemicirclesState,
    solve: (p) => {
      const length = positive(p, "length");
      const breadth = positive(p, "breadth");
      const radius = breadth / 2;
      const rectangleArea = length * breadth;
      const circleArea = piArea(radius);
      const area = rectangleArea - circleArea;
      return integerResult(p, "AREA", area, "A=lb-πr²", circularWorking({ length, breadth, radius, rectangleArea, circleArea, area }), true);
    },
    explain: (_p, s) => explain("The two semicircular cut-outs are equal and together form a full circle.", "Subtract that circle from the rectangle.", `A = ${s.workingValues.rectangleArea} - ${s.workingValues.circleArea}.`, `A = ${s.workingValues.area}.`, `The remaining sheet area is ${s.answer}.`),
  },
  findFourCornerQuadrantsShadedArea: {
    reasoningDescription: "Four equal corner quadrants together form one full circle, which is removed from the square.",
    generateValues: (seed) => squareCircleState(seed, "four-quadrants"),
    solve: (p) => {
      const side = positive(p, "side");
      const radius = side / 2;
      const squareArea = side * side;
      const circleArea = piArea(radius);
      const area = squareArea - circleArea;
      return integerResult(p, "AREA", area, "A=s²-4(1/4 πr²)", circularWorking({ side, radius, squareArea, circleArea, area }), true);
    },
    explain: (_p, s) => explain("The four corner quadrants have the same radius and together make one full circle.", "Subtract their combined circle area from the square.", `A = ${s.workingValues.squareArea} - ${s.workingValues.circleArea}.`, `A = ${s.workingValues.area}.`, `The central shaded portion is ${s.answer}.`),
  },
  findInscribedCircleAreaInSquare: {
    reasoningDescription: "The diameter of a circle inscribed in a square equals the square side.",
    generateValues: (seed) => squareCircleState(seed, "inscribed-circle"),
    solve: (p) => {
      const side = positive(p, "side");
      const radius = side / 2;
      const circleArea = piArea(radius);
      return integerResult(p, "AREA", circleArea, "A=π(s/2)²", circularWorking({ side, diameter: side, radius, squareArea: side * side, circleArea, area: circleArea }), true);
    },
    explain: (_p, s) => explain("The circle touches all four sides of the square, so its diameter equals the square side.", "Use r=s/2 and then A=πr².", `A = ${P} × ${s.workingValues.radius}².`, `A = ${s.workingValues.circleArea}.`, `The inscribed circle covers ${s.answer}.`),
  },
  findInscribedSquareAreaInCircle: {
    reasoningDescription: "The diagonal of a square inscribed in a circle equals the circle diameter, so square area is d²/2.",
    generateValues: (seed) => circleSquareState(seed, "inscribed-square"),
    solve: (p) => {
      const radius = positive(p, "radius");
      const diameter = 2 * radius;
      const squareArea = (diameter * diameter) / 2;
      return integerResult(p, "AREA", squareArea, "A=d²/2", circularWorking({ radius, diameter, squareArea, circleArea: piArea(radius), area: squareArea }), true);
    },
    explain: (_p, s) => explain("The square diagonal is the circle diameter.", "A square with diagonal d has area d²/2.", `A = ${s.workingValues.diameter}² / 2.`, `A = ${s.workingValues.squareArea}.`, `The inscribed square has area ${s.answer}.`),
  },
  findLargestCircleRadiusInRectangle: {
    reasoningDescription: "The largest circle is limited by the rectangle's smaller side, which becomes the circle diameter.",
    generateValues: (seed) => largestCircleInRectangleState(seed, "largest-circle"),
    solve: (p) => {
      const length = positive(p, "length");
      const breadth = positive(p, "breadth");
      const smallerSide = Math.min(length, breadth);
      const radius = smallerSide / 2;
      return integerResult(p, "LENGTH", radius, "r=min(l,b)/2", { length, breadth, smallerSide, diameter: smallerSide, radius });
    },
    explain: (_p, s) => explain("A circle must fit across the rectangle's narrower dimension.", "That smaller side is the diameter of the largest possible circle.", `r = ${s.workingValues.smallerSide} / 2.`, `r = ${s.workingValues.radius}.`, `The largest possible radius is ${s.answer}.`),
  },
  findRegularHexagonAreaFromSide: {
    reasoningDescription: "Split the regular hexagon into six equilateral triangles and add their exact areas.",
    generateValues: (seed) => hexagonState(seed, "hexagon-area"),
    solve: (p) => {
      const side = positive(p, "side");
      const coefficient = (3 * side * side) / 2;
      return surdAreaResult(p, coefficient, "A=6(√3/4 a²)=3√3/2 a²", { side, hexagonAreaCoefficient: coefficient, triangleAreaCoefficient: side * side / 4, triangleCount: 6 });
    },
    explain: (_p, s) => explain("A regular hexagon is made of six equilateral triangles of the same side.", "A = 6 × (√3/4)a² = (3√3/2)a².", `A = (3√3/2) × ${s.workingValues.side}².`, `A = ${s.workingValues.hexagonAreaCoefficient}√3.`, `The exact hexagon area is ${s.answer}.`),
  },
  findRegularHexagonPerimeterFromSide: {
    reasoningDescription: "Multiply one side by six because all sides of a regular hexagon are equal.",
    generateValues: (seed) => hexagonState(seed, "hexagon-perimeter"),
    solve: (p) => {
      const side = positive(p, "side");
      const perimeter = 6 * side;
      return integerResult(p, "LENGTH", perimeter, "P=6a", { side, perimeter });
    },
    explain: (_p, s) => explain("A regular hexagon has six equal sides.", "Use P=6a.", `P = 6 × ${s.workingValues.side}.`, `P = ${s.workingValues.perimeter}.`, `The boundary length is ${s.answer}.`),
  },
  findRectangleSemicircleCompositePerimeter: {
    reasoningDescription: "Count the two rectangle lengths, the unshared breadth and the semicircular arc; omit the shared diameter.",
    generateValues: (seed) => rectangleSemicircleState(seed, "rectangle-semicircle-perimeter"),
    solve: (p) => {
      const length = positive(p, "length");
      const breadth = positive(p, "breadth");
      const radius = breadth / 2;
      const semicircleArc = piCircumference(radius) / 2;
      const perimeter = 2 * length + breadth + semicircleArc;
      return integerResult(p, "LENGTH", perimeter, "P=2l+b+πr", circularWorking({ length, breadth, radius, semicircleArc, compositePerimeter: perimeter, perimeter }), true);
    },
    explain: (_p, s) => explain("The attached semicircle's diameter is internal and is not part of the outside boundary.", "Add two rectangle lengths, the opposite breadth and the semicircular arc.", `P = 2×${s.workingValues.length} + ${s.workingValues.breadth} + ${s.workingValues.semicircleArc}.`, `P = ${s.workingValues.perimeter}.`, `The exposed perimeter is ${s.answer}.`),
  },
  findStadiumCompositePerimeter: {
    reasoningDescription: "Add the two straight sides and one full circumference formed by the two semicircular ends.",
    generateValues: (seed) => stadiumState(seed, "stadium-perimeter"),
    solve: (p) => {
      const straightLength = positive(p, "straightLength");
      const breadth = positive(p, "breadth");
      const radius = breadth / 2;
      const circumference = piCircumference(radius);
      const perimeter = 2 * straightLength + circumference;
      return integerResult(p, "LENGTH", perimeter, "P=2l+2πr", circularWorking({ straightLength, breadth, radius, circumference, compositePerimeter: perimeter, perimeter }), true);
    },
    explain: (_p, s) => explain("The two curved ends together contribute one full circle boundary.", "Add that circumference to the two equal straight sides.", `P = 2×${s.workingValues.straightLength} + ${s.workingValues.circumference}.`, `P = ${s.workingValues.perimeter}.`, `The stadium boundary is ${s.answer}.`),
  },
  findLShapePerimeter: {
    reasoningDescription: "For a corner cut-out, removed outer lengths are replaced by equal inner lengths, so the perimeter equals the enclosing rectangle perimeter.",
    generateValues: (seed) => lShapeState(seed, "l-perimeter"),
    solve: (p) => {
      const outerLength = positive(p, "outerLength");
      const outerBreadth = positive(p, "outerBreadth");
      const cutoutLength = positive(p, "cutoutLength");
      const cutoutBreadth = positive(p, "cutoutBreadth");
      const perimeter = 2 * (outerLength + outerBreadth);
      return integerResult(p, "LENGTH", perimeter, "P=2(L+B)", { outerLength, outerBreadth, cutoutLength, cutoutBreadth, compositePerimeter: perimeter, perimeter });
    },
    explain: (_p, s) => explain("The corner cut removes two outer pieces but adds inner edges of exactly the same lengths.", "The total boundary therefore equals the enclosing rectangle perimeter.", `P = 2(${s.workingValues.outerLength}+${s.workingValues.outerBreadth}).`, `P = ${s.workingValues.perimeter}.`, `The L-shaped boundary measures ${s.answer}.`),
  },
  findRectangleLengthFromCompositeArea: {
    reasoningDescription: "Subtract the fixed semicircle area from the composite area, then divide the remaining rectangle area by its breadth.",
    generateValues: (seed) => rectangleSemicircleState(seed, "reverse-rectangle-length"),
    solve: (p) => {
      const area = positive(p, "area");
      const breadth = positive(p, "breadth");
      const radius = breadth / 2;
      const semicircleArea = piArea(radius) / 2;
      const rectangleArea = area - semicircleArea;
      const length = rectangleArea / breadth;
      return integerResult(p, "LENGTH", length, "l=(A-(1/2)πr²)/b", circularWorking({ area, breadth, radius, semicircleArea, rectangleArea, length }), true);
    },
    explain: (_p, s) => explain("The total contains a rectangle and a semicircle whose diameter is known.", "Remove the semicircle area, then divide the rectangle area by its breadth.", `l = (${s.workingValues.area}-${s.workingValues.semicircleArea})/${s.workingValues.breadth}.`, `l = ${s.workingValues.length}.`, `The rectangular part is ${s.answer} long.`),
  },
  findSquareSideFromShadedArea: {
    reasoningDescription: "For a circle inscribed in a square, shaded area equals 3s²/14 under π=22/7; rearrange for s.",
    generateValues: (seed) => squareCircleState(seed, "reverse-square-side"),
    solve: (p) => {
      const area = positive(p, "area");
      const sideSquare = (14 * area) / 3;
      const side = Math.sqrt(sideSquare);
      if (!Number.isInteger(side)) throw new Error("MEN-001 CP-005 reverse shaded-square state must recover an integer side.");
      const radius = side / 2;
      const squareArea = side * side;
      const circleArea = piArea(radius);
      return integerResult(p, "LENGTH", side, "s=√(14A/3)", circularWorking({ area, sideSquare, side, radius, squareArea, circleArea }), true);
    },
    explain: (_p, s) => explain("With an inscribed circle, the shaded fraction of the square is fixed when π=22/7.", "A = s² - π(s/2)² = 3s²/14.", `s² = 14×${s.workingValues.area}/3 = ${s.workingValues.sideSquare}.`, `s = ${s.workingValues.side}.`, `The square side is ${s.answer}.`),
  },
} as const satisfies Record<string, Definition>;
