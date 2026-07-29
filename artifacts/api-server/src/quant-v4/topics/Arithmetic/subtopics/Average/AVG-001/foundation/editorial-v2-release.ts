import { applyAvg001EditorialV2CompleteCandidate } from "./editorial-v2-complete";
import { runAvg001Pipeline } from "./pipeline";
import type { Avg001QuestionPackage, Avg001ValidationCheck } from "./types";

export const AVG_001_ENGLISH_RELEASE_V2 = Object.freeze({
  releaseId: "AVG-001-EN-v2",
  supersedes: "AVG-001-EN-v1",
  packageId: "AVG-001",
  language: "en",
  status: "FROZEN",
  editorialStatus: "APPROVED",
  publiclyPublishable: true,
  questionStudioRelease: true,
  cpCount: 6,
  qlCount: 425,
  solveModeCount: 45,
  difficultyDistribution: Object.freeze({ Easy: 182, Medium: 185, Hard: 58 }),
  approvedBy: "ExamTree product owner",
  approvedAt: "2026-07-29",
  approvalScope:
    "Complete English editorial v2 question language, semantic options, misconception traceability, four-tier explanations and Question Studio generation",
  excludedLanguages: ["hi", "pa"] as const,
});

function releaseValidation(pkg: Avg001QuestionPackage) {
  const checks: Avg001ValidationCheck[] = pkg.validation.checks.filter(
    (check) => check.name !== "release-approval" && check.name !== "release-approval-v2",
  );
  checks.push({
    name: "release-approval-v2",
    passed:
      pkg.language === AVG_001_ENGLISH_RELEASE_V2.language &&
      pkg.validation.valid &&
      pkg.traceability.releaseCandidate === AVG_001_ENGLISH_RELEASE_V2.releaseId,
    message: `${AVG_001_ENGLISH_RELEASE_V2.releaseId} approves the complete validated English v2 package for Question Studio publication`,
  });
  return { valid: checks.every((check) => check.passed), checks };
}

export function applyAvg001EnglishV2Release(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  if (pkg.language !== AVG_001_ENGLISH_RELEASE_V2.language) {
    throw new Error(
      `${AVG_001_ENGLISH_RELEASE_V2.releaseId} approves English only; received ${pkg.language}`,
    );
  }

  const candidate = applyAvg001EditorialV2CompleteCandidate(pkg);
  if (!candidate.validation.valid || candidate.validation.checks.some((check) => !check.passed)) {
    const failures = candidate.validation.checks
      .filter((check) => !check.passed)
      .map((check) => `${check.name}: ${check.message}`)
      .join("; ");
    throw new Error(
      `${candidate.questionLanguageId}: cannot apply ${AVG_001_ENGLISH_RELEASE_V2.releaseId} [${failures}]`,
    );
  }

  const validation = releaseValidation(candidate);
  return {
    ...candidate,
    maturity: "FROZEN",
    publiclyPublishable: true,
    validation,
    traceability: {
      ...candidate.traceability,
      releaseId: AVG_001_ENGLISH_RELEASE_V2.releaseId,
      supersedesReleaseId: AVG_001_ENGLISH_RELEASE_V2.supersedes,
      releaseStatus: AVG_001_ENGLISH_RELEASE_V2.status,
      editorialStatus: AVG_001_ENGLISH_RELEASE_V2.editorialStatus,
      approvedLanguage: AVG_001_ENGLISH_RELEASE_V2.language,
      approvedBy: AVG_001_ENGLISH_RELEASE_V2.approvedBy,
      approvedAt: AVG_001_ENGLISH_RELEASE_V2.approvedAt,
      publiclyPublishable: AVG_001_ENGLISH_RELEASE_V2.publiclyPublishable,
      questionStudioRelease: AVG_001_ENGLISH_RELEASE_V2.questionStudioRelease,
    },
  };
}

export function runAvg001EditorialV2Pipeline(
  input: Parameters<typeof runAvg001Pipeline>[0] = {},
): Avg001QuestionPackage {
  return applyAvg001EnglishV2Release(runAvg001Pipeline(input));
}
