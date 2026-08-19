import {
  PFC_TPF_REVIEW_V1_3_FORWARD_MIN_GEOMETRIC_DISTANCE,
  PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_3,
  generatePfcTpfSourceSaturatedEnglishReviewV1_3,
  minimumForwardOptionGeometricDistanceV1_3,
} from "./paper-folding-source-saturated-english-review-v1-3";
import type {
  PfcTpfEnglishReviewQuestionV1,
  PfcTpfReviewOptionV1,
} from "./paper-folding-source-saturated-english-review-v1";

export const PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_4 = Object.freeze({
  ...PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_3,
  authorityId: "PFC-TPF-SOURCE-SATURATED-ENGLISH-REVIEW-V1.4" as const,
  supersedesReviewCandidate: PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_3.authorityId,
  presentationRemediationV1_4: [
    "NO_SYNTHETIC_EXTRA_CUTOUT_DISTRACTOR_MARKS",
    "COHERENT_WHOLE_PATTERN_DISTRACTOR_DISPLACEMENT_ONLY",
    "FIXED_STIMULUS_STAGE_HEIGHT_BY_TASK",
    "FIXED_OPTION_ART_STAGE",
    "NO_RESPONSIVE_VIEWBOX_SHRINKING_OF_LEARNER_DIAGRAMS",
  ] as const,
  status: "LEARNER_REVIEW_CANDIDATE_V1_4_NOT_FROZEN" as const,
} as const);

const NUMBER_RE = /-?\d+(?:\.\d+)?/g;
const SYNTHETIC_MARK_RE = /<(?:circle|line|polygon|polyline|path)\b[^>]*(?:data-perceptual-distractor|data-distinct-distractor)="true"[^>]*\/?\s*>/gi;
const SYNTHETIC_MARK_TEST_RE = /data-(?:perceptual|distinct)-distractor="true"/i;

const esc = (value: string) => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;");

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

function removeSyntheticDistractorMarks(option: PfcTpfReviewOptionV1): PfcTpfReviewOptionV1 {
  return { ...option, svg: option.svg.replace(SYNTHETIC_MARK_RE, "") };
}

function cleanForwardDistractors(question: PfcTpfEnglishReviewQuestionV1): PfcTpfEnglishReviewQuestionV1 {
  if (question.taskKind !== "LEGACY_FORWARD" && question.taskKind !== "MULTISHAPE_FORWARD") return question;
  const hadSynthetic = question.options.some((option) => SYNTHETIC_MARK_TEST_RE.test(option.svg));
  let options = question.options.map(removeSyntheticDistractorMarks);
  if (!hadSynthetic) return { ...question, options };

  const correctIndex = options.findIndex((option) => option.optionId === question.correctOptionId);
  if (correctIndex < 0) throw new Error(`${question.reviewQuestionId} has no correct option.`);
  const coherentFactors = [0.34, 0.52, 0.70];
  let factorIndex = 0;
  for (let index = 0; index < options.length; index += 1) {
    if (index === correctIndex) continue;
    options[index] = {
      ...options[index],
      svg: scaleWrongForwardOption(options[index].svg, question, coherentFactors[factorIndex++]),
    };
  }

  let candidate = { ...question, options };
  let distance = minimumForwardOptionGeometricDistanceV1_3(candidate);
  const fallbackFactors = [0.24, 0.44, 0.62];
  const wrongIndices = options.map((_option, index) => index).filter((index) => index !== correctIndex);
  for (let pass = 0; pass < fallbackFactors.length && distance + 1e-9 < PFC_TPF_REVIEW_V1_3_FORWARD_MIN_GEOMETRIC_DISTANCE; pass += 1) {
    const target = wrongIndices[pass % wrongIndices.length];
    if (target !== undefined) {
      options[target] = {
        ...options[target],
        svg: scaleWrongForwardOption(options[target].svg, question, fallbackFactors[pass]),
      };
    }
    candidate = { ...question, options };
    distance = minimumForwardOptionGeometricDistanceV1_3(candidate);
  }
  if (distance + 1e-9 < PFC_TPF_REVIEW_V1_3_FORWARD_MIN_GEOMETRIC_DISTANCE) {
    throw new Error(`${question.reviewQuestionId} cannot be cleaned without reintroducing ambiguous distractors (${distance.toFixed(3)}).`);
  }
  return candidate;
}

export function generatePfcTpfSourceSaturatedEnglishReviewV1_4(): PfcTpfEnglishReviewQuestionV1[] {
  return generatePfcTpfSourceSaturatedEnglishReviewV1_3().map(cleanForwardDistractors);
}

function stimulusClass(question: PfcTpfEnglishReviewQuestionV1): string {
  if (question.taskKind === "LEGACY_FORWARD") return "stimulus-stage stimulus-sequence";
  if (question.taskKind === "MULTISHAPE_FORWARD") return "stimulus-stage stimulus-panels";
  if (question.taskKind === "REVERSE_INFERENCE") return "stimulus-stage stimulus-reverse-result";
  return "stimulus-stage stimulus-single";
}

function optionClass(question: PfcTpfEnglishReviewQuestionV1): string {
  return question.taskKind === "REVERSE_INFERENCE" ? "option-art option-process" : "option-art option-pattern";
}

export function renderPfcTpfSourceSaturatedEnglishReviewHtmlV1_4(
  questions: readonly PfcTpfEnglishReviewQuestionV1[],
): string {
  const cards = questions.map((question) => `<article class="question-card"><div class="meta">${esc(question.reviewQuestionId)} · ${esc(question.chapterCode)} · ${esc(question.proposalId)} · ${esc(question.sourceId)}</div><h2>${esc(question.proposalName)}</h2><p class="stem"><strong>Question:</strong> ${esc(question.stem)}</p><div class="${stimulusClass(question)}">${question.stimulusSvg}</div><div class="options">${question.options.map((option) => `<div class="option-cell"><div class="option-label">${option.optionId}</div><div class="${optionClass(question)}">${option.svg}</div></div>`).join("")}</div><p class="answer"><strong>Answer:</strong> ${question.correctOptionId}</p><p class="explanation"><strong>Explanation:</strong> ${esc(question.explanation)}</p></article>`).join("\n");

  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PFC / TPF Source-Saturated English Learner Review V1.4</title><style>
html,body{background:#fff;color:#111}*{box-sizing:border-box}body{font-family:Arial,Helvetica,sans-serif;max-width:1180px;margin:0 auto;padding:22px}.question-card{border-top:1px solid #aaa;padding:24px 0 30px;background:#fff;break-inside:avoid}.meta{font-size:12px;color:#555}.question-card h2{font-size:18px;margin:5px 0 7px}.stem{font-size:16px;line-height:1.45;margin:8px 0 14px}.stimulus-stage{height:250px;min-height:250px;width:100%;display:flex;align-items:center;background:#fff;overflow-x:auto;overflow-y:hidden;padding:8px 4px}.stimulus-stage svg{display:block;max-width:none!important;flex:0 0 auto}.stimulus-sequence>svg{height:210px!important;width:auto!important;margin:0 auto}.stimulus-panels>div{display:flex!important;align-items:center!important;gap:10px!important;max-width:none!important;flex:0 0 auto;margin:0 auto}.stimulus-panels>div>svg{width:160px!important;height:160px!important}.stimulus-reverse-result>div{display:flex!important;align-items:center!important;min-height:210px;flex:0 0 auto;margin:0 auto}.stimulus-reverse-result>div svg{width:190px!important;height:190px!important}.stimulus-single>svg{width:210px!important;height:210px!important;margin:0 auto}.options{display:grid;grid-template-columns:repeat(4,minmax(170px,1fr));gap:18px;margin:20px 0 12px;background:#fff}.option-cell{text-align:center;background:#fff;min-width:0}.option-label{font-weight:700;margin-bottom:5px}.option-art{height:170px;min-height:170px;width:100%;display:flex;align-items:center;justify-content:center;background:#fff;overflow:hidden}.option-pattern>svg{width:150px!important;height:150px!important;max-width:none!important;flex:0 0 auto}.option-process{justify-content:flex-start;overflow-x:auto;overflow-y:hidden}.option-process>div{display:flex!important;align-items:center!important;gap:6px!important;max-width:none!important;flex:0 0 auto}.option-process>div>svg{width:105px!important;height:105px!important;max-width:none!important;flex:0 0 auto}.answer{margin:10px 0 4px}.explanation{margin:4px 0;line-height:1.5}@media(max-width:760px){body{padding:14px}.options{grid-template-columns:repeat(2,minmax(145px,1fr));gap:14px}.stimulus-stage{height:230px;min-height:230px}.stimulus-sequence>svg{height:195px!important}.stimulus-panels>div>svg{width:150px!important;height:150px!important}.stimulus-single>svg{width:195px!important;height:195px!important}}
</style></head><body><h1 style="font-size:25px;margin:0 0 8px">PFC / TPF Source-Saturated English Learner Review V1.4</h1><p style="line-height:1.5;margin:0 0 10px">48 deliberate learner-facing questions: 8 for each source-saturated skill proposal. V1.4 removes synthetic distractor marks and normalizes stimulus/option presentation so comparable diagrams use the same learner-facing scale. Correct answers continue to come from executable semantic solvers. This remains review-only.</p><p style="font-size:13px;color:#444;margin:0 0 18px">Authority: ${PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_4.authorityId}</p>${cards}</body></html>`;
}

export function countSyntheticDistractorMarksV1_4(questions: readonly PfcTpfEnglishReviewQuestionV1[]): number {
  let count = 0;
  for (const question of questions) {
    const markup = [question.stimulusSvg, ...question.options.map((option) => option.svg)].join("\n");
    count += (markup.match(/data-(?:perceptual|distinct)-distractor="true"/g) ?? []).length;
  }
  return count;
}
