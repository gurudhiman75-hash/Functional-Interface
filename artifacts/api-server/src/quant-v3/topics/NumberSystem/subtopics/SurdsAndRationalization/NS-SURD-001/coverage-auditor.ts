import { getCoverageCategoriesForCp } from "./coverage-selector";
import { getNsSurd001ActiveCanonicalProblemIds } from "./parameter-generator";
import { generateNsSurd001Batch } from "./pipeline";
import { selectExplanationByCp } from "./explanation-selector";
import { selectStemsByCp } from "./stem-selector";
import type { NsSurd001QuestionPackage } from "./pipeline";
import type { SurdCpId } from "./types";

export interface NsSurd001AuditReport {
  questionCount: number;
  generationFailures: number;
  validationFailures: number;
  traceabilityFailures: number;
  mathJaxFailures: number;
  unusedQuestionLanguageIds: string[];
  unusedExplanationIds: string[];
  coverageCategoriesExercised: string[];
  difficultyDistribution: Record<string, number>;
}

export function auditNsSurd001Batch(cpId: SurdCpId, rows: NsSurd001QuestionPackage[]): NsSurd001AuditReport {
  const expectedQlIds = selectStemsByCp(cpId).map((item) => item.id);
  const usedQlIds = new Set(rows.map((row) => row.questionLanguageId));
  const expectedEsId = selectExplanationByCp(cpId).id;
  const usedEsIds = new Set(rows.map((row) => row.explanationId));
  const coverage = new Set(rows.map((row) => row.parameters.coverageCategory));
  return {
    questionCount: rows.length,
    generationFailures: rows.filter((row) => !row.answer).length,
    validationFailures: rows.filter((row) => !row.validation.valid).length,
    traceabilityFailures: rows.filter((row) => row.explanationId !== expectedEsId || !expectedQlIds.includes(row.questionLanguageId)).length,
    mathJaxFailures: rows.filter((row) => !hasBalancedMath(row.answerLatex)).length,
    unusedQuestionLanguageIds: expectedQlIds.filter((id) => !usedQlIds.has(id)),
    unusedExplanationIds: usedEsIds.has(expectedEsId) ? [] : [expectedEsId],
    coverageCategoriesExercised: getCoverageCategoriesForCp(cpId).filter((category) => coverage.has(category)),
    difficultyDistribution: rows.reduce<Record<string, number>>((acc, row) => {
      acc[row.difficulty] = (acc[row.difficulty] ?? 0) + 1;
      return acc;
    }, {}),
  };
}

export function generateNsSurd001CoverageAudit(input: { canonicalProblemId: SurdCpId; count: number; seed?: string }) {
  return auditNsSurd001Batch(input.canonicalProblemId, generateNsSurd001Batch(input.canonicalProblemId, input.count, input.seed ?? "ns-surd-001-coverage"));
}

export function generateNsSurd001FullCoverageAudit(input: { countPerCp: number; seed?: string }) {
  const seed = input.seed ?? "ns-surd-001-full";
  return Object.fromEntries(
    getNsSurd001ActiveCanonicalProblemIds().map((cpId) => [cpId, generateNsSurd001CoverageAudit({ canonicalProblemId: cpId, count: input.countPerCp, seed })]),
  );
}

function hasBalancedMath(value: string): boolean {
  return (value.match(/\\\(/g)?.length ?? 0) === (value.match(/\\\)/g)?.length ?? 0);
}
