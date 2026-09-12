import type { KnowledgeV1Difficulty } from "../../types";
import { generateGeoRiv001Cp001ReviewV2B } from "./geo-riv-001-cp001-review-generator-v2b";
import type { GeoRiv001Cp001ReviewQuestion } from "./geo-riv-001-cp001-review-types";

const REVIEW_COUNTS_V2B: Record<string, number> = {
  "GEO-RIV-001-QL-001": 4,
  "GEO-RIV-001-QL-002": 4,
  "GEO-RIV-001-QL-003": 6,
  "GEO-RIV-001-QL-004": 6,
  "GEO-RIV-001-QL-005": 8,
  "GEO-RIV-001-QL-006": 7,
  "GEO-RIV-001-QL-007": 7,
  "GEO-RIV-001-QL-008": 6,
  "GEO-RIV-001-QL-009": 6,
};

export const GEO_RIV_001_CP001_REVIEW_BATCH_V2B: GeoRiv001Cp001ReviewQuestion[] =
  Object.entries(REVIEW_COUNTS_V2B).flatMap(([qlId, count]) =>
    Array.from({ length: count }, (_, index) =>
      generateGeoRiv001Cp001ReviewV2B(
        qlId,
        `geo-riv-001-cp001-review-v2b-${qlId}-${String(index + 1).padStart(2, "0")}`,
      ),
    ),
  );

export function auditGeoRiv001Cp001ReviewBatchV2B(
  questions: readonly GeoRiv001Cp001ReviewQuestion[] =
    GEO_RIV_001_CP001_REVIEW_BATCH_V2B,
) {
  const issues: string[] = [];
  const ids = new Set<string>();
  const qlCounts = new Map<string, number>();
  const difficultyCounts = new Map<KnowledgeV1Difficulty, number>();
  const answerPositions = new Map<string, Set<number>>();
  const stemCounts = new Map<string, number>();

  for (const question of questions) {
    if (ids.has(question.questionId)) issues.push(`DUPLICATE_ID:${question.questionId}`);
    ids.add(question.questionId);

    if (question.options.length !== 4) issues.push(`OPTION_COUNT:${question.questionId}`);
    if (new Set(question.options).size !== 4) issues.push(`DUPLICATE_OPTIONS:${question.questionId}`);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) {
      issues.push(`ANSWER_MISMATCH:${question.questionId}`);
    }
    if (!question.sourceIds.length || !question.sourceFactIds.length) {
      issues.push(`MISSING_PROVENANCE:${question.questionId}`);
    }
    if (!question.explanation.trim()) issues.push(`EMPTY_EXPLANATION:${question.questionId}`);
    if (/\ban delta\b/i.test(`${question.stem} ${question.options.join(" ")} ${question.explanation}`)) {
      issues.push(`ARTICLE_DEFECT:${question.questionId}`);
    }
    if (/other major river group/i.test(question.explanation)) {
      issues.push(`STALE_V1_EXPLANATION:${question.questionId}`);
    }

    qlCounts.set(question.qlId, (qlCounts.get(question.qlId) ?? 0) + 1);
    difficultyCounts.set(
      question.difficulty,
      (difficultyCounts.get(question.difficulty) ?? 0) + 1,
    );
    const positions = answerPositions.get(question.qlId) ?? new Set<number>();
    positions.add(question.correctIndex);
    answerPositions.set(question.qlId, positions);
    stemCounts.set(question.stem, (stemCounts.get(question.stem) ?? 0) + 1);
  }

  for (const [qlId, expected] of Object.entries(REVIEW_COUNTS_V2B)) {
    if ((qlCounts.get(qlId) ?? 0) !== expected) {
      issues.push(`QL_COUNT:${qlId}:${qlCounts.get(qlId) ?? 0}:expected-${expected}`);
    }
    if ((answerPositions.get(qlId)?.size ?? 0) < 2) {
      issues.push(`ANSWER_POSITION_NOT_DIVERSE:${qlId}`);
    }
  }

  const expectedDifficultyCounts: Record<KnowledgeV1Difficulty, number> = {
    Easy: 16,
    Medium: 32,
    Hard: 6,
  };
  for (const [difficulty, expected] of Object.entries(expectedDifficultyCounts) as [
    KnowledgeV1Difficulty,
    number,
  ][]) {
    if ((difficultyCounts.get(difficulty) ?? 0) !== expected) {
      issues.push(
        `DIFFICULTY_COUNT:${difficulty}:${difficultyCounts.get(difficulty) ?? 0}:expected-${expected}`,
      );
    }
  }

  const duplicatedStems = [...stemCounts.entries()].filter(([, count]) => count > 2);
  for (const [stem, count] of duplicatedStems) {
    issues.push(`EXCESSIVE_EXACT_STEM_REPEAT:${count}:${stem.slice(0, 80)}`);
  }

  return {
    valid: issues.length === 0,
    questionCount: questions.length,
    qlCounts: Object.fromEntries(qlCounts),
    difficultyCounts: Object.fromEntries(difficultyCounts),
    uniqueStemCount: stemCounts.size,
    issues,
  };
}
