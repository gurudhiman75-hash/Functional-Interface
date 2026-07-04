import { validatePct001Libraries } from "./library";
import { getPct001ActiveCanonicalProblemIds, getSelectableQuestionLanguageIds } from "./parameter-generator";
import { runPct001ForLanguages, runPct001Pipeline } from "./pipeline";
import { isQlLocalized } from "../../../../../common/language-coverage";
import type { Pct001Language, Pct001QuestionPackage } from "./types";

function countBy(values: readonly string[]) {
  return values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});
}

export function generatePct001Batch(count: number, language: Pct001Language = "en") {
  const cpIds = getPct001ActiveCanonicalProblemIds();
  return Array.from({ length: count }, (_value, index) => {
    const cpId = cpIds[index % cpIds.length]!;
    const qlIds = getSelectableQuestionLanguageIds(cpId, language);
    const qlIndex = Math.floor(index / cpIds.length) % qlIds.length;
    return runPct001Pipeline(cpId, {
      language,
      questionLanguageId: qlIds[qlIndex],
      seed: `PCT-001:${language}:${index}`,
    });
  });
}

export function auditPct001Packages(packages: readonly Pct001QuestionPackage[]) {
  const duplicateMap = new Map<string, number>();
  for (const pkg of packages) duplicateMap.set(pkg.stem, (duplicateMap.get(pkg.stem) ?? 0) + 1);
  const duplicateCount = [...duplicateMap.values()].reduce((sum, count) => sum + Math.max(0, count - 1), 0);
  const qlCoverage = countBy(packages.map((pkg) => pkg.questionLanguageId));
  const cpCoverage = countBy(packages.map((pkg) => pkg.canonicalProblemId));
  const esCoverage = countBy(packages.map((pkg) => pkg.explanationId));
  const difficultyCoverage = countBy(packages.map((pkg) => pkg.difficultyBand));
  const auditLanguage = packages[0]?.language ?? "en";
  const unusedQlIds = getPct001ActiveCanonicalProblemIds()
    .flatMap((cpId) => getSelectableQuestionLanguageIds(cpId, auditLanguage))
    .filter((id) => !qlCoverage[id]);
  
  let crossLanguageConsistencyFailures = 0;
  for (let index = 0; index < Math.min(120, packages.length); index += 1) {
    const pkg = packages[index]!;
    const isLocalizedTriplet =
      isQlLocalized("PCT-001", pkg.questionLanguageId, "hi") &&
      isQlLocalized("PCT-001", pkg.questionLanguageId, "pa");
    if (!isLocalizedTriplet) continue;
    const triplet = runPct001ForLanguages(pkg.canonicalProblemId, {
      seed: `cross-language:${index}`,
      questionLanguageId: pkg.questionLanguageId,
      difficultyBand: pkg.difficultyBand,
    });
    const answers = new Set(triplet.map((item) => item.answer));
    if (answers.size !== 1) crossLanguageConsistencyFailures += 1;
  }

  return {
    questionCount: packages.length,
    generationFailures: 0,
    validationFailures: packages.filter((pkg) => !pkg.validation.valid).length,
    renderFailures: packages.filter((pkg) => pkg.stem.includes("undefined") || pkg.stem.includes("NaN")).length,
    solverFailures: packages.filter((pkg) => pkg.answer.includes("undefined") || pkg.answer.includes("NaN") || pkg.answer.length === 0).length,
    duplicateRate: packages.length ? duplicateCount / packages.length : 0,
    cpCoverage,
    qlCoverage,
    esCoverage,
    difficultyCoverage,
    unusedQlIds,
    unusedEsIds: getPct001ActiveCanonicalProblemIds().map((cpId, index) => `PCT-ES-${String(index + 1).padStart(3, "0")}`).filter((id) => !esCoverage[id]),
    crossLanguageConsistencyFailures,
    libraryValidationFailures: validatePct001Libraries().failures,
  };
}

export function generatePct001CoverageAudit(count: number, language: Pct001Language = "en") {
  const packages = generatePct001Batch(count, language);
  return { packages, audit: auditPct001Packages(packages) };
}

export function renderPct001HumanReviewCsv(packages: readonly Pct001QuestionPackage[]) {
  const header = ["language", "cpId", "qlId", "esId", "difficulty", "taskKind", "answerType", "question", "answer", "validation"];
  const rows = packages.map((pkg) =>
    [
      pkg.language,
      pkg.canonicalProblemId,
      pkg.questionLanguageId,
      pkg.explanationId,
      pkg.difficultyBand,
      pkg.parameters.taskKind,
      pkg.parameters.answerType,
      pkg.stem,
      pkg.answer,
      pkg.validation.valid ? "PASS" : "FAIL",
    ]
      .map((value) => `"${String(value).replaceAll('"', '""')}"`)
      .join(","),
  );
  return [header.join(","), ...rows].join("\n");
}

export function renderPct001CoverageAuditMarkdown(audit: any, countLabel: string) {
  return [
    "# PCT-001 Pre-Freeze Coverage Audit",
    "",
    "## Summary",
    "",
    `- Question count: ${audit.questionCount}`,
    `- Generation failures: ${audit.generationFailures}`,
    `- Validation failures: ${audit.validationFailures}`,
    `- Render failures: ${audit.renderFailures}`,
    `- Solver failures: ${audit.solverFailures}`,
    `- Duplicate rate: ${(audit.duplicateRate * 100).toFixed(2)}%`,
    `- Sample profile: ${countLabel}`,
    "",
  ].join("\n");
}
