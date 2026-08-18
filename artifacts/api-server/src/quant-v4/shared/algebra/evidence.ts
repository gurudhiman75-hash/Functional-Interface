import { compareRational, type Rational } from "./rational";

export type QuantityRelation = "QUANTITY_I_GREATER" | "QUANTITY_II_GREATER" | "EQUAL" | "CANNOT_BE_DETERMINED";

export type DataSufficiencyVerdict =
  | "STATEMENT_I_ALONE"
  | "STATEMENT_II_ALONE"
  | "EITHER_ALONE"
  | "BOTH_TOGETHER"
  | "NOT_SUFFICIENT";

export function compareRationalQuantities(quantityI: Rational, quantityII: Rational): QuantityRelation {
  const cmp = compareRational(quantityI, quantityII);
  return cmp > 0 ? "QUANTITY_I_GREATER" : cmp < 0 ? "QUANTITY_II_GREATER" : "EQUAL";
}

export function compareRationalPossibilitySets(quantityI: Rational[], quantityII: Rational[]): QuantityRelation {
  if (quantityI.length === 0 || quantityII.length === 0) throw new Error("Quantity comparison requires at least one admissible value on each side");
  const relations = new Set<QuantityRelation>();
  for (const left of quantityI) {
    for (const right of quantityII) relations.add(compareRationalQuantities(left, right));
  }
  return relations.size === 1 ? [...relations][0]! : "CANNOT_BE_DETERMINED";
}

export function classifyDataSufficiency(
  statementISufficient: boolean,
  statementIISufficient: boolean,
  togetherSufficient: boolean,
): DataSufficiencyVerdict {
  if (statementISufficient && statementIISufficient) return "EITHER_ALONE";
  if (statementISufficient) return "STATEMENT_I_ALONE";
  if (statementIISufficient) return "STATEMENT_II_ALONE";
  return togetherSufficient ? "BOTH_TOGETHER" : "NOT_SUFFICIENT";
}

export function formatQuantityRelation(value: QuantityRelation): string {
  return value === "QUANTITY_I_GREATER" ? "Quantity I > Quantity II"
    : value === "QUANTITY_II_GREATER" ? "Quantity II > Quantity I"
    : value === "EQUAL" ? "Quantity I = Quantity II"
    : "The relationship cannot be determined";
}

export function formatDataSufficiencyVerdict(value: DataSufficiencyVerdict): string {
  return value === "STATEMENT_I_ALONE" ? "Statement I alone is sufficient"
    : value === "STATEMENT_II_ALONE" ? "Statement II alone is sufficient"
    : value === "EITHER_ALONE" ? "Either statement alone is sufficient"
    : value === "BOTH_TOGETHER" ? "Both statements together are sufficient, but neither alone is sufficient"
    : "Even both statements together are not sufficient";
}
