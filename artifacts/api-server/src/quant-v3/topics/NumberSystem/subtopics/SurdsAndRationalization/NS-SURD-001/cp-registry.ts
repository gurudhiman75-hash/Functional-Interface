import type { CpRegistryEntry, SurdCpId } from "./types";

export const CP_REGISTRY = [
  {
    cpId: "CP01",
    packageId: "NS-SURD-001",
    title: "Perfect-power extraction from a surd",
    topologyId: "NS-SURD-001-T01",
    reasoningPatternIds: ["Pattern 1"],
    explanationId: "ES-001",
    qlStart: "QL-001",
    qlEnd: "QL-020",
  },
  {
    cpId: "CP02",
    packageId: "NS-SURD-001",
    title: "Like-surd addition and subtraction",
    topologyId: "NS-SURD-001-T02",
    reasoningPatternIds: ["Pattern 1", "Pattern 2"],
    explanationId: "ES-002",
    qlStart: "QL-021",
    qlEnd: "QL-040",
  },
  {
    cpId: "CP03",
    packageId: "NS-SURD-001",
    title: "Surd multiplication and division simplification",
    topologyId: "NS-SURD-001-T03",
    reasoningPatternIds: ["Pattern 3"],
    explanationId: "ES-003",
    qlStart: "QL-041",
    qlEnd: "QL-060",
  },
  {
    cpId: "CP04",
    packageId: "NS-SURD-001",
    title: "Mixed surd expression simplification",
    topologyId: "NS-SURD-001-T04",
    reasoningPatternIds: ["Pattern 1", "Pattern 2", "Pattern 3", "Pattern 7"],
    explanationId: "ES-004",
    qlStart: "QL-061",
    qlEnd: "QL-085",
  },
  {
    cpId: "CP05",
    packageId: "NS-SURD-001",
    title: "Surd comparison by normalization",
    topologyId: "NS-SURD-001-T05",
    reasoningPatternIds: ["Pattern 4"],
    explanationId: "ES-005",
    qlStart: "QL-086",
    qlEnd: "QL-120",
  },
  {
    cpId: "CP06",
    packageId: "NS-SURD-001",
    title: "Monomial denominator rationalization",
    topologyId: "NS-SURD-001-T06",
    reasoningPatternIds: ["Pattern 5"],
    explanationId: "ES-006",
    qlStart: "QL-121",
    qlEnd: "QL-135",
  },
  {
    cpId: "CP07",
    packageId: "NS-SURD-001",
    title: "Binomial denominator rationalization",
    topologyId: "NS-SURD-001-T07",
    reasoningPatternIds: ["Pattern 6"],
    explanationId: "ES-007",
    qlStart: "QL-136",
    qlEnd: "QL-155",
  },
  {
    cpId: "CP08",
    packageId: "NS-SURD-001",
    title: "Surd identity evaluation",
    topologyId: "NS-SURD-001-T08",
    reasoningPatternIds: ["Pattern 8"],
    explanationId: "ES-008",
    qlStart: "QL-156",
    qlEnd: "QL-175",
  },
] as const satisfies readonly CpRegistryEntry[];

export function getCpRegistryEntry(cpId: SurdCpId): CpRegistryEntry {
  const entry = CP_REGISTRY.find((cp) => cp.cpId === cpId);
  if (!entry) {
    throw new Error(`Unknown NS-SURD-001 CP id: ${cpId}`);
  }
  return entry;
}
