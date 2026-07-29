import { runAvg001Cp001LocalizationPilot } from "./cp001-localization-quality-runtime";
import { runAvg001Cp002LocalizationPilot } from "./cp002-localization-quality-runtime";
import { runAvg001Cp003LocalizationPilot } from "./cp003-localization-quality-runtime";
import { runAvg001Cp004LocalizationPilot } from "./cp004-localization-quality-runtime";
import { runAvg001Cp005LocalizationPilot } from "./cp005-localization-quality-runtime";
import { runAvg001Cp006LocalizationPilot } from "./cp006-localization-quality-runtime";
import { getAvg001QuestionEntry } from "./library";
import type { Avg001QuestionPackage, Avg001ValidationCheck } from "./types";

export type Avg001ReleasedLocalizedLanguage = "hi" | "pa";

export const AVG_001_LOCALIZED_RELEASE = Object.freeze({
  packageId: "AVG-001",
  status: "FROZEN",
  editorialStatus: "APPROVED",
  publiclyPublishable: true,
  questionStudioRelease: true,
  cpCount: 6,
  qlCountPerLanguage: 425,
  solveModeCount: 45,
  approvedBy: "ExamTree product owner",
  approvedAt: "2026-07-29",
  releases: Object.freeze({
    hi: Object.freeze({ releaseId: "AVG-001-HI-v1", language: "hi" as const }),
    pa: Object.freeze({ releaseId: "AVG-001-PA-v1", language: "pa" as const }),
  }),
  approvalScope:
    "Complete Hindi and Punjabi learner-facing stems and explanations across all six Average canonical problems, preserving English mathematical authority",
});

function runnerFor(cpId: string) {
  if (cpId === "AVG-CP-001") return runAvg001Cp001LocalizationPilot;
  if (cpId === "AVG-CP-002") return runAvg001Cp002LocalizationPilot;
  if (cpId === "AVG-CP-003") return runAvg001Cp003LocalizationPilot;
  if (cpId === "AVG-CP-004") return runAvg001Cp004LocalizationPilot;
  if (cpId === "AVG-CP-005") return runAvg001Cp005LocalizationPilot;
  if (cpId === "AVG-CP-006") return runAvg001Cp006LocalizationPilot;
  throw new Error(`No AVG-001 localized runtime exists for ${cpId}`);
}

function localizedReleaseValidation(pkg: Avg001QuestionPackage) {
  const checks: Avg001ValidationCheck[] = pkg.validation.checks.filter(
    (check) =>
      check.name !== "maturity" &&
      check.name !== "release-approval" &&
      check.name !== "localized-release-approval",
  );
  const release = AVG_001_LOCALIZED_RELEASE.releases[pkg.language as Avg001ReleasedLocalizedLanguage];
  checks.push({
    name: "localized-release-approval",
    passed:
      Boolean(release) &&
      pkg.validation.valid &&
      pkg.explanation.lines.length === 4 &&
      pkg.options.length === 4 &&
      new Set(pkg.options).size === 4 &&
      pkg.options[pkg.correctIndex] === pkg.answer,
    message: `${release?.releaseId ?? "AVG-001 localized release"} approves the validated learner presentation for Question Studio publication`,
  });
  return { valid: checks.every((check) => check.passed), checks };
}

export function applyAvg001LocalizedRelease(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  if (pkg.language !== "hi" && pkg.language !== "pa") {
    throw new Error(`AVG-001 localized release supports Hindi or Punjabi only; received ${pkg.language}`);
  }
  if (!pkg.validation.valid || pkg.validation.checks.some((check) => !check.passed)) {
    const failures = pkg.validation.checks
      .filter((check) => !check.passed)
      .map((check) => `${check.name}: ${check.message}`)
      .join("; ");
    throw new Error(`${pkg.questionLanguageId}:${pkg.language}: localized candidate is not releasable [${failures}]`);
  }

  const release = AVG_001_LOCALIZED_RELEASE.releases[pkg.language];
  const validation = localizedReleaseValidation(pkg);
  return {
    ...pkg,
    maturity: "FROZEN",
    publiclyPublishable: true,
    validation,
    traceability: {
      ...pkg.traceability,
      releaseId: release.releaseId,
      releaseStatus: AVG_001_LOCALIZED_RELEASE.status,
      editorialStatus: AVG_001_LOCALIZED_RELEASE.editorialStatus,
      approvedLanguage: release.language,
      approvedBy: AVG_001_LOCALIZED_RELEASE.approvedBy,
      approvedAt: AVG_001_LOCALIZED_RELEASE.approvedAt,
      publiclyPublishable: AVG_001_LOCALIZED_RELEASE.publiclyPublishable,
      questionStudioRelease: AVG_001_LOCALIZED_RELEASE.questionStudioRelease,
      mathematicalAuthorityLanguage: "en",
    },
  };
}

export function runAvg001LocalizedRelease(input: {
  questionLanguageId: string;
  seed?: string;
  language: Avg001ReleasedLocalizedLanguage;
}): Avg001QuestionPackage {
  const entry = getAvg001QuestionEntry(input.questionLanguageId);
  const seed = input.seed ?? `avg-001-localized-release:${input.language}:${input.questionLanguageId}`;
  const localized = runnerFor(entry.cpId)({
    questionLanguageId: input.questionLanguageId,
    seed,
    language: input.language,
  });
  return applyAvg001LocalizedRelease(localized);
}
