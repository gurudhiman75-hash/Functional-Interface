import {
  generatePfcTpfSourceSaturatedEnglishReviewV1_4_1,
} from "./paper-folding-source-saturated-english-review-v1-4-1";
import {
  PFC_TPF_REVIEW_V1_5_MIN_PATTERN_DISTANCE,
  PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_5,
  minimumPatternOptionDistanceV1_5,
  renderPfcTpfSourceSaturatedEnglishReviewHtmlV1_5,
} from "./paper-folding-source-saturated-english-review-v1-5";
import type { PfcTpfEnglishReviewQuestionV1 } from "./paper-folding-source-saturated-english-review-v1";

export const PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_5_1 = Object.freeze({
  ...PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_5,
  authorityId: "PFC-TPF-SOURCE-SATURATED-ENGLISH-REVIEW-V1.5.1" as const,
  supersedesReviewCandidate: PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_5.authorityId,
  distractorRemediationV1_5_1: [
    "WHOLE_WRONG_OPTION_FAMILY_SPREAD",
    "DOUBLE_FOLD_TRIANGLE_LAYER_COUNT_AND_AXIS_ERRORS",
    "WRONG_LAYER_COUNT_RETAINED_AS_DISTINCT_ERROR",
    "WRONG_SYMMETRY_DISTANCE_RETAINED_AS_DISTINCT_ERROR",
    "NO_MARK_DELETION_FALLBACK_COLLAPSE",
    "CORRECT_OPTION_IMMUTABLE",
  ] as const,
  status: "LEARNER_REVIEW_CANDIDATE_V1_5_1_NOT_FROZEN" as const,
} as const);

const NUMBER_RE = /-?\d+(?:\.\d+)?/g;
const SVG_RE = /<svg\b[\s\S]*?<\/svg>/g;
const q = (value: number) => Math.round(value * 1000) / 1000;

function attrNumber(tag: string, name: string): number | null {
  const match = tag.match(new RegExp(`\\b${name}="(-?\\d+(?:\\.\\d+)?)"`));
  return match ? Number(match[1]) : null;
}

function attrString(tag: string, name: string): string | null {
  return tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1] ?? null;
}

function boundaryEnd(svg: string, question: PfcTpfEnglishReviewQuestionV1): number | null {
  const openEnd = svg.indexOf(">");
  const close = svg.lastIndexOf("</svg>");
  if (openEnd < 0 || close < 0) return null;
  const body = svg.slice(openEnd + 1, close);
  if (question.taskKind === "LEGACY_FORWARD") {
    const rects = [...body.matchAll(/<rect\b[^>]*\/?\s*>/g)];
    if (rects.length >= 2 && rects[1].index !== undefined) return openEnd + 1 + rects[1].index + rects[1][0].length;
  }
  if (question.sourceShape === "CIRCLE") {
    const circles = [...body.matchAll(/<circle\b[^>]*\/?\s*>/g)];
    const boundary = circles.find((match) => Number(attrString(match[0], "r") ?? 0) > 10 && /\bfill="white"/.test(match[0]));
    if (boundary?.index !== undefined) return openEnd + 1 + boundary.index + boundary[0].length;
  }
  const rect = body.match(/<rect\b[^>]*\/?\s*>/);
  return rect?.index === undefined ? null : openEnd + 1 + rect.index + rect[0].length;
}

function triangle(cx: number, cy: number, direction: "UP" | "DOWN" | "LEFT" | "RIGHT", size = 4.5): string {
  let points = "";
  if (direction === "UP") points = `${q(cx)},${q(cy - size)} ${q(cx + size)},${q(cy + size)} ${q(cx - size)},${q(cy + size)}`;
  else if (direction === "DOWN") points = `${q(cx)},${q(cy + size)} ${q(cx + size)},${q(cy - size)} ${q(cx - size)},${q(cy - size)}`;
  else if (direction === "LEFT") points = `${q(cx - size)},${q(cy)} ${q(cx + size)},${q(cy - size)} ${q(cx + size)},${q(cy + size)}`;
  else points = `${q(cx + size)},${q(cy)} ${q(cx - size)},${q(cy - size)} ${q(cx - size)},${q(cy + size)}`;
  return `<polygon points="${points}" fill="none" data-cutout="transparent" stroke="#111" stroke-width="1.2" stroke-linejoin="round"/>`;
}

function doubleTriangleWrongSvg(question: PfcTpfEnglishReviewQuestionV1, kind: 0 | 1 | 2): string {
  const circle = question.sourceShape === "CIRCLE";
  const width = circle ? 100 : 120;
  const height = circle ? 100 : 80;
  const pad = circle ? 8 : 9.6;
  const boundary = circle
    ? `<circle cx="50" cy="50" r="50" fill="white" stroke="#111" stroke-width="1.4"/>`
    : `<rect x="0" y="0" width="120" height="80" fill="white" stroke="#111" stroke-width="1.4"/>`;
  let marks = "";

  if (kind === 0) {
    // Learner unfolds only the last fold: two reflected cuts remain on one side.
    const x = circle ? 70 : 88;
    const y1 = circle ? 32 : 22;
    const y2 = circle ? 68 : 58;
    marks = `${triangle(x, y1, "UP")}${triangle(x, y2, "DOWN")}`;
  } else if (kind === 1) {
    // Learner uses the wrong symmetry axes: four cuts appear on cardinal/extreme positions.
    if (circle) {
      marks = `${triangle(50, 9, "UP")}${triangle(91, 50, "RIGHT")}${triangle(50, 91, "DOWN")}${triangle(9, 50, "LEFT")}`;
    } else {
      marks = `${triangle(15, 10, "UP")}${triangle(105, 10, "UP")}${triangle(15, 70, "DOWN")}${triangle(105, 70, "DOWN")}`;
    }
  } else {
    // Learner does not unfold either crease: only the original folded cut is shown.
    const x = circle ? 69 : 87;
    const y = circle ? 34 : 25;
    marks = triangle(x, y, "UP", 5);
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${q(-pad)} ${q(-pad)} ${q(width + 2 * pad)} ${q(height + 2 * pad)}" width="150" height="150" style="background:#fff" role="img">${boundary}${marks}</svg>`;
}

function semanticDoubleTriangleChoices(question: PfcTpfEnglishReviewQuestionV1): PfcTpfEnglishReviewQuestionV1 | null {
  if (!question.sourceId.includes("DOUBLE-TRIANGLE")) return null;
  let wrong = 0;
  const options = question.options.map((option) => option.optionId === question.correctOptionId
    ? option
    : { ...option, svg: doubleTriangleWrongSvg(question, wrong++ as 0 | 1 | 2) });
  const candidate = { ...question, options };
  const distance = minimumPatternOptionDistanceV1_5(candidate);
  if (distance + 1e-9 < PFC_TPF_REVIEW_V1_5_MIN_PATTERN_DISTANCE) {
    throw new Error(`${question.reviewQuestionId} semantic double-triangle choices remain too similar at ${distance.toFixed(3)}.`);
  }
  return candidate;
}

function affine(value: number, center: number, factor: number, shift: number): number {
  return q(center + (value - center) * factor + shift);
}

function affinePairs(raw: string, centerX: number, centerY: number, factor: number, dx: number, dy: number): string {
  const values = raw.match(NUMBER_RE)?.map(Number) ?? [];
  if (values.length < 2) return raw;
  const mapped = values.map((value, index) => index % 2 === 0
    ? affine(value, centerX, factor, dx)
    : affine(value, centerY, factor, dy));
  let index = 0;
  return raw.replace(NUMBER_RE, () => String(mapped[index++]));
}

function affineMarkup(markup: string, centerX: number, centerY: number, factor: number, dx: number, dy: number): string {
  return markup
    .replace(/\b(cx|x1|x2)="(-?\d+(?:\.\d+)?)"/g, (_m, key: string, raw: string) => `${key}="${affine(Number(raw), centerX, factor, dx)}"`)
    .replace(/\b(cy|y1|y2)="(-?\d+(?:\.\d+)?)"/g, (_m, key: string, raw: string) => `${key}="${affine(Number(raw), centerY, factor, dy)}"`)
    .replace(/\bpoints="([^"]+)"/g, (_m, raw: string) => `points="${affinePairs(raw, centerX, centerY, factor, dx, dy)}"`)
    .replace(/\bd="([^"]+)"/g, (_m, raw: string) => `d="${affinePairs(raw, centerX, centerY, factor, dx, dy)}"`);
}

const SPREAD_VARIANTS = [
  { factor: 0.45, dx: -12, dy: 10 },
  { factor: 0.55, dx: 14, dy: -12 },
  { factor: 0.70, dx: -14, dy: -10 },
  { factor: 0.38, dx: 12, dy: 12 },
  { factor: 0.62, dx: -15, dy: 8 },
  { factor: 0.50, dx: 15, dy: 10 },
  { factor: 0.42, dx: -8, dy: -14 },
  { factor: 0.58, dx: 10, dy: 14 },
  { factor: 0.34, dx: -14, dy: 0 },
  { factor: 0.66, dx: 0, dy: -14 },
  { factor: 0.48, dx: 14, dy: 4 },
  { factor: 0.60, dx: -10, dy: 14 },
] as const;

function transformWrongOption(svg: string, question: PfcTpfEnglishReviewQuestionV1, variantIndex: number): string {
  const start = boundaryEnd(svg, question);
  const close = svg.lastIndexOf("</svg>");
  if (start === null || close < start) return svg;
  const centerX = question.sourceShape === "RECTANGLE" ? 60 : 50;
  const centerY = question.sourceShape === "RECTANGLE" ? 40 : 50;
  const variant = SPREAD_VARIANTS[variantIndex % SPREAD_VARIANTS.length];
  return `${svg.slice(0, start)}${affineMarkup(svg.slice(start, close), centerX, centerY, variant.factor, variant.dx, variant.dy)}${svg.slice(close)}`;
}

function spreadSimilarChoices(question: PfcTpfEnglishReviewQuestionV1): PfcTpfEnglishReviewQuestionV1 {
  if (question.taskKind === "REVERSE_INFERENCE") return question;
  const semanticTriangles = semanticDoubleTriangleChoices(question);
  if (semanticTriangles) return semanticTriangles;
  if (minimumPatternOptionDistanceV1_5(question) + 1e-9 >= PFC_TPF_REVIEW_V1_5_MIN_PATTERN_DISTANCE) return question;

  // Boundary notches use white eraser strokes tied to the paper edge; V1.4.1 already gives them topology-specific alternatives.
  if (question.options.some((option) => /\bstroke="white"/i.test(option.svg))) return question;

  const correctIndex = question.options.findIndex((option) => option.optionId === question.correctOptionId);
  if (correctIndex < 0) throw new Error(`${question.reviewQuestionId} has no correct option.`);
  const bases = question.options.map((option) => ({ ...option }));

  for (let pass = 0; pass < SPREAD_VARIANTS.length; pass += 1) {
    let wrongRank = 0;
    const options = bases.map((option, optionIndex) => {
      if (optionIndex === correctIndex) return option;
      const variant = (pass + wrongRank * 2) % SPREAD_VARIANTS.length;
      wrongRank += 1;
      return { ...option, svg: transformWrongOption(option.svg, question, variant) };
    });
    const candidate = { ...question, options };
    if (minimumPatternOptionDistanceV1_5(candidate) + 1e-9 >= PFC_TPF_REVIEW_V1_5_MIN_PATTERN_DISTANCE) return candidate;
  }

  throw new Error(`${question.reviewQuestionId} cannot reach the V1.5.1 separation gate without inventing marks.`);
}

interface Bounds { minX: number; minY: number; maxX: number; maxY: number }

function includeBounds(bounds: Bounds | null, x: number, y: number): Bounds {
  if (!bounds) return { minX: x, minY: y, maxX: x, maxY: y };
  return { minX: Math.min(bounds.minX, x), minY: Math.min(bounds.minY, y), maxX: Math.max(bounds.maxX, x), maxY: Math.max(bounds.maxY, y) };
}

function paperBounds(svg: string): Bounds | null {
  let bounds: Bounds | null = null;
  for (const tag of svg.match(/<polygon\b[^>]*\/?\s*>/g) ?? []) {
    if (!/\bfill="white"/i.test(tag) || !/\bstroke="(?:#111|black)"/i.test(tag)) continue;
    const points = attrString(tag, "points")?.match(NUMBER_RE)?.map(Number) ?? [];
    for (let i = 0; i + 1 < points.length; i += 2) bounds = includeBounds(bounds, points[i], points[i + 1]);
  }
  for (const tag of svg.match(/<rect\b[^>]*\/?\s*>/g) ?? []) {
    if (!/\bfill="white"/i.test(tag) || !/\bstroke="(?:#111|black)"/i.test(tag)) continue;
    const x = attrNumber(tag, "x") ?? 0;
    const y = attrNumber(tag, "y") ?? 0;
    const width = attrNumber(tag, "width");
    const height = attrNumber(tag, "height");
    if (width === null || height === null) continue;
    bounds = includeBounds(bounds, x, y);
    bounds = includeBounds(bounds, x + width, y + height);
  }
  for (const tag of svg.match(/<circle\b[^>]*\/?\s*>/g) ?? []) {
    if (!/\bfill="white"/i.test(tag) || !/\bstroke="(?:#111|black)"/i.test(tag)) continue;
    const cx = attrNumber(tag, "cx");
    const cy = attrNumber(tag, "cy");
    const r = attrNumber(tag, "r");
    if (cx === null || cy === null || r === null || r < 10) continue;
    bounds = includeBounds(bounds, cx - r, cy - r);
    bounds = includeBounds(bounds, cx + r, cy + r);
  }
  return bounds;
}

function normalizeStageSvg(svg: string): string {
  const bounds = paperBounds(svg);
  if (!bounds) return svg;
  const span = Math.max(1, bounds.maxX - bounds.minX, bounds.maxY - bounds.minY);
  const side = span * 1.30;
  const cx = (bounds.minX + bounds.maxX) / 2;
  const cy = (bounds.minY + bounds.maxY) / 2;
  const viewBox = `${q(cx - side / 2)} ${q(cy - side / 2)} ${q(side)} ${q(side)}`;
  let next = svg.replace(/<text\b[^>]*>[\s\S]*?<\/text>/g, "");
  next = /\bviewBox="[^"]+"/i.test(next) ? next.replace(/\bviewBox="[^"]+"/i, `viewBox="${viewBox}"`) : next.replace("<svg", `<svg viewBox="${viewBox}"`);
  return next.replace("<svg", '<svg data-stage-normalized="true"');
}

function normalizeStageSequence(markup: string): string {
  return markup.replace(SVG_RE, (svg) => {
    const label = (attrString(svg.slice(0, svg.indexOf(">") + 1), "aria-label") ?? "Stage")
      .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
    return `<div class="fixed-stage"><div class="fixed-stage-label">${label}</div>${normalizeStageSvg(svg)}</div>`;
  });
}

function normalizeStageSizing(question: PfcTpfEnglishReviewQuestionV1): PfcTpfEnglishReviewQuestionV1 {
  if (question.taskKind === "MULTISHAPE_FORWARD" && (question.stimulusSvg.match(/<svg\b/g) ?? []).length >= 3) {
    return { ...question, stimulusSvg: normalizeStageSequence(question.stimulusSvg) };
  }
  if (question.taskKind === "REVERSE_INFERENCE") {
    return { ...question, options: question.options.map((option) => ({ ...option, svg: normalizeStageSequence(option.svg) })) };
  }
  return question;
}

export function generatePfcTpfSourceSaturatedEnglishReviewV1_5_1(): PfcTpfEnglishReviewQuestionV1[] {
  return generatePfcTpfSourceSaturatedEnglishReviewV1_4_1().map((question) => normalizeStageSizing(spreadSimilarChoices(question)));
}

export function renderPfcTpfSourceSaturatedEnglishReviewHtmlV1_5_1(questions: readonly PfcTpfEnglishReviewQuestionV1[]): string {
  return renderPfcTpfSourceSaturatedEnglishReviewHtmlV1_5(questions)
    .replaceAll("PFC / TPF Source-Saturated English Learner Review V1.5", "PFC / TPF Source-Saturated English Learner Review V1.5.1")
    .replaceAll(PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_5.authorityId, PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_5_1.authorityId);
}

export function countNormalizedStagesV1_5_1(questions: readonly PfcTpfEnglishReviewQuestionV1[]): number {
  return questions.reduce((count, question) => count + ([question.stimulusSvg, ...question.options.map((option) => option.svg)].join("\n").match(/data-stage-normalized="true"/g) ?? []).length, 0);
}
