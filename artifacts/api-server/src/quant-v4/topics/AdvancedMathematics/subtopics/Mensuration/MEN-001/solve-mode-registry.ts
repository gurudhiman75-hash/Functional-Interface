import type {
  Men001AnswerDimension,
  Men001CanonicalAnswer,
  Men001Parameters,
  Men001SolverResult,
  Men001UnitPolicy,
} from "./types";

type Values = Men001Parameters["values"];

interface Men001SolveModeDefinition {
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
  if (values.length === 0) throw new Error(`MEN-001 cannot pick from an empty list: ${salt}`);
  return values[seedHash(`${seed}:${salt}`) % values.length]!;
}

const BASE_HEIGHT_STATES = [
  [12, 9], [16, 11], [18, 14], [24, 15], [28, 18], [30, 16], [32, 21], [36, 25],
] as const;
const HERON_STATES = [
  [13, 14, 15], [5, 5, 6], [5, 12, 13], [10, 10, 12], [13, 13, 10], [6, 8, 10], [15, 20, 25],
] as const;
const RIGHT_TRIANGLE_STATES = [[6, 8], [9, 12], [12, 16], [15, 20], [18, 24], [21, 28]] as const;
const ISOSCELES_STATES = [[5, 6, 4], [10, 12, 8], [13, 10, 12], [17, 16, 15], [25, 14, 24], [25, 30, 20]] as const;
const RATIO_STATES = [[3, 4, 5], [5, 5, 6], [5, 12, 13], [13, 14, 15]] as const;

function baseHeightState(seed: string, salt: string) {
  const [base, height] = pick(BASE_HEIGHT_STATES, seed, salt);
  return { base, height, area: (base * height) / 2 };
}

function ratioState(seed: string) {
  const [ratioA, ratioB, ratioC] = pick(RATIO_STATES, seed, "ratio-state");
  const scale = pick([2, 3, 4, 5, 6] as const, seed, "ratio-scale");
  const sideA = ratioA * scale;
  const sideB = ratioB * scale;
  const sideC = ratioC * scale;
  return { ratioA, ratioB, ratioC, scale, sideA, sideB, sideC, perimeter: sideA + sideB + sideC };
}

function requireValue(parameters: Men001Parameters, key: keyof Values) {
  const value = parameters.values[key];
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    throw new Error(`MEN-001 requires a positive finite ${String(key)}.`);
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
  if (!Number.isInteger(value)) throw new Error(`MEN-001 expected an integer ${dimension} answer; received ${value}.`);
  const canonicalAnswer: Men001CanonicalAnswer = {
    kind: "unit", value, unit, precision: 0, display: `${value} ${unit}`, rounding: "exact",
    metadata: { dimension, exactKind: "INTEGER" },
  };
  return { exactAnswer: { kind: "INTEGER", value }, canonicalAnswer, answer: canonicalAnswer.display };
}

function currencyAnswer(value: number): Pick<Men001SolverResult, "exactAnswer" | "canonicalAnswer" | "answer"> {
  if (!Number.isInteger(value)) throw new Error(`MEN-001 expected an integer cost answer; received ${value}.`);
  const canonicalAnswer: Men001CanonicalAnswer = {
    kind: "currency", value, currency: "₹", precision: 0, display: `₹${value}`, rounding: "exact",
    metadata: { dimension: "COST", exactKind: "INTEGER" },
  };
  return { exactAnswer: { kind: "INTEGER", value }, canonicalAnswer, answer: canonicalAnswer.display };
}

function surdAreaAnswer(coefficient: number, unit: "cm²" | "m²") {
  if (!Number.isInteger(coefficient) || coefficient <= 0) throw new Error("MEN-001 requires a positive integral exact surd coefficient.");
  const latexUnit = unit === "cm²" ? "\\text{cm}^{2}" : "\\text{m}^{2}";
  const latexValue = `${coefficient}\\sqrt{3}\\,${latexUnit}`;
  const canonicalAnswer: Men001CanonicalAnswer = {
    kind: "symbolic", value: latexValue, rendered: `$$${latexValue}$$`, display: `${coefficient}√3 ${unit}`,
    rounding: "exact", metadata: { dimension: "AREA", exactKind: "SURD", radicand: 3, unit },
  };
  return {
    exactAnswer: { kind: "SURD", coefficientNumerator: coefficient, coefficientDenominator: 1, radicand: 3 } as const,
    canonicalAnswer,
    answer: canonicalAnswer.rendered,
  };
}

function lengthUnit(parameters: Men001Parameters): "cm" | "m" {
  const unit = unitForPolicy(parameters.unitPolicy);
  if (unit !== "cm" && unit !== "m") throw new Error(`MEN-001 expected a length unit policy; received ${parameters.unitPolicy}.`);
  return unit;
}

function areaUnit(parameters: Men001Parameters): "cm²" | "m²" {
  const unit = unitForPolicy(parameters.unitPolicy);
  if (unit !== "cm²" && unit !== "m²") throw new Error(`MEN-001 expected an area unit policy; received ${parameters.unitPolicy}.`);
  return unit;
}

function heronValues(sideA: number, sideB: number, sideC: number) {
  if (sideA + sideB <= sideC || sideA + sideC <= sideB || sideB + sideC <= sideA) {
    throw new Error("MEN-001 Heron state violates triangle inequality.");
  }
  const semiperimeter = (sideA + sideB + sideC) / 2;
  const factorA = semiperimeter - sideA;
  const factorB = semiperimeter - sideB;
  const factorC = semiperimeter - sideC;
  const radicand = semiperimeter * factorA * factorB * factorC;
  const area = Math.sqrt(radicand);
  if (!Number.isInteger(area)) throw new Error(`MEN-001 expected an exact integral Heron area; received √${radicand}.`);
  return { semiperimeter, factorA, factorB, factorC, radicand, area };
}

function heronExplanation(v: Record<string, string | number>, answer: string, prefix: string[] = []) {
  return [
    ...prefix,
    `The actual side lengths are ${v.sideA}, ${v.sideB} and ${v.sideC}.`,
    `Semiperimeter: s = (${v.sideA} + ${v.sideB} + ${v.sideC})/2 = ${v.semiperimeter}.`,
    "Heron's formula is A = √[s(s − a)(s − b)(s − c)].",
    `Substitution gives A = √[${v.semiperimeter} × ${v.factorA} × ${v.factorB} × ${v.factorC}].`,
    `Therefore, A = √${v.radicand} = ${v.area}.`,
    `Hence, the required area is ${answer}.`,
  ];
}

export const MEN_001_SOLVE_MODE_REGISTRY = {
  findTriangleAreaBaseHeight: {
    reasoningDescription: "Use one-half times base times perpendicular height.",
    generateValues: (seed) => baseHeightState(seed, "base-height"),
    solve: (p) => {
      const base = requireValue(p, "base"); const height = requireValue(p, "height"); const area = (base * height) / 2; const unit = areaUnit(p);
      return { ...integerMeasure(area, unit, "AREA"), answerDimension: "AREA", unit, equation: `A = \\frac{1}{2}bh = \\frac{1}{2}\\times ${base}\\times ${height}`, workingValues: { base, height, area } };
    },
    explain: (_p, s) => { const v = s.workingValues; return ["The stated height is perpendicular to the base.", "Area of a triangle = 1/2 × base × perpendicular height.", `Substitution: A = 1/2 × ${v.base} × ${v.height}.`, `So A = ${v.area}.`, `Therefore, the required area is ${s.answer}.`, "A square unit is used because area is two-dimensional."]; },
  },
  findMissingHeightFromAreaAndBase: {
    reasoningDescription: "Rearrange the triangle-area relation to isolate the height.",
    generateValues: (seed) => baseHeightState(seed, "reverse-height"),
    solve: (p) => { const area = requireValue(p, "area"); const base = requireValue(p, "base"); const height = (2 * area) / base; const unit = lengthUnit(p); return { ...integerMeasure(height, unit, "LENGTH"), answerDimension: "LENGTH", unit, equation: `h = \\frac{2A}{b} = \\frac{2\\times ${area}}{${base}}`, workingValues: { area, base, height } }; },
    explain: (_p, s) => { const v = s.workingValues; return ["The area and base are known, while the perpendicular height is required.", "From A = 1/2 × b × h, isolate h: h = 2A/b.", `Substitution: h = (2 × ${v.area})/${v.base}.`, `Thus h = ${v.height}.`, `Therefore, the perpendicular height is ${s.answer}.`]; },
  },
  findMissingBaseFromAreaAndHeight: {
    reasoningDescription: "Rearrange the triangle-area relation to isolate the base.",
    generateValues: (seed) => baseHeightState(seed, "reverse-base"),
    solve: (p) => { const area = requireValue(p, "area"); const height = requireValue(p, "height"); const base = (2 * area) / height; const unit = lengthUnit(p); return { ...integerMeasure(base, unit, "LENGTH"), answerDimension: "LENGTH", unit, equation: `b = \\frac{2A}{h} = \\frac{2\\times ${area}}{${height}}`, workingValues: { area, height, base } }; },
    explain: (_p, s) => { const v = s.workingValues; return ["The area and perpendicular height are known.", "From A = 1/2 × b × h, isolate b: b = 2A/h.", `Substitution: b = (2 × ${v.area})/${v.height}.`, `Thus b = ${v.base}.`, `Therefore, the required base is ${s.answer}.`]; },
  },
  findTriangleAreaHeron: {
    reasoningDescription: "Use Heron's formula because all three side lengths are known.",
    generateValues: (seed) => { const [sideA, sideB, sideC] = pick(HERON_STATES, seed, "heron-triple"); return { sideA, sideB, sideC }; },
    solve: (p) => { const sideA = requireValue(p, "sideA"); const sideB = requireValue(p, "sideB"); const sideC = requireValue(p, "sideC"); const h = heronValues(sideA, sideB, sideC); const unit = areaUnit(p); return { ...integerMeasure(h.area, unit, "AREA"), answerDimension: "AREA", unit, equation: `A = \\sqrt{s(s-a)(s-b)(s-c)}`, workingValues: { sideA, sideB, sideC, ...h } }; },
    explain: (_p, s) => heronExplanation(s.workingValues, s.answer, ["All three sides are given, so Heron's formula applies."]),
  },
  findRightTriangleAreaFromLegs: {
    reasoningDescription: "Treat the perpendicular legs as the base and height.",
    generateValues: (seed) => { const [legA, legB] = pick(RIGHT_TRIANGLE_STATES, seed, "right-legs"); return { legA, legB, area: (legA * legB) / 2 }; },
    solve: (p) => { const legA = requireValue(p, "legA"); const legB = requireValue(p, "legB"); const area = (legA * legB) / 2; const unit = areaUnit(p); return { ...integerMeasure(area, unit, "AREA"), answerDimension: "AREA", unit, equation: `A = \\frac{1}{2}\\times ${legA}\\times ${legB}`, workingValues: { legA, legB, area } }; },
    explain: (_p, s) => { const v = s.workingValues; return ["The two given sides are perpendicular, so they are the base and height.", "Area = 1/2 × product of the perpendicular sides.", `Substitution: A = 1/2 × ${v.legA} × ${v.legB}.`, `So A = ${v.area}.`, `Therefore, the area is ${s.answer}.`]; },
  },
  findEquilateralTriangleArea: {
    reasoningDescription: "Use the exact equilateral-triangle area formula.",
    generateValues: (seed) => { const side = pick([4, 6, 8, 10, 12, 14, 16, 18] as const, seed, "equilateral-side"); return { side, areaCoefficient: (side * side) / 4, perimeter: 3 * side }; },
    solve: (p) => { const side = requireValue(p, "side"); const coefficient = (side * side) / 4; const unit = areaUnit(p); return { ...surdAreaAnswer(coefficient, unit), answerDimension: "AREA", unit, equation: `A = \\frac{\\sqrt{3}}{4}a^2 = \\frac{\\sqrt{3}}{4}\\times ${side}^2`, workingValues: { side, coefficient, radicand: 3 } }; },
    explain: (_p, s) => { const v = s.workingValues; return ["All sides are equal, so use A = (√3/4)a².", `Substitution: A = (√3/4) × ${v.side}².`, `The coefficient simplifies to ${v.coefficient}.`, `Therefore, the exact area is ${s.answer}.`, "The √3 term remains exact because no decimal approximation is requested."]; },
  },
  findEquilateralPerimeterFromArea: {
    reasoningDescription: "Recover the side from exact equilateral area, then multiply by three.",
    generateValues: (seed) => { const side = pick([6, 8, 10, 12, 14, 16, 18] as const, seed, "equilateral-reverse-area"); return { side, areaCoefficient: (side * side) / 4, perimeter: 3 * side }; },
    solve: (p) => { const areaCoefficient = requireValue(p, "areaCoefficient"); const side = 2 * Math.sqrt(areaCoefficient); const perimeter = 3 * side; const unit = lengthUnit(p); return { ...integerMeasure(perimeter, unit, "LENGTH"), answerDimension: "LENGTH", unit, equation: `${areaCoefficient}\\sqrt{3} = \\frac{\\sqrt{3}}{4}a^2`, workingValues: { areaCoefficient, side, perimeter } }; },
    explain: (_p, s) => { const v = s.workingValues; return ["For an equilateral triangle, A = (√3/4)a².", `Comparing ${v.areaCoefficient}√3 with (√3/4)a² gives a²/4 = ${v.areaCoefficient}.`, `Hence a = ${v.side}.`, `Perimeter = 3a = 3 × ${v.side} = ${v.perimeter}.`, `Therefore, the required perimeter is ${s.answer}.`]; },
  },
  findEquilateralSideFromPerimeter: {
    reasoningDescription: "Divide the perimeter equally among the three sides.",
    generateValues: (seed) => { const side = pick([6, 8, 10, 12, 14, 16, 18, 20] as const, seed, "equilateral-perimeter"); return { side, perimeter: 3 * side }; },
    solve: (p) => { const perimeter = requireValue(p, "perimeter"); const side = perimeter / 3; const unit = lengthUnit(p); return { ...integerMeasure(side, unit, "LENGTH"), answerDimension: "LENGTH", unit, equation: `a = \\frac{P}{3} = \\frac{${perimeter}}{3}`, workingValues: { perimeter, side } }; },
    explain: (_p, s) => { const v = s.workingValues; return ["An equilateral triangle has three equal sides.", "Each side equals one-third of the perimeter.", `Side = ${v.perimeter}/3 = ${v.side}.`, `Therefore, the side length is ${s.answer}.`, "The answer is a length, so a linear unit is used."]; },
  },
  findIsoscelesTriangleArea: {
    reasoningDescription: "Bisect the base, recover the altitude by Pythagoras, then find area.",
    generateValues: (seed) => { const [equalSide, base, height] = pick(ISOSCELES_STATES, seed, "isosceles-state"); return { equalSide, base, height, area: (base * height) / 2 }; },
    solve: (p) => { const equalSide = requireValue(p, "equalSide"); const base = requireValue(p, "base"); const halfBase = base / 2; const height = Math.sqrt(equalSide ** 2 - halfBase ** 2); const area = (base * height) / 2; const unit = areaUnit(p); return { ...integerMeasure(area, unit, "AREA"), answerDimension: "AREA", unit, equation: `h = \\sqrt{${equalSide}^2-(${base}/2)^2},\\quad A=\\frac12 bh`, workingValues: { equalSide, base, halfBase, height, area } }; },
    explain: (_p, s) => { const v = s.workingValues; return ["The altitude from the vertex of an isosceles triangle bisects its base.", `Half-base = ${v.halfBase}.`, `By Pythagoras, h = √(${v.equalSide}² − ${v.halfBase}²) = ${v.height}.`, `Area = 1/2 × ${v.base} × ${v.height} = ${v.area}.`, `Therefore, the area is ${s.answer}.`]; },
  },
  findIsoscelesHeight: {
    reasoningDescription: "Bisect the base and use the resulting right triangle to recover the altitude.",
    generateValues: (seed) => { const [equalSide, base, height] = pick(ISOSCELES_STATES, seed, "isosceles-state"); return { equalSide, base, height, area: (base * height) / 2 }; },
    solve: (p) => { const equalSide = requireValue(p, "equalSide"); const base = requireValue(p, "base"); const halfBase = base / 2; const height = Math.sqrt(equalSide ** 2 - halfBase ** 2); const unit = lengthUnit(p); return { ...integerMeasure(height, unit, "LENGTH"), answerDimension: "LENGTH", unit, equation: `h = \\sqrt{${equalSide}^2-(${base}/2)^2}`, workingValues: { equalSide, base, halfBase, height } }; },
    explain: (_p, s) => { const v = s.workingValues; return ["The perpendicular from the vertex bisects the base.", `Half-base = ${v.halfBase}.`, `By Pythagoras, h² = ${v.equalSide}² − ${v.halfBase}².`, `Hence h = ${v.height}.`, `Therefore, the perpendicular height is ${s.answer}.`]; },
  },
  findTriangleAreaFromSideRatioAndPerimeter: {
    reasoningDescription: "Convert the ratio into actual sides before applying Heron's formula.",
    generateValues: ratioState,
    solve: (p) => { const ratioA = requireValue(p, "ratioA"); const ratioB = requireValue(p, "ratioB"); const ratioC = requireValue(p, "ratioC"); const perimeter = requireValue(p, "perimeter"); const scale = perimeter / (ratioA + ratioB + ratioC); const sideA = ratioA * scale; const sideB = ratioB * scale; const sideC = ratioC * scale; const h = heronValues(sideA, sideB, sideC); const unit = areaUnit(p); return { ...integerMeasure(h.area, unit, "AREA"), answerDimension: "AREA", unit, equation: `k = \\frac{${perimeter}}{${ratioA}+${ratioB}+${ratioC}},\\quad A=\\sqrt{s(s-a)(s-b)(s-c)}`, workingValues: { ratioA, ratioB, ratioC, perimeter, scale, sideA, sideB, sideC, ...h } }; },
    explain: (_p, s) => { const v = s.workingValues; const ratioSum = Number(v.ratioA) + Number(v.ratioB) + Number(v.ratioC); return heronExplanation(v, s.answer, ["First convert the ratio into actual side lengths.", `Ratio sum = ${v.ratioA} + ${v.ratioB} + ${v.ratioC} = ${ratioSum}.`, `One ratio unit = ${v.perimeter}/${ratioSum} = ${v.scale}.`]); },
  },
  findLargestTriangleSideFromRatioAndPerimeter: {
    reasoningDescription: "Find the ratio scale factor and select the largest actual side.",
    generateValues: ratioState,
    solve: (p) => solveRatioTarget(p, "largest"),
    explain: (_p, s) => explainRatioTarget(s, "largest"),
  },
  findSmallestTriangleSideFromRatioAndPerimeter: {
    reasoningDescription: "Find the ratio scale factor and select the smallest actual side.",
    generateValues: ratioState,
    solve: (p) => solveRatioTarget(p, "smallest"),
    explain: (_p, s) => explainRatioTarget(s, "smallest"),
  },
  findTriangularPlotCost: {
    reasoningDescription: "Find the triangular area and multiply it by the rate per square metre.",
    generateValues: (seed) => { const state = baseHeightState(seed, "cost-base-height"); const ratePerSquareMetre = pick([12, 15, 18, 20, 25, 30, 40, 50] as const, seed, "cost-rate"); return { ...state, ratePerSquareMetre, cost: state.area * ratePerSquareMetre }; },
    solve: (p) => { const base = requireValue(p, "base"); const height = requireValue(p, "height"); const ratePerSquareMetre = requireValue(p, "ratePerSquareMetre"); const area = (base * height) / 2; const cost = area * ratePerSquareMetre; return { ...currencyAnswer(cost), answerDimension: "COST", unit: "₹", equation: `\\text{Cost}=\\left(\\frac12\\times ${base}\\times ${height}\\right)\\times ${ratePerSquareMetre}`, workingValues: { base, height, area, ratePerSquareMetre, cost } }; },
    explain: (_p, s) => { const v = s.workingValues; return ["The total charge is based on the triangular area.", `Area = 1/2 × ${v.base} × ${v.height} = ${v.area} m².`, `Rate = ₹${v.ratePerSquareMetre} per m².`, `Total cost = ${v.area} × ${v.ratePerSquareMetre} = ₹${v.cost}.`, `Therefore, the levelling cost is ${s.answer}.`]; },
  },
} as const satisfies Record<string, Men001SolveModeDefinition>;

export type Men001SolveMode = keyof typeof MEN_001_SOLVE_MODE_REGISTRY;

function solveRatioTarget(parameters: Men001Parameters, target: "largest" | "smallest") {
  const ratioA = requireValue(parameters, "ratioA"); const ratioB = requireValue(parameters, "ratioB"); const ratioC = requireValue(parameters, "ratioC"); const perimeter = requireValue(parameters, "perimeter");
  const scale = perimeter / (ratioA + ratioB + ratioC);
  const sides = [ratioA * scale, ratioB * scale, ratioC * scale];
  const targetSide = target === "largest" ? Math.max(...sides) : Math.min(...sides);
  const unit = lengthUnit(parameters);
  return { ...integerMeasure(targetSide, unit, "LENGTH"), answerDimension: "LENGTH" as const, unit, equation: `k = \\frac{${perimeter}}{${ratioA}+${ratioB}+${ratioC}} = ${scale}`, workingValues: { ratioA, ratioB, ratioC, perimeter, scale, sideA: sides[0]!, sideB: sides[1]!, sideC: sides[2]!, targetSide } };
}

function explainRatioTarget(solver: Men001SolverResult, target: "largest" | "smallest") {
  const v = solver.workingValues;
  const ratioSum = Number(v.ratioA) + Number(v.ratioB) + Number(v.ratioC);
  return ["The perimeter fixes the common multiplier of the ratio terms.", `Ratio sum = ${v.ratioA} + ${v.ratioB} + ${v.ratioC} = ${ratioSum}.`, `One ratio unit = ${v.perimeter}/${ratioSum} = ${v.scale}.`, `The actual sides are ${v.sideA}, ${v.sideB} and ${v.sideC}.`, `The ${target} side is ${v.targetSide}.`, `Therefore, the required side is ${solver.answer}.`];
}

export function getMen001SolveModeDefinition(mode: string): Men001SolveModeDefinition {
  if (!(mode in MEN_001_SOLVE_MODE_REGISTRY)) throw new Error(`MEN-001 has no runtime definition for solve mode ${mode}.`);
  return MEN_001_SOLVE_MODE_REGISTRY[mode as Men001SolveMode];
}

export function getMen001SolveModeIds(): Men001SolveMode[] {
  return Object.keys(MEN_001_SOLVE_MODE_REGISTRY) as Men001SolveMode[];
}
