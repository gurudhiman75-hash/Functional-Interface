import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { DailyMasterPackEvent, DailyMasterPackLanguage, DailyMasterPackPayload } from "./daily-master-pack";

const nativeRequire = createRequire(import.meta.url);
const { PDFDocument, GlobalFonts } = nativeRequire("@napi-rs/canvas") as typeof import("@napi-rs/canvas");

const W = 595.28;
const H = 841.89;
const MX = 24;
const TOP = 30;
const BOTTOM = 34;
const CW = W - MX * 2;
const BLUE = "#2866D4";
const GREEN = "#2B9364";
const INK = "#172033";
const MUTED = "#697386";
const RULE = "#E4E8EF";
const PALE = "#F5F7FB";
const WHITE = "#FFFFFF";
const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url));

const COPY = {
  en: {
    locale: "en-IN",
    header: "EXAMTREE - DAILY CURRENT AFFAIRS",
    brand: "EXAMTREE / CURRENT AFFAIRS",
    title: "Daily Current Affairs",
    subtitle: "Related updates are grouped for faster revision, with sources kept at the end so the reading flow stays exam-focused.",
    fastRecalls: (count: number) => `TODAY'S ${count} FAST RECALLS`,
    sections: "SECTIONS",
    developments: (count: number) => `${count} ${count === 1 ? "development" : "developments"}`,
    grouped: (events: number, notes: number) => `${events} related updates grouped into ${notes} ${notes === 1 ? "note" : "notes"}`,
    relatedUpdates: "updates",
    quickRevision: "QUICK REVISION",
    sourceNotes: "SOURCE NOTES",
    page: "Page",
    factFallback: (label: string, value: string) => `${label}: ${value}.`,
    factEffective: (value: string) => `Effective from ${value}.`,
    factAmount: (value: string) => `Value involved: ${value}.`,
    factPercentage: (value: string) => `Key figure: ${value}.`,
    factHeadquarters: (value: string) => `Headquarters: ${value}.`,
    factRegulator: (value: string) => `Regulator: ${value}.`,
    factRank: (value: string) => `Rank: ${value}.`,
    factWinner: (value: string) => `Winner: ${value}.`,
  },
  hi: {
    locale: "hi-IN",
    header: "EXAMTREE - दैनिक करेंट अफेयर्स",
    brand: "EXAMTREE / करेंट अफेयर्स",
    title: "दैनिक करेंट अफेयर्स",
    subtitle: "तेज़ पुनरावृत्ति के लिए संबंधित अपडेट एक साथ रखे गए हैं और स्रोत अंत में दिए गए हैं, ताकि पढ़ने का प्रवाह परीक्षा-केंद्रित रहे।",
    fastRecalls: (count: number) => `आज की ${count} त्वरित पुनरावृत्तियाँ`,
    sections: "खंड",
    developments: (count: number) => `${count} घटनाक्रम`,
    grouped: (events: number, notes: number) => `${events} संबंधित अपडेट को ${notes} नोट में समूहित किया गया`,
    relatedUpdates: "संबंधित अपडेट",
    quickRevision: "त्वरित पुनरावृत्ति",
    sourceNotes: "स्रोत नोट्स",
    page: "पृष्ठ",
    factFallback: (label: string, value: string) => `${label}: ${value}.`,
    factEffective: (value: string) => `प्रभावी तिथि: ${value}.`,
    factAmount: (value: string) => `राशि: ${value}.`,
    factPercentage: (value: string) => `मुख्य आंकड़ा: ${value}.`,
    factHeadquarters: (value: string) => `मुख्यालय: ${value}.`,
    factRegulator: (value: string) => `नियामक: ${value}.`,
    factRank: (value: string) => `रैंक: ${value}.`,
    factWinner: (value: string) => `विजेता: ${value}.`,
  },
  pa: {
    locale: "pa-IN",
    header: "EXAMTREE - ਰੋਜ਼ਾਨਾ ਕਰੰਟ ਅਫੇਅਰਜ਼",
    brand: "EXAMTREE / ਕਰੰਟ ਅਫੇਅਰਜ਼",
    title: "ਰੋਜ਼ਾਨਾ ਕਰੰਟ ਅਫੇਅਰਜ਼",
    subtitle: "ਤੇਜ਼ ਦੁਹਰਾਈ ਲਈ ਸੰਬੰਧਿਤ ਅਪਡੇਟ ਇਕੱਠੇ ਕੀਤੇ ਗਏ ਹਨ ਅਤੇ ਸਰੋਤ ਅੰਤ ਵਿੱਚ ਰੱਖੇ ਗਏ ਹਨ, ਤਾਂ ਜੋ ਪੜ੍ਹਨ ਦਾ ਪ੍ਰਵਾਹ ਪ੍ਰੀਖਿਆ-ਕੇਂਦਰਿਤ ਰਹੇ।",
    fastRecalls: (count: number) => `ਅੱਜ ਦੀਆਂ ${count} ਤੇਜ਼ ਦੁਹਰਾਈਆਂ`,
    sections: "ਭਾਗ",
    developments: (count: number) => `${count} ਘਟਨਾਵਾਂ`,
    grouped: (events: number, notes: number) => `${events} ਸੰਬੰਧਿਤ ਅਪਡੇਟ ${notes} ਨੋਟ ਵਿੱਚ ਸਮੂਹਿਤ`,
    relatedUpdates: "ਸੰਬੰਧਿਤ ਅਪਡੇਟ",
    quickRevision: "ਤੇਜ਼ ਦੁਹਰਾਈ",
    sourceNotes: "ਸਰੋਤ ਨੋਟਸ",
    page: "ਪੰਨਾ",
    factFallback: (label: string, value: string) => `${label}: ${value}.`,
    factEffective: (value: string) => `ਲਾਗੂ ਮਿਤੀ: ${value}.`,
    factAmount: (value: string) => `ਰਕਮ: ${value}.`,
    factPercentage: (value: string) => `ਮੁੱਖ ਅੰਕੜਾ: ${value}.`,
    factHeadquarters: (value: string) => `ਮੁੱਖ ਦਫ਼ਤਰ: ${value}.`,
    factRegulator: (value: string) => `ਨਿਯਾਮਕ: ${value}.`,
    factRank: (value: string) => `ਰੈਂਕ: ${value}.`,
    factWinner: (value: string) => `ਜੇਤੂ: ${value}.`,
  },
} satisfies Record<DailyMasterPackLanguage, {
  locale: string;
  header: string;
  brand: string;
  title: string;
  subtitle: string;
  fastRecalls: (count: number) => string;
  sections: string;
  developments: (count: number) => string;
  grouped: (events: number, notes: number) => string;
  relatedUpdates: string;
  quickRevision: string;
  sourceNotes: string;
  page: string;
  factFallback: (label: string, value: string) => string;
  factEffective: (value: string) => string;
  factAmount: (value: string) => string;
  factPercentage: (value: string) => string;
  factHeadquarters: (value: string) => string;
  factRegulator: (value: string) => string;
  factRank: (value: string) => string;
  factWinner: (value: string) => string;
}>;

const FACT_LABELS: Record<DailyMasterPackLanguage, Record<string, string>> = {
  en: {
    appointee: "Appointee",
    position: "Position",
    effective_date: "Effective date",
    index_value: "Index value",
    percentage: "Key figure",
    amount: "Amount",
    rank: "Rank",
    winner: "Winner",
    award_or_title: "Award / title",
    headquarters: "Headquarters",
    regulator: "Regulator",
    state: "State",
    mou_parties: "Parties",
    policy_repo_rate: "Repo rate",
    standing_deposit_facility_rate: "SDF rate",
    marginal_standing_facility_rate: "MSF rate",
    bank_rate: "Bank Rate",
    cash_reserve_ratio: "CRR",
    statutory_liquidity_ratio: "SLR",
    orbit_altitude: "Orbit altitude",
    repeat_cycle: "Repeat cycle",
    mission_life: "Mission life",
    launcher: "Launch vehicle",
    scheme_outlay: "Outlay",
    beneficiary_count: "Coverage",
    target_percentage: "Target",
    target_year: "Target year",
    current_account_status: "Current account",
    current_account_amount: "Amount",
    current_account_gdp_share: "Share of GDP",
    net_services_receipts: "Net services receipts",
  },
  hi: {
    appointee: "नियुक्त व्यक्ति",
    position: "पद",
    effective_date: "प्रभावी तिथि",
    index_value: "सूचकांक मान",
    percentage: "मुख्य आंकड़ा",
    amount: "राशि",
    rank: "रैंक",
    winner: "विजेता",
    award_or_title: "पुरस्कार / उपाधि",
    headquarters: "मुख्यालय",
    regulator: "नियामक",
    state: "राज्य",
    mou_parties: "पक्ष",
    scheme_outlay: "परिव्यय",
    beneficiary_count: "लाभार्थी / कवरेज",
    target_percentage: "लक्ष्य",
    target_year: "लक्ष्य वर्ष",
  },
  pa: {
    appointee: "ਨਿਯੁਕਤ ਵਿਅਕਤੀ",
    position: "ਅਹੁਦਾ",
    effective_date: "ਲਾਗੂ ਮਿਤੀ",
    index_value: "ਸੂਚਕਾਂਕ ਮੁੱਲ",
    percentage: "ਮੁੱਖ ਅੰਕੜਾ",
    amount: "ਰਕਮ",
    rank: "ਰੈਂਕ",
    winner: "ਜੇਤੂ",
    award_or_title: "ਇਨਾਮ / ਖਿਤਾਬ",
    headquarters: "ਮੁੱਖ ਦਫ਼ਤਰ",
    regulator: "ਨਿਯਾਮਕ",
    state: "ਰਾਜ",
    mou_parties: "ਪੱਖ",
    scheme_outlay: "ਖਰਚਾ",
    beneficiary_count: "ਲਾਭਪਾਤਰੀ / ਕਵਰੇਜ",
    target_percentage: "ਟੀਚਾ",
    target_year: "ਟੀਚਾ ਸਾਲ",
  },
};

const FONTS = {
  hi: { alias: "ExamtreeDevanagari", family: "Noto Sans Devanagari", fileName: "NotoSansDevanagari.ttf", size: 647144, sha: "e703d5282088c4b7787b1a4c5f057cf18f0998d6" },
  pa: { alias: "ExamtreeGurmukhi", family: "Noto Sans Gurmukhi", fileName: "NotoSansGurmukhi.ttf", size: 268608, sha: "49878eb913077538cc8973dcf4ad7c51f3e5fb22" },
} as const;

const registered = new Set<string>();

export type DailyMasterPackPdfRenderResult = {
  buffer: Buffer;
  pageCount: number;
  eventCount: number;
  contentDate: string;
  language: DailyMasterPackLanguage;
  fontFamily: string;
};

export type DailyMasterPackPdfNote = {
  sectionCategory: string;
  sectionLabel: string;
  eventIds: string[];
  publicCodes: string[];
  title: string;
  bullets: string[];
  takeaway: string;
  groupAnchor: string | null;
};

type Ctx = any;
type SectionNotes = {
  category: string;
  label: string;
  eventCount: number;
  notes: DailyMasterPackPdfNote[];
};

const clean = (value: unknown) => String(value ?? "").replace(/\s+/g, " ").trim();
const font = (family: string, size: number, weight = 400) => `${weight} ${size}px ${family}${family === "sans-serif" ? "" : ", sans-serif"}`;
const normalized = (value: unknown) => clean(value)
  .normalize("NFKC")
  .toLocaleLowerCase("en-IN")
  .replace(/[’‘`]/g, "'")
  .replace(/[^\p{L}\p{N}%₹$]+/gu, " ")
  .replace(/\s+/g, " ")
  .trim();

function tokenSet(value: string) {
  return new Set(normalized(value).split(" ").filter((token) => token.length >= 2));
}

function overlapRatio(a: string, b: string) {
  const left = tokenSet(a);
  const right = tokenSet(b);
  if (!left.size || !right.size) return 0;
  let shared = 0;
  for (const token of right) if (left.has(token)) shared += 1;
  return shared / right.size;
}

export function dailyMasterPackPdfTakeaway(value: unknown) {
  return clean(value)
    .replace(/^(?:REMEMBER|Remember)\s*[:—-]?\s*/u, "")
    .replace(/^याद रखें\s*[:—-]?\s*/u, "")
    .replace(/^ਯਾਦ ਰੱਖੋ\s*[:—-]?\s*/u, "")
    .trim();
}

const CORE_FACTS = new Set(["official_action", "action_subject", "acting_entity", "launching_entity", "initiative"]);

export function visibleDailyMasterPackPdfFacts(event: Pick<DailyMasterPackEvent, "facts" | "title" | "summary">) {
  const narrative = normalized(`${event.title} ${event.summary}`);
  const seenValues = new Set<string>();
  return event.facts.filter((fact) => {
    const key = clean(fact.key).toLowerCase();
    const value = clean(fact.value);
    const normalizedValue = normalized(value);
    if (!key || !normalizedValue || CORE_FACTS.has(key)) return false;
    if (narrative.includes(normalizedValue)) return false;
    if (tokenSet(normalizedValue).size >= 3 && overlapRatio(narrative, normalizedValue) >= 0.82) return false;
    if (seenValues.has(normalizedValue)) return false;
    seenValues.add(normalizedValue);
    return true;
  }).slice(0, 5);
}

function factLabel(language: DailyMasterPackLanguage, fact: DailyMasterPackEvent["facts"][number]) {
  const key = clean(fact.key).toLowerCase();
  return FACT_LABELS[language][key] || clean(fact.label) || key.replace(/_/g, " ").replace(/^./, (char) => char.toUpperCase());
}

function factNote(language: DailyMasterPackLanguage, fact: DailyMasterPackEvent["facts"][number]) {
  const c = COPY[language];
  const key = clean(fact.key).toLowerCase();
  const value = clean(fact.value).replace(/[.\s]+$/u, "");
  if (!value) return "";
  if (key === "effective_date") return c.factEffective(value);
  if (key === "amount" || key.endsWith("_amount") || key === "scheme_outlay") return c.factAmount(value);
  if (key === "percentage" || key.endsWith("_percentage") || key.endsWith("_share")) return c.factPercentage(value);
  if (key === "headquarters") return c.factHeadquarters(value);
  if (key === "regulator") return c.factRegulator(value);
  if (key === "rank") return c.factRank(value);
  if (key === "winner") return c.factWinner(value);
  return c.factFallback(factLabel(language, fact), value);
}

const GROUP_STOPWORDS = new Set([
  "the", "and", "for", "with", "from", "into", "under", "over", "after", "before", "through", "this", "that", "these", "those",
  "announces", "announced", "launches", "launched", "issues", "issued", "releases", "released", "holds", "held", "approves", "approved",
  "government", "india", "update", "updates", "annual", "monthly", "new", "first", "second", "third", "fourth",
]);

function sourceKey(event: DailyMasterPackEvent) {
  const source = event.sources.find((item) => item.primary) ?? event.sources[0];
  return normalized(source?.name ?? "");
}

function acronymTokens(event: DailyMasterPackEvent) {
  const text = [event.title, event.summary, ...event.facts.map((fact) => clean(fact.value))].join(" ");
  return Array.from(new Set(text.match(/\b[A-Z][A-Z0-9-]{2,}\b/g) ?? []));
}

function significantTitleWords(value: string) {
  return normalized(value).split(" ").filter((token) => token.length >= 4 && !GROUP_STOPWORDS.has(token) && !/^\d/.test(token));
}

function titleJaccard(a: DailyMasterPackEvent, b: DailyMasterPackEvent) {
  const left = new Set(significantTitleWords(a.title));
  const right = new Set(significantTitleWords(b.title));
  if (!left.size || !right.size) return 0;
  let shared = 0;
  for (const token of left) if (right.has(token)) shared += 1;
  const union = new Set([...left, ...right]).size;
  return union ? shared / union : 0;
}

function sharedAcronyms(events: DailyMasterPackEvent[]) {
  if (!events.length) return [];
  let shared = new Set(acronymTokens(events[0]!));
  for (const event of events.slice(1)) {
    const current = new Set(acronymTokens(event));
    shared = new Set([...shared].filter((token) => current.has(token)));
  }
  return [...shared];
}

function groupAnchor(a: DailyMasterPackEvent, b: DailyMasterPackEvent) {
  if (!sourceKey(a) || sourceKey(a) !== sourceKey(b)) return null;
  const shared = sharedAcronyms([a, b]);
  const strong = shared.filter((token) => token.replace(/-/g, "").length >= 4 && !["INDIA", "PRESS", "REPORT"].includes(token));
  if (!strong.length) return null;
  if (titleJaccard(a, b) < 0.17) return null;
  return strong.sort((x, y) => y.length - x.length)[0] ?? null;
}

function commonDescriptor(events: DailyMasterPackEvent[], anchor: string) {
  if (!events.length) return "";
  let shared = new Set(significantTitleWords(events[0]!.title));
  for (const event of events.slice(1)) {
    const current = new Set(significantTitleWords(event.title));
    shared = new Set([...shared].filter((token) => current.has(token)));
  }
  const normalizedAnchor = normalized(anchor);
  const preferred = ["report", "reports", "auction", "auctions", "mission", "scheme", "index", "forum", "meeting", "operation", "operations", "policy", "initiative"];
  const match = preferred.find((token) => shared.has(token) && token !== normalizedAnchor);
  return match ?? [...shared].find((token) => token !== normalizedAnchor) ?? "";
}

function groupTitle(events: DailyMasterPackEvent[], anchor: string, language: DailyMasterPackLanguage) {
  const acronyms = sharedAcronyms(events);
  const entity = acronyms.find((token) => token !== anchor && token.length <= 6) ?? "";
  const descriptor = commonDescriptor(events, anchor);
  const parts = [entity, anchor, descriptor, COPY[language].relatedUpdates].filter(Boolean);
  return parts.join(" ");
}

function combinedTakeaway(events: DailyMasterPackEvent[], title: string) {
  const takeaways = events.map((event) => dailyMasterPackPdfTakeaway(event.oneLiner)).filter(Boolean);
  const unique = Array.from(new Set(takeaways.map((value) => clean(value))));
  if (!unique.length) return title;
  if (unique.length === 1) return unique[0]!;
  const compact = unique.join(" / ");
  return compact.length <= 210 ? compact : title;
}

function eventBullets(language: DailyMasterPackLanguage, events: DailyMasterPackEvent[]) {
  const bullets: string[] = [];
  const seen = new Set<string>();
  for (const event of events) {
    const summary = clean(event.summary);
    const ns = normalized(summary);
    if (summary && !seen.has(ns)) {
      bullets.push(summary);
      seen.add(ns);
    }
  }
  const factCandidates = events.flatMap((event) => visibleDailyMasterPackPdfFacts(event).map((fact) => factNote(language, fact)));
  for (const candidate of factCandidates) {
    if (bullets.length >= events.length + 2) break;
    const nc = normalized(candidate);
    if (!candidate || seen.has(nc) || bullets.some((bullet) => overlapRatio(bullet, candidate) >= 0.86)) continue;
    bullets.push(candidate);
    seen.add(nc);
  }
  return bullets.slice(0, Math.max(3, Math.min(events.length + 2, 5)));
}

export function buildDailyMasterPackPdfNotes(payload: DailyMasterPackPayload): SectionNotes[] {
  return payload.sections.map((section) => {
    const notes: DailyMasterPackPdfNote[] = [];
    let index = 0;
    while (index < section.events.length) {
      const first = section.events[index]!;
      const grouped = [first];
      let anchor: string | null = null;
      while (index + grouped.length < section.events.length && grouped.length < 3) {
        const next = section.events[index + grouped.length]!;
        const pairAnchor = groupAnchor(grouped[grouped.length - 1]!, next);
        if (!pairAnchor) break;
        if (anchor && pairAnchor !== anchor) break;
        anchor = anchor ?? pairAnchor;
        grouped.push(next);
      }
      const title = grouped.length > 1 && anchor ? groupTitle(grouped, anchor, payload.language) : clean(first.title);
      notes.push({
        sectionCategory: section.category,
        sectionLabel: section.label,
        eventIds: grouped.map((event) => event.id),
        publicCodes: grouped.map((event) => event.publicCode),
        title,
        bullets: eventBullets(payload.language, grouped),
        takeaway: combinedTakeaway(grouped, title),
        groupAnchor: grouped.length > 1 ? anchor : null,
      });
      index += grouped.length;
    }
    return { category: section.category, label: section.label, eventCount: section.events.length, notes };
  });
}

function fontDirs() {
  return [
    process.env.CURRENT_AFFAIRS_FONT_DIR,
    path.join(MODULE_DIR, "current-affairs-fonts"),
    path.resolve(MODULE_DIR, "../../.runtime-assets/current-affairs-fonts"),
    path.resolve(process.cwd(), "artifacts/api-server/.runtime-assets/current-affairs-fonts"),
    path.resolve(process.cwd(), ".runtime-assets/current-affairs-fonts"),
  ].filter((value): value is string => Boolean(value));
}

function resolveFont(language: Exclude<DailyMasterPackLanguage, "en">) {
  const data = FONTS[language];
  for (const dir of fontDirs()) {
    const candidate = path.join(dir, data.fileName);
    if (!existsSync(candidate)) continue;
    const buffer = readFileSync(candidate);
    if (buffer.length !== data.size) throw new Error(`${data.family} runtime font size mismatch: expected ${data.size}, got ${buffer.length}`);
    const sha = createHash("sha1").update(Buffer.from(`blob ${buffer.length}\0`, "utf8")).update(buffer).digest("hex");
    if (sha !== data.sha) throw new Error(`${data.family} runtime font checksum mismatch`);
    if (!registered.has(candidate)) {
      if (!GlobalFonts.registerFromPath(candidate, data.alias)) throw new Error(`${data.family} could not be registered with the PDF renderer`);
      registered.add(candidate);
    }
    return { ...data, buffer };
  }
  throw new Error(`${data.family} runtime font is unavailable. Run the verified Current Affairs font bootstrap before rendering localized PDFs.`);
}

type Cmap = { format: 4 | 12; offset: number; length: number };
const u16 = (buffer: Buffer, offset: number) => {
  if (offset < 0 || offset + 2 > buffer.length) throw new Error("Invalid font table offset");
  return buffer.readUInt16BE(offset);
};
const u32 = (buffer: Buffer, offset: number) => {
  if (offset < 0 || offset + 4 > buffer.length) throw new Error("Invalid font table offset");
  return buffer.readUInt32BE(offset);
};

function cmapSubtables(buffer: Buffer) {
  if (buffer.length < 12) throw new Error("Font file is too small to contain a TrueType offset table");
  const tableCount = u16(buffer, 4);
  let cmapOffset = -1;
  let cmapLength = 0;
  for (let index = 0; index < tableCount; index += 1) {
    const record = 12 + index * 16;
    if (record + 16 > buffer.length) break;
    if (buffer.toString("ascii", record, record + 4) !== "cmap") continue;
    cmapOffset = u32(buffer, record + 8);
    cmapLength = u32(buffer, record + 12);
    break;
  }
  if (cmapOffset < 0 || cmapOffset + cmapLength > buffer.length) throw new Error("Font cmap table is missing or invalid");
  const encodingCount = u16(buffer, cmapOffset + 2);
  const result: Cmap[] = [];
  for (let index = 0; index < encodingCount; index += 1) {
    const record = cmapOffset + 4 + index * 8;
    if (record + 8 > cmapOffset + cmapLength) break;
    const subtableOffset = cmapOffset + u32(buffer, record + 4);
    if (subtableOffset + 2 > buffer.length) continue;
    const formatNumber = u16(buffer, subtableOffset);
    if (formatNumber === 12) {
      const length = u32(buffer, subtableOffset + 4);
      if (length >= 16 && subtableOffset + length <= buffer.length) result.push({ format: 12, offset: subtableOffset, length });
    } else if (formatNumber === 4) {
      const length = u16(buffer, subtableOffset + 2);
      if (length >= 16 && subtableOffset + length <= buffer.length) result.push({ format: 4, offset: subtableOffset, length });
    }
  }
  return result.sort((a, b) => b.format - a.format);
}

function format12Supports(buffer: Buffer, table: Cmap, codePoint: number) {
  const groupCount = u32(buffer, table.offset + 12);
  let low = 0;
  let high = groupCount - 1;
  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    const group = table.offset + 16 + middle * 12;
    if (group + 12 > table.offset + table.length) return false;
    const start = u32(buffer, group);
    const end = u32(buffer, group + 4);
    if (codePoint < start) high = middle - 1;
    else if (codePoint > end) low = middle + 1;
    else return u32(buffer, group + 8) + (codePoint - start) !== 0;
  }
  return false;
}

function format4Supports(buffer: Buffer, table: Cmap, codePoint: number) {
  if (codePoint > 0xffff) return false;
  const segmentCount = u16(buffer, table.offset + 6) / 2;
  const endCodes = table.offset + 14;
  const startCodes = endCodes + segmentCount * 2 + 2;
  const deltas = startCodes + segmentCount * 2;
  const rangeOffsets = deltas + segmentCount * 2;
  for (let index = 0; index < segmentCount; index += 1) {
    const end = u16(buffer, endCodes + index * 2);
    if (codePoint > end) continue;
    const start = u16(buffer, startCodes + index * 2);
    if (codePoint < start) return false;
    const delta = u16(buffer, deltas + index * 2);
    const rangeAddress = rangeOffsets + index * 2;
    const range = u16(buffer, rangeAddress);
    if (range === 0) return ((codePoint + delta) & 0xffff) !== 0;
    const glyphAddress = rangeAddress + range + (codePoint - start) * 2;
    if (glyphAddress + 2 > table.offset + table.length) return false;
    const glyph = u16(buffer, glyphAddress);
    return glyph !== 0 && ((glyph + delta) & 0xffff) !== 0;
  }
  return false;
}

const supportsCodePoint = (buffer: Buffer, codePoint: number) => cmapSubtables(buffer).some((table) => (
  table.format === 12 ? format12Supports(buffer, table, codePoint) : format4Supports(buffer, table, codePoint)
));

function scriptPoints(payload: DailyMasterPackPayload) {
  if (payload.language === "en") return [];
  const c = COPY[payload.language];
  const notes = buildDailyMasterPackPdfNotes(payload);
  const text = [
    c.header, c.brand, c.title, c.subtitle, c.fastRecalls(5), c.sections, c.quickRevision, c.sourceNotes, c.relatedUpdates,
    ...notes.flatMap((section) => [section.label, c.developments(section.eventCount), c.grouped(section.eventCount, section.notes.length), ...section.notes.flatMap((note) => [note.title, ...note.bullets, note.takeaway])]),
  ].join(" ");
  const result = new Set<number>();
  for (const char of Array.from(text)) {
    const codePoint = char.codePointAt(0)!;
    if (payload.language === "hi") {
      if ((codePoint >= 0x0900 && codePoint <= 0x097f) || (codePoint >= 0xa8e0 && codePoint <= 0xa8ff)) result.add(codePoint);
    } else if (codePoint >= 0x0a00 && codePoint <= 0x0a7f) {
      result.add(codePoint);
    }
  }
  return [...result];
}

export function assertDailyMasterPackPdfFontCoverage(payload: DailyMasterPackPayload) {
  if (payload.language === "en") return { language: "en" as const, fontFamily: "sans-serif", checkedCodePoints: 0 };
  const resolved = resolveFont(payload.language);
  const points = scriptPoints(payload);
  const missing = points.filter((codePoint) => !supportsCodePoint(resolved.buffer, codePoint));
  if (missing.length) {
    throw new Error(`${resolved.family} is missing required ${payload.language} glyphs: ${missing.slice(0, 12).map((cp) => `U+${cp.toString(16).toUpperCase().padStart(4, "0")}`).join(", ")}`);
  }
  return { language: payload.language, fontFamily: resolved.alias, checkedCodePoints: points.length };
}

function splitLongToken(ctx: Ctx, token: string, maxWidth: number) {
  const parts: string[] = [];
  let current = "";
  for (const char of Array.from(token)) {
    const next = `${current}${char}`;
    if (current && ctx.measureText(next).width > maxWidth) {
      parts.push(current);
      current = char;
    } else current = next;
  }
  if (current) parts.push(current);
  return parts;
}

function wrap(ctx: Ctx, value: string, maxWidth: number) {
  const words = clean(value).split(" ").filter(Boolean).flatMap((word) => (
    ctx.measureText(word).width > maxWidth ? splitLongToken(ctx, word, maxWidth) : [word]
  ));
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (!line || ctx.measureText(next).width <= maxWidth) line = next;
    else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function clippedLines(ctx: Ctx, value: string, maxWidth: number, maxLines: number) {
  const lines = wrap(ctx, value, maxWidth);
  if (lines.length <= maxLines) return lines;
  const result = lines.slice(0, maxLines);
  let last = result[maxLines - 1] ?? "";
  while (last && ctx.measureText(`${last}...`).width > maxWidth) last = last.slice(0, -1);
  result[maxLines - 1] = `${last.replace(/[\s,.;:-]+$/g, "")}...`;
  return result;
}

function setFont(ctx: Ctx, family: string, size: number, weight = 400, color = INK) {
  ctx.font = font(family, size, weight);
  ctx.fillStyle = color;
}

function drawTextLines(ctx: Ctx, lines: string[], x: number, y: number, lineHeight: number) {
  let cursor = y;
  for (const line of lines) {
    ctx.fillText(line, x, cursor);
    cursor += lineHeight;
  }
  return cursor;
}

function drawRule(ctx: Ctx, y: number, x1 = MX, x2 = W - MX, color = RULE, width = 0.7) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y);
  ctx.lineTo(x2, y);
  ctx.stroke();
  ctx.restore();
}

function drawBullet(ctx: Ctx, x: number, y: number, color = INK) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y - 2.6, 1.7, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function dateLabel(date: string, language: DailyMasterPackLanguage) {
  return new Intl.DateTimeFormat(COPY[language].locale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}

function header(ctx: Ctx, payload: DailyMasterPackPayload, family: string, page: number) {
  setFont(ctx, family, 6.5, 600, MUTED);
  ctx.fillText(COPY[payload.language].header, MX, TOP);
  ctx.textAlign = "right";
  ctx.fillText(`${dateLabel(payload.contentDate, payload.language).toLocaleUpperCase(COPY[payload.language].locale)}  |  ${page}`, W - MX, TOP);
  ctx.textAlign = "left";
}

function footer(ctx: Ctx, payload: DailyMasterPackPayload, family: string, page: number, totalPages?: number) {
  drawRule(ctx, H - 27, MX, W - MX, RULE, 0.6);
  setFont(ctx, family, 6.1, 500, MUTED);
  ctx.fillText(COPY[payload.language].header, MX, H - 13);
  ctx.textAlign = "right";
  ctx.fillText(`${dateLabel(payload.contentDate, payload.language).toLocaleUpperCase(COPY[payload.language].locale)}  |  ${totalPages ? `${page} / ${totalPages}` : page}`, W - MX, H - 13);
  ctx.textAlign = "left";
}

function beginPage(doc: InstanceType<typeof PDFDocument>, payload: DailyMasterPackPayload, family: string, page: number, totalPages?: number) {
  const ctx = doc.beginPage(W, H);
  ctx.fillStyle = WHITE;
  ctx.fillRect(0, 0, W, H);
  header(ctx, payload, family, page);
  footer(ctx, payload, family, page, totalPages);
  return ctx;
}

function endPage(doc: InstanceType<typeof PDFDocument>) {
  doc.endPage();
}

function renderOverview(doc: InstanceType<typeof PDFDocument>, payload: DailyMasterPackPayload, family: string, page: number, totalPages: number | undefined, sections: SectionNotes[]) {
  const c = COPY[payload.language];
  const ctx = beginPage(doc, payload, family, page, totalPages);
  setFont(ctx, family, 7.3, 700, BLUE);
  ctx.fillText(c.brand, MX, 62);
  setFont(ctx, family, 25, 700, INK);
  ctx.fillText(c.title, MX, 95);
  setFont(ctx, family, 12.5, 700, INK);
  ctx.fillText(dateLabel(payload.contentDate, payload.language), MX, 118);
  setFont(ctx, family, 8.8, 400, MUTED);
  const subtitleLines = clippedLines(ctx, c.subtitle, CW, 3);
  let y = drawTextLines(ctx, subtitleLines, MX, 151, 13) + 14;

  const notes = sections.flatMap((section) => section.notes);
  const recalls = notes.slice(0, 5);
  ctx.fillStyle = PALE;
  ctx.fillRect(MX, y, CW, 29);
  setFont(ctx, family, 7.1, 700, BLUE);
  ctx.fillText(c.fastRecalls(recalls.length), MX + 8, y + 18);
  y += 45;
  recalls.forEach((note, index) => {
    setFont(ctx, family, 8.4, 700, BLUE);
    ctx.fillText(String(index + 1).padStart(2, "0"), MX + 8, y + 4);
    setFont(ctx, family, 8.7, 500, INK);
    const lines = clippedLines(ctx, note.title, CW - 60, 2);
    drawTextLines(ctx, lines, MX + 62, y + 4, 11);
    y += Math.max(31, lines.length * 11 + 15);
    drawRule(ctx, y - 8, MX, W - MX);
  });

  y += 22;
  setFont(ctx, family, 7.0, 700, BLUE);
  ctx.fillText(c.sections, MX, y);
  y += 24;
  sections.forEach((section) => {
    setFont(ctx, family, 8.8, 500, INK);
    ctx.fillText(section.label, MX, y);
    ctx.textAlign = "right";
    setFont(ctx, family, 7.2, 500, MUTED);
    ctx.fillText(String(section.notes.length), W - MX, y);
    ctx.textAlign = "left";
    y += 20;
  });
  endPage(doc);
}

function sectionSubtitle(payload: DailyMasterPackPayload, section: SectionNotes) {
  const c = COPY[payload.language];
  return section.notes.length < section.eventCount ? c.grouped(section.eventCount, section.notes.length) : c.developments(section.eventCount);
}

function drawSectionHeading(ctx: Ctx, payload: DailyMasterPackPayload, family: string, section: SectionNotes, y: number) {
  setFont(ctx, family, 17, 700, INK);
  ctx.fillText(section.label, MX, y);
  setFont(ctx, family, 8.2, 400, MUTED);
  ctx.fillText(sectionSubtitle(payload, section), MX, y + 22);
  drawRule(ctx, y + 38, MX + 20, W - MX, BLUE, 2.2);
  return y + 62;
}

function noteHeight(ctx: Ctx, family: string, note: DailyMasterPackPdfNote) {
  setFont(ctx, family, 12.2, 700, INK);
  const titleLines = clippedLines(ctx, note.title, CW, 3);
  let height = titleLines.length * 15 + 12;
  setFont(ctx, family, 8.8, 400, INK);
  for (const bullet of note.bullets) height += clippedLines(ctx, bullet, CW - 16, 4).length * 12 + 5;
  setFont(ctx, family, 8.5, 700, GREEN);
  height += clippedLines(ctx, note.takeaway, CW, 3).length * 12 + 25;
  return height;
}

function drawNote(ctx: Ctx, family: string, note: DailyMasterPackPdfNote, y: number) {
  setFont(ctx, family, 12.2, 700, INK);
  const titleLines = clippedLines(ctx, note.title, CW, 3);
  let cursor = drawTextLines(ctx, titleLines, MX, y, 15) + 8;
  setFont(ctx, family, 8.8, 400, INK);
  for (const bullet of note.bullets) {
    const lines = clippedLines(ctx, bullet, CW - 16, 4);
    drawBullet(ctx, MX + 4, cursor + 3, INK);
    cursor = drawTextLines(ctx, lines, MX + 14, cursor + 3, 12) + 5;
  }
  const takeawayLines = clippedLines(ctx, note.takeaway, CW, 3);
  setFont(ctx, family, 8.5, 700, GREEN);
  cursor = drawTextLines(ctx, takeawayLines, MX, cursor + 2, 12) + 10;
  drawRule(ctx, cursor, MX, W - MX);
  return cursor + 18;
}

function renderSectionPages(doc: InstanceType<typeof PDFDocument>, payload: DailyMasterPackPayload, family: string, startPage: number, totalPages: number | undefined, sections: SectionNotes[]) {
  let page = startPage;
  let ctx: Ctx | null = null;
  let y = 0;
  const openPage = () => {
    if (ctx) endPage(doc);
    page += 1;
    ctx = beginPage(doc, payload, family, page, totalPages);
    y = 68;
  };

  for (const section of sections) {
    if (!ctx) openPage();
    if (y > H - 180) openPage();
    y = drawSectionHeading(ctx!, payload, family, section, y);
    for (const note of section.notes) {
      const needed = noteHeight(ctx!, family, note);
      if (y + needed > H - 54) {
        openPage();
        y = drawSectionHeading(ctx!, payload, family, section, y);
      }
      y = drawNote(ctx!, family, note, y);
    }
    y += 12;
  }
  if (ctx) endPage(doc);
  return page;
}

function primarySource(event: DailyMasterPackEvent) {
  return event.sources.find((source) => source.primary) ?? event.sources[0];
}

function compactSource(event: DailyMasterPackEvent) {
  const source = primarySource(event);
  if (!source) return "";
  const name = clean(source.name);
  const url = clean(source.url);
  const prid = url.match(/[?&](?:PRID|prid)=([0-9]+)/)?.[1] ?? url.match(/PRID[=/]([0-9]+)/i)?.[1];
  if (/press information bureau/i.test(name) && prid) return `PIB PRID ${prid}`;
  if (/reserve bank of india/i.test(name)) {
    const id = url.match(/(?:pressrelease|prid|id)[^0-9]*([0-9]{4,})/i)?.[1];
    return id ? `RBI Press Release ${id}` : "Reserve Bank of India";
  }
  if (/securities and exchange board of india/i.test(name)) return "SEBI";
  return url ? `${name} - ${url}` : name;
}

function revisionHeight(ctx: Ctx, family: string, note: DailyMasterPackPdfNote) {
  setFont(ctx, family, 8.7, 500, INK);
  return clippedLines(ctx, note.takeaway, CW - 20, 3).length * 12 + 10;
}

function renderRevisionAndSources(doc: InstanceType<typeof PDFDocument>, payload: DailyMasterPackPayload, family: string, startPage: number, totalPages: number | undefined, sections: SectionNotes[]) {
  const c = COPY[payload.language];
  const notes = sections.flatMap((section) => section.notes);
  const events = payload.sections.flatMap((section) => section.events);
  let page = startPage;
  let ctx: Ctx | null = null;
  let y = 0;
  const openPage = () => {
    if (ctx) endPage(doc);
    page += 1;
    ctx = beginPage(doc, payload, family, page, totalPages);
    y = 72;
  };
  openPage();
  setFont(ctx!, family, 17, 700, INK);
  ctx!.fillText(c.quickRevision, MX, y);
  y += 35;
  for (const note of notes) {
    const needed = revisionHeight(ctx!, family, note);
    if (y + needed > H - 72) {
      openPage();
      setFont(ctx!, family, 14, 700, INK);
      ctx!.fillText(c.quickRevision, MX, y);
      y += 30;
    }
    setFont(ctx!, family, 8.7, 500, INK);
    const lines = clippedLines(ctx!, note.takeaway, CW - 20, 3);
    drawBullet(ctx!, MX + 4, y + 3, BLUE);
    y = drawTextLines(ctx!, lines, MX + 16, y + 3, 12) + 7;
  }

  if (y + 80 > H - 72) openPage();
  y += 22;
  setFont(ctx!, family, 7.2, 700, BLUE);
  ctx!.fillText(c.sourceNotes, MX, y);
  y += 21;
  const sourceRows = events.map((event, index) => ({ index: index + 1, text: compactSource(event) })).filter((row) => row.text);
  for (const row of sourceRows) {
    setFont(ctx!, family, 6.9, 400, MUTED);
    const text = `[${row.index}] ${row.text}`;
    const lines = clippedLines(ctx!, text, CW, 3);
    const needed = lines.length * 9 + 4;
    if (y + needed > H - 55) {
      openPage();
      setFont(ctx!, family, 7.2, 700, BLUE);
      ctx!.fillText(c.sourceNotes, MX, y);
      y += 21;
    }
    y = drawTextLines(ctx!, lines, MX, y, 9) + 4;
  }
  if (ctx) endPage(doc);
  return page;
}

export function assertDailyMasterPackPdfPayload(value: unknown): DailyMasterPackPayload {
  if (!value || typeof value !== "object") throw new Error("Daily master pack payload is missing");
  const payload = value as Partial<DailyMasterPackPayload>;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(payload.contentDate ?? ""))) throw new Error("Daily master pack payload has an invalid content date");
  if (!(["en", "hi", "pa"] as const).includes(payload.language as DailyMasterPackLanguage)) throw new Error("Daily master pack PDF language must be en, hi or pa");
  if (!Array.isArray(payload.sections)) throw new Error("Daily master pack payload has no sections");
  return payload as DailyMasterPackPayload;
}

function renderDoc(payload: DailyMasterPackPayload, family: string, totalPages?: number) {
  const sections = buildDailyMasterPackPdfNotes(payload);
  const doc = new PDFDocument({
    title: `Examtree Daily Current Affairs - ${payload.contentDate}`,
    author: "Examtree",
    subject: "Daily Current Affairs",
    creator: "Examtree Current Affairs Studio",
  });
  let page = 1;
  renderOverview(doc, payload, family, page, totalPages, sections);
  page = renderSectionPages(doc, payload, family, page, totalPages, sections);
  page = renderRevisionAndSources(doc, payload, family, page, totalPages, sections);
  return { buffer: doc.close(), pageCount: page };
}

export function renderDailyMasterPackPdf(input: unknown): DailyMasterPackPdfRenderResult {
  const payload = assertDailyMasterPackPdfPayload(input);
  const coverage = assertDailyMasterPackPdfFontCoverage(payload);
  const first = renderDoc(payload, coverage.fontFamily);
  const final = renderDoc(payload, coverage.fontFamily, first.pageCount);
  return {
    buffer: final.buffer,
    pageCount: final.pageCount,
    eventCount: payload.eventCount,
    contentDate: payload.contentDate,
    language: payload.language,
    fontFamily: coverage.fontFamily,
  };
}
