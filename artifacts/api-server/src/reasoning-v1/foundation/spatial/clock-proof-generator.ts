import {
  clockTimeToHandAngles,
  mirrorClockTimeShortcut,
  reflectClockHandsHorizontally,
  reflectClockHandsVertically,
  validateMirrorClockCrossCheck,
  WATER_CLOCK_PRESENTATION_POLICY,
} from "./clock";
import { buildClockScene, SPATIAL_CLOCK_AXIS } from "./clock-scene";
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
import { validateClockOptionPerceptualSeparation } from "./perceptual-validator";
import { SpatialSeededRandom } from "./seed";
import {
  classifySpatialSceneSymmetry,
  transformSceneByRequestedOperation,
  type SpatialSymmetryAxes,
} from "./symmetry";
import type { SpatialClockTime, SpatialRequestedTransform } from "./types";

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

function shiftHour(time: SpatialClockTime, delta: number): SpatialClockTime {
  const zeroBased = ((time.hour % 12) + delta + 12) % 12;
  return { hour: zeroBased === 0 ? 12 : zeroBased, minute: time.minute };
}

function mirrorArithmetic(source: SpatialClockTime, result: SpatialClockTime): string {
  return source.minute === 0
    ? `12:00 − ${formatTime(source)} = ${formatTime(result)}`
    : `11:60 − ${formatTime(source)} = ${formatTime(result)}`;
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

  const isMirror = input.requestedTransform === "REFLECT_VERTICAL";
  const shortcutTime = isMirror ? mirrorClockTimeShortcut(input.time) : undefined;
  let fourthOption: SpatialProofOption;
  if (isMirror) {
    const borrowErrorTime = shiftHour(shortcutTime!, 1);
    fourthOption = makeSpatialProofOption(
      "CLOCK_SHORTCUT_BORROW_ERROR",
      buildClockScene(borrowErrorTime, `${sourceScene.id}-borrow-error`),
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
    makeSpatialProofOption("ROTATION_SUBSTITUTED_FOR_REFLECTION", rotationScene),
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

  const perceptual = validateClockOptionPerceptualSeparation(options, 8);
  if (!perceptual.ok) {
    throw new Error(
      `Clock options are not visually separable for '${input.seed}': ${perceptual.errors.join(
        " | ",
      )}`,
    );
  }

  const sourceAngles = clockTimeToHandAngles(input.time);
  const reflectedAngles = isMirror
    ? reflectClockHandsVertically(sourceAngles)
    : reflectClockHandsHorizontally(sourceAngles);
  const mirrorCheck = isMirror ? validateMirrorClockCrossCheck(input.time) : null;
  if (mirrorCheck && !mirrorCheck.ok) {
    throw new Error(`Mirror clock cross-check failed for ${formatTime(input.time)}.`);
  }

  const sourceFingerprint = spatialSceneSemanticFingerprint(sourceScene);
  const correctFingerprint = spatialSceneSemanticFingerprint(correctScene);
  const symmetryProfile = classifySpatialSceneSymmetry(sourceScene, axes);
  const learnerExplanation: SpatialLearnerExplanation = isMirror
    ? {
        observation:
          "The vertical mirror line keeps the 12–6 axis fixed and moves both hands to the opposite side.",
        rule:
          "Subtract the shown time from 12:00. When minutes are non-zero, borrow one hour and write 11:60 before subtracting.",
        application: `${mirrorArithmetic(input.time, shortcutTime!)}. Independent coordinate reflection gives the same two hand positions.`,
        check: `Option ${correctOptionIndex + 1} has both verified hand positions. The borrow-error option keeps the minutes but places the hour hand one hour too far ahead.`,
      }
    : {
        observation:
          "The horizontal water line keeps left–right positions fixed and moves every point on both hands equally above or below the centre.",
        rule:
          "Reflect the hand angles across the 3–9 axis. A water image is checked as a diagram, not by applying a mirror-time shortcut.",
        application: `The hour hand moves from ${sourceAngles.hourAngleDeg}° to ${reflectedAngles.hourAngleDeg}°, while the minute hand moves from ${sourceAngles.minuteAngleDeg}° to ${reflectedAngles.minuteAngleDeg}°.`,
        check: `Option ${correctOptionIndex + 1} alone shows the complete horizontal reflection. The symmetric 12-tick face makes the hand positions directly comparable.`,
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
        minimumOptionEndpointDistance: perceptual.minimumDistance,
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
      perceptualSeparationCheck: "PASS",
      minimumVisualEndpointDistance: perceptual.minimumDistance,
      recommendedOptionPixels: 190,
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
