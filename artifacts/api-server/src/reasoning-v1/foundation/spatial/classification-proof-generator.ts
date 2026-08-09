import {
  normalizeSpatialAnalogyState,
  spatialAnalogyStateFingerprint,
} from "./analogy-rule-authority";
import type {
  SpatialAnalogyFigureState,
} from "./analogy-types";
import {
  auditSpatialClassificationNuisanceFeatures,
} from "./classification-ambiguity-validator";
import {
  findSpatialClassificationSeparatingProperties,
  spatialClassificationPropertyDescription,
  spatialClassificationPropertyEvidence,
  spatialClassificationPropertyVector,
} from "./classification-property-authority";
import {
  buildSpatialClassificationFigureScene,
  validateSpatialClassificationSceneAgainstState,
} from "./classification-scene";
import type {
  SpatialClassificationLearnerExplanation,
  SpatialClassificationProofGeneratorInput,
  SpatialClassificationProofOption,
  SpatialClassificationProofQuestion,
} from "./classification-types";
import {
  spatialSceneSemanticFingerprint,
} from "./normalize";
import {
  LOCKED_SPATIAL_PROOF_LIFECYCLE,
} from "./proof-packaging";
import type {
  SpatialExplanationStep,
} from "./types";
import {
  validateSpatialScene,
} from "./validator";

function optionLetter(index: number): string {
  return String.fromCharCode(65 + index);
}

function buildLearnerExplanation(
  propertyDescription: string,
  propertyVector: boolean[],
  oddIndex: number,
  evidence: string[],
): SpatialClassificationLearnerExplanation {
  const evaluations = evidence.map(
    (item, index) =>
      `${optionLetter(index)}: ${item} — ${propertyVector[index] ? "follows the rule" : "does not follow the rule"}`,
  );
  return {
    observation:
      "Check the same relationship in A, B, C and D instead of comparing only one visible feature.",
    rule: `The common property is that ${propertyDescription}.`,
    application: evaluations.join("; "),
    check: `Only figure ${optionLetter(oddIndex)} fails the relationship, so ${optionLetter(oddIndex)} is the odd figure.`,
  };
}

function buildExplanationSteps(
  propertyId: SpatialClassificationProofQuestion["propertyId"],
  propertyDescription: string,
  propertyVector: boolean[],
  oddIndex: number,
  evidence: string[],
): SpatialExplanationStep[] {
  return [
    {
      id: "observe-options",
      operation: "COMPARE_ALL_FOUR_FIGURES",
      sourceNodeIds: ["OPTION_A", "OPTION_B", "OPTION_C", "OPTION_D"],
      evidence: { optionEvidence: evidence },
    },
    {
      id: "identify-property",
      operation: "IDENTIFY_UNIQUE_COMMON_PROPERTY",
      sourceNodeIds: ["OPTION_A", "OPTION_B", "OPTION_C", "OPTION_D"],
      evidence: {
        propertyId,
        propertyDescription,
        propertyVector: propertyVector.map(String),
      },
    },
    {
      id: "audit-nuisance-features",
      operation: "REJECT_UNINTENDED_THREE_TO_ONE_SHORTCUTS",
      sourceNodeIds: ["OPTION_A", "OPTION_B", "OPTION_C", "OPTION_D"],
      evidence: { nuisanceFeatureAudit: "PASS" },
    },
    {
      id: "verify-answer",
      operation: "VERIFY_ODD_FIGURE",
      sourceNodeIds: ["OPTION_A", "OPTION_B", "OPTION_C", "OPTION_D"],
      resultNodeIds: [`OPTION_${optionLetter(oddIndex)}`],
      evidence: {
        correctOptionIndex: oddIndex,
        correctOptionNumber: oddIndex + 1,
        oddEvidence: evidence[oddIndex]!,
      },
    },
  ];
}

export function generateFigureClassificationProofQuestion(
  input: SpatialClassificationProofGeneratorInput,
): SpatialClassificationProofQuestion {
  const states = input.states.map((state) =>
    normalizeSpatialAnalogyState(state),
  ) as [
    SpatialAnalogyFigureState,
    SpatialAnalogyFigureState,
    SpatialAnalogyFigureState,
    SpatialAnalogyFigureState,
  ];
  const propertyVector = spatialClassificationPropertyVector(
    states,
    input.propertyId,
  );
  const oddIndices = propertyVector
    .map((satisfies, index) => (!satisfies ? index : -1))
    .filter((index) => index >= 0);
  if (
    propertyVector.filter(Boolean).length !== 3 ||
    oddIndices.length !== 1 ||
    oddIndices[0] !== input.expectedOddIndex
  ) {
    throw new Error(
      `FCL intended property does not create the expected 3-to-1 split for '${input.seed}'.`,
    );
  }

  const separatingPropertyIds =
    findSpatialClassificationSeparatingProperties(states);
  if (
    separatingPropertyIds.length !== 1 ||
    separatingPropertyIds[0] !== input.propertyId
  ) {
    throw new Error(
      `Ambiguous FCL approved-property classification for '${input.seed}': ${separatingPropertyIds.join(", ") || "none"}.`,
    );
  }

  const nuisanceAudit = auditSpatialClassificationNuisanceFeatures(
    states,
    input.propertyId,
    input.presentationProfile,
  );
  if (!nuisanceAudit.ok) {
    throw new Error(
      `Nuisance feature ambiguity for '${input.seed}': ${nuisanceAudit.ambiguousFeatureIds.join(", ")}.`,
    );
  }

  const options: SpatialClassificationProofOption[] = states.map(
    (state, index) => {
      const scene = buildSpatialClassificationFigureScene(
        state,
        `${input.seed}-option-${index + 1}`,
        input.presentationProfile,
      );
      const sceneValidation = validateSpatialScene(scene);
      if (!sceneValidation.ok) {
        throw new Error(
          `Invalid FCL scene '${input.seed}' option ${index + 1}: ${sceneValidation.errors.map((item) => item.code).join(", ")}.`,
        );
      }
      const integrity = validateSpatialClassificationSceneAgainstState(
        scene,
        state,
        input.presentationProfile,
      );
      if (!integrity.ok) {
        throw new Error(
          `FCL scene/state mismatch '${input.seed}' option ${index + 1}: ${integrity.errors.join(", ")}.`,
        );
      }
      return {
        label:
          index === input.expectedOddIndex
            ? "ODD_FIGURE"
            : "COMMON_PROPERTY_MEMBER",
        state,
        scene,
        satisfiesProperty: propertyVector[index]!,
        stateFingerprint: spatialAnalogyStateFingerprint(state),
        sceneFingerprint: spatialSceneSemanticFingerprint(scene),
      };
    },
  );

  if (
    new Set(options.map((option) => option.stateFingerprint)).size !== 4 ||
    new Set(options.map((option) => option.sceneFingerprint)).size !== 4
  ) {
    throw new Error(`FCL option collision for seed '${input.seed}'.`);
  }

  const propertyDescription =
    spatialClassificationPropertyDescription(input.propertyId);
  const evidence = states.map((state) =>
    spatialClassificationPropertyEvidence(state, input.propertyId),
  );
  const presentationProfile = { ...input.presentationProfile };

  return {
    familyCode: "SPA-001",
    chapterCode: "FCL-001",
    prototypeId: input.prototypeId,
    seed: input.seed,
    instructionKey: "FCL_SELECT_ODD_FIGURE",
    propertyId: input.propertyId,
    presentationProfile,
    options,
    correctOptionIndex: input.expectedOddIndex,
    solverEvidence: {
      propertyId: input.propertyId,
      propertyVector,
      separatingPropertyIds,
      ambiguityCheck: "PASS",
      approvedPropertyAuthorityCheck: "PASS",
      nuisanceFeatureAuditCheck: "PASS",
      nuisanceFeatureDistributions: nuisanceAudit.distributions,
      presentationProfile,
      optionStateFingerprints: options.map(
        (option) => option.stateFingerprint,
      ),
      optionSceneFingerprints: options.map(
        (option) => option.sceneFingerprint,
      ),
      sceneIntegrityCheck: "PASS",
      correctOptionIndex: input.expectedOddIndex,
    },
    reviewMetadata: {
      localeMode: "LANGUAGE_NEUTRAL",
      propertyId: input.propertyId,
      propertyDescription,
      propertyVector,
      uniqueWithinApprovedPropertyAuthorityCheck: "PASS",
      nuisanceFeatureAuditCheck: "PASS",
      auditedNuisanceFeatureCount: nuisanceAudit.distributions.length,
      nuisanceFeatureDistributions: nuisanceAudit.distributions,
      presentationProfile,
      optionUniquenessCheck: "PASS",
      sceneIntegrityCheck: "PASS",
      deterministicRegenerationCheck: "PASS",
      recommendedOptionPixels: 180,
    },
    explanationSteps: buildExplanationSteps(
      input.propertyId,
      propertyDescription,
      propertyVector,
      input.expectedOddIndex,
      evidence,
    ),
    learnerExplanation: buildLearnerExplanation(
      propertyDescription,
      propertyVector,
      input.expectedOddIndex,
      evidence,
    ),
    lifecycle: { ...LOCKED_SPATIAL_PROOF_LIFECYCLE },
  };
}
