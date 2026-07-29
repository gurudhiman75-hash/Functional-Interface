import type { IntCp001CashFlowDirection } from "./cp001-cash-flow-direction";
import type { IntCp001Locale } from "./cp001-multilingual-release";

const LOAN_AMOUNT_CONTRACTS = new Set([
  "FIND_AMOUNT_FROM_PRT",
  "FIND_PRINCIPAL_FROM_AMOUNT",
  "FIND_RATE_FROM_AMOUNT",
  "FIND_TIME_FROM_AMOUNT",
  "FIND_RATE_FROM_AMOUNT_MULTIPLE",
  "FIND_TIME_FROM_AMOUNT_MULTIPLE",
  "FIND_ANNUAL_INTEREST_FROM_TWO_AMOUNTS",
  "FIND_PRINCIPAL_FROM_TWO_AMOUNTS",
  "FIND_RATE_FROM_TWO_AMOUNTS",
  "FIND_RATE_FROM_TWO_TIME_AMOUNT_RATIO",
  "FIND_AMOUNT_MULTIPLE_FROM_RATE_TIME",
  "FIND_AMOUNT_AT_ANOTHER_TIME",
  "FIND_LATER_TIME_FROM_TWO_AMOUNT_RATIO",
]);

function alignHindiLoanAmount(stem: string, solveContract: string): string {
  switch (solveContract) {
    case "FIND_AMOUNT_FROM_PRT":
    case "FIND_PRINCIPAL_FROM_AMOUNT":
    case "FIND_RATE_FROM_AMOUNT_MULTIPLE":
    case "FIND_TIME_FROM_AMOUNT_MULTIPLE":
    case "FIND_AMOUNT_MULTIPLE_FROM_RATE_TIME":
      return stem.replaceAll("कुल राशि", "कुल देय राशि");

    case "FIND_RATE_FROM_AMOUNT":
      return stem.replace(
        /। (₹[\d,]+(?:\.\d+)?) का मूलधन (.+?) में (₹[\d,]+(?:\.\d+)?) हो गया।/u,
        "। लिया गया मूलधन $1 था और $2 बाद कुल देय राशि $3 हो गई।",
      );

    case "FIND_TIME_FROM_AMOUNT":
      return stem.replace(
        /। (₹[\d,]+(?:\.\d+)?) की राशि (.+?) से बढ़कर (₹[\d,]+(?:\.\d+)?) हो गई।/u,
        "। लिया गया मूलधन $1 है। $2 से कुल देय राशि बढ़कर $3 हो गई।",
      );

    case "FIND_ANNUAL_INTEREST_FROM_TWO_AMOUNTS":
    case "FIND_PRINCIPAL_FROM_TWO_AMOUNTS":
    case "FIND_RATE_FROM_TWO_AMOUNTS":
      return stem.replace(
        /। राशि (.+?) बाद (₹[\d,]+(?:\.\d+)?) और (.+?) बाद (₹[\d,]+(?:\.\d+)?) है।/u,
        "। कुल देय राशि $1 बाद $2 और $3 बाद $4 है।",
      );

    case "FIND_RATE_FROM_TWO_TIME_AMOUNT_RATIO":
      return stem.replace(
        /। (.+?) की राशि और (.+?) की राशि का अनुपात/u,
        "। $1 बाद की देय राशि और $2 बाद की देय राशि का अनुपात",
      );

    case "FIND_AMOUNT_AT_ANOTHER_TIME":
      return stem.replaceAll(" बाद राशि", " बाद कुल देय राशि");

    case "FIND_LATER_TIME_FROM_TWO_AMOUNT_RATIO":
      return stem
        .replaceAll("बाद की राशि", "बाद की देय राशि")
        .replaceAll("बाद वाली राशि", "बाद वाली देय राशि");

    default:
      return stem;
  }
}

function alignPunjabiLoanAmount(stem: string, solveContract: string): string {
  switch (solveContract) {
    case "FIND_AMOUNT_FROM_PRT":
    case "FIND_PRINCIPAL_FROM_AMOUNT":
    case "FIND_RATE_FROM_AMOUNT_MULTIPLE":
    case "FIND_TIME_FROM_AMOUNT_MULTIPLE":
    case "FIND_AMOUNT_MULTIPLE_FROM_RATE_TIME":
      return stem.replaceAll("ਕੁੱਲ ਰਕਮ", "ਕੁੱਲ ਦੇਣ ਵਾਲੀ ਰਕਮ");

    case "FIND_RATE_FROM_AMOUNT":
      return stem.replace(
        /। (₹[\d,]+(?:\.\d+)?) ਦਾ ਮੂਲਧਨ (.+?) ਵਿੱਚ (₹[\d,]+(?:\.\d+)?) ਹੋ ਗਿਆ।/u,
        "। ਲਿਆ ਗਿਆ ਮੂਲਧਨ $1 ਸੀ ਅਤੇ $2 ਬਾਅਦ ਕੁੱਲ ਦੇਣ ਵਾਲੀ ਰਕਮ $3 ਹੋ ਗਈ।",
      );

    case "FIND_TIME_FROM_AMOUNT":
      return stem.replace(
        /। (₹[\d,]+(?:\.\d+)?) ਦੀ ਰਕਮ (.+?) ਨਾਲ ਵੱਧ ਕੇ (₹[\d,]+(?:\.\d+)?) ਹੋ ਗਈ।/u,
        "। ਲਿਆ ਗਿਆ ਮੂਲਧਨ $1 ਹੈ। $2 ਨਾਲ ਕੁੱਲ ਦੇਣ ਵਾਲੀ ਰਕਮ ਵੱਧ ਕੇ $3 ਹੋ ਗਈ।",
      );

    case "FIND_ANNUAL_INTEREST_FROM_TWO_AMOUNTS":
    case "FIND_PRINCIPAL_FROM_TWO_AMOUNTS":
    case "FIND_RATE_FROM_TWO_AMOUNTS":
      return stem.replace(
        /। ਰਕਮ (.+?) ਬਾਅਦ (₹[\d,]+(?:\.\d+)?) ਅਤੇ (.+?) ਬਾਅਦ (₹[\d,]+(?:\.\d+)?) ਹੈ।/u,
        "। ਕੁੱਲ ਦੇਣ ਵਾਲੀ ਰਕਮ $1 ਬਾਅਦ $2 ਅਤੇ $3 ਬਾਅਦ $4 ਹੈ।",
      );

    case "FIND_RATE_FROM_TWO_TIME_AMOUNT_RATIO":
      return stem.replace(
        /। (.+?) ਦੀ ਰਕਮ ਅਤੇ (.+?) ਦੀ ਰਕਮ ਦਾ ਅਨੁਪਾਤ/u,
        "। $1 ਬਾਅਦ ਦੀ ਕੁੱਲ ਦੇਣ ਵਾਲੀ ਰਕਮ ਅਤੇ $2 ਬਾਅਦ ਦੀ ਕੁੱਲ ਦੇਣ ਵਾਲੀ ਰਕਮ ਦਾ ਅਨੁਪਾਤ",
      );

    case "FIND_AMOUNT_AT_ANOTHER_TIME":
      return stem.replaceAll(" ਬਾਅਦ ਰਕਮ", " ਬਾਅਦ ਕੁੱਲ ਦੇਣ ਵਾਲੀ ਰਕਮ");

    case "FIND_LATER_TIME_FROM_TWO_AMOUNT_RATIO":
      return stem
        .replaceAll("ਬਾਅਦ ਦੀ ਰਕਮ", "ਬਾਅਦ ਦੀ ਕੁੱਲ ਦੇਣ ਵਾਲੀ ਰਕਮ")
        .replaceAll("ਬਾਅਦ ਵਾਲੀ ਰਕਮ", "ਬਾਅਦ ਵਾਲੀ ਕੁੱਲ ਦੇਣ ਵਾਲੀ ਰਕਮ");

    default:
      return stem;
  }
}

export function alignIntCp001LoanAmountWordingV2(
  stem: string,
  solveContract: string,
  locale: IntCp001Locale,
  direction: IntCp001CashFlowDirection,
): string {
  if (direction !== "BORROWER_PAYS") return stem;
  return locale === "hi"
    ? alignHindiLoanAmount(stem, solveContract)
    : alignPunjabiLoanAmount(stem, solveContract);
}

export function validateIntCp001LoanAmountWordingV2(
  stem: string,
  solveContract: string,
  locale: IntCp001Locale,
  direction: IntCp001CashFlowDirection,
): string[] {
  if (direction !== "BORROWER_PAYS" || !LOAN_AMOUNT_CONTRACTS.has(solveContract)) return [];

  const errors: string[] = [];
  if (locale === "hi") {
    if (!/देय राशि/u.test(stem)) errors.push("Loan amount stem lacks explicit payable-amount wording.");
    if (/कुल राशि/u.test(stem)) errors.push("Loan amount stem retains ambiguous total-amount wording.");
  } else {
    if (!/ਦੇਣ ਵਾਲੀ ਰਕਮ/u.test(stem)) errors.push("Punjabi loan amount stem lacks explicit amount-to-pay wording.");
    if (/ਕੁੱਲ ਰਕਮ/u.test(stem)) errors.push("Punjabi loan amount stem retains ambiguous total-amount wording.");
  }
  return errors;
}
