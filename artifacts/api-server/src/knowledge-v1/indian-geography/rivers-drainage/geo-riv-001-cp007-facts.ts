import type { KnowledgeFact } from "../../types";
import { GEO_RIV_001_CP002_REVIEWABLE_FACTS_V1 } from "./geo-riv-001-cp002-editorial-review-v1";
import { GEO_RIV_001_CP003_REVIEWABLE_FACTS_V1 } from "./geo-riv-001-cp003-editorial-review-v1";
import { GEO_RIV_001_CP004_REVIEWABLE_FACTS_V1 } from "./geo-riv-001-cp004-editorial-review-v1";
import { GEO_RIV_001_CP005_REVIEWABLE_FACTS_V1 } from "./geo-riv-001-cp005-editorial-review-v1";
import { GEO_RIV_001_CP006_FACTS_V1 } from "./geo-riv-001-cp006-facts";

const CP_ID = "GEO-RIV-001-CP007";

export const GEO_RIV_001_CP007_ADMITTED_UPSTREAM_CP_IDS = Object.freeze([
  "GEO-RIV-001-CP002",
  "GEO-RIV-001-CP003",
  "GEO-RIV-001-CP004",
  "GEO-RIV-001-CP005",
  "GEO-RIV-001-CP006",
] as const);

export const GEO_RIV_001_CP007_HELD_UPSTREAM_CP_IDS = Object.freeze([] as const);

const PROJECTABLE_RELATIONS = new Set([
  "main_tributary_of",
  "tributary_of",
  "principal_tributary_of",
  "tributary_of_brahmaputra_system",
  "headstream_of",
  "source_stream_of",
  "left_bank_tributary_of",
  "right_bank_tributary_of",
  "has_left_bank_tributary",
  "has_right_bank_tributary",
  "joins_ganga_from_bank",
  "brahmaputra_bank_side",
  "joins_river",
  "joins_river_at",
  "joins_parent_near",
  "joins_mainstream",
  "joins",
  "formed_by",
  "formed_at",
  "name_transition",
]);

const PROJECTABLE_TAGS = new Set([
  "tributary",
  "main-tributary",
  "principal-tributary",
  "headstream",
  "confluence",
  "formation",
  "bank-side",
  "joining-chain",
  "panch-prayag",
]);

const UPSTREAM: ReadonlyArray<{ cpId: string; facts: readonly KnowledgeFact[] }> = [
  { cpId: "GEO-RIV-001-CP002", facts: GEO_RIV_001_CP002_REVIEWABLE_FACTS_V1 },
  { cpId: "GEO-RIV-001-CP003", facts: GEO_RIV_001_CP003_REVIEWABLE_FACTS_V1 },
  { cpId: "GEO-RIV-001-CP004", facts: GEO_RIV_001_CP004_REVIEWABLE_FACTS_V1 },
  { cpId: "GEO-RIV-001-CP005", facts: GEO_RIV_001_CP005_REVIEWABLE_FACTS_V1 },
  { cpId: "GEO-RIV-001-CP006", facts: GEO_RIV_001_CP006_FACTS_V1 },
];

function cloneValue(value: KnowledgeFact["value"]): KnowledgeFact["value"] {
  switch (value.kind) {
    case "text": return { kind: "text", text: { ...value.text } };
    case "entity_ref": return { kind: "entity_ref", entityId: value.entityId, label: { ...value.label } };
    case "number": return { kind: "number", value: value.value, ...(value.unit ? { unit: value.unit } : {}) };
    case "date": return { kind: "date", isoDate: value.isoDate };
    case "boolean": return { kind: "boolean", value: value.value };
  }
}

function isProjectable(fact: KnowledgeFact) {
  if (PROJECTABLE_RELATIONS.has(fact.relation)) return true;
  return fact.tags.some((tag) => PROJECTABLE_TAGS.has(tag));
}

function upstreamToken(cpId: string) { return cpId.replace("GEO-RIV-001-", "").toLowerCase(); }
function sourceSuffix(factId: string) { return factId.replace(/^geo-riv-001-cp\d+-/, ""); }

function projectCp006BankFact(fact: KnowledgeFact, token: string): KnowledgeFact | null {
  if (!["has_left_bank_tributary", "has_right_bank_tributary"].includes(fact.relation) || fact.value.kind !== "entity_ref") return null;
  const tributaryName = fact.value.label.en;
  const parentName = fact.entity.label.en;
  const relation = fact.relation === "has_left_bank_tributary" ? "left_bank_tributary_of" : "right_bank_tributary_of";
  return {
    ...fact,
    factId: `geo-riv-001-cp007-${token}-${sourceSuffix(fact.factId)}`,
    entityId: fact.value.entityId,
    cpId: CP_ID,
    relation,
    entity: { canonicalName: tributaryName, label: { en: tributaryName } },
    value: { kind: "entity_ref", entityId: fact.entityId, label: { en: parentName } },
    contextGroupId: `geo-riv-001-cp007-${fact.contextGroupId}`,
    distractorGroupIds: fact.distractorGroupIds?.map((group) => `geo-riv-001-cp007-${group}`),
    examTags: [...fact.examTags],
    tags: ["tributaries-confluences", `upstream:${token}`, `upstream-fact:${fact.factId}`, "tributary", "bank-side", ...fact.tags],
    source: { ...fact.source },
    review: { status: "REVIEW_REQUIRED", confidence: Math.min(fact.review.confidence, 0.98) },
    freshness: { ...fact.freshness, class: "IMMUTABLE", lastVerifiedAt: "2026-09-11" },
  };
}

function projectFact(fact: KnowledgeFact, sourceCpId: string): KnowledgeFact {
  const token = upstreamToken(sourceCpId);
  const normalizedCp006 = sourceCpId === "GEO-RIV-001-CP006" ? projectCp006BankFact(fact, token) : null;
  if (normalizedCp006) return normalizedCp006;
  return {
    ...fact,
    factId: `geo-riv-001-cp007-${token}-${sourceSuffix(fact.factId)}`,
    cpId: CP_ID,
    entity: { ...fact.entity, label: { ...fact.entity.label }, ...(fact.entity.aliases ? { aliases: fact.entity.aliases } : {}) },
    value: cloneValue(fact.value),
    contextGroupId: `geo-riv-001-cp007-${fact.contextGroupId}`,
    distractorGroupIds: fact.distractorGroupIds ? fact.distractorGroupIds.map((group) => `geo-riv-001-cp007-${group}`) : undefined,
    examTags: [...fact.examTags],
    tags: ["tributaries-confluences", `upstream:${token}`, `upstream-fact:${fact.factId}`, ...fact.tags],
    source: { ...fact.source },
    review: { status: "REVIEW_REQUIRED", confidence: Math.min(fact.review.confidence, 0.98) },
    freshness: { ...fact.freshness, class: "IMMUTABLE", lastVerifiedAt: "2026-09-11" },
  };
}

export const GEO_RIV_001_CP007_PROJECTED_FACTS_V1: KnowledgeFact[] = UPSTREAM.flatMap(
  ({ cpId, facts }) => facts.filter(isProjectable).map((fact) => projectFact(fact, cpId)),
);

export const GEO_RIV_001_CP007_LINEAGE_V1 = Object.freeze(
  GEO_RIV_001_CP007_PROJECTED_FACTS_V1.map((fact) => {
    const upstreamTag = fact.tags.find((tag) => tag.startsWith("upstream:"));
    const factTag = fact.tags.find((tag) => tag.startsWith("upstream-fact:"));
    return Object.freeze({
      projectedFactId: fact.factId,
      upstreamCp: upstreamTag?.slice("upstream:".length) ?? "unknown",
      upstreamFactId: factTag?.slice("upstream-fact:".length) ?? "unknown",
      sourceId: fact.source.sourceId,
    });
  }),
);

export function geoRiv001Cp007FactText(fact: KnowledgeFact) {
  const value = fact.value.kind === "entity_ref" ? fact.value.label.en : fact.value.kind === "text" ? fact.value.text.en : fact.value.kind === "number" ? `${fact.value.value}${fact.value.unit ? ` ${fact.value.unit}` : ""}` : fact.value.kind === "date" ? fact.value.isoDate : String(fact.value.value);
  return `${fact.entity.label.en} | ${fact.relation} | ${value}`;
}
