import type {
  NumCp005Difficulty,
  NumCp005Explanation,
  NumCp005Option,
  NumCp005PrimePower,
} from "../wave01/types";

export const NUM_CP005_WAVE04_PROTOTYPE_IDS = [
  "NUM-CP005-PROT-025",
  "NUM-CP005-PROT-026",
  "NUM-CP005-PROT-027",
  "NUM-CP005-PROT-028",
  "NUM-CP005-PROT-029",
  "NUM-CP005-PROT-030",
  "NUM-CP005-PROT-031",
  "NUM-CP005-PROT-032",
] as const;

export type NumCp005Wave04PrototypeId =
  (typeof NUM_CP005_WAVE04_PROTOTYPE_IDS)[number];

export type NumCp005Wave04AnswerSemantic =
  | "DATA_SUFFICIENCY_CLASS"
  | "STATEMENT_SET"
  | "SOLUTION_CLASS"
  | "EXPONENT_PAIR_SET"
  | "INTEGER_SET"
  | "FACTORISATION"
  | "COMPARISON"
  | "INTEGER";

export type NumCp005Wave04Representation =
  | "DATA_SUFFICIENCY"
  | "STATEMENT_SET"
  | "DIRECT_INVERSE"
  | "PRIME_EXPONENT_TABLE"
  | "MINI_CASELET"
  | "BOUNDED_OPTIMISATION";

export interface NumCp005Wave04Package {
  readonly packageId: "NUM-001";
  readonly checkpointId: "NUM-CP-005";
  readonly temporaryPrototypeId: NumCp005Wave04PrototypeId;
  readonly permanentQlId: null;
  readonly seed: number;
  readonly locale: "en-IN";
  readonly difficulty: NumCp005Difficulty;
  readonly answerSemantic: NumCp005Wave04AnswerSemantic;
  readonly representation: NumCp005Wave04Representation;
  readonly stem: string;
  readonly options: readonly NumCp005Option[];
  readonly correctIndex: number;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly hiddenState: Readonly<{
    factorState: readonly NumCp005PrimePower[];
    [key: string]: unknown;
  }>;
  readonly mathematicalFingerprint: string;
  readonly explanation: NumCp005Explanation;
  readonly sourceAncestry: readonly string[];
  readonly prototypeAncestry: readonly string[];
  readonly lifecycle: Readonly<{
    permanentQlId: null;
    maturity: "EXECUTABLE_DISCOVERY_PROOF";
    reviewStatus: "UNREVIEWED_DISCOVERY_CANDIDATE";
    questionBankStatus: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    active: false;
    questionStudioDiscoverable: false;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
  }>;
}
