import type { GeoSoi001Difficulty, GeoSoi001Question } from "./geo-soi-001-review-types";
import { GEO_SOI_001_CP001_REVIEW_BATCH_V1 } from "./geo-soi-001-cp001-review-batch-v1";
import { GEO_SOI_001_CP002_REVIEW_BATCH_V1 } from "./geo-soi-001-cp002-review-batch-v1";
import { GEO_SOI_001_CP003_REVIEW_BATCH_V1 } from "./geo-soi-001-cp003-review-batch-v1";
import { GEO_SOI_001_CP004_REVIEW_BATCH_V1 } from "./geo-soi-001-cp004-review-batch-v1";
import { GEO_SOI_001_CP005_REVIEW_BATCH_V1 } from "./geo-soi-001-cp005-review-batch-v1";
import { GEO_SOI_001_CP006_REVIEW_BATCH_V1 } from "./geo-soi-001-cp006-review-batch-v1";
import { GEO_SOI_001_CP007_REVIEW_BATCH_V1 } from "./geo-soi-001-cp007-review-batch-v1";
import { GEO_SOI_001_CP008_REVIEW_BATCH_V1 } from "./geo-soi-001-cp008-review-batch-v1";
import { GEO_SOI_001_CP009_REVIEW_BATCH_V1 } from "./geo-soi-001-cp009-review-batch-v1";
import { GEO_SOI_001_CP010_REVIEW_BATCH_V1 } from "./geo-soi-001-cp010-review-batch-v1";
import { GEO_SOI_001_CP011_REVIEW_BATCH_V1 } from "./geo-soi-001-cp011-review-batch-v1";
import { GEO_SOI_001_CP012_REVIEW_BATCH_V1 } from "./geo-soi-001-cp012-review-batch-v1";

const ALL_OWNING: readonly GeoSoi001Question[] = Object.freeze([
  ...GEO_SOI_001_CP001_REVIEW_BATCH_V1,
  ...GEO_SOI_001_CP002_REVIEW_BATCH_V1,
  ...GEO_SOI_001_CP003_REVIEW_BATCH_V1,
  ...GEO_SOI_001_CP004_REVIEW_BATCH_V1,
  ...GEO_SOI_001_CP005_REVIEW_BATCH_V1,
  ...GEO_SOI_001_CP006_REVIEW_BATCH_V1,
  ...GEO_SOI_001_CP007_REVIEW_BATCH_V1,
  ...GEO_SOI_001_CP008_REVIEW_BATCH_V1,
  ...GEO_SOI_001_CP009_REVIEW_BATCH_V1,
  ...GEO_SOI_001_CP010_REVIEW_BATCH_V1,
  ...GEO_SOI_001_CP011_REVIEW_BATCH_V1,
  ...GEO_SOI_001_CP012_REVIEW_BATCH_V1,
]);

const SELECTED_QUESTION_IDS = Object.freeze([
  "GEO-SOI-001-CP001-Q001",
  "GEO-SOI-001-CP001-Q012",
  "GEO-SOI-001-CP001-Q018",
  "GEO-SOI-001-CP001-Q020",
  "GEO-SOI-001-CP001-Q030",
  "GEO-SOI-001-CP001-Q036",
  "GEO-SOI-001-CP001-Q037",
  "GEO-SOI-001-CP001-Q048",
  "GEO-SOI-001-CP001-Q054",
  "GEO-SOI-001-CP002-Q001",
  "GEO-SOI-001-CP002-Q008",
  "GEO-SOI-001-CP002-Q013",
  "GEO-SOI-001-CP002-Q020",
  "GEO-SOI-001-CP002-Q025",
  "GEO-SOI-001-CP002-Q031",
  "GEO-SOI-001-CP002-Q037",
  "GEO-SOI-001-CP002-Q043",
  "GEO-SOI-001-CP002-Q049",
  "GEO-SOI-001-CP003-Q001",
  "GEO-SOI-001-CP003-Q007",
  "GEO-SOI-001-CP003-Q013",
  "GEO-SOI-001-CP003-Q019",
  "GEO-SOI-001-CP003-Q025",
  "GEO-SOI-001-CP003-Q031",
  "GEO-SOI-001-CP003-Q037",
  "GEO-SOI-001-CP003-Q043",
  "GEO-SOI-001-CP003-Q049",
  "GEO-SOI-001-CP004-Q001",
  "GEO-SOI-001-CP004-Q007",
  "GEO-SOI-001-CP004-Q013",
  "GEO-SOI-001-CP004-Q019",
  "GEO-SOI-001-CP004-Q025",
  "GEO-SOI-001-CP004-Q031",
  "GEO-SOI-001-CP004-Q037",
  "GEO-SOI-001-CP004-Q044",
  "GEO-SOI-001-CP004-Q049",
  "GEO-SOI-001-CP005-Q004",
  "GEO-SOI-001-CP005-Q011",
  "GEO-SOI-001-CP005-Q016",
  "GEO-SOI-001-CP005-Q023",
  "GEO-SOI-001-CP005-Q028",
  "GEO-SOI-001-CP005-Q036",
  "GEO-SOI-001-CP005-Q040",
  "GEO-SOI-001-CP005-Q048",
  "GEO-SOI-001-CP005-Q052",
  "GEO-SOI-001-CP006-Q004",
  "GEO-SOI-001-CP006-Q009",
  "GEO-SOI-001-CP006-Q016",
  "GEO-SOI-001-CP006-Q021",
  "GEO-SOI-001-CP006-Q028",
  "GEO-SOI-001-CP006-Q033",
  "GEO-SOI-001-CP006-Q040",
  "GEO-SOI-001-CP006-Q045",
  "GEO-SOI-001-CP006-Q053",
  "GEO-SOI-001-CP007-Q004",
  "GEO-SOI-001-CP007-Q009",
  "GEO-SOI-001-CP007-Q016",
  "GEO-SOI-001-CP007-Q021",
  "GEO-SOI-001-CP007-Q028",
  "GEO-SOI-001-CP007-Q033",
  "GEO-SOI-001-CP007-Q040",
  "GEO-SOI-001-CP007-Q048",
  "GEO-SOI-001-CP007-Q052",
  "GEO-SOI-001-CP008-Q004",
  "GEO-SOI-001-CP008-Q009",
  "GEO-SOI-001-CP008-Q016",
  "GEO-SOI-001-CP008-Q021",
  "GEO-SOI-001-CP008-Q028",
  "GEO-SOI-001-CP008-Q033",
  "GEO-SOI-001-CP008-Q040",
  "GEO-SOI-001-CP008-Q048",
  "GEO-SOI-001-CP008-Q052",
  "GEO-SOI-001-CP009-Q005",
  "GEO-SOI-001-CP009-Q009",
  "GEO-SOI-001-CP009-Q017",
  "GEO-SOI-001-CP009-Q021",
  "GEO-SOI-001-CP009-Q029",
  "GEO-SOI-001-CP009-Q033",
  "GEO-SOI-001-CP009-Q041",
  "GEO-SOI-001-CP009-Q045",
  "GEO-SOI-001-CP009-Q053",
  "GEO-SOI-001-CP010-Q004",
  "GEO-SOI-001-CP010-Q009",
  "GEO-SOI-001-CP010-Q016",
  "GEO-SOI-001-CP010-Q021",
  "GEO-SOI-001-CP010-Q028",
  "GEO-SOI-001-CP010-Q033",
  "GEO-SOI-001-CP010-Q041",
  "GEO-SOI-001-CP010-Q045",
  "GEO-SOI-001-CP010-Q053",
  "GEO-SOI-001-CP011-Q005",
  "GEO-SOI-001-CP011-Q009",
  "GEO-SOI-001-CP011-Q017",
  "GEO-SOI-001-CP011-Q021",
  "GEO-SOI-001-CP011-Q029",
  "GEO-SOI-001-CP011-Q033",
  "GEO-SOI-001-CP011-Q037",
  "GEO-SOI-001-CP011-Q043",
  "GEO-SOI-001-CP011-Q049",
  "GEO-SOI-001-CP012-Q006",
  "GEO-SOI-001-CP012-Q012",
  "GEO-SOI-001-CP012-Q018",
  "GEO-SOI-001-CP012-Q024",
  "GEO-SOI-001-CP012-Q030",
  "GEO-SOI-001-CP012-Q036",
  "GEO-SOI-001-CP012-Q037",
  "GEO-SOI-001-CP012-Q043",
  "GEO-SOI-001-CP012-Q049"
] as const);
const BY_ID = new Map(ALL_OWNING.map((q) => [q.questionId, q] as const));

export const GEO_SOI_001_CP013_REVIEW_BATCH_V1: readonly GeoSoi001Question[] = Object.freeze(
  SELECTED_QUESTION_IDS.map((id, index) => {
    const source = BY_ID.get(id);
    if (!source) throw new Error("Missing CP013 source question: " + id);
    return Object.freeze({
      ...source,
      questionId: `GEO-SOI-001-CP013-Q${String(index + 1).padStart(3, "0")}`,
      options: Object.freeze([...source.options]),
      sourceIds: Object.freeze([...source.sourceIds]),
      sourceFactIds: Object.freeze([...source.sourceFactIds]),
      reviewOnly: true as const,
      runtimeRegistered: false as const,
    });
  }),
);

export function auditGeoSoi001Cp013ReviewBatchV1() {
  const issues: string[] = [];
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoSoi001Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];
  const stems = new Set<string>();
  const explanations = new Set<string>();
  const ids = new Set<string>();

  for (const q of GEO_SOI_001_CP013_REVIEW_BATCH_V1) {
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

  if (GEO_SOI_001_CP013_REVIEW_BATCH_V1.length !== 108) issues.push("COUNT:" + GEO_SOI_001_CP013_REVIEW_BATCH_V1.length);
  for (let n = 1; n <= 108; n += 1) {
    const qlId = "GEO-SOI-001-QL-" + String(n).padStart(3, "0");
    if (qlCounts[qlId] !== 1) issues.push("QL_COUNT:" + qlId + ":" + (qlCounts[qlId] ?? 0));
  }
  if (difficultyCounts.Easy !== 36 || difficultyCounts.Medium !== 60 || difficultyCounts.Hard !== 12) issues.push("DIFFICULTY:" + JSON.stringify(difficultyCounts));
  if (answerPositions.join(",") !== "27,27,27,27") issues.push("ANSWER_POSITIONS:" + answerPositions.join(","));
  if (stems.size !== 108) issues.push("STEM_COUNT:" + stems.size);
  if (explanations.size !== 108) issues.push("EXPLANATION_COUNT:" + explanations.size);

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: GEO_SOI_001_CP013_REVIEW_BATCH_V1.length,
    qlCounts: Object.freeze(qlCounts),
    difficultyCounts: Object.freeze(difficultyCounts),
    answerPositions: Object.freeze(answerPositions),
    stemCount: stems.size,
    explanationCount: explanations.size,
  });
}
