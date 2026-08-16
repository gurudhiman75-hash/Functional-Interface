import {
  applyMal001QuestionStudioLocalization,
  localizeMal001Text,
  type Mal001LocalizedLanguage,
} from "./chapter-multilingual-question-studio-v1";

export const MAL_001_MULTILINGUAL_QUESTION_STUDIO_V2 = Object.freeze({
  localizationId: "MAL-001-HI-PA-QUESTION-STUDIO-V2",
  preservesRuntimeMetadata: true,
  mathematicalAuthorityLanguage: "en" as const,
});

function localizeOptionalHelp(value: unknown, language: Mal001LocalizedLanguage): unknown {
  if (typeof value === "string") return localizeMal001Text(value, language);
  if (Array.isArray(value)) return value.map((entry) => localizeOptionalHelp(entry, language));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, entry]) => [
        key,
        localizeOptionalHelp(entry, language),
      ]),
    );
  }
  return value;
}

function localizeExplanation(explanation: any, language: Mal001LocalizedLanguage): any {
  if (!explanation || typeof explanation !== "object") return explanation;
  return {
    ...explanation,
    lines: Array.isArray(explanation.lines)
      ? explanation.lines.map((line: unknown) => localizeMal001Text(String(line ?? ""), language))
      : explanation.lines,
    visibleLines: Array.isArray(explanation.visibleLines)
      ? explanation.visibleLines.map((line: unknown) => localizeMal001Text(String(line ?? ""), language))
      : explanation.visibleLines,
    answerLine:
      typeof explanation.answerLine === "string"
        ? localizeMal001Text(explanation.answerLine, language)
        : explanation.answerLine,
    optionalHelp: explanation.optionalHelp
      ? localizeOptionalHelp(explanation.optionalHelp, language)
      : explanation.optionalHelp,
  };
}

function localizeReasoningGraph(reasoningGraph: any, language: Mal001LocalizedLanguage): any {
  if (!reasoningGraph || !Array.isArray(reasoningGraph.nodes)) return reasoningGraph;
  return {
    ...reasoningGraph,
    nodes: reasoningGraph.nodes.map((node: Record<string, any>) => ({
      ...node,
      text:
        typeof node.text === "string"
          ? localizeMal001Text(node.text, language)
          : node.text,
    })),
  };
}

export function applyMal001QuestionStudioLocalizationV2<T extends Record<string, any>>(
  question: T,
  language: Mal001LocalizedLanguage,
): T {
  const localized = applyMal001QuestionStudioLocalization(
    {
      ...question,
      explanation: undefined,
      reasoningGraph: undefined,
    },
    language,
  ) as T;

  return {
    ...localized,
    explanation: localizeExplanation(question.explanation, language),
    reasoningGraph: localizeReasoningGraph(question.reasoningGraph, language),
    traceability: {
      ...(localized.traceability ?? {}),
      localizationId: MAL_001_MULTILINGUAL_QUESTION_STUDIO_V2.localizationId,
      runtimeMetadataPreserved: true,
    },
  } as T;
}
