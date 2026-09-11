import { causalPath, hasCommonCause, hasDirectEdge, nodeById, solveCaeRelationship, validateCaeCausalWorld } from "./causal-solver.ts";
import { CAE_001_CAUSAL_WORLDS, CAE_001_PROJECTION_AUTHORITIES } from "./causal-world-authorities.ts";
import type { CaeCausalWorld, CaeProjectionAuthority, CaeQlId } from "./types.ts";

const EXPECTED_OWNERSHIP: Readonly<Record<CaeQlId, readonly [CaeProjectionAuthority["checkpointId"], CaeProjectionAuthority["kind"]]>> = {
  "CAE-QL-001": ["CAE-CP-001", "DIRECT_RELATIONSHIP"],
  "CAE-QL-002": ["CAE-CP-002", "COMMON_OR_INDEPENDENT"],
  "CAE-QL-003": ["CAE-CP-003", "PROBABLE_CAUSE"],
  "CAE-QL-004": ["CAE-CP-004", "PROBABLE_EFFECT"],
  "CAE-QL-005": ["CAE-CP-005", "COMPETING_EXPLANATION"],
  "CAE-QL-006": ["CAE-CP-006", "INDIRECT_CAUSAL_CHAIN"],
  "CAE-QL-007": ["CAE-CP-007", "CORRELATION_CHECK"],
  "CAE-QL-008": ["CAE-CP-008", "MULTI_EVENT_SEQUENCE"],
  "CAE-QL-009": ["CAE-CP-009", "MISSING_CAUSAL_LINK"],
};

function worldFor(worlds: readonly CaeCausalWorld[], id: string): CaeCausalWorld | undefined {
  return worlds.find((world) => world.id === id);
}

function globalNodeExists(worlds: readonly CaeCausalWorld[], nodeId: string): boolean {
  return worlds.some((world) => world.nodes.some((node) => node.id === nodeId));
}

function belongsToWorld(world: CaeCausalWorld, nodeId: string): boolean {
  return world.nodes.some((node) => node.id === nodeId);
}

function validateCandidateProjection(projection: CaeProjectionAuthority, world: CaeCausalWorld, issues: string[]) {
  if (!projection.targetNodeId || !projection.correctNodeId || !projection.candidateNodeIds) {
    issues.push(`${projection.id}: target, correct candidate, and candidates are required.`);
    return;
  }
  if (!projection.candidateNodeIds.includes(projection.correctNodeId)) issues.push(`${projection.id}: correct candidate is not displayed.`);
  const wrongCandidates = projection.candidateNodeIds.filter((candidate) => candidate !== projection.correctNodeId);
  if (projection.kind === "PROBABLE_CAUSE" || projection.kind === "COMPETING_EXPLANATION") {
    const correctPath = causalPath(world, projection.correctNodeId, projection.targetNodeId);
    if (!correctPath || correctPath.length < 2) issues.push(`${projection.id}: declared cause does not reach the observed event.`);
    for (const candidate of wrongCandidates.filter((id) => belongsToWorld(world, id))) {
      if (causalPath(world, candidate, projection.targetNodeId)) issues.push(`${projection.id}: '${candidate}' is also a graph-supported cause, creating ambiguity.`);
    }
  }
  if (projection.kind === "PROBABLE_EFFECT") {
    const correctPath = causalPath(world, projection.targetNodeId, projection.correctNodeId);
    if (!correctPath || correctPath.length !== 2) issues.push(`${projection.id}: declared immediate effect is not a direct graph effect.`);
    for (const candidate of wrongCandidates.filter((id) => belongsToWorld(world, id))) {
      if (hasDirectEdge(world, projection.targetNodeId, candidate)) issues.push(`${projection.id}: '${candidate}' is another direct effect, creating ambiguity.`);
    }
  }
}

export function validateCaeEngineAuthorities(
  worlds: readonly CaeCausalWorld[] = CAE_001_CAUSAL_WORLDS,
  projections: readonly CaeProjectionAuthority[] = CAE_001_PROJECTION_AUTHORITIES,
): readonly string[] {
  const issues: string[] = [];
  const worldIds = new Set<string>();
  const globalNodeIds = new Set<string>();
  for (const world of worlds) {
    if (worldIds.has(world.id)) issues.push(`${world.id}: duplicate causal world id.`);
    worldIds.add(world.id);
    for (const node of world.nodes) {
      if (globalNodeIds.has(node.id)) issues.push(`${world.id}/${node.id}: node ids must be globally unique.`);
      globalNodeIds.add(node.id);
    }
    issues.push(...validateCaeCausalWorld(world));
  }

  const projectionIds = new Set<string>();
  const coveredQls = new Set<CaeQlId>();
  for (const projection of projections) {
    if (projectionIds.has(projection.id)) issues.push(`${projection.id}: duplicate projection id.`);
    projectionIds.add(projection.id);
    coveredQls.add(projection.qlId);
    const world = worldFor(worlds, projection.worldId);
    if (!world) {
      issues.push(`${projection.id}: unknown causal world '${projection.worldId}'.`);
      continue;
    }
    const [checkpointId, kind] = EXPECTED_OWNERSHIP[projection.qlId];
    if (projection.checkpointId !== checkpointId || projection.kind !== kind) issues.push(`${projection.id}: QL ownership mismatch.`);
    for (const nodeId of projection.displayedNodeIds) {
      if (!belongsToWorld(world, nodeId)) issues.push(`${projection.id}: displayed node '${nodeId}' is absent from its world.`);
    }
    for (const nodeId of projection.candidateNodeIds ?? []) {
      if (!globalNodeExists(worlds, nodeId)) issues.push(`${projection.id}: candidate node '${nodeId}' is unknown.`);
    }

    if (projection.kind === "DIRECT_RELATIONSHIP" || projection.kind === "COMMON_OR_INDEPENDENT") {
      if (projection.displayedNodeIds.length !== 2 || !projection.expectedRelationship) {
        issues.push(`${projection.id}: relationship projection needs two events and an expected relationship.`);
      } else {
        const solved = solveCaeRelationship(world, projection.displayedNodeIds[0]!, projection.displayedNodeIds[1]!);
        if (solved !== projection.expectedRelationship) issues.push(`${projection.id}: solver returned ${solved}, expected ${projection.expectedRelationship}.`);
        if (projection.kind === "DIRECT_RELATIONSHIP" && solved !== "FIRST_DIRECT_CAUSES_SECOND" && solved !== "SECOND_DIRECT_CAUSES_FIRST") issues.push(`${projection.id}: direct checkpoint contains a non-direct relationship.`);
        if (projection.kind === "COMMON_OR_INDEPENDENT" && !["COMMON_CAUSE", "INDEPENDENT_CAUSES", "INDEPENDENT_EFFECTS"].includes(solved)) issues.push(`${projection.id}: CP-002 contains the wrong relationship family.`);
      }
    }

    if (["PROBABLE_CAUSE", "PROBABLE_EFFECT", "COMPETING_EXPLANATION"].includes(projection.kind)) {
      validateCandidateProjection(projection, world, issues);
    }

    if (projection.kind === "INDIRECT_CAUSAL_CHAIN") {
      const path = causalPath(world, projection.displayedNodeIds[0]!, projection.displayedNodeIds[1]!);
      if (!path || path.length < 3) issues.push(`${projection.id}: indirect-cause projection lacks a hidden causal bridge.`);
      if (projection.expectedRelationship !== solveCaeRelationship(world, projection.displayedNodeIds[0]!, projection.displayedNodeIds[1]!)) issues.push(`${projection.id}: indirect relationship disagrees with solver.`);
    }

    if (projection.kind === "CORRELATION_CHECK") {
      const [first, second] = projection.displayedNodeIds;
      if (!first || !second || causalPath(world, first, second) || causalPath(world, second, first) || hasCommonCause(world, first, second)) {
        issues.push(`${projection.id}: correlation pair must have no causal path or common cause.`);
      }
    }

    if (projection.kind === "MULTI_EVENT_SEQUENCE") {
      const sequence = projection.sequenceNodeIds ?? [];
      if (sequence.length < 3 || sequence.some((nodeId, index) => index > 0 && !hasDirectEdge(world, sequence[index - 1]!, nodeId))) {
        issues.push(`${projection.id}: declared causal sequence is not a chain of direct edges.`);
      }
    }

    if (projection.kind === "MISSING_CAUSAL_LINK") {
      const source = projection.displayedNodeIds[0];
      const middle = projection.missingLinkNodeId;
      const target = projection.targetNodeId;
      if (!source || !middle || !target || !hasDirectEdge(world, source, middle) || !hasDirectEdge(world, middle, target)) {
        issues.push(`${projection.id}: missing-link projection must contain an unambiguous two-edge bridge.`);
      }
    }
  }

  for (const qlId of Object.keys(EXPECTED_OWNERSHIP) as CaeQlId[]) {
    if (!coveredQls.has(qlId)) issues.push(`${qlId}: no projection authority is available.`);
  }
  return issues;
}
