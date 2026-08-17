import type { Mal001LocalizedLanguage } from "./chapter-multilingual-question-studio-v1";
import { applyMal001QuestionStudioLocalizationV4 } from "./chapter-multilingual-question-studio-v4";

export const MAL_001_MULTILINGUAL_QUESTION_STUDIO_V5 = Object.freeze({
  localizationId: "MAL-001-HI-PA-QUESTION-STUDIO-V5-COMPOUND-LABEL-CLEANUP",
  scope: "SHARED_EXPLANATION_VERBS_PLUS_CP001_LEARNER_LABELS",
  preservesV4Trace: true,
});

type Replacement = readonly [RegExp, string];

const SHARED_EXPLANATION_REPLACEMENTS: Record<
  Mal001LocalizedLanguage,
  readonly Replacement[]
> = {
  hi: [
    [/\bCollect\b/gu, "पदों को एकत्र करें"],
    [/\bExpand\b/gu, "विस्तार करें"],
  ],
  pa: [
    [/\bCollect\b/gu, "ਪਦ ਇਕੱਠੇ ਕਰੋ"],
    [/\bExpand\b/gu, "ਵਿਸਥਾਰ ਕਰੋ"],
  ],
};

const CP001_LABEL_REPLACEMENTS: Record<
  Mal001LocalizedLanguage,
  readonly Replacement[]
> = {
  hi: [
    [/standard-grade/giu, "मानक-ग्रेड"],
    [/premium-grade/giu, "प्रीमियम-ग्रेड"],
    [/special-grade/giu, "विशेष-ग्रेड"],
    [/house-blend/giu, "हाउस-मिश्रण"],
    [/cold-pressed/giu, "कोल्ड-प्रेस्ड"],
    [/high-grade/giu, "उच्च-ग्रेड"],
    [/\btea leaves\b/giu, "चाय की पत्तियाँ"],
    [/\bcoffee beans\b/giu, "कॉफी के दाने"],
    [/\bedible oil\b/giu, "खाद्य तेल"],
    [/\breserve\b/giu, "रिज़र्व"],
    [/\bestate\b/giu, "एस्टेट"],
    [/\bselect\b/giu, "चुना हुआ"],
    [/\bstandard\b/giu, "मानक"],
    [/\bpremium\b/giu, "प्रीमियम"],
    [/\bregular\b/giu, "सामान्य"],
    [/\bspecial\b/giu, "विशेष"],
    [/\btea\b/giu, "चाय"],
    [/\bleaves\b/giu, "पत्तियाँ"],
    [/\bcoffee\b/giu, "कॉफी"],
    [/\bbeans\b/giu, "दाने"],
    [/\bedible\b/giu, "खाद्य"],
    [/\boil\b/giu, "तेल"],
    [/\brice\b/giu, "चावल"],
    [/\bwheat\b/giu, "गेहूँ"],
  ],
  pa: [
    [/standard-grade/giu, "ਮਿਆਰੀ-ਗ੍ਰੇਡ"],
    [/premium-grade/giu, "ਪ੍ਰੀਮੀਅਮ-ਗ੍ਰੇਡ"],
    [/special-grade/giu, "ਖਾਸ-ਗ੍ਰੇਡ"],
    [/house-blend/giu, "ਹਾਊਸ-ਮਿਸ਼ਰਣ"],
    [/cold-pressed/giu, "ਕੋਲਡ-ਪ੍ਰੈੱਸਡ"],
    [/high-grade/giu, "ਉੱਚ-ਗ੍ਰੇਡ"],
    [/\btea leaves\b/giu, "ਚਾਹ ਦੀਆਂ ਪੱਤੀਆਂ"],
    [/\bcoffee beans\b/giu, "ਕੌਫੀ ਦੇ ਦਾਣੇ"],
    [/\bedible oil\b/giu, "ਖਾਣਯੋਗ ਤੇਲ"],
    [/\breserve\b/giu, "ਰਿਜ਼ਰਵ"],
    [/\bestate\b/giu, "ਐਸਟੇਟ"],
    [/\bselect\b/giu, "ਚੁਣਿਆ ਹੋਇਆ"],
    [/\bstandard\b/giu, "ਮਿਆਰੀ"],
    [/\bpremium\b/giu, "ਪ੍ਰੀਮੀਅਮ"],
    [/\bregular\b/giu, "ਸਧਾਰਣ"],
    [/\bspecial\b/giu, "ਖਾਸ"],
    [/\btea\b/giu, "ਚਾਹ"],
    [/\bleaves\b/giu, "ਪੱਤੀਆਂ"],
    [/\bcoffee\b/giu, "ਕੌਫੀ"],
    [/\bbeans\b/giu, "ਦਾਣੇ"],
    [/\bedible\b/giu, "ਖਾਣਯੋਗ"],
    [/\boil\b/giu, "ਤੇਲ"],
    [/\brice\b/giu, "ਚੌਲ"],
    [/\bwheat\b/giu, "ਕਣਕ"],
  ],
};

function replaceText(
  value: unknown,
  language: Mal001LocalizedLanguage,
  replacements: readonly Replacement[],
): unknown {
  if (typeof value === "string") {
    return replacements.reduce(
      (text, [pattern, replacement]) => text.replace(pattern, replacement),
      value,
    );
  }
  if (Array.isArray(value)) {
    return value.map((entry) => replaceText(entry, language, replacements));
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, entry]) => [
        key,
        replaceText(entry, language, replacements),
      ]),
    );
  }
  return value;
}

function cleanLearnerFields<T extends Record<string, any>>(
  question: T,
  language: Mal001LocalizedLanguage,
  replacements: readonly Replacement[],
): T {
  return {
    ...question,
    stem: replaceText(question.stem, language, replacements),
    options: replaceText(question.options, language, replacements),
    answer: replaceText(question.answer, language, replacements),
    explanation: replaceText(question.explanation, language, replacements),
    reasoningGraph: question.reasoningGraph
      ? {
          ...question.reasoningGraph,
          nodes: Array.isArray(question.reasoningGraph.nodes)
            ? question.reasoningGraph.nodes.map((node: Record<string, any>) => ({
                ...node,
                text: replaceText(node.text, language, replacements),
              }))
            : question.reasoningGraph.nodes,
        }
      : question.reasoningGraph,
  } as T;
}

export function applyMal001QuestionStudioLocalizationV5<
  T extends Record<string, any>,
>(question: T, language: Mal001LocalizedLanguage): T {
  let localized = applyMal001QuestionStudioLocalizationV4(
    question,
    language,
  ) as T;

  localized = cleanLearnerFields(
    localized,
    language,
    SHARED_EXPLANATION_REPLACEMENTS[language],
  );

  const number = Number(
    /^MAL-QL-(\d{3})$/u.exec(String(question.questionLanguageId ?? ""))?.[1] ?? 0,
  );
  if (number < 1 || number > 11) return localized;

  const withLabels = cleanLearnerFields(
    localized,
    language,
    CP001_LABEL_REPLACEMENTS[language],
  );

  return {
    ...withLabels,
    traceability: {
      ...(withLabels.traceability ?? {}),
      cp001CompoundLabelCleanupId:
        MAL_001_MULTILINGUAL_QUESTION_STUDIO_V5.localizationId,
    },
  } as T;
}
