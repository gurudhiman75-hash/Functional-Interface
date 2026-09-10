import type { KnowledgeFact } from "../../types";
import { GEO_RIV_001_CP005_FACTS } from "./geo-riv-001-cp005-facts";
import { GEO_RIV_001_CP005_SOURCE_AUTHORITIES_V1 } from "./geo-riv-001-cp005-source-authorities";

function valueText(fact: KnowledgeFact) {
  if (fact.value.kind === "entity_ref") return fact.value.label.en;
  if (fact.value.kind === "text") return fact.value.text.en;
  return "";
}

export function auditGeoRiv001Cp005Facts() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const sourceIds = new Set(Object.keys(GEO_RIV_001_CP005_SOURCE_AUTHORITIES_V1));

  for (const fact of GEO_RIV_001_CP005_FACTS) {
    if (ids.has(fact.factId)) issues.push(`DUPLICATE_FACT_ID:${fact.factId}`);
    ids.add(fact.factId);
    if (!fact.factId.startsWith("geo-riv-001-cp005-")) issues.push(`BAD_PREFIX:${fact.factId}`);
    if (fact.chapterId !== "GEO-RIV-001") issues.push(`BAD_CHAPTER:${fact.factId}`);
    if (fact.cpId !== "GEO-RIV-001-CP005") issues.push(`BAD_CP:${fact.factId}`);
    if (fact.subject !== "Static GK — Indian Geography") issues.push(`BAD_SUBJECT:${fact.factId}`);
    if (fact.review.status !== "REVIEW_REQUIRED") issues.push(`BAD_REVIEW_STATUS:${fact.factId}`);
    if (fact.freshness.class !== "IMMUTABLE") issues.push(`NON_STATIC_FRESHNESS:${fact.factId}`);
    if (!sourceIds.has(fact.source.sourceId)) issues.push(`UNKNOWN_SOURCE:${fact.factId}:${fact.source.sourceId}`);
    if (!fact.source.locator?.trim()) issues.push(`MISSING_LOCATOR:${fact.factId}`);
    if (!fact.examTags?.length) issues.push(`MISSING_EXAM_TAGS:${fact.factId}`);

    const visible = `${fact.entity.label.en} ${fact.relation} ${valueText(fact)}`;
    if (/\b\d{3,5}\s*km\b|catchment|basin area|tribunal|dispute|current storage|current flood|project status/i.test(visible)) {
      issues.push(`UNSTABLE_OR_RESERVED_CONTENT:${fact.factId}`);
    }
  }

  if (GEO_RIV_001_CP005_FACTS.length !== 71) issues.push(`FACT_COUNT:${GEO_RIV_001_CP005_FACTS.length}:71`);

  const requiredCore = new Map<string, string>([
    ["Godavari", "Maharashtra"],
    ["Krishna", "Maharashtra"],
    ["Mahanadi", "Chhattisgarh"],
    ["Cauvery", "Karnataka"],
    ["Pennar", "Karnataka"],
  ]);
  for (const [river, state] of requiredCore) {
    const hasState = GEO_RIV_001_CP005_FACTS.some(
      (fact) => fact.entity.label.en === river && fact.relation === "source_state" && valueText(fact) === state,
    );
    if (!hasState) issues.push(`MISSING_SOURCE_STATE:${river}:${state}`);
  }

  for (const river of ["Godavari", "Krishna", "Mahanadi", "Cauvery", "Pennar", "Brahmani", "Baitarani", "Subarnarekha"]) {
    const hasMouth = GEO_RIV_001_CP005_FACTS.some(
      (fact) => fact.entity.label.en === river && fact.relation === "drains_into" && valueText(fact) === "Bay of Bengal",
    );
    if (!hasMouth) issues.push(`MISSING_BAY_OUTFALL:${river}`);
  }

  const expectedBanks = new Map<string, { left: string[]; right: string[] }>([
    ["Godavari", { left: ["Purna", "Pranhita", "Indravati", "Sabari"], right: ["Pravara", "Manjira", "Darna"] }],
    ["Krishna", { left: ["Bhima", "Musi", "Munneru"], right: ["Ghataprabha", "Malaprabha", "Tungabhadra"] }],
    ["Mahanadi", { left: ["Seonath", "Hasdeo", "Mand", "Ib"], right: ["Ong", "Tel", "Jonk"] }],
    ["Cauvery", { left: ["Harangi", "Hemavati", "Shimsha", "Arkavati"], right: ["Lakshmantirtha", "Kabini", "Suvarnavati", "Bhavani", "Noyyal", "Amaravati"] }],
    ["Pennar", { left: ["Jayamangali", "Kunderu", "Sagileru"], right: ["Chitravati", "Papagni", "Cheyyeru"] }],
  ]);
  for (const [parent, groups] of expectedBanks) {
    for (const river of groups.left) {
      const ok = GEO_RIV_001_CP005_FACTS.some((fact) => fact.entity.label.en === river && fact.relation === "left_bank_tributary_of" && valueText(fact) === parent);
      if (!ok) issues.push(`MISSING_LEFT_BANK:${river}:${parent}`);
    }
    for (const river of groups.right) {
      const ok = GEO_RIV_001_CP005_FACTS.some((fact) => fact.entity.label.en === river && fact.relation === "right_bank_tributary_of" && valueText(fact) === parent);
      if (!ok) issues.push(`MISSING_RIGHT_BANK:${river}:${parent}`);
    }
  }

  const hierarchy = [
    ["Wardha", "Pranhita"],
    ["Wainganga", "Pranhita"],
  ] as const;
  for (const [river, parent] of hierarchy) {
    const ok = GEO_RIV_001_CP005_FACTS.some((fact) => fact.entity.label.en === river && fact.relation === "tributary_of" && valueText(fact) === parent);
    if (!ok) issues.push(`MISSING_HIERARCHY:${river}:${parent}`);
  }
  for (const [river, formation] of [["Tungabhadra", "Tunga + Bhadra"], ["Brahmani", "Sankh + Koel"]] as const) {
    const ok = GEO_RIV_001_CP005_FACTS.some((fact) => fact.entity.label.en === river && fact.relation === "formed_by" && valueText(fact) === formation);
    if (!ok) issues.push(`MISSING_FORMATION:${river}:${formation}`);
  }

  const godavariNickname = GEO_RIV_001_CP005_FACTS.some((fact) => fact.entity.label.en === "Godavari" && fact.relation === "also_known_as" && valueText(fact) === "Dakshin Ganga");
  if (!godavariNickname) issues.push("MISSING_GODAVARI_DAKSHIN_GANGA");
  const cauveryAlias = GEO_RIV_001_CP005_FACTS.some((fact) => fact.entity.label.en === "Cauvery" && fact.relation === "also_spelled" && valueText(fact) === "Kaveri");
  if (!cauveryAlias) issues.push("MISSING_CAUVARY_KAVERI_ALIAS");

  return {
    valid: issues.length === 0,
    factCount: GEO_RIV_001_CP005_FACTS.length,
    uniqueFactCount: ids.size,
    sourceCount: sourceIds.size,
    issues,
  };
}
