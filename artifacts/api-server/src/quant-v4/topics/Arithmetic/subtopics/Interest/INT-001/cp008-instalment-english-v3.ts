import {
  INT_CP008_ENGLISH_VERSION as INT_CP008_ENGLISH_VERSION_V2,
  generateIntCp008EnglishQuestion as generateV2,
  type IntCp008EnglishQuestion as IntCp008EnglishQuestionV2,
} from "./cp008-instalment-english-v2";
import type { IntCp008QlId } from "./cp008-instalment-runtime-v1-final";

export const INT_CP008_ENGLISH_VERSION = "INT-CP-008-EN-v3-money-editorial-review" as const;
export const INT_CP008_ENGLISH_V3_SUPERSEDES = INT_CP008_ENGLISH_VERSION_V2;

export type IntCp008EnglishQuestion = Omit<IntCp008EnglishQuestionV2, "englishVersion"> & {
  readonly englishVersion: typeof INT_CP008_ENGLISH_VERSION;
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

function indianInteger(value: bigint): string {
  const source = value.toString();
  if (source.length <= 3) return source;
  const tail = source.slice(-3);
  let head = source.slice(0, -3);
  const groups: string[] = [];
  while (head.length > 2) {
    groups.unshift(head.slice(-2));
    head = head.slice(0, -2);
  }
  if (head) groups.unshift(head);
  return `${groups.join(",")},${tail}`;
}

function roundedRupeeFraction(numeratorText: string, denominatorText: string): string {
  const numerator = BigInt(numeratorText);
  const denominator = BigInt(denominatorText);
  if (denominator <= 0n || numerator < 0n) throw new Error(`CP008 V3 invalid money fraction ${numeratorText}/${denominatorText}`);
  const scaled = numerator * 100n;
  let paise = scaled / denominator;
  const remainder = scaled % denominator;
  if (remainder * 2n >= denominator) paise += 1n;
  const rupees = paise / 100n;
  const paisePart = paise % 100n;
  return paisePart === 0n
    ? `₹${indianInteger(rupees)}`
    : `₹${indianInteger(rupees)}.${paisePart.toString().padStart(2, "0")}`;
}

function hasFractionalRupee(text: string): boolean {
  return /₹\d+\/\d+/u.test(text);
}

function renderExamMoney(text: string): string {
  return text.replace(/₹(\d+)\/(\d+)/gu, (_match, numerator: string, denominator: string) => roundedRupeeFraction(numerator, denominator));
}

function polishRecurringDepositStep(step: string): string {
  const match = /^After deposit (\d+), the fund is (.+)\.$/u.exec(step);
  if (!match) return step;
  return `After deposit ${match[1]}, interest has first been applied to the existing balance and the new deposit has then been added, so the fund stands at ${match[2]}.`;
}

export function generateIntCp008EnglishQuestion(
  qlId: IntCp008QlId,
  seed: string,
  locale: "en-IN" = "en-IN",
): IntCp008EnglishQuestion {
  const source = generateV2(qlId, seed, locale);
  const rawLearnerText = [
    source.presentation.prompt,
    source.presentation.markdown,
    source.explanation.keyIdea,
    ...source.explanation.steps,
    source.explanation.finalAnswer,
    source.explanation.commonMistake,
    ...source.options.map((option) => option.text),
  ].join("\n");
  const needsNearestPaise = hasFractionalRupee(rawLearnerText);
  const roundingInstruction = " Give monetary answers to the nearest paise.";

  const promptBase = renderExamMoney(source.presentation.prompt);
  const prompt = needsNearestPaise && !promptBase.includes("nearest paise") ? `${promptBase}${roundingInstruction}` : promptBase;
  const steps = Object.freeze(source.explanation.steps.map((step) => {
    const polished = qlId === "INT-QL-122" ? polishRecurringDepositStep(step) : step;
    return renderExamMoney(polished);
  }));
  const finalAnswer = renderExamMoney(source.explanation.finalAnswer);

  return deepFreeze({
    ...source,
    englishVersion: INT_CP008_ENGLISH_VERSION,
    presentation: deepFreeze({
      ...source.presentation,
      prompt,
      markdown: prompt,
    }),
    options: Object.freeze(source.options.map((option) => deepFreeze({
      ...option,
      text: renderExamMoney(option.text),
    }))),
    correctAnswer: renderExamMoney(source.correctAnswer),
    explanation: deepFreeze({
      keyIdea: renderExamMoney(source.explanation.keyIdea),
      steps,
      finalAnswer,
      commonMistake: renderExamMoney(source.explanation.commonMistake),
    }),
  });
}
