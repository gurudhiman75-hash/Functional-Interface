import type { KnowledgeFact } from "../../types";
import { GEO_RIV_001_CP002_REVIEWABLE_FACTS_V1 } from "./geo-riv-001-cp002-editorial-review-v1";
import {
  GEO_RIV_001_SOURCE_AUTHORITIES,
  auditGeoRiv001SourceAuthorities,
} from "./geo-riv-001-source-authorities";

const EXPECTED_MAIN_TRIBUTARIES = new Set(["Jhelum", "Chenab", "Ravi", "Beas", "Satluj"]);
const FORBIDDEN_STATIC_TERMS = [
  /current[_ -]?treaty/i,
  /treaty[_ -]?status/i,
  /current[_ -]?policy/i,
  /project[_ -]?status/i,
  /political[_ -]?status/i,
];

export function auditGeoRiv001Cp002Facts(
  facts: readonly KnowledgeFact[] = GEO_RIV_001_CP002_REVIEWABLE_FACTS_V1,
) {
  const issues: string[] = [];
  const factIds = new Set<string>();
  const sourceIds = new Set(GEO_RIV_001_SOURCE_AUTHORITIES.map((source) => source.sourceId));
  const entityIds = new Set<string>();
  const relationCounts = new Map<string, number>();

  const sourceAudit = auditGeoRiv001SourceAuthorities();
  if (!sourceAudit.valid) {
    issues.push(...sourceAudit.issues.map((issue) => `SOURCE_AUTHORITY:${issue}`));
  }

  for (const fact of facts) {
    if (factIds.has(fact.factId)) issues.push(`DUPLICATE_FACT_ID:${fact.factId}`);
    factIds.add(fact.factId);
    entityIds.add(fact.entityId);
    relationCounts.set(fact.relation, (relationCounts.get(fact.relation) ?? 0) + 1);

    if (fact.chapterId !== "GEO-RIV-001") issues.push(`WRONG_CHAPTER:${fact.factId}`);
    if (fact.cpId !== "GEO-RIV-001-CP002") issues.push(`WRONG_CP:${fact.factId}`);
    if (fact.subject !== "Static GK — Indian Geography") issues.push(`WRONG_SUBJECT:${fact.factId}`);
    if (fact.review.status !== "REVIEW_REQUIRED") issues.push(`NOT_REVIEW_BLOCKED:${fact.factId}`);
    if (fact.freshness.class !== "IMMUTABLE") issues.push(`NON_STATIC_FRESHNESS:${fact.factId}`);
    if (!fact.source.locator?.trim()) issues.push(`MISSING_SOURCE_LOCATOR:${fact.factId}`);
    if (!sourceIds.has(fact.source.sourceId)) issues.push(`UNKNOWN_SOURCE:${fact.factId}:${fact.source.sourceId}`);
    if (fact.value.kind === "number" || fact.value.kind === "date") {
      issues.push(`UNSTABLE_PRECISION_VALUE:${fact.factId}`);
    }
    if (
      fact.value.kind === "entity_ref" &&
      /chenab-headstream|synthetic/i.test(fact.value.entityId)
    ) {
      issues.push(`SYNTHETIC_RIVER_PARENT:${fact.factId}`);
    }

    const searchable = [fact.relation, ...fact.tags].join(" ");
    for (const forbidden of FORBIDDEN_STATIC_TERMS) {
      if (forbidden.test(searchable)) issues.push(`FORBIDDEN_CURRENT_POLICY_FACT:${fact.factId}`);
    }
  }

  const mainTributaries = facts
    .filter((fact) => fact.relation === "main_tributary_of")
    .map((fact) => fact.entity.label.en);
  if (mainTributaries.length !== EXPECTED_MAIN_TRIBUTARIES.size) {
    issues.push(`MAIN_TRIBUTARY_COUNT:${mainTributaries.length}`);
  }
  for (const river of EXPECTED_MAIN_TRIBUTARIES) {
    if (!mainTributaries.includes(river)) issues.push(`MISSING_MAIN_TRIBUTARY:${river}`);
  }

  for (const factId of [
    "geo-riv-001-cp002-indus-source-bokhar-chu",
    "geo-riv-001-cp002-indus-tibet-name-singi-khamban",
    "geo-riv-001-cp002-jhelum-source-verinag",
    "geo-riv-001-cp002-jhelum-wular-lake",
    "geo-riv-001-cp002-chenab-formed-chandra-bhaga",
    "geo-riv-001-cp002-chenab-formation-tandi",
    "geo-riv-001-cp002-headstream-chandra-chenab",
    "geo-riv-001-cp002-headstream-bhaga-chenab",
    "geo-riv-001-cp002-ravi-source-chamba",
    "geo-riv-001-cp002-beas-source-beas-kund",
    "geo-riv-001-cp002-beas-source-rohtang",
    "geo-riv-001-cp002-satluj-source-mansarovar",
    "geo-riv-001-cp002-satluj-shipkila",
  ]) {
    if (!factIds.has(factId)) issues.push(`MISSING_CORE_FACT:${factId}`);
  }

  const headstreams = facts.filter((fact) => fact.relation === "headstream_of");
  if (headstreams.length !== 2) issues.push(`CHENAB_HEADSTREAM_COUNT:${headstreams.length}`);
  for (const headstream of headstreams) {
    if (
      headstream.value.kind !== "entity_ref" ||
      headstream.value.entityId !== "geo:river:chenab"
    ) {
      issues.push(`INVALID_CHENAB_HEADSTREAM_TARGET:${headstream.factId}`);
    }
  }

  const joinChainFacts = facts.filter((fact) => fact.relation === "joins_river");
  const joinSignature = new Set(
    joinChainFacts.map((fact) =>
      fact.value.kind === "entity_ref"
        ? `${fact.entity.label.en}->${fact.value.label.en}`
        : `${fact.entity.label.en}->INVALID`,
    ),
  );
  for (const expected of [
    "Jhelum->Chenab",
    "Ravi->Chenab",
    "Beas->Satluj",
    "Satluj->Chenab",
  ]) {
    if (!joinSignature.has(expected)) issues.push(`MISSING_JOIN_CHAIN:${expected}`);
  }

  return {
    valid: issues.length === 0,
    factCount: facts.length,
    entityCount: entityIds.size,
    relationCounts: Object.fromEntries(relationCounts),
    mainTributaries,
    joinChainCount: joinChainFacts.length,
    issues,
  };
}
