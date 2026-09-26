import type { GeoLoc001Difficulty, GeoLoc001Question } from "./geo-loc-001-review-types";
import { GEO_LOC_001_CP001_REVIEW_BATCH_V1 } from "./geo-loc-001-cp001-review-batch-v1";
import { GEO_LOC_001_CP002_REVIEW_BATCH_V1 } from "./geo-loc-001-cp002-review-batch-v1";
import { GEO_LOC_001_CP003_REVIEW_BATCH_V1 } from "./geo-loc-001-cp003-review-batch-v1";
import { GEO_LOC_001_CP004_REVIEW_BATCH_V1 } from "./geo-loc-001-cp004-review-batch-v1";
import { GEO_LOC_001_CP005_REVIEW_BATCH_V1 } from "./geo-loc-001-cp005-review-batch-v1";
import { GEO_LOC_001_CP006_REVIEW_BATCH_V1 } from "./geo-loc-001-cp006-review-batch-v1";
import { GEO_LOC_001_CP007_REVIEW_BATCH_V1 } from "./geo-loc-001-cp007-review-batch-v1";
import { GEO_LOC_001_CP008_REVIEW_BATCH_V1 } from "./geo-loc-001-cp008-review-batch-v1";
import { GEO_LOC_001_CP009_REVIEW_BATCH_V1 } from "./geo-loc-001-cp009-review-batch-v1";
import { GEO_LOC_001_CP010_REVIEW_BATCH_V1 } from "./geo-loc-001-cp010-review-batch-v1";
import { GEO_LOC_001_CP011_REVIEW_BATCH_V1 } from "./geo-loc-001-cp011-review-batch-v1";
import { GEO_LOC_001_CP012_REVIEW_BATCH_V1 } from "./geo-loc-001-cp012-review-batch-v1";

export const GEO_LOC_001_CP013_SOURCE_BATCHES_V1: readonly (readonly GeoLoc001Question[])[] = Object.freeze([
  GEO_LOC_001_CP001_REVIEW_BATCH_V1,
  GEO_LOC_001_CP002_REVIEW_BATCH_V1,
  GEO_LOC_001_CP003_REVIEW_BATCH_V1,
  GEO_LOC_001_CP004_REVIEW_BATCH_V1,
  GEO_LOC_001_CP005_REVIEW_BATCH_V1,
  GEO_LOC_001_CP006_REVIEW_BATCH_V1,
  GEO_LOC_001_CP007_REVIEW_BATCH_V1,
  GEO_LOC_001_CP008_REVIEW_BATCH_V1,
  GEO_LOC_001_CP009_REVIEW_BATCH_V1,
  GEO_LOC_001_CP010_REVIEW_BATCH_V1,
  GEO_LOC_001_CP011_REVIEW_BATCH_V1,
  GEO_LOC_001_CP012_REVIEW_BATCH_V1,
]);

const ALL_OWNING: readonly GeoLoc001Question[] = Object.freeze(
  GEO_LOC_001_CP013_SOURCE_BATCHES_V1.flatMap((batch) => [...batch]),
);

const SELECTED_QUESTION_IDS = Object.freeze([
  "GEO-LOC-001-CP001-Q001",
  "GEO-LOC-001-CP001-Q007",
  "GEO-LOC-001-CP001-Q013",
  "GEO-LOC-001-CP001-Q021",
  "GEO-LOC-001-CP001-Q028",
  "GEO-LOC-001-CP001-Q034",
  "GEO-LOC-001-CP001-Q040",
  "GEO-LOC-001-CP001-Q047",
  "GEO-LOC-001-CP001-Q054",
  "GEO-LOC-001-CP002-Q001",
  "GEO-LOC-001-CP002-Q007",
  "GEO-LOC-001-CP002-Q013",
  "GEO-LOC-001-CP002-Q022",
  "GEO-LOC-001-CP002-Q028",
  "GEO-LOC-001-CP002-Q034",
  "GEO-LOC-001-CP002-Q040",
  "GEO-LOC-001-CP002-Q047",
  "GEO-LOC-001-CP002-Q054",
  "GEO-LOC-001-CP003-Q001",
  "GEO-LOC-001-CP003-Q007",
  "GEO-LOC-001-CP003-Q013",
  "GEO-LOC-001-CP003-Q022",
  "GEO-LOC-001-CP003-Q027",
  "GEO-LOC-001-CP003-Q034",
  "GEO-LOC-001-CP003-Q039",
  "GEO-LOC-001-CP003-Q048",
  "GEO-LOC-001-CP003-Q052",
  "GEO-LOC-001-CP004-Q001",
  "GEO-LOC-001-CP004-Q007",
  "GEO-LOC-001-CP004-Q013",
  "GEO-LOC-001-CP004-Q022",
  "GEO-LOC-001-CP004-Q027",
  "GEO-LOC-001-CP004-Q034",
  "GEO-LOC-001-CP004-Q040",
  "GEO-LOC-001-CP004-Q048",
  "GEO-LOC-001-CP004-Q052",
  "GEO-LOC-001-CP005-Q001",
  "GEO-LOC-001-CP005-Q007",
  "GEO-LOC-001-CP005-Q013",
  "GEO-LOC-001-CP005-Q021",
  "GEO-LOC-001-CP005-Q028",
  "GEO-LOC-001-CP005-Q034",
  "GEO-LOC-001-CP005-Q040",
  "GEO-LOC-001-CP005-Q047",
  "GEO-LOC-001-CP005-Q054",
  "GEO-LOC-001-CP006-Q001",
  "GEO-LOC-001-CP006-Q007",
  "GEO-LOC-001-CP006-Q013",
  "GEO-LOC-001-CP006-Q022",
  "GEO-LOC-001-CP006-Q027",
  "GEO-LOC-001-CP006-Q034",
  "GEO-LOC-001-CP006-Q040",
  "GEO-LOC-001-CP006-Q048",
  "GEO-LOC-001-CP006-Q054",
  "GEO-LOC-001-CP007-Q001",
  "GEO-LOC-001-CP007-Q007",
  "GEO-LOC-001-CP007-Q013",
  "GEO-LOC-001-CP007-Q022",
  "GEO-LOC-001-CP007-Q027",
  "GEO-LOC-001-CP007-Q034",
  "GEO-LOC-001-CP007-Q039",
  "GEO-LOC-001-CP007-Q048",
  "GEO-LOC-001-CP007-Q052",
  "GEO-LOC-001-CP008-Q001",
  "GEO-LOC-001-CP008-Q007",
  "GEO-LOC-001-CP008-Q013",
  "GEO-LOC-001-CP008-Q022",
  "GEO-LOC-001-CP008-Q027",
  "GEO-LOC-001-CP008-Q034",
  "GEO-LOC-001-CP008-Q040",
  "GEO-LOC-001-CP008-Q048",
  "GEO-LOC-001-CP008-Q052",
  "GEO-LOC-001-CP009-Q001",
  "GEO-LOC-001-CP009-Q007",
  "GEO-LOC-001-CP009-Q013",
  "GEO-LOC-001-CP009-Q021",
  "GEO-LOC-001-CP009-Q028",
  "GEO-LOC-001-CP009-Q034",
  "GEO-LOC-001-CP009-Q040",
  "GEO-LOC-001-CP009-Q047",
  "GEO-LOC-001-CP009-Q054",
  "GEO-LOC-001-CP010-Q001",
  "GEO-LOC-001-CP010-Q007",
  "GEO-LOC-001-CP010-Q013",
  "GEO-LOC-001-CP010-Q022",
  "GEO-LOC-001-CP010-Q028",
  "GEO-LOC-001-CP010-Q034",
  "GEO-LOC-001-CP010-Q040",
  "GEO-LOC-001-CP010-Q047",
  "GEO-LOC-001-CP010-Q054",
  "GEO-LOC-001-CP011-Q001",
  "GEO-LOC-001-CP011-Q007",
  "GEO-LOC-001-CP011-Q013",
  "GEO-LOC-001-CP011-Q022",
  "GEO-LOC-001-CP011-Q027",
  "GEO-LOC-001-CP011-Q034",
  "GEO-LOC-001-CP011-Q039",
  "GEO-LOC-001-CP011-Q048",
  "GEO-LOC-001-CP011-Q052",
  "GEO-LOC-001-CP012-Q001",
  "GEO-LOC-001-CP012-Q007",
  "GEO-LOC-001-CP012-Q013",
  "GEO-LOC-001-CP012-Q022",
  "GEO-LOC-001-CP012-Q027",
  "GEO-LOC-001-CP012-Q036",
  "GEO-LOC-001-CP012-Q040",
  "GEO-LOC-001-CP012-Q046",
  "GEO-LOC-001-CP012-Q052",
] as const);

const BY_ID = new Map(ALL_OWNING.map((q) => [q.questionId, q] as const));

export const GEO_LOC_001_CP013_REVIEW_BATCH_V1: readonly GeoLoc001Question[] = Object.freeze(
  SELECTED_QUESTION_IDS.map((id, index) => {
    const source = BY_ID.get(id);
    if (!source) throw new Error("Missing CP013 source question: " + id);
    return Object.freeze({
      ...source,
      questionId: `GEO-LOC-001-CP013-Q${String(index + 1).padStart(3, "0")}`,
      options: Object.freeze([...source.options]),
      sourceIds: Object.freeze([...source.sourceIds]),
      sourceFactIds: Object.freeze([...source.sourceFactIds]),
      reviewOnly: true as const,
      runtimeRegistered: false as const,
    });
  }),
);

export function auditGeoLoc001Cp013ReviewBatchV1() {
  const issues: string[] = [];
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoLoc001Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];
  const stems = new Set<string>();
  const explanations = new Set<string>();
  const ids = new Set<string>();

  for (const q of GEO_LOC_001_CP013_REVIEW_BATCH_V1) {
    if (ids.has(q.questionId)) issues.push("DUPLICATE_ID:" + q.questionId);
    ids.add(q.questionId);
    qlCounts[q.qlId] = (qlCounts[q.qlId] ?? 0) + 1;
    difficultyCounts[q.difficulty] += 1;
    answerPositions[q.correctIndex] += 1;
    stems.add(q.stem.replace(/\s+/g, " ").trim().toLowerCase());
    explanations.add(q.explanation.replace(/\s+/g, " ").trim().toLowerCase());
    if (q.options.length !== 4 || new Set(q.options).size !== 4) issues.push("OPTIONS:" + q.questionId);
    if (q.options[q.correctIndex] !== q.canonicalAnswer) issues.push("ANSWER:" + q.questionId);
    if (!q.sourceIds.length || !q.sourceFactIds.length) issues.push("PROVENANCE:" + q.questionId);
    if (!q.reviewOnly || q.runtimeRegistered) issues.push("LIFECYCLE:" + q.questionId);
  }

  if (GEO_LOC_001_CP013_REVIEW_BATCH_V1.length !== 108) issues.push("COUNT:" + GEO_LOC_001_CP013_REVIEW_BATCH_V1.length);
  for (let n = 1; n <= 108; n += 1) {
    const qlId = "GEO-LOC-001-QL-" + String(n).padStart(3, "0");
    if (qlCounts[qlId] !== 1) issues.push("QL_COUNT:" + qlId + ":" + (qlCounts[qlId] ?? 0));
  }
  if (difficultyCounts.Easy !== 36 || difficultyCounts.Medium !== 60 || difficultyCounts.Hard !== 12) issues.push("DIFFICULTY:" + JSON.stringify(difficultyCounts));
  if (answerPositions.join(",") !== "27,27,27,27") issues.push("ANSWER_POSITIONS:" + answerPositions.join(","));
  if (stems.size !== 108) issues.push("STEM_COUNT:" + stems.size);
  if (explanations.size !== 108) issues.push("EXPLANATION_COUNT:" + explanations.size);

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: GEO_LOC_001_CP013_REVIEW_BATCH_V1.length,
    qlCounts: Object.freeze(qlCounts),
    difficultyCounts: Object.freeze(difficultyCounts),
    answerPositions: Object.freeze(answerPositions),
    stemCount: stems.size,
    explanationCount: explanations.size,
  });
}
