import { spatialSceneSemanticFingerprint } from "./normalize";
import type {
  SpatialProofOption,
  SpatialProofStimulusKind,
} from "./proof-types";
import type {
  SpatialExplanationStep,
  SpatialRequestedTransform,
  SpatialScene,
  SpatialTransformCandidate,
} from "./types";
import type { SpatialSymmetryAxes } from "./symmetry";
import { validateSpatialTransformQuestion } from "./transform-validator";

export const LOCKED_SPATIAL_PROOF_LIFECYCLE = {
  permanentQlId: null,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
} as const;

export function makeSpatialProofOption(
  label: SpatialProofOption["label"],
  scene: SpatialScene,
): SpatialProofOption {
  return {
    label,
    scene,
    fingerprint: spatialSceneSemanticFingerprint(scene),
  };
}

export function spatialAxisKind(
  transform: SpatialRequestedTransform,
): "VERTICAL" | "HORIZONTAL" {
  return transform === "REFLECT_VERTICAL" ? "VERTICAL" : "HORIZONTAL";
}

export function buildSpatialProofExplanationSteps(
  sourceScene: SpatialScene,
  correctScene: SpatialScene,
  requestedTransform: Extract<
    SpatialRequestedTransform,
    "REFLECT_VERTICAL" | "REFLECT_HORIZONTAL"
  >,
  correctOptionIndex: number,
  stimulusKind: SpatialProofStimulusKind,
): SpatialExplanationStep[] {
  return [
    {
      id: "observe",
      operation: "OBSERVATION",
      sourceNodeIds: sourceScene.nodes.map((node) => node.id),
      evidence: {
        stimulusKind,
        axisKind: spatialAxisKind(requestedTransform),
      },
    },
    {
      id: "rule",
      operation: "EXACT_REFLECTION_RULE",
      sourceNodeIds: sourceScene.nodes.map((node) => node.id),
      evidence: {
        requestedTransform,
        rule:
          requestedTransform === "REFLECT_VERTICAL"
            ? "LEFT_RIGHT_EXCHANGE_TOP_BOTTOM_STAY"
            : "TOP_BOTTOM_EXCHANGE_LEFT_RIGHT_STAY",
      },
    },
    {
      id: "application",
      operation: requestedTransform,
      sourceNodeIds: sourceScene.nodes.map((node) => node.id),
      resultNodeIds: correctScene.nodes.map((node) => node.id),
      highlightNodeIds: correctScene.nodes.map((node) => node.id),
      evidence: { transformedNodeCount: sourceScene.nodes.length },
    },
    {
      id: "check",
      operation: "VERIFY_CORRECT_OPTION",
      sourceNodeIds: sourceScene.nodes.map((node) => node.id),
      resultNodeIds: correctScene.nodes.map((node) => node.id),
      evidence: {
        correctOptionIndex,
        correctOptionNumber: correctOptionIndex + 1,
      },
    },
  ];
}

export function assertValidSpatialProofOptions(
  sourceScene: SpatialScene,
  requestedTransform: Extract<
    SpatialRequestedTransform,
    "REFLECT_VERTICAL" | "REFLECT_HORIZONTAL"
  >,
  axes: SpatialSymmetryAxes,
  options: SpatialProofOption[],
): void {
  const candidates: SpatialTransformCandidate[] = options.map((option) => ({
    label: option.label,
    scene: option.scene,
  }));
  const validation = validateSpatialTransformQuestion({
    sourceScene,
    requestedTransform,
    axes,
    candidates,
  });
  if (!validation.ok) {
    throw new Error(
      `Invalid specialised spatial proof: ${validation.errors
        .map((item) => item.code)
        .join(", ")}`,
    );
  }
}
