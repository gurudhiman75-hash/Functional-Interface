import { renderPnc001RoutedExplanation } from "./explanation-router";
import {
  containsUndelimitedPnc001Formula,
  formatPnc001MathText,
  hasBalancedPnc001MathDelimiters,
  maskPnc001MathGroupsForLegacyValidation,
} from "./latex";
import { getPnc001QuestionEntry, renderPnc001Template } from "./library";
import { buildPnc001RoutedOptions } from "./option-router";
import { generatePnc001Parameters } from "./parameter-generator";
import { buildPnc001RoutedReasoningEvidence } from "./reasoning-router";
import { solvePnc001Routed, verifyPnc001RoutedIndependently } from "./solver-router";
import {
  PNC_001_ACTIVE_CP_IDS,
  PNC_001_PACKAGE_ID,
  type Pnc001ActiveCanonicalProblemId,
  type Pnc001ParameterInput,
  type Pnc001QuestionPackage,
  type Pnc001ValidationCheck,
} from "./types";
import { validatePnc001RoutedQuestionPackage } from "./validator-router";

export function getPnc001ActiveCanonicalProblemIds(): readonly Pnc001ActiveCanonicalProblemId[] {
  return PNC_001_ACTIVE_CP_IDS;
}

export function runPnc001Pipeline(input?: Pnc001ParameterInput): Pnc001QuestionPackage;
export function runPnc001Pipeline(cpId: Pnc001ActiveCanonicalProblemId, input?: Pnc001ParameterInput): Pnc001QuestionPackage;
export function runPnc001Pipeline(
  cpOrInput: Pnc001ActiveCanonicalProblemId | Pnc001ParameterInput = {},
  maybeInput: Pnc001ParameterInput = {},
): Pnc001QuestionPackage {
  const input: Pnc001ParameterInput = typeof cpOrInput === "string"
    ? { ...maybeInput, canonicalProblemId: cpOrInput }
    : cpOrInput;
  const parameters = generatePnc001Parameters(input);
  const entry = getPnc001QuestionEntry(parameters.questionLanguageId);
  const solver = solvePnc001Routed(parameters);
  const independentVerification = verifyPnc001RoutedIndependently(parameters);
  const reasoningEvidence = buildPnc001RoutedReasoningEvidence(parameters, solver, independentVerification);
  const rawExplanation = renderPnc001RoutedExplanation(parameters, solver, reasoningEvidence);
  const explanation = {
    ...rawExplanation,
    lines: rawExplanation.lines.map(formatPnc001MathText),
  };
  const stem = formatPnc001MathText(renderPnc001Template(entry.template, parameters.renderVariables));
  const optionBundle = buildPnc001RoutedOptions(parameters, solver);
  const mathematicalFingerprint = [
    String(parameters.solveMode),
    ...Object.entries(parameters.values).sort(([left], [right]) => left.localeCompare(right)).map(([key, value]) => `${key}=${value}`),
    `answer=${solver.answer}`,
  ].join("|");

  const basePackage: Pnc001QuestionPackage = {
    packageId: PNC_001_PACKAGE_ID,
    archetypeId: PNC_001_PACKAGE_ID,
    canonicalProblemId: parameters.canonicalProblemId,
    questionLanguageId: parameters.questionLanguageId,
    questionId: parameters.questionId,
    seed: parameters.seed,
    language: parameters.language,
    difficultyBand: parameters.difficulty,
    taskKind: parameters.taskKind,
    solveMode: parameters.solveMode,
    stem,
    options: optionBundle.options,
    correctIndex: optionBundle.correctIndex,
    answer: solver.answer,
    parameters,
    solver,
    independentVerification,
    reasoningEvidence,
    explanation,
    validation: { valid: false, checks: [] },
    maturity: "RUNTIME_PROOF",
    publiclyPublishable: false,
    mathematicalFingerprint,
    traceability: {
      packageId: PNC_001_PACKAGE_ID,
      canonicalProblemId: parameters.canonicalProblemId,
      questionLanguageId: parameters.questionLanguageId,
      explanationId: parameters.explanationId,
      difficulty: parameters.difficulty,
      taskKind: parameters.taskKind,
      solveMode: String(parameters.solveMode),
      constraintProfile: parameters.constraintProfile,
      distractorProfile: parameters.distractorProfile,
      answer: solver.answer,
      mathRendering: "DELIMITED_TEX",
    },
  };

  const legacyValidationPackage: Pnc001QuestionPackage = {
    ...basePackage,
    stem: maskPnc001MathGroupsForLegacyValidation(basePackage.stem),
    explanation: {
      ...basePackage.explanation,
      lines: basePackage.explanation.lines.map(maskPnc001MathGroupsForLegacyValidation),
    },
  };
  const routedValidation = validatePnc001RoutedQuestionPackage(legacyValidationPackage);
  const renderedTexts = [basePackage.stem, ...basePackage.options, ...basePackage.explanation.lines];
  const latexChecks: Pnc001ValidationCheck[] = [
    {
      name: "latex-balanced-delimiters",
      passed: renderedTexts.every(hasBalancedPnc001MathDelimiters),
      message: "Rendered stems, options and explanations must have balanced TeX delimiters",
    },
    {
      name: "latex-no-raw-formulas",
      passed: renderedTexts.every((value) => !containsUndelimitedPnc001Formula(value)),
      message: "Formula-bearing content must use delimited TeX rather than raw ASCII notation",
    },
    {
      name: "latex-solver-authority",
      passed: Boolean(solver.mathJax.trim()),
      message: "Every solver result must expose a MathJax-ready equation",
    },
  ];
  const validation = {
    valid: routedValidation.valid && latexChecks.every((item) => item.passed),
    checks: [...routedValidation.checks, ...latexChecks],
  };

  return { ...basePackage, validation };
}

export function runPnc001ForLanguages(
  cpId: Pnc001ActiveCanonicalProblemId,
  input: Pnc001ParameterInput = {},
): Pnc001QuestionPackage[] {
  if (input.language && input.language !== "en") throw new Error("PNC-001 runtime proof is English only");
  return [runPnc001Pipeline(cpId, { ...input, language: "en" })];
}
