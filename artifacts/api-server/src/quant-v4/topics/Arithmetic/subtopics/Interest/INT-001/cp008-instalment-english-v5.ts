import {
  INT_CP008_ENGLISH_VERSION as INT_CP008_ENGLISH_VERSION_V4,
  generateIntCp008EnglishQuestion as generateV4,
  type IntCp008EnglishQuestion as IntCp008EnglishQuestionV4,
} from "./cp008-instalment-english-v4";
import type { IntCp008QlId } from "./cp008-instalment-runtime-v1-final";

export const INT_CP008_ENGLISH_VERSION = "INT-CP-008-EN-v5-final-human-review" as const;
export const INT_CP008_ENGLISH_V5_SUPERSEDES = INT_CP008_ENGLISH_VERSION_V4;

export type IntCp008EnglishQuestion = Omit<IntCp008EnglishQuestionV4, "englishVersion"> & {
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

function repairSingularAndOrdinal(text: string): string {
  return text
    .replace(/The first 1 end-of-([a-z-]+) payments are/gu, "The first end-of-$1 payment is")
    .replace(/first 1 payments /gu, "first payment ")
    .replace(/\b1 scheduled instalments of\b/gu, "1 scheduled instalment of")
    .replace(/\b3th payment\b/gu, "3rd payment");
}

function promptMoneyValues(text: string): bigint[] {
  return [...text.matchAll(/₹([\d,]+)(?:\.\d+)?/gu)].map((match) => BigInt(match[1]!.replace(/,/gu, "")));
}

function normalizeTinyFinanceWording(prompt: string): string {
  return prompt
    .replace(
      /^After the upfront payment on a financed purchase, (₹[\d,]+(?:\.\d+)?) remains due\. The financed balance bears /u,
      "After an initial payment, $1 remains outstanding. The remaining balance carries ",
    )
    .replace(
      /^A customer has (₹[\d,]+(?:\.\d+)?) financed at /u,
      "An account has an outstanding balance of $1 at ",
    )
    .replace(
      /^An instalment contract finances (₹[\d,]+(?:\.\d+)?) for /u,
      "An instalment schedule begins with an outstanding balance of $1 for ",
    )
    .replace(/\bfinanced balance\b/gu, "outstanding balance")
    .replace(/\bfinanced purchase\b/gu, "instalment account")
    .replace(/\bfinance offers\b/gu, "repayment plans")
    .replace(/\bfinances (₹[\d,]+(?:\.\d+)?)/gu, "begins with an outstanding balance of $1")
    .replace(/^A customer /u, "A borrower ");
}

function hasTinyFinanceWording(prompt: string): boolean {
  return promptMoneyValues(prompt).some((value) => value < 500n)
    && /\b(?:financ(?:e|ed|es|ing)?|purchase|customer)\b/iu.test(prompt);
}

export function generateIntCp008EnglishQuestion(
  qlId: IntCp008QlId,
  seed: string,
  locale: "en-IN" = "en-IN",
): IntCp008EnglishQuestion {
  const source = generateV4(qlId, seed, locale);
  let prompt = repairSingularAndOrdinal(source.presentation.prompt);
  if (hasTinyFinanceWording(prompt)) prompt = normalizeTinyFinanceWording(prompt);

  const tinyFinanceRemoved = source.presentation.contextClass === "GENERIC_SCHEDULE"
    || !hasTinyFinanceWording(prompt);
  const contextClass = tinyFinanceRemoved && prompt !== source.presentation.prompt
    && /outstanding balance|initial payment|repayment plan|instalment account/iu.test(prompt)
    ? "GENERIC_SCHEDULE" as const
    : source.presentation.contextClass;

  return deepFreeze({
    ...source,
    englishVersion: INT_CP008_ENGLISH_VERSION,
    presentation: deepFreeze({
      ...source.presentation,
      prompt,
      markdown: prompt,
      contextClass,
    }),
  });
}
