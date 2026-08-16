export type IopLocale = "en-IN";
export type IopCheckpointId = "IOP-CP-001" | "IOP-CP-002" | "IOP-CP-003" | "IOP-CP-004";
export type IopTokenKind = "WORD" | "NUMBER";
export type IopSelectionKey = "ALPHABETICAL" | "NUMERIC_VALUE";
export type IopSelectionDirection = "ASC" | "DESC";
export type IopPlacement = "LEFT_FIXED" | "RIGHT_FIXED";
export type IopSchedule = "SINGLE_PHASE" | "BLOCKED_PHASES" | "ALTERNATING_PHASES" | "SIMULTANEOUS_PHASES";
export type IopDifficulty = "Easy" | "Medium" | "Hard";

export interface IopToken {
  readonly id: string;
  readonly kind: IopTokenKind;
  readonly visibleValue: string;
  readonly originalPosition: number;
}

export interface IopPhaseRule {
  readonly id: string;
  readonly eligibleKind: IopTokenKind;
  readonly selectionKey: IopSelectionKey;
  readonly direction: IopSelectionDirection;
  readonly placement: IopPlacement;
}

export interface IopMachineRule {
  readonly id: string;
  readonly checkpointId: IopCheckpointId;
  readonly schedule: IopSchedule;
  readonly phases: readonly IopPhaseRule[];
}

export interface IopActionTrace {
  readonly phaseId: string;
  readonly tokenId: string;
  readonly tokenValue: string;
  readonly fromIndex: number;
  readonly toIndex: number;
  readonly placement: IopPlacement;
}

export interface IopMachineStep {
  readonly stepNumber: number;
  readonly tokens: readonly IopToken[];
  readonly actions: readonly IopActionTrace[];
  readonly stateFingerprint: string;
}

export interface IopMachineTrace {
  readonly input: readonly IopToken[];
  readonly steps: readonly IopMachineStep[];
  readonly final: readonly IopToken[];
  readonly finalFingerprint: string;
  readonly ruleFingerprint: string;
}

export type IopPrototypeId =
  | "IOP-CP001-PROT-001"
  | "IOP-CP001-PROT-002"
  | "IOP-CP001-PROT-003"
  | "IOP-CP002-PROT-001"
  | "IOP-CP002-PROT-002"
  | "IOP-CP002-PROT-003"
  | "IOP-CP003-PROT-001"
  | "IOP-CP003-PROT-002"
  | "IOP-CP003-PROT-003"
  | "IOP-CP004-PROT-001"
  | "IOP-CP004-PROT-002"
  | "IOP-CP004-PROT-003";

export interface IopPrototypeAuthority {
  readonly prototypeId: IopPrototypeId;
  readonly checkpointId: IopCheckpointId;
  readonly title: string;
  readonly rule: IopMachineRule;
  readonly wordCount: number;
  readonly numberCount: number;
  readonly sourceStatus: "DISCOVERY_HYPOTHESIS_PENDING_SOURCE_SATURATION";
}

export type IopQueryKind = "STEP_OUTPUT" | "ELEMENT_AT_POSITION" | "POSITION_OF_ELEMENT" | "FINAL_OUTPUT";
export type IopMisconceptionId =
  | "IOP-MC-PREVIOUS_STEP"
  | "IOP-MC-NEXT_STEP"
  | "IOP-MC-INPUT_AS_STEP"
  | "IOP-MC-WRONG_POSITION"
  | "IOP-MC-WRONG_ELEMENT"
  | "IOP-MC-WRONG_FINAL_STATE";

export interface IopOption {
  readonly display: string;
  readonly semanticFingerprint: string;
  readonly isCorrect: boolean;
  readonly misconceptionId?: IopMisconceptionId;
}

export type IopQueryEvidence =
  | { readonly kind: "STEP_OUTPUT"; readonly stepNumber: number }
  | { readonly kind: "ELEMENT_AT_POSITION"; readonly stepNumber: number; readonly position: number }
  | { readonly kind: "POSITION_OF_ELEMENT"; readonly stepNumber: number; readonly tokenId: string }
  | { readonly kind: "FINAL_OUTPUT" };

export interface IopChildQuestion {
  readonly questionOrder: 1 | 2 | 3 | 4;
  readonly kind: IopQueryKind;
  readonly evidence: IopQueryEvidence;
  readonly text: string;
  readonly options: readonly [IopOption, IopOption, IopOption, IopOption];
  readonly answerIndex: 0 | 1 | 2 | 3;
  readonly answerDisplay: string;
  readonly explanation: string;
}

export interface IopIdentifiabilityEvidence {
  readonly candidateRulesTested: number;
  readonly matchingRuleFingerprints: readonly string[];
  readonly intendedRuleFingerprint: string;
  readonly passed: boolean;
}

export interface IopLifecycle {
  readonly maturity: "EXECUTABLE_DISCOVERY_PROOF";
  readonly permanentQlCount: 0;
  readonly questionStudioDiscoverable: false;
  readonly questionBankWritable: false;
  readonly testEligible: false;
  readonly publiclyPublishable: false;
  readonly hindiPunjabiStatus: "NOT_STARTED";
}

export interface IopCaselet {
  readonly caseletId: string;
  readonly packageId: "IOP-001";
  readonly chapterId: "REAS-INP";
  readonly checkpointId: IopCheckpointId;
  readonly prototypeId: IopPrototypeId;
  readonly seed: string;
  readonly locale: IopLocale;
  readonly difficulty: IopDifficulty;
  readonly directions: string;
  readonly demonstration: IopMachineTrace;
  readonly target: IopMachineTrace;
  readonly ruleExplanation: string;
  readonly identifiability: IopIdentifiabilityEvidence;
  readonly oracleParity: boolean;
  readonly children: readonly [IopChildQuestion, IopChildQuestion, IopChildQuestion, IopChildQuestion];
  readonly lifecycle: IopLifecycle;
}
