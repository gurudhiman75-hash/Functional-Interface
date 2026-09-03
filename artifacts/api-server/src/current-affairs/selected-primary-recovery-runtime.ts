import { randomUUID } from "node:crypto";

import { sqlClient } from "../lib/db";
import { assertAllowedPrimaryPageUrl } from "./primary-fact-extraction";
import {
  extractSelectedHeadlineRecoveryClaims,
  extractSelectedPrimaryPageFacts,
  extractSelectedPrimaryPageText,
  primaryRecoveryUrlVariants,
  recoveryPageMatchesTitle,
  SELECTED_PRIMARY_RECOVERY_VERSION,
} from "./selected-primary-recovery-policy";

const SUPPORTED_SOURCE_KEYS = new Set(["pib", "rbi", "sebi", "isro", "punjab_gov"]);
const MAX_PAGE_BYTES = 3_500_000;
const MAX_SELECTED = 300;

type RecoveryCandidate = {
  candidateId: string;
  eventId: string;
  clusterId: string | null;
  sourceId: string;
  sourceKey: string;
  sourceUrl: string;
  title: string;
  isPrimarySource: boolean;
  contentPolicy: string;
};

function safeError(error: unknown) {
  return (error instanceof Error ? error.message : "Unknown selected primary recovery error").slice(0, 1200);
}

async function readBounded(response: Response) {
  const declared = Number(response.headers.get("content-length") ?? 0);
  if (declared > MAX_PAGE_BYTES) throw new Error("Primary recovery page exceeds response limit");
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.byteLength > MAX_PAGE_BYTES) throw new Error("Primary recovery page exceeds response limit");
  return buffer.toString("utf8");
}

function primaryEvidenceWindow(title: string, text: string) {
  const needle = String(title ?? "").replace(/\s+/g, " ").trim().toLowerCase();
  if (!needle) return text.slice(0, 50_000);
  const index = text.toLowerCase().indexOf(needle);
  if (index < 0) return text.slice(0, 50_000);
  return text.slice(Math.max(0, index - 500), Math.min(text.length, index + 40_000));
}

async function fetchRecoveryPage(candidate: RecoveryCandidate) {
  const variants = primaryRecoveryUrlVariants(candidate.sourceKey, candidate.sourceUrl);
  const attempts: Array<Record<string, unknown>> = [];
  for (const variant of variants) {
    try {
      let pageUrl = assertAllowedPrimaryPageUrl(candidate.sourceKey, variant);
      for (let redirectCount = 0; redirectCount <= 2; redirectCount += 1) {
        const response = await fetch(pageUrl, {
          headers: {
            accept: "text/html,application/xhtml+xml;q=0.9,text/plain;q=0.6",
            "accept-language": "en-IN,en;q=0.9",
            "cache-control": "no-cache",
            "user-agent": "Mozilla/5.0 (compatible; Examtree-Current-Affairs-Recovery/1.0; +https://examtree.in)",
          },
          redirect: "manual",
          signal: AbortSignal.timeout(15_000),
        });
        if (response.status >= 300 && response.status < 400) {
          const location = response.headers.get("location");
          attempts.push({ url: pageUrl, status: response.status, accepted: false, reason: "validated_redirect" });
          if (!location) throw new Error(`Primary recovery redirect HTTP ${response.status} omitted Location`);
          if (redirectCount === 2) throw new Error("Primary recovery page exceeded redirect limit");
          pageUrl = assertAllowedPrimaryPageUrl(
            candidate.sourceKey,
            new URL(location, pageUrl).toString(),
          );
          continue;
        }
        if (!response.ok) {
          attempts.push({ url: pageUrl, status: response.status, accepted: false, reason: "http_status" });
          break;
        }
        const contentType = String(response.headers.get("content-type") ?? "").toLowerCase();
        if (contentType && !contentType.includes("html") && !contentType.includes("text/plain")) {
          attempts.push({ url: pageUrl, status: response.status, accepted: false, reason: "unsupported_content_type" });
          break;
        }
        const html = await readBounded(response);
        const text = extractSelectedPrimaryPageText(html);
        const identity = recoveryPageMatchesTitle(candidate.title, text);
        const focusedText = identity.matched ? primaryEvidenceWindow(candidate.title, text) : "";
        attempts.push({
          url: pageUrl,
          status: response.status,
          accepted: identity.matched,
          reason: identity.matched ? "title_identity" : "title_identity_failed",
          visibleCharCount: text.length,
          evidenceWindowCharCount: focusedText.length,
          sharedTerms: identity.sharedTerms,
          containment: identity.containment,
        });
        if (identity.matched) return { text: focusedText, resolvedUrl: pageUrl, attempts };
        break;
      }
    } catch (error) {
      attempts.push({ url: variant, accepted: false, reason: safeError(error) });
    }
  }
  return { text: null, resolvedUrl: null, attempts };
}

async function loadSelectedPrimaryCandidates(targetDate: string): Promise<RecoveryCandidate[]> {
  const rows = await sqlClient`
    SELECT DISTINCT ON (candidate.id, event.id)
      candidate.id::text AS "candidateId",
      event.id::text AS "eventId",
      link.cluster_id::text AS "clusterId",
      source.id::text AS "sourceId",
      source.source_key AS "sourceKey",
      candidate.source_url AS "sourceUrl",
      candidate.raw_title AS title,
      source.is_primary_source AS "isPrimarySource",
      source.content_policy AS "contentPolicy"
    FROM content.current_affairs_ingestion_candidates candidate
    JOIN content.current_affairs_sources source ON source.id=candidate.source_id
    JOIN content.current_affairs_event_candidates link ON link.candidate_id=candidate.id
    JOIN content.current_affairs_events event ON event.id=link.event_id
    WHERE COALESCE((candidate.payload->>'manualEditorialSelected')::boolean, false)=true
      AND COALESCE(
        NULLIF(candidate.payload->>'historicalTargetDate',''),
        NULLIF(candidate.payload->>'discoveryTargetDate',''),
        (candidate.published_at AT TIME ZONE 'Asia/Kolkata')::date::text
      )=${targetDate}
      AND source.is_active=true
      AND source.is_primary_source=true
      AND source.content_policy='primary_facts'
      AND candidate.source_url IS NOT NULL
      AND event.status='review'
    ORDER BY candidate.id, event.id, event.updated_at DESC
    LIMIT ${MAX_SELECTED}
  `;
  return rows.map((row) => ({
    candidateId: String(row.candidateId),
    eventId: String(row.eventId),
    clusterId: row.clusterId ? String(row.clusterId) : null,
    sourceId: String(row.sourceId),
    sourceKey: String(row.sourceKey),
    sourceUrl: String(row.sourceUrl ?? ""),
    title: String(row.title ?? ""),
    isPrimarySource: Boolean(row.isPrimarySource),
    contentPolicy: String(row.contentPolicy ?? ""),
  }));
}

async function manualAuthorityProtected(eventId: string) {
  const rows = await sqlClient`
    SELECT
      EXISTS (
        SELECT 1 FROM content.current_affairs_facts fact
        WHERE fact.event_id=${eventId}::uuid AND fact.reconciliation_status='manual'
      ) AS "manualFact",
      EXISTS (
        SELECT 1 FROM content.current_affairs_fact_conflicts conflict
        WHERE conflict.event_id=${eventId}::uuid AND conflict.status='manually_resolved'
      ) AS "manualConflict",
      EXISTS (
        SELECT 1 FROM content.current_affairs_events event
        WHERE event.id=${eventId}::uuid AND event.learner_authoring_status='manual'
      ) AS "manualAuthoring"
  `;
  return Boolean(rows[0]?.manualFact || rows[0]?.manualConflict || rows[0]?.manualAuthoring);
}

async function refreshHeadlineClaims(candidate: RecoveryCandidate) {
  const claims = extractSelectedHeadlineRecoveryClaims(candidate.title);
  await sqlClient.begin(async (tx) => {
    await tx`
      DELETE FROM content.current_affairs_fact_claims
      WHERE event_id=${candidate.eventId}::uuid
        AND candidate_id=${candidate.candidateId}::uuid
        AND extraction_method='rule'
        AND COALESCE(metadata->>'source', 'headline')='headline'
    `;
    for (const claim of claims) {
      await tx`
        INSERT INTO content.current_affairs_fact_claims (
          id, cluster_id, event_id, candidate_id, source_id,
          fact_key, fact_value, normalized_value, fact_type, confidence,
          extraction_method, is_primary_evidence, metadata, created_at
        ) VALUES (
          ${randomUUID()}::uuid, ${candidate.clusterId}::uuid, ${candidate.eventId}::uuid,
          ${candidate.candidateId}::uuid, ${candidate.sourceId}::uuid,
          ${claim.factKey}, ${claim.factValue}, ${claim.normalizedValue}, ${claim.factType},
          ${claim.confidence}, ${claim.extractionMethod}, true,
          ${JSON.stringify({
            source: "headline",
            claimStage: "cp054_selected_recovery",
            intelligenceVersion: SELECTED_PRIMARY_RECOVERY_VERSION,
            automaticVerificationAuthority: false,
          })}::jsonb,
          now()
        )
        ON CONFLICT (candidate_id, fact_key, normalized_value) DO UPDATE
        SET cluster_id=COALESCE(EXCLUDED.cluster_id, content.current_affairs_fact_claims.cluster_id),
            event_id=EXCLUDED.event_id,
            source_id=EXCLUDED.source_id,
            fact_value=EXCLUDED.fact_value,
            fact_type=EXCLUDED.fact_type,
            confidence=GREATEST(content.current_affairs_fact_claims.confidence, EXCLUDED.confidence),
            is_primary_evidence=true,
            metadata=content.current_affairs_fact_claims.metadata || EXCLUDED.metadata
      `;
    }
  });
  return claims.length;
}

async function materializePageFacts(candidate: RecoveryCandidate, resolvedUrl: string, text: string) {
  const facts = extractSelectedPrimaryPageFacts(candidate.title, text);
  let inserted = 0;
  for (const fact of facts) {
    const rows = await sqlClient`
      INSERT INTO content.current_affairs_fact_claims (
        id, cluster_id, event_id, candidate_id, source_id,
        fact_key, fact_value, normalized_value, fact_type, confidence,
        extraction_method, is_primary_evidence, metadata, created_at
      )
      SELECT
        ${randomUUID()}::uuid, ${candidate.clusterId}::uuid, ${candidate.eventId}::uuid, NULL,
        ${candidate.sourceId}::uuid, ${fact.factKey}, ${fact.factValue}, ${fact.normalizedValue},
        ${fact.factType}, ${fact.confidence}, 'rule', true,
        ${JSON.stringify({
          source: "primary_page_recovery",
          claimStage: "cp054_selected_primary_page",
          intelligenceVersion: SELECTED_PRIMARY_RECOVERY_VERSION,
          sourceCandidateId: candidate.candidateId,
          resolvedPageUrl: resolvedUrl,
          evidenceClass: fact.evidenceClass,
          rawTextPersisted: false,
          automaticVerificationAuthority: false,
        })}::jsonb,
        now()
      WHERE NOT EXISTS (
        SELECT 1 FROM content.current_affairs_fact_claims existing
        WHERE existing.event_id=${candidate.eventId}::uuid
          AND existing.source_id=${candidate.sourceId}::uuid
          AND existing.fact_key=${fact.factKey}
          AND existing.normalized_value=${fact.normalizedValue}
      )
      RETURNING id
    `;
    if (rows[0]) inserted += 1;
  }
  return { extracted: facts.length, inserted };
}

export async function recoverSelectedPrimaryEvidence(args: {
  targetDate: string;
  actorUserId: string;
}) {
  const candidates = await loadSelectedPrimaryCandidates(args.targetDate);
  const results: Array<Record<string, unknown>> = [];
  let headlineClaimsRefreshed = 0;
  let pageFactsExtracted = 0;
  let pageFactsInserted = 0;
  let pageMatches = 0;
  let protectedCount = 0;

  for (const candidate of candidates) {
    if (!SUPPORTED_SOURCE_KEYS.has(candidate.sourceKey)) {
      results.push({
        candidateId: candidate.candidateId,
        eventId: candidate.eventId,
        sourceKey: candidate.sourceKey,
        status: "unsupported_source",
      });
      continue;
    }
    if (await manualAuthorityProtected(candidate.eventId)) {
      protectedCount += 1;
      results.push({
        candidateId: candidate.candidateId,
        eventId: candidate.eventId,
        sourceKey: candidate.sourceKey,
        status: "manual_authority_protected",
      });
      continue;
    }

    const headlineClaimCount = await refreshHeadlineClaims(candidate);
    headlineClaimsRefreshed += headlineClaimCount;
    const page = await fetchRecoveryPage(candidate);
    if (page.text && page.resolvedUrl) {
      pageMatches += 1;
      const pageFacts = await materializePageFacts(candidate, page.resolvedUrl, page.text);
      pageFactsExtracted += pageFacts.extracted;
      pageFactsInserted += pageFacts.inserted;
      results.push({
        candidateId: candidate.candidateId,
        eventId: candidate.eventId,
        sourceKey: candidate.sourceKey,
        status: "recovered",
        headlineClaimCount,
        pageFactCount: pageFacts.extracted,
        insertedPageFactCount: pageFacts.inserted,
        pageAttempts: page.attempts,
      });
    } else {
      results.push({
        candidateId: candidate.candidateId,
        eventId: candidate.eventId,
        sourceKey: candidate.sourceKey,
        status: headlineClaimCount > 0 ? "headline_recovered" : "page_unavailable",
        headlineClaimCount,
        pageFactCount: 0,
        insertedPageFactCount: 0,
        pageAttempts: page.attempts,
      });
    }
  }

  if (candidates.length > 0) {
    const eventIds = [...new Set(candidates.map((candidate) => candidate.eventId))];
    await sqlClient`
      UPDATE content.current_affairs_events
      SET metadata=COALESCE(metadata, '{}'::jsonb) || ${JSON.stringify({
        selectedPrimaryRecoveryVersion: SELECTED_PRIMARY_RECOVERY_VERSION,
        lastSelectedPrimaryRecoveryAt: new Date().toISOString(),
        lastSelectedPrimaryRecoveryBy: args.actorUserId,
        automaticVerificationAuthority: false,
        automaticPublicationAuthority: false,
      })}::jsonb,
          updated_at=now()
      WHERE id = ANY(${eventIds}::uuid[])
    `;
  }

  return {
    recoveryVersion: SELECTED_PRIMARY_RECOVERY_VERSION,
    targetDate: args.targetDate,
    candidatesExamined: candidates.length,
    protectedCount,
    headlineClaimsRefreshed,
    pageMatches,
    pageFactsExtracted,
    pageFactsInserted,
    rawTextPersisted: false,
    verificationAuthority: false,
    publicationAuthority: false,
    results,
  };
}
