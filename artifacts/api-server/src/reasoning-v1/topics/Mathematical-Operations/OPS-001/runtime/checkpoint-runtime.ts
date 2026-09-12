import {
  OPS_CHECKPOINT_RANGES,
  OPS_QL_ENTRIES,
  generateFrozenOpsQuestion,
  generateLocalizedFrozenOpsQuestion,
  type FrozenOpsQuestion,
  type LocalizedFrozenOpsQuestion,
  type OpsCheckpointId,
  type OpsQlId,
} from "../registry";

export type OpsRuntimeLanguage = "en" | "hi" | "pa";

export type OpsCheckpointGeneratedQuestion =
  | FrozenOpsQuestion
  | LocalizedFrozenOpsQuestion;

export interface OpsCheckpointRuntime {
  readonly checkpointId: OpsCheckpointId;
  readonly qlRange: readonly [OpsQlId, OpsQlId];
  readonly qlIds: readonly OpsQlId[];
  readonly qlCount: number;
  readonly supportedLanguages: readonly OpsRuntimeLanguage[];
  readonly runtimeVersion: "ops-001-v1";
  readonly maturity: "FROZEN_INTERNAL";
  readonly publiclyPublishable: false;
  generate(
    qlId: OpsQlId,
    input?: { readonly seed?: number; readonly language?: OpsRuntimeLanguage },
  ): OpsCheckpointGeneratedQuestion;
}

function assertSeed(seed: number): number {
  if (!Number.isInteger(seed) || seed < 0) {
    throw new Error(`OPS-001 seed must be a non-negative integer; received ${seed}.`);
  }
  return seed;
}

function qlIdsForCheckpoint(checkpointId: OpsCheckpointId): OpsQlId[] {
  return OPS_QL_ENTRIES
    .filter((entry) => entry.checkpointId === checkpointId)
    .map((entry) => entry.qlId);
}

function createCheckpointRuntime(checkpointId: OpsCheckpointId): OpsCheckpointRuntime {
  const range = OPS_CHECKPOINT_RANGES[checkpointId];
  const qlIds = qlIdsForCheckpoint(checkpointId);
  if (qlIds.length !== range.count) {
    throw new Error(
      `${checkpointId} runtime owns ${qlIds.length} QLs but the frozen range declares ${range.count}.`,
    );
  }

  return {
    checkpointId,
    qlRange: [range.first, range.last],
    qlIds,
    qlCount: qlIds.length,
    supportedLanguages: ["en", "hi", "pa"],
    runtimeVersion: "ops-001-v1",
    maturity: "FROZEN_INTERNAL",
    publiclyPublishable: false,
    generate(qlId, input = {}) {
      if (!qlIds.includes(qlId)) {
        throw new Error(`${qlId} is not owned by ${checkpointId}.`);
      }
      const seed = assertSeed(input.seed ?? 0);
      const language = input.language ?? "en";
      if (language === "en") return generateFrozenOpsQuestion(qlId, seed);
      return generateLocalizedFrozenOpsQuestion(
        qlId,
        seed,
        language === "hi" ? "hi-IN" : "pa-IN",
      );
    },
  };
}

export const OPS_CHECKPOINT_RUNTIMES = {
  "OPS-CP-001": createCheckpointRuntime("OPS-CP-001"),
  "OPS-CP-002": createCheckpointRuntime("OPS-CP-002"),
  "OPS-CP-003": createCheckpointRuntime("OPS-CP-003"),
  "OPS-CP-004": createCheckpointRuntime("OPS-CP-004"),
  "OPS-CP-005": createCheckpointRuntime("OPS-CP-005"),
  "OPS-CP-006": createCheckpointRuntime("OPS-CP-006"),
  "OPS-CP-007": createCheckpointRuntime("OPS-CP-007"),
  "OPS-CP-008": createCheckpointRuntime("OPS-CP-008"),
  "OPS-CP-009": createCheckpointRuntime("OPS-CP-009"),
} as const satisfies Readonly<Record<OpsCheckpointId, OpsCheckpointRuntime>>;

export function getOpsCheckpointRuntime(
  checkpointId: OpsCheckpointId,
): OpsCheckpointRuntime {
  const runtime = OPS_CHECKPOINT_RUNTIMES[checkpointId];
  if (!runtime) throw new Error(`Unknown OPS-001 checkpoint: ${checkpointId}`);
  return runtime;
}
