import { getCommonQuestionLanguageIds, validatePct004Libraries } from "./library";
import { getPct004ActiveCanonicalProblemIds } from "./parameter-generator";
import { runPct004ForLanguages, runPct004Pipeline } from "./pipeline";
import type { Pct004CoverageAudit, Pct004Language, Pct004QuestionPackage } from "./types";

function countBy(values: readonly string[]) {
  return values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});
}

export function generatePct004Batch(count: number, language: Pct004Language = "en") {
  const cpIds = getPct004ActiveCanonicalProblemIds();
  return Array.from({ length: count }, (_value, index) => {
    const cpId = cpIds[index % cpIds.length]!;
    const qlIds = getCommonQuestionLanguageIds(cpId);
    const qlIndex = Math.floor(index / cpIds.length) % qlIds.length;
    return runPct004Pipeline(cpId, {
      language,
      questionLanguageId: qlIds[qlIndex],
      seed: `PCT-004:${language}:${index}`,
    });
  });
}

export function auditPct004Packages(packages: readonly Pct004QuestionPackage[]): Pct004CoverageAudit {
  const duplicateMap = new Map<string, number>();
  for (const pkg of packages) duplicateMap.set(pkg.stem, (duplicateMap.get(pkg.stem) ?? 0) + 1);
  const duplicateCount = [...duplicateMap.values()].reduce((sum, count) => sum + Math.max(0, count - 1), 0);
  const qlCoverage = countBy(packages.map((pkg) => pkg.questionLanguageId));
  const cpCoverage = countBy(packages.map((pkg) => pkg.canonicalProblemId));
  const esCoverage = countBy(packages.map((pkg) => pkg.explanationId));
  const difficultyCoverage = countBy(packages.map((pkg) => pkg.difficultyBand));
  const unusedQlIds = getPct004ActiveCanonicalProblemIds()
    .flatMap((cpId) => getCommonQuestionLanguageIds(cpId))
    .filter((id) => !qlCoverage[id]);

  let crossLanguageConsistencyFailures = 0;
  for (let index = 0; index < Math.min(60, packages.length); index += 1) {
    const pkg = packages[index]!;
    const triplet = runPct004ForLanguages(pkg.canonicalProblemId, {
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
    unusedEsIds: getPct004ActiveCanonicalProblemIds()
      .map((_cpId, index) => `PCT-ES-${String(index + 1).padStart(3, "0")}`)
      .filter((id) => !esCoverage[id]),
    crossLanguageConsistencyFailures,
    libraryValidationFailures: validatePct004Libraries().failures,
  };
}

export function generatePct004CoverageAudit(count: number, language: Pct004Language = "en") {
  const packages = generatePct004Batch(count, language);
  return { packages, audit: auditPct004Packages(packages) };
}

export function renderPct004HumanReviewCsv(packages: readonly Pct004QuestionPackage[]) {
  const header = ["language", "cpId", "qlId", "esId", "difficulty", "taskKind", "answerType", "question", "answer", "explanation", "validation"];
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
      pkg.explanation.lines.join(" | "),
      pkg.validation.valid ? "PASS" : "FAIL",
    ]
      .map((value) => `"${String(value).replaceAll('"', '""')}"`)
      .join(","),
  );
  return [header.join(","), ...rows].join("\n");
}

export function renderPct004CoverageAuditMarkdown(audit: Pct004CoverageAudit, countLabel: string) {
  return [
    "# PCT-004 Pre-Freeze Coverage Audit",
    "",
    "## Summary",
    "",
    `- Question count: ${audit.questionCount}`,
    `- Generation failures: ${audit.generationFailures}`,
    `- Validation failures: ${audit.validationFailures}`,
    `- Render failures: ${audit.renderFailures}`,
    `- Solver failures: ${audit.solverFailures}`,
    `- Duplicate rate: ${(audit.duplicateRate * 100).toFixed(2)}%`,
    `- CP coverage count: ${Object.keys(audit.cpCoverage).length}/10`,
    `- QL coverage count: ${Object.keys(audit.qlCoverage).length}/20`,
    `- ES coverage count: ${Object.keys(audit.esCoverage).length}/10`,
    `- Unused QL IDs: ${audit.unusedQlIds.length ? audit.unusedQlIds.join(", ") : "None"}`,
    `- Unused ES IDs: ${audit.unusedEsIds.length ? audit.unusedEsIds.join(", ") : "None"}`,
    `- Sample profile: ${countLabel}`,
    "",
  ].join("\n");
}

export function renderPct004MaturityAuditMarkdown(audit: Pct004CoverageAudit, countLabel: string) {
  return [
    "# PCT-004 Maturity Audit",
    "",
    `- Question count: ${audit.questionCount}`,
    `- Validation failures: ${audit.validationFailures}`,
    `- Solver failures: ${audit.solverFailures}`,
    `- Render failures: ${audit.renderFailures}`,
    `- Duplicate rate: ${(audit.duplicateRate * 100).toFixed(2)}%`,
    `- CP coverage count: ${Object.keys(audit.cpCoverage).length}/10`,
    `- QL coverage count: ${Object.keys(audit.qlCoverage).length}/20`,
    `- ES coverage count: ${Object.keys(audit.esCoverage).length}/10`,
    `- Difficulty coverage: ${Object.keys(audit.difficultyCoverage).join(", ")}`,
    `- Cross-language consistency failures: ${audit.crossLanguageConsistencyFailures}`,
    `- Library validation failures: ${audit.libraryValidationFailures.length}`,
    `- Sample profile: ${countLabel}`,
  ].join("\n");
}

export function renderPct004FreezeRecordMarkdown(audit: Pct004CoverageAudit) {
  const recommendation =
    audit.validationFailures === 0 &&
    audit.solverFailures === 0 &&
    audit.renderFailures === 0 &&
    audit.crossLanguageConsistencyFailures === 0
      ? "FIRST_PASS_FOUNDATION_READY"
      : "NOT_READY";

  return [
    "# PCT-004 Freeze Record",
    "",
    `- Questions audited: ${audit.questionCount}`,
    `- Validation failures: ${audit.validationFailures}`,
    `- Solver failures: ${audit.solverFailures}`,
    `- Render failures: ${audit.renderFailures}`,
    `- Duplicate rate: ${(audit.duplicateRate * 100).toFixed(2)}%`,
    `- Cross-language consistency failures: ${audit.crossLanguageConsistencyFailures}`,
    `- Recommendation: ${recommendation}`,
  ].join("\n");
}
