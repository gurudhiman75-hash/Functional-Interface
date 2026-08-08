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
  SpatialTransformProofQuestion,
} from "./proof-types";
import { SpatialSeededRandom } from "./seed";
import {
  classifySpatialSceneSymmetry,
  transformSceneByRequestedOperation,
  type SpatialSymmetryAxes,
} from "./symmetry";
import type {
  SpatialClockTime,
  SpatialRequestedTransform,
} from "./types";

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

function formatTime(time: SpatialClockTime): string {
  return `${time.hour}:${String(time.minute).padStart(2, "0")}`;
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
    `${sourceScene.id}-rotation`,
  );

  let fourthOption: SpatialProofOption;
  if (input.requestedTransform === "REFLECT_VERTICAL") {
    const snappedSource = buildSnappedHourClockScene(
      input.time,
      `${sourceScene.id}-snapped-source`,
    );
    const snappedReflection = transformSceneByRequestedOperation(
      snappedSource,
      "REFLECT_VERTICAL",
      axes,
      `${sourceScene.id}-snapped-reflection`,
    );
    fourthOption = makeSpatialProofOption(
      "CLOCK_HOUR_HAND_SNAPPED",
      snappedReflection,
    );
  } else {
    fourthOption = makeSpatialProofOption("UNCHANGED_STIMULUS", {
      ...sourceScene,
      id: `${sourceScene.id}-unchanged`,
    });
  }

  const random = new SpatialSeededRandom(`${input.seed}:clock-option-order`);
  const options = random.shuffle([
    makeSpatialProofOption("CORRECT_REFLECTION", correctScene),
    makeSpatialProofOption("AXIS_CONFUSION", axisConfusionScene),
    makeSpatialProofOption(
      "ROTATION_SUBSTITUTED_FOR_REFLECTION",
      rotationScene,
    ),
    fourthOption,
  ]);
  const correctOptionIndex = options.findIndex(
    (option) => option.label === "CORRECT_REFLECTION",
  );
  if (correctOptionIndex < 0) {
    throw new Error("Clock proof lost its correct option.");
  }
  assertValidSpatialProofOptions(
    sourceScene,
    input.requestedTransform,
    axes,
    options,
  );

  const sourceAngles = clockTimeToHandAngles(input.time);
  const reflectedAngles =
    input.requestedTransform === "REFLECT_VERTICAL"
      ? reflectClockHandsVertically(sourceAngles)
      : reflectClockHandsHorizontally(sourceAngles);
  const isMirror = input.requestedTransform === "REFLECT_VERTICAL";
  const mirrorCheck = isMirror ? validateMirrorClockCrossCheck(input.time) : null;
  if (mirrorCheck && !mirrorCheck.ok) {
    throw new Error(`Mirror clock cross-check failed for ${formatTime(input.time)}.`);
  }

  const shortcutTime = isMirror ? mirrorClockTimeShortcut(input.time) : undefined;
  const sourceFingerprint = spatialSceneSemanticFingerprint(sourceScene);
  const correctFingerprint = spatialSceneSemanticFingerprint(correctScene);
  const symmetryProfile = classifySpatialSceneSymmetry(sourceScene, axes);
  const learnerExplanation: SpatialLearnerExplanation = isMirror
    ? {
        observation:
          "The mirror line passes through 12 and 6, so each hand reflects left to right.",
        rule:
          "For a mirror-clock question, subtract the actual time from 12:00 on a 12-hour cycle.",
        application: `For ${formatTime(input.time)}, the shortcut gives ${formatTime(
          shortcutTime!,
        )}; the independent coordinate reflection gives the same hand positions.`,
        check: `Option ${correctOptionIndex + 1} has both hands in the verified mirror positions. The snapped-hour option is wrong because the hour hand advances continuously.`,
      }
    : {
        observation:
          "The water line is horizontal, so every point on both hands moves equally above or below the centre.",
        rule:
          "Reflect the hand angles geometrically across the 3–9 axis; do not apply a stated-time shortcut.",
        application: `The hour hand moves from ${sourceAngles.hourAngleDeg}° to ${reflectedAngles.hourAngleDeg}°, and the minute hand moves from ${sourceAngles.minuteAngleDeg}° to ${reflectedAngles.minuteAngleDeg}°.`,
        check: `Option ${correctOptionIndex + 1} alone shows the complete horizontal reflection. The answer is evaluated as a diagram, not as a stated time.`,
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
      axisKind: spatialAxisKind(input.requestedTransform),
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
        presentationPolicy: isMirror
          ? "TIME_OR_DIAGRAM"
          : WATER_CLOCK_PRESENTATION_POLICY,
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
    explanationSteps: buildSpatialProofExplanationSteps(
      sourceScene,
      correctScene,
      input.requestedTransform,
      correctOptionIndex,
      "ANALOG_CLOCK",
    ),
    learnerExplanation,
    lifecycle: { ...LOCKED_SPATIAL_PROOF_LIFECYCLE },
  };
}
