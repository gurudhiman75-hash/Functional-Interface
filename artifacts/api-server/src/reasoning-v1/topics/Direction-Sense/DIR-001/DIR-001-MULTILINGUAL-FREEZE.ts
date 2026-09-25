import { DIR_001_QLS } from "./chapter-registry";
import {
  DIR001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
  DIR001_STANDARD_REVIEW_ONLY_PACKAGE_V1,
} from "./dir-001-question-studio-integration";

export const DIR_001_MULTILINGUAL_FREEZE_AUTHORITY_V1 = Object.freeze({
  authorityId: "DIR-001-MULTILINGUAL-FREEZE-V1" as const,
  packageId: "DIR-001" as const,
  chapterId: "REAS-DIR" as const,
  status: "MULTILINGUAL_FROZEN" as const,
  auditWave: 10 as const,
  auditDate: "2026-09-25" as const,
  permanentQlCount: 44 as const,
  permanentQlRange: "DIR-QL-001..DIR-QL-044" as const,
  checkpointCount: 8 as const,
  checkpointIds: [
    "DIR-CP-001", "DIR-CP-002", "DIR-CP-003", "DIR-CP-004",
    "DIR-CP-005", "DIR-CP-006", "DIR-CP-007", "DIR-CP-008",
  ] as const,
  locales: ["en-IN", "hi-IN", "pa-IN"] as const,
  localizedLocales: ["hi-IN", "pa-IN"] as const,
  englishFreezePreserved: true as const,
  hindiPunjabiFrozen: true as const,
  answerParityFrozen: true as const,
  correctIndexParityFrozen: true as const,
  structuredPromptParityFrozen: true as const,
  diagramPolicyFrozen: "EXPLANATION_ONLY" as const,
  questionStyle: "EXAM_GRADE_CONCISE_NATURAL" as const,
  explanationStyle: "SIMPLE_COHERENT_WORKED" as const,
  difficultyPolicy: "GENERATED_INSTANCE_AUDITED_V1" as const,
  questionStudioAuthority: DIR001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
  questionStudioDiscoverable: true as const,
  questionStudioGenerationEnabled: true as const,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
  productionReleaseAuthorized: false as const,
  manualApprovalRequired: true as const,
});

if (DIR_001_QLS.length !== DIR_001_MULTILINGUAL_FREEZE_AUTHORITY_V1.permanentQlCount) {
  throw new Error("DIR-001 multilingual freeze QL count drift");
}
if (DIR001_STANDARD_REVIEW_ONLY_PACKAGE_V1.questionBankWritable !== false) {
  throw new Error("DIR-001 multilingual freeze may not open Question Bank");
}
if (DIR001_STANDARD_REVIEW_ONLY_PACKAGE_V1.testEligible !== false) {
  throw new Error("DIR-001 multilingual freeze may not open test eligibility");
}
if (DIR001_STANDARD_REVIEW_ONLY_PACKAGE_V1.mockTestEligible !== false) {
  throw new Error("DIR-001 multilingual freeze may not open mock-test eligibility");
}
if (DIR001_STANDARD_REVIEW_ONLY_PACKAGE_V1.publiclyPublishable !== false) {
  throw new Error("DIR-001 multilingual freeze may not open public publication");
}
if (DIR001_STANDARD_REVIEW_ONLY_PACKAGE_V1.productionReleaseAuthorized !== false) {
  throw new Error("DIR-001 multilingual freeze may not authorize production release");
}
