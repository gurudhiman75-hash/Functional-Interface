import type {
  Men001ExplanationIllustration,
  Men001Parameters,
  Men001SolverResult,
} from "./types";
import type { Men001SolveMode } from "./solve-mode-registry.all";

type IllustrationBuilder = (
  parameters: Men001Parameters,
  solver: Men001SolverResult,
) => Men001ExplanationIllustration;

function number(solver: Men001SolverResult, key: string) {
  const value = Number(solver.workingValues[key]);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`MEN-001 CP-003 illustration requires positive ${key}.`);
  }
  return value;
}

function linearUnit(
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): "cm" | "m" {
  if (solver.unit === "cm" || solver.unit === "cm²") return "cm";
  if (solver.unit === "m" || solver.unit === "m²") return "m";
  if (
    solver.unit === "°" &&
    (parameters.solveMode === "findCentralAngleFromArcLength" ||
      parameters.solveMode === "findCentralAngleFromSectorArea")
  ) {
    return "cm";
  }
  throw new Error(
    `MEN-001 CP-003 cannot derive a linear illustration unit from ${solver.unit}.`,
  );
}

function centralAngleIllustration(
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): Men001ExplanationIllustration {
  const unit = linearUnit(parameters, solver);
  const radius = number(solver, "radius");
  const knownAngle = Number(solver.workingValues.angleDegrees);
  const recoveringAngle =
    parameters.solveMode === "findCentralAngleFromArcLength" ||
    parameters.solveMode === "findCentralAngleFromSectorArea";
  let measuredPart = "required circular part";
  if (parameters.solveMode === "findArcLength") {
    measuredPart = `arc length = x ${unit}`;
  } else if (parameters.solveMode === "findSectorArea") {
    measuredPart = `sector area = x ${unit}²`;
  } else if (parameters.solveMode === "findSectorPerimeter") {
    measuredPart = `sector perimeter = x ${unit}`;
  } else if (parameters.solveMode === "findCentralAngleFromArcLength") {
    measuredPart = `arc length = ${number(solver, "arcLength")} ${unit}`;
  } else if (parameters.solveMode === "findCentralAngleFromSectorArea") {
    measuredPart = `sector area = ${number(solver, "sectorArea")} ${unit}²`;
  }

  return {
    kind: "CIRCLE_CENTRAL_ANGLE",
    purpose: "ARC_OR_SECTOR_FRACTION",
    placement: "BEFORE_FRACTION_CALCULATION",
    notToScale: true,
    labels: {
      radius: `${radius} ${unit}`,
      centralAngle: recoveringAngle ? "x°" : `${knownAngle}°`,
      measuredPart,
    },
    accessibleText: recoveringAngle
      ? `Circle with radius ${radius} ${unit}, a highlighted arc or sector with ${measuredPart}, and unknown central angle x; not drawn to scale.`
      : `Circle with radius ${radius} ${unit}, central angle ${knownAngle} degrees, and highlighted ${measuredPart}; not drawn to scale.`,
  };
}

function annulusIllustration(
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): Men001ExplanationIllustration {
  const unit = linearUnit(parameters, solver);
  const innerRadius = number(solver, "innerRadius");
  const recoveringOuter =
    parameters.solveMode === "findOuterRadiusFromAnnulusArea";
  const outerRadius = recoveringOuter
    ? `R = x ${unit}`
    : `${number(solver, "outerRadius")} ${unit}`;
  return {
    kind: "ANNULUS_RADII",
    purpose: "OUTER_MINUS_INNER_CIRCLE",
    placement: "BEFORE_AREA_SUBTRACTION",
    notToScale: true,
    labels: {
      outerRadius,
      innerRadius: `${innerRadius} ${unit}`,
    },
    accessibleText: recoveringOuter
      ? `Circular ring with inner radius ${innerRadius} ${unit} and unknown outer radius R; the shaded ring is the outer circle minus the inner circle; not drawn to scale.`
      : `Circular ring with outer radius ${outerRadius} and inner radius ${innerRadius} ${unit}; the shaded ring is the outer circle minus the inner circle; not drawn to scale.`,
  };
}

function boundaryIllustration(
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): Men001ExplanationIllustration {
  const unit = linearUnit(parameters, solver);
  const radius = number(solver, "radius");
  const semicircle = parameters.solveMode === "findSemicirclePerimeter";
  const curvedBoundary = semicircle
    ? `${number(solver, "semicircleArc")} ${unit}`
    : `${number(solver, "quadrantArc")} ${unit}`;
  return {
    kind: "CIRCLE_PART_BOUNDARY",
    purpose: "CURVE_PLUS_STRAIGHT_EDGES",
    placement: "BEFORE_PERIMETER_ADDITION",
    notToScale: true,
    labels: {
      radius: `${radius} ${unit}`,
      curvedBoundary,
      straightEdges: semicircle
        ? `diameter = ${2 * radius} ${unit}`
        : `two radii = ${2 * radius} ${unit}`,
    },
    accessibleText: semicircle
      ? `Semicircle showing its curved boundary ${curvedBoundary} and straight diameter ${2 * radius} ${unit}; both parts form the total perimeter; not drawn to scale.`
      : `Quadrant showing its curved boundary ${curvedBoundary} and two straight radii totalling ${2 * radius} ${unit}; all parts form the total perimeter; not drawn to scale.`,
  };
}

const BUILDERS: Partial<Record<Men001SolveMode, IllustrationBuilder>> = {
  findSemicirclePerimeter: boundaryIllustration,
  findQuadrantPerimeter: boundaryIllustration,
  findArcLength: centralAngleIllustration,
  findSectorArea: centralAngleIllustration,
  findSectorPerimeter: centralAngleIllustration,
  findCentralAngleFromArcLength: centralAngleIllustration,
  findCentralAngleFromSectorArea: centralAngleIllustration,
  findAnnulusArea: annulusIllustration,
  findOuterRadiusFromAnnulusArea: annulusIllustration,
};

export function hasMen001Cp003ExplanationIllustration(mode: Men001SolveMode) {
  return mode in BUILDERS;
}

export function buildMen001Cp003ExplanationIllustration(
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): Men001ExplanationIllustration | undefined {
  return BUILDERS[parameters.solveMode]?.(parameters, solver);
}
