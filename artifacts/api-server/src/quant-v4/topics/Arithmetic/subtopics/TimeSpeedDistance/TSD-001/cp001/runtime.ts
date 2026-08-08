import type { TsdCp001GeneratedQuestion } from "./runtime-types";
import {
  TSD_CP001_LEARNER_AUTHORITIES,
  TSD_CP001_NON_LEARNER_MODES,
  cp001AuthorityByMode,
  generateCp001Candidate as generateCoreCp001Candidate,
  generateCp001ReviewRows as generateCoreCp001ReviewRows,
  stableStringify,
} from "./runtime-base";
import { remodelCp001FinalEditorial } from "./final-editorial-remediation";
import { remodelPaceOptionFeedback } from "./pace-option-feedback";
import { unitConversionOptionPackage } from "./unit-conversion-options";
import { remodelUnitConversionOptionFeedback } from "./unit-conversion-option-feedback";

function remodelConversionQuestion(
  question: TsdCp001GeneratedQuestion,
): TsdCp001GeneratedQuestion {
  if (
    question.input.solveMode !== "convertSpeedUnit"
    && question.input.solveMode !== "convertDistanceUnit"
    && question.input.solveMode !== "convertTimeUnit"
  ) return question;

  const optionSet = unitConversionOptionPackage(
    question.input,
    question.solution,
    question.representation,
    {
      options: question.options,
      optionAudit: question.optionAudit,
      correctIndex: question.correctIndex,
    },
  );

  const alignedExplanation = Object.freeze({
    ...question.explanation,
    optionAnalysis: Object.freeze(optionSet.optionAudit.map((audit, index) => Object.freeze({
      ...question.explanation.optionAnalysis[index],
      text: audit.text,
      misconceptionId: audit.misconceptionId,
      isCorrect: audit.isCorrect,
    }))),
  });
  const explanation = remodelUnitConversionOptionFeedback(
    question.input,
    question.representation,
    alignedExplanation,
  );

  const errors = [...question.validation.errors];
  if (optionSet.options.length !== 4 || new Set(optionSet.options).size !== 4) {
    errors.push("Conversion options must contain four unique values");
  }
  if (!optionSet.optionAudit[optionSet.correctIndex]?.isCorrect) {
    errors.push("Conversion correct index does not identify the correct option");
  }
  if (question.answerText !== optionSet.options[optionSet.correctIndex]) {
    errors.push("Conversion answer text and keyed option differ");
  }
  if (explanation.optionAnalysis.some((option, index) => option.text !== optionSet.options[index])) {
    errors.push("Conversion option analysis and option text differ");
  }
  if (explanation.optionAnalysis.some((option, index) => option.misconceptionId !== optionSet.optionAudit[index].misconceptionId)) {
    errors.push("Conversion option analysis and misconception ID differ");
  }

  return Object.freeze({
    ...question,
    options: Object.freeze([...optionSet.options]),
    optionAudit: Object.freeze([...optionSet.optionAudit]),
    correctIndex: optionSet.correctIndex,
    explanation,
    validation: Object.freeze({
      valid: errors.length === 0,
      errors: Object.freeze(errors),
      warnings: question.validation.warnings,
    }),
  });
}

function remodelPaceQuestion(
  question: TsdCp001GeneratedQuestion,
): TsdCp001GeneratedQuestion {
  if (
    question.input.solveMode !== "speedFromPace"
    && question.input.solveMode !== "paceFromSpeed"
    && question.input.solveMode !== "distanceFromPaceAndTime"
  ) return question;

  return Object.freeze({
    ...question,
    explanation: remodelPaceOptionFeedback(
      question.input,
      question.answerText,
      question.explanation,
    ),
  });
}

function remodelQuestion(question: TsdCp001GeneratedQuestion): TsdCp001GeneratedQuestion {
  return remodelCp001FinalEditorial(
    remodelPaceQuestion(remodelConversionQuestion(question)),
  );
}

export function generateCp001Candidate(
  ...args: Parameters<typeof generateCoreCp001Candidate>
): TsdCp001GeneratedQuestion {
  return remodelQuestion(generateCoreCp001Candidate(...args));
}

export function generateCp001ReviewRows(
  ...args: Parameters<typeof generateCoreCp001ReviewRows>
): TsdCp001GeneratedQuestion[] {
  return generateCoreCp001ReviewRows(...args).map(remodelQuestion);
}

export {
  TSD_CP001_LEARNER_AUTHORITIES,
  TSD_CP001_NON_LEARNER_MODES,
  cp001AuthorityByMode,
  stableStringify,
};
