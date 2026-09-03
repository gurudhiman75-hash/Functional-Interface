import { normalizeCurrentAffairsText } from "./core";
import { extractHeadlineFactClaims, type FactClaim } from "./intelligence";

export const SELECTED_PRIMARY_RECOVERY_VERSION = "ca-cp054-selected-primary-recovery-v1";

export type SelectedPrimaryRecoveryFact = FactClaim & {
  evidenceClass: string;
};

const TITLE_STOP_WORDS = new Set([
  "the", "and", "for", "with", "from", "that", "this", "into", "after", "before",
  "over", "under", "about", "new", "says", "said", "amid", "as", "at", "by", "in",
  "of", "on", "to", "a", "an", "is", "are", "was", "were", "has", "have", "had",
]);

function clean(value: string) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function normalizedFactValue(value: string) {
  return normalizeCurrentAffairsText(value)
    .replace(/\brs\.?\b/g, "rupees")
    .replace(/\s+/g, " ")
    .trim();
}

function makeClaim(
  factKey: string,
  factValue: string,
  factType: FactClaim["factType"],
  confidence: number,
): FactClaim | null {
  const value = clean(factValue).replace(/^[,;:\s]+|[,;:\s]+$/g, "");
  const normalizedValue = normalizedFactValue(value);
  if (!value || !normalizedValue || value.length > 500) return null;
  return {
    factKey,
    factValue: value,
    normalizedValue,
    factType,
    confidence,
    extractionMethod: "rule",
  };
}

function makePageFact(
  factKey: string,
  factValue: string,
  factType: FactClaim["factType"],
  confidence: number,
  evidenceClass: string,
): SelectedPrimaryRecoveryFact | null {
  const claim = makeClaim(factKey, factValue, factType, confidence);
  return claim ? { ...claim, evidenceClass } : null;
}

function pushUnique<T extends FactClaim>(target: T[], fact: T | null) {
  if (!fact) return;
  if (!target.some((item) => item.factKey === fact.factKey && item.normalizedValue === fact.normalizedValue)) {
    target.push(fact);
  }
}

export function extractSelectedHeadlineRecoveryClaims(title: string): FactClaim[] {
  const cleaned = clean(title);
  if (!cleaned) return [];

  // CP-054: planned active headlines must retain future-event semantics. The
  // older participation rule could otherwise parse "PM to participate" as an
  // entity named "PM to" and a completed action named "participate".
  const planned = cleaned.match(
    /^(.{2,140}?)\s+(?:to|will)\s+(participate|address|attend|inaugurate|launch|open|chair|hold|conduct|grace)\b(?:\s+(?:in|at))?\s+(.{3,240})$/i,
  );
  if (planned?.[1] && planned[2] && planned[3]) {
    const claims: FactClaim[] = [];
    pushUnique(claims, makeClaim("acting_entity", planned[1], "entity", 0.78));
    pushUnique(claims, makeClaim("official_action", `scheduled ${planned[2].toLowerCase()}`, "string", 0.76));
    pushUnique(claims, makeClaim("action_subject", planned[3], "string", 0.72));
    pushUnique(claims, makeClaim("event_status", "planned", "string", 0.74));
    return claims;
  }

  // Institution-active appointments such as "RBI appoints X as Y" are common
  // in official feeds but are not covered by the older passive appointment rule.
  const appointment = cleaned.match(
    /^(.{2,100}?)\s+(appoints?|appointed)\s+(.{2,120}?)\s+as\s+(?:the\s+|new\s+)?(.{3,180})$/i,
  );
  if (appointment?.[1] && appointment[2] && appointment[3] && appointment[4]) {
    const claims: FactClaim[] = [];
    pushUnique(claims, makeClaim("acting_entity", appointment[1], "entity", 0.82));
    pushUnique(claims, makeClaim("appointee", appointment[3], "entity", 0.84));
    pushUnique(claims, makeClaim("position", appointment[4], "string", 0.82));
    return claims;
  }

  const enablement = cleaned.match(
    /^(.{2,120}?)\s+(enables?|enabled|introduces?|introduced|implements?|implemented)\s+(.{3,260})$/i,
  );
  if (enablement?.[1] && enablement[2] && enablement[3]) {
    const claims: FactClaim[] = [];
    const verb = enablement[2].toLowerCase().replace(/s$/, "");
    const normalizedVerb = verb === "enable" ? "enabled"
      : verb === "introduce" ? "introduced"
        : verb === "implement" ? "implemented"
          : verb;
    pushUnique(claims, makeClaim("acting_entity", enablement[1], "entity", 0.80));
    pushUnique(claims, makeClaim("official_action", normalizedVerb, "string", 0.78));
    pushUnique(claims, makeClaim("action_subject", enablement[3], "string", 0.74));
    return claims;
  }

  return extractHeadlineFactClaims(cleaned);
}

function decodeEntities(value: string) {
  const named: Record<string, string> = {
    amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", ndash: "–", mdash: "—",
    rsquo: "’", lsquo: "‘", ldquo: "“", rdquo: "”",
  };
  return value
    .replace(/&#(\d+);/g, (_match, digits) => String.fromCodePoint(Number(digits)))
    .replace(/&#x([0-9a-f]+);/gi, (_match, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&([a-z]+);/gi, (match, key) => named[String(key).toLowerCase()] ?? match);
}

export function extractSelectedPrimaryPageText(html: string) {
  if (Buffer.byteLength(html, "utf8") > 4_000_000) throw new Error("Primary recovery page exceeds extraction size limit");
  const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html;
  return decodeEntities(body)
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<(script|style|noscript|svg|form|nav|footer|header)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<br\s*\/?\s*>/gi, "\n")
    .replace(/<\/(?:p|li|tr|div|section|article|h1|h2|h3)\s*>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/[\t\r ]+/g, " ")
    .replace(/\n\s*/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, 240_000);
}

function titleTerms(value: string) {
  return [...new Set(
    normalizeCurrentAffairsText(value)
      .split(" ")
      .filter((token) => token.length >= 2 && !TITLE_STOP_WORDS.has(token)),
  )];
}

export function recoveryPageMatchesTitle(title: string, text: string) {
  const terms = titleTerms(title);
  const page = new Set(titleTerms(text));
  const shared = terms.filter((term) => page.has(term));
  const minimumShared = terms.length <= 3 ? Math.min(2, terms.length) : 3;
  const containment = terms.length ? shared.length / terms.length : 0;
  return {
    matched: terms.length >= 2 && shared.length >= minimumShared && containment >= 0.45,
    sharedTerms: shared,
    titleTerms: terms,
    containment: Number(containment.toFixed(4)),
  };
}

export function primaryRecoveryUrlVariants(sourceKey: string, sourceUrl: string) {
  let original: URL;
  try {
    original = new URL(sourceUrl);
  } catch {
    return [];
  }
  if (original.protocol !== "https:") return [];
  const variants: string[] = [];
  const add = (url: URL) => {
    url.hash = "";
    const value = url.toString();
    if (!variants.includes(value)) variants.push(value);
  };

  if (sourceKey === "pib") {
    const mobile = new URL(original.toString());
    mobile.pathname = mobile.pathname
      .replace(/PressReleseDetail\.aspx$/i, "PressReleseDetailm.aspx")
      .replace(/PressReleaseDetail\.aspx$/i, "PressReleaseDetailm.aspx");
    add(mobile);
    add(original);
    return variants;
  }

  if (sourceKey === "rbi") {
    for (const host of ["m.rbi.org.in", "www.rbi.org.in", "rbi.org.in"]) {
      const variant = new URL(original.toString());
      variant.hostname = host;
      add(variant);
    }
    return variants;
  }

  add(original);
  return variants;
}

function sentences(text: string) {
  return text
    .replace(/\b(Shri|Smt|Dr|Mr|Mrs|Ms|Prof)\./gi, "$1\uE000")
    .split(/(?<=[.!?])\s+|\n+/)
    .map((sentence) => sentence.replaceAll("\uE000", ".").replace(/\s+/g, " ").trim())
    .filter((sentence) => sentence.length >= 12 && sentence.length <= 1200);
}

function matchPercentage(text: string, patterns: RegExp[]) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return `${match[1]}%`;
  }
  return null;
}

function matchMoney(text: string, patterns: RegExp[]) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return clean(match[1]);
  }
  return null;
}

export function extractSelectedPrimaryPageFacts(title: string, text: string): SelectedPrimaryRecoveryFact[] {
  const facts: SelectedPrimaryRecoveryFact[] = [];
  const pageIdentity = recoveryPageMatchesTitle(title, text);
  if (!pageIdentity.matched) return facts;

  for (const sentence of sentences(text)) {
    const appointment = sentence.match(
      /(?:Reserve Bank of India|RBI|Government of India|Ministry of [A-Za-z &]+|Government of Punjab|Punjab Government)?\s*(?:has\s+)?appointed\s+(.{2,120}?)\s+as\s+(?:the\s+|new\s+)?(.{3,180}?)(?:\.|,|;|$)/i,
    );
    if (appointment?.[1] && appointment[2]) {
      pushUnique(facts, makePageFact("appointee", appointment[1], "entity", 0.94, "appointment_body"));
      pushUnique(facts, makePageFact("position", appointment[2], "string", 0.92, "appointment_body"));
    }

    const enabled = sentence.match(/^(.{2,140}?)\s+(?:has\s+)?(enabled|introduced|implemented)\s+(.{3,280}?)(?:\.|;|$)/i);
    if (enabled?.[1] && enabled[2] && enabled[3]) {
      pushUnique(facts, makePageFact("acting_entity", enabled[1], "entity", 0.90, "official_action_body"));
      pushUnique(facts, makePageFact("official_action", enabled[2].toLowerCase(), "string", 0.90, "official_action_body"));
      pushUnique(facts, makePageFact("action_subject", enabled[3], "string", 0.86, "official_action_body"));
    }
  }

  const realGdp = matchPercentage(text, [
    /\breal GDP\b[^%]{0,180}?\b(?:grew|growth|expanded|rose)\b[^%]{0,80}?([0-9]+(?:\.[0-9]+)?)\s*%/i,
    /\bGDP growth\b[^%]{0,100}?([0-9]+(?:\.[0-9]+)?)\s*%/i,
  ]);
  if (realGdp) pushUnique(facts, makePageFact("real_gdp_growth", realGdp, "percentage", 0.96, "macro_metric"));

  const realGva = matchPercentage(text, [
    /\breal GVA\b[^%]{0,160}?\b(?:grew|growth|expanded|rose)\b[^%]{0,80}?([0-9]+(?:\.[0-9]+)?)\s*%/i,
    /\bGVA growth\b[^%]{0,100}?([0-9]+(?:\.[0-9]+)?)\s*%/i,
  ]);
  if (realGva) pushUnique(facts, makePageFact("real_gva_growth", realGva, "percentage", 0.95, "macro_metric"));

  const investment = matchPercentage(text, [
    /\b(?:investment|gross fixed capital formation|GFCF)\b[^%]{0,180}?([0-9]+(?:\.[0-9]+)?)\s*%/i,
  ]);
  if (investment) pushUnique(facts, makePageFact("investment_growth", investment, "percentage", 0.91, "macro_metric"));

  const consumption = matchPercentage(text, [
    /\b(?:household consumption|private final consumption expenditure|PFCE)\b[^%]{0,180}?([0-9]+(?:\.[0-9]+)?)\s*%/i,
  ]);
  if (consumption) pushUnique(facts, makePageFact("household_consumption_growth", consumption, "percentage", 0.91, "macro_metric"));

  const exports = matchPercentage(text, [
    /\bexports?\b[^%]{0,180}?([0-9]+(?:\.[0-9]+)?)\s*%/i,
  ]);
  if (exports) pushUnique(facts, makePageFact("exports_growth", exports, "percentage", 0.89, "macro_metric"));

  const cad = matchMoney(text, [
    /\bcurrent account deficit\b[^$]{0,120}?((?:US\$|USD|\$)\s*[0-9]+(?:\.[0-9]+)?\s*billion)/i,
    /\bCAD\b[^$]{0,100}?((?:US\$|USD|\$)\s*[0-9]+(?:\.[0-9]+)?\s*billion)/i,
  ]);
  if (cad) pushUnique(facts, makePageFact("current_account_deficit", cad, "money", 0.96, "balance_of_payments"));

  const cadShare = matchPercentage(text, [
    /\bcurrent account deficit\b[^%]{0,180}?([0-9]+(?:\.[0-9]+)?)\s*(?:per cent|percent|%)[^\n.]{0,80}?GDP/i,
    /\bCAD\b[^%]{0,140}?([0-9]+(?:\.[0-9]+)?)\s*(?:per cent|percent|%)[^\n.]{0,80}?GDP/i,
  ]);
  if (cadShare) pushUnique(facts, makePageFact("current_account_deficit_gdp_share", cadShare, "percentage", 0.95, "balance_of_payments"));

  const tradeDeficit = matchMoney(text, [
    /\bmerchandise trade deficit\b[^$]{0,120}?((?:US\$|USD|\$)\s*[0-9]+(?:\.[0-9]+)?\s*billion)/i,
  ]);
  if (tradeDeficit) pushUnique(facts, makePageFact("merchandise_trade_deficit", tradeDeficit, "money", 0.94, "balance_of_payments"));

  const services = matchMoney(text, [
    /\bnet services receipts?\b[^$]{0,120}?((?:US\$|USD|\$)\s*[0-9]+(?:\.[0-9]+)?\s*billion)/i,
  ]);
  if (services) pushUnique(facts, makePageFact("net_services_receipts", services, "money", 0.93, "balance_of_payments"));

  const fdi = matchMoney(text, [
    /\bnet (?:foreign direct investment|FDI) inflow\b[^$]{0,120}?((?:US\$|USD|\$)\s*[0-9]+(?:\.[0-9]+)?\s*billion)/i,
  ]);
  if (fdi) pushUnique(facts, makePageFact("net_fdi_inflow", fdi, "money", 0.93, "balance_of_payments"));

  const fpi = matchMoney(text, [
    /\bnet (?:foreign portfolio investment|FPI) outflow\b[^$]{0,120}?((?:US\$|USD|\$)\s*[0-9]+(?:\.[0-9]+)?\s*billion)/i,
  ]);
  if (fpi) pushUnique(facts, makePageFact("net_fpi_outflow", fpi, "money", 0.93, "balance_of_payments"));

  return facts.slice(0, 30);
}
