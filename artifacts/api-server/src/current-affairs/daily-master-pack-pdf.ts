import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { DailyMasterPackEvent, DailyMasterPackLanguage, DailyMasterPackPayload } from "./daily-master-pack";

const nativeRequire = createRequire(import.meta.url);
const { PDFDocument, GlobalFonts } = nativeRequire("@napi-rs/canvas") as typeof import("@napi-rs/canvas");

const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;
const MARGIN_X = 46;
const MARGIN_TOP = 46;
const MARGIN_BOTTOM = 46;
const CONTENT_WIDTH = A4_WIDTH - MARGIN_X * 2;
const BODY_LINE = 15;
const SMALL_LINE = 12;
const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url));

const PDF_COPY = {
  en: {
    locale: "en-IN",
    title: "Examtree Daily Current Affairs",
    header: "EXAMTREE - DAILY CURRENT AFFAIRS",
    count: (events: number, sections: number) => `${events} verified, authoring-ready, exam-relevant developments across ${sections} sections`,
    why: "WHY IN NEWS",
    facts: "KEY FACTS",
    remember: "REMEMBER",
    exam: "Exam relevance",
    evidence: "EVIDENCE",
    primary: "Primary",
    supporting: "Supporting",
    footer: "Draft only - editorial approval required before distribution.",
    provenance: "This PDF is rendered directly from the same canonical Daily Master Pack used for Examtree text/web output. It performs no independent research or rewriting.",
  },
  hi: {
    locale: "hi-IN",
    title: "Examtree दैनिक करेंट अफेयर्स",
    header: "EXAMTREE - दैनिक करेंट अफेयर्स",
    count: (events: number, sections: number) => `${events} सत्यापित, परीक्षा-प्रासंगिक घटनाक्रम · ${sections} खंड`,
    why: "समाचार में क्यों",
    facts: "मुख्य तथ्य",
    remember: "याद रखें",
    exam: "परीक्षा प्रासंगिकता",
    evidence: "साक्ष्य",
    primary: "प्राथमिक",
    supporting: "सहायक",
    footer: "केवल ड्राफ्ट - वितरण से पहले संपादकीय स्वीकृति आवश्यक है।",
    provenance: "यह PDF उसी कैनोनिकल Daily Master Pack से सीधे रेंडर किया गया है जो Examtree के text/web output में उपयोग होता है। इसमें स्वतंत्र शोध या पुनर्लेखन नहीं किया जाता।",
  },
  pa: {
    locale: "pa-IN",
    title: "Examtree ਰੋਜ਼ਾਨਾ ਕਰੰਟ ਅਫੇਅਰਜ਼",
    header: "EXAMTREE - ਰੋਜ਼ਾਨਾ ਕਰੰਟ ਅਫੇਅਰਜ਼",
    count: (events: number, sections: number) => `${events} ਪ੍ਰਮਾਣਿਤ, ਪ੍ਰੀਖਿਆ-ਸੰਬੰਧਿਤ ਘਟਨਾਵਾਂ · ${sections} ਭਾਗ`,
    why: "ਖ਼ਬਰਾਂ ਵਿੱਚ ਕਿਉਂ",
    facts: "ਮੁੱਖ ਤੱਥ",
    remember: "ਯਾਦ ਰੱਖੋ",
    exam: "ਪ੍ਰੀਖਿਆ ਸੰਬੰਧਤਾ",
    evidence: "ਸਬੂਤ",
    primary: "ਮੁੱਖ ਸਰੋਤ",
    supporting: "ਸਹਾਇਕ",
    footer: "ਕੇਵਲ ਡਰਾਫਟ - ਵੰਡ ਤੋਂ ਪਹਿਲਾਂ ਸੰਪਾਦਕੀ ਮਨਜ਼ੂਰੀ ਲੋੜੀਂਦੀ ਹੈ।",
    provenance: "ਇਹ PDF ਉਸੇ ਕੈਨੋਨਿਕਲ Daily Master Pack ਤੋਂ ਸਿੱਧਾ ਰੈਂਡਰ ਹੁੰਦਾ ਹੈ ਜੋ Examtree ਦੇ text/web output ਲਈ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ। ਇਹ ਕੋਈ ਵੱਖਰੀ ਖੋਜ ਜਾਂ ਮੁੜ-ਲਿਖਤ ਨਹੀਂ ਕਰਦਾ।",
  },
} satisfies Record<DailyMasterPackLanguage, {
  locale: string;
  title: string;
  header: string;
  count: (events: number, sections: number) => string;
  why: string;
  facts: string;
  remember: string;
  exam: string;
  evidence: string;
  primary: string;
  supporting: string;
  footer: string;
  provenance: string;
}>;

const LANGUAGE_FONTS = {
  hi: {
    alias: "ExamtreeDevanagari",
    family: "Noto Sans Devanagari",
    fileName: "NotoSansDevanagari.ttf",
    expectedSize: 647144,
    expectedGitBlobSha1: "e703d5282088c4b7787b1a4c5f057cf18f0998d6",
  },
  pa: {
    alias: "ExamtreeGurmukhi",
    family: "Noto Sans Gurmukhi",
    fileName: "NotoSansGurmukhi.ttf",
    expectedSize: 268608,
    expectedGitBlobSha1: "49878eb913077538cc8973dcf4ad7c51f3e5fb22",
  },
} as const;

export type DailyMasterPackPdfRenderResult = {
  buffer: Buffer;
  pageCount: number;
  eventCount: number;
  contentDate: string;
  language: DailyMasterPackLanguage;
  fontFamily: string;
};

type PdfContext = any;
type RendererState = {
  doc: InstanceType<typeof PDFDocument>;
  ctx: PdfContext;
  y: number;
  page: number;
  payload: DailyMasterPackPayload;
  fontFamily: string;
};

type CmapSubtable = { format: 4 | 12; offset: number; length: number };

const registeredFontPaths = new Set<string>();
const verifiedFontBuffers = new Map<string, Buffer>();

function clean(value: unknown) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

export function visibleDailyMasterPackPdfFacts(event: Pick<DailyMasterPackEvent, "facts">) {
  // CP-049: `official_action` remains an internal verification/authoring fact,
  // but the learner PDF should state the action naturally in Why in News rather
  // than repeat a mechanical "Action:" row under Key Facts.
  return event.facts.filter((fact) => clean(fact.key).toLowerCase() !== "official_action");
}

function dateLabel(date: string, language: DailyMasterPackLanguage) {
  return new Intl.DateTimeFormat(PDF_COPY[language].locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

function gitBlobSha1(buffer: Buffer) {
  return createHash("sha1")
    .update(Buffer.from(`blob ${buffer.length}\0`, "utf8"))
    .update(buffer)
    .digest("hex");
}

function fontDirectoryCandidates() {
  return [
    process.env.CURRENT_AFFAIRS_FONT_DIR,
    path.join(MODULE_DIR, "current-affairs-fonts"),
    path.resolve(MODULE_DIR, "../../.runtime-assets/current-affairs-fonts"),
    path.resolve(process.cwd(), "artifacts/api-server/.runtime-assets/current-affairs-fonts"),
    path.resolve(process.cwd(), ".runtime-assets/current-affairs-fonts"),
  ].filter((item): item is string => Boolean(item));
}

function resolveLanguageFont(language: Exclude<DailyMasterPackLanguage, "en">) {
  const descriptor = LANGUAGE_FONTS[language];
  for (const directory of fontDirectoryCandidates()) {
    const candidate = path.join(directory, descriptor.fileName);
    if (!existsSync(candidate)) continue;
    let buffer = verifiedFontBuffers.get(candidate);
    if (!buffer) {
      buffer = readFileSync(candidate);
      if (buffer.length !== descriptor.expectedSize) {
        throw new Error(`${descriptor.family} runtime font size mismatch: expected ${descriptor.expectedSize}, got ${buffer.length}`);
      }
      const actualGitBlobSha1 = gitBlobSha1(buffer);
      if (actualGitBlobSha1 !== descriptor.expectedGitBlobSha1) {
        throw new Error(`${descriptor.family} runtime font checksum mismatch`);
      }
      verifiedFontBuffers.set(candidate, buffer);
    }
    if (!registeredFontPaths.has(candidate)) {
      const registered = GlobalFonts.registerFromPath(candidate, descriptor.alias);
      if (!registered) throw new Error(`${descriptor.family} could not be registered with the PDF renderer`);
      registeredFontPaths.add(candidate);
    }
    return { ...descriptor, path: candidate, buffer };
  }
  throw new Error(`${descriptor.family} runtime font is unavailable. Run the verified Current Affairs font bootstrap before rendering localized PDFs.`);
}

function readUInt16(buffer: Buffer, offset: number) {
  if (offset < 0 || offset + 2 > buffer.length) throw new Error("Invalid font table offset");
  return buffer.readUInt16BE(offset);
}

function readUInt32(buffer: Buffer, offset: number) {
  if (offset < 0 || offset + 4 > buffer.length) throw new Error("Invalid font table offset");
  return buffer.readUInt32BE(offset);
}

function cmapSubtables(buffer: Buffer): CmapSubtable[] {
  if (buffer.length < 12) throw new Error("Font file is too small to contain a TrueType offset table");
  const numTables = readUInt16(buffer, 4);
  let cmapOffset = -1;
  let cmapLength = 0;
  for (let index = 0; index < numTables; index += 1) {
    const record = 12 + index * 16;
    if (record + 16 > buffer.length) break;
    const tag = buffer.toString("ascii", record, record + 4);
    if (tag !== "cmap") continue;
    cmapOffset = readUInt32(buffer, record + 8);
    cmapLength = readUInt32(buffer, record + 12);
    break;
  }
  if (cmapOffset < 0 || cmapOffset + cmapLength > buffer.length) throw new Error("Font cmap table is missing or invalid");
  const numSubtables = readUInt16(buffer, cmapOffset + 2);
  const result: CmapSubtable[] = [];
  for (let index = 0; index < numSubtables; index += 1) {
    const record = cmapOffset + 4 + index * 8;
    if (record + 8 > cmapOffset + cmapLength) break;
    const relativeOffset = readUInt32(buffer, record + 4);
    const offset = cmapOffset + relativeOffset;
    if (offset + 2 > buffer.length) continue;
    const format = readUInt16(buffer, offset);
    if (format === 12) {
      const length = readUInt32(buffer, offset + 4);
      if (length >= 16 && offset + length <= buffer.length) result.push({ format: 12, offset, length });
    } else if (format === 4) {
      const length = readUInt16(buffer, offset + 2);
      if (length >= 16 && offset + length <= buffer.length) result.push({ format: 4, offset, length });
    }
  }
  return result.sort((a, b) => b.format - a.format);
}

function format12Supports(buffer: Buffer, subtable: CmapSubtable, codePoint: number) {
  const groups = readUInt32(buffer, subtable.offset + 12);
  let low = 0;
  let high = groups - 1;
  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    const group = subtable.offset + 16 + middle * 12;
    if (group + 12 > subtable.offset + subtable.length) return false;
    const start = readUInt32(buffer, group);
    const end = readUInt32(buffer, group + 4);
    if (codePoint < start) high = middle - 1;
    else if (codePoint > end) low = middle + 1;
    else return readUInt32(buffer, group + 8) + (codePoint - start) !== 0;
  }
  return false;
}

function format4Supports(buffer: Buffer, subtable: CmapSubtable, codePoint: number) {
  if (codePoint > 0xffff) return false;
  const segCount = readUInt16(buffer, subtable.offset + 6) / 2;
  const endCodeOffset = subtable.offset + 14;
  const startCodeOffset = endCodeOffset + segCount * 2 + 2;
  const idDeltaOffset = startCodeOffset + segCount * 2;
  const idRangeOffsetOffset = idDeltaOffset + segCount * 2;
  for (let index = 0; index < segCount; index += 1) {
    const end = readUInt16(buffer, endCodeOffset + index * 2);
    if (codePoint > end) continue;
    const start = readUInt16(buffer, startCodeOffset + index * 2);
    if (codePoint < start) return false;
    const delta = readUInt16(buffer, idDeltaOffset + index * 2);
    const rangeOffsetAddress = idRangeOffsetOffset + index * 2;
    const rangeOffset = readUInt16(buffer, rangeOffsetAddress);
    if (rangeOffset === 0) return ((codePoint + delta) & 0xffff) !== 0;
    const glyphAddress = rangeOffsetAddress + rangeOffset + (codePoint - start) * 2;
    if (glyphAddress + 2 > subtable.offset + subtable.length) return false;
    const glyph = readUInt16(buffer, glyphAddress);
    return glyph !== 0 && ((glyph + delta) & 0xffff) !== 0;
  }
  return false;
}

function fontSupportsCodePoint(buffer: Buffer, codePoint: number) {
  for (const subtable of cmapSubtables(buffer)) {
    if (subtable.format === 12 && format12Supports(buffer, subtable, codePoint)) return true;
    if (subtable.format === 4 && format4Supports(buffer, subtable, codePoint)) return true;
  }
  return false;
}

function relevantScriptCodePoints(payload: DailyMasterPackPayload) {
  if (payload.language === "en") return [];
  const text = [
    PDF_COPY[payload.language].title,
    PDF_COPY[payload.language].header,
    PDF_COPY[payload.language].why,
    PDF_COPY[payload.language].facts,
    PDF_COPY[payload.language].remember,
    PDF_COPY[payload.language].exam,
    PDF_COPY[payload.language].evidence,
    PDF_COPY[payload.language].footer,
    PDF_COPY[payload.language].provenance,
    ...payload.sections.flatMap((section) => [
      section.label,
      ...section.events.flatMap((event) => [
        event.title,
        event.summary,
        event.oneLiner,
        ...visibleDailyMasterPackPdfFacts(event).flatMap((fact) => [fact.label ?? "", fact.value]),
        ...event.sources.map((source) => source.name),
      ]),
    ]),
  ].join(" ");
  const unique = new Set<number>();
  for (const character of Array.from(text)) {
    const codePoint = character.codePointAt(0)!;
    const relevant = payload.language === "hi"
      ? (codePoint >= 0x0900 && codePoint <= 0x097f) || (codePoint >= 0xa8e0 && codePoint <= 0xa8ff)
      : codePoint >= 0x0a00 && codePoint <= 0x0a7f;
    if (relevant) unique.add(codePoint);
  }
  return [...unique].sort((a, b) => a - b);
}

export function assertDailyMasterPackPdfFontCoverage(payload: DailyMasterPackPayload) {
  if (payload.language === "en") return { language: "en" as const, fontFamily: "sans-serif", checkedCodePoints: 0 };
  const font = resolveLanguageFont(payload.language);
  const required = relevantScriptCodePoints(payload);
  const missing = required.filter((codePoint) => !fontSupportsCodePoint(font.buffer, codePoint));
  if (missing.length > 0) {
    throw new Error(`${font.family} is missing required ${payload.language} glyphs: ${missing.slice(0, 12).map((codePoint) => `U+${codePoint.toString(16).toUpperCase().padStart(4, "0")}`).join(", ")}`);
  }
  return { language: payload.language, fontFamily: font.alias, checkedCodePoints: required.length };
}

function fontCss(fontFamily: string, size: number, weight = 400) {
  return `${weight} ${size}px ${fontFamily}${fontFamily === "sans-serif" ? "" : ", sans-serif"}`;
}

function wrapText(ctx: PdfContext, value: string, maxWidth: number): string[] {
  const text = clean(value);
  if (!text) return [];
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (!line || ctx.measureText(candidate).width <= maxWidth) {
      line = candidate;
      continue;
    }
    lines.push(line);
    line = word;
  }
  if (line) lines.push(line);
  return lines;
}

function drawPageHeader(state: RendererState) {
  const { ctx, payload, page, fontFamily } = state;
  const copy = PDF_COPY[payload.language];
  ctx.save();
  ctx.fillStyle = "#111111";
  ctx.font = fontCss(fontFamily, 9, 600);
  ctx.fillText(copy.header, MARGIN_X, 25);
  ctx.font = fontCss(fontFamily, 9);
  ctx.textAlign = "right";
  ctx.fillText(`${dateLabel(payload.contentDate, payload.language)}  |  ${page}`, A4_WIDTH - MARGIN_X, 25);
  ctx.textAlign = "left";
  ctx.strokeStyle = "#c7c7c7";
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  ctx.moveTo(MARGIN_X, 32);
  ctx.lineTo(A4_WIDTH - MARGIN_X, 32);
  ctx.stroke();
  ctx.restore();
}

function drawPageFooter(state: RendererState) {
  const { ctx, payload, fontFamily } = state;
  ctx.save();
  ctx.strokeStyle = "#d0d0d0";
  ctx.lineWidth = 0.6;
  ctx.beginPath();
  ctx.moveTo(MARGIN_X, A4_HEIGHT - 32);
  ctx.lineTo(A4_WIDTH - MARGIN_X, A4_HEIGHT - 32);
  ctx.stroke();
  ctx.fillStyle = "#555555";
  ctx.font = fontCss(fontFamily, 8);
  ctx.fillText(PDF_COPY[payload.language].footer, MARGIN_X, A4_HEIGHT - 18);
  ctx.restore();
}

function beginPage(state: Omit<RendererState, "ctx" | "y" | "page"> & { page?: number }): RendererState {
  const page = (state.page ?? 0) + 1;
  const ctx = state.doc.beginPage(A4_WIDTH, A4_HEIGHT);
  const next: RendererState = { ...state, ctx, y: MARGIN_TOP, page };
  drawPageHeader(next);
  return next;
}

function endPage(state: RendererState) {
  drawPageFooter(state);
  state.doc.endPage();
}

function ensureSpace(state: RendererState, required: number): RendererState {
  if (state.y + required <= A4_HEIGHT - MARGIN_BOTTOM) return state;
  endPage(state);
  return beginPage({ doc: state.doc, payload: state.payload, fontFamily: state.fontFamily, page: state.page });
}

function drawWrapped(state: RendererState, value: string, options: {
  size?: number;
  weight?: number;
  lineHeight?: number;
  indent?: number;
  maxWidth?: number;
  gapAfter?: number;
  fillStyle?: string;
} = {}): RendererState {
  const size = options.size ?? 11;
  const weight = options.weight ?? 400;
  const lineHeight = options.lineHeight ?? BODY_LINE;
  const indent = options.indent ?? 0;
  const maxWidth = options.maxWidth ?? CONTENT_WIDTH - indent;
  const font = fontCss(state.fontFamily, size, weight);
  state.ctx.font = font;
  const lines = wrapText(state.ctx, value, maxWidth);
  if (lines.length === 0) return state;
  for (const line of lines) {
    state = ensureSpace(state, lineHeight + 2);
    state.ctx.font = font;
    state.ctx.fillStyle = options.fillStyle ?? "#202020";
    state.ctx.fillText(line, MARGIN_X + indent, state.y);
    state.y += lineHeight;
  }
  state.y += options.gapAfter ?? 0;
  return state;
}

function drawRule(state: RendererState, gapBefore = 4, gapAfter = 8): RendererState {
  state = ensureSpace(state, gapBefore + gapAfter + 2);
  state.y += gapBefore;
  state.ctx.save();
  state.ctx.strokeStyle = "#d4d4d4";
  state.ctx.lineWidth = 0.6;
  state.ctx.beginPath();
  state.ctx.moveTo(MARGIN_X, state.y);
  state.ctx.lineTo(A4_WIDTH - MARGIN_X, state.y);
  state.ctx.stroke();
  state.ctx.restore();
  state.y += gapAfter;
  return state;
}

function drawLabel(state: RendererState, label: string): RendererState {
  return drawWrapped(state, label, { size: 9, weight: 600, lineHeight: 12, gapAfter: 2, fillStyle: "#333333" });
}

function drawEvent(state: RendererState, event: DailyMasterPackEvent, ordinal: number): RendererState {
  const copy = PDF_COPY[state.payload.language];
  state = ensureSpace(state, 54);
  state = drawWrapped(state, `${ordinal}. ${event.title}`, { size: 13, weight: 600, lineHeight: 17, gapAfter: 6, fillStyle: "#111111" });

  if (clean(event.summary)) {
    state = drawLabel(state, copy.why);
    state = drawWrapped(state, event.summary, { gapAfter: 7 });
  }

  const visibleFacts = visibleDailyMasterPackPdfFacts(event);
  if (visibleFacts.length > 0) {
    state = drawLabel(state, copy.facts);
    for (const fact of visibleFacts.slice(0, 12)) {
      const key = clean(fact.label) || clean(fact.key).replace(/_/g, " ");
      const value = clean(fact.value);
      if (!key || !value) continue;
      state = drawWrapped(state, `• ${key}: ${value}`, { indent: 8, maxWidth: CONTENT_WIDTH - 8, gapAfter: 2 });
    }
    state.y += 3;
  }

  if (clean(event.oneLiner)) {
    state = drawLabel(state, copy.remember);
    state = drawWrapped(state, event.oneLiner, { size: 10.5, weight: 600, lineHeight: 14, gapAfter: 7 });
  }

  if (event.examFamilies.length > 0) {
    state = drawWrapped(state, `${copy.exam}: ${event.examFamilies.map((item) => clean(item).toUpperCase()).filter(Boolean).join(" | ")}`, { size: 9, lineHeight: SMALL_LINE, gapAfter: 5, fillStyle: "#444444" });
  }

  if (event.sources.length > 0) {
    state = drawLabel(state, copy.evidence);
    for (const source of event.sources.slice(0, 4)) {
      const name = clean(source.name);
      const url = clean(source.url);
      if (!name || !url) continue;
      state = drawWrapped(state, `${source.primary ? copy.primary : copy.supporting}: ${name} - ${url}`, { size: 9, lineHeight: SMALL_LINE, indent: 8, maxWidth: CONTENT_WIDTH - 8, gapAfter: 2, fillStyle: "#4a4a4a" });
    }
  }

  return drawRule(state, 5, 10);
}

export function assertDailyMasterPackPdfPayload(value: unknown): DailyMasterPackPayload {
  if (!value || typeof value !== "object") throw new Error("Daily master pack payload is missing");
  const payload = value as Partial<DailyMasterPackPayload>;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(payload.contentDate ?? ""))) {
    throw new Error("Daily master pack payload has an invalid content date");
  }
  if (!(["en", "hi", "pa"] as const).includes(payload.language as DailyMasterPackLanguage)) {
    throw new Error("Daily master pack PDF language must be en, hi or pa");
  }
  if (!Array.isArray(payload.sections)) throw new Error("Daily master pack payload has no sections");
  return payload as DailyMasterPackPayload;
}

export function renderDailyMasterPackPdf(input: unknown): DailyMasterPackPdfRenderResult {
  const payload = assertDailyMasterPackPdfPayload(input);
  const coverage = assertDailyMasterPackPdfFontCoverage(payload);
  const fontFamily = coverage.fontFamily;
  const copy = PDF_COPY[payload.language];
  const doc = new PDFDocument({
    title: `${copy.title} - ${payload.contentDate}`,
    author: "Examtree",
    subject: "Daily Current Affairs",
    creator: "Examtree Current Affairs Studio",
  });
  let state = beginPage({ doc, payload, fontFamily });

  state = drawWrapped(state, copy.title, { size: 22, weight: 700, lineHeight: 27, gapAfter: 4, fillStyle: "#111111" });
  state = drawWrapped(state, dateLabel(payload.contentDate, payload.language), { size: 14, weight: 600, lineHeight: 18, gapAfter: 5 });
  state = drawWrapped(state, copy.count(payload.eventCount, payload.categoryCount), { size: 10, lineHeight: 14, gapAfter: 12, fillStyle: "#444444" });
  state = drawRule(state, 0, 12);

  let ordinal = 1;
  for (const section of payload.sections) {
    const events = Array.isArray(section.events) ? section.events : [];
    if (events.length === 0) continue;
    state = ensureSpace(state, 42);
    state = drawWrapped(state, clean(section.label), { size: 14, weight: 700, lineHeight: 18, gapAfter: 9, fillStyle: "#111111" });
    for (const event of events) {
      state = drawEvent(state, event, ordinal);
      ordinal += 1;
    }
  }

  state = drawWrapped(state, copy.provenance, { size: 8.5, lineHeight: 12, gapAfter: 4, fillStyle: "#555555" });
  endPage(state);
  const buffer = doc.close();

  return {
    buffer,
    pageCount: state.page,
    eventCount: payload.eventCount,
    contentDate: payload.contentDate,
    language: payload.language,
    fontFamily,
  };
}