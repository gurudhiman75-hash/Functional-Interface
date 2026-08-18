import type { NumCp008Difficulty, NumCp008Option } from "../wave03/types.ts";

export const NUM_CP008_WAVE04_PROTOTYPE_IDS = [
  "NUM-CP008-PROT-025",
  "NUM-CP008-PROT-026",
  "NUM-CP008-PROT-027",
  "NUM-CP008-PROT-028",
] as const;

export type NumCp008Wave04PrototypeId = (typeof NUM_CP008_WAVE04_PROTOTYPE_IDS)[number];

export interface NumCp008Wave04Package {
  readonly packageId: "NUM-002";
  readonly checkpointId: "NUM-CP-008";
  readonly temporaryPrototypeId: NumCp008Wave04PrototypeId;
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
