import { strict as assert } from "node:assert";

import { GEO_RIV_001_CP003_FACTS } from "./geo-riv-001-cp003-facts";
import { auditGeoRiv001Cp003Facts } from "./geo-riv-001-cp003-validator";

const audit = auditGeoRiv001Cp003Facts();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.factCount, 55);
assert.equal(audit.uniqueFactCount, 55);
assert.equal(audit.sourceCount, 4);
assert.equal(new Set(GEO_RIV_001_CP003_FACTS.map((fact) => fact.factId)).size, 55);
assert.equal(GEO_RIV_001_CP003_FACTS.every((fact) => fact.cpId === "GEO-RIV-001-CP003"), true);
assert.equal(GEO_RIV_001_CP003_FACTS.every((fact) => fact.review.status === "REVIEW_REQUIRED"), true);
assert.equal(GEO_RIV_001_CP003_FACTS.every((fact) => fact.freshness.class === "IMMUTABLE"), true);
assert.equal(GEO_RIV_001_CP003_FACTS.every((fact) => Boolean(fact.source.locator?.trim())), true);
