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
const MX = 16;
const TOP = 24;
const BOTTOM = 36;
const CW = W - MX * 2;
const BLUE = "#315FF4";
const INK = "#111319";
const MUTED = "#747B86";
const RULE = "#E4E7EB";
const CREAM = "#FFF6D9";
const PALE = "#F5F6F8";
const WHITE = "#FFFFFF";
const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url));

const COPY = {
  en: {
    locale: "en-IN",
    currentAffairs: "CURRENT AFFAIRS",
    dailyBrief: "DAILY BRIEF",
    whatMatters: "What matters today",
    overview: (events: number, sections: number) => `${events} verified developments across ${sections} sections · built for quick recall`,
    storyNote: "STORY NOTE",
    why: "WHY IN NEWS",
    memory: "EXAM MEMORY",
    facts: "KEY FACTS",
    recall: "ONE-LINE RECALL",
    exam: "EXAM RELEVANCE",
    source: "PRIMARY SOURCE",
    rapid: "RAPID REVISION",
    rapidTitle: (events: number, minutes: number) => `${events} stories. ${minutes} minutes.`,
    rapidSub: "Only the associations most likely to matter in recall.",
    refs: "SOURCES & REFERENCES",
    refsSub: "Primary references for the stories in this daily pack.",
    briefFooter: "SCAN → RECALL → REVISE",
    detailFooter: "DETAIL PAGE · SAME VISUAL LANGUAGE, MORE DEPTH",
    rapidFooter: "REVISION FIRST · MINIMAL DECORATION · CONSISTENT MEMORY CUES",
    refsFooter: "SOURCE TRACE · PRIMARY REFERENCES",
    page: "Page",
  },
  hi: {
    locale: "hi-IN",
    currentAffairs: "करेंट अफेयर्स",
    dailyBrief: "दैनिक संक्षेप",
    whatMatters: "आज क्या महत्वपूर्ण है",
    overview: (events: number, sections: number) => `${events} सत्यापित घटनाक्रम · ${sections} खंड · त्वरित पुनरावृत्ति के लिए`,
    storyNote: "स्टोरी नोट",
    why: "समाचार में क्यों",
    memory: "परीक्षा स्मृति",
    facts: "मुख्य तथ्य",
    recall: "एक-पंक्ति पुनरावृत्ति",
    exam: "परीक्षा प्रासंगिकता",
    source: "प्राथमिक स्रोत",
    rapid: "त्वरित पुनरावृत्ति",
    rapidTitle: (events: number, minutes: number) => `${events} खबरें · ${minutes} मिनट`,
    rapidSub: "केवल वे संबंध जो परीक्षा में याद रखने के लिए सबसे उपयोगी हैं।",
    refs: "स्रोत एवं संदर्भ",
    refsSub: "इस दैनिक पैक की खबरों के प्राथमिक संदर्भ।",
    briefFooter: "स्कैन → याद → दोहराएँ",
    detailFooter: "विस्तृत नोट · वही दृश्य भाषा · अधिक गहराई",
    rapidFooter: "पुनरावृत्ति पहले · कम सजावट · स्पष्ट स्मृति संकेत",
    refsFooter: "स्रोत ट्रेस · प्राथमिक संदर्भ",
    page: "पृष्ठ",
  },
  pa: {
    locale: "pa-IN",
    currentAffairs: "ਕਰੰਟ ਅਫੇਅਰਜ਼",
    dailyBrief: "ਰੋਜ਼ਾਨਾ ਸੰਖੇਪ",
    whatMatters: "ਅੱਜ ਕੀ ਮਹੱਤਵਪੂਰਨ ਹੈ",
    overview: (events: number, sections: number) => `${events} ਪ੍ਰਮਾਣਿਤ ਘਟਨਾਵਾਂ · ${sections} ਭਾਗ · ਤੇਜ਼ ਦੁਹਰਾਈ ਲਈ`,
    storyNote: "ਸਟੋਰੀ ਨੋਟ",
    why: "ਖ਼ਬਰਾਂ ਵਿੱਚ ਕਿਉਂ",
    memory: "ਪ੍ਰੀਖਿਆ ਯਾਦ",
    facts: "ਮੁੱਖ ਤੱਥ",
    recall: "ਇੱਕ-ਲਾਈਨ ਦੁਹਰਾਈ",
    exam: "ਪ੍ਰੀਖਿਆ ਸੰਬੰਧਤਾ",
    source: "ਮੁੱਖ ਸਰੋਤ",
    rapid: "ਤੇਜ਼ ਦੁਹਰਾਈ",
    rapidTitle: (events: number, minutes: number) => `${events} ਖ਼ਬਰਾਂ · ${minutes} ਮਿੰਟ`,
    rapidSub: "ਕੇਵਲ ਉਹ ਸੰਬੰਧ ਜੋ ਪ੍ਰੀਖਿਆ ਲਈ ਯਾਦ ਰੱਖਣ ਵਿੱਚ ਸਭ ਤੋਂ ਵੱਧ ਮਦਦਗਾਰ ਹਨ।",
    refs: "ਸਰੋਤ ਅਤੇ ਹਵਾਲੇ",
    refsSub: "ਇਸ ਰੋਜ਼ਾਨਾ ਪੈਕ ਦੀਆਂ ਖ਼ਬਰਾਂ ਲਈ ਮੁੱਖ ਹਵਾਲੇ।",
    briefFooter: "ਸਕੈਨ → ਯਾਦ → ਦੁਹਰਾਈ",
    detailFooter: "ਵਿਸਤ੍ਰਿਤ ਨੋਟ · ਉਹੀ ਵਿਜ਼ੂਅਲ ਭਾਸ਼ਾ · ਹੋਰ ਗਹਿਰਾਈ",
    rapidFooter: "ਦੁਹਰਾਈ ਪਹਿਲਾਂ · ਘੱਟ ਸਜਾਵਟ · ਸਪਸ਼ਟ ਯਾਦ ਸੰਕੇਤ",
    refsFooter: "ਸਰੋਤ ਟ੍ਰੇਸ · ਮੁੱਖ ਹਵਾਲੇ",
    page: "ਪੰਨਾ",
  },
} satisfies Record<DailyMasterPackLanguage, {
  locale: string;
  currentAffairs: string;
  dailyBrief: string;
  whatMatters: string;
  overview: (events: number, sections: number) => string;
  storyNote: string;
  why: string;
  memory: string;
  facts: string;
  recall: string;
  exam: string;
  source: string;
  rapid: string;
  rapidTitle: (events: number, minutes: number) => string;
  rapidSub: string;
  refs: string;
  refsSub: string;
  briefFooter: string;
  detailFooter: string;
  rapidFooter: string;
  refsFooter: string;
  page: string;
}>;

const FACT_LABELS: Record<DailyMasterPackLanguage, Record<string, string>> = {
  en: {
    appointee: "Appointee",
    position: "Position",
    effective_date: "Effective from",
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

type Ctx = any;
type FlatStory = {
  event: DailyMasterPackEvent;
  sectionLabel: string;
  sectionCategory: string;
  number: number;
};

type PageEnv = {
  ctx: Ctx;
  page: number;
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

function copyStrings(language: DailyMasterPackLanguage) {
  const c = COPY[language];
  return [
    c.currentAffairs, c.dailyBrief, c.whatMatters, c.storyNote, c.why, c.memory, c.facts, c.recall,
    c.exam, c.source, c.rapid, c.rapidSub, c.refs, c.refsSub, c.briefFooter, c.detailFooter,
    c.rapidFooter, c.refsFooter, c.page,
  ];
}

function scriptPoints(payload: DailyMasterPackPayload) {
  if (payload.language === "en") return [];
  const text = [
    ...copyStrings(payload.language),
    COPY[payload.language].overview(payload.eventCount, payload.categoryCount),
    COPY[payload.language].rapidTitle(payload.eventCount, revisionMinutes(payload.eventCount)),
    ...payload.sections.flatMap((section) => [
      section.label,
      ...section.events.flatMap((event) => [
        event.title,
        event.summary,
        dailyMasterPackPdfTakeaway(event.oneLiner),
        ...visibleDailyMasterPackPdfFacts(event).flatMap((fact) => [fact.label ?? "", fact.value]),
        ...event.sources.map((source) => source.name),
      ]),
    ]),
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
    const format = u16(buffer, subtableOffset);
    if (format === 12) {
      const length = u32(buffer, subtableOffset + 4);
      if (length >= 16 && subtableOffset + length <= buffer.length) result.push({ format: 12, offset: subtableOffset, length });
    } else if (format === 4) {
      const length = u16(buffer, subtableOffset + 2);
      if (length >= 16 && subtableOffset + length <= buffer.length) result.push({ format: 4, offset: subtableOffset, length });
    }
  }
  return result.sort((a, b) => b.format - a.format);
}

function format12Supports(buffer: Buffer, subtable: Cmap, codePoint: number) {
  const groupCount = u32(buffer, subtable.offset + 12);
  let low = 0;
  let high = groupCount - 1;
  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    const group = subtable.offset + 16 + middle * 12;
    if (group + 12 > subtable.offset + subtable.length) return false;
    const start = u32(buffer, group);
    const end = u32(buffer, group + 4);
    if (codePoint < start) high = middle - 1;
    else if (codePoint > end) low = middle + 1;
    else return u32(buffer, group + 8) + (codePoint - start) !== 0;
  }
  return false;
}

function format4Supports(buffer: Buffer, subtable: Cmap, codePoint: number) {
  if (codePoint > 0xffff) return false;
  const segmentCount = u16(buffer, subtable.offset + 6) / 2;
  const endCodes = subtable.offset + 14;
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
    if (glyphAddress + 2 > subtable.offset + subtable.length) return false;
    const glyph = u16(buffer, glyphAddress);
    return glyph !== 0 && ((glyph + delta) & 0xffff) !== 0;
  }
  return false;
}

const supportsCodePoint = (buffer: Buffer, codePoint: number) => cmapSubtables(buffer).some((subtable) => (
  subtable.format === 12 ? format12Supports(buffer, subtable, codePoint) : format4Supports(buffer, subtable, codePoint)
));

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
  const rawWords = clean(value).split(" ").filter(Boolean);
  const words = rawWords.flatMap((word) => ctx.measureText(word).width > maxWidth ? splitLongToken(ctx, word, maxWidth) : [word]);
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
  while (last && ctx.measureText(`${last}…`).width > maxWidth) last = last.slice(0, -1);
  result[maxLines - 1] = `${last.replace(/[\s,.;:-]+$/g, "")}…`;
  return result;
}

function dateLabel(date: string, language: DailyMasterPackLanguage) {
  return new Intl.DateTimeFormat(COPY[language].locale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
    .format(new Date(`${date}T00:00:00Z`));
}

function dateTile(date: string, language: DailyMasterPackLanguage) {
  const parsed = new Date(`${date}T00:00:00Z`);
  return {
    day: new Intl.DateTimeFormat(COPY[language].locale, { day: "2-digit", timeZone: "UTC" }).format(parsed),
    month: new Intl.DateTimeFormat(COPY[language].locale, { month: "short", timeZone: "UTC" }).format(parsed).toUpperCase(),
  };
}

function flattenStories(payload: DailyMasterPackPayload) {
  const result: FlatStory[] = [];
  let number = 1;
  for (const section of payload.sections) {
    for (const event of section.events) {
      result.push({ event, sectionLabel: section.label, sectionCategory: section.category, number });
      number += 1;
    }
  }
  return result;
}

function revisionMinutes(eventCount: number) {
  return Math.max(2, Math.round(eventCount * 0.45));
}

function categoryShort(category: string, label: string, language: DailyMasterPackLanguage) {
  if (language !== "en") return clean(label);
  const map: Record<string, string> = {
    national: "NATIONAL",
    economy_banking: "BANKING",
    international: "INTERNATIONAL",
    appointments: "APPOINTMENTS",
    awards: "AWARDS",
    reports_indices: "REPORTS",
    sports: "SPORTS",
    science_technology: "SCI-TECH",
    space: "SPACE",
    defence: "DEFENCE",
    environment: "ENVIRONMENT",
    books_authors: "BOOKS",
    important_days: "IMPORTANT DAYS",
    summits: "SUMMITS",
    obituaries: "OBITUARIES",
    punjab: "PUNJAB",
  };
  return map[category] ?? clean(label).toUpperCase();
}

function primarySource(event: DailyMasterPackEvent) {
  return event.sources.find((source) => source.primary) ?? event.sources[0];
}

function shortSourceName(value: string) {
  const source = clean(value);
  if (/press information bureau/i.test(source)) return "PIB";
  if (/reserve bank of india/i.test(source)) return "RBI";
  if (/securities and exchange board of india/i.test(source)) return "SEBI";
  return source;
}

function briefMeta(story: FlatStory) {
  const source = primarySource(story.event);
  const parts = [source ? shortSourceName(source.name) : "", ...story.event.examFamilies.slice(0, 2).map((value) => clean(value).toUpperCase())]
    .filter(Boolean);
  return parts.join(" · ");
}

function sectionSummary(payload: DailyMasterPackPayload) {
  return payload.sections
    .filter((section) => section.events.length > 0)
    .map((section) => ({ label: categoryShort(section.category, section.label, payload.language), count: section.events.length }));
}

function setFont(ctx: Ctx, family: string, size: number, weight = 400, color = INK) {
  ctx.font = font(family, size, weight);
  ctx.fillStyle = color;
}

function drawTextLines(ctx: Ctx, lines: string[], x: number, y: number, lineHeight: number) {
  let currentY = y;
  for (const line of lines) {
    ctx.fillText(line, x, currentY);
    currentY += lineHeight;
  }
  return currentY;
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

function header(ctx: Ctx, payload: DailyMasterPackPayload, family: string, right: string) {
  setFont(ctx, family, 10.5, 700, INK);
  ctx.fillText("examtree", MX, TOP);
  setFont(ctx, family, 6.7, 500, MUTED);
  ctx.fillText(COPY[payload.language].currentAffairs, MX, TOP + 16);
  ctx.textAlign = "right";
  setFont(ctx, family, 6.8, 500, MUTED);
  ctx.fillText(right, W - MX, TOP + 2);
  ctx.textAlign = "left";
  drawRule(ctx, TOP + 28);
}

function footer(ctx: Ctx, payload: DailyMasterPackPayload, family: string, page: number, totalPages: number | undefined, leftText: string) {
  drawRule(ctx, H - 28);
  setFont(ctx, family, 6.3, 500, MUTED);
  ctx.fillText(leftText, MX, H - 14);
  ctx.textAlign = "right";
  const c = COPY[payload.language];
  ctx.fillText(totalPages ? `${String(page).padStart(2, "0")} / ${String(totalPages).padStart(2, "0")}` : `${c.page} ${page}`, W - MX, H - 14);
  ctx.textAlign = "left";
}

function beginPage(doc: InstanceType<typeof PDFDocument>, payload: DailyMasterPackPayload, family: string, page: number, totalPages: number | undefined, right: string, footerText: string): PageEnv {
  const ctx = doc.beginPage(W, H);
  ctx.fillStyle = WHITE;
  ctx.fillRect(0, 0, W, H);
  header(ctx, payload, family, right);
  footer(ctx, payload, family, page, totalPages, footerText);
  return { ctx, page };
}

function endPage(doc: InstanceType<typeof PDFDocument>) {
  doc.endPage();
}

function drawOverviewHero(ctx: Ctx, payload: DailyMasterPackPayload, family: string) {
  const c = COPY[payload.language];
  const tile = dateTile(payload.contentDate, payload.language);
  const y = 70;
  ctx.fillStyle = BLUE;
  ctx.fillRect(MX, y, 54, 50);
  ctx.textAlign = "center";
  setFont(ctx, family, 20, 700, WHITE);
  ctx.fillText(tile.day, MX + 27, y + 23);
  setFont(ctx, family, 6.5, 600, WHITE);
  ctx.fillText(tile.month, MX + 27, y + 39);
  ctx.textAlign = "left";

  setFont(ctx, family, 23, 700, INK);
  ctx.fillText(c.whatMatters, MX + 68, y + 21);
  setFont(ctx, family, 8.4, 400, MUTED);
  ctx.fillText(c.overview(payload.eventCount, payload.categoryCount), MX + 68, y + 44);

  const summary = sectionSummary(payload);
  let x = MX;
  let rowY = y + 76;
  setFont(ctx, family, 6.6, 600, MUTED);
  for (const item of summary) {
    const text = `${item.label}  ${item.count}`;
    const width = ctx.measureText(text).width + 26;
    if (x + width > W - MX) {
      x = MX;
      rowY += 18;
    }
    ctx.fillStyle = BLUE;
    ctx.fillText(item.label, x, rowY);
    const labelWidth = ctx.measureText(item.label).width;
    ctx.fillStyle = MUTED;
    ctx.fillText(String(item.count), x + labelWidth + 5, rowY);
    x += width;
  }
  drawRule(ctx, rowY + 13, MX, W - MX, BLUE, 1.2);
  return rowY + 25;
}

function drawBriefContinuationHero(ctx: Ctx, payload: DailyMasterPackPayload, family: string, pageIndex: number) {
  const c = COPY[payload.language];
  setFont(ctx, family, 15, 700, INK);
  ctx.fillText(c.whatMatters, MX, 75);
  setFont(ctx, family, 7.5, 500, MUTED);
  ctx.fillText(`${dateLabel(payload.contentDate, payload.language)} · ${pageIndex}`, MX, 93);
  drawRule(ctx, 106, MX, W - MX, BLUE, 1.1);
  return 120;
}

function drawBriefStory(ctx: Ctx, payload: DailyMasterPackPayload, family: string, story: FlatStory, y: number, height: number) {
  const numberWidth = 36;
  const recallWidth = 142;
  const gap = 11;
  const textX = MX + numberWidth + 10;
  const recallX = W - MX - recallWidth;
  const textWidth = recallX - gap - textX;
  const category = categoryShort(story.sectionCategory, story.sectionLabel, payload.language);

  setFont(ctx, family, 8.2, 700, BLUE);
  ctx.fillText(String(story.number).padStart(2, "0"), MX, y + 12);
  setFont(ctx, family, 6.1, 500, MUTED);
  const catLines = clippedLines(ctx, category, numberWidth, 2);
  drawTextLines(ctx, catLines, MX, y + 29, 8.5);

  setFont(ctx, family, 12.2, 700, INK);
  const titleLines = clippedLines(ctx, story.event.title, textWidth, 2);
  let cursorY = drawTextLines(ctx, titleLines, textX, y + 12, 15.5) + 7;

  setFont(ctx, family, 8.3, 400, "#505762");
  const summaryLines = clippedLines(ctx, story.event.summary, textWidth, 3);
  cursorY = drawTextLines(ctx, summaryLines, textX, cursorY, 11.5) + 9;

  setFont(ctx, family, 6.6, 500, MUTED);
  const metaLines = clippedLines(ctx, briefMeta(story), textWidth, 1);
  drawTextLines(ctx, metaLines, textX, Math.min(y + height - 14, cursorY), 9);

  ctx.fillStyle = CREAM;
  ctx.fillRect(recallX, y + 4, recallWidth, height - 13);
  setFont(ctx, family, 6.1, 700, BLUE);
  ctx.fillText(COPY[payload.language].memory, recallX + 12, y + 21);
  const takeaway = dailyMasterPackPdfTakeaway(story.event.oneLiner) || story.event.title;
  setFont(ctx, family, 8.9, 600, INK);
  const memoryLines = clippedLines(ctx, takeaway, recallWidth - 24, 5);
  drawTextLines(ctx, memoryLines, recallX + 12, y + 42, 11.5);

  drawRule(ctx, y + height, MX, W - MX);
}

function renderBriefPages(doc: InstanceType<typeof PDFDocument>, payload: DailyMasterPackPayload, family: string, totalPages: number | undefined, pageStart: number) {
  const stories = flattenStories(payload);
  const perPage = 5;
  let page = pageStart;
  for (let offset = 0, briefPage = 1; offset < stories.length; offset += perPage, briefPage += 1) {
    page += 1;
    const right = `${COPY[payload.language].dailyBrief} · ${dateLabel(payload.contentDate, payload.language)}`;
    const { ctx } = beginPage(doc, payload, family, page, totalPages, right, COPY[payload.language].briefFooter);
    const startY = briefPage === 1 ? drawOverviewHero(ctx, payload, family) : drawBriefContinuationHero(ctx, payload, family, briefPage);
    const chunk = stories.slice(offset, offset + perPage);
    const available = H - BOTTOM - 34 - startY;
    const rowHeight = Math.min(119, available / Math.max(1, chunk.length));
    chunk.forEach((story, index) => drawBriefStory(ctx, payload, family, story, startY + index * rowHeight, rowHeight));
    endPage(doc);
  }
  return page;
}

function detailTitle(ctx: Ctx, payload: DailyMasterPackPayload, family: string, story: FlatStory) {
  const category = categoryShort(story.sectionCategory, story.sectionLabel, payload.language);
  ctx.fillStyle = BLUE;
  ctx.fillRect(MX, 74, 4, 45);
  setFont(ctx, family, 7.2, 700, BLUE);
  ctx.fillText(`${String(story.number).padStart(2, "0")} · ${category}`, MX + 17, 83);
  setFont(ctx, family, 22, 700, INK);
  const titleLines = clippedLines(ctx, story.event.title, CW - 24, 3);
  const afterTitle = drawTextLines(ctx, titleLines, MX + 17, 108, 26.5);
  setFont(ctx, family, 8.1, 400, MUTED);
  ctx.fillText(dateLabel(story.event.eventDate || payload.contentDate, payload.language), MX + 17, afterTitle + 3);
  const ruleY = Math.max(163, afterTitle + 23);
  drawRule(ctx, ruleY);
  return ruleY + 31;
}

function drawWhyAndMemory(ctx: Ctx, payload: DailyMasterPackPayload, family: string, story: FlatStory, y: number) {
  const c = COPY[payload.language];
  const leftX = MX + 17;
  const rightW = 190;
  const gap = 19;
  const rightX = W - MX - rightW;
  const leftW = rightX - gap - leftX;

  setFont(ctx, family, 7.1, 700, BLUE);
  ctx.fillText(c.why, leftX, y);
  setFont(ctx, family, 10.1, 400, "#343A43");
  const summaryLines = clippedLines(ctx, story.event.summary, leftW, 7);
  const leftBottom = drawTextLines(ctx, summaryLines, leftX, y + 24, 15.2);

  const boxTop = y - 9;
  const boxH = Math.max(108, Math.min(148, 48 + Math.max(2, clippedLines(ctx, dailyMasterPackPdfTakeaway(story.event.oneLiner) || story.event.title, rightW - 30, 5).length) * 14));
  ctx.fillStyle = CREAM;
  ctx.fillRect(rightX, boxTop, rightW, boxH);
  setFont(ctx, family, 6.8, 700, BLUE);
  ctx.fillText(c.memory, rightX + 16, boxTop + 22);
  setFont(ctx, family, 13.6, 700, INK);
  const memoryLines = clippedLines(ctx, dailyMasterPackPdfTakeaway(story.event.oneLiner) || story.event.title, rightW - 32, 5);
  drawTextLines(ctx, memoryLines, rightX + 16, boxTop + 50, 16.5);

  const bottom = Math.max(leftBottom, boxTop + boxH) + 26;
  drawRule(ctx, bottom - 11);
  return bottom + 2;
}

function drawKeyFacts(ctx: Ctx, payload: DailyMasterPackPayload, family: string, story: FlatStory, y: number) {
  const c = COPY[payload.language];
  const facts = visibleDailyMasterPackPdfFacts(story.event);
  if (!facts.length) return y;
  setFont(ctx, family, 7.1, 700, BLUE);
  ctx.fillText(c.facts, MX + 17, y);
  let rowY = y + 23;
  const labelW = 105;
  const valueX = MX + 17 + labelW;
  const valueW = W - MX - valueX;
  for (const fact of facts) {
    setFont(ctx, family, 6.5, 500, MUTED);
    const labelLines = clippedLines(ctx, factLabel(payload.language, fact).toUpperCase(), labelW - 12, 2);
    drawTextLines(ctx, labelLines, MX + 17, rowY + 3, 9.5);

    setFont(ctx, family, 9.1, 500, INK);
    const valueLines = clippedLines(ctx, fact.value, valueW, 3);
    const valueBottom = drawTextLines(ctx, valueLines, valueX, rowY + 3, 12.5);
    const rowH = Math.max(33, valueBottom - rowY + 9);
    drawRule(ctx, rowY + rowH - 3, valueX, W - MX);
    rowY += rowH;
  }
  return rowY + 8;
}

function drawRecallAndMeta(ctx: Ctx, payload: DailyMasterPackPayload, family: string, story: FlatStory, y: number) {
  const c = COPY[payload.language];
  const recall = dailyMasterPackPdfTakeaway(story.event.oneLiner) || story.event.title;
  const boxX = MX;
  const boxW = CW;
  setFont(ctx, family, 9.8, 600, WHITE);
  const recallLines = clippedLines(ctx, recall, boxW - 34, 3);
  const boxH = Math.max(55, 31 + recallLines.length * 14);
  if (y + boxH + 86 > H - BOTTOM) y = H - BOTTOM - boxH - 86;

  ctx.fillStyle = BLUE;
  ctx.fillRect(boxX, y, boxW, boxH);
  setFont(ctx, family, 6.6, 600, "#E8EEFF");
  ctx.fillText(c.recall, boxX + 17, y + 18);
  setFont(ctx, family, 9.8, 600, WHITE);
  drawTextLines(ctx, recallLines, boxX + 17, y + 39, 14);

  let metaY = y + boxH + 26;
  setFont(ctx, family, 6.5, 500, MUTED);
  ctx.fillText(c.exam, MX + 17, metaY);
  setFont(ctx, family, 8.4, 600, INK);
  ctx.fillText(story.event.examFamilies.map((value) => clean(value).toUpperCase()).join("  ·  ") || "—", MX + 123, metaY);
  metaY += 30;
  drawRule(ctx, metaY - 12);

  const source = primarySource(story.event);
  setFont(ctx, family, 6.5, 500, MUTED);
  ctx.fillText(c.source, MX + 17, metaY + 7);
  setFont(ctx, family, 8.1, 400, MUTED);
  const sourceText = source ? clean(source.name) : "—";
  const sourceLines = clippedLines(ctx, sourceText, W - MX - (MX + 123), 2);
  drawTextLines(ctx, sourceLines, MX + 123, metaY + 7, 10.5);
}

function renderDetailPages(doc: InstanceType<typeof PDFDocument>, payload: DailyMasterPackPayload, family: string, totalPages: number | undefined, pageStart: number) {
  const stories = flattenStories(payload);
  let page = pageStart;
  for (const story of stories) {
    page += 1;
    const category = categoryShort(story.sectionCategory, story.sectionLabel, payload.language);
    const right = `${COPY[payload.language].storyNote} · ${category}`;
    const { ctx } = beginPage(doc, payload, family, page, totalPages, right, COPY[payload.language].detailFooter);
    let y = detailTitle(ctx, payload, family, story);
    y = drawWhyAndMemory(ctx, payload, family, story, y);
    y = drawKeyFacts(ctx, payload, family, story, y);
    drawRecallAndMeta(ctx, payload, family, story, Math.min(y + 8, 650));
    endPage(doc);
  }
  return page;
}

function revisionEntry(ctx: Ctx, payload: DailyMasterPackPayload, family: string, story: FlatStory, x: number, y: number, width: number, height: number) {
  setFont(ctx, family, 7.6, 700, BLUE);
  ctx.fillText(String(story.number).padStart(2, "0"), x, y);
  setFont(ctx, family, 6, 500, MUTED);
  ctx.fillText(categoryShort(story.sectionCategory, story.sectionLabel, payload.language), x + 31, y);

  setFont(ctx, family, 11.2, 700, INK);
  const titleLines = clippedLines(ctx, story.event.title, width - 31, 2);
  drawTextLines(ctx, titleLines, x + 31, y + 25, 14);

  setFont(ctx, family, 7.4, 400, MUTED);
  const recallLines = clippedLines(ctx, dailyMasterPackPdfTakeaway(story.event.oneLiner), width - 31, 2);
  drawTextLines(ctx, recallLines, x + 31, y + 58, 10.5);
  drawRule(ctx, y + height - 7, x, x + width);
}

function renderRapidPages(doc: InstanceType<typeof PDFDocument>, payload: DailyMasterPackPayload, family: string, totalPages: number | undefined, pageStart: number) {
  const c = COPY[payload.language];
  const stories = flattenStories(payload);
  const perPage = 10;
  let page = pageStart;
  for (let offset = 0, rapidPage = 1; offset < stories.length; offset += perPage, rapidPage += 1) {
    page += 1;
    const { ctx } = beginPage(doc, payload, family, page, totalPages, `${c.rapid} · ${payload.eventCount}`, c.rapidFooter);
    setFont(ctx, family, 23, 700, INK);
    ctx.fillText(c.rapidTitle(payload.eventCount, revisionMinutes(payload.eventCount)), MX, 80);
    setFont(ctx, family, 8.8, 400, MUTED);
    ctx.fillText(rapidPage === 1 ? c.rapidSub : `${dateLabel(payload.contentDate, payload.language)} · ${rapidPage}`, MX, 104);
    drawRule(ctx, 128, MX, W - MX, BLUE, 1.2);

    const chunk = stories.slice(offset, offset + perPage);
    const gap = 42;
    const columnW = (CW - gap) / 2;
    const entryH = 115;
    chunk.forEach((story, index) => {
      const column = index < 5 ? 0 : 1;
      const row = index % 5;
      const x = MX + column * (columnW + gap);
      const y = 160 + row * entryH;
      revisionEntry(ctx, payload, family, story, x, y, columnW, entryH);
    });
    endPage(doc);
  }
  return page;
}

function referenceRows(payload: DailyMasterPackPayload) {
  const rows: Array<{ number: number; name: string; url: string }> = [];
  for (const story of flattenStories(payload)) {
    const source = primarySource(story.event);
    if (!source?.url) continue;
    rows.push({ number: story.number, name: clean(source.name), url: clean(source.url) });
  }
  return rows;
}

function drawReferenceEntry(ctx: Ctx, family: string, row: { number: number; name: string; url: string }, x: number, y: number, width: number) {
  setFont(ctx, family, 7.2, 700, BLUE);
  ctx.fillText(String(row.number).padStart(2, "0"), x, y);
  setFont(ctx, family, 8.6, 600, INK);
  const nameLines = clippedLines(ctx, row.name, width - 30, 2);
  let cursor = drawTextLines(ctx, nameLines, x + 30, y, 11.5) + 5;
  setFont(ctx, family, 6.6, 400, MUTED);
  const urlLines = clippedLines(ctx, row.url, width - 30, 3);
  cursor = drawTextLines(ctx, urlLines, x + 30, cursor, 9.3);
  drawRule(ctx, y + 75, x, x + width);
  return cursor;
}

function renderReferencePages(doc: InstanceType<typeof PDFDocument>, payload: DailyMasterPackPayload, family: string, totalPages: number | undefined, pageStart: number) {
  const c = COPY[payload.language];
  const rows = referenceRows(payload);
  if (!rows.length) return pageStart;
  const perPage = 14;
  let page = pageStart;
  for (let offset = 0, refsPage = 1; offset < rows.length; offset += perPage, refsPage += 1) {
    page += 1;
    const { ctx } = beginPage(doc, payload, family, page, totalPages, `${c.refs} · ${dateLabel(payload.contentDate, payload.language)}`, c.refsFooter);
    setFont(ctx, family, 21, 700, INK);
    ctx.fillText(c.refs, MX, 80);
    setFont(ctx, family, 8.4, 400, MUTED);
    ctx.fillText(refsPage === 1 ? c.refsSub : `${dateLabel(payload.contentDate, payload.language)} · ${refsPage}`, MX, 102);
    drawRule(ctx, 126, MX, W - MX, BLUE, 1.2);

    const chunk = rows.slice(offset, offset + perPage);
    const gap = 34;
    const columnW = (CW - gap) / 2;
    chunk.forEach((row, index) => {
      const column = index < 7 ? 0 : 1;
      const itemRow = index % 7;
      const x = MX + column * (columnW + gap);
      const y = 158 + itemRow * 88;
      drawReferenceEntry(ctx, family, row, x, y, columnW);
    });
    endPage(doc);
  }
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
  const doc = new PDFDocument({
    title: `Examtree ${COPY[payload.language].currentAffairs} - ${payload.contentDate}`,
    author: "Examtree",
    subject: "Daily Current Affairs",
    creator: "Examtree Current Affairs Studio",
  });
  let page = 0;
  page = renderBriefPages(doc, payload, family, totalPages, page);
  page = renderDetailPages(doc, payload, family, totalPages, page);
  page = renderRapidPages(doc, payload, family, totalPages, page);
  page = renderReferencePages(doc, payload, family, totalPages, page);
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
