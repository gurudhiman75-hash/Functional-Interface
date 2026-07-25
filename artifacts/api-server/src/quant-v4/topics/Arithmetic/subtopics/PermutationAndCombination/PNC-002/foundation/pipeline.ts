import { renderPnc002Explanation } from "./explanation-renderer";
import {
  getPnc002QuestionEntry,
  renderPnc002Template,
} from "./library";
import { buildPnc002Options } from "./option-generator";
import { generatePnc002Parameters } from "./parameter-generator";
import { buildPnc002ReasoningEvidence } from "./reasoning-graph";
import {
  solvePnc002,
  verifyPnc002Independently,
} from "./solver";
import type {
  Pnc002ParameterInput,
  Pnc002QuestionPackage,
} from "./types";
import { validatePnc002QuestionPackage } from "./validator";

export function runPnc002Pipeline(
  input: Pnc002ParameterInput = {},
): Pnc002QuestionPackage {
  const parameters = generatePnc002Parameters(input);
  const entry = getPnc002QuestionEntry(parameters.questionLanguageId);
  const solver = solvePnc002(parameters);
  const independentVerification = verifyPnc002Independently(parameters);
  const reasoningEvidence = buildPnc002ReasoningEvidence(
    parameters,
    solver,
    independentVerification,
  );
  const explanation = renderPnc002Explanation(parameters, solver, reasoningEvidence);
  const stem = renderPnc002Template(entry.template, parameters.renderVariables);
  const optionBundle = buildPnc002Options(parameters, solver);
  const mathematicalFingerprint = [
    String(parameters.solveMode),
    ...Object.entries(parameters.values)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, value]) => `${key}=${Array.isArray(value) ? value.join("-") : value}`),
  ].join("|");

  const packageWithoutValidation: Pnc002QuestionPackage = {
    packageId: "PNC-002",
    archetypeId: "PNC-002",
    canonicalProblemId: parameters.canonicalProblemId,
    questionLanguageId: parameters.questionLanguageId,
    questionId: parameters.questionId,
    seed: parameters.seed,
    language: "en",
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
      packageId: "PNC-002",
      canonicalProblemId: parameters.canonicalProblemId,
      questionLanguageId: parameters.questionLanguageId,
      explanationId: parameters.explanationId,
      constraintProfile: parameters.constraintProfile,
      distractorProfile: parameters.distractorProfile,
      formulaRendering: "LATEX_MATHJAX",
    },
  };

  return {
    ...packageWithoutValidation,
    validation: validatePnc002QuestionPackage(packageWithoutValidation),
  };
}
