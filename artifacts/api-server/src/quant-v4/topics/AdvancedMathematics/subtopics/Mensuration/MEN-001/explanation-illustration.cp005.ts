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
  "findCircleRadiusFromCircleMinusSquareShadedArea",
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
  "findJoinedRectanglesCompositePerimeter",
  "findSquareWithCircularHoleBoundary",
  "findStadiumStraightLengthFromPerimeter",
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
    mode === "findRegularHexagonAreaFromSide" ||
    mode === "findRegularHexagonAreaFromPerimeter" ||
    mode === "findOverlappingRectanglesUnionArea"
  );
}

export function buildMen001Cp005ExplanationIllustration(
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): Men001ExplanationIllustration | undefined {
  const mode = parameters.solveMode;
  const values = solver.workingValues;
  const unit = linearUnit(parameters, solver);

  if (mode === "findOverlappingRectanglesUnionArea") {
    return {
      kind: "COMPOSITE_AREA_PARTS",
      purpose: "ADD_OR_SUBTRACT_STANDARD_SHAPES",
      placement: "BEFORE_AREA_COMBINATION",
      notToScale: true,
      labels: {
        primaryShape: `rectangle 1: ${text(values.rectangleArea, "A₁")} ${solver.unit}`,
        secondaryShape: `rectangle 2: ${text(values.componentArea, "A₂")} ${solver.unit}`,
        operation: "ADD BOTH, THEN SUBTRACT THE COMMON OVERLAP ONCE",
        sharedBoundary: `overlap: ${text(values.overlapArea, "Aoverlap")} ${solver.unit}`,
      },
      accessibleText:
        `Two rectangles overlap in a common rectangular region. Add their full areas and subtract the ${text(values.overlapArea, "common")} ${solver.unit} overlap once because it was counted in both rectangles.`,
    };
  }

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
      : mode === "findCircleMinusSquareShadedArea" ||
          mode === "findCircleRadiusFromCircleMinusSquareShadedArea"
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
        operation: mode === "findCircleRadiusFromCircleMinusSquareShadedArea"
          ? "USE THE DIFFERENCE TO RECOVER THE RADIUS"
          : "SUBTRACT",
        sharedBoundary: mode === "findRectangleLengthFromCompositeArea"
          ? "remove the curved component before recovering the rectangle"
          : mode === "findCircleRadiusFromCircleMinusSquareShadedArea"
            ? "square diagonal equals the circle diameter"
            : "only the unremoved region is counted",
      },
      accessibleText: mode === "findCircleRadiusFromCircleMinusSquareShadedArea"
        ? "The square is inscribed in the circle, so its diagonal is the circle diameter. The stated circle-minus-square area is used to recover the radius."
        : `The required region is obtained by taking the ${primaryShape} and subtracting the ${secondaryShape}.`,
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

  if (
    mode === "findRegularHexagonAreaFromSide" ||
    mode === "findRegularHexagonAreaFromPerimeter"
  ) {
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
    if (mode === "findSquareWithCircularHoleBoundary") {
      return {
        kind: "COMPOSITE_EXPOSED_BOUNDARY",
        purpose: "COUNT_ONLY_OUTER_BOUNDARY",
        placement: "BEFORE_PERIMETER_ADDITION",
        notToScale: true,
        labels: {
          straightBoundary: `outer square perimeter: ${text(values.outerPerimeter, "4s")} ${unit}`,
          curvedBoundary: `inner circular boundary: ${text(values.innerCircumference, "2πr")} ${unit}`,
          omittedSharedEdge: "none; both the outer and inner boundaries touch the remaining region",
        },
        accessibleText: "The remaining land is bounded by the outside square and by the circular pond edge, so both boundary lengths are included.",
      };
    }

    const straightBoundary = mode === "findRectangleSemicircleCompositePerimeter"
      ? "two lengths and one breadth"
      : mode === "findStadiumCompositePerimeter" ||
          mode === "findStadiumStraightLengthFromPerimeter"
        ? `two equal straight stadium sides of ${text(values.straightLength, "l")} ${unit}`
        : mode === "findJoinedRectanglesCompositePerimeter"
          ? "the exposed segments of both rectangles"
          : "all exposed straight segments of the L-shape";
    const curvedBoundary = mode === "findRectangleSemicircleCompositePerimeter"
      ? "one semicircular arc"
      : mode === "findStadiumCompositePerimeter" ||
          mode === "findStadiumStraightLengthFromPerimeter"
        ? "two semicircular arcs forming one full circumference"
        : "none";
    const omittedSharedEdge = mode === "findLShapePerimeter"
      ? "removed outer pieces are replaced by equal inner pieces"
      : mode === "findJoinedRectanglesCompositePerimeter"
        ? `shared attachment edge ${text(values.sharedEdge, "s")} ${unit} is omitted from both rectangles`
        : mode === "findStadiumStraightLengthFromPerimeter"
          ? "remove the curved boundary before splitting the remaining length equally"
          : "the shared attachment edge is internal";
    return {
      kind: "COMPOSITE_EXPOSED_BOUNDARY",
      purpose: "COUNT_ONLY_OUTER_BOUNDARY",
      placement: "BEFORE_PERIMETER_ADDITION",
      notToScale: true,
      labels: {
        straightBoundary,
        curvedBoundary,
        omittedSharedEdge,
      },
      accessibleText: `Only the relevant exposed boundary is counted: ${straightBoundary}; curved part: ${curvedBoundary}. ${omittedSharedEdge}.`,
    };
  }

  return undefined;
}
