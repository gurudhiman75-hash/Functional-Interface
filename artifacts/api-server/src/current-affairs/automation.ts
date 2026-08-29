import { randomUUID } from "node:crypto";

import { sqlClient } from "../lib/db";
import { sourceCandidateDedupeKey } from "./core";
import { discoveryKeywords, parseSyndicationFeed } from "./ingestion";

const MAX_FEED_BYTES = 2_500_000;

export type ScheduledSourceResult = {
  sourceKey: string;
  status: "success" | "failure";
  entriesSeen: number;
  created: number;
  updated: number;
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
    status: failureCount === 0 ? "completed" as const : successCount > 0 ? "completed_with_errors" as const : "failed" as const,
  };
}

async function fetchFeed(feedUrl: string): Promise<string> {
  const response = await fetch(feedUrl, {
    headers: {
      accept: "application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, text/plain;q=0.5",
      "user-agent": "Examtree-Current-Affairs-Studio/1.0",
    },
    redirect: "error",
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error(`Feed returned HTTP ${response.status}`);
  const declaredLength = Number(response.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_FEED_BYTES) throw new Error("Feed is larger than the ingestion limit");
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.byteLength > MAX_FEED_BYTES) throw new Error("Feed is larger than the ingestion limit");
  return buffer.toString("utf8");
}

async function ingestScheduledSource(source: Record<string, unknown>): Promise<ScheduledSourceResult> {
  const sourceKey = String(source.sourceKey);
  try {
    const feedUrl = assertPublicHttpsFeedUrl(String(source.feedUrl ?? ""));
    const xml = await fetchFeed(feedUrl);
    const entries = parseSyndicationFeed(xml, feedUrl);
    let created = 0;
    let updated = 0;

    for (const entry of entries) {
      const dedupeKey = sourceCandidateDedupeKey(sourceKey, entry.link, entry.title);
      const payload = {
        ingestionChannel: "scheduled_feed",
        discoveryKeywords: discoveryKeywords(`${entry.title} ${entry.discoveryText ?? ""}`),
        sourceContentPolicy: source.contentPolicy,
        rawTextPersisted: false,
      };
      const rows = await sqlClient`
        INSERT INTO content.current_affairs_ingestion_candidates (
          id, source_id, source_url, source_document_id, external_id,
          raw_title, raw_summary, published_at, dedupe_key, status,
          payload, created_at, updated_at
        ) VALUES (
          ${randomUUID()}::uuid,
          ${String(source.id)}::uuid,
          ${entry.link},
          null,
          ${entry.id ?? null},
          ${entry.title},
          '',
          ${entry.publishedAt ?? null},
          ${dedupeKey},
          'queued',
          ${JSON.stringify(payload)}::jsonb,
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
      if (rows[0]?.inserted) created += 1;
      else updated += 1;
    }

    await sqlClient`
      UPDATE content.current_affairs_sources
      SET last_ingested_at = now(), last_ingestion_status = 'success',
          last_ingestion_error = null, updated_at = now()
      WHERE id = ${String(source.id)}::uuid
    `;

    return { sourceKey, status: "success", entriesSeen: entries.length, created, updated };
  } catch (error) {
    const message = error instanceof Error ? error.message.slice(0, 2000) : "Unknown ingestion error";
    await sqlClient`
      UPDATE content.current_affairs_sources
      SET last_ingested_at = now(), last_ingestion_status = 'failure',
          last_ingestion_error = ${message}, updated_at = now()
      WHERE id = ${String(source.id)}::uuid
    `;
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
        content_policy AS "contentPolicy"
      FROM content.current_affairs_sources
      WHERE is_active = true
        AND feed_url IS NOT NULL
        AND ingestion_mode IN ('feed', 'feed_and_pdf')
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
          stats = ${JSON.stringify({ results })}::jsonb,
          failure_reason = ${summary.status === "failed" ? "All configured feed ingestions failed" : null},
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
