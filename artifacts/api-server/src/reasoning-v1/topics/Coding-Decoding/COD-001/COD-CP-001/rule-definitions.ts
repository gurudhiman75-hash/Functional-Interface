import type { CodCp001RuleId } from "./types";
import type { CodTokenKind } from "../foundation/types";

export interface CodCp001RuleDefinition {
  ruleId: CodCp001RuleId;
  outputKind: CodTokenKind;
  priority: number;
  studentDescription: string;
}

export const COD_CP001_RULES: readonly CodCp001RuleDefinition[] = [
  { ruleId: "DIRECT_LETTER_TO_LETTER_MAP", outputKind: "LETTER", priority: 1, studentDescription: "each source letter has one fixed letter code" },
  { ruleId: "DIRECT_LETTER_TO_DIGIT_MAP", outputKind: "DIGIT", priority: 1, studentDescription: "each source letter has one fixed digit code" },
  { ruleId: "DIRECT_LETTER_TO_SYMBOL_MAP", outputKind: "SYMBOL", priority: 1, studentDescription: "each source letter has one fixed symbol code" },
  { ruleId: "DIRECT_PARTIAL_MAPPING_INFERENCE", outputKind: "LETTER", priority: 2, studentDescription: "overlapping coded examples reveal one consistent letter substitution" },
];
