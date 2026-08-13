import type {
  NumCp001Difficulty,
  NumCp001Explanation,
  NumCp001Lifecycle,
  NumCp001Option,
} from "../wave01/types";

export const NUM_CP001_WAVE04_PROTOTYPE_IDS = [
  "NUM-CP001-PROT-025",
  "NUM-CP001-PROT-026",
] as const;

export type NumCp001Wave04PrototypeId =
  (typeof NUM_CP001_WAVE04_PROTOTYPE_IDS)[number];

export type NumCp001Wave04AnswerSemantic =
  | "DATA_SUFFICIENCY_CLASS"
  | "INTEGER";

export interface NumCp001Wave04Package {
  readonly packageId: "NUM-001";
  readonly checkpointId: "NUM-CP-001";
  readonly temporaryPrototypeId: NumCp001Wave04PrototypeId;
  readonly permanentQlId: null;
  readonly seed: number;
  readonly locale: "en-IN";
  readonly difficulty: NumCp001Difficulty;
  readonly answerSemantic: NumCp001Wave04AnswerSemantic;
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