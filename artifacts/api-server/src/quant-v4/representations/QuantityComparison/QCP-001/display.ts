import type { Qcp001Language, Qcp001RelationClass } from "./types";
export const QCP_RELATIONS: readonly Qcp001RelationClass[] = [
  "QUANTITY_I_GREATER",
  "QUANTITY_I_LESS",
  "QUANTITY_I_GREATER_OR_EQUAL",
  "QUANTITY_I_LESS_OR_EQUAL",
  "EQUAL_OR_RELATION_CANNOT_BE_ESTABLISHED",
];
export function quantityLabel(
  language: Qcp001Language,
  index: "I" | "II",
): string {
  return `${language === "hi" ? "मात्रा" : language === "pa" ? "ਮਾਤਰਾ" : "Quantity"} ${index}`;
}
export function relationText(
  relation: Qcp001RelationClass,
  language: Qcp001Language,
): string {
  const left = quantityLabel(language, "I"),
    right = quantityLabel(language, "II");
  if (relation === "EQUAL_OR_RELATION_CANNOT_BE_ESTABLISHED")
    return `${left} = ${right} ${language === "hi" ? "या संबंध निर्धारित नहीं किया जा सकता" : language === "pa" ? "ਜਾਂ ਸੰਬੰਧ ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ" : "or the relationship cannot be established"}`;
  const symbol =
    relation === "QUANTITY_I_GREATER"
      ? ">"
      : relation === "QUANTITY_I_LESS"
        ? "<"
        : relation === "QUANTITY_I_GREATER_OR_EQUAL"
          ? "≥"
          : "≤";
  return `${left} ${symbol} ${right}`;
}
