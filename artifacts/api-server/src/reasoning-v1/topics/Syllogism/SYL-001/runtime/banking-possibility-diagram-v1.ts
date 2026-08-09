import type {
  CanonicalConclusion,
  SurfacePremise,
  SylLocale,
} from "../foundation/types";
import type { GeneratedSylQuestionV4 } from "./learner-v4-types";
import { completeRequiredDiagramV5 } from "./learner-v5-diagram-completion";
import type {
  SylLearnerExplanationModeV5,
  SylLearnerPresentationV5,
} from "./learner-v5-types";
import type { TermAssignment } from "./localization";
import type { EvaluatedConclusion } from "./types";
import type {
  BankingConclusionModeV1,
  BankingPossibilityConclusionV1,
} from "./banking-possibility-shell-v1";

export interface BankingPossibilityDiagramV1 {
  conclusionIndex: 0 | 1;
  conclusionLabel: "I" | "II";
  conclusionMode: BankingConclusionModeV1;
  explanationMode: SylLearnerExplanationModeV5;
  enabled: boolean;
  omissionReason: string | null;
  svg: string | null;
  caption: string | null;
  accessibleDescription: string | null;
  semanticSignature: string;
  modelSignature: string | null;
  mobileViewBoxWidth: 340;
}

function conclusionKey(conclusion: CanonicalConclusion): string {
  return `${conclusion.form}:${conclusion.subject}:${conclusion.predicate}`;
}

function explanationMode(
  selected: BankingPossibilityConclusionV1,
): SylLearnerExplanationModeV5 {
  if (selected.mode === "POSSIBILITY") {
    return selected.follows ? "POSSIBILITY_MODEL" : "DIRECT_CONTRADICTION";
  }
  if (selected.classification === "ENTAILED") return "DIRECT_CHAIN";
  if (selected.classification === "CONTRADICTED") return "DIRECT_CONTRADICTION";
  return "COUNTEREXAMPLE";
}

function adapterQuestion(
  seed: number,
  locale: SylLocale,
  premises: readonly SurfacePremise[],
  renderedStatements: readonly string[],
  selected: BankingPossibilityConclusionV1,
): GeneratedSylQuestionV4 {
  const semanticValue = conclusionKey(selected.canonicalConclusion);
  return {
    qlId: "SYL-PROTOTYPE-BANK-POSSIBILITY-001",
    seed,
    locale,
    statements: renderedStatements,
    conclusions: [selected.text],
    options: [{
      optionId: "DIAGRAM-TARGET",
      semanticValue,
      text: selected.text,
      isCorrect: true,
      errorLabel: null,
    }],
    correctIndex: 0,
    metadata: {
      pairStatus: null,
      taskKind: "CONCLUSION_COMBINATION",
    },
    structuredPrompt: {
      premises,
      conclusions: [selected.canonicalConclusion],
    },
  } as unknown as GeneratedSylQuestionV4;
}

function adapterPresentation(
  locale: SylLocale,
  selected: BankingPossibilityConclusionV1,
  mode: SylLearnerExplanationModeV5,
): SylLearnerPresentationV5 {
  return {
    authority: "SYL_001_EXAM_READINESS_REMEDIATION_V5",
    schemaVersion: "syl-learner-v5",
    locale,
    preTestDirection: "",
    answer: {
      displayIndex: 1,
      text: selected.text,
      label: "A",
    },
    learnerExplanation: {
      mode,
      shortReasoning: [],
      conclusion: selected.text,
      conclusionResults: [],
      showDiagram: true,
      showShortcut: false,
      shortcut: null,
      showOptionAnalysisCollapsed: true,
      existenceNote: null,
      wordCount: 0,
    },
    optionAnalysis: [],
    diagram: {
      enabled: false,
      mode: "OMITTED_NOT_USEFUL",
      omissionReason: "NO_STABLE_SIMPLE_VENN",
      svg: null,
      caption: null,
      accessibleDescription: null,
      semanticSignature: "syl-v5:bank-possibility:pending",
      modelSignature: null,
      answerSentenceEmbedded: false,
      mobileViewBoxWidth: 340,
      diagramCount: 0,
    },
    administratorProof: {} as never,
    lifecycle: {
      reviewStatus: "REVISE",
      public: false,
      questionStudioEnabled: false,
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
    },
    modelEvidence: {
      required: true,
      canonicalModelCount: 0,
      source: "NOT_REQUIRED",
    },
    remediationEvidence: {
      answerDerivedExplanationMode: true,
      answerDerivedDiagramMode: true,
      everyDisplayedConclusionExplained: true,
      logicalStatusSeparatedFromTaskDisposition: true,
      nonEmptyClassDirectionVisibleBeforeAttempt: true,
      unknownRelationsNeverRenderedAsProvedSeparation: true,
      nativeEnglishEditorialStatus: "PENDING",
      nativeHindiEditorialStatus: "PENDING",
      nativePunjabiEditorialStatus: "PENDING",
      humanViewportStatus: "PENDING",
      deadOptionRemediationStatus: "PENDING_SEPARATE_SOURCE_DECISION",
      mockWeightCalibrationStatus: "PENDING_SEPARATE_SOURCE_DECISION",
    },
  };
}

export function renderBankingPossibilityDiagramsV1(
  seed: number,
  locale: SylLocale,
  displayedPremises: readonly SurfacePremise[],
  renderedStatements: readonly string[],
  conclusions: readonly [BankingPossibilityConclusionV1, BankingPossibilityConclusionV1],
  assignment: TermAssignment,
): readonly [BankingPossibilityDiagramV1, BankingPossibilityDiagramV1] {
  return conclusions.map((selected, index) => {
    const mode = explanationMode(selected);
    const question = adapterQuestion(
      seed,
      locale,
      displayedPremises,
      renderedStatements,
      selected,
    );
    const presentation = adapterPresentation(locale, selected, mode);
    const rendered = completeRequiredDiagramV5(question, presentation, assignment).diagram;
    return {
      conclusionIndex: index as 0 | 1,
      conclusionLabel: index === 0 ? "I" : "II",
      conclusionMode: selected.mode,
      explanationMode: mode,
      enabled: rendered.enabled,
      omissionReason: rendered.omissionReason,
      svg: rendered.svg,
      caption: rendered.caption,
      accessibleDescription: rendered.accessibleDescription,
      semanticSignature: rendered.semanticSignature,
      modelSignature: rendered.modelSignature,
      mobileViewBoxWidth: 340,
    };
  }) as unknown as readonly [BankingPossibilityDiagramV1, BankingPossibilityDiagramV1];
}
