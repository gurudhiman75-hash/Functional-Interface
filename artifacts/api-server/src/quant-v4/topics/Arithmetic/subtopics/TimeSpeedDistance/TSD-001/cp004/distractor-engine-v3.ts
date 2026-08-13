import { add, divide, equals, isPositive, multiply, rational, subtract } from "../foundation/rational";
import { deriveStrongCp004WrongWorkings } from "./distractor-engine-v2";
import type { TsdCp004CoreInput, TsdCp004CoreSolution, TsdCp004CoreSolveMode } from "./relative-motion-foundation";
import type { TsdCp004WrongWorking } from "./runtime-types";

export function deriveStrongCp004WrongWorkingsV3(mode: TsdCp004CoreSolveMode, input: TsdCp004CoreInput, solution: TsdCp004CoreSolution): readonly TsdCp004WrongWorking[] {
  if (mode !== "findRelativeSpeedFromMeetingTime") return deriveStrongCp004WrongWorkings(mode, input, solution);
  const r = solution.answer;
  const half = divide(r, rational(2));
  const rows: TsdCp004WrongWorking[] = [];
  const push = (misconceptionId: TsdCp004WrongWorking["misconceptionId"], value: typeof r, calculation: string, diagnosis: string) => {
    if (!isPositive(value) || equals(value, r) || rows.some((entry) => equals(entry.value, value))) return;
    rows.push(Object.freeze({ misconceptionId, value, calculation, diagnosis }));
  };

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
