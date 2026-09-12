import { strict as assert } from "node:assert";
import { auditGeoRiv001Cp004FactsV1 } from "./geo-riv-001-cp004-validator";

const audit = auditGeoRiv001Cp004FactsV1();
assert.equal(audit.valid, true, audit.issues.join(", "));
assert.equal(audit.factCount, 48);
assert.equal(audit.uniqueFactCount, 48);
assert.equal(audit.sourceCount, 7);
