import type { GeoDiagramModel, GeoProofEvent, TheoremId } from "../../../../../shared/geometry";
import type { ClueMinimalityProof, MisconceptionOptionAnalysis } from "../GEO-001/discovery/phase1-types";
import type { GapWave7SourceEvidenceId } from "./wave7-source-evidence";

export type GapWave7CheckpointId = "GEO-CP-010" | "GEO-CP-011";
export type GapWave7PackageId = "GEO-002";
export type GapWave7DiagramDisposition = "REQUIRED_BOTH";

export interface GapWave7VerifierResult {
  readonly passed: boolean;
  readonly oracle: "EXACT_THEOREM_CROSSCHECK" | "HIGH_PRECISION_COORDINATE" | "INDEPENDENT_ANGLE_CHAIN";
  readonly checks: readonly string[];
}

export interface GapWave7Question {
  readonly packageId: GapWave7PackageId;
  readonly cpId: GapWave7CheckpointId;
  readonly temporaryPrototypeId: string;
  readonly sourceGapId: string;
  readonly sourceEvidenceIds: readonly GapWave7SourceEvidenceId[];
  readonly permanentQlId: null;
  readonly solveMode: string;
  readonly sourceStatus: "EXTERNAL_SOURCE_AUDIT_WAVE7__GAP_REMEDIATION";
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
  readonly independentVerifierResult: GapWave7VerifierResult;
  readonly diagramDisposition: GapWave7DiagramDisposition;
  readonly diagramModel: GeoDiagramModel;
  readonly stemSvg: string;
  readonly solutionDiagramModel: GeoDiagramModel;
  readonly solutionSvg: string;
  readonly canonicalGeometryFingerprint: string;
  readonly diagramFingerprint: string;
  readonly solutionDiagramFingerprint: string;
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

export interface GapWave7PrototypeDefinition {
  readonly temporaryPrototypeId: string;
  readonly cpId: GapWave7CheckpointId;
  readonly sourceGapId: string;
  readonly solveMode: string;
  readonly diagramDisposition: GapWave7DiagramDisposition;
  readonly generate: (seed: string) => GapWave7Question;
}
