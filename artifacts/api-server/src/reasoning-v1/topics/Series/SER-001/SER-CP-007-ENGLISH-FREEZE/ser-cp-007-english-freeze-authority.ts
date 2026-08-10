import {
  SER_CP007_AUTHORITY_CANDIDATE_V1,
  serCp007AuthorityCandidateV1Metadata,
  type SerCp007AuthorityCandidateV1Metadata,
  type SerCp007DiscoveryWaveId,
} from "../SER-CP-007-AUTHORITY-FREEZE-CANDIDATE/authority-candidate-v1";
import {
  SER_CP007_CANDIDATE_13_MAP,
  SER_CP007_TEMPLATE_PROBES_V71,
} from "../SER-CP-007-AUTHORITY-FREEZE-CANDIDATE/authority-compression-contract-v7-1";
import {
  SER_CP007_AUTHORITY_TO_PERMANENT_QL,
  SER_PERMANENT_QL_BY_AUTHORITY,
  type SerCp007PermanentQlId,
  type SerPermanentQlRegistryEntry,
} from "../SER-PERMANENT-QL-REGISTRY";

export const SER_CP007_ENGLISH_FREEZE_AUTHORITY =
  "SER_CP007_ENGLISH_FREEZE_AUTHORITY_V1" as const;

export type SerCp007EnglishFreezeStatus =
  | "ENGLISH_MANUAL_FREEZE_APPROVED"
  | "PERMANENT_ID_ALLOCATED_INACTIVE";

export interface SerCp007FrozenTemplateAuthority
  extends Omit<
    SerCp007AuthorityCandidateV1Metadata,
    "permanentQlId" | "freezeApproved"
  > {
  readonly freezeAuthority: typeof SER_CP007_ENGLISH_FREEZE_AUTHORITY;
  readonly temporaryTemplateId: string;
  readonly editorialTaskKind: string;
  readonly permanentQlId: SerCp007PermanentQlId;
  readonly freezeApproved: true;
  readonly englishStatus: "ENGLISH_MANUAL_FREEZE_APPROVED";
  readonly allocationStatus: "PERMANENT_ID_ALLOCATED_INACTIVE";
  readonly approvalDate: "2026-08-07";
  readonly registryEntry: SerPermanentQlRegistryEntry;
  readonly active: false;
  readonly questionStudioDiscoverable: false;
  readonly questionBankWritable: false;
  readonly testEligible: false;
  readonly publiclyPublishable: false;
}

function discoveryWaveId(
  waveId: (typeof SER_CP007_TEMPLATE_PROBES_V71)[number]["waveId"],
): SerCp007DiscoveryWaveId {
  switch (waveId) {
    case "WAVE_A":
      return "SER-CP-007-WAVE-A";
    case "WAVE_B":
      return "SER-CP-007-WAVE-B";
    case "WAVE_C":
      return "SER-CP-007-WAVE-C";
    case "WAVE_D":
      return "SER-CP-007-WAVE-D";
    case "WAVE_E":
      return "SER-CP-007-WAVE-E";
  }
}

export const SER_CP007_FROZEN_TEMPLATE_AUTHORITIES: readonly SerCp007FrozenTemplateAuthority[] =
  Object.freeze(
    SER_CP007_TEMPLATE_PROBES_V71.map((probe) => {
      const historical = serCp007AuthorityCandidateV1Metadata({
        migrationSourceAuthorityId: probe.originalAuthorityId,
        discoveryWaveId: discoveryWaveId(probe.waveId),
        sourceRuleId: probe.sourceRuleId,
      });
      const approvedAuthorityId =
        SER_CP007_CANDIDATE_13_MAP[probe.originalAuthorityId];
      if (historical.candidateVersion !== SER_CP007_AUTHORITY_CANDIDATE_V1) {
        throw new Error(
          `Unexpected Series candidate version for ${probe.temporaryTemplateId}.`,
        );
      }
      if (historical.candidateAuthorityId !== approvedAuthorityId) {
        throw new Error(
          `Series authority mismatch for ${probe.temporaryTemplateId}: ${historical.candidateAuthorityId} != ${approvedAuthorityId}.`,
        );
      }
      if (historical.permanentQlId !== null || historical.freezeApproved) {
        throw new Error(
          `Historical Series candidate evidence was mutated for ${probe.temporaryTemplateId}.`,
        );
      }

      const permanentQlId =
        SER_CP007_AUTHORITY_TO_PERMANENT_QL[approvedAuthorityId];
      const registryEntry = SER_PERMANENT_QL_BY_AUTHORITY[approvedAuthorityId];
      if (registryEntry.permanentQlId !== permanentQlId) {
        throw new Error(
          `Series registry mismatch for ${probe.temporaryTemplateId}.`,
        );
      }

      return Object.freeze({
        ...historical,
        freezeAuthority: SER_CP007_ENGLISH_FREEZE_AUTHORITY,
        temporaryTemplateId: probe.temporaryTemplateId,
        editorialTaskKind: probe.taskKind,
        permanentQlId,
        freezeApproved: true as const,
        englishStatus: "ENGLISH_MANUAL_FREEZE_APPROVED" as const,
        allocationStatus: "PERMANENT_ID_ALLOCATED_INACTIVE" as const,
        approvalDate: "2026-08-07" as const,
        registryEntry,
        active: false as const,
        questionStudioDiscoverable: false as const,
        questionBankWritable: false as const,
        testEligible: false as const,
        publiclyPublishable: false as const,
      });
    }),
  );

export const SER_CP007_FROZEN_TEMPLATE_BY_ID: Readonly<
  Record<string, SerCp007FrozenTemplateAuthority>
> = Object.freeze(
  Object.fromEntries(
    SER_CP007_FROZEN_TEMPLATE_AUTHORITIES.map((entry) => [
      entry.temporaryTemplateId,
      entry,
    ]),
  ),
);

export const SER_CP007_ENGLISH_FREEZE_STATE = Object.freeze({
  approvalDate: "2026-08-07" as const,
  approvedAuthorityCount: 13,
  frozenPrototypeTemplateCount: SER_CP007_FROZEN_TEMPLATE_AUTHORITIES.length,
  allocatedPermanentQlRange: "SER-QL-001..SER-QL-013" as const,
  nextAvailablePermanentQlId: "SER-QL-014" as const,
  activePermanentQlCount: 0,
  localizationStatus: "NOT_STARTED" as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});

if (SER_CP007_FROZEN_TEMPLATE_AUTHORITIES.length !== 140) {
  throw new Error("SER-CP-007 English freeze must preserve all 140 templates.");
}
