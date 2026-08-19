import {
  PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_5_2,
  generatePfcTpfSourceSaturatedEnglishReviewV1_5_2,
  renderPfcTpfSourceSaturatedEnglishReviewHtmlV1_5_2,
} from "./paper-folding-source-saturated-english-review-v1-5-2";
import type { PfcTpfEnglishReviewQuestionV1 } from "./paper-folding-source-saturated-english-review-v1";

export const PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_5_3 = Object.freeze({
  ...PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_5_2,
  authorityId: "PFC-TPF-SOURCE-SATURATED-ENGLISH-REVIEW-V1.5.3" as const,
  supersedesReviewCandidate: PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_5_2.authorityId,
  stageSizingRemediationV1_5_3: [
    "STRUCTURAL_MULTI_SVG_STAGE_DETECTION",
    "NO_TASK_KIND_DEPENDENCY_FOR_STAGE_ZOOM",
    "PACKET_BOUNDS_FITTED_VIEWBOX_PER_STAGE",
    "THREE_FOLD_FORWARD_FIXED_STAGE_SCALE",
    "REVERSE_PROCESS_FIXED_STAGE_SCALE",
    "HORIZONTAL_SCROLL_INSTEAD_OF_PROGRESSIVE_SHRINK",
  ] as const,
  status: "LEARNER_REVIEW_CANDIDATE_V1_5_3_NOT_FROZEN" as const,
} as const);

const NUMBER_RE = /-?\d+(?:\.\d+)?/g;
const SVG_RE = /<svg\b[\s\S]*?<\/svg>/g;
const q = (value: number) => Math.round(value * 1000) / 1000;

interface BoundsV1_5_3 {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

function attrNumber(tag: string, name: string): number | null {
  const match = tag.match(new RegExp(`\\b${name}="(-?\\d+(?:\\.\\d+)?)"`));
  return match ? Number(match[1]) : null;
}

function attrString(tag: string, name: string): string | null {
  return tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1] ?? null;
}

function includeBounds(bounds: BoundsV1_5_3 | null, x: number, y: number): BoundsV1_5_3 {
  if (!bounds) return { minX: x, minY: y, maxX: x, maxY: y };
  return {
    minX: Math.min(bounds.minX, x),
    minY: Math.min(bounds.minY, y),
    maxX: Math.max(bounds.maxX, x),
    maxY: Math.max(bounds.maxY, y),
  };
}

function paperBounds(svg: string): BoundsV1_5_3 | null {
  let bounds: BoundsV1_5_3 | null = null;

  for (const tag of svg.match(/<polygon\b[^>]*\/?\s*>/g) ?? []) {
    if (!/\bfill="white"/i.test(tag) || !/\bstroke="(?:#111|black)"/i.test(tag)) continue;
    const points = attrString(tag, "points")?.match(NUMBER_RE)?.map(Number) ?? [];
    for (let index = 0; index + 1 < points.length; index += 2) {
      bounds = includeBounds(bounds, points[index], points[index + 1]);
    }
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
    const radius = attrNumber(tag, "r");
    if (cx === null || cy === null || radius === null || radius < 10) continue;
    bounds = includeBounds(bounds, cx - radius, cy - radius);
    bounds = includeBounds(bounds, cx + radius, cy + radius);
  }

  return bounds;
}

function stageLabel(svg: string): string {
  const open = svg.slice(0, svg.indexOf(">") + 1);
  return attrString(open, "aria-label") ?? "Stage";
}

function normalizeStageSvg(svg: string): string {
  if (/data-stage-normalized="true"/.test(svg)) return svg;
  const bounds = paperBounds(svg);
  if (!bounds) return svg;

  const width = Math.max(1, bounds.maxX - bounds.minX);
  const height = Math.max(1, bounds.maxY - bounds.minY);
  const span = Math.max(width, height);
  const side = span * 1.30;
  const cx = (bounds.minX + bounds.maxX) / 2;
  const cy = (bounds.minY + bounds.maxY) / 2;
  const viewBox = `${q(cx - side / 2)} ${q(cy - side / 2)} ${q(side)} ${q(side)}`;

  let next = svg.replace(/<text\b[^>]*>[\s\S]*?<\/text>/g, "");
  next = /\bviewBox="[^"]+"/i.test(next)
    ? next.replace(/\bviewBox="[^"]+"/i, `viewBox="${viewBox}"`)
    : next.replace("<svg", `<svg viewBox="${viewBox}"`);
  return next.replace("<svg", '<svg data-stage-normalized="true"');
}

function esc(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function normalizeSequence(markup: string): string {
  if (/class="fixed-stage"/.test(markup) && /data-stage-normalized="true"/.test(markup)) return markup;
  return markup.replace(SVG_RE, (svg) => {
    const label = esc(stageLabel(svg));
    return `<div class="fixed-stage"><div class="fixed-stage-label">${label}</div>${normalizeStageSvg(svg)}</div>`;
  });
}

function svgCount(markup: string): number {
  return (markup.match(/<svg\b/g) ?? []).length;
}

function normalizeQuestionStages(question: PfcTpfEnglishReviewQuestionV1): PfcTpfEnglishReviewQuestionV1 {
  let stimulusSvg = question.stimulusSvg;
  if (svgCount(stimulusSvg) >= 3 && !/data-stage-normalized="true"/.test(stimulusSvg)) {
    stimulusSvg = normalizeSequence(stimulusSvg);
  }

  const options = question.options.map((option) => {
    if (svgCount(option.svg) < 2 || /data-stage-normalized="true"/.test(option.svg)) return option;
    return { ...option, svg: normalizeSequence(option.svg) };
  });

  return { ...question, stimulusSvg, options };
}

export function generatePfcTpfSourceSaturatedEnglishReviewV1_5_3(): PfcTpfEnglishReviewQuestionV1[] {
  return generatePfcTpfSourceSaturatedEnglishReviewV1_5_2().map(normalizeQuestionStages);
}

export function renderPfcTpfSourceSaturatedEnglishReviewHtmlV1_5_3(
  questions: readonly PfcTpfEnglishReviewQuestionV1[],
): string {
  return renderPfcTpfSourceSaturatedEnglishReviewHtmlV1_5_2(questions)
    .replaceAll("PFC / TPF Source-Saturated English Learner Review V1.5.2", "PFC / TPF Source-Saturated English Learner Review V1.5.3")
    .replaceAll(PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_5_2.authorityId, PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_5_3.authorityId);
}

export function countNormalizedStageSvgsV1_5_3(questions: readonly PfcTpfEnglishReviewQuestionV1[]): number {
  return questions.reduce((count, question) => {
    const markup = [question.stimulusSvg, ...question.options.map((option) => option.svg)].join("\n");
    return count + (markup.match(/data-stage-normalized="true"/g) ?? []).length;
  }, 0);
}
