import type {
  NumCp005Difficulty,
  NumCp005Explanation,
  NumCp005Option,
  NumCp005PrimePower,
} from "../wave01/types";

export const NUM_CP005_WAVE02_PROTOTYPE_IDS = [
  "NUM-CP005-PROT-009",
  "NUM-CP005-PROT-010",
  "NUM-CP005-PROT-011",
  "NUM-CP005-PROT-012",
  "NUM-CP005-PROT-013",
  "NUM-CP005-PROT-014",
  "NUM-CP005-PROT-015",
  "NUM-CP005-PROT-016",
] as const;

export type NumCp005Wave02PrototypeId =
  (typeof NUM_CP005_WAVE02_PROTOTYPE_IDS)[number];

export type NumCp005Wave02AnswerSemantic =
  | "DIVISOR_COUNT"
  | "DIVISOR_SUM"
  | "DIVISOR_PRODUCT"
  | "DIVISOR_SET"
  | "INTEGER";

export interface NumCp005Wave02Package {
  readonly packageId: "NUM-001";
  readonly checkpointId: "NUM-CP-005";
  readonly temporaryPrototypeId: NumCp005Wave02PrototypeId;
  readonly permanentQlId: null;
  readonly seed: number;
  readonly locale: "en-IN";
  readonly difficulty: NumCp005Difficulty;
  readonly answerSemantic: NumCp005Wave02AnswerSemantic;
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
