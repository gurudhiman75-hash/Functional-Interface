import {
  BLIND_REVIEW_DIMENSIONS,
  type BlindReviewAssignment,
  type BlindReviewDimension,
  type BlindReviewEngine,
  type BlindReviewRecord,
} from "./review-contracts";
export interface BlindReviewEngineTrend {
  sampleCount: number;
  averageScore: number | null;
}
export interface BlindReviewDimensionTrend {
  dimension: BlindReviewDimension;
  v1: BlindReviewEngineTrend;
  v2: BlindReviewEngineTrend;
}
export interface BlindReviewAnalysis {
  reviewCount: number;
  dimensions: readonly BlindReviewDimensionTrend[];
  preferenceDistribution: { v1: number; v2: number; noPreference: number };
}
export function analyzeBlindReviews(
  records: readonly BlindReviewRecord[],
  assignments: readonly BlindReviewAssignment[],
): BlindReviewAnalysis {
  const byId = new Map(assignments.map((assignment) => [assignment.reviewId, assignment]));
  const totals = new Map(BLIND_REVIEW_DIMENSIONS.map((dimension) => [
    dimension,
    { v1: { count: 0, total: 0 }, v2: { count: 0, total: 0 } },
  ]));
  const preferences = { v1: 0, v2: 0, noPreference: 0 };
  const engine = (assignment: BlindReviewAssignment, label: "A" | "B"): BlindReviewEngine =>
    assignment.candidates.find((candidate) => candidate.label === label)!.engine;
  for (const record of records) {
    const assignment = byId.get(record.reviewId);
    if (!assignment) throw new Error(`Missing blind-review assignment: ${record.reviewId}`);
    for (const dimension of BLIND_REVIEW_DIMENSIONS) {
      const item = totals.get(dimension)!;
      for (const label of ["A", "B"] as const) {
        const target = item[engine(assignment, label)];
        target.count += 1;
        target.total += record.scores[dimension][label];
      }
    }
    if (record.preference === "NO_PREFERENCE") preferences.noPreference += 1;
    else preferences[engine(assignment, record.preference)] += 1;
  }
  const trend = (value: { count: number; total: number }): BlindReviewEngineTrend => ({
    sampleCount: value.count,
    averageScore: value.count === 0 ? null : value.total / value.count,
  });
  return {
    reviewCount: records.length,
    dimensions: BLIND_REVIEW_DIMENSIONS.map((dimension) => {
      const item = totals.get(dimension)!;
      return { dimension, v1: trend(item.v1), v2: trend(item.v2) };
    }),
    preferenceDistribution: preferences,
  };
}

