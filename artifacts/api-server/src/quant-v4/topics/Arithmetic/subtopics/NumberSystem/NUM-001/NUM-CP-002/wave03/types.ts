export const NUM_CP002_WAVE03_PROTOTYPE_IDS = [
  "NUM-CP002-PROT-023",
  "NUM-CP002-PROT-024",
  "NUM-CP002-PROT-025",
  "NUM-CP002-PROT-026",
  "NUM-CP002-PROT-027",
  "NUM-CP002-PROT-028",
  "NUM-CP002-PROT-029",
  "NUM-CP002-PROT-030",
  "NUM-CP002-PROT-031",
  "NUM-CP002-PROT-032",
] as const;

export type NumCp002Wave03PrototypeId = (typeof NUM_CP002_WAVE03_PROTOTYPE_IDS)[number];
export type NumCp002Wave03Difficulty = "EASY" | "MEDIUM" | "HARD";
export type NumCp002Wave03AnswerSemantic = "RATIONAL" | "INTEGER" | "BOOLEAN_COMBINATION" | "SUFFICIENCY_CLASS" | "DECIMAL_REPRESENTATION";

export interface NumCp002Wave03Option { readonly value: string; readonly isCorrect: boolean; readonly misconceptionId?: string }
export interface NumCp002Wave03Package {
  readonly packageId: "NUM-001";
  readonly checkpointId: "NUM-CP-002";
  readonly temporaryPrototypeId: NumCp002Wave03PrototypeId;
  readonly permanentQlId: null;
  readonly seed: number;
  readonly locale: "en-IN";
  readonly difficulty: NumCp002Wave03Difficulty;
  readonly answerSemantic: NumCp002Wave03AnswerSemantic;
  readonly stem: string;
  readonly options: readonly NumCp002Wave03Option[];
  readonly correctIndex: number;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly hiddenState: Readonly<Record<string, unknown>>;
  readonly sourceAncestry: readonly string[];
  readonly mathematicalFingerprint: string;
  readonly explanation: Readonly<{ concept?: string; solution: readonly string[]; finalAnswer: string }>;
  readonly lifecycle: Readonly<{
    permanentQlId: null;
    maturity: "EXECUTABLE_DISCOVERY_PROOF";
    reviewStatus: "UNREVIEWED_DISCOVERY_CANDIDATE";
    active: false;
    questionStudioDiscoverable: false;
    questionBankWritable: false;
    questionBankStatus: "NOT_STORED";
    testEligible: false;
    testEligibility: "INELIGIBLE";
    publiclyPublishable: false;
  }>;
}
