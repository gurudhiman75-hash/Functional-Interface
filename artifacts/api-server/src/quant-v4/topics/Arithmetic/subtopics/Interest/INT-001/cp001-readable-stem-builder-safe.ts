import { rational } from "./foundation/rational";
import {
  asRecord,
  readRational,
} from "./cp001-localization-foundation";
import {
  buildIntCp001ReadableStem,
  type IntCp001ReadableStemResult,
} from "./cp001-readable-stem-builder";
import type { IntCp001ReadableLanguage } from "./cp001-readable-stem-release";

function normaliseReadableSourceParameters(sourceParameters: unknown): unknown {
  const parameters = asRecord(sourceParameters) ?? {};
  const hidden = asRecord(parameters.hiddenState) ?? {};

  const simpleInterest = readRational(hidden, "simpleInterest")
    ?? readRational(hidden, "laterInterest")
    ?? readRational(hidden, "annualInterest")
    ?? rational(0);
  const amount = readRational(hidden, "amount")
    ?? readRational(hidden, "laterAmount")
    ?? readRational(hidden, "earlierAmount")
    ?? rational(0);
  const timeYears = readRational(hidden, "timeYears")
    ?? readRational(hidden, "laterTimeYears")
    ?? readRational(hidden, "earlierTimeYears")
    ?? rational(0);

  return {
    ...parameters,
    hiddenState: {
      ...hidden,
      simpleInterest,
      amount,
      timeYears,
    },
  };
}

function alignAnnualInterestQuestion(
  result: IntCp001ReadableStemResult,
  language: IntCp001ReadableLanguage,
): IntCp001ReadableStemResult {
  const borrower = result.cashFlowDirection === "BORROWER_PAYS";
  const oldQuestion = language === "en"
    ? "How much simple interest applies in one year?"
    : language === "hi"
      ? "एक वर्ष का साधारण ब्याज कितना है?"
      : "ਇੱਕ ਸਾਲ ਦਾ ਸਧਾਰਣ ਵਿਆਜ ਕਿੰਨਾ ਹੈ?";
  const newQuestion = language === "en"
    ? (borrower
        ? "How much interest is payable in one year?"
        : "How much interest is earned in one year?")
    : language === "hi"
      ? (borrower
          ? "एक वर्ष में कितना ब्याज देना होगा?"
          : "एक वर्ष में कितना ब्याज मिलेगा?")
      : (borrower
          ? "ਇੱਕ ਸਾਲ ਵਿੱਚ ਕਿੰਨਾ ਵਿਆਜ ਦੇਣਾ ਪਵੇਗਾ?"
          : "ਇੱਕ ਸਾਲ ਵਿੱਚ ਕਿੰਨਾ ਵਿਆਜ ਮਿਲੇਗਾ?");

  const stem = result.stem.replace(oldQuestion, newQuestion);
  if (stem === result.stem) {
    throw new Error(`Unable to align annual-interest wording for ${language}.`);
  }

  return {
    ...result,
    stem,
    presentation: {
      ...result.presentation,
      plainText: stem,
      richTextHtml: result.presentation.richTextHtml.replace(oldQuestion, newQuestion),
    },
  };
}

export function buildIntCp001ReadableStemSafe(
  solveContract: string,
  sourceParameters: unknown,
  language: IntCp001ReadableLanguage,
): IntCp001ReadableStemResult {
  const result = buildIntCp001ReadableStem(
    solveContract,
    normaliseReadableSourceParameters(sourceParameters),
    language,
  );
  return solveContract === "FIND_ANNUAL_INTEREST_FROM_TWO_AMOUNTS"
    ? alignAnnualInterestQuestion(result, language)
    : result;
}
