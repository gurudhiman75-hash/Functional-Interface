import {
  add,
  divide,
  equals,
  isPositive,
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
import { formatClock, formatExamNumber } from "./runtime-support";

type ProportionInput = Extract<TsdCp001SolveInput, {
  solveMode: "distanceByProportion" | "timeByProportion" | "speedByProportion";
}>;

type ClockInput = Extract<TsdCp001SolveInput, {
  solveMode: "arrivalClockTime" | "departureClockTime";
}>;

interface WrongMethod {
  readonly value: Rational;
  readonly misconceptionId: TsdCp001MisconceptionId;
  readonly reason: (optionText: string, answerText: string) => string;
}

interface PlacedOption {
  readonly audit: TsdCp001OptionAudit;
  readonly reason: string;
}

function formatLikeCorrect(question: TsdCp001GeneratedQuestion, value: Rational): string {
  const match = question.answerText.match(
    /^[-+]?(?:\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?)(.*)$/,
  );
  if (!match) throw new Error(`${question.questionLanguageId}: cannot identify scalar answer suffix`);
  return `${formatExamNumber(value)}${match[1]}`;
}

function exact(value: Rational): string {
  return formatExamNumber(value);
}

function distanceMethods(input: Extract<ProportionInput, { solveMode: "distanceByProportion" }>): readonly WrongMethod[] {
  const correctOperation = `${exact(input.targetSpeed)} × ${exact(input.targetTime)}`;
  return [
    {
      value: input.knownDistance,
      misconceptionId: "USE_FIRST_QUANTITY_ONLY",
      reason: (option, answer) => `⚠️ ${option}: this copies the reference distance. The target journey uses ${correctOperation} = ${answer}.`,
    },
    {
      value: multiply(input.knownSpeed, input.targetTime),
      misconceptionId: "IGNORE_SPEED_CHANGE",
      reason: (option, answer) => `⚠️ ${option}: ${exact(input.knownSpeed)} × ${exact(input.targetTime)} keeps the reference speed; use ${correctOperation} = ${answer}.`,
    },
    {
      value: multiply(input.targetSpeed, input.knownTime),
      misconceptionId: "IGNORE_TIME_CHANGE",
      reason: (option, answer) => `⚠️ ${option}: ${exact(input.targetSpeed)} × ${exact(input.knownTime)} keeps the reference time; use ${correctOperation} = ${answer}.`,
    },
    {
      value: add(input.targetSpeed, input.targetTime),
      misconceptionId: "ADD_INSTEAD_OF_MULTIPLY",
      reason: (option, answer) => `⚠️ ${option}: it adds ${exact(input.targetSpeed)} + ${exact(input.targetTime)}; distance requires ${correctOperation} = ${answer}.`,
    },
    {
      value: divide(input.targetSpeed, input.targetTime),
      misconceptionId: "DIVIDE_INSTEAD_OF_MULTIPLY",
      reason: (option, answer) => `⚠️ ${option}: it divides ${exact(input.targetSpeed)} ÷ ${exact(input.targetTime)}; distance requires ${correctOperation} = ${answer}.`,
    },
  ];
}

function retainedTimeLabel(
  input: Extract<ProportionInput, { solveMode: "timeByProportion" }>,
): TsdCp001MisconceptionId {
  if (equals(input.knownDistance, input.targetDistance) && !equals(input.knownSpeed, input.targetSpeed)) {
    return "IGNORE_SPEED_CHANGE";
  }
  if (equals(input.knownSpeed, input.targetSpeed) && !equals(input.knownDistance, input.targetDistance)) {
    return "IGNORE_DISTANCE_CHANGE";
  }
  return "USE_SECOND_QUANTITY_ONLY";
}

function timeMethods(input: Extract<ProportionInput, { solveMode: "timeByProportion" }>): readonly WrongMethod[] {
  const correctOperation = `${exact(input.targetDistance)} ÷ ${exact(input.targetSpeed)}`;
  return [
    {
      value: input.knownTime,
      misconceptionId: retainedTimeLabel(input),
      reason: (option, answer) => `⚠️ ${option}: this keeps the reference time. Use target distance ÷ target speed: ${correctOperation} = ${answer}.`,
    },
    {
      value: multiply(input.knownTime, divide(input.knownDistance, input.targetDistance)),
      misconceptionId: "INVERT_REQUIRED_RATIO",
      reason: (option, answer) => `⚠️ ${option}: it uses ${exact(input.knownTime)} × ${exact(input.knownDistance)}/${exact(input.targetDistance)}, reversing the distance factor; ${correctOperation} = ${answer}.`,
    },
    {
      value: divide(input.targetDistance, input.knownSpeed),
      misconceptionId: "IGNORE_SPEED_CHANGE",
      reason: (option, answer) => `⚠️ ${option}: ${exact(input.targetDistance)} ÷ ${exact(input.knownSpeed)} uses the reference speed; use ${correctOperation} = ${answer}.`,
    },
    {
      value: divide(input.knownDistance, input.targetSpeed),
      misconceptionId: "IGNORE_DISTANCE_CHANGE",
      reason: (option, answer) => `⚠️ ${option}: ${exact(input.knownDistance)} ÷ ${exact(input.targetSpeed)} uses the reference distance; use ${correctOperation} = ${answer}.`,
    },
    {
      value: divide(input.targetDistance, add(input.targetSpeed, input.knownSpeed)),
      misconceptionId: "ADD_GIVENS_BEFORE_DIVIDING",
      reason: (option, answer) => `⚠️ ${option}: it divides by ${exact(input.targetSpeed)} + ${exact(input.knownSpeed)}; use only target speed: ${correctOperation} = ${answer}.`,
    },
    {
      value: divide(input.targetSpeed, input.targetDistance),
      misconceptionId: "REVERSE_DIVISION",
      reason: (option, answer) => `⚠️ ${option}: it reverses the division to ${exact(input.targetSpeed)} ÷ ${exact(input.targetDistance)}; ${correctOperation} = ${answer}.`,
    },
    {
      value: multiply(input.targetDistance, input.targetSpeed),
      misconceptionId: "MULTIPLY_INSTEAD_OF_DIVIDE",
      reason: (option, answer) => `⚠️ ${option}: it multiplies ${exact(input.targetDistance)} × ${exact(input.targetSpeed)}; time requires ${correctOperation} = ${answer}.`,
    },
  ];
}

function speedMethods(input: Extract<ProportionInput, { solveMode: "speedByProportion" }>): readonly WrongMethod[] {
  const correctOperation = `${exact(input.targetDistance)} ÷ ${exact(input.targetTime)}`;
  return [
    {
      value: input.knownSpeed,
      misconceptionId: "IGNORE_TIME_CHANGE",
      reason: (option, answer) => `⚠️ ${option}: this keeps the reference speed although time changes; use ${correctOperation} = ${answer}.`,
    },
    {
      value: multiply(input.knownSpeed, divide(input.targetTime, input.knownTime)),
      misconceptionId: "USE_DIRECT_TIME_FACTOR",
      reason: (option, answer) => `⚠️ ${option}: it uses the direct factor ${exact(input.knownSpeed)} × ${exact(input.targetTime)}/${exact(input.knownTime)}; ${correctOperation} = ${answer}.`,
    },
    {
      value: divide(input.targetDistance, add(input.targetTime, input.knownTime)),
      misconceptionId: "ADD_GIVENS_BEFORE_DIVIDING",
      reason: (option, answer) => `⚠️ ${option}: it divides by ${exact(input.targetTime)} + ${exact(input.knownTime)}; use only target time: ${correctOperation} = ${answer}.`,
    },
    {
      value: divide(input.targetTime, input.targetDistance),
      misconceptionId: "REVERSE_DIVISION",
      reason: (option, answer) => `⚠️ ${option}: it reverses the division to ${exact(input.targetTime)} ÷ ${exact(input.targetDistance)}; ${correctOperation} = ${answer}.`,
    },
    {
      value: multiply(input.targetDistance, input.targetTime),
      misconceptionId: "MULTIPLY_INSTEAD_OF_DIVIDE",
      reason: (option, answer) => `⚠️ ${option}: it multiplies ${exact(input.targetDistance)} × ${exact(input.targetTime)}; speed requires ${correctOperation} = ${answer}.`,
    },
  ];
}

function methodsFor(input: ProportionInput): readonly WrongMethod[] {
  if (input.solveMode === "distanceByProportion") return distanceMethods(input);
  if (input.solveMode === "timeByProportion") return timeMethods(input);
  return speedMethods(input);
}

function correctReason(question: TsdCp001GeneratedQuestion, input: ProportionInput): string {
  if (input.solveMode === "distanceByProportion") {
    return `✅ ${question.answerText}: ${exact(input.targetSpeed)} × ${exact(input.targetTime)} gives the target distance.`;
  }
  if (input.solveMode === "timeByProportion") {
    return `✅ ${question.answerText}: ${exact(input.targetDistance)} ÷ ${exact(input.targetSpeed)} gives the target time.`;
  }
  return `✅ ${question.answerText}: ${exact(input.targetDistance)} ÷ ${exact(input.targetTime)} gives the required speed.`;
}

function rebuildProportion(question: TsdCp001GeneratedQuestion, input: ProportionInput): TsdCp001GeneratedQuestion {
  if (
    question.solution.answerKind === "CLOCK_TIME"
    || question.solution.answerKind === "CLASSIFICATION"
    || question.solution.answerKind === "BOOLEAN"
  ) throw new Error(`${question.questionLanguageId}: proportion solution must be scalar`);

  const correctValue = question.solution.value;
  const selected: WrongMethod[] = [];
  for (const method of methodsFor(input)) {
    if (!isPositive(method.value) || equals(method.value, correctValue)) continue;
    if (selected.some((entry) => equals(entry.value, method.value))) continue;
    selected.push(method);
  }
  if (selected.length < 3) throw new Error(`${question.questionLanguageId}: fewer than three distinct proportion distractors`);

  const placed: PlacedOption[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === question.correctIndex) {
      placed.push({
        audit: { text: question.answerText, misconceptionId: "CORRECT", isCorrect: true },
        reason: correctReason(question, input),
      });
      continue;
    }
    const method = selected[wrongIndex++];
    const text = formatLikeCorrect(question, method.value);
    placed.push({
      audit: { text, misconceptionId: method.misconceptionId, isCorrect: false },
      reason: method.reason(text, question.answerText),
    });
  }

  const options = Object.freeze(placed.map((entry) => entry.audit.text));
  const optionAudit = Object.freeze(placed.map((entry) => Object.freeze(entry.audit)));
  const labels = ["A", "B", "C", "D"] as const;
  const optionAnalysis = Object.freeze(placed.map((entry, index): TsdCp001OptionAnalysis => Object.freeze({
    option: labels[index],
    text: entry.audit.text,
    misconceptionId: entry.audit.misconceptionId,
    isCorrect: entry.audit.isCorrect,
    reason: entry.reason,
  })));

  const errors = [...question.validation.errors];
  if (new Set(options).size !== 4) errors.push("Final proportion options are not unique");
  if (options[question.correctIndex] !== question.answerText) errors.push("Final proportion answer key differs");
  if (!optionAudit[question.correctIndex]?.isCorrect) errors.push("Final proportion correct index is invalid");

  return Object.freeze({
    ...question,
    options,
    optionAudit,
    explanation: Object.freeze({ ...question.explanation, optionAnalysis }),
    validation: Object.freeze({
      valid: errors.length === 0,
      errors: Object.freeze(errors),
      warnings: question.validation.warnings,
    }),
  });
}

function clockReason(question: TsdCp001GeneratedQuestion, input: ClockInput, option: TsdCp001OptionAnalysis): string {
  const duration = formatExamNumber(input.durationMinutes);
  if (input.solveMode === "arrivalClockTime") {
    const departure = formatClock(input.departureMinuteOfDay, 0n);
    if (option.misconceptionId === "COPY_GIVEN_CLOCK_TIME" || option.misconceptionId === "USE_GIVEN_DURATION_AS_ANSWER") {
      return `⚠️ ${option.text}: this copies the departure time. Move forward ${duration} minutes: ${departure} + ${duration} minutes = ${question.answerText}.`;
    }
    if (option.misconceptionId === "SUBTRACT_WHEN_ADDITION_IS_REQUIRED") {
      return `⚠️ ${option.text}: this moves backward ${duration} minutes. Arrival requires ${departure} + ${duration} minutes = ${question.answerText}.`;
    }
    return `⚠️ ${option.text}: this uses the wrong AM/PM or day boundary. ${departure} + ${duration} minutes = ${question.answerText}.`;
  }

  const arrival = formatClock(input.arrivalMinuteOfDay, input.arrivalDayOffset);
  if (option.misconceptionId === "COPY_GIVEN_CLOCK_TIME" || option.misconceptionId === "USE_GIVEN_DURATION_AS_ANSWER") {
    return `⚠️ ${option.text}: this copies the arrival time. Move backward ${duration} minutes: ${arrival} − ${duration} minutes = ${question.answerText}.`;
  }
  if (option.misconceptionId === "ADD_WHEN_SUBTRACTION_IS_REQUIRED") {
    return `⚠️ ${option.text}: this moves forward ${duration} minutes. Departure requires ${arrival} − ${duration} minutes = ${question.answerText}.`;
  }
  return `⚠️ ${option.text}: this uses the wrong AM/PM or day boundary. ${arrival} − ${duration} minutes = ${question.answerText}.`;
}

function remodelClock(question: TsdCp001GeneratedQuestion, input: ClockInput): TsdCp001GeneratedQuestion {
  const optionAudit = Object.freeze(question.optionAudit.map((option): TsdCp001OptionAudit => (
    !option.isCorrect && option.misconceptionId === "USE_GIVEN_DURATION_AS_ANSWER"
      ? Object.freeze({ ...option, misconceptionId: "COPY_GIVEN_CLOCK_TIME" })
      : option
  )));
  const optionAnalysis = Object.freeze(question.explanation.optionAnalysis.map((option, index): TsdCp001OptionAnalysis => {
    const audit = optionAudit[index];
    if (audit.isCorrect) return Object.freeze({ ...option, misconceptionId: audit.misconceptionId });
    const aligned = Object.freeze({ ...option, misconceptionId: audit.misconceptionId });
    return Object.freeze({ ...aligned, reason: clockReason(question, input, aligned) });
  }));
  return Object.freeze({
    ...question,
    optionAudit,
    explanation: Object.freeze({ ...question.explanation, optionAnalysis }),
  });
}

export function remodelCp001FinalEditorial(
  question: TsdCp001GeneratedQuestion,
): TsdCp001GeneratedQuestion {
  if (
    question.input.solveMode === "distanceByProportion"
    || question.input.solveMode === "timeByProportion"
    || question.input.solveMode === "speedByProportion"
  ) return rebuildProportion(question, question.input);

  if (
    question.input.solveMode === "arrivalClockTime"
    || question.input.solveMode === "departureClockTime"
  ) return remodelClock(question, question.input);

  return question;
}
