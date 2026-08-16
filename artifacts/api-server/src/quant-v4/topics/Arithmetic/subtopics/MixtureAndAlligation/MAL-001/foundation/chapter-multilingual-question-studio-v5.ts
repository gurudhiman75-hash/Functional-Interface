import type { Mal001LocalizedLanguage } from "./chapter-multilingual-question-studio-v1";
import { applyMal001QuestionStudioLocalizationV4 } from "./chapter-multilingual-question-studio-v4";

export const MAL_001_MULTILINGUAL_QUESTION_STUDIO_V5 = Object.freeze({
  localizationId: "MAL-001-HI-PA-QUESTION-STUDIO-V5-COMPOUND-LABEL-CLEANUP",
  scope: "CP001_LEARNER_LABELS_ONLY",
  preservesV4Trace: true,
});

type Replacement = readonly [RegExp, string];

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

function replaceCp001Labels(
  value: unknown,
  language: Mal001LocalizedLanguage,
): unknown {
  if (typeof value === "string") {
    return CP001_LABEL_REPLACEMENTS[language].reduce(
      (text, [pattern, replacement]) => text.replace(pattern, replacement),
      value,
    );
  }
  if (Array.isArray(value)) {
    return value.map((entry) => replaceCp001Labels(entry, language));
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, entry]) => [
        key,
        replaceCp001Labels(entry, language),
      ]),
    );
  }
  return value;
}

export function applyMal001QuestionStudioLocalizationV5<
  T extends Record<string, any>,
>(question: T, language: Mal001LocalizedLanguage): T {
  const localized = applyMal001QuestionStudioLocalizationV4(
    question,
    language,
  ) as T;
  const number = Number(
    /^MAL-QL-(\d{3})$/u.exec(String(question.questionLanguageId ?? ""))?.[1] ?? 0,
  );
  if (number < 1 || number > 11) return localized;

  return {
    ...localized,
    stem: replaceCp001Labels(localized.stem, language),
    options: replaceCp001Labels(localized.options, language),
    answer: replaceCp001Labels(localized.answer, language),
    explanation: replaceCp001Labels(localized.explanation, language),
    reasoningGraph: localized.reasoningGraph
      ? {
          ...localized.reasoningGraph,
          nodes: Array.isArray(localized.reasoningGraph.nodes)
            ? localized.reasoningGraph.nodes.map((node: Record<string, any>) => ({
                ...node,
                text: replaceCp001Labels(node.text, language),
              }))
            : localized.reasoningGraph.nodes,
        }
      : localized.reasoningGraph,
    traceability: {
      ...(localized.traceability ?? {}),
      cp001CompoundLabelCleanupId:
        MAL_001_MULTILINGUAL_QUESTION_STUDIO_V5.localizationId,
    },
  } as T;
}
