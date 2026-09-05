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

function curateQl004V4(question: Com003ReviewQuestion, index: number) {
  if (question.qlId !== "COM-003-QL-004") return question;

  if (question.surfaceMode === "DOCUMENT_CONCEPT" && question.targetFactId === "com003-word-word-processor") {
    const stems = [
      "Which Microsoft application is primarily used for word processing?",
      "Which Office application is designed mainly for creating and editing text documents?",
      "A word-processing application for creating and editing documents is which of the following?",
      "Which Microsoft Office program is associated with word-processing tasks?",
      "Which application would you use primarily to create and edit a text document?",
      "Which Office program belongs to the word-processing category?",
      "Which Microsoft Office application is intended for document writing and editing?",
      "Which program is most closely associated with preparing text-based documents in Microsoft Office?",
      "For creating letters and other text documents, which Office application is normally used?",
      "Which Microsoft program is classified as a word processor?",
      "Which Office application is used mainly to compose and format written documents?",
      "Which Microsoft Office program provides standard word-processing tools?",
    ];
    return {
      ...question,
      stem: stems[index % stems.length]!,
      explanation: "Microsoft Word is a word-processing application used to create, edit, and format text documents.",
    };
  }

  if (question.surfaceMode === "FORMAT_CONTROL_FROM_EFFECT") {
    const answer = question.canonicalAnswer.toLowerCase();
    const stemsByAnswer: Record<string, readonly string[]> = {
      bold: [
        "In Microsoft Word, which formatting command makes selected text appear heavier and darker than surrounding text?",
        "Which Word text-formatting control emphasizes selected characters by increasing their visual weight?",
        "Which formatting option gives selected text a thicker, more prominent appearance?",
      ],
      italic: [
        "In Microsoft Word, which formatting command slants selected text to the right?",
        "Which Word text-formatting control gives selected characters a slanted appearance?",
        "Which formatting option is used when selected text should appear inclined rather than upright?",
      ],
      underline: [
        "In Microsoft Word, which formatting command places a line beneath selected text?",
        "Which Word text-formatting control adds a line below the selected characters?",
        "Which formatting option marks selected text with a line directly underneath it?",
      ],
    };
    const stems = stemsByAnswer[answer];
    if (stems) {
      return {
        ...question,
        stem: stems[index % stems.length]!,
      };
    }
  }

  return question;
}

export function generateCom003ReviewQuestionV4(qlId: string, seed: string, index = 0) {
  const base = generateCom003ReviewQuestionV3(qlId, seed, index);
  const curated = curateQl004V4(base, index);
  return {
    ...curated,
    questionId: curated.questionId.replace("COM003-REVIEW-V3-", "COM003-REVIEW-V4-"),
    explanation: `${ensureTerminalPeriod(curated.explanation)} ${explanationTail(curated, index)}`,
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
