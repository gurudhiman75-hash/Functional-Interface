import type { GeneratedClsCp005EnglishQuestion } from "../cp005-english-runtime";
import {
  CLS_CP005_EQUIVALENT_TUPLE_QL_ID,
  CLS_CP005_ODD_TUPLE_QL_ID,
} from "../cp005-english-contracts";
import {
  localizedClsCp005RuleText,
  type ClsCp005TranslatedLocale,
} from "./cp005-language-pack";
import { applyClsCp005NaturalOverrides } from "./cp005-natural-overrides";

export type GeneratedClsCp005LocalizedQuestion = Omit<
  GeneratedClsCp005EnglishQuestion,
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
  readonly metadata: Omit<GeneratedClsCp005EnglishQuestion["metadata"], "locale" | "runtimeVersion"> & {
    readonly locale: ClsCp005TranslatedLocale;
    readonly runtimeVersion: "cls-cp005-multilingual-runtime-v1";
    readonly canonicalRuntimeVersion: string;
    readonly canonicalLocale: "en-IN";
    readonly localizationVersion: "cls-cp005-hi-pa-localization-v1";
    readonly localizationStatus: "EXECUTABLE_REVIEW_REQUIRED";
  };
  readonly lifecycle: Omit<GeneratedClsCp005EnglishQuestion["lifecycle"], "reviewStatus"> & {
    readonly reviewStatus: "LOCALIZED_REVIEW_REQUIRED";
  };
};

function tupleDisplay(tuple: readonly number[]): string {
  return `(${tuple.join(", ")})`;
}

function extractInlineMath(text: string): readonly string[] {
  const segments: string[] = [];
  let cursor = 0;
  while (cursor < text.length) {
    const start = text.indexOf("\\(", cursor);
    if (start < 0) break;
    const end = text.indexOf("\\)", start + 2);
    if (end < 0) throw new Error(`Unbalanced inline MathJax in CP005 evidence: ${text}`);
    segments.push(text.slice(start, end + 2));
    cursor = end + 2;
  }
  return segments;
}

function formatList(values: readonly string[], locale: ClsCp005TranslatedLocale): string {
  if (values.length === 0) return "";
  if (values.length === 1) return values[0]!;
  const conjunction = locale === "hi-IN" ? " और " : " ਅਤੇ ";
  return `${values.slice(0, -1).join(", ")}${conjunction}${values.at(-1)}`;
}

function ruleText(ruleId: string, locale: ClsCp005TranslatedLocale) {
  return applyClsCp005NaturalOverrides(
    ruleId,
    locale,
    localizedClsCp005RuleText(ruleId, locale),
  );
}

function localizedStem(
  question: GeneratedClsCp005EnglishQuestion,
  locale: ClsCp005TranslatedLocale,
): string {
  const variant = question.seed % 5;

  if (question.qlId === CLS_CP005_ODD_TUPLE_QL_ID) {
    const hindi = [
      "कौन-सा विकल्प बाकी विकल्पों से अलग नियम पर चलता है?",
      "वह विकल्प चुनिए जिसमें संख्याओं का आपसी संबंध बाकी से अलग है।",
      "निम्नलिखित में से विषम (अलग) विकल्प चुनिए।",
      "किस विकल्प में संख्याओं का नियम अलग है?",
      "बाकी विकल्प एक ही नियम का पालन करते हैं। अलग विकल्प पहचानिए।",
    ];
    const punjabi = [
      "ਕਿਹੜਾ ਵਿਕਲਪ ਬਾਕੀ ਵਿਕਲਪਾਂ ਨਾਲੋਂ ਵੱਖਰੇ ਨਿਯਮ ਉੱਤੇ ਚੱਲਦਾ ਹੈ?",
      "ਉਹ ਵਿਕਲਪ ਚੁਣੋ ਜਿਸ ਵਿੱਚ ਸੰਖਿਆਵਾਂ ਦਾ ਆਪਸੀ ਸੰਬੰਧ ਬਾਕੀਆਂ ਨਾਲੋਂ ਵੱਖਰਾ ਹੈ।",
      "ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਵੱਖਰਾ ਵਿਕਲਪ ਚੁਣੋ।",
      "ਕਿਸ ਵਿਕਲਪ ਵਿੱਚ ਸੰਖਿਆਵਾਂ ਦਾ ਨਿਯਮ ਵੱਖਰਾ ਹੈ?",
      "ਬਾਕੀ ਵਿਕਲਪ ਇੱਕੋ ਨਿਯਮ ਉੱਤੇ ਚੱਲਦੇ ਹਨ। ਵੱਖਰਾ ਵਿਕਲਪ ਪਛਾਣੋ।",
    ];
    return (locale === "hi-IN" ? hindi : punjabi)[variant]!;
  }

  const reference = question.referenceTuple
    ? tupleDisplay(question.referenceTuple)
    : (() => { throw new Error("CLS-QL-009 localisation requires a reference tuple"); })();
  const hindi = [
    `दिए गए समूह ${reference} का नियम पहचानिए। कौन-सा विकल्प उसी नियम पर चलता है?`,
    `${reference} में संख्याओं का आपसी संबंध देखिए और वैसा ही विकल्प चुनिए।`,
    `कौन-सा विकल्प ${reference} वाले नियम से मेल खाता है?`,
    `${reference} को ध्यान से देखिए। उसी संबंध वाला विकल्प चुनिए।`,
    `दिए गए समूह ${reference} जैसा संख्या-संबंध किस विकल्प में है?`,
  ];
  const punjabi = [
    `ਦਿੱਤੇ ਸਮੂਹ ${reference} ਦਾ ਨਿਯਮ ਪਛਾਣੋ। ਕਿਹੜਾ ਵਿਕਲਪ ਉਸੇ ਨਿਯਮ ਉੱਤੇ ਚੱਲਦਾ ਹੈ?`,
    `${reference} ਵਿੱਚ ਸੰਖਿਆਵਾਂ ਦਾ ਆਪਸੀ ਸੰਬੰਧ ਵੇਖੋ ਅਤੇ ਉਹੋ ਜਿਹਾ ਵਿਕਲਪ ਚੁਣੋ।`,
    `ਕਿਹੜਾ ਵਿਕਲਪ ${reference} ਵਾਲੇ ਨਿਯਮ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ?`,
    `${reference} ਨੂੰ ਧਿਆਨ ਨਾਲ ਵੇਖੋ। ਉਸੇ ਸੰਬੰਧ ਵਾਲਾ ਵਿਕਲਪ ਚੁਣੋ।`,
    `ਦਿੱਤੇ ਸਮੂਹ ${reference} ਵਰਗਾ ਸੰਖਿਆ-ਸੰਬੰਧ ਕਿਸ ਵਿਕਲਪ ਵਿੱਚ ਹੈ?`,
  ];
  return (locale === "hi-IN" ? hindi : punjabi)[variant]!;
}

function localizedStatus(
  locale: ClsCp005TranslatedLocale,
  referenceTask: boolean,
  matches: boolean,
): string {
  if (locale === "hi-IN") {
    if (referenceTask) {
      return matches
        ? "✅ दिए गए नियम से मेल खाता है।"
        : "❌ दिए गए नियम से मेल नहीं खाता।";
    }
    return matches ? "✅ यही नियम लागू होता है।" : "❌ नियम अलग है।";
  }
  if (referenceTask) {
    return matches
      ? "✅ ਦਿੱਤੇ ਨਿਯਮ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ।"
      : "❌ ਦਿੱਤੇ ਨਿਯਮ ਨਾਲ ਮੇਲ ਨਹੀਂ ਖਾਂਦਾ।";
  }
  return matches ? "✅ ਇਹੀ ਨਿਯਮ ਲਾਗੂ ਹੁੰਦਾ ਹੈ।" : "❌ ਨਿਯਮ ਵੱਖਰਾ ਹੈ।";
}

function localizedEvidence(
  question: GeneratedClsCp005EnglishQuestion,
  locale: ClsCp005TranslatedLocale,
): readonly string[] {
  const localizedRuleText = ruleText(question.intendedRuleId, locale);
  const referenceTask = question.qlId === CLS_CP005_EQUIVALENT_TUPLE_QL_ID;

  return question.evidenceByOption.map((englishEvidence, index) => {
    const matches = referenceTask
      ? index === question.correctIndex
      : index !== question.correctIndex;
    const math = extractInlineMath(englishEvidence);
    if (math.length === 0) {
      throw new Error(`${question.qlId}/${question.seed}/${index} has no canonical MathJax evidence`);
    }
    const reason = matches ? localizedRuleText.match : localizedRuleText.fail;
    return `${question.options[index]}: ${reason} ${math.join(" ")} — ${localizedStatus(locale, referenceTask, matches)}`;
  });
}

function localizedSteps(
  question: GeneratedClsCp005EnglishQuestion,
  locale: ClsCp005TranslatedLocale,
): readonly string[] {
  if (question.qlId === CLS_CP005_ODD_TUPLE_QL_ID) {
    const common = formatList(
      question.options.filter((_, index) => index !== question.correctIndex),
      locale,
    );
    if (locale === "hi-IN") {
      return [
        "एक ही नियम को हर विकल्प पर लगाइए।",
        `${common} उस नियम पर सही बैठते हैं, लेकिन ${question.answer} नहीं बैठता।`,
        `इसलिए ${question.answer} अलग विकल्प है।`,
      ];
    }
    return [
      "ਇੱਕੋ ਨਿਯਮ ਹਰ ਵਿਕਲਪ ਉੱਤੇ ਲਗਾਓ।",
      `${common} ਉਸ ਨਿਯਮ ਉੱਤੇ ਠੀਕ ਬੈਠਦੇ ਹਨ, ਪਰ ${question.answer} ਨਹੀਂ ਬੈਠਦਾ।`,
      `ਇਸ ਲਈ ${question.answer} ਵੱਖਰਾ ਵਿਕਲਪ ਹੈ।`,
    ];
  }

  const reference = question.referenceTuple
    ? tupleDisplay(question.referenceTuple)
    : (() => { throw new Error("CLS-QL-009 localisation requires a reference tuple"); })();
  if (locale === "hi-IN") {
    return [
      `पहले दिए गए समूह ${reference} का नियम पहचानिए।`,
      `विकल्पों में केवल ${question.answer} उसी नियम से मेल खाता है।`,
      `इसलिए ${question.answer} चुना जाएगा।`,
    ];
  }
  return [
    `ਪਹਿਲਾਂ ਦਿੱਤੇ ਸਮੂਹ ${reference} ਦਾ ਨਿਯਮ ਪਛਾਣੋ।`,
    `ਵਿਕਲਪਾਂ ਵਿੱਚ ਸਿਰਫ਼ ${question.answer} ਉਸੇ ਨਿਯਮ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ।`,
    `ਇਸ ਲਈ ${question.answer} ਚੁਣਿਆ ਜਾਵੇਗਾ।`,
  ];
}

export function localizeClsCp005Question(
  question: GeneratedClsCp005EnglishQuestion,
  locale: ClsCp005TranslatedLocale,
): GeneratedClsCp005LocalizedQuestion {
  if (
    question.qlId !== CLS_CP005_ODD_TUPLE_QL_ID
    && question.qlId !== CLS_CP005_EQUIVALENT_TUPLE_QL_ID
  ) {
    throw new Error(`Unsupported CLS-CP-005 QL for localisation: ${question.qlId}`);
  }

  const localizedRuleText = ruleText(question.intendedRuleId, locale);
  const canonicalRuntimeVersion = question.metadata.runtimeVersion;

  return {
    ...question,
    stem: localizedStem(question, locale),
    evidenceByOption: localizedEvidence(question, locale),
    explanation: {
      coreConcept: [localizedRuleText.statement],
      stepByStep: localizedSteps(question, locale),
      examSpeedShortcut: [localizedRuleText.shortcut],
      commonTrapWarning: [localizedRuleText.trap],
    },
    metadata: {
      ...question.metadata,
      locale,
      runtimeVersion: "cls-cp005-multilingual-runtime-v1",
      canonicalRuntimeVersion,
      canonicalLocale: "en-IN",
      localizationVersion: "cls-cp005-hi-pa-localization-v1",
      localizationStatus: "EXECUTABLE_REVIEW_REQUIRED",
    },
    lifecycle: {
      ...question.lifecycle,
      reviewStatus: "LOCALIZED_REVIEW_REQUIRED",
    },
  };
}
