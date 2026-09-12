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
const MX = 56;
const TOP = 42;
const BOTTOM = 50;
const CW = W - MX * 2;
const INK = "#16191F";
const MUTED = "#7A818D";
const RULE = "#E6E8EB";
const BLUE = "#4F7DF3";
const GREEN = "#78A94B";
const PURPLE = "#9A6BB0";
const TEAL = "#4E9A8A";
const ORANGE = "#D49A3A";
const RED = "#C86B67";
const INDIGO = "#6675C9";
const WHITE = "#FFFFFF";
const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url));

const COPY = {
  en: {
    locale: "en-IN",
    header: "DAILY CURRENT AFFAIRS",
    kicker: "CURRENT AFFAIRS",
    hero: ["Daily revision,", "without the noise."],
    overview: (events: number, sections: number) => `${events} verified developments across ${sections} sections`,
    inside: "INSIDE TODAY",
    readingGuide: "READING GUIDE",
    guideHeadline: "Headline",
    guideHeadlineText: "what happened",
    guideFacts: "Key facts",
    guideFactsText: "extra exam context only",
    guideRecall: "Recall",
    guideRecallText: "the one fact worth retaining",
    facts: "KEY FACTS",
    rapid: "RAPID REVISION",
    rapidHero: "One last pass.",
    rapidSub: "Only the facts worth carrying into the exam.",
    storyWord: (count: number) => count === 1 ? "1 story" : `${count} stories`,
    page: "Page",
  },
  hi: {
    locale: "hi-IN",
    header: "दैनिक करेंट अफेयर्स",
    kicker: "करेंट अफेयर्स",
    hero: ["दैनिक पुनरावृत्ति,", "बिना अनावश्यक शोर के।"],
    overview: (events: number, sections: number) => `${events} सत्यापित घटनाक्रम · ${sections} खंड`,
    inside: "आज के खंड",
    readingGuide: "पढ़ने का तरीका",
    guideHeadline: "शीर्षक",
    guideHeadlineText: "क्या हुआ",
    guideFacts: "मुख्य तथ्य",
    guideFactsText: "केवल अतिरिक्त परीक्षा संदर्भ",
    guideRecall: "पुनरावृत्ति",
    guideRecallText: "याद रखने योग्य एक मुख्य तथ्य",
    facts: "मुख्य तथ्य",
    rapid: "त्वरित पुनरावृत्ति",
    rapidHero: "एक अंतिम नज़र।",
    rapidSub: "केवल वही तथ्य जिन्हें परीक्षा तक साथ रखना है।",
    storyWord: (count: number) => `${count} खबरें`,
    page: "पृष्ठ",
  },
  pa: {
    locale: "pa-IN",
    header: "ਰੋਜ਼ਾਨਾ ਕਰੰਟ ਅਫੇਅਰਜ਼",
    kicker: "ਕਰੰਟ ਅਫੇਅਰਜ਼",
    hero: ["ਰੋਜ਼ਾਨਾ ਦੁਹਰਾਈ,", "ਬਿਨਾਂ ਬੇਲੋੜੇ ਸ਼ੋਰ ਦੇ।"],
    overview: (events: number, sections: number) => `${events} ਪ੍ਰਮਾਣਿਤ ਘਟਨਾਵਾਂ · ${sections} ਭਾਗ`,
    inside: "ਅੱਜ ਦੇ ਭਾਗ",
    readingGuide: "ਪੜ੍ਹਨ ਦਾ ਤਰੀਕਾ",
    guideHeadline: "ਸਿਰਲੇਖ",
    guideHeadlineText: "ਕੀ ਹੋਇਆ",
    guideFacts: "ਮੁੱਖ ਤੱਥ",
    guideFactsText: "ਕੇਵਲ ਵਾਧੂ ਪ੍ਰੀਖਿਆ ਸੰਦਰਭ",
    guideRecall: "ਦੁਹਰਾਈ",
    guideRecallText: "ਯਾਦ ਰੱਖਣ ਲਈ ਇੱਕ ਮੁੱਖ ਤੱਥ",
    facts: "ਮੁੱਖ ਤੱਥ",
    rapid: "ਤੇਜ਼ ਦੁਹਰਾਈ",
    rapidHero: "ਇੱਕ ਆਖਰੀ ਨਜ਼ਰ।",
    rapidSub: "ਕੇਵਲ ਉਹ ਤੱਥ ਜੋ ਪ੍ਰੀਖਿਆ ਤੱਕ ਨਾਲ ਰੱਖਣੇ ਹਨ।",
    storyWord: (count: number) => `${count} ਖ਼ਬਰਾਂ`,
    page: "ਪੰਨਾ",
  },
} satisfies Record<DailyMasterPackLanguage, {
  locale: string;
  header: string;
  kicker: string;
  hero: [string, string];
  overview: (events: number, sections: number) => string;
  inside: string;
  readingGuide: string;
  guideHeadline: string;
  guideHeadlineText: string;
  guideFacts: string;
  guideFactsText: string;
  guideRecall: string;
  guideRecallText: string;
  facts: string;
  rapid: string;
  rapidHero: string;
  rapidSub: string;
  storyWord: (count: number) => string;
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
type Story = {
  event: DailyMasterPackEvent;
  number: number;
  sectionLabel: string;
  sectionCategory: string;
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
    const nv = normalized(value);
    if (!key || !nv || CORE_FACTS.has(key)) return false;
    if (narrative.includes(nv)) return false;
    if (tokenSet(nv).size >= 3 && overlapRatio(narrative, nv) >= 0.82) return false;
    if (seenValues.has(nv)) return false;
    seenValues.add(nv);
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

function copyText(payload: DailyMasterPackPayload) {
  const c = COPY[payload.language];
  return [
    c.header, c.kicker, ...c.hero, c.inside, c.readingGuide, c.guideHeadline, c.guideHeadlineText,
    c.guideFacts, c.guideFactsText, c.guideRecall, c.guideRecallText, c.facts, c.rapid, c.rapidHero,
    c.rapidSub, c.page, c.overview(payload.eventCount, payload.categoryCount),
    ...payload.sections.flatMap((section) => [
      section.label,
      c.storyWord(section.events.length),
      ...section.events.flatMap((event) => [
        event.title,
        event.summary,
        dailyMasterPackPdfTakeaway(event.oneLiner),
        ...visibleDailyMasterPackPdfFacts(event).flatMap((fact) => [fact.label ?? "", fact.value]),
        ...event.sources.map((source) => source.name),
      ]),
    ]),
  ].join(" ");
}

function scriptPoints(payload: DailyMasterPackPayload) {
  if (payload.language === "en") return [];
  const text = copyText(payload);
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
  while (last && ctx.measureText(`${last}…`).width > maxWidth) last = last.slice(0, -1);
  result[maxLines - 1] = `${last.replace(/[\s,.;:-]+$/g, "")}…`;
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

function dateLabel(date: string, language: DailyMasterPackLanguage) {
  return new Intl.DateTimeFormat(COPY[language].locale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
    .format(new Date(`${date}T00:00:00Z`));
}

function pageDate(date: string, language: DailyMasterPackLanguage) {
  return dateLabel(date, language).toLocaleUpperCase(COPY[language].locale);
}

function accentForCategory(category: string, index = 0) {
  const mapped: Record<string, string> = {
    national: GREEN,
    economy_banking: BLUE,
    reports_indices: PURPLE,
    science_technology: TEAL,
    space: TEAL,
    environment: ORANGE,
    international: INDIGO,
    appointments: RED,
    awards: PURPLE,
    sports: GREEN,
    defence: RED,
    books_authors: ORANGE,
    important_days: INDIGO,
    summits: BLUE,
    obituaries: MUTED,
    punjab: GREEN,
  };
  return mapped[category] ?? [GREEN, BLUE, PURPLE, TEAL, ORANGE, RED, INDIGO][index % 7]!;
}

function header(ctx: Ctx, payload: DailyMasterPackPayload, family: string) {
  setFont(ctx, family, 10.5, 700, INK);
  ctx.fillText("examtree", MX, TOP);
  ctx.textAlign = "right";
  setFont(ctx, family, 6.8, 700, MUTED);
  ctx.fillText(COPY[payload.language].header, W - MX, TOP);
  ctx.textAlign = "left";
  drawRule(ctx, TOP + 20);
}

function footer(ctx: Ctx, payload: DailyMasterPackPayload, family: string, page: number, totalPages: number | undefined, centre: string) {
  drawRule(ctx, H - 36);
  setFont(ctx, family, 6.3, 500, MUTED);
  ctx.fillText(pageDate(payload.contentDate, payload.language), MX, H - 20);
  ctx.textAlign = "center";
  ctx.fillText(centre, W / 2, H - 20);
  ctx.textAlign = "right";
  ctx.fillText(totalPages ? `${String(page).padStart(2, "0")} / ${String(totalPages).padStart(2, "0")}` : `${COPY[payload.language].page} ${page}`, W - MX, H - 20);
  ctx.textAlign = "left";
}

function beginPage(doc: InstanceType<typeof PDFDocument>, payload: DailyMasterPackPayload, family: string, page: number, totalPages: number | undefined, centre: string) {
  const ctx = doc.beginPage(W, H);
  ctx.fillStyle = WHITE;
  ctx.fillRect(0, 0, W, H);
  header(ctx, payload, family);
  footer(ctx, payload, family, page, totalPages, centre);
  return ctx;
}

function endPage(doc: InstanceType<typeof PDFDocument>) {
  doc.endPage();
}

function flattenStories(payload: DailyMasterPackPayload) {
  const stories: Story[] = [];
  let number = 1;
  for (const section of payload.sections) {
    for (const event of section.events) {
      stories.push({ event, number, sectionLabel: section.label, sectionCategory: section.category });
      number += 1;
    }
  }
  return stories;
}

function sourceAndExam(event: DailyMasterPackEvent) {
  const source = event.sources.find((item) => item.primary) ?? event.sources[0];
  const sourceName = source ? clean(source.name).replace(/^Press Information Bureau$/i, "PIB").replace(/^Reserve Bank of India$/i, "RBI") : "";
  return [sourceName, ...event.examFamilies.map((family) => clean(family).toUpperCase())].filter(Boolean).join(" · ");
}

function renderOverview(doc: InstanceType<typeof PDFDocument>, payload: DailyMasterPackPayload, family: string, totalPages: number | undefined, page: number) {
  const c = COPY[payload.language];
  const ctx = beginPage(doc, payload, family, page, totalPages, "Overview");
  setFont(ctx, family, 7.2, 700, BLUE);
  ctx.fillText(c.kicker, MX, 112);

  setFont(ctx, family, 24, 700, INK);
  ctx.fillText(c.hero[0], MX, 158);
  ctx.fillText(c.hero[1], MX, 188);
  setFont(ctx, family, 9.2, 400, MUTED);
  ctx.fillText(c.overview(payload.eventCount, payload.categoryCount), MX, 220);

  setFont(ctx, family, 6.6, 700, MUTED);
  ctx.fillText(c.inside, MX, 282);
  let y = 324;
  payload.sections.forEach((section, index) => {
    const accent = accentForCategory(section.category, index);
    setFont(ctx, family, 7.3, 700, accent);
    ctx.fillText(String(index + 1).padStart(2, "0"), MX, y);
    setFont(ctx, family, 11.4, 700, INK);
    ctx.fillText(section.label, MX + 35, y);
    ctx.textAlign = "right";
    setFont(ctx, family, 8.1, 600, MUTED);
    ctx.fillText(String(section.events.length), W - MX, y);
    ctx.textAlign = "left";
    drawRule(ctx, y + 17, MX + 35, W - MX);
    y += 47;
  });

  const guideY = Math.min(H - 132, Math.max(y + 35, 618));
  setFont(ctx, family, 6.6, 700, MUTED);
  ctx.fillText(c.readingGuide, MX, guideY);
  const guides: Array<[string, string, string]> = [
    [c.guideHeadline, c.guideHeadlineText, INK],
    [c.guideFacts, c.guideFactsText, MUTED],
    [c.guideRecall, c.guideRecallText, BLUE],
  ];
  guides.forEach(([label, text, color], index) => {
    const rowY = guideY + 28 + index * 19;
    setFont(ctx, family, 7.2, 700, color);
    ctx.fillText(label, MX, rowY);
    setFont(ctx, family, 7.2, 400, MUTED);
    ctx.fillText(text, MX + 55, rowY);
  });
  endPage(doc);
}

function sectionHeader(ctx: Ctx, payload: DailyMasterPackPayload, family: string, section: DailyMasterPackPayload["sections"][number], index: number, y: number, continued = false) {
  const accent = accentForCategory(section.category, index);
  setFont(ctx, family, 7.4, 700, accent);
  ctx.fillText(String(index + 1).padStart(2, "0"), MX, y);
  setFont(ctx, family, 15.5, 700, INK);
  const suffix = continued ? " ·" : "";
  ctx.fillText(`${section.label}${suffix}`, MX + 30, y);
  ctx.textAlign = "right";
  setFont(ctx, family, 7.2, 500, MUTED);
  ctx.fillText(COPY[payload.language].storyWord(section.events.length), W - MX, y);
  ctx.textAlign = "left";
  ctx.fillStyle = accent;
  ctx.fillRect(MX, y + 15, 64, 2);
  return y + 39;
}

function storyFactLine(payload: DailyMasterPackPayload, story: Story) {
  return visibleDailyMasterPackPdfFacts(story.event).slice(0, 3)
    .map((fact) => `${factLabel(payload.language, fact)}: ${clean(fact.value)}`)
    .join("  ·  ");
}

function measureStory(ctx: Ctx, payload: DailyMasterPackPayload, family: string, story: Story) {
  const x = MX + 30;
  const width = W - MX - x;
  setFont(ctx, family, 10.4, 700, INK);
  const title = clippedLines(ctx, story.event.title, width, 2);
  setFont(ctx, family, 8.1, 400, MUTED);
  const summary = clippedLines(ctx, story.event.summary, width, 3);
  const factText = storyFactLine(payload, story);
  let factLines: string[] = [];
  if (factText) {
    setFont(ctx, family, 7.2, 500, INK);
    factLines = clippedLines(ctx, factText, width - 54, 2);
  }
  setFont(ctx, family, 8.0, 700, INK);
  const takeaway = clippedLines(ctx, dailyMasterPackPdfTakeaway(story.event.oneLiner) || story.event.title, width - 12, 2);
  return 18 + title.length * 14 + 8 + summary.length * 11 + (factLines.length ? 12 + factLines.length * 10 : 0) + 10 + takeaway.length * 11 + 28;
}

function drawStory(ctx: Ctx, payload: DailyMasterPackPayload, family: string, story: Story, y: number, accent: string) {
  const x = MX + 30;
  const width = W - MX - x;
  setFont(ctx, family, 7.2, 700, MUTED);
  ctx.fillText(String(story.number).padStart(2, "0"), MX, y + 4);

  setFont(ctx, family, 10.4, 700, INK);
  const titleLines = clippedLines(ctx, story.event.title, width, 2);
  let cursor = drawTextLines(ctx, titleLines, x, y + 4, 14) + 7;

  setFont(ctx, family, 8.1, 400, MUTED);
  const summaryLines = clippedLines(ctx, story.event.summary, width, 3);
  cursor = drawTextLines(ctx, summaryLines, x, cursor, 11) + 7;

  const factText = storyFactLine(payload, story);
  if (factText) {
    setFont(ctx, family, 6.1, 700, accent);
    ctx.fillText(COPY[payload.language].facts, x, cursor + 1);
    setFont(ctx, family, 7.2, 500, INK);
    const factLines = clippedLines(ctx, factText, width - 57, 2);
    cursor = drawTextLines(ctx, factLines, x + 57, cursor + 1, 10) + 6;
  }

  ctx.fillStyle = accent;
  ctx.fillRect(x, cursor + 1, 3, 3);
  setFont(ctx, family, 8.0, 700, INK);
  const takeawayLines = clippedLines(ctx, dailyMasterPackPdfTakeaway(story.event.oneLiner) || story.event.title, width - 12, 2);
  cursor = drawTextLines(ctx, takeawayLines, x + 10, cursor + 5, 11) + 7;

  ctx.textAlign = "right";
  setFont(ctx, family, 6.0, 500, MUTED);
  const meta = sourceAndExam(story.event);
  ctx.fillText(meta, W - MX, cursor + 2);
  ctx.textAlign = "left";
  cursor += 17;
  drawRule(ctx, cursor, x, W - MX);
  return cursor + 18;
}

function renderSectionPages(doc: InstanceType<typeof PDFDocument>, payload: DailyMasterPackPayload, family: string, totalPages: number | undefined, startPage: number) {
  let page = startPage;
  let ctx: Ctx | null = null;
  let y = 0;
  let currentCentre = "";

  const openPage = (centre: string) => {
    if (ctx) endPage(doc);
    page += 1;
    currentCentre = centre;
    ctx = beginPage(doc, payload, family, page, totalPages, centre);
    y = 91;
  };

  payload.sections.forEach((section, sectionIndex) => {
    const stories = section.events.map((event) => {
      const flattened = flattenStories(payload).find((story) => story.event.id === event.id)!;
      return flattened;
    });
    const accent = accentForCategory(section.category, sectionIndex);
    if (!ctx) openPage(section.label);
    if (y > 650) openPage(section.label);
    y = sectionHeader(ctx!, payload, family, section, sectionIndex, y);

    stories.forEach((story, storyIndex) => {
      const needed = measureStory(ctx!, payload, family, story);
      if (y + needed > H - 66) {
        openPage(section.label);
        y = sectionHeader(ctx!, payload, family, section, sectionIndex, y, storyIndex > 0);
      }
      y = drawStory(ctx!, payload, family, story, y, accent);
    });
    y += 20;
  });

  if (ctx) endPage(doc);
  void currentCentre;
  return page;
}

function rapidSectionHeight(ctx: Ctx, payload: DailyMasterPackPayload, family: string, section: DailyMasterPackPayload["sections"][number]) {
  let height = 35;
  for (const event of section.events) {
    setFont(ctx, family, 8.3, 700, INK);
    const lines = clippedLines(ctx, dailyMasterPackPdfTakeaway(event.oneLiner) || event.title, CW - 48, 2);
    height += lines.length * 11 + 11;
  }
  return height + 15;
}

function drawRapidSection(ctx: Ctx, payload: DailyMasterPackPayload, family: string, section: DailyMasterPackPayload["sections"][number], sectionIndex: number, y: number) {
  const accent = accentForCategory(section.category, sectionIndex);
  setFont(ctx, family, 7.2, 700, accent);
  ctx.fillText(String(sectionIndex + 1).padStart(2, "0"), MX, y);
  setFont(ctx, family, 10.5, 700, INK);
  ctx.fillText(section.label, MX + 30, y);
  let cursor = y + 29;
  for (const event of section.events) {
    ctx.fillStyle = accent;
    ctx.fillRect(MX + 30, cursor - 3, 3, 3);
    setFont(ctx, family, 8.3, 700, INK);
    const lines = clippedLines(ctx, dailyMasterPackPdfTakeaway(event.oneLiner) || event.title, CW - 48, 2);
    cursor = drawTextLines(ctx, lines, MX + 47, cursor, 11) + 10;
  }
  drawRule(ctx, cursor, MX + 30, W - MX);
  return cursor + 24;
}

function renderRapidPages(doc: InstanceType<typeof PDFDocument>, payload: DailyMasterPackPayload, family: string, totalPages: number | undefined, startPage: number) {
  const c = COPY[payload.language];
  let page = startPage;
  let ctx: Ctx | null = null;
  let y = 0;
  let rapidPage = 0;

  const openPage = () => {
    if (ctx) endPage(doc);
    page += 1;
    rapidPage += 1;
    ctx = beginPage(doc, payload, family, page, totalPages, c.rapid);
    setFont(ctx, family, 7.1, 700, BLUE);
    ctx.fillText(c.rapid, MX, 108);
    setFont(ctx, family, 21, 700, INK);
    ctx.fillText(c.rapidHero, MX, 146);
    setFont(ctx, family, 8.6, 400, MUTED);
    ctx.fillText(rapidPage === 1 ? c.rapidSub : `${pageDate(payload.contentDate, payload.language)} · ${rapidPage}`, MX, 172);
    y = 222;
  };

  openPage();
  payload.sections.forEach((section, sectionIndex) => {
    const needed = rapidSectionHeight(ctx!, payload, family, section);
    if (y + needed > H - 72) openPage();
    y = drawRapidSection(ctx!, payload, family, section, sectionIndex, y);
  });
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
  const doc = new PDFDocument({
    title: `Examtree Daily Current Affairs - ${payload.contentDate}`,
    author: "Examtree",
    subject: "Daily Current Affairs",
    creator: "Examtree Current Affairs Studio",
  });
  let page = 1;
  renderOverview(doc, payload, family, totalPages, page);
  page = renderSectionPages(doc, payload, family, totalPages, page);
  page = renderRapidPages(doc, payload, family, totalPages, page);
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
