import type { GeoDiagramModel, GeoProofEvent, TheoremId } from "../../../../../shared/geometry";
import type { ClueMinimalityProof, MisconceptionOptionAnalysis } from "../GEO-001/discovery/phase1-types";
import type { GapWave5SourceEvidenceId } from "./wave5-source-evidence";

export type GapWave5CheckpointId = "GEO-CP-014";
export type GapWave5PackageId = "GEO-002";
export type GapWave5DiagramDisposition = "REQUIRED_STEM_DIAGRAM";

export interface GapWave5VerifierResult {
  readonly passed: boolean;
  readonly oracle: "HIGH_PRECISION_COORDINATE" | "INDEPENDENT_DEFINITION_CHECK";
  readonly checks: readonly string[];
}

export interface GapWave5Question {
  readonly packageId: GapWave5PackageId;
  readonly cpId: GapWave5CheckpointId;
  readonly temporaryPrototypeId: string;
  readonly sourceGapId: string;
  readonly sourceEvidenceIds: readonly GapWave5SourceEvidenceId[];
  readonly permanentQlId: null;
  readonly solveMode: string;
  readonly sourceStatus: "EXTERNAL_SOURCE_AUDIT_WAVE5__GAP_REMEDIATION";
  readonly difficulty: "Medium";
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
  readonly independentVerifierResult: GapWave5VerifierResult;
  readonly diagramDisposition: GapWave5DiagramDisposition;
  readonly diagramModel: GeoDiagramModel;
  readonly stemSvg: string;
  readonly canonicalGeometryFingerprint: string;
  readonly diagramFingerprint: string;
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

export interface GapWave5PrototypeDefinition {
  readonly temporaryPrototypeId: string;
  readonly cpId: GapWave5CheckpointId;
  readonly sourceGapId: string;
  readonly solveMode: string;
  readonly generate: (seed: string) => GapWave5Question;
}
