import assert from "node:assert/strict";

import { classifyOfficialCandidate } from "./official-candidate-reclassification";
import {
  ON_DEMAND_YESTERDAY_STAGES,
  shouldContinueBoundedPass,
  yesterdayPackCompleteness,
} from "./on-demand-yesterday-policy";

assert.deepEqual(ON_DEMAND_YESTERDAY_STAGES, [
  "official_source_refresh",
  "official_candidate_reclassification",
  "primary_fact_enrichment",
  "manual_authority_guard",
  "intelligence_and_strict_verification",
  "post_promotion_enrichment_reconciliation",
  "historical_claim_rebuild_and_reverification",
  "draft_authoring_localization_and_questions",
]);
assert.ok(
  ON_DEMAND_YESTERDAY_STAGES.indexOf("official_candidate_reclassification")
    < ON_DEMAND_YESTERDAY_STAGES.indexOf("intelligence_and_strict_verification"),
  "official candidates must be safely reclassified before promotion intelligence",
);
assert.ok(
  ON_DEMAND_YESTERDAY_STAGES.indexOf("historical_claim_rebuild_and_reverification")
    < ON_DEMAND_YESTERDAY_STAGES.indexOf("draft_authoring_localization_and_questions"),
  "historical claims must be rebuilt and reverified before learner authoring",
);

assert.equal(
  classifyOfficialCandidate({
    title: "Department of Consumer Affairs Notifies Legal Metrology (Indian Standard Time) Rules, 2026",
    sourceKey: "pib",
    sourceFamily: "pib",
    isPrimarySource: true,
    existingCategory: "other",
  }).category,
  "national",
);
assert.equal(
  classifyOfficialCandidate({
    title: "India-Chile CEPA Negotiations Advance as Commerce Secretary Meets Chilean Vice-Minister",
    sourceKey: "pib",
    sourceFamily: "pib",
    isPrimarySource: true,
    existingCategory: "other",
  }).category,
  "international",
);
assert.equal(
  classifyOfficialCandidate({
    title: "Raksha Mantri performs Bhoomi Pujan for development projects at Lucknow Cantonment",
    sourceKey: "pib",
    sourceFamily: "pib",
    isPrimarySource: true,
    existingCategory: "other",
  }).category,
  "defence",
);
assert.equal(
  classifyOfficialCandidate({
    title: "Governor attends university event",
    sourceKey: "punjab_lok_bhavan",
    sourceFamily: "punjab_lok_bhavan",
    isPrimarySource: true,
    existingCategory: "other",
  }).category,
  "punjab",
);
assert.equal(
  classifyOfficialCandidate({
    title: "Unrelated company announces routine internal event",
    sourceKey: "news_example",
    sourceFamily: "trusted_news",
    isPrimarySource: false,
    existingCategory: "other",
  }).category,
  "other",
);
assert.equal(
  classifyOfficialCandidate({
    title: "Official item that already has a precise category",
    sourceKey: "pib",
    sourceFamily: "pib",
    isPrimarySource: true,
    existingCategory: "sports",
  }).category,
  "sports",
);

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

console.log("CP032 on-demand yesterday policy contracts passed");
