import {
  PFC_TPF_REVIEW_V1_3_FORWARD_MIN_GEOMETRIC_DISTANCE,
  PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_3,
  generatePfcTpfSourceSaturatedEnglishReviewV1_3,
  minimumForwardOptionGeometricDistanceV1_3,
} from "./paper-folding-source-saturated-english-review-v1-3";
import {
  PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_4,
  renderPfcTpfSourceSaturatedEnglishReviewHtmlV1_4,
} from "./paper-folding-source-saturated-english-review-v1-4";
import type {
  PfcTpfEnglishReviewQuestionV1,
  PfcTpfReviewOptionV1,
} from "./paper-folding-source-saturated-english-review-v1";

export const PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_4_1 = Object.freeze({
  ...PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_4,
  authorityId: "PFC-TPF-SOURCE-SATURATED-ENGLISH-REVIEW-V1.4.1" as const,
  supersedesReviewCandidate: PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_4.authorityId,
  distractorRemediation: [
    "FOLD_EDGE_V_NOTCH_TOPOLOGY_ALTERNATIVES",
    "MIXED_CUT_COHERENT_INCOMPLETE_AND_COMPRESSED_ALTERNATIVES",
    "NO_ARBITRARY_EXTRA_HOLES_OR_MARKS",
  ] as const,
  status: "LEARNER_REVIEW_CANDIDATE_V1_4_1_NOT_FROZEN" as const,
} as const);

const NUMBER_RE = /-?\d+(?:\.\d+)?/g;
const SYNTHETIC_MARK_RE = /<(?:circle|line|polygon|polyline|path)\b[^>]*(?:data-perceptual-distractor|data-distinct-distractor)="true"[^>]*\/?\s*>/gi;
const q = (value: number) => Math.round(value * 1000) / 1000;

function removeSynthetic(option: PfcTpfReviewOptionV1): PfcTpfReviewOptionV1 {
  return { ...option, svg: option.svg.replace(SYNTHETIC_MARK_RE, "") };
}

function foldEdgeDistractorSvg(question: PfcTpfEnglishReviewQuestionV1, kind: 0 | 1 | 2): string {
  const rectangle = question.sourceShape === "RECTANGLE";
  const width = rectangle ? 120 : 100;
  const height = rectangle ? 80 : 100;
  const pad = rectangle ? 9.6 : 8;
  const boundary = `<rect x="0" y="0" width="${width}" height="${height}" fill="white" stroke="#111" stroke-width="1.4"/>`;
  const diamond = (cx: number, cy: number, dx = 7, dy = 5) => `<polygon points="${q(cx - dx)},${q(cy)} ${q(cx)},${q(cy - dy)} ${q(cx + dx)},${q(cy)} ${q(cx)},${q(cy + dy)}" fill="none" data-cutout="transparent" stroke="#111" stroke-width="1.2" stroke-linejoin="round"/>`;
  let marks = "";
  if (kind === 0) {
    marks = diamond(width / 2, height * 0.68);
  } else if (kind === 1) {
    marks = `${diamond(width * 0.34, height * 0.34, 5.5, 4)}${diamond(width * 0.66, height * 0.34, 5.5, 4)}`;
  } else {
    const cx = width / 2;
    marks = `<line x1="${q(cx - 7)}" y1="0" x2="${q(cx + 7)}" y2="0" stroke="white" stroke-width="5" stroke-linecap="round"/><polyline points="${q(cx - 7)},0 ${q(cx)},9 ${q(cx + 7)},0" fill="none" data-cutout="transparent" stroke="#111" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${q(-pad)} ${q(-pad)} ${q(width + 2 * pad)} ${q(height + 2 * pad)}" width="150" height="150" style="background:#fff" role="img">${boundary}${marks}</svg>`;
}

function remediateFoldEdge(question: PfcTpfEnglishReviewQuestionV1): PfcTpfEnglishReviewQuestionV1 {
  let wrong = 0;
  const options = question.options.map((option) => option.optionId === question.correctOptionId
    ? removeSynthetic(option)
    : { ...option, svg: foldEdgeDistractorSvg(question, wrong++ as 0 | 1 | 2) });
  return { ...question, options };
}

function scaled(value: number, center: number, factor: number): number {
  return q(center + (value - center) * factor);
}

function scalePairs(raw: string, centerX: number, centerY: number, factor: number): string {
  const numbers = raw.match(NUMBER_RE)?.map(Number) ?? [];
  if (numbers.length < 2) return raw;
  const transformed = numbers.map((value, index) => scaled(value, index % 2 === 0 ? centerX : centerY, factor));
  let index = 0;
  return raw.replace(NUMBER_RE, () => String(transformed[index++]));
}

function scaleMarkup(markup: string, centerX: number, centerY: number, factor: number): string {
  return markup
    .replace(/\b(cx|x1|x2)="(-?\d+(?:\.\d+)?)"/g, (_m, key: string, raw: string) => `${key}="${scaled(Number(raw), centerX, factor)}"`)
    .replace(/\b(cy|y1|y2)="(-?\d+(?:\.\d+)?)"/g, (_m, key: string, raw: string) => `${key}="${scaled(Number(raw), centerY, factor)}"`)
    .replace(/\bpoints="([^"]+)"/g, (_m, raw: string) => `points="${scalePairs(raw, centerX, centerY, factor)}"`);
}

function scaleAnswerMarks(svg: string, factor: number): string {
  const openEnd = svg.indexOf(">");
  const closeStart = svg.lastIndexOf("</svg>");
  if (openEnd < 0 || closeStart < 0) return svg;
  const body = svg.slice(openEnd + 1, closeStart);
  const boundary = body.match(/<rect\b[^>]*\/>/);
  if (!boundary?.index && boundary?.index !== 0) return svg;
  const boundaryEnd = openEnd + 1 + boundary.index + boundary[0].length;
  return `${svg.slice(0, boundaryEnd)}${scaleMarkup(svg.slice(boundaryEnd, closeStart), 60, 40, factor)}${svg.slice(closeStart)}`;
}

function removeCutType(svg: string, type: "CIRCLE" | "POLYGON"): string {
  if (type === "CIRCLE") return svg.replace(/<circle\b[^>]*data-cutout="transparent"[^>]*\/?\s*>/gi, "");
  return svg.replace(/<polygon\b[^>]*data-cutout="transparent"[^>]*\/?\s*>/gi, "");
}

function remediateMixedCuts(question: PfcTpfEnglishReviewQuestionV1): PfcTpfEnglishReviewQuestionV1 {
  const correct = question.options.find((option) => option.optionId === question.correctOptionId);
  if (!correct) throw new Error(`${question.reviewQuestionId} has no correct option.`);
  const correctSvg = removeSynthetic(correct).svg;
  const alternatives = [
    scaleAnswerMarks(correctSvg, 0.56),
    removeCutType(correctSvg, "POLYGON"),
    removeCutType(correctSvg, "CIRCLE"),
  ];
  let wrong = 0;
  const options = question.options.map((option) => option.optionId === question.correctOptionId
    ? { ...option, svg: correctSvg }
    : { ...option, svg: alternatives[wrong++] });
  return { ...question, options };
}

function remediateQuestion(question: PfcTpfEnglishReviewQuestionV1): PfcTpfEnglishReviewQuestionV1 {
  let next = question;
  if (question.sourceId.includes("FOLD-EDGE-V-NOTCH")) next = remediateFoldEdge(question);
  else if (question.sourceId.includes("THREE-FOLD-MIXED-CUTS")) next = remediateMixedCuts(question);
  else next = { ...question, options: question.options.map(removeSynthetic) };

  if (next.taskKind === "LEGACY_FORWARD" || next.taskKind === "MULTISHAPE_FORWARD") {
    const distance = minimumForwardOptionGeometricDistanceV1_3(next);
    if (distance + 1e-9 < PFC_TPF_REVIEW_V1_3_FORWARD_MIN_GEOMETRIC_DISTANCE) {
      throw new Error(`${next.reviewQuestionId} remains ambiguous after V1.4.1 remediation at ${distance.toFixed(3)}.`);
    }
  }
  return next;
}

export function generatePfcTpfSourceSaturatedEnglishReviewV1_4_1(): PfcTpfEnglishReviewQuestionV1[] {
  return generatePfcTpfSourceSaturatedEnglishReviewV1_3().map(remediateQuestion);
}

export function renderPfcTpfSourceSaturatedEnglishReviewHtmlV1_4_1(
  questions: readonly PfcTpfEnglishReviewQuestionV1[],
): string {
  return renderPfcTpfSourceSaturatedEnglishReviewHtmlV1_4(questions)
    .replaceAll(PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_4.authorityId, PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_4_1.authorityId)
    .replaceAll("Learner Review V1.4", "Learner Review V1.4.1");
}

export function countSyntheticDistractorMarksV1_4_1(questions: readonly PfcTpfEnglishReviewQuestionV1[]): number {
  return questions.reduce((count, question) => count + ([question.stimulusSvg, ...question.options.map((option) => option.svg)].join("\n").match(/data-(?:perceptual|distinct)-distractor="true"/g) ?? []).length, 0);
}
