import assert from "node:assert/strict";

import {
  ON_DEMAND_YESTERDAY_STAGES,
  shouldContinueBoundedPass,
  yesterdayPackCompleteness,
} from "./on-demand-yesterday-policy";

assert.deepEqual(ON_DEMAND_YESTERDAY_STAGES, [
  "official_source_refresh",
  "primary_fact_enrichment",
  "manual_authority_guard",
  "intelligence_and_strict_verification",
  "post_promotion_enrichment_reconciliation",
  "draft_authoring_localization_and_questions",
]);

assert.equal(shouldContinueBoundedPass({ seen: 100, batchLimit: 100 }), true);
assert.equal(shouldContinueBoundedPass({ seen: 99, batchLimit: 100 }), false);
assert.equal(shouldContinueBoundedPass({ seen: 100, batchLimit: 100, skipped: true }), false);

const englishOnly = yesterdayPackCompleteness([
  { family: "ssc", language: "en" },
  { family: "banking", language: "en" },
  { family: "punjab", language: "en" },
]);
assert.equal(englishOnly.allEnglishDraftsPresent, true);
assert.equal(englishOnly.allLocalizedDraftsPresent, false);
assert.equal(englishOnly.allNineDraftsPresent, false);
assert.equal(englishOnly.missing.length, 6);

const complete = yesterdayPackCompleteness([
  ...["ssc", "banking", "punjab"].flatMap((family) =>
    ["en", "hi", "pa"].map((language) => ({ family, language })),
  ),
]);
assert.equal(complete.allEnglishDraftsPresent, true);
assert.equal(complete.allLocalizedDraftsPresent, true);
assert.equal(complete.allNineDraftsPresent, true);
assert.deepEqual(complete.missing, []);

console.log("CP026 on-demand yesterday policy contracts passed");
