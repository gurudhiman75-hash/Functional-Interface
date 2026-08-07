import type { MalCp004PermanentQlId } from "./cp004-permanent-runtime";

export type MalCp004CompletionDisposition =
  | "COVERED_BY_PERMANENT_QL"
  | "MERGED_REPRESENTATION_UNDER_QL"
  | "EXCLUDED_TO_CP001"
  | "EXCLUDED_TO_CP003"
  | "EXCLUDED_TO_CP006";

export interface MalCp004CompletionRow {
  contractId: string;
  disposition: MalCp004CompletionDisposition;
  qlIds: readonly MalCp004PermanentQlId[];
  rationale: string;
}

export const MAL_CP004_COMPLETION_LEDGER:
  readonly MalCp004CompletionRow[] = [
    {
      contractId: "MAL-CP004-EFF-COMPONENT-AMOUNT",
      disposition: "COVERED_BY_PERMANENT_QL",
      qlIds: ["MAL-QL-038"],
      rationale:
        "The tracked and complementary component quantities are output representations of one total-times-fraction contract.",
    },
    {
      contractId: "MAL-CP004-REPRESENTATION-OTHER-COMPONENT-AMOUNT",
      disposition: "MERGED_REPRESENTATION_UNDER_QL",
      qlIds: ["MAL-QL-038"],
      rationale:
        "The other component is the complete quantity multiplied by the complementary fraction and does not create a new QL.",
    },
    {
      contractId: "MAL-CP004-EFF-CONCENTRATION",
      disposition: "COVERED_BY_PERMANENT_QL",
      qlIds: ["MAL-QL-039"],
      rationale:
        "The concentration is uniquely determined by component quantity divided by complete mixture quantity.",
    },
    {
      contractId: "MAL-CP004-EFF-TOTAL-FROM-COMPONENT-RATE",
      disposition: "COVERED_BY_PERMANENT_QL",
      qlIds: ["MAL-QL-040"],
      rationale:
        "Total reconstruction from either named component uses the same component-divided-by-fraction reasoning contract.",
    },
    {
      contractId: "MAL-CP004-REPRESENTATION-TOTAL-FROM-OTHER-COMPONENT",
      disposition: "MERGED_REPRESENTATION_UNDER_QL",
      qlIds: ["MAL-QL-040"],
      rationale:
        "Using the complementary component changes only the evidence representation, not the reconstruction method.",
    },
    {
      contractId: "MAL-CP004-EFF-SOLVENT-ADDITION-TARGET",
      disposition: "COVERED_BY_PERMANENT_QL",
      qlIds: ["MAL-QL-041"],
      rationale:
        "Solute remains fixed while solvent and total quantity increase to reach the lower target concentration.",
    },
    {
      contractId: "MAL-CP004-EFF-PURE-SOLUTE-ADDITION-TARGET",
      disposition: "COVERED_BY_PERMANENT_QL",
      qlIds: ["MAL-QL-042"],
      rationale:
        "Solvent remains fixed while pure solute and total quantity increase to reach the higher target concentration.",
    },
    {
      contractId: "MAL-CP004-EFF-EVAPORATION-TARGET",
      disposition: "COVERED_BY_PERMANENT_QL",
      qlIds: ["MAL-QL-043"],
      rationale:
        "Evaporated quantity and final total are reconstructible views of one conserved-solute target state.",
    },
    {
      contractId: "MAL-CP004-REPRESENTATION-FINAL-TOTAL-AFTER-EVAPORATION",
      disposition: "MERGED_REPRESENTATION_UNDER_QL",
      qlIds: ["MAL-QL-043"],
      rationale:
        "Final total and evaporated amount are exact complements under the known initial total.",
    },
    {
      contractId: "MAL-CP004-EFF-FINAL-CONCENTRATION-AFTER-SOLVENT-CHANGE",
      disposition: "COVERED_BY_PERMANENT_QL",
      qlIds: ["MAL-QL-044"],
      rationale:
        "Known solvent addition and known solvent evaporation share the same conserved-solute projection to a new total.",
    },
    {
      contractId: "MAL-CP004-REPRESENTATION-KNOWN-SOLVENT-ADDITION-OR-EVAPORATION",
      disposition: "MERGED_REPRESENTATION_UNDER_QL",
      qlIds: ["MAL-QL-044"],
      rationale:
        "The direction of the stated solvent change is a representation parameter inside one final-concentration contract.",
    },
    {
      contractId: "MAL-CP004-EFF-INITIAL-TOTAL-FROM-EVAPORATION",
      disposition: "COVERED_BY_PERMANENT_QL",
      qlIds: ["MAL-QL-045"],
      rationale:
        "The unknown original total is reconstructed from conserved solute, a stated evaporation and two concentrations.",
    },
    {
      contractId: "MAL-CP004-EFF-MOISTURE-FORWARD",
      disposition: "COVERED_BY_PERMANENT_QL",
      qlIds: ["MAL-QL-046"],
      rationale:
        "Final mass and moisture lost are exact representations of one unchanged-dry-matter final state.",
    },
    {
      contractId: "MAL-CP004-REPRESENTATION-MOISTURE-LOST",
      disposition: "MERGED_REPRESENTATION_UNDER_QL",
      qlIds: ["MAL-QL-046"],
      rationale:
        "Moisture lost is initial mass minus the final mass and remains a representation variant.",
    },
    {
      contractId: "MAL-CP004-EFF-MOISTURE-INVERSE",
      disposition: "COVERED_BY_PERMANENT_QL",
      qlIds: ["MAL-QL-047"],
      rationale:
        "The initial mass is reconstructed by equating the final and initial dry-matter quantities.",
    },
    {
      contractId: "MAL-CP004-BOUNDARY-WEIGHTED-BLENDING",
      disposition: "EXCLUDED_TO_CP001",
      qlIds: [],
      rationale:
        "Ordinary blending of two sources with different values or concentrations remains the weighted-mean and alligation domain of MAL-CP-001.",
    },
    {
      contractId: "MAL-CP004-BOUNDARY-REPEATED-EQUAL-REPLACEMENT",
      disposition: "EXCLUDED_TO_CP003",
      qlIds: [],
      rationale:
        "Geometric repeated removal and refill of a fixed vessel remains MAL-CP-003.",
    },
    {
      contractId: "MAL-CP004-BOUNDARY-CROSS-VESSEL-TRANSFER",
      disposition: "EXCLUDED_TO_CP006",
      qlIds: [],
      rationale:
        "Transfer between distinct vessels requires vessel-specific ledgers and remains MAL-CP-006.",
    },
  ] as const;

export const MAL_CP004_FREEZE_READINESS = Object.freeze({
  status: "FROZEN_ENGLISH" as const,
  meaningfulOwnedUncoveredContractCount: 0,
  permanentQlCount: 10,
  mergedRepresentationCount: MAL_CP004_COMPLETION_LEDGER.filter(
    (row) => row.disposition === "MERGED_REPRESENTATION_UNDER_QL",
  ).length,
  ownershipBoundaryCount: MAL_CP004_COMPLETION_LEDGER.filter((row) =>
    row.disposition.startsWith("EXCLUDED_TO_"),
  ).length,
  remainingSourcePolicyBlockerCount: 0,
  qlRange: "MAL-QL-038..MAL-QL-047" as const,
  englishFrozen: true,
  hindiFrozen: false,
  punjabiFrozen: false,
});
