import {
  applyAvg001NaturalLanguageV35HeaderAlignment,
  AVG_001_NATURAL_LANGUAGE_V3_5_HEADER_ALIGNMENT,
} from "./natural-language-v3-5-header-alignment";
import type { Avg001QuestionPackage, Avg001ValidationCheck } from "./types";

export const AVG_001_NATURAL_LANGUAGE_V3_5_APPROVED =
  "AVG-001 natural teacher-language approved release v3.5 header-aligned";

export const AVG_001_NATURAL_LANGUAGE_V3_5_APPROVED_AT =
  "2026-07-31T02:04:00.000Z";

function refreshValidation(pkg: Avg001QuestionPackage) {
  const checks: Avg001ValidationCheck[] = pkg.validation.checks.filter(
    (check) => check.name !== "avg001-natural-language-v3-5-approved",
  );
  checks.push({
    name: "avg001-natural-language-v3-5-approved",
    passed:
      pkg.options.length === 4 &&
      pkg.options[pkg.correctIndex] === pkg.answer &&
      pkg.explanation.lines.length === 4 &&
      pkg.maturity === "FROZEN" &&
      pkg.publiclyPublishable === true &&
      pkg.traceability.editorialStatus === "APPROVED" &&
      pkg.traceability.reviewStatus === "APPROVED" &&
      pkg.traceability.publicationState === "PUBLISHED" &&
      pkg.traceability.publiclyPublishable === true &&
      pkg.traceability.approvalAuthority === "EXPLICIT_USER_PRODUCT_SIGN_OFF",
    message:
      "AVG-001 V3.5 is frozen, explicitly approved and published without changing the reviewed learner or mathematical authority",
  });
  return { valid: checks.every((check) => check.passed), checks };
}

/**
 * Final publication authority created after explicit product sign-off.
 * This wrapper changes release metadata only. The complete reviewed question,
 * option, answer, explanation and mathematical authority remain unchanged.
 */
export function applyAvg001NaturalLanguageV35Approved(
  source: Avg001QuestionPackage,
): Avg001QuestionPackage {
  const reviewed = applyAvg001NaturalLanguageV35HeaderAlignment(source);
  const approved: Avg001QuestionPackage = {
    ...reviewed,
    maturity: "FROZEN",
    publiclyPublishable: true,
    traceability: {
      ...reviewed.traceability,
      naturalLanguageV35ApprovedRelease: AVG_001_NATURAL_LANGUAGE_V3_5_APPROVED,
      approvedFrom: AVG_001_NATURAL_LANGUAGE_V3_5_HEADER_ALIGNMENT,
      editorialStatus: "APPROVED",
      reviewStatus: "APPROVED",
      publicationState: "PUBLISHED",
      publiclyPublishable: true,
      approvedAt: AVG_001_NATURAL_LANGUAGE_V3_5_APPROVED_AT,
      approvalAuthority: "EXPLICIT_USER_PRODUCT_SIGN_OFF",
    },
  };
  return { ...approved, validation: refreshValidation(approved) };
}
