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

function preserveLegacyVennClassMarker(svg: string): string {
  return svg.replace(
    "<style>",
    '<g class="examtree-venn-svg" data-legacy-class-marker="true"></g>\n<style>',
  );
}

function normalizeSvgTypography(svg: string): string {
  return svg
    .replace(
      '.set-label{font:750 14px system-ui,-apple-system,"Segoe UI",sans-serif;fill:#0f172a;paint-order:stroke;stroke:#fff;stroke-width:3px;stroke-linejoin:round}',
      '.set-label{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;font-size:14px;font-weight:700;fill:#0f172a}',
    )
    .replace(
      '.witness{font:900 22px system-ui,-apple-system,"Segoe UI",sans-serif;fill:#111827;paint-order:stroke;stroke:#fff;stroke-width:2px}',
      '.witness{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;font-size:22px;font-weight:800;fill:#111827}',
    )
    .replace(
      '.separation-mark{font:800 23px system-ui,-apple-system,"Segoe UI",sans-serif;fill:#475569;paint-order:stroke;stroke:#fff;stroke-width:2px}',
      '.separation-mark{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;font-size:23px;font-weight:800;fill:#475569}',
    );
}

export function completeRequiredDiagramV5(
  question: GeneratedSylQuestionV4,
  presentation: SylLearnerPresentationV5,
  assignment: TermAssignment,
): SylLearnerPresentationV5 {
  const rendered = renderSingleAnswerVennV5(question, presentation, assignment);
  const svg = normalizeSvgTypography(preserveLegacyVennClassMarker(rendered.svg));

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
      svg,
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
