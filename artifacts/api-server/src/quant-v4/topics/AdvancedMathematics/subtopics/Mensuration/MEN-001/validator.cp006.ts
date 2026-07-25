import type {
  Men001QuestionPackage,
  Men001ValidationCheck,
} from "./types";

type Question = Omit<Men001QuestionPackage, "validation">;

function check(name: string, passed: boolean, message: string): Men001ValidationCheck {
  return { name, passed, message };
}

function number(question: Question, key: string) {
  const value = Number(question.solver.workingValues[key]);
  return Number.isFinite(value) ? value : Number.NaN;
}

function same(left: number, right: number) {
  return Number.isFinite(left) && Number.isFinite(right) && Math.abs(left - right) < 1e-9;
}

export function validateMen001Cp006(question: Question): Men001ValidationCheck[] {
  if (question.canonicalProblemId !== "MEN-CP-006") return [];

  const checks: Men001ValidationCheck[] = [
    check(
      "cp006-human-authored-step-depth",
      question.explanation.lines.length >= 5 && question.explanation.lines.length <= 8,
      "CP-006 explanations should normally use five or six meaningful steps, expanding only when the mathematics needs it.",
    ),
    check(
      "cp006-text-sufficient",
      question.explanation.illustration === undefined,
      "CP-006 questions are fully specified in text and should not add decorative illustrations.",
    ),
  ];

  if (question.answerDimension === "PERCENT") {
    checks.push(check(
      "cp006-percent-unit",
      question.solver.unit === "%" && question.answer.endsWith("%"),
      "Percentage-change questions must use the percent answer contract.",
    ));
  }
  if (question.answerDimension === "SCALAR") {
    checks.push(check(
      "cp006-scale-factor-unit",
      question.solver.unit === "times" && question.answer.endsWith(" times"),
      "Scale-factor questions must use the dimensionless times contract.",
    ));
  }

  const w = (key: string) => number(question, key);
  let valid = true;
  let message = "The CP-006 governing relation must be conserved exactly.";

  switch (question.solveMode) {
    case "convertCentimetresToMetres":
      valid = same(w("length"), 100 * w("convertedLength"));
      message = "Centimetres must equal 100 times the converted metre value.";
      break;
    case "convertMetresToCentimetres":
      valid = same(w("convertedLength"), 100 * w("length"));
      message = "The centimetre value must be 100 times the metre value.";
      break;
    case "convertSquareCentimetresToSquareMetres":
      valid = same(w("area"), 10000 * w("convertedArea"));
      message = "Square-centimetre conversion must use the squared factor 10,000.";
      break;
    case "convertSquareMetresToSquareCentimetres":
      valid = same(w("convertedArea"), 10000 * w("area"));
      message = "Square-metre conversion must use the squared factor 10,000.";
      break;
    case "findRectangleAreaWithMixedLengthUnits":
      valid = same(w("breadthMetres"), w("breadth") / 100) &&
        same(w("area"), w("length") * w("breadthMetres"));
      message = "Mixed-unit area must convert the breadth before multiplication.";
      break;
    case "findRectanglePerimeterWithMixedLengthUnits":
      valid = same(w("breadthMetres"), w("breadth") / 100) &&
        same(w("perimeter"), 2 * (w("length") + w("breadthMetres")));
      message = "Mixed-unit perimeter must convert both dimensions to one linear unit.";
      break;
    case "findMissingRectangleLengthWithMixedUnits":
      valid = same(w("breadthMetres"), w("breadth") / 100) &&
        same(w("area"), w("length") * w("breadthMetres"));
      message = "The recovered length must reproduce the stated square-metre area.";
      break;
    case "findSquareAreaAfterSideUnitConversion":
      valid = same(w("sideMetres"), w("side") / 100) &&
        same(w("area"), w("sideMetres") ** 2);
      message = "The side must be converted before applying the square-area formula.";
      break;
    case "findPerimeterAfterLinearScaling":
      valid = same(w("scaledPerimeter"), w("perimeter") * w("scale"));
      message = "Perimeter must follow the linear scale factor directly.";
      break;
    case "findAreaAfterLinearScaling":
      valid = same(w("areaFactor"), w("scale") ** 2) &&
        same(w("scaledArea"), w("area") * w("areaFactor"));
      message = "Area must follow the square of the linear scale factor.";
      break;
    case "findLinearScaleFactorFromPerimeters":
      valid = same(w("scaleFactor"), w("scaledPerimeter") / w("perimeter"));
      message = "The perimeter ratio must equal the linear scale factor.";
      break;
    case "findLinearScaleFactorFromAreas":
      valid = same(w("areaRatio"), w("scaledArea") / w("area")) &&
        same(w("scaleFactor") ** 2, w("areaRatio"));
      message = "The square of the recovered scale factor must equal the area ratio.";
      break;
    case "findOriginalAreaFromScaledArea":
      valid = same(w("areaFactor"), w("scale") ** 2) &&
        same(w("scaledArea"), w("originalArea") * w("areaFactor"));
      message = "Rescaling the recovered original area must reproduce the enlarged area.";
      break;
    case "findAreaPercentIncreaseAfterUniformScaling":
      valid = same(w("areaPercent"), ((100 + w("scale")) ** 2) / 100 - 100);
      message = "Uniform area increase must use the square of the changed linear percentage.";
      break;
    case "findAreaPercentDecreaseAfterUniformScaling":
      valid = same(w("remainingAreaPercent"), ((100 - w("scale")) ** 2) / 100) &&
        same(w("areaPercent"), 100 - w("remainingAreaPercent"));
      message = "Uniform area decrease must square the remaining linear percentage.";
      break;
    case "findAreaPercentIncreaseAfterIndependentDimensionChanges":
      valid = same(
        w("newAreaPercent"),
        ((100 + w("increasePercent")) * (100 - w("decreasePercent"))) / 100,
      ) && same(w("areaPercent"), w("newAreaPercent") - 100);
      message = "Independent dimension changes must be multiplied, not combined linearly.";
      break;
    case "findNewAreaAfterPercentageDimensionChanges":
      valid = same(
        w("scaledArea"),
        w("area") * (100 + w("increasePercent")) * (100 - w("decreasePercent")) / 10000,
      );
      message = "The new area must apply both independent dimension factors.";
      break;
    case "findActualLengthFromMapScale":
      valid = same(w("actualLength"), w("length") * w("scale"));
      message = "Actual map distance must use the linear map scale once.";
      break;
    case "findMapLengthFromActualScale":
      valid = same(w("distance"), w("mapLength") * w("scale"));
      message = "The recovered map length must reproduce the actual distance.";
      break;
    case "findActualAreaFromMapAreaScale":
      valid = same(w("areaScale"), w("scale") ** 2) &&
        same(w("actualArea"), w("area") * w("areaScale"));
      message = "Map area must use the square of the linear map scale.";
      break;
    case "findMapAreaFromActualAreaScale":
      valid = same(w("areaScale"), w("scale") ** 2) &&
        same(w("outerArea"), w("mapArea") * w("areaScale"));
      message = "The recovered map area must scale back to the stated actual area.";
      break;
    case "findActualPlotAreaFromPlanDimensions":
      valid = same(w("actualLength"), w("length") * w("scale")) &&
        same(w("actualBreadth"), w("breadth") * w("scale")) &&
        same(w("actualArea"), w("actualLength") * w("actualBreadth"));
      message = "Both plan dimensions must be converted before calculating actual area.";
      break;
    case "findRectangleLengthFromSquareWire":
      valid = same(w("wireLength"), 4 * w("side")) &&
        same(w("wireLength"), 2 * (w("length") + w("breadth")));
      message = "Square and rectangle perimeters must use the same wire length.";
      break;
    case "findSquareSideFromRectangleWire":
      valid = same(w("wireLength"), 2 * (w("length") + w("breadth"))) &&
        same(w("wireLength"), 4 * w("side"));
      message = "Rectangle and square boundaries must conserve the wire length.";
      break;
    case "findCircleRadiusFromSquareWire":
      valid = same(w("wireLength"), 4 * w("side")) &&
        same(w("wireLength"), 44 * w("radius") / 7);
      message = "Square perimeter and circle circumference must be equal.";
      break;
    case "findSquareSideFromCircularWire":
      valid = same(w("wireLength"), 44 * w("radius") / 7) &&
        same(w("wireLength"), 4 * w("side"));
      message = "Circle circumference and square perimeter must be equal.";
      break;
    case "findCircleRadiusFromRectangleWire":
      valid = same(w("wireLength"), 2 * (w("length") + w("breadth"))) &&
        same(w("wireLength"), 44 * w("radius") / 7);
      message = "Rectangle perimeter and circle circumference must conserve boundary length.";
      break;
    case "findEquilateralTriangleSideFromSquareWire":
      valid = same(w("wireLength"), 4 * w("side")) &&
        same(w("wireLength"), 3 * w("triangleSide"));
      message = "Square and equilateral-triangle perimeters must be equal.";
      break;
    case "findRegularHexagonSideFromSquareWire":
      valid = same(w("wireLength"), 4 * w("side")) &&
        same(w("wireLength"), 6 * w("hexagonSide"));
      message = "Square and regular-hexagon perimeters must be equal.";
      break;
    case "findSquareAreaFromRectangleWire":
      valid = same(w("wireLength"), 2 * (w("length") + w("breadth"))) &&
        same(w("wireLength"), 4 * w("side")) &&
        same(w("squareArea"), w("side") ** 2);
      message = "The square area must be based on the side recovered from the conserved wire.";
      break;
    case "findAreaDifferenceSquareRectangleSamePerimeter":
      valid = same(w("squareArea"), w("side") ** 2) &&
        same(w("rectangleArea"), w("length") * w("breadth")) &&
        same(w("areaDifference"), w("squareArea") - w("rectangleArea"));
      message = "The same-perimeter area difference must subtract the two exact areas.";
      break;
    case "findMaximumRectangleAreaForFixedPerimeter":
      valid = same(w("side"), w("perimeter") / 4) &&
        same(w("maximumArea"), w("side") ** 2);
      message = "The maximum rectangle area at fixed perimeter must come from the square.";
      break;
    case "findAreaDifferenceCircleSquareSamePerimeter":
      valid = same(w("perimeter"), 44 * w("radius") / 7) &&
        same(w("perimeter"), 4 * w("side")) &&
        same(w("areaDifference"), w("circleArea") - w("squareArea"));
      message = "The circle and square must share one perimeter before their areas are compared.";
      break;
    case "findRectangleBreadthFromCircularWireAndLength":
      valid = same(w("wireLength"), 44 * w("radius") / 7) &&
        same(w("wireLength"), 2 * (w("length") + w("breadth")));
      message = "The recovered rectangle breadth must conserve the circular wire length.";
      break;
    case "findCircleAreaFromSquareWire":
      valid = same(w("wireLength"), 4 * w("side")) &&
        same(w("wireLength"), 44 * w("radius") / 7) &&
        same(w("circleArea"), 22 * w("radius") ** 2 / 7);
      message = "The circle area must use the radius recovered from the square wire.";
      break;
    case "findSquareAreaFromCircularWire":
      valid = same(w("wireLength"), 44 * w("radius") / 7) &&
        same(w("wireLength"), 4 * w("side")) &&
        same(w("squareArea"), w("side") ** 2);
      message = "The square area must use the side recovered from the circular wire.";
      break;
  }

  checks.push(check("cp006-governing-relation", valid, message));

  const circularModes = new Set([
    "findCircleRadiusFromSquareWire",
    "findSquareSideFromCircularWire",
    "findCircleRadiusFromRectangleWire",
    "findAreaDifferenceCircleSquareSamePerimeter",
    "findRectangleBreadthFromCircularWireAndLength",
    "findCircleAreaFromSquareWire",
    "findSquareAreaFromCircularWire",
  ]);
  if (circularModes.has(question.solveMode)) {
    checks.push(check(
      "cp006-explicit-pi-policy",
      question.stem.includes("π = 22/7") && question.solver.workingValues.piPolicy === "22/7",
      "Every circular CP-006 transformation must state and preserve π = 22/7.",
    ));
  }

  return checks;
}
