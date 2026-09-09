import type { KnowledgeV1Difficulty } from "../../types";
import { generateGeoRiv001Cp001Review } from "./geo-riv-001-cp001-review-generator";
import type { GeoRiv001Cp001ReviewQuestion } from "./geo-riv-001-cp001-review-types";

const REVIEW_COUNTS: Record<string, number> = {
  "GEO-RIV-001-QL-001": 9,
  "GEO-RIV-001-QL-002": 9,
  "GEO-RIV-001-QL-003": 5,
  "GEO-RIV-001-QL-004": 5,
  "GEO-RIV-001-QL-005": 5,
  "GEO-RIV-001-QL-006": 5,
  "GEO-RIV-001-QL-007": 5,
  "GEO-RIV-001-QL-008": 5,
  "GEO-RIV-001-QL-009": 6,
};

export const GEO_RIV_001_CP001_REVIEW_BATCH_V1: GeoRiv001Cp001ReviewQuestion[] =
  Object.entries(REVIEW_COUNTS).flatMap(([qlId, count]) =>
    Array.from({ length: count }, (_, index) =>
      generateGeoRiv001Cp001Review(
        qlId,
        `geo-riv-001-cp001-review-v1-${qlId}-${String(index + 1).padStart(2, "0")}`,
      ),
    ),
  );

export function auditGeoRiv001Cp001ReviewBatch(
  questions: readonly GeoRiv001Cp001ReviewQuestion[] =
    GEO_RIV_001_CP001_REVIEW_BATCH_V1,
) {
  const issues: string[] = [];
  const questionIds = new Set<string>();
  const qlCounts = new Map<string, number>();
  const difficultyCounts = new Map<KnowledgeV1Difficulty, number>();
  const correctPositions = new Map<string, Set<number>>();

  for (const question of questions) {
    if (questionIds.has(question.questionId)) {
      issues.push(`DUPLICATE_QUESTION_ID:${question.questionId}`);
    }
    questionIds.add(question.questionId);

    if (question.options.length !== 4) {
      issues.push(`OPTION_COUNT:${question.questionId}:${question.options.length}`);
    }
    if (new Set(question.options).size !== question.options.length) {
      issues.push(`DUPLICATE_OPTIONS:${question.questionId}`);
    }
    if (question.options[question.correctIndex] !== question.canonicalAnswer) {
      issues.push(`ANSWER_MISMATCH:${question.questionId}`);
    }
    if (!question.sourceIds.length || !question.sourceFactIds.length) {
      issues.push(`MISSING_PROVENANCE:${question.questionId}`);
    }
    if (!question.explanation.trim()) {
      issues.push(`EMPTY_EXPLANATION:${question.questionId}`);
    }

    qlCounts.set(question.qlId, (qlCounts.get(question.qlId) ?? 0) + 1);
    difficultyCounts.set(
      question.difficulty,
      (difficultyCounts.get(question.difficulty) ?? 0) + 1,
    );
    const positions = correctPositions.get(question.qlId) ?? new Set<number>();
    positions.add(question.correctIndex);
    correctPositions.set(question.qlId, positions);
  }

  for (const [qlId, expected] of Object.entries(REVIEW_COUNTS)) {
    if (qlCounts.get(qlId) !== expected) {
      issues.push(`QL_COUNT:${qlId}:${qlCounts.get(qlId) ?? 0}:expected-${expected}`);
    }
    if ((correctPositions.get(qlId)?.size ?? 0) < 2) {
      issues.push(`ANSWER_POSITION_NOT_DIVERSE:${qlId}`);
    }
  }

  const expectedDifficultyCounts: Record<KnowledgeV1Difficulty, number> = {
    Easy: 18,
    Medium: 25,
    Hard: 11,
  };
  for (const [difficulty, expected] of Object.entries(
    expectedDifficultyCounts,
  ) as [KnowledgeV1Difficulty, number][]) {
    if ((difficultyCounts.get(difficulty) ?? 0) !== expected) {
      issues.push(
        `DIFFICULTY_COUNT:${difficulty}:${difficultyCounts.get(difficulty) ?? 0}:expected-${expected}`,
      );
    }
  }

  return {
    valid: issues.length === 0,
    questionCount: questions.length,
    qlCounts: Object.fromEntries(qlCounts),
    difficultyCounts: Object.fromEntries(difficultyCounts),
    issues,
  };
}
