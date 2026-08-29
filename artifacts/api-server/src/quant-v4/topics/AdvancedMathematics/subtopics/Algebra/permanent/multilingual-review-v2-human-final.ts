import type { AlgPermanentQlId } from "./allocation";
import type { AlgReviewLocale } from "./multilingual-review-v1";
import {
  generateAlgPermanentMultilingualReviewV2HumanSealed,
} from "./multilingual-review-v2-human-sealed";
import type { AlgPermanentMultilingualReviewV2Item } from "./multilingual-review-v2";

function finalQuestionCleanup(item: AlgPermanentMultilingualReviewV2Item): string {
  let value = item.question;

  if (item.locale === "hi-IN") {
    value = value.replace(
      /^α और β, (.+?)। (.+) के मूल हैं।$/,
      "α और β, $1 के मूल हैं। $2।",
    );
  } else {
    value = value.replace(
      /^α ਅਤੇ β, (.+?)\. (.+) ਦੇ ਮੂਲ ਹਨ\.$/,
      "α ਅਤੇ β, $1 ਦੇ ਮੂਲ ਹਨ. $2.",
    );
  }

  return value.replace(/ {2,}/g, " ").trim();
}

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

  if (item.prototypeId === "ALG-CP012-CAND-010") {
    if (item.locale === "pa-IN") {
      value = value.replace(
        /ਦੋ-ਘਾਤੀ ਹੈ ਮੂਲ ([^\s,.]+) ਅਤੇ ([^\s,.]+) ਅਤੇ ਉੱਪਰ ਖੁੱਲ੍ਹਦਾ ਹੈ, ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਮਾਨ ਹੋਣ ([^.]+)\. ਸਹੀ ਅੰਤਰਾਲ ਹੈ ([^.]+)\./g,
        (_match, left: string, right: string, condition: string, interval: string) => {
          const inclusive = /ਸਮੇਤ|ਸ਼ਾਮਲ|ਦੋਵੇਂ/.test(condition);
          return `ਦੋ-ਘਾਤੀ ਦੇ ਮੂਲ ${left} ਅਤੇ ${right} ਹਨ ਅਤੇ ਪਰਾਬੋਲਾ ਉੱਪਰ ਖੁੱਲ੍ਹਦਾ ਹੈ, ਇਸ ਲਈ ਵਿਆੰਜਕ ਦੋਵੇਂ ਮੂਲਾਂ ਦੇ ਵਿਚਕਾਰ ${inclusive ? "ਗੈਰ-ਧਨਾਤਮਕ" : "ਰਣਾਤਮਕ"} ਹੈ. ${inclusive ? "ਦੋਵੇਂ ਮੂਲ ਹੱਲ ਵਿੱਚ ਸ਼ਾਮਲ ਹਨ. " : ""}ਸਹੀ ਅੰਤਰਾਲ ${interval} ਹੈ.`;
        },
      );
    } else {
      value = value.replace(
        /द्विघात है मूल ([^\s,।]+) और ([^\s,।]+) और ऊपर खुलता है, इसलिए आवश्यक मान हों ([^.।]+)\. सटीक अंतराल है ([^।]+)।/g,
        (_match, left: string, right: string, condition: string, interval: string) => {
          const inclusive = /समेत|सहित|शामिल|दोनों/.test(condition);
          return `द्विघात के मूल ${left} और ${right} हैं तथा परवलय ऊपर खुलता है, इसलिए व्यंजक दोनों मूलों के बीच ${inclusive ? "गैर-धनात्मक" : "ऋणात्मक"} है। ${inclusive ? "दोनों मूल हल में शामिल हैं। " : ""}सटीक अंतराल ${interval} है।`;
        },
      );
    }
  }

  if (item.prototypeId === "ALG-CP013-CAND-006") {
    if (item.locale === "pa-IN") {
      value = value.replace(/ ?ਪਰਮ ਮਾਨ ਹੈ ਤੇ ਸਬਤੋਂ ਛੋਟਾ [^.\n]+\./g, "");
    } else {
      value = value.replace(/ ?परम मान है [^।.\n]*सबसे छोटा [^।.\n]*किसी एक सीमा:[^।.\n]*[।.]/g, "");
    }
  }

  if (
    item.prototypeId === "ALG-CP012-CAND-011" ||
    item.prototypeId === "ALG-CP012-CAND-012"
  ) {
    if (item.locale === "pa-IN") {
      value = value.replace(/^.*(?:ਪ੍ਰਾਪਤ ਹੋਵੇਨੇ ਜੋੜ੍ਯ|ਸਗੋਂ ਤੋਂ ਕੇਵਲ).*$/gm,
        "ਬਰਾਬਰੀ ਦੀ ਸਥਿਤੀ ਦਿਖਾਉਂਦੀ ਹੈ ਕਿ ਇਹ ਸੀਮਾ ਅਸਲ ਵਿੱਚ ਪ੍ਰਾਪਤ ਹੁੰਦੀ ਹੈ; ਇਸ ਲਈ ਇਹੀ ਅਸਲ ਘੱਟੋ-ਘੱਟ ਮਾਨ ਹੈ, ਕੇਵਲ ਹੇਠਲੀ ਸੀਮਾ ਨਹੀਂ.");
    } else {
      value = value.replace(/^.*बल्कि से केवल.*$/gm,
        "समानता की स्थिति दिखाती है कि यह सीमा वास्तव में प्राप्त होती है; इसलिए यही वास्तविक न्यूनतम है, केवल निचली सीमा नहीं।");
    }
  }

  return value
    .replace(/\n{3,}/g, "\n\n")
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
    question: finalQuestionCleanup(item),
    explanation: finalEditorialCleanup(item),
  });
}
