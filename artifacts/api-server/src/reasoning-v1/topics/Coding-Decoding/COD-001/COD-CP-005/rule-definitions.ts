import type { CodCp005RuleContext, CodCp005RuleId } from "./types";

export interface CodCp005RuleDefinition {
  ruleId: CodCp005RuleId;
  priority: number;
  contextDomain: readonly CodCp005RuleContext[];
  studentDescription: string;
}

export const COD_CP005_RULES: readonly CodCp005RuleDefinition[] = [
  {
    ruleId: "REVERSE_SEQUENCE",
    priority: 3,
    contextDomain: [{}],
    studentDescription: "read all letters from right to left",
  },
  {
    ruleId: "CYCLIC_POSITION_ROTATION",
    priority: 3,
    contextDomain: [
      { direction: "LEFT", amount: 1 },
      { direction: "RIGHT", amount: 1 },
      { direction: "LEFT", amount: 2 },
      { direction: "RIGHT", amount: 2 },
    ],
    studentDescription: "move one or two end letters cyclically to the opposite end",
  },
  {
    ruleId: "HALF_SWAP",
    priority: 3,
    contextDomain: [{}],
    studentDescription: "interchange the first and second equal halves",
  },
  {
    ruleId: "ODD_THEN_EVEN_EXTRACTION",
    priority: 3,
    contextDomain: [{}],
    studentDescription: "write odd-position letters first and even-position letters next",
  },
  {
    ruleId: "EVEN_THEN_ODD_EXTRACTION",
    priority: 3,
    contextDomain: [{}],
    studentDescription: "write even-position letters first and odd-position letters next",
  },
  {
    ruleId: "OUTER_INNER_INTERLEAVING",
    priority: 3,
    contextDomain: [
      { startSide: "LEFT" },
      { startSide: "RIGHT" },
    ],
    studentDescription: "take letters alternately from the two ends while moving inward",
  },
];

export function getCodCp005Rule(ruleId: CodCp005RuleId): CodCp005RuleDefinition {
  const rule = COD_CP005_RULES.find((entry) => entry.ruleId === ruleId);
  if (!rule) throw new Error(`Unknown COD-CP-005 rule '${ruleId}'`);
  return rule;
}
