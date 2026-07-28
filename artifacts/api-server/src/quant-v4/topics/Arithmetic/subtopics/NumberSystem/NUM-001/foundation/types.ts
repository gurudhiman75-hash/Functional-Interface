export const NUM_001_ARCHETYPE_ID = "NUM-001" as const;
export const NUM_CP_003_ID = "NUM-CP-003" as const;

export const NUM_CP003_PROTOTYPE_IDS = [
  "NUM-CP003-PROT-DIRECT-COMPOSITE-DIVISIBILITY",
  "NUM-CP003-PROT-SINGLE-MISSING-DIGIT-UNIQUE",
  "NUM-CP003-PROT-SINGLE-MISSING-DIGIT-COUNT",
  "NUM-CP003-PROT-TWO-MISSING-DIGITS-MULTI-RULE",
  "NUM-CP003-PROT-REPEATED-BLOCK-DIVISIBILITY",
  "NUM-CP003-PROT-LEAST-N-DIGIT-MULTIPLE",
] as const;

export type NumCp003PrototypeId = (typeof NUM_CP003_PROTOTYPE_IDS)[number];
export type NumDifficulty = "Easy" | "Medium" | "Hard";
export type NumTaskDirection = "FORWARD" | "INVERSE" | "ENUMERATION" | "OPTIMISATION";
export type NumAnswerSemantic = "DIVISOR" | "DIGIT" | "DIGIT_COUNT" | "ORDERED_DIGIT_PAIR" | "NUMBER";

export type NumCp003MisconceptionId =
  | "CORRECT"
  | "USED_LAST_DIGIT_ONLY"
  | "USED_DIGIT_SUM_ONLY"
  | "CHECKED_ONE_FACTOR_ONLY"
  | "IGNORED_LEADING_ZERO_RULE"
  | "COUNTED_ONE_EXTRA_DIGIT"
  | "COUNTED_ONE_FEWER_DIGIT"
  | "SWAPPED_DIGIT_ORDER"
  | "IGNORED_DIGIT_SUM_CONSTRAINT"
  | "IGNORED_SECOND_DIVISIBILITY_RULE"
  | "TESTED_ONLY_THE_SOURCE_BLOCK"
  | "USED_PREVIOUS_MULTIPLE"
  | "USED_NEXT_MULTIPLE_AFTER_ANSWER"
  | "USED_N_PLUS_ONE_DIGIT_BOUNDARY";

export interface NumCp003PrototypeRegistryEntry {
  prototypeId: NumCp003PrototypeId;
  cpId: typeof NUM_CP_003_ID;
  taskDirection: NumTaskDirection;
  answerSemantic: NumAnswerSemantic;
  topology:
    | "DIRECT_COMPOSITE_RULE"
    | "SINGLE_DIGIT_UNIQUE"
    | "SINGLE_DIGIT_ENUMERATION"
    | "TWO_DIGIT_MULTI_CONSTRAINT"
    | "REPEATED_BLOCK"
    | "RANGE_OPTIMISATION";
  baseDifficulty: NumDifficulty;
  permanentQlId: null;
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
}

export interface NumCp003OptionAudit {
  text: string;
  value: string;
  misconceptionId: NumCp003MisconceptionId;
}

export interface NumReasoningNode {
  id: string;
  kind: "GIVEN" | "RULE" | "ENUMERATION" | "DERIVATION" | "VERIFICATION" | "CONCLUSION";
  text: string;
  mathLatex?: string;
  dependsOn: string[];
}

export interface NumCp003Explanation {
  coreConcept: string;
  strategy: string;
  steps: string[];
  shortcut: string;
  verification: string;
  conclusion: string;
  traps: string[];
}

export type NumCp003HiddenState =
  | {
      kind: "DIRECT_COMPOSITE_DIVISIBILITY";
      number: bigint;
      correctDivisor: bigint;
      divisorOptions: bigint[];
    }
  | {
      kind: "SINGLE_MISSING_DIGIT";
      template: string;
      divisor: bigint;
      validDigits: number[];
    }
  | {
      kind: "TWO_MISSING_DIGITS";
      template: string;
      divisors: [bigint, bigint];
      requiredDigitSum: number;
      validPairs: Array<[number, number]>;
    }
  | {
      kind: "REPEATED_BLOCK";
      block: string;
      repeats: number;
      number: bigint;
      correctDivisor: bigint;
      divisorOptions: bigint[];
    }
  | {
      kind: "LEAST_N_DIGIT_MULTIPLE";
      digits: number;
      divisor: bigint;
      lowerBound: bigint;
      answer: bigint;
    };

export interface NumCp003GeneratedPrototype {
  archetypeId: typeof NUM_001_ARCHETYPE_ID;
  canonicalProblemId: typeof NUM_CP_003_ID;
  prototypeId: NumCp003PrototypeId;
  permanentQlId: null;
  language: "en";
  seed: string;
  difficulty: NumDifficulty;
  difficultyEvidence: string[];
  taskDirection: NumTaskDirection;
  answerSemantic: NumAnswerSemantic;
  stem: string;
  hiddenState: NumCp003HiddenState;
  answer: string;
  options: string[];
  optionAudit: NumCp003OptionAudit[];
  correctIndex: number;
  explanation: NumCp003Explanation;
  reasoningGraph: { nodes: NumReasoningNode[] };
  mathematicalFingerprint: string;
  validation: { ok: boolean; errors: string[]; verifierAnswer: string };
  reviewStatus: "UNREVIEWED_DISCOVERY_CANDIDATE";
  questionBankStatus: "NOT_STORED";
  testEligibility: "INELIGIBLE";
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
}
