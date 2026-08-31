import { createHash, randomUUID } from "node:crypto";

import { sqlClient } from "../lib/db";
import { classifyCurrentAffairsSignal } from "./ingestion";

const GDELT_API = "https://api.gdeltproject.org/api/v2/doc/doc";
const PROVIDER_SOURCE_KEY = "gdelt_open_news";
const REQUEST_TIMEOUT_MS = 18_000;
const MAX_RECORDS_PER_QUERY = 250;

export const OPEN_NEWS_DISCOVERY_QUERIES = [
  { key: "india_press_broad", query: "sourcecountry:india sourcelang:english" },
  { key: "india_global", query: "(India OR Indian OR \"New Delhi\") sourcelang:english" },
  { key: "economy_banking", query: "sourcecountry:india (RBI OR SEBI OR economy OR banking OR inflation OR GDP OR finance OR monetary)" },
  { key: "punjab", query: "sourcecountry:india (Punjab OR Chandigarh OR Ludhiana OR Amritsar OR Jalandhar OR Patiala)" },
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

function targetWindow(date: string) {
  const compact = date.replaceAll("-", "");
  if (!/^\d{8}$/.test(compact)) throw new Error("Open-news discovery requires YYYY-MM-DD target date");
  return {
    start: `${compact}000000`,
    end: `${compact}235959`,
  };
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
    if (title.length < 8 || !seenAt || seenAt.slice(0, 10) !== targetDate) continue;
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
      AND (source_key=${PROVIDER_SOURCE_KEY} OR source_tier='trusted_news')
  `;
  const provider = rows.find((row) => String(row.sourceKey) === PROVIDER_SOURCE_KEY);
  if (!provider) throw new Error("GDELT open-news discovery source is not registered");
  const domainMap = new Map<string, (typeof rows)[number]>();
  for (const row of rows) {
    if (String(row.sourceKey) === PROVIDER_SOURCE_KEY) continue;
    const domain = normalizeDomain(String(row.baseUrl ?? ""));
    if (domain) domainMap.set(domain, row);
  }
  return { provider, domainMap };
}

export async function runOpenNewsDiscovery(targetDate: string) {
  const { provider, domainMap } = await loadDiscoverySources();
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
  let knownPublisherMapped = 0;
  let providerFallback = 0;
  const categoryCounts: Record<string, number> = {};

  for (const article of byUrl.values()) {
    const mapped = domainMap.get(article.domain);
    const source = mapped ?? provider;
    if (mapped) knownPublisherMapped += 1;
    else providerFallback += 1;
    const classified = classifyCurrentAffairsSignal(article.title);
    categoryCounts[classified.category] = (categoryCounts[classified.category] ?? 0) + 1;
    const payload = {
      discoveryProvider: "gdelt_doc_2",
      discoveryProviderSourceKey: PROVIDER_SOURCE_KEY,
      publisherDomain: article.domain,
      queryKeys: article.queryKeys,
      language: article.language,
      sourceCountry: article.sourceCountry,
      categoryGuess: classified.category,
      discoveryScore: classified.score,
      discoveryKeywords: classified.keywords,
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
        'queued', ${JSON.stringify(payload)}::jsonb, now(), now()
      )
      ON CONFLICT (source_url) DO UPDATE SET
        raw_title=EXCLUDED.raw_title,
        published_at=COALESCE(content.current_affairs_ingestion_candidates.published_at, EXCLUDED.published_at),
        payload=content.current_affairs_ingestion_candidates.payload || EXCLUDED.payload,
        updated_at=now()
      RETURNING (xmax = 0) AS inserted
    `;
    if (rows[0]?.inserted) created += 1;
    else updated += 1;
  }

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
        })}::jsonb,
        updated_at=now()
    WHERE source_key=${PROVIDER_SOURCE_KEY}
  `;

  return {
    targetDate,
    provider: "gdelt_doc_2",
    queryResults,
    uniqueArticles: byUrl.size,
    created,
    updated,
    knownPublisherMapped,
    providerFallback,
    categoryCounts,
    publicationAuthority: false,
    verificationAuthority: false,
    publisherArticleBodiesFetched: false,
    rawArticlePersistence: false,
  };
}
