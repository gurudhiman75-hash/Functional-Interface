import { getCommonQuestionLanguageIds, validatePct006Libraries } from "./library";
import { getPct006ActiveCanonicalProblemIds } from "./parameter-generator";
import { runPct006ForLanguages, runPct006Pipeline } from "./pipeline";
import type { Pct006CoverageAudit, Pct006Language, Pct006QuestionPackage } from "./types";

function countBy(values: readonly string[]) {
  return values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});
}

function flatQlOrder() {
  return getPct006ActiveCanonicalProblemIds().flatMap((cpId) =>
    getCommonQuestionLanguageIds(cpId).map((qlId) => ({ cpId, qlId })),
  );
}

export function generatePct006Batch(count: number, language: Pct006Language = "en") {
  const order = flatQlOrder();
  return Array.from({ length: count }, (_value, index) => {
    const item = order[index % order.length]!;
    return runPct006Pipeline(item.cpId, {
      language,
      questionLanguageId: item.qlId,
      seed: `PCT-006:${language}:${index}`,
    });
  });
}

export function auditPct006Packages(packages: readonly Pct006QuestionPackage[]): Pct006CoverageAudit {
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
    const triplet = runPct006ForLanguages(pkg.canonicalProblemId, {
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
    unusedEsIds: getPct006ActiveCanonicalProblemIds()
      .map((_cpId, index) => `PCT-ES-${String(index + 1).padStart(3, "0")}`)
      .filter((id) => !esCoverage[id]),
    crossLanguageConsistencyFailures,
    libraryValidationFailures: validatePct006Libraries().failures,
  };
}
