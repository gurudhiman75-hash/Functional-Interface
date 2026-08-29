import assert from "node:assert/strict";
import { STA_SEMANTIC_EXTENSION_V3_BY_QL, STA_SEMANTIC_EXTENSION_V3_SOURCES } from "./semantic-extension-v3-authorities.ts";
import { routeStaExtendedScenarioBySemantics } from "./semantic-extension-v3-router.ts";

assert.equal(STA_SEMANTIC_EXTENSION_V3_SOURCES.length, 10, "historical V3 source inventory changed");
assert.equal(new Set(STA_SEMANTIC_EXTENSION_V3_SOURCES.map((source) => source.evidenceId)).size, 10, "historical V3 source IDs are not unique");
assert.ok(STA_SEMANTIC_EXTENSION_V3_BY_QL["STA-QL-005"].length >= 16, "historical QL005 research pool unexpectedly thin");
assert.ok(STA_SEMANTIC_EXTENSION_V3_BY_QL["STA-QL-006"].length >= 16, "historical QL006 research pool unexpectedly thin");

for (const qlId of ["STA-QL-005", "STA-QL-006"] as const) {
  for (const scenario of STA_SEMANTIC_EXTENSION_V3_BY_QL[qlId]) {
    assert.equal(routeStaExtendedScenarioBySemantics(scenario), qlId, `${scenario.scenarioId}: historical semantic ownership drift`);
    assert.ok(STA_SEMANTIC_EXTENSION_V3_SOURCES.some((source) => source.evidenceId === scenario.sourceAuthorityId), `${scenario.scenarioId}: missing historical source authority`);
  }
}

console.log("PASS_STA_001_SEMANTIC_EXTENSION_V3_HISTORICAL_SOURCE_EVIDENCE");
console.log("Historical V3 research is preserved; current QL005/QL006 product status is governed by STA V4.1, not this proof.");
