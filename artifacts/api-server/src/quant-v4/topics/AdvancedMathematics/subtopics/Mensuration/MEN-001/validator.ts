import {
  buildMen001ExplanationIllustration,
  hasMen001ExplanationIllustration,
} from "./explanation-illustration.all";
import { validateMen001Libraries } from "./library";
import type {
  Men001QuestionPackage,
  Men001ValidationCheck,
  Men001ValidationResult,
} from "./types";

function check(name: string, passed: boolean, message: string): Men001ValidationCheck {
  return { name, passed, message };
}

function dimensionUnitValid(question: Omit<Men001QuestionPackage, "validation">) {
  return (
    (question.solver.answerDimension === "AREA" && ["cm²", "m²"].includes(question.solver.unit)) ||
    (question.solver.answerDimension === "LENGTH" && ["cm", "m"].includes(question.solver.unit)) ||
    (question.solver.answerDimension === "COST" && question.solver.unit === "₹") ||
    (question.solver.answerDimension === "ANGLE" && question.solver.unit === "°") ||
    (question.solver.answerDimension === "COUNT" && question.solver.unit === "tiles")
  );
}

function number(question: Omit<Men001QuestionPackage, "validation">, key: string) {
  return Number(question.solver.workingValues[key] ?? 0);
}

export function validateMen001QuestionPackage(
  question: Omit<Men001QuestionPackage, "validation">,
): Men001ValidationResult {
  const checks: Men001ValidationCheck[] = [];
  const libraryValidation = validateMen001Libraries();
  const numericValues = Object.values(question.parameters.values).filter(
    (value): value is number => typeof value === "number",
  );
  const correctOption = question.options[question.correctIndex];
  const expectedOption = question.solver.canonicalAnswer.kind === "symbolic"
    ? question.solver.canonicalAnswer.rendered
    : question.solver.canonicalAnswer.display;
  const expectedIllustration = buildMen001ExplanationIllustration(question.parameters, question.solver);
  const illustrationPayload = question.explanation.illustration
    ? JSON.stringify(question.explanation.illustration)
    : "";

  checks.push(check(
    "library-contract",
    libraryValidation.valid,
    libraryValidation.valid ? "Question-language and registry contracts agree." : libraryValidation.failures.join("; "),
  ));
  checks.push(check("english-only-runtime-proof", question.language === "en", "MEN-001 runtime proof must expose English only."));
  checks.push(check(
    "positive-finite-values",
    numericValues.length > 0 && numericValues.every((value) => Number.isFinite(value) && value > 0),
    "Every generated dimension, ratio, rate and measure must be positive and finite.",
  ));
  checks.push(check("resolved-stem", !/\{[A-Za-z0-9_]+\}/.test(question.stem), "The rendered stem must not contain unresolved placeholders."));
  checks.push(check("option-count", question.options.length === 4, "A runtime-proof question must contain exactly four options."));
  checks.push(check(
    "unique-options",
    new Set(question.options.map((option) => option.trim().toLowerCase())).size === question.options.length,
    "Options must be unique after normalization.",
  ));
  checks.push(check(
    "valid-correct-index",
    Number.isInteger(question.correctIndex) && question.correctIndex >= 0 && question.correctIndex < question.options.length,
    "correctIndex must point to one of the four options.",
  ));
  checks.push(check("correct-option-contract", correctOption === expectedOption, `Correct option must equal the canonical answer ${expectedOption}.`));
  checks.push(check("dimension-unit-contract", dimensionUnitValid(question), "Length, area, cost, angle and count answers must use compatible units."));
  checks.push(check("reasoning-depth", question.reasoningGraph.nodes.length >= 3, "The reasoning graph must contain identification, relation and evaluation stages."));
  checks.push(check("explanation-depth", question.explanation.lines.length >= 5, "The explanation must contain at least five meaningful lines."));
  checks.push(check(
    "explanation-illustration-policy",
    JSON.stringify(question.explanation.illustration ?? null) === JSON.stringify(expectedIllustration ?? null),
    "Explanation illustration must match the solve-mode illustration policy.",
  ));
  checks.push(check(
    "explanation-illustration-necessity",
    Boolean(question.explanation.illustration) === hasMen001ExplanationIllustration(question.solveMode),
    "Illustrations must appear only for solve modes that genuinely benefit from them.",
  ));
  checks.push(check(
    "explanation-illustration-font-neutral",
    !/font[-_ ]?(family|size|weight)|typeface/i.test(illustrationPayload),
    "Explanation illustration data must not embed font styling.",
  ));
  checks.push(check(
    "finite-output",
    !/NaN|undefined|null|Infinity/i.test(`${question.stem} ${question.answer} ${question.options.join(" ")} ${question.explanation.lines.join(" ")} ${illustrationPayload}`),
    "Rendered output must not contain invalid runtime values.",
  ));

  if (question.explanation.illustration) {
    checks.push(check(
      "explanation-illustration-accessibility",
      question.explanation.illustration.accessibleText.trim().length >= 30,
      "Every explanation illustration requires meaningful accessible text.",
    ));
    checks.push(check(
      "explanation-illustration-not-to-scale",
      question.explanation.illustration.notToScale === true,
      "Current explanation diagrams must be explicitly marked not to scale.",
    ));
    checks.push(check(
      "explanation-illustration-labels",
      Object.values(question.explanation.illustration.labels).every(
        (label) => typeof label === "string" && label.trim().length > 0,
      ),
      "Every explanation illustration label must be populated from solved values.",
    ));
  }

  if (["findTriangleAreaHeron", "findTriangleAreaFromSideRatioAndPerimeter"].includes(question.solveMode)) {
    const sideA = number(question, "sideA");
    const sideB = number(question, "sideB");
    const sideC = number(question, "sideC");
    checks.push(check(
      "triangle-inequality",
      sideA + sideB > sideC && sideA + sideC > sideB && sideB + sideC > sideA,
      "Heron states must satisfy triangle inequality.",
    ));
  }

  if (question.solveMode === "findEquilateralTriangleArea") {
    checks.push(check(
      "exact-surd-policy",
      question.solver.exactAnswer.kind === "SURD" &&
        question.solver.canonicalAnswer.kind === "symbolic" &&
        question.solver.canonicalAnswer.value.includes("\\sqrt{3}"),
      "Equilateral area must remain an exact √3 expression.",
    ));
  }

  if (["findIsoscelesTriangleArea", "findIsoscelesHeight"].includes(question.solveMode)) {
    const equalSide = number(question, "equalSide");
    const halfBase = number(question, "halfBase");
    const height = number(question, "height");
    checks.push(check(
      "isosceles-right-triangle",
      equalSide ** 2 === halfBase ** 2 + height ** 2,
      "The generated isosceles altitude must satisfy Pythagoras exactly.",
    ));
  }

  if ([
    "findTriangleAreaFromSideRatioAndPerimeter",
    "findLargestTriangleSideFromRatioAndPerimeter",
    "findSmallestTriangleSideFromRatioAndPerimeter",
  ].includes(question.solveMode)) {
    const perimeter = number(question, "perimeter");
    const sideTotal = number(question, "sideA") + number(question, "sideB") + number(question, "sideC");
    checks.push(check("ratio-perimeter-conservation", perimeter === sideTotal, "Ratio-derived sides must add exactly to the stated perimeter."));
  }

  if (question.solveMode === "findTriangularPlotCost") {
    const area = number(question, "area");
    const rate = number(question, "ratePerSquareMetre");
    const cost = number(question, "cost");
    checks.push(check(
      "cost-consistency",
      area * rate === cost && question.solver.canonicalAnswer.kind === "currency",
      "Cost must equal area multiplied by the registered rate.",
    ));
  }

  if (question.canonicalProblemId === "MEN-CP-003") {
    checks.push(check(
      "circle-pi-policy",
      question.stem.includes("π = 22/7") && question.solver.workingValues.piPolicy === "22/7",
      "Every CP-003 question and solution must use the explicit π = 22/7 policy.",
    ));
  }

  if (["findArcLength", "findSectorArea", "findSectorPerimeter"].includes(question.solveMode)) {
    const angle = number(question, "angleDegrees");
    checks.push(check("central-angle-domain", angle > 0 && angle <= 360, "Generated central angles must lie in (0, 360]."));
  }

  if (["findCentralAngleFromArcLength", "findCentralAngleFromSectorArea"].includes(question.solveMode)) {
    const angle = number(question, "angleDegrees");
    checks.push(check("recovered-angle-domain", Number.isInteger(angle) && angle > 0 && angle <= 360, "Recovered central angles must be exact integer degrees."));
  }

  if (["findAnnulusArea", "findOuterRadiusFromAnnulusArea"].includes(question.solveMode)) {
    checks.push(check(
      "annulus-radius-order",
      number(question, "outerRadius") > number(question, "innerRadius"),
      "An annulus must have an outer radius greater than its inner radius.",
    ));
  }

  if (question.canonicalProblemId === "MEN-CP-004") {
    if ([
      "findOuterRectangularPathArea",
      "findInnerRectangularPathArea",
      "findOuterSquarePathArea",
      "findInnerSquarePathArea",
      "findRectangularPathCost",
      "findOuterSquarePathWidthFromArea",
      "findRectangularBorderTilesRequired",
    ].includes(question.solveMode)) {
      checks.push(check(
        "rectangular-border-area-conservation",
        number(question, "outerArea") - number(question, "innerArea") === number(question, "area"),
        "Rectangular and square border area must equal outer area minus inner area.",
      ));
    }

    if (["findOuterCircularPathArea", "findInnerCircularPathArea", "findCircularPathCost"].includes(question.solveMode)) {
      checks.push(check(
        "circular-path-contract",
        question.stem.includes("π = 22/7") &&
          question.solver.workingValues.piPolicy === "22/7" &&
          number(question, "outerRadius") > number(question, "innerRadius") &&
          number(question, "outerArea") - number(question, "innerArea") === number(question, "area"),
        "Circular paths must preserve radius order, explicit π policy and area subtraction.",
      ));
    }

    if (["findRectangularTilesRequiredForFloor", "findSquareTilesRequiredForFloor"].includes(question.solveMode)) {
      checks.push(check(
        "tile-count-contract",
        Number.isInteger(number(question, "tileCount")) &&
          number(question, "tileCount") * number(question, "tileArea") === number(question, "floorArea") &&
          question.solver.unit === "tiles",
        "Tile count must be an exact whole-number floor-area to tile-area quotient.",
      ));
    }

    if (question.solveMode === "findRectangularBorderTilesRequired") {
      checks.push(check(
        "border-tile-count-contract",
        Number.isInteger(number(question, "tileCount")) &&
          number(question, "tileCount") * number(question, "tileArea") === number(question, "area") &&
          question.solver.unit === "tiles",
        "Border tile count must exactly cover the computed border area.",
      ));
    }

    if (question.solveMode === "findTilePurchaseCostForFloor") {
      checks.push(check(
        "tile-cost-contract",
        number(question, "tileCount") * number(question, "costPerTile") === number(question, "cost"),
        "Tile purchase cost must equal tile count multiplied by unit tile price.",
      ));
    }

    if (["findRectangularFencingCostWithGate", "findGateWidthFromUsedWire"].includes(question.solveMode)) {
      checks.push(check(
        "gate-boundary-conservation",
        number(question, "perimeter") - number(question, "gateWidth") ===
          (question.solveMode === "findGateWidthFromUsedWire" ? number(question, "wireLength") : number(question, "fenceLength")),
        "The unfenced gate opening and used boundary length must conserve the full perimeter.",
      ));
    }

    if (question.solveMode === "findCircularFencingCost") {
      checks.push(check(
        "circular-fencing-pi-policy",
        question.stem.includes("π = 22/7") && question.solver.workingValues.piPolicy === "22/7",
        "Circular fencing must use the explicit π = 22/7 policy.",
      ));
    }
  }

  return { valid: checks.every((item) => item.passed), checks };
}
