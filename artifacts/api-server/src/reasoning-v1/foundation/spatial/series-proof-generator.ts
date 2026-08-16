import { spatialSceneSemanticFingerprint } from "./normalize";
import {
  SPATIAL_SERIES_RULE_IDS,
  applySpatialSeriesRule,
  spatialSeriesRuleCompatibleWithPresentation,
  spatialSeriesRuleDescription,
} from "./series-rule-authority";
import { buildSpatialSeriesFrameScene } from "./series-scene";
import type {
  SpatialSeriesFrameState,
  SpatialSeriesProofDefinition,
  SpatialSeriesProofOption,
  SpatialSeriesProofQuestion,
  SpatialSeriesRuleId,
} from "./series-types";
import { validateSpatialSeriesVisualTransition } from "./series-visual-validator";

function renderFingerprint(
  state: SpatialSeriesFrameState,
  definition: SpatialSeriesProofDefinition,
  suffix: string,
): string {
  return spatialSceneSemanticFingerprint(
    buildSpatialSeriesFrameScene(
      state,
      definition.presentationProfile,
      `${definition.prototypeId}-${suffix}`,
    ),
  );
}

function inferRules(
  states: readonly SpatialSeriesFrameState[],
  definition: SpatialSeriesProofDefinition,
): SpatialSeriesRuleId[] {
  return SPATIAL_SERIES_RULE_IDS.filter((ruleId) => {
    if (!spatialSeriesRuleCompatibleWithPresentation(ruleId, definition.presentationProfile)) {
      return false;
    }
    for (let index = 0; index < states.length - 1; index += 1) {
      const predicted = applySpatialSeriesRule(states[index]!, ruleId);
      if (!predicted) return false;
      if (
        renderFingerprint(predicted, definition, `infer-${ruleId}-${index}`) !==
        renderFingerprint(states[index + 1]!, definition, `infer-actual-${index}`)
      ) {
        return false;
      }
    }
    return true;
  });
}

function optionLabel(ruleId: SpatialSeriesRuleId, intended: SpatialSeriesRuleId): string {
  if (ruleId === intended) return "CORRECT_CONTINUATION";
  if (ruleId === "NO_CHANGE") return "NO_CHANGE_TRAP";
  if (ruleId === "ROTATE_90_CW" || ruleId === "ROTATE_90_CCW" || ruleId === "ROTATE_180") {
    return "WRONG_ROTATION_TRAP";
  }
  if (ruleId.startsWith("MOVE_MARKER")) return "WRONG_MARKER_MOTION_TRAP";
  if (ruleId.startsWith("MOVE_DOTS")) return "WRONG_DOT_MOTION_TRAP";
  if (ruleId === "INCREASE_DOTS" || ruleId === "DECREASE_DOTS") return "WRONG_COUNT_TRAP";
  return "PARTIAL_COMPOUND_RULE_TRAP";
}

function observationForRule(ruleId: SpatialSeriesRuleId): string {
  switch (ruleId) {
    case "ROTATE_90_CW":
    case "ROTATE_90_CCW":
    case "ROTATE_180":
      return "The same main figure changes orientation by the same amount from one frame to the next; no marker or dot group is present.";
    case "MOVE_MARKER_CW":
    case "MOVE_MARKER_CCW":
      return "The main figure stays fixed while the black marker changes side in a regular direction from one frame to the next.";
    case "MOVE_DOTS_CW":
    case "MOVE_DOTS_CCW":
      return "The main figure and the number of dots stay fixed while the complete dot group changes side in a regular direction.";
    case "INCREASE_DOTS":
      return "The main figure and dot position stay fixed while the visible dot count rises 1, 2, 3, 4 across the four frames.";
    case "ROTATE_90_CW_MOVE_MARKER_CCW":
      return "Two visible changes happen together in every step: the main figure turns and the black marker moves to a new side.";
    case "ROTATE_90_CCW_MOVE_DOTS_CW":
      return "Two visible changes happen together in every step: the main figure turns and the dot group moves to a new side.";
    default:
      return "Compare each consecutive figure and track only the visible features that change.";
  }
}

export function generateSpatialSeriesProofQuestion(
  definition: SpatialSeriesProofDefinition,
): SpatialSeriesProofQuestion {
  const states: SpatialSeriesFrameState[] = [definition.initialState];
  for (let index = 0; index < 3; index += 1) {
    const next = applySpatialSeriesRule(states[index]!, definition.ruleId);
    if (!next) {
      throw new Error(`${definition.prototypeId}: intended rule cannot produce four visible series frames.`);
    }
    states.push(next);
  }

  const inferredRuleIds = inferRules(states, definition);
  if (inferredRuleIds.length !== 1 || inferredRuleIds[0] !== definition.ruleId) {
    throw new Error(
      `${definition.prototypeId}: series rule is not uniquely inferable; candidates: ${inferredRuleIds.join(", ") || "none"}.`,
    );
  }

  const seriesScenes = states.map((state, index) =>
    buildSpatialSeriesFrameScene(
      state,
      definition.presentationProfile,
      `${definition.prototypeId}-FRAME-${index + 1}`,
    ),
  ) as unknown as SpatialSeriesProofQuestion["seriesScenes"];

  const transitionVisualChecks = [0, 1, 2].map((index) =>
    validateSpatialSeriesVisualTransition(
      seriesScenes[index]!,
      seriesScenes[index + 1]!,
      definition.ruleId,
      definition.presentationProfile,
    ),
  );
  const failedTransition = transitionVisualChecks.find((check) => !check.ok);
  if (failedTransition) {
    throw new Error(
      `${definition.prototypeId}: visual transition validation failed: ${failedTransition.errors.join(" | ")}`,
    );
  }

  const finalObserved = states[3]!;
  const ruleCandidates = [definition.ruleId, ...definition.distractorRuleIds] as const;
  const rawOptions = ruleCandidates.map((ruleId): SpatialSeriesProofOption => {
    const state = applySpatialSeriesRule(finalObserved, ruleId);
    if (!state) throw new Error(`${definition.prototypeId}: option rule ${ruleId} is not applicable.`);
    const scene = buildSpatialSeriesFrameScene(
      state,
      definition.presentationProfile,
      `${definition.prototypeId}-OPTION-${ruleId}`,
    );
    const visualCheck = validateSpatialSeriesVisualTransition(
      seriesScenes[3],
      scene,
      ruleId,
      definition.presentationProfile,
    );
    if (!visualCheck.ok) {
      throw new Error(
        `${definition.prototypeId}: option ${ruleId} fails visual contract: ${visualCheck.errors.join(" | ")}`,
      );
    }
    return {
      label: optionLabel(ruleId, definition.ruleId),
      appliedRuleId: ruleId,
      state,
      scene,
      sceneFingerprint: spatialSceneSemanticFingerprint(scene),
    };
  });

  if (new Set(rawOptions.map((option) => option.sceneFingerprint)).size !== 4) {
    throw new Error(`${definition.prototypeId}: option scenes are not visually unique.`);
  }

  const correct = rawOptions[0]!;
  const distractors = rawOptions.slice(1);
  const options: SpatialSeriesProofOption[] = [];
  let distractorIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === definition.desiredCorrectOptionIndex) options.push(correct);
    else options.push(distractors[distractorIndex++]!);
  }

  const applicationBits: string[] = [];
  if (definition.ruleId.includes("ROTATE_90_CW")) applicationBits.push("rotate the main figure 90° clockwise");
  else if (definition.ruleId.includes("ROTATE_90_CCW")) applicationBits.push("rotate the main figure 90° anticlockwise");
  else if (definition.ruleId === "ROTATE_180") applicationBits.push("rotate the main figure 180°");

  if (definition.ruleId.includes("MOVE_MARKER_CCW")) applicationBits.push("move the black marker one side anticlockwise");
  else if (definition.ruleId === "MOVE_MARKER_CW") applicationBits.push("move the black marker one side clockwise");
  else if (definition.ruleId === "MOVE_MARKER_CCW") applicationBits.push("move the black marker one side anticlockwise");

  if (definition.ruleId.includes("MOVE_DOTS_CW")) applicationBits.push("move the dot group one side clockwise");
  else if (definition.ruleId === "MOVE_DOTS_CCW") applicationBits.push("move the dot group one side anticlockwise");
  if (definition.ruleId === "INCREASE_DOTS") applicationBits.push("add one dot");

  const optionReview = options
    .map((option, index) => {
      const letter = String.fromCharCode(65 + index);
      if (index === definition.desiredCorrectOptionIndex) {
        return `${letter} matches the required next step.`;
      }
      return `${letter} would instead follow this different step: ${spatialSeriesRuleDescription(option.appliedRuleId)}.`;
    })
    .join(" ");

  return {
    familyCode: "SPA-001",
    chapterCode: "FSR-001",
    prototypeId: definition.prototypeId,
    instructionKey: "FSR_SELECT_NEXT_FIGURE",
    ruleId: definition.ruleId,
    presentationProfile: definition.presentationProfile,
    seriesStates: states as unknown as SpatialSeriesProofQuestion["seriesStates"],
    seriesScenes,
    options,
    correctOptionIndex: definition.desiredCorrectOptionIndex,
    solverEvidence: {
      inferredRuleIds,
      expectedRuleId: definition.ruleId,
      uniqueInferenceCheck: "PASS",
      transitionVisualChecks,
      optionSceneFingerprints: options.map((option) => option.sceneFingerprint),
      correctOptionIndex: definition.desiredCorrectOptionIndex,
    },
    learnerExplanation: {
      observation: observationForRule(definition.ruleId),
      rule: `The repeating rule is: ${spatialSeriesRuleDescription(definition.ruleId)}.`,
      application: `From the fourth figure, ${applicationBits.join(" and ")}.`,
      check: optionReview,
    },
    lifecycle: {
      permanentQlId: null,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    },
  };
}
