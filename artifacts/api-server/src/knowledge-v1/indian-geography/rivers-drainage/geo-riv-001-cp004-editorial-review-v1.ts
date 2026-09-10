import { GEO_RIV_001_CP004_FACTS_V1 } from "./geo-riv-001-cp004-facts";

export const GEO_RIV_001_CP004_REVIEWABLE_FACTS_V1 = Object.freeze(
  GEO_RIV_001_CP004_FACTS_V1.map((fact) =>
    Object.freeze({
      ...fact,
      tags: Object.freeze([...(fact.tags ?? [])]),
      examTags: Object.freeze([...(fact.examTags ?? [])]),
      distractorGroupIds: Object.freeze([...(fact.distractorGroupIds ?? [])]),
    }),
  ),
);
