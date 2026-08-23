import type { NumCp010Difficulty, NumCp010Explanation, NumCp010Option } from "../wave01/types.ts";

export const NUM_CP010_WAVE03_PROTOTYPE_IDS = [
  "NUM-CP010-PROT-018",
  "NUM-CP010-PROT-019",
  "NUM-CP010-PROT-020",
  "NUM-CP010-PROT-021",
  "NUM-CP010-PROT-022",
  "NUM-CP010-PROT-023",
  "NUM-CP010-PROT-024",
  "NUM-CP010-PROT-025",
] as const;

export type NumCp010Wave03PrototypeId = typeof NUM_CP010_WAVE03_PROTOTYPE_IDS[number];

export interface NumCp010Wave03Package {
  readonly packageId: "NUM-002";
  readonly checkpointId: "NUM-CP-010";
  readonly temporaryPrototypeId: NumCp010Wave03PrototypeId;
  readonly seed: number;
  readonly locale: "en-IN";
  readonly difficulty: NumCp010Difficulty;
  readonly answerSemantic: string;
  readonly representation: string;
  readonly stem: string;
  readonly options: readonly NumCp010Option[];
  readonly correctIndex: number;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly hiddenState: Readonly<Record<string, unknown>>;
  readonly mathematicalFingerprint: string;
  readonly explanation: NumCp010Explanation;
  readonly sourceAncestry: readonly string[];
  readonly prototypeAncestry: readonly string[];
  readonly lifecycle: Readonly<{
    maturity: "DISCOVERY_PROTOTYPE";
    reviewStatus: "WAVE03_REVIEW_REQUIRED";
    active: false;
    questionStudioDiscoverable: false;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
  }>;
}
