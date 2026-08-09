export type PersonId = string;
export type CyclicDirection = "CLOCKWISE" | "ANTICLOCKWISE";
export type RelativeDirection = "LEFT" | "RIGHT";

export type CircularBlueprintId = "SEA-PBA-009" | "SEA-PBA-010" | "SEA-PBA-011" | "SEA-PBA-012";
export type CircularQueryContractId =
  | "SEA-QC-003"
  | "SEA-QC-004"
  | "SEA-QC-006"
  | "SEA-QC-009"
  | "SEA-QC-010"
  | "SEA-QC-015"
  | "SEA-QC-020";

export type CircularConstraint =
  | {
      readonly id: string;
      readonly kind: "CYCLIC_POSITION";
      readonly subjectId: PersonId;
      readonly referenceId: PersonId;
      readonly direction: CyclicDirection;
      readonly steps: number;
    }
  | {
      readonly id: string;
      readonly kind: "RELATIVE_POSITION";
      readonly subjectId: PersonId;
      readonly referenceId: PersonId;
      readonly direction: RelativeDirection;
      readonly steps: number;
    }
  | { readonly id: string; readonly kind: "ADJACENT"; readonly firstId: PersonId; readonly secondId: PersonId }
  | { readonly id: string; readonly kind: "NOT_ADJACENT"; readonly firstId: PersonId; readonly secondId: PersonId }
  | { readonly id: string; readonly kind: "OPPOSITE"; readonly firstId: PersonId; readonly secondId: PersonId }
  | {
      readonly id: string;
      readonly kind: "DIRECTIONAL_COUNT_BETWEEN";
      readonly firstId: PersonId;
      readonly secondId: PersonId;
      readonly direction: CyclicDirection;
      readonly count: number;
    }
  | {
      readonly id: string;
      readonly kind: "LANDMARK_ANCHOR";
      readonly personId: PersonId;
      readonly landmarkId: "ENTRANCE" | "STAGE" | "DOOR";
      readonly seatIndex: 0;
    };

export interface CircularCandidateClue {
  readonly id: string;
  readonly constraint: CircularConstraint;
  readonly semanticFingerprint: string;
  readonly requiredByBlueprint: boolean;
  readonly directnessScore: number;
  readonly informationGain: number;
  readonly naturalnessScore: number;
}

export interface CircularTopologySnapshot {
  readonly kind: "CIRCULAR_RING";
  readonly seatCount: number;
  readonly seatIndicesIncrease: "CLOCKWISE";
  readonly facing: "CENTER";
  readonly landmark?: {
    readonly id: "ENTRANCE" | "STAGE" | "DOOR";
    readonly anchoredSeatIndex: 0;
  };
}

export interface CircularHiddenState {
  readonly topology: CircularTopologySnapshot;
  readonly clockwiseOrder: readonly PersonId[];
}

export interface CircularSolverModel {
  readonly clockwiseOrder: readonly PersonId[];
  readonly canonicalKey: string;
}

export interface CircularSolverAgreement {
  readonly productionKeys: readonly string[];
  readonly oracleKeys: readonly string[];
  readonly passed: boolean;
}

export type CircularAnswerType = "PERSON" | "PAIR" | "COUNT" | "RELATION" | "SEQUENCE";
export type CircularSemanticValue = string | number | readonly string[];

export type CircularMisconceptionId =
  | "SEA-MC-CYC-CLOCKWISE_ANTICLOCKWISE_REVERSAL"
  | "SEA-MC-CYC-CENTRE_LEFT_RIGHT_REVERSAL"
  | "SEA-MC-CYC-OFF_BY_ONE_STEP"
  | "SEA-MC-CYC-ENDPOINT_INCLUDED_IN_GAP"
  | "SEA-MC-CYC-WRONG_ARC"
  | "SEA-MC-CYC-ADJACENT_AS_OPPOSITE"
  | "SEA-MC-CYC-ROTATION_AS_NEW_SOLUTION";

export interface CircularOption {
  readonly semanticValue: CircularSemanticValue;
  readonly semanticFingerprint: string;
  readonly display: string;
  readonly isCorrect: boolean;
  readonly misconceptionId?: CircularMisconceptionId;
  readonly recomputation: Readonly<Record<string, unknown>>;
  readonly explanation: string;
}

export interface CircularChildQuestion {
  readonly questionOrder: 1 | 2 | 3 | 4;
  readonly queryContractId: CircularQueryContractId;
  readonly answerType: CircularAnswerType;
  readonly answerDeterminingFactFingerprint: string;
  readonly text: string;
  readonly options: readonly [CircularOption, CircularOption, CircularOption, CircularOption];
  readonly answerIndex: 0 | 1 | 2 | 3;
  readonly answer: CircularSemanticValue;
  readonly explanation: string;
}

export interface CircularDiagramSeat {
  readonly seatIndex: number;
  readonly personId: PersonId;
  readonly x: number;
  readonly y: number;
}

export interface CircularDiagramScene {
  readonly width: 420;
  readonly height: 420;
  readonly centre: { readonly x: 210; readonly y: 210 };
  readonly seats: readonly CircularDiagramSeat[];
  readonly landmark?: {
    readonly id: "ENTRANCE" | "STAGE" | "DOOR";
    readonly x: number;
    readonly y: number;
  };
  readonly svg: string;
  readonly text: string;
}

export interface CircularProofEvent {
  readonly id: string;
  readonly kind:
    | "ROTATION_SYMMETRY_BREAK"
    | "LANDMARK_ABSOLUTE_ANCHOR"
    | "OPPOSITE_PLACEMENT"
    | "CLOCKWISE_CHAIN"
    | "ARC_COUNT"
    | "ADJACENCY_ELIMINATION"
    | "ONLY_REMAINING_POSITION";
  readonly sourceConstraintIds: readonly string[];
  readonly statement: string;
}

export interface CircularCaseletRecord {
  readonly caseletId: string;
  readonly chapterId: "REAS-SEA";
  readonly packageId: "SEA-001";
  readonly checkpointId: "SEA-CP-003";
  readonly blueprintAuthorityId: CircularBlueprintId;
  readonly seed: string;
  readonly locale: "en-IN";
  readonly setupText: string;
  readonly clueTexts: readonly string[];
  readonly constraints: readonly CircularConstraint[];
  readonly topologySnapshot: CircularTopologySnapshot;
  readonly hiddenStateFingerprint: string;
  readonly clueSetFingerprint: string;
  readonly essentialConstraintIds: readonly string[];
  readonly blueprintCoverageConstraintIds: readonly string[];
  readonly solutionPolicy: "UNIQUE_CLASS";
  readonly solutionClassCount: 1;
  readonly solverOracleAgreement: CircularSolverAgreement;
  readonly queryFactFingerprints: readonly string[];
  readonly checkpointSkillCoverage: readonly string[];
  readonly crossQuestionLeakagePassed: boolean;
  readonly proofTrace: readonly CircularProofEvent[];
  readonly sharedExplanation: string;
  readonly diagram: CircularDiagramScene;
  readonly children: readonly CircularChildQuestion[];
  readonly lifecycle: {
    readonly discoveryStatus: "EXECUTABLE_FOUNDATION";
    readonly permanentQlCount: 0;
    readonly questionStudioRegistered: false;
    readonly questionBankWritable: false;
    readonly testEligible: false;
    readonly publiclyPublishable: false;
  };
}
