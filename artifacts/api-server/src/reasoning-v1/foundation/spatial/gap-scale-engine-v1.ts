import { SPATIAL_GAP_AUTHORITY_V1 } from "./gap-authority-v1";
import { generateSpatialGapRuntimeCandidateV1 } from "./gap-proof-generator-v1";
import {
  SPATIAL_GAP_IDS_V1,
  SPATIAL_GAP_LIFECYCLE_LOCK_V1,
  type SpatialGapCapabilityIdV1,
  type SpatialGapIdV1,
  type SpatialGapRuntimeScaleRequestV1,
  type SpatialGapRuntimeScaleResultV1,
} from "./gap-types-v1";
import { validateSpatialScene } from "./validator";

export const SPATIAL_GAP_CAPABILITY_IDS_V1: readonly SpatialGapCapabilityIdV1[] = [
  "SELECTED_RIGID_TRANSFORM",
  "SELECTED_SCALE",
  "POSITION_CYCLE",
  "HIERARCHY_TRANSFER",
  "FILL_STATE_MUTATION",
  "COUNT_MUTATION",
  "NODE_SUBSTITUTION",
  "ROTATION_ORBIT_EQUIVALENCE",
  "GENERAL_RELATION_EVALUATION",
  "SUBFIGURE_TRANSFORM_RELATION",
  "PIPELINE_COMPOSITION",
  "ALTERNATING_PIPELINE",
] as const;

function zeroGapCounts(): Record<SpatialGapIdV1, number> {
  return Object.fromEntries(SPATIAL_GAP_IDS_V1.map((gapId) => [gapId, 0])) as Record<SpatialGapIdV1, number>;
}

function zeroCapabilityCounts(): Record<SpatialGapCapabilityIdV1, number> {
  return Object.fromEntries(SPATIAL_GAP_CAPABILITY_IDS_V1.map((capabilityId) => [capabilityId, 0])) as Record<SpatialGapCapabilityIdV1, number>;
}

export function synthesizeSpatialGapRuntimeScaleV1(
  request: SpatialGapRuntimeScaleRequestV1,
): SpatialGapRuntimeScaleResultV1 {
  if (!request.seedPrefix.trim()) throw new Error("Spatial gap scale proof requires a non-empty seed prefix.");
  if (!Number.isInteger(request.requestedPerGap) || request.requestedPerGap <= 0) {
    throw new Error("Spatial gap scale requestedPerGap must be a positive integer.");
  }
  if (SPATIAL_GAP_AUTHORITY_V1.length !== SPATIAL_GAP_IDS_V1.length) {
    throw new Error("Spatial gap authority and audited gap ID count diverged.");
  }

  const accepted = [] as SpatialGapRuntimeScaleResultV1["accepted"] extends readonly (infer T)[] ? T[] : never;
  const gapCounts = zeroGapCounts();
  const capabilityCounts = zeroCapabilityCounts();
  const globalContentFingerprints = new Set<string>();

  for (const gapId of SPATIAL_GAP_IDS_V1) {
    const perGapFingerprints = new Set<string>();
    for (let index = 0; index < request.requestedPerGap; index += 1) {
      const seed = `${request.seedPrefix}:${gapId}:${String(index).padStart(4, "0")}`;
      const candidate = generateSpatialGapRuntimeCandidateV1(gapId, seed);
      for (const scene of candidate.scenes) {
        const validation = validateSpatialScene(scene);
        if (!validation.ok) {
          throw new Error(`${gapId}/${seed}: scene '${scene.id}' failed validation: ${validation.errors.map((issue) => issue.code).join(",")}.`);
        }
      }
      if (candidate.proofChecks.some((proofCheck) => !proofCheck.pass)) {
        throw new Error(`${gapId}/${seed}: a gap proof check failed after candidate construction.`);
      }
      if (perGapFingerprints.has(candidate.contentFingerprint)) {
        throw new Error(`${gapId}: duplicate content fingerprint at seed '${seed}'.`);
      }
      if (globalContentFingerprints.has(candidate.contentFingerprint)) {
        throw new Error(`Cross-gap duplicate content fingerprint at ${gapId}/${seed}.`);
      }
      perGapFingerprints.add(candidate.contentFingerprint);
      globalContentFingerprints.add(candidate.contentFingerprint);
      gapCounts[gapId] += 1;
      for (const capabilityId of candidate.capabilityIds) {
        capabilityCounts[capabilityId] += 1;
      }
      accepted.push(candidate);
    }
  }

  return {
    version: "SPA-FND-001-GAP-RUNTIME-SCALE-V1",
    seedPrefix: request.seedPrefix,
    requestedPerGap: request.requestedPerGap,
    totalAccepted: accepted.length,
    accepted,
    gapCounts,
    capabilityCounts,
    lifecycle: { ...SPATIAL_GAP_LIFECYCLE_LOCK_V1 },
  };
}
