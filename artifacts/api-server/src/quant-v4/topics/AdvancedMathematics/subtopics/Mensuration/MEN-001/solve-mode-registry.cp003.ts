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
  solve: (p: Men001Parameters) => Men001SolverResult;
  explain: (p: Men001Parameters, s: Men001SolverResult) => string[];
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

function value(p: Men001Parameters, key: keyof Values) {
  const candidate = p.values[key];
  if (typeof candidate !== "number" || !Number.isFinite(candidate) || candidate <= 0) {
    throw new Error(`MEN-001 CP-003 requires positive ${String(key)}.`);
  }
  return candidate;
}

function piTimes(candidate: number) {
  const result = (PN * candidate) / PD;
  if (!Number.isInteger(result)) {
    throw new Error(`MEN-001 CP-003 state violates π = ${P}: ${candidate}.`);
  }
  return result;
}

function unitFor(policy: Men001UnitPolicy): Men001SolverResult["unit"] {
  return {
    CENTIMETRES: "cm",
    METRES: "m",
    SQUARE_CENTIMETRES: "cm²",
    SQUARE_METRES: "m²",
    RUPEES: "₹",
    DEGREES: "°",
  }[policy];
}

function measured(
  p: Men001Parameters,
  answerDimension: Exclude<Men001AnswerDimension, "COST" | "ANGLE">,
  answerValue: number,
  equation: string,
  workingValues: Record<string, string | number>,
): Men001SolverResult {
  if (!Number.isInteger(answerValue)) throw new Error(`MEN-001 CP-003 expected integer answer; received ${answerValue}.`);
  const unit = unitFor(p.unitPolicy);
  if (!["cm", "m", "cm²", "m²"].includes(unit)) throw new Error(`Invalid CP-003 unit ${unit}.`);
  const canonicalAnswer: Men001CanonicalAnswer = {
    kind: "unit",
    value: answerValue,
    unit,
    precision: 0,
    display: `${answerValue} ${unit}`,
    rounding: "exact",
    metadata: { answerDimension, exactKind: "INTEGER", piPolicy: P },
  };
  return {
    exactAnswer: { kind: "INTEGER", value: answerValue },
    canonicalAnswer,
    answer: canonicalAnswer.display,
    answerDimension,
    unit,
    equation,
    workingValues: { ...workingValues, piPolicy: P },
  };
}

function angle(
  answerValue: number,
  equation: string,
  workingValues: Record<string, string | number>,
): Men001SolverResult {
  if (!Number.isInteger(answerValue)) throw new Error(`MEN-001 CP-003 expected integer angle; received ${answerValue}.`);
  const canonicalAnswer: Men001CanonicalAnswer = {
    kind: "unit",
    value: answerValue,
    unit: "°",
    precision: 0,
    display: `${answerValue}°`,
    rounding: "exact",
    metadata: { answerDimension: "ANGLE", exactKind: "INTEGER", piPolicy: P },
  };
  return {
    exactAnswer: { kind: "INTEGER", value: answerValue },
    canonicalAnswer,
    answer: canonicalAnswer.display,
    answerDimension: "ANGLE",
    unit: "°",
    equation,
    workingValues: { ...workingValues, piPolicy: P },
  };
}

function explanation(
  first: string,
  formula: string,
  substitution: string,
  evaluation: string,
  answer: string,
) {
  return [first, formula, substitution, evaluation, answer];
}

const RADII = [7, 14, 21, 28, 35] as const;
const ARC_STATES = [[7, 90], [14, 45], [21, 60], [28, 135], [35, 72], [14, 180]] as const;
const SECTOR_STATES = [[14, 90], [21, 120], [28, 45], [14, 180], [35, 72], [28, 135]] as const;
const ANNULUS_STATES = [[14, 7], [21, 14], [28, 21], [35, 14], [42, 28]] as const;
const WHEEL_STATES = [[7, 5], [14, 8], [21, 6], [28, 10], [35, 12]] as const;

function circle(seed: string, salt: string) {
  const radius = pick(RADII, seed, salt);
  return {
    radius,
    diameter: 2 * radius,
    circumference: piTimes(2 * radius),
    area: piTimes(radius * radius),
  };
}

function arc(seed: string, salt: string) {
  const [radius, angleDegrees] = pick(ARC_STATES, seed, salt);
  const circumference = piTimes(2 * radius);
  const fullArea = piTimes(radius * radius);
  const arcLength = (circumference * angleDegrees) / 360;
  if (!Number.isInteger(arcLength)) throw new Error("CP-003 arc length must be integral.");
  return { radius, angleDegrees, circumference, fullArea, arcLength, sectorArea: (fullArea * angleDegrees) / 360 };
}

function sector(seed: string, salt: string) {
  const [radius, angleDegrees] = pick(SECTOR_STATES, seed, salt);
  const circumference = piTimes(2 * radius);
  const fullArea = piTimes(radius * radius);
  const arcLength = (circumference * angleDegrees) / 360;
  const sectorArea = (fullArea * angleDegrees) / 360;
  if (!Number.isInteger(arcLength) || !Number.isInteger(sectorArea)) throw new Error("CP-003 sector measures must be integral.");
  return { radius, angleDegrees, circumference, fullArea, arcLength, sectorArea };
}

function annulus(seed: string, salt: string) {
  const [outerRadius, innerRadius] = pick(ANNULUS_STATES, seed, salt);
  const outerArea = piTimes(outerRadius * outerRadius);
  const innerArea = piTimes(innerRadius * innerRadius);
  return { outerRadius, innerRadius, outerArea, innerArea, area: outerArea - innerArea };
}

function wheel(seed: string) {
  const [radius, revolutions] = pick(WHEEL_STATES, seed, "wheel");
  const diameter = 2 * radius;
  const circumference = piTimes(2 * radius);
  return { radius, revolutions, diameter, circumference, distance: circumference * revolutions };
}

export const MEN_001_CP003_SOLVE_MODE_REGISTRY = {
  findCircleCircumferenceFromRadius: {
    reasoningDescription: "Use C = 2πr.",
    generateValues: (seed) => circle(seed, "circumference-radius"),
    solve: (p) => {
      const radius = value(p, "radius");
      const circumference = piTimes(2 * radius);
      return measured(p, "LENGTH", circumference, "C=2πr", { radius, diameter: 2 * radius, circumference });
    },
    explain: (_p, s) => explanation("The boundary length of a circle is its circumference.", "Use C = 2πr.", `C = 2 × ${P} × ${s.workingValues.radius}.`, `C = ${s.workingValues.circumference}.`, `Therefore, the circumference is ${s.answer}.`),
  },
  findCircleCircumferenceFromDiameter: {
    reasoningDescription: "Use C = πd.",
    generateValues: (seed) => circle(seed, "circumference-diameter"),
    solve: (p) => {
      const diameter = value(p, "diameter");
      const circumference = piTimes(diameter);
      return measured(p, "LENGTH", circumference, "C=πd", { radius: diameter / 2, diameter, circumference });
    },
    explain: (_p, s) => explanation("The diameter is already given.", "Use C = πd.", `C = ${P} × ${s.workingValues.diameter}.`, `C = ${s.workingValues.circumference}.`, `Therefore, the circumference is ${s.answer}.`),
  },
  findCircleAreaFromRadius: {
    reasoningDescription: "Use A = πr².",
    generateValues: (seed) => circle(seed, "area-radius"),
    solve: (p) => {
      const radius = value(p, "radius");
      const radiusSquare = radius * radius;
      const areaValue = piTimes(radiusSquare);
      return measured(p, "AREA", areaValue, "A=πr²", { radius, radiusSquare, area: areaValue, circumference: piTimes(2 * radius) });
    },
    explain: (_p, s) => explanation("The area of a circle depends on the square of its radius.", "Use A = πr².", `A = ${P} × ${s.workingValues.radiusSquare}.`, `A = ${s.workingValues.area}.`, `Therefore, the area is ${s.answer}.`),
  },
  findCircleRadiusFromCircumference: {
    reasoningDescription: "Rearrange C = 2πr.",
    generateValues: (seed) => circle(seed, "radius-circumference"),
    solve: (p) => {
      const circumference = value(p, "circumference");
      const radius = (circumference * PD) / (2 * PN);
      return measured(p, "LENGTH", radius, "r=C/(2π)", { circumference, radius, diameter: 2 * radius });
    },
    explain: (_p, s) => explanation("Start from the circumference formula.", "r = C ÷ (2π).", `r = ${s.workingValues.circumference} ÷ (2 × ${P}).`, `r = ${s.workingValues.radius}.`, `Therefore, the radius is ${s.answer}.`),
  },
  findCircleRadiusFromArea: {
    reasoningDescription: "Rearrange A = πr² and take the positive square root.",
    generateValues: (seed) => circle(seed, "radius-area"),
    solve: (p) => {
      const areaValue = value(p, "area");
      const radiusSquare = (areaValue * PD) / PN;
      const radius = Math.sqrt(radiusSquare);
      return measured(p, "LENGTH", radius, "r=√(A/π)", { area: areaValue, radiusSquare, radius });
    },
    explain: (_p, s) => explanation("Use A = πr².", "So r² = A ÷ π.", `r² = ${s.workingValues.area} ÷ (${P}) = ${s.workingValues.radiusSquare}.`, `r = √${s.workingValues.radiusSquare} = ${s.workingValues.radius}.`, `Therefore, the radius is ${s.answer}.`),
  },
  findCircleAreaFromCircumference: {
    reasoningDescription: "Recover the radius, then use A = πr².",
    generateValues: (seed) => circle(seed, "area-circumference"),
    solve: (p) => {
      const circumference = value(p, "circumference");
      const radius = (circumference * PD) / (2 * PN);
      const areaValue = piTimes(radius * radius);
      return measured(p, "AREA", areaValue, "r=C/(2π); A=πr²", { circumference, radius, radiusSquare: radius * radius, area: areaValue });
    },
    explain: (_p, s) => explanation("First recover the radius from the circumference.", "r = C ÷ (2π), then A = πr².", `r = ${s.workingValues.radius}.`, `A = ${P} × ${s.workingValues.radiusSquare} = ${s.workingValues.area}.`, `Therefore, the area is ${s.answer}.`),
  },
  findSemicircleArea: {
    reasoningDescription: "Take half of the full circle area.",
    generateValues: (seed) => circle(seed, "semicircle-area"),
    solve: (p) => {
      const radius = value(p, "radius");
      const fullArea = piTimes(radius * radius);
      const areaValue = fullArea / 2;
      return measured(p, "AREA", areaValue, "A=πr²/2", { radius, fullArea, area: areaValue, semicircleArc: piTimes(radius) });
    },
    explain: (_p, s) => explanation("A semicircle is half of a circle.", "Use A = πr²/2.", `Full area = ${s.workingValues.fullArea}.`, `Semicircle area = ${s.workingValues.fullArea} ÷ 2 = ${s.workingValues.area}.`, `Therefore, the area is ${s.answer}.`),
  },
  findSemicirclePerimeter: {
    reasoningDescription: "Add the curved semicircle and the diameter.",
    generateValues: (seed) => circle(seed, "semicircle-perimeter"),
    solve: (p) => {
      const radius = value(p, "radius");
      const semicircleArc = piTimes(radius);
      const diameter = 2 * radius;
      const perimeter = semicircleArc + diameter;
      return measured(p, "LENGTH", perimeter, "P=πr+2r", { radius, semicircleArc, diameter, perimeter });
    },
    explain: (_p, s) => explanation("The total boundary includes the arc and the diameter.", "Use P = πr + 2r.", `Arc = ${s.workingValues.semicircleArc}; diameter = ${s.workingValues.diameter}.`, `P = ${s.workingValues.semicircleArc} + ${s.workingValues.diameter} = ${s.workingValues.perimeter}.`, `Therefore, the perimeter is ${s.answer}.`),
  },
  findQuadrantArea: {
    reasoningDescription: "Take one fourth of the circle area.",
    generateValues: (seed) => circle(seed, "quadrant-area"),
    solve: (p) => {
      const radius = value(p, "radius");
      const fullArea = piTimes(radius * radius);
      const areaValue = fullArea / 4;
      return measured(p, "AREA", areaValue, "A=πr²/4", { radius, fullArea, area: areaValue, circumference: piTimes(2 * radius) });
    },
    explain: (_p, s) => explanation("A quadrant is one fourth of a circle.", "Use A = πr²/4.", `Full area = ${s.workingValues.fullArea}.`, `Quadrant area = ${s.workingValues.fullArea} ÷ 4 = ${s.workingValues.area}.`, `Therefore, the area is ${s.answer}.`),
  },
  findQuadrantPerimeter: {
    reasoningDescription: "Add a quarter-circle arc and two radii.",
    generateValues: (seed) => circle(seed, "quadrant-perimeter"),
    solve: (p) => {
      const radius = value(p, "radius");
      const circumference = piTimes(2 * radius);
      const quadrantArc = circumference / 4;
      const perimeter = quadrantArc + 2 * radius;
      return measured(p, "LENGTH", perimeter, "P=C/4+2r", { radius, circumference, quadrantArc, perimeter });
    },
    explain: (_p, s) => explanation("The boundary contains one arc and two radii.", "Use P = C/4 + 2r.", `Arc = ${s.workingValues.quadrantArc}.`, `P = ${s.workingValues.quadrantArc} + 2 × ${s.workingValues.radius} = ${s.workingValues.perimeter}.`, `Therefore, the perimeter is ${s.answer}.`),
  },
  findArcLength: {
    reasoningDescription: "Take the central-angle fraction of the circumference.",
    generateValues: (seed) => arc(seed, "arc-length"),
    solve: (p) => {
      const radius = value(p, "radius");
      const angleDegrees = value(p, "angleDegrees");
      const circumference = piTimes(2 * radius);
      const arcLength = (circumference * angleDegrees) / 360;
      return measured(p, "LENGTH", arcLength, "L=(θ/360)2πr", { radius, angleDegrees, circumference, arcLength });
    },
    explain: (_p, s) => explanation("The arc has the same fraction of the circumference as its angle has of 360°.", "Use L = (θ/360) × 2πr.", `Circumference = ${s.workingValues.circumference}.`, `L = (${s.workingValues.angleDegrees}/360) × ${s.workingValues.circumference} = ${s.workingValues.arcLength}.`, `Therefore, the arc length is ${s.answer}.`),
  },
  findSectorArea: {
    reasoningDescription: "Take the central-angle fraction of the circle area.",
    generateValues: (seed) => sector(seed, "sector-area"),
    solve: (p) => {
      const radius = value(p, "radius");
      const angleDegrees = value(p, "angleDegrees");
      const fullArea = piTimes(radius * radius);
      const circumference = piTimes(2 * radius);
      const sectorArea = (fullArea * angleDegrees) / 360;
      const arcLength = (circumference * angleDegrees) / 360;
      return measured(p, "AREA", sectorArea, "A=(θ/360)πr²", { radius, angleDegrees, fullArea, circumference, sectorArea, arcLength });
    },
    explain: (_p, s) => explanation("The sector has the same fraction of the circle as its angle has of 360°.", "Use A = (θ/360) × πr².", `Full area = ${s.workingValues.fullArea}.`, `A = (${s.workingValues.angleDegrees}/360) × ${s.workingValues.fullArea} = ${s.workingValues.sectorArea}.`, `Therefore, the sector area is ${s.answer}.`),
  },
  findSectorPerimeter: {
    reasoningDescription: "Add the sector arc and two radii.",
    generateValues: (seed) => sector(seed, "sector-perimeter"),
    solve: (p) => {
      const radius = value(p, "radius");
      const angleDegrees = value(p, "angleDegrees");
      const circumference = piTimes(2 * radius);
      const arcLength = (circumference * angleDegrees) / 360;
      const perimeter = arcLength + 2 * radius;
      return measured(p, "LENGTH", perimeter, "P=arc+2r", { radius, angleDegrees, circumference, arcLength, perimeter });
    },
    explain: (_p, s) => explanation("The sector perimeter includes the arc and two radii.", "Use P = arc length + 2r.", `Arc = ${s.workingValues.arcLength}.`, `P = ${s.workingValues.arcLength} + 2 × ${s.workingValues.radius} = ${s.workingValues.perimeter}.`, `Therefore, the perimeter is ${s.answer}.`),
  },
  findCentralAngleFromArcLength: {
    reasoningDescription: "Compare arc length with the full circumference.",
    generateValues: (seed) => arc(seed, "angle-from-arc"),
    solve: (p) => {
      const arcLength = value(p, "arcLength");
      const radius = value(p, "radius");
      const circumference = piTimes(2 * radius);
      const angleDegrees = (arcLength * 360) / circumference;
      return angle(angleDegrees, "θ=(L/C)360", { arcLength, radius, circumference, angleDegrees });
    },
    explain: (_p, s) => explanation("The arc fraction equals the central-angle fraction.", "Use θ = (arc length ÷ circumference) × 360°.", `Circumference = ${s.workingValues.circumference}.`, `θ = (${s.workingValues.arcLength}/${s.workingValues.circumference}) × 360° = ${s.workingValues.angleDegrees}°.`, `Therefore, the central angle is ${s.answer}.`),
  },
  findCentralAngleFromSectorArea: {
    reasoningDescription: "Compare sector area with the full circle area.",
    generateValues: (seed) => sector(seed, "angle-from-sector"),
    solve: (p) => {
      const sectorArea = value(p, "sectorArea");
      const radius = value(p, "radius");
      const fullArea = piTimes(radius * radius);
      const angleDegrees = (sectorArea * 360) / fullArea;
      return angle(angleDegrees, "θ=(Asector/Acircle)360", { sectorArea, radius, fullArea, angleDegrees });
    },
    explain: (_p, s) => explanation("The sector-area fraction equals the central-angle fraction.", "Use θ = (sector area ÷ full area) × 360°.", `Full area = ${s.workingValues.fullArea}.`, `θ = (${s.workingValues.sectorArea}/${s.workingValues.fullArea}) × 360° = ${s.workingValues.angleDegrees}°.`, `Therefore, the central angle is ${s.answer}.`),
  },
  findAnnulusArea: {
    reasoningDescription: "Subtract the inner circle from the outer circle.",
    generateValues: (seed) => annulus(seed, "annulus-area"),
    solve: (p) => {
      const outerRadius = value(p, "outerRadius");
      const innerRadius = value(p, "innerRadius");
      const outerArea = piTimes(outerRadius * outerRadius);
      const innerArea = piTimes(innerRadius * innerRadius);
      const areaValue = outerArea - innerArea;
      return measured(p, "AREA", areaValue, "A=π(R²-r²)", { outerRadius, innerRadius, outerArea, innerArea, area: areaValue });
    },
    explain: (_p, s) => explanation("A ring is the outer circle minus the inner circle.", "Use A = π(R² − r²).", `Outer area = ${s.workingValues.outerArea}; inner area = ${s.workingValues.innerArea}.`, `A = ${s.workingValues.outerArea} − ${s.workingValues.innerArea} = ${s.workingValues.area}.`, `Therefore, the area is ${s.answer}.`),
  },
  findOuterRadiusFromAnnulusArea: {
    reasoningDescription: "Use R² = A/π + r².",
    generateValues: (seed) => annulus(seed, "outer-radius"),
    solve: (p) => {
      const areaValue = value(p, "area");
      const innerRadius = value(p, "innerRadius");
      const radiusSquareDifference = (areaValue * PD) / PN;
      const outerRadiusSquare = radiusSquareDifference + innerRadius * innerRadius;
      const outerRadius = Math.sqrt(outerRadiusSquare);
      return measured(p, "LENGTH", outerRadius, "R=√(A/π+r²)", { area: areaValue, innerRadius, radiusSquareDifference, outerRadiusSquare, outerRadius });
    },
    explain: (_p, s) => explanation("Start from A = π(R² − r²).", "So R² = A/π + r².", `R² − r² = ${s.workingValues.radiusSquareDifference}.`, `R² = ${s.workingValues.outerRadiusSquare}; R = ${s.workingValues.outerRadius}.`, `Therefore, the outer radius is ${s.answer}.`),
  },
  findWheelDistanceFromRevolutions: {
    reasoningDescription: "Multiply one circumference by the revolution count.",
    generateValues: (seed) => wheel(seed),
    solve: (p) => {
      const radius = value(p, "radius");
      const revolutions = value(p, "revolutions");
      const diameter = 2 * radius;
      const circumference = piTimes(2 * radius);
      const distance = circumference * revolutions;
      return measured(p, "LENGTH", distance, "D=(2πr)n", { radius, revolutions, diameter, circumference, distance });
    },
    explain: (_p, s) => explanation("One revolution covers one circumference.", "Use distance = circumference × revolutions.", `Circumference = ${s.workingValues.circumference}.`, `Distance = ${s.workingValues.circumference} × ${s.workingValues.revolutions} = ${s.workingValues.distance}.`, `Therefore, the distance is ${s.answer}.`),
  },
} as const satisfies Record<string, Definition>;
