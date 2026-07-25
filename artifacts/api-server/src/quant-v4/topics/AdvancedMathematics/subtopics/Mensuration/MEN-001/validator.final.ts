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
  return lines.some(
    (line) => /\d/.test(line) && /[=×÷+−\-√²π]/.test(line),
  );
}

function naturalConclusion(value: string, answer: string) {
  const text = value
    .replace("{answer}", answer)
    .replace(/^\s*(Therefore|Hence|Thus|So),?\s+/i, "")
    .replace(/\s+therefore\s+/i, " ")
    .replace(/\s+hence\s+/i, " ")
    .replace(/\s+thus\s+/i, " ")
    .trim()
    .replace(/\s+/g, " ");
  return /[.!?]$/.test(text) ? text : `${text}.`;
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
  const expectedConclusion = profile
    ? naturalConclusion(profile.conclusion, question.answer)
    : undefined;
  const explanationLines = question.explanation.lines;
  const genericPaddingPattern = /^(Check:|Substitution:|Calculation:|The required quantity is|This value measures|The result is|Multiplying this unit rate|The count refers|Therefore, the required|Hence, the required|Thus, the required)/i;

  checks.push(check(
    "natural-explanation-profile",
    Boolean(profile),
    "Every QL must have a deliberately authored explanation profile.",
  ));
  checks.push(check(
    "natural-explanation-opening",
    Boolean(profile) && explanationLines[0] === profile?.opening,
    "The explanation must begin with its QL-specific, context-aware opening.",
  ));
  checks.push(check(
    "natural-explanation-conclusion",
    Boolean(expectedConclusion) &&
      explanationLines[explanationLines.length - 1] === expectedConclusion,
    "The explanation must end with its contextual conclusion rather than a shared answer shell.",
  ));
  checks.push(check(
    "natural-explanation-length",
    explanationLines.length >= 3 && explanationLines.length <= 9,
    "The explanation should use only as many lines as the reasoning needs.",
  ));
  checks.push(check(
    "natural-explanation-worked-arithmetic",
    hasWorkedArithmetic(explanationLines),
    "Natural prose must retain the verified numerical working.",
  ));
  checks.push(check(
    "natural-explanation-no-generic-padding",
    explanationLines.every((line) => !genericPaddingPattern.test(line)),
    "Explanations must not use formula labels, repeated check lines or generic unit padding.",
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
