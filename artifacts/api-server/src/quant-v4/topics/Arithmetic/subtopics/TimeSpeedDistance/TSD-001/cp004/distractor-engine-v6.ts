import { add, divide, equals, isPositive, multiply, rational, subtract } from "../foundation/rational";
import { deriveStrongCp004WrongWorkingsV5 } from "./distractor-engine-v5";
import type { TsdCp004CoreInput, TsdCp004CoreSolution, TsdCp004CoreSolveMode } from "./relative-motion-foundation";
import type { TsdCp004WrongWorking } from "./runtime-types";

function rowsFor(answer: TsdCp004CoreSolution["answer"]) {
  const rows: TsdCp004WrongWorking[] = [];
  const push = (
    misconceptionId: TsdCp004WrongWorking["misconceptionId"],
    value: typeof answer,
    calculation: string,
    diagnosis: string,
  ) => {
    if (!isPositive(value) || equals(value, answer) || rows.some((entry) => equals(entry.value, value))) return;
    rows.push(Object.freeze({ misconceptionId, value, calculation, diagnosis }));
  };
  return { rows, push };
}

function sameDirectionDuration(mode: TsdCp004CoreSolveMode, input: TsdCp004CoreInput) {
  if (mode === "findRelativeDistanceCoveredInGivenTime") return input.elapsedTime!;
  return input.meetingTime!;
}

export function deriveStrongCp004WrongWorkingsV6(
  mode: TsdCp004CoreSolveMode,
  input: TsdCp004CoreInput,
  solution: TsdCp004CoreSolution,
): readonly TsdCp004WrongWorking[] {
  const sameDirectionDistanceMode =
    mode === "findHeadStartDistanceFromCatchUpTime" ||
    ((mode === "findInitialSeparationFromMeetingTime" || mode === "findUnknownStartPointGap" || mode === "findRelativeDistanceCoveredInGivenTime") && input.directionCase === "SAME");

  if (sameDirectionDistanceMode) {
    const faster = input.speedA!;
    const slower = input.speedB!;
    const time = sameDirectionDuration(mode, input);
    const averageSpeed = divide(add(faster, slower), rational(2));
    const halfClosingRate = subtract(faster, averageSpeed);
    const { rows, push } = rowsFor(solution.answer);
    push("USE_ONE_SPEED_ONLY", multiply(slower, time), "slower vehicle speed × time", "The learner converts the slower vehicle's own travel distance into the original lead instead of using the distance gained by the faster vehicle.");
    push("USE_AVERAGE_SPEED", multiply(averageSpeed, time), "average of the two speeds × time", "The average absolute speed is incorrectly treated as the rate at which the relative gap changes over the stated time.");
    push("USE_AVERAGE_SPEED", multiply(halfClosingRate, time), "(faster speed − average speed) × time", "The learner compares the faster speed with the average speed, which uses only half of the true closing rate and therefore understates the reconstructed gap.");
    push("USE_ONE_SPEED_ONLY", multiply(faster, time), "faster vehicle speed × time", "The faster vehicle's full travelled distance is mistaken for the distance it gained on the vehicle ahead.");
    if (rows.length < 3) throw new Error(`${mode}: V6 produced only ${rows.length} competitive same-direction distance distractors`);
    return Object.freeze(rows);
  }

  return deriveStrongCp004WrongWorkingsV5(mode, input, solution);
}
