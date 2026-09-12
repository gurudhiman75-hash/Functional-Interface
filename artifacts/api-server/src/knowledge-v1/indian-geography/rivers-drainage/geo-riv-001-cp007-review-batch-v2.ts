import { GEO_RIV_001_CP007_REVIEW_BATCH_V1 } from "./geo-riv-001-cp007-review-batch-v1";
import { reviseGeoRiv001Cp007QuestionV2 } from "./geo-riv-001-cp007-review-generator-v2";
import type { GeoRiv001Cp007ReviewQuestion } from "./geo-riv-001-cp007-review-types";

export const GEO_RIV_001_CP007_REVIEW_BATCH_V2: GeoRiv001Cp007ReviewQuestion[] =
  GEO_RIV_001_CP007_REVIEW_BATCH_V1.map(reviseGeoRiv001Cp007QuestionV2);

function semanticKey(q: GeoRiv001Cp007ReviewQuestion) {
  return [q.qlId, q.stem, q.canonicalAnswer].join("|");
}

function upstreamTokens(q: GeoRiv001Cp007ReviewQuestion) {
  return [...new Set(q.sourceFactIds.flatMap((id) => {
    const match = id.match(/geo-riv-001-cp007-(cp00[2-5])-/);
    return match ? [match[1]] : [];
  }))];
}

export function auditGeoRiv001Cp007ReviewBatchV2() {
  const issues: string[] = [];
  const qlCounts: Record<string, number> = {};
  const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };
  const upstreamCounts: Record<string, number> = {};
  const semanticKeys = new Set<string>();
  const banned = /associated with|matches the reviewed relation|listed among|joining relation|therefore,|exam trap|shortcut|both banks|neither bank|at near|at below|at west of|the confluence of the Chandra and Bhaga rivers/i;

  for (const q of GEO_RIV_001_CP007_REVIEW_BATCH_V2) {
    qlCounts[q.qlId] = (qlCounts[q.qlId] ?? 0) + 1;
    difficultyCounts[q.difficulty] += 1;
    answerPositions[q.correctIndex] += 1;
    semanticKeys.add(semanticKey(q));
    if (q.options.length !== 4 || new Set(q.options).size !== 4) issues.push(`BAD_OPTIONS:${q.questionId}`);
    if (q.options[q.correctIndex] !== q.canonicalAnswer) issues.push(`ANSWER_MISMATCH:${q.questionId}`);
    if (!q.sourceIds.length || !q.sourceFactIds.length || !q.upstreamFactIds.length) issues.push(`NO_PROVENANCE:${q.questionId}`);
    if (q.sourceFactIds.some((id) => id.includes("cp006")) || q.upstreamFactIds.some((id) => id.includes("cp006") || id === "unknown")) issues.push(`CP006_OR_LINEAGE_LEAK:${q.questionId}`);
    if (banned.test(`${q.stem}\n${q.explanation}\n${q.options.join("\n")}`)) issues.push(`EDITORIAL_LANGUAGE:${q.questionId}`);
    for (const option of q.options) {
      const parts = option.split(" — ");
      if (parts.length === 2 && parts[0] === parts[1]) issues.push(`SELF_PAIR:${q.questionId}:${option}`);
    }
    for (const token of upstreamTokens(q)) upstreamCounts[token] = (upstreamCounts[token] ?? 0) + 1;
  }

  const expectedQlCounts: Record<string, number> = {
    "GEO-RIV-001-QL-055": 8,
    "GEO-RIV-001-QL-056": 7,
    "GEO-RIV-001-QL-057": 7,
    "GEO-RIV-001-QL-058": 6,
    "GEO-RIV-001-QL-059": 7,
    "GEO-RIV-001-QL-060": 6,
    "GEO-RIV-001-QL-061": 6,
    "GEO-RIV-001-QL-062": 5,
    "GEO-RIV-001-QL-063": 4,
    "GEO-RIV-001-QL-064": 4,
  };
  if (GEO_RIV_001_CP007_REVIEW_BATCH_V2.length !== 60) issues.push(`QUESTION_COUNT:${GEO_RIV_001_CP007_REVIEW_BATCH_V2.length}`);
  if (semanticKeys.size !== 60) issues.push(`SEMANTIC_UNIQUENESS:${semanticKeys.size}`);
  for (const [ql, expected] of Object.entries(expectedQlCounts)) if (qlCounts[ql] !== expected) issues.push(`QL_COUNT:${ql}:${qlCounts[ql] ?? 0}`);
  for (const [pos, expected] of Object.entries({ 0: 15, 1: 15, 2: 15, 3: 15 })) if (answerPositions[Number(pos)] !== expected) issues.push(`ANSWER_POSITION:${pos}:${answerPositions[Number(pos)]}`);
  if (difficultyCounts.Easy !== 15 || difficultyCounts.Medium !== 36 || difficultyCounts.Hard !== 9) issues.push(`DIFFICULTY:${difficultyCounts.Easy}/${difficultyCounts.Medium}/${difficultyCounts.Hard}`);
  for (const token of ["cp002", "cp003", "cp004", "cp005"]) if (!upstreamCounts[token]) issues.push(`MISSING_UPSTREAM:${token}`);
  if (upstreamCounts.cp006) issues.push("UNAPPROVED_CP006_PRESENT");

  for (const ql of ["GEO-RIV-001-QL-060", "GEO-RIV-001-QL-061"]) {
    const answers = GEO_RIV_001_CP007_REVIEW_BATCH_V2.filter((q) => q.qlId === ql).map((q) => q.canonicalAnswer);
    if (new Set(answers).size !== answers.length) issues.push(`PAIR_CONTENT_REPEAT:${ql}`);
  }

  return {
    valid: issues.length === 0,
    issues,
    questionCount: GEO_RIV_001_CP007_REVIEW_BATCH_V2.length,
    semanticUniqueCount: semanticKeys.size,
    qlCounts,
    difficultyCounts,
    answerPositions,
    upstreamCounts,
  };
}
