import { rational } from "./foundation/rational";
import {
  asRecord,
  readRational,
} from "./cp001-localization-foundation";
import {
  buildIntCp001ReadableStem,
  type IntCp001ReadableStemPresentation,
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

function htmlEscape(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function rebuildPresentation(
  stem: string,
  previous: IntCp001ReadableStemPresentation,
): IntCp001ReadableStemPresentation {
  const spans: IntCp001ReadableStemPresentation["emphasisSpans"] = [];
  let searchFrom = 0;

  for (const oldSpan of previous.emphasisSpans) {
    const start = stem.indexOf(oldSpan.text, searchFrom);
    if (start < 0) {
      throw new Error(`Unable to recover readable-stem anchor '${oldSpan.text}'.`);
    }
    const span = {
      semantic: oldSpan.semantic,
      text: oldSpan.text,
      start,
      end: start + oldSpan.text.length,
    };
    spans.push(span);
    searchFrom = span.end;
  }

  let richTextHtml = "<p>";
  let cursor = 0;
  for (const span of spans) {
    richTextHtml += htmlEscape(stem.slice(cursor, span.start));
    richTextHtml += `<strong data-int-semantic="${span.semantic}">${htmlEscape(span.text)}</strong>`;
    cursor = span.end;
  }
  richTextHtml += `${htmlEscape(stem.slice(cursor))}</p>`;

  return {
    plainText: stem,
    richTextHtml,
    emphasisSpans: spans,
  };
}

function withStem(
  result: IntCp001ReadableStemResult,
  stem: string,
): IntCp001ReadableStemResult {
  if (stem === result.stem) return result;
  return {
    ...result,
    stem,
    presentation: rebuildPresentation(stem, result.presentation),
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
  return withStem(result, stem);
}

function polishEnglishStem(
  result: IntCp001ReadableStemResult,
  solveContract: string,
): IntCp001ReadableStemResult {
  let stem = result.stem;

  if (solveContract === "FIND_TIME_FROM_INTEREST") {
    stem = stem.replace(
      "How long was the money kept?",
      "Over what period was this interest calculated?",
    );
  }

  if (
    solveContract === "FIND_RATE_FROM_TWO_TIME_AMOUNT_RATIO"
    || solveContract === "FIND_LATER_TIME_FROM_TWO_AMOUNT_RATIO"
  ) {
    stem = stem
      .replace(
        /The total amount payable after (.+?) and after (.+?) are in the ratio/u,
        "The total amounts payable after $1 and $2 are in the ratio",
      )
      .replace(
        /The amount after (.+?) and after (.+?) are in the ratio/u,
        "The amounts after $1 and $2 are in the ratio",
      );
  }

  return withStem(result, stem);
}

export function buildIntCp001ReadableStemSafe(
  solveContract: string,
  sourceParameters: unknown,
  language: IntCp001ReadableLanguage,
): IntCp001ReadableStemResult {
  let result = buildIntCp001ReadableStem(
    solveContract,
    normaliseReadableSourceParameters(sourceParameters),
    language,
  );
  if (solveContract === "FIND_ANNUAL_INTEREST_FROM_TWO_AMOUNTS") {
    result = alignAnnualInterestQuestion(result, language);
  }
  if (language === "en") {
    result = polishEnglishStem(result, solveContract);
  }
  return result;
}
