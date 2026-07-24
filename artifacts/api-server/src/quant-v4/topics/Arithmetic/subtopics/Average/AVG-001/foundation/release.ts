import { applyAvg001HumanAuthoredExplanation } from "./human-authored-explanation-final";
import type { Avg001QuestionPackage, Avg001ValidationCheck } from "./types";
import { validateAvg001QuestionPackage } from "./validator";

export const AVG_001_ENGLISH_RELEASE = Object.freeze({
  releaseId: "AVG-001-EN-v1",
  packageId: "AVG-001",
  language: "en",
  status: "FROZEN",
  editorialStatus: "APPROVED",
  publiclyPublishable: true,
  cpCount: 6,
  qlCount: 425,
  approvedBy: "ExamTree product owner",
  approvedAt: "2026-07-24",
  approvalScope: "English question language, options, explanations and runtime generation",
  excludedLanguages: ["hi", "pa"] as const,
});

export const AVG_001_REVIEW_APPROVAL = Object.freeze({
  editorialStatus: AVG_001_ENGLISH_RELEASE.editorialStatus,
  reviewer: AVG_001_ENGLISH_RELEASE.approvedBy,
  reviewedAt: AVG_001_ENGLISH_RELEASE.approvedAt,
  reviewNotes: `Approved under ${AVG_001_ENGLISH_RELEASE.releaseId}; future editorial changes require a new review cycle.`,
});

export function avg001ApprovedReviewColumns() {
  return [
    "PASS",
    "PASS",
    "PASS",
    "PASS",
    "PASS",
    "PASS",
    "PASS",
    AVG_001_REVIEW_APPROVAL.editorialStatus,
    "",
    AVG_001_REVIEW_APPROVAL.reviewNotes,
    AVG_001_REVIEW_APPROVAL.reviewer,
    AVG_001_REVIEW_APPROVAL.reviewedAt,
  ];
}

function releaseValidationChecks(pkg: Avg001QuestionPackage) {
  const checks: Avg001ValidationCheck[] = pkg.validation.checks.filter(
    (check) => check.name !== "maturity" && check.name !== "release-approval",
  );
  checks.push({
    name: "release-approval",
    passed: pkg.language === "en" && pkg.validation.valid,
    message: `${AVG_001_ENGLISH_RELEASE.releaseId} approves the validated English package for controlled publication`,
  });
  return checks;
}

export function applyAvg001EnglishRelease(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  if (pkg.language !== AVG_001_ENGLISH_RELEASE.language) {
    throw new Error(
      `${AVG_001_ENGLISH_RELEASE.releaseId} approves English only; received ${pkg.language}`,
    );
  }

  const humanized = applyAvg001HumanAuthoredExplanation(pkg);
  const { validation: _previousValidation, ...candidate } = humanized;
  const validation = validateAvg001QuestionPackage(candidate);
  const validated: Avg001QuestionPackage = { ...humanized, validation };

  if (!validated.validation.valid || validated.validation.checks.some((check) => !check.passed)) {
    const failures = validated.validation.checks
      .filter((check) => !check.passed)
      .map((check) => `${check.name}: ${check.message}`)
      .join("; ");
    throw new Error(
      `${pkg.questionLanguageId}: cannot apply ${AVG_001_ENGLISH_RELEASE.releaseId} after explanation authorship validation [${failures}]`,
    );
  }

  const checks = releaseValidationChecks(validated);
  return {
    ...validated,
    maturity: "FROZEN",
    publiclyPublishable: true,
    validation: {
      valid: checks.every((check) => check.passed),
      checks,
    },
    traceability: {
      ...validated.traceability,
      releaseId: AVG_001_ENGLISH_RELEASE.releaseId,
      releaseStatus: AVG_001_ENGLISH_RELEASE.status,
      editorialStatus: AVG_001_ENGLISH_RELEASE.editorialStatus,
      approvedLanguage: AVG_001_ENGLISH_RELEASE.language,
      approvedBy: AVG_001_ENGLISH_RELEASE.approvedBy,
      approvedAt: AVG_001_ENGLISH_RELEASE.approvedAt,
      publiclyPublishable: AVG_001_ENGLISH_RELEASE.publiclyPublishable,
    },
  };
}
