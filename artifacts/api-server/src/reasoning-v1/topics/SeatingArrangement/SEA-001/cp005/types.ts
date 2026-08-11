export type MixedCircularPersonId = string;
export type MixedCircularFacing = "CENTRE" | "OUTWARD";
export type MixedCircularCyclicDirection = "CLOCKWISE" | "ANTICLOCKWISE";
export type MixedCircularRelativeDirection = "LEFT" | "RIGHT";

export type MixedCircularBlueprintId =
  | "SEA-PBA-017"
  | "SEA-PBA-018"
  | "SEA-PBA-019"
  | "SEA-PBA-020";

export type MixedCircularQueryContractId =
  | "SEA-QC-003"
  | "SEA-QC-005"
  | "SEA-QC-006"
  | "SEA-QC-009"
  | "SEA-QC-010"
  | "SEA-QC-020"
  | "SEA-QC-022";

export type MixedCircularConstraint =
  | {
      readonly id: string;
      readonly kind: "FACING";
      readonly personId: MixedCircularPersonId;
      readonly facing: MixedCircularFacing;
    }
  | {
      readonly id: string;
      readonly kind: "SAME_FACING";
      readonly firstId: MixedCircularPersonId;
      readonly secondId: MixedCircularPersonId;
    }
  | {
      readonly id: string;
      readonly kind: "OPPOSITE_FACING";
      readonly firstId: MixedCircularPersonId;
      readonly secondId: MixedCircularPersonId;
    }
  | {
      readonly id: string;
      readonly kind: "CYCLIC_POSITION";
      readonly subjectId: MixedCircularPersonId;
      readonly referenceId: MixedCircularPersonId;
      readonly direction: MixedCircularCyclicDirection;
      readonly steps: number;
    }
  | {
      readonly id: string;
      readonly kind: "RELATIVE_POSITION";
      readonly subjectId: MixedCircularPersonId;
      readonly referenceId: MixedCircularPersonId;
      readonly direction: MixedCircularRelativeDirection;
      readonly steps: number;
    }
  | {
      readonly id: string;
      readonly kind: "ADJACENT";
      readonly firstId: MixedCircularPersonId;
      readonly secondId: MixedCircularPersonId;
    }
  | {
      readonly id: string;
      readonly kind: "NOT_ADJACENT";
      readonly firstId: MixedCircularPersonId;
      readonly secondId: MixedCircularPersonId;
    }
  | {
      readonly id: string;
      readonly kind: "OPPOSITE";
      readonly firstId: MixedCircularPersonId;
      readonly secondId: MixedCircularPersonId;
    }
  | {
      readonly id: string;
      readonly kind: "DIRECTIONAL_COUNT_BETWEEN";
      readonly firstId: MixedCircularPersonId;
      readonly secondId: MixedCircularPersonId;
      readonly direction: MixedCircularCyclicDirection;
      readonly count: number;
    }
  | {
      readonly id: string;
      readonly kind: "FACING_CONDITIONAL_RELATION";
      readonly subjectId: MixedCircularPersonId;
      readonly referenceId: MixedCircularPersonId;
      readonly centreDirection: MixedCircularRelativeDirection;
      readonly centreSteps: number;
      readonly outwardDirection: MixedCircularRelativeDirection;
      readonly outwardSteps: number;
    };

export interface MixedCircularModel {
  readonly clockwiseOrder: readonly MixedCircularPersonId[];
  readonly facings: Readonly<Record<MixedCircularPersonId, MixedCircularFacing>>;
  readonly canonicalKey: string;
}

export type MixedCircularSemanticValue = string | number | readonly string[];
export type MixedCircularAnswerType = "PERSON" | "PAIR" | "COUNT" | "SEQUENCE";

export type MixedCircularMisconceptionId =
  | "SEA-MC-MCIRC-REFERENCE_FACING_IGNORED"
  | "SEA-MC-MCIRC-ASSUMED_CENTRE"
  | "SEA-MC-MCIRC-ASSUMED_OUTWARD"
  | "SEA-MC-MCIRC-SUBJECT_FACING_USED"
  | "SEA-MC-MCIRC-CLOCKWISE_REVERSAL"
  | "SEA-MC-MCIRC-OFF_BY_ONE"
  | "SEA-MC-MCIRC-ENDPOINT_INCLUDED"
  | "SEA-MC-MCIRC-WRONG_ARC"
  | "SEA-MC-MCIRC-ADJACENT_AS_OPPOSITE";

export interface MixedCircularOption {
  readonly semanticValue: MixedCircularSemanticValue;
  readonly semanticFingerprint: string;
  readonly display: string;
  readonly isCorrect: boolean;
  readonly misconceptionId?: MixedCircularMisconceptionId;
  readonly recomputation: Readonly<Record<string, unknown>>;
  readonly explanation: string;
}

export interface MixedCircularChildQuestion {
  readonly questionOrder: 1 | 2 | 3 | 4;
  readonly queryContractId: MixedCircularQueryContractId;
  readonly answerType: MixedCircularAnswerType;
  readonly answerDeterminingFactFingerprint: string;
  readonly text: string;
  readonly options: readonly [MixedCircularOption, MixedCircularOption, MixedCircularOption, MixedCircularOption];
  readonly answerIndex: 0 | 1 | 2 | 3;
  readonly answer: MixedCircularSemanticValue;
  readonly explanation: string;
  readonly referencePersonId?: MixedCircularPersonId;
  readonly referenceFacing?: MixedCircularFacing;
  readonly oppositeFacingCounterfactual?: MixedCircularSemanticValue;
}

export interface MixedCircularTopologySnapshot {
  readonly kind: "CIRCULAR_RING";
  readonly seatCount: number;
  readonly seatIndicesIncrease: "CLOCKWISE";
  readonly facingMode: "MIXED";
}

export interface MixedCircularCaseletRecord {
  readonly caseletId: string;
  readonly chapterId: "REAS-SEA";
  readonly packageId: "SEA-001";
  readonly checkpointId: "SEA-CP-005";
  readonly blueprintAuthorityId: MixedCircularBlueprintId;
  readonly seed: string;
  readonly locale: "en-IN";
  readonly difficultyFloor: "MEDIUM";
  readonly setupText: string;
  readonly clueTexts: readonly string[];
  readonly constraints: readonly MixedCircularConstraint[];
  readonly topologySnapshot: MixedCircularTopologySnapshot;
  readonly solutionPolicy: "UNIQUE_CLASS_AND_FACING_STATE";
  readonly solutionClassCount: 1;
  readonly solverOracleAgreement: {
    readonly productionKeys: readonly string[];
    readonly oracleKeys: readonly string[];
    readonly passed: boolean;
  };
  readonly queryFactFingerprints: readonly string[];
  readonly checkpointSkillCoverage: readonly string[];
  readonly crossQuestionLeakagePassed: boolean;
  readonly children: readonly MixedCircularChildQuestion[];
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
