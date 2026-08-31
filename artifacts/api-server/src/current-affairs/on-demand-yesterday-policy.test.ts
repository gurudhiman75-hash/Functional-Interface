import assert from "node:assert/strict";

import { classifyOfficialCandidate } from "./official-candidate-reclassification";
import {
  ON_DEMAND_YESTERDAY_STAGES,
  shouldContinueBoundedPass,
  yesterdayPackCompleteness,
} from "./on-demand-yesterday-policy";
import {
  buildPibArchivePostBody,
  parsePibHistoricalListing,
  pibDisplayedDate,
} from "./pib-historical-backfill";

assert.deepEqual(ON_DEMAND_YESTERDAY_STAGES, [
  "official_source_refresh",
  "historical_official_source_backfill",
  "official_candidate_reclassification",
  "primary_fact_enrichment",
  "manual_authority_guard",
  "intelligence_and_strict_verification",
  "post_promotion_enrichment_reconciliation",
  "historical_claim_rebuild_and_reverification",
  "draft_authoring_localization_and_questions",
]);
assert.ok(
  ON_DEMAND_YESTERDAY_STAGES.indexOf("historical_official_source_backfill")
    < ON_DEMAND_YESTERDAY_STAGES.indexOf("official_candidate_reclassification"),
  "historical official discovery must run before candidate reclassification",
);
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

const pibInitial = `
<form method="post">
  <input type="hidden" name="__VIEWSTATE" value="/wEPDwULLTE=&amp;" />
  <input type="hidden" name="__EVENTVALIDATION" value="/wEdAA==" />
</form>`;
const pibPost = new URLSearchParams(buildPibArchivePostBody(pibInitial, "2026-08-30"));
assert.equal(pibPost.get("ctl00$ContentPlaceHolder1$ddlday"), "30");
assert.equal(pibPost.get("ctl00$ContentPlaceHolder1$ddlMonth"), "8");
assert.equal(pibPost.get("ctl00$ContentPlaceHolder1$ddlYear"), "2026");
assert.equal(pibPost.get("__EVENTTARGET"), "ctl00$ContentPlaceHolder1$ddlday");
assert.equal(pibPost.get("__VIEWSTATE"), "/wEPDwULLTE=&");

const pibFiltered = `
<div class="search_box_result">Displaying 2 Press Releases All Ministry for 30-August-2026</div>
<ul>
  <li><a href="/PressReleasePage.aspx?PRID=2304654&amp;lang=1&amp;reg=3">NEET-PG 2026 Successfully Conducted Nationwide with Robust Security and Real-Time Monitoring</a></li>
  <li><a href="https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2304718&amp;lang=1&amp;reg=3">Joint Statement during the State Visit of Prime Minister Narendra Modi to Uzbekistan</a></li>
  <li><a href="/indexd.aspx?lang=1">Home</a></li>
</ul>`;
assert.equal(pibDisplayedDate(pibFiltered), "2026-08-30");
const pibEntries = parsePibHistoricalListing(pibFiltered, "2026-08-30");
assert.equal(pibEntries.length, 2);
assert.equal(pibEntries[0]?.externalId, "2304654");
assert.equal(pibEntries[0]?.publishedAt, "2026-08-30T00:00:00.000Z");
assert.equal(parsePibHistoricalListing(pibFiltered, "2026-08-29").length, 0);

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

console.log("CP033 on-demand yesterday historical discovery contracts passed");
