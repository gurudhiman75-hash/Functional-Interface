import type { MenCp009StudentView } from "../coverage-v2/student-view-v3";

export const MEN_CP_009_APPROVED_ENGLISH_RELEASE_ID =
  "MEN-CP009-EN-V3-APPROVED" as const;

export const MEN_CP_009_APPROVAL_PROVENANCE =
  "EXPLICIT_PRODUCT_OWNER_APPROVAL_OF_V3_SEMANTIC_REVIEW_ARTIFACT" as const;

export interface MenCp009ApprovedEnglishView extends MenCp009StudentView {
  releaseId: typeof MEN_CP_009_APPROVED_ENGLISH_RELEASE_ID;
  editorialStatus: "APPROVED";
  reviewStatus: "APPROVED_EDITORIAL_ENGLISH";
  approvalProvenance: typeof MEN_CP_009_APPROVAL_PROVENANCE;
  approvalRecord: {
    approvedAt: "2026-08-11T08:48:00+05:30";
    reviewedAuthority: "MEN-CP009-STUDENT-VIEW-V3";
    reviewedQuestionCount: 110;
    permanentQlCount: 28;
    permanentQlRange: "MEN-002-QL-096..MEN-002-QL-123";
    workflowRunId: 31418827531;
    artifactId: 9074523066;
    artifactName: "men-cp009-learner-review-v3";
    artifactDigest: "sha256:d24be5a73e5a6f7738b2cceae524a770178d4da983ae585df6947b7fe39c7f04";
    reviewedHeadSha: "245a12616b3082dd7e3fddbacda68f92dff20f00";
  };
  approvalValidation: {
    valid: boolean;
    checks: Array<{ name: string; passed: boolean; message: string }>;
  };
  active: false;
  questionStudioDiscoverable: false;
  questionBankStatus: "NOT_STORED";
  questionBankWritable: false;
  testEligibility: "INELIGIBLE";
  testEligible: false;
  publiclyPublishable: false;
}
