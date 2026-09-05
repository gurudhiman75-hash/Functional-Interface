import { randomUUID } from "node:crypto";

import { sqlClient } from "../lib/db";
import { runSourceIndependentAuthoringForEventIds } from "./authoring-runtime";
import { normalizeCurrentAffairsText } from "./core";
import { reconcilePrimaryEnrichedEventIds } from "./enriched-event-reconciliation";
import { parseSyndicationFeed } from "./ingestion";
import { runCurrentAffairsLocalizationForEventIds } from "./localization-runtime";
import { extractPrimaryPageText } from "./primary-fact-extraction";
import { fetchBoundedOfficialText } from "./source-fetch";

export const SELECTED_RESIDUAL_BLOCKER_CLOSURE_VERSION = "ca-cp064-selected-residual-closure-v1";

const MAX_SELECTED = 300;
const MAX_PAGE_BYTES = 3_500_000;
const MAX_FEED_BYTES = 2_500_000;

const RESIDUAL_TITLE_PATTERNS = [
  /Money Market Operations as on/i,
  /Balance of Payments/i,
  /India[’']s GDP Performance/i,
  /NCERT[’']s 66th Foundation Day|NCERT.*66th Foundation Day/i,
  /\bDISSSA\b/i,
];

type SelectedCandidateRow = {
  candidateId: string;
  eventId: string;
  eventDate: string;
  eventTitle: string;
  eventStatus: string;
  authoringStatus: string;
  sourceId: string;
  sourceKey: string;
  sourceUrl: string;
  feedUrl: string | null;
  title: string;
  pendingCp063Claims: boolean;
};

type ResidualFact = {
  key: string;
  value: string;
  type: "string" | "number" | "date" | "money" | "percentage" | "entity" | "boolean";
  confidence: number;
  evidenceClass: string;
};

function clean(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function fact(
  key: string,
  value: string,
  type: ResidualFact["type"],
  confidence: number,
  evidenceClass: string,
): ResidualFact | null {
  const display = clean(value).replace(/^[,;:\s]+|[,;:\s]+$/g, "");
  if (!display || display.length > 360) return null;
  return { key, value: display, type, confidence, evidenceClass };
}

function push(target: ResidualFact[], item: ResidualFact | null) {
  if (!item) return;
  const normalized = normalizeCurrentAffairsText(item.value);
  if (!target.some((existing) => existing.key === item.key && normalizeCurrentAffairsText(existing.value) === normalized)) {
    target.push(item);
  }
}

function percentage(value: string) {
  return `${value.replace(/\s+/g, "").replace(/%$/, "")}%`;
}

function shouldAttemptResidualRecovery(title: string) {
  return RESIDUAL_TITLE_PATTERNS.some((pattern) => pattern.test(title));
}

function firstMatch(value: string, pattern: RegExp) {
  return value.match(pattern);
}

export function recoverSelectedResidualFactsForTest(args: {
  title: string;
  text: string;
  sourceKey: string;
}): ResidualFact[] {
  return recoverResidualFacts(args.title, args.text, args.sourceKey);
}

function recoverResidualFacts(title: string, text: string, sourceKey: string): ResidualFact[] {
  const facts: ResidualFact[] = [];
  const combined = clean(`${title} ${text}`);

  if (/Money Market Operations as on/i.test(title) && sourceKey === "rbi") {
    const overnight = firstMatch(
      combined,
      /Overnight\s+Segment(?:\s*\([^)]*\))?[^0-9]{0,120}([0-9][0-9,]*(?:\.[0-9]+)?)\s+([0-9]+(?:\.[0-9]+)?)\s+([0-9]+(?:\.[0-9]+)?\s*[-–]\s*[0-9]+(?:\.[0-9]+)?)/i,
    );
    if (overnight?.[1] && overnight[2]) {
      const date = title.match(/as on\s+(.+)$/i)?.[1] ?? "the reported date";
      push(facts, fact("acting_entity", "Reserve Bank of India", "entity", 0.99, "cp064_rbi_money_market"));
      push(facts, fact("official_action", "reported", "string", 0.98, "cp064_rbi_money_market"));
      push(facts, fact(
        "action_subject",
        `overnight money-market volume of ₹${overnight[1]} crore at a ${percentage(overnight[2])} weighted average rate on ${date}`,
        "string",
        0.98,
        "cp064_rbi_money_market",
      ));
    }
  }

  if (/Balance of Payments/i.test(title) && sourceKey === "rbi") {
    const cad = firstMatch(
      combined,
      /current\s+account\s+deficit[^$]{0,160}?(?:stood\s+at|was|amounted\s+to|of)?\s*(?:US\$|USD|\$)\s*([0-9]+(?:\.[0-9]+)?)\s*billion[^%]{0,100}?([0-9]+(?:\.[0-9]+)?)\s*(?:per\s*cent|percent|%)\s+of\s+GDP/i,
    );
    if (cad?.[1] && cad[2]) {
      push(facts, fact("acting_entity", "Reserve Bank of India", "entity", 0.99, "cp064_rbi_bop"));
      push(facts, fact("official_action", "reported", "string", 0.98, "cp064_rbi_bop"));
      push(facts, fact(
        "action_subject",
        `Q1 2026-27 current account deficit of US$ ${cad[1]} billion (${percentage(cad[2])} of GDP)`,
        "string",
        0.99,
        "cp064_rbi_bop",
      ));
    }
  }

  if (/India[’']s GDP Performance/i.test(title) && sourceKey === "pib") {
    const gdp = firstMatch(
      combined,
      /real\s+GDP(?:\s+growth)?[^%]{0,140}?(?:accelerat(?:ed|ing)\s+to|grew\s+(?:by\s+)?|growth\s+(?:of\s+|at\s+)?|rose\s+(?:by\s+)?|recorded\s+(?:a\s+)?|at)\s*([0-9]+(?:\.[0-9]+)?)\s*%/i,
    );
    const gva = firstMatch(
      combined,
      /real\s+GVA[^%]{0,120}?(?:rose|grew|growth(?:\s+of)?|increased|recorded)\s*(?:by\s+|to\s+|at\s+)?([0-9]+(?:\.[0-9]+)?)\s*%/i,
    );
    if (gdp?.[1]) {
      const subject = gva?.[1]
        ? `${percentage(gdp[1])} real GDP growth in Q1 2026-27, with real GVA growth of ${percentage(gva[1])}`
        : `${percentage(gdp[1])} real GDP growth in Q1 2026-27`;
      push(facts, fact("acting_entity", "Government of India", "entity", 0.98, "cp064_pib_gdp"));
      push(facts, fact("official_action", "reported", "string", 0.98, "cp064_pib_gdp"));
      push(facts, fact("action_subject", subject, "string", 0.99, "cp064_pib_gdp"));
    }
  }

  if ((/NCERT[’']s 66th Foundation Day|NCERT.*66th Foundation Day/i.test(title)) && sourceKey === "pib") {
    const minister = firstMatch(combined, /Union\s+Minister\s+for\s+Education,?\s+Shri\s+([A-Za-z .'-]{3,80})\s+(?:today\s+)?(?:noted|said|highlighted|emphasised|informed|inaugurated)/i)?.[1];
    const hasRobotics = /Robotics Learning Centre/i.test(combined);
    const hasTranslation = /Translation Lab/i.test(combined);
    const hasTv = /(?:upgraded|state-of-the-art)[^.;]{0,50}(?:Television|TV) Studio/i.test(combined);
    if (hasRobotics && (hasTranslation || hasTv)) {
      const facilities = [
        "Robotics Learning Centre",
        hasTranslation ? "Translation Lab" : "",
        hasTv ? "upgraded Television Studio" : "",
      ].filter(Boolean).join(", ");
      push(facts, fact(
        "acting_entity",
        minister ? `Union Minister for Education, Shri ${clean(minister)}` : "Union Minister for Education",
        "entity",
        0.97,
        "cp064_pib_ncert",
      ));
      push(facts, fact("official_action", "launched", "string", 0.96, "cp064_pib_ncert"));
      push(facts, fact(
        "action_subject",
        `${facilities} during NCERT's 66th Foundation Day celebrations in New Delhi`,
        "string",
        0.97,
        "cp064_pib_ncert",
      ));
    } else if (/Union Minister for Education/i.test(title) && /66th Foundation Day celebrations/i.test(title)) {
      push(facts, fact("acting_entity", "Union Minister for Education", "entity", 0.94, "cp064_pib_ncert_headline"));
      push(facts, fact("official_action", "attended", "string", 0.93, "cp064_pib_ncert_headline"));
      push(facts, fact("action_subject", "NCERT's 66th Foundation Day celebrations in New Delhi", "string", 0.95, "cp064_pib_ncert_headline"));
    }
  }

  if (/\bDISSSA\b/i.test(title) && sourceKey === "pib") {
    const hasDepwd = /DEPwD|Department of Empowerment of Persons with Disabilities/i.test(combined);
    const hasRerf = /RERF|Rajyoga Education Research Foundation/i.test(combined);
    const hasMou = /Memorandum of Understanding|\bMoU\b/i.test(combined);
    if (hasDepwd && hasRerf && hasMou) {
      const fullName = firstMatch(
        combined,
        /Divyang\s+Samanata,?\s+Sanrakshan\s+evam\s+Sashaktikaran\s+Abhiyan\s*\(DISSSA\)/i,
      )?.[0] ?? "Divyang Samanata, Sanrakshan evam Sashaktikaran Abhiyan (DISSSA)";
      push(facts, fact(
        "acting_entity",
        "Department of Empowerment of Persons with Disabilities and Rajyoga Education Research Foundation",
        "entity",
        0.98,
        "cp064_pib_disssa",
      ));
      push(facts, fact("official_action", "signed an MoU to launch", "string", 0.97, "cp064_pib_disssa"));
      push(facts, fact("action_subject", fullName, "string", 0.99, "cp064_pib_disssa"));
    }
  }

  return facts;
}

async function loadSelectedCandidates(targetDate: string): Promise<SelectedCandidateRow[]> {
  const rows = await sqlClient`
    SELECT DISTINCT ON (candidate.id, event.id)
      candidate.id::text AS "candidateId",
      event.id::text AS "eventId",
      event.event_date::text AS "eventDate",
      event.canonical_title AS "eventTitle",
      event.status AS "eventStatus",
      event.learner_authoring_status AS "authoringStatus",
      source.id::text AS "sourceId",
      source.source_key AS "sourceKey",
      candidate.source_url AS "sourceUrl",
      source.feed_url AS "feedUrl",
      candidate.raw_title AS title,
      EXISTS (
        SELECT 1
        FROM content.current_affairs_fact_claims claim
        WHERE claim.event_id=event.id
          AND COALESCE(claim.metadata->>'claimStage','')='cp063_selected_blocker_closure'
          AND claim.created_at > COALESCE(
            NULLIF(event.metadata->>'lastPrimaryEnrichmentReconciledAt','')::timestamptz,
            'epoch'::timestamptz
          )
      ) AS "pendingCp063Claims"
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
      AND source.source_key IN ('pib','rbi')
      AND candidate.source_url IS NOT NULL
      AND event.status IN ('review','verified')
    ORDER BY candidate.id, event.id, event.updated_at DESC
    LIMIT ${MAX_SELECTED}
  `;
  return rows.map((row) => ({
    candidateId: String(row.candidateId),
    eventId: String(row.eventId),
    eventDate: String(row.eventDate),
    eventTitle: String(row.eventTitle ?? ""),
    eventStatus: String(row.eventStatus),
    authoringStatus: String(row.authoringStatus ?? "pending"),
    sourceId: String(row.sourceId),
    sourceKey: String(row.sourceKey),
    sourceUrl: String(row.sourceUrl),
    feedUrl: row.feedUrl ? String(row.feedUrl) : null,
    title: String(row.title ?? ""),
    pendingCp063Claims: Boolean(row.pendingCp063Claims),
  }));
}

function pibFallbackUrls(sourceUrl: string) {
  let url: URL;
  try {
    url = new URL(sourceUrl);
  } catch {
    return [];
  }
  const prid = url.searchParams.get("PRID") ?? url.searchParams.get("prid");
  if (!prid || !/^\d+$/.test(prid)) return [];
  return [
    `https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=${prid}&lang=1&reg=3`,
    `https://www.pib.gov.in/PressReleasePage.aspx?PRID=${prid}&lang=1&reg=3`,
    `https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=${prid}&lang=1&reg=3`,
  ];
}

async function fetchPageText(url: string) {
  try {
    const html = await fetchBoundedOfficialText(url, {
      accept: "text/html,application/xhtml+xml;q=0.9,text/plain;q=0.5",
      maxBytes: MAX_PAGE_BYTES,
      label: "Selected residual official page",
    });
    return extractPrimaryPageText(html);
  } catch {
    return "";
  }
}

async function fetchFeedText(candidate: SelectedCandidateRow) {
  if (!candidate.feedUrl) return "";
  try {
    const xml = await fetchBoundedOfficialText(candidate.feedUrl, {
      accept: "application/rss+xml,application/atom+xml,application/xml,text/xml;q=0.9,text/plain;q=0.5",
      maxBytes: MAX_FEED_BYTES,
      label: "Selected residual official feed",
    });
    const targetTitle = normalizeCurrentAffairsText(candidate.title);
    const entries = parseSyndicationFeed(xml, candidate.feedUrl);
    const match = entries.find((entry) => normalizeCurrentAffairsText(entry.title) === targetTitle)
      ?? entries.find((entry) => {
        const title = normalizeCurrentAffairsText(entry.title);
        return title.length > 12 && targetTitle.length > 12 && (title.includes(targetTitle) || targetTitle.includes(title));
      });
    return clean(match?.discoveryText ?? "");
  } catch {
    return "";
  }
}

async function officialCorpus(candidate: SelectedCandidateRow) {
  const urls = [
    candidate.sourceUrl,
    ...(candidate.sourceKey === "pib" ? pibFallbackUrls(candidate.sourceUrl) : []),
  ];
  const chunks: string[] = [];
  for (const url of [...new Set(urls)]) {
    const text = await fetchPageText(url);
    if (text.length >= 80) chunks.push(text);
    if (chunks.some((item) => item.length >= 5000)) break;
  }
  const feedText = await fetchFeedText(candidate);
  if (feedText.length >= 40) chunks.push(feedText);
  return clean(chunks.join(" "));
}

async function insertResidualFacts(candidate: SelectedCandidateRow, facts: ResidualFact[]) {
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
          source: "selected_residual_blocker_closure",
          claimStage: "cp064_selected_residual_closure",
          evidenceClass: item.evidenceClass,
          sourcePageUrl: candidate.sourceUrl,
          selectedCandidateId: candidate.candidateId,
          closureVersion: SELECTED_RESIDUAL_BLOCKER_CLOSURE_VERSION,
          rawTextPersisted: false,
          automaticVerificationAuthority: false,
          automaticPublicationAuthority: false,
        })}::jsonb, now()
      WHERE NOT EXISTS (
        SELECT 1
        FROM content.current_affairs_fact_claims existing
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

const MONTHS: Record<string, string> = {
  january: "01", february: "02", march: "03", april: "04", may: "05", june: "06",
  july: "07", august: "08", september: "09", october: "10", november: "11", december: "12",
};

function moneyMarketAsOnDate(title: string) {
  const match = title.match(/Money Market Operations as on\s+([A-Za-z]+)\s+([0-3]?\d),\s*(20\d{2})/i);
  if (!match?.[1] || !match[2] || !match[3]) return null;
  const month = MONTHS[match[1].toLowerCase()];
  if (!month) return null;
  return `${match[3]}-${month}-${String(Number(match[2])).padStart(2, "0")}`;
}

async function repairRecurringCanonicalTitle(candidate: SelectedCandidateRow) {
  const date = moneyMarketAsOnDate(candidate.title);
  if (!date || date !== candidate.eventDate || candidate.eventTitle === candidate.title) return false;
  if (!/Money Market Operations as on/i.test(candidate.eventTitle)) return false;
  await sqlClient`
    UPDATE content.current_affairs_events
    SET canonical_title=${candidate.title},
        metadata=COALESCE(metadata, '{}'::jsonb) || ${JSON.stringify({
          selectedResidualRecurringTitleRepairVersion: SELECTED_RESIDUAL_BLOCKER_CLOSURE_VERSION,
          selectedResidualRecurringTitleRepairAt: new Date().toISOString(),
          automaticPublicationAuthority: false,
        })}::jsonb,
        updated_at=now()
    WHERE id=${candidate.eventId}::uuid
  `;
  return true;
}

async function markForReconciliation(eventIds: string[], actorUserId: string) {
  if (eventIds.length === 0) return;
  await sqlClient`
    UPDATE content.current_affairs_events
    SET status='review',
        verification_confidence=0,
        metadata=COALESCE(metadata, '{}'::jsonb) || ${JSON.stringify({
          selectedResidualClosureVersion: SELECTED_RESIDUAL_BLOCKER_CLOSURE_VERSION,
          selectedResidualReconciliationRequestedAt: new Date().toISOString(),
          selectedResidualReconciliationRequestedBy: actorUserId,
          automaticVerificationAuthority: false,
          automaticPublicationAuthority: false,
          automaticQuestionBankPromotionAuthority: false,
        })}::jsonb,
        updated_by=${actorUserId}::uuid,
        updated_at=now()
    WHERE id = ANY(${eventIds}::uuid[])
      AND status IN ('review','verified')
  `;
}

export async function closeSelectedResidualBlockers(args: {
  targetDate: string;
  actorUserId: string;
}) {
  if (!/^20\d{2}-\d{2}-\d{2}$/.test(args.targetDate)) throw new Error("targetDate must be YYYY-MM-DD");
  const candidates = await loadSelectedCandidates(args.targetDate);
  const reprocessIds = new Set<string>();
  let insertedFactCount = 0;
  let recurringTitleRepairCount = 0;
  let evidenceRecoveryCandidates = 0;

  for (const candidate of candidates) {
    if (candidate.pendingCp063Claims) reprocessIds.add(candidate.eventId);

    if (await repairRecurringCanonicalTitle(candidate)) {
      recurringTitleRepairCount += 1;
      reprocessIds.add(candidate.eventId);
    }

    if (candidate.eventStatus !== "review" || !shouldAttemptResidualRecovery(candidate.title)) continue;
    evidenceRecoveryCandidates += 1;
    const corpus = await officialCorpus(candidate);
    const facts = recoverResidualFacts(candidate.title, corpus, candidate.sourceKey);
    const inserted = await insertResidualFacts(candidate, facts);
    if (inserted > 0) {
      insertedFactCount += inserted;
      reprocessIds.add(candidate.eventId);
    }
  }

  const eventIds = [...reprocessIds];
  await markForReconciliation(eventIds, args.actorUserId);
  const reconciliation = await reconcilePrimaryEnrichedEventIds(eventIds);
  const authoring = await runSourceIndependentAuthoringForEventIds(eventIds);
  const localization = await runCurrentAffairsLocalizationForEventIds(eventIds);

  return {
    closureVersion: SELECTED_RESIDUAL_BLOCKER_CLOSURE_VERSION,
    candidatesExamined: candidates.length,
    evidenceRecoveryCandidates,
    insertedFactCount,
    recurringTitleRepairCount,
    reprocessedEventCount: eventIds.length,
    reconciliation,
    authoring,
    localization,
    automaticVerificationAuthority: false,
    automaticPublicationAuthority: false,
    automaticQuestionBankPromotionAuthority: false,
  };
}
