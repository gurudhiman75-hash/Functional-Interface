import { generateGeoRiv001Cp006ReviewQuestionsV3 } from "./geo-riv-001-cp006-review-generator-v3";
import type { GeoRiv001Cp006ReviewQuestion } from "./geo-riv-001-cp006-review-types";

function rebalance(q: GeoRiv001Cp006ReviewQuestion, targetIndex: number): GeoRiv001Cp006ReviewQuestion {
  if (q.correctIndex === targetIndex) return q;
  const options = [...q.options];
  const current = q.correctIndex;
  [options[current], options[targetIndex]] = [options[targetIndex], options[current]];
  return { ...q, options, correctIndex: targetIndex };
}

export const GEO_RIV_001_CP006_REVIEW_BATCH_V1: GeoRiv001Cp006ReviewQuestion[] =
  generateGeoRiv001Cp006ReviewQuestionsV3().map((q, index) => rebalance(q, index % 4));

export function auditGeoRiv001Cp006ReviewBatchV1() {
  const issues: string[] = [];
  const qlCounts: Record<string, number> = {};
  const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };
  for (const q of GEO_RIV_001_CP006_REVIEW_BATCH_V1) {
    qlCounts[q.qlId] = (qlCounts[q.qlId] ?? 0) + 1;
    difficultyCounts[q.difficulty] += 1;
    answerPositions[q.correctIndex] += 1;
    if (q.options[q.correctIndex] !== q.canonicalAnswer) issues.push(`ANSWER_MISMATCH:${q.questionId}`);
    if (q.options.length !== 4 || new Set(q.options).size !== 4) issues.push(`BAD_OPTIONS:${q.questionId}`);
    if (!q.sourceIds.length || !q.sourceFactIds.length) issues.push(`NO_PROVENANCE:${q.questionId}`);
    const visible = `${q.stem}\n${q.explanation}`;
    if (/associated with|matches the reviewed relation|exam trap|shortcut|both banks|neither bank/i.test(visible)) issues.push(`EDITORIAL_LANGUAGE:${q.questionId}`);
  }
  const semanticUniqueCount = new Set(GEO_RIV_001_CP006_REVIEW_BATCH_V1.map((q) => [q.qlId, q.stem, [...q.options].sort().join("|"), q.canonicalAnswer].join("|"))).size;
  if (GEO_RIV_001_CP006_REVIEW_BATCH_V1.length !== 54) issues.push(`QUESTION_COUNT:${GEO_RIV_001_CP006_REVIEW_BATCH_V1.length}`);
  if (semanticUniqueCount !== 54) issues.push(`SEMANTIC_UNIQUENESS:${semanticUniqueCount}`);
  const expectedQlCounts: Record<string, number> = {
    "GEO-RIV-001-QL-046": 7,
    "GEO-RIV-001-QL-047": 6,
    "GEO-RIV-001-QL-048": 8,
    "GEO-RIV-001-QL-049": 6,
    "GEO-RIV-001-QL-050": 7,
    "GEO-RIV-001-QL-051": 7,
    "GEO-RIV-001-QL-052": 4,
    "GEO-RIV-001-QL-053": 5,
    "GEO-RIV-001-QL-054": 4,
  };
  for (const [ql, count] of Object.entries(expectedQlCounts)) if (qlCounts[ql] !== count) issues.push(`QL_COUNT:${ql}:${qlCounts[ql] ?? 0}`);
  for (const [pos, count] of Object.entries({0:14,1:14,2:13,3:13})) if (answerPositions[Number(pos)] !== count) issues.push(`ANSWER_POSITION:${pos}:${answerPositions[Number(pos)]}`);
  const text = GEO_RIV_001_CP006_REVIEW_BATCH_V1.map((q) => `${q.stem}\n${q.explanation}`).join("\n");
  for (const term of ["Narmada","Tapi","Mahi","Sabarmati","Luni","Netravati"]) if (!text.includes(term)) issues.push(`MISSING_SYSTEM:${term}`);
  if (!text.includes("Bharathapuzha") && !text.includes("Periyar") && !text.includes("Pamba")) issues.push("MISSING_WEST_COAST_SYSTEMS");
  if (!text.includes("rift-valley")) issues.push("MISSING_RIFT_COMPARISON");
  return { valid: issues.length === 0, issues, questionCount: GEO_RIV_001_CP006_REVIEW_BATCH_V1.length, semanticUniqueCount, qlCounts, difficultyCounts, answerPositions };
}
