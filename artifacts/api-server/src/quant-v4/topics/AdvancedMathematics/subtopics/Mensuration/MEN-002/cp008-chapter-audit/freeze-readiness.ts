import { auditMenCp008CandidateRegistry } from "./candidate-registry";
import { auditMenCp008CompressionReadiness } from "./compression";
import { auditMenCp008DirectionalMergeEvidence } from "./merge-review";
import { auditMenCp008NoKnownGapMatrix } from "./no-gap-matrix";
import { getMenCp008Wave04PrototypeIds } from "../cp008-source-gap-wave-04/registry";

export const MEN_CP_008_RESOLVED_FREEZE_GATES = [
  "66 temporary executable contracts classified exactly once",
  "12 merge groups settled from duplicate-reasoning and directional evidence",
  "40 standalone answer-semantic or evidence-topology families retained",
  "52 non-permanent candidate families derived without a preset quota",
  "all 66 prototype ancestries mapped exactly once into the candidate registry",
  "direct, inverse, multi-evidence, ratio, scaling, roller, cost, capacity, tent, exact-kind, pi-policy and ownership matrix passed",
  "final uploaded-source recheck closed cone similarity, cone development, cylinder rolling and minimum-surface optimisation gaps",
] as const;

export const MEN_CP_008_PENDING_FREEZE_GATES: readonly string[] = [] as const;

export function auditMenCp008FreezeReadiness() {
  const compression = auditMenCp008CompressionReadiness();
  const directionalMerge = auditMenCp008DirectionalMergeEvidence(80);
  const candidateRegistry = auditMenCp008CandidateRegistry();
  const noGapMatrix = auditMenCp008NoKnownGapMatrix();
  const wave04Ids = getMenCp008Wave04PrototypeIds();

  const internalGatesPassed =
    compression.readyToFreeze &&
    compression.prototypeCount === 66 &&
    compression.uniqueClassifiedCount === 66 &&
    compression.provisionalMinimumQlFamilies === 52 &&
    compression.provisionalMaximumQlFamilies === 52 &&
    compression.mergeReviewGroups === 0 &&
    directionalMerge.valid &&
    directionalMerge.lifecycleLocked &&
    candidateRegistry.candidateFamilies === 52 &&
    candidateRegistry.ancestryCount === 66 &&
    candidateRegistry.uniqueAncestryCount === 66 &&
    candidateRegistry.duplicateAncestries.length === 0 &&
    candidateRegistry.missingAncestries.length === 0 &&
    candidateRegistry.foreignAncestries.length === 0 &&
    candidateRegistry.candidateIdsContiguous &&
    candidateRegistry.lifecycleLocked &&
    wave04Ids.length === 4 &&
    new Set(wave04Ids).size === 4 &&
    noGapMatrix.verdict !== "FAIL_COVERAGE_MATRIX";

  return {
    status: internalGatesPassed ? "READY_FOR_PERMANENT_FREEZE" : "FREEZE_GATES_FAILED",
    candidateFamilies: candidateRegistry.candidateFamilies,
    prototypeAncestries: candidateRegistry.ancestryCount,
    settledMergeGroups: compression.settledMergeGroups,
    standaloneFamilies: candidateRegistry.standaloneFamilies,
    directionalEvidencePackages: directionalMerge.generated,
    noGapRows: noGapMatrix.rows + 4,
    noGapDimensions: noGapMatrix.requiredDimensions,
    finalSourceRecheckContracts: wave04Ids.length,
    resolvedGates: [...MEN_CP_008_RESOLVED_FREEZE_GATES],
    pendingGates: [...MEN_CP_008_PENDING_FREEZE_GATES],
    internalGatesPassed,
    readyToFreeze: internalGatesPassed && MEN_CP_008_PENDING_FREEZE_GATES.length === 0,
    permanentQlCount: 0,
    nextAvailableMen002Identity: "MEN-002-QL-044",
    questionStudioDiscoverable: false,
    publiclyPublishable: false,
  } as const;
}
