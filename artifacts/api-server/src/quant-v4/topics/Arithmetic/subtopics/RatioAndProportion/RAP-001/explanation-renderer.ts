import { formatExplanationSteps, validateExplanationPipeline, type ExplanationEvidence, type ExplanationRenderer } from "../../../../../common/explanation-engine";
import type { Rap001Explanation, Rap001Parameters, Rap001ReasoningGraph, Rap001SolverResult } from "../types";
import { renderLocalizedRap001Explanation } from "./localized-explanation-renderer";

import { SimpleLinkageRenderer } from "./renderers/simple-linkage-renderer";
import { RatioNormalizationRenderer } from "./renderers/ratio-normalization-renderer";
import { BasicPartitionRenderer } from "./renderers/basic-partition-renderer";
import { NaturalExamRenderer } from "./renderers/natural-exam-renderer";
import { DecimalNormalizationRenderer } from "./renderers/decimal-normalization-renderer";
import { ThreeComponentMixtureRenderer } from "./renderers/three-component-mixture-renderer";

export function resolveRap001SemanticEntities(taskKind: string, semanticContext: any, language: "en" | "hi" | "pa"): Record<string, string> {
  const map: Record<string, string> = {};
  if (!semanticContext || !semanticContext.entities) return map;

  const entities = semanticContext.entities;

  if (taskKind === "ages") {
    map["entityA"] = entities.person1?.[language] || "the first person";
    map["entityB"] = entities.person2?.[language] || "the second person";
  } else if (taskKind === "boysGirls") {
    map["entityA"] = entities.boys?.[language] || "boys";
    map["entityB"] = entities.girls?.[language] || "girls";
  }
  return map;
}

export function renderRap001Explanation(parameters: Rap001Parameters, solver: Rap001SolverResult, _graph: Rap001ReasoningGraph): Rap001Explanation {
  if (parameters.language !== "en") {
    return renderLocalizedRap001Explanation(parameters, solver);
  }

  const evidence: ExplanationEvidence = {
    variables: parameters.variables,
    derivedValues: solver.workingValues,
    entities: resolveRap001SemanticEntities(parameters.taskKind, parameters.semanticContext, parameters.language),
    answer: solver.answer,
  };

  let renderer: ExplanationRenderer;

  switch (parameters.taskKind) {
    case "simpleLinkage":
      renderer = new SimpleLinkageRenderer(solver.mathJax);
      break;
    case "ratioNormalization":
      renderer = new RatioNormalizationRenderer();
      break;
    case "ratioTreeLinkage":
      renderer = new NaturalExamRenderer("link the chain ratios", solver.mathJax);
      break;
    case "scalingByComponent":
      renderer = new NaturalExamRenderer("find the matching component", solver.mathJax);
      break;
    case "decimalNormalization":
      renderer = new DecimalNormalizationRenderer();
      break;
    case "basicPartition":
      renderer = new BasicPartitionRenderer(solver.mathJax);
      break;
    case "shareDifference":
      renderer = new NaturalExamRenderer("compare two shares", solver.mathJax);
      break;
    case "reversePartition":
      renderer = new NaturalExamRenderer("recover the total from share difference", solver.mathJax);
      break;
    case "salaryDistribution":
      renderer = new NaturalExamRenderer("split salary into expenses and savings", solver.mathJax);
      break;
    case "twoStateAddition":
      renderer = new NaturalExamRenderer("solve the ratio after addition", solver.mathJax);
      break;
    case "twoStateSubtraction":
      renderer = new NaturalExamRenderer("solve the ratio after removal", solver.mathJax);
      break;
    case "twoStateTransfer":
      renderer = new NaturalExamRenderer("solve the changed number ratio", solver.mathJax);
      break;
    case "incomeExpenditureSystem":
      renderer = new NaturalExamRenderer("compare income, expense, and saving", solver.mathJax);
      break;
    case "multiStageTransformation":
      renderer = new NaturalExamRenderer("track addition and removal together", solver.mathJax);
      break;
    case "meanProportional":
      renderer = new NaturalExamRenderer("find the mean proportional", solver.mathJax);
      break;
    case "thirdProportional":
      renderer = new NaturalExamRenderer("find the third proportional", solver.mathJax);
      break;
    case "fourthProportional":
      renderer = new NaturalExamRenderer("find the fourth proportional", solver.mathJax);
      break;
    case "directVariation":
      renderer = new NaturalExamRenderer("use direct variation", solver.mathJax);
      break;
    case "inverseVariation":
      renderer = new NaturalExamRenderer("use inverse variation", solver.mathJax);
      break;
    case "coinCounting":
      renderer = new NaturalExamRenderer("convert coin ratios into value", solver.mathJax);
      break;
    case "multiDenominationMapping":
      renderer = new NaturalExamRenderer("map value ratios to coin counts", solver.mathJax);
      break;
    case "weightedMapping":
      renderer = new NaturalExamRenderer("use weighted ratio units", solver.mathJax);
      break;
    case "weightedMarks":
      renderer = new NaturalExamRenderer("use subject weights with ratio marks", solver.mathJax);
      break;
    case "binaryMixture":
      renderer = new NaturalExamRenderer("solve the two-component mixture", solver.mathJax);
      break;
    case "mixtureComponentFinding":
      renderer = new NaturalExamRenderer("add one component to reach a ratio", solver.mathJax);
      break;
    case "threeComponentMixture":
      renderer = new ThreeComponentMixtureRenderer();
      break;
    case "variableReplacementRatio":
      renderer = new NaturalExamRenderer("track repeated replacement", solver.mathJax);
      break;
    case "acidConcentration":
      renderer = new NaturalExamRenderer("find concentration percentage", solver.mathJax);
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
