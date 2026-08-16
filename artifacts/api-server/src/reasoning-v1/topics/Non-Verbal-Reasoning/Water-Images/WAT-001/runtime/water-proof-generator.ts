import {
  generateSpatialTransformProofQuestion,
  type SpatialTransformProofQuestion,
} from "../../../../../foundation/spatial";

export const WATER_GEOMETRIC_PROOF_PROTOTYPE =
  "WAT-PROT-GEOMETRIC-HORIZONTAL-REFLECTION" as const;

export function generateWaterGeometricProofQuestion(
  seed: string,
): SpatialTransformProofQuestion {
  return generateSpatialTransformProofQuestion({
    seed,
    chapterCode: "WAT-001",
    prototypeId: WATER_GEOMETRIC_PROOF_PROTOTYPE,
    requestedTransform: "REFLECT_HORIZONTAL",
    instructionKey: "WAT_SELECT_TRUE_HORIZONTAL_REFLECTION",
  });
}
