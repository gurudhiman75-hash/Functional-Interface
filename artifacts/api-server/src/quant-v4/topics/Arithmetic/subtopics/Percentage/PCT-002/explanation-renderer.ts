import { formatExplanationSteps, validateExplanationPipeline, type ExplanationEvidence, type ExplanationRenderer } from "../../../../../common/explanation-engine";
import type { Pct002Explanation, Pct002Parameters, Pct002ReasoningGraph, Pct002SolverResult } from "../types";

import { InclusionExclusionRenderer } from "./renderers/inclusion-exclusion-renderer";
import { FractionalErrorRenderer } from "./renderers/fractional-error-renderer";
import { WrongMultiplierRenderer } from "./renderers/wrong-multiplier-renderer";
import { WrongDivisorRenderer } from "./renderers/wrong-divisor-renderer";
import { TieredCommissionRenderer } from "./renderers/tiered-commission-renderer";
import { TieredTaxRenderer } from "./renderers/tiered-tax-renderer";
import { PiecewiseRateRenderer } from "./renderers/piecewise-rate-renderer";
import { WeightedSubgroupRenderer } from "./renderers/weighted-subgroup-renderer";
import { HierarchicalPopulationRenderer } from "./renderers/hierarchical-population-renderer";
import { BranchAggregationRenderer } from "./renderers/branch-aggregation-renderer";
import { RepeatedReplacementRenderer } from "./renderers/repeated-replacement-renderer";
import { IterativeDilutionRenderer } from "./renderers/iterative-dilution-renderer";
import { TripleInclusionExclusionRenderer } from "./renderers/triple-inclusion-exclusion-renderer";
import { MultiTierPiecewiseRateRenderer } from "./renderers/multi-tier-piecewise-rate-renderer";
import { ReversePiecewiseRateRenderer } from "./renderers/reverse-piecewise-rate-renderer";
import { VariableReplacementRenderer } from "./renderers/variable-replacement-renderer";
import { ElectionMarginRenderer } from "./renderers/election-margin-renderer";
import { MultiStageAttritionRenderer } from "./renderers/multi-stage-attrition-renderer";
import { ShiftedBaseChainRenderer } from "./renderers/shifted-base-chain-renderer";

export function resolvePct002SemanticEntities(taskKind: string, semanticContext: any, language: "en" | "hi" | "pa"): Record<string, string> {
  const map: Record<string, string> = {};
  if (!semanticContext || !semanticContext.entities) return map;

  const entities = semanticContext.entities;

  if (taskKind === "inclusionExclusion" || taskKind === "tripleInclusionExclusion") {
    map["entityA"] = entities.subject1?.[language] || entities.group1?.[language] || "the first subject";
    map["entityB"] = entities.subject2?.[language] || entities.group2?.[language] || "the second subject";
  } else if (taskKind === "wrongMultiplier" || taskKind === "fractionalError") {
    map["target"] = entities.target?.[language] || "number";
  }
  return map;
}

export function renderPct002Explanation(parameters: Pct002Parameters, solver: Pct002SolverResult, _graph: Pct002ReasoningGraph): Pct002Explanation {
  const evidence: ExplanationEvidence = {
    variables: parameters.variables,
    derivedValues: { ...solver.evidence, atLeastOne: solver.evidence.totalWithNeither ? 100 - Number(parameters.variables.neitherPercentage) : 0 },
    entities: resolvePct002SemanticEntities(parameters.taskKind, parameters.semanticContext, parameters.language),
    answer: solver.answer,
  };

  let renderer: ExplanationRenderer;

  switch (parameters.taskKind) {
    case "inclusionExclusion":
      renderer = new InclusionExclusionRenderer();
      break;
    case "fractionalError":
      renderer = new FractionalErrorRenderer(solver.mathJax);
      break;
    case "wrongMultiplier":
      renderer = new WrongMultiplierRenderer();
      break;
    case "wrongDivisor":
      renderer = new WrongDivisorRenderer(solver.mathJax);
      break;
    case "tieredCommission":
      renderer = new TieredCommissionRenderer(solver.mathJax);
      break;
    case "tieredTax":
      renderer = new TieredTaxRenderer(solver.mathJax);
      break;
    case "piecewiseRate":
      renderer = new PiecewiseRateRenderer(solver.mathJax);
      break;
    case "weightedSubgroup":
      renderer = new WeightedSubgroupRenderer(solver.mathJax);
      break;
    case "hierarchicalPopulation":
      renderer = new HierarchicalPopulationRenderer(solver.mathJax);
      break;
    case "branchAggregation":
      renderer = new BranchAggregationRenderer(solver.mathJax);
      break;
    case "repeatedReplacement":
      renderer = new RepeatedReplacementRenderer(solver.mathJax);
      break;
    case "iterativeDilution":
      renderer = new IterativeDilutionRenderer(solver.mathJax);
      break;
    case "tripleInclusionExclusion":
      renderer = new TripleInclusionExclusionRenderer(solver.mathJax);
      break;
    case "multiTierPiecewiseRate":
      renderer = new MultiTierPiecewiseRateRenderer(solver.mathJax);
      break;
    case "reversePiecewiseRate":
      renderer = new ReversePiecewiseRateRenderer(solver.mathJax);
      break;
    case "variableReplacement":
      renderer = new VariableReplacementRenderer(solver.mathJax);
      break;
    case "electionMargin":
      renderer = new ElectionMarginRenderer(solver.mathJax);
      break;
    case "multiStageAttrition":
      renderer = new MultiStageAttritionRenderer(solver.mathJax);
      break;
    case "shiftedBaseChain":
      renderer = new ShiftedBaseChainRenderer(solver.mathJax);
      break;
    default:
      throw new Error(`Renderer missing for taskKind: ${parameters.taskKind}`);
  }

  const validatedSteps = validateExplanationPipeline(evidence, renderer);
  return {
    explanationId: parameters.explanationId,
    lines: formatExplanationSteps(validatedSteps),
  };
}
