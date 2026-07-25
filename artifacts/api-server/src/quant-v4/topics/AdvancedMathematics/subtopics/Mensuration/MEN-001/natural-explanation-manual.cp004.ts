import {
  format,
  unit,
  value,
} from "./natural-explanation-manual.shared";
import type { Men001Parameters, Men001SolverResult } from "./types";

export function writeMen001Cp004Working(
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): string[] | undefined {
  const v = (key: string) => format(value(parameters, solver, key));
  const answerUnit = unit(solver);

  switch (parameters.questionLanguageId) {
    case "MEN-001-QL-301":
      return [`The outer dimensions become ${v("outerLength")} m by ${v("outerBreadth")} m. Their area is ${v("outerArea")} m², and removing the ${v("innerArea")} m² garden leaves ${v("area")} m² for the path.`];
    case "MEN-001-QL-302":
      return [`Adding the border gives an outer rectangle of ${v("outerLength")} cm by ${v("outerBreadth")} cm. It covers ${v("outerArea")} cm², so the border alone covers ${v("outerArea")} − ${v("innerArea")} = ${v("area")} cm².`];
    case "MEN-001-QL-303":
      return [`The path leaves a central rectangle measuring ${v("innerLength")} m by ${v("innerBreadth")} m. Subtracting its ${v("innerArea")} m² from the park’s ${v("outerArea")} m² gives ${v("area")} m².`];
    case "MEN-001-QL-304":
      return [`The outer square has side ${v("outerSide")} m and area ${v("outerArea")} m². The lawn itself covers ${v("innerArea")} m², so the surrounding path covers ${v("area")} m².`];
    case "MEN-001-QL-305":
      return [`The path leaves a central square of side ${v("innerSide")} m. Its area is ${v("innerArea")} m², and ${v("outerArea")} − ${v("innerArea")} = ${v("area")} m² lies in the path.`];
    case "MEN-001-QL-306":
      return [`The outside radius is ${v("outerRadius")} m. The two circle areas are ${v("outerArea")} m² and ${v("innerArea")} m², leaving ${v("area")} m² between them.`];
    case "MEN-001-QL-307":
      return [`The unpaved centre has radius ${v("innerRadius")} m and area ${v("innerArea")} m². Removing it from the ${v("outerArea")} m² park gives a path area of ${v("area")} m².`];
    case "MEN-001-QL-308":
      return [
        `The enlarged rectangle covers ${v("outerArea")} m², while the garden covers ${v("innerArea")} m²; the paved strip is therefore ${v("area")} m².`,
        `At ₹${v("ratePerSquareMetre")} per square metre, the cost is ${v("area")} × ${v("ratePerSquareMetre")} = ₹${v("cost")}.`,
      ];
    case "MEN-001-QL-309":
      return [
        `The annular path covers ${v("outerArea")} − ${v("innerArea")} = ${v("area")} m².`,
        `Charging ₹${v("ratePerSquareMetre")} for each square metre gives ₹${v("cost")}.`,
      ];
    case "MEN-001-QL-310":
      return [`The lawn and path together cover ${v("outerArea")} m², so the outer side is √${v("outerArea")} = ${v("outerSide")} m. The side grew by ${format(value(parameters, solver, "outerSide") - value(parameters, solver, "innerSide"))} m in total, which means ${v("pathWidth")} m on each side.`];
    case "MEN-001-QL-311":
      return [`The floor covers ${v("floorArea")} cm² and one tile covers ${v("tileArea")} cm². Dividing gives ${v("floorArea")} ÷ ${v("tileArea")} = ${v("tileCount")} tiles.`];
    case "MEN-001-QL-312":
      return [`Each square tile covers ${v("tileArea")} cm². The hall needs ${v("floorArea")} ÷ ${v("tileArea")} = ${v("tileCount")} such tiles.`];
    case "MEN-001-QL-313":
      return [
        `The floor-to-tile area ratio is ${v("floorArea")} ÷ ${v("tileArea")} = ${v("tileCount")}, so ${v("tileCount")} tiles are needed.`,
        `At ₹${v("costPerTile")} each, the purchase comes to ₹${v("cost")}.`,
      ];
    case "MEN-001-QL-314":
      return [`The room covers ${v("length")} × ${v("breadth")} = ${v("area")} m². At ₹${v("ratePerSquareMetre")} per square metre, the total is ₹${v("cost")}.`];
    case "MEN-001-QL-315":
      return [`The field boundary is 2(${v("length")} + ${v("breadth")}) = ${v("perimeter")} m. Fencing those metres at ₹${v("ratePerMetre")} each costs ₹${v("cost")}.`];
    case "MEN-001-QL-316":
      return [`The park’s perimeter is ${v("perimeter")} m, but the ${v("gateWidth")} m gate is left open. Fencing ${v("fenceLength")} m at ₹${v("ratePerMetre")} per metre costs ₹${v("cost")}.`];
    case "MEN-001-QL-317":
      return [`One round needs ${v("perimeter")} m of wire. For ${v("rounds")} complete rounds, ${v("perimeter")} × ${v("rounds")} = ${v("wireLength")} m is required.`];
    case "MEN-001-QL-318":
      return [`The circular boundary is 2 × 22/7 × ${v("radius")} = ${v("circumference")} m. At ₹${v("ratePerMetre")} per metre, fencing costs ₹${v("cost")}.`];
    case "MEN-001-QL-319":
      return [`The full boundary is ${v("perimeter")} m, but only ${v("wireLength")} m is fenced. The missing ${v("perimeter")} − ${v("wireLength")} = ${v("gateWidth")} m is the gate.`];
    case "MEN-001-QL-320":
      return [`The border occupies ${v("area")} cm², while one tile covers ${v("tileArea")} cm². Thus ${v("area")} ÷ ${v("tileArea")} = ${v("tileCount")} tiles fit the border exactly.`];
    case "MEN-001-QL-321":
      return [`The floor covers ${v("floorArea")} m² and the mat covers ${v("coveredArea")} m². The visible part is ${v("floorArea")} − ${v("coveredArea")} = ${v("area")} m².`];
    case "MEN-001-QL-322":
      return [`The wall has area ${v("outerArea")} m² and the door removes ${v("innerArea")} m², leaving ${v("area")} m² to paint. At ₹${v("ratePerSquareMetre")} per square metre, the charge is ₹${v("cost")}.`];
    case "MEN-001-QL-323":
      return [`The outside path covers ${v("area")} m². Since one paving tile covers ${v("tileArea")} m², the path takes ${v("area")} ÷ ${v("tileArea")} = ${v("tileCount")} tiles.`];
    case "MEN-001-QL-324":
      return [`The field perimeter is ${v("perimeter")} m. Three rounds use ${v("wireLength")} m in all, and at ₹${v("ratePerMetre")} per metre the cost is ₹${v("cost")}.`];
    case "MEN-001-QL-325":
      return [`If the width is w, the outer dimensions are (${v("innerLength")} + 2w) and (${v("innerBreadth")} + 2w). Setting their added area equal to ${v("area")} m² and solving gives w = ${v("pathWidth")} m.`];
    case "MEN-001-QL-326":
      return [`An inside width w leaves dimensions (${v("outerLength")} − 2w) by (${v("outerBreadth")} − 2w). The given border area leads to the positive solution w = ${v("pathWidth")} m.`];
    case "MEN-001-QL-327":
      return [`The annular area gives R² = ${v("innerRadius")}² + ${v("area")} ÷ (22/7) = ${v("outerRadiusSquare")}. Hence R = ${v("outerRadius")} m and the path width is ${v("outerRadius")} − ${v("innerRadius")} = ${v("pathWidth")} m.`];
    case "MEN-001-QL-328":
      return [`The remaining inner radius satisfies r² = ${v("outerRadius")}² − ${v("area")} ÷ (22/7) = ${v("innerRadiusSquare")}. Thus r = ${v("innerRadius")} m, leaving a path width of ${v("pathWidth")} m.`];
    case "MEN-001-QL-329":
      return [`The two road strips cover ${v("roadAreaA")} m² and ${v("roadAreaB")} m². Their ${v("overlapArea")} m² crossing was counted twice, so the actual occupied area is ${v("roadAreaA")} + ${v("roadAreaB")} − ${v("overlapArea")} = ${v("roadArea")} m².`];
    case "MEN-001-QL-330":
      return [`After correcting the overlap, the roads occupy ${v("roadArea")} m². Removing this from the ${v("fieldArea")} m² field leaves ${v("area")} m².`];
    case "MEN-001-QL-331":
      return [`One tile covers ${v("tileArea")} cm², so ${v("tileCount")} tiles cover ${v("coveredArea")} cm². The uncovered part is ${v("floorArea")} − ${v("coveredArea")} = ${v("area")} cm².`];
    case "MEN-001-QL-332":
      return [`The cost of one square metre is ₹${v("cost")} ÷ ${v("area")} = ₹${v("ratePerSquareMetre")} per m².`];
    case "MEN-001-QL-333":
      return [`The complete boundary is 2(${v("length")} + ${v("breadth")}) = ${v("perimeter")} m. Dividing ₹${v("cost")} by ${v("perimeter")} m gives ₹${v("ratePerMetre")} per metre.`];
    case "MEN-001-QL-334":
      return [`The inside path covers ${v("area")} m², and each tile covers ${v("tileArea")} m². The exact count is ${v("area")} ÷ ${v("tileArea")} = ${v("tileCount")} tiles.`];
    default:
      return undefined;
  }
}
