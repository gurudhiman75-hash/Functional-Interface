import type { KnowledgeFact } from "../../types";
import { GEO_RIV_001_CP001_REVIEWABLE_FACTS_V2 } from "./geo-riv-001-cp001-editorial-review-v2";
import { auditGeoRiv001Cp001ReviewBatchV2F } from "./geo-riv-001-cp001-review-batch-v2f";
import { generateGeoRiv001Cp001ReviewV2G } from "./geo-riv-001-cp001-review-generator-v2g";
import type { GeoRiv001Cp001ReviewQuestion } from "./geo-riv-001-cp001-review-types";

const FACT_BY_ID = new Map(
  GEO_RIV_001_CP001_REVIEWABLE_FACTS_V2.map((fact) => [fact.factId, fact]),
);

const REVIEW_COUNTS: Record<string, number> = {
  "GEO-RIV-001-QL-001": 3,
  "GEO-RIV-001-QL-002": 3,
  "GEO-RIV-001-QL-003": 4,
  "GEO-RIV-001-QL-004": 4,
  "GEO-RIV-001-QL-005": 10,
  "GEO-RIV-001-QL-006": 9,
  "GEO-RIV-001-QL-007": 9,
  "GEO-RIV-001-QL-008": 6,
  "GEO-RIV-001-QL-009": 6,
};

type Predicate = (question: GeoRiv001Cp001ReviewQuestion) => boolean;

function factsForQuestion(question: GeoRiv001Cp001ReviewQuestion) {
  return question.sourceFactIds
    .map((factId) => FACT_BY_ID.get(factId))
    .filter((fact): fact is KnowledgeFact => Boolean(fact));
}

function hasRelation(question: GeoRiv001Cp001ReviewQuestion, relation: string) {
  return factsForQuestion(question).some((fact) => fact.relation === relation);
}

function semanticKey(question: GeoRiv001Cp001ReviewQuestion) {
  if (["GEO-RIV-001-QL-001", "GEO-RIV-001-QL-002", "GEO-RIV-001-QL-003", "GEO-RIV-001-QL-004"].includes(question.qlId)) {
    return `${question.qlId}|${question.canonicalAnswer}`;
  }
  if (question.qlId === "GEO-RIV-001-QL-005") {
    const target = factsForQuestion(question).find((fact) => fact.entity.label.en === question.canonicalAnswer);
    return `${question.qlId}|${target?.relation ?? "unknown"}|${question.canonicalAnswer}`;
  }
  if (question.qlId === "GEO-RIV-001-QL-006" || question.qlId === "GEO-RIV-001-QL-007") {
    return `${question.qlId}|${question.canonicalAnswer}`;
  }
  return `${question.qlId}|${question.stem.replace(/\s+/g, " ").trim()}|${question.canonicalAnswer}`;
}

function scan(qlId: string) {
  return Array.from({ length: 420 }, (_, index) =>
    generateGeoRiv001Cp001ReviewV2G(
      qlId,
      `geo-riv-001-cp001-v2g-${qlId}-scan-${String(index + 1).padStart(3, "0")}`,
    ),
  );
}

function select(qlId: string, count: number, required: readonly Predicate[]) {
  const candidates = scan(qlId);
  const selected: GeoRiv001Cp001ReviewQuestion[] = [];
  const semantic = new Set<string>();

  const canUse = (question: GeoRiv001Cp001ReviewQuestion) => !semantic.has(semanticKey(question));
  const add = (question: GeoRiv001Cp001ReviewQuestion) => {
    selected.push(question);
    semantic.add(semanticKey(question));
  };

  for (const predicate of required) {
    const candidate = candidates.find((question) => canUse(question) && predicate(question));
    if (!candidate) throw new Error(`GEO-RIV-001 V2G could not satisfy required ${qlId} review predicate`);
    add(candidate);
  }

  for (const candidate of candidates) {
    if (selected.length >= count) break;
    if (canUse(candidate)) add(candidate);
  }

  if (selected.length !== count) {
    throw new Error(`GEO-RIV-001 V2G selected ${selected.length}/${count} questions for ${qlId}`);
  }
  return selected;
}

const PATTERNS = [
  "Dendritic drainage pattern",
  "Trellis drainage pattern",
  "Rectangular drainage pattern",
  "Radial drainage pattern",
];

const REQUIRED: Record<string, Predicate[]> = {
  "GEO-RIV-001-QL-001": [
    (q) => q.canonicalAnswer === "Drainage",
    (q) => q.canonicalAnswer === "Drainage basin",
    (q) => q.canonicalAnswer === "Water divide",
  ],
  "GEO-RIV-001-QL-002": [
    (q) => q.canonicalAnswer === "the river system of an area",
    (q) => q.canonicalAnswer === "the area drained by a river and its tributaries",
    (q) => q.canonicalAnswer === "a highland that separates two drainage basins",
  ],
  "GEO-RIV-001-QL-003": PATTERNS.map(
    (pattern) => (q: GeoRiv001Cp001ReviewQuestion) => q.canonicalAnswer === pattern,
  ),
  "GEO-RIV-001-QL-004": PATTERNS.map(
    (pattern) => (q: GeoRiv001Cp001ReviewQuestion) => q.canonicalAnswer === pattern,
  ),
  "GEO-RIV-001-QL-005": [
    (q) => hasRelation(q, "classified_as_river_group"),
    (q) => hasRelation(q, "has_flow_direction"),
    (q) => hasRelation(q, "drains_into"),
    (q) => hasRelation(q, "has_mouth_type"),
  ],
  "GEO-RIV-001-QL-006": [
    (q) => hasRelation(q, "classified_as_river_group"),
    (q) => hasRelation(q, "has_flow_direction"),
    (q) => hasRelation(q, "drains_into"),
    (q) => hasRelation(q, "has_mouth_type"),
  ],
  "GEO-RIV-001-QL-007": [
    (q) => hasRelation(q, "classified_as_river_group"),
    (q) => hasRelation(q, "has_flow_direction"),
    (q) => hasRelation(q, "drains_into"),
    (q) => hasRelation(q, "has_mouth_type"),
  ],
  "GEO-RIV-001-QL-008": [
    (q) => q.canonicalAnswer === "Both Statement I and Statement II are correct",
    (q) => q.canonicalAnswer === "Only Statement I is correct",
    (q) => q.canonicalAnswer === "Only Statement II is correct",
    (q) => q.canonicalAnswer === "Neither Statement I nor Statement II is correct",
    (q) => hasRelation(q, "has_group_characteristic"),
  ],
  "GEO-RIV-001-QL-009": [
    (q) => q.canonicalAnswer === "None",
    (q) => q.canonicalAnswer === "One",
    (q) => q.canonicalAnswer === "Two",
    (q) => q.canonicalAnswer === "Three",
    (q) => hasRelation(q, "has_group_characteristic"),
  ],
};

export const GEO_RIV_001_CP001_REVIEW_BATCH_V2G: GeoRiv001Cp001ReviewQuestion[] =
  Object.entries(REVIEW_COUNTS).flatMap(([qlId, count]) =>
    select(qlId, count, REQUIRED[qlId] ?? []),
  );

export function auditGeoRiv001Cp001ReviewBatchV2G() {
  const baseline = auditGeoRiv001Cp001ReviewBatchV2F(
    GEO_RIV_001_CP001_REVIEW_BATCH_V2G,
  );
  const issues = [...baseline.issues];
  const semantic = new Set<string>();
  const perQlAnswerCounts = new Map<string, Map<string, number>>();

  for (const question of GEO_RIV_001_CP001_REVIEW_BATCH_V2G) {
    const key = semanticKey(question);
    if (semantic.has(key)) issues.push(`EDITORIAL_SEMANTIC_DUPLICATE:${question.questionId}`);
    semantic.add(key);

    const answerCounts = perQlAnswerCounts.get(question.qlId) ?? new Map<string, number>();
    answerCounts.set(question.canonicalAnswer, (answerCounts.get(question.canonicalAnswer) ?? 0) + 1);
    perQlAnswerCounts.set(question.qlId, answerCounts);

    if (/is correct because it is|Therefore, .* is the correct option\.?$/i.test(question.explanation)) {
      issues.push(`TAUTOLOGICAL_EXPLANATION:${question.questionId}`);
    }
    if (/The following description refers to which drainage pattern/i.test(question.stem)) {
      issues.push(`MECHANICAL_PATTERN_STEM:${question.questionId}`);
    }

    const visibleText = [question.stem, ...question.options, question.explanation].join(" ");
    if (/approximately right angles|characteristic of this setting|strongly rain-fed|river-association|land area contributing water/i.test(visibleText)) {
      issues.push(`OVERLY_TEXTBOOK_LANGUAGE:${question.questionId}`);
    }
  }

  const expectedCounts = Object.values(REVIEW_COUNTS).reduce((sum, value) => sum + value, 0);
  if (GEO_RIV_001_CP001_REVIEW_BATCH_V2G.length !== expectedCounts) {
    issues.push(`REVIEW_COUNT_MISMATCH:${GEO_RIV_001_CP001_REVIEW_BATCH_V2G.length}:${expectedCounts}`);
  }

  for (const qlId of ["GEO-RIV-001-QL-001", "GEO-RIV-001-QL-002"]) {
    const counts = perQlAnswerCounts.get(qlId);
    if (!counts || [...counts.values()].some((count) => count !== 1)) {
      issues.push(`DIRECT_DEFINITION_TARGET_REPETITION:${qlId}`);
    }
  }
  for (const qlId of ["GEO-RIV-001-QL-003", "GEO-RIV-001-QL-004"]) {
    const counts = perQlAnswerCounts.get(qlId);
    if (!counts || counts.size !== 4 || [...counts.values()].some((count) => count !== 1)) {
      issues.push(`PATTERN_TARGET_REPETITION:${qlId}`);
    }
  }

  return {
    ...baseline,
    valid: issues.length === 0,
    questionCount: GEO_RIV_001_CP001_REVIEW_BATCH_V2G.length,
    editorialSemanticUniqueCount: semantic.size,
    reviewCounts: REVIEW_COUNTS,
    issues,
  };
}
