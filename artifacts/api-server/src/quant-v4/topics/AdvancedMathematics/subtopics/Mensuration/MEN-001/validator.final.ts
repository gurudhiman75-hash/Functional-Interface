import { getFinalMen001NaturalExplanationProfile } from "./natural-explanation-profile-final";
import { shownAnswer } from "./natural-explanation-manual.shared";
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

function expectedConclusion(question: Question, template: string) {
  const answer = question.solver.canonicalAnswer.kind === "symbolic"
    ? question.solver.canonicalAnswer.display
    : question.answer;
  const text = template
    .replace("{answer}", answer)
    .replace(/^\s*(Therefore|Hence|Thus|So),?\s+/i, "")
    .replace(/\s+therefore\s+/i, " ")
    .replace(/\s+hence\s+/i, " ")
    .replace(/\s+thus\s+/i, " ")
    .trim();
  const capitalized = text[0] ? text[0].toUpperCase() + text.slice(1) : text;
  return /[.!?]$/.test(capitalized) ? capitalized : `${capitalized}.`;
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
  const conclusion = profile
    ? expectedConclusion(question, profile.conclusion)
    : undefined;
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
    Boolean(profile) && explanationLines[0]!.startsWith(profile!.opening),
    "The authored explanation must begin in the question's own context.",
  ));
  checks.push(check(
    "manual-explanation-conclusion",
    Boolean(conclusion) && rendered.endsWith(conclusion!),
    "The authored explanation must end with its contextual result.",
  ));
  checks.push(check(
    "manual-explanation-length",
    explanationLines.length >= 2 && explanationLines.length <= 6,
    "The explanation should be concise and should expand only when the method has genuine stages.",
  ));
  checks.push(check(
    "manual-explanation-worked-arithmetic",
    hasWorkedArithmetic(explanationLines),
    "The explanation must show the actual numerical reasoning.",
  ));
  checks.push(check(
    "manual-explanation-no-robotic-labels",
    explanationLines.every((line) => !genericPaddingPattern.test(line)),
    "Manual explanations must not fall back to labelled formula-template prose.",
  ));
  checks.push(check(
    "manual-explanation-answer-present",
    rendered.includes(shownAnswer(question.solver)),
    "The contextual explanation must state the exact final answer.",
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
