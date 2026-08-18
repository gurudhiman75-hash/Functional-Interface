import type {
  GeoDiagramModel,
  GeoProofEvent,
  TheoremId,
} from "../../../../../../shared/geometry";

export type Phase1CheckpointId = "GEO-CP-001" | "GEO-CP-002" | "GEO-CP-003";
export type Phase1Difficulty = "Easy" | "Medium";

export interface MisconceptionOptionAnalysis {
  readonly text: string;
  readonly misconceptionId: string | null;
  readonly rationale: string;
  readonly correct: boolean;
}

export interface ClueRemovalAttempt {
  readonly removedClueId: string;
  readonly outcome: string | null;
  readonly changedSolutionPolicy: boolean;
}

export interface ClueMinimalityProof {
  readonly fullOutcome: string;
  readonly clueIds: readonly string[];
  readonly attempts: readonly ClueRemovalAttempt[];
  readonly passed: boolean;
}

export interface IndependentVerifierResult {
  readonly passed: boolean;
  readonly oracle: "COORDINATE_ORACLE" | "INDEPENDENT_ARITHMETIC" | "EXACT_RANGE_ENUMERATION";
  readonly checks: readonly string[];
}

export interface Phase1PrototypeQuestion {
  readonly packageId: "GEO-001";
  readonly cpId: Phase1CheckpointId;
  readonly temporaryPrototypeId: string;
  readonly permanentQlId: null;
  readonly solveMode: string;
  readonly sourceStatus: "AUTHORITY_SEEDED__EXTERNAL_SOURCE_AUDIT_OPEN";
  readonly difficulty: Phase1Difficulty;
  readonly language: "en-IN";
  readonly seed: string;
  readonly stem: string;
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly answer: string;
  readonly optionAnalysis: readonly MisconceptionOptionAnalysis[];
  readonly explanation: Readonly<{
    lines: readonly string[];
    theoremNames: readonly string[];
  }>;
  readonly theoremTrace: readonly TheoremId[];
  readonly proofEvents: readonly GeoProofEvent[];
  readonly displayedClueIds: readonly string[];
  readonly minimalityProof: ClueMinimalityProof;
  readonly independentVerifierResult: IndependentVerifierResult;
  readonly diagramModel?: GeoDiagramModel;
  readonly stemSvg?: string;
  readonly canonicalGeometryFingerprint: string;
  readonly diagramFingerprint: string | null;
  readonly validation: Readonly<{
    ok: boolean;
    errors: readonly string[];
  }>;
  readonly lifecycle: Readonly<{
    stage: "DISCOVERY";
    permanentQlAllocated: false;
    questionStudioDiscoverable: false;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
  }>;
}

export interface Phase1PrototypeDefinition {
  readonly temporaryPrototypeId: string;
  readonly cpId: Phase1CheckpointId;
  readonly solveMode: string;
  readonly generate: (seed: string) => Phase1PrototypeQuestion;
}
