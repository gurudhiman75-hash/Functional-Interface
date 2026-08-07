import type {
  InternalConclusionClass,
  SylLocale,
} from "../foundation/types";
import {
  renderPedagogicalVennDiagram,
  type PedagogicalDiagramFocus,
} from "./diagram";
import type { GeneratedSylQuestionV4 } from "./learner-v4-types";
import type { TermAssignment } from "./localization";
import type {
  SylDiagramModeV5,
  SylLearnerPresentationV5,
} from "./learner-v5-types";

function conclusionLabel(locale: SylLocale, index: number): string {
  const numeral = ["I", "II", "III", "IV"][index] ?? String(index + 1);
  if (locale === "hi-IN") return `निष्कर्ष ${numeral}`;
  if (locale === "pa-IN") return `ਨਤੀਜਾ ${numeral}`;
  return `Conclusion ${numeral}`;
}

function buildFocus(
  question: GeneratedSylQuestionV4,
  presentation: SylLearnerPresentationV5,
): readonly PedagogicalDiagramFocus[] {
  return question.structuredPrompt.conclusions.map((conclusion, index) => {
    const result = presentation.learnerExplanation.conclusionResults[index];
    const evaluation = question.reviewLogic.conclusionEvaluations[index];
    const classification: InternalConclusionClass = result?.status
      ?? evaluation?.classification
      ?? "UNDETERMINED";

    return {
      label: result?.label ?? conclusionLabel(question.locale, index),
      conclusion,
      classification,
    };
  });
}

function fallbackMode(
  question: GeneratedSylQuestionV4,
  presentation: SylLearnerPresentationV5,
  focus: readonly PedagogicalDiagramFocus[],
): SylDiagramModeV5 {
  if (
    question.metadata.pairStatus === "EITHER_OR"
    || question.metadata.pairStatus === "EITHER_OR_FOLLOWS"
  ) {
    return "VENN_EITHER_OR";
  }
  if (focus.some((entry) => entry.classification === "UNDETERMINED")) {
    return focus.length > 1 ? "VENN_DUAL_MODEL" : "VENN_POSSIBILITY";
  }
  if (focus.some((entry) => entry.classification === "CONTRADICTED")) {
    return "VENN_IMPOSSIBLE";
  }
  if (presentation.learnerExplanation.mode === "WITNESS_TRANSFER") {
    return "VENN_WITNESS_TRANSFER";
  }
  return "VENN_FOCUSED_CONCLUSION_CHECK";
}

export function completeRequiredDiagramV5(
  question: GeneratedSylQuestionV4,
  presentation: SylLearnerPresentationV5,
  assignment: TermAssignment,
): SylLearnerPresentationV5 {
  if (
    presentation.diagram.enabled
    && presentation.diagram.svg
    && presentation.diagram.mode !== "RELATION_MAP"
  ) {
    return {
      ...presentation,
      learnerExplanation: {
        ...presentation.learnerExplanation,
        showDiagram: true,
      },
    };
  }

  const focus = buildFocus(question, presentation);
  const rendered = renderPedagogicalVennDiagram(
    question.structuredPrompt.premises,
    focus,
    question.metadata.pairStatus,
    question.locale,
    assignment,
    `${question.qlId}-${question.seed}-${question.locale}`.replace(/[^a-zA-Z0-9_-]/gu, "-"),
  );
  const mode = fallbackMode(question, presentation, focus);
  const classificationSignature = focus
    .map((entry) => entry.classification)
    .join(",") || "PREMISES_ONLY";

  return {
    ...presentation,
    learnerExplanation: {
      ...presentation.learnerExplanation,
      showDiagram: true,
    },
    diagram: {
      enabled: true,
      mode,
      omissionReason: null,
      svg: rendered.svg,
      caption: rendered.caption,
      accessibleDescription: `${rendered.title}. ${rendered.caption}`,
      semanticSignature: `syl-v5:focused-venn:${rendered.mode}:${classificationSignature}:${question.qlId}:${question.seed}:${question.locale}`,
      modelSignature: presentation.diagram.modelSignature,
      answerSentenceEmbedded: false,
      mobileViewBoxWidth: 360,
      diagramCount: 1,
    },
  };
}
