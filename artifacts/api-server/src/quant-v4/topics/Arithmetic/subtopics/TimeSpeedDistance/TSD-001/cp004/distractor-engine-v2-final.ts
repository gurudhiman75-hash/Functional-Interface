import { deriveStrongCp004WrongWorkingsV3 } from "./distractor-engine-v3";
import type { TsdCp004CoreInput, TsdCp004CoreSolution, TsdCp004CoreSolveMode } from "./relative-motion-foundation";
import type { TsdCp004WrongWorking } from "./runtime-types";

export function deriveStrongCp004WrongWorkingsFinal(
  mode: TsdCp004CoreSolveMode,
  input: TsdCp004CoreInput,
  solution: TsdCp004CoreSolution,
): readonly TsdCp004WrongWorking[] {
  return deriveStrongCp004WrongWorkingsV3(mode, input, solution);
}
