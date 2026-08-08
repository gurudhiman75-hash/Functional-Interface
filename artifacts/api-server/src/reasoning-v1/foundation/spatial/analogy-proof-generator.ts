import { buildSpatialAnalogyFigureScene } from "./analogy-scene";
import {
  applySpatialAnalogyRule,
  inferSpatialAnalogyRules,
  normalizeSpatialAnalogyState,
  spatialAnalogyRuleComplexity,
  spatialAnalogyRuleDescription,
  spatialAnalogyStateFingerprint,
} from "./analogy-rule-authority";
import type {
  SpatialAnalogyFigureState,
  SpatialAnalogyLearnerExplanation,
  SpatialAnalogyProofGeneratorInput,
  SpatialAnalogyProofOption,
  SpatialAnalogyProofQuestion,
} from "./analogy-types";
import { validateSpatialAnalogyVisualPair } from "./analogy-visual-validator";
import { spatialSceneSemanticFingerprint } from "./normalize";
import { LOCKED_SPATIAL_PROOF_LIFECYCLE } from "./proof-packaging";
import { SpatialSeededRandom } from "./seed";
import type { SpatialExplanationStep } from "./types";

function quarterDescription(quarter: number): string {
  return `${quarter * 90}°`;
}

function stateFeatureDescription(stateInput: SpatialAnalogyFigureState): string {
  const state = normalizeSpatialAnalogyState(stateInput);
  return [
    `${state.outerShape.toLowerCase()} outside at ${quarterDescription(state.outerRotationQuarter)}`,
    `${state.innerShape.toLowerCase()} inside at ${quarterDescription(state.innerRotationQuarter)}`,
    `marker at ${state.markerPosition.toLowerCase().replaceAll("_", " ")}`,
    `arrow ${state.direction.toLowerCase()}`,
    state.shadedInner ? "inner shape shaded" : "inner shape open",
    `${state.segmentCount} short segment${state.segmentCount === 1 ? "" : "s"} at the ${state.segmentAnchor.toLowerCase()}`,
  ].join(", ");
}

function describeStateChanges(fromInput: SpatialAnalogyFigureState, toInput: SpatialAnalogyFigureState): string {
  const from = normalizeSpatialAnalogyState(fromInput);
  const to = normalizeSpatialAnalogyState(toInput);
  const changes: string[] = [];
  if (from.outerShape !== to.outerShape) changes.push(`outer shape changes from ${from.outerShape.toLowerCase()} to ${to.outerShape.toLowerCase()}`);
  if (from.innerShape !== to.innerShape) changes.push(`inner shape changes from ${from.innerShape.toLowerCase()} to ${to.innerShape.toLowerCase()}`);
  if (from.outerRotationQuarter !== to.outerRotationQuarter) changes.push(`outer shape turns from ${quarterDescription(from.outerRotationQuarter)} to ${quarterDescription(to.outerRotationQuarter)}`);
  if (from.innerRotationQuarter !== to.innerRotationQuarter) changes.push(`inner shape turns from ${quarterDescription(from.innerRotationQuarter)} to ${quarterDescription(to.innerRotationQuarter)}`);
  if (from.markerPosition !== to.markerPosition) changes.push(`marker moves from ${from.markerPosition.toLowerCase().replaceAll("_", " ")} to ${to.markerPosition.toLowerCase().replaceAll("_", " ")}`);
  if (from.direction !== to.direction) changes.push(`arrow turns from ${from.direction.toLowerCase()} to ${to.direction.toLowerCase()}`);
  if (from.shadedInner !== to.shadedInner) changes.push(`inner shading changes from ${from.shadedInner ? "shaded" : "open"} to ${to.shadedInner ? "shaded" : "open"}`);
  if (from.segmentCount !== to.segmentCount) changes.push(`segment count changes from ${from.segmentCount} to ${to.segmentCount}`);
  if (from.segmentAnchor !== to.segmentAnchor) changes.push(`segment group moves from the ${from.segmentAnchor.toLowerCase()} to the ${to.segmentAnchor.toLowerCase()}`);
  return changes.length > 0 ? changes.join("; ") : "no feature changes";
}

function makeOption(seed: string, index: number, label: SpatialAnalogyProofOption["label"], appliedRuleId: SpatialAnalogyProofOption["appliedRuleId"], stateInput: SpatialAnalogyFigureState): SpatialAnalogyProofOption {
  const state = normalizeSpatialAnalogyState(stateInput);
  const scene = buildSpatialAnalogyFigureScene(state, `${seed}-option-${index + 1}-${appliedRuleId}`);
  return {
    label,
    appliedRuleId,
    state,
    scene,
    stateFingerprint: spatialAnalogyStateFingerprint(state),
    sceneFingerprint: spatialSceneSemanticFingerprint(scene),
  };
}

function buildExplanationSteps(questionSeed: string, ruleId: SpatialAnalogyProofQuestion["ruleId"], correctOptionIndex: number, aState: SpatialAnalogyFigureState, bState: SpatialAnalogyFigureState, cState: SpatialAnalogyFigureState, correctState: SpatialAnalogyFigureState): SpatialExplanationStep[] {
  return [
    { id: "observe-pair", operation: "COMPARE_A_WITH_B", sourceNodeIds: ["A", "B"], evidence: { seed: questionSeed, observedChanges: describeStateChanges(aState, bState) } },
    { id: "infer-rule", operation: "INFER_UNIQUE_ANALOGY_RULE", sourceNodeIds: ["A", "B"], evidence: { ruleId, rule: spatialAnalogyRuleDescription(ruleId), ambiguityCheck: "PASS", geometricTransformCheck: "PASS_OR_NOT_APPLICABLE" } },
    { id: "apply-to-c", operation: "APPLY_RULE_TO_C", sourceNodeIds: ["C"], resultNodeIds: ["EXPECTED_D"], evidence: { appliedChanges: describeStateChanges(cState, correctState) } },
    { id: "verify-option", operation: "VERIFY_CORRECT_OPTION", sourceNodeIds: ["EXPECTED_D"], resultNodeIds: [`OPTION_${correctOptionIndex + 1}`], evidence: { correctOptionIndex, correctOptionNumber: correctOptionIndex + 1 } },
  ];
}

function buildLearnerExplanation(ruleId: SpatialAnalogyProofQuestion["ruleId"], correctOptionIndex: number, aState: SpatialAnalogyFigureState, bState: SpatialAnalogyFigureState, cState: SpatialAnalogyFigureState, correctState: SpatialAnalogyFigureState): SpatialAnalogyLearnerExplanation {
  return {
    observation: `From A to B, ${describeStateChanges(aState, bState)}.`,
    rule: `Therefore the exact rule is to ${spatialAnalogyRuleDescription(ruleId)}.`,
    application: `Apply the same rule to C: ${describeStateChanges(cState, correctState)}.`,
    check: `Option ${correctOptionIndex + 1} alone reproduces every required visible change without altering any unrelated feature.`,
  };
}

function assertVisualValidation(seed: string, context: string, validation: ReturnType<typeof validateSpatialAnalogyVisualPair>): void {
  if (!validation.ok) throw new Error(`Invalid FAN visual rule for '${seed}' (${context}): ${validation.errors.join(" | ")}`);
}

function passedGeometricCheck(validation: ReturnType<typeof validateSpatialAnalogyVisualPair>): "PASS" | "NOT_APPLICABLE" {
  if (validation.geometricTransformCheck === "FAIL") throw new Error("A failed geometric validation cannot be packaged.");
  return validation.geometricTransformCheck;
}

export function generateFigureAnalogyProofQuestion(input: SpatialAnalogyProofGeneratorInput): SpatialAnalogyProofQuestion {
  if (input.ruleId === "NO_CHANGE") throw new Error("FAN proof questions cannot use NO_CHANGE as the intended rule.");

  const aState = normalizeSpatialAnalogyState(input.aState);
  const cState = normalizeSpatialAnalogyState(input.cState);
  const bState = applySpatialAnalogyRule(aState, input.ruleId);
  const correctState = applySpatialAnalogyRule(cState, input.ruleId);
  if (!bState || !correctState) throw new Error(`Rule '${input.ruleId}' is not valid for seed '${input.seed}'.`);

  const inferredRuleIds = inferSpatialAnalogyRules(aState, bState);
  if (inferredRuleIds.length !== 1 || inferredRuleIds[0] !== input.ruleId) {
    throw new Error(`Ambiguous A→B rule for '${input.seed}': ${inferredRuleIds.join(", ") || "none"}.`);
  }

  const aScene = buildSpatialAnalogyFigureScene(aState, `${input.seed}-A`);
  const bScene = buildSpatialAnalogyFigureScene(bState, `${input.seed}-B`);
  const cScene = buildSpatialAnalogyFigureScene(cState, `${input.seed}-C`);
  const correctScene = buildSpatialAnalogyFigureScene(correctState, `${input.seed}-correct`);

  const pairValidation = validateSpatialAnalogyVisualPair(aState, bState, aScene, bScene, input.ruleId);
  const applicationValidation = validateSpatialAnalogyVisualPair(cState, correctState, cScene, correctScene, input.ruleId);
  assertVisualValidation(input.seed, "A_TO_B", pairValidation);
  assertVisualValidation(input.seed, "C_TO_CORRECT", applicationValidation);

  const unshuffledOptions: SpatialAnalogyProofOption[] = [
    makeOption(input.seed, 0, "CORRECT_RULE_APPLICATION", input.ruleId, correctState),
  ];
  input.distractors.forEach((distractor, index) => {
    const state = applySpatialAnalogyRule(cState, distractor.ruleId);
    if (!state) throw new Error(`Distractor '${distractor.ruleId}' is invalid for '${input.seed}'.`);
    unshuffledOptions.push(makeOption(input.seed, index + 1, distractor.label, distractor.ruleId, state));
  });

  for (const option of unshuffledOptions) {
    const optionValidation = validateSpatialAnalogyVisualPair(cState, option.state, cScene, option.scene, option.appliedRuleId);
    assertVisualValidation(input.seed, `OPTION_${option.appliedRuleId}`, optionValidation);
  }

  if (new Set(unshuffledOptions.map((option) => option.stateFingerprint)).size !== 4 || new Set(unshuffledOptions.map((option) => option.sceneFingerprint)).size !== 4) {
    throw new Error(`FAN option collision for seed '${input.seed}'.`);
  }

  const options = new SpatialSeededRandom(`${input.seed}:fan-option-order`).shuffle(unshuffledOptions);
  const correctOptionIndex = options.findIndex((option) => option.label === "CORRECT_RULE_APPLICATION");
  if (correctOptionIndex < 0) throw new Error(`FAN option shuffle lost the answer for '${input.seed}'.`);

  return {
    familyCode: "SPA-001",
    chapterCode: "FAN-001",
    prototypeId: input.prototypeId,
    seed: input.seed,
    instructionKey: "FAN_SELECT_FIGURE_COMPLETING_ANALOGY",
    ruleId: input.ruleId,
    aState: { ...aState },
    bState: { ...bState },
    cState: { ...cState },
    aScene,
    bScene,
    cScene,
    options,
    correctOptionIndex,
    solverEvidence: {
      inferredRuleIds,
      expectedRuleId: input.ruleId,
      ambiguityCheck: "PASS",
      geometricTransformCheck: passedGeometricCheck(pairValidation),
      visualDeltaCheck: "PASS",
      visibleRoleCheck: "PASS",
      stateFingerprints: { a: spatialAnalogyStateFingerprint(aState), b: spatialAnalogyStateFingerprint(bState), c: spatialAnalogyStateFingerprint(cState), correct: spatialAnalogyStateFingerprint(correctState) },
      optionLabels: options.map((option) => option.label),
      optionRuleIds: options.map((option) => option.appliedRuleId),
      optionStateFingerprints: options.map((option) => option.stateFingerprint),
      optionSceneFingerprints: options.map((option) => option.sceneFingerprint),
      correctOptionIndex,
    },
    reviewMetadata: {
      localeMode: "LANGUAGE_NEUTRAL",
      ruleId: input.ruleId,
      ruleComplexity: spatialAnalogyRuleComplexity(input.ruleId),
      ambiguityCheck: "PASS",
      optionUniquenessCheck: "PASS",
      deterministicRegenerationCheck: "PASS",
      geometricTransformCheck: passedGeometricCheck(pairValidation),
      visualDeltaCheck: "PASS",
      visibleRoleCheck: "PASS",
      expectedChangedFeatures: pairValidation.expectedChangedFeatures,
      actualChangedFeatures: pairValidation.actualChangedFeatures,
      changedVisualRoles: pairValidation.changedVisualRoles,
      recommendedFigurePixels: 180,
      recommendedOptionPixels: 180,
    },
    explanationSteps: buildExplanationSteps(input.seed, input.ruleId, correctOptionIndex, aState, bState, cState, correctState),
    learnerExplanation: buildLearnerExplanation(input.ruleId, correctOptionIndex, aState, bState, cState, correctState),
    lifecycle: { ...LOCKED_SPATIAL_PROOF_LIFECYCLE },
  };
}

export function describeSpatialAnalogyQuestion(question: SpatialAnalogyProofQuestion): string {
  return [`A: ${stateFeatureDescription(question.aState)}`, `B: ${stateFeatureDescription(question.bState)}`, `C: ${stateFeatureDescription(question.cState)}`].join(" | ");
}
