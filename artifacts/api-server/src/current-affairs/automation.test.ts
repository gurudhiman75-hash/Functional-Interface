import assert from "node:assert/strict";

import {
  assertPublicHttpsFeedUrl,
  onDemandFeedRunKey,
  scheduledFeedRunKey,
  scheduleSlotStart,
  summarizeScheduledSourceResults,
} from "./automation";

const slot = scheduleSlotStart(new Date("2026-08-29T10:47:12Z"), 3);
assert.equal(slot.toISOString(), "2026-08-29T09:00:00.000Z");
assert.equal(
  scheduledFeedRunKey(new Date("2026-08-29T11:59:59Z"), 3),
  "feed_ingestion:2026-08-29T09:00:00.000Z",
);
assert.equal(
  scheduledFeedRunKey(new Date("2026-08-29T12:00:00Z"), 3),
  "feed_ingestion:2026-08-29T12:00:00.000Z",
);

const manualNow = new Date("2026-08-29T10:47:12Z");
const manualRunA = onDemandFeedRunKey(manualNow, "request-a");
const manualRunB = onDemandFeedRunKey(manualNow, "request-b");
assert.equal(manualRunA, "feed_ingestion:on_demand:2026-08-29T10:47:12.000Z:request-a");
assert.notEqual(manualRunA, manualRunB, "every manual click must have a distinct source-refresh run key");
assert.notEqual(manualRunA, scheduledFeedRunKey(manualNow, 3), "manual generation must never share the cron slot key");

assert.equal(
  assertPublicHttpsFeedUrl("https://example.gov.in/feed.xml#latest"),
  "https://example.gov.in/feed.xml",
);
assert.throws(() => assertPublicHttpsFeedUrl("http://example.com/feed"), /HTTPS/);
assert.throws(() => assertPublicHttpsFeedUrl("https://127.0.0.1/feed"), /private-network/);
assert.throws(() => assertPublicHttpsFeedUrl("https://192.168.1.10/feed"), /private-network/);
assert.throws(() => assertPublicHttpsFeedUrl("https://metadata.google.internal/feed"), /private-network/);

const complete = summarizeScheduledSourceResults([
  { sourceKey: "pib", channel: "feed", status: "success", entriesSeen: 4, created: 3, updated: 1 },
  { sourceKey: "rbi", channel: "feed", status: "success", entriesSeen: 2, created: 1, updated: 1 },
  {
    sourceKey: "sebi",
    channel: "official_listing",
    status: "success",
    entriesSeen: 5,
    created: 2,
    updated: 1,
    skippedUndated: 2,
  },
]);
assert.equal(complete.status, "completed");
assert.equal(complete.candidateCreatedCount, 6);
assert.equal(complete.candidateUpdatedCount, 3);
assert.equal(complete.skippedUndatedCount, 2);

const partial = summarizeScheduledSourceResults([
  { sourceKey: "pib", status: "success", entriesSeen: 4, created: 3, updated: 1 },
  { sourceKey: "broken", status: "failure", entriesSeen: 0, created: 0, updated: 0, error: "failed" },
]);
assert.equal(partial.status, "completed_with_errors");
assert.equal(partial.failureCount, 1);

const failed = summarizeScheduledSourceResults([
  { sourceKey: "broken", status: "failure", entriesSeen: 0, created: 0, updated: 0, error: "failed" },
]);
assert.equal(failed.status, "failed");

console.log("Current Affairs automation and true on-demand source contracts passed");
