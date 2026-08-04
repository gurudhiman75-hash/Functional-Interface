import type {
  CanonicalConclusion,
  CanonicalModel,
  InternalConclusionClass,
  SurfacePremise,
  SylLocale,
  TermId,
} from "../../foundation/types";
import type {
  GeneratedSylOption,
  GeneratedSylQuestion,
  SylTaskKind,
} from "../types";

export type SylLogicalStatusV3 =
  | "ENTAILED"
  | "POSSIBLE_NOT_ENTAILED"
  | "IMPOSSIBLE"
  | "INCONSISTENT_PREMISES";

export type SylTaskDispositionV3 =
  | "CORRECT_FOR_TASK"
  | "WRONG_FOR_TASK"
  | "TRUE_BUT_NOT_REQUESTED"
  | "INVALID_OPTION_FORM";

export type SylReasonCodeV3 =
  | "DIRECT_CONTRADICTION"
  | "FORCED_WITNESS_TRANSFER"
  | "TRANSITIVE_INCLUSION"
  | "INCLUSION_THROUGH_DISJOINTNESS"
  | "REVERSAL_ERROR"
  | "POSSIBILITY_NOT_CERTAINTY"
  | "CERTAINTY_NOT_MERE_POSSIBILITY"
  | "WITNESS_MISMATCH"
  | "ONLY_DIRECTION"
  | "ONLY_A_FEW_DUAL_FACT"
  | "NOT_ALL_NORMALIZATION"
  | "COUNTERMODEL_EXISTS"
  | "SATISFYING_MODEL_EXISTS"
  | "MODAL_LABEL_MISMATCH"
  | "FOLLOW_MASK_MISMATCH"
  | "EITHER_OR_COMPLEMENT_FAILURE"
  | "PAIR_STATUS_MISMATCH"
  | "PREMISES_CONSISTENT";

export type SylProofTypeV3 =
  | "DIRECT_PREMISE"
  | "WITNESS_TRANSFER"
  | "TRANSITIVE_CHAIN"
  | "CONTRADICTION"
  | "COUNTERMODEL"
  | "SATISFYING_MODEL"
  | "TWO_STATE_MODAL_PROOF"
  | "FOLLOW_MASK_PROOF"
  | "EITHER_OR_COMPLEMENT_PROOF"
  | "PAIR_CLASSIFICATION_PROOF";

export type SylWitnessRelationV3 =
  | "FORCED_SAME"
  | "MAY_BE_SAME"
  | "MUST_BE_DISTINCT"
  | "UNRESOLVED";

export interface SylVersionTupleV3 {
  readonly contentVersion: "SYL_001_REMODEL_V3";
  readonly solverVersion: "INDIAN_COMPETITIVE_EXAM_SYLLOGISM_V1";
  readonly proofGeneratorVersion: "syl-structured-proof-v3";
  readonly diagramGeneratorVersion: "syl-combined-diagram-v3";
  readonly localizationVersion: "syl-localization-v3";
  readonly existencePolicyVersion: 1;
  readonly optionShuffleVersion: "syl-secure-shuffle-v3";
}

export interface SylProofModelSnapshotV3 {
  readonly modelId: string;
  readonly purpose: "SATISFIES_CORRECT_OPTION" | "FALSIFIES_CORRECT_OPTION" | "PREMISE_MODEL";
  readonly source: CanonicalModel;
  readonly occupiedRegions: readonly {
    readonly witnessId: string;
    readonly memberTermIds: readonly TermId[];
    readonly memberLabels: readonly string[];
  }[];
}

export interface SylOptionProofEvidenceV3 {
  readonly proofType: SylProofTypeV3;
  readonly reasonCode: SylReasonCodeV3;
  readonly decisivePremiseIds: readonly string[];
  readonly requiredRelation: string;
  readonly blockedOrFreeRelation: string | null;
  readonly witnessIds: readonly string[];
  readonly witnessRelation: SylWitnessRelationV3;
  readonly satisfyingModel: SylProofModelSnapshotV3 | null;
  readonly counterModel: SylProofModelSnapshotV3 | null;
}

export interface SylVisibleOptionAnalysisV3 {
  readonly displayIndex: number;
  readonly displayLabel: string;
  readonly optionId: string;
  readonly optionText: string;
  readonly semanticValue: string;
  readonly logicalStatus: SylLogicalStatusV3;
  readonly taskDisposition: SylTaskDispositionV3;
  readonly studentVerdict: string;
  readonly premiseIdsUsed: readonly string[];
  readonly reasonCode: SylReasonCodeV3;
  readonly studentReason: string;
  readonly proofEvidence: SylOptionProofEvidenceV3;
}

export interface SylStatementMeaningV3 {
  readonly displayIndex: number;
  readonly premiseId: string;
  readonly statement: string;
  readonly normalizedMeaning: string;
  readonly normalizedRelation: string;
}

export interface SylCorrectOptionProofV3 {
  readonly displayIndex: number;
  readonly displayLabel: string;
  readonly optionText: string;
  readonly proofType: SylProofTypeV3;
  readonly decisivePremiseIds: readonly string[];
  readonly reasoningSteps: readonly string[];
  readonly studentProof: string;
}

export type SylCombinedDiagramModeV3 =
  | "DEFINITE_PROOF_MODEL"
  | "IMPOSSIBILITY_BLOCK_MODEL"
  | "NON_FOLLOWING_COUNTERMODEL"
  | "POSSIBILITY_WITNESS_MODEL"
  | "POSSIBLE_NOT_DEFINITE_TWO_STATE_MODEL"
  | "FOLLOW_MASK_MODEL"
  | "EITHER_OR_COMPLEMENT_MODEL"
  | "PAIR_CLASSIFICATION_MODEL";

export interface SylCombinedDiagramSpecV3 {
  readonly diagramCount: 1;
  readonly mode: SylCombinedDiagramModeV3;
  readonly correctOptionOnly: true;
  readonly allRelevantPremisesIncluded: true;
  readonly relevantPremiseIds: readonly string[];
  readonly correctOptionDisplayIndex: number;
  readonly correctOptionText: string;
  readonly premises: readonly SurfacePremise[];
  readonly focusedConclusions: readonly CanonicalConclusion[];
  readonly satisfyingModel: SylProofModelSnapshotV3 | null;
  readonly counterModel: SylProofModelSnapshotV3 | null;
  readonly titleId: string;
  readonly descriptionId: string;
  readonly textAlternative: string;
  readonly svg: string;
}

export interface SylStructuredExplanationV3 {
  readonly schemaVersion: "syl-structured-proof-v3";
  readonly taskKind: SylTaskKind;
  readonly existencePolicy: {
    readonly id: "EXAM_NON_EMPTY_PREMISE_TERMS_V1";
    readonly version: 1;
    readonly visibleToStudent: true;
    readonly studentDirection: string;
  };
  readonly understandStatementsHeading: string;
  readonly statementMeanings: readonly SylStatementMeaningV3[];
  readonly combineStatementsHeading: string;
  readonly combinedRelation: string;
  readonly checkOptionsHeading: string;
  readonly optionAnalysis: readonly SylVisibleOptionAnalysisV3[];
  readonly correctProofHeading: string;
  readonly correctOptionProof: SylCorrectOptionProofV3;
  readonly fastRuleHeading: string;
  readonly fastRule: {
    readonly symbolic: string;
    readonly naturalLanguage: string;
  };
  readonly diagramHeading: string;
  readonly combinedDiagram: SylCombinedDiagramSpecV3;
  readonly finalAnswerHeading: string;
  readonly finalAnswer: string;
}

export interface GeneratedSylOptionV3 extends GeneratedSylOption {
  readonly displayIndex: number;
  readonly displayLabel: string;
}

export interface GeneratedSylQuestionV3 extends Omit<
  GeneratedSylQuestion,
  "stem" | "options" | "correctIndex" | "explanation" | "metadata"
> {
  readonly questionId: string;
  readonly questionLanguageId: string;
  readonly contentIdentity: string;
  readonly stem: string;
  readonly options: readonly GeneratedSylOptionV3[];
  readonly correctIndex: number;
  readonly explanation: SylStructuredExplanationV3;
  readonly versionTuple: SylVersionTupleV3;
  readonly humanReviewStatus: "REVISE";
  readonly lifecycle: {
    readonly questionStudioVisible: false;
    readonly questionBankWritable: false;
    readonly testEligible: false;
    readonly publiclyPublishable: false;
  };
  readonly metadata: GeneratedSylQuestion["metadata"] & {
    readonly runtimeVersion: "syl-001-remodel-runtime-v3";
    readonly proofObjectGenerated: true;
    readonly optionExplanationSynchronized: true;
    readonly oneCombinedDiagramValidated: true;
    readonly existencePolicyVisibleToStudent: true;
    readonly immutableReviewVersion: "SYL_001_REMODEL_V3";
    readonly humanReviewStatus: "REVISE";
  };
}

export interface SylRemodelV3ValidationResult {
  readonly ok: boolean;
  readonly errors: readonly string[];
  readonly optionSyncPassed: boolean;
  readonly proofEvidencePassed: boolean;
  readonly diagramCountPassed: boolean;
  readonly diagramSemanticCoveragePassed: boolean;
  readonly lifecyclePassed: boolean;
  readonly existencePolicyPassed: boolean;
}

export interface SylRemodelV3ParitySignature {
  readonly qlId: string;
  readonly seed: number;
  readonly taskKind: SylTaskKind;
  readonly scenarioId: string;
  readonly optionSemanticOrder: readonly string[];
  readonly correctIndex: number;
  readonly optionLogicalStatuses: readonly SylLogicalStatusV3[];
  readonly decisivePremiseIds: readonly string[];
  readonly diagramMode: SylCombinedDiagramModeV3;
}

export function classificationToLogicalStatus(
  classification: InternalConclusionClass,
): SylLogicalStatusV3 {
  if (classification === "ENTAILED") return "ENTAILED";
  if (classification === "CONTRADICTED") return "IMPOSSIBLE";
  return "POSSIBLE_NOT_ENTAILED";
}

export function localeDisplayLabel(index: number, _locale: SylLocale): string {
  return String(index + 1);
}
