export type NumDifficulty = "Easy" | "Medium" | "Hard";

export interface NumReasoningNode {
  id: string;
  kind: "GIVEN" | "RULE" | "ENUMERATION" | "DERIVATION" | "VERIFICATION" | "CONCLUSION";
  text: string;
  dependsOn: string[];
}

export const NUM_CP003_WAVE02_IDS = [
  "NUM-CP003-W2-PROT-ALL-MISSING-DIGITS-SET",
  "NUM-CP003-W2-PROT-LEADING-MISSING-DIGIT",
  "NUM-CP003-W2-PROT-TWO-DIGITS-NO-SUM",
  "NUM-CP003-W2-PROT-MISSING-DIGIT-IN-SUM",
  "NUM-CP003-W2-PROT-LEAST-REPUNIT-LENGTH",
  "NUM-CP003-W2-PROT-POWER-EXPRESSION-DIVISIBILITY",
  "NUM-CP003-W2-PROT-COUNT-MULTIPLES-IN-RANGE",
  "NUM-CP003-W2-PROT-COUNT-ONE-NOT-ANOTHER",
  "NUM-CP003-W2-PROT-GREATEST-N-DIGIT-MULTIPLE",
] as const;

export type NumCp003Wave02Id = (typeof NUM_CP003_WAVE02_IDS)[number];
export type Wave02AnswerSemantic =
  | "DIGIT_SET"
  | "DIGIT"
  | "ORDERED_DIGIT_PAIR"
  | "LENGTH"
  | "DIVISOR"
  | "COUNT"
  | "NUMBER";

export type Wave02MisconceptionId =
  | "CORRECT"
  | "OMITTED_VALID_DIGIT"
  | "INCLUDED_INVALID_DIGIT"
  | "SELECTED_FIRST_VALID_DIGIT_ONLY"
  | "LEADING_ZERO_INCLUDED"
  | "NON_ZERO_REMAINDER"
  | "SWAPPED_DIGIT_ORDER"
  | "PASSED_FIRST_RULE_ONLY"
  | "PASSED_SECOND_RULE_ONLY"
  | "FAILED_BOTH_RULES"
  | "ARITHMETIC_RESULT_ERROR"
  | "USED_PREVIOUS_LENGTH"
  | "USED_NEXT_LENGTH"
  | "TESTED_ONLY_THE_BASE"
  | "ENDPOINT_OFF_BY_ONE"
  | "USED_RANGE_WIDTH_DIVISION"
  | "INCLUDED_COMMON_MULTIPLES"
  | "SUBTRACTED_WRONG_OVERLAP"
  | "USED_PREVIOUS_MULTIPLE"
  | "USED_NEXT_MULTIPLE"
  | "USED_LOWER_DIGIT_BOUNDARY";

export interface Wave02OptionAudit {
  text: string;
  misconceptionId: Wave02MisconceptionId;
  diagnostic: string;
}

export interface Wave02Explanation {
  coreConcept: string;
  strategy: string;
  steps: string[];
  shortcut: string;
  verification: string;
  conclusion: string;
  traps: string[];
}

export type Wave02HiddenState =
  | { kind: "DIGIT_SET"; template: string; divisor: bigint; validDigits: number[]; leading: false }
  | { kind: "LEADING_DIGIT"; template: string; divisor: bigint; validDigits: number[]; leading: true }
  | { kind: "TWO_DIGITS_NO_SUM"; template: string; divisors: [bigint, bigint]; validPairs: Array<[number, number]> }
  | { kind: "MISSING_DIGIT_IN_SUM"; left: bigint; right: bigint; resultTemplate: string; divisor: bigint; validDigits: number[]; actualSum: bigint }
  | { kind: "LEAST_REPUNIT_LENGTH"; divisor: bigint; answerLength: number; maximumLength: number }
  | { kind: "POWER_EXPRESSION"; base: bigint; exponent: number; subtractBase: boolean; value: bigint; divisorOptions: bigint[]; correctDivisor: bigint }
  | { kind: "COUNT_MULTIPLES"; lower: bigint; upper: bigint; divisor: bigint; answer: bigint }
  | { kind: "COUNT_ONE_NOT_ANOTHER"; lower: bigint; upper: bigint; firstDivisor: bigint; excludedDivisor: bigint; answer: bigint }
  | { kind: "GREATEST_N_DIGIT_MULTIPLE"; digits: number; divisor: bigint; upperBound: bigint; answer: bigint };

export interface NumCp003Wave02Question {
  canonicalProblemId: "NUM-CP-003";
  prototypeId: NumCp003Wave02Id;
  permanentQlId: null;
  seed: string;
  difficulty: NumDifficulty;
  answerSemantic: Wave02AnswerSemantic;
  stem: string;
  answer: string;
  options: string[];
  correctIndex: number;
  optionAudit: Wave02OptionAudit[];
  hiddenState: Wave02HiddenState;
  explanation: Wave02Explanation;
  reasoningGraph: { nodes: NumReasoningNode[] };
  fingerprint: string;
  validation: { ok: boolean; errors: string[]; verifierAnswer: string };
  reviewStatus: "UNREVIEWED_DISCOVERY_CANDIDATE";
  questionBankStatus: "NOT_STORED";
  testEligibility: "INELIGIBLE";
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
}
