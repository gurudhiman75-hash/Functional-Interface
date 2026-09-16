import { CLS_CP004_ENGLISH_QL_ID } from "./cp004-english-contract";
import {
  generateClsCp004EnglishQuestion,
  type GeneratedClsCp004EnglishQuestion,
} from "./cp004-english-runtime";
import {
  analyzeClsCp004Number,
  clsCp004DivisorForRule,
  clsCp004RuleValue,
} from "./number-domain";
import type { ClsCp004NumberFeatures, ClsCp004RuleId } from "./types";

export type ClsCp004TranslatedLocale = "hi-IN" | "pa-IN";

export type GeneratedClsCp004LocalizedQuestion = Omit<
  GeneratedClsCp004EnglishQuestion,
  "stem" | "evidenceByOption" | "explanation" | "metadata" | "lifecycle"
> & {
  readonly stem: string;
  readonly evidenceByOption: readonly string[];
  readonly explanation: {
    readonly coreConcept: readonly string[];
    readonly stepByStep: readonly string[];
    readonly examSpeedShortcut: readonly string[];
    readonly commonTrapWarning: readonly string[];
  };
  readonly metadata: Omit<GeneratedClsCp004EnglishQuestion["metadata"], "locale" | "runtimeVersion"> & {
    readonly locale: ClsCp004TranslatedLocale;
    readonly runtimeVersion: "cls-cp004-multilingual-review-v1";
    readonly canonicalRuntimeVersion: "cls-cp004-english-runtime-v2";
    readonly canonicalLocale: "en-IN";
    readonly localizationStatus: "EXECUTABLE_REVIEW_REQUIRED";
  };
  readonly lifecycle: Omit<GeneratedClsCp004EnglishQuestion["lifecycle"], "reviewStatus"> & {
    readonly reviewStatus: "LOCALIZED_REVIEW_REQUIRED";
  };
};

function tx(locale: ClsCp004TranslatedLocale, hi: string, pa: string): string {
  return locale === "hi-IN" ? hi : pa;
}

function rootOfSquare(value: number): number | null {
  const root = Math.trunc(Math.sqrt(value));
  return root * root === value ? root : null;
}

function rootOfCube(value: number): number | null {
  const root = Math.round(Math.cbrt(value));
  return root * root * root === value ? root : null;
}

function triangularIndex(value: number): number | null {
  const index = Math.trunc((Math.sqrt(8 * value + 1) - 1) / 2);
  return index * (index + 1) / 2 === value ? index : null;
}

function naturalList(values: readonly string[], locale: ClsCp004TranslatedLocale): string {
  if (values.length === 0) return "";
  if (values.length === 1) return values[0]!;
  const joiner = locale === "hi-IN" ? " और " : " ਅਤੇ ";
  return `${values.slice(0, -1).join(", ")}${joiner}${values.at(-1)}`;
}

function digitCompositionText(
  value: ClsCp004NumberFeatures["digitParityComposition"],
  locale: ClsCp004TranslatedLocale,
): string {
  if (locale === "hi-IN") {
    if (value === "ALL_EVEN") return "सभी अंक सम हैं";
    if (value === "ALL_ODD") return "सभी अंक विषम हैं";
    return "अंकों में सम और विषम दोनों प्रकार हैं";
  }
  if (value === "ALL_EVEN") return "ਸਾਰੇ ਅੰਕ ਜੁੜੇ ਹਨ";
  if (value === "ALL_ODD") return "ਸਾਰੇ ਅੰਕ ਟਾਂਕ ਹਨ";
  return "ਅੰਕਾਂ ਵਿੱਚ ਜੁੜੇ ਅਤੇ ਟਾਂਕ ਦੋਵੇਂ ਕਿਸਮਾਂ ਹਨ";
}

function nearPowerText(
  value: ClsCp004NumberFeatures["nearPowerClass"],
  locale: ClsCp004TranslatedLocale,
): string {
  if (locale === "hi-IN") {
    switch (value) {
      case "ONE_BELOW_SQUARE": return "किसी पूर्ण वर्ग से 1 कम";
      case "ONE_ABOVE_SQUARE": return "किसी पूर्ण वर्ग से 1 अधिक";
      case "ONE_BELOW_CUBE": return "किसी पूर्ण घन से 1 कम";
      case "ONE_ABOVE_CUBE": return "किसी पूर्ण घन से 1 अधिक";
      case "MULTIPLE_NEAR_POWER_RELATIONS": return "एक से अधिक पूर्ण वर्ग या घन के ठीक पास";
      case "NONE": return "किसी निर्धारित पूर्ण वर्ग या घन से 1 कम या अधिक नहीं";
    }
  }
  switch (value) {
    case "ONE_BELOW_SQUARE": return "ਕਿਸੇ ਪੂਰਨ ਵਰਗ ਤੋਂ 1 ਘੱਟ";
    case "ONE_ABOVE_SQUARE": return "ਕਿਸੇ ਪੂਰਨ ਵਰਗ ਤੋਂ 1 ਵੱਧ";
    case "ONE_BELOW_CUBE": return "ਕਿਸੇ ਪੂਰਨ ਘਣ ਤੋਂ 1 ਘੱਟ";
    case "ONE_ABOVE_CUBE": return "ਕਿਸੇ ਪੂਰਨ ਘਣ ਤੋਂ 1 ਵੱਧ";
    case "MULTIPLE_NEAR_POWER_RELATIONS": return "ਇੱਕ ਤੋਂ ਵੱਧ ਪੂਰਨ ਵਰਗ ਜਾਂ ਘਣ ਦੇ ਬਿਲਕੁਲ ਨੇੜੇ";
    case "NONE": return "ਕਿਸੇ ਨਿਰਧਾਰਤ ਪੂਰਨ ਵਰਗ ਜਾਂ ਘਣ ਤੋਂ 1 ਘੱਟ ਜਾਂ ਵੱਧ ਨਹੀਂ";
  }
}

function propertyText(
  ruleId: ClsCp004RuleId,
  value: string,
  locale: ClsCp004TranslatedLocale,
): string {
  const divisor = clsCp004DivisorForRule(ruleId);
  if (divisor !== null) {
    if (locale === "hi-IN") return value === "DIVISIBLE" ? `${divisor} से पूरी तरह विभाजित` : `${divisor} से पूरी तरह विभाजित नहीं`;
    return value === "DIVISIBLE" ? `${divisor} ਨਾਲ ਪੂਰੀ ਤਰ੍ਹਾਂ ਭਾਗਯੋਗ` : `${divisor} ਨਾਲ ਪੂਰੀ ਤਰ੍ਹਾਂ ਭਾਗਯੋਗ ਨਹੀਂ`;
  }
  if (locale === "hi-IN") {
    switch (ruleId) {
      case "DIGIT_COUNT": return `${value} अंकों वाली संख्या`;
      case "PARITY": return value === "EVEN" ? "सम संख्या" : "विषम संख्या";
      case "PRIMALITY_CLASS": return value === "PRIME" ? "अभाज्य संख्या" : "अभाज्य न होने वाली संख्या";
      case "PERFECT_SQUARE_STATUS": return value === "PERFECT_SQUARE" ? "पूर्ण वर्ग" : "पूर्ण वर्ग नहीं";
      case "PERFECT_CUBE_STATUS": return value === "PERFECT_CUBE" ? "पूर्ण घन" : "पूर्ण घन नहीं";
      case "DIVISOR_COUNT": return `ठीक ${value} धनात्मक भाजक`;
      case "DIGIT_PARITY_COMPOSITION": return digitCompositionText(value as ClsCp004NumberFeatures["digitParityComposition"], locale);
      case "DIGIT_SUM": return `अंकों का योग ${value}`;
      case "DIGIT_PRODUCT": return `अंकों का गुणनफल ${value}`;
      case "PALINDROME_STATUS": return value === "PALINDROME" ? "अंकों को उलटने पर संख्या नहीं बदलती" : "अंकों को उलटने पर संख्या बदल जाती है";
      case "NEAR_POWER_CLASS": return nearPowerText(value as ClsCp004NumberFeatures["nearPowerClass"], locale);
      case "TRIANGULAR_STATUS": return value === "TRIANGULAR" ? "त्रिभुजीय संख्या" : "त्रिभुजीय संख्या नहीं";
      default: throw new Error(`Unsupported CLS-CP-004 rule ${ruleId}`);
    }
  }
  switch (ruleId) {
    case "DIGIT_COUNT": return `${value} ਅੰਕਾਂ ਵਾਲੀ ਸੰਖਿਆ`;
    case "PARITY": return value === "EVEN" ? "ਜੁੜੀ ਸੰਖਿਆ" : "ਟਾਂਕ ਸੰਖਿਆ";
    case "PRIMALITY_CLASS": return value === "PRIME" ? "ਅਭਾਜ ਸੰਖਿਆ" : "ਅਭਾਜ ਨਾ ਹੋਣ ਵਾਲੀ ਸੰਖਿਆ";
    case "PERFECT_SQUARE_STATUS": return value === "PERFECT_SQUARE" ? "ਪੂਰਨ ਵਰਗ" : "ਪੂਰਨ ਵਰਗ ਨਹੀਂ";
    case "PERFECT_CUBE_STATUS": return value === "PERFECT_CUBE" ? "ਪੂਰਨ ਘਣ" : "ਪੂਰਨ ਘਣ ਨਹੀਂ";
    case "DIVISOR_COUNT": return `ਠੀਕ ${value} ਧਨਾਤਮਕ ਭਾਜਕ`;
    case "DIGIT_PARITY_COMPOSITION": return digitCompositionText(value as ClsCp004NumberFeatures["digitParityComposition"], locale);
    case "DIGIT_SUM": return `ਅੰਕਾਂ ਦਾ ਜੋੜ ${value}`;
    case "DIGIT_PRODUCT": return `ਅੰਕਾਂ ਦਾ ਗੁਣਨਫਲ ${value}`;
    case "PALINDROME_STATUS": return value === "PALINDROME" ? "ਅੰਕ ਉਲਟਣ ਉੱਤੇ ਸੰਖਿਆ ਨਹੀਂ ਬਦਲਦੀ" : "ਅੰਕ ਉਲਟਣ ਉੱਤੇ ਸੰਖਿਆ ਬਦਲ ਜਾਂਦੀ ਹੈ";
    case "NEAR_POWER_CLASS": return nearPowerText(value as ClsCp004NumberFeatures["nearPowerClass"], locale);
    case "TRIANGULAR_STATUS": return value === "TRIANGULAR" ? "ਤਿਕੋਣੀ ਸੰਖਿਆ" : "ਤਿਕੋਣੀ ਸੰਖਿਆ ਨਹੀਂ";
    default: throw new Error(`Unsupported CLS-CP-004 rule ${ruleId}`);
  }
}

function exactValueText(
  features: ClsCp004NumberFeatures,
  ruleId: ClsCp004RuleId,
  locale: ClsCp004TranslatedLocale,
): string {
  const n = features.value;
  const divisor = clsCp004DivisorForRule(ruleId);
  if (divisor !== null) {
    const divisible = n % divisor === 0;
    return locale === "hi-IN"
      ? `${n} ${divisor} से ${divisible ? "पूरी तरह विभाजित होता है" : "पूरी तरह विभाजित नहीं होता"}`
      : `${n} ${divisor} ਨਾਲ ${divisible ? "ਪੂਰੀ ਤਰ੍ਹਾਂ ਭਾਗਯੋਗ ਹੈ" : "ਪੂਰੀ ਤਰ੍ਹਾਂ ਭਾਗਯੋਗ ਨਹੀਂ ਹੈ"}`;
  }
  if (locale === "hi-IN") {
    switch (ruleId) {
      case "DIGIT_COUNT": return `${n} में ${features.digitCount} अंक हैं`;
      case "PARITY": return `${n} ${features.parity === "EVEN" ? "सम" : "विषम"} है`;
      case "PRIMALITY_CLASS": return `${n} ${features.primalityClass === "PRIME" ? "अभाज्य" : "अभाज्य नहीं"} है`;
      case "PERFECT_SQUARE_STATUS": { const r = rootOfSquare(n); return r === null ? `${n} पूर्ण वर्ग नहीं है` : `${n} = ${r}²`; }
      case "PERFECT_CUBE_STATUS": { const r = rootOfCube(n); return r === null ? `${n} पूर्ण घन नहीं है` : `${n} = ${r}³`; }
      case "DIVISOR_COUNT": return `${n} के ${features.divisorCount} धनात्मक भाजक हैं`;
      case "DIGIT_PARITY_COMPOSITION": return `${n} में ${digitCompositionText(features.digitParityComposition, locale)}`;
      case "DIGIT_SUM": return `${n} के अंकों का योग ${features.digitSum} है`;
      case "DIGIT_PRODUCT": return `${n} के अंकों का गुणनफल ${features.digitProduct} है`;
      case "PALINDROME_STATUS": return features.palindrome ? `${n} को उलटने पर वही संख्या मिलती है` : `${n} को उलटने पर संख्या बदल जाती है`;
      case "NEAR_POWER_CLASS": return `${n}, ${nearPowerText(features.nearPowerClass, locale)} है`;
      case "TRIANGULAR_STATUS": { const i = triangularIndex(n); return i === null ? `${n} त्रिभुजीय संख्या नहीं है` : `${n} = ${i} × ${i + 1} ÷ 2, इसलिए यह त्रिभुजीय है`; }
      default: throw new Error(`Unsupported CLS-CP-004 rule ${ruleId}`);
    }
  }
  switch (ruleId) {
    case "DIGIT_COUNT": return `${n} ਵਿੱਚ ${features.digitCount} ਅੰਕ ਹਨ`;
    case "PARITY": return `${n} ${features.parity === "EVEN" ? "ਜੁੜੀ" : "ਟਾਂਕ"} ਸੰਖਿਆ ਹੈ`;
    case "PRIMALITY_CLASS": return `${n} ${features.primalityClass === "PRIME" ? "ਅਭਾਜ" : "ਅਭਾਜ ਨਹੀਂ"} ਹੈ`;
    case "PERFECT_SQUARE_STATUS": { const r = rootOfSquare(n); return r === null ? `${n} ਪੂਰਨ ਵਰਗ ਨਹੀਂ ਹੈ` : `${n} = ${r}²`; }
    case "PERFECT_CUBE_STATUS": { const r = rootOfCube(n); return r === null ? `${n} ਪੂਰਨ ਘਣ ਨਹੀਂ ਹੈ` : `${n} = ${r}³`; }
    case "DIVISOR_COUNT": return `${n} ਦੇ ${features.divisorCount} ਧਨਾਤਮਕ ਭਾਜਕ ਹਨ`;
    case "DIGIT_PARITY_COMPOSITION": return `${n} ਵਿੱਚ ${digitCompositionText(features.digitParityComposition, locale)}`;
    case "DIGIT_SUM": return `${n} ਦੇ ਅੰਕਾਂ ਦਾ ਜੋੜ ${features.digitSum} ਹੈ`;
    case "DIGIT_PRODUCT": return `${n} ਦੇ ਅੰਕਾਂ ਦਾ ਗੁਣਨਫਲ ${features.digitProduct} ਹੈ`;
    case "PALINDROME_STATUS": return features.palindrome ? `${n} ਦੇ ਅੰਕ ਉਲਟਣ ਉੱਤੇ ਉਹੀ ਸੰਖਿਆ ਮਿਲਦੀ ਹੈ` : `${n} ਦੇ ਅੰਕ ਉਲਟਣ ਉੱਤੇ ਸੰਖਿਆ ਬਦਲ ਜਾਂਦੀ ਹੈ`;
    case "NEAR_POWER_CLASS": return `${n}, ${nearPowerText(features.nearPowerClass, locale)} ਹੈ`;
    case "TRIANGULAR_STATUS": { const i = triangularIndex(n); return i === null ? `${n} ਤਿਕੋਣੀ ਸੰਖਿਆ ਨਹੀਂ ਹੈ` : `${n} = ${i} × ${i + 1} ÷ 2, ਇਸ ਲਈ ਇਹ ਤਿਕੋਣੀ ਹੈ`; }
    default: throw new Error(`Unsupported CLS-CP-004 rule ${ruleId}`);
  }
}

function localizedStem(seed: number, locale: ClsCp004TranslatedLocale): string {
  const hindi = [
    "कौन-सी संख्या बाकी संख्याओं से अलग है?",
    "वह संख्या चुनिए जो बाकी के समान नियम का पालन नहीं करती।",
    "बाकी संख्याओं में एक समान गुण है। अलग संख्या पहचानिए।",
    "निम्नलिखित में से विषम संख्या चुनिए।",
    "कौन-सी संख्या बाकी समूह में नहीं आती?",
  ];
  const punjabi = [
    "ਕਿਹੜੀ ਸੰਖਿਆ ਬਾਕੀ ਸੰਖਿਆਵਾਂ ਤੋਂ ਵੱਖਰੀ ਹੈ?",
    "ਉਹ ਸੰਖਿਆ ਚੁਣੋ ਜੋ ਬਾਕੀਆਂ ਵਾਲੇ ਨਿਯਮ ਉੱਤੇ ਨਹੀਂ ਚੱਲਦੀ।",
    "ਬਾਕੀ ਸੰਖਿਆਵਾਂ ਵਿੱਚ ਇੱਕੋ ਗੁਣ ਹੈ। ਵੱਖਰੀ ਸੰਖਿਆ ਪਛਾਣੋ।",
    "ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਵੱਖਰੀ ਸੰਖਿਆ ਚੁਣੋ।",
    "ਕਿਹੜੀ ਸੰਖਿਆ ਬਾਕੀ ਸਮੂਹ ਵਿੱਚ ਨਹੀਂ ਆਉਂਦੀ?",
  ];
  return (locale === "hi-IN" ? hindi : punjabi)[seed % 5]!;
}

function localizeQuestion(
  question: GeneratedClsCp004EnglishQuestion,
  locale: ClsCp004TranslatedLocale,
): GeneratedClsCp004LocalizedQuestion {
  const commonNumbers = question.numbers.filter((_, index) => index !== question.correctIndex).map(String);
  const oddFeatures = analyzeClsCp004Number(question.numbers[question.correctIndex]!);
  const commonProperty = propertyText(question.intendedRuleId, question.intendedRuleValue, locale);
  const oddEvidence = exactValueText(oddFeatures, question.intendedRuleId, locale);
  const evidenceByOption = question.numbers.map((number) => {
    const features = analyzeClsCp004Number(number);
    const follows = clsCp004RuleValue(features, question.intendedRuleId) === question.intendedRuleValue;
    const evidence = exactValueText(features, question.intendedRuleId, locale);
    return locale === "hi-IN"
      ? `${evidence}; यह ${follows ? "समान गुण से मेल खाता है" : "समान गुण से मेल नहीं खाता"}।`
      : `${evidence}; ਇਹ ${follows ? "ਸਾਂਝੇ ਗੁਣ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ" : "ਸਾਂਝੇ ਗੁਣ ਨਾਲ ਮੇਲ ਨਹੀਂ ਖਾਂਦਾ"}।`;
  });

  const stepByStep = locale === "hi-IN"
    ? [
      `${naturalList(commonNumbers, locale)} में समान गुण है: ${commonProperty}।`,
      `${oddEvidence}, इसलिए यह बाकी संख्याओं से अलग है।`,
      `अतः सही उत्तर ${question.answer} है।`,
    ]
    : [
      `${naturalList(commonNumbers, locale)} ਵਿੱਚ ਸਾਂਝਾ ਗੁਣ ਹੈ: ${commonProperty}।`,
      `${oddEvidence}, ਇਸ ਲਈ ਇਹ ਬਾਕੀ ਸੰਖਿਆਵਾਂ ਤੋਂ ਵੱਖਰੀ ਹੈ।`,
      `ਇਸ ਲਈ ਸਹੀ ਜਵਾਬ ${question.answer} ਹੈ।`,
    ];

  return {
    ...question,
    stem: localizedStem(question.seed, locale),
    evidenceByOption,
    explanation: {
      coreConcept: [locale === "hi-IN" ? `बाकी संख्याओं का समान गुण: ${commonProperty}।` : `ਬਾਕੀ ਸੰਖਿਆਵਾਂ ਦਾ ਸਾਂਝਾ ਗੁਣ: ${commonProperty}।`],
      stepByStep,
      examSpeedShortcut: [],
      commonTrapWarning: [],
    },
    metadata: {
      ...question.metadata,
      locale,
      runtimeVersion: "cls-cp004-multilingual-review-v1",
      canonicalRuntimeVersion: "cls-cp004-english-runtime-v2",
      canonicalLocale: "en-IN",
      localizationStatus: "EXECUTABLE_REVIEW_REQUIRED",
    },
    lifecycle: {
      ...question.lifecycle,
      reviewStatus: "LOCALIZED_REVIEW_REQUIRED",
    },
  };
}

export function generateClsCp004LocalizedQuestion(
  locale: ClsCp004TranslatedLocale,
  seed = 0,
  requestedOptionCount?: 4 | 5,
): GeneratedClsCp004LocalizedQuestion {
  const english = generateClsCp004EnglishQuestion(CLS_CP004_ENGLISH_QL_ID, seed, requestedOptionCount);
  return localizeQuestion(english, locale);
}
