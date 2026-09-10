import { strict as assert } from "node:assert";
import { GEO_RIV_001_CP008_PROJECTED_FACTS_V1, GEO_RIV_001_CP008_PROJECTION_AUTHORITY_V1 } from "./geo-riv-001-cp008-facts";
import { auditGeoRiv001Cp008ProjectionV1 } from "./geo-riv-001-cp008-validator";

const audit = auditGeoRiv001Cp008ProjectionV1();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.factCount, GEO_RIV_001_CP008_PROJECTED_FACTS_V1.length);
assert.equal(audit.lineageCount, audit.factCount);
assert.equal(GEO_RIV_001_CP008_PROJECTION_AUTHORITY_V1.reviewOnly, true);
assert.deepEqual(GEO_RIV_001_CP008_PROJECTION_AUTHORITY_V1.heldOutUpstreams, ["cp006"]);
assert.ok(audit.sourceCount >= 20);
assert.ok(audit.mouthCount >= 4);
for (const upstream of ["cp002", "cp003", "cp004", "cp005"]) {
  assert.ok((audit.upstreamCounts[upstream] ?? 0) > 0, `Missing ${upstream}`);
}
assert.equal(GEO_RIV_001_CP008_PROJECTED_FACTS_V1.some((fact) => fact.tags.includes("upstream:cp006")), false);
console.log(JSON.stringify(audit, null, 2));
