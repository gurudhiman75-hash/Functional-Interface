import { GEO_RIV_001_CP008_MOUTH_RELATIONS_V1, GEO_RIV_001_CP008_PROJECTED_FACTS_V1, GEO_RIV_001_CP008_PROJECTION_AUTHORITY_V1, GEO_RIV_001_CP008_SOURCE_RELATIONS_V1 } from "./geo-riv-001-cp008-facts";

const SOURCE_RELATIONS = new Set<string>(GEO_RIV_001_CP008_SOURCE_RELATIONS_V1);
const MOUTH_RELATIONS = new Set<string>(GEO_RIV_001_CP008_MOUTH_RELATIONS_V1);
const ALLOWED_UPSTREAMS = new Set(GEO_RIV_001_CP008_PROJECTION_AUTHORITY_V1.admittedUpstreams);

export function auditGeoRiv001Cp008ProjectionV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const upstreamCounts: Record<string, number> = { cp002: 0, cp003: 0, cp004: 0, cp005: 0 };
  const relationCounts: Record<string, number> = {};
  let sourceCount = 0;
  let mouthCount = 0;
  let lineageCount = 0;

  for (const fact of GEO_RIV_001_CP008_PROJECTED_FACTS_V1) {
    if (ids.has(fact.factId)) issues.push(`DUPLICATE_FACT_ID:${fact.factId}`);
    ids.add(fact.factId);

    if (fact.cpId !== "GEO-RIV-001-CP008") issues.push(`WRONG_CP:${fact.factId}:${fact.cpId}`);
    if (fact.chapterId !== "GEO-RIV-001") issues.push(`WRONG_CHAPTER:${fact.factId}:${fact.chapterId}`);
    if (fact.review.status !== "REVIEW_REQUIRED") issues.push(`WRONG_REVIEW_STATUS:${fact.factId}`);
    if (fact.freshness.class !== "IMMUTABLE") issues.push(`NON_IMMUTABLE:${fact.factId}`);
    if (!fact.source?.sourceId || !fact.source.title) issues.push(`MISSING_SOURCE:${fact.factId}`);

    const upstream = fact.tags.find((tag) => tag.startsWith("upstream:"))?.slice("upstream:".length);
    const upstreamFact = fact.tags.find((tag) => tag.startsWith("upstream-fact:"))?.slice("upstream-fact:".length);
    if (!upstream || !ALLOWED_UPSTREAMS.has(upstream as never)) issues.push(`BAD_UPSTREAM:${fact.factId}:${upstream ?? "missing"}`);
    else upstreamCounts[upstream] = (upstreamCounts[upstream] ?? 0) + 1;
    if (!upstreamFact) issues.push(`MISSING_LINEAGE:${fact.factId}`);
    else lineageCount += 1;
    if (upstream === "cp006" || upstreamFact?.includes("cp006")) issues.push(`UNAPPROVED_CP006_LEAK:${fact.factId}`);

    relationCounts[fact.relation] = (relationCounts[fact.relation] ?? 0) + 1;
    if (SOURCE_RELATIONS.has(fact.relation)) sourceCount += 1;
    else if (MOUTH_RELATIONS.has(fact.relation)) mouthCount += 1;
    else issues.push(`OUT_OF_SCOPE_RELATION:${fact.factId}:${fact.relation}`);
  }

  for (const upstream of GEO_RIV_001_CP008_PROJECTION_AUTHORITY_V1.admittedUpstreams) {
    if ((upstreamCounts[upstream] ?? 0) === 0) issues.push(`MISSING_UPSTREAM_COVERAGE:${upstream}`);
  }
  if (GEO_RIV_001_CP008_PROJECTED_FACTS_V1.length < 30) issues.push("PROJECTED_CORPUS_TOO_SMALL");
  if (sourceCount < 20) issues.push("SOURCE_COVERAGE_TOO_SMALL");
  if (mouthCount < 4) issues.push("MOUTH_COVERAGE_TOO_SMALL");
  if (lineageCount !== GEO_RIV_001_CP008_PROJECTED_FACTS_V1.length) issues.push("LINEAGE_COUNT_MISMATCH");

  return {
    valid: issues.length === 0,
    issues,
    factCount: GEO_RIV_001_CP008_PROJECTED_FACTS_V1.length,
    lineageCount,
    sourceCount,
    mouthCount,
    upstreamCounts,
    relationCounts,
  };
}
