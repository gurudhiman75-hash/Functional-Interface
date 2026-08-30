import type { GeoDiagramModel, GeoProofEvent, TheoremId } from "../../../../../shared/geometry";
import type { ClueMinimalityProof, MisconceptionOptionAnalysis } from "../GEO-001/discovery/phase1-types";
import type { GapWave6SourceEvidenceId } from "./wave6-source-evidence";

export type GapWave6CheckpointId = "GEO-CP-006";
export type GapWave6PackageId = "GEO-001";
export type GapWave6DiagramDisposition = "REQUIRED_BOTH" | "REQUIRED_SOLUTION_DIAGRAM";

export interface GapWave6VerifierResult {
  readonly passed: boolean;
  readonly oracle: "HIGH_PRECISION_COORDINATE" | "INDEPENDENT_DEFINITION_CHECK" | "EXACT_RATIO_CROSSCHECK";
  readonly checks: readonly string[];
}

export interface GapWave6Question {
  readonly packageId: GapWave6PackageId;
  readonly cpId: GapWave6CheckpointId;
  readonly temporaryPrototypeId: string;
  readonly sourceGapId: string;
  readonly sourceEvidenceIds: readonly GapWave6SourceEvidenceId[];
  readonly permanentQlId: null;
  readonly solveMode: string;
  readonly sourceStatus: "EXTERNAL_SOURCE_AUDIT_WAVE6__GAP_REMEDIATION";
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
  readonly independentVerifierResult: GapWave6VerifierResult;
  readonly diagramDisposition: GapWave6DiagramDisposition;
  readonly diagramModel?: GeoDiagramModel;
  readonly stemSvg?: string;
  readonly solutionDiagramModel: GeoDiagramModel;
  readonly solutionSvg: string;
  readonly canonicalGeometryFingerprint: string;
  readonly diagramFingerprint: string | null;
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

export interface GapWave6PrototypeDefinition {
  readonly temporaryPrototypeId: string;
  readonly cpId: GapWave6CheckpointId;
  readonly sourceGapId: string;
  readonly solveMode: string;
  readonly diagramDisposition: GapWave6DiagramDisposition;
  readonly generate: (seed: string) => GapWave6Question;
}
