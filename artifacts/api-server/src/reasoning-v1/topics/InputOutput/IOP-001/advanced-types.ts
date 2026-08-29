import type { IopDifficulty, IopLifecycle, IopOption } from "./types.ts";

export type IopAdvancedCheckpointId =
  | "IOP-CP-005"
  | "IOP-CP-006"
  | "IOP-CP-007"
  | "IOP-CP-008"
  | "IOP-CP-009"
  | "IOP-CP-010";

export type IopAdvancedTokenKind = "WORD" | "NUMBER" | "ALPHANUMERIC";
export type IopAdvancedLayout = "LINEAR" | "BOX_ROW" | "TABLE_2XN";
export type IopAdvancedSelectionKey =
  | "ALPHABETICAL"
  | "NUMERIC_VALUE"
  | "WORD_LENGTH"
  | "VOWEL_COUNT"
  | "DIGIT_SUM"
  | "LAST_DIGIT";
export type IopAdvancedDirection = "ASC" | "DESC";
export type IopAdvancedPlacement = "LEFT_FIXED" | "RIGHT_FIXED";
export type IopAdvancedTransform =
  | "REVERSE_DIGITS"
  | "ADD_DIGIT_SUM"
  | "REVERSE_WORD"
  | "SWAP_WORD_ENDS"
  | "ROTATE_WORD_LEFT"
  | "REVERSE_ALPHANUMERIC"
  | "ROTATE_ALPHANUMERIC_LEFT";

export interface IopAdvancedToken {
  readonly id: string;
  readonly kind: IopAdvancedTokenKind;
  readonly originalValue: string;
  readonly visibleValue: string;
  readonly originalPosition: number;
}

export type IopAdvancedOperation =
  | {
      readonly id: string;
      readonly kind: "ITERATIVE_MOVE";
      readonly eligibleKind: IopAdvancedTokenKind;
      readonly selectionKey: IopAdvancedSelectionKey;
      readonly direction: IopAdvancedDirection;
      readonly placement: IopAdvancedPlacement;
    }
  | {
      readonly id: string;
      readonly kind: "TRANSFORM_ALL";
      readonly eligibleKind: IopAdvancedTokenKind;
      readonly transform: IopAdvancedTransform;
    }
  | {
      readonly id: string;
      readonly kind: "SORT_ALL";
      readonly eligibleKind: IopAdvancedTokenKind;
      readonly selectionKey: IopAdvancedSelectionKey;
      readonly direction: IopAdvancedDirection;
    }
  | {
      readonly id: string;
      readonly kind: "PAIR_REWRITE";
      readonly rewrite: "SUM_AND_ABS_DIFF";
    }
  | {
      readonly id: string;
      readonly kind: "SWAP_ADJACENT_PAIRS";
    }
  | {
      readonly id: string;
      readonly kind: "REVERSE_ORDER";
    };

export interface IopAdvancedProgram {
  readonly id: string;
  readonly checkpointId: IopAdvancedCheckpointId;
  readonly layout: IopAdvancedLayout;
  readonly operations: readonly IopAdvancedOperation[];
}

export interface IopAdvancedActionTrace {
  readonly operationId: string;
  readonly operationKind: IopAdvancedOperation["kind"];
  readonly tokenIds: readonly string[];
  readonly beforeValues: readonly string[];
  readonly afterValues: readonly string[];
}

export interface IopAdvancedStep {
  readonly stepNumber: number;
  readonly operationId: string;
  readonly operationKind: IopAdvancedOperation["kind"];
  readonly tokens: readonly IopAdvancedToken[];
  readonly actions: readonly IopAdvancedActionTrace[];
  readonly stateFingerprint: string;
}

export interface IopAdvancedTrace {
  readonly layout: IopAdvancedLayout;
  readonly input: readonly IopAdvancedToken[];
  readonly steps: readonly IopAdvancedStep[];
  readonly final: readonly IopAdvancedToken[];
  readonly finalFingerprint: string;
  readonly programFingerprint: string;
}

export type IopAdvancedPrototypeId =
  | "IOP-CP005-PROT-001" | "IOP-CP005-PROT-002" | "IOP-CP005-PROT-003"
  | "IOP-CP006-PROT-001" | "IOP-CP006-PROT-002" | "IOP-CP006-PROT-003"
  | "IOP-CP007-PROT-001" | "IOP-CP007-PROT-002" | "IOP-CP007-PROT-003"
  | "IOP-CP008-PROT-001" | "IOP-CP008-PROT-002" | "IOP-CP008-PROT-003"
  | "IOP-CP009-PROT-001" | "IOP-CP009-PROT-002" | "IOP-CP009-PROT-003"
  | "IOP-CP010-PROT-001" | "IOP-CP010-PROT-002" | "IOP-CP010-PROT-003";

export interface IopAdvancedPrototypeAuthority {
  readonly prototypeId: IopAdvancedPrototypeId;
  readonly checkpointId: IopAdvancedCheckpointId;
  readonly title: string;
  readonly program: IopAdvancedProgram;
  readonly tokenKind: IopAdvancedTokenKind;
  readonly tokenCount: number;
  readonly sourceStatus: "DISCOVERY_HYPOTHESIS_PENDING_SOURCE_SATURATION";
}

export type IopAdvancedQueryKind =
  | "STEP_OUTPUT"
  | "ELEMENT_AT_POSITION"
  | "STEP_NUMBER"
  | "FINAL_OUTPUT"
  | "PREVIOUS_STEP"
  | "MISSING_STEP"
  | "REMAINING_STEP_COUNT";

export type IopAdvancedQueryEvidence =
  | { readonly kind: "STEP_OUTPUT"; readonly stepNumber: number }
  | { readonly kind: "ELEMENT_AT_POSITION"; readonly stepNumber: number; readonly position: number }
  | { readonly kind: "STEP_NUMBER"; readonly stateFingerprint: string }
  | { readonly kind: "FINAL_OUTPUT" }
  | { readonly kind: "PREVIOUS_STEP"; readonly stepNumber: number }
  | { readonly kind: "MISSING_STEP"; readonly stepNumber: number }
  | { readonly kind: "REMAINING_STEP_COUNT"; readonly stepNumber: number };

export interface IopAdvancedChildQuestion {
  readonly questionOrder: 1 | 2 | 3 | 4;
  readonly kind: IopAdvancedQueryKind;
  readonly evidence: IopAdvancedQueryEvidence;
  readonly text: string;
  readonly options: readonly [IopOption, IopOption, IopOption, IopOption];
  readonly answerIndex: 0 | 1 | 2 | 3;
  readonly answerDisplay: string;
  readonly explanation: string;
}

export interface IopAdvancedIdentifiabilityEvidence {
  readonly candidateProgramsTested: number;
  readonly matchingProgramFingerprints: readonly string[];
  readonly intendedProgramFingerprint: string;
  readonly passed: boolean;
}

export interface IopAdvancedCaselet {
  readonly caseletId: string;
  readonly packageId: "IOP-001";
  readonly chapterId: "REAS-INP";
  readonly checkpointId: IopAdvancedCheckpointId;
  readonly prototypeId: IopAdvancedPrototypeId;
  readonly seed: string;
  readonly locale: "en-IN";
  readonly difficulty: IopDifficulty;
  readonly directions: string;
  readonly demonstration: IopAdvancedTrace;
  readonly target: IopAdvancedTrace;
  readonly ruleExplanation: string;
  readonly identifiability: IopAdvancedIdentifiabilityEvidence;
  readonly oracleParity: true;
  readonly children: readonly [IopAdvancedChildQuestion, IopAdvancedChildQuestion, IopAdvancedChildQuestion, IopAdvancedChildQuestion];
  readonly lifecycle: IopLifecycle;
}
