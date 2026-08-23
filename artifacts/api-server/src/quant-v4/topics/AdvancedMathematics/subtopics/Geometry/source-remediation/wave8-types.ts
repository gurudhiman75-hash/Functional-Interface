import type { GeoProofEvent, TheoremId } from "../../../../../shared/geometry";
import type { ClueMinimalityProof, MisconceptionOptionAnalysis } from "../GEO-001/discovery/phase1-types";
import type { GapWave8SourceEvidenceId } from "./wave8-source-evidence";

export type GapWave8CheckpointId = "GEO-CP-009";
export type GapWave8PackageId = "GEO-001";
export type GapWave8DiagramDisposition = "NO_DIAGRAM";

export interface GapWave8VerifierResult {
  readonly passed: boolean;
  readonly oracle: "INDEPENDENT_DEFINITION_CHECK";
  readonly checks: readonly string[];
}

export interface GapWave8Question {
  readonly packageId: GapWave8PackageId;
  readonly cpId: GapWave8CheckpointId;
  readonly temporaryPrototypeId: string;
  readonly sourceGapId: string;
  readonly sourceEvidenceIds: readonly GapWave8SourceEvidenceId[];
  readonly permanentQlId: null;
  readonly solveMode: string;
  readonly sourceStatus: "EXTERNAL_SOURCE_AUDIT_WAVE8__GAP_REMEDIATION";
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
  readonly independentVerifierResult: GapWave8VerifierResult;
  readonly diagramDisposition: GapWave8DiagramDisposition;
  readonly diagramModel?: never;
  readonly stemSvg?: never;
  readonly solutionSvg?: never;
  readonly canonicalGeometryFingerprint: string;
  readonly diagramFingerprint: null;
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

export interface GapWave8PrototypeDefinition {
  readonly temporaryPrototypeId: string;
  readonly cpId: GapWave8CheckpointId;
  readonly sourceGapId: string;
  readonly solveMode: string;
  readonly generate: (seed: string) => GapWave8Question;
}
