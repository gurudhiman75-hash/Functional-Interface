import { validateKnowledgeFactEligibility } from "../../eligibility";
import type { KnowledgeFact } from "../../types";
import { GEO_RIV_001_SOURCE_AUTHORITIES } from "./geo-riv-001-source-authorities";

const EXPECTED_CHAPTER_ID = "GEO-RIV-001";
const EXPECTED_CP_ID = "GEO-RIV-001-CP001";
const ALLOWED_RELATIONS = new Set([
  "defined_as",
  "drainage_pattern_defined_as",
  "classified_as_river_group",
  "flows_westward",
  "drains_into",
]);

function normalizedValue(fact: KnowledgeFact) {
  switch (fact.value.kind) {
    case "text":
      return `text:${fact.value.text.en.trim().toLowerCase()}`;
    case "entity_ref":
      return `entity_ref:${fact.value.entityId}`;
    case "number":
      return `number:${fact.value.value}:${fact.value.unit ?? ""}`;
    case "date":
      return `date:${fact.value.isoDate}`;
    case "boolean":
      return `boolean:${fact.value.value}`;
  }
}

export function auditGeoRiv001Cp001Facts(facts: readonly KnowledgeFact[]) {
  const issues: string[] = [];
  const factIds = new Set<string>();
  const relationKeys = new Set<string>();
  const sourceIds = new Set(GEO_RIV_001_SOURCE_AUTHORITIES.map((source) => source.sourceId));

  for (const fact of facts) {
    if (factIds.has(fact.factId)) issues.push(`DUPLICATE_FACT_ID:${fact.factId}`);
    factIds.add(fact.factId);

    if (fact.chapterId !== EXPECTED_CHAPTER_ID) {
      issues.push(`WRONG_CHAPTER:${fact.factId}:${fact.chapterId}`);
    }
    if (fact.cpId !== EXPECTED_CP_ID) {
      issues.push(`WRONG_CP:${fact.factId}:${fact.cpId}`);
    }
    if (!ALLOWED_RELATIONS.has(fact.relation)) {
      issues.push(`UNSUPPORTED_RELATION:${fact.factId}:${fact.relation}`);
    }
    if (!sourceIds.has(fact.source.sourceId)) {
      issues.push(`UNKNOWN_SOURCE:${fact.factId}:${fact.source.sourceId}`);
    }
    if (!fact.source.locator?.trim()) {
      issues.push(`MISSING_SOURCE_LOCATOR:${fact.factId}`);
    }

    const relationKey = `${fact.entityId}|${fact.relation}|${normalizedValue(fact)}`;
    if (relationKeys.has(relationKey)) {
      issues.push(`DUPLICATE_RELATION:${relationKey}`);
    }
    relationKeys.add(relationKey);

    if (fact.review.status === "APPROVED") {
      issues.push(`PREMATURE_APPROVAL:${fact.factId}`);
    }
    if (fact.review.confidence < 0.9 || fact.review.confidence > 1) {
      issues.push(`CONFIDENCE_OUT_OF_REVIEW_RANGE:${fact.factId}`);
    }
    if (fact.freshness.class !== "IMMUTABLE") {
      issues.push(`UNEXPECTED_MUTABLE_CP001_FACT:${fact.factId}`);
    }

    if (
      fact.relation === "classified_as_river_group" &&
      fact.value.kind !== "entity_ref"
    ) {
      issues.push(`CLASSIFICATION_VALUE_NOT_ENTITY:${fact.factId}`);
    }
    if (
      fact.relation === "drains_into" &&
      fact.value.kind !== "entity_ref"
    ) {
      issues.push(`OUTFALL_VALUE_NOT_ENTITY:${fact.factId}`);
    }
    if (
      (fact.relation === "defined_as" ||
        fact.relation === "drainage_pattern_defined_as") &&
      fact.value.kind !== "text"
    ) {
      issues.push(`DEFINITION_VALUE_NOT_TEXT:${fact.factId}`);
    }
  }

  return {
    valid: issues.length === 0,
    factCount: facts.length,
    relationCount: relationKeys.size,
    issues,
  };
}

export function auditGeoRiv001Cp001PreFreezeEligibility(
  facts: readonly KnowledgeFact[],
  asOf = "2026-09-09T00:00:00.000Z",
) {
  const accidentallyEligible: string[] = [];
  const expectedReviewBlocked: string[] = [];
  const unexpectedIssues: string[] = [];

  for (const fact of facts) {
    const result = validateKnowledgeFactEligibility(fact, { asOf });
    if (result.eligible) {
      accidentallyEligible.push(fact.factId);
      continue;
    }

    const codes = new Set(result.issues.map((issue) => issue.code));
    if (codes.has("FACT_NOT_APPROVED")) {
      expectedReviewBlocked.push(fact.factId);
    }

    for (const issue of result.issues) {
      if (issue.code !== "FACT_NOT_APPROVED") {
        unexpectedIssues.push(`${fact.factId}:${issue.code}:${issue.field}`);
      }
    }
  }

  return {
    valid:
      accidentallyEligible.length === 0 &&
      unexpectedIssues.length === 0 &&
      expectedReviewBlocked.length === facts.length,
    accidentallyEligible,
    expectedReviewBlocked,
    unexpectedIssues,
  };
}
