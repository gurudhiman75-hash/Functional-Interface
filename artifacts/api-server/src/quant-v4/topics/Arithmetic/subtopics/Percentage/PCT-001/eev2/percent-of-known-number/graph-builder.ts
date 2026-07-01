import type {
  GraphEdge,
  GraphNode,
  RichReasoningGraph,
  TutorThinkingIdea,
  TutorThinkingTrace,
} from "../../../../../../../common/eev2/contracts";

export const PERCENT_OF_KNOWN_NUMBER_GRAPH_VERSION = "1.0.0" as const;

export const PERCENT_OF_KNOWN_NUMBER_CORE_NODE_KINDS = [
  "known-percent-units",
  "known-quantity",
  "target-percent-units",
  "single-percent-value",
  "target-quantity",
  "answer-interpretation",
] as const;

export const PERCENT_OF_KNOWN_NUMBER_SUPPORTING_NODE_KINDS = [
  "scaling-direction",
  "exact-value-policy",
  "unit-integrity",
] as const;

export const PERCENT_OF_KNOWN_NUMBER_VERIFICATION_NODE_KINDS = [
  "known-relation-reconstruction",
] as const;

function requireIdea(
  trace: TutorThinkingTrace,
  ideaKind: string,
): TutorThinkingIdea {
  const idea = trace.ideas.find((candidate) => candidate.ideaKind === ideaKind);
  if (!idea) {
    throw new Error(`Missing Tutor Thinking Trace idea: ${ideaKind}`);
  }
  return idea;
}

function nodeId(graphId: string, nodeKind: string): string {
  return `${graphId}:node:${nodeKind}`;
}

function edge(
  graphId: string,
  index: number,
  fromNodeId: string,
  toNodeId: string,
  edgeKind: string,
): GraphEdge {
  return {
    edgeId: `${graphId}:edge:${String(index + 1).padStart(2, "0")}`,
    fromNodeId,
    toNodeId,
    edgeKind,
    metadata: {},
  };
}

export function buildPercentOfKnownNumberGraph(
  trace: TutorThinkingTrace,
): RichReasoningGraph {
  const graphId = `${trace.traceId}:graph:${PERCENT_OF_KNOWN_NUMBER_GRAPH_VERSION}`;

  const recognizeRelation = requireIdea(
    trace,
    "RECOGNIZE_EQUAL_UNIT_RELATION",
  );
  const identifyKnownUnits = requireIdea(
    trace,
    "IDENTIFY_KNOWN_UNIT_COUNT",
  );
  const identifyKnownQuantity = requireIdea(
    trace,
    "IDENTIFY_KNOWN_QUANTITY",
  );
  const identifyTargetUnits = requireIdea(
    trace,
    "IDENTIFY_TARGET_UNIT_COUNT",
  );
  const deriveSingleUnit = requireIdea(trace, "DERIVE_SINGLE_UNIT_VALUE");
  const scaleToTarget = requireIdea(trace, "SCALE_SINGLE_UNIT_TO_TARGET");
  const interpretTarget = requireIdea(
    trace,
    "INTERPRET_TARGET_QUANTITY",
  );

  const ids = {
    knownUnits: nodeId(graphId, "known-percent-units"),
    knownQuantity: nodeId(graphId, "known-quantity"),
    targetUnits: nodeId(graphId, "target-percent-units"),
    singleUnit: nodeId(graphId, "single-percent-value"),
    targetQuantity: nodeId(graphId, "target-quantity"),
    answerInterpretation: nodeId(graphId, "answer-interpretation"),
    scalingDirection: nodeId(graphId, "scaling-direction"),
    exactValuePolicy: nodeId(graphId, "exact-value-policy"),
    unitIntegrity: nodeId(graphId, "unit-integrity"),
    knownRelationVerification: nodeId(
      graphId,
      "known-relation-reconstruction",
    ),
  } as const;

  const nodes: readonly GraphNode[] = [
    {
      nodeId: ids.knownUnits,
      nodeKind: PERCENT_OF_KNOWN_NUMBER_CORE_NODE_KINDS[0],
      classification: "CORE",
      valueRefs: identifyKnownUnits.valueRefs,
      unitRefs: identifyKnownUnits.unitRefs,
      traceRefs: [identifyKnownUnits.ideaId],
      importance: "essential",
      metadata: {},
    },
    {
      nodeId: ids.knownQuantity,
      nodeKind: PERCENT_OF_KNOWN_NUMBER_CORE_NODE_KINDS[1],
      classification: "CORE",
      valueRefs: identifyKnownQuantity.valueRefs,
      unitRefs: identifyKnownQuantity.unitRefs,
      traceRefs: [identifyKnownQuantity.ideaId],
      importance: "essential",
      metadata: {},
    },
    {
      nodeId: ids.targetUnits,
      nodeKind: PERCENT_OF_KNOWN_NUMBER_CORE_NODE_KINDS[2],
      classification: "CORE",
      valueRefs: identifyTargetUnits.valueRefs,
      unitRefs: identifyTargetUnits.unitRefs,
      traceRefs: [identifyTargetUnits.ideaId],
      importance: "essential",
      metadata: {},
    },
    {
      nodeId: ids.singleUnit,
      nodeKind: PERCENT_OF_KNOWN_NUMBER_CORE_NODE_KINDS[3],
      classification: "CORE",
      valueRefs: deriveSingleUnit.valueRefs,
      unitRefs: deriveSingleUnit.unitRefs,
      traceRefs: [deriveSingleUnit.ideaId],
      importance: "essential",
      metadata: {},
    },
    {
      nodeId: ids.targetQuantity,
      nodeKind: PERCENT_OF_KNOWN_NUMBER_CORE_NODE_KINDS[4],
      classification: "CORE",
      valueRefs: scaleToTarget.valueRefs,
      unitRefs: scaleToTarget.unitRefs,
      traceRefs: [scaleToTarget.ideaId],
      importance: "essential",
      metadata: {},
    },
    {
      nodeId: ids.answerInterpretation,
      nodeKind: PERCENT_OF_KNOWN_NUMBER_CORE_NODE_KINDS[5],
      classification: "CORE",
      valueRefs: interpretTarget.valueRefs,
      unitRefs: interpretTarget.unitRefs,
      traceRefs: [interpretTarget.ideaId],
      importance: "essential",
      metadata: {},
    },
    {
      nodeId: ids.scalingDirection,
      nodeKind: PERCENT_OF_KNOWN_NUMBER_SUPPORTING_NODE_KINDS[0],
      classification: "SUPPORTING",
      valueRefs: [
        ...identifyKnownUnits.valueRefs,
        ...identifyTargetUnits.valueRefs,
      ],
      unitRefs: identifyTargetUnits.unitRefs,
      traceRefs: [
        recognizeRelation.ideaId,
        identifyKnownUnits.ideaId,
        identifyTargetUnits.ideaId,
      ],
      importance: "supporting",
      metadata: {},
    },
    {
      nodeId: ids.exactValuePolicy,
      nodeKind: PERCENT_OF_KNOWN_NUMBER_SUPPORTING_NODE_KINDS[1],
      classification: "SUPPORTING",
      valueRefs: [
        ...deriveSingleUnit.valueRefs,
        ...scaleToTarget.valueRefs,
      ],
      unitRefs: scaleToTarget.unitRefs,
      traceRefs: [deriveSingleUnit.ideaId, scaleToTarget.ideaId],
      importance: "supporting",
      metadata: {},
    },
    {
      nodeId: ids.unitIntegrity,
      nodeKind: PERCENT_OF_KNOWN_NUMBER_SUPPORTING_NODE_KINDS[2],
      classification: "SUPPORTING",
      valueRefs: interpretTarget.valueRefs,
      unitRefs: interpretTarget.unitRefs,
      traceRefs: [interpretTarget.ideaId],
      importance: "supporting",
      metadata: {},
    },
    {
      nodeId: ids.knownRelationVerification,
      nodeKind: PERCENT_OF_KNOWN_NUMBER_VERIFICATION_NODE_KINDS[0],
      classification: "VERIFICATION",
      valueRefs: [
        ...identifyKnownUnits.valueRefs,
        ...identifyKnownQuantity.valueRefs,
        ...deriveSingleUnit.valueRefs,
      ],
      unitRefs: deriveSingleUnit.unitRefs,
      traceRefs: [
        identifyKnownUnits.ideaId,
        identifyKnownQuantity.ideaId,
        deriveSingleUnit.ideaId,
      ],
      importance: "optional",
      metadata: {},
    },
  ];

  const edges: readonly GraphEdge[] = [
    edge(graphId, 0, ids.knownUnits, ids.singleUnit, "core-dependency"),
    edge(graphId, 1, ids.knownQuantity, ids.singleUnit, "core-dependency"),
    edge(graphId, 2, ids.singleUnit, ids.targetQuantity, "core-dependency"),
    edge(graphId, 3, ids.targetUnits, ids.targetQuantity, "core-dependency"),
    edge(
      graphId,
      4,
      ids.targetQuantity,
      ids.answerInterpretation,
      "core-dependency",
    ),
    edge(
      graphId,
      5,
      ids.knownUnits,
      ids.scalingDirection,
      "supporting-dependency",
    ),
    edge(
      graphId,
      6,
      ids.targetUnits,
      ids.scalingDirection,
      "supporting-dependency",
    ),
    edge(
      graphId,
      7,
      ids.singleUnit,
      ids.exactValuePolicy,
      "supporting-dependency",
    ),
    edge(
      graphId,
      8,
      ids.targetQuantity,
      ids.exactValuePolicy,
      "supporting-dependency",
    ),
    edge(
      graphId,
      9,
      ids.answerInterpretation,
      ids.unitIntegrity,
      "supporting-dependency",
    ),
    edge(
      graphId,
      10,
      ids.knownUnits,
      ids.knownRelationVerification,
      "verification-dependency",
    ),
    edge(
      graphId,
      11,
      ids.knownQuantity,
      ids.knownRelationVerification,
      "verification-dependency",
    ),
    edge(
      graphId,
      12,
      ids.singleUnit,
      ids.knownRelationVerification,
      "verification-dependency",
    ),
  ];

  return {
    graphId,
    graphVersion: PERCENT_OF_KNOWN_NUMBER_GRAPH_VERSION,
    nodes,
    edges,
    metadata: {
      traceId: trace.traceId,
      traceVersion: trace.traceVersion,
      methodFamily: trace.methodFamily,
      packageId: trace.packageId,
      taskKind: trace.taskKind,
    },
  };
}
