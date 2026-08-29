import {
  PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_2,
  generatePfcTpfSourceSaturatedEnglishReviewV1_2,
  renderPfcTpfSourceSaturatedEnglishReviewHtmlV1_2,
} from "./paper-folding-source-saturated-english-review-v1-2";
import type { PfcTpfEnglishReviewQuestionV1 } from "./paper-folding-source-saturated-english-review-v1";

export const PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_3 = Object.freeze({
  ...PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_2,
  authorityId: "PFC-TPF-SOURCE-SATURATED-ENGLISH-REVIEW-V1.3" as const,
  supersedesReviewCandidate: PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_2.authorityId,
  perceptualRemediation: [
    "FORWARD_OPTION_MARK_CENTROID_DISTANCE",
    "MARK_COUNT_AND_TYPE_DIFFERENCE",
    "STRONG_WRONG_OPTION_POSITION_REMEDIATION",
    "CORRECT_OPTION_IMMUTABLE",
  ] as const,
  status: "LEARNER_REVIEW_CANDIDATE_V1_3_NOT_FROZEN" as const,
} as const);

export const PFC_TPF_REVIEW_V1_3_FORWARD_MIN_GEOMETRIC_DISTANCE = 0.08;

interface VisualMarkV1_3 {
  x: number;
  y: number;
  kind: "CIRCLE" | "LINE" | "POLYGON" | "PATH";
}

const NUMBER_RE = /-?\d+(?:\.\d+)?/g;

function attrNumber(tag: string, name: string): number | null {
  const match = tag.match(new RegExp(`\\b${name}="(-?\\d+(?:\\.\\d+)?)"`));
  return match ? Number(match[1]) : null;
}

function centroidFromNumbers(raw: string): { x: number; y: number } | null {
  const numbers = raw.match(NUMBER_RE)?.map(Number) ?? [];
  if (numbers.length < 2) return null;
  const points: Array<{ x: number; y: number }> = [];
  for (let index = 0; index + 1 < numbers.length; index += 2) points.push({ x: numbers[index], y: numbers[index + 1] });
  if (points.length === 0) return null;
  return {
    x: points.reduce((sum, point) => sum + point.x, 0) / points.length,
    y: points.reduce((sum, point) => sum + point.y, 0) / points.length,
  };
}

function extractForwardMarks(svg: string): VisualMarkV1_3[] {
  const marks: VisualMarkV1_3[] = [];
  for (const tag of svg.match(/<circle\b[^>]*\/>/g) ?? []) {
    const cx = attrNumber(tag, "cx");
    const cy = attrNumber(tag, "cy");
    const radius = attrNumber(tag, "r");
    if (cx === null || cy === null || radius === null || radius > 10) continue;
    marks.push({ x: cx, y: cy, kind: "CIRCLE" });
  }
  for (const tag of svg.match(/<(?:polygon|polyline)\b[^>]*\/>/g) ?? []) {
    const points = tag.match(/\bpoints="([^"]+)"/)?.[1];
    if (!points) continue;
    const centroid = centroidFromNumbers(points);
    if (centroid) marks.push({ ...centroid, kind: "POLYGON" });
  }
  for (const tag of svg.match(/<line\b[^>]*\/>/g) ?? []) {
    if (/\bstroke="(?:white|#fff)"/i.test(tag)) continue;
    const x1 = attrNumber(tag, "x1");
    const y1 = attrNumber(tag, "y1");
    const x2 = attrNumber(tag, "x2");
    const y2 = attrNumber(tag, "y2");
    if ([x1, y1, x2, y2].some((value) => value === null)) continue;
    marks.push({ x: (x1! + x2!) / 2, y: (y1! + y2!) / 2, kind: "LINE" });
  }
  for (const tag of svg.match(/<path\b[^>]*\/>/g) ?? []) {
    if (!/\bstroke="(?:#111|black)"/i.test(tag)) continue;
    const data = tag.match(/\bd="([^"]+)"/)?.[1];
    if (!data) continue;
    const centroid = centroidFromNumbers(data);
    if (centroid) marks.push({ ...centroid, kind: "PATH" });
  }
  return marks;
}

function sourceDiagonal(question: PfcTpfEnglishReviewQuestionV1): number {
  return question.sourceShape === "RECTANGLE" ? Math.hypot(120, 80) : Math.hypot(100, 100);
}

function directedNearestDistance(left: readonly VisualMarkV1_3[], right: readonly VisualMarkV1_3[], diagonal: number): number {
  if (left.length === 0) return right.length === 0 ? 0 : 1;
  if (right.length === 0) return 1;
  let total = 0;
  for (const mark of left) {
    let best = Number.POSITIVE_INFINITY;
    for (const candidate of right) {
      const position = Math.hypot(mark.x - candidate.x, mark.y - candidate.y) / diagonal;
      const typePenalty = mark.kind === candidate.kind ? 0 : 0.12;
      best = Math.min(best, position + typePenalty);
    }
    total += best;
  }
  return total / left.length;
}

function markSetDistance(left: readonly VisualMarkV1_3[], right: readonly VisualMarkV1_3[], diagonal: number): number {
  const countDistance = Math.abs(left.length - right.length) / Math.max(1, left.length, right.length);
  const positionDistance = (
    directedNearestDistance(left, right, diagonal) + directedNearestDistance(right, left, diagonal)
  ) / 2;
  return Math.max(countDistance, positionDistance);
}

export function minimumForwardOptionGeometricDistanceV1_3(question: PfcTpfEnglishReviewQuestionV1): number {
  if (question.taskKind !== "LEGACY_FORWARD" && question.taskKind !== "MULTISHAPE_FORWARD") return 1;
  const markSets = question.options.map((option) => extractForwardMarks(option.svg));
  const diagonal = sourceDiagonal(question);
  let minimum = 1;
  for (let left = 0; left < markSets.length; left += 1) {
    for (let right = left + 1; right < markSets.length; right += 1) {
      minimum = Math.min(minimum, markSetDistance(markSets[left], markSets[right], diagonal));
    }
  }
  return minimum;
}

function closestForwardPair(question: PfcTpfEnglishReviewQuestionV1): { distance: number; left: number; right: number } {
  const markSets = question.options.map((option) => extractForwardMarks(option.svg));
  const diagonal = sourceDiagonal(question);
  let best = { distance: 1, left: 0, right: 1 };
  for (let left = 0; left < markSets.length; left += 1) {
    for (let right = left + 1; right < markSets.length; right += 1) {
      const distance = markSetDistance(markSets[left], markSets[right], diagonal);
      if (distance < best.distance) best = { distance, left, right };
    }
  }
  return best;
}

function scaled(value: number, center: number, factor: number): number {
  return Math.round((center + (value - center) * factor) * 1000) / 1000;
}

function scalePairNumbers(raw: string, centerX: number, centerY: number, factor: number): string {
  const numbers = raw.match(NUMBER_RE)?.map(Number) ?? [];
  if (numbers.length < 2) return raw;
  const transformed = numbers.map((value, index) => scaled(value, index % 2 === 0 ? centerX : centerY, factor));
  let index = 0;
  return raw.replace(NUMBER_RE, () => String(transformed[index++]));
}

function scaleCutMarkup(markup: string, centerX: number, centerY: number, factor: number): string {
  return markup
    .replace(/\b(cx|x1|x2)="(-?\d+(?:\.\d+)?)"/g, (_match, key: string, raw: string) => `${key}="${scaled(Number(raw), centerX, factor)}"`)
    .replace(/\b(cy|y1|y2)="(-?\d+(?:\.\d+)?)"/g, (_match, key: string, raw: string) => `${key}="${scaled(Number(raw), centerY, factor)}"`)
    .replace(/\bpoints="([^"]+)"/g, (_match, raw: string) => `points="${scalePairNumbers(raw, centerX, centerY, factor)}"`)
    .replace(/\bd="([^"]+)"/g, (_match, raw: string) => `d="${scalePairNumbers(raw, centerX, centerY, factor)}"`);
}

function answerBoundaryEnd(svg: string, question: PfcTpfEnglishReviewQuestionV1): number | null {
  const openEnd = svg.indexOf(">");
  const closeStart = svg.lastIndexOf("</svg>");
  if (openEnd < 0 || closeStart < 0) return null;
  const body = svg.slice(openEnd + 1, closeStart);
  if (question.taskKind === "LEGACY_FORWARD") {
    const rects = [...body.matchAll(/<rect\b[^>]*\/>/g)];
    if (rects.length >= 2 && rects[1].index !== undefined) return openEnd + 1 + rects[1].index + rects[1][0].length;
  }
  if (question.taskKind === "MULTISHAPE_FORWARD") {
    if (question.sourceShape === "CIRCLE") {
      const circle = body.match(/<circle\b[^>]*fill="white"[^>]*\/>/);
      if (circle?.index !== undefined) return openEnd + 1 + circle.index + circle[0].length;
    } else {
      const rect = body.match(/<rect\b[^>]*\/>/);
      if (rect?.index !== undefined) return openEnd + 1 + rect.index + rect[0].length;
    }
  }
  return null;
}

function scaleWrongForwardOption(svg: string, question: PfcTpfEnglishReviewQuestionV1, factor: number): string {
  const boundaryEnd = answerBoundaryEnd(svg, question);
  if (boundaryEnd === null) return svg;
  const closeStart = svg.lastIndexOf("</svg>");
  if (closeStart < boundaryEnd) return svg;
  const centerX = question.sourceShape === "RECTANGLE" ? 60 : 50;
  const centerY = question.sourceShape === "RECTANGLE" ? 40 : 50;
  return `${svg.slice(0, boundaryEnd)}${scaleCutMarkup(svg.slice(boundaryEnd, closeStart), centerX, centerY, factor)}${svg.slice(closeStart)}`;
}

function insertExtraTransparentCut(svg: string, question: PfcTpfEnglishReviewQuestionV1, seed: number): string {
  const close = svg.lastIndexOf("</svg>");
  if (close < 0) return svg;
  const positions = question.sourceShape === "RECTANGLE"
    ? [[30, 18], [90, 18], [30, 62], [90, 62]]
    : [[28, 28], [72, 28], [28, 72], [72, 72]];
  const [cx, cy] = positions[seed % positions.length];
  const cut = `<circle cx="${cx}" cy="${cy}" r="3.2" fill="none" stroke="#111" stroke-width="1.6" data-cutout="transparent" data-perceptual-distractor="true"/>`;
  return `${svg.slice(0, close)}${cut}${svg.slice(close)}`;
}

function remediateForwardPerceptualAmbiguity(question: PfcTpfEnglishReviewQuestionV1): PfcTpfEnglishReviewQuestionV1 {
  if (question.taskKind !== "LEGACY_FORWARD" && question.taskKind !== "MULTISHAPE_FORWARD") return question;
  let options = question.options.map((option) => ({ ...option }));
  const correctIndex = options.findIndex((option) => option.optionId === question.correctOptionId);
  if (correctIndex < 0) throw new Error(`${question.reviewQuestionId} has no correct option.`);
  const factors = [0.58, 0.72, 0.48, 0.82, 0.4, 0.66];

  for (let pass = 0; pass < 12; pass += 1) {
    const probe = { ...question, options };
    const pair = closestForwardPair(probe);
    if (pair.distance + 1e-9 >= PFC_TPF_REVIEW_V1_3_FORWARD_MIN_GEOMETRIC_DISTANCE) break;
    let target = pair.right === correctIndex ? pair.left : pair.right;
    if (target === correctIndex) target = pair.left === correctIndex ? pair.right : pair.left;
    if (target === correctIndex) throw new Error(`${question.reviewQuestionId} perceptual remediation selected the correct option.`);
    const option = options[target];
    const svg = pass < factors.length
      ? scaleWrongForwardOption(option.svg, question, factors[pass])
      : insertExtraTransparentCut(option.svg, question, pass + target);
    options[target] = { ...option, svg };
  }

  const remediated = { ...question, options };
  const distance = minimumForwardOptionGeometricDistanceV1_3(remediated);
  if (distance + 1e-9 < PFC_TPF_REVIEW_V1_3_FORWARD_MIN_GEOMETRIC_DISTANCE) {
    throw new Error(`${question.reviewQuestionId} remains perceptually ambiguous at ${distance.toFixed(3)}.`);
  }
  return remediated;
}

export function generatePfcTpfSourceSaturatedEnglishReviewV1_3(): PfcTpfEnglishReviewQuestionV1[] {
  return generatePfcTpfSourceSaturatedEnglishReviewV1_2().map(remediateForwardPerceptualAmbiguity);
}

export function renderPfcTpfSourceSaturatedEnglishReviewHtmlV1_3(
  questions: readonly PfcTpfEnglishReviewQuestionV1[],
): string {
  return renderPfcTpfSourceSaturatedEnglishReviewHtmlV1_2(questions)
    .replaceAll("PFC / TPF Source-Saturated English Learner Review V1.2", "PFC / TPF Source-Saturated English Learner Review V1.3")
    .replaceAll(PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_2.authorityId, PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_3.authorityId);
}
