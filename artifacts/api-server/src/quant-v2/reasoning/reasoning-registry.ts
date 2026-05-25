import type {
  CanonicalPercentageProblem,
  PercentageSubtype,
} from "../canonical/percentage-types";
import type { ReasoningGraph } from "./reasoning-graph-types";
import { buildTopologyReasoningGraph } from "./topology-builders";
import {
  buildElectionMarginGraph,
  buildMixturePercentageGraph,
  buildPassFailGraph,
  buildPopulationGrowthGraph,
  buildPriceConsumptionGraph,
  buildProfitLossGraph,
  buildRelationalPercentageGraph,
  buildRestoreValueGraph,
  buildReversePercentageGraph,
  buildSalaryRevisionGraph,
  buildSuccessiveChangeGraph,
  buildTaxationGraph,
  buildCommissionGraph,
  buildVennDiagramGraph,
  buildAdvancedPercentageGraph,
  type ReasoningGraphBuilder,
} from "./reasoning-graph-builders";

export const REASONING_GRAPH_BUILDERS: Partial<
  Record<PercentageSubtype, ReasoningGraphBuilder>
> = {
  election_margin: buildElectionMarginGraph,
  pass_fail: buildPassFailGraph,
  reverse_percentage: buildReversePercentageGraph,
  increase_then_decrease: buildSuccessiveChangeGraph,
  restore_original: buildRestoreValueGraph,
  population_growth: buildPopulationGrowthGraph,
  salary_revision: buildSalaryRevisionGraph,
  price_consumption: buildPriceConsumptionGraph,
  profit_loss: buildProfitLossGraph,
  mixture_percentage: buildMixturePercentageGraph,
  relational_percentage: buildRelationalPercentageGraph,
  taxation: buildTaxationGraph,
  commission: buildCommissionGraph,
  venn_diagram: buildVennDiagramGraph,
  perc_geom_dimensional_scale: buildAdvancedPercentageGraph,
  perc_demo_cross_tab_literacy: buildAdvancedPercentageGraph,
  perc_budget_cascading_remainder: buildAdvancedPercentageGraph,
  perc_const_absolute_offset: buildAdvancedPercentageGraph,
  perc_exam_weighted_aggregate: buildAdvancedPercentageGraph,
  perc_asset_variable_depreciation: buildAdvancedPercentageGraph,
  perc_workforce_hierarchical_attrition: buildAdvancedPercentageGraph,
  perc_elect_three_candidate_forfeiture: buildAdvancedPercentageGraph,
  perc_agri_land_yield_compound: buildAdvancedPercentageGraph,
  perc_demo_multi_factor_growth: buildAdvancedPercentageGraph,
  perc_comm_tiered_salary_override: buildAdvancedPercentageGraph,
  perc_asset_compound_leakage: buildAdvancedPercentageGraph,
  perc_num_linear_equation_balancing: buildAdvancedPercentageGraph,
  perc_num_fractional_perturbation_complex: buildAdvancedPercentageGraph,
  perc_tax_bracket_retained_income: buildAdvancedPercentageGraph,
  perc_num_square_proportional_delta: buildAdvancedPercentageGraph,
  perc_mix_alloy_replacement: buildAdvancedPercentageGraph,
};

export function buildReasoningGraph(
  problem: CanonicalPercentageProblem,
): ReasoningGraph {
  if (problem.topology && problem.subtype !== "relational_percentage") {
    return buildTopologyReasoningGraph(problem);
  }

  const builder =
    REASONING_GRAPH_BUILDERS[problem.subtype];

  if (builder) {
    return builder(problem);
  }

  if (problem.topology) {
    return buildTopologyReasoningGraph(problem);
  }

  throw new Error(
    `No reasoning graph builder registered for subtype: ${problem.subtype}.`,
  );
}
