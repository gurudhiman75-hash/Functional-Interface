import { randomUUID } from "node:crypto";

import { sqlClient } from "../lib/db";
import { sourceCandidateDedupeKey } from "./core";
import { discoveryKeywords } from "./ingestion";
import { findListingDate } from "./official-listing";
import { fetchBoundedOfficialText } from "./source-fetch";

const PIB_MONTH_ARCHIVE_URL = "https://www.pib.gov.in/AllRelease.aspx?MenuId=30&lang=1&reg=3";
const PIB_MODERN_ARCHIVE_URL = "https://www.pib.gov.in/AllReleasem.aspx?lang=1&reg=3";
const MAX_ARCHIVE_BYTES = 10_000_000;
const MAX_ARCHIVE_ENTRIES = 180;
const POST_TIMEOUT_MS = 15_000;

export type PibHistoricalEntry = {
  title: string;
  link: string;
  publishedAt: string;
  externalId: string | null;
};

function decodeEntities(value: string): string {
  const named: Record<string, string> = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    nbsp: " ",
  };
  return value
    .replace(/&#(\d+);/g, (_match, digits) => String.fromCodePoint(Number(digits)))
    .replace(/&#x([0-9a-f]+);/gi, (_match, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&([a-z]+);/gi, (match, key) => named[String(key).toLowerCase()] ?? match);
}

function cleanText(value: string): string {
  return decodeEntities(value)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function attributeValue(attributes: string, name: string): string {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const quoted = attributes.match(new RegExp(`\\b${escaped}\\s*=\\s*["']([^"']*)["']`, "i"));
  if (quoted) return decodeEntities(quoted[1] ?? "");
  const plain = attributes.match(new RegExp(`\\b${escaped}\\s*=\\s*([^\\s>]+)`, "i"));
  return plain?.[1] ? decodeEntities(plain[1]) : "";
}

function parsePibReleaseLink(rawHref: string, baseUrl: string): { link: string; prid: string } | null {
  let link: URL;
  try {
    link = new URL(rawHref, baseUrl);
  } catch {
    return null;
  }
  if (link.protocol !== "https:") return null;
  const host = link.hostname.toLowerCase().replace(/^www\./, "");
  if (host !== "pib.gov.in") return null;
  if (!/\/(?:PressReleasePage|PressReleseDetailm|PressReleaseDetail|PressReleseDetail)\.aspx$/i.test(link.pathname)) {
    return null;
  }
  const prid = link.searchParams.get("PRID");
  if (!prid || !/^\d{5,12}$/.test(prid)) return null;
  link.hash = "";
  return { link: link.toString(), prid };
}

export function extractAspNetHiddenFields(html: string): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const match of html.matchAll(/<input\b([^>]*)>/gi)) {
    const attributes = match[1] ?? "";
    const type = attributeValue(attributes, "type").toLowerCase();
    const name = attributeValue(attributes, "name");
    if (type !== "hidden" || !name) continue;
    fields[name] = attributeValue(attributes, "value");
  }
  return fields;
}

export function buildPibArchivePostBody(html: string, targetDate: string): string {
  const match = targetDate.match(/^(20\d{2})-(\d{2})-(\d{2})$/);
  if (!match) throw new Error("PIB historical target date must use YYYY-MM-DD");
  const hidden = extractAspNetHiddenFields(html);
  if (!hidden.__VIEWSTATE) {
    throw new Error("PIB archive page did not expose ASP.NET view state for historical selection");
  }
  const params = new URLSearchParams(hidden);
  params.set("__EVENTTARGET", "ctl00$ContentPlaceHolder1$ddlday");
  params.set("__EVENTARGUMENT", "");
  params.set("ctl00$ContentPlaceHolder1$ddlMinistry", "0");
  params.set("ctl00$ContentPlaceHolder1$ddlday", String(Number(match[3])));
  params.set("ctl00$ContentPlaceHolder1$ddlMonth", String(Number(match[2])));
  params.set("ctl00$ContentPlaceHolder1$ddlYear", match[1]);
  return params.toString();
}

export function pibDisplayedDate(html: string): string | null {
  const displayMatch = html.match(/Displaying[\s\S]{0,1200}?\bfor\b[\s\S]{0,160}?([0-3]?\d[\s./-]+(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)[,\s./-]+20\d{2})/i);
  const value = displayMatch?.[1] ? findListingDate(displayMatch[1]) : undefined;
  return value ? value.slice(0, 10) : null;
}

export function parsePibHistoricalListing(
  html: string,
  targetDate: string,
  maxEntries = MAX_ARCHIVE_ENTRIES,
  baseUrl = PIB_MONTH_ARCHIVE_URL,
): PibHistoricalEntry[] {
  const displayedDate = pibDisplayedDate(html);
  if (displayedDate !== targetDate) return [];

  const entries: PibHistoricalEntry[] = [];
  const seen = new Set<string>();
  for (const match of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    if (entries.length >= maxEntries) break;
    const rawHref = attributeValue(match[1] ?? "", "href");
    if (!rawHref) continue;
    const parsed = parsePibReleaseLink(rawHref, baseUrl);
    if (!parsed || seen.has(parsed.link)) continue;
    const title = cleanText(match[2] ?? "");
    if (title.length < 10 || title.length > 500) continue;
    seen.add(parsed.link);
    entries.push({
      title,
      link: parsed.link,
      publishedAt: `${targetDate}T00:00:00.000Z`,
      externalId: parsed.prid,
    });
  }
  return entries;
}

// PIB's monthly All Releases surface includes an explicit `Posted on` date beside
// each release. This is more robust than depending on ASP.NET postback state and
// lets Generate Yesterday recover the previous day even when the RSS/latest feed
// has already moved on. A candidate is accepted only when the listing itself
// states the exact requested date.
export function parsePibPostedDateListing(
  html: string,
  targetDate: string,
  maxEntries = MAX_ARCHIVE_ENTRIES,
  baseUrl = PIB_MONTH_ARCHIVE_URL,
): PibHistoricalEntry[] {
  const entries: PibHistoricalEntry[] = [];
  const seen = new Set<string>();
  const anchors = [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)];

  for (let index = 0; index < anchors.length && entries.length < maxEntries; index += 1) {
    const match = anchors[index]!;
    const rawHref = attributeValue(match[1] ?? "", "href");
    if (!rawHref) continue;
    const parsed = parsePibReleaseLink(rawHref, baseUrl);
    if (!parsed || seen.has(parsed.link)) continue;

    const title = cleanText(match[2] ?? "");
    if (title.length < 10 || title.length > 500) continue;

    const anchorEnd = (match.index ?? 0) + match[0].length;
    const nextAnchorStart = anchors[index + 1]?.index ?? html.length;
    const nearbyEnd = Math.min(nextAnchorStart, anchorEnd + 1800);
    const nearbyText = cleanText(html.slice(anchorEnd, nearbyEnd));
    const posted = nearbyText.match(/Posted\s+on\s*:\s*([^|•<>]{6,40})/i);
    const listingDate = posted?.[1] ? findListingDate(posted[1]) : undefined;
    if (!listingDate || listingDate.slice(0, 10) !== targetDate) continue;

    seen.add(parsed.link);
    entries.push({
      title,
      link: parsed.link,
      publishedAt: `${targetDate}T00:00:00.000Z`,
      externalId: parsed.prid,
    });
  }

  return entries;
}

async function postPibArchiveDate(initialHtml: string, targetDate: string, archiveUrl: string): Promise<string> {
  const body = buildPibArchivePostBody(initialHtml, targetDate);
  const response = await fetch(archiveUrl, {
    method: "POST",
    headers: {
      accept: "text/html,application/xhtml+xml;q=0.9,text/plain;q=0.5",
      "accept-language": "en-IN,en;q=0.9",
      "cache-control": "no-cache",
      "content-type": "application/x-www-form-urlencoded",
      "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
    },
    body,
    redirect: "manual",
    signal: AbortSignal.timeout(POST_TIMEOUT_MS),
  });
  if (response.status >= 300 && response.status < 400) {
    throw new Error(`PIB historical archive unexpectedly redirected with HTTP ${response.status}`);
  }
  if (!response.ok) throw new Error(`PIB historical archive returned HTTP ${response.status}`);
  const declaredLength = Number(response.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_ARCHIVE_BYTES) throw new Error("PIB historical archive is larger than the ingestion limit");
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.byteLength > MAX_ARCHIVE_BYTES) throw new Error("PIB historical archive is larger than the ingestion limit");
  return buffer.toString("utf8");
}

async function loadArchiveEntries(targetDate: string) {
  const attempts: string[] = [];

  // Strategy 1: parse the explicit Posted on dates from the monthly archive.
  try {
    const monthHtml = await fetchBoundedOfficialText(PIB_MONTH_ARCHIVE_URL, {
      accept: "text/html,application/xhtml+xml;q=0.9,text/plain;q=0.5",
      maxBytes: MAX_ARCHIVE_BYTES,
      label: "PIB monthly archive",
    });
    const exactEntries = parsePibPostedDateListing(monthHtml, targetDate);
    if (exactEntries.length > 0) {
      return {
        entries: exactEntries,
        displayedDate: targetDate,
        strategy: "monthly_listing_posted_date" as const,
        archiveUrl: PIB_MONTH_ARCHIVE_URL,
        attempts,
      };
    }

    const monthDisplayedDate = pibDisplayedDate(monthHtml);
    if (monthDisplayedDate === targetDate) {
      const displayedEntries = parsePibHistoricalListing(monthHtml, targetDate, MAX_ARCHIVE_ENTRIES, PIB_MONTH_ARCHIVE_URL);
      if (displayedEntries.length > 0) {
        return {
          entries: displayedEntries,
          displayedDate: targetDate,
          strategy: "monthly_listing_displayed_date" as const,
          archiveUrl: PIB_MONTH_ARCHIVE_URL,
          attempts,
        };
      }
    }

    // Month boundaries may require the server-side date selector. Keep this as a
    // fallback, but do not make normal yesterday recovery depend on it.
    try {
      const postedHtml = await postPibArchiveDate(monthHtml, targetDate, PIB_MONTH_ARCHIVE_URL);
      const displayedDate = pibDisplayedDate(postedHtml);
      const postedEntries = parsePibHistoricalListing(postedHtml, targetDate, MAX_ARCHIVE_ENTRIES, PIB_MONTH_ARCHIVE_URL);
      if (displayedDate === targetDate && postedEntries.length > 0) {
        return {
          entries: postedEntries,
          displayedDate,
          strategy: "monthly_archive_postback" as const,
          archiveUrl: PIB_MONTH_ARCHIVE_URL,
          attempts,
        };
      }
      attempts.push(`monthly postback returned ${displayedDate ?? "unknown date"} with ${postedEntries.length} release(s)`);
    } catch (error) {
      attempts.push(`monthly postback: ${error instanceof Error ? error.message : "unknown failure"}`);
    }
  } catch (error) {
    attempts.push(`monthly listing: ${error instanceof Error ? error.message : "unknown failure"}`);
  }

  // Strategy 2: PIB also exposes a current AllReleasem surface. Some deployments
  // render the selected date here even when the legacy AllRelease postback fails.
  try {
    const modernHtml = await fetchBoundedOfficialText(PIB_MODERN_ARCHIVE_URL, {
      accept: "text/html,application/xhtml+xml;q=0.9,text/plain;q=0.5",
      maxBytes: MAX_ARCHIVE_BYTES,
      label: "PIB modern archive",
    });
    const exactEntries = parsePibPostedDateListing(modernHtml, targetDate, MAX_ARCHIVE_ENTRIES, PIB_MODERN_ARCHIVE_URL);
    if (exactEntries.length > 0) {
      return {
        entries: exactEntries,
        displayedDate: targetDate,
        strategy: "modern_listing_posted_date" as const,
        archiveUrl: PIB_MODERN_ARCHIVE_URL,
        attempts,
      };
    }
    const displayedDate = pibDisplayedDate(modernHtml);
    const displayedEntries = parsePibHistoricalListing(modernHtml, targetDate, MAX_ARCHIVE_ENTRIES, PIB_MODERN_ARCHIVE_URL);
    if (displayedDate === targetDate && displayedEntries.length > 0) {
      return {
        entries: displayedEntries,
        displayedDate,
        strategy: "modern_listing_displayed_date" as const,
        archiveUrl: PIB_MODERN_ARCHIVE_URL,
        attempts,
      };
    }
    attempts.push(`modern listing returned ${displayedDate ?? "no exact displayed date"} with ${displayedEntries.length} release(s)`);
  } catch (error) {
    attempts.push(`modern listing: ${error instanceof Error ? error.message : "unknown failure"}`);
  }

  throw new Error(`PIB archive could not produce exact-date releases for ${targetDate}. ${attempts.join(" | ")}`);
}

async function upsertPibHistoricalCandidate(source: Record<string, unknown>, entry: PibHistoricalEntry, strategy: string) {
  const sourceKey = String(source.sourceKey);
  const dedupeKey = sourceCandidateDedupeKey(sourceKey, entry.link, entry.title);
  const payload = {
    ingestionChannel: "on_demand_pib_historical_archive",
    historicalTargetDate: entry.publishedAt.slice(0, 10),
    historicalDiscoveryStrategy: strategy,
    dateConfidence: "explicit_official_listing_date",
    discoveryKeywords: discoveryKeywords(entry.title),
    sourceFamily: source.sourceFamily ?? "pib",
    sourceTier: source.sourceTier ?? "core_official",
    coverageDomain: source.coverageDomain ?? "national",
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
      ${entry.externalId},
      ${entry.title},
      '',
      ${entry.publishedAt},
      ${dedupeKey},
      'queued',
      ${JSON.stringify(payload)}::jsonb,
      now(),
      now()
    )
    ON CONFLICT (source_url) DO UPDATE
    SET raw_title=EXCLUDED.raw_title,
        published_at=EXCLUDED.published_at,
        dedupe_key=EXCLUDED.dedupe_key,
        payload=content.current_affairs_ingestion_candidates.payload || EXCLUDED.payload,
        updated_at=now()
    RETURNING (xmax = 0) AS inserted
  `;
  return Boolean(rows[0]?.inserted);
}

export async function ensurePibHistoricalCandidates(targetDate: string) {
  const existingRows = await sqlClient`
    SELECT count(*)::int AS count
    FROM content.current_affairs_ingestion_candidates candidate
    JOIN content.current_affairs_sources source ON source.id=candidate.source_id
    WHERE source.source_key='pib' AND candidate.published_at::date=${targetDate}::date
  `;
  const existing = Number(existingRows[0]?.count ?? 0);

  try {
    const sourceRows = await sqlClient`
      SELECT id::text AS id, source_key AS "sourceKey", source_family AS "sourceFamily",
             source_tier AS "sourceTier", coverage_domain AS "coverageDomain",
             content_policy AS "contentPolicy"
      FROM content.current_affairs_sources
      WHERE source_key='pib' AND is_active=true AND is_primary_source=true
      LIMIT 1
    `;
    const source = sourceRows[0] as Record<string, unknown> | undefined;
    if (!source) throw new Error("PIB primary source is not configured");

    // Do not skip merely because one RSS candidate already exists. The archive is
    // the completeness pass and may contain many target-date releases that have
    // already fallen off the feed.
    const archive = await loadArchiveEntries(targetDate);

    let created = 0;
    let updated = 0;
    for (const entry of archive.entries) {
      const inserted = await upsertPibHistoricalCandidate(source, entry, archive.strategy);
      if (inserted) created += 1;
      else updated += 1;
    }
    return {
      status: "completed" as const,
      targetDate,
      existing,
      archiveEntries: archive.entries.length,
      created,
      updated,
      displayedDate: archive.displayedDate,
      strategy: archive.strategy,
      archiveUrl: archive.archiveUrl,
      attempts: archive.attempts,
      error: null,
    };
  } catch (error) {
    return {
      status: "failed" as const,
      targetDate,
      existing,
      archiveEntries: 0,
      created: 0,
      updated: 0,
      displayedDate: null,
      strategy: null,
      archiveUrl: null,
      attempts: [] as string[],
      error: error instanceof Error ? error.message.slice(0, 1800) : "Unknown PIB historical backfill failure",
    };
  }
}
