import {
  clockTimeToHandAngles,
  mirrorClockTimeShortcut,
  reflectClockHandsHorizontally,
  reflectClockHandsVertically,
  validateMirrorClockCrossCheck,
  WATER_CLOCK_PRESENTATION_POLICY,
} from "./clock";
import {
  buildClockScene,
  buildSnappedHourClockScene,
  SPATIAL_CLOCK_AXIS,
} from "./clock-scene";
import { buildGlyphStringScene } from "./canonical-glyphs-v1";
import { spatialSceneSemanticFingerprint } from "./normalize";
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
import { validateSpatialTransformQuestion } from "./transform-validator";
import type {
  SpatialClockTime,
  SpatialExplanationStep,
  SpatialRequestedTransform,
  SpatialScene,
  SpatialTransformCandidate,
} from "./types";

const LOCKED_LIFECYCLE = {
  permanentQlId: null,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
} as const;

function makeOption(label: SpatialProofOption["label"], scene: SpatialScene): SpatialProofOption {
  return {
    label,
    scene,
    fingerprint: spatialSceneSemanticFingerprint(scene),
  };
}

function formatTime(time: SpatialClockTime): string {
  return `${time.hour}:${String(time.minute).padStart(2, "0")}`;
}

function axisKind(transform: SpatialRequestedTransform): "VERTICAL" | "HORIZONTAL" {
  return transform === "REFLECT_VERTICAL" ? "VERTICAL" : "HORIZONTAL";
}

function buildStructuredSteps(
  sourceScene: SpatialScene,
  correctScene: SpatialScene,
  requestedTransform: Extract<
    SpatialRequestedTransform,
    "REFLECT_VERTICAL" | "REFLECT_HORIZONTAL"
  >,
  correctOptionIndex: number,
  stimulusKind: SpatialProofStimulusKind,
): SpatialExplanationStep[] {
  const axis = axisKind(requestedTransform);
  return [
    {
      id: "observe",
      operation: "OBSERVATION",
      sourceNodeIds: sourceScene.nodes.map((node) => node.id),
      evidence: { stimulusKind, axisKind: axis },
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

function validateOptions(
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
    const reversedOrder = input.glyphIds.map((_, index) => input.glyphIds.length - 1 - index);
    const orderOnly = buildGlyphStringScene({
      id: `${sourceScene.id}-order-only`,
      glyphIds: input.glyphIds,
      glyphOrder: reversedOrder,
    });
    const glyphOnly = buildGlyphStringScene({
      id: `${sourceScene.id}-glyph-only`,
      glyphIds: input.glyphIds,
      glyphTransform: "REFLECT_VERTICAL",
    });
    distractors = [
      makeOption("ORDER_REVERSED_GLYPHS_UNCHANGED", orderOnly),
      makeOption("GLYPHS_REFLECTED_ORDER_UNCHANGED", glyphOnly),
      makeOption("ROTATION_SUBSTITUTED_FOR_REFLECTION", rotationScene),
    ];
  } else {
    const axisConfusion = transformSceneByRequestedOperation(
      sourceScene,
      "REFLECT_VERTICAL",
      axes,
      `${sourceScene.id}-axis-confusion`,
    );
    distractors = [
      makeOption("AXIS_CONFUSION", axisConfusion),
      makeOption("ROTATION_SUBSTITUTED_FOR_REFLECTION", rotationScene),
      makeOption("UNCHANGED_STIMULUS", { ...sourceScene, id: `${sourceScene.id}-unchanged` }),
    ];
  }

  const random = new SpatialSeededRandom(`${input.seed}:specialised-option-order`);
  const options = random.shuffle([
    makeOption("CORRECT_REFLECTION", correctScene),
    ...distractors,
  ]);
  const correctOptionIndex = options.findIndex(
    (option) => option.label === "CORRECT_REFLECTION",
  );
  if (correctOptionIndex < 0) {
    throw new Error("Specialised glyph proof lost its correct option.");
  }
  validateOptions(sourceScene, input.requestedTransform, axes, options);

  const sourceFingerprint = spatialSceneSemanticFingerprint(sourceScene);
  const correctFingerprint = spatialSceneSemanticFingerprint(correctScene);
  const symmetryProfile = classifySpatialSceneSymmetry(sourceScene, axes);
  const localeMode =
    input.stimulusKind === "LATIN_GLYPH_STRING"
      ? "SCRIPT_SPECIFIC"
      : "INSTRUCTION_LOCALISED";
  const mirror = input.requestedTransform === "REFLECT_VERTICAL";
  const sourceDisplay = input.glyphIds.map((id) => id.split("-").at(-1)).join(" ");
  const learnerExplanation: SpatialLearnerExplanation = {
    observation: mirror
      ? "The mirror line is vertical, so left and right positions must exchange."
      : "The water line is horizontal, so top and bottom positions must exchange.",
    rule: mirror
      ? "For a glyph string, reverse the visual order and laterally reflect every glyph."
      : "Keep the glyph order unchanged and reflect every glyph from top to bottom.",
    application: mirror
      ? `Apply both operations to ${sourceDisplay}: reverse its order and reflect each vector glyph.`
      : `Apply a horizontal reflection to each vector glyph in ${sourceDisplay}; do not reverse the order.`,
    check: `Option ${correctOptionIndex + 1} alone applies the complete ${mirror ? "mirror" : "water"} reflection.`,
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
      axisKind: axisKind(input.requestedTransform),
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
    explanationSteps: buildStructuredSteps(
      sourceScene,
      correctScene,
      input.requestedTransform,
      correctOptionIndex,
      input.stimulusKind,
    ),
    learnerExplanation,
    lifecycle: { ...LOCKED_LIFECYCLE },
  };
}

export interface ClockProofInput {
  seed: string;
  chapterCode: SpatialProofChapterCode;
  prototypeId: string;
  requestedTransform: Extract<
    SpatialRequestedTransform,
    "REFLECT_VERTICAL" | "REFLECT_HORIZONTAL"
  >;
  instructionKey: string;
  time: SpatialClockTime;
}

export function generateClockProofQuestion(
  input: ClockProofInput,
): SpatialTransformProofQuestion {
  const sourceScene = buildClockScene(
    input.time,
    `${input.prototypeId}-${input.seed}-source`,
  );
  sourceScene.metadata = {
    ...sourceScene.metadata,
    chapterCode: input.chapterCode,
    prototypeId: input.prototypeId,
    seed: input.seed,
  };
  const axes: SpatialSymmetryAxes = {
    axisX: SPATIAL_CLOCK_AXIS,
    axisY: SPATIAL_CLOCK_AXIS,
    pivot: { x: SPATIAL_CLOCK_AXIS, y: SPATIAL_CLOCK_AXIS },
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
  const axisConfusion = transformSceneByRequestedOperation(
    sourceScene,
    axisConfusionTransform,
    axes,
    `${sourceScene.id}-axis-confusion`,
  );
  const rotation = transformSceneByRequestedOperation(
    sourceScene,
    "ROTATE_180",
    axes,
    `${sourceScene.id}-rotation`,
  );

  let fourthOption: SpatialProofOption;
  if (input.requestedTransform === "REFLECT_VERTICAL") {
    const snapped = buildSnappedHourClockScene(
      input.time,
      `${sourceScene.id}-snapped-source`,
    );
    fourthOption = makeOption(
      "CLOCK_HOUR_HAND_SNAPPED",
      transformSceneByRequestedOperation(
        snapped,
        "REFLECT_VERTICAL",
        axes,
        `${sourceScene.id}-snapped-reflection`,
      ),
    );
  } else {
    fourthOption = makeOption("UNCHANGED_STIMULUS", {
      ...sourceScene,
      id: `${sourceScene.id}-unchanged`,
    });
  }

  const random = new SpatialSeededRandom(`${input.seed}:clock-option-order`);
  const options = random.shuffle([
    makeOption("CORRECT_REFLECTION", correctScene),
    makeOption("AXIS_CONFUSION", axisConfusion),
    makeOption("ROTATION_SUBSTITUTED_FOR_REFLECTION", rotation),
    fourthOption,
  ]);
  const correctOptionIndex = options.findIndex(
    (option) => option.label === "CORRECT_REFLECTION",
  );
  if (correctOptionIndex < 0) {
    throw new Error("Clock proof lost its correct option.");
  }
  validateOptions(sourceScene, input.requestedTransform, axes, options);

  const sourceAngles = clockTimeToHandAngles(input.time);
  const reflectedAngles =
    input.requestedTransform === "REFLECT_VERTICAL"
      ? reflectClockHandsVertically(sourceAngles)
      : reflectClockHandsHorizontally(sourceAngles);
  const mirrorCheck =
    input.requestedTransform === "REFLECT_VERTICAL"
      ? validateMirrorClockCrossCheck(input.time)
      : null;
  if (mirrorCheck && !mirrorCheck.ok) {
    throw new Error(`Mirror clock cross-check failed for ${formatTime(input.time)}.`);
  }

  const sourceFingerprint = spatialSceneSemanticFingerprint(sourceScene);
  const correctFingerprint = spatialSceneSemanticFingerprint(correctScene);
  const symmetryProfile = classifySpatialSceneSymmetry(sourceScene, axes);
  const isMirror = input.requestedTransform === "REFLECT_VERTICAL";
  const shortcutTime = isMirror ? mirrorClockTimeShortcut(input.time) : undefined;
  const learnerExplanation: SpatialLearnerExplanation = isMirror
    ? {
        observation: "The mirror line passes through 12 and 6, so each hand reflects left to right.",
        rule: "For a mirror-clock question, the reflected time equals 12:00 minus the actual time on a 12-hour cycle.",
        application: `For ${formatTime(input.time)}, the shortcut gives ${formatTime(shortcutTime!)}; the coordinate reflection of both hands gives the same result.`,
        check: `Option ${correctOptionIndex + 1} has both hands in the verified mirror positions; the snapped-hour option is invalid because the hour hand must advance continuously.`,
      }
    : {
        observation: "The water line is horizontal, so every point on both hands moves equally above or below the centre.",
        rule: "Reflect the hand angles geometrically across the 3–9 axis; do not convert the result using a time shortcut.",
        application: `The hour hand moves from ${sourceAngles.hourAngleDeg}° to ${reflectedAngles.hourAngleDeg}°, and the minute hand moves from ${sourceAngles.minuteAngleDeg}° to ${reflectedAngles.minuteAngleDeg}°.",
        check: `Option ${correctOptionIndex + 1} alone shows the complete horizontal reflection. The result is evaluated as a diagram, not as a stated time.`,
      };

  return {
    familyCode: "SPA-001",
    chapterCode: input.chapterCode,
    prototypeId: input.prototypeId,
    seed: input.seed,
    stimulusKind: "ANALOG_CLOCK",
    requestedTransform: input.requestedTransform,
    instructionKey: input.instructionKey,
    sourceScene,
    options,
    correctOptionIndex,
    solverEvidence: {
      requestedTransform: input.requestedTransform,
      axisKind: axisKind(input.requestedTransform),
      axisCoordinate: SPATIAL_CLOCK_AXIS,
      sourceFingerprint,
      correctFingerprint,
      transformedNodeIds: sourceScene.nodes.map((node) => node.id),
      symmetryProfile,
      optionLabels: options.map((option) => option.label),
      optionFingerprints: options.map((option) => option.fingerprint),
      correctOptionIndex,
      clock: {
        sourceTime: { ...input.time },
        sourceAngles,
        reflectedAngles,
        shortcutTime,
        shortcutCrossCheck: isMirror ? "PASS" : "NOT_APPLICABLE",
        presentationPolicy: isMirror ? "TIME_OR_DIAGRAM" : WATER_CLOCK_PRESENTATION_POLICY,
      },
    },
    reviewMetadata: {
      stimulusKind: "ANALOG_CLOCK",
      requestedTransform: input.requestedTransform,
      localeMode: "LANGUAGE_NEUTRAL",
      symmetryProfile,
      canonicalFingerprint: sourceFingerprint,
      correctTransformFingerprint: correctFingerprint,
      optionTransformLabels: options.map((option) => option.label),
      equivalentCandidateCheck: "PASS",
      clockGeometryCheck: "PASS",
      clockShortcutCheck: isMirror ? "PASS" : "NOT_APPLICABLE",
    },
    explanationSteps: buildStructuredSteps(
      sourceScene,
      correctScene,
      input.requestedTransform,
      correctOptionIndex,
      "ANALOG_CLOCK",
    ),
    learnerExplanation,
    lifecycle: { ...LOCKED_LIFECYCLE },
  };
}
