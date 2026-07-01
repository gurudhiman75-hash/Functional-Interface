import { formatExplanationSteps, validateExplanationPipeline, type ExplanationEvidence, type ExplanationRenderer } from "../../../../../common/explanation-engine";
import { TaskKindTeacherRenderer } from "../../../../../common/teacher-renderer";
import type { Pct001Explanation, Pct001Parameters, Pct001ReasoningGraph, Pct001SolverResult } from "../types";

import { PercentOfRenderer } from "./renderers/percent-of-renderer";
import { PercentToFractionRenderer } from "./renderers/percent-to-fraction-renderer";
import { ValueAsPercentRenderer } from "./renderers/value-as-percent-renderer";
import { DirectRelationRenderer } from "./renderers/direct-relation-renderer";
import { MoreToLessRenderer } from "./renderers/more-to-less-renderer";
import { LessToMoreRenderer } from "./renderers/less-to-more-renderer";
import { RatioFromPercentEqualityRenderer } from "./renderers/ratio-from-percent-equality-renderer";
import { ReversePercentRenderer } from "./renderers/reverse-percent-renderer";
import { IncreaseNewValueRenderer } from "./renderers/increase-new-value-renderer";
import { DecreaseNewValueRenderer } from "./renderers/decrease-new-value-renderer";
import { ReverseIncreaseRenderer } from "./renderers/reverse-increase-renderer";
import { ReverseDecreaseRenderer } from "./renderers/reverse-decrease-renderer";
import { IncreaseByAmountRenderer } from "./renderers/increase-by-amount-renderer";
import { PercentOfKnownNumberRenderer } from "./renderers/percent-of-known-number-renderer";
import { DifferenceOfPercentsRenderer } from "./renderers/difference-of-percents-renderer";
import { RestoreAfterDecreaseRenderer } from "./renderers/restore-after-decrease-renderer";
import { SuccessiveIncreaseRenderer } from "./renderers/successive-increase-renderer";
import { SuccessiveChangeRenderer } from "./renderers/successive-change-renderer";
import { CompoundGrowthRenderer } from "./renderers/compound-growth-renderer";
import { CompoundDecayRenderer } from "./renderers/compound-decay-renderer";
import { AreaChangeRenderer } from "./renderers/area-change-renderer";
import { SquareAreaChangeRenderer } from "./renderers/square-area-change-renderer";
import { InvarianceDecreaseRenderer } from "./renderers/invariance-decrease-renderer";
import { InvarianceIncreaseRenderer } from "./renderers/invariance-increase-renderer";
import { RestoreAfterIncreaseRenderer } from "./renderers/restore-after-increase-renderer";
import { RevenueChangeRenderer } from "./renderers/revenue-change-renderer";
import { CircleAreaDecreaseRenderer } from "./renderers/circle-area-decrease-renderer";
import { IncomePartitionRenderer } from "./renderers/income-partition-renderer";
import { SuccessiveExpenseRenderer } from "./renderers/successive-expense-renderer";
import { WinnerVotesRenderer } from "./renderers/winner-votes-renderer";
import { CancelledVotesRenderer } from "./renderers/cancelled-votes-renderer";
import { PassMarksRenderer } from "./renderers/pass-marks-renderer";
import { PartToTotalRenderer } from "./renderers/part-to-total-renderer";
import { ComplementOfTotalRenderer } from "./renderers/complement-of-total-renderer";
import { MoreMarksBaseRenderer } from "./renderers/more-marks-base-renderer";
import { TwoShareRemainderRenderer } from "./renderers/two-share-remainder-renderer";
import { LoserVotesRenderer } from "./renderers/loser-votes-renderer";
import { DilutionAddWaterRenderer } from "./renderers/dilution-add-water-renderer";
import { DryFromFreshRenderer } from "./renderers/dry-from-fresh-renderer";
import { AddSoluteRenderer } from "./renderers/add-solute-renderer";
import { DilutedPercentRenderer } from "./renderers/diluted-percent-renderer";
import { FreshFromDryRenderer } from "./renderers/fresh-from-dry-renderer";
import { AddPureComponentRenderer } from "./renderers/add-pure-component-renderer";
import { EvaporationOriginalRenderer } from "./renderers/evaporation-original-renderer";
import { AlloyComplementRenderer } from "./renderers/alloy-complement-renderer";

export function resolvePct001SemanticEntities(taskKind: string, semanticContext: any, language: "en" | "hi" | "pa"): Record<string, string> {
  const map: Record<string, string> = {};
  if (!semanticContext || !semanticContext.entities) return map;
  const entities = semanticContext.entities;
  if (taskKind === "percentOf" || taskKind === "directRelation") {
    map["entityA"] = entities.subject?.[language] || "value";
  }
  return map;
}

export function renderPct001Explanation(parameters: Pct001Parameters, solver: Pct001SolverResult, _graph: Pct001ReasoningGraph): Pct001Explanation {
  const evidence: ExplanationEvidence = {
    variables: parameters.variables,
    derivedValues: solver.evidence,
    entities: resolvePct001SemanticEntities(parameters.taskKind, parameters.semanticContext, parameters.language),
    answer: solver.answer,
  };

  let renderer: ExplanationRenderer;

  switch (parameters.taskKind) {
    case "percentOf":
      renderer = new PercentOfRenderer();
      break;
    case "percentToFraction":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "valueAsPercent":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "directRelation":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "moreToLess":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "lessToMore":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "ratioFromPercentEquality":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "reversePercent":
      renderer = new ReversePercentRenderer(solver.mathJax);
      break;
    case "increaseNewValue":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "decreaseNewValue":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "reverseIncrease":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "reverseDecrease":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "increaseByAmount":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "percentOfKnownNumber":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "differenceOfPercents":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "restoreAfterDecrease":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "successiveIncrease":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "successiveChange":
      renderer = new SuccessiveChangeRenderer(solver.mathJax);
      break;
    case "compoundGrowth":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "compoundDecay":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "areaChange":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "squareAreaChange":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "invarianceDecrease":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "invarianceIncrease":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "restoreAfterIncrease":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "revenueChange":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "circleAreaDecrease":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "incomePartition":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "successiveExpense":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "winnerVotes":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "cancelledVotes":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "passMarks":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "partToTotal":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "complementOfTotal":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "moreMarksBase":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "twoShareRemainder":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "loserVotes":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "dilutionAddWater":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "dryFromFresh":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "addSolute":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "dilutedPercent":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "freshFromDry":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "addPureComponent":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "evaporationOriginal":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "alloyComplement":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
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
