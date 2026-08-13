import { add, divide, equals, isPositive, multiply, rational, subtract } from "../foundation/rational";
import { deriveStrongCp004WrongWorkings } from "./distractor-engine-v2";
import type { TsdCp004CoreInput, TsdCp004CoreSolution, TsdCp004CoreSolveMode } from "./relative-motion-foundation";
import type { TsdCp004WrongWorking } from "./runtime-types";

function uniqueWrongRows(answer: TsdCp004CoreSolution["answer"]) {
  const rows: TsdCp004WrongWorking[] = [];
  const push = (misconceptionId: TsdCp004WrongWorking["misconceptionId"], value: typeof answer, calculation: string, diagnosis: string) => {
    if (!isPositive(value) || equals(value, answer) || rows.some((entry) => equals(entry.value, value))) return;
    rows.push(Object.freeze({ misconceptionId, value, calculation, diagnosis }));
  };
  return { rows, push };
}

export function deriveStrongCp004WrongWorkingsV3(mode: TsdCp004CoreSolveMode, input: TsdCp004CoreInput, solution: TsdCp004CoreSolution): readonly TsdCp004WrongWorking[] {
  if (mode === "findRelativeSpeedFromMeetingTime") {
    const r = solution.answer;
    const half = divide(r, rational(2));
    const { rows, push } = uniqueWrongRows(r);
    push("USE_AVERAGE_SPEED", half, "report one assumed equal-share component", "The learner halves the two-body gap-closing rate and reports one body's assumed share instead of relative speed.");
    push("MULTIPLY_INSTEAD_OF_DIVIDE", multiply(r, rational(2)), "count the combined relative rate twice", "The learner double-counts the two-body effect even though gap divided by time already gives relative speed.");
    push("USE_AVERAGE_SPEED", add(r, half), "add one assumed equal-share component to the full relative rate", "The learner adds an imagined one-body contribution to a rate that already contains both bodies.");
    if (input.speedB) {
      push("COPY_KNOWN_SPEED", input.speedB, "copy the stated individual speed", "The known vehicle's speed is reported even though the target is the rate at which the gap changes.");
      const wrongSign = input.directionCase === "OPPOSITE" ? add(r, input.speedB) : subtract(r, input.speedB);
      if (isPositive(wrongSign)) push("REVERSE_RELATIVE_DECOMPOSITION", wrongSign, "solve an individual speed with the wrong directional sign", "The learner continues past relative speed into an unasked individual-speed calculation and uses the wrong sign.");
      const individual = input.directionCase === "OPPOSITE" ? subtract(r, input.speedB) : add(r, input.speedB);
      if (isPositive(individual)) push("REVERSE_RELATIVE_DECOMPOSITION", individual, "continue to the other vehicle's individual speed", "The learner correctly gets relative speed, but answers a different question by decomposing it into one body's speed.");
    }
    if (rows.length < 3) throw new Error(`${mode}: V3 produced only ${rows.length} strong distractors`);
    return Object.freeze(rows.slice(0, 4));
  }

  if (mode === "findIndividualSpeedFromRelativeSpeedAndOtherSpeed") {
    const relative = input.relativeSpeed!;
    const known = input.unknownBody === "A" ? input.speedB! : input.speedA!;
    const { rows, push } = uniqueWrongRows(solution.answer);
    push("USE_TARGET_RELATIVE_SPEED_AS_BODY_SPEED", relative, "report the relative speed as the unknown body's speed", "The learner stops at relative speed even though the question asks for one vehicle's individual speed.");
    push("COPY_KNOWN_SPEED", known, "copy the stated vehicle speed", "The given individual speed is copied instead of using it to reconstruct the other vehicle's speed.");
    const reversed = input.directionCase === "OPPOSITE" ? add(relative, known) : subtract(known, relative);
    if (isPositive(reversed)) push("REVERSE_RELATIVE_DECOMPOSITION", reversed, "use the opposite add/subtract rule when decomposing relative speed", "The learner applies the final directional decomposition with the wrong sign.");
    push("USE_AVERAGE_SPEED", divide(add(relative, known), rational(2)), "average the relative speed and the stated individual speed", "The learner sees two speed values and averages them instead of using the relative-speed equation.");
    if (rows.length < 3) throw new Error(`${mode}: V3 produced only ${rows.length} strong distractors`);
    return Object.freeze(rows.slice(0, 4));
  }

  if (mode === "findFasterSpeedFromCatchUpState" || mode === "findSlowerSpeedFromCatchUpState") {
    const closing = divide(input.headStartDistance!, input.meetingTime!);
    const known = mode === "findFasterSpeedFromCatchUpState" ? input.speedB! : input.speedA!;
    const { rows, push } = uniqueWrongRows(solution.answer);
    push("USE_TARGET_RELATIVE_SPEED_AS_BODY_SPEED", closing, "report head-start distance divided by catch-up time as the requested vehicle speed", "The learner correctly obtains closing speed but stops before converting it to the requested individual speed.");
    push("COPY_KNOWN_SPEED", known, "copy the stated vehicle speed", "The known vehicle's speed is returned instead of reconstructing the unknown speed from the closing-speed relation.");
    const reversed = mode === "findFasterSpeedFromCatchUpState" ? subtract(known, closing) : add(known, closing);
    if (isPositive(reversed)) push("REVERSE_RELATIVE_DECOMPOSITION", reversed, "reverse the final add/subtract relation", "The closing speed is correct, but the learner applies the individual-speed reconstruction with the wrong sign.");
    push("USE_AVERAGE_SPEED", divide(add(known, closing), rational(2)), "average the known speed and the closing speed", "The learner averages the two available speed quantities instead of applying the same-direction relative-speed equation.");
    if (rows.length < 3) throw new Error(`${mode}: V3 produced only ${rows.length} strong distractors`);
    return Object.freeze(rows.slice(0, 4));
  }

  if (mode === "findStartDelayFromCatchUpState") {
    const pursuit = input.meetingTime!;
    const faster = input.speedA!;
    const slower = input.speedB!;
    const closing = subtract(faster, slower);
    const headStart = multiply(closing, pursuit);
    const { rows, push } = uniqueWrongRows(solution.answer);
    push("TREAT_DELAY_AS_PURSUIT_TIME", pursuit, "copy the pursuit duration as the earlier start delay", "The learner treats the time spent chasing as if it were the time advantage enjoyed by the slower vehicle before pursuit began.");
    push("USE_ONE_SPEED_ONLY", divide(headStart, faster), "divide the reconstructed head-start distance by the faster vehicle's speed", "The earlier lead was built by the slower vehicle, but the learner divides by the pursuer's speed instead.");
    push("USE_SUM_INSTEAD_OF_DIFFERENCE", divide(multiply(add(faster, slower), pursuit), slower), "use the sum of speeds during the pursuit before converting distance back to a delay", "Same-direction pursuit is treated as opposite-direction motion, inflating the reconstructed head-start distance.");
    push("IGNORE_START_DELAY", divide(multiply(faster, pursuit), slower), "treat the pursuer's entire chase distance as the earlier vehicle's head-start distance", "The learner ignores that both vehicles move during pursuit and converts the faster vehicle's full chase distance into a start delay.");
    if (rows.length < 3) throw new Error(`${mode}: V3 produced only ${rows.length} strong distractors`);
    return Object.freeze(rows.slice(0, 4));
  }

  return deriveStrongCp004WrongWorkings(mode, input, solution);
}
