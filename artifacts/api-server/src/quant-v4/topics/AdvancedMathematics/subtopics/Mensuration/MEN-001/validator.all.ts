import { validateMen001QuestionPackage as validateBaseMen001QuestionPackage } from "./validator";
import type {
  Men001QuestionPackage,
  Men001ValidationCheck,
  Men001ValidationResult,
} from "./types";

type Question = Omit<Men001QuestionPackage, "validation">;

function check(name: string, passed: boolean, message: string): Men001ValidationCheck {
  return { name, passed, message };
}

function number(question: Question, key: string) {
  return Number(question.solver.workingValues[key] ?? 0);
}

function dimensionUnitValid(question: Question) {
  return (
    (question.solver.answerDimension === "AREA" && ["cm²", "m²"].includes(question.solver.unit)) ||
    (question.solver.answerDimension === "LENGTH" && ["cm", "m"].includes(question.solver.unit)) ||
    (question.solver.answerDimension === "COST" && question.solver.unit === "₹") ||
    (question.solver.answerDimension === "RATE" && ["₹/m²", "₹/m"].includes(question.solver.unit)) ||
    (question.solver.answerDimension === "ANGLE" && question.solver.unit === "°") ||
    (question.solver.answerDimension === "COUNT" && ["tiles", "revolutions"].includes(question.solver.unit))
  );
}

export function validateMen001QuestionPackage(
  question: Question,
): Men001ValidationResult {
  const base = validateBaseMen001QuestionPackage(question);
  const checks = base.checks.filter((item) => item.name !== "dimension-unit-contract");

  checks.push(check(
    "dimension-unit-contract",
    dimensionUnitValid(question),
    "Length, area, cost, rate, angle and count answers must use compatible units.",
  ));

  if (["findRightTriangleHypotenuseFromLegs", "findRightTriangleMissingLeg"].includes(question.solveMode)) {
    const legA = number(question, "legA");
    const legB = number(question, "legB");
    const sideC = number(question, "sideC");
    checks.push(check(
      "right-triangle-pythagoras",
      legA ** 2 + legB ** 2 === sideC ** 2,
      "Right-triangle recovery states must satisfy Pythagoras exactly.",
    ));
  }

  if (question.solveMode === "findEquilateralHeightFromSide") {
    checks.push(check(
      "equilateral-height-exact-surd",
      question.solver.exactAnswer.kind === "SURD" &&
        question.solver.canonicalAnswer.kind === "symbolic" &&
        question.solver.canonicalAnswer.value.includes("\\sqrt{3}"),
      "Equilateral height must remain an exact √3 expression.",
    ));
  }

  if (question.solveMode === "findEquilateralSideFromArea") {
    const side = number(question, "side");
    const coefficient = number(question, "areaCoefficient");
    checks.push(check(
      "equilateral-area-side-inverse",
      side ** 2 === 4 * coefficient,
      "Recovered equilateral side must reproduce the exact stated area coefficient.",
    ));
  }

  if (question.solveMode === "findInnerRadiusFromAnnulusArea") {
    const outerRadius = number(question, "outerRadius");
    const innerRadius = number(question, "innerRadius");
    const area = number(question, "area");
    checks.push(check(
      "annulus-inner-radius-contract",
      outerRadius > innerRadius && (22 * (outerRadius ** 2 - innerRadius ** 2)) / 7 === area,
      "Recovered inner radius must preserve radius order and the exact annular area.",
    ));
  }

  if (["findRadiusFromArcLengthAndAngle", "findRadiusFromSectorAreaAndAngle"].includes(question.solveMode)) {
    const radius = number(question, "radius");
    const angleDegrees = number(question, "angleDegrees");
    const expected = question.solveMode === "findRadiusFromArcLengthAndAngle"
      ? ((angleDegrees / 360) * 44 * radius) / 7
      : ((angleDegrees / 360) * 22 * radius ** 2) / 7;
    const supplied = question.solveMode === "findRadiusFromArcLengthAndAngle"
      ? number(question, "arcLength")
      : number(question, "sectorArea");
    checks.push(check(
      "reverse-circle-fraction-contract",
      Number.isInteger(radius) && expected === supplied,
      "Recovered radius must exactly reproduce the stated arc length or sector area.",
    ));
  }

  if (question.solveMode === "findWheelRevolutionsFromDistance") {
    checks.push(check(
      "wheel-revolution-contract",
      question.solver.unit === "revolutions" &&
        Number.isInteger(number(question, "revolutions")) &&
        number(question, "circumference") * number(question, "revolutions") === number(question, "distance"),
      "Wheel revolution count must be an exact distance-to-circumference quotient.",
    ));
  }

  if (question.solveMode === "findWheelRadiusFromDistanceAndRevolutions") {
    checks.push(check(
      "wheel-radius-contract",
      number(question, "circumference") * number(question, "revolutions") === number(question, "distance"),
      "Recovered wheel radius must reproduce the travelled distance exactly.",
    ));
  }

  if (["findOuterRectangularPathWidthFromArea", "findInnerRectangularPathWidthFromArea"].includes(question.solveMode)) {
    checks.push(check(
      "reverse-rectangular-path-contract",
      number(question, "outerArea") - number(question, "innerArea") === number(question, "area") &&
        number(question, "outerLength") > number(question, "innerLength") &&
        number(question, "outerBreadth") > number(question, "innerBreadth"),
      "Recovered rectangular path width must preserve dimensions and border-area subtraction.",
    ));
  }

  if (["findOuterCircularPathWidthFromArea", "findInnerCircularPathWidthFromArea"].includes(question.solveMode)) {
    checks.push(check(
      "reverse-circular-path-contract",
      question.stem.includes("π = 22/7") &&
        question.solver.workingValues.piPolicy === "22/7" &&
        number(question, "outerRadius") > number(question, "innerRadius") &&
        number(question, "outerArea") - number(question, "innerArea") === number(question, "area") &&
        number(question, "outerRadius") - number(question, "innerRadius") === number(question, "pathWidth"),
      "Recovered circular path width must preserve radius order, π policy and annular area.",
    ));
  }

  if (["findCrossRoadArea", "findRemainingFieldAreaAfterCrossRoads"].includes(question.solveMode)) {
    const roadUnion = number(question, "roadAreaA") + number(question, "roadAreaB") - number(question, "overlapArea");
    const unionValid = roadUnion === number(question, "roadArea");
    const remainingValid = question.solveMode === "findRemainingFieldAreaAfterCrossRoads"
      ? number(question, "fieldArea") - number(question, "roadArea") === number(question, "area")
      : true;
    checks.push(check(
      "cross-road-inclusion-exclusion",
      unionValid && remainingValid,
      "Cross-road area must add both strips, subtract their overlap once and conserve remaining field area.",
    ));
  }

  if (question.solveMode === "findUncoveredFloorAreaAfterTiles") {
    checks.push(check(
      "partial-tiling-conservation",
      number(question, "tileCount") * number(question, "tileArea") === number(question, "coveredArea") &&
        number(question, "floorArea") - number(question, "coveredArea") === number(question, "area"),
      "Partial tiling must conserve covered and uncovered floor area.",
    ));
  }

  if (question.solveMode === "findAreaRateFromTotalCost") {
    checks.push(check(
      "area-rate-recovery",
      question.solver.unit === "₹/m²" &&
        number(question, "ratePerSquareMetre") * number(question, "area") === number(question, "cost"),
      "Area rate must reproduce total cost when multiplied by area.",
    ));
  }

  if (question.solveMode === "findFencingRateFromTotalCost") {
    checks.push(check(
      "fencing-rate-recovery",
      question.solver.unit === "₹/m" &&
        number(question, "ratePerMetre") * number(question, "perimeter") === number(question, "cost"),
      "Fencing rate must reproduce total cost when multiplied by boundary length.",
    ));
  }

  if (question.solveMode === "findInnerRectangularPathTilesRequired") {
    checks.push(check(
      "inner-path-tile-contract",
      question.solver.unit === "tiles" &&
        Number.isInteger(number(question, "tileCount")) &&
        number(question, "tileCount") * number(question, "tileArea") === number(question, "area") &&
        number(question, "outerArea") - number(question, "innerArea") === number(question, "area"),
      "Inside-path tile count must exactly cover the computed border area.",
    ));
  }

  return { valid: checks.every((item) => item.passed), checks };
}
