import type { PercentageSubtype } from "../canonical/percentage-types";
import type {
  ElectionTopology,
  PassFailTopology,
  PopulationTopology,
  RelationalPercentageTopology,
  TopologyRegistry,
  TopologyVariant,
} from "./topology-types";

export const ELECTION_TOPOLOGIES = [
  "direct_margin",
  "invalid_vote_margin",
  "turnout_margin",
  "multi_candidate_margin",
  "remaining_vote_margin",
  "filtered_valid_vote_margin",
] as const satisfies readonly ElectionTopology[];

export const PASS_FAIL_TOPOLOGIES = [
  "simple_shortfall",
  "pass_fail_gap",
  "successive_mark_adjustment",
  "remaining_marks_required",
] as const satisfies readonly PassFailTopology[];

export const POPULATION_TOPOLOGIES = [
  "single_growth",
  "growth_then_decay",
  "migration_adjusted_population",
  "male_female_population_shift",
] as const satisfies readonly PopulationTopology[];

export const RELATIONAL_PERCENTAGE_TOPOLOGIES = [
  "single_relation",
  "two_step_relation_chain",
  "three_step_relation_chain",
  "reverse_relation_inference",
  "ratio_percentage_bridge",
  "hidden_base_relation_chain",
] as const satisfies readonly RelationalPercentageTopology[];

export const TOPOLOGY_REGISTRY = {
  election_margin: ELECTION_TOPOLOGIES,
  pass_fail: PASS_FAIL_TOPOLOGIES,
  population_growth: POPULATION_TOPOLOGIES,
  relational_percentage: RELATIONAL_PERCENTAGE_TOPOLOGIES,
} satisfies TopologyRegistry;

export function supportedTopologiesForSubtype(
  subtype: PercentageSubtype,
): readonly TopologyVariant[] {
  const registry: TopologyRegistry = TOPOLOGY_REGISTRY;
  return registry[subtype] ?? [];
}

export function topologyIsSupported(
  subtype: PercentageSubtype,
  variant: TopologyVariant,
): boolean {
  return supportedTopologiesForSubtype(subtype).includes(variant);
}
