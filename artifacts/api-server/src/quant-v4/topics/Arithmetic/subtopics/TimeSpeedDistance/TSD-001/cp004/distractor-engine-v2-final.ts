import { add, divide, equals, isPositive, multiply, rational, subtract } from "../foundation/rational";
import { deriveStrongCp004WrongWorkings } from "./distractor-engine-v2";
import type { TsdCp004CoreInput, TsdCp004CoreSolution, TsdCp004CoreSolveMode } from "./relative-motion-foundation";
import type { TsdCp004WrongWorking } from "./runtime-types";

export function deriveStrongCp004WrongWorkingsFinal(
  mode: TsdCp004CoreSolveMode,
  input: TsdCp004CoreInput,
  solution: TsdCp004CoreSolution,
): readonly TsdCp004WrongWorking[] {
  if (mode !== "findRelativeSpeedFromMeetingTime") return deriveStrongCp004WrongWorkings(mode, input, solution);

  const relativeSpeed = solution.answer;
  const rows: TsdCp004WrongWorking[] = [];
  const push = (row: TsdCp004WrongWorking) => {
    if (!isPositive(row.value) || equals(row.value, relativeSpeed) || rows.some((entry) => equals(entry.value, row.value))) return;
    rows.push(Object.freeze(row));
  };

  push({
    misconceptionId: "USE_AVERAGE_SPEED",
    value: divide(relativeSpeed, rational(2)),
    calculation: "treat half of the gap-closing rate as the requested relative speed",
    diagnosis: "The learner assumes equal contribution and reports one body's share instead of the two-body relative speed.",
  });
  push({
    misconceptionId: "MULTIPLY_INSTEAD_OF_DIVIDE",
    value: multiply(relativeSpeed, rational(2)),
    calculation: "count the already-combined relative rate twice",
    diagnosis: "The learner double-counts the two-body contribution after the gap/time calculation has already produced relative speed.",
  });

  if (input.speedB) {
    push({
      misconceptionId: "COPY_KNOWN_SPEED",
      value: input.speedB,
      calculation: "copy the stated individual speed",
      diagnosis: "The learner reports the known vehicle's speed even though the question asks for the rate at which the gap changes.",
    });
    const wrongSignIndividual = input.directionCase === "OPPOSITE"
      ? add(relativeSpeed, input.speedB)
      : subtract(relativeSpeed, input.speedB);
    if (isPositive(wrongSignIndividual)) push({
      misconceptionId: "REVERSE_RELATIVE_DECOMPOSITION",
      value: wrongSignIndividual,
      calculation: "continue from relative speed to an individual speed using the wrong directional sign",
      diagnosis: "The learner solves an unasked individual-speed problem and also applies the wrong add/subtract decomposition.",
    });
    const individual = input.directionCase === "OPPOSITE"
      ? subtract(relativeSpeed, input.speedB)
      : add(relativeSpeed, input.speedB);
    if (isPositive(individual)) push({
      misconceptionId: "REVERSE_RELATIVE_DECOMPOSITION",
      value: individual,
      calculation: "continue from relative speed to the other vehicle's individual speed",
      diagnosis: "The gap/time step is correct, but the learner continues solving for one vehicle instead of stopping at relative speed.",
    });
  }

  if (rows.length < 3) throw new Error(`${mode}: final V2 engine produced only ${rows.length} discriminating distractors`);
  return Object.freeze(rows.slice(0, 4));
}
