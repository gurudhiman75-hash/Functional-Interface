import { randomUUID } from "node:crypto";

import { sqlClient } from "../lib/db";
import { scheduleSlotStart } from "./automation";
import {
  assertAllowedPrimaryPageUrl,
  extractPrimaryPageFacts,
  extractPrimaryPageText,
  primaryPageContentHash,
  type PrimarySourceKey,
} from "./primary-fact-extraction";

const EXTRACTOR_VERSION = "ca-cp008-primary-facts-v1";
const MAX_PAGE_BYTES = 3_500_000;
const SUPPORTED_PRIMARY_SOURCES = new Set<PrimarySourceKey>([
  "pib",
  "rbi",
  "sebi",
  "isro",
  "punjab_gov",
]);

type EnrichmentCandidate = {
  id: string;
  sourceId: string;
  sourceKey: PrimarySourceKey;
  sourceUrl: string;
  title: string;
};

type CandidateEnrichmentResult = {
  candidateId: string;
  sourceKey: string;
  status: "success" | "failure" | "skipped";
  factCount: number;
  visibleCharCount: number;
  error?: string;
};

function runKey(now: Date) {
  return `primary_fact_enrichment:${scheduleSlotStart(now, 3).toISOString()}`;
}

function safeTextError(error: unknown) {
  return (error instanceof Error ? error.message : "Unknown primary enrichment error").slice(0, 2000);
}

async function readBoundedResponse(response: Response): Promise<string> {
  const declared = Number(response.headers.get("content-length") ?? 0);
  if (declared > MAX_PAGE_BYTES) throw new Error("Primary-source page is larger than the enrichment limit");
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.byteLength > MAX_PAGE_BYTES) throw new Error("Primary-source page is larger than the enrichment limit");
  return buffer.toString("utf8");
}

async function fetchPrimaryPage(sourceKey: PrimarySourceKey, originalUrl: string): Promise<string> {
  let pageUrl = assertAllowedPrimaryPageUrl(sourceKey, originalUrl);
  for (let redirectCount = 0; redirectCount <= 2; redirectCount += 1) {
    const response = await fetch(pageUrl, {
      headers: {
        accept: "text/html,application/xhtml+xml;q=0.9,text/plain;q=0.5",
        "user-agent": "Examtree-Current-Affairs-Studio/1.0",
      },
      redirect: "manual",
      signal: AbortSignal.timeout(15_000),
    });
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) throw new Error(`Primary-source page returned redirect HTTP ${response.status} without Location`);
      if (redirectCount === 2) throw new Error("Primary-source page exceeded redirect limit");
      pageUrl = assertAllowedPrimaryPageUrl(sourceKey, new URL(location, pageUrl).toString());
      continue;
    }
    if (!response.ok) throw new Error(`Primary-source page returned HTTP ${response.status}`);
    const contentType = String(response.headers.get("content-type") ?? "").toLowerCase();
    if (contentType && !contentType.includes("html") && !contentType.includes("text/plain")) {
      throw new Error(`Primary-source page has unsupported content type ${contentType.split(";")[0]}`);
    }
    return readBoundedResponse(response);
  }
  throw new Error("Primary-source page redirect resolution failed");
}

function candidateRows(rows: any[]): EnrichmentCandidate[] {
  return rows.map((row) => ({
    id: String(row.id),
    sourceId: String(row.sourceId),
    sourceKey: String(row.sourceKey) as PrimarySourceKey,
    sourceUrl: String(row.sourceUrl),
    title: String(row.title),
  }));
}

async function loadCandidates(limit: number): Promise<EnrichmentCandidate[]> {
  const rows = await sqlClient`
    SELECT
      candidate.id::text AS id,
      candidate.source_url AS "sourceUrl",
      candidate.raw_title AS title,
      source.id::text AS "sourceId",
      source.source_key AS "sourceKey"
    FROM content.current_affairs_ingestion_candidates candidate
    JOIN content.current_affairs_sources source ON source.id = candidate.source_id
    LEFT JOIN content.current_affairs_candidate_enrichments enrichment
      ON enrichment.candidate_id = candidate.id
    WHERE candidate.source_url IS NOT NULL
      AND candidate.created_at >= now() - INTERVAL '21 days'
      AND source.is_active = true
      AND source.is_primary_source = true
      AND source.content_policy = 'primary_facts'
      AND source.source_key IN ('pib', 'rbi', 'sebi', 'isro', 'punjab_gov')
      AND (
        enrichment.candidate_id IS NULL
        OR COALESCE(enrichment.metadata->>'extractorVersion', '') <> ${EXTRACTOR_VERSION}
        OR (enrichment.status = 'failure' AND enrichment.attempt_count < 3)
      )
    ORDER BY candidate.published_at DESC NULLS LAST, candidate.created_at DESC
    LIMIT ${limit}
  `;
  return candidateRows(rows);
}

async function loadCandidatesByIds(candidateIds: string[]): Promise<EnrichmentCandidate[]> {
  if (candidateIds.length === 0) return [];
  const rows = await sqlClient`
    SELECT
      candidate.id::text AS id,
      candidate.source_url AS "sourceUrl",
      candidate.raw_title AS title,
      source.id::text AS "sourceId",
      source.source_key AS "sourceKey"
    FROM content.current_affairs_ingestion_candidates candidate
    JOIN content.current_affairs_sources source ON source.id = candidate.source_id
    WHERE candidate.id::text = ANY(${candidateIds}::text[])
      AND candidate.source_url IS NOT NULL
      AND source.is_active = true
      AND source.is_primary_source = true
      AND source.content_policy = 'primary_facts'
    ORDER BY candidate.published_at DESC NULLS LAST, candidate.created_at DESC
  `;
  return candidateRows(rows);
}

async function recordFailure(candidate: EnrichmentCandidate, error: string) {
  await sqlClient`
    INSERT INTO content.current_affairs_candidate_enrichments (
      candidate_id, source_id, status, attempt_count, last_attempted_at,
      failure_reason, metadata, created_at, updated_at
    ) VALUES (
      ${candidate.id}::uuid, ${candidate.sourceId}::uuid, 'failure', 1, now(),
      ${error}, ${JSON.stringify({ extractorVersion: EXTRACTOR_VERSION })}::jsonb, now(), now()
    )
    ON CONFLICT (candidate_id) DO UPDATE
    SET source_id=EXCLUDED.source_id,
        status='failure',
        attempt_count=content.current_affairs_candidate_enrichments.attempt_count + 1,
        last_attempted_at=now(),
        failure_reason=EXCLUDED.failure_reason,
        metadata=content.current_affairs_candidate_enrichments.metadata || EXCLUDED.metadata,
        updated_at=now()
  `;
}

async function enrichCandidate(candidate: EnrichmentCandidate): Promise<CandidateEnrichmentResult> {
  if (!SUPPORTED_PRIMARY_SOURCES.has(candidate.sourceKey)) {
    return {
      candidateId: candidate.id,
      sourceKey: candidate.sourceKey,
      status: "skipped",
      factCount: 0,
      visibleCharCount: 0,
      error: "unsupported primary source",
    };
  }

  try {
    const html = await fetchPrimaryPage(candidate.sourceKey, candidate.sourceUrl);
    const visibleText = extractPrimaryPageText(html);
    const contentHash = primaryPageContentHash(visibleText);
    const facts = extractPrimaryPageFacts(visibleText);

    await sqlClient.begin(async (tx) => {
      await tx`
        DELETE FROM content.current_affairs_candidate_fact_claims
        WHERE candidate_id=${candidate.id}::uuid
      `;
      for (const fact of facts) {
        await tx`
          INSERT INTO content.current_affairs_candidate_fact_claims (
            id, candidate_id, source_id, fact_key, fact_value, normalized_value,
            fact_type, confidence, extraction_method, metadata, created_at, updated_at
          ) VALUES (
            ${randomUUID()}::uuid, ${candidate.id}::uuid, ${candidate.sourceId}::uuid,
            ${fact.factKey}, ${fact.factValue}, ${fact.normalizedValue}, ${fact.factType},
            ${fact.confidence}, ${fact.extractionMethod},
            ${JSON.stringify({
              sourcePageUrl: candidate.sourceUrl,
              extractorVersion: EXTRACTOR_VERSION,
              evidenceClass: fact.evidenceClass,
              contentHash,
              rawTextPersisted: false,
            })}::jsonb,
            now(), now()
          )
          ON CONFLICT (candidate_id, fact_key, normalized_value) DO UPDATE
          SET fact_value=EXCLUDED.fact_value,
              fact_type=EXCLUDED.fact_type,
              confidence=EXCLUDED.confidence,
              metadata=EXCLUDED.metadata,
              updated_at=now()
        `;
      }
      await tx`
        INSERT INTO content.current_affairs_candidate_enrichments (
          candidate_id, source_id, status, attempt_count, content_hash,
          visible_char_count, extracted_fact_count, last_attempted_at, last_enriched_at,
          failure_reason, metadata, created_at, updated_at
        ) VALUES (
          ${candidate.id}::uuid, ${candidate.sourceId}::uuid, 'success', 1, ${contentHash},
          ${visibleText.length}, ${facts.length}, now(), now(), null,
          ${JSON.stringify({ extractorVersion: EXTRACTOR_VERSION, rawTextPersisted: false })}::jsonb,
          now(), now()
        )
        ON CONFLICT (candidate_id) DO UPDATE
        SET source_id=EXCLUDED.source_id,
            status='success',
            attempt_count=content.current_affairs_candidate_enrichments.attempt_count + 1,
            content_hash=EXCLUDED.content_hash,
            visible_char_count=EXCLUDED.visible_char_count,
            extracted_fact_count=EXCLUDED.extracted_fact_count,
            last_attempted_at=now(),
            last_enriched_at=now(),
            failure_reason=null,
            metadata=EXCLUDED.metadata,
            updated_at=now()
      `;
    });

    return {
      candidateId: candidate.id,
      sourceKey: candidate.sourceKey,
      status: "success",
      factCount: facts.length,
      visibleCharCount: visibleText.length,
    };
  } catch (error) {
    const message = safeTextError(error);
    await recordFailure(candidate, message);
    return {
      candidateId: candidate.id,
      sourceKey: candidate.sourceKey,
      status: "failure",
      factCount: 0,
      visibleCharCount: 0,
      error: message,
    };
  }
}

export async function runPrimaryFactEnrichmentForCandidateIds(candidateIdsInput: string[]) {
  const candidateIds = [...new Set(candidateIdsInput.map(String).filter(Boolean))].slice(0, 300);
  const candidates = await loadCandidatesByIds(candidateIds);
  const results: CandidateEnrichmentResult[] = [];
  for (const candidate of candidates) {
    results.push(await enrichCandidate(candidate));
  }
  const seen = new Set(candidates.map((candidate) => candidate.id));
  const missing = candidateIds.filter((candidateId) => !seen.has(candidateId));
  return {
    requested: candidateIds.length,
    examined: candidates.length,
    successCount: results.filter((item) => item.status === "success").length,
    failureCount: results.filter((item) => item.status === "failure").length,
    skippedCount: results.filter((item) => item.status === "skipped").length,
    factCount: results.reduce((sum, item) => sum + item.factCount, 0),
    missingCandidateIds: missing,
    results,
    scope: "explicit_candidate_ids",
  };
}

export async function runScheduledPrimaryFactEnrichment(now = new Date(), limit = 50) {
  const slot = scheduleSlotStart(now, 3);
  const key = runKey(now);
  const runId = randomUUID();
  const inserted = await sqlClient`
    INSERT INTO content.current_affairs_automation_runs (
      id, run_key, job_type, status, slot_started_at, started_at, created_at, updated_at
    ) VALUES (
      ${runId}::uuid, ${key}, 'primary_fact_enrichment', 'running', ${slot.toISOString()}, now(), now(), now()
    )
    ON CONFLICT (run_key) DO NOTHING
    RETURNING id
  `;
  if (!inserted[0]) return { skipped: true, runKey: key, reason: "schedule slot already processed" };

  try {
    const candidates = await loadCandidates(Math.max(1, Math.min(100, Math.floor(limit))));
    const results: CandidateEnrichmentResult[] = [];
    for (const candidate of candidates) {
      results.push(await enrichCandidate(candidate));
    }
    const successCount = results.filter((item) => item.status === "success").length;
    const failureCount = results.filter((item) => item.status === "failure").length;
    const skippedCount = results.filter((item) => item.status === "skipped").length;
    const factCount = results.reduce((sum, item) => sum + item.factCount, 0);
    const status = failureCount === 0
      ? "completed"
      : successCount > 0 || skippedCount > 0
        ? "completed_with_errors"
        : "failed";

    await sqlClient`
      UPDATE content.current_affairs_automation_runs
      SET status=${status}, completed_at=now(),
          source_count=${candidates.length}, success_count=${successCount}, failure_count=${failureCount},
          stats=${JSON.stringify({
            extractorVersion: EXTRACTOR_VERSION,
            candidatesSeen: candidates.length,
            successCount,
            failureCount,
            skippedCount,
            factCount,
            results,
            rawTextPersisted: false,
          })}::jsonb,
          failure_reason=${status === "failed" ? "All attempted primary-source page enrichments failed" : null},
          updated_at=now()
      WHERE id=${runId}::uuid
    `;

    return {
      skipped: false,
      runId,
      runKey: key,
      status,
      candidatesSeen: candidates.length,
      successCount,
      failureCount,
      skippedCount,
      factCount,
      results,
    };
  } catch (error) {
    const message = safeTextError(error);
    await sqlClient`
      UPDATE content.current_affairs_automation_runs
      SET status='failed', completed_at=now(), failure_reason=${message}, updated_at=now()
      WHERE id=${runId}::uuid
    `;
    throw error;
  }
}
