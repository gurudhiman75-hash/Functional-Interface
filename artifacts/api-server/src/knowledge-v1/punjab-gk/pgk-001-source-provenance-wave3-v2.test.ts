import { strict as assert } from "node:assert";

import {
  PGK_001_SOURCE_COVERAGE_CP019_TO_CP026_V2,
  auditPgk001SourceCoverageCp019ToCp026V2,
} from "./pgk-001-source-provenance-wave3-v2";

const audit = auditPgk001SourceCoverageCp019ToCp026V2();

assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.cpCount, 8);
assert.ok(audit.factCount > 0);

for (const cp of PGK_001_SOURCE_COVERAGE_CP019_TO_CP026_V2) {
  assert.equal(cp.valid, true, cp.issues.join("\n"));
  assert.equal(cp.mappedFactCount, cp.canonicalFactCount);
  assert.ok(cp.resolvedSourceCount > 0);
}
