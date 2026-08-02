import {
  clsCp006FormatItem,
  clsCp006IsVowel,
  clsCp006LetterPosition,
} from "../alphabet-domain";
import {
  CLS_CP006_ODD_LETTER_PAIR_QL_ID,
  CLS_CP006_ODD_LETTER_QL_ID,
} from "../cp006-english-contracts";
import type { GeneratedClsCp006EnglishQuestion } from "../cp006-english-runtime";
import type { ClsCp006Item, ClsCp006RuleId } from "../types";
import {
  localizedClsCp006RuleText,
  type ClsCp006TranslatedLocale,
} from "./cp006-language-pack";

export type GeneratedClsCp006LocalizedQuestion = Omit<
  GeneratedClsCp006EnglishQuestion,
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
  readonly metadata: Omit<
    GeneratedClsCp006EnglishQuestion["metadata"],
    "locale" | "runtimeVersion"
  > & {
    readonly locale: ClsCp006TranslatedLocale;
    readonly runtimeVersion: "cls-cp006-multilingual-runtime-v1";
    readonly canonicalRuntimeVersion: string;
    readonly canonicalLocale: "en-IN";
    readonly localizationVersion: "cls-cp006-hi-pa-localization-v1";
    readonly localizationStatus: "EXECUTABLE_REVIEW_REQUIRED";
  };
  readonly lifecycle: Omit<
    GeneratedClsCp006EnglishQuestion["lifecycle"],
    "reviewStatus"
  > & {
    readonly reviewStatus: "LOCALIZED_REVIEW_REQUIRED";
  };
};

function localizedStem(
  question: GeneratedClsCp006EnglishQuestion,
  locale: ClsCp006TranslatedLocale,
): string {
  const variant = question.seed % 5;
  if (question.qlId === CLS_CP006_ODD_LETTER_QL_ID) {
    const hindi = [
      "निम्नलिखित अक्षरों में से अलग अक्षर चुनिए।",
      "अधिकतर अक्षर एक ही वर्णमाला गुण रखते हैं। अलग अक्षर पहचानिए।",
      "कौन-सा अक्षर बाकी अक्षरों के सामान्य वर्ग में नहीं आता?",
      "दिए गए अक्षरों में से विषम (अलग) अक्षर चुनिए।",
      "बाकी अक्षरों से अलग वर्णमाला गुण वाला अक्षर कौन-सा है?",
    ];
    const punjabi = [
      "ਹੇਠਾਂ ਦਿੱਤੇ ਅੱਖਰਾਂ ਵਿੱਚੋਂ ਵੱਖਰਾ ਅੱਖਰ ਚੁਣੋ।",
      "ਜ਼ਿਆਦਾਤਰ ਅੱਖਰਾਂ ਵਿੱਚ ਇੱਕੋ ਵਰਣਮਾਲਾ ਗੁਣ ਹੈ। ਵੱਖਰਾ ਅੱਖਰ ਪਛਾਣੋ।",
      "ਕਿਹੜਾ ਅੱਖਰ ਬਾਕੀ ਅੱਖਰਾਂ ਦੇ ਸਾਂਝੇ ਵਰਗ ਵਿੱਚ ਨਹੀਂ ਆਉਂਦਾ?",
      "ਦਿੱਤੇ ਅੱਖਰਾਂ ਵਿੱਚੋਂ ਵੱਖਰਾ ਅੱਖਰ ਚੁਣੋ।",
      "ਬਾਕੀ ਅੱਖਰਾਂ ਨਾਲੋਂ ਵੱਖਰੇ ਵਰਣਮਾਲਾ ਗੁਣ ਵਾਲਾ ਅੱਖਰ ਕਿਹੜਾ ਹੈ?",
    ];
    return (locale === "hi-IN" ? hindi : punjabi)[variant]!;
  }

  const hindi = [
    "निम्नलिखित अक्षर-जोड़ियों में से अलग जोड़ी चुनिए।",
    "अधिकतर अक्षर-जोड़ियाँ एक ही आंतरिक नियम पर चलती हैं। अलग जोड़ी पहचानिए।",
    "कौन-सी क्रमबद्ध अक्षर-जोड़ी बाकी जोड़ियों के सामान्य संबंध से अलग है?",
    "दिए गए अक्षर-जोड़ों में से विषम (अलग) जोड़ा चुनिए।",
    "बाकी जोड़ियों से अलग वर्णमाला संबंध वाली पूरी जोड़ी कौन-सी है?",
  ];
  const punjabi = [
    "ਹੇਠਾਂ ਦਿੱਤੇ ਅੱਖਰ-ਜੋੜਿਆਂ ਵਿੱਚੋਂ ਵੱਖਰਾ ਜੋੜਾ ਚੁਣੋ।",
    "ਜ਼ਿਆਦਾਤਰ ਅੱਖਰ-ਜੋੜੇ ਇੱਕੋ ਅੰਦਰੂਨੀ ਨਿਯਮ ਉੱਤੇ ਚੱਲਦੇ ਹਨ। ਵੱਖਰਾ ਜੋੜਾ ਪਛਾਣੋ।",
    "ਕਿਹੜਾ ਕ੍ਰਮਬੱਧ ਅੱਖਰ-ਜੋੜਾ ਬਾਕੀ ਜੋੜਿਆਂ ਦੇ ਸਾਂਝੇ ਸੰਬੰਧ ਤੋਂ ਵੱਖਰਾ ਹੈ?",
    "ਦਿੱਤੇ ਅੱਖਰ-ਜੋੜਿਆਂ ਵਿੱਚੋਂ ਵੱਖਰਾ ਜੋੜਾ ਚੁਣੋ।",
    "ਬਾਕੀ ਜੋੜਿਆਂ ਨਾਲੋਂ ਵੱਖਰੇ ਵਰਣਮਾਲਾ ਸੰਬੰਧ ਵਾਲਾ ਪੂਰਾ ਜੋੜਾ ਕਿਹੜਾ ਹੈ?",
  ];
  return (locale === "hi-IN" ? hindi : punjabi)[variant]!;
}

function classLabel(
  vowel: boolean,
  locale: ClsCp006TranslatedLocale,
): string {
  if (locale === "hi-IN") return vowel ? "स्वर" : "व्यंजन";
  return vowel ? "ਸਵਰ" : "ਵਿਅੰਜਨ";
}

function parityLabel(
  even: boolean,
  locale: ClsCp006TranslatedLocale,
): string {
  if (locale === "hi-IN") return even ? "सम" : "विषम";
  return even ? "ਜੋੜਾ" : "ਟਾਂਕ";
}

function halfLabel(
  firstHalf: boolean,
  locale: ClsCp006TranslatedLocale,
): string {
  if (locale === "hi-IN") return firstHalf ? "पहले आधे भाग" : "दूसरे आधे भाग";
  return firstHalf ? "ਪਹਿਲੇ ਅੱਧ" : "ਦੂਜੇ ਅੱਧ";
}

function localizedEvidenceBase(
  item: ClsCp006Item,
  ruleId: ClsCp006RuleId,
  locale: ClsCp006TranslatedLocale,
): string {
  const display = clsCp006FormatItem(item);
  if (item.kind === "LETTER") {
    const letter = item.letters[0];
    const position = clsCp006LetterPosition(letter);
    switch (ruleId) {
      case "LETTER_VOWEL_CONSONANT_CLASS":
        return locale === "hi-IN"
          ? `${letter} ${classLabel(clsCp006IsVowel(letter), locale)} है।`
          : `${letter} ${classLabel(clsCp006IsVowel(letter), locale)} ਹੈ।`;
      case "LETTER_POSITION_PARITY":
        return locale === "hi-IN"
          ? `${letter} का वर्णमाला क्रमांक ${position} है, जो ${parityLabel(position % 2 === 0, locale)} है।`
          : `${letter} ਦਾ ਵਰਣਮਾਲਾ ਨੰਬਰ ${position} ਹੈ, ਜੋ ${parityLabel(position % 2 === 0, locale)} ਹੈ।`;
      case "LETTER_ALPHABET_HALF":
        return locale === "hi-IN"
          ? `${letter} का क्रमांक ${position} है, इसलिए यह वर्णमाला के ${halfLabel(position <= 13, locale)} में है।`
          : `${letter} ਦਾ ਨੰਬਰ ${position} ਹੈ, ਇਸ ਲਈ ਇਹ ਵਰਣਮਾਲਾ ਦੇ ${halfLabel(position <= 13, locale)} ਵਿੱਚ ਹੈ।`;
      default:
        throw new Error(`Rule ${ruleId} cannot localise a single-letter option.`);
    }
  }

  const [first, second] = item.letters;
  const firstPosition = clsCp006LetterPosition(first);
  const secondPosition = clsCp006LetterPosition(second);
  const difference = secondPosition - firstPosition;
  switch (ruleId) {
    case "PAIR_ABSOLUTE_POSITION_GAP":
      return locale === "hi-IN"
        ? `${display}: क्रमांक ${firstPosition} और ${secondPosition} हैं; अंतर \\(|${secondPosition}-${firstPosition}|=${Math.abs(difference)}\\) है।`
        : `${display}: ਨੰਬਰ ${firstPosition} ਅਤੇ ${secondPosition} ਹਨ; ਫਰਕ \\(|${secondPosition}-${firstPosition}|=${Math.abs(difference)}\\) ਹੈ।`;
    case "PAIR_SIGNED_POSITION_GAP":
      return locale === "hi-IN"
        ? `${display}: दूसरे का क्रमांक − पहले का क्रमांक \\(${secondPosition}-${firstPosition}=${difference}\\) है।`
        : `${display}: ਦੂਜੇ ਦਾ ਨੰਬਰ − ਪਹਿਲੇ ਦਾ ਨੰਬਰ \\(${secondPosition}-${firstPosition}=${difference}\\) ਹੈ।`;
    case "PAIR_POSITION_SUM":
      return locale === "hi-IN"
        ? `${display}: दोनों क्रमांकों का योग \\(${firstPosition}+${secondPosition}=${firstPosition + secondPosition}\\) है।`
        : `${display}: ਦੋਵਾਂ ਨੰਬਰਾਂ ਦਾ ਜੋੜ \\(${firstPosition}+${secondPosition}=${firstPosition + secondPosition}\\) ਹੈ।`;
    case "PAIR_OPPOSITE_STATUS": {
      const opposite = firstPosition + secondPosition === 27;
      if (locale === "hi-IN") {
        return `${display}: \\(${firstPosition}+${secondPosition}=${firstPosition + secondPosition}\\); इसलिए ये अक्षर ${opposite ? "विपरीत स्थानों पर हैं" : "विपरीत स्थानों पर नहीं हैं"}।`;
      }
      return `${display}: \\(${firstPosition}+${secondPosition}=${firstPosition + secondPosition}\\); ਇਸ ਲਈ ਇਹ ਅੱਖਰ ${opposite ? "ਉਲਟ ਥਾਵਾਂ ਉੱਤੇ ਹਨ" : "ਉਲਟ ਥਾਵਾਂ ਉੱਤੇ ਨਹੀਂ ਹਨ"}।`;
    }
    case "PAIR_VOWEL_CONSONANT_COMPOSITION": {
      const firstClass = classLabel(clsCp006IsVowel(first), locale);
      const secondClass = classLabel(clsCp006IsVowel(second), locale);
      return locale === "hi-IN"
        ? `${display} में पहले ${firstClass} और फिर ${secondClass} है।`
        : `${display} ਵਿੱਚ ਪਹਿਲਾਂ ${firstClass} ਅਤੇ ਫਿਰ ${secondClass} ਹੈ।`;
    }
    default:
      throw new Error(`Rule ${ruleId} cannot localise a letter-pair option.`);
  }
}

function statusText(
  matchesCommonRule: boolean,
  locale: ClsCp006TranslatedLocale,
): string {
  if (locale === "hi-IN") {
    return matchesCommonRule
      ? "✅ सामान्य नियम से मेल खाता है।"
      : "❌ इसका नियम अलग है।";
  }
  return matchesCommonRule
    ? "✅ ਸਾਂਝੇ ਨਿਯਮ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ।"
    : "❌ ਇਸ ਦਾ ਨਿਯਮ ਵੱਖਰਾ ਹੈ।";
}

function localizedEvidence(
  question: GeneratedClsCp006EnglishQuestion,
  locale: ClsCp006TranslatedLocale,
): readonly string[] {
  return question.items.map((item, index) => {
    const base = localizedEvidenceBase(item, question.intendedRuleId, locale);
    return `${base} — ${statusText(index !== question.correctIndex, locale)}`;
  });
}

function localizedSteps(
  question: GeneratedClsCp006EnglishQuestion,
  evidence: readonly string[],
  locale: ClsCp006TranslatedLocale,
): readonly string[] {
  if (locale === "hi-IN") {
    return [
      "एक ही वर्णमाला नियम को हर विकल्प पर जाँचिए।",
      ...evidence,
      `इसलिए ${question.answer} अलग विकल्प है।`,
    ];
  }
  return [
    "ਇੱਕੋ ਵਰਣਮਾਲਾ ਨਿਯਮ ਹਰ ਵਿਕਲਪ ਉੱਤੇ ਜਾਂਚੋ।",
    ...evidence,
    `ਇਸ ਲਈ ${question.answer} ਵੱਖਰਾ ਵਿਕਲਪ ਹੈ।`,
  ];
}

export function localizeClsCp006Question(
  question: GeneratedClsCp006EnglishQuestion,
  locale: ClsCp006TranslatedLocale,
): GeneratedClsCp006LocalizedQuestion {
  if (
    question.qlId !== CLS_CP006_ODD_LETTER_QL_ID
    && question.qlId !== CLS_CP006_ODD_LETTER_PAIR_QL_ID
  ) {
    throw new Error(`Unsupported CLS-CP-006 QL for localisation: ${question.qlId}`);
  }

  const ruleText = localizedClsCp006RuleText(question.intendedRuleId, locale);
  const evidence = localizedEvidence(question, locale);
  const canonicalRuntimeVersion = question.metadata.runtimeVersion;

  return {
    ...question,
    stem: localizedStem(question, locale),
    evidenceByOption: evidence,
    explanation: {
      coreConcept: [ruleText.statement],
      stepByStep: localizedSteps(question, evidence, locale),
      examSpeedShortcut: [ruleText.shortcut],
      commonTrapWarning: [ruleText.trap],
    },
    metadata: {
      ...question.metadata,
      locale,
      runtimeVersion: "cls-cp006-multilingual-runtime-v1",
      canonicalRuntimeVersion,
      canonicalLocale: "en-IN",
      localizationVersion: "cls-cp006-hi-pa-localization-v1",
      localizationStatus: "EXECUTABLE_REVIEW_REQUIRED",
    },
    lifecycle: {
      ...question.lifecycle,
      reviewStatus: "LOCALIZED_REVIEW_REQUIRED",
    },
  };
}
