export const NUM_CP003_WAVE05_IDS = [
  "NUM-CP003-W5-PROT-LARGEST-VALID-DIGIT",
  "NUM-CP003-W5-PROT-SMALLEST-VALID-DIGIT",
  "NUM-CP003-W5-PROT-SUM-VALID-DIGITS",
  "NUM-CP003-W5-PROT-GREATEST-COMPLETED-NUMBER",
  "NUM-CP003-W5-PROT-SMALLEST-COMPLETED-NUMBER",
  "NUM-CP003-W5-PROT-LINKED-ADDITION-DIVISIBILITY-EXTREMUM",
] as const;

export type NumCp003Wave05Id = (typeof NUM_CP003_WAVE05_IDS)[number];
export type NumDifficulty = "Easy" | "Medium" | "Hard";
export type Wave05AnswerSemantic = "DIGIT" | "DIGIT_SUM" | "NUMBER";
export type Wave05ExtremumDirection = "LARGEST" | "SMALLEST";

export type Wave05MisconceptionId =
  | "CORRECT"
  | "SELECTED_OPPOSITE_EXTREMUM"
  | "REPORTED_VALID_COUNT"
  | "REPORTED_EXTREME_DIGIT"
  | "USED_INVALID_DIGIT"
  | "IGNORED_LEADING_ZERO_RULE"
  | "RETURNED_DIGIT_INSTEAD_OF_NUMBER"
  | "USED_OPPOSITE_COMPLETED_NUMBER"
  | "IGNORED_DIVISIBILITY_CONSTRAINT"
  | "STOPPED_AT_FIRST_VALID_VALUE"
  | "SELECTED_NON_EXTREME_VALID_VALUE"
  | "SWAPPED_UNKNOWN_DIGITS";

export interface Wave05OptionAudit {
  text: string;
  misconceptionId: Wave05MisconceptionId;
  diagnostic: string;
}

export interface Wave05Explanation {
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

export type SingleDigitTarget =
  | "LARGEST_VALID_DIGIT"
  | "SMALLEST_VALID_DIGIT"
  | "SUM_VALID_DIGITS"
  | "GREATEST_COMPLETED_NUMBER"
  | "SMALLEST_COMPLETED_NUMBER";

export type Wave05HiddenState =
  | {
      kind: "SINGLE_DIGIT_CANDIDATE_SET";
      template: string;
      divisor: bigint;
      validDigits: number[];
      target: SingleDigitTarget;
      answerDigit?: number;
      answerNumber?: bigint;
      answerSum?: number;
    }
  | {
      kind: "LINKED_ADDITION_EXTREMUM";
      addend: bigint;
      sourceHundreds: number;
      sourceUnits: number;
      resultHundreds: number;
      resultUnits: number;
      delta: number;
      divisor: bigint;
      arithmeticPairs: Array<[number, number]>;
      validPairs: Array<[number, number]>;
      targetDirection: Wave05ExtremumDirection;
      answerDigit: number;
    };

export interface NumCp003Wave05Question {
  canonicalProblemId: "NUM-CP-003";
  prototypeId: NumCp003Wave05Id;
  permanentQlId: null;
  seed: string;
  difficulty: NumDifficulty;
  answerSemantic: Wave05AnswerSemantic;
  stem: string;
  answer: string;
  options: string[];
  correctIndex: number;
  optionAudit: Wave05OptionAudit[];
  hiddenState: Wave05HiddenState;
  explanation: Wave05Explanation;
  reasoningGraph: { nodes: NumReasoningNode[] };
  fingerprint: string;
  validation: { ok: boolean; errors: string[]; verifierAnswer: string };
  reviewStatus: "UNREVIEWED_DISCOVERY_CANDIDATE";
  questionBankStatus: "NOT_STORED";
  testEligibility: "INELIGIBLE";
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
}
