import { classifyCurrentAffairsSignal } from "./ingestion";

export type OfficialListingAdapter =
  | "sebi_press_releases"
  | "isro_latest_news"
  | "punjab_press_releases";

export type OfficialListingEntry = {
  title: string;
  link: string;
  publishedAt?: string;
  dateConfidence: "explicit" | "contextual" | "unknown";
  discoveryKeywords: string[];
};

const MONTHS: Record<string, number> = {
  jan: 1, january: 1,
  feb: 2, february: 2,
  mar: 3, march: 3,
  apr: 4, april: 4,
  may: 5,
  jun: 6, june: 6,
  jul: 7, july: 7,
  aug: 8, august: 8,
  sep: 9, sept: 9, september: 9,
  oct: 10, october: 10,
  nov: 11, november: 11,
  dec: 12, december: 12,
};

function decodeEntities(value: string): string {
  const named: Record<string, string> = {
    amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", ndash: "–", mdash: "—",
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

function isoDate(year: number, month: number, day: number): string | undefined {
  if (year < 2000 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) return undefined;
  const value = `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value
    ? undefined
    : `${value}T00:00:00.000Z`;
}

export function findListingDate(value: string): string | undefined {
  const text = cleanText(value);
  const iso = text.match(/\b(20\d{2})[-/]([01]?\d)[-/]([0-3]?\d)\b/);
  if (iso) return isoDate(Number(iso[1]), Number(iso[2]), Number(iso[3]));

  const dayMonth = text.match(/\b([0-3]?\d)[\s./-]+(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)[,\s./-]+(20\d{2})\b/i);
  if (dayMonth) {
    return isoDate(Number(dayMonth[3]), MONTHS[String(dayMonth[2]).toLowerCase()] ?? 0, Number(dayMonth[1]));
  }

  const monthDay = text.match(/\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+([0-3]?\d),?\s+(20\d{2})\b/i);
  if (monthDay) {
    return isoDate(Number(monthDay[3]), MONTHS[String(monthDay[1]).toLowerCase()] ?? 0, Number(monthDay[2]));
  }

  const dmy = text.match(/\b([0-3]?\d)[-/.]([01]?\d)[-/.](20\d{2})\b/);
  if (dmy) return isoDate(Number(dmy[3]), Number(dmy[2]), Number(dmy[1]));
  return undefined;
}

function hrefFromAttributes(attributes: string): string {
  const quoted = attributes.match(/\bhref\s*=\s*["']([^"']+)["']/i);
  if (quoted?.[1]) return decodeEntities(quoted[1]);
  const plain = attributes.match(/\bhref\s*=\s*([^\s>]+)/i);
  return plain?.[1] ? decodeEntities(plain[1]) : "";
}

function safeResolvedUrl(rawHref: string, listingUrl: string): string | undefined {
  if (!rawHref || /^javascript:/i.test(rawHref) || rawHref.startsWith("#")) return undefined;
  try {
    const url = new URL(rawHref, listingUrl);
    if (url.protocol !== "https:") return undefined;
    url.hash = "";
    return url.toString();
  } catch {
    return undefined;
  }
}

function hostAllowed(url: string, adapter: OfficialListingAdapter) {
  const host = new URL(url).hostname.toLowerCase();
  if (adapter === "sebi_press_releases") return host === "www.sebi.gov.in" || host === "sebi.gov.in";
  if (adapter === "isro_latest_news") return host === "www.isro.gov.in" || host === "isro.gov.in";
  return host === "punjab.gov.in" || host.endsWith(".punjab.gov.in");
}

function adapterAccepts(title: string, link: string, adapter: OfficialListingAdapter) {
  const normalized = title.toLowerCase();
  if (title.length < 10 || title.length > 500) return false;
  if (/^(home|more|more info|read more|next|last|first|previous|top|search|login|contact|about us)$/i.test(title)) return false;
  const classified = classifyCurrentAffairsSignal(title);

  if (adapter === "sebi_press_releases") {
    return classified.score >= 31
      || /press|securities|investor|market|fpi|aif|mutual fund|cyber|sebi/i.test(normalized)
      || /press|media|notification/i.test(link);
  }
  if (adapter === "isro_latest_news") {
    return classified.score >= 35
      || /isro|satellite|space|gaganyaan|chandrayaan|aditya|nisar|pslv|gslv|lvm|launch|mission/i.test(normalized);
  }
  return classified.score >= 30
    || /punjab|cabinet|chief minister|government|scheme|policy|launch|approved|appointment|award/i.test(normalized)
    || /press-release/i.test(link);
}

function anchorMatches(html: string) {
  return [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].map((match) => ({
    index: match.index ?? 0,
    attributes: match[1] ?? "",
    content: match[2] ?? "",
  }));
}

function structuralContext(html: string, anchorIndex: number): string {
  const lower = html.toLowerCase();
  for (const tag of ["tr", "li", "article"]) {
    const open = lower.lastIndexOf(`<${tag}`, anchorIndex);
    const previousClose = lower.lastIndexOf(`</${tag}>`, anchorIndex);
    if (open < 0 || open < previousClose) continue;
    const close = lower.indexOf(`</${tag}>`, anchorIndex);
    if (close >= 0 && close - open <= 4000) {
      return html.slice(open, close + tag.length + 3);
    }
  }

  const lineStart = Math.max(0, html.lastIndexOf("\n", anchorIndex - 1) + 1);
  const lineEndFound = html.indexOf("\n", anchorIndex);
  const lineEnd = lineEndFound >= 0 ? lineEndFound : html.length;
  const line = html.slice(lineStart, lineEnd);
  if (line.length <= 3000) return line;

  return html.slice(Math.max(0, anchorIndex - 220), Math.min(html.length, anchorIndex + 700));
}

export function parseOfficialListing(
  html: string,
  listingUrl: string,
  adapter: OfficialListingAdapter,
  maxEntries = 80,
): OfficialListingEntry[] {
  if (html.length > 5_000_000) throw new Error("Official listing payload is too large");
  const entries: OfficialListingEntry[] = [];
  const seen = new Set<string>();

  for (const anchor of anchorMatches(html)) {
    if (entries.length >= maxEntries) break;
    const title = cleanText(anchor.content);
    const link = safeResolvedUrl(hrefFromAttributes(anchor.attributes), listingUrl);
    if (!link || !hostAllowed(link, adapter) || !adapterAccepts(title, link, adapter)) continue;
    const dedupe = `${title.toLowerCase()}|${link}`;
    if (seen.has(dedupe)) continue;
    seen.add(dedupe);

    const exactDate = findListingDate(anchor.content);
    const contextualDate = exactDate ?? findListingDate(structuralContext(html, anchor.index));
    const classified = classifyCurrentAffairsSignal(title);
    entries.push({
      title,
      link,
      publishedAt: contextualDate,
      dateConfidence: exactDate ? "explicit" : contextualDate ? "contextual" : "unknown",
      discoveryKeywords: classified.keywords,
    });
  }

  return entries;
}
