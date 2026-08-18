import type { GeoDiagramModel, GeoProofEvent, TheoremId } from "../../../../../../shared/geometry";
import type { ClueMinimalityProof, MisconceptionOptionAnalysis } from "../../GEO-001/discovery/phase1-types";

export type Phase4CheckpointId = "GEO-CP-010" | "GEO-CP-011" | "GEO-CP-012" | "GEO-CP-013";
export type Phase4Difficulty = "Easy" | "Medium";

export interface Phase4VerifierResult {
  readonly passed: boolean;
  readonly oracle: "COORDINATE_ORACLE" | "HIGH_PRECISION_COORDINATE" | "EXACT_PRODUCT_CHECK" | "INDEPENDENT_ARITHMETIC";
  readonly checks: readonly string[];
}

export interface Phase4PrototypeQuestion {
  readonly packageId: "GEO-002";
  readonly cpId: Phase4CheckpointId;
  readonly temporaryPrototypeId: string;
  readonly permanentQlId: null;
  readonly solveMode: string;
  readonly sourceStatus: "AUTHORITY_SEEDED__EXTERNAL_SOURCE_AUDIT_OPEN";
  readonly difficulty: Phase4Difficulty;
  readonly language: "en-IN";
  readonly seed: string;
  readonly stem: string;
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly answer: string;
  readonly optionAnalysis: readonly MisconceptionOptionAnalysis[];
  readonly explanation: Readonly<{ lines: readonly string[]; theoremNames: readonly string[] }>;
  readonly theoremTrace: readonly TheoremId[];
  readonly proofEvents: readonly GeoProofEvent[];
  readonly displayedClueIds: readonly string[];
  readonly minimalityProof: ClueMinimalityProof;
  readonly independentVerifierResult: Phase4VerifierResult;
  readonly diagramModel?: GeoDiagramModel;
  readonly stemSvg?: string;
  readonly canonicalGeometryFingerprint: string;
  readonly diagramFingerprint: string | null;
  readonly validation: Readonly<{ ok: boolean; errors: readonly string[] }>;
  readonly lifecycle: Readonly<{
    stage: "DISCOVERY";
    permanentQlAllocated: false;
    questionStudioDiscoverable: false;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
  }>;
}

export interface Phase4PrototypeDefinition {
  readonly temporaryPrototypeId: string;
  readonly cpId: Phase4CheckpointId;
  readonly solveMode: string;
  readonly generate: (seed: string) => Phase4PrototypeQuestion;
}
