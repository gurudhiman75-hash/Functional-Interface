import type { NumCp010Difficulty, NumCp010Explanation, NumCp010Option } from "../wave01/types.ts";

export const NUM_CP010_WAVE04_PROTOTYPE_IDS = ["NUM-CP010-PROT-026"] as const;
export type NumCp010Wave04PrototypeId = typeof NUM_CP010_WAVE04_PROTOTYPE_IDS[number];

export interface NumCp010Wave04Package {
  readonly packageId: "NUM-002";
  readonly checkpointId: "NUM-CP-010";
  readonly temporaryPrototypeId: NumCp010Wave04PrototypeId;
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
    reviewStatus: "WAVE04_SATURATION_REVIEW_REQUIRED";
    active: false;
    questionStudioDiscoverable: false;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
  }>;
}
