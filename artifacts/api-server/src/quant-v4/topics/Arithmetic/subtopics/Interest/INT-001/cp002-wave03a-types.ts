import type { Rational } from "./foundation/types";

export const INT_CP002_WAVE03A_PROTOTYPE_IDS = [
  "INT-CP002-W03A-PIECEWISE-MISSING-PRINCIPAL",
  "INT-CP002-W03A-PIECEWISE-THREE-INTERVAL-DIRECT",
  "INT-CP002-W03A-THREE-DEPOSIT-DIRECT",
  "INT-CP002-W03A-THREE-DEPOSIT-MISSING-PRINCIPAL",
  "INT-CP002-W03A-SPLIT-PRINCIPAL-RATIO",
  "INT-CP002-W03A-EQUAL-INTEREST-SPLIT",
  "INT-CP002-W03A-TIME-CHANGE-DIFFERENCE",
  "INT-CP002-W03A-ORIGINAL-DURATION",
  "INT-CP002-W03A-TWO-REPAYMENTS-DIRECT",
  "INT-CP002-W03A-BORROW-LEND-MISSING-PRINCIPAL",
  "INT-CP002-W03A-BORROW-LEND-MISSING-DURATION",
  "INT-CP002-W03A-MONTH-BASED-LEDGER",
  "INT-CP002-W03A-FRACTIONAL-YEAR-LEDGER",
  "INT-CP002-W03A-MIXED-DAY-YEAR-LEDGER",
] as const;

export type IntCp002Wave03aPrototypeId = (typeof INT_CP002_WAVE03A_PROTOTYPE_IDS)[number];
export type IntCp002Wave03aAnswerSemantic = "MONEY" | "PRINCIPAL" | "RATIO" | "TIME_YEARS";
export type IntCp002Wave03aDifficulty = "Medium" | "Hard";

export type IntCp002Wave03aMisconceptionId =
  | "CORRECT"
  | "IGNORE_INTERVAL"
  | "USE_SINGLE_RATE_FOR_ALL"
  | "USE_TOTAL_TIME_FOR_EACH_INTERVAL"
  | "IGNORE_ONE_DEPOSIT"
  | "USE_FIRST_TERMS_FOR_ALL"
  | "USE_TOTAL_INTEREST_AS_MISSING_COMPONENT"
  | "SUBTRACT_KNOWN_INTEREST_WRONG_WAY"
  | "OMIT_DURATION_FACTOR"
  | "REVERSE_RATIO"
  | "ASSUME_EQUAL_SPLIT"
  | "RETURN_TOTAL_PRINCIPAL"
  | "ASSUME_EQUAL_PRINCIPAL"
  | "IGNORE_RATE_RATIO"
  | "IGNORE_TIME_RATIO"
  | "RETURN_NEW_TOTAL"
  | "RETURN_OLD_TOTAL"
  | "ADD_DURATIONS"
  | "RETURN_NEW_DURATION"
  | "RETURN_DURATION_CHANGE"
  | "ADD_DURATION_CHANGE"
  | "IGNORE_FIRST_REPAYMENT"
  | "IGNORE_SECOND_REPAYMENT"
  | "APPLY_BOTH_REPAYMENTS_FROM_START"
  | "RETURN_RATE_SPREAD"
  | "RETURN_BORROWING_INTEREST"
  | "OMIT_RATE_SPREAD"
  | "RETURN_ONE_YEAR_EQUIVALENT"
  | "TREAT_MONTHS_AS_YEARS"
  | "DIVIDE_MONTHS_BY_100"
  | "ROUND_FRACTIONAL_YEAR"
  | "USE_WRONG_DAY_COUNT_BASIS"
  | "IGNORE_DAY_CONTRIBUTION";

export interface IntCp002Wave03aOptionAudit {
  text: string;
  value: Rational;
  misconceptionId: IntCp002Wave03aMisconceptionId;
  explanation: string;
}

export interface IntCp002Wave03aExplanation {
  mainRule: string;
  workedSteps: string[];
  examShortcut: string;
  verification: string;
  conclusion: string;
  trapAnalysis: Array<{
    optionNumber: number;
    misconceptionId: Exclude<IntCp002Wave03aMisconceptionId, "CORRECT">;
    explanation: string;
  }>;
}

export interface IntCp002Wave03aQuestion {
  packageId: "INT-001";
  canonicalProblemId: "INT-CP-002";
  waveId: "INT-CP-002-WAVE03A-EDGE-RUNTIME";
  prototypeId: IntCp002Wave03aPrototypeId;
  permanentQlId: null;
  frozenSolveContractId: null;
  seed: string;
  effectiveSeed: string;
  generationAttempts: number;
  language: "en";
  questionLanguageId: "en-IN";
  answerSemantic: IntCp002Wave03aAnswerSemantic;
  difficulty: IntCp002Wave03aDifficulty;
  stem: string;
  state: { values: Record<string, Rational | string | number> };
  solution: Rational;
  options: string[];
  optionAudit: IntCp002Wave03aOptionAudit[];
  correctIndex: number;
  explanation: IntCp002Wave03aExplanation;
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
