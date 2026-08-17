import type { Mal001LocalizedLanguage } from "./chapter-multilingual-question-studio-v1";
import {
  MAL_001_MULTILINGUAL_QUESTION_STUDIO_V6 as MAL_001_MULTILINGUAL_QUESTION_STUDIO_V6_BASE,
  applyMal001QuestionStudioLocalizationV6 as applyMal001QuestionStudioLocalizationV6Base,
} from "./chapter-multilingual-question-studio-v6-base";

export const MAL_001_MULTILINGUAL_QUESTION_STUDIO_V6 = Object.freeze({
  ...MAL_001_MULTILINGUAL_QUESTION_STUDIO_V6_BASE,
  finalCleanupId: "MAL-001-HI-PA-V6-FINAL-SEVEN-TOKEN-CLEANUP",
});

function cleanupString(
  value: string,
  language: Mal001LocalizedLanguage,
): string {
  const possessive = language === "hi" ? "का" : "ਦਾ";
  const repeated = language === "hi" ? "बार-बार" : "ਵਾਰ-ਵਾਰ";
  const ordinalSuffix = language === "hi" ? "वाँ" : "ਵਾਂ";
  const mixturePossessive = language === "hi" ? "मिश्रण का" : "ਮਿਸ਼ਰਣ ਦਾ";

  return value
    .replace(/\bmixture['’]s\b/giu, mixturePossessive)
    .replace(/\b([ABC])['’]s\b/gu, `$1 ${possessive}`)
    .replace(/\brepeated\b/giu, repeated)
    .replace(/\bI(?=\s*=)/gu, "Q_0")
    .replace(/\bx-(?=[\u0900-\u097F\u0A00-\u0A7F])/gu, "x ")
    .replace(/x-(?=\d)/gu, "x - ")
    .replace(/\bx-/gu, "x - ")
    .replace(/(\d+)th\b/gu, `$1${ordinalSuffix}`)
    .replace(/\b([A-Za-z])-th\b/gu, `$1-${ordinalSuffix}`)
    .replace(/\bth\b/gu, ordinalSuffix);
}

function cleanupValue(
  value: unknown,
  language: Mal001LocalizedLanguage,
): unknown {
  if (typeof value === "string") return cleanupString(value, language);
  if (Array.isArray(value)) {
    return value.map((entry) => cleanupValue(entry, language));
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, entry]) => [
        key,
        cleanupValue(entry, language),
      ]),
    );
  }
  return value;
}

function cleanupLearnerFields<T extends Record<string, any>>(
  question: T,
  language: Mal001LocalizedLanguage,
): T {
  return {
    ...question,
    stem: cleanupValue(question.stem, language),
    options: cleanupValue(question.options, language),
    answer: cleanupValue(question.answer, language),
    explanation: cleanupValue(question.explanation, language),
    reasoningGraph: question.reasoningGraph
      ? {
          ...question.reasoningGraph,
          nodes: Array.isArray(question.reasoningGraph.nodes)
            ? question.reasoningGraph.nodes.map((node: Record<string, any>) => ({
                ...node,
                text: cleanupValue(node.text, language),
              }))
            : question.reasoningGraph.nodes,
        }
      : question.reasoningGraph,
  } as T;
}

export function applyMal001QuestionStudioLocalizationV6<
  T extends Record<string, any>,
>(question: T, language: Mal001LocalizedLanguage): T {
  const localized = applyMal001QuestionStudioLocalizationV6Base(
    question,
    language,
  ) as T;
  const cleaned = cleanupLearnerFields(localized, language);
  return {
    ...cleaned,
    traceability: {
      ...(cleaned.traceability ?? {}),
      residualFinalCleanupId:
        MAL_001_MULTILINGUAL_QUESTION_STUDIO_V6.finalCleanupId,
    },
  } as T;
}
