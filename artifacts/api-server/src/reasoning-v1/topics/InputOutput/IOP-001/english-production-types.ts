import type { IopPermanentQlId, IopPermanentSolveMode } from "./permanent-authorities.ts";

export type IopEnglishDifficulty = "Easy" | "Medium" | "Hard";

export interface IopEnglishTrace {
  readonly input: readonly string[];
  readonly steps: readonly (readonly string[])[];
}

export interface IopEnglishGeneratedSource {
  readonly demonstration: IopEnglishTrace;
  readonly target: IopEnglishTrace;
  readonly ruleExplanation: string;
  readonly ruleIdentifiable: true;
  readonly oracleParity: true;
}

export interface IopEnglishOption {
  readonly display: string;
  readonly semanticFingerprint: string;
  readonly isCorrect: boolean;
  readonly misconception: string;
}

export type IopEnglishQueryEvidence =
  | { readonly kind: "STEP_OUTPUT"; readonly stepNumber: number }
  | { readonly kind: "FINAL_OUTPUT" }
  | { readonly kind: "ELEMENT_AT_POSITION"; readonly stepNumber: number; readonly position: number }
  | { readonly kind: "POSITION_OF_ELEMENT"; readonly stepNumber: number; readonly element: string }
  | { readonly kind: "STEP_NUMBER"; readonly stateFingerprint: string }
  | { readonly kind: "PREVIOUS_STEP"; readonly currentStepNumber: number }
  | { readonly kind: "MISSING_STEP"; readonly missingStepNumber: number }
  | { readonly kind: "REMAINING_STEP_COUNT"; readonly stepNumber: number };

export interface IopEnglishChildQuestion {
  readonly questionOrder: 1 | 2 | 3 | 4;
  readonly kind: IopPermanentSolveMode;
  readonly evidence: IopEnglishQueryEvidence;
  readonly text: string;
  readonly options: readonly [IopEnglishOption, IopEnglishOption, IopEnglishOption, IopEnglishOption];
  readonly answerIndex: 0 | 1 | 2 | 3;
  readonly answerDisplay: string;
  readonly explanation: string;
}

export interface IopEnglishProductionCaselet {
  readonly caseletId: string;
  readonly packageId: "IOP-001";
  readonly chapterId: "REAS-INP";
  readonly qlId: IopPermanentQlId;
  readonly sourceModeId: string;
  readonly seed: string;
  readonly locale: "en-IN";
  readonly examProfile: "BANKING";
  readonly difficulty: IopEnglishDifficulty;
  readonly directions: string;
  readonly demonstration: IopEnglishTrace;
  readonly target: IopEnglishTrace;
  readonly ruleExplanation: string;
  readonly sourceEvidenceIds: readonly string[];
  readonly safeguards: {
    readonly sourceWhitelisted: true;
    readonly ruleIdentifiable: true;
    readonly oracleParity: true;
    readonly queryOracleParity: true;
  };
  readonly children: readonly [IopEnglishChildQuestion, IopEnglishChildQuestion, IopEnglishChildQuestion, IopEnglishChildQuestion];
  readonly lifecycle: {
    readonly maturity: "ENGLISH_REVIEW_CANDIDATE" | "ENGLISH_FROZEN";
    readonly permanentQlCount: 8;
    readonly englishFreeze: boolean;
    readonly questionStudioDiscoverable: false;
    readonly questionBankWritable: false;
    readonly testEligible: false;
    readonly publiclyPublishable: false;
    readonly hindiPunjabiStatus: "NOT_STARTED";
  };
}
