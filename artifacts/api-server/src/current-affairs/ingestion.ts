import { createHash } from "node:crypto";

import {
  CURRENT_AFFAIRS_CATEGORIES,
  normalizeCurrentAffairsText,
  type CurrentAffairsCategory,
} from "./core";

export type FeedEntry = {
  id?: string;
  title: string;
  link: string;
  publishedAt?: string;
  discoveryText?: string;
};

export type ResearchSignal = {
  headline: string;
  categoryGuess: CurrentAffairsCategory;
  relevanceScore: number;
  keywords: string[];
  fingerprint: string;
};

const CATEGORY_TERMS: Array<{
  category: CurrentAffairsCategory;
  terms: string[];
  weight: number;
}> = [
  { category: "economy_banking", weight: 14, terms: ["rbi", "reserve bank", "sebi", "bank", "banking", "repo rate", "inflation", "gdp", "fiscal", "budget", "upi", "npci", "finance ministry", "monetary policy"] },
  { category: "punjab", weight: 18, terms: ["punjab", "chandigarh", "punjab government", "punjab cabinet", "punjab assembly"] },
  { category: "appointments", weight: 12, terms: ["appointed", "appointment", "assumes charge", "assumed charge", "takes charge", "takes over", "took over", "assumed the appointment", "chairperson", "chairman", "chief executive", "governor", "director general", "president elected"] },
  { category: "reports_indices", weight: 12, terms: ["report", "index", "ranking", "survey", "released data", "annual report"] },
  { category: "science_technology", weight: 11, terms: ["technology", "artificial intelligence", "multilingual ai", "semiconductor", "quantum", "biotechnology", "researchers", "scientists"] },
  { category: "space", weight: 14, terms: ["isro", "satellite", "spacecraft", "launch vehicle", "mission", "orbit", "nasa"] },
  { category: "defence", weight: 12, terms: ["defence", "defense", "army", "navy", "air force", "air marshal", "air vice marshal", "armed forces", "dgafms", "missile", "military exercise", "drdo"] },
  { category: "international", weight: 9, terms: ["united nations", "world bank", "imf", "who", "sco", "shanghai cooperation organisation", "shanghai cooperation organization", "council of heads of state", "summit", "bilateral", "treaty", "international"] },
  { category: "sports", weight: 10, terms: ["championship", "tournament", "world cup", "medal", "grand slam", "cricket", "hockey", "badminton", "athletics"] },
  { category: "awards", weight: 10, terms: ["award", "prize", "honour", "honor", "medal awarded"] },
  { category: "environment", weight: 10, terms: ["climate", "environment", "biodiversity", "wildlife", "forest", "pollution", "renewable energy"] },
  { category: "national", weight: 8, terms: ["government", "ministry", "cabinet", "scheme", "bill", "act", "policy", "parliament", "supreme court"] },
];

const GENERAL_EXAM_TERMS = [
  "launch",
  "launched",
  "approved",
  "announced",
  "signed",
  "inaugurated",
  "first",
  "first woman",
  "scripts history",
  "makes history",
  "takes over",
  "assumes charge",
  "largest",
  "highest",
  "lowest",
  "record",
  "scheme",
  "mission",
  "initiative",
  "summit",
  "bilateral",
  "report",
  "index",
  "ranking",
  "appointment",
  "elected",
  "award",
  "winner",
  "headquarters",
];

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
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&#(\d+);/g, (_match, digits) => String.fromCodePoint(Number(digits)))
    .replace(/&#x([0-9a-f]+);/gi, (_match, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&([a-z]+);/gi, (match, key) => named[String(key).toLowerCase()] ?? match);
}

function stripMarkup(value: string): string {
  return decodeEntities(value)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function firstTag(block: string, names: string[]): string {
  for (const name of names) {
    const match = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, "i"));
    if (match?.[1]) return stripMarkup(match[1]);
  }
  return "";
}

function entryLink(block: string, feedUrl: string): string {
  const atomAlternate = block.match(/<link\b[^>]*rel=["']?alternate["']?[^>]*href=["']([^"']+)["'][^>]*>/i);
  const atomAny = block.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*>/i);
  const rssLink = firstTag(block, ["link"]);
  const raw = atomAlternate?.[1] ?? atomAny?.[1] ?? rssLink;
  if (!raw) return "";
  try {
    const resolved = new URL(decodeEntities(raw), feedUrl);
    resolved.hash = "";
    return resolved.protocol === "https:" ? resolved.toString() : "";
  } catch {
    return "";
  }
}

function normalizePublishedAt(value: string): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export function parseSyndicationFeed(xml: string, feedUrl: string): FeedEntry[] {
  if (xml.length > 2_500_000) throw new Error("Feed payload is too large");
  const blocks = [
    ...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi),
    ...xml.matchAll(/<entry\b[^>]*>([\s\S]*?)<\/entry>/gi),
  ].map((match) => match[1] ?? "");

  const entries: FeedEntry[] = [];
  const seen = new Set<string>();
  for (const block of blocks.slice(0, 250)) {
    const title = firstTag(block, ["title"]);
    const link = entryLink(block, feedUrl);
    if (title.length < 5 || title.length > 500 || !link) continue;
    const id = firstTag(block, ["guid", "id"]);
    const published = firstTag(block, ["pubDate", "published", "updated", "dc:date"]);
    const discoveryText = firstTag(block, ["description", "summary", "content:encoded", "content"]);
    const dedupe = `${normalizeCurrentAffairsText(title)}|${link}`;
    if (seen.has(dedupe)) continue;
    seen.add(dedupe);
    entries.push({
      id: id || undefined,
      title,
      link,
      publishedAt: normalizePublishedAt(published),
      discoveryText: discoveryText || undefined,
    });
  }
  return entries;
}

export function discoveryKeywords(text: string, limit = 12): string[] {
  const normalized = normalizeCurrentAffairsText(text);
  const stop = new Set([
    "the", "and", "for", "with", "from", "that", "this", "will", "have", "has", "had", "was", "were", "are", "its", "into", "after", "before", "over", "under", "about", "india", "indian", "new", "says", "said",
  ]);
  const counts = new Map<string, number>();
  for (const token of normalized.split(" ")) {
    if (token.length < 4 || stop.has(token) || /^\d+$/.test(token)) continue;
    counts.set(token, (counts.get(token) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([token]) => token);
}

export function classifyCurrentAffairsSignal(text: string): {
  category: CurrentAffairsCategory;
  score: number;
  keywords: string[];
} {
  const normalized = ` ${normalizeCurrentAffairsText(text)} `;
  let bestCategory: CurrentAffairsCategory = "other";
  let bestCategoryScore = 0;
  for (const rule of CATEGORY_TERMS) {
    const hits = rule.terms.filter((term) => normalized.includes(` ${normalizeCurrentAffairsText(term)} `)).length;
    const score = hits * rule.weight;
    if (score > bestCategoryScore) {
      bestCategory = rule.category;
      bestCategoryScore = score;
    }
  }
  const generalHits = GENERAL_EXAM_TERMS.filter((term) => normalized.includes(` ${term} `)).length;
  const score = Math.max(0, Math.min(100, 24 + bestCategoryScore + generalHits * 7));
  return {
    category: bestCategory,
    score,
    keywords: discoveryKeywords(text),
  };
}

function looksLikeHeadline(line: string): boolean {
  const value = line.replace(/\s+/g, " ").trim();
  const words = value.split(" ").filter(Boolean);
  if (value.length < 24 || value.length > 180) return false;
  if (words.length < 4 || words.length > 24) return false;
  if (/https?:\/\//i.test(value)) return false;
  if (/^(page|vol\.?|volume|edition|city|date|price|www\.)\b/i.test(value)) return false;
  if (/^[\d\W]+$/.test(value)) return false;
  if ((value.match(/[.!?]$/g) ?? []).length > 0 && words.length > 15) return false;
  const alphaWords = words.filter((word) => /[A-Za-z\u0900-\u097F\u0A00-\u0A7F]/u.test(word));
  return alphaWords.length >= 4;
}

export function researchSignalFingerprint(headline: string): string {
  return createHash("sha256").update(normalizeCurrentAffairsText(headline)).digest("hex");
}

export function extractResearchSignals(text: string, maxSignals = 60): ResearchSignal[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  const results: ResearchSignal[] = [];
  const seen = new Set<string>();

  for (let index = 0; index < lines.length && results.length < maxSignals; index += 1) {
    const headline = lines[index]!;
    if (!looksLikeHeadline(headline)) continue;
    const context = [headline, ...lines.slice(index + 1, index + 4)].join(" ").slice(0, 1600);
    const classified = classifyCurrentAffairsSignal(context);
    if (classified.score < 38) continue;
    const fingerprint = researchSignalFingerprint(headline);
    if (seen.has(fingerprint)) continue;
    seen.add(fingerprint);
    results.push({
      headline,
      categoryGuess: classified.category,
      relevanceScore: classified.score,
      keywords: classified.keywords,
      fingerprint,
    });
  }

  return results.sort((a, b) => b.relevanceScore - a.relevanceScore || a.headline.localeCompare(b.headline));
}

export function pdfCandidateDedupeKey(sourceKey: string, documentHash: string, headline: string): string {
  return createHash("sha256")
    .update(`${normalizeCurrentAffairsText(sourceKey)}|${documentHash}|${normalizeCurrentAffairsText(headline)}`)
    .digest("hex");
}