import { generateGeoPhy001Cp003ReviewBatchV6 } from "./geo-phy-001-cp003-review-generator-v6";

export const GEO_PHY_001_CP003_REVIEW_BATCH_V1 = Object.freeze(
  generateGeoPhy001Cp003ReviewBatchV6().map((question) => Object.freeze(question)),
);

export function auditGeoPhy001Cp003ReviewBatchV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const semantics = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];

  for (const q of GEO_PHY_001_CP003_REVIEW_BATCH_V1) {
    if (ids.has(q.questionId)) issues.push(`DUPLICATE_ID:${q.questionId}`);
    ids.add(q.questionId);
    const semantic = `${q.stem}::${q.canonicalAnswer}`;
    if (semantics.has(semantic)) issues.push(`DUPLICATE_SEMANTIC:${q.questionId}`);
    semantics.add(semantic);
    qlCounts[q.qlId] = (qlCounts[q.qlId] ?? 0) + 1;
    difficultyCounts[q.difficulty] += 1;
    answerPositions[q.correctIndex] += 1;
    if (q.options.length !== 4 || new Set(q.options).size !== 4) issues.push(`OPTIONS:${q.questionId}`);
    if (q.options[q.correctIndex] !== q.canonicalAnswer) issues.push(`ANSWER:${q.questionId}`);
    if (!q.sourceIds.length || !q.sourceFactIds.length) issues.push(`PROVENANCE:${q.questionId}`);
    if (!q.reviewOnly || q.runtimeRegistered) issues.push(`LIFECYCLE:${q.questionId}`);
    const visible = `${q.stem}\n${q.options.join("\n")}\n${q.explanation}`;
    if (/identified by the clue|this clue identifies|is described as|^this pair is correct|^this pair is incorrect/i.test(q.explanation)) issues.push(`EDITORIAL:${q.questionId}`);
    if (/easternmost major|calcareous|interfluves|active floodplain|river-borne sediments|intensive agriculture|favourable climatic|primarily a depositional|qualification gate|generator|sourceFact|review-only|runtimeRegistered/i.test(visible)) issues.push(`COMPLEX_OR_META:${q.questionId}`);
    if (/physiographic division|regional division/i.test(visible)) issues.push(`HEAVY_TERM:${q.questionId}`);
  }

  if (GEO_PHY_001_CP003_REVIEW_BATCH_V1.length !== 54) issues.push(`COUNT:${GEO_PHY_001_CP003_REVIEW_BATCH_V1.length}`);
  if (semantics.size !== 54) issues.push(`SEMANTIC_COUNT:${semantics.size}`);
  for (let i = 19; i <= 27; i += 1) {
    const qlId = `GEO-PHY-001-QL-${String(i).padStart(3, "0")}`;
    if (qlCounts[qlId] !== 6) issues.push(`QL_COUNT:${qlId}:${qlCounts[qlId] ?? 0}`);
  }
  if (answerPositions.join(",") !== "14,14,13,13") issues.push(`ANSWER_POSITIONS:${answerPositions.join(",")}`);
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) issues.push(`DIFFICULTY:${difficultyCounts.Easy}/${difficultyCounts.Medium}/${difficultyCounts.Hard}`);

  return { valid: issues.length === 0, issues, questionCount: 54, semanticCount: semantics.size, qlCounts, difficultyCounts, answerPositions };
}
