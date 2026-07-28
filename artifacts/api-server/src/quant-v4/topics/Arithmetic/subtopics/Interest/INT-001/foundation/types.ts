export const INT_001_ARCHETYPE_ID = "INT-001" as const;
export const INT_CP_001_ID = "INT-CP-001" as const;

export const INT_CP001_PROTOTYPE_IDS = [
  "INT-CP001-PROT-SI-FROM-PRT",
  "INT-CP001-PROT-AMOUNT-FROM-PRT",
  "INT-CP001-PROT-PRINCIPAL-FROM-INTEREST",
  "INT-CP001-PROT-PRINCIPAL-FROM-AMOUNT",
  "INT-CP001-PROT-RATE-FROM-INTEREST",
  "INT-CP001-PROT-RATE-FROM-AMOUNT",
  "INT-CP001-PROT-TIME-FROM-INTEREST",
  "INT-CP001-PROT-TIME-FROM-AMOUNT",
  "INT-CP001-PROT-INTEREST-FOR-MONTHS",
  "INT-CP001-PROT-INTEREST-FOR-DAYS",
  "INT-CP001-PROT-ANNUAL-INTEREST-FROM-TOTAL",
  "INT-CP001-PROT-INTEREST-FOR-SUBDURATION",
  "INT-CP001-PROT-RATE-FROM-AMOUNT-MULTIPLE",
  "INT-CP001-PROT-TIME-FROM-AMOUNT-MULTIPLE",
  "INT-CP001-PROT-TIME-FROM-INTEREST-MULTIPLE",
  "INT-CP001-PROT-RATE-FROM-INTEREST-PRINCIPAL-RATIO",
] as const;

export type IntCp001PrototypeId = (typeof INT_CP001_PROTOTYPE_IDS)[number];
export type IntDifficulty = "Easy" | "Medium" | "Hard";
export type IntTaskDirection = "FORWARD" | "INVERSE" | "RECONSTRUCTION";
export type IntAnswerSemantic =
  | "SIMPLE_INTEREST"
  | "TOTAL_AMOUNT"
  | "PRINCIPAL"
  | "ANNUAL_RATE_PERCENT"
  | "TIME_YEARS"
  | "ANNUAL_INTEREST";
export type IntTimePresentation = "YEARS" | "MONTHS" | "DAYS" | "MIXED";

export interface Rational {
  numerator: bigint;
  denominator: bigint;
}

export interface SimpleInterestState {
  principal: Rational;
  annualRatePercent: Rational;
  annualRate: Rational;
  timeYears: Rational;
  simpleInterest: Rational;
  amount: Rational;
}

export type IntCp001SolveRequest =
  | {
      mode: "INTEREST_FROM_PRT";
      principal: Rational;
      annualRatePercent: Rational;
      timeYears: Rational;
    }
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
      mode: "TIME_FROM_INTEREST";
      principal: Rational;
      simpleInterest: Rational;
      annualRatePercent: Rational;
    }
  | {
      mode: "TIME_FROM_AMOUNT";
      principal: Rational;
      amount: Rational;
      annualRatePercent: Rational;
    }
  | {
      mode: "ANNUAL_INTEREST_FROM_TOTAL";
      totalInterest: Rational;
      timeYears: Rational;
    }
  | {
      mode: "INTEREST_FOR_SUBDURATION";
      totalInterest: Rational;
      knownTimeYears: Rational;
      targetTimeYears: Rational;
    }
  | {
      mode: "RATE_FROM_AMOUNT_MULTIPLE";
      amountMultiple: Rational;
      timeYears: Rational;
    }
  | {
      mode: "TIME_FROM_AMOUNT_MULTIPLE";
      amountMultiple: Rational;
      annualRatePercent: Rational;
    }
  | {
      mode: "TIME_FROM_INTEREST_MULTIPLE";
      interestToPrincipalRatio: Rational;
      annualRatePercent: Rational;
    }
  | {
      mode: "RATE_FROM_INTEREST_PRINCIPAL_RATIO";
      interestToPrincipalRatio: Rational;
      timeYears: Rational;
    };

export interface IntCp001SolveResult {
  semantic: IntAnswerSemantic;
  value: Rational;
}

export interface IntCp001Context {
  scenarioId: string;
  institution: string;
  actor: string;
  instrument: string;
  purpose: string;
  currencySymbol: "₹";
}

export interface IntCp001PrototypeRegistryEntry {
  prototypeId: IntCp001PrototypeId;
  cpId: typeof INT_CP_001_ID;
  taskDirection: IntTaskDirection;
  answerSemantic: IntAnswerSemantic;
  topology:
    | "DIRECT_INTEREST"
    | "DIRECT_AMOUNT"
    | "PRINCIPAL_INVERSE"
    | "RATE_INVERSE"
    | "TIME_INVERSE"
    | "TIME_UNIT_CONVERSION"
    | "ANNUALISATION"
    | "SUBDURATION_PROPORTION"
    | "AMOUNT_MULTIPLE_INVERSE"
    | "INTEREST_RATIO_INVERSE";
  timePresentation: IntTimePresentation;
  baseDifficulty: IntDifficulty;
  permanentQlId: null;
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
}

export type VerificationDomain =
  | { kind: "DIRECT" }
  | { kind: "PRINCIPAL_GRID"; minimum: bigint; maximum: bigint; step: bigint }
  | { kind: "RATE_POOL"; values: Rational[] }
  | { kind: "TIME_POOL"; values: Rational[] };

export interface IntCp001PrototypeParameters {
  prototypeId: IntCp001PrototypeId;
  seed: string;
  context: IntCp001Context;
  request: IntCp001SolveRequest;
  hiddenState: SimpleInterestState;
  verificationDomain: VerificationDomain;
  difficulty: IntDifficulty;
  difficultyEvidence: string[];
  generationFingerprint: string;
  display: {
    timePresentation: IntTimePresentation;
    displayedMonths?: number;
    displayedDays?: number;
    dayCountBasis?: 365;
    amountMultiple?: Rational;
    interestToPrincipalRatio?: Rational;
    knownTimeYears?: Rational;
    targetTimeYears?: Rational;
  };
}

export type IntCp001MisconceptionId =
  | "CORRECT"
  | "RETURNED_AMOUNT_INSTEAD_OF_INTEREST"
  | "RETURNED_INTEREST_INSTEAD_OF_AMOUNT"
  | "OMITTED_TIME_FACTOR"
  | "OMITTED_DIVIDE_BY_100"
  | "MONTHS_TREATED_AS_YEARS"
  | "DAYS_TREATED_AS_YEARS"
  | "USED_AMOUNT_AS_PRINCIPAL"
  | "USED_INTEREST_AS_PRINCIPAL"
  | "OMITTED_ONE_PLUS"
  | "OMITTED_TIME_IN_RATE"
  | "USED_AMOUNT_IN_RATE_NUMERATOR"
  | "RATE_DECIMAL_REPORTED_AS_PERCENT"
  | "OMITTED_RATE_IN_TIME"
  | "USED_AMOUNT_IN_TIME_NUMERATOR"
  | "TIME_RECIPROCAL"
  | "TOTAL_INTEREST_REPORTED"
  | "ANNUAL_INTEREST_REPORTED"
  | "SUBDURATION_IGNORED"
  | "TARGET_DURATION_INVERTED"
  | "MULTIPLE_USED_WITHOUT_SUBTRACTING_ONE"
  | "INTEREST_RATIO_TREATED_AS_AMOUNT_MULTIPLE"
  | "COMPOUND_MODEL_USED"
  | "RATE_TIME_PRODUCT_INVERTED";

export interface IntCp001OptionAudit {
  text: string;
  result: IntCp001SolveResult;
  misconceptionId: IntCp001MisconceptionId;
}

export interface IntReasoningNode {
  id: string;
  kind: "GIVEN" | "NORMALISATION" | "RELATION" | "DERIVATION" | "VERIFICATION" | "CONCLUSION";
  text: string;
  mathLatex?: string;
  dependsOn: string[];
}

export interface IntReasoningGraph {
  nodes: IntReasoningNode[];
}

export interface IntCp001Explanation {
  notice: string;
  relation: string;
  steps: string[];
  verification: string;
  conclusion: string;
  commonTrap: string;
}

export interface VerificationResult {
  ok: boolean;
  errors: string[];
  matchingCandidates?: string[];
}

export interface IntCp001GeneratedPrototype {
  archetypeId: typeof INT_001_ARCHETYPE_ID;
  canonicalProblemId: typeof INT_CP_001_ID;
  prototypeId: IntCp001PrototypeId;
  permanentQlId: null;
  questionLanguageId: string;
  language: "en";
  seed: string;
  difficulty: IntDifficulty;
  difficultyEvidence: string[];
  taskDirection: IntTaskDirection;
  answerSemantic: IntAnswerSemantic;
  stem: string;
  parameters: IntCp001PrototypeParameters;
  solution: IntCp001SolveResult;
  options: string[];
  optionAudit: IntCp001OptionAudit[];
  correctIndex: number;
  explanation: IntCp001Explanation;
  reasoningGraph: IntReasoningGraph;
  mathematicalFingerprint: string;
  validation: VerificationResult;
  reviewStatus: "UNREVIEWED";
  questionBankStatus: "NOT_STORED";
  testEligibility: "INELIGIBLE";
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
}
