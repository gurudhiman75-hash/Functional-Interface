import type {
  Men001ExplanationIllustration,
  Men001Parameters,
  Men001SolverResult,
} from "./types";
import type { Men001SolveMode } from "./solve-mode-registry.all";

const AREA_ADDITION_MODES = new Set<Men001SolveMode>([
  "findRectangleSemicircleCompositeArea",
  "findStadiumCompositeArea",
  "findRectangleTriangleCompositeArea",
  "findTwoRectangleCompositeArea",
]);

const AREA_SUBTRACTION_MODES = new Set<Men001SolveMode>([
  "findLShapeAreaBySubtraction",
  "findSquareMinusCircleShadedArea",
  "findCircleMinusSquareShadedArea",
  "findRectangleMinusTwoSemicirclesArea",
  "findFourCornerQuadrantsShadedArea",
  "findRectangleLengthFromCompositeArea",
  "findSquareSideFromShadedArea",
]);

const INSCRIBED_MODES = new Set<Men001SolveMode>([
  "findInscribedCircleAreaInSquare",
  "findInscribedSquareAreaInCircle",
  "findLargestCircleRadiusInRectangle",
]);

const PERIMETER_MODES = new Set<Men001SolveMode>([
  "findRectangleSemicircleCompositePerimeter",
  "findStadiumCompositePerimeter",
  "findLShapePerimeter",
]);

function text(value: unknown, fallback: string) {
  return value === undefined ? fallback : String(value);
}

function linearUnit(parameters: Men001Parameters, solver: Men001SolverResult) {
  if (solver.unit === "cm" || solver.unit === "cm²") return "cm";
  if (solver.unit === "m" || solver.unit === "m²") return "m";
  return parameters.unitPolicy === "SQUARE_CENTIMETRES" || parameters.unitPolicy === "CENTIMETRES"
    ? "cm"
    : "m";
}

export function hasMen001Cp005ExplanationIllustration(mode: Men001SolveMode) {
  return (
    AREA_ADDITION_MODES.has(mode) ||
    AREA_SUBTRACTION_MODES.has(mode) ||
    INSCRIBED_MODES.has(mode) ||
    PERIMETER_MODES.has(mode) ||
    mode === "findRegularHexagonAreaFromSide"
  );
}

export function buildMen001Cp005ExplanationIllustration(
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): Men001ExplanationIllustration | undefined {
  const mode = parameters.solveMode;
  const values = solver.workingValues;
  const unit = linearUnit(parameters, solver);

  if (AREA_ADDITION_MODES.has(mode)) {
    const secondary = mode === "findRectangleSemicircleCompositeArea"
      ? "semicircle"
      : mode === "findStadiumCompositeArea"
        ? "two semicircles = one circle"
        : mode === "findRectangleTriangleCompositeArea"
          ? "triangle"
          : "second rectangle";
    return {
      kind: "COMPOSITE_AREA_PARTS",
      purpose: "ADD_OR_SUBTRACT_STANDARD_SHAPES",
      placement: "BEFORE_AREA_COMBINATION",
      notToScale: true,
      labels: {
        primaryShape: mode === "findStadiumCompositeArea" ? "central rectangle" : "rectangle",
        secondaryShape: secondary,
        operation: "ADD",
        sharedBoundary: "shared edge is internal and is not an extra area",
      },
      accessibleText: `The composite figure is separated into a rectangle and ${secondary}; their non-overlapping areas are added.`,
    };
  }

  if (AREA_SUBTRACTION_MODES.has(mode)) {
    const [primaryShape, secondaryShape] = mode === "findLShapeAreaBySubtraction"
      ? ["outer rectangle", "corner rectangular cut-out"]
      : mode === "findCircleMinusSquareShadedArea"
        ? ["outer circle", "inscribed square"]
        : mode === "findRectangleMinusTwoSemicirclesArea"
          ? ["rectangle", "two semicircles forming one circle"]
          : mode === "findFourCornerQuadrantsShadedArea"
            ? ["square", "four corner quadrants forming one circle"]
            : mode === "findRectangleLengthFromCompositeArea"
              ? ["complete rectangle-plus-semicircle figure", "known semicircle area"]
              : ["square", "inscribed circle"];
    return {
      kind: "COMPOSITE_AREA_PARTS",
      purpose: "ADD_OR_SUBTRACT_STANDARD_SHAPES",
      placement: "BEFORE_AREA_COMBINATION",
      notToScale: true,
      labels: {
        primaryShape,
        secondaryShape,
        operation: "SUBTRACT",
        sharedBoundary: mode === "findRectangleLengthFromCompositeArea"
          ? "remove the curved component before recovering the rectangle"
          : "only the unremoved region is counted",
      },
      accessibleText: `The required region is obtained by taking the ${primaryShape} and subtracting the ${secondaryShape}.`,
    };
  }

  if (INSCRIBED_MODES.has(mode)) {
    const relation = mode === "findInscribedCircleAreaInSquare"
      ? `circle diameter = square side = ${text(values.side, "given side")} ${unit}`
      : mode === "findInscribedSquareAreaInCircle"
        ? `square diagonal = circle diameter = ${text(values.diameter, "given diameter")} ${unit}`
        : `largest-circle diameter = smaller rectangle side = ${text(values.smallerSide, "smaller side")} ${unit}`;
    return {
      kind: "INSCRIBED_PLANE_RELATION",
      purpose: "CONNECT_OUTER_AND_INNER_MEASURES",
      placement: "BEFORE_INSCRIBED_CALCULATION",
      notToScale: true,
      labels: {
        outerShape: mode === "findInscribedCircleAreaInSquare"
          ? "square"
          : mode === "findInscribedSquareAreaInCircle"
            ? "circle"
            : "rectangle",
        innerShape: mode === "findInscribedSquareAreaInCircle" ? "square" : "circle",
        relation,
      },
      accessibleText: `The inner figure touches the limiting sides of the outer figure, so ${relation}.`,
    };
  }

  if (mode === "findRegularHexagonAreaFromSide") {
    return {
      kind: "REGULAR_HEXAGON_SPLIT",
      purpose: "SIX_EQUILATERAL_TRIANGLES",
      placement: "BEFORE_AREA_ADDITION",
      notToScale: true,
      labels: {
        side: `${text(values.side, "a")} ${unit}`,
        triangleCount: "6",
      },
      accessibleText: `The regular hexagon is divided from its centre into six congruent equilateral triangles, each with side ${text(values.side, "a")} ${unit}.`,
    };
  }

  if (PERIMETER_MODES.has(mode)) {
    const straightBoundary = mode === "findRectangleSemicircleCompositePerimeter"
      ? `two lengths and one breadth`
      : mode === "findStadiumCompositePerimeter"
        ? `two straight sides of ${text(values.straightLength, "l")} ${unit}`
        : `all exposed straight segments of the L-shape`;
    const curvedBoundary = mode === "findRectangleSemicircleCompositePerimeter"
      ? `one semicircular arc`
      : mode === "findStadiumCompositePerimeter"
        ? `two semicircular arcs forming one full circumference`
        : `none`;
    return {
      kind: "COMPOSITE_EXPOSED_BOUNDARY",
      purpose: "COUNT_ONLY_OUTER_BOUNDARY",
      placement: "BEFORE_PERIMETER_ADDITION",
      notToScale: true,
      labels: {
        straightBoundary,
        curvedBoundary,
        omittedSharedEdge: mode === "findLShapePerimeter"
          ? "removed outer pieces are replaced by equal inner pieces"
          : "the shared attachment edge is internal",
      },
      accessibleText: `Only the exposed boundary is counted: ${straightBoundary}; curved part: ${curvedBoundary}. Internal shared edges are omitted.`,
    };
  }

  return undefined;
}
