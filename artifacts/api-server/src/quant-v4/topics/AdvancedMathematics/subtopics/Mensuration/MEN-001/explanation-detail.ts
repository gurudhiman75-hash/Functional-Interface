import type {
  Men001Parameters,
  Men001SolverResult,
} from "./types";

type WorkingValues = Men001SolverResult["workingValues"];

function number(values: WorkingValues, key: string): number | undefined {
  const value = Number(values[key]);
  return Number.isFinite(value) ? value : undefined;
}

function hasNumbers(
  values: WorkingValues,
  keys: readonly string[],
): values is WorkingValues {
  return keys.every((key) => number(values, key) !== undefined);
}

function format(value: number) {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
}

const TRIANGLE_BASE_HEIGHT_MODES = new Set([
  "findTriangleAreaBaseHeight",
  "findMissingHeightFromAreaAndBase",
  "findMissingBaseFromAreaAndHeight",
  "findRightTriangleAreaFromLegs",
  "findTriangularPlotCost",
]);

function buildVerificationLine(
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): string {
  const values = solver.workingValues;

  if (hasNumbers(values, ["outerArea", "innerArea", "area"])) {
    const outerArea = number(values, "outerArea")!;
    const innerArea = number(values, "innerArea")!;
    const area = number(values, "area")!;
    return `Check: outer area − inner area = ${format(outerArea)} − ${format(innerArea)} = ${format(area)}, which matches the required region.`;
  }

  if (hasNumbers(values, ["cost", "area", "ratePerSquareMetre"])) {
    const cost = number(values, "cost")!;
    const area = number(values, "area")!;
    const rate = number(values, "ratePerSquareMetre")!;
    return `Check: ${format(area)} × ${format(rate)} = ${format(cost)}, so the area-rate-cost relation is satisfied.`;
  }

  if (hasNumbers(values, ["cost", "wireLength", "ratePerMetre"])) {
    const cost = number(values, "cost")!;
    const wireLength = number(values, "wireLength")!;
    const rate = number(values, "ratePerMetre")!;
    return `Check: ${format(wireLength)} × ${format(rate)} = ${format(cost)}, confirming the total fencing cost.`;
  }

  if (hasNumbers(values, ["cost", "perimeter", "ratePerMetre"])) {
    const cost = number(values, "cost")!;
    const perimeter = number(values, "perimeter")!;
    const rate = number(values, "ratePerMetre")!;
    return `Check: ${format(perimeter)} × ${format(rate)} = ${format(cost)}, confirming the boundary-rate-cost relation.`;
  }

  if (hasNumbers(values, ["tileCount", "tileArea", "floorArea"])) {
    const count = number(values, "tileCount")!;
    const tileArea = number(values, "tileArea")!;
    const floorArea = number(values, "floorArea")!;
    return `Check: ${format(count)} × ${format(tileArea)} = ${format(floorArea)}, so the tiles cover the floor exactly.`;
  }

  if (hasNumbers(values, ["tileCount", "tileArea", "area"])) {
    const count = number(values, "tileCount")!;
    const tileArea = number(values, "tileArea")!;
    const area = number(values, "area")!;
    return `Check: ${format(count)} × ${format(tileArea)} = ${format(area)}, so the paving units cover the required region exactly.`;
  }

  if (hasNumbers(values, ["coveredArea", "area", "floorArea"])) {
    const covered = number(values, "coveredArea")!;
    const uncovered = number(values, "area")!;
    const floor = number(values, "floorArea")!;
    return `Check: covered area + uncovered area = ${format(covered)} + ${format(uncovered)} = ${format(floor)}, equal to the whole floor.`;
  }

  if (hasNumbers(values, ["roadAreaA", "roadAreaB", "overlapArea", "roadArea"])) {
    const roadA = number(values, "roadAreaA")!;
    const roadB = number(values, "roadAreaB")!;
    const overlap = number(values, "overlapArea")!;
    const union = number(values, "roadArea")!;
    return `Check: ${format(roadA)} + ${format(roadB)} − ${format(overlap)} = ${format(union)}, so the road overlap is counted only once.`;
  }

  if (hasNumbers(values, ["legA", "legB", "sideC"])) {
    const legA = number(values, "legA")!;
    const legB = number(values, "legB")!;
    const sideC = number(values, "sideC")!;
    return `Check: ${format(legA)}² + ${format(legB)}² = ${format(sideC)}², so the recovered sides satisfy Pythagoras.`;
  }

  if (hasNumbers(values, ["equalSide", "halfBase", "height"])) {
    const equalSide = number(values, "equalSide")!;
    const halfBase = number(values, "halfBase")!;
    const height = number(values, "height")!;
    return `Check: ${format(halfBase)}² + ${format(height)}² = ${format(equalSide)}², confirming the isosceles altitude construction.`;
  }

  if (hasNumbers(values, ["sideA", "sideB", "sideC", "perimeter"])) {
    const sideA = number(values, "sideA")!;
    const sideB = number(values, "sideB")!;
    const sideC = number(values, "sideC")!;
    const perimeter = number(values, "perimeter")!;
    return `Check: ${format(sideA)} + ${format(sideB)} + ${format(sideC)} = ${format(perimeter)}, so the side lengths reproduce the stated perimeter.`;
  }

  if (hasNumbers(values, ["circumference", "revolutions", "distance"])) {
    const circumference = number(values, "circumference")!;
    const revolutions = number(values, "revolutions")!;
    const distance = number(values, "distance")!;
    return `Check: ${format(circumference)} × ${format(revolutions)} = ${format(distance)}, so the wheel-distance relation is satisfied.`;
  }

  if (hasNumbers(values, ["angleDegrees", "circumference", "arcLength"])) {
    const angle = number(values, "angleDegrees")!;
    const circumference = number(values, "circumference")!;
    const arcLength = number(values, "arcLength")!;
    return `Check: (${format(angle)}/360) × ${format(circumference)} = ${format(arcLength)}, reproducing the stated arc length.`;
  }

  if (hasNumbers(values, ["angleDegrees", "fullArea", "sectorArea"])) {
    const angle = number(values, "angleDegrees")!;
    const fullArea = number(values, "fullArea")!;
    const sectorArea = number(values, "sectorArea")!;
    return `Check: (${format(angle)}/360) × ${format(fullArea)} = ${format(sectorArea)}, reproducing the sector area.`;
  }

  if (hasNumbers(values, ["length", "breadth", "area"])) {
    const length = number(values, "length")!;
    const breadth = number(values, "breadth")!;
    const area = number(values, "area")!;
    return `Check: ${format(length)} × ${format(breadth)} = ${format(area)}, which reproduces the rectangular area.`;
  }

  if (hasNumbers(values, ["side", "area"])) {
    const side = number(values, "side")!;
    const area = number(values, "area")!;
    return `Check: ${format(side)}² = ${format(area)}, so the recovered square measurement is consistent.`;
  }

  if (hasNumbers(values, ["base", "height", "area"])) {
    const base = number(values, "base")!;
    const height = number(values, "height")!;
    const area = number(values, "area")!;
    if (TRIANGLE_BASE_HEIGHT_MODES.has(parameters.solveMode)) {
      return `Check: ${format(base)} × ${format(height)} = 2 × ${format(area)}, confirming A = 1/2 × base × height.`;
    }
    return `Check: ${format(base)} × ${format(height)} = ${format(area)}, confirming the base-height area relation.`;
  }

  if (hasNumbers(values, ["radius", "diameter"])) {
    const radius = number(values, "radius")!;
    const diameter = number(values, "diameter")!;
    return `Check: 2 × ${format(radius)} = ${format(diameter)}, so the radius-diameter relation is preserved.`;
  }

  if (hasNumbers(values, ["side", "perimeter"])) {
    const side = number(values, "side")!;
    const perimeter = number(values, "perimeter")!;
    const multiplier = parameters.solveMode.toLowerCase().includes("equilateral") ? 3 : 4;
    return `Check: ${multiplier} × ${format(side)} = ${format(perimeter)}, reproducing the stated perimeter.`;
  }

  return `Check: substituting the computed value back into the governing relation reproduces ${solver.answer}.`;
}

function buildInterpretationLine(solver: Men001SolverResult): string {
  switch (solver.answerDimension) {
    case "AREA":
      return `The required quantity is two-dimensional, so the final answer is expressed in ${solver.unit}.`;
    case "LENGTH":
      return `The required quantity is a linear measurement, so the final answer is expressed in ${solver.unit}, not a square unit.`;
    case "COST":
      return "The result is a monetary amount after applying the stated rate, so it is expressed in rupees.";
    case "RATE":
      return `The result is a unit rate, so it is expressed as ${solver.unit}.`;
    case "ANGLE":
      return "The result is an angular measure, so it is expressed in degrees.";
    case "COUNT":
      return solver.unit === "revolutions"
        ? "The result counts complete wheel turns, so it is reported in revolutions."
        : "The exact area quotient gives a whole-number tile count, so no rounding is required.";
  }
}

export function enrichMen001ExplanationLines(
  lines: readonly string[],
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): string[] {
  return [
    ...lines,
    buildVerificationLine(parameters, solver),
    buildInterpretationLine(solver),
  ];
}
