import type {
  GraphNode,
  RichReasoningGraph,
  TutorThinkingTrace,
} from "../../../../../../../common/eev2/contracts";
import {
  PERCENT_OF_KNOWN_NUMBER_CORE_NODE_KINDS,
  PERCENT_OF_KNOWN_NUMBER_VERIFICATION_NODE_KINDS,
} from "./graph-builder";
import {
  validationResult,
  type EEV2ValidationFailure,
  type EEV2ValidationResult,
} from "./validation-types";

function inspectForbiddenFields(
  value: unknown,
  failures: EEV2ValidationFailure[],
  subjectId: string,
): void {
  if (Array.isArray(value)) {
    for (const item of value) inspectForbiddenFields(item, failures, subjectId);
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    if (
      /prose|narrative|text|sentence|equation|latex|math|template|render|visibility|language|detailMode/i.test(
        key,
      )
    ) {
      failures.push({
        code: "GRAPH_PRESENTATION_FIELD",
        severity: "CRITICAL",
        layer: "GRAPH",
        message: `Reasoning graph contains forbidden field "${key}".`,
        subjectId,
      });
    }
    inspectForbiddenFields(child, failures, subjectId);
  }
}

function hasPath(
  graph: RichReasoningGraph,
  fromNodeId: string,
  toNodeId: string,
  excludedNodeId?: string,
): boolean {
  const outgoing = new Map<string, string[]>(
    graph.nodes.map((node) => [node.nodeId, []]),
  );
  for (const edge of graph.edges) {
    outgoing.get(edge.fromNodeId)?.push(edge.toNodeId);
  }
  const pending = [fromNodeId];
  const seen = new Set<string>();
  while (pending.length > 0) {
    const current = pending.shift()!;
    if (current === excludedNodeId || seen.has(current)) continue;
    if (current === toNodeId) return true;
    seen.add(current);
    pending.push(
      ...(outgoing.get(current) ?? []).filter(
        (candidate) => candidate !== excludedNodeId,
      ),
    );
  }
  return false;
}

function requireKind(
  graph: RichReasoningGraph,
  nodeKind: string,
): GraphNode | undefined {
  return graph.nodes.find((node) => node.nodeKind === nodeKind);
}

export function validatePercentOfKnownNumberGraph(
  graph: RichReasoningGraph,
  trace: TutorThinkingTrace,
): EEV2ValidationResult {
  const failures: EEV2ValidationFailure[] = [];
  const nodesByKind = new Map(graph.nodes.map((node) => [node.nodeKind, node]));
  const nodeIds = new Set(graph.nodes.map((node) => node.nodeId));
  const traceIds = new Set(trace.ideas.map((idea) => idea.ideaId));
  const valueRefIds = new Set(trace.valueRefs.map((ref) => ref.refId));
  const unitRefIds = new Set(trace.unitRefs.map((ref) => ref.refId));

  const actualCoreKinds = graph.nodes
    .filter((node) => node.classification === "CORE")
    .map((node) => node.nodeKind);
  if (
    JSON.stringify(actualCoreKinds) !==
    JSON.stringify(PERCENT_OF_KNOWN_NUMBER_CORE_NODE_KINDS)
  ) {
    failures.push({
      code: "GRAPH_CORE_COMPLETENESS",
      severity: "CRITICAL",
      layer: "GRAPH",
      message: "Reasoning graph does not contain the six frozen core nodes.",
      subjectId: graph.graphId,
    });
  }

  for (const node of graph.nodes) {
    if (node.traceRefs.length === 0) {
      failures.push({
        code: "GRAPH_MISSING_TRACE_REF",
        severity: "CRITICAL",
        layer: "GRAPH",
        message: "Graph node has no Tutor Thinking Trace reference.",
        subjectId: node.nodeId,
      });
    }
    for (const traceRef of node.traceRefs) {
      if (!traceIds.has(traceRef)) {
        failures.push({
          code: "GRAPH_UNKNOWN_TRACE_REF",
          severity: "CRITICAL",
          layer: "GRAPH",
          message: "Graph node references an unknown trace idea.",
          subjectId: node.nodeId,
        });
      }
    }
    for (const valueRef of node.valueRefs) {
      if (!valueRefIds.has(valueRef)) {
        failures.push({
          code: "GRAPH_UNKNOWN_VALUE_REF",
          severity: "CRITICAL",
          layer: "GRAPH",
          message: "Graph node references an unknown value.",
          subjectId: node.nodeId,
        });
      }
    }
    for (const unitRef of node.unitRefs) {
      if (!unitRefIds.has(unitRef)) {
        failures.push({
          code: "GRAPH_UNKNOWN_UNIT_REF",
          severity: "CRITICAL",
          layer: "GRAPH",
          message: "Graph node references an unknown unit.",
          subjectId: node.nodeId,
        });
      }
    }
  }

  const incoming = new Map(graph.nodes.map((node) => [node.nodeId, 0]));
  const outgoing = new Map<string, string[]>(
    graph.nodes.map((node) => [node.nodeId, []]),
  );
  for (const edge of graph.edges) {
    if (!nodeIds.has(edge.fromNodeId) || !nodeIds.has(edge.toNodeId)) {
      failures.push({
        code: "GRAPH_UNKNOWN_EDGE_NODE",
        severity: "CRITICAL",
        layer: "GRAPH",
        message: "Graph edge references an unknown node.",
        subjectId: edge.edgeId,
      });
      continue;
    }
    outgoing.get(edge.fromNodeId)!.push(edge.toNodeId);
    incoming.set(edge.toNodeId, incoming.get(edge.toNodeId)! + 1);
  }
  const queue = graph.nodes
    .filter((node) => incoming.get(node.nodeId) === 0)
    .map((node) => node.nodeId);
  let visited = 0;
  while (queue.length > 0) {
    const current = queue.shift()!;
    visited += 1;
    for (const target of outgoing.get(current) ?? []) {
      incoming.set(target, incoming.get(target)! - 1);
      if (incoming.get(target) === 0) queue.push(target);
    }
  }
  if (visited !== graph.nodes.length) {
    failures.push({
      code: "GRAPH_CYCLE",
      severity: "CRITICAL",
      layer: "GRAPH",
      message: "Reasoning graph contains a cycle.",
      subjectId: graph.graphId,
    });
  }
  for (const node of graph.nodes) {
    const degree =
      (outgoing.get(node.nodeId)?.length ?? 0) +
      graph.edges.filter((edge) => edge.toNodeId === node.nodeId).length;
    if (degree === 0) {
      failures.push({
        code: "GRAPH_ORPHAN_NODE",
        severity: "CRITICAL",
        layer: "GRAPH",
        message: "Reasoning graph contains an orphan node.",
        subjectId: node.nodeId,
      });
    }
  }

  const knownUnits = requireKind(graph, "known-percent-units");
  const knownQuantity = requireKind(graph, "known-quantity");
  const singleUnit = requireKind(graph, "single-percent-value");
  const answer = requireKind(graph, "answer-interpretation");
  if (knownUnits && knownQuantity && singleUnit && answer) {
    for (const source of [knownUnits, knownQuantity]) {
      if (!hasPath(graph, source.nodeId, answer.nodeId)) {
        failures.push({
          code: "GRAPH_ANSWER_PATH",
          severity: "CRITICAL",
          layer: "GRAPH",
          message: "Mandatory answer path is missing.",
          subjectId: source.nodeId,
        });
      } else if (
        hasPath(graph, source.nodeId, answer.nodeId, singleUnit.nodeId)
      ) {
        failures.push({
          code: "GRAPH_SINGLE_UNIT_BYPASS",
          severity: "CRITICAL",
          layer: "GRAPH",
          message: "Answer path can bypass the one-unit node.",
          subjectId: source.nodeId,
        });
      }
    }
  }

  for (const verificationKind of PERCENT_OF_KNOWN_NUMBER_VERIFICATION_NODE_KINDS) {
    const verification = nodesByKind.get(verificationKind);
    if (verification && answer && hasPath(graph, verification.nodeId, answer.nodeId)) {
      failures.push({
        code: "GRAPH_VERIFICATION_ON_ANSWER_PATH",
        severity: "CRITICAL",
        layer: "GRAPH",
        message: "Verification node lies on the mandatory answer path.",
        subjectId: verification.nodeId,
      });
    }
  }

  inspectForbiddenFields(graph, failures, graph.graphId);
  return validationResult(failures);
}
