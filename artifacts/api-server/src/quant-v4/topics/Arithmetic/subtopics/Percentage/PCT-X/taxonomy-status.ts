export type PctXCurrentStatus = "EXPERIMENTAL";
export type PctXTemporaryHome = "PCT-X";
export type PctXPermanentHome = "UNKNOWN";

export interface PctXTaxonomyStatusRecord {
  cpId: string;
  cpName: string;
  temporaryHome: PctXTemporaryHome;
  permanentHome: PctXPermanentHome;
  currentStatus: PctXCurrentStatus;
  notes: string;
}

export const pctXTaxonomyStatus: readonly PctXTaxonomyStatusRecord[] = [
  {
    cpId: "PCT-CP-001",
    cpName: "Set Overlap & Inclusion-Exclusion",
    temporaryHome: "PCT-X",
    permanentHome: "UNKNOWN",
    currentStatus: "EXPERIMENTAL",
    notes: "Preserved intact as mathematically valid advanced work.",
  },
  {
    cpId: "PCT-CP-002",
    cpName: "Miscalculation and Percentage Error",
    temporaryHome: "PCT-X",
    permanentHome: "UNKNOWN",
    currentStatus: "EXPERIMENTAL",
    notes: "Preserved intact as mathematically valid advanced work.",
  },
  {
    cpId: "PCT-CP-003",
    cpName: "Tiered Slabs and Thresholds",
    temporaryHome: "PCT-X",
    permanentHome: "UNKNOWN",
    currentStatus: "EXPERIMENTAL",
    notes: "Preserved intact as mathematically valid advanced work.",
  },
  {
    cpId: "PCT-CP-004",
    cpName: "Weighted Sub-group Attributes",
    temporaryHome: "PCT-X",
    permanentHome: "UNKNOWN",
    currentStatus: "EXPERIMENTAL",
    notes: "Preserved intact as mathematically valid advanced work.",
  },
  {
    cpId: "PCT-CP-005",
    cpName: "Repeated Replacement Operations",
    temporaryHome: "PCT-X",
    permanentHome: "UNKNOWN",
    currentStatus: "EXPERIMENTAL",
    notes: "Preserved intact as mathematically valid advanced work.",
  },
  {
    cpId: "PCT-CP-006",
    cpName: "Multi-stage Attrition and Elections",
    temporaryHome: "PCT-X",
    permanentHome: "UNKNOWN",
    currentStatus: "EXPERIMENTAL",
    notes: "Preserved intact as mathematically valid advanced work.",
  },
] as const;
