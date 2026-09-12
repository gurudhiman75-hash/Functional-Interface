import { strict as assert } from "node:assert";
import { GEO_RIV_001_CP005_FACTS } from "./geo-riv-001-cp005-facts";
import { auditGeoRiv001Cp005Facts } from "./geo-riv-001-cp005-validator";

const audit = auditGeoRiv001Cp005Facts();
assert.equal(audit.valid, true, audit.issues.join(", "));
assert.equal(audit.factCount, 71);
assert.equal(audit.uniqueFactCount, 71);
assert.equal(audit.sourceCount, 9);
assert.equal(new Set(GEO_RIV_001_CP005_FACTS.map((fact) => fact.factId)).size, 71);
