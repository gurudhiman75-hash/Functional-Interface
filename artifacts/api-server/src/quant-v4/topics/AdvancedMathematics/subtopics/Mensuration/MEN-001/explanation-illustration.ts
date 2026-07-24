import type {
  Men001ExplanationIllustration,
  Men001Parameters,
  Men001SolverResult,
} from "./types";
import type { Men001SolveMode } from "./solve-mode-registry";

type IllustrationBuilder = (
  parameters: Men001Parameters,
  solver: Men001SolverResult,
) => Men001ExplanationIllustration;

function requiredNumber(solver: Men001SolverResult, key: string) {
  const value = Number(solver.workingValues[key]);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`MEN-001 explanation illustration requires positive ${key}.`);
  }
  return value;
}

function linearUnit(solver: Men001SolverResult): "cm" | "m" {
  if (solver.unit === "cm" || solver.unit === "cm²") return "cm";
  if (solver.unit === "m" || solver.unit === "m²") return "m";
  throw new Error(`MEN-001 cannot derive a length unit for illustration from ${solver.unit}.`);
}

function buildHeronSideMap(
  _parameters: Men001Parameters,
  solver: Men001SolverResult,
): Men001ExplanationIllustration {
  const unit = linearUnit(solver);
  const sideA = requiredNumber(solver, "sideA");
  const sideB = requiredNumber(solver, "sideB");
  const sideC = requiredNumber(solver, "sideC");
  return {
    kind: "TRIANGLE_SIDE_LABELS",
    purpose: "HERON_SIDE_MAPPING",
    placement: "AFTER_SIDE_RECOVERY",
    notToScale: true,
    labels: {
      sideA: `${sideA} ${unit}`,
      sideB: `${sideB} ${unit}`,
      sideC: `${sideC} ${unit}`,
    },
    accessibleText: `Triangle with side lengths ${sideA} ${unit}, ${sideB} ${unit}, and ${sideC} ${unit}; not drawn to scale.`,
  };
}

function buildIsoscelesAltitudeMap(
  _parameters: Men001Parameters,
  solver: Men001SolverResult,
): Men001ExplanationIllustration {
  const unit = linearUnit(solver);
  const equalSide = requiredNumber(solver, "equalSide");
  const base = requiredNumber(solver, "base");
  const halfBase = requiredNumber(solver, "halfBase");
  const height = requiredNumber(solver, "height");
  return {
    kind: "ISOSCELES_ALTITUDE_SPLIT",
    purpose: "ALTITUDE_BISECTS_BASE",
    placement: "BEFORE_PYTHAGORAS",
    notToScale: true,
    labels: {
      equalSide: `${equalSide} ${unit}`,
      base: `${base} ${unit}`,
      halfBase: `${halfBase} ${unit}`,
      height: `${height} ${unit}`,
    },
    accessibleText: `Isosceles triangle with equal sides ${equalSide} ${unit}, base ${base} ${unit}, and an altitude that bisects the base into two ${halfBase} ${unit} segments; altitude ${height} ${unit}; not drawn to scale.`,
  };
}

const MEN_001_EXPLANATION_ILLUSTRATION_BUILDERS: Partial<
  Record<Men001SolveMode, IllustrationBuilder>
> = {
  findTriangleAreaHeron: buildHeronSideMap,
  findTriangleAreaFromSideRatioAndPerimeter: buildHeronSideMap,
  findIsoscelesTriangleArea: buildIsoscelesAltitudeMap,
  findIsoscelesHeight: buildIsoscelesAltitudeMap,
};

export function hasMen001ExplanationIllustration(mode: Men001SolveMode) {
  return mode in MEN_001_EXPLANATION_ILLUSTRATION_BUILDERS;
}

export function buildMen001ExplanationIllustration(
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): Men001ExplanationIllustration | undefined {
  return MEN_001_EXPLANATION_ILLUSTRATION_BUILDERS[parameters.solveMode]?.(
    parameters,
    solver,
  );
}
