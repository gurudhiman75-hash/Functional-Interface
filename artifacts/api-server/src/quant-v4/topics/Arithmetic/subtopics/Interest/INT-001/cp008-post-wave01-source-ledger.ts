import type { IntCp008PrototypeId } from "./cp008-instalment-discovery-v1";

export type IntCp008SourceDisposition = "COVERED" | "REPRESENTATION" | "REASSIGN_CP009" | "MERGE_CANDIDATE";
export type IntCp008SourceDirection = Readonly<{
  id: string;
  label: string;
  disposition: IntCp008SourceDisposition;
  prototypes: readonly IntCp008PrototypeId[];
}>;

export const INT_CP008_POST_WAVE01_SOURCE_LEDGER = Object.freeze([
  { id: "S01", label: "equal annual instalment", disposition: "COVERED", prototypes: ["INT-CP008-PROT-001"] },
  { id: "S02", label: "equal half-yearly instalment", disposition: "REPRESENTATION", prototypes: ["INT-CP008-PROT-001"] },
  { id: "S03", label: "two or three equal payments", disposition: "COVERED", prototypes: ["INT-CP008-PROT-001"] },
  { id: "S04", label: "opening balance inverse", disposition: "COVERED", prototypes: ["INT-CP008-PROT-002"] },
  { id: "S05", label: "outstanding balance", disposition: "COVERED", prototypes: ["INT-CP008-PROT-003"] },
  { id: "S06", label: "final balancing instalment", disposition: "COVERED", prototypes: ["INT-CP008-PROT-004"] },
  { id: "S07", label: "beginning versus end timing", disposition: "COVERED", prototypes: ["INT-CP008-PROT-005", "INT-CP008-PROT-001"] },
  { id: "S08", label: "down payment plus equal instalments", disposition: "MERGE_CANDIDATE", prototypes: ["INT-CP008-PROT-006", "INT-CP008-PROT-001"] },
  { id: "S09", label: "bounded exact rate inverse", disposition: "COVERED", prototypes: ["INT-CP008-PROT-007"] },
  { id: "S10", label: "recurring equal savings deposits", disposition: "COVERED", prototypes: ["INT-CP008-PROT-008"] },
  { id: "S11", label: "recurring equal withdrawals", disposition: "MERGE_CANDIDATE", prototypes: ["INT-CP008-PROT-009", "INT-CP008-PROT-002"] },
  { id: "S12", label: "missed instalment catch-up", disposition: "COVERED", prototypes: ["INT-CP008-PROT-010"] },
  { id: "S13", label: "instalment difference under two rates", disposition: "COVERED", prototypes: ["INT-CP008-PROT-011"] },
  { id: "S14", label: "deposits on different dates", disposition: "REASSIGN_CP009", prototypes: [] },
  { id: "S15", label: "unequal repayments", disposition: "REASSIGN_CP009", prototypes: [] },
  { id: "S16", label: "changed middle payment", disposition: "REASSIGN_CP009", prototypes: [] },
  { id: "S17", label: "table timeline ledger numeric DS", disposition: "REPRESENTATION", prototypes: [] },
] as const satisfies readonly IntCp008SourceDirection[]);

export const INT_CP008_POST_WAVE01_GAP_RESULT = Object.freeze({
  sourceDirections: 17,
  materialGaps: 0,
  explicitMergeCandidates: Object.freeze([
    Object.freeze({ from: "INT-CP008-PROT-006", into: "INT-CP008-PROT-001" }),
    Object.freeze({ from: "INT-CP008-PROT-009", into: "INT-CP008-PROT-002" }),
  ]),
  additionalNecessityReview: Object.freeze(["INT-CP008-PROT-011"] as const),
  nextGate: "FINAL_MERGE_SPLIT_PROPOSAL" as const,
  permanentQlCount: 0 as const,
  nextPotentialQlIdentity: "INT-QL-116" as const,
});
