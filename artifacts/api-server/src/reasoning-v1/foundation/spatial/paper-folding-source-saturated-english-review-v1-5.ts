import {
  PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_4_1,
  countSyntheticDistractorMarksV1_4_1,
  generatePfcTpfSourceSaturatedEnglishReviewV1_4_1,
  renderPfcTpfSourceSaturatedEnglishReviewHtmlV1_4_1,
} from "./paper-folding-source-saturated-english-review-v1-4-1";
import type {
  PfcTpfEnglishReviewQuestionV1,
  PfcTpfReviewOptionV1,
} from "./paper-folding-source-saturated-english-review-v1";

export const PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_5 = Object.freeze({
  ...PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_4_1,
  authorityId: "PFC-TPF-SOURCE-SATURATED-ENGLISH-REVIEW-V1.5" as const,
  supersedesReviewCandidate: PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_4_1.authorityId,
  presentationRemediationV1_5: [
    "FIXED_PIXEL_STAGE_CARDS",
    "PACKET_BOUNDING_BOX_VIEWBOX_ZOOM",
    "THREE_STEP_SEQUENCE_NO_PROGRESSIVE_SHRINK",
    "HORIZONTAL_SCROLL_INSTEAD_OF_SHRINK",
    "ALL_NON_REVERSE_PATTERN_DISTANCE_GATE_0_16",
    "NO_RANDOM_EXTRA_DISTRACTOR_MARKS",
    "CORRECT_OPTION_IMMUTABLE",
  ] as const,
  status: "LEARNER_REVIEW_CANDIDATE_V1_5_NOT_FROZEN" as const,
} as const);

export const PFC_TPF_REVIEW_V1_5_MIN_PATTERN_DISTANCE = 0.16;

const NUMBER_RE = /-?\d+(?:\.\d+)?/g;
const SVG_RE = /<svg\b[\s\S]*?<\/svg>/g;
const q = (value: number) => Math.round(value * 1000) / 1000;

interface MarkV1_5 {
  x: number;
  y: number;
  kind: "CIRCLE" | "LINE" | "POLYGON" | "PATH";
}

interface BoundsV1_5 {
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

function centroidFromPairs(raw: string): { x: number; y: number } | null {
  const values = raw.match(NUMBER_RE)?.map(Number) ?? [];
  if (values.length < 2) return null;
  const points: Array<{ x: number; y: number }> = [];
  for (let index = 0; index + 1 < values.length; index += 2) points.push({ x: values[index], y: values[index + 1] });
  if (points.length === 0) return null;
  return {
    x: points.reduce((sum, point) => sum + point.x, 0) / points.length,
    y: points.reduce((sum, point) => sum + point.y, 0) / points.length,
  };
}

function boundaryEnd(svg: string, question: PfcTpfEnglishReviewQuestionV1): number | null {
  const openEnd = svg.indexOf(">");
  const closeStart = svg.lastIndexOf("</svg>");
  if (openEnd < 0 || closeStart < 0) return null;
  const body = svg.slice(openEnd + 1, closeStart);

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
  if (rect?.index !== undefined) return openEnd + 1 + rect.index + rect[0].length;
  return null;
}

function extractMarks(svg: string, question: PfcTpfEnglishReviewQuestionV1): MarkV1_5[] {
  const start = boundaryEnd(svg, question);
  if (start === null) return [];
  const close = svg.lastIndexOf("</svg>");
  const markup = svg.slice(start, close);
  const marks: MarkV1_5[] = [];

  for (const tag of markup.match(/<circle\b[^>]*\/?\s*>/g) ?? []) {
    const cx = attrNumber(tag, "cx");
    const cy = attrNumber(tag, "cy");
    const r = attrNumber(tag, "r");
    if (cx === null || cy === null || r === null || r > 10) continue;
    marks.push({ x: cx, y: cy, kind: "CIRCLE" });
  }

  for (const tag of markup.match(/<line\b[^>]*\/?\s*>/g) ?? []) {
    if (/\bstroke="(?:white|#fff)"/i.test(tag)) continue;
    const x1 = attrNumber(tag, "x1");
    const y1 = attrNumber(tag, "y1");
    const x2 = attrNumber(tag, "x2");
    const y2 = attrNumber(tag, "y2");
    if ([x1, y1, x2, y2].some((value) => value === null)) continue;
    marks.push({ x: (x1! + x2!) / 2, y: (y1! + y2!) / 2, kind: "LINE" });
  }

  for (const tag of markup.match(/<(?:polygon|polyline)\b[^>]*\/?\s*>/g) ?? []) {
    const points = attrString(tag, "points");
    if (!points) continue;
    const centroid = centroidFromPairs(points);
    if (centroid) marks.push({ ...centroid, kind: "POLYGON" });
  }

  for (const tag of markup.match(/<path\b[^>]*\/?\s*>/g) ?? []) {
    if (!/\bstroke="(?:#111|black)"/i.test(tag)) continue;
    const data = attrString(tag, "d");
    if (!data) continue;
    const centroid = centroidFromPairs(data);
    if (centroid) marks.push({ ...centroid, kind: "PATH" });
  }
  return marks;
}

function sourceDiagonal(question: PfcTpfEnglishReviewQuestionV1): number {
  return question.sourceShape === "RECTANGLE" ? Math.hypot(120, 80) : Math.hypot(100, 100);
}

function directedDistance(left: readonly MarkV1_5[], right: readonly MarkV1_5[], diagonal: number): number {
  if (left.length === 0) return right.length === 0 ? 0 : 1;
  if (right.length === 0) return 1;
  let total = 0;
  for (const mark of left) {
    let best = Number.POSITIVE_INFINITY;
    for (const candidate of right) {
      const position = Math.hypot(mark.x - candidate.x, mark.y - candidate.y) / diagonal;
      const kindPenalty = mark.kind === candidate.kind ? 0 : 0.14;
      best = Math.min(best, position + kindPenalty);
    }
    total += best;
  }
  return total / left.length;
}

function markDistance(left: readonly MarkV1_5[], right: readonly MarkV1_5[], diagonal: number): number {
  const countDistance = Math.abs(left.length - right.length) / Math.max(1, left.length, right.length);
  const positional = (directedDistance(left, right, diagonal) + directedDistance(right, left, diagonal)) / 2;
  return Math.max(countDistance, positional);
}

export function minimumPatternOptionDistanceV1_5(question: PfcTpfEnglishReviewQuestionV1): number {
  if (question.taskKind === "REVERSE_INFERENCE") return 1;
  const sets = question.options.map((option) => extractMarks(option.svg, question));
  const diagonal = sourceDiagonal(question);
  let minimum = 1;
  for (let left = 0; left < sets.length; left += 1) {
    for (let right = left + 1; right < sets.length; right += 1) {
      minimum = Math.min(minimum, markDistance(sets[left], sets[right], diagonal));
    }
  }
  return minimum;
}

function closestPair(question: PfcTpfEnglishReviewQuestionV1): { distance: number; left: number; right: number } {
  const sets = question.options.map((option) => extractMarks(option.svg, question));
  const diagonal = sourceDiagonal(question);
  let best = { distance: 1, left: 0, right: 1 };
  for (let left = 0; left < sets.length; left += 1) {
    for (let right = left + 1; right < sets.length; right += 1) {
      const distance = markDistance(sets[left], sets[right], diagonal);
      if (distance < best.distance) best = { distance, left, right };
    }
  }
  return best;
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
    .replace(/\b(cx|x1|x2)="(-?\d+(?:\.\d+)?)"/g, (_match, key: string, raw: string) => `${key}="${affine(Number(raw), centerX, factor, dx)}"`)
    .replace(/\b(cy|y1|y2)="(-?\d+(?:\.\d+)?)"/g, (_match, key: string, raw: string) => `${key}="${affine(Number(raw), centerY, factor, dy)}"`)
    .replace(/\bpoints="([^"]+)"/g, (_match, raw: string) => `points="${affinePairs(raw, centerX, centerY, factor, dx, dy)}"`)
    .replace(/\bd="([^"]+)"/g, (_match, raw: string) => `d="${affinePairs(raw, centerX, centerY, factor, dx, dy)}"`);
}

function transformWrongPattern(svg: string, question: PfcTpfEnglishReviewQuestionV1, variant: number): string {
  const start = boundaryEnd(svg, question);
  const close = svg.lastIndexOf("</svg>");
  if (start === null || close < start) return svg;
  const centerX = question.sourceShape === "RECTANGLE" ? 60 : 50;
  const centerY = question.sourceShape === "RECTANGLE" ? 40 : 50;
  const variants = [
    { factor: 0.50, dx: -9, dy: 8 },
    { factor: 0.58, dx: 10, dy: -8 },
    { factor: 0.44, dx: 9, dy: 11 },
    { factor: 0.64, dx: -11, dy: -8 },
    { factor: 0.40, dx: 0, dy: 13 },
    { factor: 0.52, dx: 13, dy: 0 },
    { factor: 0.46, dx: -12, dy: 0 },
    { factor: 0.56, dx: 0, dy: -12 },
  ];
  const selected = variants[variant % variants.length];
  return `${svg.slice(0, start)}${affineMarkup(svg.slice(start, close), centerX, centerY, selected.factor, selected.dx, selected.dy)}${svg.slice(close)}`;
}

function removeLastVisibleMark(svg: string, question: PfcTpfEnglishReviewQuestionV1): string {
  const start = boundaryEnd(svg, question);
  const close = svg.lastIndexOf("</svg>");
  if (start === null || close < start) return svg;
  let marks = svg.slice(start, close);
  const matches = [...marks.matchAll(/<(?:circle|line|polygon|polyline|path)\b[^>]*\/?\s*>/g)]
    .filter((match) => !/\bstroke="(?:white|#fff)"/i.test(match[0]));
  const last = matches.at(-1);
  if (!last || last.index === undefined) return svg;
  marks = `${marks.slice(0, last.index)}${marks.slice(last.index + last[0].length)}`;
  return `${svg.slice(0, start)}${marks}${svg.slice(close)}`;
}

function vNotchBoundary(width: number, height: number, edge: "TOP" | "BOTTOM" | "LEFT" | "RIGHT", position: number): string {
  const mouth = 6;
  const depth = 8;
  if (edge === "TOP") {
    return `<line x1="${q(position - mouth)}" y1="0" x2="${q(position + mouth)}" y2="0" stroke="white" stroke-width="5" stroke-linecap="round"/><polyline points="${q(position - mouth)},0 ${q(position)},${depth} ${q(position + mouth)},0" fill="none" data-cutout="transparent" stroke="#111" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  if (edge === "BOTTOM") {
    return `<line x1="${q(position - mouth)}" y1="${height}" x2="${q(position + mouth)}" y2="${height}" stroke="white" stroke-width="5" stroke-linecap="round"/><polyline points="${q(position - mouth)},${height} ${q(position)},${q(height - depth)} ${q(position + mouth)},${height}" fill="none" data-cutout="transparent" stroke="#111" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  if (edge === "LEFT") {
    return `<line x1="0" y1="${q(position - mouth)}" x2="0" y2="${q(position + mouth)}" stroke="white" stroke-width="5" stroke-linecap="round"/><polyline points="0,${q(position - mouth)} ${depth},${q(position)} 0,${q(position + mouth)}" fill="none" data-cutout="transparent" stroke="#111" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  return `<line x1="${width}" y1="${q(position - mouth)}" x2="${width}" y2="${q(position + mouth)}" stroke="white" stroke-width="5" stroke-linecap="round"/><polyline points="${width},${q(position - mouth)} ${q(width - depth)},${q(position)} ${width},${q(position + mouth)}" fill="none" data-cutout="transparent" stroke="#111" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function boundaryNotchOption(question: PfcTpfEnglishReviewQuestionV1, kind: number): string {
  const rectangle = question.sourceShape === "RECTANGLE";
  const width = rectangle ? 120 : 100;
  const height = rectangle ? 80 : 100;
  const pad = rectangle ? 9.6 : 8;
  const boundary = `<rect x="0" y="0" width="${width}" height="${height}" fill="white" stroke="#111" stroke-width="1.4"/>`;
  let marks = "";
  if (question.sourceId.includes("PFC-DISC-0081")) {
    if (kind === 0) marks = vNotchBoundary(width, height, "TOP", 22);
    else if (kind === 1) marks = vNotchBoundary(width, height, "TOP", 78);
    else marks = `${vNotchBoundary(width, height, "BOTTOM", 28)}${vNotchBoundary(width, height, "BOTTOM", 72)}`;
  } else {
    if (kind === 0) marks = vNotchBoundary(width, height, "LEFT", height * 0.34);
    else if (kind === 1) marks = vNotchBoundary(width, height, "RIGHT", height * 0.66);
    else marks = `${vNotchBoundary(width, height, "TOP", width * 0.30)}${vNotchBoundary(width, height, "TOP", width * 0.70)}`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${q(-pad)} ${q(-pad)} ${q(width + 2 * pad)} ${q(height + 2 * pad)}" width="150" height="150" style="background:#fff" role="img">${boundary}${marks}</svg>`;
}

function remediateBoundaryNotches(question: PfcTpfEnglishReviewQuestionV1): PfcTpfEnglishReviewQuestionV1 {
  let wrong = 0;
  return {
    ...question,
    options: question.options.map((option) => option.optionId === question.correctOptionId
      ? option
      : { ...option, svg: boundaryNotchOption(question, wrong++) }),
  };
}

function strengthenPatternChoices(question: PfcTpfEnglishReviewQuestionV1): PfcTpfEnglishReviewQuestionV1 {
  if (question.taskKind === "REVERSE_INFERENCE") return question;
  if (question.sourceId.includes("PFC-DISC-0081") || question.sourceId.includes("OUTER-V-NOTCH")) {
    question = remediateBoundaryNotches(question);
  }

  const originalOptions = question.options.map((option) => ({ ...option }));
  let options = originalOptions.map((option) => ({ ...option }));
  const correctIndex = options.findIndex((option) => option.optionId === question.correctOptionId);
  if (correctIndex < 0) throw new Error(`${question.reviewQuestionId} has no correct option.`);

  for (let pass = 0; pass < 16; pass += 1) {
    const probe = { ...question, options };
    const pair = closestPair(probe);
    if (pair.distance + 1e-9 >= PFC_TPF_REVIEW_V1_5_MIN_PATTERN_DISTANCE) break;
    let target = pair.right === correctIndex ? pair.left : pair.right;
    if (target === correctIndex) target = pair.left === correctIndex ? pair.right : pair.left;
    if (target === correctIndex) throw new Error(`${question.reviewQuestionId} V1.5 selected the correct option for remediation.`);

    const base = originalOptions[target]?.svg ?? options[target].svg;
    options[target] = {
      ...options[target],
      svg: pass < 12 ? transformWrongPattern(base, question, pass + target * 3) : removeLastVisibleMark(base, question),
    };
  }

  const next = { ...question, options };
  const distance = minimumPatternOptionDistanceV1_5(next);
  if (distance + 1e-9 < PFC_TPF_REVIEW_V1_5_MIN_PATTERN_DISTANCE) {
    throw new Error(`${question.reviewQuestionId} remains too similar at ${distance.toFixed(3)} after V1.5.`);
  }
  return next;
}

function includeBounds(bounds: BoundsV1_5 | null, x: number, y: number): BoundsV1_5 {
  if (!bounds) return { minX: x, minY: y, maxX: x, maxY: y };
  return {
    minX: Math.min(bounds.minX, x),
    minY: Math.min(bounds.minY, y),
    maxX: Math.max(bounds.maxX, x),
    maxY: Math.max(bounds.maxY, y),
  };
}

function paperBounds(svg: string): BoundsV1_5 | null {
  let bounds: BoundsV1_5 | null = null;
  for (const tag of svg.match(/<polygon\b[^>]*\/?\s*>/g) ?? []) {
    if (!/\bfill="white"/i.test(tag) || !/\bstroke="(?:#111|black)"/i.test(tag)) continue;
    const points = attrString(tag, "points")?.match(NUMBER_RE)?.map(Number) ?? [];
    for (let index = 0; index + 1 < points.length; index += 2) bounds = includeBounds(bounds, points[index], points[index + 1]);
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

function stageLabel(svg: string): string {
  return attrString(svg.slice(0, svg.indexOf(">") + 1), "aria-label") ?? "Stage";
}

function normalizeOneStageSvg(svg: string): string {
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

function normalizeStageSequence(markup: string): string {
  return markup.replace(SVG_RE, (svg) => {
    const label = stageLabel(svg).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
    return `<div class="fixed-stage"><div class="fixed-stage-label">${label}</div>${normalizeOneStageSvg(svg)}</div>`;
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

export function generatePfcTpfSourceSaturatedEnglishReviewV1_5(): PfcTpfEnglishReviewQuestionV1[] {
  const prior = generatePfcTpfSourceSaturatedEnglishReviewV1_4_1();
  return prior.map((question) => normalizeStageSizing(strengthenPatternChoices(question)));
}

export function renderPfcTpfSourceSaturatedEnglishReviewHtmlV1_5(
  questions: readonly PfcTpfEnglishReviewQuestionV1[],
): string {
  return renderPfcTpfSourceSaturatedEnglishReviewHtmlV1_4_1(questions)
    .replaceAll("PFC / TPF Source-Saturated English Learner Review V1.4.1", "PFC / TPF Source-Saturated English Learner Review V1.5")
    .replaceAll(PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_4_1.authorityId, PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_5.authorityId)
    .replace("</style>", `.stimulus-panels{height:285px!important;min-height:285px!important}.stimulus-panels>div{display:flex!important;align-items:center!important;gap:12px!important;max-width:none!important;min-width:max-content!important;margin:0 auto}.fixed-stage{width:178px;flex:0 0 178px;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;background:#fff}.fixed-stage-label{height:22px;line-height:22px;font-size:12px;font-weight:700;white-space:nowrap}.stimulus-panels .fixed-stage svg{width:156px!important;height:156px!important;max-width:none!important;flex:0 0 156px}.stimulus-sequence>svg{height:240px!important;width:auto!important;max-width:none!important;flex:0 0 auto}.option-process{height:150px!important;min-height:150px!important;justify-content:flex-start!important;overflow-x:auto!important;overflow-y:hidden!important}.option-process>div{display:flex!important;align-items:center!important;gap:6px!important;min-width:max-content!important;max-width:none!important;flex:0 0 auto}.option-process .fixed-stage{width:116px;flex:0 0 116px}.option-process .fixed-stage-label{height:18px;line-height:18px;font-size:10px}.option-process .fixed-stage svg{width:96px!important;height:96px!important;max-width:none!important;flex:0 0 96px}@media(max-width:760px){.stimulus-panels{height:270px!important;min-height:270px!important}.fixed-stage{width:166px;flex-basis:166px}.stimulus-panels .fixed-stage svg{width:146px!important;height:146px!important}.stimulus-sequence>svg{height:225px!important}.option-process .fixed-stage{width:110px;flex-basis:110px}.option-process .fixed-stage svg{width:92px!important;height:92px!important}}</style>`);
}

export function countNormalizedStageSvgsV1_5(questions: readonly PfcTpfEnglishReviewQuestionV1[]): number {
  return questions.reduce((count, question) => count + ([question.stimulusSvg, ...question.options.map((option) => option.svg)].join("\n").match(/data-stage-normalized="true"/g) ?? []).length, 0);
}

export function countSyntheticDistractorMarksV1_5(questions: readonly PfcTpfEnglishReviewQuestionV1[]): number {
  return countSyntheticDistractorMarksV1_4_1(questions);
}
