import type { GeneratedSylQuestionV4 } from "./learner-v4-types";
import type { TermAssignment } from "./localization";
import {
  exactVennHasUnauthorisedContainmentDirectionV5,
} from "./learner-v5-directional-containment-safety";
import { renderExactVennV5 } from "./learner-v5-exact-venn";
import { exactVennAddsUnstatedStrongRelationV5 } from "./learner-v5-exact-venn-safety";
import {
  enforceExistentialCompletenessV5,
} from "./learner-v5-existential-completeness";
import {
  correctExactVennWitnessProofV5,
} from "./learner-v5-witness-proof";
import {
  finalizeWitnessClosureV5,
} from "./learner-v5-witness-closure-finalizer";
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

function omittedPresentation(
  presentation: SylLearnerPresentationV5,
  reason: "MORE_THAN_THREE_TERMS" | "NO_STABLE_SIMPLE_VENN",
  semanticSignature: string,
  modelSignature: string | null,
): SylLearnerPresentationV5 {
  return {
    ...presentation,
    learnerExplanation: {
      ...presentation.learnerExplanation,
      showDiagram: false,
    },
    diagram: {
      enabled: false,
      mode: "OMITTED_NOT_USEFUL",
      omissionReason: reason,
      svg: null,
      caption: null,
      accessibleDescription: null,
      semanticSignature,
      modelSignature: modelSignature ?? presentation.diagram.modelSignature,
      answerSentenceEmbedded: false,
      mobileViewBoxWidth: 340,
      diagramCount: 0,
    },
  };
}

export function completeRequiredDiagramV5(
  question: GeneratedSylQuestionV4,
  presentation: SylLearnerPresentationV5,
  assignment: TermAssignment,
): SylLearnerPresentationV5 {
  const initiallyRendered = renderExactVennV5(question, presentation, assignment);
  const proofCorrected = correctExactVennWitnessProofV5(
    question,
    presentation,
    initiallyRendered,
  );
  const existentialComplete = enforceExistentialCompletenessV5(
    question,
    presentation,
    proofCorrected,
  );
  const rendered = finalizeWitnessClosureV5(
    question,
    presentation,
    existentialComplete,
  );

  if (!rendered.enabled) {
    return omittedPresentation(
      presentation,
      rendered.omissionReason === "MORE_THAN_THREE_TERMS"
        ? "MORE_THAN_THREE_TERMS"
        : "NO_STABLE_SIMPLE_VENN",
      rendered.semanticSignature,
      rendered.modelSignature,
    );
  }

  if (
    !rendered.svg
    || exactVennAddsUnstatedStrongRelationV5(question, presentation, rendered.svg)
    || exactVennHasUnauthorisedContainmentDirectionV5(
      question,
      presentation,
      rendered.svg,
    )
  ) {
    return omittedPresentation(
      presentation,
      "NO_STABLE_SIMPLE_VENN",
      `syl-v5:exact-venn:omitted:unsafe-strong-relation:${question.qlId}:${question.seed}:${question.locale}`,
      rendered.modelSignature,
    );
  }

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
      mobileViewBoxWidth: 340,
      diagramCount: 1,
    },
  };
}
