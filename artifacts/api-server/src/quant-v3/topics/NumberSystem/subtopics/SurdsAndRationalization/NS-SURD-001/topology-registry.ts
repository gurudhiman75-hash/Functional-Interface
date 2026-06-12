import type { SurdTopologyId, TopologyRegistryEntry } from "./types";

export const TOPOLOGY_REGISTRY = [
  {
    topologyId: "NS-SURD-001-T01",
    packageId: "NS-SURD-001",
    parentCpId: "CP01",
    coverageStatus: "covered",
  },
  {
    topologyId: "NS-SURD-001-T02",
    packageId: "NS-SURD-001",
    parentCpId: "CP02",
    coverageStatus: "covered",
  },
  {
    topologyId: "NS-SURD-001-T03",
    packageId: "NS-SURD-001",
    parentCpId: "CP03",
    coverageStatus: "covered",
  },
  {
    topologyId: "NS-SURD-001-T04",
    packageId: "NS-SURD-001",
    parentCpId: "CP04",
    coverageStatus: "covered",
  },
  {
    topologyId: "NS-SURD-001-T05",
    packageId: "NS-SURD-001",
    parentCpId: "CP05",
    coverageStatus: "covered",
  },
  {
    topologyId: "NS-SURD-001-T06",
    packageId: "NS-SURD-001",
    parentCpId: "CP06",
    coverageStatus: "covered",
  },
  {
    topologyId: "NS-SURD-001-T07",
    packageId: "NS-SURD-001",
    parentCpId: "CP07",
    coverageStatus: "covered",
  },
  {
    topologyId: "NS-SURD-001-T08",
    packageId: "NS-SURD-001",
    parentCpId: "CP08",
    coverageStatus: "covered",
  },
] as const satisfies readonly TopologyRegistryEntry[];

export function getTopologyRegistryEntry(
  topologyId: SurdTopologyId,
): TopologyRegistryEntry {
  const entry = TOPOLOGY_REGISTRY.find(
    (topology) => topology.topologyId === topologyId,
  );
  if (!entry) {
    throw new Error(`Unknown NS-SURD-001 topology id: ${topologyId}`);
  }
  return entry;
}
