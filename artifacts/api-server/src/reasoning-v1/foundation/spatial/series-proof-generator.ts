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
      observation: "Compare each consecutive figure and track only the visible features that change.",
      rule: `The repeating rule is: ${spatialSeriesRuleDescription(definition.ruleId)}.`,
      application: `From the fourth figure, ${applicationBits.join(" and ")}.`,
      check: `That gives option ${String.fromCharCode(65 + definition.desiredCorrectOptionIndex)}; the other options represent wrong direction, wrong amount, no change, or a partial compound rule.`,
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
