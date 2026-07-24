import type { Men001Parameters, Men001SolverResult } from "./types";

type Context = { parameters: Men001Parameters; solver: Men001SolverResult };
type Strategy = (context: Context) => string;

function number(value: unknown) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`MEN-001 CP-004 distractor requires a finite number; received ${String(value)}.`);
  }
  return parsed;
}

function formatted(value: number) {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
}

function option(value: number, solver: Men001SolverResult) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`MEN-001 CP-004 distractor produced invalid value ${value}.`);
  }
  if (solver.unit === "₹") return `₹${formatted(value)}`;
  if (solver.unit === "°") return `${formatted(value)}°`;
  return `${formatted(value)} ${solver.unit}`;
}

function correct(solver: Men001SolverResult) {
  if (solver.canonicalAnswer.kind === "symbolic") {
    throw new Error("MEN-001 CP-004 does not use symbolic distractors.");
  }
  return solver.canonicalAnswer.value;
}

export const MEN_001_CP004_DISTRACTOR_STRATEGIES = {
  "report-outer-area-instead-of-path": ({ solver }: Context) =>
    option(number(solver.workingValues.outerArea), solver),
  "report-inner-area-instead-of-path": ({ solver }: Context) =>
    option(number(solver.workingValues.innerArea), solver),
  "expand-rectangle-by-width-once": ({ solver }: Context) => {
    const innerLength = number(solver.workingValues.innerLength);
    const innerBreadth = number(solver.workingValues.innerBreadth);
    const width = number(solver.workingValues.pathWidth);
    return option((innerLength + width) * (innerBreadth + width) - innerLength * innerBreadth, solver);
  },
  "shrink-rectangle-by-width-once": ({ solver }: Context) => {
    const outerLength = number(solver.workingValues.outerLength);
    const outerBreadth = number(solver.workingValues.outerBreadth);
    const width = number(solver.workingValues.pathWidth);
    return option(outerLength * outerBreadth - (outerLength - width) * (outerBreadth - width), solver);
  },
  "expand-square-by-width-once": ({ solver }: Context) => {
    const innerSide = number(solver.workingValues.innerSide);
    const width = number(solver.workingValues.pathWidth);
    return option((innerSide + width) ** 2 - innerSide ** 2, solver);
  },
  "shrink-square-by-width-once": ({ solver }: Context) => {
    const outerSide = number(solver.workingValues.outerSide);
    const width = number(solver.workingValues.pathWidth);
    return option(outerSide ** 2 - (outerSide - width) ** 2, solver);
  },
  "use-radius-difference-without-square": ({ solver }: Context) => {
    const outerRadius = number(solver.workingValues.outerRadius);
    const innerRadius = number(solver.workingValues.innerRadius);
    return option((22 * (outerRadius - innerRadius)) / 7, solver);
  },

  "report-path-area-as-cost": ({ solver }: Context) =>
    option(number(solver.workingValues.area), solver),
  "cost-inner-region-instead-of-path": ({ solver }: Context) =>
    option(number(solver.workingValues.innerArea) * number(solver.workingValues.ratePerSquareMetre), solver),
  "cost-outer-region-instead-of-path": ({ solver }: Context) =>
    option(number(solver.workingValues.outerArea) * number(solver.workingValues.ratePerSquareMetre), solver),

  "use-full-side-increase-as-width": ({ solver }: Context) =>
    option(number(solver.workingValues.outerSide) - number(solver.workingValues.innerSide), solver),
  "divide-path-area-by-inner-side": ({ solver }: Context) =>
    option(number(solver.workingValues.area) / number(solver.workingValues.innerSide), solver),
  "take-root-of-path-area-as-width": ({ solver }: Context) =>
    option(Math.sqrt(number(solver.workingValues.area)), solver),

  "count-one-tile-row-only": ({ solver }: Context) =>
    option(number(solver.workingValues.floorLength) / number(solver.workingValues.tileLength), solver),
  "add-tile-rows-and-columns": ({ solver }: Context) =>
    option(
      number(solver.workingValues.floorLength) / number(solver.workingValues.tileLength) +
        number(solver.workingValues.floorBreadth) / number(solver.workingValues.tileBreadth),
      solver,
    ),
  "omit-tile-breadth-in-count": ({ solver }: Context) =>
    option(number(solver.workingValues.floorArea) / number(solver.workingValues.tileLength), solver),
  "use-floor-perimeter-over-tile-side": ({ solver }: Context) =>
    option(
      2 * (number(solver.workingValues.floorLength) + number(solver.workingValues.floorBreadth)) /
        number(solver.workingValues.tileLength),
      solver,
    ),

  "report-tile-count-as-cost": ({ solver }: Context) =>
    option(number(solver.workingValues.tileCount), solver),
  "omit-one-tile-row-cost": ({ solver }: Context) => {
    const row = number(solver.workingValues.floorLength) / number(solver.workingValues.tileLength);
    return option(
      (number(solver.workingValues.tileCount) - row) * number(solver.workingValues.costPerTile),
      solver,
    );
  },
  "add-tile-price-to-count": ({ solver }: Context) =>
    option(number(solver.workingValues.tileCount) + number(solver.workingValues.costPerTile), solver),

  "cost-floor-perimeter-at-area-rate": ({ solver }: Context) =>
    option(
      2 * (number(solver.workingValues.length) + number(solver.workingValues.breadth)) *
        number(solver.workingValues.ratePerSquareMetre),
      solver,
    ),
  "cost-floor-length-only": ({ solver }: Context) =>
    option(number(solver.workingValues.length) * number(solver.workingValues.ratePerSquareMetre), solver),
  "cost-half-floor-area": ({ solver }: Context) =>
    option(correct(solver) / 2, solver),

  "cost-rectangle-area-as-fencing": ({ solver }: Context) =>
    option(number(solver.workingValues.length) * number(solver.workingValues.breadth) * number(solver.workingValues.ratePerMetre), solver),
  "cost-semiperimeter-as-fencing": ({ solver }: Context) =>
    option((number(solver.workingValues.length) + number(solver.workingValues.breadth)) * number(solver.workingValues.ratePerMetre), solver),
  "report-perimeter-as-fencing-cost": ({ solver }: Context) =>
    option(number(solver.workingValues.perimeter), solver),

  "ignore-gate-in-fencing-cost": ({ solver }: Context) =>
    option(number(solver.workingValues.perimeter) * number(solver.workingValues.ratePerMetre), solver),
  "subtract-gate-after-costing": ({ solver }: Context) =>
    option(
      number(solver.workingValues.perimeter) * number(solver.workingValues.ratePerMetre) -
        number(solver.workingValues.gateWidth),
      solver,
    ),
  "subtract-gate-twice-from-boundary": ({ solver }: Context) =>
    option(
      (number(solver.workingValues.perimeter) - 2 * number(solver.workingValues.gateWidth)) *
        number(solver.workingValues.ratePerMetre),
      solver,
    ),

  "use-one-wire-round": ({ solver }: Context) =>
    option(number(solver.workingValues.perimeter), solver),
  "use-one-extra-wire-round": ({ solver }: Context) =>
    option(
      number(solver.workingValues.perimeter) * (number(solver.workingValues.rounds) + 1),
      solver,
    ),
  "add-rounds-to-perimeter": ({ solver }: Context) =>
    option(number(solver.workingValues.perimeter) + number(solver.workingValues.rounds), solver),

  "use-pi-radius-for-circular-fence": ({ solver }: Context) =>
    option((22 * number(solver.workingValues.radius) / 7) * number(solver.workingValues.ratePerMetre), solver),
  "use-diameter-without-pi-for-circular-fence": ({ solver }: Context) =>
    option(2 * number(solver.workingValues.radius) * number(solver.workingValues.ratePerMetre), solver),
  "use-radius-only-for-circular-fence": ({ solver }: Context) =>
    option(number(solver.workingValues.radius) * number(solver.workingValues.ratePerMetre), solver),

  "halve-recovered-gate-width": ({ solver }: Context) =>
    option(correct(solver) / 2, solver),
  "double-recovered-gate-width": ({ solver }: Context) =>
    option(correct(solver) * 2, solver),
  "report-used-wire-as-gate-width": ({ solver }: Context) =>
    option(number(solver.workingValues.wireLength), solver),

  "tile-entire-outer-floor": ({ solver }: Context) =>
    option(number(solver.workingValues.outerArea) / number(solver.workingValues.tileArea), solver),
  "tile-only-inner-floor": ({ solver }: Context) =>
    option(number(solver.workingValues.innerArea) / number(solver.workingValues.tileArea), solver),
  "omit-tile-breadth-for-border-count": ({ solver }: Context) =>
    option(number(solver.workingValues.area) / number(solver.workingValues.tileLength), solver),
} as const satisfies Record<string, Strategy>;
