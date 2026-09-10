import { strict as assert } from "node:assert";
import { GEO_RIV_001_CP007_PROJECTED_FACTS_V1 } from "./geo-riv-001-cp007-facts";
import { auditGeoRiv001Cp007FactsV1 } from "./geo-riv-001-cp007-validator";

const audit = auditGeoRiv001Cp007FactsV1();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.ok(audit.factCount >= 40);
assert.equal(audit.factCount, GEO_RIV_001_CP007_PROJECTED_FACTS_V1.length);
assert.equal(audit.factCount, audit.lineageCount);
assert.ok(audit.relationFamilies.parent >= 20);
assert.ok(audit.relationFamilies.confluence >= 8);
assert.ok(audit.relationFamilies.bank >= 8);
assert.equal(audit.sourceCounts.cp006, undefined);
console.log(JSON.stringify(audit, null, 2));
