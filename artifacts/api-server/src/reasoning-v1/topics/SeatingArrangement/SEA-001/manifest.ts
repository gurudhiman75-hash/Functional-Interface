import type { SeatingBlueprintId } from "./types.ts";
import type { MixedFacingBlueprintId } from "./cp002/types.ts";
import type { CircularBlueprintId } from "./cp003/types.ts";
import type { OutwardBlueprintId } from "./cp004/types.ts";
import type { MixedCircleBlueprintId } from "./cp005/types.ts";

export const SEA_001_BLUEPRINTS: readonly SeatingBlueprintId[] = [
  "SEA-PBA-001",
  "SEA-PBA-002",
  "SEA-PBA-003",
  "SEA-PBA-004",
];

export const SEA_001_CP002_BLUEPRINTS: readonly MixedFacingBlueprintId[] = [
  "SEA-PBA-005",
  "SEA-PBA-006",
  "SEA-PBA-007",
  "SEA-PBA-008",
];

export const SEA_001_CP003_BLUEPRINTS: readonly CircularBlueprintId[] = [
  "SEA-PBA-009",
  "SEA-PBA-010",
  "SEA-PBA-011",
  "SEA-PBA-012",
];

export const SEA_001_CP004_BLUEPRINTS: readonly OutwardBlueprintId[] = [
  "SEA-PBA-013",
  "SEA-PBA-014",
  "SEA-PBA-015",
  "SEA-PBA-016",
];

export const SEA_001_CP005_BLUEPRINTS: readonly MixedCircleBlueprintId[] = [
  "SEA-PBA-017",
  "SEA-PBA-018",
  "SEA-PBA-019",
  "SEA-PBA-020",
];

export const SEA_001_AUTHORITY_DISCREPANCIES = [
  {
    id: "SEA-AUTH-DISC-001",
    status: "RESOLVED_BY_NAMED_INVENTORY_PRECEDENCE",
    statement: "Wave 2 requests five provisional CP-001 blueprints, while the explicit authoritative blueprint inventory enumerates only SEA-PBA-001 through SEA-PBA-004 for CP-001.",
    implementationDecision: "Treat the explicit named inventory as controlling: retain SEA-PBA-001 through SEA-PBA-004 and do not invent an unnamed fifth blueprint. Preserve this record so the roadmap-count discrepancy remains visible rather than silently reconciled.",
  },
] as const;

export const SEA_CP003_AUTHORITY_NOTES = [
  {
    id: "SEA-AUTH-NOTE-002",
    status: "IMPLEMENTED_WITH_GUARD",
    statement: "The CP-003 variant list names 6, 8 and 10 persons while the same authority separately requires odd-N variants without opposite clues.",
    implementationDecision: "Keep SEA-PBA-009 even-only; allow guarded 7- and 9-person discovery variants in SEA-PBA-010 through SEA-PBA-012, where opposite clues and queries are structurally disabled.",
  },
] as const;

export const SEA_FAMILY_MANIFEST = Object.freeze({
  family: "REAS-SEA",
  packages: ["SEA-001", "SEA-002", "SEA-003"] as const,
  activePackage: "SEA-001" as const,
  implementedCheckpoints: ["SEA-CP-001", "SEA-CP-002", "SEA-CP-003", "SEA-CP-004", "SEA-CP-005"] as const,
  completedRoadmapWaves: ["WAVE-0-GOVERNANCE", "WAVE-1-CONSTRAINT-CORE", "WAVE-2-SEA-CP-001", "WAVE-3-SEA-CP-003", "WAVE-4-VERIFICATION-HARDENING"] as const,
  activeRoadmapWave: "WAVE-5-SATURATION-AUDIT-FREEZE" as const,
  completedWave5Checkpoints: ["SEA-CP-002", "SEA-CP-004", "SEA-CP-005"] as const,
  nextCheckpointSequence: [] as const,
  remainingWave5Gates: [] as const,
  permanentQlCount: 20 as const,
  permanentQlRange: ["SEA-QL-001", "SEA-QL-020"] as const,
  nextPermanentQlId: "SEA-QL-021" as const,
  solveInventoryStatus: "FROZEN" as const,
  queryMixStatus: "FROZEN" as const,
  englishFreezeStatus: "FROZEN" as const,
  localizationStatus: "NOT_STARTED" as const,
  activationStatus: "INACTIVE" as const,
});
