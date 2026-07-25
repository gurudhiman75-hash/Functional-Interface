import { renderPnc002Explanation } from "./explanation-renderer";
import { renderPnc002Cp008Explanation } from "./explanation-renderer-cp008";
import { getPnc002QuestionEntry, renderPnc002Template } from "./library";
import { buildPnc002Options } from "./option-generator";
import { buildPnc002Cp008Options } from "./option-generator-cp008";
import { generatePnc002Parameters } from "./parameter-generator";
import { buildPnc002ReasoningEvidence } from "./reasoning-graph";
import { buildPnc002Cp008ReasoningEvidence } from "./reasoning-graph-cp008";
import { solvePnc002, verifyPnc002Independently } from "./solver";
import { solvePnc002Cp008, verifyPnc002Cp008Independently } from "./solver-cp008";
import type { Pnc002ParameterInput, Pnc002QuestionPackage } from "./types";
import { validatePnc002QuestionPackage } from "./validator";
import { validatePnc002Cp008QuestionPackage } from "./validator-cp008";

export function runPnc002Pipeline(input: Pnc002ParameterInput = {}): Pnc002QuestionPackage {
  const parameters = generatePnc002Parameters(input);
  const entry = getPnc002QuestionEntry(parameters.questionLanguageId);
  const isCp008 = parameters.canonicalProblemId === "PNC-CP-008";
  const solver = isCp008 ? solvePnc002Cp008(parameters) : solvePnc002(parameters);
  const independentVerification = isCp008
    ? verifyPnc002Cp008Independently(parameters)
    : verifyPnc002Independently(parameters);
  const reasoningEvidence = isCp008
    ? buildPnc002Cp008ReasoningEvidence(parameters, solver, independentVerification)
    : buildPnc002ReasoningEvidence(parameters, solver, independentVerification);
  const explanation = isCp008
    ? renderPnc002Cp008Explanation(parameters, solver, reasoningEvidence)
    : renderPnc002Explanation(parameters, solver, reasoningEvidence);
  const stem = renderPnc002Template(entry.template, parameters.renderVariables);
  const optionBundle = isCp008
    ? buildPnc002Cp008Options(parameters, solver)
    : buildPnc002Options(parameters, solver);
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
    validation: isCp008
      ? validatePnc002Cp008QuestionPackage(packageWithoutValidation)
      : validatePnc002QuestionPackage(packageWithoutValidation),
  };
}
