import {
  INT_CP007_ENGLISH_VERSION as INT_CP007_ENGLISH_VERSION_V6,
  generateIntCp007EnglishQuestion as generateV6,
  type IntCp007EnglishQuestion as IntCp007EnglishQuestionV6,
} from "./cp007-scheme-equivalence-english-v6";
import type { IntCp007QlId } from "./cp007-scheme-equivalence-runtime-v3-final";

export const INT_CP007_ENGLISH_VERSION = "INT-CP-007-EN-v7-latex-complete-review" as const;
export const INT_CP007_ENGLISH_V7_SUPERSEDES = INT_CP007_ENGLISH_VERSION_V6;

export type IntCp007EnglishQuestion = Omit<IntCp007EnglishQuestionV6, "englishVersion"> & {
  readonly englishVersion: typeof INT_CP007_ENGLISH_VERSION;
};

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const property of Reflect.ownKeys(objectValue)) {
    deepFreeze((objectValue as Record<PropertyKey, unknown>)[property], seen);
  }
  return Object.freeze(value);
}

function latexPercent(answer: string): string {
  if (!/^\d+(?:\.\d+)?%$/u.test(answer)) throw new Error(`CP007 V7 expected percent answer, got ${answer}`);
  return `$${answer.slice(0, -1)}\\%$`;
}

function latexRatio(answer: string): string {
  if (!/^\d+:\d+$/u.test(answer)) throw new Error(`CP007 V7 expected ratio answer, got ${answer}`);
  return `$P_A:P_B=${answer}$`;
}

function replaceSinglePlainAnswer(step: string, answer: string, wrapped: string, label: string): string {
  const token = `${answer}.`;
  const parts = step.split(token);
  if (parts.length !== 2) {
    throw new Error(`${label}: expected exactly one plain final-answer token, found ${parts.length - 1}`);
  }
  return `${parts[0]}${wrapped}.${parts[1]}`;
}

function completeResultWrapping(question: IntCp007EnglishQuestionV6): IntCp007EnglishQuestionV6["explanation"] {
  const steps = [...question.explanation.steps];

  if (question.qlId === "INT-QL-111") {
    if (!steps[4]) throw new Error(`${question.qlId}/${question.seed}: V7 missing final rate step`);
    steps[4] = replaceSinglePlainAnswer(
      steps[4],
      question.correctAnswer,
      latexPercent(question.correctAnswer),
      `${question.qlId}/${question.seed}: final rate`,
    );
  }

  if (question.qlId === "INT-QL-113") {
    if (!steps[4]) throw new Error(`${question.qlId}/${question.seed}: V7 missing final ratio step`);
    steps[4] = replaceSinglePlainAnswer(
      steps[4],
      question.correctAnswer,
      latexRatio(question.correctAnswer),
      `${question.qlId}/${question.seed}: final ratio`,
    );
  }

  return deepFreeze({
    ...question.explanation,
    steps: Object.freeze(steps),
  });
}

export function generateIntCp007EnglishQuestion(
  qlId: IntCp007QlId,
  seed: string,
  locale: "en-IN" = "en-IN",
): IntCp007EnglishQuestion {
  const source = generateV6(qlId, seed, locale);
  const explanation = completeResultWrapping(source);
  return deepFreeze({
    ...source,
    englishVersion: INT_CP007_ENGLISH_VERSION,
    explanation,
  });
}
