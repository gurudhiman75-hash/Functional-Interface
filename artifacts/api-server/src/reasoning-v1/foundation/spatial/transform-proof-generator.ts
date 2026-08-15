import { validateSpatialPerceptualOptionUniquenessV2 } from "./gap-question-perceptual-v2";
import { spatialSceneSemanticFingerprint } from "./normalize";
import { validateMarkerClearance } from "./perceptual-validator";
import type {
  SpatialLearnerExplanation,
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
  SpatialCircleNode,
  SpatialExplanationStep,
  SpatialNode,
  SpatialPoint,
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

function orientableNodePoints(node: SpatialNode): SpatialPoint[] | null {
  if (node.kind === "line") return [node.start, node.end];
  if (node.kind === "polygon" || node.kind === "polyline") return node.points;
  return null;
}

function localNodeCenter(node: SpatialNode): SpatialPoint | null {
  const points = orientableNodePoints(node);
  if (!points?.length) return null;
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  return {
    x: (Math.min(...xs) + Math.max(...xs)) / 2,
    y: (Math.min(...ys) + Math.max(...ys)) / 2,
  };
}

type InnerPropertyMutation =
  | "LOCAL_VERTICAL_FLIP"
  | "LOCAL_HORIZONTAL_FLIP"
  | "TOGGLE_FILL";

function mutateInnerProperty(
  node: SpatialNode,
  mutation: InnerPropertyMutation,
): SpatialNode | null {
  if (mutation === "TOGGLE_FILL") {
    if (node.kind !== "circle") return null;
    const currentFill = node.style?.fill ?? "none";
    return {
      ...node,
      style: {
        ...(node.style ?? {}),
        fill: currentFill === "none" ? "#d1d5db" : "none",
      },
    };
  }

  const center = localNodeCenter(node);
  if (!center) return null;
  const mutatePoint = (point: SpatialPoint): SpatialPoint =>
    mutation === "LOCAL_VERTICAL_FLIP"
      ? { x: 2 * center.x - point.x, y: point.y }
      : { x: point.x, y: 2 * center.y - point.y };

  if (node.kind === "line") {
    return {
      ...node,
      start: mutatePoint(node.start),
      end: mutatePoint(node.end),
    };
  }
  if (node.kind === "polygon" || node.kind === "polyline") {
    return {
      ...node,
      points: node.points.map(mutatePoint),
    };
  }
  return null;
}

function innerPropertyChangeScore(
  original: SpatialNode,
  mutated: SpatialNode,
): number {
  const before = orientableNodePoints(original);
  const after = orientableNodePoints(mutated);
  if (!before || !after || before.length !== after.length) {
    return JSON.stringify(original) === JSON.stringify(mutated) ? 0 : 6;
  }
  return Math.max(
    ...before.map((point, index) => {
      const other = after[index]!;
      return Math.hypot(point.x - other.x, point.y - other.y);
    }),
  );
}

function buildOuterMatchedInnerPropertyCandidate(
  correctScene: SpatialScene,
  competingScenes: SpatialScene[],
): SpatialScene {
  const original = correctScene.nodes.find(
    (node) => node.id === "secondary-shape",
  );
  if (!original) {
    throw new Error(
      `${correctScene.id}: missing internal secondary feature for premium mirror distractor.`,
    );
  }

  const mutationModes: InnerPropertyMutation[] = original.kind === "circle"
    ? ["TOGGLE_FILL"]
    : ["LOCAL_VERTICAL_FLIP", "LOCAL_HORIZONTAL_FLIP"];
  const candidates: Array<{ scene: SpatialScene; score: number }> = [];

  for (const mutation of mutationModes) {
    const mutated = mutateInnerProperty(original, mutation);
    if (!mutated) continue;
    const scene = cloneSceneWithNodes(
      correctScene,
      correctScene.nodes.map((node) =>
        node.id === "secondary-shape" ? mutated : node,
      ),
      `${correctScene.id}-outer-match-inner-property-${mutation.toLowerCase()}`,
    );
    if (
      spatialSceneSemanticFingerprint(scene) ===
      spatialSceneSemanticFingerprint(correctScene)
    ) {
      continue;
    }
    if (!validateMarkerClearance(scene).ok) continue;
    const perceptual = validateSpatialPerceptualOptionUniquenessV2([
      correctScene,
      ...competingScenes,
      scene,
    ]);
    if (!perceptual.ok) continue;
    const score = innerPropertyChangeScore(original, mutated);
    if (score < 4) continue;
    candidates.push({ scene, score });
  }

  candidates.sort((left, right) => right.score - left.score);
  const selected = candidates[0]?.scene;
  if (!selected) {
    throw new Error(
      `${correctScene.id}: unable to build a visible inner-property mirror distractor without changing the outer figure.`,
    );
  }
  return selected;
}

function buildExplanationSteps(
  sourceScene: SpatialScene,
  correctScene: SpatialScene,
  requestedTransform: SpatialTransformProofGeneratorInput["requestedTransform"],
  correctOptionIndex: number,
): SpatialExplanationStep[] {
  const axisKind =
    requestedTransform === "REFLECT_VERTICAL" ? "VERTICAL" : "HORIZONTAL";
  const finalMisconception =
    requestedTransform === "REFLECT_VERTICAL"
      ? "OUTER_SHAPE_CORRECT_INNER_PROPERTY_WRONG"
      : "PARTIAL_REFLECTION_ERROR";

  return [
    {
      id: "observe",
      operation: "OBSERVATION",
      sourceNodeIds: sourceScene.nodes.map((node) => node.id),
      evidence: {
        stimulusKind: "SEEDED_GEOMETRIC_COMPOSITION",
        axisKind,
        templateKind: String(sourceScene.metadata?.templateKind ?? "UNSPECIFIED"),
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
            ? "LEFT_RIGHT_POSITIONS_EXCHANGE_TOP_BOTTOM_REMAIN"
            : "TOP_BOTTOM_POSITIONS_EXCHANGE_LEFT_RIGHT_REMAIN",
      },
    },
    {
      id: "application",
      operation: requestedTransform,
      sourceNodeIds: sourceScene.nodes.map((node) => node.id),
      resultNodeIds: correctScene.nodes.map((node) => node.id),
      highlightNodeIds: ["marker", "orientation-mark", "secondary-shape"],
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
        rejectedMisconceptions: [
          "AXIS_CONFUSION",
          "ROTATION_SUBSTITUTED_FOR_REFLECTION",
          finalMisconception,
        ],
      },
    },
  ];
}

function nodeAnchor(node: SpatialNode | undefined): SpatialPoint | null {
  if (!node) return null;
  if (node.kind === "circle" || node.kind === "arc") return node.center;
  if (node.kind === "line") {
    return {
      x: (node.start.x + node.end.x) / 2,
      y: (node.start.y + node.end.y) / 2,
    };
  }
  const points = node.points;
  return {
    x: points.reduce((sum, point) => sum + point.x, 0) / points.length,
    y: points.reduce((sum, point) => sum + point.y, 0) / points.length,
  };
}

function horizontalSide(point: SpatialPoint): string {
  return point.x < SPATIAL_PROOF_AXIS ? "left" : "right";
}

function verticalSide(point: SpatialPoint): string {
  return point.y < SPATIAL_PROOF_AXIS ? "upper" : "lower";
}

function positionLabel(point: SpatialPoint): string {
  return `${verticalSide(point)}-${horizontalSide(point)}`;
}

function buildLearnerExplanation(
  sourceScene: SpatialScene,
  correctScene: SpatialScene,
  requestedTransform: SpatialTransformProofGeneratorInput["requestedTransform"],
  correctOptionIndex: number,
): SpatialLearnerExplanation {
  const isMirror = requestedTransform === "REFLECT_VERTICAL";
  const sourceMarker = sourceScene.nodes.find(
    (node): node is SpatialCircleNode => node.id === "marker" && node.kind === "circle",
  );
  const correctMarker = correctScene.nodes.find(
    (node): node is SpatialCircleNode => node.id === "marker" && node.kind === "circle",
  );
  const sourceSecondary = nodeAnchor(
    sourceScene.nodes.find((node) => node.id === "secondary-shape"),
  );
  const correctSecondary = nodeAnchor(
    correctScene.nodes.find((node) => node.id === "secondary-shape"),
  );
  const markerMovement =
    sourceMarker && correctMarker
      ? `The black marker moves from the ${positionLabel(
          sourceMarker.center,
        )} area to the ${positionLabel(correctMarker.center)} area.`
      : "Track the black marker first.";
  const secondaryMovement =
    sourceSecondary && correctSecondary
      ? `The secondary figure moves from ${positionLabel(
          sourceSecondary,
        )} to ${positionLabel(correctSecondary)}.`
      : "Then track the secondary figure.";

  return {
    observation: isMirror
      ? `${markerMovement} Its height must remain unchanged because the mirror line is vertical.`
      : `${markerMovement} Its horizontal position must remain unchanged because the water line is horizontal.`,
    rule: isMirror
      ? "Exchange left and right for every part while keeping all upper–lower positions unchanged."
      : "Exchange upper and lower positions for every part while keeping all left–right positions unchanged.",
    application: `${secondaryMovement} The orientation mark must also reverse with the complete figure; it cannot remain in its original orientation.`,
    check: isMirror
      ? `Option ${correctOptionIndex + 1} is the only complete reflection. One tempting choice has the same outer mirrored figure and the same positions but exactly one inner detail is wrong. Check the inside of the figure before choosing.`
      : `Option ${correctOptionIndex + 1} is the only complete reflection. The other choices use the wrong axis, rotate the whole figure, or move only the black marker.`,
  };
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
  const fourthScene =
    input.requestedTransform === "REFLECT_VERTICAL"
      ? buildOuterMatchedInnerPropertyCandidate(correctScene, [
          axisConfusionScene,
          rotationScene,
        ])
      : buildPartialReflectionCandidate(sourceScene, correctScene);

  const clearanceChecks = [
    sourceScene,
    correctScene,
    axisConfusionScene,
    rotationScene,
    fourthScene,
  ].map((scene) => validateMarkerClearance(scene));
  const failedClearance = clearanceChecks.find((result) => !result.ok);
  if (failedClearance) {
    throw new Error(
      `Geometric option collision for '${input.seed}': ${failedClearance.errors.join(
        " | ",
      )}`,
    );
  }
  const minimumMarkerClearance = Math.min(
    ...clearanceChecks.map((result) => result.minimumDistance),
  );

  const fourthLabel =
    input.requestedTransform === "REFLECT_VERTICAL"
      ? "OUTER_SHAPE_CORRECT_INNER_PROPERTY_WRONG"
      : "PARTIAL_REFLECTION_ERROR";
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
      label: fourthLabel,
      scene: fourthScene,
      fingerprint: spatialSceneSemanticFingerprint(fourthScene),
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

  return {
    familyCode: "SPA-001",
    chapterCode: input.chapterCode,
    prototypeId: input.prototypeId,
    seed: input.seed,
    stimulusKind: "SEEDED_GEOMETRIC_COMPOSITION",
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
      perceptualSeparationCheck: "PASS",
      minimumMarkerClearance,
      recommendedOptionPixels: 150,
    },
    explanationSteps: buildExplanationSteps(
      sourceScene,
      correctScene,
      input.requestedTransform,
      correctOptionIndex,
    ),
    learnerExplanation: buildLearnerExplanation(
      sourceScene,
      correctScene,
      input.requestedTransform,
      correctOptionIndex,
    ),
    lifecycle: {
      permanentQlId: null,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    },
  };
}
