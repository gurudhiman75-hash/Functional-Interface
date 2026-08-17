export type TrigDiagramUsePolicy = "NONE" | "OPTIONAL" | "REQUIRED";
export type TrigDiagramPurpose = "GEOMETRIC_RECONSTRUCTION" | "SPATIAL_MODEL" | "NONE";

export interface TrigDiagramPolicy {
  solutionDiagramPolicy: TrigDiagramUsePolicy;
  stemDiagramPolicy: TrigDiagramUsePolicy;
  purpose: TrigDiagramPurpose;
  rationale: string;
}

function qlNumber(qlId: string, packageId: "TRG-001" | "TRG-002", max: number) {
  const match = new RegExp(`^${packageId}-QL-(\\d{3})$`).exec(qlId);
  if (!match) throw new Error(`Invalid ${packageId} QL id: ${qlId}`);
  const value = Number(match[1]);
  if (!Number.isInteger(value) || value < 1 || value > max) {
    throw new Error(`${qlId} is outside the locked ${packageId} permanent range 001-${String(max).padStart(3, "0")}.`);
  }
  return value;
}

const TRG_001_SOLUTION_OPTIONAL = new Set([
  92, 93, 94, 95,
  97, 98, 99, 100,
  131, 132,
]);

/**
 * TRG-001 is intentionally selective.
 *
 * CP-001 is the geometric-reconstruction block, so its solution should show the
 * right triangle that the explanation reconstructs. A small set of later
 * ratio-derived roles may also benefit from a reconstruction diagram, but the
 * standard-value, angle-reduction, identity and symbolic-expression families
 * remain diagram-free.
 */
export function trg001DiagramPolicyForQl(qlId: string): TrigDiagramPolicy {
  const n = qlNumber(qlId, "TRG-001", 144);
  if (n <= 24) {
    return {
      solutionDiagramPolicy: "REQUIRED",
      stemDiagramPolicy: "OPTIONAL",
      purpose: "GEOMETRIC_RECONSTRUCTION",
      rationale: "CP-001 solution reasoning is clearer when the reconstructed right triangle is shown; the stem may remain text-only for exam realism.",
    };
  }
  if (TRG_001_SOLUTION_OPTIONAL.has(n)) {
    return {
      solutionDiagramPolicy: "OPTIONAL",
      stemDiagramPolicy: "NONE",
      purpose: "GEOMETRIC_RECONSTRUCTION",
      rationale: "This later ratio-derived role can use a small reconstructed triangle in the explanation, but the mathematics does not require a stem figure.",
    };
  }
  return {
    solutionDiagramPolicy: "NONE",
    stemDiagramPolicy: "NONE",
    purpose: "NONE",
    rationale: "The role is primarily standard-value, angular, identity or symbolic algebra; a diagram would be decorative rather than explanatory.",
  };
}

/**
 * TRG-002 is solution-diagram-first by default.
 *
 * Every permanent QL is a spatial application. Therefore the architecture
 * requires a solution diagram unless a future permanent-ID exception is added
 * explicitly with editorial justification. Stem diagrams remain optional so
 * drawing/setting up the geometry can still be part of the exam task.
 */
export function trg002DiagramPolicyForQl(qlId: string): TrigDiagramPolicy {
  qlNumber(qlId, "TRG-002", 96);
  return {
    solutionDiagramPolicy: "REQUIRED",
    stemDiagramPolicy: "OPTIONAL",
    purpose: "SPATIAL_MODEL",
    rationale: "Heights-and-distances explanations should expose the canonical sight-line geometry after the attempt; the question stem need not reveal the setup diagram.",
  };
}

export const TRG_001_DIAGRAM_POLICY_COUNTS = {
  solutionRequired: 24,
  solutionOptional: 10,
  solutionNone: 110,
} as const;

export const TRG_002_DIAGRAM_POLICY_COUNTS = {
  solutionRequired: 96,
  solutionOptional: 0,
  solutionNone: 0,
} as const;
