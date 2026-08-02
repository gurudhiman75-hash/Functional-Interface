import type { Rational } from "./foundation/types";
import type { IntCp002Contribution, IntCp002LedgerState } from "./cp002-foundation/types";

export const INT_CP002_WAVE01_PROTOTYPE_IDS = [
  "INT-CP002-PROT-PIECEWISE-RATES",
  "INT-CP002-PROT-MULTIPLE-DEPOSITS",
  "INT-CP002-PROT-SPLIT-PRINCIPAL",
  "INT-CP002-PROT-EQUAL-INTEREST",
  "INT-CP002-PROT-COUNTERFACTUAL-CHANGE",
  "INT-CP002-PROT-PARTIAL-REPAYMENT",
  "INT-CP002-PROT-BORROW-LEND-SPREAD",
  "INT-CP002-PROT-DAY-COUNT",
] as const;

export type IntCp002Wave01PrototypeId = (typeof INT_CP002_WAVE01_PROTOTYPE_IDS)[number];
export type IntCp002Wave01AnswerSemantic = "MONEY" | "PRINCIPAL";
export type IntCp002Wave01Difficulty = "Easy" | "Medium" | "Hard";

export type IntCp002Wave01MisconceptionId =
  | "CORRECT"
  | "APPLY_LATEST_RATE_TO_ALL_INTERVALS"
  | "APPLY_FIRST_RATE_TO_ALL_INTERVALS"
  | "IGNORE_ONE_CONTRIBUTION"
  | "USE_FIRST_TERMS_FOR_ALL_DEPOSITS"
  | "USE_SECOND_TERMS_FOR_ALL_DEPOSITS"
  | "USE_COMPLEMENTARY_SPLIT"
  | "ASSUME_EQUAL_SPLIT"
  | "RETURN_TOTAL_PRINCIPAL"
  | "ASSUME_EQUAL_PRINCIPAL"
  | "IGNORE_DURATION_RATIO"
  | "IGNORE_RATE_RATIO"
  | "RETURN_NEW_TOTAL_INTEREST"
  | "RETURN_OLD_TOTAL_INTEREST"
  | "ADD_RATES_INSTEAD_OF_SUBTRACTING"
  | "IGNORE_REPAYMENT"
  | "APPLY_REPAYMENT_FROM_START"
  | "OMIT_POST_REPAYMENT_SEGMENT"
  | "ADD_BORROW_AND_LEND_RATES"
  | "RETURN_LENDING_INTEREST"
  | "RETURN_BORROWING_INTEREST"
  | "USE_WRONG_DAY_COUNT_BASIS"
  | "TREAT_DAYS_AS_MONTHS"
  | "TREAT_DAYS_AS_YEARS";

export interface IntCp002Wave01OptionAudit {
  text: string;
  value: Rational;
  misconceptionId: IntCp002Wave01MisconceptionId;
  explanation: string;
}

export interface IntCp002Wave01Explanation {
  mainRule: string;
  workedSteps: string[];
  examShortcut: string;
  verification: string;
  conclusion: string;
  trapAnalysis: Array<{
    optionNumber: number;
    misconceptionId: Exclude<IntCp002Wave01MisconceptionId, "CORRECT">;
    explanation: string;
  }>;
}

export interface IntCp002Wave01SourceState {
  ledger?: IntCp002LedgerState;
  comparisonLedger?: IntCp002LedgerState;
  contributions?: IntCp002Contribution[];
  values: Record<string, Rational | string | number>;
}

export interface IntCp002Wave01GeneratedPrototype {
  packageId: "INT-001";
  canonicalProblemId: "INT-CP-002";
  prototypeId: IntCp002Wave01PrototypeId;
  permanentQlId: null;
  frozenSolveContractId: null;
  seed: string;
  language: "en";
  questionLanguageId: "en-IN";
  answerSemantic: IntCp002Wave01AnswerSemantic;
  difficulty: IntCp002Wave01Difficulty;
  stem: string;
  sourceState: IntCp002Wave01SourceState;
  solution: Rational;
  options: string[];
  optionAudit: IntCp002Wave01OptionAudit[];
  correctIndex: number;
  explanation: IntCp002Wave01Explanation;
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
