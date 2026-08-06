import type { MalCp002PermanentQlId } from "./cp002-permanent-runtime";

export type MalCp002CompletionDisposition =
  | "COVERED_BY_PERMANENT_QL"
  | "EXCLUDED_TO_CP001"
  | "EXCLUDED_TO_CP003"
  | "EXCLUDED_TO_CP004"
  | "EXCLUDED_TO_RAP"
  | "EXCLUDED_SOURCE_THIN"
  | "NON_UNIQUE_WITHOUT_MORE_EVIDENCE";

export interface MalCp002CompletionRow {
  contractId: string;
  disposition: MalCp002CompletionDisposition;
  qlIds: readonly MalCp002PermanentQlId[];
  rationale: string;
}

/**
 * Final closure of the open CP-002 coverage matrix. This is an ownership and
 * executable-coverage ledger, not permission to absorb CP-003/CP-004/RAP work.
 */
export const MAL_CP002_COMPLETION_LEDGER:
  readonly MalCp002CompletionRow[] = [
    { contractId: "CP002-COV-EXPLICIT-ADD-TO-TARGET", disposition: "COVERED_BY_PERMANENT_QL", qlIds: ["MAL-QL-012"], rationale: "Explicit-state inverse addition is executable and independently verified." },
    { contractId: "CP002-COV-EXPLICIT-REMOVE-TO-TARGET", disposition: "COVERED_BY_PERMANENT_QL", qlIds: ["MAL-QL-013"], rationale: "Pure removal is explicit and keeps the counterpart fixed." },
    { contractId: "CP002-COV-FORWARD-AFTER-ADD", disposition: "COVERED_BY_PERMANENT_QL", qlIds: ["MAL-QL-014"], rationale: "Forward pure addition is covered." },
    { contractId: "CP002-COV-FORWARD-AFTER-PURE-REMOVAL", disposition: "COVERED_BY_PERMANENT_QL", qlIds: ["MAL-QL-015"], rationale: "Forward pure removal is covered." },
    { contractId: "CP002-COV-REVERSE-BEFORE-ADDITION", disposition: "COVERED_BY_PERMANENT_QL", qlIds: ["MAL-QL-016"], rationale: "Original ratio is reconstructed by undoing the addition." },
    { contractId: "CP002-COV-REVERSE-BEFORE-REMOVAL", disposition: "COVERED_BY_PERMANENT_QL", qlIds: ["MAL-QL-017"], rationale: "Original ratio is reconstructed by undoing the removal." },
    { contractId: "CP002-COV-TOTAL-AND-RATIO-PARTITION", disposition: "COVERED_BY_PERMANENT_QL", qlIds: ["MAL-QL-018"], rationale: "Both component quantities are recovered from total and ratio." },
    { contractId: "CP002-COV-SINGLE-REMOVE-REFILL-INVERSE", disposition: "COVERED_BY_PERMANENT_QL", qlIds: ["MAL-QL-019"], rationale: "One-stage replacement is retained as the audited CP-002/CP-003 boundary." },
    { contractId: "CP002-GAP-TOTAL-RATIO-ADD-TO-TARGET", disposition: "COVERED_BY_PERMANENT_QL", qlIds: ["MAL-QL-020"], rationale: "Total-and-ratio evidence is normalized before the addition equation." },
    { contractId: "CP002-GAP-TOTAL-RATIO-REMOVE-TO-TARGET", disposition: "COVERED_BY_PERMANENT_QL", qlIds: ["MAL-QL-021"], rationale: "Total-and-ratio evidence is normalized before the removal equation." },
    { contractId: "CP002-GAP-ONE-COMPONENT-AND-RATIO-STATE", disposition: "COVERED_BY_PERMANENT_QL", qlIds: ["MAL-QL-022"], rationale: "The known component fixes the ratio scale." },
    { contractId: "CP002-GAP-RATIO-DIFFERENCE-STATE", disposition: "EXCLUDED_TO_RAP", qlIds: [], rationale: "Ratio plus difference without an essential mixture operation remains Ratio and Proportion." },
    { contractId: "CP002-GAP-ORIGINAL-TOTAL-FROM-ADD-RATIO-SHIFT", disposition: "COVERED_BY_PERMANENT_QL", qlIds: ["MAL-QL-023"], rationale: "The unchanged component links original and final ratio scales." },
    { contractId: "CP002-GAP-ORIGINAL-TOTAL-FROM-REMOVAL-RATIO-SHIFT", disposition: "COVERED_BY_PERMANENT_QL", qlIds: ["MAL-QL-024"], rationale: "The known removal fixes the original scale." },
    { contractId: "CP002-GAP-SINGLE-REMOVE-REFILL-FORWARD", disposition: "COVERED_BY_PERMANENT_QL", qlIds: ["MAL-QL-025"], rationale: "One-stage proportional retention and pure refill are simulated forward." },
    { contractId: "CP002-GAP-HOMOGENEOUS-REMOVAL-RATIO-INVARIANCE", disposition: "COVERED_BY_PERMANENT_QL", qlIds: ["MAL-QL-026"], rationale: "Equal fractional removal preserves the ratio." },
    { contractId: "CP002-GAP-OPERATION-FEASIBILITY", disposition: "COVERED_BY_PERMANENT_QL", qlIds: ["MAL-QL-027"], rationale: "The learner must choose the physically valid operation and quantity." },
    { contractId: "CP002-GAP-PURE-TRANSFER-ONE-OUT-OTHER-IN", disposition: "EXCLUDED_SOURCE_THIN", qlIds: [], rationale: "The direct pure-transfer family lacks sufficient source authority for this freeze and is not silently invented." },
    { contractId: "CP002-GAP-ADD-KNOWN-TWO-COMPONENT-MIXTURE", disposition: "EXCLUDED_SOURCE_THIN", qlIds: [], rationale: "Adding a second mixture changes both components and is not absorbed into the one-pure-component CP without stronger ownership evidence." },
    { contractId: "CP002-GAP-THREE-COMPONENT-COUPLED-ADDITION", disposition: "COVERED_BY_PERMANENT_QL", qlIds: ["MAL-QL-028"], rationale: "The CP-001 referral and competitive-exam analogue are now executable with uniqueness proof." },
    { contractId: "CP002-NONUNIQUE-FINAL-RATIO-ONLY-REVERSE-REPLACEMENT", disposition: "NON_UNIQUE_WITHOUT_MORE_EVIDENCE", qlIds: [], rationale: "A final ratio and replacement amount do not restore the lost original scale." },
    { contractId: "CP002-BOUNDARY-WEIGHTED-MEAN-REPLACEMENT", disposition: "EXCLUDED_TO_CP001", qlIds: [], rationale: "A target price or weighted mean remains CP-001." },
    { contractId: "CP002-BOUNDARY-REPEATED-REPLACEMENT", disposition: "EXCLUDED_TO_CP003", qlIds: [], rationale: "Repeated retention and operation-count tasks remain CP-003." },
    { contractId: "CP002-BOUNDARY-CONCENTRATION", disposition: "EXCLUDED_TO_CP004", qlIds: [], rationale: "Conserved-solute and concentration semantics remain CP-004." },
    { contractId: "CP002-BOUNDARY-CONTEXT-FREE-RATIO", disposition: "EXCLUDED_TO_RAP", qlIds: [], rationale: "Context-free partition remains Ratio and Proportion." },
  ] as const;

export const MAL_CP002_FREEZE_READINESS = Object.freeze({
  status: "READY_TO_FREEZE_ENGLISH" as const,
  meaningfulOwnedUncoveredContractCount: 0,
  permanentQlCount: 17,
  excludedSourceThinContractCount: 2,
  ownershipBoundaryCount: MAL_CP002_COMPLETION_LEDGER.filter(
    (row) => row.disposition.startsWith("EXCLUDED_TO_"),
  ).length,
  nonUniqueContractCount: MAL_CP002_COMPLETION_LEDGER.filter(
    (row) => row.disposition === "NON_UNIQUE_WITHOUT_MORE_EVIDENCE",
  ).length,
});
