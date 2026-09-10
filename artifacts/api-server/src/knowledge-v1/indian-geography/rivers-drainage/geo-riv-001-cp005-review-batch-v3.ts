import { GEO_RIV_001_CP005_REVIEW_BATCH_V2 } from "./geo-riv-001-cp005-review-batch-v2";
import type { GeoRiv001Cp005ReviewQuestion } from "./geo-riv-001-cp005-review-types";

function rebalance(question: GeoRiv001Cp005ReviewQuestion, index: number): GeoRiv001Cp005ReviewQuestion {
  const targetIndex = index % 4;
  const distractors = question.options.filter((_, optionIndex) => optionIndex !== question.correctIndex);
  const options = [...distractors];
  options.splice(targetIndex, 0, question.canonicalAnswer);
  return {
    ...question,
    questionId: question.questionId.replace("CP005-V2", "CP005-V3"),
    options,
    correctIndex: targetIndex,
  };
}

export const GEO_RIV_001_CP005_REVIEW_BATCH_V3: GeoRiv001Cp005ReviewQuestion[] =
  GEO_RIV_001_CP005_REVIEW_BATCH_V2.map(rebalance);

function semanticKey(question: GeoRiv001Cp005ReviewQuestion) {
  return [question.qlId, question.stem.replace(/\s+/g, " ").trim(), [...question.options].sort().join(" || "), question.canonicalAnswer].join(" | ");
}

function pairTarget(question: GeoRiv001Cp005ReviewQuestion) {
  return question.canonicalAnswer.split(" — ")[0]?.trim() ?? "";
}

export function auditGeoRiv001Cp005ReviewBatchV3() {
  const issues: string[] = [];
  const semantic = new Set<string>();
  const qlCounts = new Map<string, number>();
  const difficultyCounts = new Map<string, number>();
  const answerPositions = new Map<number, number>();

  for (const q of GEO_RIV_001_CP005_REVIEW_BATCH_V3) {
    const key = semanticKey(q);
    if (semantic.has(key)) issues.push(`SEMANTIC_DUPLICATE:${q.questionId}`);
    semantic.add(key);
    qlCounts.set(q.qlId, (qlCounts.get(q.qlId) ?? 0) + 1);
    difficultyCounts.set(q.difficulty, (difficultyCounts.get(q.difficulty) ?? 0) + 1);
    answerPositions.set(q.correctIndex, (answerPositions.get(q.correctIndex) ?? 0) + 1);
    if (q.options.length !== 4) issues.push(`OPTION_COUNT:${q.questionId}`);
    if (new Set(q.options).size !== 4) issues.push(`DUPLICATE_OPTION:${q.questionId}`);
    if (q.options[q.correctIndex] !== q.canonicalAnswer) issues.push(`ANSWER_MISMATCH:${q.questionId}`);
    if (!q.sourceIds.length || !q.sourceFactIds.length) issues.push(`MISSING_PROVENANCE:${q.questionId}`);
    if (q.explanation.length < 35) issues.push(`SHORT_EXPLANATION:${q.questionId}`);
    const visible = `${q.stem}\n${q.explanation}`;
    if (/associated with|matches the reviewed relation|exam trap|shortcut|characteristic of this setting|near\s+near|Therefore,|both banks|neither bank/i.test(visible)) issues.push(`EDITORIAL_LANGUAGE:${q.questionId}`);
    if (/\b\d{3,5}\s*km\b|catchment|tribunal|dispute|current storage|current flood|project status/i.test(visible)) issues.push(`UNSTABLE_CONTENT:${q.questionId}`);
  }

  const expectedCounts: Record<string, number> = {
    "GEO-RIV-001-QL-037": 7, "GEO-RIV-001-QL-038": 6, "GEO-RIV-001-QL-039": 8,
    "GEO-RIV-001-QL-040": 5, "GEO-RIV-001-QL-041": 7, "GEO-RIV-001-QL-042": 7,
    "GEO-RIV-001-QL-043": 4, "GEO-RIV-001-QL-044": 6, "GEO-RIV-001-QL-045": 4,
  };
  if (GEO_RIV_001_CP005_REVIEW_BATCH_V3.length !== 54) issues.push(`TOTAL_COUNT:${GEO_RIV_001_CP005_REVIEW_BATCH_V3.length}:54`);
  for (const [qlId, expected] of Object.entries(expectedCounts)) if ((qlCounts.get(qlId) ?? 0) !== expected) issues.push(`QL_COUNT:${qlId}:${qlCounts.get(qlId) ?? 0}:${expected}`);

  for (const qlId of ["GEO-RIV-001-QL-041", "GEO-RIV-001-QL-042"]) {
    const targets = new Set(GEO_RIV_001_CP005_REVIEW_BATCH_V3.filter((q) => q.qlId === qlId).map(pairTarget));
    if (targets.size !== 7) issues.push(`PAIR_TARGET_DIVERSITY:${qlId}:${targets.size}:7`);
  }
  const corpusText = GEO_RIV_001_CP005_REVIEW_BATCH_V3.map((q) => `${q.stem}\n${q.canonicalAnswer}\n${q.explanation}`).join("\n");
  for (const river of ["Godavari", "Krishna", "Mahanadi", "Cauvery", "Pennar", "Brahmani", "Baitarani", "Subarnarekha"]) if (!corpusText.includes(river)) issues.push(`MISSING_CORE_SYSTEM:${river}`);
  for (const chain of ["Wardha + Wainganga → Pranhita → Godavari", "Tunga + Bhadra → Tungabhadra → Krishna", "Sankh + Koel → Brahmani → Bay of Bengal"]) if (!GEO_RIV_001_CP005_REVIEW_BATCH_V3.some((q) => q.canonicalAnswer === chain)) issues.push(`MISSING_FORMATION_CHAIN:${chain}`);
  for (const parent of ["Godavari", "Krishna", "Mahanadi", "Cauvery", "Pennar"]) if (!GEO_RIV_001_CP005_REVIEW_BATCH_V3.some((q) => q.qlId === "GEO-RIV-001-QL-039" && q.stem.includes(`${parent}?`))) issues.push(`MISSING_BANK_SYSTEM:${parent}`);
  for (const index of [0, 1, 2, 3]) if ((answerPositions.get(index) ?? 0) < 12) issues.push(`WEAK_ANSWER_POSITION:${index}:${answerPositions.get(index) ?? 0}`);

  return {
    valid: issues.length === 0,
    questionCount: GEO_RIV_001_CP005_REVIEW_BATCH_V3.length,
    semanticUniqueCount: semantic.size,
    qlCounts: Object.fromEntries(qlCounts),
    difficultyCounts: Object.fromEntries(difficultyCounts),
    answerPositions: Object.fromEntries(answerPositions),
    issues,
  };
}
