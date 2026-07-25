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

const ADDITION_MODES = new Set([
  "findRectangleSemicircleCompositeArea",
  "findStadiumCompositeArea",
  "findRectangleTriangleCompositeArea",
  "findTwoRectangleCompositeArea",
]);

const SUBTRACTION_MODES = new Set([
  "findLShapeAreaBySubtraction",
  "findSquareMinusCircleShadedArea",
  "findCircleMinusSquareShadedArea",
  "findRectangleMinusTwoSemicirclesArea",
  "findFourCornerQuadrantsShadedArea",
]);

export function validateMen001Cp005(
  question: Question,
): Men001ValidationCheck[] {
  if (question.canonicalProblemId !== "MEN-CP-005") return [];
  const checks: Men001ValidationCheck[] = [];
  const mode = question.solveMode;

  checks.push(check(
    "cp005-text-only-stem-contract",
    question.traceability.diagramRequirement === "NONE",
    "The current CP-005 runtime slice must use unambiguous text-only stems; visuals remain explanation-only.",
  ));

  if (ADDITION_MODES.has(mode)) {
    const first = number(question, "rectangleArea");
    const second = mode === "findRectangleSemicircleCompositeArea"
      ? number(question, "semicircleArea")
      : mode === "findStadiumCompositeArea"
        ? number(question, "circleArea")
        : mode === "findRectangleTriangleCompositeArea"
          ? number(question, "triangleArea")
          : number(question, "componentArea");
    checks.push(check(
      "cp005-area-addition-conservation",
      first > 0 && second > 0 && first + second === number(question, "area"),
      "Composite addition must equal the sum of two positive non-overlapping component areas.",
    ));
  }

  if (SUBTRACTION_MODES.has(mode)) {
    const outer = mode === "findLShapeAreaBySubtraction"
      ? number(question, "outerArea")
      : mode === "findRectangleMinusTwoSemicirclesArea"
        ? number(question, "rectangleArea")
        : mode === "findCircleMinusSquareShadedArea"
          ? number(question, "circleArea")
          : number(question, "squareArea");
    const removed = mode === "findLShapeAreaBySubtraction"
      ? number(question, "cutoutArea")
      : mode === "findRectangleMinusTwoSemicirclesArea"
        ? number(question, "circleArea")
        : mode === "findCircleMinusSquareShadedArea"
          ? number(question, "squareArea")
          : number(question, "circleArea");
    checks.push(check(
      "cp005-area-subtraction-conservation",
      outer > removed && outer - removed === number(question, "area"),
      "Shaded or cut-out area must equal the larger enclosing area minus the removed component.",
    ));
  }

  if (mode === "findInscribedCircleAreaInSquare") {
    checks.push(check(
      "cp005-inscribed-circle-relation",
      number(question, "diameter") === number(question, "side") &&
        number(question, "radius") * 2 === number(question, "side") &&
        number(question, "circleArea") === number(question, "area"),
      "An inscribed circle must use the square side as its diameter.",
    ));
  }

  if (mode === "findInscribedSquareAreaInCircle") {
    checks.push(check(
      "cp005-inscribed-square-relation",
      number(question, "diameter") === 2 * number(question, "radius") &&
        number(question, "squareArea") * 2 === number(question, "diameter") ** 2,
      "An inscribed square must use the circle diameter as its diagonal.",
    ));
  }

  if (mode === "findLargestCircleRadiusInRectangle") {
    checks.push(check(
      "cp005-largest-circle-fit",
      number(question, "smallerSide") === Math.min(number(question, "length"), number(question, "breadth")) &&
        number(question, "radius") * 2 === number(question, "smallerSide"),
      "The largest circle diameter must equal the rectangle's smaller side.",
    ));
  }

  if (mode === "findRegularHexagonAreaFromSide") {
    const side = number(question, "side");
    const coefficient = number(question, "hexagonAreaCoefficient");
    checks.push(check(
      "cp005-regular-hexagon-exact-area",
      question.solver.exactAnswer.kind === "SURD" &&
        question.solver.canonicalAnswer.kind === "symbolic" &&
        coefficient === (3 * side ** 2) / 2,
      "A regular hexagon must retain the exact (3√3/2)a² area.",
    ));
  }

  if (mode === "findRectangleSemicircleCompositePerimeter") {
    checks.push(check(
      "cp005-rectangle-semicircle-boundary",
      number(question, "perimeter") ===
        2 * number(question, "length") + number(question, "breadth") + number(question, "semicircleArc"),
      "The shared diameter must be omitted from the exposed rectangle-plus-semicircle boundary.",
    ));
  }

  if (mode === "findStadiumCompositePerimeter") {
    checks.push(check(
      "cp005-stadium-boundary",
      number(question, "perimeter") ===
        2 * number(question, "straightLength") + number(question, "circumference"),
      "A stadium boundary must contain two straight sides plus one full circumference.",
    ));
  }

  if (mode === "findLShapePerimeter") {
    checks.push(check(
      "cp005-l-shape-boundary",
      number(question, "perimeter") ===
        2 * (number(question, "outerLength") + number(question, "outerBreadth")),
      "A corner cut-out replaces removed boundary lengths with equal inner lengths.",
    ));
  }

  if (mode === "findRectangleLengthFromCompositeArea") {
    checks.push(check(
      "cp005-reverse-composite-area",
      number(question, "rectangleArea") + number(question, "semicircleArea") === number(question, "area") &&
        number(question, "length") * number(question, "breadth") === number(question, "rectangleArea"),
      "Recovered rectangle length must reproduce the stated rectangle-plus-semicircle area.",
    ));
  }

  if (mode === "findSquareSideFromShadedArea") {
    checks.push(check(
      "cp005-reverse-shaded-square",
      number(question, "squareArea") - number(question, "circleArea") === number(question, "area") &&
        number(question, "side") ** 2 === number(question, "sideSquare"),
      "Recovered square side must reproduce the stated area outside the inscribed circle.",
    ));
  }

  if (question.stem.includes("π = 22/7")) {
    checks.push(check(
      "cp005-explicit-pi-contract",
      question.solver.workingValues.piPolicy === "22/7",
      "Every CP-005 circular state must use the explicit π = 22/7 policy stated in its stem.",
    ));
  }

  return checks;
}
