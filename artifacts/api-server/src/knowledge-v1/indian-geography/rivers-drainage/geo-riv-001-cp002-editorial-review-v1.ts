import type { KnowledgeFact } from "../../types";
import { GEO_RIV_001_CP002_FACT_CANDIDATES } from "./geo-riv-001-cp002-facts";
import { toGeoRiv001FactSource } from "./geo-riv-001-source-authorities";

const REPLACED_CANDIDATE_IDS = new Set([
  "geo-riv-001-cp002-tributary-chandra-chenab-headstream",
  "geo-riv-001-cp002-tributary-bhaga-chenab-headstream",
]);

function headstreamFact(id: "chandra" | "bhaga", label: "Chandra" | "Bhaga"): KnowledgeFact {
  return {
    factId: `geo-riv-001-cp002-headstream-${id}-chenab`,
    entityId: `geo:river:${id}`,
    subject: "Static GK — Indian Geography",
    chapterId: "GEO-RIV-001",
    cpId: "GEO-RIV-001-CP002",
    relation: "headstream_of",
    entity: {
      canonicalName: label,
      label: { en: label },
    },
    value: {
      kind: "entity_ref",
      entityId: "geo:river:chenab",
      label: { en: "Chenab" },
    },
    contextGroupId: "geo-riv-chenab-headstreams",
    distractorGroupIds: ["geo-riv-indus-river-entities", "geo-riv-indus-secondary-tributaries"],
    difficulty: "Medium",
    examTags: ["SSC", "RAILWAY", "BANKING", "STATE_EXAMS", "UPSC"],
    tags: ["indus-system", "headstream", "chenab", id],
    source: toGeoRiv001FactSource(
      "CWC-INDUS-BASIN-ORGANISATION",
      "Chenab River Basin — Chandra and Bhaga merge at Tandi to form Chenab (Chandra Bhaga)",
    ),
    review: {
      status: "REVIEW_REQUIRED",
      confidence: 0.98,
    },
    freshness: {
      class: "IMMUTABLE",
      lastVerifiedAt: "2026-09-09",
    },
  };
}

export const GEO_RIV_001_CP002_REVIEWABLE_FACTS_V1: KnowledgeFact[] = [
  ...GEO_RIV_001_CP002_FACT_CANDIDATES.filter(
    (fact) => !REPLACED_CANDIDATE_IDS.has(fact.factId),
  ),
  headstreamFact("chandra", "Chandra"),
  headstreamFact("bhaga", "Bhaga"),
];

export const GEO_RIV_001_CP002_EDITORIAL_DECISIONS_V1 = Object.freeze({
  authorityId: "GEO-RIV-001-CP002-EDITORIAL-REVIEW-V1" as const,
  status: "REVIEW_REQUIRED" as const,
  candidateCount: GEO_RIV_001_CP002_FACT_CANDIDATES.length,
  reviewableCount: GEO_RIV_001_CP002_REVIEWABLE_FACTS_V1.length,
  replacements: Object.freeze([
    Object.freeze({
      removedFactId: "geo-riv-001-cp002-tributary-chandra-chenab-headstream",
      replacementFactId: "geo-riv-001-cp002-headstream-chandra-chenab",
      reason: "Chandra is represented as a headstream of Chenab; no synthetic parent river is introduced.",
    }),
    Object.freeze({
      removedFactId: "geo-riv-001-cp002-tributary-bhaga-chenab-headstream",
      replacementFactId: "geo-riv-001-cp002-headstream-bhaga-chenab",
      reason: "Bhaga is represented as a headstream of Chenab; no synthetic parent river is introduced.",
    }),
  ]),
  locks: Object.freeze({
    currentTreatyPolicyFactsAllowed: false as const,
    changingProjectStatusFactsAllowed: false as const,
    unsupportedExactLengthFactsAllowed: false as const,
    syntheticRiverParentsAllowed: false as const,
  }),
});
