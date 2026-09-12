import { strict as assert } from "node:assert";

import { GEO_RIV_001_CP003_REVIEWABLE_FACTS_V1 } from "./geo-riv-001-cp003-editorial-review-v1";

assert.equal(GEO_RIV_001_CP003_REVIEWABLE_FACTS_V1.length, 55);
assert.equal(new Set(GEO_RIV_001_CP003_REVIEWABLE_FACTS_V1.map((fact) => fact.factId)).size, 55);

const bhagirathiJoin = GEO_RIV_001_CP003_REVIEWABLE_FACTS_V1.find(
  (fact) => fact.factId === "geo-riv-001-cp003-bhagirathi-alaknanda",
);
assert.ok(bhagirathiJoin);
assert.equal(bhagirathiJoin.relation, "joins_river");
assert.equal(
  GEO_RIV_001_CP003_REVIEWABLE_FACTS_V1.some(
    (fact) => fact.entity.label.en === "Bhagirathi" && fact.relation === "tributary_of" && fact.value.kind === "entity_ref" && fact.value.label.en === "Alaknanda",
  ),
  false,
);
