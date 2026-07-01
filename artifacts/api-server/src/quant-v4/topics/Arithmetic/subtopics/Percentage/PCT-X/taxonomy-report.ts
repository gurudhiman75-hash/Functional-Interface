import { pctXTaxonomyStatus } from "./taxonomy-status";

export type TaxonomyRecommendation = "DEFER";

export interface PctXTaxonomyReport {
  implementedCpCount: number;
  temporaryClassification: "PCT-X";
  permanentAssignments: number;
  lostCpCount: number;
  deletedCpCount: number;
  recommendation: TaxonomyRecommendation;
  reason: string;
  currentStatus: readonly unknown[];
  recoveredPct002: {
    title: string;
    purpose: string;
    canonicalProblemCount: number;
  };
}

export const recoveredPct002CanonicalProblems = [
  {
    cpId: "PCT-CP-001",
    cpName: "Whole from Part",
    prompt: "Given p% -> value, find 100%.",
  },
  {
    cpId: "PCT-CP-002",
    cpName: "Another Percentage from Known Percentage",
    prompt: "Given 25% -> 180, find 40%, 70%, 12%.",
  },
  {
    cpId: "PCT-CP-003",
    cpName: "Percentage from Part and Whole",
    prompt: "Given part and whole, find percentage.",
  },
  {
    cpId: "PCT-CP-004",
    cpName: "Reverse Percentage Mapping",
    prompt: "Given 40% -> 240, find what percent is 180.",
  },
  {
    cpId: "PCT-CP-005",
    cpName: "Ratio <-> Percentage Conversion",
    prompt: "Examples: 3:2, 60%, 40%.",
  },
  {
    cpId: "PCT-CP-006",
    cpName: "Complementary Percentage",
    prompt: "Examples: 25% girls, remaining percentage.",
  },
  {
    cpId: "PCT-CP-007",
    cpName: "Difference Between Percentage Parts",
    prompt: "Examples: 40% boys, 25% girls, difference.",
  },
  {
    cpId: "PCT-CP-008",
    cpName: "Percentage Partition",
    prompt: "Examples: 40%, 35%, 25%, partition of a whole.",
  },
  {
    cpId: "PCT-CP-009",
    cpName: "Missing Percentage",
    prompt: "Known percentages add to 100%; find missing percentage.",
  },
  {
    cpId: "PCT-CP-010",
    cpName: "Multi-category Percentage Distribution",
    prompt: "Examples: population or expenses split across categories.",
  },
] as const;

export const pctXTaxonomyReport: PctXTaxonomyReport = {
  implementedCpCount: pctXTaxonomyStatus.length,
  temporaryClassification: "PCT-X",
  permanentAssignments: 0,
  lostCpCount: 0,
  deletedCpCount: 0,
  recommendation: "DEFER",
  reason:
    "Insufficient chapter-level information to assign permanent homes. Preserve the advanced module in PCT-X and defer taxonomy commitment.",
  currentStatus: pctXTaxonomyStatus,
  recoveredPct002: {
    title: "Percentage Transformations",
    purpose: "Collect foundational single-base percentage relationships.",
    canonicalProblemCount: recoveredPct002CanonicalProblems.length,
  },
};
