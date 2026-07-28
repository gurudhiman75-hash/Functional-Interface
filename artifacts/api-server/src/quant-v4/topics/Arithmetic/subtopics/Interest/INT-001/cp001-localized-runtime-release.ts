import type { IntCp001FinalQlId } from "./cp001-final-registry";
import {
  assertIntCp001LocaleParity,
  generateIntCp001FinalLocalizedQuestion,
  type IntCp001LocalizedQuestion,
} from "./cp001-localized-runtime-final";
import type { IntCp001Locale } from "./cp001-multilingual-release";

function polishStem(stem: string, locale: IntCp001Locale): string {
  if (locale === "hi") {
    return stem
      .replace(/(\d+(?:\.\d+)?%) वार्षिक की साधारण ब्याज दर/gu, "$1 वार्षिक साधारण ब्याज की दर")
      .replace(/(\d+(?:\.\d+)?%) वार्षिक की दर/gu, "$1 वार्षिक दर")
      .replace(/^(.+?)। दर (\d+(?:\.\d+)?%) वार्षिक है।/u, "$1। साधारण ब्याज की दर $2 वार्षिक है।")
      .replace(/कुल राशि, मूलधन की कितनी गुना/gu, "कुल राशि, मूलधन का कितना गुना");
  }
  return stem
    .replace(/(\d+(?:\.\d+)?%) ਸਾਲਾਨਾ ਦੀ ਸਧਾਰਣ ਵਿਆਜ ਦਰ/gu, "$1 ਸਾਲਾਨਾ ਸਧਾਰਣ ਵਿਆਜ ਦੀ ਦਰ")
    .replace(/(\d+(?:\.\d+)?%) ਸਾਲਾਨਾ ਦੀ ਦਰ/gu, "$1 ਸਾਲਾਨਾ ਦਰ")
    .replace(/^(.+?)। ਦਰ (\d+(?:\.\d+)?%) ਸਾਲਾਨਾ ਹੈ।/u, "$1। ਸਧਾਰਣ ਵਿਆਜ ਦੀ ਦਰ $2 ਸਾਲਾਨਾ ਹੈ।")
    .replace(/ਕੁੱਲ ਰਕਮ, ਮੂਲਧਨ ਦੀ ਕਿੰਨੀ ਗੁਣਾ/gu, "ਕੁੱਲ ਰਕਮ, ਮੂਲਧਨ ਦਾ ਕਿੰਨਾ ਗੁਣਾ");
}

function correctedTrapExplanation(
  misconceptionId: string,
  optionText: string,
  existing: string,
  locale: IntCp001Locale,
): string {
  if (locale === "hi") {
    if (misconceptionId === "AMOUNT_MULTIPLE_REPORTED_AS_INTEREST_RATIO") {
      return `यह विकल्प ${optionText} दिखाता है। पूरे समय के ब्याज-भाग को ही कुल राशि का गुणक मान लिया गया; मूलधन का 1 भाग नहीं जोड़ा गया।`;
    }
    if (misconceptionId === "INTEREST_RATIO_REPORTED_AS_AMOUNT_MULTIPLE") {
      return `यह विकल्प ${optionText} दिखाता है। ब्याज-मूलधन अनुपात के बजाय कुल राशि का गुणक लिया गया; मूलधन का 1 भाग नहीं घटाया गया।`;
    }
    if (misconceptionId === "AMOUNT_GAP_REPORTED") {
      return `यह विकल्प ${optionText} दिखाता है। राशि-अंतर को वार्षिक ब्याज में बदलते समय समय-अंतर का गलत उपयोग किया गया।`;
    }
    return existing;
  }

  if (misconceptionId === "AMOUNT_MULTIPLE_REPORTED_AS_INTEREST_RATIO") {
    return `ਇਹ ਵਿਕਲਪ ${optionText} ਦਿਖਾਉਂਦਾ ਹੈ। ਪੂਰੇ ਸਮੇਂ ਦੇ ਵਿਆਜ-ਹਿੱਸੇ ਨੂੰ ਹੀ ਕੁੱਲ ਰਕਮ ਦਾ ਗੁਣਕ ਮੰਨ ਲਿਆ ਗਿਆ; ਮੂਲਧਨ ਦਾ 1 ਹਿੱਸਾ ਨਹੀਂ ਜੋੜਿਆ ਗਿਆ।`;
  }
  if (misconceptionId === "INTEREST_RATIO_REPORTED_AS_AMOUNT_MULTIPLE") {
    return `ਇਹ ਵਿਕਲਪ ${optionText} ਦਿਖਾਉਂਦਾ ਹੈ। ਵਿਆਜ-ਮੂਲਧਨ ਅਨੁਪਾਤ ਦੀ ਥਾਂ ਕੁੱਲ ਰਕਮ ਦਾ ਗੁਣਕ ਲਿਆ ਗਿਆ; ਮੂਲਧਨ ਦਾ 1 ਹਿੱਸਾ ਨਹੀਂ ਘਟਾਇਆ ਗਿਆ।`;
  }
  if (misconceptionId === "AMOUNT_GAP_REPORTED") {
    return `ਇਹ ਵਿਕਲਪ ${optionText} ਦਿਖਾਉਂਦਾ ਹੈ। ਰਕਮਾਂ ਦੇ ਅੰਤਰ ਨੂੰ ਸਾਲਾਨਾ ਵਿਆਜ ਵਿੱਚ ਬਦਲਦੇ ਸਮੇਂ ਸਮੇਂ ਦੇ ਅੰਤਰ ਦੀ ਗਲਤ ਵਰਤੋਂ ਕੀਤੀ ਗਈ।`;
  }
  return existing;
}

export function generateIntCp001ReleaseLocalizedQuestion(
  qlId: IntCp001FinalQlId,
  seed: string,
  locale: IntCp001Locale,
): IntCp001LocalizedQuestion {
  const item = generateIntCp001FinalLocalizedQuestion(qlId, seed, locale);
  const stem = polishStem(item.stem, locale);
  const explanation = {
    ...item.explanation,
    trapAnalysis: {
      ...item.explanation.trapAnalysis,
      items: item.explanation.trapAnalysis.items.map((trap) => ({
        ...trap,
        explanation: correctedTrapExplanation(
          trap.misconceptionId,
          trap.optionText,
          trap.explanation,
          locale,
        ),
      })),
    },
  };
  const errors = item.validation.errors.filter((error) => {
    if (error === "Localized stem contains an awkward annual-rate construction.") {
      return /वार्षिक की साधारण ब्याज दर|ਸਾਲਾਨਾ ਦੀ ਸਧਾਰਣ ਵਿਆਜ ਦਰ/u.test(stem);
    }
    if (error === "Localized amount-multiple stem contains a gender-agreement defect.") {
      return /मूलधन की कितनी गुना|ਮੂਲਧਨ ਦੀ ਕਿੰਨੀ ਗੁਣਾ/u.test(stem);
    }
    return true;
  });

  if (/वार्षिक की साधारण ब्याज दर|ਸਾਲਾਨਾ ਦੀ ਸਧਾਰਣ ਵਿਆਜ ਦਰ/u.test(stem)) {
    errors.push("Localized stem contains an awkward annual-rate construction.");
  }
  if (/वार्षिक की दर|ਸਾਲਾਨਾ ਦੀ ਦਰ/u.test(stem)) {
    errors.push("Localized stem contains an awkward annual-rate phrase.");
  }
  if (/मूलधन की कितनी गुना|ਮੂਲਧਨ ਦੀ ਕਿੰਨੀ ਗੁਣਾ/u.test(stem)) {
    errors.push("Localized amount-multiple stem contains a gender-agreement defect.");
  }
  if (new Set(explanation.trapAnalysis.items.map((trap) => trap.explanation)).size !== 3) {
    errors.push("Release distractor explanations are not option-specific.");
  }

  return {
    ...item,
    stem,
    explanation,
    validation: {
      ...item.validation,
      ok: errors.length === 0,
      errors,
    },
  };
}

export { assertIntCp001LocaleParity };
export type { IntCp001LocalizedQuestion };
