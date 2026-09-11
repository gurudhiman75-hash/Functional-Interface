import type { KnowledgeFact } from "../../types";
import { GEO_RIV_001_CP009_COURSE_STATE_FACTS_V1 } from "./geo-riv-001-cp009-facts";

function stateFromFact(fact: KnowledgeFact) {
  if (fact.relation !== "flows_through_state") throw new Error(`CP009 scope received non-course relation: ${fact.relation}`);
  if (fact.value.kind !== "entity_ref") throw new Error(`CP009 course-state fact must point to a state entity: ${fact.factId}`);
  return fact.value.label.en;
}

const COURSE_FACTS = GEO_RIV_001_CP009_COURSE_STATE_FACTS_V1 as readonly KnowledgeFact[];
const stateSetsByRiver = new Map<string, Set<string>>();
const riverSetsByState = new Map<string, Set<string>>();

for (const fact of COURSE_FACTS) {
  const river = fact.entity.label.en;
  const state = stateFromFact(fact);
  const states = stateSetsByRiver.get(river) ?? new Set<string>();
  states.add(state);
  stateSetsByRiver.set(river, states);
  const rivers = riverSetsByState.get(state) ?? new Set<string>();
  rivers.add(river);
  riverSetsByState.set(state, rivers);
}

export const GEO_RIV_001_CP009_REVIEW_SCOPE_V1 = Object.freeze({
  scopeId: "GEO-RIV-001-CP009-MAIN-COURSE-SCOPE-V1" as const,
  relation: "flows_through_state" as const,
  meaning: "The named river's main course/main stem passes through the named Indian state." as const,
  includedRivers: Object.freeze([...stateSetsByRiver.keys()].sort()),
  includedStates: Object.freeze([...riverSetsByState.keys()].sort()),
  courseFactCount: COURSE_FACTS.length,
  closedWorldForIncludedRiverCourseQuestions: true as const,
  completeForIncludedRiversMainCourseInIndia: true as const,
  universalGeographyCompletenessClaim: false as const,
  excludedRelation: "drains_state" as const,
  basinStateConflationForbidden: true as const,
  negativeInferenceRule:
    "For the rivers included in this checkpoint, absence from that river's canonical main-course state list may be used only to reject a FLOWS_THROUGH claim. It must not be used to reject basin/catchment drainage." as const,
});

export function geoRiv001Cp009CourseStatesForRiver(river: string) {
  return Object.freeze([...(stateSetsByRiver.get(river) ?? new Set<string>())].sort());
}

export function geoRiv001Cp009CourseRiversForState(state: string) {
  return Object.freeze([...(riverSetsByState.get(state) ?? new Set<string>())].sort());
}

export function geoRiv001Cp009IsCourseState(river: string, state: string) {
  return stateSetsByRiver.get(river)?.has(state) ?? false;
}

export function auditGeoRiv001Cp009ScopeV1() {
  const issues: string[] = [];
  const factKeys = new Set<string>();

  for (const fact of COURSE_FACTS) {
    if (fact.relation !== "flows_through_state") issues.push(`RELATION:${fact.factId}:${fact.relation}`);
    const river = fact.entity.label.en;
    const state = stateFromFact(fact);
    const key = `${river}|${state}`;
    if (factKeys.has(key)) issues.push(`DUPLICATE:${key}`);
    factKeys.add(key);
  }

  if (COURSE_FACTS.length !== 25) issues.push(`COURSE_FACT_COUNT:${COURSE_FACTS.length}`);
  if (stateSetsByRiver.size !== 9) issues.push(`RIVER_COUNT:${stateSetsByRiver.size}`);
  if (riverSetsByState.size !== 12) issues.push(`STATE_COUNT:${riverSetsByState.size}`);
  if (!GEO_RIV_001_CP009_REVIEW_SCOPE_V1.basinStateConflationForbidden) issues.push("BASIN_CONFLATION_GUARD_DISABLED");
  if (!GEO_RIV_001_CP009_REVIEW_SCOPE_V1.closedWorldForIncludedRiverCourseQuestions) issues.push("CLOSED_WORLD_REVIEW_SCOPE_DISABLED");
  if (GEO_RIV_001_CP009_REVIEW_SCOPE_V1.universalGeographyCompletenessClaim) issues.push("UNIVERSAL_COMPLETENESS_CLAIM_FORBIDDEN");

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    courseFactCount: COURSE_FACTS.length,
    riverCount: stateSetsByRiver.size,
    stateCount: riverSetsByState.size,
    uniqueCoursePairCount: factKeys.size,
  });
}
