import type { NumCp013Difficulty, NumCp013Option } from "../wave01/types.ts";

export const NUM_CP013_WAVE02_PROTOTYPE_IDS = [
  "NUM-CP013-PROT-009",
  "NUM-CP013-PROT-010",
  "NUM-CP013-PROT-011",
  "NUM-CP013-PROT-012",
  "NUM-CP013-PROT-013",
  "NUM-CP013-PROT-014",
] as const;

export type NumCp013Wave02PrototypeId = typeof NUM_CP013_WAVE02_PROTOTYPE_IDS[number];

export interface NumCp013Wave02Package {
  readonly packageId: "NUM-002";
  readonly checkpointId: "NUM-CP-013";
  readonly temporaryPrototypeId: NumCp013Wave02PrototypeId;
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
    reviewStatus: "WAVE02_REVIEW_REQUIRED";
    active: false;
    questionStudioDiscoverable: false;
    questionBankWritable: false;
    testEligible: false;
    mockTestEligible: false;
    publiclyPublishable: false;
    automaticStudentPublication: false;
  }>;
}
