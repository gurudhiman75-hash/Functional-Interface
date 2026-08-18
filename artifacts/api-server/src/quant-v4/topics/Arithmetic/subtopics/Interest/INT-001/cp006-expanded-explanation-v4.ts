import type { Rational } from "./cp003-exam-model";
import type { IntCp006QlId, IntCp006State } from "./cp006-si-ci-relations-runtime-v4-final";
import {
  buildIntCp006ExpandedExplanation as buildV3,
  type IntCp006ExplanationLocale,
} from "./cp006-expanded-explanation-v3";

export const INT_CP006_EXPANDED_EXPLANATION_VERSION = "INT-CP-006-EXPL-v4-review" as const;
export type { IntCp006ExplanationLocale };

function nativeKeyIdea(
  qlId: IntCp006QlId,
  locale: Exclude<IntCp006ExplanationLocale, "en-IN">,
  fallback: string,
): string {
  if (qlId === "INT-QL-097") {
    return locale === "hi-IN"
      ? "3 वर्षों का CI−SI अंतर निकालने के लिए पहले 2 वर्षों का अंतर निकालेंगे। फिर तीसरे वर्ष में चक्रवृद्धि के कारण जुड़ने वाले अतिरिक्त हिस्से को शामिल करेंगे।"
      : "3 ਸਾਲਾਂ ਦਾ CI−SI ਅੰਤਰ ਕੱਢਣ ਲਈ ਪਹਿਲਾਂ 2 ਸਾਲਾਂ ਦਾ ਅੰਤਰ ਕੱਢਾਂਗੇ। ਫਿਰ ਤੀਜੇ ਸਾਲ ਚੱਕਰਵੱਧੀ ਕਾਰਨ ਜੁੜਨ ਵਾਲੇ ਵਾਧੂ ਹਿੱਸੇ ਨੂੰ ਵੀ ਸ਼ਾਮਲ ਕਰਾਂਗੇ।";
  }
  if (qlId === "INT-QL-102") {
    return locale === "hi-IN"
      ? "एक ही मूलधन और दर के लिए 2 वर्षों और 3 वर्षों के CI−SI अंतर आपस में एक निश्चित संबंध से जुड़े होते हैं।"
      : "ਇੱਕੋ ਮੂਲਧਨ ਅਤੇ ਦਰ ਲਈ 2 ਸਾਲਾਂ ਅਤੇ 3 ਸਾਲਾਂ ਦੇ CI−SI ਅੰਤਰ ਆਪਸ ਵਿੱਚ ਇੱਕ ਨਿਸ਼ਚਿਤ ਸੰਬੰਧ ਨਾਲ ਜੁੜੇ ਹੁੰਦੇ ਹਨ।";
  }
  if (qlId === "INT-QL-106") {
    return locale === "hi-IN"
      ? "पहले लगातार दो वर्षों के ब्याज में हुई वृद्धि से वार्षिक दर निकालेंगे। फिर दिए गए वर्ष के ब्याज से उलटी गणना करके मूलधन निकालेंगे।"
      : "ਪਹਿਲਾਂ ਲਗਾਤਾਰ ਦੋ ਸਾਲਾਂ ਦੇ ਵਿਆਜ ਵਿੱਚ ਹੋਏ ਵਾਧੇ ਤੋਂ ਸਾਲਾਨਾ ਦਰ ਕੱਢਾਂਗੇ। ਫਿਰ ਦਿੱਤੇ ਸਾਲ ਦੇ ਵਿਆਜ ਤੋਂ ਉਲਟੀ ਗਿਣਤੀ ਕਰਕੇ ਮੂਲਧਨ ਕੱਢਾਂਗੇ।";
  }
  if (qlId === "INT-QL-108") {
    return locale === "hi-IN"
      ? "दूसरे वर्ष में ब्याज जितना बढ़ता है, वह पहले वर्ष के ब्याज का r% होता है। इसी संबंध से पहले वर्ष का ब्याज निकालेंगे।"
      : "ਦੂਜੇ ਸਾਲ ਵਿੱਚ ਵਿਆਜ ਜਿੰਨਾ ਵਧਦਾ ਹੈ, ਉਹ ਪਹਿਲੇ ਸਾਲ ਦੇ ਵਿਆਜ ਦਾ r% ਹੁੰਦਾ ਹੈ। ਇਸੇ ਸੰਬੰਧ ਨਾਲ ਪਹਿਲੇ ਸਾਲ ਦਾ ਵਿਆਜ ਕੱਢਾਂਗੇ।";
  }
  return fallback;
}

function nativeSteps(
  qlId: IntCp006QlId,
  state: IntCp006State,
  answer: Rational,
  locale: Exclude<IntCp006ExplanationLocale, "en-IN">,
  base: readonly string[],
): readonly string[] {
  const steps = [...base];

  if (qlId === "INT-QL-107" && state.qlId === "INT-QL-107") {
    const year = Number(answer.numerator / answer.denominator);
    const previousYear = year - 1;
    const previousDifference = base[2]?.match(/CI−SI = ([^।]+)[।]?$/u)?.[1];
    const currentDifference = base[4]?.match(/CI−SI = ([^।]+)[।]?$/u)?.[1];
    const previousSiCi = base[1]?.replace(/^पहले \d+ वर्ष जाँचें: /u, "").replace(/^ਪਹਿਲਾਂ \d+ ਸਾਲ ਜਾਂਚੋ: /u, "") ?? "";
    const currentSiCi = base[3]?.replace(/^अब \d+ वर्ष जाँचें: /u, "").replace(/^ਹੁਣ \d+ ਸਾਲ ਜਾਂਚੋ: /u, "") ?? "";

    if (locale === "hi-IN") {
      steps[1] = `${previousYear} वर्षों के लिए पहले जाँच करें: ${previousSiCi}`;
      steps[2] = `${previousDifference ?? "यह अंतर"} लक्ष्य से कम है। इसलिए ${previousYear} वर्षों तक लक्ष्य पूरा नहीं हुआ।`;
      steps[3] = `अब ${year} वर्षों के लिए जाँच करें: ${currentSiCi}`;
      steps[4] = `${currentDifference ?? "यह अंतर"} लक्ष्य के बराबर या उससे अधिक है। इसलिए ${year} वर्षों में लक्ष्य पूरा हो जाता है।`;
      steps[5] = `चूँकि ${previousYear} वर्षों में लक्ष्य पूरा नहीं हुआ था, इसलिए सही उत्तर ${year} वर्ष है।`;
    } else {
      steps[1] = `ਪਹਿਲਾਂ ${previousYear} ਸਾਲਾਂ ਲਈ ਜਾਂਚ ਕਰੋ: ${previousSiCi}`;
      steps[2] = `${previousDifference ?? "ਇਹ ਅੰਤਰ"} ਟੀਚੇ ਤੋਂ ਘੱਟ ਹੈ। ਇਸ ਲਈ ${previousYear} ਸਾਲਾਂ ਤੱਕ ਟੀਚਾ ਪੂਰਾ ਨਹੀਂ ਹੋਇਆ।`;
      steps[3] = `ਹੁਣ ${year} ਸਾਲਾਂ ਲਈ ਜਾਂਚ ਕਰੋ: ${currentSiCi}`;
      steps[4] = `${currentDifference ?? "ਇਹ ਅੰਤਰ"} ਟੀਚੇ ਦੇ ਬਰਾਬਰ ਜਾਂ ਉਸ ਤੋਂ ਵੱਧ ਹੈ। ਇਸ ਲਈ ${year} ਸਾਲਾਂ ਵਿੱਚ ਟੀਚਾ ਪੂਰਾ ਹੋ ਜਾਂਦਾ ਹੈ।`;
      steps[5] = `ਕਿਉਂਕਿ ${previousYear} ਸਾਲਾਂ ਵਿੱਚ ਟੀਚਾ ਪੂਰਾ ਨਹੀਂ ਹੋਇਆ ਸੀ, ਇਸ ਲਈ ਸਹੀ ਜਵਾਬ ${year} ਸਾਲ ਹੈ।`;
    }
  }

  return Object.freeze(steps);
}

export function buildIntCp006ExpandedExplanation(
  qlId: IntCp006QlId,
  state: IntCp006State,
  answer: Rational,
  locale: IntCp006ExplanationLocale,
): Readonly<{ keyIdea: string; steps: readonly string[] }> {
  const base = buildV3(qlId, state, answer, locale);
  if (locale === "en-IN") return base;
  return Object.freeze({
    keyIdea: nativeKeyIdea(qlId, locale, base.keyIdea),
    steps: nativeSteps(qlId, state, answer, locale, base.steps),
  });
}

export function polishIntCp006NativeCommonMistake(
  qlId: IntCp006QlId,
  text: string,
  locale: "hi-IN" | "pa-IN",
): string {
  if (qlId === "INT-QL-097") {
    return locale === "hi-IN"
      ? "केवल 3D₂ लेने पर तीसरे वर्ष में चक्रवृद्धि से जुड़ने वाला अतिरिक्त हिस्सा छूट जाएगा।"
      : "ਕੇਵਲ 3D₂ ਲੈਣ ਨਾਲ ਤੀਜੇ ਸਾਲ ਚੱਕਰਵੱਧੀ ਕਾਰਨ ਜੁੜਨ ਵਾਲਾ ਵਾਧੂ ਹਿੱਸਾ ਰਹਿ ਜਾਵੇਗਾ।";
  }
  if (qlId === "INT-QL-102") {
    return locale === "hi-IN"
      ? "D₃ को केवल 3D₂ न मानें। दर के कारण इसमें एक अतिरिक्त चक्रवृद्धि हिस्सा भी जुड़ता है।"
      : "D₃ ਨੂੰ ਸਿਰਫ਼ 3D₂ ਨਾ ਮੰਨੋ। ਦਰ ਕਰਕੇ ਇਸ ਵਿੱਚ ਇੱਕ ਵਾਧੂ ਚੱਕਰਵੱਧੀ ਹਿੱਸਾ ਵੀ ਜੁੜਦਾ ਹੈ।";
  }
  if (qlId === "INT-QL-107") {
    return locale === "hi-IN"
      ? "लक्ष्य पूरा होने के बाद का कोई वर्ष न चुनें। प्रश्न वह पहला पूरा वर्ष पूछता है जिसमें लक्ष्य पूरा होता है।"
      : "ਟੀਚਾ ਪੂਰਾ ਹੋਣ ਤੋਂ ਬਾਅਦ ਦਾ ਕੋਈ ਸਾਲ ਨਾ ਚੁਣੋ। ਸਵਾਲ ਉਹ ਪਹਿਲਾ ਪੂਰਾ ਸਾਲ ਪੁੱਛਦਾ ਹੈ ਜਿਸ ਵਿੱਚ ਟੀਚਾ ਪੂਰਾ ਹੁੰਦਾ ਹੈ।";
  }
  if (qlId === "INT-QL-108") {
    return locale === "hi-IN"
      ? "अंतर को दोनों वर्षों में न बाँटें। यह पहले वर्ष के ब्याज पर मिलने वाला अतिरिक्त ब्याज है।"
      : "ਅੰਤਰ ਨੂੰ ਦੋਵੇਂ ਸਾਲਾਂ ਵਿੱਚ ਨਾ ਵੰਡੋ। ਇਹ ਪਹਿਲੇ ਸਾਲ ਦੇ ਵਿਆਜ ਉੱਤੇ ਮਿਲਣ ਵਾਲਾ ਵਾਧੂ ਵਿਆਜ ਹੈ।";
  }
  return text;
}
