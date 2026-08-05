import type { MalCp003PermanentQlId } from "./cp003-permanent-runtime";

export type MalCp003CompletionDisposition =
  | "COVERED_BY_PERMANENT_QL"
  | "MERGED_REPRESENTATION_UNDER_QL"
  | "EXCLUDED_TO_CP004"
  | "EXCLUDED_TO_CP006";

export interface MalCp003CompletionRow {
  contractId: string;
  disposition: MalCp003CompletionDisposition;
  qlIds: readonly MalCp003PermanentQlId[];
  rationale: string;
}

export const MAL_CP003_COMPLETION_LEDGER:
  readonly MalCp003CompletionRow[] = [
    {
      contractId: "MAL-CP003-CONTRACT-EQUAL-REPLACEMENT-FINAL-STATE",
      disposition: "COVERED_BY_PERMANENT_QL",
      qlIds: ["MAL-QL-029"],
      rationale:
        "One permanent contract owns final original quantity, final original fraction and final refill quantity as audited representations of the same retained state.",
    },
    {
      contractId: "MAL-CP003-REPRESENTATION-FINAL-ORIGINAL-FRACTION",
      disposition: "MERGED_REPRESENTATION_UNDER_QL",
      qlIds: ["MAL-QL-029"],
      rationale:
        "The fraction is the final original quantity divided by the known initial pure quantity and is not a separate QL identity.",
    },
    {
      contractId: "MAL-CP003-REPRESENTATION-FINAL-REFILL-QUANTITY",
      disposition: "MERGED_REPRESENTATION_UNDER_QL",
      qlIds: ["MAL-QL-029"],
      rationale:
        "The refill quantity is the fixed-vessel complement of the final original quantity and remains a representation variant.",
    },
    {
      contractId: "MAL-CP003-CONTRACT-INITIAL-COMPOSITION-FROM-FINAL",
      disposition: "COVERED_BY_PERMANENT_QL",
      qlIds: ["MAL-QL-030"],
      rationale:
        "The initial named component is uniquely reconstructed by reversing the exact total retention; the other initial component is its vessel-volume complement.",
    },
    {
      contractId: "MAL-CP003-CONTRACT-REMOVAL-QUANTITY-FROM-FINAL",
      disposition: "COVERED_BY_PERMANENT_QL",
      qlIds: ["MAL-QL-031"],
      rationale:
        "Exact nth-root reconstruction of the one-stage retention is source-backed and independently audited.",
    },
    {
      contractId: "MAL-CP003-CONTRACT-EXACT-OPERATION-COUNT-FROM-FINAL",
      disposition: "COVERED_BY_PERMANENT_QL",
      qlIds: ["MAL-QL-032"],
      rationale:
        "The exact count uses a finite rational-equality search and rejects non-exact targets instead of rounding logarithms.",
    },
    {
      contractId: "MAL-CP003-CONTRACT-UNEQUAL-STAGE-FINAL-ORIGINAL",
      disposition: "COVERED_BY_PERMANENT_QL",
      qlIds: ["MAL-QL-033"],
      rationale:
        "Two to four fixed-volume stages with different removal quantities form a distinct source-backed stage-product contract.",
    },
    {
      contractId: "MAL-CP003-CONTRACT-THREE-COMPONENT-STAGE-LEDGER",
      disposition: "COVERED_BY_PERMANENT_QL",
      qlIds: ["MAL-QL-034"],
      rationale:
        "Changing refill components in one vessel requires a full ordered component-vector ledger and remains CP-003.",
    },
    {
      contractId: "MAL-CP003-CONTRACT-FINAL-COMPONENT-RATIO",
      disposition: "COVERED_BY_PERMANENT_QL",
      qlIds: ["MAL-QL-035"],
      rationale:
        "The ordered reduced final ratio has exam-significant orientation semantics and direct source authority.",
    },
    {
      contractId: "MAL-CP003-CONTRACT-VESSEL-CAPACITY-FROM-FINAL-RATIO",
      disposition: "COVERED_BY_PERMANENT_QL",
      qlIds: ["MAL-QL-036"],
      rationale:
        "Capacity reconstruction from a final ratio is a distinct inverse contract with exact-root state generation.",
    },
    {
      contractId: "MAL-CP003-CONTRACT-MINIMUM-OPERATIONS-THRESHOLD",
      disposition: "COVERED_BY_PERMANENT_QL",
      qlIds: ["MAL-QL-037"],
      rationale:
        "The first strict inequality crossing is distinct from exact final-state count reconstruction and includes previous-stage minimality proof.",
    },
    {
      contractId: "MAL-CP003-BOUNDARY-NONZERO-CONCENTRATION-REFILL",
      disposition: "EXCLUDED_TO_CP004",
      qlIds: [],
      rationale:
        "A refill liquid carrying its own concentration requires conserved-solute accounting rather than pure original-component retention.",
    },
    {
      contractId: "MAL-CP003-BOUNDARY-CROSS-VESSEL-TRANSFER",
      disposition: "EXCLUDED_TO_CP006",
      qlIds: [],
      rationale:
        "Material transfer between distinct vessels requires a vessel-by-vessel transfer ledger and remains MAL-CP-006.",
    },
  ] as const;

export const MAL_CP003_FREEZE_READINESS = Object.freeze({
  status: "FROZEN_ENGLISH" as const,
  meaningfulOwnedUncoveredContractCount: 0,
  permanentQlCount: 9,
  mergedRepresentationCount: MAL_CP003_COMPLETION_LEDGER.filter(
    (row) => row.disposition === "MERGED_REPRESENTATION_UNDER_QL",
  ).length,
  ownershipBoundaryCount: MAL_CP003_COMPLETION_LEDGER.filter((row) =>
    row.disposition.startsWith("EXCLUDED_TO_"),
  ).length,
  remainingSourcePolicyBlockerCount: 0,
  qlRange: "MAL-QL-029..MAL-QL-037" as const,
  englishFrozen: true,
  hindiFrozen: false,
  punjabiFrozen: false,
});
