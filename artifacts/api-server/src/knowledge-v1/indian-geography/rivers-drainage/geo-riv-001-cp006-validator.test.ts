import { strict as assert } from "node:assert";
import { GEO_RIV_001_CP006_FACTS_V1, GEO_RIV_001_CP006_FACT_COUNT_V1 } from "./geo-riv-001-cp006-facts";
import { GEO_RIV_001_CP006_SOURCE_AUTHORITIES_V1 } from "./geo-riv-001-cp006-source-authorities";

assert.equal(GEO_RIV_001_CP006_FACT_COUNT_V1, 53);
assert.equal(new Set(GEO_RIV_001_CP006_FACTS_V1.map((f) => f.factId)).size, 53);
for (const fact of GEO_RIV_001_CP006_FACTS_V1) {
  assert.equal(fact.factId.startsWith("geo-riv-001-cp006-"), true);
  assert.equal(Boolean(fact.entity && fact.relation && fact.value && fact.system), true);
  assert.equal(Object.hasOwn(GEO_RIV_001_CP006_SOURCE_AUTHORITIES_V1, fact.source.sourceId), true);
  assert.equal(Boolean(fact.source.locator), true);
  assert.equal(Object.isFrozen(fact), true);
}
assert.equal(GEO_RIV_001_CP006_FACTS_V1.some((f) => f.factId.endsWith("luni-terminal") && f.value === "Rann of Kutch"), true);
assert.equal(GEO_RIV_001_CP006_FACTS_V1.some((f) => f.factId.endsWith("rift-narmada")), true);
assert.equal(GEO_RIV_001_CP006_FACTS_V1.some((f) => f.factId.endsWith("rift-tapi")), true);
