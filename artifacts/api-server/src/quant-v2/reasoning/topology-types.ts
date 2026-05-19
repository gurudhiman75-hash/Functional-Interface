import type {
  CanonicalPercentageProblem,
  PercentageSubtype,
} from "../canonical/percentage-types";
import type { ReasoningGraph } from "./reasoning-graph-types";

export type TopologyFamily =
  | "direct_mapping"
  | "filtered_base"
  | "successive_filtering"
  | "remaining_component"
  | "hidden_total"
  | "multi_entity_distribution"
  | "ratio_percentage_hybrid"
  | "effective_percentage"
  | "base_shift"
  | "layered_population";

export type ElectionTopology =
  | "direct_margin"
  | "invalid_vote_margin"
  | "turnout_margin"
  | "multi_candidate_margin"
  | "remaining_vote_margin"
  | "filtered_valid_vote_margin";

export type PassFailTopology =
  | "simple_shortfall"
  | "pass_fail_gap"
  | "successive_mark_adjustment"
  | "remaining_marks_required";

export type PopulationTopology =
  | "single_growth"
  | "growth_then_decay"
  | "migration_adjusted_population"
  | "male_female_population_shift";

export type TopologyVariant =
  | ElectionTopology
  | PassFailTopology
  | PopulationTopology;

export type FilteringStageKind =
  | "percentage_filter"
  | "remaining_percentage"
  | "subtract_component"
  | "ratio_component"
  | "direct_component";

export interface FilteringStage {
  stageId: string;
  kind: FilteringStageKind;
  inputVariable: string;
  outputVariable: string;
  percentVariable?: string;
  amountVariable?: string;
  numeratorVariable?: string;
  denominatorVariable?: string;
  equation: string;
  hidden?: boolean;
}

export interface FilteringChain {
  chainId: string;
  baseVariable: string;
  targetVariable: string;
  stages: FilteringStage[];
}

export type MisconceptionId =
  | "ignoring_invalid_votes"
  | "using_wrong_denominator"
  | "mapping_winner_percentage_directly"
  | "forgetting_filtering_stage"
  | "additive_instead_of_multiplicative"
  | "ignoring_remaining_component"
  | "ratio_confusion"
  | "using_stated_base_as_effective_base";

export interface MisconceptionDistractor {
  misconception: MisconceptionId;
  value: number;
}

export interface HiddenBaseRelation {
  baseVariable: string;
  knownVariable: string;
  percentVariable: string;
}

export interface PercentageConservationGroup {
  groupId: string;
  totalPercent: number;
  partVariables: string[];
}

export interface RemainingComponentRelation {
  remainingVariable: string;
  totalPercent: number;
  knownPercentVariables: string[];
}

export interface MultiEntityRelation {
  totalVariable: string;
  componentVariables: string[];
}

export interface TopologyMetadata {
  family: TopologyFamily;
  variant: TopologyVariant;
  filteringChain?: FilteringChain;
  hiddenBase?: HiddenBaseRelation;
  conservationGroups?: PercentageConservationGroup[];
  remainingComponent?: RemainingComponentRelation;
  multiEntity?: MultiEntityRelation;
  misconceptionDistractors: MisconceptionDistractor[];
}

export interface TopologyBuildResult {
  problem: CanonicalPercentageProblem;
  graph: ReasoningGraph;
}

export type TopologyBuilder = (
  seed?: number | string,
) => TopologyBuildResult;

export type TopologyRegistry = Partial<
  Record<PercentageSubtype, readonly TopologyVariant[]>
>;
