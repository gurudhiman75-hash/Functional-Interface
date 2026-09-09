import { generateGeoRiv001Cp002ReviewV3 } from "./geo-riv-001-cp002-review-generator-v3";
import type { GeoRiv001Cp002ReviewQuestion } from "./geo-riv-001-cp002-review-types";

const REVIEW_COUNTS: Record<string, number> = {
  "GEO-RIV-001-QL-010": 7,
  "GEO-RIV-001-QL-011": 6,
  "GEO-RIV-001-QL-012": 8,
  "GEO-RIV-001-QL-013": 5,
  "GEO-RIV-001-QL-014": 7,
  "GEO-RIV-001-QL-015": 7,
  "GEO-RIV-001-QL-016": 4,
  "GEO-RIV-001-QL-017": 5,
  "GEO-RIV-001-QL-018": 5,
};

type Predicate = (question: GeoRiv001Cp002ReviewQuestion) => boolean;

function semanticKey(question: GeoRiv001Cp002ReviewQuestion) {
  return [
    question.qlId,
    question.stem.replace(/\s+/g, " ").trim(),
    [...question.options].sort().join(" || "),
    question.canonicalAnswer,
  ].join(" | ");
}

function scan(qlId: string) {
  return Array.from({ length: 650 }, (_, index) =>
    generateGeoRiv001Cp002ReviewV3(
      qlId,
      `geo-riv-001-cp002-review-${qlId}-${String(index + 1).padStart(3, "0")}`,
    ),
  );
}

function select(qlId: string, count: number, required: readonly Predicate[] = []) {
  const candidates = scan(qlId);
  const selected: GeoRiv001Cp002ReviewQuestion[] = [];
  const semantic = new Set<string>();
  const directStems = new Set<string>();

  const canUse = (question: GeoRiv001Cp002ReviewQuestion) => {
    const key = semanticKey(question);
    if (semantic.has(key)) return false;
    if (["GEO-RIV-001-QL-010", "GEO-RIV-001-QL-011", "GEO-RIV-001-QL-012", "GEO-RIV-001-QL-013", "GEO-RIV-001-QL-016"].includes(qlId)) {
      const stem = question.stem.replace(/\s+/g, " ").trim();
      if (directStems.has(stem)) return false;
    }
    return true;
  };

  const add = (question: GeoRiv001Cp002ReviewQuestion) => {
    selected.push(question);
    semantic.add(semanticKey(question));
    directStems.add(question.stem.replace(/\s+/g, " ").trim());
  };

  for (const predicate of required) {
    const candidate = candidates.find((question) => canUse(question) && predicate(question));
    if (!candidate) throw new Error(`CP002 review batch could not satisfy ${qlId} required predicate`);
    add(candidate);
  }

  for (const candidate of candidates) {
    if (selected.length >= count) break;
    if (canUse(candidate)) add(candidate);
  }

  if (selected.length !== count) {
    throw new Error(`CP002 selected ${selected.length}/${count} questions for ${qlId}`);
  }
  return selected;
}

const REQUIRED: Record<string, Predicate[]> = {
  "GEO-RIV-001-QL-013": [
    (q) => q.canonicalAnswer === "Chandra and Bhaga",
    (q) => q.canonicalAnswer === "Tandi",
    (q) => q.canonicalAnswer === "Trimmu",
    (q) => q.canonicalAnswer === "Harike",
    (q) => q.canonicalAnswer === "Panjnad",
  ],
  "GEO-RIV-001-QL-016": [
    (q) => q.canonicalAnswer === "Satluj",
    (q) => q.canonicalAnswer === "Jhelum and Ravi",
    (q) => q.canonicalAnswer === "Chenab",
    (q) => q.canonicalAnswer === "Beas → Satluj → Chenab",
  ],
  "GEO-RIV-001-QL-017": [
    (q) => q.canonicalAnswer === "Both Statement I and Statement II are correct",
    (q) => q.canonicalAnswer === "Only Statement I is correct",
    (q) => q.canonicalAnswer === "Only Statement II is correct",
    (q) => q.canonicalAnswer === "Neither Statement I nor Statement II is correct",
  ],
  "GEO-RIV-001-QL-018": [
    (q) => q.canonicalAnswer === "None",
    (q) => q.canonicalAnswer === "One",
    (q) => q.canonicalAnswer === "Two",
    (q) => q.canonicalAnswer === "Three",
  ],
};

export const GEO_RIV_001_CP002_REVIEW_BATCH_V1: GeoRiv001Cp002ReviewQuestion[] =
  Object.entries(REVIEW_COUNTS).flatMap(([qlId, count]) =>
    select(qlId, count, REQUIRED[qlId] ?? []),
  );

export function auditGeoRiv001Cp002ReviewBatchV1() {
  const issues: string[] = [];
  const semantic = new Set<string>();
  const qlCounts = new Map<string, number>();
  const difficultyCounts = new Map<string, number>();
  const answerPositions = new Map<number, number>();

  for (const question of GEO_RIV_001_CP002_REVIEW_BATCH_V1) {
    const key = semanticKey(question);
    if (semantic.has(key)) issues.push(`SEMANTIC_DUPLICATE:${question.questionId}`);
    semantic.add(key);
    qlCounts.set(question.qlId, (qlCounts.get(question.qlId) ?? 0) + 1);
    difficultyCounts.set(question.difficulty, (difficultyCounts.get(question.difficulty) ?? 0) + 1);
    answerPositions.set(question.correctIndex, (answerPositions.get(question.correctIndex) ?? 0) + 1);

    if (question.options.length !== 4) issues.push(`OPTION_COUNT:${question.questionId}`);
    if (new Set(question.options).size !== 4) issues.push(`DUPLICATE_OPTION:${question.questionId}`);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) {
      issues.push(`ANSWER_MISMATCH:${question.questionId}`);
    }
    if (!question.sourceIds.length || !question.sourceFactIds.length) {
      issues.push(`MISSING_PROVENANCE:${question.questionId}`);
    }
    if (question.explanation.length < 30) issues.push(`SHORT_EXPLANATION:${question.questionId}`);
    if (/matches the reviewed relation|approximately right angles|characteristic of this setting|exam trap|shortcut/i.test(`${question.stem}\n${question.explanation}`)) {
      issues.push(`EDITORIAL_LANGUAGE:${question.questionId}`);
    }
  }

  const expectedTotal = Object.values(REVIEW_COUNTS).reduce((sum, value) => sum + value, 0);
  if (GEO_RIV_001_CP002_REVIEW_BATCH_V1.length !== expectedTotal) {
    issues.push(`TOTAL_COUNT:${GEO_RIV_001_CP002_REVIEW_BATCH_V1.length}:${expectedTotal}`);
  }
  for (const [qlId, expected] of Object.entries(REVIEW_COUNTS)) {
    if ((qlCounts.get(qlId) ?? 0) !== expected) {
      issues.push(`QL_COUNT:${qlId}:${qlCounts.get(qlId) ?? 0}:${expected}`);
    }
  }

  for (const index of [0, 1, 2, 3]) {
    if ((answerPositions.get(index) ?? 0) < 5) issues.push(`WEAK_ANSWER_POSITION:${index}`);
  }

  for (const [qlId, requiredAnswers] of Object.entries({
    "GEO-RIV-001-QL-013": ["Chandra and Bhaga", "Tandi", "Trimmu", "Harike", "Panjnad"],
    "GEO-RIV-001-QL-016": ["Satluj", "Jhelum and Ravi", "Chenab", "Beas → Satluj → Chenab"],
    "GEO-RIV-001-QL-017": [
      "Both Statement I and Statement II are correct",
      "Only Statement I is correct",
      "Only Statement II is correct",
      "Neither Statement I nor Statement II is correct",
    ],
    "GEO-RIV-001-QL-018": ["None", "One", "Two", "Three"],
  })) {
    const answers = new Set(
      GEO_RIV_001_CP002_REVIEW_BATCH_V1
        .filter((question) => question.qlId === qlId)
        .map((question) => question.canonicalAnswer),
    );
    for (const answer of requiredAnswers) {
      if (!answers.has(answer)) issues.push(`MISSING_ANSWER_PATTERN:${qlId}:${answer}`);
    }
  }

  return {
    valid: issues.length === 0,
    questionCount: GEO_RIV_001_CP002_REVIEW_BATCH_V1.length,
    semanticUniqueCount: semantic.size,
    qlCounts: Object.fromEntries(qlCounts),
    difficultyCounts: Object.fromEntries(difficultyCounts),
    answerPositions: Object.fromEntries(answerPositions),
    issues,
  };
}
