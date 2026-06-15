import type { Rap001Parameters, Rap001ReasoningGraph, Rap001ReasoningNode, Rap001SolverResult } from "./types";

function node(nodeId: string, operation: string, inputs: Record<string, string | number>, outputs: Record<string, string | number>, description: string, evidence: Record<string, string | number>): Rap001ReasoningNode {
  return { nodeId, operation, inputs, outputs, description, evidence };
}

export function buildRap001ReasoningGraph(parameters: Rap001Parameters, solver: Rap001SolverResult): Rap001ReasoningGraph {
  const nodes: Rap001ReasoningNode[] = [
    node("inputs", "capture", parameters.variables as Record<string, string | number>, {}, "Capture the given values and semantic entities.", {}),
    node("routing", "task-dispatch", { questionLanguageId: parameters.questionLanguageId, taskKind: parameters.taskKind }, { answerType: parameters.answerType }, "Route through the frozen task registry without reading wording.", {}),
  ];

  const operationDescription: Record<string, string> = {
    simpleLinkage: "Synchronize the shared pivot and build a combined ratio chain.",
    ratioNormalization: "Transform fractional ratio terms into a common whole-number basis.",
    ratioTreeLinkage: "Use pivot synchronization across a multi-link tree to connect end points.",
    scalingByComponent: "Map known component count to one ratio unit and scale the unknown branch.",
    decimalNormalization: "Normalize decimal terms by scaling to a whole-number ratio.",
    basicPartition: "Partition the total into ratio units and allocate the target share.",
    shareDifference: "Convert ratio parts into absolute units and compare target branches.",
    reversePartition: "Use the known difference between branches to recover the unit value.",
    salaryDistribution: "Partition salary into expense and saving units.",
    twoStateAddition: "Model the initial state, apply the addition, and solve the transformed ratio.",
    twoStateSubtraction: "Model the initial state, apply the subtraction, and solve the transformed ratio.",
    twoStateTransfer: "Apply equal transfer to both branches and solve the new proportional state.",
    incomeExpenditureSystem: "Build an income-expense system and solve using equal savings.",
    multiStageTransformation: "Apply addition and subtraction across branches and isolate the shared base.",
    meanProportional: "Solve the proportional identity through the geometric mean.",
    thirdProportional: "Use a:b = b:x to recover the third proportional.",
    fourthProportional: "Use a:b = c:x to recover the fourth proportional.",
    directVariation: "Use direct variation to preserve the quotient constant.",
    inverseVariation: "Use inverse variation to preserve the product constant.",
    coinCounting: "Map ratio units to denomination values and recover the target count.",
    multiDenominationMapping: "Convert value ratios back into count ratios using denominations.",
    weightedMapping: "Use weighted mapping to convert count ratio into total weight.",
    weightedMarks: "Use weighted mapping to convert mark ratio into weighted score.",
    binaryMixture: "Treat the unchanged component as pivot and solve the mixture balance.",
    mixtureComponentFinding: "Keep one component fixed and solve the added quantity from the final ratio.",
    threeComponentMixture: "Use constant components as pivots to rebalance the ternary mixture.",
    variableReplacementRatio: "Track the retained original component through successive replacement cycles.",
    acidConcentration: "Compute the acid share from total mixture volume.",
  };

  nodes.push(
    node(
      "working",
      parameters.taskKind,
      parameters.variables as Record<string, string | number>,
      solver.workingValues,
      operationDescription[parameters.taskKind],
      solver.evidence,
    ),
  );

  nodes.push(
    node(
      "answer",
      "finalize",
      solver.workingValues,
      { answer: solver.answer, answerValue: String(solver.answerValue) },
      "Format the solved value using the declared answer type.",
      solver.evidence,
    ),
  );

  return {
    graphId: `${parameters.questionId}:graph`,
    nodes,
  };
}
