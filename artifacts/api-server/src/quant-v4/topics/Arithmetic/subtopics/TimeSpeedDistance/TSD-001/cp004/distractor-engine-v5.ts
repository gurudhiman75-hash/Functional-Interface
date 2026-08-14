import { add, compare, divide, equals, isPositive, multiply, rational, subtract } from "../foundation/rational";
import { deriveStrongCp004WrongWorkingsV3 } from "./distractor-engine-v3";
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

export function deriveStrongCp004WrongWorkingsV5(
  mode: TsdCp004CoreSolveMode,
  input: TsdCp004CoreInput,
  solution: TsdCp004CoreSolution,
): readonly TsdCp004WrongWorking[] {
  if (mode === "findRelativeSpeedSameDirection") {
    const faster = input.speedA!;
    const slower = input.speedB!;
    const closing = subtract(faster, slower);
    const { rows, push } = rowsFor(solution.answer);
    push("USE_ONE_SPEED_ONLY", slower, "report the slower vehicle's speed as the closing rate", "The learner uses one vehicle's absolute speed instead of the rate at which the faster vehicle gains on it.");
    push("USE_AVERAGE_SPEED", divide(add(faster, slower), rational(2)), "average the two vehicle speeds", "The learner averages the two absolute speeds even though same-direction relative speed is their difference.");
    push("USE_AVERAGE_SPEED", divide(closing, rational(2)), "split the closing speed equally between the two vehicles", "The learner assumes both vehicles contribute equal halves to the gap-closing rate and therefore reports only half of the true closing speed.");
    push("USE_ONE_SPEED_ONLY", faster, "report the faster vehicle's absolute speed", "The faster vehicle's own speed is mistaken for its speed relative to the slower vehicle ahead.");
    if (rows.length < 3) throw new Error(`${mode}: V5 produced only ${rows.length} strong closing-speed distractors`);
    return Object.freeze(rows);
  }

  if (mode === "findSeparationAfterMovingApart") {
    const initial = input.initialSeparation!;
    const time = input.elapsedTime!;
    const a = input.speedA!;
    const b = input.speedB!;
    const difference = compare(a, b) >= 0 ? subtract(a, b) : subtract(b, a);
    const { rows, push } = rowsFor(solution.answer);
    push("USE_DIFFERENCE_INSTEAD_OF_SUM", add(initial, multiply(difference, time)), "initial gap + speed difference × time", "The learner treats two vehicles moving apart as if their separation changed only by the speed difference.");
    push("IGNORE_INITIAL_GAP", multiply(add(a, b), time), "sum of speeds × time", "The learner calculates only the increase in separation and forgets to add the gap that already existed at the start.");
    push("USE_ONE_SPEED_ONLY", add(initial, multiply(a, time)), "initial gap + first vehicle distance", "Only the first vehicle's movement is added to the initial gap, so the other vehicle's contribution is ignored.");
    push("USE_ONE_SPEED_ONLY", add(initial, multiply(b, time)), "initial gap + second vehicle distance", "Only the second vehicle's movement is added to the initial gap, so the first vehicle's contribution is ignored.");
    if (rows.length < 3) throw new Error(`${mode}: V5 produced only ${rows.length} strong separation distractors`);
    return Object.freeze(rows);
  }

  if (mode === "findInitialGapFromLaterSeparation") {
    const later = input.specifiedSeparation!;
    const time = input.elapsedTime!;
    const a = input.speedA!;
    const b = input.speedB!;
    const difference = compare(a, b) >= 0 ? subtract(a, b) : subtract(b, a);
    const { rows, push } = rowsFor(solution.answer);
    push("USE_DIFFERENCE_INSTEAD_OF_SUM", subtract(later, multiply(difference, time)), "later separation − speed difference × time", "The learner removes only the same-direction speed difference from the later gap instead of the full opposite-direction opening rate.");
    push("USE_ONE_SPEED_ONLY", subtract(later, multiply(a, time)), "later separation − first vehicle distance", "The learner subtracts only one vehicle's travelled distance while reconstructing the earlier separation.");
    push("USE_ONE_SPEED_ONLY", subtract(later, multiply(b, time)), "later separation − second vehicle distance", "The learner removes only the second vehicle's travelled distance and leaves the first vehicle's contribution inside the gap.");
    push("IGNORE_INITIAL_GAP", multiply(add(a, b), time), "sum of speeds × elapsed time", "The increase in separation during the interval is mistaken for the separation that existed before the vehicles started moving apart.");
    if (rows.length < 3) throw new Error(`${mode}: V5 produced only ${rows.length} strong inverse-separation distractors`);
    return Object.freeze(rows);
  }

  if (mode === "findTimeUntilSpecifiedSeparation") {
    const initial = input.initialSeparation!;
    const target = input.specifiedSeparation!;
    const a = input.speedA!;
    const b = input.speedB!;
    const same = input.directionCase === "SAME";
    const change = same ? subtract(initial, target) : subtract(target, initial);
    const correctRelative = same ? subtract(a, b) : add(a, b);
    const wrongRelative = same ? add(a, b) : subtract(a, b);
    const { rows, push } = rowsFor(solution.answer);
    push(same ? "USE_SUM_INSTEAD_OF_DIFFERENCE" : "USE_DIFFERENCE_INSTEAD_OF_SUM", divide(change, wrongRelative), "required change in gap ÷ relative speed from the wrong direction rule", "The learner finds the correct change in separation but divides it by the wrong relative-speed rule.");
    push("IGNORE_INITIAL_GAP", divide(target, correctRelative), "target separation ÷ correct relative speed", "The final separation itself is treated as the distance that must be gained or opened, instead of using the change from the initial gap.");
    push("IGNORE_INITIAL_GAP", divide(initial, correctRelative), "initial separation ÷ correct relative speed", "The starting gap is divided by the relative speed even though only the change between the two stated gaps matters.");
    push("REVERSE_RELATIVE_DECOMPOSITION", divide(add(initial, target), correctRelative), "(initial separation + target separation) ÷ relative speed", "The two gap values are added instead of differenced before converting the required change into time.");
    if (rows.length < 3) throw new Error(`${mode}: V5 produced only ${rows.length} strong target-separation distractors`);
    return Object.freeze(rows);
  }

  return deriveStrongCp004WrongWorkingsV3(mode, input, solution);
}
