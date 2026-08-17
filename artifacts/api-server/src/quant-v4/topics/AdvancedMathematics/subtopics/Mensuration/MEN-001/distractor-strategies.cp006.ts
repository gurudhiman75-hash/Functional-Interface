import type { Men001Parameters, Men001SolverResult } from "./types";

type Context = { parameters: Men001Parameters; solver: Men001SolverResult };
type Strategy = (context: Context) => string;

function number(solver: Men001SolverResult, key: string) {
  const candidate = Number(solver.workingValues[key]);
  if (!Number.isFinite(candidate) || candidate <= 0) {
    throw new Error(`MEN-001 CP-006 distractor requires positive ${key}.`);
  }
  return candidate;
}

function format(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`MEN-001 CP-006 distractor produced invalid value ${value}.`);
  }
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
}

function option(value: number, solver: Men001SolverResult) {
  if (solver.unit === "%") return `${format(value)}%`;
  return `${format(value)} ${solver.unit}`;
}

export const MEN_001_CP006_DISTRACTOR_STRATEGIES = {
  "cp006-cm-to-m-divide-by-10": ({ solver }: Context) => option(number(solver, "length") / 10, solver),
  "cp006-cm-to-m-divide-by-1000": ({ solver }: Context) => option(number(solver, "length") / 1000, solver),
  "cp006-cm-to-m-no-conversion": ({ solver }: Context) => option(number(solver, "length"), solver),
  "cp006-m-to-cm-multiply-by-10": ({ solver }: Context) => option(number(solver, "length") * 10, solver),
  "cp006-m-to-cm-multiply-by-1000": ({ solver }: Context) => option(number(solver, "length") * 1000, solver),
  "cp006-m-to-cm-no-conversion": ({ solver }: Context) => option(number(solver, "length"), solver),
  "cp006-cm2-to-m2-divide-by-100": ({ solver }: Context) => option(number(solver, "area") / 100, solver),
  "cp006-cm2-to-m2-divide-by-1000": ({ solver }: Context) => option(number(solver, "area") / 1000, solver),
  "cp006-cm2-to-m2-no-conversion": ({ solver }: Context) => option(number(solver, "area"), solver),
  "cp006-m2-to-cm2-multiply-by-100": ({ solver }: Context) => option(number(solver, "area") * 100, solver),
  "cp006-m2-to-cm2-multiply-by-1000": ({ solver }: Context) => option(number(solver, "area") * 1000, solver),
  "cp006-m2-to-cm2-no-conversion": ({ solver }: Context) => option(number(solver, "area"), solver),

  "cp006-mixed-area-use-centimetres-directly": ({ solver }: Context) =>
    option(number(solver, "length") * number(solver, "breadth"), solver),
  "cp006-mixed-area-divide-breadth-by-10": ({ solver }: Context) =>
    option(number(solver, "length") * number(solver, "breadth") / 10, solver),
  "cp006-mixed-area-divide-final-by-10000": ({ solver }: Context) =>
    option(number(solver, "length") * number(solver, "breadth") / 10000, solver),
  "cp006-mixed-perimeter-use-centimetres-directly": ({ solver }: Context) =>
    option(2 * (number(solver, "length") + number(solver, "breadth")), solver),
  "cp006-mixed-perimeter-divide-breadth-by-10": ({ solver }: Context) =>
    option(2 * (number(solver, "length") + number(solver, "breadth") / 10), solver),
  "cp006-mixed-perimeter-use-semiperimeter": ({ solver }: Context) =>
    option(number(solver, "length") + number(solver, "breadthMetres"), solver),
  "cp006-mixed-reverse-no-conversion": ({ solver }: Context) =>
    option(number(solver, "area") / number(solver, "breadth"), solver),
  "cp006-mixed-reverse-divide-breadth-by-10": ({ solver }: Context) =>
    option(number(solver, "area") / (number(solver, "breadth") / 10), solver),
  "cp006-mixed-reverse-multiply-area-and-breadth": ({ solver }: Context) =>
    option(number(solver, "area") * number(solver, "breadthMetres"), solver),
  "cp006-square-use-centimetre-side-directly": ({ solver }: Context) =>
    option(number(solver, "side") ** 2, solver),
  "cp006-square-divide-area-by-100": ({ solver }: Context) =>
    option(number(solver, "side") ** 2 / 100, solver),
  "cp006-square-divide-area-by-1000": ({ solver }: Context) =>
    option(number(solver, "side") ** 2 / 1000, solver),

  "cp006-perimeter-use-square-factor": ({ solver }: Context) =>
    option(number(solver, "perimeter") * number(solver, "scale") ** 2, solver),
  "cp006-perimeter-add-scale-factor": ({ solver }: Context) =>
    option(number(solver, "perimeter") + number(solver, "scale"), solver),
  "cp006-perimeter-ignore-scale": ({ solver }: Context) => option(number(solver, "perimeter"), solver),
  "cp006-area-use-linear-factor": ({ solver }: Context) =>
    option(number(solver, "area") * number(solver, "scale"), solver),
  "cp006-area-use-cubic-factor": ({ solver }: Context) =>
    option(number(solver, "area") * number(solver, "scale") ** 3, solver),
  "cp006-area-ignore-scale": ({ solver }: Context) => option(number(solver, "area"), solver),
  "cp006-factor-use-perimeter-difference": ({ solver }: Context) =>
    option(number(solver, "scaledPerimeter") - number(solver, "perimeter"), solver),
  "cp006-factor-square-perimeter-ratio": ({ solver }: Context) =>
    option(number(solver, "scaleFactor") ** 2, solver),
  "cp006-factor-invert-perimeter-ratio": ({ solver }: Context) =>
    option(1 / number(solver, "scaleFactor"), solver),
  "cp006-factor-use-area-ratio": ({ solver }: Context) => option(number(solver, "areaRatio"), solver),
  "cp006-factor-use-area-ratio-minus-one": ({ solver }: Context) => option(number(solver, "areaRatio") - 1, solver),
  "cp006-factor-invert-area-root": ({ solver }: Context) => option(1 / number(solver, "scaleFactor"), solver),
  "cp006-original-area-divide-by-linear-factor": ({ solver }: Context) =>
    option(number(solver, "scaledArea") / number(solver, "scale"), solver),
  "cp006-original-area-multiply-by-square-factor": ({ solver }: Context) =>
    option(number(solver, "scaledArea") * number(solver, "areaFactor"), solver),
  "cp006-original-area-divide-by-cubic-factor": ({ solver }: Context) =>
    option(number(solver, "scaledArea") / number(solver, "scale") ** 3, solver),

  "cp006-percent-report-linear-change": ({ solver }: Context) => option(number(solver, "scale"), solver),
  "cp006-percent-double-linear-change": ({ solver }: Context) => option(2 * number(solver, "scale"), solver),
  "cp006-percent-use-square-term-only": ({ solver }: Context) => option(number(solver, "scale") ** 2 / 100, solver),
  "cp006-independent-subtract-percentages": ({ solver }: Context) =>
    option(number(solver, "increasePercent") - number(solver, "decreasePercent"), solver),
  "cp006-independent-add-percentages": ({ solver }: Context) =>
    option(number(solver, "increasePercent") + number(solver, "decreasePercent"), solver),
  "cp006-independent-use-product-term": ({ solver }: Context) =>
    option(number(solver, "increasePercent") * number(solver, "decreasePercent") / 100, solver),
  "cp006-new-area-apply-increase-only": ({ solver }: Context) =>
    option(number(solver, "area") * (100 + number(solver, "increasePercent")) / 100, solver),
  "cp006-new-area-apply-decrease-only": ({ solver }: Context) =>
    option(number(solver, "area") * (100 - number(solver, "decreasePercent")) / 100, solver),
  "cp006-new-area-combine-percentages-linearly": ({ solver }: Context) =>
    option(number(solver, "area") * (100 + number(solver, "increasePercent") - number(solver, "decreasePercent")) / 100, solver),

  "cp006-map-actual-length-divide-by-scale": ({ solver }: Context) =>
    option(number(solver, "length") / number(solver, "scale"), solver),
  "cp006-map-actual-length-use-scale-alone": ({ solver }: Context) => option(number(solver, "scale"), solver),
  "cp006-map-actual-length-square-scale": ({ solver }: Context) =>
    option(number(solver, "length") * number(solver, "scale") ** 2, solver),
  "cp006-map-length-multiply-by-scale": ({ solver }: Context) =>
    option(number(solver, "distance") * number(solver, "scale"), solver),
  "cp006-map-length-divide-by-square-scale": ({ solver }: Context) =>
    option(number(solver, "distance") / number(solver, "scale") ** 2, solver),
  "cp006-map-length-report-actual-distance": ({ solver }: Context) => option(number(solver, "distance"), solver),
  "cp006-map-area-use-linear-scale": ({ solver }: Context) =>
    option(number(solver, "area") * number(solver, "scale"), solver),
  "cp006-map-area-divide-by-square-scale": ({ solver }: Context) =>
    option(number(solver, "area") / number(solver, "scale") ** 2, solver),
  "cp006-map-area-ignore-scale": ({ solver }: Context) => option(number(solver, "area"), solver),
  "cp006-map-area-reverse-divide-linear-scale": ({ solver }: Context) =>
    option(number(solver, "outerArea") / number(solver, "scale"), solver),
  "cp006-map-area-reverse-multiply-square-scale": ({ solver }: Context) =>
    option(number(solver, "outerArea") * number(solver, "areaScale"), solver),
  "cp006-map-area-reverse-report-actual-area": ({ solver }: Context) => option(number(solver, "outerArea"), solver),
  "cp006-plan-area-apply-scale-once": ({ solver }: Context) =>
    option(number(solver, "length") * number(solver, "breadth") * number(solver, "scale"), solver),
  "cp006-plan-area-use-map-area": ({ solver }: Context) =>
    option(number(solver, "length") * number(solver, "breadth"), solver),
  "cp006-plan-area-add-actual-dimensions": ({ solver }: Context) =>
    option(number(solver, "actualLength") + number(solver, "actualBreadth"), solver),

  "cp006-square-rectangle-use-full-wire-minus-breadth": ({ solver }: Context) =>
    option(number(solver, "wireLength") - number(solver, "breadth"), solver),
  "cp006-square-rectangle-keep-square-side": ({ solver }: Context) => option(number(solver, "side"), solver),
  "cp006-square-rectangle-report-semiperimeter": ({ solver }: Context) => option(number(solver, "semiperimeter"), solver),
  "cp006-rectangle-square-divide-wire-by-two": ({ solver }: Context) => option(number(solver, "wireLength") / 2, solver),
  "cp006-rectangle-square-divide-wire-by-three": ({ solver }: Context) => option(number(solver, "wireLength") / 3, solver),
  "cp006-rectangle-square-divide-wire-by-eight": ({ solver }: Context) => option(number(solver, "wireLength") / 8, solver),
  "cp006-report-circle-diameter": ({ solver }: Context) => option(2 * number(solver, "radius"), solver),
  "cp006-report-source-square-side": ({ solver }: Context) => option(number(solver, "side"), solver),
  "cp006-report-half-circle-radius": ({ solver }: Context) => option(number(solver, "radius") / 2, solver),
  "cp006-circle-square-report-radius": ({ solver }: Context) => option(number(solver, "radius"), solver),
  "cp006-circle-square-report-diameter": ({ solver }: Context) => option(2 * number(solver, "radius"), solver),
  "cp006-circle-square-halve-side": ({ solver }: Context) => option(number(solver, "side") / 2, solver),
  "cp006-rectangle-circle-report-diameter": ({ solver }: Context) => option(2 * number(solver, "radius"), solver),
  "cp006-rectangle-circle-report-semiperimeter": ({ solver }: Context) => option(number(solver, "wireLength") / 2, solver),
  "cp006-rectangle-circle-halve-radius": ({ solver }: Context) => option(number(solver, "radius") / 2, solver),
  "cp006-equilateral-keep-square-side": ({ solver }: Context) => option(number(solver, "side"), solver),
  "cp006-equilateral-divide-wire-by-two": ({ solver }: Context) => option(number(solver, "wireLength") / 2, solver),
  "cp006-equilateral-divide-wire-by-six": ({ solver }: Context) => option(number(solver, "wireLength") / 6, solver),
  "cp006-hexagon-keep-square-side": ({ solver }: Context) => option(number(solver, "side"), solver),
  "cp006-hexagon-divide-wire-by-three": ({ solver }: Context) => option(number(solver, "wireLength") / 3, solver),
  "cp006-hexagon-divide-wire-by-eight": ({ solver }: Context) => option(number(solver, "wireLength") / 8, solver),
  "cp006-square-area-report-rectangle-area": ({ solver }: Context) => option(number(solver, "length") * number(solver, "breadth"), solver),
  "cp006-square-area-use-semiperimeter-square": ({ solver }: Context) => option((number(solver, "wireLength") / 2) ** 2, solver),
  "cp006-square-area-use-wire-square-over-eight": ({ solver }: Context) => option(number(solver, "wireLength") ** 2 / 8, solver),
  "cp006-area-difference-report-square-area": ({ solver }: Context) => option(number(solver, "squareArea"), solver),
  "cp006-area-difference-report-rectangle-area": ({ solver }: Context) => option(number(solver, "rectangleArea"), solver),
  "cp006-area-difference-add-areas": ({ solver }: Context) => option(number(solver, "squareArea") + number(solver, "rectangleArea"), solver),
  "cp006-maximum-area-use-perimeter-square-over-eight": ({ solver }: Context) => option(number(solver, "perimeter") ** 2 / 8, solver),
  "cp006-maximum-area-use-perimeter-square-over-four": ({ solver }: Context) => option(number(solver, "perimeter") ** 2 / 4, solver),
  "cp006-maximum-area-use-perimeter-square-over-thirty-two": ({ solver }: Context) => option(number(solver, "perimeter") ** 2 / 32, solver),
  "cp006-circle-square-report-circle-area": ({ solver }: Context) => option(number(solver, "circleArea"), solver),
  "cp006-circle-square-report-square-area": ({ solver }: Context) => option(number(solver, "squareArea"), solver),
  "cp006-circle-square-add-areas": ({ solver }: Context) => option(number(solver, "circleArea") + number(solver, "squareArea"), solver),
  "cp006-circle-rectangle-use-full-circumference-minus-length": ({ solver }: Context) =>
    option(number(solver, "wireLength") - number(solver, "length"), solver),
  "cp006-circle-rectangle-report-semiperimeter": ({ solver }: Context) => option(number(solver, "semiperimeter"), solver),
  "cp006-circle-rectangle-halve-breadth": ({ solver }: Context) => option(number(solver, "breadth") / 2, solver),
  "cp006-circle-area-report-source-square-area": ({ solver }: Context) => option(number(solver, "side") ** 2, solver),
  "cp006-circle-area-use-diameter-square": ({ solver }: Context) => option((2 * number(solver, "radius")) ** 2, solver),
  "cp006-circle-area-use-circumference-as-area": ({ solver }: Context) => option(number(solver, "wireLength"), solver),
  "cp006-square-area-report-circle-area": ({ solver }: Context) =>
    option(22 * number(solver, "radius") ** 2 / 7, solver),
  "cp006-square-area-use-radius-square": ({ solver }: Context) => option(number(solver, "radius") ** 2, solver),
} as const satisfies Record<string, Strategy>;