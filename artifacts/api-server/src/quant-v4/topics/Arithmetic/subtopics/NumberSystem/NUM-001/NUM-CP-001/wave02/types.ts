import type {
  NumCp001Difficulty,
  NumCp001Explanation,
  NumCp001Lifecycle,
  NumCp001Option,
} from "../wave01/types";

export const NUM_CP001_WAVE02_PROTOTYPE_IDS = [
  "NUM-CP001-PROT-009",
  "NUM-CP001-PROT-010",
  "NUM-CP001-PROT-011",
  "NUM-CP001-PROT-012",
  "NUM-CP001-PROT-013",
  "NUM-CP001-PROT-014",
  "NUM-CP001-PROT-015",
  "NUM-CP001-PROT-016",
] as const;

export type NumCp001Wave02PrototypeId =
  (typeof NUM_CP001_WAVE02_PROTOTYPE_IDS)[number];

export type NumCp001Wave02AnswerSemantic =
  | "RATIONAL_VALUE"
  | "INTEGER"
  | "COUNT"
  | "NUMBER_TUPLE"
  | "PARITY_CLASS";

export interface NumCp001Wave02Package {
  readonly packageId: "NUM-001";
  readonly checkpointId: "NUM-CP-001";
  readonly temporaryPrototypeId: NumCp001Wave02PrototypeId;
  readonly permanentQlId: null;
  readonly seed: number;
  readonly locale: "en-IN";
  readonly difficulty: NumCp001Difficulty;
  readonly answerSemantic: NumCp001Wave02AnswerSemantic;
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