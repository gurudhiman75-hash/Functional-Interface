import type {
  NumCp004Difficulty,
  NumCp004Explanation,
  NumCp004Lifecycle,
  NumCp004Option,
} from "../wave01/types";

export const NUM_CP004_WAVE02_PROTOTYPE_IDS = [
  "NUM-CP004-PROT-009",
  "NUM-CP004-PROT-010",
  "NUM-CP004-PROT-011",
  "NUM-CP004-PROT-012",
  "NUM-CP004-PROT-013",
  "NUM-CP004-PROT-014",
  "NUM-CP004-PROT-015",
  "NUM-CP004-PROT-016",
] as const;

export type NumCp004Wave02PrototypeId =
  (typeof NUM_CP004_WAVE02_PROTOTYPE_IDS)[number];

export type NumCp004Wave02AnswerSemantic =
  | "NEXT_PRIME"
  | "PREVIOUS_PRIME"
  | "LEAST_PRIME_DIVISOR"
  | "PRIME_PAIR"
  | "PRIME_TRIPLE"
  | "COPRIME_SET"
  | "PRIME_ADJUSTMENT_SET";

export interface NumCp004Wave02Package {
  readonly packageId: "NUM-001";
  readonly checkpointId: "NUM-CP-004";
  readonly temporaryPrototypeId: NumCp004Wave02PrototypeId;
  readonly permanentQlId: null;
  readonly seed: number;
  readonly locale: "en-IN";
  readonly difficulty: NumCp004Difficulty;
  readonly answerSemantic: NumCp004Wave02AnswerSemantic;
  readonly stem: string;
  readonly options: readonly NumCp004Option[];
  readonly correctIndex: number;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly hiddenState: Readonly<Record<string, unknown>>;
  readonly sourceAncestry: readonly string[];
  readonly prototypeAncestry: readonly string[];
  readonly mathematicalFingerprint: string;
  readonly explanation: NumCp004Explanation;
  readonly lifecycle: NumCp004Lifecycle;
}
