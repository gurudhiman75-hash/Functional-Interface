import { buildSylProfilePlanV4, type SylProfilePlanSlotV4 } from "./profile-plan-v4";

export type SylBankingConclusionStructureV1 = "TWO_CONCLUSION" | "THREE_CONCLUSION";
export type SylBankingConclusionSemanticFeatureV1 =
  | "STANDARD_DEFINITE"
  | "ORDINARY_POSSIBILITY"
  | "CAN_NEVER";
export type SylBankingPremiseOverlayFeatureV1 = "ONLY" | "ONLY_A_FEW";
export type SylBankingConclusionSetRelationshipV1 =
  | "INDEPENDENT"
  | "COMPLEMENTARY_EITHER_OR";

export interface SylBankingFactorizedSlotV1 {
  index: number;
  sourceFamilyId: string;
  sourcePercentileSlot: number;
  readiness: SylProfilePlanSlotV4["readiness"];
  canonicalQlId: SylProfilePlanSlotV4["canonicalQlId"];
  conclusionStructure: SylBankingConclusionStructureV1;
  allowedConclusionSemanticFeatures: readonly SylBankingConclusionSemanticFeatureV1[];
  allowedPremiseOverlayFeatures: readonly SylBankingPremiseOverlayFeatureV1[];
  conclusionSetRelationship: SylBankingConclusionSetRelationshipV1;
  exactFeatureFrequencyClaim: false;
}

function factorize(slot: SylProfilePlanSlotV4): SylBankingFactorizedSlotV1 {
  switch (slot.familyId) {
    case "BANK_TWO_CONCLUSION_FIVE_OPTION":
      return {
        index: slot.index,
        sourceFamilyId: slot.familyId,
        sourcePercentileSlot: slot.sourcePercentileSlot,
        readiness: slot.readiness,
        canonicalQlId: slot.canonicalQlId,
        conclusionStructure: "TWO_CONCLUSION",
        allowedConclusionSemanticFeatures: ["STANDARD_DEFINITE"],
        allowedPremiseOverlayFeatures: [],
        conclusionSetRelationship: "INDEPENDENT",
        exactFeatureFrequencyClaim: false,
      };
    case "BANK_EITHER_OR_COMPLEMENTARY":
      return {
        index: slot.index,
        sourceFamilyId: slot.familyId,
        sourcePercentileSlot: slot.sourcePercentileSlot,
        readiness: slot.readiness,
        canonicalQlId: slot.canonicalQlId,
        conclusionStructure: "TWO_CONCLUSION",
        allowedConclusionSemanticFeatures: ["STANDARD_DEFINITE"],
        allowedPremiseOverlayFeatures: [],
        conclusionSetRelationship: "COMPLEMENTARY_EITHER_OR",
        exactFeatureFrequencyClaim: false,
      };
    case "BANK_POSSIBILITY_IN_CONCLUSION_SET":
      return {
        index: slot.index,
        sourceFamilyId: slot.familyId,
        sourcePercentileSlot: slot.sourcePercentileSlot,
        readiness: slot.readiness,
        canonicalQlId: slot.canonicalQlId,
        conclusionStructure: "TWO_CONCLUSION",
        allowedConclusionSemanticFeatures: ["ORDINARY_POSSIBILITY", "CAN_NEVER"],
        allowedPremiseOverlayFeatures: [],
        conclusionSetRelationship: "INDEPENDENT",
        exactFeatureFrequencyClaim: false,
      };
    case "BANK_ONLY_AND_ONLY_A_FEW":
      return {
        index: slot.index,
        sourceFamilyId: slot.familyId,
        sourcePercentileSlot: slot.sourcePercentileSlot,
        readiness: slot.readiness,
        canonicalQlId: slot.canonicalQlId,
        conclusionStructure: "TWO_CONCLUSION",
        allowedConclusionSemanticFeatures: ["STANDARD_DEFINITE"],
        allowedPremiseOverlayFeatures: ["ONLY", "ONLY_A_FEW"],
        conclusionSetRelationship: "INDEPENDENT",
        exactFeatureFrequencyClaim: false,
      };
    case "BANK_THREE_CONCLUSION_ADVANCED":
      return {
        index: slot.index,
        sourceFamilyId: slot.familyId,
        sourcePercentileSlot: slot.sourcePercentileSlot,
        readiness: slot.readiness,
        canonicalQlId: slot.canonicalQlId,
        conclusionStructure: "THREE_CONCLUSION",
        allowedConclusionSemanticFeatures: ["STANDARD_DEFINITE"],
        allowedPremiseOverlayFeatures: [],
        conclusionSetRelationship: "INDEPENDENT",
        exactFeatureFrequencyClaim: false,
      };
    default:
      throw new Error(`Unexpected Banking profile family ${slot.familyId}`);
  }
}

export function buildSylBankingFactorizedProfileCandidateV1(seed: number, requestedCount: number) {
  const sourcePlan = buildSylProfilePlanV4("BANKING", seed, requestedCount);
  return Object.freeze({
    authority: "SYL_001_BANKING_FACTORIZED_PROFILE_CANDIDATE_V1" as const,
    profile: "BANKING" as const,
    seed,
    requestedCount,
    sourcePlannerAuthority: sourcePlan.authority,
    slots: Object.freeze(sourcePlan.slots.map(factorize)),
    dimensions: Object.freeze([
      "CONCLUSION_STRUCTURE",
      "CONCLUSION_SEMANTIC_FEATURE",
      "PREMISE_VOCABULARY_OVERLAY",
      "CONCLUSION_SET_RELATIONSHIP",
    ] as const),
    featureValuesAreMultiLabelWhereApplicable: true as const,
    sourceFamilyPercentagesRetainedOnlyAsProvisionalInput: true as const,
    exactFactorWeightsFrozen: false as const,
    sourceFrequencyClaim: false as const,
    connectedToProductionPlanner: false as const,
    connectedToProductionGenerator: false as const,
    registrationPermitted: false as const,
    activationPermitted: false as const,
  });
}

export const SYL_BANKING_FACTORIZED_PROFILE_CANDIDATE_V1 = Object.freeze({
  authorityId: "SYL_001_BANKING_FACTORIZED_PROFILE_CANDIDATE_V1",
  censusAuthority: "SYL_001_BANKING_CROSS_EXAM_CENSUS_V6",
  sourcePlannerAuthority: "SYL_001_PROFILE_PLAN_V4",
  minimumIndependentDimensions: 4,
  dimensions: [
    "CONCLUSION_STRUCTURE",
    "CONCLUSION_SEMANTIC_FEATURE",
    "PREMISE_VOCABULARY_OVERLAY",
    "CONCLUSION_SET_RELATIONSHIP",
  ] as const,
  conclusionSemanticFeaturesMultiLabel: true,
  premiseOverlayFeaturesMultiLabel: true,
  exactFactorWeightsFrozen: false,
  currentProvisionalMixChanged: false,
  permanentQlCreated: false,
  connectedToProductionPlanner: false,
  connectedToProductionGenerator: false,
  registrationPermitted: false,
  activationPermitted: false,
});
