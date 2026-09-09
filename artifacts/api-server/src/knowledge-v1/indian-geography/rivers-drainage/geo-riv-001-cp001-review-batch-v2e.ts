import type { KnowledgeFact, KnowledgeV1Difficulty } from "../../types";
import { GEO_RIV_001_CP001_REVIEWABLE_FACTS_V2 } from "./geo-riv-001-cp001-editorial-review-v2";
import { auditGeoRiv001Cp001ReviewBatchV2B } from "./geo-riv-001-cp001-review-batch-v2b";
import { generateGeoRiv001Cp001ReviewV2E } from "./geo-riv-001-cp001-review-generator-v2e";
import type { GeoRiv001Cp001ReviewQuestion } from "./geo-riv-001-cp001-review-types";

const FACT_BY_ID = new Map(
  GEO_RIV_001_CP001_REVIEWABLE_FACTS_V2.map((fact) => [fact.factId, fact]),
);

const REVIEW_COUNTS: Record<string, number> = {
  "GEO-RIV-001-QL-001": 4,
  "GEO-RIV-001-QL-002": 4,
  "GEO-RIV-001-QL-003": 6,
  "GEO-RIV-001-QL-004": 6,
  "GEO-RIV-001-QL-005": 8,
  "GEO-RIV-001-QL-006": 7,
  "GEO-RIV-001-QL-007": 7,
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

function hasEntityLabel(question: GeoRiv001Cp001ReviewQuestion, label: string) {
  return factsForQuestion(question).some((fact) => fact.entity.label.en === label);
}

function semanticSignature(question: GeoRiv001Cp001ReviewQuestion) {
  return `${question.qlId}|${question.stem.replace(/\s+/g, " ").trim()}|${question.canonicalAnswer}`;
}

function scanCandidates(qlId: string) {
  return Array.from({ length: 260 }, (_, index) =>
    generateGeoRiv001Cp001ReviewV2E(
      qlId,
      `geo-riv-001-cp001-v2e-${qlId}-scan-${String(index + 1).padStart(3, "0")}`,
    ),
  );
}

function selectQuestions(
  qlId: string,
  count: number,
  requiredPredicates: readonly Predicate[],
) {
  const candidates = scanCandidates(qlId);
  const selected: GeoRiv001Cp001ReviewQuestion[] = [];
  const usedIds = new Set<string>();
  const semantic = new Set<string>();
  const stemCounts = new Map<string, number>();

  const canUse = (question: GeoRiv001Cp001ReviewQuestion) => {
    if (usedIds.has(question.questionId)) return false;
    if (semantic.has(semanticSignature(question))) return false;
    if ((stemCounts.get(question.stem) ?? 0) >= 2) return false;
    return true;
  };

  const add = (question: GeoRiv001Cp001ReviewQuestion) => {
    selected.push(question);
    usedIds.add(question.questionId);
    semantic.add(semanticSignature(question));
    stemCounts.set(question.stem, (stemCounts.get(question.stem) ?? 0) + 1);
  };

  for (const predicate of requiredPredicates) {
    const candidate = candidates.find((question) => canUse(question) && predicate(question));
    if (!candidate) {
      throw new Error(`GEO-RIV-001 V2E could not satisfy required ${qlId} review predicate`);
    }
    add(candidate);
  }

  for (const candidate of candidates) {
    if (selected.length >= count) break;
    if (canUse(candidate)) add(candidate);
  }

  if (selected.length !== count) {
    throw new Error(`GEO-RIV-001 V2E selected ${selected.length}/${count} questions for ${qlId}`);
  }
  return selected;
}

const PATTERN_NAMES = [
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
    (q) => hasEntityLabel(q, "Drainage"),
    (q) => hasEntityLabel(q, "Drainage basin"),
    (q) => hasEntityLabel(q, "Water divide"),
  ],
  "GEO-RIV-001-QL-003": PATTERN_NAMES.map(
    (pattern) => (q: GeoRiv001Cp001ReviewQuestion) => q.canonicalAnswer === pattern,
  ),
  "GEO-RIV-001-QL-004": PATTERN_NAMES.map(
    (pattern) => (q: GeoRiv001Cp001ReviewQuestion) => q.canonicalAnswer === pattern,
  ),
  "GEO-RIV-001-QL-005": [
    (q) => q.stem.includes("Himalayan river"),
    (q) => q.stem.includes("Peninsular river") && !q.stem.includes("west-flowing"),
    (q) => q.stem.includes("west-flowing Peninsular river"),
    (q) => q.stem.includes("Arabian Sea"),
    (q) => q.stem.includes("Bay of Bengal"),
    (q) => q.stem.includes("estuary"),
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

export const GEO_RIV_001_CP001_REVIEW_BATCH_V2E: GeoRiv001Cp001ReviewQuestion[] =
  Object.entries(REVIEW_COUNTS).flatMap(([qlId, count]) =>
    selectQuestions(qlId, count, REQUIRED[qlId] ?? []),
  );

export function auditGeoRiv001Cp001ReviewBatchV2E() {
  const baseline = auditGeoRiv001Cp001ReviewBatchV2B(
    GEO_RIV_001_CP001_REVIEW_BATCH_V2E,
  );
  const issues = [...baseline.issues];
  const semantic = new Set<string>();

  for (const question of GEO_RIV_001_CP001_REVIEW_BATCH_V2E) {
    const signature = semanticSignature(question);
    if (semantic.has(signature)) issues.push(`SEMANTIC_DUPLICATE:${question.questionId}`);
    semantic.add(signature);

    const firstLetter = question.stem.match(/[A-Za-z]/)?.[0];
    if (firstLetter && firstLetter !== firstLetter.toUpperCase()) {
      issues.push(`LOWERCASE_STEM_OPENING:${question.questionId}`);
    }

    if (
      question.qlId === "GEO-RIV-001-QL-005" &&
      /matches the required classification|contrasting relation class/i.test(question.explanation)
    ) {
      issues.push(`GENERIC_CLASSIFICATION_EXPLANATION:${question.questionId}`);
    }

    if (
      question.qlId === "GEO-RIV-001-QL-008" ||
      question.qlId === "GEO-RIV-001-QL-009"
    ) {
      const riverEntities = factsForQuestion(question)
        .filter((fact) => fact.entityId.startsWith("geo:river:"))
        .map((fact) => fact.entityId);
      if (new Set(riverEntities).size !== riverEntities.length) {
        issues.push(`REPEATED_RIVER_IN_STATEMENTS:${question.questionId}`);
      }
    }
  }

  for (const qlId of ["GEO-RIV-001-QL-008", "GEO-RIV-001-QL-009"]) {
    const questions = GEO_RIV_001_CP001_REVIEW_BATCH_V2E.filter((q) => q.qlId === qlId);
    if (!questions.some((q) => hasRelation(q, "has_group_characteristic"))) {
      issues.push(`MISSING_GROUP_CHARACTERISTIC_SURFACE:${qlId}`);
    }
  }

  const expectedDifficultyCounts: Record<KnowledgeV1Difficulty, number> = {
    Easy: 16,
    Medium: 32,
    Hard: 6,
  };
  for (const [difficulty, expected] of Object.entries(expectedDifficultyCounts) as [
    KnowledgeV1Difficulty,
    number,
  ][]) {
    const actual = GEO_RIV_001_CP001_REVIEW_BATCH_V2E.filter(
      (question) => question.difficulty === difficulty,
    ).length;
    if (actual !== expected) issues.push(`V2E_DIFFICULTY:${difficulty}:${actual}:expected-${expected}`);
  }

  return {
    ...baseline,
    valid: issues.length === 0,
    semanticUniqueCount: semantic.size,
    issues,
  };
}
