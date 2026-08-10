import {
  add,
  multiply,
  rational,
  subtract,
} from "../foundation/rational";
import type {
  TsdCp001GeneratedQuestion,
  TsdCp001OptionAnalysis,
} from "./runtime-types";
import { formatExamNumber } from "./runtime-support";

const EQUATION = /(?:\d|\b[A-D]\b)[^.!?]{0,120}(?:=|×|÷|\+|−|-|\\times|\\div)[^.!?]{0,120}\d/;
const LEADING_OPERATOR = /^(?:=|×|÷|\+|−|-|\\times|\\div)\s*/;

export function hasTsdCalculationEvidence(value: string): boolean {
  return EQUATION.test(value.replace(/\s+/g, " "));
}

function withoutDisplayedOption(reason: string, optionText: string): string {
  return reason.replace(optionText, "").replace(/^[✅⚠️\s:.-]+/, "").trim();
}

function cleanLine(line: string): string {
  return line
    .trim()
    .replace(/^[•*-]\s*/, "")
    .replace(/^Therefore,?\s*/i, "")
    .replace(/^So,?\s*/i, "")
    .replace(/[.\s]+$/, "")
    .trim();
}

function unitLabel(unit: string): string {
  const labels: Record<string, string> = {
    KMPH: "km/h",
    MPS: "m/s",
    M_PER_MINUTE: "m/min",
    KM_PER_MINUTE: "km/min",
    KM: "km",
    M: "m",
    CM: "cm",
    MM: "mm",
    HOUR: "hours",
    MINUTE: "minutes",
    SECOND: "seconds",
    DAY: "days",
  };
  return labels[unit] ?? unit.toLowerCase();
}

function conversionCalculationCertificate(question: TsdCp001GeneratedQuestion): string | null {
  const input = question.input;
  if (
    input.solveMode !== "convertSpeedUnit"
    && input.solveMode !== "convertDistanceUnit"
    && input.solveMode !== "convertTimeUnit"
  ) return null;
  return `${formatExamNumber(input.value)} ${unitLabel(input.from)} = ${question.answerText}`;
}

function clockCalculationCertificate(question: TsdCp001GeneratedQuestion): string | null {
  const input = question.input;
  if (input.solveMode === "arrivalClockTime") {
    const absoluteArrival = add(input.departureMinuteOfDay, input.durationMinutes);
    return `Using minutes from midnight: ${formatExamNumber(input.departureMinuteOfDay)} + ${formatExamNumber(input.durationMinutes)} = ${formatExamNumber(absoluteArrival)} minutes = ${question.answerText}`;
  }
  if (input.solveMode === "departureClockTime") {
    const absoluteArrival = add(
      input.arrivalMinuteOfDay,
      multiply(rational(input.arrivalDayOffset), rational(1440)),
    );
    const departure = subtract(absoluteArrival, input.durationMinutes);
    return `Using minutes from midnight: ${formatExamNumber(absoluteArrival)} − ${formatExamNumber(input.durationMinutes)} = ${formatExamNumber(departure)} minutes = ${question.answerText}`;
  }
  if (input.solveMode === "elapsedClockTime") {
    const absoluteArrival = add(
      input.arrivalMinuteOfDay,
      multiply(rational(input.arrivalDayOffset), rational(1440)),
    );
    const elapsed = subtract(absoluteArrival, input.departureMinuteOfDay);
    return `Using minutes from midnight: ${formatExamNumber(absoluteArrival)} − ${formatExamNumber(input.departureMinuteOfDay)} = ${formatExamNumber(elapsed)} minutes = ${question.answerText}`;
  }
  return null;
}

function joinAsEquation(operationLine: string | undefined, finalLine: string): string {
  const final = cleanLine(finalLine);
  const operation = operationLine ? cleanLine(operationLine) : "";

  if (final.startsWith("=")) {
    const result = final.replace(/^=\s*/, "").trim();
    if (!operation) return result;
    return operation.endsWith("=") ? `${operation} ${result}` : `${operation} = ${result}`;
  }

  if (/(?:=|×|÷|\+|−|-|\\times|\\div)/.test(final) && /=/.test(final)) {
    return final;
  }

  if (operation) {
    if (operation.includes(final)) return operation;
    return operation.endsWith("=") ? `${operation} ${final}` : `${operation} = ${final}`;
  }

  return final;
}

function calculationCertificate(question: TsdCp001GeneratedQuestion): string {
  const conversionCertificate = conversionCalculationCertificate(question);
  if (conversionCertificate) return conversionCertificate;

  const clockCertificate = clockCalculationCertificate(question);
  if (clockCertificate) return clockCertificate;

  const candidates = [
    ...question.explanation.stepByStepSolution,
    ...question.explanation.working,
  ].filter((line) => /(?:=|×|÷|\+|−|-|\\times|\\div)/.test(line));

  const numericalCandidates = candidates.filter((line) => hasTsdCalculationEvidence(line));
  const finalLine = [...numericalCandidates].reverse().find((line) => line.includes(question.answerText))
    ?? [...candidates].reverse().find((line) => line.includes(question.answerText))
    ?? numericalCandidates[numericalCandidates.length - 1]
    ?? candidates[candidates.length - 1];
  if (!finalLine) {
    throw new Error(`${question.questionLanguageId}: no exact calculation line is available`);
  }

  const operationLine = [...numericalCandidates]
    .reverse()
    .find((line) => line !== finalLine);
  const certificate = joinAsEquation(operationLine, finalLine)
    .replace(/\s+/g, " ")
    .trim();

  if (LEADING_OPERATOR.test(certificate)) {
    throw new Error(`${question.questionLanguageId}: calculation certificate starts with an operator`);
  }
  if (/(?:×|÷|\+|−|-|\\times|\\div)/.test(certificate) && !/=/.test(certificate)) {
    throw new Error(`${question.questionLanguageId}: calculation certificate has an operation but no equals sign`);
  }
  if (!hasTsdCalculationEvidence(certificate)) {
    throw new Error(`${question.questionLanguageId}: calculation certificate is not numerical`);
  }
  return certificate;
}

export function ensureCp001ExactOptionFeedback(
  question: TsdCp001GeneratedQuestion,
): TsdCp001GeneratedQuestion {
  const certificate = calculationCertificate(question);
  const optionAnalysis = Object.freeze(question.explanation.optionAnalysis.map((entry): TsdCp001OptionAnalysis => {
    const remainder = withoutDisplayedOption(entry.reason, entry.text);
    if (hasTsdCalculationEvidence(remainder) && /=/.test(remainder)) return entry;
    return Object.freeze({
      ...entry,
      reason: `${entry.reason.replace(/[.\s]+$/, "")}. Correct check: ${certificate}.`,
    });
  }));

  return Object.freeze({
    ...question,
    explanation: Object.freeze({
      ...question.explanation,
      optionAnalysis,
    }),
  });
}
