import { renderPnc001RoutedExplanation } from "./explanation-router";
import { formatPnc001LatexText } from "./latex-format";
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
    lines: rawExplanation.lines.map(formatPnc001LatexText),
  };
  const stem = formatPnc001LatexText(renderPnc001Template(entry.template, parameters.renderVariables));
  const optionBundle = buildPnc001RoutedOptions(parameters, solver);
  const options = optionBundle.options.map(formatPnc001LatexText);
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
    options,
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
      formulaRendering: "LATEX_MATHJAX",
    },
  };

  return { ...basePackage, validation: validatePnc001RoutedQuestionPackage(basePackage) };
}

export function runPnc001ForLanguages(
  cpId: Pnc001ActiveCanonicalProblemId,
  input: Pnc001ParameterInput = {},
): Pnc001QuestionPackage[] {
  if (input.language && input.language !== "en") throw new Error("PNC-001 runtime proof is English only");
  return [runPnc001Pipeline(cpId, { ...input, language: "en" })];
}
