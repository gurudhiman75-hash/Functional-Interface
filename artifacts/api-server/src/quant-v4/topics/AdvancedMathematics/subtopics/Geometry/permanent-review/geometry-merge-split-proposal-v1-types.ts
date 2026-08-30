import { GEO_TEMPORARY_CANDIDATE_REGISTRY_V1 } from "./geometry-temporary-candidate-registry-v1";

export interface GeometryMergeSplitFamilyProposalV1 {
  readonly proposalKey: string;
  readonly cpId: string;
  readonly learnerDecision: string;
  readonly candidateIds: readonly string[];
  readonly solveModes: readonly string[];
  readonly mergeRationale: string;
  readonly permanentQlId: null;
  readonly allocationAuthorized: false;
}

const candidateById = new Map(GEO_TEMPORARY_CANDIDATE_REGISTRY_V1.map((candidate) => [candidate.temporaryPrototypeId, candidate] as const));

export function defineGeometryMergeSplitFamilyV1(
  input: Omit<GeometryMergeSplitFamilyProposalV1, "solveModes" | "permanentQlId" | "allocationAuthorized">,
): GeometryMergeSplitFamilyProposalV1 {
  const solveModes = Object.freeze(input.candidateIds.map((candidateId) => {
    const candidate = candidateById.get(candidateId);
    if (!candidate) throw new Error(`Unknown Geometry temporary candidate in merge/split proposal: ${candidateId}`);
    if (candidate.cpId !== input.cpId) throw new Error(`${input.proposalKey} mixes ${candidate.cpId} into ${input.cpId}`);
    return candidate.solveMode;
  }));
  return Object.freeze({ ...input, solveModes, permanentQlId: null, allocationAuthorized: false });
}
