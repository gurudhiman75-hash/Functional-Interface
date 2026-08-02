import { divide, rational } from "../foundation/rational";
import { convertTime } from "../foundation/units";
import type { TsdCp001Solution, TsdCp001SolveInput } from "./canonical-solver";
import type { DisplayContract } from "./runtime-types";
import { formatAnswer, formatExamNumber } from "./runtime-support";

type PaceInput = Extract<
  TsdCp001SolveInput,
  { solveMode: "speedFromPace" | "paceFromSpeed" | "distanceFromPaceAndTime" }
>;

export function paceWorkingLines(
  input: PaceInput,
  solution: TsdCp001Solution,
  display: DisplayContract,
): readonly string[] {
  const answer = formatAnswer(solution, display);

  if (input.solveMode === "speedFromPace") {
    if (input.outputUnit === "KMPH" && input.paceUnit === "MINUTE_PER_KM") {
      return [
        "The pace tells us how many minutes are needed for 1 km.",
        `Speed in km/h = 60 ÷ ${formatExamNumber(input.pace)}`,
        `= ${answer}`,
      ];
    }
    if (input.outputUnit === "MPS" && input.paceUnit === "SECOND_PER_KM") {
      return [
        "One kilometre is 1000 metres, so divide 1000 metres by the seconds taken.",
        `Speed = 1000 ÷ ${formatExamNumber(input.pace)}`,
        `= ${answer}`,
      ];
    }
    return [
      display.formula,
      `The converted speed is ${answer}`,
    ];
  }

  if (input.solveMode === "paceFromSpeed") {
    if (input.outputUnit === "MINUTE_PER_KM" && input.speedUnit === "KMPH") {
      return [
        "At the given km/h speed, divide 60 minutes by the kilometres covered in one hour.",
        `Minutes per km = 60 ÷ ${formatExamNumber(input.speed)}`,
        `= ${answer}`,
      ];
    }
    if (input.outputUnit === "SECOND_PER_KM" && input.speedUnit === "MPS") {
      return [
        "One kilometre is 1000 metres, so divide 1000 metres by the metres covered each second.",
        `Seconds per km = 1000 ÷ ${formatExamNumber(input.speed)}`,
        `= ${answer}`,
      ];
    }
    return [
      display.formula,
      `The pace is ${answer}`,
    ];
  }

  const paceTimeUnit = input.paceUnit === "SECOND_PER_KM" ? "SECOND" : "MINUTE";
  const matchingDuration = convertTime(input.duration, input.timeUnit, paceTimeUnit);
  const distanceKm = divide(matchingDuration, input.pace);
  const conversionLine = input.timeUnit === paceTimeUnit
    ? null
    : `${formatExamNumber(input.duration)} ${input.timeUnit.toLowerCase()} = ${formatExamNumber(matchingDuration)} ${paceTimeUnit.toLowerCase()}`;
  const lines: string[] = [];
  if (conversionLine) lines.push(conversionLine);
  lines.push(`Distance in km = ${formatExamNumber(matchingDuration)} ÷ ${formatExamNumber(input.pace)}`);
  lines.push(`= ${formatExamNumber(distanceKm)} km`);
  if (input.outputUnit === "M") {
    lines.push(`${formatExamNumber(distanceKm)} km × 1000 = ${answer}`);
  } else if (input.outputUnit !== "KM") {
    lines.push(`${formatExamNumber(distanceKm)} km = ${answer}`);
  }
  if (lines.length < 3) lines.unshift("Divide the total time by the time needed for 1 km.");
  return lines;
}
