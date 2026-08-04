import type {
  CanonicalConclusion,
  CanonicalModel,
  InternalConclusionClass,
  SurfacePremise,
  SylLocale,
  TermId,
} from "../foundation/types";
import type {
  GeneratedSylQuestion,
  SylTaskKind,
} from "./types";

export const SYL_STRUCTURED_PROOF_AUTHORITY = "SYL_001_STRUCTURED_PROOF_PEDAGOGY_V3" as const;
export const SYL_EXISTENCE_POLICY = "INDIAN_EXAM_NON_EMPTY_TERMS_V1" as const;

export type SylSemanticStatusV3 =
  | InternalConclusionClass
  | "PREMISES_INCONSISTENT"
  | "NOT_APPLICABLE";

export type SylTaskStatusV3 =
  | "KEYED"
  | "NOT_KEYED"
  | "TRUE_BUT_NOT_REQUESTED"
  | "POSSIBLE_BUT_TASK_REQUIRES_CERTAINTY"
  | "NON_FOLLOWING_BUT_NOT_UNIQUE"
  | "MASK_MISMATCH"
  | "PAIR_CLASSIFICATION_MISMATCH";

export type SylStudentVerdictCodeV3 =
  | "CORRECT_DEFINITE"
  | "CORRECT_IMPOSSIBLE"
  | "CORRECT_POSSIBLE"
  | "CORRECT_NON_FOLLOWING"
  | "CORRECT_MATCH"
  | "WRONG_IMPOSSIBLE"
  | "WRONG_POSSIBLE_NOT_DEFINITE"
  | "WRONG_TRUE_NOT_REQUESTED"
  | "WRONG_MASK"
  | "WRONG_PAIR"
  | "WRONG_OTHER";

export type SylOptionReasonCodeV3 =
  | "DIRECT_CONTRADICTION"
  | "REVERSAL_ERROR"
  | "POSSIBILITY_MISTAKEN_FOR_CERTAINTY"
  | "CERTAINTY_NOT_REQUESTED"
  | "FORCED_WITNESS_TRANSFER"
  | "WITNESS_MISMATCH"
  | "ONLY_DIRECTION_ERROR"
  | "ONLY_A_FEW_TWO_FACTS"
  | "NOT_ALL_NORMALIZATION"
  | "VALID_COUNTERMODEL"
  | "VALID_SATISFYING_MODEL"
  | "IMPOSSIBLE_IN_ALL_MODELS"
  | "MASK_MISMATCH"
  | "EITHER_OR_NOT_EXCLUSIVE"
  | "EITHER_OR_NOT_EXHAUSTIVE"
  | "PAIR_CLASSIFICATION_MISMATCH"
  | "TASK_NOT_REQUESTED"
  | "COMPLETE_PROOF";

export type SylWitnessRelationV3 =
  | "SAME_WITNESS_REQUIRED"
  | "DISTINCT_WITNESSES_REQUIRED"
  | "MAY_BE_SAME_OR_DIFFERENT";

export type SylProofTypeV3 =
  | "FORCED_RELATION"
  | "WITNESS_TRANSFER"
  | "IMPOSSIBILITY_CONFLICT"
  | "COUNTERMODEL"
  | "SATISFYING_MODEL"
  | "TRUE_FALSE_MODELS"
  | "MASK_DERIVATION"
  | "EITHER_OR_EXACT_ONE";

export type SylIntegratedDiagramModeV3 =
  | "INTEGRATED_FORCED_RELATION_PROOF"
  | "INTEGRATED_IMPOSSIBILITY_PROOF"
  | "COMPLETE_COUNTERMODEL"
  | "COMPLETE_POSSIBILITY_MODEL"
  | "DUAL_TRUE_FALSE_MODEL"
  | "EITHER_OR_EXACT_ONE_PROOF"
  | "MASK_PROOF";

export interface SylExistencePolicyV3 {
  policyId: typeof SYL_EXISTENCE_POLICY;
  version: 1;
  visibleToStudent: true;
  studentDirection: string;
  authorityIds: readonly string[];
  dependentAnswer: boolean;
  dependentConclusionIds: readonly string[];
}

export interface SylStatementMeaningV3 {
  displayIndex: number;
  premiseId: string;
  statement: string;
  meaning: string;
  normalizedRelation: string;
}

export interface SylWitnessV3 {
  witnessId: string;
  sourcePremiseIds: readonly string[];
  memberOf: readonly TermId[];
  outsideOf: readonly TermId[];
  relation: SylWitnessRelationV3;
  studentDescription: string;
}

export interface SylReasoningStepV3 {
  stepIndex: number;
  premiseIds: readonly string[];
  witnessIds: readonly string[];
  text: string;
}

export interface SylCombinedReasoningV3 {
  decisivePremiseIds: readonly string[];
  witnesses: readonly SylWitnessV3[];
  reasoningSteps: readonly SylReasoningStepV3[];
  summary: string;
}

export interface SylVisibleOptionAnalysisV3 {
  displayIndex: number;
  optionId: string;
  text: string;
  semanticValue: string;
  semanticStatus: SylSemanticStatusV3;
  taskStatus: SylTaskStatusV3;
  studentVerdictCode: SylStudentVerdictCodeV3;
  studentVerdict: string;
  isCorrectForTask: boolean;
  premiseIdsUsed: readonly string[];
  witnessIdsUsed: readonly string[];
  reasonCode: SylOptionReasonCodeV3;
  studentReason: string;
}

export interface SylCorrectOptionProofV3 {
  displayIndex: number;
  optionId: string;
  text: string;
  proofType: SylProofTypeV3;
  premiseIdsUsed: readonly string[];
  witnessIdsUsed: readonly string[];
  reasoningSteps: readonly string[];
  studentProof: string;
  proofModel: CanonicalModel | null;
  counterModel: CanonicalModel | null;
}

export interface SylFastRuleV3 {
  symbolic: string;
  naturalLanguage: string;
  appliesToCurrentQuestion: true;
}

export interface SylDiagramSpecV3 {
  diagramCount: 1;
  mode: SylIntegratedDiagramModeV3;
  correctOptionOnly: true;
  allRelevantPremisesIncluded: true;
  relevantPremiseIds: readonly string[];
  correctOptionDisplayIndex: number;
  correctOptionText: string;
  conclusionIds: readonly string[];
  witnessIds: readonly string[];
  model: CanonicalModel | null;
  alternateModel: CanonicalModel | null;
  titleId: string;
  descriptionId: string;
  locale: SylLocale;
  diagramVersion: "syl-integrated-diagram-v3";
  textAlternative: string;
}

export interface SylValidationEvidenceV3 {
  validatorId: string;
  validatorVersion: number;
  status: "PASS" | "FAIL" | "NOT_RUN";
  scope: "AUTOMATED" | "HUMAN";
  contentHash: string;
  evidence: string;
}

export interface SylHumanReviewDecisionV3 {
  status: "REVISE";
  contentVersion: string;
  reviewer: null;
  reviewedAt: null;
  notes: readonly string[];
}

export interface SylIdentityV3 {
  logicContentId: string;
  localizedRecordId: string;
  reviewVersionId: string;
  questionId: string;
  questionLanguageId: string;
}

export interface SylStructuredProofV3 {
  authority: typeof SYL_STRUCTURED_PROOF_AUTHORITY;
  schemaVersion: "syl-structured-proof-v3";
  identity: SylIdentityV3;
  locale: SylLocale;
  taskKind: SylTaskKind;
  semanticProfileId: "INDIAN_COMPETITIVE_EXAM_SYLLOGISM_V1";
  existencePolicy: SylExistencePolicyV3;
  statementMeanings: readonly SylStatementMeaningV3[];
  combinedReasoning: SylCombinedReasoningV3;
  visibleOptionAnalysis: readonly SylVisibleOptionAnalysisV3[];
  correctOptionProof: SylCorrectOptionProofV3;
  fastRule: SylFastRuleV3;
  diagramSpec: SylDiagramSpecV3;
  integratedDiagramSvg: string;
  finalAnswer: string;
  validationEvidence: readonly SylValidationEvidenceV3[];
  humanReview: SylHumanReviewDecisionV3;
  provisionalQlAuthority: true;
}

export type GeneratedSylQuestionV3 = GeneratedSylQuestion & {
  structuredProofV3: SylStructuredProofV3;
};

export interface SylProofBuildInputV3 {
  qlId: string;
  checkpointId: string;
  seed: number;
  locale: SylLocale;
  scenarioId: string;
  sourcePatternId: string;
  taskKind: SylTaskKind;
  premises: readonly SurfacePremise[];
  displayedPremises: readonly SurfacePremise[];
  statements: readonly string[];
  conclusions: readonly string[];
  canonicalConclusions: readonly CanonicalConclusion[];
  conclusionProfiles: readonly {
    conclusion: CanonicalConclusion;
    rendered: string;
    classification: InternalConclusionClass;
    canBeTrue: boolean;
    canBeFalse: boolean;
    witnessModel: CanonicalModel | null;
    counterModel: CanonicalModel | null;
    verdictImpactPremiseIds: readonly string[];
    modelImpactPremiseIds: readonly string[];
  }[];
  options: readonly {
    optionId: string;
    semanticValue: string;
    text: string;
    isCorrect: boolean;
    errorLabel: string | null;
  }[];
  correctIndex: number;
  followMask: number | null;
  pairStatus: string | null;
  termLabels: Readonly<Record<TermId, string>>;
}
