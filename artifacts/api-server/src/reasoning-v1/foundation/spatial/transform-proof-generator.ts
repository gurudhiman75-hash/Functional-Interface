import { spatialSceneSemanticFingerprint } from "./normalize";
import type {
  SpatialProofChapterCode,
  SpatialProofOption,
  SpatialTransformProofQuestion,
} from "./proof-types";
import { SpatialSeededRandom } from "./seed";
import {
  buildSeededAsymmetricComposition,
  SPATIAL_PROOF_AXIS,
} from "./seeded-composition";
import {
  classifySpatialSceneSymmetry,
  transformSceneByRequestedOperation,
} from "./symmetry";
import { validateSpatialTransformQuestion } from "./transform-validator";
import type {
  SpatialExplanationStep,
  SpatialRequestedTransform,
  SpatialScene,
  SpatialTransformCandidate,
} from "./types";

interface SpatialTransformProofGeneratorInput {
  seed: string;
  chapterCode: SpatialProofChapterCode;
  prototypeId: string;
  requestedTransform: Extract<
    SpatialRequestedTransform,
    "REFLECT_VERTICAL" | "REFLECT_HORIZONTAL"
  >;
  instructionKey: string;
}

function cloneSceneWithNodes(
  scene: SpatialScene,
  nodes: SpatialScene["nodes"],
  id: string,
): SpatialScene {
  return {
    ...scene,
    id,
    nodes,
    metadata: scene.metadata ? { ...scene.metadata } : undefined,
  };
}

function buildPartialReflectionCandidate(
  sourceScene: SpatialScene,
  correctScene: SpatialScene,
): SpatialScene {
  const transformedById = new Map(
    correctScene.nodes.map((node) => [node.id, node] as const),
  );

  return cloneSceneWithNodes(
    sourceScene,
    sourceScene.nodes.map((node) =>
      node.id === "marker" ? (transformedById.get(node.id) ?? node) : node,
    ),
    `${sourceScene.id}-partial-reflection`,
  );
}

function buildExplanationSteps(
  sourceScene: SpatialScene,
  correctScene: SpatialScene,
  requestedTransform: SpatialTransformProofGeneratorInput["requestedTransform"],
  correctOptionIndex: number,
): SpatialExplanationStep[] {
  const axisKind =
    requestedTransform === "REFLECT_VERTICAL" ? "VERTICAL" : "HORIZONTAL";

  return [
    {
      id: "observe-reflection-axis",
      operation: "OBSERVE_REFLECTION_AXIS",
      sourceNodeIds: sourceScene.nodes.map((node) => node.id),
      highlightNodeIds: sourceScene.nodes.map((node) => node.id),
      evidence: {
        axisKind,
        axisCoordinate: SPATIAL_PROOF_AXIS,
      },
    },
    {
      id: "apply-coordinate-reflection",
      operation: requestedTransform,
      sourceNodeIds: sourceScene.nodes.map((node) => node.id),
      resultNodeIds: correctScene.nodes.map((node) => node.id),
      highlightNodeIds: ["marker", "orientation-mark", "secondary-shape"],
      evidence: {
        requestedTransform,
        rule:
          requestedTransform === "REFLECT_VERTICAL"
            ? "LEFT_RIGHT_POSITIONS_EXCHANGE_TOP_BOTTOM_REMAIN"
            : "TOP_BOTTOM_POSITIONS_EXCHANGE_LEFT_RIGHT_REMAIN",
      },
    },
    {
      id: "verify-correct-option",
      operation: "VERIFY_CORRECT_OPTION",
      sourceNodeIds: sourceScene.nodes.map((node) => node.id),
      resultNodeIds: correctScene.nodes.map((node) => node.id),
      evidence: {
        correctOptionIndex,
        correctOptionNumber: correctOptionIndex + 1,
        rejectedMisconceptions: [
          "AXIS_CONFUSION",
          "ROTATION_SUBSTITUTED_FOR_REFLECTION",
          "PARTIAL_REFLECTION_ERROR",
        ],
      },
    },
  ];
}

export function generateSpatialTransformProofQuestion(
  input: SpatialTransformProofGeneratorInput,
): SpatialTransformProofQuestion {
  const sourceScene = buildSeededAsymmetricComposition(input.seed);
  sourceScene.metadata = {
    ...sourceScene.metadata,
    chapterCode: input.chapterCode,
    prototypeId: input.prototypeId,
  };

  const axes = {
    axisX: SPATIAL_PROOF_AXIS,
    axisY: SPATIAL_PROOF_AXIS,
    pivot: { x: SPATIAL_PROOF_AXIS, y: SPATIAL_PROOF_AXIS },
  };
  const correctScene = transformSceneByRequestedOperation(
    sourceScene,
    input.requestedTransform,
    axes,
    `${sourceScene.id}-correct`,
  );
  const axisConfusionTransform =
    input.requestedTransform === "REFLECT_VERTICAL"
      ? "REFLECT_HORIZONTAL"
      : "REFLECT_VERTICAL";
  const axisConfusionScene = transformSceneByRequestedOperation(
    sourceScene,
    axisConfusionTransform,
    axes,
    `${sourceScene.id}-axis-confusion`,
  );
  const rotationScene = transformSceneByRequestedOperation(
    sourceScene,
    "ROTATE_180",
    axes,
    `${sourceScene.id}-rotation-substitution`,
  );
  const partialScene = buildPartialReflectionCandidate(sourceScene, correctScene);

  const unshuffledOptions: SpatialProofOption[] = [
    {
      label: "CORRECT_REFLECTION",
      scene: correctScene,
      fingerprint: spatialSceneSemanticFingerprint(correctScene),
    },
    {
      label: "AXIS_CONFUSION",
      scene: axisConfusionScene,
      fingerprint: spatialSceneSemanticFingerprint(axisConfusionScene),
    },
    {
      label: "ROTATION_SUBSTITUTED_FOR_REFLECTION",
      scene: rotationScene,
      fingerprint: spatialSceneSemanticFingerprint(rotationScene),
    },
    {
      label: "PARTIAL_REFLECTION_ERROR",
      scene: partialScene,
      fingerprint: spatialSceneSemanticFingerprint(partialScene),
    },
  ];

  const random = new SpatialSeededRandom(`${input.seed}:option-order`);
  const options = random.shuffle(unshuffledOptions);
  const correctOptionIndex = options.findIndex(
    (option) => option.label === "CORRECT_REFLECTION",
  );
  if (correctOptionIndex < 0) {
    throw new Error("Spatial proof option shuffle lost the correct option.");
  }

  const validationCandidates: SpatialTransformCandidate[] = options.map(
    (option) => ({ label: option.label, scene: option.scene }),
  );
  const validation = validateSpatialTransformQuestion({
    sourceScene,
    requestedTransform: input.requestedTransform,
    axes,
    candidates: validationCandidates,
  });
  if (!validation.ok) {
    throw new Error(
      `Invalid ${input.chapterCode} proof question for seed '${input.seed}': ${validation.errors
        .map((entry) => entry.code)
        .join(", ")}`,
    );
  }

  const sourceFingerprint = spatialSceneSemanticFingerprint(sourceScene);
  const correctFingerprint = spatialSceneSemanticFingerprint(correctScene);
  const symmetryProfile = classifySpatialSceneSymmetry(sourceScene, axes);
  const explanationSteps = buildExplanationSteps(
    sourceScene,
    correctScene,
    input.requestedTransform,
    correctOptionIndex,
  );

  return {
    familyCode: "SPA-001",
    chapterCode: input.chapterCode,
    prototypeId: input.prototypeId,
    seed: input.seed,
    requestedTransform: input.requestedTransform,
    instructionKey: input.instructionKey,
    sourceScene,
    options,
    correctOptionIndex,
    solverEvidence: {
      requestedTransform: input.requestedTransform,
      axisKind:
        input.requestedTransform === "REFLECT_VERTICAL"
          ? "VERTICAL"
          : "HORIZONTAL",
      axisCoordinate: SPATIAL_PROOF_AXIS,
      sourceFingerprint,
      correctFingerprint,
      transformedNodeIds: sourceScene.nodes.map((node) => node.id),
      symmetryProfile,
      optionLabels: options.map((option) => option.label),
      optionFingerprints: options.map((option) => option.fingerprint),
      correctOptionIndex,
    },
    reviewMetadata: {
      stimulusKind: "SEEDED_GEOMETRIC_COMPOSITION",
      requestedTransform: input.requestedTransform,
      localeMode: "LANGUAGE_NEUTRAL",
      symmetryProfile,
      canonicalFingerprint: sourceFingerprint,
      correctTransformFingerprint: correctFingerprint,
      optionTransformLabels: options.map((option) => option.label),
      equivalentCandidateCheck: "PASS",
      clockGeometryCheck: "NOT_APPLICABLE",
      clockShortcutCheck: "NOT_APPLICABLE",
    },
    explanationSteps,
    lifecycle: {
      permanentQlId: null,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    },
  };
}
