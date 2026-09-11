import { strict as assert } from "node:assert";
import { GEO_RIV_001_CP007_PROJECTED_FACTS_V1 } from "./geo-riv-001-cp007-facts";
import { auditGeoRiv001Cp007FactsV1 } from "./geo-riv-001-cp007-validator";

const audit = auditGeoRiv001Cp007FactsV1();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.ok(audit.factCount >= 50);
assert.equal(audit.factCount, GEO_RIV_001_CP007_PROJECTED_FACTS_V1.length);
assert.equal(audit.factCount, audit.lineageCount);
assert.ok(audit.relationFamilies.parent >= 30);
assert.ok(audit.relationFamilies.confluence >= 8);
assert.ok(audit.relationFamilies.bank >= 20);
for (const token of ["cp002", "cp003", "cp004", "cp005", "cp006"]) assert.ok((audit.sourceCounts[token] ?? 0) > 0, token);
assert.ok((audit.sourceCounts.cp006 ?? 0) >= 12);
console.log(JSON.stringify(audit, null, 2));
