import { randomUUID } from "node:crypto";

import { sqlClient } from "../lib/db";
import { sourceCandidateDedupeKey } from "./core";
import { discoveryKeywords, parseSyndicationFeed } from "./ingestion";
import {
  parseOfficialListing,
  type OfficialListingAdapter,
} from "./official-listing";

const MAX_FEED_BYTES = 2_500_000;
const MAX_LISTING_BYTES = 5_000_000;
const LISTING_ADAPTERS = new Set<OfficialListingAdapter>([
  "sebi_press_releases",
  "isro_latest_news",
  "punjab_press_releases",
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

export function assertPublicHttpsFeedUrl(value: string): string {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error("Feed URL must be a valid HTTPS URL");
  }
  if (parsed.protocol !== "https:") throw new Error("Feed URL must use HTTPS");
  const host = parsed.hostname.toLowerCase();
  const blocked =
    host === "localhost" ||
    host === "0.0.0.0" ||
    host === "::1" ||
    host.endsWith(".local") ||
    host === "169.254.169.254" ||
    host === "metadata.google.internal" ||
    /^127\./.test(host) ||
    /^10\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^169\.254\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host);
  if (blocked) throw new Error("Feed URL cannot point to a private-network host");
  parsed.hash = "";
  return parsed.toString();
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

async function fetchBoundedText(
  sourceUrl: string,
  args: { accept: string; maxBytes: number; label: string },
): Promise<string> {
  const response = await fetch(sourceUrl, {
    headers: {
      accept: args.accept,
      "user-agent": "Examtree-Current-Affairs-Studio/1.0",
    },
    redirect: "error",
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error(`${args.label} returned HTTP ${response.status}`);
  const declaredLength = Number(response.headers.get("content-length") ?? 0);
  if (declaredLength > args.maxBytes) throw new Error(`${args.label} is larger than the ingestion limit`);
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.byteLength > args.maxBytes) throw new Error(`${args.label} is larger than the ingestion limit`);
  return buffer.toString("utf8");
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

async function ingestFeedSource(source: Record<string, unknown>): Promise<ScheduledSourceResult> {
  const sourceKey = String(source.sourceKey);
  const feedUrl = assertPublicHttpsFeedUrl(String(source.feedUrl ?? ""));
  const xml = await fetchBoundedText(feedUrl, {
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
        ingestionChannel: "scheduled_feed",
        discoveryKeywords: discoveryKeywords(`${entry.title} ${entry.discoveryText ?? ""}`),
        sourceContentPolicy: source.contentPolicy,
        rawTextPersisted: false,
      },
    });
    if (inserted) created += 1;
    else updated += 1;
  }

  return { sourceKey, channel: "feed", status: "success", entriesSeen: entries.length, created, updated };
}

async function ingestOfficialListingSource(source: Record<string, unknown>): Promise<ScheduledSourceResult> {
  const sourceKey = String(source.sourceKey);
  const listingUrl = assertPublicHttpsFeedUrl(String(source.listingUrl ?? ""));
  const adapter = String(source.listingAdapter ?? "") as OfficialListingAdapter;
  if (!LISTING_ADAPTERS.has(adapter)) {
    throw new Error(`Unsupported official listing adapter: ${String(source.listingAdapter ?? "")}`);
  }
  const html = await fetchBoundedText(listingUrl, {
    accept: "text/html,application/xhtml+xml;q=0.9,text/plain;q=0.5",
    maxBytes: MAX_LISTING_BYTES,
    label: "Official listing",
  });
  const entries = parseOfficialListing(html, listingUrl, adapter);
  let created = 0;
  let updated = 0;
  let skippedUndated = 0;

  for (const entry of entries) {
    // Listing-page parsers may discover useful items without a trustworthy date.
    // Do not guess that such an item is current: leave it out of the candidate queue.
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
        ingestionChannel: "scheduled_official_listing",
        listingAdapter: adapter,
        dateConfidence: entry.dateConfidence,
        discoveryKeywords: entry.discoveryKeywords,
        sourceContentPolicy: source.contentPolicy,
        rawTextPersisted: false,
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

async function ingestScheduledSource(source: Record<string, unknown>): Promise<ScheduledSourceResult> {
  const sourceKey = String(source.sourceKey);
  try {
    const mode = String(source.ingestionMode ?? "manual");
    const result = mode === "feed" || mode === "feed_and_pdf"
      ? await ingestFeedSource(source)
      : mode === "listing" || mode === "listing_and_pdf"
        ? await ingestOfficialListingSource(source)
        : (() => { throw new Error(`Unsupported scheduled ingestion mode: ${mode}`); })();
    await markSourceResult(String(source.id), "success");
    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message.slice(0, 2000) : "Unknown ingestion error";
    await markSourceResult(String(source.id), "failure", message);
    return { sourceKey, status: "failure", entriesSeen: 0, created: 0, updated: 0, error: message };
  }
}

export async function runScheduledFeedIngestion(now = new Date()) {
  const slot = scheduleSlotStart(now, 3);
  const runKey = scheduledFeedRunKey(now, 3);
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
    return { skipped: true, runKey, reason: "schedule slot already processed" };
  }

  try {
    const sources = await sqlClient`
      SELECT
        id::text AS id,
        source_key AS "sourceKey",
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
      results.push(await ingestScheduledSource(source as Record<string, unknown>));
    }
    const summary = summarizeScheduledSourceResults(results);

    await sqlClient`
      UPDATE content.current_affairs_automation_runs
      SET status = ${summary.status}, completed_at = now(),
          source_count = ${summary.sourceCount}, success_count = ${summary.successCount},
          failure_count = ${summary.failureCount},
          candidate_created_count = ${summary.candidateCreatedCount},
          candidate_updated_count = ${summary.candidateUpdatedCount},
          stats = ${JSON.stringify({ results, skippedUndatedCount: summary.skippedUndatedCount })}::jsonb,
          failure_reason = ${summary.status === "failed" ? "All configured scheduled source ingestions failed" : null},
          updated_at = now()
      WHERE id = ${runId}::uuid
    `;

    return { skipped: false, runId, runKey, ...summary, results };
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
