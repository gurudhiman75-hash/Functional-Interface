import { formatExplanationSteps, validateExplanationPipeline, type ExplanationEvidence, type ExplanationRenderer } from "../../../../../common/explanation-engine";
import { TaskKindTeacherRenderer } from "../../../../../common/teacher-renderer";
import type { Rap001Explanation, Rap001Parameters, Rap001ReasoningGraph, Rap001SolverResult } from "../types";

import { SimpleLinkageRenderer } from "./renderers/simple-linkage-renderer";
import { RatioNormalizationRenderer } from "./renderers/ratio-normalization-renderer";
import { RatioTreeLinkageRenderer } from "./renderers/ratio-tree-linkage-renderer";
import { ScalingByComponentRenderer } from "./renderers/scaling-by-component-renderer";
import { DecimalNormalizationRenderer } from "./renderers/decimal-normalization-renderer";
import { BasicPartitionRenderer } from "./renderers/basic-partition-renderer";
import { ShareDifferenceRenderer } from "./renderers/share-difference-renderer";
import { ReversePartitionRenderer } from "./renderers/reverse-partition-renderer";
import { SalaryDistributionRenderer } from "./renderers/salary-distribution-renderer";
import { TwoStateAdditionRenderer } from "./renderers/two-state-addition-renderer";
import { TwoStateSubtractionRenderer } from "./renderers/two-state-subtraction-renderer";
import { TwoStateTransferRenderer } from "./renderers/two-state-transfer-renderer";
import { IncomeExpenditureSystemRenderer } from "./renderers/income-expenditure-system-renderer";
import { MultiStageTransformationRenderer } from "./renderers/multi-stage-transformation-renderer";
import { MeanProportionalRenderer } from "./renderers/mean-proportional-renderer";
import { ThirdProportionalRenderer } from "./renderers/third-proportional-renderer";
import { FourthProportionalRenderer } from "./renderers/fourth-proportional-renderer";
import { DirectVariationRenderer } from "./renderers/direct-variation-renderer";
import { InverseVariationRenderer } from "./renderers/inverse-variation-renderer";
import { CoinCountingRenderer } from "./renderers/coin-counting-renderer";
import { MultiDenominationMappingRenderer } from "./renderers/multi-denomination-mapping-renderer";
import { WeightedMappingRenderer } from "./renderers/weighted-mapping-renderer";
import { WeightedMarksRenderer } from "./renderers/weighted-marks-renderer";
import { BinaryMixtureRenderer } from "./renderers/binary-mixture-renderer";
import { MixtureComponentFindingRenderer } from "./renderers/mixture-component-finding-renderer";
import { ThreeComponentMixtureRenderer } from "./renderers/three-component-mixture-renderer";
import { VariableReplacementRatioRenderer } from "./renderers/variable-replacement-ratio-renderer";
import { AcidConcentrationRenderer } from "./renderers/acid-concentration-renderer";

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
  const evidence: ExplanationEvidence = {
    variables: parameters.variables,
    derivedValues: solver.workingValues,
    entities: resolveRap001SemanticEntities(parameters.taskKind, parameters.semanticContext, parameters.language),
    answer: solver.answer,
  };

  let renderer: ExplanationRenderer;

  switch (parameters.taskKind) {
    case "simpleLinkage":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "ratioNormalization":
      renderer = new RatioNormalizationRenderer();
      break;
    case "ratioTreeLinkage":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "scalingByComponent":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "decimalNormalization":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "basicPartition":
      renderer = new BasicPartitionRenderer(solver.mathJax);
      break;
    case "shareDifference":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "reversePartition":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "salaryDistribution":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "twoStateAddition":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "twoStateSubtraction":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "twoStateTransfer":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "incomeExpenditureSystem":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "multiStageTransformation":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "meanProportional":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "thirdProportional":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "fourthProportional":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "directVariation":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "inverseVariation":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "coinCounting":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "multiDenominationMapping":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "weightedMapping":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "weightedMarks":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "binaryMixture":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "mixtureComponentFinding":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "threeComponentMixture":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "variableReplacementRatio":
      renderer = new TaskKindTeacherRenderer(parameters.taskKind, solver.mathJax);
      break;
    case "acidConcentration":
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
