import {
  format,
  shownAnswer,
  unit,
  value,
} from "./natural-explanation-manual.shared";
import type { Men001Parameters, Men001SolverResult } from "./types";

export function writeMen001Cp002Working(
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): string[] | undefined {
  const v = (key: string) => format(value(parameters, solver, key));
  const answer = shownAnswer(solver);
  const answerUnit = unit(solver);

  switch (parameters.questionLanguageId) {
    case "MEN-001-QL-101":
      return [`The two dimensions cover ${v("length")} × ${v("breadth")} = ${v("area")} ${answerUnit}.`];
    case "MEN-001-QL-102":
      return [`The sheet is a ${v("length")} cm by ${v("breadth")} cm rectangle, so its area is ${v("area")} cm².`];
    case "MEN-001-QL-103":
      return [`Walking once around the garden covers two lengths and two widths: 2(${v("length")} + ${v("breadth")}) = ${v("perimeter")} ${answerUnit}.`];
    case "MEN-001-QL-104":
      return [`Since area = length × breadth, the missing length is ${v("area")} ÷ ${v("breadth")} = ${v("length")} ${answerUnit}.`];
    case "MEN-001-QL-105":
      return [`Half the perimeter is ${v("perimeter")} ÷ 2 = ${format(value(parameters, solver, "perimeter") / 2)} cm. After removing the ${v("length")} cm length, ${v("breadth")} cm remains for the breadth.`];
    case "MEN-001-QL-106":
      return [
        `Half the perimeter is ${format(value(parameters, solver, "perimeter") / 2)} m, so the breadth is ${format(value(parameters, solver, "perimeter") / 2)} − ${v("length")} = ${v("breadth")} m.`,
        `The field then covers ${v("length")} × ${v("breadth")} = ${v("area")} m².`,
      ];
    case "MEN-001-QL-107":
      return [`The missing side is the other leg of the right triangle: √(${v("diagonal")}² − ${v("length")}²) = ${v("breadth")} ${answerUnit}.`];
    case "MEN-001-QL-108":
      return [`A square uses the same measurement twice, so ${v("side")} × ${v("side")} = ${v("area")} ${answerUnit}.`];
    case "MEN-001-QL-109":
      return [`Four equal sides give 4 × ${v("side")} = ${v("perimeter")} ${answerUnit}.`];
    case "MEN-001-QL-110":
      return [`The positive square root of ${v("area")} is ${v("side")}, so each side measures ${answer}.`];
    case "MEN-001-QL-111":
      return [`A diagonal of ${v("diagonalCoefficient")}√2 cm belongs to a square of side ${v("side")} cm. Squaring the side gives ${v("side")}² = ${v("area")} cm².`];
    case "MEN-001-QL-112":
      return [`The diagonal ${v("diagonalCoefficient")}√2 m identifies a side of ${v("side")} m. Four such sides make ${v("perimeter")} m.`];
    case "MEN-001-QL-113":
      return [`Only the perpendicular height is used with the base, giving ${v("base")} × ${v("height")} = ${v("area")} ${answerUnit}.`];
    case "MEN-001-QL-114":
      return [`The plate covers the same area as a ${v("base")} cm by ${v("height")} cm rectangle: ${v("area")} cm².`];
    case "MEN-001-QL-115":
      return [`The height must satisfy base × height = area, so ${v("area")} ÷ ${v("base")} = ${v("height")} ${answerUnit}.`];
    case "MEN-001-QL-116":
      return [`Dividing the ${v("area")} cm² area by the ${v("height")} cm perpendicular height gives a base of ${v("base")} cm.`];
    case "MEN-001-QL-117":
      return [`Each adjacent side occurs twice on the boundary, hence 2(${v("base")} + ${v("adjacentSide")}) = ${v("perimeter")} ${answerUnit}.`];
    case "MEN-001-QL-118":
      return [`The perpendicular diagonals give half their product: ${v("diagonalA")} × ${v("diagonalB")} ÷ 2 = ${v("area")} ${answerUnit}.`];
    case "MEN-001-QL-119":
      return [`From A = d₁d₂/2, the unknown diagonal is 2 × ${v("area")} ÷ ${v("diagonalA")} = ${v("diagonalB")} ${answerUnit}.`];
    case "MEN-001-QL-120":
      return [`The half-diagonals are ${v("halfDiagonalA")} cm and ${v("halfDiagonalB")} cm. Their right-triangle hypotenuse is √(${v("halfDiagonalA")}² + ${v("halfDiagonalB")}²) = ${v("side")} cm.`];
    case "MEN-001-QL-121":
      return [
        `Half of the diagonals gives legs ${v("halfDiagonalA")} m and ${v("halfDiagonalB")} m, so one side is ${v("side")} m.`,
        `The four equal sides total 4 × ${v("side")} = ${v("perimeter")} m.`,
      ];
    case "MEN-001-QL-122":
      return [`The average of the parallel sides is (${v("parallelSideA")} + ${v("parallelSideB")}) ÷ 2 = ${format((value(parameters, solver, "parallelSideA") + value(parameters, solver, "parallelSideB")) / 2)} m. Multiplying by the ${v("height")} m height gives ${v("area")} m².`];
    case "MEN-001-QL-123":
      return [`Averaging the two parallel sides gives ${format((value(parameters, solver, "parallelSideA") + value(parameters, solver, "parallelSideB")) / 2)} cm; multiplying by the ${v("height")} cm height gives ${v("area")} cm².`];
    case "MEN-001-QL-124":
      return [`The height is 2A/(a + b) = 2 × ${v("area")} ÷ (${v("parallelSideA")} + ${v("parallelSideB")}) = ${v("height")} ${answerUnit}.`];
    case "MEN-001-QL-125":
      return [`The two parallel sides together measure 2 × ${v("area")} ÷ ${v("height")} = ${format(2 * value(parameters, solver, "area") / value(parameters, solver, "height"))} cm. Removing the known ${v("parallelSideA")} cm side leaves ${v("parallelSideB")} cm.`];
    case "MEN-001-QL-126":
      return [`Half the product of the perpendicular diagonals is ${v("diagonalA")} × ${v("diagonalB")} ÷ 2 = ${v("area")} ${answerUnit}.`];
    case "MEN-001-QL-127":
      return [`The missing diagonal is 2A/d = 2 × ${v("area")} ÷ ${v("diagonalA")} = ${v("diagonalB")} ${answerUnit}.`];
    case "MEN-001-QL-128":
      return [`The two triangles share the ${v("diagonal")} m diagonal. Adding their heights gives ${v("perpendicularA")} + ${v("perpendicularB")} = ${format(value(parameters, solver, "perpendicularA") + value(parameters, solver, "perpendicularB"))} m, so the combined area is ${v("diagonal")} × ${format(value(parameters, solver, "perpendicularA") + value(parameters, solver, "perpendicularB"))} ÷ 2 = ${v("area")} m².`];
    case "MEN-001-QL-129":
      return [`Sharing the ${v("perimeter")} cm perimeter equally among four sides gives ${v("perimeter")} ÷ 4 = ${v("side")} cm.`];
    case "MEN-001-QL-130":
      return [`Treating the rhombus like a parallelogram, its area is ${v("base")} × ${v("height")} = ${v("area")} ${answerUnit}.`];
    case "MEN-001-QL-131":
      return [`The boundary contains two ${v("sideA")} cm sides and two ${v("sideB")} cm sides: 2(${v("sideA")} + ${v("sideB")}) = ${v("perimeter")} cm.`];
    case "MEN-001-QL-132":
      return [`All four sides count towards the boundary, so ${v("parallelSideA")} + ${v("parallelSideB")} + ${v("sideA")} + ${v("sideB")} = ${v("perimeter")} ${answerUnit}.`];
    default:
      return undefined;
  }
}
