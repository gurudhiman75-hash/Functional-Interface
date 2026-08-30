import type { GeoDiagramModel, GeoProofEvent, TheoremId } from "../../../../../shared/geometry";
import type { ClueMinimalityProof, MisconceptionOptionAnalysis } from "../GEO-001/discovery/phase1-types";
import type { GapWave9SourceEvidenceId } from "./wave9-source-evidence";

export type GapWave9CheckpointId = "GEO-CP-001" | "GEO-CP-002" | "GEO-CP-003";
export type GapWave9PackageId = "GEO-001";
export type GapWave9DiagramDisposition = "NO_DIAGRAM" | "REQUIRED_STEM_DIAGRAM";

export interface GapWave9VerifierResult {
  readonly passed: boolean;
  readonly oracle: "INDEPENDENT_ARITHMETIC" | "INDEPENDENT_DEFINITION_CHECK" | "COORDINATE_ORACLE";
  readonly checks: readonly string[];
}

export interface GapWave9Question {
  readonly packageId: GapWave9PackageId;
  readonly cpId: GapWave9CheckpointId;
  readonly temporaryPrototypeId: string;
  readonly sourceGapId: string;
  readonly sourceEvidenceIds: readonly GapWave9SourceEvidenceId[];
  readonly permanentQlId: null;
  readonly solveMode: string;
  readonly sourceStatus: "EXTERNAL_SOURCE_AUDIT_WAVE9__GAP_REMEDIATION";
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
  readonly independentVerifierResult: GapWave9VerifierResult;
  readonly diagramDisposition: GapWave9DiagramDisposition;
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

export interface GapWave9PrototypeDefinition {
  readonly temporaryPrototypeId: string;
  readonly cpId: GapWave9CheckpointId;
  readonly sourceGapId: string;
  readonly solveMode: string;
  readonly generate: (seed: string) => GapWave9Question;
}
