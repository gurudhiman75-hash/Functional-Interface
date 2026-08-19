import type { GeoProofEvent, TheoremId } from "../../../../../shared/geometry";
import type { ClueMinimalityProof, MisconceptionOptionAnalysis } from "../GEO-001/discovery/phase1-types";
import type { GapWave4SourceEvidenceId } from "./wave4-source-evidence";

export type GapWave4CheckpointId = "GEO-CP-005";
export type GapWave4PackageId = "GEO-001";
export type GapWave4DiagramDisposition = "NO_DIAGRAM";

export interface GapWave4VerifierResult {
  readonly passed: boolean;
  readonly oracle: "INDEPENDENT_DEFINITION_CHECK";
  readonly checks: readonly string[];
}

export interface GapWave4Question {
  readonly packageId: GapWave4PackageId;
  readonly cpId: GapWave4CheckpointId;
  readonly temporaryPrototypeId: string;
  readonly sourceGapId: string;
  readonly sourceEvidenceIds: readonly GapWave4SourceEvidenceId[];
  readonly permanentQlId: null;
  readonly solveMode: string;
  readonly sourceStatus: "EXTERNAL_SOURCE_AUDIT_WAVE4__GAP_REMEDIATION";
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
  readonly independentVerifierResult: GapWave4VerifierResult;
  readonly diagramDisposition: GapWave4DiagramDisposition;
  readonly diagramModel?: never;
  readonly stemSvg?: never;
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

export interface GapWave4PrototypeDefinition {
  readonly temporaryPrototypeId: string;
  readonly cpId: GapWave4CheckpointId;
  readonly sourceGapId: string;
  readonly solveMode: string;
  readonly generate: (seed: string) => GapWave4Question;
}
