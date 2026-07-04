import { formatExplanationSteps, validateExplanationPipeline, type ExplanationEvidence, type ExplanationRenderer } from "../../../../../common/explanation-engine";
import { TaskKindTeacherRenderer } from "../../../../../common/teacher-renderer";
import { isQlLocalized } from "../../../../../common/language-coverage";
import type { Pct001Explanation, Pct001Parameters, Pct001ReasoningGraph, Pct001SolverResult } from "../types";
import { getExplanationSteps } from "./library";

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

function buildPct001Renderer(taskKind: string, solverMathJax: Record<string, string>): ExplanationRenderer {
  let renderer: ExplanationRenderer;
  switch (taskKind) {
    case "percentOf":
      renderer = new PercentOfRenderer();
      break;
    case "percentToFraction":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "valueAsPercent":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "directRelation":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "moreToLess":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "lessToMore":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "ratioFromPercentEquality":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "reversePercent":
      renderer = new ReversePercentRenderer(solverMathJax);
      break;
    case "increaseNewValue":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "decreaseNewValue":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "reverseIncrease":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "reverseDecrease":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "increaseByAmount":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "percentOfKnownNumber":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "differenceOfPercents":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "restoreAfterDecrease":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "successiveIncrease":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "successiveChange":
      renderer = new SuccessiveChangeRenderer(solverMathJax);
      break;
    case "compoundGrowth":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "compoundDecay":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "areaChange":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "squareAreaChange":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "invarianceDecrease":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "invarianceIncrease":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "restoreAfterIncrease":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "revenueChange":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "circleAreaDecrease":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "incomePartition":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "successiveExpense":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "winnerVotes":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "cancelledVotes":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "passMarks":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "partToTotal":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "complementOfTotal":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "moreMarksBase":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "twoShareRemainder":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "loserVotes":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "dilutionAddWater":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "dryFromFresh":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "addSolute":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "dilutedPercent":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "freshFromDry":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "addPureComponent":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "evaporationOriginal":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "alloyComplement":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    default:
      throw new Error(`Renderer missing for taskKind: ${taskKind}`);
  }
  return renderer;
}

function interpolateExplanationNarrative(template: string, evidence: ExplanationEvidence) {
  const values = {
    ...evidence.variables,
    ...evidence.derivedValues,
    ...evidence.entities,
    answer: evidence.answer,
  } as Record<string, string | number>;

  return template.replace(/\{([^}]+)\}/g, (_match, key: string) => {
    const value = values[key];
    if (typeof value !== "string" && typeof value !== "number") {
      throw new Error(`Missing explanation placeholder ${key}`);
    }
    return String(value);
  });
}

function buildLocalizedSteps(
  rawRenderer: ExplanationRenderer,
  parameters: Pct001Parameters,
  evidence: ExplanationEvidence,
) {
  const rawSteps = rawRenderer.render(evidence);
  const localizedNarratives = getExplanationSteps(
    parameters.canonicalProblemId,
    parameters.taskKind,
    parameters.language,
  );

  if (localizedNarratives.length !== rawSteps.length) {
    throw new Error(
      `Explanation step count mismatch for ${parameters.language}:${parameters.canonicalProblemId}:${parameters.taskKind}`,
    );
  }

  return rawSteps.map((step, index) => ({
    ...step,
    narrative: interpolateExplanationNarrative(localizedNarratives[index]!, evidence),
  }));
}

export function renderPct001Explanation(parameters: Pct001Parameters, solver: Pct001SolverResult, _graph: Pct001ReasoningGraph): Pct001Explanation {
  const evidence: ExplanationEvidence = {
    variables: parameters.variables,
    derivedValues: solver.evidence,
    entities: resolvePct001SemanticEntities(parameters.taskKind, parameters.semanticContext, parameters.language),
    answer: solver.answer,
  };
  const renderer = buildPct001Renderer(parameters.taskKind, solver.mathJax);

  if (parameters.language !== "en") {
    if (!isQlLocalized("PCT-001", parameters.questionLanguageId, parameters.language)) {
      throw new Error(
        `Question language ${parameters.questionLanguageId} is not localized for ${parameters.language} in PCT-001.`,
      );
    }
    if (parameters.canonicalProblemId !== "PCT-CP-001") {
      throw new Error(
        `Explanation localization is not implemented for ${parameters.language}:${parameters.canonicalProblemId}:${parameters.taskKind}.`,
      );
    }
    const localizedSteps = buildLocalizedSteps(renderer, parameters, evidence);
    const validatedSteps = validateExplanationPipeline(evidence, {
      render: () => localizedSteps,
    });
    return {
      explanationId: parameters.explanationId,
      lines: formatExplanationSteps(validatedSteps),
    };
  }

  const validatedSteps = validateExplanationPipeline(evidence, renderer);
  return {
    explanationId: parameters.explanationId,
    lines: formatExplanationSteps(validatedSteps),
  };
}
