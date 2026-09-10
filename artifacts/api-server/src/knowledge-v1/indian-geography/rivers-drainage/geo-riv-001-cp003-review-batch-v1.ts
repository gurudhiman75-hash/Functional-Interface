import { generateGeoRiv001Cp003ReviewV1 } from "./geo-riv-001-cp003-review-generator-v1";
import type { GeoRiv001Cp003ReviewQuestion } from "./geo-riv-001-cp003-review-types";

const REVIEW_COUNTS: Record<string, number> = {
  "GEO-RIV-001-QL-019": 7,
  "GEO-RIV-001-QL-020": 6,
  "GEO-RIV-001-QL-021": 8,
  "GEO-RIV-001-QL-022": 5,
  "GEO-RIV-001-QL-023": 7,
  "GEO-RIV-001-QL-024": 7,
  "GEO-RIV-001-QL-025": 4,
  "GEO-RIV-001-QL-026": 5,
  "GEO-RIV-001-QL-027": 5,
};

type Predicate = (question: GeoRiv001Cp003ReviewQuestion) => boolean;

function semanticKey(question: GeoRiv001Cp003ReviewQuestion) {
  return [
    question.qlId,
    question.stem.replace(/\s+/g, " ").trim(),
    [...question.options].sort().join(" || "),
    question.canonicalAnswer,
  ].join(" | ");
}

function pairTargetRiver(question: GeoRiv001Cp003ReviewQuestion) {
  if (!["GEO-RIV-001-QL-023", "GEO-RIV-001-QL-024"].includes(question.qlId)) return "";
  return question.canonicalAnswer.split(" — ")[0]?.trim() ?? "";
}

function scan(qlId: string) {
  return Array.from({ length: 900 }, (_, index) =>
    generateGeoRiv001Cp003ReviewV1(
      qlId,
      `geo-riv-001-cp003-review-${qlId}-${String(index + 1).padStart(3, "0")}`,
    ),
  );
}

function select(qlId: string, count: number, required: readonly Predicate[] = []) {
  const candidates = scan(qlId);
  const selected: GeoRiv001Cp003ReviewQuestion[] = [];
  const semantic = new Set<string>();
  const directStems = new Set<string>();
  const pairTargets = new Set<string>();

  const canUse = (question: GeoRiv001Cp003ReviewQuestion) => {
    const key = semanticKey(question);
    if (semantic.has(key)) return false;
    if (["GEO-RIV-001-QL-019", "GEO-RIV-001-QL-020", "GEO-RIV-001-QL-021", "GEO-RIV-001-QL-022", "GEO-RIV-001-QL-025"].includes(qlId)) {
      const stem = question.stem.replace(/\s+/g, " ").trim();
      if (directStems.has(stem)) return false;
    }
    if (["GEO-RIV-001-QL-023", "GEO-RIV-001-QL-024"].includes(qlId)) {
      const target = pairTargetRiver(question);
      if (!target || pairTargets.has(target)) return false;
    }
    return true;
  };

  const add = (question: GeoRiv001Cp003ReviewQuestion) => {
    selected.push(question);
    semantic.add(semanticKey(question));
    directStems.add(question.stem.replace(/\s+/g, " ").trim());
    const target = pairTargetRiver(question);
    if (target) pairTargets.add(target);
  };

  for (const predicate of required) {
    const candidate = candidates.find((question) => canUse(question) && predicate(question));
    if (!candidate) throw new Error(`CP003 review batch could not satisfy ${qlId} required predicate`);
    add(candidate);
  }

  for (const candidate of candidates) {
    if (selected.length >= count) break;
    if (canUse(candidate)) add(candidate);
  }

  if (selected.length !== count) {
    throw new Error(`CP003 selected ${selected.length}/${count} questions for ${qlId}`);
  }
  return selected;
}

const REQUIRED: Record<string, Predicate[]> = {
  "GEO-RIV-001-QL-022": [
    (q) => q.canonicalAnswer === "Vishnuprayag",
    (q) => q.canonicalAnswer === "Nandprayag",
    (q) => q.canonicalAnswer === "Karnaprayag",
    (q) => q.canonicalAnswer === "Rudraprayag",
    (q) => q.canonicalAnswer === "Devprayag",
  ],
  "GEO-RIV-001-QL-025": [
    (q) => q.canonicalAnswer === "Bhagirathi + Alaknanda → Devprayag → Ganga",
    (q) => q.canonicalAnswer === "Chambal → Yamuna → Ganga",
    (q) => q.canonicalAnswer === "Vishnuprayag → Nandprayag → Karnaprayag → Rudraprayag → Devprayag",
    (q) => q.canonicalAnswer === "Sun Kosi + Arun Kosi + Tamur Kosi → Kosi → Ganga",
  ],
  "GEO-RIV-001-QL-026": [
    (q) => q.canonicalAnswer === "Both Statement I and Statement II are correct",
    (q) => q.canonicalAnswer === "Only Statement I is correct",
    (q) => q.canonicalAnswer === "Only Statement II is correct",
    (q) => q.canonicalAnswer === "Neither Statement I nor Statement II is correct",
  ],
  "GEO-RIV-001-QL-027": [
    (q) => q.canonicalAnswer === "None",
    (q) => q.canonicalAnswer === "One",
    (q) => q.canonicalAnswer === "Two",
    (q) => q.canonicalAnswer === "Three",
  ],
};

export const GEO_RIV_001_CP003_REVIEW_BATCH_V1: GeoRiv001Cp003ReviewQuestion[] =
  Object.entries(REVIEW_COUNTS).flatMap(([qlId, count]) =>
    select(qlId, count, REQUIRED[qlId] ?? []),
  );

export function auditGeoRiv001Cp003ReviewBatchV1() {
  const issues: string[] = [];
  const semantic = new Set<string>();
  const qlCounts = new Map<string, number>();
  const difficultyCounts = new Map<string, number>();
  const answerPositions = new Map<number, number>();

  for (const q of GEO_RIV_001_CP003_REVIEW_BATCH_V1) {
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
    if (q.explanation.length < 30) issues.push(`SHORT_EXPLANATION:${q.questionId}`);
    if (/matches the reviewed relation|associated with the source|exam trap|shortcut|near\s+near|Therefore,|characteristic of this setting/i.test(`${q.stem}\n${q.explanation}`)) {
      issues.push(`EDITORIAL_LANGUAGE:${q.questionId}`);
    }
    if (/Saraswati/i.test(`${q.stem}\n${q.options.join(" ")}\n${q.explanation}`)) {
      issues.push(`MYTHOLOGY_AS_GEOGRAPHY:${q.questionId}`);
    }
  }

  const expectedTotal = Object.values(REVIEW_COUNTS).reduce((sum, value) => sum + value, 0);
  if (GEO_RIV_001_CP003_REVIEW_BATCH_V1.length !== expectedTotal) {
    issues.push(`TOTAL_COUNT:${GEO_RIV_001_CP003_REVIEW_BATCH_V1.length}:${expectedTotal}`);
  }
  for (const [qlId, expected] of Object.entries(REVIEW_COUNTS)) {
    if ((qlCounts.get(qlId) ?? 0) !== expected) issues.push(`QL_COUNT:${qlId}:${qlCounts.get(qlId) ?? 0}:${expected}`);
  }

  for (const qlId of ["GEO-RIV-001-QL-023", "GEO-RIV-001-QL-024"]) {
    const targets = new Set(
      GEO_RIV_001_CP003_REVIEW_BATCH_V1.filter((q) => q.qlId === qlId).map(pairTargetRiver),
    );
    if (targets.size !== REVIEW_COUNTS[qlId]) {
      issues.push(`PAIR_TARGET_DIVERSITY:${qlId}:${targets.size}:${REVIEW_COUNTS[qlId]}`);
    }
  }

  for (const index of [0, 1, 2, 3]) {
    if ((answerPositions.get(index) ?? 0) < 5) issues.push(`WEAK_ANSWER_POSITION:${index}`);
  }

  for (const [qlId, answers] of Object.entries({
    "GEO-RIV-001-QL-022": ["Vishnuprayag", "Nandprayag", "Karnaprayag", "Rudraprayag", "Devprayag"],
    "GEO-RIV-001-QL-025": [
      "Bhagirathi + Alaknanda → Devprayag → Ganga",
      "Chambal → Yamuna → Ganga",
      "Vishnuprayag → Nandprayag → Karnaprayag → Rudraprayag → Devprayag",
      "Sun Kosi + Arun Kosi + Tamur Kosi → Kosi → Ganga",
    ],
    "GEO-RIV-001-QL-026": [
      "Both Statement I and Statement II are correct",
      "Only Statement I is correct",
      "Only Statement II is correct",
      "Neither Statement I nor Statement II is correct",
    ],
    "GEO-RIV-001-QL-027": ["None", "One", "Two", "Three"],
  })) {
    const actual = new Set(
      GEO_RIV_001_CP003_REVIEW_BATCH_V1.filter((q) => q.qlId === qlId).map((q) => q.canonicalAnswer),
    );
    for (const answer of answers) if (!actual.has(answer)) issues.push(`MISSING_ANSWER_PATTERN:${qlId}:${answer}`);
  }

  return {
    valid: issues.length === 0,
    questionCount: GEO_RIV_001_CP003_REVIEW_BATCH_V1.length,
    semanticUniqueCount: semantic.size,
    qlCounts: Object.fromEntries(qlCounts),
    difficultyCounts: Object.fromEntries(difficultyCounts),
    answerPositions: Object.fromEntries(answerPositions),
    issues,
  };
}
