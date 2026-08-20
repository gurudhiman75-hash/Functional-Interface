import type { AlgPermanentQlId } from "./allocation";
import {
  generateAlgPermanentMultilingualReviewV1 as generateRaw,
  type AlgPermanentMultilingualReviewV1Item,
  type AlgReviewLocale,
} from "./multilingual-review-v1";

function polishHindi(text: string): string {
  return text
    .replace(/^Substitute x = (.+): (.+)\.$/gm, "x = $1 रखें: $2।")
    .replace(/^Isolating ([A-Za-zα-γ]+) gives (.+)\.$/gm, "$1 को अलग करने पर $2 मिलता है।")
    .replace(/^Substitute (.+) in (.+): (.+)\.$/gm, "$1 को $2 में रखें: $3।")
    .replace(/^The known terms total (.+), so (.+)\.$/gm, "ज्ञात पदों का योग $1 है, इसलिए $2।")
    .replace(/^The same factor occurs twice, hence (.+)\.$/gm, "यही गुणनखंड दो बार आता है, इसलिए $1।")
    .replace(/^Both values satisfy the original equation\.$/gm, "दोनों मान मूल समीकरण को संतुष्ट करते हैं।")
    .replace(/^There is no need to solve the roots separately\.$/gm, "मूलों को अलग-अलग हल करने की आवश्यकता नहीं है।")
    .replace(/^The individual roots do not need to be solved\.$/gm, "अलग-अलग मूल निकालने की आवश्यकता नहीं है।")
    .replace(/^These are exact roots, so no decimal approximation is needed\.$/gm, "ये सटीक मूल हैं, इसलिए दशमलव सन्निकटन की आवश्यकता नहीं है।");
}

function polishPunjabi(text: string): string {
  return text
    .replace(/^Substitute x = (.+): (.+)\.$/gm, "x = $1 ਰੱਖੋ: $2।")
    .replace(/^Isolating ([A-Za-zα-γ]+) gives (.+)\.$/gm, "$1 ਨੂੰ ਅਲੱਗ ਕਰਨ ਤੇ $2 ਮਿਲਦਾ ਹੈ।")
    .replace(/^Substitute (.+) in (.+): (.+)\.$/gm, "$1 ਨੂੰ $2 ਵਿੱਚ ਰੱਖੋ: $3।")
    .replace(/^The known terms total (.+), so (.+)\.$/gm, "ਪਤਾ ਪਦਾਂ ਦਾ ਜੋੜ $1 ਹੈ, ਇਸ ਲਈ $2।")
    .replace(/^The same factor occurs twice, hence (.+)\.$/gm, "ਇਹੀ ਗੁਣਨਖੰਡ ਦੋ ਵਾਰ ਆਉਂਦਾ ਹੈ, ਇਸ ਲਈ $1।")
    .replace(/^Both values satisfy the original equation\.$/gm, "ਦੋਵੇਂ ਮਾਨ ਮੂਲ ਸਮੀਕਰਨ ਨੂੰ ਸੰਤੁਸ਼ਟ ਕਰਦੇ ਹਨ।")
    .replace(/^There is no need to solve the roots separately\.$/gm, "ਮੂਲਾਂ ਨੂੰ ਵੱਖ-ਵੱਖ ਹੱਲ ਕਰਨ ਦੀ ਲੋੜ ਨਹੀਂ ਹੈ।")
    .replace(/^The individual roots do not need to be solved\.$/gm, "ਵੱਖ-ਵੱਖ ਮੂਲ ਕੱਢਣ ਦੀ ਲੋੜ ਨਹੀਂ ਹੈ।")
    .replace(/^These are exact roots, so no decimal approximation is needed\.$/gm, "ਇਹ ਸਹੀ ਮੂਲ ਹਨ, ਇਸ ਲਈ ਦਸ਼ਮਲਵ ਅਨੁਮਾਨ ਦੀ ਲੋੜ ਨਹੀਂ ਹੈ।");
}

export function generateAlgPermanentMultilingualReviewV1(
  qlId: AlgPermanentQlId,
  seed: number,
  locale: AlgReviewLocale,
  requestedVariantIndex?: number,
): AlgPermanentMultilingualReviewV1Item {
  const item = generateRaw(qlId, seed, locale, requestedVariantIndex);
  return {
    ...item,
    explanation: locale === "hi-IN" ? polishHindi(item.explanation) : polishPunjabi(item.explanation),
  };
}
