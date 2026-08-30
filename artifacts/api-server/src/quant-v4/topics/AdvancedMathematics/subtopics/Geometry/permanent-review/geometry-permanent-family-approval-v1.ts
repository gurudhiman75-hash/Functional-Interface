import {
  GEO_MERGE_SPLIT_PROPOSAL_STATE_V1,
  GEO_MERGE_SPLIT_PROPOSAL_V1,
} from "./geometry-merge-split-proposal-v1";

if (GEO_MERGE_SPLIT_PROPOSAL_V1.length !== 75) {
  throw new Error(`Geometry permanent-family approval requires 75 proven families; got ${GEO_MERGE_SPLIT_PROPOSAL_V1.length}.`);
}
if (GEO_MERGE_SPLIT_PROPOSAL_STATE_V1.permanentAllocationAuthorized !== false) {
  throw new Error("Geometry proposal V1 must remain immutable proposal evidence.");
}

export const GEO_PERMANENT_FAMILY_APPROVAL_V1 = Object.freeze({
  authorityId: "GEO-PERMANENT-FAMILY-APPROVAL-V1",
  authorityRevision: 3,
  status: "EXPLICIT_PRODUCT_OWNER_APPROVAL_RECORDED",
  approvedProposal: Object.freeze({
    temporaryCandidateCount: 81,
    semanticFamilyCount: 75,
    intentionalMergeGroupCount: 6,
    mergeSavings: 6,
  }),
  proof: Object.freeze({
    headSha: "5307cc23c306659f224e3f7817181b2c13379a97",
    workflowRunId: 33136861208,
    workflowJobId: 98738647609,
    artifactId: 9673884272,
    artifactName: "geometry-merge-split-proposal-v1",
    artifactDigest: "sha256:b78616664cb1e4ffd81ee0d6f854a3eca5d34b1006e904a875b9726ae9d5e5e4",
  }),
  approvalScope: Object.freeze({
    permanentFamilyArchitectureApproved: true,
    permanentQlAllocationAllowed: true,
    solveModeFreezeAllowed: false,
    englishFreezeAllowed: false,
    localizationAllowed: false,
    questionStudioActivationAllowed: false,
    questionBankWriteAllowed: false,
    testEligibilityAllowed: false,
    publicPublicationAllowed: false,
    prMergeAuthorized: false,
  }),
  nextGate: "PERMANENT_QL_ALLOCATION_PROOF",
} as const);
