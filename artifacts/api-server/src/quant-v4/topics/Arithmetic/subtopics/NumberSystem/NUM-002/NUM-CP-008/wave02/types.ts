export const NUM_CP008_WAVE02_PROTOTYPE_IDS = [
  "NUM-CP008-PROT-009",
  "NUM-CP008-PROT-010",
  "NUM-CP008-PROT-011",
  "NUM-CP008-PROT-012",
  "NUM-CP008-PROT-013",
  "NUM-CP008-PROT-014",
  "NUM-CP008-PROT-015",
  "NUM-CP008-PROT-016",
] as const;

export type NumCp008Wave02PrototypeId = (typeof NUM_CP008_WAVE02_PROTOTYPE_IDS)[number];
export type NumCp008Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface NumCp008Option {
  readonly value: string;
  readonly isCorrect: boolean;
  readonly misconceptionId: string;
}

export interface NumCp008Wave02Package {
  readonly packageId: "NUM-002";
  readonly checkpointId: "NUM-CP-008";
  readonly temporaryPrototypeId: NumCp008Wave02PrototypeId;
  readonly permanentQlId: null;
  readonly seed: number;
  readonly locale: "en-IN";
  readonly difficulty: NumCp008Difficulty;
  readonly answerSemantic: string;
  readonly representation: string;
  readonly stem: string;
  readonly options: readonly NumCp008Option[];
  readonly correctIndex: number;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly hiddenState: Readonly<Record<string, unknown>>;
  readonly mathematicalFingerprint: string;
  readonly explanation: Readonly<{
    coreConcept: string;
    strategy: string;
    steps: readonly string[];
    finalAnswer: string;
  }>;
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
