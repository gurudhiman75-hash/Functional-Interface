import { divide } from "../foundation/rational";
import { convertDistance, convertTime } from "../foundation/units";
import type { TsdCp001SolveInput } from "./canonical-solver";
import type { TsdCp001Explanation, TsdCp001OptionAnalysis } from "./runtime-types";
import { formatExamNumber } from "./runtime-support";

type PaceInput = Extract<
  TsdCp001SolveInput,
  { solveMode: "speedFromPace" | "paceFromSpeed" | "distanceFromPaceAndTime" }
>;

function speedFromPaceReason(
  input: Extract<PaceInput, { solveMode: "speedFromPace" }>,
  answer: string,
  option: TsdCp001OptionAnalysis,
): string {
  const pace = formatExamNumber(input.pace);

  if (input.outputUnit === "KMPH" && input.paceUnit === "MINUTE_PER_KM") {
    if (option.misconceptionId === "FAIL_TO_INVERT_PACE") {
      return `⚠️ ${option.text}: it copies ${pace}. Speed is 60 ÷ ${pace} = ${answer}.`;
    }
    if (option.misconceptionId === "MULTIPLY_INSTEAD_OF_DIVIDE") {
      return `⚠️ ${option.text}: it uses 60 × ${pace}; speed requires 60 ÷ ${pace}.`;
    }
    return `⚠️ ${option.text}: 1 ÷ ${pace} gives km/min, not km/h; multiply by 60.`;
  }

  if (input.outputUnit === "MPS" && input.paceUnit === "SECOND_PER_KM") {
    if (option.misconceptionId === "FAIL_TO_INVERT_PACE") {
      return `⚠️ ${option.text}: it copies ${pace}. Speed is 1000 ÷ ${pace} = ${answer}.`;
    }
    if (option.misconceptionId === "REVERSE_DIVISION") {
      return `⚠️ ${option.text}: it calculates ${pace} ÷ 1000; speed requires distance ÷ time, so use 1000 ÷ ${pace}.`;
    }
    return `⚠️ ${option.text}: it treats the given seconds as minutes and divides by 60 again.`;
  }

  if (input.outputUnit === "KMPH") {
    if (option.misconceptionId === "OMIT_UNIT_CONVERSION") {
      return `⚠️ ${option.text}: it stops at metres per second instead of converting the result to km/h.`;
    }
    if (option.misconceptionId === "USE_WRONG_CONVERSION_FACTOR") {
      return `⚠️ ${option.text}: it uses 60 instead of the full 3600 seconds in one hour.`;
    }
  } else {
    if (option.misconceptionId === "OMIT_UNIT_CONVERSION") {
      return `⚠️ ${option.text}: it leaves the rate in metres per minute instead of metres per second.`;
    }
    if (option.misconceptionId === "USE_WRONG_CONVERSION_FACTOR") {
      return `⚠️ ${option.text}: it uses a 60-metre numerator instead of one kilometre = 1000 metres.`;
    }
  }
  return `⚠️ ${option.text}: pace is time per kilometre, so invert it and complete the requested unit conversion.`;
}

function paceFromSpeedReason(
  input: Extract<PaceInput, { solveMode: "paceFromSpeed" }>,
  answer: string,
  option: TsdCp001OptionAnalysis,
): string {
  const speed = formatExamNumber(input.speed);

  if (input.outputUnit === "MINUTE_PER_KM" && input.speedUnit === "KMPH") {
    if (option.misconceptionId === "FAIL_TO_INVERT_PACE") {
      return `⚠️ ${option.text}: it copies ${speed}. Pace is 60 ÷ ${speed} = ${answer}.`;
    }
    if (option.misconceptionId === "MULTIPLY_INSTEAD_OF_DIVIDE") {
      return `⚠️ ${option.text}: it uses 60 × ${speed}; minutes per kilometre requires 60 ÷ ${speed}.`;
    }
    return `⚠️ ${option.text}: 1 ÷ ${speed} gives hours per kilometre; multiply by 60 for minutes per kilometre.`;
  }

  if (input.outputUnit === "SECOND_PER_KM" && input.speedUnit === "MPS") {
    if (option.misconceptionId === "FAIL_TO_INVERT_PACE") {
      return `⚠️ ${option.text}: it copies ${speed}. Pace is 1000 ÷ ${speed} = ${answer}.`;
    }
    if (option.misconceptionId === "USE_WRONG_CONVERSION_FACTOR") {
      return `⚠️ ${option.text}: it uses 100 metres per kilometre; use 1000 metres.`;
    }
    return `⚠️ ${option.text}: it treats the given metres per second as metres per minute and divides by 60 again.`;
  }

  if (input.outputUnit === "MINUTE_PER_KM") {
    if (option.misconceptionId === "OMIT_UNIT_CONVERSION") {
      return `⚠️ ${option.text}: it leaves seconds per kilometre labelled as minutes per kilometre.`;
    }
    if (option.misconceptionId === "USE_WRONG_CONVERSION_FACTOR") {
      return `⚠️ ${option.text}: it uses 60 metres instead of one kilometre = 1000 metres.`;
    }
  } else {
    if (option.misconceptionId === "OMIT_UNIT_CONVERSION") {
      return `⚠️ ${option.text}: it leaves minutes per kilometre labelled as seconds per kilometre.`;
    }
    if (option.misconceptionId === "USE_WRONG_CONVERSION_FACTOR") {
      return `⚠️ ${option.text}: it uses 1000 directly with a km/h speed without converting hours to seconds.`;
    }
  }
  return `⚠️ ${option.text}: pace is time ÷ distance, so invert the speed and complete the requested unit conversion.`;
}

function distanceFromPaceReason(
  input: Extract<PaceInput, { solveMode: "distanceFromPaceAndTime" }>,
  answer: string,
  option: TsdCp001OptionAnalysis,
): string {
  const paceTimeUnit = input.paceUnit === "SECOND_PER_KM" ? "SECOND" : "MINUTE";
  const matchingDuration = convertTime(input.duration, input.timeUnit, paceTimeUnit);
  const duration = formatExamNumber(matchingDuration);
  const pace = formatExamNumber(input.pace);
  const distanceKm = divide(matchingDuration, input.pace);

  if (input.outputUnit === "M") {
    if (option.misconceptionId === "OMIT_UNIT_CONVERSION") {
      return `⚠️ ${option.text}: ${duration} ÷ ${pace} = ${formatExamNumber(distanceKm)} km; the kilometre value was not multiplied by 1000.`;
    }
    if (option.misconceptionId === "REVERSE_DIVISION") {
      const reversedKm = divide(input.pace, matchingDuration);
      const reversedMetres = convertDistance(reversedKm, "KM", "M");
      return `⚠️ ${option.text}: it uses ${pace} ÷ ${duration} = ${formatExamNumber(reversedKm)} km = ${formatExamNumber(reversedMetres)} m; the division is reversed.`;
    }
    return `⚠️ ${option.text}: it copies the total-time number as metres instead of using total time ÷ pace.`;
  }

  if (option.misconceptionId === "USE_FIRST_QUANTITY_ONLY") {
    return `⚠️ ${option.text}: it copies the pace number as distance and ignores the total time.`;
  }
  if (option.misconceptionId === "USE_SECOND_QUANTITY_ONLY") {
    return `⚠️ ${option.text}: it copies the total-time number as distance and ignores the pace.`;
  }
  if (option.misconceptionId === "REVERSE_DIVISION") {
    return `⚠️ ${option.text}: it uses ${pace} ÷ ${duration}; distance requires ${duration} ÷ ${pace} = ${answer}.`;
  }
  return `⚠️ ${option.text}: find distance by dividing total time by time taken for one kilometre.`;
}

function revisedReason(
  input: PaceInput,
  answer: string,
  option: TsdCp001OptionAnalysis,
): string {
  if (option.isCorrect) return option.reason;
  if (input.solveMode === "speedFromPace") return speedFromPaceReason(input, answer, option);
  if (input.solveMode === "paceFromSpeed") return paceFromSpeedReason(input, answer, option);
  return distanceFromPaceReason(input, answer, option);
}

export function remodelPaceOptionFeedback(
  input: TsdCp001SolveInput,
  answerText: string,
  explanation: TsdCp001Explanation,
): TsdCp001Explanation {
  if (
    input.solveMode !== "speedFromPace"
    && input.solveMode !== "paceFromSpeed"
    && input.solveMode !== "distanceFromPaceAndTime"
  ) return explanation;

  return Object.freeze({
    ...explanation,
    optionAnalysis: Object.freeze(explanation.optionAnalysis.map((option) => Object.freeze({
      ...option,
      reason: revisedReason(input, answerText, option),
    }))),
  });
}
