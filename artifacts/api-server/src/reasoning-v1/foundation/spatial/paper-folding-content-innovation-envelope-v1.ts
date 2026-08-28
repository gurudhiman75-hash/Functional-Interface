export const PFC_001_CONTENT_INNOVATION_ENVELOPE_V1 = Object.freeze({
  authorityId: "PFC-001-CONTENT-INNOVATION-ENVELOPE-V1" as const,
  policy: "PYQ_COVERAGE_IS_THE_FLOOR_NOT_THE_CEILING" as const,
  purpose: "Generate exam-relevant but genuinely new paper-folding questions without cloning historical PYQs." as const,
  lanes: {
    sourceBackedCore: {
      provenance: "SOURCE_BACKED_CORE" as const,
      description: "Directly covers historically observed learner skills and representations.",
      recommendedShare: 0.50,
      humanReviewRequiredBeforeFamilyActivation: true,
    },
    controlledNovel: {
      provenance: "CONTROLLED_NOVEL" as const,
      description: "Extends a source-backed learner skill along physically valid representation or construction axes.",
      recommendedShare: 0.40,
      humanReviewRequiredBeforeFamilyActivation: true,
    },
    experimentalStretch: {
      provenance: "EXPERIMENTAL_STRETCH" as const,
      description: "Explores farther combinations that are still solver-valid but may exceed normal exam difficulty/style.",
      recommendedShare: 0.10,
      publicRuntimeAllowedByDefault: false,
      humanReviewRequiredForEveryActivation: true,
    },
  },
  noveltyAxes: [
    "SOURCE_SHEET_GEOMETRY",
    "FOLD_LINE_POSITION",
    "FOLD_LINE_ANGLE",
    "FOLD_SEQUENCE",
    "CUT_GEOMETRY_COMBINATION",
    "CUT_TOPOLOGY",
    "TASK_DIRECTION",
    "PARTIAL_UNFOLD_STATE",
    "SYMMETRY_BREAK",
  ] as const,
  controlledNovelSubstrateProfiles: [
    "REGULAR_PENTAGON",
    "REGULAR_OCTAGON",
    "SKEWED_CONVEX_POLYGON",
    "GENERAL_CONVEX_POLYGON",
  ] as const,
  noveltyBudgetByDifficulty: {
    EASY: { maxNovelAxes: 1, maxFoldOperations: 2 },
    MEDIUM: { maxNovelAxes: 2, maxFoldOperations: 3 },
    HARD: { maxNovelAxes: 3, maxFoldOperations: 4 },
    EXPERIMENTAL: { maxNovelAxes: 4, maxFoldOperations: 5 },
  } as const,
  mandatoryValidityGates: [
    "EXISTING_QL_SKILL_ALIGNMENT",
    "EXACT_PHYSICAL_GEOMETRY_SOLVES",
    "ALL_CUTS_LIE_ON_REACHABLE_FOLDED_LAYERS",
    "UNIQUE_CORRECT_ANSWER",
    "DISTRACTORS_REPRESENT_COHERENT_REASONING_ERRORS",
    "VISIBLE_OPTION_SEPARATION",
    "NO_SYNTHETIC_OR_STRAY_MARKS",
    "NORMALIZED_DIAGRAM_SCALE",
    "PROVENANCE_TAGGED_AS_CORE_OR_NOVEL_OR_STRETCH",
    "NO_FALSE_PYQ_ATTRIBUTION",
  ] as const,
  generationRules: {
    pyqExactCloneAllowed: false,
    paperShapeCreatesStandaloneQl: false,
    noveltyAloneCreatesStandaloneQl: false,
    newQlRequiredOnlyForNewLearnerSkill: true,
    difficultyMustComeFromReasoningOperationsNotDecorativeNoise: true,
    controlledNovelMayEnterProductionAfterFamilyReview: true,
    experimentalStretchMayEnterProductionByDefault: false,
  } as const,
  permanentQlAllocationAllowed: false,
  questionStudioRegistrationAllowedAfterFamilyReview: true,
} as const);

export type PfcInnovationProvenanceV1 =
  | "SOURCE_BACKED_CORE"
  | "CONTROLLED_NOVEL"
  | "EXPERIMENTAL_STRETCH";

export type PfcNovelSubstrateProfileV1 =
  | "REGULAR_PENTAGON"
  | "REGULAR_OCTAGON"
  | "SKEWED_CONVEX_POLYGON"
  | "GENERAL_CONVEX_POLYGON";

export interface PfcInnovationCandidateV1 {
  candidateId: string;
  provenance: PfcInnovationProvenanceV1;
  proposalId: "PFC-PROP-01" | "PFC-PROP-02" | "PFC-PROP-03" | "PFC-PROP-04" | "PFC-PROP-05";
  substrateProfile: PfcNovelSubstrateProfileV1 | "SOURCE_BACKED";
  novelAxes: readonly (typeof PFC_001_CONTENT_INNOVATION_ENVELOPE_V1.noveltyAxes)[number][];
  foldOperationCount: number;
  intendedDifficulty: keyof typeof PFC_001_CONTENT_INNOVATION_ENVELOPE_V1.noveltyBudgetByDifficulty;
}

export function validatePfcInnovationCandidateV1(candidate: PfcInnovationCandidateV1): PfcInnovationCandidateV1 {
  const budget = PFC_001_CONTENT_INNOVATION_ENVELOPE_V1.noveltyBudgetByDifficulty[candidate.intendedDifficulty];
  if (candidate.novelAxes.length > budget.maxNovelAxes) {
    throw new Error(`${candidate.candidateId} exceeds ${candidate.intendedDifficulty} novelty-axis budget.`);
  }
  if (candidate.foldOperationCount > budget.maxFoldOperations) {
    throw new Error(`${candidate.candidateId} exceeds ${candidate.intendedDifficulty} fold-operation budget.`);
  }
  if (candidate.provenance === "SOURCE_BACKED_CORE" && candidate.novelAxes.length !== 0) {
    throw new Error(`${candidate.candidateId} cannot be source-backed core while declaring novel axes.`);
  }
  if (candidate.provenance !== "SOURCE_BACKED_CORE" && candidate.substrateProfile === "SOURCE_BACKED" && candidate.novelAxes.length === 0) {
    throw new Error(`${candidate.candidateId} has no declared novelty.`);
  }
  return candidate;
}
