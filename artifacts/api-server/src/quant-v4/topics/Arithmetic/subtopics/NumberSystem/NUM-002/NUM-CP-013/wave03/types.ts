import type { NumCp013Difficulty, NumCp013Option } from "../wave01/types.ts";

export const NUM_CP013_WAVE03_PROTOTYPE_IDS = [
  "NUM-CP013-PROT-015",
  "NUM-CP013-PROT-016",
  "NUM-CP013-PROT-017",
  "NUM-CP013-PROT-018",
  "NUM-CP013-PROT-019",
  "NUM-CP013-PROT-020",
  "NUM-CP013-PROT-021",
  "NUM-CP013-PROT-022",
] as const;

export type NumCp013Wave03PrototypeId = typeof NUM_CP013_WAVE03_PROTOTYPE_IDS[number];

export interface NumCp013Wave03Package {
  readonly packageId: "NUM-002";
  readonly checkpointId: "NUM-CP-013";
  readonly temporaryPrototypeId: NumCp013Wave03PrototypeId;
  readonly seed: number;
  readonly locale: "en-IN";
  readonly difficulty: NumCp013Difficulty;
  readonly taskKind: string;
  readonly answerSemantic: string;
  readonly representation: string;
  readonly stem: string;
  readonly options: readonly NumCp013Option[];
  readonly correctIndex: number;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly hiddenState: Readonly<Record<string, unknown>>;
  readonly mathematicalFingerprint: string;
  readonly explanation: Readonly<{
    standard: "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1";
    fullDerivation: readonly string[];
    examShortcut: readonly string[];
    finalAnswer: string;
  }>;
  readonly sourceAncestry: readonly string[];
  readonly prototypeAncestry: readonly string[];
  readonly lifecycle: Readonly<{
    maturity: "DISCOVERY_PROTOTYPE";
    reviewStatus: "WAVE03_REVIEW_REQUIRED";
    active: false;
    questionStudioDiscoverable: false;
    questionBankWritable: false;
    testEligible: false;
    mockTestEligible: false;
    publiclyPublishable: false;
    automaticStudentPublication: false;
  }>;
}
