import { ANA_CP010_NUMERIC_RULES, type AnaCp010NumericRuleId } from "./rule-definitions";

export type AnaCp010NumericPresentation = "MISSING_FOURTH_TERM" | "EQUIVALENT_PAIR_SELECTION";
export type AnaCp010SetRuleId = "SET_ALL_PRIME" | "SET_FIXED_RATIO_PROGRESSION";
export type AnaCp010SemanticPresentation = "MISSING_FOURTH_TERM" | "EQUIVALENT_PAIR_SELECTION";

export const ANA_CP010_NUMERIC_QLS = ANA_CP010_NUMERIC_RULES.flatMap((rule, ruleIndex) =>
  (["MISSING_FOURTH_TERM", "EQUIVALENT_PAIR_SELECTION"] as const).map((presentationMode, modeIndex) => ({
    qlId: `ANA-QL-${String(251 + ruleIndex * 2 + modeIndex).padStart(3, "0")}`,
    cpId: "ANA-CP-010",
    title: `${rule.label} — ${presentationMode === "MISSING_FOURTH_TERM" ? "complete analogy" : "select equivalent pair"}`,
    taskKind: presentationMode === "MISSING_FOURTH_TERM" ? "numericMissingTerm" : "numericPairSelection",
    solveMode: "NUMERIC_SOURCE_GAP_TRANSFER",
    ruleId: rule.id as AnaCp010NumericRuleId,
    presentationMode,
    renderer: "TEXT",
    localeMode: "TRANSLATABLE_NUMERIC",
    status: "PROVISIONAL_EXECUTABLE",
  })),
);

export const ANA_CP010_SET_QLS = [
  {
    qlId: "ANA-QL-265",
    cpId: "ANA-CP-010",
    title: "All-prime number-set equivalence",
    taskKind: "numberSetEquivalentSelection",
    solveMode: "SET_PROPERTY_TRANSFER",
    ruleId: "SET_ALL_PRIME" as AnaCp010SetRuleId,
    presentationMode: "EQUIVALENT_SET_SELECTION" as const,
    renderer: "STRUCTURED_TEXT",
    localeMode: "TRANSLATABLE_NUMERIC",
    status: "PROVISIONAL_EXECUTABLE" as const,
  },
  {
    qlId: "ANA-QL-266",
    cpId: "ANA-CP-010",
    title: "Fixed-ratio multiplicative-progression set equivalence",
    taskKind: "numberSetEquivalentSelection",
    solveMode: "SET_PROPERTY_TRANSFER",
    ruleId: "SET_FIXED_RATIO_PROGRESSION" as AnaCp010SetRuleId,
    presentationMode: "EQUIVALENT_SET_SELECTION" as const,
    renderer: "STRUCTURED_TEXT",
    localeMode: "TRANSLATABLE_NUMERIC",
    status: "PROVISIONAL_EXECUTABLE" as const,
  },
] as const;

export const ANA_CP010_SEMANTIC_QLS = [
  {
    qlId: "ANA-QL-267",
    cpId: "ANA-CP-010",
    title: "Governed semantic expansion — complete analogy",
    taskKind: "semanticMissingTerm",
    solveMode: "SEMANTIC_EXPANSION_TRANSFER",
    ruleId: "SEM_EXPANSION_REGISTRY" as const,
    presentationMode: "MISSING_FOURTH_TERM" as AnaCp010SemanticPresentation,
    renderer: "TEXT",
    localeMode: "LANGUAGE_ADAPTED",
    status: "PROVISIONAL_EXECUTABLE" as const,
  },
  {
    qlId: "ANA-QL-268",
    cpId: "ANA-CP-010",
    title: "Governed semantic expansion — select equivalent pair",
    taskKind: "semanticPairSelection",
    solveMode: "SEMANTIC_EXPANSION_TRANSFER",
    ruleId: "SEM_EXPANSION_REGISTRY" as const,
    presentationMode: "EQUIVALENT_PAIR_SELECTION" as AnaCp010SemanticPresentation,
    renderer: "TEXT",
    localeMode: "LANGUAGE_ADAPTED",
    status: "PROVISIONAL_EXECUTABLE" as const,
  },
] as const;

export const ANA_CP010_QLS = [
  ...ANA_CP010_NUMERIC_QLS,
  ...ANA_CP010_SET_QLS,
  ...ANA_CP010_SEMANTIC_QLS,
] as const;

export function anaCp010QlById(qlId: string) {
  const ql = ANA_CP010_QLS.find((entry) => entry.qlId === qlId);
  if (!ql) throw new Error(`Unknown ANA-CP-010 QL: ${qlId}`);
  return ql;
}
