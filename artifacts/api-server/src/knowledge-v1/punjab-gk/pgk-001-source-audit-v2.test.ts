import { strict as assert } from "node:assert";

import {
  PGK_001_CP004_FACT_IDS,
  PGK_001_CP004_FACT_SOURCE_IDS,
  PGK_001_CP004_SOURCE_REGISTRY,
  auditPgk001Cp004FactSources,
} from "./pgk-001-cp004-facts";
import {
  PGK_001_CP006_FACT_IDS,
  PGK_001_CP006_FACT_SOURCE_IDS,
  PGK_001_CP006_SOURCE_REGISTRY,
  auditPgk001Cp006FactSources,
} from "./pgk-001-cp006-facts";

const cp004 = auditPgk001Cp004FactSources();
assert.equal(cp004.valid, true, cp004.issues.join("\n"));
assert.equal(cp004.factCount, PGK_001_CP004_FACT_IDS.length);
assert.equal(cp004.mappedFactCount, PGK_001_CP004_FACT_IDS.length);
assert.equal(
  Object.keys(PGK_001_CP004_FACT_SOURCE_IDS).length,
  PGK_001_CP004_FACT_IDS.length,
);
for (const sourceIds of Object.values(PGK_001_CP004_FACT_SOURCE_IDS)) {
  assert.ok(sourceIds.length > 0);
  for (const sourceId of sourceIds) assert.ok(sourceId in PGK_001_CP004_SOURCE_REGISTRY);
}

const cp006 = auditPgk001Cp006FactSources();
assert.equal(cp006.valid, true, cp006.issues.join("\n"));
assert.equal(cp006.factCount, PGK_001_CP006_FACT_IDS.length);
assert.equal(cp006.mappedFactCount, PGK_001_CP006_FACT_IDS.length);
assert.equal(
  Object.keys(PGK_001_CP006_FACT_SOURCE_IDS).length,
  PGK_001_CP006_FACT_IDS.length,
);
for (const sourceIds of Object.values(PGK_001_CP006_FACT_SOURCE_IDS)) {
  assert.ok(sourceIds.length > 0);
  for (const sourceId of sourceIds) assert.ok(sourceId in PGK_001_CP006_SOURCE_REGISTRY);
}

for (const source of Object.values(PGK_001_CP006_SOURCE_REGISTRY)) {
  assert.ok(source.authority.trim().length > 0);
  assert.ok(source.title.trim().length > 0);
  assert.match(source.url, /^https:\/\//);
  assert.ok(source.classification.trim().length > 0);
}
