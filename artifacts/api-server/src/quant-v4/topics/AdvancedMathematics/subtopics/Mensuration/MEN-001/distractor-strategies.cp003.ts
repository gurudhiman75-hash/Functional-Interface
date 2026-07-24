import type { Men001Parameters, Men001SolverResult } from "./types";

type DistractorContext = {
  parameters: Men001Parameters;
  solver: Men001SolverResult;
};

type DistractorStrategy = (context: DistractorContext) => string;

const PI_NUMERATOR = 22;
const PI_DENOMINATOR = 7;

function number(value: unknown) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`MEN-001 CP-003 distractor requires a finite number; received ${String(value)}.`);
  }
  return parsed;
}

function formatted(value: number) {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
}

function numericOption(value: number, solver: Men001SolverResult) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`MEN-001 CP-003 distractor produced invalid value ${value}.`);
  }
  if (solver.unit === "₹") return `₹${formatted(value)}`;
  if (solver.unit === "°") return `${formatted(value)}°`;
  return `${formatted(value)} ${solver.unit}`;
}

function correctNumericValue(solver: Men001SolverResult) {
  if (solver.canonicalAnswer.kind === "symbolic") {
    throw new Error("MEN-001 CP-003 does not use symbolic distractors.");
  }
  return solver.canonicalAnswer.value;
}

function piTimes(value: number) {
  return (PI_NUMERATOR * value) / PI_DENOMINATOR;
}

export const MEN_001_CP003_DISTRACTOR_STRATEGIES = {
  "use-pi-radius": ({ solver }: DistractorContext) =>
    numericOption(piTimes(number(solver.workingValues.radius)), solver),
  "use-diameter-only": ({ solver }: DistractorContext) =>
    numericOption(2 * number(solver.workingValues.radius), solver),
  "use-circle-area-as-length": ({ solver }: DistractorContext) =>
    numericOption(piTimes(number(solver.workingValues.radius) ** 2), solver),

  "use-two-pi-diameter": ({ solver }: DistractorContext) =>
    numericOption(2 * piTimes(number(solver.workingValues.diameter)), solver),
  "retain-diameter": ({ solver }: DistractorContext) =>
    numericOption(number(solver.workingValues.diameter), solver),
  "use-circle-area-from-diameter-as-length": ({ solver }: DistractorContext) =>
    numericOption(piTimes((number(solver.workingValues.diameter) / 2) ** 2), solver),

  "use-circumference-as-area": ({ solver }: DistractorContext) =>
    numericOption(number(solver.workingValues.circumference), solver),
  "use-pi-radius-as-area": ({ solver }: DistractorContext) =>
    numericOption(piTimes(number(solver.workingValues.radius)), solver),
  "omit-pi-circle-area": ({ solver }: DistractorContext) =>
    numericOption(number(solver.workingValues.radius) ** 2, solver),

  "omit-two-in-radius-recovery": ({ solver }: DistractorContext) =>
    numericOption(number(solver.workingValues.circumference) * PI_DENOMINATOR / PI_NUMERATOR, solver),
  "halve-circumference-only": ({ solver }: DistractorContext) =>
    numericOption(number(solver.workingValues.circumference) / 2, solver),
  "divide-by-four-pi": ({ solver }: DistractorContext) =>
    numericOption(number(solver.workingValues.circumference) * PI_DENOMINATOR / (4 * PI_NUMERATOR), solver),

  "report-radius-square": ({ solver }: DistractorContext) =>
    numericOption(number(solver.workingValues.radiusSquare), solver),
  "take-root-of-area-only": ({ solver }: DistractorContext) =>
    numericOption(Math.sqrt(number(solver.workingValues.area)), solver),
  "halve-area-before-radius-root": ({ solver }: DistractorContext) =>
    numericOption(Math.sqrt(number(solver.workingValues.area) * PI_DENOMINATOR / (2 * PI_NUMERATOR)), solver),

  "square-circumference-as-area": ({ solver }: DistractorContext) =>
    numericOption(number(solver.workingValues.circumference) ** 2, solver),
  "use-recovered-radius-as-area": ({ solver }: DistractorContext) =>
    numericOption(number(solver.workingValues.radius), solver),

  "retain-full-circle-area": ({ solver }: DistractorContext) =>
    numericOption(number(solver.workingValues.fullArea), solver),
  "use-quarter-circle-area": ({ solver }: DistractorContext) =>
    numericOption(number(solver.workingValues.fullArea) / 4, solver),
  "use-semicircle-arc-as-area": ({ solver }: DistractorContext) =>
    numericOption(number(solver.workingValues.semicircleArc), solver),

  "use-semicircle-arc-only": ({ solver }: DistractorContext) =>
    numericOption(number(solver.workingValues.semicircleArc), solver),
  "use-semicircle-diameter-only": ({ solver }: DistractorContext) =>
    numericOption(number(solver.workingValues.diameter), solver),
  "add-one-radius-to-semicircle-arc": ({ solver }: DistractorContext) =>
    numericOption(number(solver.workingValues.semicircleArc) + number(solver.workingValues.radius), solver),

  "use-semicircle-area": ({ solver }: DistractorContext) =>
    numericOption(number(solver.workingValues.fullArea) / 2, solver),
  "use-quarter-circumference-as-area": ({ solver }: DistractorContext) =>
    numericOption(number(solver.workingValues.circumference) / 4, solver),

  "use-quadrant-arc-only": ({ solver }: DistractorContext) =>
    numericOption(number(solver.workingValues.quadrantArc), solver),
  "add-one-radius-to-quadrant-arc": ({ solver }: DistractorContext) =>
    numericOption(number(solver.workingValues.quadrantArc) + number(solver.workingValues.radius), solver),
  "use-full-circumference": ({ solver }: DistractorContext) =>
    numericOption(number(solver.workingValues.circumference), solver),

  "use-angle-over-180-for-arc": ({ solver }: DistractorContext) =>
    numericOption(2 * number(solver.workingValues.arcLength), solver),
  "add-radius-to-arc": ({ solver }: DistractorContext) =>
    numericOption(number(solver.workingValues.arcLength) + number(solver.workingValues.radius), solver),
  "omit-pi-and-two-in-arc": ({ solver }: DistractorContext) =>
    numericOption(number(solver.workingValues.radius) * number(solver.workingValues.angleDegrees) / 360, solver),

  "use-angle-over-180-for-sector": ({ solver }: DistractorContext) =>
    numericOption(2 * number(solver.workingValues.sectorArea), solver),
  "use-arc-length-as-sector-area": ({ solver }: DistractorContext) =>
    numericOption(number(solver.workingValues.arcLength), solver),
  "omit-pi-sector-area": ({ solver }: DistractorContext) =>
    numericOption(number(solver.workingValues.radius) ** 2 * number(solver.workingValues.angleDegrees) / 360, solver),

  "use-sector-arc-only": ({ solver }: DistractorContext) =>
    numericOption(number(solver.workingValues.arcLength), solver),
  "add-one-radius-to-sector-arc": ({ solver }: DistractorContext) =>
    numericOption(number(solver.workingValues.arcLength) + number(solver.workingValues.radius), solver),

  "use-180-in-central-angle": ({ solver }: DistractorContext) =>
    numericOption(correctNumericValue(solver) / 2, solver),
  "omit-two-pi-in-central-angle": ({ solver }: DistractorContext) =>
    numericOption(correctNumericValue(solver) * 2, solver),
  "divide-arc-by-radius-only": ({ solver }: DistractorContext) =>
    numericOption(number(solver.workingValues.arcLength) * 360 / number(solver.workingValues.radius), solver),

  "use-180-in-sector-angle": ({ solver }: DistractorContext) =>
    numericOption(correctNumericValue(solver) / 2, solver),
  "omit-radius-square-in-sector-angle": ({ solver }: DistractorContext) =>
    numericOption(correctNumericValue(solver) * number(solver.workingValues.radius), solver),
  "double-sector-angle": ({ solver }: DistractorContext) =>
    numericOption(correctNumericValue(solver) * 2, solver),

  "square-radius-difference-for-annulus": ({ solver }: DistractorContext) =>
    numericOption(piTimes((number(solver.workingValues.outerRadius) - number(solver.workingValues.innerRadius)) ** 2), solver),
  "add-circle-areas-for-annulus": ({ solver }: DistractorContext) =>
    numericOption(number(solver.workingValues.outerArea) + number(solver.workingValues.innerArea), solver),
  "omit-inner-radius-square": ({ solver }: DistractorContext) =>
    numericOption(piTimes(number(solver.workingValues.outerRadius) ** 2 - number(solver.workingValues.innerRadius)), solver),

  "omit-inner-radius-in-annulus-recovery": ({ solver }: DistractorContext) =>
    numericOption(Math.sqrt(number(solver.workingValues.radiusSquareDifference)), solver),
  "add-inner-radius-after-root": ({ solver }: DistractorContext) =>
    numericOption(Math.sqrt(number(solver.workingValues.radiusSquareDifference)) + number(solver.workingValues.innerRadius), solver),
  "omit-final-root-annulus": ({ solver }: DistractorContext) =>
    numericOption(number(solver.workingValues.outerRadiusSquare), solver),

  "multiply-radius-by-revolutions": ({ solver }: DistractorContext) =>
    numericOption(number(solver.workingValues.radius) * number(solver.workingValues.revolutions), solver),
  "multiply-diameter-by-revolutions": ({ solver }: DistractorContext) =>
    numericOption(number(solver.workingValues.diameter) * number(solver.workingValues.revolutions), solver),
  "add-circumference-and-revolutions": ({ solver }: DistractorContext) =>
    numericOption(number(solver.workingValues.circumference) + number(solver.workingValues.revolutions), solver),
} as const satisfies Record<string, DistractorStrategy>;
