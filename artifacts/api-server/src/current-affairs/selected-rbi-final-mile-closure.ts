import { randomUUID } from "node:crypto";

import { sqlClient } from "../lib/db";
import { runSourceIndependentAuthoringForEventIds } from "./authoring-runtime";
import { normalizeCurrentAffairsText } from "./core";
import { reconcilePrimaryEnrichedEventIds } from "./enriched-event-reconciliation";
import { runCurrentAffairsLocalizationForEventIds } from "./localization-runtime";
import { extractPrimaryPageText } from "./primary-fact-extraction";
import { fetchBoundedOfficialText } from "./source-fetch";

export const SELECTED_RBI_FINAL_MILE_CLOSURE_VERSION = "ca-cp065-rbi-final-mile-v1";

const MAX_CANDIDATES = 20;
const MAX_PAGE_BYTES = 3_500_000;
const MAX_DIAGNOSTICS = 40;

const RBI_FINAL_MILE_PATTERNS = [
  /Money Market Operations as on/i,
  /Balance of Payments/i,
];

type RbiCandidate = {
  candidateId: string;
  eventId: string;
  sourceId: string;
  sourceUrl: string;
  title: string;
};

type RbiFact = {
  key: string;
  value: string;
  type: "string" | "entity";
  confidence: number;
  evidenceClass: string;
};

type FetchDiagnostic = {
  candidateId: string;
  publicDelivery: string;
  status: "usable" | "empty_or_shell" | "no_fact_match" | "fetch_error";
  visibleCharCount: number;
  factCount: number;
  error?: string;
};

function clean(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function percentage(value: string) {
  return `${value.replace(/\s+/g, "").replace(/%$/, "")}%`;
}

function makeFact(
  key: string,
  value: string,
  type: RbiFact["type"],
  confidence: number,
  evidenceClass: string,
): RbiFact | null {
  const display = clean(value).replace(/^[,;:\s]+|[,;:\s]+$/g, "");
  if (!display || display.length > 360) return null;
  return { key, value: display, type, confidence, evidenceClass };
}

function push(target: RbiFact[], item: RbiFact | null) {
  if (!item) return;
  const normalized = normalizeCurrentAffairsText(item.value);
  if (!target.some((existing) => existing.key === item.key && normalizeCurrentAffairsText(existing.value) === normalized)) {
    target.push(item);
  }
}

export function recoverSelectedRbiFinalMileFactsForTest(args: {
  title: string;
  text: string;
}): RbiFact[] {
  const facts: RbiFact[] = [];
  const combined = clean(`${args.title} ${args.text}`);

  if (/Money Market Operations as on/i.test(args.title)) {
    const overnight = combined.match(
      /Overnight\s+Segment(?:\s*\([^)]*\))?[^0-9]{0,180}([0-9][0-9,]*(?:\.[0-9]+)?)\s+([0-9]+(?:\.[0-9]+)?)\s+([0-9]+(?:\.[0-9]+)?\s*[-–]\s*[0-9]+(?:\.[0-9]+)?)/i,
    );
    if (overnight?.[1] && overnight[2]) {
      const date = args.title.match(/as on\s+(.+)$/i)?.[1] ?? "the reported date";
      push(facts, makeFact("acting_entity", "Reserve Bank of India", "entity", 0.99, "cp065_rbi_money_market"));
      push(facts, makeFact("official_action", "reported", "string", 0.98, "cp065_rbi_money_market"));
      push(facts, makeFact(
        "action_subject",
        `overnight money-market volume of ₹${overnight[1]} crore at a ${percentage(overnight[2])} weighted average rate on ${date}`,
        "string",
        0.98,
        "cp065_rbi_money_market",
      ));
    }
  }

  if (/Balance of Payments/i.test(args.title)) {
    const cad = combined.match(
      /current\s+account(?:\s+(?:recorded|registered)\s+a)?\s+deficit(?:\s*\(CAD\))?[^$]{0,220}?(?:stood\s+at|was|amounted\s+to|of)?\s*(?:US\$|USD|\$)\s*([0-9]+(?:\.[0-9]+)?)\s*billion[^%]{0,160}?\(?\s*([0-9]+(?:\.[0-9]+)?)\s*(?:per\s*cent|percent|%)\s+of\s+GDP\s*\)?/i,
    );
    if (cad?.[1] && cad[2]) {
      push(facts, makeFact("acting_entity", "Reserve Bank of India", "entity", 0.99, "cp065_rbi_bop"));
      push(facts, makeFact("official_action", "reported", "string", 0.98, "cp065_rbi_bop"));
      push(facts, makeFact(
        "action_subject",
        `Q1 2026-27 current account deficit of US$ ${cad[1]} billion (${percentage(cad[2])} of GDP)`,
        "string",
        0.99,
        "cp065_rbi_bop",
      ));
    }
  }

  return facts;
}

function pressReleaseId(sourceUrl: string) {
  try {
    const url = new URL(sourceUrl);
    const prid = url.searchParams.get("prid") ?? url.searchParams.get("PRID");
    return prid && /^\d+$/.test(prid) ? prid : null;
  } catch {
    return null;
  }
}

export function rbiOfficialFallbackUrlsForTest(sourceUrl: string) {
  const prid = pressReleaseId(sourceUrl);
  if (!prid) return [sourceUrl];
  return [...new Set([
    sourceUrl,
    `https://www.rbi.org.in/scripts/FS_PressRelease.aspx?prid=${prid}`,
    `https://www.rbi.org.in/scripts/FS_PressRelease.aspx?prid=${prid}&fn=2753`,
    `https://m.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=${prid}`,
    `https://m.rbi.org.in/scripts/FS_PressRelease.aspx?prid=${prid}`,
    `https://m.rbi.org.in/scripts/FS_PressRelease.aspx?prid=${prid}&fn=2753`,
  ])];
}

async function loadCandidates(targetDate: string): Promise<RbiCandidate[]> {
  const rows = await sqlClient`
    SELECT DISTINCT ON (candidate.id, event.id)
      candidate.id::text AS "candidateId",
      event.id::text AS "eventId",
      source.id::text AS "sourceId",
      candidate.source_url AS "sourceUrl",
      candidate.raw_title AS title
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
      AND source.source_key='rbi'
      AND candidate.source_url IS NOT NULL
      AND event.status='review'
      AND (
        candidate.raw_title ~* 'Money Market Operations as on'
        OR candidate.raw_title ~* 'Balance of Payments'
      )
    ORDER BY candidate.id, event.id, event.updated_at DESC
    LIMIT ${MAX_CANDIDATES}
  `;
  return rows.map((row) => ({
    candidateId: String(row.candidateId),
    eventId: String(row.eventId),
    sourceId: String(row.sourceId),
    sourceUrl: String(row.sourceUrl),
    title: String(row.title ?? ""),
  }));
}

async function fetchFacts(candidate: RbiCandidate, diagnostics: FetchDiagnostic[]) {
  for (const deliveryUrl of rbiOfficialFallbackUrlsForTest(candidate.sourceUrl)) {
    try {
      const html = await fetchBoundedOfficialText(deliveryUrl, {
        accept: "text/html,application/xhtml+xml;q=0.9,text/plain;q=0.5",
        maxBytes: MAX_PAGE_BYTES,
        label: "Selected RBI final-mile page",
      });
      const visibleText = extractPrimaryPageText(html);
      const facts = recoverSelectedRbiFinalMileFactsForTest({ title: candidate.title, text: visibleText });
      diagnostics.push({
        candidateId: candidate.candidateId,
        publicDelivery: deliveryUrl,
        status: facts.length >= 3 ? "usable" : visibleText.length < 80 ? "empty_or_shell" : "no_fact_match",
        visibleCharCount: visibleText.length,
        factCount: facts.length,
      });
      if (facts.length >= 3) return { facts, deliveryUrl };
    } catch (error) {
      diagnostics.push({
        candidateId: candidate.candidateId,
        publicDelivery: deliveryUrl,
        status: "fetch_error",
        visibleCharCount: 0,
        factCount: 0,
        error: (error instanceof Error ? error.message : "Unknown RBI fetch error").slice(0, 300),
      });
    }
    if (diagnostics.length >= MAX_DIAGNOSTICS) break;
  }
  return { facts: [] as RbiFact[], deliveryUrl: null as string | null };
}

async function insertFacts(candidate: RbiCandidate, facts: RbiFact[], deliveryUrl: string) {
  let inserted = 0;
  for (const item of facts) {
    const normalizedValue = normalizeCurrentAffairsText(item.value);
    const rows = await sqlClient`
      INSERT INTO content.current_affairs_fact_claims (
        id, cluster_id, event_id, candidate_id, source_id,
        fact_key, fact_value, normalized_value, fact_type, confidence,
        extraction_method, is_primary_evidence, metadata, created_at
      )
      SELECT
        ${randomUUID()}::uuid, NULL, ${candidate.eventId}::uuid, ${candidate.candidateId}::uuid, ${candidate.sourceId}::uuid,
        ${item.key}, ${item.value}, ${normalizedValue}, ${item.type}, ${item.confidence},
        'rule', true, ${JSON.stringify({
          source: "selected_rbi_final_mile_closure",
          claimStage: "cp065_rbi_final_mile",
          evidenceClass: item.evidenceClass,
          sourcePageUrl: candidate.sourceUrl,
          sourceDeliveryUrl: deliveryUrl,
          selectedCandidateId: candidate.candidateId,
          closureVersion: SELECTED_RBI_FINAL_MILE_CLOSURE_VERSION,
          rawTextPersisted: false,
          automaticVerificationAuthority: false,
          automaticPublicationAuthority: false,
          automaticQuestionBankPromotionAuthority: false,
        })}::jsonb, now()
      WHERE NOT EXISTS (
        SELECT 1 FROM content.current_affairs_fact_claims existing
        WHERE existing.event_id=${candidate.eventId}::uuid
          AND existing.source_id=${candidate.sourceId}::uuid
          AND existing.fact_key=${item.key}
          AND existing.normalized_value=${normalizedValue}
      )
      RETURNING id
    `;
    inserted += rows.length;
  }
  return inserted;
}

async function markForReconciliation(eventIds: string[], actorUserId: string) {
  if (eventIds.length === 0) return;
  await sqlClient`
    UPDATE content.current_affairs_events
    SET status='review',
        verification_confidence=0,
        metadata=COALESCE(metadata, '{}'::jsonb) || ${JSON.stringify({
          selectedRbiFinalMileClosureVersion: SELECTED_RBI_FINAL_MILE_CLOSURE_VERSION,
          selectedRbiFinalMileReconciliationRequestedAt: new Date().toISOString(),
          selectedRbiFinalMileReconciliationRequestedBy: actorUserId,
          automaticVerificationAuthority: false,
          automaticPublicationAuthority: false,
          automaticQuestionBankPromotionAuthority: false,
        })}::jsonb,
        updated_by=${actorUserId}::uuid,
        updated_at=now()
    WHERE id = ANY(${eventIds}::uuid[])
      AND status='review'
  `;
}

export async function closeSelectedRbiFinalMile(args: {
  targetDate: string;
  actorUserId: string;
}) {
  if (!/^20\d{2}-\d{2}-\d{2}$/.test(args.targetDate)) throw new Error("targetDate must be YYYY-MM-DD");
  const candidates = await loadCandidates(args.targetDate);
  const diagnostics: FetchDiagnostic[] = [];
  const eventIds = new Set<string>();
  let recoveredCandidates = 0;
  let insertedFactCount = 0;

  for (const candidate of candidates) {
    if (!RBI_FINAL_MILE_PATTERNS.some((pattern) => pattern.test(candidate.title))) continue;
    const recovered = await fetchFacts(candidate, diagnostics);
    if (recovered.facts.length < 3 || !recovered.deliveryUrl) continue;
    recoveredCandidates += 1;
    const inserted = await insertFacts(candidate, recovered.facts, recovered.deliveryUrl);
    insertedFactCount += inserted;
    if (inserted > 0) eventIds.add(candidate.eventId);
  }

  const reprocessIds = [...eventIds];
  await markForReconciliation(reprocessIds, args.actorUserId);
  const reconciliation = await reconcilePrimaryEnrichedEventIds(reprocessIds);
  const authoring = await runSourceIndependentAuthoringForEventIds(reprocessIds);
  const localization = await runCurrentAffairsLocalizationForEventIds(reprocessIds);

  return {
    closureVersion: SELECTED_RBI_FINAL_MILE_CLOSURE_VERSION,
    candidatesExamined: candidates.length,
    recoveredCandidates,
    insertedFactCount,
    reprocessedEventCount: reprocessIds.length,
    diagnostics: diagnostics.slice(0, MAX_DIAGNOSTICS),
    reconciliation,
    authoring,
    localization,
    automaticVerificationAuthority: false,
    automaticPublicationAuthority: false,
    automaticQuestionBankPromotionAuthority: false,
  };
}
