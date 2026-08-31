import { COM003_PERMANENT_QLS } from "./com003-permanent-ql-allocation";
import { generateCom003ReviewQuestionV3 } from "./com003-review-synthesis-v3";
import type { Com003ReviewQuestion } from "./com003-review-types";

function requestedAnswerRole(surfaceMode: string) {
  if (/ACTION_TO_SHORTCUT|SLIDESHOW_ACTION_TO_SHORTCUT|FORMATTING_SHORTCUT/i.test(surfaceMode)) return "shortcut";
  if (/SHORTCUT_TO_ACTION/i.test(surfaceMode)) return "action";
  if (/EXTENSION_TO_TYPE/i.test(surfaceMode)) return "file type";
  if (/TYPE_TO_EXTENSION/i.test(surfaceMode)) return "file extension";
  if (/FEATURE_FROM|OBJECT_FROM|APPLICATION_FROM/i.test(surfaceMode)) return "feature or application";
  if (/PURPOSE_FROM|EFFECT_FROM|COMMAND_TO_EFFECT/i.test(surfaceMode)) return "purpose or effect";
  if (/EFFECT_TO_COMMAND/i.test(surfaceMode)) return "command";
  if (/OPERATION_TO_OPERATOR/i.test(surfaceMode)) return "operator";
  if (/FUNCTION_FROM|AUTOSUM/i.test(surfaceMode)) return "function or feature";
  if (/REFERENCE/i.test(surfaceMode)) return "reference type";
  if (/CHART_FROM/i.test(surfaceMode)) return "chart type";
  if (/ALIGNMENT/i.test(surfaceMode)) return "alignment";
  if (/ORIENTATION/i.test(surfaceMode)) return "orientation";
  if (/COMPONENT_FROM/i.test(surfaceMode)) return "component";
  if (/STRUCTURE|PRESENTATION_CONCEPT|DOCUMENT_CONCEPT/i.test(surfaceMode)) return "concept";
  return "answer";
}

function ensureTerminalPeriod(value: string) {
  const trimmed = value.trim();
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function explanationTail(question: Com003ReviewQuestion, index: number) {
  const role = requestedAnswerRole(question.surfaceMode);
  const answer = question.canonicalAnswer;
  const variants = [
    `Therefore, the required ${role} is ${answer}.`,
    `So ${answer} is the ${role} that matches the question.`,
    `Hence, select ${answer} as the correct ${role}.`,
    `This makes ${answer} the appropriate ${role} for the given prompt.`,
    `Accordingly, ${answer} is the ${role} identified by the stated condition.`,
    `For this question, the matching ${role} is ${answer}.`,
  ];
  return variants[index % variants.length]!;
}

export function generateCom003ReviewQuestionV4(qlId: string, seed: string, index = 0) {
  const base = generateCom003ReviewQuestionV3(qlId, seed, index);
  return {
    ...base,
    questionId: base.questionId.replace("COM003-REVIEW-V3-", "COM003-REVIEW-V4-"),
    explanation: `${ensureTerminalPeriod(base.explanation)} ${explanationTail(base, index)}`,
  };
}

export function buildCom003EnglishReviewCorpusV4(options: { perQl?: number; seedPrefix?: string } = {}) {
  const perQl = options.perQl ?? 12;
  const seedPrefix = options.seedPrefix ?? "com003-review-v4";
  if (!Number.isInteger(perQl) || perQl < 1 || perQl > 50) throw new Error("perQl must be between 1 and 50");
  return COM003_PERMANENT_QLS.flatMap((ql) =>
    Array.from({ length: perQl }, (_, index) =>
      generateCom003ReviewQuestionV4(ql.qlId, `${seedPrefix}:${ql.qlId}:${index}`, index),
    ),
  );
}

export const COM003_ENGLISH_REVIEW_CORPUS_V4 = buildCom003EnglishReviewCorpusV4();
