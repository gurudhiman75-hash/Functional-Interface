import { GEO_RIV_001_CP007_ADMITTED_UPSTREAM_CP_IDS, GEO_RIV_001_CP007_HELD_UPSTREAM_CP_IDS, GEO_RIV_001_CP007_LINEAGE_V1, GEO_RIV_001_CP007_PROJECTED_FACTS_V1, geoRiv001Cp007FactText } from "./geo-riv-001-cp007-facts";

const CP_ID = "GEO-RIV-001-CP007";

export function auditGeoRiv001Cp007FactsV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const sourceCounts: Record<string, number> = {};
  const relationCounts: Record<string, number> = {};

  for (const fact of GEO_RIV_001_CP007_PROJECTED_FACTS_V1) {
    if (ids.has(fact.factId)) issues.push(`DUPLICATE_FACT_ID:${fact.factId}`);
    ids.add(fact.factId);
    if (!fact.factId.startsWith("geo-riv-001-cp007-")) issues.push(`BAD_FACT_ID:${fact.factId}`);
    if (fact.cpId !== CP_ID) issues.push(`BAD_CP:${fact.factId}:${fact.cpId}`);
    if (fact.chapterId !== "GEO-RIV-001") issues.push(`BAD_CHAPTER:${fact.factId}`);
    if (fact.review.status !== "REVIEW_REQUIRED") issues.push(`BAD_REVIEW_STATUS:${fact.factId}`);
    if (fact.freshness.class !== "IMMUTABLE") issues.push(`BAD_FRESHNESS:${fact.factId}`);
    if (!fact.source.sourceId || !fact.source.title) issues.push(`NO_SOURCE:${fact.factId}`);
    if (!fact.source.locator) issues.push(`NO_LOCATOR:${fact.factId}`);
    if (!fact.tags.includes("tributaries-confluences")) issues.push(`NO_CP007_TAG:${fact.factId}`);

    const upstream = fact.tags.find((tag) => tag.startsWith("upstream:"))?.slice("upstream:".length);
    if (!upstream) issues.push(`NO_UPSTREAM_LINEAGE:${fact.factId}`);
    else sourceCounts[upstream] = (sourceCounts[upstream] ?? 0) + 1;
    relationCounts[fact.relation] = (relationCounts[fact.relation] ?? 0) + 1;
  }

  if (GEO_RIV_001_CP007_PROJECTED_FACTS_V1.length < 50) issues.push(`FACT_COUNT_TOO_LOW:${GEO_RIV_001_CP007_PROJECTED_FACTS_V1.length}`);
  for (const cpId of GEO_RIV_001_CP007_ADMITTED_UPSTREAM_CP_IDS) {
    const token = cpId.replace("GEO-RIV-001-", "").toLowerCase();
    if (!sourceCounts[token]) issues.push(`MISSING_UPSTREAM:${token}`);
  }
  for (const held of GEO_RIV_001_CP007_HELD_UPSTREAM_CP_IDS) {
    const token = held.replace("GEO-RIV-001-", "").toLowerCase();
    if (sourceCounts[token]) issues.push(`HELD_UPSTREAM_PRESENT:${token}`);
  }

  if (GEO_RIV_001_CP007_LINEAGE_V1.length !== GEO_RIV_001_CP007_PROJECTED_FACTS_V1.length) issues.push("LINEAGE_COUNT_MISMATCH");
  if (GEO_RIV_001_CP007_LINEAGE_V1.some((row) => row.upstreamFactId === "unknown" || row.upstreamCp === "unknown")) issues.push("BROKEN_LINEAGE_ROW");

  const corpus = GEO_RIV_001_CP007_PROJECTED_FACTS_V1.map(geoRiv001Cp007FactText).join("\n");
  for (const required of [
    "Jhelum","Chenab","Trimmu","Beas","Satluj","Harike","Panjnad",
    "Bhagirathi","Alaknanda","Devprayag","Dhauliganga","Vishnuprayag",
    "Dibang","Lohit","Subansiri","Manas","Godavari","Krishna","Mahanadi","Cauvery","Brahmani",
    "Narmada","Tapi","Mahi","Sabarmati","Tawa","Purna","Anas","Wakal",
  ]) if (!corpus.includes(required)) issues.push(`MISSING_CANONICAL_COVERAGE:${required}`);

  const relationFamilies = {
    parent: GEO_RIV_001_CP007_PROJECTED_FACTS_V1.filter((fact) => /tributary_of|headstream_of|source_stream_of/.test(fact.relation)).length,
    confluence: GEO_RIV_001_CP007_PROJECTED_FACTS_V1.filter((fact) => /joins|formed|name_transition/.test(fact.relation)).length,
    bank: GEO_RIV_001_CP007_PROJECTED_FACTS_V1.filter((fact) => /bank/.test(fact.relation)).length,
  };
  if (relationFamilies.parent < 30) issues.push(`PARENT_RELATIONS_TOO_LOW:${relationFamilies.parent}`);
  if (relationFamilies.confluence < 8) issues.push(`CONFLUENCE_RELATIONS_TOO_LOW:${relationFamilies.confluence}`);
  if (relationFamilies.bank < 20) issues.push(`BANK_RELATIONS_TOO_LOW:${relationFamilies.bank}`);
  if ((sourceCounts.cp006 ?? 0) < 12) issues.push(`CP006_PROJECTION_TOO_LOW:${sourceCounts.cp006 ?? 0}`);

  return { valid: issues.length === 0, issues, factCount: GEO_RIV_001_CP007_PROJECTED_FACTS_V1.length, lineageCount: GEO_RIV_001_CP007_LINEAGE_V1.length, sourceCounts, relationCounts, relationFamilies };
}
