import { WOR_CP001_PROTOTYPES } from "./WOR-CP-001/registry";
import { WOR_CP002_PROTOTYPES } from "./WOR-CP-002/registry";
import { WOR_CP003_PROTOTYPES } from "./WOR-CP-003/registry";
import { WOR_CP004_PROTOTYPES } from "./WOR-CP-004/registry";
import { WOR_CP005_PROTOTYPES } from "./WOR-CP-005/registry";
import type { WorCheckpointId, WorPrototypeContract } from "./foundation/types";

// Backward-compatible classic collection used by the V1 classic audit.
export const WOR_001_PROTOTYPES: readonly WorPrototypeContract[] = [
  ...WOR_CP001_PROTOTYPES,
  ...WOR_CP002_PROTOTYPES,
  ...WOR_CP003_PROTOTYPES,
  ...WOR_CP004_PROTOTYPES,
];

export const WOR_001_ALL_PROTOTYPES: readonly WorPrototypeContract[] = [
  ...WOR_001_PROTOTYPES,
  ...WOR_CP005_PROTOTYPES,
];

export const WOR_001_CHECKPOINTS = [
  { checkpointId: "WOR-CP-001" as const, title: "Complete Dictionary Ordering", prototypeCount: WOR_CP001_PROTOTYPES.length },
  { checkpointId: "WOR-CP-002" as const, title: "Position and Neighbour Queries", prototypeCount: WOR_CP002_PROTOTYPES.length },
  { checkpointId: "WOR-CP-003" as const, title: "Insertion, Correction and Partial Order", prototypeCount: WOR_CP003_PROTOTYPES.length },
  { checkpointId: "WOR-CP-004" as const, title: "Advanced Lexicographic Discrimination", prototypeCount: WOR_CP004_PROTOTYPES.length },
] as const;

export const WOR_001_ALL_CHECKPOINTS = [
  ...WOR_001_CHECKPOINTS,
  { checkpointId: "WOR-CP-005" as const, title: "Banking Word/Cluster Sequence Composites", prototypeCount: WOR_CP005_PROTOTYPES.length },
] as const;

export function worPrototypeById(prototypeId: string): WorPrototypeContract {
  const found = WOR_001_ALL_PROTOTYPES.find((entry) => entry.prototypeId === prototypeId);
  if (!found) throw new Error(`Unknown WOR-001 prototype: ${prototypeId}`);
  return found;
}

export function worPrototypesForCheckpoint(checkpointId: WorCheckpointId): readonly WorPrototypeContract[] {
  return WOR_001_ALL_PROTOTYPES.filter((entry) => entry.checkpointId === checkpointId);
}
