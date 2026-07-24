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
  const candidate = Number(solver.workingValues[key]);
  if (!Number.isFinite(candidate) || candidate <= 0) {
    throw new Error(`MEN-001 CP-004 illustration requires positive ${key}.`);
  }
  return candidate;
}

function sourceLengthUnit(parameters: Men001Parameters, solver: Men001SolverResult): "cm" | "m" {
  if (parameters.unitPolicy === "CENTIMETRES" || parameters.unitPolicy === "SQUARE_CENTIMETRES" || parameters.unitPolicy === "TILES") {
    return parameters.questionLanguageId === "MEN-001-QL-320" ? "cm" : solver.unit === "tiles" ? "cm" : "cm";
  }
  return "m";
}

function rectangularBand(
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): Men001ExplanationIllustration {
  const unit = sourceLengthUnit(parameters, solver);
  const square = parameters.solveMode.includes("Square");
  const recoveringWidth = parameters.solveMode === "findOuterSquarePathWidthFromArea";
  const outerLength = square ? numeric(solver, "outerSide") : numeric(solver, "outerLength");
  const outerBreadth = square ? outerLength : numeric(solver, "outerBreadth");
  const innerLength = square ? numeric(solver, "innerSide") : numeric(solver, "innerLength");
  const innerBreadth = square ? innerLength : numeric(solver, "innerBreadth");
  const pathWidth = numeric(solver, "pathWidth");
  const position = String(solver.workingValues.pathPosition ?? "BORDER");
  return {
    kind: "RECTANGULAR_BORDER_BAND",
    purpose: "OUTER_MINUS_INNER_RECTANGLE",
    placement: recoveringWidth ? "BEFORE_WIDTH_RECOVERY" : "BEFORE_AREA_SUBTRACTION",
    notToScale: true,
    labels: {
      outerLength: `${outerLength} ${unit}`,
      outerBreadth: `${outerBreadth} ${unit}`,
      innerLength: `${innerLength} ${unit}`,
      innerBreadth: `${innerBreadth} ${unit}`,
      pathWidth: recoveringWidth ? `x ${unit}` : `${pathWidth} ${unit}`,
      region: position === "OUTSIDE" ? "outside path" : position === "INSIDE" ? "inside border" : "border region",
    },
    accessibleText: `Rectangular border diagram with outer dimensions ${outerLength} ${unit} by ${outerBreadth} ${unit}, inner dimensions ${innerLength} ${unit} by ${innerBreadth} ${unit}, and ${recoveringWidth ? "unknown" : pathWidth} ${unit} uniform width; the required region is the outer rectangle minus the inner rectangle; not drawn to scale.`,
  };
}

function circularBand(
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): Men001ExplanationIllustration {
  const unit = sourceLengthUnit(parameters, solver);
  const outerRadius = numeric(solver, "outerRadius");
  const innerRadius = numeric(solver, "innerRadius");
  const pathWidth = numeric(solver, "pathWidth");
  const position = String(solver.workingValues.pathPosition ?? "BORDER");
  return {
    kind: "CIRCULAR_BORDER_BAND",
    purpose: "OUTER_MINUS_INNER_CIRCLE",
    placement: "BEFORE_AREA_SUBTRACTION",
    notToScale: true,
    labels: {
      outerRadius: `${outerRadius} ${unit}`,
      innerRadius: `${innerRadius} ${unit}`,
      pathWidth: `${pathWidth} ${unit}`,
      region: position === "OUTSIDE" ? "outside circular path" : "inside circular path",
    },
    accessibleText: `Circular path diagram with outer radius ${outerRadius} ${unit}, inner radius ${innerRadius} ${unit}, and uniform width ${pathWidth} ${unit}; the required path is the outer circle minus the inner circle; not drawn to scale.`,
  };
}

const BUILDERS: Partial<Record<Men001SolveMode, Builder>> = {
  findOuterRectangularPathArea: rectangularBand,
  findInnerRectangularPathArea: rectangularBand,
  findOuterSquarePathArea: rectangularBand,
  findInnerSquarePathArea: rectangularBand,
  findRectangularPathCost: rectangularBand,
  findOuterSquarePathWidthFromArea: rectangularBand,
  findRectangularBorderTilesRequired: rectangularBand,
  findOuterCircularPathArea: circularBand,
  findInnerCircularPathArea: circularBand,
  findCircularPathCost: circularBand,
};

export function hasMen001Cp004ExplanationIllustration(mode: Men001SolveMode) {
  return mode in BUILDERS;
}

export function buildMen001Cp004ExplanationIllustration(
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): Men001ExplanationIllustration | undefined {
  return BUILDERS[parameters.solveMode]?.(parameters, solver);
}
