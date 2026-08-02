import { buildEqualityComponents } from "./equality-components";
import {
  normalizeConstraintDirection,
  strongestDefiniteRelation,
} from "./relations";
import type {
  AtomicOrder,
  ComparisonConstraint,
  ComparisonProofPath,
  ComparisonProofStep,
  InequalityContradiction,
  InequalityGraphAnalysis,
  PairRelationEvidence,
} from "./types";

interface GraphEdge {
  fromId: string;
  toId: string;
  strict: boolean;
  sourceStatementIds: readonly string[];
}

interface ReachabilityEvidence {
  nonStrictPath?: ComparisonProofPath;
  strictPath?: ComparisonProofPath;
}

interface PreparedGraph {
  analysis: InequalityGraphAnalysis;
  componentByEntity: ReadonlyMap<string, string>;
  reachability: ReadonlyMap<string, ReadonlyMap<string, ReachabilityEvidence>>;
}

function uniqueSorted(values: readonly string[]): string[] {
  return [...new Set(values)].sort();
}

function entityIdsFor(
  constraints: readonly ComparisonConstraint[],
  extraEntityIds: readonly string[],
): string[] {
  return uniqueSorted([
    ...extraEntityIds,
    ...constraints.flatMap((constraint) => [
      constraint.leftId,
      constraint.rightId,
    ]),
  ]);
}

function validateEntityIds(
  constraints: readonly ComparisonConstraint[],
  extraEntityIds: readonly string[],
): InequalityContradiction[] {
  const invalidIds = uniqueSorted(
    [
      ...extraEntityIds,
      ...constraints.flatMap((constraint) => [
        constraint.leftId,
        constraint.rightId,
      ]),
    ].filter((entityId) => entityId.trim().length === 0),
  );
  if (invalidIds.length === 0) return [];
  return [
    {
      code: "INVALID_ENTITY_ID",
      message: "Inequality entities must use non-empty identifiers.",
      sourceStatementIds: constraints
        .filter(
          (constraint) =>
            constraint.leftId.trim().length === 0 ||
            constraint.rightId.trim().length === 0,
        )
        .map((constraint) => constraint.sourceStatementId),
    },
  ];
}

function buildEdges(
  constraints: readonly ComparisonConstraint[],
  componentByEntity: ReadonlyMap<string, string>,
): { edges: GraphEdge[]; contradictions: InequalityContradiction[] } {
  const edgeByKey = new Map<string, GraphEdge>();
  const contradictions: InequalityContradiction[] = [];

  for (const original of constraints) {
    if (original.relation === "EQUAL_TO") continue;
    const constraint = normalizeConstraintDirection(original);
    const fromId = componentByEntity.get(constraint.leftId)!;
    const toId = componentByEntity.get(constraint.rightId)!;
    const strict = constraint.relation === "GREATER_THAN";

    if (fromId === toId) {
      if (strict) {
        contradictions.push({
          code: "STRICT_SELF_RELATION",
          message: `${original.leftId} and ${original.rightId} are equal but are also constrained by a strict relation.`,
          sourceStatementIds: [original.sourceStatementId],
        });
      }
      continue;
    }

    const key = `${fromId}->${toId}:${strict ? "STRICT" : "NON_STRICT"}`;
    const existing = edgeByKey.get(key);
    edgeByKey.set(key, {
      fromId,
      toId,
      strict,
      sourceStatementIds: uniqueSorted([
        ...(existing?.sourceStatementIds ?? []),
        original.sourceStatementId,
      ]),
    });
  }

  return { edges: [...edgeByKey.values()], contradictions };
}

function proofPath(
  componentIds: readonly string[],
  steps: readonly ComparisonProofStep[],
  strict: boolean,
): ComparisonProofPath {
  return { componentIds, steps, strict };
}

function computeReachability(
  componentIds: readonly string[],
  edges: readonly GraphEdge[],
): Map<string, Map<string, ReachabilityEvidence>> {
  const adjacency = new Map<string, GraphEdge[]>();
  for (const edge of edges) {
    const outgoing = adjacency.get(edge.fromId) ?? [];
    outgoing.push(edge);
    adjacency.set(edge.fromId, outgoing);
  }

  const result = new Map<string, Map<string, ReachabilityEvidence>>();
  for (const sourceId of componentIds) {
    const evidenceByTarget = new Map<string, ReachabilityEvidence>();
    const queue: Array<{
      currentId: string;
      componentPath: readonly string[];
      steps: readonly ComparisonProofStep[];
      strict: boolean;
    }> = [
      {
        currentId: sourceId,
        componentPath: [sourceId],
        steps: [],
        strict: false,
      },
    ];
    const visited = new Set<string>([`${sourceId}:NON_STRICT`]);

    while (queue.length > 0) {
      const current = queue.shift()!;
      for (const edge of adjacency.get(current.currentId) ?? []) {
        const nextStrict = current.strict || edge.strict;
        const stateKey = `${edge.toId}:${nextStrict ? "STRICT" : "NON_STRICT"}`;
        if (visited.has(stateKey)) continue;
        visited.add(stateKey);

        const nextStep: ComparisonProofStep = {
          fromId: edge.fromId,
          toId: edge.toId,
          strict: edge.strict,
          sourceStatementIds: edge.sourceStatementIds,
        };
        const componentPath = [...current.componentPath, edge.toId];
        const steps = [...current.steps, nextStep];
        const path = proofPath(componentPath, steps, nextStrict);
        const targetEvidence = evidenceByTarget.get(edge.toId) ?? {};
        if (nextStrict)
          targetEvidence.strictPath = targetEvidence.strictPath ?? path;
        else
          targetEvidence.nonStrictPath = targetEvidence.nonStrictPath ?? path;
        evidenceByTarget.set(edge.toId, targetEvidence);

        queue.push({
          currentId: edge.toId,
          componentPath,
          steps,
          strict: nextStrict,
        });
      }
    }
    result.set(sourceId, evidenceByTarget);
  }
  return result;
}

function strictCycleContradictions(
  componentIds: readonly string[],
  reachability: ReadonlyMap<string, ReadonlyMap<string, ReachabilityEvidence>>,
): InequalityContradiction[] {
  const contradictions: InequalityContradiction[] = [];
  for (const componentId of componentIds) {
    const strictCycle = reachability
      .get(componentId)
      ?.get(componentId)?.strictPath;
    if (!strictCycle) continue;
    contradictions.push({
      code: "STRICT_ORDER_CYCLE",
      message: `Strict comparison cycle detected through component ${componentId}.`,
      sourceStatementIds: uniqueSorted(
        strictCycle.steps.flatMap((step) => step.sourceStatementIds),
      ),
    });
  }
  return contradictions;
}

function prepareGraph(
  constraints: readonly ComparisonConstraint[],
  extraEntityIds: readonly string[] = [],
): PreparedGraph {
  const entities = entityIdsFor(constraints, extraEntityIds);
  const invalidEntityContradictions = validateEntityIds(
    constraints,
    extraEntityIds,
  );
  const equality = buildEqualityComponents(constraints, extraEntityIds);
  const { edges, contradictions: edgeContradictions } = buildEdges(
    constraints,
    equality.canonicalIdByEntity,
  );
  const componentIds = equality.components.map(
    (component) => equality.canonicalIdByEntity.get(component[0]!)!,
  );
  const reachability = computeReachability(componentIds, edges);
  const contradictions = [
    ...invalidEntityContradictions,
    ...edgeContradictions,
    ...strictCycleContradictions(componentIds, reachability),
  ];

  return {
    analysis: {
      entities,
      equalityComponents: equality.components,
      normalizedConstraints: constraints,
      consistent: contradictions.length === 0,
      contradictions,
    },
    componentByEntity: equality.canonicalIdByEntity,
    reachability,
  };
}

export function analyzeInequalityGraph(
  constraints: readonly ComparisonConstraint[],
  extraEntityIds: readonly string[] = [],
): InequalityGraphAnalysis {
  return prepareGraph(constraints, extraEntityIds).analysis;
}

function relationEvidenceForPreparedGraph(
  prepared: PreparedGraph,
  leftId: string,
  rightId: string,
): PairRelationEvidence {
  if (!prepared.analysis.consistent) {
    throw new Error(
      "Cannot solve a relation from contradictory inequality statements.",
    );
  }
  const leftComponent = prepared.componentByEntity.get(leftId);
  const rightComponent = prepared.componentByEntity.get(rightId);
  if (!leftComponent || !rightComponent) {
    throw new Error(
      `Query references an entity outside the inequality graph: ${leftId}, ${rightId}.`,
    );
  }

  let possibleAtomicRelations: readonly AtomicOrder[];
  let proof: ComparisonProofPath | undefined;
  if (leftComponent === rightComponent) {
    possibleAtomicRelations = ["EQ"];
  } else {
    const forward = prepared.reachability
      .get(leftComponent)
      ?.get(rightComponent);
    const reverse = prepared.reachability
      .get(rightComponent)
      ?.get(leftComponent);
    if (forward?.strictPath) {
      possibleAtomicRelations = ["GT"];
      proof = forward.strictPath;
    } else if (reverse?.strictPath) {
      possibleAtomicRelations = ["LT"];
      proof = reverse.strictPath;
    } else if (forward?.nonStrictPath && reverse?.nonStrictPath) {
      possibleAtomicRelations = ["EQ"];
      proof = forward.nonStrictPath;
    } else if (forward?.nonStrictPath) {
      possibleAtomicRelations = ["EQ", "GT"];
      proof = forward.nonStrictPath;
    } else if (reverse?.nonStrictPath) {
      possibleAtomicRelations = ["LT", "EQ"];
      proof = reverse.nonStrictPath;
    } else {
      possibleAtomicRelations = ["LT", "EQ", "GT"];
    }
  }

  const strongestRelation = strongestDefiniteRelation(possibleAtomicRelations);
  return {
    leftId,
    rightId,
    possibleAtomicRelations,
    isDefinite: strongestRelation !== undefined,
    strongestDefiniteRelation: strongestRelation,
    proofPath: proof,
  };
}

export function solvePairRelation(
  constraints: readonly ComparisonConstraint[],
  leftId: string,
  rightId: string,
): PairRelationEvidence {
  return relationEvidenceForPreparedGraph(
    prepareGraph(constraints, [leftId, rightId]),
    leftId,
    rightId,
  );
}
