import {
  format,
  unit,
  value,
} from "./natural-explanation-manual.shared";
import type { Men001Parameters, Men001SolverResult } from "./types";

export function writeMen001Cp003Working(
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): string[] | undefined {
  const v = (key: string) => format(value(parameters, solver, key));
  const answerUnit = unit(solver);

  switch (parameters.questionLanguageId) {
    case "MEN-001-QL-201":
      return [`One lap is 2πr = 2 × 22/7 × ${v("radius")} = ${v("circumference")} ${answerUnit}.`];
    case "MEN-001-QL-202":
      return [`The plate’s edge measures 2 × 22/7 × ${v("radius")} = ${v("circumference")} cm.`];
    case "MEN-001-QL-203":
      return [`Using the diameter directly, C = πd = 22/7 × ${v("diameter")} = ${v("circumference")} cm.`];
    case "MEN-001-QL-204":
      return [`The garden covers πr² = 22/7 × ${v("radiusSquare")} = ${v("area")} ${answerUnit}.`];
    case "MEN-001-QL-205":
      return [`Squaring the ${v("radius")} cm radius gives ${v("radiusSquare")}; multiplying by 22/7 gives ${v("area")} cm².`];
    case "MEN-001-QL-206":
      return [`A full circumference is 2πr, so r = ${v("circumference")} ÷ (2 × 22/7) = ${v("radius")} ${answerUnit}.`];
    case "MEN-001-QL-207":
      return [`Dividing the area by π gives r² = ${v("area")} ÷ (22/7) = ${v("radiusSquare")}. The positive square root is ${v("radius")} cm.`];
    case "MEN-001-QL-208":
      return [
        `The circumference gives r = ${v("circumference")} ÷ (2 × 22/7) = ${v("radius")} cm.`,
        `That radius produces an area of 22/7 × ${v("radiusSquare")} = ${v("area")} cm².`,
      ];
    case "MEN-001-QL-209":
      return [`The matching full circle has area ${v("fullArea")} cm², so the semicircle occupies ${v("fullArea")} ÷ 2 = ${v("area")} cm².`];
    case "MEN-001-QL-210":
      return [`Its curved edge is ${v("semicircleArc")} m and its diameter is ${v("diameter")} m. Together they make ${v("semicircleArc")} + ${v("diameter")} = ${v("perimeter")} m.`];
    case "MEN-001-QL-211":
      return [`The full circle covers ${v("fullArea")} cm²; a quadrant is one fourth of this, so ${v("fullArea")} ÷ 4 = ${v("area")} cm².`];
    case "MEN-001-QL-212":
      return [`The quarter-circle arc is ${v("quadrantArc")} m. Adding the two ${v("radius")} m radii gives ${v("quadrantArc")} + 2 × ${v("radius")} = ${v("perimeter")} m.`];
    case "MEN-001-QL-213":
      return [`The full circumference is ${v("circumference")} cm, and ${v("angleDegrees")}° is ${v("angleDegrees")}/360 of a turn. The arc is therefore ${v("angleDegrees")}/360 × ${v("circumference")} = ${v("arcLength")} cm.`];
    case "MEN-001-QL-214":
      return [`The circle is ${v("circumference")} m around. An angle of ${v("angleDegrees")}° selects ${v("angleDegrees")}/360 of it, which is ${v("arcLength")} m.`];
    case "MEN-001-QL-215":
      return [`The full circle has area ${v("fullArea")} cm². The ${v("angleDegrees")}° sector takes ${v("angleDegrees")}/360 of that area, or ${v("sectorArea")} cm².`];
    case "MEN-001-QL-216":
      return [`A full field of this radius covers ${v("fullArea")} m²; the ${v("angleDegrees")}° sector is ${v("angleDegrees")}/360 of it, giving ${v("sectorArea")} m².`];
    case "MEN-001-QL-217":
      return [`The arc contributes ${v("arcLength")} cm and the two radii contribute ${format(2 * value(parameters, solver, "radius"))} cm, so the sector perimeter is ${v("perimeter")} cm.`];
    case "MEN-001-QL-218":
      return [`The circle is ${v("circumference")} cm around, and the arc is ${v("arcLength")}/${v("circumference")} of that boundary. The same fraction of 360° is ${v("angleDegrees")}°.`];
    case "MEN-001-QL-219":
      return [`The full circle covers ${v("fullArea")} cm². Since the sector occupies ${v("sectorArea")}/${v("fullArea")} of it, its angle is ${v("sectorArea")}/${v("fullArea")} × 360° = ${v("angleDegrees")}°.`];
    case "MEN-001-QL-220":
      return [`The outer circle covers ${v("outerArea")} cm² and the inner circle ${v("innerArea")} cm². Removing the inner disc leaves ${v("outerArea")} − ${v("innerArea")} = ${v("area")} cm².`];
    case "MEN-001-QL-221":
      return [`The two circular areas are ${v("outerArea")} m² and ${v("innerArea")} m², so the path between them covers ${v("area")} m².`];
    case "MEN-001-QL-222":
      return [`The ring gives R² − r² = ${v("radiusSquareDifference")}. Adding r² = ${v("innerRadiusSquare")} gives R² = ${v("outerRadiusSquare")}, hence R = ${v("outerRadius")} cm.`];
    case "MEN-001-QL-223":
      return [`One turn covers ${v("circumference")} cm. Over ${v("revolutions")} turns, the distance is ${v("circumference")} × ${v("revolutions")} = ${v("distance")} cm.`];
    case "MEN-001-QL-224":
      return [`Because C = πd, the diameter is ${v("circumference")} ÷ (22/7) = ${v("diameter")} ${answerUnit}.`];
    case "MEN-001-QL-225":
      return [`The area gives r² = ${v("area")} ÷ (22/7) = ${v("radiusSquare")}, so r = ${v("radius")} cm. Doubling the radius gives a diameter of ${v("diameter")} cm.`];
    case "MEN-001-QL-226":
      return [`From L = (θ/360)2πr, r = 360 × ${v("arcLength")} ÷ [2 × (22/7) × ${v("angleDegrees")}] = ${v("radius")} cm.`];
    case "MEN-001-QL-227":
      return [`Scaling the sector to a full circle gives r² = 360 × ${v("sectorArea")} ÷ [(22/7) × ${v("angleDegrees")}] = ${v("radiusSquare")}. Its positive square root is ${v("radius")} m.`];
    case "MEN-001-QL-228":
      return [`The ring gives R² − r² = ${v("radiusSquareDifference")}. Subtracting this from R² = ${v("outerRadiusSquare")} leaves r² = ${v("innerRadiusSquare")}, so r = ${v("innerRadius")} cm.`];
    case "MEN-001-QL-229":
      return [`Each revolution covers 2 × 22/7 × ${v("radius")} = ${v("circumference")} cm. The wheel therefore makes ${v("distance")} ÷ ${v("circumference")} = ${v("revolutions")} complete turns.`];
    case "MEN-001-QL-230":
      return [`Each of the ${v("revolutions")} revolutions covers ${v("distance")} ÷ ${v("revolutions")} = ${v("circumference")} cm. Solving 2πr = ${v("circumference")} gives r = ${v("radius")} cm.`];
    default:
      return undefined;
  }
}
