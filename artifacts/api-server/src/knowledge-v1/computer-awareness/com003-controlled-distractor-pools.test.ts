import { strict as assert } from "node:assert";

import {
  COM003_CONTROLLED_DISTRACTOR_POOLS,
  auditCom003ControlledDistractorPools,
} from "./com003-controlled-distractor-pools";

// One-off CI trigger for the governed distractor checkpoint.
const audit = auditCom003ControlledDistractorPools();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.poolCount, 23);
assert.equal(audit.optionCount >= 100, true);
assert.equal(audit.sourceGroundedOptionCount > 0, true);
assert.equal(audit.allRequiredPoolsImplemented, true);
assert.equal(audit.sharedEngineChangeRequired, false);
assert.equal(audit.controlledPoolImplementationComplete, true);
assert.equal(audit.permanentQlCount, 0);
assert.equal(audit.allocationReady, false);
assert.equal(audit.productionEligible, false);

for (const pool of COM003_CONTROLLED_DISTRACTOR_POOLS) {
  assert.equal(pool.options.length >= 4, true, `${pool.poolId} is too thin`);
  assert.equal(
    pool.options.every((option) => Boolean(option.basisFactIds?.length || option.authoritySourceIds?.length)),
    true,
    `${pool.poolId} contains an ungrounded option`,
  );
}

for (const requiredPool of [
  "office-application-identities",
  "word-formatting-shortcuts",
  "excel-formula-prefix-symbols",
  "excel-reference-notation",
  "excel-basic-chart-types",
  "powerpoint-version-scoped-tabs",
  "powerpoint-slideshow-shortcuts",
]) {
  assert.equal(
    COM003_CONTROLLED_DISTRACTOR_POOLS.some((pool) => pool.poolId === requiredPool),
    true,
    `Missing ${requiredPool}`,
  );
}

console.log("[COM003-CONTROLLED-DISTRACTOR-POOLS]", audit);
