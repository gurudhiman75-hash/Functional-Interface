import type {
  Men001QuestionPackage,
  Men001ValidationCheck,
} from "./types";

type Question = Omit<Men001QuestionPackage, "validation">;

function check(name: string, passed: boolean, message: string): Men001ValidationCheck {
  return { name, passed, message };
}

function number(question: Question, key: string) {
  return Number(question.solver.workingValues[key] ?? 0);
}

export function validateMen001Cp005Exhaustiveness(
  question: Question,
): Men001ValidationCheck[] {
  if (question.canonicalProblemId !== "MEN-CP-005") return [];

  const checks: Men001ValidationCheck[] = [];
  const mode = question.solveMode;

  if (mode === "findJoinedRectanglesCompositePerimeter") {
    checks.push(check(
      "cp005-joined-rectangles-shared-edge",
      number(question, "perimeter") ===
        number(question, "firstPerimeter") +
          number(question, "secondPerimeter") -
          2 * number(question, "sharedEdge"),
      "A joined-rectangle perimeter must subtract the shared internal edge from both component perimeters.",
    ));
  }

  if (mode === "findSquareWithCircularHoleBoundary") {
    checks.push(check(
      "cp005-inner-and-outer-boundary",
      number(question, "perimeter") ===
        number(question, "outerPerimeter") +
          number(question, "innerCircumference"),
      "A region with a circular hole must count both its outer square boundary and inner circular boundary.",
    ));
  }

  if (mode === "findRegularHexagonSideFromPerimeter") {
    checks.push(check(
      "cp005-hexagon-side-perimeter-conservation",
      number(question, "perimeter") === 6 * number(question, "side"),
      "The recovered regular-hexagon side must reproduce the stated six-side perimeter.",
    ));
  }

  if (mode === "findRegularHexagonAreaFromPerimeter") {
    const side = number(question, "side");
    checks.push(check(
      "cp005-hexagon-area-from-perimeter",
      number(question, "perimeter") === 6 * side &&
        number(question, "hexagonAreaCoefficient") === (3 * side ** 2) / 2 &&
        question.solver.exactAnswer.kind === "SURD" &&
        question.solver.canonicalAnswer.kind === "symbolic",
      "Regular-hexagon area from perimeter must first recover the side and then retain the exact √3 area.",
    ));
  }

  if (mode === "findStadiumStraightLengthFromPerimeter") {
    checks.push(check(
      "cp005-reverse-stadium-perimeter",
      number(question, "perimeter") ===
        2 * number(question, "straightLength") +
          number(question, "circumference"),
      "The recovered straight side must reproduce two straight sides plus the full circular end boundary.",
    ));
  }

  if (mode === "findCircleRadiusFromCircleMinusSquareShadedArea") {
    const radius = number(question, "radius");
    checks.push(check(
      "cp005-reverse-circle-square-shading",
      number(question, "circleArea") - number(question, "squareArea") === number(question, "area") &&
        number(question, "squareArea") === 2 * radius ** 2 &&
        number(question, "radiusSquare") === radius ** 2,
      "The recovered radius must reproduce the circle-minus-inscribed-square shaded area.",
    ));
  }

  return checks;
}
