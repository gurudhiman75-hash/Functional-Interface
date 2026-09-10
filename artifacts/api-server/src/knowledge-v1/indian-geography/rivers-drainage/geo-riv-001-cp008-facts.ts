import type { KnowledgeFact } from "../../types";
import { GEO_RIV_001_CP002_REVIEWABLE_FACTS_V1 } from "./geo-riv-001-cp002-editorial-review-v1";
import { GEO_RIV_001_CP003_REVIEWABLE_FACTS_V1 } from "./geo-riv-001-cp003-editorial-review-v1";
import { GEO_RIV_001_CP004_REVIEWABLE_FACTS_V1 } from "./geo-riv-001-cp004-editorial-review-v1";
import { GEO_RIV_001_CP005_REVIEWABLE_FACTS_V1 } from "./geo-riv-001-cp005-editorial-review-v1";

const CP_ID = "GEO-RIV-001-CP008";

export const GEO_RIV_001_CP008_SOURCE_RELATIONS_V1 = Object.freeze([
  "originates_from",
  "originates_near",
  "originates_at",
  "source_point",
  "source_region",
  "source_range",
  "source_state",
  "source_district",
] as const);

export const GEO_RIV_001_CP008_MOUTH_RELATIONS_V1 = Object.freeze([
  "drains_into",
] as const);

const ELIGIBLE_RELATIONS = new Set<string>([
  ...GEO_RIV_001_CP008_SOURCE_RELATIONS_V1,
  ...GEO_RIV_001_CP008_MOUTH_RELATIONS_V1,
]);

const UPSTREAM_FACTS = Object.freeze({
  cp002: GEO_RIV_001_CP002_REVIEWABLE_FACTS_V1,
  cp003: GEO_RIV_001_CP003_REVIEWABLE_FACTS_V1,
  cp004: GEO_RIV_001_CP004_REVIEWABLE_FACTS_V1,
  cp005: GEO_RIV_001_CP005_REVIEWABLE_FACTS_V1,
});

export type GeoRiv001Cp008UpstreamId = keyof typeof UPSTREAM_FACTS;

function projectFact(fact: KnowledgeFact, upstream: GeoRiv001Cp008UpstreamId): KnowledgeFact {
  return {
    ...fact,
    factId: `geo-riv-001-cp008-proj-${upstream}-${fact.factId}`,
    cpId: CP_ID,
    tags: [
      ...fact.tags,
      "cp008-source-mouth-projection",
      `upstream:${upstream}`,
      `upstream-fact:${fact.factId}`,
    ],
    review: {
      ...fact.review,
      status: "REVIEW_REQUIRED",
    },
  };
}

const projected: KnowledgeFact[] = [];
for (const [upstream, facts] of Object.entries(UPSTREAM_FACTS) as Array<[
  GeoRiv001Cp008UpstreamId,
  readonly KnowledgeFact[],
]>) {
  for (const fact of facts) {
    if (!ELIGIBLE_RELATIONS.has(fact.relation)) continue;
    projected.push(projectFact(fact, upstream));
  }
}

export const GEO_RIV_001_CP008_PROJECTED_FACTS_V1 = Object.freeze(projected);

export const GEO_RIV_001_CP008_PROJECTION_AUTHORITY_V1 = Object.freeze({
  authorityId: "GEO-RIV-001-CP008-SOURCE-MOUTH-PROJECTION-V1" as const,
  chapterId: "GEO-RIV-001" as const,
  cpId: CP_ID as const,
  admittedUpstreams: Object.freeze(["cp002", "cp003", "cp004", "cp005"] as const),
  heldOutUpstreams: Object.freeze(["cp006"] as const),
  sourceRelations: GEO_RIV_001_CP008_SOURCE_RELATIONS_V1,
  mouthRelations: GEO_RIV_001_CP008_MOUTH_RELATIONS_V1,
  duplicateTruthCorpus: false as const,
  preservesOriginalSourceMetadata: true as const,
  preservesOriginalFactLineage: true as const,
  reviewOnly: true as const,
});
