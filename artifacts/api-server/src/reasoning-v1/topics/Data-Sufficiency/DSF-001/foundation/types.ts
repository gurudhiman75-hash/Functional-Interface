export const DSF_PACKAGE_ID = "DSF-001" as const;
export const DSF_CP_000_ID = "DSF-CP-000" as const;

export const SUFFICIENCY_CLASSES = [
  "STATEMENT_I_ONLY",
  "STATEMENT_II_ONLY",
  "EACH_STATEMENT_ALONE",
  "BOTH_TOGETHER_ONLY",
  "INSUFFICIENT_EVEN_TOGETHER",
] as const;

export type SufficiencyClass = (typeof SUFFICIENCY_CLASSES)[number];
export type StatementId = "I" | "II" | "III" | "IV";

export interface SufficiencyEvaluation<Answer> {
  readonly consistent: boolean;
  readonly worldCount: number;
  readonly normalizedTargetAnswers: readonly string[];
  readonly sufficient: boolean;
  readonly uniqueAnswer?: Answer;
}

export interface StatementSubsetEvaluation<Answer> {
  readonly statementIds: readonly StatementId[];
  readonly result: SufficiencyEvaluation<Answer>;
}

export interface TwoStatementSufficiencyEvaluation<Answer> {
  readonly statementI: SufficiencyEvaluation<Answer>;
  readonly statementII: SufficiencyEvaluation<Answer>;
  readonly together: SufficiencyEvaluation<Answer>;
  readonly classification: SufficiencyClass;
  readonly minimalSufficientSets: readonly (readonly StatementId[])[];
}

export interface TwoStatementSufficiencyInput<World, Answer> {
  readonly baseWorlds: readonly World[];
  readonly statementI: (world: World) => boolean;
  readonly statementII: (world: World) => boolean;
  readonly evaluateTarget: (world: World) => Answer;
  readonly normalizeAnswer: (answer: Answer) => string;
}

export class SufficiencyInvariantError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "SufficiencyInvariantError";
    this.code = code;
  }
}
