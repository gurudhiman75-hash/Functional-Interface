import {
  SYL_CANONICAL_ARCHETYPES_V1,
  SYL_LEGACY_QL_COMPATIBILITY_V1,
  type SylCanonicalArchetypeV1,
} from "./ql-archetype-consolidation-v1";

export const SYL_CANONICAL_ARCHETYPES_V2: readonly SylCanonicalArchetypeV1[] = Object.freeze(
  SYL_CANONICAL_ARCHETYPES_V1.map((entry) => {
    if (entry.archetypeId !== "SYL-A-FOUR-OPTION-THREE-CONCLUSION") return entry;
    return {
      ...entry,
      mockProfiles: ["BANKING", "CROSS_EXAM", "PUNJAB_POLICE"] as const,
      sourceSnapshotIds: [
        "SYL-SNAPSHOT-BANK-RBI-GRADE-B-2026",
        "SYL-SNAPSHOT-BANK-NABARD-2026",
        "SYL-SNAPSHOT-CROSS-JIPMAT-2026",
        "SYL-SNAPSHOT-PUNJAB-POLICE-2023-2025-V1",
      ],
    };
  }),
);

export const SYL_QL_ARCHETYPE_CONSOLIDATION_V2 = Object.freeze({
  authorityId: "SYL_001_QL_ARCHETYPE_CONSOLIDATION_V2",
  status: "COMPATIBILITY_OVERLAY_NOT_ACTIVE",
  supersedes: "SYL_001_QL_ARCHETYPE_CONSOLIDATION_V1",
  canonicalArchetypeCount: SYL_CANONICAL_ARCHETYPES_V2.length,
  legacyQlCount: SYL_LEGACY_QL_COMPATIBILITY_V1.length,
  correction: "Banking is an authorised profile for the four-option three-conclusion archetype.",
  activationPermitted: false,
});

export { SYL_LEGACY_QL_COMPATIBILITY_V1 as SYL_LEGACY_QL_COMPATIBILITY_V2 };
