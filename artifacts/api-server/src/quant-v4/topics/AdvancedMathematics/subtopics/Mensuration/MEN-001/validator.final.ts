import { getFinalMen001NaturalExplanationProfile } from "./natural-explanation-profile-final";
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

function hasWorkedArithmetic(lines: readonly string[]) {
  const numericTokens = lines.join(" ").match(/\d+(?:\.\d+)?/g) ?? [];
  return numericTokens.length >= 2;
}

function answerValueAppears(question: Question, rendered: string) {
  const answer = question.solver.canonicalAnswer;
  if (answer.kind === "symbolic") {
    const expected = answer.display
      .replace(/\s*(?:cm²|m²|cm|m)$/, "")
      .replace(/\s+/g, "");
    return rendered.replace(/\s+/g, "").includes(expected);
  }
  return new RegExp(`(^|\\D)${String(answer.value).replace(".", "\\.")}(?=\\D|$)`).test(
    rendered.replaceAll(",", ""),
  );
}

export function validateMen001QuestionPackage(
  question: Question,
): Men001ValidationResult {
  const result = validateAllMen001QuestionPackage(question);
  const checks = result.checks.filter(
    (item) =>
      item.name !== "explanation-depth" &&
      item.name !== "explanation-verification-step",
  );
  const profile = getFinalMen001NaturalExplanationProfile(
    question.questionLanguageId,
  );
  const explanationLines = question.explanation.lines;
  const rendered = explanationLines.join(" ");
  const genericPaddingPattern = /^(Check:|Substitution:|Calculation:|Here, A =|Here, P =|The required quantity is|This value measures|The result is|Multiplying this unit rate|The count refers)/i;

  checks.push(check(
    "manual-explanation-profile",
    Boolean(profile),
    "Every QL must retain its context-aware editorial profile.",
  ));
  checks.push(check(
    "manual-explanation-opening",
    Boolean(profile) && explanationLines[0] === profile!.opening,
    "The authored explanation must begin in the question's own context.",
  ));
  checks.push(check(
    "manual-explanation-length",
    explanationLines.length >= 2 && explanationLines.length <= 4,
    "The explanation should be concise and should expand only when the method has genuine stages.",
  ));
  checks.push(check(
    "manual-explanation-worked-arithmetic",
    hasWorkedArithmetic(explanationLines),
    "The explanation must state enough numerical working to connect the given data to the answer.",
  ));
  checks.push(check(
    "manual-explanation-no-robotic-labels",
    explanationLines.every((line) => !genericPaddingPattern.test(line)),
    "Manual explanations must not fall back to labelled formula-template prose.",
  ));
  checks.push(check(
    "manual-explanation-answer-value-present",
    answerValueAppears(question, rendered),
    "The worked explanation must reach the exact numerical or symbolic answer value.",
  ));

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
