import { SEA002_CP007_PERMANENT_QL_REGISTRY } from "../permanent/registry.ts";

export const SEA002_CP007_ENGLISH_REVIEW_V7 = Object.freeze({
  status: "CI_CERTIFIED_SELF_REVIEW_COMPLETE" as const,
  humanApprovalStatus: "PENDING" as const,
  renderer: "EXAM_REAL_VISUAL_DEDUCTION_V8_EXPLICIT_PLACEMENT_FACINGS" as const,
  reviewFingerprint: "95d99edb9a20a92391f675a986c82232fe416f8b1d9b81fc289634333bf59373" as const,
  exactHeadRunId: 32815724114,
  artifactId: 9551313639,
  artifactSha256: "2e084bd56adf704e3c97473472e887c7db4ae3563591e5db21bf30b985dd5287" as const,
});

export const SEA002_CP007_LOCALIZATION_REVIEW_V2 = Object.freeze({
  status: "V2_REVIEW_READY_HUMAN_APPROVAL_PENDING" as const,
  humanApprovalStatus: "PENDING" as const,
  locales: Object.freeze(["hi-IN", "pa-IN"] as const),
  canonicalCaselets: 24,
  localizedLearnerSurfaces: 48,
  reviewFingerprint: "3b64a3dc7c943dbd7b50c737772bc8d18ec837c1b1333e6d5aa23469bb80a811" as const,
  exactHeadRunId: 32815724103,
  artifactId: 9551312737,
  artifactSha256: "b4aa17178e5495de1e56a50eae1ad703f1b9abb627034e0e91fdd9d5b6fa7616" as const,
  languageFidelityPolicy: "GENDER_NEUTRAL_EXAM_WORDING_V2" as const,
  mechanicalGenderSlashResidue: 0,
  unnaturalImmediateQueryResidue: 0,
  structuralParityChanged: false,
});

export const SEA002_CP007_PREFREEZE_AUTHORITY_V1 = Object.freeze({
  checkpointId: "SEA-CP-007" as const,
  permanentQlIds: Object.freeze(["SEA-QL-025", "SEA-QL-026", "SEA-QL-027", "SEA-QL-028"] as const),
  english: SEA002_CP007_ENGLISH_REVIEW_V7,
  localization: SEA002_CP007_LOCALIZATION_REVIEW_V2,
  productOwnerApprovalStatus: "PENDING" as const,
  freezeStatus: "NOT_FROZEN" as const,
  approvalRequiredBeforeFreeze: true,
  questionStudioActivationEligible: false,
  questionStudioRegistered: false,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  productionStaging: false,
  publiclyPublishable: false,
  automaticStudentDelivery: false,
  nextPermanentQlId: "SEA-QL-029" as const,
});

export function assertSea002Cp007PrefreezeBoundary(): void {
  const authority = SEA002_CP007_PREFREEZE_AUTHORITY_V1;
  if (authority.productOwnerApprovalStatus !== "PENDING" || authority.freezeStatus !== "NOT_FROZEN") {
    throw new Error("SEA-CP-007 must not claim freeze before explicit product-owner approval.");
  }
  if (authority.questionStudioActivationEligible
    || authority.questionStudioRegistered
    || authority.questionBankWritable
    || authority.testEligible
    || authority.mockTestEligible
    || authority.productionStaging
    || authority.publiclyPublishable
    || authority.automaticStudentDelivery) {
    throw new Error("SEA-CP-007 pre-freeze authority must keep every downstream product surface locked.");
  }
  if (SEA002_CP007_PERMANENT_QL_REGISTRY.some((entry) =>
    entry.active
    || entry.questionStudioDiscoverable
    || entry.questionBankWritable
    || entry.testEligible
    || entry.mockTestEligible
    || entry.productionStaging
    || entry.publiclyPublishable
    || entry.automaticStudentPublication)) {
    throw new Error("SEA-CP-007 permanent QLs drifted active before approval/freeze.");
  }
}
