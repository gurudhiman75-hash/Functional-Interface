import type { GeoDiagramModel, GeoProofEvent, TheoremId } from "../../../../../shared/geometry";
import type { ClueMinimalityProof, MisconceptionOptionAnalysis } from "../GEO-001/discovery/phase1-types";
import type { GapWave3SourceEvidenceId } from "./wave3-source-evidence";

export type GapWave3CheckpointId = "GEO-CP-006";
export type GapWave3PackageId = "GEO-001";
export type DiagramDisposition =
  | "NO_DIAGRAM"
  | "OPTIONAL_STEM_DIAGRAM"
  | "REQUIRED_STEM_DIAGRAM"
  | "REQUIRED_SOLUTION_DIAGRAM"
  | "REQUIRED_BOTH";

export interface GapWave3VerifierResult {
  readonly passed: boolean;
  readonly oracle: "COORDINATE_ORACLE" | "HIGH_PRECISION_COORDINATE" | "INDEPENDENT_DEFINITION_CHECK";
  readonly checks: readonly string[];
}

export interface GapWave3Question {
  readonly packageId: GapWave3PackageId;
  readonly cpId: GapWave3CheckpointId;
  readonly temporaryPrototypeId: string;
  readonly sourceGapId: string;
  readonly sourceEvidenceIds: readonly GapWave3SourceEvidenceId[];
  readonly permanentQlId: null;
  readonly solveMode: string;
  readonly sourceStatus: "EXTERNAL_SOURCE_AUDIT_WAVE3__GAP_REMEDIATION";
  readonly difficulty: "Easy" | "Medium";
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
  readonly independentVerifierResult: GapWave3VerifierResult;
  readonly diagramDisposition: DiagramDisposition;
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

export interface GapWave3PrototypeDefinition {
  readonly temporaryPrototypeId: string;
  readonly cpId: GapWave3CheckpointId;
  readonly sourceGapId: string;
  readonly solveMode: string;
  readonly generate: (seed: string) => GapWave3Question;
}
