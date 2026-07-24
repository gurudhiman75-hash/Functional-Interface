import type {
  Men001ExplanationIllustration,
  Men001Parameters,
  Men001SolverResult,
} from "./types";
import type { Men001SolveMode } from "./solve-mode-registry.all";

type Builder = (
  parameters: Men001Parameters,
  solver: Men001SolverResult,
) => Men001ExplanationIllustration;

function numeric(solver: Men001SolverResult, key: string) {
  const value = Number(solver.workingValues[key]);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`MEN-001 exhaustiveness illustration requires positive ${key}.`);
  }
  return value;
}

function sourceUnit(parameters: Men001Parameters, solver: Men001SolverResult): "cm" | "m" {
  if (solver.unit === "cm" || solver.unit === "cm²") return "cm";
  if (solver.unit === "m" || solver.unit === "m²") return "m";
  if (
    parameters.solveMode === "findRadiusFromSectorAreaAndAngle" ||
    parameters.solveMode === "findInnerRectangularPathTilesRequired"
  ) {
    return "m";
  }
  return "cm";
}

function reverseCircleRadius(
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): Men001ExplanationIllustration {
  const unit = sourceUnit(parameters, solver);
  const angleDegrees = numeric(solver, "angleDegrees");
  const arcMode = parameters.solveMode === "findRadiusFromArcLengthAndAngle";
  const measuredPart = arcMode
    ? `arc length = ${numeric(solver, "arcLength")} ${unit}`
    : `sector area = ${numeric(solver, "sectorArea")} ${unit}²`;
  return {
    kind: "CIRCLE_CENTRAL_ANGLE",
    purpose: "ARC_OR_SECTOR_FRACTION",
    placement: "BEFORE_FRACTION_CALCULATION",
    notToScale: true,
    labels: {
      radius: `r = x ${unit}`,
      centralAngle: `${angleDegrees}°`,
      measuredPart,
    },
    accessibleText: `Circle with unknown radius r, central angle ${angleDegrees} degrees, and known ${measuredPart}; the highlighted arc or sector is used to recover the radius; not drawn to scale.`,
  };
}

function reverseInnerAnnulus(
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): Men001ExplanationIllustration {
  const unit = sourceUnit(parameters, solver);
  const outerRadius = numeric(solver, "outerRadius");
  return {
    kind: "ANNULUS_RADII",
    purpose: "OUTER_MINUS_INNER_CIRCLE",
    placement: "BEFORE_AREA_SUBTRACTION",
    notToScale: true,
    labels: {
      outerRadius: `${outerRadius} ${unit}`,
      innerRadius: `r = x ${unit}`,
    },
    accessibleText: `Circular ring with known outer radius ${outerRadius} ${unit} and unknown inner radius r; the ring area equals the outer circle area minus the inner circle area; not drawn to scale.`,
  };
}

function rectangularWidth(
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): Men001ExplanationIllustration {
  const unit = sourceUnit(parameters, solver);
  const outside = parameters.solveMode === "findOuterRectangularPathWidthFromArea";
  return {
    kind: "RECTANGULAR_BORDER_BAND",
    purpose: "OUTER_MINUS_INNER_RECTANGLE",
    placement: "BEFORE_WIDTH_RECOVERY",
    notToScale: true,
    labels: {
      outerLength: `${numeric(solver, "outerLength")} ${unit}`,
      outerBreadth: `${numeric(solver, "outerBreadth")} ${unit}`,
      innerLength: `${numeric(solver, "innerLength")} ${unit}`,
      innerBreadth: `${numeric(solver, "innerBreadth")} ${unit}`,
      pathWidth: `x ${unit}`,
      region: outside ? "outside path" : "inside path",
    },
    accessibleText: `Rectangular ${outside ? "outside" : "inside"} border with outer dimensions ${numeric(solver, "outerLength")} ${unit} by ${numeric(solver, "outerBreadth")} ${unit}, inner dimensions ${numeric(solver, "innerLength")} ${unit} by ${numeric(solver, "innerBreadth")} ${unit}, and unknown uniform width x; not drawn to scale.`,
  };
}

function circularWidth(
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): Men001ExplanationIllustration {
  const unit = sourceUnit(parameters, solver);
  const outside = parameters.solveMode === "findOuterCircularPathWidthFromArea";
  return {
    kind: "CIRCULAR_BORDER_BAND",
    purpose: "OUTER_MINUS_INNER_CIRCLE",
    placement: "BEFORE_AREA_SUBTRACTION",
    notToScale: true,
    labels: {
      outerRadius: `${numeric(solver, "outerRadius")} ${unit}`,
      innerRadius: `${numeric(solver, "innerRadius")} ${unit}`,
      pathWidth: `x ${unit}`,
      region: outside ? "outside circular path" : "inside circular path",
    },
    accessibleText: `Circular ${outside ? "outside" : "inside"} path with outer radius ${numeric(solver, "outerRadius")} ${unit}, inner radius ${numeric(solver, "innerRadius")} ${unit}, and unknown uniform width x; the path is the difference of the two circles; not drawn to scale.`,
  };
}

function innerPathTiles(
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): Men001ExplanationIllustration {
  const unit = sourceUnit(parameters, solver);
  return {
    kind: "RECTANGULAR_BORDER_BAND",
    purpose: "OUTER_MINUS_INNER_RECTANGLE",
    placement: "BEFORE_AREA_SUBTRACTION",
    notToScale: true,
    labels: {
      outerLength: `${numeric(solver, "outerLength")} ${unit}`,
      outerBreadth: `${numeric(solver, "outerBreadth")} ${unit}`,
      innerLength: `${numeric(solver, "innerLength")} ${unit}`,
      innerBreadth: `${numeric(solver, "innerBreadth")} ${unit}`,
      pathWidth: `${numeric(solver, "pathWidth")} ${unit}`,
      region: "inside paved path",
    },
    accessibleText: `Rectangular courtyard with an inside paved border ${numeric(solver, "pathWidth")} ${unit} wide; the border area is the outer rectangle minus the inner rectangle before division by tile area; not drawn to scale.`,
  };
}

const BUILDERS: Partial<Record<Men001SolveMode, Builder>> = {
  findRadiusFromArcLengthAndAngle: reverseCircleRadius,
  findRadiusFromSectorAreaAndAngle: reverseCircleRadius,
  findInnerRadiusFromAnnulusArea: reverseInnerAnnulus,
  findOuterRectangularPathWidthFromArea: rectangularWidth,
  findInnerRectangularPathWidthFromArea: rectangularWidth,
  findOuterCircularPathWidthFromArea: circularWidth,
  findInnerCircularPathWidthFromArea: circularWidth,
  findInnerRectangularPathTilesRequired: innerPathTiles,
};

export function hasMen001ExhaustivenessExplanationIllustration(mode: Men001SolveMode) {
  return mode in BUILDERS;
}

export function buildMen001ExhaustivenessExplanationIllustration(
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): Men001ExplanationIllustration | undefined {
  return BUILDERS[parameters.solveMode]?.(parameters, solver);
}
