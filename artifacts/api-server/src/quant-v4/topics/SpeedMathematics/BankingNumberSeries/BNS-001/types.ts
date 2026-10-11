export type Bns001Language = "en" | "hi" | "pa";

export type Bns001TaskKind = "NEXT_TERM" | "MISSING_TERM" | "WRONG_TERM";

export type Bns001PatternKind =
  | "ARITHMETIC_DIFFERENCE"
  | "PROGRESSIVE_DIFFERENCE"
  | "GEOMETRIC_MULTIPLICATION"
  | "MULTIPLY_AND_ADD"
  | "INTERLEAVED_ARITHMETIC";

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
  examProfile: "BANKING_PRELIMS";
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
    contractVersion: "BNS-001-CONTENT-REVIEW-V2";
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
