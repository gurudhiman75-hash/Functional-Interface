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
