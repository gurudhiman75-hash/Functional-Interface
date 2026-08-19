import type { GeoDiagramModel, GeoProofEvent, TheoremId } from "../../../../../shared/geometry";
import type { ClueMinimalityProof, MisconceptionOptionAnalysis } from "../GEO-001/discovery/phase1-types";
import type { GapWave2SourceEvidenceId } from "./wave2-source-evidence";

export type GapWave2CheckpointId = "GEO-CP-012" | "GEO-CP-014";
export type GapWave2PackageId = "GEO-002";
export type DiagramDisposition =
  | "NO_DIAGRAM"
  | "OPTIONAL_STEM_DIAGRAM"
  | "REQUIRED_STEM_DIAGRAM"
  | "REQUIRED_SOLUTION_DIAGRAM"
  | "REQUIRED_BOTH";

export interface GapWave2VerifierResult {
  readonly passed: boolean;
  readonly oracle: "COORDINATE_ORACLE" | "HIGH_PRECISION_COORDINATE" | "INDEPENDENT_DEFINITION_CHECK";
  readonly checks: readonly string[];
}

export interface GapWave2Question {
  readonly packageId: GapWave2PackageId;
  readonly cpId: GapWave2CheckpointId;
  readonly temporaryPrototypeId: string;
  readonly sourceGapId: string;
  readonly sourceEvidenceIds: readonly GapWave2SourceEvidenceId[];
  readonly permanentQlId: null;
  readonly solveMode: string;
  readonly sourceStatus: "EXTERNAL_SOURCE_AUDIT_WAVE2__GAP_REMEDIATION";
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
  readonly independentVerifierResult: GapWave2VerifierResult;
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

export interface GapWave2PrototypeDefinition {
  readonly temporaryPrototypeId: string;
  readonly cpId: GapWave2CheckpointId;
  readonly sourceGapId: string;
  readonly solveMode: string;
  readonly generate: (seed: string) => GapWave2Question;
}
