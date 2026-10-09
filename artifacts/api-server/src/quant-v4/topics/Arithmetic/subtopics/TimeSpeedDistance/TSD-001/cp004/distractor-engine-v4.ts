import { add, divide, equals, isPositive, rational, subtract } from "../foundation/rational";
import { deriveStrongCp004WrongWorkingsV3 } from "./distractor-engine-v3";
import type { TsdCp004CoreInput, TsdCp004CoreSolution, TsdCp004CoreSolveMode } from "./relative-motion-foundation";
import type { TsdCp004WrongWorking } from "./runtime-types";

export function deriveStrongCp004WrongWorkingsV4(
  mode: TsdCp004CoreSolveMode,
  input: TsdCp004CoreInput,
  solution: TsdCp004CoreSolution,
): readonly TsdCp004WrongWorking[] {
  if (mode !== "findSpeedNeededToAvoidOrCauseMeeting") {
    return deriveStrongCp004WrongWorkingsV3(mode, input, solution);
  }

  const requiredRelative = divide(input.initialSeparation!, input.targetTime!);
  const known = input.speedB!;
  const rows: TsdCp004WrongWorking[] = [];
  const push = (
    misconceptionId: TsdCp004WrongWorking["misconceptionId"],
    value: typeof solution.answer,
    calculation: string,
    diagnosis: string,
  ) => {
    if (!isPositive(value) || equals(value, solution.answer) || rows.some((entry) => equals(entry.value, value))) return;
    rows.push(Object.freeze({ misconceptionId, value, calculation, diagnosis }));
  };

  push(
    "USE_TARGET_RELATIVE_SPEED_AS_BODY_SPEED",
    requiredRelative,
    "report gap divided by target time as the requested vehicle speed",
    "The learner stops at the required relative speed and forgets to decompose it into the unknown vehicle's individual speed.",
  );
  push(
    "COPY_KNOWN_SPEED",
    known,
    "copy the already-known vehicle speed",
    "The stated vehicle speed is returned even though the question asks for the other vehicle's required speed.",
  );

  const reversed = input.directionCase === "OPPOSITE"
    ? add(requiredRelative, known)
    : subtract(requiredRelative, known);
  if (isPositive(reversed)) {
    push(
      "REVERSE_TARGET_DECOMPOSITION",
      reversed,
      "apply the opposite directional sign when converting required relative speed to individual speed",
      "The learner uses the pursuit decomposition for an opposite-direction meeting, or the opposite-direction decomposition for pursuit.",
    );
  }

  push(
    "USE_AVERAGE_SPEED",
    divide(add(requiredRelative, known), rational(2)),
    "average the required relative speed and the known vehicle speed",
    "The learner averages two speed quantities instead of solving the direction-specific relative-speed equation.",
  );

  const halfContribution = input.directionCase === "SAME"
    ? add(known, divide(requiredRelative, rational(2)))
    : subtract(requiredRelative, divide(known, rational(2)));
  if (isPositive(halfContribution)) {
    push(
      "USE_AVERAGE_SPEED",
      halfContribution,
      "apply only half of one vehicle's contribution when decomposing the required relative speed",
      "The learner incorrectly splits the closing contribution between both vehicles even though one vehicle's full speed is already known.",
    );
  }

  if (rows.length < 3) throw new Error(`${mode}: V4 produced only ${rows.length} strong distractors`);
  return Object.freeze(rows.slice(0, 4));
}
