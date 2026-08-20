export const SEA002_CP006_BLUEPRINT_IDS = [
  "SEA-PBA-021",
  "SEA-PBA-022",
  "SEA-PBA-023",
  "SEA-PBA-024",
] as const;

export type Sea002Cp006BlueprintId = (typeof SEA002_CP006_BLUEPRINT_IDS)[number];
export type Sea002ParallelRow = "TOP" | "BOTTOM";
export type Sea002ParallelFacing = "NORTH" | "SOUTH";
export type Sea002ParallelSide = "LEFT" | "RIGHT";
export type Sea002PersonId = string;

export interface Sea002ParallelSeat {
  readonly row: Sea002ParallelRow;
  readonly column: number;
}

export interface Sea002Cp006State {
  readonly seatCountPerRow: number;
  readonly top: readonly Sea002PersonId[];
  readonly bottom: readonly Sea002PersonId[];
}

export type Sea002Cp006Clue =
  | Readonly<{ kind: "ROW_MEMBERSHIP"; person: Sea002PersonId; row: Sea002ParallelRow }>
  | Readonly<{ kind: "OPPOSITE"; first: Sea002PersonId; second: Sea002PersonId }>
  | Readonly<{ kind: "NOT_OPPOSITE"; first: Sea002PersonId; second: Sea002PersonId }>
  | Readonly<{ kind: "SAME_ROW_RELATIVE"; target: Sea002PersonId; reference: Sea002PersonId; side: Sea002ParallelSide; steps: number }>
  | Readonly<{ kind: "SAME_ROW_GAP"; first: Sea002PersonId; second: Sea002PersonId; between: number }>
  | Readonly<{ kind: "FACING_REFERENT_RELATIVE"; targetFacee: Sea002PersonId; referenceFacee: Sea002PersonId; side: Sea002ParallelSide; steps: number }>
  | Readonly<{ kind: "END_POSITION"; person: Sea002PersonId; row: Sea002ParallelRow; end: "LEFT" | "RIGHT" }>
  | Readonly<{ kind: "DIAGONAL"; first: Sea002PersonId; second: Sea002PersonId }>;

export type Sea002Cp006AnswerType = "PERSON" | "PAIR" | "COUNT" | "RELATION";

export interface Sea002Cp006Option {
  readonly value: string;
  readonly isCorrect: boolean;
  readonly misconceptionId?:
    | "SEA-MC-ROW-OBSERVER_LEFT_USED"
    | "SEA-MC-ROW-DIAGONAL_FOR_OPPOSITE"
    | "SEA-MC-ROW-SAME_ROW_FOR_OTHER_ROW"
    | "SEA-MC-ROW-FACING_IGNORED"
    | "SEA-MC-ROW-COLUMN_SHIFT"
    | "SEA-MC-ROW-GAP_ENDPOINT_INCLUDED"
    | "SEA-MC-ROW-FACING_REFERENT_IGNORED";
  readonly explanation: string;
}

export interface Sea002Cp006ChildQuestion {
  readonly questionOrder: 1 | 2 | 3 | 4;
  readonly queryContractId: "SEA-QC-003" | "SEA-QC-006" | "SEA-QC-009" | "SEA-QC-010" | "SEA-QC-011" | "SEA-QC-012";
  readonly answerType: Sea002Cp006AnswerType;
  readonly answerDeterminingFactFingerprint: string;
  readonly text: string;
  readonly options: readonly [Sea002Cp006Option, Sea002Cp006Option, Sea002Cp006Option, Sea002Cp006Option];
  readonly answerIndex: 0 | 1 | 2 | 3;
  readonly answer: string;
  readonly explanation: string;
}

export interface Sea002Cp006Caselet {
  readonly packageId: "SEA-002";
  readonly checkpointId: "SEA-CP-006";
  readonly blueprintAuthorityId: Sea002Cp006BlueprintId;
  readonly seed: string;
  readonly caseletId: string;
  readonly setupText: string;
  readonly people: readonly Sea002PersonId[];
  readonly state: Sea002Cp006State;
  readonly clues: readonly Sea002Cp006Clue[];
  readonly clueTexts: readonly string[];
  readonly sharedExplanation: string;
  readonly diagramText: string;
  readonly diagram: Readonly<{ kind: "PARALLEL_ROWS_SVG"; svg: string; text: string }>;
  readonly children: readonly [Sea002Cp006ChildQuestion, Sea002Cp006ChildQuestion, Sea002Cp006ChildQuestion, Sea002Cp006ChildQuestion];
  readonly solutionCount: 1;
  readonly solverOracleAgreement: Readonly<{ passed: true; productionSolutions: 1; oracleSolutions: 1 }>;
  readonly checkpointSkillCoverage: readonly ["ROW_IDENTITY", "OPPOSITE_ALIGNMENT", "PERSON_RELATIVE_DIRECTION"];
  readonly structuralFingerprint: string;
  readonly permanentQlAllocated: false;
  readonly englishFrozen: false;
  readonly localizationFrozen: false;
  readonly questionStudioRegistered: false;
  readonly questionBankWritable: false;
  readonly mockTestEligible: false;
  readonly publiclyPublishable: false;
}