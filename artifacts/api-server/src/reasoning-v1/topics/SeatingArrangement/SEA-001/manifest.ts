import { SEA_001_MASTER_AUTHORITY, type Sea001CheckpointId } from "./types.ts";

export interface Sea001CheckpointManifestEntry {
  readonly checkpointId: Sea001CheckpointId;
  readonly title: string;
  readonly blueprintAuthorityRange: readonly [string, string];
  readonly scope: readonly string[];
  readonly prerequisites: readonly Sea001CheckpointId[];
}

export const SEA_001_CHECKPOINT_MANIFEST: readonly Sea001CheckpointManifestEntry[] = Object.freeze([
  {
    checkpointId: "SEA-CP-001",
    title: "Single row — same facing",
    blueprintAuthorityRange: ["SEA-PBA-001", "SEA-PBA-004"],
    scope: ["LINEAR_SINGLE_ROW", "SAME_FACING", "5_TO_8_PERSONS"],
    prerequisites: [],
  },
  {
    checkpointId: "SEA-CP-002",
    title: "Single row — mixed facing",
    blueprintAuthorityRange: ["SEA-PBA-005", "SEA-PBA-008"],
    scope: ["LINEAR_SINGLE_ROW", "MIXED_FACING", "6_TO_8_PERSONS"],
    prerequisites: ["SEA-CP-001"],
  },
  {
    checkpointId: "SEA-CP-003",
    title: "Circular — facing centre",
    blueprintAuthorityRange: ["SEA-PBA-009", "SEA-PBA-012"],
    scope: ["CIRCULAR", "FACING_CENTRE", "6_TO_8_PERSONS"],
    prerequisites: ["SEA-CP-001"],
  },
  {
    checkpointId: "SEA-CP-004",
    title: "Circular — facing outward",
    blueprintAuthorityRange: ["SEA-PBA-013", "SEA-PBA-016"],
    scope: ["CIRCULAR", "FACING_OUTWARD", "6_TO_8_PERSONS"],
    prerequisites: ["SEA-CP-003"],
  },
  {
    checkpointId: "SEA-CP-005",
    title: "Circular — mixed facing",
    blueprintAuthorityRange: ["SEA-PBA-017", "SEA-PBA-020"],
    scope: ["CIRCULAR", "MIXED_FACING", "8_PERSONS"],
    prerequisites: ["SEA-CP-003", "SEA-CP-004"],
  },
]);

export const SEA_001_PACKAGE_MANIFEST = Object.freeze({
  packageId: "SEA-001" as const,
  masterAuthority: SEA_001_MASTER_AUTHORITY,
  checkpointIds: SEA_001_CHECKPOINT_MANIFEST.map((entry) => entry.checkpointId),
  permanentLayer: Object.freeze({
    status: "PERMANENT_INACTIVE_FROZEN" as const,
    permanentQlRange: ["SEA-QL-001", "SEA-QL-020"] as const,
    nextPermanentQlId: "SEA-QL-021" as const,
    permanentQlCount: 20 as const,
    solveInventoryStatus: "FROZEN" as const,
    queryMixStatus: "FROZEN" as const,
    englishFreezeStatus: "FROZEN" as const,
    localizationStatus: "NOT_STARTED" as const,
    active: false as const,
  }),
});
