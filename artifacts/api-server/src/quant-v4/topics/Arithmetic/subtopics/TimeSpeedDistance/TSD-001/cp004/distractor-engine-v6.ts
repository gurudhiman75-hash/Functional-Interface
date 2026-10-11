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

  const recoverFaster =
    mode === "findFasterSpeedFromCatchUpState" ||
    (mode === "findIndividualSpeedFromRelativeSpeedAndOtherSpeed" && input.directionCase === "SAME" && input.unknownBody === "A");

  if (recoverFaster) {
    const slower = input.speedB!;
    const closing = mode === "findFasterSpeedFromCatchUpState"
      ? divide(input.headStartDistance!, input.meetingTime!)
      : input.relativeSpeed!;
    const { rows, push } = rowsFor(solution.answer);
    push("COPY_KNOWN_SPEED", slower, "copy the known slower speed", "The learner stops at the given speed and never incorporates the closing speed needed to recover the faster vehicle's actual speed.");
    push("USE_AVERAGE_SPEED", add(slower, divide(closing, rational(2))), "slower speed + half of closing speed", "Only half of the reconstructed closing speed is added to the slower vehicle, so the final individual-speed decomposition is incomplete.");
    push("REVERSE_RELATIVE_DECOMPOSITION", add(slower, multiply(closing, rational(2))), "slower speed + twice the closing speed", "The learner double-counts the relative-speed component while converting the catch-up state back into the faster vehicle's speed.");
    push("USE_TARGET_RELATIVE_SPEED_AS_BODY_SPEED", closing, "report closing speed as the faster vehicle's speed", "The relative speed is treated as an absolute vehicle speed instead of being combined with the known slower speed.");
    if (rows.length < 3) throw new Error(`${mode}: V6 produced only ${rows.length} competitive faster-speed distractors`);
    return Object.freeze(rows);
  }

  if (mode === "findDelayedStartCatchUpTime") {
    const faster = input.speedA!;
    const slower = input.speedB!;
    const delay = input.startDelay!;
    const headStart = multiply(slower, delay);
    const averageSpeed = divide(add(faster, slower), rational(2));
    const halfClosingRate = subtract(faster, averageSpeed);
    const { rows, push } = rowsFor(solution.answer);
    push("TREAT_DELAY_AS_PURSUIT_TIME", delay, "copy the departure delay as the pursuit time", "The learner confuses the time used to create the head start with the later interval during which the faster vehicle closes that head start.");
    push("USE_ONE_SPEED_ONLY", divide(headStart, faster), "head-start distance ÷ faster vehicle speed", "The vehicle ahead is incorrectly treated as stationary once the pursuit begins, so the pursuer's full speed is used instead of closing speed.");
    push("USE_AVERAGE_SPEED", divide(headStart, averageSpeed), "head-start distance ÷ average vehicle speed", "The learner uses average absolute speed as though it were the same-direction gap-closing rate.");
    push("USE_AVERAGE_SPEED", divide(headStart, halfClosingRate), "head-start distance ÷ (faster speed − average speed)", "The learner compares the pursuer with the average speed, using only half of the true closing rate and therefore overestimating pursuit time.");
    if (rows.length < 3) throw new Error(`${mode}: V6 produced only ${rows.length} competitive delayed-start catch-up distractors`);
    return Object.freeze(rows);
  }

  if (mode === "findStartDelayFromCatchUpState") {
    const faster = input.speedA!;
    const slower = input.speedB!;
    const pursuitTime = input.meetingTime!;
    const closing = subtract(faster, slower);
    const trueLead = multiply(closing, pursuitTime);
    const halfClosing = divide(closing, rational(2));
    const averageSpeed = divide(add(faster, slower), rational(2));
    const { rows, push } = rowsFor(solution.answer);
    push("TREAT_DELAY_AS_PURSUIT_TIME", pursuitTime, "copy the pursuit duration as the earlier departure delay", "The learner treats the time spent chasing as equal to the time by which the slower vehicle originally departed earlier.");
    push("USE_ONE_SPEED_ONLY", divide(trueLead, faster), "reconstructed lead ÷ faster vehicle speed", "The lead was created by the slower vehicle before pursuit began, so dividing it by the faster vehicle's speed reconstructs the wrong departure delay.");
    push("USE_AVERAGE_SPEED", divide(multiply(halfClosing, pursuitTime), slower), "half-closing-speed lead ÷ slower speed", "Only half of the true closing rate is used to reconstruct the lead, causing the earlier-start interval to be understated.");
    push("USE_AVERAGE_SPEED", divide(trueLead, averageSpeed), "reconstructed lead ÷ average vehicle speed", "The learner converts the lead back to a delay using average speed instead of the speed of the vehicle that actually built the lead before pursuit started.");
    if (rows.length < 3) throw new Error(`${mode}: V6 produced only ${rows.length} competitive start-delay distractors`);
    return Object.freeze(rows);
  }

  return deriveStrongCp004WrongWorkingsV5(mode, input, solution);
}
