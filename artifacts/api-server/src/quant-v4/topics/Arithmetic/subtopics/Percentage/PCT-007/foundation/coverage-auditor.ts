import { getCommonQuestionLanguageIds, validatePct007Libraries } from "./library";
import { getPct007ActiveCanonicalProblemIds } from "./parameter-generator";
import { runPct007ForLanguages, runPct007Pipeline } from "./pipeline";
import type { Pct007CoverageAudit, Pct007Language, Pct007QuestionPackage } from "./types";

function countBy(values: readonly string[]) {
  return values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});
}

function flatQlOrder() {
  return getPct007ActiveCanonicalProblemIds().flatMap((cpId) =>
    getCommonQuestionLanguageIds(cpId).map((qlId) => ({ cpId, qlId })),
  );
}

export function generatePct007Batch(count: number, language: Pct007Language = "en") {
  const order = flatQlOrder();
  return Array.from({ length: count }, (_value, index) => {
    const item = order[index % order.length]!;
    return runPct007Pipeline(item.cpId, {
      language,
      questionLanguageId: item.qlId,
      seed: `PCT-007:${language}:${index}`,
    });
  });
}

export function auditPct007Packages(packages: readonly Pct007QuestionPackage[]): Pct007CoverageAudit {
  const duplicateMap = new Map<string, number>();
  for (const pkg of packages) duplicateMap.set(pkg.stem, (duplicateMap.get(pkg.stem) ?? 0) + 1);
  const duplicateCount = [...duplicateMap.values()].reduce((sum, count) => sum + Math.max(0, count - 1), 0);
  const qlCoverage = countBy(packages.map((pkg) => pkg.questionLanguageId));
  const cpCoverage = countBy(packages.map((pkg) => pkg.canonicalProblemId));
  const esCoverage = countBy(packages.map((pkg) => pkg.explanationId));
  const difficultyCoverage = countBy(packages.map((pkg) => pkg.difficultyBand));
  const unusedQlIds = flatQlOrder().map((item) => item.qlId).filter((id) => !qlCoverage[id]);

  let crossLanguageConsistencyFailures = 0;
  for (let index = 0; index < Math.min(60, packages.length); index += 1) {
    const pkg = packages[index]!;
    const triplet = runPct007ForLanguages(pkg.canonicalProblemId, {
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
    unusedEsIds: getPct007ActiveCanonicalProblemIds()
      .map((_cpId, index) => `PCT-ES-${String(index + 1).padStart(3, "0")}`)
      .filter((id) => !esCoverage[id]),
    crossLanguageConsistencyFailures,
    libraryValidationFailures: validatePct007Libraries().failures,
  };
}
