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
 * Recovered references are recorded separately because they are useful boundary
 * evidence but must not be misrepresented as direct support for a blocked or
 * unapproved CP-001 learner contract.
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
    {
      findingId: "SRC-RECOVERY-CP004-XAT2015-NESTED-COMPONENT-DILUTION",
      freezeCandidateId: "MAL-CP001-FREEZE-UNKNOWN-COMPONENT-QUANTITY",
      sourceLabel:
        "Arun Sharma, How to Prepare for Quantitative Aptitude for CAT, XAT 2015 Product M / raw-material B problem",
      recoveredPattern:
        "A product is built from two nested source mixtures. The amount of a named raw material is reconstructed across both sources, then water is added until that raw material forms 50% of the final mixture; the requested answer is the water added.",
      evidenceStrength: "ANALOGOUS_EXTERNAL",
      ownershipVerdict: "MAL-CP-004",
      clearsCp001SourceBlocker: false,
      rationale:
        "Although the worked solution derives the final total mixture as an intermediate value, the learner must track a named component and conserve it through dilution. The requested unknown is added water, not final total quantity. This is direct CP-004 conserved-solute boundary evidence and cannot admit a CP-001 final-total output template.",
    },
  ] as const;
