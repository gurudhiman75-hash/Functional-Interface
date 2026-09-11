import { strict as assert } from "node:assert";
import { auditGeoRiv001Cp009FactsV1 } from "./geo-riv-001-cp009-validator";

const audit = auditGeoRiv001Cp009FactsV1();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.courseFactCount, 25);
assert.equal(audit.riverCount, 9);
assert.ok(audit.sourceStateFactCount >= 5);
assert.ok(audit.sourceCount >= 10);
assert.deepEqual(audit.courseStatesByRiver.Brahmaputra, ["Arunachal Pradesh", "Assam"]);
assert.deepEqual(audit.courseStatesByRiver.Cauvery, ["Karnataka", "Tamil Nadu"]);
assert.deepEqual(audit.courseStatesByRiver.Pennar, ["Andhra Pradesh", "Karnataka"]);
assert.deepEqual(audit.courseStatesByRiver.Subarnarekha, ["Jharkhand", "Odisha", "West Bengal"]);

console.log(JSON.stringify(audit, null, 2));
