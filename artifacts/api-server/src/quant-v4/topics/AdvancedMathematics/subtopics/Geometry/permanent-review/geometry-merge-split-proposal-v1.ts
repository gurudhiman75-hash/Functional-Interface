import { GEO_TEMPORARY_CANDIDATE_REGISTRY_V1 } from "./geometry-temporary-candidate-registry-v1";
import { GEO_MERGE_SPLIT_PROPOSAL_V1_PART_A } from "./geometry-merge-split-proposal-v1-part-a";
import { GEO_MERGE_SPLIT_PROPOSAL_V1_PART_B } from "./geometry-merge-split-proposal-v1-part-b";
import { GEO_MERGE_SPLIT_PROPOSAL_V1_PART_C } from "./geometry-merge-split-proposal-v1-part-c";
import { GEO_MERGE_SPLIT_PROPOSAL_V1_PART_D } from "./geometry-merge-split-proposal-v1-part-d";
import type { GeometryMergeSplitFamilyProposalV1 } from "./geometry-merge-split-proposal-v1-types";

export const GEO_MERGE_SPLIT_PROPOSAL_V1: readonly GeometryMergeSplitFamilyProposalV1[] = Object.freeze([
  ...GEO_MERGE_SPLIT_PROPOSAL_V1_PART_A,
  ...GEO_MERGE_SPLIT_PROPOSAL_V1_PART_B,
  ...GEO_MERGE_SPLIT_PROPOSAL_V1_PART_C,
  ...GEO_MERGE_SPLIT_PROPOSAL_V1_PART_D,
]);

export const GEO_MERGE_SPLIT_PROPOSAL_STATE_V1 = Object.freeze({
  state: "STRICT_81_TO_74_MERGE_SPLIT_PROPOSAL_COMPLETE__PERMANENT_ALLOCATION_NOT_AUTHORIZED",
  temporaryCandidateCount: GEO_TEMPORARY_CANDIDATE_REGISTRY_V1.length,
  proposedSemanticFamilyCount: GEO_MERGE_SPLIT_PROPOSAL_V1.length,
  expectedProposedSemanticFamilyCount: 74,
  permanentQlCount: 0,
  permanentQlIdsReserved: false,
  permanentAllocationAuthorized: false,
  solveModeFreezeAuthorized: false,
  englishFreezeAuthorized: false,
  localizationAuthorized: false,
  questionStudioActivationAuthorized: false,
  questionBankWriteAuthorized: false,
  testEligibilityAuthorized: false,
  publicPublicationAuthorized: false,
});
