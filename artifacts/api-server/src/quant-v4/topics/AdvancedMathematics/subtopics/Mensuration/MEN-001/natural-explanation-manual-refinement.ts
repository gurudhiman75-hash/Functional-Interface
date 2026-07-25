import {
  format,
  value,
} from "./natural-explanation-manual.shared";
import type { Men001Parameters, Men001SolverResult } from "./types";

export function writeRefinedMen001Working(
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): string[] | undefined {
  const v = (key: string) => format(value(parameters, solver, key));

  switch (parameters.questionLanguageId) {
    case "MEN-001-QL-005":
      return [`Numerically, h = 2 × ${v("area")} ÷ ${v("base")} = ${v("height")} cm.`];
    case "MEN-001-QL-007":
      return [`Working backwards gives b = 2 × ${v("area")} ÷ ${v("height")} = ${v("base")} cm.`];
    case "MEN-001-QL-012":
      return [`The calculation is ${v("legA")} × ${v("legB")} ÷ 2 = ${v("area")} cm².`];
    case "MEN-001-QL-013":
      return [`Substituting a = ${v("side")} cm gives (√3/4) × ${v("side")}² = ${v("areaCoefficient")}√3 cm².`];
    case "MEN-001-QL-016":
      return [`Each side is ${v("perimeter")} ÷ 3 = ${v("side")} cm.`];
    case "MEN-001-QL-019":
      return [`Half the base is ${v("halfBase")} m, so h = √(${v("equalSide")}² − ${v("halfBase")}²) = ${v("height")} m.`];

    case "MEN-001-QL-104":
      return [`The missing length is ${v("area")} ÷ ${v("breadth")} = ${v("length")} m.`];
    case "MEN-001-QL-109":
      return [`The boundary length is 4 × ${v("side")} = ${v("perimeter")} m.`];
    case "MEN-001-QL-110":
      return [`Here, √${v("area")} = ${v("side")} cm.`];
    case "MEN-001-QL-111":
      return [`The diagonal ${v("diagonalCoefficient")}√2 cm gives side ${v("side")} cm, and ${v("side")}² = ${v("area")} cm².`];
    case "MEN-001-QL-112":
      return [`The side is ${v("side")} m, making the perimeter 4 × ${v("side")} = ${v("perimeter")} m.`];
    case "MEN-001-QL-115":
      return [`The height is ${v("area")} ÷ ${v("base")} = ${v("height")} m.`];
    case "MEN-001-QL-116":
      return [`The base is ${v("area")} ÷ ${v("height")} = ${v("base")} cm.`];
    case "MEN-001-QL-117":
      return [`Counting both pairs gives 2(${v("base")} + ${v("adjacentSide")}) = ${v("perimeter")} cm.`];
    case "MEN-001-QL-118":
      return [`Its area is ${v("diagonalA")} × ${v("diagonalB")} ÷ 2 = ${v("area")} cm².`];
    case "MEN-001-QL-122": {
      const average = (value(parameters, solver, "parallelSideA") + value(parameters, solver, "parallelSideB")) / 2;
      return [`The average parallel side is (${v("parallelSideA")} + ${v("parallelSideB")}) ÷ 2 = ${format(average)} m; multiplying by ${v("height")} m gives ${v("area")} m².`];
    }
    case "MEN-001-QL-123": {
      const average = (value(parameters, solver, "parallelSideA") + value(parameters, solver, "parallelSideB")) / 2;
      return [`The calculation is ${format(average)} × ${v("height")} = ${v("area")} cm².`];
    }
    case "MEN-001-QL-126":
      return [`The area is ${v("diagonalA")} × ${v("diagonalB")} ÷ 2 = ${v("area")} cm².`];
    case "MEN-001-QL-130":
      return [`Using the given measurements, ${v("base")} × ${v("height")} = ${v("area")} m².`];

    case "MEN-001-QL-207":
      return [`First r² = ${v("area")} ÷ (22/7) = ${v("radiusSquare")}; therefore r = ${v("radius")} cm.`];
    case "MEN-001-QL-209":
      return [`Half of ${v("fullArea")} cm² is ${v("area")} cm².`];
    case "MEN-001-QL-211":
      return [`One fourth of ${v("fullArea")} cm² is ${v("area")} cm².`];
    case "MEN-001-QL-212":
      return [`The boundary is ${v("quadrantArc")} + 2 × ${v("radius")} = ${v("perimeter")} m.`];
    case "MEN-001-QL-213":
      return [`The circumference is ${v("circumference")} cm, so the required arc is ${v("angleDegrees")}/360 × ${v("circumference")} = ${v("arcLength")} cm.`];
    case "MEN-001-QL-215":
      return [`The sector area is ${v("angleDegrees")}/360 × ${v("fullArea")} = ${v("sectorArea")} cm².`];
    case "MEN-001-QL-217":
      return [`Its boundary measures ${v("arcLength")} + 2 × ${v("radius")} = ${v("perimeter")} cm.`];
    case "MEN-001-QL-219":
      return [`The angle is ${v("sectorArea")}/${v("fullArea")} × 360° = ${v("angleDegrees")}°.`];
    case "MEN-001-QL-220":
      return [`The ring area is ${v("outerArea")} − ${v("innerArea")} = ${v("area")} cm².`];
    case "MEN-001-QL-221":
      return [`Subtracting the two areas gives ${v("outerArea")} − ${v("innerArea")} = ${v("area")} m².`];
    case "MEN-001-QL-225":
      return [`Here r² = ${v("area")} ÷ (22/7) = ${v("radiusSquare")}, so r = ${v("radius")} cm and d = ${v("diameter")} cm.`];
    case "MEN-001-QL-227":
      return [`The data gives r² = 360 × ${v("sectorArea")} ÷ [(22/7) × ${v("angleDegrees")}] = ${v("radiusSquare")}, so r = ${v("radius")} m.`];
    case "MEN-001-QL-229":
      return [`One turn covers ${v("circumference")} cm, hence ${v("distance")} ÷ ${v("circumference")} = ${v("revolutions")} complete turns.`];

    case "MEN-001-QL-320":
      return [`The tile count is ${v("area")} ÷ ${v("tileArea")} = ${v("tileCount")}.`];
    case "MEN-001-QL-323":
      return [`The count is ${v("area")} ÷ ${v("tileArea")} = ${v("tileCount")} tiles.`];
    case "MEN-001-QL-327": {
      const outerSquare = value(parameters, solver, "outerRadius") ** 2;
      return [`R² = ${v("innerRadius")}² + ${v("radiusSquareDifference")} = ${format(outerSquare)}, so R = ${v("outerRadius")} m and the width is ${v("pathWidth")} m.`];
    }
    case "MEN-001-QL-328": {
      const innerSquare = value(parameters, solver, "innerRadius") ** 2;
      return [`r² = ${v("outerRadius")}² − ${v("radiusSquareDifference")} = ${format(innerSquare)}, so r = ${v("innerRadius")} m and the width is ${v("pathWidth")} m.`];
    }
    default:
      return undefined;
  }
}
