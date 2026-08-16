import { buildGlyphStringScene } from "./canonical-glyphs-v1";
import { spatialSceneSemanticFingerprint } from "./normalize";
import {
  assertValidSpatialProofOptions,
  buildSpatialProofExplanationSteps,
  LOCKED_SPATIAL_PROOF_LIFECYCLE,
  makeSpatialProofOption,
  spatialAxisKind,
} from "./proof-packaging";
import type {
  SpatialLearnerExplanation,
  SpatialProofChapterCode,
  SpatialProofOption,
  SpatialProofStimulusKind,
  SpatialTransformProofQuestion,
} from "./proof-types";
import { SpatialSeededRandom } from "./seed";
import {
  classifySpatialSceneSymmetry,
  transformSceneByRequestedOperation,
  type SpatialSymmetryAxes,
} from "./symmetry";
import type { SpatialRequestedTransform } from "./types";

export interface GlyphStringProofInput {
  seed: string;
  chapterCode: SpatialProofChapterCode;
  prototypeId: string;
  requestedTransform: Extract<
    SpatialRequestedTransform,
    "REFLECT_VERTICAL" | "REFLECT_HORIZONTAL"
  >;
  instructionKey: string;
  glyphIds: readonly string[];
  stimulusKind: Extract<
    SpatialProofStimulusKind,
    "WESTERN_ARABIC_DIGIT_STRING" | "LATIN_GLYPH_STRING"
  >;
}

function displayGlyphIds(glyphIds: readonly string[]): string {
  return glyphIds
    .map((id) => {
      const parts = id.split("-");
      return parts[parts.length - 1] ?? id;
    })
    .join(" ");
}

export function generateGlyphStringProofQuestion(
  input: GlyphStringProofInput,
): SpatialTransformProofQuestion {
  const sourceScene = buildGlyphStringScene({
    id: `${input.prototypeId}-${input.seed}-source`,
    glyphIds: input.glyphIds,
  });
  sourceScene.metadata = {
    ...sourceScene.metadata,
    chapterCode: input.chapterCode,
    prototypeId: input.prototypeId,
    seed: input.seed,
  };

  const axes: SpatialSymmetryAxes = {
    axisX: sourceScene.viewBox.width / 2,
    axisY: sourceScene.viewBox.height / 2,
    pivot: {
      x: sourceScene.viewBox.width / 2,
      y: sourceScene.viewBox.height / 2,
    },
  };
  const correctScene = transformSceneByRequestedOperation(
    sourceScene,
    input.requestedTransform,
    axes,
    `${sourceScene.id}-correct`,
  );
  const rotationScene = transformSceneByRequestedOperation(
    sourceScene,
    "ROTATE_180",
    axes,
    `${sourceScene.id}-rotation`,
  );

  let distractors: SpatialProofOption[];
  if (input.requestedTransform === "REFLECT_VERTICAL") {
    const reversedOrder = input.glyphIds.map(
      (_, index) => input.glyphIds.length - 1 - index,
    );
    const orderOnlyScene = buildGlyphStringScene({
      id: `${sourceScene.id}-order-only`,
      glyphIds: input.glyphIds,
      glyphOrder: reversedOrder,
    });
    const glyphOnlyScene = buildGlyphStringScene({
      id: `${sourceScene.id}-glyph-only`,
      glyphIds: input.glyphIds,
      glyphTransform: "REFLECT_VERTICAL",
    });
    distractors = [
      makeSpatialProofOption(
        "ORDER_REVERSED_GLYPHS_UNCHANGED",
        orderOnlyScene,
      ),
      makeSpatialProofOption(
        "GLYPHS_REFLECTED_ORDER_UNCHANGED",
        glyphOnlyScene,
      ),
      makeSpatialProofOption(
        "ROTATION_SUBSTITUTED_FOR_REFLECTION",
        rotationScene,
      ),
    ];
  } else {
    const axisConfusionScene = transformSceneByRequestedOperation(
      sourceScene,
      "REFLECT_VERTICAL",
      axes,
      `${sourceScene.id}-axis-confusion`,
    );
    distractors = [
      makeSpatialProofOption("AXIS_CONFUSION", axisConfusionScene),
      makeSpatialProofOption(
        "ROTATION_SUBSTITUTED_FOR_REFLECTION",
        rotationScene,
      ),
      makeSpatialProofOption("UNCHANGED_STIMULUS", {
        ...sourceScene,
        id: `${sourceScene.id}-unchanged`,
      }),
    ];
  }

  const random = new SpatialSeededRandom(
    `${input.seed}:specialised-option-order`,
  );
  const options = random.shuffle([
    makeSpatialProofOption("CORRECT_REFLECTION", correctScene),
    ...distractors,
  ]);
  const correctOptionIndex = options.findIndex(
    (option) => option.label === "CORRECT_REFLECTION",
  );
  if (correctOptionIndex < 0) {
    throw new Error("Specialised glyph proof lost its correct option.");
  }
  assertValidSpatialProofOptions(
    sourceScene,
    input.requestedTransform,
    axes,
    options,
  );

  const sourceFingerprint = spatialSceneSemanticFingerprint(sourceScene);
  const correctFingerprint = spatialSceneSemanticFingerprint(correctScene);
  const symmetryProfile = classifySpatialSceneSymmetry(sourceScene, axes);
  const localeMode =
    input.stimulusKind === "LATIN_GLYPH_STRING"
      ? "SCRIPT_SPECIFIC"
      : "INSTRUCTION_LOCALISED";
  const isMirror = input.requestedTransform === "REFLECT_VERTICAL";
  const sourceDisplay = displayGlyphIds(input.glyphIds);
  const learnerExplanation: SpatialLearnerExplanation = {
    observation: isMirror
      ? "The mirror line is vertical, so left and right positions must exchange."
      : "The water line is horizontal, so top and bottom positions must exchange.",
    rule: isMirror
      ? "For a glyph string, reverse the visual order and laterally reflect every glyph."
      : "Keep the glyph order unchanged and reflect every glyph from top to bottom.",
    application: isMirror
      ? `Apply both operations to ${sourceDisplay}: reverse its order and reflect each vector glyph.`
      : `Apply a horizontal reflection to each vector glyph in ${sourceDisplay}; do not reverse the order.`,
    check: `Option ${correctOptionIndex + 1} alone applies the complete ${
      isMirror ? "mirror" : "water"
    } reflection.`,
  };

  return {
    familyCode: "SPA-001",
    chapterCode: input.chapterCode,
    prototypeId: input.prototypeId,
    seed: input.seed,
    stimulusKind: input.stimulusKind,
    requestedTransform: input.requestedTransform,
    instructionKey: input.instructionKey,
    sourceScene,
    options,
    correctOptionIndex,
    solverEvidence: {
      requestedTransform: input.requestedTransform,
      axisKind: spatialAxisKind(input.requestedTransform),
      axisCoordinate:
        input.requestedTransform === "REFLECT_VERTICAL"
          ? axes.axisX!
          : axes.axisY!,
      sourceFingerprint,
      correctFingerprint,
      transformedNodeIds: sourceScene.nodes.map((node) => node.id),
      symmetryProfile,
      optionLabels: options.map((option) => option.label),
      optionFingerprints: options.map((option) => option.fingerprint),
      correctOptionIndex,
    },
    reviewMetadata: {
      stimulusKind: input.stimulusKind,
      requestedTransform: input.requestedTransform,
      localeMode,
      symmetryProfile,
      canonicalFingerprint: sourceFingerprint,
      correctTransformFingerprint: correctFingerprint,
      optionTransformLabels: options.map((option) => option.label),
      equivalentCandidateCheck: "PASS",
      clockGeometryCheck: "NOT_APPLICABLE",
      clockShortcutCheck: "NOT_APPLICABLE",
    },
    explanationSteps: buildSpatialProofExplanationSteps(
      sourceScene,
      correctScene,
      input.requestedTransform,
      correctOptionIndex,
      input.stimulusKind,
    ),
    learnerExplanation,
    lifecycle: { ...LOCKED_SPATIAL_PROOF_LIFECYCLE },
  };
}
