import { add, divide, multiply, rational, subtract, toMixedString, type Rational } from "../foundation/rational";
import { convertDistance, convertTime } from "../foundation/units";
import type { TsdCp001Solution, TsdCp001SolveInput } from "./canonical-solver";
import { clockWorkingLines } from "./clock-working";
import { paceWorkingLines } from "./pace-working";
import type { DisplayContract } from "./runtime-types";
import { DISTANCE_LABEL, TIME_LABEL, formatAnswer, formatExamNumber, ratioText, unitForValue, workingLines } from "./runtime-support";

function durationText(minutes: Rational): string {
  if (minutes.denominator !== 1n) return `${formatExamNumber(minutes)} minutes`;
  const total = Number(minutes.numerator);
  const hours = Math.floor(total / 60);
  const remaining = total % 60;
  if (hours === 0) return `${remaining} ${remaining === 1 ? "minute" : "minutes"}`;
  if (remaining === 0) return `${hours} ${hours === 1 ? "hour" : "hours"}`;
  return `${hours} ${hours === 1 ? "hour" : "hours"} ${remaining} ${remaining === 1 ? "minute" : "minutes"}`;
}

export function examWorkingLines(
  input: TsdCp001SolveInput,
  solution: TsdCp001Solution,
  display: DisplayContract,
): readonly string[] {
  const answer = formatAnswer(solution, display);

  switch (input.solveMode) {
    case "distanceByProportion": {
      const originalSpeed = divide(input.knownDistance, input.knownTime);
      return [
        "The speed remains unchanged, so first calculate the speed of the original journey.",
        `Original speed = ${toMixedString(input.knownDistance)} ÷ ${toMixedString(input.knownTime)}`,
        `= ${toMixedString(originalSpeed)} km/h`,
        "Now use this same speed for the new journey time.",
        `Required distance = ${toMixedString(originalSpeed)} × ${toMixedString(input.targetTime)}`,
        `= ${answer}`,
      ];
    }

    case "timeByProportion": {
      const originalSpeed = divide(input.knownDistance, input.knownTime);
      return [
        "The speed remains unchanged, so begin by finding the speed from the original journey.",
        `Original speed = ${toMixedString(input.knownDistance)} ÷ ${toMixedString(input.knownTime)}`,
        `= ${toMixedString(originalSpeed)} km/h`,
        "The new journey is made at this same speed, so time is distance divided by speed.",
        `Required time = ${toMixedString(input.targetDistance)} ÷ ${toMixedString(originalSpeed)}`,
        `= ${answer}`,
      ];
    }

    case "speedByProportion": {
      const originalDistance = multiply(input.knownSpeed, input.knownTime);
      const required = divide(originalDistance, input.targetTime);
      return [
        "The distance is the same in both journeys. First reconstruct the distance covered in the original journey.",
        `Original distance = ${toMixedString(input.knownSpeed)} × ${toMixedString(input.knownTime)}`,
        `= ${toMixedString(originalDistance)} km`,
        "The car must cover this same distance in the new time.",
        `Required speed = ${toMixedString(originalDistance)} ÷ ${toMixedString(input.targetTime)}`,
        `= ${toMixedString(required)} km/h`,
      ];
    }

    case "compareDistancesAtEqualTime":
      return [
        "Both vehicles travel for the same amount of time.",
        "Since distance = speed × time, the common time cancels while forming the ratio.",
        `Distance ratio A:B = ${toMixedString(input.firstSpeed)} : ${toMixedString(input.secondSpeed)}`,
        `= ${answer}`,
      ];

    case "compareTimesAtEqualDistance":
      return [
        "Both vehicles cover the same distance.",
        "Since time = distance ÷ speed, the faster vehicle takes less time; therefore reverse the speed ratio.",
        `Time ratio A:B = ${toMixedString(input.secondSpeed)} : ${toMixedString(input.firstSpeed)}`,
        `= ${answer}`,
      ];

    case "compareSpeedsAtEqualTime":
      return [
        "Both riders travel for the same amount of time.",
        "Since speed = distance ÷ time, the common time cancels while forming the ratio.",
        `Speed ratio A:B = ${toMixedString(input.firstDistance)} : ${toMixedString(input.secondDistance)}`,
        `= ${answer}`,
      ];

    case "distanceRatioFromSpeedAndTimeRatios":
      return [
        "For each traveller, distance is obtained by multiplying speed by time.",
        `Distance ratio A:B = (${ratioText(input.speedRatio)}) × (${ratioText(input.timeRatio)})`,
        "Multiply the first terms together and the second terms together, then simplify.",
        `= ${answer}`,
      ];

    case "speedRatioFromDistanceAndTimeRatios":
      return [
        "Speed is distance divided by time, so divide the distance ratio by the time ratio.",
        `Speed ratio A:B = (${ratioText(input.distanceRatio)}) ÷ (${ratioText(input.timeRatio)})`,
        "Dividing by a ratio means multiplying by its reciprocal.",
        `= ${answer}`,
      ];

    case "timeRatioFromDistanceAndSpeedRatios":
      return [
        "Time is distance divided by speed, so divide the distance ratio by the speed ratio.",
        `Time ratio A:B = (${ratioText(input.distanceRatio)}) ÷ (${ratioText(input.speedRatio)})`,
        "Dividing by a ratio means multiplying by its reciprocal.",
        `= ${answer}`,
      ];

    case "speedFromMixedUnits": {
      if (input.outputUnit === "KMPH" && input.distanceUnit === "M" && input.timeUnit === "SECOND") {
        const distanceMetres = convertDistance(input.distance, input.distanceUnit, "M");
        const durationSeconds = convertTime(input.duration, input.timeUnit, "SECOND");
        const speedMps = divide(distanceMetres, durationSeconds);
        return [
          display.formula,
          `Speed = ${formatExamNumber(distanceMetres)} ÷ ${formatExamNumber(durationSeconds)} = ${formatExamNumber(speedMps)} m/s`,
          `Speed in km/h = ${formatExamNumber(speedMps)} × 18/5`,
          `= ${answer}`,
        ];
      }

      const target = {
        MPS: { distance: "M" as const, time: "SECOND" as const },
        KMPH: { distance: "KM" as const, time: "HOUR" as const },
        M_PER_MINUTE: { distance: "M" as const, time: "MINUTE" as const },
        KM_PER_MINUTE: { distance: "KM" as const, time: "MINUTE" as const },
      }[input.outputUnit];
      const convertedDistance = convertDistance(input.distance, input.distanceUnit, target.distance);
      const convertedTime = convertTime(input.duration, input.timeUnit, target.time);
      const lines: string[] = [display.formula];
      const distanceLine = `${formatExamNumber(input.distance)} ${DISTANCE_LABEL[input.distanceUnit]} = ${formatExamNumber(convertedDistance)} ${DISTANCE_LABEL[target.distance]}`;
      const timeLine = `${formatExamNumber(input.duration)} ${TIME_LABEL[input.timeUnit]} = ${formatExamNumber(convertedTime)} ${TIME_LABEL[target.time]}`;
      if (input.distanceUnit !== target.distance && !display.formula.includes(formatExamNumber(convertedDistance))) lines.push(distanceLine);
      if (input.timeUnit !== target.time && !display.formula.includes(formatExamNumber(convertedTime))) lines.push(timeLine);
      lines.push(`Speed = ${formatExamNumber(convertedDistance)} ÷ ${formatExamNumber(convertedTime)}`);
      lines.push(`= ${answer}`);
      return lines;
    }

    case "distanceFromSpeedAndTime":
    case "speedFromDistanceAndTime":
    case "timeFromDistanceAndSpeed": {
      const base = workingLines(input, solution, display);
      return display.formula !== base[0] ? [display.formula, ...base] : base;
    }

    case "arrivalClockTime":
    case "departureClockTime":
    case "elapsedClockTime":
      return clockWorkingLines(input, answer);

    case "speedFromPace":
    case "paceFromSpeed":
    case "distanceFromPaceAndTime":
      return paceWorkingLines(input, solution, display);

    case "requiredUniformSpeedForDeadline": {
      const absoluteDeadline = add(
        input.deadlineMinuteOfDay,
        multiply(rational(input.deadlineDayOffset), rational(1440)),
      );
      const availableMinutes = subtract(absoluteDeadline, input.departureMinuteOfDay);
      const availableHours = divide(availableMinutes, rational(60));
      const hoursText = `${formatExamNumber(availableHours)} ${unitForValue(availableHours, "hours")}`;
      const journeyText = durationText(availableMinutes);
      const timeLine = journeyText === hoursText
        ? `Available time = ${hoursText}`
        : `Available time = ${journeyText} = ${hoursText}`;
      return [
        timeLine,
        "The complete distance has to be covered inside this available time.",
        `Required speed = ${formatExamNumber(input.distance)} ÷ ${formatExamNumber(availableHours)}`,
        `= ${answer}`,
      ];
    }

    default:
      return workingLines(input, solution, display);
  }
}
