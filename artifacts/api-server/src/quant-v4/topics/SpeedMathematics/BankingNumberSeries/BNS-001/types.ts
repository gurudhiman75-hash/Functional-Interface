export type Bns001Language = "en" | "hi" | "pa";

export type Bns001TaskKind = "NEXT_TERM" | "MISSING_TERM" | "WRONG_TERM";

export type Bns001PatternKind =
  | "ARITHMETIC_DIFFERENCE"
  | "PROGRESSIVE_DIFFERENCE"
  | "GEOMETRIC_MULTIPLICATION"
  | "MULTIPLY_AND_ADD"
  | "INTERLEAVED_ARITHMETIC"
  | "QUARTIC_POLYNOMIAL_TERMS"
  | "POWER_DIFFERENCE"
  | "QUADRATIC_DIFFERENCE"
  | "DESCENDING_CUBE_DIFFERENCE"
  | "ODD_SQUARE_DIFFERENCE"
  | "CONSECUTIVE_CUBES"
  | "VARIABLE_MULTIPLY_SUBTRACT"
  | "VARIABLE_MULTIPLY_ADD"
  | "FRACTIONAL_GEOMETRIC"
  | "CONSTANT_DIVISION"
  | "CONSECUTIVE_PRIME_DIFFERENCE"
  | "VARIABLE_FRACTIONAL_MULTIPLIER"
  | "VARIABLE_FRACTIONAL_DIVISOR"
  | "ALTERNATING_MULTIPLY_DIVIDE"
  | "PRIME_SECOND_DIFFERENCE"
  | "INTERLEAVED_PROGRESSIVE_DIFFERENCE";

export type Bns001Difficulty = "Easy" | "Medium" | "Hard";

export type Bns001Option = Readonly<{
  text: string;
  misconceptionId: "CORRECT" | string;
  derivation: string;
}>;

export type Bns001Question = Readonly<{
  packageId: "BNS-001";
  questionId: string;
  seed: string;
  language: Bns001Language;
  examProfile: "BANKING_PRELIMS" | "BANKING_MAINS";
  optionCount: 5;
  taskKind: Bns001TaskKind;
  patternKind: Bns001PatternKind;
  difficulty: Bns001Difficulty;
  visibleSeries: readonly (number | "?")[];
  stem: string;
  options: readonly string[];
  optionMetadata: readonly Bns001Option[];
  correctIndex: number;
  answer: string;
  explanation: Readonly<{
    keyRule: string;
    working: readonly string[];
    shortcut: string;
    trap: string;
  }>;
  proof: Readonly<{
    fullSeries: readonly number[];
    hiddenIndex: number | null;
    canonicalNext: number;
    supportedGrammarMatches: readonly Bns001PatternKind[];
    independentVerifier: "PASS";
  }>;
  traceability: Readonly<{
    packageId: "BNS-001";
    contractVersion: "BNS-001-CONTENT-REVIEW-V3";
    ownership: "SPEED_MATHEMATICS_BANKING_NUMBER_SERIES";
    numberSystemOwnership: false;
    reasoningLetterSeriesOwnership: false;
    reviewStatus: "UNREVIEWED";
    questionStudioDiscoverable: false;
    questionBankStatus: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    publiclyPublishable: false;
  }>;
}>;
