import { getCoverageCategoriesForCp } from "./coverage-selector";
import { getSimpl001ActiveCanonicalProblemIds } from "./parameter-generator";
import { generateSimpl001Batch } from "./pipeline";
import { selectExplanationByCp } from "./explanation-selector";
import { selectStemsByCp } from "./stem-selector";
import type { Simpl001QuestionPackage } from "./pipeline";
import type { SimplCpId } from "./types";

export interface Simpl001AuditReport {
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

export function auditSimpl001Batch(
  cpId: SimplCpId,
  rows: Simpl001QuestionPackage[],
): Simpl001AuditReport {
  const expectedQlIds = selectStemsByCp(cpId).map((item) => item.id);
  const usedQlIds = new Set(rows.map((row) => row.questionLanguageId));
  const expectedEsId = selectExplanationByCp(cpId).id;
  const usedEsIds = new Set(rows.map((row) => row.explanationId));
  const coverage = new Set(rows.map((row) => row.parameters.coverageCategory));
  return {
    questionCount: rows.length,
    generationFailures: rows.filter((row) => !row.answer).length,
    validationFailures: rows.filter((row) => !row.validation.valid).length,
    traceabilityFailures: rows.filter(
      (row) =>
        row.explanationId !== expectedEsId ||
        !expectedQlIds.includes(row.questionLanguageId),
    ).length,
    mathJaxFailures: rows.filter((row) => !hasBalancedMath(row.answerLatex)).length,
    unusedQuestionLanguageIds: expectedQlIds.filter((id) => !usedQlIds.has(id)),
    unusedExplanationIds: usedEsIds.has(expectedEsId) ? [] : [expectedEsId],
    coverageCategoriesExercised: getCoverageCategoriesForCp(cpId).filter((category) =>
      coverage.has(category),
    ),
    difficultyDistribution: rows.reduce<Record<string, number>>((acc, row) => {
      acc[row.difficulty] = (acc[row.difficulty] ?? 0) + 1;
      return acc;
    }, {}),
  };
}

export function generateSimpl001CoverageAudit(input: {
  canonicalProblemId: SimplCpId;
  count: number;
  seed?: string;
}): Simpl001AuditReport {
  return auditSimpl001Batch(
    input.canonicalProblemId,
    generateSimpl001Batch(
      input.canonicalProblemId,
      input.count,
      input.seed ?? "simpl-001-coverage",
    ),
  );
}

export function generateSimpl001FullCoverageAudit(input: {
  countPerCp: number;
  seed?: string;
}): Record<SimplCpId, Simpl001AuditReport> {
  const seed = input.seed ?? "simpl-001-full";
  return Object.fromEntries(
    getSimpl001ActiveCanonicalProblemIds().map((cpId) => [
      cpId,
      generateSimpl001CoverageAudit({
        canonicalProblemId: cpId,
        count: input.countPerCp,
        seed,
      }),
    ]),
  ) as Record<SimplCpId, Simpl001AuditReport>;
}

function hasBalancedMath(value: string): boolean {
  return (value.match(/\\\(/g)?.length ?? 0) === (value.match(/\\\)/g)?.length ?? 0);
}
