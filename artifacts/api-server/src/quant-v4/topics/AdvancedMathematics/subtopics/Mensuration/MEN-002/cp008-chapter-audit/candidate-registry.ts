import {
  getMenCp008AllPrototypeIds,
  MEN_CP_008_SETTLED_MERGE_CANDIDATES,
  MEN_CP_008_STANDALONE_CANDIDATES,
  type MenCp008AnyPrototypeId,
} from "./compression";

export interface MenCp008CandidateFamily {
  candidateId: string;
  canonicalKey: string;
  origin: "SETTLED_MERGE_GROUP" | "STANDALONE_CONTRACT";
  ancestries: readonly MenCp008AnyPrototypeId[];
  permanentQlId: null;
  allocationStatus: "CANDIDATE_NOT_FROZEN";
  questionStudioDiscoverable: false;
  publiclyPublishable: false;
}

function candidateId(index: number) {
  return `MEN-CP008-CAND-${String(index + 1).padStart(3, "0")}`;
}

function standaloneKey(prototypeId: MenCp008AnyPrototypeId) {
  return prototypeId
    .replace(/^MEN-CP008-(?:W[123]-)?PROT-/, "")
    .replace(/-/g, "_");
}

export const MEN_CP_008_CANDIDATE_FAMILY_REGISTRY: readonly MenCp008CandidateFamily[] = [
  ...MEN_CP_008_SETTLED_MERGE_CANDIDATES.map((group) => ({
    canonicalKey: group.groupId,
    origin: "SETTLED_MERGE_GROUP" as const,
    ancestries: group.members,
  })),
  ...MEN_CP_008_STANDALONE_CANDIDATES.map((prototypeId) => ({
    canonicalKey: standaloneKey(prototypeId),
    origin: "STANDALONE_CONTRACT" as const,
    ancestries: [prototypeId] as const,
  })),
].map((candidate, index) => ({
  candidateId: candidateId(index),
  canonicalKey: candidate.canonicalKey,
  origin: candidate.origin,
  ancestries: candidate.ancestries,
  permanentQlId: null,
  allocationStatus: "CANDIDATE_NOT_FROZEN" as const,
  questionStudioDiscoverable: false as const,
  publiclyPublishable: false as const,
}));

export function auditMenCp008CandidateRegistry() {
  const allPrototypeIds = getMenCp008AllPrototypeIds();
  const ancestryIds = MEN_CP_008_CANDIDATE_FAMILY_REGISTRY.flatMap(
    (candidate) => candidate.ancestries,
  );
  const duplicateAncestries = ancestryIds.filter(
    (prototypeId, index) => ancestryIds.indexOf(prototypeId) !== index,
  );
  const missingAncestries = allPrototypeIds.filter(
    (prototypeId) => !ancestryIds.includes(prototypeId),
  );
  const foreignAncestries = ancestryIds.filter(
    (prototypeId) => !allPrototypeIds.includes(prototypeId),
  );
  const expectedCandidateIds = MEN_CP_008_CANDIDATE_FAMILY_REGISTRY.map(
    (_candidate, index) => candidateId(index),
  );

  return {
    candidateFamilies: MEN_CP_008_CANDIDATE_FAMILY_REGISTRY.length,
    mergeFamilies: MEN_CP_008_CANDIDATE_FAMILY_REGISTRY.filter(
      (candidate) => candidate.origin === "SETTLED_MERGE_GROUP",
    ).length,
    standaloneFamilies: MEN_CP_008_CANDIDATE_FAMILY_REGISTRY.filter(
      (candidate) => candidate.origin === "STANDALONE_CONTRACT",
    ).length,
    ancestryCount: ancestryIds.length,
    uniqueAncestryCount: new Set(ancestryIds).size,
    duplicateAncestries,
    missingAncestries,
    foreignAncestries,
    uniqueCanonicalKeys:
      new Set(MEN_CP_008_CANDIDATE_FAMILY_REGISTRY.map((candidate) => candidate.canonicalKey)).size,
    candidateIdsContiguous:
      JSON.stringify(MEN_CP_008_CANDIDATE_FAMILY_REGISTRY.map((candidate) => candidate.candidateId)) ===
      JSON.stringify(expectedCandidateIds),
    lifecycleLocked: MEN_CP_008_CANDIDATE_FAMILY_REGISTRY.every(
      (candidate) =>
        candidate.permanentQlId === null &&
        candidate.allocationStatus === "CANDIDATE_NOT_FROZEN" &&
        !candidate.questionStudioDiscoverable &&
        !candidate.publiclyPublishable,
    ),
  };
}
