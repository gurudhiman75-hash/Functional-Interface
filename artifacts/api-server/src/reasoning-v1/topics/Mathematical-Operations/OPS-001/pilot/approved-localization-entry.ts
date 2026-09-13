import type { ApprovedOpsQuestion } from "./approved-teaching-entry";
import {
  localizeApprovedOpsQuestion as localizeBase,
  type ApprovedOpsLocale,
  type LocalizedApprovedOpsQuestion,
} from "./approved-localization";

export type { ApprovedOpsLocale, LocalizedApprovedOpsQuestion };

const GENERATED_MAPPING_GUIDANCE = new Set([
  "Use both stated meanings for every occurrence.",
  "Apply both meanings to the common expression.",
  "Keep the two token meanings separate.",
  "Use this one key for every option.",
  "Each complete word has one arithmetic meaning.",
  "Use the complete replacement key before checking any option.",
  "The answer must be a display token from this key.",
]);

const GENERATED_LABEL_PLACEHOLDERS: Readonly<Record<string, string>> = {
  "Apply the complete replacement": "Transform the whole expression",
  "Evaluate the transformed expression": "Transform the expression",
  "Read the meaning key": "Read the replacement key",
  "Transform the common left side": "Transform the common left-hand side",
  "Read the word-operator meaning key": "Read the replacement key",
  "Replace the word operators": "Replace every occurrence",
  "Evaluate after replacement": "Transform the expression",
  "Read the complete meaning key": "Write the complete meaning key",
  "Transform the common option expression": "Transform the common left-hand side",
  "Evaluate the arithmetic side": "Calculate multiplication/division first",
  "Convert the relation back to its token": "Convert back to the coded token",
  "Evaluate the left side": "Left side: Calculate multiplication/division first",
  "Evaluate the right side": "Right side: Calculate multiplication/division first",
  "Transform the complete expression": "Transform the whole expression",
  "Transform the original expression": "Transform the expression",
  "Write both interchange pairs": "Write all four replacement directions",
  "Transform and rebuild the equation": "Rebuild the equation",
  "Transform the common expression": "Transform the common left-hand side",
  "Transform and rebuild all numerals": "Rebuild the expression",
  "Transform and evaluate the target": "Transform the target expression",
  "Select the matching target equation": "Select the matching equation",
};

const GENERATED_RESULT_PLACEHOLDERS = new Set([
  "Both directions apply throughout the expression.",
  "Both pairs are applied simultaneously.",
  "All four operator identities change simultaneously.",
  "Use the same interchange in every option.",
  "Only the complete matching numbers change.",
  "Use this two-way change in every option.",
  "Every occurrence of both digits changes.",
  "The digit change is global.",
  "Use these replacements in every option.",
  "Both operators are interchanged simultaneously.",
  "Only complete number tokens are exchanged.",
]);

function placeholderLabel(label: string): string {
  if (label === "Read the value") return "Identify complete tokens";
  if (label.endsWith(": Read the value")) return label.replace(/Read the value$/u, "Identify complete tokens");
  return GENERATED_LABEL_PLACEHOLDERS[label] ?? label;
}

function isMeaningKey(source: string): boolean {
  const parts = source.split(", ");
  return parts.length >= 2 && parts.every((part) => /^.+ means .+$/u.test(part));
}

function placeholderText(source: string): string {
  if (/^Only .+ makes the equation true\.$/u.test(source)) return "The transformed equation is true.";
  if (source === "Only this pair produces a valid true equation without a leading zero.") return "The transformed equation is true.";
  if (source === "Only complete number tokens are exchanged; digits inside other numbers are unchanged.") return "Digits inside other numbers remain unchanged.";
  if (/^C must be > because .+$/u.test(source)) return "Use this one mapping for every option.";
  if (/^Using A = \+ and B = = gives .+$/u.test(source)) return "Use this one mapping for every option.";
  if (isMeaningKey(source)) return "Use this one mapping for every option.";
  if (GENERATED_MAPPING_GUIDANCE.has(source)) return "Use this one mapping for every option.";
  if (GENERATED_RESULT_PLACEHOLDERS.has(source)) return "Use this one mapping for every option.";
  if (/^.+; (true|false)\.$/u.test(source)) return "The transformed equation is true.";
  if (/^[ABCD] represents equality\.$/u.test(source)) return "The transformed equation is true.";
  if (/^Three double pairings and all six single pairs were tested\.$/u.test(source)) return "Exactly one choice makes the equation true.";
  if (/^Only .+ repairs the equation and no single pair does\.$/u.test(source)) return "Exactly one choice makes the equation true.";
  if (/^\d+ visible digit pairs were tested\.$/u.test(source)) return "Exactly one choice makes the equation true.";
  if (/^.+, so [MN] means [+−×÷]\.$/u.test(source)) return "Use this one mapping for every option.";
  if (/^[MN] means [+−×÷] because .+\.$/u.test(source)) return "Use this one mapping for every option.";
  return source;
}

function localizedValueLabel(label: string, locale: ApprovedOpsLocale): string {
  const base = locale === "hi-IN" ? "मान पढ़ें" : "ਮੁੱਲ ਪੜ੍ਹੋ";
  if (label === "Read the value") return base;
  if (label.startsWith("Left side:")) return locale === "hi-IN" ? `बायाँ पक्ष: ${base}` : `ਖੱਬਾ ਪਾਸਾ: ${base}`;
  if (label.startsWith("Right side:")) return locale === "hi-IN" ? `दायाँ पक्ष: ${base}` : `ਸੱਜਾ ਪਾਸਾ: ${base}`;
  return base;
}

function localizedGeneratedLabel(label: string, locale: ApprovedOpsLocale): string | null {
  const hi: Readonly<Record<string, string>> = {
    "Apply the complete replacement": "पूरा बदलाव लागू करें",
    "Evaluate the transformed expression": "बदले हुए व्यंजक का मान निकालें",
    "Read the meaning key": "अर्थ का नियम पढ़ें",
    "Transform the common left side": "समान बायाँ पक्ष बदलें",
    "Read the word-operator meaning key": "शब्द-क्रियाओं का अर्थ पढ़ें",
    "Replace the word operators": "शब्द-क्रियाएँ बदलें",
    "Evaluate after replacement": "बदलाव के बाद मान निकालें",
    "Read the complete meaning key": "पूरा अर्थ-नियम पढ़ें",
    "Transform the common option expression": "सभी विकल्पों वाला समान व्यंजक बदलें",
    "Evaluate the arithmetic side": "गणितीय पक्ष का मान निकालें",
    "Convert the relation back to its token": "संबंध को फिर सांकेतिक चिह्न में बदलें",
    "Evaluate the left side": "बाएँ पक्ष का मान निकालें",
    "Evaluate the right side": "दाएँ पक्ष का मान निकालें",
    "Transform the complete expression": "पूरा व्यंजक बदलें",
    "Transform the original expression": "मूल व्यंजक बदलें",
    "Write both interchange pairs": "दोनों बदलाव-युग्म लिखें",
    "Transform and rebuild the equation": "समीकरण बदलकर फिर बनाएँ",
    "Transform the common expression": "समान व्यंजक बदलें",
    "Transform and rebuild all numerals": "सभी प्रभावित संख्याएँ बदलकर फिर बनाएँ",
    "Transform and evaluate the target": "लक्ष्य बदलकर उसका मान निकालें",
    "Select the matching target equation": "मिलता हुआ लक्ष्य समीकरण चुनें",
  };
  const pa: Readonly<Record<string, string>> = {
    "Apply the complete replacement": "ਪੂਰਾ ਬਦਲਾਅ ਲਾਗੂ ਕਰੋ",
    "Evaluate the transformed expression": "ਬਦਲੇ ਹਿਸਾਬ ਦਾ ਮੁੱਲ ਕੱਢੋ",
    "Read the meaning key": "ਅਰਥ ਦਾ ਨਿਯਮ ਪੜ੍ਹੋ",
    "Transform the common left side": "ਸਾਂਝਾ ਖੱਬਾ ਪਾਸਾ ਬਦਲੋ",
    "Read the word-operator meaning key": "ਸ਼ਬਦ-ਕਿਰਿਆਵਾਂ ਦਾ ਅਰਥ ਪੜ੍ਹੋ",
    "Replace the word operators": "ਸ਼ਬਦ-ਕਿਰਿਆਵਾਂ ਬਦਲੋ",
    "Evaluate after replacement": "ਬਦਲਾਅ ਤੋਂ ਬਾਅਦ ਮੁੱਲ ਕੱਢੋ",
    "Read the complete meaning key": "ਪੂਰਾ ਅਰਥ-ਨਿਯਮ ਪੜ੍ਹੋ",
    "Transform the common option expression": "ਸਾਰੇ ਵਿਕਲਪਾਂ ਵਾਲਾ ਸਾਂਝਾ ਹਿਸਾਬ ਬਦਲੋ",
    "Evaluate the arithmetic side": "ਗਣਿਤੀ ਪਾਸੇ ਦਾ ਮੁੱਲ ਕੱਢੋ",
    "Convert the relation back to its token": "ਸੰਬੰਧ ਨੂੰ ਮੁੜ ਸੰਕੇਤੀ ਚਿੰਨ੍ਹ ਵਿੱਚ ਬਦਲੋ",
    "Evaluate the left side": "ਖੱਬੇ ਪਾਸੇ ਦਾ ਮੁੱਲ ਕੱਢੋ",
    "Evaluate the right side": "ਸੱਜੇ ਪਾਸੇ ਦਾ ਮੁੱਲ ਕੱਢੋ",
    "Transform the complete expression": "ਪੂਰਾ ਹਿਸਾਬ ਬਦਲੋ",
    "Transform the original expression": "ਮੂਲ ਹਿਸਾਬ ਬਦਲੋ",
    "Write both interchange pairs": "ਦੋਵੇਂ ਬਦਲਾਅ-ਜੋੜੇ ਲਿਖੋ",
    "Transform and rebuild the equation": "ਸਮੀਕਰਨ ਬਦਲ ਕੇ ਮੁੜ ਬਣਾਓ",
    "Transform the common expression": "ਸਾਂਝਾ ਹਿਸਾਬ ਬਦਲੋ",
    "Transform and rebuild all numerals": "ਸਾਰੀਆਂ ਪ੍ਰਭਾਵਿਤ ਸੰਖਿਆਵਾਂ ਬਦਲ ਕੇ ਮੁੜ ਬਣਾਓ",
    "Transform and evaluate the target": "ਲਕਸ਼ ਬਦਲ ਕੇ ਮੁੱਲ ਕੱਢੋ",
    "Select the matching target equation": "ਮਿਲਦਾ ਲਕਸ਼ ਸਮੀਕਰਨ ਚੁਣੋ",
  };
  return (locale === "hi-IN" ? hi : pa)[label] ?? null;
}

function localizedMeaningKey(source: string, locale: ApprovedOpsLocale): string | null {
  if (!isMeaningKey(source)) return null;
  const parts = source.split(", ").map((part) => {
    const match = part.match(/^(.+) means (.+)$/u)!;
    return locale === "hi-IN"
      ? `${match[1]} का अर्थ ${match[2]} है`
      : `${match[1]} ਦਾ ਅਰਥ ${match[2]} ਹੈ`;
  });
  return locale === "hi-IN" ? parts.join(" और ") : parts.join(" ਅਤੇ ");
}

function restoreText(original: string, translated: string, locale: ApprovedOpsLocale): string {
  const unique = original.match(/^Only (.+) makes the equation true\.$/u);
  if (unique) {
    if (unique[1] === "this pair") return locale === "hi-IN"
      ? "केवल यही युग्म समीकरण को सही बनाता है।"
      : "ਕੇਵਲ ਇਹੀ ਜੋੜਾ ਸਮੀਕਰਨ ਨੂੰ ਸਹੀ ਬਣਾਉਂਦਾ ਹੈ।";
    return locale === "hi-IN"
      ? `केवल ${unique[1]} समीकरण को सही बनाता है।`
      : `ਕੇਵਲ ${unique[1]} ਸਮੀਕਰਨ ਨੂੰ ਸਹੀ ਬਣਾਉਂਦਾ ਹੈ।`;
  }
  if (original === "Only this pair produces a valid true equation without a leading zero.") return locale === "hi-IN"
    ? "केवल यही अंक-युग्म बिना आरंभिक शून्य बनाए सही समीकरण देता है।"
    : "ਕੇਵਲ ਇਹੀ ਅੰਕ-ਜੋੜਾ ਸ਼ੁਰੂਆਤੀ ਸਿਫ਼ਰ ਬਣਾਏ ਬਿਨਾਂ ਸਹੀ ਸਮੀਕਰਨ ਦਿੰਦਾ ਹੈ।";
  if (original === "Only complete number tokens are exchanged; digits inside other numbers are unchanged.") return locale === "hi-IN"
    ? "केवल पूरी संख्याएँ आपस में बदली जाती हैं; दूसरी संख्याओं के भीतर के अंक नहीं बदलते।"
    : "ਕੇਵਲ ਪੂਰੀਆਂ ਸੰਖਿਆਵਾਂ ਆਪਸ ਵਿੱਚ ਬਦਲੀਆਂ ਜਾਂਦੀਆਂ ਹਨ; ਹੋਰ ਸੰਖਿਆਵਾਂ ਦੇ ਅੰਦਰਲੇ ਅੰਕ ਨਹੀਂ ਬਦਲਦੇ।";
  if (/^C must be > because .+$/u.test(original)) return locale === "hi-IN"
    ? "C का अर्थ > होना चाहिए, क्योंकि 7 > 4 सही है; = रखने पर कथन गलत होगा और + कोई तुलना-कथन नहीं बनाएगा।"
    : "C ਦਾ ਅਰਥ > ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ, ਕਿਉਂਕਿ 7 > 4 ਸਹੀ ਹੈ; = ਰੱਖਣ ਉੱਤੇ ਕਥਨ ਗਲਤ ਹੋਵੇਗਾ ਅਤੇ + ਕੋਈ ਤੁਲਨਾ-ਕਥਨ ਨਹੀਂ ਬਣਾਏਗਾ।";
  const mixed = original.match(/^Using A = \+ and B = = gives (.+), which is true; reversing them gives (.+), which is false\.$/u);
  if (mixed) return locale === "hi-IN"
    ? `A = + और B = = रखने पर ${mixed[1]} मिलता है, जो सही है; अर्थ उलटने पर ${mixed[2]} मिलता है, जो गलत है।`
    : `A = + ਅਤੇ B = = ਰੱਖਣ ਉੱਤੇ ${mixed[1]} ਮਿਲਦਾ ਹੈ, ਜੋ ਸਹੀ ਹੈ; ਅਰਥ ਉਲਟਣ ਉੱਤੇ ${mixed[2]} ਮਿਲਦਾ ਹੈ, ਜੋ ਗਲਤ ਹੈ।`;

  const meaningKey = localizedMeaningKey(original, locale);
  if (meaningKey) return meaningKey;

  if (original === "Use both stated meanings for every occurrence.") return locale === "hi-IN" ? "हर जगह दिए गए दोनों अर्थ लागू करें।" : "ਹਰ ਥਾਂ ਦਿੱਤੇ ਦੋਵੇਂ ਅਰਥ ਲਾਗੂ ਕਰੋ।";
  if (original === "Apply both meanings to the common expression.") return locale === "hi-IN" ? "समान व्यंजक पर दोनों अर्थ लागू करें।" : "ਸਾਂਝੇ ਹਿਸਾਬ ਉੱਤੇ ਦੋਵੇਂ ਅਰਥ ਲਾਗੂ ਕਰੋ।";
  if (original === "Keep the two token meanings separate.") return locale === "hi-IN" ? "दोनों चिह्नों के अर्थ अलग-अलग ध्यान में रखें।" : "ਦੋਵੇਂ ਚਿੰਨ੍ਹਾਂ ਦੇ ਅਰਥ ਵੱਖ-ਵੱਖ ਧਿਆਨ ਵਿੱਚ ਰੱਖੋ।";
  if (original === "Use this one key for every option.") return locale === "hi-IN" ? "हर विकल्प में यही एक अर्थ-कुंजी लागू करें।" : "ਹਰ ਵਿਕਲਪ ਵਿੱਚ ਇਹੀ ਇੱਕ ਅਰਥ-ਕੁੰਜੀ ਲਾਗੂ ਕਰੋ।";
  if (original === "Each complete word has one arithmetic meaning.") return locale === "hi-IN" ? "हर पूरे शब्द का एक गणितीय अर्थ है।" : "ਹਰ ਪੂਰੇ ਸ਼ਬਦ ਦਾ ਇੱਕ ਗਣਿਤੀ ਅਰਥ ਹੈ।";
  if (original === "Use the complete replacement key before checking any option.") return locale === "hi-IN" ? "किसी विकल्प की जाँच से पहले पूरी अर्थ-कुंजी लागू करें।" : "ਕਿਸੇ ਵਿਕਲਪ ਦੀ ਜਾਂਚ ਤੋਂ ਪਹਿਲਾਂ ਪੂਰੀ ਅਰਥ-ਕੁੰਜੀ ਲਾਗੂ ਕਰੋ।";
  if (original === "The answer must be a display token from this key.") return locale === "hi-IN" ? "उत्तर इसी कुंजी का सांकेतिक चिह्न होना चाहिए।" : "ਉੱਤਰ ਇਸੇ ਕੁੰਜੀ ਦਾ ਸੰਕੇਤੀ ਚਿੰਨ੍ਹ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।";

  const fixedGenerated: Readonly<Record<string, readonly [string, string]>> = {
    "Both directions apply throughout the expression.": ["दोनों दिशाओं के बदलाव पूरे व्यंजक में लागू होते हैं।", "ਦੋਵੇਂ ਦਿਸ਼ਾਵਾਂ ਦੇ ਬਦਲਾਅ ਪੂਰੇ ਹਿਸਾਬ ਵਿੱਚ ਲਾਗੂ ਹੁੰਦੇ ਹਨ।"],
    "Both pairs are applied simultaneously.": ["दोनों युग्म एक साथ बदले जाते हैं।", "ਦੋਵੇਂ ਜੋੜੇ ਇਕੱਠੇ ਬਦਲੇ ਜਾਂਦੇ ਹਨ।"],
    "All four operator identities change simultaneously.": ["चारों गणितीय चिह्नों के बदलाव एक साथ लागू होते हैं।", "ਚਾਰੇ ਗਣਿਤੀ ਚਿੰਨ੍ਹਾਂ ਦੇ ਬਦਲਾਅ ਇਕੱਠੇ ਲਾਗੂ ਹੁੰਦੇ ਹਨ।"],
    "Use the same interchange in every option.": ["हर विकल्प में यही बदलाव करें।", "ਹਰ ਵਿਕਲਪ ਵਿੱਚ ਇਹੀ ਬਦਲਾਅ ਕਰੋ।"],
    "Only the complete matching numbers change.": ["केवल पूरी मिलती हुई संख्याएँ बदलती हैं।", "ਕੇਵਲ ਪੂਰੀਆਂ ਮਿਲਦੀਆਂ ਸੰਖਿਆਵਾਂ ਬਦਲਦੀਆਂ ਹਨ।"],
    "Use this two-way change in every option.": ["हर विकल्प में यही दो-तरफ़ा बदलाव करें।", "ਹਰ ਵਿਕਲਪ ਵਿੱਚ ਇਹੀ ਦੋ-ਤਰਫ਼ਾ ਬਦਲਾਅ ਕਰੋ।"],
    "Every occurrence of both digits changes.": ["दोनों अंकों की हर उपस्थिति बदलती है।", "ਦੋਵੇਂ ਅੰਕਾਂ ਦੀ ਹਰ ਮੌਜੂਦਗੀ ਬਦਲਦੀ ਹੈ।"],
    "The digit change is global.": ["अंकों का बदलाव पूरे व्यंजक में लागू है।", "ਅੰਕਾਂ ਦਾ ਬਦਲਾਅ ਪੂਰੇ ਹਿਸਾਬ ਵਿੱਚ ਲਾਗੂ ਹੈ।"],
    "Use these replacements in every option.": ["हर विकल्प में यही बदलाव लागू करें।", "ਹਰ ਵਿਕਲਪ ਵਿੱਚ ਇਹੀ ਬਦਲਾਅ ਲਾਗੂ ਕਰੋ।"],
    "Both operators are interchanged simultaneously.": ["दोनों गणितीय चिह्न एक साथ आपस में बदले जाते हैं।", "ਦੋਵੇਂ ਗਣਿਤੀ ਚਿੰਨ੍ਹ ਇਕੱਠੇ ਆਪਸ ਵਿੱਚ ਬਦਲੇ ਜਾਂਦੇ ਹਨ।"],
    "Only complete number tokens are exchanged.": ["केवल पूरी संख्या-इकाइयाँ आपस में बदली जाती हैं।", "ਕੇਵਲ ਪੂਰੀਆਂ ਸੰਖਿਆ-ਇਕਾਈਆਂ ਆਪਸ ਵਿੱਚ ਬਦਲੀਆਂ ਜਾਂਦੀਆਂ ਹਨ।"],
  };
  const fixed = fixedGenerated[original];
  if (fixed) return locale === "hi-IN" ? fixed[0] : fixed[1];

  const booleanTrace = original.match(/^(.+); (true|false)\.$/u);
  if (booleanTrace) {
    const truth = booleanTrace[2] === "true";
    return locale === "hi-IN"
      ? `${booleanTrace[1]}; यह कथन ${truth ? "सही" : "गलत"} है।`
      : `${booleanTrace[1]}; ਇਹ ਕਥਨ ${truth ? "ਸਹੀ" : "ਗਲਤ"} ਹੈ।`;
  }

  const equalityToken = original.match(/^([ABCD]) represents equality\.$/u);
  if (equalityToken) return locale === "hi-IN" ? `${equalityToken[1]} बराबरी को दर्शाता है।` : `${equalityToken[1]} ਬਰਾਬਰੀ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ।`;

  if (original === "Three double pairings and all six single pairs were tested.") return locale === "hi-IN" ? "तीन दोहरे युग्म और सभी छह एकल युग्म जाँचे गए।" : "ਤਿੰਨ ਦੋਹਰੇ ਜੋੜੇ ਅਤੇ ਸਾਰੇ ਛੇ ਇਕੱਲੇ ਜੋੜੇ ਜਾਂਚੇ ਗਏ।";
  const repaired = original.match(/^Only (.+) repairs the equation and no single pair does\.$/u);
  if (repaired) return locale === "hi-IN" ? `केवल ${repaired[1]} समीकरण को सही करता है; कोई एकल युग्म ऐसा नहीं करता।` : `ਕੇਵਲ ${repaired[1]} ਸਮੀਕਰਨ ਨੂੰ ਸਹੀ ਕਰਦਾ ਹੈ; ਕੋਈ ਇਕੱਲਾ ਜੋੜਾ ਐਸਾ ਨਹੀਂ ਕਰਦਾ।`;
  const digitPairs = original.match(/^(\d+) visible digit pairs were tested\.$/u);
  if (digitPairs) return locale === "hi-IN" ? `${digitPairs[1]} संभावित अंक-युग्म जाँचे गए।` : `${digitPairs[1]} ਸੰਭਵ ਅੰਕ-ਜੋੜੇ ਜਾਂਚੇ ਗਏ।`;

  const inferredTail = original.match(/^(.+), so ([MN]) means ([+−×÷])\.$/u);
  if (inferredTail) return locale === "hi-IN" ? `${inferredTail[1]}, इसलिए ${inferredTail[2]} का अर्थ ${inferredTail[3]} है।` : `${inferredTail[1]}, ਇਸ ਲਈ ${inferredTail[2]} ਦਾ ਅਰਥ ${inferredTail[3]} ਹੈ।`;
  const inferredLead = original.match(/^([MN]) means ([+−×÷]) because (.+)\.$/u);
  if (inferredLead) return locale === "hi-IN" ? `${inferredLead[1]} का अर्थ ${inferredLead[2]} है क्योंकि ${inferredLead[3]} सही है।` : `${inferredLead[1]} ਦਾ ਅਰਥ ${inferredLead[2]} ਹੈ ਕਿਉਂਕਿ ${inferredLead[3]} ਸਹੀ ਹੈ।`;

  return translated;
}

function localizeOptionValue(value: string, locale: ApprovedOpsLocale): string {
  const dictionary = locale === "hi-IN"
    ? {
      "Only one pair is required": "केवल एक चिह्न-युग्म आवश्यक है",
      "no number swap": "पूरी संख्याओं का बदलाव नहीं",
      "no operator swap": "चिह्नों का बदलाव नहीं",
      "no digit interchange": "अंकों का बदलाव नहीं",
      "no operator interchange": "चिह्नों का बदलाव नहीं",
    }
    : {
      "Only one pair is required": "ਕੇਵਲ ਇੱਕ ਚਿੰਨ੍ਹ-ਜੋੜਾ ਲੋੜੀਂਦਾ ਹੈ",
      "no number swap": "ਪੂਰੀਆਂ ਸੰਖਿਆਵਾਂ ਦਾ ਬਦਲਾਅ ਨਹੀਂ",
      "no operator swap": "ਚਿੰਨ੍ਹਾਂ ਦਾ ਬਦਲਾਅ ਨਹੀਂ",
      "no digit interchange": "ਅੰਕਾਂ ਦਾ ਬਦਲਾਅ ਨਹੀਂ",
      "no operator interchange": "ਚਿੰਨ੍ਹਾਂ ਦਾ ਬਦਲਾਅ ਨਹੀਂ",
    };

  let localized = value;
  for (const [english, replacement] of Object.entries(dictionary)) {
    localized = localized.replaceAll(english, replacement);
  }
  return localized;
}

export function localizeApprovedOpsQuestion(
  question: ApprovedOpsQuestion,
  locale: ApprovedOpsLocale,
): LocalizedApprovedOpsQuestion {
  const originalSteps = question.explanation.steps.map((step) => ({ ...step }));
  const patched: ApprovedOpsQuestion = {
    ...question,
    explanation: {
      ...question.explanation,
      steps: question.explanation.steps.map((step) => ({
        label: placeholderLabel(step.label),
        expression: placeholderText(step.expression),
        result: placeholderText(step.result),
      })),
    },
  };
  const localized = localizeBase(patched, locale);
  return {
    ...localized,
    options: localized.options.map((option) => ({
      ...option,
      value: localizeOptionValue(option.value, locale),
    })),
    explanation: {
      ...localized.explanation,
      steps: localized.explanation.steps.map((step, index) => {
        const original = originalSteps[index];
        const generatedLabel = localizedGeneratedLabel(original.label, locale);
        const label = generatedLabel ?? (original.label === "Read the value" || original.label.endsWith(": Read the value")
          ? localizedValueLabel(original.label, locale)
          : step.label);
        return {
          ...step,
          label,
          expression: restoreText(original.expression, step.expression, locale),
          result: restoreText(original.result, step.result, locale),
        };
      }),
    },
  };
}
