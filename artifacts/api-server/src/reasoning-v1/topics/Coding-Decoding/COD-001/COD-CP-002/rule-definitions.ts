import type { CodCp002OutputShape, CodCp002RuleContext, CodCp002RuleId } from "./types";

export interface CodCp002RuleDefinition {
  ruleId: CodCp002RuleId;
  outputShape: CodCp002OutputShape;
  priority: number;
  contextDomain: readonly CodCp002RuleContext[];
  studentDescription: string;
}

const NO_CONTEXT = [{}] as const;
const CONSTANTS = [1, 2, 3, 4, 5].map((constant) => ({ constant }));

export const COD_CP002_RULES: readonly CodCp002RuleDefinition[] = [
  { ruleId: "A1Z26_SEQUENCE_CODE", outputShape: "SEQUENCE", priority: 1, contextDomain: NO_CONTEXT, studentDescription: "write the forward alphabet rank of each letter" },
  { ruleId: "Z1A26_SEQUENCE_CODE", outputShape: "SEQUENCE", priority: 1, contextDomain: NO_CONTEXT, studentDescription: "write the reverse alphabet rank of each letter" },
  { ruleId: "RANK_PLUS_CONSTANT_SEQUENCE", outputShape: "SEQUENCE", priority: 2, contextDomain: CONSTANTS, studentDescription: "add one fixed constant to every forward alphabet rank" },
  { ruleId: "RANK_MINUS_CONSTANT_SEQUENCE", outputShape: "SEQUENCE", priority: 2, contextDomain: CONSTANTS, studentDescription: "subtract one fixed constant from every forward alphabet rank" },
  { ruleId: "SUM_OF_FORWARD_RANKS", outputShape: "SCALAR", priority: 1, contextDomain: NO_CONTEXT, studentDescription: "add the forward alphabet ranks" },
  { ruleId: "SUM_PLUS_WORD_LENGTH", outputShape: "SCALAR", priority: 2, contextDomain: NO_CONTEXT, studentDescription: "add the forward ranks and then add the number of letters" },
  { ruleId: "SUM_MINUS_WORD_LENGTH", outputShape: "SCALAR", priority: 2, contextDomain: NO_CONTEXT, studentDescription: "add the forward ranks and then subtract the number of letters" },
  { ruleId: "POSITION_WEIGHTED_SUM", outputShape: "SCALAR", priority: 3, contextDomain: NO_CONTEXT, studentDescription: "multiply each rank by its position and add the results" },
  { ruleId: "ODD_EVEN_POSITION_DIFFERENCE", outputShape: "SCALAR", priority: 3, contextDomain: NO_CONTEXT, studentDescription: "take the absolute difference between odd-position and even-position rank totals" },
];

export function getCodCp002Rule(ruleId: CodCp002RuleId): CodCp002RuleDefinition {
  const rule = COD_CP002_RULES.find((entry) => entry.ruleId === ruleId);
  if (!rule) throw new Error(`Unknown COD-CP-002 rule '${ruleId}'`);
  return rule;
}
