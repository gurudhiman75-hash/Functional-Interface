import type { KnowledgeFact } from "../../types";
import { GEO_RIV_001_CP001_REVIEWABLE_FACTS } from "./geo-riv-001-cp001-editorial-review";
import { GEO_RIV_001_CP001_RELATION_EXPANSION_V2 } from "./geo-riv-001-cp001-relation-expansion-v2";

const REVIEWED_AT = "2026-09-09T08:20:00.000Z";
const REVIEWED_BY = "GEO_RIV_001_CP001_SOURCE_EDITORIAL_REVIEW_V2";

const DEPRECATED_V1_RELATIONS = new Set(["flows_westward", "drains_into"]);

/**
 * V2 replaces the three narrow V1 directional/outfall candidates with a
 * normalized relation family covering east/west flow, sea outfall, mouth type
 * and river-group characteristics. The V1 candidates remain in source history
 * but do not enter the V2 review generator.
 */
const V1_FOUNDATION_FOR_V2 = GEO_RIV_001_CP001_REVIEWABLE_FACTS.filter(
  (fact) => !DEPRECATED_V1_RELATIONS.has(fact.relation),
);

export const GEO_RIV_001_CP001_REVIEWABLE_FACTS_V2: KnowledgeFact[] = [
  ...V1_FOUNDATION_FOR_V2,
  ...GEO_RIV_001_CP001_RELATION_EXPANSION_V2,
];

export const GEO_RIV_001_CP001_APPROVED_FACTS_V2: KnowledgeFact[] =
  GEO_RIV_001_CP001_REVIEWABLE_FACTS_V2.map((fact) => ({
    ...fact,
    review: {
      status: "APPROVED",
      confidence: Math.max(0.95, fact.review.confidence),
      reviewedBy: REVIEWED_BY,
      reviewedAt: REVIEWED_AT,
    },
    freshness: {
      ...fact.freshness,
      lastVerifiedAt: REVIEWED_AT,
    },
  }));

export function auditGeoRiv001Cp001EditorialReviewV2() {
  const issues: string[] = [];
  const factIds = new Set<string>();
  const semanticRelations = new Set<string>();

  for (const fact of GEO_RIV_001_CP001_REVIEWABLE_FACTS_V2) {
    if (factIds.has(fact.factId)) issues.push(`DUPLICATE_FACT_ID:${fact.factId}`);
    factIds.add(fact.factId);

    const valueKey = fact.value.kind === "entity_ref"
      ? fact.value.entityId
      : fact.value.kind === "text"
        ? fact.value.text.en.trim().toLowerCase()
        : JSON.stringify(fact.value);
    const semanticKey = `${fact.entityId}|${fact.relation}|${valueKey}`;
    if (semanticRelations.has(semanticKey)) {
      issues.push(`DUPLICATE_SEMANTIC_RELATION:${semanticKey}`);
    }
    semanticRelations.add(semanticKey);

    if (fact.review.status !== "REVIEW_REQUIRED") {
      issues.push(`REVIEW_POOL_FACT_NOT_BLOCKED:${fact.factId}`);
    }
    if (!fact.source.sourceId || !fact.source.title || !fact.source.locator) {
      issues.push(`INCOMPLETE_PROVENANCE:${fact.factId}`);
    }
  }

  for (const fact of GEO_RIV_001_CP001_APPROVED_FACTS_V2) {
    if (fact.review.status !== "APPROVED") {
      issues.push(`PROMOTED_FACT_NOT_APPROVED:${fact.factId}`);
    }
    if (
      fact.review.reviewedBy !== REVIEWED_BY ||
      fact.review.reviewedAt !== REVIEWED_AT
    ) {
      issues.push(`REVIEW_PROVENANCE_MISMATCH:${fact.factId}`);
    }
  }

  const relationCounts = GEO_RIV_001_CP001_REVIEWABLE_FACTS_V2.reduce<Record<string, number>>(
    (counts, fact) => {
      counts[fact.relation] = (counts[fact.relation] ?? 0) + 1;
      return counts;
    },
    {},
  );

  const expectedRelationMinimums: Record<string, number> = {
    defined_as: 3,
    drainage_pattern_defined_as: 4,
    classified_as_river_group: 9,
    has_flow_direction: 6,
    drains_into: 7,
    has_mouth_type: 6,
    has_group_characteristic: 2,
  };
  for (const [relation, minimum] of Object.entries(expectedRelationMinimums)) {
    if ((relationCounts[relation] ?? 0) < minimum) {
      issues.push(`RELATION_COVERAGE:${relation}:${relationCounts[relation] ?? 0}:minimum-${minimum}`);
    }
  }

  return {
    valid: issues.length === 0,
    reviewableFactCount: GEO_RIV_001_CP001_REVIEWABLE_FACTS_V2.length,
    approvedFactCount: GEO_RIV_001_CP001_APPROVED_FACTS_V2.length,
    relationCounts,
    issues,
  };
}
