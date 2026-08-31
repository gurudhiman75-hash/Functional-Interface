import { createRequire } from "node:module";

import type { DailyMasterPackEvent, DailyMasterPackPayload } from "./daily-master-pack";

const nativeRequire = createRequire(import.meta.url);
const { PDFDocument } = nativeRequire("@napi-rs/canvas") as typeof import("@napi-rs/canvas");

const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;
const MARGIN_X = 46;
const MARGIN_TOP = 46;
const MARGIN_BOTTOM = 46;
const CONTENT_WIDTH = A4_WIDTH - MARGIN_X * 2;
const BODY_FONT = "11px sans-serif";
const BODY_LINE = 15;
const SMALL_FONT = "9px sans-serif";
const SMALL_LINE = 12;

export type DailyMasterPackPdfRenderResult = {
  buffer: Buffer;
  pageCount: number;
  eventCount: number;
  contentDate: string;
};

type PdfContext = any;

type RendererState = {
  doc: InstanceType<typeof PDFDocument>;
  ctx: PdfContext;
  y: number;
  page: number;
  payload: DailyMasterPackPayload;
};

function clean(value: unknown) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function dateLabel(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
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
  const { ctx, payload, page } = state;
  ctx.save();
  ctx.fillStyle = "#111111";
  ctx.font = "600 9px sans-serif";
  ctx.fillText("EXAMTREE - DAILY CURRENT AFFAIRS", MARGIN_X, 25);
  ctx.font = "9px sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(`${dateLabel(payload.contentDate)}  |  Page ${page}`, A4_WIDTH - MARGIN_X, 25);
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
  const { ctx } = state;
  ctx.save();
  ctx.strokeStyle = "#d0d0d0";
  ctx.lineWidth = 0.6;
  ctx.beginPath();
  ctx.moveTo(MARGIN_X, A4_HEIGHT - 32);
  ctx.lineTo(A4_WIDTH - MARGIN_X, A4_HEIGHT - 32);
  ctx.stroke();
  ctx.fillStyle = "#555555";
  ctx.font = "8px sans-serif";
  ctx.fillText("Draft only - editorial approval required before distribution.", MARGIN_X, A4_HEIGHT - 18);
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
  return beginPage({ doc: state.doc, payload: state.payload, page: state.page });
}

function drawWrapped(state: RendererState, value: string, options: {
  font?: string;
  lineHeight?: number;
  indent?: number;
  maxWidth?: number;
  gapAfter?: number;
  fillStyle?: string;
} = {}): RendererState {
  const font = options.font ?? BODY_FONT;
  const lineHeight = options.lineHeight ?? BODY_LINE;
  const indent = options.indent ?? 0;
  const maxWidth = options.maxWidth ?? CONTENT_WIDTH - indent;
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
  return drawWrapped(state, label, {
    font: "600 9px sans-serif",
    lineHeight: 12,
    gapAfter: 2,
    fillStyle: "#333333",
  });
}

function drawEvent(state: RendererState, event: DailyMasterPackEvent, ordinal: number): RendererState {
  state = ensureSpace(state, 54);
  state = drawWrapped(state, `${ordinal}. ${event.title}`, {
    font: "600 13px sans-serif",
    lineHeight: 17,
    gapAfter: 6,
    fillStyle: "#111111",
  });

  if (clean(event.summary)) {
    state = drawLabel(state, "WHY IN NEWS");
    state = drawWrapped(state, event.summary, { gapAfter: 7 });
  }

  if (event.facts.length > 0) {
    state = drawLabel(state, "KEY FACTS");
    for (const fact of event.facts.slice(0, 12)) {
      const key = clean(fact.key).replace(/_/g, " ");
      const value = clean(fact.value);
      if (!key || !value) continue;
      state = drawWrapped(state, `• ${key}: ${value}`, {
        indent: 8,
        maxWidth: CONTENT_WIDTH - 8,
        gapAfter: 2,
      });
    }
    state.y += 3;
  }

  if (clean(event.oneLiner)) {
    state = drawLabel(state, "REMEMBER");
    state = drawWrapped(state, event.oneLiner, {
      font: "600 10.5px sans-serif",
      lineHeight: 14,
      gapAfter: 7,
    });
  }

  if (event.examFamilies.length > 0) {
    state = drawWrapped(state, `Exam relevance: ${event.examFamilies.map((item) => clean(item).toUpperCase()).filter(Boolean).join(" | ")}`, {
      font: SMALL_FONT,
      lineHeight: SMALL_LINE,
      gapAfter: 5,
      fillStyle: "#444444",
    });
  }

  if (event.sources.length > 0) {
    state = drawLabel(state, "EVIDENCE");
    for (const source of event.sources.slice(0, 4)) {
      const name = clean(source.name);
      const url = clean(source.url);
      if (!name || !url) continue;
      state = drawWrapped(state, `${source.primary ? "Primary" : "Supporting"}: ${name} - ${url}`, {
        font: SMALL_FONT,
        lineHeight: SMALL_LINE,
        indent: 8,
        maxWidth: CONTENT_WIDTH - 8,
        gapAfter: 2,
        fillStyle: "#4a4a4a",
      });
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
  if (payload.language !== "en") throw new Error("CP-038 PDF rendering currently supports the canonical English master pack only");
  if (!Array.isArray(payload.sections)) throw new Error("Daily master pack payload has no sections");
  return payload as DailyMasterPackPayload;
}

export function renderDailyMasterPackPdf(input: unknown): DailyMasterPackPdfRenderResult {
  const payload = assertDailyMasterPackPdfPayload(input);
  const doc = new PDFDocument({
    title: `Examtree Daily Current Affairs - ${payload.contentDate}`,
    author: "Examtree",
    subject: "Daily Current Affairs",
    creator: "Examtree Current Affairs Studio",
  });
  let state = beginPage({ doc, payload });

  state = drawWrapped(state, "Examtree Daily Current Affairs", {
    font: "700 22px sans-serif",
    lineHeight: 27,
    gapAfter: 4,
    fillStyle: "#111111",
  });
  state = drawWrapped(state, dateLabel(payload.contentDate), {
    font: "600 14px sans-serif",
    lineHeight: 18,
    gapAfter: 5,
  });
  state = drawWrapped(state, `${payload.eventCount} verified, authoring-ready, exam-relevant developments across ${payload.categoryCount} sections`, {
    font: "10px sans-serif",
    lineHeight: 14,
    gapAfter: 12,
    fillStyle: "#444444",
  });
  state = drawRule(state, 0, 12);

  let ordinal = 1;
  for (const section of payload.sections) {
    const events = Array.isArray(section.events) ? section.events : [];
    if (events.length === 0) continue;
    state = ensureSpace(state, 42);
    state = drawWrapped(state, clean(section.label).toUpperCase(), {
      font: "700 14px sans-serif",
      lineHeight: 18,
      gapAfter: 9,
      fillStyle: "#111111",
    });
    for (const event of events) {
      state = drawEvent(state, event, ordinal);
      ordinal += 1;
    }
  }

  state = drawWrapped(state, "This PDF is rendered directly from the same canonical Daily Master Pack used for Examtree text/web output. It performs no independent research or rewriting.", {
    font: "8.5px sans-serif",
    lineHeight: 12,
    gapAfter: 4,
    fillStyle: "#555555",
  });
  endPage(state);
  const buffer = doc.close();

  return {
    buffer,
    pageCount: state.page,
    eventCount: payload.eventCount,
    contentDate: payload.contentDate,
  };
}
