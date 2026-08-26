import type { SriDiscoveryQuestion, SriHumanExplanation } from "./discovery-types";
import { generateSriPermanentEnglishQuestionV1 } from "./permanent-runtime-v1";
import type { SriPermanentQlId } from "./permanent-allocation-v1";
import {
  localizeSriLearnerTextV1 as localizeSriLearnerTextNaturalV1,
  type SriLocalizedLocaleV1,
  type SriLocalizedLanguageV1,
  type SriLocalizedDiscoveryQuestionV1,
  type SriPermanentLocalizedQuestionV1,
} from "./permanent-localization-natural-v1";

export type {
  SriLocalizedLocaleV1,
  SriLocalizedLanguageV1,
  SriLocalizedDiscoveryQuestionV1,
  SriPermanentLocalizedQuestionV1,
} from "./permanent-localization-natural-v1";

const LANGUAGE_BY_LOCALE: Record<SriLocalizedLocaleV1, SriLocalizedLanguageV1> = {
  "hi-IN": "Hindi",
  "pa-IN": "Punjabi",
};

const ZERO_EXPONENT_SENTENCE: Record<SriLocalizedLocaleV1, string> = {
  "hi-IN": "किसी भी शून्येतर संख्या की 0 घात 1 होती है।",
  "pa-IN": "ਕਿਸੇ ਵੀ ਸਿਫ਼ਰ ਤੋਂ ਵੱਖ ਸੰਖਿਆ ਦੀ 0 ਘਾਤ 1 ਹੁੰਦੀ ਹੈ।",
};

const CROSS_TERM_COMPARISON_SENTENCE: Record<SriLocalizedLocaleV1, string> = {
  "hi-IN": "दोनों धनात्मक व्यंजकों का वर्ग कीजिए। उनके परिमेय भाग समान हैं, इसलिए मिश्र पदों के सटीक गुणनफलों की तुलना कीजिए।",
  "pa-IN": "ਦੋਵੇਂ ਧਨਾਤਮਕ ਵਿਅੰਜਕਾਂ ਦਾ ਵਰਗ ਕਰੋ। ਉਨ੍ਹਾਂ ਦੇ ਪਰਿਮੇਯ ਭਾਗ ਇੱਕੋ ਹਨ, ਇਸ ਲਈ ਮਿਸ਼ਰਤ ਪਦਾਂ ਦੇ ਸਟੀਕ ਗੁਣਨਫਲਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ।",
};

const EXACT_SENTENCES: Record<SriLocalizedLocaleV1, Readonly<Record<string, string>>> = {
  "hi-IN": {
    "Simplify the index expression using the applicable law.": "उपयुक्त घातांक नियम का उपयोग करके व्यंजक को सरल कीजिए।",
    "Evaluate the index expression exactly over the real numbers.": "वास्तविक संख्याओं में घातांक व्यंजक का सटीक मान ज्ञात कीजिए।",
    "Rewrite the bases into a common structure and simplify exactly.": "आधारों को समान आधार के रूप में लिखकर सटीक रूप से सरल कीजिए।",
    "Use the supplied power relation to recover the requested exact quantity.": "दिए गए घात संबंध का उपयोग करके पूछी गई राशि का सटीक मान ज्ञात कीजिए।",
    "Compare the quantities exactly using index laws.": "घातांक नियमों का उपयोग करके राशियों की सटीक तुलना कीजिए।",
    "Simplify or classify the radical exactly.": "करणी को सटीक रूप से सरल कीजिए या उसका वर्गीकरण कीजिए।",
    "Simplify the surd expression exactly.": "करणी व्यंजक को सटीक रूप से सरल कीजिए।",
    "Rationalise the denominator and simplify exactly.": "हर का परिमेयकरण करके सटीक रूप से सरल कीजिए।",
    "Simplify the nested surd exactly.": "नेस्टेड करणी को सटीक रूप से सरल करणी रूप में लिखिए।",
    "Evaluate the expression exactly.": "व्यंजक का सटीक मान ज्ञात कीजिए।",
    "Classify it as rational or a surd.": "निर्धारित कीजिए कि यह परिमेय है या करणी।",
    "Find the condition forced by the equality.": "समानता से आवश्यक होने वाली शर्त ज्ञात कीजिए।",
    "Compare the two expressions exactly.": "दोनों व्यंजकों की सटीक तुलना कीजिए।",
    "Identify the candidate that fails the original radical equation.": "उस मान की पहचान कीजिए जो मूल करणी समीकरण को संतुष्ट नहीं करता।",
    "Evaluate the fractional-index expression through its radical form.": "करणी रूप का उपयोग करके भिन्नात्मक घातांक व्यंजक का मान ज्ञात कीजिए।",
    "First convert the terminating decimal exponent exactly: -1.5 = -3/2.": "पहले समाप्त दशमलव घातांक को सटीक भिन्न में बदलिए: -1.5 = -3/2।",
    "Check zero-base edge conditions before applying ordinary index laws.": "सामान्य घातांक नियम लगाने से पहले शून्य आधार की विशेष स्थितियाँ जाँचिए।",
    "Negative exponent requires a non-zero base": "ऋणात्मक घातांक के लिए आधार शून्येतर होना आवश्यक है",
    "A negative exponent requires a non-zero base": "ऋणात्मक घातांक के लिए आधार शून्येतर होना आवश्यक है",
    "0^0 is undefined": "0^0 अपरिभाषित है",
    "A negative number": "एक ऋणात्मक संख्या",
    "Equal exponents allow the bases to be multiplied; the composite result can also be harmonised to the prime base.": "समान घातांक होने पर आधारों को गुणा किया जा सकता है; प्राप्त परिणाम को भी समान अभाज्य आधार की घात के रूप में लिखा जा सकता है।",
    "First recover the multiplier a^k from the ratio, then apply that multiplier once more.": "पहले अनुपात से गुणक a^k ज्ञात कीजिए, फिर उसी गुणक का एक बार और उपयोग कीजिए।",
    "Cannot be determined exactly": "सटीक रूप से निर्धारित नहीं किया जा सकता",
  },
  "pa-IN": {
    "Simplify the index expression using the applicable law.": "ਉਚਿਤ ਘਾਤਾਂਕ ਨਿਯਮ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਵਿਅੰਜਕ ਨੂੰ ਸਰਲ ਕਰੋ।",
    "Evaluate the index expression exactly over the real numbers.": "ਵਾਸਤਵਿਕ ਸੰਖਿਆਵਾਂ ਵਿੱਚ ਘਾਤਾਂਕ ਵਿਅੰਜਕ ਦਾ ਸਟੀਕ ਮੁੱਲ ਪਤਾ ਕਰੋ।",
    "Rewrite the bases into a common structure and simplify exactly.": "ਅਧਾਰਾਂ ਨੂੰ ਇੱਕੋ ਸਾਂਝੇ ਅਧਾਰ ਦੇ ਰੂਪ ਵਿੱਚ ਲਿਖ ਕੇ ਸਟੀਕ ਤੌਰ ਤੇ ਸਰਲ ਕਰੋ।",
    "Use the supplied power relation to recover the requested exact quantity.": "ਦਿੱਤੇ ਘਾਤ ਸੰਬੰਧ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਪੁੱਛੀ ਗਈ ਰਾਸ਼ੀ ਦਾ ਸਟੀਕ ਮੁੱਲ ਪਤਾ ਕਰੋ।",
    "Compare the quantities exactly using index laws.": "ਘਾਤਾਂਕ ਨਿਯਮਾਂ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਰਾਸ਼ੀਆਂ ਦੀ ਸਟੀਕ ਤੁਲਨਾ ਕਰੋ।",
    "Simplify or classify the radical exactly.": "ਕਰਣੀ ਨੂੰ ਸਟੀਕ ਤੌਰ ਤੇ ਸਰਲ ਕਰੋ ਜਾਂ ਇਸ ਦਾ ਵਰਗੀਕਰਨ ਕਰੋ।",
    "Simplify the surd expression exactly.": "ਕਰਣੀ ਵਿਅੰਜਕ ਨੂੰ ਸਟੀਕ ਤੌਰ ਤੇ ਸਰਲ ਕਰੋ।",
    "Rationalise the denominator and simplify exactly.": "ਹਰ ਦਾ ਪਰਿਮੇਯਕਰਨ ਕਰਕੇ ਸਟੀਕ ਤੌਰ ਤੇ ਸਰਲ ਕਰੋ।",
    "Simplify the nested surd exactly.": "ਨੇਸਟਡ ਕਰਣੀ ਨੂੰ ਸਟੀਕ ਤੌਰ ਤੇ ਸਰਲ ਕਰਣੀ ਰੂਪ ਵਿੱਚ ਲਿਖੋ।",
    "Evaluate the expression exactly.": "ਵਿਅੰਜਕ ਦਾ ਸਟੀਕ ਮੁੱਲ ਪਤਾ ਕਰੋ।",
    "Classify it as rational or a surd.": "ਨਿਰਧਾਰਤ ਕਰੋ ਕਿ ਇਹ ਪਰਿਮੇਯ ਹੈ ਜਾਂ ਕਰਣੀ।",
    "Find the condition forced by the equality.": "ਬਰਾਬਰੀ ਤੋਂ ਲਾਜ਼ਮੀ ਹੋਣ ਵਾਲੀ ਸ਼ਰਤ ਪਤਾ ਕਰੋ।",
    "Compare the two expressions exactly.": "ਦੋਵੇਂ ਵਿਅੰਜਕਾਂ ਦੀ ਸਟੀਕ ਤੁਲਨਾ ਕਰੋ।",
    "Identify the candidate that fails the original radical equation.": "ਉਸ ਮੁੱਲ ਦੀ ਪਛਾਣ ਕਰੋ ਜੋ ਮੂਲ ਕਰਣੀ ਸਮੀਕਰਨ ਨੂੰ ਪੂਰਾ ਨਹੀਂ ਕਰਦਾ।",
    "Evaluate the fractional-index expression through its radical form.": "ਕਰਣੀ ਰੂਪ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਭਿੰਨਾਤਮਕ ਘਾਤਾਂਕ ਵਿਅੰਜਕ ਦਾ ਮੁੱਲ ਪਤਾ ਕਰੋ।",
    "First convert the terminating decimal exponent exactly: -1.5 = -3/2.": "ਪਹਿਲਾਂ ਸਮਾਪਤ ਦਸ਼ਮਲਵ ਘਾਤਾਂਕ ਨੂੰ ਸਟੀਕ ਭਿੰਨ ਵਿੱਚ ਬਦਲੋ: -1.5 = -3/2।",
    "Check zero-base edge conditions before applying ordinary index laws.": "ਆਮ ਘਾਤਾਂਕ ਨਿਯਮ ਲਗਾਉਣ ਤੋਂ ਪਹਿਲਾਂ ਸਿਫ਼ਰ ਅਧਾਰ ਦੀਆਂ ਵਿਸ਼ੇਸ਼ ਸਥਿਤੀਆਂ ਜਾਂਚੋ।",
    "Negative exponent requires a non-zero base": "ਰਿਣਾਤਮਕ ਘਾਤਾਂਕ ਲਈ ਅਧਾਰ ਸਿਫ਼ਰ ਤੋਂ ਵੱਖ ਹੋਣਾ ਲਾਜ਼ਮੀ ਹੈ",
    "A negative exponent requires a non-zero base": "ਰਿਣਾਤਮਕ ਘਾਤਾਂਕ ਲਈ ਅਧਾਰ ਸਿਫ਼ਰ ਤੋਂ ਵੱਖ ਹੋਣਾ ਲਾਜ਼ਮੀ ਹੈ",
    "0^0 is undefined": "0^0 ਅਪਰਿਭਾਸ਼ਿਤ ਹੈ",
    "A negative number": "ਇੱਕ ਰਿਣਾਤਮਕ ਸੰਖਿਆ",
    "Equal exponents allow the bases to be multiplied; the composite result can also be harmonised to the prime base.": "ਇੱਕੋ ਘਾਤਾਂਕ ਹੋਣ ਤੇ ਅਧਾਰਾਂ ਨੂੰ ਗੁਣਾ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ; ਮਿਲੇ ਨਤੀਜੇ ਨੂੰ ਵੀ ਸਾਂਝੇ ਅਭਾਜ ਅਧਾਰ ਦੀ ਘਾਤ ਵਜੋਂ ਲਿਖਿਆ ਜਾ ਸਕਦਾ ਹੈ।",
    "First recover the multiplier a^k from the ratio, then apply that multiplier once more.": "ਪਹਿਲਾਂ ਅਨੁਪਾਤ ਤੋਂ ਗੁਣਕ a^k ਪਤਾ ਕਰੋ, ਫਿਰ ਉਸੇ ਗੁਣਕ ਦੀ ਇੱਕ ਵਾਰ ਹੋਰ ਵਰਤੋਂ ਕਰੋ।",
    "Cannot be determined exactly": "ਸਟੀਕ ਤੌਰ ਤੇ ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ",
  },
};

function nativeConnectorText(value: string, locale: SriLocalizedLocaleV1): string {
  return value
    .replace(/\s+and then\s+/giu, locale === "hi-IN" ? " और फिर " : " ਅਤੇ ਫਿਰ ")
    .replace(/\s+and\s+/giu, locale === "hi-IN" ? " और " : " ਅਤੇ ")
    .replace(/\s+or\s+/giu, locale === "hi-IN" ? " या " : " ਜਾਂ ");
}

export function localizeSriLearnerTextV1(text: string, locale: SriLocalizedLocaleV1): string {
  if (text === "Any non-zero number raised to the power 0 equals 1.") {
    return ZERO_EXPONENT_SENTENCE[locale];
  }

  if (text === "Square both positive expressions. Their rational parts match, so compare the exact cross-term products.") {
    return CROSS_TERM_COMPARISON_SENTENCE[locale];
  }

  const exact = EXACT_SENTENCES[locale][text];
  if (exact) return exact;

  let match = text.match(/^Which statement correctly describes (.+) over the real numbers\?$/u);
  if (match) {
    return locale === "hi-IN"
      ? `वास्तविक संख्याओं में ${match[1]} के बारे में कौन-सा कथन सही है?`
      : `ਵਾਸਤਵਿਕ ਸੰਖਿਆਵਾਂ ਵਿੱਚ ${match[1]} ਬਾਰੇ ਕਿਹੜਾ ਕਥਨ ਸਹੀ ਹੈ?`;
  }

  match = text.match(/^Over the real numbers, how should (.+) be classified\?$/u);
  if (match) {
    return locale === "hi-IN"
      ? `वास्तविक संख्याओं में ${match[1]} का वर्गीकरण कैसे होगा?`
      : `ਵਾਸਤਵਿਕ ਸੰਖਿਆਵਾਂ ਵਿੱਚ ${match[1]} ਦਾ ਵਰਗੀਕਰਨ ਕਿਵੇਂ ਹੋਵੇਗਾ?`;
  }

  match = text.match(/^Cube root of (.+) is (.+)$/u);
  if (match) {
    return locale === "hi-IN"
      ? `${match[1]} का घनमूल ${match[2]} है`
      : `${match[1]} ਦਾ ਘਣਮੂਲ ${match[2]} ਹੈ`;
  }

  match = text.match(/^Use fractional-index laws to simplify (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `भिन्नात्मक घातांक नियमों का उपयोग करके ${match[1]} को सरल कीजिए।`
      : `ਭਿੰਨਾਤਮਕ ਘਾਤਾਂਕ ਨਿਯਮਾਂ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ${match[1]} ਨੂੰ ਸਰਲ ਕਰੋ।`;
  }

  match = text.match(/^Use fractional-index rule to simplify (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `भिन्नात्मक घातांक नियम का उपयोग करके ${match[1]} को सरल कीजिए।`
      : `ਭਿੰਨਾਤਮਕ ਘਾਤਾਂਕ ਨਿਯਮ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ${match[1]} ਨੂੰ ਸਰਲ ਕਰੋ।`;
  }

  match = text.match(/^Evaluate the rational base (.+) raised to (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `परिमेय आधार ${match[1]} की घात ${match[2]} का सटीक मान ज्ञात कीजिए।`
      : `ਪਰਿਮੇਯ ਅਧਾਰ ${match[1]} ਦੀ ਘਾਤ ${match[2]} ਦਾ ਸਟੀਕ ਮੁੱਲ ਪਤਾ ਕਰੋ।`;
  }

  match = text.match(/^Evaluate the fraction (.+) raised to (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `भिन्न ${match[1]} की घात ${match[2]} का सटीक मान ज्ञात कीजिए।`
      : `ਭਿੰਨ ${match[1]} ਦੀ ਘਾਤ ${match[2]} ਦਾ ਸਟੀਕ ਮੁੱਲ ਪਤਾ ਕਰੋ।`;
  }

  match = text.match(/^The fraction (.+) is raised to the reduced negative fractional index (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `भिन्न ${match[1]} पर लघुतम ऋणात्मक भिन्नात्मक घातांक ${match[2]} लगाया गया है।`
      : `ਭਿੰਨ ${match[1]} ਉੱਤੇ ਘਟਾਇਆ ਹੋਇਆ ਰਿਣਾਤਮਕ ਭਿੰਨਾਤਮਕ ਘਾਤਾਂਕ ${match[2]} ਲਗਾਇਆ ਗਿਆ ਹੈ।`;
  }

  match = text.match(/^Rewrite (.+) as a single power of (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `${match[1]} को ${match[2]} की एकल घात के रूप में लिखिए।`
      : `${match[1]} ਨੂੰ ${match[2]} ਦੀ ਇੱਕਲ ਘਾਤ ਵਜੋਂ ਲਿਖੋ।`;
  }

  match = text.match(/^Using the common exponent, find an equivalent single-power form of (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `समान घातांक का उपयोग करके ${match[1]} का समतुल्य एकल-घात रूप ज्ञात कीजिए।`
      : `ਸਾਂਝੇ ਘਾਤਾਂਕ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ${match[1]} ਦਾ ਸਮਤੁੱਲ ਇੱਕਲ-ਘਾਤ ਰੂਪ ਪਤਾ ਕਰੋ।`;
  }

  match = text.match(/^Which single power is equal to (.+)\?$/u);
  if (match) {
    return locale === "hi-IN"
      ? `${match[1]} के बराबर कौन-सी एकल घात है?`
      : `${match[1]} ਦੇ ਬਰਾਬਰ ਕਿਹੜੀ ਇੱਕਲ ਘਾਤ ਹੈ?`;
  }

  match = text.match(/^The given power expression is (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `दिया गया घात व्यंजक ${nativeConnectorText(match[1], locale)} है।`
      : `ਦਿੱਤਾ ਗਿਆ ਘਾਤ ਵਿਅੰਜਕ ${nativeConnectorText(match[1], locale)} ਹੈ।`;
  }

  match = text.match(/^The given product is (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `दिया गया गुणनफल ${nativeConnectorText(match[1], locale)} है।`
      : `ਦਿੱਤਾ ਗਿਆ ਗੁਣਨਫਲ ${nativeConnectorText(match[1], locale)} ਹੈ।`;
  }

  match = text.match(/^Since (.+), this is (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `क्योंकि ${nativeConnectorText(match[1], locale)}, इसलिए यह ${match[2]} है।`
      : `ਕਿਉਂਕਿ ${nativeConnectorText(match[1], locale)}, ਇਸ ਲਈ ਇਹ ${match[2]} ਹੈ।`;
  }

  match = text.match(/^Solve (.+) and then evaluate (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `${match[1]} को हल कीजिए और फिर ${match[2]} का मान ज्ञात कीजिए।`
      : `${match[1]} ਨੂੰ ਹੱਲ ਕਰੋ ਅਤੇ ਫਿਰ ${match[2]} ਦਾ ਮੁੱਲ ਪਤਾ ਕਰੋ।`;
  }

  match = text.match(/^The given equation is (.+) and then evaluate (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `दिया गया समीकरण ${match[1]} है और इसके बाद ${match[2]} का मान ज्ञात करना है।`
      : `ਦਿੱਤਾ ਗਿਆ ਸਮੀਕਰਨ ${match[1]} ਹੈ ਅਤੇ ਇਸ ਤੋਂ ਬਾਅਦ ${match[2]} ਦਾ ਮੁੱਲ ਪਤਾ ਕਰਨਾ ਹੈ।`;
  }

  match = text.match(/^If (.+) and (.+), find (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `यदि ${match[1]} और ${match[2]}, तो ${match[3]} ज्ञात कीजिए।`
      : `ਜੇ ${match[1]} ਅਤੇ ${match[2]}, ਤਾਂ ${match[3]} ਪਤਾ ਕਰੋ।`;
  }

  match = text.match(/^Given (.+) and (.+), evaluate (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `दिया है ${match[1]} और ${match[2]}; ${match[3]} का मान ज्ञात कीजिए।`
      : `ਦਿੱਤਾ ਹੈ ${match[1]} ਅਤੇ ${match[2]}; ${match[3]} ਦਾ ਮੁੱਲ ਪਤਾ ਕਰੋ।`;
  }

  match = text.match(/^Using the two relations (.+) and (.+), determine (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `दोनों संबंध ${match[1]} और ${match[2]} का उपयोग करके ${match[3]} ज्ञात कीजिए।`
      : `ਦੋਵੇਂ ਸੰਬੰਧ ${match[1]} ਅਤੇ ${match[2]} ਦੀ ਵਰਤੋਂ ਕਰਕੇ ${match[3]} ਪਤਾ ਕਰੋ।`;
  }

  match = text.match(/^The supplied condition is (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `दी गई शर्त ${nativeConnectorText(match[1], locale)} है।`
      : `ਦਿੱਤੀ ਗਈ ਸ਼ਰਤ ${nativeConnectorText(match[1], locale)} ਹੈ।`;
  }

  match = text.match(/^The supplied relation is the two relations (.+) and (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `दिए गए दो संबंध ${match[1]} और ${match[2]} हैं।`
      : `ਦਿੱਤੇ ਗਏ ਦੋ ਸੰਬੰਧ ${match[1]} ਅਤੇ ${match[2]} ਹਨ।`;
  }

  match = text.match(/^The supplied relation is (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `दिया गया संबंध ${nativeConnectorText(match[1], locale)} है।`
      : `ਦਿੱਤਾ ਗਿਆ ਸੰਬੰਧ ${nativeConnectorText(match[1], locale)} ਹੈ।`;
  }

  const denest = text.match(/^Denest (.+)\.$/u);
  if (denest) {
    return locale === "hi-IN"
      ? `${denest[1]} को सरल करणी रूप में लिखिए।`
      : `${denest[1]} ਨੂੰ ਸਰਲ ਕਰਣੀ ਰੂਪ ਵਿੱਚ ਲਿਖੋ।`;
  }

  const crossTermRadicand = text.match(/^Second cross-term radicand: (.+)$/u);
  if (crossTermRadicand) {
    return locale === "hi-IN"
      ? `दूसरे मिश्र पद की करणीगत संख्या: ${crossTermRadicand[1]}`
      : `ਦੂਜੇ ਮਿਸ਼ਰਤ ਪਦ ਦੀ ਕਰਣੀਗਤ ਸੰਖਿਆ: ${crossTermRadicand[1]}`;
  }

  const extraction = text.match(/^Write (.+) after extracting the perfect (.+)-power factor\.$/u);
  if (extraction) {
    return locale === "hi-IN"
      ? `${extraction[1]} में पूर्ण ${extraction[2]} घात वाला गुणनखंड बाहर निकालकर लिखिए।`
      : `${extraction[1]} ਵਿੱਚ ਪੂਰਨ ${extraction[2]} ਘਾਤ ਵਾਲਾ ਗੁਣਨਖੰਡ ਬਾਹਰ ਕੱਢ ਕੇ ਲਿਖੋ।`;
  }

  return localizeSriLearnerTextNaturalV1(text, locale);
}

export function localizeSriDiscoveryQuestionV1(
  source: SriDiscoveryQuestion,
  locale: SriLocalizedLocaleV1,
): SriLocalizedDiscoveryQuestionV1 {
  const answer = {
    ...source.answer,
    text: localizeSriLearnerTextV1(source.answer.text, locale),
  };
  const options = source.options.map((option) => ({
    ...option,
    text: localizeSriLearnerTextV1(option.text, locale),
  })) as unknown as SriDiscoveryQuestion["options"];
  const explanation: SriHumanExplanation = {
    given: localizeSriLearnerTextV1(source.explanation.given, locale),
    asked: localizeSriLearnerTextV1(source.explanation.asked, locale),
    method: localizeSriLearnerTextV1(source.explanation.method, locale),
    working: source.explanation.working.map((line) => localizeSriLearnerTextV1(line, locale)),
    answer: localizeSriLearnerTextV1(source.explanation.answer, locale),
  };
  return deepFreeze({
    ...source,
    stem: localizeSriLearnerTextV1(source.stem, locale),
    answer,
    options,
    explanation,
  });
}

export function generateSriPermanentLocalizedQuestionV1(
  qlId: SriPermanentQlId,
  externalSeed: string,
  locale: SriLocalizedLocaleV1,
): SriPermanentLocalizedQuestionV1 {
  const english = generateSriPermanentEnglishQuestionV1(qlId, externalSeed);
  const question = localizeSriDiscoveryQuestionV1(english.question, locale);
  return deepFreeze({
    packageId: english.packageId,
    checkpointId: english.checkpointId,
    permanentQlId: english.permanentQlId,
    permanentSolveModeId: english.permanentSolveModeId,
    retainedGroupId: english.retainedGroupId,
    englishQlTitle: english.qlTitle,
    locale,
    language: LANGUAGE_BY_LOCALE[locale],
    externalSeed,
    sourceCandidateId: english.sourceCandidateId,
    sourceCheckpointId: english.sourceCheckpointId,
    sourceSeed: english.sourceSeed,
    englishFingerprint: english.englishFingerprint,
    question,
    lifecycle: {
      maturity: "PERMANENT_AUTHORITY" as const,
      reviewStatus: "LOCALIZATION_REVIEW_READY" as const,
      localizationStatus: "REVIEW_READY" as const,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      active: false as const,
      questionStudioDiscoverable: false as const,
      questionStudioGenerationEnabled: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      publiclyPublishable: false as const,
    },
  });
}

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) {
    deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  }
  return Object.freeze(value);
}
