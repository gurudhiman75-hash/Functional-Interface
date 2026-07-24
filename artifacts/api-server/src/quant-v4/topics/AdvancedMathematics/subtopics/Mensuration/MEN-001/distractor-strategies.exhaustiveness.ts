import type { Men001Parameters, Men001SolverResult } from "./types";

type Context = { parameters: Men001Parameters; solver: Men001SolverResult };
type Strategy = (context: Context) => string;

function number(value: unknown) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) throw new Error(`MEN-001 exhaustiveness distractor requires a finite value.`);
  return parsed;
}

function format(value: number) {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
}

function option(value: number, solver: Men001SolverResult) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`MEN-001 exhaustiveness distractor produced invalid value ${value}.`);
  }
  if (solver.unit === "₹") return `₹${format(value)}`;
  if (solver.unit === "₹/m²") return `₹${format(value)}/m²`;
  if (solver.unit === "₹/m") return `₹${format(value)}/m`;
  return `${format(value)} ${solver.unit}`;
}

function sqrt3Option(coefficient: number, solver: Men001SolverResult) {
  const latexUnit = solver.unit === "m" ? "\\text{m}" : "\\text{cm}";
  return `$$${format(coefficient)}\\sqrt{3}\\,${latexUnit}$$`;
}

export const MEN_001_EXHAUSTIVENESS_DISTRACTOR_STRATEGIES = {
  "ex-use-triangle-semiperimeter": ({ solver }: Context) =>
    option(number(solver.workingValues.perimeter) / 2, solver),
  "ex-double-triangle-perimeter": ({ solver }: Context) =>
    option(number(solver.workingValues.perimeter) * 2, solver),
  "ex-report-largest-triangle-side": ({ solver }: Context) =>
    option(Math.max(number(solver.workingValues.sideA), number(solver.workingValues.sideB), number(solver.workingValues.sideC)), solver),

  "ex-add-right-triangle-legs": ({ solver }: Context) =>
    option(number(solver.workingValues.legA) + number(solver.workingValues.legB), solver),
  "ex-subtract-right-triangle-legs": ({ solver }: Context) =>
    option(Math.abs(number(solver.workingValues.legB) - number(solver.workingValues.legA)), solver),
  "ex-root-right-leg-product": ({ solver }: Context) =>
    option(Math.sqrt(number(solver.workingValues.legA) * number(solver.workingValues.legB)), solver),
  "ex-subtract-leg-from-hypotenuse": ({ solver }: Context) =>
    option(number(solver.workingValues.sideC) - number(solver.workingValues.legA), solver),
  "ex-use-pythagorean-sum-for-leg": ({ solver }: Context) =>
    option(Math.sqrt(number(solver.workingValues.sideC) ** 2 + number(solver.workingValues.legA) ** 2), solver),
  "ex-halve-hypotenuse": ({ solver }: Context) =>
    option(number(solver.workingValues.sideC) / 2, solver),

  "ex-omit-root-three-height": ({ solver }: Context) =>
    option(number(solver.workingValues.heightCoefficient), solver),
  "ex-use-equilateral-side-as-height": ({ solver }: Context) =>
    option(number(solver.workingValues.side), solver),
  "ex-double-equilateral-height": ({ solver }: Context) =>
    sqrt3Option(number(solver.workingValues.heightCoefficient) * 2, solver),
  "ex-report-area-coefficient-as-side": ({ solver }: Context) =>
    option(number(solver.workingValues.areaCoefficient), solver),
  "ex-root-area-coefficient-as-side": ({ solver }: Context) =>
    option(Math.sqrt(number(solver.workingValues.areaCoefficient)), solver),
  "ex-double-recovered-side": ({ solver }: Context) =>
    option(number(solver.workingValues.side) * 2, solver),

  "ex-retain-square-perimeter": ({ solver }: Context) =>
    option(number(solver.workingValues.perimeter), solver),
  "ex-divide-square-perimeter-by-two": ({ solver }: Context) =>
    option(number(solver.workingValues.perimeter) / 2, solver),
  "ex-divide-square-perimeter-by-eight": ({ solver }: Context) =>
    option(number(solver.workingValues.perimeter) / 8, solver),

  "ex-halve-rhombus-base-height-area": ({ solver }: Context) =>
    option(number(solver.workingValues.area) / 2, solver),
  "ex-square-rhombus-base": ({ solver }: Context) =>
    option(number(solver.workingValues.base) ** 2, solver),
  "ex-square-rhombus-height": ({ solver }: Context) =>
    option(number(solver.workingValues.height) ** 2, solver),

  "ex-single-kite-side-sum": ({ solver }: Context) =>
    option(number(solver.workingValues.sideA) + number(solver.workingValues.sideB), solver),
  "ex-double-first-kite-side": ({ solver }: Context) =>
    option(number(solver.workingValues.sideA) * 2, solver),
  "ex-double-second-kite-side": ({ solver }: Context) =>
    option(number(solver.workingValues.sideB) * 2, solver),

  "ex-use-only-trapezium-parallel-sides": ({ solver }: Context) =>
    option(number(solver.workingValues.parallelSideA) + number(solver.workingValues.parallelSideB), solver),
  "ex-use-only-trapezium-nonparallel-sides": ({ solver }: Context) =>
    option(number(solver.workingValues.sideA) + number(solver.workingValues.sideB), solver),
  "ex-double-trapezium-parallel-sides": ({ solver }: Context) =>
    option(2 * (number(solver.workingValues.parallelSideA) + number(solver.workingValues.parallelSideB)), solver),

  "ex-report-circle-radius-not-diameter": ({ solver }: Context) =>
    option(number(solver.workingValues.diameter) / 2, solver),
  "ex-halve-circle-circumference": ({ solver }: Context) =>
    option(number(solver.workingValues.circumference) / 2, solver),
  "ex-retain-circle-circumference": ({ solver }: Context) =>
    option(number(solver.workingValues.circumference), solver),
  "ex-root-circle-area-as-diameter": ({ solver }: Context) =>
    option(Math.sqrt(number(solver.workingValues.area)), solver),
  "ex-use-circle-area-as-diameter": ({ solver }: Context) =>
    option(number(solver.workingValues.area), solver),

  "ex-report-arc-length-as-radius": ({ solver }: Context) =>
    option(number(solver.workingValues.arcLength), solver),
  "ex-half-recovered-radius": ({ solver }: Context) =>
    option(number(solver.workingValues.radius) / 2, solver),
  "ex-double-recovered-radius": ({ solver }: Context) =>
    option(number(solver.workingValues.radius) * 2, solver),
  "ex-root-sector-area-as-radius": ({ solver }: Context) =>
    option(Math.sqrt(number(solver.workingValues.sectorArea)), solver),
  "ex-report-sector-area-as-radius": ({ solver }: Context) =>
    option(number(solver.workingValues.sectorArea), solver),

  "ex-report-annulus-outer-radius": ({ solver }: Context) =>
    option(number(solver.workingValues.outerRadius), solver),
  "ex-half-annulus-inner-radius": ({ solver }: Context) =>
    option(number(solver.workingValues.innerRadius) / 2, solver),
  "ex-report-annulus-square-difference": ({ solver }: Context) =>
    option(number(solver.workingValues.radiusSquareDifference), solver),

  "ex-report-wheel-circumference-as-revolutions": ({ solver }: Context) =>
    option(number(solver.workingValues.circumference), solver),
  "ex-double-wheel-revolutions": ({ solver }: Context) =>
    option(number(solver.workingValues.revolutions) * 2, solver),
  "ex-halve-wheel-revolutions": ({ solver }: Context) =>
    option(number(solver.workingValues.revolutions) / 2, solver),
  "ex-report-wheel-distance-as-radius": ({ solver }: Context) =>
    option(number(solver.workingValues.distance), solver),
  "ex-report-wheel-circumference-as-radius": ({ solver }: Context) =>
    option(number(solver.workingValues.circumference), solver),

  "ex-report-double-path-width": ({ solver }: Context) =>
    option(number(solver.workingValues.pathWidth) * 2, solver),
  "ex-report-half-path-width": ({ solver }: Context) =>
    option(number(solver.workingValues.pathWidth) / 2, solver),
  "ex-use-path-area-over-dimension-sum": ({ solver }: Context) => {
    const sum = number(solver.workingValues.innerLength ?? solver.workingValues.outerLength) +
      number(solver.workingValues.innerBreadth ?? solver.workingValues.outerBreadth);
    return option(number(solver.workingValues.area) / sum, solver);
  },
  "ex-report-circular-outer-radius": ({ solver }: Context) =>
    option(number(solver.workingValues.outerRadius), solver),
  "ex-report-circular-inner-radius": ({ solver }: Context) =>
    option(number(solver.workingValues.innerRadius), solver),

  "ex-omit-cross-road-overlap": ({ solver }: Context) =>
    option(number(solver.workingValues.roadAreaA) + number(solver.workingValues.roadAreaB), solver),
  "ex-report-cross-road-overlap-only": ({ solver }: Context) =>
    option(number(solver.workingValues.overlapArea), solver),
  "ex-use-one-cross-road-only": ({ solver }: Context) =>
    option(number(solver.workingValues.roadAreaA), solver),
  "ex-report-road-area-as-remaining": ({ solver }: Context) =>
    option(number(solver.workingValues.roadArea), solver),
  "ex-retain-whole-field-area": ({ solver }: Context) =>
    option(number(solver.workingValues.fieldArea), solver),
  "ex-subtract-road-overlap-twice": ({ solver }: Context) =>
    option(number(solver.workingValues.fieldArea) - number(solver.workingValues.roadAreaA) - number(solver.workingValues.roadAreaB), solver),

  "ex-report-covered-tile-area": ({ solver }: Context) =>
    option(number(solver.workingValues.coveredArea), solver),
  "ex-retain-full-floor-area": ({ solver }: Context) =>
    option(number(solver.workingValues.floorArea), solver),
  "ex-subtract-one-tile-only": ({ solver }: Context) =>
    option(number(solver.workingValues.floorArea) - number(solver.workingValues.tileArea), solver),

  "ex-report-total-cost-as-rate": ({ solver }: Context) =>
    option(number(solver.workingValues.cost), solver),
  "ex-divide-cost-by-double-measure": ({ solver }: Context) => {
    const measure = number(solver.workingValues.area ?? solver.workingValues.perimeter);
    return option(number(solver.workingValues.cost) / (2 * measure), solver);
  },
  "ex-multiply-cost-by-measure": ({ solver }: Context) => {
    const measure = number(solver.workingValues.area ?? solver.workingValues.perimeter);
    return option(number(solver.workingValues.cost) * measure, solver);
  },

  "ex-tile-entire-outer-area": ({ solver }: Context) =>
    option(number(solver.workingValues.outerArea) / number(solver.workingValues.tileArea), solver),
  "ex-tile-only-inner-area": ({ solver }: Context) =>
    option(number(solver.workingValues.innerArea) / number(solver.workingValues.tileArea), solver),
  "ex-divide-border-by-tile-length-only": ({ solver }: Context) =>
    option(number(solver.workingValues.area) / number(solver.workingValues.tileLength), solver),
} as const satisfies Record<string, Strategy>;
