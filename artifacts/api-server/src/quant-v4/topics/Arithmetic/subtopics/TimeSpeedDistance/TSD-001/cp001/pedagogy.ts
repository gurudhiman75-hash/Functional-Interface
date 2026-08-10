import type { TsdCp001SolveInput } from "./canonical-solver";
import type { TsdCp001DiscoveryAuthority } from "./discovery-registry";
import type {
  DisplayContract,
  TsdCp001Explanation,
  TsdCp001OptionAnalysis,
  TsdCp001OptionAudit,
} from "./runtime-types";
import { conceptFor, hashSeed, humanizeMisconception, trailingSeedOrdinal } from "./runtime-support";

const OPTION_LABELS = ["A", "B", "C", "D"] as const;
const UNIT_PATTERN =
  "km\\/h|m\\/s|m\\/min|km\\/min|seconds?\\/km|minutes?\\/km|kilometres?|kilometers?|metres?|meters?|centimetres?|centimeters?|millimetres?|millimeters?|seconds?|minutes?|hours?|days?|km|cm|mm|m";

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function texText(value: string): string {
  return value.replace(/\\/g, "\\textbackslash{}").replace(/[{}]/g, (token) => `\\${token}`);
}

function lowerInitial(value: string): string {
  return value.replace(/^./, (letter) => letter.toLowerCase());
}

function rationalNumber(value: { readonly numerator: bigint; readonly denominator: bigint }): number {
  return Number(value.numerator) / Number(value.denominator);
}

function compactNumber(value: number): string {
  if (!Number.isFinite(value)) return "the wrong value";
  const rounded = Math.round(value * 1000) / 1000;
  return Number.isInteger(rounded) ? String(rounded) : String(rounded).replace(/0+$/, "").replace(/\.$/, "");
}

function numericOption(text: string): number | null {
  const match = text.match(/^(-?\d+(?:\.\d+)?)(?:\/(\d+))?/);
  if (!match) return null;
  const numerator = Number(match[1]);
  const denominator = match[2] ? Number(match[2]) : 1;
  return denominator === 0 ? null : numerator / denominator;
}

export function editorialStem(input: TsdCp001SolveInput, stem: string, seed: string): string {
  const variant = trailingSeedOrdinal(seed) % 3;

  if (input.solveMode === "distanceFromSpeedAndTime") {
    const match = stem.match(/^(A [^.]+?) travels at (.+?) for (.+?)\. Find the distance covered in metres\.$/i);
    if (match) {
      const [, actor, speed, time] = match;
      const lowerActor = lowerInitial(actor);
      return [
        `${actor} maintains a constant speed of ${speed} for ${time}. What distance is covered in metres?`,
        `During a timed journey, ${lowerActor} moves at ${speed} for ${time}. Find the distance covered in metres.`,
        `${actor} moves steadily at ${speed} over a period of ${time}. How many metres does it cover?`,
      ][variant];
    }
  }

  if (input.solveMode === "speedFromDistanceAndTime") {
    const match = stem.match(/^(A [^.]+?) covers (.+?) in (.+?)\. Find the speed in m\/s\.$/i);
    if (match) {
      const [, actor, distance, time] = match;
      const lowerActor = lowerInitial(actor);
      return [
        `${actor} covers ${distance} in ${time}. What is its speed in m/s?`,
        `During a timed run, ${lowerActor} covers ${distance} in ${time}. Find the speed in m/s.`,
        `${actor} completes ${distance} in ${time} at a constant speed. What is the speed in m/s?`,
      ][variant];
    }
  }

  if (input.solveMode === "timeFromDistanceAndSpeed") {
    const match = stem.match(/^(A [^.]+?) covers (.+?) at (.+?)\. Find the time taken in seconds\.$/i);
    if (match) {
      const [, actor, distance, speed] = match;
      const lowerActor = lowerInitial(actor);
      return [
        `${actor} must cover ${distance} at ${speed}. How many seconds will the journey take?`,
        `At a steady speed of ${speed}, ${lowerActor} covers ${distance}. Find the time taken in seconds.`,
        `${actor} travels ${distance} at ${speed}. What is the journey time in seconds?`,
      ][variant];
    }
  }

  if (input.solveMode === "requiredUniformSpeedForDeadline") {
    const match = stem.match(/^A car starts at (.+?) and has to cover (.+?) km by (.+?)\. Find the minimum speed required\.$/i);
    if (match) {
      const [, departure, distance, deadline] = match;
      return [
        `A commuter leaves at ${departure} and must cover ${distance} km by ${deadline}. What uniform speed is needed?`,
        `A car must cover ${distance} km between ${departure} and ${deadline}. Find the minimum constant speed required.`,
        `To arrive by ${deadline}, a car starting at ${departure} must travel ${distance} km. What speed should it maintain?`,
      ][variant];
    }
  }

  return stem;
}

export function inlineMathText(value: string): string {
  let output = value;
  output = output.replace(
    /\b(\d{1,2}:\d{2}\s*(?:AM|PM)(?:\s+next day)?)\b/gi,
    (_match, clock: string) => `\\(\\text{${texText(clock)}}\\)`,
  );
  output = output.replace(
    new RegExp(`\\b(\\d+(?:\\.\\d+)?(?:\\/\\d+)?)(?:\\s+)(${UNIT_PATTERN})\\b`, "gi"),
    (_match, number: string, unit: string) => `\\(${number}\\,\\text{${texText(unit)}}\\)`,
  );
  output = output.replace(
    /\b(\d+):(\d+)\b(?!\s*(?:AM|PM))/g,
    (_match, first: string, second: string) => `\\(${first}:${second}\\)`,
  );
  return output;
}

const MATH_LABELS = [
  "Original distance",
  "Original speed",
  "Required distance",
  "Required speed",
  "Required time",
  "Available time",
  "Journey time",
  "Starting time",
  "Arrival time",
  "Total time",
  "Distance ratio A:B",
  "Speed ratio A:B",
  "Time ratio A:B",
  "Distance ratio",
  "Speed ratio",
  "Time ratio",
  "Minutes per km",
  "Speed in km/h",
  "Distance",
  "Speed",
  "Time",
] as const;
const MATH_LABEL_PATTERN = new RegExp(
  `\\b(${[...MATH_LABELS].sort((first, second) => second.length - first.length).map(escapeRegExp).join("|")})\\b`,
  "gi",
);

export function mathJaxLine(value: string): string {
  if (value.includes("\\(") || value.includes("\\[")) return value;
  if (!/[=×÷+−]|\d+\s*(?:km|m|cm|mm|seconds?|minutes?|hours?|days?)/i.test(value)) {
    return value;
  }

  const commaIndex = value.indexOf(",");
  if (commaIndex >= 0 && value.slice(commaIndex + 1).includes("=")) {
    return `${value.slice(0, commaIndex + 1)} ${mathJaxLine(value.slice(commaIndex + 1).trim())}`;
  }

  let expression = value.replace(
    MATH_LABEL_PATTERN,
    (match) => `\\text{${texText(match)}}`,
  );
  expression = expression
    .replace(/\band\b/gi, "\\text{ and }")
    .replace(/×/g, "\\times")
    .replace(/÷/g, "\\div")
    .replace(/−/g, "-");

  expression = expression.replace(
    /\b(\d{1,2}:\d{2}\s*(?:AM|PM)(?:\s+next day)?)\b/gi,
    (_match, clock: string) => `\\text{${texText(clock)}}`,
  );
  expression = expression.replace(
    new RegExp(`\\b(\\d+(?:\\.\\d+)?(?:\\/\\d+)?)(?:\\s+)(${UNIT_PATTERN})\\b`, "gi"),
    (_match, number: string, unit: string) => `${number}\\,\\text{${texText(unit)}}`,
  );

  return `\\(${expression}\\)`;
}

function uniqueLines(lines: readonly string[]): string[] {
  const result: string[] = [];
  const seen = new Set<string>();
  for (const line of lines) {
    const normalized = line.replace(/\\[()\[\]]/g, "").replace(/\\text\{([^}]*)\}/g, "$1").replace(/\s+/g, " ").trim().toLowerCase();
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(line);
  }
  return result;
}

function teachingLead(input: TsdCp001SolveInput, variant: number): string {
  const choose = (values: readonly [string, string, string]): string => values[variant];
  switch (input.solveMode) {
    case "distanceFromSpeedAndTime":
      return choose([
        "The given speed and time are not yet in matching units. Convert them first; only then should distance be calculated.",
        "Do not multiply the printed numbers immediately. First express speed in metres per second and time in seconds.",
        "This question tests unit handling before multiplication. Make the units compatible and then apply the distance formula.",
      ]);
    case "speedFromDistanceAndTime":
      return choose([
        "Speed tells us how much distance is covered in one unit of time, so distance and time must first be written in compatible units.",
        "Begin with the time conversion where needed. After that, divide the complete distance by the complete duration.",
        "Read the question as distance covered per second: convert the data first and then perform the division.",
      ]);
    case "timeFromDistanceAndSpeed":
      return choose([
        "Time can be found only after distance and speed are expressed in matching units.",
        "First put the distance and speed into one unit system; then divide distance by speed.",
        "The division is the final step, not the first. Check the units before calculating the journey time.",
      ]);
    case "convertSpeedUnit":
    case "convertDistanceUnit":
    case "convertTimeUnit":
      return choose([
        "A conversion changes the numerical value but not the physical quantity. Use the correct relationship between the two units.",
        "Decide whether the target unit is larger or smaller before selecting the conversion factor.",
        "Keep the original quantity unchanged in meaning while rewriting it in the unit requested by the question.",
      ]);
    case "speedFromMixedUnits":
      return choose([
        "Choose distance and time units that naturally produce the speed unit asked in the answer.",
        "The safest method is to convert both quantities into the units contained in the required speed unit before dividing.",
        "Match the numerator and denominator units with the requested answer, and only then calculate speed.",
      ]);
    case "arrivalClockTime":
    case "departureClockTime":
    case "elapsedClockTime":
      return choose([
        "Treat the clock as a continuous timeline and account carefully for complete hours and remaining minutes.",
        "Convert the journey duration into hours and minutes before adding to or subtracting from the clock time.",
        "Work along the timeline in order; this prevents mistakes when the journey crosses an hour boundary or midnight.",
      ]);
    case "compareDistancesAtEqualTime":
    case "compareTimesAtEqualDistance":
    case "compareSpeedsAtEqualTime":
      return choose([
        "Identify the quantity that is common to both travellers. That common factor cancels from the required ratio.",
        "Write the basic formula once for A and once for B; the equal quantity disappears when the two expressions are divided.",
        "The words ‘same time’ or ‘same distance’ are the key. Use them before forming the ratio in the stated A:B order.",
      ]);
    case "distanceRatioFromSpeedAndTimeRatios":
    case "speedRatioFromDistanceAndTimeRatios":
    case "timeRatioFromDistanceAndSpeedRatios":
      return choose([
        "Build the required ratio from the basic distance–speed–time relation instead of combining the given ratios blindly.",
        "Write the formula for A and B separately, then divide corresponding expressions to obtain the requested ratio.",
        "Keep the order A:B unchanged throughout the calculation and use the reciprocal only when division by a ratio is required.",
      ]);
    case "distanceByProportion":
      return choose([
        "Rather than jumping directly to a proportion, first find the speed represented by the original journey.",
        "The bus keeps the same speed. Recover that speed from the known distance and time, then use it for the new duration.",
        "Treat the first journey as the source of the constant speed; once that speed is known, the new distance follows naturally.",
      ]);
    case "timeByProportion":
      return choose([
        "First calculate the unchanged speed from the original journey. The required time is then obtained from the new distance.",
        "The second journey uses the same speed, so recover that speed before trying to find its duration.",
        "Use the old distance and old time to establish the common speed; then ask how long the new distance takes at that speed.",
      ]);
    case "speedByProportion":
      return choose([
        "The route length is unchanged. First calculate the distance covered at the old speed, and then divide that distance by the new time.",
        "Do not compare the two times in isolation. Reconstruct the complete original distance before finding the required speed.",
        "Use the old speed and old duration to recover the common journey distance; that distance must then be covered in the new duration.",
      ]);
    case "speedFromPace":
    case "paceFromSpeed":
    case "distanceFromPaceAndTime":
      return choose([
        "Pace describes the time taken for one kilometre, so connect the given time-per-kilometre with the total time or hourly speed.",
        "Keep in mind that pace and speed move in opposite directions: a smaller pace means a greater speed.",
        "Start from the one-kilometre meaning of pace, then scale it to the quantity asked in the question.",
      ]);
    case "requiredUniformSpeedForDeadline":
      return choose([
        "The deadline gives a fixed time window. Find that window first and then calculate the speed needed to cover the full distance.",
        "Before dividing distance, determine exactly how much travel time is available between departure and arrival.",
        "This is a two-stage question: calculate the available duration in hours, then divide the journey distance by that duration.",
      ]);
    default:
      return choose([
        "Read the quantities carefully and connect them through the basic distance–speed–time relation.",
        "Translate the words into the correct mathematical relationship before substituting numbers.",
        "Work from the known quantities to the unknown one, keeping units and direction of comparison consistent.",
      ]);
  }
}

function interpretationLine(input: TsdCp001SolveInput, answerText: string, variant: number): string {
  const answer = inlineMathText(answerText);
  const alternatives = (first: string, second: string, third: string): string => [first, second, third][variant];
  switch (input.solveMode) {
    case "distanceByProportion":
      return alternatives(
        `Therefore, at the unchanged speed, the bus covers ${answer} in the new time.`,
        `So the distance corresponding to the new duration is ${answer}.`,
        `The same speed carried through the new time gives a distance of ${answer}.`,
      );
    case "timeByProportion":
      return alternatives(
        `Therefore, the new distance requires ${answer} at the unchanged speed.`,
        `So the car needs ${answer} to complete the second journey.`,
        `At the speed found from the original trip, the required travel time is ${answer}.`,
      );
    case "speedByProportion": {
      const sooner = rationalNumber(input.targetTime) < rationalNumber(input.knownTime);
      return alternatives(
        `Therefore, the same route must be covered at ${answer}${sooner ? " because less time is available" : " because more time is available"}.`,
        `The speed that covers the reconstructed distance within the new duration is ${answer}.`,
        `Hence the required constant speed for the unchanged journey is ${answer}.`,
      );
    }
    case "compareDistancesAtEqualTime":
    case "compareTimesAtEqualDistance":
    case "compareSpeedsAtEqualTime":
    case "distanceRatioFromSpeedAndTimeRatios":
    case "speedRatioFromDistanceAndTimeRatios":
    case "timeRatioFromDistanceAndSpeedRatios":
      return alternatives(
        `Thus the requested ratio, kept in the order A:B, is ${answer}.`,
        `After simplifying without changing the A:B order, the ratio is ${answer}.`,
        `Therefore the comparison between A and B is ${answer}.`,
      );
    case "arrivalClockTime":
    case "departureClockTime":
    case "elapsedClockTime":
      return alternatives(
        `Following the clock timeline gives ${answer}.`,
        `After accounting for the complete duration, the required clock result is ${answer}.`,
        `Hence the journey timeline gives ${answer}.`,
      );
    default:
      return alternatives(
        `Therefore, the required answer is ${answer}.`,
        `So the value asked in the question is ${answer}.`,
        `Hence the calculation gives ${answer}.`,
      );
  }
}

function optionReason(input: TsdCp001SolveInput, option: TsdCp001OptionAudit): string {
  if (option.isCorrect) return `✅ Correct: the complete calculation gives ${option.text}.`;
  const optionValue = numericOption(option.text);

  if (optionValue !== null && input.solveMode === "distanceFromSpeedAndTime") {
    if (option.misconceptionId === "MISREAD_SPEED") {
      const impliedSpeed = optionValue / rationalNumber(input.durationSeconds);
      return `⚠️ This uses ${compactNumber(impliedSpeed)} m/s instead of the converted speed ${compactNumber(rationalNumber(input.speedMps))} m/s.`;
    }
    if (option.misconceptionId === "MISREAD_TIME") {
      const impliedTime = optionValue / rationalNumber(input.speedMps);
      return `⚠️ This uses ${compactNumber(impliedTime)} seconds instead of the converted duration ${compactNumber(rationalNumber(input.durationSeconds))} seconds.`;
    }
  }

  if (optionValue !== null && input.solveMode === "speedFromDistanceAndTime") {
    if (option.misconceptionId === "MISREAD_TIME") {
      const impliedTime = rationalNumber(input.distanceMetres) / optionValue;
      return `⚠️ This comes from using about ${compactNumber(impliedTime)} seconds instead of ${compactNumber(rationalNumber(input.durationSeconds))} seconds.`;
    }
    if (option.misconceptionId === "MISREAD_DISTANCE") {
      const impliedDistance = optionValue * rationalNumber(input.durationSeconds);
      return `⚠️ This comes from using ${compactNumber(impliedDistance)} metres instead of ${compactNumber(rationalNumber(input.distanceMetres))} metres.`;
    }
  }

  if (optionValue !== null && input.solveMode === "timeFromDistanceAndSpeed") {
    if (option.misconceptionId === "MISREAD_SPEED") {
      const impliedSpeed = rationalNumber(input.distanceMetres) / optionValue;
      return `⚠️ This comes from using ${compactNumber(impliedSpeed)} m/s instead of ${compactNumber(rationalNumber(input.speedMps))} m/s.`;
    }
    if (option.misconceptionId === "MISREAD_DISTANCE") {
      const impliedDistance = optionValue * rationalNumber(input.speedMps);
      return `⚠️ This comes from using ${compactNumber(impliedDistance)} metres instead of ${compactNumber(rationalNumber(input.distanceMetres))} metres.`;
    }
  }

  if (optionValue !== null && input.solveMode === "distanceByProportion") {
    const oldDistance = rationalNumber(input.knownDistance);
    const oldTime = rationalNumber(input.knownTime);
    const newTime = rationalNumber(input.targetTime);
    const speed = oldDistance / oldTime;
    if (option.misconceptionId === "IGNORE_TIME_CHANGE") {
      return `⚠️ This simply repeats the old distance ${compactNumber(oldDistance)} km although the time changes from ${compactNumber(oldTime)} to ${compactNumber(newTime)} hours.`;
    }
    if (option.misconceptionId === "INVERT_REQUIRED_RATIO") {
      return "⚠️ This applies old time ÷ new time instead of new time ÷ old time, reversing the required change in distance.";
    }
    if (option.misconceptionId === "MISREAD_TIME") {
      return `⚠️ At ${compactNumber(speed)} km/h, this option corresponds to about ${compactNumber(optionValue / speed)} hours, not the stated ${compactNumber(newTime)} hours.`;
    }
  }

  if (optionValue !== null && input.solveMode === "timeByProportion") {
    const oldDistance = rationalNumber(input.knownDistance);
    const oldTime = rationalNumber(input.knownTime);
    const newDistance = rationalNumber(input.targetDistance);
    const speed = oldDistance / oldTime;
    if (option.misconceptionId === "IGNORE_DISTANCE_CHANGE") {
      return `⚠️ This repeats the old time ${compactNumber(oldTime)} hours even though the distance changes from ${compactNumber(oldDistance)} km to ${compactNumber(newDistance)} km.`;
    }
    if (option.misconceptionId === "INVERT_REQUIRED_RATIO") {
      return "⚠️ This uses old distance ÷ new distance, reversing how the travel time should change at the same speed.";
    }
    if (option.misconceptionId === "DIVISION_ERROR") {
      return `⚠️ The unchanged speed is ${compactNumber(speed)} km/h; dividing ${compactNumber(newDistance)} km by that speed does not give ${option.text}.`;
    }
  }

  if (optionValue !== null && input.solveMode === "speedByProportion") {
    const oldSpeed = rationalNumber(input.knownSpeed);
    const oldTime = rationalNumber(input.knownTime);
    const newTime = rationalNumber(input.targetTime);
    const distance = oldSpeed * oldTime;
    if (option.misconceptionId === "IGNORE_TIME_CHANGE") {
      return `⚠️ This keeps the old speed ${compactNumber(oldSpeed)} km/h even though the same ${compactNumber(distance)} km must be covered in ${compactNumber(newTime)} hours.`;
    }
    if (option.misconceptionId === "DIVISION_ERROR") {
      return `⚠️ The original journey covers ${compactNumber(distance)} km. Dividing this by ${compactNumber(newTime)} hours does not give ${option.text}.`;
    }
    if (option.misconceptionId === "MISREAD_TIME") {
      return `⚠️ For the same ${compactNumber(distance)} km, this option implies about ${compactNumber(distance / optionValue)} hours instead of the stated ${compactNumber(newTime)} hours.`;
    }
  }

  if (input.solveMode === "requiredUniformSpeedForDeadline") {
    if (option.misconceptionId === "ADD_ONE_HOUR_TO_INTERVAL") {
      return "⚠️ This treats the available journey time as one hour longer than it really is.";
    }
    if (option.misconceptionId === "DROP_ONE_HOUR_FROM_INTERVAL") {
      return "⚠️ This treats the available journey time as one hour shorter than it really is.";
    }
    if (option.misconceptionId === "MISREAD_TIME") {
      return "⚠️ This uses an incorrect value for the available journey time before dividing the distance.";
    }
  }

  return `⚠️ This option is obtained by ${humanizeMisconception(option.misconceptionId)}.`;
}

export function buildOptionAnalysis(
  input: TsdCp001SolveInput,
  optionAudit: readonly TsdCp001OptionAudit[],
): readonly TsdCp001OptionAnalysis[] {
  return optionAudit.map((option, index) => ({
    option: OPTION_LABELS[index],
    text: option.text,
    isCorrect: option.isCorrect,
    misconceptionId: option.misconceptionId,
    reason: optionReason(input, option),
  }));
}

function learnerConcept(authority: TsdCp001DiscoveryAuthority): string {
  switch (authority.solveMode) {
    case "distanceFromSpeedAndTime":
      return "Convert speed and time into compatible units before using distance = speed × time.";
    case "distanceByProportion":
      return "Find the unchanged speed from the original journey, then multiply it by the new time.";
    case "timeByProportion":
      return "Find the unchanged speed from the original journey, then divide the new distance by that speed.";
    case "speedByProportion":
      return "Find the original journey distance from old speed × old time, then divide that distance by the new time.";
    case "requiredUniformSpeedForDeadline":
      return "Find the available time, convert it to hours, then divide distance by time.";
    default:
      return conceptFor(authority);
  }
}

export function buildFourTierExplanation(
  authority: TsdCp001DiscoveryAuthority,
  input: TsdCp001SolveInput,
  display: DisplayContract,
  working: readonly string[],
  optionAudit: readonly TsdCp001OptionAudit[],
  answerText: string,
  seed: string,
): TsdCp001Explanation {
  const variant = hashSeed(seed) % 3;
  const concept = learnerConcept(authority);
  const keyRule = `📌 Main Rule: ${concept} ${mathJaxLine(display.formula)}`;
  const lead = teachingLead(input, variant);
  const givenStep = display.givens.length > 0
    ? `Given: ${display.givens.map((given) => inlineMathText(given)).join("; ")}.`
    : "";
  const interpretation = interpretationLine(input, answerText, variant);
  const stepByStepSolution = uniqueLines([
    lead,
    givenStep,
    ...working.map((line) => mathJaxLine(line)),
    interpretation,
  ]);
  const optionAnalysis = buildOptionAnalysis(input, optionAudit);
  const firstWrong = optionAnalysis.find((option) => !option.isCorrect);
  const trap = firstWrong
    ? `Common mistake: ${humanizeMisconception(firstWrong.misconceptionId)}.`
    : "Common mistake: skipping the final check.";

  return {
    keyRule,
    stepByStepSolution,
    examSpeedShortcut: `⚡ Exam Speed Trick: ${display.shortcut}`,
    optionAnalysis,
    concept,
    givens: display.givens,
    working,
    shortcut: display.shortcut,
    trap,
    conclusion: `Answer: ${answerText}.`,
  };
}
