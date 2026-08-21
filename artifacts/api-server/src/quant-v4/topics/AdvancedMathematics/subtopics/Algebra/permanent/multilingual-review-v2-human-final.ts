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

  if (item.prototypeId === "ALG-CP012-CAND-006") {
    if (item.locale === "pa-IN") {
      value = value
        .replace(/^A ਧਨਾਤਮਕ ਗੁਣਜ ਦਾ (.+) ਹੈ ਕਦੇ ਨਹੀਂ ਰਣਾਤਮਕ, ਇਸ ਲਈ ਇਹ ਹੈ ਗੈਰ-ਰਣਾਤਮਕ ਲਈ ਹਰ ਵਾਸਤਵਿਕ x\.$/gm,
          "$1 ਦਾ ਧਨਾਤਮਕ ਗੁਣਜ ਕਦੇ ਰਣਾਤਮਕ ਨਹੀਂ ਹੁੰਦਾ, ਇਸ ਲਈ ਵਿਆੰਜਕ ਹਰ ਵਾਸਤਵਿਕ x ਲਈ ਗੈਰ-ਰਣਾਤਮਕ ਹੈ.")
        .replace(/^A ਧਨਾਤਮਕ ਗੁਣਜ ਦਾ (.+) ਸਕਦਾ ਹੈ ਹੋਵੇ ਵੱਧ ਤੋਂ ਵੱਧ ਸਿਫ਼ਰ ਕੇਵਲ ਜਦੋਂ ਵਰਗ ਆਪ ਹੈ ਸਿਫ਼ਰ\.$/gm,
          "$1 ਦਾ ਧਨਾਤਮਕ ਗੁਣਜ ਵੱਧ ਤੋਂ ਵੱਧ ਸਿਫ਼ਰ ਤਦ ਹੀ ਹੋ ਸਕਦਾ ਹੈ ਜਦੋਂ ਵਰਗ ਆਪ ਸਿਫ਼ਰ ਹੋਵੇ.");
    } else {
      value = value
        .replace(/^A धनात्मक गुणज का (.+) है कभी नहीं ऋणात्मक, इसलिए यह है ऋणेतर के लिए प्रत्येक वास्तविक x।$/gm,
          "$1 का धनात्मक गुणज कभी ऋणात्मक नहीं होता, इसलिए व्यंजक प्रत्येक वास्तविक x के लिए गैर-ऋणात्मक है।")
        .replace(/^A धनात्मक गुणज का (.+) सकता है हो अधिकतम शून्य केवल जब वर्ग स्वयं है शून्य।$/gm,
          "$1 का धनात्मक गुणज अधिकतम शून्य तभी हो सकता है जब वर्ग स्वयं शून्य हो।");
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
