export type NumDifficulty = "Easy" | "Medium" | "Hard";

export const NUM_CP003_WAVE03_IDS = [
  "NUM-CP003-W3-PROT-MISSING-DIGIT-IN-DIFFERENCE",
  "NUM-CP003-W3-PROT-MISSING-DIGIT-IN-PRODUCT",
  "NUM-CP003-W3-PROT-TWO-DIGIT-PAIR-COUNT",
  "NUM-CP003-W3-PROT-COUNT-DIVISIBLE-BY-EITHER",
  "NUM-CP003-W3-PROT-COUNT-DIVISIBLE-BY-NEITHER",
  "NUM-CP003-W3-PROT-COUNT-DIVISIBLE-BY-EXACTLY-ONE",
  "NUM-CP003-W3-PROT-MISSING-DIGIT-DATA-SUFFICIENCY",
  "NUM-CP003-W3-PROT-GUARANTEED-POWER-DIFFERENCE-DIVISOR",
  "NUM-CP003-W3-PROT-DIVISIBILITY-CLAIM-VERIFICATION",
] as const;

export type NumCp003Wave03Id = (typeof NUM_CP003_WAVE03_IDS)[number];
export type Wave03AnswerSemantic =
  | "DIGIT"
  | "COUNT"
  | "SUFFICIENCY_CLASS"
  | "DIVISOR"
  | "TRUTH_CLAIM";

export type Wave03MisconceptionId =
  | "CORRECT"
  | "ARITHMETIC_RESULT_ERROR"
  | "NON_ZERO_REMAINDER"
  | "PAIR_COUNT_OFF_BY_ONE"
  | "COUNTED_ONLY_FIRST_RULE"
  | "COUNTED_ONLY_SECOND_RULE"
  | "DOUBLE_COUNTED_OVERLAP"
  | "FAILED_TO_REMOVE_OVERLAP"
  | "SUBTRACTED_OVERLAP_ONCE"
  | "SUBTRACTED_OVERLAP_TWICE"
  | "USED_UNION_INSTEAD_OF_COMPLEMENT"
  | "USED_TOTAL_RANGE_SIZE"
  | "STATEMENT_I_ONLY_MISREAD"
  | "STATEMENT_II_ONLY_MISREAD"
  | "BOTH_TOGETHER_MISREAD"
  | "INSUFFICIENT_MISREAD"
  | "USED_SUM_INSTEAD_OF_DIFFERENCE"
  | "USED_EXPONENT_AS_DIVISOR"
  | "USED_BASE_PRODUCT"
  | "FALSE_GENERALISATION"
  | "CHECKED_EXAMPLES_ONLY";

export interface Wave03OptionAudit {
  text: string;
  misconceptionId: Wave03MisconceptionId;
  diagnostic: string;
}

export interface Wave03Explanation {
  coreConcept: string;
  strategy: string;
  steps: string[];
  shortcut: string;
  verification: string;
  conclusion: string;
  traps: string[];
}

export interface NumReasoningNode {
  id: string;
  kind: "GIVEN" | "RULE" | "ENUMERATION" | "DERIVATION" | "VERIFICATION" | "CONCLUSION";
  text: string;
  dependsOn: string[];
}

export type SufficiencyClass =
  | "STATEMENT_I_ALONE"
  | "STATEMENT_II_ALONE"
  | "BOTH_TOGETHER_ONLY"
  | "EVEN_TOGETHER_INSUFFICIENT";

export type Wave03HiddenState =
  | { kind: "MISSING_DIGIT_IN_DIFFERENCE"; minuend: bigint; subtrahend: bigint; resultTemplate: string; divisor: bigint; actualResult: bigint; validDigits: number[] }
  | { kind: "MISSING_DIGIT_IN_PRODUCT"; multiplicand: bigint; multiplier: bigint; resultTemplate: string; divisor: bigint; actualResult: bigint; validDigits: number[] }
  | { kind: "TWO_DIGIT_PAIR_COUNT"; template: string; divisors: [bigint, bigint]; validPairs: Array<[number, number]> }
  | { kind: "RANGE_TWO_DIVISORS"; predicate: "EITHER" | "NEITHER" | "EXACTLY_ONE"; lower: bigint; upper: bigint; firstDivisor: bigint; secondDivisor: bigint; firstCount: bigint; secondCount: bigint; overlapCount: bigint; answer: bigint }
  | { kind: "MISSING_DIGIT_DATA_SUFFICIENCY"; template: string; firstDivisor: bigint; secondDivisor: bigint; firstDigits: number[]; secondDigits: number[]; intersection: number[]; sufficiencyClass: SufficiencyClass }
  | { kind: "POWER_DIFFERENCE_DIVISOR"; firstBase: bigint; secondBase: bigint; exponent: number; value: bigint; correctDivisor: bigint; divisorOptions: bigint[] }
  | { kind: "DIVISIBILITY_CLAIM"; number: bigint; claims: Array<{ text: string; divisor: bigint; assertedDivisible: boolean; actuallyDivisible: boolean }>; correctClaimIndex: number };

export interface NumCp003Wave03Question {
  canonicalProblemId: "NUM-CP-003";
  prototypeId: NumCp003Wave03Id;
  permanentQlId: null;
  seed: string;
  difficulty: NumDifficulty;
  answerSemantic: Wave03AnswerSemantic;
  stem: string;
  answer: string;
  options: string[];
  correctIndex: number;
  optionAudit: Wave03OptionAudit[];
  hiddenState: Wave03HiddenState;
  explanation: Wave03Explanation;
  reasoningGraph: { nodes: NumReasoningNode[] };
  fingerprint: string;
  validation: { ok: boolean; errors: string[]; verifierAnswer: string };
  reviewStatus: "UNREVIEWED_DISCOVERY_CANDIDATE";
  questionBankStatus: "NOT_STORED";
  testEligibility: "INELIGIBLE";
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
}
