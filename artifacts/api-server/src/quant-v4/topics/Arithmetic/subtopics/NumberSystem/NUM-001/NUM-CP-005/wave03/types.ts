import type {
  NumCp005Difficulty,
  NumCp005Explanation,
  NumCp005Option,
  NumCp005PrimePower,
} from "../wave01/types";

export const NUM_CP005_WAVE03_PROTOTYPE_IDS = [
  "NUM-CP005-PROT-017",
  "NUM-CP005-PROT-018",
  "NUM-CP005-PROT-019",
  "NUM-CP005-PROT-020",
  "NUM-CP005-PROT-021",
  "NUM-CP005-PROT-022",
  "NUM-CP005-PROT-023",
  "NUM-CP005-PROT-024",
] as const;

export type NumCp005Wave03PrototypeId =
  (typeof NUM_CP005_WAVE03_PROTOTYPE_IDS)[number];

export type NumCp005Wave03AnswerSemantic =
  | "DIVISOR_COUNT"
  | "DIVISOR_VALUE"
  | "BOOLEAN_CLAIM"
  | "INTEGER_COUNT"
  | "INTEGER";

export interface NumCp005Wave03Package {
  readonly packageId: "NUM-001";
  readonly checkpointId: "NUM-CP-005";
  readonly temporaryPrototypeId: NumCp005Wave03PrototypeId;
  readonly permanentQlId: null;
  readonly seed: number;
  readonly locale: "en-IN";
  readonly difficulty: NumCp005Difficulty;
  readonly answerSemantic: NumCp005Wave03AnswerSemantic;
  readonly representation:
    | "DIRECT"
    | "CLAIM"
    | "DIVISOR_PAIR_TABLE"
    | "BOUNDED_INTERVAL";
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
