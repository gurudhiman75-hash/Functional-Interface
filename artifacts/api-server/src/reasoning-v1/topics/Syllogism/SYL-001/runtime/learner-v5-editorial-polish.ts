import type { InternalConclusionClass } from "../foundation/types";
import type { GeneratedSylQuestionV4 } from "./learner-v4-types";
import type {
  SylLearnerConclusionResultV5,
  SylLearnerPresentationV5,
} from "./learner-v5-types";

const MASK_OR_PAIR_TASKS = new Set([
  "TWO_CONCLUSION_FOLLOW_MASK",
  "THREE_CONCLUSION_FOLLOW_MASK",
  "ONLY_TWO_CONCLUSION_MASK",
  "FEW_TWO_CONCLUSION_MASK",
  "MIXED_TWO_CONCLUSION_MASK",
  "MIXED_THREE_CONCLUSION_MASK",
  "TWO_CONCLUSION_EITHER_OR",
  "CLASSIFY_CONCLUSION_PAIR",
]);

function clean(value: string): string {
  return value
    .trim()
    .replace(/\s+/gu, " ")
    .replace(/([.!?।])([”"])([.!?।])/gu, "$2$3")
    .replace(/([.!?।])\1+/gu, "$1");
}

function withoutTerminal(value: string): string {
  return clean(value).replace(/[.!?।]+$/u, "");
}

function premiseStatements(
  question: GeneratedSylQuestionV4,
  premiseIds: readonly string[],
): string {
  const ids = new Set(premiseIds);
  const selected = question.structuredProofV3.statementMeanings
    .filter((entry) => ids.has(entry.premiseId))
    .map((entry) => clean(entry.statement));
  const fallback = question.structuredProofV3.statementMeanings
    .filter((entry) => question.structuredProofV3.combinedReasoning.decisivePremiseIds.includes(entry.premiseId))
    .map((entry) => clean(entry.statement));
  return [...new Set(selected.length > 0 ? selected : fallback)].slice(0, 3).join(" ");
}

function reasonFor(
  question: GeneratedSylQuestionV4,
  index: number,
  classification: InternalConclusionClass,
): string {
  const evaluation = question.reviewLogic.conclusionEvaluations[index];
  const conclusion = withoutTerminal(question.conclusions[index] ?? evaluation?.conclusionId ?? `Conclusion ${index + 1}`);
  const statements = premiseStatements(
    question,
    evaluation?.verdictImpactPremiseIds ?? question.structuredProofV3.combinedReasoning.decisivePremiseIds,
  ) || question.statements.slice(0, 3).map(clean).join(" ");

  if (question.locale === "hi-IN") {
    if (classification === "ENTAILED") return `${statements} ये कथन मिलकर “${conclusion}” को निश्चित करते हैं।`;
    if (classification === "CONTRADICTED") return `${statements} ये कथन मिलकर “${conclusion}” को असंभव बनाते हैं।`;
    return `कथन “${conclusion}” को न तो निश्चित करते हैं और न ही असंभव बनाते हैं।`;
  }
  if (question.locale === "pa-IN") {
    if (classification === "ENTAILED") return `${statements} ਇਹ ਕਥਨ ਮਿਲ ਕੇ “${conclusion}” ਨੂੰ ਨਿਸ਼ਚਿਤ ਕਰਦੇ ਹਨ।`;
    if (classification === "CONTRADICTED") return `${statements} ਇਹ ਕਥਨ ਮਿਲ ਕੇ “${conclusion}” ਨੂੰ ਅਸੰਭਵ ਬਣਾਉਂਦੇ ਹਨ।`;
    return `ਕਥਨ “${conclusion}” ਨੂੰ ਨਾ ਨਿਸ਼ਚਿਤ ਕਰਦੇ ਹਨ ਅਤੇ ਨਾ ਹੀ ਅਸੰਭਵ ਬਣਾਉਂਦੇ ਹਨ।`;
  }
  if (classification === "ENTAILED") return `${statements} Together, these statements force “${conclusion}”.`;
  if (classification === "CONTRADICTED") return `${statements} Together, these statements rule out “${conclusion}”.`;
  return `The statements neither force nor rule out “${conclusion}”.`;
}

function countWords(values: readonly string[]): number {
  return values.join(" ").trim().split(/\s+/u).filter(Boolean).length;
}

export function polishLearnerPresentationV5(
  question: GeneratedSylQuestionV4,
  presentation: SylLearnerPresentationV5,
): SylLearnerPresentationV5 {
  const conclusionResults: readonly SylLearnerConclusionResultV5[] = presentation.learnerExplanation.conclusionResults
    .map((result, index) => ({
      ...result,
      text: clean(result.text),
      shortReason: clean(reasonFor(question, index, result.status)),
    }));

  const previousReasoning = presentation.learnerExplanation.shortReasoning.map(clean);
  const shortReasoning = MASK_OR_PAIR_TASKS.has(question.metadata.taskKind)
    ? [
      ...conclusionResults.map((result) => `${result.label}: ${result.shortReason}`),
      ...previousReasoning.slice(conclusionResults.length),
    ]
    : previousReasoning;
  const conclusion = clean(presentation.learnerExplanation.conclusion);
  const existenceNote = presentation.learnerExplanation.existenceNote
    ? clean(presentation.learnerExplanation.existenceNote)
    : null;
  const wordCount = countWords([
    ...shortReasoning,
    conclusion,
    ...conclusionResults.map((result) => result.shortReason),
    existenceNote ?? "",
  ]);

  return {
    ...presentation,
    learnerExplanation: {
      ...presentation.learnerExplanation,
      shortReasoning,
      conclusion,
      conclusionResults,
      existenceNote,
      wordCount,
    },
    optionAnalysis: presentation.optionAnalysis.map((option) => ({
      ...option,
      verdictLabel: clean(option.verdictLabel),
      studentReason: clean(option.studentReason),
    })),
    diagram: {
      ...presentation.diagram,
      caption: presentation.diagram.caption ? clean(presentation.diagram.caption) : null,
      accessibleDescription: presentation.diagram.accessibleDescription
        ? clean(presentation.diagram.accessibleDescription)
        : null,
    },
  };
}
