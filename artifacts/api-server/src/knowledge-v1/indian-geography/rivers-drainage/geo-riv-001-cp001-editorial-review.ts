import type { KnowledgeFact } from "../../types";
import { GEO_RIV_001_CP001_ALL_CANDIDATES } from "./geo-riv-001-cp001-facts";

export type GeoRiv001Cp001EditorialDisposition = "APPROVE" | "HOLD" | "REJECT";

export type GeoRiv001Cp001EditorialDecision = {
  factId: string;
  disposition: GeoRiv001Cp001EditorialDisposition;
  reason: string;
};

const REVIEWED_AT = "2026-09-09T07:45:00.000Z";
const REVIEWED_BY = "GEO_RIV_001_CP001_SOURCE_EDITORIAL_REVIEW_V1";

const HELD_FACT_IDS = new Set([
  "geo-riv-001-cp001-concept-tributary",
  "geo-riv-001-cp001-concept-distributary",
]);

function decideFact(fact: KnowledgeFact): GeoRiv001Cp001EditorialDecision {
  if (HELD_FACT_IDS.has(fact.factId)) {
    return {
      factId: fact.factId,
      disposition: "HOLD",
      reason:
        "Keep the generic tributary/distributary definition outside the first freeze until an exact primary textbook locator is attached. River-system relation facts in later CPs will carry stronger CWC/India-WRIS provenance.",
    };
  }

  if (fact.source.sourceId === "NCERT-CONTEMPORARY-INDIA-I-DRAINAGE") {
    return {
      factId: fact.factId,
      disposition: "APPROVE",
      reason:
        "The Class IX NCERT Drainage authority supports the foundational term or drainage-pattern convention, and no answer-changing ambiguity was identified for the CP001 learner task.",
    };
  }

  if (fact.source.sourceId === "NCERT-SOCIAL-SCIENCE-TEACHER-MANUAL-KAVERI") {
    return {
      factId: fact.factId,
      disposition: "APPROVE",
      reason:
        "NCERT explicitly groups Indus, Ganga and Brahmaputra as major Himalayan rivers and Narmada, Tapi, Godavari, Mahanadi, Krishna and Kaveri as major Peninsular rivers.",
    };
  }

  if (
    fact.source.sourceId === "INDIA-WRIS-NARMADA-BASIN-V2" ||
    fact.source.sourceId === "INDIA-WRIS-GODAVARI-BASIN-V2"
  ) {
    return {
      factId: fact.factId,
      disposition: "APPROVE",
      reason:
        "The India-WRIS basin authority directly supports the durable direction/outfall relation encoded for this candidate.",
    };
  }

  return {
    factId: fact.factId,
    disposition: "HOLD",
    reason: "No explicit CP001 V1 editorial rule approved this source/relation combination.",
  };
}

export const GEO_RIV_001_CP001_EDITORIAL_DECISIONS =
  GEO_RIV_001_CP001_ALL_CANDIDATES.map(decideFact);

const DECISION_BY_FACT_ID = new Map(
  GEO_RIV_001_CP001_EDITORIAL_DECISIONS.map((decision) => [decision.factId, decision]),
);

export const GEO_RIV_001_CP001_REVIEWABLE_FACTS: KnowledgeFact[] =
  GEO_RIV_001_CP001_ALL_CANDIDATES.filter(
    (fact) => DECISION_BY_FACT_ID.get(fact.factId)?.disposition === "APPROVE",
  );

export const GEO_RIV_001_CP001_EDITORIALLY_APPROVED_FACTS: KnowledgeFact[] =
  GEO_RIV_001_CP001_REVIEWABLE_FACTS.map((fact) => ({
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

export function auditGeoRiv001Cp001EditorialReview() {
  const issues: string[] = [];
  const candidateIds = new Set(
    GEO_RIV_001_CP001_ALL_CANDIDATES.map((fact) => fact.factId),
  );
  const decisionIds = new Set<string>();

  for (const decision of GEO_RIV_001_CP001_EDITORIAL_DECISIONS) {
    if (decisionIds.has(decision.factId)) {
      issues.push(`DUPLICATE_EDITORIAL_DECISION:${decision.factId}`);
    }
    decisionIds.add(decision.factId);
    if (!candidateIds.has(decision.factId)) {
      issues.push(`UNKNOWN_EDITORIAL_FACT:${decision.factId}`);
    }
    if (!decision.reason.trim()) {
      issues.push(`EMPTY_EDITORIAL_REASON:${decision.factId}`);
    }
  }

  for (const factId of candidateIds) {
    if (!decisionIds.has(factId)) {
      issues.push(`MISSING_EDITORIAL_DECISION:${factId}`);
    }
  }

  for (const fact of GEO_RIV_001_CP001_EDITORIALLY_APPROVED_FACTS) {
    if (HELD_FACT_IDS.has(fact.factId)) {
      issues.push(`APPROVED_HELD_FACT:${fact.factId}`);
    }
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

  const count = (disposition: GeoRiv001Cp001EditorialDisposition) =>
    GEO_RIV_001_CP001_EDITORIAL_DECISIONS.filter(
      (decision) => decision.disposition === disposition,
    ).length;

  return {
    valid: issues.length === 0,
    totalFactCount: GEO_RIV_001_CP001_ALL_CANDIDATES.length,
    approvedFactCount: count("APPROVE"),
    heldFactCount: count("HOLD"),
    rejectedFactCount: count("REJECT"),
    promotedFactCount: GEO_RIV_001_CP001_EDITORIALLY_APPROVED_FACTS.length,
    issues,
  };
}
