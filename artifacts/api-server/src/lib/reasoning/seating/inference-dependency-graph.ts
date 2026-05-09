import type {
  InferenceStep,
} from "../seating-validator";

export type InferenceNodeKind =
  | "anchor"
  | "branch"
  | "propagation"
  | "contradiction"
  | "acceptance"
  | "deduction";

export type InferenceDependencyNode =
  {
    nodeId: string;
    kind: InferenceNodeKind;
    logicLego:
      | "Direct Assignment"
      | "Domain Pruning"
      | "Relative Linkage"
      | "Exhaustive Branching"
      | "General Deduction";
    step: InferenceStep;
    prerequisiteIds: string[];
    unlockedDeductionIds: string[];
    eliminationChainIds: string[];
  };

export type InferenceDependencyGraph =
  {
    nodes: InferenceDependencyNode[];
    inferenceDepth: number;
    branchingComplexity: number;
    deductionDependencyScore: number;
    eliminationChainCount: number;
    edgeCount: number;
    rootNodeIds: string[];
  };

function round(
  value: number,
  digits = 3,
) {
  return Number(
    value.toFixed(digits),
  );
}

function getNodeKind(
  step: InferenceStep,
) : InferenceNodeKind {
  if (
    step.deduction.includes(
      "Anchored",
    )
  ) {
    return "anchor";
  }

  if (
    step.deduction.includes(
      "Branching on",
    )
  ) {
    return "branch";
  }

  if (
    step.deduction.includes(
      "Propagated",
    )
  ) {
    return "propagation";
  }

  if (
    step.deduction.includes(
      "contradiction",
    )
  ) {
    return "contradiction";
  }

  if (
    step.deduction.includes(
      "Accepted arrangement",
    )
  ) {
    return "acceptance";
  }

  return "deduction";
}

function getLogicLego(step: InferenceStep) {
  if (
    step.deduction.includes(
      "Direct Assignment",
    ) ||
    step.deduction.includes(
      "Anchored",
    )
  ) {
    return "Direct Assignment" as const;
  }

  if (
    step.deduction.includes(
      "Domain Pruning",
    ) ||
    step.eliminatedPossibilities
      .length > 0
  ) {
    return "Domain Pruning" as const;
  }

  if (
    step.deduction.includes(
      "Relative Linkage",
    ) ||
    step.deduction.includes(
      "Propagated",
    )
  ) {
    return "Relative Linkage" as const;
  }

  if (
    step.deduction.includes(
      "Exhaustive Branching",
    ) ||
    step.deduction.includes(
      "Branching on",
    )
  ) {
    return "Exhaustive Branching" as const;
  }

  return "General Deduction" as const;
}

function getKnownSeatCount(
  snapshot: string,
) {
  return snapshot
    .split("|")
    .map((token) => token.trim())
    .filter(
      (token) =>
        token.length > 0 &&
        token !== "?",
    ).length;
}

function unique(
  values: string[],
) {
  return [
    ...new Set(values.filter(Boolean)),
  ];
}

export function buildInferenceDependencyGraph(
  steps: InferenceStep[],
) : InferenceDependencyGraph {
  const latestByConstraint =
    new Map<string, string>();
  const nodes: InferenceDependencyNode[] =
    [];
  let lastStepId:
    | string
    | undefined;
  let lastBranchId:
    | string
    | undefined;
  let lastContradictionId:
    | string
    | undefined;

  for (const step of steps) {
    const kind = getNodeKind(step);
    const prerequisiteIds: string[] =
      [];

    for (const constraintId of step.sourceConstraintIds) {
      const prerequisiteId =
        latestByConstraint.get(
          constraintId,
        );

      if (
        prerequisiteId &&
        prerequisiteId !== step.stepId
      ) {
        prerequisiteIds.push(
          prerequisiteId,
        );
      }
    }

    if (
      kind === "branch" &&
      lastStepId
    ) {
      prerequisiteIds.push(
        lastStepId,
      );
    } else if (
      kind === "propagation" ||
      kind === "contradiction" ||
      kind === "acceptance" ||
      kind === "deduction"
    ) {
      if (lastBranchId) {
        prerequisiteIds.push(
          lastBranchId,
        );
      } else if (lastStepId) {
        prerequisiteIds.push(
          lastStepId,
        );
      }
    }

    const eliminationChainIds: string[] =
      [];

    if (
      step.eliminatedPossibilities
        .length > 0
    ) {
      if (lastBranchId) {
        eliminationChainIds.push(
          lastBranchId,
        );
      }

      if (lastContradictionId) {
        eliminationChainIds.push(
          lastContradictionId,
        );
      }
    }

    const node: InferenceDependencyNode =
      {
        nodeId: step.stepId,
        kind,
        logicLego: getLogicLego(step),
        step,
        prerequisiteIds:
          unique(
            prerequisiteIds.filter(
              (value) =>
                value !== step.stepId,
            ),
          ),
        unlockedDeductionIds: [],
        eliminationChainIds:
          unique(
            eliminationChainIds.filter(
              (value) =>
                value !== step.stepId,
            ),
          ),
      };
    nodes.push(node);

    for (const constraintId of step.sourceConstraintIds) {
      latestByConstraint.set(
        constraintId,
        step.stepId,
      );
    }

    if (kind === "branch") {
      lastBranchId = step.stepId;
    }

    if (
      kind === "contradiction"
    ) {
      lastContradictionId =
        step.stepId;
    }

    lastStepId = step.stepId;
  }

  const nodeIndex = new Map(
    nodes.map((node) => [
      node.nodeId,
      node,
    ]),
  );

  for (const node of nodes) {
    for (const prerequisiteId of node.prerequisiteIds) {
      nodeIndex
        .get(prerequisiteId)
        ?.unlockedDeductionIds.push(
          node.nodeId,
        );
    }
  }

  const depthMemo =
    new Map<string, number>();
  const getDepth = (
    nodeId: string,
  ): number => {
    const cached =
      depthMemo.get(nodeId);

    if (cached !== undefined) {
      return cached;
    }

    const node =
      nodeIndex.get(nodeId);

    if (!node) {
      return 0;
    }

    const depth =
      node.prerequisiteIds.length === 0
        ? 1
        : 1 +
          Math.max(
            ...node.prerequisiteIds.map(
              getDepth,
            ),
          );
    depthMemo.set(nodeId, depth);
    return depth;
  };

  const edgeCount = nodes.reduce(
    (sum, node) =>
      sum +
      node.prerequisiteIds.length,
    0,
  );
  const eliminationChainCount =
    nodes.filter(
      (node) =>
        node.eliminationChainIds
          .length > 0,
    ).length;
  const rootNodeIds = nodes
    .filter(
      (node) =>
        node.prerequisiteIds.length === 0,
    )
    .map((node) => node.nodeId);
  const inferenceDepth =
    nodes.length === 0
      ? 0
      : Math.max(
        ...nodes.map((node) =>
          getDepth(node.nodeId),
        ),
      );
  const branchNodes =
    nodes.filter(
      (node) => node.kind === "branch",
    );
  const averageUnlocks =
    nodes.length === 0
      ? 0
      : nodes.reduce(
          (sum, node) =>
            sum +
            node.unlockedDeductionIds
              .length,
          0,
        ) / nodes.length;
  const knownSeatProgression =
    nodes.map((node) =>
      getKnownSeatCount(
        node.step
          .resultingStateSnapshot,
      ),
    );
  const stateProgressionSpread =
    knownSeatProgression.length <= 1
      ? 0
      : Math.max(
          0,
          knownSeatProgression[
            knownSeatProgression.length -
              1
          ]! -
            knownSeatProgression[0]!,
        );
  const branchingComplexity = round(
    branchNodes.length +
      averageUnlocks * 0.8 +
      eliminationChainCount * 0.6,
  );
  const deductionDependencyScore =
    round(
      (edgeCount /
        Math.max(nodes.length, 1)) *
        2.2 +
        inferenceDepth * 0.7 +
        eliminationChainCount * 0.5 +
        stateProgressionSpread * 0.2,
    );

  return {
    nodes,
    inferenceDepth,
    branchingComplexity,
    deductionDependencyScore,
    eliminationChainCount,
    edgeCount,
    rootNodeIds,
  };
}
