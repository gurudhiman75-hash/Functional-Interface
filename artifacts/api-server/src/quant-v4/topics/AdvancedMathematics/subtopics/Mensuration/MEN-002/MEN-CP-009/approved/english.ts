import { generateMenCp009QuestionV2 } from "../coverage-v2/runtime";
import { buildMenCp009StudentView } from "../coverage-v2/student-view-v3";
import {
  MEN_CP_009_APPROVED_ENGLISH_RELEASE_ID,
  MEN_CP_009_APPROVAL_PROVENANCE,
  type MenCp009ApprovedEnglishView,
} from "./types";

const APPROVAL_RECORD = {
  approvedAt: "2026-08-11T08:48:00+05:30" as const,
  reviewedAuthority: "MEN-CP009-STUDENT-VIEW-V3" as const,
  reviewedQuestionCount: 110 as const,
  permanentQlCount: 28 as const,
  permanentQlRange: "MEN-002-QL-096..MEN-002-QL-123" as const,
  workflowRunId: 31418827531 as const,
  artifactId: 9074523066 as const,
  artifactName: "men-cp009-learner-review-v3" as const,
  artifactDigest:
    "sha256:d24be5a73e5a6f7738b2cceae524a770178d4da983ae585df6947b7fe39c7f04" as const,
  reviewedHeadSha: "245a12616b3082dd7e3fddbacda68f92dff20f00" as const,
};

function validateApproval(
  candidate: ReturnType<typeof buildMenCp009StudentView>,
  approved: Omit<MenCp009ApprovedEnglishView, "approvalValidation">,
) {
  const {
    releaseId: _releaseId,
    editorialStatus: _editorialStatus,
    reviewStatus: _reviewStatus,
    approvalProvenance: _approvalProvenance,
    approvalRecord: _approvalRecord,
    active: _active,
    questionStudioDiscoverable: _questionStudioDiscoverable,
    questionBankStatus: _questionBankStatus,
    questionBankWritable: _questionBankWritable,
    testEligibility: _testEligibility,
    testEligible: _testEligible,
    publiclyPublishable: _publiclyPublishable,
    ...approvedCandidateFields
  } = approved;

  const checks = [
    {
      name: "approved release identity",
      passed: approved.releaseId === MEN_CP_009_APPROVED_ENGLISH_RELEASE_ID,
      message: "The CP-009 approved English learner view must use the fixed V3 release ID.",
    },
    {
      name: "reviewed learner authority",
      passed:
        approved.authority === "MEN-CP009-STUDENT-VIEW-V3" &&
        approved.approvalRecord.reviewedAuthority === "MEN-CP009-STUDENT-VIEW-V3",
      message: "Approval applies to the exact learner-presentation V3 authority that was reviewed.",
    },
    {
      name: "source validation",
      passed: candidate.sourceValidationPassed && candidate.sourceVerificationPassed,
      message: "Only mathematically validated and independently verified source questions may enter the approved view.",
    },
    {
      name: "learner presentation equality",
      passed: JSON.stringify(approvedCandidateFields) === JSON.stringify(candidate),
      message: "Approval may add lifecycle/review metadata only; it must not change any reviewed learner field.",
    },
    {
      name: "explicit product-owner provenance",
      passed:
        approved.approvalProvenance === MEN_CP_009_APPROVAL_PROVENANCE &&
        approved.approvalRecord.reviewedQuestionCount === 110 &&
        approved.approvalRecord.permanentQlCount === 28,
      message: "Approval must point to the explicit product-owner approval of the 110-question V3 semantic review artifact.",
    },
    {
      name: "approved editorial state",
      passed:
        approved.editorialStatus === "APPROVED" &&
        approved.reviewStatus === "APPROVED_EDITORIAL_ENGLISH",
      message: "The English learner presentation must move to the approved editorial state.",
    },
    {
      name: "inactive lifecycle",
      passed:
        !approved.active &&
        !approved.questionStudioDiscoverable &&
        approved.questionBankStatus === "NOT_STORED" &&
        !approved.questionBankWritable &&
        approved.testEligibility === "INELIGIBLE" &&
        !approved.testEligible &&
        !approved.publiclyPublishable,
      message: "English approval must not activate Question Studio, Question Bank, tests or public delivery.",
    },
  ];

  return { valid: checks.every((check) => check.passed), checks };
}

export function generateMenCp009ApprovedEnglishView(
  qlId: string,
  seed: string,
): MenCp009ApprovedEnglishView {
  const sourceQuestion = generateMenCp009QuestionV2(qlId, seed);
  const candidate = buildMenCp009StudentView(sourceQuestion);
  const partial = {
    ...candidate,
    releaseId: MEN_CP_009_APPROVED_ENGLISH_RELEASE_ID,
    editorialStatus: "APPROVED" as const,
    reviewStatus: "APPROVED_EDITORIAL_ENGLISH" as const,
    approvalProvenance: MEN_CP_009_APPROVAL_PROVENANCE,
    approvalRecord: APPROVAL_RECORD,
    active: false as const,
    questionStudioDiscoverable: false as const,
    questionBankStatus: "NOT_STORED" as const,
    questionBankWritable: false as const,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    publiclyPublishable: false as const,
  };

  return {
    ...partial,
    approvalValidation: validateApproval(candidate, partial),
  };
}
