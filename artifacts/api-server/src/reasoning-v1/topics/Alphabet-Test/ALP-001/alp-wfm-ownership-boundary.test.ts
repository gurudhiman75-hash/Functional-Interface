import assert from "node:assert/strict";

import { WFM_001_QL_IDS } from "../../Word-Formation/WFM-001/runtime";
import { ALP_001_QLS } from "./ql-registry";
import { ALP_WFM_OWNERSHIP_BOUNDARY_V2 } from "./alp-wfm-ownership-boundary";

assert.equal(ALP_001_QLS.length, 156);
assert.deepEqual(WFM_001_QL_IDS, [
  "WFM-QL-001",
  "WFM-QL-002",
  "WFM-QL-003",
  "WFM-QL-004",
]);

assert.equal(ALP_WFM_OWNERSHIP_BOUNDARY_V2.alpPackageId, "ALP-001");
assert.equal(ALP_WFM_OWNERSHIP_BOUNDARY_V2.wfmPackageId, "WFM-001");
assert.equal(ALP_WFM_OWNERSHIP_BOUNDARY_V2.lifecycle.movesExistingAlpQl, false);
assert.equal(ALP_WFM_OWNERSHIP_BOUNDARY_V2.lifecycle.allocatesNewAlpQl, false);
assert.equal(ALP_WFM_OWNERSHIP_BOUNDARY_V2.lifecycle.allocatesNewWfmQl, false);
assert.equal(ALP_WFM_OWNERSHIP_BOUNDARY_V2.lifecycle.opensQuestionBank, false);
assert.equal(ALP_WFM_OWNERSHIP_BOUNDARY_V2.lifecycle.opensMockDelivery, false);
assert.equal(ALP_WFM_OWNERSHIP_BOUNDARY_V2.lifecycle.opensPublicDelivery, false);

// ALP may inspect or rearrange letters inside a supplied word, but none of its
// permanent solve contracts may claim the WFM semantic surface: constructing
// or counting newly formed meaningful words from a letter multiset.
for (const ql of ALP_001_QLS) {
  const semanticSurface = JSON.stringify(ql).toUpperCase();
  assert.doesNotMatch(
    semanticSurface,
    /MEANINGFUL[_ -]?WORD|CAN[_ -]?FORM|CANNOT[_ -]?FORM|WORD[_ -]?FORMATION|ANAGRAM[_ -]?COUNT/,
    `${ql.qlId} leaks the WFM semantic ownership surface into ALP-001.`,
  );
}

assert.match(
  ALP_WFM_OWNERSHIP_BOUNDARY_V2.selectedPositionRule,
  /belongs to WFM when the final learner task is meaningful-word formation or counting/,
);
assert.match(ALP_WFM_OWNERSHIP_BOUNDARY_V2.worBoundary, /WOR-001/);
assert.match(ALP_WFM_OWNERSHIP_BOUNDARY_V2.codBoundary, /COD-001/);

console.log("ALP-001 / WFM-001 semantic ownership boundary passed.", {
  alpQlCount: ALP_001_QLS.length,
  wfmQlIds: WFM_001_QL_IDS,
  authority: ALP_WFM_OWNERSHIP_BOUNDARY_V2.authorityId,
});
