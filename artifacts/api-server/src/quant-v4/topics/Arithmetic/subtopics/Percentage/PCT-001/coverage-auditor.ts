import { getCommonQuestionLanguageIds } from "./library";
import { getPct001ActiveCanonicalProblemIds } from "./parameter-generator";
import { runPct001Pipeline } from "./pipeline";
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
    const qlIds = getCommonQuestionLanguageIds(cpId);
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
  const unusedQlIds = getPct001ActiveCanonicalProblemIds().flatMap((cpId) => getCommonQuestionLanguageIds(cpId)).filter((id) => !qlCoverage[id]);
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
  };
}

export function generatePct001CoverageAudit(count: number, language: Pct001Language = "en") {
  const packages = generatePct001Batch(count, language);
  return { packages, audit: auditPct001Packages(packages) };
}
