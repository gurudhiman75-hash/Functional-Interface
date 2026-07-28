import type { Rational } from "../foundation/types";

export const INT_CP001_WAVE2_PROTOTYPE_IDS = [
  "INT-CP001-W2-PROT-AMOUNT-FOR-MONTHS",
  "INT-CP001-W2-PROT-AMOUNT-FOR-DAYS",
  "INT-CP001-W2-PROT-PRINCIPAL-FROM-INTEREST-MONTHS",
  "INT-CP001-W2-PROT-PRINCIPAL-FROM-AMOUNT-MONTHS",
  "INT-CP001-W2-PROT-RATE-FROM-INTEREST-MONTHS",
  "INT-CP001-W2-PROT-RATE-FROM-AMOUNT-MONTHS",
  "INT-CP001-W2-PROT-TIME-MONTHS-FROM-INTEREST",
  "INT-CP001-W2-PROT-TIME-MONTHS-FROM-AMOUNT",
  "INT-CP001-W2-PROT-ANNUAL-INTEREST-FROM-TWO-AMOUNTS",
  "INT-CP001-W2-PROT-PRINCIPAL-FROM-TWO-AMOUNTS",
  "INT-CP001-W2-PROT-RATE-FROM-TWO-AMOUNTS",
  "INT-CP001-W2-PROT-RATE-FROM-TWO-AMOUNT-RATIO",
  "INT-CP001-W2-PROT-AMOUNT-MULTIPLE-FROM-RATE-TIME",
  "INT-CP001-W2-PROT-INTEREST-RATIO-FROM-RATE-TIME",
] as const;

export type IntCp001Wave2PrototypeId = (typeof INT_CP001_WAVE2_PROTOTYPE_IDS)[number];
export type IntCp001Wave2Difficulty = "Easy" | "Medium" | "Hard";
export type IntCp001Wave2TaskDirection = "FORWARD" | "INVERSE" | "RECONSTRUCTION";
export type IntCp001Wave2AnswerSemantic =
  | "TOTAL_AMOUNT"
  | "PRINCIPAL"
  | "ANNUAL_RATE_PERCENT"
  | "TIME_MONTHS"
  | "ANNUAL_INTEREST"
  | "AMOUNT_MULTIPLE"
  | "INTEREST_TO_PRINCIPAL_RATIO";

export interface IntCp001Wave2Context {
  scenarioId: string;
  institution: string;
  actor: string;
  instrument: string;
  purpose: string;
  currencySymbol: "₹";
}

export interface SimpleInterestTimelineState {
  principal: Rational;
  annualRatePercent: Rational;
  annualRate: Rational;
  earlierTimeYears: Rational;
  laterTimeYears: Rational;
  earlierInterest: Rational;
  laterInterest: Rational;
  earlierAmount: Rational;
  laterAmount: Rational;
  annualInterest: Rational;
}

export type IntCp001Wave2SolveRequest =
  | {
      mode: "AMOUNT_FROM_PRT";
      principal: Rational;
      annualRatePercent: Rational;
      timeYears: Rational;
    }
  | {
      mode: "PRINCIPAL_FROM_INTEREST";
      simpleInterest: Rational;
      annualRatePercent: Rational;
      timeYears: Rational;
    }
  | {
      mode: "PRINCIPAL_FROM_AMOUNT";
      amount: Rational;
      annualRatePercent: Rational;
      timeYears: Rational;
    }
  | {
      mode: "RATE_FROM_INTEREST";
      principal: Rational;
      simpleInterest: Rational;
      timeYears: Rational;
    }
  | {
      mode: "RATE_FROM_AMOUNT";
      principal: Rational;
      amount: Rational;
      timeYears: Rational;
    }
  | {
      mode: "TIME_MONTHS_FROM_INTEREST";
      principal: Rational;
      simpleInterest: Rational;
      annualRatePercent: Rational;
    }
  | {
      mode: "TIME_MONTHS_FROM_AMOUNT";
      principal: Rational;
      amount: Rational;
      annualRatePercent: Rational;
    }
  | {
      mode: "ANNUAL_INTEREST_FROM_TWO_AMOUNTS";
      earlierAmount: Rational;
      laterAmount: Rational;
      earlierTimeYears: Rational;
      laterTimeYears: Rational;
    }
  | {
      mode: "PRINCIPAL_FROM_TWO_AMOUNTS";
      earlierAmount: Rational;
      laterAmount: Rational;
      earlierTimeYears: Rational;
      laterTimeYears: Rational;
    }
  | {
      mode: "RATE_FROM_TWO_AMOUNTS";
      earlierAmount: Rational;
      laterAmount: Rational;
      earlierTimeYears: Rational;
      laterTimeYears: Rational;
    }
  | {
      mode: "RATE_FROM_TWO_AMOUNT_RATIO";
      laterToEarlierAmountRatio: Rational;
      earlierTimeYears: Rational;
      laterTimeYears: Rational;
    }
  | {
      mode: "AMOUNT_MULTIPLE_FROM_RATE_TIME";
      annualRatePercent: Rational;
      timeYears: Rational;
    }
  | {
      mode: "INTEREST_RATIO_FROM_RATE_TIME";
      annualRatePercent: Rational;
      timeYears: Rational;
    };

export interface IntCp001Wave2SolveResult {
  semantic: IntCp001Wave2AnswerSemantic;
  value: Rational;
}

export type IntCp001Wave2VerificationDomain =
  | { kind: "DIRECT" }
  | { kind: "PRINCIPAL_GRID"; minimum: bigint; maximum: bigint; step: bigint }
  | { kind: "RATE_POOL"; values: Rational[] }
  | { kind: "MONTH_POOL"; values: Rational[] };

export interface IntCp001Wave2PrototypeParameters {
  prototypeId: IntCp001Wave2PrototypeId;
  seed: string;
  context: IntCp001Wave2Context;
  request: IntCp001Wave2SolveRequest;
  hiddenState: SimpleInterestTimelineState;
  verificationDomain: IntCp001Wave2VerificationDomain;
  difficulty: IntCp001Wave2Difficulty;
  difficultyEvidence: string[];
  generationFingerprint: string;
  display: {
    displayedMonths?: number;
    displayedDays?: number;
    dayCountBasis?: 365;
    earlierTimeYears?: Rational;
    laterTimeYears?: Rational;
    laterToEarlierAmountRatio?: Rational;
  };
}

export interface IntCp001Wave2RegistryEntry {
  prototypeId: IntCp001Wave2PrototypeId;
  taskDirection: IntCp001Wave2TaskDirection;
  answerSemantic: IntCp001Wave2AnswerSemantic;
  topology:
    | "DIRECT_AMOUNT_REPRESENTATION"
    | "MONTH_EVIDENCE_INVERSE"
    | "MONTH_ANSWER_INVERSE"
    | "TWO_TIME_AMOUNT_DIFFERENCE"
    | "TWO_TIME_AMOUNT_RECONSTRUCTION"
    | "TWO_TIME_AMOUNT_RATIO"
    | "DIRECT_RATIO";
  baseDifficulty: IntCp001Wave2Difficulty;
  permanentQlId: null;
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
}

export type IntCp001Wave2MisconceptionId =
  | "CORRECT"
  | "RETURNED_INTEREST_INSTEAD_OF_AMOUNT"
  | "MONTHS_TREATED_AS_YEARS"
  | "DAYS_TREATED_AS_YEARS"
  | "USED_AMOUNT_AS_PRINCIPAL"
  | "USED_INTEREST_AS_PRINCIPAL"
  | "OMITTED_TIME_FACTOR"
  | "OMITTED_ONE_PLUS"
  | "OMITTED_DIVIDE_BY_100"
  | "RATE_DECIMAL_REPORTED_AS_PERCENT"
  | "OMITTED_TIME_IN_RATE"
  | "USED_AMOUNT_IN_RATE_NUMERATOR"
  | "YEARS_REPORTED_AS_MONTHS"
  | "MONTHS_DIVIDED_BY_12"
  | "MONTHS_MULTIPLIED_TWICE"
  | "AMOUNT_GAP_REPORTED"
  | "TIME_GAP_IGNORED"
  | "LATER_TIME_USED_INSTEAD_OF_GAP"
  | "EARLIER_AMOUNT_USED_AS_PRINCIPAL"
  | "LATER_AMOUNT_USED_AS_PRINCIPAL"
  | "ANNUAL_INTEREST_USED_AS_RATE"
  | "RATIO_MINUS_ONE_OMITTED"
  | "EARLIER_TIME_RATIO_TERM_OMITTED"
  | "AMOUNT_MULTIPLE_REPORTED_AS_INTEREST_RATIO"
  | "INTEREST_RATIO_REPORTED_AS_AMOUNT_MULTIPLE"
  | "RATE_TIME_PRODUCT_REPORTED_AS_PERCENT"
  | "RECIPROCAL_RATIO"
  | "PLAUSIBLE_SCALE_ERROR";

export interface IntCp001Wave2OptionAudit {
  text: string;
  result: IntCp001Wave2SolveResult;
  misconceptionId: IntCp001Wave2MisconceptionId;
}

export interface IntCp001Wave2Explanation {
  notice: string;
  relation: string;
  steps: string[];
  verification: string;
  conclusion: string;
  commonTrap: string;
}

export interface IntCp001Wave2ReasoningNode {
  id: string;
  kind: "GIVEN" | "NORMALISATION" | "RELATION" | "DERIVATION" | "VERIFICATION" | "CONCLUSION";
  text: string;
  mathLatex?: string;
  dependsOn: string[];
}

export interface IntCp001Wave2ReasoningGraph {
  nodes: IntCp001Wave2ReasoningNode[];
}

export interface IntCp001Wave2VerificationResult {
  ok: boolean;
  errors: string[];
  matchingCandidates?: string[];
}

export interface IntCp001Wave2GeneratedPrototype {
  archetypeId: "INT-001";
  canonicalProblemId: "INT-CP-001";
  discoveryWaveId: "INT-CP001-GAP-WAVE-02";
  prototypeId: IntCp001Wave2PrototypeId;
  permanentQlId: null;
  questionLanguageId: string;
  language: "en";
  seed: string;
  difficulty: IntCp001Wave2Difficulty;
  difficultyEvidence: string[];
  taskDirection: IntCp001Wave2TaskDirection;
  answerSemantic: IntCp001Wave2AnswerSemantic;
  stem: string;
  parameters: IntCp001Wave2PrototypeParameters;
  solution: IntCp001Wave2SolveResult;
  options: string[];
  optionAudit: IntCp001Wave2OptionAudit[];
  correctIndex: number;
  explanation: IntCp001Wave2Explanation;
  reasoningGraph: IntCp001Wave2ReasoningGraph;
  mathematicalFingerprint: string;
  validation: IntCp001Wave2VerificationResult;
  reviewStatus: "UNREVIEWED";
  questionBankStatus: "NOT_STORED";
  testEligibility: "INELIGIBLE";
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
}

export type { Rational };
