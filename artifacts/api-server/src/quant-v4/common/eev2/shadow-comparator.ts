import type {
  EEV2DetailMode,
  StructuredExplanationBlock,
} from "./contracts";

export type EEV2ValidationStatus = "passed" | "failed" | "not-run";

export interface EngineValidationSnapshot {
  status: EEV2ValidationStatus;
  failureCodes: readonly string[];
}

interface EngineSnapshotBase<TOutput> {
  output: TOutput;
  answer: string;
  explanationLines: readonly string[];
  deterministicIdentity: string;
  engineVersion: string;
  locale: string;
  detailMode: EEV2DetailMode;
  validation: EngineValidationSnapshot;
}

export interface V1EngineSnapshot<TOutput> extends EngineSnapshotBase<TOutput> {
  engine: "v1";
  authoritativeRepresentation: "lines";
}

export interface V2EngineSnapshot<TOutput> extends EngineSnapshotBase<TOutput> {
  engine: "v2";
  authoritativeRepresentation: "blocks";
  blocks: readonly StructuredExplanationBlock[];
}

export interface ShadowFailure {
  name: string;
  message: string;
}

export type V2ShadowExecution<TOutput> =
  | { status: "succeeded"; snapshot: V2EngineSnapshot<TOutput> }
  | { status: "failed"; failure: ShadowFailure };

export interface ShadowComparisonMetadata {
  mathematicalParity: boolean | null;
  explanationPresence: { v1: boolean; v2: boolean | null };
  deterministicIdentity: { v1: string; v2: string | null };
  engineVersions: { v1: string; v2: string | null };
  locale: string;
  detailMode: EEV2DetailMode;
  failureStatus: {
    v1: "none";
    v2: "none" | "failed";
    v2Failure: ShadowFailure | null;
  };
  validationStatus: {
    v1: EngineValidationSnapshot;
    v2: EngineValidationSnapshot | null;
  };
  comparisonTimestamp: string;
}

export function serializeShadowFailure(error: unknown): ShadowFailure {
  return error instanceof Error
    ? { name: error.name, message: error.message }
    : { name: "Error", message: String(error) };
}

export function compareShadowExecutions<TV1Output, TV2Output>(
  v1: V1EngineSnapshot<TV1Output>,
  v2: V2ShadowExecution<TV2Output>,
  comparisonTimestamp: string,
): ShadowComparisonMetadata {
  if (v2.status === "failed") {
    return {
      mathematicalParity: null,
      explanationPresence: { v1: v1.explanationLines.length > 0, v2: null },
      deterministicIdentity: { v1: v1.deterministicIdentity, v2: null },
      engineVersions: { v1: v1.engineVersion, v2: null },
      locale: v1.locale,
      detailMode: v1.detailMode,
      failureStatus: { v1: "none", v2: "failed", v2Failure: v2.failure },
      validationStatus: { v1: v1.validation, v2: null },
      comparisonTimestamp,
    };
  }
  return {
    mathematicalParity: v1.answer === v2.snapshot.answer,
    explanationPresence: {
      v1: v1.explanationLines.length > 0,
      v2: v2.snapshot.blocks.length > 0 &&
        v2.snapshot.explanationLines.length > 0,
    },
    deterministicIdentity: {
      v1: v1.deterministicIdentity,
      v2: v2.snapshot.deterministicIdentity,
    },
    engineVersions: {
      v1: v1.engineVersion,
      v2: v2.snapshot.engineVersion,
    },
    locale: v1.locale,
    detailMode: v1.detailMode,
    failureStatus: { v1: "none", v2: "none", v2Failure: null },
    validationStatus: { v1: v1.validation, v2: v2.snapshot.validation },
    comparisonTimestamp,
  };
}

