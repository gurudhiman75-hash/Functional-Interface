import type { GeneratedSylQuestionV4 } from "./learner-v4-types";
import type { TermAssignment } from "./localization";
import { renderSingleAnswerVennV5 } from "./learner-v5-single-answer-venn";
import type {
  SylDiagramModeV5,
  SylLearnerPresentationV5,
} from "./learner-v5-types";

function vennMode(
  question: GeneratedSylQuestionV4,
  presentation: SylLearnerPresentationV5,
): SylDiagramModeV5 {
  if (
    question.metadata.pairStatus === "EITHER_OR"
    || question.metadata.pairStatus === "EITHER_OR_FOLLOWS"
  ) {
    return "VENN_EITHER_OR";
  }
  if (presentation.learnerExplanation.mode === "WITNESS_TRANSFER") {
    return "VENN_WITNESS_TRANSFER";
  }
  if (presentation.learnerExplanation.mode === "DIRECT_CONTRADICTION") {
    return "VENN_IMPOSSIBLE";
  }
  if (
    presentation.learnerExplanation.mode === "POSSIBILITY_MODEL"
    || presentation.learnerExplanation.mode === "POSSIBLE_NOT_DEFINITE"
    || presentation.learnerExplanation.mode === "DUAL_MODEL"
  ) {
    return "VENN_POSSIBILITY";
  }
  if (presentation.learnerExplanation.mode === "COUNTEREXAMPLE") {
    return "VENN_COUNTEREXAMPLE";
  }
  return "VENN_FOCUSED_CONCLUSION_CHECK";
}

export function completeRequiredDiagramV5(
  question: GeneratedSylQuestionV4,
  presentation: SylLearnerPresentationV5,
  assignment: TermAssignment,
): SylLearnerPresentationV5 {
  const rendered = renderSingleAnswerVennV5(question, presentation, assignment);

  return {
    ...presentation,
    learnerExplanation: {
      ...presentation.learnerExplanation,
      showDiagram: true,
    },
    diagram: {
      enabled: true,
      mode: vennMode(question, presentation),
      omissionReason: null,
      svg: rendered.svg,
      caption: rendered.caption,
      accessibleDescription: rendered.accessibleDescription,
      semanticSignature: rendered.semanticSignature,
      modelSignature: rendered.modelSignature ?? presentation.diagram.modelSignature,
      answerSentenceEmbedded: false,
      mobileViewBoxWidth: 360,
      diagramCount: 1,
    },
  };
}
