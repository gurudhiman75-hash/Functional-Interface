import {
  TRG_001_EXTERNAL_MATERIAL_AUDIT_P2,
  TRG_001_EXTERNAL_MATERIAL_OBSERVATIONS_P2,
  type Trg001ExternalAuditObservation,
  type Trg001ExternalAuditVerdict,
} from "./external-material-audit-p2";
import { TRG_001_RY7300_EXTERNAL_OBSERVATIONS_P2 } from "./external-material-rakesh-yadav-p2";

export const TRG_001_EXTERNAL_MATERIAL_ALL_OBSERVATIONS_P2: readonly Trg001ExternalAuditObservation[] = Object.freeze([
  ...TRG_001_EXTERNAL_MATERIAL_OBSERVATIONS_P2,
  ...TRG_001_RY7300_EXTERNAL_OBSERVATIONS_P2,
]);

export const TRG_001_EXTERNAL_MATERIAL_ALL_SUMMARY_P2 = Object.freeze(
  TRG_001_EXTERNAL_MATERIAL_ALL_OBSERVATIONS_P2.reduce<Record<Trg001ExternalAuditVerdict, number>>(
    (acc, row) => {
      acc[row.verdict] += 1;
      return acc;
    },
    {
      DIRECTLY_COVERED: 0,
      COVERED_WITH_VARIATION: 0,
      MISSING_CANDIDATE: 0,
      ROUTE_TO_TRG_002: 0,
      OUT_OF_SCOPE: 0,
    },
  ),
);

function normalizeArchetype(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * Missing constructions supported by more than one independent external source
 * deserve higher audit priority than a one-source oddity. This is still audit
 * evidence only; it cannot authorize production by itself.
 */
export const TRG_001_EXTERNAL_MATERIAL_CROSS_SOURCE_PRIORITY_P2 = Object.freeze({
  version: "TRG001_EXTERNAL_MATERIAL_CROSS_SOURCE_PRIORITY_P2" as const,
  auditAuthority: TRG_001_EXTERNAL_MATERIAL_AUDIT_P2.authority,
  tripleAngle: Object.freeze({
    status: "CROSS_SOURCE_RECURRING_GAP_CANDIDATE" as const,
    evidence: TRG_001_EXTERNAL_MATERIAL_ALL_OBSERVATIONS_P2
      .filter((row) => row.verdict === "MISSING_CANDIDATE")
      .filter((row) => normalizeArchetype(row.archetype).includes("triple angle") || normalizeArchetype(row.archetype).includes("tan 3"))
      .map((row) => Object.freeze({
        sourceId: row.sourceId,
        sourceLocator: row.sourceLocator,
        archetype: row.archetype,
      })),
    requiredAction: "VERIFY_ACTIVE_RUNTIME_THEN_ADD_ONE_CONTROLLED_SSC_TRIPLE_ANGLE_FAMILY_IF_ABSENT" as const,
  }),
  productionPromotionAuthorized: false as const,
  freezeAuthorized: false as const,
  frequencyPromotionAuthorized: false as const,
});
