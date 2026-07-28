import { renderPnc002Explanation } from "./explanation-renderer";
import { renderPnc002Cp008Explanation } from "./explanation-renderer-cp008";
import { renderPnc002Cp008SaturationExplanation } from "./explanation-renderer-cp008-saturation";
import { renderPnc002Cp009Explanation } from "./explanation-renderer-cp009";
import { renderPnc002Cp009SaturationExplanation } from "./explanation-renderer-cp009-saturation";
import { renderPnc002Cp010Explanation } from "./explanation-renderer-cp010";
import { getPnc002QuestionEntry, renderPnc002Template } from "./library";
import { buildPnc002Options } from "./option-generator";
import { buildPnc002Cp008Options } from "./option-generator-cp008";
import { buildPnc002Cp008SaturationOptions } from "./option-generator-cp008-saturation";
import { buildPnc002Cp009Options } from "./option-generator-cp009";
import { buildPnc002Cp009SaturationOptions } from "./option-generator-cp009-saturation";
import { buildPnc002Cp010Options } from "./option-generator-cp010";
import { generatePnc002Parameters } from "./parameter-generator";
import { buildPnc002ReasoningEvidence } from "./reasoning-graph";
import { buildPnc002Cp008ReasoningEvidence } from "./reasoning-graph-cp008";
import { buildPnc002Cp008SaturationReasoningEvidence } from "./reasoning-graph-cp008-saturation";
import { buildPnc002Cp009ReasoningEvidence } from "./reasoning-graph-cp009";
import { buildPnc002Cp009SaturationReasoningEvidence } from "./reasoning-graph-cp009-saturation";
import { buildPnc002Cp010ReasoningEvidence } from "./reasoning-graph-cp010";
import { solvePnc002, verifyPnc002Independently } from "./solver";
import { solvePnc002Cp008, verifyPnc002Cp008Independently } from "./solver-cp008";
import {
  isPnc002Cp008SaturationMode,
  solvePnc002Cp008Saturation,
  verifyPnc002Cp008SaturationIndependently,
} from "./solver-cp008-saturation";
import { solvePnc002Cp009, verifyPnc002Cp009Independently } from "./solver-cp009";
import {
  isPnc002Cp009SaturationMode,
  solvePnc002Cp009Saturation,
  verifyPnc002Cp009SaturationIndependently,
} from "./solver-cp009-saturation";
import { solvePnc002Cp010, verifyPnc002Cp010Independently } from "./solver-cp010";
import {
  isPnc002Cp010SaturationQlId,
  solvePnc002Cp010Saturation,
  verifyPnc002Cp010SaturationIndependently,
} from "./solver-cp010-saturation";
import type {
  Pnc002Cp008SolveMode,
  Pnc002ParameterInput,
  Pnc002Parameters,
  Pnc002QuestionPackage,
} from "./types";
import { validatePnc002QuestionPackage } from "./validator";
import { validatePnc002Cp008QuestionPackage } from "./validator-cp008";
import { validatePnc002Cp008SaturationQuestionPackage } from "./validator-cp008-saturation";
import { validatePnc002Cp009QuestionPackage } from "./validator-cp009";
import { validatePnc002Cp009SaturationQuestionPackage } from "./validator-cp009-saturation";
import { validatePnc002Cp010QuestionPackage } from "./validator-cp010";

export function runPnc002Pipeline(input: Pnc002ParameterInput = {}): Pnc002QuestionPackage {
  const parameters = generatePnc002Parameters(input);
  const entry = getPnc002QuestionEntry(parameters.questionLanguageId);
  const isCp008 = parameters.canonicalProblemId === "PNC-CP-008";
  const isCp009 = parameters.canonicalProblemId === "PNC-CP-009";
  const isCp010 = parameters.canonicalProblemId === "PNC-CP-010";
  const isCp008Saturation = isCp008 && isPnc002Cp008SaturationMode(parameters.solveMode);
  const isCp009Saturation = isCp009 && isPnc002Cp009SaturationMode(parameters.solveMode);
  const isCp010Saturation = isCp010 && isPnc002Cp010SaturationQlId(parameters.questionLanguageId);
  const cp007Parameters = parameters as Pnc002Parameters;
  const cp008Parameters = parameters as Pnc002Parameters<Pnc002Cp008SolveMode>;

  const solver = isCp010Saturation
    ? solvePnc002Cp010Saturation(parameters)
    : isCp010
      ? solvePnc002Cp010(parameters)
      : isCp009Saturation
        ? solvePnc002Cp009Saturation(parameters)
        : isCp009
          ? solvePnc002Cp009(parameters)
          : isCp008Saturation
            ? solvePnc002Cp008Saturation(parameters)
            : isCp008
              ? solvePnc002Cp008(cp008Parameters)
              : solvePnc002(cp007Parameters);
  const independentVerification = isCp010Saturation
    ? verifyPnc002Cp010SaturationIndependently(parameters)
    : isCp010
      ? verifyPnc002Cp010Independently(parameters)
      : isCp009Saturation
        ? verifyPnc002Cp009SaturationIndependently(parameters)
        : isCp009
          ? verifyPnc002Cp009Independently(parameters)
          : isCp008Saturation
            ? verifyPnc002Cp008SaturationIndependently(parameters)
            : isCp008
              ? verifyPnc002Cp008Independently(cp008Parameters)
              : verifyPnc002Independently(cp007Parameters);
  const reasoningEvidence = isCp010
    ? buildPnc002Cp010ReasoningEvidence(parameters, solver, independentVerification)
    : isCp009Saturation
      ? buildPnc002Cp009SaturationReasoningEvidence(parameters, solver, independentVerification)
      : isCp009
        ? buildPnc002Cp009ReasoningEvidence(parameters, solver, independentVerification)
        : isCp008Saturation
          ? buildPnc002Cp008SaturationReasoningEvidence(parameters, solver, independentVerification)
          : isCp008
            ? buildPnc002Cp008ReasoningEvidence(cp008Parameters, solver, independentVerification)
            : buildPnc002ReasoningEvidence(cp007Parameters, solver, independentVerification);
  const explanation = isCp010
    ? renderPnc002Cp010Explanation(parameters, solver, reasoningEvidence)
    : isCp009Saturation
      ? renderPnc002Cp009SaturationExplanation(parameters, solver, reasoningEvidence)
      : isCp009
        ? renderPnc002Cp009Explanation(parameters, solver, reasoningEvidence)
        : isCp008Saturation
          ? renderPnc002Cp008SaturationExplanation(parameters, solver, reasoningEvidence)
          : isCp008
            ? renderPnc002Cp008Explanation(cp008Parameters, solver, reasoningEvidence)
            : renderPnc002Explanation(cp007Parameters, solver, reasoningEvidence);
  const stem = renderPnc002Template(entry.template, parameters.renderVariables);
  const optionBundle = isCp010
    ? buildPnc002Cp010Options(parameters, solver)
    : isCp009Saturation
      ? buildPnc002Cp009SaturationOptions(parameters, solver)
      : isCp009
        ? buildPnc002Cp009Options(parameters, solver)
        : isCp008Saturation
          ? buildPnc002Cp008SaturationOptions(parameters, solver)
          : isCp008
            ? buildPnc002Cp008Options(cp008Parameters, solver)
            : buildPnc002Options(cp007Parameters, solver);
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
    validation: isCp010
      ? validatePnc002Cp010QuestionPackage(packageWithoutValidation)
      : isCp009Saturation
        ? validatePnc002Cp009SaturationQuestionPackage(packageWithoutValidation)
        : isCp009
          ? validatePnc002Cp009QuestionPackage(packageWithoutValidation)
          : isCp008Saturation
            ? validatePnc002Cp008SaturationQuestionPackage(packageWithoutValidation)
            : isCp008
              ? validatePnc002Cp008QuestionPackage(packageWithoutValidation)
              : validatePnc002QuestionPackage(packageWithoutValidation),
  };
}
