import { generateGeoRiv001Cp004ReviewV2 } from "./geo-riv-001-cp004-review-generator-v2";
import type { GeoRiv001Cp004ReviewQuestion } from "./geo-riv-001-cp004-review-types";

const REVIEW_COUNTS: Record<string, number> = {
  "GEO-RIV-001-QL-028": 7,
  "GEO-RIV-001-QL-029": 6,
  "GEO-RIV-001-QL-030": 8,
  "GEO-RIV-001-QL-031": 5,
  "GEO-RIV-001-QL-032": 7,
  "GEO-RIV-001-QL-033": 7,
  "GEO-RIV-001-QL-034": 4,
  "GEO-RIV-001-QL-035": 6,
  "GEO-RIV-001-QL-036": 4,
};

type Predicate = (question: GeoRiv001Cp004ReviewQuestion) => boolean;

function semanticKey(question: GeoRiv001Cp004ReviewQuestion) {
  return [question.qlId, question.stem.replace(/\s+/g, " ").trim(), [...question.options].sort().join(" || "), question.canonicalAnswer].join(" | ");
}

function pairTarget(question: GeoRiv001Cp004ReviewQuestion) {
  if (!["GEO-RIV-001-QL-032", "GEO-RIV-001-QL-033"].includes(question.qlId)) return "";
  return question.canonicalAnswer.split(" — ")[0]?.trim() ?? "";
}

function scan(qlId: string) {
  return Array.from({ length: 1800 }, (_, index) =>
    generateGeoRiv001Cp004ReviewV2(qlId, `geo-riv-001-cp004-v2-review-${qlId}-${String(index + 1).padStart(4, "0")}`),
  );
}

function select(qlId: string, count: number, required: readonly Predicate[] = []) {
  const candidates = scan(qlId);
  const selected: GeoRiv001Cp004ReviewQuestion[] = [];
  const semantic = new Set<string>();
  const stems = new Set<string>();
  const pairTargets = new Set<string>();

  const canUse = (q: GeoRiv001Cp004ReviewQuestion) => {
    if (semantic.has(semanticKey(q))) return false;
    if (["GEO-RIV-001-QL-028", "GEO-RIV-001-QL-029", "GEO-RIV-001-QL-030", "GEO-RIV-001-QL-031", "GEO-RIV-001-QL-034"].includes(qlId)) {
      const stem = q.stem.replace(/\s+/g, " ").trim();
      if (stems.has(stem)) return false;
    }
    if (["GEO-RIV-001-QL-032", "GEO-RIV-001-QL-033"].includes(qlId)) {
      const target = pairTarget(q);
      if (!target || pairTargets.has(target)) return false;
    }
    return true;
  };

  const add = (q: GeoRiv001Cp004ReviewQuestion) => {
    selected.push(q);
    semantic.add(semanticKey(q));
    stems.add(q.stem.replace(/\s+/g, " ").trim());
    const target = pairTarget(q);
    if (target) pairTargets.add(target);
  };

  for (const predicate of required) {
    const candidate = candidates.find((q) => canUse(q) && predicate(q));
    if (!candidate) throw new Error(`CP004 V2 review batch could not satisfy ${qlId} required predicate`);
    add(candidate);
  }
  for (const candidate of candidates) {
    if (selected.length >= count) break;
    if (canUse(candidate)) add(candidate);
  }
  if (selected.length !== count) throw new Error(`CP004 V2 selected ${selected.length}/${count} questions for ${qlId}`);
  return selected;
}

const REQUIRED: Record<string, Predicate[]> = {
  "GEO-RIV-001-QL-030": [
    (q) => q.stem === "Which of the following is a north-bank tributary of the Brahmaputra in Assam?",
    (q) => q.stem === "Which of the following is a south-bank tributary of the Brahmaputra in Assam?",
    (q) => q.stem === "Which pair consists only of north-bank tributaries of the Brahmaputra?",
    (q) => q.stem === "Which pair consists only of south-bank tributaries of the Brahmaputra?",
  ],
  "GEO-RIV-001-QL-031": [
    (q) => q.canonicalAnswer === "Dibang and Lohit",
    (q) => q.canonicalAnswer === "Brahmaputra",
    (q) => q.canonicalAnswer === "Siang/Dihang",
    (q) => q.canonicalAnswer === "Bangladesh",
    (q) => q.canonicalAnswer === "Ganga/Padma",
  ],
  "GEO-RIV-001-QL-032": [
    (q) => q.canonicalAnswer === "Dibang — joins Siang/Dihang",
  ],
  "GEO-RIV-001-QL-034": [
    (q) => q.canonicalAnswer === "Tsangpo → Siang/Dihang → Brahmaputra → Jamuna",
    (q) => q.canonicalAnswer === "Ranganadi → Subansiri → Brahmaputra",
    (q) => q.canonicalAnswer === "Kameng → Jia Bharali → Brahmaputra",
    (q) => q.canonicalAnswer === "Teesta → Brahmaputra/Jamuna → Ganga/Padma",
  ],
  "GEO-RIV-001-QL-035": [
    (q) => q.canonicalAnswer === "Both Statement I and Statement II are correct",
    (q) => q.canonicalAnswer === "Only Statement I is correct",
    (q) => q.canonicalAnswer === "Only Statement II is correct",
    (q) => q.canonicalAnswer === "Neither Statement I nor Statement II is correct",
  ],
  "GEO-RIV-001-QL-036": [
    (q) => q.canonicalAnswer === "None",
    (q) => q.canonicalAnswer === "One",
    (q) => q.canonicalAnswer === "Two",
    (q) => q.canonicalAnswer === "Three",
  ],
};

export const GEO_RIV_001_CP004_REVIEW_BATCH_V2: GeoRiv001Cp004ReviewQuestion[] = Object.entries(REVIEW_COUNTS).flatMap(
  ([qlId, count]) => select(qlId, count, REQUIRED[qlId] ?? []),
);

export function auditGeoRiv001Cp004ReviewBatchV2() {
  const issues: string[] = [];
  const semantic = new Set<string>();
  const qlCounts = new Map<string, number>();
  const difficultyCounts = new Map<string, number>();
  const answerPositions = new Map<number, number>();

  for (const q of GEO_RIV_001_CP004_REVIEW_BATCH_V2) {
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
    if (q.explanation.length < 28) issues.push(`SHORT_EXPLANATION:${q.questionId}`);
    const visible = `${q.stem}\n${q.explanation}`;
    if (/matches the reviewed relation|associated with the source|exam trap|shortcut|characteristic of this setting|near\s+near|Therefore,|both banks|neither bank/i.test(visible)) issues.push(`EDITORIAL_LANGUAGE:${q.questionId}`);
    if (/largest river island in the world|current flood|current project/i.test(visible)) issues.push(`UNSTABLE_CONTENT:${q.questionId}`);
  }

  const expectedTotal = Object.values(REVIEW_COUNTS).reduce((sum, value) => sum + value, 0);
  if (GEO_RIV_001_CP004_REVIEW_BATCH_V2.length !== expectedTotal) issues.push(`TOTAL_COUNT:${GEO_RIV_001_CP004_REVIEW_BATCH_V2.length}:${expectedTotal}`);
  for (const [qlId, expected] of Object.entries(REVIEW_COUNTS)) {
    if ((qlCounts.get(qlId) ?? 0) !== expected) issues.push(`QL_COUNT:${qlId}:${qlCounts.get(qlId) ?? 0}:${expected}`);
  }

  for (const qlId of ["GEO-RIV-001-QL-032", "GEO-RIV-001-QL-033"]) {
    const targets = new Set(GEO_RIV_001_CP004_REVIEW_BATCH_V2.filter((q) => q.qlId === qlId).map(pairTarget));
    if (targets.size !== REVIEW_COUNTS[qlId]) issues.push(`PAIR_TARGET_DIVERSITY:${qlId}:${targets.size}:${REVIEW_COUNTS[qlId]}`);
  }

  const bankStems = new Set(GEO_RIV_001_CP004_REVIEW_BATCH_V2.filter((q) => q.qlId === "GEO-RIV-001-QL-030").map((q) => q.stem));
  for (const stem of [
    "Which of the following is a north-bank tributary of the Brahmaputra in Assam?",
    "Which of the following is a south-bank tributary of the Brahmaputra in Assam?",
    "Which pair consists only of north-bank tributaries of the Brahmaputra?",
    "Which pair consists only of south-bank tributaries of the Brahmaputra?",
  ]) if (!bankStems.has(stem)) issues.push(`MISSING_BANK_MODE:${stem}`);

  for (const answer of ["Dibang and Lohit", "Brahmaputra", "Siang/Dihang", "Bangladesh", "Ganga/Padma"]) {
    if (!GEO_RIV_001_CP004_REVIEW_BATCH_V2.some((q) => q.qlId === "GEO-RIV-001-QL-031" && q.canonicalAnswer === answer)) issues.push(`MISSING_CONFLUENCE_MODE:${answer}`);
  }

  for (const answer of [
    "Tsangpo → Siang/Dihang → Brahmaputra → Jamuna",
    "Ranganadi → Subansiri → Brahmaputra",
    "Kameng → Jia Bharali → Brahmaputra",
    "Teesta → Brahmaputra/Jamuna → Ganga/Padma",
  ]) {
    if (!GEO_RIV_001_CP004_REVIEW_BATCH_V2.some((q) => q.qlId === "GEO-RIV-001-QL-034" && q.canonicalAnswer === answer)) issues.push(`MISSING_CHAIN_MODE:${answer}`);
  }

  for (const index of [0, 1, 2, 3]) if ((answerPositions.get(index) ?? 0) < 5) issues.push(`WEAK_ANSWER_POSITION:${index}`);

  return {
    valid: issues.length === 0,
    questionCount: GEO_RIV_001_CP004_REVIEW_BATCH_V2.length,
    semanticUniqueCount: semantic.size,
    qlCounts: Object.fromEntries(qlCounts),
    difficultyCounts: Object.fromEntries(difficultyCounts),
    answerPositions: Object.fromEntries(answerPositions),
    issues,
  };
}
