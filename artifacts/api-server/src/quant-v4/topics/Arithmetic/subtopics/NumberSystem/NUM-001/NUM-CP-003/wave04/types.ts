export const NUM_CP003_WAVE04_IDS = [
  "NUM-CP003-W4-PROT-DIVISOR-FROM-RULE",
  "NUM-CP003-W4-PROT-RULE-FROM-DIVISOR",
  "NUM-CP003-W4-PROT-TWO-DIGIT-PAIR-SET",
  "NUM-CP003-W4-PROT-TWO-DIGIT-SOLUTION-CLASS",
  "NUM-CP003-W4-PROT-EACH-STATEMENT-ALONE-SUFFICIENT",
  "NUM-CP003-W4-PROT-COUNT-THREE-DIVISORS-AT-LEAST-ONE",
  "NUM-CP003-W4-PROT-REPEATED-BLOCK-GUARANTEED-DIVISOR",
  "NUM-CP003-W4-PROT-POWER-SUM-GUARANTEED-DIVISOR",
] as const;

export type NumCp003Wave04Id = (typeof NUM_CP003_WAVE04_IDS)[number];
export type NumDifficulty = "Easy" | "Medium" | "Hard";
export type Wave04AnswerSemantic =
  | "DIVISOR"
  | "RULE"
  | "ORDERED_PAIR_SET"
  | "SOLUTION_CLASS"
  | "SUFFICIENCY_CLASS"
  | "COUNT";

export type Wave04MisconceptionId =
  | "CORRECT"
  | "CONFUSED_LAST_DIGIT_RULE"
  | "CONFUSED_DIGIT_SUM_RULE"
  | "CONFUSED_LAST_TWO_DIGITS_RULE"
  | "CONFUSED_LAST_THREE_DIGITS_RULE"
  | "CONFUSED_ALTERNATING_SUM_RULE"
  | "OMITTED_VALID_PAIR"
  | "INCLUDED_INVALID_PAIR"
  | "STOPPED_AFTER_FIRST_PAIR"
  | "CLASSIFIED_NO_SOLUTION"
  | "CLASSIFIED_UNIQUE_SOLUTION"
  | "CLASSIFIED_MULTIPLE_SOLUTIONS"
  | "CLASSIFIED_ALL_PAIRS"
  | "STATEMENT_I_ONLY_MISREAD"
  | "STATEMENT_II_ONLY_MISREAD"
  | "BOTH_TOGETHER_ONLY_MISREAD"
  | "EVEN_TOGETHER_INSUFFICIENT_MISREAD"
  | "DOUBLE_COUNTED_PAIR_OVERLAP"
  | "MISSED_TRIPLE_OVERLAP_CORRECTION"
  | "COUNTED_ONLY_ONE_DIVISOR"
  | "USED_BLOCK_VALUE_INSTEAD_OF_REPETITION_FACTOR"
  | "USED_POWER_OF_TEN_ONLY"
  | "USED_BASE_DIFFERENCE_FOR_POWER_SUM"
  | "USED_EXPONENT_AS_DIVISOR"
  | "FALSE_IDENTITY_FACTOR";

export interface Wave04OptionAudit {
  text: string;
  misconceptionId: Wave04MisconceptionId;
  diagnostic: string;
}

export interface Wave04Explanation {
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

export type DivisibilityRuleId =
  | "LAST_DIGIT_EVEN"
  | "LAST_DIGIT_ZERO_OR_FIVE"
  | "DIGIT_SUM_MULTIPLE_OF_THREE"
  | "DIGIT_SUM_MULTIPLE_OF_NINE"
  | "LAST_TWO_DIGITS_MULTIPLE_OF_FOUR"
  | "LAST_TWO_DIGITS_MULTIPLE_OF_TWENTY_FIVE"
  | "LAST_THREE_DIGITS_MULTIPLE_OF_EIGHT"
  | "ALTERNATING_SUM_MULTIPLE_OF_ELEVEN";

export type PairSolutionClass = "NO_SOLUTION" | "UNIQUE_SOLUTION" | "MULTIPLE_SOLUTIONS";

export type Wave04HiddenState =
  | { kind: "RULE_RECOGNITION"; direction: "DIVISOR_FROM_RULE" | "RULE_FROM_DIVISOR"; ruleId: DivisibilityRuleId; divisor: bigint; ruleText: string }
  | { kind: "TWO_DIGIT_PAIR_SET"; template: string; divisors: [bigint, bigint]; validPairs: Array<[number, number]> }
  | { kind: "TWO_DIGIT_SOLUTION_CLASS"; template: string; divisors: [bigint, bigint]; validPairs: Array<[number, number]>; solutionClass: PairSolutionClass }
  | { kind: "EACH_STATEMENT_ALONE_SUFFICIENT"; template: string; firstDivisor: bigint; secondDivisor: bigint; firstDigits: number[]; secondDigits: number[]; sharedDigit: number }
  | { kind: "THREE_DIVISOR_RANGE"; lower: bigint; upper: bigint; divisors: [bigint, bigint, bigint]; singles: [bigint, bigint, bigint]; pairOverlaps: [bigint, bigint, bigint]; tripleOverlap: bigint; answer: bigint }
  | { kind: "REPEATED_BLOCK_IDENTITY"; blockDigits: number; repetitionFactor: bigint; correctDivisor: bigint; divisorOptions: bigint[] }
  | { kind: "POWER_SUM_IDENTITY"; firstBase: bigint; secondBase: bigint; oddExponent: number; value: bigint; correctDivisor: bigint; divisorOptions: bigint[] };

export interface NumCp003Wave04Question {
  canonicalProblemId: "NUM-CP-003";
  prototypeId: NumCp003Wave04Id;
  permanentQlId: null;
  seed: string;
  difficulty: NumDifficulty;
  answerSemantic: Wave04AnswerSemantic;
  stem: string;
  answer: string;
  options: string[];
  correctIndex: number;
  optionAudit: Wave04OptionAudit[];
  hiddenState: Wave04HiddenState;
  explanation: Wave04Explanation;
  reasoningGraph: { nodes: NumReasoningNode[] };
  fingerprint: string;
  validation: { ok: boolean; errors: string[]; verifierAnswer: string };
  reviewStatus: "UNREVIEWED_DISCOVERY_CANDIDATE";
  questionBankStatus: "NOT_STORED";
  testEligibility: "INELIGIBLE";
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
}
