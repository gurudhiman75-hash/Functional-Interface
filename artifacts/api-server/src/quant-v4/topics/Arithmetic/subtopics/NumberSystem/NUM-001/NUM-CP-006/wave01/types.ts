export const NUM_CP006_WAVE01_PROTOTYPE_IDS = [
  "NUM-CP006-PROT-001", "NUM-CP006-PROT-002", "NUM-CP006-PROT-003", "NUM-CP006-PROT-004",
  "NUM-CP006-PROT-005", "NUM-CP006-PROT-006", "NUM-CP006-PROT-007", "NUM-CP006-PROT-008",
] as const;
export type NumCp006Wave01PrototypeId = (typeof NUM_CP006_WAVE01_PROTOTYPE_IDS)[number];
export type NumCp006Difficulty = "EASY" | "MEDIUM" | "HARD";
export interface NumCp006Option { readonly value: string; readonly isCorrect: boolean; readonly misconceptionId: string; readonly analysis: string; }
export interface NumCp006Explanation {
  readonly coreConcept: string; readonly givenDataAndStrategy: string; readonly stepByStep: readonly string[];
  readonly examSpeedMethod: string; readonly commonTraps: readonly string[]; readonly finalAnswer: string;
}
export interface NumCp006Wave01Package {
  readonly packageId: "NUM-001"; readonly checkpointId: "NUM-CP-006";
  readonly temporaryPrototypeId: NumCp006Wave01PrototypeId; readonly permanentQlId: null;
  readonly seed: number; readonly locale: "en-IN"; readonly difficulty: NumCp006Difficulty;
  readonly answerSemantic: string; readonly representation: string; readonly stem: string;
  readonly options: readonly NumCp006Option[]; readonly correctIndex: number;
  readonly canonicalAnswer: string; readonly verifierAnswer: string;
  readonly hiddenState: Readonly<Record<string, unknown>>; readonly mathematicalFingerprint: string;
  readonly explanation: NumCp006Explanation; readonly sourceAncestry: readonly string[]; readonly prototypeAncestry: readonly string[];
  readonly lifecycle: Readonly<{
    permanentQlId: null; maturity: "EXECUTABLE_DISCOVERY_PROOF"; reviewStatus: "UNREVIEWED_DISCOVERY_CANDIDATE";
    questionBankStatus: "NOT_STORED"; testEligibility: "INELIGIBLE"; active: false;
    questionStudioDiscoverable: false; questionBankWritable: false; testEligible: false; publiclyPublishable: false;
  }>;
}
