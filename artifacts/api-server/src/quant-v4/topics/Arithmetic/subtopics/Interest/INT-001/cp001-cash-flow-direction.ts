import { asRecord } from "./cp001-localization-foundation";
import type { IntCp001Locale } from "./cp001-multilingual-release";

export type IntCp001CashFlowDirection =
  | "BORROWER_PAYS"
  | "INVESTOR_EARNS"
  | "NEUTRAL_MATH";

export interface IntCp001CashFlowContext {
  scenarioId: string;
  direction: IntCp001CashFlowDirection;
}

const BORROWER_SCENARIOS = new Set([
  "EDUCATION_LOAN",
  "CROP_LOAN",
  "EQUIPMENT_LOAN",
  "PERSONAL_AGREEMENT",
]);

const INVESTMENT_SCENARIOS = new Set([
  "FIXED_DEPOSIT",
  "POST_OFFICE",
  "BUSINESS_ADVANCE",
  "SAVINGS_CERTIFICATE",
  "GENERIC",
]);

const NEUTRAL_SCENARIOS = new Set([
  "NEUTRAL",
  "PLAIN_SUM",
  "GENERIC_SUM",
]);

export function getIntCp001CashFlowContext(sourceParameters: unknown): IntCp001CashFlowContext {
  const parameters = asRecord(sourceParameters);
  const context = asRecord(parameters?.context);
  const scenarioId = typeof context?.scenarioId === "string" ? context.scenarioId : "GENERIC";

  if (BORROWER_SCENARIOS.has(scenarioId)) return { scenarioId, direction: "BORROWER_PAYS" };
  if (NEUTRAL_SCENARIOS.has(scenarioId)) return { scenarioId, direction: "NEUTRAL_MATH" };
  if (INVESTMENT_SCENARIOS.has(scenarioId)) return { scenarioId, direction: "INVESTOR_EARNS" };

  // The existing locale context fallback renders an investment/deposit story for unknown IDs.
  return { scenarioId, direction: "INVESTOR_EARNS" };
}

function alignHindiStem(stem: string, direction: IntCp001CashFlowDirection): string {
  if (direction === "BORROWER_PAYS") {
    return stem
      .replaceAll("कितना ब्याज मिलेगा?", "उसे कितना ब्याज देना होगा?")
      .replaceAll("साधारण ब्याज मिलता है", "साधारण ब्याज देना पड़ता है")
      .replaceAll("साधारण ब्याज मिला", "साधारण ब्याज देना पड़ा")
      .replaceAll(" ब्याज मिला", " ब्याज देना पड़ा")
      .replaceAll("में मिला ब्याज", "में देय ब्याज")
      .replaceAll("मिला ब्याज", "देय ब्याज")
      .replaceAll("दर पर ब्याज, मूलधन का", "दर पर देय ब्याज, मूलधन का")
      .replaceAll("साधारण ब्याज, मूलधन का", "देय साधारण ब्याज, मूलधन का")
      .replaceAll("एक वर्ष का साधारण ब्याज कितना है?", "एक वर्ष में देय साधारण ब्याज कितना है?")
      .replaceAll("धन कितने समय के लिए रखा गया था?", "ऋण कितने समय के लिए लिया गया था?")
      .replaceAll("बाद वाली राशि कुल कितने समय बाद प्राप्त होगी?", "बाद वाली देय राशि कुल कितने समय बाद होगी?");
  }

  if (direction === "INVESTOR_EARNS") {
    return stem
      .replaceAll("कितना ब्याज मिलेगा?", "उसे कितना ब्याज अर्जित होगा?")
      .replaceAll("साधारण ब्याज मिलता है", "साधारण ब्याज अर्जित होता है")
      .replaceAll("साधारण ब्याज मिला", "साधारण ब्याज अर्जित हुआ")
      .replaceAll(" ब्याज मिला", " ब्याज अर्जित हुआ")
      .replaceAll("में मिला ब्याज", "में अर्जित ब्याज")
      .replaceAll("मिला ब्याज", "अर्जित ब्याज")
      .replaceAll("दर पर ब्याज, मूलधन का", "दर पर अर्जित ब्याज, मूलधन का")
      .replaceAll("साधारण ब्याज, मूलधन का", "अर्जित साधारण ब्याज, मूलधन का")
      .replaceAll("एक वर्ष का साधारण ब्याज कितना है?", "एक वर्ष में अर्जित साधारण ब्याज कितना है?")
      .replaceAll("धन कितने समय के लिए रखा गया था?", "राशि कितने समय के लिए निवेश की गई थी?");
  }

  return stem
    .replaceAll("कितना ब्याज मिलेगा?", "साधारण ब्याज कितना होगा?")
    .replaceAll("साधारण ब्याज मिलता है", "साधारण ब्याज होता है")
    .replaceAll("साधारण ब्याज मिला", "साधारण ब्याज हुआ")
    .replaceAll(" ब्याज मिला", " साधारण ब्याज हुआ")
    .replaceAll("में मिला ब्याज", "में साधारण ब्याज")
    .replaceAll("मिला ब्याज", "साधारण ब्याज")
    .replaceAll("दर पर ब्याज, मूलधन का", "दर पर साधारण ब्याज, मूलधन का")
    .replaceAll("धन कितने समय के लिए रखा गया था?", "समय कितना था?")
    .replaceAll("बाद वाली राशि कुल कितने समय बाद प्राप्त होगी?", "बाद वाली राशि कुल कितने समय बाद होगी?");
}

function alignPunjabiStem(stem: string, direction: IntCp001CashFlowDirection): string {
  if (direction === "BORROWER_PAYS") {
    return stem
      .replaceAll("ਕਿੰਨਾ ਵਿਆਜ ਮਿਲੇਗਾ?", "ਉਸ ਨੂੰ ਕਿੰਨਾ ਵਿਆਜ ਦੇਣਾ ਪਵੇਗਾ?")
      .replaceAll("ਸਧਾਰਣ ਵਿਆਜ ਮਿਲਦਾ ਹੈ", "ਸਧਾਰਣ ਵਿਆਜ ਦੇਣਾ ਪੈਂਦਾ ਹੈ")
      .replaceAll("ਸਧਾਰਣ ਵਿਆਜ ਮਿਲਿਆ", "ਸਧਾਰਣ ਵਿਆਜ ਦੇਣਾ ਪਿਆ")
      .replaceAll(" ਵਿਆਜ ਮਿਲਿਆ", " ਵਿਆਜ ਦੇਣਾ ਪਿਆ")
      .replaceAll("ਵਿੱਚ ਮਿਲਿਆ ਵਿਆਜ", "ਵਿੱਚ ਦੇਣਾ ਪੈਣ ਵਾਲਾ ਵਿਆਜ")
      .replaceAll("ਮਿਲਿਆ ਵਿਆਜ", "ਦੇਣਾ ਪੈਣ ਵਾਲਾ ਵਿਆਜ")
      .replaceAll("ਦਰ ਉੱਤੇ ਵਿਆਜ, ਮੂਲਧਨ ਦਾ", "ਦਰ ਉੱਤੇ ਦੇਣਾ ਪੈਣ ਵਾਲਾ ਵਿਆਜ, ਮੂਲਧਨ ਦਾ")
      .replaceAll("ਸਧਾਰਣ ਵਿਆਜ, ਮੂਲਧਨ ਦਾ", "ਦੇਣਾ ਪੈਣ ਵਾਲਾ ਸਧਾਰਣ ਵਿਆਜ, ਮੂਲਧਨ ਦਾ")
      .replaceAll("ਇੱਕ ਸਾਲ ਦਾ ਸਧਾਰਣ ਵਿਆਜ ਕਿੰਨਾ ਹੈ?", "ਇੱਕ ਸਾਲ ਵਿੱਚ ਦੇਣਾ ਪੈਣ ਵਾਲਾ ਸਧਾਰਣ ਵਿਆਜ ਕਿੰਨਾ ਹੈ?")
      .replaceAll("ਰਕਮ ਕਿੰਨੇ ਸਮੇਂ ਲਈ ਰੱਖੀ ਗਈ ਸੀ?", "ਕਰਜ਼ਾ ਕਿੰਨੇ ਸਮੇਂ ਲਈ ਲਿਆ ਗਿਆ ਸੀ?")
      .replaceAll("ਬਾਅਦ ਵਾਲੀ ਰਕਮ ਕੁੱਲ ਕਿੰਨੇ ਸਮੇਂ ਬਾਅਦ ਮਿਲੇਗੀ?", "ਬਾਅਦ ਵਾਲੀ ਕੁੱਲ ਦੇਣ ਵਾਲੀ ਰਕਮ ਕਿੰਨੇ ਸਮੇਂ ਬਾਅਦ ਹੋਵੇਗੀ?");
  }

  if (direction === "INVESTOR_EARNS") {
    return stem
      .replaceAll("ਰਕਮ ਕਿੰਨੇ ਸਮੇਂ ਲਈ ਰੱਖੀ ਗਈ ਸੀ?", "ਰਕਮ ਕਿੰਨੇ ਸਮੇਂ ਲਈ ਨਿਵੇਸ਼ ਕੀਤੀ ਗਈ ਸੀ?")
      .replaceAll("ਦਰ ਉੱਤੇ ਵਿਆਜ, ਮੂਲਧਨ ਦਾ", "ਦਰ ਉੱਤੇ ਮਿਲਣ ਵਾਲਾ ਵਿਆਜ, ਮੂਲਧਨ ਦਾ")
      .replaceAll("ਸਧਾਰਣ ਵਿਆਜ, ਮੂਲਧਨ ਦਾ", "ਮਿਲਣ ਵਾਲਾ ਸਧਾਰਣ ਵਿਆਜ, ਮੂਲਧਨ ਦਾ")
      .replaceAll("ਇੱਕ ਸਾਲ ਦਾ ਸਧਾਰਣ ਵਿਆਜ ਕਿੰਨਾ ਹੈ?", "ਇੱਕ ਸਾਲ ਵਿੱਚ ਮਿਲਣ ਵਾਲਾ ਸਧਾਰਣ ਵਿਆਜ ਕਿੰਨਾ ਹੈ?");
  }

  return stem
    .replaceAll("ਕਿੰਨਾ ਵਿਆਜ ਮਿਲੇਗਾ?", "ਸਧਾਰਣ ਵਿਆਜ ਕਿੰਨਾ ਹੋਵੇਗਾ?")
    .replaceAll("ਸਧਾਰਣ ਵਿਆਜ ਮਿਲਦਾ ਹੈ", "ਸਧਾਰਣ ਵਿਆਜ ਹੁੰਦਾ ਹੈ")
    .replaceAll("ਸਧਾਰਣ ਵਿਆਜ ਮਿਲਿਆ", "ਸਧਾਰਣ ਵਿਆਜ ਹੋਇਆ")
    .replaceAll(" ਵਿਆਜ ਮਿਲਿਆ", " ਸਧਾਰਣ ਵਿਆਜ ਹੋਇਆ")
    .replaceAll("ਵਿੱਚ ਮਿਲਿਆ ਵਿਆਜ", "ਵਿੱਚ ਸਧਾਰਣ ਵਿਆਜ")
    .replaceAll("ਮਿਲਿਆ ਵਿਆਜ", "ਸਧਾਰਣ ਵਿਆਜ")
    .replaceAll("ਦਰ ਉੱਤੇ ਵਿਆਜ, ਮੂਲਧਨ ਦਾ", "ਦਰ ਉੱਤੇ ਸਧਾਰਣ ਵਿਆਜ, ਮੂਲਧਨ ਦਾ")
    .replaceAll("ਰਕਮ ਕਿੰਨੇ ਸਮੇਂ ਲਈ ਰੱਖੀ ਗਈ ਸੀ?", "ਸਮਾਂ ਕਿੰਨਾ ਸੀ?")
    .replaceAll("ਬਾਅਦ ਵਾਲੀ ਰਕਮ ਕੁੱਲ ਕਿੰਨੇ ਸਮੇਂ ਬਾਅਦ ਮਿਲੇਗੀ?", "ਬਾਅਦ ਵਾਲੀ ਰਕਮ ਕੁੱਲ ਕਿੰਨੇ ਸਮੇਂ ਬਾਅਦ ਹੋਵੇਗੀ?");
}

export function alignIntCp001StemCashFlow(
  stem: string,
  locale: IntCp001Locale,
  direction: IntCp001CashFlowDirection,
): string {
  return locale === "hi" ? alignHindiStem(stem, direction) : alignPunjabiStem(stem, direction);
}

const CASH_FLOW_SENSITIVE_CONTRACTS = new Set([
  "FIND_SIMPLE_INTEREST_FROM_PRT",
  "FIND_PRINCIPAL_FROM_INTEREST",
  "FIND_RATE_FROM_INTEREST",
  "FIND_TIME_FROM_INTEREST",
  "FIND_INTEREST_FOR_TARGET_DURATION",
  "FIND_TIME_FROM_INTEREST_RATIO",
  "FIND_RATE_FROM_INTEREST_RATIO",
  "FIND_ANNUAL_INTEREST_FROM_TWO_AMOUNTS",
  "FIND_INTEREST_RATIO_FROM_RATE_TIME",
  "FIND_LATER_TIME_FROM_TWO_AMOUNT_RATIO",
]);

export function validateIntCp001StemCashFlow(
  stem: string,
  solveContract: string,
  locale: IntCp001Locale,
  direction: IntCp001CashFlowDirection,
): string[] {
  const errors: string[] = [];

  if (direction === "BORROWER_PAYS") {
    const contradiction = locale === "hi"
      ? /ब्याज (?:मिलेगा|मिला|मिलता)|मिला ब्याज|ब्याज अर्जित|अर्जित ब्याज|राशि .*प्राप्त होगी/u
      : /ਵਿਆਜ (?:ਮਿਲੇਗਾ|ਮਿਲਿਆ|ਮਿਲਦਾ)|ਮਿਲਿਆ ਵਿਆਜ|ਰਕਮ .*ਮਿਲੇਗੀ/u;
    if (contradiction.test(stem)) errors.push("Borrowing context incorrectly presents interest or amount as received.");
  }

  if (direction === "INVESTOR_EARNS") {
    const contradiction = locale === "hi"
      ? /ब्याज (?:देना|चुकाना)|देय ब्याज|देना पड़/u
      : /ਵਿਆਜ (?:ਦੇਣਾ|ਚੁਕਾਉਣਾ)|ਦੇਣਾ ਪੈ/u;
    if (contradiction.test(stem)) errors.push("Investment context incorrectly presents interest as payable.");
  }

  if (direction === "NEUTRAL_MATH") {
    const directional = locale === "hi"
      ? /ब्याज (?:मिलेगा|मिला|मिलता|देना|चुकाना)|अर्जित ब्याज|देय ब्याज/u
      : /ਵਿਆਜ (?:ਮਿਲੇਗਾ|ਮਿਲਿਆ|ਮਿਲਦਾ|ਦੇਣਾ|ਚੁਕਾਉਣਾ)/u;
    if (directional.test(stem)) errors.push("Neutral context contains a directional receipt/payment verb.");
  }

  if (CASH_FLOW_SENSITIVE_CONTRACTS.has(solveContract)) {
    const alignedMarker = direction === "BORROWER_PAYS"
      ? (locale === "hi"
          ? /देना होगा|देना पड़ा|देना पड़ता है|देय (?:साधारण )?ब्याज|देय राशि/u
          : /ਦੇਣਾ ਪਵੇਗਾ|ਦੇਣਾ ਪਿਆ|ਦੇਣਾ ਪੈਂਦਾ ਹੈ|ਦੇਣਾ ਪੈਣ ਵਾਲਾ|ਦੇਣ ਵਾਲੀ ਰਕਮ/u)
      : direction === "INVESTOR_EARNS"
        ? (locale === "hi"
            ? /अर्जित होगा|अर्जित हुआ|अर्जित होता है|अर्जित (?:साधारण )?ब्याज|प्राप्त होगी/u
            : /ਵਿਆਜ ਮਿਲੇਗਾ|ਵਿਆਜ ਮਿਲਿਆ|ਵਿਆਜ ਮਿਲਦਾ ਹੈ|ਮਿਲਿਆ ਵਿਆਜ|ਮਿਲਣ ਵਾਲਾ|ਰਕਮ .*ਮਿਲੇਗੀ/u)
        : (locale === "hi" ? /साधारण ब्याज|राशि .*होगी/u : /ਸਧਾਰਣ ਵਿਆਜ|ਰਕਮ .*ਹੋਵੇਗੀ/u);
    if (!alignedMarker.test(stem)) errors.push("Cash-flow-sensitive stem lacks a direction-aligned learner phrase.");
  }

  return errors;
}
