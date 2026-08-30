export type TsdCheckpointLifecycle =
  | "SUPERSEDED_INTO_REMODEL"
  | "FROZEN"
  | "PREFREEZE_REVIEW";

export type TsdQlAuthority = "NONE" | "PERMANENT" | "PROVISIONAL";

export type TsdStudioEligibility =
  | "LOCKED_BY_CANONICAL_FREEZE"
  | "GOVERNED_BY_CHECKPOINT_PROOFS"
  | "NOT_AUTHORITATIVE";

export interface TsdCanonicalLifecycleEntry {
  readonly checkpoint: `CP${string}`;
  readonly sourceTree: "TSD-001" | "TSD-002";
  readonly lifecycle: TsdCheckpointLifecycle;
  readonly qlAuthority: TsdQlAuthority;
  readonly canonicalFreezeAuthorityPath: string | null;
  readonly historicalFreezeArtifactPath: string | null;
  readonly studioEligibility: TsdStudioEligibility;
  readonly note: string;
}

/**
 * Canonical lifecycle authority for Time–Speed–Distance.
 *
 * Important distinction:
 * - a ql-allocation.ts file can exist before freeze and therefore does not, by
 *   itself, make the allocated IDs production/freeze authority;
 * - CP001/CP002 historical freeze registries remain in the repository for
 *   audit history but were superseded by the remodeled TSD-001 English freeze;
 * - checkpoint-specific freeze/Studio proofs remain authoritative within a
 *   checkpoint once that checkpoint is classified FROZEN here.
 */
export const TSD_CANONICAL_LIFECYCLE = Object.freeze([
  {
    checkpoint: "CP001",
    sourceTree: "TSD-001",
    lifecycle: "SUPERSEDED_INTO_REMODEL",
    qlAuthority: "NONE",
    canonicalFreezeAuthorityPath: "TSD-001/english-frozen.ts",
    historicalFreezeArtifactPath: "TSD-001/cp001/freeze-registry.ts",
    studioEligibility: "LOCKED_BY_CANONICAL_FREEZE",
    note: "Historical CP001 permanent-QL freeze was reopened and superseded by the remodeled package-level English freeze.",
  },
  {
    checkpoint: "CP002",
    sourceTree: "TSD-001",
    lifecycle: "SUPERSEDED_INTO_REMODEL",
    qlAuthority: "NONE",
    canonicalFreezeAuthorityPath: "TSD-001/english-frozen.ts",
    historicalFreezeArtifactPath: "TSD-001/cp002/freeze-registry.ts",
    studioEligibility: "LOCKED_BY_CANONICAL_FREEZE",
    note: "Historical CP002 permanent-QL freeze was reopened and superseded by the remodeled package-level English freeze.",
  },
  {
    checkpoint: "CP003",
    sourceTree: "TSD-001",
    lifecycle: "FROZEN",
    qlAuthority: "PERMANENT",
    canonicalFreezeAuthorityPath: "TSD-001/cp003/english-frozen.ts",
    historicalFreezeArtifactPath: null,
    studioEligibility: "GOVERNED_BY_CHECKPOINT_PROOFS",
    note: "Checkpoint English freeze is authoritative; localization has its own approved freeze artifact.",
  },
  {
    checkpoint: "CP004",
    sourceTree: "TSD-001",
    lifecycle: "FROZEN",
    qlAuthority: "PERMANENT",
    canonicalFreezeAuthorityPath: "TSD-001/cp004/english-approved-freeze.ts",
    historicalFreezeArtifactPath: null,
    studioEligibility: "GOVERNED_BY_CHECKPOINT_PROOFS",
    note: "Checkpoint English approved freeze is authoritative.",
  },
  {
    checkpoint: "CP005",
    sourceTree: "TSD-001",
    lifecycle: "FROZEN",
    qlAuthority: "PERMANENT",
    canonicalFreezeAuthorityPath: "TSD-001/cp005/english-approved-freeze-v13.ts",
    historicalFreezeArtifactPath: null,
    studioEligibility: "GOVERNED_BY_CHECKPOINT_PROOFS",
    note: "Approved English V13 and native V5 freezes govern the checkpoint.",
  },
  {
    checkpoint: "CP006",
    sourceTree: "TSD-001",
    lifecycle: "FROZEN",
    qlAuthority: "PERMANENT",
    canonicalFreezeAuthorityPath: "TSD-001/cp006/english-approved-freeze-v5.ts",
    historicalFreezeArtifactPath: null,
    studioEligibility: "GOVERNED_BY_CHECKPOINT_PROOFS",
    note: "Approved English V5 and native V7 freezes govern the checkpoint.",
  },
  {
    checkpoint: "CP007",
    sourceTree: "TSD-002",
    lifecycle: "FROZEN",
    qlAuthority: "PERMANENT",
    canonicalFreezeAuthorityPath: "TSD-002/cp007/english-freeze-registry.ts",
    historicalFreezeArtifactPath: null,
    studioEligibility: "GOVERNED_BY_CHECKPOINT_PROOFS",
    note: "English and localization freeze registries are present; Studio behavior is governed by checkpoint proofs.",
  },
  {
    checkpoint: "CP008",
    sourceTree: "TSD-002",
    lifecycle: "FROZEN",
    qlAuthority: "PERMANENT",
    canonicalFreezeAuthorityPath: "TSD-002/cp008/english-freeze-registry.ts",
    historicalFreezeArtifactPath: null,
    studioEligibility: "GOVERNED_BY_CHECKPOINT_PROOFS",
    note: "English and localization freeze registries are present; Studio behavior is governed by checkpoint proofs.",
  },
  {
    checkpoint: "CP009",
    sourceTree: "TSD-002",
    lifecycle: "FROZEN",
    qlAuthority: "PERMANENT",
    canonicalFreezeAuthorityPath: "TSD-002/cp009/english-freeze-registry.ts",
    historicalFreezeArtifactPath: null,
    studioEligibility: "GOVERNED_BY_CHECKPOINT_PROOFS",
    note: "English and localization freeze registries are present; Studio behavior is governed by checkpoint proofs.",
  },
  {
    checkpoint: "CP010",
    sourceTree: "TSD-002",
    lifecycle: "PREFREEZE_REVIEW",
    qlAuthority: "PROVISIONAL",
    canonicalFreezeAuthorityPath: null,
    historicalFreezeArtifactPath: null,
    studioEligibility: "NOT_AUTHORITATIVE",
    note: "QL allocation and Studio candidate files are pre-freeze scaffold only; the registration proof explicitly keeps production registration locked.",
  },
  {
    checkpoint: "CP011",
    sourceTree: "TSD-002",
    lifecycle: "PREFREEZE_REVIEW",
    qlAuthority: "PROVISIONAL",
    canonicalFreezeAuthorityPath: null,
    historicalFreezeArtifactPath: null,
    studioEligibility: "NOT_AUTHORITATIVE",
    note: "Review/candidate artifacts exist, but no checkpoint freeze registry exists yet.",
  },
  {
    checkpoint: "CP012",
    sourceTree: "TSD-002",
    lifecycle: "PREFREEZE_REVIEW",
    qlAuthority: "PROVISIONAL",
    canonicalFreezeAuthorityPath: null,
    historicalFreezeArtifactPath: null,
    studioEligibility: "NOT_AUTHORITATIVE",
    note: "Current executable/review candidate remains pre-freeze; provisional IDs do not constitute freeze authority.",
  },
] as const satisfies readonly TsdCanonicalLifecycleEntry[]);

export const TSD_CANONICAL_REMODEL_AUTHORITY = Object.freeze({
  packageId: "TSD-001",
  checkpointCoverage: Object.freeze(["CP001", "CP002"] as const),
  authorityPath: "TSD-001/english-frozen.ts",
  permanentQLs: 0,
  nextPermanentQL: null,
  questionStudioLocked: true,
  historicalFreezeRegistriesRemainAuditOnly: true,
} as const);

export function getTsdCanonicalLifecycle(checkpoint: TsdCanonicalLifecycleEntry["checkpoint"]): TsdCanonicalLifecycleEntry {
  const entry = TSD_CANONICAL_LIFECYCLE.find((candidate) => candidate.checkpoint === checkpoint);
  if (!entry) throw new Error(`Unknown TSD checkpoint lifecycle: ${checkpoint}`);
  return entry;
}
