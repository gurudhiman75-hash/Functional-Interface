import type { CodCp003RuleContext, CodCp003RuleId } from "./types";

export interface CodCp003RuleDefinition {
  ruleId: CodCp003RuleId;
  priority: number;
  contextDomain: readonly CodCp003RuleContext[];
  studentDescription: string;
}

export const COD_CP003_SHIFT_CONTEXTS: readonly CodCp003RuleContext[] = [
  -8, -7, -6, -5, -4, -3, -2, -1,
  1, 2, 3, 4, 5, 6, 7, 8,
].map((shift) => ({ shift }));

export const COD_CP003_RULES: readonly CodCp003RuleDefinition[] = [
  {
    ruleId: "UNIFORM_CYCLIC_SHIFT",
    priority: 1,
    contextDomain: COD_CP003_SHIFT_CONTEXTS,
    studentDescription: "move every letter by one fixed signed distance with cyclic alphabet wrapping",
  },
  {
    ruleId: "OPPOSITE_ALPHABET_MAP",
    priority: 1,
    contextDomain: [{}],
    studentDescription: "replace every letter by its opposite alphabet partner",
  },
];

export function getCodCp003Rule(ruleId: CodCp003RuleId): CodCp003RuleDefinition {
  const rule = COD_CP003_RULES.find((entry) => entry.ruleId === ruleId);
  if (!rule) throw new Error(`Unknown COD-CP-003 rule '${ruleId}'`);
  return rule;
}
