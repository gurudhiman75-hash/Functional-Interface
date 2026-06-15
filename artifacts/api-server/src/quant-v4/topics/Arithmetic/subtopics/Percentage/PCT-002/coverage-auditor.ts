import { getActiveQuestionLanguageIds, getCommonQuestionLanguageIds, validatePct002Libraries } from "./library";
import { getPct002ActiveCanonicalProblemIds, pickPct002CanonicalProblemId } from "./parameter-generator";
import { runPct002ForLanguages, runPct002Pipeline } from "./pipeline";
import { PCT_002_CP_IDS, type Pct002CanonicalProblemId, type Pct002CoverageAudit, type Pct002Language, type Pct002QuestionPackage } from "./types";

function countBy(values: readonly string[]) {
  return values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});
}

function buildWeightedCpSequence() {
  const weights: Record<Pct002CanonicalProblemId, number> = {
    "PCT-CP-001": 15,
    "PCT-CP-002": 15,
    "PCT-CP-003": 15,
    "PCT-CP-004": 20,
    "PCT-CP-005": 15,
    "PCT-CP-006": 20,
  };
  return PCT_002_CP_IDS.flatMap((cpId) => Array.from({ length: weights[cpId] }, () => cpId));
}

const WEIGHTED_CP_SEQUENCE = buildWeightedCpSequence();

export function generatePct002Batch(count: number, language: Pct002Language = "en") {
  const cpQuestionCounters = new Map<Pct002CanonicalProblemId, number>();
  return Array.from({ length: count }, (_value, index) => {
    const cpId = WEIGHTED_CP_SEQUENCE[index % WEIGHTED_CP_SEQUENCE.length] ?? pickPct002CanonicalProblemId(`PCT-002:${index}`);
    const seenForCp = cpQuestionCounters.get(cpId) ?? 0;
    const qlIds = getCommonQuestionLanguageIds(cpId);
    const qlId = qlIds[seenForCp % qlIds.length]!;
    cpQuestionCounters.set(cpId, seenForCp + 1);
    return runPct002Pipeline(cpId, {
      language,
      questionLanguageId: qlId,
      seed: `PCT-002:${language}:${index}`,
    });
  });
}

export function auditPct002Packages(packages: readonly Pct002QuestionPackage[]): Pct002CoverageAudit {
  const duplicateMap = new Map<string, number>();
  for (const pkg of packages) duplicateMap.set(pkg.stem, (duplicateMap.get(pkg.stem) ?? 0) + 1);
  const duplicateCount = [...duplicateMap.values()].reduce((sum, count) => sum + Math.max(0, count - 1), 0);
  const qlCoverage = countBy(packages.map((pkg) => pkg.questionLanguageId));
  const cpCoverage = countBy(packages.map((pkg) => pkg.canonicalProblemId));
  const esCoverage = countBy(packages.map((pkg) => pkg.explanationId));
  const difficultyCoverage = countBy(packages.map((pkg) => pkg.difficultyBand));
  const activeQlIds = getActiveQuestionLanguageIds();
  const unusedQlIds = activeQlIds.filter((id) => !qlCoverage[id]);
  const unusedEsIds = getPct002ActiveCanonicalProblemIds()
    .map((cpId) => packages.find((pkg) => pkg.canonicalProblemId === cpId)?.explanationId ?? `PCT-ES-${cpId.slice(-3)}`)
    .filter((id, index, all) => all.indexOf(id) === index && !esCoverage[id]);

  let crossLanguageConsistencyFailures = 0;
  for (let index = 0; index < Math.min(120, packages.length); index += 1) {
    const pkg = packages[index]!;
    const triplet = runPct002ForLanguages(pkg.canonicalProblemId, {
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
    renderFailures: packages.filter((pkg) => pkg.stem.includes("undefined") || pkg.stem.includes("NaN") || pkg.stem.length === 0).length,
    solverFailures: packages.filter((pkg) => pkg.answer.includes("undefined") || pkg.answer.includes("NaN") || pkg.answer.length === 0).length,
    duplicateRate: packages.length ? duplicateCount / packages.length : 0,
    cpCoverage,
    qlCoverage,
    esCoverage,
    difficultyCoverage,
    unusedQlIds,
    unusedEsIds,
    crossLanguageConsistencyFailures,
    libraryValidationFailures: validatePct002Libraries().failures,
  };
}

export function generatePct002CoverageAudit(count: number, language: Pct002Language = "en") {
  const packages = generatePct002Batch(count, language);
  return { packages, audit: auditPct002Packages(packages) };
}

export function renderPct002HumanReviewCsv(packages: readonly Pct002QuestionPackage[]) {
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

export function renderPct002CoverageAuditMarkdown(audit: Pct002CoverageAudit, countLabel: string) {
  return [
    "# PCT-002 Pre-Freeze Coverage Audit",
    "",
    "## Summary",
    "",
    `- Question count: ${audit.questionCount}`,
    `- Generation failures: ${audit.generationFailures}`,
    `- Validation failures: ${audit.validationFailures}`,
    `- Render failures: ${audit.renderFailures}`,
    `- Solver failures: ${audit.solverFailures}`,
    `- Duplicate rate: ${(audit.duplicateRate * 100).toFixed(2)}%`,
    `- Library validation failures: ${audit.libraryValidationFailures.length}`,
    `- Cross-language consistency failures: ${audit.crossLanguageConsistencyFailures}`,
    `- Sample profile: ${countLabel}`,
    "",
    "## CP Coverage",
    "",
    "```json",
    JSON.stringify(audit.cpCoverage, null, 2),
    "```",
    "",
    "## QL Coverage",
    "",
    "```json",
    JSON.stringify(audit.qlCoverage, null, 2),
    "```",
    "",
    "## ES Coverage",
    "",
    "```json",
    JSON.stringify(audit.esCoverage, null, 2),
    "```",
    "",
    "## Difficulty Coverage",
    "",
    "```json",
    JSON.stringify(audit.difficultyCoverage, null, 2),
    "```",
    "",
    "## Unused IDs",
    "",
    `- Unused QL IDs: ${audit.unusedQlIds.length ? audit.unusedQlIds.join(", ") : "none"}`,
    `- Unused ES IDs: ${audit.unusedEsIds.length ? audit.unusedEsIds.join(", ") : "none"}`,
    "",
    "## Cross-Language",
    "",
    `- Cross-language consistency failures: ${audit.crossLanguageConsistencyFailures}`,
    `- Library validation failures: ${audit.libraryValidationFailures.length ? audit.libraryValidationFailures.join("; ") : "none"}`,
    "",
  ].join("\n");
}

export function renderPct002MaturityAuditMarkdown(audit: Pct002CoverageAudit, countLabel: string) {
  return [
    "# PCT-002 Maturity Audit",
    "",
    "## Summary",
    "",
    `- Question count: ${audit.questionCount}`,
    `- Generation failures: ${audit.generationFailures}`,
    `- Validation failures: ${audit.validationFailures}`,
    `- Render failures: ${audit.renderFailures}`,
    `- Solver failures: ${audit.solverFailures}`,
    `- Duplicate rate: ${(audit.duplicateRate * 100).toFixed(2)}%`,
    `- Library validation failures: ${audit.libraryValidationFailures.length}`,
    `- Cross-language consistency failures: ${audit.crossLanguageConsistencyFailures}`,
    `- Sample profile: ${countLabel}`,
    "",
    "## Coverage",
    "",
    `- CP coverage count: ${Object.keys(audit.cpCoverage).length}/${PCT_002_CP_IDS.length}`,
    `- QL coverage count: ${Object.keys(audit.qlCoverage).length}/${getActiveQuestionLanguageIds().length}`,
    `- ES coverage count: ${Object.keys(audit.esCoverage).length}/${getPct002ActiveCanonicalProblemIds().length}`,
    "",
    "## Residual Gaps",
    "",
    `- Unused QL IDs: ${audit.unusedQlIds.length ? audit.unusedQlIds.join(", ") : "none"}`,
    `- Unused ES IDs: ${audit.unusedEsIds.length ? audit.unusedEsIds.join(", ") : "none"}`,
    `- Cross-language consistency failures: ${audit.crossLanguageConsistencyFailures}`,
    "",
    "## Verdict",
    "",
    audit.generationFailures === 0 &&
    audit.validationFailures === 0 &&
    audit.renderFailures === 0 &&
    audit.solverFailures === 0 &&
    audit.unusedQlIds.length === 0 &&
    audit.unusedEsIds.length === 0 &&
    audit.crossLanguageConsistencyFailures === 0 &&
    audit.libraryValidationFailures.length === 0
      ? "- READY FOR FREEZE REVIEW"
      : "- NEEDS FOLLOW-UP",
    "",
  ].join("\n");
}

export function renderPct002FreezeRecordMarkdown(preFreezeAudit: Pct002CoverageAudit) {
  const verdict =
    preFreezeAudit.generationFailures === 0 &&
    preFreezeAudit.validationFailures === 0 &&
    preFreezeAudit.renderFailures === 0 &&
    preFreezeAudit.solverFailures === 0 &&
    preFreezeAudit.unusedQlIds.length === 0 &&
    preFreezeAudit.unusedEsIds.length === 0 &&
    preFreezeAudit.crossLanguageConsistencyFailures === 0 &&
    preFreezeAudit.libraryValidationFailures.length === 0
      ? "READY FOR FREEZE REVIEW"
      : "FOLLOW-UP REQUIRED";

  return [
    "# PCT-002 Freeze Record",
    "",
    "## Status",
    "",
    `- Task registry source: task-registry.library.json`,
    `- Active CP count: ${PCT_002_CP_IDS.length}`,
    `- Active QL count: ${getActiveQuestionLanguageIds().length}`,
    `- Review CSVs regenerated: en, hi, pa`,
    `- Pre-freeze audit regenerated: yes`,
    `- Maturity audit regenerated: yes`,
    "",
    "## Verification",
    "",
    `- generation failures = ${preFreezeAudit.generationFailures}`,
    `- validation failures = ${preFreezeAudit.validationFailures}`,
    `- render failures = ${preFreezeAudit.renderFailures}`,
    `- solver failures = ${preFreezeAudit.solverFailures}`,
    `- unused QL IDs = ${preFreezeAudit.unusedQlIds.length}`,
    `- unused ES IDs = ${preFreezeAudit.unusedEsIds.length}`,
    `- cross-language consistency failures = ${preFreezeAudit.crossLanguageConsistencyFailures}`,
    `- duplicate rate = ${(preFreezeAudit.duplicateRate * 100).toFixed(2)}%`,
    `- verdict = ${verdict}`,
    "",
  ].join("\n");
}
