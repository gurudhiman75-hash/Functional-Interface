import { generateMenCp007PermanentQuestion } from "../permanent/runtime";
import type { MenCp007PermanentPackage } from "../permanent/types";
import type { MenCp007ApprovedEnglishPackage } from "./types";

function validateApproval(
  candidate: MenCp007PermanentPackage,
  approved: Omit<MenCp007ApprovedEnglishPackage, "approvalValidation">,
) {
  const candidateComparable = {
    ...candidate,
    editorialStatus: undefined,
    reviewStatus: undefined,
  };
  const approvedComparable = {
    ...approved,
    releaseId: undefined,
    approvalProvenance: undefined,
    editorialStatus: undefined,
    reviewStatus: undefined,
  };
  const checks = [
    {
      name: "approved release identity",
      passed: approved.releaseId === "MEN-CP007-EN-v1-APPROVED",
      message: "The approved English release must use its fixed release ID.",
    },
    {
      name: "candidate readiness",
      passed: candidate.validation.valid && candidate.editorialStatus === "PENDING_PRODUCT_REVIEW",
      message: "Only the green English Editorial V2 candidate may be approved.",
    },
    {
      name: "learner and mathematical equality",
      passed: JSON.stringify(candidateComparable, (_key, value) => typeof value === "bigint" ? value.toString() : value) ===
        JSON.stringify(approvedComparable, (_key, value) => typeof value === "bigint" ? value.toString() : value),
      message: "Approval may change only approval metadata, never learner content or mathematical authority.",
    },
    {
      name: "honest review provenance",
      passed: approved.approvalProvenance === "GROUPED_MANUAL_AND_EXECUTABLE_AUDIT_UNDER_PRODUCT_OWNER_DIRECTIVE",
      message: "Approval must record grouped review under the CP-by-CP product-owner directive without claiming row-by-row owner review.",
    },
    {
      name: "approved editorial status",
      passed: approved.editorialStatus === "APPROVED" && approved.reviewStatus === "APPROVED_EDITORIAL_ENGLISH",
      message: "The English editorial layer must move to the approved state.",
    },
    {
      name: "inactive lifecycle",
      passed: !approved.active && !approved.questionStudioDiscoverable && !approved.questionBankWritable && !approved.testEligible && !approved.publiclyPublishable,
      message: "Editorial approval must not activate any product or publication surface.",
    },
  ];
  return { valid: checks.every((check) => check.passed), checks };
}

export function generateMenCp007ApprovedEnglishQuestion(
  qlId: string,
  seed: string,
): MenCp007ApprovedEnglishPackage {
  const candidate = generateMenCp007PermanentQuestion(qlId, seed, "en");
  const partial = {
    ...candidate,
    releaseId: "MEN-CP007-EN-v1-APPROVED" as const,
    editorialStatus: "APPROVED" as const,
    reviewStatus: "APPROVED_EDITORIAL_ENGLISH" as const,
    approvalProvenance: "GROUPED_MANUAL_AND_EXECUTABLE_AUDIT_UNDER_PRODUCT_OWNER_DIRECTIVE" as const,
  };
  return { ...partial, approvalValidation: validateApproval(candidate, partial) };
}
