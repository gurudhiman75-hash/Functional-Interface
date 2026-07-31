import { auditMenCp008CandidateRegistry } from "./candidate-registry";
import { auditMenCp008CompressionReadiness } from "./compression";
import { auditMenCp008DirectionalMergeEvidence } from "./merge-review";
import { auditMenCp008NoKnownGapMatrix } from "./no-gap-matrix";

export const MEN_CP_008_RESOLVED_FREEZE_GATES = [
  "62 temporary executable contracts classified exactly once",
  "12 merge groups settled from duplicate-reasoning and directional evidence",
  "36 standalone answer-semantic or evidence-topology families retained",
  "48 non-permanent candidate families derived without a preset quota",
  "all 62 prototype ancestries mapped exactly once into the candidate registry",
  "direct, inverse, multi-evidence, ratio, scaling, roller, cost, capacity, tent, exact-kind, pi-policy and ownership matrix passed",
] as const;

export const MEN_CP_008_PENDING_FREEZE_GATES = [
  "FINAL_UPLOADED_SOURCE_RETRIEVAL_RECHECK",
] as const;

export function auditMenCp008FreezeReadiness() {
  const compression = auditMenCp008CompressionReadiness();
  const directionalMerge = auditMenCp008DirectionalMergeEvidence(80);
  const candidateRegistry = auditMenCp008CandidateRegistry();
  const noGapMatrix = auditMenCp008NoKnownGapMatrix();

  const internalGatesPassed =
    compression.prototypeCount === 62 &&
    compression.uniqueClassifiedCount === 62 &&
    compression.provisionalMinimumQlFamilies === 48 &&
    compression.provisionalMaximumQlFamilies === 48 &&
    compression.mergeReviewGroups === 0 &&
    directionalMerge.valid &&
    directionalMerge.lifecycleLocked &&
    candidateRegistry.candidateFamilies === 48 &&
    candidateRegistry.ancestryCount === 62 &&
    candidateRegistry.uniqueAncestryCount === 62 &&
    candidateRegistry.duplicateAncestries.length === 0 &&
    candidateRegistry.missingAncestries.length === 0 &&
    candidateRegistry.foreignAncestries.length === 0 &&
    candidateRegistry.candidateIdsContiguous &&
    candidateRegistry.lifecycleLocked &&
    noGapMatrix.verdict === "PASS_NO_KNOWN_CP008_GAP_SOURCE_RECHECK_PENDING";

  return {
    status: internalGatesPassed
      ? "INTERNAL_FREEZE_GATES_PASSED_SOURCE_RECHECK_PENDING"
      : "INTERNAL_FREEZE_GATES_FAILED",
    candidateFamilies: candidateRegistry.candidateFamilies,
    prototypeAncestries: candidateRegistry.ancestryCount,
    settledMergeGroups: compression.settledMergeGroups,
    standaloneFamilies: candidateRegistry.standaloneFamilies,
    directionalEvidencePackages: directionalMerge.generated,
    noGapRows: noGapMatrix.rows,
    noGapDimensions: noGapMatrix.requiredDimensions,
    resolvedGates: [...MEN_CP_008_RESOLVED_FREEZE_GATES],
    pendingGates: [...MEN_CP_008_PENDING_FREEZE_GATES],
    internalGatesPassed,
    readyToFreeze:
      internalGatesPassed && MEN_CP_008_PENDING_FREEZE_GATES.length === 0,
    permanentQlCount: 0,
    nextAvailableMen002Identity: "MEN-002-QL-044",
    questionStudioDiscoverable: false,
    publiclyPublishable: false,
  } as const;
}
