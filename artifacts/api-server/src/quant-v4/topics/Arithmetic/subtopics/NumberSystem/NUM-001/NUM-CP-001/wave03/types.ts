import type {
  NumCp001Difficulty,
  NumCp001Explanation,
  NumCp001Lifecycle,
  NumCp001Option,
} from "../wave01/types";

export const NUM_CP001_WAVE03_PROTOTYPE_IDS = [
  "NUM-CP001-PROT-017",
  "NUM-CP001-PROT-018",
  "NUM-CP001-PROT-019",
  "NUM-CP001-PROT-020",
  "NUM-CP001-PROT-021",
  "NUM-CP001-PROT-022",
  "NUM-CP001-PROT-023",
  "NUM-CP001-PROT-024",
] as const;

export type NumCp001Wave03PrototypeId =
  (typeof NUM_CP001_WAVE03_PROTOTYPE_IDS)[number];

export type NumCp001Wave03AnswerSemantic =
  | "VALUE"
  | "ORDERED_LIST"
  | "CARDINALITY_CLASS"
  | "PARITY_CLASS"
  | "NUMBER_TUPLE"
  | "BOOLEAN_CLASS"
  | "STATEMENT_COMBINATION";

export interface NumCp001Wave03Package {
  readonly packageId: "NUM-001";
  readonly checkpointId: "NUM-CP-001";
  readonly temporaryPrototypeId: NumCp001Wave03PrototypeId;
  readonly permanentQlId: null;
  readonly seed: number;
  readonly locale: "en-IN";
  readonly difficulty: NumCp001Difficulty;
  readonly answerSemantic: NumCp001Wave03AnswerSemantic;
  readonly stem: string;
  readonly options: readonly NumCp001Option[];
  readonly correctIndex: number;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly hiddenState: Readonly<Record<string, unknown>>;
  readonly sourceAncestry: readonly string[];
  readonly prototypeAncestry: readonly string[];
  readonly mathematicalFingerprint: string;
  readonly explanation: NumCp001Explanation;
  readonly lifecycle: NumCp001Lifecycle;
}

export type {
  NumCp001Difficulty,
  NumCp001Explanation,
  NumCp001Lifecycle,
  NumCp001Option,
};