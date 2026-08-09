import type { SeatingBlueprintId } from "./types.ts";

export const SEA_001_BLUEPRINTS: readonly SeatingBlueprintId[] = [
  "SEA-PBA-001",
  "SEA-PBA-002",
  "SEA-PBA-003",
  "SEA-PBA-004",
];

export const SEA_001_AUTHORITY_DISCREPANCIES = [
  {
    id: "SEA-AUTH-DISC-001",
    status: "OPEN",
    statement: "Wave 2 requests five provisional CP-001 blueprints, while the authoritative blueprint inventory enumerates only SEA-PBA-001 through SEA-PBA-004 for CP-001.",
    implementationDecision: "Implement the four named authorities and do not invent a fifth authority before governance review.",
  },
] as const;

export const SEA_FAMILY_MANIFEST = Object.freeze({
  family: "REAS-SEA",
  packages: ["SEA-001", "SEA-002", "SEA-003"] as const,
  activePackage: "SEA-001" as const,
  activeCheckpoint: "SEA-CP-001" as const,
  permanentQlCount: 0 as const,
});
