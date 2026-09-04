import { createHash } from "node:crypto";

import { normalizeCurrentAffairsText } from "./core";

export type PrimarySourceKey = "pib" | "rbi" | "sebi" | "isro" | "punjab_gov";

export type PrimaryPageFact = {
  factKey: string;
  factValue: string;
  normalizedValue: string;
  factType: "string" | "number" | "date" | "money" | "percentage" | "entity" | "boolean";
  confidence: number;
  extractionMethod: "rule";
  evidenceClass: string;
};

const SOURCE_HOSTS: Record<PrimarySourceKey, (host: string) => boolean> = {
  pib: (host) => host === "pib.gov.in" || host === "www.pib.gov.in",
  rbi: (host) => host === "rbi.org.in" || host === "www.rbi.org.in" || host === "m.rbi.org.in",
  sebi: (host) => host === "sebi.gov.in" || host === "www.sebi.gov.in",
  isro: (host) => host === "isro.gov.in" || host === "www.isro.gov.in",
  punjab_gov: (host) => host === "punjab.gov.in" || host === "www.punjab.gov.in" || host.endsWith(".punjab.gov.in"),
};

const MONTHS: Record<string, string> = {
  jan: "01", january: "01",
  feb: "02", february: "02",
  mar: "03", march: "03",
  apr: "04", april: "04",
  may: "05",
  jun: "06", june: "06",
  jul: "07", july: "07",
  aug: "08", august: "08",
  sep: "09", sept: "09", september: "09",
  oct: "10", october: "10",
  nov: "11", november: "11",
  dec: "12", december: "12",
};

const ABBREVIATION_MARKER = "\uE000";

function decodeEntities(value: string): string {
  const named: Record<string, string> = {
    amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", ndash: "–", mdash: "—",
  };
  return value
    .replace(/&#(\d+);/g, (_match, digits) => String.fromCodePoint(Number(digits)))
    .replace(/&#x([0-9a-f]+);/gi, (_match, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&([a-z]+);/gi, (match, key) => named[String(key).toLowerCase()] ?? match);
}

function cleanVisibleText(value: string): string {
  return decodeEntities(value)
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<(script|style|noscript|svg|form|nav|footer|header)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<br\s*\/?\s*>/gi, "\n")
    .replace(/<\/p\s*>/gi, "\n")
    .replace(/<\/li\s*>/gi, "\n")
    .replace(/<\/tr\s*>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/[\t\r ]+/g, " ")
    .replace(/\n\s*/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function candidateBody(html: string): string {
  const preferred = [
    /<article\b[^>]*>([\s\S]*?)<\/article>/i,
    /<main\b[^>]*>([\s\S]*?)<\/main>/i,
    /<(?:div|section)\b[^>]*(?:id|class)=["'][^"']*(?:content|press|release|article|news-detail|inner-content)[^"']*["'][^>]*>([\s\S]*?)<\/(?:div|section)>/i,
  ];
  for (const pattern of preferred) {
    const match = html.match(pattern);
    if (match?.[1] && cleanVisibleText(match[1]).length >= 120) return match[1];
  }
  const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  return body?.[1] ?? html;
}

export function extractPrimaryPageText(html: string): string {
  if (Buffer.byteLength(html, "utf8") > 4_000_000) {
    throw new Error("Primary-source page exceeds extraction size limit");
  }
  return cleanVisibleText(candidateBody(html)).slice(0, 220_000);
}

export function primaryPageContentHash(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

export function assertAllowedPrimaryPageUrl(sourceKey: string, value: string): string {
  if (!(sourceKey in SOURCE_HOSTS)) throw new Error(`Unsupported primary source: ${sourceKey}`);
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error("Primary-source page URL is invalid");
  }
  if (url.protocol !== "https:") throw new Error("Primary-source page URL must use HTTPS");
  const host = url.hostname.toLowerCase();
  if (!SOURCE_HOSTS[sourceKey as PrimarySourceKey](host)) {
    throw new Error(`Primary-source page host is not allowed for ${sourceKey}`);
  }
  url.hash = "";
  return url.toString();
}

function normalizeFactValue(value: string): string {
  return normalizeCurrentAffairsText(value)
    .replace(/\brs\.?\b/g, "rupees")
    .replace(/\s+/g, " ")
    .trim();
}

function displayValue(value: string): string {
  return value.replace(/\s+/g, " ").replace(/^[,;:\s]+|[,;:\s]+$/g, "").trim();
}

function makeFact(
  factKey: string,
  factValue: string,
  factType: PrimaryPageFact["factType"],
  confidence: number,
  evidenceClass: string,
): PrimaryPageFact | null {
  const value = displayValue(factValue);
  const normalizedValue = normalizeFactValue(value);
  if (!value || !normalizedValue || value.length > 300) return null;
  return {
    factKey,
    factValue: value,
    normalizedValue,
    factType,
    confidence,
    extractionMethod: "rule",
    evidenceClass,
  };
}

function pushFact(target: PrimaryPageFact[], fact: PrimaryPageFact | null) {
  if (!fact) return;
  if (!target.some((item) => item.factKey === fact.factKey && item.normalizedValue === fact.normalizedValue)) {
    target.push(fact);
  }
}

function sentenceList(text: string): string[] {
  const protectedText = text.replace(
    /\b(Shri|Smt|Dr|Mr|Mrs|Ms|Prof|No|Nos)\./gi,
    (_match, title) => `${title}${ABBREVIATION_MARKER}`,
  );
  return protectedText
    .split(/(?<=[.!?])\s+|\n+/)
    .map((sentence) => sentence.replaceAll(ABBREVIATION_MARKER, ".").replace(/\s+/g, " ").trim())
    .filter((sentence) => sentence.length >= 15 && sentence.length <= 800);
}

function parseDatePhrase(value: string): string | undefined {
  const clean = displayValue(value);
  const iso = clean.match(/\b(20\d{2})[-/]([01]?\d)[-/]([0-3]?\d)\b/);
  if (iso) {
    const date = `${iso[1]}-${String(Number(iso[2])).padStart(2, "0")}-${String(Number(iso[3])).padStart(2, "0")}`;
    const parsed = new Date(`${date}T00:00:00Z`);
    if (!Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date) return date;
  }
  const dmy = clean.match(/\b([0-3]?\d)\s+(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(20\d{2})\b/i);
  if (dmy) {
    const month = MONTHS[String(dmy[2]).toLowerCase()];
    if (month) return `${dmy[3]}-${month}-${String(Number(dmy[1])).padStart(2, "0")}`;
  }
  const mdy = clean.match(/\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+([0-3]?\d),?\s+(20\d{2})\b/i);
  if (mdy) {
    const month = MONTHS[String(mdy[1]).toLowerCase()];
    if (month) return `${mdy[3]}-${month}-${String(Number(mdy[2])).padStart(2, "0")}`;
  }
  return undefined;
}

function extractAppointment(sentence: string, facts: PrimaryPageFact[]) {
  const patterns = [
    /(?:RBI|Reserve Bank of India|SEBI|Government of Punjab|Punjab Government|ISRO|Press Information Bureau)?\s*(?:has\s+)?appointed\s+(.{2,100}?)\s+as\s+(?:the\s+|new\s+)?(.{3,140}?)(?:\.|,|$)/i,
    /^(.{2,100}?)\s+(?:has been|was|is)\s+appointed\s+as\s+(?:the\s+|new\s+)?(.{3,140}?)(?:\.|,|$)/i,
  ];
  for (const pattern of patterns) {
    const match = sentence.match(pattern);
    if (!match?.[1] || !match[2]) continue;
    pushFact(facts, makeFact("appointee", match[1], "entity", 0.92, "appointment"));
    pushFact(facts, makeFact("position", match[2], "string", 0.88, "appointment"));
    return;
  }
}

function extractIndexValue(sentence: string, facts: PrimaryPageFact[]) {
  const match = sentence.match(/\b(?:financial inclusion|fi)[ -]?index\b[^.]{0,180}?\b(?:stood at|stands at|was|is|rose to|increased to)\s+([0-9]+(?:\.[0-9]+)?)/i);
  if (match?.[1]) pushFact(facts, makeFact("index_value", match[1], "number", 0.94, "named_index_value"));
}

function extractBankingRates(sentence: string, facts: PrimaryPageFact[]) {
  const rates: Array<[string, RegExp, number]> = [
    ["policy_repo_rate", /\b(?:policy\s+)?repo rate\b[^%]{0,80}?([0-9]+(?:\.[0-9]+)?)\s*%/i, 0.94],
    ["standing_deposit_facility_rate", /\bstanding deposit facility(?:\s*\(sdf\))?\s+rate\b[^%]{0,80}?([0-9]+(?:\.[0-9]+)?)\s*%/i, 0.94],
    ["marginal_standing_facility_rate", /\bmarginal standing facility(?:\s*\(msf\))?\s+rate\b[^%]{0,80}?([0-9]+(?:\.[0-9]+)?)\s*%/i, 0.94],
    ["bank_rate", /\bbank rate\b[^%]{0,80}?([0-9]+(?:\.[0-9]+)?)\s*%/i, 0.93],
    ["cash_reserve_ratio", /\b(?:cash reserve ratio|crr)\b[^%]{0,80}?([0-9]+(?:\.[0-9]+)?)\s*%/i, 0.93],
    ["statutory_liquidity_ratio", /\b(?:statutory liquidity ratio|slr)\b[^%]{0,80}?([0-9]+(?:\.[0-9]+)?)\s*%/i, 0.93],
  ];
  for (const [key, pattern, confidence] of rates) {
    const match = sentence.match(pattern);
    if (match?.[1]) pushFact(facts, makeFact(key, `${match[1]}%`, "percentage", confidence, "banking_policy_rate"));
  }
}

function extractBalanceOfPayments(sentence: string, facts: PrimaryPageFact[]) {
  if (!facts.some((fact) => fact.factKey === "current_account_amount")) {
    const currentAccount = sentence.match(
      /\bcurrent account\b[^.]{0,220}?\b(deficit|surplus)\b(?:\s*\([A-Z]{2,10}\))?(?:\s+(?:widened|narrowed|declined|decreased|increased|rose|fell|stood|was|were|amounted))?\s*(?:to|of|at)?\s*(?:US\$|USD|\$)\s*([0-9]+(?:\.[0-9]+)?)\s*billion\b/i,
    );
    if (currentAccount?.[1] && currentAccount[2]) {
      pushFact(facts, makeFact("current_account_status", currentAccount[1].toLowerCase(), "string", 0.96, "rbi_balance_of_payments"));
      pushFact(facts, makeFact("current_account_amount", `US$ ${currentAccount[2]} billion`, "money", 0.96, "rbi_balance_of_payments"));
      const share = sentence.match(/\(?\b([0-9]+(?:\.[0-9]+)?)\s*(?:per\s*cent|percent|%)\s+of\s+GDP\b\)?/i);
      if (share?.[1]) {
        pushFact(facts, makeFact("current_account_gdp_share", `${share[1]}% of GDP`, "percentage", 0.95, "rbi_balance_of_payments"));
      }
    }
  }

  if (!facts.some((fact) => fact.factKey === "net_services_receipts")) {
    const services = sentence.match(
      /\bnet services receipts\b[^.]{0,160}?\b(?:rose|increased|declined|decreased|stood|were|was)?\s*(?:to|at|of)?\s*(?:US\$|USD|\$)\s*([0-9]+(?:\.[0-9]+)?)\s*billion\b/i,
    );
    if (services?.[1]) {
      pushFact(facts, makeFact("net_services_receipts", `US$ ${services[1]} billion`, "money", 0.9, "rbi_balance_of_payments"));
    }
  }
}

function extractRank(sentence: string, facts: PrimaryPageFact[]) {
  const match = sentence.match(/\b(?:ranked|ranks|placed)\s+(?:at\s+)?(?:the\s+)?([0-9]{1,3})(?:st|nd|rd|th)?\b/i);
  if (match?.[1]) pushFact(facts, makeFact("rank", match[1], "number", 0.88, "rank"));
}

function extractOutlay(sentence: string, facts: PrimaryPageFact[]) {
  const match = sentence.match(/\b(?:outlay|budgetary support|allocation|approved amount)\b[^₹\d]{0,80}((?:₹|Rs\.?\s*)\s*[0-9][0-9,.]*(?:\s*(?:crore|lakh|million|billion|trillion))?)/i);
  if (match?.[1]) pushFact(facts, makeFact("scheme_outlay", match[1], "money", 0.9, "outlay"));
}

function extractBeneficiaries(sentence: string, facts: PrimaryPageFact[]) {
  const match = sentence.match(/\b([0-9]+(?:\.[0-9]+)?\s*(?:crore|lakh|million|billion)?)\s+(beneficiaries|farmers|people|persons|households|students|women|families)\b/i);
  if (match?.[1] && /benefit|cover|eligible|reach|provide|scheme|programme|program|support/i.test(sentence)) {
    pushFact(facts, makeFact("beneficiary_count", `${match[1]} ${match[2]}`, "string", 0.84, "beneficiary_count"));
  }
}

function extractEffectiveDate(sentence: string, facts: PrimaryPageFact[]) {
  const match = sentence.match(/\b(?:with effect from|effective from|effective on|comes into effect on|shall come into force on)\s+([^.;]{4,40})/i);
  const parsed = match?.[1] ? parseDatePhrase(match[1]) : undefined;
  if (parsed) pushFact(facts, makeFact("effective_date", parsed, "date", 0.93, "effective_date"));
}

function extractMissionFacts(sentence: string, facts: PrimaryPageFact[]) {
  const altitude = sentence.match(/\b(?:orbit(?:ing)?(?:\s+at|\s+altitude)?|altitude(?:\s+of)?)\s*(?:is|of|at)?\s*([0-9]{2,5}(?:\.[0-9]+)?)\s*km\b/i)
    ?? sentence.match(/\b([0-9]{2,5}(?:\.[0-9]+)?)\s*km\s+(?:sun[- ]synchronous\s+)?orbit\b/i);
  if (altitude?.[1]) pushFact(facts, makeFact("orbit_altitude", `${altitude[1]} km`, "string", 0.9, "mission_orbit"));

  const repeat = sentence.match(/\b([0-9]{1,3})[- ]day\s+(?:repeat\s+cycle|revisit)\b/i)
    ?? sentence.match(/\bevery\s+([0-9]{1,3})\s+days\b/i);
  if (repeat?.[1]) pushFact(facts, makeFact("repeat_cycle", `${repeat[1]} days`, "string", 0.9, "mission_repeat_cycle"));

  const life = sentence.match(/\bmission\s+life\b[^0-9]{0,40}([0-9]+(?:\.[0-9]+)?)\s+years?\b/i);
  if (life?.[1]) pushFact(facts, makeFact("mission_life", `${life[1]} years`, "string", 0.91, "mission_life"));

  const launcher = sentence.match(/\b(?:launched|launch)\s+(?:by|aboard|onboard|on board)\s+(?:ISRO['’]s\s+)?([A-Z][A-Z0-9-]{2,24})\b/);
  if (launcher?.[1]) pushFact(facts, makeFact("launcher", launcher[1], "entity", 0.9, "mission_launcher"));
}

function extractMouParties(sentence: string, facts: PrimaryPageFact[]) {
  const match = sentence.match(/\b(?:memorandum of understanding|mou)\b[^.]{0,80}?\bbetween\s+(.{3,220}?)\s+and\s+(.{3,180}?)(?:\.|;|$)/i);
  if (!match?.[1] || !match[2]) return;
  const firstParty = displayValue(match[1]);
  const secondParty = displayValue(match[2]).replace(
    /\s+(?:(?:was|were|is|are|has been|have been)\s+)?(?:signed|executed|entered into|inked)\b.*$/i,
    "",
  ).trim();
  if (firstParty && secondParty) {
    pushFact(facts, makeFact("mou_parties", `${firstParty} and ${secondParty}`, "string", 0.84, "mou_parties"));
  }
}

function extractHeadquarters(sentence: string, facts: PrimaryPageFact[]) {
  const match = sentence.match(/\bheadquartered\s+(?:at|in)\s+([^.;]{2,100})/i);
  if (match?.[1]) pushFact(facts, makeFact("headquarters", match[1], "string", 0.84, "headquarters"));
}

function extractTarget(sentence: string, facts: PrimaryPageFact[]) {
  const percentage = sentence.match(/\b(?:target|aim|goal)\b[^.%]{0,100}?([0-9]+(?:\.[0-9]+)?)\s*%/i);
  if (percentage?.[1]) pushFact(facts, makeFact("target_percentage", `${percentage[1]}%`, "percentage", 0.82, "target"));
  const year = sentence.match(/\b(?:target|aim|goal|achieve|by)\b[^.]{0,120}?\bby\s+(20\d{2})\b/i);
  if (year?.[1]) pushFact(facts, makeFact("target_year", year[1], "number", 0.78, "target"));
}

function removeAmbiguousKeys(facts: PrimaryPageFact[]): PrimaryPageFact[] {
  const byKey = new Map<string, Set<string>>();
  for (const fact of facts) {
    const values = byKey.get(fact.factKey) ?? new Set<string>();
    values.add(fact.normalizedValue);
    byKey.set(fact.factKey, values);
  }
  const ambiguous = new Set(
    [...byKey.entries()]
      .filter(([, values]) => values.size > 1)
      .map(([key]) => key),
  );
  return facts.filter((fact) => !ambiguous.has(fact.factKey));
}

export function extractPrimaryPageFacts(text: string): PrimaryPageFact[] {
  const facts: PrimaryPageFact[] = [];
  for (const sentence of sentenceList(text)) {
    extractAppointment(sentence, facts);
    extractIndexValue(sentence, facts);
    extractBankingRates(sentence, facts);
    extractBalanceOfPayments(sentence, facts);
    extractRank(sentence, facts);
    extractOutlay(sentence, facts);
    extractBeneficiaries(sentence, facts);
    extractEffectiveDate(sentence, facts);
    extractMissionFacts(sentence, facts);
    extractMouParties(sentence, facts);
    extractHeadquarters(sentence, facts);
    extractTarget(sentence, facts);
  }
  return removeAmbiguousKeys(facts).slice(0, 24);
}
