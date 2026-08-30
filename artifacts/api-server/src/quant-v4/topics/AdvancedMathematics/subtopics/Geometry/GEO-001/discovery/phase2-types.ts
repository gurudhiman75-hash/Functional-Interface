import type {
  GeoDiagramModel,
  GeoProofEvent,
  TheoremId,
} from "../../../../../../shared/geometry";
import type {
  ClueMinimalityProof,
  IndependentVerifierResult,
  MisconceptionOptionAnalysis,
} from "./phase1-types";

export type Phase2CheckpointId = "GEO-CP-004" | "GEO-CP-005" | "GEO-CP-006";
export type Phase2Difficulty = "Easy" | "Medium";

export interface Phase2PrototypeQuestion {
  readonly packageId: "GEO-001";
  readonly cpId: Phase2CheckpointId;
  readonly temporaryPrototypeId: string;
  readonly permanentQlId: null;
  readonly solveMode: string;
  readonly sourceStatus: "AUTHORITY_SEEDED__EXTERNAL_SOURCE_AUDIT_OPEN";
  readonly difficulty: Phase2Difficulty;
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

export interface Phase2PrototypeDefinition {
  readonly temporaryPrototypeId: string;
  readonly cpId: Phase2CheckpointId;
  readonly solveMode: string;
  readonly generate: (seed: string) => Phase2PrototypeQuestion;
}
