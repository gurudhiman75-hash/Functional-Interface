import type {
  PercentageSubtype,
} from "../canonical/percentage-types";
import {
  ELECTION_TOPOLOGIES,
  PASS_FAIL_TOPOLOGIES,
  POPULATION_TOPOLOGIES,
  supportedTopologiesForSubtype,
} from "./topology-registry";
import type {
  ElectionTopology,
  PassFailTopology,
  PopulationTopology,
  TopologyVariant,
} from "./topology-types";

export type TopologySelectionInput = number | string | undefined;

function seedToSerial(seed: TopologySelectionInput): number {
  if (typeof seed === "number" && Number.isFinite(seed)) {
    return Math.max(1, Math.trunc(Math.abs(seed)));
  }

  const text = String(seed ?? 1);
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0) + 1;
}

function balancedIndex(seed: TopologySelectionInput, size: number): number {
  if (size <= 0) {
    throw new Error("Cannot select topology from an empty topology list.");
  }

  const serial = seedToSerial(seed);
  const cycle = Math.floor((serial - 1) / size);
  const position = (serial - 1) % size;

  // Odd cycles reverse the walk. This keeps frequencies balanced while
  // preventing short local runs from feeling like the same rotation forever.
  return cycle % 2 === 0
    ? position
    : size - 1 - position;
}

export function selectElectionTopology(
  seed?: TopologySelectionInput,
): ElectionTopology {
  return ELECTION_TOPOLOGIES[
    balancedIndex(seed, ELECTION_TOPOLOGIES.length)
  ]!;
}

export function selectPassFailTopology(
  seed?: TopologySelectionInput,
): PassFailTopology {
  return PASS_FAIL_TOPOLOGIES[
    balancedIndex(seed, PASS_FAIL_TOPOLOGIES.length)
  ]!;
}

export function selectPopulationTopology(
  seed?: TopologySelectionInput,
): PopulationTopology {
  return POPULATION_TOPOLOGIES[
    balancedIndex(seed, POPULATION_TOPOLOGIES.length)
  ]!;
}

export function selectTopologyForSubtype(
  subtype: PercentageSubtype,
  seed?: TopologySelectionInput,
): TopologyVariant | undefined {
  if (subtype === "election_margin") {
    return selectElectionTopology(seed);
  }
  if (subtype === "pass_fail") {
    return selectPassFailTopology(seed);
  }
  if (subtype === "population_growth") {
    return selectPopulationTopology(seed);
  }

  const variants = supportedTopologiesForSubtype(subtype);
  if (variants.length === 0) {
    return undefined;
  }

  return variants[balancedIndex(seed, variants.length)];
}
