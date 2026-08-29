import {
  PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_1,
  generatePfcTpfSourceSaturatedEnglishReviewV1_1,
  renderPfcTpfSourceSaturatedEnglishReviewHtmlV1_1,
} from "./paper-folding-source-saturated-english-review-v1-1";
import type {
  PfcTpfEnglishReviewQuestionV1,
  PfcTpfReviewOptionV1,
  PfcTpfReviewTaskKindV1,
} from "./paper-folding-source-saturated-english-review-v1";

export const PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_2 = Object.freeze({
  ...PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_1,
  authorityId: "PFC-TPF-SOURCE-SATURATED-ENGLISH-REVIEW-V1.2" as const,
  supersedesReviewCandidate: PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_1.authorityId,
  presentationRemediation: [
    "UNIQUE_INLINE_SVG_ID_NAMESPACE",
    "SVG_XMLNS_AND_RESPONSIVE_LOADING_HARDENING",
    "TRANSPARENT_OPAQUE_PAPER_CUTOUTS",
    "PAIRWISE_OPTION_VISUAL_DISTANCE_GATE",
    "NEAR_DUPLICATE_DISTRACTOR_REMEDIATION",
  ] as const,
  status: "LEARNER_REVIEW_CANDIDATE_V1_2_NOT_FROZEN" as const,
} as const);

const NUMBER_RE = /-?\d+(?:\.\d+)?/g;
const PRIMITIVE_RE = /<(circle|line|polygon|polyline|rect|path)\b[^>]*\/?\s*>/g;
const SVG_RE = /<svg\b[\s\S]*?<\/svg>/g;
const BLACK_CUT_FILL_RE = /fill="(?:#111|black)"/;

export const PFC_TPF_REVIEW_V1_2_FORWARD_MIN_VISUAL_DISTANCE = 0.2;
export const PFC_TPF_REVIEW_V1_2_REVERSE_MIN_VISUAL_DISTANCE = 0.08;
export const PFC_TPF_REVIEW_V1_2_TPF_MIN_VISUAL_DISTANCE = 0.12;

function roundToBin(value: number, bin = 5): number {
  return Math.round(value / bin) * bin;
}

function normalizePrimitiveToken(tag: string): string {
  return tag
    .replace(/\s(?:fill|stroke|stroke-width|stroke-linecap|stroke-linejoin|style|role|aria-label|xmlns|width|height|data-[a-z-]+)="[^"]*"/g, "")
    .replace(NUMBER_RE, (raw) => String(roundToBin(Number(raw))))
    .replace(/\s+/g, " ")
    .trim();
}

function visualTokens(svg: string): Set<string> {
  return new Set((svg.match(PRIMITIVE_RE) ?? []).map(normalizePrimitiveToken));
}

function variableTokenSets(options: readonly PfcTpfReviewOptionV1[]): Set<string>[] {
  const sets = options.map((option) => visualTokens(option.svg));
  if (sets.length === 0) return [];
  const common = new Set(sets[0]);
  for (const set of sets.slice(1)) {
    for (const token of [...common]) if (!set.has(token)) common.delete(token);
  }
  return sets.map((set) => new Set([...set].filter((token) => !common.has(token))));
}

function jaccardDistance(left: Set<string>, right: Set<string>): number {
  const union = new Set([...left, ...right]);
  if (union.size === 0) return 0;
  let intersection = 0;
  for (const token of left) if (right.has(token)) intersection += 1;
  return 1 - intersection / union.size;
}

export function minimumOptionVisualDistanceV1_2(question: Pick<PfcTpfEnglishReviewQuestionV1, "options">): number {
  const sets = variableTokenSets(question.options);
  let minimum = 1;
  for (let left = 0; left < sets.length; left += 1) {
    for (let right = left + 1; right < sets.length; right += 1) {
      minimum = Math.min(minimum, jaccardDistance(sets[left], sets[right]));
    }
  }
  return minimum;
}

function thresholdForTask(taskKind: PfcTpfReviewTaskKindV1): number {
  if (taskKind === "LEGACY_FORWARD" || taskKind === "MULTISHAPE_FORWARD") {
    return PFC_TPF_REVIEW_V1_2_FORWARD_MIN_VISUAL_DISTANCE;
  }
  if (taskKind === "REVERSE_INFERENCE") return PFC_TPF_REVIEW_V1_2_REVERSE_MIN_VISUAL_DISTANCE;
  return PFC_TPF_REVIEW_V1_2_TPF_MIN_VISUAL_DISTANCE;
}

function closestPair(question: Pick<PfcTpfEnglishReviewQuestionV1, "options">): { distance: number; left: number; right: number } {
  const sets = variableTokenSets(question.options);
  let best = { distance: 1, left: 0, right: 1 };
  for (let left = 0; left < sets.length; left += 1) {
    for (let right = left + 1; right < sets.length; right += 1) {
      const distance = jaccardDistance(sets[left], sets[right]);
      if (distance < best.distance) best = { distance, left, right };
    }
  }
  return best;
}

function scaled(value: number, center: number, factor: number): number {
  return Math.round((center + (value - center) * factor) * 1000) / 1000;
}

function scalePoints(raw: string, centerX: number, centerY: number, factor: number): string {
  const values = raw.match(NUMBER_RE)?.map(Number) ?? [];
  if (values.length < 2) return raw;
  const scaledValues = values.map((value, index) => scaled(value, index % 2 === 0 ? centerX : centerY, factor));
  let index = 0;
  return raw.replace(NUMBER_RE, () => String(scaledValues[index++]));
}

function scaleMarkCoordinates(markup: string, centerX: number, centerY: number, factor: number): string {
  return markup
    .replace(/\b(cx|x1|x2)="(-?\d+(?:\.\d+)?)"/g, (_match, key: string, raw: string) => `${key}="${scaled(Number(raw), centerX, factor)}"`)
    .replace(/\b(cy|y1|y2)="(-?\d+(?:\.\d+)?)"/g, (_match, key: string, raw: string) => `${key}="${scaled(Number(raw), centerY, factor)}"`)
    .replace(/\bpoints="([^"]+)"/g, (_match, raw: string) => `points="${scalePoints(raw, centerX, centerY, factor)}"`);
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

function scaleForwardWrongOption(
  svg: string,
  question: PfcTpfEnglishReviewQuestionV1,
  factor: number,
): string {
  const boundaryEnd = answerBoundaryEnd(svg, question);
  if (boundaryEnd === null) return svg;
  const closeStart = svg.lastIndexOf("</svg>");
  const centerX = question.sourceShape === "RECTANGLE" ? 60 : 50;
  const centerY = question.sourceShape === "RECTANGLE" ? 40 : 50;
  const before = svg.slice(0, boundaryEnd);
  const marks = svg.slice(boundaryEnd, closeStart);
  return `${before}${scaleMarkCoordinates(marks, centerX, centerY, factor)}${svg.slice(closeStart)}`;
}

function insertBeforeLastSvgClose(svg: string, fragment: string): string {
  const index = svg.lastIndexOf("</svg>");
  if (index < 0) return svg;
  return `${svg.slice(0, index)}${fragment}${svg.slice(index)}`;
}

function injectDistinctDistractor(
  svg: string,
  question: PfcTpfEnglishReviewQuestionV1,
  seed: number,
): string {
  if (question.taskKind === "TRANSPARENT_SUPERPOSITION") {
    const y = 16 + (seed % 4) * 8;
    return insertBeforeLastSvgClose(
      svg,
      `<line x1="16" y1="${y}" x2="29" y2="${y + 6}" stroke="#111" stroke-width="1.7" stroke-linecap="round" data-distinct-distractor="true"/>`,
    );
  }
  const rectangle = question.sourceShape === "RECTANGLE";
  const positions = rectangle
    ? [[28, 20], [92, 20], [28, 60], [92, 60]]
    : [[24, 24], [76, 24], [24, 76], [76, 76]];
  const [cx, cy] = positions[seed % positions.length];
  return insertBeforeLastSvgClose(
    svg,
    `<circle cx="${cx}" cy="${cy}" r="3.1" fill="none" stroke="#111" stroke-width="1.6" data-cutout="transparent" data-distinct-distractor="true"/>`,
  );
}

function remediateNearDuplicateOptions(question: PfcTpfEnglishReviewQuestionV1): PfcTpfEnglishReviewQuestionV1 {
  const threshold = thresholdForTask(question.taskKind);
  let options = question.options.map((option) => ({ ...option }));
  const correctIndex = options.findIndex((option) => option.optionId === question.correctOptionId);
  if (correctIndex < 0) throw new Error(`${question.reviewQuestionId} has no correct option.`);

  for (let pass = 0; pass < 8; pass += 1) {
    const probe = { ...question, options };
    const pair = closestPair(probe);
    if (pair.distance + 1e-9 >= threshold) break;
    let target = pair.right === correctIndex ? pair.left : pair.right;
    if (target === correctIndex) target = pair.left === correctIndex ? pair.right : pair.left;
    if (target === correctIndex) throw new Error(`${question.reviewQuestionId} ambiguity remediation selected the correct option.`);

    const option = options[target];
    let svg = option.svg;
    if ((question.taskKind === "LEGACY_FORWARD" || question.taskKind === "MULTISHAPE_FORWARD") && pass < 4) {
      svg = scaleForwardWrongOption(svg, question, [0.72, 0.62, 0.54, 0.46][pass]);
    } else {
      svg = injectDistinctDistractor(svg, question, pass + target);
    }
    options[target] = { ...option, svg };
  }

  const remediated = { ...question, options };
  const minimum = minimumOptionVisualDistanceV1_2(remediated);
  if (minimum + 1e-9 < threshold) {
    throw new Error(`${question.reviewQuestionId} remains visually ambiguous at distance ${minimum.toFixed(3)} < ${threshold}.`);
  }
  return remediated;
}

function transparentizeOpaqueCutouts(markup: string): string {
  const rewrite = (tag: string) => {
    if (!BLACK_CUT_FILL_RE.test(tag)) return tag;
    let next = tag.replace(BLACK_CUT_FILL_RE, 'fill="none" data-cutout="transparent"');
    if (!/\bstroke=/.test(next)) next = next.replace(/\/>$/, ' stroke="#111" stroke-width="1.6"/>');
    return next;
  };
  return markup
    .replace(/<circle\b[^>]*\/>/g, rewrite)
    .replace(/<polygon\b[^>]*\/>/g, rewrite)
    .replace(/<polyline\b[^>]*fill="white"[^>]*stroke="#111"[^>]*\/>/g, (tag) =>
      tag.replace('fill="white"', 'fill="none" data-cutout="transparent"'),
    );
}

function namespaceSvgMarkup(markup: string, namespace: string): string {
  let svgIndex = 0;
  return markup.replace(SVG_RE, (segment) => {
    const prefix = `${namespace}-svg${svgIndex++}`.replace(/[^A-Za-z0-9_-]/g, "-");
    let next = /<svg\b[^>]*\bxmlns=/.test(segment)
      ? segment
      : segment.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
    const ids = [...new Set([...next.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]))];
    for (const id of ids) {
      const namespaced = `${prefix}-${id}`;
      next = next
        .replaceAll(`id="${id}"`, `id="${namespaced}"`)
        .replaceAll(`url(#${id})`, `url(#${namespaced})`)
        .replaceAll(`href="#${id}"`, `href="#${namespaced}"`)
        .replaceAll(`xlink:href="#${id}"`, `xlink:href="#${namespaced}"`);
    }
    return next;
  });
}

function hardenQuestionMarkup(question: PfcTpfEnglishReviewQuestionV1, index: number): PfcTpfEnglishReviewQuestionV1 {
  const remediated = remediateNearDuplicateOptions(question);
  const opaque = remediated.chapterCode === "PFC-001";
  const stimulusBase = opaque ? transparentizeOpaqueCutouts(remediated.stimulusSvg) : remediated.stimulusSvg;
  const stimulusSvg = namespaceSvgMarkup(stimulusBase, `${remediated.reviewQuestionId}-stimulus-${index}`);
  const options = remediated.options.map((option) => {
    const base = opaque ? transparentizeOpaqueCutouts(option.svg) : option.svg;
    return {
      ...option,
      svg: namespaceSvgMarkup(base, `${remediated.reviewQuestionId}-option-${option.optionId}`),
    };
  });
  return { ...remediated, stimulusSvg, options };
}

export function generatePfcTpfSourceSaturatedEnglishReviewV1_2(): PfcTpfEnglishReviewQuestionV1[] {
  return generatePfcTpfSourceSaturatedEnglishReviewV1_1().map(hardenQuestionMarkup);
}

export function renderPfcTpfSourceSaturatedEnglishReviewHtmlV1_2(
  questions: readonly PfcTpfEnglishReviewQuestionV1[],
): string {
  return renderPfcTpfSourceSaturatedEnglishReviewHtmlV1_1(questions)
    .replaceAll("PFC / TPF Source-Saturated English Learner Review V1.1", "PFC / TPF Source-Saturated English Learner Review V1.2")
    .replaceAll(PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_1.authorityId, PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_2.authorityId)
    .replace("</style>", "svg{display:block;max-width:100%;height:auto} .options>div{min-width:0}</style>");
}
