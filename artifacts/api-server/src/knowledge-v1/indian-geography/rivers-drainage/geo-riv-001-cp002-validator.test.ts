import { strict as assert } from "node:assert";

import {
  GEO_RIV_001_CP002_EDITORIAL_DECISIONS_V1,
  GEO_RIV_001_CP002_REVIEWABLE_FACTS_V1,
} from "./geo-riv-001-cp002-editorial-review-v1";
import { auditGeoRiv001Cp002Facts } from "./geo-riv-001-cp002-validator";
import {
  GEO_RIV_001_SOURCE_AUTHORITIES,
  auditGeoRiv001SourceAuthorities,
} from "./geo-riv-001-source-authorities";

const sourceAudit = auditGeoRiv001SourceAuthorities();
assert.equal(sourceAudit.valid, true, sourceAudit.issues.join("\n"));
assert.equal(sourceAudit.sourceCount, 8);

const sourceIds = new Set(GEO_RIV_001_SOURCE_AUTHORITIES.map((source) => source.sourceId));
for (const sourceId of [
  "CWC-INDUS-BASIN-ORGANISATION",
  "BBMB-BEAS-PONG-PSP-HYDROLOGY",
  "CWC-RAVI-BEAS-WATERS-TRIBUNAL-1987",
  "CWC-NATIONAL-COMMISSION-FLOODS-REPORT-V1",
]) {
  assert.equal(sourceIds.has(sourceId), true, sourceId);
}

assert.equal(GEO_RIV_001_CP002_EDITORIAL_DECISIONS_V1.candidateCount, 42);
assert.equal(GEO_RIV_001_CP002_EDITORIAL_DECISIONS_V1.reviewableCount, 42);
assert.equal(GEO_RIV_001_CP002_EDITORIAL_DECISIONS_V1.locks.currentTreatyPolicyFactsAllowed, false);
assert.equal(GEO_RIV_001_CP002_EDITORIAL_DECISIONS_V1.locks.syntheticRiverParentsAllowed, false);

const audit = auditGeoRiv001Cp002Facts();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.factCount, 42);
assert.deepEqual(new Set(audit.mainTributaries), new Set(["Jhelum", "Chenab", "Ravi", "Beas", "Satluj"]));
assert.equal(audit.joinChainCount, 4);
assert.equal(audit.relationCounts.headstream_of, 2);
assert.equal(audit.relationCounts.main_tributary_of, 5);
assert.equal(audit.relationCounts.joins_river, 4);

const factIds = new Set(GEO_RIV_001_CP002_REVIEWABLE_FACTS_V1.map((fact) => fact.factId));
assert.equal(factIds.size, GEO_RIV_001_CP002_REVIEWABLE_FACTS_V1.length);
assert.equal(factIds.has("geo-riv-001-cp002-headstream-chandra-chenab"), true);
assert.equal(factIds.has("geo-riv-001-cp002-headstream-bhaga-chenab"), true);
assert.equal(factIds.has("geo-riv-001-cp002-tributary-chandra-chenab-headstream"), false);
assert.equal(factIds.has("geo-riv-001-cp002-tributary-bhaga-chenab-headstream"), false);

for (const fact of GEO_RIV_001_CP002_REVIEWABLE_FACTS_V1) {
  assert.equal(fact.review.status, "REVIEW_REQUIRED");
  assert.equal(fact.freshness.class, "IMMUTABLE");
  assert.equal(Boolean(fact.source.locator?.trim()), true, fact.factId);
  assert.notEqual(fact.value.kind, "date");
  assert.notEqual(fact.value.kind, "number");
}
