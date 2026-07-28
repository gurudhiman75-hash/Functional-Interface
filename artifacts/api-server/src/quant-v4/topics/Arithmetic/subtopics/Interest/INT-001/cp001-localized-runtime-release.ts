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
      .replace(/कुल राशि, मूलधन की कितनी गुना/gu, "कुल राशि, मूलधन का कितना गुना");
  }
  return stem
    .replace(/(\d+(?:\.\d+)?%) ਸਾਲਾਨਾ ਦੀ ਸਧਾਰਣ ਵਿਆਜ ਦਰ/gu, "$1 ਸਾਲਾਨਾ ਸਧਾਰਣ ਵਿਆਜ ਦੀ ਦਰ")
    .replace(/ਕੁੱਲ ਰਕਮ, ਮੂਲਧਨ ਦੀ ਕਿੰਨੀ ਗੁਣਾ/gu, "ਕੁੱਲ ਰਕਮ, ਮੂਲਧਨ ਦਾ ਕਿੰਨਾ ਗੁਣਾ");
}

export function generateIntCp001ReleaseLocalizedQuestion(
  qlId: IntCp001FinalQlId,
  seed: string,
  locale: IntCp001Locale,
): IntCp001LocalizedQuestion {
  const item = generateIntCp001FinalLocalizedQuestion(qlId, seed, locale);
  const stem = polishStem(item.stem, locale);
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
  if (/मूलधन की कितनी गुना|ਮੂਲਧਨ ਦੀ ਕਿੰਨੀ ਗੁਣਾ/u.test(stem)) {
    errors.push("Localized amount-multiple stem contains a gender-agreement defect.");
  }

  return {
    ...item,
    stem,
    validation: {
      ...item.validation,
      ok: errors.length === 0,
      errors,
    },
  };
}

export { assertIntCp001LocaleParity };
export type { IntCp001LocalizedQuestion };
