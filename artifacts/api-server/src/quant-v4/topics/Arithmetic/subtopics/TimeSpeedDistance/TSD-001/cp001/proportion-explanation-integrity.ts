import { divide, toMixedString } from "../foundation/rational";
import type { TsdCp001Solution, TsdCp001SolveInput } from "./canonical-solver";
import type {
  DisplayContract,
  TsdCp001Explanation,
  TsdCp001OptionAnalysis,
} from "./runtime-types";
import { formatAnswer, hashSeed } from "./runtime-support";

function sameRational(
  first: { readonly numerator: bigint; readonly denominator: bigint },
  second: { readonly numerator: bigint; readonly denominator: bigint },
): boolean {
  return first.numerator === second.numerator && first.denominator === second.denominator;
}

export function proportionWorkingLines(
  input: TsdCp001SolveInput,
  solution: TsdCp001Solution,
  display: DisplayContract,
): readonly string[] | null {
  const answer = formatAnswer(solution, display);

  if (input.solveMode === "distanceByProportion") {
    const referenceSpeed = divide(input.knownDistance, input.knownTime);
    return Object.freeze([
      "Use the speed stated for the target journey, not automatically the speed of the reference journey.",
      `Reference speed = ${toMixedString(input.knownDistance)} ÷ ${toMixedString(input.knownTime)}`,
      `= ${toMixedString(referenceSpeed)} km/h`,
      `Target speed = ${toMixedString(input.targetSpeed)} km/h`,
      `Required distance = ${toMixedString(input.targetSpeed)} × ${toMixedString(input.targetTime)}`,
      `= ${answer}`,
    ]);
  }

  if (input.solveMode === "timeByProportion") {
    const referenceSpeed = divide(input.knownDistance, input.knownTime);
    return Object.freeze([
      "Use the speed stated for the target journey when calculating its travelling time.",
      `Reference speed = ${toMixedString(input.knownDistance)} ÷ ${toMixedString(input.knownTime)}`,
      `= ${toMixedString(referenceSpeed)} km/h`,
      `Target speed = ${toMixedString(input.targetSpeed)} km/h`,
      `Required time = ${toMixedString(input.targetDistance)} ÷ ${toMixedString(input.targetSpeed)}`,
      `= ${answer}`,
    ]);
  }

  return null;
}

function distanceOptionReason(
  input: Extract<TsdCp001SolveInput, { readonly solveMode: "distanceByProportion" }>,
  option: TsdCp001OptionAnalysis,
): string {
  const operation = `${toMixedString(input.targetSpeed)} km/h × ${toMixedString(input.targetTime)} hours`;
  if (option.isCorrect) {
    return `✅ ${option.text}: ${operation} gives this target-journey distance.`;
  }
  if (option.misconceptionId === "IGNORE_SPEED_CHANGE") {
    return `⚠️ ${option.text}: this uses the reference speed instead of the stated target speed of ${toMixedString(input.targetSpeed)} km/h.`;
  }
  if (option.misconceptionId === "IGNORE_TIME_CHANGE") {
    return `⚠️ ${option.text}: this repeats a reference value instead of applying the target time of ${toMixedString(input.targetTime)} hours.`;
  }
  if (option.misconceptionId === "INVERT_REQUIRED_RATIO") {
    return `⚠️ ${option.text}: this reverses a speed or time scale factor; directly evaluating ${operation} gives a different distance.`;
  }
  return `⚠️ ${option.text}: it is not the result of ${operation}.`;
}

function timeOptionReason(
  input: Extract<TsdCp001SolveInput, { readonly solveMode: "timeByProportion" }>,
  option: TsdCp001OptionAnalysis,
): string {
  const operation = `${toMixedString(input.targetDistance)} km ÷ ${toMixedString(input.targetSpeed)} km/h`;
  if (option.isCorrect) {
    return `✅ ${option.text}: ${operation} gives this target-journey time.`;
  }
  if (option.misconceptionId === "IGNORE_SPEED_CHANGE") {
    return `⚠️ ${option.text}: this uses the reference speed instead of the stated target speed of ${toMixedString(input.targetSpeed)} km/h.`;
  }
  if (option.misconceptionId === "IGNORE_DISTANCE_CHANGE") {
    return `⚠️ ${option.text}: this ignores the target distance of ${toMixedString(input.targetDistance)} km.`;
  }
  if (option.misconceptionId === "INVERT_REQUIRED_RATIO") {
    return `⚠️ ${option.text}: this reverses the required distance or speed factor; directly evaluating ${operation} gives a different time.`;
  }
  return `⚠️ ${option.text}: it is not the result of ${operation}.`;
}

function replaceOuterSteps(
  explanation: TsdCp001Explanation,
  lead: string,
  interpretation: string,
): readonly string[] {
  const steps = [...explanation.stepByStepSolution];
  if (steps.length === 0) return Object.freeze([lead, ...explanation.working, interpretation]);
  steps[0] = lead;
  steps[steps.length - 1] = interpretation;
  return Object.freeze(steps);
}

export function remodelProportionExplanation(
  input: TsdCp001SolveInput,
  explanation: TsdCp001Explanation,
  seed: string,
): TsdCp001Explanation {
  const variant = hashSeed(seed) % 3;

  if (input.solveMode === "distanceByProportion") {
    const changedSpeed = !sameRational(input.knownSpeed, input.targetSpeed);
    const concept = "For the target journey, distance equals the stated target speed multiplied by the target time.";
    const changedLeads = [
      "First identify the target journey values: its stated speed must be multiplied by its stated travelling time.",
      "The target speed differs from the reference speed, so use the target speed explicitly in the final multiplication.",
      "Treat the first trip as reference data, but calculate the second distance from the second trip's own speed and time.",
    ] as const;
    const sameSpeedLeads = [
      "The target speed matches the reference speed; multiply this common speed by the target time.",
      "Although the speed is unchanged here, the target distance must still be calculated from target speed × target time.",
      "Use the shared speed with the new journey duration to obtain the target distance.",
    ] as const;
    const lead = changedSpeed ? changedLeads[variant] : sameSpeedLeads[variant];
    const interpretation = `Therefore, at ${toMixedString(input.targetSpeed)} km/h for ${toMixedString(input.targetTime)} hours, the target distance is ${explanation.conclusion.replace(/^Answer:\s*/, "").replace(/\.$/, "")}.`;
    return Object.freeze({
      ...explanation,
      keyRule: `📌 Main Rule: ${concept}`,
      stepByStepSolution: replaceOuterSteps(explanation, lead, interpretation),
      examSpeedShortcut: "⚡ Exam Speed Trick: Read the target speed and target time directly, then multiply them.",
      optionAnalysis: Object.freeze(explanation.optionAnalysis.map((option) => Object.freeze({
        ...option,
        reason: distanceOptionReason(input, option),
      }))),
      concept,
      shortcut: "Target distance = target speed × target time.",
      trap: changedSpeed
        ? "Common mistake: carrying the reference speed into a journey that states a different target speed."
        : "Common mistake: repeating the reference distance without applying the target time.",
    });
  }

  if (input.solveMode === "timeByProportion") {
    const changedSpeed = !sameRational(input.knownSpeed, input.targetSpeed);
    const concept = "For the target journey, time equals the target distance divided by the stated target speed.";
    const changedLeads = [
      "Read the target journey separately: divide its target distance by the speed stated for that journey.",
      "The target journey uses a different speed, so divide its target distance by that stated target speed.",
      "The reference trip provides comparison data, but the required time comes from the target distance and target speed.",
    ] as const;
    const sameSpeedLeads = [
      "The target speed matches the reference speed, so divide the target distance by this common speed.",
      "Use the shared speed with the target distance to calculate the second journey's time.",
      "Because both journeys use the same speed here, target time is target distance divided by that speed.",
    ] as const;
    const lead = changedSpeed ? changedLeads[variant] : sameSpeedLeads[variant];
    const interpretation = `Therefore, covering ${toMixedString(input.targetDistance)} km at ${toMixedString(input.targetSpeed)} km/h takes ${explanation.conclusion.replace(/^Answer:\s*/, "").replace(/\.$/, "")}.`;
    return Object.freeze({
      ...explanation,
      keyRule: `📌 Main Rule: ${concept}`,
      stepByStepSolution: replaceOuterSteps(explanation, lead, interpretation),
      examSpeedShortcut: "⚡ Exam Speed Trick: Use target time = target distance ÷ target speed.",
      optionAnalysis: Object.freeze(explanation.optionAnalysis.map((option) => Object.freeze({
        ...option,
        reason: timeOptionReason(input, option),
      }))),
      concept,
      shortcut: "Target time = target distance ÷ target speed.",
      trap: changedSpeed
        ? "Common mistake: dividing by the reference speed even though the target journey states a different speed."
        : "Common mistake: scaling the time without checking the target distance.",
    });
  }

  return explanation;
}
