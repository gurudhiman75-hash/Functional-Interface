import { createHash, randomUUID } from "node:crypto";

import { sqlClient } from "../lib/db";
import { classifyCurrentAffairsSignal } from "./ingestion";
import {
  isOneDayOfficialRescueMatch,
  ONE_DAY_RESCUE_POLICY_VERSION,
  previousCalendarDate,
} from "./one-day-rescue-policy";

const GDELT_API = "https://api.gdeltproject.org/api/v2/doc/doc";
const PROVIDER_SOURCE_KEY = "gdelt_open_news";
const REQUEST_TIMEOUT_MS = 18_000;
const MAX_RECORDS_PER_QUERY = 250;
const INDIA_OFFSET_MINUTES = 330;
const MIN_CLUSTER_DISCOVERY_SCORE = 38;
const BROAD_QUERY_KEYS = new Set(["india_press_broad", "india_global"]);

export const OPEN_NEWS_DISCOVERY_QUERIES = [
  { key: "india_press_broad", query: "sourcecountry:india sourcelang:english" },
  { key: "india_global", query: "(India OR Indian OR \"New Delhi\") sourcelang:english" },
  { key: "economy_banking", query: "sourcecountry:india (RBI OR SEBI OR economy OR banking OR inflation OR GDP OR finance OR monetary)" },
  { key: "regulators_departments", query: "sourcecountry:india (\"Legal Metrology\" OR \"Consumer Affairs\" OR \"Bureau of Indian Standards\" OR \"Competition Commission of India\" OR TRAI OR IRDAI OR PFRDA OR NPCI OR DGFT OR MoSPI OR \"NITI Aayog\")" },
  { key: "international_diplomacy", query: "sourcecountry:india (bilateral OR summit OR treaty OR agreement OR diplomacy OR foreign minister OR prime minister OR president)" },
  { key: "punjab", query: "sourcecountry:india (Punjab OR Chandigarh OR Ludhiana OR Amritsar OR Jalandhar OR Patiala)" },
  { key: "punjab_governance", query: "sourcecountry:india Punjab (cabinet OR GST OR taxation OR portal OR scheme OR policy OR notification OR appointment OR agriculture OR education OR health)" },
  { key: "science_defence_sports", query: "sourcecountry:india (ISRO OR DRDO OR defence OR space OR science OR technology OR sports OR cricket OR hockey OR badminton OR chess)" },
  { key: "exam_signals", query: "sourcecountry:india (summit OR election OR treaty OR award OR report OR index OR appointed OR launches OR approves OR signs)" },
] as const;

export type OpenNewsDiscoveryArticle = {
  url: string;
  title: string;
  seenAt: string;
  domain: string;
  language: string | null;
  sourceCountry: string | null;
};

type RescueCandidateRow = {
  id: string;
  title: string;
  sourceKey: string;
  sourceUrl: string;
  publishedAt: string | null;
  payload?: unknown;
};

function assertDateOnly(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("Open-news discovery requires YYYY-MM-DD target date");
  }
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
    throw new Error("Open-news discovery target date is invalid");
  }
  return date;
}

function gdeltTimestamp(date: Date) {
  return date.toISOString().replace(/[-:T]/g, "").replace(/\.\d{3}Z$/, "");
}

function targetWindow(date: string) {
  assertDateOnly(date);
  const start = new Date(`${date}T00:00:00+05:30`);
  const end = new Date(`${date}T23:59:59+05:30`);
  return {
    start: gdeltTimestamp(start),
    end: gdeltTimestamp(end),
  };
}

function indiaDateForInstant(value: string) {
  const instant = new Date(value);
  if (Number.isNaN(instant.getTime())) return null;
  return new Date(instant.getTime() + INDIA_OFFSET_MINUTES * 60_000).toISOString().slice(0, 10);
}

function clean(value: unknown, max = 500) {
  return String(value ?? "").replace(/\s+/g, " ").trim().slice(0, max);
}

function normalizeDomain(value: string) {
  try {
    return new URL(value).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "";
  }
}

function normalizeSeenDate(value: unknown): string | null {
  const raw = clean(value, 80);
  if (!raw) return null;
  const compact = raw.match(/^(\d{8})T?(\d{6})Z?$/i);
  if (compact) {
    const d = compact[1]!;
    const t = compact[2]!;
    const iso = `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}T${t.slice(0, 2)}:${t.slice(2, 4)}:${t.slice(4, 6)}Z`;
    const parsed = new Date(iso);
    return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
  }
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

export function parseGdeltArticleList(payload: unknown, targetDate: string): OpenNewsDiscoveryArticle[] {
  assertDateOnly(targetDate);
  const root = payload && typeof payload === "object" ? payload as Record<string, unknown> : {};
  const rawArticles = Array.isArray(root.articles) ? root.articles : [];
  const seen = new Set<string>();
  const results: OpenNewsDiscoveryArticle[] = [];

  for (const raw of rawArticles) {
    if (!raw || typeof raw !== "object") continue;
    const article = raw as Record<string, unknown>;
    const title = clean(article.title, 500);
    const url = clean(article.url, 2000);
    const seenAt = normalizeSeenDate(article.seendate ?? article.seenDate ?? article.date);
    if (title.length < 8 || !seenAt || indiaDateForInstant(seenAt) !== targetDate) continue;
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      continue;
    }
    if (parsed.protocol !== "https:") continue;
    parsed.hash = "";
    const canonicalUrl = parsed.toString();
    if (seen.has(canonicalUrl)) continue;
    seen.add(canonicalUrl);
    results.push({
      url: canonicalUrl,
      title,
      seenAt,
      domain: clean(article.domain, 255).toLowerCase().replace(/^www\./, "") || normalizeDomain(canonicalUrl),
      language: clean(article.language, 80) || null,
      sourceCountry: clean(article.sourcecountry ?? article.sourceCountry, 80) || null,
    });
  }
  return results;
}

export function gdeltQueryUrl(query: string, targetDate: string, maxRecords = MAX_RECORDS_PER_QUERY) {
  const window = targetWindow(targetDate);
  const url = new URL(GDELT_API);
  url.searchParams.set("query", query);
  url.searchParams.set("mode", "artlist");
  url.searchParams.set("format", "json");
  url.searchParams.set("sort", "datedesc");
  url.searchParams.set("maxrecords", String(Math.max(1, Math.min(250, Math.floor(maxRecords)))));
  url.searchParams.set("startdatetime", window.start);
  url.searchParams.set("enddatetime", window.end);
  return url.toString();
}

async function fetchQuery(query: string, targetDate: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(gdeltQueryUrl(query, targetDate), {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "User-Agent": "Examtree-Current-Affairs/1.0 (+https://examtree.in)",
      },
    });
    if (!response.ok) throw new Error(`GDELT DOC API returned HTTP ${response.status}`);
    const text = await response.text();
    if (text.length > 8_000_000) throw new Error("GDELT discovery response exceeded safe payload limit");
    return parseGdeltArticleList(JSON.parse(text), targetDate);
  } finally {
    clearTimeout(timer);
  }
}

function dedupeKey(sourceIdentity: string, url: string, title: string) {
  return createHash("sha256").update(`${sourceIdentity}|${url}|${title.toLowerCase()}`).digest("hex");
}

async function loadDiscoverySources() {
  const rows = await sqlClient`
    SELECT id::text AS id, source_key AS "sourceKey", base_url AS "baseUrl",
           source_family AS "sourceFamily", source_tier AS "sourceTier",
           trust_score::float8 AS "trustScore"
    FROM content.current_affairs_sources
    WHERE is_active=true
      AND (source_key=${PROVIDER_SOURCE_KEY} OR source_tier IN ('trusted_news','specialist'))
  `;
  const provider = rows.find((row) => String(row.sourceKey) === PROVIDER_SOURCE_KEY);
  if (!provider) throw new Error("GDELT open-news discovery source is not registered");
  const publisherDomains = rows
    .filter((row) => String(row.sourceKey) !== PROVIDER_SOURCE_KEY)
    .map((row) => ({ row, domain: normalizeDomain(String(row.baseUrl ?? "")) }))
    .filter((item) => item.domain);
  return { provider, publisherDomains };
}

function mappedPublisher<T extends { row: unknown; domain: string }>(domain: string, publishers: T[]) {
  return publishers.find((item) => domain === item.domain || domain.endsWith(`.${item.domain}`))?.row;
}

export function isOpenNewsClusterEligible(input: { discoveryScore: number; queryKeys: string[] }) {
  const targetedQueryHit = input.queryKeys.some((key) => !BROAD_QUERY_KEYS.has(key));
  return {
    eligible: input.discoveryScore >= MIN_CLUSTER_DISCOVERY_SCORE || targetedQueryHit,
    targetedQueryHit,
    reason: input.discoveryScore >= MIN_CLUSTER_DISCOVERY_SCORE
      ? "exam_signal_score"
      : targetedQueryHit
        ? "targeted_discovery_query"
        : "broad_only_low_signal",
  };
}

function rescueRows(rows: any[]): RescueCandidateRow[] {
  return rows.map((row) => ({
    id: String(row.id),
    title: clean(row.title, 500),
    sourceKey: String(row.sourceKey ?? ""),
    sourceUrl: String(row.sourceUrl ?? ""),
    publishedAt: row.publishedAt ? String(row.publishedAt) : null,
    payload: row.payload,
  })).filter((row) => row.title.length >= 8);
}

async function applyOneDayOfficialRescue(targetDate: string) {
  const previousDate = previousCalendarDate(targetDate);
  const triggers = rescueRows(await sqlClient`
    SELECT candidate.id::text AS id, candidate.raw_title AS title,
           candidate.source_url AS "sourceUrl", candidate.published_at::text AS "publishedAt",
           candidate.payload, source.source_key AS "sourceKey"
    FROM content.current_affairs_ingestion_candidates candidate
    JOIN content.current_affairs_sources source ON source.id=candidate.source_id
    WHERE COALESCE(
        NULLIF(candidate.payload->>'historicalTargetDate',''),
        NULLIF(candidate.payload->>'discoveryTargetDate',''),
        (candidate.published_at AT TIME ZONE 'Asia/Kolkata')::date::text
      )=${targetDate}
      AND source.is_primary_source=false
      AND (
        source.source_tier IN ('trusted_news','specialist')
        OR COALESCE(candidate.payload->>'discoveryProvider','')='gdelt_doc_2'
      )
    ORDER BY candidate.created_at DESC
    LIMIT 1500
  `);

  const targetDayOfficial = rescueRows(await sqlClient`
    SELECT candidate.id::text AS id, candidate.raw_title AS title,
           candidate.source_url AS "sourceUrl", candidate.published_at::text AS "publishedAt",
           candidate.payload, source.source_key AS "sourceKey"
    FROM content.current_affairs_ingestion_candidates candidate
    JOIN content.current_affairs_sources source ON source.id=candidate.source_id
    WHERE COALESCE(
        NULLIF(candidate.payload->>'historicalTargetDate',''),
        NULLIF(candidate.payload->>'discoveryTargetDate',''),
        (candidate.published_at AT TIME ZONE 'Asia/Kolkata')::date::text
      )=${targetDate}
      AND source.is_primary_source=true
      AND source.content_policy='primary_facts'
      AND candidate.status <> 'error'
    ORDER BY candidate.created_at DESC
    LIMIT 1500
  `);

  const previousDayOfficial = rescueRows(await sqlClient`
    SELECT candidate.id::text AS id, candidate.raw_title AS title,
           candidate.source_url AS "sourceUrl", candidate.published_at::text AS "publishedAt",
           candidate.payload, source.source_key AS "sourceKey"
    FROM content.current_affairs_ingestion_candidates candidate
    JOIN content.current_affairs_sources source ON source.id=candidate.source_id
    WHERE COALESCE(
        NULLIF(candidate.payload->>'historicalTargetDate',''),
        NULLIF(candidate.payload->>'discoveryTargetDate',''),
        (candidate.published_at AT TIME ZONE 'Asia/Kolkata')::date::text
      )=${previousDate}
      AND source.is_primary_source=true
      AND source.content_policy='primary_facts'
      AND candidate.status <> 'error'
    ORDER BY candidate.created_at DESC
    LIMIT 1500
  `);

  let alreadyCoveredByTargetDayOfficial = 0;
  let rescuedCandidates = 0;
  let metadataUpdated = 0;
  const matchedBySourceKey: Record<string, number> = {};

  for (const trigger of triggers) {
    const sameDayMatch = targetDayOfficial
      .map((official) => ({ official, similarity: isOneDayOfficialRescueMatch(trigger.title, official.title) }))
      .filter((item) => item.similarity.matched)
      .sort((a, b) => b.similarity.score - a.similarity.score)[0];
    if (sameDayMatch) {
      alreadyCoveredByTargetDayOfficial += 1;
      continue;
    }

    const bestPreviousDay = previousDayOfficial
      .map((official) => ({ official, similarity: isOneDayOfficialRescueMatch(trigger.title, official.title) }))
      .filter((item) => item.similarity.matched)
      .sort((a, b) => b.similarity.score - a.similarity.score)[0];
    if (!bestPreviousDay) continue;

    rescuedCandidates += 1;
    matchedBySourceKey[bestPreviousDay.official.sourceKey] = (matchedBySourceKey[bestPreviousDay.official.sourceKey] ?? 0) + 1;
    const existingPayload = trigger.payload && typeof trigger.payload === "object"
      ? trigger.payload as Record<string, unknown>
      : {};
    const existingRescue = existingPayload.oneDayOfficialRescue && typeof existingPayload.oneDayOfficialRescue === "object"
      ? existingPayload.oneDayOfficialRescue as Record<string, unknown>
      : {};
    const unchanged = String(existingRescue.officialCandidateId ?? "") === bestPreviousDay.official.id
      && String(existingRescue.targetDate ?? "") === targetDate
      && String(existingRescue.officialSourceDate ?? "") === previousDate;
    if (unchanged) continue;

    await sqlClient`
      UPDATE content.current_affairs_ingestion_candidates
      SET payload=COALESCE(payload, '{}'::jsonb) || ${JSON.stringify({
        oneDayOfficialRescue: {
          policyVersion: ONE_DAY_RESCUE_POLICY_VERSION,
          targetDate,
          lookbackDays: 1,
          officialSourceDate: previousDate,
          officialCandidateId: bestPreviousDay.official.id,
          officialSourceKey: bestPreviousDay.official.sourceKey,
          officialSourceUrl: bestPreviousDay.official.sourceUrl,
          officialPublishedAt: bestPreviousDay.official.publishedAt,
          officialTitle: bestPreviousDay.official.title,
          similarityScore: bestPreviousDay.similarity.score,
          sharedTerms: bestPreviousDay.similarity.sharedTerms,
          evidenceRole: "verification_candidate_only",
          automaticSelectionAuthority: false,
          automaticVerificationAuthority: false,
          automaticPublicationAuthority: false,
        },
      })}::jsonb,
          updated_at=now()
      WHERE id=${trigger.id}::uuid
    `;
    metadataUpdated += 1;
  }

  return {
    policyVersion: ONE_DAY_RESCUE_POLICY_VERSION,
    targetDate,
    previousDate,
    lookbackDays: 1,
    triggerCandidates: triggers.length,
    targetDayOfficialCandidates: targetDayOfficial.length,
    previousDayOfficialCandidates: previousDayOfficial.length,
    alreadyCoveredByTargetDayOfficial,
    rescuedCandidates,
    metadataUpdated,
    matchedBySourceKey,
    broadHistoricalNewsScan: false,
    automaticSelectionAuthority: false,
    automaticVerificationAuthority: false,
    automaticPublicationAuthority: false,
  };
}

async function rejectExistingBroadOnlyLowSignalClusters(targetDate: string) {
  const rows = await sqlClient`
    WITH low_signal_clusters AS (
      SELECT cluster.id
      FROM content.current_affairs_clusters cluster
      JOIN content.current_affairs_cluster_members member ON member.cluster_id=cluster.id
      JOIN content.current_affairs_ingestion_candidates candidate ON candidate.id=member.candidate_id
      WHERE cluster.status='open'
      GROUP BY cluster.id
      HAVING bool_and(COALESCE(candidate.payload->>'discoveryProvider','')='gdelt_doc_2')
         AND bool_and(COALESCE(candidate.payload->>'discoveryTargetDate','')=${targetDate})
         AND bool_and(COALESCE((candidate.payload->>'discoveryEligible')::boolean, false)=false)
    )
    UPDATE content.current_affairs_clusters cluster
    SET status='rejected',
        metadata=cluster.metadata || ${JSON.stringify({
          rejectedBy: "cp043_open_news_triage",
          rejectionReason: "gdelt_broad_only_low_signal",
          reversibleEditorialExclusion: true,
        })}::jsonb,
        updated_at=now()
    WHERE cluster.id IN (SELECT id FROM low_signal_clusters)
    RETURNING cluster.id::text AS id
  `;
  return rows.length;
}

export async function runOpenNewsDiscovery(targetDate: string) {
  assertDateOnly(targetDate);
  const { provider, publisherDomains } = await loadDiscoverySources();
  const queryResults: Array<{ key: string; status: "success" | "failed"; count: number; error: string | null }> = [];
  const byUrl = new Map<string, OpenNewsDiscoveryArticle & { queryKeys: string[] }>();

  for (const descriptor of OPEN_NEWS_DISCOVERY_QUERIES) {
    try {
      const articles = await fetchQuery(descriptor.query, targetDate);
      for (const article of articles) {
        const existing = byUrl.get(article.url);
        if (existing) {
          if (!existing.queryKeys.includes(descriptor.key)) existing.queryKeys.push(descriptor.key);
        } else {
          byUrl.set(article.url, { ...article, queryKeys: [descriptor.key] });
        }
      }
      queryResults.push({ key: descriptor.key, status: "success", count: articles.length, error: null });
    } catch (error) {
      queryResults.push({
        key: descriptor.key,
        status: "failed",
        count: 0,
        error: error instanceof Error ? error.message.slice(0, 500) : "Unknown GDELT discovery failure",
      });
    }
  }

  let created = 0;
  let updated = 0;
  let eligibleArticles = 0;
  let withheldBroadLowSignal = 0;
  let knownPublisherMapped = 0;
  let providerFallback = 0;
  const categoryCounts: Record<string, number> = {};

  for (const article of byUrl.values()) {
    const mapped = mappedPublisher(article.domain, publisherDomains) as typeof provider | undefined;
    const source = mapped ?? provider;
    if (mapped) knownPublisherMapped += 1;
    else providerFallback += 1;
    const classified = classifyCurrentAffairsSignal(article.title);
    const triage = isOpenNewsClusterEligible({ discoveryScore: classified.score, queryKeys: article.queryKeys });
    if (triage.eligible) eligibleArticles += 1;
    else withheldBroadLowSignal += 1;
    categoryCounts[classified.category] = (categoryCounts[classified.category] ?? 0) + 1;
    const payload = {
      discoveryProvider: "gdelt_doc_2",
      discoveryProviderSourceKey: PROVIDER_SOURCE_KEY,
      discoveryTargetDate: targetDate,
      discoverySeenAt: article.seenAt,
      publisherDomain: article.domain,
      queryKeys: article.queryKeys,
      language: article.language,
      sourceCountry: article.sourceCountry,
      categoryGuess: classified.category,
      discoveryScore: classified.score,
      discoveryKeywords: classified.keywords,
      discoveryEligible: triage.eligible,
      discoveryTriageReason: triage.reason,
      targetedQueryHit: triage.targetedQueryHit,
      dateSemantics: "gdelt_discovery_seen_at_not_publication_date",
      dateConfidence: "discovery_only",
      rawArticlePersistence: false,
      fetchedPublisherBody: false,
      evidenceRole: "discovery_only",
    };
    const rows = await sqlClient`
      INSERT INTO content.current_affairs_ingestion_candidates (
        id, source_id, source_url, external_id, raw_title, raw_summary,
        published_at, dedupe_key, status, payload, created_at, updated_at
      ) VALUES (
        ${randomUUID()}::uuid,
        ${String(source.id)}::uuid,
        ${article.url},
        ${`gdelt:${article.domain}:${article.seenAt}`.slice(0, 500)},
        ${article.title}, '', ${article.seenAt}::timestamptz,
        ${dedupeKey(String(source.sourceKey), article.url, article.title)},
        ${triage.eligible ? "queued" : "rejected"}, ${JSON.stringify(payload)}::jsonb, now(), now()
      )
      ON CONFLICT (source_url) DO UPDATE SET
        raw_title=EXCLUDED.raw_title,
        payload=content.current_affairs_ingestion_candidates.payload || EXCLUDED.payload,
        status=CASE
          WHEN content.current_affairs_ingestion_candidates.status='queued'
            AND EXCLUDED.status='rejected' THEN 'rejected'
          ELSE content.current_affairs_ingestion_candidates.status
        END,
        updated_at=now()
      RETURNING (xmax = 0) AS inserted
    `;
    if (rows[0]?.inserted) created += 1;
    else updated += 1;
  }

  const oneDayOfficialRescue = await applyOneDayOfficialRescue(targetDate);
  const rejectedLowSignalClusters = await rejectExistingBroadOnlyLowSignalClusters(targetDate);

  await sqlClient`
    UPDATE content.current_affairs_sources
    SET last_ingested_at=now(),
        last_ingestion_status=${queryResults.some((item) => item.status === "success") ? "success" : "failure"},
        last_ingestion_error=${queryResults.every((item) => item.status === "failed")
          ? queryResults.map((item) => item.error).filter(Boolean).join(" | ").slice(0, 2000)
          : null},
        metadata=metadata || ${JSON.stringify({
          lastDiscoveryDate: targetDate,
          lastQueryResults: queryResults,
          lastUniqueArticleCount: byUrl.size,
          lastEligibleArticleCount: eligibleArticles,
          lastWithheldBroadLowSignalCount: withheldBroadLowSignal,
          lastRejectedLowSignalClusterCount: rejectedLowSignalClusters,
          lastOneDayOfficialRescue: oneDayOfficialRescue,
        })}::jsonb,
        updated_at=now()
    WHERE source_key=${PROVIDER_SOURCE_KEY}
  `;

  return {
    targetDate,
    provider: "gdelt_doc_2",
    queryResults,
    uniqueArticles: byUrl.size,
    eligibleArticles,
    withheldBroadLowSignal,
    rejectedLowSignalClusters,
    created,
    updated,
    knownPublisherMapped,
    providerFallback,
    categoryCounts,
    oneDayOfficialRescue,
    publicationAuthority: false,
    verificationAuthority: false,
    publisherArticleBodiesFetched: false,
    rawArticlePersistence: false,
  };
}
