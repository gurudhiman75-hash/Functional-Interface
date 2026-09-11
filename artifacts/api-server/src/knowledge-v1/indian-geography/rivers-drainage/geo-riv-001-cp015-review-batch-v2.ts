import {
  GEO_RIV_001_CP015_REVIEW_BATCH_V1,
  auditGeoRiv001Cp015ReviewBatchV1,
} from "./geo-riv-001-cp015-review-batch-v1";
import {
  geoRiv001Cp015BareRiverName,
  realizeGeoRiv001Cp015QuestionV1,
} from "./geo-riv-001-cp015-realizer-v1";

const baseAudit = auditGeoRiv001Cp015ReviewBatchV1();
if (!baseAudit.valid) throw new Error(`CP015 V2 requires valid V1 composition: ${baseAudit.issues.join(" | ")}`);

export const GEO_RIV_001_CP015_REVIEW_BATCH_V2 = Object.freeze(
  GEO_RIV_001_CP015_REVIEW_BATCH_V1.map((question) => Object.freeze(realizeGeoRiv001Cp015QuestionV1(question))),
);

export function auditGeoRiv001Cp015ReviewBatchV2() {
  const issues = [...baseAudit.issues];
  const semantics = new Set<string>();
  const positions = [0, 0, 0, 0];
  const cpCounts: Record<string, number> = {};
  const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };

  for (const question of GEO_RIV_001_CP015_REVIEW_BATCH_V2) {
    cpCounts[question.sourceCpId] = (cpCounts[question.sourceCpId] ?? 0) + 1;
    difficultyCounts[question.difficulty] += 1;
    positions[question.correctIndex] += 1;
    semantics.add(`${question.stem}::${question.canonicalAnswer}`);

    if (question.options.length !== 4 || new Set(question.options).size !== 4) issues.push(`V2_OPTIONS:${question.questionId}`);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`V2_ANSWER:${question.questionId}`);
    for (const visible of [question.stem, ...question.options, question.explanation]) {
      const bare = geoRiv001Cp015BareRiverName(visible);
      if (bare) issues.push(`V2_BARE_RIVER:${question.questionId}:${bare}`);
      if (/\bRiver\s+River\b/i.test(visible)) issues.push(`V2_DUPLICATE_RIVER_PREFIX:${question.questionId}`);
    }
  }

  if (GEO_RIV_001_CP015_REVIEW_BATCH_V2.length !== 60) issues.push(`V2_COUNT:${GEO_RIV_001_CP015_REVIEW_BATCH_V2.length}`);
  if (semantics.size !== 60) issues.push(`V2_SEMANTICS:${semantics.size}`);
  if (positions.join(",") !== "15,15,15,15") issues.push(`V2_POSITIONS:${positions.join(",")}`);
  if (difficultyCounts.Easy !== 14 || difficultyCounts.Medium !== 32 || difficultyCounts.Hard !== 14) {
    issues.push(`V2_DIFFICULTY:${difficultyCounts.Easy}/${difficultyCounts.Medium}/${difficultyCounts.Hard}`);
  }

  return {
    ...baseAudit,
    valid: issues.length === 0,
    issues,
    questionCount: GEO_RIV_001_CP015_REVIEW_BATCH_V2.length,
    semanticUniqueCount: semantics.size,
    answerPositions: positions,
    difficultyCounts,
    cpCounts,
    learnerSurfaceVersion: "RIVER_PREFIX_NORMALIZED_V2" as const,
  };
}
