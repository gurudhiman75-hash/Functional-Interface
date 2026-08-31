import { randomUUID } from "node:crypto";

import { sqlClient } from "../lib/db";
import { sourceCandidateDedupeKey } from "./core";
import { discoveryKeywords } from "./ingestion";
import { findListingDate } from "./official-listing";
import { fetchBoundedOfficialText } from "./source-fetch";

const PIB_ARCHIVE_URL = "https://pib.gov.in/AllRelease.aspx?lang=1&reg=3";
const MAX_ARCHIVE_BYTES = 10_000_000;
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

export function parsePibHistoricalListing(html: string, targetDate: string, maxEntries = 180): PibHistoricalEntry[] {
  const displayedDate = pibDisplayedDate(html);
  if (displayedDate !== targetDate) return [];

  const entries: PibHistoricalEntry[] = [];
  const seen = new Set<string>();
  for (const match of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    if (entries.length >= maxEntries) break;
    const attributes = match[1] ?? "";
    const rawHref = attributeValue(attributes, "href");
    if (!rawHref) continue;
    let link: URL;
    try {
      link = new URL(rawHref, PIB_ARCHIVE_URL);
    } catch {
      continue;
    }
    if (link.protocol !== "https:") continue;
    const host = link.hostname.toLowerCase().replace(/^www\./, "");
    if (host !== "pib.gov.in") continue;
    if (!/\/(?:PressReleasePage|PressReleseDetailm|PressReleaseDetail|PressReleseDetail)\.aspx$/i.test(link.pathname)) continue;
    const prid = link.searchParams.get("PRID");
    if (!prid || !/^\d{5,12}$/.test(prid)) continue;
    link.hash = "";
    const title = cleanText(match[2] ?? "");
    if (title.length < 10 || title.length > 500) continue;
    const canonical = link.toString();
    if (seen.has(canonical)) continue;
    seen.add(canonical);
    entries.push({
      title,
      link: canonical,
      publishedAt: `${targetDate}T00:00:00.000Z`,
      externalId: prid,
    });
  }
  return entries;
}

async function postPibArchiveDate(initialHtml: string, targetDate: string): Promise<string> {
  const body = buildPibArchivePostBody(initialHtml, targetDate);
  const response = await fetch(PIB_ARCHIVE_URL, {
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

async function upsertPibHistoricalCandidate(source: Record<string, unknown>, entry: PibHistoricalEntry) {
  const sourceKey = String(source.sourceKey);
  const dedupeKey = sourceCandidateDedupeKey(sourceKey, entry.link, entry.title);
  const payload = {
    ingestionChannel: "on_demand_pib_historical_archive",
    historicalTargetDate: entry.publishedAt.slice(0, 10),
    dateConfidence: "explicit_archive_filter",
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
        published_at=COALESCE(EXCLUDED.published_at, content.current_affairs_ingestion_candidates.published_at),
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
  if (existing > 0) {
    return {
      status: "skipped_existing" as const,
      targetDate,
      existing,
      archiveEntries: 0,
      created: 0,
      updated: 0,
      displayedDate: targetDate,
      error: null,
    };
  }

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

    const initialHtml = await fetchBoundedOfficialText(PIB_ARCHIVE_URL, {
      accept: "text/html,application/xhtml+xml;q=0.9,text/plain;q=0.5",
      maxBytes: MAX_ARCHIVE_BYTES,
      label: "PIB historical archive",
    });
    const initialDate = pibDisplayedDate(initialHtml);
    const archiveHtml = initialDate === targetDate
      ? initialHtml
      : await postPibArchiveDate(initialHtml, targetDate);
    const displayedDate = pibDisplayedDate(archiveHtml);
    if (displayedDate !== targetDate) {
      throw new Error(`PIB archive did not confirm requested date ${targetDate}; displayed ${displayedDate ?? "unknown"}`);
    }
    const entries = parsePibHistoricalListing(archiveHtml, targetDate);
    if (entries.length === 0) {
      throw new Error(`PIB archive confirmed ${targetDate} but returned no release links`);
    }

    let created = 0;
    let updated = 0;
    for (const entry of entries) {
      const inserted = await upsertPibHistoricalCandidate(source, entry);
      if (inserted) created += 1;
      else updated += 1;
    }
    return {
      status: "completed" as const,
      targetDate,
      existing: 0,
      archiveEntries: entries.length,
      created,
      updated,
      displayedDate,
      error: null,
    };
  } catch (error) {
    return {
      status: "failed" as const,
      targetDate,
      existing: 0,
      archiveEntries: 0,
      created: 0,
      updated: 0,
      displayedDate: null,
      error: error instanceof Error ? error.message.slice(0, 1000) : "Unknown PIB historical backfill failure",
    };
  }
}
