import type {
  CanonicalConclusion,
  CanonicalModel,
  SurfacePremise,
  SylLocale,
  TermId,
} from "../foundation/types";
import type { SylOptionReasonCodeV3, SylStructuredProofV3 } from "./structured-proof-v3-types";
import type { GeneratedSylQuestionV3 } from "./structured-proof-v3-types";
import type { SylTaskKind } from "./types";

export const SYL_LEARNER_V4_AUTHORITY = "SYL_001_LEARNER_EXPLANATION_V4" as const;

export type SylLearnerExplanationModeV4 =
  | "DIRECT_CHAIN"
  | "WITNESS_TRANSFER"
  | "DIRECT_CONTRADICTION"
  | "POSSIBLE_NOT_DEFINITE"
  | "COUNTEREXAMPLE"
  | "POSSIBILITY_MODEL"
  | "DUAL_MODEL"
  | "CONCLUSION_MASK"
  | "EITHER_OR";

export type SylLearnerOptionVerdictV4 =
  | "IMPOSSIBLE"
  | "POSSIBLE_NOT_DEFINITE"
  | "NOT_PROVED"
  | "WRONG_DIRECTION"
  | "WRONG_MASK"
  | "INVALID_PAIR"
  | "NOT_REQUESTED"
  | "OTHER";

export type SylVennDiagramModeV4 =
  | "VENN_CONTAINMENT"
  | "VENN_SEPARATION"
  | "VENN_OVERLAP"
  | "VENN_SUBJECT_ONLY_WITNESS"
  | "VENN_ONLY_A_FEW"
  | "VENN_UNIVERSAL_CHAIN"
  | "VENN_WITNESS_TRANSFER"
  | "VENN_IMPOSSIBLE"
  | "VENN_COUNTEREXAMPLE"
  | "VENN_POSSIBILITY"
  | "VENN_DUAL_MODEL"
  | "VENN_EITHER_OR"
  | "OMITTED_NOT_USEFUL";

export type SylDiagramOmissionReasonV4 =
  | "CONCLUSION_MASK_CLEAR_WITHOUT_DIAGRAM"
  | "MORE_THAN_THREE_TERMS"
  | "NO_STABLE_SIMPLE_VENN"
  | null;

export interface SylLearnerAnswerV4 {
  displayIndex: number;
  text: string;
  label: string;
}

export interface SylLearnerConclusionResultV4 {
  displayIndex: number;
  label: string;
  text: string;
  follows: boolean;
  shortReason: string | null;
}

export interface SylLearnerExplanationV4 {
  mode: SylLearnerExplanationModeV4;
  shortReasoning: readonly string[];
  conclusion: string;
  conclusionResults: readonly SylLearnerConclusionResultV4[];
  showDiagram: boolean;
  showShortcut: boolean;
  shortcut: string | null;
  showOptionAnalysisCollapsed: true;
  existenceNote: string | null;
  wordCount: number;
}

export interface SylLearnerOptionAnalysisV4 {
  displayIndex: number;
  text: string;
  verdict: SylLearnerOptionVerdictV4;
  verdictLabel: string;
  studentReason: string;
}

export interface SylLearnerDiagramV4 {
  enabled: boolean;
  mode: SylVennDiagramModeV4;
  omissionReason: SylDiagramOmissionReasonV4;
  svg: string | null;
  caption: string | null;
  accessibleDescription: string | null;
  semanticSignature: string;
  modelSignature: string | null;
  answerSentenceEmbedded: false;
  mobileViewBoxWidth: 360;
  diagramCount: 0 | 1;
}

export interface SylAdministratorProofV4 {
  hiddenByDefault: true;
  structuredProofAuthority: SylStructuredProofV3["authority"];
  identity: SylStructuredProofV3["identity"];
  sourcePatternId: string;
  scenarioId: string;
  taskKind: SylTaskKind;
  existencePolicy: SylStructuredProofV3["existencePolicy"];
  validationEvidence: SylStructuredProofV3["validationEvidence"];
  humanReview: SylStructuredProofV3["humanReview"];
  normalizedPremises: readonly SurfacePremise[];
  canonicalConclusions: readonly CanonicalConclusion[];
  premiseIds: readonly string[];
  reasonCodes: readonly SylOptionReasonCodeV3[];
  proofModel: CanonicalModel | null;
  counterModel: CanonicalModel | null;
  alternateModel: CanonicalModel | null;
  termOrder: readonly TermId[];
  diagramSpecification: {
    v3: SylStructuredProofV3["diagramSpec"];
    v4Mode: SylVennDiagramModeV4;
  };
  nativeEditorialStatus: "NOT_RUN";
}

export interface SylLearnerLifecycleV4 {
  reviewStatus: "REVISE";
  public: false;
  questionStudioEnabled: false;
  questionBankStatus: "NOT_STORED";
  testEligibility: "INELIGIBLE";
}

export interface SylLearnerPresentationV4 {
  authority: typeof SYL_LEARNER_V4_AUTHORITY;
  schemaVersion: "syl-learner-v4";
  locale: SylLocale;
  answer: SylLearnerAnswerV4;
  learnerExplanation: SylLearnerExplanationV4;
  optionAnalysis: readonly SylLearnerOptionAnalysisV4[];
  diagram: SylLearnerDiagramV4;
  administratorProof: SylAdministratorProofV4;
  lifecycle: SylLearnerLifecycleV4;
}

export type GeneratedSylQuestionV4 = GeneratedSylQuestionV3 & {
  learnerPresentationV4: SylLearnerPresentationV4;
};

export interface SylLearnerBuildInputV4 {
  qlId: string;
  sourcePatternId: string;
  scenarioId: string;
  locale: SylLocale;
  taskKind: SylTaskKind;
  displayedPremises: readonly SurfacePremise[];
  statements: readonly string[];
  conclusions: readonly string[];
  canonicalConclusions: readonly CanonicalConclusion[];
  termLabels: Readonly<Record<TermId, string>>;
  correctIndex: number;
  options: GeneratedSylQuestionV3["options"];
  reviewLogic: GeneratedSylQuestionV3["reviewLogic"];
  structuredPrompt: GeneratedSylQuestionV3["structuredPrompt"];
}
