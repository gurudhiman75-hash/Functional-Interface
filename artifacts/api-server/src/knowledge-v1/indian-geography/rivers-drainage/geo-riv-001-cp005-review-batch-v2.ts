import { generateGeoRiv001Cp005ReviewV2 } from "./geo-riv-001-cp005-review-generator-v2";
import type { GeoRiv001Cp005ReviewQuestion } from "./geo-riv-001-cp005-review-types";

const REVIEW_COUNTS: Record<string, number> = {
  "GEO-RIV-001-QL-037": 7,
  "GEO-RIV-001-QL-038": 6,
  "GEO-RIV-001-QL-039": 8,
  "GEO-RIV-001-QL-040": 5,
  "GEO-RIV-001-QL-041": 7,
  "GEO-RIV-001-QL-042": 7,
  "GEO-RIV-001-QL-043": 4,
  "GEO-RIV-001-QL-044": 6,
  "GEO-RIV-001-QL-045": 4,
};

type Predicate = (question: GeoRiv001Cp005ReviewQuestion) => boolean;

function semanticKey(question: GeoRiv001Cp005ReviewQuestion) {
  return [question.qlId, question.stem.replace(/\s+/g, " ").trim(), [...question.options].sort().join(" || "), question.canonicalAnswer].join(" | ");
}

function pairTarget(question: GeoRiv001Cp005ReviewQuestion) {
  if (!["GEO-RIV-001-QL-041", "GEO-RIV-001-QL-042"].includes(question.qlId)) return "";
  return question.canonicalAnswer.split(" — ")[0]?.trim() ?? "";
}

function scan(qlId: string) {
  return Array.from({ length: 2000 }, (_, index) =>
    generateGeoRiv001Cp005ReviewV2(qlId, `geo-riv-001-cp005-v2-review-${qlId}-${String(index + 1).padStart(4, "0")}`),
  );
}

function select(qlId: string, count: number, required: readonly Predicate[] = []) {
  const candidates = scan(qlId);
  const selected: GeoRiv001Cp005ReviewQuestion[] = [];
  const semantics = new Set<string>();
  const stems = new Set<string>();
  const pairTargets = new Set<string>();

  const canUse = (q: GeoRiv001Cp005ReviewQuestion) => {
    if (semantics.has(semanticKey(q))) return false;
    if (["GEO-RIV-001-QL-037", "GEO-RIV-001-QL-038", "GEO-RIV-001-QL-039", "GEO-RIV-001-QL-040", "GEO-RIV-001-QL-043", "GEO-RIV-001-QL-044", "GEO-RIV-001-QL-045"].includes(qlId)) {
      const stem = q.stem.replace(/\s+/g, " ").trim();
      if (stems.has(stem)) return false;
    }
    if (["GEO-RIV-001-QL-041", "GEO-RIV-001-QL-042"].includes(qlId)) {
      const target = pairTarget(q);
      if (!target || pairTargets.has(target)) return false;
    }
    return true;
  };

  const add = (q: GeoRiv001Cp005ReviewQuestion) => {
    selected.push(q);
    semantics.add(semanticKey(q));
    stems.add(q.stem.replace(/\s+/g, " ").trim());
    const target = pairTarget(q);
    if (target) pairTargets.add(target);
  };

  for (const predicate of required) {
    const candidate = candidates.find((q) => canUse(q) && predicate(q));
    if (!candidate) throw new Error(`CP005 V2 could not satisfy ${qlId} required predicate`);
    add(candidate);
  }
  for (const candidate of candidates) {
    if (selected.length >= count) break;
    if (canUse(candidate)) add(candidate);
  }
  if (selected.length !== count) throw new Error(`CP005 V2 selected ${selected.length}/${count} questions for ${qlId}`);
  return selected;
}

const REQUIRED: Record<string, Predicate[]> = {
  "GEO-RIV-001-QL-039": [
    (q) => q.stem === "Which of the following is a left bank tributary of the Godavari?" || q.stem === "Which of the following is a right bank tributary of the Godavari?",
    (q) => q.stem === "Which of the following is a left bank tributary of the Krishna?" || q.stem === "Which of the following is a right bank tributary of the Krishna?",
    (q) => q.stem === "Which of the following is a left bank tributary of the Mahanadi?" || q.stem === "Which of the following is a right bank tributary of the Mahanadi?",
    (q) => q.stem === "Which of the following is a left bank tributary of the Cauvery?" || q.stem === "Which of the following is a right bank tributary of the Cauvery?",
    (q) => q.stem === "Which of the following is a left bank tributary of the Pennar?" || q.stem === "Which of the following is a right bank tributary of the Pennar?",
    (q) => q.canonicalAnswer === "Baitarani",
    (q) => q.canonicalAnswer === "Subarnarekha",
    (q) => q.canonicalAnswer === "Godavari" && /Pranhita/.test(q.stem),
  ],
  "GEO-RIV-001-QL-040": [
    (q) => q.canonicalAnswer === "Pranhita",
    (q) => q.canonicalAnswer === "Godavari",
    (q) => q.canonicalAnswer === "Tunga and Bhadra",
    (q) => q.canonicalAnswer === "Krishna",
    (q) => q.canonicalAnswer === "Sankh and Koel",
  ],
  "GEO-RIV-001-QL-041": [
    (q) => q.canonicalAnswer.startsWith("Godavari —"),
    (q) => q.canonicalAnswer.startsWith("Krishna —"),
    (q) => q.canonicalAnswer.startsWith("Mahanadi —"),
    (q) => q.canonicalAnswer.startsWith("Cauvery —"),
    (q) => q.canonicalAnswer.startsWith("Pennar —"),
    (q) => q.canonicalAnswer.startsWith("Brahmani —"),
    (q) => q.canonicalAnswer.startsWith("Baitarani —"),
  ],
  "GEO-RIV-001-QL-042": [
    (q) => q.canonicalAnswer.startsWith("Krishna —"),
    (q) => q.canonicalAnswer.startsWith("Mahanadi —"),
    (q) => q.canonicalAnswer.startsWith("Cauvery —"),
    (q) => q.canonicalAnswer.startsWith("Pennar —"),
    (q) => q.canonicalAnswer.startsWith("Brahmani —"),
    (q) => q.canonicalAnswer.startsWith("Baitarani —"),
    (q) => q.canonicalAnswer.startsWith("Subarnarekha —"),
  ],
  "GEO-RIV-001-QL-043": [
    (q) => q.canonicalAnswer === "Wardha + Wainganga → Pranhita → Godavari",
    (q) => q.canonicalAnswer === "Tunga + Bhadra → Tungabhadra → Krishna",
    (q) => q.canonicalAnswer === "Sankh + Koel → Brahmani → Bay of Bengal",
    (q) => q.canonicalAnswer === "Talakaveri → Cauvery/Kaveri → Bay of Bengal",
  ],
  "GEO-RIV-001-QL-044": [
    (q) => q.canonicalAnswer === "Both Statement I and Statement II are correct",
    (q) => q.canonicalAnswer === "Only Statement I is correct",
    (q) => q.canonicalAnswer === "Only Statement II is correct",
    (q) => q.canonicalAnswer === "Neither Statement I nor Statement II is correct",
  ],
  "GEO-RIV-001-QL-045": [
    (q) => q.canonicalAnswer === "None",
    (q) => q.canonicalAnswer === "One",
    (q) => q.canonicalAnswer === "Two",
    (q) => q.canonicalAnswer === "Three",
  ],
};

export const GEO_RIV_001_CP005_REVIEW_BATCH_V2: GeoRiv001Cp005ReviewQuestion[] = Object.entries(REVIEW_COUNTS).flatMap(
  ([qlId, count]) => select(qlId, count, REQUIRED[qlId] ?? []),
);

export function auditGeoRiv001Cp005ReviewBatchV2() {
  const issues: string[] = [];
  const semantic = new Set<string>();
  const qlCounts = new Map<string, number>();
  const difficultyCounts = new Map<string, number>();
  const answerPositions = new Map<number, number>();

  for (const q of GEO_RIV_001_CP005_REVIEW_BATCH_V2) {
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

  const expectedTotal = Object.values(REVIEW_COUNTS).reduce((sum, value) => sum + value, 0);
  if (GEO_RIV_001_CP005_REVIEW_BATCH_V2.length !== expectedTotal) issues.push(`TOTAL_COUNT:${GEO_RIV_001_CP005_REVIEW_BATCH_V2.length}:${expectedTotal}`);
  for (const [qlId, expected] of Object.entries(REVIEW_COUNTS)) {
    if ((qlCounts.get(qlId) ?? 0) !== expected) issues.push(`QL_COUNT:${qlId}:${qlCounts.get(qlId) ?? 0}:${expected}`);
  }

  for (const qlId of ["GEO-RIV-001-QL-041", "GEO-RIV-001-QL-042"]) {
    const targets = new Set(GEO_RIV_001_CP005_REVIEW_BATCH_V2.filter((q) => q.qlId === qlId).map(pairTarget));
    if (targets.size !== 7) issues.push(`PAIR_TARGET_DIVERSITY:${qlId}:${targets.size}:7`);
  }

  const corpusText = GEO_RIV_001_CP005_REVIEW_BATCH_V2.map((q) => `${q.stem}\n${q.canonicalAnswer}\n${q.explanation}`).join("\n");
  for (const river of ["Godavari", "Krishna", "Mahanadi", "Cauvery", "Pennar", "Brahmani", "Baitarani", "Subarnarekha"]) {
    if (!corpusText.includes(river)) issues.push(`MISSING_CORE_SYSTEM:${river}`);
  }
  for (const chain of ["Wardha + Wainganga → Pranhita → Godavari", "Tunga + Bhadra → Tungabhadra → Krishna", "Sankh + Koel → Brahmani → Bay of Bengal"]) {
    if (!GEO_RIV_001_CP005_REVIEW_BATCH_V2.some((q) => q.canonicalAnswer === chain)) issues.push(`MISSING_FORMATION_CHAIN:${chain}`);
  }
  for (const parent of ["Godavari", "Krishna", "Mahanadi", "Cauvery", "Pennar"]) {
    if (!GEO_RIV_001_CP005_REVIEW_BATCH_V2.some((q) => q.qlId === "GEO-RIV-001-QL-039" && q.stem.includes(`${parent}?`))) issues.push(`MISSING_BANK_SYSTEM:${parent}`);
  }
  for (const index of [0, 1, 2, 3]) if ((answerPositions.get(index) ?? 0) < 5) issues.push(`WEAK_ANSWER_POSITION:${index}`);

  return {
    valid: issues.length === 0,
    questionCount: GEO_RIV_001_CP005_REVIEW_BATCH_V2.length,
    semanticUniqueCount: semantic.size,
    qlCounts: Object.fromEntries(qlCounts),
    difficultyCounts: Object.fromEntries(difficultyCounts),
    answerPositions: Object.fromEntries(answerPositions),
    issues,
  };
}
