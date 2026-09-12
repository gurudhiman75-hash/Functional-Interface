import { GEO_RIV_001_CP009_SOURCE_AUTHORITIES_V1, auditGeoRiv001Cp009SourceAuthorities } from "./geo-riv-001-cp009-source-authorities";
import { GEO_RIV_001_CP009_COURSE_STATE_FACTS_V1, GEO_RIV_001_CP009_FACTS_V1, GEO_RIV_001_CP009_SOURCE_STATE_FACTS_V1 } from "./geo-riv-001-cp009-facts";

function valueText(fact: (typeof GEO_RIV_001_CP009_FACTS_V1)[number]) {
  if (fact.value.kind === "entity_ref") return fact.value.label.en;
  if (fact.value.kind === "text") return fact.value.text.en;
  return String("value" in fact.value ? fact.value.value : "");
}

const EXPECTED_COURSE_STATES: Record<string, string[]> = {
  Ganga: ["Uttarakhand", "Uttar Pradesh", "Bihar", "Jharkhand", "West Bengal"],
  Brahmaputra: ["Arunachal Pradesh", "Assam"],
  Krishna: ["Maharashtra", "Karnataka", "Telangana", "Andhra Pradesh"],
  Godavari: ["Maharashtra", "Telangana", "Andhra Pradesh"],
  Mahanadi: ["Chhattisgarh", "Odisha"],
  Cauvery: ["Karnataka", "Tamil Nadu"],
  Pennar: ["Karnataka", "Andhra Pradesh"],
  Teesta: ["Sikkim", "West Bengal"],
  Subarnarekha: ["Jharkhand", "West Bengal", "Odisha"],
};

export function auditGeoRiv001Cp009FactsV1() {
  const issues: string[] = [];
  const sourceAudit = auditGeoRiv001Cp009SourceAuthorities();
  if (!sourceAudit.valid) issues.push(...sourceAudit.issues.map((issue) => `SOURCE:${issue}`));

  const ids = new Set<string>();
  const semantic = new Set<string>();
  for (const fact of GEO_RIV_001_CP009_FACTS_V1) {
    if (ids.has(fact.factId)) issues.push(`DUPLICATE_FACT_ID:${fact.factId}`);
    ids.add(fact.factId);
    const key = `${fact.entityId}|${fact.relation}|${valueText(fact)}`;
    if (semantic.has(key)) issues.push(`DUPLICATE_SEMANTIC_FACT:${key}`);
    semantic.add(key);
    if (fact.cpId !== "GEO-RIV-001-CP009") issues.push(`WRONG_CP:${fact.factId}:${fact.cpId}`);
    if (fact.review.status !== "REVIEW_REQUIRED") issues.push(`FACT_NOT_REVIEW_BLOCKED:${fact.factId}`);
    if (fact.freshness.class !== "IMMUTABLE") issues.push(`NON_IMMUTABLE:${fact.factId}`);
    if (!fact.source.sourceId || !fact.source.title || !fact.source.locator) issues.push(`INCOMPLETE_PROVENANCE:${fact.factId}`);
    if (fact.tags.some((tag) => tag.includes("cp006"))) issues.push(`CP006_LEAK:${fact.factId}`);
    if (["drains_state", "basin_state", "basin_lies_in_state", "catchment_state"].includes(fact.relation)) issues.push(`BASIN_STATE_CONFLATION:${fact.factId}`);
  }

  if (GEO_RIV_001_CP009_COURSE_STATE_FACTS_V1.length !== 25) issues.push(`COURSE_FACT_COUNT:${GEO_RIV_001_CP009_COURSE_STATE_FACTS_V1.length}`);
  if (GEO_RIV_001_CP009_SOURCE_STATE_FACTS_V1.length < 5) issues.push(`SOURCE_STATE_PROJECTION_TOO_SMALL:${GEO_RIV_001_CP009_SOURCE_STATE_FACTS_V1.length}`);

  const actualByRiver = new Map<string, Set<string>>();
  for (const fact of GEO_RIV_001_CP009_COURSE_STATE_FACTS_V1) {
    if (fact.relation !== "flows_through_state") issues.push(`WRONG_COURSE_RELATION:${fact.factId}:${fact.relation}`);
    const river = fact.entity.label.en;
    const states = actualByRiver.get(river) ?? new Set<string>();
    states.add(valueText(fact));
    actualByRiver.set(river, states);
    if (!(fact.source.sourceId in GEO_RIV_001_CP009_SOURCE_AUTHORITIES_V1)) issues.push(`UNKNOWN_CP009_SOURCE:${fact.factId}:${fact.source.sourceId}`);
  }

  for (const [river, expected] of Object.entries(EXPECTED_COURSE_STATES)) {
    const actual = [...(actualByRiver.get(river) ?? new Set<string>())].sort();
    const wanted = [...expected].sort();
    if (JSON.stringify(actual) !== JSON.stringify(wanted)) issues.push(`COURSE_SET_MISMATCH:${river}:${actual.join("|")}:${wanted.join("|")}`);
  }
  for (const river of actualByRiver.keys()) {
    if (!(river in EXPECTED_COURSE_STATES)) issues.push(`UNEXPECTED_COURSE_RIVER:${river}`);
  }

  return {
    valid: issues.length === 0,
    issues,
    factCount: GEO_RIV_001_CP009_FACTS_V1.length,
    courseFactCount: GEO_RIV_001_CP009_COURSE_STATE_FACTS_V1.length,
    sourceStateFactCount: GEO_RIV_001_CP009_SOURCE_STATE_FACTS_V1.length,
    riverCount: actualByRiver.size,
    sourceCount: sourceAudit.sourceCount,
    courseStatesByRiver: Object.fromEntries([...actualByRiver.entries()].map(([river, states]) => [river, [...states].sort()])),
  };
}
