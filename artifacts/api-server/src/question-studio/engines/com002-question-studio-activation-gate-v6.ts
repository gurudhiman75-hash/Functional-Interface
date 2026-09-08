import { COM002_V6_V5_OPERATIONAL_FREEZE } from "../../knowledge-v1/computer-awareness/com002-v6-v5-operational-freeze";
import { QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";
import { COM002_QUESTION_STUDIO_ACTIVATION_GATE_V5 } from "./com002-question-studio-activation-gate-v5";

export const COM002_QUESTION_STUDIO_ACTIVATION_GATE_V6 = Object.freeze({
  authorityId: "COM-002-QUESTION-STUDIO-ACTIVATION-GATE-V6" as const,
  chapterId: "COM-002" as const,
  packageId: "COM-002" as const,
  engineId: "knowledge-v1" as const,
  supersedes: COM002_QUESTION_STUDIO_ACTIVATION_GATE_V5.authorityId,
  status: "ACTIVE_STANDARD_BANK_ONLY" as const,
  operationalFreezeAuthorityId: COM002_V6_V5_OPERATIONAL_FREEZE.authorityId,
  activation: Object.freeze({
    questionStudioDiscoverable: true,
    questionStudioRegistrationAllowed: true,
    reviewRunPersistenceAllowed: QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1.reviewRunPersistenceAllowed,
    canonicalQuestionPersistenceAllowed: QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1.canonicalQuestionPersistenceAllowed,
    questionBankWritable: QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1.questionBankWritable,
    questionBankAcceptanceMode: QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1.questionBankAcceptanceMode,
    testEligible: QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1.testEligible,
    mockTestEligible: QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1.mockTestEligible,
    publiclyPublishable: QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1.publiclyPublishable,
    automaticStudentPublication: QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1.automaticStudentPublication,
    productionReleaseAuthorized: QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1.productionReleaseAuthorized,
  }),
  contentAuthority: Object.freeze({
    explicitHumanApprovalVerified: true,
    machineFingerprintsPinned: true,
    englishGeneratorVersion: COM002_V6_V5_OPERATIONAL_FREEZE.englishGeneratorVersion,
    localizationVersion: COM002_V6_V5_OPERATIONAL_FREEZE.localizationVersion,
    englishCombinedFingerprint: COM002_V6_V5_OPERATIONAL_FREEZE.fingerprints.englishV6CombinedFingerprint,
    localizationCombinedFingerprint: COM002_V6_V5_OPERATIONAL_FREEZE.fingerprints.localizationV5CombinedFingerprint,
  }),
  satisfiedEvidence: [
    "COM002_V6_V5_HUMAN_APPROVAL_AUTHORITY",
    "COM002_V6_V5_OPERATIONAL_FREEZE",
    "COM002_V6_V5_REVIEW_ONLY_ADAPTER_AUDIT_GREEN",
    "COM002_STANDARD_BANK_ONLY_LIFECYCLE_CONTRACT",
  ] as const,
  releaseBoundary: "BANK_ONLY_MANUAL_ACCEPTANCE_WITH_PUBLIC_AND_DOWNSTREAM_LOCKS" as const,
});

export function auditCom002QuestionStudioActivationGateV6() {
  const issues: string[] = [];
  const gate = COM002_QUESTION_STUDIO_ACTIVATION_GATE_V6;
  if (gate.status !== "ACTIVE_STANDARD_BANK_ONLY") issues.push("STATUS");
  if (!gate.activation.questionStudioDiscoverable) issues.push("NOT_DISCOVERABLE");
  if (!gate.activation.questionBankWritable) issues.push("BANK_NOT_WRITABLE");
  if (gate.activation.questionBankAcceptanceMode !== "BANK_ONLY") issues.push("WRONG_ACCEPTANCE_MODE");
  if (gate.activation.testEligible || gate.activation.mockTestEligible) issues.push("DOWNSTREAM_TESTS_OPEN");
  if (gate.activation.publiclyPublishable || gate.activation.automaticStudentPublication || gate.activation.productionReleaseAuthorized) {
    issues.push("PUBLIC_OR_PRODUCTION_OPEN");
  }
  return { valid: issues.length === 0, issues };
}
