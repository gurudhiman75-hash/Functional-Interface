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
    throw new Error(`MEN-001 CP-005 exhaustiveness mode requires positive ${String(key)}.`);
  }
  return candidate;
}

function linearUnit(parameters: Men001Parameters): "cm" | "m" {
  if (parameters.unitPolicy === "CENTIMETRES") return "cm";
  if (parameters.unitPolicy === "METRES") return "m";
  throw new Error(`MEN-001 CP-005 exhaustiveness mode requires a linear unit.`);
}

function areaUnit(parameters: Men001Parameters): "cm²" | "m²" {
  if (parameters.unitPolicy === "SQUARE_CENTIMETRES") return "cm²";
  if (parameters.unitPolicy === "SQUARE_METRES") return "m²";
  throw new Error(`MEN-001 CP-005 exhaustiveness mode requires a square unit.`);
}

function integerResult(
  parameters: Men001Parameters,
  answerDimension: "LENGTH" | "AREA",
  answerValue: number,
  equation: string,
  workingValues: Record<string, string | number>,
  usesPi = false,
): Men001SolverResult {
  if (!Number.isInteger(answerValue) || answerValue <= 0) {
    throw new Error(`MEN-001 CP-005 exhaustiveness mode expected a positive integer answer; received ${answerValue}.`);
  }
  const unit = answerDimension === "LENGTH"
    ? linearUnit(parameters)
    : areaUnit(parameters);
  const canonicalAnswer: Men001CanonicalAnswer = {
    kind: "unit",
    value: answerValue,
    unit,
    precision: 0,
    display: `${answerValue} ${unit}`,
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
    answer: canonicalAnswer.display,
    answerDimension,
    unit,
    equation,
    workingValues: {
      ...workingValues,
      ...(usesPi ? { piPolicy: PI_POLICY } : {}),
    },
  };
}

function surdAreaResult(
  parameters: Men001Parameters,
  coefficient: number,
  equation: string,
  workingValues: Record<string, string | number>,
): Men001SolverResult {
  if (!Number.isInteger(coefficient) || coefficient <= 0) {
    throw new Error(`MEN-001 CP-005 exhaustiveness mode requires a positive integral √3 coefficient.`);
  }
  const unit = areaUnit(parameters);
  const latexUnit = unit === "cm²" ? "\\text{cm}^{2}" : "\\text{m}^{2}";
  const latexValue = `${coefficient}\\sqrt{3}\\,${latexUnit}`;
  const canonicalAnswer: Men001CanonicalAnswer = {
    kind: "symbolic",
    value: latexValue,
    rendered: `$$${latexValue}$$`,
    display: `${coefficient}√3 ${unit}`,
    rounding: "exact",
    metadata: {
      answerDimension: "AREA",
      exactKind: "SURD",
      radicand: 3,
      unit,
    },
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

const JOINED_RECTANGLE_STATES = [
  [20, 12, 8, 6, 6],
  [24, 14, 10, 8, 8],
  [30, 18, 12, 10, 10],
  [28, 16, 10, 6, 6],
] as const;

const SQUARE_HOLE_STATES = [
  [28, 7],
  [42, 7],
  [56, 14],
  [70, 21],
] as const;

const HEXAGON_SIDES = [6, 8, 10, 12, 14] as const;
const STADIUM_STATES = [
  [20, 14],
  [24, 14],
  [30, 28],
  [36, 28],
  [42, 14],
] as const;
const CIRCLE_SQUARE_RADII = [7, 14, 21, 28] as const;

function joinedRectanglesState(seed: string): Values {
  const [length, breadth, componentLength, componentBreadth, sharedEdge] =
    pick(JOINED_RECTANGLE_STATES, seed, "joined-rectangles-perimeter");
  const firstPerimeter = 2 * (length + breadth);
  const secondPerimeter = 2 * (componentLength + componentBreadth);
  return {
    length,
    breadth,
    componentLength,
    componentBreadth,
    sharedEdge,
    firstPerimeter,
    secondPerimeter,
    perimeter: firstPerimeter + secondPerimeter - 2 * sharedEdge,
  };
}

function squareHoleState(seed: string): Values {
  const [side, radius] = pick(SQUARE_HOLE_STATES, seed, "square-circular-hole-boundary");
  const outerPerimeter = 4 * side;
  const innerCircumference = (2 * PI_NUMERATOR * radius) / PI_DENOMINATOR;
  return {
    side,
    radius,
    outerPerimeter,
    innerCircumference,
    perimeter: outerPerimeter + innerCircumference,
  };
}

function hexagonState(seed: string, salt: string): Values {
  const side = pick(HEXAGON_SIDES, seed, salt);
  const perimeter = 6 * side;
  const hexagonAreaCoefficient = (3 * side * side) / 2;
  return { side, perimeter, hexagonAreaCoefficient };
}

function stadiumState(seed: string): Values {
  const [straightLength, breadth] = pick(STADIUM_STATES, seed, "stadium-reverse-perimeter");
  const circumference = (PI_NUMERATOR * breadth) / PI_DENOMINATOR;
  return {
    straightLength,
    breadth,
    diameter: breadth,
    circumference,
    perimeter: 2 * straightLength + circumference,
  };
}

function reverseCircleSquareState(seed: string): Values {
  const radius = pick(CIRCLE_SQUARE_RADII, seed, "reverse-circle-square-shading");
  const diameter = 2 * radius;
  const circleArea = (PI_NUMERATOR * radius * radius) / PI_DENOMINATOR;
  const squareArea = (diameter * diameter) / 2;
  return {
    radius,
    diameter,
    circleArea,
    squareArea,
    area: circleArea - squareArea,
  };
}

export const MEN_001_CP005_EXHAUSTIVENESS_SOLVE_MODE_REGISTRY = {
  findJoinedRectanglesCompositePerimeter: {
    reasoningDescription:
      "Add both rectangle perimeters and subtract the shared attachment edge twice because it is internal to the joined figure.",
    generateValues: joinedRectanglesState,
    solve: (parameters: Men001Parameters) => {
      const length = positive(parameters, "length");
      const breadth = positive(parameters, "breadth");
      const componentLength = positive(parameters, "componentLength");
      const componentBreadth = positive(parameters, "componentBreadth");
      const sharedEdge = positive(parameters, "sharedEdge");
      const firstPerimeter = 2 * (length + breadth);
      const secondPerimeter = 2 * (componentLength + componentBreadth);
      const perimeter = firstPerimeter + secondPerimeter - 2 * sharedEdge;
      return integerResult(
        parameters,
        "LENGTH",
        perimeter,
        "P=P₁+P₂-2s",
        {
          length,
          breadth,
          componentLength,
          componentBreadth,
          sharedEdge,
          firstPerimeter,
          secondPerimeter,
          perimeter,
        },
      );
    },
    explain: (_parameters: Men001Parameters, solver: Men001SolverResult) => [
      "The two rectangles share one attachment edge that lies inside the combined figure.",
      "Add both separate perimeters, then remove the shared edge from each rectangle.",
      `P = ${solver.workingValues.firstPerimeter} + ${solver.workingValues.secondPerimeter} - 2 × ${solver.workingValues.sharedEdge}.`,
      `P = ${solver.workingValues.perimeter}.`,
      `The exposed boundary of the joined figure is ${solver.answer}.`,
    ],
  },

  findSquareWithCircularHoleBoundary: {
    reasoningDescription:
      "The remaining region has both an outer square boundary and an inner circular boundary, so both lengths are included.",
    generateValues: squareHoleState,
    solve: (parameters: Men001Parameters) => {
      const side = positive(parameters, "side");
      const radius = positive(parameters, "radius");
      const outerPerimeter = 4 * side;
      const innerCircumference = (2 * PI_NUMERATOR * radius) / PI_DENOMINATOR;
      const perimeter = outerPerimeter + innerCircumference;
      return integerResult(
        parameters,
        "LENGTH",
        perimeter,
        "P=4s+2πr",
        { side, radius, outerPerimeter, innerCircumference, perimeter },
        true,
      );
    },
    explain: (_parameters: Men001Parameters, solver: Men001SolverResult) => [
      "The land is bordered by the outside of the square and by the edge of the circular hole.",
      "Add the square perimeter and the circle circumference.",
      `P = ${solver.workingValues.outerPerimeter} + ${solver.workingValues.innerCircumference}.`,
      `P = ${solver.workingValues.perimeter}.`,
      `The two boundaries together measure ${solver.answer}.`,
    ],
  },

  findRegularHexagonSideFromPerimeter: {
    reasoningDescription:
      "A regular hexagon has six equal sides, so divide its perimeter equally among the six sides.",
    generateValues: (seed: string) => hexagonState(seed, "hexagon-side-from-perimeter"),
    solve: (parameters: Men001Parameters) => {
      const perimeter = positive(parameters, "perimeter");
      const side = perimeter / 6;
      return integerResult(
        parameters,
        "LENGTH",
        side,
        "a=P/6",
        { perimeter, side },
      );
    },
    explain: (_parameters: Men001Parameters, solver: Men001SolverResult) => [
      "All six sides of a regular hexagon are equal.",
      "Divide the complete perimeter by six.",
      `a = ${solver.workingValues.perimeter} / 6.`,
      `a = ${solver.workingValues.side}.`,
      `Each side measures ${solver.answer}.`,
    ],
  },

  findRegularHexagonAreaFromPerimeter: {
    reasoningDescription:
      "Recover the common side from the perimeter, then use the exact regular-hexagon area formula.",
    generateValues: (seed: string) => hexagonState(seed, "hexagon-area-from-perimeter"),
    solve: (parameters: Men001Parameters) => {
      const perimeter = positive(parameters, "perimeter");
      const side = perimeter / 6;
      const hexagonAreaCoefficient = (3 * side * side) / 2;
      return surdAreaResult(
        parameters,
        hexagonAreaCoefficient,
        "a=P/6; A=(3√3/2)a²",
        { perimeter, side, hexagonAreaCoefficient },
      );
    },
    explain: (_parameters: Men001Parameters, solver: Men001SolverResult) => [
      "First divide the regular hexagon's perimeter equally among its six sides.",
      `a = ${solver.workingValues.perimeter} / 6 = ${solver.workingValues.side}.`,
      "Use A = (3√3/2)a² for the exact area.",
      `A = ${solver.workingValues.hexagonAreaCoefficient}√3.`,
      `The regular hexagon has exact area ${solver.answer}.`,
    ],
  },

  findStadiumStraightLengthFromPerimeter: {
    reasoningDescription:
      "Remove the circumference formed by the two semicircular ends, then split the remaining boundary between the two equal straight sides.",
    generateValues: stadiumState,
    solve: (parameters: Men001Parameters) => {
      const perimeter = positive(parameters, "perimeter");
      const breadth = positive(parameters, "breadth");
      const circumference = (PI_NUMERATOR * breadth) / PI_DENOMINATOR;
      const straightLength = (perimeter - circumference) / 2;
      return integerResult(
        parameters,
        "LENGTH",
        straightLength,
        "l=(P-πd)/2",
        { perimeter, breadth, diameter: breadth, circumference, straightLength },
        true,
      );
    },
    explain: (_parameters: Men001Parameters, solver: Men001SolverResult) => [
      "The two semicircular ends together contribute one full circumference.",
      "Subtract that curved boundary from the total, then divide the remainder between the two straight sides.",
      `l = (${solver.workingValues.perimeter} - ${solver.workingValues.circumference}) / 2.`,
      `l = ${solver.workingValues.straightLength}.`,
      `Each straight side is ${solver.answer} long.`,
    ],
  },

  findCircleRadiusFromCircleMinusSquareShadedArea: {
    reasoningDescription:
      "For a square inscribed in a circle, subtract the square area 2r² from the circle area πr² and solve the resulting shaded-area equation for r.",
    generateValues: reverseCircleSquareState,
    solve: (parameters: Men001Parameters) => {
      const area = positive(parameters, "area");
      const radiusSquare = (PI_DENOMINATOR * area) / 8;
      const radius = Math.sqrt(radiusSquare);
      const diameter = 2 * radius;
      const circleArea = (PI_NUMERATOR * radiusSquare) / PI_DENOMINATOR;
      const squareArea = (diameter * diameter) / 2;
      return integerResult(
        parameters,
        "LENGTH",
        radius,
        "A=(π-2)r²=(8/7)r²",
        { area, radiusSquare, radius, diameter, circleArea, squareArea },
        true,
      );
    },
    explain: (_parameters: Men001Parameters, solver: Men001SolverResult) => [
      "The inscribed square has diagonal 2r, so its area is 2r².",
      "The shaded part is therefore (22/7 - 2)r² = (8/7)r².",
      `r² = 7 × ${solver.workingValues.area} / 8 = ${solver.workingValues.radiusSquare}.`,
      `r = ${solver.workingValues.radius}.`,
      `The circle's radius is ${solver.answer}.`,
    ],
  },
} as const satisfies Record<string, Definition>;
