export type OutwardPersonId = string;
export type OutwardCyclicDirection = "CLOCKWISE" | "ANTICLOCKWISE";
export type OutwardRelativeDirection = "LEFT" | "RIGHT";

export type OutwardBlueprintId = "SEA-PBA-013" | "SEA-PBA-014" | "SEA-PBA-015" | "SEA-PBA-016";
export type OutwardQueryContractId = "SEA-QC-003" | "SEA-QC-006" | "SEA-QC-009" | "SEA-QC-010" | "SEA-QC-020";

export type OutwardConstraint =
  | {
      readonly id: string;
      readonly kind: "CYCLIC_POSITION";
      readonly subjectId: OutwardPersonId;
      readonly referenceId: OutwardPersonId;
      readonly direction: OutwardCyclicDirection;
      readonly steps: number;
    }
  | {
      readonly id: string;
      readonly kind: "RELATIVE_POSITION";
      readonly subjectId: OutwardPersonId;
      readonly referenceId: OutwardPersonId;
      readonly direction: OutwardRelativeDirection;
      readonly steps: number;
    }
  | { readonly id: string; readonly kind: "ADJACENT"; readonly firstId: OutwardPersonId; readonly secondId: OutwardPersonId }
  | { readonly id: string; readonly kind: "NOT_ADJACENT"; readonly firstId: OutwardPersonId; readonly secondId: OutwardPersonId }
  | { readonly id: string; readonly kind: "OPPOSITE"; readonly firstId: OutwardPersonId; readonly secondId: OutwardPersonId }
  | {
      readonly id: string;
      readonly kind: "DIRECTIONAL_COUNT_BETWEEN";
      readonly firstId: OutwardPersonId;
      readonly secondId: OutwardPersonId;
      readonly direction: OutwardCyclicDirection;
      readonly count: number;
    }
  | {
      readonly id: string;
      readonly kind: "LANDMARK_ANCHOR";
      readonly personId: OutwardPersonId;
      readonly landmarkId: "ENTRANCE" | "STAGE" | "DOOR";
      readonly seatIndex: 0;
    };

export interface OutwardSolverModel {
  readonly clockwiseOrder: readonly OutwardPersonId[];
  readonly canonicalKey: string;
}

export type OutwardSemanticValue = string | number | readonly string[];
export type OutwardAnswerType = "PERSON" | "PAIR" | "COUNT" | "SEQUENCE";

export type OutwardMisconceptionId =
  | "SEA-MC-OUT-CENTRE_RULE_APPLIED"
  | "SEA-MC-OUT-CLOCKWISE_REVERSAL"
  | "SEA-MC-OUT-OFF_BY_ONE"
  | "SEA-MC-OUT-ENDPOINT_INCLUDED"
  | "SEA-MC-OUT-WRONG_ARC"
  | "SEA-MC-OUT-ADJACENT_AS_OPPOSITE";

export interface OutwardOption {
  readonly semanticValue: OutwardSemanticValue;
  readonly semanticFingerprint: string;
  readonly display: string;
  readonly isCorrect: boolean;
  readonly misconceptionId?: OutwardMisconceptionId;
  readonly recomputation: Readonly<Record<string, unknown>>;
  readonly explanation: string;
}

export interface OutwardChildQuestion {
  readonly questionOrder: 1 | 2 | 3 | 4;
  readonly queryContractId: OutwardQueryContractId;
  readonly answerType: OutwardAnswerType;
  readonly answerDeterminingFactFingerprint: string;
  readonly text: string;
  readonly options: readonly [OutwardOption, OutwardOption, OutwardOption, OutwardOption];
  readonly answerIndex: 0 | 1 | 2 | 3;
  readonly answer: OutwardSemanticValue;
  readonly explanation: string;
  readonly centreFacingCounterfactual?: OutwardSemanticValue;
}

export interface OutwardTopologySnapshot {
  readonly kind: "CIRCULAR_RING";
  readonly seatCount: number;
  readonly seatIndicesIncrease: "CLOCKWISE";
  readonly facing: "OUTWARD";
  readonly landmark?: {
    readonly id: "ENTRANCE" | "STAGE" | "DOOR";
    readonly anchoredSeatIndex: 0;
  };
}

export interface OutwardCaseletRecord {
  readonly caseletId: string;
  readonly chapterId: "REAS-SEA";
  readonly packageId: "SEA-001";
  readonly checkpointId: "SEA-CP-004";
  readonly blueprintAuthorityId: OutwardBlueprintId;
  readonly seed: string;
  readonly locale: "en-IN";
  readonly setupText: string;
  readonly clueTexts: readonly string[];
  readonly constraints: readonly OutwardConstraint[];
  readonly topologySnapshot: OutwardTopologySnapshot;
  readonly solutionPolicy: "UNIQUE_CLASS";
  readonly solutionClassCount: 1;
  readonly solverOracleAgreement: {
    readonly productionKeys: readonly string[];
    readonly oracleKeys: readonly string[];
    readonly passed: boolean;
  };
  readonly queryFactFingerprints: readonly string[];
  readonly checkpointSkillCoverage: readonly string[];
  readonly crossQuestionLeakagePassed: boolean;
  readonly children: readonly OutwardChildQuestion[];
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
