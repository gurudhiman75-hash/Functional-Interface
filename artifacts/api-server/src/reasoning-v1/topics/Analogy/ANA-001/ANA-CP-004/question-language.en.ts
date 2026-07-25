export type SetPresentationMode = "MISSING_MEMBER" | "EQUIVALENT_SET_SELECTION";

export interface SetAnalogyQL {
  qlId: string;
  ruleId: string;
  presentationMode: SetPresentationMode;
  taskKind: "NUMBER_SET_RULE";
  renderer: "TABLE_OR_GRID";
  localeMode: "TRANSLATABLE";
}

const RULE_IDS = [
  "SET_SUM", "SET_ABS_DIFFERENCE", "SET_PRODUCT", "SET_PRODUCT_ADJUST",
  "SET_SQUARE_SUM", "SET_SQUARE_DIFFERENCE", "SET_PRODUCT_PLUS_FIRST", "SET_PRODUCT_PLUS_SECOND",
  "SET_PRODUCT_MINUS_FIRST", "SET_PRODUCT_MINUS_SECOND", "SET_AVERAGE", "SET_RATIO_PRESERVING",
  "SET_FACTOR_MULTIPLE", "SET_CONSECUTIVE_CONSTRUCTION", "SET_MATCHING_TRIPLES", "SET_CORRESPONDING_MISSING_MEMBER",
] as const;

export const ANA_CP004_QLS: readonly SetAnalogyQL[] = RULE_IDS.flatMap((ruleId, index) => [
  {
    qlId: `ANA-QL-${String(109 + index * 2).padStart(3, "0")}`,
    ruleId,
    presentationMode: "MISSING_MEMBER" as const,
    taskKind: "NUMBER_SET_RULE" as const,
    renderer: "TABLE_OR_GRID" as const,
    localeMode: "TRANSLATABLE" as const,
  },
  {
    qlId: `ANA-QL-${String(110 + index * 2).padStart(3, "0")}`,
    ruleId,
    presentationMode: "EQUIVALENT_SET_SELECTION" as const,
    taskKind: "NUMBER_SET_RULE" as const,
    renderer: "TABLE_OR_GRID" as const,
    localeMode: "TRANSLATABLE" as const,
  },
]);
