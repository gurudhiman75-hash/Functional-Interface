import type { KnowledgeFact } from "../../types";
import { GEO_RIV_001_CP003_FACTS } from "./geo-riv-001-cp003-facts";
import {
  GEO_RIV_001_CP003_SOURCE_AUTHORITIES,
  auditGeoRiv001Cp003SourceAuthorities,
} from "./geo-riv-001-cp003-source-authorities";

function valueText(fact: KnowledgeFact) {
  if (fact.value.kind === "entity_ref") return fact.value.label.en;
  if (fact.value.kind === "text") return fact.value.text.en;
  return "";
}

export function auditGeoRiv001Cp003Facts() {
  const issues: string[] = [];
  const sourceAudit = auditGeoRiv001Cp003SourceAuthorities();
  if (!sourceAudit.valid) issues.push(...sourceAudit.issues.map((issue) => `SOURCE:${issue}`));

  const knownSourceIds = new Set([
    ...GEO_RIV_001_CP003_SOURCE_AUTHORITIES.map((source) => source.sourceId),
    "NCERT-CONTEMPORARY-INDIA-I-DRAINAGE",
  ]);
  const ids = new Set<string>();

  for (const fact of GEO_RIV_001_CP003_FACTS) {
    if (ids.has(fact.factId)) issues.push(`DUPLICATE_FACT_ID:${fact.factId}`);
    ids.add(fact.factId);
    if (!fact.factId.startsWith("geo-riv-001-cp003-")) issues.push(`BAD_FACT_PREFIX:${fact.factId}`);
    if (fact.chapterId !== "GEO-RIV-001") issues.push(`BAD_CHAPTER:${fact.factId}`);
    if (fact.cpId !== "GEO-RIV-001-CP003") issues.push(`BAD_CP:${fact.factId}`);
    if (fact.subject !== "Static GK — Indian Geography") issues.push(`BAD_SUBJECT:${fact.factId}`);
    if (fact.review.status !== "REVIEW_REQUIRED") issues.push(`BAD_REVIEW_STATUS:${fact.factId}`);
    if (fact.freshness.class !== "IMMUTABLE") issues.push(`NON_STATIC_FRESHNESS:${fact.factId}`);
    if (!fact.source.locator?.trim()) issues.push(`MISSING_LOCATOR:${fact.factId}`);
    if (!knownSourceIds.has(fact.source.sourceId)) issues.push(`UNKNOWN_SOURCE:${fact.factId}:${fact.source.sourceId}`);
    if (!fact.examTags?.length) issues.push(`MISSING_EXAM_TAGS:${fact.factId}`);
    if (/Saraswati/i.test(`${fact.entity.label.en} ${valueText(fact)}`)) issues.push(`MYTHOLOGY_AS_GEOGRAPHY:${fact.factId}`);
  }

  if (GEO_RIV_001_CP003_FACTS.length !== 55) {
    issues.push(`FACT_COUNT:${GEO_RIV_001_CP003_FACTS.length}:55`);
  }

  const requiredIds = [
    "geo-riv-001-cp003-bhagirathi-source-gangotri-glacier",
    "geo-riv-001-cp003-bhagirathi-source-gaumukh",
    "geo-riv-001-cp003-ganga-formed-bhagirathi-alaknanda",
    "geo-riv-001-cp003-ganga-formed-at-devprayag",
    "geo-riv-001-cp003-ganga-enters-plains-haridwar",
    "geo-riv-001-cp003-ganga-drains-bay-of-bengal",
    "geo-riv-001-cp003-yamuna-source-yamunotri-glacier",
    "geo-riv-001-cp003-yamuna-confluence-prayagraj",
    "geo-riv-001-cp003-kosi-formed-three-streams",
    "geo-riv-001-cp003-kosi-sorrow-bihar",
    "geo-riv-001-cp003-sone-source-amarkantak",
  ];
  for (const id of requiredIds) if (!ids.has(id)) issues.push(`MISSING_CORE_FACT:${id}`);

  const panchExpected = new Map([
    ["Dhauliganga", "Vishnuprayag"],
    ["Nandakini", "Nandprayag"],
    ["Pindar", "Karnaprayag"],
    ["Mandakini", "Rudraprayag"],
    ["Bhagirathi", "Devprayag"],
  ]);
  for (const [river, place] of panchExpected) {
    const match = GEO_RIV_001_CP003_FACTS.some(
      (fact) => fact.entity.label.en === river && fact.relation === "joins_river_at" && valueText(fact) === place,
    );
    if (!match) issues.push(`MISSING_PANCH_PRAYAG:${river}:${place}`);
  }

  const gangaTributaries = new Set(
    GEO_RIV_001_CP003_FACTS
      .filter((fact) => ["tributary_of", "principal_tributary_of"].includes(fact.relation) && valueText(fact) === "Ganga")
      .map((fact) => fact.entity.label.en),
  );
  for (const river of ["Yamuna", "Ramganga", "Gomti", "Ghaghara", "Gandak", "Kosi", "Sone"]) {
    if (!gangaTributaries.has(river)) issues.push(`MISSING_GANGA_TRIBUTARY:${river}`);
  }

  const yamunaTributaries = new Set(
    GEO_RIV_001_CP003_FACTS
      .filter((fact) => fact.relation === "tributary_of" && valueText(fact) === "Yamuna")
      .map((fact) => fact.entity.label.en),
  );
  for (const river of ["Chambal", "Betwa", "Ken"]) {
    if (!yamunaTributaries.has(river)) issues.push(`MISSING_YAMUNA_TRIBUTARY:${river}`);
  }

  const expectedBanks = new Map<string, string>([
    ["Yamuna", "right bank"],
    ["Ramganga", "left bank"],
    ["Gomti", "left bank"],
    ["Ghaghara", "left bank"],
    ["Gandak", "left bank"],
    ["Kosi", "left bank"],
    ["Sone", "right bank"],
  ]);
  for (const [river, side] of expectedBanks) {
    const match = GEO_RIV_001_CP003_FACTS.some(
      (fact) => fact.entity.label.en === river && fact.relation === "joins_ganga_from_bank" && valueText(fact) === side,
    );
    if (!match) issues.push(`MISSING_BANK_RELATION:${river}:${side}`);
  }

  return {
    valid: issues.length === 0,
    factCount: GEO_RIV_001_CP003_FACTS.length,
    sourceCount: sourceAudit.sourceCount,
    uniqueFactCount: ids.size,
    issues,
  };
}
