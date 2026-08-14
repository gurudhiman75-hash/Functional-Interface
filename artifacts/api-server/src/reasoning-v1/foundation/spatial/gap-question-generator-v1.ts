import { getSpatialGapAuthorityV1 } from "./gap-authority-v1";
import { applySpatialEditorialMaterialV2 } from "./gap-question-editorial-material-v2";
import {
  buildSpatialCanonicalQuestionV2,
} from "./gap-question-remediation-v2";
import {
  validateLearnerVisibleExplanationV2,
  validateSpatialFclCueAuditV2,
  validateSpatialPerceptualOptionUniquenessV2,
} from "./gap-question-perceptual-v2";
import {
  SPATIAL_GAP_LIFECYCLE_LOCK_V1,
  type SpatialGapIdV1,
} from "./gap-types-v1";
import type {
  SpatialGapLearnerQuestionV1,
  SpatialGapQuestionLearnerExplanationV1,
  SpatialGapQuestionOptionV1,
} from "./gap-question-types-v1";
import { spatialSceneSemanticFingerprint } from "./normalize";
import { hashSpatialSeed } from "./seed";
import { validateSpatialOptionUniqueness, validateSpatialScene } from "./validator";

function optionLetter(index: number): string {
  return String.fromCharCode(65 + index);
}

function instructionForQuestion(
  chapterCode: "FAN-001" | "FCL-001" | "FSR-001",
  gapId: SpatialGapIdV1,
): {
  instructionKey: SpatialGapLearnerQuestionV1["instructionKey"];
  stemText: string;
} {
  switch (chapterCode) {
    case "FAN-001":
      return {
        instructionKey: "FAN_SELECT_FIGURE_COMPLETING_ANALOGY",
        stemText: "Select the figure that will replace the question mark so that the second pair follows the same rule as the first pair.",
      };
    case "FCL-001":
      return {
        instructionKey: "FCL_SELECT_ODD_FIGURE",
        stemText: "Three of the following figures follow the same relation. Select the figure that does not belong to the group.",
      };
    case "FSR-001":
      return {
        instructionKey: "FSR_SELECT_NEXT_FIGURE",
        stemText: gapId === "FSR-GAP-03" || gapId === "FSR-GAP-08"
          ? "Study the four visible frames carefully and select the figure that should come next in the series."
          : "Study the figure series carefully and select the figure that should come next in the sequence.",
      };
  }
}

function expectedStimulusCount(
  chapterCode: "FAN-001" | "FCL-001" | "FSR-001",
  gapId: SpatialGapIdV1,
): number {
  if (chapterCode === "FCL-001") return 0;
  if (gapId === "FSR-GAP-03" || gapId === "FSR-GAP-08") return 4;
  return 3;
}

function deliverySafeExplanationText(
  text: string,
  chapterCode: "FAN-001" | "FCL-001" | "FSR-001",
): string {
  if (chapterCode !== "FCL-001") return text;
  return text
    .replaceAll("In the first three options", "In three options")
    .replaceAll("The first three options", "Three options")
    .replaceAll("In the first three figures", "In three figures")
    .replaceAll("The first three figures", "Three figures");
}

export function generateSpatialGapLearnerQuestionV1(input: {
  gapId: SpatialGapIdV1;
  seed: string;
  desiredCorrectOptionIndex: 0 | 1 | 2 | 3;
}): SpatialGapLearnerQuestionV1 {
  if (!input.seed.trim()) throw new Error("Spatial gap learner question requires a non-empty seed.");
  const authority = getSpatialGapAuthorityV1(input.gapId);
  if (authority.runtimeStatus !== "RUNTIME_CAPABILITY_SCALE_VALIDATED") {
    throw new Error(`${input.gapId}: runtime authority is not scale validated.`);
  }

  const canonical = buildSpatialCanonicalQuestionV2(input.gapId, input.seed);
  if (authority.chapterCode === "FCL-001") {
    if (!canonical.fclCueAudit) throw new Error(`${input.gapId}: learner-remediated FCL build is missing its cue audit.`);
    const cueAudit = validateSpatialFclCueAuditV2(canonical.fclCueAudit);
    if (!cueAudit.ok) throw new Error(`${input.gapId}: competing FCL cue audit failed: ${cueAudit.errors.join(",")}.`);
  }
  const built = applySpatialEditorialMaterialV2(canonical, input.seed);

  const correctOption: SpatialGapQuestionOptionV1 = {
    misconception: "CORRECT_RULE_APPLICATION",
    scene: built.correctScene,
    sceneFingerprint: spatialSceneSemanticFingerprint(built.correctScene),
  };
  const distractorOptions: SpatialGapQuestionOptionV1[] = built.distractors.map((distractor) => ({
    misconception: distractor.misconception,
    scene: distractor.scene,
    sceneFingerprint: spatialSceneSemanticFingerprint(distractor.scene),
  }));
  const options = [...distractorOptions];
  options.splice(input.desiredCorrectOptionIndex, 0, correctOption);

  if (options.length !== 4) throw new Error(`${input.gapId}: learner question must contain exactly four options.`);
  const allScenes = [...built.stimulusScenes, ...options.map((option) => option.scene)];
  for (const scene of allScenes) {
    const validation = validateSpatialScene(scene);
    if (!validation.ok) {
      throw new Error(`${input.gapId}: scene '${scene.id}' failed learner-question validation: ${validation.errors.map((issue) => issue.code).join(",")}.`);
    }
  }

  const semanticUniqueness = validateSpatialOptionUniqueness(options.map((option) => option.scene));
  if (!semanticUniqueness.ok) {
    throw new Error(`${input.gapId}: learner options are not semantically unique: ${semanticUniqueness.errors.map((issue) => issue.code).join(",")}.`);
  }
  const perceptualUniqueness = validateSpatialPerceptualOptionUniquenessV2(options.map((option) => option.scene));
  if (!perceptualUniqueness.ok) {
    throw new Error(`${input.gapId}: learner options collapse at the perceptual V2 grid: ${JSON.stringify(perceptualUniqueness.duplicatePairs)}.`);
  }

  const deliveredCorrect = options[input.desiredCorrectOptionIndex];
  if (!deliveredCorrect || deliveredCorrect.sceneFingerprint !== correctOption.sceneFingerprint) {
    throw new Error(`${input.gapId}: correct option placement failed.`);
  }

  const expectedCount = expectedStimulusCount(authority.chapterCode, input.gapId);
  if (built.stimulusScenes.length !== expectedCount) {
    throw new Error(`${input.gapId}: ${authority.chapterCode} stimulus contract expected ${expectedCount}, got ${built.stimulusScenes.length}.`);
  }

  const correctLetter = optionLetter(input.desiredCorrectOptionIndex);
  const explanation: SpatialGapQuestionLearnerExplanationV1 = {
    observation: deliverySafeExplanationText(built.explanation.observation, authority.chapterCode),
    rule: deliverySafeExplanationText(built.explanation.rule, authority.chapterCode),
    application: deliverySafeExplanationText(built.explanation.application, authority.chapterCode),
    check: deliverySafeExplanationText(
      built.explanation.check.replaceAll("{correct}", correctLetter),
      authority.chapterCode,
    ),
  };
  const explanationGate = validateLearnerVisibleExplanationV2([
    explanation.observation,
    explanation.rule,
    explanation.application,
    explanation.check,
  ]);
  if (!explanationGate.ok) {
    throw new Error(`${input.gapId}: learner-visible explanation gate failed: ${explanationGate.errors.join(",")}.`);
  }

  const propertyVector = authority.chapterCode === "FCL-001"
    ? options.map((_, index) => index !== input.desiredCorrectOptionIndex)
    : undefined;
  if (propertyVector && (propertyVector.filter(Boolean).length !== 3 || propertyVector[input.desiredCorrectOptionIndex] !== false)) {
    throw new Error(`${input.gapId}: classification property vector is not an exact 3-to-1 split.`);
  }

  const instruction = instructionForQuestion(authority.chapterCode, input.gapId);
  const optionFingerprints = options.map((option) => option.sceneFingerprint);
  const stimulusFingerprints = built.stimulusScenes.map(spatialSceneSemanticFingerprint);
  const contentFingerprint = JSON.stringify({
    version: "LEARNER_REMEDIATION_V2",
    gapId: input.gapId,
    chapterCode: authority.chapterCode,
    stimulusFingerprints,
    correctSceneFingerprint: correctOption.sceneFingerprint,
    optionSet: [...optionFingerprints].sort(),
  });
  const deliveryFingerprint = JSON.stringify({
    contentFingerprint,
    seed: input.seed,
    correctOptionIndex: input.desiredCorrectOptionIndex,
    optionFingerprints,
  });

  return {
    version: "SPA-FND-001-GAP-QUESTION-V1",
    familyCode: "SPA-001",
    chapterCode: authority.chapterCode,
    gapId: input.gapId,
    prototypeId: `${input.gapId}-Q-${hashSpatialSeed(input.seed).toString(16).padStart(8, "0")}`,
    seed: input.seed,
    instructionKey: instruction.instructionKey,
    stemText: instruction.stemText,
    stimulusScenes: built.stimulusScenes,
    options,
    correctOptionIndex: input.desiredCorrectOptionIndex,
    solverEvidence: {
      expectedGapId: input.gapId,
      decisiveProperty: built.decisiveProperty,
      propertyVector,
      expectedCorrectSceneFingerprint: correctOption.sceneFingerprint,
      optionSceneFingerprints: optionFingerprints,
      correctOptionIndex: input.desiredCorrectOptionIndex,
      optionUniquenessCheck: "PASS",
      semanticRuleCheck: "PASS",
      chapterContractCheck: "PASS",
      runtimeAuthorityCheck: "PASS",
    },
    learnerExplanation: explanation,
    reviewMetadata: {
      stemExamStyleCheck: "PASS",
      optionUniquenessCheck: "PASS",
      solverEvidenceCheck: "PASS",
      explanationSpecificityCheck: "PASS",
      recommendedStimulusPixels: authority.chapterCode === "FCL-001" ? 0 : 104,
      recommendedOptionPixels: 104,
      mobileReviewStatus: "ARTIFACT_READY_HUMAN_REVIEW_PENDING",
      englishFreezeStatus: "HUMAN_REVIEW_PENDING",
    },
    contentFingerprint,
    deliveryFingerprint,
    lifecycle: { ...SPATIAL_GAP_LIFECYCLE_LOCK_V1 },
  };
}
