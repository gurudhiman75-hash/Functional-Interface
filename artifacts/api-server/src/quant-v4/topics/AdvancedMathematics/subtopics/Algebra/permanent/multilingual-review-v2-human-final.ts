import type { AlgPermanentQlId } from "./allocation";
import type { AlgReviewLocale } from "./multilingual-review-v1";
import {
  generateAlgPermanentMultilingualReviewV2HumanSealed,
} from "./multilingual-review-v2-human-sealed";
import type { AlgPermanentMultilingualReviewV2Item } from "./multilingual-review-v2";

function finalEditorialCleanup(item: AlgPermanentMultilingualReviewV2Item): string {
  let value = item.explanation;

  if (item.prototypeId === "ALG-CP004-CAND-003") {
    if (item.locale === "pa-IN") {
      value = value
        .replace(/\s*ਪਹੱਲਾ ਅਤੇ ਆਖਰੀ ਪਦ ਹਨ ਵਰਗ, ਅਤੇ ਵਿਚਕਾਰਲਾ ਪਦ ਹੈ ਦੁੱਗਣਾ ਉਨਦਾ ਗੁਣਨਫਲ\./g, "")
        .replace(/\s*ਪਹੱਲਾ ਅਤੇ ਆਖਰੀ ਪਦ ਹਨ ਵਰਗ, ਅਤੇ ਵਿਚਕਾਰਲਾ ਪਦ ਹੈ ਦੁੱਗਣਾ ਉਨ੍ਹਾਂ ਦਾ ਗੁਣਨਫਲ\./g, "");
    } else {
      value = value
        .replace(/\s*पहला और अंतिम पद हैं वर्ग, और मध्य पद है दुगुना उनका गुणनफल।/g, "")
        .replace(/\s*पहला और आखिरी पद हैं वर्ग, और मध्य पद है दुगुना उनका गुणनफल।/g, "");
    }
  }

  return value
    .replace(/[ \t]+\n/g, "\n")
    .replace(/ {2,}/g, " ")
    .trim();
}

export function generateAlgPermanentMultilingualReviewV2HumanFinal(
  qlId: AlgPermanentQlId,
  seed: number,
  locale: AlgReviewLocale,
  requestedVariantIndex?: number,
): AlgPermanentMultilingualReviewV2Item {
  const item = generateAlgPermanentMultilingualReviewV2HumanSealed(
    qlId,
    seed,
    locale,
    requestedVariantIndex,
  );
  return Object.freeze({
    ...item,
    explanation: finalEditorialCleanup(item),
  });
}
