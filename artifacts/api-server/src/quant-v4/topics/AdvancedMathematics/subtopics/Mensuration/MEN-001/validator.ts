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

function check(
  name: string,
  passed: boolean,
  message: string,
): Men001ValidationCheck {
  return { name, passed, message };
}

function dimensionUnitValid(
  question: Omit<Men001QuestionPackage, "validation">,
) {
  return (
    (question.solver.answerDimension === "AREA" &&
      ["cm²", "m²"].includes(question.solver.unit)) ||
    (question.solver.answerDimension === "LENGTH" &&
      ["cm", "m"].includes(question.solver.unit)) ||
    (question.solver.answerDimension === "COST" &&
      question.solver.unit === "₹") ||
    (question.solver.answerDimension === "ANGLE" &&
      question.solver.unit === "°")
  );
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
  const expectedOption =
    question.solver.canonicalAnswer.kind === "symbolic"
      ? question.solver.canonicalAnswer.rendered
      : question.solver.canonicalAnswer.display;
  const expectedIllustration = buildMen001ExplanationIllustration(
    question.parameters,
    question.solver,
  );
  const illustrationPayload = question.explanation.illustration
    ? JSON.stringify(question.explanation.illustration)
    : "";

  checks.push(
    check(
      "library-contract",
      libraryValidation.valid,
      libraryValidation.valid
        ? "Question-language and registry contracts agree."
        : libraryValidation.failures.join("; "),
    ),
  );
  checks.push(
    check(
      "english-only-runtime-proof",
      question.language === "en",
      "MEN-001 runtime proof must expose English only.",
    ),
  );
  checks.push(
    check(
      "positive-finite-values",
      numericValues.length > 0 &&
        numericValues.every((value) => Number.isFinite(value) && value > 0),
      "Every generated dimension, ratio, rate and measure must be positive and finite.",
    ),
  );
  checks.push(
    check(
      "resolved-stem",
      !/\{[A-Za-z0-9_]+\}/.test(question.stem),
      "The rendered stem must not contain unresolved placeholders.",
    ),
  );
  checks.push(
    check(
      "option-count",
      question.options.length === 4,
      "A runtime-proof question must contain exactly four options.",
    ),
  );
  checks.push(
    check(
      "unique-options",
      new Set(question.options.map((option) => option.trim().toLowerCase())).size ===
        question.options.length,
      "Options must be unique after normalization.",
    ),
  );
  checks.push(
    check(
      "valid-correct-index",
      Number.isInteger(question.correctIndex) &&
        question.correctIndex >= 0 &&
        question.correctIndex < question.options.length,
      "correctIndex must point to one of the four options.",
    ),
  );
  checks.push(
    check(
      "correct-option-contract",
      correctOption === expectedOption,
      `Correct option must equal the canonical answer ${expectedOption}.`,
    ),
  );
  checks.push(
    check(
      "dimension-unit-contract",
      dimensionUnitValid(question),
      "Length, area, cost and angle answers must use compatible units.",
    ),
  );
  checks.push(
    check(
      "reasoning-depth",
      question.reasoningGraph.nodes.length >= 3,
      "The reasoning graph must contain identification, relation and evaluation stages.",
    ),
  );
  checks.push(
    check(
      "explanation-depth",
      question.explanation.lines.length >= 5,
      "The explanation must contain at least five meaningful lines.",
    ),
  );
  checks.push(
    check(
      "explanation-illustration-policy",
      JSON.stringify(question.explanation.illustration ?? null) ===
        JSON.stringify(expectedIllustration ?? null),
      "Explanation illustration must match the solve-mode illustration policy.",
    ),
  );
  checks.push(
    check(
      "explanation-illustration-necessity",
      Boolean(question.explanation.illustration) ===
        hasMen001ExplanationIllustration(question.solveMode),
      "Illustrations must appear only for solve modes that genuinely benefit from them.",
    ),
  );
  checks.push(
    check(
      "explanation-illustration-font-neutral",
      !/font[-_ ]?(family|size|weight)|typeface/i.test(illustrationPayload),
      "Explanation illustration data must not embed font styling.",
    ),
  );
  checks.push(
    check(
      "finite-output",
      !/NaN|undefined|null|Infinity/i.test(
        `${question.stem} ${question.answer} ${question.options.join(" ")} ${question.explanation.lines.join(" ")} ${illustrationPayload}`,
      ),
      "Rendered output must not contain invalid runtime values.",
    ),
  );

  if (question.explanation.illustration) {
    checks.push(
      check(
        "explanation-illustration-accessibility",
        question.explanation.illustration.accessibleText.trim().length >= 30,
        "Every explanation illustration requires meaningful accessible text.",
      ),
    );
    checks.push(
      check(
        "explanation-illustration-not-to-scale",
        question.explanation.illustration.notToScale === true,
        "Current explanation diagrams must be explicitly marked not to scale.",
      ),
    );
    checks.push(
      check(
        "explanation-illustration-labels",
        Object.values(question.explanation.illustration.labels).every(
          (label) => typeof label === "string" && label.trim().length > 0,
        ),
        "Every explanation illustration label must be populated from solved values.",
      ),
    );
  }

  if (
    ["findTriangleAreaHeron", "findTriangleAreaFromSideRatioAndPerimeter"].includes(
      question.solveMode,
    )
  ) {
    const sideA = Number(question.solver.workingValues.sideA ?? 0);
    const sideB = Number(question.solver.workingValues.sideB ?? 0);
    const sideC = Number(question.solver.workingValues.sideC ?? 0);
    checks.push(
      check(
        "triangle-inequality",
        sideA + sideB > sideC &&
          sideA + sideC > sideB &&
          sideB + sideC > sideA,
        "Heron states must satisfy triangle inequality.",
      ),
    );
  }

  if (question.solveMode === "findEquilateralTriangleArea") {
    checks.push(
      check(
        "exact-surd-policy",
        question.solver.exactAnswer.kind === "SURD" &&
          question.solver.canonicalAnswer.kind === "symbolic" &&
          question.solver.canonicalAnswer.value.includes("\\sqrt{3}"),
        "Equilateral area must remain an exact √3 expression.",
      ),
    );
  }

  if (
    ["findIsoscelesTriangleArea", "findIsoscelesHeight"].includes(
      question.solveMode,
    )
  ) {
    const equalSide = Number(question.solver.workingValues.equalSide ?? 0);
    const halfBase = Number(question.solver.workingValues.halfBase ?? 0);
    const height = Number(question.solver.workingValues.height ?? 0);
    checks.push(
      check(
        "isosceles-right-triangle",
        equalSide * equalSide === halfBase * halfBase + height * height,
        "The generated isosceles altitude must satisfy Pythagoras exactly.",
      ),
    );
  }

  if (
    [
      "findTriangleAreaFromSideRatioAndPerimeter",
      "findLargestTriangleSideFromRatioAndPerimeter",
      "findSmallestTriangleSideFromRatioAndPerimeter",
    ].includes(question.solveMode)
  ) {
    const perimeter = Number(question.solver.workingValues.perimeter ?? 0);
    const sideTotal =
      Number(question.solver.workingValues.sideA ?? 0) +
      Number(question.solver.workingValues.sideB ?? 0) +
      Number(question.solver.workingValues.sideC ?? 0);
    checks.push(
      check(
        "ratio-perimeter-conservation",
        perimeter === sideTotal,
        "Ratio-derived sides must add exactly to the stated perimeter.",
      ),
    );
  }

  if (question.solveMode === "findTriangularPlotCost") {
    const area = Number(question.solver.workingValues.area ?? 0);
    const rate = Number(question.solver.workingValues.ratePerSquareMetre ?? 0);
    const cost = Number(question.solver.workingValues.cost ?? 0);
    checks.push(
      check(
        "cost-consistency",
        area * rate === cost &&
          question.solver.canonicalAnswer.kind === "currency",
        "Cost must equal area multiplied by the registered rate.",
      ),
    );
  }

  if (question.canonicalProblemId === "MEN-CP-003") {
    checks.push(
      check(
        "circle-pi-policy",
        question.stem.includes("π = 22/7") &&
          question.solver.workingValues.piPolicy === "22/7",
        "Every CP-003 question and solution must use the explicit π = 22/7 policy.",
      ),
    );
  }

  if (
    ["findArcLength", "findSectorArea", "findSectorPerimeter"].includes(
      question.solveMode,
    )
  ) {
    const angle = Number(question.solver.workingValues.angleDegrees ?? 0);
    checks.push(
      check(
        "central-angle-domain",
        angle > 0 && angle <= 360,
        "Generated central angles must lie in (0, 360].",
      ),
    );
  }

  if (
    ["findCentralAngleFromArcLength", "findCentralAngleFromSectorArea"].includes(
      question.solveMode,
    )
  ) {
    const angle = Number(question.solver.workingValues.angleDegrees ?? 0);
    checks.push(
      check(
        "recovered-angle-domain",
        Number.isInteger(angle) && angle > 0 && angle <= 360,
        "Recovered central angles must be exact integer degrees.",
      ),
    );
  }

  if (
    ["findAnnulusArea", "findOuterRadiusFromAnnulusArea"].includes(
      question.solveMode,
    )
  ) {
    const innerRadius = Number(question.solver.workingValues.innerRadius ?? 0);
    const outerRadius = Number(question.solver.workingValues.outerRadius ?? 0);
    checks.push(
      check(
        "annulus-radius-order",
        outerRadius > innerRadius,
        "An annulus must have an outer radius greater than its inner radius.",
      ),
    );
  }

  return {
    valid: checks.every((item) => item.passed),
    checks,
  };
}
