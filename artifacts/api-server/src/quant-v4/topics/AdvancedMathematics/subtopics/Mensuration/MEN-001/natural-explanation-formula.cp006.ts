const CP006_FORMULA_LINES: Record<string, string> = {
  "MEN-001-QL-401": "Use the linear conversion formula: metres = centimetres ÷ 100.",
  "MEN-001-QL-402": "Use the linear conversion formula: centimetres = metres × 100.",
  "MEN-001-QL-403": "Use the square-unit conversion formula: m² = cm² ÷ 10,000.",
  "MEN-001-QL-404": "Use the square-unit conversion formula: cm² = m² × 10,000.",
  "MEN-001-QL-405": "For a rectangle, the area formula is A = l × b.",
  "MEN-001-QL-406": "For a rectangle, the perimeter formula is P = 2(l + b).",
  "MEN-001-QL-407": "From A = l × b, the missing length is l = A ÷ b.",
  "MEN-001-QL-408": "For a square, the area formula is A = s².",
  "MEN-001-QL-409": "For similar figures, perimeter follows the linear scale formula P₂ = kP₁.",
  "MEN-001-QL-410": "For similar figures, area follows the square-law formula A₂ = k²A₁.",
  "MEN-001-QL-411": "The linear scale factor is k = P₂ ÷ P₁.",
  "MEN-001-QL-412": "The linear scale factor is k = √(A₂ ÷ A₁).",
  "MEN-001-QL-413": "To reverse an enlargement, use A₁ = A₂ ÷ k².",
  "MEN-001-QL-414": "For a uniform increase of p%, area increase % = [(1 + p/100)² − 1] × 100.",
  "MEN-001-QL-415": "For a uniform decrease of p%, area decrease % = [1 − (1 − p/100)²] × 100.",
  "MEN-001-QL-416": "With independent changes, the new area factor is (1 + x/100)(1 − y/100).",
  "MEN-001-QL-417": "With independent changes, use A₂ = A₁(1 + x/100)(1 − y/100).",
  "MEN-001-QL-418": "Use actual length = map length × ground distance represented by 1 cm.",
  "MEN-001-QL-419": "Use map length = actual length ÷ ground distance represented by 1 cm.",
  "MEN-001-QL-420": "For map areas, actual area = map area × (linear scale)².",
  "MEN-001-QL-421": "For reverse map-area conversion, map area = actual area ÷ (linear scale)².",
  "MEN-001-QL-422": "Convert both dimensions with L = lₘ × k and B = bₘ × k, then use A = L × B.",
  "MEN-001-QL-423": "Conserving the wire gives the boundary equation 4s = 2(l + b).",
  "MEN-001-QL-424": "Conserving the wire gives the boundary equation 2(l + b) = 4s.",
  "MEN-001-QL-425": "Conserving the wire gives 4s = 2πr.",
  "MEN-001-QL-426": "Conserving the wire gives 2πr = 4s.",
  "MEN-001-QL-427": "Conserving the wire gives 2(l + b) = 2πr.",
  "MEN-001-QL-428": "Conserving the wire gives 4s = 3a, where a is the triangle side.",
  "MEN-001-QL-429": "Conserving the wire gives 4s = 6a, where a is the hexagon side.",
  "MEN-001-QL-430": "Use 2(l + b) = 4s to recover the square side, then A = s².",
  "MEN-001-QL-431": "For common perimeter P, use s = P/4 and area difference = s² − lb.",
  "MEN-001-QL-432": "For fixed perimeter P, the maximum rectangular area is Amax = (P/4)².",
  "MEN-001-QL-433": "For common perimeter P, use r = P/(2π), s = P/4, and difference = πr² − s².",
  "MEN-001-QL-434": "From 2πr = 2(l + b), the unknown breadth is b = πr − l.",
  "MEN-001-QL-435": "Use 4s = 2πr to recover the radius, then A = πr².",
  "MEN-001-QL-436": "Use 2πr = 4s to recover the square side, then A = s².",
};

export function getMen001Cp006FormulaLine(questionLanguageId: string) {
  const formula = CP006_FORMULA_LINES[questionLanguageId];
  if (!formula) {
    throw new Error(`MEN-001 CP-006 requires an explicit formula for ${questionLanguageId}.`);
  }
  return formula;
}

export function getMen001Cp006FormulaLineIds() {
  return Object.keys(CP006_FORMULA_LINES);
}
