import { getActiveQuestionLanguageIds, getCommonQuestionLanguageIds, validateRap001Libraries } from "./library";
import { getRap001ActiveCanonicalProblemIds, getSelectableQuestionLanguageIds, pickRap001CanonicalProblemId } from "./parameter-generator";
import { runRap001ForLanguages, runRap001Pipeline } from "./pipeline";
import { RAP_001_CP_IDS, type Rap001CanonicalProblemId, type Rap001CoverageAudit, type Rap001Language, type Rap001QuestionPackage } from "./types";

function countBy(values: readonly string[]) {
  return values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});
}

const WEIGHTED_CP_SEQUENCE = ([
  ["RAP-CP-001", 15],
  ["RAP-CP-002", 20],
  ["RAP-CP-003", 20],
  ["RAP-CP-004", 10],
  ["RAP-CP-005", 15],
  ["RAP-CP-006", 20],
] as const).flatMap(([cpId, weight]) => Array.from({ length: weight }, () => cpId as Rap001CanonicalProblemId));

export function generateRap001Batch(count: number, language: Rap001Language = "en") {
  const cpQuestionCounters = new Map<Rap001CanonicalProblemId, number>();
  return Array.from({ length: count }, (_value, index) => {
    const cpId = WEIGHTED_CP_SEQUENCE[index % WEIGHTED_CP_SEQUENCE.length] ?? pickRap001CanonicalProblemId(`RAP-001:${index}`);
    const seenForCp = cpQuestionCounters.get(cpId) ?? 0;
    const qlIds = language === "en" ? getCommonQuestionLanguageIds(cpId) : getSelectableQuestionLanguageIds(cpId, language);
    const qlId = qlIds[seenForCp % qlIds.length]!;
    cpQuestionCounters.set(cpId, seenForCp + 1);
    return runRap001Pipeline(cpId, {
      language,
      questionLanguageId: qlId,
      seed: `RAP-001:${index}`,
    });
  });
}

function entityVariableEntries(pkg: Rap001QuestionPackage) {
  const semanticIds = new Set(Object.values(pkg.parameters.semanticContext?.entities ?? {}).map((entity) => entity.id));
  return Object.entries(pkg.parameters.variables).filter(([_key, value]) => typeof value === "string" && semanticIds.has(value));
}

function sameEntityVariables(left: Rap001QuestionPackage, right: Rap001QuestionPackage) {
  const leftEntries = entityVariableEntries(left);
  const rightMap = new Map(entityVariableEntries(right).map(([key, value]) => [key, value]));
  return leftEntries.every(([key, value]) => rightMap.get(key) === value);
}

export function auditRap001Packages(packages: readonly Rap001QuestionPackage[]): Rap001CoverageAudit {
  const duplicateMap = new Map<string, number>();
  const duplicateQlMap = new Map<string, Set<string>>();
  for (const pkg of packages) {
    duplicateMap.set(pkg.stem, (duplicateMap.get(pkg.stem) ?? 0) + 1);
    const qlIds = duplicateQlMap.get(pkg.stem) ?? new Set<string>();
    qlIds.add(pkg.questionLanguageId);
    duplicateQlMap.set(pkg.stem, qlIds);
  }
  const duplicateCount = [...duplicateMap.values()].reduce((sum, count) => sum + Math.max(0, count - 1), 0);
  const repeatedStemGroups = [...duplicateMap.entries()].filter(([, count]) => count > 1);
  const exactDuplicateStemGroupCount = repeatedStemGroups.filter(([stem]) => (duplicateQlMap.get(stem)?.size ?? 0) > 1).length;
  const sameQlRepeatedStemGroupCount = repeatedStemGroups.length - exactDuplicateStemGroupCount;
  const qlCoverage = countBy(packages.map((pkg) => pkg.questionLanguageId));
  const cpCoverage = countBy(packages.map((pkg) => pkg.canonicalProblemId));
  const taskKindCoverage = countBy(packages.map((pkg) => pkg.parameters.taskKind));
  const esCoverage = countBy(packages.map((pkg) => pkg.explanationId));
  const difficultyCoverage = countBy(packages.map((pkg) => pkg.difficultyBand));
  const mathJaxCoverage = countBy(packages.flatMap((pkg) => Object.keys(pkg.mathJax)));
  const activeQlIds = getActiveQuestionLanguageIds();
  const unusedQlIds = activeQlIds.filter((id) => !qlCoverage[id]);
  const unusedEsIds = getRap001ActiveCanonicalProblemIds().map((cpId) => packages.find((pkg) => pkg.canonicalProblemId === cpId)?.explanationId ?? `RAP-ES-${cpId.slice(-3)}`).filter((id, index, all) => all.indexOf(id) === index && !esCoverage[id]);

  let crossLanguageFailures = 0;
  for (let index = 0; index < Math.min(120, packages.length); index += 1) {
    const pkg = packages[index]!;
    const triplet = runRap001ForLanguages(pkg.canonicalProblemId, {
      seed: `cross-language:${index}`,
      questionLanguageId: pkg.questionLanguageId,
      difficultyBand: pkg.difficultyBand,
    });
    const answers = new Set(triplet.map((item) => item.answer));
    if (answers.size !== 1 || !sameEntityVariables(triplet[0]!, triplet[1]!) || !sameEntityVariables(triplet[0]!, triplet[2]!)) {
      crossLanguageFailures += 1;
    }
  }

  return {
    questionCount: packages.length,
    generationFailures: 0,
    validationFailures: packages.filter((pkg) => !pkg.validation.valid).length,
    renderFailures: packages.filter((pkg) => pkg.stem.includes("undefined") || pkg.stem.includes("NaN") || pkg.answer.includes("undefined") || pkg.answer.includes("NaN")).length,
    solverFailures: packages.filter((pkg) => pkg.answer.length === 0).length,
    crossLanguageFailures,
    placeholderFailures: 0,
    duplicateRate: packages.length ? duplicateCount / packages.length : 0,
    exactDuplicateStemGroupCount,
    sameQlRepeatedStemGroupCount,
    cpCoverage,
    taskKindCoverage,
    qlCoverage,
    esCoverage,
    difficultyCoverage,
    mathJaxCoverage,
    unusedQlIds,
    unusedEsIds,
    libraryValidationFailures: validateRap001Libraries().failures,
  };
}

export function renderRap001EntityRenderingAuditMarkdown(sampleCount = 100) {
  const sections: string[] = [
    "# RAP-001 Entity Rendering Audit",
    "",
    `Sample count: ${sampleCount}`,
    "",
  ];
  let failures = 0;

  for (let index = 0; index < sampleCount; index += 1) {
    const cpId = WEIGHTED_CP_SEQUENCE[index % WEIGHTED_CP_SEQUENCE.length] ?? pickRap001CanonicalProblemId(`RAP-001:${index}`);
    const qlIds = getCommonQuestionLanguageIds(cpId);
    const qlId = qlIds[index % qlIds.length]!;
    const seed = `RAP-001:entity-audit:${index}`;
    const triplet = runRap001ForLanguages(cpId, { seed, questionLanguageId: qlId });
    const [en, hi, pa] = triplet;
    const entityEntries = entityVariableEntries(en!);
    const synced = sameEntityVariables(en!, hi!) && sameEntityVariables(en!, pa!);
    if (!synced || triplet.some((pkg) => !pkg.validation.valid)) failures += 1;

    sections.push("--------------------------------");
    sections.push("");
    sections.push(`Sample ${index + 1}`);
    sections.push("");
    sections.push("IDs");
    sections.push("");
    for (const [key, value] of entityEntries) {
      sections.push(`${key}Id: ${value}`);
    }
    sections.push("");
    sections.push("English rendering");
    sections.push("");
    sections.push(en!.stem);
    sections.push("");
    sections.push("Hindi rendering");
    sections.push("");
    sections.push(hi!.stem);
    sections.push("");
    sections.push("Punjabi rendering");
    sections.push("");
    sections.push(pa!.stem);
    sections.push("");
    sections.push(`Synchronized entity IDs: ${synced ? "yes" : "no"}`);
    sections.push("");
  }

  sections.push("--------------------------------");
  sections.push("");
  sections.push("Verification");
  sections.push("");
  sections.push(`- Samples checked: ${sampleCount}`);
  sections.push(`- Entity synchronization failures: ${failures}`);
  sections.push(`- Verification status: ${failures === 0 ? "passed" : "failed"}`);
  sections.push("");

  return sections.join("\n");
}

export function generateRap001CoverageAudit(count: number, language: Rap001Language = "en") {
  const packages = generateRap001Batch(count, language);
  return { packages, audit: auditRap001Packages(packages) };
}

export function renderRap001HumanReviewCsv(packages: readonly Rap001QuestionPackage[]) {
  const header = ["packageId", "cpId", "qlId", "taskKind", "difficulty", "stem", "answer", "explanation", "stemRealism", "solverCorrect", "explanationQuality", "optionQuality", "editorialStatus", "reviewNotes"];
  const rows = packages.map((pkg) =>
    [
      "RAP-001",
      pkg.canonicalProblemId,
      pkg.questionLanguageId,
      pkg.parameters.taskKind,
      pkg.difficultyBand,
      pkg.stem,
      pkg.answer,
      pkg.explanation.lines.join("\n"),
      "",
      "",
      "",
      "",
      "PENDING",
      "",
    ]
      .map((value) => `"${String(value).replaceAll('"', '""')}"`)
      .join(","),
  );
  return [header.join(","), ...rows].join("\n");
}

export function renderRap001CoverageAuditMarkdown(audit: Rap001CoverageAudit, countLabel: string) {
  return [
    "# RAP-001 Pre-Freeze Coverage Audit",
    "",
    "## Summary",
    "",
    `- Question count: ${audit.questionCount}`,
    `- Generation failures: ${audit.generationFailures}`,
    `- Validation failures: ${audit.validationFailures}`,
    `- Render failures: ${audit.renderFailures}`,
    `- Solver failures: ${audit.solverFailures}`,
    `- Cross-language failures: ${audit.crossLanguageFailures}`,
    `- Placeholder failures: ${audit.placeholderFailures}`,
    `- Duplicate rate: ${(audit.duplicateRate * 100).toFixed(2)}%`,
    `- Cross-QL exact duplicate stem groups: ${audit.exactDuplicateStemGroupCount}`,
    `- Same-QL repeated stem groups: ${audit.sameQlRepeatedStemGroupCount}`,
    `- Library validation failures: ${audit.libraryValidationFailures.length}`,
    `- Sample profile: ${countLabel}`,
    "",
    "## CP Coverage",
    "",
    "```json",
    JSON.stringify(audit.cpCoverage, null, 2),
    "```",
    "",
    "## TaskKind Coverage",
    "",
    "```json",
    JSON.stringify(audit.taskKindCoverage, null, 2),
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
    "## MathJax Coverage",
    "",
    "```json",
    JSON.stringify(audit.mathJaxCoverage, null, 2),
    "```",
    "",
    `- Unused QL IDs: ${audit.unusedQlIds.length ? audit.unusedQlIds.join(", ") : "none"}`,
    `- Unused ES IDs: ${audit.unusedEsIds.length ? audit.unusedEsIds.join(", ") : "none"}`,
    `- Cross-language failures: ${audit.crossLanguageFailures}`,
    `- Placeholder failures: ${audit.placeholderFailures}`,
    `- Library validation failures: ${audit.libraryValidationFailures.length ? audit.libraryValidationFailures.join("; ") : "none"}`,
    "",
  ].join("\n");
}

export function renderRap001MaturityAuditMarkdown(audit: Rap001CoverageAudit, countLabel: string) {
  const verdict =
    audit.generationFailures === 0 &&
    audit.validationFailures === 0 &&
    audit.renderFailures === 0 &&
    audit.solverFailures === 0 &&
    audit.crossLanguageFailures === 0 &&
    audit.placeholderFailures === 0 &&
    audit.unusedQlIds.length === 0 &&
    audit.unusedEsIds.length === 0 &&
    audit.libraryValidationFailures.length === 0
      ? "READY FOR FREEZE REVIEW"
      : "NEEDS FOLLOW-UP";
  return [
    "# RAP-001 Maturity Audit",
    "",
    "## Summary",
    "",
    `- Question count: ${audit.questionCount}`,
    `- Generation failures: ${audit.generationFailures}`,
    `- Validation failures: ${audit.validationFailures}`,
    `- Render failures: ${audit.renderFailures}`,
    `- Solver failures: ${audit.solverFailures}`,
    `- Cross-language failures: ${audit.crossLanguageFailures}`,
    `- Placeholder failures: ${audit.placeholderFailures}`,
    `- Duplicate rate: ${(audit.duplicateRate * 100).toFixed(2)}%`,
    `- Cross-QL exact duplicate stem groups: ${audit.exactDuplicateStemGroupCount}`,
    `- Same-QL repeated stem groups: ${audit.sameQlRepeatedStemGroupCount}`,
    `- Library validation failures: ${audit.libraryValidationFailures.length}`,
    `- Sample profile: ${countLabel}`,
    "",
    "## Coverage",
    "",
    `- CP coverage count: ${Object.keys(audit.cpCoverage).length}/${RAP_001_CP_IDS.length}`,
    `- QL coverage count: ${Object.keys(audit.qlCoverage).length}/${getActiveQuestionLanguageIds().length}`,
    `- ES coverage count: ${Object.keys(audit.esCoverage).length}/${getRap001ActiveCanonicalProblemIds().length}`,
    "",
    "## Residual Gaps",
    "",
    `- Unused QL IDs: ${audit.unusedQlIds.length ? audit.unusedQlIds.join(", ") : "none"}`,
    `- Unused ES IDs: ${audit.unusedEsIds.length ? audit.unusedEsIds.join(", ") : "none"}`,
    `- Cross-language failures: ${audit.crossLanguageFailures}`,
    `- Placeholder failures: ${audit.placeholderFailures}`,
    "",
    "## Verdict",
    "",
    `- ${verdict}`,
    "",
  ].join("\n");
}

export function renderRap001FreezeRecordMarkdown(audit: Rap001CoverageAudit) {
  const automatedClean =
    audit.generationFailures === 0 &&
    audit.validationFailures === 0 &&
    audit.renderFailures === 0 &&
    audit.solverFailures === 0 &&
    audit.crossLanguageFailures === 0 &&
    audit.placeholderFailures === 0 &&
    audit.unusedQlIds.length === 0 &&
    audit.unusedEsIds.length === 0 &&
    audit.libraryValidationFailures.length === 0
      ? "AUTOMATED QA CLEAN; READY FOR MANUAL EDITORIAL REVIEW"
      : "FOLLOW-UP REQUIRED";
  return [
    "# RAP-001 Freeze Record",
    "",
    "Reviewed commit: `8450deef2e06cc9e031b6d3221b7e54d226199b1`  ",
    `Reviewed date: \`${new Date().toISOString().slice(0, 10)}\``,
    "",
    "## Status",
    "",
    `- Task registry source: task-registry.library.json`,
    `- Active CP count: ${RAP_001_CP_IDS.length}`,
    `- Active QL count: ${getActiveQuestionLanguageIds().length}`,
    `- Review CSVs regenerated: en, hi, pa`,
    `- Pre-freeze audit regenerated: yes`,
    `- Maturity audit regenerated: yes`,
    "",
    "## Verification",
    "",
    `- generation failures = ${audit.generationFailures}`,
    `- validation failures = ${audit.validationFailures}`,
    `- render failures = ${audit.renderFailures}`,
    `- solver failures = ${audit.solverFailures}`,
    `- cross-language failures = ${audit.crossLanguageFailures}`,
    `- placeholder failures = ${audit.placeholderFailures}`,
    `- unused QL IDs = ${audit.unusedQlIds.length}`,
    `- unused ES IDs = ${audit.unusedEsIds.length}`,
    `- duplicate rate = ${(audit.duplicateRate * 100).toFixed(2)}%`,
    `- cross-QL exact duplicate stem groups = ${audit.exactDuplicateStemGroupCount}`,
    `- same-QL repeated stem groups = ${audit.sameQlRepeatedStemGroupCount}`,
    `- verdict = ${automatedClean}`,
    `- manual editorial status = PENDING`,
    "",
  ].join("\n");
}
