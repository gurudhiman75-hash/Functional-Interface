export type CountExpression =
  | { kind: "FACTORIAL"; n: number }
  | { kind: "PERMUTATION"; n: number; r: number }
  | { kind: "COMBINATION"; n: number; r: number }
  | { kind: "MULTISET"; total: number; multiplicities: number[] }
  | { kind: "PRODUCT"; factors: CountExpression[] }
  | { kind: "SUM"; terms: CountExpression[] }
  | { kind: "DIFFERENCE"; total: CountExpression; excluded: CountExpression }
  | { kind: "LITERAL"; value: bigint };

export interface CountEvaluation {
  expression: CountExpression;
  value: bigint;
  authority: "PNC-001-FOUNDATION-MATH" | "SHARED-COMPOSITION";
  trace: string[];
}
