import { randomUUID } from "node:crypto";

import { sqlClient } from "../lib/db";
import { sourceCandidateDedupeKey } from "./core";
import { discoveryKeywords, parseSyndicationFeed } from "./ingestion";
import {
  parseOfficialListing,
  type OfficialListingAdapter,
} from "./official-listing";
import {
  assertPublicHttpsSourceUrl,
  fetchBoundedOfficialText,
} from "./source-fetch";

const MAX_FEED_BYTES = 2_500_000;
const MAX_LISTING_BYTES = 5_000_000;
const LISTING_ADAPTERS = new Set<OfficialListingAdapter>([
  "sebi_press_releases",
  "isro_latest_news",
  "punjab_press_releases",
  "punjab_lok_bhavan_press",
]);

export type ScheduledSourceResult = {
  sourceKey: string;
  channel?: "feed" | "official_listing";
  status: "success" | "failure";
  entriesSeen: number;
  created: number;
  updated: number;
  skippedUndated?: number;
  error?: string;
};

export type FeedIngestionTrigger = "scheduled" | "on_demand";

export type FeedIngestionOptions = {
  runKey?: string;
  trigger?: FeedIngestionTrigger;
};

export function scheduleSlotStart(now = new Date(), slotHours = 3): Date {
  const safeHours = Number.isInteger(slotHours) && slotHours > 0 && slotHours <= 24 ? slotHours : 3;
  const date = new Date(now);
  date.setUTCMinutes(0, 0, 0);
  date.setUTCHours(Math.floor(date.getUTCHours() / safeHours) * safeHours);
  return date;
}

export function scheduledFeedRunKey(now = new Date(), slotHours = 3): string {
  return `feed_ingestion:${scheduleSlotStart(now, slotHours).toISOString()}`;
}

export function onDemandFeedRunKey(now = new Date(), requestId = randomUUID()): string {
  return `feed_ingestion:on_demand:${now.toISOString()}:${requestId}`;
}

export function assertPublicHttpsFeedUrl(value: string): string {
  return assertPublicHttpsSourceUrl(value);
}

export function summarizeScheduledSourceResults(results: ScheduledSourceResult[]) {
  const successCount = results.filter((result) => result.status === "success").length;
  const failureCount = results.length - successCount;
  return {
    sourceCount: results.length,
    successCount,
    failureCount,
    candidateCreatedCount: results.reduce((sum, result) => sum + result.created, 0),
    candidateUpdatedCount: results.reduce((sum, result) => sum + result.updated, 0),
    skippedUndatedCount: results.reduce((sum, result) => sum + Number(result.skippedUndated ?? 0), 0),
    status: failureCount === 0 ? "completed" as const : successCount > 0 ? "completed_with_errors" as const : "failed" as const,
  };
}

function sourceProvenance(source: Record<string, unknown>) {
  return {
    sourceFamily: source.sourceFamily ?? null,
    sourceTier: source.sourceTier ?? null,
    coverageDomain: source.coverageDomain ?? null,
    sourceContentPolicy: source.contentPolicy,
    rawTextPersisted: false,
  };
}

async function upsertCandidate(args: {
  source: Record<string, unknown>;
  sourceUrl: string;
  title: string;
  publishedAt?: string;
  externalId?: string;
  payload: Record<string, unknown>;
}) {
  const sourceKey = String(args.source.sourceKey);
  const dedupeKey = sourceCandidateDedupeKey(sourceKey, args.sourceUrl, args.title);
  const rows = await sqlClient`
    INSERT INTO content.current_affairs_ingestion_candidates (
      id, source_id, source_url, source_document_id, external_id,
      raw_title, raw_summary, published_at, dedupe_key, status,
      payload, created_at, updated_at
    ) VALUES (
      ${randomUUID()}::uuid,
      ${String(args.source.id)}::uuid,
      ${args.sourceUrl},
      null,
      ${args.externalId ?? null},
      ${args.title},
      '',
      ${args.publishedAt ?? null},
      ${dedupeKey},
      'queued',
      ${JSON.stringify(args.payload)}::jsonb,
      now(),
      now()
    )
    ON CONFLICT (source_url) DO UPDATE
    SET raw_title = EXCLUDED.raw_title,
        published_at = COALESCE(EXCLUDED.published_at, content.current_affairs_ingestion_candidates.published_at),
        dedupe_key = EXCLUDED.dedupe_key,
        payload = EXCLUDED.payload,
        updated_at = now()
    RETURNING (xmax = 0) AS inserted
  `;
  return Boolean(rows[0]?.inserted);
}

async function markSourceResult(sourceId: string, status: "success" | "failure", error?: string) {
  await sqlClient`
    UPDATE content.current_affairs_sources
    SET last_ingested_at = now(),
        last_ingestion_status = ${status},
        last_ingestion_error = ${error ?? null},
        updated_at = now()
    WHERE id = ${sourceId}::uuid
  `;
}

async function ingestFeedSource(source: Record<string, unknown>, trigger: FeedIngestionTrigger): Promise<ScheduledSourceResult> {
  const sourceKey = String(source.sourceKey);
  const feedUrl = assertPublicHttpsFeedUrl(String(source.feedUrl ?? ""));
  const xml = await fetchBoundedOfficialText(feedUrl, {
    accept: "application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, text/plain;q=0.5",
    maxBytes: MAX_FEED_BYTES,
    label: "Feed",
  });
  const entries = parseSyndicationFeed(xml, feedUrl);
  let created = 0;
  let updated = 0;

  for (const entry of entries) {
    const inserted = await upsertCandidate({
      source,
      sourceUrl: entry.link,
      title: entry.title,
      publishedAt: entry.publishedAt,
      externalId: entry.id,
      payload: {
        ingestionChannel: trigger === "on_demand" ? "on_demand_feed" : "scheduled_feed",
        discoveryKeywords: discoveryKeywords(`${entry.title} ${entry.discoveryText ?? ""}`),
        ...sourceProvenance(source),
      },
    });
    if (inserted) created += 1;
    else updated += 1;
  }

  return { sourceKey, channel: "feed", status: "success", entriesSeen: entries.length, created, updated };
}

async function ingestOfficialListingSource(source: Record<string, unknown>, trigger: FeedIngestionTrigger): Promise<ScheduledSourceResult> {
  const sourceKey = String(source.sourceKey);
  const listingUrl = assertPublicHttpsFeedUrl(String(source.listingUrl ?? ""));
  const adapter = String(source.listingAdapter ?? "") as OfficialListingAdapter;
  if (!LISTING_ADAPTERS.has(adapter)) {
    throw new Error(`Unsupported official listing adapter: ${String(source.listingAdapter ?? "")}`);
  }
  const html = await fetchBoundedOfficialText(listingUrl, {
    accept: "text/html,application/xhtml+xml;q=0.9,text/plain;q=0.5",
    maxBytes: MAX_LISTING_BYTES,
    label: "Official listing",
  });
  const entries = parseOfficialListing(html, listingUrl, adapter);
  let created = 0;
  let updated = 0;
  let skippedUndated = 0;

  for (const entry of entries) {
    if (!entry.publishedAt) {
      skippedUndated += 1;
      continue;
    }
    const inserted = await upsertCandidate({
      source,
      sourceUrl: entry.link,
      title: entry.title,
      publishedAt: entry.publishedAt,
      payload: {
        ingestionChannel: trigger === "on_demand" ? "on_demand_official_listing" : "scheduled_official_listing",
        listingAdapter: adapter,
        dateConfidence: entry.dateConfidence,
        discoveryKeywords: entry.discoveryKeywords,
        ...sourceProvenance(source),
      },
    });
    if (inserted) created += 1;
    else updated += 1;
  }

  return {
    sourceKey,
    channel: "official_listing",
    status: "success",
    entriesSeen: entries.length,
    created,
    updated,
    skippedUndated,
  };
}

async function ingestScheduledSource(source: Record<string, unknown>, trigger: FeedIngestionTrigger): Promise<ScheduledSourceResult> {
  const sourceKey = String(source.sourceKey);
  try {
    const mode = String(source.ingestionMode ?? "manual");
    const result = mode === "feed" || mode === "feed_and_pdf"
      ? await ingestFeedSource(source, trigger)
      : mode === "listing" || mode === "listing_and_pdf"
        ? await ingestOfficialListingSource(source, trigger)
        : (() => { throw new Error(`Unsupported scheduled ingestion mode: ${mode}`); })();
    await markSourceResult(String(source.id), "success");
    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message.slice(0, 2000) : "Unknown ingestion error";
    await markSourceResult(String(source.id), "failure", message);
    return { sourceKey, status: "failure", entriesSeen: 0, created: 0, updated: 0, error: message };
  }
}

export async function runScheduledFeedIngestion(now = new Date(), options: FeedIngestionOptions = {}) {
  const slot = scheduleSlotStart(now, 3);
  const trigger = options.trigger ?? "scheduled";
  const runKey = options.runKey ?? scheduledFeedRunKey(now, 3);
  const runId = randomUUID();
  const inserted = await sqlClient`
    INSERT INTO content.current_affairs_automation_runs (
      id, run_key, job_type, status, slot_started_at, started_at, created_at, updated_at
    ) VALUES (
      ${runId}::uuid, ${runKey}, 'feed_ingestion', 'running', ${slot.toISOString()}, now(), now(), now()
    )
    ON CONFLICT (run_key) DO NOTHING
    RETURNING id::text AS id
  `;

  if (!inserted[0]) {
    return { skipped: true, runKey, trigger, reason: "run key already processed" };
  }

  try {
    const sources = await sqlClient`
      SELECT
        id::text AS id,
        source_key AS "sourceKey",
        source_family AS "sourceFamily",
        source_tier AS "sourceTier",
        coverage_domain AS "coverageDomain",
        feed_url AS "feedUrl",
        listing_url AS "listingUrl",
        listing_adapter AS "listingAdapter",
        ingestion_mode AS "ingestionMode",
        content_policy AS "contentPolicy"
      FROM content.current_affairs_sources
      WHERE is_active = true
        AND (
          (ingestion_mode IN ('feed', 'feed_and_pdf') AND feed_url IS NOT NULL)
          OR
          (ingestion_mode IN ('listing', 'listing_and_pdf') AND listing_url IS NOT NULL AND listing_adapter IS NOT NULL)
        )
      ORDER BY is_primary_source DESC, trust_score DESC, source_key
    `;

    const results: ScheduledSourceResult[] = [];
    for (const source of sources) {
      results.push(await ingestScheduledSource(source as Record<string, unknown>, trigger));
    }
    const summary = summarizeScheduledSourceResults(results);

    await sqlClient`
      UPDATE content.current_affairs_automation_runs
      SET status = ${summary.status}, completed_at = now(),
          source_count = ${summary.sourceCount}, success_count = ${summary.successCount},
          failure_count = ${summary.failureCount},
          candidate_created_count = ${summary.candidateCreatedCount},
          candidate_updated_count = ${summary.candidateUpdatedCount},
          stats = ${JSON.stringify({ trigger, results, skippedUndatedCount: summary.skippedUndatedCount })}::jsonb,
          failure_reason = ${summary.status === "failed" ? "All configured source ingestions failed" : null},
          updated_at = now()
      WHERE id = ${runId}::uuid
    `;

    return { skipped: false, runId, runKey, trigger, ...summary, results };
  } catch (error) {
    const message = error instanceof Error ? error.message.slice(0, 4000) : "Unknown automation failure";
    await sqlClient`
      UPDATE content.current_affairs_automation_runs
      SET status='failed', completed_at=now(), failure_reason=${message}, updated_at=now()
      WHERE id=${runId}::uuid
    `;
    throw error;
  }
}
