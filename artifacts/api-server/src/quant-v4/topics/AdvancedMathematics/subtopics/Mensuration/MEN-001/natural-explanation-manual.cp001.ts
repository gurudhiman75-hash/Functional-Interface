import {
  format,
  shownAnswer,
  unit,
  value,
} from "./natural-explanation-manual.shared";
import type { Men001Parameters, Men001SolverResult } from "./types";

export function writeMen001Cp001Working(
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): string[] | undefined {
  const v = (key: string) => format(value(parameters, solver, key));
  const answer = shownAnswer(solver);
  const answerUnit = unit(solver);

  switch (parameters.questionLanguageId) {
    case "MEN-001-QL-001":
      return [
        `A triangle is half of the rectangle formed by the same base and perpendicular height, so ${v("base")} × ${v("height")} ÷ 2 = ${v("area")} ${answerUnit}.`,
      ];
    case "MEN-001-QL-002":
      return [
        `A ${v("base")} cm by ${v("height")} cm rectangle would cover ${format(value(parameters, solver, "base") * value(parameters, solver, "height"))} cm²; the triangular sheet occupies half of it, or ${v("area")} cm².`,
      ];
    case "MEN-001-QL-003":
      return [
        `Multiplying the base by the perpendicular height gives ${format(value(parameters, solver, "base") * value(parameters, solver, "height"))}; halving that product leaves ${v("area")} ${answerUnit}.`,
      ];
    case "MEN-001-QL-004":
      return [
        `From A = bh/2, the height is h = 2A/b. Here, h = 2 × ${v("area")} ÷ ${v("base")} = ${v("height")} ${answerUnit}.`,
      ];
    case "MEN-001-QL-005":
      return [
        `Doubling the pane’s area gives ${format(2 * value(parameters, solver, "area"))}; dividing by the ${v("base")} cm base gives a perpendicular height of ${v("height")} cm.`,
      ];
    case "MEN-001-QL-006":
      return [
        `The base is b = 2A/h = 2 × ${v("area")} ÷ ${v("height")} = ${v("base")} ${answerUnit}.`,
      ];
    case "MEN-001-QL-007":
      return [
        `The base must make bh/2 equal to ${v("area")} cm². Thus b = 2 × ${v("area")} ÷ ${v("height")} = ${v("base")} cm.`,
      ];
    case "MEN-001-QL-008":
      return [
        `The semiperimeter is (${v("sideA")} + ${v("sideB")} + ${v("sideC")}) ÷ 2 = ${v("semiperimeter")}.`,
        `Heron’s formula then gives √(${v("semiperimeter")} × ${v("factorA")} × ${v("factorB")} × ${v("factorC")}) = √${v("radicand")} = ${v("area")} ${answerUnit}.`,
      ];
    case "MEN-001-QL-009":
      return [
        `For sides ${v("sideA")}, ${v("sideB")} and ${v("sideC")}, the semiperimeter is ${v("semiperimeter")}.`,
        `The four Heron factors are therefore ${v("semiperimeter")}, ${v("factorA")}, ${v("factorB")} and ${v("factorC")}; their product is ${v("radicand")}, whose square root is ${v("area")} ${answerUnit}.`,
      ];
    case "MEN-001-QL-010":
      return [
        `Here s = (${v("sideA")} + ${v("sideB")} + ${v("sideC")}) ÷ 2 = ${v("semiperimeter")}.`,
        `The enclosed area is √[${v("semiperimeter")}(${v("factorA")})(${v("factorB")})(${v("factorC")})] = √${v("radicand")} = ${v("area")} ${answerUnit}.`,
      ];
    case "MEN-001-QL-011":
      return [
        `The perpendicular sides themselves are the base and height, so the area is ${v("legA")} × ${v("legB")} ÷ 2 = ${v("area")} ${answerUnit}.`,
      ];
    case "MEN-001-QL-012":
      return [
        `The two sides form a right angle. Their product is ${format(value(parameters, solver, "legA") * value(parameters, solver, "legB"))}, and half of that is ${v("area")} ${answerUnit}.`,
      ];
    case "MEN-001-QL-013":
      return [
        `Using A = (√3/4)a², the tile’s area is (√3/4) × ${v("side")}² = ${v("areaCoefficient")}√3 ${answerUnit}. The exact √3 form is kept rather than rounded.`,
      ];
    case "MEN-001-QL-014":
      return [
        `For side ${v("side")} m, (√3/4)a² becomes ${v("areaCoefficient")}√3 m². No decimal approximation is needed.`,
      ];
    case "MEN-001-QL-015":
      return [
        `Comparing the given area with (√3/4)a² gives a²/4 = ${v("areaCoefficient")}, so a = ${v("side")} ${answerUnit}.`,
        `The three equal sides then give a perimeter of 3 × ${v("side")} = ${v("perimeter")} ${answerUnit}.`,
      ];
    case "MEN-001-QL-016":
      return [
        `All three sides are equal, so each one is ${v("perimeter")} ÷ 3 = ${v("side")} ${answerUnit}.`,
      ];
    case "MEN-001-QL-017":
      return [
        `The altitude halves the base, giving a right triangle with legs ${v("halfBase")} and h and hypotenuse ${v("equalSide")}.`,
        `Pythagoras gives h = √(${v("equalSide")}² − ${v("halfBase")}²) = ${v("height")}; the area is then ${v("base")} × ${v("height")} ÷ 2 = ${v("area")} ${answerUnit}.`,
      ];
    case "MEN-001-QL-018":
      return [
        `Half of the base is ${v("halfBase")} cm. Together with the ${v("equalSide")} cm equal side, this gives h = ${v("height")} cm by Pythagoras.`,
        `Using that height, the plate’s area is ${v("base")} × ${v("height")} ÷ 2 = ${v("area")} cm².`,
      ];
    case "MEN-001-QL-019":
      return [
        `The altitude cuts the base into two parts of ${v("halfBase")} ${answerUnit}.`,
        `Hence h = √(${v("equalSide")}² − ${v("halfBase")}²) = ${v("height")} ${answerUnit}.`,
      ];
    case "MEN-001-QL-020": {
      const ratioSum = value(parameters, solver, "ratioA") + value(parameters, solver, "ratioB") + value(parameters, solver, "ratioC");
      return [
        `The ratio contains ${format(ratioSum)} parts, so one part is ${v("perimeter")} ÷ ${format(ratioSum)} = ${v("scale")} m. The sides are therefore ${v("sideA")}, ${v("sideB")} and ${v("sideC")} m.`,
        `With s = ${v("semiperimeter")}, Heron’s formula gives √(${v("semiperimeter")} × ${v("factorA")} × ${v("factorB")} × ${v("factorC")}) = ${v("area")} m².`,
      ];
    }
    case "MEN-001-QL-021": {
      const ratioSum = value(parameters, solver, "ratioA") + value(parameters, solver, "ratioB") + value(parameters, solver, "ratioC");
      return [
        `Dividing the ${v("perimeter")} cm perimeter into ${format(ratioSum)} ratio parts makes each part ${v("scale")} cm, so the sides are ${v("sideA")}, ${v("sideB")} and ${v("sideC")} cm.`,
        `Their semiperimeter is ${v("semiperimeter")}; Heron’s calculation is √(${v("semiperimeter")} × ${v("factorA")} × ${v("factorB")} × ${v("factorC")}) = ${v("area")} cm².`,
      ];
    }
    case "MEN-001-QL-022": {
      const ratioSum = value(parameters, solver, "ratioA") + value(parameters, solver, "ratioB") + value(parameters, solver, "ratioC");
      return [
        `One ratio part is ${v("perimeter")} ÷ ${format(ratioSum)} = ${v("scale")} ${answerUnit}. The largest ratio number is ${format(Math.max(value(parameters, solver, "ratioA"), value(parameters, solver, "ratioB"), value(parameters, solver, "ratioC")))}, giving a largest side of ${answer}.`,
      ];
    }
    case "MEN-001-QL-023": {
      const ratioSum = value(parameters, solver, "ratioA") + value(parameters, solver, "ratioB") + value(parameters, solver, "ratioC");
      return [
        `The perimeter gives ${v("scale")} ${answerUnit} for each of the ${format(ratioSum)} ratio parts. Multiplying by the smallest ratio number gives ${answer}.`,
      ];
    }
    case "MEN-001-QL-024":
      return [
        `The plot first covers ${v("base")} × ${v("height")} ÷ 2 = ${v("area")} m².`,
        `At ₹${v("ratePerSquareMetre")} per square metre, the charge is ${v("area")} × ${v("ratePerSquareMetre")} = ₹${v("cost")}.`,
      ];
    case "MEN-001-QL-025":
      return [
        `Adding the three sides gives ${v("sideA")} + ${v("sideB")} + ${v("sideC")} = ${v("perimeter")} ${answerUnit}.`,
      ];
    case "MEN-001-QL-026":
      return [
        `The hypotenuse is √(${v("legA")}² + ${v("legB")}²) = √${format(value(parameters, solver, "legA") ** 2 + value(parameters, solver, "legB") ** 2)} = ${v("sideC")} ${answerUnit}.`,
      ];
    case "MEN-001-QL-027":
      return [
        `Subtract the known leg’s square from the hypotenuse’s square: √(${v("sideC")}² − ${v("legA")}²) = ${v("legB")} ${answerUnit}.`,
      ];
    case "MEN-001-QL-028":
      return [
        `An equilateral altitude is (√3/2)a, so for side ${v("side")} ${answerUnit} it is ${v("heightCoefficient")}√3 ${answerUnit}.`,
      ];
    case "MEN-001-QL-029":
      return [
        `From (√3/4)a² = ${v("areaCoefficient")}√3, we get a² = ${format(4 * value(parameters, solver, "areaCoefficient"))}; the positive root is ${v("side")} ${answerUnit}.`,
      ];
    default:
      return undefined;
  }
}
