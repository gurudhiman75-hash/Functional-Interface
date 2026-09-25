import { DIR_001_CHECKPOINTS } from "./DIR-001-CHAPTER-MANIFEST";
import { DIR_001_MULTILINGUAL_FREEZE_AUTHORITY_V1 } from "./DIR-001-MULTILINGUAL-FREEZE";
import { DIR_001_QLS } from "./chapter-registry";
import {
  DIR001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
  DIR001_STANDARD_REVIEW_ONLY_PACKAGE_V1,
} from "./dir-001-question-studio-integration";

export const DIR_001_FINAL_AUDIT_CLOSURE_V1 = Object.freeze({
  authorityId: "DIR-001-FINAL-AUDIT-CLOSURE-V1" as const,
  packageId: "DIR-001" as const,
  chapterId: "REAS-DIR" as const,
  auditStatus: "FINAL_AUDIT_COMPLETE" as const,
  closureStatus: "CLOSURE_CANDIDATE" as const,
  auditDate: "2026-09-25" as const,
  permanentQlCount: 44 as const,
  checkpointCount: 8 as const,
  englishFreeze: true as const,
  multilingualFreezeAuthority: DIR_001_MULTILINGUAL_FREEZE_AUTHORITY_V1.authorityId,
  questionStudioAuthority: DIR001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
  stemAuditComplete: true as const,
  distractorAuditComplete: true as const,
  explanationAuditComplete: true as const,
  localizationAuditComplete: true as const,
  difficultyAuditComplete: true as const,
  diagramAuditComplete: true as const,
  questionStudioIntegrationComplete: true as const,
  multilingualFreezeComplete: true as const,
  deterministicRuntimeProofRequired: true as const,
  humanClosureApprovalRequired: true as const,

  // Final audit completion does not grant learner-delivery authority.
  questionStudioDiscoverable: true as const,
  questionStudioGenerationEnabled: true as const,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false as const,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
  studentDeliveryAuthorized: false as const,
  productionReleaseAuthorized: false as const,
  productionPromotionApproved: false as const,
});

if (DIR_001_QLS.length !== DIR_001_FINAL_AUDIT_CLOSURE_V1.permanentQlCount) {
  throw new Error("DIR-001 closure QL count drift");
}
if (DIR_001_CHECKPOINTS.length !== DIR_001_FINAL_AUDIT_CLOSURE_V1.checkpointCount) {
  throw new Error("DIR-001 closure checkpoint count drift");
}
if (DIR_001_MULTILINGUAL_FREEZE_AUTHORITY_V1.status !== "MULTILINGUAL_FROZEN") {
  throw new Error("DIR-001 closure requires multilingual freeze");
}
if (DIR001_STANDARD_REVIEW_ONLY_PACKAGE_V1.questionBankWritable !== false
  || DIR001_STANDARD_REVIEW_ONLY_PACKAGE_V1.testEligible !== false
  || DIR001_STANDARD_REVIEW_ONLY_PACKAGE_V1.mockTestEligible !== false
  || DIR001_STANDARD_REVIEW_ONLY_PACKAGE_V1.publiclyPublishable !== false
  || DIR001_STANDARD_REVIEW_ONLY_PACKAGE_V1.productionReleaseAuthorized !== false) {
  throw new Error("DIR-001 closure may not open downstream learner-delivery gates");
}
