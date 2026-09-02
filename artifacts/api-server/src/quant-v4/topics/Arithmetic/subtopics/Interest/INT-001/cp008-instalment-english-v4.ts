import {
  INT_CP008_ENGLISH_VERSION as INT_CP008_ENGLISH_VERSION_V3,
  generateIntCp008EnglishQuestion as generateV3,
  type IntCp008EnglishQuestion as IntCp008EnglishQuestionV3,
} from "./cp008-instalment-english-v3";
import type { IntCp008QlId } from "./cp008-instalment-runtime-v1-final";

export const INT_CP008_ENGLISH_VERSION = "INT-CP-008-EN-v4-final-editorial-review" as const;
export const INT_CP008_ENGLISH_V4_SUPERSEDES = INT_CP008_ENGLISH_VERSION_V3;

export type IntCp008EnglishQuestion = Omit<IntCp008EnglishQuestionV3, "englishVersion"> & {
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

function repairLatexAndGrammar(text: string): string {
  return text
    .replace(/(?<!\\)cdots/gu, String.raw`\cdots`)
    .replace(/first 1 payments are/gu, "first payment is")
    .replace(/there are 1 full interest period/gu, "there is 1 full interest period");
}

function moneyValues(text: string): bigint[] {
  return [...text.matchAll(/₹([\d,]+)(?:\.\d+)?/gu)].map((match) => BigInt(match[1]!.replace(/,/gu, "")));
}

function normalizeTinyFinanceContext(prompt: string): string {
  return prompt
    .replace(/^A financed balance of /u, "An outstanding balance of ")
    .replace(/^A financed purchase is settled by /u, "An outstanding balance is settled by ")
    .replace(/Find the amount that was financed\./u, "Find the opening balance.");
}

function polishQl122Step(step: string): string {
  const setup = /^The fund starts at ₹0 and receives (.+)\.$/u.exec(step);
  if (setup) return `The account begins with no opening balance and receives ${setup[1]}.`;
  const first = /^After deposit 1, interest has first been applied to the existing balance and the new deposit has then been added, so the fund stands at (.+)\.$/u.exec(step);
  if (first) return `The fund starts at ₹0, so after the first end-of-period deposit it stands at ${first[1]}.`;
  const later = /^After deposit (\d+), interest has first been applied to the existing balance and the new deposit has then been added, so the fund stands at (.+)\.$/u.exec(step);
  if (later) return `Before deposit ${later[1]}, the existing balance earns interest; adding the next deposit then brings the fund to ${later[2]}.`;
  return step;
}

function answerNeedsPaiseRounding(question: IntCp008EnglishQuestionV3): boolean {
  if (question.answerSemantic === "PERIODIC_RATE_PERCENT") return false;
  const value = question.options[question.correctIndex]!.value;
  return (value.numerator * 100n) % value.denominator !== 0n;
}

function normalizePaiseInstruction(prompt: string, required: boolean): string {
  const base = prompt.replace(/ Give monetary answers to the nearest paise\./gu, "");
  return required ? `${base} Give monetary answers to the nearest paise.` : base;
}

function polishQl124Step(step: string): string {
  if (!step.startsWith("The asked difference is $|X_A-X_B|$")) return step;
  return step.replace(
    "The asked difference is $|X_A-X_B|$, which equals",
    "Using the exact instalment values before final paise rounding, $|X_A-X_B|$ equals",
  );
}

export function generateIntCp008EnglishQuestion(
  qlId: IntCp008QlId,
  seed: string,
  locale: "en-IN" = "en-IN",
): IntCp008EnglishQuestion {
  const source = generateV3(qlId, seed, locale);
  const requiresPaise = answerNeedsPaiseRounding(source);
  const sourceMoneyValues = moneyValues(source.presentation.prompt);
  const tinyFinanceContext = source.presentation.contextClass === "FINANCED_PURCHASE"
    && sourceMoneyValues.some((value) => value < 500n);

  let prompt = repairLatexAndGrammar(source.presentation.prompt);
  if (tinyFinanceContext) prompt = normalizeTinyFinanceContext(prompt);
  prompt = normalizePaiseInstruction(prompt, requiresPaise);

  const steps = Object.freeze(source.explanation.steps.map((sourceStep) => {
    let step = repairLatexAndGrammar(sourceStep);
    if (qlId === "INT-QL-122") step = polishQl122Step(step);
    if (qlId === "INT-QL-124") step = polishQl124Step(step);
    return step;
  }));

  const representation = source.presentation.representation === "PLAN_COMPARISON" && qlId !== "INT-QL-124"
    ? "STANDARD_PROSE" as const
    : source.presentation.representation;
  const contextClass = tinyFinanceContext ? "GENERIC_SCHEDULE" as const : source.presentation.contextClass;

  return deepFreeze({
    ...source,
    englishVersion: INT_CP008_ENGLISH_VERSION,
    presentation: deepFreeze({
      ...source.presentation,
      prompt,
      markdown: prompt,
      representation,
      contextClass,
    }),
    explanation: deepFreeze({
      keyIdea: repairLatexAndGrammar(source.explanation.keyIdea),
      steps,
      finalAnswer: repairLatexAndGrammar(source.explanation.finalAnswer),
      commonMistake: repairLatexAndGrammar(source.explanation.commonMistake),
    }),
  });
}
