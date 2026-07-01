import { strict as assert } from "node:assert";
import type { PercentOfKnownNumberEvidence } from "./evidence";
import {
  buildPercentOfKnownNumberGraph,
  PERCENT_OF_KNOWN_NUMBER_CORE_NODE_KINDS,
  PERCENT_OF_KNOWN_NUMBER_SUPPORTING_NODE_KINDS,
  PERCENT_OF_KNOWN_NUMBER_VERIFICATION_NODE_KINDS,
} from "./graph-builder";
import { buildPercentOfKnownNumberTrace } from "./trace-builder";

const evidence: PercentOfKnownNumberEvidence = {
  evidenceId: "PCT-001:PCT-QL-017:case-001:unit-value-evidence",
  evidenceVersion: "1.0.0",
  taskKind: "percentOfKnownNumber",
  methodFamily: "UNIT_VALUE",
  sourceValues: {
    knownUnitCount: 20,
    knownQuantity: 600,
    targetUnitCount: 25,
  },
  derivedValues: {
    singleUnitValue: 30,
    targetQuantity: 750,
  },
  exactValues: {
    singleUnitValue: { numerator: 600, denominator: 20 },
    targetQuantity: { numerator: 15_000, denominator: 20 },
  },
  units: {
    knownUnitCount: "percentage-point",
    knownQuantity: "abstract-number",
    targetUnitCount: "percentage-point",
    singleUnitValue: "abstract-number",
    targetQuantity: "abstract-number",
  },
  metadata: {
    exactness: "rational",
    roundingPolicy: "defer-to-presentation",
    countIntegrity: "not-required",
  },
};

const trace = buildPercentOfKnownNumberTrace(evidence);
const first = buildPercentOfKnownNumberGraph(trace);
const second = buildPercentOfKnownNumberGraph(trace);

assert.deepEqual(first, second, "Graph output must be deterministic.");

const nodesByKind = new Map(first.nodes.map((node) => [node.nodeKind, node]));
const nodeIds = new Set(first.nodes.map((node) => node.nodeId));
const traceIdeaIds = new Set(trace.ideas.map((idea) => idea.ideaId));
const traceValueRefIds = new Set(trace.valueRefs.map((ref) => ref.refId));
const traceUnitRefIds = new Set(trace.unitRefs.map((ref) => ref.refId));

assert.deepEqual(
  first.nodes
    .filter((node) => node.classification === "CORE")
    .map((node) => node.nodeKind),
  PERCENT_OF_KNOWN_NUMBER_CORE_NODE_KINDS,
  "All core nodes must exist in frozen order.",
);
assert.deepEqual(
  first.nodes
    .filter((node) => node.classification === "SUPPORTING")
    .map((node) => node.nodeKind),
  PERCENT_OF_KNOWN_NUMBER_SUPPORTING_NODE_KINDS,
  "All supporting nodes must exist in frozen order.",
);
assert.deepEqual(
  first.nodes
    .filter((node) => node.classification === "VERIFICATION")
    .map((node) => node.nodeKind),
  PERCENT_OF_KNOWN_NUMBER_VERIFICATION_NODE_KINDS,
  "Verification nodes must be classified separately.",
);

for (const node of first.nodes) {
  assert.ok(node.traceRefs.length > 0, `${node.nodeKind}: missing trace refs`);
  for (const traceRef of node.traceRefs) {
    assert.ok(
      traceIdeaIds.has(traceRef),
      `${node.nodeKind}: unknown trace reference`,
    );
  }
  for (const valueRef of node.valueRefs) {
    assert.ok(
      traceValueRefIds.has(valueRef),
      `${node.nodeKind}: unknown value reference`,
    );
  }
  for (const unitRef of node.unitRefs) {
    assert.ok(
      traceUnitRefIds.has(unitRef),
      `${node.nodeKind}: unknown unit reference`,
    );
  }
}

for (const edge of first.edges) {
  assert.ok(nodeIds.has(edge.fromNodeId), `${edge.edgeId}: unknown source node`);
  assert.ok(nodeIds.has(edge.toNodeId), `${edge.edgeId}: unknown target node`);
}

const outgoing = new Map<string, string[]>(
  first.nodes.map((node) => [node.nodeId, []]),
);
const incomingCount = new Map<string, number>(
  first.nodes.map((node) => [node.nodeId, 0]),
);
for (const edge of first.edges) {
  outgoing.get(edge.fromNodeId)!.push(edge.toNodeId);
  incomingCount.set(edge.toNodeId, incomingCount.get(edge.toNodeId)! + 1);
}

const queue = first.nodes
  .filter((node) => incomingCount.get(node.nodeId) === 0)
  .map((node) => node.nodeId);
let visited = 0;
while (queue.length > 0) {
  const current = queue.shift()!;
  visited += 1;
  for (const target of outgoing.get(current)!) {
    incomingCount.set(target, incomingCount.get(target)! - 1);
    if (incomingCount.get(target) === 0) queue.push(target);
  }
}
assert.equal(visited, first.nodes.length, "Graph must be acyclic.");

for (const node of first.nodes) {
  const degree =
    outgoing.get(node.nodeId)!.length +
    first.edges.filter((edge) => edge.toNodeId === node.nodeId).length;
  assert.ok(degree > 0, `${node.nodeKind}: graph node must not be orphaned`);
}

const coreEdgePairs = new Set(
  first.edges
    .filter((edge) => edge.edgeKind === "core-dependency")
    .map((edge) => `${edge.fromNodeId}->${edge.toNodeId}`),
);
const requiredCorePairs = [
  ["known-percent-units", "single-percent-value"],
  ["known-quantity", "single-percent-value"],
  ["single-percent-value", "target-quantity"],
  ["target-percent-units", "target-quantity"],
  ["target-quantity", "answer-interpretation"],
] as const;
for (const [fromKind, toKind] of requiredCorePairs) {
  assert.ok(
    coreEdgePairs.has(
      `${nodesByKind.get(fromKind)!.nodeId}->${nodesByKind.get(toKind)!.nodeId}`,
    ),
    `Missing mandatory core dependency: ${fromKind} -> ${toKind}`,
  );
}

function hasPath(
  fromNodeId: string,
  toNodeId: string,
  excludedNodeId?: string,
): boolean {
  const pending = [fromNodeId];
  const seen = new Set<string>();
  while (pending.length > 0) {
    const current = pending.shift()!;
    if (current === excludedNodeId || seen.has(current)) continue;
    if (current === toNodeId) return true;
    seen.add(current);
    pending.push(
      ...outgoing
        .get(current)!
        .filter((candidate) => candidate !== excludedNodeId),
    );
  }
  return false;
}

const singleUnitNode = nodesByKind.get("single-percent-value")!;
const answerNode = nodesByKind.get("answer-interpretation")!;
for (const sourceKind of ["known-percent-units", "known-quantity"] as const) {
  const sourceNode = nodesByKind.get(sourceKind)!;
  assert.ok(
    hasPath(sourceNode.nodeId, answerNode.nodeId),
    `${sourceKind}: answer path must exist`,
  );
  assert.equal(
    hasPath(sourceNode.nodeId, answerNode.nodeId, singleUnitNode.nodeId),
    false,
    `${sourceKind}: one-unit dependency must be unavoidable`,
  );
}

const verificationNode = nodesByKind.get("known-relation-reconstruction")!;
assert.equal(
  hasPath(verificationNode.nodeId, answerNode.nodeId),
  false,
  "Verification must not lie on or replace the mandatory answer path.",
);

function assertNoPresentationFields(value: unknown): void {
  if (Array.isArray(value)) {
    for (const item of value) assertNoPresentationFields(item);
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    assert.ok(
      !/prose|narrative|text|sentence|equation|latex|math|template|render|visibility|language|detailMode/i.test(
        key,
      ),
      `Forbidden graph field detected: ${key}`,
    );
    assertNoPresentationFields(child);
  }
}

assertNoPresentationFields(first);

console.log("ENG-004 Rich Reasoning Graph tests passed.");
