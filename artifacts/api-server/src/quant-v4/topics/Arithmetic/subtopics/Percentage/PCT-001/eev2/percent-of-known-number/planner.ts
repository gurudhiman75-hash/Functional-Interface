import type {
  EEV2DetailMode,
  EEV2Visibility,
  ExplanationPlan,
  ExplanationRole,
  GraphNode,
  RichReasoningGraph,
} from "../../../../../../../common/eev2/contracts";

export const PERCENT_OF_KNOWN_NUMBER_PLANNER_VERSION = "1.0.0" as const;

export const PERCENT_OF_KNOWN_NUMBER_ROLE_KINDS = [
  "RELATIONSHIP_CONTEXT",
  "KNOWN_UNIT_MAPPING",
  "SINGLE_UNIT_DERIVATION",
  "TARGET_UNIT_IDENTIFICATION",
  "TARGET_SCALE_DERIVATION",
  "ANSWER_INTERPRETATION",
  "VERIFICATION",
] as const;

export type PercentOfKnownNumberRoleKind =
  (typeof PERCENT_OF_KNOWN_NUMBER_ROLE_KINDS)[number];

function requireNode(
  graph: RichReasoningGraph,
  nodeKind: string,
): GraphNode {
  const node = graph.nodes.find((candidate) => candidate.nodeKind === nodeKind);
  if (!node) throw new Error(`Missing reasoning graph node: ${nodeKind}`);
  return node;
}

function roleId(
  planId: string,
  index: number,
  roleKind: PercentOfKnownNumberRoleKind,
): string {
  return `${planId}:role:${String(index + 1).padStart(2, "0")}:${roleKind}`;
}

function essentialVisibility(detailMode: EEV2DetailMode): EEV2Visibility {
  return {
    state: "visible",
    detailModes: [detailMode],
  };
}

function verificationVisibility(
  detailMode: EEV2DetailMode,
): EEV2Visibility {
  if (detailMode === "short") {
    return {
      state: "hidden",
      detailModes: [detailMode],
    };
  }
  if (detailMode === "standard") {
    return {
      state: "conditional",
      detailModes: [detailMode],
      conditionId: "verification-requested",
    };
  }
  return {
    state: "visible",
    detailModes: [detailMode],
  };
}

export function planPercentOfKnownNumberExplanation(
  graph: RichReasoningGraph,
  detailMode: EEV2DetailMode,
): ExplanationPlan {
  const planId = `${graph.graphId}:plan:${PERCENT_OF_KNOWN_NUMBER_PLANNER_VERSION}:${detailMode}`;
  const ids = PERCENT_OF_KNOWN_NUMBER_ROLE_KINDS.map((roleKind, index) =>
    roleId(planId, index, roleKind),
  );

  const knownUnits = requireNode(graph, "known-percent-units");
  const knownQuantity = requireNode(graph, "known-quantity");
  const targetUnits = requireNode(graph, "target-percent-units");
  const singleUnit = requireNode(graph, "single-percent-value");
  const targetQuantity = requireNode(graph, "target-quantity");
  const answerInterpretation = requireNode(graph, "answer-interpretation");
  const scalingDirection = requireNode(graph, "scaling-direction");
  const exactValuePolicy = requireNode(graph, "exact-value-policy");
  const unitIntegrity = requireNode(graph, "unit-integrity");
  const verification = requireNode(graph, "known-relation-reconstruction");

  const roles: readonly ExplanationRole[] = [
    {
      roleId: ids[0]!,
      roleKind: PERCENT_OF_KNOWN_NUMBER_ROLE_KINDS[0],
      graphRefs: [
        knownUnits.nodeId,
        knownQuantity.nodeId,
        scalingDirection.nodeId,
      ],
      dependencies: [],
      visibility: essentialVisibility(detailMode),
      metadata: {
        importance: "essential",
      },
    },
    {
      roleId: ids[1]!,
      roleKind: PERCENT_OF_KNOWN_NUMBER_ROLE_KINDS[1],
      graphRefs: [knownUnits.nodeId, knownQuantity.nodeId],
      dependencies: [ids[0]!],
      visibility: essentialVisibility(detailMode),
      metadata: {
        importance: "essential",
      },
    },
    {
      roleId: ids[2]!,
      roleKind: PERCENT_OF_KNOWN_NUMBER_ROLE_KINDS[2],
      graphRefs: [
        knownUnits.nodeId,
        knownQuantity.nodeId,
        singleUnit.nodeId,
        exactValuePolicy.nodeId,
      ],
      dependencies: [ids[1]!],
      visibility: essentialVisibility(detailMode),
      metadata: {
        importance: "essential",
        methodDefining: true,
      },
    },
    {
      roleId: ids[3]!,
      roleKind: PERCENT_OF_KNOWN_NUMBER_ROLE_KINDS[3],
      graphRefs: [targetUnits.nodeId],
      dependencies: [ids[0]!],
      visibility: essentialVisibility(detailMode),
      metadata:
        detailMode === "short"
          ? {
              importance: "essential",
              groupId: "target-operation",
              groupedWithRoleKind: "TARGET_SCALE_DERIVATION",
            }
          : {
              importance: "essential",
            },
    },
    {
      roleId: ids[4]!,
      roleKind: PERCENT_OF_KNOWN_NUMBER_ROLE_KINDS[4],
      graphRefs: [
        singleUnit.nodeId,
        targetUnits.nodeId,
        targetQuantity.nodeId,
        exactValuePolicy.nodeId,
      ],
      dependencies: [ids[2]!, ids[3]!],
      visibility: essentialVisibility(detailMode),
      metadata:
        detailMode === "short"
          ? {
              importance: "essential",
              groupId: "target-operation",
              groupedWithRoleKind: "TARGET_UNIT_IDENTIFICATION",
            }
          : {
              importance: "essential",
            },
    },
    {
      roleId: ids[5]!,
      roleKind: PERCENT_OF_KNOWN_NUMBER_ROLE_KINDS[5],
      graphRefs: [
        targetQuantity.nodeId,
        answerInterpretation.nodeId,
        unitIntegrity.nodeId,
      ],
      dependencies: [ids[4]!],
      visibility: essentialVisibility(detailMode),
      metadata: {
        importance: "essential",
      },
    },
    {
      roleId: ids[6]!,
      roleKind: PERCENT_OF_KNOWN_NUMBER_ROLE_KINDS[6],
      graphRefs: [verification.nodeId],
      dependencies: [ids[2]!],
      visibility: verificationVisibility(detailMode),
      metadata: {
        importance: "optional",
        preference:
          detailMode === "detailed"
            ? "preferred"
            : detailMode === "standard"
              ? "optional"
              : "hidden",
      },
    },
  ];

  return {
    planId,
    planVersion: PERCENT_OF_KNOWN_NUMBER_PLANNER_VERSION,
    methodFamily: String(graph.metadata.methodFamily),
    detailMode,
    roles,
    metadata: {
      graphId: graph.graphId,
      graphVersion: graph.graphVersion,
      taskKind: graph.metadata.taskKind,
    },
  };
}
