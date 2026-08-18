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

function completeResultWrapping(question: IntCp007EnglishQuestionV6): IntCp007EnglishQuestionV6["explanation"] {
  const steps = [...question.explanation.steps];

  if (question.qlId === "INT-QL-111") {
    const plain = `The required annual rate is ${question.correctAnswer}.`;
    const wrapped = `The required annual rate is ${latexPercent(question.correctAnswer)}.`;
    if (!steps[4]?.includes(plain)) {
      throw new Error(`${question.qlId}/${question.seed}: V7 could not find the plain final-rate sentence`);
    }
    steps[4] = steps[4]!.replace(plain, wrapped);
  }

  if (question.qlId === "INT-QL-113") {
    const plain = `Hence Principal A : Principal B is ${question.correctAnswer}.`;
    const wrapped = `Hence the required present-principal ratio is ${latexRatio(question.correctAnswer)}.`;
    if (!steps[4]?.includes(plain)) {
      throw new Error(`${question.qlId}/${question.seed}: V7 could not find the plain final-ratio sentence`);
    }
    steps[4] = steps[4]!.replace(plain, wrapped);
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
