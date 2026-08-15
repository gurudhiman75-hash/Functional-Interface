import {
  generateSpatialTransformProofQuestion,
  type SpatialTransformProofQuestion,
} from "../../../../../foundation/spatial";

export const MIRROR_GEOMETRIC_PROOF_PROTOTYPE =
  "MIR-PROT-GEOMETRIC-VERTICAL-REFLECTION" as const;

export function generateMirrorGeometricProofQuestion(
  seed: string,
): SpatialTransformProofQuestion {
  return generateSpatialTransformProofQuestion({
    seed,
    chapterCode: "MIR-001",
    prototypeId: MIRROR_GEOMETRIC_PROOF_PROTOTYPE,
    requestedTransform: "REFLECT_VERTICAL",
    instructionKey: "MIR_SELECT_TRUE_VERTICAL_REFLECTION",
  });
}
