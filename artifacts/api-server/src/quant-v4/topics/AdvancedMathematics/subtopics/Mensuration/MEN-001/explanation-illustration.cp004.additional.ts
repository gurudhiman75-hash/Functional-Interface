import type {
  Men001ExplanationIllustration,
  Men001Parameters,
  Men001SolverResult,
} from "./types";
import type { Men001SolveMode } from "./solve-mode-registry.all";

function value(solver: Men001SolverResult, key: string) {
  const candidate = Number(solver.workingValues[key]);
  if (!Number.isFinite(candidate) || candidate <= 0) {
    throw new Error(`MEN-001 CP-004 additional illustration requires positive ${key}.`);
  }
  return candidate;
}

export function hasMen001Cp004AdditionalExplanationIllustration(
  mode: Men001SolveMode,
) {
  return mode === "findOuterRectangularPathTilesRequired";
}

export function buildMen001Cp004AdditionalExplanationIllustration(
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): Men001ExplanationIllustration | undefined {
  if (parameters.solveMode !== "findOuterRectangularPathTilesRequired") {
    return undefined;
  }
  const outerLength = value(solver, "outerLength");
  const outerBreadth = value(solver, "outerBreadth");
  const innerLength = value(solver, "innerLength");
  const innerBreadth = value(solver, "innerBreadth");
  const pathWidth = value(solver, "pathWidth");
  return {
    kind: "RECTANGULAR_BORDER_BAND",
    purpose: "OUTER_MINUS_INNER_RECTANGLE",
    placement: "BEFORE_AREA_SUBTRACTION",
    notToScale: true,
    labels: {
      outerLength: `${outerLength} m`,
      outerBreadth: `${outerBreadth} m`,
      innerLength: `${innerLength} m`,
      innerBreadth: `${innerBreadth} m`,
      pathWidth: `${pathWidth} m`,
      region: "outside tiled path",
    },
    accessibleText: `Rectangular garden with inner dimensions ${innerLength} m by ${innerBreadth} m, enlarged to ${outerLength} m by ${outerBreadth} m by an outside path of uniform width ${pathWidth} m; the shaded band is tiled; not drawn to scale.`,
  };
}
