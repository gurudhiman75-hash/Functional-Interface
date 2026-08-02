import type { Rational } from "./foundation/types";
import type { IntCp002Contribution, IntCp002LedgerState } from "./cp002-foundation/types";

export const INT_CP002_WAVE02_PROTOTYPE_IDS = [
  "INT-CP002-W02-PIECEWISE-MISSING-RATE",
  "INT-CP002-W02-PIECEWISE-MISSING-DURATION",
  "INT-CP002-W02-MULTI-MISSING-PRINCIPAL",
  "INT-CP002-W02-MULTI-MISSING-RATE",
  "INT-CP002-W02-MULTI-MISSING-DURATION",
  "INT-CP002-W02-MULTI-COMMON-RATE",
  "INT-CP002-W02-EQUAL-INTEREST-MISSING-RATE",
  "INT-CP002-W02-EQUAL-INTEREST-MISSING-DURATION",
  "INT-CP002-W02-COUNTERFACTUAL-ORIGINAL-RATE",
  "INT-CP002-W02-PARTIAL-REPAYMENT-AMOUNT",
  "INT-CP002-W02-PARTIAL-REPAYMENT-TIME",
  "INT-CP002-W02-BORROW-LEND-LENDING-RATE",
  "INT-CP002-W02-DAY-COUNT-MISSING-DAYS",
] as const;

export type IntCp002Wave02PrototypeId = (typeof INT_CP002_WAVE02_PROTOTYPE_IDS)[number];
export type IntCp002Wave02AnswerSemantic =
  | "PRINCIPAL"
  | "RATE_PERCENT"
  | "TIME_YEARS"
  | "DAYS";
export type IntCp002Wave02Difficulty = "Medium" | "Hard";

export type IntCp002Wave02MisconceptionId =
  | "CORRECT"
  | "IGNORE_KNOWN_CONTRIBUTION"
  | "SUBTRACT_KNOWN_INTEREST_WRONG_WAY"
  | "USE_TOTAL_INTEREST_AS_UNKNOWN_CONTRIBUTION"
  | "OMIT_DIVIDE_BY_PRINCIPAL"
  | "OMIT_DIVIDE_BY_RATE"
  | "OMIT_DIVIDE_BY_DURATION"
  | "USE_UNWEIGHTED_AVERAGE_RATE"
  | "USE_SUM_OF_RATES"
  | "ASSUME_EQUAL_RATE"
  | "ASSUME_EQUAL_DURATION"
  | "USE_RATE_RATIO_ONLY"
  | "USE_DURATION_RATIO_ONLY"
  | "RETURN_NEW_RATE"
  | "RETURN_RATE_DIFFERENCE"
  | "ADD_RATE_DIFFERENCE"
  | "IGNORE_REPAYMENT_TIMING"
  | "APPLY_REPAYMENT_FROM_START"
  | "USE_REMAINING_PRINCIPAL_AS_REPAYMENT"
  | "USE_FULL_HORIZON_FOR_REDUCED_BALANCE"
  | "USE_PRE_REPAYMENT_DURATION"
  | "RETURN_BORROWING_RATE"
  | "ADD_BORROWING_AND_SPREAD_RATES_WRONGLY"
  | "USE_360_INSTEAD_OF_365"
  | "USE_365_INSTEAD_OF_360"
  | "TREAT_DAYS_AS_MONTHS";

export interface IntCp002Wave02OptionAudit {
  text: string;
  value: Rational;
  misconceptionId: IntCp002Wave02MisconceptionId;
  explanation: string;
}

export interface IntCp002Wave02Explanation {
  mainRule: string;
  workedSteps: string[];
  examShortcut: string;
  verification: string;
  conclusion: string;
  trapAnalysis: Array<{
    optionNumber: number;
    misconceptionId: Exclude<IntCp002Wave02MisconceptionId, "CORRECT">;
    explanation: string;
  }>;
}

export interface IntCp002Wave02State {
  values: Record<string, Rational | string | number>;
  ledger?: IntCp002LedgerState;
  comparisonLedger?: IntCp002LedgerState;
  knownContributions?: IntCp002Contribution[];
}

export interface IntCp002Wave02Question {
  packageId: "INT-001";
  canonicalProblemId: "INT-CP-002";
  waveId: "INT-CP-002-WAVE02-INVERSE-SATURATION";
  prototypeId: IntCp002Wave02PrototypeId;
  permanentQlId: null;
  frozenSolveContractId: null;
  seed: string;
  effectiveSeed: string;
  generationAttempts: number;
  language: "en";
  questionLanguageId: "en-IN";
  answerSemantic: IntCp002Wave02AnswerSemantic;
  difficulty: IntCp002Wave02Difficulty;
  stem: string;
  state: IntCp002Wave02State;
  solution: Rational;
  options: string[];
  optionAudit: IntCp002Wave02OptionAudit[];
  correctIndex: number;
  explanation: IntCp002Wave02Explanation;
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
