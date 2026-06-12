import type { CpRegistryEntry } from "./types";

export const CP_REGISTRY = [
  {
    cpId: "CP-001",
    packageId: "SIMPL-001",
    title: "BODMAS Exact Simplification",
    topologyId: "SIMPL-001-T01",
    reasoningPatternIds: ["RP-001"],
    explanationId: "ES-001",
    qlStart: "QL-001",
    qlEnd: "QL-025",
  },
  {
    cpId: "CP-002",
    packageId: "SIMPL-001",
    title: "Fraction Expression Simplification",
    topologyId: "SIMPL-001-T02",
    reasoningPatternIds: ["RP-002"],
    explanationId: "ES-002",
    qlStart: "QL-026",
    qlEnd: "QL-050",
  },
  {
    cpId: "CP-003",
    packageId: "SIMPL-001",
    title: "Decimal Expression Simplification",
    topologyId: "SIMPL-001-T03",
    reasoningPatternIds: ["RP-003"],
    explanationId: "ES-003",
    qlStart: "QL-051",
    qlEnd: "QL-070",
  },
  {
    cpId: "CP-004",
    packageId: "SIMPL-001",
    title: "Mixed Fraction And Decimal Simplification",
    topologyId: "SIMPL-001-T04",
    reasoningPatternIds: ["RP-001", "RP-002", "RP-003", "RP-004"],
    explanationId: "ES-004",
    qlStart: "QL-071",
    qlEnd: "QL-095",
  },
  {
    cpId: "CP-005",
    packageId: "SIMPL-001",
    title: "Root And Power Expression Simplification",
    topologyId: "SIMPL-001-T05",
    reasoningPatternIds: ["RP-001", "RP-005"],
    explanationId: "ES-005",
    qlStart: "QL-096",
    qlEnd: "QL-125",
  },
  {
    cpId: "CP-006",
    packageId: "SIMPL-001",
    title: "Approximation By Rounding",
    topologyId: "SIMPL-001-T06",
    reasoningPatternIds: ["RP-006"],
    explanationId: "ES-006",
    qlStart: "QL-126",
    qlEnd: "QL-150",
  },
  {
    cpId: "CP-007",
    packageId: "SIMPL-001",
    title: "Closest Or Nearest Value Selection",
    topologyId: "SIMPL-001-T07",
    reasoningPatternIds: ["RP-007"],
    explanationId: "ES-007",
    qlStart: "QL-151",
    qlEnd: "QL-180",
  },
] as const satisfies CpRegistryEntry[];

export function getCpRegistryEntry(cpId: CpRegistryEntry["cpId"]): CpRegistryEntry {
  const entry = CP_REGISTRY.find((candidate) => candidate.cpId === cpId);
  if (!entry) {
    throw new Error(`Unknown SIMPL-001 CP id: ${cpId}`);
  }
  return entry;
}
