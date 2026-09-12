import type { KnowledgeFact } from "../../types";
import { GEO_RIV_001_CP004_FACTS_V1 } from "./geo-riv-001-cp004-facts";
import { GEO_RIV_001_CP004_SOURCE_AUTHORITIES_V1 } from "./geo-riv-001-cp004-source-authorities";

function valueText(fact: KnowledgeFact) {
  if (fact.value.kind === "entity_ref") return fact.value.label.en;
  if (fact.value.kind === "text") return fact.value.text.en;
  return "";
}

export function auditGeoRiv001Cp004FactsV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const knownSources = new Set(Object.keys(GEO_RIV_001_CP004_SOURCE_AUTHORITIES_V1));

  for (const fact of GEO_RIV_001_CP004_FACTS_V1) {
    if (ids.has(fact.factId)) issues.push(`DUPLICATE_FACT_ID:${fact.factId}`);
    ids.add(fact.factId);
    if (!fact.factId.startsWith("geo-riv-001-cp004-")) issues.push(`BAD_FACT_PREFIX:${fact.factId}`);
    if (fact.chapterId !== "GEO-RIV-001") issues.push(`BAD_CHAPTER:${fact.factId}`);
    if (fact.cpId !== "GEO-RIV-001-CP004") issues.push(`BAD_CP:${fact.factId}`);
    if (fact.subject !== "Static GK — Indian Geography") issues.push(`BAD_SUBJECT:${fact.factId}`);
    if (fact.review.status !== "REVIEW_REQUIRED") issues.push(`BAD_REVIEW_STATUS:${fact.factId}`);
    if (fact.freshness.class !== "IMMUTABLE") issues.push(`NON_STATIC_FRESHNESS:${fact.factId}`);
    if (!knownSources.has(fact.source.sourceId)) issues.push(`UNKNOWN_SOURCE:${fact.factId}:${fact.source.sourceId}`);
    if (!fact.source.locator?.trim()) issues.push(`MISSING_LOCATOR:${fact.factId}`);
    if (!fact.examTags?.length) issues.push(`MISSING_EXAM_TAGS:${fact.factId}`);
    if (/current project|current flood|discharge today|largest river island in the world/i.test(`${fact.entity.label.en} ${valueText(fact)}`)) {
      issues.push(`UNSTABLE_CONTENT:${fact.factId}`);
    }
  }

  if (GEO_RIV_001_CP004_FACTS_V1.length !== 48) issues.push(`FACT_COUNT:${GEO_RIV_001_CP004_FACTS_V1.length}:48`);

  for (const id of [
    "geo-riv-001-cp004-brahmaputra-origin-glacier",
    "geo-riv-001-cp004-brahmaputra-tibet-name-tsangpo",
    "geo-riv-001-cp004-brahmaputra-enters-india-arunachal",
    "geo-riv-001-cp004-brahmaputra-india-name-siang",
    "geo-riv-001-cp004-brahmaputra-india-name-dihang",
    "geo-riv-001-cp004-brahmaputra-name-after-confluence",
    "geo-riv-001-cp004-brahmaputra-bangladesh-name-jamuna",
    "geo-riv-001-cp004-trans-himalayan-north-bank-trio",
    "geo-riv-001-cp004-kameng-jia-bharali",
  ]) {
    if (!ids.has(id)) issues.push(`MISSING_CORE_FACT:${id}`);
  }

  const tributaries = new Set(
    GEO_RIV_001_CP004_FACTS_V1
      .filter((fact) => ["tributary_of", "tributary_of_brahmaputra_system"].includes(fact.relation) && valueText(fact) === "Brahmaputra")
      .map((fact) => fact.entity.label.en),
  );
  for (const river of ["Dibang", "Lohit", "Subansiri", "Jia Bharali", "Manas", "Sankosh", "Burhi Dihing", "Disang", "Dikhow", "Dhansiri (South)", "Kopili"]) {
    if (!tributaries.has(river)) issues.push(`MISSING_BRAHMAPUTRA_TRIBUTARY:${river}`);
  }

  const bankMap = new Map(
    GEO_RIV_001_CP004_FACTS_V1
      .filter((fact) => fact.relation === "brahmaputra_bank_side")
      .map((fact) => [fact.entity.label.en, valueText(fact)] as const),
  );
  for (const river of ["Subansiri", "Jia Bharali", "Manas", "Sankosh", "Puthimari"]) {
    if (bankMap.get(river) !== "north bank") issues.push(`BAD_NORTH_BANK:${river}`);
  }
  for (const river of ["Burhi Dihing", "Disang", "Dikhow", "Dhansiri (South)", "Kopili"]) {
    if (bankMap.get(river) !== "south bank") issues.push(`BAD_SOUTH_BANK:${river}`);
  }

  const subansiriChildren = new Set(
    GEO_RIV_001_CP004_FACTS_V1
      .filter((fact) => fact.relation === "tributary_of" && valueText(fact) === "Subansiri")
      .map((fact) => fact.entity.label.en),
  );
  for (const river of ["Ranganadi", "Dikrong", "Jiadhol"]) {
    if (!subansiriChildren.has(river)) issues.push(`MISSING_SUBANSIRI_TRIBUTARY:${river}`);
  }

  return {
    valid: issues.length === 0,
    factCount: GEO_RIV_001_CP004_FACTS_V1.length,
    sourceCount: knownSources.size,
    uniqueFactCount: ids.size,
    issues,
  };
}
