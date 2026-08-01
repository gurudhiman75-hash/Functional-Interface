import type {
  ClsCp003LocalizedLocale,
  ClsCp003LocalizedQlId,
} from "./cp003-localized-contracts";
import type { ClsCp003LocalizedRuleId } from "./cp003-localized-runtime";
import {
  generateClsCp003LocalizedQuestionV2,
  independentlyVerifyClsCp003LocalizedQuestionV2,
} from "./cp003-localized-runtime-v2";
import { CLS_CP003_LOCALIZED_JUMBLE_WORDS } from "./word-dataset.localized";

const CLASS_LABELS: Readonly<Record<ClsCp003LocalizedLocale, Readonly<Record<string, string>>>> = {
  "hi-IN": {
    FRUIT: "फल",
    VEGETABLE: "सब्जी",
    ANIMAL: "जानवर",
    BIRD: "पक्षी",
    COLOUR: "रंग",
    TOOL: "औजार",
    PROFESSION: "पेशा",
  },
  "pa-IN": {
    FRUIT: "ਫਲ",
    VEGETABLE: "ਸਬਜ਼ੀ",
    ANIMAL: "ਜਾਨਵਰ",
    BIRD: "ਪੰਛੀ",
    COLOUR: "ਰੰਗ",
    TOOL: "ਔਜ਼ਾਰ",
    PROFESSION: "ਪੇਸ਼ਾ",
  },
};

const CLASS_BY_WORD: Readonly<Record<ClsCp003LocalizedLocale, ReadonlyMap<string, string>>> = {
  "hi-IN": new Map(
    CLS_CP003_LOCALIZED_JUMBLE_WORDS["hi-IN"].map((entry) => [entry.canonicalWord, entry.semanticClass]),
  ),
  "pa-IN": new Map(
    CLS_CP003_LOCALIZED_JUMBLE_WORDS["pa-IN"].map((entry) => [entry.canonicalWord, entry.semanticClass]),
  ),
};

function hashText(text: string): number {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function choose(values: readonly string[], seed: number, salt: string): string {
  return values[hashText(`${salt}:${seed}`) % values.length]!;
}

function naturalStem(
  locale: ClsCp003LocalizedLocale,
  ruleId: ClsCp003LocalizedRuleId,
  seed: number,
): string {
  if (locale === "hi-IN") {
    const stems: Record<ClsCp003LocalizedRuleId, readonly string[]> = {
      LETTER_UNIT_COUNT: [
        "किस शब्द में अक्षरों की संख्या अलग है?",
        "अलग अक्षर-संख्या वाला शब्द चुनिए।",
        "कौन-सा शब्द बाकी शब्दों जितने अक्षरों का नहीं है?",
        "अक्षर गिनकर अलग शब्द पहचानिए।",
      ],
      VOWEL_MARK_COUNT: [
        "किस शब्द में मात्राओं की संख्या अलग है?",
        "मात्राएँ गिनकर अलग शब्द चुनिए।",
        "कौन-सा शब्द बाकी शब्दों के समान मात्रा-संख्या नहीं रखता?",
        "मात्राओं की अलग संख्या वाला शब्द पहचानिए।",
      ],
      REPEATED_UNIT_TOPOLOGY: [
        "किस शब्द में अक्षरों का दोहराव अलग है?",
        "जिस शब्द में अक्षर अलग ढंग से दोहरते हैं, उसे चुनिए।",
        "कौन-से शब्द में अक्षरों के दोहरने का ढंग बाकी से अलग है?",
        "दोहरते अक्षर देखकर अलग शब्द पहचानिए।",
      ],
      PALINDROME_STATUS: [
        "उलटे क्रम में पढ़ने पर कौन-सा शब्द अलग है?",
        "शब्दों को आगे और पीछे से पढ़िए। अलग शब्द चुनिए।",
        "कौन-सा शब्द बाकी शब्दों की तरह दोनों ओर से समान नहीं पढ़ा जाता?",
        "आगे-पीछे पढ़कर अलग शब्द पहचानिए।",
      ],
      BOUNDARY_MARK_PATTERN: [
        "पहले और अंतिम अक्षर पर लगी मात्राएँ देखकर अलग शब्द चुनिए।",
        "किस शब्द के पहले और अंतिम अक्षर की मात्राओं का ढंग अलग है?",
        "हर शब्द का पहला और अंतिम अक्षर जाँचिए। कौन-सा शब्द अलग है?",
        "दोनों सिरों पर लगी मात्राएँ देखकर अलग शब्द पहचानिए।",
      ],
      NATIVE_AFFIX_FAMILY: [
        "किस शब्द का आरंभ या अंत बाकी शब्दों से अलग है?",
        "साझा उपसर्ग या प्रत्यय न रखने वाला शब्द चुनिए।",
        "कौन-सा शब्द समान आरंभ या अंत वाले समूह में नहीं आता?",
        "शब्दों के जुड़े हुए आरंभ या अंत को देखकर अलग शब्द पहचानिए।",
      ],
      RESOLVED_SEMANTIC_CLASS: [
        "हर विकल्प के अक्षर सही क्रम में लगाइए। अलग समूह का शब्द चुनिए।",
        "उलझे अक्षरों से सही शब्द बनाइए और अलग वर्ग वाला शब्द पहचानिए।",
        "हर अक्षर-समूह को सुलझाइए। बने हुए शब्दों में कौन-सा अलग है?",
        "शब्दों को सही बनाकर वह शब्द चुनिए जो बाकी समूह में नहीं आता।",
      ],
    };
    return choose(stems[ruleId], seed, `${locale}:${ruleId}:natural-stem-v3`);
  }

  const stems: Record<ClsCp003LocalizedRuleId, readonly string[]> = {
    LETTER_UNIT_COUNT: [
      "ਕਿਹੜੇ ਸ਼ਬਦ ਵਿੱਚ ਅੱਖਰਾਂ ਦੀ ਗਿਣਤੀ ਵੱਖਰੀ ਹੈ?",
      "ਵੱਖਰੀ ਅੱਖਰ-ਗਿਣਤੀ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ।",
      "ਕਿਹੜਾ ਸ਼ਬਦ ਬਾਕੀ ਸ਼ਬਦਾਂ ਜਿੰਨੇ ਅੱਖਰਾਂ ਦਾ ਨਹੀਂ ਹੈ?",
      "ਅੱਖਰ ਗਿਣ ਕੇ ਵੱਖਰਾ ਸ਼ਬਦ ਪਛਾਣੋ।",
    ],
    VOWEL_MARK_COUNT: [
      "ਕਿਹੜੇ ਸ਼ਬਦ ਵਿੱਚ ਲਗਾਂ ਦੀ ਗਿਣਤੀ ਵੱਖਰੀ ਹੈ?",
      "ਲਗਾਂ ਗਿਣ ਕੇ ਵੱਖਰਾ ਸ਼ਬਦ ਚੁਣੋ।",
      "ਕਿਹੜੇ ਸ਼ਬਦ ਦੀ ਲਗ-ਗਿਣਤੀ ਬਾਕੀ ਸ਼ਬਦਾਂ ਵਰਗੀ ਨਹੀਂ ਹੈ?",
      "ਲਗਾਂ ਦੀ ਵੱਖਰੀ ਗਿਣਤੀ ਵਾਲਾ ਸ਼ਬਦ ਪਛਾਣੋ।",
    ],
    REPEATED_UNIT_TOPOLOGY: [
      "ਕਿਹੜੇ ਸ਼ਬਦ ਵਿੱਚ ਅੱਖਰਾਂ ਦਾ ਦੁਹਰਾਅ ਵੱਖਰਾ ਹੈ?",
      "ਜਿਸ ਸ਼ਬਦ ਵਿੱਚ ਅੱਖਰ ਵੱਖਰੇ ਢੰਗ ਨਾਲ ਦੁਹਰਾਉਂਦੇ ਹਨ, ਉਹ ਚੁਣੋ।",
      "ਕਿਹੜੇ ਸ਼ਬਦ ਵਿੱਚ ਅੱਖਰਾਂ ਦੇ ਦੁਹਰਾਉਣ ਦਾ ਢੰਗ ਬਾਕੀਆਂ ਤੋਂ ਵੱਖਰਾ ਹੈ?",
      "ਦੁਹਰਾਉਂਦੇ ਅੱਖਰ ਵੇਖ ਕੇ ਵੱਖਰਾ ਸ਼ਬਦ ਪਛਾਣੋ।",
    ],
    PALINDROME_STATUS: [
      "ਉਲਟ ਕ੍ਰਮ ਵਿੱਚ ਪੜ੍ਹਨ ਤੇ ਕਿਹੜਾ ਸ਼ਬਦ ਵੱਖਰਾ ਹੈ?",
      "ਸ਼ਬਦਾਂ ਨੂੰ ਅੱਗੇ ਅਤੇ ਪਿੱਛੇ ਤੋਂ ਪੜ੍ਹੋ। ਵੱਖਰਾ ਸ਼ਬਦ ਚੁਣੋ।",
      "ਕਿਹੜਾ ਸ਼ਬਦ ਬਾਕੀ ਸ਼ਬਦਾਂ ਵਾਂਗ ਦੋਵੇਂ ਪਾਸਿਆਂ ਤੋਂ ਇੱਕੋ ਜਿਹਾ ਨਹੀਂ ਪੜ੍ਹਿਆ ਜਾਂਦਾ?",
      "ਅੱਗੇ-ਪਿੱਛੇ ਪੜ੍ਹ ਕੇ ਵੱਖਰਾ ਸ਼ਬਦ ਪਛਾਣੋ।",
    ],
    BOUNDARY_MARK_PATTERN: [
      "ਪਹਿਲੇ ਅਤੇ ਆਖ਼ਰੀ ਅੱਖਰ ਦੀਆਂ ਲਗਾਂ ਵੇਖ ਕੇ ਵੱਖਰਾ ਸ਼ਬਦ ਚੁਣੋ।",
      "ਕਿਹੜੇ ਸ਼ਬਦ ਦੇ ਪਹਿਲੇ ਅਤੇ ਆਖ਼ਰੀ ਅੱਖਰ ਦੀਆਂ ਲਗਾਂ ਦਾ ਢੰਗ ਵੱਖਰਾ ਹੈ?",
      "ਹਰ ਸ਼ਬਦ ਦਾ ਪਹਿਲਾ ਅਤੇ ਆਖ਼ਰੀ ਅੱਖਰ ਜਾਂਚੋ। ਕਿਹੜਾ ਸ਼ਬਦ ਵੱਖਰਾ ਹੈ?",
      "ਦੋਵੇਂ ਸਿਰਿਆਂ ਦੀਆਂ ਲਗਾਂ ਵੇਖ ਕੇ ਵੱਖਰਾ ਸ਼ਬਦ ਪਛਾਣੋ।",
    ],
    NATIVE_AFFIX_FAMILY: [
      "ਕਿਹੜੇ ਸ਼ਬਦ ਦਾ ਸ਼ੁਰੂ ਜਾਂ ਅੰਤ ਬਾਕੀਆਂ ਤੋਂ ਵੱਖਰਾ ਹੈ?",
      "ਸਾਂਝਾ ਅਗਲਾ ਜਾਂ ਪਿਛਲਾ ਹਿੱਸਾ ਨਾ ਰੱਖਣ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ।",
      "ਕਿਹੜਾ ਸ਼ਬਦ ਇੱਕੋ ਸ਼ੁਰੂ ਜਾਂ ਅੰਤ ਵਾਲੇ ਸਮੂਹ ਵਿੱਚ ਨਹੀਂ ਆਉਂਦਾ?",
      "ਸ਼ਬਦਾਂ ਦੇ ਜੁੜੇ ਹੋਏ ਸ਼ੁਰੂ ਜਾਂ ਅੰਤ ਨੂੰ ਵੇਖ ਕੇ ਵੱਖਰਾ ਸ਼ਬਦ ਪਛਾਣੋ।",
    ],
    RESOLVED_SEMANTIC_CLASS: [
      "ਹਰ ਵਿਕਲਪ ਦੇ ਅੱਖਰ ਸਹੀ ਕ੍ਰਮ ਵਿੱਚ ਲਗਾਓ। ਵੱਖਰੇ ਸਮੂਹ ਦਾ ਸ਼ਬਦ ਚੁਣੋ।",
      "ਉਲਝੇ ਅੱਖਰਾਂ ਤੋਂ ਸਹੀ ਸ਼ਬਦ ਬਣਾਓ ਅਤੇ ਵੱਖਰੇ ਵਰਗ ਵਾਲਾ ਸ਼ਬਦ ਪਛਾਣੋ।",
      "ਹਰ ਅੱਖਰ-ਸਮੂਹ ਨੂੰ ਸੁਲਝਾਓ। ਬਣੇ ਸ਼ਬਦਾਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਵੱਖਰਾ ਹੈ?",
      "ਸ਼ਬਦ ਠੀਕ ਬਣਾ ਕੇ ਉਹ ਸ਼ਬਦ ਚੁਣੋ ਜੋ ਬਾਕੀ ਸਮੂਹ ਵਿੱਚ ਨਹੀਂ ਆਉਂਦਾ।",
    ],
  };
  return choose(stems[ruleId], seed, `${locale}:${ruleId}:natural-stem-v3`);
}

function naturalCoreConcept(
  locale: ClsCp003LocalizedLocale,
  ruleId: ClsCp003LocalizedRuleId,
): string {
  if (locale === "hi-IN") {
    const concepts: Record<ClsCp003LocalizedRuleId, string> = {
      LETTER_UNIT_COUNT: "हर शब्द के लिखे हुए अक्षर गिनिए। अधिकतर शब्दों की गिनती समान होगी।",
      VOWEL_MARK_COUNT: "हर शब्द में लिखी हुई मात्राएँ गिनिए। जिस स्वर की अलग मात्रा नहीं लिखी गई है, उसे मत गिनिए।",
      REPEATED_UNIT_TOPOLOGY: "देखिए कि कौन-से अक्षर दोहरते हैं और हर शब्द में उनका दोहराव किस तरह है।",
      PALINDROME_STATUS: "हर शब्द के अक्षरों का क्रम उलटकर जाँचिए कि शब्द वही रहता है या बदल जाता है।",
      BOUNDARY_MARK_PATTERN: "केवल पहले और अंतिम अक्षर को देखें और जाँचें कि उन पर मात्रा लगी है या नहीं।",
      NATIVE_AFFIX_FAMILY: "शब्दों के आरंभ या अंत में जुड़ा समान हिस्सा खोजिए।",
      RESOLVED_SEMANTIC_CLASS: "हर उलझे विकल्प के अक्षर बदले बिना सही शब्द बनाइए, फिर बने शब्दों का साझा वर्ग पहचानिए।",
    };
    return concepts[ruleId];
  }

  const concepts: Record<ClsCp003LocalizedRuleId, string> = {
    LETTER_UNIT_COUNT: "ਹਰ ਸ਼ਬਦ ਦੇ ਲਿਖੇ ਅੱਖਰ ਗਿਣੋ। ਜ਼ਿਆਦਾਤਰ ਸ਼ਬਦਾਂ ਦੀ ਗਿਣਤੀ ਇੱਕੋ ਹੋਵੇਗੀ।",
    VOWEL_MARK_COUNT: "ਹਰ ਸ਼ਬਦ ਵਿੱਚ ਲਿਖੀਆਂ ਲਗਾਂ ਗਿਣੋ। ਜਿਸ ਸਵਰ ਦੀ ਲਗ ਨਹੀਂ ਲਿਖੀ, ਉਸ ਨੂੰ ਨਾ ਗਿਣੋ।",
    REPEATED_UNIT_TOPOLOGY: "ਵੇਖੋ ਕਿ ਕਿਹੜੇ ਅੱਖਰ ਦੁਹਰਾਉਂਦੇ ਹਨ ਅਤੇ ਹਰ ਸ਼ਬਦ ਵਿੱਚ ਉਨ੍ਹਾਂ ਦਾ ਦੁਹਰਾਅ ਕਿਵੇਂ ਹੈ।",
    PALINDROME_STATUS: "ਹਰ ਸ਼ਬਦ ਦੇ ਅੱਖਰਾਂ ਦਾ ਕ੍ਰਮ ਉਲਟ ਕੇ ਜਾਂਚੋ ਕਿ ਸ਼ਬਦ ਉਹੀ ਰਹਿੰਦਾ ਹੈ ਜਾਂ ਬਦਲ ਜਾਂਦਾ ਹੈ।",
    BOUNDARY_MARK_PATTERN: "ਕੇਵਲ ਪਹਿਲੇ ਅਤੇ ਆਖ਼ਰੀ ਅੱਖਰ ਨੂੰ ਵੇਖੋ ਅਤੇ ਜਾਂਚੋ ਕਿ ਉਨ੍ਹਾਂ ਨਾਲ ਲਗ ਹੈ ਜਾਂ ਨਹੀਂ।",
    NATIVE_AFFIX_FAMILY: "ਸ਼ਬਦਾਂ ਦੇ ਸ਼ੁਰੂ ਜਾਂ ਅੰਤ ਨਾਲ ਜੁੜਿਆ ਸਾਂਝਾ ਹਿੱਸਾ ਲੱਭੋ।",
    RESOLVED_SEMANTIC_CLASS: "ਹਰ ਉਲਝੇ ਵਿਕਲਪ ਦੇ ਅੱਖਰ ਬਦਲੇ ਬਿਨਾਂ ਸਹੀ ਸ਼ਬਦ ਬਣਾਓ, ਫਿਰ ਬਣੇ ਸ਼ਬਦਾਂ ਦਾ ਸਾਂਝਾ ਵਰਗ ਪਛਾਣੋ।",
  };
  return concepts[ruleId];
}

function naturalDirectConclusion(answer: string, locale: ClsCp003LocalizedLocale): string {
  return locale === "hi-IN"
    ? `बाकी विकल्पों में पूछी गई बनावट एक जैसी है; '${answer}' वाला विकल्प अलग है, इसलिए वही उत्तर है।`
    : `ਬਾਕੀ ਵਿਕਲਪਾਂ ਵਿੱਚ ਪੁੱਛੀ ਬਣਤਰ ਇੱਕੋ ਜਿਹੀ ਹੈ; '${answer}' ਵਾਲਾ ਵਿਕਲਪ ਵੱਖਰਾ ਹੈ, ਇਸ ਲਈ ਉਹੀ ਜਵਾਬ ਹੈ।`;
}

function normalizeHindiMatraText(text: string): string {
  return text
    .replaceAll("मात्रा-चिह्नों", "मात्राओं")
    .replaceAll("मात्रा-चिह्न", "मात्रा")
    .replaceAll("लिखित पैटर्न", "पूछी गई बनावट")
    .replaceAll("दोहराव-पैटर्न", "दोहराने का ढंग")
    .replaceAll("मात्रा-पैटर्न", "मात्राओं का ढंग")
    .replaceAll("उलटा-पठन पैटर्न", "उलटकर पढ़ने का ढंग")
    .replaceAll("पैटर्न", "ढंग");
}

function classForWord(word: string, locale: ClsCp003LocalizedLocale): string {
  const classId = CLASS_BY_WORD[locale].get(word);
  if (!classId) throw new Error(`Missing ${locale} semantic class for '${word}'`);
  return classId;
}

function naturalJumbleEvidence(
  displayed: string,
  canonical: string,
  locale: ClsCp003LocalizedLocale,
): string {
  const classId = classForWord(canonical, locale);
  const classLabel = CLASS_LABELS[locale][classId] ?? classId;
  return locale === "hi-IN"
    ? `'${displayed}' के अक्षर सही क्रम में लगाने पर '${canonical}' शब्द मिलता है। यह ${classLabel} वर्ग में आता है।`
    : `'${displayed}' ਦੇ ਅੱਖਰ ਸਹੀ ਕ੍ਰਮ ਵਿੱਚ ਲਗਾਉਣ ਤੇ '${canonical}' ਸ਼ਬਦ ਮਿਲਦਾ ਹੈ। ਇਹ ${classLabel} ਵਰਗ ਵਿੱਚ ਆਉਂਦਾ ਹੈ।`;
}

function naturalJumbleConclusion(
  answer: string,
  canonicalWords: readonly string[],
  correctIndex: number,
  locale: ClsCp003LocalizedLocale,
): string {
  const oddWord = canonicalWords[correctIndex]!;
  const oddClass = classForWord(oddWord, locale);
  const commonClass = canonicalWords
    .map((word) => classForWord(word, locale))
    .find((classId) => classId !== oddClass)!;
  const commonLabel = CLASS_LABELS[locale][commonClass] ?? commonClass;
  const oddLabel = CLASS_LABELS[locale][oddClass] ?? oddClass;
  return locale === "hi-IN"
    ? `अधिकतर बने हुए शब्द ${commonLabel} वर्ग में आते हैं, लेकिन '${oddWord}' शब्द ${oddLabel} वर्ग में आता है। इसलिए '${answer}' सही विकल्प है।`
    : `ਜ਼ਿਆਦਾਤਰ ਬਣੇ ਸ਼ਬਦ ${commonLabel} ਵਰਗ ਵਿੱਚ ਆਉਂਦੇ ਹਨ, ਪਰ '${oddWord}' ਸ਼ਬਦ ${oddLabel} ਵਰਗ ਵਿੱਚ ਆਉਂਦਾ ਹੈ। ਇਸ ਲਈ '${answer}' ਸਹੀ ਵਿਕਲਪ ਹੈ।`;
}

export function generateClsCp003LocalizedQuestionV3(
  qlId: ClsCp003LocalizedQlId,
  locale: ClsCp003LocalizedLocale,
  seed = 0,
  requestedOptionCount?: 4 | 5,
) {
  const source = generateClsCp003LocalizedQuestionV2(qlId, locale, seed, requestedOptionCount);
  const ruleId = source.intendedRuleId as ClsCp003LocalizedRuleId;
  const stem = naturalStem(locale, ruleId, seed);

  if (source.task === "RESOLVE_JUMBLES_AND_FIND_OUTLIER") {
    const evidenceByOption = source.options.map((displayed, index) =>
      naturalJumbleEvidence(displayed, source.canonicalWords[index]!, locale),
    );
    return {
      ...source,
      stem,
      evidenceByOption,
      explanation: {
        ...source.explanation,
        coreConcept: [naturalCoreConcept(locale, ruleId)],
        stepByStep: [
          ...evidenceByOption,
          naturalJumbleConclusion(source.answer, source.canonicalWords, source.correctIndex, locale),
        ],
      },
      metadata: {
        ...source.metadata,
        localizationVersion: "cls-cp003-hi-pa-localization-v3" as const,
        runtimeVersion: "cls-cp003-localized-runtime-v3" as const,
      },
    };
  }

  const evidenceByOption = locale === "hi-IN"
    ? source.evidenceByOption.map(normalizeHindiMatraText)
    : source.evidenceByOption;
  return {
    ...source,
    stem,
    evidenceByOption,
    explanation: {
      ...source.explanation,
      coreConcept: [naturalCoreConcept(locale, ruleId)],
      stepByStep: [
        ...evidenceByOption,
        naturalDirectConclusion(source.answer, locale),
      ],
      examSpeedShortcut: locale === "hi-IN"
        ? source.explanation.examSpeedShortcut.map(normalizeHindiMatraText)
        : source.explanation.examSpeedShortcut,
      commonTrapWarning: locale === "hi-IN"
        ? source.explanation.commonTrapWarning.map(normalizeHindiMatraText)
        : source.explanation.commonTrapWarning,
    },
    metadata: {
      ...source.metadata,
      localizationVersion: "cls-cp003-hi-pa-localization-v3" as const,
      runtimeVersion: "cls-cp003-localized-runtime-v3" as const,
    },
  };
}

export type GeneratedClsCp003LocalizedQuestionV3 = ReturnType<
  typeof generateClsCp003LocalizedQuestionV3
>;

export function independentlyVerifyClsCp003LocalizedQuestionV3(
  question: GeneratedClsCp003LocalizedQuestionV3,
) {
  return independentlyVerifyClsCp003LocalizedQuestionV2(
    question as unknown as Parameters<typeof independentlyVerifyClsCp003LocalizedQuestionV2>[0],
  );
}
