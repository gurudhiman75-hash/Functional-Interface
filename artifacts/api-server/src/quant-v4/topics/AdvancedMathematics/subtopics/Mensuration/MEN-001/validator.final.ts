import { validateMen001QuestionPackage as validateAllMen001QuestionPackage } from "./validator.all";
import type {
  Men001QuestionPackage,
  Men001ValidationCheck,
  Men001ValidationResult,
} from "./types";

type Question = Omit<Men001QuestionPackage, "validation">;

function check(name: string, passed: boolean, message: string): Men001ValidationCheck {
  return { name, passed, message };
}

export function validateMen001QuestionPackage(
  question: Question,
): Men001ValidationResult {
  const result = validateAllMen001QuestionPackage(question);
  const checks = [...result.checks];

  if ([
    "findOuterRectangularPathTilesRequired",
    "findInnerRectangularPathTilesRequired",
  ].includes(question.solveMode)) {
    const illustration = question.explanation.illustration;
    const labelsUseMetres =
      illustration?.kind === "RECTANGULAR_BORDER_BAND" &&
      illustration.labels.outerLength.endsWith(" m") &&
      illustration.labels.outerBreadth.endsWith(" m") &&
      illustration.labels.innerLength.endsWith(" m") &&
      illustration.labels.innerBreadth.endsWith(" m") &&
      illustration.labels.pathWidth.endsWith(" m");
    checks.push(check(
      "path-tile-illustration-source-unit",
      labelsUseMetres,
      "Path-tile diagrams must preserve the metre units stated in the question rather than inheriting the count-answer unit.",
    ));
  }

  return { valid: checks.every((item) => item.passed), checks };
}
