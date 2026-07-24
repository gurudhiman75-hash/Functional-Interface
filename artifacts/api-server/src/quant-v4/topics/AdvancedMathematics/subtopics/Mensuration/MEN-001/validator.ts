import { validateMen001Libraries } from "./library";
import type {
  Men001QuestionPackage,
  Men001ValidationCheck,
  Men001ValidationResult,
} from "./types";

function check(name: string, passed: boolean, message: string): Men001ValidationCheck {
  return { name, passed, message };
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
      "positive-finite-dimensions",
      numericValues.length > 0 && numericValues.every((value) => Number.isFinite(value) && value > 0),
      "Every generated dimension and measure must be positive and finite.",
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
      (question.solver.answerDimension === "AREA" && question.solver.unit === "cm²") ||
        (question.solver.answerDimension === "LENGTH" && question.solver.unit === "cm"),
      "Area must use cm² and length must use cm.",
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
      "finite-output",
      !/NaN|undefined|null|Infinity/i.test(
        `${question.stem} ${question.answer} ${question.options.join(" ")} ${question.explanation.lines.join(" ")}`,
      ),
      "Rendered output must not contain invalid runtime values.",
    ),
  );

  if (question.solveMode === "findTriangleAreaHeron") {
    const { sideA = 0, sideB = 0, sideC = 0 } = question.parameters.values;
    checks.push(
      check(
        "triangle-inequality",
        sideA + sideB > sideC && sideA + sideC > sideB && sideB + sideC > sideA,
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

  return { valid: checks.every((item) => item.passed), checks };
}
