import type { KnowledgeFact } from "../../types";
import { GEO_RIV_001_CP003_FACTS } from "./geo-riv-001-cp003-facts";

const BHAGIRATHI_ALAKNANDA_ID = "geo-riv-001-cp003-bhagirathi-alaknanda";

/**
 * CP003 reviewed fact overlay.
 *
 * Bhagirathi and Alaknanda are the two headwater streams whose confluence at
 * Devprayag marks the start of the Ganga name.  The raw candidate corpus used
 * the generic tributary helper for the Devprayag relation; this overlay
 * deliberately normalizes that edge to `joins_river` so downstream generators
 * cannot describe Bhagirathi as a tributary of Alaknanda.
 */
export const GEO_RIV_001_CP003_REVIEWABLE_FACTS_V1: KnowledgeFact[] =
  GEO_RIV_001_CP003_FACTS.map((fact) => {
    if (fact.factId !== BHAGIRATHI_ALAKNANDA_ID) return fact;
    return {
      ...fact,
      relation: "joins_river",
      contextGroupId: "geo-riv-ganga-headwater-confluence",
      distractorGroupIds: ["geo-riv-ganga-river-entities", "geo-riv-ganga-headwaters"],
      tags: ["ganga-system", "headwater-confluence", "devprayag"],
    };
  });

export const GEO_RIV_001_CP003_EDITORIAL_DECISIONS_V1 = Object.freeze({
  bhagirathiAlaknandaRelation: "JOIN_CONFLUENCE_NOT_TRIBUTARY" as const,
  visualPolicy: "OPTIONAL_MANUAL_EDITORIAL_ATTACHMENT" as const,
  wordingStandard: "SIMPLE_EXAM_LIKE" as const,
});
