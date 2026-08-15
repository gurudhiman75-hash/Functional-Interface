import {
  generateSpatialTransformProofQuestion,
  spatialSceneSemanticFingerprint,
  SPATIAL_PROOF_AXIS,
  validateMarkerClearance,
  validateSpatialTransformQuestion,
  type SpatialNode,
  type SpatialPoint,
  type SpatialProofOption,
  type SpatialScene,
  type SpatialTransformProofQuestion,
} from "../../../../../foundation/spatial";
import { validateSpatialPerceptualOptionUniquenessV2 } from "../../../../../foundation/spatial/gap-question-perceptual-v2";

export const MIRROR_GEOMETRIC_PROOF_PROTOTYPE =
  "MIR-PROT-GEOMETRIC-VERTICAL-REFLECTION" as const;

type StrictInnerMutation =
  | "LOCAL_VERTICAL_FLIP"
  | "LOCAL_HORIZONTAL_FLIP"
  | "TOGGLE_FILL";

function nodePoints(node: SpatialNode): SpatialPoint[] | null {
  if (node.kind === "line") return [node.start, node.end];
  if (node.kind === "polygon" || node.kind === "polyline") return node.points;
  return null;
}

function nodeCenter(node: SpatialNode): SpatialPoint | null {
  const points = nodePoints(node);
  if (!points?.length) return null;
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  return {
    x: (Math.min(...xs) + Math.max(...xs)) / 2,
    y: (Math.min(...ys) + Math.max(...ys)) / 2,
  };
}

function mutateStrictInnerProperty(
  node: SpatialNode,
  mutation: StrictInnerMutation,
): SpatialNode | null {
  if (mutation === "TOGGLE_FILL") {
    if (node.kind !== "circle") return null;
    const currentFill = node.style?.fill ?? "none";
    const nextFill = currentFill === "none" ? "#d1d5db" : "none";
    return {
      ...node,
      style: {
        ...(node.style ?? {}),
        fill: nextFill,
      },
    };
  }

  const center = nodeCenter(node);
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

function sceneWithStrictInnerMutation(
  correctScene: SpatialScene,
  mutatedSecondary: SpatialNode,
  mutation: StrictInnerMutation,
): SpatialScene {
  return {
    ...correctScene,
    id: `${correctScene.id}-strict-inner-property-${mutation.toLowerCase()}`,
    nodes: correctScene.nodes.map((node) =>
      node.id === "secondary-shape" ? mutatedSecondary : node,
    ),
    metadata: correctScene.metadata ? { ...correctScene.metadata } : undefined,
  };
}

function buildStrictInnerPropertyDistractor(
  question: SpatialTransformProofQuestion,
  premiumIndex: number,
): SpatialProofOption {
  const correctOption = question.options[question.correctOptionIndex];
  if (!correctOption) {
    throw new Error(`${question.seed}: missing correct mirror option.`);
  }
  const secondary = correctOption.scene.nodes.find(
    (node) => node.id === "secondary-shape",
  );
  if (!secondary) {
    throw new Error(`${question.seed}: missing secondary inner feature.`);
  }

  const mutations: StrictInnerMutation[] = secondary.kind === "circle"
    ? ["TOGGLE_FILL"]
    : ["LOCAL_VERTICAL_FLIP", "LOCAL_HORIZONTAL_FLIP"];

  for (const mutation of mutations) {
    const mutatedSecondary = mutateStrictInnerProperty(secondary, mutation);
    if (!mutatedSecondary) continue;
    if (JSON.stringify(mutatedSecondary) === JSON.stringify(secondary)) continue;

    const scene = sceneWithStrictInnerMutation(
      correctOption.scene,
      mutatedSecondary,
      mutation,
    );
    if (
      spatialSceneSemanticFingerprint(scene) ===
      spatialSceneSemanticFingerprint(correctOption.scene)
    ) {
      continue;
    }
    if (!validateMarkerClearance(scene).ok) continue;

    const candidateOption: SpatialProofOption = {
      label: "OUTER_SHAPE_CORRECT_INNER_PROPERTY_WRONG",
      scene,
      fingerprint: spatialSceneSemanticFingerprint(scene),
    };
    const candidateOptions = question.options.map((option, index) =>
      index === premiumIndex ? candidateOption : option,
    );

    const semanticFingerprints = candidateOptions.map(
      (option) => option.fingerprint,
    );
    if (new Set(semanticFingerprints).size !== candidateOptions.length) continue;

    const perceptual = validateSpatialPerceptualOptionUniquenessV2(
      candidateOptions.map((option) => option.scene),
    );
    if (!perceptual.ok) continue;

    const validation = validateSpatialTransformQuestion({
      sourceScene: question.sourceScene,
      requestedTransform: question.requestedTransform,
      axes: {
        axisX: SPATIAL_PROOF_AXIS,
        axisY: SPATIAL_PROOF_AXIS,
        pivot: { x: SPATIAL_PROOF_AXIS, y: SPATIAL_PROOF_AXIS },
      },
      candidates: candidateOptions.map((option) => ({
        label: option.label,
        scene: option.scene,
      })),
    });
    if (!validation.ok) continue;

    return candidateOption;
  }

  throw new Error(
    `${question.seed}: unable to construct a strict inner-property mirror distractor without changing the outer figure.`,
  );
}

function replaceRejectedMisconceptionLabels(
  question: SpatialTransformProofQuestion,
): SpatialTransformProofQuestion["explanationSteps"] {
  return question.explanationSteps.map((step) => {
    if (step.id !== "check" || !step.evidence) return step;
    const rejected = step.evidence.rejectedMisconceptions;
    if (!Array.isArray(rejected)) return step;
    return {
      ...step,
      evidence: {
        ...step.evidence,
        rejectedMisconceptions: rejected.map((label) =>
          label === "OUTER_SHAPE_CORRECT_INNER_ORIENTATION_WRONG"
            ? "OUTER_SHAPE_CORRECT_INNER_PROPERTY_WRONG"
            : label,
        ),
      },
    };
  });
}

export function generateMirrorGeometricProofQuestion(
  seed: string,
): SpatialTransformProofQuestion {
  const generated = generateSpatialTransformProofQuestion({
    seed,
    chapterCode: "MIR-001",
    prototypeId: MIRROR_GEOMETRIC_PROOF_PROTOTYPE,
    requestedTransform: "REFLECT_VERTICAL",
    instructionKey: "MIR_SELECT_TRUE_VERTICAL_REFLECTION",
  });

  const premiumIndex = generated.options.findIndex(
    (option) => option.label === "OUTER_SHAPE_CORRECT_INNER_ORIENTATION_WRONG",
  );
  if (premiumIndex < 0) {
    throw new Error(`${seed}: generated MIR question is missing its premium distractor slot.`);
  }

  const strictPremium = buildStrictInnerPropertyDistractor(
    generated,
    premiumIndex,
  );
  const options = generated.options.map((option, index) =>
    index === premiumIndex ? strictPremium : option,
  );

  return {
    ...generated,
    options,
    solverEvidence: {
      ...generated.solverEvidence,
      optionLabels: options.map((option) => option.label),
      optionFingerprints: options.map((option) => option.fingerprint),
    },
    reviewMetadata: {
      ...generated.reviewMetadata,
      optionTransformLabels: options.map((option) => option.label),
    },
    explanationSteps: replaceRejectedMisconceptionLabels(generated),
    learnerExplanation: generated.learnerExplanation
      ? {
          ...generated.learnerExplanation,
          check: `Option ${generated.correctOptionIndex + 1} is the only complete reflection. One tempting choice has the same outer mirrored figure and the same positions, but exactly one inner detail is wrong. Check the inside of the figure before choosing.`,
        }
      : generated.learnerExplanation,
  };
}
