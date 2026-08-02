import type { Rational } from "./foundation/types";

export const INT_CP002_FINAL_CLOSURE_PROTOTYPE_IDS = [
  "INT-CP002-CLOSE-PIECEWISE-AMOUNT",
  "INT-CP002-CLOSE-PIECEWISE-MISSING-PRINCIPAL",
  "INT-CP002-CLOSE-LEDGER-COMPARISON",
  "INT-CP002-CLOSE-SPLIT-PRINCIPAL-RATIO",
  "INT-CP002-CLOSE-EQUAL-INTEREST-PRINCIPAL-RATIO",
  "INT-CP002-CLOSE-COUNTERFACTUAL-ORIGINAL-DURATION",
  "INT-CP002-CLOSE-PARTIAL-REPAYMENT-COMPARISON",
  "INT-CP002-CLOSE-BORROW-LEND-MISSING-PRINCIPAL",
  "INT-CP002-CLOSE-BORROW-LEND-MISSING-DURATION",
  "INT-CP002-CLOSE-DAY-COUNT-BASIS-COMPARISON",
] as const;

export type IntCp002FinalClosurePrototypeId =
  (typeof INT_CP002_FINAL_CLOSURE_PROTOTYPE_IDS)[number];

export type IntCp002FinalClosureAnswerSemantic =
  | "MONEY"
  | "PRINCIPAL"
  | "RATIO"
  | "TIME_YEARS";

export type IntCp002FinalClosureDifficulty = "Medium" | "Hard";

export type IntCp002FinalClosureMisconceptionId =
  | "CORRECT"
  | "RETURN_INTEREST_NOT_AMOUNT"
  | "USE_ONE_RATE_FOR_ALL_INTERVALS"
  | "IGNORE_ONE_INTERVAL"
  | "USE_TOTAL_INTEREST_AS_SINGLE_INTERVAL"
  | "OMIT_DURATION_WEIGHT"
  | "REVERSE_LEDGER_DIFFERENCE"
  | "ADD_LEDGER_TOTALS"
  | "COMPARE_AMOUNTS_WITHOUT_COMMON_PRINCIPAL"
  | "RETURN_COMPLEMENTARY_SPLIT"
  | "ASSUME_EQUAL_SPLIT"
  | "RETURN_PART_INSTEAD_OF_RATIO"
  | "USE_RATE_RATIO_DIRECTLY"
  | "USE_DURATION_RATIO_DIRECTLY"
  | "REVERSE_PRINCIPAL_RATIO"
  | "RETURN_NEW_DURATION"
  | "RETURN_DURATION_CHANGE"
  | "ADD_DURATION_CHANGE"
  | "IGNORE_REPAYMENT_TIMING"
  | "REVERSE_EARLY_LATE_DIFFERENCE"
  | "USE_REPAYMENT_AMOUNT_AS_SAVING"
  | "OMIT_RATE_SPREAD"
  | "USE_LENDING_RATE_ONLY"
  | "USE_BORROWING_RATE_ONLY"
  | "USE_WRONG_DAY_COUNT_BASIS"
  | "RETURN_ONE_SCHEME_INTEREST";

export interface IntCp002FinalClosureOptionAudit {
  text: string;
  value: Rational;
  misconceptionId: IntCp002FinalClosureMisconceptionId;
  explanation: string;
}

export interface IntCp002FinalClosureExplanation {
  mainRule: string;
  workedSteps: string[];
  examShortcut: string;
  verification: string;
  conclusion: string;
  trapAnalysis: Array<{
    optionNumber: number;
    misconceptionId: Exclude<IntCp002FinalClosureMisconceptionId, "CORRECT">;
    explanation: string;
  }>;
}

export interface IntCp002FinalClosureState {
  values: Record<string, Rational | string | number>;
  representation: "NARRATIVE" | "TABLE" | "TIMELINE" | "COMPARISON_CARD";
}

export interface IntCp002FinalClosureQuestion {
  packageId: "INT-001";
  canonicalProblemId: "INT-CP-002";
  checkpointId: "INT-CP-002-FINAL-SATURATION";
  prototypeId: IntCp002FinalClosurePrototypeId;
  permanentQlId: null;
  frozenSolveContractId: null;
  seed: string;
  effectiveSeed: string;
  generationAttempts: number;
  language: "en";
  questionLanguageId: "en-IN";
  answerSemantic: IntCp002FinalClosureAnswerSemantic;
  difficulty: IntCp002FinalClosureDifficulty;
  stem: string;
  state: IntCp002FinalClosureState;
  solution: Rational;
  options: string[];
  optionAudit: IntCp002FinalClosureOptionAudit[];
  correctIndex: number;
  explanation: IntCp002FinalClosureExplanation;
  mathematicalFingerprint: string;
  validation: { ok: boolean; errors: string[] };
  reviewStatus: "EXECUTABLE_DISCOVERY";
  enabled: false;
  stagingStatus: "NOT_STAGED";
  registrationStatus: "NOT_REGISTERED";
  questionStudioDiscoverable: false;
  questionBankStatus: "NOT_STORED";
  testEligibility: "INELIGIBLE";
  publiclyPublishable: false;
}
