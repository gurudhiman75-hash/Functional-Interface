import type { GeoDiagramModel, GeoProofEvent, TheoremId } from "../../../../../../shared/geometry";
import type { ClueMinimalityProof, MisconceptionOptionAnalysis } from "../../GEO-001/discovery/phase1-types";
import type { Phase4VerifierResult } from "./phase4-types";

export type Phase5CheckpointId = "GEO-CP-014";
export type Phase5Difficulty = "Medium" | "Hard";

export interface Phase5PrototypeQuestion {
  readonly packageId: "GEO-002";
  readonly cpId: Phase5CheckpointId;
  readonly temporaryPrototypeId: string;
  readonly permanentQlId: null;
  readonly solveMode: string;
  readonly sourceStatus: "AUTHORITY_SEEDED__EXTERNAL_SOURCE_AUDIT_OPEN";
  readonly difficulty: Phase5Difficulty;
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

export interface Phase5PrototypeDefinition {
  readonly temporaryPrototypeId: string;
  readonly cpId: Phase5CheckpointId;
  readonly solveMode: string;
  readonly generate: (seed: string) => Phase5PrototypeQuestion;
}
