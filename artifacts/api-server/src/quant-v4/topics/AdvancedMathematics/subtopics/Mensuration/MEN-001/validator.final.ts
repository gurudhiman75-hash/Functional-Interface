import { getFinalMen001NaturalExplanationProfile } from "./natural-explanation-profile-final";
import { toMen001LatexEquation } from "./structured-math-latex";
import { validateMen001QuestionPackage as validateAllMen001QuestionPackage } from "./validator.all";
import { validateMen001Cp005 } from "./validator.cp005";
import { validateMen001Cp005Exhaustiveness } from "./validator.cp005.exhaustiveness";
import { validateMen001Cp005Overlap } from "./validator.cp005.overlap";
import { validateMen001Cp006 } from "./validator.cp006";
import type {
  Men001QuestionPackage,
  Men001ValidationCheck,
  Men001ValidationResult,
} from "./types";

type Question = Omit<Men001QuestionPackage, "validation">;

const FOUR_TIER_HEADINGS = [
  "### 📌 Key Rule & Formula",
  "### 📝 Step-by-Step Solution",
  "### 💡 Exam Speed Shortcut",
  "### ⚠️ Common Traps",
] as const;

function check(name: string, passed: boolean, message: string): Men001ValidationCheck {
  return { name, passed, message };
}

function hasWorkedArithmetic(lines: readonly string[]) {
  return lines.some(
    (line) => /\d/.test(line) && /[=×÷+−\-√²π]/.test(line),
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
  const structuredSteps = question.explanation.sections.filter(
    (section) => section.kind === "STEP",
  );
  const lastStep = structuredSteps.at(-1);
  const canonicalAnswer = toMen001LatexEquation(question.answer);
  const genericPaddingPattern = /^(Check:|Substitution:|Calculation:|The required quantity is|This value measures|The result is|Multiplying this unit rate|The count refers|Therefore, the required|Hence, the required|Thus, the required)/i;

  checks.push(check(
    "natural-explanation-profile",
    Boolean(profile),
    "Every QL must have a deliberately authored explanation profile.",
  ));
  checks.push(check(
    "natural-explanation-opening",
    Boolean(profile) && explanationLines[0]?.includes(profile!.opening) === true,
    "The Key Rule tier must retain its QL-specific, context-aware opening.",
  ));
  checks.push(check(
    "natural-explanation-conclusion",
    Boolean(lastStep) &&
      lastStep!.paragraphs.length > 0 &&
      lastStep!.equations.some((equation) => equation.includes(canonicalAnswer)),
    "The last worked step must contain contextual prose and the canonical final result.",
  ));
  checks.push(check(
    "natural-explanation-length",
    explanationLines.length === FOUR_TIER_HEADINGS.length,
    "The canonical explanation must contain exactly four learner-facing blocks.",
  ));
  checks.push(check(
    "natural-explanation-four-tier-headings",
    FOUR_TIER_HEADINGS.every((heading, index) => explanationLines[index]?.startsWith(heading)),
    "The four canonical blocks must use the required learner-facing headings in order.",
  ));
  checks.push(check(
    "natural-explanation-no-fifth-block",
    explanationLines.every((line) => !/Final Answer/i.test(line)) &&
      question.explanation.sections.every((section) => section.kind !== "FINAL_ANSWER"),
    "The final result belongs inside the worked solution and must not appear as a fifth block.",
  ));
  checks.push(check(
    "natural-explanation-worked-arithmetic",
    hasWorkedArithmetic(explanationLines),
    "Natural prose must retain the verified numerical working.",
  ));
  checks.push(check(
    "natural-explanation-no-generic-padding",
    explanationLines.every((line) => {
      const body = line.replace(/^### [^\n]+\n+/, "");
      return !genericPaddingPattern.test(body);
    }),
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

  checks.push(...validateMen001Cp005(question));
  checks.push(...validateMen001Cp005Overlap(question));
  checks.push(...validateMen001Cp005Exhaustiveness(question));
  checks.push(
    ...validateMen001Cp006(question).filter(
      (item) => item.name !== "cp006-human-authored-step-depth",
    ),
  );

  return { valid: checks.every((item) => item.passed), checks };
}
