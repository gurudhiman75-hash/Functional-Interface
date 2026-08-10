import {
  divide,
  multiply,
  rational,
  type Rational,
} from "../foundation/rational";
import type { TsdCp001SolveInput } from "./canonical-solver";
import type {
  TsdCp001GeneratedQuestion,
  TsdCp001MisconceptionId,
  TsdCp001OptionAnalysis,
  TsdCp001OptionAudit,
} from "./runtime-types";
import { formatExamNumber } from "./runtime-support";

const OPTION_LABELS = ["A", "B", "C", "D"] as const;

type DirectInput = Extract<TsdCp001SolveInput, {
  solveMode: "distanceFromSpeedAndTime" | "speedFromDistanceAndTime" | "timeFromDistanceAndSpeed";
}>;

interface WrongDirectOption {
  readonly value: Rational;
  readonly misconceptionId: TsdCp001MisconceptionId;
  readonly reason: string;
}

function answerUnit(input: DirectInput): string {
  if (input.solveMode === "distanceFromSpeedAndTime") return "m";
  if (input.solveMode === "speedFromDistanceAndTime") return "m/s";
  return "seconds";
}

function text(value: Rational, unit: string): string {
  return `${formatExamNumber(value)} ${unit}`;
}

function directCorrectValue(input: DirectInput): Rational {
  if (input.solveMode === "distanceFromSpeedAndTime") {
    return multiply(input.speedMps, input.durationSeconds);
  }
  if (input.solveMode === "speedFromDistanceAndTime") {
    return divide(input.distanceMetres, input.durationSeconds);
  }
  return divide(input.distanceMetres, input.speedMps);
}

function wrongOptions(input: DirectInput): readonly WrongDirectOption[] {
  if (input.solveMode === "distanceFromSpeedAndTime") {
    const kmphNumber = multiply(input.speedMps, rational(18, 5));
    const durationMinutes = divide(input.durationSeconds, rational(60));
    const wrongSpeedConversion = multiply(input.speedMps, rational(5, 18));
    return Object.freeze([
      Object.freeze({
        value: multiply(kmphNumber, input.durationSeconds),
        misconceptionId: "MIX_UNCONVERTED_UNITS" as const,
        reason: `uses ${formatExamNumber(kmphNumber)} as metres/second, but that number is the speed in km/h.`,
      }),
      Object.freeze({
        value: multiply(input.speedMps, durationMinutes),
        misconceptionId: "TREAT_SECONDS_AS_MINUTES" as const,
        reason: `uses ${formatExamNumber(durationMinutes)} minutes as if they were seconds.`,
      }),
      Object.freeze({
        value: multiply(wrongSpeedConversion, input.durationSeconds),
        misconceptionId: "REVERSE_UNIT_CONVERSION" as const,
        reason: `converts an already-correct m/s speed by × 5/18 once more.`,
      }),
    ]);
  }

  if (input.solveMode === "speedFromDistanceAndTime") {
    const correct = directCorrectValue(input);
    const minutes = divide(input.durationSeconds, rational(60));
    return Object.freeze([
      Object.freeze({
        value: multiply(correct, rational(18, 5)),
        misconceptionId: "MIX_UNCONVERTED_UNITS" as const,
        reason: `finds the km/h number but writes it as m/s.`,
      }),
      Object.freeze({
        value: multiply(correct, rational(5, 18)),
        misconceptionId: "REVERSE_UNIT_CONVERSION" as const,
        reason: `converts the m/s answer by × 5/18 even though no conversion is needed.`,
      }),
      Object.freeze({
        value: divide(input.distanceMetres, minutes),
        misconceptionId: "TREAT_SECONDS_AS_MINUTES" as const,
        reason: `divides by ${formatExamNumber(minutes)} minutes while the answer unit is metres per second.`,
      }),
    ]);
  }

  const correct = directCorrectValue(input);
  const kmphNumber = multiply(input.speedMps, rational(18, 5));
  const reverseConvertedSpeed = multiply(input.speedMps, rational(5, 18));
  return Object.freeze([
    Object.freeze({
      value: divide(correct, rational(60)),
      misconceptionId: "TREAT_SECONDS_AS_MINUTES" as const,
      reason: `finds the time in minutes but writes that number as seconds.`,
    }),
    Object.freeze({
      value: divide(input.distanceMetres, kmphNumber),
      misconceptionId: "MIX_UNCONVERTED_UNITS" as const,
      reason: `uses ${formatExamNumber(kmphNumber)} km/h as if it were metres/second.`,
    }),
    Object.freeze({
      value: divide(input.distanceMetres, reverseConvertedSpeed),
      misconceptionId: "REVERSE_UNIT_CONVERSION" as const,
      reason: `changes an already-correct m/s speed by × 5/18 before dividing.`,
    }),
  ]);
}

function correctWorking(input: DirectInput, answerText: string): string {
  if (input.solveMode === "distanceFromSpeedAndTime") {
    return `${formatExamNumber(input.speedMps)} × ${formatExamNumber(input.durationSeconds)} = ${answerText}`;
  }
  if (input.solveMode === "speedFromDistanceAndTime") {
    return `${formatExamNumber(input.distanceMetres)} ÷ ${formatExamNumber(input.durationSeconds)} = ${answerText}`;
  }
  return `${formatExamNumber(input.distanceMetres)} ÷ ${formatExamNumber(input.speedMps)} = ${answerText}`;
}

function wrongWorking(input: DirectInput, wrong: WrongDirectOption): string {
  const unit = answerUnit(input);
  if (input.solveMode === "distanceFromSpeedAndTime") {
    if (wrong.misconceptionId === "MIX_UNCONVERTED_UNITS") {
      const kmph = multiply(input.speedMps, rational(18, 5));
      return `${formatExamNumber(kmph)} × ${formatExamNumber(input.durationSeconds)} = ${text(wrong.value, unit)}`;
    }
    if (wrong.misconceptionId === "TREAT_SECONDS_AS_MINUTES") {
      const minutes = divide(input.durationSeconds, rational(60));
      return `${formatExamNumber(input.speedMps)} × ${formatExamNumber(minutes)} = ${text(wrong.value, unit)}`;
    }
    const converted = multiply(input.speedMps, rational(5, 18));
    return `${formatExamNumber(converted)} × ${formatExamNumber(input.durationSeconds)} = ${text(wrong.value, unit)}`;
  }

  if (input.solveMode === "speedFromDistanceAndTime") {
    if (wrong.misconceptionId === "MIX_UNCONVERTED_UNITS") {
      const correct = directCorrectValue(input);
      return `${formatExamNumber(correct)} × 18/5 = ${text(wrong.value, unit)}`;
    }
    if (wrong.misconceptionId === "REVERSE_UNIT_CONVERSION") {
      const correct = directCorrectValue(input);
      return `${formatExamNumber(correct)} × 5/18 = ${text(wrong.value, unit)}`;
    }
    const minutes = divide(input.durationSeconds, rational(60));
    return `${formatExamNumber(input.distanceMetres)} ÷ ${formatExamNumber(minutes)} = ${text(wrong.value, unit)}`;
  }

  if (wrong.misconceptionId === "TREAT_SECONDS_AS_MINUTES") {
    const correct = directCorrectValue(input);
    return `${formatExamNumber(correct)} ÷ 60 = ${text(wrong.value, unit)}`;
  }
  if (wrong.misconceptionId === "MIX_UNCONVERTED_UNITS") {
    const kmph = multiply(input.speedMps, rational(18, 5));
    return `${formatExamNumber(input.distanceMetres)} ÷ ${formatExamNumber(kmph)} = ${text(wrong.value, unit)}`;
  }
  const converted = multiply(input.speedMps, rational(5, 18));
  return `${formatExamNumber(input.distanceMetres)} ÷ ${formatExamNumber(converted)} = ${text(wrong.value, unit)}`;
}

export function remodelRealisticDirectOptions(
  question: TsdCp001GeneratedQuestion,
): TsdCp001GeneratedQuestion {
  const input = question.input;
  if (
    input.solveMode !== "distanceFromSpeedAndTime"
    && input.solveMode !== "speedFromDistanceAndTime"
    && input.solveMode !== "timeFromDistanceAndSpeed"
  ) return question;

  const unit = answerUnit(input);
  const answerValue = directCorrectValue(input);
  const answerText = text(answerValue, unit);
  const wrongs = wrongOptions(input);
  const wrongTexts = wrongs.map((wrong) => text(wrong.value, unit));
  const distinct = new Set([answerText, ...wrongTexts]);
  if (distinct.size !== 4) {
    throw new Error(`${question.questionLanguageId}: realistic direct distractors are not unique`);
  }

  const entries: Array<{
    readonly text: string;
    readonly misconceptionId: TsdCp001MisconceptionId;
    readonly isCorrect: boolean;
    readonly reason: string;
  }> = wrongs.map((wrong) => Object.freeze({
    text: text(wrong.value, unit),
    misconceptionId: wrong.misconceptionId,
    isCorrect: false,
    reason: `⚠️ ${text(wrong.value, unit)}: ${wrong.reason} Wrong working: ${wrongWorking(input, wrong)}.`,
  }));
  entries.splice(question.correctIndex, 0, Object.freeze({
    text: answerText,
    misconceptionId: "CORRECT",
    isCorrect: true,
    reason: `✅ ${answerText}: correct. ${correctWorking(input, answerText)}.`,
  }));

  const options = Object.freeze(entries.map((entry) => entry.text));
  const optionAudit = Object.freeze(entries.map((entry): TsdCp001OptionAudit => Object.freeze({
    text: entry.text,
    misconceptionId: entry.misconceptionId,
    isCorrect: entry.isCorrect,
  })));
  const optionAnalysis = Object.freeze(entries.map((entry, index): TsdCp001OptionAnalysis => Object.freeze({
    option: OPTION_LABELS[index],
    text: entry.text,
    misconceptionId: entry.misconceptionId,
    isCorrect: entry.isCorrect,
    reason: entry.reason,
  })));

  return Object.freeze({
    ...question,
    answerText,
    options,
    optionAudit,
    explanation: Object.freeze({
      ...question.explanation,
      optionAnalysis,
    }),
  });
}
