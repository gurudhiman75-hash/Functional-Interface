import type { IopEnglishProductionCaselet } from "./english-production-types.ts";
import type { IopPermanentQlId } from "./permanent-authorities.ts";
import {
  generateIopLocalizedReviewCaselet as generateBaseLocalizedCaselet,
  localizeIopEnglishCaselet as localizeBaseEnglishCaselet,
  type IopLocalizedCaselet,
  type IopLocalizedLocale,
} from "./localization-v1.ts";

function polishRemainingStepExplanation(caselet: IopLocalizedCaselet): IopLocalizedCaselet {
  const children = caselet.children.map((child) => {
    if (child.evidence.kind !== "REMAINING_STEP_COUNT") return child;
    const current = child.evidence.stepNumber;
    const total = caselet.target.steps.length;
    const remaining = total - current;
    const explanation = caselet.locale === "hi-IN"
      ? `यहाँ पूरी व्यवस्था दोबारा बनाने की जरूरत नहीं है। मशीन का अंतिम परिणाम चरण ${total} में मिलता है और ${current} चरण पूरे हो चुके हैं। इसलिए बाकी चरण = ${total} - ${current} = ${remaining}। अतः सही उत्तर ${child.answerDisplay} है।`
      : `ਇੱਥੇ ਪੂਰੀ ਤਰਤੀਬ ਮੁੜ ਬਣਾਉਣ ਦੀ ਲੋੜ ਨਹੀਂ ਹੈ। ਮਸ਼ੀਨ ਦਾ ਅੰਤਿਮ ਨਤੀਜਾ ਪੜਾਅ ${total} ਵਿੱਚ ਮਿਲਦਾ ਹੈ ਅਤੇ ${current} ਪੜਾਅ ਪੂਰੇ ਹੋ ਚੁੱਕੇ ਹਨ। ਇਸ ਲਈ ਬਾਕੀ ਪੜਾਅ = ${total} - ${current} = ${remaining}। ਇਸ ਕਰਕੇ ਸਹੀ ਉੱਤਰ ${child.answerDisplay} ਹੈ।`;
    return { ...child, explanation };
  }) as unknown as IopLocalizedCaselet["children"];
  return { ...caselet, children };
}

export function localizeIopEnglishCaseletV1(
  english: IopEnglishProductionCaselet,
  locale: IopLocalizedLocale,
): IopLocalizedCaselet {
  return polishRemainingStepExplanation(localizeBaseEnglishCaselet(english, locale));
}

export function generateIopLocalizedReviewCaseletV1(
  seed: string,
  qlId: IopPermanentQlId,
  sourceModeId: string,
  locale: IopLocalizedLocale,
): IopLocalizedCaselet {
  return polishRemainingStepExplanation(generateBaseLocalizedCaselet(seed, qlId, sourceModeId, locale));
}

export type { IopLocalizedCaselet, IopLocalizedLocale } from "./localization-v1.ts";
