import type { MalCp001FreezeCandidateId } from "./cp001-freeze-candidate-ledger";

export type MalCp001RecoveredBoundaryOwner =
  | "MAL-CP-001"
  | "MAL-CP-002"
  | "MAL-CP-004"
  | "MAL-CP-006";

export interface MalCp001SourceRecoveryFinding {
  findingId: string;
  freezeCandidateId: MalCp001FreezeCandidateId;
  sourceLabel: string;
  recoveredPattern: string;
  evidenceStrength: "ANALOGOUS_EXTERNAL";
  ownershipVerdict: MalCp001RecoveredBoundaryOwner;
  clearsCp001SourceBlocker: false;
  rationale: string;
}

/**
 * The recovered reference is recorded separately because it is useful boundary
 * evidence but must not be misrepresented as direct support for the blocked
 * CP-001 weighted-mean candidate.
 */
export const MAL_CP001_SOURCE_RECOVERY_FINDINGS:
  readonly MalCp001SourceRecoveryFinding[] = [
    {
      findingId: "SRC-RECOVERY-CP001-THREE-VARIETY-RATIO-ADJUSTMENT",
      freezeCandidateId: "MAL-CP001-FREEZE-THREE-WAY-RELATION-QUANTITY",
      sourceLabel:
        "R.S. Aggarwal Quantitative Aptitude, three-variety tea worked example (P.C.S. 2006)",
      recoveredPattern:
        "Three component quantities begin in one ratio; stated additions change the three-way ratio, and the final amount of the third component is requested.",
      evidenceStrength: "ANALOGOUS_EXTERNAL",
      ownershipVerdict: "MAL-CP-002",
      clearsCp001SourceBlocker: false,
      rationale:
        "The source proves that coupled three-component quantity relations occur in competitive-exam material, but its decisive invariant is ratio adjustment after additions. It does not contain three per-unit source values plus a target weighted mean, so it belongs to the CP-002 adjustment boundary and cannot clear the CP-001 allocation blocker.",
    },
  ] as const;
