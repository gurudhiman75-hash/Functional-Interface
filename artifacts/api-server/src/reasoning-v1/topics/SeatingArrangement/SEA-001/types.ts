import type { ProofEvent } from "../../../shared/constraint-core/types.ts";

export type PersonId = string;
export type SeatId = string;
export type FacingDirection = "NORTH" | "SOUTH";
export type RelativeDirection = "LEFT" | "RIGHT";
export type Locale = "en-IN";

export interface SeatingPerson {
  readonly id: PersonId;
  readonly displayName: string;
}

export interface LinearSeat {
  readonly id: SeatId;
  readonly index: number;
  readonly coordinate: { readonly x: number; readonly y: 0 };
  readonly occupancyPolicy: "REQUIRED";
}

export interface LinearAssignment {
  readonly personId: PersonId;
  readonly seatId: SeatId;
  readonly facing: FacingDirection;
}

export interface LinearSeatingState {
  readonly topologyKind: "LINEAR_SINGLE_ROW";
  readonly persons: readonly SeatingPerson[];
  readonly seats: readonly LinearSeat[];
  readonly assignments: readonly LinearAssignment[];
}

export type LinearConstraint =
  | { readonly id: string; readonly kind: "ABSOLUTE_SEAT"; readonly personId: PersonId; readonly seatIndex: number }
  | { readonly id: string; readonly kind: "AT_END"; readonly personId: PersonId }
  | { readonly id: string; readonly kind: "AT_MIDDLE"; readonly personId: PersonId }
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
  | {
      readonly id: string;
      readonly kind: "EXACT_COUNT_BETWEEN";
      readonly firstId: PersonId;
      readonly secondId: PersonId;
      readonly count: number;
    };

export interface CandidateClue {
  readonly id: string;
  readonly constraint: LinearConstraint;
  readonly languageFamilyId: string;
  readonly semanticFingerprint: string;
  readonly entitiesMentioned: readonly PersonId[];
  readonly directnessScore: number;
  readonly informationGain: number;
  readonly naturalnessScore: number;
  readonly translationRisk: "LOW";
  readonly explanationValue: number;
}

export type SeatingBlueprintId = "SEA-PBA-001" | "SEA-PBA-002" | "SEA-PBA-003" | "SEA-PBA-004";
export type SeatingQueryContractId =
  | "SEA-QC-001"
  | "SEA-QC-003"
  | "SEA-QC-008"
  | "SEA-QC-014"
  | "SEA-QC-015"
  | "SEA-QC-020";

export type SeatingMisconceptionId =
  | "SEA-MC-LIN-LEFT_RIGHT_REVERSAL"
  | "SEA-MC-LIN-IMMEDIATE_VS_KTH"
  | "SEA-MC-LIN-OFF_BY_ONE_SEAT"
  | "SEA-MC-LIN-COUNT_ENDPOINT_INCLUDED"
  | "SEA-MC-LIN-SUBJECT_REFERENCE_SWAPPED"
  | "SEA-MC-LIN-MIRROR_POSITION";

export type SeatingAnswerType = "PERSON" | "SEAT_POSITION" | "COUNT" | "PAIR" | "RELATION" | "SEQUENCE";
export type SeatingSemanticValue = string | number | readonly string[];

export interface SeatingOption {
  readonly semanticValue: SeatingSemanticValue;
  readonly semanticFingerprint: string;
  readonly display: string;
  readonly isCorrect: boolean;
  readonly misconceptionId?: SeatingMisconceptionId;
  readonly recomputation: Readonly<Record<string, unknown>>;
  readonly explanation: string;
}

export interface SeatingChildQuestion {
  readonly questionOrder: number;
  readonly queryContractId: SeatingQueryContractId;
  readonly answerType: SeatingAnswerType;
  readonly answerDeterminingFactFingerprint: string;
  readonly text: string;
  readonly options: readonly [SeatingOption, SeatingOption, SeatingOption, SeatingOption];
  readonly answerIndex: 0 | 1 | 2 | 3;
  readonly answer: SeatingSemanticValue;
  readonly explanation: string;
}

export interface SolverModel {
  readonly seatOrder: readonly PersonId[];
  readonly facing: FacingDirection;
  readonly canonicalKey: string;
}

export interface SolverAgreement {
  readonly productionKeys: readonly string[];
  readonly oracleKeys: readonly string[];
  readonly passed: boolean;
}

export interface SeatingCaseletRecord {
  readonly caseletId: string;
  readonly chapterId: "REAS-SEA";
  readonly packageId: "SEA-001";
  readonly checkpointId: "SEA-CP-001";
  readonly blueprintAuthorityId: SeatingBlueprintId;
  readonly seed: string;
  readonly locale: Locale;
  readonly setupText: string;
  readonly clueTexts: readonly string[];
  readonly hiddenStateFingerprint: string;
  readonly clueSetFingerprint: string;
  readonly solutionPolicy: "UNIQUE_CLASS";
  readonly solutionClassCount: 1;
  readonly solverOracleAgreement: SolverAgreement;
  readonly queryFactFingerprints: readonly string[];
  readonly checkpointSkillCoverage: readonly string[];
  readonly crossQuestionLeakagePassed: boolean;
  readonly proofTrace: readonly ProofEvent[];
  readonly sharedExplanation: string;
  readonly diagramText: string;
  readonly children: readonly SeatingChildQuestion[];
  readonly lifecycle: SeatingLifecycle;
}

export interface SeatingLifecycle {
  readonly discoveryStatus: "EXECUTABLE_FOUNDATION";
  readonly solveInventoryStatus: "OPEN";
  readonly queryMixStatus: "OPEN";
  readonly englishFreezeStatus: "NOT_STARTED";
  readonly permanentQlCount: 0;
  readonly questionStudioRegistered: false;
  readonly questionBankWritable: false;
  readonly testEligible: false;
  readonly publiclyPublishable: false;
}
