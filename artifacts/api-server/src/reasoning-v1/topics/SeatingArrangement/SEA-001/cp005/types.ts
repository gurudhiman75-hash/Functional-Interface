export type MixedCirclePersonId = string;
export type MixedCircleFacing = "CENTER" | "OUTWARD";
export type MixedCircleDirection = "LEFT" | "RIGHT";
export type MixedCircleCyclicDirection = "CLOCKWISE" | "ANTICLOCKWISE";
export type MixedCircleBlueprintId = "SEA-PBA-017" | "SEA-PBA-018" | "SEA-PBA-019" | "SEA-PBA-020";
export type MixedCircleQueryContractId = "SEA-QC-003" | "SEA-QC-005" | "SEA-QC-006" | "SEA-QC-010" | "SEA-QC-020" | "SEA-QC-022";

export type MixedCircleConstraint =
  | { readonly id: string; readonly kind: "FACING"; readonly personId: MixedCirclePersonId; readonly facing: MixedCircleFacing }
  | { readonly id: string; readonly kind: "SAME_FACING"; readonly firstId: MixedCirclePersonId; readonly secondId: MixedCirclePersonId }
  | { readonly id: string; readonly kind: "OPPOSITE_FACING"; readonly firstId: MixedCirclePersonId; readonly secondId: MixedCirclePersonId }
  | { readonly id: string; readonly kind: "CYCLIC_POSITION"; readonly subjectId: MixedCirclePersonId; readonly referenceId: MixedCirclePersonId; readonly direction: MixedCircleCyclicDirection; readonly steps: number }
  | { readonly id: string; readonly kind: "RELATIVE_POSITION"; readonly subjectId: MixedCirclePersonId; readonly referenceId: MixedCirclePersonId; readonly direction: MixedCircleDirection; readonly steps: number }
  | { readonly id: string; readonly kind: "ADJACENT"; readonly firstId: MixedCirclePersonId; readonly secondId: MixedCirclePersonId }
  | { readonly id: string; readonly kind: "OPPOSITE"; readonly firstId: MixedCirclePersonId; readonly secondId: MixedCirclePersonId }
  | { readonly id: string; readonly kind: "DIRECTIONAL_COUNT_BETWEEN"; readonly firstId: MixedCirclePersonId; readonly secondId: MixedCirclePersonId; readonly direction: MixedCircleCyclicDirection; readonly count: number }
  | { readonly id: string; readonly kind: "CONDITIONAL_FACING"; readonly conditionPersonId: MixedCirclePersonId; readonly conditionFacing: MixedCircleFacing; readonly targetPersonId: MixedCirclePersonId; readonly thenFacing: MixedCircleFacing; readonly elseFacing: MixedCircleFacing };

export interface MixedCircleModel {
  readonly clockwiseOrder: readonly MixedCirclePersonId[];
  readonly facings: Readonly<Record<MixedCirclePersonId, MixedCircleFacing>>;
  readonly canonicalKey: string;
}

export type MixedCircleSemanticValue = string | readonly string[];
export type MixedCircleAnswerType = "PERSON" | "PAIR" | "SEQUENCE";
export type MixedCircleMisconceptionId =
  | "SEA-MC-REFERENCE_FACING_IGNORED"
  | "SEA-MC-CENTER_OUTWARD_SWAPPED"
  | "SEA-MC-LEFT_RIGHT_REVERSED"
  | "SEA-MC-OFF_BY_ONE"
  | "SEA-MC-ENDPOINT_INCLUDED"
  | "SEA-MC-WRONG_NEIGHBOUR";

export interface MixedCircleOption {
  readonly semanticValue: MixedCircleSemanticValue;
  readonly semanticFingerprint: string;
  readonly display: string;
  readonly isCorrect: boolean;
  readonly misconceptionId?: MixedCircleMisconceptionId;
  readonly recomputation: Readonly<Record<string, unknown>>;
  readonly explanation: string;
}

export interface MixedCircleChildQuestion {
  readonly questionOrder: 1 | 2 | 3 | 4;
  readonly queryContractId: MixedCircleQueryContractId;
  readonly answerType: MixedCircleAnswerType;
  readonly answerDeterminingFactFingerprint: string;
  readonly text: string;
  readonly options: readonly [MixedCircleOption, MixedCircleOption, MixedCircleOption, MixedCircleOption];
  readonly answerIndex: 0 | 1 | 2 | 3;
  readonly answer: MixedCircleSemanticValue;
  readonly explanation: string;
  readonly oppositeFacingCounterfactual?: MixedCircleSemanticValue;
}

export interface MixedCircleCaseletRecord {
  readonly caseletId: string;
  readonly chapterId: "REAS-SEA";
  readonly packageId: "SEA-001";
  readonly checkpointId: "SEA-CP-005";
  readonly blueprintAuthorityId: MixedCircleBlueprintId;
  readonly seed: string;
  readonly locale: "en-IN";
  readonly setupText: string;
  readonly clueTexts: readonly string[];
  readonly constraints: readonly MixedCircleConstraint[];
  readonly solutionPolicy: "UNIQUE_STATE_CLASS";
  readonly solutionStateClassCount: 1;
  readonly solverOracleAgreement: {
    readonly productionKeys: readonly string[];
    readonly oracleKeys: readonly string[];
    readonly passed: boolean;
  };
  readonly checkpointSkillCoverage: readonly string[];
  readonly queryFactFingerprints: readonly string[];
  readonly crossQuestionLeakagePassed: boolean;
  readonly children: readonly MixedCircleChildQuestion[];
  readonly diagramText: string;
  readonly sharedExplanation: string;
  readonly lifecycle: {
    readonly discoveryStatus: "EXECUTABLE_FOUNDATION";
    readonly permanentQlCount: 0;
    readonly questionStudioRegistered: false;
    readonly questionBankWritable: false;
    readonly testEligible: false;
    readonly publiclyPublishable: false;
  };
}
