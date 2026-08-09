export type MixedPersonId = string;
export type MixedFacingDirection = "NORTH" | "SOUTH";
export type MixedRelativeDirection = "LEFT" | "RIGHT";
export type MixedFacingBlueprintId = "SEA-PBA-005" | "SEA-PBA-006" | "SEA-PBA-007" | "SEA-PBA-008";
export type MixedFacingQueryContractId = "SEA-QC-003" | "SEA-QC-005" | "SEA-QC-006" | "SEA-QC-008" | "SEA-QC-015";

export type MixedFacingConstraint =
  | { readonly id: string; readonly kind: "ABSOLUTE_SEAT"; readonly personId: MixedPersonId; readonly seatIndex: number }
  | { readonly id: string; readonly kind: "AT_END"; readonly personId: MixedPersonId }
  | { readonly id: string; readonly kind: "FACING"; readonly personId: MixedPersonId; readonly facing: MixedFacingDirection }
  | { readonly id: string; readonly kind: "SAME_FACING"; readonly firstId: MixedPersonId; readonly secondId: MixedPersonId }
  | { readonly id: string; readonly kind: "OPPOSITE_FACING"; readonly firstId: MixedPersonId; readonly secondId: MixedPersonId }
  | {
      readonly id: string;
      readonly kind: "RELATIVE_POSITION";
      readonly subjectId: MixedPersonId;
      readonly referenceId: MixedPersonId;
      readonly direction: MixedRelativeDirection;
      readonly steps: number;
    }
  | { readonly id: string; readonly kind: "ADJACENT"; readonly firstId: MixedPersonId; readonly secondId: MixedPersonId }
  | { readonly id: string; readonly kind: "NOT_ADJACENT"; readonly firstId: MixedPersonId; readonly secondId: MixedPersonId }
  | {
      readonly id: string;
      readonly kind: "EXACT_COUNT_BETWEEN";
      readonly firstId: MixedPersonId;
      readonly secondId: MixedPersonId;
      readonly count: number;
    };

export interface MixedFacingModel {
  readonly seatOrder: readonly MixedPersonId[];
  readonly facings: Readonly<Record<MixedPersonId, MixedFacingDirection>>;
  readonly canonicalKey: string;
}

export type MixedFacingAnswerType = "PERSON" | "PAIR" | "COUNT" | "RELATION" | "FACING";
export type MixedFacingSemanticValue = string | number | readonly string[];

export type MixedFacingMisconceptionId =
  | "SEA-MC-MIX-REFERENCE_FACING_IGNORED"
  | "SEA-MC-MIX-LEFT_RIGHT_REVERSED"
  | "SEA-MC-MIX-SUBJECT_FACING_USED"
  | "SEA-MC-MIX-OFF_BY_ONE_SEAT"
  | "SEA-MC-MIX-ENDPOINT_INCLUDED"
  | "SEA-MC-MIX-WRONG_NEIGHBOUR";

export interface MixedFacingOption {
  readonly semanticValue: MixedFacingSemanticValue;
  readonly semanticFingerprint: string;
  readonly display: string;
  readonly isCorrect: boolean;
  readonly misconceptionId?: MixedFacingMisconceptionId;
  readonly recomputation: Readonly<Record<string, unknown>>;
  readonly explanation: string;
}

export interface MixedFacingChildQuestion {
  readonly questionOrder: 1 | 2 | 3 | 4;
  readonly queryContractId: MixedFacingQueryContractId;
  readonly answerType: MixedFacingAnswerType;
  readonly answerDeterminingFactFingerprint: string;
  readonly text: string;
  readonly options: readonly [MixedFacingOption, MixedFacingOption, MixedFacingOption, MixedFacingOption];
  readonly answerIndex: 0 | 1 | 2 | 3;
  readonly answer: MixedFacingSemanticValue;
  readonly explanation: string;
}

export interface MixedFacingProofEvent {
  readonly id: string;
  readonly kind: "ABSOLUTE_ANCHOR" | "FACING_RESOLUTION" | "RELATIVE_PLACEMENT" | "BLOCK_PLACEMENT" | "GAP_PLACEMENT" | "ONLY_REMAINING_SEAT";
  readonly sourceConstraintIds: readonly string[];
  readonly statement: string;
}

export interface MixedFacingCaseletRecord {
  readonly caseletId: string;
  readonly chapterId: "REAS-SEA";
  readonly packageId: "SEA-001";
  readonly checkpointId: "SEA-CP-002";
  readonly blueprintAuthorityId: MixedFacingBlueprintId;
  readonly seed: string;
  readonly locale: "en-IN";
  readonly setupText: string;
  readonly clueTexts: readonly string[];
  readonly constraints: readonly MixedFacingConstraint[];
  readonly hiddenStateFingerprint: string;
  readonly clueSetFingerprint: string;
  readonly solutionPolicy: "UNIQUE_STATE";
  readonly solutionStateCount: 1;
  readonly solverOracleAgreement: {
    readonly productionKeys: readonly string[];
    readonly oracleKeys: readonly string[];
    readonly passed: boolean;
  };
  readonly checkpointSkillCoverage: readonly string[];
  readonly queryFactFingerprints: readonly string[];
  readonly crossQuestionLeakagePassed: boolean;
  readonly proofTrace: readonly MixedFacingProofEvent[];
  readonly sharedExplanation: string;
  readonly diagramText: string;
  readonly children: readonly MixedFacingChildQuestion[];
  readonly lifecycle: {
    readonly discoveryStatus: "EXECUTABLE_FOUNDATION";
    readonly permanentQlCount: 0;
    readonly questionStudioRegistered: false;
    readonly questionBankWritable: false;
    readonly testEligible: false;
    readonly publiclyPublishable: false;
  };
}
